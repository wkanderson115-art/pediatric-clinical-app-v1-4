"""中国儿科临床药典 PWA 后端。

公开国家药监局网站只提供人工核验入口，不调用未经授权的 NMPA 内部 API。
第三方中文说明书与批文数据库相互独立，不将第三方数据标记为官方核验。
非临床决策支持系统，不产生诊疗或处方医嘱。
"""
import os
import secrets
import re
import json
import hashlib
from collections import Counter
from urllib.parse import urlsplit
from html import unescape
from pathlib import Path
from io import BytesIO
from functools import lru_cache
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException, Query, Request, UploadFile, File, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from app.secure_admin import router as admin_router, get_value, MODEL as DEEPSEEK_MODEL

ROOT = Path(__file__).resolve().parent.parent
WEB = ROOT / "web"
TIANAPI_URL = "https://apis.tianapi.com/yaopin/index"
MOSENG_ROOT = "https://srv-openapi.bcpmdata.com"
MOSENG_INSTRUCTIONS_URL = f"{MOSENG_ROOT}/pharma/general/v1/drug_instruction/list"
MOSENG_APPROVAL_URL = f"{MOSENG_ROOT}/pharma/general/v1/cn_drug_approval/list"
NMPA_URL = "https://datasearch.nmpa.gov.cn/"
NMPA_HELP = "https://datasearch.nmpa.gov.cn/datasearch/search-help.html"
NHC_GUIDE = "https://www.nhc.gov.cn/yzygj/c100068/202509/19e7145436b049a68d4ba8c2060dfa56.shtml"

app = FastAPI(title="儿科临床药典 · 中国版", version="1.12.0", docs_url=None, redoc_url=None)
LEARNING_PATH = ROOT / "data" / "learning.json"
LEARNING = json.loads(LEARNING_PATH.read_text(encoding="utf-8"))
CLINICAL = json.loads((ROOT / "data" / "clinical_extension.json").read_text(encoding="utf-8"))
SOURCES = json.loads((ROOT / "data" / "source_registry.json").read_text(encoding="utf-8"))
QUIZ = json.loads((ROOT / "data" / "quiz_cases.json").read_text(encoding="utf-8"))


def _load_optional_data(name: str, fallback: dict) -> dict:
    """V1.5 离线内容：文件缺失时返回空的同构结构，接口不因缺数据 500。"""
    try:
        payload = json.loads((ROOT / "data" / name).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return fallback
    return payload if isinstance(payload, dict) else fallback


FORMULARY = _load_optional_data("drug_formulary.json", {"items": [], "categories": [], "policy": {}})
LAB_RANGES = _load_optional_data("lab_reference_ranges.json", {"items": []})
SIM_LIBRARY = _load_optional_data("simulation_cases.json", {"cases": [], "catalogue": {}, "sources": {}})
DOSE_RULES = _load_optional_data("dose_rules.json", {"items": [], "counts": {}, "policy": {}})
RELATIONS = _load_optional_data("relations.json", {"index": {}, "counts": {}, "policy": ""})


def _load_library_books() -> dict:
    try:
        payload = json.loads((ROOT / "data" / "library" / "books.json").read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {"books": [], "policy": {}}
    return payload if isinstance(payload, dict) else {"books": [], "policy": {}}


LIBRARY = _load_library_books()


def _load_library_extra(name: str) -> dict:
    try:
        return json.loads((ROOT / "data" / "library" / name).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {"books": {}, "systems": [], "unmapped": []}


CHAPTERS = _load_library_extra("chapters.json")
SYSTEM_MAP = _load_library_extra("system_map.json")
SYNONYMS = _load_library_extra("synonyms.json")


@lru_cache(maxsize=16)
def _library_chunks(book_id: str) -> tuple[dict, ...]:
    path = ROOT / "data" / "library" / f"{book_id}.json"
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return ()
    chunks = payload.get("chunks") if isinstance(payload, dict) else None
    return tuple(x for x in chunks if isinstance(x, dict)) if isinstance(chunks, list) else ()


def dose_rules_for(drug_id: str) -> dict | None:
    for record in DOSE_RULES.get("items") or []:
        if isinstance(record, dict) and record.get("drug_id") == drug_id:
            return record
    return None


def relations_for(kind: str, ident: str) -> list[dict]:
    index = RELATIONS.get("index") or {}
    items = index.get(f"{kind}:{ident}")
    return items if isinstance(items, list) else []


class Section(BaseModel):
    title: str
    content: str


class Drug(BaseModel):
    id: str
    name: str
    trade_name: str | None = None
    dosage_form: str | None = None
    specifications: str | None = None
    manufacturer: str | None = None
    approval_number: str | None = None
    revise_date: str | None = None
    sections: list[Section]
    source: str
    source_url: str
    status: str = "第三方资料，尚未经国家药监局人工核验"


class Approval(BaseModel):
    approval_number: str
    drug_name: str
    manufacturer: str | None = None
    license_holder: str | None = None
    dosage_form: str | None = None
    specifications: str | None = None
    source: str = "摩熵数科·中国药品批文数据（第三方）"
    status: str = "仅为第三方登记数据；须前往国家药监局官网人工核验"


@app.middleware('http')
async def no_cache_api(request: Request, call_next):
    response = await call_next(request)
    if request.url.path.startswith('/api/'):
        response.headers['Cache-Control'] = 'no-store, max-age=0'
        response.headers['X-Content-Type-Options'] = 'nosniff'
    return response


def provider() -> str | None:
    """数据源选择：custom（自建/任意第三方） > moseng > tianapi。

    个人拿不到摩熵数科时，用 CUSTOM_DRUG_API_* 环境变量接任意返回 JSON 的药品接口，
    字段映射写在 CUSTOM_DRUG_API_FIELD_MAP 里，代码不需要改。
    """
    pref = os.environ.get("DRUG_PROVIDER", "auto").lower()
    order = ["custom", "moseng", "tianapi"] if pref == "auto" else [pref]
    for name in order:
        if name == "custom" and custom_ready():
            return "custom"
        if name == "moseng" and get_value("MOSENG_API_KEY"):
            return "moseng"
        if name == "tianapi" and get_value("TIANAPI_KEY"):
            return "tianapi"
    return None


def _json_env(name: str, default: Any) -> Any:
    raw = os.environ.get(name, "").strip()
    if not raw:
        return default
    try:
        return json.loads(raw)
    except ValueError:
        return default


CUSTOM_DRUG: dict[str, Any] = {
    "url": os.environ.get("CUSTOM_DRUG_API_URL", "").strip(),
    "method": os.environ.get("CUSTOM_DRUG_API_METHOD", "GET").strip().upper(),
    "format": os.environ.get("CUSTOM_DRUG_API_BODY_FORMAT", "json").strip().lower(),
    "key": os.environ.get("CUSTOM_DRUG_API_KEY", "").strip(),
    "key_header": os.environ.get("CUSTOM_DRUG_API_KEY_HEADER", "").strip(),
    "key_prefix": os.environ.get("CUSTOM_DRUG_API_KEY_PREFIX", "").strip(),
    "key_param": os.environ.get("CUSTOM_DRUG_API_KEY_PARAM", "").strip(),
    "query_param": os.environ.get("CUSTOM_DRUG_API_QUERY_PARAM", "q").strip(),
    "page_param": os.environ.get("CUSTOM_DRUG_API_PAGE_PARAM", "page").strip(),
    "extra_query": _json_env("CUSTOM_DRUG_API_EXTRA_QUERY", {}),
    "extra_body": _json_env("CUSTOM_DRUG_API_EXTRA_BODY", {}),
    "list_path": os.environ.get("CUSTOM_DRUG_API_LIST_PATH", "data").strip(),
    "field_map": _json_env("CUSTOM_DRUG_API_FIELD_MAP", {}),
    "sections_key": os.environ.get("CUSTOM_DRUG_API_SECTIONS_KEY", "sections").strip(),
    "section_title_key": os.environ.get("CUSTOM_DRUG_API_SECTION_TITLE", "title").strip(),
    "section_content_key": os.environ.get("CUSTOM_DRUG_API_SECTION_CONTENT", "content").strip(),
    "source": os.environ.get("CUSTOM_DRUG_API_SOURCE", "自定义药品接口").strip(),
    "source_url": os.environ.get("CUSTOM_DRUG_API_SOURCE_URL", "").strip(),
}


def custom_ready() -> bool:
    return bool(CUSTOM_DRUG.get("url"))


def dot_get(obj: Any, path: str, default: Any = None) -> Any:
    """按 a.b.0.c 的路径取值，取不到返回 default（第三方返回结构千差万别，用它做映射）。"""
    if not path:
        return obj
    current = obj
    for part in str(path).split("."):
        if isinstance(current, list):
            try:
                current = current[int(part)]
            except (ValueError, IndexError):
                return default
        elif isinstance(current, dict):
            if part not in current:
                return default
            current = current[part]
        else:
            return default
    return current



def clean_string(value: Any) -> str:
    if value is None:
        return ""
    if isinstance(value, list):
        return "、".join(str(x).strip() for x in value if x is not None)
    return str(value).strip()


def clean_content(value: Any) -> str:
    # 第三方数据一律纯文本展示，避免把网页代码当作 HTML 执行。
    s = clean_string(value)
    s = re.sub(r"(?i)<\s*br\s*/?\s*>|</\s*(?:div|p|li|h[1-6])\s*>", "\n", s)
    return unescape(re.sub(r"<[^>]*>", "", s)).strip()


def normalize_tianapi(payload: dict, keyword: str) -> list[Drug]:
    if payload.get("code") != 200:
        if payload.get("code") == 250:
            return []
        raise HTTPException(502, "中文说明书平台未返回可用数据，请核对套餐和接口权限。")
    result = payload.get("result", {})
    if isinstance(result, dict):
        items = result.get("list") or result.get("newslist")
        if not isinstance(items, list):
            items = [result] if ("title" in result or "content" in result) else []
    elif isinstance(result, list):
        items = result
    else:
        items = []
    records = []
    for i, item in enumerate(items):
        if not isinstance(item, dict):
            continue
        name = clean_string(item.get("title") or keyword)
        content = clean_content(item.get("content"))
        if content:
            records.append(Drug(
                id=f"tianapi-{i}", name=name,
                sections=[Section(title="药品资料原文（未核实为某厂家完整说明书）", content=content)],
                source="天聚数行", source_url="https://www.tianapi.com/apiview/134",
                status="可能未区分批准文号与厂家；仅供初步查阅"))
    return records


def normalize_moseng(payload: dict) -> list[Drug]:
    check_moseng(payload)
    data = payload.get("data") or {}
    items = data if isinstance(data, list) else data.get("list", []) if isinstance(data, dict) else []
    records = []
    for i, item in enumerate(items):
        if not isinstance(item, dict):
            continue
        name = clean_string(item.get("drug_name"))
        if not name:
            continue
        sections = []
        for s in item.get("items") or []:
            if isinstance(s, dict):
                c = clean_content(s.get("content"))
                if c:
                    sections.append(Section(title=clean_string(s.get("title")) or "说明书正文", content=c))
        if not sections:
            for key, title in (("indication", "适应证"), ("usage", "用法用量"),
                               ("taboo", "禁忌"), ("side_effects", "不良反应")):
                c = clean_content(item.get(key))
                if c:
                    sections.append(Section(title=title, content=c))
        if not sections:
            continue
        records.append(Drug(
            id=f"moseng-{i}", name=name,
            trade_name=clean_string(item.get("trade_name")) or None,
            dosage_form=clean_string(item.get("dosage_form")) or None,
            specifications=clean_string(item.get("specifications")) or None,
            manufacturer=clean_string(item.get("manufacturer")) or None,
            approval_number=clean_string(item.get("approval_number")) or None,
            revise_date=clean_string(item.get("revise_date") or item.get("last_date")) or None,
            sections=sections, source="摩熵数科",
            source_url="https://open.bcpmdata.com/api/1.html"))
    return records


def check_moseng(payload: dict):
    if payload.get("code") != 10200:
        code = payload.get("code")
        # 不能把权限错误或参数错误默认为“没有结果”。
        if code == 10403:
            raise HTTPException(503, "摩熵接口未授权或凭证无效，请核对服务权限。")
        if code == 10429:
            raise HTTPException(429, "摩熵接口已达到访问频率限制，请稍后重试。")
        raise HTTPException(502, "第三方数据源查询失败，请核对参数与服务状态。")


def normalize_custom(payload: Any, keyword: str, cfg: dict | None = None) -> list[Drug]:
    """把任意第三方药品接口的 JSON 映射成 Drug；字段路径由 CUSTOM_DRUG_API_FIELD_MAP 指定。"""
    cfg = cfg or CUSTOM_DRUG
    field_map = cfg.get("field_map") or {}
    items = dot_get(payload, cfg.get("list_path") or "data", [])
    if isinstance(items, dict):
        items = [items]
    if not isinstance(items, list):
        items = []
    records: list[Drug] = []
    for i, item in enumerate(items):
        if not isinstance(item, dict):
            continue

        def field(name: str) -> str:
            return clean_string(dot_get(item, field_map.get(name, "")))

        name = field("name") or keyword
        sections: list[Section] = []
        raw_sections = dot_get(item, cfg.get("sections_key") or "sections", None)
        if isinstance(raw_sections, str):
            content = clean_content(raw_sections)
            if content:
                sections.append(Section(title="药品资料原文（第三方）", content=content))
        elif isinstance(raw_sections, list):
            for entry in raw_sections:
                if not isinstance(entry, dict):
                    continue
                content = clean_content(dot_get(entry, cfg.get("section_content_key") or "content", ""))
                if content:
                    title = clean_string(dot_get(entry, cfg.get("section_title_key") or "title", "")) or "说明书正文"
                    sections.append(Section(title=title, content=content))
        if not sections:
            for key in ("content", "instruction", "description"):
                content = clean_content(item.get(key))
                if content:
                    sections.append(Section(title="药品资料原文（第三方）", content=content))
                    break
        if not sections:
            continue
        records.append(Drug(
            id=f"custom-{i}", name=name,
            trade_name=field("trade_name") or None,
            dosage_form=field("dosage_form") or None,
            specifications=field("specifications") or None,
            manufacturer=field("manufacturer") or None,
            approval_number=field("approval_number") or None,
            revise_date=field("revise_date") or None,
            sections=sections,
            source=str(cfg.get("source") or "自定义药品接口"),
            source_url=str(cfg.get("source_url") or ""),
            status="第三方/自建接口资料，未做国家药监局核验"))
    return records


async def custom_fetch(query: str, page: int) -> Any:
    """按配置请求自建/第三方药品接口，返回原始 JSON（供 normalize_custom 映射）。"""
    cfg = CUSTOM_DRUG
    params: dict[str, Any] = dict(cfg.get("extra_query") or {})
    params[cfg.get("query_param") or "q"] = query
    if cfg.get("page_param"):
        params[cfg["page_param"]] = page
    headers: dict[str, str] = {}
    if cfg.get("key"):
        if cfg.get("key_param"):
            params[cfg["key_param"]] = cfg["key"]
        elif cfg.get("key_header"):
            headers[cfg["key_header"]] = (cfg.get("key_prefix") + " " + cfg["key"]).strip()
    body = dict(cfg.get("extra_body") or {})
    body.setdefault(cfg.get("query_param") or "q", query)
    if cfg.get("page_param"):
        body.setdefault(cfg["page_param"], page)
    async with http_client(15) as client:
        if cfg.get("method") == "POST":
            if cfg.get("format") == "form":
                response = await client.post(cfg["url"], params=params, data=body, headers=headers)
            else:
                response = await client.post(cfg["url"], params=params, json=body, headers=headers)
        else:
            response = await client.get(cfg["url"], params=params, headers=headers)
    response.raise_for_status()
    return response.json()


def normalize_approvals(payload: dict) -> list[Approval]:
    check_moseng(payload)
    data = payload.get('data') or {}
    items = data if isinstance(data, list) else data.get('list', []) if isinstance(data, dict) else []
    matches = []
    for item in items:
        if not isinstance(item, dict):
            continue
        number = clean_string(item.get('approval_number'))
        name = clean_string(item.get('drug_name'))
        if not (number and name):
            continue
        matches.append(Approval(
            approval_number=number, drug_name=name,
            manufacturer=clean_string(item.get('manufacturer_cn') or item.get('manufacturer')) or None,
            license_holder=clean_string(item.get('corporation_cn') or item.get('corporation')) or None,
            dosage_form=clean_string(item.get('dosage_form')) or None,
            specifications=clean_string(item.get('specifications') or item.get('specification')) or None))
    return matches


async def moseng_post(url: str, query: dict) -> dict:
    async with http_client(12) as client:
        response = await client.post(
            url, headers={'Authorization': get_value('MOSENG_API_KEY'), 'Content-Type': 'application/json'},
            json=query)
        response.raise_for_status()
        return response.json()


@app.get('/api/status')
async def status():
    p = provider()
    stats = content_overview()
    return {
        'connected': bool(p), 'provider': p,
        'approval_lookup_connected': bool(get_value('MOSENG_API_KEY')),
        'official_nmpa_api_connected': False,
        'official_url': NMPA_URL,
        'mode': {'custom': '自建/第三方药品接口（自定义字段映射）',
                 'moseng': '摩熵数科·中国药品说明书',
                 'tianapi': '天聚数行·中文药品资料'}.get(p or '', '尚未配置中文说明书数据源（离线药典与学习内容仍可用）'),
        'custom_api_configured': custom_ready(),
        'disclaimer': '国家药监局须人工核验；第三方检索结果不代表官方实时认证。',
        'ai_ready': bool(get_value('AI_API_KEY')) and bool(os.environ.get('APP_ACCESS_CODE')),
        'ai_model': DEEPSEEK_MODEL,
        'learning_count': stats['learning_topics'],
        'version': app.version,
        'offline': {
            'formulary_drugs': stats['formulary_drugs'],
            'lab_reference_items': stats['lab_reference_items'],
            'simulation_cases': stats['simulation_cases'],
            'simulation_scenarios': stats['simulation_scenarios'],
            'quiz_items': stats['quiz_items'],
            'dose_rules': stats['dose_rules_with_numbers'],
            'relations': stats['relation_links'],
        }
    }


@app.get('/api/search')
async def search(q: str = Query(min_length=2, max_length=60), page: int = Query(default=1, ge=1, le=20)):
    q = q.strip()
    if len(q) < 2:
        raise HTTPException(422, '请至少输入两个字符。')
    p = provider()
    if not p:
        raise HTTPException(503, '尚未配置中国药品说明书 API，请参考 README 设置服务端密钥。')
    try:
        if p == 'tianapi':
            async with http_client(12) as client:
                response = await client.post(TIANAPI_URL, data={
                    'key': get_value('TIANAPI_KEY'), 'word': q, 'num': '10', 'page': str(page)})
                response.raise_for_status()
                records = normalize_tianapi(response.json(), q)
        elif p == 'custom':
            records = normalize_custom(await custom_fetch(q, page), q)
        else:
            records = normalize_moseng(await moseng_post(MOSENG_INSTRUCTIONS_URL, {
                'search': {'drug_name': q}, 'page': page}))
    except (httpx.RequestError, httpx.HTTPStatusError, ValueError, TypeError) as exc:
        raise HTTPException(502, '中文药品说明书数据服务暂时不可用。请核对网络或接口授权。') from exc
    return {'query': q, 'page': page, 'provider': p, 'count': len(records),
            'items': [record.model_dump() for record in records],
            'official_verification': NMPA_URL, 'officially_verified': False}


@app.get('/api/approvals')
async def approvals(q: str = Query(min_length=2, max_length=60), page: int = Query(default=1, ge=1, le=20)):
    """第三方批文索引。这里绝不访问/模拟国家药监局内部 API。"""
    q = q.strip()
    if len(q) < 2:
        raise HTTPException(422, '请至少输入两个字符。')
    if not get_value('MOSENG_API_KEY'):
        hint = '自定义数据源（CUSTOM_DRUG_API_*）只映射说明书检索，不含批文库；' if custom_ready() else ''
        raise HTTPException(503, f'{hint}批文自动检索需摩熵中国药品批文库权限，或使用国家药监局官网手工核验。')
    term = {'approval_number': q} if q.startswith('国药准字') else {'drug_name': q}
    try:
        records = normalize_approvals(await moseng_post(MOSENG_APPROVAL_URL, {'search': term, 'page': page}))
    except (httpx.RequestError, httpx.HTTPStatusError, ValueError, TypeError) as exc:
        raise HTTPException(502, '第三方批文数据库暂时无法连接。') from exc
    return {'query': q, 'page': page, 'count': len(records), 'items': [a.model_dump() for a in records],
            'source': '摩熵数科·中国药品批文库', 'official_nmpa_api_connected': False,
            'official_verification': NMPA_URL,
            'disclaimer': '这是第三方资料，不等于国家药监局已实时确认。请使用官网再次核验。'}


@app.get('/api/resources')
async def resources():
    return {'resources': [
        {'title': '国家药品监督管理局·药品数据查询', 'url': NMPA_URL, 'type': '官方人工核验入口'},
        {'title': '国家药监局·公开查询帮助', 'url': NMPA_HELP, 'type': '官方操作说明'},
        {'title': '儿童肺炎支原体肺炎诊疗指南（2025年版）', 'url': NHC_GUIDE,
         'type': '国家卫生健康委官方临床指南', 'date': '2025-09-23'}
    ]}


@app.get('/')
async def home():
    return FileResponse(WEB / 'index.html', media_type='text/html')




# V0.3 教学资料库与疑难问题检索。问答内容不在服务器持久存储。
@app.get('/api/learning')
async def learning():
    return LEARNING


def find_learning_topics(question: str, limit: int = 5) -> list[dict]:
    """保守中文全文召回：仅返回现有已写入学习库的条目，绝不伪造诊断。"""
    query = re.sub(r'[\s，。！？、；：()（）]+', '', question.lower())
    records = []
    for system in LEARNING['systems']:
        for t in system['topics']:
            title = t['title'].lower()
            content = ' '.join(t['content'].values()).lower()
            title_compact = title.replace('与', '').replace('和', '').replace('性', '')
            score = 0
            if title in query or title_compact in query:
                score += 20
            for phrase in [title, *re.split('[与和、/]', title)]:
                if len(phrase) >= 2 and phrase in query:
                    score += 9
            # 少量匹配为线索，不允许只靠共有汉字生成诊断
            bigrams = {query[i:i+2] for i in range(len(query)-1)}
            matched_title = sum(1 for x in bigrams if x in title)
            matched_content = sum(1 for x in bigrams if x in content)
            score += matched_title * 4 + min(matched_content, 6)
            if score >= 5:
                records.append((score, {'system':system['name'], **t}))
    records.sort(key=lambda x: (-x[0], x[1]['id']))
    return [x[1] for x in records[:limit]]


class QuestionInput(BaseModel):
    question: str
    mode: str = 'local'
    consent_external: bool = False


def ai_config():
    # V1.4 is pinned to DeepSeek official Flash API; no arbitrary host/path
    # (prevents accidental delivery of the stored DeepSeek key to another service).
    url = os.environ.get('AI_API_URL', 'https://api.deepseek.com/chat/completions').strip()
    if url != 'https://api.deepseek.com/chat/completions':
        raise HTTPException(503, 'DeepSeek V4.1 Flash 只允许使用官方固定 HTTPS 接口地址。')
    return url


@app.post('/api/ask')
async def ask(payload: QuestionInput, request: Request):
    question = payload.question.strip()
    if not 5 <= len(question) <= 1500:
        raise HTTPException(422, '问题长度须在5–1500字之间。')
    if payload.mode not in ('local', 'ai'):
        raise HTTPException(422, '模式无效。')
    topics = find_learning_topics(question)
    matches = [dict(id=t['id'], title=t['title'], system=t['system'], content=t['content'],
                    sources=t['sources'], review_status=t['review_status']) for t in topics]
    if payload.mode == 'local':
        return {'mode':'local','question':question,
                'answer': '已检索本地儿科学习库，以下为相关学习条目，而非对该病例的医学诊断。' if matches else '本地资料库未找到可靠的相关条目，无法给出诊断或用药建议。请查阅现行指南或向带教医师请教。',
                'matches':matches, 'evidence':'本地编辑提纲，不等于已核验的临床结论',
                'external_sent':False}
    if not payload.consent_external:
        raise HTTPException(403, '发送到第三方AI前必须明确勾选隐私告知。')
    if not get_value('AI_API_KEY'):
        raise HTTPException(503, '尚未配置 AI_API_KEY；可切换本地资料检索，不上传问题。')
    access_code = os.environ.get('APP_ACCESS_CODE', '')
    if len(access_code) < 8:
        raise HTTPException(503, 'AI服务必须配置至少8位 APP_ACCESS_CODE 才能启用，防止公开部署后被滥用。')
    if not secrets.compare_digest(request.headers.get('X-App-Access', ''), access_code):
        raise HTTPException(403, '访问码不正确，请输入服务器设置的应用访问码。')
    # 拒绝明显的直接标识符，但正则无法穷尽所有PII，前端仍需强调匿名化。
    if re.search(r'(?:\b1[3-9]\d{9}\b|\b\d{17}[0-9Xx]\b|住院号\s*[:：]?\s*\S+|身份证号\s*[:：]?\s*\S+)', question):
        raise HTTPException(422, '问题疑似包含手机号、身份证或住院号，请匿名化后再选择AI。')
    url = ai_config()
    context = [{'主题':t['title'], '检查与鉴别':t['content']['检查与鉴别'],
                '用药原则':t['content']['处理与用药原则'],
                '危险信号':t['content']['紧急警示'],
                '来源链接':[s['url'] for s in t['sources']]} for t in topics[:4]]
    messages = [
        {'role':'system','content':(
            '你是中国儿科临床学习助手，服务于医学学习而非代替医生下医嘱。只使用简体中文。'
            '回答结构必须包括：①问题分析（区分已知/未知）；②优先排除的危险信号；'
            '③鉴别思路和建议核对的检查；④治疗/药学核对要点（仅讨论原则，不给具体病人的处方或静脉剂量）；'
            '⑤参考来源及证据限制；⑥待补充信息。必须明确表达不确定性；不编造指南名称或链接。'
            '用户可能提供疑似病例，绝不把信息当成已经确诊，不能直接开处方。'
            '下面的资料是未经专家逐条审核的编辑性提纲，不得宣称其即为正式指南正文。')},
        {'role':'user','content': '匿名学习问题：'+question+'\n可供参考的本地学习提纲（可能与问题不相关）：'+json.dumps(context,ensure_ascii=False)}]
    try:
        async with http_client(28) as client:
            response = await client.post(url, headers={'Authorization':'Bearer '+get_value('AI_API_KEY'),
                                                        'Content-Type':'application/json'},
                json={'model':DEEPSEEK_MODEL, 'messages':messages,
                      'temperature':0.2, 'max_tokens':1300})
            response.raise_for_status()
            data = response.json()
            answer = str(data['choices'][0]['message']['content']).strip()[:9000]
            if not answer: raise ValueError('empty answer')
    except (httpx.RequestError,httpx.HTTPStatusError, KeyError, IndexError, ValueError, TypeError) as exc:
        raise HTTPException(502, 'AI 服务暂时不可用，问题未保存在服务器；可切换本地学习库检索。') from exc
    return {'mode':'ai', 'question':question, 'answer':answer, 'matches':matches,
            'evidence':'AI生成的学习分析，尚未经过医生复核；不能作为确诊和处方依据',
            'external_sent':True}


class AIChatInput(BaseModel):
    messages: list[dict]
    max_tokens: int = 1300




def http_client(timeout: float = 20.0):
    """统一客户端：默认不读系统代理环境变量（本机 NO_PROXY 损坏会让 httpx 报 InvalidURL）。

    需要走代理时设置 USE_ENV_PROXY=1，nx 仍会读取 HTTP_PROXY/HTTPS_PROXY。
    """
    trust = bool(os.environ.get('USE_ENV_PROXY', '').strip())
    return httpx.AsyncClient(timeout=timeout, follow_redirects=False, trust_env=trust)


def ai_base_url() -> str:
    return (os.environ.get('AI_API_URL', 'https://api.deepseek.com/chat/completions').strip()
            or 'https://api.deepseek.com/chat/completions')


def ai_upstream_error(exc: Exception, response=None) -> str:
    status = getattr(response, 'status_code', None)
    body = ''
    if response is not None:
        try:
            body = (response.text or '')[:300]
        except Exception:
            body = ''
    if status == 401:
        return 'DeepSeek 认证失败（401）：API Key 无效或已被删除。'
    if status == 402:
        return 'DeepSeek 余额不足（402）：请到 platform.deepseek.com 充值。'
    if status == 400:
        return 'DeepSeek 请求被拒（400）：模型名无效，只支持 deepseek-flash / deepseek-v4-pro。' + (f' 上游：{body[:160]}' if body else '')
    if status == 429:
        return 'DeepSeek 触发限流（429）：稍后重试或降低频率。'
    if status:
        return f'DeepSeek 返回 HTTP {status}：{body[:160]}'
    return f'连接 DeepSeek 失败：{type(exc).__name__}'


@app.post('/api/ai/chat')
async def ai_chat(payload: AIChatInput, request: Request):
    """服务端 AI 代理：Key 只在服务器加密文件，前端只带 APP_ACCESS_CODE。"""
    access_code = os.environ.get('APP_ACCESS_CODE', '')
    if len(access_code) < 8:
        raise HTTPException(503, '服务端 AI 未启用：需要设置至少 8 位 APP_ACCESS_CODE。')
    if not secrets.compare_digest(request.headers.get('X-App-Access', ''), access_code):
        raise HTTPException(403, '访问码不正确。')
    if not get_value('AI_API_KEY'):
        raise HTTPException(503, '服务端未配置 AI_API_KEY：可在管理中心写入，或改用直连模式。')
    if not payload.messages:
        raise HTTPException(422, 'messages 不能为空。')
    try:
        async with http_client(40) as client:
            response = await client.post(
                ai_base_url(),
                headers={'Authorization': 'Bearer ' + get_value('AI_API_KEY'),
                         'Content-Type': 'application/json'},
                json={'model': DEEPSEEK_MODEL, 'messages': payload.messages,
                      'temperature': 0.2, 'max_tokens': min(max(payload.max_tokens, 64), 4000)})
            if response.status_code >= 400:
                raise HTTPException(502, ai_upstream_error(Exception('upstream'), response))
            data = response.json()
            answer = str(data['choices'][0]['message']['content']).strip()
    except httpx.HTTPStatusError as exc:
        raise HTTPException(502, ai_upstream_error(exc, exc.response)) from exc
    except Exception as exc:
        raise HTTPException(502, ai_upstream_error(exc)) from exc
    return {'answer': answer, 'model': DEEPSEEK_MODEL, 'external_sent': True}


@app.get('/api/ai/diagnose')
async def ai_diagnose():
    key = bool(get_value('AI_API_KEY'))
    access_code = os.environ.get('APP_ACCESS_CODE', '')
    reachable = None
    detail = ''
    try:
        async with http_client(15) as client:
            headers = {'Authorization': 'Bearer ' + get_value('AI_API_KEY')} if key else {}
            response = await client.get('https://api.deepseek.com/models', headers=headers)
            reachable = True
            if response.status_code == 200:
                detail = 'Key 有效，可直接调用'
            elif response.status_code == 401:
                detail = '网络可达，但 Key 无效或未填写' if key else '网络可达；尚未填写服务端 Key'
            else:
                detail = f'网络可达，上游返回 HTTP {response.status_code}'
    except Exception as exc:  # 代理环境变量冲突、DNS、TLS 都归到这里，别让诊断接口自己 500
        reachable = False
        detail = f'连不上 api.deepseek.com：{type(exc).__name__}: {str(exc)[:120]}'
    return {'server_key_configured': key, 'model': DEEPSEEK_MODEL, 'base_url': ai_base_url(),
            'access_code_ready': len(access_code) >= 8, 'reachable': reachable, 'detail': detail,
            'hint': '模型名必须是 deepseek-flash 或 deepseek-v4-pro；直连被跨域拦截时填 APP_ACCESS_CODE 走服务端。'}


# V0.4: 中国儿科临床学习与病历质控。官方规范是引用链接，未嵌入未经授权的全文。
@app.get('/api/study-evidence')
async def study_evidence():
    return SOURCES

@app.get('/api/study-quiz')
async def study_quiz():
    # No answer key sent to another service: all cases bundled offline for education.
    return QUIZ

@app.get('/api/clinical-education')
async def clinical_education():
    return CLINICAL


class ChartReviewInput(BaseModel):
    note_text: str
    doc_type: str
    consent_external: bool = False


@app.post('/api/chart-review')
async def chart_review(payload: ChartReviewInput, request: Request):
    """Explicit opt-in anonymous note review, NEVER official hospital approval."""
    note = payload.note_text.strip()
    if payload.doc_type not in ('admission', 'first', 'progress', 'outpatient'):
        raise HTTPException(422, '病历类型不正确。')
    if not 20 <= len(note) <= 12000:
        raise HTTPException(422, '匿名病历长度须在20–12000字之间。')
    if not payload.consent_external:
        raise HTTPException(403, '必须明确勾选匿名病历发送同意后才能调用AI。')
    if not get_value('AI_API_KEY'):
        raise HTTPException(503, '没有配置AI_API_KEY。本地质控仍然可用。')
    access_code = os.environ.get('APP_ACCESS_CODE', '')
    if len(access_code) < 8 or not secrets.compare_digest(request.headers.get('X-App-Access',''),access_code):
        raise HTTPException(403, 'AI应用访问码未配置或不正确。')
    # Conservative PII checks. These are not sufficient for real patient-data de-identification.
    if re.search(r'(?:\b1[3-9]\d{9}\b|\b\d{17}[\dXx]\b|(?:住院号|病案号|身份证号|联系电话|手机号|家庭住址|家庭地址)\s*[:：]\s*[^\s，。；;]{2,}|(?:姓名|患儿姓名)\s*[:：]\s*[^\s，。；;\[\]]{2,8})', note):
        raise HTTPException(422,'检测到潜在的身份标识；请改用虚构病历或彻底去标识化后再试。')
    # No unreviewed model output is used to complete/sign a chart, assign grades or prescribe medication.
    model_name = {'admission':'住院入院记录','first':'首次病程记录','progress':'日常病程记录','outpatient':'门急诊初诊记录'}[payload.doc_type]
    ai_messages=[
        {'role':'system','content':(
            '你是中国儿科病历书写规范的教学质控助理，不是医院的最终病历审核者。'
            '依据《病历书写基本规范》(卫医政发〔2010〕11号) 和《电子病历应用管理规范(试行)》做审阅建议。'
            '只用简体中文，指出具体句子存在的缺项、含糊用语、逻辑冲突、重要鉴别诊断记录的缺失；指出修改方向。'
            '严格区分“明确缺失”“需要人工核对”“合理表述”；引用原文时不得超过必要的局部短语。'
            '只重写文法或格式示例，不得编造未给出的体温、检查结果、病史事实、用药剂量、签名、时间或诊断。'
            '对未经原文证实的内容一律使用[需核实]占位符；不能声称审批通过。'
            '你的输出必须按①结构缺漏②文本矛盾③医学表达/需核实事实④示范性修改建议（仅已给事实）⑤人工复核事项五段分项。'
            '不能诊断真实患者，不能给病人生成输液处方。')},
        {'role':'user','content':'文书类型：'+model_name+'\n以下为用户声明已匿名化的教学病历（内容可能有错）：\n'+note}
    ]
    url = ai_config()
    try:
        async with http_client(35) as client:
            response=await client.post(url,headers={'Authorization':'Bearer '+get_value('AI_API_KEY'),'Content-Type':'application/json'},
                json={'model':DEEPSEEK_MODEL,'messages':ai_messages,'temperature':0.1,'max_tokens':2000})
            response.raise_for_status()
            data=response.json()
            result=str(data['choices'][0]['message']['content']).strip()[:11000]
            if not result: raise ValueError('blank')
    except (httpx.RequestError,httpx.HTTPStatusError,KeyError,IndexError,TypeError,ValueError) as exc:
        raise HTTPException(502,'AI病历辅助质控暂时不可用，文书未写入服务器；请保留本地检查结果。') from exc
    return {'status':'AI辅助建议，尚未经医师核实，不构成正式审核通过','review':result,
            'reference':'《病历书写基本规范》(2010)，《电子病历应用管理规范》(2017)', 'external_sent':True}


# V0.6: only temporarily process an explicitly consented, cropped teaching report image.
# No image, OCR text, or identifiers are written to disk, databases or logs.
@lru_cache(maxsize=1)
def ocr_engine_available() -> bool:
    try:
        import pytesseract
        langs = pytesseract.get_languages(config='')
        return 'chi_sim' in langs and 'eng' in langs
    except Exception:
        return False

@app.get('/api/ocr/status')
async def ocr_status():
    return {
        'ready': ocr_engine_available() and len(os.environ.get('OCR_ACCESS_CODE', '')) >= 8,
        'engine_available': ocr_engine_available(),
        'requires_explicit_consent': True,
        'upload_scope': '每次主动上传仅一张已裁切去标识化的教学报告图像，不保存',
        'supported_formats': ['image/jpeg','image/png','image/webp'],
        'max_upload_bytes': 8_000_000,
    }

@app.post('/api/ocr/recognize')
async def recognize_teaching_report(
    request: Request,
    image: UploadFile = File(...),
    consent: str = Form(''),
    report_type: str = Form('labs'),
):
    if consent != 'yes':
        raise HTTPException(403, '必须明确同意上传已去标识化的报告局部图像。')
    secret = os.environ.get('OCR_ACCESS_CODE', '')
    if len(secret) < 8 or not secrets.compare_digest(request.headers.get('X-OCR-Access',''), secret):
        raise HTTPException(403, 'OCR未开通或访问码不正确。')
    # Validate the caller's request before inspecting optional server tooling.
    # This keeps invalid uploads actionable even on a deployment without OCR.
    if report_type not in ('labs','exams'):
        raise HTTPException(422, '无效的报告类型。')
    if image.content_type not in ('image/jpeg','image/png','image/webp'):
        raise HTTPException(415, '只允许JPEG、PNG或WebP图片。iPhone HEIC请先在浏览器预览转换为JPEG。')
    if not ocr_engine_available():
        raise HTTPException(503, '服务端未安装简体中文OCR引擎。请使用手动复制文字模式。')
    payload = await image.read(8_000_001)
    await image.close()
    if len(payload) > 8_000_000 or len(payload) < 80:
        raise HTTPException(413, '文件过大或为空；最大8MB。')
    try:
        from PIL import Image, ImageOps, UnidentifiedImageError
        import pytesseract
        with Image.open(BytesIO(payload)) as src:
            if src.format not in ('JPEG','PNG','WEBP') or src.width * src.height > 12_000_000:
                raise ValueError('unsupported image')
            src.load()
            img = ImageOps.exif_transpose(src).convert('RGB')
        if img.width < 100 or img.height < 100:
            raise ValueError('image too small')
        # tesseract uses a subprocess but never writes files to our project path.
        text = pytesseract.image_to_string(img, lang='chi_sim+eng', config='--psm 6', timeout=22)[:9000]
    except (ValueError, OSError, Exception) as exc:
        # Do not expose tool internals, image content or OCR text in errors.
        raise HTTPException(422, '无法读取或识别该图片。建议裁切清晰报告、检查权限，或使用iPhone实况文本复制。') from exc
    return {
        'text': text,
        'ocr_only': True,
        'saved': False,
        'report_type': report_type,
        'disclaimer': 'OCR可能将数值、小数点和单位识别错误；请对照原图人工修订后再进行教学解读。',
    }

# V1.1 医学条目证据索引，仅提供待审信息，不允许通过公开 API 伪造专家审签。
MEDICAL_AUDIT = json.loads((ROOT / 'data' / 'medical_audit.json').read_text(encoding='utf-8'))

@app.get('/api/audit/summary')
async def audit_summary():
    return {'version': MEDICAL_AUDIT['version'],
            'scope': MEDICAL_AUDIT['scope'],
            'summary': MEDICAL_AUDIT['summary'],
            'medical_signoff_completed': False,
            'drug_license_obtained': False}

@app.get('/api/audit/items')
async def audit_items(kind: str = Query(default='', max_length=20),
                      missing_source: bool = False,
                      priority: str = Query(default='', max_length=20),
                      q: str = Query(default='', max_length=80),
                      page: int = Query(default=1, ge=1, le=1000),
                      page_size: int = Query(default=30, ge=1, le=80)):
    records = MEDICAL_AUDIT['records']
    if kind: records = [x for x in records if x['kind'] == kind]
    if missing_source: records = [x for x in records if not x['sources']]
    if priority: records = [x for x in records if x['priority'].startswith(priority)]
    if q:
        needle = q.casefold().strip()
        records = [x for x in records if any(needle in str(x[k]).casefold()
                    for k in ('claim_id','title','category','original_text'))]
    # 优先级、缺来源在前，帮助医生与药师先处理高风险条目。
    records = sorted(records, key=lambda x:(x['priority'], bool(x['sources']), x['claim_id']))
    start=(page-1)*page_size
    return {'total':len(records), 'page':page, 'page_size':page_size,
            'items': records[start:start+page_size],
            'warning':'所有条目均未经临床专家逐条签审；来源入口并非逐句验证结果。'}

@app.get('/api/audit/export')
async def audit_export():
    return FileResponse(ROOT/'docs'/'医学逐条审核底稿.csv',
           media_type='text/csv; charset=utf-8',filename='儿科医学逐条审核底稿_V1.1.csv')


# ---------------------------------------------------------------------------
# V1.5 离线内容接口：药典、化验参考区间、模拟场景、内容覆盖统计。
# 这些接口只读本地 JSON，不依赖任何第三方 API Key，也不落库任何用户输入。
# ---------------------------------------------------------------------------

def _formulary_items() -> list[dict]:
    items = FORMULARY.get('items')
    return [x for x in items if isinstance(x, dict)] if isinstance(items, list) else []


def _lab_range_items() -> list[dict]:
    items = LAB_RANGES.get('items')
    return [x for x in items if isinstance(x, dict)] if isinstance(items, list) else []


def _sim_cases() -> list[dict]:
    items = SIM_LIBRARY.get('cases')
    return [x for x in items if isinstance(x, dict)] if isinstance(items, list) else []


def _sim_scenarios() -> list[dict]:
    catalogue = SIM_LIBRARY.get('catalogue') or {}
    items = catalogue.get('scenarios') if isinstance(catalogue, dict) else None
    if not isinstance(items, list):
        return []
    return [x for x in items if isinstance(x, dict)]


def content_overview() -> dict:
    """内容覆盖统计：用于“来源·覆盖·审校”页面与验收脚本。"""
    labs = CLINICAL.get('lab_tests') or []
    paths = CLINICAL.get('clinical_paths') or []
    topics = sum(len(s.get('topics') or []) for s in (LEARNING.get('systems') or []))
    ranges = _lab_range_items()
    numeric = [r for r in ranges if any(isinstance(b, dict) and b.get('low') is not None for b in (r.get('ranges') or []))]
    drugs = _formulary_items()
    quiz = QUIZ.get('items') or []
    cases = _sim_cases()
    scenarios = _sim_scenarios()
    dose_rules = DOSE_RULES.get('items') or []
    rules_with_numbers = [r for r in dose_rules if isinstance(r, dict) and r.get('rules')]
    relation_index = RELATIONS.get('index') or {}
    library_books = [b for b in (LIBRARY.get('books') or []) if isinstance(b, dict)]
    return {
        'version': app.version,
        'clinical_paths': len(paths),
        'clinical_paths_with_source': sum(1 for p in paths if p.get('sources')),
        'clinical_paths_with_medication': sum(1 for p in paths if p.get('medication')),
        'learning_systems': len(LEARNING.get('systems') or []),
        'learning_topics': topics,
        'lab_tests': len(labs),
        'lab_tests_with_reference_text': sum(1 for t in labs if t.get('reference')),
        'lab_reference_items': len(ranges),
        'lab_reference_numeric': len(numeric),
        'examination_terms': len(CLINICAL.get('examination_terms') or []),
        'examination_modalities': len(CLINICAL.get('examination_modalities') or []),
        'infusion_lessons': len(CLINICAL.get('infusion_lessons') or []),
        'quiz_items': len(quiz),
        'simulation_cases': len(cases),
        'simulation_scenarios': len(scenarios),
        'simulation_cases_with_course': sum(1 for c in cases if c.get('course')),
        'formulary_drugs': len(drugs),
        'formulary_categories': len(FORMULARY.get('categories') or []),
        'dose_rules_drugs': len(dose_rules),
        'dose_rules_with_numbers': len(rules_with_numbers),
        'relation_entities': len(relation_index),
        'relation_links': sum(len(v) for v in relation_index.values() if isinstance(v, list)),
        'library_books': len(library_books),
        'library_chunks': sum(int(b.get('chunks') or 0) for b in library_books),
        'library_chars': sum(int(b.get('chars') or 0) for b in library_books),
        'source_entries': len(SOURCES.get('sources') or []),
        'medical_signed_off': 0,
        'ready_for_clinical_use': False,
    }


@app.get('/api/content/stats')
async def content_stats():
    stats = content_overview()
    stats['disclaimer'] = '统计只说明内容覆盖数量，不代表任何条目已通过医学专家审核。'
    return stats


@app.get('/api/formulary/meta')
async def formulary_meta():
    items = _formulary_items()
    counts = Counter(str(x.get('category')) for x in items)
    return {
        'edition': FORMULARY.get('edition'),
        'updated': FORMULARY.get('updated'),
        'count': len(items),
        'categories': FORMULARY.get('categories') or sorted(counts),
        'by_category': dict(counts),
        'policy': FORMULARY.get('policy') or {},
        'disclaimer': '离线药典为编辑性教学整理，未经药事/临床专家逐条审核；不能作为处方或医嘱依据。',
    }


@app.get('/api/formulary')
async def formulary(
    q: str = Query(default='', max_length=60),
    category: str = Query(default='', max_length=30),
    page: int = Query(default=1, ge=1, le=50),
    page_size: int = Query(default=20, ge=1, le=50),
):
    items = _formulary_items()
    if category:
        items = [x for x in items if x.get('category') == category]
    needle = q.casefold().strip()
    if needle:
        def haystack(item: dict) -> str:
            fields = [item.get('generic_name'), item.get('drug_class'), item.get('category'),
                      item.get('indications'), item.get('peds_notes'), item.get('dose_note'),
                      ' '.join(item.get('aliases') or []), ' '.join(item.get('tags') or [])]
            return ' '.join(str(x) for x in fields if x).casefold()
        items = [x for x in items if needle in haystack(x)]
    start = (page - 1) * page_size
    return {
        'query': q, 'category': category, 'total': len(items),
        'page': page, 'page_size': page_size,
        'items': items[start:start + page_size],
        'offline': True,
        'disclaimer': '离线药典为编辑性教学整理，须核对本院制剂说明书与最新指南；不能直接形成医嘱。',
    }


@app.get('/api/formulary/{drug_id}')
async def formulary_detail(drug_id: str):
    for item in _formulary_items():
        if str(item.get('id')) == drug_id:
            return {'item': item, 'offline': True,
                    'dose_rules': dose_rules_for(drug_id),
                    'relations': relations_for('drug', drug_id),
                    'disclaimer': '离线药典为编辑性教学整理，须核对本院制剂说明书与最新指南；不能直接形成医嘱。'}
    raise HTTPException(404, '离线药典中没有该条目。')


@app.get('/api/dose-rules')
async def dose_rules(drug_id: str = Query(default='', max_length=80)):
    """V1.6 结构化教学剂量规则：只做“体重×区间”的数学演示，不是处方。"""
    items = DOSE_RULES.get('items') or []
    if drug_id:
        record = dose_rules_for(drug_id)
        if not record:
            raise HTTPException(404, '该药物没有可结构化的教学剂量规则，请查看药典条目原文。')
        return {'item': record, 'policy': DOSE_RULES.get('policy') or {},
                'warning': '规则由条目文本抽取，未经药事审核；任何计算都须核对说明书与本院规范。'}
    return {'counts': DOSE_RULES.get('counts') or {},
            'policy': DOSE_RULES.get('policy') or {},
            'items': items,
            'warning': '全部规则 verified=false，只用于教学演示。'}


@app.get('/api/relations')
async def relations(etype: str = Query(default='', alias='type', max_length=12),
                    rid: str = Query(default='', alias='id', max_length=80)):
    if not etype or not rid:
        return {'counts': RELATIONS.get('counts') or {}, 'policy': RELATIONS.get('policy') or '',
                'index_size': len(RELATIONS.get('index') or {})}
    items = relations_for(etype, rid)
    return {'type': etype, 'id': rid, 'count': len(items), 'items': items,
            'policy': RELATIONS.get('policy') or ''}


@lru_cache(maxsize=1)
def _search_corpus() -> list[tuple[str, str, str, str]]:
    """(kind, id, label, haystack) —— 一次性构建，接口只做字符串匹配。"""
    corpus: list[tuple[str, str, str, str]] = []

    def compact(value) -> str:
        if isinstance(value, (list, dict)):
            value = json.dumps(value, ensure_ascii=False)
        return re.sub(r'\s+', '', str(value or '')).casefold()

    for p in CLINICAL.get('clinical_paths') or []:
        text = compact([p.get(k) for k in ('title', 'category', 'recognition', 'exams', 'differential',
                                           'management', 'infusion', 'medication', 'special', 'notes')])
        corpus.append(('path', p['id'], p['title'], text))
    for s in LEARNING.get('systems') or []:
        for t in s.get('topics') or []:
            corpus.append(('topic', t['id'], t['title'],
                           compact([s.get('name'), t.get('title'), t.get('keywords'), list((t.get('content') or {}).values())])))
    for l in CLINICAL.get('lab_tests') or []:
        corpus.append(('lab', l['code'], l['name'],
                       compact([l.get('code'), l.get('name'), l.get('meaning'), l.get('high'), l.get('low'), l.get('caution')])))
    for e in CLINICAL.get('examination_terms') or []:
        corpus.append(('exam', e['id'], e['term'],
                       compact([e.get('term'), e.get('modality'), e.get('meaning'), e.get('pitfall')])))
    for d in _formulary_items():
        corpus.append(('drug', d['id'], d.get('generic_name', ''),
                       compact([d.get('generic_name'), d.get('aliases'), d.get('drug_class'),
                                d.get('indications'), d.get('peds_notes'), d.get('dose_note')])))
    for q in QUIZ.get('items') or []:
        corpus.append(('quiz', q['id'], q.get('title', ''),
                       compact([q.get('title'), q.get('category'), q.get('stem'), q.get('choices'), q.get('explanation'), q.get('pitfall')])))
    for c in _sim_cases():
        corpus.append(('case', c['id'], c.get('title', ''),
                       compact([c.get('title'), c.get('chief'), c.get('diagnoses'), c.get('opening'), c.get('system')])))
    return corpus


@app.get('/api/search/all')
async def search_all(q: str = Query(min_length=1, max_length=60),
                     limit: int = Query(default=8, ge=1, le=20)):
    needle = re.sub(r'\s+', '', q).casefold()
    if not needle:
        raise HTTPException(422, '请输入检索词。')
    groups: dict[str, list[dict]] = {}
    totals: dict[str, int] = {}
    labels = {'path': '诊疗路径', 'topic': '学习专题', 'lab': '化验项目', 'exam': '检查术语',
              'drug': '离线药典', 'quiz': '循证练习', 'case': '模拟病例'}
    for kind, ident, label, text in _search_corpus():
        if needle not in text:
            continue
        totals[kind] = totals.get(kind, 0) + 1
        bucket = groups.setdefault(kind, [])
        if len(bucket) < limit:
            idx = text.find(needle)
            snippet = text[max(0, idx - 18):idx + len(needle) + 26]
            bucket.append({'id': ident, 'label': label, 'snippet': snippet})
    facets = [{'kind': kind, 'kind_label': labels[kind], 'total': totals[kind], 'items': groups[kind]}
              for kind in labels if kind in groups]
    return {'query': q, 'total': sum(totals.values()), 'facets': facets,
            'policy': '检索只匹配本机静态内容，不联网、不修改数据；命中不代表医学结论一致。'}


@app.get('/api/content/version')
async def content_version():
    """内容包版本与文件指纹，供 PWA 判断是否需要更新缓存。"""
    files = {}
    for name in ('clinical_extension.json', 'learning.json', 'quiz_cases.json',
                 'simulation_cases.json', 'drug_formulary.json', 'lab_reference_ranges.json',
                 'dose_rules.json', 'relations.json', 'medical_audit.json'):
        path = ROOT / 'data' / name
        try:
            payload = path.read_bytes()
        except OSError:
            files[name] = {'exists': False}
            continue
        files[name] = {'exists': True, 'bytes': len(payload),
                       'sha256': hashlib.sha256(payload).hexdigest()[:16]}
    return {'app_version': app.version, 'files': files,
            'counts': content_overview(),
            'policy': '指纹只用于缓存失效判断，不代表内容已通过医学审核。'}


@app.get('/api/quiz')
async def quiz_alias():
    return QUIZ


@app.get('/api/labs/reference')
async def lab_reference(code: str = Query(default='', max_length=30)):
    items = _lab_range_items()
    if code:
        wanted = code.strip().casefold()
        items = [x for x in items if str(x.get('code', '')).casefold() == wanted]
        if not items:
            raise HTTPException(404, '该检验项目暂无独立参考区间条目，请以报告单参考区间为准。')
    return {
        'count': len(items),
        'items': items,
        'policy': LAB_RANGES.get('policy') or {},
        'warning': '参考区间须以本院报告单的同方法、同年龄区间为准；新生儿不可套用28天以上儿童区间。',
        'disclaimer': '教学区间，未经检验医师审定。',
    }


@app.get('/api/sim/scenarios')
async def sim_scenarios():
    scenarios = _sim_scenarios()
    return {
        'cases': len(_sim_cases()),
        'scenarios': len(scenarios),
        'items': scenarios,
        'catalogue': {k: v for k, v in (SIM_LIBRARY.get('catalogue') or {}).items() if k != 'scenarios'},
        'disclaimer': '场景与病例均为虚构教学材料，复评脚本不是生理仿真，不能预测真实患儿病情。',
    }


@app.get('/api/library')
async def library_index():
    books = [b for b in (LIBRARY.get('books') or []) if isinstance(b, dict)]
    return {
        'count': len(books),
        'books': books,
        'chunks': sum(int(b.get('chunks') or 0) for b in books),
        'chars': sum(int(b.get('chars') or 0) for b in books),
        'policy': LIBRARY.get('policy') or {
            'scope': '用户自备电子书的个人本机检索，不随源码分发',
            'copyright': '书籍版权归原作者与出版方；请只导入你有权使用的版本',
        },
        'warning': '书库内容是本机导入的电子书文本，检索结果为原文片段；不等于医学结论或指南原文已经核验。',
    }


@lru_cache(maxsize=1)
def _library_index() -> tuple[tuple[dict, ...], dict[str, dict]]:
    """把每本书的章节区间挂到块上，形成一次构建、反复检索的索引。"""
    chapter_by_chunk: dict[str, dict[int, dict]] = {}
    for book_id, book in (CHAPTERS.get("books") or {}).items():
        mapping: dict[int, dict] = {}
        for chapter in book.get("chapters") or []:
            for index in range(int(chapter.get("chunk_start") or 0), int(chapter.get("chunk_end") or -1) + 1):
                mapping[index] = chapter
        chapter_by_chunk[book_id] = mapping
    rows: list[dict] = []
    for info in (LIBRARY.get("books") or []):
        if not isinstance(info, dict):
            continue
        book_id = str(info.get("id"))
        chapters = chapter_by_chunk.get(book_id, {})
        for index, chunk in enumerate(_library_chunks(book_id)):
            chapter = chapters.get(index) or {}
            rows.append({
                "book_id": book_id,
                "book_title": info.get("title"),
                "chunk": index,
                "locator": chunk.get("p") or "",
                "text": str(chunk.get("t") or ""),
                "chapter_id": chapter.get("id", ""),
                "chapter_no": chapter.get("no", 0),
                "chapter_title": chapter.get("title", ""),
                "system": chapter.get("system", ""),
            })
    return tuple(rows), chapter_by_chunk


def _snippet(text: str, needle: str, width: int = 70) -> tuple[str, int]:
    pos = text.find(needle)
    if pos < 0:
        return text[:width * 2], -1
    start = max(0, pos - width)
    end = min(len(text), pos + len(needle) + width)
    return text[start:end], pos - start


@app.get('/api/library/search')
async def library_search(q: str = Query(min_length=1, max_length=60),
                        book: str = Query(default='', max_length=80),
                        system: str = Query(default='', max_length=40),
                        chapter: str = Query(default='', max_length=80),
                        page: int = Query(default=1, ge=1, le=200),
                        page_size: int = Query(default=20, ge=1, le=50)):
    needle = q.strip()
    if not needle:
        raise HTTPException(422, '请输入检索词。')
    rows, _ = _library_index()
    allowed: set[str] | None = None
    if system:
        allowed = {c.get('chapter_id') for s_ in (SYSTEM_MAP.get('systems') or [])
                   if s_.get('id') == system for c in (s_.get('chapters') or [])}
        if not allowed:
            raise HTTPException(404, '学习系统不存在或还没有关联章节。')

    table = {str(k): [str(x) for x in (v or [])] for k, v in (SYNONYMS.get('terms') or {}).items()}
    expanded: list[str] = []
    for key, values in table.items():
        if needle in key or key in needle:
            for value in values:
                if value != needle and value not in expanded:
                    expanded.append(value)
    expanded = expanded[:8]
    terms: list[tuple[str, float]] = [(needle, 1.0)] + [(tool, 0.85) for tool in expanded]

    sections_by_chapter: dict[str, list[dict]] = {}
    for info in (CHAPTERS.get('books') or {}).values():
        for item in info.get('chapters') or []:
            sections_by_chapter[str(item.get('id'))] = item.get('sections') or []

    def section_at(chapter_id: str, chunk_index: int, offset: int) -> str:
        entries = sections_by_chapter.get(chapter_id, [])
        found = ''
        for entry in entries:
            entry_chunk = int(entry.get('chunk') or 0)
            if entry_chunk < chunk_index or (entry_chunk == chunk_index and int(entry.get('offset') or 0) <= max(offset, 0)):
                found = str(entry.get('title') or '')
        if not found and entries:
            found = str(entries[0].get('title') or '')
        return found

    scored: list[dict] = []
    for row in rows:
        if book and row['book_id'] != book:
            continue
        if allowed is not None and row['chapter_id'] not in allowed:
            continue
        if chapter and row['chapter_id'] != chapter:
            continue
        text = row['text']
        best_score, best_term = 0.0, ''
        for term, weight in terms:
            hits = text.count(term)
            if not hits and term not in row['chapter_title'] and term not in row['locator']:
                continue
            raw = min(hits, 5) + (10 if term in row['chapter_title'] else 0) \
                + (4 if term in row['locator'] else 0) + (3 if hits else 0)
            weighted = raw * weight
            if weighted > best_score:
                best_score, best_term = weighted, term
        if not best_term:
            continue
        snippet, hit_at = _snippet(text, best_term)
        scored.append({
            'book_id': row['book_id'], 'book_title': row['book_title'],
            'chunk': row['chunk'], 'locator': row['locator'],
            'chapter_id': row['chapter_id'], 'chapter_no': row['chapter_no'],
            'chapter_title': row['chapter_title'], 'system': row['system'],
            'section': section_at(row['chapter_id'], row['chunk'], hit_at),
            'matched_term': best_term, 'score': round(best_score, 2),
            'snippet': snippet, 'hit_at': hit_at,
        })

    scored.sort(key=lambda item: (-item['score'], item['chapter_no'], item['chunk']))

    groups: dict[str, dict] = {}
    for item in scored:
        key = item['chapter_id'] or (item['book_id'] + '|' + item['locator'].split(' · ')[0])
        group = groups.get(key)
        if group is None:
            group = {'key': key, 'book_id': item['book_id'], 'book_title': item['book_title'],
                     'chapter_id': item['chapter_id'], 'chapter_title': item['chapter_title'],
                     'chapter_no': item['chapter_no'], 'system': item['system'],
                     'count': 0, 'first_chunk': item['chunk'], 'snippets': [], 'sections': []}
            groups[key] = group
        group['count'] += 1
        if len(group['snippets']) < 3:
            group['snippets'].append({'chunk': item['chunk'], 'locator': item['locator'],
                                      'section': item.get('section') or '',
                                      'matched_term': item.get('matched_term') or needle,
                                      'snippet': item['snippet'], 'score': item['score']})
        if item.get('section') and item['section'] not in group['sections']:
            group['sections'].append(item['section'])
    ranked = sorted(groups.values(), key=lambda g: (-g['count'], g['chapter_no']))

    counts = Counter()
    for item in scored:
        counts[(item['book_id'], item['book_title'])] += 1
    system_counts = Counter(item['system'] or '未归类' for item in scored)
    start = (page - 1) * page_size
    return {
        'query': q, 'total': len(scored), 'page': page, 'page_size': page_size,
        'items': scored[start:start + page_size],
        'groups': ranked[:40], 'group_total': len(ranked),
        'facets': {
            'books': [{'id': bid, 'title': title, 'count': count} for (bid, title), count in counts.most_common()],
            'systems': [{'id': sid, 'count': count} for sid, count in system_counts.most_common(10)],
        },
        'expanded': expanded,
        'policy': '命中是原文（含同义词）子串匹配并按章名加权排序，不代表用药或诊断结论；请回到原书页面核对。',
    }


@app.get('/api/library/chapters')
async def library_chapter_index(book: str = Query(default='', max_length=80)):
    books = CHAPTERS.get('books') or {}
    names = {s.get('id'): s.get('name') for s in (SYSTEM_MAP.get('systems') or [])}
    output = []
    for book_id, info in books.items():
        if book and book_id != book:
            continue
        chapters = [dict(c, system_name=names.get(c.get('system', ''), '')) for c in info.get('chapters') or []]
        output.append({'id': book_id, 'title': info.get('title'), 'volume': info.get('volume'),
                       'pages': info.get('pages'), 'chapters': chapters})
    return {'books': output, 'systems': [{'id': s.get('id'), 'name': s.get('name'),
                                          'count': len(s.get('chapters') or [])}
                                         for s in (SYSTEM_MAP.get('systems') or [])],
            'unmapped': SYSTEM_MAP.get('unmapped') or []}


@app.get('/api/library/chapter/{chapter_id}')
async def library_chapter_detail(chapter_id: str):
    for book_id, info in (CHAPTERS.get('books') or {}).items():
        for chapter in info.get('chapters') or []:
            if chapter.get('id') != chapter_id:
                continue
            chunks = _library_chunks(book_id)
            start, end = int(chapter['chunk_start']), int(chapter['chunk_end'])
            items = [{'i': index, 'p': c.get('p'), 't': c.get('t')}
                     for index, c in enumerate(chunks) if start <= index <= end][:400]
            return {'book_id': book_id, 'book_title': info.get('title'), 'chapter': chapter,
                    'sections': chapter.get('sections') or [], 'items': items}
    raise HTTPException(404, '找不到该章节。')


@app.get('/api/learning/{system_id}/books')
async def learning_system_books(system_id: str):
    for system in SYSTEM_MAP.get('systems') or []:
        if system.get('id') == system_id:
            return {'system': {'id': system.get('id'), 'name': system.get('name')},
                    'chapters': system.get('chapters') or [],
                    'note': '章节来自已导入电子书的目录，点开可跳到原书正文。'}
    raise HTTPException(404, '学习系统不存在。')


@app.get('/api/library/{book_id}/chunks')
async def library_chunks(book_id: str,
                         start: int = Query(default=0, ge=0),
                         count: int = Query(default=20, ge=1, le=100)):
    books = {b.get('id'): b for b in (LIBRARY.get('books') or []) if isinstance(b, dict)}
    if book_id not in books:
        raise HTTPException(404, '书库中没有该电子书。')
    chunks = _library_chunks(book_id)
    if not chunks:
        raise HTTPException(404, '该书还没有导入文本。')
    page = list(chunks[start:start + count])
    return {'book': books[book_id], 'total': len(chunks), 'start': start,
            'count': len(page), 'items': page}


# ---------------------------------------------------------------------------
# V1.8 官方目录检索：医保药品目录（离线可查） + 上市药品批文目录（服务端查）
# ---------------------------------------------------------------------------

INSURANCE = _load_optional_data("insurance_catalog.json", {"items": [], "count": 0, "source": ""})


APPROVAL_META_PATH = ROOT / "data" / "approval_catalog_meta.json"
APPROVAL_TSV_PATH = ROOT / "data" / "approval_catalog.tsv.gz"


def _approval_meta() -> dict:
    try:
        return json.loads(APPROVAL_META_PATH.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def _approval_hits(q: str, limit: int = 500) -> tuple[list[dict], int]:
    """流式扫描 gz TSV：155k 行约 5MB，不把整表读进内存。"""
    if not APPROVAL_TSV_PATH.exists():
        return [], 0
    import gzip

    needle = q.casefold().strip()
    meta = _approval_meta()
    columns = meta.get("columns") or ["name", "approval_number", "dosage_form", "specification",
                                      "manufacturer", "category"]
    hits: list[dict] = []
    total = 0
    with gzip.open(APPROVAL_TSV_PATH, "rt", encoding="utf-8", errors="replace") as fh:
        for line in fh:
            if needle and needle not in line.casefold():
                continue
            total += 1
            if len(hits) < limit:
                parts = line.rstrip("\n").split("\t")
                if len(parts) < len(columns):
                    parts += [""] * (len(columns) - len(parts))
                hits.append(dict(zip(columns, parts)))
    return hits, total


def _catalog_page(items, q: str, page: int, page_size: int, fields: tuple[str, ...]) -> dict:
    needle = q.casefold().strip()
    matched = []
    for item in items:
        text = ' '.join(str(item.get(k) or '') for k in fields).casefold()
        if needle in text:
            matched.append(item)
            if len(matched) >= 2000:  # 防御：超长结果不继续遍历
                break
    start = (page - 1) * page_size
    return {'total': len(matched), 'page': page, 'page_size': page_size,
            'items': matched[start:start + page_size]}


@app.get('/api/catalog/insurance')
async def catalog_insurance(q: str = Query(default='', max_length=40),
                            page: int = Query(default=1, ge=1, le=100),
                            page_size: int = Query(default=20, ge=1, le=100)):
    items = [x for x in (INSURANCE.get('items') or []) if isinstance(x, dict)]
    payload = _catalog_page(items, q, page, page_size,
                           ('name', 'dosage_form', 'insurance_class', 'note', 'section', 'atc_category'))
    payload.update({'source': INSURANCE.get('source'), 'catalog_count': len(items),
                    'policy': '按官方公开 PDF 整理的检索结果，费用类别与限定支付以最新官方目录为准。'})
    return payload


@app.get('/api/catalog/approval')
async def catalog_approval(q: str = Query(default='', max_length=40),
                           page: int = Query(default=1, ge=1, le=100),
                           page_size: int = Query(default=20, ge=1, le=100)):
    hits, total = _approval_hits(q)
    if total == 0 and not APPROVAL_TSV_PATH.exists():
        raise HTTPException(503, '服务端未部署批文目录：先执行 python tools/build_catalogs.py --approval <nmpa zip>。')
    start = (page - 1) * page_size
    return {'total': total, 'page': page, 'page_size': page_size,
            'items': hits[start:start + page_size],
            'catalog_count': _approval_meta().get('count') or total,
            'official_verification': NMPA_URL,
            'policy': '数据来自国家药监局公开数据的 2020 快照，批准文号状态请到官网复核。'}


@app.get('/api/catalog/stats')
async def catalog_stats():
    insurance = [x for x in (INSURANCE.get('items') or []) if isinstance(x, dict)]
    return {
        'insurance': {'count': len(insurance),
                      'by_section': dict(Counter(str(x.get('section')) for x in insurance)),
                      'source': INSURANCE.get('source')},
        'approval': {'count': _approval_meta().get('count', 0),
                     'source': _approval_meta().get('source', '国家药监局公开数据（2020 快照）')},
        'note': '医保目录可离线检索；批文目录较大，只在服务端查询。',
    }


app.include_router(admin_router)

# 静态资源路由必须位于所有 /api/* 接口之后，避免遮蔽新路由。
app.mount('/', StaticFiles(directory=WEB), name='web')

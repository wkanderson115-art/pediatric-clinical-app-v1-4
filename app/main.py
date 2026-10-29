"""中国儿科临床药典 PWA 后端。

公开国家药监局网站只提供人工核验入口，不调用未经授权的 NMPA 内部 API。
第三方中文说明书与批文数据库相互独立，不将第三方数据标记为官方核验。
非临床决策支持系统，不产生诊疗或处方医嘱。
"""
import os
import secrets
import re
import json
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

app = FastAPI(title="儿科临床药典 · 中国版", version="1.4.0", docs_url=None, redoc_url=None)
LEARNING_PATH = ROOT / "data" / "learning.json"
LEARNING = json.loads(LEARNING_PATH.read_text(encoding="utf-8"))
CLINICAL = json.loads((ROOT / "data" / "clinical_extension.json").read_text(encoding="utf-8"))
SOURCES = json.loads((ROOT / "data" / "source_registry.json").read_text(encoding="utf-8"))
QUIZ = json.loads((ROOT / "data" / "quiz_cases.json").read_text(encoding="utf-8"))


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
    pref = os.environ.get("DRUG_PROVIDER", "auto").lower()
    keys = {"moseng": bool(get_value("MOSENG_API_KEY")),
            "tianapi": bool(get_value("TIANAPI_KEY"))}
    if pref == "auto":
        return "moseng" if keys["moseng"] else "tianapi" if keys["tianapi"] else None
    return pref if pref in keys and keys[pref] else None


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
    async with httpx.AsyncClient(timeout=12, follow_redirects=False) as client:
        response = await client.post(
            url, headers={'Authorization': get_value('MOSENG_API_KEY'), 'Content-Type': 'application/json'},
            json=query)
        response.raise_for_status()
        return response.json()


@app.get('/api/status')
async def status():
    p = provider()
    return {
        'connected': bool(p), 'provider': p,
        'approval_lookup_connected': bool(get_value('MOSENG_API_KEY')),
        'official_nmpa_api_connected': False,
        'official_url': NMPA_URL,
        'mode': '第三方在线说明书' if p else '尚未配置中文说明书数据源',
        'disclaimer': '国家药监局须人工核验；第三方检索结果不代表官方实时认证。',
        'ai_ready': bool(get_value('AI_API_KEY')) and bool(os.environ.get('APP_ACCESS_CODE')),
        'ai_model': DEEPSEEK_MODEL,
        'learning_count': sum(len(x['topics']) for x in LEARNING['systems'])
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
            async with httpx.AsyncClient(timeout=12, follow_redirects=False) as client:
                response = await client.post(TIANAPI_URL, data={
                    'key': get_value('TIANAPI_KEY'), 'word': q, 'num': '10', 'page': str(page)})
                response.raise_for_status()
                records = normalize_tianapi(response.json(), q)
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
        raise HTTPException(503, '批文自动检索尚未配置：需另外取得摩熵中国药品批文库 API 权限。可使用国家药监局官网手工核验。')
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
        async with httpx.AsyncClient(timeout=28, follow_redirects=False) as client:
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
        async with httpx.AsyncClient(timeout=35, follow_redirects=False) as client:
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

app.include_router(admin_router)

# 静态资源路由必须位于所有 /api/* 接口之后，避免遮蔽新路由。
app.mount('/', StaticFiles(directory=WEB), name='web')

"""V1.6：从离线药典的 dose_note / max_single 文本中抽取结构化教学剂量规则。

设计原则：
- 不新增任何数值，只抽取作者已经写进 dose_note 的区间；抽取不到就留空并说明原因。
- 输出一律 verified=false，并标记“由条目文本抽取，非说明书原文”。
- 目的是让前端能做“体重→教学区间”“是否超过单次上限”的数学演示，不生成处方。
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data'

RANGE_RE = re.compile(r'(\d+(?:\.\d+)?)\s*[–\-~～至]\s*(\d+(?:\.\d+)?)\s*(万)?\s*(mg|g|μg|ug|ml|mL|U|IU)\s*/\s*kg')
WAN_RANGE_RE = re.compile(r'(\d+(?:\.\d+)?)\s*万\s*[–\-~～至]\s*(\d+(?:\.\d+)?)\s*万\s*(U|IU)\s*/\s*kg')
SINGLE_RE = re.compile(r'(\d+(?:\.\d+)?)\s*(mg|g|μg|ug|ml|mL|U|IU)\s*/\s*kg')
TIMES_RE = re.compile(r'分\s*(\d)\s*(?:[–\-~～至]\s*(\d))?\s*次')
MAX_SINGLE_RE = re.compile(r'单次[^。；]{0,16}?不超过\s*(\d+(?:\.\d+)?)\s*(mg|g)')
MAX_DAILY_RE = re.compile(r'(?:单日(?:总量)?|日总量|每日总量|一日总量)[^。；]{0,12}?不超过\s*(\d+(?:\.\d+)?)\s*(mg|g)')
AGE_RE = re.compile(r'(\d+)\s*(月龄|个月|岁)\s*(?:以上|起|至)')
FIXED_AGE_DOSE_RE = re.compile(r'(\d+(?:\.\d+)?)\s*(mg|g)\s*[，,、]\s*每日\s*(\d)')
ROUTES = [
    ('口服', ('口服', '干混悬', '颗粒剂', '片剂', '胶囊', '糖浆', '混悬剂')),
    ('静脉', ('静脉', '静滴', '静注', '注射液')),
    ('肌内注射', ('肌注', '肌内')),
    ('雾化吸入', ('雾化', '吸入')),
    ('外用/局部', ('外用', '乳膏', '软膏', '滴眼', '滴耳', '鼻喷')),
]


def to_mg(value: float, unit: str) -> float:
    if unit == 'g':
        return value * 1000
    if unit in ('U', 'IU'):
        return value
    return value


def detect_routes(item: dict) -> list[str]:
    text = ' '.join([item.get('dose_note', ''), ' '.join(item.get('forms') or [])])
    routes = [name for name, keys in ROUTES if any(k in text for k in keys)]
    return routes or ['未标注（须核对说明书）']


def parse_item(item: dict) -> dict:
    text = item.get('dose_note', '') or ''
    match = WAN_RANGE_RE.search(text) or RANGE_RE.search(text)
    single_only = None
    if not match:
        single_only = SINGLE_RE.search(text)
    rules: list[dict] = []
    if match:
        low = float(match.group(1))
        high = float(match.group(2))
        if match.re is WAN_RANGE_RE:
            low, high, unit = low * 10000, high * 10000, 'U'
        else:
            prefix = match.group(3) or ''
            unit = match.group(4).lower().replace('ug', 'μg')
            unit = 'ml' if unit in ('ml',) else unit
            if prefix == '万':
                low, high, unit = low * 10000, high * 10000, 'U'
        basis = '日' if re.search(r'/\s*kg\s*/?\s*日|每日|/日', text) else '次'
        rules.append(build_rule(item, low, high, unit, basis, text, match.group(0)))
    elif single_only:
        value = float(single_only.group(1))
        unit = single_only.group(2).lower().replace('ug', 'μg')
        basis = '日' if re.search(r'/\s*kg\s*/?\s*日|每日|/日', text) else '次'
        rules.append(build_rule(item, value, value, unit, basis, text, single_only.group(0), single_value=True))
    max_daily = MAX_DAILY_RE.search(text)
    record = {
        'drug_id': item['id'],
        'generic_name': item['generic_name'],
        'rules': rules,
        'fixed_age_dose_text': (FIXED_AGE_DOSE_RE.search(text).group(0) if FIXED_AGE_DOSE_RE.search(text) else ''),
        'max_daily_text': max_daily.group(0) if max_daily else '',
        'basis': '由本条目 dose_note 文本抽取，非说明书原文；数值仅供教学演示',
        'status': '教学区间待核对' if rules else '本条无可抽取的体重区间（可能按年龄分档或仅限专业操作），一律以说明书与本院规范为准',
        'verified': False,
        'review_status': '编辑性抽取，未经药事/临床专家审核；不能作为处方依据',
    }
    return record


def build_rule(item: dict, low: float, high: float, unit: str, basis: str, text: str,
               source_text: str, single_value: bool = False) -> dict:
    times_match = TIMES_RE.search(text)
    times: list[int] = []
    if times_match:
        times.append(int(times_match.group(1)))
        if times_match.group(2):
            times.append(int(times_match.group(2)))
    single_match = MAX_SINGLE_RE.search(text) or MAX_DAILY_RE.search(text)
    max_single = None
    if single_match:
        max_single = to_mg(float(single_match.group(1)), single_match.group(2))
    age = AGE_RE.search(text)
    return {
        'route': detect_routes(item)[0],
        'basis': basis,
        'low': low,
        'high': high,
        'unit': 'U' if unit in ('U', 'IU') else unit,
        'times_per_day': sorted(set(times)) if times else [],
        'max_single': max_single,
        'max_single_unit': 'mg' if max_single is not None else None,
        'single_value': single_value,
        'age_note': ('文中提及年龄条件：' + age.group(0)) if age else '',
        'source_text': source_text,
        'verified': False,
    }


def main() -> None:
    # 只读主药典文件：扩容包已由 tools/merge_v16_content.py 并入，
    # 若再读一次 v16 包会把新药重复计算。
    items = json.loads((DATA / 'drug_formulary.json').read_text(encoding='utf-8'))['items']
    records = [parse_item(item) for item in items]
    with_rules = [r for r in records if r['rules']]
    payload = {
        'version': '1.0',
        'updated': '2026-10-30',
        'edition': '儿科药典结构化教学剂量规则 V1.6',
        'policy': {
            'scope': '仅用于教学演示“体重×区间”的数学换算与上限提示',
            'not_a_prescription': True,
            'extraction': '数值来自各条目 dose_note 的原文区间，未新增数值',
            'verification': '全部规则 verified=false，须核对本院制剂说明书与最新指南',
        },
        'counts': {'drugs': len(records), 'with_rules': len(with_rules), 'without_rules': len(records) - len(with_rules)},
        'items': records,
    }
    (DATA / 'dose_rules.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    (ROOT / 'web' / 'dose_rules.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(payload['counts'], ensure_ascii=False))
    print('sample:', json.dumps(with_rules[0], ensure_ascii=False)[:400])


if __name__ == '__main__':
    main()

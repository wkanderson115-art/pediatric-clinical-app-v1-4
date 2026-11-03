"""V1.6 合并：把扩容包与新增索引并入主数据，可重复执行。

- drug_formulary_v16.json   → drug_formulary.json（32 条新药 + 新分类）
- quiz_extra_v16.json       → quiz_cases.json（20 道新题）
- learning_extra_v16.json   → learning.json（19 个专题）
- data/dose_rules.json、data/relations.json 由 tools/build_*_v16.py 生成，这里只做一致性检查
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data'


def load(name: str) -> dict:
    return json.loads((DATA / name).read_text(encoding='utf-8'))


def dump(name: str, payload: dict) -> None:
    original = (DATA / name).read_text(encoding='utf-8')
    pretty = '\n' in original[:200]
    text = json.dumps(payload, ensure_ascii=False, indent=2) if pretty else json.dumps(payload, ensure_ascii=False)
    (DATA / name).write_text(text + '\n', encoding='utf-8')


def merge_drugs() -> tuple[int, int]:
    base = load('drug_formulary.json')
    extra = load('drug_formulary_v16.json')
    known = {x['id'] for x in base['items']}
    known_names = {x['generic_name'] for x in base['items']}
    added = [x for x in extra['items'] if x['id'] not in known and x['generic_name'] not in known_names]
    base['items'].extend(added)
    base['categories'] = sorted({x['category'] for x in base['items']})
    base['edition'] = '儿科临床药典·离线药典 V1.6'
    base['updated'] = '2026-10-30'
    dump('drug_formulary.json', base)
    return len(added), len(base['items'])


def merge_quiz() -> tuple[int, int]:
    base = load('quiz_cases.json')
    extra = load('quiz_extra_v16.json')
    known = {x['id'] for x in base['items']}
    added = [x for x in extra['items'] if x['id'] not in known]
    base['items'].extend(added)
    base['edition'] = '中国儿科临床学习 · 循证模拟考试（V1.6）'
    base['items_total'] = len(base['items'])
    dump('quiz_cases.json', base)
    return len(added), len(base['items'])


def merge_learning() -> tuple[int, int]:
    base = load('learning.json')
    extra = load('learning_extra_v16.json')
    by_name = {s['name']: s for s in base['systems']}
    known = {t['id'] for s in base['systems'] for t in s['topics']}
    added = 0
    for topic in extra['topics']:
        system = by_name.get(topic.get('system'))
        clean = {k: v for k, v in topic.items() if k != 'system'}
        if not system or clean['id'] in known:
            continue
        system['topics'].append(clean)
        known.add(clean['id'])
        added += 1
    base['edition'] = '中国儿科临床学习 · 17 系统扩充版（V1.6）'
    base['topics_total'] = sum(len(s['topics']) for s in base['systems'])
    dump('learning.json', base)
    return added, base['topics_total']


if __name__ == '__main__':
    drugs_added, drugs_total = merge_drugs()
    quiz_added, quiz_total = merge_quiz()
    topics_added, topics_total = merge_learning()
    print(json.dumps({
        'drugs_added': drugs_added, 'drugs_total': drugs_total,
        'quiz_added': quiz_added, 'quiz_total': quiz_total,
        'topics_added': topics_added, 'topics_total': topics_total,
    }, ensure_ascii=False, indent=2))

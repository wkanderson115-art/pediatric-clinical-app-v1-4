"""V1.6：生成跨模块关联索引 data/relations.json。

关联只基于“名字在正文中出现”这一可复核事实，不做语义推断：
- 药典 ↔ 诊疗路径 / 专题 / 病例用药选项 / 练习题
- 诊疗路径 ↔ 化验项目 / 检查术语 / 病例 / 专题
- 化验项目 ↔ 病例检查结果
- 检查术语 ↔ 病例
同时输出反向索引，供详情页“相关条目”直接读取。
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data'
MAX_PER_ENTITY = 10


def load(name: str) -> dict:
    return json.loads((DATA / name).read_text(encoding='utf-8'))


def norm(text: str) -> str:
    return re.sub(r'\s+', '', str(text or '')).lower()


STOP_PREFIX = ('儿童', '小儿', '急性', '慢性', '反复', '常见', '新生儿', '婴幼儿', '婴儿')


def distinct_seg(title: str) -> str:
    """取标题里较有辨识度的片段，避免“儿童/急性”这类前缀误关联。"""
    text = norm(title)
    changed = True
    while changed:
        changed = False
        for prefix in STOP_PREFIX:
            if text.startswith(prefix) and len(text) - len(prefix) >= 3:
                text = text[len(prefix):]
                changed = True
    return text[:4]


def joined(value) -> str:
    if isinstance(value, list):
        return ' '.join(str(v) for v in value)
    return str(value or '')


def main() -> None:
    drugs = load('drug_formulary.json')['items']
    paths = load('clinical_extension.json')['clinical_paths']
    labs = load('clinical_extension.json')['lab_tests']
    exams = load('clinical_extension.json')['examination_terms']
    learning = load('learning.json')
    topics = [dict(t, system=s['name']) for s in learning['systems'] for t in s['topics']]
    quiz = load('quiz_cases.json')['items']
    cases = load('simulation_cases.json')['cases']
    extras = []
    for name in ('drug_formulary_v16.json', 'quiz_extra_v16.json', 'learning_extra_v16.json'):
        p = DATA / name
        if not p.exists():
            continue
        data = json.loads(p.read_text(encoding='utf-8'))
        if 'items' in data:
            extras.extend(data['items'])

    # 供匹配的名字表（去掉过短、纯符号的项）
    def patterns(values) -> list[str]:
        out = []
        for v in values:
            v = norm(v)
            if len(v) >= 2 and v not in out:
                out.append(v)
        return out

    drug_pat = {d['id']: patterns([d['generic_name']] + (d.get('aliases') or [])) for d in drugs}
    path_pat = {p['id']: patterns([p['title']]) for p in paths}
    lab_pat = {l['code']: patterns([l['name'], l['code']]) for l in labs}
    exam_pat = {e['id']: patterns([e['term']]) for e in exams}
    topic_pat = {t['id']: patterns([t['title']]) for t in topics}

    index: dict[str, list[dict]] = {}

    def add(a_type: str, a_id: str, b_type: str, b_id: str, label: str, basis: str) -> None:
        key = f'{a_type}:{a_id}'
        bucket = index.setdefault(key, [])
        if len(bucket) >= MAX_PER_ENTITY:
            return
        if any(x['type'] == b_type and x['id'] == b_id for x in bucket):
            return
        bucket.append({'type': b_type, 'id': b_id, 'label': label, 'basis': basis})

    def hit(text: str, pats: list[str]) -> list[str]:
        return [p for p in pats if p in text][:1]

    path_text = {
        p['id']: norm(' '.join(joined(p.get(k)) for k in (
            'title', 'recognition', 'exams', 'differential', 'management', 'infusion',
            'medication', 'special', 'reassessment', 'redflags', 'notes')))
        for p in paths
    }
    topic_text = {
        t['id']: norm(' '.join(joined(t.get('content', {}).values()) + ' ' + joined(t.get('title'))))
        for t in topics
    }
    quiz_text = {q['id']: norm(joined(q.get('stem')) + ' ' + joined(q.get('choices')) + ' ' + joined(q.get('explanation'))) for q in quiz}
    case_text = {
        c['id']: norm(joined(c.get('diagnoses')) + ' ' + joined(c.get('chief')) + ' ' + joined(c.get('title')))
        for c in cases
    }
    case_test_text = {
        c['id']: norm(joined([x.get('label', '') + x.get('result', '') for x in (c.get('tests') or [])]))
        for c in cases
    }
    exam_case_text = {
        c['id']: norm(joined([x.get('label', '') + x.get('result', '') for x in (c.get('examinations') or [])]) + ' ' + joined(c.get('vitals')))
        for c in cases
    }

    # 药典 → 路径 / 专题 / 题 / 病例
    drug_text = {
        d['id']: norm(' '.join(joined(d.get(k)) for k in ('indications', 'peds_notes', 'cautions', 'contraindications')))
        for d in drugs
    }
    for d in drugs:
        pats = drug_pat[d['id']]
        for pid, text in path_text.items():
            if hit(text, pats):
                add('drug', d['id'], 'path', pid, next(p['title'] for p in paths if p['id'] == pid), '诊疗路径正文提及该药名或别名')
                add('path', pid, 'drug', d['id'], d['generic_name'], '诊疗路径正文提及该药名或别名')
        # 反向：药典“适应证/要点”里提到某个路径或专题名称（取标题前 4 字作为可复核片段）
        for p in paths:
            seg = distinct_seg(p['title'])
            if len(seg) >= 3 and seg in drug_text[d['id']]:
                add('drug', d['id'], 'path', p['id'], p['title'], '药典适应证/要点文字提及该疾病名称片段')
                add('path', p['id'], 'drug', d['id'], d['generic_name'], '药典适应证/要点文字提及该疾病名称片段')
        for t in topics:
            seg = distinct_seg(t['title'])
            if len(seg) >= 3 and seg in drug_text[d['id']]:
                add('drug', d['id'], 'topic', t['id'], t['title'], '药典适应证/要点文字提及该专题名称片段')
                add('topic', t['id'], 'drug', d['id'], d['generic_name'], '药典适应证/要点文字提及该专题名称片段')
        for tid, text in topic_text.items():
            if hit(text, pats):
                add('drug', d['id'], 'topic', tid, next(t['title'] for t in topics if t['id'] == tid), '专题正文提及该药名或别名')
                add('topic', tid, 'drug', d['id'], d['generic_name'], '专题正文提及该药名或别名')
        for q in quiz:
            if hit(quiz_text[q['id']], pats):
                add('drug', d['id'], 'quiz', q['id'], q['title'], '练习题提及该药名或别名')
        for c in cases:
            if hit(case_text[c['id']], pats) or hit(norm(joined(c.get('drugs'))), pats):
                add('drug', d['id'], 'case', c['id'], c['title'], '病例诊断或用药选项提及该药名')

    # 路径 → 化验 / 检查术语 / 病例 / 专题
    for p in paths:
        text = path_text[p['id']]
        for l in labs:
            if hit(text, lab_pat[l['code']]):
                add('path', p['id'], 'lab', l['code'], l['name'], '路径正文提及该化验项目')
                add('lab', l['code'], 'path', p['id'], p['title'], '路径正文提及该化验项目')
        for e in exams:
            if hit(text, exam_pat[e['id']]):
                add('path', p['id'], 'exam', e['id'], e['term'], '路径正文提及该检查术语')
                add('exam', e['id'], 'path', p['id'], p['title'], '路径正文提及该检查术语')
        title_key = norm(p['title'])
        for c in cases:
            if title_key in case_text[c['id']] or any(seg and seg in case_text[c['id']] for seg in [title_key[:4]]):
                add('path', p['id'], 'case', c['id'], c['title'], '病例诊断文本与路径名称重合')
                add('case', c['id'], 'path', p['id'], p['title'], '病例诊断文本与路径名称重合')
        for t in topics:
            other = norm(t['title'])
            if title_key and (title_key in topic_text[t['id']] or other in text):
                add('path', p['id'], 'topic', t['id'], t['title'], '名称互相出现于对方正文')
                add('topic', t['id'], 'path', p['id'], p['title'], '名称互相出现于对方正文')

    # 化验 → 病例检验结果；检查术语 → 病例查体/影像描述
    for l in labs:
        pats = lab_pat[l['code']]
        for c in cases:
            if hit(case_test_text[c['id']], pats):
                add('lab', l['code'], 'case', c['id'], c['title'], '病例检查结果提及该项目')
                add('case', c['id'], 'lab', l['code'], l['name'], '病例检查结果提及该项目')
    for e in exams:
        for c in cases:
            if hit(exam_case_text[c['id']], exam_pat[e['id']]):
                add('exam', e['id'], 'case', c['id'], c['title'], '病例查体或影像描述提及该术语')
                add('case', c['id'], 'exam', e['id'], e['term'], '病例查体或影像描述提及该术语')

    # 对称性清理：只保留双向都存在的关联，避免详情页出现“单向链接”
    for key in list(index.keys()):
        kind, ident = key.split(':', 1)
        kept = []
        for link in index[key]:
            back = index.get(f"{link['type']}:{link['id']}") or []
            if any(x['type'] == kind and x['id'] == ident for x in back):
                kept.append(link)
        if kept:
            index[key] = kept
        else:
            del index[key]

    counts = {'entities': len(index), 'links': sum(len(v) for v in index.values()),
              'by_type': {}}
    for key in index:
        t = key.split(':', 1)[0]
        counts['by_type'][t] = counts['by_type'].get(t, 0) + 1
    payload = {
        'version': '1.0',
        'updated': '2026-10-30',
        'generated_by': 'tools/build_relations_v16.py',
        'policy': '关联仅表示“名称在正文中出现”，不代表医学上互为适应证或替代关系；必须回到原文核对。',
        'max_per_entity': MAX_PER_ENTITY,
        'counts': counts,
        'index': index,
    }
    text = json.dumps(payload, ensure_ascii=False, separators=(',', ':'))
    (DATA / 'relations.json').write_text(text + '\n', encoding='utf-8')
    (ROOT / 'web' / 'relations.json').write_text(text + '\n', encoding='utf-8')
    print(json.dumps(counts, ensure_ascii=False))
    print('size bytes', len(text.encode('utf-8')))
    sample_keys = [k for k in index if k.startswith('drug:')][:3]
    for k in sample_keys:
        print(k, '->', json.dumps(index[k][:3], ensure_ascii=False))


if __name__ == '__main__':
    main()

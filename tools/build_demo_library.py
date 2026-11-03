"""生成一本“自建教学示例书”，让离线书库在还没有导入任何电子书时也能端到端演示与测试。

内容全部来自本项目自己的数据（药典/化验参考区间/诊疗路径），不涉及任何第三方版权。
输出：data/library/demo_quickref.json + books.json 条目 + web/library/ 副本
"""
from __future__ import annotations

import json
import hashlib
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data'
LIB = DATA / 'library'
WEB_LIB = ROOT / 'web' / 'library'
CHUNK_CHARS = 1200


def load(name: str) -> dict:
    return json.loads((DATA / name).read_text(encoding='utf-8'))


def build_sections() -> list[tuple[str, str]]:
    sections: list[tuple[str, str]] = []
    drugs = load('drug_formulary.json')
    for item in drugs['items']:
        text = (
            f"{item['generic_name']}（{item['drug_class']}）\n"
            f"分类：{item['category']}\n"
            f"剂型：{'；'.join(item.get('forms') or [])}\n"
            f"适应证：{item.get('indications', '')}\n"
            f"儿科要点：{item.get('peds_notes', '')}\n"
            f"剂量原则：{item.get('dose_note', '')}\n"
            f"禁忌：{item.get('contraindications', '')}\n"
            f"监测：{item.get('monitoring', '')}\n"
            f"边界：{item.get('review_status', '')}"
        )
        sections.append((f"药典 · {item['generic_name']}", text))
    ranges = load('lab_reference_ranges.json')
    for item in ranges['items']:
        bands = '；'.join(
            f"{b['band']} {b['low']}–{b['high']}" for b in (item.get('ranges') or [])
        ) or '无数值区间'
        text = (
            f"{item['name']}（{item['code']}，单位 {item['unit']}）\n"
            f"教学参考区间：{bands}\n"
            f"方法学提示：{item.get('method_note', '')}\n"
            f"定性提示：{item.get('qualitative_hint', '') or '无'}"
        )
        sections.append((f"化验 · {item['name']}", text))
    clinical = load('clinical_extension.json')
    for path in clinical['clinical_paths']:
        text = (
            f"{path['title']}（{path['category']}）\n"
            f"识别：{path.get('recognition', '')}\n"
            f"检查与鉴别：{path.get('exams', '')}\n"
            f"治疗原则：{path.get('management', '')}\n"
            f"用药核对：{path.get('medication', '')}\n"
            f"危险信号：{path.get('redflags', '')}"
        )
        sections.append((f"路径 · {path['title']}", text))
    # 学习专题：把五段学习要点整理成书库条目，让离线书库开机就有实质内容
    learning = load('learning.json')
    for system in learning['systems']:
        for topic in system['topics']:
            body = '\n'.join(f"{k}：{v}" for k, v in (topic.get('content') or {}).items())
            sections.append((f"专题 · {system['name']} · {topic['title']}",
                             f"{topic['title']}（{system['name']}）\n{body}\n复习状态：{topic.get('review_status', '')}"))
    # 循证练习：题干 + 正确选项 + 解析，作为可检索的问答卡
    quiz = load('quiz_cases.json')
    for item in quiz['items']:
        correct = item['choices'][item['correct']] if item.get('choices') else ''
        sections.append((f"练习 · {item['category']} · {item['title']}",
                         f"{item['stem']}\n正确答案：{correct}\n解析：{item.get('explanation', '')}\n易错点：{item.get('pitfall', '')}"))
    # 模拟病例：主诉、诊断选项、教学解析，便于按症状检索
    sim = load('simulation_cases.json')
    for case in sim['cases']:
        sections.append((f"病例 · {case['title']}",
                         f"主诉：{case.get('chief', '')}\n年龄/性别/体重：{case.get('age', '')}岁 {case.get('sex', '')} {case.get('weight_kg', '')}kg\n"
                         f"生命体征：{case.get('vitals', '')}\n诊断选项：{'；'.join(case.get('diagnoses') or [])}\n"
                         f"教学解析：{case.get('reasoning', '')}"))
    return sections


def main() -> None:
    sections = build_sections()
    chunks = []
    for label, text in sections:
        for start in range(0, len(text), CHUNK_CHARS):
            piece = text[start:start + CHUNK_CHARS].strip()
            if piece:
                chunks.append({'i': len(chunks), 'p': label, 't': piece})
    book_id = 'demo_quickref'
    payload = {
        'version': '1.0',
        'book_id': book_id,
        'title': '儿科临床速查（本项目自建教学示例）',
        'chunks': chunks,
        'policy': '内容来自本项目自有数据，可随源码分发；不是任何出版物原文',
    }
    LIB.mkdir(parents=True, exist_ok=True)
    WEB_LIB.mkdir(parents=True, exist_ok=True)
    text = json.dumps(payload, ensure_ascii=False, separators=(',', ':'))
    (LIB / f'{book_id}.json').write_text(text + '\n', encoding='utf-8')
    (WEB_LIB / f'{book_id}.json').write_text(text + '\n', encoding='utf-8')

    books_path = LIB / 'books.json'
    data = json.loads(books_path.read_text(encoding='utf-8')) if books_path.exists() else {
        'version': '1.0', 'updated': '', 'policy': {}, 'books': []}
    data.setdefault('policy', {
        'scope': '用户自备电子书的个人本机检索，不随源码分发',
        'copyright': '书籍版权归原作者与出版方；请只导入你有权使用的版本',
        'offline': '导入后完全离线可检索，不上传任何内容',
    })
    data['books'] = [b for b in data['books'] if b.get('id') != book_id]
    data['books'].append({
        'id': book_id,
        'title': '儿科临床速查（本项目自建教学示例）',
        'authors': '本项目编辑',
        'publisher': '本机',
        'year': '2026',
        'edition': '1',
        'source_file': 'tools/build_demo_library.py',
        'format': 'generated',
        'chunks': len(chunks),
        'chars': sum(len(c['t']) for c in chunks),
        'bytes': len(text.encode('utf-8')),
        'sha256': hashlib.sha256(text.encode('utf-8')).hexdigest()[:16],
        'imported_at': '2026-11-03',
    })
    data['books'].sort(key=lambda b: b['id'])
    data['updated'] = '2026-11-03'
    out = json.dumps(data, ensure_ascii=False, indent=2)
    books_path.write_text(out + '\n', encoding='utf-8')
    (WEB_LIB / 'books.json').write_text(out + '\n', encoding='utf-8')
    print(f'demo 书生成：{len(chunks)} 块 / {sum(len(c["t"]) for c in chunks)} 字')


if __name__ == '__main__':
    main()

"""把已导入电子书（诸福棠第9版上下册）按学习系统拆成「原书精读」导航库。

产物：
    data/learning_books.json   17 个学习系统 → 章节（概述 + 小节导航）→ 小节跳转定位
    web/learning_books.json    离线副本

设计（不重复存全文、不伪造摘要）：
    正文已在书库；学习页只放「章级概述 + 小节标题导航 + 跳转定位」。
    章级概述只从该章正文里取一段真实段落（过滤目录页/页码噪声），取不到就留空；
    小节只保留标题与定位，点开跳书库对应块读全文。

用法：
    python tools/build_learning_from_books.py
    python tools/build_learning_from_books.py --report
"""
from __future__ import annotations

import argparse
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data'
WEB = ROOT / 'web'
OVERVIEW_CHARS = 260

SECTION_MARK = re.compile(r'第\s*\d+\s*节')
NOISE = re.compile(r'[·．…]{2,}|(?:[．.·]\s*){3,}')


def clean(text: str) -> str:
    text = text.replace('\u3000', ' ')
    text = re.sub(r'(?<=[\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])', '', text)
    return re.sub(r'[ \t]{2,}', ' ', text).strip()


def is_toc(text: str) -> bool:
    return len(SECTION_MARK.findall(text)) >= 3


def overview_of(chunks: list[dict], start: int, end: int) -> str:
    """从章内正文取一段可信概述：跳过目录页，挑最长且无页码噪声的段落。"""
    for index in range(start, min(end + 1, len(chunks))):
        text = clean(str(chunks[index].get('t') or ''))
        if not text or is_toc(text):
            continue
        best = ''
        buffer = ''
        for line in text.split('\n'):
            line = line.strip()
            if not line:
                continue
            buffer += line
            if len(buffer) >= 80 and re.search(r'[。！？]', buffer):
                if len(buffer) > len(best) and not NOISE.search(buffer):
                    best = buffer
                buffer = ''
        if len(buffer) > len(best) and not NOISE.search(buffer):
            best = buffer
        if len(best) >= 80:
            return best[:OVERVIEW_CHARS]
    return ''


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--report', action='store_true')
    args = parser.parse_args()

    chapters = json.loads((DATA / 'library' / 'chapters.json').read_text(encoding='utf-8'))
    system_map = json.loads((DATA / 'library' / 'system_map.json').read_text(encoding='utf-8'))
    learning = json.loads((DATA / 'learning.json').read_text(encoding='utf-8'))
    names = {s['id']: s['name'] for s in learning['systems']}

    chapter_index: dict[str, dict] = {}
    for book_id, book in chapters['books'].items():
        for chapter in book['chapters']:
            chapter_index[chapter['id']] = dict(chapter, book_id=book_id, book_title=book['title'])

    cache: dict[str, list[dict]] = {}

    def chunks_of(book_id: str) -> list[dict]:
        if book_id not in cache:
            cache[book_id] = json.loads(
                (DATA / 'library' / f'{book_id}.json').read_text(encoding='utf-8'))['chunks']
        return cache[book_id]

    systems_out = []
    total_sections = 0
    for system in system_map.get('systems') or []:
        chapters_out = []
        for ref in system.get('chapters') or []:
            chapter = chapter_index.get(ref['chapter_id'])
            if not chapter:
                continue
            book_chunks = chunks_of(chapter['book_id'])
            start, end = int(chapter['chunk_start']), int(chapter['chunk_end'])
            sections = []
            for section in chapter.get('sections') or []:
                chunk_index = int(section.get('chunk') or 0)
                sections.append({
                    'title': str(section.get('title') or chapter['title'])[:40],
                    'chunk': chunk_index,
                    'offset': int(section.get('offset') or 0),
                    'locator': str(book_chunks[chunk_index].get('p') or '') if chunk_index < len(book_chunks) else '',
                })
            total_sections += len(sections)
            chapters_out.append({
                'chapter_id': chapter['id'],
                'chapter_no': chapter['no'],
                'title': chapter['title'],
                'book_id': chapter['book_id'],
                'book_title': chapter['book_title'],
                'page_range': f"{chapter['start_page']}–{chapter['end_page']}",
                'chars': chapter['chars'],
                'overview': overview_of(book_chunks, start, end),
                'sections': sections,
            })
        systems_out.append({
            'id': system['id'],
            'name': names.get(system['id'], system['id']),
            'chapters': chapters_out,
            'section_count': sum(len(c['sections']) for c in chapters_out),
            'chars': sum(c['chars'] for c in chapters_out),
        })

    payload = {
        'version': '1.0',
        'updated': '2026-11-09',
        'source': '诸福棠实用儿科学（第9版）上下册 OCR 文本，按 17 个学习系统归类',
        'policy': '章级概述取自原书正文真实段落（OCR 可能有错字）；小节点击跳原书正文核对。',
        'total_chapters': sum(len(s['chapters']) for s in systems_out),
        'total_sections': total_sections,
        'systems': systems_out,
    }
    text = json.dumps(payload, ensure_ascii=False, separators=(',', ':'))

    if args.report:
        for system in systems_out:
            print(f"{system['name']:12s} 章{len(system['chapters']):2d} 小节{system['section_count']:4d} 字{system['chars']:>9,d}")
        print('合计章节', payload['total_chapters'], '小节', total_sections, '体积', len(text.encode('utf-8')))
        return

    (DATA / 'learning_books.json').write_text(text + '\n', encoding='utf-8')
    (WEB / 'learning_books.json').write_text(text + '\n', encoding='utf-8')
    print(f"learning_books.json: 17 系统 / {payload['total_chapters']} 章 / {total_sections} 小节 / {len(text.encode('utf-8'))} 字节")
    for system in systems_out:
        print(f"  {system['name']:12s} 章{len(system['chapters']):2d} 小节{system['section_count']:4d}")


if __name__ == '__main__':
    main()

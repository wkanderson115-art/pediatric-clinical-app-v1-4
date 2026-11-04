"""把书库电子书按「章」拆开，并归到学习系统的对应位置。

产物：
    data/library/chapters.json    每本书的章节树（章号、标题、PDF 页区间、块区间、字数、关键词、所属系统）
    data/library/system_map.json  17 个学习系统 → 关联章节（供学习页「延伸阅读」与书库筛选）
    web/library/*.json 同步副本（离线可用）

用法：
    python tools/build_chapters.py
    python tools/build_chapters.py --report     # 只打印归类结果，不写文件
"""
from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data'
WEB = ROOT / 'web'

# 章号 → 学习系统（按书名目录手工核对；未列出的进「未归类」）
CHAPTER_SYSTEM = {
    2: 'growth', 3: 'growth', 4: 'growth', 6: 'case', 7: 'neonate', 8: 'pharm',
    9: 'emergency', 13: 'case', 14: 'neonate', 15: 'growth', 16: 'allergy',
    17: 'allergy', 18: 'msk', 19: 'infection', 20: 'infection', 21: 'infection',
    22: 'infection', 23: 'infection', 24: 'infection', 25: 'resp', 26: 'digest',
    27: 'cardiac', 28: 'urinary', 29: 'blood', 30: 'neuro', 31: 'endo',
    33: 'endo', 35: 'urinary', 36: 'blood', 37: 'skin', 38: 'msk', 39: 'msk',
    40: 'eyeear', 41: 'eyeear', 42: 'eyeear', 43: 'emergency', 44: 'emergency',
    45: 'emergency', 46: 'blood',
}

TITLE_ALIASES = {
    '免液性': '免疫性', '真酸性': '真菌性', '肌肉系纸': '肌肉系统',
    '耳鼻咽版': '耳鼻咽喉', '生殖健康': '生殖健康',
}

CN_NUM = {'一': 1, '二': 2, '三': 3, '四': 4, '五': 5, '六': 6, '七': 7, '八': 8, '九': 9, '十': 10}

STOP = set('儿童小儿本病疾病患者临床治疗诊断检查表现症状常见可能以及进行出现发生使用需要注意情况相关主要由于各种上述如下所示见表图第页'.split())

TITLE_RE = re.compile(r'^第([一二三四五六七八九十百]+)章\s*(.+)$')
PAGE_RE = re.compile(r'PDF 第 (\d+)–(\d+) 页')
TERM_RE = re.compile(r'[\u4e00-\u9fff]{2,6}')


def cn_to_int(text: str) -> int:
    """一到四十六的中文数字转整数（够用即可）。"""
    if text.isdigit():
        return int(text)
    total = 0
    section = 0
    for char in text:
        if char == '百':
            total += (section or 1) * 100
            section = 0
        elif char == '十':
            total += (section or 1) * 10
            section = 0
        elif char in CN_NUM:
            section = CN_NUM[char]
    return total + section


def normalize_title(title: str) -> str:
    for wrong, right in TITLE_ALIASES.items():
        title = title.replace(wrong, right)
    return title


def keywords_of(texts: list[str], limit: int = 10) -> list[str]:
    counter: Counter[str] = Counter()
    for text in texts:
        for term in TERM_RE.findall(text):
            if term in STOP or len(term) < 2:
                continue
            counter[term] += 1
    return [term for term, count in counter.most_common(limit * 3) if count >= 3][:limit]


def build_book(book_id: str) -> dict | None:
    path = DATA / 'library' / f'{book_id}.json'
    if not path.exists():
        return None
    book = json.loads(path.read_text(encoding='utf-8'))
    chapters: list[dict] = []
    current = None
    for index, chunk in enumerate(book['chunks']):
        label = str(chunk.get('p') or '')
        head = label.split(' · ')[0].strip()
        match = TITLE_RE.match(head)
        if match:
            no = cn_to_int(match.group(1))
            title = normalize_title(head)
            if current is None or current['no'] != no:
                pages = PAGE_RE.search(label)
                current = {
                    'id': f"{book_id}-c{no:02d}",
                    'no': no,
                    'title': title,
                    'start_page': int(pages.group(1)) if pages else 0,
                    'end_page': int(pages.group(2)) if pages else 0,
                    'chunk_start': index,
                    'chunk_end': index,
                    'chars': 0,
                    'keywords': [],
                    'system': CHAPTER_SYSTEM.get(no, ''),
                    '_texts': [],
                }
                chapters.append(current)
        if current is None:
            continue
        current['chunk_end'] = index
        text = str(chunk.get('t') or '')
        current['chars'] += len(text)
        current['_texts'].append(text)
    for chapter in chapters:
        chapter['keywords'] = keywords_of(chapter.pop('_texts'))
        chapter['chunks'] = chapter['chunk_end'] - chapter['chunk_start'] + 1
    return {
        'id': book_id,
        'title': book.get('title'),
        'authors': book.get('authors'),
        'volume': book.get('volume', ''),
        'pages': book.get('pages', 0),
        'chapters': chapters,
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--report', action='store_true')
    args = parser.parse_args()

    learning = json.loads((DATA / 'learning.json').read_text(encoding='utf-8'))
    systems = [{'id': s['id'], 'name': s['name']} for s in learning['systems']]

    books_meta = json.loads((DATA / 'library' / 'books.json').read_text(encoding='utf-8'))
    result = {'version': '1.0', 'updated': '2026-11-04', 'books': {}}
    for entry in books_meta['books']:
        book = build_book(entry['id'])
        if book and book['chapters']:
            result['books'][book['id']] = book

    mapping: dict[str, list[dict]] = {s['id']: [] for s in systems}
    unmapped: list[dict] = []
    for book_id, book in result['books'].items():
        for chapter in book['chapters']:
            ref = {
                'book_id': book_id,
                'book_title': book['title'],
                'chapter_id': chapter['id'],
                'chapter_no': chapter['no'],
                'title': chapter['title'],
                'pages': f"{chapter['start_page']}–{chapter['end_page']}",
                'chars': chapter['chars'],
                'chunk_start': chapter['chunk_start'],
            }
            if chapter['system']:
                mapping[chapter['system']].append(ref)
            else:
                unmapped.append(ref)

    system_map = {
        'version': '1.0',
        'updated': '2026-11-04',
        'systems': [dict(s, chapters=mapping[s['id']]) for s in systems],
        'unmapped': unmapped,
        'note': '章节与学习系统的对应关系由 tools/build_chapters.py 按书名目录维护，可在该文件里调整 CHAPTER_SYSTEM。',
    }

    if args.report:
        for system in system_map['systems']:
            if system['chapters']:
                print(f"{system['name']}: " + '；'.join(c['title'] for c in system['chapters']))
        if unmapped:
            print('未归类: ' + '；'.join(c['title'] for c in unmapped))
        return

    for name, payload in (('chapters.json', result), ('system_map.json', system_map)):
        text = json.dumps(payload, ensure_ascii=False, separators=(',', ':'))
        (DATA / 'library' / name).write_text(text + '\n', encoding='utf-8')
        (WEB / 'library' / name).write_text(text + '\n', encoding='utf-8')
    total = sum(len(b['chapters']) for b in result['books'].values())
    mapped = sum(len(v) for v in mapping.values())
    print(f"chapters.json: {len(result['books'])} 本书 / {total} 章")
    print(f"system_map.json: 归入系统 {mapped} 章，未归类 {len(unmapped)} 章")
    for system in system_map['systems']:
        if system['chapters']:
            print(f"  {system['name']}: {len(system['chapters'])} 章")


if __name__ == '__main__':
    main()

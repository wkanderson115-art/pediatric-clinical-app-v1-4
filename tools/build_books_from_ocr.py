"""把「扫描版 PDF + 逐页 OCR 文本」构建成书库电子书（可增量、可重跑）。

用法：
    python tools/build_books_from_ocr.py                       # 上下册都构建（用已 OCR 的页）
    python tools/build_books_from_ocr.py --book zhufutang9a    # 只构建一本
    python tools/build_books_from_ocr.py --strict              # OCR 覆盖率低于 95% 直接报错

流程：
    PDF 书签（TOC）→ 章节与页区间 → 合并该区间已 OCR 的页文本 → 清理空白 → 每 1200 字切块
    → data/library/<book_id>.json + web/library/<book_id>.json + 更新 books.json

说明：
    - 未 OCR 的页会在章节块里标注「本页尚未 OCR」，OCR 跑完重跑本脚本即可补齐。
    - 章节页区间来自 PDF 书签（原始页码），与 OCR 文件 p000123.txt 一一对应。
"""
from __future__ import annotations

import argparse
import json
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data'
WEB = ROOT / 'web'
OCR_ROOT = DATA / 'library' / 'ocr'
RAW = DATA / 'library' / 'raw'

BOOKS = [
    {
        'id': 'zhufutang9a',
        'title': '诸福棠实用儿科学（第9版·上册）',
        'authors': '王天有 申昆玲 沈颖',
        'publisher': '人民卫生出版社',
        'edition': '9',
        'year': '2022',
        'volume': '上册',
        'pdf': '诸福棠实用儿科学第9版上.pdf',
    },
    {
        'id': 'zhufutang9b',
        'title': '诸福棠实用儿科学（第9版·下册）',
        'authors': '王天有 申昆玲 沈颖',
        'publisher': '人民卫生出版社',
        'edition': '9',
        'year': '2022',
        'volume': '下册',
        'pdf': '诸福棠实用儿科学第9版下.pdf',
    },
]

SKIP_TITLES = {'封面', '书名', '版权', '前言', '目录', '上册', '下册', '附录',
               '中英文名词对招索引', '中英文名词对照索引', '索引'}
CHUNK_CHARS = 1200


def clean_ocr(text: str) -> str:
    """Windows OCR 会在汉字之间插空格，这里去掉；同时清理多余空行与页码行。"""
    text = text.replace('\u3000', ' ')
    text = re.sub(r'(?<=[\u4e00-\u9fff])\s+(?=[\u4e00-\u9fff])', '', text)
    text = re.sub(r'[ \t]{2,}', ' ', text)
    lines = []
    for line in text.splitlines():
        line = line.strip()
        if not line:
            continue
        if re.fullmatch(r'[·\-—\s]*\d{1,4}[·\-—\s]*', line):
            continue
        lines.append(line)
    return '\n'.join(lines)


def split_chunks(text: str, body: str) -> list[str]:
    paragraphs = [p for p in text.split('\n') if p.strip()]
    chunks, buffer = [], ''
    for paragraph in paragraphs:
        if len(buffer) + len(paragraph) + 1 > CHUNK_CHARS and buffer:
            chunks.append(buffer)
            buffer = paragraph
        else:
            buffer = (buffer + '\n' + paragraph).strip() if buffer else paragraph
    if buffer:
        chunks.append(buffer)
    return chunks[:200]  # 单章最多 200 块，防止异常页导致爆量


def build_book(meta: dict, strict: bool) -> dict:
    import pymupdf

    pdf = RAW / meta['pdf']
    if not pdf.exists():
        raise SystemExit(f'找不到 PDF：{pdf}')
    doc = pymupdf.open(str(pdf))
    toc = doc.get_toc() or []
    total_pages = doc.page_count
    ocr_dir = OCR_ROOT / meta['id']
    pages_done = len(list(ocr_dir.glob('p*.txt'))) if ocr_dir.exists() else 0
    coverage = pages_done / total_pages if total_pages else 0
    print(f"{meta['id']}: PDF {total_pages} 页，已 OCR {pages_done} 页（{coverage:.1%}）")
    if strict and coverage < 0.95:
        raise SystemExit(f'{meta["id"]} OCR 覆盖率 {coverage:.1%} < 95%，先跑 tools/ocr_pdf_books.py')

    chapters = [(title.strip(), page) for _, title, page in toc if title.strip() not in SKIP_TITLES]
    chapters = [(title, page) for title, page in chapters if 0 < page <= total_pages]
    if not chapters:
        raise SystemExit(f'{meta["id"]} 书签为空，无法按章构建')
    chapters.sort(key=lambda item: item[1])

    chunks = []
    missing = 0
    for index, (title, start_page) in enumerate(chapters):
        end_page = chapters[index + 1][1] - 1 if index + 1 < len(chapters) else total_pages
        end_page = max(start_page, min(end_page, total_pages))
        texts, blank_pages = [], 0
        for page_no in range(start_page, end_page + 1):
            path = ocr_dir / f'p{page_no:06d}.txt'
            if not path.exists():
                blank_pages += 1
                continue
            cleaned = clean_ocr(path.read_text(encoding='utf-8', errors='replace'))
            if cleaned:
                texts.append(cleaned)
        body = '\n'.join(texts)
        missing += blank_pages
        page_range = f'PDF 第 {start_page}–{end_page} 页'
        if not body:
            chunks.append({'p': f'{title} · {page_range}', 't': f'{title}（{page_range}）正文尚未 OCR。'})
            continue
        for part, text in enumerate(split_chunks(body, title), start=1):
            label = f'{title} · {page_range}' + (f' · {part}' if part > 1 else '')
            chunks.append({'p': label, 't': text})
        if blank_pages:
            chunks.append({'p': f'{title} · OCR 缺口', 't': f'本章 {page_range} 中有 {blank_pages} 页尚未 OCR。'})

    payload = {
        'id': meta['id'],
        'title': meta['title'],
        'authors': meta['authors'],
        'publisher': meta['publisher'],
        'edition': meta['edition'],
        'year': meta['year'],
        'volume': meta.get('volume', ''),
        'source_file': meta['pdf'],
        'pages': total_pages,
        'ocr_pages': pages_done,
        'ocr_coverage': round(coverage * 100, 1),
        'chunks': chunks,
        'note': '由扫描版 PDF 逐页 OCR 生成；OCR 可能有错字，临床用药请以原书与药品说明书为准。',
    }
    (DATA / 'library' / f"{meta['id']}.json").write_text(
        json.dumps(payload, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    (WEB / 'library' / f"{meta['id']}.json").write_text(
        json.dumps(payload, ensure_ascii=False, separators=(',', ':')), encoding='utf-8')
    chars = sum(len(c['t']) for c in chunks)
    print(f"  → {len(chunks)} 块 / {chars} 字 / 缺页 {missing} / 覆盖率 {coverage:.1%}")
    return {'book': payload, 'chars': chars}


def update_books(entries: list[dict]) -> None:
    path = DATA / 'library' / 'books.json'
    books = json.loads(path.read_text(encoding='utf-8'))
    existing = {b.get('id'): b for b in books.get('books', [])}
    for item in entries:
        book = item['book']
        existing[book['id']] = {
            'id': book['id'],
            'title': book['title'],
            'authors': book['authors'],
            'publisher': book['publisher'],
            'edition': book['edition'],
            'year': book['year'],
            'volume': book.get('volume', ''),
            'source': '扫描版 PDF OCR',
            'pages': book['pages'],
            'chunks': len(book['chunks']),
            'chars': item['chars'],
            'ocr_coverage': book['ocr_coverage'],
            'status': '可用' if book['ocr_coverage'] >= 95 else f"OCR 进行中（{book['ocr_coverage']}%）",
        }
    books['books'] = list(existing.values())
    books['count'] = len(books['books'])
    text = json.dumps(books, ensure_ascii=False, separators=(',', ':'))
    path.write_text(text, encoding='utf-8')
    (WEB / 'library' / 'books.json').write_text(text, encoding='utf-8')
    print(f"books.json: {books['count']} 本")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--book', help='只构建指定 id')
    parser.add_argument('--strict', action='store_true')
    args = parser.parse_args()
    targets = [b for b in BOOKS if not args.book or b['id'] == args.book]
    entries = [build_book(meta, args.strict) for meta in targets]
    update_books(entries)
    print('下一步：python tools/build_inline_data.py')


if __name__ == '__main__':
    main()

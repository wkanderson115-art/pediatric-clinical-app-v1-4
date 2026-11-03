"""V1.7 离线书库导入器：把用户自备的电子书转成本机可检索的分块 JSON。

用法：
    python tools/import_library.py --scan                          # 扫描 data/library/raw 下所有文件
    python tools/import_library.py data/library/raw/a.pdf --id zhu9 \
        --title "诸福棠实用儿科学（第9版）" --authors "江载芳 等" \
        --publisher 人民卫生出版社 --year 2024 --edition 9

支持：.txt / .md / .epub / .pdf（PDF 需要 pypdf 或 pdftotext，二者有一定一即可）
输出：data/library/books.json + data/library/<id>.json（分块文本）+ web/library/<id>.json（PWA 副本）

只处理用户自己提供的文件，不联网、不下载任何内容；元数据由命令行传入。
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import subprocess
import sys
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LIB = ROOT / 'data' / 'library'
RAW = LIB / 'raw'
WEB_LIB = ROOT / 'web' / 'library'
CHUNK_CHARS = 1200
BOOKS = LIB / 'books.json'


def read_text_file(path: Path) -> list[tuple[str, str]]:
    text = path.read_text(encoding='utf-8', errors='replace')
    parts = re.split(r'\f', text)
    if len(parts) == 1:
        parts = re.split(r'\n(?=第[一二三四五六七八九十百]+[章节篇]|Chapter\s+\d+)', text)
    return [(f'第{i + 1}段', part.strip()) for i, part in enumerate(parts) if part.strip()]


def read_epub(path: Path) -> list[tuple[str, str]]:
    out = []
    with zipfile.ZipFile(path) as zf:
        names = [n for n in zf.namelist() if n.lower().endswith(('.xhtml', '.html', '.htm'))]
        names.sort()
        for index, name in enumerate(names):
            html = zf.read(name).decode('utf-8', errors='replace')
            html = re.sub(r'(?is)<(script|style)[^>]*>.*?</\1>', ' ', html)
            text = re.sub(r'(?s)<[^>]+>', '\n', html)
            text = re.sub(r'&nbsp;', ' ', text)
            text = re.sub(r'&[a-z]+;', ' ', text)
            text = re.sub(r'\n{2,}', '\n', text).strip()
            if text:
                out.append((f'第{index + 1}节', text))
    return out


def read_pdf(path: Path) -> list[tuple[str, str]]:
    try:
        from pypdf import PdfReader  # 可选依赖
    except ImportError:
        PdfReader = None
    if PdfReader is not None:
        reader = PdfReader(str(path))
        out = []
        for index, page in enumerate(reader.pages):
            try:
                text = page.extract_text() or ''
            except Exception:
                text = ''
            if text.strip():
                out.append((f'第{index + 1}页', text.strip()))
        return out
    exe = shutil.which('pdftotext')
    if exe:
        target = path.with_suffix('.txt')
        subprocess.run([exe, '-layout', str(path), str(target)], check=True)
        return read_text_file(target)
    raise SystemExit('PDF 需要安装 pypdf（pip install pypdf）或系统 pdftotext；也可先把 PDF 转成 txt 再导入。')


def chunk_blocks(blocks: list[tuple[str, str]]) -> list[dict]:
    chunks = []
    for label, text in blocks:
        text = re.sub(r'[ \t]+', ' ', text).strip()
        for start in range(0, len(text), CHUNK_CHARS):
            piece = text[start:start + CHUNK_CHARS].strip()
            if piece:
                chunks.append({'i': len(chunks), 'p': label, 't': piece})
    return chunks


def load_books() -> dict:
    if BOOKS.exists():
        return json.loads(BOOKS.read_text(encoding='utf-8'))
    return {'version': '1.0', 'updated': '', 'policy': {}, 'books': []}


def save_books(data: dict) -> None:
    data['books'].sort(key=lambda b: b.get('id', ''))
    data['updated'] = '2026-11-03'
    text = json.dumps(data, ensure_ascii=False, indent=2)
    BOOKS.write_text(text + '\n', encoding='utf-8')
    WEB_LIB.mkdir(parents=True, exist_ok=True)
    (WEB_LIB / 'books.json').write_text(text + '\n', encoding='utf-8')


def import_one(path: Path, meta: dict) -> dict:
    suffix = path.suffix.lower()
    if suffix in ('.txt', '.md'):
        blocks = read_text_file(path)
    elif suffix == '.epub':
        blocks = read_epub(path)
    elif suffix == '.pdf':
        blocks = read_pdf(path)
    else:
        raise SystemExit(f'不支持的格式：{suffix}')
    chunks = chunk_blocks(blocks)
    if not chunks:
        raise SystemExit('没有抽取到文本；扫描版 PDF 需要先做 OCR。')
    book_id = meta['id']
    payload = {
        'version': '1.0',
        'book_id': book_id,
        'title': meta['title'],
        'chunks': chunks,
        'policy': '本机个人检索用；版权归原作者与出版方，不随项目分发',
    }
    text = json.dumps(payload, ensure_ascii=False, separators=(',', ':'))
    (LIB / f'{book_id}.json').write_text(text + '\n', encoding='utf-8')
    WEB_LIB.mkdir(parents=True, exist_ok=True)
    (WEB_LIB / f'{book_id}.json').write_text(text + '\n', encoding='utf-8')
    entry = {
        'id': book_id,
        'title': meta['title'],
        'authors': meta.get('authors', ''),
        'publisher': meta.get('publisher', ''),
        'year': meta.get('year', ''),
        'edition': meta.get('edition', ''),
        'source_file': path.name,
        'format': suffix.lstrip('.'),
        'chunks': len(chunks),
        'chars': sum(len(c['t']) for c in chunks),
        'bytes': len(text.encode('utf-8')),
        'sha256': hashlib.sha256(text.encode('utf-8')).hexdigest()[:16],
        'imported_at': '2026-11-03',
    }
    return entry


def scan_raw() -> list[Path]:
    RAW.mkdir(parents=True, exist_ok=True)
    return sorted(p for p in RAW.iterdir() if p.is_file() and p.suffix.lower() in ('.txt', '.md', '.epub', '.pdf'))


def main() -> None:
    parser = argparse.ArgumentParser(description='离线书库导入器')
    parser.add_argument('files', nargs='*', help='电子书文件路径')
    parser.add_argument('--scan', action='store_true', help='扫描 data/library/raw')
    parser.add_argument('--id')
    parser.add_argument('--title')
    parser.add_argument('--authors', default='')
    parser.add_argument('--publisher', default='')
    parser.add_argument('--year', default='')
    parser.add_argument('--edition', default='')
    args = parser.parse_args()

    files = [Path(p) for p in args.files]
    if args.scan:
        files = scan_raw() + files
    if not files:
        print('没有输入文件。把电子书放到 data/library/raw/ 后执行：python tools/import_library.py --scan')
        raise SystemExit(1)

    data = load_books()
    data.setdefault('policy', {
        'scope': '用户自备电子书的个人本机检索，不随源码分发',
        'copyright': '书籍版权归原作者与出版方；请只导入你有权使用的版本',
        'offline': '导入后完全离线可检索，不上传任何内容',
    })
    known = {b['id']: b for b in data['books']}
    for path in files:
        meta = {
            'id': args.id or re.sub(r'[^a-z0-9_]+', '', path.stem.lower())[:40] or 'book',
            'title': args.title or path.stem,
            'authors': args.authors,
            'publisher': args.publisher,
            'year': args.year,
            'edition': args.edition,
        }
        if args.id and len(files) > 1:
            raise SystemExit('批量导入时不要指定 --id，按文件名自动生成')
        entry = import_one(path, meta)
        known[entry['id']] = entry
        print(f"导入 {entry['id']}: {entry['title']} · {entry['chunks']} 块 · {entry['chars']} 字")
    data['books'] = list(known.values())
    save_books(data)
    print(f'书库共 {len(data["books"])} 本')


if __name__ == '__main__':
    main()

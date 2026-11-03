"""V1.7 离线书库回归测试（数据层，不需要 FastAPI）。"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data'
LIB = DATA / 'library'
WEB_LIB = ROOT / 'web' / 'library'


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding='utf-8'))


def test_books_manifest_and_demo_book():
    books = load(LIB / 'books.json')
    assert isinstance(books['books'], list) and books['books']
    ids = [b['id'] for b in books['books']]
    assert len(ids) == len(set(ids))
    demo = next(b for b in books['books'] if b['id'] == 'demo_quickref')
    assert demo['chunks'] > 100, demo['chunks']
    payload = load(LIB / 'demo_quickref.json')
    chunks = payload['chunks']
    assert len(chunks) == demo['chunks']
    for chunk in chunks[:50]:
        assert isinstance(chunk['i'], int)
        assert chunk['p'] and chunk['t']
        assert len(chunk['t']) <= 1300


def test_book_files_copied_to_web_for_offline():
    for name in ('books.json', 'demo_quickref.json'):
        a = LIB / name
        b = WEB_LIB / name
        assert a.exists() and b.exists(), name
        assert hashlib.sha256(a.read_bytes()).hexdigest() == hashlib.sha256(b.read_bytes()).hexdigest(), name


def test_importer_and_demo_scripts_present():
    tools = ROOT / 'tools'
    for name in ('import_library.py', 'build_demo_library.py'):
        text = (tools / name).read_text(encoding='utf-8')
        assert text.strip()
    importer = (tools / 'import_library.py').read_text(encoding='utf-8')
    for token in ('read_epub', 'read_pdf', 'read_text_file', 'chunk_blocks'):
        assert token in importer, token


def test_frontend_wires_library():
    html = (ROOT / 'web/index.html').read_text(encoding='utf-8')
    sw = (ROOT / 'web/sw.js').read_text(encoding='utf-8')
    js = (ROOT / 'web/library.js').read_text(encoding='utf-8')
    for token in ('page-library', 'library-query', 'library-shelf', 'library-chunks', '/library.js', 'V1.7'):
        assert token in html, token
    for token in ('/library.js', '/library/books.json', '/library/demo_quickref.json', 'v1.7.0'):
        assert token in sw, token
    for token in ('chunksOf', 'search', 'highlight'):
        assert token in js, token


def test_raw_import_folder_ready():
    raw = LIB / 'raw'
    assert raw.is_dir(), 'data/library/raw 目录必须存在，供用户放入电子书'

"""V1.9：扫描版电子书 OCR 入库的流水线与数据回归。"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def test_ocr_tooling_exists():
    for name in ('tools/ocr_pdf_books.py', 'tools/win_ocr_folder.ps1', 'tools/build_books_from_ocr.py'):
        assert (ROOT / name).exists(), name
    ps1 = (ROOT / 'tools/win_ocr_folder.ps1').read_text(encoding='utf-8')
    assert 'Windows.Media.Ocr' in ps1 and 'zh-Hans-CN' in ps1


def test_clean_ocr_removes_cjk_spaces_and_page_numbers():
    import importlib.util

    spec = importlib.util.spec_from_file_location('bb', ROOT / 'tools/build_books_from_ocr.py')
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    raw = '第 一 章 儿 科 学\n— 12 —\n\n新 生 儿 黄 疸 需 鉴 别'
    cleaned = module.clean_ocr(raw)
    assert '第一章儿科学' in cleaned
    assert '新生儿黄疸需鉴别' in cleaned
    assert '— 12 —' not in cleaned


def test_scanned_books_registered_when_present():
    data = ROOT / 'data/library/books.json'
    if not data.exists():
        return
    books = json.loads(data.read_text(encoding='utf-8'))
    ids = {b.get('id') for b in books.get('books', [])}
    for book_id in ('zhufutang9a', 'zhufutang9b'):
        payload = ROOT / f'data/library/{book_id}.json'
        if not payload.exists():
            continue
        book = json.loads(payload.read_text(encoding='utf-8'))
        assert book['chunks'], book_id
        assert book['pages'] > 1000
        assert any('第' in c['p'] for c in book['chunks'])
        assert (ROOT / f'web/library/{book_id}.json').exists()
        if book_id in ids:
            entry = next(b for b in books['books'] if b['id'] == book_id)
            assert entry['chunks'] == len(book['chunks'])
            assert 'ocr_coverage' in entry

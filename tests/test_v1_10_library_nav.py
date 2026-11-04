"""V1.10：电子书按章归类 + 学习页联动 + 检索分组排序回归。"""
from __future__ import annotations

import json
from pathlib import Path

import pytest

pytest.importorskip('fastapi')

from fastapi.testclient import TestClient  # noqa: E402

from app import main as app_main  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
client = TestClient(app_main.app)


def test_chapters_index_structure():
    data = json.loads((ROOT / 'data/library/chapters.json').read_text(encoding='utf-8'))
    books = data['books']
    assert {'zhufutang9a', 'zhufutang9b'} <= set(books)
    total = 0
    for book in books.values():
        chapters = book['chapters']
        assert chapters, book['id']
        total += len(chapters)
        for chapter in chapters:
            assert chapter['title'].startswith('第')
            assert chapter['chunk_end'] >= chapter['chunk_start']
            assert chapter['chars'] > 0
            assert isinstance(chapter['keywords'], list)
    assert total >= 40, total


def test_system_map_covers_most_chapters():
    data = json.loads((ROOT / 'data/library/system_map.json').read_text(encoding='utf-8'))
    mapped = sum(len(s['chapters']) for s in data['systems'])
    assert mapped >= 30, mapped
    ids = {s['id'] for s in data['systems'] if s['chapters']}
    for expected in ('resp', 'digest', 'infection', 'neonate', 'cardiac', 'blood', 'emergency'):
        assert expected in ids, expected
    # 呼吸系统章必须指到第二十五章
    resp = next(s for s in data['systems'] if s['id'] == 'resp')
    assert any('呼吸系统' in c['title'] for c in resp['chapters'])


def test_chapter_index_endpoint():
    data = client.get('/api/library/chapters').json()
    ids = {b['id'] for b in data['books']}
    assert {'zhufutang9a', 'zhufutang9b'} <= ids
    assert any(s['count'] for s in data['systems'])


def test_search_is_scoped_by_system_and_grouped():
    scoped = client.get('/api/library/search', params={'q': '肺炎', 'system': 'resp'}).json()
    assert scoped['total'] > 0
    assert all(item['system'] == 'resp' for item in scoped['items'])
    assert scoped['groups'], '需要按章聚合的分组结果'
    top = scoped['groups'][0]
    assert '呼吸系统' in top['chapter_title']
    assert top['count'] >= 10
    assert top['snippets'] and '肺炎' in top['snippets'][0]['snippet']

    unscoped = client.get('/api/library/search', params={'q': '肺炎'}).json()
    assert unscoped['total'] >= scoped['total']
    assert unscoped['group_total'] >= len(scoped['groups'])


def test_search_can_filter_single_chapter():
    data = client.get('/api/library/search',
                      params={'q': '肺炎', 'chapter': 'zhufutang9a-c25', 'page_size': 3}).json()
    assert data['total'] > 0
    assert len(data['items']) <= 3
    assert all(item['chapter_id'] == 'zhufutang9a-c25' for item in data['items'])


def test_learning_system_books_endpoint():
    data = client.get('/api/learning/resp/books').json()
    assert data['system']['id'] == 'resp'
    assert data['chapters']
    chapter = data['chapters'][0]
    for key in ('book_id', 'chapter_id', 'title', 'pages', 'chunk_start'):
        assert key in chapter


def test_chapter_detail_endpoint():
    data = client.get('/api/library/chapter/zhufutang9a-c25').json()
    assert data['chapter']['title'].startswith('第二十五章')
    assert data['items'] and data['items'][0]['t']
    assert data['items'][0]['i'] >= data['chapter']['chunk_start']


def test_frontend_navigation_wiring():
    html = (ROOT / 'web/index.html').read_text(encoding='utf-8')
    js = (ROOT / 'web/library.js').read_text(encoding='utf-8')
    study = (ROOT / 'web/study-books.js').read_text(encoding='utf-8')
    for token in ('library-book-filter', 'library-system-filter', 'library-chapters',
                  'study-books', '/study-books.js'):
        assert token in html, token
    for token in ('chapters.json', 'system_map.json', 'groupCard', 'openChapter'):
        assert token in js, token
    assert 'system_map.json' in study
    assert client.get('/api/status').json()['version'].startswith('1.12')

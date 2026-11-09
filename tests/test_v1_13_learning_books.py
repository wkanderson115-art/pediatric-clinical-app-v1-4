"""V1.13：诸福棠第9版按系统融入学习板块（原书精读导航）。"""
from __future__ import annotations

import json
from pathlib import Path

import pytest

pytest.importorskip('fastapi')

from fastapi.testclient import TestClient  # noqa: E402

from app import main as app_main  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
client = TestClient(app_main.app)


def test_learning_books_covers_all_systems():
    data = json.loads((ROOT / 'data/learning_books.json').read_text(encoding='utf-8'))
    assert len(data['systems']) == 17
    assert data['total_chapters'] == 46
    assert data['total_sections'] >= 2600, data['total_sections']
    names = {s['name'] for s in data['systems']}
    for expected in ('呼吸系统', '消化系统', '新生儿', '感染性疾病', '儿科急诊与重症'):
        assert expected in names


def test_each_system_has_chapters_and_sections():
    data = json.loads((ROOT / 'data/learning_books.json').read_text(encoding='utf-8'))
    for system in data['systems']:
        assert system['chapters'], system['id']
        assert system['section_count'] > 0, system['id']
        assert system['chars'] > 1000, system['id']
        chapter = system['chapters'][0]
        for key in ('chapter_id', 'title', 'page_range', 'chars', 'sections'):
            assert key in chapter, (system['id'], key)
        assert chapter['sections'][0]['chunk'] >= 0


def test_learning_system_books_endpoint_has_sections():
    data = client.get('/api/learning/resp/books').json()
    assert data['system']['id'] == 'resp'
    assert data['chapters']
    chapter = data['chapters'][0]
    assert chapter['title'].startswith('第二十五章')
    assert len(chapter['sections']) >= 20
    assert chapter['page_range']
    assert data['section_count'] >= 20


def test_learning_overview_endpoint():
    data = client.get('/api/learning/books/overview').json()
    assert data['total_chapters'] == 46
    assert data['total_sections'] >= 2600
    assert len(data['systems']) == 17
    totals = sum(s['sections'] for s in data['systems'])
    assert totals == data['total_sections']


def test_frontend_and_inline_wiring():
    html = (ROOT / 'web/index.html').read_text(encoding='utf-8')
    js = (ROOT / 'web/study-books.js').read_text(encoding='utf-8')
    inline = ROOT / 'web/inline-data/learning_books.js'
    assert '原书精读' in html
    assert 'study-books-summary' in html
    for token in ('learning_books.json', 'section.title', 'openChapter'):
        assert token in js, token
    assert inline.exists(), 'learning_books 需要内联副本供 iOS 离线使用'
    assert client.get('/api/status').json()['version'].startswith('1.13')

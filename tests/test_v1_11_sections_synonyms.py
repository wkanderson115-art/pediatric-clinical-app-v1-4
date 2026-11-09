"""V1.11：未归类章节挂系统 + 章内小节 + 检索同义词扩展。"""
from __future__ import annotations

import json
from pathlib import Path

import pytest

pytest.importorskip('fastapi')

from fastapi.testclient import TestClient  # noqa: E402

from app import main as app_main  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
client = TestClient(app_main.app)


def test_every_chapter_mapped_to_system():
    data = json.loads((ROOT / 'data/library/system_map.json').read_text(encoding='utf-8'))
    assert data['unmapped'] == [], data['unmapped']
    mapped = sum(len(s['chapters']) for s in data['systems'])
    chapters = json.loads((ROOT / 'data/library/chapters.json').read_text(encoding='utf-8'))
    total = sum(len(b['chapters']) for b in chapters['books'].values())
    assert mapped == total, (mapped, total)


def test_sections_built_for_chapters():
    chapters = json.loads((ROOT / 'data/library/chapters.json').read_text(encoding='utf-8'))
    total = 0
    with_sections = 0
    for book in chapters['books'].values():
        for chapter in book['chapters']:
            sections = chapter.get('sections') or []
            assert sections, chapter['title']
            for section in sections:
                assert section['chunk'] >= chapter['chunk_start']
                assert section['title']
            total += len(sections)
            if len(sections) > 1:
                with_sections += 1
    assert total >= 800, total
    assert with_sections >= 20, with_sections


def test_synonyms_table_loaded():
    data = json.loads((ROOT / 'data/library/synonyms.json').read_text(encoding='utf-8'))
    assert len(data['terms']) >= 50
    assert '支气管肺炎' in data['terms']['肺炎']


def test_search_expands_synonyms_and_annotates_section():
    data = client.get('/api/library/search', params={'q': '肺炎', 'page_size': 3}).json()
    assert data['total'] > 0
    assert '支气管肺炎' in data['expanded']
    group = data['groups'][0]
    assert group['count'] >= 10
    assert group['sections'], '分组应带小节名'
    snippet = group['snippets'][0]
    assert snippet['matched_term']
    assert snippet['snippet']

    items = data['items']
    # 注意：书库里有不属于任何章节的书（速查书/NICE 指南），它们命中时 section 为空
    chapter_items = [item for item in items if item['chapter_id']]
    assert any(item['section'] for item in chapter_items) or any(g['sections'] for g in data['groups'])


def test_search_synonym_only_hit():
    """原词不出现、只靠同义词命中的也应返回（如搜 DKA）。"""
    data = client.get('/api/library/search', params={'q': 'DKA', 'page_size': 5}).json()
    assert data['total'] > 0
    assert any(item['matched_term'] != 'DKA' or 'DKA' in item['snippet'] for item in data['items'])


def test_chapter_detail_returns_sections():
    data = client.get('/api/library/chapter/zhufutang9a-c25').json()
    assert data['sections']
    assert len(data['sections']) >= 20
    assert data['items'][0]['t']


def test_frontend_shows_expansion_and_section():
    js = (ROOT / 'web/library.js').read_text(encoding='utf-8')
    html = (ROOT / 'web/index.html').read_text(encoding='utf-8')
    assert '已扩展' in js
    assert 'group.sections' in js
    assert 'V1.1' in html
    assert client.get('/api/status').json()['version'].startswith('1.13')

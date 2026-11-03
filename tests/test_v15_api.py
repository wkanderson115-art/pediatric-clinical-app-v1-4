"""V1.5 新增离线内容接口的行为测试（需要 FastAPI 依赖）。"""
import json
from pathlib import Path

import pytest

pytest.importorskip('fastapi')

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
client = TestClient(app)


def load(name):
    return json.loads((ROOT / 'data' / name).read_text(encoding='utf-8'))


def test_status_reports_offline_content_counts_without_keys(monkeypatch):
    monkeypatch.delenv('TIANAPI_KEY', raising=False)
    monkeypatch.delenv('MOSENG_API_KEY', raising=False)
    data = client.get('/api/status').json()
    assert data['connected'] is False
    assert data['offline']['formulary_drugs'] >= 72
    assert data['offline']['lab_reference_items'] == 155
    assert data['offline']['simulation_cases'] == 157
    assert data['offline']['simulation_scenarios'] == 36
    assert data['offline']['quiz_items'] >= 50


def test_formulary_meta_and_search():
    meta = client.get('/api/formulary/meta').json()
    assert meta['count'] >= 72
    assert len(meta['categories']) >= 12
    assert meta['policy']['not_a_prescription'] is True
    search = client.get('/api/formulary', params={'q': '阿莫西林'}).json()
    assert search['offline'] is True
    assert search['total'] >= 1
    first = search['items'][0]
    assert 'peds_notes' in first and 'dose_note' in first
    filtered = client.get('/api/formulary', params={'category': search['items'][0]['category']}).json()
    assert filtered['total'] >= 1
    assert all(x['category'] == search['items'][0]['category'] for x in filtered['items'])


def test_formulary_detail_and_404():
    item = load('drug_formulary.json')['items'][0]
    detail = client.get(f"/api/formulary/{item['id']}").json()
    assert detail['item']['generic_name'] == item['generic_name']
    assert client.get('/api/formulary/not-a-real-drug').status_code == 404


def test_lab_reference_endpoint():
    all_items = client.get('/api/labs/reference').json()
    assert all_items['count'] == 155
    one = client.get('/api/labs/reference', params={'code': 'WBC'}).json()
    assert one['count'] == 1
    assert len(one['items'][0]['ranges']) == 5
    assert client.get('/api/labs/reference', params={'code': 'NOPE'}).status_code == 404


def test_simulation_scenarios_endpoint():
    data = client.get('/api/sim/scenarios').json()
    assert data['cases'] == 157
    assert data['scenarios'] == 36
    assert len(data['items']) == 36
    assert all(len(x['variants']) == 4 for x in data['items'])


def test_content_stats_and_quiz_alias():
    stats = client.get('/api/content/stats').json()
    assert stats['clinical_paths'] == 54
    assert stats['clinical_paths_with_source'] == 54
    assert stats['learning_topics'] >= 111
    assert stats['formulary_drugs'] >= 72
    assert stats['ready_for_clinical_use'] is False
    quiz = client.get('/api/quiz').json()
    assert len(quiz['items']) >= 50


def test_static_formulary_files_are_served():
    for path in ('/drug_formulary.json', '/lab_reference_ranges.json'):
        response = client.get(path)
        assert response.status_code == 200
        assert isinstance(response.json(), dict)


def test_formulary_validation_limits():
    assert client.get('/api/formulary', params={'page': 0}).status_code == 422
    assert client.get('/api/formulary', params={'page_size': 999}).status_code == 422

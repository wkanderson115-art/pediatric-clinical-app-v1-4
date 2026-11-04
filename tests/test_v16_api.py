"""V1.6 新接口行为测试（需要 FastAPI 依赖）。"""
import pytest

pytest.importorskip('fastapi')

from fastapi.testclient import TestClient  # noqa: E402

from app.main import app  # noqa: E402

client = TestClient(app)


def test_global_search_returns_facets():
    data = client.get('/api/search/all', params={'q': '支原体'}).json()
    assert data['total'] >= 1
    kinds = {facet['kind'] for facet in data['facets']}
    assert 'path' in kinds and 'quiz' in kinds
    for facet in data['facets']:
        assert facet['total'] >= len(facet['items'])
        for item in facet['items']:
            assert item['id'] and item['label']
            assert 'snippet' in item


def test_global_search_drug_and_validation():
    data = client.get('/api/search/all', params={'q': '阿莫西林'}).json()
    kinds = {facet['kind'] for facet in data['facets']}
    assert 'drug' in kinds
    assert client.get('/api/search/all', params={'q': ''}).status_code == 422
    assert client.get('/api/search/all', params={'q': 'x', 'limit': 99}).status_code == 422


def test_formulary_detail_includes_dose_rules_and_relations():
    meta = client.get('/api/formulary/meta').json()
    assert meta['count'] >= 110
    detail = client.get('/api/formulary/amoxicillin').json()
    assert detail['dose_rules']['drug_id'] == 'amoxicillin'
    assert detail['dose_rules']['verified'] is False
    assert isinstance(detail['relations'], list)


def test_dose_rules_endpoint():
    all_rules = client.get('/api/dose-rules').json()
    assert all_rules['counts']['drugs'] >= 110
    assert all_rules['policy']['not_a_prescription'] is True
    item = client.get('/api/dose-rules', params={'drug_id': 'paracetamol'}).json()
    assert item['item']['drug_id'] == 'paracetamol'
    assert client.get('/api/dose-rules', params={'drug_id': 'no-such-drug'}).status_code == 404


def test_relations_endpoint():
    summary = client.get('/api/relations').json()
    assert summary['index_size'] >= 100
    data = client.get('/api/relations', params={'type': 'drug', 'id': 'amoxicillin'}).json()
    assert data['type'] == 'drug' and data['id'] == 'amoxicillin'
    assert data['count'] == len(data['items'])
    empty = client.get('/api/relations', params={'type': 'drug', 'id': 'nope'}).json()
    assert empty['count'] == 0


def test_content_version_fingerprints():
    data = client.get('/api/content/version').json()
    assert data['app_version'] == '1.12.0'
    assert data['files']['drug_formulary.json']['exists'] is True
    assert len(data['files']['drug_formulary.json']['sha256']) == 16
    assert data['counts']['formulary_drugs'] >= 110
    assert data['counts']['dose_rules_with_numbers'] >= 60
    assert data['counts']['relation_links'] >= 300


def test_status_reports_v16_counts(monkeypatch):
    monkeypatch.delenv('TIANAPI_KEY', raising=False)
    monkeypatch.delenv('MOSENG_API_KEY', raising=False)
    data = client.get('/api/status').json()
    assert data['version'] == '1.12.0'
    assert data['offline']['dose_rules'] >= 60
    assert data['offline']['relations'] >= 300

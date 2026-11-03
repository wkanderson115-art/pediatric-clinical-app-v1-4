"""V1.7.3：自定义药品数据源（个人可用的第三方 API）回归测试。"""
from __future__ import annotations

import pytest

pytest.importorskip('fastapi')

from fastapi.testclient import TestClient  # noqa: E402

from app import main as app_main  # noqa: E402

client = TestClient(app_main.app)

SAMPLE_CFG = {
    'list_path': 'showapi_res_body.list',
    'sections_key': 'sections',
    'section_title_key': 'title',
    'section_content_key': 'content',
    'source': '测试接口',
    'source_url': 'https://example.test/',
    'field_map': {
        'name': 'title',
        'manufacturer': 'manu',
        'approval_number': 'approval',
        'specifications': 'spec',
    },
}


def test_dot_get_paths():
    payload = {'a': {'b': [{'c': 1}]}, 'list': [1, 2]}
    assert app_main.dot_get(payload, 'a.b.0.c') == 1
    assert app_main.dot_get(payload, 'list.1') == 2
    assert app_main.dot_get(payload, 'missing.path', default='x') == 'x'
    assert app_main.dot_get(payload, 'a.b.9.c') is None


def test_normalize_custom_maps_fields_and_sections():
    payload = {'showapi_res_body': {'list': [{
        'title': '阿莫西林胶囊',
        'manu': '某制药有限公司',
        'approval': '国药准字H00000001',
        'spec': '0.25g',
        'sections': [
            {'title': '适应证', 'content': '<p>用于敏感菌所致感染</p>'},
            {'title': '用法用量', 'content': '口服，须按说明书'},
        ],
    }]}}
    records = app_main.normalize_custom(payload, '阿莫西林', SAMPLE_CFG)
    assert len(records) == 1
    record = records[0]
    assert record.name == '阿莫西林胶囊'
    assert record.manufacturer == '某制药有限公司'
    assert record.approval_number == '国药准字H00000001'
    assert record.specifications == '0.25g'
    assert len(record.sections) == 2
    assert '<p>' not in record.sections[0].content
    assert record.source == '测试接口'


def test_normalize_custom_falls_back_to_content_field():
    cfg = dict(SAMPLE_CFG, sections_key='', list_path='items', field_map={'name': 'name'})
    payload = {'items': [{'name': '布洛芬混悬液', 'content': '用于退热，须核对说明书'}]}
    records = app_main.normalize_custom(payload, '布洛芬', cfg)
    assert len(records) == 1
    assert records[0].sections[0].title


def test_provider_prefers_custom_and_degrades_to_offline(monkeypatch):
    monkeypatch.setattr(app_main, 'CUSTOM_DRUG', dict(app_main.CUSTOM_DRUG, url='https://example.test/api'))
    monkeypatch.delenv('DRUG_PROVIDER', raising=False)
    monkeypatch.setattr(app_main, 'get_value', lambda name, default='': '')
    assert app_main.provider() == 'custom'

    monkeypatch.setattr(app_main, 'CUSTOM_DRUG', dict(app_main.CUSTOM_DRUG, url=''))
    assert app_main.provider() is None


def test_search_uses_custom_provider(monkeypatch):
    monkeypatch.setattr(app_main, 'CUSTOM_DRUG', dict(app_main.CUSTOM_DRUG, url='https://example.test/api'))

    async def fake_fetch(query, page):
        return {'data': [{'name': query, 'content': '教学资料片段', 'approval': '国药准字H00000002'}]}

    monkeypatch.setattr(app_main, 'custom_fetch', fake_fetch)
    original_normalize = app_main.normalize_custom
    monkeypatch.setattr(app_main, 'normalize_custom',
                        lambda payload, q: original_normalize(payload, q, {
                            'list_path': 'data', 'sections_key': '', 'source': '测试',
                            'field_map': {'name': 'name', 'approval_number': 'approval'},
                        }))
    response = client.get('/api/search', params={'q': '阿莫西林'})
    assert response.status_code == 200, response.text
    body = response.json()
    assert body['provider'] == 'custom'
    assert body['count'] == 1
    assert body['items'][0]['name'] == '阿莫西林'


def test_status_reports_custom_flag(monkeypatch):
    monkeypatch.setattr(app_main, 'CUSTOM_DRUG', dict(app_main.CUSTOM_DRUG, url='https://example.test/api'))
    data = client.get('/api/status').json()
    assert data['custom_api_configured'] is True
    assert data['provider'] == 'custom'

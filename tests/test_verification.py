from fastapi.testclient import TestClient
from app import main
from app.main import app, normalize_approvals


def test_verification_status_without_key(monkeypatch):
    monkeypatch.delenv('TIANAPI_KEY', raising=False)
    monkeypatch.delenv('MOSENG_API_KEY', raising=False)
    client = TestClient(app)
    response = client.get('/api/status')
    assert response.status_code == 200
    data = response.json()
    assert data['official_nmpa_api_connected'] is False
    assert data['approval_lookup_connected'] is False
    assert data['official_url'] == 'https://datasearch.nmpa.gov.cn/'
    r = client.get('/api/approvals', params={'q':'头孢曲松'})
    assert r.status_code == 503
    assert '摩熵' in r.json()['detail']
    assert 'no-store' in r.headers['cache-control']


def test_normalize_moseng_approvals():
    d=normalize_approvals({'code':10200,'data':{'list':[
        {'approval_number':'国药准字HTEST123', 'drug_name':'演示药品',
        'manufacturer_cn':['示例厂家'], 'corporation_cn':['示例上市许可持有人']}
    ]}})
    assert len(d) == 1
    assert d[0].manufacturer == '示例厂家'
    assert d[0].license_holder == '示例上市许可持有人'
    assert '第三方' in d[0].status


def test_approval_not_available_for_bad_auth():
    import pytest
    from fastapi import HTTPException
    with pytest.raises(HTTPException) as e:
        normalize_approvals({'code':10403,'message':'invalid token'})
    assert e.value.status_code == 503


def test_approval_route_moseng_data_is_not_official(monkeypatch):
    monkeypatch.setenv('MOSENG_API_KEY', 'test-key-not-real')
    async def fake_post(url, payload):
        assert url == main.MOSENG_APPROVAL_URL
        assert payload['search'] == {'approval_number':'国药准字H123'}
        return {'code':10200,'data':{'list':[{'approval_number':'国药准字H123','drug_name':'样例药物'}]}}
    monkeypatch.setattr(main, 'moseng_post', fake_post)
    r = TestClient(app).get('/api/approvals',params={'q':'国药准字H123'})
    assert r.status_code == 200
    data = r.json()
    assert data['official_nmpa_api_connected'] is False
    assert data['items'][0]['source'].startswith('摩熵')
    assert '第三方' in data['items'][0]['status']
    assert 'no-store' in r.headers['cache-control']


def test_resources_official_direct_url():
    resources = TestClient(app).get('/api/resources').json()['resources']
    assert any(r['url']=='https://datasearch.nmpa.gov.cn/' for r in resources)
    assert any('2025年版' in r['title'] for r in resources)

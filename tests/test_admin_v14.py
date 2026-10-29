import json
from unittest.mock import AsyncMock
import pytest
from cryptography.fernet import Fernet
from fastapi.testclient import TestClient
from app.main import app
from app import secure_admin


@pytest.fixture
def configured(monkeypatch, tmp_path):
    monkeypatch.setenv('ADMIN_PASSWORD', 'Strong-Admin-Password-For-Test-Only!')
    monkeypatch.setenv('APP_SECRET_ENCRYPTION_KEY', Fernet.generate_key().decode())
    monkeypatch.setenv('APP_SECRET_FILE', str(tmp_path/'private'/'keys.enc'))
    monkeypatch.setenv('APP_ACCESS_CODE', 'unit-test-app-code-001')
    for name in secure_admin.ALLOWED_KEYS:
        monkeypatch.delenv(name,raising=False)
    secure_admin._sessions.clear()
    secure_admin._failed.clear()
    secure_admin._last_checks.clear()
    with TestClient(app, base_url='https://testserver') as client:
        yield client, tmp_path


def auth(client):
    r=client.post('/api/admin/login', json={'password':'Strong-Admin-Password-For-Test-Only!'})
    assert r.status_code==200, r.text
    assert r.cookies.get(secure_admin.COOKIE)
    return {'X-Admin-CSRF':r.json()['csrf']}


def test_unauthenticated_denied(configured):
    c,_=configured
    assert c.get('/api/admin/session').status_code == 401
    assert c.put('/api/admin/key',json={'service':'AI_API_KEY','api_key':'sk-test123456'}).status_code==401
    assert c.post('/api/admin/test',json={'service':'AI_API_KEY'}).status_code==401


def test_password_and_rate_limit(configured):
    c,_=configured
    assert c.post('/api/admin/login',json={'password':'wrong'}).status_code==401
    for _ in range(4): c.post('/api/admin/login',json={'password':'wrong'})
    assert c.post('/api/admin/login',json={'password':'Strong-Admin-Password-For-Test-Only!'}).status_code==429


def test_encrypted_storage_never_exposes_key(configured):
    c,dir=configured
    csrf=auth(c)
    assert c.put('/api/admin/key',json={'service':'AI_API_KEY','api_key':'sk-very-sensitive-secret'},headers=csrf).status_code==200
    path=dir/'private'/'keys.enc'
    assert path.exists()
    assert b'sk-very-sensitive-secret' not in path.read_bytes()
    assert path.stat().st_mode & 0o777 == 0o600
    r=c.get('/api/admin/session')
    assert r.status_code==200
    assert 'sk-very-sensitive-secret' not in r.text
    assert r.json()['services']['AI_API_KEY']['configured']
    assert secure_admin.get_value('AI_API_KEY')=='sk-very-sensitive-secret'
    assert c.get('/api/status').json()['ai_model']=='deepseek-flash'
    assert 'sk-very-sensitive-secret' not in c.get('/api/status').text
    d=c.delete('/api/admin/key/AI_API_KEY',headers=csrf)
    assert d.status_code==200
    assert secure_admin.get_value('AI_API_KEY')==''


def test_csrf_and_origin_rejection(configured):
    c,_=configured
    csrf=auth(c)
    body={'service':'TIANAPI_KEY','api_key':'test-tianapi-credential'}
    assert c.put('/api/admin/key',json=body).status_code==403
    assert c.put('/api/admin/key',json=body,headers={**csrf,'Origin':'https://evil.example'}).status_code==403
    assert c.put('/api/admin/key',json=body,headers={**csrf,'Origin':'https://testserver'}).status_code==200
    assert c.put('/api/admin/key',json={'service':'ARBITRARY_KEY','api_key':'test-key'},headers=csrf).status_code==422
    assert c.post('/api/admin/logout',headers=csrf).status_code==200
    assert c.get('/api/admin/session').status_code==401


def test_key_file_corruption_fails_closed(configured):
    c,dir=configured
    csrf=auth(c)
    assert c.put('/api/admin/key',json={'service':'AI_API_KEY','api_key':'abcdef123456'},headers=csrf).status_code==200
    (dir/'private'/'keys.enc').write_bytes(b'bad-encrypted-payload')
    assert c.get('/api/admin/session').status_code==503
    assert c.get('/api/status').status_code==503


def test_external_ai_calls_official_flash(configured, monkeypatch):
    c,_=configured
    csrf=auth(c)
    c.put('/api/admin/key',json={'service':'AI_API_KEY','api_key':'sk-dummy-for-mock'},headers=csrf)
    outgoing=[]
    import httpx
    original=httpx.AsyncClient
    class FakeClient:
        def __init__(self,*args,**kwargs): pass
        async def __aenter__(self): return self
        async def __aexit__(self,*args): pass
        async def post(self,url,**kwargs):
            outgoing.append((url,kwargs))
            return httpx.Response(200,request=httpx.Request('POST',url),json={'choices':[{'message':{'content':'OK'}}]})
    monkeypatch.setattr(httpx,'AsyncClient',FakeClient)
    r=c.post('/api/admin/test',json={'service':'AI_API_KEY'},headers=csrf)
    assert r.status_code==200 and r.json()['ok'] is True
    assert outgoing[0][0]=='https://api.deepseek.com/chat/completions'
    assert outgoing[0][1]['json']['model']=='deepseek-flash'
    assert c.post('/api/admin/test',json={'service':'AI_API_KEY'},headers=csrf).status_code==429
    r=c.post('/api/ask',headers={'X-App-Access':'unit-test-app-code-001'},json={
        'question':'儿童反复咳嗽如何学习鉴别诊断？','mode':'ai','consent_external':True})
    assert r.status_code==200,r.text
    assert outgoing[-1][1]['json']['model']=='deepseek-flash'
    assert outgoing[-1][1]['headers']['Authorization']=='Bearer sk-dummy-for-mock'


def test_admin_disabled_by_default(monkeypatch, tmp_path):
    monkeypatch.delenv('ADMIN_PASSWORD',raising=False)
    monkeypatch.delenv('APP_SECRET_ENCRYPTION_KEY',raising=False)
    monkeypatch.setenv('APP_SECRET_FILE',str(tmp_path/'keys.enc'))
    with TestClient(app, base_url='https://testserver') as c:
        assert c.get('/api/admin/availability').json()['admin_enabled'] is False
        assert c.post('/api/admin/login',json={'password':'anything'}).status_code==503

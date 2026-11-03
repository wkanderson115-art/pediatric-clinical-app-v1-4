from fastapi.testclient import TestClient
from app.main import app, find_learning_topics, LEARNING, ai_config
from fastapi import HTTPException
import pytest

client = TestClient(app)


def test_learning_catalog_depth_and_sections():
    data=client.get('/api/learning').json()
    assert data['version']=='0.3.0'
    assert len(data['systems'])==17
    assert sum(len(s['topics']) for s in data['systems'])>=85
    for system in data['systems']:
        assert system['topics']
        for topic in system['topics']:
            assert set(topic['content'])=={'临床识别','检查与鉴别','处理与用药原则','紧急警示','常见误区'}
            assert topic['review_status']


def test_questions_local_never_external(monkeypatch):
    monkeypatch.delenv('AI_API_KEY', raising=False)
    r=client.post('/api/ask',json={'question':'儿童肺炎支原体肺炎治疗72小时仍然高热，该从哪些方面检查？','mode':'local'})
    assert r.status_code==200
    d=r.json()
    assert d['mode']=='local' and d['external_sent'] is False
    assert any('支原体' in x['title'] for x in d['matches'])
    assert d['matches'][0]['review_status']


def test_ask_unknown_does_not_fake_diagnosis():
    r=client.post('/api/ask',json={'question':'量子菠萝症XYZ-9234是否需要手术？','mode':'local'})
    assert r.status_code==200
    assert '处方' not in r.json()['answer'] or '不' in r.json()['answer']


def test_external_ai_no_key_and_without_consent(monkeypatch):
    monkeypatch.delenv('AI_API_KEY', raising=False)
    req={'question':'儿童反复发热应如何学习鉴别？','mode':'ai'}
    assert client.post('/api/ask',json=req).status_code==403
    assert client.post('/api/ask',json={**req,'consent_external':True}).status_code==503


def test_invalid_question_and_bad_provider_url(monkeypatch):
    assert client.post('/api/ask',json={'question':'a','mode':'local'}).status_code==422
    monkeypatch.setenv('AI_API_URL', 'http://localhost:11434/chat/completions')
    with pytest.raises(HTTPException):
        ai_config()


def test_status_fields():
    d=client.get('/api/status').json()
    assert d['learning_count'] >= 85
    assert isinstance(d['ai_ready'],bool)


def test_ai_requires_access_code_even_with_key(monkeypatch):
    monkeypatch.setenv('AI_API_KEY','fake-key')
    monkeypatch.delenv('APP_ACCESS_CODE',raising=False)
    payload={'question':'学龄儿童反复咳嗽有哪些重要鉴别？','mode':'ai','consent_external':True}
    r=client.post('/api/ask',json=payload)
    assert r.status_code==503
    monkeypatch.setenv('APP_ACCESS_CODE','unit-test-code-001')
    r=client.post('/api/ask',json=payload,headers={'X-App-Access':'incorrect-code'})
    assert r.status_code==403

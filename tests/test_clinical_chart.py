from fastapi.testclient import TestClient
from app.main import app

cli=TestClient(app)

def test_new_data_catalogues():
    resp=cli.get('/api/clinical-education')
    assert resp.status_code==200
    data=resp.json()
    assert len(data['clinical_paths'])>=16
    assert len(data['lab_tests'])>=26
    assert len(data['infusion_lessons'])>=14
    assert any(x['title']=='肺炎支原体肺炎' for x in data['clinical_paths'])
    assert all(x['review_status'] for x in data['clinical_paths'])

def test_chart_external_consent_required(monkeypatch):
    monkeypatch.setenv('AI_API_KEY','dummy')
    monkeypatch.setenv('APP_ACCESS_CODE','private123')
    d={'note_text':'这是一份无任何真实患者信息的儿童教学病历记录，仅供医学学习质控演示。','doc_type':'admission','consent_external':False}
    r=cli.post('/api/chart-review',json=d,headers={'X-App-Access':'private123'})
    assert r.status_code==403

def test_chart_does_not_send_without_key(monkeypatch):
    monkeypatch.delenv('AI_API_KEY',raising=False)
    d={'note_text':'这是一份无任何真实患者信息的儿童教学病历记录，仅供医学学习质控演示。','doc_type':'admission','consent_external':True}
    r=cli.post('/api/chart-review',json=d)
    assert r.status_code==503

def test_chart_rejects_phi_and_wrong_access(monkeypatch):
    monkeypatch.setenv('AI_API_KEY','dummy')
    monkeypatch.setenv('APP_ACCESS_CODE','private123')
    d={'note_text':'匿名教学病历，主诉发热一日。患者住院号：123456789 在真实部署前必须禁止此类内容外传。','doc_type':'admission','consent_external':True}
    assert cli.post('/api/chart-review',json=d,headers={'X-App-Access':'private123'}).status_code==422
    d['note_text']='这是一份已匿名化的虚构病历记录用于测试病历书写质控，不包含可识别个人信息。'
    assert cli.post('/api/chart-review',json=d,headers={'X-App-Access':'wrongcode'}).status_code==403

def test_chat_review_bad_doc_type(monkeypatch):
    d={'note_text':'这是一份已匿名化的虚构病历记录用于测试病历书写质控，不包含任何可识别个人信息。','doc_type':'other','consent_external':True}
    assert cli.post('/api/chart-review',json=d).status_code==422

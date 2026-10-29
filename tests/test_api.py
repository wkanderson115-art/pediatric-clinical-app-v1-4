from fastapi.testclient import TestClient
from app.main import app, normalize_tianapi, normalize_moseng, clean_content


def test_no_key_status(monkeypatch):
    monkeypatch.delenv("TIANAPI_KEY", raising=False)
    monkeypatch.delenv("MOSENG_API_KEY", raising=False)
    c = TestClient(app)
    d = c.get('/api/status').json()
    assert d['connected'] is False
    r = c.get('/api/search', params={'q':'阿奇霉素'})
    assert r.status_code == 503
    assert 'API' in r.json()['detail']


def test_tianapi_normalization():
    d = normalize_tianapi({'code':200,'result':{'list':[{'title':'学习样例药品','content':'<p>内容</p><script>unsafe</script>'}]}},'学习')
    assert len(d) == 1
    assert d[0].name == '学习样例药品'
    assert '<script>' not in d[0].sections[0].content
    assert not d[0].approval_number


def test_moseng_normalization():
    d = normalize_moseng({'code':10200,'data':{'list':[{'drug_name':'示例药','dosage_form':'注射剂','approval_number':['国药准字H00000000'],'items':[{'title':'用法用量','content':'仅为接口测试文本'}]}]}})
    assert d[0].sections[0].title == '用法用量'
    assert d[0].approval_number == '国药准字H00000000'


def test_input_validation():
    c=TestClient(app)
    assert c.get('/api/search',params={'q':'a'}).status_code==422
    assert clean_content('abc<br/>def') == 'abc\ndef'

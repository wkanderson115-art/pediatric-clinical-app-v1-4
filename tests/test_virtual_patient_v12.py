from pathlib import Path
from fastapi.testclient import TestClient
from app.main import app
import json

ROOT=Path(__file__).resolve().parents[1]
BANK=json.loads((ROOT/'web'/'simulation_cases.json').read_text(encoding='utf8'))

def test_case_catalogue_size_and_specialty():
    assert len(BANK['cases'])>=13
    assert {'呼吸','消化','泌尿','过敏','外伤','急诊','新生儿'}.issubset(set(c['system'] for c in BANK['cases']))

def test_hidden_case_answers_are_structurally_consistent():
    ids=[c['id'] for c in BANK['cases']]
    assert len(ids)==len(set(ids))
    for c in BANK['cases']:
        assert c['expected']['diagnosis'] in c['diagnoses']
        assert 0 < c['age'] < 18
        assert 0 < c['weight_kg'] < 200
        assert c['chief'] and c['vitals'] and c['opening']
        for k,field in [('history','history'),('exams','examinations'),('tests','tests')]:
            assert set(c['expected'][k]).issubset({i['id'] for i in c[field]})
        assert set(c['expected']['drug']).issubset(set(c['drugs']))
        assert set(c['expected']['plan']).issubset(set(c['plans']))
        assert set(c['expected']['harmful']).issubset(set(c['drugs']+c['plans']))
        assert not (set(c['expected']['harmful']) & set(c['expected']['drug']+c['expected']['plan']))
        assert c['source_ids'] and all(s in BANK['sources'] for s in c['source_ids'])
        assert c['reasoning'] and len(c['reasoning'])>=15
        if c['urgent']:
            assert c['course'].get('trigger_min')

def test_source_metadata_https_and_review_limitations():
    assert '未完成' in BANK['purpose']
    for src in BANK['sources'].values():
        assert src['url'].startswith('https://')
        assert src['level']

def test_virtual_patient_assets_http():
    client=TestClient(app)
    assert client.get('/simulation_cases.json').status_code==200
    assert client.get('/virtual-patient.js').status_code==200
    s=client.get('/').text
    assert 'id="page-sim"' in s
    assert 'src="/virtual-patient.js"' in s
    assert 'data-page="sim"' in s

def test_cases_do_not_look_like_real_patient_records():
    txt=json.dumps(BANK,ensure_ascii=False)
    assert '身份证号码' not in txt
    assert '患者真实姓名' not in txt
    assert '开具真实处方' not in txt

def test_learning_content_retained():
    j=json.loads((ROOT/'web'/'clinical_extension.json').read_text(encoding='utf8'))
    assert len(j['clinical_paths'])>=54
    assert len(j['lab_tests'])>=155
    assert len(j['examination_terms'])>=67


def test_simulation_dom_ids_are_unique():
    import re
    from collections import Counter
    html=(ROOT/'web/index.html').read_text()
    ids=re.findall(r'\bid="([\w-]+)"',html)
    dup=[k for k,v in Counter(ids).items() if v>1]
    assert not dup, f"Duplicate HTML ids: {dup}"
    js=(ROOT/'web/virtual-patient.js').read_text()
    assert "$('sim-history-records')" in js
    assert 'id="sim-history-records"' in html
    assert 'id="sim-history-questions"' in html

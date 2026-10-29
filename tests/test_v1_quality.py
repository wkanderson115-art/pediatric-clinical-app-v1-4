import json
from pathlib import Path
from fastapi.testclient import TestClient
from app.main import app
ROOT=Path(__file__).resolve().parents[1]
client=TestClient(app)

def test_quiz_verified_format_and_references():
    bank=client.get('/api/study-quiz').json()
    reg=client.get('/api/study-evidence').json()
    ids={s['id'] for s in reg['sources']}
    assert len(bank['items'])>=25 and len(ids)>=6
    assert len({q['id'] for q in bank['items']})==len(bank['items'])
    for x in bank['items']:
        assert len(x['choices'])==4
        assert isinstance(x['correct'],int) and 0<=x['correct']<4
        assert x['explanation'] and x['source_ids']
        assert set(x['source_ids'])<=ids
        assert '未' in x['review_status']

def test_original_education_preserved_and_not_misrepresented():
    r=client.get('/api/clinical-education')
    assert r.status_code==200
    d=r.json()
    assert len(d['clinical_paths'])>=54
    assert len(d['lab_tests'])==155
    assert len(d['examination_terms'])==67
    assert all(x['content_verification']=='待临床专家逐条审核' for x in d['clinical_paths'])

def test_offline_assets_and_no_external_keys():
    sw=(ROOT/'web/sw.js').read_text()
    html=(ROOT/'web/index.html').read_text()
    for name in ['quiz_cases.json','source_registry.json','study-pro.js','secure-backup.js']:
        assert name in sw and name in html or name.endswith('.json') and name in sw
    for name in ['page-quiz','page-evidence','notes-secure-export','chart-secure-export','secure-pass']:
        assert 'id="'+name+'"' in html
    js=(ROOT/'web/secure-backup.js').read_text()
    assert 'AES-GCM' in js and 'PBKDF2' in js and '310000' in js
    assert 'localStorage.setItem' not in js

def test_html_served_and_no_untrusted_api_overselling():
    html=client.get('/').text
    assert 'V1.1' in html
    assert '国家药监局' in html
    assert '国家药监局尚未提供本项目可用的公开药品检索 API' in html

def test_quality_registry_official_and_conservative():
    d=json.loads((ROOT/'data/source_registry.json').read_text())
    assert all(x['url'].startswith('https://') for x in d['sources'])
    assert '未' in d['status']
    assert d['policy']['drug'].startswith('API返回')


def test_intravenous_teaching_checklist_not_prescribing():
    html=(ROOT/'web/index.html').read_text()
    js=(ROOT/'web/iv-review.js').read_text()
    assert 'iv-review-form' in html and 'iv-review-output' in html
    assert 'newborn' in js and 'doublecheck' in js
    assert '软件未核实药品剂量' in js
    assert 'iv-review.js' in (ROOT/'web/sw.js').read_text()

def test_25_questions_no_executable_drug_doses():
    import re
    quiz=json.loads((ROOT/'data/quiz_cases.json').read_text())
    whole=json.dumps(quiz,ensure_ascii=False)
    assert not re.search(r'\d+(?:\.\d+)?\s*mg\s*/\s*kg',whole,flags=re.I)

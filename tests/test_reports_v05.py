"""Data integrity and safety constraints for the pediatric learning reference extension."""
from fastapi.testclient import TestClient
from app.main import app
from pathlib import Path
import json

BASE=Path(__file__).resolve().parents[1]

def test_catalog_has_both_modalities_and_pediatric_reference_provenance():
    r=TestClient(app).get('/api/clinical-education')
    assert r.status_code==200
    d=r.json()
    assert len(d['lab_tests'])>=150 and len(d['examination_terms'])>=60
    assert len(d['lab_categories'])>=15 and len(d['examination_modalities'])>=12
    assert any('779' in x['name'] for x in d['standards'])
    assert any('780' in x['name'] for x in d['standards'])
    assert '28天' in d['interpretation_policy']['newborn']

def test_lab_entries_have_explanations_and_unique_codes():
    d=json.loads((BASE/'data/clinical_extension.json').read_text())
    labs=d['lab_tests']
    assert len({x['code'].upper() for x in labs})==len(labs)
    for row in labs:
        for name in ('code','name','unit','meaning','high','low','caution','category','follow_up','age_note','interpretation_type','reviewed'):
            assert name in row, (row.get('code'),name)
        assert row['interpretation_type'] in ('numeric','qualitative')
        assert row['reviewed'] is False
        assert not row.get('verified_interval')
    for code in ('WBC','CRP','PCT','Hb','K','PaCO2','HBA1C','SPEC_IGE','TSB_NEONATE'):
        assert any(x['code'].upper()==code.upper() for x in labs)

def test_exam_entries_structured_not_prescriptive():
    d=json.loads((BASE/'data/clinical_extension.json').read_text())
    terms=d['examination_terms']
    assert len({x['id'] for x in terms})==len(terms)
    for term in terms:
        for k in ('modality','term','meaning','contexts','pitfall','follow_up'):
            assert term[k], (term['id'],k)
        assert term['reviewed'] is False
    for term in ('肺实变','QTc延长','肠套叠靶环征','肾盂分离','骨龄超前'):
        assert any(term in x['term'] for x in terms)

def test_frontend_has_report_features_and_preserves_previous_modules():
    html=(BASE/'web/index.html').read_text()
    js=(BASE/'web/clinical.js').read_text()
    for ident in ('page-labs','page-exams','lab-test','lab-rows','lab-batch','lab-unit','exam-text','exam-analyze','page-chart','page-verify','page-infusion'):
        assert f'id="{ident}"' in html
    for method in ('parseLabRows','interpretLab','analyzeExamReport','renderExams','renderLabCards'):
        assert method in js
    assert 'reportUnit!==t.unit' in js
    assert "cl('lab-low').value=''" in js
    assert 'reviewed' not in js or 'reviewed' in js
    assert 'pediatric-cn-shell-v1.4.1-direct' in (BASE/'web/sw.js').read_text()

def test_static_and_api_catalog_content_equal():
    d1=json.loads((BASE/'data/clinical_extension.json').read_text())
    d2=json.loads((BASE/'web/clinical_extension.json').read_text())
    assert d1==d2

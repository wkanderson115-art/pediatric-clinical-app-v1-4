"""The V0.5 dictionaries are study aids, not clinical reference ranges."""
from collections import Counter
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_expanded_study_catalogue_api():
    resp = client.get('/api/clinical-education')
    assert resp.status_code == 200
    d = resp.json()
    assert len(d['lab_tests']) >= 150
    assert len(d['lab_categories']) >= 15
    assert len(d['examination_terms']) >= 60
    assert len(d['examination_modalities']) >= 12
    assert len({x['code'] for x in d['lab_tests']}) == len(d['lab_tests'])
    assert len({x['term'] for x in d['examination_terms']}) == len(d['examination_terms'])
    assert {'血常规', '尿常规', '电解质', '血气', '新生儿', '脑脊液'} <= set(d['lab_categories'])
    assert {'心电图', '胸部X线', '腹部超声', '脑电图'} <= set(d['examination_modalities'])


def test_every_dictionary_entry_is_marked_unreviewed_and_explanatory():
    d = client.get('/api/clinical-education').json()
    for x in d['lab_tests']:
        assert x['meaning'] and x['caution'] and x['age_note']
        assert x['reviewed'] is False
        assert x['interval_status']
        assert x['interpretation_type'] in {'numeric','qualitative'}
    for x in d['examination_terms']:
        assert x['meaning'] and x['pitfall'] and x['follow_up']
        assert x['reviewed'] is False
    assert all(not x['reviewed'] for x in d['lab_tests'] + d['examination_terms'])


def test_qualitative_items_exist_and_age_standard_not_applied_to_newborn():
    d = client.get('/api/clinical-education').json()
    assert any(x['code']=='MP_PCR' and x['interpretation_type']=='qualitative' for x in d['lab_tests'])
    assert any(x['code']=='TSB_NEONATE' and x['category']=='新生儿' for x in d['lab_tests'])
    assert '28' in str(d['interpretation_policy'])


def test_only_public_knowledge_without_api_keys():
    for p in ('/clinical_extension.json','/index.html'):
        assert client.get(p).status_code == 200
    assert client.get('/api/clinical-education').headers['cache-control'].startswith('no-store')

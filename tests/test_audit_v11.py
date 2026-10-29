"""V1.1 audit rules confirm structure only, never medical truth."""
from fastapi.testclient import TestClient
from app.main import app
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
client=TestClient(app)

def test_audit_catalog_has_stable_ids_no_signoffs():
    data=json.loads((ROOT/'data'/'medical_audit.json').read_text())
    assert len(data['records'])>2000
    assert data['summary']['total_claims']==len(data['records'])
    assert data['signed_off_count']==0
    assert data['summary']['ready_for_clinical_use'] is False
    ids=[x['claim_id'] for x in data['records']]
    assert len(ids)==len(set(ids))
    assert all(x['medical_review_status']=='未进行专家逐条审核' for x in data['records'])
    assert all(x['review_result']=='待审核' and not x['reviewer_name'] for x in data['records'])

def test_audit_summary_safe_and_consistent():
    data=client.get('/api/audit/summary').json()
    assert data['medical_signoff_completed'] is False
    assert data['drug_license_obtained'] is False
    stats=data['summary']
    assert stats['claims_with_candidate_source']+stats['claims_without_candidate_source']==stats['total_claims']

def test_audit_filter_pagination_and_missing_source():
    a=client.get('/api/audit/items',params={'kind':'化验指标','missing_source':'true','page_size':5}).json()
    assert len(a['items'])==5
    assert a['total']>100
    assert all(x['kind']=='化验指标' and not x['sources'] for x in a['items'])
    ids=[x['claim_id'] for x in a['items']]
    b=client.get('/api/audit/items',params={'kind':'化验指标','missing_source':'true','page_size':5,'page':2}).json()
    assert not set(ids).intersection(x['claim_id'] for x in b['items'])

def test_audit_filter_search_and_priority():
    a=client.get('/api/audit/items',params={'q':'支原体肺炎','priority':'P0'}).json()
    assert a['total']>=1
    assert all(x['priority'].startswith('P0') for x in a['items'])

def test_export_csv_and_html_workbench():
    assert client.get('/api/audit/export').status_code==200
    html=client.get('/').text
    for x in ('page-audit','audit-query','audit-list','/audit-workbench.js'):
        assert x in html

def test_cannot_publish_unreviewed_medical_claims_by_public_api():
    # All audit APIs are read-only; no unauthenticated approval mutation route.
    methods={(r.path,m) for r in app.routes if hasattr(r,'methods') for m in r.methods}
    assert not any('/api/audit' in path and method not in ('GET','HEAD') for path,method in methods)

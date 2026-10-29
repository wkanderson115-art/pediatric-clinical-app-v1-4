from pathlib import Path
import json
from fastapi.testclient import TestClient
from app.main import app
BASE=Path(__file__).resolve().parents[1]
DATA=json.loads((BASE/'web/simulation_cases.json').read_text(encoding='utf-8'))

def test_simulator_v13_volume():
    assert DATA['version']=='1.3.0'
    assert len(DATA['cases'])==157
    assert DATA['catalogue']['core_scenarios']==36
    assert DATA['catalogue']['scenario_variants']==144
    assert len([x for x in DATA['cases'] if x['system']=='住院输液'])==48
    assert len([x for x in DATA['cases'] if x.get('archetype_id') and x['system']=='呼吸'])==48
    assert len([x for x in DATA['cases'] if x.get('archetype_id') and x['system']=='消化'])==48

def test_inpatient_notes_and_sources():
    cases=DATA['cases']
    assert len({c['id'] for c in cases})==len(cases)
    for c in cases:
        if c['system']=='住院输液':
            assert c['admission']['admission_note']
            assert c['admission']['nursing_note']
            assert c['admission']['orders']
            assert c['admission']['intake_output']
            assert len(c['admission']['iv_safety'])==5
        assert c['expected']['diagnosis'] in c['diagnoses']
        assert set(c['expected']['harmful']).issubset(set(c['drugs']+c['plans']))
        assert not(set(c['expected']['drug']+c['expected']['plan']) & set(c['expected']['harmful']))
        assert all(z in DATA['sources'] for z in c['source_ids'])

def test_client_assets_and_dom():
    client=TestClient(app)
    assert client.get('/simulation_cases.json').status_code==200
    html=client.get('/').text
    assert 'sim-admission-record' in html
    assert 'sim-iv-checks' in html
    assert 'sim-difficulty' in html
    assert 'sim-filters' in client.get('/style.css').text
    assert 'renderAdmission' in client.get('/virtual-patient.js').text

def test_original_data_consistency():
    assert (BASE/'web/simulation_cases.json').read_bytes()==(BASE/'data/simulation_cases.json').read_bytes()
    assert len(json.loads((BASE/'data/clinical_extension.json').read_text())['clinical_paths'])>=54

def test_inpatient_order_decision_safe_vs_unsafe():
    new = [c for c in DATA['cases'] if c.get('archetype_id') and c['system']=='住院输液']
    assert len(new)==48
    for c in new:
        a = c['admission']
        orders=a['order_review']
        assert len(orders)==3
        assert [x['correct'] for x in orders] == ['通过','退回','退回']
        assert all(x['text'] and x['reason'] for x in orders)
        assert all(x['source']=='教学虚构记录' for x in a['lab_values'])
        assert a['lab_caveat'] and a['daily_observations']

def test_no_double_counted_diseases():
    new=[c for c in DATA['cases'] if c.get('archetype_id')]
    groups={v:set() for v in ('呼吸','消化','住院输液')}
    for c in new:groups[c['system']].add(c['archetype_id'])
    assert all(len(ids)==12 for ids in groups.values())
    for aid in set(c['archetype_id'] for c in new):
        variants=[c for c in new if c['archetype_id']==aid]
        assert len(variants)==4
        assert len({c['variant'] for c in variants})==4

def test_v13_screen_and_cache_ids():
    h=(BASE/'web/index.html').read_text('utf8')
    js=(BASE/'web/virtual-patient.js').read_text('utf8')
    sw=(BASE/'web/sw.js').read_text('utf8')
    for name in ('sim-order-review','sim-chart-audit','sim-admission-record','sim-iv-checks'):
        assert f'id="{name}"' in h
    assert 'points.orderReview' in js
    assert "s.orderReviews[x.id]" in js
    assert 'pediatric-cn-shell-v1.4.0' in sw
    assert '<span class="version">V1.4</span>' in h

"""V1.5 内容补全回归测试：只校验数据完整性与双份数据一致性。

不依赖 FastAPI，因此在没有安装后端依赖的环境也能执行；
接口行为测试见 tests/test_v15_api.py。
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data'
WEB = ROOT / 'web'


def load(base: Path, name: str) -> dict:
    return json.loads((base / name).read_text(encoding='utf-8'))


def test_clinical_paths_all_have_sources_and_medication_fields():
    data = load(DATA, 'clinical_extension.json')
    paths = data['clinical_paths']
    assert len(paths) == 54
    assert all(p.get('sources') for p in paths), 'V1.5 要求 54 条路径全部有候选来源入口'
    assert all(p.get('medication') for p in paths), '每条路径都应有用药核对重点'
    assert all(p.get('special') for p in paths), '每条路径都应有非典型情况提示'
    for path in paths:
        assert path['review_status'], '缺少审校状态说明'


def test_formulary_offline_library_is_complete():
    data = load(DATA, 'drug_formulary.json')
    items = data['items']
    required = {'id', 'generic_name', 'aliases', 'category', 'drug_class', 'forms', 'indications',
                'peds_notes', 'dose_note', 'max_single', 'renal_note', 'hepatic_note', 'cautions',
                'contraindications', 'adverse', 'monitoring', 'age_limit', 'interactions',
                'sources', 'review_status', 'tags'}
    assert len(items) >= 72
    assert len({x['id'] for x in items}) == len(items)
    assert all(set(x) == required for x in items)
    assert {x['category'] for x in items} == set(data['categories'])
    assert data['policy']['not_a_prescription'] is True
    for item in items:
        assert '须核对' in item['dose_note'], f'{item["id"]} 的剂量描述应带核对提示'
        assert item['review_status'].startswith('编辑性教学整理')


def test_lab_reference_ranges_cover_every_dictionary_code():
    clinical = load(DATA, 'clinical_extension.json')
    ranges = load(DATA, 'lab_reference_ranges.json')
    codes = {t['code'] for t in clinical['lab_tests']}
    items = ranges['items']
    assert {r['code'] for r in items} == codes
    assert len(items) == len(codes) == 155
    full = [r for r in items if len(r['ranges']) == 5]
    assert len(full) >= 60
    for r in items:
        assert r['verified'] is False
        assert r['method_note']
        for band in r['ranges']:
            assert band['band'] in ranges['bands']
            assert float(band['low']) < float(band['high'])
    assert ranges['policy']['neonate'], '必须写明新生儿不得套用年长儿区间'


def test_learning_topics_added_and_structured():
    learning = load(DATA, 'learning.json')
    topics = [t for s in learning['systems'] for t in s['topics']]
    assert len(learning['systems']) == 17
    assert len(topics) >= 111
    keys = {'临床识别', '检查与鉴别', '处理与用药原则', '紧急警示', '常见误区'}
    assert all(set(t['content']) == keys for t in topics)
    assert len({t['id'] for t in topics}) == len(topics)


def test_simulation_cases_complete_with_course_and_scenarios():
    sim = load(DATA, 'simulation_cases.json')
    cases = sim['cases']
    assert len(cases) == 157
    assert all(c.get('course') for c in cases), 'V1.5 要求 157 份病例都有复评脚本'
    for case in cases:
        course = case['course']
        assert isinstance(course['trigger_min'], int) and 5 <= course['trigger_min'] <= 60
        assert course['without'] and course['with']
    scenarios = sim['catalogue']['scenarios']
    ids = {c['id'] for c in cases}
    assert len(scenarios) == 36
    for scenario in scenarios:
        assert len(scenario['variants']) == 4
        assert set(scenario['variants']) <= ids
        assert len(scenario['objectives']) == 4


def test_quiz_bank_expanded_with_sources():
    quiz = load(DATA, 'quiz_cases.json')
    items = quiz['items']
    assert len(items) >= 50
    assert len({x['id'] for x in items}) == len(items)
    for item in items:
        assert len(item['choices']) == 4
        assert 0 <= item['correct'] < 4
        assert len(item['explanation']) >= 20
        assert item['source_ids']
        assert item['review_status']


def test_audit_ledger_covers_new_content_kinds():
    audit = load(DATA, 'medical_audit.json')
    kinds = {r['kind'] for r in audit['records']}
    assert {'诊疗路径', '基础专题', '化验指标', '检查术语', '输液安全', '循证练习题', '离线药典'} <= kinds
    assert audit['signed_off_count'] == 0
    assert audit['summary']['ready_for_clinical_use'] is False
    assert audit['summary']['total_claims'] == len(audit['records'])


def test_data_and_web_static_copies_are_identical():
    names = ('medical_audit', 'quiz_cases', 'learning', 'clinical_extension', 'source_registry',
             'simulation_cases', 'drug_formulary', 'lab_reference_ranges')
    for name in names:
        a = DATA / f'{name}.json'
        b = WEB / f'{name}.json'
        assert a.exists() and b.exists(), name
        assert hashlib.sha256(a.read_bytes()).hexdigest() == hashlib.sha256(b.read_bytes()).hexdigest(), name


def test_frontend_references_new_assets():
    html = (WEB / 'index.html').read_text(encoding='utf-8')
    sw = (WEB / 'sw.js').read_text(encoding='utf-8')
    for token in ('formulary.js', 'offline-formulary', 'formulary-keyword', 'lab-ranges',
                  'sim-scenarios', 'V1.7'):
        assert token in html, token
    for token in ('/formulary.js', '/drug_formulary.json', '/lab_reference_ranges.json'):
        assert token in sw, token

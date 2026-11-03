"""V1.6 结构化升级回归测试：剂量规则、关联索引、结构校验、双份数据一致。

不依赖 FastAPI；接口行为见 tests/test_v16_api.py。
"""
from __future__ import annotations

import hashlib
import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / 'data'
WEB = ROOT / 'web'


def load(base: Path, name: str) -> dict:
    return json.loads((base / name).read_text(encoding='utf-8'))


def test_v16_expansion_landed():
    drugs = load(DATA, 'drug_formulary.json')
    quiz = load(DATA, 'quiz_cases.json')
    learning = load(DATA, 'learning.json')
    assert len(drugs['items']) >= 110, len(drugs['items'])
    assert len(quiz['items']) >= 70, len(quiz['items'])
    topics = [t for s in learning['systems'] for t in s['topics']]
    assert len(topics) >= 130, len(topics)
    assert len(drugs['categories']) >= 16
    assert {x['category'] for x in drugs['items']} == set(drugs['categories'])
    assert len({x['id'] for x in drugs['items']}) == len(drugs['items'])


def test_dose_rules_cover_every_drug_and_keep_boundaries():
    drugs = load(DATA, 'drug_formulary.json')['items']
    rules = load(DATA, 'dose_rules.json')
    assert rules['policy']['not_a_prescription'] is True
    assert rules['policy']['verification']
    assert rules['counts']['drugs'] == len(drugs)
    ids = [x['drug_id'] for x in rules['items']]
    assert len(ids) == len(set(ids))
    assert set(ids) == {d['id'] for d in drugs}
    with_numbers = [x for x in rules['items'] if x['rules']]
    assert len(with_numbers) >= 60, len(with_numbers)
    for record in rules['items']:
        assert record['verified'] is False
        assert '非说明书原文' in record['basis']
        for rule in record['rules']:
            assert 0 <= rule['low'] <= rule['high']
            assert rule['basis'] in ('日', '次')
            assert rule['unit']
            assert rule['verified'] is False


def test_relations_reference_real_entities():
    clinical = load(DATA, 'clinical_extension.json')
    drugs = load(DATA, 'drug_formulary.json')['items']
    learning = load(DATA, 'learning.json')
    quiz = load(DATA, 'quiz_cases.json')['items']
    sim = load(DATA, 'simulation_cases.json')['cases']
    relations = load(DATA, 'relations.json')
    index = relations['index']
    assert isinstance(index, dict) and index
    assert relations['counts']['links'] >= 300
    valid = {
        'drug': {d['id'] for d in drugs},
        'path': {p['id'] for p in clinical['clinical_paths']},
        'lab': {l['code'] for l in clinical['lab_tests']},
        'exam': {e['id'] for e in clinical['examination_terms']},
        'topic': {t['id'] for s in learning['systems'] for t in s['topics']},
        'quiz': {q['id'] for q in quiz},
        'case': {c['id'] for c in sim},
    }
    for key, links in index.items():
        kind, ident = key.split(':', 1)
        assert kind in valid and ident in valid[kind], key
        for link in links:
            assert link['type'] in valid, link
            assert link['id'] in valid[link['type']], (key, link)
            assert link['label'] and link['basis']
    # 双向性抽查：任一链接必须存在反向条目
    for key, links in index.items():
        for link in links:
            back = index.get(f"{link['type']}:{link['id']}") or []
            assert any(x['type'] == key.split(':', 1)[0] and x['id'] == key.split(':', 1)[1] for x in back), (key, link)


def test_schema_validation_passes():
    result = subprocess.run([sys.executable, str(ROOT / 'tools' / 'validate_content.py')],
                            cwd=ROOT, capture_output=True, text=True,
                            encoding='utf-8', errors='replace')
    assert result.returncode == 0, result.stdout + result.stderr
    assert '全部通过' in result.stdout


def test_new_static_files_copied_to_web():
    for name in ('dose_rules.json', 'relations.json', 'drug_formulary.json',
                 'quiz_cases.json', 'learning.json'):
        a = DATA / name
        b = WEB / name
        assert a.exists() and b.exists(), name
        assert hashlib.sha256(a.read_bytes()).hexdigest() == hashlib.sha256(b.read_bytes()).hexdigest(), name


def test_frontend_wires_v16_features():
    html = (WEB / 'index.html').read_text(encoding='utf-8')
    sw = (WEB / 'sw.js').read_text(encoding='utf-8')
    formulary = (WEB / 'formulary.js').read_text(encoding='utf-8')
    for token in ('page-global', 'global-query', 'global-results', '/relations.js', '/global-search.js', 'V1.7'):
        assert token in html, token
    for token in ('/dose_rules.json', '/relations.json', '/relations.js', '/global-search.js', 'v1.7.0'):
        assert token in sw, token
    for token in ('appendDosePanel', 'dose_rules.json', 'Relations.render'):
        assert token in formulary, token

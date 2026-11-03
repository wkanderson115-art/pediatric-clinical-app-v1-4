"""V1.7.1：iOS 自定义 scheme 下数据取不到的修复回归。

检查三件事：
1. 内联数据文件齐全且能解析成全局对象（不依赖 fetch）；
2. 关键模块不再直接 fetch 本地 JSON，而是走 LocalData；
3. 首页在业务脚本之前加载 local-data.js 与内联数据。
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
WEB = ROOT / 'web'
INLINE = WEB / 'inline-data'


def test_inline_data_files_are_present_and_valid():
    manifest = json.loads((INLINE / 'manifest.json').read_text(encoding='utf-8'))
    for rel in ('drug_formulary.json', 'lab_reference_ranges.json', 'clinical_extension.json',
                'learning.json', 'quiz_cases.json', 'dose_rules.json', 'relations.json',
                'library/books.json', 'library/demo_quickref.json'):
        assert rel in manifest, rel
        payload = (INLINE / manifest[rel]['file']).read_text(encoding='utf-8')
        assert payload.startswith('window.__DATA__=window.__DATA__||{};'), rel
        assert 'window.__DATA__[' in payload, rel
    # 大文件允许懒加载，但必须生成本人可注入的脚本
    for rel in ('simulation_cases.json', 'medical_audit.json'):
        assert rel in manifest, rel
        assert (INLINE / manifest[rel]['file']).exists(), rel


def test_modules_use_local_data_loader():
    loader = (WEB / 'local-data.js').read_text(encoding='utf-8')
    for token in ('fromInline', 'loadScript', 'xhrJson', 'window.LocalData'):
        assert token in loader, token
    for name in ('formulary.js', 'library.js', 'clinical.js', 'learning.js', 'relations.js',
                 'study-pro.js', 'global-search.js', 'virtual-patient.js', 'audit-workbench.js'):
        text = (WEB / name).read_text(encoding='utf-8')
        assert 'LocalData.load(' in text, name
        assert not re.search(r"fetch\('/[^']+\.json'", text), f'{name} 仍直接 fetch 本地 JSON'


def test_index_loads_loader_before_inline_and_modules():
    html = (WEB / 'index.html').read_text(encoding='utf-8')
    loader_pos = html.index('/local-data.js')
    inline_pos = html.index('/inline-data/drug_formulary.js')
    module_pos = html.index('/formulary.js')
    assert loader_pos < inline_pos < module_pos
    for name in ('drug_formulary', 'lab_reference_ranges', 'clinical_extension', 'learning',
                 'quiz_cases', 'dose_rules', 'relations', 'source_registry'):
        assert f'/inline-data/{name}.js' in html, name


def test_demo_book_is_substantially_full():
    books = json.loads((ROOT / 'data/library/books.json').read_text(encoding='utf-8'))
    demo = next(b for b in books['books'] if b['id'] == 'demo_quickref')
    assert demo['chunks'] >= 600, demo['chunks']
    payload = json.loads((ROOT / 'data/library/demo_quickref.json').read_text(encoding='utf-8'))
    assert len(payload['chunks']) == demo['chunks']
    labels = [c['p'] for c in payload['chunks']]
    assert any(l.startswith('专题') for l in labels)
    assert any(l.startswith('练习') for l in labels)
    assert any(l.startswith('病例') for l in labels)

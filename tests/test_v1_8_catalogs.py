"""V1.8：官方目录（医保 / 批文）数据与接口回归。"""
from __future__ import annotations

import gzip
import json
from pathlib import Path

import pytest

pytest.importorskip('fastapi')

from fastapi.testclient import TestClient  # noqa: E402

from app import main as app_main  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
client = TestClient(app_main.app)


def test_insurance_catalog_data():
    data = json.loads((ROOT / 'data/insurance_catalog.json').read_text(encoding='utf-8'))
    assert data['count'] >= 3000, data['count']
    items = data['items']
    assert {'西药部分', '中成药部分', '协议期内谈判药品部分'} <= {x['section'] for x in items}
    assert {'甲类', '乙类'} <= {x['insurance_class'] for x in items}
    assert any(x['name'] == '阿奇霉素' for x in items)
    # 离线副本必须存在（iOS 自定义 scheme 靠内联/静态文件）
    assert (ROOT / 'web/insurance_catalog.json').exists()
    assert (ROOT / 'web/inline-data/insurance_catalog.js').exists()


def test_approval_catalog_is_compact_tsv():
    gz = ROOT / 'data/approval_catalog.tsv.gz'
    meta = json.loads((ROOT / 'data/approval_catalog_meta.json').read_text(encoding='utf-8'))
    assert gz.exists() and gz.stat().st_size < 10 * 1024 * 1024
    assert meta['count'] >= 100000, meta['count']
    with gzip.open(gz, 'rt', encoding='utf-8') as fh:
        first = fh.readline().split('\t')
    assert len(first) == len(meta['columns']) == 6
    # 大表不进 web / 不进源码 PWA
    assert not (ROOT / 'web/approval_catalog.json').exists()


def test_insurance_endpoint():
    data = client.get('/api/catalog/insurance', params={'q': '阿奇霉素'}).json()
    assert data['total'] >= 1
    item = data['items'][0]
    assert item['name'] and item['insurance_class'] in ('甲类', '乙类')
    assert data['catalog_count'] >= 3000


def test_approval_endpoint_streams_results():
    data = client.get('/api/catalog/approval', params={'q': '头孢曲松', 'page_size': 5}).json()
    assert data['total'] > 0
    assert len(data['items']) <= 5
    first = data['items'][0]
    assert first['approval_number'].startswith('国药准字')
    assert data['official_verification']


def test_catalog_stats():
    data = client.get('/api/catalog/stats').json()
    assert data['insurance']['count'] >= 3000
    assert data['approval']['count'] >= 100000


def test_frontend_wires_catalogs():
    html = (ROOT / 'web/index.html').read_text(encoding='utf-8')
    sw = (ROOT / 'web/sw.js').read_text(encoding='utf-8')
    js = (ROOT / 'web/catalogs.js').read_text(encoding='utf-8')
    for token in ('page-catalogs', 'catalog-query', 'catalog-results', '/catalogs.js'):
        assert token in html, token
    for token in ('/catalogs.js', '/insurance_catalog.json'):
        assert token in sw, token
    for token in ('api/catalog/', 'insuranceOffline', 'catalog-query'):
        assert token in js, token
    assert client.get('/api/status').json()['version'].startswith('1.9')

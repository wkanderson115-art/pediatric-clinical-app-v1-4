"""把 V1.5 更新后的大体积教学资产重新切分为可校验分片，并重建 manifest。

用途：源码包 / Docker 构建使用 asset_parts 分片 + tools/rebuild_large_assets.py 还原，
避免单文件过大。合并内容后必须运行本脚本，否则 Docker 构建会用旧分片覆盖新数据。
"""
from __future__ import annotations

import hashlib
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
PARTS = ROOT / 'asset_parts'
MANIFEST = PARTS / 'manifest.json'
CHUNK = 400_000

# 需要分片的大资产（data/ 与 web/ 内容相同者复用同一组分片）
ASSETS = [
    'data/medical_audit.json',
    'web/medical_audit.json',
    'data/simulation_cases.json',
    'web/simulation_cases.json',
    'docs/医学逐条审核底稿.csv',
    'V0.3_iPhone四屏模拟预览.png',
    'data/drug_formulary.json',
    'web/drug_formulary.json',
    'data/lab_reference_ranges.json',
    'web/lab_reference_ranges.json',
    'data/dose_rules.json',
    'web/dose_rules.json',
    'data/relations.json',
    'web/relations.json',
]


def split_path(rel: str) -> list[str]:
    data = (ROOT / rel).read_bytes()
    basename = rel.replace('/', '__')
    names = []
    for index in range(0, len(data), CHUNK):
        name = f'{basename}.part{index // CHUNK + 1:03d}'
        (PARTS / name).write_bytes(data[index:index + CHUNK])
        names.append(f'asset_parts/{name}')
    return names


def main() -> None:
    PARTS.mkdir(exist_ok=True)
    old = json.loads(MANIFEST.read_text(encoding='utf-8')) if MANIFEST.exists() else {'assets': []}
    for item in old.get('assets', []):
        for part in item.get('parts', []):
            target = ROOT / part
            if target.exists():
                target.unlink()
    assets, seen = [], {}
    for rel in ASSETS:
        payload = (ROOT / rel).read_bytes()
        digest = hashlib.sha256(payload).hexdigest()
        if digest in seen:
            parts = seen[digest]
        else:
            parts = split_path(rel)
            seen[digest] = parts
        assets.append({'path': rel, 'size': len(payload), 'sha256': digest, 'parts': parts})
        print(f'{rel}: {len(payload)} bytes, {len(parts)} part(s)')
    MANIFEST.write_text(json.dumps({'version': 2, 'assets': assets}, ensure_ascii=False, indent=2) + '\n',
                        encoding='utf-8')
    print(f'manifest written with {len(assets)} assets')


if __name__ == '__main__':
    main()

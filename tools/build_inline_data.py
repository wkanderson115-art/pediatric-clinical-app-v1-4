"""把 JSON 数据内联为普通 <script>，解决 WKWebView 自定义 scheme 下 fetch/XHR 取不到数据的问题。

背景：iOS 壳用 pediatric://app/ 由 BundleSchemeHandler 提供 web/ 静态文件。
<script src> 这类子资源能正常加载，但 JS 里的 fetch() 访问自定义 scheme 在部分 iOS 版本会直接失败，
导致离线药典、离线书库、化验区间等“搜索不出来东西”。内联成脚本后，数据以全局对象存在，
搜索不再依赖网络请求。

生成：web/inline-data/*.js，每个文件形如
    window.__DATA__ = window.__DATA__ || {};
    window.__DATA__['drug_formulary.json'] = {...};

用法：python tools/build_inline_data.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data'
WEB_DATA = ROOT / 'web'
OUT = ROOT / 'web' / 'inline-data'

# 需要内联的文件（相对 data/）；顺序决定加载先后
TARGETS = [
    'drug_formulary.json',
    'lab_reference_ranges.json',
    'clinical_extension.json',
    'learning.json',
    'quiz_cases.json',
    'dose_rules.json',
    'relations.json',
    'source_registry.json',
    'simulation_cases.json',
    'medical_audit.json',
    'library/books.json',
    'library/demo_quickref.json',
]


def inline_name(rel: str) -> str:
    return re.sub(r'[^A-Za-z0-9_.-]+', '__', rel.replace('/', '__').replace('.json', '')) + '.js'


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob('*.js'):
        old.unlink()
    manifest = {}
    for rel in TARGETS:
        src = DATA / rel
        if not src.exists():
            print(f'skip {rel}: 不存在')
            continue
        payload = src.read_bytes()
        text = payload.decode('utf-8')
        json.loads(text)  # 校验合法
        name = inline_name(rel)
        js = ("window.__DATA__=window.__DATA__||{};\n"
              f"window.__DATA__[{json.dumps(rel)}]=" + text.rstrip() + ";\n")
        (OUT / name).write_text(js, encoding='utf-8')
        manifest[rel] = {'file': name, 'bytes': len(js.encode('utf-8'))}
        print(f'{rel} -> inline-data/{name} ({len(js.encode("utf-8"))} bytes)')
    (OUT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'共 {len(manifest)} 个内联数据文件')


if __name__ == '__main__':
    main()

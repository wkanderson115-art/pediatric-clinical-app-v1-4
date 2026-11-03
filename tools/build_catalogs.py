"""离线目录构建器：国家医保药品目录（2024）PDF + NMPA 国产药品数据 → 两个 JSON。

输入：
    医保目录 PDF：data/library/raw/yb2024.pdf
        （官网 https://www.gov.cn/zhengce/zhengceku/202411/content_6989859.htm 附件）
    NMPA 数据：  data/library/raw/nmpa2020.zip
        （https://github.com/shi-yuan/nmpa-data → 药品/2020/国产药品/国产药品.json.zip）

输出：
    data/insurance_catalog.json   药品名称 / 剂型 / 甲乙类 / 备注 / 目录编号 / 章节
    data/approval_catalog.json    药品名称 / 批准文号 / 剂型 / 生产企业 / 规格 / 类别

用法：
    python tools/build_catalogs.py --insurance data/library/raw/yb2024.pdf
    python tools/build_catalogs.py --approval  data/library/raw/nmpa2020.zip
    python tools/build_catalogs.py --both
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data'
DEFAULT_PDF = DATA / 'library' / 'raw' / 'yb2024.pdf'
DEFAULT_ZIP = DATA / 'library' / 'raw' / 'nmpa2020.zip'

# layout 模式下每行形如：
# 　乙　17  艾普拉唑　　　　　　口服常释剂型　　限有十二指肠溃疡…
ROW_RE = re.compile(r'^\s*([甲乙])\s*(?:★?\((\d+)\)|(\d+))\s+(.+?)(?:\s{2,}(.*))?$')
SECTION_RE = re.compile(r'^\s*([一二三四五六七八九十]+、)?\s*(西药部分|中成药部分|协议期内谈判药品部分.*|中药饮片部分)')
ATC_RE = re.compile(r'^\s*([A-Z]\d{2}[A-Z]{0,2}|[A-Z]{2}\d{2})\s*(.*)$')
DOSAGE_TOKENS = ('口服常释剂型', '注射剂', '口服液体剂', '颗粒剂', '口服散剂', '缓释控释剂型',
                 '吸入剂', '外用液体剂', '软膏剂', '乳膏剂', '凝胶剂', '栓剂', '滴眼剂',
                 '贴剂', '喷雾剂', '咀嚼片', '口服溶液剂', '注射用无菌粉末', '干混悬剂')


def clean(text: str) -> str:
    return re.sub(r'\s+', ' ', str(text or '')).strip()


def split_dosage(tail: str) -> tuple[str, str]:
    tail = clean(tail)
    for token in DOSAGE_TOKENS:
        if tail.startswith(token):
            return token, clean(tail[len(token):])
    # 剂型列不一定命中词表，按首个双空格切
    parts = re.split(r'\s{2,}', tail, maxsplit=1)
    if len(parts) == 2:
        return clean(parts[0]), clean(parts[1])
    return '', tail


def parse_insurance(pdf_path: Path) -> list[dict]:
    from pypdf import PdfReader

    reader = PdfReader(str(pdf_path))
    section = '西药部分'
    atc = ''
    records: list[dict] = []
    seen: set[str] = set()
    for page in reader.pages:
        try:
            text = page.extract_text(extraction_mode='layout') or ''
        except TypeError:
            text = page.extract_text() or ''
        for raw_line in text.splitlines():
            line = clean(raw_line)
            if not line:
                continue
            section_match = SECTION_RE.search(line)
            if section_match:
                section = section_match.group(2).split('（')[0]
                continue
            atc_match = ATC_RE.match(raw_line)
            if atc_match and not ROW_RE.match(raw_line):
                atc = clean(atc_match.group(2)) or atc
                continue
            match = ROW_RE.match(raw_line)
            if not match:
                continue
            level = {'甲': '甲类', '乙': '乙类'}[match.group(1)]
            number = match.group(2) or match.group(3)
            name = clean(match.group(4))
            dosage, note = split_dosage(match.group(5) or '')
            if len(name) < 2:
                continue
            key = f'{section}|{level}|{name}|{dosage}'
            if key in seen:
                continue
            seen.add(key)
            records.append({
                'name': name,
                'dosage_form': dosage,
                'insurance_class': level,
                'catalog_no': number,
                'note': note[:180],
                'section': section,
                'atc_category': atc if section.startswith('西药') else '',
            })
    return records


def parse_nmpa_zip(zip_path: Path) -> list[dict]:
    records = []
    with zipfile.ZipFile(zip_path) as zf:
        names = [n for n in zf.namelist() if n.lower().endswith('.json')]
        if not names:
            raise SystemExit('压缩包里没有 JSON 文件')
        for name in names:
            payload = json.loads(zf.read(name).decode('utf-8', errors='replace'))
            rows = payload if isinstance(payload, list) else payload.get('data') or payload.get('list') or []
            records.extend(parse_nmpa_rows(rows))
    # 去重（同批文+同名）
    unique = {}
    for record in records:
        unique[record['approval_number'] + '|' + record['name']] = record
    return list(unique.values())


def parse_nmpa_rows(rows: list) -> list[dict]:
    records = []
    for item in rows:
        if not isinstance(item, dict):
            continue

        def pick(*keys: str) -> str:
            for key in keys:
                value = item.get(key)
                if isinstance(value, list):
                    value = '、'.join(str(x) for x in value if x)
                if value:
                    return clean(str(value))
            return ''

        name = pick('产品名称', '药品名称', 'name', 'drugName')
        approval = pick('批准文号', 'approvalNumber', 'approval_no', 'pzwh')
        if not (name and approval):
            continue
        records.append({
            'name': name,
            'approval_number': approval,
            'dosage_form': pick('剂型', 'dosageForm', 'form'),
            'manufacturer': pick('生产单位', '上市许可持有人', '生产企业', 'manufacturer'),
            'specification': pick('规格', 'specification'),
            'category': pick('产品类别', '药品类别', 'category'),
            'trade_name': pick('商品名', 'tradeName'),
            'english_name': pick('英文名称', 'englishName')[:80],
        })
    return records


def write(name: str, records: list[dict], source: str, raw_bytes: int = 0) -> None:
    text = json.dumps({
        'version': '1.0',
        'updated': '2026-11-03',
        'source': source,
        'count': len(records),
        'policy': '由官方公开文件/公开数据集整理；仅用于检索与核对，不代表实时监管数据，也不构成处方依据。',
        'items': records,
    }, ensure_ascii=False, separators=(',', ':'))
    (DATA / name).write_text(text + '\n', encoding='utf-8')
    if name.startswith('insurance'):
        (ROOT / 'web' / name).write_text(text + '\n', encoding='utf-8')
    else:
        stale = ROOT / 'web' / name
        if stale.exists():
            stale.unlink()
    print(f'{name}: {len(records)} 条 / {len(text.encode("utf-8"))} 字节 / sha256={hashlib.sha256(text.encode()).hexdigest()[:12]}')



def write_approval(records: list[dict]) -> None:
    """批文目录体积大：写成 gzip TSV + 小 meta JSON，服务端流式检索，不进 web。"""
    import gzip

    target = DATA / 'approval_catalog.tsv.gz'
    columns = ('name', 'approval_number', 'dosage_form', 'specification', 'manufacturer', 'category')
    with gzip.open(target, 'wt', encoding='utf-8', compresslevel=6) as fh:
        for record in records:
            values = [re.sub(r'[\t\n\r]+', ' ', str(record.get(key) or '')) for key in columns]
            fh.write('\t'.join(values) + '\n')
    meta = {
        'version': '1.0',
        'updated': '2026-11-03',
        'source': '国家药监局药品数据（GitHub shi-yuan/nmpa-data，2020 国产药品快照）',
        'count': len(records),
        'columns': list(columns),
        'policy': '仅用于检索与核对；批准文号状态请到国家药监局官网复核。',
    }
    (DATA / 'approval_catalog_meta.json').write_text(
        json.dumps(meta, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'approval_catalog.tsv.gz: {len(records)} 行 / {target.stat().st_size} 字节')
    for stale in (DATA / 'approval_catalog.json', ROOT / 'web' / 'approval_catalog.json'):
        if stale.exists():
            stale.unlink()
            print('removed stale', stale.relative_to(ROOT))


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument('--insurance', nargs='?', const=str(DEFAULT_PDF))
    parser.add_argument('--approval', nargs='?', const=str(DEFAULT_ZIP))
    parser.add_argument('--both', action='store_true')
    args = parser.parse_args()
    if args.both:
        args.insurance = args.insurance or str(DEFAULT_PDF)
        args.approval = args.approval or str(DEFAULT_ZIP)
    if args.insurance:
        records = parse_insurance(Path(args.insurance))
        write('insurance_catalog.json', records,
              '国家医保局《国家基本医疗保险、工伤保险和生育保险药品目录（2024年）》PDF')
    if args.approval:
        records = parse_nmpa_zip(Path(args.approval))
        write_approval(records)


if __name__ == '__main__':
    main()

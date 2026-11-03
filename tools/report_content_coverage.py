"""V1.5 内容覆盖验收脚本（不依赖网络与第三方库）。

运行：python tools/report_content_coverage.py
全部断言通过时退出码为 0，并打印内容覆盖表；任何缺口直接 AssertionError。
"""
from __future__ import annotations

import hashlib
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data'
WEB = ROOT / 'web'

FAILS: list[str] = []


def load(base: Path, name: str) -> dict:
    return json.loads((base / name).read_text(encoding='utf-8'))


def check(condition: bool, message: str) -> None:
    if not condition:
        FAILS.append(message)


def sha(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main() -> int:
    clinical = load(DATA, 'clinical_extension.json')
    learning = load(DATA, 'learning.json')
    quiz = load(DATA, 'quiz_cases.json')
    sim = load(DATA, 'simulation_cases.json')
    formulary = load(DATA, 'drug_formulary.json')
    ranges = load(DATA, 'lab_reference_ranges.json')
    audit = load(DATA, 'medical_audit.json')
    dose = load(DATA, 'dose_rules.json')
    relations = load(DATA, 'relations.json')
    library = load(DATA, 'library/books.json')

    paths = clinical['clinical_paths']
    labs = clinical['lab_tests']
    terms = clinical['examination_terms']
    infusions = clinical['infusion_lessons']
    topics = [t for s in learning['systems'] for t in s['topics']]
    cases = sim['cases']
    scenarios = (sim.get('catalogue') or {}).get('scenarios') or []
    drugs = formulary['items']
    range_items = ranges['items']

    # 1. 诊疗路径：全部有来源入口，且绝大多数字段完整
    missing_source = [p['id'] for p in paths if not p.get('sources')]
    check(not missing_source, f'诊疗路径缺少来源：{missing_source}')
    check(len(paths) >= 54, f'诊疗路径数量不足：{len(paths)}')
    check(all(p.get('medication') for p in paths), '存在缺少 medication 字段的诊疗路径')
    check(all(p.get('special') for p in paths), '存在缺少 special 字段的诊疗路径')

    # 2. 学习专题：数量与五段结构
    check(len(topics) >= 130, f'学习专题数量不足：{len(topics)}')
    keys = {'临床识别', '检查与鉴别', '处理与用药原则', '紧急警示', '常见误区'}
    bad_topics = [t['id'] for t in topics if set(t.get('content', {})) != keys]
    check(not bad_topics, f'专题内容键不完整：{bad_topics[:5]}')

    # 3. 化验总表与参考区间覆盖
    codes = {t['code'] for t in labs}
    range_codes = {r['code'] for r in range_items}
    check(codes == range_codes, f'参考区间 code 与词典不一致：多 {len(codes - range_codes)} / 缺 {len(range_codes - codes)}')
    full = [r for r in range_items if len(r.get('ranges') or []) == 5]
    check(len(full) >= 60, f'五档完整参考区间不足：{len(full)}')
    for r in range_items:
        for band in r.get('ranges') or []:
            check(float(band['low']) < float(band['high']), f'区间次序错误：{r["code"]} {band}')
            check(float(band['low']) >= 0 or r['code'] in ('BE', 'BASE_EXCESS'), f'区间下限为负但项目非碱剩余：{r["code"]}')
        check(r.get('verified') is False, f'{r["code"]} 不应标记为已验证')
    check(all(t.get('meaning') and t.get('caution') for t in labs), '存在缺释义或注意事项的化验条目')

    # 4. 模拟接诊：157 份病例 + 66 份补全脚本 + 36 主场景
    check(len(cases) >= 157, f'病例数量不足：{len(cases)}')
    check(all(c.get('course') for c in cases), f'{sum(1 for c in cases if not c.get("course"))} 份病例缺少复评脚本')
    case_ids = {c['id'] for c in cases}
    check(len(scenarios) == 36, f'主场景数量异常：{len(scenarios)}')
    bad_variants = [s['archetype_id'] for s in scenarios if len(s.get('variants') or []) != 4 or not set(s['variants']) <= case_ids]
    check(not bad_variants, f'主场景变体缺失或不在病例库：{bad_variants}')
    for c in cases:
        for field in ('history', 'examinations', 'tests', 'diagnoses', 'drugs', 'plans'):
            check(len(c.get(field) or []) >= 3, f'{c["id"]} 的 {field} 少于 3 项')

    # 5. 循证题库
    check(len(quiz['items']) >= 70, f'题库不足 70：{len(quiz["items"])}')
    for item in quiz['items']:
        check(len(item['choices']) == 4 and 0 <= item['correct'] < 4, f'题目结构错误：{item["id"]}')
        check(len(item['explanation']) >= 20, f'解析过短：{item["id"]}')
        check(bool(item.get('source_ids')), f'缺少来源：{item["id"]}')

    # 6. 离线药典
    required = {'id', 'generic_name', 'aliases', 'category', 'drug_class', 'forms', 'indications',
                'peds_notes', 'dose_note', 'max_single', 'renal_note', 'hepatic_note', 'cautions',
                'contraindications', 'adverse', 'monitoring', 'age_limit', 'interactions',
                'sources', 'review_status', 'tags'}
    check(len(drugs) >= 110, f'药典条目不足 110：{len(drugs)}')
    check(len({d['id'] for d in drugs}) == len(drugs), '药典 id 存在重复')
    bad_fields = [d['id'] for d in drugs if set(d) != required]
    check(not bad_fields, f'药典字段不齐：{bad_fields[:5]}')
    categories = {d['category'] for d in drugs}
    check(len(categories) >= 16, f'药典分类不足：{len(categories)}')
    check(all(d.get('peds_notes') and d.get('dose_note') for d in drugs), '药典存在空要点条目')

    # 7. V1.6 结构化升级：剂量规则与关联索引
    dose_items = dose.get('items') or []
    dose_ids = {x.get('drug_id') for x in dose_items}
    check(dose.get('policy', {}).get('not_a_prescription') is True, '剂量规则必须声明不是处方')
    check(len(dose_items) == len(drugs), f'剂量规则未覆盖全部药物：{len(dose_items)} vs {len(drugs)}')
    check(dose_ids == {d['id'] for d in drugs}, '剂量规则的 drug_id 与药典不一致')
    with_numbers = [x for x in dose_items if x.get('rules')]
    check(len(with_numbers) >= 60, f'可做体重演示的药物不足：{len(with_numbers)}')
    bad_rules = []
    for record in dose_items:
        check(record.get('verified') is False, f'{record.get("drug_id")} 剂量规则不应标记为已验证')
        for rule in record.get('rules') or []:
            if not (0 <= rule.get('low', -1) <= rule.get('high', -1)):
                bad_rules.append(record.get('drug_id'))
    check(not bad_rules, f'剂量区间次序错误：{bad_rules[:5]}')

    index = relations.get('index') or {}
    check(len(index) >= 150, f'关联索引实体不足：{len(index)}')
    links = sum(len(v) for v in index.values() if isinstance(v, list))
    check(links >= 300, f'关联条目不足：{links}')
    valid = {
        'drug': {d['id'] for d in drugs},
        'path': {p['id'] for p in paths},
        'lab': {l['code'] for l in labs},
        'exam': {e['id'] for e in terms},
        'topic': {t['id'] for t in topics},
        'quiz': {q['id'] for q in quiz['items']},
        'case': {c['id'] for c in cases},
    }
    broken = []
    for key, items_ in index.items():
        kind, ident = key.split(':', 1)
        if kind not in valid or ident not in valid[kind]:
            broken.append(key)
            continue
        for link in items_:
            if link.get('type') not in valid or link.get('id') not in valid[link['type']]:
                broken.append(f'{key}->{link.get("type")}:{link.get("id")}')
    check(not broken, f'关联索引指向不存在的实体：{broken[:5]}')

    # 8. V1.7 离线书库
    books = [b for b in (library.get('books') or []) if isinstance(b, dict)]
    check(len(books) >= 1, '书库没有任何书籍条目（至少应含 demo_quickref）')
    demo_ids = {b['id'] for b in books}
    check('demo_quickref' in demo_ids, '缺少自建示例书 demo_quickref')
    for book in books:
        path = DATA / 'library' / f"{book['id']}.json"
        check(path.exists(), f'缺少书库文本文件：{book["id"]}.json')
        if path.exists():
            payload = json.loads(path.read_text(encoding='utf-8'))
            check(len(payload.get('chunks') or []) == int(book.get('chunks') or 0),
                  f'{book["id"]} 的块数与 books.json 不一致')
    check((DATA / 'library' / 'raw').is_dir(), '缺少 data/library/raw 导入目录')

    # 9. 审校台账：路径与药典均已纳入逐条追踪
    kinds = {r['kind'] for r in audit['records']}
    check('诊疗路径' in kinds and '离线药典' in kinds, f'审校台账未覆盖新内容：{sorted(kinds)}')
    check(audit['signed_off_count'] == 0, '审校签审数必须为 0（尚未完成专家审核）')

    # 8. data/ 与 web/ 两份静态数据必须一致（PWA 与后端同源）
    for name in ('medical_audit', 'quiz_cases', 'learning', 'clinical_extension', 'source_registry',
                 'simulation_cases', 'drug_formulary', 'lab_reference_ranges', 'dose_rules', 'relations'):
        a, b = DATA / f'{name}.json', WEB / f'{name}.json'
        check(a.exists() and b.exists() and sha(a) == sha(b), f'{name}.json 在 data/ 与 web/ 不一致')

    rows = [
        ('诊疗路径（全部有来源入口）', f'{len(paths)} 条'),
        ('学习系统 / 专题', f'{len(learning["systems"])} 个系统 / {len(topics)} 个专题'),
        ('化验指标词典', f'{len(labs)} 项'),
        ('化验年龄分层参考区间', f'{len(range_items)} 项，其中 {len(full)} 项含完整五档'),
        ('检查报告术语', f'{len(terms)} 项 / {len(clinical["examination_modalities"])} 类检查'),
        ('静脉治疗安全专题', f'{len(infusions)} 项'),
        ('模拟接诊病例 / 主场景', f'{len(cases)} 份 / {len(scenarios)} 个'),
        ('循证练习题', f'{len(quiz["items"])} 道'),
        ('离线药典药物', f'{len(drugs)} 条 / {len(categories)} 类'),
        ('结构化教学剂量规则', f'{len(dose_items)} 条药物，{len(with_numbers)} 条可做体重演示'),
        ('跨模块关联', f'{len(index)} 个实体 / {links} 条链接'),
        ('离线书库', f'{len(books)} 本 / {sum(int(b.get("chunks") or 0) for b in books)} 块文本'),
        ('逐条审校台账', f'{audit["summary"]["total_claims"]} 条（专家签审 0）'),
    ]
    width = max(len(r[0]) for r in rows)
    print('儿科临床药典 V1.6 内容覆盖')
    print('-' * (width + 30))
    for label, value in rows:
        print(f'{label:<{width}}  {value}')
    if FAILS:
        print('\n未通过项：')
        for item in FAILS:
            print('  -', item)
        return 1
    print('\n全部检查通过：内容覆盖断言无缺口。临床使用前仍须完成医学专家逐条审核。')
    return 0


if __name__ == '__main__':
    sys.exit(main())

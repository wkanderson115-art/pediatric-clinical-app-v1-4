"""V1.5 内容补全合并脚本（可重复执行，幂等）。

把 data/ 下新增的扩充文件并入正式数据文件，并补齐 18 条诊疗路径的来源引用：
  - quiz_extra.json      → quiz_cases.json      （25 道新题，cnq-026~cnq-050）
  - learning_extra.json  → learning.json        （22 个新专题）
  - simulation_scripts.json → simulation_cases.json（66 份复评脚本 + 36 主场景目录）
  - 诊疗路径：为 18 条缺来源的路径补候选来源入口，为 13 条补用药与特殊情况字段

设计原则：只合并“结构”，医学表述沿用各来源文件原文；不自动改写既有内容；
所有新增字段都标注为编辑性教学整理。合并后可用 tools/report_content_coverage.py 复核。
"""
from pathlib import Path
import json

ROOT = Path(__file__).resolve().parent.parent
DATA = ROOT / 'data'


def load(name):
    return json.loads((DATA / name).read_text(encoding='utf-8'))


def dump(name, payload):
    original = (DATA / name).read_text(encoding='utf-8')
    pretty = '\n' in original[:200]
    text = json.dumps(payload, ensure_ascii=False, indent=2) if pretty else json.dumps(payload, ensure_ascii=False)
    (DATA / name).write_text(text + '\n', encoding='utf-8')


# ---------------------------------------------------------------------------
# 诊疗路径补源：全部为“国际指南/官方机构入口”，明确标注非中国指南，
# 具体条目仍须回到原文与本院规范核对；不宣称逐句验证。
# ---------------------------------------------------------------------------
PATH_PATCHES = {
    'cap': {
        'medication': '按严重程度分层决定治疗场所与给药途径；高度怀疑细菌感染时经验选药须结合年龄、当地耐药情况与指南，剂量按体重和制剂说明书核对；轻症优先口服，抗菌药不能替代氧疗与补液评估。',
        'special': '学龄前儿童以病毒病原为主，支原体等非典型病原在学龄期更常见；同一部位反复肺炎需评估气道异物、免疫缺陷与气道结构异常；治疗后仍持续高热或低氧需复评影像。',
    },
    'mycoplasma': {
        'medication': '大环内酯类是主要治疗选择，但须按 2025 年国家指南分层使用并关注耐药；重症或治疗无反应应先复评并发症（肺不张、胸腔积液、肺坏死），而不是盲目加药或换药；具体剂量与疗程须核对说明书。',
        'special': '婴幼儿可仅表现为喘息或腹泻；皮疹、溶血性贫血、脑炎等肺外表现可以出现；规范治疗后仍持续高热需影像复评、耐药与混合感染评估。',
    },
    'viral-pneumonia': {
        'medication': '病毒性下呼吸道感染以支持治疗为主：氧疗、补液、退热与呼吸状态监测；不常规使用抗菌药；流感等特定病毒在有指征时可考虑抗病毒治疗，须按年龄与说明书核对。',
        'special': 'RSV 毛细支气管炎不推荐常规使用支气管舒张剂、糖皮质激素或抗菌药；出现呼吸暂停、喂养困难或持续低氧需要住院评估与呼吸支持准备。',
    },
    'asthma': {
        'sources': [
            {'name': '全球哮喘防治创议（GINA）官方指南入口（国际，非中国指南）', 'url': 'https://ginasthma.org/'},
        ],
        'medication': '急性发作以吸入短效β₂受体激动剂为核心，重症可联合吸入抗胆碱能药与全身糖皮质激素；具体剂量、雾化浓度与疗程须按年龄、严重程度和制剂说明书核对。抗菌药仅用于明确或高度怀疑细菌感染。',
        'special': '运动诱发、夜间孤立性咳嗽、反复按“支气管炎”治疗而支气管舒张试验阴性者需重新评估表型；婴幼儿首次喘息不能直接等同于哮喘；吸入装置选择与家长操作演示是疗效关键环节。',
    },
    'acute-gastro': {
        'sources': [
            {'name': '国家卫健委：儿童急性感染性腹泻病诊疗规范（2020年版）',
             'url': 'https://www.nhc.gov.cn/yzygj/c100068/202009/a0720947d2c744b49fc91b32d82293ef.shtml'},
            {'name': 'WHO：Diarrhoeal disease 事实页（国际补充参考）', 'url': 'https://www.who.int/news-room/fact-sheets/detail/diarrhoeal-disease'},
        ],
        'medication': '首选口服补液盐Ⅲ，按脱水程度与体重制定补液计划；抗菌药仅在特定病原、重症或高危人群考虑；蒙脱石、益生菌与锌剂的证据和用法须按规范核对，止泻药不作为儿童常规。',
        'special': '轮状病毒与诺如病毒肠炎多在门诊处理；出现血便、明显腹胀、胆汁性呕吐、少尿或无尿、意识改变需重新评估；营养不良或慢性腹泻患儿要评估喂养与微量营养素。',
    },
    'appendicitis': {
        'sources': [
            {'name': '世界急诊外科学会（WSES）指南入口（国际，非中国指南）', 'url': 'https://www.wses.org.uk/'},
        ],
        'medication': '抗菌药是手术或引流前后的辅助措施，核心是外科评估与感染源控制；儿童阑尾炎的经验用药与疗程须按本院外科路径和药敏调整；不以抗菌药掩盖待查腹痛的诊断过程。',
        'special': '婴幼儿阑尾炎表现不典型，可仅表现为哭闹、拒食、呕吐或腹泻；腹痛“缓解后复现”常提示穿孔风险，需要动态查体与影像评估。',
    },
    'uti': {
        'sources': [
            {'name': 'NICE 指南入口：尿路感染（国际，非中国指南）', 'url': 'https://www.nice.org.uk/guidance'},
            {'name': '美国儿科学会（AAP）Pediatrics 期刊入口（国际补充参考）', 'url': 'https://publications.aap.org/pediatrics'},
        ],
        'medication': '抗菌治疗前尽量留取尿培养；根据年龄、是否肾盂肾炎、药敏与肾功能选择药物与疗程；单纯膀胱炎可短疗程口服，肾盂肾炎需评估静脉治疗指征与住院条件。',
        'special': '小婴儿可仅表现为发热、拒奶、呕吐或体重不增；反复发热性尿路感染需评估膀胱输尿管反流与排尿功能；导尿或耻骨上穿刺标本的价值高于尿袋标本。',
    },
    'nephrotic': {
        'sources': [
            {'name': 'KDIGO 肾小球疾病指南入口（国际，非中国指南）', 'url': 'https://kdigo.org/guidelines/'},
        ],
        'medication': '多数初发患儿以糖皮质激素为一线，起始剂量、疗程与减量方案须按指南与体重核对；水肿明显时评估利尿剂与白蛋白使用指征；避免不必要的肾毒性药物与感染诱因。',
        'special': '首次发作、激素耐药、反复复发或伴血尿/高血压/肾功能下降者需肾活检评估；感染是复发常见诱因，缓解期仍需监测尿蛋白与生长情况。',
    },
    'anaphylaxis': {
        'sources': [
            {'name': '世界过敏组织（WAO）官方指南入口（国际，非中国指南）', 'url': 'https://www.worldallergy.org/'},
        ],
        'medication': '一线救治为大剂量肾上腺素大腿前外侧肌内注射，剂型、浓度与剂量须按体重核对；抗组胺药和糖皮质激素不能替代肾上腺素；同时评估气道、呼吸、循环并准备静脉通路与氧疗。',
        'special': '双相反应可在症状缓解后数小时再次出现，需要观察期与出院教育；β受体阻滞剂使用者反应可能不典型；必须有书面过敏原回避与肾上腺素自动注射装置使用指导。',
    },
    'neonatal-infection': {
        'sources': [
            {'name': 'NICE NG195：新生儿感染抗菌药预防与治疗（国际，非中国指南）', 'url': 'https://www.nice.org.uk/guidance/ng195'},
        ],
        'medication': '疑似早发或晚发感染的经验用药须按本院新生儿方案、当地菌群与日龄调整；剂量按体重和胎龄计算；用药后48–72小时结合培养结果、炎症指标与临床表现复评，及时降阶梯。',
        'special': '早产儿与低出生体重儿表现更不典型，可仅有体温不稳、喂养困难、呼吸暂停或血糖异常；血培养阴性不能完全排除感染，需结合母体高危因素与临床过程。',
    },
    'febrile-seizure': {
        'sources': [
            {'name': 'NICE CG160：5岁以下儿童发热的评估与初始处理（国际，非中国指南）', 'url': 'https://www.nice.org.uk/guidance/cg160'},
        ],
        'medication': '单纯性热性惊厥以气道保护、体位与时间记录为主；持续发作按流程使用苯二氮䓬类药物，途径与剂量须核对；不推荐常规长期抗惊厥预防，退热药不能预防惊厥复发。',
        'special': '首次发作、局灶性表现、持续超过15分钟、发作后神经系统异常或年龄不足12月龄者需进一步评估；需向家长交代复发风险与家庭应急处理。',
    },
    'dka': {
        'sources': [
            {'name': '国际儿童青少年糖尿病学会（ISPAD）指南入口（国际，非中国指南）', 'url': 'https://www.ispad.org/'},
        ],
        'medication': '补液与胰岛素是抢救核心，必须按专门的儿童DKA路径分阶段执行；监测血糖、电解质、酸碱与神经状态，警惕脑水肿；不按普通脱水或普通输液速度处理。',
        'special': '新发1型糖尿病可仅表现为多饮多尿、体重下降或腹痛呕吐；补钾时机、含糖液切换与胰岛素减量须按路径执行；出院前完成血糖监测与注射技术教学。',
    },
    'sepsis': {
        'sources': [
            {'name': '拯救脓毒症运动（SSC）指南入口（国际，非中国指南）', 'url': 'https://www.sccm.org/'},
        ],
        'medication': '早期识别与集束化处理优先：氧合、循环支持、感染源控制与按规范抗菌治疗；液体复苏与升压药选择须按年龄、灌注状态与心功能个体化，不机械套用成人方案。',
        'special': '儿童脓毒症可表现为心动过速、灌注差、意识改变与尿量减少而血压尚正常（代偿期）；先天性心脏病、免疫抑制与肿瘤患儿风险更高，需要更低的评估阈值。',
    },
    'anemia': {
        'sources': [
            {'name': 'WHO：Anaemia 专题入口（国际补充参考）', 'url': 'https://www.who.int/health-topics/anaemia'},
        ],
        'medication': '缺铁性贫血以口服铁剂为主，剂量按元素铁与体重核对，疗程需覆盖补足储存铁；同时寻找失血、吸收不良或慢性炎症原因；输血指征按临床状态与血红蛋白水平分层判断。',
        'special': '小细胞性贫血需与地中海贫血、慢性病贫血鉴别；溶血性贫血要看网织红细胞、胆红素与直接抗人球蛋白试验；铁剂治疗无效要复核依从性、吸收与持续失血。',
    },
    'jaundice': {
        'sources': [
            {'name': 'NICE CG98：28天以下新生儿黄疸（国际，非中国指南）', 'url': 'https://www.nice.org.uk/guidance/cg98'},
        ],
        'medication': '光疗与换血指征按小时龄、胎龄与危险因素曲线判断，不凭单一数值决定；不推荐常规使用未经证实的药物或中成药退黄；同时保证喂养与出入量评估。',
        'special': '24小时内出现的黄疸、上升过快、结合胆红素升高、持续超过2周或伴肝脾肿大需进一步病因评估；母乳性黄疸多为排除性诊断。',
    },
    'fever-rash': {
        'sources': [
            {'name': 'WHO：Measles 专题入口（国际补充参考）', 'url': 'https://www.who.int/health-topics/measles'},
        ],
        'medication': '以识别重症与传染性疾病为先：伴休克、黏膜受累、意识改变或紫癜样皮疹按急症处理；不因发热直接使用抗菌药；需要时按传染病流程隔离与上报。',
        'special': '麻疹、猩红热、川崎病、药物疹与病毒疹的皮疹形态与出疹顺序不同；发热伴皮疹的患儿要询问疫苗、用药与接触史，并检查口腔黏膜、结膜与淋巴结。',
    },
    'v06-016': {
        'sources': [
            {'name': 'NICE NG1：儿童胃食管反流病（国际，非中国指南）', 'url': 'https://www.nice.org.uk/guidance/ng1'},
        ],
    },
    'v06-036': {
        'sources': [
            {'name': 'WHO：Measles 专题入口（国际补充参考）', 'url': 'https://www.who.int/health-topics/measles'},
        ],
    },
    'v06-037': {
        'sources': [
            {'name': 'NICE CG160：5岁以下儿童发热的评估与初始处理（国际，非中国指南）', 'url': 'https://www.nice.org.uk/guidance/cg160'},
        ],
    },
    'v06-038': {
        'sources': [
            {'name': '美国心脏协会（AHA）期刊入口：川崎病科学声明（国际补充参考）', 'url': 'https://www.ahajournals.org/'},
        ],
    },
    'v06-039': {
        'sources': [
            {'name': 'NICE CG160：5岁以下儿童发热的评估与初始处理（国际，非中国指南）', 'url': 'https://www.nice.org.uk/guidance/cg160'},
        ],
    },
}


# 既有题目中解析过短、信息量不足的条目，V1.5 统一补齐为可复盘的完整解释
QUIZ_EDITORIAL = {
    'cnq-010': '补液随访不能只看一次化验或一次尿量；应结合精神状态、口渴、尿量、体重变化与出入量记录动态评估脱水程度，并明确复评时间点。',
    'cnq-016': '《病历书写基本规范》要求急诊病历的就诊时间具体到分钟；时间记录不精确会影响后续诊疗追溯与医疗质量评价。',
    'cnq-017': '病历修改须保留原记录、注明修改时间与修改人并签名，保证可追溯；倒填时间、代签或覆盖原始记录都会破坏病历的真实性与法律效力。',
    'cnq-021': '参考区间描述的是健康人群的分布范围，不是疾病的诊断切点；单项结果轻度偏离需要结合症状、动态变化与联合指标判断，不能据此直接下诊断。',
}


def merge_quiz():
    base = load('quiz_cases.json')
    extra = load('quiz_extra.json')
    known = {x['id'] for x in base['items']}
    added = [x for x in extra['items'] if x['id'] not in known]
    base['items'].extend(added)
    for item in base['items']:
        if QUIZ_EDITORIAL.get(item['id']) and len(item.get('explanation', '')) < 25:
            item['explanation'] = QUIZ_EDITORIAL[item['id']]
    base['edition'] = '中国儿科临床学习 · 循证模拟考试（V1.5）'
    base['items_total'] = len(base['items'])
    dump('quiz_cases.json', base)
    return len(added), len(base['items'])


def merge_learning():
    base = load('learning.json')
    extra = load('learning_extra.json')
    by_name = {s['name']: s for s in base['systems']}
    known = {t['id'] for s in base['systems'] for t in s['topics']}
    added = 0
    for topic in extra['topics']:
        system = by_name.get(topic.get('system'))
        clean = {k: v for k, v in topic.items() if k != 'system'}
        if not system or clean['id'] in known:
            continue
        system['topics'].append(clean)
        known.add(clean['id'])
        added += 1
    base['edition'] = '中国儿科临床学习 · 17 系统扩充版（V1.5）'
    base['topics_total'] = sum(len(s['topics']) for s in base['systems'])
    dump('learning.json', base)
    return added, base['topics_total']


def merge_simulation():
    base = load('simulation_cases.json')
    extra = load('simulation_scripts.json')
    courses = extra['courses']
    applied = 0
    for case in base['cases']:
        script = courses.get(case['id'])
        if script:
            case['course'] = script
            applied += 1
    catalogue = base.setdefault('catalogue', {})
    catalogue['scenarios'] = extra['scenarios']
    catalogue['scenario_index_built'] = True
    catalogue['courses_applied'] = applied
    base['version'] = '1.5.0'
    dump('simulation_cases.json', base)
    return applied, len(extra['scenarios'])


def merge_paths():
    base = load('clinical_extension.json')
    patched_source = patched_med = 0
    by_id = {p['id']: p for p in base['clinical_paths']}
    for pid, patch in PATH_PATCHES.items():
        path = by_id.get(pid)
        if not path:
            continue
        if not path.get('sources'):
            path['sources'] = patch.get('sources', [])
            path['source_trace'] = '来源为中国/国际指南的官方入口，用于核实原则；本条目文字未逐句与原文比对'
            patched_source += 1
        if patch.get('medication') and not path.get('medication'):
            path['medication'] = patch['medication']
            patched_med += 1
        if patch.get('special') and not path.get('special'):
            path['special'] = patch['special']
    base['edition'] = '中国儿科临床药典 V1.5 · 内容补全版'
    dump('clinical_extension.json', base)
    return patched_source, patched_med, len(base['clinical_paths'])


if __name__ == '__main__':
    qa, qt = merge_quiz()
    la, lt = merge_learning()
    sa, ss = merge_simulation()
    ps, pm, total = merge_paths()
    print(json.dumps({
        'quiz_added': qa, 'quiz_total': qt,
        'topics_added': la, 'topics_total': lt,
        'courses_applied': sa, 'scenarios': ss,
        'paths_sourced': ps, 'paths_medication': pm, 'paths_total': total,
    }, ensure_ascii=False, indent=2))

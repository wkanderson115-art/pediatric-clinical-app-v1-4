"""医学教学内容的机器审计。仅检查证据追溯/结构，不能审定临床真伪。"""
from pathlib import Path
import csv, json, hashlib, re, collections

ROOT=Path(__file__).resolve().parent.parent
DATA=ROOT/'data'
OUT=ROOT/'data'/'medical_audit.json'
CSV=ROOT/'docs'/'医学逐条审核底稿.csv'
STATS=ROOT/'docs'/'自动审计发现.json'
SOURCE_REGISTRY=DATA/'source_registry.json'

def load(name):
    return json.loads((DATA/name).read_text(encoding='utf-8'))

def risk(kind,section,text):
    if kind=='诊疗路径' and section in ('management','infusion','redflags','reassessment'):return 'P0 临床高风险'
    if kind=='输液安全':return 'P0 临床高风险'
    if kind=='化验指标' and section in ('high','low','caution'):return 'P1 专科优先'
    if kind=='循证练习题' and any(x in text for x in ('剂量','输注','休克','抗菌药','治疗')):return 'P0 临床高风险'
    if any(x in text for x in ('mg/kg','mL/kg','禁忌','抢救','误诊','最大剂量','过敏性休克')):return 'P0 临床高风险'
    return 'P1 专科优先' if kind in ('诊疗路径','化验指标','检查术语','循证练习题') else 'P2 常规'

def responsible(kind,section):
    if kind=='输液安全' or (kind=='诊疗路径' and section in ('management','infusion')):return '儿科医生+临床药师'
    if kind=='化验指标':return '检验医师+儿科医生'
    if kind=='检查术语':return '相关检查专科医师+儿科医生'
    if kind=='循证练习题':return '儿科医生+医学教育审核人'
    return '儿科医生'

FIELDS={
 '诊疗路径':{'age_notes':'年龄适用','recognition':'临床识别','exams':'检查与诊断','differential':'鉴别诊断','management':'治疗原则','infusion':'输液注意','reassessment':'复评','redflags':'危险信号','notes':'补充说明'},
 '化验指标':{'meaning':'临床含义','high':'升高解释','low':'降低解释','caution':'注意事项','age_note':'年龄差异','follow_up':'联合解读'},
 '检查术语':{'meaning':'术语释义','contexts':'相关情境','pitfall':'常见误区','follow_up':'复核建议'},
 '输液安全':{'learning':'学习要点','check':'核对事项'},
 '循证练习题':{'stem':'题干','explanation':'答案解析','pitfall':'常见易错点'}
}

def create_records():
    clinical=load('clinical_extension.json');learning=load('learning.json');quiz=load('quiz_cases.json');sr=load('source_registry.json')
    lookup={s['id']:s for s in sr['sources']}
    records=[]
    def add(kind,itemid,title,category,section,field,text,sources):
        if not isinstance(text,str) or not text.strip():return
        key=f'{kind}|{itemid}|{section}'
        digest=hashlib.sha256(text.encode('utf-8')).hexdigest()
        urls=[]
        for s in sources or []:
            if isinstance(s,dict):
                url=s.get('url','');name=s.get('title') or s.get('name') or ''
            else:
                a=lookup.get(s,{});url=a.get('url','');name=a.get('title','')
            if isinstance(url,str) and url.startswith('https://'):
                if not any(x['url']==url for x in urls):urls.append({'name':name,'url':url})
        priority=risk(kind,field,text)
        records.append({
          'claim_id':'CLAIM-'+hashlib.sha256(key.encode('utf-8')).hexdigest()[:14].upper(),
          'kind':kind,'item_id':itemid,'title':title,'category':category,'section':section,
          'section_label':section,'original_text':text,'content_sha256':digest,
          'priority':priority,'sources':urls,
          'evidence_status':'有候选来源入口，尚未定位原文' if urls else '缺少独立来源入口',
          'medical_review_status':'未进行专家逐条审核',
          'reviewer_role':responsible(kind,field),
          'evidence_locator':'','evidence_quote':'','reviewer_name':'','review_date':'',
          'review_result':'待审核','review_notes':'','change_needed':'',
          'source_alignment':'未逐句核验（不能由链接自动推出医学正确性）'})
    for row in clinical['clinical_paths']:
        for field,name in FIELDS['诊疗路径'].items():
            if row.get(field):add('诊疗路径',row['id'],row['title'],row['category'],name,field,row[field],row.get('sources'))
    for system in learning['systems']:
        for topic in system['topics']:
            for field,text in topic['content'].items():add('基础专题',topic['id'],topic['title'],system['name'],field,field,text,topic.get('sources'))
    for row in clinical['lab_tests']:
        for field,name in FIELDS['化验指标'].items():
            if row.get(field):add('化验指标',row['code'],row['name'],row.get('category',''),name,field,row[field],row.get('sources'))
    for row in clinical['examination_terms']:
        for field,name in FIELDS['检查术语'].items():
            if row.get(field):add('检查术语',row['id'],row['term'],row['modality'],name,field,row[field],row.get('sources'))
    for row in clinical['infusion_lessons']:
        for field,name in FIELDS['输液安全'].items():
            if row.get(field):add('输液安全',row['id'],row['title'],'输液',name,field,row[field],row.get('sources'))
    for row in quiz['items']:
        for field,name in FIELDS['循证练习题'].items():
            if row.get(field):add('循证练习题',row['id'],row['title'],row['category'],name,field,row[field],row.get('source_ids'))
    return records

def main():
    records=create_records();kind=collections.Counter(x['kind'] for x in records)
    no_source=collections.Counter(x['kind'] for x in records if not x['sources'])
    high=collections.Counter(x['kind'] for x in records if x['priority'].startswith('P0'))
    audit={
      'version':'1.1.0','generated_at':'2026-10-29',
      'scope':'静态教学文本的条目级证据追溯与风险分级；非医学专家审核、不证明原文正确性',
      'signed_off_count':0,
      'metadata_verified_only':['2010年国家病历书写基本规范原文入口和主要时限','WS/T779和WS/T780发布与适用范围','国家卫健委2025年支原体肺炎指南发布','摩熵说明书API字段文档可访问'],
      'summary':{'total_claims':len(records),'claims_with_candidate_source':sum(bool(x['sources']) for x in records),
                 'claims_without_candidate_source':sum(not x['sources'] for x in records),
                 'counts_by_kind':dict(kind),'missing_source_by_kind':dict(no_source),'p0_by_kind':dict(high),
                 'ready_for_clinical_use':False},
      'records':records}
    OUT.write_text(json.dumps(audit,ensure_ascii=False,indent=1),encoding='utf-8')
    fields=['claim_id','kind','item_id','title','category','section','priority','evidence_status','original_text','source_urls','evidence_locator','evidence_quote','reviewer_role','review_result','reviewer_name','review_date','review_notes','change_needed','content_sha256']
    # 公式注入防护：表格打开时不把医学正文解释为公式。
    def safe(v):
        s=str(v if v is not None else '')
        return "'"+s if s.startswith(('=','+','-','@')) else s
    with CSV.open('w',encoding='utf-8-sig',newline='') as f:
        w=csv.DictWriter(f,fieldnames=fields);w.writeheader()
        for row in records:
            out={k:row.get(k,'') for k in fields};out['source_urls']=' ; '.join(s['url'] for s in row['sources'])
            w.writerow({k:safe(v) for k,v in out.items()})
    STATS.write_text(json.dumps(audit['summary'],ensure_ascii=False,indent=2),encoding='utf-8')
    print(json.dumps(audit['summary'],ensure_ascii=False))
if __name__=='__main__':main()

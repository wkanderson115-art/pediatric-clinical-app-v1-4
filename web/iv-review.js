'use strict';
/* Teaching checklist: no prescription, dose, drug interaction engine, or clearance claim. */
(()=>{
 const definitions=[
  ['indication','明确静脉给药指征：评估是否可以口服及疾病严重度'],
  ['formulation','核对药品通用名、具体剂型、厂家、规格和批准文号'],
  ['label','取得可核验的中国批准说明书或院内药学审核依据'],
  ['allergy','核实过敏史、既往严重药物反应和禁忌证'],
  ['weight','确认适龄的实际体重、胎龄/日龄（如适用）'],
  ['dose_type','区分 mg/kg/次 与 mg/kg/日，核对频次及给药途径'],
  ['maximum','核对单次与每日最大量，并评估治疗疗程'],
  ['renal','核查肾功能、肝功能及必要的药物治疗监测'],
  ['dilution','核查复溶溶媒、稀释浓度、稳定性及储存要求'],
  ['compatibility','核对配伍、含钙制剂/其他联用药风险及静脉通路'],
  ['infusion','核实说明书输注方式/时间、滴速或泵速、渗漏风险'],
  ['monitoring','明确治疗反应监测、过敏/输液反应及复评节点'],
  ['doublecheck','高警示药或特殊患儿按医院制度完成独立双人核查']
 ];
 const root=document.getElementById('iv-check-items'),result=document.getElementById('iv-review-output');
 definitions.forEach(([id,text])=>{const label=document.createElement('label');label.className='iv-review-check';const input=document.createElement('input');input.type='checkbox';input.value=id;input.name='iv-check';label.append(input,document.createTextNode(text));root.append(label)});
 document.getElementById('iv-review-form').addEventListener('submit',e=>{
  e.preventDefault();result.replaceChildren();const text=(s,cls)=>{const p=document.createElement('p');p.textContent=s;p.className=cls||'';result.append(p)};
  const age=document.getElementById('iv-age-group').value;
  const name=document.getElementById('iv-drug-name').value.trim();
  const completed=new Set([...root.querySelectorAll('input:checked')].map(x=>x.value));
  const missing=definitions.filter(([id])=>!completed.has(id)).map(x=>x[1]);
  if(!age)missing.unshift('明确患儿年龄分组及具体年龄（新生儿需核对胎龄和日龄）');
  text('学习情境：'+(name||'药品名称未填写')+' · 已自述完成'+completed.size+'/'+definitions.length+'项核对。');
  text('仍需核对 '+missing.length+' 项；即使全部勾选，也不能证明医嘱合格。');
  missing.forEach((m,i)=>text(`${i+1}. ${m}`,'review-caution'));
  if(!missing.length)text('清单自述完成，但软件未核实药品剂量、相容性、说明书真实性或实际患儿状态。应由临床医师及药师独立审核。','review-caution');
  if(age==='newborn')text('⚠ 新生儿必须使用胎龄、出生后日龄和病情对应的专用规范；不可套用普通儿童方案。','review-caution');
 });
})();

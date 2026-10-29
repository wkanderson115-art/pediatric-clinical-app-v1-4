'use strict';
/* 说明书/指南学习辅助：非诊断或自动医嘱系统；所有用户报告文本均在设备端分析，不传服务器。 */
let clinicalData=null;
const cl=id=>document.getElementById(id);
const clEl=(tag,cls,txt)=>{const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e};
function clText(root,tag,txt,cls){const e=clEl(tag,cls,txt);root.append(e);return e}
function clDetails(title,subtitle){const d=clEl('details','clinical-item'),s=clEl('summary');s.append(clEl('b','',title),clEl('span','',subtitle));d.append(s);return d}
function clSources(container,links){(links||[]).forEach(a=>{if(!/^https:\/\/[\w.-]+(?:\/|$)/.test(a.url||''))return;const link=clEl('a','',a.name+' ↗');link.href=a.url;link.target='_blank';link.rel='noopener noreferrer';container.append(link)})}
function drawClinical(){const root=cl('clinic-list');root.replaceChildren();if(!clinicalData)return;const q=cl('clinic-search').value.trim().toLowerCase(), group=cl('clinic-category').value;let count=0;
 clinicalData.clinical_paths.filter(x=>(group==='all'||group===x.category)&&(!q||[x.title,x.category,x.recognition,x.exams,x.management,x.medication||'',x.special||''].join(' ').toLowerCase().includes(q))).forEach(t=>{count++;const d=clDetails(t.title,t.category),body=clEl('div','clinical-body');
 [['适用年龄与人群',t.age_notes],['识别与临床表现',t.recognition],['检查和诊断评估',t.exams],['鉴别诊断',t.differential],['治疗与诊治原则',t.management],['用药指南与核对重点',t.medication],['输液/注射药核对',t.infusion],['其他情况与非典型表现',t.special],['疗效复评与随访',t.reassessment],['危险信号',t.redflags]].forEach(([k,v])=>{if(v){clText(body,'h4',k);clText(body,'p',v)}});
 clText(body,'p',t.review_status,'review-caution');clSources(body,t.sources);const ask=clEl('button','outline-button','遇到其他情况？提问并记录');ask.type='button';ask.addEventListener('click',()=>{setPage('ask');cl('ask-question').value='我正在学习【'+t.title+'】。遇到了以下非常规问题（请使用匿名/虚构信息）：\n';cl('ask-question').focus();});body.append(ask);d.append(body);root.append(d)});cl('clinic-filter-count').textContent='匹配 '+count+' 条诊疗路径';
 if(!count)clText(root,'p','未找到匹配的诊疗路径。','empty')
}
function fillCategory(sel,items,placeholder){sel.replaceChildren();const all=clEl('option','',placeholder);all.value='all';sel.append(all);items.forEach(name=>{const o=clEl('option','',name);o.value=name;sel.append(o)})}
function labByCode(code){const term=String(code||'').trim().toLowerCase();return clinicalData.lab_tests.find(x=>x.code.toLowerCase()===term||x.name.toLowerCase()===term)}
function drawLabs(){
 const sel=cl('lab-test');sel.replaceChildren();clinicalData.lab_tests.forEach(x=>{const opt=clEl('option','',`${x.name}（${x.code}）`);opt.value=x.code;sel.append(opt)});
 fillCategory(cl('lab-category'),clinicalData.lab_categories,'全部检验类别');renderLabCards();
 cl('lab-count').textContent=clinicalData.lab_tests.length+'项检验指标 · '+clinicalData.lab_categories.length+'类';
}
function labSearchText(t){return [t.code,t.name,t.category,t.meaning,t.high,t.low,t.caution].join(' ').toLowerCase()}
function renderLabCards(){const root=cl('lab-list');root.replaceChildren();if(!clinicalData)return;
 const q=cl('lab-search').value.trim().toLowerCase();const group=cl('lab-category').value;
 const matches=clinicalData.lab_tests.filter(x=>(group==='all'||x.category===group)&&(!q||labSearchText(x).includes(q)));
 cl('lab-filter-count').textContent=`显示${matches.length}项`;
 for(const t of matches){const d=clDetails(t.name,`${t.code} · ${t.category}`),b=clEl('div','clinical-body');
 [['常见用途',t.meaning],['升高/阳性可能涉及',t.high],['降低/阴性可能涉及',t.low],['儿童年龄与方法差异',t.age_note],['容易误判的地方',t.caution],['建议联合核查',t.follow_up]].forEach(([key,value])=>{clText(b,'h4',key);clText(b,'p',value)});
 clText(b,'p','单位示例：'+t.unit+'。仅供辨识，不保证与手中报告单位一致。必须使用报告原单位和其对应参考区间。','review-caution');
 if(t.sources?.length){clText(b,'h4','规范来源（需核实具体项目是否在标准范围内）');clSources(b,t.sources)}
 const btn=clEl('button','outline-button','把本项填入单项分析');btn.type='button';btn.addEventListener('click',()=>{cl('lab-test').value=t.code;cl('lab-value').focus();cl('lab-output').textContent='已选择 '+t.name+'。需输入来自同一份报告的数值、单位与该报告对应的参考上下限。';});b.append(btn);d.append(b);root.append(d)}
 if(!matches.length)clText(root,'p','没有匹配的检验指标，可以通过“疑难问答”检索或添加学习笔记。','empty');
}
function safeNum(str){return String(str).trim()!==''&&Number.isFinite(Number(str))?Number(str):null}
function labAgeWarnings(age,t){const lines=[];if(age===null||age<0||age>216){lines.push('⚠ 未提供有效年龄（月龄0–216），无法判断报告参考区间是否适合患儿。');return lines}
 if(age===0)lines.push('⚠ 月龄0不足以区分出生后小时龄和胎龄；新生儿须采用相应日龄/胎龄参考标准。');
 if(age<1)lines.push('⚠ 新生儿0–28天不能套用WS/T 779、780的儿童参考区间。');
 if(['TSB_NEONATE','NEO_GLU','DBS_TSH','DBS_PHE'].includes(t.code))lines.push('⚠ 此为新生儿专科指标，必须按小时龄/日龄、胎龄、危险因素以及筛查方法核查。');
 return lines}
function interpretLab(t,value,min,max,age,reportUnit,qualitativeResult=''){const lines=[`${t.name}（${t.code}）`];
 if(t.interpretation_type!=='qualitative' && reportUnit!==t.unit)lines.push(`⚠ 当前输入单位“${reportUnit}”与词典示例单位“${t.unit}”不一致；不执行数值比较。`);
 if(t.interpretation_type==='qualitative'){const q=String(qualitativeResult||'').trim();lines.push(q ? '报告原文：'+q+'。本项为定性/滴度类型，仅解释项目含义，不根据“阳性/阴性/检出/未检出”作诊断，也不比较高低。' : '本项为定性/滴度类型，请输入原报告结果文本，不应使用数字上下限判断。');}
 else if(value===null||min===null||max===null)lines.push('未完整提供检验值及同一张报告的上下限，无法进行高低比较。');
 else if(min>=max)lines.push('参考范围错误：上限必须大于下限。');
 else if(reportUnit===t.unit){const status=value<min?'低于该报告参考下限':value>max?'高于该报告参考上限':'位于该报告参考区间内';lines.push(`数学比较：${value} ${reportUnit} → ${status}（输入的参考区间 ${min}–${max}）。`);lines.push(value<min?'偏低相关学习点：'+t.low:value>max?'偏高相关学习点：'+t.high:'位于参考范围内仍不能排除疾病，尤其在感染早期或动态变化阶段。')}
 lines.push(...labAgeWarnings(age,t));lines.push('容易误判：'+t.caution);lines.push('需要复核：'+t.follow_up);lines.push('这只是基于输入参考范围的数学比较和医学知识解释，不是危急值报警、诊断或治疗建议。');return lines.join('\n')}
function evaluateLab(){if(!clinicalData)return;const t=labByCode(cl('lab-test').value),out=cl('lab-output');if(!t){out.textContent='未找到检验指标';return}
 const unit=cl('lab-unit').value.trim(),expected=t.unit;
 out.textContent=interpretLab(t,t.interpretation_type==='qualitative'?cl('lab-value').value.trim():safeNum(cl('lab-value').value),safeNum(cl('lab-low').value),safeNum(cl('lab-high').value),safeNum(cl('lab-age').value),unit||'未填单位',cl('lab-qualitative').value);
}
function onLabSelect(){const t=labByCode(cl('lab-test').value);if(t){cl('lab-unit').value=t.unit;cl('lab-qualitative-wrap').classList.toggle('hidden',t.interpretation_type!=='qualitative');cl('lab-value').parentElement.classList.toggle('hidden',t.interpretation_type==='qualitative');cl('lab-qualitative').value='';cl('lab-low').value='';cl('lab-high').value='';cl('lab-value').value='';cl('lab-output').textContent=t.interpretation_type==='qualitative'?'这是定性指标。请查看下方解释，不进行数值高低比较。':'已切换指标；请按原报告重新输入参考限，不能沿用上一项。'}}
// 只支持明确列格式，禁止猜测图片内的值，避免将单位、上限和结果错误对应。
function parseLabRows(text){const rows=[],errors=[],lines=String(text||'').split(/\r?\n/);if(lines.length>81)return {rows,errors:['最多80行，请分批分析。']};
 lines.forEach((l,idx)=>{if(!l.trim())return;let fields=l.split(/[\t|，]/).map(s=>s.trim());if(fields.length!==5){errors.push(`第${idx+1}行：请按 项目|数值|单位|参考下限|参考上限 输入，缺失上下限可用 -`);return}
 const t=labByCode(fields[0]);if(!t){errors.push(`第${idx+1}行：未知项目“${fields[0].slice(0,25)}”，请用词典中的项目名或代码。`);return}
 const [name,val,unit,low,high]=fields;const v=t.interpretation_type==='qualitative'?null:safeNum(val),mn=low==='-'?null:safeNum(low),mx=high==='-'?null:safeNum(high);
 if((t.interpretation_type==='qualitative'?!val.trim():v===null)||(!['-', ''].includes(low)&&mn===null)||(!['-',''].includes(high)&&mx===null)){errors.push(`第${idx+1}行：数值、定性结果或参考限无法解析。`);return}
 rows.push({t,value:v,qualitativeResult:t.interpretation_type==='qualitative'?val:'',unit,min:mn,max:mx});});return {rows,errors}}
function analyzeReport(){const box=cl('lab-report-output'),text=cl('lab-rows').value.trim();box.replaceChildren();if(!text){box.textContent='请粘贴按照指定格式整理的匿名报告数值。';return}
 const {rows,errors}=parseLabRows(text),age=safeNum(cl('lab-age').value);
 const header=clEl('p','',`识别${rows.length}行；未解析${errors.length}行。所有输入只在当前设备处理，不发送到服务器。`);box.append(header);
 for(const row of rows){const art=clEl('article','report-result'),title=clEl('strong','',`${row.t.name} · ${row.qualitativeResult||row.value} ${row.unit}`),detail=clEl('p','',interpretLab(row.t,row.value,row.min,row.max,age,row.unit,row.qualitativeResult));art.append(title,detail);box.append(art)}
 errors.forEach(e=>clText(box,'p',e,'review-caution'));
 if(!rows.length)clText(box,'p','没有可分析条目。可先点击“载入示例”学习输入格式。')
}
function drawExams(){fillCategory(cl('exam-modality'),clinicalData.examination_modalities,'全部检查类别');renderExams();cl('exam-count').textContent=clinicalData.examination_terms.length+'个报告术语'}
function renderExams(){if(!clinicalData)return;const root=cl('exam-list'),q=cl('exam-search').value.trim().toLowerCase(),cat=cl('exam-modality').value;root.replaceChildren();const filtered=clinicalData.examination_terms.filter(x=>(cat==='all'||x.modality===cat)&&(!q||[x.term,x.modality,x.meaning,x.contexts,x.pitfall].join(' ').toLowerCase().includes(q)));
 cl('exam-filter-count').textContent=`匹配${filtered.length}个术语`;
 for(const x of filtered){const d=clDetails(x.term,x.modality),b=clEl('div','clinical-body');[['报告术语的含义',x.meaning],['常见相关情况',x.contexts],['不能据此直接得出的结论',x.pitfall],['应该进一步核对',x.follow_up]].forEach(([k,v])=>{clText(b,'h4',k);clText(b,'p',v)});clText(b,'p','教学术语解释，未经专家逐条审核；不能替代放射科/超声科/专科医师的正式检查结论。','review-caution');d.append(b);root.append(d)}
 if(!filtered.length)clText(root,'p','词典没有对应的检查术语。可以在疑难问答功能中记录这个问题。','empty')}
function examMatches(report){const raw=String(report||'').trim();if(!raw)return [];const terms=clinicalData.examination_terms.filter(x=>raw.toLowerCase().includes(x.term.toLowerCase()));return terms.slice(0,25)}
function analyzeExamReport(){const text=cl('exam-text').value.trim(),box=cl('exam-output');box.replaceChildren();if(!text){box.textContent='请输入去标识化的检查报告“所见”或“结论”文本。';return}if(text.length>5000){box.textContent='最多5000字，请删去无关内容并去除患者身份信息。';return}
 const found=examMatches(text);clText(box,'p',`在本地词典中匹配到${found.length}条术语。未匹配的文字不会被AI擅自解释；不会自动识别图片，也不会发送到服务器。`);
 found.forEach(x=>{const d=clDetails(x.term,x.modality),b=clEl('div','clinical-body');clText(b,'h4','术语说明');clText(b,'p',x.meaning);clText(b,'h4','注意事项');clText(b,'p',x.pitfall);clText(b,'h4','学习时核对');clText(b,'p',x.follow_up);d.append(b);box.append(d)});
 if(!found.length)clText(box,'p','没有命中词典，建议手动选择对应检查类型搜索。此功能不等于自动阅片。')}
function drawInfusions(){const root=cl('infusion-list');root.replaceChildren();clinicalData.infusion_lessons.forEach((v,i)=>{const d=clDetails(`${i+1}. ${v.title}`,'点击查看'),b=clEl('div','clinical-body');clText(b,'h4','操作与学习目标');clText(b,'p',v.learning);clText(b,'h4','执行核对要点');clText(b,'p',v.check);clSources(b,v.sources);d.append(b);root.append(d)})}
function evalIv(){const vstr=cl('iv-volume').value.trim(),hstr=cl('iv-hours').value.trim(),out=cl('iv-output');const v=Number(vstr),h=Number(hstr);if(!vstr||!hstr||!Number.isFinite(v)||!Number.isFinite(h)||v<=0||h<=0||v>100000||h>1000){out.textContent='请填写大于零且有效的体积(mL)和时间(小时)。';return}
 out.textContent=`数学换算结果：${Number((v/h).toFixed(3)).toLocaleString('zh-CN')} mL/h。\n请核对医嘱、药液浓度、制剂说明书、输液泵、年龄与循环状态；此工具不能证明输液方案安全。`}
async function loadClinical(){try{const r=await fetch('/clinical_extension.json',{cache:'no-store'});if(!r.ok)throw Error('static');clinicalData=await r.json()}catch{cl('clinic-list').textContent='学习拓展库加载失败。';return}
 if(!Array.isArray(clinicalData.clinical_paths)||!Array.isArray(clinicalData.lab_tests)||!Array.isArray(clinicalData.infusion_lessons)||!Array.isArray(clinicalData.examination_terms))return;
 fillCategory(cl('clinic-category'),[...new Set(clinicalData.clinical_paths.map(x=>x.category))].sort(),'全部系统');drawClinical();drawLabs();drawExams();drawInfusions();
 cl('lab-test').value='WBC';onLabSelect();cl('lab-age').value='';
}
cl('clinic-search').addEventListener('input',drawClinical);cl('clinic-category').addEventListener('change',drawClinical);
cl('lab-category').addEventListener('change',renderLabCards);
cl('lab-search').addEventListener('input',renderLabCards);
cl('lab-test').addEventListener('change',onLabSelect);
cl('lab-eval').addEventListener('click',evaluateLab);
cl('lab-batch').addEventListener('click',analyzeReport);
cl('lab-example').addEventListener('click',()=>{cl('lab-rows').value='WBC | 12.0 | ×10⁹/L | 4.0 | 10.0\nCRP | 15 | mg/L | 0 | 10\nMP_PCR | 未检出 | 定性 | - | -';cl('lab-rows').focus()});
cl('exam-search').addEventListener('input',renderExams);
cl('exam-modality').addEventListener('change',renderExams);
cl('exam-analyze').addEventListener('click',analyzeExamReport);
cl('exam-example').addEventListener('click',()=>{cl('exam-text').value='胸部X线：双肺见斑片状阴影，局部可见肺实变及支气管充气征，未见明显胸腔积液。';cl('exam-text').focus()});
cl('iv-calc').addEventListener('click',evalIv);
loadClinical();

'use strict';
/* V1.3: offline scripted pediatric virtual-patient trainer.
 * All cases are fictional and NOT medically validated for real clinical decisions.
 * No AI requests and no patient identifiers. All user-entered text stays on-device.
 */
(()=>{
const $=id=>document.getElementById(id);
const K='paeds-cn-simulation-v12-history'; // Preserve V1.2 learning records
const LAST='paeds-cn-simulation-v12-last';
const RECENT='paeds-cn-simulation-v13-recent-archetypes';
let library=null, caseData=null, s=null;
const el=(name,txt,cls)=>{const e=document.createElement(name);if(txt!==undefined)e.textContent=String(txt);if(cls)e.className=cls;return e};
const fmt=n=>Number.isFinite(n)?String(n):'0';
function saveHistory(record){try{let arr=JSON.parse(localStorage.getItem(K)||'[]');if(!Array.isArray(arr))arr=[];arr.unshift(record);localStorage.setItem(K,JSON.stringify(arr.slice(0,50)))}catch(e){alert('设备未允许保存记录，可通过导出本次报告保存。')}}
function history(){try{const o=JSON.parse(localStorage.getItem(K)||'[]');return Array.isArray(o)?o:[]}catch{return []}}
function exportJSON(obj,name){const file=new Blob([JSON.stringify(obj,null,2)],{type:'application/json'});const url=URL.createObjectURL(file);const a=el('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000)}
function safeCaseIndex(){
 const category=$('sim-filter').value||'全部',difficulty=$('sim-difficulty').value||'全部';
 let pool=library.cases.filter(c=>(category==='全部'||c.system===category)&&(difficulty==='全部'||(c.difficulty||'常规')===difficulty));
 if(!pool.length){alert('当前类别与难度组合没有病例，请修改筛选条件。');return null;}
 let recent=[];try{recent=JSON.parse(localStorage.getItem(RECENT)||'[]')}catch{}
 if(!Array.isArray(recent))recent=[];
 const alternative=pool.filter(c=>!recent.includes(c.archetype_id||c.id));
 if(alternative.length)pool=alternative;
 const pick=pool[Math.floor(Math.random()*pool.length)];
 recent.unshift(pick.archetype_id||pick.id);
 try{localStorage.setItem(RECENT,JSON.stringify(recent.slice(0,5)));localStorage.setItem(LAST,pick.id)}catch{}
 return pick;
}
function clock(min){return '模拟接诊 +'+min+'分钟'}
function render(){if(!s||!caseData)return;
 $('sim-start-panel').hidden=true;$('sim-play').hidden=false;$('sim-feedback').hidden=true;
 $('sim-case-label').textContent=caseData.setting+' · '+caseData.system+' · '+(caseData.difficulty||'常规')+' · 虚构教学病例';
 renderAdmission();
 $('sim-case-title').textContent=caseData.age<1?'婴儿病例 · '+caseData.chief:caseData.age+'岁患儿 · '+caseData.chief;
 $('sim-case-intro').textContent=`${caseData.sex} · ${caseData.weight_kg}kg · ${caseData.opening}`;
 $('sim-vitals').textContent=caseData.vitals;
 $('sim-time').textContent=clock(s.minutes);
 $('sim-transcript').replaceChildren();s.log.forEach(l=>{const d=el('div',undefined,'sim-line');d.append(el('small',l.who+' · '+clock(l.time)),el('p',l.text));$('sim-transcript').append(d)});
 renderActions('history','sim-history-questions',s.asked,ask);renderActions('examinations','sim-exam',s.examined,examine);renderActions('tests','sim-tests',s.ordered,orderTest);
 renderChoices('diagnoses','sim-diagnosis','radio','sim-dx',s.diagnosis,(name)=>{s.diagnosis=name});
 renderChoices('drugs','sim-drugs','checkbox','sim-drug',s.drugs,(name,on)=>{on?s.drugs.add(name):s.drugs.delete(name)});
 renderChoices('plans','sim-plans','checkbox','sim-plan',s.plans,(name,on)=>{on?s.plans.add(name):s.plans.delete(name);if(on&&caseData.urgent&&name===caseData.expected.plan[0]&&s.firstIntervention==null){s.firstIntervention=s.minutes;}});
 $('sim-reassess').disabled=s.reviewed;
 $('sim-reassess').textContent=s.reviewed?'已进行模拟复评':'推进时间并复评病情（+10分钟）';
 $('sim-free-question').value='';
}
function renderAdmission(){
 const panel=$('sim-admission-panel'), checkPanel=$('sim-iv-panel');
 if(!panel||!checkPanel)return;
 const isWard=!!caseData.admission;
 panel.hidden=!isWard;checkPanel.hidden=!isWard;
 if(!isWard)return;
 const root=$('sim-admission-record');root.replaceChildren();
 const values=[['入院情况',caseData.admission.admission_note],['首次/日常病程',caseData.admission.progress_note],['护理记录',caseData.admission.nursing_note],['液体出入量',caseData.admission.intake_output],['检验信息（学习材料）',caseData.admission.laboratory],['待审核静脉医嘱',caseData.admission.orders]];
 values.forEach(([h,t])=>{const d=el('section',undefined,'sim-chart-section');d.append(el('strong',h),el('p',t));root.append(d)});
 if(caseData.admission.lab_values){
   const section=el('section',undefined,'sim-chart-section');section.append(el('strong','教学化验数据（虚构）'));
   const table=el('table',undefined,'sim-lab-table');const tb=el('tbody');
   caseData.admission.lab_values.forEach(x=>{const tr=el('tr');tr.append(el('td',x.name),el('td',x.value+' '+x.unit));tb.append(tr)});
   table.append(tb);section.append(table,el('small',caseData.admission.lab_caveat));root.append(section);
 }
 if(caseData.admission.daily_observations){
   const section=el('section',undefined,'sim-chart-section');section.append(el('strong','住院病程时间轴（脚本）'));
   caseData.admission.daily_observations.forEach(x=>section.append(el('p',x.time+'：'+x.event)));
   root.append(section);
 }
 const ck=$('sim-iv-checks');ck.replaceChildren();
 caseData.admission.iv_safety.forEach((label,i)=>{const r=el('label',undefined,'sim-choice');const inp=el('input');inp.type='checkbox';inp.checked=s.ivChecked.has(i);inp.addEventListener('change',()=>{inp.checked?s.ivChecked.add(i):s.ivChecked.delete(i)});r.append(inp,el('span',label));ck.append(r)});
 const rootOrder=$('sim-order-review');rootOrder.replaceChildren();
 (caseData.admission.order_review||[]).forEach((o,i)=>{
  const article=el('div',undefined,'sim-order-card');article.append(el('strong','医嘱审核 '+(i+1)),el('p',o.text));
  const row=el('div',undefined,'sim-order-actions');
  ['通过','退回'].forEach(v=>{
   const b=el('button',v,'sim-order-decision'+(s.orderReviews[o.id]===v?' selected':''));b.type='button';b.setAttribute('aria-pressed',s.orderReviews[o.id]===v?'true':'false');
   b.addEventListener('click',()=>{s.orderReviews[o.id]=v;renderAdmission()});row.append(b)
  });article.append(row);rootOrder.append(article);
 });
}
function renderActions(field,rootId,selected,handler){const root=$(rootId);root.replaceChildren();caseData[field].forEach(x=>{
 const b=el('button',(selected.has(x.id)?'✓ ':'＋ ')+x.label,'sim-option'+(selected.has(x.id)?' sim-done':''));b.type='button';b.disabled=selected.has(x.id);b.addEventListener('click',()=>handler(x));root.append(b)})}
function renderChoices(field,rootId,type,name,value,callback){const root=$(rootId);root.replaceChildren();caseData[field].forEach((t,i)=>{
 const label=el('label',undefined,'sim-choice');const input=el('input');input.type=type;input.name=name;input.value=t;if(type==='radio')input.checked=value===t;else input.checked=value.has(t);input.addEventListener('change',()=>{callback(t,input.checked);if(type==='radio')renderChoices(field,rootId,type,name,s.diagnosis,callback)});
 label.append(input,el('span',t));root.append(label)
})}
function log(who,text){s.log.push({who,text,time:s.minutes});}
function tick(n){s.minutes+=n;$('sim-time').textContent=clock(s.minutes)}
function ask(item){s.asked.add(item.id);tick(2);log('你的问诊',item.label);log('家属/患儿',item.reply);render()}
function examine(item){s.examined.add(item.id);tick(4);log('体格检查',item.label);log('检查结果',item.result);render()}
function orderTest(item){s.ordered.add(item.id);tick(item.duration_min);log('开具检查',item.label);log('检查回报',item.result);render()}
function start(){caseData=safeCaseIndex();if(!caseData)return;s={asked:new Set(),examined:new Set(),ordered:new Set(),drugs:new Set(),plans:new Set(),diagnosis:'',ivChecked:new Set(),orderReviews:{},minutes:0,log:[],reviewed:false,firstIntervention:null,started:new Date().toISOString()};log('接诊台','虚构病例已就诊。请根据分诊、问诊和检查信息做判断；标准诊断及评分点在交卷前保持隐藏。');render()}
function questionByInput(value){const q=value.trim().slice(0,120);if(!q)return;const compact=q.toLowerCase().replace(/\s+/g,'');let match=caseData.history.find(x=>compact.includes(x.label.replace('询问','').slice(0,2).toLowerCase())||x.label.includes(compact));
 if(!match){const synonyms={尿量:['尿','尿量','小便'],breath:['呼吸','喘','气促'],duration:['多久','发热','起病','病程'],feed:['吃','饮','奶','喝'],allergy:['过敏','药'],trigger:['诱因','吃过','食物'],pattern:['腹痛','哭闹'],vomit:['吐','呕吐'],loc:['昏迷','意识','晕'],recovery:['清醒','恢复'],airway:['气道','声音','喉']};
  match=caseData.history.find(x=>(synonyms[x.id]||[]).some(t=>compact.includes(t)))
 }
 if(match&&!s.asked.has(match.id))ask(match);else {tick(2);log('你的问诊',q);log('家属/患儿','这个问题暂时无法从固定病例事实中回答。请选择上方问诊项目，或换种问法；系统不会编造新病史。');render()}
}
function reassess(){if(s.reviewed)return;s.reviewed=true;tick(10);const c=caseData.course;
 const early=s.firstIntervention!==null&&(!c?.trigger_min||s.firstIntervention<=c.trigger_min);
 let msg=c?.trigger_min?(early?c.with:c.without):'模拟复评：本题没有基于真实生理参数的病情预测。需要结合已检查的生命体征、治疗反应和复评计划。';
 log('护士复评 · 脚本预设结果',msg);render()}
function mark(){const e=caseData.expected;const score=(set,ids,total)=>ids?.length?Math.round(ids.filter(x=>set.has(x)).length/ids.length*total):total;
 let points=caseData.admission?
  {diagnosis:s.diagnosis===e.diagnosis?22:0,history:score(s.asked,e.history,14),examinations:score(s.examined,e.exams,10),tests:score(s.ordered,e.tests,10),drugs:score(s.drugs,e.drug,12),plans:score(s.plans,e.plan,8),safety:6,ivReview:0,orderReview:0}:
  {diagnosis:s.diagnosis===e.diagnosis?24:0,history:score(s.asked,e.history,16),examinations:score(s.examined,e.exams,12),tests:score(s.ordered,e.tests,12),drugs:score(s.drugs,e.drug,14),plans:score(s.plans,e.plan,16),safety:6};
 if(caseData.admission){
  points.ivReview=Math.round(s.ivChecked.size/caseData.admission.iv_safety.length*6);
  const orders=caseData.admission.order_review||[];
  points.orderReview=orders.length?Math.round(orders.filter(o=>s.orderReviews[o.id]===o.correct).length/orders.length*12):0;
 }
 let harmful=[...s.drugs,...s.plans].filter(x=>(e.harmful||[]).includes(x));
 if(caseData.urgent){points.safety=s.firstIntervention!==null&&s.firstIntervention<=(caseData.course?.trigger_min??20)?6:0;}
 const unneeded=caseData.tests.filter(x=>s.ordered.has(x.id)&&!e.tests.includes(x.id));const extraPenalty=Math.min(12,unneeded.length*3);
 const riskyPenalty=Math.min(36,harmful.length*18);
 const total=Math.max(0,Object.values(points).reduce((a,b)=>a+b,0)-riskyPenalty-extraPenalty);
 const missing=[...((e.history||[]).filter(x=>!s.asked.has(x)).map(id=>'未询问：'+caseData.history.find(x=>x.id===id)?.label)),...((e.exams||[]).filter(x=>!s.examined.has(x)).map(id=>'未完成：'+caseData.examinations.find(x=>x.id===id)?.label)),...((e.tests||[]).filter(x=>!s.ordered.has(x)).map(id=>'未考虑：'+caseData.tests.find(x=>x.id===id)?.label)),...((e.drug||[]).filter(x=>!s.drugs.has(x)).map(x=>'需核对用药思路：'+x)),...((e.plan||[]).filter(x=>!s.plans.has(x)).map(x=>'需考虑处置：'+x))];
 if(caseData.admission){
  caseData.admission.iv_safety.forEach((x,i)=>{if(!s.ivChecked.has(i))missing.push('住院静脉核对漏项：'+x)});
  (caseData.admission.order_review||[]).forEach(x=>{if(s.orderReviews[x.id]!==x.correct)missing.push('医嘱审核未通过：'+x.text+'（正确判断：'+x.correct+'）')});
 }
 if(caseData.urgent&&points.safety===0)missing.push('危急病例早期处置不及时；应优先处理气道、呼吸、循环等危险问题。');
 return {total,points,harmful,unneeded:unneeded.map(x=>x.label),missing,diagnosis_correct:s.diagnosis===e.diagnosis}
}
function finalise(){if(!s)return;if(!s.diagnosis){alert('请先选择最可能的诊断后提交。');return}const result=mark();s.reviewed=true;
 const record={case_id:caseData.id,case_title:caseData.title,system:caseData.system,date:new Date().toISOString(),score:result.total,diagnosis:s.diagnosis,correct_diagnosis:caseData.expected.diagnosis,drugs:[...s.drugs],plans:[...s.plans],interview:[...s.asked],examined:[...s.examined],tests:[...s.ordered],elapsed_minutes:s.minutes,iv_checks:[...s.ivChecked],order_reviews:s.orderReviews,adverse:result.harmful,transcript:s.log.slice(0,100),notes:'',session_id:(crypto?.randomUUID?.()||String(Date.now())+'-'+Math.random()),simulation_version:library.version,educational_only:true};saveHistory(record);s.lastRecordId=record.session_id;
 $('sim-play').hidden=true;$('sim-feedback').hidden=false;
 const root=$('sim-report');root.replaceChildren();root.append(el('h2',result.total+' / 100 分 · '+(result.total>=85?'本轮教学表现较好':result.total>=60?'建议复盘关键环节':'存在重要学习缺口')));
 root.append(el('p','你的诊断：'+s.diagnosis+'。标准答案（虚构病例设定）：'+caseData.expected.diagnosis));
 const breakdown=el('div',undefined,'sim-score-break');Object.entries(result.points).forEach(([k,v])=>{const label={diagnosis:'诊断',history:'病史',examinations:'查体',tests:'检查选择',drugs:'药品选择',plans:'处置计划',safety:'急诊优先顺序',ivReview:'住院静脉核对',orderReview:'模拟医嘱审核'}[k];breakdown.append(el('span',label+'：'+v+'分'))});root.append(breakdown);
 if(result.harmful.length)root.append(el('p','危险或不适宜选择（每项扣分）：'+result.harmful.join('；'),'sim-danger'));
 if(result.unneeded.length)root.append(el('p','非优先检查（本题扣分）：'+result.unneeded.join('；')));
 if(result.missing.length){root.append(el('h3','需要补强的步骤'));const ul=el('ul');result.missing.forEach(x=>ul.append(el('li',x)));root.append(ul)}
 if(caseData.admission){
  root.append(el('h3','病房记录与医嘱复盘'));
  root.append(el('p','本次核查的静脉安全项目：'+s.ivChecked.size+'/'+caseData.admission.iv_safety.length+'项。原始医嘱仅为教学核对场景，不构成可执行处方。'));
  caseData.admission.order_review.forEach(x=>{
   root.append(el('p','【'+x.correct+'】'+x.text+'；你的选择：'+(s.orderReviews[x.id]||'未作答')+'；依据：'+x.reason));
  });
 }
 root.append(el('h3','病例解析（教学编辑摘要，待专家审校）'));root.append(el('p',caseData.reasoning));
 root.append(el('h3','资料依据（仅支持相应临床原则，非对全部模拟评分的认证）'));
 if(caseData.evidence_status)root.append(el('p','当前证据状态：'+caseData.evidence_status,'sim-foot'));caseData.source_ids.forEach(id=>{const data=library.sources[id];if(!data)return;const a=el('a',data.title+' ↗','sim-source');a.href=data.url;a.target='_blank';a.rel='noopener noreferrer';root.append(a,el('small',data.level))});
 root.append(el('p','这不是认证OSCE评分。答案为固定虚构病例教学标准，不能用来评估真实临床能力或替代临床决策。','sim-foot'));
 $('sim-save-note').value='';$('sim-final-export').onclick=()=>exportJSON({...record,debrief:result,log:s.log,notes:$('sim-save-note').value.slice(0,2000)},'pediatric-simulation-'+caseData.id+'.json');
 renderHistory();
}
function renderHistory(){const root=$('sim-history-records');root.replaceChildren();const arr=history();$('sim-history-count').textContent='本机保存 '+arr.length+' 次模拟';if(!arr.length){root.append(el('p','暂无学习记录。'));return}arr.slice(0,15).forEach(r=>{const a=el('article',undefined,'sim-history-item');a.append(el('strong',r.case_title+' · '+r.score+'分'),el('small',new Date(r.date).toLocaleString('zh-CN')+' · '+(r.system||'儿科')));
 const details=el('details');const summary=el('summary','查看当次选择、接诊日志和笔记');details.append(summary);
 details.append(el('p','提交诊断：'+(r.diagnosis||'未提供')+'。病例设定诊断：'+(r.correct_diagnosis||'未记录')));
 details.append(el('p','已选择药品策略：'+((r.drugs||[]).join('；')||'无')));
 details.append(el('p','已选择处置：'+((r.plans||[]).join('；')||'无')));
 if(r.order_reviews)details.append(el('p','模拟医嘱审核：'+Object.entries(r.order_reviews).map(([k,v])=>k+':'+v).join('；')));
 if(r.notes)details.append(el('p','复盘笔记：'+r.notes));
 (r.transcript||[]).slice(0,40).forEach(t=>details.append(el('p',t.who+'：'+t.text)));
 a.append(details);root.append(a)})}
async function init(){try{let response=await fetch('/simulation_cases.json');if(!response.ok)throw Error('HTTP '+response.status);library=await response.json();if(!Array.isArray(library.cases)||library.cases.length<8)throw Error('病例库不完整');
 const groups=['全部',...new Set(library.cases.map(x=>x.system))];groups.forEach(v=>{const opt=el('option',v);opt.value=v;$('sim-filter').append(opt)});
 const meta=library.catalogue;
 $('sim-count').textContent=meta?`共 ${library.cases.length} 份虚构病例；新增${meta.core_scenarios}个核心临床场景 ×4种教学情境＝${meta.scenario_variants}份，另有原版${meta.inherited_cases}份。呼吸、消化、住院输液各48份；无需AI API。`:`已收录 ${library.cases.length} 个虚构病例；无需AI API。`;
 renderHistory();
 }catch(e){$('sim-count').textContent='模拟病例加载失败：'+String(e.message||e)}}
 $('sim-start').addEventListener('click',()=>{if(!library)return;start()});
 $('sim-reroll').addEventListener('click',()=>{if(!library)return;if(s&&!confirm('放弃当前模拟，重新抽取病例？'))return;start()});
 $('sim-ask-form').addEventListener('submit',e=>{e.preventDefault();if(s)questionByInput($('sim-free-question').value);$('sim-free-question').value=''});
 $('sim-reassess').addEventListener('click',reassess);
 $('sim-save-note').addEventListener('change',()=>{if(!s?.lastRecordId)return;try{const arr=history();const r=arr.find(x=>x.session_id===s.lastRecordId);if(r){r.notes=$('sim-save-note').value.trim().slice(0,2000);localStorage.setItem(K,JSON.stringify(arr));renderHistory()}}catch(e){}});
 $('sim-submit').addEventListener('click',finalise);
 $('sim-next').addEventListener('click',start);
 $('sim-clear').addEventListener('click',()=>{if(confirm('清除本机保存的所有模拟评分记录？')){localStorage.removeItem(K);renderHistory()}});
 $('sim-export-history').addEventListener('click',()=>exportJSON({type:'pediatric-simulation-history',version:library?.version,records:history(),note:'仅用于虚构病例学习，不含真实患者数据'},'paeds-simulation-history.json'));
 $('sim-chart-audit').addEventListener('click',()=>{
   if(!caseData?.admission)return;
   const note=caseData.admission.admission_note+'\n\n病程记录：'+caseData.admission.progress_note+'\n护理记录：'+caseData.admission.nursing_note;
   $('chart-type').value='admission';$('chart-text').value=note;
   document.querySelector('[data-page="chart"]')?.click();
 });
 init();
})();

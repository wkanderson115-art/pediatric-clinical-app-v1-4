'use strict';
/* Purely local deterministic learning audit. No raw text is sent unless the user separately opts in to AI. */
const ch=id=>document.getElementById(id);
const CHART_DB='pediatric_cn_chart_practice_v1';
const CHART_STORE='drafts';
const MED_URL='https://www.nhc.gov.cn/wjw/c100175/201002/b1bec53d90f243e0861529723f00221a.shtml';
let currentReport=null;
const docSpec={
 admission:{name:'入院记录',limit:24,fields:[
  ['主诉',/主\s*诉\s*[:：]/,'写明促使就诊的主要症状（体征）及持续时间。','2010规范第18条（二）'],
  ['现病史',/现\s*病\s*史\s*[:：]/,'按时间顺序写明起病、主要症状演变、伴随症状、院外诊疗及效果和一般情况。','2010规范第18条（三）'],
  ['既往史',/既\s*往\s*史\s*[:：]/,'包含疾病、手术外伤、输血、食物或药物过敏、接种等与诊疗相关情况。','2010规范第18条（四）'],
  ['个人史',/(个\s*人\s*史|出生史|喂养史|生长发育史)\s*[:：]/,'按儿童年龄补充出生情况、喂养、生长发育、预防接种等有意义内容。','2010规范第18条（五）；儿科教学补充'],
  ['家族史',/家\s*族\s*史\s*[:：]/,'记录与本次诊断有关的家庭健康及遗传性疾病线索。','2010规范第18条（五）'],
  ['体格检查',/(体\s*格\s*检\s*查|查\s*体)\s*[:：]/,'记录生命体征及重要阳性体征、必要阴性体征，不要使用“查体正常”替代实际记录。','2010规范第18条'],
  ['辅助检查',/(辅\s*助\s*检\s*查|实验室检查|检查结果)\s*[:：]/,'有检查时注明日期、项目、关键结果、单位；未做时可如实注明未做。','2010规范第18条'],
  ['初步诊断',/(初步诊断|入院诊断|诊\s*断)\s*[:：]/,'列出有依据的初步诊断并与病史、体征一致；不确定时写明待查。','2010规范第18条'],
  ['签名',/(医师签名|记录医师|签\s*名)\s*[:：]/,'正式病历须由相应医师签名。教学稿使用“[医师签名]”占位即可。','2010规范第8条']
 ]},
 first:{name:'首次病程记录',limit:8,fields:[
  ['病例特点',/(病例特点|病例特征|病情特点)\s*[:：]/,'提炼重要阳性发现及有鉴别意义的阴性证据。','2010规范第22条（一）'],
  ['拟诊讨论',/(拟诊讨论|诊断依据|诊断分析)\s*[:：]/,'写出拟诊依据及合理的鉴别诊断思路。','2010规范第22条（一）'],
  ['鉴别诊断',/(鉴别诊断|排除.*诊断)\s*[:：]/,'诊断未明时写出关键鉴别；确诊时解释主要诊断依据。','2010规范第22条（一）'],
  ['诊疗计划',/(诊疗计划|诊治计划|治疗计划)\s*[:：]/,'形成具体检查、治疗与复评计划。','2010规范第22条（一）'],
  ['签名',/(医师签名|记录医师|签\s*名)\s*[:：]/,'正式病程记录需医师签名。','2010规范第8条']
 ]},
 progress:{name:'日常病程记录',limit:null,fields:[
  ['记录时间',/(记录时间|记录日期|\d{4}[-年/]\d{1,2}[-月/]\d{1,2})/,'记录日期与时间；病危情况需写到分钟并增加记录频率。','2010规范第22条（二）'],
  ['病情变化',/(病情变化|今[日晨]|查房|精神|体温|病情稳定)/,'记录本阶段症状、体征、病情变化及相关效果。','2010规范第22条'],
  ['诊疗记录',/(诊疗|治疗|医嘱|处置|检查|结果|复评)/,'体现关键检查结果的临床意义、治疗变化及理由。','2010规范第22条'],
  ['签名',/(医师签名|记录医师|签\s*名)\s*[:：]/,'正式病程记录需相应医务人员签名。','2010规范第8条']
 ]},
 outpatient:{name:'门（急）诊初诊记录',limit:null,fields:[
  ['就诊时间',/(就诊时间|记录时间|\d{4}[-年/]\d{1,2}[-月/]\d{1,2})/,'记录就诊时间；急诊应具体到分钟。','2010规范第13条'],
  ['主诉',/主\s*诉\s*[:：]/,'概述主要症状（体征）及持续时间。','2010规范第13条'],
  ['现病史',/现\s*病\s*史\s*[:：]/,'简明写明发病及演变经过。','2010规范第13条'],
  ['既往史',/(既往史|过敏史)\s*[:：]/,'写明既往史及相关过敏情况。','2010规范第13条'],
  ['体征',/(查体|体格检查|体温|呼吸频率|SpO₂|血氧饱和度)\s*[:：]?/,'写明阳性体征和有价值的阴性体征。','2010规范第13条'],
  ['诊断',/(诊断|印象)\s*[:：]/,'明确诊断、待查诊断及依据，避免过度确定。','2010规范第13条'],
  ['处理意见',/(处理意见|诊疗意见|治疗|处置|复诊)\s*[:：]/,'说明治疗意见、随访和必要的危险信号告知。','2010规范第13条'],
  ['签名',/(医师签名|记录医师|签\s*名)\s*[:：]/,'正式门急诊病历需医师签名。','2010规范第13条']
 ]}
};
const PII=[/\b1[3-9]\d{9}\b/,/\b\d{17}[\dXx]\b/,/(?:住院号|病案号|身份证号|联系电话|手机号|家庭住址|家庭地址)\s*[:：]\s*[^\s，。；;]{2,}/,/\b\d{6}[- ]?\d{8}\b/];
function containsPII(t){return PII.some(re=>re.test(t))||/(?:姓名|患儿姓名)\s*[:：]\s*[^\s，。；;\[\]]{2,8}/.test(t)}
function issue(level,title,original,suggestion,rule){return{level,title,original,suggestion,rule}}
function getSection(text,key){const re=new RegExp('(?:^|\\n)\\s*'+key+'\\s*[:：]\\s*([^\\n]*)','i');const m=text.match(re);return m?m[1].trim():''}
function auditChart(text,type,admit='',write=''){
 const spec=docSpec[type]||docSpec.admission,issues=[];
 if(containsPII(text))issues.push(issue('high','可能含有直接身份标识','检测到疑似手机号、身份证号、住院号、真实姓名或地址。','教学稿请替换为“[匿名编号]”等占位符；不要上传第三方AI或保存真实患者病历。','病历隐私与数据保护要求'));
 for(const [label,re,tip,ref] of spec.fields)if(!re.test(text))issues.push(issue(label==='签名'?'high':'medium','未识别到「'+label+'」结构','未找到相应章节或关键词；如果已写在其他段落中请人工确认。',tip,ref));
 const complaint=getSection(text,'主\\s*诉');
 if(/主\s*诉\s*[:：]/.test(text)&&(!complaint||complaint.length<4||!/(?:\d+(?:\.\d+)?\s*(?:天|小时|时|周|月|年|分钟)|昨日|今晨|今天|昨晚)/.test(complaint)))issues.push(issue('medium','主诉可能缺少症状持续时间','主诉：'+(complaint||'（空）'),'建议按照“主要症状或体征 + 持续时间”准确书写，如“咳嗽3天，发热1天”；示例不是病例事实。','2010规范第18条（二）/第13条'));
 if(type==='admission'&& !/(病史陈述者|代诉者|监护人陈述|母亲代诉|父亲代诉)/.test(text))issues.push(issue('medium','未明确病史陈述者','未找到“病史陈述者”相关内容','根据真实情况记录病史由患儿本人或何种监护人提供，并说明可信程度（如有必要）。','2010规范第18条（一）'));
 if((type==='admission'||type==='outpatient')&&!/(体温|T\s*[:：]|呼吸频率|RR\s*[:：]|脉搏|心率|P\s*[:：]|SpO2|SpO₂|血氧)/.test(text))issues.push(issue('medium','生命体征记录不足','未识别到明确生命体征数值','补充确实测得的生命体征、时间和单位；不要填写估计值。','2010规范第18条体格检查要求'));
 if(/否认(?:有)?发热/.test(text)&&/(体温\s*[:：]?\s*(?:3[89]|4\d)(?:\.\d+)?\s*℃?|T\s*[:：]\s*(?:3[89]|4\d))/.test(text))issues.push(issue('high','发热描述可能自相矛盾','同一文书既出现“否认发热”，又记录高体温。','核对是当前还是既往症状、测量时间及位置；按真实时间线解释差异。','客观、真实、准确原则'));
 if(/否认(?:药物)?过敏史/.test(text)&&/(?:青霉素|头孢|阿莫西林|阿奇霉素)[^\n。]{0,12}过敏/.test(text))issues.push(issue('high','过敏史可能前后矛盾','存在否认过敏史与特定药物过敏的并存描述。','核对是否为患儿本人过敏、家族过敏或误记，并据实更正。','客观、准确原则'));
 if(/(?:未|无)(?:明显)?咳嗽/.test(text)&&/主\s*诉\s*[:：][^\n]*咳嗽/.test(text))issues.push(issue('medium','咳嗽描述可能不一致','主诉含咳嗽，但现有文本有“无咳嗽”描述。','核对症状是否在就诊时已缓解；用时间信息连接病程。','现病史时间顺序要求'));
 if(/(?:输液|静滴|静脉滴注|ivgtt)/i.test(text)&&!/(?:剂量|mg|g\b|mL|毫升|滴速|mL\/h)/i.test(text))issues.push(issue('low','输液治疗细节建议补充','出现输液字样，但未识别到药品剂量、用液体积或速度单位。','如为病程记录，应描述确实实施的治疗、反应及医嘱变化理由，并核对实际执行记录；不自行补造剂量。','2010规范第22条病程记录要求'));
 if(/(?:待查|考虑|可能)/.test(text)===false&&/初步诊断\s*[:：]/.test(text)&&text.length<160)issues.push(issue('low','诊断依据书写可能过于简略','病历较短，可能缺少支持诊断的阳性/阴性证据。','检查现病史、体征及辅检是否能够支持初步诊断，必要时标注待排诊断。','2010规范第22条诊断讨论相关要求'));
 if(admit&&write&&spec.limit!==null){const a=new Date(admit).getTime(),b=new Date(write).getTime();if(Number.isFinite(a)&&Number.isFinite(b)){
   const hrs=(b-a)/3600000;
   if(hrs<0)issues.push(issue('high','记录时间早于入院时间',`间隔 ${hrs.toFixed(2)} 小时`,'核对时间输入；不能修改真实医疗记录时间以通过质控。','2010规范第17/22条'));
   else if(hrs>spec.limit)issues.push(issue('high',`文书可能超出${spec.limit}小时法定规范时限`,`根据你提供的时间差 ${hrs.toFixed(1)} 小时。`,'核实实际入院时间和完成时间；超时不能通过倒填时间解决，须按医院程序处理。',`2010规范第${type==='first'?22:17}条`));
  }}
 const high=issues.filter(x=>x.level==='high').length,medium=issues.filter(x=>x.level==='medium').length,low=issues.filter(x=>x.level==='low').length;
 const detected=spec.fields.length-issues.filter(x=>x.title.startsWith('未识别到')).length;
 return{type,docName:spec.name,issues,summary:`已识别 ${detected}/${spec.fields.length} 个教学结构点；提示${high}项高关注、${medium}项待补充、${low}项建议优化。`,high,medium,low,checked_at:new Date().toISOString(),basis:'《病历书写基本规范》卫医政发〔2010〕11号；属于教学规则筛查，不是正式医疗机构病历终审。'}
}
function noteEl(tag,cls,content){const x=document.createElement(tag);if(cls)x.className=cls;if(content!==undefined)x.textContent=content;return x}

// Teaching skeletons only. Bracketed placeholders are NEVER filled with invented patient facts.
const chartTemplates={
 admission:`入院记录（匿名教学模板）
一般情况：[匿名编号]；性别：[需核实]；年龄：[需核实]；入院时间：[需核实]；记录时间：[需核实]；病史陈述者：[需核实]。
主诉：[主要症状/体征及持续时间]。
现病史：[起病时间、诱因和病程演变；主要症状特征；伴随症状及有鉴别价值的阴性症状；就诊和治疗经过及效果；精神、睡眠、饮食、二便变化。]
既往史：[疾病、传染病、手术外伤、输血、药物及食物过敏史；按实际情况填写。]
个人史/出生及喂养史：[胎龄、出生情况、喂养、生长发育、接种史等适龄信息。]
家族史：[与本次疾病或遗传因素相关的资料。]
体格检查：[实际测得体温、心率、呼吸、血压/血氧及系统查体；注明重要阳性和阴性体征。]
辅助检查：[项目、检查时间、结果、单位，未做须如实说明。]
初步诊断：[根据上述证据填写；不确定时标注待查并提出鉴别。]
记录医师签名：[正式系统内按规定签名]。`,
 first:`首次病程记录（匿名教学模板）
记录时间：[根据真实时间填写]
病例特点：[概述病史、体征和辅助检查中的关键阳性、重要阴性证据。]
拟诊讨论（诊断依据）：[逐条写明为何考虑初步诊断，写清仍待证实的内容。]
鉴别诊断：[列举关键待排疾病和支持/反对证据；诊断已明时说明理由。]
诊疗计划：[需要的检查、治疗原则、风险监测、复评节点；具体医嘱另行核对。]
医师签名：[正式系统内按规定签名]。`,
 progress:`日常病程记录（匿名教学模板）
记录日期与时间：[根据真实时间填写]
病情变化：[主诉变化、精神/呼吸/进食、生命体征和有价值的查体。]
重要辅助检查及临床意义：[新增检查、相对前次变化及判断。]
诊疗措施及效果：[实际实施的治疗、医嘱调整与理由、疗效及不良反应。]
沟通与下步计划：[必要知情事项、风险监测、复评计划。]
医师签名：[正式系统内按规定签名]。`,
 outpatient:`门（急）诊初诊记录（匿名教学模板）
就诊日期时间：[急诊应具体至分钟]
科别：[需核实]
主诉：[主要症状/体征及持续时间]
现病史：[起病、演变、伴随症状、院外处理]
既往史/药物过敏史：[需核实]
体格检查：[重要阳性体征和必要阴性体征，实测生命体征]
辅助检查：[仅填实际完成的项目、时间和结果；未做不杜撰]
诊断：[依据与待排问题]
治疗/处理意见：[实际已告知和已实施的处理、复诊及危险信号]
医师签名：[正式系统内按规定签名]。`
};
function renderAudit(data){const panel=ch('chart-results');panel.replaceChildren();const h=noteEl('div','chart-summary');h.append(noteEl('strong','',data.docName+' · 本地质控结果'),noteEl('p','',data.summary),noteEl('small','',data.basis));panel.append(h);
 if(!data.issues.length){panel.append(noteEl('p','check-result','预设规则未发现明显文本结构问题，但不能确认诊断准确、治疗正确或病历已经符合法定全部要求，仍需带教老师人工审核。'))}
 data.issues.forEach((x,i)=>{const box=noteEl('article','chart-issue '+x.level);box.append(noteEl('strong','',`${i+1}. ${x.title}`),noteEl('p','',`发现：${x.original}`),noteEl('p','',`建议：${x.suggestion}`),noteEl('small','',`依据/说明：${x.rule}`));panel.append(box)});
 const tip=noteEl('div','check-result','修改原则：只改写已经确认的事实，不凭AI补造查体、药量、检验结果、医师签名或完成时间。质控完成不代表医院正式审核通过。');panel.append(tip);
 const details=noteEl('details','clinical-item'),summary=noteEl('summary','','查看推荐的标准病历结构模板');details.append(summary);
 const content=noteEl('div','clinical-body'),sample=noteEl('pre','chart-template',chartTemplates[data.type]||chartTemplates.admission);
 content.append(sample);const copy=noteEl('button','outline-button','复制空白模板');copy.type='button';copy.addEventListener('click',()=>{navigator.clipboard.writeText(sample.textContent).then(()=>chartError('已复制空白教学模板。')).catch(()=>chartError('复制受限制，请长按手工选取。'))});content.append(copy);details.append(content);panel.append(details);
 panel.classList.remove('hidden');ch('chart-ai-panel').classList.remove('hidden')
}
let chartDbPromise;
function chartDb(){if(!chartDbPromise)chartDbPromise=new Promise((resolve,reject)=>{const r=indexedDB.open(CHART_DB,1);r.onupgradeneeded=()=>r.result.createObjectStore(CHART_STORE,{keyPath:'id'});r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});return chartDbPromise}
async function chartStore(action,record){const db=await chartDb();return new Promise((resolve,reject)=>{const tx=db.transaction(CHART_STORE,action==='all'?'readonly':'readwrite'),store=tx.objectStore(CHART_STORE);const req=action==='all'?store.getAll():action==='put'?store.put(record):store.delete(record);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)})}
async function chartHistory(){const root=ch('chart-history');root.replaceChildren();let all=[];try{all=await chartStore('all')}catch{root.append(noteEl('p','subtext','此浏览器无法使用IndexedDB本地记录。'));return}
 all.sort((a,b)=>b.updated.localeCompare(a.updated));if(!all.length){root.append(noteEl('p','subtext','暂无匿名教学病历记录。'));return}
 all.slice(0,30).forEach(item=>{const box=noteEl('div','history-item');box.append(noteEl('strong','',`${item.docName} · ${new Date(item.updated).toLocaleString('zh-CN')}`),noteEl('span','',item.summary));const actions=noteEl('div','chart-actions');const open=noteEl('button','','打开');open.type='button';open.addEventListener('click',()=>{ch('chart-type').value=item.type;ch('chart-text').value=item.text;ch('chart-admit').value=item.admit||'';ch('chart-write').value=item.write||'';currentReport=auditChart(item.text,item.type,item.admit,item.write);renderAudit(currentReport);window.scrollTo({top:0,behavior:'smooth'})});const del=noteEl('button','','删除');del.type='button';del.addEventListener('click',async()=>{if(!confirm('删除该本地教学病历记录？'))return;await chartStore('delete',item.id);await chartHistory()});actions.append(open,del);box.append(actions);root.append(box)})
}
function chartError(msg){const n=ch('chart-feedback');n.textContent=msg;n.classList.remove('hidden')}
ch('chart-form').addEventListener('submit',e=>{e.preventDefault();ch('chart-feedback').classList.add('hidden');ch('chart-ai-result').textContent='';const t=ch('chart-text').value.trim();if(t.length<20){chartError('请先提供不少于20字的匿名教学病历。');return}if(containsPII(t))chartError('本地检查发现疑似直接身份信息，若为真实病历请删除可识别内容；严禁上传AI。');currentReport=auditChart(t,ch('chart-type').value,ch('chart-admit').value,ch('chart-write').value);renderAudit(currentReport)});
ch('chart-demo').addEventListener('click',()=>{ch('chart-type').value='admission';ch('chart-admit').value='2026-10-20T09:00';ch('chart-write').value='2026-10-21T11:00';ch('chart-text').value='【以下为完全虚构的教学案例】\n性别：男，年龄：4岁。\n主诉：发热、咳嗽。\n现病史：3天前出现咳嗽，2天前发热，最高体温39.2℃。精神稍差，进食减少。否认发热。\n既往史：否认药物过敏史。曾有青霉素过敏。\n体格检查：体温39.2℃，可闻及湿啰音。\n初步诊断：肺炎。';ch('chart-results').classList.add('hidden');ch('chart-ai-panel').classList.add('hidden');ch('chart-feedback').classList.add('hidden')});
ch('chart-save').addEventListener('click',async()=>{const t=ch('chart-text').value.trim();if(t.length<20){chartError('先写入匿名教学病历并运行本地检查。');return}if(containsPII(t)){chartError('检测到疑似直接身份信息，为保护隐私，暂不保存；请先彻底去标识化。');return}const type=ch('chart-type').value,admit=ch('chart-admit').value,write=ch('chart-write').value,rep=auditChart(t,type,admit,write);try{await chartStore('put',{id:(crypto.randomUUID?.()||('chart-'+Date.now())),type,docName:rep.docName,summary:rep.summary,text:t,admit,write,updated:new Date().toISOString()});await chartHistory();chartError('匿名教学病历已保存在此设备的IndexedDB。')}catch(e){chartError('保存失败：'+e.message)}});
ch('chart-export').addEventListener('click',async()=>{try{const items=await chartStore('all');const payload=JSON.stringify({format:'pediatric-chart-study-v1',exported_at:new Date().toISOString(),items},null,2);const u=URL.createObjectURL(new Blob([payload],{type:'application/json;charset=utf-8'}));const a=document.createElement('a');a.href=u;a.download='儿科匿名病历质控学习记录.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(u),2500);chartError('已触发下载。JSON未加密，必须安全保存且不得包含患者身份信息。')}catch(e){chartError('导出失败：'+e.message)}});
ch('chart-ai-run').addEventListener('click',async()=>{const t=ch('chart-text').value.trim();if(!currentReport||t.length<20){chartError('请先执行本机质控，再选择AI辅助。');return}if(containsPII(t)){chartError('检测到疑似身份标识，禁止向AI发送。');return}if(!ch('chart-ai-consent').checked){chartError('必须明确同意并确认已经去标识化。');return}const btn=ch('chart-ai-run');btn.disabled=true;btn.textContent='正在向AI请求辅助质控…';ch('chart-ai-result').textContent='';try{const r=await fetch('/api/chart-review',{method:'POST',headers:{'Content-Type':'application/json','X-App-Access':ch('chart-ai-code').value},cache:'no-store',body:JSON.stringify({note_text:t,doc_type:ch('chart-type').value,consent_external:true})});const x=await r.json();if(!r.ok)throw Error(x.detail||'请求失败');ch('chart-ai-result').textContent='AI生成 · 未经医师签审\n'+x.review+'\n\n来源依据：'+x.reference+'\n注意：AI未核实病例真实性，不能自动批准或签名。'}catch(e){ch('chart-ai-result').textContent='AI质控未完成：'+e.message+'。本机检查仍可用，未生成虚构的AI意见。'}finally{btn.disabled=false;btn.textContent='请求AI辅助质控'}});
chartHistory().catch(()=>{});

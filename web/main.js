'use strict';
const $ = id => document.getElementById(id);
const FAVORITES_KEY = 'pediatric_drug_favorites_v1';
let searchItems = [];
let current = null;
let currentKeyword = '';
let currentPage = 1;
let priorPage = 'search';
let currentTab = 'search';
const topics = [
  {icon:'♧',name:'呼吸系统',sub:'支气管肺炎 · 支原体肺炎 · 病毒性肺炎',points:[
    '区分典型细菌、支原体与病毒病原；支气管肺炎不等同于细菌感染。',
    '抗菌药用量以具体适应证、年龄、体重、制剂说明书与指南共同核对。',
    '学习氧合状态、并发症、48–72小时疗效复评及静脉转口服条件。']},
  {icon:'◇',name:'消化系统',sub:'急性胃肠炎 · 细菌性痢疾 · 腹腔感染',points:[
    '多数儿童急性水样腹泻无需抗菌药；首先评估脱水程度。',
    '血便及重症肠炎需要识别病原，不能一律使用抗菌注射药。',
    '复杂性阑尾炎需要外科评估与感染源控制。']},
  {icon:'◉',name:'泌尿系统',sub:'尿路感染 · 肾盂肾炎',points:[
    '有条件时尽可能在抗菌治疗前留取尿培养标本。',
    '上尿路感染与单纯膀胱炎的治疗途径和总疗程不同。',
    '按培养药敏调整用药，肾功能异常时需核对剂量或间隔。']},
  {icon:'✦',name:'过敏系统',sub:'荨麻疹 · 过敏性鼻炎 · 过敏性休克',points:[
    '普通荨麻疹通常优先考虑适龄口服抗组胺药。',
    '严重全身性过敏反应的一线救治是大腿前外侧肌注肾上腺素。',
    '抗组胺药和糖皮质激素不能代替过敏性休克的一线救治。']}
];
function escapeText(s){return String(s??'')}
function make(tag,attrs={},text){const el=document.createElement(tag);for(const [k,v] of Object.entries(attrs)){if(k==='className') el.className=v;else if(k==='href'||k==='target'||k==='rel')el.setAttribute(k,v);else el.setAttribute(k,v)}if(text!==undefined)el.textContent=escapeText(text);return el}
function setPage(name){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+name));document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.page===name));if(name!=='detail')currentTab=name;window.scrollTo({top:0,behavior:'instant'});if(name==='favs')renderFavorites()}
function showNotice(message){$('notice').textContent=message;$('notice').classList.remove('hidden')}
function hideNotice(){$('notice').classList.add('hidden')}
function getFavorites(){try{const r=JSON.parse(localStorage.getItem(FAVORITES_KEY)||'[]');return Array.isArray(r)?r.filter(s=>typeof s==='string').slice(0,200):[]}catch{return []}}
function setFavorites(items){localStorage.setItem(FAVORITES_KEY,JSON.stringify(items))}
function isFav(name){return getFavorites().includes(name)}
function toggleFav(name){const f=getFavorites();setFavorites(f.includes(name)?f.filter(x=>x!==name):[name,...f].slice(0,200));updateFavButton()}
function updateFavButton(){if(current)$('detail-fav').textContent=isFav(current.name)?'★ 已收藏':'☆ 收藏'}
function renderTopics(){const home=$('home-topics'),list=$('study-topics');topics.forEach((t,i)=>{
  const button=make('button',{type:'button',className:'topic-card'});button.append(make('span',{className:'topic-icon'},t.icon),make('strong',{},t.name),make('small',{},t.sub));button.addEventListener('click',()=>{setPage('study');const c=document.querySelectorAll('.study-card')[i];c?.scrollIntoView({behavior:'smooth',block:'start'})});home.append(button);
  const card=make('article',{className:'study-card'});card.append(make('h3',{},t.icon+' '+t.name),make('p',{className:'subtitle'},t.sub));const ul=make('ul');t.points.forEach(x=>ul.append(make('li',{},x)));card.append(ul);list.append(card);
})}
function apiStatus(){const data=DirectAPI.status(),node=$('api-status');if(data.drug){node.className='status-bar connected';node.textContent='● 已填写 '+(data.provider==='moseng'?'摩熵数科':'天聚数行')+' Key · 将由本设备直连，结果仍需官方核验'}else{node.className='status-bar offline';node.textContent='○ 尚未填写药品数据 Key · 请到“工具 → API直连设置”填写'}}
function showLoading(){$('results-block').classList.remove('hidden');$('search-results').replaceChildren(make('div',{className:'empty'},'正在查询中国药品资料…'));$('result-count').textContent='';$('load-more').classList.add('hidden')}
async function searchDrugs(query,page=1){query=query.trim();if(query.length<2){showNotice('药名至少输入两个字符。');return}hideNotice();if(page===1){currentKeyword=query;currentPage=1;searchItems=[];showLoading()}else{$('load-more').disabled=true;$('load-more').textContent='正在加载…'}
 try{const d=await DirectAPI.search(query,page);const items=Array.isArray(d.items)?d.items:[];searchItems=page===1?items:searchItems.concat(items);currentPage=page;renderResults();$('load-more').classList.toggle('hidden',items.length<10);}
 catch(e){if(page===1){$('search-results').replaceChildren(make('div',{className:'empty'},'没有可显示的结果'));}showNotice(e.message||'查询失败。')}
 finally{$('load-more').disabled=false;$('load-more').textContent='查看更多'}
}
function renderResults(){const area=$('search-results');area.replaceChildren();$('result-count').textContent=`${searchItems.length}条`;
 if(!searchItems.length){area.append(make('div',{className:'empty'},'当前未找到对应药品资料。可更换通用名，或在国家药监局核验药品批准信息。'));return}
 searchItems.forEach((drug,idx)=>{const b=make('button',{className:'result-card',type:'button'});b.append(make('strong',{},drug.name));const sub=[drug.dosage_form,drug.specifications].filter(Boolean).join(' · ')||'未提供具体剂型、规格';b.append(make('span',{className:'result-sub'},sub));const meta=[drug.manufacturer||'厂家未提供',drug.source||'来源待核验'].join(' | ');b.append(make('span',{className:'result-meta'},meta));b.addEventListener('click',()=>openDrug(idx));area.append(b)})
}
function openDrug(idx){const d=searchItems[idx];if(!d)return;current=d;priorPage='search';$('detail-name').textContent=d.name;$('detail-source').textContent=d.source||'来源未注明';$('detail-source-link').href=(d.source_url&&/^https:\/\//.test(d.source_url))?d.source_url:'https://datasearch.nmpa.gov.cn/';const meta=$('detail-meta');meta.replaceChildren();const fields=[['商品名',d.trade_name],['剂型',d.dosage_form],['规格',d.specifications],['生产企业',d.manufacturer],['批准文号',d.approval_number],['说明书修订日期',d.revise_date]];fields.forEach(([label,v])=>{meta.append(make('p',{},label+'：'+(v||'数据源未提供，需另行核对')))});$('detail-section-count').textContent=`${(d.sections||[]).length}节`;
 const sections=$('detail-sections');sections.replaceChildren();(d.sections||[]).forEach(s=>{const focused=/儿童|小儿|用法用量|禁忌|肾功能|注意事项/.test(s.title||'');const card=make('article',{className:'drug-section'+(focused?' focus':'')});card.append(make('h3',{},s.title),make('div',{className:'drug-text'},s.content));sections.append(card)});updateFavButton();setPage('detail')}
function renderFavorites(){const list=$('fav-list');list.replaceChildren();const names=getFavorites();if(!names.length){list.append(make('div',{className:'empty'},'暂时没有收藏。查询药品后，在说明书页面点击收藏即可。'));return}names.forEach(name=>{const b=make('button',{type:'button',className:'favorite-card'});b.append(make('strong',{},name),make('small',{},'点击重新联网查询，获取当前数据'));b.addEventListener('click',()=>{setPage('search');$('drug-keyword').value=name;searchDrugs(name)});list.append(b)})}
function calc(e){e.preventDefault();const w=Number($('calc-weight').value),r=Number($('calc-rate').value),max=Number($('calc-max').value),n=Number($('calc-times').value),kind=$('calc-type').value;const box=$('calc-output');
 if(![w,r,max,n].every(v=>Number.isFinite(v)&&v>0)||w>300||r>10000){box.replaceChildren(make('p',{},'请输入有效数字，且必须自行核对剂量与上限。'));box.classList.remove('hidden');return}
 const raw=kind==='per-day'?(w*r/n):w*r;const actual=Math.min(max,raw);const decimal=v=>Number(v.toFixed(3)).toLocaleString('zh-CN');box.replaceChildren(make('span',{},'教学计算：单次剂量'),make('strong',{},decimal(actual)+' mg'),make('p',{},`每日数学总量 ${decimal(actual*n)} mg。${raw>max?'原始计算单次 '+decimal(raw)+' mg，超过输入上限，已按上限截取。':''}`),make('p',{},'数学换算不能确认治疗剂量正确。需要额外核对每日总上限、年龄、肝肾功能、制剂与给药途径。'));box.classList.remove('hidden')}
$('search-form').addEventListener('submit',e=>{e.preventDefault();searchDrugs($('drug-keyword').value)});
document.querySelectorAll('[data-page]').forEach(b=>b.addEventListener('click',()=>setPage(b.dataset.page)));
document.querySelectorAll('[data-keyword]').forEach(b=>b.addEventListener('click',()=>{$('drug-keyword').value=b.dataset.keyword;searchDrugs(b.dataset.keyword)}));
$('load-more').addEventListener('click',()=>searchDrugs(currentKeyword,currentPage+1));
$('calc-form').addEventListener('submit',calc);
$('detail-back').addEventListener('click',()=>setPage(priorPage));
$('detail-fav').addEventListener('click',()=>current&&toggleFav(current.name));
renderFavorites();apiStatus();
if('serviceWorker' in navigator && location.protocol==='https:'){navigator.serviceWorker.register('/sw.js').catch(()=>{})}


// V0.2 官方核验入口：只导航到合法公开网页，不抓取 NMPA 内部未公开接口。
function populateVerify(term){
 const v=String(term||'').trim();$('verify-keyword').value=v;$('approval-keyword').value=v;
 setPage('verify');
}
async function copyForOfficial(){
 const val=$('verify-keyword').value.trim();
 if(!val){$('verify-keyword').focus();return}
 try{await navigator.clipboard.writeText(val);showApprovalNotice('已复制查询词。请在国家药监局官网搜索框手工粘贴。')}
 catch{const input=$('verify-keyword');input.focus();input.select();showApprovalNotice('浏览器未允许自动复制，已选中查询词，可使用 iPhone 复制菜单。')}
}
function showApprovalNotice(text){const n=$('approval-notice');n.textContent=text;n.classList.remove('hidden')}
function hideApprovalNotice(){$('approval-notice').classList.add('hidden')}
function showApprovalResults(items){
 const root=$('approval-results');root.replaceChildren();
 if(!items.length){root.append(make('div',{className:'empty'},'第三方批文库没有返回匹配记录。请直接到国家药监局官网核验。'));return}
 const heading=make('h2',{className:'approval-count'},`第三方检索结果 · ${items.length}条`);root.append(heading);
 items.forEach(a=>{
  const card=make('article',{className:'approval-card'});
  card.append(make('strong',{},a.drug_name),make('p',{className:'approval-number'},a.approval_number),make('p',{className:'approval-sub'},'生产企业：'+(a.manufacturer||'第三方未提供')),make('p',{className:'approval-sub'},'上市许可持有人：'+(a.license_holder||'第三方未提供')),make('small',{className:'approval-caution'},'摩熵数科提供 · 并非国家药监局官方实时核验'));
  const btn=make('button',{type:'button',className:'outline-button'},'将此批准文号填入官方核验区');
  btn.addEventListener('click',()=>{$('verify-keyword').value=a.approval_number;window.scrollTo({top:0,behavior:'smooth'})});
  card.append(btn);root.append(card)
 })
}
async function lookupApprovals(e){
 e.preventDefault();hideApprovalNotice();const q=$('approval-keyword').value.trim();
 if(q.length<2){showApprovalNotice('药名或批准文号至少输入2个字符。');return}
 const root=$('approval-results');root.replaceChildren(make('div',{className:'empty'},'正在查询授权的第三方批文数据源…'));
 try{
  showApprovalResults(await DirectAPI.approvals(q))
 }catch(err){root.replaceChildren();showApprovalNotice(err.message||'批文查询失败，请使用官方查询入口。')}
}
$('home-verify').addEventListener('click',()=>populateVerify($('drug-keyword').value));
$('detail-verify').addEventListener('click',()=>current&&populateVerify(current.approval_number||current.name));
$('verify-copy').addEventListener('click',copyForOfficial);
$('approval-form').addEventListener('submit',lookupApprovals);

"use strict";
/* The evidence workbench uses the bundled audit ledger; it needs no project
 * backend and never changes the source data. */
(()=>{
 const el=id=>document.getElementById(id);
 const make=(tag,text,cls)=>{const v=document.createElement(tag);if(text!==undefined)v.textContent=String(text);if(cls)v.className=cls;return v};
 let page=1,busy=false,timer=null,ledger=null;
 const PAGE_SIZE=25;
 function summary(){
  const wrap=el('audit-stats'),d=ledger.summary;wrap.replaceChildren();
  [['逐条审核条目',d.total_claims],['有候选来源入口',d.claims_with_candidate_source],['缺少独立来源',d.claims_without_candidate_source],['临床专家已签审',0]].forEach(([k,v])=>{const box=make('div',undefined,'quality-row');box.append(make('span',k),make('strong',v));wrap.append(box)});
 }
 function matches(record){
  const q=el('audit-query').value.trim().casefold(),kind=el('audit-kind').value,priority=el('audit-priority').value,missing=el('audit-missing').checked;
  if(kind&&record.kind!==kind)return false;
  if(priority&&!String(record.priority||'').startsWith(priority))return false;
  if(missing&&record.sources?.length)return false;
  return !q||['claim_id','title','category','original_text'].some(k=>String(record[k]||'').casefold().includes(q));
 }
 function render(items,replace){
  const wrap=el('audit-list');if(replace)wrap.replaceChildren();
  for(const x of items){
   const art=make('article',undefined,'audit-record');art.append(make('div',x.priority+' · '+x.kind+' · '+x.category,'audit-meta'),make('h3',x.title+' / '+x.section),make('p',x.original_text,'audit-original'),make('p','条目ID：'+x.claim_id,'audit-meta'),make('p',x.evidence_status+'；状态：'+x.medical_review_status,'audit-warning'),make('p','指定审核角色：'+x.reviewer_role,'audit-meta'));
   if(x.sources?.length){const links=make('div',undefined,'audit-links');x.sources.slice(0,4).forEach(s=>{if(!/^https:\/\//.test(s.url))return;const a=make('a',s.name+' ↗');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';links.append(a)});art.append(links)}
   const btn=make('button','复制条目编号','outline-button');btn.type='button';btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(x.claim_id);btn.textContent='已复制'}catch{btn.textContent='复制未成功，请长按编号'}});art.append(btn);wrap.append(art);
  }
  if(!wrap.children.length)wrap.append(make('p','没有符合条件的审核条目。','check-result'));
 }
 function list(append=false){
  if(!ledger||busy)return;busy=true;if(!append)page=1;
  const records=ledger.records.filter(matches).sort((a,b)=>String(a.priority).localeCompare(String(b.priority))||Boolean(a.sources?.length)-Boolean(b.sources?.length)||String(a.claim_id).localeCompare(String(b.claim_id)));
  render(records.slice((page-1)*PAGE_SIZE,page*PAGE_SIZE),!append);el('audit-count').textContent=`共 ${records.length} 条；当前显示最多 ${Math.min(records.length,page*PAGE_SIZE)} 条。全部待专业复核。`;el('audit-more').hidden=page*PAGE_SIZE>=records.length;busy=false;
 }
 function refresh(){clearTimeout(timer);timer=setTimeout(()=>list(false),180)}
 async function init(){
  try{const r=await fetch('/medical_audit.json',{cache:'no-store'});if(!r.ok)throw Error('网络响应 '+r.status);ledger=await r.json();if(!Array.isArray(ledger.records)||!ledger.summary)throw Error('审校索引格式无效');summary();list();}
  catch(err){el('audit-stats').textContent='尚未加载审计概况：'+err.message;el('audit-count').textContent='审校索引加载失败。'}
 }
 ['audit-kind','audit-priority','audit-missing'].forEach(id=>el(id).addEventListener('change',refresh));el('audit-query').addEventListener('input',refresh);el('audit-more').addEventListener('click',()=>{page++;list(true)});el('audit-reset').addEventListener('click',()=>{el('audit-query').value='';el('audit-kind').value='';el('audit-priority').value='';el('audit-missing').checked=false;list()});init();
})();

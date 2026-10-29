"use strict";
(()=>{
 const el=id=>document.getElementById(id);
 const make=(tag,text,cls)=>{const v=document.createElement(tag);if(text!==undefined)v.textContent=String(text);if(cls)v.className=cls;return v};
 let page=1, busy=false, timer=null;
 async function get(url){const resp=await fetch(url,{cache:'no-store'});if(!resp.ok)throw Error('网络响应 '+resp.status);return await resp.json()}
 async function summary(){
  const wrap=el('audit-stats');
  try{
   const result=await get('/api/audit/summary');const d=result.summary;wrap.replaceChildren();
   [['逐条审核条目',d.total_claims],['有候选来源入口',d.claims_with_candidate_source],['缺少独立来源',d.claims_without_candidate_source],['临床专家已签审',0]].forEach(([k,v])=>{const box=make('div',undefined,'quality-row');box.append(make('span',k),make('strong',v));wrap.append(box)});
  }catch(err){wrap.textContent='尚未加载审计概况：'+err.message}
 }
 function render(items,replace){
  const wrap=el('audit-list');if(replace)wrap.replaceChildren();
  for(const x of items){
   const art=make('article',undefined,'audit-record');
   art.append(make('div',x.priority+' · '+x.kind+' · '+x.category,'audit-meta'),make('h3',x.title+' / '+x.section));
   art.append(make('p',x.original_text,'audit-original'));
   art.append(make('p','条目ID：'+x.claim_id,'audit-meta'));
   art.append(make('p',x.evidence_status+'；状态：'+x.medical_review_status,'audit-warning'));
   art.append(make('p','指定审核角色：'+x.reviewer_role,'audit-meta'));
   if(x.sources?.length){
    const links=make('div',undefined,'audit-links');
    x.sources.slice(0,4).forEach(s=>{
     if(!/^https:\/\//.test(s.url))return;
     const a=make('a',s.name+' ↗');a.href=s.url;a.target='_blank';a.rel='noopener noreferrer';links.append(a)
    });art.append(links)
   }
   const btn=make('button','复制条目编号','outline-button');btn.type='button';
   btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(x.claim_id);btn.textContent='已复制'}catch{btn.textContent='复制未成功，请长按编号'}});art.append(btn);
   wrap.append(art);
  }
  if(!wrap.children.length)wrap.append(make('p','没有符合条件的审核条目。','check-result'));
 }
 async function list(append=false){
  if(busy)return;busy=true;if(!append)page=1;
  const params=new URLSearchParams({page:String(page),page_size:'25',q:el('audit-query').value.trim(),kind:el('audit-kind').value,priority:el('audit-priority').value,missing_source:String(el('audit-missing').checked)});
  try{const data=await get('/api/audit/items?'+params);
    render(data.items,!append);el('audit-count').textContent=`共 ${data.total} 条；当前显示最多 ${Math.min(data.total,page*25)} 条。全部待专业复核。`;
    el('audit-more').hidden=page*25>=data.total;
  }catch(err){el('audit-count').textContent='审校索引加载失败：'+err.message;el('audit-more').hidden=true}
  finally{busy=false}
 }
 function refresh(){clearTimeout(timer);timer=setTimeout(()=>list(false),180)}
 ['audit-kind','audit-priority','audit-missing'].forEach(id=>el(id).addEventListener('change',refresh));
 el('audit-query').addEventListener('input',refresh);
 el('audit-more').addEventListener('click',()=>{page++;list(true)});
 el('audit-reset').addEventListener('click',()=>{el('audit-query').value='';el('audit-kind').value='';el('audit-priority').value='';el('audit-missing').checked=false;list()});
 summary();list();
})();

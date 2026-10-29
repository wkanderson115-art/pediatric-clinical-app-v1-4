'use strict';
/* Serverless mode: each device supplies its own API keys. Keys are never
 * bundled into the application or sent to a project-controlled server. */
(() => {
  const STORE = 'pediatric_direct_api_v1';
  const defaults = { deepseekKey:'', deepseekBaseUrl:'https://api.deepseek.com', tianapiKey:'', mosengKey:'', model:'deepseek-v4.1-flash' };
  const read = () => { try { return {...defaults, ...JSON.parse(localStorage.getItem(STORE) || '{}')}; } catch { return {...defaults}; } };
  const save = value => localStorage.setItem(STORE, JSON.stringify({...read(), ...value}));
  const clear = key => { const next=read(); next[key]=''; save(next); };
  const fail = async response => { let body={}; try { body=await response.json(); } catch {} throw Error(body?.error?.message || body?.detail || `接口返回 ${response.status}`); };
  const deepseek = async (messages, maxTokens=1300) => {
    const cfg=read(); if(!cfg.deepseekKey) throw Error('请先在“工具 → API 直连设置”填写 DeepSeek API Key。');
    let response;
    const base=String(cfg.deepseekBaseUrl||defaults.deepseekBaseUrl).replace(/\/+$/,'');
    try { response=await fetch(base+'/chat/completions',{method:'POST',headers:{'Authorization':'Bearer '+cfg.deepseekKey,'Content-Type':'application/json'},body:JSON.stringify({model:cfg.model || defaults.model,messages,temperature:0.2,max_tokens:maxTokens})}); }
    catch { throw Error('无法直连 DeepSeek。该网络或服务商可能限制跨域请求；请检查网络，或改用本地资料。'); }
    if(!response.ok) await fail(response);
    const data=await response.json(); const text=String(data?.choices?.[0]?.message?.content || '').trim();
    if(!text) throw Error('DeepSeek 未返回可用内容。'); return text;
  };
  const normalizeText = value => String(value || '').replace(/<[^>]*>/g,'').trim();
  const search = async (query,page=1) => {
    const cfg=read();
    if(cfg.mosengKey){
      let response; try { response=await fetch('https://srv-openapi.bcpmdata.com/pharma/general/v1/drug_instruction/list',{method:'POST',headers:{'Authorization':cfg.mosengKey,'Content-Type':'application/json'},body:JSON.stringify({search:{drug_name:query},page})}); } catch { throw Error('无法直连摩熵数科；该服务可能不允许浏览器跨域调用。'); }
      if(!response.ok) await fail(response); const payload=await response.json(); const items=Array.isArray(payload?.data)?payload.data:(payload?.data?.list || []);
      return {items:items.map((x,i)=>({id:'moseng-'+i,name:x.drug_name || query,trade_name:x.trade_name||null,dosage_form:x.dosage_form||null,specifications:x.specifications||null,manufacturer:x.manufacturer||x.manufacturer_cn||null,approval_number:Array.isArray(x.approval_number)?x.approval_number.join('、'):x.approval_number||null,revise_date:x.revise_date||null,sections:(x.items||[]).map(s=>({title:s.title||'说明书正文',content:normalizeText(s.content)})).filter(s=>s.content),source:'摩熵数科',source_url:'https://open.bcpmdata.com/api/1.html'})),provider:'moseng'};
    }
    if(cfg.tianapiKey){
      let response; try { response=await fetch('https://apis.tianapi.com/yaopin/index',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({key:cfg.tianapiKey,word:query,num:'10',page:String(page)})}); } catch { throw Error('无法直连天聚数行；该服务可能不允许浏览器跨域调用。'); }
      if(!response.ok) await fail(response); const payload=await response.json(); const raw=payload?.result?.list || payload?.result?.newslist || [];
      return {items:(Array.isArray(raw)?raw:[]).map((x,i)=>({id:'tianapi-'+i,name:x.title||query,sections:[{title:'药品资料原文（需人工核验）',content:normalizeText(x.content)}],source:'天聚数行',source_url:'https://www.tianapi.com/apiview/134'})).filter(x=>x.sections[0].content),provider:'tianapi'};
    }
    throw Error('请先在“工具 → API 直连设置”填写天聚数行或摩熵数科 API Key。');
  };
  const approvals = async query => {
    const cfg=read(); if(!cfg.mosengKey) throw Error('批文检索需要在“API 直连设置”填写摩熵数科 Key。');
    let response; try { response=await fetch('https://srv-openapi.bcpmdata.com/pharma/general/v1/cn_drug_approval/list',{method:'POST',headers:{'Authorization':cfg.mosengKey,'Content-Type':'application/json'},body:JSON.stringify({search:query.startsWith('国药准字')?{approval_number:query}:{drug_name:query},page:1})}); } catch { throw Error('无法直连摩熵数科批文接口；该服务可能不允许浏览器跨域调用。'); }
    if(!response.ok) await fail(response); const data=await response.json(); const rows=Array.isArray(data?.data)?data.data:(data?.data?.list||[]);
    return rows.map(x=>({approval_number:x.approval_number||'',drug_name:x.drug_name||'',manufacturer:x.manufacturer_cn||x.manufacturer||'',license_holder:x.corporation_cn||x.corporation||''})).filter(x=>x.approval_number&&x.drug_name);
  };
  window.DirectAPI = {read,save,clear,deepseek,search,approvals,status:()=>{const c=read();return {ai:!!c.deepseekKey,drug:!!(c.mosengKey||c.tianapiKey),provider:c.mosengKey?'moseng':c.tianapiKey?'tianapi':null};}};
})();

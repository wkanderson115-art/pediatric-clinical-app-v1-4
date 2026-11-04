'use strict';
/* Direct mode: each device supplies its own API keys. Keys never leave the device
 * except to the official provider endpoints. Server mode (APP_ACCESS_CODE) is used
 * automatically as a fallback when the browser blocks cross-origin direct calls. */
(() => {
  const STORE = 'pediatric_direct_api_v1';
  // 官方模型名（api-docs.deepseek.com）：deepseek-flash / deepseek-v4-pro
  const defaults = {
    deepseekKey: '', deepseekBaseUrl: 'https://api.deepseek.com', deepseekModel: 'deepseek-flash',
    tianapiKey: '', mosengKey: '', appAccessCode: '',
  };
  const read = () => { try { return { ...defaults, ...JSON.parse(localStorage.getItem(STORE) || '{}') }; } catch { return { ...defaults }; } };
  const save = value => localStorage.setItem(STORE, JSON.stringify({ ...read(), ...value }));
  const clear = key => { const next = read(); next[key] = ''; save(next); };
  const describe = (status, body) => {
    const detail = (body && (body?.error?.message || body?.detail)) || '';
    if (status === 401) return 'DeepSeek 认证失败（401）：API Key 无效或已被删除。';
    if (status === 402) return 'DeepSeek 余额不足（402）：请到 platform.deepseek.com 充值。';
    if (status === 400) return 'DeepSeek 请求被拒（400）：模型名无效或参数错误，模型名请用 deepseek-flash 或 deepseek-v4-pro。' + (detail ? ' 上游：' + detail : '');
    if (status === 429) return 'DeepSeek 限流（429）：稍后重试。';
    return 'DeepSeek 返回 HTTP ' + status + (detail ? '：' + detail : '');
  };
  const fail = async response => {
    let body = {};
    try { body = await response.json(); } catch { /* ignore */ }
    throw Error(describe(response.status, body));
  };

  // 服务端代理：Key 只存服务器加密文件，前端只带 APP_ACCESS_CODE
  const chatViaServer = async (messages, maxTokens = 1300) => {
    const cfg = read();
    const code = String(cfg.appAccessCode || '').trim();
    if (!code) throw Error('未填写 APP_ACCESS_CODE');
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-App-Access': code },
      body: JSON.stringify({ messages, max_tokens: maxTokens }),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw Error(data.detail || ('服务端 AI 返回 HTTP ' + response.status));
    return String(data.answer || '');
  };

  const deepseek = async (messages, maxTokens = 1300) => {
    const cfg = read();
    if (!cfg.deepseekKey) {
      // 没有本机 Key 时，只要配了访问码就走服务端
      if (String(cfg.appAccessCode || '').trim()) return chatViaServer(messages, maxTokens);
      throw Error('请先在「工具 → API 直连设置」填写 DeepSeek API Key，或填写 APP_ACCESS_CODE 使用服务端 AI。');
    }
    const base = String(cfg.deepseekBaseUrl || defaults.deepseekBaseUrl).replace(/\/+$/, '');
    const model = String(cfg.deepseekModel || defaults.deepseekModel).trim();
    let response;
    try {
      response = await fetch(base + '/chat/completions', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + cfg.deepseekKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({ model, messages, temperature: 0.2, max_tokens: maxTokens }),
      });
    } catch (err) {
      // 直连被网络/跨域拦下：若配置了访问码，自动改走服务端
      if (String(cfg.appAccessCode || '').trim()) return chatViaServer(messages, maxTokens);
      throw Error('无法直连 DeepSeek（' + (err && err.message ? err.message : '网络错误') +
        '）。排查顺序：① 模型名是否 deepseek-flash ② Key 是否有效/有余额 ③ 本机网络能否访问 api.deepseek.com ④ 浏览器跨域是否被拦。也可填写 APP_ACCESS_CODE 走服务端代理。');
    }
    if (!response.ok) await fail(response);
    const data = await response.json();
    const text = String(data?.choices?.[0]?.message?.content || '').trim();
    if (!text) throw Error('DeepSeek 未返回可用内容。');
    return text;
  };

  const normalizeText = value => String(value || '').replace(/<[^>]*>/g, '').trim();
  const search = async (query, page = 1) => {
    const cfg = read();
    if (cfg.mosengKey) {
      let response; try { response = await fetch('https://srv-openapi.bcpmdata.com/pharma/general/v1/drug_instruction/list', { method: 'POST', headers: { Authorization: cfg.mosengKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ search: { drug_name: query }, page }) }); } catch { throw Error('无法直连摩熵数科；该服务可能不允许浏览器跨域调用。'); }
      if (!response.ok) await fail(response); const payload = await response.json(); const items = Array.isArray(payload?.data) ? payload.data : (payload?.data?.list || []);
      return { items: items.map((x, i) => ({ id: 'moseng-' + i, name: x.drug_name || query, trade_name: x.trade_name || null, dosage_form: x.dosage_form || null, specifications: x.specifications || null, manufacturer: x.manufacturer || x.manufacturer_cn || null, approval_number: Array.isArray(x.approval_number) ? x.approval_number.join('、') : x.approval_number || null, revise_date: x.revise_date || null, sections: (x.items || []).map(s => ({ title: s.title || '说明书正文', content: normalizeText(s.content) })).filter(s => s.content), source: '摩熵数科', source_url: 'https://open.bcpmdata.com/api/1.html' })), provider: 'moseng' };
    }
    if (cfg.tianapiKey) {
      let response; try { response = await fetch('https://apis.tianapi.com/yaopin/index', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ key: cfg.tianapiKey, word: query, num: '10', page: String(page) }) }); } catch { throw Error('无法直连天聚数行；该服务可能不允许浏览器跨域调用。'); }
      if (!response.ok) await fail(response); const payload = await response.json(); const raw = payload?.result?.list || payload?.result?.newslist || [];
      return { items: (Array.isArray(raw) ? raw : []).map((x, i) => ({ id: 'tianapi-' + i, name: x.title || query, sections: [{ title: '药品资料原文（需人工核验）', content: normalizeText(x.content) }], source: '天聚数行', source_url: 'https://www.tianapi.com/apiview/134' })).filter(x => x.sections[0].content), provider: 'tianapi' };
    }
    throw Error('请先在「工具 → API 直连设置」填写天聚数行或摩熵数科 API Key。');
  };
  const approvals = async query => {
    const cfg = read(); if (!cfg.mosengKey) throw Error('批文检索需要在「API 直连设置」填写摩熵数科 Key。');
    let response; try { response = await fetch('https://srv-openapi.bcpmdata.com/pharma/general/v1/cn_drug_approval/list', { method: 'POST', headers: { Authorization: cfg.mosengKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ search: query.startsWith('国药准字') ? { approval_number: query } : { drug_name: query }, page: 1 }) }); } catch { throw Error('无法直连摩熵数科批文接口；该服务可能不允许浏览器跨域调用。'); }
    if (!response.ok) await fail(response); const data = await response.json(); const rows = Array.isArray(data?.data) ? data.data : (data?.data?.list || []);
    return rows.map(x => ({ approval_number: x.approval_number || '', drug_name: x.drug_name || '', manufacturer: x.manufacturer_cn || x.manufacturer || '', license_holder: x.corporation_cn || x.corporation || '' })).filter(x => x.approval_number && x.drug_name);
  };
  const diagnose = async () => {
    const cfg = read();
    const out = { model: cfg.deepseekModel || defaults.deepseekModel, base: cfg.deepseekBaseUrl || defaults.deepseekBaseUrl, server_code: !!String(cfg.appAccessCode || '').trim(), direct_key: !!cfg.deepseekKey, reachable: null, detail: '' };
    try {
      const response = await fetch('https://api.deepseek.com/models', { headers: cfg.deepseekKey ? { Authorization: 'Bearer ' + cfg.deepseekKey } : {} });
      out.reachable = true;
      out.detail = response.status === 200 ? 'Key 有效' : response.status === 401 ? '网络可达，Key 无效或未填写' : '网络可达，上游 HTTP ' + response.status;
    } catch (err) {
      out.reachable = false;
      out.detail = '连不上 api.deepseek.com：' + (err && err.message ? err.message : 'network');
    }
    return out;
  };
  window.DirectAPI = {
    read, save, clear, deepseek, search, approvals, diagnose,
    chatViaServer,
    status: () => { const c = read(); return { ai: !!(c.deepseekKey || c.appAccessCode), direct: !!c.deepseekKey, server: !!c.appAccessCode, drug: !!(c.mosengKey || c.tianapiKey), provider: c.mosengKey ? 'moseng' : c.tianapiKey ? 'tianapi' : null }; },
  };
})();

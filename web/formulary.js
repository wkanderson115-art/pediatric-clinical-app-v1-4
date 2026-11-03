'use strict';
/* V1.5 离线儿科药典：读取静态 /drug_formulary.json，无需任何 API Key。
 * 所有条目为编辑性教学整理，未经药事/临床专家逐条审核；不构成处方或医嘱。
 * 本文件只做本地检索与展示，不发送任何数据到服务器。 */
(() => {
  const el = id => document.getElementById(id);
  const state = { data: null, category: '', query: '', error: '' };
  let loading = null;

  const node = (tag, text, cls) => {
    const e = document.createElement(tag);
    if (text !== undefined && text !== null) e.textContent = String(text);
    if (cls) e.className = cls;
    return e;
  };
  const text = v => (Array.isArray(v) ? v.filter(Boolean).join('；') : (v || ''));

  function load() {
    if (!loading) {
      loading = LocalData.load('/drug_formulary.json').then(d => {
          if (!d || !Array.isArray(d.items)) throw Error('format');
          state.data = d;
          return d;
        })
        .catch(err => {
          state.error = '离线药典载入失败：' + String(err.message || err);
          return null;
        });
    }
    return loading;
  }

  function haystack(item) {
    return [
      item.generic_name, item.drug_class, item.category, item.indications,
      item.peds_notes, item.dose_note, item.age_limit, item.cautions,
      text(item.aliases), text(item.tags), text(item.forms)
    ].join(' ').toLowerCase();
  }

  function search(query, category) {
    const items = (state.data && state.data.items) || [];
    const needle = String(query || '').trim().toLowerCase();
    const cat = category === undefined ? state.category : category;
    return items.filter(item => {
      if (cat && item.category !== cat) return false;
      if (needle && !haystack(item).includes(needle)) return false;
      return true;
    });
  }

  function meta() {
    const d = state.data;
    if (!d) return { count: 0, categories: [] };
    const counts = {};
    d.items.forEach(x => { counts[x.category] = (counts[x.category] || 0) + 1; });
    return { count: d.items.length, categories: d.categories || Object.keys(counts), counts };
  }

  function card(item) {
    const b = node('button');
    b.type = 'button';
    b.className = 'formulary-card';
    b.append(node('strong', item.generic_name));
    b.append(node('span', text(item.aliases) ? '别名：' + text(item.aliases) : item.drug_class, 'formulary-sub'));
    b.append(node('span', [item.category, item.drug_class, text(item.forms).split('；')[0]].filter(Boolean).join(' · '), 'formulary-meta'));
    b.addEventListener('click', () => openDetail(item.id));
    return b;
  }

  function renderPanel() {
    const root = el('formulary-results');
    if (!root) return;
    root.replaceChildren();
    if (state.error) { root.append(node('p', state.error, 'empty')); return; }
    const list = search(state.query);
    const count = el('formulary-count');
    if (count) count.textContent = list.length + ' / ' + meta().count + ' 条离线教学条目';
    if (!list.length) {
      root.append(node('p', '没有匹配的离线药典条目。可换用通用名，或在上方使用在线说明书检索（需要自备 Key）。', 'empty'));
      return;
    }
    list.slice(0, 60).forEach(item => root.append(card(item)));
    if (list.length > 60) root.append(node('p', '仅显示前 60 条，请补充关键词缩小范围。', 'subtext'));
  }

  function renderCats() {
    const root = el('formulary-cats');
    if (!root) return;
    root.replaceChildren();
    const m = meta();
    const all = node('button', '全部（' + m.count + '）');
    all.type = 'button';
    all.className = state.category === '' ? 'selected' : '';
    all.addEventListener('click', () => { state.category = ''; renderCats(); renderPanel(); });
    root.append(all);
    (m.categories || []).forEach(cat => {
      const b = node('button', cat + (m.counts && m.counts[cat] ? '（' + m.counts[cat] + '）' : ''));
      b.type = 'button';
      b.className = state.category === cat ? 'selected' : '';
      b.addEventListener('click', () => { state.category = cat; renderCats(); renderPanel(); });
      root.append(b);
    });
  }

  function fillDetail(item) {
    if (!item) return;
    window.__favTarget = item.generic_name;
    const nameNode = el('detail-name');
    if (!nameNode) return;
    nameNode.textContent = item.generic_name;
    el('detail-source').textContent = '离线教学药典（编辑整理）';
    const link = el('detail-source-link');
    if (link) { link.href = 'https://datasearch.nmpa.gov.cn/'; link.textContent = '到国家药监局核对批文 ↗'; }
    const metaBox = el('detail-meta');
    if (metaBox) {
      metaBox.replaceChildren();
      const rows = [
        ['别名', text(item.aliases)],
        ['分类', (item.category || '') + ' · ' + (item.drug_class || '')],
        ['常见剂型与规格', text(item.forms)],
        ['年龄限制', item.age_limit],
        ['审校状态', item.review_status || '编辑性教学整理，未经专家逐条审核']
      ];
      rows.forEach(([k, v]) => metaBox.append(node('p', k + '：' + (v || '未提供，需另行核对'))));
    }
    const sectionCount = el('detail-section-count');
    const sections = el('detail-sections');
    if (sections) {
      sections.replaceChildren();
      const parts = [
        ['教学性适应证', item.indications],
        ['儿童使用要点', item.peds_notes],
        ['儿童用法与剂量原则（须核对说明书）', [item.dose_note, item.max_single ? '最大量原则：' + item.max_single : ''].filter(Boolean).join(' ')],
        ['禁忌', item.contraindications],
        ['注意事项', item.cautions],
        ['不良反应', item.adverse],
        ['用药监测', item.monitoring],
        ['肾功能调整', item.renal_note],
        ['肝功能调整', item.hepatic_note],
        ['药物相互作用', item.interactions]
      ].filter(([, v]) => v);
      parts.forEach(([title, body]) => {
        const cardEl = node('article', undefined, 'drug-section' + (/剂量|禁忌|要点/.test(title) ? ' focus' : ''));
        cardEl.append(node('h3', title), node('div', body, 'drug-text'));
        sections.append(cardEl);
      });
      const sourceNames = (item.sources || []).map(s => s.name).filter(Boolean);
      const tail = node('article', undefined, 'drug-section');
      tail.append(node('h3', '资料来源与边界'));
      tail.append(node('div',
        (sourceNames.length ? '候选来源：' + sourceNames.join('；') + '。' : '本条目暂无独立来源入口。') +
        ' 全部内容为编辑性教学整理，未经药事与临床专家逐条审核；剂量、适应证与禁忌必须核对本院制剂说明书、年龄/体重/肝肾功能和最新指南，不能直接形成医嘱。',
        'drug-text'));
      sections.append(tail);
      appendDosePanel(sections, item);
      if (sectionCount) sectionCount.textContent = sections.children.length + '节';
    }
    const relationBox = el('detail-relations');
    if (relationBox && window.Relations) Relations.render('drug', item.id, relationBox);
    if (typeof updateFavButton === 'function') updateFavButton();
    if (typeof setPage === 'function') setPage('detail');
  }

  let doseData = null;
  let doseLoading = null;

  function loadDose() {
    if (!doseLoading) {
      doseLoading = LocalData.load('/dose_rules.json').then(d => { doseData = d; return d; })
        .catch(() => null);
    }
    return doseLoading;
  }

  function doseRecord(id) {
    const items = (doseData && doseData.items) || [];
    return items.find(x => x.drug_id === id) || null;
  }

  function fmt(value) {
    if (!Number.isFinite(value)) return '—';
    const rounded = Math.round(value * 1000) / 1000;
    return String(rounded);
  }

  function computeRange(rule, weight) {
    const times = (rule.times_per_day || []).filter(Number.isFinite);
    const tMax = times.length ? Math.max(...times) : 1;
    const tMin = times.length ? Math.min(...times) : 1;
    let perDoseLow;
    let perDoseHigh;
    let dailyLow;
    let dailyHigh;
    if (rule.basis === '日') {
      perDoseLow = weight * rule.low / tMax;
      perDoseHigh = weight * rule.high / tMin;
      dailyLow = weight * rule.low;
      dailyHigh = weight * rule.high;
    } else {
      perDoseLow = weight * rule.low;
      perDoseHigh = weight * rule.high;
      dailyLow = perDoseLow * tMin;
      dailyHigh = perDoseHigh * tMax;
    }
    return { perDoseLow, perDoseHigh, dailyLow, dailyHigh, times };
  }

  function appendDosePanel(container, item) {
    loadDose().then(() => {
      const record = doseRecord(item.id);
      if (!record) return;
      const card = node('article', undefined, 'drug-section dose-panel');
      card.append(node('h3', '体重→教学区间（数学演示，不是处方）'));
      if (!record.rules || !record.rules.length) {
        card.append(node('div',
          (record.status || '本条没有可抽取的体重区间。') +
          (record.fixed_age_dose_text ? ' 文中按年龄分档：' + record.fixed_age_dose_text + '。' : '') +
          ' 请直接阅读条目原文并按说明书核对。',
          'drug-text'));
        container.append(card);
        return;
      }
      const rule = record.rules[0];
      const body = node('div', undefined, 'drug-text');
      body.append(node('p', '抽取区间：' + fmt(rule.low) + '–' + fmt(rule.high) + ' ' + rule.unit + '/kg/' + rule.basis +
        (rule.times_per_day && rule.times_per_day.length ? '，分 ' + rule.times_per_day.join('–') + ' 次' : '') +
        (rule.max_single !== null && rule.max_single !== undefined ? '，条目内单次上限 ' + fmt(rule.max_single) + ' ' + (rule.max_single_unit || 'mg') : '') + '。'));
      const row = node('div', undefined, 'dose-input-row');
      const label = node('label', '患儿体重（kg）');
      const input = node('input');
      input.type = 'number';
      input.min = '0.3';
      input.max = '200';
      input.step = 'any';
      input.placeholder = '例如 16';
      label.append(input);
      row.append(label);
      const output = node('div', undefined, 'dose-output');
      const update = () => {
        const weight = Number(input.value);
        output.replaceChildren();
        if (!Number.isFinite(weight) || weight <= 0 || weight > 200) {
          output.append(node('p', '请输入 0.3–200 kg 的有效体重。', 'subtext'));
          return;
        }
        const r = computeRange(rule, weight);
        const unit = rule.unit;
        output.append(node('p', '单次：约 ' + fmt(r.perDoseLow) + '–' + fmt(r.perDoseHigh) + ' ' + unit +
          (r.times.length ? '（每日 ' + r.times.join('–') + ' 次）' : '')));
        output.append(node('p', '每日总量：约 ' + fmt(r.dailyLow) + '–' + fmt(r.dailyHigh) + ' ' + unit));
        if (rule.max_single !== null && rule.max_single !== undefined && r.perDoseHigh > rule.max_single) {
          output.append(node('p', '⚠ 计算单次上限 ' + fmt(r.perDoseHigh) + ' 已超过条目内上限 ' + fmt(rule.max_single) + '，需人工核对剂型、分次与说明书。', 'review-caution'));
        }
        output.append(node('p', '这只是把条目区间乘以体重的数学结果：不含适应证、肝肾、过敏、制剂浓度与输注速度，不能形成医嘱。', 'subtext'));
      };
      input.addEventListener('input', update);
      update();
      row.append(output);
      body.append(row);
      body.append(node('p', record.basis + '；' + record.review_status, 'review-caution'));
      card.append(body);
      container.append(card);
    });
  }

  function openDetail(id) {
    const items = (state.data && state.data.items) || [];
    const item = items.find(x => x.id === id);
    if (item) fillDetail(item);
  }

  function bind() {
    const input = el('formulary-keyword');
    if (input) {
      input.addEventListener('input', () => { state.query = input.value; renderPanel(); });
      input.addEventListener('search', () => { state.query = input.value; renderPanel(); });
    }
    load().then(d => {
      if (!d) { renderPanel(); return; }
      renderCats();
      renderPanel();
      const count = el('formulary-count');
      if (count) count.textContent = d.items.length + ' 条离线教学条目 · ' + (d.categories || []).length + ' 个分类';
    });
  }

  window.Formulary = { load, search, openDetail, meta, count: () => (state.data ? state.data.items.length : 0) };
  bind();
})();

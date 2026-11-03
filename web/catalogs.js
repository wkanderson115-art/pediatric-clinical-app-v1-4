'use strict';
/* V1.8 官方目录查询：医保药品目录（可离线） + 上市药品批文目录（服务端）。
 * 结果仅作检索与核对，费用类别/限定支付以最新官方目录为准，批文状态须到药监局官网复核。 */
(() => {
  const el = id => document.getElementById(id);
  const state = { tab: 'insurance', query: '', page: 1, pageSize: 20, offline: null };

  const node = (tag, text, cls) => {
    const e = document.createElement(tag);
    if (text !== undefined && text !== null) e.textContent = String(text);
    if (cls) e.className = cls;
    return e;
  };

  function row(label, value) {
    const wrap = node('div', undefined, 'catalog-row');
    wrap.append(node('span', label), node('strong', value || '—'));
    return wrap;
  }

  function render(data) {
    const root = el('catalog-results');
    const count = el('catalog-count');
    if (!root) return;
    root.replaceChildren();
    if (count) {
      count.textContent = `共 ${data.total} 条` + (data.catalog_count ? `（目录 ${data.catalog_count} 条）` : '') +
        (data.offline ? ' · 离线检索' : '');
    }
    if (!data.items || !data.items.length) {
      root.append(node('p', '没有匹配条目。可换用通用名（如「阿奇霉素」）或缩短关键词。', 'empty'));
      return;
    }
    data.items.forEach(item => {
      const card = node('article', undefined, 'catalog-item');
      if (state.tab === 'insurance') {
        card.append(node('h3', item.name + (item.dosage_form ? '（' + item.dosage_form + '）' : '')));
        card.append(row('费用类别', item.insurance_class));
        card.append(row('目录编号', item.catalog_no));
        card.append(row('所属部分', item.section));
        if (item.atc_category) card.append(row('分类', item.atc_category));
        if (item.note) card.append(node('p', item.note, 'catalog-note'));
      } else {
        card.append(node('h3', item.name));
        card.append(row('批准文号', item.approval_number));
        card.append(row('剂型', item.dosage_form));
        card.append(row('规格', item.specification));
        card.append(row('生产单位', item.manufacturer));
      }
      root.append(card);
    });
    if (data.total > data.items.length) {
      root.append(node('p', '仅显示前 ' + data.items.length + ' 条，请补充关键词。', 'subtext'));
    }
  }

  async function insuranceOffline(query) {
    const data = await LocalData.load('/insurance_catalog.json');
    const needle = String(query || '').trim().toLowerCase();
    const items = (data.items || []).filter(item =>
      !needle || [item.name, item.dosage_form, item.note, item.section, item.atc_category]
        .join(' ').toLowerCase().includes(needle));
    return { total: items.length, items: items.slice(0, 50), catalog_count: (data.items || []).length, offline: true };
  }

  async function run() {
    const input = el('catalog-query');
    const query = input ? input.value.trim() : '';
    const tab = state.tab;
    const count = el('catalog-count');
    const root = el('catalog-results');
    if (count) count.textContent = '检索中…';
    try {
      const response = await fetch(`/api/catalog/${tab}?q=${encodeURIComponent(query)}&page_size=${state.pageSize}`);
      if (!response.ok) throw Error('HTTP ' + response.status);
      render(await response.json());
    } catch (error) {
      if (tab === 'insurance') {
        try { render(await insuranceOffline(query)); return; } catch (e) { /* 落到底部提示 */ }
      }
      if (root) root.replaceChildren(node('p',
        tab === 'approval'
          ? '批文目录保存在服务端：当前后端不可用，请连上服务端后再查，或到药监局官网人工核验。'
          : '目录数据加载失败：请检查部署或网络。', 'empty'));
      if (count) count.textContent = '';
    }
  }

  function selectTab(tab) {
    state.tab = tab;
    document.querySelectorAll('.catalog-tab').forEach(btn => btn.classList.toggle('selected', btn.dataset.cat === tab));
    const input = el('catalog-query');
    if (input) input.placeholder = tab === 'insurance'
      ? '查通用名：阿奇霉素 / 布洛芬 / 蒙脱石'
      : '查通用名或批准文号：头孢曲松 / 国药准字H…';
    run();
  }

  function bind() {
    document.querySelectorAll('.catalog-tab').forEach(btn => {
      btn.addEventListener('click', () => selectTab(btn.dataset.cat));
    });
    const form = el('catalog-form');
    if (form) form.addEventListener('submit', event => { event.preventDefault(); run(); });
    const input = el('catalog-query');
    if (input) {
      let timer = null;
      input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(run, 260); });
    }
  }

  window.Catalogs = { run, selectTab };
  bind();
})();

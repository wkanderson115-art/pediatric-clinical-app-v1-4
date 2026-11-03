'use strict';
/* V1.6 全局检索：跨 7 个模块一次搜索（路径/专题/化验/检查/药典/练习/病例）。
 * 只调用 /api/search/all 或本地静态回退；不联网检索、不修改数据。 */
(() => {
  const el = id => document.getElementById(id);
  const KIND_ORDER = ['path', 'topic', 'lab', 'exam', 'drug', 'quiz', 'case'];

  const node = (tag, text, cls) => {
    const e = document.createElement(tag);
    if (text !== undefined) e.textContent = String(text);
    if (cls) e.className = cls;
    return e;
  };

  function offlineFallback(query) {
    // PWA 离线时后端不可用，用已缓存的三份核心数据做简化检索
    return Promise.all([
      LocalData.load('/clinical_extension.json').catch(() => null),
      LocalData.load('/learning.json').catch(() => null),
      LocalData.load('/drug_formulary.json').catch(() => null)
    ]).then(([clinical, learning, formulary]) => {
      const q = query.trim().toLowerCase();
      const facets = [];
      const push = (kind, kindLabel, id, label, note) => {
        let facet = facets.find(f => f.kind === kind);
        if (!facet) { facet = { kind, kind_label: kindLabel, total: 0, items: [] }; facets.push(facet); }
        facet.total += 1;
        if (facet.items.length < 8) facet.items.push({ id, label, snippet: note || '' });
      };
      (clinical && clinical.clinical_paths || []).forEach(p => {
        if ((p.title + p.recognition + p.management).toLowerCase().includes(q)) push('path', '诊疗路径', p.id, p.title, p.category);
      });
      (learning && learning.systems || []).forEach(s => (s.topics || []).forEach(t => {
        if ((t.title + JSON.stringify(t.content)).toLowerCase().includes(q)) push('topic', '学习专题', t.id, t.title, s.name);
      }));
      (clinical && clinical.lab_tests || []).forEach(l => {
        if ((l.code + l.name + l.meaning).toLowerCase().includes(q)) push('lab', '化验项目', l.code, l.name, l.unit);
      });
      (clinical && clinical.examination_terms || []).forEach(e => {
        if ((e.term + e.meaning).toLowerCase().includes(q)) push('exam', '检查术语', e.id, e.term, e.modality);
      });
      (formulary && formulary.items || []).forEach(d => {
        if ((d.generic_name + (d.aliases || []).join('') + d.indications).toLowerCase().includes(q)) push('drug', '离线药典', d.id, d.generic_name, d.category);
      });
      return { facets, offline: true };
    });
  }

  function render(data) {
    const root = el('global-results');
    if (!root) return;
    root.replaceChildren();
    const total = el('global-count');
    if (!data || !data.facets || !data.facets.length) {
      if (total) total.textContent = '没有命中';
      root.append(node('p', '没有找到匹配内容。可换用更短的关键词，或分别到药典、学习、化验页面检索。', 'empty'));
      return;
    }
    if (total) total.textContent = '命中 ' + Number(data.total || data.facets.reduce((a, f) => a + f.total, 0)) + ' 条' + (data.offline ? '（离线简化检索）' : '');
    data.facets.sort((a, b) => KIND_ORDER.indexOf(a.kind) - KIND_ORDER.indexOf(b.kind)).forEach(facet => {
      const group = node('section', undefined, 'global-facet');
      const head = node('h3', facet.kind_label + ' · ' + facet.total + ' 条');
      group.append(head);
      facet.items.forEach(item => {
        const button = node('button', undefined, 'global-hit');
        button.type = 'button';
        button.append(node('strong', item.label || item.id), node('small', item.snippet || ''));
        button.addEventListener('click', () => {
          if (window.Relations && typeof window.Relations.open === 'function') {
            window.Relations.open(facet.kind, item.id, item.label);
          }
        });
        group.append(button);
      });
      if (facet.total > facet.items.length) {
        group.append(node('p', '仅显示前 ' + facet.items.length + ' 条，请补充关键词。', 'subtext'));
      }
      root.append(group);
    });
  }

  async function run() {
    const input = el('global-query');
    if (!input) return;
    const query = input.value.trim();
    const total = el('global-count');
    if (!query) {
      if (total) total.textContent = '';
      const root = el('global-results');
      if (root) root.replaceChildren();
      return;
    }
    if (total) total.textContent = '检索中…';
    try {
      const response = await fetch('/api/search/all?q=' + encodeURIComponent(query) + '&limit=8');
      if (!response.ok) throw Error('HTTP ' + response.status);
      render(await response.json());
    } catch (error) {
      render(await offlineFallback(query));
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = el('global-form');
    if (form) form.addEventListener('submit', event => { event.preventDefault(); run(); });
    const input = el('global-query');
    if (input) {
      let timer = null;
      input.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(run, 220);
      });
    }
  });

  window.GlobalSearch = { run };
})();

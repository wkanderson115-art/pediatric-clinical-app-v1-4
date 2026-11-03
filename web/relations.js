'use strict';
/* V1.6 跨模块关联：读取静态 /relations.json，在详情页展示“相关条目”。
 * 关联仅表示名称在正文中出现，不代表医学上互为适应证或可替代；点击后跳到对应模块。 */
(() => {
  const state = { data: null, loading: null };
  const KIND_LABEL = { drug: '药典', path: '路径', lab: '化验', exam: '检查', topic: '专题', quiz: '练习', case: '病例' };

  function load() {
    if (!state.loading) {
      state.loading = LocalData.load('/relations.json')
        .then(d => { state.data = d; return d; })
        .catch(() => null);
    }
    return state.loading;
  }

  function items(kind, id) {
    const index = (state.data && state.data.index) || {};
    const list = index[kind + ':' + id];
    return Array.isArray(list) ? list : [];
  }

  function open(kind, id, label) {
    if (kind === 'drug' && window.Formulary) { Formulary.openDetail(id); return; }
    if (kind === 'topic' && typeof openLearningTopic === 'function') { openLearningTopic(id); return; }
    if (kind === 'path') {
      if (typeof setPage === 'function') setPage('clinic');
      const box = document.getElementById('clinic-search');
      if (box) { box.value = label || ''; if (typeof drawClinical === 'function') drawClinical(); }
      return;
    }
    if (kind === 'lab') {
      if (typeof setPage === 'function') setPage('labs');
      const sel = document.getElementById('lab-test');
      if (sel) { sel.value = id; if (typeof onLabSelect === 'function') onLabSelect(); }
      return;
    }
    if (kind === 'case') {
      if (typeof setPage === 'function') setPage('sim');
      if (typeof window.startSimCase === 'function') window.startSimCase(id);
      return;
    }
    if (kind === 'quiz' && typeof setPage === 'function') { setPage('quiz'); return; }
    if (kind === 'exam' && typeof setPage === 'function') { setPage('exams'); return; }
  }

  function render(kind, id, container, options) {
    if (!container) return;
    options = options || {};
    load().then(() => {
      const list = items(kind, id);
      container.replaceChildren();
      if (!list.length) {
        if (options.hideWhenEmpty !== false) { container.hidden = true; return; }
        const empty = document.createElement('p');
        empty.className = 'subtext';
        empty.textContent = '暂无自动关联条目（关联只基于名称出现，未命中的内容请用全局检索）。';
        container.append(empty);
        return;
      }
      container.hidden = false;
      const title = document.createElement('h3');
      title.textContent = '相关条目（按名称匹配，非医学等效）';
      container.append(title);
      const wrap = document.createElement('div');
      wrap.className = 'relation-chips';
      list.forEach(item => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'relation-chip';
        const kindSpan = document.createElement('span');
        kindSpan.className = 'relation-kind';
        kindSpan.textContent = KIND_LABEL[item.type] || item.type;
        const labelSpan = document.createElement('span');
        labelSpan.textContent = item.label || item.id;
        button.append(kindSpan, labelSpan);
        button.title = item.basis || '';
        button.addEventListener('click', () => open(item.type, item.id, item.label));
        wrap.append(button);
      });
      container.append(wrap);
    });
  }

  window.Relations = { load, items, open, render };
})();

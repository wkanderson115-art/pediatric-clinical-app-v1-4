'use strict';
/* V1.10 离线书库 2.0：
 * - 按「书 → 系统 → 章」三级浏览（chapters.json / system_map.json）
 * - 检索走后端打分排序（章名命中加权），可叠加 书/系统/章 过滤
 * - 每条命中显示 书名 · 系统 · 章 · 页，点击直接跳到原文位置
 * 检索结果只是原书片段，不代表用药或诊断结论。 */
(() => {
  const el = id => document.getElementById(id);
  const state = {
    books: [], chapterBooks: {}, systems: [], unmapped: [],
    filter: { book: '', system: '', chapter: '' },
    query: '', current: null, offset: 0, pageSize: 20,
    chunks: new Map(), chunkMap: new Map(),
  };

  const node = (tag, text, cls) => {
    const e = document.createElement(tag);
    if (text !== undefined && text !== null) e.textContent = String(text);
    if (cls) e.className = cls;
    return e;
  };
  const load = path => LocalData.load(path);

  async function loadBooks() {
    try {
      const data = await load('/library/books.json');
      state.books = Array.isArray(data.books) ? data.books : [];
    } catch { state.books = []; }
    try {
      const extra = await load('/library/chapters.json');
      state.chapterBooks = extra.books || {};
    } catch { state.chapterBooks = {}; }
    try {
      const map = await load('/library/system_map.json');
      state.systems = map.systems || [];
      state.unmapped = map.unmapped || [];
    } catch { state.systems = []; state.unmapped = []; }
    renderShelf();
    renderFilters();
    renderChapters();
  }

  function renderShelf() {
    const root = el('library-shelf');
    if (!root) return;
    root.replaceChildren();
    if (!state.books.length) {
      root.append(node('p', '书库还没有电子书。把书放进 data/library/raw/ 后运行 python tools/import_library.py --scan。', 'empty'));
      return;
    }
    state.books.forEach(book => {
      const card = node('button', undefined, 'library-book');
      card.type = 'button';
      const chapterCount = (state.chapterBooks[book.id] || {}).chapters || [];
      card.append(node('strong', book.title));
      card.append(node('small', [book.authors, book.publisher, book.year].filter(Boolean).join(' · ') || '元数据未填'));
      card.append(node('span', (book.chunks || 0) + ' 块 · ' +
        ((book.chars || 0) / 10000).toFixed(1) + ' 万字' +
        (chapterCount.length ? ' · ' + chapterCount.length + ' 章' : ''), 'library-meta'));
      if (book.status) card.append(node('span', book.status, 'library-status'));
      card.addEventListener('click', () => openChapter(book.id, 0));
      root.append(card);
    });
  }

  function systemName(id) {
    const hit = state.systems.find(s => s.id === id);
    return hit ? hit.name : '';
  }

  function renderFilters() {
    const bookSelect = el('library-book-filter');
    if (bookSelect) {
      bookSelect.replaceChildren(node('option', '全部书'));
      bookSelect.firstChild.value = '';
      state.books.forEach(book => {
        const option = node('option', book.title);
        option.value = book.id;
        bookSelect.append(option);
      });
      bookSelect.value = state.filter.book;
      bookSelect.onchange = () => { state.filter = { ...state.filter, book: bookSelect.value, chapter: '' }; renderChapters(); search(); };
    }
    const systemSelect = el('library-system-filter');
    if (systemSelect) {
      systemSelect.replaceChildren(node('option', '全部系统'));
      systemSelect.firstChild.value = '';
      state.systems.forEach(system => {
        const count = (system.chapters || []).length;
        if (!count) return;
        const option = node('option', system.name + '（' + count + ' 章）');
        option.value = system.id;
        systemSelect.append(option);
      });
      systemSelect.value = state.filter.system;
      systemSelect.onchange = () => { state.filter = { ...state.filter, system: systemSelect.value, chapter: '' }; renderChapters(); search(); };
    }
  }

  function chaptersFor(filter) {
    const rows = [];
    Object.values(state.chapterBooks).forEach(book => {
      if (filter.book && book.id !== filter.book) return;
      (book.chapters || []).forEach(chapter => {
        if (filter.system && chapter.system !== filter.system) return;
        rows.push({ book, chapter });
      });
    });
    rows.sort((a, b) => (a.book.id === b.book.id ? a.chapter.no - b.chapter.no : a.book.id.localeCompare(b.book.id)));
    return rows;
  }

  function renderChapters() {
    const root = el('library-chapters');
    if (!root) return;
    root.replaceChildren();
    const rows = chaptersFor(state.filter);
    if (!rows.length) { root.append(node('p', '当前筛选下没有章节。', 'subtext')); return; }
    rows.forEach(({ book, chapter }) => {
      const button = node('button', undefined, 'library-chapter' + (state.filter.chapter === chapter.id ? ' selected' : ''));
      button.type = 'button';
      button.append(node('strong', chapter.title));
      button.append(node('small', [
        book.title, book.volume,
        chapter.start_page ? 'PDF 第 ' + chapter.start_page + '–' + chapter.end_page + ' 页' : '',
        (chapter.chars ? (chapter.chars / 10000).toFixed(1) + ' 万字' : ''),
        systemName(chapter.system),
      ].filter(Boolean).join(' · ')));
      button.addEventListener('click', () => {
        state.filter.chapter = chapter.id;
        renderChapters();
        openChapter(book.id, chapter.chunk_start || 0);
      });
      root.append(button);
    });
  }

  async function chunksOf(bookId) {
    if (state.chunks.has(bookId)) return state.chunks.get(bookId);
    let chunks = [];
    try {
      const data = await load('/library/' + encodeURIComponent(bookId) + '.json');
      chunks = Array.isArray(data.chunks) ? data.chunks.map((c, i) => ({ i, p: c.p, t: c.t })) : [];
    } catch { chunks = []; }
    state.chunks.set(bookId, chunks);
    return chunks;
  }

  function mark(text, query) {
    const wrap = node('p');
    const q = query || '';
    const pos = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
    if (pos < 0) { wrap.textContent = text; return wrap; }
    wrap.append(document.createTextNode(text.slice(0, pos)),
      node('mark', text.slice(pos, pos + q.length)),
      document.createTextNode(text.slice(pos + q.length)));
    return wrap;
  }

  async function openChapter(bookId, chunkStart) {
    const book = state.books.find(b => b.id === bookId);
    if (!book) return;
    state.current = book;
    state.offset = Math.max(0, Math.floor(Number(chunkStart || 0) / state.pageSize) * state.pageSize);
    const reader = el('library-reader');
    if (reader) reader.hidden = false;
    el('library-reader-title').textContent = book.title;
    await renderChunks();
    if (window.setPage) window.setPage('library');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function highlight(text, query) {
    const wrap = node('p');
    const q = query || '';
    const pos = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
    if (pos < 0) { wrap.textContent = text; return wrap; }
    wrap.append(document.createTextNode(text.slice(0, pos)),
      node('mark', text.slice(pos, pos + q.length)),
      document.createTextNode(text.slice(pos + q.length)));
    return wrap;
  }

  async function renderChunks() {
    const book = state.current;
    if (!book) return;
    const root = el('library-chunks');
    root.replaceChildren();
    const chunks = await chunksOf(book.id);
    const page = chunks.slice(state.offset, state.offset + state.pageSize);
    el('library-position').textContent = chunks.length
      ? `第 ${Math.min(state.offset + 1, chunks.length)}–${Math.min(state.offset + page.length, chunks.length)} 块 / 共 ${chunks.length} 块`
      : '该书还没有文本';
    page.forEach(chunk => {
      const article = node('article', undefined, 'library-chunk');
      article.append(node('div', chunk.p, 'library-locator'));
      article.append(highlight(String(chunk.t || ''), state.query));
      root.append(article);
    });
    el('library-prev').disabled = state.offset <= 0;
    el('library-next').disabled = state.offset + state.pageSize >= chunks.length;
  }

  function groupCard(group, query) {
    const card = node('article', undefined, 'library-hit library-group');
    const meta = [
      group.book_title,
      group.system ? systemName(group.system) : '',
      group.chapter_title || '',
      (group.sections && group.sections[0]) || '',
    ].filter(Boolean).join(' · ');
    card.append(node('small', meta + ' · 命中 ' + group.count + ' 处', 'library-hit-book'));

    const details = node('details', undefined, 'library-group-details');
    const summary = node('summary', '查看 ' + (group.snippets || []).length + ' 条片段');
    details.append(summary);
    (group.snippets || []).forEach(snippet => {
      const button = node('button', undefined, 'library-group-snippet');
      button.type = 'button';
      button.append(node('small', snippet.locator, 'library-hit-book'));
      button.append(mark(snippet.snippet || '', query));
      button.addEventListener('click', () => openChapter(group.book_id, snippet.chunk));
      details.append(button);
    });
    card.append(details);

    const jump = node('button', '跳到本章开头 ›', 'outline-button');
    jump.type = 'button';
    jump.addEventListener('click', () => openChapter(group.book_id, group.first_chunk));
    card.append(jump);
    return card;
  }

  function hitCard(item, query) {
    const card = node('button', undefined, 'library-hit');
    card.type = 'button';
    const meta = [
      item.book_title,
      item.system ? systemName(item.system) : '',
      item.chapter_title,
      item.locator,
    ].filter(Boolean).join(' · ');
    card.append(node('small', meta, 'library-hit-book'));
    card.append(mark(item.snippet || '', query));
    card.addEventListener('click', () => openChapter(item.book_id, item.chunk));
    return card;
  }

  async function search() {
    const input = el('library-query');
    const query = input ? input.value.trim() : '';
    state.query = query;
    const root = el('library-results');
    const count = el('library-count');
    if (!root) return;
    root.replaceChildren();
    if (!query) { if (count) count.textContent = ''; return; }

    const params = new URLSearchParams({ q: query, page_size: '20' });
    if (state.filter.book) params.set('book', state.filter.book);
    if (state.filter.system) params.set('system', state.filter.system);
    if (state.filter.chapter) params.set('chapter', state.filter.chapter);

    try {
      const response = await fetch('/api/library/search?' + params.toString());
      if (!response.ok) throw Error('HTTP ' + response.status);
      const data = await response.json();
      if (count) {
        const names = (data.facets && data.facets.books || []).map(b => b.title + ' ' + b.count).join('、');
        const extra = (data.expanded && data.expanded.length)
          ? ' · 已扩展：' + data.expanded.slice(0, 4).join('、') : '';
        count.textContent = '命中 ' + data.total + ' 处' + (names ? '（' + names + '）' : '') + extra;
      }
      if (!data.total) { root.append(node('p', '没有命中。尝试更短的通用词（如「肺炎」「低钠」），或切换系统/章节筛选。', 'empty')); return; }
      const groups = data.groups || [];
      if (groups.length) {
        groups.forEach(group => root.append(groupCard(group, query)));
        return;
      }
      data.items.forEach(item => root.append(hitCard(item, query)));
      return;
    } catch { /* 离线回落 */ }

    const chapterRows = chaptersFor(state.filter);
    let total = 0;
    const cards = [];
    for (const { book, chapter } of chapterRows) {
      if (state.filter.chapter && chapter.id !== state.filter.chapter) continue;
      const chunks = await chunksOf(book.id);
      for (let i = chapter.chunk_start; i <= chapter.chunk_end && i < chunks.length; i++) {
        const text = String(chunks[i].t || '');
        const pos = text.toLowerCase().indexOf(query.toLowerCase());
        if (pos < 0) continue;
        total += 1;
        if (cards.length < 30) {
          cards.push({
            book_id: book.id, book_title: book.title, chunk: i,
            locator: chunks[i].p, chapter_title: chapter.title,
            system: chapter.system,
            snippet: text.slice(Math.max(0, pos - 60), pos + query.length + 60),
          });
        }
      }
    }
    if (count) count.textContent = '命中 ' + total + ' 处（离线本地检索）';
    if (!cards.length) { root.append(node('p', '没有命中。', 'empty')); return; }
    cards.forEach(item => root.append(hitCard(item, query)));
  }

  function bind() {
    const form = el('library-form');
    if (form) form.addEventListener('submit', event => { event.preventDefault(); search(); });
    const input = el('library-query');
    if (input) {
      let timer = null;
      input.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(search, 260); });
    }
    const prev = el('library-prev');
    const next = el('library-next');
    if (prev) prev.addEventListener('click', async () => { state.offset = Math.max(0, state.offset - state.pageSize); await renderChunks(); });
    if (next) next.addEventListener('click', async () => { state.offset += state.pageSize; await renderChunks(); });
    const close = el('library-close');
    if (close) close.addEventListener('click', () => { el('library-reader').hidden = true; state.current = null; });
    loadBooks();
  }

  window.Library = { loadBooks, search, openChapter, openBook: openChapter };
  bind();
})();

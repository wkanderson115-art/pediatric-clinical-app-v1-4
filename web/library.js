'use strict';
/* V1.7 离线书库：读取 /library/books.json 与 /library/<id>.json（PWA 静态副本），
 * 没有后端也能本地检索；有后端时优先用 /api/library/search。
 * 书是用户自己导入的电子书，检索结果只是原文片段，不代表医学结论。 */
(() => {
  const el = id => document.getElementById(id);
  const state = { books: [], chunks: new Map(), current: null, offset: 0, pageSize: 20, query: '' };

  const node = (tag, text, cls) => {
    const e = document.createElement(tag);
    if (text !== undefined && text !== null) e.textContent = String(text);
    if (cls) e.className = cls;
    return e;
  };
  const esc = s => String(s || '');

  async function json(path) {
    return LocalData.load(path);
  }

  async function loadBooks() {
    try {
      const data = await json('/library/books.json');
      state.books = Array.isArray(data.books) ? data.books : [];
    } catch {
      state.books = [];
    }
    renderShelf();
  }

  function renderShelf() {
    const root = el('library-shelf');
    if (!root) return;
    root.replaceChildren();
    if (!state.books.length) {
      root.append(node('p', '书库里还没有电子书。把自备的 txt / md / epub / pdf 放到 data/library/raw/，执行 python tools/import_library.py --scan 后刷新即可。', 'empty'));
      return;
    }
    state.books.forEach(book => {
      const card = node('button', undefined, 'library-book');
      card.type = 'button';
      card.append(node('strong', esc(book.title)));
      card.append(node('small', [book.authors, book.publisher, book.year].filter(Boolean).join(' · ') || '元数据未填'));
      card.append(node('span', (book.chunks || 0) + ' 块 · ' + ((book.chars || 0) / 10000).toFixed(1) + ' 万字', 'library-meta'));
      card.addEventListener('click', () => openBook(book.id));
      root.append(card);
    });
  }

  async function chunksOf(bookId) {
    if (state.chunks.has(bookId)) return state.chunks.get(bookId);
    let chunks = [];
    try {
      const data = await json('/library/' + encodeURIComponent(bookId) + '.json');
      chunks = Array.isArray(data.chunks) ? data.chunks : [];
    } catch {
      chunks = [];
    }
    state.chunks.set(bookId, chunks);
    return chunks;
  }

  function highlight(text, query) {
    const wrap = node('p');
    if (!query) { wrap.textContent = text; return wrap; }
    const pos = text.indexOf(query);
    if (pos < 0) { wrap.textContent = text; return wrap; }
    const before = text.slice(0, pos);
    const mark = node('mark', text.slice(pos, pos + query.length));
    const after = text.slice(pos + query.length);
    wrap.append(document.createTextNode(before), mark, document.createTextNode(after));
    return wrap;
  }

  async function openBook(bookId) {
    const book = state.books.find(b => b.id === bookId);
    if (!book) return;
    state.current = book;
    state.offset = 0;
    el('library-reader').hidden = false;
    el('library-reader-title').textContent = book.title;
    await renderChunks();
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      article.append(highlight(esc(chunk.t), state.query));
      root.append(article);
    });
    el('library-prev').disabled = state.offset <= 0;
    el('library-next').disabled = state.offset + state.pageSize >= chunks.length;
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

    // 1) 有后端就走接口（更快，带定位）
    try {
      const data = await json('/api/library/search?q=' + encodeURIComponent(query));
      if (count) count.textContent = '命中 ' + data.total + ' 处（' + data.displayed_books + ' 本书）';
      if (!data.total) { root.append(node('p', '没有命中。可换更短的关键词，或先导入更多书。', 'empty')); return; }
      data.items.forEach(hit => root.append(hitCard(hit.book_title, hit.locator, hit.snippet, hit.book_id, hit.chunk, query)));
      return;
    } catch {
      /* 离线：走本地 */
    }

    // 2) 离线：逐书线性匹配（首次会下载该书 JSON，之后缓存）
    let total = 0;
    const cards = [];
    for (const book of state.books) {
      const chunks = await chunksOf(book.id);
      for (const chunk of chunks) {
        const text = esc(chunk.t);
        const pos = text.indexOf(query);
        if (pos < 0) continue;
        total += 1;
        if (cards.length < 30) {
          cards.push(hitCard(book.title, chunk.p, text.slice(Math.max(0, pos - 30), pos + query.length + 50), book.id, chunk.i, query));
        }
      }
    }
    if (count) count.textContent = '命中 ' + total + ' 处（离线本地检索）';
    if (!cards.length) { root.append(node('p', '没有命中。', 'empty')); return; }
    cards.forEach(c => root.append(c));
  }

  function hitCard(bookTitle, locator, snippet, bookId, chunkIndex, query) {
    const card = node('button', undefined, 'library-hit');
    card.type = 'button';
    card.append(node('small', bookTitle + ' · ' + (locator || ''), 'library-hit-book'));
    card.append(highlight(esc(snippet), query));
    card.addEventListener('click', async () => {
      await openBook(bookId);
      state.offset = Math.max(0, Math.floor(Number(chunkIndex || 0) / state.pageSize) * state.pageSize);
      await renderChunks();
    });
    return card;
  }

  function bind() {
    const form = el('library-form');
    if (form) form.addEventListener('submit', e => { e.preventDefault(); search(); });
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

  window.Library = { loadBooks, search, openBook };
  bind();
})();

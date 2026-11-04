'use strict';
/* V1.10 学习页「原书章节索引」：把已导入电子书的章节按 17 个学习系统归类展示。
 * 数据来自 /library/system_map.json（tools/build_chapters.py 生成），点击跳书库原文。 */
(() => {
  const el = id => document.getElementById(id);
  const node = (tag, text, cls) => {
    const e = document.createElement(tag);
    if (text !== undefined && text !== null) e.textContent = String(text);
    if (cls) e.className = cls;
    return e;
  };

  async function render() {
    const root = el('study-books');
    if (!root) return;
    let map;
    try { map = await LocalData.load('/library/system_map.json'); } catch { return; }
    const systems = (map.systems || []).filter(s => (s.chapters || []).length);
    root.replaceChildren();
    if (!systems.length) {
      root.append(node('p', '还没有按系统归类的章节：先导入电子书并运行 python tools/build_chapters.py。', 'empty'));
      return;
    }
    systems.forEach(system => {
      const details = node('details', undefined, 'study-book-group');
      const summary = node('summary');
      const totalChars = system.chapters.reduce((sum, c) => sum + (c.chars || 0), 0);
      summary.append(node('strong', system.name));
      summary.append(node('span', ' ' + system.chapters.length + ' 章 · ' + (totalChars / 10000).toFixed(1) + ' 万字', 'study-book-meta'));
      details.append(summary);
      const list = node('div', 'study-book-list');
      system.chapters.forEach(chapter => {
        const button = node('button', undefined, 'study-book-chapter');
        button.type = 'button';
        button.append(node('strong', chapter.title));
        button.append(node('small', [chapter.book_title, 'PDF 第 ' + chapter.pages + ' 页'].filter(Boolean).join(' · ')));
        button.addEventListener('click', async () => {
          if (window.Library && window.Library.openChapter) {
            await window.Library.openChapter(chapter.book_id, chapter.chunk_start || 0);
          }
        });
        list.append(button);
      });
      details.append(list);
      root.append(details);
    });
    if ((map.unmapped || []).length) {
      const details = node('details', undefined, 'study-book-group');
      const summary = node('summary');
      summary.append(node('strong', '未归类章节'));
      summary.append(node('span', ' ' + map.unmapped.length + ' 章', 'study-book-meta'));
      details.append(summary);
      const list = node('div', 'study-book-list');
      map.unmapped.forEach(chapter => {
        const button = node('button', undefined, 'study-book-chapter');
        button.type = 'button';
        button.append(node('strong', chapter.title));
        button.append(node('small', [chapter.book_title, 'PDF 第 ' + chapter.pages + ' 页'].filter(Boolean).join(' · ')));
        button.addEventListener('click', () => {
          if (window.Library && window.Library.openChapter) window.Library.openChapter(chapter.book_id, chapter.chunk_start || 0);
        });
        list.append(button);
      });
      details.append(list);
      root.append(details);
    }
  }

  window.StudyBooks = { render };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();

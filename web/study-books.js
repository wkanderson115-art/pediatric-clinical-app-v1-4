'use strict';
/* V1.13 学习板块「原书精读」：诸福棠第9版上下册按 17 个学习系统归类的章节与小节导航。
 * 数据来自 /learning_books.json（tools/build_learning_from_books.py 生成）：
 *   系统 → 章节（页区间 / 字数 / 原书概述）→ 小节标题（点击跳书库正文块）。
 * 概述为原书真实段落（OCR 可能有错字），临床核对请回原书。 */
(() => {
  const el = id => document.getElementById(id);
  const node = (tag, text, cls) => {
    const e = document.createElement(tag);
    if (text !== undefined && text !== null) e.textContent = String(text);
    if (cls) e.className = cls;
    return e;
  };
  const fmt = n => (n >= 10000 ? (n / 10000).toFixed(1) + ' 万' : String(n));

  function jump(bookId, chunk) {
    if (window.Library && window.Library.openChapter) {
      window.Library.openChapter(bookId, chunk || 0);
    } else if (window.setPage) {
      window.setPage('library');
    }
  }

  function chapterCard(chapter) {
    const card = node('article', undefined, 'study-book-chapter-card');
    const head = node('div', undefined, 'study-book-chapter-head');
    head.append(node('strong', chapter.title));
    head.append(node('span', [chapter.book_title, 'PDF 第 ' + chapter.page_range + ' 页',
      fmt(chapter.chars) + ' 字'].filter(Boolean).join(' · '), 'study-book-meta'));
    card.append(head);

    if (chapter.overview) {
      const details = node('details', undefined, 'study-book-overview');
      details.append(node('summary', '原书概述（展开）'));
      details.append(node('p', chapter.overview, 'study-book-overview-text'));
      card.append(details);
    }

    const sections = chapter.sections || [];
    if (sections.length) {
      const list = node('div', undefined, 'study-book-sections');
      const render = limit => {
        list.replaceChildren();
        sections.slice(0, limit).forEach(section => {
          const button = node('button', section.title, 'study-book-section');
          button.type = 'button';
          button.title = section.locator || '';
          button.addEventListener('click', () => jump(chapter.book_id, section.chunk));
          list.append(button);
        });
        if (sections.length > limit) {
          const more = node('button', '显示全部 ' + sections.length + ' 小节 ›', 'study-book-more');
          more.type = 'button';
          more.addEventListener('click', () => render(sections.length));
          list.append(more);
        }
      };
      render(12);
      card.append(list);
    } else {
      card.append(node('p', '本章没有可导航的小节。', 'subtext'));
    }
    return card;
  }

  async function render() {
    const root = el('study-books');
    if (!root) return;
    let data;
    try { data = await LocalData.load('/learning_books.json'); } catch { return; }

    const systems = (data.systems || []).filter(s => (s.chapters || []).length);
    root.replaceChildren();

    const summary = el('study-books-summary');
    if (summary) {
      summary.textContent = `${(data.systems || []).length} 个系统 · ${data.total_chapters} 章 · ` +
        `${data.total_sections} 小节 · 摘要与导航可离线使用`;
    }
    if (!systems.length) {
      root.append(node('p', '还没有原书内容：导入电子书后运行 python tools/build_learning_from_books.py。', 'empty'));
      return;
    }

    systems.forEach(system => {
      const details = node('details', undefined, 'study-book-group');
      const head = node('summary');
      head.append(node('strong', system.name));
      head.append(node('span', ` ${system.chapters.length} 章 · ${system.section_count} 小节 · ${fmt(system.chars)} 字`, 'study-book-meta'));
      details.append(head);
      const body = node('div', 'study-book-list');
      system.chapters.forEach(chapter => body.append(chapterCard(chapter)));
      details.append(body);
      root.append(details);
    });
  }

  window.StudyBooks = { render };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', render);
  else render();
})();

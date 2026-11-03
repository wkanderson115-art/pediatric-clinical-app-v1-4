'use strict';
/* 本地数据加载器：优先用内联数据（window.__DATA__），再退回 fetch / XHR / 动态内联脚本。
 * 起因：iOS 壳用 pediatric:// 自定义 scheme，WKWebView 里 fetch 该 scheme 可能直接失败，
 * 导致离线药典、离线书库、化验区间“搜不出东西”。内联 script 是可靠通道。 */
(() => {
  const cache = new Map();

  function keyOf(path) {
    return String(path || '').replace(/^\/+/, '');
  }

  function inlineName(key) {
    return '/inline-data/' + key.replace(/\.json$/, '').replace(/[^A-Za-z0-9_.-]+/g, '__') + '.js';
  }

  function fromInline(key) {
    const bag = window.__DATA__;
    if (!bag) return undefined;
    if (Object.prototype.hasOwnProperty.call(bag, key)) return bag[key];
    return undefined;
  }

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(Error('script load failed: ' + src));
      document.head.append(script);
    });
  }

  async function fetchJson(path) {
    const r = await fetch(path, { cache: 'no-store' });
    if (!r.ok) throw Error('HTTP ' + r.status);
    return r.json();
  }

  function xhrJson(path) {
    return new Promise((resolve, reject) => {
      try {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', path, true);
        xhr.onload = () => {
          if (xhr.status && xhr.status >= 400) { reject(Error('HTTP ' + xhr.status)); return; }
          try { resolve(JSON.parse(xhr.responseText)); } catch (e) { reject(e); }
        };
        xhr.onerror = () => reject(Error('xhr error'));
        xhr.send();
      } catch (e) { reject(e); }
    });
  }

  async function load(path) {
    const key = keyOf(path);
    if (cache.has(key)) return cache.get(key);
    const inline = fromInline(key);
    if (inline !== undefined) { cache.set(key, inline); return inline; }
    for (const attempt of [() => fetchJson(path), () => xhrJson(path), async () => {
      await loadScript(inlineName(key));
      const data = fromInline(key);
      if (data === undefined) throw Error('inline missing: ' + key);
      return data;
    }]) {
      try {
        const data = await attempt();
        cache.set(key, data);
        return data;
      } catch (e) { /* 试下一种通道 */ }
    }
    throw Error('无法载入本地数据：' + key);
  }

  function has(key) { return fromInline(keyOf(key)) !== undefined; }

  window.LocalData = { load, has, keyOf };
})();

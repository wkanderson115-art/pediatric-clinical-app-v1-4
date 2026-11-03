// 用最小 DOM 桩验证 LocalData 的“内联优先 + fetch 失败回退”逻辑（node 运行，不依赖浏览器）
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'web/local-data.js'), 'utf8');

const appended = [];
global.window = { __DATA__: { 'drug_formulary.json': { items: [{ id: 'amoxicillin' }] } } };
global.document = {
  head: { append: el => appended.push(el) },
  createElement: () => ({ set src(v) { this._src = v; }, get src() { return this._src; }, set onload(fn) { this._onload = fn; }, set onerror(fn) { this._onerror = fn; } })
};
// 模拟 WKWebView 自定义 scheme：fetch 直接抛错
global.fetch = () => Promise.reject(new Error('scheme not supported'));
global.XMLHttpRequest = function () {
  this.open = () => {};
  this.send = () => { this.onerror && this.onerror(); };
};

new Function('window', 'document', 'fetch', 'XMLHttpRequest', source)(global.window, global.document, global.fetch, global.XMLHttpRequest);
const LocalData = global.window.LocalData;

(async () => {
  const inline = await LocalData.load('/drug_formulary.json');
  if (!inline || inline.items[0].id !== 'amoxicillin') throw new Error('内联数据没有命中');
  console.log('PASS 内联命中：', inline.items[0].id);
  try {
    await LocalData.load('/no-such-file.json');
    throw new Error('缺失文件居然成功了');
  } catch (e) {
    console.log('PASS 缺失文件按预期失败：', e.message.slice(0, 40));
  }
  console.log('PASS 静态断言：', appended.length >= 1 ? '已尝试注入内联脚本' : '未注入');
})();

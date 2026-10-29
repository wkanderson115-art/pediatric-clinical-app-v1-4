// 缓存UI壳层，不缓存药品说明书API、结果和医学剂量，避免旧数据误用。
const CACHE='pediatric-cn-shell-v1.4.1-direct';
const ASSETS=['/','/index.html','/style.css','/direct-api.js','/main.js','/learning.js','/learning.json','/clinical_extension.json','/clinical.js','/chart-review.js','/photo-ocr.js','/study-pro.js','/audit-workbench.js','/medical_audit.json','/secure-backup.js','/iv-review.js','/quiz_cases.json','/virtual-patient.js','/admin-ui.js','/simulation_cases.json','/source_registry.json','/icon-192.png','/icon-512.png','/manifest.webmanifest'];
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET'||new URL(event.request.url).pathname.startsWith('/api/'))return;event.respondWith(fetch(event.request).catch(()=>caches.match(event.request)))});

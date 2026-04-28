// BudgetFlow Service Worker
const CACHE = 'budgetflow-v3';
const STATIC = [
  '/', '/index.html', '/style.css',
  '/app.jsx', '/alphaVantageService.js',
  '/manifest.json', '/icons/icon-192.png', '/icons/icon-512.png',
];

self.addEventListener('install', function(e) {
  e.waitUntil(caches.open(CACHE).then(function(c) { return c.addAll(STATIC); }));
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.filter(function(k){return k!==CACHE;}).map(function(k){return caches.delete(k);}));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Alpha Vantage API: solo network (dati real-time)
  if (e.request.url.includes('alphavantage.co')) return;

  e.respondWith(
    caches.match(e.request).then(function(cached) {
      if (cached) return cached;
      return fetch(e.request).then(function(res) {
        if (res && res.status === 200 && e.request.method === 'GET') {
          caches.open(CACHE).then(function(c) { c.put(e.request, res.clone()); });
        }
        return res;
      }).catch(function() {
        if (e.request.mode === 'navigate') return caches.match('/index.html');
      });
    })
  );
});

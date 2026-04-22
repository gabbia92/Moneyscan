// BudgetFlow Service Worker
// Caches le risorse statiche per funzionare offline

const CACHE_NAME = 'budgetflow-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  '/app.jsx',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  // CDN resources cached on first load
  'https://unpkg.com/react@18/umd/react.production.min.js',
  'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
  'https://unpkg.com/@babel/standalone/babel.min.js',
];

// Install: cache all static assets
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      // Cache local assets immediately, CDN assets best-effort
      var localAssets = STATIC_ASSETS.filter(function(url) {
        return !url.startsWith('https://');
      });
      var cdnAssets = STATIC_ASSETS.filter(function(url) {
        return url.startsWith('https://');
      });

      return cache.addAll(localAssets).then(function() {
        // CDN assets: try to cache, don't fail install if unavailable
        return Promise.allSettled(
          cdnAssets.map(function(url) {
            return cache.add(url).catch(function(err) {
              console.warn('Could not cache CDN asset:', url, err);
            });
          })
        );
      });
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys
          .filter(function(key) { return key !== CACHE_NAME; })
          .map(function(key) { return caches.delete(key); })
      );
    })
  );
  self.clients.claim();
});

// Fetch: cache-first for static assets, network-first for API calls
self.addEventListener('fetch', function(event) {
  var url = event.request.url;

  // Yahoo Finance API: network only (no caching, real-time data)
  if (url.includes('finance.yahoo.com') || url.includes('query1.finance.yahoo.com')) {
    return; // Let it pass through to network
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;

      return fetch(event.request).then(function(response) {
        // Cache successful GET responses
        if (response && response.status === 200 && event.request.method === 'GET') {
          var responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }).catch(function() {
        // Offline fallback: return cached index.html for navigation
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

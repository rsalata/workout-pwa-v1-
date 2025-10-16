
const CACHE = 'workout-pwa-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.webmanifest',
  './sw.js',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => k !== CACHE && caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET
  if (request.method !== 'GET') return;

  // App shell: cache-first
  if (ASSETS.includes(url.pathname.replace(/.*\//, './'))) {
    event.respondWith(
      caches.match(request).then(cached => cached || fetch(request))
    );
    return;
  }

  // HTML navigation requests: network-first with fallback to cache
  if (request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then(res => {
          const resClone = res.clone();
          caches.open(CACHE).then(cache => cache.put(request, resClone));
          return res;
        })
        .catch(() => caches.match(request).then(c => c || caches.match('./index.html')))
    );
    return;
  }

  // Others: cache-first, then network
  event.respondWith(
    caches.match(request).then(cached => cached || fetch(request))
  );
});

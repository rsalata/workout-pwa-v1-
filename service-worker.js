const CACHE_NAME = 'workout-app-cache-v1';
const urlsToCache = [
  '/',
  '/Lattest-Full-Workout-App-4-17-25_v2.html',
  '/manifest.json',
  '/icon.png'
  // Add CSS, JS, or other assets
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

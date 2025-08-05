const CACHE_NAME = 'workout-tracker-v1';
const URLS = [
    '/',
    '/index.html',
    // Add other files like styles.css if used
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(URLS))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => response || fetch(event.request))
    );
});

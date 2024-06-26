// Static cache name
const staticCacheName = 'egg-quality-analysis-v1';

// Assets to cache
const assets = [
  '/',
  '/static/styles.css',
  '/static/scripts.js',
  '/static/pix1.jpg',
  '/static/pic4.jpg',
  '/static/pic5.jpg',
  '/static/pic3.jpg',
  '/static/pic7.jpg',
  '/predict'
  // Add other paths and assets your app uses
];

// Install service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => cache.addAll(assets))
  );
});

// Activate service worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.filter(cacheName => cacheName.startsWith('egg-quality-analysis') && cacheName !== staticCacheName)
            .map(cacheName => caches.delete(cacheName))
        );
      })
  );
});

// Fetch from cache or network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

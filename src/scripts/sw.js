/* service-worker.js */

// Cache names
const STATIC_CACHE = 'static-cache-v1';
const API_CACHE = 'api-cache-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './styles/main.css', // Pastikan ini sesuai dengan proyek Anda
  './scripts/index.js',
  './images/uil--favorite.svg',
  './images/uim--favorite.svg',
  './images/weui--back-filled.svg',
];

// Install event: Cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

// Activate event: Cleanup old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (![STATIC_CACHE, API_CACHE].includes(cache)) {
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch event: Respond with cache first, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin === location.origin) {
    // Handle static assets
    event.respondWith(
      caches.match(request).then((cachedResponse) =>
        cachedResponse || fetch(request)
      )
    );
  } else if (url.hostname === 'restaurant-api.dicoding.dev') {
    // Handle API requests
    event.respondWith(
      caches.open(API_CACHE).then((cache) =>
        fetch(request)
          .then((response) => {
            cache.put(request, response.clone());
            return response;
          })
          .catch(() => caches.match(request))
      )
    );
  }
});

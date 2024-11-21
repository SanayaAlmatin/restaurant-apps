// service-worker.js

// Cache names
const STATIC_CACHE = "static-cache-v1";
const API_CACHE = "api-cache-v1";

// Daftar aset statis yang akan dicache
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./styles/main.css", // Pastikan ini sesuai dengan proyek Anda
  "./scripts/index.js",
  "./images/icons_app/icons-256.svg",
  "./images/icons_app/icons-512.svg",
  "./images/uil--favorite.svg",
  "./images/uim--favorite.svg",
  "./images/weui--back-filled.svg",
];

// Install event: Cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log("Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event: Cleanup old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cache) => {
          if (![STATIC_CACHE, API_CACHE].includes(cache)) {
            console.log(`Deleting old cache: ${cache}`);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Fetch event: Respond with cache first, fallback to network
self.addEventListener("fetch", (event) => {
  const {
    request
  } = event;
  const url = new URL(request.url);

  if (url.origin === location.origin) {
    // Tangani permintaan untuk aset statis
    event.respondWith(
      caches
      .match(request)
      .then((cachedResponse) => cachedResponse || fetch(request))
    );
  } else if (url.hostname === "restaurant-api.dicoding.dev") {
    // Tangani permintaan API
    event.respondWith(
      caches.open(API_CACHE).then(
        (cache) =>
        fetch(request)
        .then((response) => {
          // Hanya cache jika responsnya OK
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => caches.match(request)) // Jika fetch gagal, coba ambil dari cache
      )
    );
  }
});
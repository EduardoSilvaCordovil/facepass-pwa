const CACHE_NAME = "facepass-v1";
const DATA_CACHE = 'data-cache-v1';

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll([
        "/",
        "/index.html",
        "www/css/custom.css",
        "www/js/my-app.js",
        "www/js/indexedDB.js",
        "www/js/dataLoader.js",
        "www/js/facialRecognition.js",
      ]);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.match(event.request).then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request).then(function (networkResponse) {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      });
    })
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Se for uma solicitação de chunk de dados
  if (url.pathname.includes('/api/presos-data/chunk/')) {
    event.respondWith(
      caches.open(DATA_CACHE).then(cache => {
        return fetch(event.request).then(response => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    );
    return;
  }
  // Para outras solicitações
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
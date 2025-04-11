const CACHE_NAME = "facepass-v1";

self.addEventListener("install", function (event) {
  console.log('Service Worker installing...');

  const filesToCache = [
    "./",
    "./manifest.json",
    "./index.html",
    "./css/custom.css",
    "./js/my-app.js",
    "./js/indexedDb.js",
  ];

  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      console.log('Cache aberto');

      const cachePromises = filesToCache.map(url => {

        return cache.add(url).catch(error => {
          console.log('Falha ao adicionar ao cache:', url, error);

          return Promise.resolve();
        });
      });

      return Promise.all(cachePromises);
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      if (response) {
        return response;
      }

      return fetch(event.request).catch(function () {
        console.log('Falha ao buscar:', event.request.url);

      });
    })
  );
});

self.addEventListener('activate', function (event) {
  console.log('Service Worker activating...');

  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.filter(function (cacheName) {
          return cacheName.startsWith('facepass-') && cacheName !== CACHE_NAME;
        }).map(function (cacheName) {
          console.log('Removendo cache antigo:', cacheName);
          return caches.delete(cacheName);
        })
      );
    })
  );
});

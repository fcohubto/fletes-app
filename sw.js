// FleteApp — Service Worker
const CACHE_NAME = 'fleteapp-v4';

const ASSETS = [
  '/fletes-app/',
  '/fletes-app/index.html',
  '/fletes-app/css/styles.css',
  '/fletes-app/js/app.js',
  '/fletes-app/js/catalog.js',
  '/fletes-app/manifest.json',
  '/fletes-app/icons/icon-192.png',
  '/fletes-app/icons/icon-512.png',
];

// Instalación: pre-cachea todos los assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activación: elimina caches viejos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch: cache-first con fallback a red
self.addEventListener('fetch', event => {
  // Solo interceptar GET del mismo origen
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request)
      .then(cached => {
        if (cached) return cached;

        return fetch(event.request)
          .then(response => {
            // Guardar en cache si la respuesta es válida
            if (response && response.status === 200 && response.type === 'basic') {
              const clone = response.clone();
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
            }
            return response;
          })
          .catch(() => {
            // Sin red y sin cache: devolver index.html como fallback
            if (event.request.destination === 'document') {
              return caches.match('/fletes-app/index.html');
            }
          });
      })
  );
});

// Minimal service worker: enables "Add to Home Screen" / install on Android
// and caches the app shell so it opens instantly (data still comes live from Supabase).
// Path relatif terhadap lokasi sw.js, jadi tetap benar di subfolder GitHub Pages.
const CACHE_NAME = 'sistem-rab-shell-v2';
const SHELL_FILES = ['./', './index.html', './manifest.json'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_FILES)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for navigation/data, falling back to cache when offline.
// We intentionally do NOT cache Supabase API calls, so data is always live when online.
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // let Supabase/API calls pass through untouched
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

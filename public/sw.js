const VERSION = 'whaticket-pwa-v1';
const APP_SHELL = [
  '/', '/index.html', '/manifest.webmanifest',
  '/icons/icon-192.png', '/icons/icon-512.png', '/icons/maskable-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

async function networkFirst(req) {
  try {
    const fresh = await fetch(req);
    const cache = await caches.open(VERSION);
    cache.put(req, fresh.clone());
    return fresh;
  } catch (e) {
    const cached = await caches.match(req);
    return cached || Response.error();
  }
}

async function staleWhileRevalidate(req) {
  const cache = await caches.open(VERSION);
  const cached = await caches.match(req);
  const network = fetch(req).then(res => { cache.put(req, res.clone()); return res; }).catch(() => null);
  return cached || network || Response.error();
}

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.pathname.startsWith('/api') || url.hostname.includes('api.')) {
    return e.respondWith(networkFirst(e.request));
  }
  if (url.pathname.match(/\.(?:js|css|woff2?|png|jpg|jpeg|svg|ico)$/)) {
    return e.respondWith(staleWhileRevalidate(e.request));
  }
  if (e.request.mode === 'navigate') {
    return e.respondWith(fetch(e.request).catch(() => caches.match('/index.html')));
  }
});

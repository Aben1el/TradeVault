/* TradeVault service worker — network-first, always fresh, offline-safe */
const CACHE = 'tv-cache-v3';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (e) => {
    e.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', (e) => {
    const url = new URL(e.request.url);
    if (e.request.method !== 'GET' || url.origin !== location.origin) return;
    e.respondWith((async () => {
        try {
            const fresh = await fetch(e.request);          // always try network first
            const cache = await caches.open(CACHE);
            cache.put(e.request, fresh.clone());
            return fresh;
        } catch (err) {
            const cached = await caches.match(e.request);  // offline fallback only
            if (cached) return cached;
            if (e.request.mode === 'navigate') return caches.match('index.html');
            return Response.error();
        }
    })());
});

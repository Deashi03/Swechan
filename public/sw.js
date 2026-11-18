/* Swechan service worker – offline support and fast word pictures.
 *
 * Strategy (kvalitetsplanen A3, 2026-11-19):
 *  - Navigations: network first (always the newest app when online), cached index.html offline.
 *  - Hashed build assets (assets/*): cache first in a cache that survives releases. A file name
 *    contains its content hash, so an unchanged chunk is never downloaded again. After each
 *    successful navigation, entries that are in neither the current nor the previous release's
 *    asset-list.json are removed (written by the build, see vite.config.ts).
 *  - Other same-origin files (animation scenes, photos, icons, manifest): stale-while-revalidate –
 *    served instantly from the cache and refreshed in the background.
 * The worker no longer changes per release, so the cache is never emptied by an update.
 * User data lives in IndexedDB and is never touched by the service worker. */
const ASSETS = 'swechan-assets';
const STATIC = 'swechan-static';
const KEEP = [ASSETS, STATIC];
const scopePath = new URL(self.registration.scope).pathname;
const isAsset = (url) => url.pathname.startsWith(scopePath + 'assets/');

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC).then((c) => c.addAll(['./', './index.html', './manifest.webmanifest', './icon.svg'])).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  // Remove the old per-release caches (swechan-v1 … swechan-v57) once.
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !KEEP.includes(k)).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

let pruned = false;
async function prune() {
  if (pruned) return;
  pruned = true;
  try {
    const res = await fetch('./asset-list.json', { cache: 'no-store' });
    if (!res.ok) return;
    const current = await res.json();
    const meta = await caches.open(STATIC);
    const prevRes = await meta.match('./__asset-list-previous');
    const previous = prevRes ? await prevRes.json() : [];
    const keep = new Set([...current, ...previous].map((f) => scopePath + f));
    const cache = await caches.open(ASSETS);
    for (const req of await cache.keys()) if (!keep.has(new URL(req.url).pathname)) await cache.delete(req);
    const lastRes = await meta.match('./__asset-list-current');
    const last = lastRes ? await lastRes.json() : [];
    if (JSON.stringify(last) !== JSON.stringify(current)) {
      await meta.put('./__asset-list-previous', new Response(JSON.stringify(last)));
      await meta.put('./__asset-list-current', new Response(JSON.stringify(current)));
    }
  } catch {
    pruned = false; // try again on the next navigation
  }
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          event.waitUntil(caches.open(STATIC).then((c) => c.put('./index.html', copy)).then(prune));
          return res;
        })
        .catch(() => caches.match('./index.html')),
    );
    return;
  }
  if (url.pathname.endsWith('/asset-list.json')) return; // always from the network
  if (isAsset(url)) {
    event.respondWith(
      caches.open(ASSETS).then((cache) => cache.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) cache.put(req, res.clone());
        return res;
      }))),
    );
    return;
  }
  event.respondWith(
    caches.open(STATIC).then((cache) => cache.match(req).then((hit) => {
      const update = fetch(req).then((res) => { if (res.ok) cache.put(req, res.clone()); return res; });
      if (hit) { event.waitUntil(update.catch(() => undefined)); return hit; }
      return update;
    })),
  );
});

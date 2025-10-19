import {manifest, version} from '@parcel/service-worker';
declare var self: ServiceWorkerGlobalScope;

function isCacheable(request:Request) {
  //const url = new URL(request.url);
  //return !url.pathname.endsWith(".json");
  return true
}

async function install() {
    const cache = await caches.open(version);
    await cache.addAll(manifest);
}
self.addEventListener('install', e => e.waitUntil(install()));
  
async function activate() {
    const keys = await caches.keys();
    await Promise.all(
      keys.map(key => key !== version && caches.delete(key))
    );
}
self.addEventListener('activate', e => e.waitUntil(activate()));

async function cacheFirstWithRefresh(request:Request) {
  if (!(request.url.indexOf('http') === 0)) return;
  const fetchResponsePromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(version);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  });

  return (await caches.match(request)) || (await fetchResponsePromise);
}

self.addEventListener("fetch", async (event) => {
  if (isCacheable(event.request)) {
    event.respondWith(await cacheFirstWithRefresh(event.request));
  }
});
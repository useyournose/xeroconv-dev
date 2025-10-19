import {manifest, version} from '@parcel/service-worker';
import { handleFilesPwa } from './js/handlefiles-pwa';
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

self.addEventListener("fetch", (event) => {
  if (isCacheable(event.request)) {
    event.respondWith(cacheFirstWithRefresh(event.request));
  }
});

self.addEventListener('fetch', (fetchEvent) => {
  if (fetchEvent.request.url.endsWith('/receive-files/') && fetchEvent.request.method === 'POST') {
    return fetchEvent.respondWith(
      (async () => {
        const formData = await fetchEvent.request.formData();
        const title = formData.get("title");
        const text = formData.get("text");
        const url = formData.get("url");
        const files = formData.getAll("xerofiles") as File[];
        if (files && files.length > 0) {
          handleFilesPwa(files)
        }    
        //const keys = await caches.keys();
        //const mediaCache = await caches.open(keys.filter((key) => key.startsWith('media'))[0]);
        //await mediaCache.put('shared-xerofile', new Response(image));
        return Response.redirect('./?share-target', 303);
      })(),
    );
  }
});
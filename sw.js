self.addEventListener("install", (event) => {
  console.log("Service Worker installed.");
  event.waitUntil(
    caches.open("static").then((cache) => {
      return cache.addAll([
        "/Center-Search/index.html",
        "/Center-Search/script.js",
        "/Center-Search/style.css",
        "/Center-Search/icons/icon-192x192.png",
        "/Center-Search/icons/icon-512x512.png"
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

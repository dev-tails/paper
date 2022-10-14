self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open("pages-v1").then(function (cache) {
      return cache.addAll([
        "/",
        "/index.html",
        "/js/pages.js",
        "/favicon.ico",
        "/site.webmanifest",
        "/apple-touch-icon.png",
        "/favicon-32x32.png",
        "/favicon-16x16.png",
        "/safari-pinned-tab.svg",
        "/android-chrome-192x192.png",
        "/android-chrome-512x512.png",
      ]);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // It can update the cache to serve updated content on the next request
      return cachedResponse || fetch(event.request);
    })
  );
});

const CACHE_NAME = "full-static-site-v1";

// Comprehensive list of assets to precache
const PRECACHE_URLS = [
  "/",
  "/offline",
  "/manifest.json",
  // Automatically add all JavaScript bundles
  "/_next/static/chunks/main.js",
  "/_next/static/chunks/pages/_app.js",
  "/_next/static/chunks/pages/index.js",

  // Add CSS files
  "/_next/static/css/main.css",

  // Static assets and icons
  "/offline-icons/icon-192x192.png",
  "/offline-icons/icon-512x512.png",

  // Offline data
  "/offline-data/products.json",
  "/offline-data/content.json",
];

// Install event - precache all static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Precaching static assets");
        return cache.addAll(PRECACHE_URLS);
      })
      .then(() => {
        // Force the waiting service worker to become active
        return self.skipWaiting();
      })
  );
});

// Activation event - clean up old caches
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter(
          (cacheName) => !currentCaches.includes(cacheName)
        );
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete);
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - comprehensive caching strategy
self.addEventListener("fetch", (event) => {
  // Skip chrome extensions and similar
  if (event.request.url.startsWith("chrome-extension")) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached response if found
      if (cachedResponse) {
        return cachedResponse;
      }

      // For dynamic requests, try network first
      return fetch(event.request)
        .then((response) => {
          // Check if we received a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone response for caching
          const responseToCache = response.clone();

          // Cache dynamic responses
          caches.open(CACHE_NAME).then((cache) => {
            // Only cache GET requests
            if (event.request.method === "GET") {
              cache.put(event.request, responseToCache);
            }
          });

          return response;
        })
        .catch(() => {
          // Fallback for completely offline state
          if (event.request.mode === "navigate") {
            return caches.match("/offline");
          }

          // Generic offline response
          return new Response("Offline", {
            status: 503,
            headers: { "Content-Type": "text/plain" },
          });
        });
    })
  );
});

// Push notification handler (optional)
self.addEventListener("push", (event) => {
  const title = "Offline App";
  const options = {
    body: event.data.text(),
    icon: "/offline-icons/icon-192x192.png",
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

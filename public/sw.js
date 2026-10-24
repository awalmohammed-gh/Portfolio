/* ==========================================================================
   Mohammed Awal Portfolio - Progressive Web App Service Worker
   Safe, crash-free caching strategies with offline resilience.
   ========================================================================== */

const CACHE_VERSION = 'portfolio-pwa-v1';
const STATIC_CACHE_NAME = `static-${CACHE_VERSION}`;
const DYNAMIC_CACHE_NAME = `dynamic-${CACHE_VERSION}`;

// Core assets to pre-cache on install for instant offline readiness
const PRECACHE_ASSETS = [
  '/',
  '/projects',
  '/contact',
  '/about',
  '/services',
  '/offline.html',
  '/manifest.json',
  '/icon.svg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-maskable-192x192.png',
  '/icons/icon-maskable-512x512.png',
  '/icons/apple-touch-icon.png',
  '/icons/shortcut-admin-192x192.png',
  '/icons/shortcut-admin.png',
  '/icons/shortcut-projects-192x192.png',
  '/icons/shortcut-projects.png',
  '/icons/shortcut-services-192x192.png',
  '/icons/shortcut-services.png',
  '/icons/shortcut-contact-192x192.png',
  '/icons/shortcut-contact.png'
];

// 1. INSTALL EVENT
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(STATIC_CACHE_NAME);
      // Use individual fetches with catch so a single missing asset won't abort installation
      await Promise.allSettled(
        PRECACHE_ASSETS.map(async (asset) => {
          try {
            const response = await fetch(asset, { cache: 'no-cache' });
            if (response.ok) {
              await cache.put(asset, response);
            }
          } catch (err) {
            console.warn(`[PWA SW] Precache skipped for: ${asset}`, err);
          }
        })
      );
      // Immediately activate updated service worker without waiting for old tabs to close
      await self.skipWaiting();
    })()
  );
});

// 2. ACTIVATE EVENT
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      // Purge old versions of caches
      const cacheKeys = await caches.keys();
      await Promise.all(
        cacheKeys.map((key) => {
          if (key !== STATIC_CACHE_NAME && key !== DYNAMIC_CACHE_NAME) {
            return caches.delete(key);
          }
          return null;
        })
      );
      // Take control of all open clients immediately
      await self.clients.claim();
    })()
  );
});

// 3. FETCH EVENT
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Ignore non-GET requests (e.g. POST, PUT, DELETE, contact form submissions)
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // Ignore unsupported schemes (chrome-extension, edge, data, etc.)
  if (!url.protocol.startsWith('http')) {
    return;
  }

  // Bypass range requests (video / audio streams) to prevent Cache API 206 errors
  if (request.headers.has('range')) {
    return;
  }

  // Strategy A: API requests -> Network-First (never crash if network fails)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      (async () => {
        try {
          return await fetch(request);
        } catch {
          return new Response(
            JSON.stringify({ error: 'Network request failed in offline mode' }),
            {
              status: 503,
              headers: { 'Content-Type': 'application/json' }
            }
          );
        }
      })()
    );
    return;
  }

  // Strategy B: Navigation requests (HTML pages) -> Network-First with cached/offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE_NAME);
            try {
              await cache.put(request, networkResponse.clone());
            } catch (cacheErr) {
              // Cache quota or storage error shouldn't fail page delivery
              console.warn('[PWA SW] Navigation cache put failed:', cacheErr);
            }
          }
          return networkResponse;
        } catch {
          // Offline or network error: Attempt to serve from cache
          const cachedMatch = await caches.match(request);
          if (cachedMatch) {
            return cachedMatch;
          }

          // Fallback to cached root '/' or offline fallback page
          const cachedHome = await caches.match('/');
          if (cachedHome) {
            return cachedHome;
          }

          const offlinePage = await caches.match('/offline.html');
          if (offlinePage) {
            return offlinePage;
          }

          // In case all caches are empty, return minimal clean offline response
          return new Response(
            '<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline</title></head><body style="font-family:sans-serif;text-align:center;padding:3rem"><h2>You are offline</h2><p>Please reconnect to the internet to view this page.</p></body></html>',
            { headers: { 'Content-Type': 'text/html' } }
          );
        }
      })()
    );
    return;
  }

  // Strategy C: Static assets (JS, CSS, Images, Fonts, Documents) -> Stale-While-Revalidate
  const isStaticAsset =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.startsWith('/images/') ||
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    request.destination === 'image' ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.pdf');

  if (isStaticAsset) {
    event.respondWith(
      (async () => {
        const cachedResponse = await caches.match(request);

        const fetchPromise = (async () => {
          try {
            const networkResponse = await fetch(request);
            if (networkResponse && (networkResponse.status === 200 || networkResponse.type === 'opaque')) {
              const cache = await caches.open(DYNAMIC_CACHE_NAME);
              try {
                await cache.put(request, networkResponse.clone());
              } catch {
                // Ignore cache quota errors safely
              }
            }
            return networkResponse;
          } catch {
            return null;
          }
        })();

        // If in cache, return cached version immediately and let fetchPromise update in background
        if (cachedResponse) {
          event.waitUntil(fetchPromise);
          return cachedResponse;
        }

        // If not in cache, wait for network fetch
        const networkResponse = await fetchPromise;
        if (networkResponse) {
          return networkResponse;
        }

        // Fallback for missing images/assets
        return new Response('', { status: 408, statusText: 'Offline Asset Unavailable' });
      })()
    );
    return;
  }

  // Default fallback for any other GET requests: Network with Cache fallback
  event.respondWith(
    (async () => {
      try {
        const networkResponse = await fetch(request);
        return networkResponse;
      } catch {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
          return cachedResponse;
        }
        return new Response('Network error occurred while offline', {
          status: 503,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    })()
  );
});

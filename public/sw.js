/**
 * JAIKOD SERVICE WORKER
 * 
 * Handles:
 * - Offline caching (Cache First strategy for static assets)
 * - Push notifications from Firebase Cloud Messaging
 * - Background sync for offline actions
 */

const CACHE_NAME = 'jaikod-v1';
const STATIC_CACHE = 'jaikod-static-v1';
const DYNAMIC_CACHE = 'jaikod-dynamic-v1';

// Static assets to cache on install
const STATIC_ASSETS = [
    '/',
    '/offline',
    '/manifest.json',
    '/favicon.ico',
    '/icons/icon-512x512.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
    console.log('[SW] Installing service worker...');
    event.waitUntil(
        caches.open(STATIC_CACHE).then((cache) => {
            console.log('[SW] Caching static assets');
            return cache.addAll(STATIC_ASSETS);
        })
    );
    self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('[SW] Activating service worker...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== STATIC_CACHE && name !== DYNAMIC_CACHE)
                    .map((name) => caches.delete(name))
            );
        })
    );
    self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Skip Chrome extensions and external resources
    if (!url.origin.includes(self.location.origin)) return;

    // API requests - Network first
    if (url.pathname.startsWith('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    return response;
                })
                .catch(() => {
                    return caches.match(request);
                })
        );
        return;
    }

    // Static assets - Cache first
    if (
        url.pathname.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?)$/) ||
        url.pathname.startsWith('/_next/static/')
    ) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(request).then((response) => {
                    if (!response || response.status !== 200) {
                        return response;
                    }
                    const responseClone = response.clone();
                    caches.open(STATIC_CACHE).then((cache) => {
                        cache.put(request, responseClone);
                    });
                    return response;
                });
            })
        );
        return;
    }

    // HTML pages - Network first, fallback to cache
    event.respondWith(
        fetch(request)
            .then((response) => {
                const responseClone = response.clone();
                caches.open(DYNAMIC_CACHE).then((cache) => {
                    cache.put(request, responseClone);
                });
                return response;
            })
            .catch(() => {
                return caches.match(request).then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    // Return offline page for navigation requests
                    if (request.mode === 'navigate') {
                        return caches.match('/offline');
                    }
                    return new Response('Offline', { status: 503 });
                });
            })
    );
});

// Push notification event
self.addEventListener('push', (event) => {
    console.log('[SW] Push event received');

    let data = {
        title: 'JaiKod',
        body: 'คุณมีการแจ้งเตือนใหม่',
        icon: '/icons/icon-512x512.png',
        badge: '/favicon.ico',
        tag: 'default',
        data: { url: '/' }
    };

    if (event.data) {
        try {
            const payload = event.data.json();
            data = { ...data, ...payload };
        } catch (e) {
            data.body = event.data.text();
        }
    }

    const options = {
        body: data.body,
        icon: data.icon || '/icons/icon-512x512.png',
        badge: data.badge || '/favicon.ico',
        tag: data.tag || 'jaikod-notification',
        vibrate: [100, 50, 100],
        data: data.data || { url: '/' },
        actions: data.actions || [
            { action: 'open', title: 'เปิด' },
            { action: 'close', title: 'ปิด' }
        ],
        requireInteraction: data.requireInteraction || false
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
    console.log('[SW] Notification clicked:', event.action);
    event.notification.close();

    if (event.action === 'close') {
        return;
    }

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Focus existing window if available
            for (const client of clientList) {
                if (client.url.includes(self.location.origin) && 'focus' in client) {
                    client.navigate(urlToOpen);
                    return client.focus();
                }
            }
            // Open new window
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    console.log('[SW] Background sync:', event.tag);

    if (event.tag === 'sync-messages') {
        event.waitUntil(syncMessages());
    }

    if (event.tag === 'sync-wishlist') {
        event.waitUntil(syncWishlist());
    }
});

// Sync pending messages when back online
async function syncMessages() {
    try {
        const cache = await caches.open('pending-messages');
        const requests = await cache.keys();

        for (const request of requests) {
            try {
                await fetch(request.clone());
                await cache.delete(request);
            } catch (err) {
                console.error('[SW] Failed to sync message:', err);
            }
        }
    } catch (err) {
        console.error('[SW] Sync messages error:', err);
    }
}

// Sync wishlist changes when back online
async function syncWishlist() {
    try {
        const cache = await caches.open('pending-wishlist');
        const requests = await cache.keys();

        for (const request of requests) {
            try {
                await fetch(request.clone());
                await cache.delete(request);
            } catch (err) {
                console.error('[SW] Failed to sync wishlist:', err);
            }
        }
    } catch (err) {
        console.error('[SW] Sync wishlist error:', err);
    }
}

console.log('[SW] Service Worker loaded');

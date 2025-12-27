/**
 * FIREBASE CLOUD MESSAGING SERVICE WORKER
 * 
 * Handles background push notifications from Firebase
 */

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase configuration
firebase.initializeApp({
    apiKey: "AIzaSyD9nRgMvPOC3VuGpTbYvdSMX2kL6_xZl8M",
    authDomain: "jaikod-marketplace.firebaseapp.com",
    projectId: "jaikod-marketplace",
    storageBucket: "jaikod-marketplace.firebasestorage.app",
    messagingSenderId: "776829022203",
    appId: "1:776829022203:web:f8c8f4a8d8e8f8f8f8f8f8"
});

const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('[FCM SW] Received background message:', payload);

    const notificationTitle = payload.notification?.title || 'JaiKod';
    const notificationOptions = {
        body: payload.notification?.body || 'คุณมีการแจ้งเตือนใหม่',
        icon: payload.notification?.icon || '/icons/icon-512x512.png',
        badge: '/favicon.ico',
        tag: payload.data?.tag || 'jaikod-notification',
        data: {
            url: payload.data?.url || '/',
            type: payload.data?.type || 'general',
            ...payload.data
        },
        vibrate: [100, 50, 100],
        requireInteraction: payload.data?.requireInteraction === 'true'
    };

    // Add action buttons based on notification type
    if (payload.data?.type === 'message') {
        notificationOptions.actions = [
            { action: 'reply', title: 'ตอบกลับ' },
            { action: 'view', title: 'ดูข้อความ' }
        ];
        notificationOptions.data.url = '/chat';
    } else if (payload.data?.type === 'offer') {
        notificationOptions.actions = [
            { action: 'accept', title: 'รับข้อเสนอ' },
            { action: 'view', title: 'ดูข้อเสนอ' }
        ];
        notificationOptions.data.url = `/chat?id=${payload.data?.conversationId}`;
    } else if (payload.data?.type === 'price_drop') {
        notificationOptions.actions = [
            { action: 'buy', title: 'ซื้อเลย' },
            { action: 'view', title: 'ดูสินค้า' }
        ];
        notificationOptions.data.url = `/listing/${payload.data?.listingId}`;
    }

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
    console.log('[FCM SW] Notification click:', event.action);
    event.notification.close();

    const urlToOpen = event.notification.data?.url || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
            // Check if there's already a window open
            for (const client of windowClients) {
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

console.log('[FCM SW] Firebase Messaging Service Worker loaded');

/**
 * PUSH NOTIFICATION SERVICE
 * 
 * Handles:
 * - Firebase Cloud Messaging setup
 * - Permission requests
 * - Token management
 * - Sending notifications
 */

import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging'
import app from './firebase'
import { doc, setDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from './firebase'

// VAPID key for web push (you'll need to generate this in Firebase Console)
const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY

let messaging: ReturnType<typeof getMessaging> | null = null

// Initialize messaging (only in browser)
async function initializeMessaging() {
    if (typeof window === 'undefined') return null

    const supported = await isSupported()
    if (!supported) {
        console.log('[Push] Firebase Messaging not supported in this browser')
        return null
    }

    if (!messaging) {
        messaging = getMessaging(app)
    }
    return messaging
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<boolean> {
    if (typeof window === 'undefined') return false

    if (!('Notification' in window)) {
        console.log('[Push] Notifications not supported')
        return false
    }

    if (Notification.permission === 'granted') {
        return true
    }

    if (Notification.permission === 'denied') {
        console.log('[Push] Notifications are blocked')
        return false
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
}

/**
 * Get FCM token for the current device
 */
export async function getFCMToken(userId: string): Promise<string | null> {
    try {
        const msg = await initializeMessaging()
        if (!msg) return null

        const hasPermission = await requestNotificationPermission()
        if (!hasPermission) return null

        // Register service worker
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js')

        const token = await getToken(msg, {
            vapidKey: VAPID_KEY,
            serviceWorkerRegistration: registration
        })

        if (token) {
            // Save token to Firestore
            await saveTokenToFirestore(userId, token)
            console.log('[Push] FCM Token:', token)
            return token
        }

        return null
    } catch (error) {
        console.error('[Push] Error getting FCM token:', error)
        return null
    }
}

/**
 * Save FCM token to Firestore
 */
async function saveTokenToFirestore(userId: string, token: string): Promise<void> {
    try {
        const tokenRef = doc(db, 'users', userId, 'fcmTokens', token)
        await setDoc(tokenRef, {
            token,
            createdAt: serverTimestamp(),
            platform: 'web',
            userAgent: navigator.userAgent
        })
    } catch (error) {
        console.error('[Push] Error saving token:', error)
    }
}

/**
 * Delete FCM token (on logout)
 */
export async function deleteFCMToken(userId: string, token: string): Promise<void> {
    try {
        const tokenRef = doc(db, 'users', userId, 'fcmTokens', token)
        await deleteDoc(tokenRef)
    } catch (error) {
        console.error('[Push] Error deleting token:', error)
    }
}

/**
 * Listen for foreground messages
 */
export function onForegroundMessage(callback: (payload: any) => void): () => void {
    let unsubscribe = () => { }

    initializeMessaging().then(msg => {
        if (msg) {
            unsubscribe = onMessage(msg, (payload) => {
                console.log('[Push] Foreground message:', payload)
                callback(payload)
            })
        }
    })

    return unsubscribe
}

/**
 * Show a local notification (for foreground messages)
 */
export async function showLocalNotification(
    title: string,
    options: NotificationOptions & { data?: any }
): Promise<void> {
    if (typeof window === 'undefined') return

    if (Notification.permission !== 'granted') {
        console.log('[Push] No permission for notifications')
        return
    }

    const registration = await navigator.serviceWorker.ready

    // Cast to any to support extended notification options like vibrate
    await registration.showNotification(title, {
        ...options,
        icon: options.icon || '/icons/icon-512x512.png',
        badge: '/favicon.ico',
        tag: options.tag || 'jaikod-local'
    } as any)
}

/**
 * Send notification for new message
 */
export async function sendMessageNotification(
    recipientId: string,
    senderName: string,
    message: string,
    conversationId: string
): Promise<void> {
    // This would typically be handled by a Cloud Function
    // Here we just prepare the notification data structure
    const notificationData = {
        type: 'message',
        title: `💬 ${senderName}`,
        body: message.substring(0, 100),
        tag: `message-${conversationId}`,
        data: {
            type: 'message',
            conversationId,
            url: `/chat?id=${conversationId}`
        }
    }
    console.log('[Push] Message notification prepared:', notificationData)
}

/**
 * Send notification for new offer
 */
export async function sendOfferNotification(
    recipientId: string,
    buyerName: string,
    offerAmount: number,
    listingTitle: string,
    conversationId: string
): Promise<void> {
    const notificationData = {
        type: 'offer',
        title: `💰 ข้อเสนอใหม่`,
        body: `${buyerName} เสนอราคา ฿${offerAmount.toLocaleString()} สำหรับ ${listingTitle}`,
        tag: `offer-${conversationId}`,
        data: {
            type: 'offer',
            conversationId,
            url: `/chat?id=${conversationId}`
        }
    }
    console.log('[Push] Offer notification prepared:', notificationData)
}

/**
 * Send notification for price drop
 */
export async function sendPriceDropNotification(
    userId: string,
    listingId: string,
    listingTitle: string,
    oldPrice: number,
    newPrice: number
): Promise<void> {
    const discount = Math.round(((oldPrice - newPrice) / oldPrice) * 100)
    const notificationData = {
        type: 'price_drop',
        title: `📉 ราคาลด ${discount}%!`,
        body: `${listingTitle} ลดเหลือ ฿${newPrice.toLocaleString()}`,
        tag: `price-drop-${listingId}`,
        data: {
            type: 'price_drop',
            listingId,
            url: `/listing/${listingId}`
        }
    }
    console.log('[Push] Price drop notification prepared:', notificationData)
}

/**
 * Check if push is supported
 */
export function isPushSupported(): boolean {
    if (typeof window === 'undefined') return false
    return 'Notification' in window && 'serviceWorker' in navigator && 'PushManager' in window
}

/**
 * Get current permission status
 */
export function getNotificationPermissionStatus(): NotificationPermission | 'unsupported' {
    if (typeof window === 'undefined') return 'unsupported'
    if (!('Notification' in window)) return 'unsupported'
    return Notification.permission
}

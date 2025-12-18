import {
    collection,
    doc,
    addDoc,
    updateDoc,
    getDocs,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    onSnapshot,
    serverTimestamp,
    Timestamp,
    Unsubscribe,
    writeBatch
} from 'firebase/firestore'
import { db } from './firebase'

const NOTIFICATIONS_COLLECTION = 'notifications'

export interface Notification {
    id: string
    userId: string
    type: 'MESSAGE' | 'ORDER_UPDATE' | 'SYSTEM' | 'PROMOTION' | 'FAVORITE' | 'INTEREST' | 'GEO' | 'BEHAVIOR' | 'SELLER' | 'order' | 'message' | 'promotion' | 'system'
    priority?: 'high' | 'medium' | 'low'
    title: string
    body: string
    message?: string // Alias for body
    link?: string
    actionUrl?: string // Alias for link
    actionText?: string
    image?: string // For product thumbnails
    isRead: boolean
    createdAt: Date | Timestamp
    meta?: any // Extra data for AI context
}

/**
 * Create a new notification
 */
export async function createNotification(
    userId: string,
    data: {
        type: Notification['type'],
        title: string,
        body: string,
        link?: string
    }
): Promise<string> {
    try {
        const docRef = await addDoc(collection(db, NOTIFICATIONS_COLLECTION), {
            userId,
            ...data,
            isRead: false,
            createdAt: serverTimestamp()
        })
        return docRef.id
    } catch (error) {
        console.error('Error creating notification:', error)
        throw error
    }
}

/**
 * Subscribe to user's notifications
 */
export function subscribeToNotifications(
    userId: string,
    callback: (notifications: Notification[]) => void,
    limitCount: number = 20
): Unsubscribe {
    const q = query(
        collection(db, NOTIFICATIONS_COLLECTION),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
    )

    return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            message: doc.data().message || doc.data().body, // Support both
            createdAt: (doc.data().createdAt as Timestamp)?.toDate() || new Date()
        })) as Notification[]
        callback(notifications)
    })
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(notificationId: string): Promise<void> {
    try {
        await updateDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId), {
            isRead: true
        })
    } catch (error) {
        console.error('Error marking notification as read:', error)
    }
}

/**
 * Mark notification as read (alias for compatibility)
 */
export async function markAsRead(notificationId: string): Promise<void> {
    return markNotificationAsRead(notificationId)
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
        const q = query(
            collection(db, NOTIFICATIONS_COLLECTION),
            where('userId', '==', userId),
            where('isRead', '==', false)
        )
        const snapshot = await getDocs(q)

        const batch = writeBatch(db)
        snapshot.docs.forEach(doc => {
            batch.update(doc.ref, { isRead: true })
        })

        await batch.commit()
    } catch (error) {
        console.error('Error marking all as read:', error)
    }
}

/**
 * Delete a notification
 */
export async function deleteNotification(notificationId: string): Promise<void> {
    try {
        await deleteDoc(doc(db, NOTIFICATIONS_COLLECTION, notificationId))
    } catch (error) {
        console.error('Error deleting notification:', error)
        throw error
    }
}

/**
 * Get unread notification count
 */
export async function getUnreadNotificationCount(userId: string): Promise<number> {
    try {
        const q = query(
            collection(db, NOTIFICATIONS_COLLECTION),
            where('userId', '==', userId),
            where('isRead', '==', false)
        )
        const snapshot = await getDocs(q)
        return snapshot.size
    } catch (error) {
        console.error('Error getting unread count:', error)
        return 0
    }
}

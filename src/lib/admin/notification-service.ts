import { db } from '@/lib/firebase'
import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    serverTimestamp,
    writeBatch
} from 'firebase/firestore'
import { logAdminAction } from '@/lib/adminLogger'
import { AdminUser } from '@/types/admin'
import { AdminNotification, AlertType, AlertSeverity } from '@/types/admin-notification'
import { getSystemSettings, updateSystemSettings } from './settings-service'

const COLLECTION = 'admin_notifications'

// 1. Check if Enabled
export async function isNotificationEnabled(): Promise<boolean> {
    const settings = await getSystemSettings()
    return settings.admin_notifications_enabled
}

// 2. GET /admin/notifications
export async function getAdminNotifications(limitCount = 20, unreadOnly = false) {
    // Check Feature Flag
    if (!(await isNotificationEnabled())) {
        return [] // Return empty if disabled
    }

    try {
        let q = query(
            collection(db, COLLECTION),
            orderBy('created_at', 'desc'),
            limit(limitCount)
        )

        if (unreadOnly) {
            q = query(q, where('is_read', '==', false))
        }

        const snap = await getDocs(q)
        return snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data().created_at?.toDate()
        })) as AdminNotification[]
    } catch (e) {
        console.error('Error fetching notifications:', e)
        return []
    }
}

// 3. GET Unread Count
export async function getUnreadNotificationCount(): Promise<number> {
    if (!(await isNotificationEnabled())) return 0

    try {
        const q = query(
            collection(db, COLLECTION),
            where('is_read', '==', false)
        )
        const snap = await getDocs(q)
        return snap.size
    } catch (e) {
        return 0
    }
}

// 4. PATCH /admin/notifications/read/{id}
export async function markNotificationAsRead(admin: AdminUser, id: string) {
    if (!(await isNotificationEnabled())) return

    try {
        await updateDoc(doc(db, COLLECTION, id), {
            is_read: true
        })
    } catch (e) {
        console.error('Error reading notification:', e)
    }
}

export async function markAllAsRead(admin: AdminUser) {
    if (!(await isNotificationEnabled())) return

    try {
        const q = query(collection(db, COLLECTION), where('is_read', '==', false))
        const snap = await getDocs(q)

        const batch = writeBatch(db)
        snap.docs.forEach(d => {
            batch.update(d.ref, { is_read: true })
        })
        await batch.commit()
    } catch (e) {
        console.error('Error batch reading notifications:', e)
    }
}

// 5. Create Notification (Internal Use)
export async function createAdminNotification(
    type: AlertType,
    title: string,
    message: string,
    severity: AlertSeverity = 'info',
    link?: string
) {
    if (!(await isNotificationEnabled())) return

    try {
        await addDoc(collection(db, COLLECTION), {
            type,
            title,
            message,
            severity,
            link,
            is_read: false,
            created_at: serverTimestamp()
        })
    } catch (e) {
        console.error('Error creating notification:', e)
    }
}

// 6. Toggle System
export async function enableNotifications(admin: AdminUser) {
    await updateSystemSettings(admin, { admin_notifications_enabled: true })
}

export async function disableNotifications(admin: AdminUser) {
    await updateSystemSettings(admin, { admin_notifications_enabled: false })
}

// Seed Mock Notifications
export async function seedMockNotifications() {
    // Force enable temporarily to seed
    const mocks: Omit<AdminNotification, 'id' | 'created_at'>[] = [
        {
            type: 'user',
            title: 'ผู้ใช้ใหม่รอการตรวจสอบ',
            message: 'มีผู้ใช้ใหม่ 5 คนสมัครเข้ามาในชั่วโมงที่ผ่านมา',
            severity: 'info',
            is_read: false,
            link: '/admin/users'
        },
        {
            type: 'content',
            title: 'พบสินค้าละเมิดลิขสิทธิ์',
            message: 'ระบบ AI ตรวจพบสินค้า "Rolex Fake" อาจละเมิดลิขสิทธิ์',
            severity: 'danger',
            is_read: false,
            link: '/admin/products?filter=flagged'
        },
        {
            type: 'transaction',
            title: 'คำสั่งซื้อผิดปกติ',
            message: 'Order #9988 มียอดสั่งซื้อสูงผิดปกติ (500,000 THB)',
            severity: 'warning',
            is_read: false,
            link: '/admin/orders/9988'
        },
        {
            type: 'system',
            title: 'API Response Time High',
            message: 'Latency พุ่งสูงเกิน 2000ms ในโซน BKK-1',
            severity: 'warning',
            is_read: true,
            link: '/admin/settings'
        },
        {
            type: 'announcement',
            title: 'อัปเดตระบบ v1.2',
            message: 'ระบบจะปิดปรับปรุงเวลา 02:00 น.',
            severity: 'info',
            is_read: false,
            link: '/admin/announcements'
        }
    ]

    for (const m of mocks) {
        await addDoc(collection(db, COLLECTION), {
            ...m,
            created_at: serverTimestamp()
        })
    }
}

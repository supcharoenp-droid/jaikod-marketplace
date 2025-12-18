import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { AdminUser } from '@/types/admin'

export type ActionType =
    | 'USER_BAN'
    | 'USER_UNBAN'
    | 'USER_UPDATE'
    | 'SELLER_VERIFY'
    | 'SELLER_REJECT'
    | 'SELLER_SUSPEND'
    | 'SYSTEM_UPDATE_ROLE'
    | 'LOGIN'
    | 'ANNOUNCEMENT_CREATE'
    | 'ANNOUNCEMENT_UPDATE'
    | 'ANNOUNCEMENT_PUBLISH'
    | 'ANNOUNCEMENT_ARCHIVE'
    | 'ANNOUNCEMENT_DELETE'
    | 'SETTINGS_UPDATE'
    | 'PRODUCT_APPROVE'
    | 'PRODUCT_REJECT'
    | 'PRODUCT_FREEZE'
    | 'PRODUCT_FLAG'
    | 'ORDER_UPDATE'
    | 'MODERATION_RESOLVE'
    | 'FINANCE_APPROVE'
    | 'FINANCE_REJECT'

// Simple helper to get Client IP (Best effort)
const getClientIP = async (): Promise<string> => {
    try {
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        return data.ip
    } catch (e) {
        return 'unknown'
    }
}

export async function logAdminAction(
    admin: AdminUser | null,
    action: ActionType,
    target: string, // e.g., "User: john@example.com"
    details: string,
    metadata?: any
) {
    if (!admin) return

    try {
        // Fetch real IP
        const ip = await getClientIP().catch(() => 'unknown')
        const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : 'Server'

        await addDoc(collection(db, 'system_logs'), {
            adminId: admin.id,
            adminName: admin.displayName,
            adminRole: admin.role,
            action,
            target,
            details,
            metadata: metadata || {},
            ip,
            timestamp: serverTimestamp(),
            userAgent
        })
    } catch (error) {
        console.error('Failed to write audit log:', error)
    }
}

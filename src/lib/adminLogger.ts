import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp, query, getDocs, orderBy, limit } from 'firebase/firestore'
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
    | 'AI_KYC_BATCH'
    | 'USER_ROLE_UPDATE'
    | 'AI_INSIGHT_GENERATE'
    // Category actions
    | 'CATEGORY_CREATE'
    | 'CATEGORY_UPDATE'
    | 'CATEGORY_DELETE'
    | 'CATEGORY_SEED'
    // Promotion actions
    | 'PROMOTION_CREATE'
    | 'PROMOTION_UPDATE'
    | 'PROMOTION_DELETE'
    // System actions
    | 'SYSTEM_SCRIPT'
    | 'RISK_ASSESS'

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

// Fetch lateat logs for dashboard
export async function getAdminLogs(limitCount: number = 5) {
    try {
        const q = query(collection(db, 'system_logs'), orderBy('timestamp', 'desc'), limit(limitCount))
        const snap = await getDocs(q)
        return snap.docs.map(d => ({
            id: d.id,
            ...d.data(),
            timestamp: d.data().timestamp?.toDate() || new Date()
        }))
    } catch (e) {
        console.error(e)
        return []
    }
}

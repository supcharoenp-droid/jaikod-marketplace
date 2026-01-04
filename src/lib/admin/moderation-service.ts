import { db } from '@/lib/firebase'
import {
    collection,
    doc,
    getDocs,
    getDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    addDoc,
    getCountFromServer
} from 'firebase/firestore'
import { logAdminAction } from '@/lib/adminLogger'
import { AdminUser } from '@/types/admin'
import { banUser } from './user-service'
import { freezeProduct } from './product-service'

export interface ContentFlag {
    id: string
    target_type: 'product' | 'user' | 'review' | 'message'
    target_id: string
    target_name?: string // Optional helper for UI
    target_preview?: string // Optional helper for UI (e.g. image url or text snippet)
    reason: string
    ai_score?: number // 0-100, if applicable
    reported_by?: string // User ID who reported
    status: 'pending' | 'resolved' | 'dismissed'
    created_at: Date
    resolved_at?: Date
    resolved_by?: string
    resolution_note?: string
}

export interface ModerationStats {
    total: number
    pending: number
    resolved: number
    highRisk: number // AI Score > 80
}

// 1. GET /admin/moderation
export async function getModerationFlags(filterStatus: string = 'all') {
    try {
        const ref = collection(db, 'content_flags')
        let q = query(ref, orderBy('created_at', 'desc'), limit(50))

        if (filterStatus !== 'all') {
            q = query(ref, where('status', '==', filterStatus), orderBy('created_at', 'desc'), limit(50))
        }

        const snap = await getDocs(q)
        return snap.docs.map(d => {
            const data = d.data()
            return {
                id: d.id,
                ...data,
                created_at: data.created_at?.toDate(),
                resolved_at: data.resolved_at?.toDate()
            } as ContentFlag
        })
    } catch (e) {
        console.error('Error fetching flags:', e)
        return []
    }
}

// 2. Actions
export async function resolveFlag(admin: AdminUser, flagId: string, action: 'ban_target' | 'dismiss' | 'warn', note?: string) {
    try {
        const finalStatus = action === 'dismiss' ? 'dismissed' : 'resolved'

        // Enforce Action
        if (action === 'ban_target') {
            const flagRef = await getDoc(doc(db, 'content_flags', flagId))
            if (flagRef.exists()) {
                const flagData = flagRef.data() as ContentFlag
                if (flagData.target_type === 'user') {
                    await banUser(admin, flagData.target_id, note || 'Banned via Moderation Flag')
                } else if (flagData.target_type === 'product') {
                    await freezeProduct(admin, flagData.target_id, note || 'Suspended via Moderation Flag')
                }
            }
        }

        await updateDoc(doc(db, 'content_flags', flagId), {
            status: finalStatus,
            resolution_action: action,
            resolution_note: note,
            resolved_by: admin.id,
            resolved_at: Timestamp.now()
        })

        await logAdminAction(admin, 'MODERATION_RESOLVE', `Flag: ${flagId}`, `Action: ${action}, Note: ${note}`)
        return true
    } catch (e) { throw e }
}

// 3. Stats
export async function getModerationStats(): Promise<ModerationStats> {
    try {
        // Mocking counts for performance in MVP without aggregated counters
        const snap = await getDocs(query(collection(db, 'content_flags'), limit(200)))
        const flags = snap.docs.map(d => d.data())

        return {
            total: flags.length,
            pending: flags.filter(f => f.status === 'pending').length,
            resolved: flags.filter(f => f.status === 'resolved' || f.status === 'dismissed').length,
            highRisk: flags.filter(f => f.status === 'pending' && (f.ai_score || 0) > 80).length
        }
    } catch (e) {
        return { total: 0, pending: 0, resolved: 0, highRisk: 0 }
    }
}

// Seed Mock Data
export async function seedMockFlags() {
    const mocks: Omit<ContentFlag, 'id' | 'created_at'>[] = [
        {
            target_type: 'product',
            target_id: 'prod_fake_123',
            target_name: 'Rolex Submariner (Mirror Grade)',
            reason: 'สินค้าละเมิดลิขสิทธิ์ (Counterfeit)',
            ai_score: 95,
            status: 'pending',
            target_preview: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=150'
        },
        {
            target_type: 'user',
            target_id: 'user_spam_007',
            target_name: 'Somchai RichMan',
            reason: 'สแปมข้อความและการหลอกลวง',
            ai_score: 88,
            status: 'pending',
            target_preview: ''
        },
        {
            target_type: 'review',
            target_id: 'rev_bad_word',
            target_name: 'Review #992',
            reason: 'ใช้ถ้อยคำหยาบคาย รุนแรง',
            ai_score: 75,
            status: 'pending',
            target_preview: 'ร้านนี้บริการแย่มาก xxxx yyyy'
        },
        {
            target_type: 'product',
            target_id: 'prod_weapon',
            target_name: 'มีดพกเดินป่า (Spyderco)',
            reason: 'อาวุธต้องห้าม (Potential Weapon)',
            ai_score: 60,
            status: 'dismissed',
            target_preview: 'https://images.unsplash.com/photo-1595411426432-535e98520e58?w=150'
        }
    ]

    const existing = await getDocs(query(collection(db, 'content_flags'), limit(1)))
    if (!existing.empty) return

    for (const m of mocks) {
        await addDoc(collection(db, 'content_flags'), {
            ...m,
            created_at: Timestamp.now()
        })
    }
}

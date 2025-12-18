
import { db } from '@/lib/firebase'
import {
    collection,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore'
import { logAdminAction } from '@/lib/adminLogger'
import { AdminUser } from '@/types/admin'

export interface Promotion {
    id: string
    code: string
    title: string
    description?: string
    discountType: 'fixed' | 'percent'
    discountValue: number
    minSpend: number
    maxDiscount?: number // For percent type
    usageLimit: number // Total global usage
    usageCount: number
    startDate: Timestamp
    endDate: Timestamp
    isActive: boolean
    createdBy: string
    createdAt: Timestamp
    target: 'all' | 'new_user' | 'min_tier' // For future segmentation
}

// 1. Get Promotions
export async function getPromotions(filterStatus: 'active' | 'expired' | 'scheduled' | 'all' = 'all') {
    try {
        const ref = collection(db, 'promotions')
        let q = query(ref, orderBy('createdAt', 'desc'))

        const snap = await getDocs(q)
        const now = new Date()

        let promos = snap.docs.map(d => ({ id: d.id, ...d.data() } as Promotion))

        if (filterStatus === 'active') {
            promos = promos.filter(p => p.isActive && p.endDate.toDate() > now && p.startDate.toDate() <= now)
        } else if (filterStatus === 'expired') {
            promos = promos.filter(p => p.endDate.toDate() <= now)
        } else if (filterStatus === 'scheduled') {
            promos = promos.filter(p => p.startDate.toDate() > now)
        }

        return promos
    } catch (error) {
        console.error('Error fetching promotions:', error)
        return []
    }
}

// 2. Create Promotion
export async function createPromotion(admin: AdminUser, data: Omit<Promotion, 'id' | 'createdAt' | 'usageCount' | 'createdBy'>) {
    try {
        // Validation: Check duplicate code? (Simplification: Firestone unique index should handle real constraint, but we'll trust admin for now or check in UI)

        const promoData = {
            ...data,
            usageCount: 0,
            isActive: true,
            createdBy: admin.id,
            createdAt: serverTimestamp()
        }

        const docRef = await addDoc(collection(db, 'promotions'), promoData)

        await logAdminAction(admin, 'PROMOTION_CREATE', `Promo: ${data.code}`, `Created voucher ${data.code}`)
        return docRef.id
    } catch (error) {
        throw error
    }
}

// 3. Toggle Status (Active/Inactive)
export async function togglePromotionStatus(admin: AdminUser, promoId: string, isActive: boolean) {
    try {
        await updateDoc(doc(db, 'promotions', promoId), { isActive })
        await logAdminAction(admin, 'PROMOTION_UPDATE', `Promo: ${promoId}`, `Set active: ${isActive}`)
        return true
    } catch (error) {
        throw error
    }
}

// 4. Delete Promotion
export async function deletePromotion(admin: AdminUser, promoId: string) {
    try {
        await deleteDoc(doc(db, 'promotions', promoId))
        await logAdminAction(admin, 'PROMOTION_DELETE', `Promo: ${promoId}`, 'Deleted voucher')
        return true
    } catch (error) {
        throw error
    }
}

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
    setDoc
} from 'firebase/firestore'
import { logAdminAction } from '@/lib/adminLogger'
import { AdminUser } from '@/types/admin'
import { getAIAnalystService } from './ai-analyst-service'

// Types
export interface Seller {
    id: string // maps to user_id
    displayName: string
    email: string
    phoneNumber: string
    shopName?: string
    kycStatus: 'pending' | 'approved' | 'rejected' | 'none'
    isVerified: boolean
    isSuspended: boolean
    totalSales: number
    warnings: number
    joinedAt: Timestamp
    kycDocuments?: string[]
    aiKYCAssessment?: any // AI analysis result JSON
}

export interface KYCRquest {
    id: string
    sellerId: string
    documents: string[]
    status: 'pending' | 'approved' | 'rejected'
    submittedAt: Timestamp
    note?: string
}

// 1. GET /admin/sellers (MOCK Impl wrapping Firestore)
export async function getSellers(filter?: { kycStatus?: string, search?: string }) {
    try {
        const usersRef = collection(db, 'users')
        // In real app, we would query where('role', '==', 'seller') or similar
        // For now, fetch all and filter client side or use limited query
        let q = query(usersRef, limit(100))

        const snap = await getDocs(q)
        let sellers = snap.docs.map(d => {
            const data = d.data()
            return {
                id: d.id,
                displayName: data.displayName || 'Unknown',
                email: data.email || '',
                phoneNumber: data.phoneNumber || '-',
                shopName: data.shopName || data.displayName, // fallback
                kycStatus: data.kycStatus || 'none',
                isVerified: data.isVerified || false,
                isSuspended: data.isSuspended || false,
                totalSales: data.totalSales || 0,
                warnings: data.warnings || 0,
                joinedAt: data.createdAt || Timestamp.now(),
                kycDocuments: data.kycDocuments || []
            } as Seller
        })

        // Filter Logic
        if (filter?.kycStatus) {
            sellers = sellers.filter(s => s.kycStatus === filter.kycStatus)
        }
        if (filter?.search) {
            const term = filter.search.toLowerCase()
            sellers = sellers.filter(s =>
                s.displayName.toLowerCase().includes(term) ||
                s.email.toLowerCase().includes(term) ||
                s.shopName?.toLowerCase().includes(term)
            )
        }

        return sellers
    } catch (error) {
        console.error('Error fetching sellers:', error)
        return []
    }
}

// 2. GET /admin/sellers/:id
export async function getSellerById(id: string): Promise<Seller | null> {
    try {
        const docRef = doc(db, 'users', id)
        const snap = await getDoc(docRef)
        if (snap.exists()) {
            const data = snap.data()
            return {
                id: snap.id,
                displayName: data.displayName,
                email: data.email,
                phoneNumber: data.phoneNumber,
                shopName: data.shopName,
                kycStatus: data.kycStatus || 'none',
                isVerified: data.isVerified,
                isSuspended: data.isSuspended,
                totalSales: data.totalSales || 0,
                warnings: data.warnings || 0,
                joinedAt: data.createdAt,
                kycDocuments: data.kycDocuments
            } as Seller
        }
        return null
    } catch (error) {
        console.error('Error fetching seller:', error)
        return null
    }
}

// 3. POST /admin/sellers/:id/kyc-approve
export async function approveSellerKYC(admin: AdminUser, sellerId: string) {
    try {
        const sellerRef = doc(db, 'users', sellerId)
        await updateDoc(sellerRef, {
            kycStatus: 'approved',
            isVerified: true,
            verifiedAt: Timestamp.now()
        })

        // Log
        await logAdminAction(admin, 'SELLER_VERIFY', `Seller: ${sellerId}`, 'Approved KYC documents')
        return true
    } catch (error) {
        console.error('Error approving KYC:', error)
        throw error
    }
}

// 4. POST /admin/sellers/:id/kyc-reject
export async function rejectSellerKYC(admin: AdminUser, sellerId: string, reason: string) {
    try {
        const sellerRef = doc(db, 'users', sellerId)
        await updateDoc(sellerRef, {
            kycStatus: 'rejected',
            kycRejectReason: reason,
            isVerified: false
        })

        await logAdminAction(admin, 'SELLER_REJECT', `Seller: ${sellerId}`, `Rejected KYC: ${reason}`)
        return true
    } catch (error) {
        console.error('Error rejecting KYC:', error)
        throw error
    }
}

// 5. POST /admin/sellers/:id/ban
export async function banSeller(admin: AdminUser, sellerId: string, reason: string) {
    try {
        const sellerRef = doc(db, 'users', sellerId)
        await updateDoc(sellerRef, {
            isSuspended: true,
            suspendReason: reason
        })

        await logAdminAction(admin, 'USER_BAN', `Seller: ${sellerId}`, `Suspended Shop: ${reason}`)
        return true
    } catch (error) {
        console.error('Error banning seller:', error)
        throw error
    }
}

// 6. POST /admin/sellers/:id/unban
export async function unbanSeller(admin: AdminUser, sellerId: string) {
    try {
        const sellerRef = doc(db, 'users', sellerId)
        await updateDoc(sellerRef, {
            isSuspended: false,
            suspendReason: null
        })

        await logAdminAction(admin, 'USER_UNBAN', `Seller: ${sellerId}`, 'Reinstated Shop')
        return true
    } catch (error) {
        console.error('Error unbanning seller:', error)
        throw error
    }
}

/**
 * 7. AI Analysis of KYC Documents
 */
export async function analyzeSellerKYC(sellerId: string, documents: { idCard?: string, portrait?: string, businessReg?: string }) {
    try {
        const analyst = getAIAnalystService()
        // Assuming documents are base64 strings passed from UI for real-time analysis
        const result = await analyst.analyzeKYC(
            documents.idCard || '',
            documents.portrait || '',
            documents.businessReg
        )

        // Optionally save analysis result to seller's doc
        const sellerRef = doc(db, 'users', sellerId)
        await updateDoc(sellerRef, {
            aiKYCAssessment: {
                ...result,
                analyzedAt: Timestamp.now()
            }
        })

        return result
    } catch (error) {
        console.error('Error in AI KYC analysis:', error)
        throw error
    }
}

/**
 * 8. Batch AI Verification for all pending sellers
 */
export async function batchAnalyzeSellers(admin: AdminUser, sellerIds: string[]) {
    const results = []
    const analyst = getAIAnalystService()

    for (const id of sellerIds) {
        try {
            const sellerRef = doc(db, 'users', id)
            const snap = await getDoc(sellerRef)
            const data = snap.data()
            if (!data) continue

            const docs = data.kycDocuments || []
            const analysis = await analyst.analyzeKYC(docs[0] || '', docs[1] || '', docs[2])

            await updateDoc(sellerRef, {
                aiKYCAssessment: {
                    ...analysis,
                    analyzedAt: Timestamp.now()
                }
            })
            results.push({ id, status: 'success', analysis })
        } catch (e) {
            results.push({ id, status: 'error', error: e })
        }
    }

    await logAdminAction(admin, 'AI_KYC_BATCH', `Analyzed ${sellerIds.length} sellers`, 'Admin triggered bulk AI scan')
    return results
}

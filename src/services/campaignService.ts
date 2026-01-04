
import { db } from '@/lib/firebase'
import {
    collection,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    serverTimestamp,
    Timestamp,
    orderBy,
    limit,
    getDoc
} from 'firebase/firestore'
import { walletService } from './walletService'
// Direct Firestore writes are used for notifications for better performance

// ===================================
// TYPES
// ===================================

export type CampaignStatus = 'pending' | 'active' | 'paused' | 'completed' | 'expired' | 'cancelled'
export type PromotionType = 'boost' | 'flash_sale' | 'featured' | 'premium'

export interface Campaign {
    id: string
    sellerId: string
    productId: string
    type: PromotionType
    status: CampaignStatus

    // Duration
    startTime: any // Timestamp
    endTime: any // Timestamp
    durationHours: number

    // Stats (TikTok Style)
    stats: {
        impressions: number
        clicks: number
        reach: number
        spend: number
    }

    // Financial
    cost: number
    packageId?: string

    createdAt: any
    updatedAt: any
}

// ===================================
// SERVICE
// ===================================

class CampaignService {
    private static instance: CampaignService

    public static getInstance(): CampaignService {
        if (!CampaignService.instance) {
            CampaignService.instance = new CampaignService()
        }
        return CampaignService.instance
    }

    /**
     * Start a new promotion campaign
     */
    async startCampaign(
        userId: string,
        productId: string,
        type: PromotionType,
        durationHours: number,
        cost: number
    ): Promise<{ success: boolean, campaignId?: string, error?: string }> {
        try {
            // 1. Deduct Money
            const deductionMsg = `Promotion: ${type.toUpperCase()} for Product #${productId.substring(0, 6)}`
            try {
                await walletService.deduct(userId, cost, deductionMsg, productId)
            } catch (err) {
                return { success: false, error: 'Insufficient funds' }
            }

            // 2. Calculate End Time
            const now = new Date()
            const endTime = new Date(now.getTime() + (durationHours * 60 * 60 * 1000))

            // 3. Create Campaign Record
            const campaignData: Omit<Campaign, 'id'> = {
                sellerId: userId,
                productId,
                type,
                status: 'active',
                startTime: serverTimestamp(),
                endTime: Timestamp.fromDate(endTime), // Store as Firestore Timestamp
                durationHours,
                stats: {
                    impressions: 0,
                    clicks: 0,
                    reach: 0,
                    spend: 0
                },
                cost,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            const docRef = await addDoc(collection(db, 'campaigns'), campaignData)
            const campaignId = docRef.id

            // 4. Update Product Flag (For UI Display)
            const collectionName = 'listings'; // Defaulting to our new listing system
            const productRef = doc(db, collectionName, productId)

            await updateDoc(productRef, {
                'promotion': {
                    'isActive': true,
                    'type': type,
                    'endTime': Timestamp.fromDate(endTime),
                    'campaignId': campaignId
                }
            })

            // 5. Send Notification (Real API call)
            await addDoc(collection(db, 'notifications'), {
                userId: userId,
                title: 'Promotion Started! 🚀',
                body: `สินค้าของคุณได้รับการโปรโมทแล้ว จะสิ้นสุดในเวลา ${endTime.toLocaleTimeString()}`,
                type: 'PROMOTION',
                isRead: false,
                link: `/wallet`,
                createdAt: serverTimestamp()
            })

            return { success: true, campaignId }

        } catch (error: any) {
            console.error("Start Campaign Error:", error)
            return { success: false, error: error.message }
        }
    }

    /**
     * Get active campaigns for a seller
     */
    async getActiveCampaigns(sellerId: string): Promise<Campaign[]> {
        const q = query(
            collection(db, 'campaigns'),
            where('sellerId', '==', sellerId),
            where('status', '==', 'active'),
            orderBy('createdAt', 'desc')
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Campaign))
    }

    /**
     * Check if a specific product has an active campaign
     */
    async getProductCampaign(productId: string): Promise<Campaign | null> {
        const q = query(
            collection(db, 'campaigns'),
            where('productId', '==', productId),
            where('status', '==', 'active'),
            limit(1)
        )
        const snapshot = await getDocs(q)
        if (snapshot.empty) return null
        return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Campaign
    }
}

export const campaignService = CampaignService.getInstance()

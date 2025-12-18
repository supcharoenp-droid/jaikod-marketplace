
import { db } from '@/lib/firebase'
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    Timestamp,
    orderBy,
    limit,
    getCountFromServer
} from 'firebase/firestore'
import { logAdminAction } from '@/lib/adminLogger'
import { AdminUser } from '@/types/admin'

export interface TrustScoreProfile {
    userId: string
    currentScore: number // 0-100
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
    factors: {
        kycVerified: boolean
        bankVerified: boolean
        accountAgeDays: number
        completedOrders: number
        cancelledOrders: number // Seller fault
        reportCount: number
        suspectSignals: number // IP matches, device fingerprinting
    }
    lastUpdated: Date
    histories: { score: number, reason: string, date: Date }[]
}

// เกณฑ์คะแนน (Configurable)
const SCORE_CONFIG = {
    BASE: 50,
    BONUS_KYC: 20,
    BONUS_BANK: 10,
    BONUS_ORDER: 1, // Per successful order (Max 30)
    PENALTY_LATE: 5,
    PENALTY_CANCEL: 10,
    PENALTY_REPORT: 20,
    PENALTY_SUSPECT: 50 // High risk signal
}

/**
 * 1. คำนวณและอัปเดตคะแนน Trust Score ของผู้ใช้
 * @param adminUser ผู้ดูแลระบบที่สั่งการ (Optional: ถ้าเป็น System auto-run อาจจะเป็น null)
 * @param userId User ID เป้าหมาย
 */
export async function assessUserRisk(userId: string, adminUser?: AdminUser): Promise<TrustScoreProfile> {
    try {
        // 1. Fetch Data gathering
        const userRef = doc(db, 'users', userId)
        const userSnap = await getDoc(userRef)

        if (!userSnap.exists()) throw new Error('User not found')
        const userData = userSnap.data()

        // 1.1 Calculate Account Age
        const createdAt = userData.createdAt?.toDate() || new Date()
        const ageInDays = Math.floor((new Date().getTime() - createdAt.getTime()) / (1000 * 3600 * 24))

        // 1.2 Get Order Stats (Mock aggregating query for now)
        // In production, these should be counters on the User document to save reads
        const ordersRef = collection(db, 'orders')

        // Count Completed (Sold or Bought - depending on role, let's assume we check general activity)
        // Note: For strict seller scoring, filter by seller_id. For buyer, buyer_id. 
        // Here we do a generic check on seller_id for Trust Score mainly relevant for Sellers initially.
        const completedSnap = await getCountFromServer(query(
            ordersRef,
            where('seller_id', '==', userId),
            where('status', '==', 'completed')
        ))
        const completedCount = completedSnap.data().count

        // Count Cancelled (Seller Fault?) - approximation
        const cancelledSnap = await getCountFromServer(query(
            ordersRef,
            where('seller_id', '==', userId),
            where('status', '==', 'cancelled')
        ))
        const cancelledCount = cancelledSnap.data().count

        // 1.3 Get Approved Reports
        const reportsRef = collection(db, 'content_flags')
        const reportsSnap = await getCountFromServer(query(
            reportsRef,
            where('target_id', '==', userId),
            where('status', '==', 'resolved'), // Resolved means admin agreed it was bad
            where('resolution_action', 'in', ['warn', 'ban_target']) // Penalize only if action was taken
        ))
        const reportCount = reportsSnap.data().count

        // 2. Score Calculation
        let score = SCORE_CONFIG.BASE

        // Bonus
        if (userData.isVerified) score += SCORE_CONFIG.BONUS_KYC
        if (userData.bankVerified === true) score += SCORE_CONFIG.BONUS_BANK

        const orderBonus = Math.min(30, completedCount * SCORE_CONFIG.BONUS_ORDER)
        score += orderBonus

        // Penalty
        score -= (cancelledCount * SCORE_CONFIG.PENALTY_CANCEL)
        score -= (reportCount * SCORE_CONFIG.PENALTY_REPORT)

        // Cap Score (0 - 100)
        score = Math.max(0, Math.min(100, score))

        // 3. Determine Risk Level
        let riskLevel: TrustScoreProfile['riskLevel'] = 'MEDIUM'
        if (score >= 80) riskLevel = 'LOW'
        else if (score >= 50) riskLevel = 'MEDIUM'
        else if (score >= 30) riskLevel = 'HIGH'
        else riskLevel = 'CRITICAL'

        const profile: TrustScoreProfile = {
            userId,
            currentScore: score,
            riskLevel,
            factors: {
                kycVerified: !!userData.isVerified,
                bankVerified: false, // Todo: Check real bank field
                accountAgeDays: ageInDays,
                completedOrders: completedCount,
                cancelledOrders: cancelledCount,
                reportCount: reportCount,
                suspectSignals: 0
            },
            lastUpdated: new Date(),
            histories: [] // In real impl, fetch subcollection
        }

        // 4. Update Database (Auditing / Hidden field)
        await updateDoc(userRef, {
            trustScore: score,
            riskLevel: riskLevel,
            lastRiskAssessment: Timestamp.now()
        })

        if (adminUser) {
            await logAdminAction(adminUser, 'RISK_ASSESS', `User: ${userId}`, `Score: ${score} (${riskLevel})`)
        }

        return profile

    } catch (error) {
        console.error('Error assessing risk:', error)
        throw error
    }
}

/**
 * 2. Get Report for UI
 */
export async function getTrustProfile(userId: string): Promise<TrustScoreProfile | null> {
    try {
        const snap = await getDoc(doc(db, 'users', userId))
        if (!snap.exists()) return null
        const data = snap.data()

        return {
            userId: snap.id,
            currentScore: data.trustScore ?? 50,
            riskLevel: data.riskLevel ?? 'MEDIUM',
            factors: {
                kycVerified: !!data.isVerified,
                bankVerified: false,
                accountAgeDays: 0,
                completedOrders: 0,
                cancelledOrders: 0,
                reportCount: 0,
                suspectSignals: 0
            },
            lastUpdated: data.lastRiskAssessment?.toDate() ?? new Date(),
            histories: []
        }
    } catch (e) {
        return null
    }
}

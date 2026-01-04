import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp, getCountFromServer } from 'firebase/firestore'

export type FlagType = 'fraud' | 'content' | 'risk' | 'abnormal_behavior'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface AIFlag {
    id: string
    userId: string
    userName: string
    reason: string
    score: number // 0-100
    type: FlagType
    riskLevel: RiskLevel
    status: 'pending' | 'reviewed' | 'resolved' | 'false_positive'
    detectedAt: Timestamp
    details?: any
}

// Simulated AI Analysis
export const mockAIDetection = [
    {
        userId: 'user_001',
        userName: 'Somchai Trader',
        reason: 'ai_reason_spamming',
        score: 85,
        type: 'abnormal_behavior',
        riskLevel: 'high'
    },
    {
        userId: 'user_002',
        userName: 'Luxury Watch Shop',
        reason: 'ai_reason_price_low',
        score: 95,
        type: 'fraud',
        riskLevel: 'critical'
    },
    {
        userId: 'user_003',
        userName: 'Newbie User',
        reason: 'ai_reason_phone_change',
        score: 60,
        type: 'risk',
        riskLevel: 'medium'
    },
    {
        userId: 'user_004',
        userName: 'Vintage Collector',
        reason: 'ai_reason_duplicate_image',
        score: 45,
        type: 'content',
        riskLevel: 'low'
    }
]

export async function fetchAIFlags(): Promise<AIFlag[]> {
    try {
        const q = query(collection(db, 'ai_flags'), orderBy('detectedAt', 'desc'), limit(20))
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as AIFlag[]
    } catch (error) {
        console.error('Error fetching AI flags:', error)
        return []
    }
}

export async function seedAIFlags() {
    const aiFlagsRef = collection(db, 'ai_flags')
    const snapshot = await getCountFromServer(aiFlagsRef)
    if (snapshot.data().count > 0) return

    for (const flag of mockAIDetection) {
        await addDoc(aiFlagsRef, {
            ...flag,
            status: 'pending',
            detectedAt: Timestamp.now()
        })
    }
}

export async function resolveFlag(flagId: string, resolution: string) {
    // Logic to update flag status in Firestore
    console.log(`Resolving flag ${flagId} with ${resolution}`)
}

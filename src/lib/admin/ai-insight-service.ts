import { db } from '@/lib/firebase'
import { collection, query, where, getDocs, limit, orderBy } from 'firebase/firestore'
import { getAIAnalystService } from './ai-analyst-service'

export interface AIInsight {
    id: string
    type: 'opportunity' | 'risk' | 'trend' | 'system'
    title: string
    content: string
    impact: 'high' | 'medium' | 'low'
    score?: number
}

/**
 * AI Strategic Insight Engine
 * Generates proactive recommendations for admins based on live data patterns.
 */
export async function getAIStrategicInsights(language: 'th' | 'en' = 'en'): Promise<AIInsight[]> {
    const isThai = language === 'th'

    try {
        // 1. Gather Snapshot Data (Abbreviated for safety)
        const [pendingFlags, recentOrders, newSellers] = await Promise.all([
            getDocs(query(collection(db, 'content_flags'), where('status', '==', 'pending'), limit(20))),
            getDocs(query(collection(db, 'orders'), orderBy('created_at', 'desc'), limit(10))),
            getDocs(query(collection(db, 'users'), where('role', '==', 'seller'), orderBy('createdAt', 'desc'), limit(5)))
        ])

        const snapshot = {
            flagCounts: pendingFlags.size,
            orderStats: recentOrders.docs.map(d => ({ total: d.data().total_amount, status: d.data().status })),
            newSellers: newSellers.docs.map(d => ({ name: d.data().shopName, region: d.data().address?.province })),
            timestamp: new Date().toISOString()
        }

        // 2. Integrated Real AI Analysis
        const analyst = getAIAnalystService()
        const aiResponse = await analyst.getStrategicInsights(snapshot)

        // Map AI response to UI Format
        if (aiResponse && aiResponse.insights) {
            return aiResponse.insights.map((ins: any, i: number) => ({
                id: `ai-insight-${i}`,
                type: ins.type || 'trend',
                title: isThai ? (ins.title_th || ins.title) : ins.title,
                content: isThai ? (ins.content_th || ins.content) : ins.content,
                impact: ins.impact || 'medium',
                score: ins.riskScore || ins.growthPotential || 80
            }))
        }

        // Fallback if AI fails
        return [
            {
                id: 'fallback-1',
                type: 'trend',
                title: isThai ? 'ระบบวิเคราะห์ AI พร้อมใช้งาน' : 'AI Analysis Ready',
                content: isThai
                    ? 'ระบบ AI พร้อมประมวลผลข้อมูลเชิงลึกจากรายการฝากขายล่าสุด'
                    : 'AI is ready to process deep insights from latest listings.',
                impact: 'low'
            }
        ]

    } catch (e) {
        console.error('AI Insight Error:', e)
        return []
    }
}

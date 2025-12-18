/**
 * AI Risk Intelligence Service (Mock / Placeholder)
 * ระบบ AI อัจฉริยะสำหรับวิเคราะห์ความเสี่ยงและพฤติกรรมผิดปกติ
 * 
 * Policy:
 * - AI ให้คำแนะนำ (Advisory) เท่านั้น ไม่ทำการแบนอัตโนมัติ
 * - ผลลัพธ์ต้องอธิบายได้ (Explainable AI)
 */

import { db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'

// ==========================================
// TYPES
// ==========================================

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface RiskFactor {
    code: string
    description_th: string
    description_en: string
    weight: number // 1-10 ความหนักแน่นของปัจจัยนี้
}

export interface RiskAnalysisResult {
    targetId: string
    targetType: 'USER' | 'TRANSACTION' | 'LISTING'
    score: number // 0-100 (100 = Server Risk)
    level: RiskLevel
    factors: RiskFactor[]
    summary_th: string // AI Insight (TH)
    summary_en: string // AI Insight (EN)
    analyzedAt: Date
    recommendation: 'APPROVE' | 'WATCH' | 'REVIEW' | 'REJECT'
}

// ==========================================
// MOCK AI ENGINE
// ==========================================

export const AI_RISK_SERVICE = {

    /**
     * วิเคราะห์ความเสี่ยงของผู้ใช้งาน (Login, Profile, Behavior)
     */
    async analyzeUserRisk(userId: string): Promise<RiskAnalysisResult> {
        // Simulation Delay
        await new Promise(r => setTimeout(r, 800))

        // Mock Logic: Randomly assign risk for demo purposes
        // In real world: Check IP velocity, Device fingerprint, Graph linkage
        const randomScore = Math.floor(Math.random() * 100)

        // Mock a generic result
        return generateMockResult(userId, 'USER', randomScore)
    },

    /**
     * วิเคราะห์ความเสี่ยงของธุรกรรม (ABC Scam, Strange Amount)
     */
    async analyzeTransactionRisk(txId: string, amount: number): Promise<RiskAnalysisResult> {
        await new Promise(r => setTimeout(r, 500))

        // Mock Logic: High amount = Higher scrutiny
        const baseScore = amount > 50000 ? 70 : 10
        const randomVar = Math.floor(Math.random() * 30)

        return generateMockResult(txId, 'TRANSACTION', baseScore + randomVar)
    },

    /**
     * วิเคราะห์ความเสี่ยงของสินค้า (Fake Item, Prohibited)
     */
    async analyzeListingRisk(listingId: string): Promise<RiskAnalysisResult> {
        await new Promise(r => setTimeout(r, 1200)) // Image processing takes time

        const randomScore = Math.floor(Math.random() * 100)
        return generateMockResult(listingId, 'LISTING', randomScore)
    }
}

// ==========================================
// HELPER: MOCK GENERATOR
// ==========================================

function generateMockResult(id: string, type: 'USER' | 'TRANSACTION' | 'LISTING', score: number): RiskAnalysisResult {
    let level: RiskLevel = 'LOW'
    let factors: RiskFactor[] = []
    let rec: RiskAnalysisResult['recommendation'] = 'APPROVE'
    let th = 'ไม่พบความผิดปกติที่ชัดเจน'
    let en = 'No significant anomalies detected.'

    if (score > 80) {
        level = 'CRITICAL'
        rec = 'REJECT'
        th = '⛔ ความเสี่ยงสูงมาก: พบพฤติกรรมที่ตรงกับ Pattern การทุจริต'
        en = 'CRITICAL RISK: Behavior matches known fraud patterns.'
        factors.push({ code: 'CRIT-01', description_th: 'IP Address ตรงกับบัญชี Blacklist', description_en: 'IP matches Blacklist', weight: 10 })
        factors.push({ code: 'CRIT-02', description_th: 'ความถี่ในการทำรายการสูงผิดปกติ (Bot-like)', description_en: 'Abnormal transaction velocity', weight: 8 })
    } else if (score > 50) {
        level = 'HIGH'
        rec = 'REVIEW'
        th = '⚠️ ความเสี่ยงสูง: ควรตรวจสอบเอกสารเพิ่มเติม'
        en = 'HIGH RISK: Manual documentation review recommended.'
        factors.push({ code: 'HIGH-01', description_th: 'บัญชีเพิ่งสมัครใหม่แต่ทำธุรกรรมยอดสูง', description_en: 'New account with high value transaction', weight: 6 })
    } else if (score > 20) {
        level = 'MEDIUM'
        rec = 'WATCH'
        th = 'มีความเสี่ยงปานกลาง: เฝ้าระวังพฤติกรรม'
        en = 'MEDIUM RISK: Monitor for suspicious activity.'
        factors.push({ code: 'MED-01', description_th: 'Login จากอุปกรณ์ที่ไม่คุ้นเคย', description_en: 'Login from unfamiliar device', weight: 3 })
    }

    return {
        targetId: id,
        targetType: type,
        score,
        level,
        factors,
        summary_th: th,
        summary_en: en,
        analyzedAt: new Date(),
        recommendation: rec
    }
}

export interface QualityAssessment {
    score: number // 0-100
    status: 'poor' | 'fair' | 'good' | 'excellent'
    issues: QualityIssue[]
    suggestions: string[]
    missingFields: string[]
}

export interface QualityIssue {
    type: 'critical' | 'warning' | 'info'
    message: string
    field?: string
}

// Suspicious phrases detection
const SUSPICIOUS_PHRASES = [
    'โอนก่อน', 'line only', 'แอดไลน์',
    'ไม่รับผ่านระบบ', 'หลุดจอง', 'รีบใช้เงิน',
    'ราคาขึ้น', 'หมดแล้วหมดเลย', 'รับโอนเท่านั้น'
]

const VAGUE_PHRASES = [
    'สภาพนางฟ้า', 'เหมือนใหม่', '99%', 'สวยๆ', 'ดีมาก', 'สภาพดี'
]

// Category-specific mandatory keywords/fields for "Quality"
const CATEGORY_RULES: Record<string, string[]> = {
    'mobile-tablet': ['battery', 'แบต', 'gb', 'ความจุ', 'cycle', 'box', 'อุปกรณ์'],
    'cameras': ['shutter', 'ชัตเตอร์', 'lens', 'เลนส์', 'sensor', 'รา', 'ฝ้า'],
    'cars': ['mileage', 'ไมล์', 'ปี', 'year', 'เล่ม', 'book'],
    'fashion': ['size', 'ไซส์', 'อก', 'เอว', 'ยาว', 'แท้']
}

export function evaluateListingQuality(
    title: string,
    description: string,
    price: number,
    categorySlug: string
): QualityAssessment {
    let score = 100
    const issues: QualityIssue[] = []
    const suggestions: string[] = []
    const missingFields: string[] = []

    const combinedText = (title + ' ' + description).toLowerCase()

    // 1. Length Check
    if (description.length < 50) {
        score -= 20
        issues.push({ type: 'warning', message: 'รายละเอียดสั้นเกินไป ควรเขียนอย่างน้อย 50 ตัวอักษร' })
        suggestions.push('เพิ่มประวัติการใช้งาน หรือเหตุผลที่ขาย')
    }

    // 2. Suspicious Pattern (Safety)
    const foundSuspicious = SUSPICIOUS_PHRASES.filter(p => combinedText.includes(p))
    if (foundSuspicious.length > 0) {
        score -= 40
        issues.push({
            type: 'critical',
            message: `พบคำที่มักใช้ในการหลอกลวง: "${foundSuspicious.join(', ')}"`
        })
        suggestions.push('แนะนำให้ใช้ระบบชำระเงินของแพลตฟอร์มเท่านั้น')
    }

    // 3. Vague Low-Effort Description
    const foundVague = VAGUE_PHRASES.filter(p => combinedText.includes(p))
    // If vague words exist BUT description is short (<100 chars), it's a red flag.
    if (foundVague.length > 0 && description.length < 100) {
        score -= 15
        issues.push({
            type: 'warning',
            message: 'ระบุสภาพสินค้ากว้างเกินไป (เช่น "นางฟ้า", "99%")'
        })
        suggestions.push('ควรระบุตำหนิให้ชัดเจน หรือถ่ายรูปจุดสังเกตเพิ่ม')
    }

    // 4. Missing Category Specifics
    const requiredKeywords = CATEGORY_RULES[categorySlug] || []
    const missingKeywords = requiredKeywords.filter(k => !combinedText.includes(k))

    if (missingKeywords.length > 0) {
        // Calculate penalty based on how many missing
        const penalty = Math.min(20, missingKeywords.length * 5)
        score -= penalty

        missingFields.push(...missingKeywords)
        issues.push({
            type: 'info',
            message: `ขาดรายละเอียดสำคัญของหมวดนี้: ${missingKeywords.join(', ')}`
        })
    }

    // 5. Price Check (Basic presence)
    if (!price || price <= 0) {
        score -= 30
        issues.push({ type: 'critical', message: 'กรุณาระบุราคาสินค้า' })
    }

    // Normalize Score
    score = Math.max(0, Math.min(100, score))

    // Determine Status
    let status: QualityAssessment['status'] = 'good'
    if (score < 50) status = 'poor'
    else if (score < 80) status = 'fair'
    else if (score >= 95) status = 'excellent'

    return {
        score,
        status,
        issues,
        suggestions,
        missingFields
    }
}

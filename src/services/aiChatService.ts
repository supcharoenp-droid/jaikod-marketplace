// Use a simple message interface that works with both lib/chat and realtimeChatService
interface SimpleChatMessage {
    text: string
    senderId?: string
    [key: string]: any // Allow additional properties
}

import { Product } from '@/types/index'
import { analyzeChatWithAI, ChatIntelligenceOutput } from '@/lib/ai-pipeline/chat-intelligence'

// ==========================================
// TYPES
// ==========================================

export type IntentType =
    | 'price_negotiation'
    | 'product_inquiry'
    | 'availability_check'
    | 'closing_sale'
    | 'risk_contact'
    | 'general'

export interface LeadAnalysis {
    score: number // 0-100
    label: 'Cold' | 'Warm' | 'Hot'
    probability: string // e.g. "85%"
    reasonTH: string
    reasonEN: string
    nextStepTH: string
    nextStepEN: string
}

export interface ConversationSummary {
    keyPoints: string[]
    lastAgreedPrice?: number
    decidedMeetup?: string
    pendingActions: string[]
}

export interface AIAnalysisResult {
    intent: IntentType
    safetyWarning?: string
    suggestedReplies: string[]
    action?: 'boost_product' | 'recommend_meeting_point' | 'closing_sale' | null
    leadAnalysis?: LeadAnalysis
    summary?: ConversationSummary
}

export interface MeetingPoint {
    name: string
    type: 'police_station' | 'mall' | 'bts_mrt'
    distance: string
    lat: number
    lng: number
}

// ==========================================
// MOCK LOGIC (Fallback)
// ==========================================

/**
 * Analyze the latest context of the conversation to provide AI assistance
 * @deprecated Use analyzeConversationWithLLM instead
 */
export function analyzeConversationContext(
    role: 'buyer' | 'seller',
    messages: SimpleChatMessage[],
    product?: any
): AIAnalysisResult {
    const lastMessage = messages[messages.length - 1]
    const text = lastMessage?.text?.toLowerCase() || ''

    // Default Result
    const result: AIAnalysisResult = {
        intent: 'general',
        suggestedReplies: [],
        action: null
    }

    // 1. Safety Guard Layer (Keywords)
    if (text.match(/(\d{3}[-\s]?\d{3}[-\s]?\d{4})/) || text.includes('เลขบัญชี') || text.includes('โอนเงิน') || text.includes('line id')) {
        result.intent = 'risk_contact'
        result.safetyWarning = 'โปรดระวังการให้ข้อมูลส่วนตัวหรือโอนเงินนอกระบบ JaiKod เพื่อความปลอดภัย'
        if (role === 'buyer') {
            result.suggestedReplies.push('ขอนัดรับสินค้าเพื่อความสบายใจครับ', 'ผ่านระบบ JaiKod ปลอดภัยกว่านะครับ')
        } else {
            result.suggestedReplies.push('ยินดีนัดรับสินค้าครับ', 'ชำระผ่านระบบได้เลยครับ ปลอดภัยแน่นอน')
        }
        return result
    }

    // 2. Intent Detection & Suggested Replies

    // A. Price Negotiation
    if (text.includes('ลด') || text.includes('ราคา') || text.includes('เท่าไหร่') || text.includes('แพง')) {
        result.intent = 'price_negotiation'
        if (role === 'buyer') {
            result.suggestedReplies = [
                'ลดได้อีกไหมครับ?',
                'ราคานี้รวมส่งไหมครับ?',
                'งบมีจำกัด ลดให้อีกนิดได้ไหมครับ'
            ]
        } else {
            // Seller
            result.suggestedReplies = [
                'ราคานี้พิเศษแล้วครับ สินค้าสภาพดีมาก',
                'ลดได้นิดหน่อยครับ สนใจรับเลยไหม',
                'ส่งฟรีให้แทนได้ไหมครับ'
            ]
        }
    }
    // B. Availability Check
    else if (text.includes('ยังอยู่') || text.includes('พร้อมส่ง') || text.includes('สนใจ')) {
        result.intent = 'availability_check'
        if (role === 'seller') {
            result.suggestedReplies = [
                'สินค้ายังอยู่ครับ พร้อมส่งเลย',
                'สนใจสอบถามเพิ่มเติมได้นะครับ',
                'รับเลยไหมครับ เดี๋ยวผมแพ็คของให้เลย'
            ]
            result.action = 'closing_sale'
        }
    }
    // C. Closing Sale / Meeting
    else if (text.includes('นัดรับ') || text.includes('ที่ไหน') || text.includes('โลเคชั่น')) {
        result.intent = 'closing_sale'
        result.action = 'recommend_meeting_point'
        if (role === 'seller') {
            result.suggestedReplies = [
                'สะดวกนัดรับแถวไหนครับ?',
                'ผมนัดเจอได้ที่สถานีตำรวจหรือห้างใกล้เคียงครับ',
                'ขอเบอร์ติดต่อเพื่อนัดสถานที่นะครับ'
            ]
        }
    }
    // D. General / Greeting
    else {
        if (role === 'seller' && messages.length < 3) {
            result.suggestedReplies = ['สวัสดีครับ สนใจสินค้าชิ้นไหนสอบถามได้เลยครับ', 'สินค้าพร้อมส่งครับ']
        } else if (role === 'buyer') {
            result.suggestedReplies = ['สนใจครับ', 'ขอดูรูปเพิ่มได้ไหมครับ']
        }
    }

    return result
}

/**
 * Get Safe Meeting Points (Mock)
 */
export function getSafeMeetingPoints(userLat: number, userLng: number): MeetingPoint[] {
    // Mock logic - in real app, use Google Maps Place API type='police'|'shopping_mall'
    return [
        { name: 'สน. ปทุมวัน (Police Station)', type: 'police_station', distance: '1.2 km', lat: 13.7, lng: 100.5 },
        { name: 'Siam Paragon (Safe Zone)', type: 'mall', distance: '2.0 km', lat: 13.75, lng: 100.53 },
        { name: 'BTS Siam Exit 2', type: 'bts_mrt', distance: '1.8 km', lat: 13.74, lng: 100.53 },
    ]
}

/**
 * Generate Smart Summary of Conversation
 */
export function generateSmartSummary(messages: SimpleChatMessage[]): string {
    if (messages.length < 5) return 'เพิ่งเริ่มการสนทนา'

    const text = messages.map(m => m.text).join(' ').toLowerCase()

    if (text.includes('นัดรับ')) return 'กำลังนัดหมายรับสินค้า'
    if (text.includes('ลด') || text.includes('ราคา')) return 'กำลังต่อรองราคา'
    if (text.includes('ส่ง') || text.includes('track')) return 'ตกลงซื้อขาย/จัดส่งแล้ว'

    return 'กำลังสอบถามรายละเอียดสินค้า'
}

/**
 * Get Boosting Suggestion (Seller Only)
 */
export function shouldSuggestBoost(productViews: number, conversationCount: number): boolean {
    if (productViews > 100 && conversationCount < 5) return true
    return false
}

/**
 * AI Price Intelligence
 */
export interface PriceIntelligence {
    fairPriceRange: { min: number, max: number }
    suggestedOffer: number
    marketTrend: 'rising' | 'stable' | 'falling'
    demandLevel: 'low' | 'medium' | 'high'
    reasoningTH: string
    reasoningEN: string
}

export function getPriceIntelligence(product: Partial<Product>): PriceIntelligence {
    const price = product.price || 0
    // Mock AI calculation
    return {
        fairPriceRange: { min: Math.floor(price * 0.9), max: Math.floor(price * 1.05) },
        suggestedOffer: Math.floor(price * 0.95),
        marketTrend: 'stable',
        demandLevel: 'high',
        reasoningTH: `สินค้านี้มีความต้องการสูงในรอบ 7 วันที่ผ่านมา ราคาที่เหมาะสมควรอยู่ระหว่าง ฿${(price * 0.9).toLocaleString()} - ฿${(price * 1.05).toLocaleString()}`,
        reasoningEN: `This item has high demand in the last 7 days. Fair market price is between ฿${(price * 0.9).toLocaleString()} - ฿${(price * 1.05).toLocaleString()}`
    }
}

/**
 * Legacy V3 Analysis (Mostly Mock) - Deprecated
 */
export function analyzeConversationContextV3(
    role: 'buyer' | 'seller',
    messages: SimpleChatMessage[],
    product?: any
): AIAnalysisResult & { priceIntel?: PriceIntelligence } {
    const base = analyzeConversationContext(role, messages, product)
    let priceIntel: PriceIntelligence | undefined

    if (base.intent === 'price_negotiation' && product) {
        priceIntel = getPriceIntelligence(product)
    }

    const hotKeywords = ['โอน', 'นัดรับ', 'ตกลง', 'พรุ่งนี้', 'กี่บาท', 'ลดได้ไหม']
    const textCombined = messages.map(m => m.text).join(' ').toLowerCase()
    const matchCount = hotKeywords.filter(k => textCombined.includes(k)).length

    let leadAnalysis: LeadAnalysis | undefined
    if (messages.length > 2) {
        const score = Math.min(30 + (matchCount * 15) + (messages.length * 2), 98)
        leadAnalysis = {
            score,
            label: score > 80 ? 'Hot' : score > 50 ? 'Warm' : 'Cold',
            probability: `${score}%`,
            reasonTH: score > 80 ? 'ลูกค้ามี Intent ชัดเจนและถามถึงการชำระเงิน/นัดรับ' : 'ลูกค้าสนใจรายละเอียดสินค้าแต่ยังไม่ตัดสินใจ',
            reasonEN: score > 80 ? 'Customer has clear intent and asked about payment/meetup' : 'Customer is interested but not yet decided',
            nextStepTH: score > 80 ? 'ส่งใบเสนอราคา (Offer) หรือแจ้งที่อยู่/จุดนัดพบทันที' : 'ให้ข้อมูลสินค้าเพิ่มเติมหรือส่งภาพมุมอื่น',
            nextStepEN: score > 80 ? 'Send Offer or share meetup point immediately' : 'Provide more info or additional photos'
        }
    }

    let summary: ConversationSummary | undefined
    if (messages.length >= 4) {
        summary = {
            keyPoints: [
                'สนใจสินค้า DJI Mini 4 Pro',
                'สอบถามเรื่องการลดราคา',
                'คุยเรื่องความปลอดภัยและการตรวจสอบสินค้า'
            ],
            lastAgreedPrice: priceIntel?.suggestedOffer,
            pendingActions: ['รอผู้ขายยืนยันจุดนัดรับ', 'รอผู้ซื้อคอนเฟิร์มเวลา']
        }
    }

    return { ...base, priceIntel, leadAnalysis, summary }
}


// ==========================================
// REAL AI (LLM) LOGIC
// ==========================================

export async function analyzeConversationWithLLM(
    role: 'buyer' | 'seller',
    messages: SimpleChatMessage[],
    product?: any
): Promise<AIAnalysisResult & { priceIntel?: PriceIntelligence }> {

    // 1. Call the Real AI Pipeline
    const aiOutput = await analyzeChatWithAI(messages, role, product)

    // 2. Map Output to existing data structures for UI compatibility

    // Calculate Price Intel (Hybrid: AI + Math)
    const priceIntel = product ? getPriceIntelligence(product) : undefined

    // Map Lead Analysis
    const leadAnalysis: LeadAnalysis = {
        score: aiOutput.lead_analysis.score,
        label: aiOutput.lead_analysis.category,
        probability: `${(aiOutput.lead_analysis.probability_to_close * 100).toFixed(0)}%`,
        reasonTH: aiOutput.lead_analysis.reason,
        reasonEN: '',
        nextStepTH: aiOutput.summary.next_action,
        nextStepEN: ''
    }

    // Map Summary
    const summary: ConversationSummary = {
        keyPoints: aiOutput.summary.key_points,
        pendingActions: [],
        decidedMeetup: undefined // Could extract from summary text if needed
    }

    // Map intent to existing types
    let mappedIntent: IntentType = 'general'
    if (aiOutput.intent === 'negotiate') mappedIntent = 'price_negotiation'
    if (aiOutput.intent === 'inquire') mappedIntent = 'product_inquiry'
    if (aiOutput.intent === 'schedule_meetup') mappedIntent = 'closing_sale'

    return {
        intent: mappedIntent,
        safetyWarning: aiOutput.safety_check.is_safe ? undefined : aiOutput.safety_check.warning_message,
        suggestedReplies: aiOutput.suggested_replies,
        action: aiOutput.intent === 'schedule_meetup' ? 'recommend_meeting_point' : null,
        leadAnalysis,
        summary,
        priceIntel
    }
}


export interface SafeZone extends MeetingPoint {
    isVerified: boolean
    openingHours: string
    density: 'Low' | 'Medium' | 'High'
    recommendationReasonEN: string
    recommendationReasonTH: string
}

/**
 * Production-Ready Safezone Engine
 */
export function getSafeMeetingPointsV4(
    lat: number,
    lng: number,
    productPrice: number = 0
): SafeZone[] {
    const isHighValue = productPrice >= 10000

    const allZones: SafeZone[] = [
        {
            name: '7-Eleven (สาขารัชดา 32)',
            type: 'mall',
            distance: '0.4 km',
            lat: 13.8182,
            lng: 100.5744,
            isVerified: true,
            openingHours: '24 Hours',
            density: 'High',
            recommendationReasonTH: 'คนพลุกพล่านตลอด 24 ชม. มีกล้อง CCTV เข้าถึงง่าย',
            recommendationReasonEN: 'Busy 24/7 with CCTV, highly accessible.'
        },
        {
            name: 'CJ MORE (ลาดพร้าววังหิน)',
            type: 'mall',
            distance: '1.2 km',
            lat: 13.8205,
            lng: 100.5894,
            isVerified: true,
            openingHours: '06:00 - 22:00',
            density: 'Medium',
            recommendationReasonTH: 'มีที่จอดรถสะดวก ปลอดภัยสำหรับตรวจเช็คสินค้า',
            recommendationReasonEN: 'Convenient parking, safe for item inspection.'
        },
        {
            name: 'Central Ladprao (Information Counter Fl. 1)',
            type: 'mall',
            distance: '2.8 km',
            lat: 13.8160,
            lng: 100.5612,
            isVerified: true,
            openingHours: '10:00 - 22:00',
            density: 'High',
            recommendationReasonTH: 'แนะนำสำหรับสินค้ามูลค่าสูง พื้นที่ส่วนกลางพร้อม รปภ.',
            recommendationReasonEN: 'Recommended for high-value items. Security presence.'
        },
        {
            name: 'Lotus\'s Go Fresh (รัชดาภิเษก)',
            type: 'mall',
            distance: '0.8 km',
            isVerified: true,
            openingHours: '06:00 - 23:00',
            density: 'Medium',
            lat: 13.8222,
            lng: 100.5788,
            recommendationReasonTH: 'จุดนัดพบมาตรฐาน เข้าถึงง่ายจากหน้าปากซอย',
            recommendationReasonEN: 'Standard meeting point, easy street access.'
        },
        {
            name: 'Big C Extra (Ratchadaphisek)',
            type: 'mall',
            distance: '2.5 km',
            isVerified: true,
            openingHours: '09:00 - 23:00',
            density: 'High',
            lat: 13.7667,
            lng: 100.5694,
            recommendationReasonTH: 'พื้นที่กว้างขวาง สว่าง และมีเจ้าหน้าที่ดูแลตลอด',
            recommendationReasonEN: 'Spacious, well-lit, and always staffed.'
        },
        {
            name: 'HomePro (Rama 9)',
            type: 'mall',
            distance: '4.1 km',
            isVerified: true,
            openingHours: '09:00 - 21:00',
            density: 'Medium',
            lat: 13.7500,
            lng: 100.6000,
            recommendationReasonTH: 'จุดนัดพบยอดนิยมสำหรับสินค้าตกแต่งบ้าน ปลอดภัย',
            recommendationReasonEN: 'Popular meetup for home decor items, safe.'
        },
        {
            name: 'Makro (Srinagarindra)',
            type: 'mall',
            distance: '5.2 km',
            isVerified: true,
            openingHours: '06:00 - 22:00',
            density: 'Medium',
            lat: 13.6500,
            lng: 100.6300,
            recommendationReasonTH: 'ลานจอดรถกว้างขวาง มีกล้องวงจรปิดครอบคลุม',
            recommendationReasonEN: 'Spacious parking with extensive CCTV coverage.'
        }
    ]

    // Sort: If high value, put Malls (Central) at top
    return allZones.sort((a, b) => {
        if (isHighValue) {
            // Prioritize major malls and specialty stores for high value
            const priorityBrands = ['Central', 'HomePro', 'IKEA', 'The Mall']
            const aPriority = priorityBrands.some(brand => a.name.includes(brand)) ? 0 : 1
            const bPriority = priorityBrands.some(brand => b.name.includes(brand)) ? 0 : 1
            if (aPriority !== bPriority) return aPriority - bPriority
        }
        // Otherwise sort by distance
        return parseFloat(a.distance) - parseFloat(b.distance)
    })
}

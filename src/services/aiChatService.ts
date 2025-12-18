import { ChatMessage, Conversation } from '@/lib/chat'
import { Product } from '@/types/index'

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

export interface AIAnalysisResult {
    intent: IntentType
    safetyWarning?: string
    suggestedReplies: string[]
    action?: 'boost_product' | 'recommend_meeting_point' | 'closing_sale' | null
}

export interface MeetingPoint {
    name: string
    type: 'police_station' | 'mall' | 'bts_mrt'
    distance: string
    lat: number
    lng: number
}

// ==========================================
// LOGIC
// ==========================================

/**
 * Analyze the latest context of the conversation to provide AI assistance
 */
export function analyzeConversationContext(
    role: 'buyer' | 'seller',
    messages: ChatMessage[],
    product?: Partial<Product>
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
export function generateSmartSummary(messages: ChatMessage[]): string {
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
    // Logic: If high views but low conversion (few chats), suggest boost or price drop
    // Here: If many chats but no close -> Boost visibility to get NEW customers? 
    // Actually typically: Low views -> Boost. High Views + Many Chats -> Closing Helper.

    if (productViews > 100 && conversationCount < 5) return true // High interest but few chats -> Maybe boost helps reach right audience?
    return false
}

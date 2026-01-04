/**
 * AI Chat Assistant Service
 * 
 * ระบบช่วยแนะนำคำตอบและวิเคราะห์ความตั้งใจในการแชท
 */

// Types
export interface ChatMessage {
    id: string
    senderId: string
    senderRole: 'buyer' | 'seller'
    message: string
    timestamp: Date
    productId?: string
}

export interface QuickReply {
    id: string
    text: string
    icon: string
    category: string
}

export interface SuggestedResponse {
    text: string
    confidence: number
    category: string
    tips?: string
    variations: string[]
}

export interface SentimentResult {
    sentiment: 'positive' | 'negative' | 'neutral'
    confidence: number
    keywords: string[]
}

// Quick replies for buyers
const BUYER_QUICK_REPLIES: QuickReply[] = [
    { id: 'b1', text: 'สินค้ายังมีอยู่ไหมครับ?', icon: '❓', category: 'inquiry' },
    { id: 'b2', text: 'ลดราคาได้ไหมครับ?', icon: '💰', category: 'negotiation' },
    { id: 'b3', text: 'ส่งได้วันไหนครับ?', icon: '📦', category: 'shipping' },
    { id: 'b4', text: 'รับประกันกี่วันครับ?', icon: '🛡️', category: 'warranty' },
    { id: 'b5', text: 'ขอดูรูปเพิ่มได้ไหมครับ?', icon: '📷', category: 'photos' },
    { id: 'b6', text: 'นัดดูของได้ไหมครับ?', icon: '📍', category: 'meetup' },
]

// Quick replies for sellers
const SELLER_QUICK_REPLIES: QuickReply[] = [
    { id: 's1', text: 'สินค้ายังมีอยู่ครับ สอบถามเพิ่มเติมได้เลย', icon: '✅', category: 'availability' },
    { id: 's2', text: 'ราคานี้เป็นราคาสุทธิแล้วครับ', icon: '💵', category: 'price' },
    { id: 's3', text: 'ส่งได้เลยครับ รอ 1-2 วัน', icon: '🚚', category: 'shipping' },
    { id: 's4', text: 'รับประกัน 7 วันครับ', icon: '🛡️', category: 'warranty' },
    { id: 's5', text: 'มีรูปเพิ่มเติมครับ รอส่งให้นะครับ', icon: '📷', category: 'photos' },
    { id: 's6', text: 'นัดดูได้ครับ สะดวกวันไหนครับ?', icon: '📍', category: 'meetup' },
]

/**
 * Get contextual quick replies based on user role
 */
export function getContextualQuickReplies(role: 'buyer' | 'seller'): QuickReply[] {
    return role === 'buyer' ? BUYER_QUICK_REPLIES : SELLER_QUICK_REPLIES
}

/**
 * Analyze sentiment of a message
 */
export function analyzeSentiment(message: string): SentimentResult {
    const positiveWords = ['ขอบคุณ', 'ดี', 'เยี่ยม', 'สนใจ', 'โอเค', 'ได้', 'ครับ', 'ค่ะ', 'ชอบ', 'สวย']
    const negativeWords = ['แพง', 'ไม่', 'เสีย', 'พัง', 'ช้า', 'ห่วย', 'โกง']

    const lowerMessage = message.toLowerCase()
    const foundPositive = positiveWords.filter(w => lowerMessage.includes(w))
    const foundNegative = negativeWords.filter(w => lowerMessage.includes(w))

    const positiveScore = foundPositive.length
    const negativeScore = foundNegative.length

    if (positiveScore > negativeScore) {
        return {
            sentiment: 'positive',
            confidence: Math.min(0.9, 0.5 + positiveScore * 0.1),
            keywords: foundPositive
        }
    } else if (negativeScore > positiveScore) {
        return {
            sentiment: 'negative',
            confidence: Math.min(0.9, 0.5 + negativeScore * 0.1),
            keywords: foundNegative
        }
    }

    return {
        sentiment: 'neutral',
        confidence: 0.5,
        keywords: []
    }
}

/**
 * Suggest response based on incoming message
 */
export function suggestResponse(
    incomingMessage: string,
    role: 'buyer' | 'seller',
    context?: {
        productStatus?: 'available' | 'reserved' | 'sold'
        productPrice?: number
        hasNegotiation?: boolean
    }
): SuggestedResponse[] {
    const lowerMessage = incomingMessage.toLowerCase()
    const suggestions: SuggestedResponse[] = []

    // Price negotiation detection
    if (lowerMessage.includes('ลด') || lowerMessage.includes('ราคา') || lowerMessage.includes('ต่อรอง')) {
        if (role === 'seller') {
            const price = context?.productPrice || 0
            const discountPrice = Math.floor(price * 0.95)

            suggestions.push({
                text: `ลดได้เต็มที่ ฿${discountPrice.toLocaleString()} ครับ เนื่องจากเป็นราคาพิเศษอยู่แล้ว`,
                confidence: 0.85,
                category: 'negotiation',
                tips: 'แนะนำ: ลด 5% เพื่อปิดการขาย',
                variations: [
                    `ราคานี้เป็นราคาสุทธิแล้วครับ แต่ถ้าซื้อวันนี้ลดได้อีก 5%`,
                    `สินค้านี้ราคาดีมากแล้วครับ แต่สำหรับลูกค้าที่สนใจจริง ลดได้อีกเล็กน้อย`
                ]
            })
        } else {
            suggestions.push({
                text: 'ขอเสนอราคา ฿xxx ได้ไหมครับ? สนใจจริงครับ',
                confidence: 0.8,
                category: 'negotiation',
                tips: 'ระบุราคาที่ต้องการและแสดงความจริงใจ',
                variations: [
                    'ถ้าลดได้ซักนิดนึง ผมซื้อเลยครับ',
                    'มีโปรโมชั่นอะไรไหมครับ?'
                ]
            })
        }
    }

    // Availability check
    if (lowerMessage.includes('ยัง') || lowerMessage.includes('มีอยู่') || lowerMessage.includes('พร้อม')) {
        if (role === 'seller') {
            suggestions.push({
                text: 'สินค้ายังมีอยู่ครับ พร้อมส่งได้เลย สนใจสอบถามเพิ่มเติมได้นะครับ',
                confidence: 0.9,
                category: 'availability',
                variations: [
                    'ยังมีครับ สนใจทักมาได้เลยนะครับ',
                    'มีครับ! และสินค้าอยู่ในสภาพดีมากครับ'
                ]
            })
        }
    }

    // Shipping inquiry
    if (lowerMessage.includes('ส่ง') || lowerMessage.includes('จัดส่ง') || lowerMessage.includes('ขนส่ง')) {
        if (role === 'seller') {
            suggestions.push({
                text: 'ส่งได้เลยครับ ใช้ Kerry/Flash ส่งถึงภายใน 1-2 วันทำการ',
                confidence: 0.85,
                category: 'shipping',
                variations: [
                    'จัดส่ง Kerry, Flash, ไปรษณีย์ได้หมดครับ',
                    'สั่งวันนี้ส่งพรุ่งนี้ครับ ได้ของเร็วแน่นอน'
                ]
            })
        }
    }

    // Meeting request
    if (lowerMessage.includes('นัด') || lowerMessage.includes('ดูของ') || lowerMessage.includes('พบ')) {
        if (role === 'seller') {
            suggestions.push({
                text: 'นัดดูได้ครับ แนะนำจุดนัดพบที่มีความปลอดภัย เช่น หน้าห้าง หรือสถานีรถไฟฟ้า',
                confidence: 0.8,
                category: 'meetup',
                tips: '⚠️ แนะนำนัดพบในที่สาธารณะเพื่อความปลอดภัย',
                variations: [
                    'ได้ครับ สะดวกวันไหนบ้างครับ?',
                    'นัดได้เลยครับ นัดเจอที่ BTS/MRT สะดวกไหมครับ?'
                ]
            })
        }
    }

    return suggestions
}

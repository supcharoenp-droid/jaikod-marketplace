import { Order } from '@/types'

export interface OrderAiAlert {
    orderId: string
    type: 'late_shipping' | 'customer_message' | 'review_warning' | 'payment_issue'
    severity: 'high' | 'medium' | 'low'
    title: {
        th: string
        en: string
    }
    message: {
        th: string
        en: string
    }
    action?: {
        label: { th: string; en: string }
        onClick: () => void
    }
    icon: string
}

export interface MessageSuggestion {
    scenario: string
    messages: {
        th: string[]
        en: string[]
    }
}

// Order status with clear colors and labels
export const ORDER_STATUS_CONFIG = {
    pending: {
        label: { th: 'รอชำระเงิน', en: 'Pending Payment' },
        color: 'amber',
        bg: 'bg-amber-100 dark:bg-amber-900/30',
        text: 'text-amber-700 dark:text-amber-300',
        border: 'border-amber-300 dark:border-amber-700',
        icon: '⏳'
    },
    paid: {
        label: { th: 'ชำระแล้ว - รอจัดส่ง', en: 'Paid - Ready to Ship' },
        color: 'blue',
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-300 dark:border-blue-700',
        icon: '📦'
    },
    shipping: {
        label: { th: 'กำลังจัดส่ง', en: 'Shipping' },
        color: 'purple',
        bg: 'bg-purple-100 dark:bg-purple-900/30',
        text: 'text-purple-700 dark:text-purple-300',
        border: 'border-purple-300 dark:border-purple-700',
        icon: '🚚'
    },
    completed: {
        label: { th: 'สำเร็จ', en: 'Completed' },
        color: 'green',
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-300',
        border: 'border-green-300 dark:border-green-700',
        icon: '✅'
    },
    cancelled: {
        label: { th: 'ยกเลิก', en: 'Cancelled' },
        color: 'red',
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-300',
        border: 'border-red-300 dark:border-red-700',
        icon: '❌'
    },
    refund: {
        label: { th: 'คืนเงิน', en: 'Refunded' },
        color: 'orange',
        bg: 'bg-orange-100 dark:bg-orange-900/30',
        text: 'text-orange-700 dark:text-orange-300',
        border: 'border-orange-300 dark:border-orange-700',
        icon: '💰'
    }
}

// Detect late shipping risk
export function detectLateShippingRisk(order: Order): OrderAiAlert | null {
    if (order.status !== 'paid') return null

    const hoursSincePaid = (Date.now() - new Date(order.created_at).getTime()) / (1000 * 60 * 60)

    // High risk: > 48 hours
    if (hoursSincePaid > 48) {
        return {
            orderId: order.id,
            type: 'late_shipping',
            severity: 'high',
            title: {
                th: '⚠️ เสี่ยงส่งช้า!',
                en: '⚠️ Late Shipping Risk!'
            },
            message: {
                th: `ออเดอร์ #${order.order_number} รอจัดส่งมา ${Math.floor(hoursSincePaid)} ชั่วโมงแล้ว ลูกค้าอาจไม่พอใจ`,
                en: `Order #${order.order_number} waiting ${Math.floor(hoursSincePaid)} hours. Customer may be unhappy.`
            },
            icon: '🚨'
        }
    }

    // Medium risk: > 24 hours
    if (hoursSincePaid > 24) {
        return {
            orderId: order.id,
            type: 'late_shipping',
            severity: 'medium',
            title: {
                th: '⏰ ควรจัดส่งเร็ว ๆ',
                en: '⏰ Should Ship Soon'
            },
            message: {
                th: `ออเดอร์ #${order.order_number} รอมา ${Math.floor(hoursSincePaid)} ชั่วโมง ลองจัดส่งวันนี้`,
                en: `Order #${order.order_number} waiting ${Math.floor(hoursSincePaid)} hours. Try shipping today.`
            },
            icon: '⏱️'
        }
    }

    return null
}

// Generate message suggestions for customer
export function generateMessageSuggestions(scenario: 'shipping_delay' | 'thank_you' | 'problem_solving' | 'follow_up', language: 'th' | 'en' = 'th'): string[] {
    const suggestions: Record<string, { th: string[]; en: string[] }> = {
        shipping_delay: {
            th: [
                'สวัสดีครับ ขออภัยที่ส่งช้ากว่ากำหนด วันนี้จะจัดส่งให้แน่นอนครับ 🙏',
                'ขอโทษด้วยนะครับ มีออเดอร์เยอะหน่อย วันนี้จะส่งให้เลยครับ ขอบคุณที่รอนะครับ',
                'ขอโทษจริง ๆ ครับ พรุ่งนี้จะได้รับแน่นอน ขอบคุณที่เข้าใจครับ 🙇'
            ],
            en: [
                'Hello! Sorry for the delay. Will ship today for sure 🙏',
                'Apologies for the wait. Lots of orders. Shipping today. Thanks for your patience!',
                'Really sorry! You\'ll receive it tomorrow for sure. Thank you for understanding 🙇'
            ]
        },
        thank_you: {
            th: [
                'ขอบคุณที่สั่งซื้อครับ 🙏 ได้รับสินค้าแล้วรบกวนรีวิวด้วยนะครับ',
                'ขอบคุณมาก ๆ ครับ หวังว่าจะชอบนะครับ ถ้ามีปัญหาแจ้งได้เลยครับ',
                'ขอบคุณที่อุดหนุนครับ ถ้าพอใจช่วยรีวิวให้หน่อยนะครับ 🙏'
            ],
            en: [
                'Thank you for your order! 🙏 Please leave a review when you receive it',
                'Thank you so much! Hope you like it. Let me know if any issues.',
                'Thanks for supporting! Please review if satisfied 🙏'
            ]
        },
        problem_solving: {
            th: [
                'ขอโทษครับ ผมจะแก้ไขให้ทันที รบกวนส่งรูปมาให้ดูหน่อยได้ไหมครับ',
                'เสียใจด้วยนะครับ ผมจะรับผิดชอบเต็มที่ครับ จะแก้ไขให้เร็วที่สุด',
                'ขอโทษจริง ๆ ครับ ผมจะส่งของใหม่ให้เลยครับ ไม่ต้องส่งคืนครับ'
            ],
            en: [
                'Sorry about that. Will fix immediately. Can you send a photo?',
                'Sorry to hear that. I take full responsibility. Will resolve ASAP.',
                'Really sorry! I\'ll send a new one. No need to return.'
            ]
        },
        follow_up: {
            th: [
                'สวัสดีครับ ได้รับสินค้าแล้วใช่ไหมครับ ถ้ามีปัญหาแจ้งได้เลยนะครับ',
                'สินค้าเป็นอย่างไรบ้างครับ ถ้าพอใจช่วยรีวิวให้หน่อยนะครับ 🙏',
                'ได้รับสินค้าเรียบร้อยแล้วใช่ไหมครับ ขอบคุณที่สั่งซื้อครับ'
            ],
            en: [
                'Hi! Did you receive the item? Let me know if any issues.',
                'How is the product? Please review if satisfied 🙏',
                'Received the item okay? Thank you for your order!'
            ]
        }
    }

    return suggestions[scenario][language]
}

// Detect risky reviews
export function detectRiskyReview(review: {
    rating: number
    comment: string
    created_at: string
}): OrderAiAlert | null {
    // Low rating (1-2 stars)
    if (review.rating <= 2) {
        return {
            orderId: '', // Will be filled by caller
            type: 'review_warning',
            severity: 'high',
            title: {
                th: '⚠️ รีวิวไม่ดี!',
                en: '⚠️ Bad Review!'
            },
            message: {
                th: `ลูกค้าให้ ${review.rating} ดาว ควรตอบกลับและแก้ไขปัญหาทันที`,
                en: `Customer gave ${review.rating} stars. Should respond and resolve immediately.`
            },
            icon: '😟'
        }
    }

    // Check for negative keywords
    const negativeKeywords = {
        th: ['แย่', 'ไม่ดี', 'ผิดหวัง', 'ไม่ตรง', 'ปลอม', 'เสีย', 'ช้า'],
        en: ['bad', 'terrible', 'disappointed', 'fake', 'broken', 'slow', 'worst']
    }

    const commentLower = review.comment.toLowerCase()
    const hasNegative = [...negativeKeywords.th, ...negativeKeywords.en].some(
        keyword => commentLower.includes(keyword.toLowerCase())
    )

    if (hasNegative && review.rating <= 3) {
        return {
            orderId: '',
            type: 'review_warning',
            severity: 'medium',
            title: {
                th: '⚠️ รีวิวมีคำเชิงลบ',
                en: '⚠️ Negative Review'
            },
            message: {
                th: 'พบคำเชิงลบในรีวิว ควรตอบกลับและอธิบาย',
                en: 'Negative words found. Should respond and explain.'
            },
            icon: '😕'
        }
    }

    return null
}

// Generate review response suggestions
export function generateReviewResponseSuggestions(review: {
    rating: number
    comment: string
}, language: 'th' | 'en' = 'th'): string[] {
    const suggestions: string[] = []

    if (review.rating >= 4) {
        // Positive review
        suggestions.push(
            language === 'th'
                ? 'ขอบคุณมาก ๆ ครับ ยินดีที่ได้รับความไว้วางใจ หวังว่าจะได้อุดหนุนอีกนะครับ 🙏'
                : 'Thank you so much! Glad you trust us. Hope to serve you again 🙏'
        )
        suggestions.push(
            language === 'th'
                ? 'ขอบคุณสำหรับรีวิวดี ๆ ครับ ดีใจมาก ๆ เลยครับ 😊'
                : 'Thanks for the great review! Really appreciate it 😊'
        )
    } else {
        // Negative review
        suggestions.push(
            language === 'th'
                ? 'ขอโทษจริง ๆ ครับที่ทำให้ผิดหวัง ผมจะปรับปรุงให้ดีขึ้นครับ ขอบคุณที่แจ้งครับ 🙏'
                : 'Really sorry for the disappointment. Will improve. Thank you for letting us know 🙏'
        )
        suggestions.push(
            language === 'th'
                ? 'เสียใจมาก ๆ ครับ ถ้ามีปัญหาอะไรแจ้งผมได้เลยนะครับ จะแก้ไขให้ทันทีครับ'
                : 'Very sorry to hear that. Please let me know any issues. Will fix immediately.'
        )
        suggestions.push(
            language === 'th'
                ? 'ขอโทษด้วยครับ ผมจะรับผิดชอบเต็มที่ รบกวนติดต่อผมโดยตรงได้ไหมครับ'
                : 'Apologies. I take full responsibility. Can you contact me directly?'
        )
    }

    return suggestions
}

// Get all AI alerts for orders
export function getOrderAiAlerts(orders: Order[]): OrderAiAlert[] {
    const alerts: OrderAiAlert[] = []

    orders.forEach(order => {
        const lateShippingAlert = detectLateShippingRisk(order)
        if (lateShippingAlert) {
            alerts.push(lateShippingAlert)
        }
    })

    // Sort by severity
    return alerts.sort((a, b) => {
        const severityOrder = { high: 0, medium: 1, low: 2 }
        return severityOrder[a.severity] - severityOrder[b.severity]
    })
}

import { SellerType } from '@/types/onboarding'

export interface AiInsight {
    id: string
    type: 'action' | 'tip' | 'warning' | 'success'
    priority: 'high' | 'medium' | 'low'
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
        href: string
    }
    icon: string
}

// Generate AI insights based on seller data
export function generateAiInsights(sellerData: {
    productCount: number
    salesCount: number
    hasVerification: boolean
    hasBankAccount: boolean
    responseRate: number
    sellerType?: SellerType
    lastProductDate?: string
}): AiInsight[] {
    const insights: AiInsight[] = []

    // Priority 1: No products yet
    if (sellerData.productCount === 0) {
        insights.push({
            id: 'first_product',
            type: 'action',
            priority: 'high',
            title: {
                th: 'โพสสินค้าชิ้นแรกของคุณ',
                en: 'Post Your First Product'
            },
            message: {
                th: 'เริ่มต้นขายได้เลย! ถ่ายรูปสินค้า AI จะช่วยเติมรายละเอียดให้',
                en: 'Start selling now! Take a photo and AI will help fill in the details'
            },
            action: {
                label: { th: 'เริ่มโพสสินค้า', en: 'Start Posting' },
                href: '/sell'
            },
            icon: '📦'
        })
        return insights
    }

    // Priority 2: Few products (1-4)
    if (sellerData.productCount < 5) {
        insights.push({
            id: 'add_more_products',
            type: 'tip',
            priority: 'high',
            title: {
                th: 'เพิ่มสินค้าอีกหน่อย',
                en: 'Add More Products'
            },
            message: {
                th: `คุณมีสินค้า ${sellerData.productCount} ชิ้น ลองเพิ่มอีก ${5 - sellerData.productCount} ชิ้นเพื่อปลดล็อกฟีเจอร์ใหม่`,
                en: `You have ${sellerData.productCount} products. Add ${5 - sellerData.productCount} more to unlock new features`
            },
            action: {
                label: { th: 'เพิ่มสินค้า', en: 'Add Product' },
                href: '/sell'
            },
            icon: '🎯'
        })
        return insights
    }

    // Priority 3: No sales yet but has products
    if (sellerData.salesCount === 0 && sellerData.productCount >= 5) {
        insights.push({
            id: 'optimize_pricing',
            type: 'tip',
            priority: 'high',
            title: {
                th: 'ลองปรับราคาดูไหม?',
                en: 'Try Adjusting Your Prices?'
            },
            message: {
                th: 'ยังไม่มียอดขาย ลองใช้ AI แนะนำราคาที่เหมาะสม หรือลดราคา 10% ดู',
                en: 'No sales yet? Try AI price suggestions or reduce prices by 10%'
            },
            action: {
                label: { th: 'ดูสินค้าของฉัน', en: 'View My Products' },
                href: '/seller/products'
            },
            icon: '💰'
        })
        return insights
    }

    // Priority 4: No verification
    if (!sellerData.hasVerification && sellerData.salesCount > 0) {
        insights.push({
            id: 'verify_account',
            type: 'action',
            priority: 'medium',
            title: {
                th: 'ยืนยันตัวตนเพื่อสร้างความเชื่อถือ',
                en: 'Verify Your Identity to Build Trust'
            },
            message: {
                th: 'ผู้ซื้อมั่นใจมากขึ้น 3 เท่าเมื่อซื้อจากผู้ขายที่ยืนยันตัวตนแล้ว',
                en: 'Buyers are 3x more confident buying from verified sellers'
            },
            action: {
                label: { th: 'ยืนยันตัวตน', en: 'Verify Now' },
                href: '/seller/settings'
            },
            icon: '✅'
        })
        return insights
    }

    // Priority 5: No bank account
    if (!sellerData.hasBankAccount && sellerData.salesCount > 0) {
        insights.push({
            id: 'add_bank',
            type: 'warning',
            priority: 'high',
            title: {
                th: 'เพิ่มบัญชีธนาคารเพื่อรับเงิน',
                en: 'Add Bank Account to Receive Payments'
            },
            message: {
                th: 'คุณมียอดขายแล้ว! เพิ่มบัญชีธนาคารเพื่อรับเงินได้เลย',
                en: 'You have sales! Add your bank account to receive payments'
            },
            action: {
                label: { th: 'เพิ่มบัญชี', en: 'Add Account' },
                href: '/seller/settings'
            },
            icon: '🏦'
        })
        return insights
    }

    // Priority 6: Low response rate
    if (sellerData.responseRate < 80) {
        insights.push({
            id: 'improve_response',
            type: 'tip',
            priority: 'medium',
            title: {
                th: 'ตอบแชทเร็วขึ้นหน่อย',
                en: 'Respond to Messages Faster'
            },
            message: {
                th: `อัตราตอบกลับของคุณ ${sellerData.responseRate}% ลองตอบภายใน 1 ชั่วโมง จะช่วยเพิ่มยอดขาย`,
                en: `Your response rate is ${sellerData.responseRate}%. Try replying within 1 hour to boost sales`
            },
            action: {
                label: { th: 'ดูข้อความ', en: 'View Messages' },
                href: '/seller/messages'
            },
            icon: '💬'
        })
        return insights
    }

    // Priority 7: Inactive seller (no new products in 7 days)
    if (sellerData.lastProductDate) {
        const daysSinceLastProduct = Math.floor(
            (Date.now() - new Date(sellerData.lastProductDate).getTime()) / (1000 * 60 * 60 * 24)
        )

        if (daysSinceLastProduct > 7) {
            insights.push({
                id: 'stay_active',
                type: 'tip',
                priority: 'low',
                title: {
                    th: 'โพสสินค้าใหม่เพื่อเพิ่มยอดขาย',
                    en: 'Post New Products to Boost Sales'
                },
                message: {
                    th: `ไม่ได้โพสสินค้ามา ${daysSinceLastProduct} วันแล้ว ลองเพิ่มสินค้าใหม่เพื่อดึงดูดลูกค้า`,
                    en: `No new products in ${daysSinceLastProduct} days. Add fresh items to attract buyers`
                },
                action: {
                    label: { th: 'เพิ่มสินค้า', en: 'Add Product' },
                    href: '/sell'
                },
                icon: '🔄'
            })
            return insights
        }
    }

    // Default: Doing great!
    insights.push({
        id: 'doing_great',
        type: 'success',
        priority: 'low',
        title: {
            th: 'ทำได้ดีมาก! 🎉',
            en: 'You\'re Doing Great! 🎉'
        },
        message: {
            th: 'ร้านของคุณดูดีมาก ลองเช็คยอดขายและรีวิวจากลูกค้าดูนะ',
            en: 'Your shop looks great! Check your sales and customer reviews'
        },
        action: {
            label: { th: 'ดูรายงาน', en: 'View Reports' },
            href: '/seller/analytics'
        },
        icon: '⭐'
    })

    return insights
}

// Get today's actionable insight (top priority)
export function getTodayInsight(sellerData: Parameters<typeof generateAiInsights>[0]): AiInsight {
    const insights = generateAiInsights(sellerData)
    return insights[0] // Return highest priority
}

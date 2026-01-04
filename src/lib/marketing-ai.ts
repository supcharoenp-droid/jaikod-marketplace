import { UnlockStage } from '@/types/progressive-unlock'

export type PromoType =
    | 'flash_sale'       // ลดราคาด่วน
    | 'bundle_deal'      // ซื้อครบลดเพิ่ม
    | 'free_shipping'    // ส่งฟรี
    | 'buy_x_get_y'      // ซื้อ X แถม Y
    | 'seasonal'         // โปรโมชันตามฤดูกาล
    | 'clearance'        // ปลดสต็อก

export interface PromoRecommendation {
    id: string
    type: PromoType
    title: {
        th: string
        en: string
    }
    description: {
        th: string
        en: string
    }
    reasoning: {
        th: string
        en: string
    }
    expectedImpact: {
        salesIncrease: number  // % increase
        reachIncrease: number  // % increase
    }
    difficulty: 'easy' | 'medium' | 'hard'
    requiredStage: UnlockStage
    config: {
        discountPercent?: number
        minPurchase?: number
        duration?: number  // days
        targetProducts?: string[]
    }
    icon: string
}

// AI analyzes seller data and recommends promotions
export function generatePromoRecommendations(sellerData: {
    productCount: number
    salesCount: number
    avgOrderValue: number
    topProducts: Array<{ id: string; sales: number; stock: number }>
    slowMovingProducts: Array<{ id: string; stock: number; daysSinceLastSale: number }>
    currentStage: UnlockStage
}): PromoRecommendation[] {
    const recommendations: PromoRecommendation[] = []

    // 1. Flash Sale (for new sellers with few sales)
    if (sellerData.salesCount < 10) {
        recommendations.push({
            id: 'flash_sale_newbie',
            type: 'flash_sale',
            title: {
                th: 'ลดราคาด่วน 24 ชั่วโมง',
                en: '24-Hour Flash Sale'
            },
            description: {
                th: 'ลดราคาสินค้าทั้งหมด 15-20% เพื่อดึงดูดลูกค้าคนแรก',
                en: 'Discount all products 15-20% to attract first customers'
            },
            reasoning: {
                th: `คุณมียอดขายเพียง ${sellerData.salesCount} รายการ ลดราคาจะช่วยดึงดูดลูกค้าใหม่ได้เร็ว`,
                en: `You have only ${sellerData.salesCount} sales. Price discount attracts new customers quickly.`
            },
            expectedImpact: {
                salesIncrease: 150,
                reachIncrease: 200
            },
            difficulty: 'easy',
            requiredStage: 'beginner',
            config: {
                discountPercent: 15,
                duration: 1
            },
            icon: '⚡'
        })
    }

    // 2. Free Shipping (for sellers with moderate sales)
    if (sellerData.salesCount >= 5 && sellerData.avgOrderValue > 200) {
        recommendations.push({
            id: 'free_shipping',
            type: 'free_shipping',
            title: {
                th: 'ส่งฟรีเมื่อซื้อครบ',
                en: 'Free Shipping on Orders Over'
            },
            description: {
                th: `ส่งฟรีเมื่อซื้อครบ ${Math.ceil(sellerData.avgOrderValue * 1.2)} บาท`,
                en: `Free shipping on orders over ฿${Math.ceil(sellerData.avgOrderValue * 1.2)}`
            },
            reasoning: {
                th: `ยอดซื้อเฉลี่ยของคุณคือ ${sellerData.avgOrderValue.toFixed(0)} บาท ส่งฟรีจะกระตุ้นให้ซื้อเพิ่ม`,
                en: `Your average order is ฿${sellerData.avgOrderValue.toFixed(0)}. Free shipping encourages larger purchases.`
            },
            expectedImpact: {
                salesIncrease: 80,
                reachIncrease: 120
            },
            difficulty: 'easy',
            requiredStage: 'beginner',
            config: {
                minPurchase: Math.ceil(sellerData.avgOrderValue * 1.2),
                duration: 7
            },
            icon: '🚚'
        })
    }

    // 3. Bundle Deal (for sellers with multiple products)
    if (sellerData.productCount >= 5) {
        recommendations.push({
            id: 'bundle_deal',
            type: 'bundle_deal',
            title: {
                th: 'ซื้อครบลดเพิ่ม',
                en: 'Buy More Save More'
            },
            description: {
                th: 'ซื้อ 2 ชิ้นลด 10%, ซื้อ 3 ชิ้นลด 15%',
                en: 'Buy 2 get 10% off, Buy 3 get 15% off'
            },
            reasoning: {
                th: `คุณมีสินค้า ${sellerData.productCount} รายการ Bundle จะช่วยเพิ่มยอดขายต่อออเดอร์`,
                en: `You have ${sellerData.productCount} products. Bundles increase sales per order.`
            },
            expectedImpact: {
                salesIncrease: 100,
                reachIncrease: 80
            },
            difficulty: 'medium',
            requiredStage: 'intermediate',
            config: {
                discountPercent: 10,
                duration: 14
            },
            icon: '📦'
        })
    }

    // 4. Clearance Sale (for slow-moving inventory)
    if (sellerData.slowMovingProducts.length > 0) {
        const avgDaysSinceLastSale = sellerData.slowMovingProducts.reduce(
            (sum, p) => sum + p.daysSinceLastSale, 0
        ) / sellerData.slowMovingProducts.length

        recommendations.push({
            id: 'clearance_sale',
            type: 'clearance',
            title: {
                th: 'ปลดสต็อก - ลดสูงสุด 30%',
                en: 'Clearance Sale - Up to 30% Off'
            },
            description: {
                th: `ลดราคาสินค้าที่ขายช้า ${sellerData.slowMovingProducts.length} รายการ`,
                en: `Discount ${sellerData.slowMovingProducts.length} slow-moving items`
            },
            reasoning: {
                th: `คุณมีสินค้าที่ไม่ขายมา ${avgDaysSinceLastSale.toFixed(0)} วัน ปลดสต็อกจะช่วยหมุนเงินได้เร็ว`,
                en: `You have items not sold for ${avgDaysSinceLastSale.toFixed(0)} days. Clearance helps cash flow.`
            },
            expectedImpact: {
                salesIncrease: 120,
                reachIncrease: 100
            },
            difficulty: 'easy',
            requiredStage: 'intermediate',
            config: {
                discountPercent: 25,
                duration: 7,
                targetProducts: sellerData.slowMovingProducts.map(p => p.id)
            },
            icon: '🏷️'
        })
    }

    // 5. Buy X Get Y (for sellers with good sales)
    if (sellerData.salesCount >= 20 && sellerData.topProducts.length >= 2) {
        recommendations.push({
            id: 'buy_x_get_y',
            type: 'buy_x_get_y',
            title: {
                th: 'ซื้อ 1 แถม 1',
                en: 'Buy 1 Get 1'
            },
            description: {
                th: 'ซื้อสินค้าขายดี แถมสินค้าอื่นฟรี',
                en: 'Buy bestseller, get another item free'
            },
            reasoning: {
                th: `คุณมีสินค้าขายดี ${sellerData.topProducts.length} รายการ BOGO จะช่วยปลดสต็อกสินค้าอื่น`,
                en: `You have ${sellerData.topProducts.length} bestsellers. BOGO helps clear other inventory.`
            },
            expectedImpact: {
                salesIncrease: 140,
                reachIncrease: 150
            },
            difficulty: 'medium',
            requiredStage: 'advanced',
            config: {
                duration: 7,
                targetProducts: sellerData.topProducts.map(p => p.id)
            },
            icon: '🎁'
        })
    }

    // 6. Seasonal Promo (for experienced sellers)
    if (sellerData.salesCount >= 50) {
        const currentMonth = new Date().getMonth()
        const seasonalEvents = {
            0: { th: 'ปีใหม่', en: 'New Year' },
            1: { th: 'วาเลนไทน์', en: 'Valentine' },
            3: { th: 'สงกรานต์', en: 'Songkran' },
            11: { th: 'ปีใหม่', en: 'New Year' }
        }

        const event = seasonalEvents[currentMonth as keyof typeof seasonalEvents]

        if (event) {
            recommendations.push({
                id: 'seasonal_promo',
                type: 'seasonal',
                title: {
                    th: `โปรโมชัน${event.th}`,
                    en: `${event.en} Promotion`
                },
                description: {
                    th: `สร้างแคมเปญพิเศษช่วง${event.th}`,
                    en: `Create special ${event.en} campaign`
                },
                reasoning: {
                    th: `ช่วง${event.th}เป็นช่วงที่คนซื้อของมาก แคมเปญพิเศษจะช่วยเพิ่มยอดขาย`,
                    en: `${event.en} is high shopping season. Special campaign boosts sales.`
                },
                expectedImpact: {
                    salesIncrease: 180,
                    reachIncrease: 200
                },
                difficulty: 'hard',
                requiredStage: 'expert',
                config: {
                    discountPercent: 20,
                    duration: 7
                },
                icon: '🎉'
            })
        }
    }

    // Filter by current stage
    return recommendations
        .filter(rec => {
            const stageOrder: UnlockStage[] = ['beginner', 'intermediate', 'advanced', 'expert']
            const userStageIndex = stageOrder.indexOf(sellerData.currentStage)
            const requiredStageIndex = stageOrder.indexOf(rec.requiredStage)
            return userStageIndex >= requiredStageIndex
        })
        .sort((a, b) => b.expectedImpact.salesIncrease - a.expectedImpact.salesIncrease)
}

// Get difficulty color
export function getDifficultyColor(difficulty: 'easy' | 'medium' | 'hard'): {
    bg: string
    text: string
} {
    const colors = {
        easy: {
            bg: 'bg-green-100 dark:bg-green-900/30',
            text: 'text-green-700 dark:text-green-300'
        },
        medium: {
            bg: 'bg-amber-100 dark:bg-amber-900/30',
            text: 'text-amber-700 dark:text-amber-300'
        },
        hard: {
            bg: 'bg-red-100 dark:bg-red-900/30',
            text: 'text-red-700 dark:text-red-300'
        }
    }

    return colors[difficulty]
}

// Get difficulty label
export function getDifficultyLabel(difficulty: 'easy' | 'medium' | 'hard', language: 'th' | 'en'): string {
    const labels = {
        easy: { th: 'ง่าย', en: 'Easy' },
        medium: { th: 'ปานกลาง', en: 'Medium' },
        hard: { th: 'ยาก', en: 'Hard' }
    }

    return labels[difficulty][language]
}

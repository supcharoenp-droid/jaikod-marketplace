/**
 * JaiKod Feature Flags System
 * 
 * Dynamic feature toggling without redeployment
 * Supports: Global, User-based, Role-based, Percentage-based rollouts
 */

import { UserRole } from './roles'

// ==========================================
// FEATURE FLAG TYPES
// ==========================================

export type FeatureFlag =
    // Core Features
    | 'ai_price_suggestion'
    | 'ai_image_search'
    | 'snap_and_sell'
    | 'instant_chat'
    | 'video_call'

    // Payment Features
    | 'jaistar_topup'
    | 'premium_subscription'
    | 'installment_payment'
    | 'escrow_protection'

    // Seller Features
    | 'shop_page'
    | 'advanced_analytics'
    | 'bulk_listing'
    | 'inventory_management'
    | 'auto_reply'

    // Buyer Features
    | 'wishlist'
    | 'price_alert'
    | 'ar_preview'
    | 'virtual_try_on'

    // Promotional Features
    | 'flash_sale'
    | 'voucher_system'
    | 'cashback'
    | 'referral_program'
    | 'gamification'

    // Admin Features
    | 'fraud_detection_v2'
    | 'auto_moderation'
    | 'ai_content_check'

    // Experimental
    | 'dark_mode'
    | 'new_checkout_flow'
    | 'beta_features'
    | 'ai_assistant'

export type RolloutStrategy =
    | 'global'           // Everyone
    | 'user_list'        // Specific user IDs
    | 'role_based'       // Specific roles
    | 'percentage'       // Random percentage
    | 'gradual'          // Gradually increasing percentage
    | 'ab_test'          // A/B testing

export interface FeatureFlagConfig {
    id: FeatureFlag
    name: string
    description: string
    enabled: boolean
    rolloutStrategy: RolloutStrategy

    // Rollout config
    allowedRoles?: UserRole[]
    allowedUserIds?: string[]
    percentage?: number          // 0-100
    gradualStartDate?: Date
    gradualEndDate?: Date
    abTestVariant?: 'A' | 'B'

    // Metadata
    owner: string                // Team/person responsible
    createdAt: Date
    updatedAt: Date
    expiresAt?: Date            // Auto-disable date

    // Dependencies
    dependsOn?: FeatureFlag[]   // Must be enabled for this to work

    // Metrics
    impressions: number
    conversions: number
}

// ==========================================
// DEFAULT FEATURE FLAGS
// ==========================================

const DEFAULT_FLAGS: Record<FeatureFlag, FeatureFlagConfig> = {
    // Core Features - Enabled
    ai_price_suggestion: {
        id: 'ai_price_suggestion',
        name: 'AI Price Suggestion',
        description: 'AI แนะนำราคาตามตลาด',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'ai-team',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    ai_image_search: {
        id: 'ai_image_search',
        name: 'AI Image Search',
        description: 'ค้นหาด้วยรูปภาพ',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'ai-team',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    snap_and_sell: {
        id: 'snap_and_sell',
        name: 'Snap & Sell',
        description: 'ถ่ายรูปแล้วลงขายทันที',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'product-team',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    instant_chat: {
        id: 'instant_chat',
        name: 'Instant Chat',
        description: 'แชทกับผู้ซื้อ/ผู้ขายแบบ Real-time',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'communication-team',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    video_call: {
        id: 'video_call',
        name: 'Video Call',
        description: 'วิดีโอคอลดูสินค้าก่อนซื้อ',
        enabled: false,
        rolloutStrategy: 'role_based',
        allowedRoles: ['shop_premium', 'super_admin'],
        owner: 'communication-team',
        createdAt: new Date('2024-06-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },

    // Payment Features
    jaistar_topup: {
        id: 'jaistar_topup',
        name: 'JaiStar Top-up',
        description: 'ระบบเติมแต้ม JaiStar',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'payment-team',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    premium_subscription: {
        id: 'premium_subscription',
        name: 'Premium Subscription',
        description: 'ระบบสมาชิกรายเดือน',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'payment-team',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    installment_payment: {
        id: 'installment_payment',
        name: 'Installment Payment',
        description: 'ผ่อนชำระสินค้าราคาสูง',
        enabled: false,
        rolloutStrategy: 'percentage',
        percentage: 20,
        owner: 'payment-team',
        createdAt: new Date('2024-06-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    escrow_protection: {
        id: 'escrow_protection',
        name: 'Escrow Protection',
        description: 'ระบบ Buyer Protection',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'trust-team',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },

    // Seller Features
    shop_page: {
        id: 'shop_page',
        name: 'Shop Page',
        description: 'หน้าร้านค้าเต็มรูปแบบ',
        enabled: true,
        rolloutStrategy: 'role_based',
        allowedRoles: ['shop_verified', 'shop_premium', 'super_admin'],
        owner: 'seller-team',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    advanced_analytics: {
        id: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Analytics ขั้นสูงสำหรับร้านค้า',
        enabled: true,
        rolloutStrategy: 'role_based',
        allowedRoles: ['seller_plus', 'shop_verified', 'shop_premium', 'super_admin'],
        owner: 'analytics-team',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    bulk_listing: {
        id: 'bulk_listing',
        name: 'Bulk Listing',
        description: 'ลงขายหลายรายการพร้อมกัน',
        enabled: true,
        rolloutStrategy: 'role_based',
        allowedRoles: ['shop_premium', 'super_admin'],
        owner: 'seller-team',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    inventory_management: {
        id: 'inventory_management',
        name: 'Inventory Management',
        description: 'ระบบจัดการ Stock',
        enabled: true,
        rolloutStrategy: 'role_based',
        allowedRoles: ['shop_verified', 'shop_premium', 'super_admin'],
        owner: 'seller-team',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    auto_reply: {
        id: 'auto_reply',
        name: 'Auto Reply',
        description: 'ตอบกลับอัตโนมัติ',
        enabled: true,
        rolloutStrategy: 'role_based',
        allowedRoles: ['seller_plus', 'shop_verified', 'shop_premium', 'super_admin'],
        owner: 'communication-team',
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },

    // Buyer Features
    wishlist: {
        id: 'wishlist',
        name: 'Wishlist',
        description: 'รายการโปรด',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'buyer-team',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    price_alert: {
        id: 'price_alert',
        name: 'Price Alert',
        description: 'แจ้งเตือนเมื่อราคาลด',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'buyer-team',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    ar_preview: {
        id: 'ar_preview',
        name: 'AR Preview',
        description: 'ดูสินค้าด้วย AR',
        enabled: false,
        rolloutStrategy: 'percentage',
        percentage: 5,
        owner: 'innovation-team',
        createdAt: new Date('2024-09-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    virtual_try_on: {
        id: 'virtual_try_on',
        name: 'Virtual Try-On',
        description: 'ลองเสื้อผ้าแบบ Virtual',
        enabled: false,
        rolloutStrategy: 'percentage',
        percentage: 0,
        owner: 'innovation-team',
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },

    // Promotional Features
    flash_sale: {
        id: 'flash_sale',
        name: 'Flash Sale',
        description: 'ระบบ Flash Sale',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'marketing-team',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    voucher_system: {
        id: 'voucher_system',
        name: 'Voucher System',
        description: 'ระบบคูปองส่วนลด',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'marketing-team',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    cashback: {
        id: 'cashback',
        name: 'Cashback',
        description: 'เงินคืนเมื่อซื้อสินค้า',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'marketing-team',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    referral_program: {
        id: 'referral_program',
        name: 'Referral Program',
        description: 'ชวนเพื่อนรับ Coins',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'growth-team',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    gamification: {
        id: 'gamification',
        name: 'Gamification',
        description: 'ระบบ Mission & Rewards',
        enabled: false,
        rolloutStrategy: 'gradual',
        percentage: 30,
        gradualStartDate: new Date('2024-12-01'),
        gradualEndDate: new Date('2025-01-31'),
        owner: 'growth-team',
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },

    // Admin Features
    fraud_detection_v2: {
        id: 'fraud_detection_v2',
        name: 'Fraud Detection V2',
        description: 'AI Fraud Detection รุ่นใหม่',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'trust-team',
        createdAt: new Date('2024-06-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    auto_moderation: {
        id: 'auto_moderation',
        name: 'Auto Moderation',
        description: 'ตรวจสอบเนื้อหาอัตโนมัติ',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'trust-team',
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    ai_content_check: {
        id: 'ai_content_check',
        name: 'AI Content Check',
        description: 'ตรวจจับเนื้อหาไม่เหมาะสมด้วย AI',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'trust-team',
        createdAt: new Date('2024-05-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },

    // Experimental
    dark_mode: {
        id: 'dark_mode',
        name: 'Dark Mode',
        description: 'โหมดมืด',
        enabled: true,
        rolloutStrategy: 'global',
        owner: 'frontend-team',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    new_checkout_flow: {
        id: 'new_checkout_flow',
        name: 'New Checkout Flow',
        description: 'ขั้นตอนชำระเงินแบบใหม่',
        enabled: false,
        rolloutStrategy: 'ab_test',
        abTestVariant: 'B',
        percentage: 50,
        owner: 'checkout-team',
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    beta_features: {
        id: 'beta_features',
        name: 'Beta Features',
        description: 'ฟีเจอร์ Beta สำหรับทดสอบ',
        enabled: false,
        rolloutStrategy: 'user_list',
        allowedUserIds: [],
        owner: 'product-team',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
    ai_assistant: {
        id: 'ai_assistant',
        name: 'AI Assistant',
        description: 'ผู้ช่วย AI ตอบคำถาม',
        enabled: false,
        rolloutStrategy: 'percentage',
        percentage: 10,
        owner: 'ai-team',
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date(),
        impressions: 0,
        conversions: 0
    },
}

// ==========================================
// FEATURE FLAG SERVICE
// ==========================================

class FeatureFlagService {
    private flags: Map<FeatureFlag, FeatureFlagConfig>

    constructor() {
        this.flags = new Map(Object.entries(DEFAULT_FLAGS) as [FeatureFlag, FeatureFlagConfig][])
    }

    // Check if feature is enabled for a user
    isEnabled(
        flagId: FeatureFlag,
        userId?: string,
        userRole?: UserRole
    ): boolean {
        const flag = this.flags.get(flagId)
        if (!flag || !flag.enabled) return false

        // Check expiry
        if (flag.expiresAt && new Date() > flag.expiresAt) {
            return false
        }

        // Check dependencies
        if (flag.dependsOn) {
            for (const dep of flag.dependsOn) {
                if (!this.isEnabled(dep, userId, userRole)) {
                    return false
                }
            }
        }

        switch (flag.rolloutStrategy) {
            case 'global':
                return true

            case 'user_list':
                return userId ? (flag.allowedUserIds?.includes(userId) ?? false) : false

            case 'role_based':
                return userRole ? (flag.allowedRoles?.includes(userRole) ?? false) : false

            case 'percentage':
            case 'ab_test':
                if (!userId) return false
                // Deterministic hash based on userId + flagId
                const hash = this.hashCode(`${userId}:${flagId}`)
                const percentage = flag.percentage ?? 0
                return (Math.abs(hash) % 100) < percentage

            case 'gradual':
                if (!userId || !flag.gradualStartDate || !flag.gradualEndDate) return false
                const now = new Date()
                if (now < flag.gradualStartDate) return false
                if (now > flag.gradualEndDate) return true

                // Calculate current percentage based on time
                const totalDays = (flag.gradualEndDate.getTime() - flag.gradualStartDate.getTime()) / (1000 * 60 * 60 * 24)
                const daysPassed = (now.getTime() - flag.gradualStartDate.getTime()) / (1000 * 60 * 60 * 24)
                const currentPercentage = Math.min(100, (daysPassed / totalDays) * 100)

                const gradualHash = this.hashCode(`${userId}:${flagId}`)
                return (Math.abs(gradualHash) % 100) < currentPercentage

            default:
                return false
        }
    }

    // Get all flags
    getAll(): FeatureFlagConfig[] {
        return Array.from(this.flags.values())
    }

    // Get single flag config
    getFlag(flagId: FeatureFlag): FeatureFlagConfig | undefined {
        return this.flags.get(flagId)
    }

    // Update flag
    updateFlag(flagId: FeatureFlag, updates: Partial<FeatureFlagConfig>): void {
        const existing = this.flags.get(flagId)
        if (existing) {
            this.flags.set(flagId, {
                ...existing,
                ...updates,
                updatedAt: new Date()
            })
        }
    }

    // Enable flag
    enable(flagId: FeatureFlag): void {
        this.updateFlag(flagId, { enabled: true })
    }

    // Disable flag
    disable(flagId: FeatureFlag): void {
        this.updateFlag(flagId, { enabled: false })
    }

    // Add user to beta list
    addBetaTester(flagId: FeatureFlag, userId: string): void {
        const flag = this.flags.get(flagId)
        if (flag && flag.rolloutStrategy === 'user_list') {
            const allowedUserIds = flag.allowedUserIds || []
            if (!allowedUserIds.includes(userId)) {
                this.updateFlag(flagId, {
                    allowedUserIds: [...allowedUserIds, userId]
                })
            }
        }
    }

    // Track impression
    trackImpression(flagId: FeatureFlag): void {
        const flag = this.flags.get(flagId)
        if (flag) {
            this.updateFlag(flagId, { impressions: flag.impressions + 1 })
        }
    }

    // Track conversion
    trackConversion(flagId: FeatureFlag): void {
        const flag = this.flags.get(flagId)
        if (flag) {
            this.updateFlag(flagId, { conversions: flag.conversions + 1 })
        }
    }

    // Get metrics
    getMetrics(flagId: FeatureFlag): { impressions: number; conversions: number; rate: number } | null {
        const flag = this.flags.get(flagId)
        if (!flag) return null

        return {
            impressions: flag.impressions,
            conversions: flag.conversions,
            rate: flag.impressions > 0 ? (flag.conversions / flag.impressions) * 100 : 0
        }
    }

    // Simple hash function for consistent bucketing
    private hashCode(str: string): number {
        let hash = 0
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i)
            hash = ((hash << 5) - hash) + char
            hash = hash & hash
        }
        return hash
    }
}

// Singleton instance
export const featureFlags = new FeatureFlagService()

// ==========================================
// REACT HOOKS
// ==========================================

export function useFeatureFlag(
    flagId: FeatureFlag,
    userId?: string,
    userRole?: UserRole
): boolean {
    return featureFlags.isEnabled(flagId, userId, userRole)
}

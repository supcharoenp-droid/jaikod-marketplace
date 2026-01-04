/**
 * ============================================
 * JaiKod Platform Configuration
 * ============================================
 * 
 * Central configuration for all platform features
 * Toggle between Classified Mode and Marketplace Mode
 * 
 * Usage:
 *   import { platformConfig, isMarketplaceMode } from '@/config/platform'
 */

// ============================================
// PLATFORM MODE
// ============================================

export type PlatformMode = 'classified' | 'marketplace'

export const CURRENT_MODE: PlatformMode = 'classified' // ← เปลี่ยนเป็น 'marketplace' เมื่อพร้อม

// ============================================
// FEATURE FLAGS
// ============================================

export const FEATURE_FLAGS = {
    // ======== CLASSIFIED MODE (Phase 1) ========
    // เปิดใช้ตอนนี้

    /** ระบบลงประกาศ */
    LISTING_ENABLED: true,

    /** AI วิเคราะห์รูป */
    AI_VISION_ENABLED: true,

    /** AI สร้าง Title/Description */
    AI_CONTENT_GENERATION: true,

    /** AI ประเมินราคา */
    AI_PRICE_ESTIMATION: true,

    /** Chat ระหว่างผู้ซื้อ-ผู้ขาย */
    CHAT_ENABLED: true,

    /** ระบบแฟ้มโปรด */
    FAVORITES_ENABLED: true,

    /** ระบบค้นหา */
    SEARCH_ENABLED: true,

    /** Seller Shop Pages */
    SELLER_SHOP_ENABLED: true,

    /** Admin Dashboard */
    ADMIN_ENABLED: true,

    /** Phone OTP Verification - ปิดไว้ก่อน เปิดเมื่อพร้อม */
    PHONE_VERIFICATION_ENABLED: false,

    /** ID Verification (eKYC) - Phase 3 */
    ID_VERIFICATION_ENABLED: false,

    /** Bank Account Verification - Phase 2 */
    BANK_VERIFICATION_ENABLED: false,

    // ======== MARKETPLACE MODE (Phase 2) ========
    // ปิดไว้ก่อน - เปิดเมื่อพร้อม

    /** ระบบ Payment Gateway */
    PAYMENT_ENABLED: false,

    /** ระบบ Escrow (คุ้มครองผู้ซื้อ) */
    ESCROW_ENABLED: false,

    /** ระบบ Order Management */
    ORDER_SYSTEM_ENABLED: true,  // ← เปิดเพื่อทดสอบ

    /** ระบบ Shipping Integration */
    SHIPPING_ENABLED: false,

    /** Wallet System */
    WALLET_ENABLED: false,

    /** ระบบ Checkout */
    CHECKOUT_ENABLED: true,  // ← เปิดเพื่อทดสอบ

    /** ระบบ Review หลังซื้อขาย */
    POST_TRANSACTION_REVIEW: false,

    // ======== MOCK/TEST MODE ========
    // สำหรับทดสอบโดยไม่ต้องเชื่อม payment gateway จริง

    /** Mock Payment Mode - ใช้สำหรับทดสอบ */
    MOCK_PAYMENT_ENABLED: true,


    // ======== FUTURE FEATURES ========
    // Phase 3+

    /** Auction System */
    AUCTION_ENABLED: false,

    /** Live Commerce */
    LIVE_COMMERCE_ENABLED: false,

    /** Subscription Plans */
    SUBSCRIPTION_ENABLED: false,

    /** Affiliate Program */
    AFFILIATE_ENABLED: false,

} as const

// ============================================
// PLATFORM SETTINGS
// ============================================

export const PLATFORM_CONFIG = {
    // ======== GENERAL ========
    name: 'JaiKod',
    tagline: {
        th: 'ตลาดซื้อขายออนไลน์ที่ชาญฉลาด',
        en: 'AI-Powered Marketplace'
    },
    version: '1.0.0',
    mode: CURRENT_MODE,

    // ======== CONTACT ========
    contact: {
        email: 'support@jaikod.com',
        phone: '',
        line: '',
        facebook: ''
    },

    // ======== LISTING SETTINGS ========
    listing: {
        maxImagesPerListing: 10,
        maxTitleLength: 100,
        maxDescriptionLength: 5000,
        minPrice: 1,
        maxPrice: 999999999,
        autoExpireDays: 30, // ประกาศหมดอายุใน 30 วัน
        allowedImageTypes: ['image/jpeg', 'image/png', 'image/webp'],
        maxImageSizeMB: 10,
    },

    // ======== AI SETTINGS ========
    ai: {
        visionModel: 'gpt-4o-mini',
        intelligenceModel: 'gpt-4o-mini',
        maxRetries: 3,
        timeoutMs: 30000,
        enableFallback: true,
    },

    // ======== CHAT SETTINGS ========
    chat: {
        maxMessageLength: 2000,
        allowImages: true,
        allowOffers: true, // ส่ง offer ใน chat
        showPhoneNumber: false, // ซ่อนเบอร์จนกว่าจะ verify
    },

    // ======== PAYMENT SETTINGS (Phase 2) ========
    payment: {
        enabled: FEATURE_FLAGS.PAYMENT_ENABLED,
        providers: ['promptpay', 'credit_card', 'true_wallet'],
        currency: 'THB',
        minimumPayout: 100, // ถอนขั้นต่ำ 100 บาท
        platformFeePercent: 5, // ค่าธรรมเนียม 5%
        escrowHoldDays: 7, // กัน escrow 7 วัน
    },

    // ======== SHIPPING SETTINGS (Phase 2) ========
    shipping: {
        enabled: FEATURE_FLAGS.SHIPPING_ENABLED,
        providers: ['kerry', 'flash', 'jt', 'thaipost'],
        allowMeetup: true, // นัดรับสินค้า
        allowCOD: false, // เก็บเงินปลายทาง (not yet)
    },

    // ======== VERIFICATION SETTINGS ========
    verification: {
        requireEmailVerification: true,
        requirePhoneVerification: false, // Phase 2
        requireIdVerification: false, // Phase 3
        phoneVerificationProvider: 'firebase', // or 'twilio'
    },

    // ======== TRUST SCORE SETTINGS ========
    trustScore: {
        baseScore: 50,
        verifiedEmailBonus: 10,
        verifiedPhoneBonus: 20,
        verifiedIdBonus: 30,
        maxScore: 100,
    },

    // ======== MODERATION ========
    moderation: {
        autoApproveListings: true, // อนุมัติอัตโนมัติ
        flagKeywords: ['ปลอม', 'ก๊อป', 'เลียนแบบ', 'replica'],
        maxReportsBeforeReview: 3,
    },

    // ======== ANALYTICS ========
    analytics: {
        enabled: true,
        trackPageViews: true,
        trackListingViews: true,
        trackSearches: true,
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if we're in Marketplace mode
 */
export function isMarketplaceMode(): boolean {
    return CURRENT_MODE === 'marketplace'
}

/**
 * Check if we're in Classified mode
 */
export function isClassifiedMode(): boolean {
    return CURRENT_MODE === 'classified'
}

/**
 * Check if a feature is enabled
 */
export function isFeatureEnabled(feature: keyof typeof FEATURE_FLAGS): boolean {
    return FEATURE_FLAGS[feature]
}

/**
 * Get platform mode display name
 */
export function getPlatformModeName(lang: 'th' | 'en' = 'th'): string {
    if (CURRENT_MODE === 'marketplace') {
        return lang === 'th' ? 'Marketplace' : 'Marketplace'
    }
    return lang === 'th' ? 'ประกาศซื้อขาย' : 'Classifieds'
}

/**
 * Get transaction mode instructions
 */
export function getTransactionInstructions(lang: 'th' | 'en' = 'th'): string {
    if (isMarketplaceMode()) {
        return lang === 'th'
            ? 'ชำระเงินผ่านระบบอย่างปลอดภัย'
            : 'Pay securely through our platform'
    }
    return lang === 'th'
        ? 'ติดต่อผู้ขายโดยตรงเพื่อนัดรับ/จ่ายเงิน'
        : 'Contact seller directly to arrange payment'
}

// ============================================
// PHASE ROADMAP
// ============================================

export const PLATFORM_ROADMAP = {
    phase1: {
        name: 'Classified Mode',
        status: 'active',
        features: [
            'Listing with AI',
            'Search & Browse',
            'Chat between users',
            'Seller profiles',
            'Favorites',
            'Basic moderation'
        ],
        transactionFlow: 'Direct between buyer and seller'
    },
    phase2: {
        name: 'Marketplace Mode',
        status: 'planned',
        features: [
            'Payment integration (PromptPay)',
            'Escrow protection',
            'Order management',
            'Shipping integration',
            'Post-transaction reviews',
            'Wallet system'
        ],
        transactionFlow: 'Through platform with protection'
    },
    phase3: {
        name: 'Advanced Features',
        status: 'future',
        features: [
            'Auction system',
            'Live commerce',
            'Subscription for sellers',
            'Affiliate program',
            'Native mobile apps'
        ]
    }
}

// ============================================
// EXPORT DEFAULT
// ============================================

export default PLATFORM_CONFIG

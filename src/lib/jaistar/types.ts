/**
 * JaiStar Types
 * 
 * JaiStar คือแต้ม (Point) สำหรับใช้บริการภายในแพลตฟอร์ม JaiKod เท่านั้น
 * 
 * ⭐ ใช้เพื่อโปรโมทสินค้า เพิ่มการมองเห็น และปลดล็อกฟีเจอร์บางอย่าง
 * ⭐ JaiStar ไม่ใช่เงินสด ไม่ใช่สินทรัพย์ และไม่สามารถโอนหรือแลกคืนเป็นเงินได้
 */

// ==========================================
// JAISTAR ACCOUNT
// ==========================================

export interface JaiStarAccount {
    id: string
    user_id: string

    // Balance (แต้ม)
    balance: number              // แต้มที่ใช้ได้
    pending_balance: number      // แต้มรอปลดล็อก (จากโปรโมชั่น)
    lifetime_earned: number      // แต้มที่ได้รับทั้งหมด
    lifetime_spent: number       // แต้มที่ใช้ไปทั้งหมด

    // Activity
    last_activity_at?: Date
    last_topup_at?: Date

    // Tier (based on activity)
    tier: 'bronze' | 'silver' | 'gold' | 'platinum'
    tier_points: number         // คะแนนสะสมสำหรับอัพ Tier

    created_at: Date
    updated_at: Date
}

// ==========================================
// TRANSACTION TYPES
// ==========================================

export type JaiStarTransactionType =
    | 'topup'             // เติมแต้ม
    | 'boost_payment'     // ใช้โปรโมทสินค้า
    | 'highlight_payment' // ใช้ไฮไลต์การ์ด
    | 'feature_unlock'    // ปลดล็อกฟีเจอร์
    | 'promotion_bonus'   // โบนัสจากโปรโมชั่น
    | 'referral_bonus'    // โบนัสแนะนำเพื่อน
    | 'welcome_bonus'     // โบนัสสมัครใหม่
    | 'daily_checkin'     // เช็คอินรายวัน
    | 'achievement'       // รางวัลจากความสำเร็จ
    | 'expired'           // แต้มหมดอายุ
    | 'adjustment'        // ปรับยอด (admin)

export type JaiStarTransactionStatus =
    | 'pending'
    | 'completed'
    | 'failed'
    | 'cancelled'

export interface JaiStarTransaction {
    id: string
    account_id: string

    type: JaiStarTransactionType
    amount: number              // จำนวนแต้ม (+/-)
    balance_before: number
    balance_after: number

    // Description
    title: string
    title_en?: string
    description?: string

    // Reference
    reference_type?: 'boost' | 'listing' | 'feature' | 'topup' | 'promo'
    reference_id?: string

    // For topups
    payment_method?: 'credit_card' | 'promptpay' | 'truemoney' | 'bank_transfer'
    payment_ref?: string
    price_thb?: number          // ราคาที่จ่าย (บาท)

    status: JaiStarTransactionStatus

    // Expiry (for bonus stars)
    expires_at?: Date

    created_at: Date
    completed_at?: Date
}

// ==========================================
// TOPUP PACKAGES
// ==========================================

export interface JaiStarPackage {
    id: string
    stars: number               // จำนวนแต้ม
    bonus_stars: number         // แต้มโบนัส
    price_thb: number           // ราคา (บาท)
    popular: boolean
    best_value: boolean
    icon: string
    label?: string              // e.g., "ยอดนิยม", "คุ้มสุด"
}

export const JAISTAR_PACKAGES: JaiStarPackage[] = [
    { id: 'pack_50', stars: 50, bonus_stars: 0, price_thb: 50, popular: false, best_value: false, icon: '⭐' },
    { id: 'pack_100', stars: 100, bonus_stars: 10, price_thb: 100, popular: false, best_value: false, icon: '⭐' },
    { id: 'pack_300', stars: 300, bonus_stars: 50, price_thb: 300, popular: true, best_value: false, icon: '🌟', label: 'ยอดนิยม' },
    { id: 'pack_500', stars: 500, bonus_stars: 100, price_thb: 500, popular: false, best_value: true, icon: '💫', label: 'คุ้มสุด' },
    { id: 'pack_1000', stars: 1000, bonus_stars: 250, price_thb: 1000, popular: false, best_value: false, icon: '✨' },
    { id: 'pack_2000', stars: 2000, bonus_stars: 600, price_thb: 2000, popular: false, best_value: false, icon: '🎇' }
]

export function getPackage(id: string): JaiStarPackage | undefined {
    return JAISTAR_PACKAGES.find(p => p.id === id)
}

// ==========================================
// TIER SYSTEM
// ==========================================

export interface JaiStarTier {
    id: 'bronze' | 'silver' | 'gold' | 'platinum'
    name: string
    name_th: string
    min_points: number
    icon: string
    color: string
    benefits: string[]
    boost_discount: number      // % ส่วนลด Boost
}

export const JAISTAR_TIERS: JaiStarTier[] = [
    {
        id: 'bronze',
        name: 'Bronze',
        name_th: 'บรอนซ์',
        min_points: 0,
        icon: '🥉',
        color: '#CD7F32',
        benefits: ['ใช้ JaiStar โปรโมทสินค้าได้'],
        boost_discount: 0
    },
    {
        id: 'silver',
        name: 'Silver',
        name_th: 'ซิลเวอร์',
        min_points: 500,
        icon: '🥈',
        color: '#C0C0C0',
        benefits: ['ส่วนลด Boost 5%', 'ป้าย Silver Badge'],
        boost_discount: 5
    },
    {
        id: 'gold',
        name: 'Gold',
        name_th: 'โกลด์',
        min_points: 2000,
        icon: '🥇',
        color: '#FFD700',
        benefits: ['ส่วนลด Boost 10%', 'ป้าย Gold Badge', 'Priority Support'],
        boost_discount: 10
    },
    {
        id: 'platinum',
        name: 'Platinum',
        name_th: 'แพลตตินัม',
        min_points: 5000,
        icon: '💎',
        color: '#E5E4E2',
        benefits: ['ส่วนลด Boost 15%', 'ป้าย Platinum Badge', 'VIP Support', 'Early Access Features'],
        boost_discount: 15
    }
]

export function getTier(points: number): JaiStarTier {
    return [...JAISTAR_TIERS].reverse().find(t => points >= t.min_points) || JAISTAR_TIERS[0]
}

export function getNextTier(currentTier: string): JaiStarTier | null {
    const idx = JAISTAR_TIERS.findIndex(t => t.id === currentTier)
    return idx < JAISTAR_TIERS.length - 1 ? JAISTAR_TIERS[idx + 1] : null
}

// ==========================================
// REQUEST/RESPONSE TYPES
// ==========================================

export interface TopupRequest {
    user_id: string
    package_id: string
    payment_method: 'credit_card' | 'promptpay' | 'truemoney' | 'bank_transfer'
    return_url?: string
}

export interface TopupResult {
    success: boolean
    transaction_id?: string
    stars_added?: number
    bonus_added?: number
    new_balance?: number
    payment_url?: string
    qr_code?: string
    error?: { code: string; message: string }
}

export interface SpendRequest {
    user_id: string
    amount: number
    type: JaiStarTransactionType
    title: string
    reference_type?: string
    reference_id?: string
}

export interface SpendResult {
    success: boolean
    transaction_id?: string
    amount_spent?: number
    new_balance?: number
    error?: { code: string; message: string }
}

export interface BalanceResponse {
    balance: number
    pending: number
    tier: JaiStarTier
    tier_points: number
    next_tier?: JaiStarTier
    points_to_next_tier?: number
}

export interface TransactionFilter {
    type?: JaiStarTransactionType | JaiStarTransactionType[]
    status?: JaiStarTransactionStatus
    date_from?: Date
    date_to?: Date
    limit?: number
}

/**
 * Profile Types & Configurations
 * 
 * ระบบ Profile ที่ปรับตามระดับสิทธิ์ผู้ใช้
 */

// ==========================================
// USER PERMISSION LEVELS
// ==========================================

export type UserLevel =
    | 'guest'
    | 'member'
    | 'verified'
    | 'seller'
    | 'store_owner'
    | 'official_store'

export type SellerType = 'individual' | 'general_store' | 'official_store'

export interface UserPermissions {
    can_view_listings: boolean
    can_chat: boolean
    can_wishlist: boolean
    can_make_offer: boolean
    can_buy: boolean
    can_review: boolean
    can_sell: boolean
    can_create_store: boolean
    can_create_coupons: boolean
    can_use_api: boolean
    can_access_analytics: boolean
    max_listings: number | 'unlimited'
    max_images_per_listing: number
    listing_duration_days: number
    commission_rate: number
}

// Permission configuration per level
export const USER_LEVEL_PERMISSIONS: Record<UserLevel, UserPermissions> = {
    guest: {
        can_view_listings: true,
        can_chat: false,
        can_wishlist: false,
        can_make_offer: false,
        can_buy: false,
        can_review: false,
        can_sell: false,
        can_create_store: false,
        can_create_coupons: false,
        can_use_api: false,
        can_access_analytics: false,
        max_listings: 0,
        max_images_per_listing: 0,
        listing_duration_days: 0,
        commission_rate: 0
    },
    member: {
        can_view_listings: true,
        can_chat: true,
        can_wishlist: true,
        can_make_offer: true,
        can_buy: true,
        can_review: true,
        can_sell: false,
        can_create_store: false,
        can_create_coupons: false,
        can_use_api: false,
        can_access_analytics: false,
        max_listings: 0,
        max_images_per_listing: 0,
        listing_duration_days: 0,
        commission_rate: 0
    },
    verified: {
        can_view_listings: true,
        can_chat: true,
        can_wishlist: true,
        can_make_offer: true,
        can_buy: true,
        can_review: true,
        can_sell: true,  // Can become seller after verification
        can_create_store: false,
        can_create_coupons: false,
        can_use_api: false,
        can_access_analytics: false,
        max_listings: 0,
        max_images_per_listing: 0,
        listing_duration_days: 0,
        commission_rate: 0
    },
    seller: {
        can_view_listings: true,
        can_chat: true,
        can_wishlist: true,
        can_make_offer: true,
        can_buy: true,
        can_review: true,
        can_sell: true,
        can_create_store: true,  // Can upgrade to store
        can_create_coupons: false,
        can_use_api: false,
        can_access_analytics: false,
        max_listings: 20,
        max_images_per_listing: 5,
        listing_duration_days: 30,
        commission_rate: 5
    },
    store_owner: {
        can_view_listings: true,
        can_chat: true,
        can_wishlist: true,
        can_make_offer: true,
        can_buy: true,
        can_review: true,
        can_sell: true,
        can_create_store: true,
        can_create_coupons: true,
        can_use_api: false,
        can_access_analytics: true,
        max_listings: 'unlimited',
        max_images_per_listing: 10,
        listing_duration_days: 60,
        commission_rate: 4
    },
    official_store: {
        can_view_listings: true,
        can_chat: true,
        can_wishlist: true,
        can_make_offer: true,
        can_buy: true,
        can_review: true,
        can_sell: true,
        can_create_store: true,
        can_create_coupons: true,
        can_use_api: true,
        can_access_analytics: true,
        max_listings: 'unlimited',
        max_images_per_listing: 20,
        listing_duration_days: 90,
        commission_rate: 3
    }
}

// ==========================================
// LISTING STATUS
// ==========================================

export type ListingStatus =
    | 'draft'       // แบบร่าง
    | 'pending'     // รอตรวจสอบ
    | 'active'      // กำลังขาย
    | 'expired'     // หมดอายุ
    | 'sold'        // ขายแล้ว
    | 'closed'      // ปิดการขาย
    | 'rejected'    // ถูกปฏิเสธ
    | 'deleted'     // ลบแล้ว

export interface ListingStatusConfig {
    id: ListingStatus
    label_th: string
    label_en: string
    color: string
    bg_color: string
    icon: string
    description_th: string
    actions: string[]
}

export const LISTING_STATUS_CONFIG: Record<ListingStatus, ListingStatusConfig> = {
    draft: {
        id: 'draft',
        label_th: 'แบบร่าง',
        label_en: 'Draft',
        color: 'text-gray-500',
        bg_color: 'bg-gray-100 dark:bg-gray-800',
        icon: '📝',
        description_th: 'ยังไม่ได้ส่งตรวจสอบ',
        actions: ['edit', 'submit', 'delete']
    },
    pending: {
        id: 'pending',
        label_th: 'รอตรวจสอบ',
        label_en: 'Pending Review',
        color: 'text-yellow-500',
        bg_color: 'bg-yellow-100 dark:bg-yellow-900/30',
        icon: '⏳',
        description_th: 'กำลังรอทีมตรวจสอบ',
        actions: ['cancel', 'edit']
    },
    active: {
        id: 'active',
        label_th: 'กำลังขาย',
        label_en: 'Active',
        color: 'text-emerald-500',
        bg_color: 'bg-emerald-100 dark:bg-emerald-900/30',
        icon: '🟢',
        description_th: 'ประกาศสาธารณะ',
        actions: ['edit', 'boost', 'mark_sold', 'close', 'delete']
    },
    expired: {
        id: 'expired',
        label_th: 'หมดอายุ',
        label_en: 'Expired',
        color: 'text-orange-500',
        bg_color: 'bg-orange-100 dark:bg-orange-900/30',
        icon: '⏰',
        description_th: 'เกินระยะเวลาประกาศ',
        actions: ['renew', 'delete']
    },
    sold: {
        id: 'sold',
        label_th: 'ขายแล้ว',
        label_en: 'Sold',
        color: 'text-blue-500',
        bg_color: 'bg-blue-100 dark:bg-blue-900/30',
        icon: '✅',
        description_th: 'ทำธุรกรรมสำเร็จ',
        actions: ['close', 'relist']
    },
    closed: {
        id: 'closed',
        label_th: 'ปิดการขาย',
        label_en: 'Closed',
        color: 'text-purple-500',
        bg_color: 'bg-purple-100 dark:bg-purple-900/30',
        icon: '🔒',
        description_th: 'ผู้ขายปิดการขาย',
        actions: ['reopen', 'delete']
    },
    rejected: {
        id: 'rejected',
        label_th: 'ถูกปฏิเสธ',
        label_en: 'Rejected',
        color: 'text-red-500',
        bg_color: 'bg-red-100 dark:bg-red-900/30',
        icon: '❌',
        description_th: 'ฝ่าฝืนกฎระเบียบ',
        actions: ['appeal', 'edit_resubmit', 'delete']
    },
    deleted: {
        id: 'deleted',
        label_th: 'ลบแล้ว',
        label_en: 'Deleted',
        color: 'text-gray-400',
        bg_color: 'bg-gray-100 dark:bg-gray-800',
        icon: '🗑️',
        description_th: 'ถูกลบ (สามารถกู้คืนได้ 30 วัน)',
        actions: ['restore']
    }
}

// ==========================================
// AUTO-DELETE SCHEDULE
// ==========================================

export interface AutoDeleteConfig {
    expired_to_delete_days: number
    closed_to_delete_days: number
    sold_to_archive_days: number
    soft_delete_to_permanent_days: number
}

export const AUTO_DELETE_CONFIG: Record<SellerType, AutoDeleteConfig> = {
    individual: {
        expired_to_delete_days: 7,
        closed_to_delete_days: 7,
        sold_to_archive_days: 30,
        soft_delete_to_permanent_days: 30
    },
    general_store: {
        expired_to_delete_days: 30,
        closed_to_delete_days: 14,
        sold_to_archive_days: 60,
        soft_delete_to_permanent_days: 30
    },
    official_store: {
        expired_to_delete_days: 60,
        closed_to_delete_days: 30,
        sold_to_archive_days: 90,
        soft_delete_to_permanent_days: 30
    }
}

// ==========================================
// PROFILE DASHBOARD SECTIONS
// ==========================================

export type DashboardSection =
    | 'profile_header'
    | 'trust_score'
    | 'quick_stats'
    | 'jaistar_balance'
    | 'ai_insights'
    | 'wishlist_preview'
    | 'my_listings'
    | 'earnings'
    | 'action_required'
    | 'achievements'
    | 'recent_activity'
    | 'upgrade_prompt'
    | 'store_overview'
    | 'store_products'
    | 'store_orders'
    | 'store_promotions'
    | 'store_analytics'

export interface DashboardSectionConfig {
    id: DashboardSection
    label_th: string
    label_en: string
    icon: string
    min_level: UserLevel
    show_for_sellers_only?: boolean
    show_for_stores_only?: boolean
    priority: number  // Lower = higher priority (appears first)
}

export const DASHBOARD_SECTIONS: DashboardSectionConfig[] = [
    // Common sections
    {
        id: 'profile_header',
        label_th: 'ข้อมูลโปรไฟล์',
        label_en: 'Profile Info',
        icon: '👤',
        min_level: 'member',
        priority: 1
    },
    {
        id: 'trust_score',
        label_th: 'คะแนนความน่าเชื่อถือ',
        label_en: 'Trust Score',
        icon: '🛡️',
        min_level: 'member',
        priority: 2
    },
    {
        id: 'ai_insights',
        label_th: 'AI แนะนำ',
        label_en: 'AI Insights',
        icon: '🤖',
        min_level: 'member',
        priority: 3
    },
    {
        id: 'quick_stats',
        label_th: 'สถิติย่อ',
        label_en: 'Quick Stats',
        icon: '📊',
        min_level: 'member',
        priority: 4
    },
    {
        id: 'wishlist_preview',
        label_th: 'รายการโปรด',
        label_en: 'Wishlist',
        icon: '❤️',
        min_level: 'member',
        priority: 5
    },
    {
        id: 'recent_activity',
        label_th: 'กิจกรรมล่าสุด',
        label_en: 'Recent Activity',
        icon: '🕐',
        min_level: 'member',
        priority: 6
    },
    {
        id: 'achievements',
        label_th: 'รางวัลและเหรียญ',
        label_en: 'Achievements',
        icon: '🏆',
        min_level: 'member',
        priority: 7
    },
    {
        id: 'upgrade_prompt',
        label_th: 'อัปเกรดบัญชี',
        label_en: 'Upgrade Account',
        icon: '💡',
        min_level: 'member',
        priority: 100  // Show at bottom
    },

    // Seller sections
    {
        id: 'jaistar_balance',
        label_th: 'JaiStar Balance',
        label_en: 'JaiStar Balance',
        icon: '⭐',
        min_level: 'seller',
        show_for_sellers_only: true,
        priority: 3
    },
    {
        id: 'my_listings',
        label_th: 'ประกาศของฉัน',
        label_en: 'My Listings',
        icon: '📦',
        min_level: 'seller',
        show_for_sellers_only: true,
        priority: 4
    },
    {
        id: 'earnings',
        label_th: 'รายได้',
        label_en: 'Earnings',
        icon: '💰',
        min_level: 'seller',
        show_for_sellers_only: true,
        priority: 5
    },
    {
        id: 'action_required',
        label_th: 'ต้องดำเนินการ',
        label_en: 'Action Required',
        icon: '⚠️',
        min_level: 'seller',
        show_for_sellers_only: true,
        priority: 2
    },

    // Store sections
    {
        id: 'store_overview',
        label_th: 'ภาพรวมร้าน',
        label_en: 'Store Overview',
        icon: '🏪',
        min_level: 'store_owner',
        show_for_stores_only: true,
        priority: 1
    },
    {
        id: 'store_products',
        label_th: 'สินค้าในร้าน',
        label_en: 'Store Products',
        icon: '📦',
        min_level: 'store_owner',
        show_for_stores_only: true,
        priority: 3
    },
    {
        id: 'store_orders',
        label_th: 'คำสั่งซื้อ',
        label_en: 'Orders',
        icon: '🧾',
        min_level: 'store_owner',
        show_for_stores_only: true,
        priority: 4
    },
    {
        id: 'store_promotions',
        label_th: 'โปรโมชั่น',
        label_en: 'Promotions',
        icon: '🎁',
        min_level: 'store_owner',
        show_for_stores_only: true,
        priority: 5
    },
    {
        id: 'store_analytics',
        label_th: 'วิเคราะห์ยอดขาย',
        label_en: 'Analytics',
        icon: '📈',
        min_level: 'official_store',
        show_for_stores_only: true,
        priority: 6
    }
]

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export function getPermissions(level: UserLevel): UserPermissions {
    return USER_LEVEL_PERMISSIONS[level]
}

export function getListingStatusConfig(status: ListingStatus): ListingStatusConfig {
    return LISTING_STATUS_CONFIG[status]
}

export function getAutoDeleteConfig(sellerType: SellerType): AutoDeleteConfig {
    return AUTO_DELETE_CONFIG[sellerType]
}

export function getDashboardSections(
    userLevel: UserLevel,
    isSeller: boolean,
    isStoreOwner: boolean
): DashboardSectionConfig[] {
    const levelOrder: UserLevel[] = ['guest', 'member', 'verified', 'seller', 'store_owner', 'official_store']
    const userLevelIndex = levelOrder.indexOf(userLevel)

    return DASHBOARD_SECTIONS
        .filter(section => {
            const sectionLevelIndex = levelOrder.indexOf(section.min_level)
            if (userLevelIndex < sectionLevelIndex) return false
            if (section.show_for_sellers_only && !isSeller) return false
            if (section.show_for_stores_only && !isStoreOwner) return false
            return true
        })
        .sort((a, b) => a.priority - b.priority)
}

export function canPerformAction(level: UserLevel, action: keyof UserPermissions): boolean {
    const permissions = getPermissions(level)
    const value = permissions[action]
    return typeof value === 'boolean' ? value : true
}

export function getUserLevelLabel(level: UserLevel, language: 'th' | 'en' = 'th'): string {
    const labels: Record<UserLevel, { th: string; en: string }> = {
        guest: { th: 'ผู้เยี่ยมชม', en: 'Guest' },
        member: { th: 'สมาชิก', en: 'Member' },
        verified: { th: 'ยืนยันตัวตนแล้ว', en: 'Verified' },
        seller: { th: 'ผู้ขาย', en: 'Seller' },
        store_owner: { th: 'เจ้าของร้าน', en: 'Store Owner' },
        official_store: { th: 'ร้านค้าทางการ', en: 'Official Store' }
    }
    return labels[level][language]
}

export function getSellerTypeLabel(type: SellerType, language: 'th' | 'en' = 'th'): string {
    const labels: Record<SellerType, { th: string; en: string }> = {
        individual: { th: 'ผู้ขายทั่วไป', en: 'Individual Seller' },
        general_store: { th: 'ร้านค้าทั่วไป', en: 'General Store' },
        official_store: { th: 'ร้านค้าทางการ', en: 'Official Store' }
    }
    return labels[type][language]
}

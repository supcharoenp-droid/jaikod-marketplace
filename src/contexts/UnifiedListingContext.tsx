/**
 * UNIFIED LISTING CONTEXT
 * 
 * Single Source of Truth สำหรับข้อมูล Listing และ Seller
 * ดึงข้อมูลครั้งเดียว ใช้ทุก Component
 * 
 * @version 2.0.0
 */

'use client'

import { createContext, useContext, ReactNode } from 'react'

// ==========================================
// TYPES
// ==========================================

export interface ListingImage {
    url: string
    order: number
    is_primary?: boolean
}

export interface LocationData {
    province: string
    amphoe?: string
    district?: string
    landmark?: string
    coordinates?: { lat: number; lng: number }
}

export interface ListingData {
    id: string
    title: string
    slug: string
    listing_code: string
    listing_number?: string
    seller_id: string
    price: number
    price_negotiable: boolean
    description?: string
    images: ListingImage[]
    thumbnail_url: string
    category_type: string
    category_id?: number
    subcategory_id?: number
    status: 'active' | 'sold' | 'pending' | 'closed' | 'expired'
    created_at: Date
    updated_at: Date
    published_at?: Date
    expires_at: Date
    views: number
    favorites: number
    template_data: Record<string, any>
    location: LocationData
    meeting?: {
        province?: string
        amphoe?: string
        available_times?: string[]
    }
    ai_content?: {
        marketing_copy?: {
            full_text?: string
            headline?: string
        }
        price_analysis?: {
            market_avg: number
            percentage_diff: number
            price_position: 'below_market' | 'at_market' | 'above_market'
        }
        buyer_checklist?: string[]
    }
}

export interface SellerData {
    id: string
    name: string
    displayName?: string
    avatar?: string
    verified: boolean
    phone_verified: boolean
    email_verified: boolean
    id_verified: boolean
    trust_score: number         // 0-100
    response_time_minutes: number
    response_rate: number       // %
    member_since: Date
    last_active?: Date
    location?: string

    // Stats (นับจริงจาก database)
    total_listings: number
    active_listings: number
    sold_count: number
    review_count: number
    rating: number              // 0-5
    followers_count: number
    following_count: number

    // Badges
    badges: string[]
}

export interface ListingPreview {
    id: string
    slug: string
    title: string
    price: number
    thumbnail_url: string
    created_at: Date
    views: number
    status: string
    location?: {
        province: string
    }
}

export interface AIAnalysis {
    price_score: number         // 0-100 (ราคาเหมาะสม)
    market_price: number        // ราคาตลาด
    price_position: 'below' | 'at' | 'above'
    deal_score: number          // 0-100
    factors: {
        label: string
        score: number
        positive: boolean
    }[]
    buyer_checklist: string[]
    red_flags: string[]
    summary: string
    tips: string[]
}

export interface UserState {
    isOwner: boolean
    isFavorited: boolean
    isFollowingSeller: boolean
}

export interface UnifiedListingData {
    // Core Data
    listing: ListingData
    seller: SellerData

    // Related Data
    sellerOtherListings: ListingPreview[]
    similarListings: ListingPreview[]

    // AI Data
    ai: AIAnalysis | null

    // User State
    userState: UserState

    // Distance
    distance: number | null

    // Loading State
    loading: boolean
    error: string | null

    // Actions
    setFavorited: (value: boolean) => void
    setFollowing: (value: boolean) => void
    refreshData: () => Promise<void>
}

// ==========================================
// CONTEXT
// ==========================================

const UnifiedListingContext = createContext<UnifiedListingData | null>(null)

// ==========================================
// PROVIDER
// ==========================================

interface UnifiedListingProviderProps {
    children: ReactNode
    value: UnifiedListingData
}

export function UnifiedListingProvider({ children, value }: UnifiedListingProviderProps) {
    return (
        <UnifiedListingContext.Provider value={value}>
            {children}
        </UnifiedListingContext.Provider>
    )
}

// ==========================================
// HOOK
// ==========================================

export function useUnifiedListing(): UnifiedListingData {
    const context = useContext(UnifiedListingContext)
    if (!context) {
        throw new Error('useUnifiedListing must be used within UnifiedListingProvider')
    }
    return context
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

/**
 * Format Thai Date with full details
 * ตัวอย่าง: "28 ธ.ค. 2567 เวลา 14:30 น."
 */
export function formatThaiDateFull(date: Date): string {
    const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ]

    const day = date.getDate()
    const month = thaiMonths[date.getMonth()]
    const year = date.getFullYear() + 543   // พ.ศ.
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')

    return `${day} ${month} ${year} เวลา ${hours}:${minutes} น.`
}

/**
 * Format Thai Date short version
 * ตัวอย่าง: "28 ธ.ค. 67"
 */
export function formatThaiDateShort(date: Date): string {
    const thaiMonths = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
        'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ]

    const day = date.getDate()
    const month = thaiMonths[date.getMonth()]
    const year = (date.getFullYear() + 543).toString().slice(-2)

    return `${day} ${month} ${year}`
}

/**
 * Get relative time display
 * ตัวอย่าง: "เมื่อวาน", "3 วันที่แล้ว"
 */
export function getRelativeTimeDisplay(date: Date, language: 'th' | 'en' = 'th'): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMinutes = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (language === 'th') {
        if (diffMinutes < 1) return 'เมื่อสักครู่'
        if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`
        if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`
        if (diffDays === 1) return 'เมื่อวาน'
        if (diffDays < 7) return `${diffDays} วันที่แล้ว`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} สัปดาห์ที่แล้ว`
        return formatThaiDateShort(date)
    } else {
        if (diffMinutes < 1) return 'just now'
        if (diffMinutes < 60) return `${diffMinutes}m ago`
        if (diffHours < 24) return `${diffHours}h ago`
        if (diffDays === 1) return 'yesterday'
        if (diffDays < 7) return `${diffDays}d ago`
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
}

/**
 * Get smart date display
 * แสดงทั้ง relative และ full date
 */
export function getSmartDateWithFull(date: Date, language: 'th' | 'en' = 'th'): {
    relative: string
    full: string
} {
    return {
        relative: getRelativeTimeDisplay(date, language),
        full: language === 'th'
            ? formatThaiDateFull(date)
            : date.toLocaleString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short'
            })
    }
}

/**
 * Format price
 */
export function formatPrice(price: number): string {
    return new Intl.NumberFormat('th-TH').format(price)
}

/**
 * Calculate trust level
 */
export function getTrustLevel(score: number): {
    level: 'low' | 'medium' | 'high' | 'excellent'
    label: string
    color: string
} {
    if (score >= 80) return { level: 'excellent', label: 'ดีเยี่ยม', color: 'text-emerald-400' }
    if (score >= 60) return { level: 'high', label: 'ดี', color: 'text-green-400' }
    if (score >= 40) return { level: 'medium', label: 'ปานกลาง', color: 'text-yellow-400' }
    return { level: 'low', label: 'ใหม่', color: 'text-orange-400' }
}

export default UnifiedListingContext

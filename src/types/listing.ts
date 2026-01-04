/**
 * UNIFIED LISTING TYPES
 * 
 * Single Source of Truth สำหรับ Listing types ทั้งหมด
 * 
 * @version 2.0.0
 * @created 2025-12-30
 */

// ===== CATEGORY TYPES =====
export type ListingCategoryType = 'car' | 'motorcycle' | 'real_estate' | 'land' | 'mobile' | 'general'

export const CATEGORY_PREFIXES: Record<ListingCategoryType, string> = {
    car: 'CAR',
    motorcycle: 'MOTO',
    real_estate: 'HOME',
    land: 'LAND',
    mobile: 'PHONE',
    general: 'ITEM'
}

// Single-letter category codes for short listing codes (JK-AXXXXX format)
export const CATEGORY_CODES: Record<ListingCategoryType, string> = {
    car: 'A',           // Automobile
    motorcycle: 'B',    // Bike
    real_estate: 'R',   // Real Estate
    land: 'L',          // Land
    mobile: 'M',        // Mobile/Phone
    general: 'X'        // General/Other
}

export const CATEGORY_LABELS: Record<ListingCategoryType, { th: string; en: string; emoji: string }> = {
    car: { th: 'รถยนต์', en: 'Car', emoji: '🚗' },
    motorcycle: { th: 'มอเตอร์ไซค์', en: 'Motorcycle', emoji: '🏍️' },
    real_estate: { th: 'บ้าน/คอนโด', en: 'Real Estate', emoji: '🏠' },
    land: { th: 'ที่ดิน', en: 'Land', emoji: '🌳' },
    mobile: { th: 'มือถือ', en: 'Mobile', emoji: '📱' },
    general: { th: 'สินค้าทั่วไป', en: 'General', emoji: '📦' }
}

// ===== LISTING STATUS =====
export type ListingStatus =
    | 'draft'
    | 'pending_review'
    | 'pending'
    | 'active'
    | 'sold'
    | 'reserved'
    | 'hidden'
    | 'expired'
    | 'rejected'
    | 'closed'
    | 'deleted'

export type ListingVisibility = 'public' | 'unlisted' | 'private'

// ===== LOCATION =====
export interface ListingLocation {
    province: string
    amphoe: string
    district?: string
    tambon?: string              // Alias for district
    zipcode?: string
    landmark?: string
    coordinates?: {
        lat: number
        lng: number
    }
    formatted_address?: string
}

// ===== MEDIA =====
export interface ListingImage {
    url: string
    order: number
    is_primary: boolean
    caption?: string
    thumbnail_url?: string
}

// ===== SELLER INFO (Embedded) =====
/**
 * Seller info that is embedded in listing documents
 * Note: This is a SNAPSHOT and may be outdated
 * For real-time data, use SellerProfile from seller.ts
 */
export interface ListingSellerInfo {
    name: string
    avatar?: string
    verified: boolean
    trust_score: number             // 0-100
    response_rate?: number          // 0-100
    response_time_minutes?: number
    total_listings?: number         // May be outdated - use calculated value
    active_listings?: number        // May be outdated - use calculated value
    successful_sales?: number
}

// ===== AI CONTENT =====
export interface AIMarketingCopy {
    headline: string
    subheadline: string
    selling_points: string[]
    trust_signals: string[]
    body_copy: string
    call_to_action: string
    full_text: string
}

export interface AIPriceAnalysis {
    market_avg: number
    min_price: number
    max_price: number
    suggested_price: number
    price_position: 'below_market' | 'at_market' | 'above_market'
    percentage_diff: number     // +8% or -5%
}

export interface AIContent {
    auto_title?: string
    marketing_copy?: AIMarketingCopy
    seo_keywords?: string[]
    confidence_score?: number       // 0-100
    price_analysis?: AIPriceAnalysis
    buyer_checklist?: string[]      // AI-generated questions
    similar_listings?: string[]     // Related listing IDs
}

// ===== CONTACT =====
export interface ListingContact {
    show_phone: boolean
    phone?: string
    show_line: boolean
    line_id?: string
    preferred_contact: 'chat' | 'phone' | 'line'
}

// ===== MEETING =====
export interface ListingMeeting {
    province?: string
    amphoe?: string
    landmark?: string
    available_times?: string[]      // weekday, weekend, anytime
    delivery_option?: string        // pickup_only, delivery, nationwide
}

// ===== NEGOTIATION =====
export interface NegotiationSettings {
    allow_offers: boolean
    min_acceptable_price?: number   // Hidden from buyers
    auto_decline_below?: number     // Auto-reject offers below this
    counter_offer_enabled?: boolean
    instant_buy_price?: number      // Skip negotiation
}

// ===== STATS =====
export interface ListingStats {
    views: number
    unique_viewers?: number
    favorites: number
    shares?: number
    inquiries?: number
    offers_received?: number
    chat_conversations?: number
}

// ===== MAIN LISTING INTERFACE =====
/**
 * Universal Listing - supports all categories
 * This is the canonical type for listings in Firestore
 */
export interface UniversalListing {
    // Core Identifiers
    id: string
    listing_code?: string           // Short code (JK-AXXXXX) for sharing/searching
    listing_number?: string         // Legacy: {PREFIX}-{YYYYMM}-{XXXXX}
    slug: string                    // SEO-friendly URL

    // Category
    category_type: ListingCategoryType
    category_id: number
    subcategory_id?: number | null

    // Seller
    seller_id: string
    seller_info: ListingSellerInfo

    // Basic Info
    title: string
    title_th?: string
    title_en?: string
    description?: string
    description_th?: string
    description_en?: string
    condition?: string

    // Pricing
    price: number
    original_price?: number
    price_negotiable?: boolean
    price_type?: 'fixed' | 'negotiable' | 'auction' | 'contact_for_price'
    currency?: 'THB'

    // Category-Specific Data
    template_data?: Record<string, any>

    // Media
    images: ListingImage[]
    thumbnail_url?: string
    video_url?: string
    virtual_tour_url?: string

    // Location
    location: ListingLocation

    // AI Content
    ai_content?: AIContent

    // Contact & Meeting
    contact?: ListingContact
    meeting?: ListingMeeting

    // Negotiation
    negotiation?: NegotiationSettings

    // Status
    status: ListingStatus
    visibility?: ListingVisibility

    // Premium Features
    is_featured?: boolean
    is_bumped?: boolean
    featured_until?: Date | string
    bumped_at?: Date | string

    // Stats
    stats?: ListingStats
    views_count?: number            // Shorthand for stats.views
    favorites_count?: number        // Shorthand for stats.favorites

    // Timestamps
    created_at: Date | string | any // Firestore Timestamp
    updated_at?: Date | string | any
    published_at?: Date | string
    expires_at?: Date | string
    sold_at?: Date | string

    // Meta
    source?: 'web' | 'mobile_app' | 'api'
    version?: number
}

// ===== CREATE LISTING INPUT =====
export interface CreateListingInput {
    category_type: ListingCategoryType
    category_id: number
    subcategory_id?: number

    // Basic Info
    title?: string                  // Optional if AI-generated

    // Pricing
    price: number
    price_negotiable?: boolean
    price_type?: 'fixed' | 'negotiable' | 'auction' | 'contact_for_price'

    // Category-Specific Data
    template_data?: Record<string, any>

    // Media
    images: (File | string)[]       // File objects or base64/URLs
    video_url?: string

    // Location
    location: Partial<ListingLocation>

    // AI Content (optional, can be auto-generated)
    ai_content?: Partial<AIContent>

    // Contact
    contact?: Partial<ListingContact>

    // Meeting
    meeting?: Partial<ListingMeeting>

    // Negotiation
    negotiation?: Partial<NegotiationSettings>
}

// ===== UPDATE LISTING INPUT =====
export interface UpdateListingInput extends Partial<CreateListingInput> {
    status?: ListingStatus
    visibility?: ListingVisibility
}

// ===== CHAT OFFER =====
export interface ChatOffer {
    id: string
    conversation_id: string
    listing_id: string
    listing_number?: string

    // Parties
    buyer_id: string
    seller_id: string

    // Offer Details
    offered_price: number
    original_price: number
    discount_percent?: number

    // Status
    status: 'pending' | 'accepted' | 'declined' | 'countered' | 'expired' | 'withdrawn'

    // Counter Offer
    counter_price?: number
    counter_message?: string

    // Buyer Options
    ready_to_transfer?: boolean
    want_to_view_first?: boolean
    buyer_message?: string

    // Timestamps
    offered_at: Date | string
    responded_at?: Date | string
    expires_at?: Date | string     // 24 hours default

    // Response
    seller_response?: {
        action: 'accept' | 'decline' | 'counter'
        message?: string
        responded_at: Date | string
    }
}

// ===== QUICK FACTS CONFIG =====
export interface QuickFactItem {
    key: string
    icon: string
    label_th: string
    label_en: string
    format?: 'number' | 'text' | 'currency' | 'distance' | 'area'
    suffix_th?: string
    suffix_en?: string
}

// ===== Backward Compatibility =====
// These aliases ensure existing code continues to work
export type Listing = UniversalListing
export type ListingData = UniversalListing

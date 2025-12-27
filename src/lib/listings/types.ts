/**
 * Universal Listing System - Types
 * 
 * รองรับทุกหมวดหมู่: รถ, มอเตอร์ไซค์, บ้าน, ที่ดิน, สินค้าทั่วไป
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

// ===== SELLER INFO =====
export interface SellerInfo {
    name: string
    avatar?: string
    verified: boolean
    trust_score: number             // 0-100
    response_rate: number           // 0-100
    response_time_minutes: number
    total_listings: number
    successful_sales: number
}

// ===== LOCATION =====
export interface ListingLocation {
    province: string
    amphoe: string
    district?: string
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
    auto_title: string
    marketing_copy: AIMarketingCopy
    seo_keywords: string[]
    confidence_score: number        // 0-100
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
    province: string
    amphoe: string
    landmark?: string
    available_times: string[]       // weekday, weekend, anytime
    delivery_option?: string        // pickup_only, delivery, nationwide
}

// ===== NEGOTIATION =====
export interface NegotiationSettings {
    allow_offers: boolean
    min_acceptable_price?: number   // Hidden from buyers
    auto_decline_below?: number     // Auto-reject offers below this
    counter_offer_enabled: boolean
    instant_buy_price?: number      // Skip negotiation
}

// ===== STATS =====
export interface ListingStats {
    views: number
    unique_viewers: number
    favorites: number
    shares: number
    inquiries: number
    offers_received: number
    chat_conversations: number
}

// ===== LISTING STATUS =====
export type ListingStatus = 'draft' | 'pending_review' | 'active' | 'sold' | 'reserved' | 'hidden' | 'expired' | 'rejected' | 'closed' | 'pending' | 'deleted'
export type ListingVisibility = 'public' | 'unlisted' | 'private'

// ===== MAIN LISTING INTERFACE =====
export interface UniversalListing {
    // Core Identifiers
    id: string
    listing_code: string            // NEW: Short code (JK-AXXXXX) for sharing/searching
    listing_number: string          // Legacy: {PREFIX}-{YYYYMM}-{XXXXX}
    slug: string                    // SEO-friendly URL

    // Category
    category_type: ListingCategoryType
    category_id: number
    subcategory_id?: number | null

    // Seller
    seller_id: string
    seller_info: SellerInfo

    // Basic Info
    title: string
    title_th: string
    title_en?: string

    // Pricing
    price: number
    price_negotiable: boolean
    price_type: 'fixed' | 'negotiable' | 'auction' | 'contact_for_price'
    currency: 'THB'

    // Category-Specific Data
    template_data: Record<string, any>

    // Media
    images: ListingImage[]
    thumbnail_url: string
    video_url?: string
    virtual_tour_url?: string

    // Location
    location: ListingLocation

    // AI Content
    ai_content: AIContent

    // Contact & Meeting
    contact: ListingContact
    meeting: ListingMeeting

    // Negotiation
    negotiation: NegotiationSettings

    // Status
    status: ListingStatus
    visibility: ListingVisibility

    // Premium Features
    is_featured: boolean
    is_bumped: boolean
    featured_until?: Date
    bumped_at?: Date

    // Stats
    stats: ListingStats

    // Timestamps
    created_at: Date
    updated_at: Date
    published_at?: Date
    expires_at: Date
    sold_at?: Date

    // Meta
    source: 'web' | 'mobile_app' | 'api'
    version: number
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
    template_data: Record<string, any>

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

// ===== CHAT OFFER =====
export interface ChatOffer {
    id: string
    conversation_id: string
    listing_id: string
    listing_number: string

    // Parties
    buyer_id: string
    seller_id: string

    // Offer Details
    offered_price: number
    original_price: number
    discount_percent: number

    // Status
    status: 'pending' | 'accepted' | 'declined' | 'countered' | 'expired' | 'withdrawn'

    // Counter Offer
    counter_price?: number
    counter_message?: string

    // Buyer Options
    ready_to_transfer: boolean
    want_to_view_first: boolean
    buyer_message?: string

    // Timestamps
    offered_at: Date
    responded_at?: Date
    expires_at: Date            // 24 hours default

    // Response
    seller_response?: {
        action: 'accept' | 'decline' | 'counter'
        message?: string
        responded_at: Date
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

export const QUICK_FACTS_CONFIG: Record<ListingCategoryType, QuickFactItem[]> = {
    car: [
        { key: 'year', icon: '📅', label_th: 'ปี', label_en: 'Year' },
        { key: 'mileage', icon: '🛣️', label_th: 'ไมล์', label_en: 'Mileage', format: 'number', suffix_th: ' กม.', suffix_en: ' km' },
        { key: 'transmission', icon: '⚙️', label_th: 'เกียร์', label_en: 'Transmission' },
        { key: 'fuel_type', icon: '⛽', label_th: 'เชื้อเพลิง', label_en: 'Fuel' },
        { key: 'color', icon: '🎨', label_th: 'สี', label_en: 'Color' },
        { key: 'body_type', icon: '🚗', label_th: 'ตัวถัง', label_en: 'Body' },
        { key: 'owner_hand', icon: '👤', label_th: 'มือ', label_en: 'Owner' },
        { key: 'reg_province', icon: '📍', label_th: 'ทะเบียน', label_en: 'Registration' },
        { key: 'insurance_type', icon: '🛡️', label_th: 'ประกัน', label_en: 'Insurance' },
        { key: 'service_history', icon: '🔧', label_th: 'เซอร์วิส', label_en: 'Service' },
    ],
    motorcycle: [
        { key: 'year', icon: '📅', label_th: 'ปี', label_en: 'Year' },
        { key: 'mileage', icon: '🛣️', label_th: 'ไมล์', label_en: 'Mileage', format: 'number', suffix_th: ' กม.', suffix_en: ' km' },
        { key: 'engine_cc', icon: '⚙️', label_th: 'ซีซี', label_en: 'CC', suffix_th: ' cc', suffix_en: ' cc' },
        { key: 'bike_type', icon: '🏍️', label_th: 'ประเภท', label_en: 'Type' },
        { key: 'color', icon: '🎨', label_th: 'สี', label_en: 'Color' },
        { key: 'owner_hand', icon: '👤', label_th: 'มือ', label_en: 'Owner' },
        { key: 'reg_province', icon: '📍', label_th: 'ทะเบียน', label_en: 'Registration' },
        { key: 'tax_status', icon: '🛡️', label_th: 'พ.ร.บ.', label_en: 'Tax' },
        { key: 'condition', icon: '🔧', label_th: 'สภาพ', label_en: 'Condition' },
        { key: 'book_status', icon: '📋', label_th: 'เล่ม', label_en: 'Book' },
    ],
    real_estate: [
        { key: 'property_type', icon: '🏠', label_th: 'ประเภท', label_en: 'Type' },
        { key: 'bedrooms', icon: '🛏️', label_th: 'ห้องนอน', label_en: 'Bedrooms' },
        { key: 'bathrooms', icon: '🚿', label_th: 'ห้องน้ำ', label_en: 'Bathrooms' },
        { key: 'area_sqm', icon: '📐', label_th: 'พื้นที่', label_en: 'Area', suffix_th: ' ตร.ม.', suffix_en: ' sqm' },
        { key: 'floor', icon: '🏢', label_th: 'ชั้น', label_en: 'Floor' },
        { key: 'parking', icon: '🚗', label_th: 'จอดรถ', label_en: 'Parking' },
        { key: 'facilities', icon: '🏊', label_th: 'สิ่งอำนวยความสะดวก', label_en: 'Facilities' },
        { key: 'bts_distance', icon: '🚇', label_th: 'BTS', label_en: 'BTS', suffix_th: ' ม.', suffix_en: ' m' },
        { key: 'built_year', icon: '📅', label_th: 'สร้างปี', label_en: 'Built' },
        { key: 'common_fee', icon: '💰', label_th: 'ส่วนกลาง', label_en: 'Common', format: 'currency' },
    ],
    land: [
        { key: 'land_area', icon: '📐', label_th: 'พื้นที่', label_en: 'Area' },
        { key: 'zoning', icon: '📍', label_th: 'ผังเมือง', label_en: 'Zoning' },
        { key: 'road_width', icon: '🛤️', label_th: 'หน้ากว้าง', label_en: 'Road Width', suffix_th: ' ม.', suffix_en: ' m' },
        { key: 'utilities', icon: '🏗️', label_th: 'สาธารณูปโภค', label_en: 'Utilities' },
        { key: 'title_deed', icon: '📄', label_th: 'โฉนด', label_en: 'Title Deed' },
        { key: 'road_type', icon: '🚗', label_th: 'ถนน', label_en: 'Road' },
        { key: 'water_supply', icon: '💧', label_th: 'น้ำ', label_en: 'Water' },
        { key: 'electricity', icon: '⚡', label_th: 'ไฟฟ้า', label_en: 'Electricity' },
        { key: 'location_type', icon: '📍', label_th: 'ตำแหน่ง', label_en: 'Location' },
        { key: 'price_per_rai', icon: '💰', label_th: 'ราคา/ไร่', label_en: 'Price/Rai', format: 'currency' },
    ],
    mobile: [
        { key: 'storage', icon: '💾', label_th: 'ความจุ', label_en: 'Storage' },
        { key: 'color', icon: '🎨', label_th: 'สี', label_en: 'Color' },
        { key: 'battery_health', icon: '🔋', label_th: 'แบต', label_en: 'Battery' },
        { key: 'screen_condition', icon: '📱', label_th: 'หน้าจอ', label_en: 'Screen' },
        { key: 'body_condition', icon: '✨', label_th: 'ตัวเครื่อง', label_en: 'Body' },
        { key: 'icloud_status', icon: '☁️', label_th: 'iCloud', label_en: 'iCloud' },
        { key: 'network_status', icon: '📶', label_th: 'เครือข่าย', label_en: 'Network' },
        { key: 'warranty', icon: '🛡️', label_th: 'ประกัน', label_en: 'Warranty' },
        { key: 'accessories', icon: '🎵', label_th: 'อุปกรณ์', label_en: 'Accessories' },
        { key: 'ram', icon: '🖥️', label_th: 'RAM', label_en: 'RAM' },
    ],
    general: [
        { key: 'condition', icon: '✨', label_th: 'สภาพ', label_en: 'Condition' },
        { key: 'brand', icon: '🏷️', label_th: 'แบรนด์', label_en: 'Brand' },
        { key: 'model', icon: '📦', label_th: 'รุ่น', label_en: 'Model' },
        { key: 'warranty', icon: '🛡️', label_th: 'ประกัน', label_en: 'Warranty' },
        { key: 'included', icon: '📋', label_th: 'อุปกรณ์', label_en: 'Included' },
    ],
}

// ===== AI CHAT SUGGESTIONS =====
export const AI_CHAT_SUGGESTIONS: Record<ListingCategoryType, string[]> = {
    car: [
        "รถเคยมีอุบัติเหตุไหมครับ?",
        "ไมล์จริงใช่ไหมครับ?",
        "ประกันเหลือถึงเมื่อไหร่ครับ?",
        "รับโอนไฟแนนซ์ได้ไหมครับ?",
        "นัดดูรถได้เมื่อไหร่ครับ?",
        "ลดได้อีกไหมครับ?",
    ],
    motorcycle: [
        "รถเคยล้มไหมครับ?",
        "เปลี่ยนถ่ายน้ำมันเครื่องล่าสุดเมื่อไหร่?",
        "มีบิ๊กไบค์หรือเปล่าครับ?",
        "ป้ายวงกลมเหลือถึงเมื่อไหร่?",
        "นัดดูรถได้เมื่อไหร่ครับ?",
        "ลดได้อีกไหมครับ?",
    ],
    real_estate: [
        "ค่าส่วนกลางเดือนละเท่าไหร่ครับ?",
        "มีที่จอดรถไหมครับ?",
        "ติดสัญญาเช่าอยู่ไหมครับ?",
        "โอนได้เลยไหมครับ?",
        "รวมเฟอร์นิเจอร์ไหมครับ?",
        "นัดดูได้เมื่อไหร่ครับ?",
    ],
    land: [
        "ที่ดินติดถนนกว้างเท่าไหร่ครับ?",
        "มีสาธารณูปโภคครบไหมครับ?",
        "ผังเมืองสีอะไรครับ?",
        "ใกล้แหล่งน้ำไหมครับ?",
        "โอนได้เลยไหมครับ?",
        "ลดได้อีกไหมครับ?",
    ],
    mobile: [
        "แบตเตอรี่เหลือกี่เปอร์เซ็นต์ครับ?",
        "หน้าจอมีรอยแตกไหมครับ?",
        "เครื่องเคย Reset หรือเปล่าครับ?",
        "iCloud ปลดล็อคแล้วหรือยังครับ?",
        "อุปกรณ์ครบไหมครับ?",
        "ลดได้อีกไหมครับ?",
    ],
    general: [
        "สินค้ามีตำหนิไหมครับ?",
        "ใช้งานมานานแค่ไหนครับ?",
        "มีใบประกันไหมครับ?",
        "ส่งได้ไหมครับ?",
        "นัดรับได้ที่ไหนครับ?",
        "ลดได้อีกไหมครับ?",
    ],
}

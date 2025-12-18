export interface User {
    id: string
    role: 'buyer' | 'seller' | 'hybrid' | 'admin'
    email: string
    displayName?: string // Firebase uses displayName
    full_name?: string   // Custom field
    phoneNumber?: string
    photoURL?: string    // Firebase uses photoURL

    // Address (Default)
    address?: Address

    // Verification
    is_verified: boolean
    verification_tier: 'unverified' | 'basic' | 'pro' | 'official'
    trust_score: number // JKS Score 0-100
    created_at: string | Date
    updated_at: string | Date
}

export interface Address {
    name?: string
    phone?: string
    address_line1: string
    subdistrict: string // Tambon
    district: string    // Amphoe
    province: string
    postal_code: string
    is_default?: boolean
}

// --- Storefront V3 Types ---

export interface Store {
    id: string
    owner_id: string
    slug: string // Unique, SEO-friendly
    name: string
    name_en?: string // English Name
    type: 'general' | 'official'

    // Branding
    logo_url?: string
    cover_url?: string
    tagline?: string
    description?: string
    description_en?: string // English Description
    theme_settings?: {
        primary_color: string
        template_id: 'standard' | 'minimal' | 'brand-focus'
        banner_images: string[] // Carousel
    }

    // Verification & Trust
    verified_status: 'unverified' | 'pending' | 'verified'
    verified_docs?: VerifiedDoc[]
    trust_score: number // 0-100
    seller_level: 'new' | 'standard' | 'pro' | 'official'
    badges: string[]

    // Onboarding Progress (0-7)
    onboarding_progress: number

    // Ops Info
    contact_email?: string
    contact_phone?: string
    location?: {
        province: string
        district: string
        formatted_address: string
        coordinates?: { lat: number, lng: number }
    }
    shipping_fee_default?: number
    free_shipping_min?: number
    shipping_info?: {
        methods: string[]
        avg_prep_time_hours: number
        return_policy: string
    }

    // Stats
    followers_count: number
    sales_count: number
    rating_avg: number
    response_rate: number
    response_time_minutes: number

    created_at: string | Date
    updated_at: string | Date
}

export interface VerifiedDoc {
    doc_url: string
    type: string
    uploaded_at: string | Date
}

export interface StoreStaff {
    id: string
    store_id: string
    user_id: string
    role: 'owner' | 'manager' | 'editor' | 'analyst'
    status: 'active' | 'invited'
}

// Backward compatibility alias if needed
export type SellerProfile = Store

export interface Product {
    id: string
    seller_id: string
    seller_name?: string
    seller_avatar?: string // Optional helper
    seller?: Store // Populated seller profile

    // Basic Info
    title: string
    title_en?: string
    description: string
    description_en?: string
    category_id: string | number // Support both for now, prefer string
    category?: Category
    sub_category_id?: string

    // Condition
    condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor'
    usage_detail?: string // History of usage

    // Pricing
    price: number
    original_price?: number
    price_type: 'fixed' | 'negotiable' | 'auction'

    // Auction Specifics (World-Class Standard)
    auction_config?: {
        mode: 'english' | 'dutch' | 'reverse' // English=Classic, Dutch=Price Drop, Reverse=Service
        start_price: number
        reserve_price?: number // Minimum sell price (Hidden)
        buy_now_price?: number // Optional: Buy immediately
        bid_increment: number  // Minimum step

        // Timing & Anti-Snipe
        start_time: string | Date
        end_time: string | Date
        extend_rule?: {
            is_enabled: boolean
            trigger_window_seconds: number // e.g. last 30s
            extend_seconds: number // e.g. add 60s
        }

        // Access & Fees
        deposit_required?: boolean
        deposit_amount?: number
        participant_level?: 'verified' | 'pro' | 'all'
    }

    auction_state?: {
        current_price: number
        total_bids: number
        last_bidder_id?: string
        winner_id?: string

        status: 'scheduled' | 'active' | 'paused' | 'ended' | 'cancelled' | 'payment_pending'
        ended_at?: string | Date
    }

    // Stock & Status
    stock: number
    status: 'active' | 'hidden' | 'out_of_stock' | 'banned' | 'sold' | 'reserved' | 'pending' | 'rejected' | 'suspended'

    // Media
    images: ProductImage[]
    thumbnail_url?: string
    videos?: string[] // URLs

    // Meta
    tags: string[]

    // AI Features
    ai_tags?: string[]
    ai_image_score?: number
    ai_generated_description?: boolean
    ai_price_suggestion?: boolean
    ai_fraud_score?: number // New: Product risk score

    // Shipping
    shipping_weight?: number
    shipping_options?: ShippingMethod[]
    can_ship: boolean
    can_pickup: boolean

    // Location
    location_province?: string
    location_amphoe?: string
    location_district?: string
    location_zipcode?: string

    // Stats
    views_count: number
    favorites_count: number
    sold_count: number
    is_best_seller?: boolean
    is_trending?: boolean

    // SEO
    slug: string
    seo_keywords?: string[]

    created_at: string | Date
    updated_at: string | Date
}

export interface Category {
    id: string | number
    name_th: string
    name_en: string
    slug: string
    icon: string
}

export interface ProductImage {
    url: string
    order: number
    is_primary?: boolean
}

export interface ShippingMethod {
    method: 'thaipost_ems' | 'thaipost_reg' | 'kerry' | 'flash' | 'j&t' | 'other'
    price: number
    estimated_days?: string
}

export interface Order {
    id: string
    order_number: string
    buyer_id: string
    seller_id: string

    items: OrderItem[]

    // Financials
    total_price: number
    shipping_fee: number
    discount_amount: number
    net_total: number

    // Workflow
    status: 'pending_payment' | 'paid' | 'shipping' | 'shipped' | 'completed' | 'cancelled'
    payment_method: 'promptpay' | 'credit_card' | 'transfer' | 'cod'
    payment_slip_url?: string

    // Shipping
    shipping_address: Address
    tracking_number?: string
    shipping_provider?: string

    created_at: string | Date
    updated_at: string | Date
}

export interface OrderItem {
    id: string
    product_id: string
    product_title: string
    product_image: string
    quantity: number
    price_per_unit: number
    total_price: number
}

export interface Promotion {
    id: string
    store_id: string
    name: string
    type: 'discount_code' | 'flash_sale' | 'bundle'

    // Logic
    code?: string // for coupons
    discount_type: 'percent' | 'fixed_amount'
    discount_value: number
    min_spend?: number
    bundle_products?: string[] // Product IDs
    max_discount?: number // Max cap for percent

    start_at: string | Date
    end_at: string | Date
    usage_limit: number
    usage_count: number
    status: 'scheduled' | 'active' | 'ended' | 'disabled'

    created_at?: string | Date
}

// --- Chat System V2 Types ---

export interface Conversation {
    id: string
    type: 'buying' | 'selling' | 'support'
    participants: string[] // User IDs
    product_id?: string // Context

    // Status
    last_message?: {
        text: string
        sender_id: string
        sent_at: string | Date
        is_read: boolean
    }
    unread_counts: Record<string, number>
    pinned_by: string[]
    archived_by: string[]

    // AI Metadata
    overall_risk_score: number
    deal_stage: 'inquiry' | 'negotiation' | 'agreement' | 'completed'

    created_at: string | Date
    updated_at: string | Date
}

export interface ChatMessage {
    id: string
    conversation_id: string
    sender_id: string
    type: 'text' | 'image' | 'video' | 'location' | 'offer' | 'meeting_proposal' | 'system'

    content: string // Text or fallback
    media_url?: string

    // Structured Data
    payload?: {
        offer_price?: number
        meeting_location?: { name: string, lat: number, lng: number }
        meeting_time?: string | Date
    }

    // AI & Safety
    metadata?: {
        intent?: string
        risk_score?: number
        detected_entities?: string[]
        ai_suggestions?: ChatSuggestion[] // Pre-calculated suggestions
    }

    // Status
    read_by: string[]
    created_at: string | Date
}

export interface ChatSuggestion {
    id: string
    type: 'reply' | 'action'
    text: string
    action_payload?: any
    confidence: number
}

export interface WalletTransaction {
    id: string
    seller_id: string
    type: 'income' | 'withdraw' | 'fee' | 'refund'
    amount: number
    balance_before: number
    balance_after: number
    description: string
    related_order_id?: string
    status: 'pending' | 'success' | 'failed'
    created_at: string | Date
}

// --- Review Engine V2 Types ---

export interface Review {
    id: string
    product_id: string
    store_id: string
    user_id: string
    order_id: string | null // Nullable for open reviews

    // Rating Dimensions
    rating_overall: number // 1-5
    rating_details?: {
        item_condition: number
        description_accuracy: number
        shipping_speed: number
        seller_communication: number
    }

    // Content
    comment: string
    tags: string[]
    media: {
        url: string
        type: 'image' | 'video'
        thumbnail_url?: string
    }[]

    // Metadata
    is_verified_purchase: boolean
    is_anonymous: boolean
    display_name: string

    // Engagement
    helpful_count: number
    report_count: number

    // Reply
    seller_reply?: {
        text: string
        replied_at: string | Date
    }

    status: 'pending' | 'published' | 'hidden' | 'rejected'

    created_at: string | Date
    updated_at: string | Date
}

export interface ReviewFlag {
    id: string
    review_id: string
    reporter_id: string
    reason: 'spam' | 'fake' | 'abusive' | 'irrelevant' | 'competitor_attack'
    description?: string
    status: 'pending' | 'resolved' | 'dismissed'
    created_at: string | Date
}

export interface ReviewActionLog {
    id: string
    review_id: string
    moderator_id: string
    action: 'approve' | 'reject' | 'hide'
    reason_code: string
    note?: string
    created_at: string | Date
}

// Temporary form data type
export interface ProductFormData {
    title: string
    description: string
    category_id: string
    price: number
    original_price?: number
    condition: string
    province: string
    amphoe: string
    district: string
    zipcode: string
    can_ship: boolean
    can_pickup: boolean

    // New fields
    stock: number
    shipping_fee?: number
    tags?: string
}

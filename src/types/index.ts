export interface User {
    id: string
    role: 'buyer' | 'seller' | 'admin'
    email: string
    displayName?: string // Firebase uses displayName
    full_name?: string   // Custom field
    phoneNumber?: string
    photoURL?: string    // Firebase uses photoURL

    // Address (Default)
    address?: Address

    // Verification
    is_verified: boolean
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

export interface SellerProfile {
    id: string
    user_id: string
    shop_name: string
    shop_slug: string
    shop_description: string
    avatar_url?: string
    cover_url?: string

    main_categories: string[] // IDs of categories

    // Stats
    rating_score: number
    rating_count: number
    trust_score: number
    follower_count: number
    response_rate: number

    shop_policies?: {
        warranty: string
        return: string
        shipping: string
    }

    address?: {
        province: string
        amphoe: string
        district: string
        zipcode: string
        detail: string
    }

    is_verified_seller: boolean

    created_at: string | Date
    updated_at: string | Date
}

export interface Product {
    id: string
    seller_id: string
    seller_name?: string
    seller_avatar?: string // Optional helper
    seller?: SellerProfile // Populated seller profile

    // Basic Info
    title: string
    description: string
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

    // Stock
    stock: number
    status: 'active' | 'hidden' | 'out_of_stock' | 'banned' | 'sold'

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
    seller_id: string
    type: 'boost_post' | 'discount_code' | 'shop_coupon'
    name: string
    code?: string

    discount_type?: 'percent' | 'fixed'
    discount_value?: number
    min_spend?: number

    start_date: string | Date
    end_date: string | Date
    is_active: boolean
    usage_limit?: number
    usage_count: number
}

export interface ChatMessage {
    id: string
    sender_id: string
    receiver_id: string
    product_id?: string // Context

    message_text: string
    media_url?: string
    message_type: 'text' | 'image' | 'product_card' | 'offer'

    is_read: boolean
    created_at: string | Date
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

export interface Review {
    id: string
    order_id: string
    product_id: string
    reviewer_id: string
    rating: number // 1-5
    comment: string
    images?: string[]
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

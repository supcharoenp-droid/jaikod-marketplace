export interface PaginationMeta {
    total: number
    limit: number
    has_more: boolean
    next_cursor?: string
    prev_cursor?: string
}

export interface ApiResponse<T> {
    data: T
    meta?: PaginationMeta
    message?: string // For success/toast messages
    status?: number
}

export interface ApiErrorResponse {
    error: {
        code: string
        message: string
        details?: Record<string, string[]>
    }
}

// Params for fetching lists
export interface ListParams {
    cursor?: string
    limit?: number
    sort?: string
    q?: string // search query
    filters?: Record<string, any>
}

// --- Specific Listing Contracts ---

// 1. Listing (Product)
export interface Listing {
    id: string
    title: string
    price: number
    price_old?: number
    thumbnail: string // Main Display Image
    images: string[]

    // Location (Denormalized)
    province: string
    district: string
    lat: number
    lng: number
    distance_km?: number // Computed relative to user

    // Badges & Status
    badges: ('GOOD_PRICE' | 'NEARBY' | 'VERIFIED' | 'URGENT' | 'HOT' | 'NEW')[]
    status: 'active' | 'sold' | 'reserved'

    // Stats
    views: number
    likes: number

    // Seller Info (Minimal)
    seller: {
        id: string
        name: string
        avatar: string
        rating: number // 0-5
        trust_score: number // 0-100
        is_official: boolean
    }

    // AI Metadata
    ai?: {
        price_score: number // 0-100
        condition_score: number
        image_quality: number
        tags: string[]
    }

    created_at: string
}

// 2. Store (Shop Profile)
export interface StoreProfile {
    id: string
    slug: string
    name: string
    description: string
    avatar: string
    cover_image: string

    rating: number // 0-5
    followers_count: number
    response_rate: number // 0-100

    joined_at: string // ISO

    badges: ('VERIFIED' | 'FAST_SHIPPER' | 'OFFICIAL' | 'TOP_RATED')[]
    is_following?: boolean // User context

    policies?: {
        warranty_days: number
        return_policy: string
    }
}

// 3. AI Analysis (Upload)
export interface AIAnalysisResponse {
    detected_category_id: string
    confidence: number

    image_quality: {
        score: number
        is_blurry: boolean
        lighting_condition: 'good' | 'poor' | 'fair'
    }

    suggested_price: {
        min: number
        max: number
        avg: number
        good_deal_threshold: number
    }

    extracted_tags: string[]
    description_draft: string
}

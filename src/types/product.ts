/**
 * Product Types for Firebase
 * Simplified and aligned with Firebase structure
 */

export interface ProductImage {
    url: string
    order: number
}

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
    images: File[] | string[]
}

export interface FirebaseProduct {
    // Basic Info
    title: string
    description: string
    category_id: number

    // Pricing
    price: number
    original_price: number | null

    // Condition
    condition: string

    // Location
    location_province: string
    location_amphoe: string
    location_district: string
    location_zipcode: string

    // Shipping
    can_ship: boolean
    can_pickup: boolean

    // Seller Info
    seller_id: string  // Firebase UID
    seller_name: string

    // Status
    status: 'active' | 'sold' | 'inactive'

    // Images
    images: ProductImage[]
    thumbnail_url: string

    // SEO
    slug: string

    // Engagement
    views_count: number
    favorites_count: number
    sold_count: number
    is_trending: boolean
    is_best_seller: boolean

    // Timestamps (as Date for easier handling)
    created_at: Date
    updated_at: Date
}

export interface ProductWithId extends FirebaseProduct {
    id: string  // Firestore document ID
}

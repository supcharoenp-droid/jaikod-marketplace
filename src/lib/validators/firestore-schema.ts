/**
 * FIRESTORE SCHEMA VALIDATION
 * 
 * ใช้ Zod สำหรับ validate ข้อมูลก่อนเขียนลง Firestore
 * ช่วยป้องกัน data integrity issues และ ensure consistency
 * 
 * @version 1.0.0
 * @date 2024-12-29
 */

import { z } from 'zod'
import { Timestamp } from 'firebase/firestore'

// ==========================================
// HELPER SCHEMAS
// ==========================================

/**
 * Firebase Timestamp or Date validator
 */
const TimestampSchema = z.union([
    z.instanceof(Date),
    z.object({
        seconds: z.number(),
        nanoseconds: z.number()
    }),
    z.any().refine((val) => val instanceof Timestamp, {
        message: 'Expected Firestore Timestamp'
    })
])

/**
 * Image object schema
 */
const ImageSchema = z.object({
    url: z.string().url(),
    order: z.number().int().min(0).optional(),
    thumbnail_url: z.string().url().optional(),
    width: z.number().int().positive().optional(),
    height: z.number().int().positive().optional(),
    size: z.number().int().positive().optional(),
    format: z.enum(['jpg', 'jpeg', 'png', 'webp', 'gif']).optional()
})

/**
 * Location schema
 */
const LocationSchema = z.object({
    province: z.string().min(1).max(100),
    amphoe: z.string().max(100).optional(),
    tambon: z.string().max(100).optional(),
    zipcode: z.string().length(5).optional(),
    lat: z.number().min(-90).max(90).optional(),
    lng: z.number().min(-180).max(180).optional(),
    coordinates: z.object({
        lat: z.number().min(-90).max(90),
        lng: z.number().min(-180).max(180)
    }).optional()
})

/**
 * Stats schema
 */
const StatsSchema = z.object({
    views: z.number().int().min(0).default(0),
    favorites: z.number().int().min(0).default(0),
    shares: z.number().int().min(0).default(0),
    inquiries: z.number().int().min(0).default(0)
})

/**
 * Seller info schema
 */
const SellerInfoSchema = z.object({
    name: z.string().min(1).max(100),
    avatar: z.string().url().optional(),
    verified: z.boolean().default(false),
    rating: z.number().min(0).max(5).optional(),
    total_sales: z.number().int().min(0).optional()
})

// ==========================================
// LISTING SCHEMA
// ==========================================

export const ListingSchema = z.object({
    // Required fields
    seller_id: z.string().min(1, 'seller_id is required'),
    title: z.string().min(5, 'Title must be at least 5 characters').max(200),
    price: z.number().positive('Price must be positive'),

    // Optional fields with defaults
    title_th: z.string().max(200).optional(),
    title_en: z.string().max(200).optional(),
    description: z.string().max(10000).optional(),
    description_th: z.string().max(10000).optional(),
    description_en: z.string().max(10000).optional(),

    // Category
    category_id: z.number().int().min(1).max(100),
    category_type: z.string().optional(),
    subcategory_id: z.number().int().optional(),

    // Currency
    currency: z.enum(['THB', 'USD', 'EUR']).default('THB'),
    original_price: z.number().positive().optional(),
    negotiable: z.boolean().default(false),

    // Images
    images: z.array(ImageSchema).min(1, 'At least 1 image required').max(20),
    thumbnail_url: z.string().url().optional(),

    // Location
    location: LocationSchema.optional(),

    // Status
    status: z.enum(['draft', 'pending', 'active', 'sold', 'archived', 'rejected']).default('draft'),
    listing_code: z.string().regex(/^JK-[A-Z][A-Z0-9]{4,6}$/).optional(),
    slug: z.string().min(1).optional(),

    // Seller info (denormalized for performance)
    seller_info: SellerInfoSchema.optional(),

    // Stats
    stats: StatsSchema.optional(),

    // Template data (category-specific fields)
    template_data: z.record(z.string(), z.any()).optional(),

    // AI Content
    ai_content: z.object({
        confidence_score: z.number().min(0).max(100).optional(),
        marketing_copy: z.object({
            selling_points: z.array(z.string()).optional(),
            headline: z.string().optional()
        }).optional(),
        price_analysis: z.any().optional(),
        detected_category: z.string().optional()
    }).optional(),

    // Timestamps
    created_at: TimestampSchema.optional(),
    updated_at: TimestampSchema.optional(),
    published_at: TimestampSchema.optional()
})

export type ValidatedListing = z.infer<typeof ListingSchema>

// ==========================================
// USER SCHEMA
// ==========================================

export const UserSchema = z.object({
    // Required
    uid: z.string().min(1),
    email: z.string().email().optional(),

    // Profile
    display_name: z.string().min(1).max(100).optional(),
    photo_url: z.string().url().optional(),
    phone: z.string().regex(/^0[0-9]{8,9}$/).optional(),

    // Verification
    email_verified: z.boolean().default(false),
    phone_verified: z.boolean().default(false),
    identity_verified: z.boolean().default(false),

    // Role
    role: z.enum(['user', 'seller', 'admin', 'moderator']).default('user'),

    // Trust
    trust_score: z.number().min(0).max(100).default(50),

    // Stats
    total_listings: z.number().int().min(0).default(0),
    total_sales: z.number().int().min(0).default(0),
    rating: z.number().min(0).max(5).optional(),

    // Location
    location: LocationSchema.optional(),

    // Preferences
    preferences: z.object({
        language: z.enum(['th', 'en']).default('th'),
        notifications: z.boolean().default(true),
        newsletter: z.boolean().default(false)
    }).optional(),

    // Timestamps
    created_at: TimestampSchema.optional(),
    updated_at: TimestampSchema.optional(),
    last_login: TimestampSchema.optional(),

    // Flags
    is_active: z.boolean().default(true),
    is_banned: z.boolean().default(false),
    isPlaceholder: z.boolean().optional()
})

export type ValidatedUser = z.infer<typeof UserSchema>

// ==========================================
// ORDER SCHEMA
// ==========================================

export const OrderSchema = z.object({
    // Parties
    buyer_id: z.string().min(1),
    seller_id: z.string().min(1),

    // Item
    listing_id: z.string().min(1),
    listing_title: z.string().min(1),
    listing_thumbnail: z.string().url().optional(),

    // Pricing
    price: z.number().positive(),
    shipping_cost: z.number().min(0).default(0),
    total: z.number().positive(),
    currency: z.enum(['THB', 'USD']).default('THB'),

    // Status
    status: z.enum([
        'pending_payment',
        'payment_received',
        'processing',
        'shipped',
        'delivered',
        'completed',
        'cancelled',
        'refunded',
        'disputed'
    ]).default('pending_payment'),

    // Shipping
    shipping_address: z.object({
        name: z.string().min(1),
        phone: z.string().min(9),
        address: z.string().min(10),
        province: z.string().min(1),
        amphoe: z.string().optional(),
        zipcode: z.string().length(5)
    }).optional(),

    tracking_number: z.string().optional(),
    shipping_provider: z.string().optional(),

    // Payment
    payment_method: z.enum(['bank_transfer', 'credit_card', 'promptpay', 'cod']).optional(),
    payment_status: z.enum(['pending', 'paid', 'failed', 'refunded']).default('pending'),

    // Timestamps
    created_at: TimestampSchema.optional(),
    updated_at: TimestampSchema.optional(),
    paid_at: TimestampSchema.optional(),
    shipped_at: TimestampSchema.optional(),
    delivered_at: TimestampSchema.optional(),
    completed_at: TimestampSchema.optional()
})

export type ValidatedOrder = z.infer<typeof OrderSchema>

// ==========================================
// REVIEW SCHEMA
// ==========================================

export const ReviewSchema = z.object({
    // Parties
    reviewer_id: z.string().min(1),
    reviewee_id: z.string().min(1),

    // Context
    order_id: z.string().optional(),
    listing_id: z.string().optional(),

    // Review
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1000).optional(),

    // Type
    type: z.enum(['seller', 'buyer', 'product']).default('seller'),

    // Status
    status: z.enum(['pending', 'published', 'hidden', 'deleted']).default('published'),

    // Timestamps
    created_at: TimestampSchema.optional(),
    updated_at: TimestampSchema.optional()
})

export type ValidatedReview = z.infer<typeof ReviewSchema>

// ==========================================
// TRANSACTION SCHEMA (JaiStar)
// ==========================================

export const TransactionSchema = z.object({
    user_id: z.string().min(1),
    type: z.enum(['earn', 'spend', 'transfer_in', 'transfer_out', 'refund', 'bonus']),
    amount: z.number().int(),
    balance_after: z.number().int().min(0),

    // Reference
    reference_type: z.enum(['listing', 'order', 'referral', 'promotion', 'manual']).optional(),
    reference_id: z.string().optional(),

    // For transfers
    from_user_id: z.string().optional(),
    to_user_id: z.string().optional(),

    // Description
    description: z.string().max(500).optional(),

    // Timestamps
    created_at: TimestampSchema.optional()
})

export type ValidatedTransaction = z.infer<typeof TransactionSchema>

// ==========================================
// MESSAGE SCHEMA
// ==========================================

export const MessageSchema = z.object({
    sender_id: z.string().min(1),
    content: z.string().min(1).max(5000),
    type: z.enum(['text', 'image', 'file', 'system']).default('text'),

    // Media
    media_url: z.string().url().optional(),

    // Status
    read: z.boolean().default(false),
    read_at: TimestampSchema.optional(),

    // Timestamps
    created_at: TimestampSchema.optional()
})

export type ValidatedMessage = z.infer<typeof MessageSchema>

// ==========================================
// VALIDATION FUNCTIONS
// ==========================================

/**
 * Validate listing data before Firestore write
 */
export function validateListing(data: unknown): { success: boolean; data?: ValidatedListing; errors?: z.ZodError } {
    const result = ListingSchema.safeParse(data)
    if (result.success) {
        return { success: true, data: result.data }
    }
    return { success: false, errors: result.error }
}

/**
 * Validate user data before Firestore write
 */
export function validateUser(data: unknown): { success: boolean; data?: ValidatedUser; errors?: z.ZodError } {
    const result = UserSchema.safeParse(data)
    if (result.success) {
        return { success: true, data: result.data }
    }
    return { success: false, errors: result.error }
}

/**
 * Validate order data before Firestore write
 */
export function validateOrder(data: unknown): { success: boolean; data?: ValidatedOrder; errors?: z.ZodError } {
    const result = OrderSchema.safeParse(data)
    if (result.success) {
        return { success: true, data: result.data }
    }
    return { success: false, errors: result.error }
}

/**
 * Validate review data before Firestore write
 */
export function validateReview(data: unknown): { success: boolean; data?: ValidatedReview; errors?: z.ZodError } {
    const result = ReviewSchema.safeParse(data)
    if (result.success) {
        return { success: true, data: result.data }
    }
    return { success: false, errors: result.error }
}

/**
 * Format Zod errors for display
 */
export function formatValidationErrors(errors: z.ZodError): string[] {
    return errors.issues.map((issue: z.ZodIssue) => {
        const path = issue.path.join('.')
        return `${path}: ${issue.message}`
    })
}

/**
 * Sanitize data for Firestore (remove undefined values)
 */
export function sanitizeForFirestore<T extends Record<string, any>>(data: T): Partial<T> {
    const sanitized: Partial<T> = {}

    for (const [key, value] of Object.entries(data)) {
        if (value !== undefined) {
            if (value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
                // Recursively sanitize nested objects
                const nestedSanitized = sanitizeForFirestore(value)
                if (Object.keys(nestedSanitized).length > 0) {
                    (sanitized as any)[key] = nestedSanitized
                }
            } else {
                (sanitized as any)[key] = value
            }
        }
    }

    return sanitized
}

// All schemas and functions are exported above with their declarations

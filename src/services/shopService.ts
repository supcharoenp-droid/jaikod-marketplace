/**
 * JaiKod Shop Service - Firestore Integration
 * 
 * Service สำหรับจัดการ Shop ทั้งหมด:
 * - CRUD operations
 * - Follow/Unfollow
 * - Analytics
 * - Promotions
 */

import {
    collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc,
    query, where, orderBy, limit, startAfter,
    Timestamp, increment, arrayUnion, arrayRemove,
    writeBatch
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type {
    Shop, ShopType, ShopStatus, ShopCreationInput, ShopUpdateInput,
    ShopFollower, ShopCategory, ShopReview, ShopPromotion,
    ShopDailyAnalytics, ShopNotification, ShopListResponse,
    ShopDetailResponse, ShopBadge, ShopStats
} from '@/types/shop'
import { SellerTier, SELLER_TIER_CONFIG } from '@/types/seller.enhanced'
import { Product } from '@/types'

// ==========================================
// COLLECTIONS
// ==========================================

const COLLECTIONS = {
    SHOPS: 'shops',
    SHOP_FOLLOWERS: 'shop_followers',
    SHOP_REVIEWS: 'shop_reviews',
    SHOP_REPORTS: 'shop_reports',
    SHOP_NOTIFICATIONS: 'shop_notifications',
    PRODUCTS: 'products',
    USERS: 'users'
}

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function generateSlug(name: string): string {
    return name
        .toLowerCase()
        .trim()
        .replace(/[^\u0E00-\u0E7Fa-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50)
}

function toFirestoreDate(date: Date): Timestamp {
    return Timestamp.fromDate(date)
}

function fromFirestoreDate(timestamp: any): Date {
    if (!timestamp) return new Date()
    if (timestamp instanceof Timestamp) return timestamp.toDate()
    if (timestamp.seconds) return new Date(timestamp.seconds * 1000)
    if (typeof timestamp === 'string') return new Date(timestamp)
    return new Date()
}

// ==========================================
// SHOP CRUD OPERATIONS
// ==========================================

/**
 * Get shop by ID
 */
export async function getShopById(shopId: string): Promise<Shop | null> {
    try {
        const docRef = doc(db, COLLECTIONS.SHOPS, shopId)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) return null

        return {
            id: docSnap.id,
            ...docSnap.data()
        } as Shop
    } catch (error) {
        console.error('Error getting shop by ID:', error)
        return null
    }
}

/**
 * Get shop by slug
 */
export async function getShopBySlug(slug: string): Promise<Shop | null> {
    try {
        const q = query(
            collection(db, COLLECTIONS.SHOPS),
            where('slug', '==', slug),
            limit(1)
        )
        const snap = await getDocs(q)

        if (snap.empty) return null

        return {
            id: snap.docs[0].id,
            ...snap.docs[0].data()
        } as Shop
    } catch (error) {
        console.error('Error getting shop by slug:', error)
        return null
    }
}

/**
 * Get shop by owner ID
 */
export async function getShopByOwnerId(ownerId: string): Promise<Shop | null> {
    try {
        const q = query(
            collection(db, COLLECTIONS.SHOPS),
            where('owner_id', '==', ownerId),
            limit(1)
        )
        const snap = await getDocs(q)

        if (snap.empty) return null

        return {
            id: snap.docs[0].id,
            ...snap.docs[0].data()
        } as Shop
    } catch (error) {
        console.error('Error getting shop by owner:', error)
        return null
    }
}

/**
 * Create new shop
 */
export async function createShop(
    ownerId: string,
    input: ShopCreationInput
): Promise<Shop> {
    const now = new Date()
    let slug = input.slug || generateSlug(input.name)

    // Check if slug exists
    const existing = await getShopBySlug(slug)
    if (existing) {
        slug = `${slug}-${Date.now().toString(36)}`
    }

    // Get user profile for initial data
    const userDoc = await getDoc(doc(db, COLLECTIONS.USERS, ownerId))
    const userData = userDoc.exists() ? userDoc.data() : {}

    const newShop: Omit<Shop, 'id'> = {
        owner_id: ownerId,
        type: input.type,
        status: 'active',
        visibility: 'public',

        name: input.name,
        slug,
        tagline: input.tagline || '',
        description: input.description,
        short_description: input.description.substring(0, 200),

        branding: {
            logo_url: input.logo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(input.name)}&background=8B5CF6&color=fff&size=200`,
            cover_url: '',
            theme_color: '#8B5CF6',
            theme_layout: 'default'
        },

        location: {
            province: input.location.province,
            amphoe: input.location.amphoe,
            show_on_map: true
        },

        contact: {
            phone: input.contact?.phone,
            line_id: input.contact?.line_id
        },

        ratings: {
            overall: 0,
            total_reviews: 0,
            rating_distribution: { five: 0, four: 0, three: 0, two: 0, one: 0 },
            product_quality: 0,
            communication: 0,
            shipping_speed: 0,
            packaging: 0,
            accuracy: 0,
            value_for_money: 0,
            rating_trend: 'stable'
        },

        trust_score: {
            overall_score: 30, // New shop starts at 30
            breakdown: {
                verification: 0,
                sales_history: 0,
                ratings: 0,
                response: 50,
                delivery: 50
            },
            badges: [],
            trust_level: 'new',
            last_calculated: now
        },

        stats: {
            total_products: 0,
            active_products: 0,
            sold_products: 0,
            total_orders: 0,
            total_revenue: 0,
            avg_order_value: 0,
            total_views: 0,
            monthly_views: 0,
            unique_visitors: 0,
            followers_count: 0,
            following_count: 0,
            response_rate: 100,
            response_time_avg: 0,
            on_time_delivery_rate: 100,
            return_rate: 0,
            last_calculated: now
        },

        seller_tier: 'starter',
        seller_tier_points: 0,

        verification: {
            status: 'phone_verified',
            phone_verified: true,
            id_verified: false,
            business_verified: false
        },

        settings: {
            auto_reply: {
                enabled: false
            },
            vacation_mode: {
                enabled: false,
                auto_decline_orders: false
            },
            notifications: {
                new_order: true,
                new_message: true,
                new_follower: true,
                low_stock: true,
                review: true,
                promotion: true
            },
            order_settings: {
                require_payment_first: false,
                allow_offers: true,
                min_offer_percentage: 80
            }
        },

        promotions: [],
        main_categories: input.main_categories,
        badges: [{
            type: 'new_store',
            name: 'New Store',
            name_th: 'ร้านใหม่',
            icon: '🌟',
            color: 'green',
            earned_at: now,
            expires_at: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 days
            is_visible: true
        }],

        created_at: now,
        updated_at: now,
        last_active: now
    }

    // Create shop document
    const docRef = doc(collection(db, COLLECTIONS.SHOPS))
    await setDoc(docRef, newShop)

    // Update user profile to link shop
    await updateDoc(doc(db, COLLECTIONS.USERS, ownerId), {
        shop_id: docRef.id,
        is_seller: true,
        seller_type: input.type,
        updated_at: toFirestoreDate(now)
    })

    return {
        id: docRef.id,
        ...newShop
    }
}

/**
 * Update shop
 */
export async function updateShop(
    shopId: string,
    input: ShopUpdateInput
): Promise<Shop | null> {
    try {
        const shopRef = doc(db, COLLECTIONS.SHOPS, shopId)
        const updateData: any = {
            updated_at: toFirestoreDate(new Date())
        }

        // Flatten nested objects
        if (input.name) updateData.name = input.name
        if (input.tagline) updateData.tagline = input.tagline
        if (input.description) updateData.description = input.description
        if (input.short_description) updateData.short_description = input.short_description
        if (input.main_categories) updateData.main_categories = input.main_categories
        if (input.seo) updateData.seo = input.seo

        // Handle nested updates
        if (input.branding) {
            Object.entries(input.branding).forEach(([key, value]) => {
                if (value !== undefined) {
                    updateData[`branding.${key}`] = value
                }
            })
        }

        if (input.location) {
            Object.entries(input.location).forEach(([key, value]) => {
                if (value !== undefined) {
                    updateData[`location.${key}`] = value
                }
            })
        }

        if (input.contact) {
            Object.entries(input.contact).forEach(([key, value]) => {
                if (value !== undefined) {
                    updateData[`contact.${key}`] = value
                }
            })
        }

        if (input.settings) {
            Object.entries(input.settings).forEach(([key, value]) => {
                if (value !== undefined) {
                    updateData[`settings.${key}`] = value
                }
            })
        }

        await updateDoc(shopRef, updateData)

        return await getShopById(shopId)
    } catch (error) {
        console.error('Error updating shop:', error)
        return null
    }
}

/**
 * Delete shop (soft delete - change status to closed)
 */
export async function closeShop(shopId: string): Promise<boolean> {
    try {
        await updateDoc(doc(db, COLLECTIONS.SHOPS, shopId), {
            status: 'closed',
            updated_at: toFirestoreDate(new Date())
        })
        return true
    } catch (error) {
        console.error('Error closing shop:', error)
        return false
    }
}

// ==========================================
// SHOP LISTING & SEARCH
// ==========================================

/**
 * Get all shops with filters
 */
export async function getShops(options: {
    type?: ShopType
    status?: ShopStatus
    province?: string
    category?: number
    minRating?: number
    sortBy?: 'newest' | 'rating' | 'followers' | 'sales'
    page?: number
    pageSize?: number
}): Promise<ShopListResponse> {
    try {
        const {
            type, status = 'active', province, category, minRating,
            sortBy = 'newest', page = 1, pageSize = 20
        } = options

        let q = collection(db, COLLECTIONS.SHOPS)
        const constraints: any[] = []

        // Filters
        constraints.push(where('status', '==', status))
        constraints.push(where('visibility', '==', 'public'))

        if (type) constraints.push(where('type', '==', type))
        if (province) constraints.push(where('location.province', '==', province))
        if (category) constraints.push(where('main_categories', 'array-contains', category))

        // Sorting
        switch (sortBy) {
            case 'rating':
                constraints.push(orderBy('ratings.overall', 'desc'))
                break
            case 'followers':
                constraints.push(orderBy('stats.followers_count', 'desc'))
                break
            case 'sales':
                constraints.push(orderBy('stats.total_orders', 'desc'))
                break
            default:
                constraints.push(orderBy('created_at', 'desc'))
        }

        constraints.push(limit(pageSize + 1)) // Get one extra to check hasMore

        const queryRef = query(q, ...constraints)
        const snap = await getDocs(queryRef)

        const shops = snap.docs.slice(0, pageSize).map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Shop[]

        // Filter by rating if needed (can't do in query due to Firestore limitations)
        const filteredShops = minRating
            ? shops.filter(s => s.ratings.overall >= minRating)
            : shops

        return {
            shops: filteredShops,
            total: snap.size,
            page,
            pageSize,
            hasMore: snap.docs.length > pageSize
        }
    } catch (error) {
        console.error('Error getting shops:', error)
        return { shops: [], total: 0, page: 1, pageSize: 20, hasMore: false }
    }
}

/**
 * Get featured shops
 */
export async function getFeaturedShops(limited: number = 6): Promise<Shop[]> {
    try {
        const q = query(
            collection(db, COLLECTIONS.SHOPS),
            where('status', '==', 'active'),
            where('visibility', '==', 'public'),
            orderBy('trust_score.overall_score', 'desc'),
            limit(limited)
        )

        const snap = await getDocs(q)
        return snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Shop[]
    } catch (error) {
        console.error('Error getting featured shops:', error)
        return []
    }
}

/**
 * Get nearby shops
 */
export async function getNearbyShops(province: string, limited: number = 10): Promise<Shop[]> {
    try {
        const q = query(
            collection(db, COLLECTIONS.SHOPS),
            where('status', '==', 'active'),
            where('visibility', '==', 'public'),
            where('location.province', '==', province),
            orderBy('ratings.overall', 'desc'),
            limit(limited)
        )

        const snap = await getDocs(q)
        return snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Shop[]
    } catch (error) {
        console.error('Error getting nearby shops:', error)
        return []
    }
}

// ==========================================
// SHOP FOLLOWERS
// ==========================================

/**
 * Follow a shop
 */
export async function followShop(
    shopId: string,
    userId: string,
    source: 'shop_page' | 'product_page' | 'search' | 'recommendation' = 'shop_page'
): Promise<boolean> {
    try {
        const followerId = `${userId}_${shopId}`
        const followerRef = doc(db, COLLECTIONS.SHOP_FOLLOWERS, followerId)

        // Check if already following
        const existing = await getDoc(followerRef)
        if (existing.exists()) return true

        const batch = writeBatch(db)

        // Create follower document
        batch.set(followerRef, {
            shop_id: shopId,
            user_id: userId,
            followed_at: toFirestoreDate(new Date()),
            notifications_enabled: true,
            source
        })

        // Increment shop followers count
        batch.update(doc(db, COLLECTIONS.SHOPS, shopId), {
            'stats.followers_count': increment(1)
        })

        await batch.commit()
        return true
    } catch (error) {
        console.error('Error following shop:', error)
        return false
    }
}

/**
 * Unfollow a shop
 */
export async function unfollowShop(shopId: string, userId: string): Promise<boolean> {
    try {
        const followerId = `${userId}_${shopId}`
        const followerRef = doc(db, COLLECTIONS.SHOP_FOLLOWERS, followerId)

        // Check if following
        const existing = await getDoc(followerRef)
        if (!existing.exists()) return true

        const batch = writeBatch(db)

        // Delete follower document
        batch.delete(followerRef)

        // Decrement shop followers count
        batch.update(doc(db, COLLECTIONS.SHOPS, shopId), {
            'stats.followers_count': increment(-1)
        })

        await batch.commit()
        return true
    } catch (error) {
        console.error('Error unfollowing shop:', error)
        return false
    }
}

/**
 * Check if user is following shop
 */
export async function isFollowingShop(shopId: string, userId: string): Promise<boolean> {
    try {
        const followerId = `${userId}_${shopId}`
        const followerRef = doc(db, COLLECTIONS.SHOP_FOLLOWERS, followerId)
        const snap = await getDoc(followerRef)
        return snap.exists()
    } catch (error) {
        return false
    }
}

/**
 * Get shop followers
 */
export async function getShopFollowers(shopId: string, limited: number = 50): Promise<ShopFollower[]> {
    try {
        const q = query(
            collection(db, COLLECTIONS.SHOP_FOLLOWERS),
            where('shop_id', '==', shopId),
            orderBy('followed_at', 'desc'),
            limit(limited)
        )

        const snap = await getDocs(q)
        return snap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ShopFollower[]
    } catch (error) {
        console.error('Error getting shop followers:', error)
        return []
    }
}

// ==========================================
// SHOP PRODUCTS
// ==========================================

/**
 * Get shop products
 */
export async function getShopProducts(
    shopId: string,
    options: {
        status?: 'active' | 'all'
        category?: number
        sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'popular'
        page?: number
        pageSize?: number
    } = {}
): Promise<{ products: Product[], total: number, hasMore: boolean }> {
    try {
        const { status = 'active', category, sortBy = 'newest', page = 1, pageSize = 20 } = options

        // Get shop to get owner_id
        const shop = await getShopById(shopId)
        if (!shop) return { products: [], total: 0, hasMore: false }

        let q = collection(db, COLLECTIONS.PRODUCTS)
        const constraints: any[] = [
            where('seller_id', '==', shop.owner_id)
        ]

        if (status === 'active') {
            constraints.push(where('status', '==', 'active'))
        }

        if (category) {
            constraints.push(where('category_id', '==', category))
        }

        // Sorting
        switch (sortBy) {
            case 'price_asc':
                constraints.push(orderBy('price', 'asc'))
                break
            case 'price_desc':
                constraints.push(orderBy('price', 'desc'))
                break
            case 'popular':
                constraints.push(orderBy('views_count', 'desc'))
                break
            default:
                constraints.push(orderBy('created_at', 'desc'))
        }

        constraints.push(limit(pageSize + 1))

        const queryRef = query(q, ...constraints)
        const snap = await getDocs(queryRef)

        const products = snap.docs.slice(0, pageSize).map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Product[]

        return {
            products,
            total: snap.size,
            hasMore: snap.docs.length > pageSize
        }
    } catch (error) {
        console.error('Error getting shop products:', error)
        return { products: [], total: 0, hasMore: false }
    }
}

// ==========================================
// SHOP STATS & ANALYTICS
// ==========================================

/**
 * Increment shop view
 * Only updates if shop document exists in Firestore (not from mock data)
 */
export async function incrementShopView(shopId: string): Promise<void> {
    try {
        // Check if shop exists in Firestore before updating
        const shopRef = doc(db, COLLECTIONS.SHOPS, shopId)
        const shopSnap = await getDoc(shopRef)

        // Only update if document exists (skip for mock data)
        if (!shopSnap.exists()) {
            // Silently skip - shop is from mock data
            return
        }

        await updateDoc(shopRef, {
            'stats.total_views': increment(1),
            'stats.monthly_views': increment(1),
            last_active: toFirestoreDate(new Date())
        })
    } catch (error) {
        // Silently handle - likely mock data
        console.warn('Could not increment shop view (may be mock data):', shopId)
    }
}

/**
 * Update shop stats (should be called by cloud function)
 */
export async function updateShopStats(shopId: string): Promise<void> {
    try {
        const shop = await getShopById(shopId)
        if (!shop) return

        // Get products count
        const productsQuery = query(
            collection(db, COLLECTIONS.PRODUCTS),
            where('seller_id', '==', shop.owner_id)
        )
        const productsSnap = await getDocs(productsQuery)

        let activeCount = 0
        let soldCount = 0

        productsSnap.docs.forEach(doc => {
            const data = doc.data()
            if (data.status === 'active') activeCount++
            if (data.status === 'sold') soldCount++
        })

        await updateDoc(doc(db, COLLECTIONS.SHOPS, shopId), {
            'stats.total_products': productsSnap.size,
            'stats.active_products': activeCount,
            'stats.sold_products': soldCount,
            'stats.last_calculated': toFirestoreDate(new Date())
        })
    } catch (error) {
        console.error('Error updating shop stats:', error)
    }
}

// ==========================================
// SHOP REVIEWS
// ==========================================

/**
 * Get shop reviews
 */
export async function getShopReviews(
    shopId: string,
    options: {
        rating?: number
        sortBy?: 'newest' | 'highest' | 'lowest' | 'helpful'
        page?: number
        pageSize?: number
    } = {}
): Promise<{ reviews: ShopReview[], total: number, hasMore: boolean }> {
    try {
        const { rating, sortBy = 'newest', page = 1, pageSize = 10 } = options

        let q = collection(db, COLLECTIONS.SHOP_REVIEWS)
        const constraints: any[] = [
            where('shop_id', '==', shopId),
            where('status', '==', 'published')
        ]

        if (rating) {
            constraints.push(where('overall_rating', '==', rating))
        }

        // Sorting
        switch (sortBy) {
            case 'highest':
                constraints.push(orderBy('overall_rating', 'desc'))
                break
            case 'lowest':
                constraints.push(orderBy('overall_rating', 'asc'))
                break
            case 'helpful':
                constraints.push(orderBy('is_helpful_count', 'desc'))
                break
            default:
                constraints.push(orderBy('created_at', 'desc'))
        }

        constraints.push(limit(pageSize + 1))

        const queryRef = query(q, ...constraints)
        const snap = await getDocs(queryRef)

        const reviews = snap.docs.slice(0, pageSize).map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as ShopReview[]

        return {
            reviews,
            total: snap.size,
            hasMore: snap.docs.length > pageSize
        }
    } catch (error) {
        console.error('Error getting shop reviews:', error)
        return { reviews: [], total: 0, hasMore: false }
    }
}

// ==========================================
// BACKWARD COMPATIBILITY (for existing storeService)
// ==========================================

export const shopService = {
    getShopProfile: getShopBySlug,
    getShopById,
    getShopBySlug,
    getShopByOwnerId,
    createShop,
    updateShop,
    closeShop,
    getShops,
    getFeaturedShops,
    getNearbyShops,
    followShop,
    unfollowShop,
    isFollowingShop,
    getShopFollowers,
    getShopProducts,
    getShopReviews,
    incrementShopView,
    updateShopStats
}

export default shopService

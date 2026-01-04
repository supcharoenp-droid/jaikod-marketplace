/**
 * SELLER SERVICE (CANONICAL)
 * 
 * ✅ This is the CANONICAL service for seller display data
 * Use this for all UI components that need real-time seller information
 * 
 * ดึงข้อมูลผู้ขายแบบ Real-time จาก Firestore `users` collection
 * 
 * Collections Used:
 * - users: Main user data with seller info (hasStore, shopName, etc.)
 * - listings: For counting active listings
 * - products: For counting legacy products
 * 
 * Exports:
 * - getSellerProfile() - Get full seller profile with real-time stats
 * - getSellerListings() - Get seller's other listings
 * - getSimilarListings() - Get similar category listings
 * - updateSellerStats() - Update seller statistics
 * 
 * @module lib/seller/index
 * @version 2.0.0
 * @updated 2025-12-30
 */

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    query,
    where,
    orderBy,
    limit,
    Timestamp,
    serverTimestamp
} from 'firebase/firestore'
import { db } from '../firebase'
import type { SellerProfile, SellerListing } from '../../types/seller'
export type { SellerProfile, SellerListing }
type SellerProfileType = SellerProfile

// ==========================================
// COLLECTION NAMES
// ==========================================

const USERS_COLLECTION = 'users'
const LISTINGS_COLLECTION = 'listings'

// ==========================================
// GET SELLER PROFILE
// ==========================================

/**
 * Get seller profile by ID
 * ดึงข้อมูลล่าสุดจาก users collection (ไม่ใช่ embedded data)
 */
export async function getSellerProfile(sellerId: string): Promise<SellerProfile | null> {
    // Guard: prevent undefined sellerId from hitting Firebase
    if (!sellerId) {
        console.warn('getSellerProfile called with undefined sellerId');
        return null;
    }

    try {
        const userRef = doc(db, USERS_COLLECTION, sellerId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            console.log('Seller not found:', sellerId)
            return null
        }

        const data = userDoc.data()

        // Parse dates
        const memberSince = data.created_at?.toDate?.() ||
            data.member_since?.toDate?.() ||
            data.createdAt?.toDate?.() ||
            new Date()
        const lastActive = data.last_active?.toDate?.() ||
            data.updated_at?.toDate?.() ||
            data.lastActive?.toDate?.()

        // Calculate trust score from verifications
        let trustScore = data.trust_score || data.trustScore || 50
        if (data.phone_verified || data.phoneVerified) trustScore += 10
        if (data.email_verified || data.emailVerified) trustScore += 5
        if (data.id_verified || data.idVerified) trustScore += 20
        trustScore = Math.min(100, trustScore)

        // Build badges
        const badges: string[] = []
        if (data.verified || data.isVerified) badges.push('verified')
        if (data.phone_verified || data.phoneVerified) badges.push('phone_verified')
        if (data.successful_sales >= 10) badges.push('power_seller')
        if (data.response_time_minutes <= 30) badges.push('fast_response')

        // Count REAL listings from both collections
        // Note: Query without composite index - filter client-side
        let listingsCount = 0
        let productsCount = 0

        try {
            // Get ALL listings by seller_id (single field query)
            const listingsSnap = await getDocs(query(
                collection(db, LISTINGS_COLLECTION),
                where('seller_id', '==', sellerId)
            ))
            // Filter active status client-side
            listingsCount = listingsSnap.docs.filter(doc => doc.data().status === 'active').length
            console.log(`📊 Listings: ${listingsSnap.size} total, ${listingsCount} active`)
        } catch (e) {
            console.log('No listings found or query failed:', e)
        }

        try {
            // Products collection might use 'sellerId' (camelCase) instead of 'seller_id'
            const productsSnap = await getDocs(query(
                collection(db, 'products'),
                where('sellerId', '==', sellerId)
            ))
            productsCount = productsSnap.size
            console.log(`📊 Products: ${productsCount}`)
        } catch (e) {
            console.log('No products found or query failed:', e)
        }

        const totalListings = listingsCount + productsCount
        console.log(`📊 Seller ${sellerId}: ${listingsCount} listings + ${productsCount} products = ${totalListings} total`)

        return {
            id: userDoc.id,
            name: data.displayName || data.name || data.shopName || 'ผู้ขาย',
            avatar: data.photoURL || data.avatar,
            verified: data.verified || data.isVerified || data.id_verified || false,
            trust_score: trustScore,
            response_time_minutes: data.response_time_minutes || data.responseTimeMinutes || 60,
            response_rate: data.response_rate || data.responseRate || 80,
            total_listings: totalListings, // Use real count
            active_listings: totalListings, // Use real count
            successful_sales: data.successful_sales || data.successfulSales || 0,
            member_since: memberSince,
            last_active: lastActive,
            location: data.location || data.province,
            phone_verified: data.phone_verified || data.phoneVerified || false,
            email_verified: data.email_verified || data.emailVerified || false,
            id_verified: data.id_verified || data.idVerified || false,
            followers_count: data.followers_count || data.followers || 0,
            following_count: data.following_count || 0,
            badges
        } as SellerProfile
    } catch (error) {
        console.error('Error getting seller profile:', error)
        return null
    }
}

// ==========================================
// GET SELLER LISTINGS
// ==========================================

/**
 * Get other listings from the same seller
 */
export async function getSellerListings(
    sellerId: string,
    excludeListingId?: string,
    limitCount: number = 6
): Promise<SellerListing[]> {
    try {
        const q = query(
            collection(db, LISTINGS_COLLECTION),
            where('seller_id', '==', sellerId),
            where('status', '==', 'active'),
            orderBy('created_at', 'desc'),
            limit(limitCount + 1) // +1 to account for exclusion
        )

        const snapshot = await getDocs(q)

        return snapshot.docs
            .filter(doc => doc.id !== excludeListingId)
            .slice(0, limitCount)
            .map(doc => {
                const data = doc.data()
                return {
                    id: doc.id,
                    slug: data.slug,
                    title: data.title,
                    price: data.price,
                    thumbnail_url: data.thumbnail_url || data.images?.[0]?.url || '',
                    created_at: data.created_at?.toDate?.() || new Date(),
                    views: data.stats?.views || 0,
                    status: data.status
                }
            })
    } catch (error) {
        console.error('Error getting seller listings:', error)
        return []
    }
}

// ==========================================
// GET SIMILAR LISTINGS
// ==========================================

/**
 * Get similar listings from the same category
 */
export async function getSimilarListings(
    categoryType: string,
    excludeListingId: string,
    limitCount: number = 4
): Promise<SellerListing[]> {
    try {
        const q = query(
            collection(db, LISTINGS_COLLECTION),
            where('category_type', '==', categoryType),
            where('status', '==', 'active'),
            orderBy('created_at', 'desc'),
            limit(limitCount + 1)
        )

        const snapshot = await getDocs(q)

        return snapshot.docs
            .filter(doc => doc.id !== excludeListingId)
            .slice(0, limitCount)
            .map(doc => {
                const data = doc.data()
                return {
                    id: doc.id,
                    slug: data.slug,
                    title: data.title,
                    price: data.price,
                    thumbnail_url: data.thumbnail_url || data.images?.[0]?.url || '',
                    created_at: data.created_at?.toDate?.() || new Date(),
                    views: data.stats?.views || 0,
                    status: data.status
                }
            })
    } catch (error) {
        console.error('Error getting similar listings:', error)
        return []
    }
}

// ==========================================
// CALCULATE RESPONSE RATE
// ==========================================

/**
 * Calculate actual response rate from chat history
 * This should be called periodically to update user document
 */
export async function calculateResponseRate(sellerId: string): Promise<number> {
    // Guard: prevent undefined sellerId
    if (!sellerId) {
        console.warn('calculateResponseRate called with undefined sellerId');
        return 80;
    }

    try {
        // Query seller's conversations
        const chatsRef = collection(db, 'conversations');
        const q = query(
            chatsRef,
            where('participants', 'array-contains', sellerId),
            limit(50)
        );

        const snapshot = await getDocs(q)

        if (snapshot.empty) return 80 // Default for new sellers

        let answered = 0
        let total = 0

        snapshot.docs.forEach(doc => {
            const data = doc.data()
            total++
            if (data.seller_replied) answered++
        })

        if (total === 0) return 80

        return Math.round((answered / total) * 100)
    } catch (error) {
        console.error('Error calculating response rate:', error)
        return 80
    }
}

// ==========================================
// UPDATE SELLER STATS
// ==========================================

/**
 * Update seller statistics
 * Should be called when listing is created/sold/deleted
 */
export async function updateSellerStats(sellerId: string): Promise<void> {
    // Guard: prevent undefined sellerId
    if (!sellerId) {
        console.warn('updateSellerStats called with undefined sellerId');
        return;
    }

    try {
        // Count active listings
        const activeQ = query(
            collection(db, LISTINGS_COLLECTION),
            where('seller_id', '==', sellerId),
            where('status', '==', 'active')
        )
        const activeSnapshot = await getDocs(activeQ)
        const activeListings = activeSnapshot.size

        // Count sold listings
        const soldQ = query(
            collection(db, LISTINGS_COLLECTION),
            where('seller_id', '==', sellerId),
            where('status', '==', 'sold')
        )
        const soldSnapshot = await getDocs(soldQ)
        const successfulSales = soldSnapshot.size

        // Count total listings
        const totalQ = query(
            collection(db, LISTINGS_COLLECTION),
            where('seller_id', '==', sellerId)
        )
        const totalSnapshot = await getDocs(totalQ)
        const totalListings = totalSnapshot.size

        // Update user document
        const userRef = doc(db, USERS_COLLECTION, sellerId)
        const { setDoc } = await import('firebase/firestore')
        await setDoc(userRef, {
            active_listings: activeListings,
            successful_sales: successfulSales,
            total_listings: totalListings,
            stats_updated_at: new Date()
        }, { merge: true })

        console.log(`✅ Updated stats for seller ${sellerId}:`, {
            activeListings,
            successfulSales,
            totalListings
        })
    } catch (error) {
        console.error('Error updating seller stats:', error)
    }
}

// ==========================================
// RECOMMENDED SELLER (for discovery)
// ==========================================

/**
 * RecommendedSeller - Extended seller info for discovery/nearby features
 */
export interface RecommendedSeller {
    id: string
    shopName: string
    shopSlug: string
    shopDescription?: string
    shopLogo?: string
    shopCover?: string
    province?: string
    amphoe?: string
    mainCategories: string[]
    ratingScore: number
    ratingCount: number
    totalSales: number
    responseRate: number
    isVerified: boolean
    badges: string[]
    createdAt: Date
    // Calculated fields
    distanceKm: number | null
    trustScore: number
    matchScore: number
    matchReason: string
}

/**
 * Calculate trust score for a seller
 */
function calculateTrustScore(data: any): number {
    let score = 50 // Base score

    // Rating score contribution (max 25 points)
    const ratingScore = data.ratingScore || data.rating_score || 0
    score += Math.min(25, ratingScore * 5)

    // Rating count contribution (max 15 points)
    const ratingCount = data.ratingCount || data.rating_count || 0
    if (ratingCount >= 100) score += 15
    else if (ratingCount >= 50) score += 10
    else if (ratingCount >= 10) score += 5

    // Verification bonus (10 points)
    if (data.isVerified || data.is_verified_seller) score += 10

    // Response rate contribution (max 10 points)
    const responseRate = data.responseRate || data.response_rate || 0
    score += Math.min(10, responseRate / 10)

    return Math.min(100, Math.round(score))
}

/**
 * Get recommended/nearby sellers
 * Replaces deprecated getRealNearbySellers from realSellerService
 */
export async function getNearbySellers(maxCount: number = 6): Promise<RecommendedSeller[]> {
    try {
        // Query users who have a store
        const usersRef = collection(db, USERS_COLLECTION)
        const q = query(
            usersRef,
            where('hasStore', '==', true),
            limit(maxCount * 2) // Fetch more to filter
        )

        const snapshot = await getDocs(q)

        if (snapshot.empty) {
            console.log('📭 No sellers found in database')
            return []
        }

        const sellers: RecommendedSeller[] = []

        for (const docSnap of snapshot.docs) {
            const data = docSnap.data()

            // Skip if no shop data
            if (!data.shopName && !data.shop_name) continue

            // Calculate trust score
            const trustScore = calculateTrustScore(data)

            // Calculate match score (simplified - no distance for now)
            const matchScore = Math.min(100, Math.round(trustScore * 0.7 + 25))

            // Determine match reason
            let matchReason = 'ร้านแนะนำ'
            if (trustScore >= 80) {
                matchReason = 'ร้านน่าเชื่อถือสูง'
            }

            sellers.push({
                id: docSnap.id,
                shopName: data.shopName || data.shop_name || 'ร้านค้า',
                shopSlug: data.shopSlug || data.shop_slug || docSnap.id,
                shopDescription: data.shopDescription || data.shop_description,
                shopLogo: data.shopLogo || data.shop_logo || data.photoURL,
                shopCover: data.shopCover || data.shop_cover,
                province: data.province || data.address?.province,
                amphoe: data.amphoe || data.address?.amphoe,
                mainCategories: data.mainCategories || data.main_categories || [],
                ratingScore: data.ratingScore || data.rating_score || 0,
                ratingCount: data.ratingCount || data.rating_count || 0,
                totalSales: data.totalSales || data.successful_sales_count || 0,
                responseRate: data.responseRate || data.response_rate || 0,
                isVerified: data.isVerified || data.is_verified_seller || false,
                badges: data.badges || [],
                createdAt: data.createdAt?.toDate() || new Date(),
                distanceKm: null, // Distance calculation can be added later
                trustScore,
                matchScore,
                matchReason
            })
        }

        // Sort by match score (highest first)
        sellers.sort((a, b) => b.matchScore - a.matchScore)

        // Return top sellers
        return sellers.slice(0, maxCount)
    } catch (error) {
        console.error('Error fetching nearby sellers:', error)
        return []
    }
}

// ==========================================
// SELLER INFO SYNC (Phase 3: Data Architecture)
// ==========================================

/**
 * ListingSellerInfo - The seller_info structure stored in each listing
 * This should be synced whenever seller profile changes
 */
export interface ListingSellerInfo {
    name: string
    avatar?: string
    verified: boolean
    phone_verified?: boolean
    trust_score: number
    response_time_minutes?: number
    total_listings?: number
    active_listings?: number
}

/**
 * Get fresh seller_info for embedding in a listing
 * Use this when creating or updating a listing
 */
export async function getSellerInfoForListing(sellerId: string): Promise<ListingSellerInfo> {
    try {
        const userRef = doc(db, USERS_COLLECTION, sellerId)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
            return {
                name: 'ผู้ขาย',
                verified: false,
                trust_score: 50
            }
        }

        const data = userDoc.data()

        // Count real-time listings
        const { getDocs: getDocsImport, query: queryImport, where: whereImport } = await import('firebase/firestore')
        const listingsQ = queryImport(
            collection(db, LISTINGS_COLLECTION),
            whereImport('seller_id', '==', sellerId),
            whereImport('status', '==', 'active')
        )
        const listingsSnap = await getDocsImport(listingsQ)
        const activeListings = listingsSnap.size

        return {
            name: data.shopName || data.displayName || 'ผู้ขาย',
            avatar: data.shopLogo || data.photoURL,
            verified: data.isVerified || data.is_verified_seller || false,
            phone_verified: data.phoneVerified || data.phone_verified || false,
            trust_score: data.trustScore || calculateTrustScore(data),
            response_time_minutes: data.responseTimeMinutes || data.response_time_minutes || 60,
            total_listings: activeListings,
            active_listings: activeListings
        }
    } catch (error) {
        console.error('Error getting seller info for listing:', error)
        return {
            name: 'ผู้ขาย',
            verified: false,
            trust_score: 50
        }
    }
}

/**
 * Sync seller_info to all listings owned by this seller
 * Call this when seller profile is updated
 * 
 * @example
 * // After updating seller profile
 * await updateSellerProfile(sellerId, { shopName: 'New Name' })
 * await syncSellerInfoToListings(sellerId)
 */
export async function syncSellerInfoToListings(sellerId: string): Promise<{ updated: number; errors: number }> {
    console.log(`🔄 Syncing seller_info for seller: ${sellerId}`)

    let updated = 0
    let errors = 0

    try {
        // Get fresh seller info
        const sellerInfo = await getSellerInfoForListing(sellerId)

        // Find all listings by this seller
        const listingsQ = query(
            collection(db, LISTINGS_COLLECTION),
            where('seller_id', '==', sellerId)
        )
        const listingsSnap = await getDocs(listingsQ)

        console.log(`📦 Found ${listingsSnap.size} listings to update`)

        // Update each listing
        const { updateDoc: updateDocImport, doc: docImport } = await import('firebase/firestore')

        for (const listingDoc of listingsSnap.docs) {
            try {
                const listingRef = docImport(db, LISTINGS_COLLECTION, listingDoc.id)
                await updateDocImport(listingRef, {
                    seller_info: sellerInfo,
                    updated_at: new Date()
                })
                updated++
            } catch (err) {
                console.error(`Failed to update listing ${listingDoc.id}:`, err)
                errors++
            }
        }

        console.log(`✅ Synced seller_info: ${updated} updated, ${errors} errors`)
    } catch (error) {
        console.error('Error syncing seller info to listings:', error)
    }

    return { updated, errors }
}

/**
 * Update a single listing's seller_info
 * Useful for on-demand refresh
 */
export async function refreshListingSellerInfo(listingId: string): Promise<boolean> {
    try {
        const listingRef = doc(db, LISTINGS_COLLECTION, listingId)
        const listingDoc = await getDoc(listingRef)

        if (!listingDoc.exists()) {
            console.error('Listing not found:', listingId)
            return false
        }

        const sellerId = listingDoc.data().seller_id
        if (!sellerId) {
            console.error('No seller_id in listing:', listingId)
            return false
        }

        const sellerInfo = await getSellerInfoForListing(sellerId)

        const { updateDoc: updateDocImport } = await import('firebase/firestore')
        await updateDocImport(listingRef, {
            seller_info: sellerInfo,
            updated_at: new Date()
        })

        console.log(`✅ Refreshed seller_info for listing: ${listingId}`)
        return true
    } catch (error) {
        console.error('Error refreshing listing seller_info:', error)
        return false
    }
}


// ==========================================
// SHOP REGISTRATION (Legacy/Internal)
// ==========================================

const SELLER_PROFILES_COLLECTION = 'seller_profiles'

/**
 * Get shop registration profile
 */
export async function getShopProfile(userId: string): Promise<SellerProfileType | null> {
    try {
        const q = query(collection(db, SELLER_PROFILES_COLLECTION), where('user_id', '==', userId))
        const querySnapshot = await getDocs(q)
        if (querySnapshot.empty) return null
        const docSnap = querySnapshot.docs[0]
        return { id: docSnap.id, ...docSnap.data() } as SellerProfileType
    } catch (error) {
        console.error('Error getting shop profile:', error)
        return null
    }
}

/**
 * Create a new seller/shop profile
 */
export async function createSellerProfile(
    userId: string,
    data: {
        shop_name: string,
        shop_description: string,
        shop_description_th?: string,
        shop_description_en?: string,
        shop_logo?: string,
        is_verified?: boolean,
        address: any
    }
): Promise<string> {
    try {
        const slug = data.shop_name
            .toLowerCase()
            .replace(/[^\w\sก-๙]/g, '')
            .replace(/\s+/g, '-') + '-' + Math.random().toString(36).substring(2, 6)

        const newProfileRef = doc(collection(db, SELLER_PROFILES_COLLECTION))
        const profileId = newProfileRef.id

        const profileData = {
            owner_id: userId,
            user_id: userId,
            name: data.shop_name,
            shop_name: data.shop_name,
            slug: slug,
            shop_slug: slug,
            description: data.shop_description,
            description_th: data.shop_description_th || '',
            description_en: data.shop_description_en || '',
            shop_description: data.shop_description,
            logo_url: data.shop_logo || '',
            shop_logo: data.shop_logo || '',
            type: 'general',
            onboarding_progress: 1,
            rating_avg: 0,
            sales_count: 0,
            trust_score: data.is_verified ? 80 : 50,
            followers_count: 0,
            response_rate: 100,
            verified_status: data.is_verified ? 'verified' : 'unverified',
            seller_level: 'new',
            badges: [],
            created_at: serverTimestamp(),
            updated_at: serverTimestamp(),
            location: {
                formatted_address: data.address ? `${data.address.detail} ${data.address.subdistrict} ${data.address.district} ${data.address.province} ${data.address.zipcode}` : '',
                province: data.address?.province || '',
                district: data.address?.district || ''
            }
        }

        await setDoc(newProfileRef, profileData)
        return profileId
    } catch (error) {
        console.error('Error creating seller profile:', error)
        throw error
    }
}

/**
 * Update seller profile
 */
export async function updateSellerProfile(
    userId: string,
    data: Partial<SellerProfileType>
): Promise<boolean> {
    try {
        const q = query(collection(db, SELLER_PROFILES_COLLECTION), where('user_id', '==', userId))
        const querySnapshot = await getDocs(q)
        if (querySnapshot.empty) return false
        const docRef = doc(db, SELLER_PROFILES_COLLECTION, querySnapshot.docs[0].id)
        await updateDoc(docRef, { ...data, updated_at: serverTimestamp() })
        return true
    } catch (error) {
        console.error('Error updating seller profile:', error)
        return false
    }
}

export async function checkShopNameAvailability(name: string): Promise<boolean> {
    const q = query(collection(db, SELLER_PROFILES_COLLECTION), where('shop_name', '==', name))
    const snapshot = await getDocs(q)
    return snapshot.empty
}

export async function getSellerProfileBySlug(slug: string): Promise<SellerProfileType | null> {
    try {
        const q = query(collection(db, SELLER_PROFILES_COLLECTION), where('shop_slug', '==', slug))
        const snapshot = await getDocs(q)
        if (snapshot.empty) return null
        const docSnap = snapshot.docs[0]
        return { id: docSnap.id, ...docSnap.data() } as SellerProfileType
    } catch (error) {
        console.error('Error getting seller profile by slug:', error)
        return null
    }
}


/**
 * UNIFIED LISTING SERVICE
 * 
 * Service สำหรับดึงข้อมูล Listing และ Seller แบบ Unified
 * รับประกันความถูกต้องของข้อมูล
 * 
 * @version 2.0.0
 */

import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type {
    ListingData,
    SellerData,
    ListingPreview,
    AIAnalysis
} from '@/contexts/UnifiedListingContext'

// ==========================================
// CONSTANTS
// ==========================================

const LISTINGS_COLLECTION = 'listings'
const PRODUCTS_COLLECTION = 'products'
const USERS_COLLECTION = 'users'

// ==========================================
// HELPERS
// ==========================================

/**
 * Parse Firestore Timestamp to Date safely
 */
function parseDate(value: any): Date {
    if (!value) return new Date()
    if (value instanceof Date) return value
    if (value?.toDate && typeof value.toDate === 'function') return value.toDate()
    if (value?.seconds) return new Date(value.seconds * 1000)
    if (typeof value === 'string' || typeof value === 'number') return new Date(value)
    return new Date()
}

// ==========================================
// GET UNIFIED SELLER DATA
// ==========================================

/**
 * ดึงข้อมูล Seller แบบครบถ้วน รวมถึง count listings จริง
 */
export async function getUnifiedSellerData(sellerId: string): Promise<SellerData | null> {
    try {
        console.log('📊 Fetching unified seller data for:', sellerId)

        // 1. Get user document
        const userRef = doc(db, USERS_COLLECTION, sellerId)
        const userDoc = await getDoc(userRef)

        if (!userDoc.exists()) {
            console.warn('❌ User document not found:', sellerId)
            return null
        }

        const userData = userDoc.data()

        // 2. Count REAL listings from listings collection
        let listingsCount = 0
        try {
            const listingsQuery = query(
                collection(db, LISTINGS_COLLECTION),
                where('seller_id', '==', sellerId),
                where('status', '==', 'active')
            )
            const listingsSnap = await getDocs(listingsQuery)
            listingsCount = listingsSnap.size
            console.log(`   ✓ Listings count: ${listingsCount}`)
        } catch (e) {
            console.log('   ⚠️ Listings query failed:', e)
        }

        // 3. Count from products collection (legacy)
        let productsCount = 0
        try {
            // Try both field names
            const productsQuery1 = query(
                collection(db, PRODUCTS_COLLECTION),
                where('sellerId', '==', sellerId)
            )
            const productsSnap1 = await getDocs(productsQuery1)
            productsCount = productsSnap1.size

            if (productsCount === 0) {
                // Try snake_case
                const productsQuery2 = query(
                    collection(db, PRODUCTS_COLLECTION),
                    where('seller_id', '==', sellerId)
                )
                const productsSnap2 = await getDocs(productsQuery2)
                productsCount = productsSnap2.size
            }
            console.log(`   ✓ Products count: ${productsCount}`)
        } catch (e) {
            console.log('   ⚠️ Products query failed:', e)
        }

        // 4. Count sold items
        let soldCount = 0
        try {
            const soldQuery = query(
                collection(db, LISTINGS_COLLECTION),
                where('seller_id', '==', sellerId),
                where('status', '==', 'sold')
            )
            const soldSnap = await getDocs(soldQuery)
            soldCount = soldSnap.size
            console.log(`   ✓ Sold count: ${soldCount}`)
        } catch (e) {
            console.log('   ⚠️ Sold query failed:', e)
        }

        const totalListings = listingsCount + productsCount

        // 5. Calculate trust score
        let trustScore = userData.trust_score || userData.trustScore || 50
        if (userData.phone_verified || userData.phoneVerified) trustScore += 10
        if (userData.email_verified || userData.emailVerified) trustScore += 5
        if (userData.id_verified || userData.idVerified) trustScore += 20
        if (soldCount >= 5) trustScore += 10
        if (totalListings >= 10) trustScore += 5
        trustScore = Math.min(100, trustScore)

        // 6. Build badges
        const badges: string[] = []
        if (userData.verified || userData.isVerified) badges.push('verified')
        if (userData.phone_verified || userData.phoneVerified) badges.push('phone_verified')
        if (soldCount >= 10) badges.push('power_seller')
        if ((userData.response_time_minutes || 60) <= 30) badges.push('fast_response')
        if (trustScore >= 80) badges.push('trusted')

        // 7. Build seller data
        const sellerData: SellerData = {
            id: userDoc.id,
            name: userData.displayName || userData.name || userData.shopName || 'ผู้ขาย',
            displayName: userData.displayName,
            avatar: userData.photoURL || userData.avatar,
            verified: userData.verified || userData.isVerified || false,
            phone_verified: userData.phone_verified || userData.phoneVerified || false,
            email_verified: userData.email_verified || userData.emailVerified || false,
            id_verified: userData.id_verified || userData.idVerified || false,
            trust_score: trustScore,
            response_time_minutes: userData.response_time_minutes || userData.responseTimeMinutes || 60,
            response_rate: userData.response_rate || userData.responseRate || 80,
            member_since: parseDate(userData.created_at || userData.createdAt || userData.member_since),
            last_active: parseDate(userData.last_active || userData.lastActive || userData.updated_at),
            location: userData.location || userData.province,

            total_listings: totalListings,
            active_listings: listingsCount + productsCount,
            sold_count: soldCount,
            review_count: userData.review_count || userData.reviewCount || 0,
            rating: userData.rating || (trustScore / 20),  // Convert 0-100 to 0-5
            followers_count: userData.followers_count || userData.followers || 0,
            following_count: userData.following_count || 0,

            badges
        }

        console.log('✅ Unified seller data:', {
            name: sellerData.name,
            total_listings: sellerData.total_listings,
            trust_score: sellerData.trust_score
        })

        return sellerData

    } catch (error) {
        console.error('❌ Error fetching unified seller data:', error)
        return null
    }
}

// ==========================================
// GET SELLER OTHER LISTINGS
// ==========================================

/**
 * ดึงสินค้าอื่นของผู้ขาย
 */
export async function getSellerOtherListings(
    sellerId: string,
    excludeListingId: string,
    limitCount: number = 8
): Promise<ListingPreview[]> {
    try {
        const q = query(
            collection(db, LISTINGS_COLLECTION),
            where('seller_id', '==', sellerId),
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
                    created_at: parseDate(data.created_at),
                    views: data.stats?.views || 0,
                    status: data.status,
                    location: data.location ? { province: data.location.province } : undefined
                }
            })
    } catch (error) {
        console.error('Error getting seller other listings:', error)
        return []
    }
}

// ==========================================
// GET SIMILAR LISTINGS
// ==========================================

/**
 * ดึงสินค้าที่คล้ายกัน
 */
export async function getSimilarListingsUnified(
    categoryType: string,
    excludeListingId: string,
    limitCount: number = 8
): Promise<ListingPreview[]> {
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
                    created_at: parseDate(data.created_at),
                    views: data.stats?.views || 0,
                    status: data.status,
                    location: data.location ? { province: data.location.province } : undefined
                }
            })
    } catch (error) {
        console.error('Error getting similar listings:', error)
        return []
    }
}

// ==========================================
// GENERATE AI ANALYSIS
// ==========================================

/**
 * Generate AI analysis for listing (mock for now)
 */
export function generateAIAnalysis(listing: ListingData): AIAnalysis {
    const templateData = listing.template_data || {}

    // Calculate factors
    const factors: AIAnalysis['factors'] = []
    let totalScore = 50

    // Price analysis
    const marketPrice = listing.price * 1.1  // Mock: 10% higher
    const priceDiff = ((marketPrice - listing.price) / marketPrice) * 100

    if (priceDiff > 5) {
        factors.push({ label: 'ราคาเทียบตลาด', score: 15, positive: true })
        totalScore += 15
    } else if (priceDiff < -5) {
        factors.push({ label: 'ราคาสูงกว่าตลาด', score: -10, positive: false })
        totalScore -= 10
    } else {
        factors.push({ label: 'ราคาตลาด', score: 5, positive: true })
        totalScore += 5
    }

    // Battery health (for mobiles)
    if (templateData.battery_health) {
        const health = parseInt(templateData.battery_health) || 0
        if (health >= 90) {
            factors.push({ label: 'สุขภาพแบตเตอรี่', score: 15, positive: true })
            totalScore += 15
        } else if (health >= 80) {
            factors.push({ label: 'แบตเตอรี่ใช้ได้', score: 8, positive: true })
            totalScore += 8
        } else {
            factors.push({ label: 'แบตเตอรี่เสื่อม', score: -10, positive: false })
            totalScore -= 10
        }
    }

    // Screen condition
    if (templateData.screen_condition === 'like_new' || templateData.screen_condition === 'excellent') {
        factors.push({ label: 'สภาพหน้าจอ', score: 12, positive: true })
        totalScore += 12
    }

    // iCloud status
    if (templateData.icloud_status === 'logged_out') {
        factors.push({ label: 'สถานะ iCloud', score: 20, positive: true })
        totalScore += 20
    }

    // Accessories
    if (templateData.accessories?.includes('box') || templateData.included_items?.includes('box')) {
        factors.push({ label: 'อุปกรณ์ครบ', score: 10, positive: true })
        totalScore += 10
    }

    // Warranty
    if (!templateData.warranty || templateData.warranty === 'no_warranty') {
        factors.push({ label: 'ไม่มีประกัน', score: -5, positive: false })
        totalScore -= 5
    }

    // Seller trust
    factors.push({ label: 'ความน่าเชื่อถือ', score: 8, positive: true })
    totalScore += 8

    // Clamp score
    totalScore = Math.max(0, Math.min(100, totalScore))

    // Generate checklist based on category
    const checklist: string[] = []
    if (listing.category_type === 'mobile') {
        checklist.push('ขอดูหน้า Settings > General > About เพื่อเช็คข้อมูลเครื่อง')
        checklist.push('ขอทดสอบ Face ID / Touch ID')
        checklist.push('ขอดูสุขภาพแบตเตอรี่จริง')
        checklist.push('เช็ค iCloud ว่าออกแล้วหรือยัง')
        checklist.push('ขอใบเสร็จซื้อ (ถ้ามี)')
    } else if (listing.category_type === 'car') {
        checklist.push('ขอดูเล่มทะเบียน')
        checklist.push('เช็คประวัติอุบัติเหตุ')
        checklist.push('ทดสอบขับ')
        checklist.push('ตรวจสภาพช่วงล่าง')
    } else {
        checklist.push('ขอดูสินค้าจริงก่อนซื้อ')
        checklist.push('ถามประวัติการใช้งาน')
        checklist.push('เช็คสภาพให้ดี')
    }

    // Red flags
    const redFlags: string[] = []
    if (!templateData.icloud_status || templateData.icloud_status === 'logged_in') {
        redFlags.push('ยังไม่ได้ออก iCloud')
    }

    return {
        price_score: totalScore,
        market_price: Math.round(marketPrice),
        price_position: priceDiff > 5 ? 'below' : priceDiff < -5 ? 'above' : 'at',
        deal_score: totalScore,
        factors,
        buyer_checklist: checklist,
        red_flags: redFlags,
        summary: totalScore >= 70
            ? 'ราคานี้คุ้มค่า แนะนำให้นัดดูก่อนตัดสินใจ'
            : totalScore >= 50
                ? 'ราคาพอใช้ได้ ควรต่อรองเพิ่ม'
                : 'ควรพิจารณาให้ดี มีบางจุดที่ต้องระวัง',
        tips: [
            'แนะนำให้นัดดูสินค้าก่อนโอนเงิน',
            'ใช้ระบบ Escrow เพื่อความปลอดภัย',
            'ถ้าราคาถูกผิดปกติ ระวังการหลอกลวง'
        ]
    }
}

// ==========================================
// FETCH ALL DATA (UNIFIED)
// ==========================================

/**
 * Fetch all listing data in one go
 */
export async function fetchUnifiedListingData(listingId: string, sellerId: string): Promise<{
    seller: SellerData | null
    sellerOtherListings: ListingPreview[]
    similarListings: ListingPreview[]
}> {
    const [seller, sellerOtherListings, similarListings] = await Promise.all([
        getUnifiedSellerData(sellerId),
        getSellerOtherListings(sellerId, listingId, 8),
        // Note: categoryType would need to be passed in for real implementation
        Promise.resolve([])  // Placeholder
    ])

    return {
        seller,
        sellerOtherListings,
        similarListings
    }
}

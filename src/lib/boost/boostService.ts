/**
 * Boost Service
 * 
 * Core boost operations for JaiKod marketplace
 */

import {
    collection, doc, getDoc, setDoc, updateDoc,
    query, where, orderBy, limit, getDocs, Timestamp,
    runTransaction
} from 'firebase/firestore'
import { db } from '../firebase'
import {
    ListingBoost, BoostRequest, BoostResult, BoostCancelResult,
    BoostStats, BoostStatus, BoostPerformance
} from './types'
import { getPackageById, calculateBoostPrice } from './packages'
import {
    getAccount, hasEnoughStars, addStars, spendStars
} from '../jaistar/account'
import { createTransaction, completeTransaction } from '../jaistar/transactions'

const BOOSTS_COLLECTION = 'listing_boosts'

// ==========================================
// BOOST ID GENERATION
// ==========================================

function generateBoostId(): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 6)
    return `boost_${timestamp}_${random}`.toUpperCase()
}

// ==========================================
// BOOST CREATION
// ==========================================

/**
 * Create a new boost for a listing
 */
export async function createBoost(request: BoostRequest): Promise<BoostResult> {
    try {
        // Get package
        const pkg = getPackageById(request.package_id)
        if (!pkg) {
            return { success: false, error: { code: 'INVALID_PACKAGE', message: 'Invalid boost package' } }
        }

        // Check if package is available for seller type
        if (!pkg.available_for.includes(request.seller_type)) {
            return {
                success: false,
                error: { code: 'NOT_AVAILABLE', message: 'Package not available for your seller type' }
            }
        }

        // Calculate price with discount
        const pricing = calculateBoostPrice(request.package_id, request.seller_type)
        if (!pricing) {
            return { success: false, error: { code: 'PRICING_ERROR', message: 'Could not calculate price' } }
        }

        // Check balance
        const hasBalance = await hasEnoughStars(request.user_id, pricing.final)
        if (!hasBalance) {
            return {
                success: false,
                error: {
                    code: 'INSUFFICIENT_STARS',
                    message: `แต้มไม่พอ ต้องการ ${pricing.final} ⭐ JaiStar กรุณาเติมแต้มเพิ่ม`
                }
            }
        }

        // Check for existing active boost on same listing
        const existingBoost = await getActiveBoostForListing(request.listing_id)
        if (existingBoost) {
            return {
                success: false,
                error: { code: 'ALREADY_BOOSTED', message: 'This listing already has an active boost' }
            }
        }

        // Create payment transaction
        const transaction = await createTransaction(
            request.user_id,
            'boost_payment',
            pricing.final,
            {
                title: `Boost: ${pkg.name_th}`,
                title_en: `Boost: ${pkg.name}`,
                description: `${request.listing_id} - ${pkg.duration_hours}h - ส่วนลด ${pricing.discount} ⭐`,
                reference_type: 'boost',
                reference_id: request.listing_id
            }
        )

        // Complete payment
        const paymentResult = await completeTransaction(transaction.id)
        if (!paymentResult.success) {
            return {
                success: false,
                error: { code: 'PAYMENT_FAILED', message: paymentResult.error || 'Payment failed' }
            }
        }

        // Create boost record
        const boostId = generateBoostId()
        const now = new Date()
        const expiresAt = new Date(now.getTime() + pkg.duration_hours * 60 * 60 * 1000)

        const boost: ListingBoost = {
            id: boostId,
            listing_id: request.listing_id,
            product_id: request.product_id,
            seller_id: request.seller_id,
            seller_type: request.seller_type,
            package_id: request.package_id,
            package_type: pkg.type,
            package_name: pkg.name_th,
            status: 'active',
            started_at: now,
            expires_at: expiresAt,
            amount_paid: pricing.final,
            discount_applied: pricing.discount,
            transaction_id: transaction.id,
            stats: {
                views_before: 0,
                views_during: 0,
                unique_visitors_during: 0,
                inquiries_before: 0,
                inquiries_during: 0,
                saves_during: 0,
                shares_during: 0
            },
            created_at: now,
            updated_at: now
        }

        // Save to Firestore
        const boostRef = doc(db, BOOSTS_COLLECTION, boostId)
        await setDoc(boostRef, {
            ...boost,
            started_at: Timestamp.fromDate(now),
            expires_at: Timestamp.fromDate(expiresAt),
            created_at: Timestamp.fromDate(now),
            updated_at: Timestamp.fromDate(now)
        })

        // Get new balance
        const account = await getAccount(request.user_id)

        return {
            success: true,
            boost_id: boostId,
            transaction_id: transaction.id,
            amount_paid: pricing.final,
            discount_applied: pricing.discount,
            started_at: now,
            expires_at: expiresAt,
            new_balance: account?.balance
        }
    } catch (error) {
        console.error('Error creating boost:', error)
        return {
            success: false,
            error: {
                code: 'BOOST_ERROR',
                message: error instanceof Error ? error.message : 'Failed to create boost'
            }
        }
    }
}

// ==========================================
// BOOST QUERIES
// ==========================================

/**
 * Get boost by ID
 */
export async function getBoost(boostId: string): Promise<ListingBoost | null> {
    const boostDoc = await getDoc(doc(db, BOOSTS_COLLECTION, boostId))
    if (!boostDoc.exists()) return null

    const data = boostDoc.data()
    return {
        id: boostDoc.id,
        ...data,
        started_at: data.started_at?.toDate(),
        expires_at: data.expires_at?.toDate(),
        paused_at: data.paused_at?.toDate(),
        cancelled_at: data.cancelled_at?.toDate(),
        created_at: data.created_at?.toDate(),
        updated_at: data.updated_at?.toDate()
    } as ListingBoost
}

/**
 * Get active boost for a listing
 */
export async function getActiveBoostForListing(listingId: string): Promise<ListingBoost | null> {
    const q = query(
        collection(db, BOOSTS_COLLECTION),
        where('listing_id', '==', listingId),
        where('status', '==', 'active'),
        limit(1)
    )

    const snapshot = await getDocs(q)
    if (snapshot.empty) return null

    const doc = snapshot.docs[0]
    const data = doc.data()
    return {
        id: doc.id,
        ...data,
        started_at: data.started_at?.toDate(),
        expires_at: data.expires_at?.toDate(),
        created_at: data.created_at?.toDate(),
        updated_at: data.updated_at?.toDate()
    } as ListingBoost
}

/**
 * Get all boosts for a seller
 */
export async function getSellerBoosts(
    sellerId: string,
    options?: { status?: BoostStatus; limit?: number }
): Promise<ListingBoost[]> {
    let q = query(
        collection(db, BOOSTS_COLLECTION),
        where('seller_id', '==', sellerId),
        orderBy('created_at', 'desc')
    )

    if (options?.status) {
        q = query(q, where('status', '==', options.status))
    }

    if (options?.limit) {
        q = query(q, limit(options.limit))
    }

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
            id: doc.id,
            ...data,
            started_at: data.started_at?.toDate(),
            expires_at: data.expires_at?.toDate(),
            created_at: data.created_at?.toDate(),
            updated_at: data.updated_at?.toDate()
        } as ListingBoost
    })
}

/**
 * Get active boosts (for homepage/category display)
 */
export async function getActiveBoosts(options?: {
    homepage_only?: boolean
    category_id?: string
    limit?: number
}): Promise<ListingBoost[]> {
    let q = query(
        collection(db, BOOSTS_COLLECTION),
        where('status', '==', 'active'),
        orderBy('created_at', 'desc')
    )

    if (options?.limit) {
        q = query(q, limit(options.limit))
    }

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
            id: doc.id,
            ...data,
            started_at: data.started_at?.toDate(),
            expires_at: data.expires_at?.toDate(),
            created_at: data.created_at?.toDate(),
            updated_at: data.updated_at?.toDate()
        } as ListingBoost
    })
}

// ==========================================
// BOOST MANAGEMENT
// ==========================================

/**
 * Cancel a boost (with partial refund)
 */
export async function cancelBoost(
    boostId: string,
    userId: string
): Promise<BoostCancelResult> {
    try {
        const boost = await getBoost(boostId)
        if (!boost) {
            return { success: false, error: { code: 'NOT_FOUND', message: 'Boost not found' } }
        }

        if (boost.status !== 'active') {
            return { success: false, error: { code: 'INVALID_STATUS', message: 'Boost is not active' } }
        }

        // Calculate refund (pro-rated)
        const now = new Date()
        const startedAt = boost.started_at || now
        const expiresAt = boost.expires_at || now
        const totalDuration = expiresAt.getTime() - startedAt.getTime()
        const elapsed = now.getTime() - startedAt.getTime()
        const remaining = Math.max(0, totalDuration - elapsed)
        const refundPercent = remaining / totalDuration
        const refundAmount = Math.floor(boost.amount_paid * refundPercent * 0.8) // 80% of pro-rated

        // Process refund if any
        let refundTransactionId: string | undefined
        if (refundAmount > 0) {
            const refundTxn = await createTransaction(
                userId,
                'promotion_bonus',
                refundAmount,
                {
                    title: 'คืนแต้ม Boost (ยกเลิก)',
                    title_en: 'Boost Refund (Cancelled)',
                    reference_type: 'boost',
                    reference_id: boostId
                }
            )
            await completeTransaction(refundTxn.id)
            refundTransactionId = refundTxn.id
        }

        // Update boost status
        const boostRef = doc(db, BOOSTS_COLLECTION, boostId)
        await updateDoc(boostRef, {
            status: 'cancelled',
            cancelled_at: Timestamp.now(),
            updated_at: Timestamp.now()
        })

        return {
            success: true,
            refund_amount: refundAmount,
            transaction_id: refundTransactionId
        }
    } catch (error) {
        console.error('Error cancelling boost:', error)
        return {
            success: false,
            error: {
                code: 'CANCEL_ERROR',
                message: error instanceof Error ? error.message : 'Failed to cancel boost'
            }
        }
    }
}

/**
 * Pause a boost
 */
export async function pauseBoost(boostId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const boostRef = doc(db, BOOSTS_COLLECTION, boostId)
        await updateDoc(boostRef, {
            status: 'paused',
            paused_at: Timestamp.now(),
            updated_at: Timestamp.now()
        })
        return { success: true }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to pause' }
    }
}

/**
 * Resume a paused boost
 */
export async function resumeBoost(boostId: string): Promise<{ success: boolean; error?: string }> {
    try {
        const boost = await getBoost(boostId)
        if (!boost || boost.status !== 'paused') {
            return { success: false, error: 'Boost not found or not paused' }
        }

        // Extend expires_at by the paused duration
        const now = new Date()
        const pausedAt = boost.paused_at || now
        const pausedDuration = now.getTime() - pausedAt.getTime()
        const newExpiry = new Date((boost.expires_at?.getTime() || now.getTime()) + pausedDuration)

        const boostRef = doc(db, BOOSTS_COLLECTION, boostId)
        await updateDoc(boostRef, {
            status: 'active',
            paused_at: null,
            expires_at: Timestamp.fromDate(newExpiry),
            updated_at: Timestamp.now()
        })

        return { success: true }
    } catch (error) {
        return { success: false, error: error instanceof Error ? error.message : 'Failed to resume' }
    }
}

/**
 * Check and expire boosts (run by scheduled job)
 */
export async function expireBoosts(): Promise<number> {
    const now = Timestamp.now()

    const q = query(
        collection(db, BOOSTS_COLLECTION),
        where('status', '==', 'active'),
        where('expires_at', '<=', now)
    )

    const snapshot = await getDocs(q)
    let expiredCount = 0

    for (const docSnapshot of snapshot.docs) {
        try {
            await updateDoc(docSnapshot.ref, {
                status: 'expired',
                updated_at: Timestamp.now()
            })
            expiredCount++
        } catch (error) {
            console.error(`Error expiring boost ${docSnapshot.id}:`, error)
        }
    }

    return expiredCount
}

// ==========================================
// BOOST STATS
// ==========================================

/**
 * Update boost stats
 */
export async function updateBoostStats(
    boostId: string,
    stats: Partial<BoostStats>
): Promise<{ success: boolean }> {
    try {
        const boostRef = doc(db, BOOSTS_COLLECTION, boostId)
        const boostDoc = await getDoc(boostRef)

        if (!boostDoc.exists()) return { success: false }

        const currentStats = boostDoc.data().stats || {}

        await updateDoc(boostRef, {
            stats: { ...currentStats, ...stats },
            updated_at: Timestamp.now()
        })

        return { success: true }
    } catch (error) {
        console.error('Error updating boost stats:', error)
        return { success: false }
    }
}

/**
 * Record a view for boosted listing
 */
export async function recordBoostView(listingId: string): Promise<void> {
    const boost = await getActiveBoostForListing(listingId)
    if (!boost) return

    await updateBoostStats(boost.id, {
        views_during: (boost.stats.views_during || 0) + 1
    })
}

/**
 * Record an inquiry for boosted listing
 */
export async function recordBoostInquiry(listingId: string): Promise<void> {
    const boost = await getActiveBoostForListing(listingId)
    if (!boost) return

    await updateBoostStats(boost.id, {
        inquiries_during: (boost.stats.inquiries_during || 0) + 1
    })
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

/**
 * Check if listing is boosted
 */
export async function isListingBoosted(listingId: string): Promise<boolean> {
    const boost = await getActiveBoostForListing(listingId)
    return boost !== null
}

/**
 * Get boost badge info for display
 */
export async function getBoostBadgeInfo(listingId: string): Promise<{
    is_boosted: boolean
    badge_icon?: string
    badge_color?: string
    badge_text?: string
} | null> {
    const boost = await getActiveBoostForListing(listingId)
    if (!boost) return { is_boosted: false }

    const pkg = getPackageById(boost.package_id)
    if (!pkg) return { is_boosted: true }

    return {
        is_boosted: true,
        badge_icon: pkg.badge_icon,
        badge_color: pkg.badge_color,
        badge_text: pkg.type === 'urgent' ? 'ขายด่วน!' : undefined
    }
}

/**
 * Get remaining time for boost
 */
export function getBoostTimeRemaining(boost: ListingBoost): {
    hours: number
    minutes: number
    expired: boolean
    formatted: string
} {
    if (!boost.expires_at) return { hours: 0, minutes: 0, expired: true, formatted: 'หมดอายุ' }

    const now = new Date()
    const remaining = boost.expires_at.getTime() - now.getTime()

    if (remaining <= 0) return { hours: 0, minutes: 0, expired: true, formatted: 'หมดอายุ' }

    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))

    let formatted = ''
    if (hours >= 24) {
        const days = Math.floor(hours / 24)
        formatted = `${days} วัน`
    } else if (hours > 0) {
        formatted = `${hours} ชม. ${minutes} นาที`
    } else {
        formatted = `${minutes} นาที`
    }

    return { hours, minutes, expired: false, formatted }
}

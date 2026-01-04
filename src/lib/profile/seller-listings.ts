/**
 * Seller Listings Service
 * 
 * จัดการ Listings ของผู้ขาย พร้อม Auto-delete Logic
 */

import {
    collection, doc, getDocs, query, where, orderBy,
    limit, Timestamp, updateDoc, deleteDoc, writeBatch
} from 'firebase/firestore'
import { db } from '../firebase'
import {
    ListingStatus, SellerType,
    getAutoDeleteConfig, LISTING_STATUS_CONFIG
} from './types'

// ==========================================
// TYPES
// ==========================================

export interface ListingSummary {
    id: string
    slug: string
    title: string
    thumbnail_url: string
    price: number
    status: ListingStatus
    views: number
    favorites: number
    created_at: Date
    expires_at?: Date
    sold_at?: Date
    days_until_delete?: number
}

export interface ListingCounts {
    active: number
    pending: number
    expired: number
    sold: number
    closed: number
    rejected: number
    draft: number
    total: number
}

export interface SellerListingsResult {
    listings: ListingSummary[]
    counts: ListingCounts
    hasMore: boolean
}

// ==========================================
// GET SELLER LISTINGS
// ==========================================

export async function getSellerListings(
    sellerId: string,
    status?: ListingStatus,
    pageSize: number = 20
): Promise<SellerListingsResult> {
    let q = query(
        collection(db, 'listings'),
        where('seller_id', '==', sellerId),
        where('status', '!=', 'deleted'),
        orderBy('status'),
        orderBy('created_at', 'desc'),
        limit(pageSize + 1)
    )

    // If specific status requested
    if (status) {
        q = query(
            collection(db, 'listings'),
            where('seller_id', '==', sellerId),
            where('status', '==', status),
            orderBy('created_at', 'desc'),
            limit(pageSize + 1)
        )
    }

    const snapshot = await getDocs(q)
    const listings: ListingSummary[] = []

    snapshot.forEach(doc => {
        const data = doc.data()
        listings.push({
            id: doc.id,
            slug: data.slug,
            title: data.title,
            thumbnail_url: data.thumbnail_url,
            price: data.price,
            status: data.status,
            views: data.stats?.views || 0,
            favorites: data.stats?.favorites || 0,
            created_at: data.created_at?.toDate(),
            expires_at: data.expires_at?.toDate(),
            sold_at: data.sold_at?.toDate()
        })
    })

    const hasMore = listings.length > pageSize
    if (hasMore) listings.pop()

    // Get counts
    const counts = await getListingCounts(sellerId)

    return { listings, counts, hasMore }
}

// ==========================================
// GET LISTING COUNTS
// ==========================================

export async function getListingCounts(sellerId: string): Promise<ListingCounts> {
    const statuses: ListingStatus[] = ['active', 'pending', 'expired', 'sold', 'closed', 'rejected', 'draft']
    const counts: ListingCounts = {
        active: 0,
        pending: 0,
        expired: 0,
        sold: 0,
        closed: 0,
        rejected: 0,
        draft: 0,
        total: 0
    }

    // In production, use aggregation queries or cached counts
    for (const status of statuses) {
        const q = query(
            collection(db, 'listings'),
            where('seller_id', '==', sellerId),
            where('status', '==', status)
        )
        const snapshot = await getDocs(q)
        counts[status as keyof Omit<ListingCounts, 'total'>] = snapshot.size
        counts.total += snapshot.size
    }

    return counts
}

// ==========================================
// GET EXPIRING LISTINGS
// ==========================================

export async function getExpiringListings(
    sellerId: string,
    daysBeforeExpiry: number = 3
): Promise<ListingSummary[]> {
    const now = new Date()
    const warningDate = new Date(now.getTime() + daysBeforeExpiry * 24 * 60 * 60 * 1000)

    const q = query(
        collection(db, 'listings'),
        where('seller_id', '==', sellerId),
        where('status', '==', 'active'),
        where('expires_at', '<=', Timestamp.fromDate(warningDate)),
        orderBy('expires_at', 'asc')
    )

    const snapshot = await getDocs(q)
    return snapshot.docs.map(doc => {
        const data = doc.data()
        return {
            id: doc.id,
            slug: data.slug,
            title: data.title,
            thumbnail_url: data.thumbnail_url,
            price: data.price,
            status: data.status,
            views: data.stats?.views || 0,
            favorites: data.stats?.favorites || 0,
            created_at: data.created_at?.toDate(),
            expires_at: data.expires_at?.toDate()
        }
    })
}

// ==========================================
// GET LISTINGS PENDING DELETE
// ==========================================

export async function getListingsPendingDelete(
    sellerId: string,
    sellerType: SellerType
): Promise<ListingSummary[]> {
    const config = getAutoDeleteConfig(sellerType)
    const now = new Date()
    const results: ListingSummary[] = []

    // Expired listings approaching delete
    const expiredQ = query(
        collection(db, 'listings'),
        where('seller_id', '==', sellerId),
        where('status', '==', 'expired')
    )

    const expiredSnapshot = await getDocs(expiredQ)
    expiredSnapshot.forEach(doc => {
        const data = doc.data()
        const expiresAt = data.expires_at?.toDate()
        if (expiresAt) {
            const deleteDate = new Date(expiresAt.getTime() + config.expired_to_delete_days * 24 * 60 * 60 * 1000)
            const daysUntilDelete = Math.ceil((deleteDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))

            results.push({
                id: doc.id,
                slug: data.slug,
                title: data.title,
                thumbnail_url: data.thumbnail_url,
                price: data.price,
                status: 'expired',
                views: data.stats?.views || 0,
                favorites: data.stats?.favorites || 0,
                created_at: data.created_at?.toDate(),
                expires_at: expiresAt,
                days_until_delete: Math.max(0, daysUntilDelete)
            })
        }
    })

    // Closed listings approaching delete
    const closedQ = query(
        collection(db, 'listings'),
        where('seller_id', '==', sellerId),
        where('status', '==', 'closed')
    )

    const closedSnapshot = await getDocs(closedQ)
    closedSnapshot.forEach(doc => {
        const data = doc.data()
        const closedAt = data.closed_at?.toDate()
        if (closedAt) {
            const deleteDate = new Date(closedAt.getTime() + config.closed_to_delete_days * 24 * 60 * 60 * 1000)
            const daysUntilDelete = Math.ceil((deleteDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000))

            results.push({
                id: doc.id,
                slug: data.slug,
                title: data.title,
                thumbnail_url: data.thumbnail_url,
                price: data.price,
                status: 'closed',
                views: data.stats?.views || 0,
                favorites: data.stats?.favorites || 0,
                created_at: data.created_at?.toDate(),
                days_until_delete: Math.max(0, daysUntilDelete)
            })
        }
    })

    return results.sort((a, b) => (a.days_until_delete || 999) - (b.days_until_delete || 999))
}

// ==========================================
// LISTING STATUS ACTIONS
// ==========================================

export async function renewListing(listingId: string, days: number = 30): Promise<boolean> {
    try {
        const listingRef = doc(db, 'listings', listingId)
        const newExpiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000)

        await updateDoc(listingRef, {
            status: 'active',
            expires_at: Timestamp.fromDate(newExpiresAt),
            updated_at: Timestamp.now()
        })

        return true
    } catch (error) {
        console.error('Error renewing listing:', error)
        return false
    }
}

export async function closeListing(listingId: string): Promise<boolean> {
    try {
        const listingRef = doc(db, 'listings', listingId)

        await updateDoc(listingRef, {
            status: 'closed',
            closed_at: Timestamp.now(),
            updated_at: Timestamp.now()
        })

        return true
    } catch (error) {
        console.error('Error closing listing:', error)
        return false
    }
}

export async function reopenListing(listingId: string): Promise<boolean> {
    try {
        const listingRef = doc(db, 'listings', listingId)
        const newExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // Default 30 days

        await updateDoc(listingRef, {
            status: 'active',
            closed_at: null,
            expires_at: Timestamp.fromDate(newExpiresAt),
            updated_at: Timestamp.now()
        })

        return true
    } catch (error) {
        console.error('Error reopening listing:', error)
        return false
    }
}

export async function markAsSold(listingId: string): Promise<boolean> {
    try {
        const listingRef = doc(db, 'listings', listingId)

        await updateDoc(listingRef, {
            status: 'sold',
            sold_at: Timestamp.now(),
            updated_at: Timestamp.now()
        })

        return true
    } catch (error) {
        console.error('Error marking as sold:', error)
        return false
    }
}

export async function softDeleteListing(listingId: string): Promise<boolean> {
    try {
        if (!listingId || listingId.trim() === '') {
            throw new Error('ไม่พบ ID ของประกาศ')
        }

        const listingRef = doc(db, 'listings', listingId)

        await updateDoc(listingRef, {
            status: 'deleted',
            deleted_at: Timestamp.now(),
            updated_at: Timestamp.now()
        })

        console.log(`✅ ลบประกาศสำเร็จ: ${listingId}`)
        return true
    } catch (error: any) {
        console.error('❌ เกิดข้อผิดพลาดขณะลบประกาศ:', error)
        // Throw error เพื่อให้ UI จับได้
        throw new Error(error.message || 'ไม่สามารถลบประกาศได้ โปรดลองใหม่อีกครั้ง')
    }
}

// ==========================================
// BULK OPERATIONS
// ==========================================

export async function bulkRenewListings(
    listingIds: string[],
    days: number = 30
): Promise<{ success: number; failed: number }> {
    const batch = writeBatch(db)
    const newExpiresAt = Timestamp.fromDate(new Date(Date.now() + days * 24 * 60 * 60 * 1000))

    listingIds.forEach(id => {
        const ref = doc(db, 'listings', id)
        batch.update(ref, {
            status: 'active',
            expires_at: newExpiresAt,
            updated_at: Timestamp.now()
        })
    })

    try {
        await batch.commit()
        return { success: listingIds.length, failed: 0 }
    } catch (error) {
        console.error('Error bulk renewing:', error)
        return { success: 0, failed: listingIds.length }
    }
}

export async function bulkDeleteListings(
    listingIds: string[]
): Promise<{ success: number; failed: number }> {
    const batch = writeBatch(db)

    listingIds.forEach(id => {
        const ref = doc(db, 'listings', id)
        batch.update(ref, {
            status: 'deleted',
            deleted_at: Timestamp.now(),
            updated_at: Timestamp.now()
        })
    })

    try {
        await batch.commit()
        return { success: listingIds.length, failed: 0 }
    } catch (error) {
        console.error('Error bulk deleting:', error)
        return { success: 0, failed: listingIds.length }
    }
}

// ==========================================
// EXPORT
// ==========================================

export const SellerListingsService = {
    getListings: getSellerListings,
    getCounts: getListingCounts,
    getExpiring: getExpiringListings,
    getPendingDelete: getListingsPendingDelete,
    renew: renewListing,
    close: closeListing,
    reopen: reopenListing,
    markSold: markAsSold,
    delete: softDeleteListing,
    bulkRenew: bulkRenewListings,
    bulkDelete: bulkDeleteListings
}

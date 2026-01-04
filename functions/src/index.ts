/**
 * JaiKod Firebase Cloud Functions
 * 
 * Functions for real-time data sync and background processing
 * 
 * @version 1.0.0
 * @created 2025-12-30
 */

import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

// Initialize Firebase Admin
admin.initializeApp()

const db = admin.firestore()

// ==========================================
// CONSTANTS
// ==========================================

const USERS_COLLECTION = 'users'
const LISTINGS_COLLECTION = 'listings'

// ==========================================
// SELLER STATS UPDATE
// ==========================================

/**
 * Update seller stats when a listing is created
 */
export const onListingCreated = functions
    .region('asia-southeast1')
    .firestore
    .document('listings/{listingId}')
    .onCreate(async (snapshot, context) => {
        const listingData = snapshot.data()
        const sellerId = listingData.seller_id

        if (!sellerId) {
            console.log('No seller_id found in listing')
            return null
        }

        console.log(`📦 Listing created by seller: ${sellerId}`)

        try {
            await updateSellerStats(sellerId)
            console.log(`✅ Updated seller stats for: ${sellerId}`)
        } catch (error) {
            console.error(`❌ Error updating seller stats:`, error)
        }

        return null
    })

/**
 * Update seller stats when a listing is updated (e.g., status change)
 */
export const onListingUpdated = functions
    .region('asia-southeast1')
    .firestore
    .document('listings/{listingId}')
    .onUpdate(async (change, context) => {
        const beforeData = change.before.data()
        const afterData = change.after.data()
        const sellerId = afterData.seller_id

        if (!sellerId) return null

        // Only update stats if status changed
        if (beforeData.status !== afterData.status) {
            console.log(`📦 Listing status changed for seller: ${sellerId}`)
            console.log(`   ${beforeData.status} → ${afterData.status}`)

            try {
                await updateSellerStats(sellerId)
                console.log(`✅ Updated seller stats for: ${sellerId}`)
            } catch (error) {
                console.error(`❌ Error updating seller stats:`, error)
            }
        }

        return null
    })

/**
 * Update seller stats when a listing is deleted
 */
export const onListingDeleted = functions
    .region('asia-southeast1')
    .firestore
    .document('listings/{listingId}')
    .onDelete(async (snapshot, context) => {
        const listingData = snapshot.data()
        const sellerId = listingData.seller_id

        if (!sellerId) return null

        console.log(`📦 Listing deleted by seller: ${sellerId}`)

        try {
            await updateSellerStats(sellerId)
            console.log(`✅ Updated seller stats for: ${sellerId}`)
        } catch (error) {
            console.error(`❌ Error updating seller stats:`, error)
        }

        return null
    })

/**
 * Calculate and update seller statistics
 */
async function updateSellerStats(sellerId: string): Promise<void> {
    // Query all listings by this seller
    const listingsQuery = await db
        .collection(LISTINGS_COLLECTION)
        .where('seller_id', '==', sellerId)
        .get()

    // Count by status
    let totalListings = 0
    let activeListings = 0
    let soldListings = 0
    let pendingListings = 0

    listingsQuery.forEach(doc => {
        const data = doc.data()
        totalListings++

        switch (data.status) {
            case 'active':
                activeListings++
                break
            case 'sold':
                soldListings++
                break
            case 'pending':
                pendingListings++
                break
        }
    })

    // Update user document
    const userRef = db.collection(USERS_COLLECTION).doc(sellerId)
    await userRef.update({
        total_listings: totalListings,
        active_listings: activeListings,
        sold_listings: soldListings,
        pending_listings: pendingListings,
        successful_sales_count: soldListings,
        stats_updated_at: admin.firestore.FieldValue.serverTimestamp()
    })
}

// ==========================================
// SELLER INFO SYNC
// ==========================================

/**
 * Sync seller_info to all listings when user profile is updated
 */
export const onUserUpdated = functions
    .region('asia-southeast1')
    .firestore
    .document('users/{userId}')
    .onUpdate(async (change, context) => {
        const beforeData = change.before.data()
        const afterData = change.after.data()
        const userId = context.params.userId

        // Check if relevant fields changed
        const fieldsToWatch = ['shopName', 'displayName', 'photoURL', 'shopLogo', 'isVerified', 'trustScore']
        const hasRelevantChange = fieldsToWatch.some(field =>
            beforeData[field] !== afterData[field]
        )

        if (!hasRelevantChange) return null

        console.log(`👤 User profile updated: ${userId}`)
        console.log('   Changed fields:', fieldsToWatch.filter(f => beforeData[f] !== afterData[f]))

        try {
            // Find all listings by this seller
            const listingsQuery = await db
                .collection(LISTINGS_COLLECTION)
                .where('seller_id', '==', userId)
                .get()

            if (listingsQuery.empty) {
                console.log('   No listings to update')
                return null
            }

            // Prepare new seller_info
            const sellerInfo = {
                name: afterData.shopName || afterData.displayName || 'ผู้ขาย',
                avatar: afterData.shopLogo || afterData.photoURL,
                verified: afterData.isVerified || afterData.is_verified_seller || false,
                phone_verified: afterData.phoneVerified || false,
                trust_score: afterData.trustScore || 50
            }

            // Batch update all listings
            const batch = db.batch()
            let count = 0

            listingsQuery.forEach(doc => {
                batch.update(doc.ref, {
                    seller_info: sellerInfo,
                    updated_at: admin.firestore.FieldValue.serverTimestamp()
                })
                count++
            })

            await batch.commit()
            console.log(`✅ Updated seller_info in ${count} listings`)

        } catch (error) {
            console.error(`❌ Error syncing seller_info:`, error)
        }

        return null
    })

// ==========================================
// SCHEDULED JOBS
// ==========================================

/**
 * Daily stats refresh - runs at 2 AM (Asia/Bangkok)
 */
export const dailyStatsRefresh = functions
    .region('asia-southeast1')
    .pubsub
    .schedule('0 2 * * *')
    .timeZone('Asia/Bangkok')
    .onRun(async (context) => {
        console.log('🕐 Starting daily stats refresh...')

        try {
            // Get all users who are sellers
            const sellersQuery = await db
                .collection(USERS_COLLECTION)
                .where('hasStore', '==', true)
                .get()

            console.log(`Found ${sellersQuery.size} sellers to update`)

            let updated = 0
            let errors = 0

            for (const userDoc of sellersQuery.docs) {
                try {
                    await updateSellerStats(userDoc.id)
                    updated++
                } catch (error) {
                    console.error(`Error updating seller ${userDoc.id}:`, error)
                    errors++
                }
            }

            console.log(`✅ Daily refresh complete: ${updated} updated, ${errors} errors`)

        } catch (error) {
            console.error('❌ Daily stats refresh failed:', error)
        }

        return null
    })

/**
 * Expire old listings - runs daily at 3 AM
 */
export const expireOldListings = functions
    .region('asia-southeast1')
    .pubsub
    .schedule('0 3 * * *')
    .timeZone('Asia/Bangkok')
    .onRun(async (context) => {
        console.log('🕐 Starting listing expiration check...')

        try {
            const now = admin.firestore.Timestamp.now()

            // Find expired active listings
            const expiredQuery = await db
                .collection(LISTINGS_COLLECTION)
                .where('status', '==', 'active')
                .where('expires_at', '<', now)
                .get()

            if (expiredQuery.empty) {
                console.log('No expired listings found')
                return null
            }

            console.log(`Found ${expiredQuery.size} expired listings`)

            // Batch update to expired status
            const batch = db.batch()
            const sellersToUpdate = new Set<string>()

            expiredQuery.forEach(doc => {
                batch.update(doc.ref, {
                    status: 'expired',
                    expired_at: now
                })
                sellersToUpdate.add(doc.data().seller_id)
            })

            await batch.commit()
            console.log(`Marked ${expiredQuery.size} listings as expired`)

            // Update stats for affected sellers
            for (const sellerId of sellersToUpdate) {
                await updateSellerStats(sellerId)
            }

            console.log(`✅ Expiration check complete`)

        } catch (error) {
            console.error('❌ Listing expiration check failed:', error)
        }

        return null
    })

// ==========================================
// ID VERIFICATION NOTIFICATION
// ==========================================

/**
 * Notify user when ID verification is approved/rejected
 */
export const onIDVerificationUpdated = functions
    .region('asia-southeast1')
    .firestore
    .document('id_verification_requests/{requestId}')
    .onUpdate(async (change, context) => {
        const beforeData = change.before.data()
        const afterData = change.after.data()

        // Only process status changes
        if (beforeData.status === afterData.status) return null

        const userId = afterData.userId
        const newStatus = afterData.status

        console.log(`🔔 ID Verification status changed for user ${userId}: ${newStatus}`)

        // TODO: Send notification to user
        // This would integrate with FCM or email service

        if (newStatus === 'approved') {
            // Update user badges
            await db.collection(USERS_COLLECTION).doc(userId).update({
                badges: admin.firestore.FieldValue.arrayUnion('id_verified')
            })
            console.log(`Added id_verified badge to user ${userId}`)
        }

        return null
    })

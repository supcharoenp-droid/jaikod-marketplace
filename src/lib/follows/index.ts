/**
 * FOLLOWS SERVICE
 * 
 * ระบบติดตามผู้ขาย - บันทึกลง Firestore
 * 
 * @version 1.0.0
 */

import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore'
import { db } from '../firebase'

// ==========================================
// TYPES
// ==========================================

export interface Follow {
    id: string
    follower_id: string  // User who follows
    seller_id: string    // Seller being followed
    created_at: Date
}

export interface FollowStats {
    followers_count: number
    following_count: number
}

// ==========================================
// COLLECTION NAMES
// ==========================================

const FOLLOWS_COLLECTION = 'follows'
const USERS_COLLECTION = 'users'

// ==========================================
// FOLLOW OPERATIONS
// ==========================================

/**
 * Follow a seller
 */
export async function followSeller(
    followerId: string,
    sellerId: string
): Promise<boolean> {
    try {
        if (followerId === sellerId) {
            console.warn('Cannot follow yourself')
            return false
        }

        const followId = `${followerId}_${sellerId}`
        const followRef = doc(db, FOLLOWS_COLLECTION, followId)

        // Check if already following
        const existing = await getDoc(followRef)
        if (existing.exists()) {
            console.log('Already following this seller')
            return true
        }

        // Create follow record
        await setDoc(followRef, {
            follower_id: followerId,
            seller_id: sellerId,
            created_at: serverTimestamp()
        })

        // Update seller's followers count
        await updateFollowersCount(sellerId, 1)

        console.log(`✅ Now following seller: ${sellerId}`)
        return true
    } catch (error) {
        console.error('Error following seller:', error)
        return false
    }
}

/**
 * Unfollow a seller
 */
export async function unfollowSeller(
    followerId: string,
    sellerId: string
): Promise<boolean> {
    try {
        const followId = `${followerId}_${sellerId}`
        const followRef = doc(db, FOLLOWS_COLLECTION, followId)

        // Check if following
        const existing = await getDoc(followRef)
        if (!existing.exists()) {
            console.log('Not following this seller')
            return true
        }

        // Delete follow record
        await deleteDoc(followRef)

        // Update seller's followers count
        await updateFollowersCount(sellerId, -1)

        console.log(`✅ Unfollowed seller: ${sellerId}`)
        return true
    } catch (error) {
        console.error('Error unfollowing seller:', error)
        return false
    }
}

/**
 * Check if user is following a seller
 */
export async function isFollowing(
    followerId: string,
    sellerId: string
): Promise<boolean> {
    try {
        const followId = `${followerId}_${sellerId}`
        const followRef = doc(db, FOLLOWS_COLLECTION, followId)
        const docSnap = await getDoc(followRef)
        return docSnap.exists()
    } catch (error) {
        console.error('Error checking follow status:', error)
        return false
    }
}

/**
 * Toggle follow status
 */
export async function toggleFollow(
    followerId: string,
    sellerId: string
): Promise<{ isFollowing: boolean; success: boolean }> {
    const currentlyFollowing = await isFollowing(followerId, sellerId)

    if (currentlyFollowing) {
        const success = await unfollowSeller(followerId, sellerId)
        return { isFollowing: false, success }
    } else {
        const success = await followSeller(followerId, sellerId)
        return { isFollowing: true, success }
    }
}

/**
 * Get list of sellers a user is following
 */
export async function getFollowing(
    userId: string,
    limitCount: number = 50
): Promise<string[]> {
    try {
        const q = query(
            collection(db, FOLLOWS_COLLECTION),
            where('follower_id', '==', userId),
            orderBy('created_at', 'desc'),
            limit(limitCount)
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => doc.data().seller_id)
    } catch (error) {
        console.error('Error getting following list:', error)
        return []
    }
}

/**
 * Get list of followers for a seller
 */
export async function getFollowers(
    sellerId: string,
    limitCount: number = 50
): Promise<string[]> {
    try {
        const q = query(
            collection(db, FOLLOWS_COLLECTION),
            where('seller_id', '==', sellerId),
            orderBy('created_at', 'desc'),
            limit(limitCount)
        )
        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => doc.data().follower_id)
    } catch (error) {
        console.error('Error getting followers list:', error)
        return []
    }
}

/**
 * Get followers count for a seller
 */
export async function getFollowersCount(sellerId: string): Promise<number> {
    try {
        const q = query(
            collection(db, FOLLOWS_COLLECTION),
            where('seller_id', '==', sellerId)
        )
        const snapshot = await getDocs(q)
        return snapshot.size
    } catch (error) {
        console.error('Error getting followers count:', error)
        return 0
    }
}

// ==========================================
// HELPER: UPDATE FOLLOWERS COUNT
// ==========================================

async function updateFollowersCount(
    sellerId: string,
    delta: number
): Promise<void> {
    try {
        const userRef = doc(db, USERS_COLLECTION, sellerId)
        const userDoc = await getDoc(userRef)

        if (userDoc.exists()) {
            const currentCount = userDoc.data()?.followers_count || 0
            await setDoc(userRef, {
                followers_count: Math.max(0, currentCount + delta)
            }, { merge: true })
        }
    } catch (error) {
        console.error('Error updating followers count:', error)
    }
}

// ==========================================
// EXPORTS
// ==========================================

export default {
    followSeller,
    unfollowSeller,
    isFollowing,
    toggleFollow,
    getFollowing,
    getFollowers,
    getFollowersCount
}

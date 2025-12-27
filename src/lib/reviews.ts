/**
 * REVIEW SERVICE
 * 
 * Firebase service for managing product/seller reviews
 */

import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDoc,
    getDocs,
    query,
    where,
    orderBy,
    limit,
    serverTimestamp,
    Timestamp,
    increment
} from 'firebase/firestore'
import { db } from './firebase'

const REVIEWS_COLLECTION = 'reviews'

// ==========================================
// TYPES
// ==========================================

export interface ReviewRatings {
    overall: number           // 1-5
    product_quality?: number  // 1-5
    value_for_money?: number  // 1-5
    seller_service?: number   // 1-5
    shipping_speed?: number   // 1-5
    accuracy?: number         // 1-5
}

export interface ReviewMedia {
    type: 'image' | 'video'
    url: string
    thumbnail_url?: string
}

export interface SellerResponse {
    message: string
    responded_at: Date
}

export interface Review {
    id: string
    // References
    product_id?: string
    listing_id?: string
    seller_id: string
    reviewer_id: string
    order_id?: string

    // Reviewer info (denormalized for display)
    reviewer_name: string
    reviewer_avatar?: string

    // Ratings
    ratings: ReviewRatings

    // Content
    title?: string
    comment: string
    pros?: string[]
    cons?: string[]
    media: ReviewMedia[]

    // Engagement
    helpful_count: number
    helpful_by: string[]

    // Seller response
    seller_response?: SellerResponse

    // Status
    is_verified_purchase: boolean
    is_visible: boolean
    is_featured: boolean

    // Timestamps
    created_at: Date
    updated_at: Date
}

export interface CreateReviewData {
    product_id?: string
    listing_id?: string
    seller_id: string
    order_id?: string
    reviewer_id: string
    reviewer_name: string
    reviewer_avatar?: string
    ratings: ReviewRatings
    title?: string
    comment: string
    pros?: string[]
    cons?: string[]
    media?: ReviewMedia[]
    is_verified_purchase?: boolean
}

export interface ReviewStats {
    total_reviews: number
    average_rating: number
    rating_distribution: { [key: number]: number }  // { 1: 5, 2: 10, 3: 20, 4: 30, 5: 35 }
    recent_reviews: Review[]
}

// ==========================================
// CREATE REVIEW
// ==========================================

export async function createReview(data: CreateReviewData): Promise<string> {
    try {
        const reviewData = {
            ...data,
            media: data.media || [],
            helpful_count: 0,
            helpful_by: [],
            is_verified_purchase: data.is_verified_purchase || false,
            is_visible: true,
            is_featured: false,
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
        }

        const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), reviewData)

        // Update seller's review count and rating
        await updateSellerRatingStats(data.seller_id)

        return docRef.id
    } catch (error) {
        console.error('Error creating review:', error)
        throw error
    }
}

// ==========================================
// GET REVIEWS
// ==========================================

export async function getReviewsForSeller(
    sellerId: string,
    limitCount: number = 20
): Promise<Review[]> {
    try {
        const q = query(
            collection(db, REVIEWS_COLLECTION),
            where('seller_id', '==', sellerId),
            where('is_visible', '==', true),
            orderBy('created_at', 'desc'),
            limit(limitCount)
        )

        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: (doc.data().created_at as Timestamp)?.toDate() || new Date(),
            updated_at: (doc.data().updated_at as Timestamp)?.toDate() || new Date()
        })) as Review[]
    } catch (error) {
        console.error('Error getting seller reviews:', error)
        return []
    }
}

export async function getReviewsForProduct(
    productId: string,
    limitCount: number = 20
): Promise<Review[]> {
    try {
        const q = query(
            collection(db, REVIEWS_COLLECTION),
            where('product_id', '==', productId),
            where('is_visible', '==', true),
            orderBy('created_at', 'desc'),
            limit(limitCount)
        )

        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: (doc.data().created_at as Timestamp)?.toDate() || new Date(),
            updated_at: (doc.data().updated_at as Timestamp)?.toDate() || new Date()
        })) as Review[]
    } catch (error) {
        console.error('Error getting product reviews:', error)
        return []
    }
}

export async function getReviewsForListing(
    listingId: string,
    limitCount: number = 20
): Promise<Review[]> {
    try {
        const q = query(
            collection(db, REVIEWS_COLLECTION),
            where('listing_id', '==', listingId),
            where('is_visible', '==', true),
            orderBy('created_at', 'desc'),
            limit(limitCount)
        )

        const snapshot = await getDocs(q)
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            created_at: (doc.data().created_at as Timestamp)?.toDate() || new Date(),
            updated_at: (doc.data().updated_at as Timestamp)?.toDate() || new Date()
        })) as Review[]
    } catch (error) {
        console.error('Error getting listing reviews:', error)
        return []
    }
}

// ==========================================
// GET REVIEW STATS
// ==========================================

export async function getSellerReviewStats(sellerId: string): Promise<ReviewStats> {
    try {
        const reviews = await getReviewsForSeller(sellerId, 100)

        if (reviews.length === 0) {
            return {
                total_reviews: 0,
                average_rating: 0,
                rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
                recent_reviews: []
            }
        }

        // Calculate average
        const totalRating = reviews.reduce((sum, r) => sum + r.ratings.overall, 0)
        const averageRating = totalRating / reviews.length

        // Calculate distribution
        const distribution: { [key: number]: number } = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        reviews.forEach(r => {
            const rating = Math.round(r.ratings.overall)
            if (rating >= 1 && rating <= 5) {
                distribution[rating]++
            }
        })

        return {
            total_reviews: reviews.length,
            average_rating: Math.round(averageRating * 10) / 10,
            rating_distribution: distribution,
            recent_reviews: reviews.slice(0, 5)
        }
    } catch (error) {
        console.error('Error getting review stats:', error)
        return {
            total_reviews: 0,
            average_rating: 0,
            rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
            recent_reviews: []
        }
    }
}

// ==========================================
// UPDATE REVIEW
// ==========================================

export async function markReviewHelpful(
    reviewId: string,
    userId: string
): Promise<boolean> {
    try {
        const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId)
        const reviewDoc = await getDoc(reviewRef)

        if (!reviewDoc.exists()) return false

        const data = reviewDoc.data()
        const helpfulBy: string[] = data.helpful_by || []

        if (helpfulBy.includes(userId)) {
            // Remove vote
            await updateDoc(reviewRef, {
                helpful_count: increment(-1),
                helpful_by: helpfulBy.filter(id => id !== userId)
            })
            return false
        } else {
            // Add vote
            await updateDoc(reviewRef, {
                helpful_count: increment(1),
                helpful_by: [...helpfulBy, userId]
            })
            return true
        }
    } catch (error) {
        console.error('Error marking review helpful:', error)
        return false
    }
}

export async function addSellerResponse(
    reviewId: string,
    sellerId: string,
    message: string
): Promise<boolean> {
    try {
        const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId)
        const reviewDoc = await getDoc(reviewRef)

        if (!reviewDoc.exists()) return false

        const data = reviewDoc.data()
        if (data.seller_id !== sellerId) return false // Only seller can respond

        await updateDoc(reviewRef, {
            seller_response: {
                message,
                responded_at: serverTimestamp()
            },
            updated_at: serverTimestamp()
        })

        return true
    } catch (error) {
        console.error('Error adding seller response:', error)
        return false
    }
}

// ==========================================
// DELETE REVIEW
// ==========================================

export async function deleteReview(
    reviewId: string,
    userId: string
): Promise<boolean> {
    try {
        const reviewRef = doc(db, REVIEWS_COLLECTION, reviewId)
        const reviewDoc = await getDoc(reviewRef)

        if (!reviewDoc.exists()) return false

        const data = reviewDoc.data()
        if (data.reviewer_id !== userId) return false // Only reviewer can delete

        await deleteDoc(reviewRef)

        // Update seller's rating stats
        await updateSellerRatingStats(data.seller_id)

        return true
    } catch (error) {
        console.error('Error deleting review:', error)
        return false
    }
}

// ==========================================
// UPDATE SELLER STATS
// ==========================================

async function updateSellerRatingStats(sellerId: string): Promise<void> {
    try {
        const stats = await getSellerReviewStats(sellerId)

        // Update user document with review stats
        const userRef = doc(db, 'users', sellerId)
        await updateDoc(userRef, {
            rating: stats.average_rating,
            reviewCount: stats.total_reviews,
            ratingDistribution: stats.rating_distribution
        })
    } catch (error) {
        console.error('Error updating seller rating stats:', error)
    }
}

// ==========================================
// CHECK IF USER CAN REVIEW
// ==========================================

export async function canUserReviewSeller(
    reviewerId: string,
    sellerId: string
): Promise<{ canReview: boolean; reason?: string }> {
    try {
        // Check if already reviewed
        const q = query(
            collection(db, REVIEWS_COLLECTION),
            where('reviewer_id', '==', reviewerId),
            where('seller_id', '==', sellerId),
            limit(1)
        )
        const snapshot = await getDocs(q)

        if (!snapshot.empty) {
            return { canReview: false, reason: 'already_reviewed' }
        }

        // TODO: Check if has completed transaction with seller
        // For now, allow anyone to review

        return { canReview: true }
    } catch (error) {
        console.error('Error checking review eligibility:', error)
        return { canReview: false, reason: 'error' }
    }
}

/**
 * ============================================
 * Review Service
 * ============================================
 * 
 * Available in both modes:
 * - Classified Mode: Manual reviews (buyer can review seller profile)
 * - Marketplace Mode: Post-transaction reviews (automatic prompts)
 */

import { db } from '@/lib/firebase'
import { collection, doc, setDoc, getDoc, getDocs, query, where, orderBy, Timestamp, updateDoc, increment } from 'firebase/firestore'
import { FEATURE_FLAGS } from '@/config/platform'

// ============================================
// TYPES
// ============================================

export type ReviewType = 'seller' | 'buyer' | 'listing' | 'transaction'

export interface Review {
    id: string
    type: ReviewType

    // Who wrote the review
    reviewerId: string
    reviewerName: string
    reviewerAvatar?: string

    // Who/what is being reviewed
    targetId: string // sellerId, buyerId, listingId, or orderId
    targetType: 'user' | 'listing' | 'order'

    // Ratings (1-5 stars)
    overallRating: number
    ratings?: {
        communication?: number
        shipping?: number
        itemAsDescribed?: number
        value?: number
    }

    // Content
    comment: string
    images?: string[]

    // For transaction reviews
    orderId?: string

    // Status
    isVerified: boolean // ซื้อขายจริงหรือเปล่า
    isPublic: boolean

    // Timestamps
    createdAt: Date
    updatedAt: Date

    // Response from reviewed person
    response?: {
        content: string
        createdAt: Date
    }
}

export interface ReviewSummary {
    totalReviews: number
    averageRating: number
    ratingDistribution: {
        5: number
        4: number
        3: number
        2: number
        1: number
    }
    positivePercentage: number // % of 4-5 stars
}

// ============================================
// REVIEW SERVICE
// ============================================

class ReviewService {
    private collectionName = 'reviews'

    /**
     * Submit a review
     */
    async submitReview(
        type: ReviewType,
        reviewerId: string,
        reviewerName: string,
        targetId: string,
        targetType: 'user' | 'listing' | 'order',
        overallRating: number,
        comment: string,
        options?: {
            reviewerAvatar?: string
            ratings?: Review['ratings']
            images?: string[]
            orderId?: string
        }
    ): Promise<Review | null> {
        try {
            const reviewId = doc(collection(db, this.collectionName)).id

            // Check if transaction is verified (for marketplace mode)
            const isVerified = FEATURE_FLAGS.POST_TRANSACTION_REVIEW && options?.orderId
                ? await this.verifyTransaction(options.orderId, reviewerId)
                : false

            const review: Review = {
                id: reviewId,
                type,
                reviewerId,
                reviewerName,
                reviewerAvatar: options?.reviewerAvatar,
                targetId,
                targetType,
                overallRating: Math.min(5, Math.max(1, overallRating)),
                ratings: options?.ratings,
                comment,
                images: options?.images,
                orderId: options?.orderId,
                isVerified,
                isPublic: true,
                createdAt: new Date(),
                updatedAt: new Date()
            }

            await setDoc(doc(db, this.collectionName, reviewId), {
                ...review,
                createdAt: Timestamp.fromDate(review.createdAt),
                updatedAt: Timestamp.fromDate(review.updatedAt)
            })

            // Update target's rating stats
            await this.updateTargetRating(targetId, targetType, overallRating)

            console.log('⭐ Review submitted:', reviewId)
            return review
        } catch (error) {
            console.error('Error submitting review:', error)
            return null
        }
    }

    /**
     * Get reviews for a target (seller, listing, etc.)
     */
    async getReviews(targetId: string, limit: number = 10): Promise<Review[]> {
        try {
            const q = query(
                collection(db, this.collectionName),
                where('targetId', '==', targetId),
                where('isPublic', '==', true),
                orderBy('createdAt', 'desc')
            )

            const snapshot = await getDocs(q)
            return snapshot.docs.map(doc => this.parseReview(doc.data()))
        } catch (error) {
            console.error('Error getting reviews:', error)
            return []
        }
    }

    /**
     * Get review summary for a target
     */
    async getReviewSummary(targetId: string): Promise<ReviewSummary> {
        try {
            const reviews = await this.getReviews(targetId, 100)

            const ratingDist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            let totalRating = 0

            reviews.forEach(review => {
                const rating = Math.round(review.overallRating) as 1 | 2 | 3 | 4 | 5
                ratingDist[rating]++
                totalRating += review.overallRating
            })

            const total = reviews.length
            const positive = ratingDist[4] + ratingDist[5]

            return {
                totalReviews: total,
                averageRating: total > 0 ? Math.round((totalRating / total) * 10) / 10 : 0,
                ratingDistribution: ratingDist,
                positivePercentage: total > 0 ? Math.round((positive / total) * 100) : 0
            }
        } catch (error) {
            console.error('Error getting review summary:', error)
            return {
                totalReviews: 0,
                averageRating: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                positivePercentage: 0
            }
        }
    }

    /**
     * Respond to a review (seller/buyer response)
     */
    async respondToReview(reviewId: string, responderId: string, content: string): Promise<boolean> {
        try {
            const reviewRef = doc(db, this.collectionName, reviewId)
            const reviewSnap = await getDoc(reviewRef)

            if (!reviewSnap.exists()) return false

            const review = reviewSnap.data()

            // Only target can respond
            if (review.targetId !== responderId) return false

            await updateDoc(reviewRef, {
                response: {
                    content,
                    createdAt: Timestamp.now()
                },
                updatedAt: Timestamp.now()
            })

            return true
        } catch (error) {
            console.error('Error responding to review:', error)
            return false
        }
    }

    /**
     * Report a review (for moderation)
     */
    async reportReview(reviewId: string, reporterId: string, reason: string): Promise<boolean> {
        try {
            // TODO: Create report in moderation queue
            console.log('🚨 Review reported:', reviewId, reason)
            return true
        } catch (error) {
            console.error('Error reporting review:', error)
            return false
        }
    }

    /**
     * Check if user can review (has transacted with target)
     */
    async canReview(reviewerId: string, targetId: string): Promise<boolean> {
        // In Classified mode, anyone can review
        if (!FEATURE_FLAGS.POST_TRANSACTION_REVIEW) {
            return true
        }

        // In Marketplace mode, must have completed transaction
        // TODO: Check orders collection
        return true
    }

    /**
     * Verify transaction for verified badge
     */
    private async verifyTransaction(orderId: string, userId: string): Promise<boolean> {
        try {
            // TODO: Check if user was buyer or seller in this completed order
            return false
        } catch (error) {
            return false
        }
    }

    /**
     * Update target's rating statistics
     */
    private async updateTargetRating(targetId: string, targetType: 'user' | 'listing' | 'order', newRating: number): Promise<void> {
        try {
            if (targetType === 'user') {
                const userRef = doc(db, 'users', targetId)
                await updateDoc(userRef, {
                    'ratingCount': increment(1),
                    'totalRatingScore': increment(newRating),
                    'updatedAt': Timestamp.now()
                })
            } else if (targetType === 'listing') {
                const listingRef = doc(db, 'listings', targetId)
                await updateDoc(listingRef, {
                    'reviews_count': increment(1),
                    'updated_at': Timestamp.now()
                })
            }
        } catch (error) {
            console.error('Error updating target rating:', error)
        }
    }

    /**
     * Parse Firestore data to Review
     */
    private parseReview(data: any): Review {
        return {
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            response: data.response ? {
                ...data.response,
                createdAt: data.response.createdAt?.toDate() || new Date()
            } : undefined
        }
    }
}

// ============================================
// EXPORT SINGLETON
// ============================================

export const reviewService = new ReviewService()
export default reviewService

'use client'

/**
 * ============================================
 * Review List Section
 * ============================================
 * 
 * Complete review section with:
 * - Summary card
 * - Review list
 * - Write review button
 * - Filtering
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Star,
    Pencil,
    Filter,
    SortDesc,
    MessageSquareMore
} from 'lucide-react'
import { reviewService, Review, ReviewSummary } from '@/services/reviewService'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import ReviewCard from './ReviewCard'
import ReviewSummaryCard from './ReviewSummaryCard'
import ReviewFormModal from './ReviewFormModal'

// ============================================
// TYPES
// ============================================

interface ReviewListSectionProps {
    targetId: string
    targetType: 'user' | 'listing' | 'order'
    targetName?: string
    canReview?: boolean
}

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
    th: {
        reviews: 'รีวิว',
        writeReview: 'เขียนรีวิว',
        noReviews: 'ยังไม่มีรีวิว',
        noReviewsDesc: 'เป็นคนแรกที่รีวิว!',
        beFirstReview: 'เขียนรีวิวแรก',
        filterAll: 'ทั้งหมด',
        filterPositive: 'เชิงบวก',
        filterNegative: 'เชิงลบ',
        filterWithPhotos: 'มีรูป',
        sortNewest: 'ล่าสุด',
        sortHighest: 'คะแนนสูง',
        sortLowest: 'คะแนนต่ำ',
        loadMore: 'โหลดเพิ่ม',
    },
    en: {
        reviews: 'Reviews',
        writeReview: 'Write Review',
        noReviews: 'No reviews yet',
        noReviewsDesc: 'Be the first to review!',
        beFirstReview: 'Write First Review',
        filterAll: 'All',
        filterPositive: 'Positive',
        filterNegative: 'Negative',
        filterWithPhotos: 'With Photos',
        sortNewest: 'Newest',
        sortHighest: 'Highest',
        sortLowest: 'Lowest',
        loadMore: 'Load More',
    }
}

// ============================================
// COMPONENT
// ============================================

export default function ReviewListSection({
    targetId,
    targetType,
    targetName,
    canReview = true
}: ReviewListSectionProps) {
    const { user } = useAuth()
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th

    // State
    const [reviews, setReviews] = useState<Review[]>([])
    const [summary, setSummary] = useState<ReviewSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)

    // Filters
    const [filterRating, setFilterRating] = useState<number | null>(null)
    const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest')

    // Load reviews
    useEffect(() => {
        const loadReviews = async () => {
            setLoading(true)
            try {
                const [reviewsData, summaryData] = await Promise.all([
                    reviewService.getReviews(targetId),
                    reviewService.getReviewSummary(targetId)
                ])
                setReviews(reviewsData)
                setSummary(summaryData)
            } catch (error) {
                console.error('Error loading reviews:', error)
            } finally {
                setLoading(false)
            }
        }

        loadReviews()
    }, [targetId])

    // Filter and sort reviews
    const filteredReviews = reviews
        .filter(review => {
            if (filterRating === null) return true
            if (filterRating === 4) return review.overallRating >= 4 // Positive
            if (filterRating === 2) return review.overallRating <= 2 // Negative
            if (filterRating === -1) return review.images && review.images.length > 0 // With photos
            return true
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'highest':
                    return b.overallRating - a.overallRating
                case 'lowest':
                    return a.overallRating - b.overallRating
                default:
                    return b.createdAt.getTime() - a.createdAt.getTime()
            }
        })

    // Handle helpful
    const handleHelpful = (reviewId: string) => {
        // TODO: Implement helpful count
        console.log('Helpful:', reviewId)
    }

    // Handle report
    const handleReport = (reviewId: string) => {
        // TODO: Implement report modal
        console.log('Report:', reviewId)
    }

    // Handle success
    const handleReviewSuccess = async () => {
        // Reload reviews
        const [reviewsData, summaryData] = await Promise.all([
            reviewService.getReviews(targetId),
            reviewService.getReviewSummary(targetId)
        ])
        setReviews(reviewsData)
        setSummary(summaryData)
    }

    return (
        <section className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <MessageSquareMore className="w-6 h-6 text-purple-600" />
                    {t.reviews}
                    {summary && summary.totalReviews > 0 && (
                        <span className="text-gray-400 font-normal">
                            ({summary.totalReviews})
                        </span>
                    )}
                </h2>

                {canReview && user && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors"
                    >
                        <Pencil className="w-4 h-4" />
                        {t.writeReview}
                    </button>
                )}
            </div>

            {/* Summary Card */}
            {summary && summary.totalReviews > 0 && (
                <ReviewSummaryCard summary={summary} />
            )}

            {/* Filters */}
            {reviews.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {/* Rating Filters */}
                    <div className="flex items-center gap-1 mr-4">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <button
                            onClick={() => setFilterRating(null)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterRating === null
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {t.filterAll}
                        </button>
                        <button
                            onClick={() => setFilterRating(4)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterRating === 4
                                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {t.filterPositive}
                        </button>
                        <button
                            onClick={() => setFilterRating(2)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterRating === 2
                                    ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {t.filterNegative}
                        </button>
                        <button
                            onClick={() => setFilterRating(-1)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filterRating === -1
                                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {t.filterWithPhotos}
                        </button>
                    </div>

                    {/* Sort */}
                    <div className="flex items-center gap-1 ml-auto">
                        <SortDesc className="w-4 h-4 text-gray-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as any)}
                            className="px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-0 focus:ring-2 focus:ring-purple-500"
                        >
                            <option value="newest">{t.sortNewest}</option>
                            <option value="highest">{t.sortHighest}</option>
                            <option value="lowest">{t.sortLowest}</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 animate-pulse">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                                <div className="space-y-2">
                                    <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                                    <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                                <div className="w-3/4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filteredReviews.length === 0 ? (
                /* Empty State */
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl"
                >
                    <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Star className="w-8 h-8 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {t.noReviews}
                    </h3>
                    <p className="text-gray-500 mb-6">{t.noReviewsDesc}</p>

                    {canReview && user && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-colors"
                        >
                            <Pencil className="w-5 h-5" />
                            {t.beFirstReview}
                        </button>
                    )}
                </motion.div>
            ) : (
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredReviews.map((review, index) => (
                            <motion.div
                                key={review.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ delay: index * 0.05 }}
                            >
                                <ReviewCard
                                    review={review}
                                    onHelpful={handleHelpful}
                                    onReport={handleReport}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Review Form Modal */}
            <ReviewFormModal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                onSuccess={handleReviewSuccess}
                targetId={targetId}
                targetType={targetType}
                targetName={targetName}
            />
        </section>
    )
}

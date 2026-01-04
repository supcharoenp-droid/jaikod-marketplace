'use client'

/**
 * ============================================
 * Review Summary
 * ============================================
 * 
 * Shows overall review statistics
 * - Average rating
 * - Rating distribution
 * - Total reviews
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Star, TrendingUp } from 'lucide-react'
import { ReviewSummary } from '@/services/reviewService'
import StarRatingDisplay from './StarRatingDisplay'

// ============================================
// TYPES
// ============================================

interface ReviewSummaryCardProps {
    summary: ReviewSummary
    className?: string
}

// ============================================
// COMPONENT
// ============================================

export default function ReviewSummaryCard({
    summary,
    className = ''
}: ReviewSummaryCardProps) {
    const maxCount = Math.max(...Object.values(summary.ratingDistribution))

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-6 ${className}`}>
            <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                {/* Left: Overall Rating */}
                <div className="flex flex-col items-center text-center">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white">
                        {summary.averageRating.toFixed(1)}
                    </span>
                    <StarRatingDisplay
                        rating={summary.averageRating}
                        size="md"
                    />
                    <span className="text-sm text-gray-500 mt-2">
                        {summary.totalReviews.toLocaleString()} รีวิว
                    </span>

                    {/* Positive Percentage */}
                    {summary.totalReviews > 0 && (
                        <div className="flex items-center gap-1 mt-3 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                                {summary.positivePercentage}% พอใจ
                            </span>
                        </div>
                    )}
                </div>

                {/* Right: Distribution */}
                <div className="flex-1 space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = summary.ratingDistribution[rating as 1 | 2 | 3 | 4 | 5]
                        const percentage = summary.totalReviews > 0
                            ? (count / summary.totalReviews) * 100
                            : 0
                        const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0

                        return (
                            <div key={rating} className="flex items-center gap-3">
                                {/* Star Label */}
                                <div className="flex items-center gap-1 w-12">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        {rating}
                                    </span>
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                </div>

                                {/* Bar */}
                                <div className="flex-1 h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${barWidth}%` }}
                                        transition={{ duration: 0.5, delay: (5 - rating) * 0.1 }}
                                        className={`h-full rounded-full ${rating >= 4
                                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                                : rating === 3
                                                    ? 'bg-gradient-to-r from-amber-400 to-yellow-500'
                                                    : 'bg-gradient-to-r from-red-400 to-orange-500'
                                            }`}
                                    />
                                </div>

                                {/* Count */}
                                <div className="w-16 text-right">
                                    <span className="text-sm text-gray-500">
                                        {count.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-gray-400 ml-1">
                                        ({percentage.toFixed(0)}%)
                                    </span>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

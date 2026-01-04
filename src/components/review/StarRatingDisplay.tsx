'use client'

/**
 * ============================================
 * Star Rating Display
 * ============================================
 * 
 * Display-only star rating (not interactive)
 */

import React from 'react'
import { Star, StarHalf } from 'lucide-react'

interface StarRatingDisplayProps {
    rating: number
    maxRating?: number
    size?: 'xs' | 'sm' | 'md' | 'lg'
    showValue?: boolean
    showCount?: boolean
    count?: number
}

const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
}

const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
}

export default function StarRatingDisplay({
    rating,
    maxRating = 5,
    size = 'sm',
    showValue = false,
    showCount = false,
    count = 0
}: StarRatingDisplayProps) {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)

    return (
        <div className="flex items-center gap-1">
            <div className="flex">
                {/* Full Stars */}
                {Array.from({ length: fullStars }).map((_, i) => (
                    <Star
                        key={`full-${i}`}
                        className={`${sizeClasses[size]} text-amber-400 fill-amber-400`}
                    />
                ))}

                {/* Half Star */}
                {hasHalfStar && (
                    <div className="relative">
                        <Star className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600`} />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <Star className={`${sizeClasses[size]} text-amber-400 fill-amber-400`} />
                        </div>
                    </div>
                )}

                {/* Empty Stars */}
                {Array.from({ length: emptyStars }).map((_, i) => (
                    <Star
                        key={`empty-${i}`}
                        className={`${sizeClasses[size]} text-gray-300 dark:text-gray-600`}
                    />
                ))}
            </div>

            {/* Rating Value */}
            {showValue && (
                <span className={`${textSizes[size]} font-bold text-gray-900 dark:text-white ml-1`}>
                    {rating.toFixed(1)}
                </span>
            )}

            {/* Review Count */}
            {showCount && count > 0 && (
                <span className={`${textSizes[size]} text-gray-500 dark:text-gray-400`}>
                    ({count.toLocaleString()})
                </span>
            )}
        </div>
    )
}

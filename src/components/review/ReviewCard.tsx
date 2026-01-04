'use client'

/**
 * ============================================
 * Review Card
 * ============================================
 * 
 * Display a single review
 */

import React, { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    ThumbsUp,
    Flag,
    CheckCircle,
    MessageCircle,
    ChevronDown,
    ChevronUp,
    MoreHorizontal
} from 'lucide-react'
import { Review } from '@/services/reviewService'
import { useLanguage } from '@/contexts/LanguageContext'
import StarRatingDisplay from './StarRatingDisplay'

// ============================================
// TYPES
// ============================================

interface ReviewCardProps {
    review: Review
    showSellerResponse?: boolean
    onHelpful?: (reviewId: string) => void
    onReport?: (reviewId: string) => void
}

// ============================================
// HELPER
// ============================================

function formatDate(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'วันนี้'
    if (days === 1) return 'เมื่อวาน'
    if (days < 7) return `${days} วันที่แล้ว`
    if (days < 30) return `${Math.floor(days / 7)} สัปดาห์ที่แล้ว`
    if (days < 365) return `${Math.floor(days / 30)} เดือนที่แล้ว`
    return `${Math.floor(days / 365)} ปีที่แล้ว`
}

// ============================================
// COMPONENT
// ============================================

export default function ReviewCard({
    review,
    showSellerResponse = true,
    onHelpful,
    onReport
}: ReviewCardProps) {
    const { language } = useLanguage()
    const [expanded, setExpanded] = useState(false)
    const [showImages, setShowImages] = useState(false)

    const needsExpansion = review.comment.length > 300

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 space-y-3">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                        {review.reviewerAvatar ? (
                            <img
                                src={review.reviewerAvatar}
                                alt={review.reviewerName}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                                {review.reviewerName.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>

                    {/* Name & Date */}
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                                {review.reviewerName}
                            </span>
                            {review.isVerified && (
                                <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-xs font-medium rounded-full">
                                    <CheckCircle className="w-3 h-3" />
                                    ซื้อจริง
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-gray-500">
                            {formatDate(review.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Rating */}
                <StarRatingDisplay rating={review.overallRating} size="sm" />
            </div>

            {/* Detail Ratings (if available) */}
            {review.ratings && (
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                    {review.ratings.communication && (
                        <span>การสื่อสาร: {review.ratings.communication}/5</span>
                    )}
                    {review.ratings.shipping && (
                        <span>จัดส่ง: {review.ratings.shipping}/5</span>
                    )}
                    {review.ratings.itemAsDescribed && (
                        <span>ตรงปก: {review.ratings.itemAsDescribed}/5</span>
                    )}
                    {review.ratings.value && (
                        <span>คุ้มค่า: {review.ratings.value}/5</span>
                    )}
                </div>
            )}

            {/* Comment */}
            <p className={`text-gray-700 dark:text-gray-300 text-sm leading-relaxed ${!expanded && needsExpansion ? 'line-clamp-3' : ''}`}>
                {review.comment}
            </p>

            {needsExpansion && (
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="text-sm text-purple-600 hover:underline flex items-center gap-1"
                >
                    {expanded ? (
                        <>ย่อ <ChevronUp className="w-4 h-4" /></>
                    ) : (
                        <>อ่านเพิ่มเติม <ChevronDown className="w-4 h-4" /></>
                    )}
                </button>
            )}

            {/* Images */}
            {review.images && review.images.length > 0 && (
                <div>
                    {showImages ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-wrap gap-2"
                        >
                            {review.images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt=""
                                    className="w-20 h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                                />
                            ))}
                        </motion.div>
                    ) : (
                        <button
                            onClick={() => setShowImages(true)}
                            className="text-sm text-purple-600 hover:underline"
                        >
                            ดูรูปภาพ ({review.images.length})
                        </button>
                    )}
                </div>
            )}

            {/* Seller Response */}
            {showSellerResponse && review.response && (
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 ml-4 border-l-4 border-purple-500">
                    <div className="flex items-center gap-2 mb-2">
                        <MessageCircle className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            ผู้ขายตอบกลับ
                        </span>
                        <span className="text-xs text-gray-500">
                            {formatDate(review.response.createdAt)}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                        {review.response.content}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                <button
                    onClick={() => onHelpful?.(review.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-purple-600 transition-colors"
                >
                    <ThumbsUp className="w-4 h-4" />
                    <span>เป็นประโยชน์</span>
                </button>
                <button
                    onClick={() => onReport?.(review.id)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors"
                >
                    <Flag className="w-4 h-4" />
                    <span>รายงาน</span>
                </button>
            </div>
        </div>
    )
}

'use client'

/**
 * ============================================
 * Review Form Modal
 * ============================================
 * 
 * Beautiful modal for writing reviews
 * - Star rating
 * - Comment
 * - Image upload
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    Camera,
    Send,
    AlertCircle,
    Check,
    Loader2,
    ImagePlus,
    Trash2
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { reviewService, ReviewType } from '@/services/reviewService'
import StarRatingInput from './StarRatingInput'

// ============================================
// TYPES
// ============================================

interface ReviewFormModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
    targetId: string
    targetType: 'user' | 'listing' | 'order'
    targetName?: string
    orderId?: string
    reviewType?: ReviewType
}

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
    th: {
        title: 'เขียนรีวิว',
        ratingLabel: 'ให้คะแนน',
        ratingRequired: 'กรุณาให้คะแนน',
        commentLabel: 'แสดงความคิดเห็น',
        commentPlaceholder: 'เล่าประสบการณ์การซื้อขายของคุณ...',
        commentHint: 'รีวิวของคุณจะช่วยผู้ซื้อคนอื่นตัดสินใจ',
        addPhotos: 'เพิ่มรูปภาพ',
        photosHint: 'สูงสุด 5 รูป',
        submit: 'ส่งรีวิว',
        submitting: 'กำลังส่ง...',
        success: 'ส่งรีวิวสำเร็จ!',
        successDesc: 'ขอบคุณที่แบ่งปันความคิดเห็น',
        error: 'เกิดข้อผิดพลาด',
        close: 'ปิด',
        done: 'เสร็จสิ้น',
        minLength: 'กรุณาเขียนอย่างน้อย 10 ตัวอักษร',

        // Detail ratings
        communication: 'การสื่อสาร',
        shipping: 'ความเร็วจัดส่ง',
        itemAsDescribed: 'ตรงตามรายละเอียด',
        value: 'ความคุ้มค่า',
    },
    en: {
        title: 'Write a Review',
        ratingLabel: 'Rating',
        ratingRequired: 'Please rate',
        commentLabel: 'Your Review',
        commentPlaceholder: 'Share your experience...',
        commentHint: 'Your review helps other buyers decide',
        addPhotos: 'Add Photos',
        photosHint: 'Max 5 photos',
        submit: 'Submit Review',
        submitting: 'Submitting...',
        success: 'Review Submitted!',
        successDesc: 'Thank you for sharing your feedback',
        error: 'Error occurred',
        close: 'Close',
        done: 'Done',
        minLength: 'Please write at least 10 characters',

        communication: 'Communication',
        shipping: 'Shipping Speed',
        itemAsDescribed: 'As Described',
        value: 'Value for Money',
    }
}

// ============================================
// COMPONENT
// ============================================

export default function ReviewFormModal({
    isOpen,
    onClose,
    onSuccess,
    targetId,
    targetType,
    targetName,
    orderId,
    reviewType = 'seller'
}: ReviewFormModalProps) {
    const { user } = useAuth()
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th

    // Form state
    const [overallRating, setOverallRating] = useState(0)
    const [comment, setComment] = useState('')
    const [images, setImages] = useState<string[]>([])
    const [detailRatings, setDetailRatings] = useState({
        communication: 0,
        shipping: 0,
        itemAsDescribed: 0,
        value: 0
    })
    const [showDetails, setShowDetails] = useState(false)

    // UI state
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        Array.from(files).slice(0, 5 - images.length).forEach(file => {
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target?.result) {
                    setImages(prev => [...prev, e.target!.result as string])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    // Remove image
    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    // Submit review
    const handleSubmit = async () => {
        // Validation
        if (overallRating === 0) {
            setError(t.ratingRequired)
            return
        }

        if (comment.length > 0 && comment.length < 10) {
            setError(t.minLength)
            return
        }

        if (!user) {
            setError('กรุณาเข้าสู่ระบบก่อน')
            return
        }

        setLoading(true)
        setError('')

        try {
            const result = await reviewService.submitReview(
                reviewType,
                user.uid,
                user.displayName || 'ผู้ใช้',
                targetId,
                targetType,
                overallRating,
                comment,
                {
                    reviewerAvatar: user.photoURL || undefined,
                    ratings: showDetails ? detailRatings : undefined,
                    images: images.length > 0 ? images : undefined,
                    orderId
                }
            )

            if (result) {
                setSuccess(true)
                onSuccess?.()
            } else {
                setError(t.error)
            }
        } catch (err) {
            console.error('Error submitting review:', err)
            setError(t.error)
        } finally {
            setLoading(false)
        }
    }

    // Close and reset
    const handleClose = () => {
        setOverallRating(0)
        setComment('')
        setImages([])
        setDetailRatings({ communication: 0, shipping: 0, itemAsDescribed: 0, value: 0 })
        setShowDetails(false)
        setError('')
        setSuccess(false)
        onClose()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.95, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.95, opacity: 0 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
                            {targetName && (
                                <p className="text-sm text-gray-500">{targetName}</p>
                            )}
                        </div>
                        <button
                            onClick={handleClose}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {success ? (
                            /* Success State */
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center py-8"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', delay: 0.2 }}
                                    className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <Check className="w-10 h-10 text-green-600" />
                                </motion.div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {t.success}
                                </h3>
                                <p className="text-gray-500 mb-6">{t.successDesc}</p>
                                <button
                                    onClick={handleClose}
                                    className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors"
                                >
                                    {t.done}
                                </button>
                            </motion.div>
                        ) : (
                            /* Review Form */
                            <div className="space-y-6">
                                {/* Overall Rating */}
                                <div className="text-center">
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                        {t.ratingLabel}
                                    </label>
                                    <StarRatingInput
                                        value={overallRating}
                                        onChange={setOverallRating}
                                        size="lg"
                                    />
                                </div>

                                {/* Detail Ratings (Optional) */}
                                {overallRating > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => setShowDetails(!showDetails)}
                                            className="text-sm text-purple-600 hover:underline mb-3"
                                        >
                                            {showDetails ? 'ซ่อนรายละเอียด' : 'ให้คะแนนรายละเอียด (ไม่บังคับ)'}
                                        </button>

                                        {showDetails && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="space-y-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl"
                                            >
                                                {Object.entries(detailRatings).map(([key, value]) => (
                                                    <div key={key} className="flex items-center justify-between">
                                                        <span className="text-sm text-gray-600 dark:text-gray-300">
                                                            {t[key as keyof typeof t]}
                                                        </span>
                                                        <StarRatingInput
                                                            value={value}
                                                            onChange={(v) => setDetailRatings(prev => ({ ...prev, [key]: v }))}
                                                            size="sm"
                                                            showLabel={false}
                                                        />
                                                    </div>
                                                ))}
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Comment */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t.commentLabel}
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder={t.commentPlaceholder}
                                        rows={4}
                                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none resize-none"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">{t.commentHint}</p>
                                </div>

                                {/* Image Upload */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        {t.addPhotos} <span className="text-gray-400 font-normal">({t.photosHint})</span>
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                        {images.map((img, index) => (
                                            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden group">
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                                                >
                                                    <Trash2 className="w-5 h-5 text-white" />
                                                </button>
                                            </div>
                                        ))}

                                        {images.length < 5 && (
                                            <label className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors">
                                                <ImagePlus className="w-6 h-6 text-gray-400" />
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    multiple
                                                    onChange={handleImageUpload}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
                                        <AlertCircle className="w-4 h-4 shrink-0" />
                                        {error}
                                    </div>
                                )}

                                {/* Submit Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || overallRating === 0}
                                    className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            {t.submitting}
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            {t.submit}
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

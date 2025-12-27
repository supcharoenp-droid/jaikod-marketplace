'use client'

/**
 * REVIEW FORM COMPONENT
 * 
 * Form for creating and editing reviews with star rating, photos, and pros/cons
 */

import { useState, useCallback } from 'react'
import Image from 'next/image'
import { Star, Plus, X, Camera, Send, Loader2 } from 'lucide-react'
import { createReview, CreateReviewData } from '@/lib/reviews'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface ReviewFormProps {
    sellerId: string
    productId?: string
    listingId?: string
    orderId?: string
    onSuccess?: () => void
    onCancel?: () => void
}

export default function ReviewForm({
    sellerId,
    productId,
    listingId,
    orderId,
    onSuccess,
    onCancel
}: ReviewFormProps) {
    const { user } = useAuth()
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'

    // Form state
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [title, setTitle] = useState('')
    const [comment, setComment] = useState('')
    const [pros, setPros] = useState<string[]>([])
    const [cons, setCons] = useState<string[]>([])
    const [newPro, setNewPro] = useState('')
    const [newCon, setNewCon] = useState('')
    const [photos, setPhotos] = useState<string[]>([])
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    // Translations
    const t = {
        writeReview: lang === 'th' ? 'เขียนรีวิว' : 'Write a Review',
        overallRating: lang === 'th' ? 'คะแนนโดยรวม' : 'Overall Rating',
        title: lang === 'th' ? 'หัวข้อ (ไม่บังคับ)' : 'Title (optional)',
        comment: lang === 'th' ? 'รีวิวของคุณ' : 'Your Review',
        pros: lang === 'th' ? 'ข้อดี' : 'Pros',
        cons: lang === 'th' ? 'ข้อเสีย' : 'Cons',
        addPro: lang === 'th' ? 'เพิ่มข้อดี' : 'Add pro',
        addCon: lang === 'th' ? 'เพิ่มข้อเสีย' : 'Add con',
        addPhotos: lang === 'th' ? 'เพิ่มรูปภาพ' : 'Add Photos',
        submit: lang === 'th' ? 'ส่งรีวิว' : 'Submit Review',
        cancel: lang === 'th' ? 'ยกเลิก' : 'Cancel',
        ratingRequired: lang === 'th' ? 'กรุณาให้คะแนน' : 'Please rate',
        commentRequired: lang === 'th' ? 'กรุณาเขียนรีวิว' : 'Please write a review',
        loginRequired: lang === 'th' ? 'กรุณาเข้าสู่ระบบก่อน' : 'Please login first',
        success: lang === 'th' ? 'ส่งรีวิวสำเร็จ!' : 'Review submitted!',
        ratingLabels: {
            1: lang === 'th' ? 'แย่มาก' : 'Very Poor',
            2: lang === 'th' ? 'ไม่ดี' : 'Poor',
            3: lang === 'th' ? 'ปานกลาง' : 'Average',
            4: lang === 'th' ? 'ดี' : 'Good',
            5: lang === 'th' ? 'ดีมาก' : 'Excellent',
        }
    }

    // Handle star click
    const handleStarClick = (value: number) => {
        setRating(value)
        setError('')
    }

    // Add pro
    const addPro = useCallback(() => {
        if (newPro.trim() && pros.length < 5) {
            setPros([...pros, newPro.trim()])
            setNewPro('')
        }
    }, [newPro, pros])

    // Add con
    const addCon = useCallback(() => {
        if (newCon.trim() && cons.length < 5) {
            setCons([...cons, newCon.trim()])
            setNewCon('')
        }
    }, [newCon, cons])

    // Remove pro
    const removePro = (index: number) => {
        setPros(pros.filter((_, i) => i !== index))
    }

    // Remove con
    const removeCon = (index: number) => {
        setCons(cons.filter((_, i) => i !== index))
    }

    // Handle photo upload (mock)
    const handlePhotoUpload = () => {
        // In real app, this would open file picker and upload to storage
        const mockUrl = `/mock-review-photo-${Date.now()}.jpg`
        if (photos.length < 5) {
            setPhotos([...photos, mockUrl])
        }
    }

    // Remove photo
    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index))
    }

    // Submit review
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) {
            setError(t.loginRequired)
            return
        }

        if (rating === 0) {
            setError(t.ratingRequired)
            return
        }

        if (comment.trim().length < 10) {
            setError(t.commentRequired)
            return
        }

        setIsSubmitting(true)
        setError('')

        try {
            const reviewData: CreateReviewData = {
                seller_id: sellerId,
                product_id: productId,
                listing_id: listingId,
                order_id: orderId,
                reviewer_id: user.uid,
                reviewer_name: user.displayName || 'Anonymous',
                reviewer_avatar: user.photoURL || undefined,
                ratings: {
                    overall: rating
                },
                title: title.trim() || undefined,
                comment: comment.trim(),
                pros: pros.length > 0 ? pros : undefined,
                cons: cons.length > 0 ? cons : undefined,
                media: photos.map(url => ({ type: 'image', url })),
                is_verified_purchase: !!orderId
            }

            await createReview(reviewData)

            // Reset form
            setRating(0)
            setTitle('')
            setComment('')
            setPros([])
            setCons([])
            setPhotos([])

            onSuccess?.()
        } catch (err) {
            console.error('Error submitting review:', err)
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-lg font-bold text-white mb-4">{t.writeReview}</h3>

            {/* Rating Stars */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t.overallRating} <span className="text-red-400">*</span>
                </label>
                <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(value => (
                            <button
                                key={value}
                                type="button"
                                onMouseEnter={() => setHoverRating(value)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => handleStarClick(value)}
                                className="p-1 transition-transform hover:scale-110"
                            >
                                <Star
                                    className={`w-8 h-8 transition-colors ${value <= (hoverRating || rating)
                                            ? 'text-yellow-400 fill-yellow-400'
                                            : 'text-gray-600'
                                        }`}
                                />
                            </button>
                        ))}
                    </div>
                    {(hoverRating || rating) > 0 && (
                        <span className="text-sm text-gray-400 ml-2">
                            {t.ratingLabels[(hoverRating || rating) as keyof typeof t.ratingLabels]}
                        </span>
                    )}
                </div>
            </div>

            {/* Title */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t.title}
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={lang === 'th' ? 'สรุปสั้นๆ' : 'Brief summary'}
                    maxLength={100}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
            </div>

            {/* Comment */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t.comment} <span className="text-red-400">*</span>
                </label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={lang === 'th' ? 'เล่าประสบการณ์ของคุณ...' : 'Share your experience...'}
                    rows={4}
                    className="w-full px-4 py-2.5 bg-slate-700 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                />
            </div>

            {/* Pros */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t.pros}
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {pros.map((pro, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-sm"
                        >
                            + {pro}
                            <button
                                type="button"
                                onClick={() => removePro(i)}
                                className="ml-1 hover:text-red-400"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
                {pros.length < 5 && (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newPro}
                            onChange={(e) => setNewPro(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPro())}
                            placeholder={t.addPro}
                            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-emerald-500"
                        />
                        <button
                            type="button"
                            onClick={addPro}
                            className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Cons */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t.cons}
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                    {cons.map((con, i) => (
                        <span
                            key={i}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm"
                        >
                            - {con}
                            <button
                                type="button"
                                onClick={() => removeCon(i)}
                                className="ml-1 hover:text-white"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </span>
                    ))}
                </div>
                {cons.length < 5 && (
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newCon}
                            onChange={(e) => setNewCon(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCon())}
                            placeholder={t.addCon}
                            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-red-500"
                        />
                        <button
                            type="button"
                            onClick={addCon}
                            className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {/* Photos */}
            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">
                    {t.addPhotos}
                </label>
                <div className="flex flex-wrap gap-2">
                    {photos.map((photo, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-700">
                            <Image
                                src="/placeholder.svg"
                                alt={`Photo ${i + 1}`}
                                width={80}
                                height={80}
                                className="w-full h-full object-cover"
                            />
                            <button
                                type="button"
                                onClick={() => removePhoto(i)}
                                className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center"
                            >
                                <X className="w-3 h-3 text-white" />
                            </button>
                        </div>
                    ))}
                    {photos.length < 5 && (
                        <button
                            type="button"
                            onClick={handlePhotoUpload}
                            className="w-20 h-20 rounded-lg border-2 border-dashed border-slate-600 flex flex-col items-center justify-center text-gray-500 hover:text-gray-400 hover:border-slate-500"
                        >
                            <Camera className="w-6 h-6" />
                            <span className="text-xs mt-1">+{5 - photos.length}</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Error */}
            {error && (
                <p className="text-red-400 text-sm mb-4">{error}</p>
            )}

            {/* Actions */}
            <div className="flex gap-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-xl font-medium transition-colors"
                    >
                        {t.cancel}
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            {t.submit}
                        </>
                    )}
                </button>
            </div>
        </form>
    )
}

'use client'

/**
 * REVIEW CARD COMPONENT
 * 
 * Displays a single review with rating, comment, media, and actions
 */

import { useState } from 'react'
import Image from 'next/image'
import { Star, ThumbsUp, User, CheckCircle, Reply, MoreHorizontal } from 'lucide-react'
import { Review, markReviewHelpful } from '@/lib/reviews'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface ReviewCardProps {
    review: Review
    showProduct?: boolean
    onReply?: (reviewId: string) => void
}

export default function ReviewCard({ review, showProduct = false, onReply }: ReviewCardProps) {
    const { user } = useAuth()
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'

    const [isHelpful, setIsHelpful] = useState(user ? review.helpful_by.includes(user.uid) : false)
    const [helpfulCount, setHelpfulCount] = useState(review.helpful_count)
    const [showFullComment, setShowFullComment] = useState(false)

    // Translations
    const t = {
        helpful: lang === 'th' ? 'เป็นประโยชน์' : 'Helpful',
        verifiedPurchase: lang === 'th' ? 'ซื้อจริง' : 'Verified Purchase',
        sellerResponse: lang === 'th' ? 'ตอบกลับจากผู้ขาย' : 'Seller Response',
        showMore: lang === 'th' ? 'อ่านเพิ่มเติม' : 'Show more',
        showLess: lang === 'th' ? 'แสดงน้อยลง' : 'Show less',
        pros: lang === 'th' ? 'ข้อดี' : 'Pros',
        cons: lang === 'th' ? 'ข้อเสีย' : 'Cons',
    }

    // Format date
    const formatDate = (date: Date) => {
        const months_th = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
        const months_en = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const d = new Date(date)
        const day = d.getDate()
        const month = lang === 'th' ? months_th[d.getMonth()] : months_en[d.getMonth()]
        const year = lang === 'th' ? d.getFullYear() + 543 : d.getFullYear()
        return `${day} ${month} ${year}`
    }

    // Handle helpful click
    const handleHelpful = async () => {
        if (!user) {
            alert(lang === 'th' ? 'กรุณาเข้าสู่ระบบก่อน' : 'Please login first')
            return
        }

        const result = await markReviewHelpful(review.id, user.uid)
        setIsHelpful(result)
        setHelpfulCount(prev => result ? prev + 1 : prev - 1)
    }

    // Check if comment is long
    const isLongComment = review.comment.length > 200

    return (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center">
                        {review.reviewer_avatar ? (
                            <Image
                                src={review.reviewer_avatar}
                                alt={review.reviewer_name}
                                width={40}
                                height={40}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <User className="w-5 h-5 text-gray-500" />
                        )}
                    </div>

                    {/* Name & Date */}
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-white">{review.reviewer_name}</span>
                            {review.is_verified_purchase && (
                                <span className="flex items-center gap-1 text-xs text-emerald-400">
                                    <CheckCircle className="w-3 h-3" />
                                    {t.verifiedPurchase}
                                </span>
                            )}
                        </div>
                        <span className="text-xs text-gray-500">{formatDate(review.created_at)}</span>
                    </div>
                </div>

                {/* More options */}
                <button className="p-1 text-gray-500 hover:text-gray-300 rounded">
                    <MoreHorizontal className="w-4 h-4" />
                </button>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-2 mb-3">
                <div className="flex">
                    {[1, 2, 3, 4, 5].map(i => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i <= review.ratings.overall
                                    ? 'text-yellow-400 fill-yellow-400'
                                    : 'text-gray-600'
                                }`}
                        />
                    ))}
                </div>
                {review.title && (
                    <span className="font-medium text-white">{review.title}</span>
                )}
            </div>

            {/* Comment */}
            <p className={`text-gray-300 text-sm mb-3 ${!showFullComment && isLongComment ? 'line-clamp-3' : ''
                }`}>
                {review.comment}
            </p>

            {isLongComment && (
                <button
                    onClick={() => setShowFullComment(!showFullComment)}
                    className="text-sm text-purple-400 hover:text-purple-300 mb-3"
                >
                    {showFullComment ? t.showLess : t.showMore}
                </button>
            )}

            {/* Pros/Cons */}
            {(review.pros?.length || review.cons?.length) && (
                <div className="grid grid-cols-2 gap-3 mb-3">
                    {review.pros && review.pros.length > 0 && (
                        <div>
                            <p className="text-xs text-emerald-400 font-medium mb-1">{t.pros}</p>
                            <ul className="text-xs text-gray-400 space-y-0.5">
                                {review.pros.map((pro, i) => (
                                    <li key={i} className="flex items-center gap-1">
                                        <span className="text-emerald-400">+</span> {pro}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {review.cons && review.cons.length > 0 && (
                        <div>
                            <p className="text-xs text-red-400 font-medium mb-1">{t.cons}</p>
                            <ul className="text-xs text-gray-400 space-y-0.5">
                                {review.cons.map((con, i) => (
                                    <li key={i} className="flex items-center gap-1">
                                        <span className="text-red-400">-</span> {con}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Media */}
            {review.media && review.media.length > 0 && (
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                    {review.media.map((media, i) => (
                        <div
                            key={i}
                            className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-slate-700"
                        >
                            {media.type === 'image' ? (
                                <Image
                                    src={media.url}
                                    alt={`Review image ${i + 1}`}
                                    width={80}
                                    height={80}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <video
                                    src={media.url}
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Seller Response */}
            {review.seller_response && (
                <div className="bg-slate-700/50 rounded-lg p-3 mb-3 border-l-2 border-purple-500">
                    <p className="text-xs text-purple-400 font-medium mb-1">{t.sellerResponse}</p>
                    <p className="text-sm text-gray-300">{review.seller_response.message}</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-4 pt-2 border-t border-slate-700/50">
                <button
                    onClick={handleHelpful}
                    className={`flex items-center gap-1.5 text-sm ${isHelpful
                            ? 'text-purple-400'
                            : 'text-gray-500 hover:text-gray-300'
                        }`}
                >
                    <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-current' : ''}`} />
                    {t.helpful} ({helpfulCount})
                </button>

                {onReply && (
                    <button
                        onClick={() => onReply(review.id)}
                        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300"
                    >
                        <Reply className="w-4 h-4" />
                        Reply
                    </button>
                )}
            </div>
        </div>
    )
}

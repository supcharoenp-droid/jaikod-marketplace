/**
 * Post Transaction Review Modal - Phase 3
 * Allow buyer to rate and review the transaction
 */

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Star, X, Camera, ThumbsUp, ThumbsDown,
    Package, Truck, MessageCircle, Shield, CheckCircle
} from 'lucide-react';
import Image from 'next/image';

interface PostTransactionReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    orderId: string;
    sellerId: string;
    sellerName: string;
    sellerPhoto?: string;
    productTitle: string;
    productImage?: string;
    onSubmit: (review: ReviewData) => void;
}

interface ReviewData {
    rating: number;
    comment: string;
    photos: string[];
    aspects: {
        productQuality: 'positive' | 'negative' | null;
        delivery: 'positive' | 'negative' | null;
        communication: 'positive' | 'negative' | null;
        asDescribed: 'positive' | 'negative' | null;
    };
    isAnonymous: boolean;
}

export default function PostTransactionReviewModal({
    isOpen,
    onClose,
    orderId,
    sellerId,
    sellerName,
    sellerPhoto,
    productTitle,
    productImage,
    onSubmit
}: PostTransactionReviewModalProps) {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState('');
    const [photos, setPhotos] = useState<string[]>([]);
    const [aspects, setAspects] = useState<ReviewData['aspects']>({
        productQuality: null,
        delivery: null,
        communication: null,
        asDescribed: null
    });
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ratingLabels = ['', 'แย่มาก', 'ไม่พอใจ', 'พอใช้', 'ดี', 'ยอดเยี่ยม'];

    const aspectLabels = {
        productQuality: { label: 'คุณภาพสินค้า', icon: Package },
        delivery: { label: 'การจัดส่ง', icon: Truck },
        communication: { label: 'การสื่อสาร', icon: MessageCircle },
        asDescribed: { label: 'ตรงตามรายละเอียด', icon: Shield }
    };

    const handleSubmit = async () => {
        if (rating === 0) return;

        setIsSubmitting(true);
        try {
            await onSubmit({
                rating,
                comment,
                photos,
                aspects,
                isAnonymous
            });
            onClose();
        } catch (error) {
            console.error('Error submitting review:', error);
        }
        setIsSubmitting(false);
    };

    const handleAspectToggle = (aspect: keyof typeof aspects, value: 'positive' | 'negative') => {
        setAspects(prev => ({
            ...prev,
            [aspect]: prev[aspect] === value ? null : value
        }));
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg max-h-[90vh] overflow-hidden shadow-2xl"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-4">
                        {sellerPhoto ? (
                            <Image
                                src={sellerPhoto}
                                alt={sellerName}
                                width={56}
                                height={56}
                                className="rounded-full border-2 border-white"
                            />
                        ) : (
                            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                                {sellerName[0]}
                            </div>
                        )}
                        <div>
                            <h3 className="font-bold text-lg">ให้คะแนน {sellerName}</h3>
                            <p className="text-sm text-white/80 line-clamp-1">{productTitle}</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
                    {/* Star Rating */}
                    <div className="text-center mb-6">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            คุณพอใจกับการซื้อขายครั้งนี้แค่ไหน?
                        </p>
                        <div className="flex justify-center gap-2 mb-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    onMouseEnter={() => setHoverRating(star)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(star)}
                                    className="p-1 transition-transform hover:scale-110"
                                >
                                    <Star
                                        className={`w-10 h-10 ${star <= (hoverRating || rating)
                                                ? 'text-amber-400 fill-current'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                        {(hoverRating || rating) > 0 && (
                            <motion.p
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-amber-600 font-bold"
                            >
                                {ratingLabels[hoverRating || rating]}
                            </motion.p>
                        )}
                    </div>

                    {/* Aspect Ratings */}
                    {rating > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6"
                        >
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                ให้คะแนนในแต่ละด้าน (ไม่บังคับ)
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                                {(Object.entries(aspectLabels) as [keyof typeof aspects, { label: string; icon: any }][]).map(
                                    ([key, { label, icon: Icon }]) => (
                                        <div key={key} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Icon className="w-4 h-4 text-gray-500" />
                                                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                                                    {label}
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAspectToggle(key, 'positive')}
                                                    className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${aspects[key] === 'positive'
                                                            ? 'bg-green-500 text-white'
                                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                >
                                                    <ThumbsUp className="w-3.5 h-3.5" />
                                                </button>
                                                <button
                                                    onClick={() => handleAspectToggle(key, 'negative')}
                                                    className={`flex-1 py-1.5 rounded-lg transition-all flex items-center justify-center gap-1 ${aspects[key] === 'negative'
                                                            ? 'bg-red-500 text-white'
                                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                        }`}
                                                >
                                                    <ThumbsDown className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Comment */}
                    {rating > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mb-6"
                        >
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                เขียนรีวิว (ไม่บังคับ)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="บอกเล่าประสบการณ์ของคุณ..."
                                className="w-full h-24 px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-gray-900 dark:text-white"
                                maxLength={500}
                            />
                            <div className="flex justify-between mt-1">
                                <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600">
                                    <Camera className="w-4 h-4" />
                                    เพิ่มรูปภาพ
                                </button>
                                <span className="text-xs text-gray-400">
                                    {comment.length}/500
                                </span>
                            </div>
                        </motion.div>
                    )}

                    {/* Anonymous Option */}
                    {rating > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mb-6"
                        >
                            <label className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isAnonymous}
                                    onChange={(e) => setIsAnonymous(e.target.checked)}
                                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                                />
                                <div>
                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        รีวิวแบบไม่ระบุตัวตน
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        ชื่อของคุณจะไม่แสดงในรีวิว
                                    </p>
                                </div>
                            </label>
                        </motion.div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            ข้าม
                        </button>
                        <button
                            onClick={handleSubmit}
                            disabled={rating === 0 || isSubmitting}
                            className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    กำลังส่ง...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-5 h-5" />
                                    ส่งรีวิว
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

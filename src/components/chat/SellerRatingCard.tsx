/**
 * Seller Rating Card - V2 Feature
 * Shows seller's rating and trust score in chat
 */

'use client';

import { Star, Shield, Clock, TrendingUp, Award, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface SellerRatingCardProps {
    sellerId: string;
    sellerName: string;
    rating?: number; // 0-5 stars
    totalReviews?: number;
    responseRate?: number; // 0-100 percentage
    responseTime?: string; // e.g., "< 1 hour"
    successfulSales?: number;
    memberSince?: Date;
    isVerified?: boolean;
    trustScore?: number; // 0-100
    badges?: string[];
    compact?: boolean;
}

export default function SellerRatingCard({
    sellerId,
    sellerName,
    rating = 0,
    totalReviews = 0,
    responseRate = 0,
    responseTime = '-',
    successfulSales = 0,
    memberSince,
    isVerified = false,
    trustScore = 50,
    badges = [],
    compact = false
}: SellerRatingCardProps) {

    const getRatingColor = (r: number) => {
        if (r >= 4.5) return 'text-green-500';
        if (r >= 4) return 'text-blue-500';
        if (r >= 3) return 'text-amber-500';
        return 'text-red-500';
    };

    const getTrustGrade = (score: number) => {
        if (score >= 90) return { grade: 'S', color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' };
        if (score >= 80) return { grade: 'A', color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/30' };
        if (score >= 60) return { grade: 'B', color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' };
        if (score >= 40) return { grade: 'C', color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' };
        return { grade: 'F', color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' };
    };

    const formatMemberSince = (date?: Date) => {
        if (!date) return '-';
        const now = new Date();
        const diffYears = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 365));
        const diffMonths = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30));

        if (diffYears >= 1) return `${diffYears} ปี`;
        if (diffMonths >= 1) return `${diffMonths} เดือน`;
        return 'สมาชิกใหม่';
    };

    const trustGrade = getTrustGrade(trustScore);

    // Compact version for sidebar
    if (compact) {
        return (
            <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${trustGrade.bg}`}>
                    <span className={`text-lg font-black ${trustGrade.color}`}>{trustGrade.grade}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-900 dark:text-white truncate">{sellerName}</span>
                        {isVerified && <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="flex items-center gap-0.5">
                            <Star className={`w-3 h-3 ${getRatingColor(rating)} fill-current`} />
                            {rating.toFixed(1)}
                        </span>
                        <span>•</span>
                        <span>{successfulSales} ขาย</span>
                    </div>
                </div>
            </div>
        );
    }

    // Full version
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4 shadow-sm"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${trustGrade.bg}`}>
                        <span className={`text-xl font-black ${trustGrade.color}`}>{trustGrade.grade}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="font-bold text-gray-900 dark:text-white">{sellerName}</span>
                            {isVerified && (
                                <div className="flex items-center gap-0.5 text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded-full font-bold">
                                    <CheckCircle className="w-3 h-3" />
                                    ยืนยันตัวตน
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`}
                                />
                            ))}
                            <span className="text-sm text-gray-500 ml-1">
                                ({totalReviews} รีวิว)
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-lg font-black text-gray-900 dark:text-white">{successfulSales}</span>
                    </div>
                    <span className="text-xs text-gray-500">ขายสำเร็จ</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-lg font-black text-gray-900 dark:text-white">{responseTime}</span>
                    </div>
                    <span className="text-xs text-gray-500">ตอบกลับ</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Shield className="w-4 h-4 text-purple-500" />
                        <span className="text-lg font-black text-gray-900 dark:text-white">{responseRate}%</span>
                    </div>
                    <span className="text-xs text-gray-500">อัตราตอบกลับ</span>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
                    <div className="flex items-center justify-center gap-1 mb-1">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span className="text-lg font-black text-gray-900 dark:text-white">{formatMemberSince(memberSince)}</span>
                    </div>
                    <span className="text-xs text-gray-500">สมาชิก</span>
                </div>
            </div>

            {/* Badges */}
            {badges.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {badges.map((badge, i) => (
                        <span
                            key={i}
                            className="text-[10px] font-bold bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full"
                        >
                            {badge}
                        </span>
                    ))}
                </div>
            )}

            {/* Trust Score Progress */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">Trust Score</span>
                    <span className={`text-xs font-bold ${trustGrade.color}`}>{trustScore}/100</span>
                </div>
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${trustScore}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${trustScore >= 80 ? 'bg-gradient-to-r from-green-400 to-emerald-500' :
                                trustScore >= 60 ? 'bg-gradient-to-r from-blue-400 to-cyan-500' :
                                    trustScore >= 40 ? 'bg-gradient-to-r from-amber-400 to-orange-500' :
                                        'bg-gradient-to-r from-red-400 to-pink-500'
                            }`}
                    />
                </div>
            </div>
        </motion.div>
    );
}

'use client'

/**
 * Listing Completion Indicator
 * Shows real-time completion score and readiness status
 */

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, AlertCircle, TrendingUp, Sparkles } from 'lucide-react'
import { getCompletionMessage } from '@/services/intelligentListingAssistant'

interface ListingCompletionIndicatorProps {
    score: number
    listingReady: boolean
    language: 'th' | 'en'
}

export default function ListingCompletionIndicator({
    score,
    listingReady,
    language
}: ListingCompletionIndicatorProps) {
    const content = {
        th: {
            completionScore: 'ความสมบูรณ์ของลิสต์',
            readyToPost: 'พร้อมโพสต์!',
            almostThere: 'เกือบเสร็จแล้ว',
            keepGoing: 'กำลังทำอยู่'
        },
        en: {
            completionScore: 'Listing Completion',
            readyToPost: 'Ready to Post!',
            almostThere: 'Almost There',
            keepGoing: 'Keep Going'
        }
    }

    const t = content[language]

    const getScoreColor = () => {
        if (score >= 90) return 'from-green-500 to-emerald-500'
        if (score >= 70) return 'from-blue-500 to-cyan-500'
        if (score >= 50) return 'from-yellow-500 to-orange-500'
        return 'from-red-500 to-pink-500'
    }

    const getStatus = () => {
        if (score >= 90) return t.readyToPost
        if (score >= 70) return t.almostThere
        return t.keepGoing
    }

    const getIcon = () => {
        if (score >= 90) return CheckCircle2
        if (score >= 70) return TrendingUp
        return AlertCircle
    }

    const Icon = getIcon()

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="sticky top-4 z-10"
        >
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${score >= 80
                    ? 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-800'
                    : 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-300 dark:border-blue-800'
                } p-6`}>
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>

                <div className="relative">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                {t.completionScore}
                            </p>
                            <div className="flex items-center gap-2">
                                <Icon className={`w-6 h-6 ${score >= 80 ? 'text-green-600' : 'text-blue-600'
                                    }`} />
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {score}%
                                </span>
                            </div>
                        </div>

                        <div className={`px-4 py-2 rounded-xl font-bold text-sm ${scoreScore >= 80
                                ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                                : 'bg-blue-500 text-white shadow-lg shadow-blue-500/50'
                            }`}>
                            {getStatus()}
                        </div>
                    </div>

                    {/* Progress bar */}
                    <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full bg-gradient-to-r ${getScoreColor()} relative overflow-hidden`}
                        >
                            {/* Shimmer effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                        </motion.div>
                    </div>

                    {/* Message */}
                    <p className="text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        {getCompletionMessage(score, language)}
                    </p>
                </div>
            </div>

            <style jsx global>{`
                @keyframes shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
                
                .animate-shimmer {
                    animation: shimmer 2s infinite;
                }
            `}</style>
        </motion.div>
    )
}

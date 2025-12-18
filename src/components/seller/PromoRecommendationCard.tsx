'use client'

import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, Zap, Lock } from 'lucide-react'
import { PromoRecommendation, getDifficultyColor, getDifficultyLabel } from '@/lib/marketing-ai'

interface PromoRecommendationCardProps {
    promo: PromoRecommendation
    language: 'th' | 'en'
    onActivate: (promo: PromoRecommendation) => void
    isLocked?: boolean
}

export default function PromoRecommendationCard({
    promo,
    language,
    onActivate,
    isLocked = false
}: PromoRecommendationCardProps) {
    const difficultyColor = getDifficultyColor(promo.difficulty)

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-gray-900 rounded-2xl border-2 overflow-hidden ${isLocked
                    ? 'border-gray-200 dark:border-gray-800 opacity-60'
                    : 'border-indigo-200 dark:border-indigo-800 hover:shadow-xl transition-shadow'
                }`}
        >
            {/* Header with Icon */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="relative z-10 flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center text-2xl">
                            {promo.icon}
                        </div>
                        <div>
                            <h3 className="text-xl font-bold">
                                {promo.title[language]}
                            </h3>
                            <p className="text-white/80 text-sm mt-1">
                                {promo.description[language]}
                            </p>
                        </div>
                    </div>
                    {isLocked && (
                        <Lock className="w-6 h-6 text-white/50" />
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {/* AI Reasoning */}
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h4 className="font-bold text-purple-900 dark:text-purple-100 text-sm mb-1">
                                {language === 'th' ? 'ทำไม AI ถึงแนะนำ?' : 'Why AI Recommends This?'}
                            </h4>
                            <p className="text-sm text-purple-700 dark:text-purple-300 leading-relaxed">
                                {promo.reasoning[language]}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Expected Impact */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-bold text-green-700 dark:text-green-300">
                                {language === 'th' ? 'ยอดขาย' : 'Sales'}
                            </span>
                        </div>
                        <p className="text-2xl font-black text-green-700 dark:text-green-300">
                            +{promo.expectedImpact.salesIncrease}%
                        </p>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-bold text-blue-700 dark:text-blue-300">
                                {language === 'th' ? 'การเข้าถึง' : 'Reach'}
                            </span>
                        </div>
                        <p className="text-2xl font-black text-blue-700 dark:text-blue-300">
                            +{promo.expectedImpact.reachIncrease}%
                        </p>
                    </div>
                </div>

                {/* Difficulty Badge */}
                <div className="flex items-center justify-between">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${difficultyColor.bg} ${difficultyColor.text}`}>
                        {language === 'th' ? 'ความยาก: ' : 'Difficulty: '}
                        {getDifficultyLabel(promo.difficulty, language)}
                    </span>
                    {promo.config.duration && (
                        <span className="text-xs text-gray-500">
                            {promo.config.duration} {language === 'th' ? 'วัน' : 'days'}
                        </span>
                    )}
                </div>

                {/* Action Button */}
                <button
                    onClick={() => !isLocked && onActivate(promo)}
                    disabled={isLocked}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${isLocked
                            ? 'bg-gray-200 dark:bg-gray-800 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
                        }`}
                >
                    {isLocked
                        ? (language === 'th' ? '🔒 ล็อกอยู่' : '🔒 Locked')
                        : (language === 'th' ? 'เปิดใช้งานโปรโมชัน' : 'Activate Promotion')
                    }
                </button>
            </div>
        </motion.div>
    )
}

// Compact version for sidebar
export function PromoRecommendationCompact({
    promo,
    language,
    onClick
}: {
    promo: PromoRecommendation
    language: 'th' | 'en'
    onClick: () => void
}) {
    return (
        <button
            onClick={onClick}
            className="w-full text-left bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-indigo-200 dark:border-indigo-800 hover:shadow-md transition-all"
        >
            <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{promo.icon}</div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-100 text-sm mb-1">
                        {promo.title[language]}
                    </h4>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 mb-2">
                        +{promo.expectedImpact.salesIncrease}% {language === 'th' ? 'ยอดขาย' : 'sales'}
                    </p>
                    <span className="text-xs text-indigo-500">
                        {language === 'th' ? 'คลิกเพื่อดูรายละเอียด' : 'Click for details'} →
                    </span>
                </div>
            </div>
        </button>
    )
}

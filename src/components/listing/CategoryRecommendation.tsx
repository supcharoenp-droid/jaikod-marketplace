'use client'

/**
 * Category Recommendation Component
 * Shows AI-powered category suggestions
 */

import React from 'react'
import { motion } from 'framer-motion'
import { Tag, TrendingUp, CheckCircle2 } from 'lucide-react'
import type { CategoryRecommendation } from '@/services/intelligentListingAssistant'

interface CategoryRecommendationProps {
    recommendation: CategoryRecommendation
    selectedCategory?: number
    language: 'th' | 'en'
    onSelectCategory: (categoryId: number) => void
}

export default function CategoryRecommendationComponent({
    recommendation,
    selectedCategory,
    language,
    onSelectCategory
}: CategoryRecommendationProps) {
    const content = {
        th: {
            aiRecommended: 'AI แนะนำ',
            alternatives: 'หมวดหมู่อื่นที่เป็นไปได้',
            confidence: 'ความมั่นใจ',
            selected: 'เลือกแล้ว'
        },
        en: {
            aiRecommended: 'AI Recommended',
            alternatives: 'Alternative Categories',
            confidence: 'Confidence',
            selected: 'Selected'
        }
    }

    const t = content[language]

    return (
        <div className="space-y-4">
            {/* Main recommendation */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative"
            >
                {/* AI Recommended badge */}
                <div className="absolute -top-3 left-4 z-10">
                    <div className="flex items-center gap-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg">
                        <TrendingUp className="w-3 h-3" />
                        {t.aiRecommended}
                    </div>
                </div>

                <button
                    onClick={() => onSelectCategory(recommendation.main_category.id)}
                    className={`w-full text-left bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 rounded-2xl p-5 pt-7 transition-all ${selectedCategory === recommendation.main_category.id
                            ? 'border-purple-500 dark:border-purple-500 shadow-xl shadow-purple-500/30'
                            : 'border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600'
                        }`}
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className={`p-3 rounded-xl ${selectedCategory === recommendation.main_category.id
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400'
                                }`}>
                                <Tag className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-bold text-gray-900 dark:text-white">
                                    {recommendation.main_category.name[language]}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                    {t.confidence}: <span className="font-semibold text-purple-600 dark:text-purple-400">
                                        {Math.round(recommendation.main_category.confidence * 100)}%
                                    </span>
                                </p>
                            </div>
                        </div>

                        {selectedCategory === recommendation.main_category.id && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="flex items-center gap-1 text-green-600 dark:text-green-400"
                            >
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-sm font-bold">{t.selected}</span>
                            </motion.div>
                        )}
                    </div>
                </button>
            </motion.div>

            {/* Alternative categories */}
            {recommendation.alternatives.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2 px-2">
                        {t.alternatives}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {recommendation.alternatives.map((alt, index) => (
                            <motion.button
                                key={alt.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => onSelectCategory(alt.id)}
                                className={`text-left bg-white dark:bg-gray-800 border-2 rounded-xl p-3 transition-all ${selectedCategory === alt.id
                                        ? 'border-purple-400 dark:border-purple-600 shadow-lg'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 rounded-lg ${selectedCategory === alt.id
                                                ? 'bg-purple-100 dark:bg-purple-900/50'
                                                : 'bg-gray-100 dark:bg-gray-700'
                                            }`}>
                                            <Tag className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                                {alt.name[language]}
                                            </p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                                {Math.round(alt.confidence * 100)}%
                                            </p>
                                        </div>
                                    </div>

                                    {selectedCategory === alt.id && (
                                        <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

'use client'

import React from 'react'
import { Package, Sparkles, Check } from 'lucide-react'
import { CATEGORIES } from '@/constants/categories'
import { AICategoryPrediction } from '@/services/aiSmartListing'

interface Step4CategoryProps {
    categoryId?: number
    categoryPrediction?: AICategoryPrediction
    onCategoryChange: (categoryId: number, subCategoryId?: number) => void
    language: 'th' | 'en'
}

export default function Step4Category({
    categoryId,
    categoryPrediction,
    onCategoryChange,
    language
}: Step4CategoryProps) {
    const t = {
        th: {
            title: 'เลือกหมวดหมู่',
            subtitle: 'AI แนะนำหมวดหมู่ที่เหมาะสมกับสินค้าของคุณ',
            aiPrediction: 'AI ทาย',
            confidence: 'ความเชื่อมั่น',
            selectCategory: 'เลือกหมวดหมู่อื่น',
            useAI: 'ใช้ AI'
        },
        en: {
            title: 'Select Category',
            subtitle: 'AI suggests the best category for your product',
            aiPrediction: 'AI Prediction',
            confidence: 'Confidence',
            selectCategory: 'Choose Different',
            useAI: 'Use AI'
        }
    }

    const content = t[language]

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Package className="w-8 h-8 text-orange-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {content.title}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{content.subtitle}</p>
            </div>

            {categoryPrediction && (
                <div className="bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-300 dark:border-orange-700 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-orange-600" />
                            <h3 className="font-bold text-orange-900 dark:text-orange-100">
                                {content.aiPrediction}
                            </h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-orange-700">{content.confidence}:</span>
                            <span className="text-lg font-bold text-orange-600">
                                {Math.round(categoryPrediction.confidence * 100)}%
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => onCategoryChange(categoryPrediction.categoryId)}
                        className={`w-full p-4 rounded-xl border-2 transition-all ${categoryId === categoryPrediction.categoryId
                                ? 'border-orange-500 bg-orange-100 dark:bg-orange-900/30'
                                : 'border-orange-200 bg-white dark:bg-gray-800 hover:border-orange-400'
                            }`}
                    >
                        <div className="flex items-center justify-between">
                            <div className="text-left">
                                <p className="font-bold text-gray-900 dark:text-white">
                                    {categoryPrediction.categoryName[language]}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                    {categoryPrediction.reasoning[language]}
                                </p>
                            </div>
                            {categoryId === categoryPrediction.categoryId && (
                                <Check className="w-6 h-6 text-orange-600" />
                            )}
                        </div>
                    </button>
                </div>
            )}

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">{content.selectCategory}</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {CATEGORIES.slice(0, 12).map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => onCategoryChange(cat.id)}
                            className={`p-3 rounded-xl border-2 transition-all text-left ${categoryId === cat.id
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                }`}
                        >
                            <div className="text-2xl mb-2">{cat.icon}</div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                                {cat.name_th}
                            </p>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

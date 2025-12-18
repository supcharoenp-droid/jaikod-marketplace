/**
 * CategoryConfirmation Component
 * 
 * Shows AI category recommendations and lets user confirm or choose alternative
 * NOW WITH SUBCATEGORY VALIDATION!
 */

import React, { useEffect, useState } from 'react'
import { CategoryRecommendation, getCategoryExplanation } from '@/lib/category-decision-ai'
import { validateSubcategory, SubcategoryValidationResult } from '@/lib/subcategory-validator-ai'
import SubcategorySelector from './SubcategorySelector'
import { Sparkles, Check, AlertCircle } from 'lucide-react'

interface CategoryConfirmationProps {
    recommendations: CategoryRecommendation[]
    autoSelected?: CategoryRecommendation
    selectedCategoryId: string
    selectedSubcategoryId?: string
    productTitle: string
    productDescription: string
    onSelectCategory: (categoryId: string) => void
    onSelectSubcategory: (subcategoryId: string) => void
    onConfirm: () => void
}

export default function CategoryConfirmation({
    recommendations,
    autoSelected,
    selectedCategoryId,
    selectedSubcategoryId,
    productTitle,
    productDescription,
    onSelectCategory,
    onSelectSubcategory,
    onConfirm
}: CategoryConfirmationProps) {

    // Subcategory validation state
    const [subcatValidation, setSubcatValidation] = useState<SubcategoryValidationResult | null>(null)

    // Validate subcategory whenever category or subcategory changes
    useEffect(() => {
        if (selectedCategoryId || autoSelected) {
            const categoryId = selectedCategoryId || autoSelected?.categoryId || ''
            const validation = validateSubcategory({
                categoryId,
                subcategoryId: selectedSubcategoryId,
                title: productTitle,
                description: productDescription
            })
            setSubcatValidation(validation)
        }
    }, [selectedCategoryId, selectedSubcategoryId, productTitle, productDescription, autoSelected])

    // Check if can proceed (category selected + subcategory valid if required)
    const canProceed = selectedCategoryId && (!subcatValidation?.requires_subcategory || subcatValidation?.is_valid)

    if (autoSelected) {
        // High confidence - show auto-selected category with confirmation
        return (
            <div className="space-y-4">
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-300 dark:border-green-700 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-semibold text-green-900 dark:text-green-100 mb-2">
                                AI เลือกหมวดหมู่ให้คุณแล้ว
                            </h3>
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-2xl font-bold text-green-700 dark:text-green-300">
                                    {autoSelected.categoryName}
                                </span>
                                <span className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 rounded-full text-sm font-medium">
                                    {Math.round(autoSelected.confidence * 100)}% มั่นใจ
                                </span>
                            </div>
                            <p className="text-sm text-green-700 dark:text-green-300">
                                {getCategoryExplanation(autoSelected.confidence)} - {autoSelected.reasoning}
                            </p>
                        </div>
                        <div className="flex-shrink-0">
                            <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                </div>

                {/* Subcategory selector for auto-selected category */}
                {subcatValidation && (
                    <SubcategorySelector
                        validation={subcatValidation}
                        selectedSubcategoryId={selectedSubcategoryId}
                        onSelectSubcategory={onSelectSubcategory}
                    />
                )}

                <button
                    onClick={onConfirm}
                    disabled={!canProceed}
                    className="w-full py-4 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium text-lg transition-colors flex items-center justify-center gap-2"
                >
                    <Check className="w-5 h-5" />
                    ใช่ ถูกต้องแล้ว ดำเนินการต่อ
                </button>

                {/* Show alternatives */}
                {recommendations.length > 1 && (
                    <details className="mt-4">
                        <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                            หรือเลือกหมวดอื่น ({recommendations.length - 1} ตัวเลือก)
                        </summary>
                        <div className="mt-4 space-y-2">
                            {recommendations.slice(1).map((rec) => (
                                <button
                                    key={rec.categoryId}
                                    onClick={() => onSelectCategory(rec.categoryId)}
                                    className="w-full p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-purple-400 dark:hover:border-purple-600 transition-colors text-left"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium text-gray-900 dark:text-white">
                                                {rec.categoryName}
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {rec.reasoning}
                                            </div>
                                        </div>
                                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm">
                                            {Math.round(rec.confidence * 100)}%
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </details>
                )}
            </div>
        )
    }

    // Low confidence - show options for user to choose
    return (
        <div className="space-y-4">
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-300 dark:border-yellow-700 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                        <AlertCircle className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-yellow-900 dark:text-yellow-100 mb-2">
                            กรุณาเลือกหมวดหมู่ที่ตรงที่สุด
                        </h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                            AI ไม่มั่นใจเพียงพอ ({Math.round((recommendations[0]?.confidence || 0) * 100)}%)
                            กรุณาช่วยตรวจสอบและเลือกหมวดที่ถูกต้อง
                        </p>
                    </div>
                </div>
            </div>

            {/* Category Options */}
            <div className="space-y-3">
                {recommendations.map((rec) => (
                    <button
                        key={rec.categoryId}
                        onClick={() => onSelectCategory(rec.categoryId)}
                        className={`w-full p-5 border-2 rounded-xl transition-all text-left ${selectedCategoryId === rec.categoryId
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                            }`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                {selectedCategoryId === rec.categoryId && (
                                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                                <div>
                                    <div className="text-lg font-semibold text-gray-900 dark:text-white">
                                        {rec.categoryName}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {rec.reasoning}
                                    </div>
                                </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium">
                                    {Math.round(rec.confidence * 100)}%
                                </div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {getCategoryExplanation(rec.confidence)}
                                </div>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            {/* Subcategory selector for selected category */}
            {selectedCategoryId && subcatValidation && (
                <SubcategorySelector
                    validation={subcatValidation}
                    selectedSubcategoryId={selectedSubcategoryId}
                    onSelectSubcategory={onSelectSubcategory}
                />
            )}

            <button
                onClick={onConfirm}
                disabled={!canProceed}
                className="w-full py-4 px-6 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-xl font-medium text-lg transition-colors"
            >
                ยืนยันและดำเนินการต่อ
            </button>
        </div>
    )
}

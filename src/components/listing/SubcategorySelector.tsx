/**
 * SubcategorySelector Component
 * 
 * Validates and helps user select appropriate subcategory
 */

import React from 'react'
import { SubcategoryValidationResult } from '@/lib/subcategory-validator-ai'
import { AlertCircle, Check, Sparkles } from 'lucide-react'

interface SubcategorySelectorProps {
    validation: SubcategoryValidationResult
    selectedSubcategoryId?: string
    onSelectSubcategory: (id: string) => void
}

export default function SubcategorySelector({
    validation,
    selectedSubcategoryId,
    onSelectSubcategory
}: SubcategorySelectorProps) {

    // If category doesn't require subcategory, don't show anything
    if (!validation.requires_subcategory) {
        return null
    }

    // If valid (already selected), show confirmation
    if (validation.is_valid) {
        return (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                <Check className="w-4 h-4" />
                <span>{validation.helper_text}</span>
            </div>
        )
    }

    // Show subcategory selection UI
    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-start gap-3 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <h4 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">
                        จำเป็นต้องเลือกหมวดย่อย
                    </h4>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                        {validation.helper_text}
                    </p>
                </div>
            </div>

            {/* Suggested Subcategories */}
            {validation.suggested_subcategories.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <Sparkles className="w-4 h-4" />
                        <span>AI แนะนำหมวดย่อยที่เหมาะสม:</span>
                    </div>

                    {validation.suggested_subcategories.map((suggestion) => (
                        <button
                            key={suggestion.id}
                            onClick={() => onSelectSubcategory(suggestion.id)}
                            className={`w-full p-4 border-2 rounded-lg transition-all text-left ${selectedSubcategoryId === suggestion.id
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {selectedSubcategoryId === suggestion.id && (
                                        <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {suggestion.name}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            {suggestion.reasoning}
                                        </div>
                                    </div>
                                </div>
                                {suggestion.confidence > 0.5 && (
                                    <div className="px-3 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-full text-sm font-medium">
                                        {Math.round(suggestion.confidence * 100)}% ตรง
                                    </div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* If no suggestions, show basic message */}
            {validation.suggested_subcategories.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    กรุณาเลือกหมวดย่อยที่เหมาะสม
                </p>
            )}
        </div>
    )
}

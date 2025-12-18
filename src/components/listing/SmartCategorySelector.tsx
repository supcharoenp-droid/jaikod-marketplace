'use client'

/**
 * SmartCategorySelector - AI-Powered Category Selection
 * 
 * Features:
 * - AI category detection with confidence score
 * - Alternative suggestions
 * - Manual override
 * - Visual feedback
 * - Smooth animations
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ChevronDown, Check, TrendingUp } from 'lucide-react'

interface CategorySuggestion {
    id: string
    name: string
    confidence: number
    reason?: string
}

interface SmartCategorySelectorProps {
    aiSuggestion: CategorySuggestion
    alternatives?: CategorySuggestion[]
    allCategories: CategorySuggestion[]
    selected: string
    onSelect: (categoryId: string) => void
    isLoading?: boolean
}

export default function SmartCategorySelector({
    aiSuggestion,
    alternatives = [],
    allCategories,
    selected,
    onSelect,
    isLoading = false
}: SmartCategorySelectorProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [showAllCategories, setShowAllCategories] = useState(false)

    const selectedCategory = allCategories.find(c => c.id === selected) || aiSuggestion

    return (
        <div className="space-y-4">
            {/* AI Suggestion */}
            {!isLoading && aiSuggestion && (
                <motion.div
                    className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-pink-500/10
                     border border-purple-500/20"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-sm font-medium text-white">
                                    🤖 AI แนะนำ
                                </span>
                                <span className="px-2 py-0.5 bg-purple-500/30 rounded text-xs text-purple-300">
                                    {Math.round(aiSuggestion.confidence)}% แน่ใจ
                                </span>
                            </div>
                            <div className="text-lg font-semibold text-white mb-1">
                                {aiSuggestion.name}
                            </div>
                            {aiSuggestion.reason && (
                                <div className="text-sm text-gray-400">
                                    {aiSuggestion.reason}
                                </div>
                            )}
                            {selected !== aiSuggestion.id && (
                                <button
                                    onClick={() => onSelect(aiSuggestion.id)}
                                    className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700
                                     rounded-lg text-sm font-medium transition-colors"
                                >
                                    ใช้คำแนะนำนี้
                                </button>
                            )}
                        </div>
                        {selected === aiSuggestion.id && (
                            <div className="p-1 bg-green-500 rounded-full">
                                <Check className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Confidence Bar */}
                    <div className="mt-3">
                        <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                initial={{ width: 0 }}
                                animate={{ width: `${aiSuggestion.confidence}%` }}
                                transition={{ duration: 1, delay: 0.3 }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
                    <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent 
                         rounded-full animate-spin" />
                        <span className="text-sm text-gray-400">กำลังวิเคราะห์หมวดหมู่...</span>
                    </div>
                </div>
            )}

            {/* Alternative Suggestions */}
            {alternatives.length > 0 && (
                <div>
                    <div className="text-sm text-gray-400 mb-2 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        หมวดหมู่อื่นที่เป็นไปได้
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        {alternatives.map((alt) => (
                            <motion.button
                                key={alt.id}
                                onClick={() => onSelect(alt.id)}
                                className={`p-3 rounded-lg border-2 transition-all text-left
                                 ${selected === alt.id
                                        ? 'border-purple-500 bg-purple-500/10'
                                        : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                                    }`}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-white">
                                        {alt.name}
                                    </span>
                                    {selected === alt.id && (
                                        <Check className="w-4 h-4 text-purple-400" />
                                    )}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {Math.round(alt.confidence)}% แม่นยำ
                                </div>
                            </motion.button>
                        ))}
                    </div>
                </div>
            )}

            {/* Manual Selection Dropdown */}
            <div>
                <button
                    onClick={() => setShowAllCategories(!showAllCategories)}
                    className="w-full p-4 rounded-lg bg-gray-800 border-2 border-gray-700
                     hover:border-gray-600 transition-all text-left
                     flex items-center justify-between"
                >
                    <div>
                        <div className="text-xs text-gray-400 mb-1">หมวดหมู่ที่เลือก</div>
                        <div className="text-white font-medium">{selectedCategory.name}</div>
                    </div>
                    <motion.div
                        animate={{ rotate: showAllCategories ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                    </motion.div>
                </button>

                <AnimatePresence>
                    {showAllCategories && (
                        <motion.div
                            className="mt-2 p-2 rounded-lg bg-gray-800 border border-gray-700
                             max-h-64 overflow-y-auto"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                        >
                            {allCategories.map((category) => (
                                <button
                                    key={category.id}
                                    onClick={() => {
                                        onSelect(category.id)
                                        setShowAllCategories(false)
                                    }}
                                    className={`w-full p-3 rounded-lg text-left transition-colors
                                     flex items-center justify-between
                                     ${selected === category.id
                                            ? 'bg-purple-500/20 text-white'
                                            : 'hover:bg-gray-700 text-gray-300'
                                        }`}
                                >
                                    <span>{category.name}</span>
                                    {selected === category.id && (
                                        <Check className="w-4 h-4 text-purple-400" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Info */}
            <div className="flex items-start gap-2 text-xs text-gray-500 
                           p-3 bg-blue-500/5 rounded-lg border border-blue-500/10">
                <span className="flex-shrink-0">💡</span>
                <span>
                    เลือกหมวดหมู่ที่ถูกต้องจะช่วยให้ลูกค้าค้นหาเจอง่ายขึ้น ~35%
                </span>
            </div>
        </div>
    )
}

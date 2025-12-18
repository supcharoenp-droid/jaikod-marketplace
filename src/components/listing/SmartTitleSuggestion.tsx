'use client'

/**
 * Smart Title Suggestion Component
 * Shows AI-powered title suggestions without overwriting user input
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, Check } from 'lucide-react'
import type { TitleSuggestion } from '@/services/intelligentListingAssistant'

interface SmartTitleSuggestionProps {
    suggestions: TitleSuggestion[]
    userTitle: string
    language: 'th' | 'en'
    onApplySuggestion: (title: string) => void
}

export default function SmartTitleSuggestion({
    suggestions,
    userTitle,
    language,
    onApplySuggestion
}: SmartTitleSuggestionProps) {
    const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null)

    const handleCopy = (title: string, index: number) => {
        onApplySuggestion(title)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const content = {
        th: {
            title: 'AI แนะนำชื่อสินค้า',
            subtitle: 'คลิกเพื่อใช้ชื่อที่แนะนำ (คุณสามารถแก้ไขได้)',
            confidence: 'ความมั่นใจ',
            applied: 'คัดลอกแล้ว!',
            apply: 'ใช้ชื่อนี้'
        },
        en: {
            title: 'AI Title Suggestions',
            subtitle: 'Click to use suggested title (you can edit it)',
            confidence: 'Confidence',
            applied: 'Copied!',
            apply: 'Use this'
        }
    }

    const t = content[language]

    if (suggestions.length === 0) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4"
            >
                <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-2xl p-5">
                    <div className="flex items-start gap-3 mb-4">
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="flex-shrink-0 p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg"
                        >
                            <Sparkles className="w-5 h-5 text-white" />
                        </motion.div>
                        <div>
                            <h4 className="font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                                {t.title}
                            </h4>
                            <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                                {t.subtitle}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {suggestions.map((suggestion, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="relative group"
                            >
                                <button
                                    onClick={() => handleCopy(suggestion.suggested_title[language], index)}
                                    className="w-full text-left bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-2 border-purple-200 dark:border-purple-800 rounded-xl p-4 hover:border-purple-400 dark:hover:border-purple-600 hover:shadow-lg transition-all"
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1">
                                            <p className="font-medium text-gray-900 dark:text-white mb-1">
                                                {suggestion.suggested_title[language]}
                                            </p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {suggestion.reasoning[language]}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Confidence badge */}
                                            <div className="px-2 py-1 bg-purple-100 dark:bg-purple-900/50 rounded-full text-xs font-bold text-purple-700 dark:text-purple-300">
                                                {Math.round(suggestion.confidence * 100)}%
                                            </div>

                                            {/* Copy/Check icon */}
                                            <div className={`flex-shrink-0 p-2 rounded-lg transition-all ${copiedIndex === index
                                                    ? 'bg-green-100 dark:bg-green-900/50'
                                                    : 'bg-purple-100 dark:bg-purple-900/50'
                                                }`}>
                                                {copiedIndex === index ? (
                                                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                                                ) : (
                                                    <Copy className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                {/* Applied indicator */}
                                <AnimatePresence>
                                    {copiedIndex === index && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-lg"
                                        >
                                            {t.applied}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    )
}

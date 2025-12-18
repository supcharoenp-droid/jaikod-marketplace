/**
 * AI Assistant Bubble
 * 
 * Friendly AI tips and suggestions with personality
 */

'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'

interface AIBubbleProps {
    message: string
    type?: 'tip' | 'success' | 'warning' | 'suggestion'
    action?: {
        label: string
        onClick: () => void
        impact?: string
    }
    onDismiss?: () => void
    show?: boolean
}

export default function AIBubble({
    message,
    type = 'tip',
    action,
    onDismiss,
    show = true
}: AIBubbleProps) {
    const bgColors = {
        tip: 'from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-purple-200 dark:border-purple-800',
        success: 'from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800',
        warning: 'from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800',
        suggestion: 'from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-pink-200 dark:border-pink-800'
    }

    const textColors = {
        tip: 'text-purple-900 dark:text-purple-300',
        success: 'text-green-900 dark:text-green-300',
        warning: 'text-yellow-900 dark:text-yellow-300',
        suggestion: 'text-pink-900 dark:text-pink-300'
    }

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className={`relative p-4 bg-gradient-to-r ${bgColors[type]} rounded-xl border-2 shadow-lg`}
                >
                    {/* AI Avatar */}
                    <div className="flex items-start gap-3">
                        <motion.div
                            animate={{
                                rotate: [0, 10, -10, 0],
                                scale: [1, 1.1, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatDelay: 3
                            }}
                            className="flex-shrink-0"
                        >
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl shadow-lg">
                                🤖
                            </div>
                        </motion.div>

                        {/* Content */}
                        <div className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    <p className={`text-xs font-bold ${textColors[type]}`}>
                                        AI แนะนำ
                                    </p>
                                </div>
                                {onDismiss && (
                                    <button
                                        onClick={onDismiss}
                                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                )}
                            </div>

                            <p className={`text-sm ${textColors[type]} leading-relaxed`}>
                                {message}
                            </p>

                            {/* Action Button */}
                            {action && (
                                <div className="mt-3 flex items-center gap-2">
                                    <button
                                        onClick={action.onClick}
                                        className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:shadow-lg transition-all font-semibold"
                                    >
                                        {action.label}
                                    </button>
                                    {action.impact && (
                                        <span className="text-xs text-purple-700 dark:text-purple-300 font-semibold">
                                            {action.impact}
                                        </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Animated glow effect */}
                    <motion.div
                        className="absolute inset-0 rounded-xl opacity-50"
                        animate={{
                            boxShadow: [
                                '0 0 0px rgba(147, 51, 234, 0)',
                                '0 0 20px rgba(147, 51, 234, 0.3)',
                                '0 0 0px rgba(147, 51, 234, 0)'
                            ]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            repeatDelay: 1
                        }}
                    />
                </motion.div>
            )}
        </AnimatePresence>
    )
}

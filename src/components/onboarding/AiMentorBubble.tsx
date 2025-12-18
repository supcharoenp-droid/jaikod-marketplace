'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, X, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { MentorMessage } from '@/types/ai-mentor'

interface AiMentorBubbleProps {
    message: MentorMessage
    onDismiss?: () => void
    compact?: boolean
}

export default function AiMentorBubble({ message, onDismiss, compact = false }: AiMentorBubbleProps) {
    const [isExpanded, setIsExpanded] = useState(!compact)
    const [isDismissed, setIsDismissed] = useState(false)

    const handleDismiss = () => {
        setIsDismissed(true)
        setTimeout(() => {
            onDismiss?.()
        }, 300)
    }

    if (isDismissed) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: 'spring', duration: 0.5 }}
                className={`relative ${compact ? 'mb-3' : 'mb-6'}`}
            >
                {/* Mentor Bubble */}
                <div className={`bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl border-2 border-purple-200 dark:border-purple-700 shadow-lg overflow-hidden ${message.priority === 'high' ? 'ring-2 ring-purple-400 ring-offset-2' : ''
                    }`}>
                    {/* Header */}
                    <div
                        className={`flex items-center gap-3 p-4 ${compact ? 'cursor-pointer' : ''}`}
                        onClick={() => compact && setIsExpanded(!isExpanded)}
                    >
                        {/* AI Avatar */}
                        <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-md">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"
                            />
                        </div>

                        {/* Title */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-purple-900 dark:text-purple-100">
                                    {message.language === 'th' ? 'AI Mentor' : 'AI Mentor'}
                                </h3>
                                {message.canSkip && (
                                    <span className="text-xs bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-200 px-2 py-0.5 rounded-full">
                                        {message.language === 'th' ? 'ข้ามได้' : 'Optional'}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-purple-600 dark:text-purple-300">
                                {message.language === 'th' ? 'ผู้ช่วยส่วนตัว' : 'Your Personal Assistant'}
                            </p>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center gap-2">
                            {compact && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setIsExpanded(!isExpanded)
                                    }}
                                    className="p-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full transition-colors"
                                >
                                    {isExpanded ? (
                                        <ChevronUp className="w-4 h-4 text-purple-600" />
                                    ) : (
                                        <ChevronDown className="w-4 h-4 text-purple-600" />
                                    )}
                                </button>
                            )}
                            {onDismiss && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleDismiss()
                                    }}
                                    className="p-1 hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full transition-colors"
                                >
                                    <X className="w-4 h-4 text-purple-600" />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <AnimatePresence>
                        {isExpanded && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="px-4 pb-4 space-y-3">
                                    {/* Main Message */}
                                    <div className="bg-white dark:bg-gray-900/50 rounded-xl p-3 shadow-sm">
                                        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                            {message.message}
                                        </p>
                                    </div>

                                    {/* Tip */}
                                    {message.tip && (
                                        <div className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 rounded-xl p-3 border border-amber-200 dark:border-amber-800">
                                            <Lightbulb className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                                            <p className="text-xs text-amber-800 dark:text-amber-200 leading-relaxed">
                                                <span className="font-bold">
                                                    {message.language === 'th' ? 'เคล็ดลับ: ' : 'Tip: '}
                                                </span>
                                                {message.tip}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Floating indicator for high priority */}
                {message.priority === 'high' && (
                    <motion.div
                        animate={{ y: [0, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                        <span className="text-white text-xs font-bold">!</span>
                    </motion.div>
                )}
            </motion.div>
        </AnimatePresence>
    )
}

// Compact version for inline use
export function AiMentorInline({ message }: { message: MentorMessage }) {
    return (
        <div className="flex items-start gap-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-700">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-3 h-3 text-white" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-purple-900 dark:text-purple-100 leading-relaxed">
                    {message.message}
                </p>
                {message.tip && (
                    <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                        💡 {message.tip}
                    </p>
                )}
            </div>
        </div>
    )
}

// Floating mentor button (for persistent access)
export function AiMentorFloatingButton({ onClick }: { onClick: () => void }) {
    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClick}
            className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center z-50 hover:shadow-purple-500/50 transition-shadow"
        >
            <Sparkles className="w-6 h-6 text-white" />
            <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"
            />
        </motion.button>
    )
}

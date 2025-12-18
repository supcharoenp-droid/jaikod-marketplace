'use client'

import { motion } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'
import { AiInsight } from '@/lib/ai-insights'

interface AiInsightCardProps {
    insight: AiInsight
    language: 'th' | 'en'
}

export default function AiInsightCard({ insight, language }: AiInsightCardProps) {
    const typeStyles = {
        action: {
            bg: 'from-indigo-500 to-purple-500',
            border: 'border-indigo-200 dark:border-indigo-800',
            iconBg: 'bg-white/20'
        },
        tip: {
            bg: 'from-blue-500 to-cyan-500',
            border: 'border-blue-200 dark:border-blue-800',
            iconBg: 'bg-white/20'
        },
        warning: {
            bg: 'from-orange-500 to-red-500',
            border: 'border-orange-200 dark:border-orange-800',
            iconBg: 'bg-white/20'
        },
        success: {
            bg: 'from-green-500 to-emerald-500',
            border: 'border-green-200 dark:border-green-800',
            iconBg: 'bg-white/20'
        }
    }

    const style = typeStyles[insight.type]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${style.bg} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden`}
        >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full blur-2xl"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl ${style.iconBg} backdrop-blur-sm flex items-center justify-center text-2xl`}>
                            {insight.icon}
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <Sparkles className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase tracking-wider opacity-90">
                                    {language === 'th' ? 'AI แนะนำ' : 'AI Insight'}
                                </span>
                            </div>
                            <h3 className="text-xl font-bold leading-tight">
                                {insight.title[language]}
                            </h3>
                        </div>
                    </div>
                </div>

                {/* Message */}
                <p className="text-white/90 leading-relaxed mb-6">
                    {insight.message[language]}
                </p>

                {/* Action Button */}
                {insight.action && (
                    <a
                        href={insight.action.href}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-gray-900 rounded-xl font-bold hover:shadow-lg transition-all group"
                    >
                        {insight.action.label[language]}
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </a>
                )}
            </div>

            {/* Priority Indicator */}
            {insight.priority === 'high' && (
                <div className="absolute top-4 right-4">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                </div>
            )}
        </motion.div>
    )
}

// Compact version for sidebar
export function AiInsightCompact({ insight, language }: AiInsightCardProps) {
    return (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-200 dark:border-purple-800">
            <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0">{insight.icon}</div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-purple-900 dark:text-purple-100 text-sm mb-1">
                        {insight.title[language]}
                    </h4>
                    <p className="text-xs text-purple-700 dark:text-purple-300 leading-relaxed">
                        {insight.message[language]}
                    </p>
                    {insight.action && (
                        <a
                            href={insight.action.href}
                            className="inline-flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 mt-2 hover:underline"
                        >
                            {insight.action.label[language]}
                            <ArrowRight className="w-3 h-3" />
                        </a>
                    )}
                </div>
            </div>
        </div>
    )
}

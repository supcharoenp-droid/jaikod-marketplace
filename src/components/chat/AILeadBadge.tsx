'use client'

import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { LeadAnalysis } from '@/services/aiChatService'

interface AILeadBadgeProps {
    leadAnalysis: LeadAnalysis | null
    className?: string
    compact?: boolean
}

/**
 * AILeadBadge - แสดง Lead Score จาก AI Analysis
 * Hot = มีโอกาสปิดการขายสูง
 * Warm = มีความสนใจปานกลาง
 * Cold = ยังไม่แน่ใจ
 */
export default function AILeadBadge({
    leadAnalysis,
    className = '',
    compact = false
}: AILeadBadgeProps) {
    if (!leadAnalysis) return null

    const getLeadConfig = (label: string) => {
        switch (label) {
            case 'Hot':
                return {
                    bg: 'from-orange-500/10 to-red-500/10',
                    border: 'border-orange-200 dark:border-orange-900/30',
                    text: 'text-orange-600 dark:text-orange-400',
                    icon: TrendingUp,
                    emoji: '🔥',
                    labelTH: 'ลูกค้าสนใจมาก'
                }
            case 'Warm':
                return {
                    bg: 'from-blue-500/10 to-indigo-500/10',
                    border: 'border-blue-200 dark:border-blue-900/30',
                    text: 'text-blue-600 dark:text-blue-400',
                    icon: Minus,
                    emoji: '🌡️',
                    labelTH: 'กำลังพิจารณา'
                }
            case 'Cold':
            default:
                return {
                    bg: 'from-gray-500/5 to-gray-500/10',
                    border: 'border-gray-200 dark:border-gray-700',
                    text: 'text-gray-500 dark:text-gray-400',
                    icon: TrendingDown,
                    emoji: '❄️',
                    labelTH: 'ยังไม่ตัดสินใจ'
                }
        }
    }

    const config = getLeadConfig(leadAnalysis.label)
    const Icon = config.icon

    if (compact) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-r ${config.bg} border ${config.border} ${className}`}
            >
                <span className="text-sm">{config.emoji}</span>
                <span className={`text-[10px] font-black uppercase tracking-wider ${config.text}`}>
                    {leadAnalysis.label}
                </span>
                <span className={`text-[10px] font-bold ${config.text}`}>
                    {leadAnalysis.probability}
                </span>
            </motion.div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 px-4 py-2 rounded-2xl bg-gradient-to-r ${config.bg} border ${config.border} ${className}`}
        >
            {/* Score Circle */}
            <div className="relative">
                <div className={`w-12 h-12 rounded-full border-[3px] flex items-center justify-center text-xs font-black ${config.text} ${config.border}`}>
                    {leadAnalysis.probability}
                </div>
                {leadAnalysis.label === 'Hot' && (
                    <motion.div
                        className="absolute -top-1 -right-1"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <Sparkles className="w-4 h-4 text-orange-500 fill-current" />
                    </motion.div>
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">
                        AI Lead Score
                    </span>
                    <span className={`text-[10px] font-black uppercase ${config.text}`}>
                        {leadAnalysis.label}
                    </span>
                </div>
                <p className={`text-xs font-bold ${config.text} truncate`}>
                    {leadAnalysis.reasonTH || config.labelTH}
                </p>
            </div>

            {/* Trend Icon */}
            <div className={`p-2 rounded-full ${config.bg} ${config.text}`}>
                <Icon className="w-4 h-4" />
            </div>
        </motion.div>
    )
}

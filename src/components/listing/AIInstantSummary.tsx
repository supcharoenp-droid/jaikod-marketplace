'use client'

/**
 * AI Instant Summary Component (Amazon Style)
 * 
 * แสดงสรุป AI อย่างรวดเร็ว - "เงียบ ๆ แต่โหด"
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Brain, Sparkles, CheckCircle, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { AIProductSummary, generateProductSummary } from '@/lib/ai-commerce'

interface AIInstantSummaryProps {
    product: {
        id: string
        title: string
        description?: string
        price: number
        category_id: number
        condition?: string
        images?: string[]
        specs?: Record<string, any>
        seller_id: string
    }
    compact?: boolean
}

export default function AIInstantSummary({ product, compact = false }: AIInstantSummaryProps) {
    const { language } = useLanguage()
    const [summary, setSummary] = useState<AIProductSummary | null>(null)
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(!compact)

    useEffect(() => {
        generateSummary()
    }, [product.id])

    const generateSummary = async () => {
        setLoading(true)
        try {
            const result = await generateProductSummary(product)
            setSummary(result)
        } catch (error) {
            console.error('AI Summary error:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <Brain className="w-5 h-5 animate-pulse" />
                    <span className="text-sm font-medium animate-pulse">
                        {language === 'th' ? '🧠 AI กำลังวิเคราะห์...' : '🧠 AI Analyzing...'}
                    </span>
                </div>
            </div>
        )
    }

    if (!summary) return null

    const conditionLabel = {
        excellent: { th: 'ดีเยี่ยม', en: 'Excellent', color: 'text-green-600' },
        good: { th: 'ดี', en: 'Good', color: 'text-emerald-600' },
        fair: { th: 'พอใช้', en: 'Fair', color: 'text-yellow-600' },
        poor: { th: 'ต้องปรับปรุง', en: 'Needs Work', color: 'text-orange-600' },
        unknown: { th: 'ไม่ระบุ', en: 'Unknown', color: 'text-gray-500' }
    }

    const condition = conditionLabel[summary.overallCondition]

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl border border-purple-100 dark:border-purple-800 overflow-hidden"
        >
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-purple-100/50 dark:hover:bg-purple-800/30 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left">
                        <h4 className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                            {language === 'th' ? '🧠 AI สรุปเร็ว' : '🧠 AI Quick Summary'}
                        </h4>
                        <p className="text-xs text-purple-600 dark:text-purple-400">
                            {language === 'th'
                                ? `สภาพ: ${condition.th}`
                                : `Condition: ${condition.en}`
                            }
                        </p>
                    </div>
                </div>
                {expanded ? (
                    <ChevronUp className="w-5 h-5 text-purple-500" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-purple-500" />
                )}
            </button>

            {/* Content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                    >
                        {/* Condition Score */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">
                                    {language === 'th' ? 'คะแนนสภาพ' : 'Condition Score'}
                                </span>
                                <span className={`text-sm font-bold ${condition.color}`}>
                                    {summary.conditionScore}/100
                                </span>
                            </div>
                            <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${summary.conditionScore}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className={`h-full rounded-full ${summary.conditionScore >= 80
                                        ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                        : summary.conditionScore >= 60
                                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
                                            : 'bg-gradient-to-r from-orange-400 to-red-500'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Highlights */}
                        {summary.highlights.length > 0 && (
                            <div className="mb-3">
                                <h5 className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3 text-green-500" />
                                    {language === 'th' ? 'จุดเด่น' : 'Highlights'}
                                </h5>
                                <ul className="space-y-1.5">
                                    {summary.highlights.map((h, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                                        >
                                            <span>{h.icon}</span>
                                            <span>{language === 'th' ? h.text_th : h.text_en}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Concerns */}
                        {summary.concerns.length > 0 && (
                            <div className="mb-3">
                                <h5 className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                                    <Info className="w-3 h-3 text-amber-500" />
                                    {language === 'th' ? 'ควรทราบ' : 'Things to Note'}
                                </h5>
                                <ul className="space-y-1.5">
                                    {summary.concerns.map((c, i) => (
                                        <li
                                            key={i}
                                            className={`flex items-start gap-2 text-sm ${c.severity === 'warning'
                                                ? 'text-amber-600 dark:text-amber-400'
                                                : c.severity === 'critical'
                                                    ? 'text-red-600 dark:text-red-400'
                                                    : 'text-gray-600 dark:text-gray-400'
                                                }`}
                                        >
                                            <span>{c.icon}</span>
                                            <span>{language === 'th' ? c.text_th : c.text_en}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* AI Transparency Note */}
                        <div className="pt-3 border-t border-purple-200 dark:border-purple-700">
                            <p className="text-[10px] text-gray-400 dark:text-gray-500 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {language === 'th'
                                    ? 'วิเคราะห์จากข้อมูลจริงที่มี • ไม่ใช่การรับรอง'
                                    : 'Based on available data • Not a guarantee'
                                }
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

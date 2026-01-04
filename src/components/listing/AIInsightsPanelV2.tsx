0./**
 * AI INSIGHTS PANEL V2
 * 
 * แสดงข้อมูล AI Analysis อย่างสวยงาม
 * - Price Score (0-100)
 * - Market Comparison
 * - Buyer Checklist
 * - Red Flags
 * - Smart Tips
 * 
 * @version 2.0.0
 */

'use client'

import { useState } from 'react'
import {
    Brain, TrendingUp, TrendingDown, Minus, CheckCircle,
    AlertTriangle, HelpCircle, ChevronDown, ChevronUp,
    Lightbulb, Shield, Sparkles, MessageCircle
} from 'lucide-react'
import type { AIAnalysis } from '@/contexts/UnifiedListingContext'
import { formatPrice } from '@/contexts/UnifiedListingContext'

// ==========================================
// TYPES
// ==========================================

interface AIInsightsPanelV2Props {
    analysis: AIAnalysis | null
    listingPrice: number
    language?: 'th' | 'en'
    defaultExpanded?: boolean
}

// ==========================================
// COMPONENT
// ==========================================

export function AIInsightsPanelV2({
    analysis,
    listingPrice,
    language = 'th',
    defaultExpanded = true
}: AIInsightsPanelV2Props) {
    const [expanded, setExpanded] = useState(defaultExpanded)
    const [showChecklist, setShowChecklist] = useState(false)

    if (!analysis) {
        return (
            <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                <div className="flex items-center gap-2 text-gray-400">
                    <Brain className="w-5 h-5 animate-pulse" />
                    <span>{language === 'th' ? 'กำลังวิเคราะห์...' : 'Analyzing...'}</span>
                </div>
            </div>
        )
    }

    // Determine price status
    const getPriceStatus = () => {
        const diff = analysis.market_price - listingPrice
        const percent = Math.round((diff / analysis.market_price) * 100)

        if (analysis.price_position === 'below') {
            return {
                icon: <TrendingDown className="w-5 h-5" />,
                color: 'text-emerald-400',
                bgColor: 'bg-emerald-500/10',
                borderColor: 'border-emerald-500/30',
                label: language === 'th' ? `ถูกกว่าตลาด ${Math.abs(percent)}%` : `${Math.abs(percent)}% below market`,
                description: language === 'th' ? 'ราคาดี!' : 'Good price!'
            }
        } else if (analysis.price_position === 'above') {
            return {
                icon: <TrendingUp className="w-5 h-5" />,
                color: 'text-orange-400',
                bgColor: 'bg-orange-500/10',
                borderColor: 'border-orange-500/30',
                label: language === 'th' ? `สูงกว่าตลาด ${Math.abs(percent)}%` : `${Math.abs(percent)}% above market`,
                description: language === 'th' ? 'ควรต่อรอง' : 'Negotiate'
            }
        } else {
            return {
                icon: <Minus className="w-5 h-5" />,
                color: 'text-blue-400',
                bgColor: 'bg-blue-500/10',
                borderColor: 'border-blue-500/30',
                label: language === 'th' ? 'ราคาตลาด' : 'Market price',
                description: language === 'th' ? 'สมเหตุสมผล' : 'Fair'
            }
        }
    }

    const priceStatus = getPriceStatus()

    // Score color
    const getScoreColor = (score: number) => {
        if (score >= 80) return 'from-emerald-500 to-green-400'
        if (score >= 60) return 'from-green-500 to-lime-400'
        if (score >= 40) return 'from-yellow-500 to-amber-400'
        return 'from-orange-500 to-red-400'
    }

    return (
        <div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl border border-purple-500/30 overflow-hidden">

            {/* === HEADER === */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                        <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            AI {language === 'th' ? 'วิเคราะห์' : 'Analysis'}
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                        </h3>
                        <p className="text-sm text-gray-400">
                            {language === 'th' ? 'ข้อมูลเชิงลึกจาก AI' : 'AI-powered insights'}
                        </p>
                    </div>
                </div>
                {expanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
            </button>

            {/* === CONTENT === */}
            {expanded && (
                <div className="px-4 pb-4 space-y-4">

                    {/* === PRICE SCORE === */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-400 text-sm">
                                {language === 'th' ? 'คะแนนความคุ้มค่า' : 'Value Score'}
                            </span>
                            <span className={`text-sm font-medium ${priceStatus.color}`}>
                                {priceStatus.description}
                            </span>
                        </div>

                        {/* Score Circle */}
                        <div className="flex items-center gap-6">
                            <div className="relative w-24 h-24 flex-shrink-0">
                                <svg className="w-full h-full -rotate-90">
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="42"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="8"
                                        className="text-slate-700"
                                    />
                                    <circle
                                        cx="48"
                                        cy="48"
                                        r="42"
                                        fill="none"
                                        stroke="url(#scoreGradient)"
                                        strokeWidth="8"
                                        strokeLinecap="round"
                                        strokeDasharray={`${(analysis.price_score / 100) * 264} 264`}
                                        className="transition-all duration-1000"
                                    />
                                    <defs>
                                        <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#8B5CF6" />
                                            <stop offset="100%" stopColor="#EC4899" />
                                        </linearGradient>
                                    </defs>
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-white">{analysis.price_score}</span>
                                    <span className="text-xs text-gray-400">/100</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-2">
                                <div className={`flex items-center gap-2 p-2 rounded-lg ${priceStatus.bgColor} border ${priceStatus.borderColor}`}>
                                    <span className={priceStatus.color}>{priceStatus.icon}</span>
                                    <span className={`text-sm ${priceStatus.color}`}>{priceStatus.label}</span>
                                </div>
                                <p className="text-xs text-gray-400">
                                    {language === 'th' ? 'ราคาเฉลี่ยตลาด:' : 'Market avg:'}{' '}
                                    <span className="text-white font-medium">฿{formatPrice(analysis.market_price)}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* === FACTORS === */}
                    <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                        <h4 className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-purple-400" />
                            {language === 'th' ? 'ปัจจัยที่พิจารณา' : 'Factors'}
                        </h4>

                        <div className="space-y-2">
                            {analysis.factors.map((factor, i) => (
                                <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-700/50 last:border-0">
                                    <div className="flex items-center gap-2">
                                        {factor.positive ? (
                                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                                        ) : (
                                            <AlertTriangle className="w-4 h-4 text-orange-400" />
                                        )}
                                        <span className="text-sm text-gray-300">{factor.label}</span>
                                    </div>
                                    <span className={`text-sm font-medium ${factor.positive ? 'text-emerald-400' : 'text-orange-400'}`}>
                                        {factor.score > 0 ? '+' : ''}{factor.score}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* === RED FLAGS === */}
                    {analysis.red_flags.length > 0 && (
                        <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
                            <h4 className="text-sm text-red-400 mb-2 flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4" />
                                {language === 'th' ? 'ข้อควรระวัง' : 'Red Flags'}
                            </h4>
                            <ul className="space-y-1">
                                {analysis.red_flags.map((flag, i) => (
                                    <li key={i} className="text-sm text-red-300 flex items-center gap-2">
                                        <span className="w-1 h-1 bg-red-400 rounded-full" />
                                        {flag}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* === SUMMARY === */}
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/20">
                        <div className="flex items-start gap-3">
                            <Lightbulb className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-gray-300">{analysis.summary}</p>
                        </div>
                    </div>

                    {/* === BUYER CHECKLIST === */}
                    <div>
                        <button
                            onClick={() => setShowChecklist(!showChecklist)}
                            className="w-full flex items-center justify-between p-3 bg-slate-800/30 rounded-xl hover:bg-slate-800/50 transition-colors"
                        >
                            <span className="text-sm text-gray-300 flex items-center gap-2">
                                <HelpCircle className="w-4 h-4 text-cyan-400" />
                                {language === 'th' ? `สิ่งที่ควรถาม (${analysis.buyer_checklist.length})` : `Questions to ask (${analysis.buyer_checklist.length})`}
                            </span>
                            {showChecklist ? (
                                <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                        </button>

                        {showChecklist && (
                            <div className="mt-2 p-3 bg-slate-800/30 rounded-xl space-y-2">
                                {analysis.buyer_checklist.map((item, i) => (
                                    <div key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                        <span className="text-cyan-400 mt-0.5">•</span>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* === TIPS === */}
                    <div className="flex flex-wrap gap-2">
                        {analysis.tips.slice(0, 2).map((tip, i) => (
                            <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800/30 rounded-full text-xs text-gray-400">
                                <Shield className="w-3 h-3 text-purple-400" />
                                {tip}
                            </div>
                        ))}
                    </div>

                    {/* === ASK AI === */}
                    <button className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-600/20 to-pink-600/20 hover:from-purple-600/30 hover:to-pink-600/30 rounded-xl border border-purple-500/30 text-purple-300 font-medium transition-all">
                        <MessageCircle className="w-4 h-4" />
                        {language === 'th' ? 'ถาม AI เพิ่มเติม...' : 'Ask AI more...'}
                    </button>
                </div>
            )}
        </div>
    )
}

export default AIInsightsPanelV2

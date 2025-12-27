'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Sparkles, AlertTriangle, CheckCircle, Plus, X, TrendingUp, Star } from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface SmartTitleEnhancerProps {
    title: string
    onChange: (newTitle: string) => void
    categoryId?: number
    subcategoryId?: number
    specs?: Record<string, string>
    language?: 'th' | 'en'
}

interface TitleEnhancer {
    id: string
    label: { th: string, en: string }
    value: string
    category: 'vehicle' | 'mobile' | 'realestate' | 'general'
}

// ============================================
// TITLE ENHANCERS DATABASE
// ============================================
const TITLE_ENHANCERS: TitleEnhancer[] = [
    // Vehicle
    { id: 'seller_self', label: { th: 'ขายเอง', en: 'By Owner' }, value: 'ขายเอง', category: 'vehicle' },
    { id: 'low_mileage', label: { th: 'ไมล์น้อย', en: 'Low Mileage' }, value: 'ไมล์น้อย', category: 'vehicle' },
    { id: 'no_accident', label: { th: 'ไม่เคยชน', en: 'No Accident' }, value: 'ไม่เคยชน', category: 'vehicle' },
    { id: 'no_fall', label: { th: 'ไม่เคยล้ม', en: 'Never Dropped' }, value: 'ไม่เคยล้ม', category: 'vehicle' },
    { id: 'full_tax', label: { th: 'ภาษีเต็ม', en: 'Tax Paid' }, value: 'ภาษีเต็ม', category: 'vehicle' },
    { id: 'first_owner', label: { th: 'มือเดียว', en: 'First Owner' }, value: 'มือเดียว', category: 'vehicle' },
    { id: 'new_tag', label: { th: 'สภาพป้ายแดง', en: 'Like New' }, value: 'สภาพป้ายแดง', category: 'vehicle' },

    // Mobile/Tech
    { id: 'full_box', label: { th: 'ครบกล่อง', en: 'Complete Box' }, value: 'ครบกล่อง', category: 'mobile' },
    { id: 'warranty', label: { th: 'ประกันเหลือ', en: 'Warranty Left' }, value: 'ประกันเหลือ', category: 'mobile' },
    { id: 'battery_good', label: { th: 'แบตดี', en: 'Good Battery' }, value: 'แบตดี 90%+', category: 'mobile' },
    { id: 'no_repair', label: { th: 'ไม่เคยซ่อม', en: 'Never Repaired' }, value: 'ไม่เคยซ่อม', category: 'mobile' },
    { id: 'thai_version', label: { th: 'ศูนย์ไทย', en: 'Thai Version' }, value: 'ศูนย์ไทย', category: 'mobile' },

    // Real Estate
    { id: 'fully_furnished', label: { th: 'ตกแต่งครบ', en: 'Fully Furnished' }, value: 'ตกแต่งครบ', category: 'realestate' },
    { id: 'ready_move', label: { th: 'พร้อมอยู่', en: 'Ready to Move' }, value: 'พร้อมอยู่', category: 'realestate' },
    { id: 'near_bts', label: { th: 'ใกล้ BTS', en: 'Near BTS' }, value: 'ใกล้ BTS', category: 'realestate' },
    { id: 'high_floor', label: { th: 'ชั้นสูง', en: 'High Floor' }, value: 'ชั้นสูง', category: 'realestate' },

    // General
    { id: 'good_cond', label: { th: 'สภาพดี', en: 'Good Condition' }, value: 'สภาพดี', category: 'general' },
    { id: 'like_new', label: { th: 'สภาพดีมาก', en: 'Like New' }, value: 'สภาพดีมาก', category: 'general' },
    { id: 'urgent', label: { th: 'ขายด่วน', en: 'Urgent Sale' }, value: 'ขายด่วน', category: 'general' },
    { id: 'nego', label: { th: 'ต่อรองได้', en: 'Negotiable' }, value: 'ต่อรองได้', category: 'general' },
]

// ============================================
// CONSTANTS
// ============================================
const MAX_TITLE_LENGTH = 100

// ============================================
// TITLE SCORE CALCULATOR
// ============================================
function calculateTitleScore(title: string, categoryId?: number): {
    score: number
    rating: 'poor' | 'fair' | 'good' | 'excellent'
    suggestions: string[]
} {
    const suggestions: string[] = []
    let score = 0

    // Length check (target: 40-80 chars)
    const len = title.length
    if (len >= 40 && len <= 80) {
        score += 30
    } else if (len >= 25 && len < 40) {
        score += 15
        suggestions.push('ชื่อสั้นเกินไป ควรเพิ่มรายละเอียด')
    } else if (len > 80 && len <= 100) {
        score += 20
        suggestions.push('ชื่อยาวเกินไปเล็กน้อย')
    } else if (len < 25) {
        score += 5
        suggestions.push('⚠️ ชื่อสั้นมาก ควรเพิ่มจุดขาย')
    } else {
        score += 10
        suggestions.push('ชื่อยาวเกินไป อาจถูกตัด')
    }

    // Has brand
    const hasBrand = /honda|toyota|iphone|samsung|apple|lg|sony|asus|acer|dell|hp|lenovo/i.test(title)
    if (hasBrand) {
        score += 20
    } else {
        suggestions.push('แนะนำให้ใส่ยี่ห้อ/แบรนด์')
    }

    // Has year or specs
    const hasYear = /20\d{2}|ปี\s?\d{4}/i.test(title)
    const hasSpecs = /\d+\s?(gb|cc|นิ้ว|บาท|กม|km)/i.test(title)
    if (hasYear) score += 15
    if (hasSpecs) score += 15

    // Has selling point
    const hasSellingPoint = /(สภาพดี|มือเดียว|ไมล์น้อย|ครบกล่อง|ขายเอง|ไม่เคยชน|ไม่เคยล้ม)/i.test(title)
    if (hasSellingPoint) {
        score += 20
    } else {
        suggestions.push('เพิ่มจุดขาย เช่น "สภาพดี", "ไมล์น้อย"')
    }

    // Determine rating
    let rating: 'poor' | 'fair' | 'good' | 'excellent' = 'poor'
    if (score >= 80) rating = 'excellent'
    else if (score >= 60) rating = 'good'
    else if (score >= 40) rating = 'fair'

    return { score: Math.min(score, 100), rating, suggestions }
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function SmartTitleEnhancer({
    title,
    onChange,
    categoryId,
    subcategoryId,
    specs,
    language = 'th'
}: SmartTitleEnhancerProps) {
    const [showEnhancers, setShowEnhancers] = useState(false)

    // Determine category type for filtering enhancers
    const categoryType = useMemo(() => {
        if (categoryId === 1) return 'vehicle' // ยานยนต์
        if (categoryId === 2) return 'realestate' // อสังหา
        if (categoryId === 3) return 'mobile' // มือถือ
        if (categoryId === 4) return 'mobile' // คอมพิวเตอร์
        return 'general'
    }, [categoryId])

    // Filter enhancers by category
    const relevantEnhancers = useMemo(() => {
        return TITLE_ENHANCERS.filter(e =>
            e.category === categoryType || e.category === 'general'
        )
    }, [categoryType])

    // Calculate title score
    const titleAnalysis = useMemo(() => {
        return calculateTitleScore(title, categoryId)
    }, [title, categoryId])

    // Add enhancer to title (with length check)
    const addEnhancer = (enhancer: TitleEnhancer) => {
        const newTitle = `${title} ${enhancer.value}`.trim()
        // Only add if within limit
        if (newTitle.length <= MAX_TITLE_LENGTH) {
            onChange(newTitle)
        }
    }

    // Remove enhancer from title
    const removeEnhancer = (enhancer: TitleEnhancer) => {
        // Remove the enhancer value with possible surrounding spaces
        const newTitle = title
            .replace(new RegExp(`\\s*${enhancer.value}\\s*`, 'g'), ' ')
            .replace(/\s+/g, ' ')  // Clean up multiple spaces
            .trim()
        onChange(newTitle)
    }

    // Toggle enhancer - add if not exists, remove if exists
    const toggleEnhancer = (enhancer: TitleEnhancer) => {
        if (title.includes(enhancer.value)) {
            removeEnhancer(enhancer)
        } else {
            // Check if adding would exceed limit
            const potentialLength = title.length + enhancer.value.length + 1
            if (potentialLength <= MAX_TITLE_LENGTH) {
                addEnhancer(enhancer)
            }
        }
    }

    // Check if can add more (for UI indication)
    const canAddMore = title.length < MAX_TITLE_LENGTH - 10

    // Smart title suggestions based on specs
    const smartSuggestions = useMemo(() => {
        if (!specs) return []
        const suggestions: string[] = []

        // Add CC if vehicle
        if (specs.cc && !title.toLowerCase().includes('cc')) {
            suggestions.push(`${specs.cc}`)
        }

        // Add color if not in title
        if (specs.color && !title.includes(specs.color)) {
            suggestions.push(`สี${specs.color}`)
        }

        // Add year if not in title
        if (specs.year && !title.includes(specs.year)) {
            suggestions.push(`ปี ${specs.year}`)
        }

        return suggestions
    }, [specs, title])

    // Colors based on rating
    const ratingColors = {
        poor: 'text-red-400 bg-red-900/30',
        fair: 'text-yellow-400 bg-yellow-900/30',
        good: 'text-green-400 bg-green-900/30',
        excellent: 'text-purple-400 bg-purple-900/30'
    }

    const ratingLabels = {
        poor: { th: 'ต้องปรับปรุง', en: 'Needs Work' },
        fair: { th: 'พอใช้', en: 'Fair' },
        good: { th: 'ดี', en: 'Good' },
        excellent: { th: 'ยอดเยี่ยม', en: 'Excellent' }
    }

    return (
        <div className="space-y-3">
            {/* Title Score Bar */}
            <div className="flex items-center gap-3">
                {/* Progress bar */}
                <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${titleAnalysis.rating === 'excellent' ? 'bg-gradient-to-r from-purple-500 to-pink-500' :
                            titleAnalysis.rating === 'good' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                                titleAnalysis.rating === 'fair' ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                                    'bg-gradient-to-r from-red-500 to-red-600'
                            }`}
                        style={{ width: `${titleAnalysis.score}%` }}
                    />
                </div>

                {/* Score badge */}
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${ratingColors[titleAnalysis.rating]}`}>
                    {titleAnalysis.rating === 'excellent' && <Star className="w-3 h-3 inline mr-1" />}
                    {titleAnalysis.score}% - {ratingLabels[titleAnalysis.rating][language]}
                </div>

                {/* Character count */}
                <span className={`text-xs ${title.length >= 40 && title.length <= 80 ? 'text-green-400' : 'text-yellow-400'}`}>
                    {title.length}/80
                </span>
            </div>

            {/* Suggestions */}
            {titleAnalysis.suggestions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {titleAnalysis.suggestions.map((suggestion, idx) => (
                        <span key={idx} className="text-xs text-yellow-400 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {suggestion}
                        </span>
                    ))}
                </div>
            )}

            {/* Smart Suggestions from Specs */}
            {smartSuggestions.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    <span className="text-xs text-gray-400">💡 เพิ่มได้:</span>
                    {smartSuggestions.map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => onChange(`${title} ${suggestion}`.trim())}
                            className="px-2 py-0.5 text-xs bg-purple-900/50 text-purple-300 
                             rounded-full hover:bg-purple-800/50 transition-colors border border-purple-700/50"
                        >
                            + {suggestion}
                        </button>
                    ))}
                </div>
            )}

            {/* Enhancer Toggle */}
            <button
                onClick={() => setShowEnhancers(!showEnhancers)}
                className="flex items-center gap-2 text-xs text-purple-400 hover:text-purple-300 transition-colors"
            >
                <Sparkles className="w-3 h-3" />
                {language === 'th' ? 'เพิ่มจุดขาย' : 'Add selling points'}
                <TrendingUp className="w-3 h-3" />
            </button>

            {/* Enhancer Pills */}
            {showEnhancers && (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-800/50 rounded-lg border border-gray-700/50 animate-fadeIn">
                    {relevantEnhancers.map((enhancer) => {
                        const isAdded = title.includes(enhancer.value)
                        const wouldExceedLimit = !isAdded && (title.length + enhancer.value.length + 1) > MAX_TITLE_LENGTH

                        return (
                            <button
                                key={enhancer.id}
                                onClick={() => !wouldExceedLimit && toggleEnhancer(enhancer)}
                                disabled={wouldExceedLimit}
                                title={wouldExceedLimit ? 'เกินจำนวนตัวอักษร' : ''}
                                className={`px-3 py-1.5 text-xs rounded-full transition-all flex items-center gap-1.5
                                    ${wouldExceedLimit
                                        ? 'bg-gray-800/30 text-gray-600 border border-gray-700/30 cursor-not-allowed opacity-50'
                                        : isAdded
                                            ? 'bg-green-900/30 text-green-400 border border-green-700/50 hover:bg-red-900/30 hover:text-red-400 hover:border-red-700/50'
                                            : 'bg-gray-700/50 text-gray-300 border border-gray-600/50 hover:bg-purple-900/30 hover:text-purple-300 hover:border-purple-700/50'
                                    }`}
                            >
                                {isAdded ? <X className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
                                {enhancer.label[language]}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

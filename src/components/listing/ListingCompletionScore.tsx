'use client'

/**
 * LISTING COMPLETION SCORE COMPONENT
 * 
 * แสดงคะแนนความสมบูรณ์ของประกาศ + คำแนะนำ
 * - Gamification: Progress bar, badges, percentages
 * - Tips for improving listing quality
 * - Impact statistics
 */

import { motion } from 'framer-motion'
import {
    CheckCircle, AlertCircle, Sparkles, TrendingUp,
    Image, FileText, DollarSign, MapPin, Shield, Package
} from 'lucide-react'

interface CompletionItem {
    id: string
    label: string
    filled: boolean
    weight: number  // How important this field is (1-10)
    tip?: string
}

interface ListingCompletionScoreProps {
    items: CompletionItem[]
    language?: 'th' | 'en'
    showDetails?: boolean
}

export default function ListingCompletionScore({
    items,
    language = 'th',
    showDetails = true
}: ListingCompletionScoreProps) {
    // Calculate weighted score
    const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
    const earnedWeight = items.reduce((sum, item) => item.filled ? sum + item.weight : sum, 0)
    const score = Math.round((earnedWeight / totalWeight) * 100)

    // Get tier based on score
    const tier = getScoreTier(score)

    // Calculate impact
    const impact = getImpactMessage(score, language)

    // Missing important fields
    const missingImportant = items.filter(i => !i.filled && i.weight >= 7)

    return (
        <div className={`rounded-lg border-2 p-4 ${tier.borderColor} ${tier.bgColor}`}>
            {/* Score Header */}
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${tier.iconBg}`}>
                        <span className="text-2xl">{tier.emoji}</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className={`text-2xl font-bold ${tier.textColor}`}>
                                {score}%
                            </span>
                            <span className={`text-sm font-medium ${tier.textColor}`}>
                                {tier.label}
                            </span>
                        </div>
                        <div className="text-xs text-gray-400">
                            {language === 'th' ? 'ความสมบูรณ์ของประกาศ' : 'Listing Completeness'}
                        </div>
                    </div>
                </div>

                {/* Impact Badge */}
                <div className={`px-3 py-1.5 rounded-full text-xs font-medium ${tier.badgeBg} ${tier.textColor}`}>
                    <TrendingUp className="w-3 h-3 inline mr-1" />
                    {impact}
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-3">
                <motion.div
                    className={`h-full ${tier.progressColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                />
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-4 text-xs text-gray-400 mb-3">
                <span className="flex items-center gap-1">
                    <CheckCircle className="w-3 h-3 text-green-400" />
                    {items.filter(i => i.filled).length} {language === 'th' ? 'กรอกแล้ว' : 'filled'}
                </span>
                <span className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                    {items.filter(i => !i.filled).length} {language === 'th' ? 'ยังไม่กรอก' : 'remaining'}
                </span>
            </div>

            {/* Missing Important Fields Warning */}
            {missingImportant.length > 0 && showDetails && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-3">
                    <div className="text-xs font-medium text-amber-300 mb-2">
                        ⚠️ {language === 'th' ? 'ควรกรอกเพิ่ม:' : 'You should add:'}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {missingImportant.slice(0, 3).map((item) => (
                            <span
                                key={item.id}
                                className="px-2 py-1 bg-amber-500/20 rounded text-xs text-amber-200"
                            >
                                {item.label}
                            </span>
                        ))}
                        {missingImportant.length > 3 && (
                            <span className="px-2 py-1 text-xs text-amber-400">
                                +{missingImportant.length - 3} {language === 'th' ? 'อีก' : 'more'}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* Details Toggle */}
            {showDetails && (
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-700/50">
                    {items.slice(0, 6).map((item) => (
                        <div
                            key={item.id}
                            className={`flex items-center gap-1.5 text-xs ${item.filled ? 'text-green-400' : 'text-gray-500'
                                }`}
                        >
                            {item.filled ? (
                                <CheckCircle className="w-3 h-3" />
                            ) : (
                                <div className="w-3 h-3 rounded-full border border-gray-600" />
                            )}
                            <span className="truncate">{item.label}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

// ============================================
// TIER CONFIGURATIONS
// ============================================

interface ScoreTier {
    emoji: string
    label: string
    textColor: string
    borderColor: string
    bgColor: string
    iconBg: string
    badgeBg: string
    progressColor: string
}

function getScoreTier(score: number): ScoreTier {
    if (score >= 90) {
        return {
            emoji: '🏆',
            label: 'Perfect',
            textColor: 'text-emerald-400',
            borderColor: 'border-emerald-500/40',
            bgColor: 'bg-emerald-500/5',
            iconBg: 'bg-emerald-500/20',
            badgeBg: 'bg-emerald-500/20',
            progressColor: 'bg-gradient-to-r from-emerald-500 to-green-400',
        }
    }
    if (score >= 75) {
        return {
            emoji: '🥇',
            label: 'Great',
            textColor: 'text-blue-400',
            borderColor: 'border-blue-500/40',
            bgColor: 'bg-blue-500/5',
            iconBg: 'bg-blue-500/20',
            badgeBg: 'bg-blue-500/20',
            progressColor: 'bg-gradient-to-r from-blue-500 to-cyan-400',
        }
    }
    if (score >= 50) {
        return {
            emoji: '👍',
            label: 'Good',
            textColor: 'text-amber-400',
            borderColor: 'border-amber-500/40',
            bgColor: 'bg-amber-500/5',
            iconBg: 'bg-amber-500/20',
            badgeBg: 'bg-amber-500/20',
            progressColor: 'bg-gradient-to-r from-amber-500 to-yellow-400',
        }
    }
    return {
        emoji: '📝',
        label: 'Needs Work',
        textColor: 'text-gray-400',
        borderColor: 'border-gray-600/40',
        bgColor: 'bg-gray-800/50',
        iconBg: 'bg-gray-700',
        badgeBg: 'bg-gray-700',
        progressColor: 'bg-gray-600',
    }
}

function getImpactMessage(score: number, language: 'th' | 'en'): string {
    if (score >= 90) {
        return language === 'th' ? 'ขายเร็วกว่า 2x 🚀' : '2x faster sales 🚀'
    }
    if (score >= 75) {
        return language === 'th' ? 'ขายเร็วกว่า 1.5x' : '1.5x faster sales'
    }
    if (score >= 50) {
        return language === 'th' ? 'โอกาสขายปกติ' : 'Normal chance'
    }
    return language === 'th' ? 'กรอกเพิ่มเพื่อเพิ่มโอกาส' : 'Add more to improve'
}

// ============================================
// HELPER: Create completion items from form data
// ============================================

export interface FormDataForCompletion {
    photos?: number
    title?: string
    description?: string
    price?: number
    condition?: string
    category?: string
    location?: { province?: string }
    defects?: string[]
    warranty?: string
    batteryHealth?: string
    originalBox?: string
    receipt?: string
    shippingMethods?: string[]
    paymentMethods?: string[]
}

export function createCompletionItems(
    data: FormDataForCompletion,
    language: 'th' | 'en' = 'th'
): CompletionItem[] {
    return [
        {
            id: 'photos',
            label: language === 'th' ? '📷 รูปภาพ' : '📷 Photos',
            filled: (data.photos || 0) >= 3,
            weight: 10,
            tip: language === 'th' ? 'เพิ่มรูปอย่างน้อย 3 รูป' : 'Add at least 3 photos'
        },
        {
            id: 'title',
            label: language === 'th' ? '📝 ชื่อสินค้า' : '📝 Title',
            filled: (data.title?.length || 0) >= 10,
            weight: 9,
        },
        {
            id: 'description',
            label: language === 'th' ? '📋 รายละเอียด' : '📋 Description',
            filled: (data.description?.length || 0) >= 30,
            weight: 8,
        },
        {
            id: 'price',
            label: language === 'th' ? '💰 ราคา' : '💰 Price',
            filled: (data.price || 0) > 0,
            weight: 10,
        },
        {
            id: 'condition',
            label: language === 'th' ? '🔍 สภาพ' : '🔍 Condition',
            filled: !!data.condition,
            weight: 8,
        },
        {
            id: 'category',
            label: language === 'th' ? '📂 หมวดหมู่' : '📂 Category',
            filled: !!data.category,
            weight: 9,
        },
        {
            id: 'location',
            label: language === 'th' ? '📍 ที่อยู่' : '📍 Location',
            filled: !!data.location?.province,
            weight: 7,
        },
        {
            id: 'defects',
            label: language === 'th' ? '⚠️ ตำหนิ' : '⚠️ Defects',
            filled: (data.defects?.length || 0) > 0,
            weight: 7,
        },
        {
            id: 'warranty',
            label: language === 'th' ? '🛡️ ประกัน' : '🛡️ Warranty',
            filled: !!data.warranty,
            weight: 5,
        },
        {
            id: 'originalBox',
            label: language === 'th' ? '📦 กล่อง' : '📦 Box',
            filled: !!data.originalBox,
            weight: 4,
        },
        {
            id: 'shipping',
            label: language === 'th' ? '🚚 การจัดส่ง' : '🚚 Shipping',
            filled: (data.shippingMethods?.length || 0) > 0,
            weight: 6,
        },
        {
            id: 'payment',
            label: language === 'th' ? '💳 การชำระเงิน' : '💳 Payment',
            filled: (data.paymentMethods?.length || 0) > 0,
            weight: 5,
        },
    ]
}

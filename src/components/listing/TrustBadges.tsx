'use client'

/**
 * TRUST BADGES COMPONENT
 * 
 * แสดง Trust Indicators สำหรับผู้ซื้อ:
 * - ✅ มีใบเสร็จ
 * - 📦 มีกล่อง
 * - 🛡️ ประกันเหลือ
 * - 🔋 แบตดี
 * - ✨ ไม่มีตำหนิ
 */

import { motion } from 'framer-motion'
import {
    Check, Shield, Package, Receipt, Battery, Sparkles,
    Award, Verified, Clock, CreditCard, TruckIcon
} from 'lucide-react'

export interface TrustBadge {
    id: string
    label_th: string
    label_en: string
    emoji: string
    color: string  // tailwind color class
    verified?: boolean  // If verified by system
}

interface TrustBadgesProps {
    badges: TrustBadge[]
    language?: 'th' | 'en'
    size?: 'sm' | 'md' | 'lg'
    layout?: 'horizontal' | 'vertical' | 'grid'
}

export default function TrustBadges({
    badges,
    language = 'th',
    size = 'md',
    layout = 'horizontal'
}: TrustBadgesProps) {
    if (badges.length === 0) return null

    const sizeClasses = {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-xs px-2.5 py-1',
        lg: 'text-sm px-3 py-1.5',
    }

    const layoutClasses = {
        horizontal: 'flex flex-wrap gap-2',
        vertical: 'flex flex-col gap-2',
        grid: 'grid grid-cols-2 gap-2',
    }

    return (
        <div className={layoutClasses[layout]}>
            {badges.map((badge, index) => (
                <motion.div
                    key={badge.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className={`
                        inline-flex items-center gap-1.5 rounded-full font-medium
                        ${sizeClasses[size]}
                        ${getColorClasses(badge.color)}
                    `}
                >
                    <span>{badge.emoji}</span>
                    <span>{language === 'th' ? badge.label_th : badge.label_en}</span>
                    {badge.verified && (
                        <Verified className="w-3 h-3 text-blue-400" />
                    )}
                </motion.div>
            ))}
        </div>
    )
}

// Color classes helper
function getColorClasses(color: string): string {
    const colorMap: Record<string, string> = {
        green: 'bg-green-500/20 text-green-300 border border-green-500/30',
        blue: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
        purple: 'bg-purple-500/20 text-purple-300 border border-purple-500/30',
        amber: 'bg-amber-500/20 text-amber-300 border border-amber-500/30',
        cyan: 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30',
        emerald: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
        pink: 'bg-pink-500/20 text-pink-300 border border-pink-500/30',
        gray: 'bg-gray-500/20 text-gray-300 border border-gray-500/30',
    }
    return colorMap[color] || colorMap.gray
}

// ============================================
// HELPER: Generate badges from form data
// ============================================

export interface FormDataForBadges {
    receipt?: string
    originalBox?: string
    warranty?: string
    batteryHealth?: string
    defects?: string[]
    authenticity?: string
    shippingMethods?: string[]
    paymentMethods?: string[]
    negotiable?: string
    usageAge?: string
}

export function generateTrustBadges(
    data: FormDataForBadges,
    language: 'th' | 'en' = 'th'
): TrustBadge[] {
    const badges: TrustBadge[] = []

    // Receipt
    if (data.receipt === 'have_receipt' || data.receipt === 'both') {
        badges.push({
            id: 'receipt',
            label_th: 'มีใบเสร็จ',
            label_en: 'Has Receipt',
            emoji: '🧾',
            color: 'green',
        })
    }

    // Warranty Card
    if (data.receipt === 'have_warranty_card' || data.receipt === 'both') {
        badges.push({
            id: 'warranty_card',
            label_th: 'มีใบรับประกัน',
            label_en: 'Has Warranty Card',
            emoji: '📜',
            color: 'green',
        })
    }

    // Original Box
    if (data.originalBox === 'complete') {
        badges.push({
            id: 'box_complete',
            label_th: 'กล่องครบชุด',
            label_en: 'Complete Box',
            emoji: '📦',
            color: 'blue',
        })
    } else if (data.originalBox === 'box_only') {
        badges.push({
            id: 'box',
            label_th: 'มีกล่อง',
            label_en: 'Has Box',
            emoji: '📦',
            color: 'gray',
        })
    }

    // Warranty
    if (data.warranty === 'more_1y') {
        badges.push({
            id: 'warranty_long',
            label_th: 'ประกัน 1+ ปี',
            label_en: 'Warranty 1+ yr',
            emoji: '🛡️',
            color: 'emerald',
            verified: true,
        })
    } else if (data.warranty === '6_12m') {
        badges.push({
            id: 'warranty',
            label_th: 'ประกันเหลือ',
            label_en: 'Under Warranty',
            emoji: '🛡️',
            color: 'green',
        })
    }

    // Battery Health
    if (data.batteryHealth === '90-100') {
        badges.push({
            id: 'battery_excellent',
            label_th: 'แบต 90%+',
            label_en: 'Battery 90%+',
            emoji: '🔋',
            color: 'emerald',
        })
    } else if (data.batteryHealth === '80-89') {
        badges.push({
            id: 'battery_good',
            label_th: 'แบตดี',
            label_en: 'Good Battery',
            emoji: '🔋',
            color: 'green',
        })
    }

    // No Defects
    if (data.defects?.includes('none') || data.defects?.length === 0) {
        badges.push({
            id: 'no_defects',
            label_th: 'ไม่มีตำหนิ',
            label_en: 'No Defects',
            emoji: '✨',
            color: 'purple',
        })
    }

    // Authenticity (for luxury items)
    if (data.authenticity === 'authentic_verified') {
        badges.push({
            id: 'authentic',
            label_th: 'ของแท้ ✓',
            label_en: 'Authentic ✓',
            emoji: '✅',
            color: 'emerald',
            verified: true,
        })
    } else if (data.authenticity === 'authentic_receipt') {
        badges.push({
            id: 'authentic_receipt',
            label_th: 'มีใบเสร็จช็อป',
            label_en: 'Shop Receipt',
            emoji: '🧾',
            color: 'green',
        })
    }

    // Fast Shipping
    if (data.shippingMethods?.some(m => ['grab', 'lineman'].includes(m))) {
        badges.push({
            id: 'fast_ship',
            label_th: 'ส่งด่วนได้',
            label_en: 'Express Ship',
            emoji: '⚡',
            color: 'amber',
        })
    }

    // COD Available
    if (data.paymentMethods?.includes('cod')) {
        badges.push({
            id: 'cod',
            label_th: 'เก็บปลายทางได้',
            label_en: 'COD Available',
            emoji: '💵',
            color: 'cyan',
        })
    }

    // Negotiable
    if (data.negotiable === 'yes' || data.negotiable === 'offer') {
        badges.push({
            id: 'negotiable',
            label_th: 'ต่อได้',
            label_en: 'Negotiable',
            emoji: '🤝',
            color: 'pink',
        })
    }

    // Like New
    if (data.usageAge === 'new' || data.usageAge === 'less_3m') {
        badges.push({
            id: 'like_new',
            label_th: 'เหมือนใหม่',
            label_en: 'Like New',
            emoji: '🆕',
            color: 'blue',
        })
    }

    return badges
}

// ============================================
// PRESET BADGE DISPLAYS
// ============================================

// For product cards
export function TrustBadgesCompact({ badges, language = 'th' }: { badges: TrustBadge[], language?: 'th' | 'en' }) {
    const topBadges = badges.slice(0, 3)
    const remaining = badges.length - 3

    if (topBadges.length === 0) return null

    return (
        <div className="flex items-center gap-1 flex-wrap">
            {topBadges.map((badge) => (
                <span
                    key={badge.id}
                    className={`inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded ${getColorClasses(badge.color)}`}
                    title={language === 'th' ? badge.label_th : badge.label_en}
                >
                    {badge.emoji}
                </span>
            ))}
            {remaining > 0 && (
                <span className="text-xs text-gray-500">+{remaining}</span>
            )}
        </div>
    )
}

// For listing preview
export function TrustBadgesPreview({ badges, language = 'th' }: { badges: TrustBadge[], language?: 'th' | 'en' }) {
    if (badges.length === 0) {
        return (
            <div className="text-xs text-gray-500 italic">
                {language === 'th' ? 'ยังไม่มีข้อมูลความน่าเชื่อถือ' : 'No trust info yet'}
            </div>
        )
    }

    return (
        <div className="p-3 rounded-lg bg-gray-800/50 border border-gray-700">
            <div className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                <Shield className="w-3 h-3" />
                {language === 'th' ? 'ความน่าเชื่อถือ' : 'Trust Indicators'}
            </div>
            <TrustBadges badges={badges} language={language} size="sm" />
        </div>
    )
}

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Shield, ShieldCheck, ShieldAlert, BadgeCheck, Phone, CreditCard, Wallet, Star, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// ==========================================
// TYPES
// ==========================================

export type TrustLevel = 'unverified' | 'basic' | 'pro' | 'official'
export type BadgeSize = 'xs' | 'sm' | 'md' | 'lg'
export type BadgeVariant = 'badge' | 'inline' | 'full' | 'minimal'

export interface TrustBadgeProps {
    /** Trust level of the seller */
    trustLevel?: TrustLevel
    /** Trust score (0-100) */
    trustScore?: number
    /** Individual verification statuses */
    verifications?: {
        phone?: boolean
        id?: boolean
        bank?: boolean
    }
    /** Visual size */
    size?: BadgeSize
    /** Display variant */
    variant?: BadgeVariant
    /** Show tooltip on hover */
    showTooltip?: boolean
    /** Custom class name */
    className?: string
    /** Is this an official store? */
    isOfficialStore?: boolean
    /** Seller rating */
    rating?: number
    /** Number of reviews */
    reviewCount?: number
}

// ==========================================
// CONSTANTS
// ==========================================

const TRUST_CONFIG = {
    unverified: {
        color: 'gray',
        bgColor: 'bg-gray-100 dark:bg-gray-800',
        textColor: 'text-gray-600 dark:text-gray-400',
        borderColor: 'border-gray-200 dark:border-gray-700',
        icon: ShieldAlert,
        label_th: 'ยังไม่ยืนยัน',
        label_en: 'Unverified'
    },
    basic: {
        color: 'blue',
        bgColor: 'bg-blue-50 dark:bg-blue-900/20',
        textColor: 'text-blue-600 dark:text-blue-400',
        borderColor: 'border-blue-200 dark:border-blue-700',
        icon: Shield,
        label_th: 'ยืนยันแล้ว',
        label_en: 'Verified'
    },
    pro: {
        color: 'purple',
        bgColor: 'bg-purple-50 dark:bg-purple-900/20',
        textColor: 'text-purple-600 dark:text-purple-400',
        borderColor: 'border-purple-200 dark:border-purple-700',
        icon: ShieldCheck,
        label_th: 'ผู้ขายมืออาชีพ',
        label_en: 'Pro Seller'
    },
    official: {
        color: 'emerald',
        bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        borderColor: 'border-emerald-200 dark:border-emerald-700',
        icon: BadgeCheck,
        label_th: 'ร้านค้าทางการ',
        label_en: 'Official Store'
    }
}

const SIZE_CONFIG = {
    xs: {
        badge: 'h-5 px-1.5 text-xs gap-1',
        icon: 'w-3 h-3',
        full: 'p-2'
    },
    sm: {
        badge: 'h-6 px-2 text-xs gap-1.5',
        icon: 'w-3.5 h-3.5',
        full: 'p-3'
    },
    md: {
        badge: 'h-7 px-2.5 text-sm gap-1.5',
        icon: 'w-4 h-4',
        full: 'p-4'
    },
    lg: {
        badge: 'h-8 px-3 text-sm gap-2',
        icon: 'w-5 h-5',
        full: 'p-5'
    }
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function TrustBadge({
    trustLevel = 'unverified',
    trustScore = 50,
    verifications = {},
    size = 'sm',
    variant = 'badge',
    showTooltip = true,
    className = '',
    isOfficialStore = false,
    rating,
    reviewCount
}: TrustBadgeProps) {
    const { language } = useLanguage()

    // Determine effective trust level
    const effectiveLevel = isOfficialStore ? 'official' : trustLevel
    const config = TRUST_CONFIG[effectiveLevel]
    const sizeConfig = SIZE_CONFIG[size]
    const Icon = config.icon

    // Minimal variant - just icon
    if (variant === 'minimal') {
        return (
            <motion.div
                whileHover={{ scale: 1.1 }}
                className={`inline-flex items-center justify-center ${config.textColor} ${className}`}
                title={language === 'th' ? config.label_th : config.label_en}
            >
                <Icon className={sizeConfig.icon} />
            </motion.div>
        )
    }

    // Badge variant - compact pill
    if (variant === 'badge') {
        return (
            <motion.div
                whileHover={{ scale: 1.02 }}
                className={`
                    inline-flex items-center rounded-full font-medium
                    ${config.bgColor} ${config.textColor}
                    ${sizeConfig.badge}
                    ${className}
                `}
                title={showTooltip ? `Trust Score: ${trustScore}/100` : undefined}
            >
                <Icon className={sizeConfig.icon} />
                <span>{language === 'th' ? config.label_th : config.label_en}</span>

                {/* Official badge gets sparkle */}
                {effectiveLevel === 'official' && (
                    <Sparkles className={`${sizeConfig.icon} text-amber-500`} />
                )}
            </motion.div>
        )
    }

    // Inline variant - for product cards
    if (variant === 'inline') {
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    className={`
                        inline-flex items-center rounded-full
                        ${config.bgColor} ${config.textColor}
                        ${sizeConfig.badge}
                    `}
                >
                    <Icon className={sizeConfig.icon} />
                    <span>{language === 'th' ? config.label_th : config.label_en}</span>
                </motion.div>

                {/* Rating */}
                {rating !== undefined && (
                    <div className="flex items-center gap-1 text-sm">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="font-medium text-gray-900 dark:text-white">
                            {rating.toFixed(1)}
                        </span>
                        {reviewCount !== undefined && (
                            <span className="text-gray-400">
                                ({reviewCount})
                            </span>
                        )}
                    </div>
                )}
            </div>
        )
    }

    // Full variant - detailed card
    if (variant === 'full') {
        const verifiedCount = Object.values(verifications).filter(Boolean).length
        const totalVerifications = 3 // phone, id, bank

        return (
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                    rounded-2xl border ${config.borderColor} ${config.bgColor}
                    ${sizeConfig.full}
                    ${className}
                `}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Icon className={`w-5 h-5 ${config.textColor}`} />
                        <span className={`font-bold ${config.textColor}`}>
                            {language === 'th' ? config.label_th : config.label_en}
                        </span>
                    </div>

                    {/* Trust Score */}
                    <div className="text-right">
                        <div className={`text-2xl font-bold ${config.textColor}`}>
                            {trustScore}
                        </div>
                        <div className="text-xs text-gray-500">Trust Score</div>
                    </div>
                </div>

                {/* Verification Checklist */}
                <div className="space-y-2">
                    <VerificationItem
                        icon={Phone}
                        label={language === 'th' ? 'เบอร์โทร' : 'Phone'}
                        verified={verifications.phone || false}
                        size={size}
                    />
                    <VerificationItem
                        icon={CreditCard}
                        label={language === 'th' ? 'บัตรประชาชน' : 'ID Card'}
                        verified={verifications.id || false}
                        size={size}
                    />
                    <VerificationItem
                        icon={Wallet}
                        label={language === 'th' ? 'บัญชีธนาคาร' : 'Bank Account'}
                        verified={verifications.bank || false}
                        size={size}
                    />
                </div>

                {/* Progress */}
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-gray-500">
                            {language === 'th' ? 'ความสมบูรณ์' : 'Completion'}
                        </span>
                        <span className={`font-medium ${config.textColor}`}>
                            {verifiedCount}/{totalVerifications}
                        </span>
                    </div>
                    <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(verifiedCount / totalVerifications) * 100}%` }}
                            className={`h-full rounded-full ${effectiveLevel === 'official' ? 'bg-emerald-500' :
                                    effectiveLevel === 'pro' ? 'bg-purple-500' :
                                        effectiveLevel === 'basic' ? 'bg-blue-500' :
                                            'bg-gray-400'
                                }`}
                        />
                    </div>
                </div>

                {/* Rating if available */}
                {rating !== undefined && (
                    <div className="mt-3 flex items-center gap-2">
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                                <Star
                                    key={star}
                                    className={`w-4 h-4 ${star <= rating
                                            ? 'fill-amber-400 text-amber-400'
                                            : 'fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600'
                                        }`}
                                />
                            ))}
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                            {rating.toFixed(1)}
                        </span>
                        {reviewCount !== undefined && (
                            <span className="text-sm text-gray-400">
                                ({reviewCount} {language === 'th' ? 'รีวิว' : 'reviews'})
                            </span>
                        )}
                    </div>
                )}
            </motion.div>
        )
    }

    return null
}

// ==========================================
// VERIFICATION ITEM SUBCOMPONENT
// ==========================================

interface VerificationItemProps {
    icon: React.ElementType
    label: string
    verified: boolean
    size: BadgeSize
}

function VerificationItem({ icon: Icon, label, verified, size }: VerificationItemProps) {
    const iconSize = SIZE_CONFIG[size].icon

    return (
        <div className="flex items-center gap-2">
            <div className={`
                w-6 h-6 rounded-full flex items-center justify-center
                ${verified
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-gray-100 dark:bg-gray-800'
                }
            `}>
                <Icon className={`${iconSize} ${verified
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-400'
                    }`} />
            </div>
            <span className={`text-sm ${verified
                    ? 'text-gray-900 dark:text-white'
                    : 'text-gray-400 line-through'
                }`}>
                {label}
            </span>
            {verified && (
                <BadgeCheck className="w-4 h-4 text-green-500 ml-auto" />
            )}
        </div>
    )
}

// ==========================================
// QUICK TRUST INDICATOR (For product cards)
// ==========================================

export function QuickTrustIndicator({
    trustScore,
    isVerified = false,
    className = ''
}: {
    trustScore: number
    isVerified?: boolean
    className?: string
}) {
    const getColor = () => {
        if (trustScore >= 80) return 'text-emerald-500'
        if (trustScore >= 60) return 'text-blue-500'
        if (trustScore >= 40) return 'text-amber-500'
        return 'text-gray-400'
    }

    return (
        <div className={`flex items-center gap-1 ${className}`}>
            <Shield className={`w-4 h-4 ${getColor()}`} />
            <span className={`text-xs font-medium ${getColor()}`}>
                {trustScore}
            </span>
            {isVerified && (
                <BadgeCheck className="w-3 h-3 text-blue-500" />
            )}
        </div>
    )
}

// ==========================================
// SELLER TRUST SUMMARY (For seller profiles)
// ==========================================

export function SellerTrustSummary({
    trustLevel,
    trustScore,
    rating,
    reviewCount,
    responseRate,
    memberSince,
    className = ''
}: {
    trustLevel: TrustLevel
    trustScore: number
    rating?: number
    reviewCount?: number
    responseRate?: number
    memberSince?: string
    className?: string
}) {
    const { language } = useLanguage()
    const config = TRUST_CONFIG[trustLevel]
    const Icon = config.icon

    return (
        <div className={`bg-white dark:bg-slate-800 rounded-2xl p-4 border border-gray-200 dark:border-gray-700 ${className}`}>
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgColor}`}>
                    <Icon className={`w-6 h-6 ${config.textColor}`} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">
                        {language === 'th' ? config.label_th : config.label_en}
                    </h3>
                    <p className="text-sm text-gray-500">
                        Trust Score: <span className={`font-bold ${config.textColor}`}>{trustScore}/100</span>
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
                {rating !== undefined && (
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
                        <div className="flex items-center gap-1 mb-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-gray-900 dark:text-white">
                                {rating.toFixed(1)}
                            </span>
                        </div>
                        <p className="text-xs text-gray-500">
                            {reviewCount || 0} {language === 'th' ? 'รีวิว' : 'reviews'}
                        </p>
                    </div>
                )}

                {responseRate !== undefined && (
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3">
                        <div className="font-bold text-gray-900 dark:text-white mb-1">
                            {responseRate}%
                        </div>
                        <p className="text-xs text-gray-500">
                            {language === 'th' ? 'อัตราตอบกลับ' : 'Response Rate'}
                        </p>
                    </div>
                )}

                {memberSince && (
                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl p-3 col-span-2">
                        <p className="text-xs text-gray-500">
                            {language === 'th' ? 'สมาชิกตั้งแต่' : 'Member since'} {memberSince}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

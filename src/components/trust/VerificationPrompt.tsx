'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Shield, X, ChevronRight, Sparkles, CheckCircle,
    Phone, CreditCard, Wallet, Zap, Gift, TrendingUp
} from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'

// ==========================================
// TYPES
// ==========================================

export type PromptType = 'banner' | 'modal' | 'toast' | 'card' | 'floating'
export type PromptUrgency = 'low' | 'medium' | 'high'

export interface VerificationPromptProps {
    /** Current verification status */
    verifications?: {
        phone?: boolean
        id?: boolean
        bank?: boolean
    }
    /** Trust score (0-100) */
    trustScore?: number
    /** Display type */
    type?: PromptType
    /** Urgency level affects styling */
    urgency?: PromptUrgency
    /** Allow user to dismiss */
    dismissible?: boolean
    /** Storage key for dismissal persistence */
    dismissKey?: string
    /** Custom class name */
    className?: string
    /** Callback when user clicks verify */
    onVerifyClick?: () => void
    /** Callback when user dismisses */
    onDismiss?: () => void
}

// ==========================================
// CONSTANTS
// ==========================================

const URGENCY_STYLES = {
    low: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        border: 'border-blue-200 dark:border-blue-800',
        text: 'text-blue-700 dark:text-blue-300',
        button: 'bg-blue-500 hover:bg-blue-600',
        icon: 'text-blue-500'
    },
    medium: {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        border: 'border-amber-200 dark:border-amber-800',
        text: 'text-amber-700 dark:text-amber-300',
        button: 'bg-amber-500 hover:bg-amber-600',
        icon: 'text-amber-500'
    },
    high: {
        bg: 'bg-gradient-to-r from-purple-500 to-pink-500',
        border: 'border-transparent',
        text: 'text-white',
        button: 'bg-white text-purple-600 hover:bg-purple-50',
        icon: 'text-white'
    }
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function VerificationPrompt({
    verifications = {},
    trustScore = 50,
    type = 'banner',
    urgency = 'medium',
    dismissible = true,
    dismissKey = 'verification_prompt_dismissed',
    className = '',
    onVerifyClick,
    onDismiss
}: VerificationPromptProps) {
    const { language } = useLanguage()
    const [dismissed, setDismissed] = useState(false)
    const [mounted, setMounted] = useState(false)

    // Check dismissal from localStorage
    useEffect(() => {
        setMounted(true)
        if (dismissKey) {
            const dismissedUntil = localStorage.getItem(dismissKey)
            if (dismissedUntil) {
                const until = new Date(dismissedUntil)
                if (until > new Date()) {
                    setDismissed(true)
                }
            }
        }
    }, [dismissKey])

    // Calculate missing verifications
    const missingCount = [
        !verifications.phone,
        !verifications.id,
        !verifications.bank
    ].filter(Boolean).length

    // Don't show if all verified or dismissed
    if (missingCount === 0 || dismissed || !mounted) return null

    // Calculate potential gain
    const potentialGain =
        (!verifications.phone ? 15 : 0) +
        (!verifications.id ? 25 : 0) +
        (!verifications.bank ? 15 : 0)

    // Copy
    const t = {
        th: {
            title: 'เพิ่มความน่าเชื่อถือ',
            subtitle: `ยืนยันตัวตนเพื่อรับ +${potentialGain} Trust Score`,
            description: 'ผู้ซื้อเชื่อถือผู้ขายที่ยืนยันตัวตนมากกว่า',
            benefits: [
                'แสดงป้ายยืนยันตัวตน',
                'เพิ่มโอกาสขายได้เร็ว',
                'ปลดล็อคฟีเจอร์พิเศษ'
            ],
            cta: 'ยืนยันเลย',
            later: 'ภายหลัง',
            missing: `เหลือ ${missingCount} ขั้นตอน`
        },
        en: {
            title: 'Increase Your Trust',
            subtitle: `Verify to get +${potentialGain} Trust Score`,
            description: 'Buyers trust verified sellers more',
            benefits: [
                'Display verified badge',
                'Sell faster',
                'Unlock special features'
            ],
            cta: 'Verify Now',
            later: 'Later',
            missing: `${missingCount} step(s) remaining`
        }
    }

    const copy = t[language as 'th' | 'en'] || t.th
    const styles = URGENCY_STYLES[urgency]

    // Handle dismiss
    const handleDismiss = () => {
        setDismissed(true)

        // Persist for 24 hours
        if (dismissKey) {
            const tomorrow = new Date()
            tomorrow.setHours(tomorrow.getHours() + 24)
            localStorage.setItem(dismissKey, tomorrow.toISOString())
        }

        onDismiss?.()
    }

    // Render based on type
    switch (type) {
        case 'banner':
            return (
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className={`relative ${styles.bg} border ${styles.border} rounded-2xl p-4 ${className}`}
                    >
                        {dismissible && (
                            <button
                                onClick={handleDismiss}
                                className="absolute top-3 right-3 p-1 rounded-lg hover:bg-black/10"
                            >
                                <X className={`w-4 h-4 ${styles.text}`} />
                            </button>
                        )}

                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${urgency === 'high' ? 'bg-white/20' : 'bg-white dark:bg-slate-800'}`}>
                                <Shield className={`w-6 h-6 ${styles.icon}`} />
                            </div>

                            <div className="flex-1">
                                <h3 className={`font-bold ${styles.text}`}>{copy.title}</h3>
                                <p className={`text-sm ${urgency === 'high' ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                                    {copy.subtitle}
                                </p>
                            </div>

                            <Link
                                href="/profile/verification"
                                onClick={onVerifyClick}
                                className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors ${styles.button} ${urgency === 'high' ? '' : 'text-white'}`}
                            >
                                {copy.cta}
                            </Link>
                        </div>
                    </motion.div>
                </AnimatePresence>
            )

        case 'card':
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}
                >
                    {/* Gradient Header */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white">
                        <div className="flex items-center gap-3">
                            <Shield className="w-8 h-8" />
                            <div>
                                <h3 className="font-bold">{copy.title}</h3>
                                <p className="text-sm text-white/80">{copy.missing}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        {/* Progress */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-500">Trust Score</span>
                                <span className="font-bold text-purple-600">{trustScore} → {trustScore + potentialGain}</span>
                            </div>
                            <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-500 rounded-full"
                                    style={{ width: `${trustScore}%` }}
                                />
                            </div>
                        </div>

                        {/* Missing Items */}
                        <div className="space-y-2 mb-4">
                            {!verifications.phone && (
                                <MissingItem icon={Phone} label={language === 'th' ? 'ยืนยันเบอร์โทร' : 'Verify Phone'} gain={15} />
                            )}
                            {!verifications.id && (
                                <MissingItem icon={CreditCard} label={language === 'th' ? 'ยืนยันบัตรประชาชน' : 'Verify ID'} gain={25} />
                            )}
                            {!verifications.bank && (
                                <MissingItem icon={Wallet} label={language === 'th' ? 'เพิ่มบัญชีธนาคาร' : 'Add Bank Account'} gain={15} />
                            )}
                        </div>

                        {/* CTA */}
                        <Link
                            href="/profile/verification"
                            onClick={onVerifyClick}
                            className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                        >
                            <Sparkles className="w-4 h-4" />
                            {copy.cta}
                        </Link>

                        {dismissible && (
                            <button
                                onClick={handleDismiss}
                                className="w-full mt-2 text-sm text-gray-400 hover:text-gray-600"
                            >
                                {copy.later}
                            </button>
                        )}
                    </div>
                </motion.div>
            )

        case 'toast':
            return (
                <motion.div
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    className={`fixed bottom-4 right-4 z-50 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 max-w-sm ${className}`}
                >
                    <button
                        onClick={handleDismiss}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                        <X className="w-4 h-4 text-gray-400" />
                    </button>

                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                            <Shield className="w-5 h-5 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-gray-900 dark:text-white text-sm">
                                {copy.title}
                            </h4>
                            <p className="text-xs text-gray-500 mb-2">
                                {copy.subtitle}
                            </p>

                            <Link
                                href="/profile/verification"
                                onClick={onVerifyClick}
                                className="inline-flex items-center gap-1 text-sm font-medium text-purple-600 hover:text-purple-700"
                            >
                                {copy.cta}
                                <ChevronRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            )

        case 'floating':
            return (
                <motion.div
                    initial={{ opacity: 0, scale: 0.8, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8, y: 20 }}
                    className={`fixed bottom-20 right-4 z-40 ${className}`}
                >
                    <Link
                        href="/profile/verification"
                        onClick={onVerifyClick}
                        className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-xl transition-shadow"
                    >
                        <Shield className="w-5 h-5" />
                        <span className="font-bold text-sm">+{potentialGain}</span>
                        <ChevronRight className="w-4 h-4" />
                    </Link>

                    {dismissible && (
                        <button
                            onClick={handleDismiss}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    )}
                </motion.div>
            )

        default:
            return null
    }
}

// ==========================================
// MISSING ITEM SUBCOMPONENT
// ==========================================

function MissingItem({ icon: Icon, label, gain }: { icon: React.ElementType, label: string, gain: number }) {
    return (
        <div className="flex items-center gap-3 p-2 bg-gray-50 dark:bg-slate-700/50 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Icon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{label}</span>
            <span className="text-xs font-medium text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-full">
                +{gain}
            </span>
        </div>
    )
}

// ==========================================
// SELLER DASHBOARD VERIFICATION ALERT
// ==========================================

export function SellerVerificationAlert({
    verifications = {},
    className = ''
}: {
    verifications?: { phone?: boolean; id?: boolean; bank?: boolean }
    className?: string
}) {
    const { language } = useLanguage()

    const allVerified = verifications.phone && verifications.id && verifications.bank
    if (allVerified) return null

    return (
        <div className={`bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 ${className}`}>
            <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-white" />
                </div>

                <div className="flex-1">
                    <h3 className="font-bold text-amber-800 dark:text-amber-200">
                        {language === 'th' ? 'ยืนยันตัวตนเพื่อเริ่มขาย' : 'Verify to Start Selling'}
                    </h3>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">
                        {language === 'th'
                            ? 'กรุณายืนยันตัวตนให้ครบเพื่อเปิดใช้งานฟีเจอร์การขายทั้งหมด'
                            : 'Please complete verification to unlock all selling features'
                        }
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {!verifications.phone && (
                            <StatusChip icon={Phone} label={language === 'th' ? 'เบอร์โทร' : 'Phone'} status="pending" />
                        )}
                        {verifications.phone && (
                            <StatusChip icon={Phone} label={language === 'th' ? 'เบอร์โทร' : 'Phone'} status="done" />
                        )}
                        {!verifications.id && (
                            <StatusChip icon={CreditCard} label="KYC" status="pending" />
                        )}
                        {verifications.id && (
                            <StatusChip icon={CreditCard} label="KYC" status="done" />
                        )}
                        {!verifications.bank && (
                            <StatusChip icon={Wallet} label={language === 'th' ? 'บัญชี' : 'Bank'} status="pending" />
                        )}
                        {verifications.bank && (
                            <StatusChip icon={Wallet} label={language === 'th' ? 'บัญชี' : 'Bank'} status="done" />
                        )}
                    </div>
                </div>

                <Link
                    href="/profile/verification"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-bold text-sm transition-colors flex-shrink-0"
                >
                    {language === 'th' ? 'ยืนยัน' : 'Verify'}
                </Link>
            </div>
        </div>
    )
}

function StatusChip({ icon: Icon, label, status }: { icon: React.ElementType; label: string; status: 'done' | 'pending' }) {
    return (
        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${status === 'done'
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
            }`}>
            <Icon className="w-3 h-3" />
            <span>{label}</span>
            {status === 'done' && <CheckCircle className="w-3 h-3" />}
        </div>
    )
}



// ==========================================
// PROFILE COMPLETION WIDGET
// ==========================================

export function ProfileCompletionWidget({
    verifications = {},
    trustScore = 50,
    className = ''
}: {
    verifications?: { phone?: boolean; id?: boolean; bank?: boolean }
    trustScore?: number
    className?: string
}) {
    const { language } = useLanguage()

    const completed = Object.values(verifications).filter(Boolean).length
    const total = 3
    const percentage = Math.round((completed / total) * 100)

    if (completed === total) {
        return (
            <div className={`bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 text-white ${className}`}>
                <div className="flex items-center gap-3">
                    <CheckCircle className="w-8 h-8" />
                    <div>
                        <h3 className="font-bold">
                            {language === 'th' ? 'ยืนยันตัวตนครบถ้วน!' : 'Fully Verified!'}
                        </h3>
                        <p className="text-sm text-white/80">
                            Trust Score: {trustScore}/100
                        </p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <Link href="/profile/verification" className={`block ${className}`}>
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:border-purple-300 dark:hover:border-purple-700 transition-colors">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-white">
                        {language === 'th' ? 'ความสมบูรณ์โปรไฟล์' : 'Profile Completion'}
                    </h3>
                    <span className="text-sm font-bold text-purple-600">{percentage}%</span>
                </div>

                <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                </div>

                <div className="flex items-center gap-1 text-sm text-gray-500">
                    <TrendingUp className="w-4 h-4 text-purple-500" />
                    <span>
                        {language === 'th'
                            ? `ยืนยันอีก ${total - completed} ข้อ เพื่อเพิ่ม Trust Score`
                            : `Complete ${total - completed} more to boost Trust Score`
                        }
                    </span>
                </div>
            </div>
        </Link>
    )
}

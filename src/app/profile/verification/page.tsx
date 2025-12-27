'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Phone, CreditCard, Wallet, CheckCircle, AlertCircle,
    ChevronRight, Shield, Star, Sparkles, Lock, Zap,
    BadgeCheck, TrendingUp
} from 'lucide-react'
import ProfileLayoutV3 from '@/components/profile/v3/ProfileLayoutV3'
import { PhoneOTPModal, IDVerificationModal, BankAccountModal } from '@/components/verification'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

// ==========================================
// TYPES
// ==========================================

interface VerificationStatus {
    phone_verified: boolean
    id_verified: boolean
    bank_verified: boolean
}

interface VerificationItem {
    id: keyof VerificationStatus
    icon: React.ElementType
    title: string
    description: string
    trustGain: number
    completed: boolean
    color: string
    gradient: string
}

// ==========================================
// DEMO MODE - Set verification status here
// ==========================================

const DEMO_INITIAL_STATUS: VerificationStatus = {
    phone_verified: false,
    id_verified: false,
    bank_verified: false
}

// ==========================================
// COMPONENT
// ==========================================

export default function VerificationPage() {
    const { language } = useLanguage()
    const { user } = useAuth()

    // State
    const [status, setStatus] = useState<VerificationStatus>(DEMO_INITIAL_STATUS)
    const [showPhoneModal, setShowPhoneModal] = useState(false)
    const [showIDModal, setShowIDModal] = useState(false)
    const [showBankModal, setShowBankModal] = useState(false)
    const [currentTrustScore, setCurrentTrustScore] = useState(50)

    // Calculate trust score based on verification status
    useEffect(() => {
        let score = 50 // Base score
        if (status.phone_verified) score += 15
        if (status.id_verified) score += 25
        if (status.bank_verified) score += 15
        setCurrentTrustScore(score)
    }, [status])

    // Copy
    const t = {
        th: {
            title: 'ยืนยันตัวตน',
            subtitle: 'เพิ่มความน่าเชื่อถือของบัญชี',
            trustScore: 'คะแนนความน่าเชื่อถือ',
            maxScore: 'ได้เต็ม',
            benefits: 'สิทธิประโยชน์',
            completeAll: 'ยืนยันครบรับ Badge พิเศษ',
            items: {
                phone: {
                    title: 'ยืนยันเบอร์โทร',
                    description: 'รับ OTP เพื่อยืนยันตัวตน'
                },
                id: {
                    title: 'ยืนยันบัตรประชาชน',
                    description: 'อัปโหลดบัตรและถ่าย Selfie'
                },
                bank: {
                    title: 'ยืนยันบัญชีธนาคาร',
                    description: 'เพิ่มบัญชีรับเงินจากการขาย'
                }
            },
            status: {
                verified: 'ยืนยันแล้ว',
                pending: 'รอยืนยัน',
                start: 'เริ่มยืนยัน'
            },
            trustLevels: {
                low: 'เริ่มต้น',
                medium: 'ปานกลาง',
                high: 'น่าเชื่อถือ',
                veryHigh: 'เชื่อถือได้มาก'
            },
            benefitsList: [
                { icon: Shield, text: 'ป้ายยืนยันตัวตน' },
                { icon: Star, text: 'แสดงในผลการค้นหาด้านหน้า' },
                { icon: Zap, text: 'ถอนเงินได้เร็วขึ้น' },
                { icon: Lock, text: 'ปกป้องบัญชีของคุณ' }
            ]
        },
        en: {
            title: 'Verification',
            subtitle: 'Increase your account trust',
            trustScore: 'Trust Score',
            maxScore: 'Max',
            benefits: 'Benefits',
            completeAll: 'Complete all for special badge',
            items: {
                phone: {
                    title: 'Phone Verification',
                    description: 'Receive OTP to verify identity'
                },
                id: {
                    title: 'ID Verification',
                    description: 'Upload ID and take Selfie'
                },
                bank: {
                    title: 'Bank Verification',
                    description: 'Add bank account for payments'
                }
            },
            status: {
                verified: 'Verified',
                pending: 'Pending',
                start: 'Start'
            },
            trustLevels: {
                low: 'Basic',
                medium: 'Medium',
                high: 'Trusted',
                veryHigh: 'Highly Trusted'
            },
            benefitsList: [
                { icon: Shield, text: 'Verified Badge' },
                { icon: Star, text: 'Priority in search results' },
                { icon: Zap, text: 'Faster withdrawals' },
                { icon: Lock, text: 'Account protection' }
            ]
        }
    }

    const copy = t[language as 'th' | 'en'] || t.th

    // Get trust level label
    const getTrustLevel = () => {
        if (currentTrustScore >= 90) return { label: copy.trustLevels.veryHigh, color: 'text-emerald-500' }
        if (currentTrustScore >= 75) return { label: copy.trustLevels.high, color: 'text-green-500' }
        if (currentTrustScore >= 60) return { label: copy.trustLevels.medium, color: 'text-yellow-500' }
        return { label: copy.trustLevels.low, color: 'text-gray-500' }
    }

    const trustLevel = getTrustLevel()

    // Verification items
    const verificationItems: VerificationItem[] = [
        {
            id: 'phone_verified',
            icon: Phone,
            title: copy.items.phone.title,
            description: copy.items.phone.description,
            trustGain: 15,
            completed: status.phone_verified,
            color: 'purple',
            gradient: 'from-purple-500 to-pink-500'
        },
        {
            id: 'id_verified',
            icon: CreditCard,
            title: copy.items.id.title,
            description: copy.items.id.description,
            trustGain: 25,
            completed: status.id_verified,
            color: 'blue',
            gradient: 'from-blue-500 to-cyan-500'
        },
        {
            id: 'bank_verified',
            icon: Wallet,
            title: copy.items.bank.title,
            description: copy.items.bank.description,
            trustGain: 15,
            completed: status.bank_verified,
            color: 'green',
            gradient: 'from-green-500 to-emerald-500'
        }
    ]

    // Handle verification success
    const handlePhoneSuccess = (phone: string) => {
        console.log('Phone verified:', phone)
        setStatus(prev => ({ ...prev, phone_verified: true }))
        setShowPhoneModal(false)
    }

    const handleIDSuccess = () => {
        console.log('ID verified')
        setStatus(prev => ({ ...prev, id_verified: true }))
        setShowIDModal(false)
    }

    const handleBankSuccess = (account: any) => {
        console.log('Bank verified:', account)
        setStatus(prev => ({ ...prev, bank_verified: true }))
        setShowBankModal(false)
    }

    // Handle item click
    const handleItemClick = (item: VerificationItem) => {
        if (item.completed) return

        switch (item.id) {
            case 'phone_verified':
                setShowPhoneModal(true)
                break
            case 'id_verified':
                setShowIDModal(true)
                break
            case 'bank_verified':
                setShowBankModal(true)
                break
        }
    }

    // Calculate completion
    const completedCount = verificationItems.filter(i => i.completed).length
    const totalItems = verificationItems.length
    const progress = (completedCount / totalItems) * 100
    const allCompleted = completedCount === totalItems

    return (
        <ProfileLayoutV3 title={copy.title}>
            <div className="max-w-2xl mx-auto space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {copy.title}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400">
                        {copy.subtitle}
                    </p>
                </div>

                {/* Trust Score Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white overflow-hidden relative"
                >
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                    </div>

                    <div className="relative">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <p className="text-sm text-gray-400">{copy.trustScore}</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-bold">{currentTrustScore}</span>
                                    <span className="text-lg text-gray-400">/ 100</span>
                                </div>
                            </div>
                            <div className={`text-right ${trustLevel.color}`}>
                                <BadgeCheck className="w-12 h-12 ml-auto mb-1" />
                                <span className="text-sm font-medium">{trustLevel.label}</span>
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="h-3 bg-white/20 rounded-full overflow-hidden mb-2">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${currentTrustScore}%` }}
                                transition={{ duration: 1, ease: 'easeOut' }}
                                className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-emerald-500"
                            />
                        </div>

                        <div className="flex justify-between text-xs text-gray-400">
                            <span>50 {language === 'th' ? 'คะแนนเริ่มต้น' : 'Base'}</span>
                            <span>{copy.maxScore} 105</span>
                        </div>
                    </div>
                </motion.div>

                {/* Verification Items */}
                <div className="space-y-4">
                    {verificationItems.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <motion.button
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleItemClick(item)}
                                disabled={item.completed}
                                className={`w-full p-5 rounded-2xl border-2 transition-all text-left ${item.completed
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md bg-white dark:bg-slate-800'
                                    }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.completed
                                            ? 'bg-green-500'
                                            : `bg-gradient-to-br ${item.gradient}`
                                        }`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>

                                    <div className="flex-1">
                                        <h3 className={`font-bold text-lg mb-0.5 ${item.completed
                                                ? 'text-green-700 dark:text-green-300'
                                                : 'text-gray-900 dark:text-white'
                                            }`}>
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                            {item.description}
                                        </p>
                                        <div className="flex items-center gap-1 text-xs">
                                            <TrendingUp className="w-3 h-3" />
                                            <span className={item.completed ? 'text-green-600' : 'text-purple-500'}>
                                                +{item.trustGain} Trust Score
                                            </span>
                                        </div>
                                    </div>

                                    {item.completed ? (
                                        <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                                            <CheckCircle className="w-6 h-6" />
                                            <span className="text-sm font-medium">{copy.status.verified}</span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2 text-purple-500">
                                            <span className="text-sm font-medium">{copy.status.start}</span>
                                            <ChevronRight className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                            </motion.button>
                        )
                    })}
                </div>

                {/* All Completed Badge */}
                {allCompleted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-gradient-to-r from-amber-100 to-yellow-100 dark:from-amber-900/30 dark:to-yellow-900/30 border border-amber-300 dark:border-amber-700 rounded-2xl p-6 text-center"
                    >
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Sparkles className="w-6 h-6 text-amber-500" />
                            <span className="text-xl font-bold text-amber-700 dark:text-amber-300">
                                🎉 {language === 'th' ? 'ยืนยันตัวตนครบถ้วน!' : 'Fully Verified!'}
                            </span>
                            <Sparkles className="w-6 h-6 text-amber-500" />
                        </div>
                        <p className="text-amber-600 dark:text-amber-400">
                            {language === 'th'
                                ? 'บัญชีของคุณได้รับความน่าเชื่อถือสูงสุดแล้ว'
                                : 'Your account has achieved maximum trust level'
                            }
                        </p>
                    </motion.div>
                )}

                {/* Benefits Section */}
                <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                        {copy.benefits}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {copy.benefitsList.map((benefit, index) => {
                            const Icon = benefit.icon
                            return (
                                <div key={index} className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                                    <Icon className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                    {benefit.text}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Modals */}
            <PhoneOTPModal
                isOpen={showPhoneModal}
                onClose={() => setShowPhoneModal(false)}
                onSuccess={handlePhoneSuccess}
            />

            <IDVerificationModal
                isOpen={showIDModal}
                onClose={() => setShowIDModal(false)}
                onSuccess={handleIDSuccess}
            />

            <BankAccountModal
                isOpen={showBankModal}
                onClose={() => setShowBankModal(false)}
                onSuccess={handleBankSuccess}
            />
        </ProfileLayoutV3>
    )
}

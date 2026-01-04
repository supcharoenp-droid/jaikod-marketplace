'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Circle, ChevronRight, Award, Zap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDisplayName } from '@/hooks/useDisplayName'
import Link from 'next/link'

interface ProfileCompletionWidgetProps {
    className?: string
    compact?: boolean
}

interface CompletionStep {
    id: string
    label: string
    completed: boolean
    link?: string
    points: number
}

export default function ProfileCompletionWidget({ className = '', compact = false }: ProfileCompletionWidgetProps) {
    const { user, storeStatus } = useAuth()
    const { t, language } = useLanguage()
    const { hasCustomName, profile } = useDisplayName()

    // คำนวณขั้นตอนที่เสร็จแล้ว
    const steps: CompletionStep[] = useMemo(() => [
        {
            id: 'shop_name',
            label: language === 'th' ? 'ตั้งชื่อร้าน' : 'Set shop name',
            completed: hasCustomName,
            link: '/seller/settings',
            points: 20
        },
        {
            id: 'avatar',
            label: language === 'th' ? 'อัปโหลดโลโก้ร้าน' : 'Upload shop logo',
            completed: !!(profile?.avatar_url || user?.photoURL),
            link: '/seller/settings',
            points: 15
        },
        {
            id: 'bank_account',
            label: language === 'th' ? 'เพิ่มบัญชีธนาคาร' : 'Add bank account',
            completed: !!storeStatus?.hasBankAccount,
            link: '/seller/settings#payment',
            points: 25
        },
        {
            id: 'first_product',
            label: language === 'th' ? 'ลงประกาศแรก' : 'Create first listing',
            completed: !!storeStatus?.hasProducts,
            link: '/sell',
            points: 30
        },
        {
            id: 'verify_phone',
            label: language === 'th' ? 'ยืนยันเบอร์โทร' : 'Verify phone',
            completed: !!user?.phoneNumber,
            link: '/seller/settings#verification',
            points: 10
        }
    ], [hasCustomName, profile, storeStatus, user, language])

    // คำนวณเปอร์เซ็นต์
    const completionPercentage = useMemo(() => {
        const completedSteps = steps.filter(s => s.completed).length
        return Math.round((completedSteps / steps.length) * 100)
    }, [steps])

    // คำนวณคะแนน
    const totalPoints = useMemo(() => {
        return steps.reduce((sum, step) => sum + (step.completed ? step.points : 0), 0)
    }, [steps])

    const maxPoints = useMemo(() => {
        return steps.reduce((sum, step) => sum + step.points, 0)
    }, [steps])

    // ขั้นตอนถัดไป
    const nextStep = useMemo(() => {
        return steps.find(s => !s.completed)
    }, [steps])

    // Badge level
    const badgeLevel = useMemo(() => {
        if (completionPercentage >= 100) return { name: language === 'th' ? '🏆 ผู้ขายมืออาชีพ' : '🏆 Pro Seller', color: 'from-yellow-500 to-orange-500' }
        if (completionPercentage >= 80) return { name: language === 'th' ? '⭐ ผู้ขายชั้นนำ' : '⭐ Top Seller', color: 'from-purple-500 to-pink-500' }
        if (completionPercentage >= 50) return { name: language === 'th' ? '🚀 ผู้ขายมั่นใจ' : '🚀 Rising Seller', color: 'from-blue-500 to-indigo-500' }
        return { name: language === 'th' ? '🌱 ผู้ขายใหม่' : '🌱 New Seller', color: 'from-green-500 to-emerald-500' }
    }, [completionPercentage, language])

    if (compact) {
        return (
            <div className={`bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800 ${className}`}>
                <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                        {language === 'th' ? 'โปรไฟล์' : 'Profile'}
                    </h3>
                    <span className="text-2xl font-black text-purple-600">{completionPercentage}%</span>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                    />
                </div>

                {nextStep && (
                    <Link href={nextStep.link || '/seller/settings'}
                        className="text-xs text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                    >
                        {language === 'th' ? 'ถัดไป:' : 'Next:'} {nextStep.label}
                        <ChevronRight className="w-3 h-3" />
                    </Link>
                )}
            </div>
        )
    }

    return (
        <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-lg ${className}`}>
            {/* Header */}
            <div className={`bg-gradient-to-r ${badgeLevel.color} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <Award className="w-5 h-5" />
                            {language === 'th' ? 'ความสมบูรณ์โปรไฟล์' : 'Profile Completion'}
                        </h3>
                        <p className="text-white/80 text-sm mt-1">
                            {language === 'th' ? 'เพิ่มความน่าเชื่อถือ สร้างรายได้มากขึ้น' : 'Build trust, earn more'}
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black">{completionPercentage}%</div>
                        <div className="text-white/80 text-xs">{badgeLevel.name}</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${completionPercentage}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-white rounded-full shadow-lg"
                    />
                </div>

                {/* Points */}
                <div className="mt-3 flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4" />
                    <span className="font-semibold">{totalPoints}/{maxPoints} {language === 'th' ? 'คะแนน' : 'points'}</span>
                </div>
            </div>

            {/* Steps */}
            <div className="p-6">
                <div className="space-y-3">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            {step.link ? (
                                <Link
                                    href={step.link}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all ${step.completed
                                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                            : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700'
                                        }`}
                                >
                                    <div className="flex-shrink-0">
                                        {step.completed ? (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-medium ${step.completed ? 'text-green-700 dark:text-green-300 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {step.label}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            +{step.points} {language === 'th' ? 'คะแนน' : 'points'}
                                        </p>
                                    </div>
                                    {!step.completed && <ChevronRight className="w-5 h-5 text-gray-400" />}
                                </Link>
                            ) : (
                                <div className={`flex items-center gap-3 p-3 rounded-xl ${step.completed
                                        ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                                        : 'bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
                                    }`}>
                                    <div className="flex-shrink-0">
                                        {step.completed ? (
                                            <CheckCircle className="w-6 h-6 text-green-500" />
                                        ) : (
                                            <Circle className="w-6 h-6 text-gray-400" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <p className={`font-medium ${step.completed ? 'text-green-700 dark:text-green-300 line-through' : 'text-gray-700 dark:text-gray-300'}`}>
                                            {step.label}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            +{step.points} {language === 'th' ? 'คะแนน' : 'points'}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>

                {/* Reward Message */}
                {completionPercentage >= 100 ? (
                    <div className="mt-6 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 text-center">
                        <p className="text-2xl mb-2">🎉</p>
                        <p className="font-bold text-yellow-900 dark:text-yellow-300">
                            {language === 'th' ? 'ยินดีด้วย! โปรไฟล์สมบูรณ์แล้ว!' : 'Congratulations! Profile Complete!'}
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                            {language === 'th' ? 'คุณพร้อมสำหรับความสำเร็จแล้ว! 🚀' : 'You\'re ready for success! 🚀'}
                        </p>
                    </div>
                ) : nextStep && (
                    <div className="mt-6 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4">
                        <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2">
                            {language === 'th' ? '🎯 ขั้นตอนถัดไป:' : '🎯 Next Step:'}
                        </p>
                        <Link
                            href={nextStep.link || '/seller/settings'}
                            className="text-purple-600 dark:text-purple-400 hover:underline font-medium flex items-center gap-1"
                        >
                            {nextStep.label}
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

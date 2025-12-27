'use client'

import React from 'react'
import Link from 'next/link'
import {
    Store,
    Package,
    MapPin,
    CreditCard,
    CheckCircle,
    ArrowRight,
    Sparkles
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

interface OnboardingStep {
    id: string
    icon: React.ElementType
    title: string
    description: string
    href: string
    completed: boolean
}

interface SellerOnboardingProps {
    shopName?: string
    hasAddress?: boolean
    hasBankAccount?: boolean
    hasProducts?: boolean
    onDismiss?: () => void
}

type Lang = 'th' | 'en'

const T = {
    th: {
        welcomeTitle: 'ยินดีต้อนรับสู่ศูนย์ผู้ขาย! 👋',
        welcomeDesc: 'เริ่มต้นขายของง่ายๆ เพียงทำตามขั้นตอนด้านล่าง',
        step1Title: 'ตั้งค่าร้านค้า',
        step1Desc: 'ใส่ชื่อร้าน โลโก้ และคำอธิบาย',
        step2Title: 'เพิ่มที่อยู่จัดส่ง',
        step2Desc: 'กำหนดที่อยู่สำหรับรับสินค้า',
        step3Title: 'ผูกบัญชีธนาคาร',
        step3Desc: 'เพื่อรับเงินจากการขาย',
        step4Title: 'ลงขายสินค้าแรก',
        step4Desc: 'เริ่มลงประกาศขายได้เลย!',
        startBtn: 'เริ่มต้นเลย',
        completed: 'เสร็จแล้ว',
        progressLabel: 'ความคืบหน้า',
        skipForNow: 'ข้ามไปก่อน',
        aiTip: '💡 Tip: ใช้ AI ช่วยเขียนคำอธิบายสินค้าได้!',
    },
    en: {
        welcomeTitle: 'Welcome to Seller Centre! 👋',
        welcomeDesc: 'Start selling easily by following the steps below',
        step1Title: 'Setup Your Store',
        step1Desc: 'Add shop name, logo and description',
        step2Title: 'Add Shipping Address',
        step2Desc: 'Set pickup address for orders',
        step3Title: 'Link Bank Account',
        step3Desc: 'To receive sales payments',
        step4Title: 'List Your First Product',
        step4Desc: 'Start selling now!',
        startBtn: 'Get Started',
        completed: 'Completed',
        progressLabel: 'Progress',
        skipForNow: 'Skip for now',
        aiTip: '💡 Tip: Use AI to help write product descriptions!',
    }
}

export default function SellerOnboarding({
    shopName,
    hasAddress = false,
    hasBankAccount = false,
    hasProducts = false,
    onDismiss
}: SellerOnboardingProps) {
    const { language } = useLanguage()
    const lang = (language || 'th') as Lang
    const t = T[lang]

    const steps: OnboardingStep[] = [
        {
            id: 'store',
            icon: Store,
            title: t.step1Title,
            description: t.step1Desc,
            href: '/seller/settings',
            completed: !!shopName
        },
        {
            id: 'address',
            icon: MapPin,
            title: t.step2Title,
            description: t.step2Desc,
            href: '/seller/settings#shipping',
            completed: hasAddress
        },
        {
            id: 'bank',
            icon: CreditCard,
            title: t.step3Title,
            description: t.step3Desc,
            href: '/seller/finance',
            completed: hasBankAccount
        },
        {
            id: 'product',
            icon: Package,
            title: t.step4Title,
            description: t.step4Desc,
            href: '/sell',
            completed: hasProducts
        }
    ]

    const completedCount = steps.filter(s => s.completed).length
    const progress = (completedCount / steps.length) * 100

    // If all steps completed, don't show onboarding
    if (completedCount === steps.length) {
        return null
    }

    const nextStep = steps.find(s => !s.completed) || steps[0]

    return (
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden mb-8">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-5 h-5 text-yellow-300" />
                            <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">New Seller</span>
                        </div>
                        <h2 className="text-2xl md:text-3xl font-bold mb-1">{t.welcomeTitle}</h2>
                        <p className="text-indigo-100">{t.welcomeDesc}</p>
                    </div>
                    {onDismiss && (
                        <button
                            onClick={onDismiss}
                            className="text-white/60 hover:text-white text-sm"
                        >
                            {t.skipForNow}
                        </button>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span>{t.progressLabel}</span>
                        <span className="font-bold">{completedCount}/{steps.length}</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-yellow-300 to-green-400 rounded-full transition-all duration-500"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>

                {/* Steps Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {steps.map((step, idx) => (
                        <Link
                            key={step.id}
                            href={step.href}
                            className={`
                                p-4 rounded-xl transition-all
                                ${step.completed
                                    ? 'bg-white/20 cursor-default'
                                    : step.id === nextStep.id
                                        ? 'bg-white text-indigo-900 shadow-lg hover:scale-105'
                                        : 'bg-white/10 hover:bg-white/20'
                                }
                            `}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`
                                    w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                    ${step.completed
                                        ? 'bg-green-400 text-white'
                                        : step.id === nextStep.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white/20 text-white'
                                    }
                                `}>
                                    {step.completed ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        idx + 1
                                    )}
                                </div>
                            </div>
                            <h4 className={`font-bold text-sm mb-1 ${step.id === nextStep.id && !step.completed ? 'text-indigo-900' : ''}`}>
                                {step.title}
                            </h4>
                            <p className={`text-xs ${step.id === nextStep.id && !step.completed ? 'text-indigo-600' : 'text-white/70'}`}>
                                {step.completed ? t.completed : step.description}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* CTA & Tip */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-indigo-100">{t.aiTip}</p>
                    <Link href={nextStep.href}>
                        <Button className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold border-0 px-6">
                            {t.startBtn}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

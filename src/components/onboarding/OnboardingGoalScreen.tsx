'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Package, Store, Building2, ArrowRight, X } from 'lucide-react'
import { SellingGoal, SellerType } from '@/types/onboarding'
import AiMentorBubble from './AiMentorBubble'
import { getMentorMessage } from '@/types/ai-mentor'

interface OnboardingGoalScreenProps {
    language: 'th' | 'en'
    onComplete: (goal: SellingGoal, role: SellerType) => void
    onSkip: () => void
}

const GOAL_OPTIONS = {
    th: [
        {
            goal: 'clear_closet' as SellingGoal,
            role: 'individual' as SellerType,
            icon: Package,
            title: 'ปล่อยของมือสอง',
            subtitle: 'ขายง่าย ไว ไม่ต้องตั้งค่าเยอะ',
            description: 'เหมาะสำหรับคุณที่มีของไม่ได้ใช้อยากขาย ไม่ต้องเปิดร้าน โพสได้เลย',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            goal: 'side_hustle' as SellingGoal,
            role: 'pro' as SellerType,
            icon: Store,
            title: 'ร้านค้ามืออาชีพ',
            subtitle: 'ต้องการเครื่องมือช่วยขาย และสร้างฐานลูกค้า',
            description: 'เหมาะสำหรับคุณที่ต้องการหารายได้เสริม มีร้านค้าเป็นของตัวเอง',
            color: 'from-purple-500 to-pink-500'
        },
        {
            goal: 'business' as SellingGoal,
            role: 'mall' as SellerType,
            icon: Building2,
            title: 'แบรนด์ / ธุรกิจ',
            subtitle: 'ระบบครบ API เชื่อมต่อ ERP',
            description: 'เหมาะสำหรับธุรกิจที่ต้องการขายออนไลน์แบบมืออาชีพ มีระบบจัดการสต็อก',
            color: 'from-orange-500 to-red-500'
        }
    ],
    en: [
        {
            goal: 'clear_closet' as SellingGoal,
            role: 'individual' as SellerType,
            icon: Package,
            title: 'Sell Pre-owned Items',
            subtitle: 'Quick, easy, minimal setup',
            description: 'Perfect for selling unused items. No shop needed, just post and sell.',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            goal: 'side_hustle' as SellingGoal,
            role: 'pro' as SellerType,
            icon: Store,
            title: 'Professional Shop',
            subtitle: 'Need growth tools & customer base',
            description: 'Ideal for side income. Create your own shop with advanced tools.',
            color: 'from-purple-500 to-pink-500'
        },
        {
            goal: 'business' as SellingGoal,
            role: 'mall' as SellerType,
            icon: Building2,
            title: 'Brand / Business',
            subtitle: 'Full system with API & ERP',
            description: 'For serious businesses. Professional inventory and team management.',
            color: 'from-orange-500 to-red-500'
        }
    ]
}

export default function OnboardingGoalScreen({ language, onComplete, onSkip }: OnboardingGoalScreenProps) {
    const [selectedGoal, setSelectedGoal] = useState<{ goal: SellingGoal; role: SellerType } | null>(null)
    const options = GOAL_OPTIONS[language]

    const copy = {
        th: {
            title: 'อยากขายแบบไหน?',
            subtitle: 'เลือกให้ตรงจุดประสงค์ เพื่อให้เราปรับแต่งเครื่องมือให้คุณ',
            aiHint: '💡 AI จะช่วยแนะนำเครื่องมือที่เหมาะสมตามที่คุณเลือก',
            continue: 'ดำเนินการต่อ',
            skip: 'ข้ามไปก่อน'
        },
        en: {
            title: 'How do you want to sell?',
            subtitle: 'Choose your goal so we can tailor the tools for you',
            aiHint: '💡 AI will recommend the right tools based on your choice',
            continue: 'Continue',
            skip: 'Skip for now'
        }
    }

    const handleSelect = (goal: SellingGoal, role: SellerType) => {
        setSelectedGoal({ goal, role })
    }

    const handleContinue = () => {
        if (selectedGoal) {
            onComplete(selectedGoal.goal, selectedGoal.role)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {copy[language].title}
                            </h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {copy[language].subtitle}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onSkip}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* AI Mentor */}
                <div className="p-6 pt-0">
                    <AiMentorBubble
                        message={getMentorMessage('goal_selection', language)}
                        compact={false}
                    />
                </div>

                {/* Options */}
                <div className="p-6 space-y-4">
                    {options.map((option, index) => {
                        const Icon = option.icon
                        const isSelected = selectedGoal?.goal === option.goal

                        return (
                            <motion.button
                                key={option.goal}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                onClick={() => handleSelect(option.goal, option.role)}
                                className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${isSelected
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-lg scale-[1.02]'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${option.color} flex items-center justify-center flex-shrink-0`}>
                                        <Icon className="w-7 h-7 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                            {option.title}
                                        </h3>
                                        <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-2">
                                            {option.subtitle}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {option.description}
                                        </p>
                                    </div>
                                    {isSelected && (
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center flex-shrink-0"
                                        >
                                            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.button>
                        )
                    })}
                </div>

                {/* AI Hint */}
                <div className="px-6 pb-4">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                        <p className="text-sm text-amber-800 dark:text-amber-200">
                            {copy[language].aiHint}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between">
                    <button
                        onClick={onSkip}
                        className="px-6 py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium transition-colors"
                    >
                        {copy[language].skip}
                    </button>
                    <button
                        onClick={handleContinue}
                        disabled={!selectedGoal}
                        className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${selectedGoal
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-lg hover:scale-105'
                            : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        {copy[language].continue}
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </motion.div>
        </div>
    )
}

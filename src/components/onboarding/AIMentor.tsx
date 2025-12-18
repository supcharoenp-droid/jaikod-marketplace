'use client'

import React from 'react'
import { Sparkles, Lightbulb, TrendingUp, Shield } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

interface AIMentorProps {
    step: number
    onAction?: (action: string) => void
}

export default function AIMentor({ step, onAction }: AIMentorProps) {
    const { t } = useLanguage()

    const getAdvice = (s: number) => {
        switch (s) {
            case 1:
                return {
                    title: 'Brand Identity',
                    text: t('onboarding.step_1_ai_mentor') || "A short, memorable name increases recall by 40%. Want me to generate some catchy names based on your style?",
                    action: 'Generate Names',
                    icon: Sparkles
                }
            case 2:
                return {
                    title: 'Visual Impact',
                    text: t('onboarding.step_2_ai_mentor') || "Logos with simple shapes work best on mobile screens. Shall I draft a minimal logo for you?",
                    action: 'Draft Logo',
                    icon: Lightbulb
                }
            case 3:
                return {
                    title: 'SEO Writing',
                    text: "Include keywords like 'Review' or 'Official' to rank higher. I can write a description that hits all the SEO marks.",
                    action: 'Write for Me',
                    icon: TrendingUp
                }
            case 4:
                return {
                    title: 'Trust & Safety',
                    text: "Verified sellers get 3x more orders. It takes only 2 minutes to upload your ID.",
                    action: null,
                    icon: Shield
                }
            case 5:
                return {
                    title: 'First Product',
                    text: "Listing your first item? Just upload a photo and I'll fill in the details automatically.",
                    action: 'Auto-Fill',
                    icon: Sparkles
                }
            case 6:
                return {
                    title: 'Pricing Strategy',
                    text: "Pricing slightly below average triggers the 'Great Deal' badge. Let's check the market price.",
                    action: 'Check Market',
                    icon: TrendingUp
                }
            case 7:
                return {
                    title: 'Ready for Launch',
                    text: "Everything looks perfect! You are ready to open your shop to the world.",
                    action: null,
                    icon: Rocket
                }
            default:
                return { title: 'AI Assistant', text: "I'm here to help you set up your shop.", action: null, icon: Sparkles }
        }
    }

    const advice = getAdvice(step)
    const Icon = advice.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            key={step}
            className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-100 dark:border-indigo-800 rounded-2xl p-4 flex items-start gap-4 shadow-sm mb-6"
        >
            <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm text-indigo-600 dark:text-indigo-400">
                <Icon className="w-6 h-6" />
            </div>
            <div className="flex-1">
                <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-200 mb-1 flex items-center gap-2">
                    AI Mentor <span className="px-2 py-0.5 bg-indigo-200 dark:bg-indigo-800 text-[10px] rounded-full text-indigo-800 dark:text-indigo-200">Beta</span>
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                    {advice.text}
                </p>
                {advice.action && (
                    <button
                        onClick={() => onAction && onAction(advice.action || '')}
                        className="mt-3 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
                    >
                        <Sparkles className="w-3 h-3" />
                        {advice.action}
                    </button>
                )}
            </div>
        </motion.div>
    )
}

function Rocket(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" /><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" /><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" /></svg>
}

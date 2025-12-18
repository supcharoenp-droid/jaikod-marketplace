'use client'

import React from 'react'
import { Check, Store, Image, FileText, ShieldCheck, Package, Tag, Rocket } from 'lucide-react'
import { STEPS, OnboardingStepId } from '@/app/onboarding/types'
import { useLanguage } from '@/contexts/LanguageContext'

interface ProgressSidebarProps {
    currentStep: OnboardingStepId
    completedSteps: number[]
    onStepClick: (step: OnboardingStepId) => void
}

const ICONS = {
    Store, Image, FileText, ShieldCheck, Package, Tag, Rocket
}

export default function ProgressSidebar({ currentStep, completedSteps, onStepClick }: ProgressSidebarProps) {
    const { t } = useLanguage()

    return (
        <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 sticky top-24">
                <h2 className="font-bold text-slate-800 dark:text-white mb-4 px-2">Setup Checklist</h2>
                <div className="space-y-1">
                    {STEPS.map((step) => {
                        const isCompleted = completedSteps.includes(step.id)
                        const isCurrent = step.id === currentStep
                        const Icon = ICONS[step.icon as keyof typeof ICONS]

                        return (
                            <button
                                key={step.id}
                                onClick={() => onStepClick(step.id as OnboardingStepId)}
                                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-colors ${isCurrent
                                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                                    }`}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isCompleted
                                        ? 'bg-emerald-500 text-white'
                                        : isCurrent
                                            ? 'bg-indigo-200 dark:bg-indigo-800 text-indigo-700 dark:text-indigo-300'
                                            : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                                    }`}>
                                    {isCompleted ? <Check className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                                </div>
                                <span className={isCompleted ? 'text-slate-900 dark:text-slate-200 line-through decoration-slate-300' : ''}>
                                    {t(step.title)}
                                </span>
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

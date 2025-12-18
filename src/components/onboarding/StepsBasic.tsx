'use client'

import React, { useState } from 'react'
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw, Upload, Image as ImageIcon } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { OnboardingData } from '@/app/onboarding/types'

interface StepProps {
    data: OnboardingData
    updateData: (updates: Partial<OnboardingData>) => void
    onNext: () => void
    onSkip: () => void
}

// --- STEP 1: SHOP NAME ---
export function Step1ShopName({ data, updateData, onNext }: StepProps) {
    const { t } = useLanguage()
    const [status, setStatus] = useState<'idle' | 'checking' | 'valid' | 'invalid'>('idle')
    const [msg, setMsg] = useState('')

    const validateName = async (name: string) => {
        if (name.length < 3) return
        setStatus('checking')
        await new Promise(r => setTimeout(r, 600)) // Mock API

        if (['test', 'admin', 'jaikod'].includes(name.toLowerCase())) {
            setStatus('invalid')
            setMsg('This name is taken or reserved.')
        } else {
            setStatus('valid')
            setMsg('Name available!')
        }
    }

    const generateName = async () => {
        setStatus('checking')
        await new Promise(r => setTimeout(r, 800))
        const names = ['RetroHub', 'SiamVintage', 'BangkokCams', 'ThriftTreasure']
        const random = names[Math.floor(Math.random() * names.length)]
        updateData({ shopName: random, shopNameOrigin: 'ai' })
        validateName(random)
    }

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {t('onboarding.step_1_input_label')}
                </label>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={data.shopName}
                        onChange={(e) => {
                            updateData({ shopName: e.target.value, shopNameOrigin: 'manual' })
                            setStatus('idle')
                        }}
                        onBlur={() => validateName(data.shopName)}
                        className={`flex-1 px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${status === 'valid' ? 'border-emerald-500' :
                            status === 'invalid' ? 'border-red-500' :
                                'border-slate-200 dark:border-slate-700'
                            }`}
                        placeholder={t('onboarding.step_1_placeholder')}
                    />
                    <button
                        onClick={generateName}
                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-xl font-bold flex items-center gap-2 hover:shadow-lg hover:scale-105 transition-all"
                    >
                        <Sparkles className="w-4 h-4" />
                        AI
                    </button>
                </div>
                {status === 'checking' && <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><RefreshCw className="w-3 h-3 animate-spin" /> Checking availability...</p>}
                {status === 'valid' && <p className="text-xs text-emerald-600 font-bold mt-1 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> {msg}</p>}
                {status === 'invalid' && <p className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {msg}</p>}
            </div>

            <button
                onClick={onNext}
                disabled={status !== 'valid'}
                className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01] transition-transform"
            >
                {t('common.next')}
            </button>
        </div>
    )
}

// --- STEP 2: LOGO ---
export function Step2Logo({ data, updateData, onNext, onSkip }: StepProps) {
    const { t } = useLanguage()

    const generateLogo = async () => {
        // Mock AI Generation
        const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500']
        const randomColor = colors[Math.floor(Math.random() * colors.length)]
        // We use a simple div placeholder representation for now, or a placeholder URL
        updateData({ logoUrl: `https://ui-avatars.com/api/?name=${data.shopName?.substring(0, 2)}&background=random&color=fff&size=200`, logoStyle: 'minimal' })
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800/50">
                {data.logoUrl ? (
                    <div className="relative group">
                        <img src={data.logoUrl} alt="Logo" className="w-32 h-32 rounded-full shadow-lg object-cover" />
                        <button
                            onClick={generateLogo}
                            className="absolute -bottom-2 -right-2 bg-white dark:bg-slate-700 p-2 rounded-full shadow border hover:scale-110 transition-transform"
                        >
                            <RefreshCw className="w-4 h-4 text-slate-600" />
                        </button>
                    </div>
                ) : (
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto text-indigo-500">
                            <ImageIcon className="w-8 h-8" />
                        </div>
                        <div>
                            <p className="font-bold text-slate-700 dark:text-slate-200">Upload your logo</p>
                            <p className="text-xs text-slate-400">or let AI design one for you</p>
                        </div>
                        <div className="flex gap-2 justify-center">
                            <button className="px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-sm font-bold shadow-sm hover:bg-slate-50">
                                Upload
                            </button>
                            <button
                                onClick={generateLogo}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-bold shadow-sm hover:bg-indigo-700 flex items-center gap-1"
                            >
                                <Sparkles className="w-3 h-3" /> AI Gen
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex gap-3">
                <button onClick={onSkip} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Skip</button>
                <button onClick={onNext} className="flex-[2] py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold hover:scale-[1.01] transition-transform">
                    {t('common.save')}
                </button>
            </div>
        </div>
    )
}

// --- STEP 3: DESCRIPTION ---
export function Step3Description({ data, updateData, onNext, onSkip }: StepProps) {
    const { t } = useLanguage()
    const [isGenerating, setIsGenerating] = useState(false)

    const aiWrite = async () => {
        setIsGenerating(true)
        await new Promise(r => setTimeout(r, 1200))
        const desc = `Welcome to ${data.shopName || 'our shop'}! We specialize in high-quality items curated just for you. With fast shipping and 5-star service, we transform every purchase into a delightful experience.`
        updateData({ description: desc })
        setIsGenerating(false)
    }

    return (
        <div className="space-y-6">
            <div className="relative">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Shop Description
                </label>
                <textarea
                    value={data.description}
                    onChange={(e) => updateData({ description: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 min-h-[120px] focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Tell your customers what makes your shop special..."
                />
                <button
                    onClick={aiWrite}
                    disabled={isGenerating}
                    className="absolute bottom-3 right-3 px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 rounded-lg text-xs font-bold flex items-center gap-1 hover:scale-105 transition-transform"
                >
                    {isGenerating ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                    AI Write
                </button>
            </div>

            <div className="flex gap-3">
                <button onClick={onSkip} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">Skip</button>
                <button
                    onClick={onNext}
                    disabled={!data.description}
                    className="flex-[2] py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl font-bold disabled:opacity-50"
                >
                    Next
                </button>
            </div>
        </div>
    )
}

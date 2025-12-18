'use client'

import React, { useState } from 'react'
import { Sparkles, ShieldCheck, CheckCircle2, TrendingUp, AlertTriangle, Package, DollarSign } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { OnboardingData } from '@/app/onboarding/types'
import Link from 'next/link'

interface StepProps {
    data: OnboardingData
    updateData: (updates: Partial<OnboardingData>) => void
    onNext: () => void
    onSkip: () => void
}

// --- STEP 4: KYC ---
export function Step4KYC({ data, updateData, onNext, onSkip }: StepProps) {
    const [verifying, setVerifying] = useState(false)

    const handleVerify = async (bypass = false) => {
        setVerifying(true)
        await new Promise(r => setTimeout(r, bypass ? 500 : 2000))
        updateData({ kycStatus: 'verified' })
        setVerifying(false)
        onNext()
    }

    if (data.kycStatus === 'verified') {
        return (
            <div className="text-center py-10">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600">
                    <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-emerald-700">Verified!</h3>
                <p className="text-slate-500 mb-6">Your identity has been confirmed.</p>
                <button onClick={onNext} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">Continue</button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="p-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl flex gap-4">
                <ShieldCheck className="w-10 h-10 text-blue-600 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-blue-800 dark:text-blue-200">Identity Verification</h3>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">Required by law for all sellers. Your data is encrypted.</p>
                </div>
            </div>

            <button
                onClick={() => handleVerify(false)}
                disabled={verifying}
                className="w-full py-4 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
                {verifying ? (
                    <span className="animate-spin rounded-full h-6 w-6 border-2 border-slate-400 border-b-transparent"></span>
                ) : (
                    <>
                        <span className="font-bold text-slate-700 dark:text-slate-300">Upload ID Card photo</span>
                        <span className="text-xs text-slate-400">JPG, PNG up to 5MB</span>
                    </>
                )}
            </button>

            <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button onClick={onSkip} className="text-xs text-slate-400 hover:underline">Skip for now</button>
                <div className="flex-1"></div>
                <button onClick={() => handleVerify(true)} className="text-xs text-amber-500 font-bold hover:underline">
                    [DEV] Bypass
                </button>
            </div>
        </div>
    )
}

// --- STEP 5: FIRST PRODUCT ---
export function Step5Product({ data, updateData, onNext, onSkip }: StepProps) {
    const [title, setTitle] = useState(data.firstProduct?.title || '')
    const [price, setPrice] = useState(data.firstProduct?.price?.toString() || '')

    const aiFill = async () => {
        setTitle('Vintage Film Camera Canon AE-1')
        setPrice('4500')
        updateData({
            firstProduct: {
                title: 'Vintage Film Camera Canon AE-1',
                price: 4500,
                image: '/mock-p1.jpg'
            }
        })
    }

    const handleNext = () => {
        updateData({
            firstProduct: {
                title,
                price: parseFloat(price) || 0,
                image: data.firstProduct?.image || ''
            }
        })
        onNext()
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-end">
                <button onClick={aiFill} className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                    <Sparkles className="w-3 h-3" /> AI Auto-Fill (Mock)
                </button>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-bold mb-1">Product Title</label>
                    <input
                        className="w-full px-4 py-2 rounded-xl border dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        placeholder="What are you selling?"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold mb-1">Price (฿)</label>
                    <input
                        type="number"
                        className="w-full px-4 py-2 rounded-xl border dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                        value={price}
                        onChange={e => setPrice(e.target.value)}
                        placeholder="0.00"
                    />
                </div>
            </div>

            <div className="flex gap-3">
                <button onClick={onSkip} className="flex-1 py-3 text-slate-500 font-bold hover:bg-slate-100 rounded-xl">Skip Step</button>
                <button
                    onClick={handleNext}
                    disabled={!title || !price}
                    className="flex-[2] py-3 bg-slate-900 text-white rounded-xl font-bold disabled:opacity-50"
                >
                    Save Product
                </button>
            </div>
        </div>
    )
}

// --- STEP 6: PRICING ---
export function Step6Pricing({ data, updateData, onNext, onSkip }: StepProps) {
    const [analyzing, setAnalyzing] = useState(false)
    const [marketPrice, setMarketPrice] = useState<null | number>(null)

    const analyze = async () => {
        setAnalyzing(true)
        await new Promise(r => setTimeout(r, 1500))
        setMarketPrice(4200) // Mock
        setAnalyzing(false)
    }

    return (
        <div className="space-y-6">
            {!marketPrice ? (
                <div className="text-center py-8 bg-slate-50 dark:bg-slate-800 rounded-2xl">
                    <TrendingUp className="w-12 h-12 mx-auto text-slate-300 mb-4" />
                    <h3 className="font-bold text-lg mb-2">Check Market Price</h3>
                    <p className="text-sm text-slate-500 mb-6 px-8">AI checks prices of similar items sold recently to suggest the best price for fast selling.</p>
                    <button
                        onClick={analyze}
                        disabled={analyzing}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none hover:scale-105 transition-transform"
                    >
                        {analyzing ? 'Analyzing...' : 'Analyze Now'}
                    </button>
                </div>
            ) : (
                <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <span className="text-sm text-slate-500">Market Average</span>
                        <span className="text-2xl font-bold text-slate-800 dark:text-white">฿{marketPrice.toLocaleString()}</span>
                    </div>

                    <div className="space-y-3">
                        <div
                            onClick={() => updateData({ pricingStrategy: 'market' })}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-center justify-between ${data.pricingStrategy === 'market' ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20' : 'border-slate-100 hover:border-slate-300'}`}
                        >
                            <div>
                                <p className="font-bold text-sm">Balanced</p>
                                <p className="text-xs text-slate-500">Fast sell at good price</p>
                            </div>
                            <span className="font-bold text-indigo-600">฿4,200</span>
                        </div>
                        <div
                            onClick={() => updateData({ pricingStrategy: 'budget' })}
                            className={`p-4 rounded-xl border-2 cursor-pointer transition-colors flex items-center justify-between ${data.pricingStrategy === 'budget' ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-100 hover:border-slate-300'}`}
                        >
                            <div>
                                <p className="font-bold text-sm">Quick Sell</p>
                                <p className="text-xs text-slate-500">Sell within 24h</p>
                            </div>
                            <span className="font-bold text-emerald-600">฿3,900</span>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button onClick={onNext} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold">Confirm Strategy</button>
                    </div>
                </div>
            )}
        </div>
    )
}

// --- STEP 7: FINAL ---
export function Step7Final({ onNext }: { onNext: () => void }) {
    return (
        <div className="text-center py-12">
            <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-purple-500/30 animate-pulse">
                <Package className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">You're Ready!</h1>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">Your shop "JaiKod Official" is set up and ready to receive your first order. Good luck!</p>

            <button
                onClick={onNext}
                className="w-full max-w-sm px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold text-lg hover:scale-105 transition-transform shadow-xl"
            >
                🚀 Open Shop Now
            </button>
        </div>
    )
}

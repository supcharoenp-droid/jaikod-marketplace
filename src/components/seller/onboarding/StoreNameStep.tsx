'use client'

import React, { useState } from 'react'
import {
    Sparkles, Search, RefreshCw, Check, AlertCircle,
    Type, Globe, Wand2, ArrowRight
} from 'lucide-react'
import { generateStoreNames, validateStoreName, beautifyStoreName, GeneratedStoreName } from '@/lib/ai-store-generator'

interface StoreNameStepProps {
    onComplete: (name: string, description: string) => void
    initialName?: string
    initialDescription?: string
}

export default function StoreNameStep({ onComplete, initialName = '', initialDescription = '' }: StoreNameStepProps) {
    // Language State
    const [lang, setLang] = useState<'th' | 'en'>('th')

    // Core State
    const [mode, setMode] = useState<'manual' | 'ai'>('ai')
    const [shopName, setShopName] = useState(initialName)
    const [description, setDescription] = useState(initialDescription)

    // Generator State
    const [keywords, setKeywords] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [selectedStyle, setSelectedStyle] = useState<'modern' | 'minimal' | 'premium' | 'fun' | 'friendly'>('modern')
    const [generatedNames, setGeneratedNames] = useState<GeneratedStoreName[]>([])

    // Validation State
    const [isValidating, setIsValidating] = useState(false)
    const [validationResult, setValidationResult] = useState<{ isValid: boolean, error?: string, seoScore?: number } | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    // AI Generation Handler
    const handleGenerate = async () => {
        if (!keywords.trim()) {
            alert(lang === 'th' ? 'กรุณากรอกคำค้นหาก่อน' : 'Please enter keywords first')
            return
        }
        setIsLoading(true)
        try {
            const results = await generateStoreNames({
                keywords,
                category: selectedCategory,
                style: selectedStyle
            })
            setGeneratedNames(results)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    // Manual Validation Handler
    const handleSelectName = async (name: string) => {
        setShopName(name)
        await runValidation(name)
    }

    const runValidation = async (name: string) => {
        if (!name) return
        setIsValidating(true)
        setValidationResult(null)
        try {
            const res = await validateStoreName(name)
            setValidationResult(res)
        } finally {
            setIsValidating(false)
        }
    }

    // Beautify Handler
    const handleBeautify = async () => {
        if (!shopName) return
        setIsLoading(true)
        try {
            const res = await beautifyStoreName(shopName)
            setShopName(res.name)
            await runValidation(res.name)
        } finally {
            setIsLoading(false)
        }
    }

    // Final Submit
    const handleSubmit = () => {
        if (shopName && validationResult?.isValid && description) {
            onComplete(shopName, description)
        }
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {lang === 'th' ? 'ตั้งชื่อร้านของคุณ' : 'Name your shop'}
                        <span className="text-xs px-2 py-0.5 bg-neon-purple/10 text-neon-purple rounded-full">Step 1</span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {lang === 'th' ? 'ชื่อร้านที่ดีช่วยให้ลูกค้าค้นหาคุณเจอง่ายขึ้น' : 'A great name helps customers find you easily'}
                    </p>
                </div>
                <button
                    onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-bold flex items-center gap-2"
                >
                    <Globe className="w-4 h-4" /> {lang.toUpperCase()}
                </button>
            </div>

            {/* Mode Toggle */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <button
                    onClick={() => setMode('ai')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'ai'
                            ? 'bg-white dark:bg-surface-dark shadow text-neon-purple'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <Sparkles className="w-4 h-4" />
                    {lang === 'th' ? 'ให้ AI ช่วยคิด (แนะนำ)' : 'Generate with AI'}
                </button>
                <button
                    onClick={() => setMode('manual')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${mode === 'manual'
                            ? 'bg-white dark:bg-surface-dark shadow text-gray-900 dark:text-white'
                            : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <Type className="w-4 h-4" />
                    {lang === 'th' ? 'ตั้งชื่อเอง' : 'Manual Input'}
                </button>
            </div>

            {/* AI Generator Section */}
            {mode === 'ai' && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{lang === 'th' ? 'คำที่เกี่ยวข้อง / สินค้าที่ขาย' : 'Keywords / Products'}</label>
                            <input
                                type="text"
                                value={keywords}
                                onChange={(e) => setKeywords(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-neon-purple focus:outline-none"
                                placeholder={lang === 'th' ? 'เช่น เสื้อผ้า, ของเล่น, อาหารคลีน' : 'e.g., Fashion, Toys, Healthy Food'}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">{lang === 'th' ? 'สไตล์ร้าน' : 'Shop Style'}</label>
                            <select
                                value={selectedStyle}
                                onChange={(e: any) => setSelectedStyle(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-neon-purple focus:outline-none appearance-none"
                            >
                                <option value="modern">Modern (ทันสมัย)</option>
                                <option value="minimal">Minimal (เรียบง่าย)</option>
                                <option value="premium">Premium (หรูหรา)</option>
                                <option value="fun">Fun (สนุกสนาน)</option>
                                <option value="friendly">Friendly (เป็นกันเอง)</option>
                            </select>
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 transition-all active:scale-[0.98]"
                    >
                        {isLoading ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <Wand2 className="w-5 h-5" />
                        )}
                        {lang === 'th' ? 'เริ่มสร้างชื่อร้าน' : 'Generate Ideas'}
                    </button>

                    {/* Results Grid */}
                    {generatedNames.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 animate-fade-in">
                            {generatedNames.map((item, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelectName(item.name)}
                                    className={`relative p-4 rounded-xl border-2 text-left transition-all group ${shopName === item.name
                                            ? 'border-neon-purple bg-purple-50 dark:bg-purple-900/20'
                                            : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                                        }`}
                                >
                                    <div className="font-bold text-gray-900 dark:text-white group-hover:text-neon-purple transition-colors">
                                        {item.name}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 line-clamp-1">{item.meaning}</div>
                                    {item.score && (
                                        <div className="absolute top-2 right-2 text-[10px] font-bold px-1.5 py-0.5 bg-green-100 text-green-700 rounded-full">
                                            {item.score}
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Manual Logic / Shared Detail Logic */}
            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        {lang === 'th' ? 'ชื่อร้านที่เลือก' : 'Selected Shop Name'}
                        <span className="text-red-500">*</span>
                    </label>
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                value={shopName}
                                onChange={(e) => {
                                    setShopName(e.target.value)
                                    setValidationResult(null) // Reset validation on type
                                }}
                                onBlur={() => runValidation(shopName)}
                                className={`w-full pl-4 pr-10 py-3 rounded-xl border ${validationResult?.isValid === false
                                        ? 'border-red-500 focus:border-red-500'
                                        : validationResult?.isValid === true
                                            ? 'border-green-500 focus:border-green-500'
                                            : 'border-gray-200 dark:border-gray-700 focus:border-neon-purple'
                                    } bg-white dark:bg-gray-800 focus:outline-none transition-all`}
                                placeholder={lang === 'th' ? 'พิมพ์ชื่อร้าน...' : 'Enter shop name...'}
                            />
                            {isValidating && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <RefreshCw className="w-4 h-4 text-gray-400 animate-spin" />
                                </div>
                            )}
                            {!isValidating && validationResult?.isValid && (
                                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                    <Check className="w-4 h-4 text-green-500" />
                                </div>
                            )}
                        </div>

                        {/* Beautify Button (Manual Mode) */}
                        {mode === 'manual' && (
                            <button
                                onClick={handleBeautify}
                                disabled={!shopName || isLoading}
                                className="px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl font-bold text-sm hover:bg-purple-200 transition-colors"
                            >
                                <Sparkles className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    {/* Validation Feedback */}
                    {validationResult?.error && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" /> {validationResult.error}
                        </p>
                    )}
                    {validationResult?.isValid && (
                        <div className="flex items-center gap-4 text-xs">
                            <span className="text-green-600 flex items-center gap-1">
                                <Check className="w-3 h-3" /> {lang === 'th' ? 'ชื่อนี้ใช้ได้' : 'Name Available'}
                            </span>
                            {validationResult.seoScore && (
                                <span className="text-gray-500">
                                    SEO Score: <span className="font-bold text-gray-900 dark:text-white">{validationResult.seoScore}/100</span>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="space-y-2">
                    <label className="block text-sm font-medium">
                        {lang === 'th' ? 'คำอธิบายร้านค้า' : 'Shop Description'}
                        <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple transition-all resize-none"
                        placeholder={lang === 'th' ? 'อธิบายสั้นๆ เกี่ยวกับร้าน...' : 'Brief description...'}
                    />
                </div>

                <div className="pt-4">
                    <button
                        onClick={handleSubmit}
                        disabled={!shopName || !validationResult?.isValid || !description}
                        className="w-full py-3 bg-neon-purple hover:bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {lang === 'th' ? 'บันทึกและไปต่อ' : 'Save & Continue'}
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

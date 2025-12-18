'use client'

import React, { useState } from 'react'
import {
    Sparkles, RefreshCw, Check, ArrowRight, ArrowLeft,
    Globe, Copy, Quote, Edit3
} from 'lucide-react'
import { generateShopDescriptions, beautifyDescription, GeneratedDescription, DescriptionTone } from '@/lib/ai-description-generator'

interface DescriptionStepProps {
    shopName: string
    initialDescriptionTh?: string
    initialDescriptionEn?: string
    onComplete: (descTh: string, descEn: string) => void
    onBack: () => void
}

export default function DescriptionStep({ shopName, initialDescriptionTh = '', initialDescriptionEn = '', onComplete, onBack }: DescriptionStepProps) {
    const [lang, setLang] = useState<'th' | 'en'>('th')

    // Data State
    const [descTh, setDescTh] = useState(initialDescriptionTh)
    const [descEn, setDescEn] = useState(initialDescriptionEn)
    const [keywords, setKeywords] = useState('')

    // AI State
    const [generatedOptions, setGeneratedOptions] = useState<GeneratedDescription[]>([])
    const [isGenerating, setIsGenerating] = useState(false)
    const [isBeautifying, setIsBeautifying] = useState(false)

    // Handlers
    const currentDesc = lang === 'th' ? descTh : descEn
    const setCurrentDesc = (val: string) => lang === 'th' ? setDescTh(val) : setDescEn(val)

    const handleGenerate = async () => {
        if (!keywords.trim()) {
            alert(lang === 'th' ? 'กรุณาระบุคำหลัก' : 'Please enter keywords')
            return
        }
        setIsGenerating(true)
        try {
            // Generate for current language tab
            const results = await generateShopDescriptions({
                shopName,
                keywords
            }, lang)
            setGeneratedOptions(results)
        } catch (error) {
            console.error(error)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSelectOption = (text: string) => {
        setCurrentDesc(text)
    }

    const handleBeautify = async () => {
        if (!currentDesc) return
        setIsBeautifying(true)
        try {
            const refined = await beautifyDescription(currentDesc)
            setCurrentDesc(refined)
        } finally {
            setIsBeautifying(false)
        }
    }

    const handleConfirm = () => {
        // Allow proceeding if at least TH description is present (or both based on requirements)
        // Assuming we want at least one
        if (descTh || descEn) {
            onComplete(descTh, descEn)
        } else {
            alert('Please enter a description')
        }
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {lang === 'th' ? 'คำอธิบายร้านค้า' : 'Shop Description'}
                        <span className="text-xs px-2 py-0.5 bg-neon-purple/10 text-neon-purple rounded-full">Step 3</span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {lang === 'th' ? 'เขียนแนะนำร้านให้น่าเชื่อถือและดึงดูดใจ' : 'Write a trustworthy and attractive shop introduction'}
                    </p>
                </div>

                {/* Language Toggle for Editing */}
                <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                    <button
                        onClick={() => { setLang('th'); setGeneratedOptions([]); }}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${lang === 'th' ? 'bg-white dark:bg-gray-700 shadow text-neon-purple' : 'text-gray-500'}`}
                    >
                        TH
                    </button>
                    <button
                        onClick={() => { setLang('en'); setGeneratedOptions([]); }}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${lang === 'en' ? 'bg-white dark:bg-gray-700 shadow text-neon-purple' : 'text-gray-500'}`}
                    >
                        EN
                    </button>
                </div>
            </div>

            {/* AI Generator Input */}
            <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={keywords}
                        onChange={(e) => setKeywords(e.target.value)}
                        placeholder={lang === 'th' ? 'เช่น เสื้อผ้าแฟชั่น, ส่งฟรี, ของแท้ 100%' : 'e.g. Trendy fashion, Free shipping, 100% Authentic'}
                        className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-neon-purple bg-white dark:bg-gray-800"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating || !keywords}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-800 text-neon-purple font-bold rounded-xl hover:bg-purple-50 transition-colors flex items-center gap-2 shadow-sm"
                    >
                        {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        <span className="hidden sm:inline">{lang === 'th' ? 'ให้ AI เขียน' : 'AI Write'}</span>
                    </button>
                </div>

                {/* AI Suggestions */}
                {generatedOptions.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 animate-fade-in">
                        {generatedOptions.map((opt, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSelectOption(opt.text)}
                                className="text-left p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-neon-purple hover:shadow-md transition-all group"
                            >
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-neon-purple">{opt.tone}</span>
                                    {currentDesc === opt.text && <Check className="w-3 h-3 text-green-500" />}
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">{opt.text}</p>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Editor Area */}
            <div className="space-y-2">
                <div className="flex justify-between items-end">
                    <label className="text-sm font-medium flex items-center gap-2">
                        <Edit3 className="w-4 h-4 text-gray-400" />
                        {lang === 'th' ? 'แก้ไขคำอธิบาย (ภาษาไทย)' : 'Edit Description (English)'}
                    </label>
                    <button
                        onClick={handleBeautify}
                        disabled={!currentDesc || isBeautifying}
                        className="text-xs text-neon-purple hover:underline flex items-center gap-1 disabled:opacity-50"
                    >
                        {isBeautifying ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                        {lang === 'th' ? 'ปรับให้สละสลวย' : 'Beautify'}
                    </button>
                </div>
                <textarea
                    value={currentDesc}
                    onChange={(e) => setCurrentDesc(e.target.value)}
                    rows={6}
                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-neon-purple/50 transition-all resize-y font-sans text-base leading-relaxed"
                    placeholder={lang === 'th' ? 'เขียนเป้าหมายร้าน ความเชี่ยวชาญ หรือสิ่งที่ลูกค้าจะได้รับ...' : 'Write about your shop mission, expertise, or what customers can expect...'}
                />
                <div className="flex justify-between text-xs text-gray-400">
                    <span>{currentDesc.length} chars</span>
                    {currentDesc.length < 50 && <span className="text-orange-500">{lang === 'th' ? 'ควรเขียนอย่างน้อย 50 ตัวอักษร' : 'Should be at least 50 chars'}</span>}
                </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {lang === 'th' ? 'ย้อนกลับ' : 'Back'}
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={!descTh && !descEn} // Require at least one
                    className="flex-1 py-3 bg-neon-purple hover:bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {lang === 'th' ? 'บันทึกคำอธิบาย' : 'Save Description'}
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

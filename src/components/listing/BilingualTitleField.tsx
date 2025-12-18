'use client'

/**
 * BilingualTitleField - Bilingual Title Input with Language Toggle
 * 
 * Features:
 * - Thai / English language tabs
 * - AI-powered content generation
 * - Independent editing per language
 * - Consistency validation
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Languages, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react'

interface BilingualTitleFieldProps {
    values: {
        th: string
        en: string
    }
    onChange: (lang: 'TH' | 'EN', value: string) => void
    onGenerateMissing?: (lang: 'TH' | 'EN') => void
    consistencyScore?: number
    isGenerating?: boolean
    activeLanguage?: 'TH' | 'EN'  // ✅ Added: controlled from parent
}

export default function BilingualTitleField({
    values,
    onChange,
    onGenerateMissing,
    consistencyScore = 100,
    isGenerating = false,
    activeLanguage: controlledLanguage  // ✅ Controlled from parent
}: BilingualTitleFieldProps) {
    const [localLanguage, setLocalLanguage] = useState<'TH' | 'EN'>('TH')
    const activeLanguage = controlledLanguage || localLanguage  // Use controlled if provided

    const currentValue = activeLanguage === 'TH' ? values.th : values.en
    const otherValue = activeLanguage === 'TH' ? values.en : values.th
    const hasOtherLanguage = !!otherValue

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-white">
                    ชื่อสินค้า
                </label>
                <span className="text-red-400">*</span>
            </div>

            {/* Input Field */}
            <input
                type="text"
                value={currentValue}
                onChange={(e) => onChange(activeLanguage, e.target.value)}
                placeholder={
                    activeLanguage === 'TH'
                        ? 'ยี่ห้อ + รุ่น + สเปค + สภาพ'
                        : 'Brand + Model + Specs + Condition'
                }
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border-2 border-gray-700
                         focus:border-purple-500 text-white placeholder-gray-500
                         transition-all outline-none"
            />

            {/* Missing Language Warning */}
            {!hasOtherLanguage && currentValue && (
                <motion.div
                    className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20
                             flex items-start gap-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <div className="text-sm font-medium text-yellow-300 mb-1">
                            {activeLanguage === 'TH'
                                ? '🇬🇧 ยังไม่มีเวอร์ชันภาษาอังกฤษ'
                                : '🇹🇭 ยังไม่มีเวอร์ชันภาษาไทย'}
                        </div>
                        {onGenerateMissing && (
                            <button
                                onClick={() => onGenerateMissing(activeLanguage === 'TH' ? 'EN' : 'TH')}
                                disabled={isGenerating}
                                className="mt-2 px-3 py-1 text-xs rounded-lg
                                         bg-yellow-500/20 hover:bg-yellow-500/30
                                         text-yellow-200 flex items-center gap-1.5
                                         disabled:opacity-50 transition-colors"
                            >
                                <Sparkles className="w-3 h-3" />
                                {isGenerating ? 'กำลังสร้าง...' : 'สร้างด้วย AI'}
                            </button>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Consistency Score */}
            {hasOtherLanguage && consistencyScore < 100 && (
                <motion.div
                    className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20
                             flex items-center gap-2 text-xs"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <AlertTriangle className="w-3 h-3 text-orange-400" />
                    <span className="text-orange-200">
                        ความสอดคล้อง: {consistencyScore}%
                    </span>
                </motion.div>
            )}

            {hasOtherLanguage && consistencyScore === 100 && (
                <motion.div
                    className="flex items-center gap-2 text-xs text-green-400"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <CheckCircle className="w-3 h-3" />
                    <span>ทั้ง 2 ภาษาสอดคล้องกัน</span>
                </motion.div>
            )}

            {/* Character Count */}
            <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{currentValue.length}/100 ตัวอักษร</span>
                {hasOtherLanguage && (
                    <span className="text-gray-500">
                        {activeLanguage === 'TH' ? '🇬🇧' : '🇹🇭'} {otherValue.length} ตัวอักษร
                    </span>
                )}
            </div>
        </div>
    )
}

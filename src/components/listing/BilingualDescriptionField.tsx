'use client'

/**
 * BilingualDescriptionField - Bilingual Description with Language Tabs
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Languages, Sparkles, AlertTriangle } from 'lucide-react'

interface BilingualDescriptionFieldProps {
    values: {
        th: string
        en: string
    }
    onChange: (lang: 'TH' | 'EN', value: string) => void
    onGenerateMissing?: (lang: 'TH' | 'EN') => void
    isGenerating?: boolean
    activeLanguage?: 'TH' | 'EN'  // ✅ Controlled from parent
}

export default function BilingualDescriptionField({
    values,
    onChange,
    onGenerateMissing,
    isGenerating = false,
    activeLanguage: controlledLanguage  // ✅ From parent
}: BilingualDescriptionFieldProps) {
    const [localLanguage, setLocalLanguage] = useState<'TH' | 'EN'>('TH')
    const activeLanguage = controlledLanguage || localLanguage

    const currentValue = activeLanguage === 'TH' ? values.th : values.en
    const otherValue = activeLanguage === 'TH' ? values.en : values.th
    const hasOtherLanguage = !!otherValue

    return (
        <div className="space-y-3">
            {/* Header */}
            <label className="text-sm font-medium text-white">
                รายละเอียด
            </label>

            {/* Textarea */}
            <textarea
                value={currentValue}
                onChange={(e) => onChange(activeLanguage, e.target.value)}
                placeholder={
                    activeLanguage === 'TH'
                        ? 'อธิบายสินค้า สภาพ เหตุผลขาย...'
                        : 'Describe product condition, reason for selling...'
                }
                rows={6}
                className="w-full px-4 py-3 rounded-lg bg-gray-800 border-2 border-gray-700
                         focus:border-purple-500 text-white placeholder-gray-500
                         transition-all outline-none resize-none"
            />

            {/* Missing Language Notification */}
            {!hasOtherLanguage && currentValue && (
                <motion.div
                    className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20
                             flex items-start gap-2"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                >
                    <AlertTriangle className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                        <div className="text-sm text-blue-200 mb-1">
                            {activeLanguage === 'TH'
                                ? '💡 ต้องการสร้างเวอร์ชันภาษาอังกฤษไหม?'
                                : '💡 Generate Thai version?'}
                        </div>
                        {onGenerateMissing && (
                            <button
                                onClick={() => onGenerateMissing(activeLanguage === 'TH' ? 'EN' : 'TH')}
                                disabled={isGenerating}
                                className="mt-2 px-3 py-1 text-xs rounded-lg
                                         bg-blue-500/20 hover:bg-blue-500/30
                                         text-blue-200 flex items-center gap-1.5
                                         disabled:opacity-50 transition-colors"
                            >
                                <Sparkles className="w-3 h-3" />
                                {isGenerating ? 'กำลังสร้าง...' : 'สร้างอัตโนมัติ'}
                            </button>
                        )}
                    </div>
                </motion.div>
            )}

            {/* Character Count */}
            <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{currentValue.length}/1000 ตัวอักษร</span>
                {hasOtherLanguage && (
                    <span className="text-green-400 flex items-center gap-1">
                        ✓ {activeLanguage === 'TH' ? 'English' : 'ไทย'} version ready
                    </span>
                )}
            </div>
        </div>
    )
}

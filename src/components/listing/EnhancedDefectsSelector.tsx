'use client'

/**
 * EnhancedDefectsSelector
 * 
 * Component สำหรับเลือกตำหนิ/ข้อบกพร่องแบบ multiselect chips
 * - ง่ายต่อการกรอก ไม่ต้องพิมพ์เอง
 * - มี emoji ให้เข้าใจง่าย
 * - สามารถเพิ่มรายละเอียดอื่นๆ ได้
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronDown, Sparkles } from 'lucide-react'
import {
    LAPTOP_DEFECT_OPTIONS,
    PHONE_DEFECT_OPTIONS,
    MultiSelectOption
} from '@/lib/enhanced-listing-options'

type ProductType = 'laptop' | 'phone' | 'general'

interface EnhancedDefectsSelectorProps {
    productType?: ProductType
    selectedDefects: string[]
    onChange: (defects: string[]) => void
    otherDefectText?: string
    onOtherTextChange?: (text: string) => void
    language?: 'th' | 'en'
}

export function EnhancedDefectsSelector({
    productType = 'laptop',
    selectedDefects,
    onChange,
    otherDefectText = '',
    onOtherTextChange,
    language = 'th'
}: EnhancedDefectsSelectorProps) {
    const [isExpanded, setIsExpanded] = useState(true)

    // Get options based on product type
    const options = productType === 'phone' ? PHONE_DEFECT_OPTIONS : LAPTOP_DEFECT_OPTIONS

    // Group options by category
    const groupedOptions: Record<string, MultiSelectOption[]> = {}
    options.forEach(option => {
        const category = option.category || 'other'
        if (!groupedOptions[category]) {
            groupedOptions[category] = []
        }
        groupedOptions[category].push(option)
    })

    const toggleDefect = (value: string) => {
        // If selecting "none", clear all others
        if (value === 'none') {
            onChange(['none'])
            return
        }

        // If selecting something else, remove "none"
        let newDefects = selectedDefects.filter(d => d !== 'none')

        if (newDefects.includes(value)) {
            newDefects = newDefects.filter(d => d !== value)
        } else {
            newDefects = [...newDefects, value]
        }

        // If empty, default to "none"
        if (newDefects.length === 0) {
            newDefects = ['none']
        }

        onChange(newDefects)
    }

    const isSelected = (value: string) => selectedDefects.includes(value)
    const hasNoDefects = selectedDefects.includes('none') && selectedDefects.length === 1
    const showOtherInput = selectedDefects.includes('other')

    const categoryLabels: Record<string, { th: string; en: string }> = {
        perfect: { th: '✨ สภาพดี', en: '✨ Perfect' },
        cosmetic: { th: '🔍 รอยภายนอก', en: '🔍 External' },
        screen: { th: '🖥️ หน้าจอ', en: '🖥️ Screen' },
        keyboard: { th: '⌨️ คีย์บอร์ด', en: '⌨️ Keyboard' },
        hardware: { th: '🔧 ฮาร์ดแวร์', en: '🔧 Hardware' },
        battery: { th: '🔋 แบตเตอรี่', en: '🔋 Battery' },
        other: { th: '📝 อื่นๆ', en: '📝 Other' }
    }

    const t = {
        title: language === 'th' ? 'ตำหนิ/ข้อบกพร่อง' : 'Defects',
        selectMultiple: language === 'th' ? '(เลือกได้หลายข้อ)' : '(Select multiple)',
        otherPlaceholder: language === 'th' ? 'ระบุตำหนิอื่นๆ...' : 'Specify other defects...',
        noneSelected: language === 'th' ? '✨ ไม่มีตำหนิ' : '✨ No defects',
    }

    return (
        <div className="space-y-3">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between text-left"
            >
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-300">⚠️ {t.title}</span>
                    <span className="text-xs text-gray-500">{t.selectMultiple}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden space-y-3"
                    >
                        {/* Quick "No Defects" Button */}
                        <motion.button
                            onClick={() => toggleDefect('none')}
                            className={`
                                w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl 
                                border-2 transition-all duration-200
                                ${hasNoDefects
                                    ? 'bg-green-500/20 border-green-400 text-green-300'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                }
                            `}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            {hasNoDefects && <Check className="w-5 h-5" />}
                            <Sparkles className="w-4 h-4" />
                            <span className="font-medium">{t.noneSelected}</span>
                        </motion.button>

                        {/* Grouped Defect Options */}
                        {!hasNoDefects && Object.entries(groupedOptions).map(([category, categoryOptions]) => {
                            if (category === 'perfect') return null // Already shown above

                            return (
                                <div key={category} className="space-y-2">
                                    <div className="text-xs text-gray-500">
                                        {categoryLabels[category]?.[language] || category}
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {categoryOptions.map((option) => {
                                            const selected = isSelected(option.value)
                                            return (
                                                <motion.button
                                                    key={option.value}
                                                    onClick={() => toggleDefect(option.value)}
                                                    className={`
                                                        flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                                                        border transition-all duration-200
                                                        ${selected
                                                            ? 'bg-orange-500/30 border-orange-400 text-orange-200'
                                                            : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                                        }
                                                    `}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                >
                                                    {selected && <Check className="w-3 h-3" />}
                                                    <span>{language === 'th' ? option.label_th : option.label_en}</span>
                                                </motion.button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}

                        {/* Other Defect Text Input */}
                        {showOtherInput && onOtherTextChange && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="pt-2"
                            >
                                <input
                                    type="text"
                                    value={otherDefectText}
                                    onChange={(e) => onOtherTextChange(e.target.value)}
                                    placeholder={t.otherPlaceholder}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50"
                                />
                            </motion.div>
                        )}

                        {/* Summary */}
                        {!hasNoDefects && selectedDefects.length > 0 && (
                            <div className="pt-3 border-t border-white/10">
                                <div className="text-xs text-gray-500 mb-1">
                                    {language === 'th' ? 'รายการที่เลือก:' : 'Selected:'}
                                </div>
                                <div className="text-sm text-orange-300">
                                    {selectedDefects.map((value, i) => {
                                        const option = options.find(o => o.value === value)
                                        if (!option) return null
                                        return (
                                            <span key={value}>
                                                {language === 'th' ? option.label_th : option.label_en}
                                                {i < selectedDefects.length - 1 ? ', ' : ''}
                                            </span>
                                        )
                                    })}
                                    {showOtherInput && otherDefectText && (
                                        <span>, {otherDefectText}</span>
                                    )}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ============================================
// Battery Health Selector
// ============================================
import { BATTERY_HEALTH_OPTIONS } from '@/lib/enhanced-listing-options'

interface BatteryHealthSelectorProps {
    value: string
    onChange: (value: string) => void
    language?: 'th' | 'en'
}

export function BatteryHealthSelector({
    value,
    onChange,
    language = 'th'
}: BatteryHealthSelectorProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
                🔋 {language === 'th' ? 'สุขภาพแบตเตอรี่' : 'Battery Health'}
            </label>
            <div className="space-y-1">
                {BATTERY_HEALTH_OPTIONS.map((option) => {
                    const isSelected = value === option.value
                    return (
                        <motion.button
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            className={`
                                w-full flex items-center justify-between px-4 py-3 rounded-lg
                                border transition-all duration-200 text-left
                                ${isSelected
                                    ? 'bg-green-500/20 border-green-400'
                                    : 'bg-white/5 border-white/10 hover:bg-white/10'
                                }
                            `}
                            whileHover={{ scale: 1.01 }}
                            whileTap={{ scale: 0.99 }}
                        >
                            <div className="flex items-center gap-2">
                                {isSelected && <Check className="w-4 h-4 text-green-400" />}
                                <span className={isSelected ? 'text-green-200' : 'text-gray-300'}>
                                    {option.emoji} {language === 'th' ? option.label_th : option.label_en}
                                </span>
                            </div>
                            {option.description_th && (
                                <span className="text-xs text-gray-500">
                                    {language === 'th' ? option.description_th : option.description_en}
                                </span>
                            )}
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}

// ============================================
// Warranty Selector
// ============================================
import { WARRANTY_OPTIONS } from '@/lib/enhanced-listing-options'

interface WarrantySelectorProps {
    value: string
    onChange: (value: string) => void
    language?: 'th' | 'en'
}

export function WarrantySelector({
    value,
    onChange,
    language = 'th'
}: WarrantySelectorProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">
                📅 {language === 'th' ? 'ประกันเหลือ' : 'Warranty Remaining'}
            </label>
            <div className="grid grid-cols-2 gap-2">
                {WARRANTY_OPTIONS.map((option) => {
                    const isSelected = value === option.value
                    return (
                        <motion.button
                            key={option.value}
                            onClick={() => onChange(option.value)}
                            className={`
                                flex items-center gap-2 px-3 py-2 rounded-lg
                                border transition-all duration-200 text-sm
                                ${isSelected
                                    ? 'bg-blue-500/20 border-blue-400 text-blue-200'
                                    : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10'
                                }
                            `}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSelected && <Check className="w-3 h-3" />}
                            <span>{option.emoji} {language === 'th' ? option.label_th : option.label_en}</span>
                        </motion.button>
                    )
                })}
            </div>
        </div>
    )
}

export default EnhancedDefectsSelector

'use client'

/**
 * SmartTargetAudienceSelector
 * 
 * Component สำหรับเลือกกลุ่มเป้าหมายที่เหมาะกับสินค้า
 * - AI แนะนำตามสเปค
 * - มี context อธิบายว่าทำไมถึงเหมาะ
 * - มีคำเตือนสำหรับกลุ่มที่ไม่เหมาะ
 */

import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, AlertTriangle, Sparkles, ChevronDown, Info, X } from 'lucide-react'
import {
    LAPTOP_TARGET_AUDIENCE,
    LAPTOP_NOT_RECOMMENDED,
    suggestTargetAudience,
    groupTargetAudienceByCategory,
    TargetAudienceOption,
    WarningOverride
} from '@/lib/enhanced-listing-options'

interface ProductSpecs {
    ram?: number
    storage?: number
    hasGpu?: boolean
    cpuGeneration?: number
}

interface SmartTargetAudienceSelectorProps {
    productSpecs: ProductSpecs
    selectedAudiences: string[]
    onChange: (audiences: string[]) => void
    language?: 'th' | 'en'
    categoryId?: number  // 4 = Computer, 3 = Mobile, etc.
}

export function SmartTargetAudienceSelector({
    productSpecs,
    selectedAudiences,
    onChange,
    language = 'th',
    categoryId = 4  // Default to Computer
}: SmartTargetAudienceSelectorProps) {
    const [isExpanded, setIsExpanded] = useState(true)
    const [showTooltip, setShowTooltip] = useState<string | null>(null)

    // AI Suggestions based on specs
    const suggestions = useMemo(() => {
        return suggestTargetAudience(productSpecs, language)
    }, [productSpecs, language])

    // Group by category
    const groupedAudiences = useMemo(() => {
        return groupTargetAudienceByCategory(LAPTOP_TARGET_AUDIENCE, language)
    }, [language])

    const toggleAudience = (id: string) => {
        if (selectedAudiences.includes(id)) {
            onChange(selectedAudiences.filter(a => a !== id))
        } else {
            onChange([...selectedAudiences, id])
        }
    }

    const isRecommended = (id: string) => {
        return suggestions.recommended.some(r => r.id === id)
    }

    const getAudienceById = (id: string) => {
        return LAPTOP_TARGET_AUDIENCE.find(a => a.id === id)
    }

    const t = {
        title: language === 'th' ? '👤 เหมาะสำหรับ' : '👤 Ideal For',
        aiSuggested: language === 'th' ? 'AI แนะนำ' : 'AI Suggested',
        notRecommended: language === 'th' ? '⚠️ ไม่แนะนำสำหรับ' : '⚠️ Not Recommended For',
        selectHint: language === 'th' ? 'กดเลือก/ยกเลิกได้' : 'Click to toggle',
        selectedCount: language === 'th' ? 'เลือกแล้ว' : 'Selected',
    }

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-2">
                    <span className="text-lg">{t.title}</span>
                    {selectedAudiences.length > 0 && (
                        <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">
                            {t.selectedCount}: {selectedAudiences.length}
                        </span>
                    )}
                </div>
                <ChevronDown className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-4">
                            {/* AI Suggestion Banner */}
                            {suggestions.recommended.length > 0 && (
                                <div className="flex items-center gap-2 text-sm text-purple-300 bg-purple-500/10 px-3 py-2 rounded-lg">
                                    <Sparkles className="w-4 h-4" />
                                    <span>{t.aiSuggested} ({suggestions.recommended.length} กลุ่ม)</span>
                                </div>
                            )}

                            {/* Grouped Categories */}
                            {Object.entries(groupedAudiences).map(([category, audiences]) => (
                                <div key={category} className="space-y-2">
                                    <div className="text-sm text-gray-400 font-medium">{category}</div>
                                    <div className="flex flex-wrap gap-2">
                                        {audiences.map((audience) => {
                                            const isSelected = selectedAudiences.includes(audience.id)
                                            const recommended = isRecommended(audience.id)

                                            return (
                                                <div key={audience.id} className="relative">
                                                    <motion.button
                                                        onClick={() => toggleAudience(audience.id)}
                                                        onMouseEnter={() => setShowTooltip(audience.id)}
                                                        onMouseLeave={() => setShowTooltip(null)}
                                                        className={`
                                                            relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm
                                                            transition-all duration-200 border
                                                            ${isSelected
                                                                ? 'bg-purple-500/30 border-purple-400 text-white'
                                                                : recommended
                                                                    ? 'bg-purple-500/10 border-purple-500/30 text-purple-200 hover:bg-purple-500/20'
                                                                    : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                                                            }
                                                        `}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        {recommended && !isSelected && (
                                                            <Sparkles className="w-3 h-3 text-purple-400" />
                                                        )}
                                                        {isSelected && (
                                                            <Check className="w-3 h-3" />
                                                        )}
                                                        <span>{language === 'th' ? audience.label_th : audience.label_en}</span>
                                                    </motion.button>

                                                    {/* Tooltip with context */}
                                                    <AnimatePresence>
                                                        {showTooltip === audience.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 5 }}
                                                                animate={{ opacity: 1, y: 0 }}
                                                                exit={{ opacity: 0, y: 5 }}
                                                                className="absolute z-50 left-0 top-full mt-2 p-3 bg-gray-900 border border-white/10 rounded-lg shadow-xl min-w-[200px]"
                                                            >
                                                                <div className="text-sm font-medium text-white mb-1">
                                                                    {language === 'th' ? audience.label_th : audience.label_en}
                                                                </div>
                                                                <div className="text-xs text-gray-400">
                                                                    {language === 'th' ? audience.description_th : audience.description_en}
                                                                </div>
                                                                {recommended && (
                                                                    <div className="flex items-center gap-1 mt-2 text-xs text-purple-400">
                                                                        <Sparkles className="w-3 h-3" />
                                                                        <span>AI แนะนำ</span>
                                                                    </div>
                                                                )}
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}

                            {/* Not Recommended Section */}
                            {suggestions.notRecommended.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="text-sm text-yellow-400/80 font-medium mb-2 flex items-center gap-1">
                                        <AlertTriangle className="w-4 h-4" />
                                        {t.notRecommended}
                                    </div>
                                    <div className="text-xs text-gray-400 space-y-1">
                                        {suggestions.notRecommended.map((warning) => (
                                            <div key={warning.id}>
                                                {language === 'th' ? warning.warning_th : warning.warning_en}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Selected Summary */}
                            {selectedAudiences.length > 0 && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <div className="text-sm text-gray-400 mb-2">
                                        {language === 'th' ? 'รายละเอียดที่จะแสดง:' : 'Will display as:'}
                                    </div>
                                    <div className="text-sm text-white bg-white/5 rounded-lg p-3">
                                        <span className="text-gray-400">👤 เหมาะสำหรับ: </span>
                                        {selectedAudiences.map((id, i) => {
                                            const audience = getAudienceById(id)
                                            if (!audience) return null
                                            return (
                                                <span key={id}>
                                                    {language === 'th' ? audience.label_th : audience.label_en}
                                                    {i < selectedAudiences.length - 1 ? ', ' : ''}
                                                </span>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ============================================
// Compact version for display in preview
// ============================================
interface TargetAudienceDisplayProps {
    selectedAudiences: string[]
    productSpecs?: ProductSpecs
    language?: 'th' | 'en'
    showContext?: boolean  // Show description tooltips
}

export function TargetAudienceDisplay({
    selectedAudiences,
    productSpecs,
    language = 'th',
    showContext = true
}: TargetAudienceDisplayProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null)

    const getAudienceById = (id: string) => {
        return LAPTOP_TARGET_AUDIENCE.find(a => a.id === id)
    }

    // Get not recommended if specs provided
    const suggestions = useMemo(() => {
        if (!productSpecs) return null
        return suggestTargetAudience(productSpecs, language)
    }, [productSpecs, language])

    if (selectedAudiences.length === 0) return null

    return (
        <div className="space-y-3">
            {/* Suitable For */}
            <div>
                <div className="text-sm text-gray-400 mb-2">
                    {language === 'th' ? '👤 เหมาะสำหรับ:' : '👤 Ideal For:'}
                </div>
                <div className="flex flex-wrap gap-2">
                    {selectedAudiences.map((id) => {
                        const audience = getAudienceById(id)
                        if (!audience) return null

                        return (
                            <div
                                key={id}
                                className="relative"
                            >
                                <button
                                    onClick={() => showContext && setExpandedId(expandedId === id ? null : id)}
                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-500/20 border border-purple-400/30 rounded-full text-sm text-purple-200 hover:bg-purple-500/30 transition-colors"
                                >
                                    <span>{language === 'th' ? audience.label_th : audience.label_en}</span>
                                    {showContext && (
                                        <Info className="w-3 h-3 text-purple-400" />
                                    )}
                                </button>

                                {/* Context Popup */}
                                {showContext && expandedId === id && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="absolute z-50 left-0 top-full mt-2 p-3 bg-gray-900 border border-white/10 rounded-lg shadow-xl min-w-[220px]"
                                    >
                                        <button
                                            onClick={() => setExpandedId(null)}
                                            className="absolute top-2 right-2 text-gray-400 hover:text-white"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                        <div className="text-sm font-medium text-white mb-1">
                                            {language === 'th' ? audience.label_th : audience.label_en}
                                        </div>
                                        <div className="text-xs text-gray-400 leading-relaxed">
                                            └─ {language === 'th' ? audience.description_th : audience.description_en}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Not Recommended Warning (if applicable) */}
            {suggestions && suggestions.notRecommended.length > 0 && (
                <div className="pt-2 border-t border-white/10">
                    <div className="text-sm text-yellow-400/80 mb-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>{language === 'th' ? 'ไม่แนะนำสำหรับ:' : 'Not recommended for:'}</span>
                    </div>
                    <div className="text-xs text-gray-400 space-y-0.5 pl-5">
                        {suggestions.notRecommended.map((warning) => (
                            <div key={warning.id}>
                                └─ {language === 'th' ? warning.warning_th : warning.warning_en}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SmartTargetAudienceSelector

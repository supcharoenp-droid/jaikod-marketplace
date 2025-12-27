'use client'

/**
 * QUICK FILL TEMPLATES COMPONENT
 * 
 * ให้ผู้ขายเลือก template สำเร็จรูปเพื่อเติมข้อมูลอัตโนมัติ
 * - เหมือนใหม่ ครบชุด
 * - สภาพดี ใช้งานปกติ
 * - ของใหม่ ยังไม่แกะ
 * - ราคาประหยัด
 */

import { motion } from 'framer-motion'
import { Zap, Check } from 'lucide-react'
import { QUICK_FILL_TEMPLATES, type QuickFillTemplate } from '@/lib/enhanced-listing-options'

interface QuickFillTemplatesProps {
    onSelect: (template: QuickFillTemplate) => void
    selectedId?: string
    language?: 'th' | 'en'
}

export default function QuickFillTemplates({
    onSelect,
    selectedId,
    language = 'th'
}: QuickFillTemplatesProps) {
    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-sm font-medium text-amber-300">
                    {language === 'th' ? '⚡ เติมด่วน (กดเลือก 1 คลิก)' : '⚡ Quick Fill (1-click)'}
                </span>
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-2 gap-2">
                {QUICK_FILL_TEMPLATES.map((template) => {
                    const isSelected = selectedId === template.id
                    const label = language === 'th' ? template.label_th : template.label_en

                    return (
                        <motion.button
                            key={template.id}
                            type="button"
                            onClick={() => onSelect(template)}
                            className={`relative p-3 rounded-lg border-2 text-left transition-all ${isSelected
                                    ? 'border-amber-500 bg-amber-500/20'
                                    : 'border-gray-700 bg-gray-800/50 hover:border-amber-500/50 hover:bg-gray-800'
                                }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {/* Selected Indicator */}
                            {isSelected && (
                                <div className="absolute top-2 right-2">
                                    <Check className="w-4 h-4 text-amber-400" />
                                </div>
                            )}

                            {/* Content */}
                            <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-lg">{template.emoji}</span>
                                    <span className={`text-sm font-medium ${isSelected ? 'text-amber-200' : 'text-gray-200'
                                        }`}>
                                        {label}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500">
                                    {language === 'th' ? template.description_th : template.label_en}
                                </p>
                            </div>
                        </motion.button>
                    )
                })}
            </div>

            {/* Helper Text */}
            <p className="text-xs text-gray-500 text-center">
                {language === 'th'
                    ? '💡 เลือก template แล้วแก้ไขเพิ่มเติมได้'
                    : '💡 Select a template and customize further'}
            </p>
        </div>
    )
}

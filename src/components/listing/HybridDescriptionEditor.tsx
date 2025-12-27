'use client'

/**
 * HybridDescriptionEditor - World-Class Description Form
 * 
 * Features:
 * - Form-based structure per category
 * - Collapsible sections
 * - All fields are editable, optional, removable
 * - Friendly, supportive tone
 * - i18n ready (TH/EN)
 * - AI helper tips
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ChevronDown, ChevronUp, Plus, Trash2, Sparkles,
    Eye, Edit3, Copy, Check, Lightbulb, HelpCircle
} from 'lucide-react'
import {
    getDescriptionTemplate,
    buildDescriptionText,
    type ProductDescriptionTemplate,
    type DescriptionSection,
    type DescriptionField,
    type DescriptionContext
} from '@/lib/hybrid-description-system'

// ========================================
// TYPES
// ========================================

interface HybridDescriptionEditorProps {
    categoryId: number
    subcategoryId?: number
    productTitle?: string
    language?: 'th' | 'en'
    initialValues?: Record<string, string>
    onDescriptionChange?: (text: string, values: Record<string, string>) => void
}

// ========================================
// FIELD RENDERER COMPONENT
// ========================================

function FieldRenderer({
    field,
    value,
    onChange,
    onRemove,
    language
}: {
    field: DescriptionField
    value: string
    onChange: (value: string) => void
    onRemove?: () => void
    language: 'th' | 'en'
}) {
    const isTh = language === 'th'
    const label = isTh ? field.label_th : field.label_en
    const placeholder = isTh ? field.placeholder_th : field.placeholder_en

    return (
        <div className="group flex items-start gap-2">
            <div className="flex-1">
                <label className="text-xs text-slate-400 mb-1 block flex items-center gap-1.5">
                    {label}
                    {field.removable && (
                        <span className="text-slate-600 text-[10px]">
                            ({isTh ? 'ไม่บังคับ' : 'optional'})
                        </span>
                    )}
                </label>

                {field.type === 'select' && field.options ? (
                    <select
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800/70 border border-slate-700
                                   focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30
                                   text-white text-sm transition-all outline-none cursor-pointer"
                    >
                        <option value="">{isTh ? '-- เลือก --' : '-- Select --'}</option>
                        {field.options.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {isTh ? opt.label_th : opt.label_en}
                            </option>
                        ))}
                    </select>
                ) : field.type === 'textarea' ? (
                    <textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800/70 border border-slate-700
                                   focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30
                                   text-white placeholder-slate-500 text-sm
                                   transition-all outline-none resize-none"
                    />
                ) : (
                    <input
                        type={field.type === 'number' ? 'number' : 'text'}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 rounded-lg bg-slate-800/70 border border-slate-700
                                   focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30
                                   text-white placeholder-slate-500 text-sm
                                   transition-all outline-none"
                    />
                )}
            </div>

            {/* Remove button (only for removable & filled fields) */}
            {field.removable && value && onRemove && (
                <button
                    onClick={onRemove}
                    className="mt-6 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 
                               bg-rose-500/10 hover:bg-rose-500/20 text-rose-400
                               transition-all"
                    title={isTh ? 'ลบข้อมูลนี้' : 'Remove this field'}
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            )}
        </div>
    )
}

// ========================================
// SECTION RENDERER COMPONENT
// ========================================

function SectionRenderer({
    section,
    values,
    onChange,
    language
}: {
    section: DescriptionSection
    values: Record<string, string>
    onChange: (key: string, value: string) => void
    language: 'th' | 'en'
}) {
    const [isOpen, setIsOpen] = useState(section.defaultOpen)
    const isTh = language === 'th'
    const title = isTh ? section.title_th : section.title_en

    // Count filled fields
    const filledCount = section.fields.filter(f => values[f.key]?.trim()).length
    const totalCount = section.fields.length

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl overflow-hidden border border-slate-700/50 bg-slate-800/30"
        >
            {/* Section Header */}
            <button
                onClick={() => section.collapsible && setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-4
                           ${section.collapsible ? 'hover:bg-slate-700/20 cursor-pointer' : 'cursor-default'}
                           transition-colors`}
            >
                <div className="flex items-center gap-2">
                    <span className="text-lg">{section.icon}</span>
                    <span className="text-sm font-medium text-white">{title}</span>

                    {/* Progress indicator */}
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium
                                    ${filledCount === totalCount && totalCount > 0
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : filledCount > 0
                                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                : 'bg-slate-700 text-slate-500'
                        }`}>
                        {filledCount}/{totalCount}
                    </span>
                </div>

                {section.collapsible && (
                    isOpen
                        ? <ChevronUp className="w-4 h-4 text-slate-400" />
                        : <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
            </button>

            {/* Section Content */}
            <AnimatePresence>
                {(isOpen || !section.collapsible) && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                    >
                        <div className="px-4 pb-4 space-y-3">
                            {section.fields.map(field => (
                                <FieldRenderer
                                    key={field.key}
                                    field={field}
                                    value={values[field.key] || ''}
                                    onChange={(value) => onChange(field.key, value)}
                                    onRemove={field.removable ? () => onChange(field.key, '') : undefined}
                                    language={language}
                                />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

// ========================================
// MAIN COMPONENT
// ========================================

export default function HybridDescriptionEditor({
    categoryId,
    subcategoryId,
    productTitle = '',
    language = 'th',
    initialValues = {},
    onDescriptionChange
}: HybridDescriptionEditorProps) {
    const [values, setValues] = useState<Record<string, string>>(initialValues)
    const [isPreviewMode, setIsPreviewMode] = useState(false)
    const [copied, setCopied] = useState(false)
    const isTh = language === 'th'

    // Get template based on category
    const template = useMemo(() => {
        const ctx: DescriptionContext = {
            categoryId,
            subcategoryId,
            productTitle,
            language
        }
        return getDescriptionTemplate(ctx)
    }, [categoryId, subcategoryId, productTitle, language])

    // Build description text
    const descriptionText = useMemo(() => {
        return buildDescriptionText(template, values, language)
    }, [template, values, language])

    // Handle field change
    const handleFieldChange = useCallback((key: string, value: string) => {
        setValues(prev => {
            const newValues = { ...prev, [key]: value }

            // Notify parent (defer to avoid loop)
            setTimeout(() => {
                const text = buildDescriptionText(template, newValues, language)
                onDescriptionChange?.(text, newValues)
            }, 0)

            return newValues
        })
    }, [template, language, onDescriptionChange])

    // Copy to clipboard
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(descriptionText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }, [descriptionText])

    // Count total filled fields
    const filledCount = Object.values(values).filter(v => v?.trim()).length
    const totalFields = template.sections.reduce((acc, s) => acc + s.fields.length, 0)

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                        <span className="text-purple-400">📝</span>
                        {isTh ? 'รายละเอียด' : 'Description'}
                    </label>

                    {/* Progress */}
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium
                                    ${filledCount > 0
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-slate-700 text-slate-500'
                        }`}>
                        {filledCount}/{totalFields} {isTh ? 'กรอกแล้ว' : 'filled'}
                    </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${isPreviewMode
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        {isPreviewMode ? (
                            <><Edit3 className="w-3 h-3" /> {isTh ? 'แก้ไข' : 'Edit'}</>
                        ) : (
                            <><Eye className="w-3 h-3" /> {isTh ? 'ดูตัวอย่าง' : 'Preview'}</>
                        )}
                    </button>
                </div>
            </div>

            {/* AI Helper Tip */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                           border border-purple-500/20 flex items-start gap-3"
            >
                <Lightbulb className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                    <p className="text-xs text-purple-200/80">
                        {isTh ? template.ai_helper.posting_tip_th : template.ai_helper.posting_tip_en}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                        {isTh
                            ? '✨ กรอกเท่าที่ต้องการ ทุกช่องไม่บังคับ'
                            : '✨ Fill what you want, all fields are optional'}
                    </p>
                </div>
            </motion.div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {isPreviewMode ? (
                    /* Preview Mode */
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 
                                   border border-slate-700/50 min-h-[200px]"
                    >
                        <div className="prose prose-invert prose-sm max-w-none">
                            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed text-sm">
                                {descriptionText || (
                                    <span className="text-slate-500 italic flex items-center gap-2">
                                        <HelpCircle className="w-4 h-4" />
                                        {isTh
                                            ? 'กรอกข้อมูลในฟอร์มเพื่อดูตัวอย่าง'
                                            : 'Fill the form to see preview'}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Copy Button */}
                        {descriptionText && (
                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-end">
                                <button
                                    onClick={handleCopy}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg 
                                               text-white text-xs flex items-center gap-2 transition-colors"
                                >
                                    {copied ? (
                                        <><Check className="w-4 h-4 text-green-400" /> {isTh ? 'คัดลอกแล้ว!' : 'Copied!'}</>
                                    ) : (
                                        <><Copy className="w-4 h-4" /> {isTh ? 'คัดลอกข้อความ' : 'Copy Text'}</>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    /* Form Mode */
                    <motion.div
                        key="form"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                    >
                        {template.sections.map((section, idx) => (
                            <SectionRenderer
                                key={section.id}
                                section={section}
                                values={values}
                                onChange={handleFieldChange}
                                language={language}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer */}
            <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{descriptionText.length}/2000 {isTh ? 'ตัวอักษร' : 'characters'}</span>
                <span className="text-slate-600">
                    {isTh ? '✨ AI ช่วยจัดโครงสร้าง คุณเป็นเจ้าของข้อมูล' : '✨ AI structures, you own the data'}
                </span>
            </div>
        </div>
    )
}

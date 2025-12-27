'use client'

/**
 * WORLD-CLASS SMART DESCRIPTION EDITOR
 * 
 * UI Component สำหรับแสดงและแก้ไขรายละเอียดสินค้าอัจฉริยะ
 * 
 * Features:
 * - Structured sections with edit mode
 * - Missing field highlights
 * - SEO score indicator
 * - AI-assisted field filling
 * - Real-time preview
 */

import { useState, useEffect, useCallback } from 'react'
import {
    generateStructuredDescription,
    getTemplateForCategory,
    type AIDescriptionContext,
    type StructuredDescription,
    type CategoryTemplate
} from '@/lib/world-class-description-engine'

// ============================================
// TYPES
// ============================================
interface SmartDescriptionEditorProps {
    context: AIDescriptionContext
    onChange?: (description: string, specs: Record<string, string>) => void
    language?: 'th' | 'en'
    readOnly?: boolean
}

interface FieldEditorProps {
    field: CategoryTemplate['sections'][0]['fields'][0]
    value: string
    onChange: (value: string) => void
    language: 'th' | 'en'
    isMissing: boolean
}

// ============================================
// FIELD EDITOR COMPONENT
// ============================================
function FieldEditor({ field, value, onChange, language, isMissing }: FieldEditorProps) {
    const label = language === 'th' ? field.label_th : field.label_en

    const baseInputClass = `
        w-full px-3 py-2 rounded-lg border transition-all duration-200
        bg-gray-800/50 text-white placeholder-gray-500
        focus:outline-none focus:ring-2 focus:ring-purple-500/50
        ${isMissing && !value
            ? 'border-amber-500/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
            : 'border-gray-700 hover:border-gray-600'
        }
    `

    if (field.type === 'select' && field.options) {
        return (
            <div className="flex items-center gap-3">
                <label className="text-sm text-gray-400 min-w-[100px]">{label}:</label>
                <select
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className={baseInputClass}
                >
                    <option value="">{language === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                    {field.options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                            {language === 'th' ? opt.label_th : opt.label_en}
                        </option>
                    ))}
                </select>
                {isMissing && !value && (
                    <span className="text-amber-400 text-xs">⚠️</span>
                )}
            </div>
        )
    }

    if (field.type === 'multiselect' && field.options) {
        const selectedValues = value ? value.split(',').map(v => v.trim()) : []

        return (
            <div className="space-y-2">
                <label className="text-sm text-gray-400">{label}:</label>
                <div className="flex flex-wrap gap-2">
                    {field.options.map(opt => {
                        const isSelected = selectedValues.includes(opt.value)
                        return (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => {
                                    const newValues = isSelected
                                        ? selectedValues.filter(v => v !== opt.value)
                                        : [...selectedValues, opt.value]
                                    onChange(newValues.join(', '))
                                }}
                                className={`
                                    px-3 py-1.5 rounded-full text-sm transition-all
                                    ${isSelected
                                        ? 'bg-purple-500/30 text-purple-300 border border-purple-500/50'
                                        : 'bg-gray-800 text-gray-400 border border-gray-700 hover:border-gray-600'
                                    }
                                `}
                            >
                                {isSelected && '✓ '}
                                {language === 'th' ? opt.label_th : opt.label_en}
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }

    // Text or number input
    return (
        <div className="flex items-center gap-3">
            <label className="text-sm text-gray-400 min-w-[100px]">{label}:</label>
            <input
                type={field.type === 'number' ? 'number' : 'text'}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                placeholder={language === 'th' ? 'กรุณาระบุ...' : 'Please specify...'}
                className={baseInputClass}
            />
            {isMissing && !value && (
                <span className="text-amber-400 text-xs">⚠️</span>
            )}
        </div>
    )
}

// ============================================
// SEO SCORE INDICATOR
// ============================================
function SEOScoreIndicator({ score }: { score: number }) {
    const getColor = () => {
        if (score >= 80) return 'text-green-400'
        if (score >= 60) return 'text-amber-400'
        return 'text-red-400'
    }

    const getGradient = () => {
        if (score >= 80) return 'from-green-500 to-emerald-500'
        if (score >= 60) return 'from-amber-500 to-orange-500'
        return 'from-red-500 to-rose-500'
    }

    return (
        <div className="flex items-center gap-3">
            <div className="text-sm text-gray-400">SEO Score:</div>
            <div className="flex items-center gap-2">
                <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full bg-gradient-to-r ${getGradient()} transition-all duration-500`}
                        style={{ width: `${score}%` }}
                    />
                </div>
                <span className={`text-sm font-bold ${getColor()}`}>{score}%</span>
            </div>
        </div>
    )
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function WorldClassDescriptionEditor({
    context,
    onChange,
    language = 'th',
    readOnly = false
}: SmartDescriptionEditorProps) {
    const [specs, setSpecs] = useState<Record<string, string>>(context.aiSpecs || {})
    const [editingSection, setEditingSection] = useState<string | null>(null)
    const [description, setDescription] = useState<StructuredDescription | null>(null)

    const template = getTemplateForCategory(context.categoryId)

    // Generate description when specs change
    useEffect(() => {
        const newContext: AIDescriptionContext = {
            ...context,
            aiSpecs: specs,
            language
        }
        const result = generateStructuredDescription(newContext)
        setDescription(result)
        onChange?.(result.fullText, specs)
    }, [specs, context, language])

    const updateSpec = useCallback((key: string, value: string) => {
        setSpecs(prev => ({ ...prev, [key]: value }))
    }, [])

    if (!description) return null

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    {template.emoji}
                    {language === 'th' ? 'รายละเอียดสินค้า' : 'Product Description'}
                </h3>
                <SEOScoreIndicator score={description.seoScore} />
            </div>

            {/* Missing Fields Alert */}
            {description.missingFields.length > 0 && (
                <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                    <div className="flex items-start gap-2">
                        <span className="text-amber-400">⚠️</span>
                        <div>
                            <p className="text-amber-300 text-sm font-medium">
                                {language === 'th'
                                    ? `ยังมี ${description.missingFields.length} ข้อมูลที่ควรระบุ`
                                    : `${description.missingFields.length} fields need attention`
                                }
                            </p>
                            <p className="text-amber-200/70 text-xs mt-1">
                                {description.missingFields.map(f => f.label).join(', ')}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Sections */}
            <div className="space-y-4">
                {template.sections.map(section => {
                    const isEditing = editingSection === section.id
                    const sectionTitle = language === 'th' ? section.title_th : section.title_en
                    const sectionData = description.sections.find(s => s.id === section.id)

                    return (
                        <div
                            key={section.id}
                            className={`
                                rounded-xl border transition-all duration-200
                                ${isEditing
                                    ? 'border-purple-500/50 bg-purple-500/5'
                                    : 'border-gray-700/50 bg-gray-800/30'
                                }
                            `}
                        >
                            {/* Section Header */}
                            <div
                                className="flex items-center justify-between px-4 py-3 cursor-pointer"
                                onClick={() => !readOnly && setEditingSection(isEditing ? null : section.id)}
                            >
                                <h4 className="font-medium text-white flex items-center gap-2">
                                    <span>{section.emoji}</span>
                                    {sectionTitle}
                                </h4>
                                {!readOnly && (
                                    <button className="text-gray-400 hover:text-white transition-colors">
                                        {isEditing ? '✓ Done' : '✏️ Edit'}
                                    </button>
                                )}
                            </div>

                            {/* Section Content */}
                            <div className="px-4 pb-4">
                                {isEditing ? (
                                    // Edit Mode
                                    <div className="space-y-3">
                                        {section.fields.map(field => {
                                            const isMissing = description.missingFields.some(f => f.field === field.key)
                                            return (
                                                <FieldEditor
                                                    key={field.key}
                                                    field={field}
                                                    value={specs[field.key] || ''}
                                                    onChange={(value) => updateSpec(field.key, value)}
                                                    language={language}
                                                    isMissing={isMissing}
                                                />
                                            )
                                        })}
                                    </div>
                                ) : (
                                    // View Mode
                                    <div className="text-gray-300 text-sm space-y-1">
                                        {sectionData?.content.length ? (
                                            sectionData.content.map((line, i) => (
                                                <p key={i}>{line}</p>
                                            ))
                                        ) : (
                                            <p className="text-gray-500 italic">
                                                {language === 'th' ? 'ยังไม่มีข้อมูล คลิกเพื่อเพิ่ม' : 'No data yet, click to add'}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Target Audience */}
            <div className="rounded-xl border border-gray-700/50 bg-gray-800/30 px-4 py-3">
                <h4 className="font-medium text-white flex items-center gap-2 mb-2">
                    <span>👤</span>
                    {language === 'th' ? 'เหมาะสำหรับ' : 'Ideal For'}
                </h4>
                <div className="flex flex-wrap gap-2">
                    {(language === 'th' ? template.targetAudience.th : template.targetAudience.en).map((target, i) => (
                        <span
                            key={i}
                            className="px-3 py-1 rounded-full text-sm bg-blue-500/20 text-blue-300 border border-blue-500/30"
                        >
                            {target}
                        </span>
                    ))}
                </div>
            </div>

            {/* Preview */}
            <details className="group">
                <summary className="cursor-pointer text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                    <span className="group-open:rotate-90 transition-transform">▶</span>
                    {language === 'th' ? 'ดูตัวอย่างข้อความ' : 'Preview Full Text'}
                </summary>
                <div className="mt-3 p-4 rounded-lg bg-gray-900/50 border border-gray-700">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-sans">
                        {description.fullText}
                    </pre>
                </div>
            </details>

            {/* Stats */}
            <div className="flex items-center gap-6 text-xs text-gray-500">
                <span>📝 {description.wordCount} words</span>
                <span>📊 {description.characterCount} chars</span>
                <span>✅ {description.sections.filter(s => s.content.length > 0).length}/{description.sections.length} sections</span>
            </div>
        </div>
    )
}

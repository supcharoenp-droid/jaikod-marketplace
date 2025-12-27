'use client'

/**
 * SMART DESCRIPTION PANEL v2
 * 
 * ปรับปรุงจาก user feedback:
 * - Auto-fill ข้อมูลจาก AI และ title
 * - รักษาค่าเมื่อสลับ mode
 * - UX ที่ใช้ง่ายขึ้น
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { Sparkles, ChevronDown, ChevronUp, AlertCircle, Check, Edit2, Eye, Wand2, RefreshCw } from 'lucide-react'
import {
    generateStructuredDescription,
    getTemplateForCategory,
    type AIDescriptionContext,
    type StructuredDescription
} from '@/lib/world-class-description-engine'
import {
    getSmartFields,
    BRAND_DATABASE,
    COMMON_OPTIONS,
    mapAIVisionToFields,
    type SmartField
} from '@/lib/smart-field-database'
import {
    getCategoryConditions,
    getConditionLabel,
    type ConditionOption
} from '@/lib/category-condition-options'
import SmartMotorcycleSelector from './SmartMotorcycleSelector'

interface SmartDescriptionPanelProps {
    title: string
    categoryId: number
    subcategoryId?: number
    condition: string
    aiSpecs?: Record<string, string>
    detectedBrands?: string[]
    onDescriptionChange: (description: string) => void
    onSpecsChange?: (specs: Record<string, string>) => void  // ✅ Sync specs to parent
    onNoteChange?: (note: string) => void  // ✅ NEW: Sync note to parent
    language?: 'th' | 'en'
    initialDescription?: string
    initialSpecs?: Record<string, string>  // ✅ Restore specs from parent
    initialNote?: string  // ✅ NEW: Restore note from parent
}

// ========================================
// SMART AUTO-FILL: ดึงข้อมูลจาก title
// ========================================
function extractInfoFromTitle(title: string, subcategoryId?: number): Record<string, string> {
    const extracted: Record<string, string> = {}

    // Get all brands from database for comprehensive matching
    const allBrands = [
        ...BRAND_DATABASE.mobile,
        ...BRAND_DATABASE.laptops,
        ...BRAND_DATABASE.air_conditioner,
        ...BRAND_DATABASE.fans,
        ...BRAND_DATABASE.tv,
        ...BRAND_DATABASE.bags_luxury,
        ...BRAND_DATABASE.watches_luxury,
        ...BRAND_DATABASE.watches_fashion,
        ...BRAND_DATABASE.cameras,
        ...BRAND_DATABASE.cars,
        ...BRAND_DATABASE.car_parts,
    ]

    // Extract brand (use unique brands)
    const uniqueBrands = [...new Set(allBrands)]
    let foundBrand = ''
    for (const brand of uniqueBrands) {
        if (title.toLowerCase().includes(brand.toLowerCase())) {
            extracted.brand = brand
            foundBrand = brand
            break
        }
    }

    // ✅ Extract model - For vehicles: get text after brand until ปี/สี/สภาพ
    // Example: "Nissan Almera 1.0 Turbo ปี 2022" → model = "Almera 1.0 Turbo"
    if (foundBrand) {
        const brandIndex = title.toLowerCase().indexOf(foundBrand.toLowerCase())
        const afterBrand = title.substring(brandIndex + foundBrand.length).trim()
        // Get model until we hit ปี, สี, สภาพ, or end
        const modelMatch = afterBrand.match(/^([^ปสีภ]+?)(?:\s+ปี|\s+สี|\s+สภาพ|$)/i)
        if (modelMatch && modelMatch[1].trim()) {
            extracted.model = modelMatch[1].trim()
        }
    }

    // Fallback: Extract model (pattern: รุ่น XXX or model XXX)
    if (!extracted.model) {
        const modelMatch = title.match(/(?:รุ่น|model)\s*([A-Za-z0-9\-\.\s]+?)(?:\s+ปี|\s+สี|,|$)/i)
        if (modelMatch) {
            extracted.model = modelMatch[1].trim()
        }
    }

    // ✅ Extract year - Support both ปี YYYY and year YYYY, พ.ศ./ค.ศ.
    const yearPatterns = [
        /ปี\s*(\d{4})/i,           // ปี 2022
        /year\s*(\d{4})/i,         // year 2022
        /(\d{4})\s*สีดำ/i,         // 2022 สีดำ (year before color)
        /(\d{4})\s*ไมล์/i,         // 2022 ไมล์น้อย
        /พ\.?ศ\.?\s*(\d{4})/i,     // พ.ศ.2565
        /ค\.?ศ\.?\s*(\d{4})/i,     // ค.ศ.2022
    ]
    for (const pattern of yearPatterns) {
        const match = title.match(pattern)
        if (match) {
            let year = match[1]
            // Convert พ.ศ. to ค.ศ. if needed (subtract 543)
            if (parseInt(year) > 2400) {
                year = String(parseInt(year) - 543)
            }
            extracted.year = year
            break
        }
    }

    // ✅ Extract mileage (ไมล์/กม./km)
    const mileageMatch = title.match(/(\d[\d,]*)\s*(?:กม|km|ไมล์)/i)
    if (mileageMatch) {
        extracted.mileage = mileageMatch[1].replace(/,/g, '')
    }
    // Also check for "ไมล์น้อย" description
    if (title.includes('ไมล์น้อย') && !extracted.mileage) {
        extracted.mileage = 'ไมล์น้อย' // Will need user input
    }

    // Extract size (pattern: XX นิ้ว or XX inches)
    const sizeMatch = title.match(/(\d+)\s*(?:นิ้ว|inches?|")/i)
    if (sizeMatch) {
        extracted.size = `${sizeMatch[1]} นิ้ว`
    }

    // Extract color
    const colors: Record<string, string> = {
        'ดำ': 'ดำ', 'black': 'ดำ', 'สีดำ': 'ดำ',
        'ขาว': 'ขาว', 'white': 'ขาว', 'สีขาว': 'ขาว',
        'ฟ้า': 'ฟ้า', 'blue': 'ฟ้า', 'สีฟ้า': 'ฟ้า',
        'แดง': 'แดง', 'red': 'แดง', 'สีแดง': 'แดง',
        'เขียว': 'เขียว', 'green': 'เขียว',
        'เทา': 'เทา', 'gray': 'เทา', 'grey': 'เทา',
        'ชมพู': 'ชมพู', 'pink': 'ชมพู',
        'ม่วง': 'ม่วง', 'purple': 'ม่วง',
        'ทอง': 'ทอง', 'gold': 'ทอง',
        'เงิน': 'เงิน', 'silver': 'เงิน',
        'น้ำเงิน': 'น้ำเงิน', 'navy': 'น้ำเงิน',
        'ส้ม': 'ส้ม', 'orange': 'ส้ม',
        'เหลือง': 'เหลือง', 'yellow': 'เหลือง',
        'น้ำตาล': 'น้ำตาล', 'brown': 'น้ำตาล',
    }
    for (const [key, value] of Object.entries(colors)) {
        if (title.toLowerCase().includes(key.toLowerCase())) {
            extracted.color = value
            break
        }
    }

    // Extract condition keywords
    if (title.includes('ใหม่') || title.includes('new')) {
        extracted.overall = 'สภาพใหม่'
    } else if (title.includes('สภาพดี') || title.includes('good')) {
        extracted.overall = 'สภาพดี'
    }

    console.log('🔍 Extracted from title:', { title, extracted })

    return extracted
}

// ========================================
// INLINE EDITABLE FIELD COMPONENT
// ========================================
interface InlineEditableFieldProps {
    fieldKey: string
    label: string
    value: string
    displayValue: string
    type: string
    options?: { value: string; label: string }[]
    onChange: (key: string, value: string) => void
    language: 'th' | 'en'
}

function InlineEditableField({
    fieldKey,
    label,
    value,
    displayValue,
    type,
    options,
    onChange,
    language
}: InlineEditableFieldProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)
    const inputRef = useRef<HTMLInputElement | HTMLSelectElement>(null)

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
        }
    }, [isEditing])

    useEffect(() => {
        setEditValue(value)
    }, [value])

    const handleSave = () => {
        onChange(fieldKey, editValue)
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave()
        }
        if (e.key === 'Escape') {
            setEditValue(value)
            setIsEditing(false)
        }
    }

    if (isEditing) {
        return (
            <div className="flex items-center gap-2 text-xs group">
                <span className="text-gray-500">•</span>
                <span className="text-gray-400">{label}:</span>
                {type === 'select' && options ? (
                    <select
                        ref={inputRef as React.RefObject<HTMLSelectElement>}
                        value={editValue}
                        onChange={(e) => {
                            setEditValue(e.target.value)
                            onChange(fieldKey, e.target.value)
                            setIsEditing(false)
                        }}
                        onBlur={handleSave}
                        className="flex-1 px-2 py-1 rounded border border-purple-500 bg-gray-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 max-w-[150px]"
                    >
                        {options.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        ref={inputRef as React.RefObject<HTMLInputElement>}
                        type={type === 'number' ? 'number' : 'text'}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="flex-1 px-2 py-1 rounded border border-purple-500 bg-gray-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 max-w-[150px]"
                    />
                )}
                <button
                    onClick={handleSave}
                    className="text-green-400 hover:text-green-300"
                >
                    <Check className="w-3 h-3" />
                </button>
            </div>
        )
    }

    return (
        <div
            className="flex items-center gap-2 text-xs group cursor-pointer hover:bg-purple-500/10 rounded px-1 py-0.5 -mx-1 transition-colors"
            onClick={() => setIsEditing(true)}
        >
            <span className="text-gray-500">•</span>
            <span className="text-gray-400">{label}:</span>
            <span className="text-gray-200 group-hover:text-purple-300 transition-colors">
                {displayValue}
            </span>
            <Edit2 className="w-2.5 h-2.5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
    )
}

// ========================================
// INLINE EDITABLE NOTE COMPONENT
// ========================================
interface InlineEditableNoteProps {
    value: string
    onChange: (value: string) => void
    language: 'th' | 'en'
}

function InlineEditableNote({ value, onChange, language }: InlineEditableNoteProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)
    const textareaRef = useRef<HTMLTextAreaElement>(null)

    useEffect(() => {
        if (isEditing && textareaRef.current) {
            textareaRef.current.focus()
        }
    }, [isEditing])

    useEffect(() => {
        setEditValue(value)
    }, [value])

    const handleSave = () => {
        onChange(editValue)
        setIsEditing(false)
    }

    if (isEditing) {
        return (
            <div className="space-y-2">
                <label className="text-xs text-gray-400">
                    📝 {language === 'th' ? 'หมายเหตุเพิ่มเติม' : 'Additional Notes'}:
                </label>
                <textarea
                    ref={textareaRef}
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={handleSave}
                    placeholder={language === 'th' ? 'เช่น เหตุผลที่ขาย, ข้อเสนอพิเศษ...' : 'e.g., reason for selling...'}
                    rows={2}
                    className="w-full px-2 py-1.5 rounded border border-purple-500 bg-gray-800 text-white text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                />
                <button
                    onClick={handleSave}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                    <Check className="w-3 h-3" />
                    {language === 'th' ? 'บันทึก' : 'Save'}
                </button>
            </div>
        )
    }

    return (
        <div
            className="cursor-pointer hover:bg-purple-500/10 rounded p-2 -m-2 transition-colors group"
            onClick={() => setIsEditing(true)}
        >
            {value ? (
                <p className="text-xs text-gray-300">
                    📝 {language === 'th' ? 'หมายเหตุ' : 'Note'}: {value}
                    <Edit2 className="w-2.5 h-2.5 text-gray-600 opacity-0 group-hover:opacity-100 inline ml-2 transition-opacity" />
                </p>
            ) : (
                <p className="text-xs text-gray-500 italic flex items-center gap-1">
                    📝 {language === 'th' ? 'คลิกเพื่อเพิ่มหมายเหตุ...' : 'Click to add notes...'}
                    <Edit2 className="w-2.5 h-2.5 text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                </p>
            )}
        </div>
    )
}

// ========================================
// MAIN COMPONENT
// ========================================
export default function SmartDescriptionPanel({
    title,
    categoryId,
    subcategoryId,
    condition,
    aiSpecs = {},
    detectedBrands = [],
    onDescriptionChange,
    onSpecsChange,        // ✅ Sync specs to parent
    onNoteChange,         // ✅ NEW: Sync note to parent
    language = 'th',
    initialDescription = '',
    initialSpecs = {},    // ✅ Restore specs from parent
    initialNote = ''      // ✅ NEW: Restore note from parent
}: SmartDescriptionPanelProps) {
    // State - Initialize with stored specs first, then extracted info from title
    const [specs, setSpecs] = useState<Record<string, string>>(() => {
        // Priority: initialSpecs (stored from parent) > extracted from title > aiSpecs
        if (Object.keys(initialSpecs).length > 0) {
            return { ...initialSpecs }  // Use stored specs from parent
        }
        const fromTitle = extractInfoFromTitle(title, subcategoryId)
        return { ...fromTitle, ...aiSpecs }
    })
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['specs', 'details', 'condition']))  // ✅ Include 'details' for DEFAULT_TEMPLATE
    const [description, setDescription] = useState<StructuredDescription | null>(null)
    const [mode, setMode] = useState<'edit' | 'preview'>('edit')
    const [customNote, setCustomNote] = useState(initialNote)  // ✅ Initialize from parent
    const [hasAutoFilled, setHasAutoFilled] = useState(false)

    // Refs to prevent loops
    const onChangeRef = useRef(onDescriptionChange)
    onChangeRef.current = onDescriptionChange
    const onSpecsChangeRef = useRef(onSpecsChange)
    onSpecsChangeRef.current = onSpecsChange
    const onNoteChangeRef = useRef(onNoteChange)  // ✅ NEW
    onNoteChangeRef.current = onNoteChange        // ✅ NEW
    const prevTitleRef = useRef(title)

    const template = getTemplateForCategory(categoryId, subcategoryId)

    // Auto-fill from title when it changes
    useEffect(() => {
        if (title && title !== prevTitleRef.current) {
            prevTitleRef.current = title
            const fromTitle = extractInfoFromTitle(title, subcategoryId)
            if (Object.keys(fromTitle).length > 0) {
                setSpecs(prev => {
                    // Only fill empty fields
                    const newSpecs = { ...prev }
                    for (const [key, value] of Object.entries(fromTitle)) {
                        if (!newSpecs[key]) {
                            newSpecs[key] = value
                        }
                    }
                    return newSpecs
                })
            }
        }
    }, [title])

    // Auto-fill from aiSpecs
    useEffect(() => {
        if (Object.keys(aiSpecs).length > 0 && !hasAutoFilled) {
            setSpecs(prev => ({ ...prev, ...aiSpecs }))
            setHasAutoFilled(true)
        }
    }, [aiSpecs, hasAutoFilled])

    // Auto-fill brand from detectedBrands
    useEffect(() => {
        if (detectedBrands.length > 0 && !specs.brand) {
            setSpecs(prev => ({ ...prev, brand: detectedBrands[0] }))
        }
    }, [detectedBrands])

    // Auto-fill condition from prop
    useEffect(() => {
        if (condition && !specs.overall) {
            const conditionMap: Record<string, string> = {
                'new': language === 'th' ? 'ใหม่แกะกล่อง' : 'Brand New',
                'like_new': language === 'th' ? 'เหมือนใหม่' : 'Like New',
                'good': language === 'th' ? 'สภาพดี' : 'Good',
                'fair': language === 'th' ? 'พอใช้' : 'Fair',
                'used': language === 'th' ? 'มือสอง' : 'Used'
            }
            if (conditionMap[condition]) {
                setSpecs(prev => ({ ...prev, overall: conditionMap[condition] }))
            }
        }
    }, [condition, language])

    // Generate description when specs change
    useEffect(() => {
        const context: AIDescriptionContext = {
            productTitle: title,
            categoryId,
            subcategoryId,
            aiSpecs: specs,
            detectedBrands,
            detectedObjects: [],
            suggestedCondition: condition as any,
            language
        }

        const result = generateStructuredDescription(context)
        setDescription(result)

        // Build fullText with correct ordering
        let fullText = ''

        // 1. Title (already included in result.fullText at the beginning)
        // We need to split and reorder
        const lines = result.fullText.split('\n')
        const titleLine = lines.length > 0 ? lines[0] : ''
        const restOfText = lines.slice(2).join('\n') // Skip title and empty line

        // Add title
        if (titleLine) {
            fullText = titleLine + '\n'
        }

        // 2. ✅ Add freeform description FIRST (after title)
        if (specs['freeform_description']) {
            fullText += `\n📝 ${language === 'th' ? 'รายละเอียดเพิ่มเติม' : 'Additional Details'}:\n${specs['freeform_description']}\n`
        }

        // 3. Add the rest (sections)
        if (restOfText) {
            fullText += '\n' + restOfText
        }

        // 4. Add category-specific additional fields
        const categoryConditions = getCategoryConditions(categoryId, subcategoryId)
        const additionalFields = categoryConditions.additionalFields || []
        const filledAdditionalFields = additionalFields.filter(f => specs[f.key])

        if (filledAdditionalFields.length > 0) {
            fullText += `\n\n🏷 ${language === 'th' ? 'รายละเอียดเฉพาะหมวด' : 'Category-Specific Details'}:`
            filledAdditionalFields.forEach(field => {
                const label = language === 'th' ? field.label_th : field.label_en
                let displayValue = specs[field.key]

                // Get display value for select fields
                if (field.type === 'select' && field.options) {
                    const option = field.options.find(opt => opt.value === displayValue)
                    if (option) {
                        displayValue = language === 'th' ? option.label_th : option.label_en
                    }
                }

                fullText += `\n• ${label}: ${displayValue}`
            })
        }

        // 5. Add custom note at the end
        if (customNote) {
            fullText += `\n\n📝 ${language === 'th' ? 'หมายเหตุ' : 'Note'}:\n${customNote}`
        }

        onChangeRef.current(fullText)
    }, [specs, title, categoryId, subcategoryId, condition, language, customNote])

    // ✅ Sync specs to parent whenever they change
    useEffect(() => {
        if (onSpecsChangeRef.current && Object.keys(specs).length > 0) {
            onSpecsChangeRef.current(specs)
        }
    }, [specs])

    // ✅ NEW: Sync customNote to parent whenever it changes
    useEffect(() => {
        if (onNoteChangeRef.current) {
            onNoteChangeRef.current(customNote)
        }
    }, [customNote])

    const updateSpec = useCallback((key: string, value: string) => {
        setSpecs(prev => ({ ...prev, [key]: value }))
    }, [])

    const toggleSection = (sectionId: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev)
            if (next.has(sectionId)) {
                next.delete(sectionId)
            } else {
                next.add(sectionId)
            }
            return next
        })
    }

    // AI Auto-fill all fields
    const handleAutoFillAll = () => {
        const fromTitle = extractInfoFromTitle(title, subcategoryId)

        // Get category-specific condition label
        const categoryConditions = getCategoryConditions(categoryId, subcategoryId)
        // Find matching condition or default to first one
        const matchingCondition = categoryConditions.conditions.find(c =>
            c.value === condition ||
            c.value === 'good' ||
            c.value === 'like_new'
        ) || categoryConditions.conditions[0]

        const conditionLabel = matchingCondition
            ? (language === 'th' ? matchingCondition.label_th : matchingCondition.label_en)
            : (language === 'th' ? 'สภาพดี' : 'Good')

        setSpecs(prev => ({
            ...prev,
            ...fromTitle,
            overall: matchingCondition?.value || 'good',
            ...(detectedBrands.length > 0 ? { brand: detectedBrands[0] } : {})
        }))
    }

    if (!description) return null

    const seoColor = description.seoScore >= 80 ? 'text-green-400' : description.seoScore >= 60 ? 'text-amber-400' : 'text-red-400'
    const filledFields = Object.values(specs).filter(Boolean).length
    const totalRequiredFields = template.sections.flatMap(s => s.fields).filter(f => f.importance === 'required').length

    return (
        <div className="space-y-3">
            {/* Header with Mode Toggle */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-500" />
                    <span className="text-sm font-semibold text-gray-200">
                        {mode === 'edit'
                            ? (language === 'th' ? 'กรอกรายละเอียด' : 'Fill Details')
                            : (language === 'th' ? 'ตัวอย่างรายละเอียด' : 'Preview')
                        }
                    </span>
                    <span className="text-xs text-gray-500">
                        ({filledFields}/{totalRequiredFields} {language === 'th' ? 'รายการ' : 'filled'})
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {/* SEO Score */}
                    <div className="flex items-center gap-1.5 bg-gray-800/50 px-2 py-1 rounded">
                        <span className="text-xs text-gray-400">SEO:</span>
                        <span className={`text-xs font-bold ${seoColor}`}>
                            {description.seoScore}%
                        </span>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex rounded-lg border border-gray-700 overflow-hidden">
                        <button
                            onClick={() => setMode('edit')}
                            className={`px-2.5 py-1.5 text-xs flex items-center gap-1 ${mode === 'edit' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Edit2 className="w-3 h-3" />
                            {language === 'th' ? 'กรอก' : 'Edit'}
                        </button>
                        <button
                            onClick={() => setMode('preview')}
                            className={`px-2.5 py-1.5 text-xs flex items-center gap-1 ${mode === 'preview' ? 'bg-purple-600 text-white' : 'text-gray-400 hover:text-white'}`}
                        >
                            <Eye className="w-3 h-3" />
                            {language === 'th' ? 'ตัวอย่าง' : 'Preview'}
                        </button>
                    </div>
                </div>
            </div>

            {mode === 'edit' ? (
                /* ========== EDIT MODE ========== */
                <div className="space-y-3">
                    {/* AI Auto-fill Button */}
                    <button
                        onClick={handleAutoFillAll}
                        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-sm font-medium transition-all"
                    >
                        <Wand2 className="w-4 h-4" />
                        {language === 'th' ? '✨ AI เติมอัตโนมัติ' : '✨ AI Auto-fill'}
                    </button>

                    {/* Quick Info from Title */}
                    {title && (
                        <div className="p-2.5 rounded-lg bg-blue-500/10 border border-blue-500/30">
                            <p className="text-xs text-blue-300">
                                📌 {language === 'th' ? 'ตรวจพบจากชื่อ' : 'Detected from title'}:
                                <span className="font-medium ml-1">{title}</span>
                            </p>
                        </div>
                    )}

                    {/* 🏍️ SMART MOTORCYCLE SELECTOR - For Motorcycle category (102) */}
                    {Number(subcategoryId) === 102 && (
                        <div className="rounded-lg border border-purple-500/40 bg-purple-500/5 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-lg">🏍️</span>
                                <label className="text-sm font-medium text-purple-300">
                                    {language === 'th' ? 'ข้อมูลรถมอเตอร์ไซค์' : 'Motorcycle Details'}
                                </label>
                            </div>
                            <SmartMotorcycleSelector
                                aiData={{
                                    brand: aiSpecs?.brand || specs.brand,
                                    model: aiSpecs?.model || specs.model,
                                    year: aiSpecs?.year ? parseInt(aiSpecs.year) : undefined,
                                    color: aiSpecs?.color || specs.color,
                                    confidence: 0.8
                                }}
                                initialData={{
                                    brand: specs.motorcycle_brand || '',
                                    model: specs.motorcycle_model || '',
                                    year: specs.year ? parseInt(specs.year) : null,
                                    color: specs.color || '',
                                    // Initialize essential buyer info (check both key formats)
                                    mileage: specs.mileage || '',
                                    taxStatus: (specs.taxStatus || specs.tax_status) as any || undefined,
                                    bookStatus: (specs.bookStatus || specs.book_status) as any || undefined,
                                    accidentHistory: (specs.accidentHistory || specs.accident_history) as any || undefined,
                                    ownerCount: (specs.ownerCount || specs.owners) as any || undefined,
                                    modifications: specs.modifications || '',
                                    // ✅ NEW: Priority A+B fields
                                    registrationProvince: specs.registrationProvince || specs.registration_province || '',
                                    spareKeys: (specs.spareKeys || specs.spare_keys) as any || undefined,
                                    insuranceType: (specs.insuranceType || specs.insurance_type) as any || undefined,
                                    includedItems: specs.includedItems ? specs.includedItems.split(', ') : (specs.included_items ? specs.included_items.split(', ') : []),
                                    sellingReason: specs.sellingReason || specs.selling_reason || '',
                                }}
                                onChange={(data) => {
                                    // Update specs with motorcycle data
                                    // ✅ IMPORTANT: Map keys to match MOTORCYCLE_TEMPLATE (snake_case)
                                    setSpecs(prev => ({
                                        ...prev,
                                        brand: data.brandName,
                                        model: data.model,
                                        year: data.year?.toString() || '',
                                        color: data.color,
                                        engine_cc: data.cc?.toString() || '',
                                        motorcycle_type: data.type || '',
                                        motorcycle_brand: data.brand,
                                        motorcycle_model: data.model,
                                        // Map to MOTORCYCLE_TEMPLATE keys (snake_case)
                                        mileage: data.mileage || '',
                                        tax_status: data.taxStatus || '',
                                        book_status: data.bookStatus || '',
                                        accident_history: data.accidentHistory || '',
                                        owners: data.ownerCount || '',
                                        modifications: data.modifications || '',
                                        // ✅ NEW: Priority A+B fields
                                        registration_province: data.registrationProvince || '',
                                        spare_keys: data.spareKeys || '',
                                        insurance_type: data.insuranceType || '',
                                        included_items: data.includedItems?.join(', ') || '',
                                        selling_reason: data.sellingReason || '',
                                        // Keep camelCase for persistence
                                        taxStatus: data.taxStatus || '',
                                        bookStatus: data.bookStatus || '',
                                        accidentHistory: data.accidentHistory || '',
                                        ownerCount: data.ownerCount || '',
                                        registrationProvince: data.registrationProvince || '',
                                        spareKeys: data.spareKeys || '',
                                        insuranceType: data.insuranceType || '',
                                        includedItems: data.includedItems?.join(', ') || '',
                                        sellingReason: data.sellingReason || '',
                                    }))
                                }}
                                language={language}
                            />
                        </div>
                    )}

                    {/* ✅ NEW: Free-form Product Description Textarea - ALWAYS VISIBLE */}
                    <div className="rounded-lg border border-purple-500/40 bg-purple-500/5 p-4">
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">📝</span>
                            <label className="text-sm font-medium text-purple-300">
                                {language === 'th' ? 'รายละเอียดสินค้า (อธิบายเพิ่มเติม)' : 'Product Description (Optional)'}
                            </label>
                        </div>
                        <textarea
                            value={specs['freeform_description'] || ''}
                            onChange={(e) => updateSpec('freeform_description', e.target.value)}
                            placeholder={language === 'th'
                                ? 'อธิบายสินค้าของคุณแบบอิสระ เช่น:\n• เหตุผลที่ขาย\n• จุดเด่นของสินค้า\n• ประวัติการใช้งาน\n• สิ่งที่ควรรู้ก่อนซื้อ...'
                                : 'Describe your product freely:\n• Reason for selling\n• Special features\n• Usage history\n• Things buyer should know...'}
                            rows={5}
                            className="w-full px-3 py-2 rounded-lg border border-purple-500/30 bg-gray-800/50 text-white placeholder-gray-500 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {language === 'th'
                                ? '💡 ยิ่งให้รายละเอียดมาก ยิ่งขายได้เร็ว'
                                : '💡 More details = faster sale'}
                        </p>
                    </div>

                    {/* Sections - Skip specs/details for motorcycle (handled by SmartMotorcycleSelector) */}
                    {template.sections
                        .filter(section => {
                            // For motorcycle (102), skip ALL vehicle sections - handled by SmartMotorcycleSelector
                            if (Number(subcategoryId) === 102) {
                                // Hide these sections from MOTORCYCLE_TEMPLATE
                                return !['bike_info', 'mileage_usage', 'registration', 'condition_history', 'specs', 'basic', 'details', 'condition'].includes(section.id)
                            }
                            return true
                        })
                        .map(section => {
                            const isExpanded = expandedSections.has(section.id)
                            const sectionTitle = language === 'th' ? section.title_th : section.title_en
                            const sectionFields = section.fields
                            const filledCount = sectionFields.filter(f => specs[f.key]).length

                            return (
                                <div
                                    key={section.id}
                                    className={`rounded-lg border transition-all ${isExpanded
                                        ? 'border-purple-500/40 bg-purple-500/5'
                                        : 'border-gray-700/50 bg-gray-800/30'
                                        }`}
                                >
                                    {/* Section Header */}
                                    <button
                                        type="button"
                                        onClick={() => toggleSection(section.id)}
                                        className="w-full flex items-center justify-between px-3 py-2.5"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span>{section.emoji}</span>
                                            <span className="text-sm font-medium text-white">{sectionTitle}</span>
                                            <span className="text-xs text-gray-500">
                                                ({filledCount}/{sectionFields.length})
                                            </span>
                                            {filledCount === sectionFields.length && (
                                                <Check className="w-3.5 h-3.5 text-green-400" />
                                            )}
                                        </div>
                                        {isExpanded ? (
                                            <ChevronUp className="w-4 h-4 text-gray-400" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-gray-400" />
                                        )}
                                    </button>

                                    {/* Section Fields */}
                                    {isExpanded && (
                                        <div className="px-3 pb-3 space-y-2.5">
                                            {sectionFields.map(field => {
                                                const label = language === 'th' ? field.label_th : field.label_en
                                                const currentValue = specs[field.key] || ''

                                                // Use category-specific conditions for 'overall' field
                                                let options = field.options?.map(opt => ({
                                                    value: opt.value,
                                                    label: language === 'th' ? opt.label_th : opt.label_en
                                                }))

                                                // Override with category-specific conditions
                                                if (field.key === 'overall') {
                                                    const categoryConditions = getCategoryConditions(categoryId, subcategoryId)
                                                    options = categoryConditions.conditions.map(cond => ({
                                                        value: cond.value,
                                                        label: language === 'th' ? cond.label_th : cond.label_en
                                                    }))
                                                }

                                                return (
                                                    <div key={field.key} className="flex items-start gap-3">
                                                        <label className="text-xs text-gray-400 min-w-[90px] pt-2">
                                                            {label}
                                                            {field.importance === 'required' && (
                                                                <span className="text-red-400 ml-0.5">*</span>
                                                            )}
                                                        </label>
                                                        <div className="flex-1">
                                                            {field.type === 'select' && options ? (
                                                                <select
                                                                    value={currentValue}
                                                                    onChange={(e) => updateSpec(field.key, e.target.value)}
                                                                    className={`w-full px-3 py-2 rounded-lg border text-sm bg-gray-800/50 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${!currentValue && field.importance === 'required'
                                                                        ? 'border-amber-500/40'
                                                                        : 'border-gray-700'
                                                                        }`}
                                                                >
                                                                    <option value="">-- เลือก --</option>
                                                                    {options.map(opt => (
                                                                        <option key={opt.value} value={opt.value}>
                                                                            {opt.label}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            ) : (
                                                                <input
                                                                    type={field.type === 'number' ? 'number' : 'text'}
                                                                    value={currentValue}
                                                                    onChange={(e) => updateSpec(field.key, e.target.value)}
                                                                    placeholder={`ระบุ${label}...`}
                                                                    className={`w-full px-3 py-2 rounded-lg border text-sm bg-gray-800/50 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${!currentValue && field.importance === 'required'
                                                                        ? 'border-amber-500/40'
                                                                        : 'border-gray-700'
                                                                        }`}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            )
                        })}
                    {/* Category-Specific Additional Fields */}
                    {/* ⚠️ DISABLED: These fields duplicate what's already in template.sections
                     *  All category-specific fields should be defined in world-class-description-engine.ts
                     *  Keeping this code commented for reference but not rendering to avoid duplicate fields
                     */}
                    {/* {(() => {
                        const categoryConditions = getCategoryConditions(categoryId, subcategoryId)
                        const additionalFields = categoryConditions.additionalFields || []
                        // ... rest of the code
                    })()} */}

                    {/* Custom Note */}
                    <div className="rounded-lg border border-gray-700/50 bg-gray-800/30 p-3">
                        <label className="text-xs text-gray-400 mb-2 block">
                            📝 {language === 'th' ? 'หมายเหตุเพิ่มเติม' : 'Additional Notes'}
                        </label>
                        <textarea
                            value={customNote}
                            onChange={(e) => setCustomNote(e.target.value)}
                            placeholder={language === 'th' ? 'เช่น เหตุผลที่ขาย, ข้อเสนอพิเศษ...' : 'e.g., reason for selling...'}
                            rows={2}
                            className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-gray-800/50 text-white placeholder-gray-500 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                    </div>
                </div>
            ) : (
                /* ========== INLINE EDITABLE PREVIEW MODE ========== */
                <div className="space-y-3">
                    {/* Preview with Inline Edit */}
                    <div className="rounded-lg border border-gray-700/50 bg-gray-900/50 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-xs text-gray-400">
                                {language === 'th' ? '👀 ตัวอย่างรายละเอียดที่จะแสดง (คลิกเพื่อแก้ไข)' : '👀 Preview (click to edit)'}
                            </span>
                        </div>

                        {/* Product Title */}
                        {title && (
                            <p className="text-sm font-bold text-purple-400 mb-3">
                                {template.emoji} {title}
                            </p>
                        )}

                        {/* ✅ Free-form Description - BEFORE specs sections */}
                        {specs['freeform_description'] && (
                            <div className="mb-3">
                                <p className="text-xs text-purple-400 font-medium mb-1">
                                    📝 {language === 'th' ? 'รายละเอียดเพิ่มเติม' : 'Additional Details'}:
                                </p>
                                <p className="text-xs text-gray-300 pl-2 whitespace-pre-wrap">
                                    {specs['freeform_description']}
                                </p>
                            </div>
                        )}

                        {/* Sections with Inline Editable Fields */}
                        {template.sections.map(section => {
                            const sectionTitle = language === 'th' ? section.title_th : section.title_en
                            const sectionFields = section.fields

                            // Only show sections that have at least one filled field
                            const filledFields = sectionFields.filter(f => specs[f.key])
                            if (filledFields.length === 0) return null

                            return (
                                <div key={section.id} className="mb-3">
                                    <p className="text-xs text-purple-400 font-medium mb-1">
                                        {section.emoji} {sectionTitle}:
                                    </p>
                                    <div className="space-y-1 pl-2">
                                        {sectionFields.map(field => {
                                            const label = language === 'th' ? field.label_th : field.label_en
                                            const currentValue = specs[field.key]
                                            if (!currentValue) return null

                                            // Get display value (localized for select fields)
                                            let displayValue = currentValue

                                            // ✅ Override with category-specific conditions for 'overall' field
                                            if (field.key === 'overall') {
                                                const categoryConditions = getCategoryConditions(categoryId, subcategoryId)
                                                const condOption = categoryConditions.conditions.find(c => c.value === currentValue)
                                                if (condOption) {
                                                    displayValue = language === 'th' ? condOption.label_th : condOption.label_en
                                                }
                                            } else if (field.type === 'select' && field.options) {
                                                const option = field.options.find(opt => opt.value === currentValue)
                                                if (option) {
                                                    displayValue = language === 'th' ? option.label_th : option.label_en
                                                }
                                            }

                                            return (
                                                <InlineEditableField
                                                    key={field.key}
                                                    fieldKey={field.key}
                                                    label={label}
                                                    value={currentValue}
                                                    displayValue={displayValue}
                                                    type={field.type}
                                                    options={field.options?.map(opt => ({
                                                        value: opt.value,
                                                        label: language === 'th' ? opt.label_th : opt.label_en
                                                    }))}
                                                    onChange={(key, val) => updateSpec(key, val)}
                                                    language={language}
                                                />
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })}

                        {/* Category-Specific Additional Fields in Preview */}
                        {(() => {
                            const categoryConditions = getCategoryConditions(categoryId, subcategoryId)
                            const additionalFields = categoryConditions.additionalFields || []
                            const filledAdditionalFields = additionalFields.filter(f => specs[f.key])

                            if (filledAdditionalFields.length === 0) return null

                            return (
                                <div className="mb-3">
                                    <p className="text-xs text-purple-400 font-medium mb-1">
                                        🏷 {language === 'th' ? 'รายละเอียดเฉพาะหมวด' : 'Category-Specific Details'}:
                                    </p>
                                    <div className="space-y-1 pl-2">
                                        {filledAdditionalFields.map(field => {
                                            const label = language === 'th' ? field.label_th : field.label_en
                                            const currentValue = specs[field.key]

                                            // Get display value for select fields
                                            let displayValue = currentValue
                                            if (field.type === 'select' && field.options) {
                                                const option = field.options.find(opt => opt.value === currentValue)
                                                if (option) {
                                                    displayValue = language === 'th' ? option.label_th : option.label_en
                                                }
                                            }

                                            return (
                                                <p key={field.key} className="text-xs text-gray-300">
                                                    <span className="text-gray-500">• {label}:</span> {displayValue}
                                                </p>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })()}

                        {/* Target Audience */}
                        {description.sections.find(s => s.id === 'target') && (
                            <p className="text-xs text-gray-300 mt-3">
                                👤 {language === 'th' ? 'เหมาะสำหรับ' : 'Ideal For'}: {description.sections.find(s => s.id === 'target')?.content.join(', ')}
                            </p>
                        )}

                        {/* Custom Note - Inline Editable */}
                        <div className="mt-3 pt-3 border-t border-gray-700/50">
                            <InlineEditableNote
                                value={customNote}
                                onChange={setCustomNote}
                                language={language}
                            />
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>📊 {description.characterCount} ตัวอักษร</span>
                        <span>📝 {description.wordCount} คำ</span>
                        <span className={seoColor}>SEO: {description.seoScore}%</span>
                    </div>
                </div>
            )}
        </div>
    )
}

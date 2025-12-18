'use client'

/**
 * SmartDetailsForm - i18n Enhanced Version
 * 
 * Features:
 * - Bilingual support (Thai/English)
 * - AI-powered content generation
 * - Language consistency validation
 * - Independent editing per language
 */

import { useState, useEffect } from 'react'
import { detectSubcategory } from '@/lib/subcategory-intelligence'
import { motion } from 'framer-motion'
import { DollarSign, MapPin, Package, Sparkles, AlertTriangle } from 'lucide-react'
import DropdownCategorySelector from './DropdownCategorySelector'
import BilingualTitleField from './BilingualTitleField'
import BilingualDescriptionField from './BilingualDescriptionField'
import {
    analyzeBilingualListing,
    generateBilingualContent,
    type ProductFormData
} from '@/lib/bilingual-listing-ai'
import { useLanguage } from '@/contexts/LanguageContext'
import {
    validateTitleSubcategoryMatch,
    type ValidationResult
} from '@/lib/subcategory-validator'

interface ListingData {
    category: string
    subcategory?: string
    title: string  // Legacy - will migrate to title_th
    title_th?: string
    title_en?: string
    description: string  // Legacy - will migrate to description_th
    description_th?: string
    description_en?: string
    price: number
    condition: string
    location: {
        province: string
        amphoe: string
        tambon: string
    }
}

interface AIAnalysis {
    category: { main: string; sub: string; confidence: number }
    title: string
    description: string
    price: { min: number; max: number; suggested: number }
    condition: string
}

interface SmartDetailsFormProps {
    data: ListingData
    aiAnalysis: AIAnalysis | null
    onChange: (data: ListingData) => void
    onRegenerateField: (field: 'title' | 'description') => void
    isRegenerating?: boolean
}

const CONDITIONS = [
    { value: 'new', label: 'ใหม่' },
    { value: 'like_new', label: 'เหมือนใหม่' },
    { value: 'good', label: 'สภาพดี' },
    { value: 'fair', label: 'ปกติ' },
    { value: 'used', label: 'มือสอง' },
]

export default function SmartDetailsForm({
    data,
    aiAnalysis,
    onChange,
    onRegenerateField,
    isRegenerating = false
}: SmartDetailsFormProps) {
    // Bilingual content state
    const [titleValues, setTitleValues] = useState({
        th: data.title_th || data.title || aiAnalysis?.title || '',
        en: data.title_en || ''
    })

    const [descValues, setDescValues] = useState({
        th: data.description_th || data.description || aiAnalysis?.description || '',
        en: data.description_en || ''
    })

    const [isGenerating, setIsGenerating] = useState(false)
    const [consistencyScore, setConsistencyScore] = useState(100)

    // ✅ NEW: Validation state
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)

    // ✅ Use global language context
    const { language } = useLanguage()
    const activeLanguage = language.toUpperCase() as 'TH' | 'EN'

    // Update parent when bilingual values change
    useEffect(() => {
        onChange({
            ...data,
            title: titleValues.th,  // Legacy support
            title_th: titleValues.th,
            title_en: titleValues.en,
            description: descValues.th,  // Legacy support
            description_th: descValues.th,
            description_en: descValues.en
        })
    }, [titleValues, descValues])

    // Analyze consistency when content changes
    useEffect(() => {
        if (titleValues.th && titleValues.en && descValues.th && descValues.en) {
            const formData: ProductFormData = {
                category: data.category,
                subcategory: data.subcategory,
                condition: data.condition,
                price: data.price
            }

            const analysis = analyzeBilingualListing('TH', {
                title: titleValues,
                description: descValues
            }, formData)

            setConsistencyScore(analysis.bilingual_consistency_score)
        }
    }, [titleValues, descValues, data.category, data.condition, data.price])

    // ✅ NEW: Validate title-subcategory match
    useEffect(() => {
        if (data.category && titleValues.th) {
            const result = validateTitleSubcategoryMatch(
                titleValues.th,
                descValues.th,
                parseInt(data.category),
                data.subcategory
            )
            setValidationResult(result)
        } else {
            setValidationResult(null)
        }
    }, [titleValues.th, descValues.th, data.category, data.subcategory])



    // ✅ NEW: Auto-detect subcategory from title when it changes
    useEffect(() => {
        // Log state for debugging
        // console.log('Auto-detect Check:', { 
        //    title: titleValues.th, 
        //    category: data.category, 
        //    currentSub: data.subcategory 
        // })

        // Only auto-detect if:
        // 1. User has typed a title (len > 3)
        // 2. Category is selected
        // 3. Subcategory is NOT yet selected (or simple placeholder)
        if (titleValues.th && titleValues.th.length > 3 && data.category && (!data.subcategory || data.subcategory === '')) {
            console.log('🔍 Auto-detecting subcategory from title:', titleValues.th)

            const detected = detectSubcategory({
                categoryId: parseInt(data.category),
                title: titleValues.th,
                description: descValues.th,
            })

            console.log('🧠 AI Prediction:', detected)

            if (detected && detected.confidence >= 0.3) {
                console.log('✅ Auto-selected subcategory:', {
                    id: detected.subcategoryId,
                    name: detected.subcategoryName,
                    confidence: detected.confidence
                })

                // Auto-fill detected subcategory
                updateField('subcategory', detected.subcategoryId)
            }
        }
    }, [titleValues.th, data.category])  // Run when title or category changes

    const updateField = (field: keyof ListingData, value: any) => {
        onChange({ ...data, [field]: value })
    }

    // Generate missing language content
    const handleGenerateMissing = async (targetLang: 'TH' | 'EN') => {
        setIsGenerating(true)

        try {
            const formData: ProductFormData = {
                category: data.category,
                subcategory: data.subcategory,
                condition: data.condition,
                price: data.price
            }

            const missingLanguage = targetLang === 'TH' ? 'TH' : 'EN'

            const generated = generateBilingualContent(
                formData,
                {
                    title: titleValues,
                    description: descValues
                },
                missingLanguage
            )

            // Update values
            if (targetLang === 'TH') {
                setTitleValues(prev => ({ ...prev, th: generated.title.th }))
                setDescValues(prev => ({ ...prev, th: generated.description.th }))
            } else {
                setTitleValues(prev => ({ ...prev, en: generated.title.en }))
                setDescValues(prev => ({ ...prev, en: generated.description.en }))
            }
        } catch (error) {
            console.error('Error generating content:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    return (
        <motion.div
            className="space-y-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* AI Badge */}
            {aiAnalysis && (
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-2 text-purple-300 text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>AI เติมข้อมูลให้แล้ว • แก้ไขได้</span>
                    </div>
                </div>
            )}

            {/* Category */}
            <section className="p-4 rounded-lg bg-gray-800/50">
                <h3 className="text-sm font-medium text-gray-300 mb-3">หมวดหมู่</h3>
                <DropdownCategorySelector
                    selectedMain={data.category}
                    selectedSub={data.subcategory}  // ✅ Now passing subcategory ID
                    onSelect={(mainId: string, mainName: string, subId?: string, subName?: string) => {
                        updateField('category', mainId)
                        if (subId) {
                            updateField('subcategory', subId)  // ✅ Store subcategory ID
                        } else {
                            updateField('subcategory', '')
                        }
                    }}
                    aiSuggestion={aiAnalysis ? {
                        mainName: aiAnalysis.category.main,
                        subId: validationResult?.suggestion?.subcategoryId || data.subcategory,  // ✅ Use detected from validation
                        subName: validationResult?.suggestion?.subcategoryName || aiAnalysis.category.sub,
                        title: titleValues.th
                    } : undefined}
                />

                {/* ✅ NEW: Validation Warning */}
                {validationResult && validationResult.warnings.length > 0 && (
                    <div className="mt-3">
                        {validationResult.warnings.map((warning, i) => (
                            <div
                                key={i}
                                className={`p-3 rounded-lg border flex items-start gap-3 ${warning.severity === 'error'
                                    ? 'bg-red-900/20 border-red-700'
                                    : warning.severity === 'warning'
                                        ? 'bg-yellow-900/20 border-yellow-700'
                                        : 'bg-blue-900/20 border-blue-700'
                                    }`}
                            >
                                <AlertTriangle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${warning.severity === 'error'
                                    ? 'text-red-400'
                                    : warning.severity === 'warning'
                                        ? 'text-yellow-400'
                                        : 'text-blue-400'
                                    }`} />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm ${warning.severity === 'error'
                                        ? 'text-red-200'
                                        : warning.severity === 'warning'
                                            ? 'text-yellow-200'
                                            : 'text-blue-200'
                                        }`}>
                                        {warning.message}
                                    </p>
                                    {warning.suggestedFix && (
                                        <button
                                            onClick={() => {
                                                updateField('subcategory', warning.suggestedFix!.subcategoryId)
                                            }}
                                            className={`mt-2 text-xs px-3 py-1 rounded transition-colors ${warning.severity === 'error'
                                                ? 'bg-red-700 hover:bg-red-600 text-white'
                                                : warning.severity === 'warning'
                                                    ? 'bg-yellow-700 hover:bg-yellow-600 text-white'
                                                    : 'bg-blue-700 hover:bg-blue-600 text-white'
                                                }`}
                                        >
                                            ✓ {warning.suggestedFix.action}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Bilingual Title */}
            <section className="p-4 rounded-lg bg-gray-800/50">
                <BilingualTitleField
                    values={titleValues}
                    onChange={(lang, value) => {
                        setTitleValues(prev => ({
                            ...prev,
                            [lang.toLowerCase()]: value
                        }))
                    }}
                    onGenerateMissing={handleGenerateMissing}
                    consistencyScore={consistencyScore}
                    isGenerating={isGenerating}
                    activeLanguage={activeLanguage}
                />
            </section>

            {/* Bilingual Description */}
            <section className="p-4 rounded-lg bg-gray-800/50">
                <BilingualDescriptionField
                    values={descValues}
                    onChange={(lang, value) => {
                        setDescValues(prev => ({
                            ...prev,
                            [lang.toLowerCase()]: value
                        }))
                    }}
                    onGenerateMissing={handleGenerateMissing}
                    isGenerating={isGenerating}
                    activeLanguage={activeLanguage}  // ✅ Pass global language
                />
            </section>

            {/* Price & Condition */}
            <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <section className="p-4 rounded-lg bg-gray-800/50">
                    <label className="text-sm font-medium text-gray-300 mb-2 block">ราคา (บาท)</label>
                    <input
                        type="number"
                        value={data.price || ''}
                        onChange={(e) => updateField('price', parseFloat(e.target.value) || 0)}
                        placeholder="0"
                        className="w-full px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700
                         focus:border-purple-500 text-white placeholder-gray-500
                         transition-all outline-none"
                    />
                    {aiAnalysis?.price && (
                        <div className="text-xs text-blue-300 mt-2">
                            แนะนำ: {aiAnalysis.price.min.toLocaleString()}-{aiAnalysis.price.max.toLocaleString()} ฿
                        </div>
                    )}
                </section>

                {/* Condition */}
                <section className="p-4 rounded-lg bg-gray-800/50">
                    <label className="text-sm font-medium text-gray-300 mb-2 block">สภาพ</label>
                    <select
                        value={data.condition}
                        onChange={(e) => updateField('condition', e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700
                         focus:border-purple-500 text-white
                         transition-all outline-none"
                    >
                        {CONDITIONS.map((cond) => (
                            <option key={cond.value} value={cond.value}>
                                {cond.label}
                            </option>
                        ))}
                    </select>
                </section>
            </div>

            {/* Location */}
            <section className="p-4 rounded-lg bg-gray-800/50">
                <label className="text-sm font-medium text-gray-300 mb-2 block">จังหวัด</label>
                <input
                    type="text"
                    value={data.location.province}
                    onChange={(e) => updateField('location', {
                        ...data.location,
                        province: e.target.value
                    })}
                    placeholder="เช่น กรุงเทพมหานคร"
                    className="w-full px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700
                     focus:border-purple-500 text-white placeholder-gray-500
                     transition-all outline-none"
                />
            </section>

            {/* Progress Indicator */}
            <div className="text-xs text-gray-500 flex items-center gap-4">
                {titleValues.th && <span className="text-green-400">✓ ชื่อ (TH)</span>}
                {titleValues.en && <span className="text-green-400">✓ ชื่อ (EN)</span>}
                {descValues.th.length >= 20 && <span className="text-green-400">✓ รายละเอียด (TH)</span>}
                {descValues.en.length >= 20 && <span className="text-green-400">✓ รายละเอียด (EN)</span>}
                {data.price > 0 && <span className="text-green-400">✓ ราคา</span>}
                {data.location.province && <span className="text-green-400">✓ ที่อยู่</span>}
            </div>
        </motion.div>
    )
}

'use client'

/**
 * 🎯 Universal Listing Form Page
 * 
 * Dynamic route: /sell/[category]/[subcategory]
 * 
 * Loads the appropriate template based on category and renders
 * a dynamic form with all required fields.
 */

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getListingTemplate, DEFAULT_TEMPLATE, ListingTemplate, FormField } from '@/lib/listing-templates'
import { CATEGORIES } from '@/constants/categories'
import {
    ArrowLeft, Camera, Sparkles, ChevronRight, Upload, X,
    Check, AlertCircle, Loader2
} from 'lucide-react'
import Link from 'next/link'

// ============================================
// MAIN PAGE COMPONENT
// ============================================

function ListingFormPage() {
    const params = useParams()
    const router = useRouter()
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'

    const categorySlug = params.category as string
    const subcategorySlug = params.subcategory as string

    // Get template
    const template = getListingTemplate(categorySlug, subcategorySlug) || DEFAULT_TEMPLATE

    // Get category info for display
    const category = CATEGORIES.find(c => c.slug === categorySlug)
    const subcategory = category?.subcategories?.find(s => s.slug === subcategorySlug)

    // Form state
    const [formData, setFormData] = useState<Record<string, string | number | boolean>>({})
    const [images, setImages] = useState<string[]>([])
    const [activeGroup, setActiveGroup] = useState<string>(template.fieldGroups[0]?.id || '')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    // Load AI data from sessionStorage (from AI Snap & Sell)
    useEffect(() => {
        const aiData = sessionStorage.getItem('ai_listing_data')
        if (aiData) {
            try {
                const parsed = JSON.parse(aiData)
                // Pre-fill form with AI-detected data
                if (parsed.extractedData) {
                    setFormData(prev => ({
                        ...prev,
                        ...parsed.extractedData,
                    }))
                }
                if (parsed.uploadedImage) {
                    setImages([parsed.uploadedImage])
                }
                // Clear after use
                sessionStorage.removeItem('ai_listing_data')
            } catch (e) {
                console.error('Failed to parse AI data:', e)
            }
        }
    }, [])

    // Handle field change
    const handleFieldChange = (fieldId: string, value: string | number | boolean) => {
        setFormData(prev => ({ ...prev, [fieldId]: value }))
        // Clear error when field is updated
        if (errors[fieldId]) {
            setErrors(prev => {
                const newErrors = { ...prev }
                delete newErrors[fieldId]
                return newErrors
            })
        }
    }

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        Array.from(files).forEach(file => {
            const reader = new FileReader()
            reader.onload = (e) => {
                if (e.target?.result) {
                    setImages(prev => [...prev, e.target!.result as string])
                }
            }
            reader.readAsDataURL(file)
        })
    }

    // Remove image
    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {}

        template.fields.forEach(field => {
            if (field.required && !formData[field.id]) {
                newErrors[field.id] = lang === 'th'
                    ? `กรุณากรอก${field.name_th}`
                    : `Please enter ${field.name_en}`
            }
        })

        // Check required images
        if (template.requiredImages && images.length < template.requiredImages) {
            newErrors['images'] = lang === 'th'
                ? `กรุณาอัพโหลดรูปอย่างน้อย ${template.requiredImages} รูป`
                : `Please upload at least ${template.requiredImages} images`
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    // Submit form
    const handleSubmit = async () => {
        if (!validateForm()) {
            // Scroll to first error
            return
        }

        setIsSubmitting(true)

        try {
            // TODO: Implement actual submission
            console.log('Submitting:', { formData, images, template })

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 2000))

            // Redirect to success page
            router.push('/seller/products?success=true')
        } catch (error) {
            console.error('Submission error:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Render field based on type
    const renderField = (field: FormField) => {
        const value = formData[field.id] || ''
        const error = errors[field.id]
        const label = lang === 'th' ? field.name_th : field.name_en
        const placeholder = lang === 'th' ? field.placeholder_th : field.placeholder_en

        const baseInputClass = `
            w-full px-4 py-3 rounded-xl border-2 transition-all
            ${error
                ? 'border-red-300 focus:border-red-500 bg-red-50'
                : 'border-gray-200 focus:border-purple-500 dark:border-gray-700'}
            dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500/20
        `

        switch (field.type) {
            case 'text':
            case 'number':
            case 'mileage':
            case 'price':
            case 'area':
                return (
                    <div className="relative">
                        <input
                            type={field.type === 'text' ? 'text' : 'number'}
                            value={typeof value === 'boolean' ? '' : value}
                            onChange={(e) => handleFieldChange(field.id, e.target.value)}
                            placeholder={placeholder}
                            className={baseInputClass}
                        />
                        {field.unit && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">
                                {field.unit}
                            </span>
                        )}
                    </div>
                )

            case 'textarea':
                return (
                    <textarea
                        value={typeof value === 'boolean' ? '' : value}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={placeholder}
                        rows={4}
                        className={baseInputClass}
                    />
                )

            case 'select':
                return (
                    <select
                        value={value as string}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        className={baseInputClass}
                    >
                        <option value="">{lang === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                        {field.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>
                                {opt.icon ? `${opt.icon} ` : ''}{lang === 'th' ? opt.label_th : opt.label_en}
                            </option>
                        ))}
                    </select>
                )

            case 'radio':
                return (
                    <div className="flex flex-wrap gap-3">
                        {field.options?.map(opt => (
                            <label
                                key={opt.value}
                                className={`
                                    flex items-center gap-2 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all
                                    ${value === opt.value
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'}
                                `}
                            >
                                <input
                                    type="radio"
                                    name={field.id}
                                    value={opt.value}
                                    checked={value === opt.value}
                                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                    className="hidden"
                                />
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center
                                    ${value === opt.value ? 'border-purple-500' : 'border-gray-300'}`}>
                                    {value === opt.value && <div className="w-3 h-3 rounded-full bg-purple-500" />}
                                </div>
                                <span className="text-sm font-medium">
                                    {lang === 'th' ? opt.label_th : opt.label_en}
                                </span>
                            </label>
                        ))}
                    </div>
                )

            case 'checkbox':
                return (
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={!!value}
                            onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="text-sm">{label}</span>
                    </label>
                )

            case 'location':
                return (
                    <div className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl text-center">
                        <p className="text-gray-500 text-sm">
                            {lang === 'th' ? '🗺️ เลือกตำแหน่งที่อยู่ (Coming Soon)' : '🗺️ Select Location (Coming Soon)'}
                        </p>
                    </div>
                )

            default:
                return (
                    <input
                        type="text"
                        value={value as string}
                        onChange={(e) => handleFieldChange(field.id, e.target.value)}
                        placeholder={placeholder}
                        className={baseInputClass}
                    />
                )
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="flex-1">
                        <h1 className="font-bold text-gray-900 dark:text-white">
                            {lang === 'th' ? template.name_th : template.name_en}
                        </h1>
                        <p className="text-xs text-gray-500">
                            {lang === 'th' ? category?.name_th : category?.name_en}
                            {subcategory && ` › ${lang === 'th' ? subcategory.name_th : subcategory.name_en}`}
                        </p>
                    </div>

                    <span className="text-3xl">{template.icon}</span>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Image Upload Section */}
                <section className="mb-8">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-purple-600" />
                        {lang === 'th' ? 'รูปภาพสินค้า' : 'Product Images'}
                        {template.requiredImages && (
                            <span className="text-sm font-normal text-gray-500">
                                ({lang === 'th' ? `ต้องมีอย่างน้อย ${template.requiredImages} รูป` : `Min ${template.requiredImages} required`})
                            </span>
                        )}
                    </h2>

                    <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                        {/* Upload Button */}
                        <label className="aspect-square border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <Upload className="w-6 h-6 text-gray-400 mb-1" />
                            <span className="text-xs text-gray-500">{lang === 'th' ? 'เพิ่มรูป' : 'Add'}</span>
                        </label>

                        {/* Image Previews */}
                        {images.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                <img src={img} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                <button
                                    onClick={() => removeImage(idx)}
                                    className="absolute top-1 right-1 p-1 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                                {idx === 0 && (
                                    <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-purple-600 text-white text-[10px] font-bold rounded-full">
                                        {lang === 'th' ? 'ปก' : 'Cover'}
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>

                    {errors['images'] && (
                        <p className="mt-2 text-sm text-red-500 flex items-center gap-1">
                            <AlertCircle className="w-4 h-4" />
                            {errors['images']}
                        </p>
                    )}
                </section>

                {/* Field Groups */}
                {template.fieldGroups.map(group => (
                    <section key={group.id} className="mb-6">
                        <h3 className="text-md font-bold mb-4 text-gray-800 dark:text-gray-200">
                            {lang === 'th' ? group.name_th : group.name_en}
                        </h3>

                        <div className="space-y-4 bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm">
                            {template.fields
                                .filter(f => f.group === group.id)
                                .map(field => (
                                    <div key={field.id}>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {lang === 'th' ? field.name_th : field.name_en}
                                            {field.required && <span className="text-red-500 ml-1">*</span>}
                                        </label>
                                        {renderField(field)}
                                        {errors[field.id] && (
                                            <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" />
                                                {errors[field.id]}
                                            </p>
                                        )}
                                        {field.helperText_th && (
                                            <p className="mt-1 text-xs text-gray-500">
                                                {lang === 'th' ? field.helperText_th : field.helperText_en}
                                            </p>
                                        )}
                                    </div>
                                ))}
                        </div>
                    </section>
                ))}

                {/* Submit Button */}
                <div className="sticky bottom-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 -mx-4">
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {lang === 'th' ? 'กำลังลงประกาศ...' : 'Publishing...'}
                            </>
                        ) : (
                            <>
                                <Check className="w-5 h-5" />
                                {lang === 'th' ? 'ลงประกาศ' : 'Publish Listing'}
                            </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    )
}

// Wrap with Suspense for useParams
export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        }>
            <ListingFormPage />
        </Suspense>
    )
}

'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
    Camera, Sparkles, AlertTriangle, ChevronDown, X,
    Zap, ArrowLeft, Check, Shield
} from 'lucide-react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { CATEGORIES } from '@/constants/categories'
import { useRouter } from 'next/navigation'
import { quickSellAiAssistant, QuickSellOutput } from '@/services/aiListingService'
import AddressSelector from '@/components/ui/AddressSelector'
// Enhanced Listing Components
import {
    BATTERY_HEALTH_OPTIONS,
    WARRANTY_OPTIONS,
    USAGE_AGE_OPTIONS,
    ORIGINAL_BOX_OPTIONS,
    RECEIPT_OPTIONS,
    SELLING_REASON_OPTIONS,
    LAPTOP_DEFECT_OPTIONS,
    LAPTOP_TARGET_AUDIENCE,
    suggestTargetAudience
} from '@/lib/enhanced-listing-options'

interface OnePageListingFormProps {
    initialData?: any
    onSubmit: (data: any) => void
    onSaveDraft: (data: any) => void
    isEditMode?: boolean
}

export default function OnePageListingForm({
    initialData, onSubmit, onSaveDraft, isEditMode
}: OnePageListingFormProps) {
    const router = useRouter()

    // --- State: Images ---
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const fileInputRef = useRef<HTMLInputElement>(null)

    // --- State: AI & Data ---
    const [aiResult, setAiResult] = useState<QuickSellOutput | null>(null)
    const [isAiLoading, setIsAiLoading] = useState(false)
    const [showTitleSuggestions, setShowTitleSuggestions] = useState(false)
    const [showDescSuggestions, setShowDescSuggestions] = useState(false)
    const [showPriceSuggestions, setShowPriceSuggestions] = useState(false)

    // Sync initialData
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData(prev => ({
                ...prev,
                title: initialData.title || prev.title,
                description: initialData.description || prev.description,
                price: initialData.price || prev.price,
                condition: initialData.condition || prev.condition,
                category_main: initialData.category_main || prev.category_main,
                category_sub: initialData.category_sub || prev.category_sub,
                province: initialData.province || prev.province,
                admin_id: initialData.amphoe || prev.admin_id,
                district_id: initialData.district || prev.district_id,
                shipping_methods: initialData.shipping_methods || prev.shipping_methods,
                shipping_fee: initialData.shipping_fee || prev.shipping_fee,
                stock: initialData.stock || prev.stock,
                attributes: initialData.attributes || prev.attributes,
            }))

            if (initialData.images && initialData.images.length > 0) {
                const urls = (initialData.images || []).map((img: any) => typeof img === 'string' ? img : img.url)
                setPreviews(urls)
            }
        }
    }, [initialData])

    // --- State: Data ---
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        condition: initialData?.condition || 'good',
        warranty: initialData?.warranty || 'none',
        warranty_months: initialData?.warranty_months || '',
        category_main: initialData?.category_main || '',
        category_sub: initialData?.category_sub || '',
        province: initialData?.province || '',
        admin_id: initialData?.amphoe || '', // AddressSelector uses admin_id for Amphoe
        district_id: initialData?.district || '', // AddressSelector uses district_id for Tambon
        zipcode: initialData?.zipcode || '',
        geo: { lat: 13.7563, lng: 100.5018 },
        shipping_methods: {
            pickup: false,
            delivery: true
        },
        shipping_fee: '',
        sku: '',
        stock: '1',
        attributes: {} as Record<string, any>,
        sale_type: initialData?.sale_type || 'fixed',
        auction_config: {
            start_price: initialData?.auction_config?.start_price || '',
            bid_increment: initialData?.auction_config?.bid_increment || '50',
            days_duration: '3',
            buy_now_price: initialData?.auction_config?.buy_now_price || '',
            deposit_required: initialData?.auction_config?.deposit_required || false
        }
    })

    // --- State: Enhanced Details (NEW!) ---
    const [enhancedDetails, setEnhancedDetails] = useState({
        battery: initialData?.enhancedDetails?.battery || '',
        defects: initialData?.enhancedDetails?.defects || ['none'] as string[],
        warranty: initialData?.enhancedDetails?.warranty || '',
        usageAge: initialData?.enhancedDetails?.usageAge || '',
        originalBox: initialData?.enhancedDetails?.originalBox || '',
        receipt: initialData?.enhancedDetails?.receipt || '',
        sellingReason: initialData?.enhancedDetails?.sellingReason || '',
        otherDefectText: initialData?.enhancedDetails?.otherDefectText || '',
        targetAudiences: initialData?.enhancedDetails?.targetAudiences || [] as string[],
    })

    // --- State: Show Enhanced Details Section ---
    const [showEnhancedDetails, setShowEnhancedDetails] = useState(false)

    const [validationErrors, setValidationErrors] = useState<string[]>([])

    // --- Helpers ---
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const newFiles = Array.from(e.target.files)
            setImages(prev => [...prev, ...newFiles])
            const newPreviews = newFiles.map(f => URL.createObjectURL(f))
            setPreviews(prev => [...prev, ...newPreviews])

            // Trigger AI
            setIsAiLoading(true)
            try {
                const result = await quickSellAiAssistant({
                    images: newFiles,
                    manualTitle: formData.title,
                    language: 'th'
                })
                setAiResult(result)

                // Auto-fill Category if not set
                if (!formData.category_main) {
                    setFormData(prev => ({ ...prev, category_main: result.category.id }))
                }

                setIsAiLoading(false)
            } catch (error) {
                console.error("AI Error", error)
                setIsAiLoading(false)
            }
        }
    }

    const removeImage = (index: number) => {
        const numExisting = previews.length - images.length
        if (index >= numExisting) {
            const fileIndex = index - numExisting
            setImages(prev => prev.filter((_, i) => i !== fileIndex))
        }
        setPreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = () => {
        const errors = []
        if (!formData.title) errors.push('กรุณาระบุชื่อสินค้า')
        if (!formData.price) errors.push('กรุณาระบุราคา')
        if (!formData.category_main) errors.push('กรุณาเลือกหมวดหมู่')
        if (!formData.province) errors.push('กรุณาระบุจังหวัด')
        if (previews.length === 0) errors.push('กรุณาเพิ่มรูปภาพอย่างน้อย 1 รูป')

        setValidationErrors(errors)

        if (errors.length === 0) {
            const existingImages = previews.filter(p => !p.startsWith('blob:') && (p.startsWith('http') || p.startsWith('/')))
            const finalData = {
                ...formData,
                images: [...existingImages, ...images],
                price_type: formData.sale_type,
                price: formData.sale_type === 'auction' ? formData.auction_config.start_price : formData.price,
                // Map AddressSelector fields to Product fields
                amphoe: formData.admin_id, // AddressSelector uses admin_id for Amphoe name
                district: formData.district_id, // AddressSelector uses district_id for Tambon name
                // Enhanced Details (NEW!)
                enhancedDetails: enhancedDetails
            }
            onSubmit(finalData)
        } else {
            window.scrollTo({ top: 0, behavior: 'smooth' })
        }
    }

    return (
        <div className="max-w-md mx-auto bg-white dark:bg-black min-h-screen font-sans pb-32">

            {/* Header */}
            <div className="flex items-center gap-4 p-4 border-b border-gray-100 dark:border-gray-800 sticky top-0 bg-white dark:bg-black z-50">
                <button onClick={() => router.back()} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-full">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h1 className="text-lg font-bold">ขายสินค้าใหม่</h1>
            </div>

            {/* Validation Alert */}
            {validationErrors.length > 0 && (
                <div className="m-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    <span>กรุณากรอกข้อมูลให้ครบถ้วน</span>
                </div>
            )}

            <div className="divide-y divide-gray-100 dark:divide-gray-800">

                {/* 1. Product Image */}
                <section className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-gray-900 dark:text-white">1. Product Image</h2>
                        {isAiLoading ? (
                            <span className="text-xs text-indigo-500 animate-pulse">กำลังวิเคราะห์...</span>
                        ) : aiResult ? (
                            <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                                <Sparkles className="w-3 h-3" /> วิเคราะห์แล้ว: {aiResult.product_analysis.type}
                            </span>
                        ) : (
                            <span className="text-[10px] bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                <Sparkles className="w-3 h-3" /> AI วิเคราะห์ภาพอัตโนมัติ
                            </span>
                        )}
                    </div>

                    <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-shrink-0 w-24 h-24 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-indigo-500 hover:text-indigo-500 transition-colors"
                        >
                            <Camera className="w-6 h-6" />
                            <span className="text-[10px] font-bold">+ ถ่ายรูป / อัปโหลด</span>
                        </button>
                        <input ref={fileInputRef} type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />

                        <AnimatePresence>
                            {previews.map((src, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.5 }}
                                    className="flex-shrink-0 w-24 h-24 rounded-2xl relative overflow-hidden bg-gray-100"
                                >
                                    <Image src={src} fill alt="preview" className="object-cover" />
                                    <button onClick={() => removeImage(i)} className="absolute top-1 right-1 bg-black/50 text-white p-0.5 rounded-full">
                                        <X className="w-3 h-3" />
                                    </button>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </section>

                {/* 2. Product Title */}
                <section className="p-5">
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-gray-900 dark:text-white">2. Product Title</label>
                        <button
                            onClick={() => setShowTitleSuggestions(!showTitleSuggestions)}
                            disabled={!aiResult}
                            className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full flex items-center gap-1 transition-colors ${aiResult ? 'text-amber-600 bg-amber-100 hover:bg-amber-200 cursor-pointer' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
                        >
                            ✨ AI ช่วยตั้ง {showTitleSuggestions ? '(ซ่อน)' : ''}
                        </button>
                    </div>

                    {showTitleSuggestions && aiResult && (
                        <div className="mb-3 space-y-2">
                            {aiResult.titles.map((t, i) => (
                                <button key={i} onClick={() => { setFormData({ ...formData, title: t }); setShowTitleSuggestions(false) }} className="w-full text-left text-sm p-2 bg-amber-50 rounded-lg hover:bg-amber-100 text-amber-900 border border-amber-100 truncate">
                                    {t}
                                </button>
                            ))}
                        </div>
                    )}

                    <input
                        type="text"
                        placeholder="พิมพ์ชื่อสินค้า..."
                        value={formData.title}
                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                        className="w-full text-lg border-none p-0 focus:ring-0 placeholder:text-gray-300 dark:bg-black dark:text-white"
                    />
                </section>

                {/* 3. Product Description */}
                <section className="p-5">
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-gray-900 dark:text-white">3. Product Description</label>
                        <button
                            onClick={() => setShowDescSuggestions(!showDescSuggestions)}
                            disabled={!aiResult}
                            className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full flex items-center gap-1 transition-colors ${aiResult ? 'text-indigo-600 bg-indigo-100 hover:bg-indigo-200 cursor-pointer' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
                        >
                            ✨ AI เขียนให้ {showDescSuggestions ? '(ซ่อน)' : ''}
                        </button>
                    </div>

                    {showDescSuggestions && aiResult && (
                        <div className="mb-3 grid grid-cols-3 gap-2">
                            <button onClick={() => { setFormData({ ...formData, description: aiResult.descriptions.short }); setShowDescSuggestions(false) }} className="text-xs p-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-100">
                                สั้นๆ
                            </button>
                            <button onClick={() => { setFormData({ ...formData, description: aiResult.descriptions.standard }); setShowDescSuggestions(false) }} className="text-xs p-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-100">
                                มาตรฐาน
                            </button>
                            <button onClick={() => { setFormData({ ...formData, description: aiResult.descriptions.detailed }); setShowDescSuggestions(false) }} className="text-xs p-2 bg-indigo-50 rounded-lg hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-100">
                                ละเอียด
                            </button>
                        </div>
                    )}

                    <textarea
                        placeholder="บอกสภาพ / จุดเด่น / ความน่าเชื่อถือ..."
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full h-32 border-none p-0 focus:ring-0 bg-gray-50/50 dark:bg-gray-900/50 rounded-xl p-3 text-sm resize-none placeholder:text-gray-400 dark:text-gray-200"
                    />
                </section>

                {/* 4. Price */}
                <section className="p-5">
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-gray-900 dark:text-white">4. Price</label>
                        <button
                            onClick={() => setShowPriceSuggestions(!showPriceSuggestions)}
                            disabled={!aiResult}
                            className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full flex items-center gap-1 transition-colors ${aiResult ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200 cursor-pointer' : 'text-gray-400 bg-gray-100 cursor-not-allowed'}`}
                        >
                            ⚡ AI แนะนำราคา {showPriceSuggestions ? '(ซ่อน)' : ''}
                        </button>
                    </div>

                    {showPriceSuggestions && aiResult && (
                        <div className="mb-4 grid grid-cols-3 gap-2">
                            <div onClick={() => { setFormData({ ...formData, price: String(aiResult.price_suggestion.quick_sell_price) }); setShowPriceSuggestions(false) }} className="cursor-pointer p-2 bg-emerald-50 border border-emerald-100 rounded-lg text-center hover:bg-emerald-100 transition-colors group">
                                <div className="text-[10px] text-emerald-600 font-bold uppercase">ขายไว ⚡</div>
                                <div className="text-sm font-bold text-emerald-800">฿{aiResult.price_suggestion.quick_sell_price.toLocaleString()}</div>
                            </div>
                            <div onClick={() => { setFormData({ ...formData, price: String(aiResult.price_suggestion.market_price) }); setShowPriceSuggestions(false) }} className="cursor-pointer p-2 bg-blue-50 border border-blue-100 rounded-lg text-center hover:bg-blue-100 transition-colors group">
                                <div className="text-[10px] text-blue-600 font-bold uppercase">ราคาตลาด</div>
                                <div className="text-sm font-bold text-blue-800">฿{aiResult.price_suggestion.market_price.toLocaleString()}</div>
                            </div>
                            <div onClick={() => { setFormData({ ...formData, price: String(aiResult.price_suggestion.max_profit_price) }); setShowPriceSuggestions(false) }} className="cursor-pointer p-2 bg-purple-50 border border-purple-100 rounded-lg text-center hover:bg-purple-100 transition-colors group">
                                <div className="text-[10px] text-purple-600 font-bold uppercase">กำไรสูงสุด</div>
                                <div className="text-sm font-bold text-purple-800">฿{aiResult.price_suggestion.max_profit_price.toLocaleString()}</div>
                            </div>
                            <div className="col-span-3 text-[10px] text-gray-400 text-center mt-1">
                                {aiResult.price_suggestion.price_tip}
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-300">฿</span>
                        <input
                            type="number"
                            placeholder="ราคา (บาท)"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            className="w-full text-3xl font-black border-none p-0 focus:ring-0 text-gray-900 dark:text-white placeholder:text-gray-200"
                        />
                    </div>
                </section>

                {/* 5. Category */}
                <section className="p-5">
                    <div className="flex items-center justify-between mb-2">
                        <label className="font-bold text-gray-900 dark:text-white">5. Category (auto)</label>
                        <span className="text-xs text-gray-400">( AI เดาจากรูป แก้ได้ )</span>
                    </div>

                    <div className="relative">
                        <select
                            value={formData.category_main}
                            onChange={e => setFormData({ ...formData, category_main: e.target.value })}
                            className="w-full appearance-none bg-gray-50 dark:bg-gray-900 border-none rounded-xl py-3 pl-4 pr-10 font-medium text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-gray-200"
                        >
                            <option value="">หมวดสินค้า: เลือก...</option>
                            {CATEGORIES.map(c => <option key={c.id} value={c.id}>หมวดสินค้า: {c.name_th}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                    </div>
                </section>

                {/* 6. Enhanced Details (NEW!) */}
                <section className="p-5">
                    <button
                        onClick={() => setShowEnhancedDetails(!showEnhancedDetails)}
                        className="w-full flex items-center justify-between mb-4"
                    >
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 dark:text-white">6. รายละเอียดเพิ่มเติม</span>
                            {Object.values(enhancedDetails).filter(v => v && (Array.isArray(v) ? v.length > 0 && !(v.length === 1 && v[0] === 'none') : true)).length > 0 && (
                                <span className="text-[10px] bg-green-100 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                    <Check className="w-3 h-3" /> กรอกแล้ว
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">(เพิ่มโอกาสขาย +25%)</span>
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${showEnhancedDetails ? 'rotate-180' : ''}`} />
                        </div>
                    </button>

                    <AnimatePresence>
                        {showEnhancedDetails && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden space-y-5"
                            >
                                {/* Battery Health */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">🔋 สุขภาพแบตเตอรี่</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {BATTERY_HEALTH_OPTIONS.map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => setEnhancedDetails(prev => ({ ...prev, battery: option.value }))}
                                                className={`text-left p-3 rounded-xl border text-sm transition-all ${enhancedDetails.battery === option.value
                                                    ? 'bg-green-50 border-green-400 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-1">
                                                    {enhancedDetails.battery === option.value && <Check className="w-3 h-3" />}
                                                    <span>{option.label_th}</span>
                                                </div>
                                                {option.description_th && (
                                                    <div className="text-[10px] text-gray-400 mt-0.5">{option.description_th}</div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Defects - Multiselect */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">⚠️ ตำหนิ/ข้อบกพร่อง (เลือกได้หลายข้อ)</label>

                                    {/* No Defects Button */}
                                    <button
                                        onClick={() => setEnhancedDetails(prev => ({ ...prev, defects: ['none'] }))}
                                        className={`w-full p-3 rounded-xl border text-sm font-medium transition-all flex items-center justify-center gap-2 ${enhancedDetails.defects.includes('none') && enhancedDetails.defects.length === 1
                                            ? 'bg-green-50 border-green-400 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700'
                                            }`}
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        ✨ ไม่มีตำหนิ
                                    </button>

                                    {/* Defect Options */}
                                    {!(enhancedDetails.defects.includes('none') && enhancedDetails.defects.length === 1) && (
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {LAPTOP_DEFECT_OPTIONS.filter(o => o.value !== 'none').map(option => {
                                                const isSelected = enhancedDetails.defects.includes(option.value)
                                                return (
                                                    <button
                                                        key={option.value}
                                                        onClick={() => {
                                                            setEnhancedDetails(prev => {
                                                                let newDefects = prev.defects.filter((d: string) => d !== 'none')
                                                                if (isSelected) {
                                                                    newDefects = newDefects.filter((d: string) => d !== option.value)
                                                                } else {
                                                                    newDefects = [...newDefects, option.value]
                                                                }
                                                                if (newDefects.length === 0) newDefects = ['none']
                                                                return { ...prev, defects: newDefects }
                                                            })
                                                        }}
                                                        className={`px-3 py-1.5 rounded-full text-xs border transition-all ${isSelected
                                                            ? 'bg-orange-100 border-orange-400 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
                                                            : 'bg-gray-100 border-gray-200 text-gray-500 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700'
                                                            }`}
                                                    >
                                                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                                                        {option.label_th}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Warranty */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">📅 ประกันเหลือ</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {WARRANTY_OPTIONS.map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => setEnhancedDetails(prev => ({ ...prev, warranty: option.value }))}
                                                className={`p-2 rounded-lg border text-xs transition-all ${enhancedDetails.warranty === option.value
                                                    ? 'bg-blue-50 border-blue-400 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700'
                                                    }`}
                                            >
                                                {enhancedDetails.warranty === option.value && <Check className="w-3 h-3 inline mr-1" />}
                                                {option.emoji} {option.label_th.replace(option.emoji || '', '').trim()}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Usage Age */}
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">📆 อายุการใช้งาน</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {USAGE_AGE_OPTIONS.map(option => (
                                            <button
                                                key={option.value}
                                                onClick={() => setEnhancedDetails(prev => ({ ...prev, usageAge: option.value }))}
                                                className={`p-2 rounded-lg border text-xs transition-all ${enhancedDetails.usageAge === option.value
                                                    ? 'bg-purple-50 border-purple-400 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                    : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700'
                                                    }`}
                                            >
                                                {enhancedDetails.usageAge === option.value && <Check className="w-3 h-3 inline mr-1" />}
                                                {option.label_th}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Trust Signals */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl space-y-4">
                                    <div className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        <Shield className="w-4 h-4 text-green-500" />
                                        ความน่าเชื่อถือ
                                    </div>

                                    {/* Original Box */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500">📦 กล่องและอุปกรณ์</label>
                                        <div className="flex gap-2">
                                            {ORIGINAL_BOX_OPTIONS.map(option => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setEnhancedDetails(prev => ({ ...prev, originalBox: option.value }))}
                                                    className={`flex-1 p-2 rounded-lg border text-xs transition-all ${enhancedDetails.originalBox === option.value
                                                        ? 'bg-green-50 border-green-400 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700'
                                                        }`}
                                                >
                                                    {option.label_th}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Receipt */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500">🧾 ใบเสร็จ/ใบรับประกัน</label>
                                        <div className="flex flex-wrap gap-2">
                                            {RECEIPT_OPTIONS.map(option => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setEnhancedDetails(prev => ({ ...prev, receipt: option.value }))}
                                                    className={`px-3 py-1.5 rounded-full text-xs border transition-all ${enhancedDetails.receipt === option.value
                                                        ? 'bg-green-50 border-green-400 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700'
                                                        }`}
                                                >
                                                    {option.label_th}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Selling Reason */}
                                    <div className="space-y-2">
                                        <label className="text-xs text-gray-500">💬 เหตุผลที่ขาย (ไม่บังคับ)</label>
                                        <div className="flex flex-wrap gap-2">
                                            {SELLING_REASON_OPTIONS.map(option => (
                                                <button
                                                    key={option.value}
                                                    onClick={() => setEnhancedDetails(prev => ({ ...prev, sellingReason: option.value }))}
                                                    className={`px-3 py-1.5 rounded-lg text-xs border transition-all ${enhancedDetails.sellingReason === option.value
                                                        ? 'bg-amber-50 border-amber-400 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                                                        : 'bg-white border-gray-200 text-gray-500 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700'
                                                        }`}
                                                >
                                                    {option.label_th}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Target Audience (for Computer/Mobile categories) */}
                                {(formData.category_main === '4' || formData.category_main === '3' || formData.category_main === 4 || formData.category_main === 3) && (
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">👤 เหมาะสำหรับ</label>
                                        <div className="flex flex-wrap gap-2">
                                            {LAPTOP_TARGET_AUDIENCE.slice(0, 10).map(audience => {
                                                const isSelected = enhancedDetails.targetAudiences.includes(audience.id)
                                                return (
                                                    <button
                                                        key={audience.id}
                                                        onClick={() => {
                                                            setEnhancedDetails(prev => {
                                                                if (isSelected) {
                                                                    return { ...prev, targetAudiences: prev.targetAudiences.filter((a: string) => a !== audience.id) }
                                                                } else {
                                                                    return { ...prev, targetAudiences: [...prev.targetAudiences, audience.id] }
                                                                }
                                                            })
                                                        }}
                                                        className={`px-3 py-1.5 rounded-full text-xs border transition-all ${isSelected
                                                            ? 'bg-purple-100 border-purple-400 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                            : 'bg-gray-100 border-gray-200 text-gray-500 hover:border-gray-300 dark:bg-gray-800 dark:border-gray-700'
                                                            }`}
                                                    >
                                                        {isSelected && <Check className="w-3 h-3 inline mr-1" />}
                                                        {audience.label_th}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </section>

                <section className="p-5">
                    <div className="flex items-center justify-between mb-4">
                        <label className="font-bold text-gray-900 dark:text-white">6. Location</label>
                    </div>
                    <AddressSelector
                        selectedProvince={formData.province}
                        selectedAmphoe={formData.admin_id}
                        selectedDistrict={formData.district_id}
                        selectedZipcode={formData.zipcode}
                        onAddressChange={(val) => setFormData(prev => ({
                            ...prev,
                            province: val.province,
                            admin_id: val.amphoe, // Treat as Amphoe Name
                            district_id: val.district, // Treat as Tambon Name
                            zipcode: val.zipcode
                        }))}
                    />
                </section>

                {/* CTA */}
                <div className="p-5 pt-2">
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-black dark:bg-white text-white dark:text-black py-4 rounded-2xl font-bold text-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                        <Zap className="w-5 h-5" />
                        โพสขายเลย
                    </button>

                    {/* AI Tip */}
                    {aiResult?.confidence_note ? (
                        <div className="mt-6 flex items-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800">
                            <div className="bg-white dark:bg-black p-1.5 rounded-full shadow-sm text-lg">💡</div>
                            <div>
                                <p className="text-sm font-bold text-green-800 dark:text-green-200">AI Confidence Note:</p>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    {aiResult.confidence_note}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="mt-6 flex items-start gap-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-800 dark:to-gray-800 p-4 rounded-xl border border-amber-100 dark:border-gray-700">
                            <div className="bg-white dark:bg-black p-1.5 rounded-full shadow-sm text-lg">💡</div>
                            <div>
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200">AI Tip:</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {images.length < 3 ? '“เพิ่มรูปอีก 1 รูป เพิ่มโอกาสขาย +18%”' : '“รายละเอียดครบถ้วน เพิ่มโอกาสปิดกาารขาย!”'}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

            </div >
        </div >
    )
}

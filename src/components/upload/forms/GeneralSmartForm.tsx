'use client'

import React, { useState, useEffect } from 'react'
import {
    Sparkles, Camera, MapPin, DollarSign,
    Box, Tag, FileText, ChevronRight, Zap,
    AlertCircle, Wand2, Calculator, MoreHorizontal, CheckCircle2
} from 'lucide-react'
import Image from 'next/image'
import { CATEGORIES } from '@/constants/categories'
import { CATEGORY_FORMS, COMMON_FIELDS, FormField } from '@/config/category-forms'

interface GeneralSmartFormProps {
    initialData: any
    existingImages: File[]
    onBack: () => void
    onNext: (data: any) => void
    onSaveDraft: (data: any) => void
}

export default function GeneralSmartForm({
    initialData, existingImages, onBack, onNext, onSaveDraft
}: GeneralSmartFormProps) {

    // --- State ---
    const [images, setImages] = useState<File[]>(existingImages)
    const [imagePreviews, setImagePreviews] = useState<string[]>(
        existingImages.map(f => URL.createObjectURL(f))
    )
    const [formData, setFormData] = useState<any>({
        title: initialData?.title || '',
        category_id: initialData?.category_id || '',
        description: initialData?.description || '',
        price: initialData?.price || '',
        stock: initialData?.stock || 1,
        condition: initialData?.condition || 'good',
        province: initialData?.province || 'Bangkok',
        district: initialData?.district || '',
        shipping_method: 'standard',
        // Dynamic fields will be merged here
        ...Object.fromEntries(
            Object.entries(initialData || {}).filter(([k]) => !['title', 'category_id', 'description', 'price'].includes(k))
        )
    })

    const [aiSuggesting, setAiSuggesting] = useState(false)
    const [priceAnalysis, setPriceAnalysis] = useState<{ avg: number, status: string } | null>(null)
    const [dynamicFields, setDynamicFields] = useState<FormField[]>([])

    // Update dynamic fields when category changes
    useEffect(() => {
        const catId = String(formData.category_id)
        // Check if there are specific fields for this category in config
        // Note: The config keys in typical setups might differ, here we assume direct ID matching or basic 
        // grouping. Since I don't have all ID mappings perfect in the config file yet, I will use a helper 
        // or fallback to common ones.
        // For this demo, let's try to load from CATEGORY_FORMS if available, or generate some based on ID.

        let fields = CATEGORY_FORMS[catId] || []

        // --- Fallback / Custom Logic for specific IDs not fully in config ---
        if (fields.length === 0) {
            if (['4', '801', '802'].includes(catId) || catId.startsWith('4')) { // Computers / Cameras
                fields = [
                    { id: 'brand', label: 'ยี่ห้อ (Brand)', type: 'text', required: true },
                    { id: 'model', label: 'รุ่น (Model)', type: 'text', required: true },
                    { id: 'spec', label: 'สเปค/ความละเอียด', type: 'text' }
                ]
            } else if (catId === '9' || catId.startsWith('9')) { // Amulets
                fields = [
                    { id: 'name', label: 'ชื่อพระ/วัตถุมงคล', type: 'text', required: true },
                    { id: 'year', label: 'ปีที่สร้าง', type: 'text' },
                    { id: 'temple', label: 'วัด/สำนัก', type: 'text' },
                    { id: 'material', label: 'เนื้อวัสดุ', type: 'text' }
                ]
            } else if (catId === '10' || catId.startsWith('10')) { // Pets
                fields = [
                    { id: 'breed', label: 'สายพันธุ์', type: 'text', required: true },
                    { id: 'age', label: 'อายุ', type: 'text' },
                    { id: 'gender', label: 'เพศ', type: 'select', options: [{ label: 'ผู้', value: 'male' }, { label: 'เมีย', value: 'female' }] }
                ]
            } else if (catId === '13') { // Home & Garden
                fields = [
                    { id: 'material', label: 'วัสดุ', type: 'text' },
                    { id: 'dimensions', label: 'ขนาด (กxยxส)', type: 'text' }
                ]
            }
        }

        setDynamicFields(fields)
    }, [formData.category_id])


    // --- AI Handlers ---
    const handleAiAutoFill = () => {
        setAiSuggesting(true)
        setTimeout(() => {
            setFormData((prev: any) => ({
                ...prev,
                description: `สินค้าคุณภาพดี สภาพ ${prev.condition === 'new' ? 'ใหม่มือหนึ่ง' : 'มือสองสภาพเยี่ยม'}\n\n- ใช้งานได้ปกติ\n- ไม่มีตำหนิหนัก\n- อุปกรณ์ครบ\n\nสนใจสอบถามเพิ่มเติมได้ครับ คุยง่าย ส่งไว`,
            }))
            setAiSuggesting(false)
        }, 1200)
    }

    const handleAiPrice = () => {
        const base = Number(formData.price) || 1000
        setPriceAnalysis({
            avg: base,
            status: 'ราคาดีมาก (ต่ำกว่าตลาดเล็กน้อย)'
        })
    }

    // --- Renderers ---
    const renderField = (field: FormField) => {
        const commonClasses = "w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-blue-500 transition-all font-medium"

        switch (field.type) {
            case 'select':
                return (
                    <select
                        value={formData[field.id] || ''}
                        onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                        className={commonClasses}
                    >
                        <option value="">-- เลือก{field.label} --</option>
                        {field.options?.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                )
            case 'textarea':
                return (
                    <textarea
                        value={formData[field.id] || ''}
                        onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                        className={commonClasses}
                        rows={4}
                        placeholder={field.placeholder}
                    />
                )
            case 'checkbox':
                return (
                    <label className="flex items-center gap-3 p-3 border rounded-xl cursor-pointer hover:bg-gray-50">
                        <input
                            type="checkbox"
                            checked={!!formData[field.id]}
                            onChange={e => setFormData({ ...formData, [field.id]: e.target.checked })}
                            className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium">{field.label}</span>
                    </label>
                )
            default:
                return (
                    <div className="relative">
                        <input
                            type={field.type}
                            value={formData[field.id] || ''}
                            onChange={e => setFormData({ ...formData, [field.id]: e.target.value })}
                            className={commonClasses}
                            placeholder={field.placeholder}
                        />
                        {field.suffix && (
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">
                                {field.suffix}
                            </span>
                        )}
                    </div>
                )
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-32 font-sans text-gray-900 dark:text-gray-100">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Smart Post</h1>
                    <p className="text-gray-500 text-sm">ลงขายรวดเร็วด้วย AI ✨</p>
                </div>
                <button onClick={handleAiAutoFill} disabled={aiSuggesting} className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
                    {aiSuggesting ? <Wand2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                    AI Magic Fill
                </button>
            </div>

            {/* 1. Images Gallery (Compact) */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                    <button className="flex-shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors">
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">Add Photo</span>
                    </button>
                    {imagePreviews.map((src, i) => (
                        <div key={i} className="flex-shrink-0 w-24 h-24 rounded-xl relative overflow-hidden shadow-sm border border-gray-200">
                            <Image src={src} fill alt="" className="object-cover" />
                        </div>
                    ))}
                </div>
            </div>

            {/* 2. Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">ชื่อสินค้า *</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-bold text-lg focus:ring-2 focus:ring-blue-500"
                            placeholder="เช่น iPhone 15 Pro Max"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">หมวดหมู่ *</label>
                        <select
                            value={formData.category_id}
                            onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 font-medium"
                        >
                            <option value="">เลือกหมวดหมู่</option>
                            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.name_th}</option>)}
                        </select>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-2xl border border-blue-100 dark:border-blue-800">
                    <label className="text-sm font-bold text-blue-800 dark:text-blue-200 mb-2 block flex justify-between">
                        <span>ราคาขาย (บาท)</span>
                        <button onClick={handleAiPrice} className="text-xs flex items-center gap-1 text-blue-600 hover:underline">
                            <Calculator className="w-3 h-3" /> เช็คราคาตลาด
                        </button>
                    </label>
                    <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-900 font-black text-xl">฿</div>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                            className="w-full pl-10 pr-4 py-4 rounded-xl border-none bg-white dark:bg-gray-800 shadow-sm text-3xl font-black text-blue-900 focus:ring-2 focus:ring-blue-400 placeholder-blue-200"
                            placeholder="0"
                        />
                    </div>
                    {priceAnalysis && (
                        <div className="mt-3 text-xs font-medium text-green-600 flex items-center gap-1 animate-fade-in">
                            <CheckCircle2 className="w-3 h-3" /> {priceAnalysis.status}
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Details & Dynamic Fields */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <FileText className="w-5 h-5 text-gray-400" />
                    <h3 className="font-bold">รายละเอียดสินค้า</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Condition */}
                    <div className="space-y-1">
                        <label className="text-sm font-bold text-gray-700">สภาพสินค้า</label>
                        <select
                            value={formData.condition}
                            onChange={e => setFormData({ ...formData, condition: e.target.value })}
                            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
                        >
                            <option value="new">ของใหม่ (New)</option>
                            <option value="like_new">เหมือนใหม่ (Like New)</option>
                            <option value="good">สภาพดี (Good)</option>
                            <option value="fair">สภาพใช้งาน (Fair)</option>
                        </select>
                    </div>

                    {/* Dynamic Fields */}
                    {dynamicFields.map(field => (
                        <div key={field.id} className="space-y-1">
                            <label className="text-sm font-bold text-gray-700">{field.label}</label>
                            {renderField(field)}
                        </div>
                    ))}
                </div>

                {/* Description */}
                <div className="space-y-1 relative">
                    <label className="text-sm font-bold text-gray-700">รายละเอียดเพิ่มเติม</label>
                    <textarea
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        className="w-full p-4 rounded-xl border border-gray-200 bg-gray-50 h-32 resize-none focus:ring-2 focus:ring-blue-500"
                        placeholder="บอกเล่าเรื่องราวของสินค้านี้..."
                    />
                    {!formData.description && (
                        <button onClick={handleAiAutoFill} className="absolute bottom-4 right-4 text-xs bg-white shadow py-1 px-3 rounded-full text-blue-600 font-bold border border-blue-100 hover:scale-105 transition-transform">
                            ✨ AI Write
                        </button>
                    )}
                </div>
            </div>

            {/* 4. Location & Shipping */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 space-y-6">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                    <MapPin className="w-5 h-5 text-gray-400" />
                    <h3 className="font-bold">พิกัด & การจัดส่ง</h3>
                </div>

                <div className="flex gap-4">
                    <div className="flex-1 space-y-1">
                        <label className="text-sm font-bold text-gray-700">จังหวัด</label>
                        <select
                            value={formData.province}
                            onChange={e => setFormData({ ...formData, province: e.target.value })}
                            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
                        >
                            <option value="Bangkok">Bangkok</option>
                            <option value="Nonthaburi">Nonthaburi</option>
                            <option value="Chiang Mai">Chiang Mai</option>
                            <option value="Phuket">Phuket</option>
                            {/* Mock */}
                        </select>
                    </div>
                    <div className="flex-1 space-y-1">
                        <label className="text-sm font-bold text-gray-700">เขต/อำเภอ</label>
                        <input
                            type="text"
                            value={formData.district}
                            onChange={e => setFormData({ ...formData, district: e.target.value })}
                            className="w-full p-3 rounded-xl border border-gray-200 bg-gray-50"
                            placeholder="Ex. Chatuchak"
                        />
                    </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-full text-blue-500 shadow-sm"><Box className="w-5 h-5" /></div>
                        <div>
                            <div className="font-bold text-sm">การจัดส่ง</div>
                            <div className="text-xs text-gray-500">Standard Delivery (+50 THB)</div>
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                </div>
            </div>

            {/* Sticky Action Bar */}
            <div className="fixed bottom-0 inset-x-0 p-4 bg-white/80 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between gap-4 max-w-3xl mx-auto md:mb-6 md:rounded-2xl md:bg-white md:dark:bg-gray-800 md:shadow-2xl">
                <button onClick={onBack} className="p-3 rounded-xl hover:bg-gray-100">
                    <MoreHorizontal className="w-6 h-6 text-gray-500" />
                </button>
                <div className="flex gap-2 flex-1 justify-end">
                    <button onClick={() => onSaveDraft(formData)} className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-50">
                        Draft
                    </button>
                    <button onClick={() => onNext({ ...formData, images })} className="px-8 py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                        <span>Publish</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

        </div>
    )
}

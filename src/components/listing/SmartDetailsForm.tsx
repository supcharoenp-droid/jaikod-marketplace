'use client'

/**
 * SmartDetailsForm - SIMPLIFIED Version
 * เน้นความเรียบง่าย ใช้งานง่าย ไม่งง
 */

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, MapPin, Package, FileText, Sparkles } from 'lucide-react'
import DropdownCategorySelector from './DropdownCategorySelector'
import DynamicTitleField from './DynamicTitleField'

interface ListingData {
    category: string
    subcategory?: string  // ✅ Added!
    title: string
    description: string
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

// Mock categories
const ALL_CATEGORIES = [
    { id: '1', name: 'อิเล็กทรอนิกส์', confidence: 0 },
    { id: '2', name: 'แฟชั่น', confidence: 0 },
    { id: '3', name: 'ยานยนต์', confidence: 0 },
    { id: '4', name: 'บ้านและสวน', confidence: 0 },
    { id: '5', name: 'งานอดิเรก', confidence: 0 },
    { id: '6', name: 'ความงาม', confidence: 0 },
    { id: '7', name: 'พระเครื่อง', confidence: 0 },
    { id: '8', name: 'นาฬิกา', confidence: 0 },
    { id: '9', name: 'สัตว์เลี้ยง', confidence: 0 },
    { id: '10', name: 'อื่นๆ', confidence: 0 },
]

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
    const updateField = (field: keyof ListingData, value: any) => {
        onChange({ ...data, [field]: value })
    }

    // Prepare category suggestions from AI
    const aiCategorySuggestion = aiAnalysis ? {
        id: aiAnalysis.category.main,
        name: aiAnalysis.category.main,
        confidence: aiAnalysis.category.confidence,
        reason: `AI วิเคราะห์จากรูปภาพ`
    } : ALL_CATEGORIES[8]

    return (
        <motion.div
            className="space-y-4 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* AI Badge - Simplified */}
            {aiAnalysis && (
                <div className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <div className="flex items-center gap-2 text-purple-300 text-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>AI เติมข้อมูลให้แล้ว • แก้ไขได้</span>
                    </div>
                </div>
            )}

            {/* Category - Dropdown 2 ช่อง (AI Auto-fill from Title) */}
            <section className="p-4 rounded-lg bg-gray-800/50">
                <h3 className="text-sm font-medium text-gray-300 mb-3">หมวดหมู่</h3>
                <DropdownCategorySelector
                    selectedMain={data.category}
                    selectedSub={data.subcategory}  // ✅ Pass subcategory!
                    onSelect={(mainId: string, mainName: string, subId?: string, subName?: string) => {
                        updateField('category', mainId)
                        if (subId) {
                            updateField('subcategory', subId)
                        }
                    }}
                    aiSuggestion={aiAnalysis ? {
                        mainName: aiAnalysis.category.main,
                        subName: aiAnalysis.category.sub,
                        title: data.title  // ← ส่ง title ไปด้วย!
                    } : undefined}
                />
            </section>

            {/* Title - Clean */}
            <section className="p-4 rounded-lg bg-gray-800/50">
                <DynamicTitleField
                    value={data.title}
                    categoryId={data.category || aiCategorySuggestion.name}
                    aiGenerated={aiAnalysis?.title}
                    onChange={(title) => updateField('title', title)}
                    onRegenerate={() => onRegenerateField('title')}
                    isRegenerating={isRegenerating}
                />
            </section>

            {/* Description - Minimal */}
            <section className="p-4 rounded-lg bg-gray-800/50">
                <div className="flex items-center justify-between mb-2">
                    <label className="text-sm font-medium text-gray-300">รายละเอียด</label>
                    <button
                        onClick={() => onRegenerateField('description')}
                        disabled={isRegenerating}
                        className="px-2 py-1 text-xs rounded bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 transition-colors disabled:opacity-50"
                    >
                        <Sparkles className="w-3 h-3 inline mr-1" />
                        เขียนใหม่
                    </button>
                </div>
                <textarea
                    value={data.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="อธิบายสินค้า สภาพ เหตุผลขาย"
                    rows={4}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-gray-900 border border-gray-700
                     focus:border-purple-500 text-white placeholder-gray-500
                     transition-all outline-none resize-none"
                />
                <div className="text-xs text-gray-500 mt-1">{data.description.length}/1000</div>
            </section>

            {/* Price & Condition - Side by Side */}
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

            {/* Location - Simple */}
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

            {/* Progress Indicator - Tiny */}
            <div className="text-xs text-gray-500 flex items-center gap-4">
                {data.title && <span className="text-green-400">✓ ชื่อ</span>}
                {data.description.length >= 20 && <span className="text-green-400">✓ รายละเอียด</span>}
                {data.price > 0 && <span className="text-green-400">✓ ราคา</span>}
                {data.location.province && <span className="text-green-400">✓ ที่อยู่</span>}
            </div>
        </motion.div>
    )
}

'use client'

import React, { useState, useRef } from 'react'
import {
    Sparkles, Upload, Image as ImageIcon, X,
    DollarSign, Tag, FileText, ArrowRight, ArrowLeft, Loader2
} from 'lucide-react'
import Button from '@/components/ui/Button'
import { analyzeProductImage, generateProductContent, ProductAIResult } from '@/lib/ai-product-generator'

interface FirstProductStepProps {
    onComplete: (productData: any) => void
    onBack: () => void
    onSkip: () => void
}

export default function FirstProductStep({ onComplete, onBack, onSkip }: FirstProductStepProps) {
    const [image, setImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string | null>(null)

    // Form Data
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [category, setCategory] = useState('')
    const [descTh, setDescTh] = useState('')
    const [descEn, setDescEn] = useState('')

    // AI State
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isGenerating, setIsGenerating] = useState(false)
    const [tags, setTags] = useState<string[]>([])
    const [suggestedPrices, setSuggestedPrices] = useState<number[]>([])

    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            setImage(file)
            setImagePreview(URL.createObjectURL(file))

            // Auto analyze
            setIsAnalyzing(true)
            try {
                const result = await analyzeProductImage(file)
                setTags(result.tags)
                if (result.category) setCategory(result.category)
            } finally {
                setIsAnalyzing(false)
            }
        }
    }

    const handleAIGenerate = async () => {
        if (!name && tags.length === 0) {
            alert('Please upload an image or enter a product name first')
            return
        }

        setIsGenerating(true)
        try {
            const result = await generateProductContent(name || 'สินค้า', tags)
            if (!name) setName(result.title)
            setDescTh(result.descriptionTh)
            setDescEn(result.descriptionEn)
            setSuggestedPrices(result.suggestedPrices)
            if (!category) setCategory(result.suggestedCategory)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleSubmit = () => {
        if (!name || !image) {
            alert('Please fill in required fields')
            return
        }

        onComplete({
            name,
            price: 0, // Price will be set in next step
            category,
            descriptionTh: descTh,
            descriptionEn: descEn,
            images: [image]
        })
    }

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        ลงขายสินค้าชิ้นแรก
                        <span className="text-xs px-2 py-0.5 bg-pink-100 text-pink-600 rounded-full">Step 5</span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        ให้ AI ช่วยคุณลงขายสินค้าง่ายๆ แค่อัปโหลดรูป
                    </p>
                </div>
                <button
                    onClick={onSkip}
                    className="text-sm text-gray-400 hover:text-gray-600 underline"
                >
                    ข้ามไปก่อน
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left: Image Upload */}
                <div>
                    <div
                        className={`aspect-square border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all relative overflow-hidden group
                            ${imagePreview ? 'border-neon-purple' : 'border-gray-200 dark:border-gray-700 hover:border-neon-purple bg-gray-50 dark:bg-gray-800'}`}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />

                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <p className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> เปลี่ยนรูป</p>
                                </div>
                                {isAnalyzing && (
                                    <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                                        <Loader2 className="w-3 h-3 animate-spin" /> Analying...
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="text-center p-4">
                                <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <ImageIcon className="w-6 h-6 text-gray-400" />
                                </div>
                                <p className="font-medium text-gray-900 dark:text-white">อัปโหลดรูปสินค้า</p>
                                <p className="text-xs text-gray-500 mt-1">AI จะช่วยวิเคราะห์จากภาพนี้</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Form */}
                <div className="space-y-4">
                    {/* Name */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">ชื่อสินค้า</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="เช่น เสื้อยืด vintage"
                                className="flex-1 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple"
                            />
                            <Button
                                className="px-3"
                                onClick={handleAIGenerate}
                                disabled={isGenerating || (!image && !name)}
                                isLoading={isGenerating}
                            >
                                <Sparkles className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>

                    {/* Category */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">หมวดหมู่</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple"
                        >
                            <option value="">เลือกหมวดหมู่</option>
                            <option value="clothing">Clothing / Fashion</option>
                            <option value="electronics">Electronics / Tech</option>
                            <option value="home">Home & Living</option>
                            <option value="misc">Miscellaneous</option>
                        </select>
                    </div>

                    {/* Description Tabs */}
                    <div className="space-y-1">
                        <label className="text-sm font-medium">รายละเอียด</label>
                        <div className="grid grid-cols-1 gap-2">
                            <input
                                type="text"
                                value={descTh}
                                onChange={(e) => setDescTh(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple text-sm"
                                placeholder="รายละเอียด (TH)"
                            />
                            <input
                                type="text"
                                value={descEn}
                                onChange={(e) => setDescEn(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple text-sm"
                                placeholder="Description (EN)"
                            />
                        </div>
                    </div>


                </div>
            </div>

            {/* Footer */}
            <div className="mt-8 flex gap-3">
                <Button
                    variant="outline"
                    className="flex-1"
                    onClick={onBack}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    ย้อนกลับ
                </Button>
                <Button
                    variant="primary"
                    className="flex-1 shadow-lg shadow-neon-purple/20"
                    onClick={handleSubmit}
                    disabled={!name || !price || !image}
                >
                    ลงขายสินค้า
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            </div>
        </div>
    )
}

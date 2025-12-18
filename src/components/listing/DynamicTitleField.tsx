'use client'

/**
 * DynamicTitleField - Smart Title Generator with Category-Based Prompts
 * 
 * Features:
 * - Category-specific prompts
 * - AI-generated title
 * - Regenerate option
 * - Character count
 * - Missing info warnings
 * - Real-time validation
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, RefreshCw, AlertCircle, CheckCircle, Info } from 'lucide-react'

interface DynamicTitleFieldProps {
    value: string
    categoryId: string
    aiGenerated?: string
    onChange: (value: string) => void
    onRegenerate?: () => void
    isRegenerating?: boolean
}

// Category-specific title templates
const CATEGORY_PROMPTS: Record<string, {
    placeholder: string
    example: string
    requiredFields: string[]
    tips: string
}> = {
    'อิเล็กทรอนิกส์': {
        placeholder: 'ยี่ห้อ + รุ่น + สเปค + สภาพ',
        example: 'iPhone 15 Pro Max 256GB สีดำ สภาพใหม่',
        requiredFields: ['ยี่ห้อ', 'รุ่น'],
        tips: 'ระบุยี่ห้อและรุ่นชัดเจน เพิ่มสเปคหลัก'
    },
    'แฟชั่น': {
        placeholder: 'ชนิด + แบรนด์ + ไซส์ + สี',
        example: 'เสื้อยืด Nike ไซส์ M สีขาว',
        requiredFields: ['ชนิด', 'ไซส์'],
        tips: 'ระบุไซส์และสีให้ชัดเจน'
    },
    'ยานยนต์': {
        placeholder: 'ยี่ห้อ + รุ่น + ปี + เกียร์',
        example: 'Honda City 2020 เกียร์ออโต้',
        requiredFields: ['ยี่ห้อ', 'รุ่น', 'ปี'],
        tips: 'ใส่ยี่ห้อ รุ่น และปีให้ครบ'
    },
    'บ้านและสวน': {
        placeholder: 'ชื่อสินค้า + ขนาด + สี/แบบ',
        example: 'โซฟา 3 ที่นั่ง หนังแท้ สีน้ำตาล',
        requiredFields: ['ชื่อสินค้า'],
        tips: 'ระบุขนาดและวัสดุ'
    },
    'พระเครื่อง': {
        placeholder: 'ชื่อพระ + วัด + ปี + วัตถุมงคล',
        example: 'หลวงปู่ทวด วัดช้างให้ ปี 2497',
        requiredFields: ['ชื่อพระ', 'วัด'],
        tips: 'ระบุชื่อพระและวัดให้ชัดเจน'
    },
    'default': {
        placeholder: 'ชื่อสินค้าที่ชัดเจน กระชับ ครบถ้วน',
        example: 'สินค้าของคุณ',
        requiredFields: ['ชื่อสินค้า'],
        tips: 'ใช้คำที่ลูกค้ามักค้นหา'
    }
}

const MIN_LENGTH = 10
const MAX_LENGTH = 100
const OPTIMAL_LENGTH = 40

export default function DynamicTitleField({
    value,
    categoryId,
    aiGenerated,
    onChange,
    onRegenerate,
    isRegenerating = false
}: DynamicTitleFieldProps) {
    const [isFocused, setIsFocused] = useState(false)
    const [showTips, setShowTips] = useState(false)

    const prompt = CATEGORY_PROMPTS[categoryId] || CATEGORY_PROMPTS['default']
    const length = value.length
    const isValid = length >= MIN_LENGTH && length <= MAX_LENGTH
    const isOptimal = length >= OPTIMAL_LENGTH && length <= 60



    useEffect(() => {
        // Show tips on first focus
        if (isFocused && value === '') {
            setShowTips(true)
        }
    }, [isFocused, value])

    return (
        <div className="space-y-3">
            {/* Label */}
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-white flex items-center gap-2">
                    ชื่อสินค้า
                    <span className="text-red-400">*</span>
                    {aiGenerated && value === aiGenerated && (
                        <span className="px-2 py-0.5 bg-purple-500/20 rounded text-xs text-purple-300 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI สร้าง
                        </span>
                    )}
                </label>

                {onRegenerate && (
                    <button
                        onClick={onRegenerate}
                        disabled={isRegenerating}
                        className="px-3 py-1 text-xs font-medium rounded-lg
                         bg-purple-500/10 hover:bg-purple-500/20 
                         text-purple-300 hover:text-purple-200
                         border border-purple-500/20 hover:border-purple-500/30
                         transition-colors flex items-center gap-1.5
                         disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin' : ''}`} />
                        {isRegenerating ? 'กำลังสร้าง...' : 'สร้างใหม่'}
                    </button>
                )}
            </div>

            {/* Input Field */}
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder={prompt.placeholder}
                    maxLength={MAX_LENGTH}
                    className={`w-full px-4 py-3 pr-12 rounded-lg bg-gray-800 border-2 
                     text-white placeholder-gray-500 
                     transition-all outline-none
                     ${isFocused
                            ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                            : isValid
                                ? 'border-gray-700 hover:border-gray-600'
                                : 'border-red-500/30'
                        }`}
                />

                {/* Status Icon */}
                <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    {isValid ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                    ) : length > 0 ? (
                        <AlertCircle className="w-5 h-5 text-yellow-400" />
                    ) : null}
                </div>
            </div>

            {/* Character Count */}
            <div className="flex items-center justify-between text-xs">
                <div className={`transition-colors ${length < MIN_LENGTH
                    ? 'text-red-400'
                    : isOptimal
                        ? 'text-green-400'
                        : 'text-gray-400'
                    }`}>
                    {length}/{MAX_LENGTH} ตัวอักษร
                    {length < MIN_LENGTH && (
                        <span className="ml-2">
                            (ต้องการอย่างน้อย {MIN_LENGTH} ตัว)
                        </span>
                    )}
                    {isOptimal && (
                        <span className="ml-2">✓ ความยาวเหมาะสม</span>
                    )}
                </div>
            </div>



            {/* Tips Panel */}
            <AnimatePresence>
                {(showTips || isFocused) && (
                    <motion.div
                        className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20
                         space-y-2"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                    >
                        <div className="flex items-center gap-2 text-sm text-blue-300">
                            <Info className="w-4 h-4" />
                            <span className="font-medium">คำแนะนำ</span>
                        </div>
                        <div className="text-xs text-blue-200/80 space-y-1">
                            <div>• {prompt.tips}</div>
                            <div>• ตัวอย่าง: {prompt.example}</div>
                            <div>• หลีกเลี่ยงคำที่ไม่จำเป็น เช่น "ขาย", "มือสอง"</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* SEO Score (Optional - could be enhanced) */}
            {isOptimal && (
                <motion.div
                    className="flex items-center gap-2 text-xs text-green-400 
                              p-2 bg-green-500/10 rounded border border-green-500/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <CheckCircle className="w-4 h-4" />
                    ชื่อนี้ดี! ผู้ซื้อจะค้นหาเจอง่าย
                </motion.div>
            )}
        </div>
    )
}

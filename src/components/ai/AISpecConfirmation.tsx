'use client'

/**
 * AI Spec Confirmation Component - Phase 3 of Anti-Hallucination System
 * 
 * UI ให้ผู้ใช้ตรวจสอบและแก้ไข spec ที่ AI สร้างขึ้น
 * แสดง Validation Warnings และ Confidence Score
 */

import { useState, useEffect } from 'react'
import {
    AlertTriangle, CheckCircle, XCircle, Edit3,
    ChevronDown, ChevronUp, Sparkles, Shield,
    Info, AlertCircle, Zap
} from 'lucide-react'

// ===============================================
// TYPES
// ===============================================

export interface AIGeneratedData {
    title: string
    description: string
    suggestedCategory: string
    suggestedSubcategory?: string
    estimatedPrice: {
        min: number
        max: number
        suggested: number
    }
    estimatedCondition: 'new' | 'like_new' | 'good' | 'fair' | 'used'
    validation?: {
        isValid: boolean
        confidence: number
        warnings: string[]
        suggestedFixes: string[]
    }
}

export interface ConfirmedData {
    title: string
    description: string
    price: number
    condition: string
    userConfirmed: boolean
}

interface AISpecConfirmationProps {
    aiData: AIGeneratedData
    onConfirm: (confirmedData: ConfirmedData) => void
    onCancel?: () => void
    isLoading?: boolean
}

// ===============================================
// HELPER FUNCTIONS
// ===============================================

const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return 'text-green-500'
    if (confidence >= 60) return 'text-yellow-500'
    return 'text-red-500'
}

const getConfidenceBgColor = (confidence: number): string => {
    if (confidence >= 80) return 'bg-green-500'
    if (confidence >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
}

const getConfidenceLabel = (confidence: number): string => {
    if (confidence >= 80) return 'ความแม่นยำสูง'
    if (confidence >= 60) return 'ความแม่นยำปานกลาง'
    return 'ต้องตรวจสอบ'
}

const conditionLabels: Record<string, string> = {
    'new': 'ใหม่ (มือ 1)',
    'like_new': 'เหมือนใหม่',
    'good': 'สภาพดี',
    'fair': 'สภาพพอใช้',
    'used': 'มือสอง'
}

// ===============================================
// MAIN COMPONENT
// ===============================================

export default function AISpecConfirmation({
    aiData,
    onConfirm,
    onCancel,
    isLoading = false
}: AISpecConfirmationProps) {
    // Editable states
    const [title, setTitle] = useState(aiData.title)
    const [description, setDescription] = useState(aiData.description)
    const [price, setPrice] = useState(aiData.estimatedPrice.suggested)
    const [condition, setCondition] = useState(aiData.estimatedCondition)

    // UI states
    const [showWarnings, setShowWarnings] = useState(true)
    const [isEditing, setIsEditing] = useState<string | null>(null)
    const [hasChanges, setHasChanges] = useState(false)

    // Track changes
    useEffect(() => {
        const changed =
            title !== aiData.title ||
            description !== aiData.description ||
            price !== aiData.estimatedPrice.suggested ||
            condition !== aiData.estimatedCondition
        setHasChanges(changed)
    }, [title, description, price, condition, aiData])

    const validation = aiData.validation || {
        isValid: true,
        confidence: 70,
        warnings: [],
        suggestedFixes: []
    }

    const handleConfirm = () => {
        onConfirm({
            title,
            description,
            price,
            condition,
            userConfirmed: true
        })
    }

    const applyFix = (fix: string) => {
        // Parse the fix and apply it
        if (fix.includes('Change CPU to:')) {
            const newCPU = fix.replace('Change CPU to:', '').trim()
            setTitle(prev => prev.replace(/(?:core\s*)?i[3579][- ]?\d{4,5}/i, newCPU))
        } else if (fix.includes('Change RAM to:')) {
            const newRAM = fix.replace('Change RAM to:', '').trim()
            setTitle(prev => prev.replace(/\d+\s*gb\s*(?:ram)?/i, newRAM + ' RAM'))
        } else if (fix.includes('Change Storage to:')) {
            const newStorage = fix.replace('Change Storage to:', '').trim()
            setTitle(prev => prev.replace(/\d+\s*(?:gb|tb)\s*(?:ssd|hdd|nvme)?/i, newStorage))
        }
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header with Confidence Score */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/20 rounded-xl">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold">AI วิเคราะห์สินค้า</h2>
                            <p className="text-white/80 text-sm">กรุณาตรวจสอบและยืนยันข้อมูล</p>
                        </div>
                    </div>

                    {/* Confidence Score */}
                    <div className="text-center">
                        <div className={`text-3xl font-bold ${validation.confidence >= 70 ? 'text-white' : 'text-yellow-200'}`}>
                            {validation.confidence}%
                        </div>
                        <div className="text-xs text-white/80">{getConfidenceLabel(validation.confidence)}</div>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${getConfidenceBgColor(validation.confidence)} transition-all duration-500`}
                        style={{ width: `${validation.confidence}%` }}
                    />
                </div>
            </div>

            {/* Warnings Section */}
            {validation.warnings.length > 0 && (
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setShowWarnings(!showWarnings)}
                        className="w-full px-6 py-4 flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
                    >
                        <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
                            <AlertTriangle className="w-5 h-5" />
                            <span className="font-medium">
                                พบ {validation.warnings.length} รายการที่ต้องตรวจสอบ
                            </span>
                        </div>
                        {showWarnings ? (
                            <ChevronUp className="w-5 h-5 text-yellow-600" />
                        ) : (
                            <ChevronDown className="w-5 h-5 text-yellow-600" />
                        )}
                    </button>

                    {showWarnings && (
                        <div className="px-6 py-4 bg-yellow-50/50 dark:bg-yellow-900/10 space-y-3">
                            {validation.warnings.map((warning, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-yellow-200 dark:border-yellow-800"
                                >
                                    <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                                    <p className="text-sm text-gray-700 dark:text-gray-300">{warning}</p>
                                </div>
                            ))}

                            {/* Suggested Fixes */}
                            {validation.suggestedFixes.length > 0 && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                                        💡 คำแนะนำการแก้ไข:
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {validation.suggestedFixes.map((fix, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => applyFix(fix)}
                                                className="px-3 py-1.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors flex items-center gap-1"
                                            >
                                                <Zap className="w-3 h-3" />
                                                {fix}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Editable Fields */}
            <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            ชื่อสินค้า
                        </label>
                        <button
                            onClick={() => setIsEditing(isEditing === 'title' ? null : 'title')}
                            className="text-indigo-500 hover:text-indigo-600 p-1"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>
                    {isEditing === 'title' ? (
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 border border-indigo-300 dark:border-indigo-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            autoFocus
                            onBlur={() => setIsEditing(null)}
                        />
                    ) : (
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-900 dark:text-white">
                            {title}
                            {title !== aiData.title && (
                                <span className="ml-2 text-xs text-green-500">(แก้ไขแล้ว)</span>
                            )}
                        </div>
                    )}
                </div>

                {/* Description */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            รายละเอียด
                        </label>
                        <button
                            onClick={() => setIsEditing(isEditing === 'description' ? null : 'description')}
                            className="text-indigo-500 hover:text-indigo-600 p-1"
                        >
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>
                    {isEditing === 'description' ? (
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={3}
                            className="w-full px-4 py-3 border border-indigo-300 dark:border-indigo-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                            autoFocus
                            onBlur={() => setIsEditing(null)}
                        />
                    ) : (
                        <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl text-gray-900 dark:text-white text-sm">
                            {description || <span className="text-gray-400">ไม่มีรายละเอียด</span>}
                        </div>
                    )}
                </div>

                {/* Price and Condition Row */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Price */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            ราคา (บาท)
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">฿</span>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(Number(e.target.value))}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                        <div className="mt-1 text-xs text-gray-500">
                            AI แนะนำ: ฿{aiData.estimatedPrice.min.toLocaleString()} - ฿{aiData.estimatedPrice.max.toLocaleString()}
                        </div>
                    </div>

                    {/* Condition */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            สภาพสินค้า
                        </label>
                        <select
                            value={condition}
                            onChange={(e) => setCondition(e.target.value as any)}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white appearance-none"
                        >
                            {Object.entries(conditionLabels).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Category Info */}
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
                    <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                        <Info className="w-4 h-4" />
                        <span className="text-sm font-medium">หมวดหมู่ที่ AI เลือก:</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                        {aiData.suggestedCategory}
                        {aiData.suggestedSubcategory && (
                            <span className="text-gray-500"> → {aiData.suggestedSubcategory}</span>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        ยกเลิก
                    </button>
                )}

                <div className="flex items-center gap-3 ml-auto">
                    {hasChanges && (
                        <span className="text-xs text-green-500 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            มีการแก้ไข
                        </span>
                    )}

                    <button
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transition-all font-medium flex items-center gap-2 disabled:opacity-50"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                กำลังบันทึก...
                            </>
                        ) : (
                            <>
                                <Shield className="w-4 h-4" />
                                ยืนยันข้อมูล
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ===============================================
// COMPACT VERSION FOR INLINE USE
// ===============================================

export function AISpecConfirmationCompact({
    aiData,
    onConfirm
}: {
    aiData: AIGeneratedData
    onConfirm: (confirmed: boolean) => void
}) {
    const validation = aiData.validation || {
        isValid: true,
        confidence: 70,
        warnings: [],
        suggestedFixes: []
    }

    return (
        <div className="inline-flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            {/* Confidence Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${validation.isValid
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                    : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                }`}>
                {validation.isValid ? (
                    <CheckCircle className="w-4 h-4" />
                ) : (
                    <AlertTriangle className="w-4 h-4" />
                )}
                <span className="text-sm font-medium">{validation.confidence}%</span>
            </div>

            {/* Warnings Count */}
            {validation.warnings.length > 0 && (
                <span className="text-xs text-gray-500">
                    {validation.warnings.length} warnings
                </span>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => onConfirm(false)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    title="แก้ไข"
                >
                    <Edit3 className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onConfirm(true)}
                    className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                    title="ยืนยัน"
                >
                    <CheckCircle className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

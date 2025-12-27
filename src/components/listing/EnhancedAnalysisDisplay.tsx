'use client'

/**
 * ENHANCED ANALYSIS DISPLAY COMPONENT
 * 
 * แสดงผลการวิเคราะห์ AI แบบละเอียด:
 * - ประเภทสินค้า + ยี่ห้อ + รุ่น
 * - สเปค (Category-specific)
 * - จุดขาย
 * - สภาพ + คะแนน
 * - ความมั่นใจ
 * - หมายเหตุ/คำเตือน
 */

import React from 'react'
import {
    Package,
    Tag,
    Cpu,
    Star,
    AlertTriangle,
    CheckCircle,
    Info,
    TrendingUp,
    Eye
} from 'lucide-react'

interface ProductAnalysisDisplay {
    productType?: string
    brand?: string
    model?: string
    specs?: Record<string, string>
    sellingPoints?: string[]
    condition?: {
        label: string
        score: number
        details?: string
    }
    confidence?: {
        brand: number
        model: number
        specs: number
        overall?: number
    }
    notes?: string[]
    estimatedPrice?: {
        min: number
        max: number
        suggested: number
    }
}

interface AnalysisDisplayProps {
    analysis: ProductAnalysisDisplay
    className?: string
    compact?: boolean
}

// Confidence color based on value
function getConfidenceColor(value: number): string {
    if (value >= 80) return 'text-green-400'
    if (value >= 60) return 'text-yellow-400'
    if (value >= 40) return 'text-orange-400'
    return 'text-red-400'
}

function getConfidenceBg(value: number): string {
    if (value >= 80) return 'bg-green-500/20'
    if (value >= 60) return 'bg-yellow-500/20'
    if (value >= 40) return 'bg-orange-500/20'
    return 'bg-red-500/20'
}

// Confidence bar component
function ConfidenceBar({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-400 w-16">{label}</span>
            <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${value >= 80 ? 'bg-green-500' :
                            value >= 60 ? 'bg-yellow-500' :
                                value >= 40 ? 'bg-orange-500' :
                                    'bg-red-500'
                        }`}
                    style={{ width: `${value}%` }}
                />
            </div>
            <span className={`w-10 text-right ${getConfidenceColor(value)}`}>
                {value}%
            </span>
        </div>
    )
}

export default function EnhancedAnalysisDisplay({
    analysis,
    className = '',
    compact = false
}: AnalysisDisplayProps) {
    const overallConfidence = analysis.confidence?.overall ||
        Math.round(
            ((analysis.confidence?.brand || 50) +
                (analysis.confidence?.model || 50) +
                (analysis.confidence?.specs || 50)) / 3
        )

    if (compact) {
        return (
            <div className={`bg-gray-800/50 rounded-lg p-4 ${className}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-lg ${getConfidenceBg(overallConfidence)} flex items-center justify-center`}>
                        <Eye className={`w-6 h-6 ${getConfidenceColor(overallConfidence)}`} />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <span className="text-white font-medium">
                                {analysis.productType || 'สินค้า'}
                            </span>
                            {analysis.brand && (
                                <span className="text-purple-400">{analysis.brand}</span>
                            )}
                            {analysis.model && (
                                <span className="text-gray-400">{analysis.model}</span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                            <span className={getConfidenceColor(overallConfidence)}>
                                ความมั่นใจ {overallConfidence}%
                            </span>
                            {analysis.notes && analysis.notes.length > 0 && (
                                <span className="text-yellow-400">
                                    • {analysis.notes.length} หมายเหตุ
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-6 space-y-6 ${className}`}>
            {/* Header with Product Type */}
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-14 h-14 rounded-xl ${getConfidenceBg(overallConfidence)} flex items-center justify-center`}>
                        <Package className={`w-7 h-7 ${getConfidenceColor(overallConfidence)}`} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">
                            {analysis.productType || 'ไม่ระบุประเภท'}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            {analysis.brand && (
                                <span className="text-purple-400 font-medium">
                                    {analysis.brand}
                                </span>
                            )}
                            {analysis.brand && analysis.model && <span>•</span>}
                            {analysis.model && (
                                <span>{analysis.model}</span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Overall Confidence Badge */}
                <div className={`px-3 py-1.5 rounded-full ${getConfidenceBg(overallConfidence)}`}>
                    <span className={`text-sm font-medium ${getConfidenceColor(overallConfidence)}`}>
                        {overallConfidence >= 80 ? '✓ มั่นใจสูง' :
                            overallConfidence >= 60 ? '○ มั่นใจปานกลาง' :
                                overallConfidence >= 40 ? '⚠ มั่นใจต่ำ' :
                                    '⚠ ต้องตรวจสอบ'}
                    </span>
                </div>
            </div>

            {/* Specs Grid */}
            {analysis.specs && Object.keys(analysis.specs).length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <Cpu className="w-4 h-4" />
                        สเปค/คุณลักษณะ
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                        {Object.entries(analysis.specs).map(([key, value]) => (
                            value && (
                                <div key={key} className="bg-gray-700/50 rounded-lg px-3 py-2">
                                    <span className="text-xs text-gray-400">{key}</span>
                                    <p className="text-white font-medium">{value}</p>
                                </div>
                            )
                        ))}
                    </div>
                </div>
            )}

            {/* Selling Points */}
            {analysis.sellingPoints && analysis.sellingPoints.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <Star className="w-4 h-4" />
                        จุดขายหลัก
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {analysis.sellingPoints.map((point, idx) => (
                            <span
                                key={idx}
                                className="px-3 py-1.5 bg-green-500/20 text-green-400 rounded-full text-sm"
                            >
                                ✓ {point}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Condition */}
            {analysis.condition && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        สภาพสินค้า
                    </h4>
                    <div className="bg-gray-700/50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-white font-medium">
                                {analysis.condition.label}
                            </span>
                            <span className={`text-lg font-bold ${getConfidenceColor(analysis.condition.score)}`}>
                                {analysis.condition.score}%
                            </span>
                        </div>
                        <div className="w-full h-3 bg-gray-600 rounded-full overflow-hidden">
                            <div
                                className={`h-full rounded-full transition-all duration-500 ${analysis.condition.score >= 80 ? 'bg-green-500' :
                                        analysis.condition.score >= 60 ? 'bg-yellow-500' :
                                            'bg-orange-500'
                                    }`}
                                style={{ width: `${analysis.condition.score}%` }}
                            />
                        </div>
                        {analysis.condition.details && (
                            <p className="mt-2 text-sm text-gray-400">
                                {analysis.condition.details}
                            </p>
                        )}
                    </div>
                </div>
            )}

            {/* Confidence Breakdown */}
            {analysis.confidence && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        ความมั่นใจของระบบ
                    </h4>
                    <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                        <ConfidenceBar value={analysis.confidence.brand} label="ยี่ห้อ" />
                        <ConfidenceBar value={analysis.confidence.model} label="รุ่น" />
                        <ConfidenceBar value={analysis.confidence.specs} label="สเปค" />
                    </div>
                </div>
            )}

            {/* Notes & Warnings */}
            {analysis.notes && analysis.notes.length > 0 && (
                <div className="space-y-3">
                    <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        หมายเหตุ/คำแนะนำ
                    </h4>
                    <div className="space-y-2">
                        {analysis.notes.map((note, idx) => (
                            <div
                                key={idx}
                                className={`p-3 rounded-lg text-sm ${note.includes('⚠️')
                                        ? 'bg-yellow-500/10 border border-yellow-500/30 text-yellow-400'
                                        : 'bg-blue-500/10 border border-blue-500/30 text-blue-400'
                                    }`}
                            >
                                {note}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Estimated Price */}
            {analysis.estimatedPrice && analysis.estimatedPrice.suggested > 0 && (
                <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                        <span className="text-gray-300">ราคาแนะนำ</span>
                        <div className="text-right">
                            <p className="text-2xl font-bold text-white">
                                ฿{analysis.estimatedPrice.suggested.toLocaleString()}
                            </p>
                            {analysis.estimatedPrice.min > 0 && (
                                <p className="text-sm text-gray-400">
                                    ช่วงราคา ฿{analysis.estimatedPrice.min.toLocaleString()} - ฿{analysis.estimatedPrice.max.toLocaleString()}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

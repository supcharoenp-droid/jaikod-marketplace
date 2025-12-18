'use client'

/**
 * Image Enhancement Display Component
 * Shows professional quality scores, detected products, and enhancement results
 */

import React from 'react'
import { motion } from 'framer-motion'
import {
    Sparkles, Star, Shield, Eye, Zap, Image as ImageIcon,
    TrendingUp, AlertTriangle, CheckCircle2, XCircle
} from 'lucide-react'
import Image from 'next/image'
import {
    type ImageEnhancementResult,
    type EnhancedImage,
    getEnhancementMessage,
    getRiskStatusMessage
} from '@/services/professionalImageEnhancer'

interface ImageEnhancementDisplayProps {
    result: ImageEnhancementResult
    language: 'th' | 'en'
    onAcceptEnhancements?: () => void
    onRevertToOriginals?: () => void
}

export default function ImageEnhancementDisplay({
    result,
    language,
    onAcceptEnhancements,
    onRevertToOriginals
}: ImageEnhancementDisplayProps) {

    const content = {
        th: {
            quality_score: 'คะแนนคุณภาพ',
            hero_image: 'รูปหลัก',
            detected_product: 'สินค้าที่ตรวจพบ',
            enhancements: 'การปรับปรุงที่ใช้',
            background_removed: 'ลบพื้นหลัง',
            lighting_corrected: 'ปรับแสง',
            color_corrected: 'ปรับสี',
            auto_cropped: 'ครอปอัตโนมัติ',
            recommendations: 'คำแนะนำ',
            sales_impact: 'โอกาสเพิ่มยอดขาย',
            accept: 'ยอมรับการปรับปรุง',
            revert: 'ใช้ภาพต้นฉบับ',
            breakdown: 'รายละเอียดคะแนน',
            sharpness: 'ความคมชัด',
            lighting: 'แสงสว่าง',
            focus: 'โฟกัสสินค้า',
            background: 'พื้นหลัง',
            safety_check: 'การตรวจสอบความปลอดภัย'
        },
        en: {
            quality_score: 'Quality Score',
            hero_image: 'Main Image',
            detected_product: 'Detected Product',
            enhancements: 'Enhancements Applied',
            background_removed: 'Background Removed',
            lighting_corrected: 'Lighting Corrected',
            color_corrected: 'Color Corrected',
            auto_cropped: 'Auto Cropped',
            recommendations: 'Recommendations',
            sales_impact: 'Sales Impact',
            accept: 'Accept Enhancements',
            revert: 'Use Originals',
            breakdown: 'Score Breakdown',
            sharpness: 'Sharpness',
            lighting: 'Lighting',
            focus: 'Product Focus',
            background: 'Background',
            safety_check: 'Safety Check'
        }
    }

    const t = content[language]

    // Get hero image
    const heroImage = result.enhanced_images.find(img => img.is_hero)

    // Get quality color
    const getQualityColor = (score: number) => {
        if (score >= 85) return 'text-green-600'
        if (score >= 70) return 'text-blue-600'
        if (score >= 55) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getRiskColor = (status: string) => {
        if (status === 'safe') return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
        if (status === 'low_risk') return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
        if (status === 'medium_risk') return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'
        return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Main Quality Card */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800">
                <div className="flex items-start justify-between">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {getEnhancementMessage(result, language)}
                            </h3>
                        </div>

                        {/* Quality Score */}
                        <div className="mt-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {t.quality_score}
                                </span>
                                <span className={`text-2xl font-bold ${getQualityColor(result.image_score)}`}>
                                    {result.image_score}/100
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${result.image_score}%` }}
                                    transition={{ duration: 1, ease: 'easeOut' }}
                                    className={`h-3 rounded-full ${result.image_score >= 85 ? 'bg-green-500' :
                                            result.image_score >= 70 ? 'bg-blue-500' :
                                                result.image_score >= 55 ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                        }`}
                                />
                            </div>
                        </div>

                        {/* Sales Impact */}
                        {result.sales_impact_estimate !== undefined && result.sales_impact_estimate > 0 && (
                            <div className="mt-4 flex items-center gap-2 text-green-700 dark:text-green-300">
                                <TrendingUp className="w-4 h-4" />
                                <span className="text-sm font-medium">
                                    {t.sales_impact}: +{result.sales_impact_estimate}%
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Product Detection */}
            {result.detected_product && result.detected_product !== 'unknown' && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center gap-2">
                        <Eye className="w-5 h-5 text-blue-600" />
                        <div>
                            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                                {t.detected_product}
                            </p>
                            <p className="text-lg font-bold text-blue-700 dark:text-blue-300 capitalize">
                                {result.detected_product}
                                {result.detected_category && ` • ${result.detected_category}`}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Safety Check */}
            <div className={`rounded-xl p-4 border ${getRiskColor(result.risk_status)}`}>
                <div className="flex items-center gap-2">
                    {result.risk_status === 'safe' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                        <AlertTriangle className="w-5 h-5 text-orange-600" />
                    )}
                    <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {t.safety_check}
                        </p>
                        <p className="text-sm font-bold">
                            {getRiskStatusMessage(result.risk_status, language)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Image Gallery with Rankings */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5" />
                    {language === 'th' ? 'ภาพทั้งหมด (เรียงตามคุณภาพ)' : 'All Images (Sorted by Quality)'}
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {result.enhanced_images
                        .sort((a, b) => a.ranking - b.ranking)
                        .map((img, index) => (
                            <div key={img.id} className="relative">
                                <div className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 group">
                                    <Image
                                        src={img.enhanced_url || img.original_url}
                                        alt={`Product ${index + 1}`}
                                        fill
                                        className="object-cover"
                                    />

                                    {/* Hero Badge */}
                                    {img.is_hero && (
                                        <div className="absolute top-2 left-2 bg-purple-600 text-white text-xs px-2 py-1 rounded-full font-bold flex items-center gap-1">
                                            <Star className="w-3 h-3" />
                                            {t.hero_image}
                                        </div>
                                    )}

                                    {/* Quality Score */}
                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-bold">
                                        {img.quality_score}/100
                                    </div>

                                    {/* Enhancement Indicator */}
                                    {Object.values(img.enhancements_applied).some(v => v) && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-full">
                                            <Zap className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>

                                {/* Score Breakdown */}
                                <div className="mt-2 text-xs space-y-1">
                                    <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                                        <span>{t.sharpness}</span>
                                        <span className="font-medium">{img.sharpness_score}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-gray-600 dark:text-gray-400">
                                        <span>{t.lighting}</span>
                                        <span className="font-medium">{img.lighting_score}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Enhancements Applied */}
            {result.enhancement_applied && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                    <h4 className="font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        {t.enhancements}
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {result.enhanced_images.some(img => img.enhancements_applied.background_removed) && (
                            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                                <CheckCircle2 className="w-4 h-4" />
                                {t.background_removed}
                            </div>
                        )}
                        {result.enhanced_images.some(img => img.enhancements_applied.lighting_corrected) && (
                            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                                <CheckCircle2 className="w-4 h-4" />
                                {t.lighting_corrected}
                            </div>
                        )}
                        {result.enhanced_images.some(img => img.enhancements_applied.color_corrected) && (
                            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                                <CheckCircle2 className="w-4 h-4" />
                                {t.color_corrected}
                            </div>
                        )}
                        {result.enhanced_images.some(img => img.enhancements_applied.auto_cropped) && (
                            <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300">
                                <CheckCircle2 className="w-4 h-4" />
                                {t.auto_cropped}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-200 dark:border-blue-800">
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                        <Star className="w-5 h-5" />
                        {t.recommendations}
                    </h4>
                    <ul className="space-y-2">
                        {result.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                                <TrendingUp className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p>{rec.message[language]}</p>
                                    {rec.estimated_impact > 0 && (
                                        <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">
                                            {language === 'th' ? 'ผลกระทบ' : 'Impact'}: +{rec.estimated_impact}%
                                        </p>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Action Buttons */}
            {result.enhancement_applied && (
                <div className="flex gap-4">
                    <button
                        onClick={onAcceptEnhancements}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 shadow-lg"
                    >
                        <CheckCircle2 className="w-5 h-5" />
                        {t.accept}
                    </button>

                    <button
                        onClick={onRevertToOriginals}
                        className="flex-1 px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
                    >
                        <XCircle className="w-5 h-5" />
                        {t.revert}
                    </button>
                </div>
            )}
        </motion.div>
    )
}

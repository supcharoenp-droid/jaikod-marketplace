'use client'

import React, { useEffect, useState } from 'react'
import { Sparkles, Check, AlertTriangle, Wand2, Loader2, Eye } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { ProductImageAnalysis, ImageQualityAnalysis, getImageQualityFeedback, removeBackground, enhanceImage } from '@/services/aiImageAnalysis'

interface Step2ImageAnalysisProps {
    imageAnalysis?: ProductImageAnalysis
    onAnalysisComplete: (analysis: ProductImageAnalysis) => void
    language: 'th' | 'en'
}

export default function Step2ImageAnalysis({ imageAnalysis, language }: Step2ImageAnalysisProps) {
    const [enhancing, setEnhancing] = useState<number | null>(null)
    const [removingBg, setRemovingBg] = useState<number | null>(null)

    const content = {
        th: {
            title: 'AI วิเคราะห์คุณภาพภาพ',
            subtitle: 'AI กำลังตรวจสอบและแนะนำวิธีปรับปรุงภาพของคุณ',
            overallScore: 'คะแนนรวม',
            readyToPublish: 'พร้อมลงขาย',
            needsImprovement: 'ควรปรับปรุง',
            imageQuality: 'คุณภาพภาพ',
            suggestions: 'คำแนะนำจาก AI',
            enhanceImage: 'ปรับแสง',
            removeBackground: 'ลบพื้นหลัง',
            keepOriginal: 'ใช้ต้นฉบับ',
            processing: 'กำลังประมวลผล...',
            quality: {
                excellent: 'ยอดเยี่ยม',
                good: 'ดี',
                fair: 'พอใช้',
                poor: 'ต้องปรับปรุง'
            },
            scores: {
                sharpness: 'ความคมชัด',
                lighting: 'แสงสว่าง',
                visibility: 'มองเห็นสินค้า',
                background: 'พื้นหลัง'
            },
            backgroundComplexity: {
                simple: 'เรียบง่าย',
                moderate: 'ปานกลาง',
                complex: 'ซับซ้อน'
            }
        },
        en: {
            title: 'AI Image Quality Analysis',
            subtitle: 'AI is checking and suggesting ways to improve your images',
            overallScore: 'Overall Score',
            readyToPublish: 'Ready to Publish',
            needsImprovement: 'Needs Improvement',
            imageQuality: 'Image Quality',
            suggestions: 'AI Suggestions',
            enhanceImage: 'Enhance Light',
            removeBackground: 'Remove BG',
            keepOriginal: 'Keep Original',
            processing: 'Processing...',
            quality: {
                excellent: 'Excellent',
                good: 'Good',
                fair: 'Fair',
                poor: 'Needs Work'
            },
            scores: {
                sharpness: 'Sharpness',
                lighting: 'Lighting',
                visibility: 'Product Visibility',
                background: 'Background'
            },
            backgroundComplexity: {
                simple: 'Simple',
                moderate: 'Moderate',
                complex: 'Complex'
            }
        }
    }

    const t = content[language]

    const handleEnhance = async (index: number) => {
        setEnhancing(index)
        // Simulate enhancement
        await enhanceImage(imageAnalysis!.images[index].preview)
        setEnhancing(null)
    }

    const handleRemoveBackground = async (index: number) => {
        setRemovingBg(index)
        // Simulate background removal
        await removeBackground(imageAnalysis!.images[index].preview)
        setRemovingBg(null)
    }

    if (!imageAnalysis) {
        return (
            <div className="text-center py-12">
                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                    {t.processing}
                </p>
            </div>
        )
    }

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'text-green-600'
        if (score >= 70) return 'text-blue-600'
        if (score >= 50) return 'text-yellow-600'
        return 'text-red-600'
    }

    const getScoreBgColor = (score: number) => {
        if (score >= 85) return 'bg-green-100 dark:bg-green-900/30'
        if (score >= 70) return 'bg-blue-100 dark:bg-blue-900/30'
        if (score >= 50) return 'bg-yellow-100 dark:bg-yellow-900/30'
        return 'bg-red-100 dark:bg-red-900/30'
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Sparkles className="w-8 h-8 text-purple-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t.title}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    {t.subtitle}
                </p>
            </div>

            {/* Overall Score Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`${getScoreBgColor(imageAnalysis.overallScore)} border-2 ${imageAnalysis.overallScore >= 70 ? 'border-green-300' : 'border-yellow-300'
                    } rounded-2xl p-6`}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                            {t.overallScore}
                        </h3>
                        <p className={`text-3xl font-bold ${getScoreColor(imageAnalysis.overallScore)}`}>
                            {imageAnalysis.overallScore}/100
                        </p>
                    </div>
                    <div className="text-right">
                        {imageAnalysis.readyToPublish ? (
                            <div className="flex items-center gap-2 text-green-600">
                                <Check className="w-6 h-6" />
                                <span className="font-semibold">{t.readyToPublish}</span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 text-yellow-600">
                                <AlertTriangle className="w-6 h-6" />
                                <span className="font-semibold">{t.needsImprovement}</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            {/* Image Grid with Analysis */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {imageAnalysis.images.map((img, index) => {
                    const analysis = img.analysis
                    const feedback = getImageQualityFeedback(analysis, language)

                    return (
                        <motion.div
                            key={img.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            {/* Image Preview */}
                            <div className="relative aspect-square">
                                <Image
                                    src={img.preview}
                                    alt={`Product ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                                {img.isCover && (
                                    <div className="absolute top-3 left-3 bg-purple-600 text-white text-xs px-3 py-1 rounded-full font-medium">
                                        {language === 'th' ? 'รูปหลัก' : 'Cover'}
                                    </div>
                                )}
                                <div className={`absolute top-3 right-3 ${getScoreBgColor(analysis.qualityScore)} px-3 py-1 rounded-full text-sm font-bold ${getScoreColor(analysis.qualityScore)}`}>
                                    {analysis.qualityScore}
                                </div>
                            </div>

                            {/* Analysis Details */}
                            <div className="p-4 space-y-3">
                                {/* Feedback */}
                                <p className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                                    {feedback}
                                </p>

                                {/* Quality Metrics */}
                                <div className="grid grid-cols-2 gap-2 text-xs">
                                    <div>
                                        <span className="text-gray-500">{t.scores.sharpness}:</span>
                                        <span className={`ml-1 font-medium ${getScoreColor(analysis.qualityScore)}`}>
                                            {t.quality[analysis.sharpness]}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">{t.scores.lighting}:</span>
                                        <span className={`ml-1 font-medium ${getScoreColor(analysis.qualityScore)}`}>
                                            {t.quality[analysis.lighting]}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">{t.scores.visibility}:</span>
                                        <span className={`ml-1 font-medium ${getScoreColor(analysis.qualityScore)}`}>
                                            {t.quality[analysis.objectVisibility]}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-500">{t.scores.background}:</span>
                                        <span className="ml-1 font-medium text-gray-700 dark:text-gray-300">
                                            {t.backgroundComplexity[analysis.backgroundComplexity]}
                                        </span>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                {analysis.recommendations.length > 0 && (
                                    <div className="flex gap-2 pt-2">
                                        {analysis.recommendations.some(r => r.type === 'background_removal') && (
                                            <button
                                                onClick={() => handleRemoveBackground(index)}
                                                disabled={removingBg === index}
                                                className="flex-1 px-3 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-medium hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                                            >
                                                {removingBg === index ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <Wand2 className="w-3 h-3" />
                                                )}
                                                {t.removeBackground}
                                            </button>
                                        )}
                                        {analysis.recommendations.some(r => r.type === 'light_enhancement') && (
                                            <button
                                                onClick={() => handleEnhance(index)}
                                                disabled={enhancing === index}
                                                className="flex-1 px-3 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all disabled:opacity-50 flex items-center justify-center gap-1"
                                            >
                                                {enhancing === index ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <Sparkles className="w-3 h-3" />
                                                )}
                                                {t.enhanceImage}
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* General Suggestions */}
            {imageAnalysis.suggestions[language].length > 0 && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        {t.suggestions}
                    </h4>
                    <ul className="space-y-2">
                        {imageAnalysis.suggestions[language].map((suggestion, index) => (
                            <li key={index} className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2">
                                <span className="text-blue-600 mt-1">•</span>
                                <span>{suggestion}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

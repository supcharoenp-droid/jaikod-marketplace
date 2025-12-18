'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sparkles, CheckCircle, AlertTriangle, Image as ImageIcon,
    Wand2, Zap, TrendingUp, Shield, Eye, Crop, Layers,
    RotateCw, Star, AlertCircle, XCircle
} from 'lucide-react'

interface ImageAnalysis {
    quality_score: number
    quality_grade: 'A' | 'B' | 'C' | 'D' | 'F'
    issues: string[]
    suggestions: string[]
    is_prohibited: boolean
    prohibited_reason?: string
    detected_objects: string[]
    category_suggestion: string
    recommended_as_main: boolean
    background_removed?: string // URL to processed image
    enhanced_image?: string // URL to enhanced image
}

interface AIImageProcessorProps {
    images: File[]
    onProcessingComplete: (results: {
        analyses: ImageAnalysis[]
        mainImageIndex: number
        overallScore: number
        optimizationTips: string[]
    }) => void
    language: 'th' | 'en'
}

export default function AIImageProcessor({ images, onProcessingComplete, language }: AIImageProcessorProps) {
    const [currentProcessing, setCurrentProcessing] = useState(0)
    const [analyses, setAnalyses] = useState<ImageAnalysis[]>([])
    const [processingStage, setProcessingStage] = useState<
        'analyzing' | 'enhancing' | 'optimizing' | 'complete'
    >('analyzing')

    const content = {
        th: {
            title: 'AI กำลังปรับแต่งภาพของคุณ',
            subtitle: 'ระบบอัจฉริยะกำลังวิเคราะห์และปรับปรุงภาพให้เป็นมืออาชีพ',
            stages: {
                analyzing: 'วิเคราะห์คุณภาพภาพ',
                enhancing: 'ปรับแต่งภาพอัตโนมัติ',
                optimizing: 'จัดเรียงและเพิ่มประสิทธิภาพ',
                complete: 'เสร็จสิ้น!'
            },
            features: {
                quality: 'ตรวจคุณภาพ',
                safety: 'ตรวจสอบความปลอดภัย',
                objects: 'แยกวัตถุ',
                background: 'ลบพื้นหลัง',
                enhance: 'ปรับแต่งภาพ',
                arrange: 'จัดเรียงภาพ'
            },
            tips: {
                addMore: 'เพิ่มอีก 1 ภาพ จะขายได้ดีขึ้น ~18%',
                quality: 'ภาพคุณภาพดี ช่วยเพิ่มโอกาสขาย',
                main: 'ภาพหลักที่แนะนำ',
                prohibited: 'ภาพอาจไม่เหมาะสม'
            }
        },
        en: {
            title: 'AI is Enhancing Your Images',
            subtitle: 'Smart system analyzing and optimizing images professionally',
            stages: {
                analyzing: 'Analyzing Image Quality',
                enhancing: 'Auto-Enhancing Images',
                optimizing: 'Arranging & Optimizing',
                complete: 'Complete!'
            },
            features: {
                quality: 'Quality Check',
                safety: 'Safety Check',
                objects: 'Object Detection',
                background: 'Remove Background',
                enhance: 'Enhance Image',
                arrange: 'Arrange Images'
            },
            tips: {
                addMore: 'Add 1 more photo, sell ~18% better',
                quality: 'Good quality increases sales',
                main: 'Recommended main image',
                prohibited: 'Image may be inappropriate'
            }
        }
    }

    const t = content[language]

    // Simulate AI processing
    useEffect(() => {
        const processImages = async () => {
            const results: ImageAnalysis[] = []

            for (let i = 0; i < images.length; i++) {
                setCurrentProcessing(i)

                // Stage 1: Analyzing
                setProcessingStage('analyzing')
                await new Promise(resolve => setTimeout(resolve, 800))

                const analysis = await analyzeImage(images[i], i)

                // Stage 2: Enhancing
                if (analysis.quality_score < 80) {
                    setProcessingStage('enhancing')
                    await new Promise(resolve => setTimeout(resolve, 600))
                    analysis.enhanced_image = await enhanceImage(images[i])
                }

                results.push(analysis)
                setAnalyses(results)
            }

            // Stage 3: Optimizing
            setProcessingStage('optimizing')
            await new Promise(resolve => setTimeout(resolve, 500))

            // Calculate overall metrics
            const mainImageIndex = results.findIndex(r => r.recommended_as_main) || 0
            const overallScore = Math.round(
                results.reduce((acc, r) => acc + r.quality_score, 0) / results.length
            )

            const optimizationTips = generateOptimizationTips(results, images.length)

            // Stage 4: Complete
            setProcessingStage('complete')
            await new Promise(resolve => setTimeout(resolve, 400))

            onProcessingComplete({
                analyses: results,
                mainImageIndex,
                overallScore,
                optimizationTips
            })
        }

        processImages()
    }, [images])

    // AI Analysis Functions
    const analyzeImage = async (image: File, index: number): Promise<ImageAnalysis> => {
        // Simulate AI analysis
        const quality_score = 65 + Math.random() * 30
        const quality_grade = getQualityGrade(quality_score)

        return {
            quality_score: Math.round(quality_score),
            quality_grade,
            issues: generateIssues(quality_score),
            suggestions: generateSuggestions(quality_score),
            is_prohibited: Math.random() < 0.05, // 5% chance
            detected_objects: ['product', 'background'],
            category_suggestion: 'electronics',
            recommended_as_main: index === 0 && quality_score > 75
        }
    }

    const enhanceImage = async (image: File): Promise<string> => {
        // Simulate image enhancement
        return URL.createObjectURL(image)
    }

    const getQualityGrade = (score: number): 'A' | 'B' | 'C' | 'D' | 'F' => {
        if (score >= 90) return 'A'
        if (score >= 80) return 'B'
        if (score >= 70) return 'C'
        if (score >= 60) return 'D'
        return 'F'
    }

    const generateIssues = (score: number): string[] => {
        const issues = []
        if (score < 70) issues.push('ความคมชัดต่ำ')
        if (score < 65) issues.push('แสงไม่เพียงพอ')
        if (score < 60) issues.push('ภาพเบลอ')
        return issues
    }

    const generateSuggestions = (score: number): string[] => {
        const suggestions = []
        if (score < 80) suggestions.push('เพิ่มแสงสว่าง')
        if (score < 75) suggestions.push('ถ่ายภาพใกล้ขึ้น')
        if (score < 70) suggestions.push('ใช้พื้นหลังสีเรียบ')
        return suggestions
    }

    const generateOptimizationTips = (analyses: ImageAnalysis[], imageCount: number): string[] => {
        const tips = []

        const avgScore = analyses.reduce((acc, a) => acc + a.quality_score, 0) / analyses.length

        if (imageCount < 5) {
            tips.push(t.tips.addMore)
        }

        if (avgScore > 80) {
            tips.push(t.tips.quality)
        }

        const prohibited = analyses.find(a => a.is_prohibited)
        if (prohibited) {
            tips.push(t.tips.prohibited)
        }

        return tips
    }

    const progress = ((currentProcessing + 1) / images.length) * 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl"
            >
                {/* Header */}
                <div className="text-center mb-8">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 mb-4 shadow-lg"
                    >
                        <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {t.title}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t.subtitle}
                    </p>
                </div>

                {/* Processing Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-6">
                    {/* Progress Bar */}
                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600 dark:text-gray-400">
                                {t.stages[processingStage]}
                            </span>
                            <span className="font-semibold text-purple-600">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                            />
                        </div>
                    </div>

                    {/* Processing Features Grid */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                        {[
                            { icon: Eye, label: t.features.quality, active: processingStage === 'analyzing' },
                            { icon: Shield, label: t.features.safety, active: processingStage === 'analyzing' },
                            { icon: Layers, label: t.features.objects, active: processingStage === 'analyzing' },
                            { icon: Crop, label: t.features.background, active: processingStage === 'enhancing' },
                            { icon: Wand2, label: t.features.enhance, active: processingStage === 'enhancing' },
                            { icon: RotateCw, label: t.features.arrange, active: processingStage === 'optimizing' },
                        ].map((feature, idx) => (
                            <motion.div
                                key={idx}
                                animate={{
                                    scale: feature.active ? 1.05 : 1,
                                    opacity: feature.active ? 1 : 0.5
                                }}
                                className={`p-3 rounded-xl border-2 transition-all ${feature.active
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                        : 'border-gray-200 dark:border-gray-700'
                                    }`}
                            >
                                <feature.icon className={`w-6 h-6 mx-auto mb-1 ${feature.active ? 'text-purple-600' : 'text-gray-400'
                                    }`} />
                                <p className="text-xs text-center font-medium text-gray-700 dark:text-gray-300">
                                    {feature.label}
                                </p>
                            </motion.div>
                        ))}
                    </div>

                    {/* Current Image Preview */}
                    <div className="text-center">
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {language === 'th' ? 'กำลังประมวลผล' : 'Processing'}: {currentProcessing + 1} / {images.length}
                        </p>

                        {/* Analysis Results */}
                        {analyses.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 mt-4">
                                {analyses.map((analysis, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                                {language === 'th' ? 'ภาพ' : 'Photo'} {idx + 1}
                                            </span>
                                            <div className={`px-2 py-0.5 rounded text-xs font-bold ${analysis.quality_grade === 'A' ? 'bg-green-100 text-green-700' :
                                                    analysis.quality_grade === 'B' ? 'bg-blue-100 text-blue-700' :
                                                        analysis.quality_grade === 'C' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-red-100 text-red-700'
                                                }`}>
                                                {analysis.quality_grade}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                                <div
                                                    style={{ width: `${analysis.quality_score}%` }}
                                                    className={`h-full ${analysis.quality_score >= 80 ? 'bg-green-500' :
                                                            analysis.quality_score >= 60 ? 'bg-yellow-500' :
                                                                'bg-red-500'
                                                        }`}
                                                />
                                            </div>
                                            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                                {analysis.quality_score}
                                            </span>
                                        </div>
                                        {analysis.recommended_as_main && (
                                            <div className="mt-2 flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400">
                                                <Star className="w-3 h-3 fill-current" />
                                                <span>{language === 'th' ? 'แนะนำ' : 'Main'}</span>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Tips Section */}
                {processingStage === 'complete' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800"
                    >
                        <div className="flex items-start gap-3">
                            <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                                    {language === 'th' ? 'ปรับแต่งเสร็จสิ้น!' : 'Enhancement Complete!'}
                                </h3>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    {language === 'th'
                                        ? 'ระบบได้ปรับปรุงภาพของคุณให้มีคุณภาพดีขึ้นแล้ว'
                                        : 'Your images have been professionally enhanced'
                                    }
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </motion.div>
        </div>
    )
}

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Sparkles, CheckCircle2, Zap, Shield, Eye,
    TrendingUp, Image as ImageIcon, ArrowRight, Brain
} from 'lucide-react'

import { enhanceProductImages, ImageEnhancementResult } from '@/services/professionalImageEnhancer'
import { analyzeProductForListing, ListingAssistantResult } from '@/services/intelligentListingAssistant'

interface AIProcessingVisualProps {
    images: File[]
    language: 'th' | 'en'
    onComplete: (result: {
        imageAnalysis: ImageEnhancementResult
        aiSuggestions: ListingAssistantResult
    }) => void
}

type ProcessingStage = 'quality' | 'safety' | 'detection' | 'enhancement' | 'category' | 'complete'

interface ProcessingTask {
    id: ProcessingStage
    icon: React.ElementType
    title: { th: string; en: string }
    description: { th: string; en: string }
    duration: number
    color: string
}

const PROCESSING_TASKS: ProcessingTask[] = [
    {
        id: 'quality',
        icon: Eye,
        title: { th: 'วิเคราะห์คุณภาพภาพ', en: 'Analyzing Image Quality' },
        description: { th: 'ตรวจสอบความคมชัด แสง มุมถ่าย', en: 'Checking clarity, lighting, angles' },
        duration: 1500,
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'safety',
        icon: Shield,
        title: { th: 'ตรวจสอบความปลอดภัย', en: 'Safety Check' },
        description: { th: 'ตรวจจับภาพต้องห้าม/ผิดกฎหมาย', en: 'Detecting prohibited content' },
        duration: 1200,
        color: 'from-green-500 to-emerald-500'
    },
    {
        id: 'detection',
        icon: Brain,
        title: { th: 'แยกวัตถุและประเภทสินค้า', en: 'Object & Category Detection' },
        description: { th: 'ระบุสินค้าและจำแนกหมวดหมู่', en: 'Identifying product and category' },
        duration: 1800,
        color: 'from-purple-500 to-pink-500'
    },
    {
        id: 'enhancement',
        icon: Sparkles,
        title: { th: 'ปรับแต่งภาพอัตโนมัติ', en: 'Auto Enhancement' },
        description: { th: 'แต่งภาพให้ดูเป็นมืออาชีพ', en: 'Professional image enhancement' },
        duration: 2000,
        color: 'from-yellow-500 to-orange-500'
    },
    {
        id: 'category',
        icon: TrendingUp,
        title: { th: 'วิเคราะห์ข้อมูลสินค้า', en: 'Product Analysis' },
        description: { th: 'สร้างคำแนะนำและหมวดหมู่', en: 'Generating suggestions and categories' },
        duration: 1500,
        color: 'from-indigo-500 to-purple-500'
    }
]

export default function AIProcessingVisual({ images, language, onComplete }: AIProcessingVisualProps) {
    const [currentStage, setCurrentStage] = useState<ProcessingStage>('quality')
    const [completedStages, setCompletedStages] = useState<ProcessingStage[]>([])
    const [imageAnalysis, setImageAnalysis] = useState<ImageEnhancementResult | null>(null)
    const [aiSuggestions, setAiSuggestions] = useState<ListingAssistantResult | null>(null)

    const content = {
        th: {
            title: 'AI กำลังวิเคราะห์รูปของคุณ',
            subtitle: 'รอสักครู่ เราจะทำให้รูปดูดีที่สุด',
            processing: 'กำลังประมวลผล',
            complete: 'เสร็จสมบูรณ์',
            analyzing: 'กำลังวิเคราะห์',
            done: 'เสร็จสิ้น',
            allDone: 'ทุกอย่างพร้อมแล้ว!',
            autoNext: 'กำลังไปขั้นตอนถัดไปอัตโนมัติ...',
            stats: {
                images: 'รูปทั้งหมด',
                quality: 'คะแนนเฉลี่ย',
                detected: 'ตรวจพบ',
                enhanced: 'ปรับแต่งแล้ว'
            }
        },
        en: {
            title: 'AI is Analyzing Your Photos',
            subtitle: 'Please wait while we make your photos look their best',
            processing: 'Processing',
            complete: 'Complete',
            analyzing: 'Analyzing',
            done: 'Done',
            allDone: 'All Done!',
            autoNext: 'Moving to next step automatically...',
            stats: {
                images: 'Total Images',
                quality: 'Avg Quality',
                detected: 'Detected',
                enhanced: 'Enhanced'
            }
        }
    }

    const t = content[language]

    // Run AI processing
    useEffect(() => {
        let isMounted = true

        const runAIProcessing = async () => {
            try {
                // Process each stage sequentially
                for (const task of PROCESSING_TASKS) {
                    if (!isMounted) break

                    setCurrentStage(task.id)

                    // Simulate processing time
                    await new Promise(resolve => setTimeout(resolve, task.duration))

                    // Run actual AI when appropriate
                    if (task.id === 'enhancement' && !imageAnalysis) {
                        const result = await enhanceProductImages(images, { auto_enhance: true })
                        if (isMounted) {
                            setImageAnalysis(result)
                        }
                    }

                    if (task.id === 'category' && imageAnalysis && !aiSuggestions) {
                        const suggestions = await analyzeProductForListing({
                            detected_product: imageAnalysis.detected_product || 'unknown',
                            detected_category: imageAnalysis.detected_category,
                            images_count: images.length
                        })
                        if (isMounted) {
                            setAiSuggestions(suggestions)
                        }
                    }

                    if (isMounted) {
                        setCompletedStages(prev => [...prev, task.id])
                    }
                }

                // Mark as complete
                if (isMounted) {
                    setCurrentStage('complete')

                    // Auto-proceed after showing completion
                    setTimeout(() => {
                        if (isMounted && imageAnalysis && aiSuggestions) {
                            onComplete({ imageAnalysis, aiSuggestions })
                        }
                    }, 2000)
                }
            } catch (error) {
                console.error('AI Processing error:', error)
            }
        }

        runAIProcessing()

        return () => {
            isMounted = false
        }
    }, [images, imageAnalysis, aiSuggestions, onComplete])

    const currentTaskIndex = PROCESSING_TASKS.findIndex(task => task.id === currentStage)
    const progress = currentStage === 'complete'
        ? 100
        : ((completedStages.length / PROCESSING_TASKS.length) * 100)

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
            >
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 mb-6 shadow-2xl">
                    <Sparkles className="w-10 h-10 text-white animate-pulse" />
                </div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {t.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    {t.subtitle}
                </p>
            </motion.div>

            {/* Overall Progress Bar */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {t.processing}
                    </span>
                    <span className="text-sm font-bold text-purple-600">
                        {Math.round(progress)}%
                    </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                    />
                </div>
            </div>

            {/* Processing Tasks */}
            <div className="space-y-4 mb-12">
                {PROCESSING_TASKS.map((task, index) => {
                    const isCompleted = completedStages.includes(task.id)
                    const isCurrent = currentStage === task.id
                    const isPending = !isCompleted && !isCurrent

                    return (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${isCurrent
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg scale-105'
                                    : isCompleted
                                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                        : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon */}
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${isCompleted
                                        ? 'bg-green-500'
                                        : isCurrent
                                            ? `bg-gradient-to-br ${task.color}`
                                            : 'bg-gray-200 dark:bg-gray-700'
                                    }`}>
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-7 h-7 text-white" />
                                    ) : (
                                        <task.icon className={`w-7 h-7 ${isCurrent ? 'text-white animate-pulse' : 'text-gray-500'
                                            }`} />
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <h3 className={`text-lg font-bold mb-1 ${isCurrent
                                            ? 'text-purple-900 dark:text-purple-100'
                                            : isCompleted
                                                ? 'text-green-900 dark:text-green-100'
                                                : 'text-gray-600 dark:text-gray-400'
                                        }`}>
                                        {task.title[language]}
                                    </h3>
                                    <p className={`text-sm ${isCurrent
                                            ? 'text-purple-700 dark:text-purple-300'
                                            : isCompleted
                                                ? 'text-green-700 dark:text-green-300'
                                                : 'text-gray-500 dark:text-gray-500'
                                        }`}>
                                        {task.description[language]}
                                    </p>
                                </div>

                                {/* Status */}
                                <div>
                                    {isCompleted ? (
                                        <span className="px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full">
                                            {t.done}
                                        </span>
                                    ) : isCurrent ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-purple-600 rounded-full animate-ping" />
                                            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                                {t.analyzing}
                                            </span>
                                        </div>
                                    ) : null}
                                </div>
                            </div>

                            {/* Progress bar for current task */}
                            {isCurrent && (
                                <div className="mt-4 h-1 bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: '0%' }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: task.duration / 1000, ease: 'linear' }}
                                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                                    />
                                </div>
                            )}
                        </motion.div>
                    )
                })}
            </div>

            {/* Stats Cards */}
            {imageAnalysis && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                >
                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                            <ImageIcon className="w-4 h-4 text-blue-600" />
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {t.stats.images}
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {images.length}
                        </p>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                            <Eye className="w-4 h-4 text-purple-600" />
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {t.stats.quality}
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-purple-600">
                            {imageAnalysis.image_score}/100
                        </p>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                            <Brain className="w-4 h-4 text-green-600" />
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {t.stats.detected}
                            </p>
                        </div>
                        <p className="text-lg font-bold text-green-600 truncate">
                            {imageAnalysis.detected_product || 'N/A'}
                        </p>
                    </div>

                    <div className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-1">
                            <Sparkles className="w-4 h-4 text-yellow-600" />
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                {t.stats.enhanced}
                            </p>
                        </div>
                        <p className="text-2xl font-bold text-yellow-600">
                            {imageAnalysis.enhanced_images.length}
                        </p>
                    </div>
                </motion.div>
            )}

            {/* Completion State */}
            {currentStage === 'complete' && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                >
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 mb-6 shadow-2xl">
                        <CheckCircle2 className="w-12 h-12 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {t.allDone}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {t.autoNext}
                    </p>

                    <div className="flex items-center justify-center gap-2 text-purple-600">
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 bg-purple-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                </motion.div>
            )}
        </div>
    )
}

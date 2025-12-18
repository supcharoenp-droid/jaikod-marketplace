'use client'

import React, { useRef, useState } from 'react'
import { Camera, Upload, X, Image as ImageIcon, Sparkles, CheckCircle2, AlertCircle, Info, Loader2, Star, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
    processImageIntake,
    getIntakeMessage,
    type ImageIntakeResult,
    type ProcessedImage
} from '@/services/intelligentImageIntake'

interface Step1ImageUploadProps {
    images: File[]
    onImagesChange: (images: File[]) => void
    language: 'th' | 'en'
}

export default function Step1ImageUpload({ images, onImagesChange, language }: Step1ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Intelligent Image Intake State
    const [isProcessing, setIsProcessing] = useState(false)
    const [intakeResult, setIntakeResult] = useState<ImageIntakeResult | null>(null)
    const [showFeedback, setShowFeedback] = useState(true)
    const [isDragging, setIsDragging] = useState(false)

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length > 0) {
            const newImages = [...images, ...files].slice(0, 10)
            onImagesChange(newImages)
            await processImagesIntelligently(newImages)
        }
    }

    /**
     * Process images through Intelligent Image Intake AI
     */
    const processImagesIntelligently = async (imageFiles: File[]) => {
        if (imageFiles.length === 0) return

        setIsProcessing(true)
        setShowFeedback(true)

        try {
            const result = await processImageIntake(imageFiles)
            setIntakeResult(result)
        } catch (error) {
            console.error('[AI Intake] Error:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        onImagesChange(newImages)

        if (newImages.length > 0) {
            processImagesIntelligently(newImages)
        } else {
            setIntakeResult(null)
        }
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)
        const imageFiles = files.filter(file => file.type.startsWith('image/'))

        if (imageFiles.length > 0) {
            const newImages = [...images, ...imageFiles].slice(0, 10)
            onImagesChange(newImages)
            await processImagesIntelligently(newImages)
        }
    }

    const content = {
        th: {
            title: 'อัพโหลดรูปภาพสินค้า',
            subtitle: 'เพิ่มรูปสวยๆ ของคุณ AI จะช่วยวิเคราะห์และปรับปรุงให้อัตโนมัติ ✨',
            uploadButton: 'เลือกรูปภาพ',
            dragDrop: 'หรือลากไฟล์มาวางที่นี่',
            imageCount: 'รูปภาพที่เพิ่ม',
            maxImages: 'เพิ่มได้สูงสุด 10 รูป • รองรับ JPG, PNG, HEIC, WEBP',
            tips: {
                title: '💡 เคล็ดลับถ่ายรูปให้ปัง',
                items: [
                    '📸 ถ่ายในที่มีแสงสว่างเพียงพอ',
                    '🎯 เน้นสินค้าให้ชัดเจน พื้นหลังเรียบง่าย',
                    '📐 ถ่ายหลายมุม แสดงรายละเอียด',
                    '✨ AI จะช่วยลบพื้นหลังและปรับแสงอัตโนมัติ'
                ]
            },
            aiFeature: '🤖 AI วิเคราะห์คุณภาพภาพและให้คำแนะนำในทันที',
            processing: 'AI กำลังวิเคราะห์...',
            analysisComplete: 'วิเคราะห์เสร็จแล้ว'
        },
        en: {
            title: 'Upload Product Images',
            subtitle: 'Add beautiful photos. AI will analyze and enhance automatically ✨',
            uploadButton: 'Select Images',
            dragDrop: 'or drag and drop files here',
            imageCount: 'Images added',
            maxImages: 'Maximum 10 images • Supports JPG, PNG, HEIC, WEBP',
            tips: {
                title: '💡 Pro Photo Tips',
                items: [
                    '📸 Take photos in good lighting',
                    '🎯 Focus on product, simple background',
                    '📐 Multiple angles showing details',
                    '✨ AI will auto-remove background and adjust lighting'
                ]
            },
            aiFeature: '🤖 AI analyzes image quality and provides instant feedback',
            processing: 'AI analyzing...',
            analysisComplete: 'Analysis complete'
        }
    }

    const t = content[language]

    return (
        <div className="space-y-8">
            {/* Premium Header with Gradient */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center relative"
            >
                {/* Decorative gradient orbs */}
                <div className="absolute -top-20 left-1/4 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -top-20 right-1/4 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

                <div className="relative">
                    <motion.div
                        className="inline-flex items-center justify-center gap-3 mb-3"
                        whileHover={{ scale: 1.05 }}
                        transition={{ type: "spring", stiffness: 400 }}
                    >
                        <div className="relative">
                            <Camera className="w-10 h-10 text-purple-600" />
                            <motion.div
                                className="absolute -top-1 -right-1"
                                animate={{ rotate: [0, 10, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Sparkles className="w-5 h-5 text-pink-500" />
                            </motion.div>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600">
                            {t.title}
                        </h2>
                    </motion.div>
                    <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>
            </motion.div>

            {/* Premium Upload Area with Glassmorphism */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className={`relative group overflow-hidden rounded-3xl transition-all duration-300 ${isDragging
                        ? 'scale-105 shadow-2xl shadow-purple-500/50'
                        : 'hover:shadow-xl'
                    }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
            >
                {/* Glassmorphism background */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-100/80 via-pink-100/80 to-blue-100/80 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20 backdrop-blur-xl"></div>

                {/* Animated border gradient */}
                <div className={`absolute inset-0 rounded-3xl border-2 transition-all duration-300 ${isDragging
                        ? 'border-purple-500 border-dashed'
                        : 'border-purple-200 dark:border-purple-800 border-dashed'
                    }`}></div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-pink-400/10 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="relative p-12 text-center cursor-pointer">
                    <div className="flex flex-col items-center gap-6">
                        {/* Animated upload icon */}
                        <motion.div
                            className="relative"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl shadow-purple-500/50">
                                <Upload className="w-12 h-12 text-white" />
                            </div>
                            {/* Pulse ring */}
                            <div className="absolute inset-0 bg-purple-500 rounded-full opacity-20 animate-ping"></div>
                        </motion.div>

                        <div className="space-y-3">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button"
                                className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl shadow-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/70 transition-all bg-[length:200%_100%] hover:bg-right-bottom"
                            >
                                <span className="flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    {t.uploadButton}
                                </span>
                            </motion.button>

                            <p className="text-gray-600 dark:text-gray-400 font-medium">
                                {t.dragDrop}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 px-4 py-2 rounded-full backdrop-blur-sm">
                            <Info className="w-4 h-4" />
                            {t.maxImages}
                        </div>
                    </div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            </motion.div>

            {/* Premium Image Grid */}
            <AnimatePresence>
                {images.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
                                {t.imageCount}: {images.length}/10
                            </h3>

                            {/* Progress bar */}
                            <div className="flex-1 max-w-xs ml-6">
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(images.length / 10) * 100}%` }}
                                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                                        transition={{ duration: 0.5, ease: "easeOut" }}
                                    ></motion.div>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            <AnimatePresence>
                                {images.map((file, index) => (
                                    <motion.div
                                        key={index}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8, rotateY: -180 }}
                                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                                        exit={{ opacity: 0, scale: 0.5, rotateY: 180 }}
                                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                        className="relative group"
                                    >
                                        {/* Image card with glassmorphism */}
                                        <div className="relative aspect-square rounded-2xl overflow-hidden border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-100/50 to-pink-100/50 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm shadow-lg group-hover:shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-300">
                                            <Image
                                                src={URL.createObjectURL(file)}
                                                alt={`Product ${index + 1}`}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />

                                            {/* Overlay gradient */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {/* Cover badge */}
                                            {index === 0 && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-bold shadow-xl flex items-center gap-1"
                                                >
                                                    <Star className="w-3 h-3 fill-white" />
                                                    {language === 'th' ? 'รูปหลัก' : 'Cover'}
                                                </motion.div>
                                            )}

                                            {/* Remove button */}
                                            <motion.button
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleRemoveImage(index)
                                                }}
                                                className="absolute top-3 right-3 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 shadow-xl z-10"
                                            >
                                                <X className="w-4 h-4" />
                                            </motion.button>

                                            {/* Number badge */}
                                            <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-2 py-1 rounded-full font-bold backdrop-blur-sm">
                                                #{index + 1}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Processing Indicator */}
            <AnimatePresence>
                {isProcessing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-purple-200 dark:border-purple-800 p-6"
                    >
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-blue-500/5 animate-gradient-x"></div>

                        <div className="relative flex items-center gap-4">
                            <div className="relative">
                                <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
                                <div className="absolute inset-0 bg-purple-500 rounded-full opacity-20 animate-ping"></div>
                            </div>
                            <div className="flex-1">
                                <p className="text-lg font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-500" />
                                    {t.processing}
                                </p>
                                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                                    {language === 'th'
                                        ? 'กำลังตรวจสอบคุณภาพ, ความคมชัด, แสงสว่าง...'
                                        : 'Checking quality, sharpness, lighting...'}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* AI Feedback with Premium Design */}
            <AnimatePresence>
                {!isProcessing && intakeResult && showFeedback && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-4"
                    >
                        {/* Main status card */}
                        <motion.div
                            layout
                            className={`relative overflow-hidden rounded-2xl p-6 border-2 ${intakeResult.status === 'ready_for_enhancement'
                                    ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 border-green-300 dark:border-green-800'
                                    : 'bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-amber-900/20 border-yellow-300 dark:border-yellow-800'
                                }`}
                        >
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16"></div>

                            <div className="relative flex items-start gap-4">
                                <div className={`p-3 rounded-2xl ${intakeResult.status === 'ready_for_enhancement'
                                        ? 'bg-green-500 shadow-lg shadow-green-500/50'
                                        : 'bg-yellow-500 shadow-lg shadow-yellow-500/50'
                                    }`}>
                                    {intakeResult.status === 'ready_for_enhancement' ? (
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    ) : (
                                        <AlertCircle className="w-6 h-6 text-white" />
                                    )}
                                </div>

                                <div className="flex-1">
                                    <p className={`text-lg font-bold ${intakeResult.status === 'ready_for_enhancement'
                                            ? 'text-green-900 dark:text-green-100'
                                            : 'text-yellow-900 dark:text-yellow-100'
                                        }`}>
                                        {getIntakeMessage(intakeResult, language)}
                                    </p>

                                    {/* Quality score */}
                                    {intakeResult.processed_images.length > 0 && (
                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="font-medium opacity-80">
                                                    {language === 'th' ? 'คะแนนคุณภาพเฉลี่ย' : 'Average Quality'}
                                                </span>
                                                <span className="font-bold text-lg">
                                                    {Math.round(intakeResult.processed_images.reduce((sum, img) => sum + img.quality_score, 0) / intakeResult.processed_images.length)}%
                                                </span>
                                            </div>
                                            <div className="relative h-3 bg-white/50 dark:bg-black/20 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${intakeResult.processed_images.reduce((sum, img) => sum + img.quality_score, 0) / intakeResult.processed_images.length}%` }}
                                                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                                    className={`h-full rounded-full ${intakeResult.processed_images.reduce((sum, img) => sum + img.quality_score, 0) / intakeResult.processed_images.length >= 70
                                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                                            : 'bg-gradient-to-r from-yellow-500 to-orange-500'
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setShowFeedback(false)}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>

                        {/* Warnings */}
                        {intakeResult.warnings.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 border-2 border-orange-200 dark:border-orange-800 rounded-2xl p-5"
                            >
                                <h4 className="text-sm font-bold text-orange-900 dark:text-orange-100 mb-3 flex items-center gap-2">
                                    <AlertCircle className="w-5 h-5" />
                                    {language === 'th' ? 'ข้อแนะนำในการปรับปรุง' : 'Improvement Suggestions'}
                                </h4>
                                <ul className="space-y-2">
                                    {intakeResult.warnings.slice(0, 3).map((warning, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 + index * 0.1 }}
                                            className="text-sm text-orange-800 dark:text-orange-200 flex items-start gap-2 bg-white/50 dark:bg-black/20 p-3 rounded-xl"
                                        >
                                            <span className="text-orange-500 mt-0.5">⚠️</span>
                                            <span>{warning.message[language]}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}

                        {/* Suggestions */}
                        {intakeResult.suggestions.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-5"
                            >
                                <h4 className="text-sm font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-yellow-500" />
                                    {language === 'th' ? 'คำแนะนำจาก AI' : 'AI Suggestions'}
                                </h4>
                                <ul className="space-y-2">
                                    {intakeResult.suggestions.map((suggestion, index) => (
                                        <motion.li
                                            key={index}
                                            initial={{ opacity: 0, x: 10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 + index * 0.1 }}
                                            className="text-sm text-blue-800 dark:text-blue-200 flex items-start gap-2 bg-white/50 dark:bg-black/20 p-3 rounded-xl"
                                        >
                                            <span className="text-blue-500 mt-0.5">✨</span>
                                            <span>{suggestion.message[language]}</span>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Tips Section */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-pink-900/20 border-2 border-indigo-200 dark:border-indigo-800 p-6"
            >
                {/* Decorative background pattern */}
                <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0" style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
                        backgroundSize: '32px 32px'
                    }}></div>
                </div>

                <div className="relative">
                    <h4 className="font-bold text-indigo-900 dark:text-indigo-100 mb-4 text-lg flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        {t.tips.title}
                    </h4>
                    <ul className="grid md:grid-cols-2 gap-3">
                        {t.tips.items.map((tip, index) => (
                            <motion.li
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                className="text-sm text-indigo-800 dark:text-indigo-200 flex items-start gap-2 bg-white/50 dark:bg-black/20 p-3 rounded-xl backdrop-blur-sm"
                            >
                                <span className="flex-shrink-0">{tip.split(' ')[0]}</span>
                                <span>{tip.substring(tip.indexOf(' ') + 1)}</span>
                            </motion.li>
                        ))}
                    </ul>
                </div>
            </motion.div>

            {/* AI Feature Notice */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border-2 border-purple-200 dark:border-purple-800 p-5"
            >
                <div className="flex items-start gap-3">
                    <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="flex-shrink-0 p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg"
                    >
                        <Sparkles className="w-5 h-5 text-white" />
                    </motion.div>
                    <p className="text-sm text-purple-900 dark:text-purple-100 font-medium">
                        {t.aiFeature}
                    </p>
                </div>
            </motion.div>

            {/* Custom CSS for animations */}
            <style jsx global>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    25% { transform: translate(20px, -50px) scale(1.1); }
                    50% { transform: translate(-20px, 20px) scale(0.9); }
                    75% { transform: translate(50px, 50px) scale(1.05); }
                }
                
                .animate-blob {
                    animation: blob 7s infinite;
                }
                
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                
                @keyframes gradient-x {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }
                
                .animate-gradient-x {
                    background-size: 200% 200%;
                    animation: gradient-x 3s ease infinite;
                }
            `}</style>
        </div>
    )
}

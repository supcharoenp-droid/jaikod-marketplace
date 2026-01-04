import React, { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload, Camera, Image as ImageIcon, X, AlertCircle,
    CheckCircle2, Sparkles, TrendingUp, AlertTriangle,
    Zap, Eye, RefreshCw
} from 'lucide-react'

import { precheckImages, getQualityGrade, type QualityFlag } from '@/services/imagePrecheck'

interface SmartImageUploadProps {
    images: File[]
    language: 'th' | 'en'
    onComplete: (images: File[]) => void
}

// Local ImageWarning interface that matches usage
interface ImageWarning {
    type: 'blur' | 'dark' | 'small' | 'duplicate'
    severity: 'warning' | 'info' | 'suggestion'
    message: { title: string; message: string; tip: string }
}

interface ImageAnalysis {
    file: File
    preview: string
    warnings: ImageWarning[]
    qualityScore: number
}

const MAX_IMAGES = 10
const MIN_IMAGE_SIZE = 800 // pixels
const BLUR_THRESHOLD = 0.7
const DARK_THRESHOLD = 0.3

export default function SmartImageUpload({ images: initialImages, language, onComplete }: SmartImageUploadProps) {
    const [images, setImages] = useState<ImageAnalysis[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const cameraInputRef = useRef<HTMLInputElement>(null)

    const content = {
        th: {
            title: 'อัปโหลดภาพสินค้า',
            subtitle: 'รูปยิ่งสวย ขายยิ่งดี',
            maxPhotos: `สูงสุด ${MAX_IMAGES} รูป`,
            uploadHint: 'คลิกเพื่อเลือกรูป หรือลากไฟล์มาวาง',
            takePhoto: 'ถ่ายรูป',
            selectFromGallery: 'เลือกจากอัลบั้ม',
            analyzing: 'กำลังวิเคราะห์...',
            qualityScore: 'คะแนนคุณภาพ',
            warnings: 'ข้อแนะนำ',
            continue: 'ดำเนินการต่อ',
            addMore: 'เพิ่มรูป',
            conversionBoost: 'เพิ่มอีก 1 รูป → โอกาสขายดีขึ้น ~18%',
            qualityTip: 'รูปชัดถ่ายใกล้ = ขายง่ายขึ้น',
            imageCount: 'รูปภาพ',
            recommended: 'แนะนำ',
            optional: 'ไม่บังคับ',
            blur: {
                title: 'รูปเบลอ',
                message: 'รูปนี้อาจเบลอไปหน่อย ควรถ่ายใหม่ให้ชัดขึ้น',
                tip: 'ถ่ายซ้ำ หรือใช้มือจับมั่น'
            },
            dark: {
                title: 'แสงน้อย',
                message: 'แสงน้อยไป ควรถ่ายในที่สว่างกว่านี้',
                tip: 'ถ่ายใกล้หน้าต่าง หรือเปิดไฟเพิ่ม'
            },
            small: {
                title: 'ขนาดเล็ก',
                message: 'ความละเอียดต่ำ อาจดูไม่สวยในหน้าสินค้า',
                tip: 'ใช้กล้องหลัก ไม่ใช่กล้องหน้า'
            },
            duplicate: {
                title: 'รูปซ้ำ',
                message: 'รูปนี้คล้ายกับรูปก่อนหน้า',
                tip: 'ถ่ายมุมอื่น ๆ เพื่อแสดงรายละเอียด'
            }
        },
        en: {
            title: 'Upload Product Photos',
            subtitle: 'Better photos = Better sales',
            maxPhotos: `Max ${MAX_IMAGES} photos`,
            uploadHint: 'Click to select or drag & drop files',
            takePhoto: 'Take Photo',
            selectFromGallery: 'Select from Gallery',
            analyzing: 'Analyzing...',
            qualityScore: 'Quality Score',
            warnings: 'Suggestions',
            continue: 'Continue',
            addMore: 'Add More',
            conversionBoost: 'Add 1 more photo → ~18% better conversion',
            qualityTip: 'Sharp, close-up photos = easier to sell',
            imageCount: 'Photos',
            recommended: 'Recommended',
            optional: 'Optional',
            blur: {
                title: 'Blurry Image',
                message: 'This photo appears blurry. Consider retaking for better clarity',
                tip: 'Retake or steady your hand'
            },
            dark: {
                title: 'Low Light',
                message: 'Photo is too dark. Try better lighting',
                tip: 'Shoot near window or add more light'
            },
            small: {
                title: 'Low Resolution',
                message: 'Image resolution is low. May not look good',
                tip: 'Use main camera, not front camera'
            },
            duplicate: {
                title: 'Duplicate',
                message: 'This photo is similar to a previous one',
                tip: 'Capture different angles for more detail'
            }
        }
    }

    const t = content[language]

    // Analyze image quality
    const analyzeImage = useCallback(async (file: File): Promise<ImageAnalysis> => {
        return new Promise((resolve) => {
            const reader = new FileReader()
            reader.onload = (e) => {
                const img = new Image()
                img.src = e.target?.result as string

                img.onload = () => {
                    const warnings: ImageWarning[] = []
                    let qualityScore = 100

                    // Check image size
                    if (img.width < MIN_IMAGE_SIZE || img.height < MIN_IMAGE_SIZE) {
                        warnings.push({
                            type: 'small',
                            severity: 'warning',
                            message: t.small
                        })
                        qualityScore -= 20
                    }

                    // Simulate blur detection (in real implementation, use canvas analysis)
                    const aspectRatio = img.width / img.height
                    if (Math.random() < 0.15) { // 15% chance for demo
                        warnings.push({
                            type: 'blur',
                            severity: 'warning',
                            message: t.blur
                        })
                        qualityScore -= 30
                    }

                    // Simulate dark detection
                    if (Math.random() < 0.1) { // 10% chance for demo
                        warnings.push({
                            type: 'dark',
                            severity: 'info',
                            message: t.dark
                        })
                        qualityScore -= 15
                    }

                    resolve({
                        file,
                        preview: img.src,
                        warnings,
                        qualityScore: Math.max(0, qualityScore)
                    })
                }
            }
            reader.readAsDataURL(file)
        })
    }, [t])

    // Handle file selection
    const handleFiles = async (fileList: FileList | null) => {
        if (!fileList || fileList.length === 0) return

        const remainingSlots = MAX_IMAGES - images.length
        const filesToAdd = Array.from(fileList).slice(0, remainingSlots)

        if (filesToAdd.length === 0) {
            alert(language === 'th'
                ? `อัปโหลดได้สูงสุด ${MAX_IMAGES} รูปเท่านั้น`
                : `Maximum ${MAX_IMAGES} photos allowed`)
            return
        }

        setIsAnalyzing(true)

        // Analyze all images
        const analysisPromises = filesToAdd.map(file => analyzeImage(file))
        const analyzedImages = await Promise.all(analysisPromises)

        // Check for duplicates
        const newImages = analyzedImages.map((analyzed, index) => {
            // Simple duplicate detection based on file size (in real app, use perceptual hashing)
            const isDuplicate = images.some(existing =>
                Math.abs(existing.file.size - analyzed.file.size) < 1000
            )

            if (isDuplicate) {
                analyzed.warnings.push({
                    type: 'duplicate',
                    severity: 'info',
                    message: t.duplicate
                })
                analyzed.qualityScore -= 10
            }

            return analyzed
        })

        setImages(prev => [...prev, ...newImages])
        setIsAnalyzing(false)
    }

    // Remove image
    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    // Drag & Drop handlers
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }

    const handleDragLeave = () => {
        setIsDragging(false)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        await handleFiles(e.dataTransfer.files)
    }

    // Continue to next step
    const handleContinue = () => {
        const files = images.map(img => img.file)
        onComplete(files)
    }

    const averageQuality = images.length > 0
        ? Math.round(images.reduce((sum, img) => sum + img.qualityScore, 0) / images.length)
        : 0

    const allWarnings = images.flatMap(img => img.warnings)
    const criticalWarnings = 0 // severity does not include 'error' in this component
    const totalWarnings = allWarnings.filter(w => w.severity === 'warning').length

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {t.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    {t.subtitle} ✨
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {t.qualityTip}
                    </span>
                </div>
            </motion.div>

            {/* Upload Zone */}
            {images.length < MAX_IMAGES && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mb-8"
                >
                    <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative border-3 border-dashed rounded-3xl p-12 transition-all duration-300 ${isDragging
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-105'
                            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-blue-400'
                            }`}
                    >
                        <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mb-6 shadow-lg">
                                <Upload className="w-10 h-10 text-white" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {t.uploadHint}
                            </h3>

                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {t.maxPhotos}
                            </p>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-center gap-4">
                                <button
                                    onClick={() => cameraInputRef.current?.click()}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    <Camera className="w-5 h-5" />
                                    {t.takePhoto}
                                </button>

                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                                >
                                    <ImageIcon className="w-5 h-5" />
                                    {t.selectFromGallery}
                                </button>
                            </div>

                            {/* Hidden file inputs */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                            <input
                                ref={cameraInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                onChange={(e) => handleFiles(e.target.files)}
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Smart Hints */}
            {images.length > 0 && images.length < 5 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800 rounded-2xl"
                >
                    <div className="flex items-start gap-3">
                        <TrendingUp className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-semibold text-green-800 dark:text-green-200 mb-1">
                                💡 {t.conversionBoost}
                            </p>
                            <p className="text-xs text-green-700 dark:text-green-300">
                                {language === 'th'
                                    ? 'สินค้าที่มี 5-7 รูป ขายได้เร็วกว่า 2 เท่า'
                                    : 'Products with 5-7 photos sell 2x faster'}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Image Grid */}
            {images.length > 0 && (
                <div className="mb-8">
                    {/* Stats Bar */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-white dark:bg-gray-800 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-6">
                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t.imageCount}
                                </p>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {images.length} / {MAX_IMAGES}
                                </p>
                            </div>

                            <div className="h-8 w-px bg-gray-300 dark:bg-gray-700" />

                            <div>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t.qualityScore}
                                </p>
                                <p className={`text-2xl font-bold ${averageQuality >= 80 ? 'text-green-600' :
                                    averageQuality >= 60 ? 'text-yellow-600' :
                                        'text-red-600'
                                    }`}>
                                    {averageQuality}/100
                                </p>
                            </div>
                        </div>

                        {images.length < MAX_IMAGES && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-xl font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
                            >
                                <Upload className="w-4 h-4" />
                                {t.addMore}
                            </button>
                        )}
                    </div>

                    {/* Image Preview Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                        <AnimatePresence>
                            {images.map((image, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="relative group"
                                >
                                    {/* Image */}
                                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-700">
                                        <img
                                            src={image.preview}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />

                                        {/* Quality Badge */}
                                        <div className={`absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-bold backdrop-blur-sm ${image.qualityScore >= 80
                                            ? 'bg-green-500/90 text-white'
                                            : image.qualityScore >= 60
                                                ? 'bg-yellow-500/90 text-white'
                                                : 'bg-red-500/90 text-white'
                                            }`}>
                                            {image.qualityScore}
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeImage(index)}
                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>

                                        {/* Warning Indicator */}
                                        {image.warnings.length > 0 && (
                                            <div className="absolute bottom-2 left-2 right-2">
                                                <div className="bg-yellow-500/90 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3 text-white" />
                                                    <span className="text-xs font-medium text-white">
                                                        {image.warnings.length} {language === 'th' ? 'ข้อแนะนำ' : 'tips'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Warnings Tooltip */}
                                    {image.warnings.length > 0 && (
                                        <div className="mt-2 space-y-1">
                                            {image.warnings.slice(0, 2).map((warning, wIndex) => (
                                                <div key={wIndex} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1">
                                                    <AlertCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-yellow-600" />
                                                    <span>{warning.message.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>
            )}

            {/* Continue Button */}
            {images.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                >
                    <button
                        onClick={handleContinue}
                        disabled={images.length === 0}
                        className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <CheckCircle2 className="w-6 h-6" />
                        {t.continue}
                        <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    </button>
                </motion.div>
            )}

            {/* Loading Overlay */}
            <AnimatePresence>
                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl">
                            <div className="flex flex-col items-center gap-4">
                                <RefreshCw className="w-12 h-12 text-blue-600 animate-spin" />
                                <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {t.analyzing}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

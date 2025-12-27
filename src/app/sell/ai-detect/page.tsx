'use client'

/**
 * /sell/ai-detect - AI Snap & Sell Page
 * 
 * User takes/uploads photo → AI detects category → Auto-redirect to form
 */

import React, { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Camera, Upload, Sparkles, Loader2, ArrowLeft, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AIDetectPage() {
    const router = useRouter()
    const { language } = useLanguage()

    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [uploadedImage, setUploadedImage] = useState<string | null>(null)
    const [detectionResult, setDetectionResult] = useState<{
        category: string
        subcategory: string
        confidence: number
        suggestedTitle: string
    } | null>(null)

    const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Preview image
        const reader = new FileReader()
        reader.onload = async (event) => {
            setUploadedImage(event.target?.result as string)
            setIsAnalyzing(true)

            // Simulate AI analysis (2-3 seconds)
            await new Promise(resolve => setTimeout(resolve, 2500))

            // Mock detection result
            setDetectionResult({
                category: 'automotive',
                subcategory: 'car',
                confidence: 94,
                suggestedTitle: 'Toyota Yaris 2020 สีขาว'
            })
            setIsAnalyzing(false)
        }
        reader.readAsDataURL(file)
    }, [])

    const handleProceed = () => {
        if (detectionResult && uploadedImage) {
            // Store FULL AI detection data + image for form to use
            const aiData = {
                // Detection result
                ...detectionResult,

                // Image data (base64)
                uploadedImage: uploadedImage,

                // Extracted fields for pre-filling form
                extractedData: {
                    brand: 'Honda',           // AI would extract this
                    model: 'Jazz',            // AI would extract this
                    subModel: 'Turbo',        // AI would extract this
                    year: '2565',             // AI would extract this (Thai year)
                    color: 'black',           // AI would extract this
                    bodyType: 'hatchback',    // AI would extract this
                    priceEstimate: {
                        min: 380000,
                        max: 450000,
                        suggested: 420000
                    }
                },

                // Timestamp
                timestamp: Date.now()
            }

            sessionStorage.setItem('ai_detection', JSON.stringify(aiData))

            // Redirect to car-listing form (demo for now)
            router.push('/demo/car-listing?from=ai')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {language === 'th' ? 'AI วิเคราะห์สินค้า' : 'AI Product Detection'}
                        </span>
                    </div>
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-12">

                {!uploadedImage ? (
                    // Upload area
                    <div className="text-center">
                        <div className="mb-8">
                            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl">
                                <Camera className="w-12 h-12 text-white" />
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                                {language === 'th' ? '📸 ถ่ายหรืออัปโหลดรูปสินค้า' : '📸 Take or Upload Photo'}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                                {language === 'th'
                                    ? 'AI จะวิเคราะห์รูปภาพและระบุหมวดหมู่สินค้าให้อัตโนมัติ'
                                    : 'AI will analyze the image and detect product category automatically'}
                            </p>
                        </div>

                        {/* Upload buttons */}
                        <div className="flex flex-col md:flex-row gap-4 justify-center">
                            <label className="relative cursor-pointer group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <div className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg group-hover:shadow-xl group-hover:scale-105 transition-all duration-200">
                                    <Camera className="w-6 h-6" />
                                    <span>{language === 'th' ? 'ถ่ายรูป' : 'Take Photo'}</span>
                                </div>
                            </label>

                            <label className="relative cursor-pointer group">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <div className="flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-xl font-semibold group-hover:border-purple-500 group-hover:shadow-lg group-hover:scale-105 transition-all duration-200">
                                    <Upload className="w-6 h-6" />
                                    <span>{language === 'th' ? 'เลือกรูปจากอัลบั้ม' : 'Upload from Gallery'}</span>
                                </div>
                            </label>
                        </div>

                        {/* Tips */}
                        <div className="mt-12 p-6 bg-gray-100 dark:bg-gray-800/50 rounded-2xl">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                💡 {language === 'th' ? 'เคล็ดลับถ่ายรูปให้ขายได้ไว' : 'Tips for Better Photos'}
                            </h3>
                            <ul className="text-left text-gray-600 dark:text-gray-400 space-y-2 text-sm">
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    {language === 'th' ? 'ถ่ายในที่แสงสว่าง' : 'Take in good lighting'}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    {language === 'th' ? 'เห็นสินค้าชัดเจนทั้งชิ้น' : 'Show entire product clearly'}
                                </li>
                                <li className="flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-500" />
                                    {language === 'th' ? 'พื้นหลังเรียบๆ ไม่รก' : 'Simple clean background'}
                                </li>
                            </ul>
                        </div>
                    </div>
                ) : (
                    // Analysis view
                    <div className="text-center">
                        {/* Preview image */}
                        <div className="relative w-full max-w-md mx-auto mb-8">
                            <img
                                src={uploadedImage}
                                alt="Uploaded"
                                className="w-full rounded-2xl shadow-xl"
                            />

                            {/* Analyzing overlay */}
                            {isAnalyzing && (
                                <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                                    <div className="text-center text-white">
                                        <div className="w-16 h-16 mx-auto mb-4 relative">
                                            <div className="absolute inset-0 border-4 border-white/30 rounded-full"></div>
                                            <div className="absolute inset-0 border-4 border-t-white rounded-full animate-spin"></div>
                                            <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-yellow-300 animate-pulse" />
                                        </div>
                                        <p className="font-semibold">AI กำลังวิเคราะห์...</p>
                                        <p className="text-sm text-white/70">รอสักครู่</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Detection result */}
                        {detectionResult && !isAnalyzing && (
                            <div className="animate-in fade-in slide-in-from-bottom-5">
                                <div className="p-6 bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800 rounded-2xl mb-6">
                                    <div className="flex items-center justify-center gap-2 mb-3">
                                        <Check className="w-6 h-6 text-green-600" />
                                        <span className="font-bold text-green-700 dark:text-green-400">
                                            AI ตรวจพบสินค้า!
                                        </span>
                                    </div>

                                    <div className="space-y-2 text-left max-w-xs mx-auto">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">หมวดหมู่:</span>
                                            <span className="font-semibold">🚗 ยานยนต์ → รถยนต์</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">ชื่อแนะนำ:</span>
                                            <span className="font-semibold">{detectionResult.suggestedTitle}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">ความมั่นใจ:</span>
                                            <span className="font-semibold text-green-600">{detectionResult.confidence}%</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Action buttons */}
                                <div className="flex flex-col md:flex-row gap-4 justify-center">
                                    <button
                                        onClick={handleProceed}
                                        className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all"
                                    >
                                        <Check className="w-5 h-5" />
                                        ถูกต้อง → ไปกรอกรายละเอียด
                                    </button>

                                    <button
                                        onClick={() => router.push('/sell')}
                                        className="px-8 py-4 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:border-gray-400 transition-colors"
                                    >
                                        เลือกหมวดหมู่เอง
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    )
}

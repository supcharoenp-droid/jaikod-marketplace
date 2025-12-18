'use client'

/**
 * 2-Step Simple Listing Flow
 * Step 1: Images + Analysis
 * Step 2: Everything else (One-page form)
 */

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, ChevronRight, ChevronLeft, Loader2, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

// Step Components
import Step1ImageUpload from './steps/Step1ImageUpload'
import Step2ImageAnalysis from './steps/Step2ImageAnalysis'
import SimpleOnePageForm from './SimpleOnePageForm'

// Services
import { enhanceProductImages, ImageEnhancementResult } from '@/services/professionalImageEnhancer'
import { analyzeProductForListing, type ListingAssistantResult } from '@/services/intelligentListingAssistant'
import { createProduct } from '@/lib/products'

export interface SimpleListingData {
    // Images
    images: File[]

    // All other data
    categoryId?: number
    title: string
    price: number
    description: string
    condition: string
    attributes: Record<string, any>
    province: string
    amphoe: string
    district: string
    zipcode: string
    shippingMethods: string[]
}

const SIMPLE_STEPS = [
    { id: 1, title: { th: 'ภาพสินค้า + วิเคราะห์', en: 'Images + Analysis' } },
    { id: 2, title: { th: 'กรอกข้อมูลสินค้า', en: 'Product Details' } }
]

export default function SimpleTwoStepListing() {
    const router = useRouter()
    const { user } = useAuth()
    const [currentStep, setCurrentStep] = useState(1)
    const [language, setLanguage] = useState<'th' | 'en'>('th')
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)

    // AI State
    const [aiAssistance, setAiAssistance] = useState<ListingAssistantResult | null>(null)
    const [enhancementResult, setEnhancementResult] = useState<ImageEnhancementResult | null>(null)

    const [listingData, setListingData] = useState<SimpleListingData>({
        images: [],
        title: '',
        price: 0,
        description: '',
        condition: 'good',
        attributes: {},
        province: '',
        amphoe: '',
        district: '',
        zipcode: '',
        shippingMethods: []
    })

    const updateListingData = (updates: Partial<SimpleListingData>) => {
        setListingData(prev => ({ ...prev, ...updates }))
    }

    const handleNextToForm = async () => {
        if (listingData.images.length === 0) {
            alert(language === 'th' ? 'กรุณาอัพโหลดรูปภาพก่อน' : 'Please upload images first')
            return
        }

        setIsAnalyzing(true)

        try {
            // Phase 2: Professional Image Enhancement
            const enhancement = await enhanceProductImages(listingData.images, {
                auto_enhance: true
            })
            setEnhancementResult(enhancement)

            // Phase 3: Intelligent Listing Assistant
            const aiResult = await analyzeProductForListing({
                detected_product: enhancement.detected_product || 'unknown',
                detected_category: enhancement.detected_category,
                images_count: listingData.images.length,
                user_input: {
                    title: listingData.title,
                    description: listingData.description,
                    price: listingData.price > 0 ? listingData.price : undefined,
                    category_id: listingData.categoryId
                }
            })
            setAiAssistance(aiResult)

            // Move to step 2
            setCurrentStep(2)
        } catch (error) {
            console.error('Error analyzing images:', error)
            alert(language === 'th' ? 'เกิดข้อผิดพลาดในการวิเคราะห์ภาพ' : 'Error analyzing images')
        } finally {
            setIsAnalyzing(false)
        }
    }

    const handlePublish = async () => {
        if (!user) {
            alert(language === 'th' ? 'กรุณาเข้าสู่ระบบก่อน' : 'Please login first')
            router.push('/login')
            return
        }

        // Validation
        if (!listingData.categoryId) {
            alert(language === 'th' ? 'กรุณาเลือกหมวดหมู่' : 'Please select category')
            return
        }
        if (listingData.title.length < 10) {
            alert(language === 'th' ? 'ชื่อสินค้าสั้นเกินไป (อย่างน้อย 10 ตัวอักษร)' : 'Title too short (min 10 chars)')
            return
        }
        if (listingData.price <= 0) {
            alert(language === 'th' ? 'กรุณาระบุราคา' : 'Please enter price')
            return
        }
        if (!listingData.province) {
            alert(language === 'th' ? 'กรุณาระบุที่อยู่' : 'Please enter location')
            return
        }

        setIsPublishing(true)

        try {
            // Upload images
            const imageUrls: string[] = []
            for (const imgFile of listingData.images) {
                imageUrls.push(URL.createObjectURL(imgFile))
            }

            // Create product
            await createProduct({
                title: listingData.title,
                description: listingData.description,
                price: listingData.price,
                price_type: 'fixed',
                category_id: listingData.categoryId?.toString() || '99',
                images: listingData.images, // Pass File[] directly
                condition: listingData.condition,
                province: listingData.province,
                amphoe: listingData.amphoe,
                district: listingData.district,
                zipcode: listingData.zipcode,
                // Add required fields for CreateProductInput
                can_ship: listingData.shippingMethods.includes('standard') || listingData.shippingMethods.includes('express'),
                can_pickup: listingData.shippingMethods.includes('pickup'),
                stock: 1
            },
                (user as any).uid || (user as any).id,
                (user as any).displayName || 'Seller',
                (user as any).photoURL || ''
            )

            alert(language === 'th' ?
                '✅ ลงประกาศสินค้าสำเร็จ!' :
                '✅ Product listed successfully!'
            )
            router.push('/seller/products')
        } catch (error) {
            console.error('Error publishing:', error)
            alert(language === 'th' ?
                '❌ เกิดข้อผิดพลาด กรุณาลองใหม่' :
                '❌ Error publishing. Please try again'
            )
        } finally {
            setIsPublishing(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
            {/* Header */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Camera className="w-8 h-8 text-purple-600" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {language === 'th' ? 'ลงขายง่ายๆ 2 ขั้นตอน' : 'Easy Listing in 2 Steps'}
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {language === 'th' ? 'รวดเร็ว ไม่ซับซ้อน' : 'Fast & Simple'}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setLanguage(lang => lang === 'th' ? 'en' : 'th')}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {language === 'th' ? '🇬🇧 EN' : '🇹🇭 TH'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Simple 2-Step Progress */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        {SIMPLE_STEPS.map((step, index) => (
                            <React.Fragment key={step.id}>
                                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${currentStep === step.id
                                    ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold'
                                    : currentStep > step.id
                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                                        : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
                                    }`}>
                                    <span className="text-lg">{step.id}</span>
                                    <span className="text-sm">{step.title[language]}</span>
                                </div>
                                {index < SIMPLE_STEPS.length - 1 && (
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    {currentStep === 1 ? (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Image Upload */}
                            <Step1ImageUpload
                                images={listingData.images}
                                onImagesChange={(images) => updateListingData({ images })}
                                language={language}
                            />

                            {/* Next Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={handleNextToForm}
                                    disabled={listingData.images.length === 0 || isAnalyzing}
                                    className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-3 shadow-xl"
                                >
                                    {isAnalyzing ? (
                                        <>
                                            <Loader2 className="w-6 h-6 animate-spin" />
                                            {language === 'th' ? 'กำลังวิเคราะห์...' : 'Analyzing...'}
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="w-6 h-6" />
                                            {language === 'th' ? 'ต่อไป: กรอกข้อมูลสินค้า' : 'Next: Enter Details'}
                                            <ChevronRight className="w-6 h-6" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {/* One-Page Form */}
                            <SimpleOnePageForm
                                listingData={listingData}
                                enhancementResult={enhancementResult}
                                aiAssistance={aiAssistance}
                                onDataChange={updateListingData}
                                onPublish={handlePublish}
                                isPublishing={isPublishing}
                                language={language}
                            />

                            {/* Back Button */}
                            <div className="mt-6">
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all flex items-center gap-2"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                    {language === 'th' ? 'กลับไปแก้ไขรูปภาพ' : 'Back to Images'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

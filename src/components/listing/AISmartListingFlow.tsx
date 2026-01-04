'use client'

/**
 * AI Smart Listing Flow - 8 Step Wizard
 * Complete AI-powered product listing experience
 */

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Camera, Image as ImageIcon, Sparkles, Check, AlertTriangle,
    ChevronRight, ChevronLeft, Loader2, ShieldCheck, TrendingUp,
    MapPin, Package, FileText, Eye, Award, Zap
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

// Step Components
import Step1ImageUpload from './steps/Step1ImageUpload'
import Step2ImageAnalysis from './steps/Step2ImageAnalysis'
import Step3TitlePrice from './steps/Step3TitlePrice'
import Step4Category from './steps/Step4Category'
import Step5SmartForm from './steps/Step5SmartForm'
import Step6Location from './steps/Step6Location'
import Step7Compliance from './steps/Step7Compliance'
import Step8Preview from './steps/Step8Preview'

// Services
import { analyzeProductImages, ProductImageAnalysis } from '@/services/aiImageAnalysis'
import {
    generateProductTitles,
    generatePriceSuggestion,
    classifyCategory,
    getShippingRecommendations,
    checkListingCompliance,
    calculateBuyabilityScore,
    AITitleSuggestion,
    AIPriceSuggestion,
    AICategoryPrediction,
    AIComplianceCheck,
    AIBuyabilityScore
} from '@/services/aiSmartListing'
import { createProduct } from '@/lib/products'

export interface ListingData {
    // Step 1 & 2: Images
    images: File[]
    imageAnalysis?: ProductImageAnalysis

    // Step 3: Category
    categoryId?: number
    categoryPrediction?: AICategoryPrediction
    subCategoryId?: number

    // Step 4: Title & Price
    title: string
    titleSuggestions?: AITitleSuggestion
    price: number
    priceSuggestion?: AIPriceSuggestion

    // Step 5: Attributes
    attributes: Record<string, any>
    description: string
    condition: string

    // Step 6: Location & Shipping
    province: string
    amphoe: string
    district: string
    zipcode: string
    shippingMethods: string[]

    // Step 7: Compliance
    complianceCheck?: AIComplianceCheck

    // Step 8: Preview & Score
    buyabilityScore?: AIBuyabilityScore
}

const STEPS = [
    { id: 1, title: { th: 'ภาพสินค้า', en: 'Product Images' }, icon: Camera, color: 'blue' },
    { id: 2, title: { th: 'วิเคราะห์ภาพ', en: 'Image Analysis' }, icon: Sparkles, color: 'purple' },
    { id: 3, title: { th: 'หมวดหมู่', en: 'Category' }, icon: Package, color: 'orange' },
    { id: 4, title: { th: 'ชื่อ & ราคา', en: 'Title & Price' }, icon: FileText, color: 'green' },
    { id: 5, title: { th: 'รายละเอียด', en: 'Details' }, icon: FileText, color: 'indigo' },
    { id: 6, title: { th: 'ที่อยู่ & จัดส่ง', en: 'Location & Shipping' }, icon: MapPin, color: 'teal' },
    { id: 7, title: { th: 'ตรวจสอบ', en: 'Verification' }, icon: ShieldCheck, color: 'red' },
    { id: 8, title: { th: 'ตัวอย่าง', en: 'Preview' }, icon: Eye, color: 'pink' }
]

export default function AISmartListingFlow() {
    const router = useRouter()
    const { user } = useAuth()
    const [currentStep, setCurrentStep] = useState(1)
    const [language, setLanguage] = useState<'th' | 'en'>('th')
    const [isProcessing, setIsProcessing] = useState(false)
    const [isPublishing, setIsPublishing] = useState(false)

    const [listingData, setListingData] = useState<ListingData>({
        images: [],
        title: '',
        price: 0,
        attributes: {},
        description: '',
        condition: 'good',
        province: '',
        amphoe: '',
        district: '',
        zipcode: '',
        shippingMethods: []
    })

    // Auto-detect language from user input
    useEffect(() => {
        const thaiPattern = /[\u0E00-\u0E7F]/
        if (listingData.title && thaiPattern.test(listingData.title)) {
            setLanguage('th')
        } else if (listingData.title && !thaiPattern.test(listingData.title)) {
            setLanguage('en')
        }
    }, [listingData.title])

    const updateListingData = (updates: Partial<ListingData>) => {
        setListingData(prev => ({ ...prev, ...updates }))
    }

    const canProceedToStep = (step: number): boolean => {
        switch (step) {
            case 2:
                return listingData.images.length > 0
            case 3:
                return !!listingData.imageAnalysis && listingData.imageAnalysis.readyToPublish
            case 4:
                return !!listingData.categoryId // Category must be selected first
            case 5:
                return listingData.title.length >= 10 && listingData.price > 0 // Title & Price after category
            case 6:
                return listingData.description.length >= 20
            case 7:
                return listingData.province !== ''
            case 8:
                return listingData.complianceCheck?.passed || false
            default:
                return true
        }
    }

    const handleNext = async () => {
        if (!canProceedToStep(currentStep + 1)) {
            return
        }

        setIsProcessing(true)

        try {
            // Run AI processing between steps
            if (currentStep === 1) {
                // Analyze images after upload
                const analysis = await analyzeProductImages(listingData.images)
                updateListingData({ imageAnalysis: analysis })
            } else if (currentStep === 2) {
                // Step 2 → 3: Classify category from images
                const categoryPrediction = await classifyCategory(
                    '', // No title yet
                    listingData.imageAnalysis
                )
                updateListingData({
                    categoryPrediction,
                    categoryId: categoryPrediction.categoryId
                })
            } else if (currentStep === 3) {
                // Step 3 → 4: Generate title & price based on category + images
                const [titleSuggestions, priceSuggestion] = await Promise.all([
                    generateProductTitles(
                        listingData.imageAnalysis,
                        listingData.title,
                        language
                    ),
                    generatePriceSuggestion(
                        listingData.title,
                        listingData.categoryId,
                        listingData.attributes
                    )
                ])
                updateListingData({ titleSuggestions, priceSuggestion })
            } else if (currentStep === 6) {
                // Check compliance
                const complianceCheck = await checkListingCompliance(
                    listingData.title,
                    listingData.description,
                    listingData.price,
                    listingData.categoryId || 99,
                    listingData.images.map(img => URL.createObjectURL(img))
                )
                updateListingData({ complianceCheck })
            } else if (currentStep === 7) {
                // Calculate buyability score
                const buyabilityScore = await calculateBuyabilityScore({
                    title: listingData.title,
                    description: listingData.description,
                    price: listingData.price,
                    category: listingData.categoryId || 99,
                    images: listingData.images,
                    imageQualityScore: listingData.imageAnalysis?.overallScore || 75
                })
                updateListingData({ buyabilityScore })
            }

            setCurrentStep(prev => Math.min(8, prev + 1))
        } catch (error) {
            console.error('Error processing step:', error)
        } finally {
            setIsProcessing(false)
        }
    }

    const handleBack = () => {
        setCurrentStep(prev => Math.max(1, prev - 1))
    }

    const handlePublish = async () => {
        if (!user) {
            alert(language === 'th' ? 'กรุณาเข้าสู่ระบบก่อน' : 'Please login first')
            router.push('/login')
            return
        }

        setIsPublishing(true)

        try {
            // Upload images first (simplified for now)
            const imageUrls: string[] = []
            for (const imgFile of listingData.images) {
                // In production, upload to Firebase Storage
                imageUrls.push(URL.createObjectURL(imgFile))
            }

            // Create product - pass all required arguments
            await createProduct(
                {
                    title: listingData.title,
                    description: listingData.description,
                    description_th: listingData.description,
                    description_en: '',
                    category_id: String(listingData.categoryId || 99),
                    price: listingData.price,
                    price_type: 'negotiable' as const,
                    condition: listingData.condition,
                    stock: 1,
                    province: listingData.province,
                    amphoe: listingData.amphoe,
                    district: listingData.district,
                    zipcode: listingData.zipcode,
                    can_ship: true,
                    can_pickup: false,
                    images: imageUrls
                },
                (user as any).uid || (user as any).id,  // userId
                (user as any).displayName || (user as any).name || 'ผู้ใช้งาน' // userName
            )

            // Success!
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

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Step1ImageUpload
                        images={listingData.images}
                        onImagesChange={(images) => updateListingData({ images })}
                        language={language}
                    />
                )
            case 2:
                return (
                    <Step2ImageAnalysis
                        imageAnalysis={listingData.imageAnalysis}
                        onAnalysisComplete={(analysis) => updateListingData({ imageAnalysis: analysis })}
                        language={language}
                    />
                )
            case 3:
                return (
                    <Step4Category
                        categoryId={listingData.categoryId}
                        categoryPrediction={listingData.categoryPrediction}
                        onCategoryChange={(categoryId: number, subCategoryId?: number) =>
                            updateListingData({ categoryId, subCategoryId })
                        }
                        language={language}
                    />
                )
            case 4:
                return (
                    <Step3TitlePrice
                        title={listingData.title}
                        price={listingData.price}
                        titleSuggestions={listingData.titleSuggestions}
                        priceSuggestion={listingData.priceSuggestion}
                        onTitleChange={(title: string) => updateListingData({ title })}
                        onPriceChange={(price: number) => updateListingData({ price })}
                        language={language}
                    />
                )
            case 5:
                return (
                    <Step5SmartForm
                        categoryId={listingData.categoryId || 99}
                        attributes={listingData.attributes}
                        description={listingData.description}
                        condition={listingData.condition}
                        onAttributesChange={(attributes) => updateListingData({ attributes })}
                        onDescriptionChange={(description) => updateListingData({ description })}
                        onConditionChange={(condition) => updateListingData({ condition })}
                        language={language}
                    />
                )
            case 6:
                return (
                    <Step6Location
                        province={listingData.province}
                        amphoe={listingData.amphoe}
                        district={listingData.district}
                        zipcode={listingData.zipcode}
                        shippingMethods={listingData.shippingMethods}
                        onLocationChange={(location) => updateListingData(location)}
                        language={language}
                    />
                )
            case 7:
                return (
                    <Step7Compliance
                        complianceCheck={listingData.complianceCheck}
                        listingData={listingData}
                        language={language}
                    />
                )
            case 8:
                return (
                    <Step8Preview
                        listingData={listingData}
                        buyabilityScore={listingData.buyabilityScore}
                        language={language}
                        onPublish={handlePublish}
                        isPublishing={isPublishing}
                    />
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-pink-900/20">
            {/* Header */}
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Zap className="w-8 h-8 text-purple-600" />
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {language === 'th' ? 'AI สมาร์ทขายของ' : 'AI Smart Listing'}
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {language === 'th' ? 'ลงขายได้ใน 60 วินาที' : 'List in 60 seconds'}
                                </p>
                            </div>
                        </div>

                        {/* Language Toggle */}
                        <button
                            onClick={() => setLanguage(lang => lang === 'th' ? 'en' : 'th')}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {language === 'th' ? '🇬🇧 EN' : '🇹🇭 TH'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Progress Stepper */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        {STEPS.map((step, index) => {
                            const Icon = step.icon
                            const isActive = currentStep === step.id
                            const isCompleted = currentStep > step.id
                            const canAccess = currentStep >= step.id

                            return (
                                <React.Fragment key={step.id}>
                                    <div className="flex flex-col items-center flex-1">
                                        <motion.div
                                            className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all ${isCompleted
                                                ? `bg-${step.color}-500 border-${step.color}-500 text-white`
                                                : isActive
                                                    ? `border-${step.color}-500 bg-${step.color}-50 dark:bg-${step.color}-900/20 text-${step.color}-600`
                                                    : 'border-gray-300 bg-gray-100 dark:bg-gray-700 text-gray-400'
                                                }`}
                                            initial={false}
                                            animate={{
                                                scale: isActive ? 1.1 : 1,
                                            }}
                                        >
                                            {isCompleted ? <Check className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                                        </motion.div>
                                        <p className={`mt-2 text-xs font-medium text-center ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'
                                            }`}>
                                            {step.title[language]}
                                        </p>
                                    </div>

                                    {index < STEPS.length - 1 && (
                                        <div className={`h-0.5 flex-1 mx-2 mt-[-20px] ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                                            }`} />
                                    )}
                                </React.Fragment>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Step Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                {currentStep < 8 && (
                    <div className="mt-8 flex items-center justify-between">
                        <button
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className="px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                        >
                            <ChevronLeft className="w-5 h-5" />
                            {language === 'th' ? 'ย้อนกลับ' : 'Back'}
                        </button>

                        <button
                            onClick={handleNext}
                            disabled={!canProceedToStep(currentStep + 1) || isProcessing}
                            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-lg"
                        >
                            {isProcessing ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    {language === 'th' ? 'กำลังประมวลผล...' : 'Processing...'}
                                </>
                            ) : (
                                <>
                                    {language === 'th' ? 'ถัดไป' : 'Next'}
                                    <ChevronRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

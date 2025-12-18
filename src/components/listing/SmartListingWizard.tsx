'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import {
    Camera, CheckCircle2, Sparkles, TrendingUp,
    ArrowLeft, Shield, Zap
} from 'lucide-react'

// Steps
import SmartImageUpload from './steps/SmartImageUpload'
import AIProcessingVisual from './steps/AIProcessingVisual'
import SmartDetailsForm from './steps/SmartDetailsForm'

// Types
import { ImageEnhancementResult } from '@/services/professionalImageEnhancer'
import { ListingAssistantResult } from '@/services/intelligentListingAssistant'

export interface SmartListingData {
    // Images
    images: File[]

    // AI Results (populated during flow)
    imageAnalysis?: ImageEnhancementResult
    aiSuggestions?: ListingAssistantResult

    // Product Info
    categoryId?: number
    title: string
    description: string
    price: number
    condition: string
    attributes: Record<string, any>

    // Location
    province: string
    amphoe: string
    district: string
    zipcode: string
    latitude?: number
    longitude?: number

    // Shipping
    shippingMethods: string[]
    canShip: boolean
    canPickup: boolean

    // Sell Score
    sellScore?: number
    sellGrade?: 'A' | 'B' | 'C' | 'D' | 'F'
}

const SMART_STEPS = [
    {
        id: 1,
        title: { th: '📸 เพิ่มรูปภาพ', en: '📸 Add Photos' },
        subtitle: { th: 'อัปโหลดรูปสินค้า', en: 'Upload product images' },
        description: { th: 'ถ่ายรูปสินค้าให้สวย ชัด จะช่วยให้ขายได้เร็วขึ้น', en: 'Clear photos help sell faster' },
        icon: Camera,
        color: 'from-blue-500 via-blue-600 to-cyan-600',
        background: 'from-blue-50 to-cyan-50'
    },
    {
        id: 2,
        title: { th: '🤖 AI ประมวลผล', en: '🤖 AI Processing' },
        subtitle: { th: 'วิเคราะห์และปรับปรุงรูปภาพ', en: 'Analyzing & enhancing images' },
        description: { th: 'AI ช่วยวิเคราะห์คุณภาพ แนะนำการปรับปรุง และเสนอข้อมูลสินค้า', en: 'AI analyzes quality and suggests improvements' },
        icon: Sparkles,
        color: 'from-purple-500 via-pink-500 to-rose-500',
        background: 'from-purple-50 to-pink-50'
    },
    {
        id: 3,
        title: { th: '✍️ รายละเอียด', en: '✍️ Details' },
        subtitle: { th: 'กรอกข้อมูลสินค้า', en: 'Fill product information' },
        description: { th: 'AI ช่วยเติมข้อมูล แนะนำราคา และเพิ่มโอกาสขายให้คุณ', en: 'AI helps with pricing and details' },
        icon: TrendingUp,
        color: 'from-green-500 via-emerald-500 to-teal-500',
        background: 'from-green-50 to-emerald-50'
    }
]

export default function SmartListingWizard() {
    const router = useRouter()
    const { user } = useAuth()
    const [currentStep, setCurrentStep] = useState(1)
    const [language, setLanguage] = useState<'th' | 'en'>('th')
    const [isProcessing, setIsProcessing] = useState(false)

    const [listingData, setListingData] = useState<SmartListingData>({
        images: [],
        title: '',
        description: '',
        price: 0,
        condition: 'good',
        attributes: {},
        province: '',
        amphoe: '',
        district: '',
        zipcode: '',
        shippingMethods: [],
        canShip: true,
        canPickup: false
    })

    const updateListingData = (updates: Partial<SmartListingData>) => {
        setListingData(prev => ({ ...prev, ...updates }))
    }

    const handleStepComplete = (step: number, data?: Partial<SmartListingData>) => {
        if (data) {
            updateListingData(data)
        }

        // Move to next step
        if (step < 3) {
            setCurrentStep(step + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 1 && !isProcessing) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handlePublish = async () => {
        // Will be implemented with full publish logic
        console.log('Publishing product...', listingData)
    }

    const content = {
        th: {
            smartListing: 'โพสขายอัจฉริยะ',
            poweredByAI: 'ขับเคลื่อนด้วย AI',
            step: 'ขั้นตอนที่',
            of: 'จาก',
            back: 'ย้อนกลับ',
            secureSystem: 'ระบบปลอดภัย',
            aiPowered: 'AI ช่วยวิเคราะห์',
            fastSelling: 'ขายเร็วกว่า 2.5 เท่า',
            sellBetter: 'ขายดีกว่าปกติ 3 เท่า'
        },
        en: {
            smartListing: 'Smart Listing',
            poweredByAI: 'Powered by AI',
            step: 'Step',
            of: 'of',
            back: 'Back',
            secureSystem: 'Secure System',
            aiPowered: 'AI Analysis',
            fastSelling: '2.5x Faster Sales',
            sellBetter: '3x Better Sales'
        }
    }

    const t = content[language]
    const currentStepData = SMART_STEPS[currentStep - 1]
    const progress = (currentStep / SMART_STEPS.length) * 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
            {/* Modern Header with Glassmorphism */}
            <header className="sticky top-0 z-50 border-b border-gray-200/50 dark:border-gray-800/50">
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex items-center justify-between">
                        {/* Logo & Title Section */}
                        <div className="flex items-center gap-4">
                            {/* Animated Icon */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${currentStepData.color} shadow-2xl flex items-center justify-center`}
                            >
                                <div className="absolute inset-0 bg-white/20 rounded-2xl blur-sm"></div>
                                <currentStepData.icon className="relative w-7 h-7 text-white" />
                            </motion.div>

                            <div>
                                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent flex items-center gap-2">
                                    {t.smartListing}
                                    <motion.div
                                        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, 0] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Sparkles className="w-5 h-5 text-yellow-500" />
                                    </motion.div>
                                </h1>
                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 flex items-center gap-2 mt-1">
                                    <Zap className="w-3.5 h-3.5" />
                                    {t.poweredByAI}
                                </p>
                            </div>
                        </div>

                        {/* Language Toggle */}
                        <button
                            onClick={() => setLanguage(lang => lang === 'th' ? 'en' : 'th')}
                            className="group relative px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-xl font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-center gap-2">
                                <span>{language === 'th' ? '🇬🇧' : '🇹🇭'}</span>
                                <span className="font-semibold">{language === 'th' ? 'EN' : 'TH'}</span>
                            </div>
                        </button>
                    </div>

                    {/* Enhanced Progress Section */}
                    <div className="mt-8">
                        {/* Step Indicators */}
                        <div className="relative flex items-center justify-between mb-6">
                            {SMART_STEPS.map((step, index) => (
                                <React.Fragment key={step.id}>
                                    {/* Step Circle */}
                                    <div className="flex flex-col items-center z-10 relative">
                                        <motion.div
                                            initial={false}
                                            animate={{
                                                scale: currentStep === step.id ? 1.15 : 1,
                                            }}
                                            className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold text-base transition-all duration-300 ${currentStep > step.id
                                                ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg shadow-green-500/50'
                                                : currentStep === step.id
                                                    ? `bg-gradient-to-br ${step.color} text-white shadow-2xl`
                                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 border-2 border-gray-300 dark:border-gray-600'
                                                }`}
                                        >
                                            {currentStep > step.id ? (
                                                <CheckCircle2 className="w-6 h-6" />
                                            ) : (
                                                <span>{step.id}</span>
                                            )}

                                            {/* Glow Effect */}
                                            {currentStep === step.id && (
                                                <motion.div
                                                    className={`absolute inset-0 rounded-full bg-gradient-to-br ${step.color} opacity-50 blur-xl`}
                                                    animate={{
                                                        scale: [1, 1.5, 1],
                                                        opacity: [0.5, 0.8, 0.5]
                                                    }}
                                                    transition={{
                                                        duration: 2,
                                                        repeat: Infinity
                                                    }}
                                                />
                                            )}
                                        </motion.div>

                                        {/* Step Title */}
                                        <div className="absolute top-14 text-center min-w-[100px] max-w-[140px]">
                                            <p className={`text-sm font-semibold transition-colors duration-200 ${currentStep === step.id
                                                ? 'text-gray-900 dark:text-white'
                                                : 'text-gray-500 dark:text-gray-500'
                                                }`}>
                                                {step.title[language]}
                                            </p>
                                            {currentStep === step.id && (
                                                <motion.p
                                                    initial={{ opacity: 0, y: -5 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    className="text-xs text-gray-600 dark:text-gray-400 mt-1"
                                                >
                                                    {step.description[language]}
                                                </motion.p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Connector Line */}
                                    {index < SMART_STEPS.length - 1 && (
                                        <div className="flex-1 h-1 mx-3 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{
                                                    width: currentStep > step.id ? '100%' : '0%'
                                                }}
                                                transition={{ duration: 0.5, ease: 'easeOut' }}
                                                className="h-full bg-gradient-to-r from-green-400 to-emerald-500"
                                            />
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Modern Progress Bar */}
                        <div className="relative h-2 bg-gray-200/50 dark:bg-gray-800/50 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.6, ease: 'easeOut' }}
                                className={`absolute inset-y-0 left-0 bg-gradient-to-r ${currentStepData.color} rounded-full shadow-lg`}
                            />
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24">
                {/* Trust Badges with Enhanced Design */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap items-center justify-center gap-4 mb-10"
                >
                    <div className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-200 dark:border-green-800 shadow-sm hover:shadow-md transition-all duration-200">
                        <Shield className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                            {t.secureSystem}
                        </span>
                    </div>

                    <div className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800 shadow-sm hover:shadow-md transition-all duration-200">
                        <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                            {t.aiPowered}
                        </span>
                    </div>

                    <div className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl border border-blue-200 dark:border-blue-800 shadow-sm hover:shadow-md transition-all duration-200">
                        <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                            {t.fastSelling}
                        </span>
                    </div>
                </motion.div>

                {/* Step Content with Enhanced Animation */}
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 30, scale: 0.98 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -30, scale: 0.98 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                    >
                        {currentStep === 1 && (
                            <SmartImageUpload
                                images={listingData.images}
                                language={language}
                                onComplete={(images) => handleStepComplete(1, { images })}
                            />
                        )}

                        {currentStep === 2 && (
                            <AIProcessingVisual
                                images={listingData.images}
                                language={language}
                                onComplete={(result) => handleStepComplete(2, {
                                    imageAnalysis: result.imageAnalysis,
                                    aiSuggestions: result.aiSuggestions
                                })}
                            />
                        )}

                        {currentStep === 3 && (
                            <SmartDetailsForm
                                listingData={listingData}
                                language={language}
                                onPublish={handlePublish}
                                onDataChange={updateListingData}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Button */}
                {currentStep > 1 && currentStep < 3 && !isProcessing && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-8 flex justify-center"
                    >
                        <button
                            onClick={handleBack}
                            className="group flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-2xl shadow-lg hover:shadow-xl border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:-translate-y-0.5"
                        >
                            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
                            <span className="font-semibold">{t.back}</span>
                        </button>
                    </motion.div>
                )}
            </main>

            {/* Enhanced Footer */}
            <footer className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200/50 dark:border-gray-800/50">
                <div className="absolute inset-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl"></div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-lg">
                                <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${currentStepData.color} animate-pulse`}></div>
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    {t.step} {currentStep} {t.of} {SMART_STEPS.length}
                                </span>
                            </div>
                        </div>

                        <div className="text-sm font-medium text-gray-600 dar:text-gray-400">
                            {currentStepData.subtitle[language]}
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}

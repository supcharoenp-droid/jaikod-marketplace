'use client'

/**
 * SimplifiedSmartListingPage - World-Class AI-Powered Listing
 * 
 * Features:
 * - Photo upload/camera (max 10)
 * - AI auto-analysis
 * - Smart category detection WITH HUMAN-IN-THE-LOOP
 * - Dynamic title generation
 * - Adaptive forms
 * - GPS location
 * - Preview before post
 */

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, Sparkles, MapPin, Eye, ArrowLeft, ArrowRight } from 'lucide-react'
import { getOpenAIVisionService } from '@/lib/openai-vision-service'
import { decideCategoryWithAI, CategoryDecisionResult } from '@/lib/category-decision-ai'
import { decideCategoryWithAdvancedAI } from '@/lib/category-decision-enhanced'
import { detectSubcategory, getSubcategorySuggestions } from '@/lib/subcategory-intelligence'
import PhotoUploaderAdvanced from '@/components/listing/PhotoUploaderAdvanced'
import CategoryConfirmation from '@/components/listing/CategoryConfirmation'
import SmartDetailsForm from '@/components/listing/SmartDetailsForm'
import SmartDetailsFormI18n from '@/components/listing/SmartDetailsFormI18n'
import ListingPreview from '@/components/listing/ListingPreview'
import HeaderLanguageSwitcher from '@/components/HeaderLanguageSwitcher'
import { useLanguage } from '@/contexts/LanguageContext'



// Types
interface Photo {
    file: File
    preview: string
    analyzed: boolean
}

interface AIAnalysisResult {
    category: { main: string; sub: string; confidence: number }
    title: string
    description: string
    price: { min: number; max: number; suggested: number }
    condition: string
    detectedObjects: string[]
}

interface ListingData {
    photos: Photo[]
    aiAnalysis: AIAnalysisResult | null
    category: string
    subcategory?: string  // ✅ Added!
    title: string
    description: string
    price: number
    condition: string
    location: {
        province: string
        amphoe: string
        tambon: string
        gps?: { lat: number; lng: number }
    }
}

export default function SimplifiedSmartListingPage() {
    const { language } = useLanguage()

    // Translations
    const t = {
        pageTitle: language === 'th' ? 'ลงขายสินค้า' : 'Sell Product',
        step1: language === 'th' ? '1️⃣ รูปภาพ' : '1️⃣ Photos',
        step2: language === 'th' ? '2️⃣ รายละเอียด' : '2️⃣ Details',
        step3: language === 'th' ? '3️⃣ ตรวจสอบ' : '3️⃣ Review'
    }

    // State - NEW: Added 'category-confirm' step + subcategory
    const [step, setStep] = useState<'upload' | 'category-confirm' | 'details' | 'preview'>('upload')
    const [photos, setPhotos] = useState<Photo[]>([])
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [analysisProgress, setAnalysisProgress] = useState(0)
    const [categoryDecision, setCategoryDecision] = useState<CategoryDecisionResult | null>(null)
    const [selectedCategoryId, setSelectedCategoryId] = useState<string>('')
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string>('')
    const [listingData, setListingData] = useState<ListingData>({
        photos: [],
        aiAnalysis: null,
        category: '',
        subcategory: '',  // ✅ Added!
        title: '',
        description: '',
        price: 0,
        condition: 'used',
        location: {
            province: '',
            amphoe: '',
            tambon: ''
        }
    })

    // Photo upload handler
    const handlePhotoUpload = useCallback((files: File[]) => {
        console.log('📤 New photos uploaded - RESETTING all state')

        const newPhotos = files.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            analyzed: false
        }))

        // ✅ RESET everything when new photos are uploaded
        setPhotos(newPhotos)
        setCategoryDecision(null)
        setSelectedCategoryId('')
        setSelectedSubcategoryId('')
        setIsAnalyzing(false)
        setAnalysisProgress(0)
        setStep('upload')

        // Reset listing data to initial state with new photos
        setListingData({
            photos: newPhotos,
            aiAnalysis: null,
            category: '',
            subcategory: '',
            title: '',
            description: '',
            price: 0,
            condition: 'used',
            location: {
                province: '',
                amphoe: '',
                tambon: ''
            }
        })

        console.log(`📸 ${files.length} photos uploaded, all state reset, waiting for user to click next...`)
    }, [])

    // Analyze photos when user clicks "Next" from upload step
    const handleAnalyzeAndProceed = useCallback(async () => {
        console.log('🚀 handleAnalyzeAndProceed called')
        console.log('📸 Photos:', photos.length)

        if (photos.length === 0) {
            console.warn('⚠️ No photos to analyze')
            return
        }

        setIsAnalyzing(true)
        setAnalysisProgress(0)

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setAnalysisProgress(prev => Math.min(prev + 10, 90))
            }, 500)

            console.log('🤖 Starting AI analysis...')
            const aiService = getOpenAIVisionService()
            const result = await aiService.analyzeImage(photos[0].file)

            clearInterval(progressInterval)
            setAnalysisProgress(100)

            console.log('📊 AI Analysis Result:', {
                title: result.title,
                description: result.description,
                detectedObjects: result.detectedObjects,
                suggestedCategory: result.suggestedCategory
            })

            // ✅ Use ENHANCED AI Decision Engine
            console.log('\n🚀 ===== ENHANCED AI CATEGORY DECISION =====')
            const decision = decideCategoryWithAdvancedAI({
                title: result.title,
                description: result.description,
                detectedObjects: result.detectedObjects || [],
                imageAnalysis: result.suggestedCategory
            })
            console.log('============================================\n')

            console.log('🎯 Category Decision:', decision)

            // ✅ NEW: Detect subcategory
            let detectedSubcategory = null
            if (decision.auto_selected || decision.recommended_categories[0]) {
                const mainCategoryId = parseInt(decision.auto_selected?.categoryId || decision.recommended_categories[0]?.categoryId || '0')

                if (mainCategoryId > 0) {
                    detectedSubcategory = detectSubcategory({
                        categoryId: mainCategoryId,
                        title: result.title,
                        description: result.description,
                        imageAnalysis: result.suggestedCategory,
                        detectedObjects: result.detectedObjects
                    })

                    console.log('📂 Subcategory Detection:', {
                        category: mainCategoryId,
                        detected: detectedSubcategory?.subcategoryName,
                        confidence: detectedSubcategory?.confidence,
                        matched: detectedSubcategory?.matchedKeywords
                    })
                }
            }

            // DON'T add fallback - if no category found, just show empty
            // User will have to manually select

            setCategoryDecision(decision)

            setListingData(prev => ({
                ...prev,
                aiAnalysis: {
                    category: {
                        main: result.suggestedCategory,
                        sub: result.suggestedSubcategory || '',
                        confidence: decision.auto_selected?.confidence || 0
                    },
                    title: result.title,
                    description: result.description,
                    price: result.estimatedPrice || { min: 0, max: 0, suggested: 0 },
                    condition: result.estimatedCondition,
                    detectedObjects: result.detectedObjects || []
                },
                category: decision.auto_selected?.categoryId || decision.recommended_categories[0]?.categoryId || '',
                subcategory: detectedSubcategory?.subcategoryId || '', // ✅ Auto-select subcategory!
                title: result.title,
                description: result.description,
                price: result.estimatedPrice?.suggested || 0,
                condition: result.estimatedCondition
            }))

            setPhotos(prev => prev.map((p, i) => i === 0 ? { ...p, analyzed: true } : p))

            setTimeout(() => {
                setIsAnalyzing(false)
                // ✅ Go directly to details page (skip category-confirm)
                console.log('📍 Routing to details')
                setStep('details')
            }, 1000)

        } catch (error) {
            console.error('❌ AI Analysis Error:', error)
            setIsAnalyzing(false)
            alert('เกิดข้อผิดพลาดในการวิเคราะห์ กรุณาลองใหม่')
        }
    }, [photos]) // ✅ Add photos as dependency

    // Remove photo
    const removePhoto = useCallback((index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index))
    }, [])

    // Regenerate with AI
    const regenerateField = useCallback(async (field: 'title' | 'description') => {
        if (!photos[0]) return

        setIsAnalyzing(true)

        try {
            const aiService = getOpenAIVisionService()
            const result = await aiService.analyzeImage(photos[0].file)

            setListingData(prev => ({
                ...prev,
                [field]: result[field]
            }))

        } catch (error) {
            console.error('Regenerate error:', error)
        } finally {
            setIsAnalyzing(false)
        }
    }, [photos])

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pb-20">
            {/* Header */}
            <div className="sticky top-0 z-50 bg-gray-900/90 backdrop-blur-sm border-b border-gray-800">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 
                         bg-clip-text text-transparent">
                            {t.pageTitle}
                        </h1>

                        {/* Language Switcher */}
                        <div className="flex items-center gap-4">
                            <HeaderLanguageSwitcher />

                            {/* Progress */}
                            <div className="flex items-center gap-2 text-sm">
                                <div className={`px-3 py-1 rounded-full ${step === 'upload' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'
                                    }`}>
                                    {t.step1}
                                </div>
                                <div className={`px-3 py-1 rounded-full ${step === 'details' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'
                                    }`}>
                                    {t.step2}
                                </div>
                                <div className={`px-3 py-1 rounded-full ${step === 'preview' ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'
                                    }`}>
                                    {t.step3}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className={`mx-auto px-4 py-8 ${step === 'upload' ? 'max-w-7xl' : 'max-w-4xl'
                }`}>
                <AnimatePresence mode="wait">
                    {/* STEP 1: Upload Photos */}
                    {step === 'upload' && (
                        <UploadStep
                            photos={photos}
                            isAnalyzing={isAnalyzing}
                            analysisProgress={analysisProgress}
                            onPhotoUpload={handlePhotoUpload}
                            onRemovePhoto={removePhoto}
                            onNext={handleAnalyzeAndProceed}
                        />
                    )}

                    {/* STEP 1.5: Category Confirmation (NEW!) */}
                    {step === 'category-confirm' && categoryDecision && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-gray-800 rounded-xl p-6">
                                <h2 className="text-2xl font-bold text-white mb-2">
                                    ✨ กรุณายืนยันหมวดหมู่
                                </h2>
                                <p className="text-gray-400">
                                    AI วิเคราะห์สินค้าของคุณแล้ว กรุณาตรวจสอบและเลือกหมวดที่ถูกต้อง
                                </p>
                            </div>

                            <CategoryConfirmation
                                recommendations={categoryDecision.recommended_categories}
                                autoSelected={categoryDecision.auto_selected}
                                selectedCategoryId={selectedCategoryId}
                                selectedSubcategoryId={selectedSubcategoryId}
                                productTitle={listingData.title}
                                productDescription={listingData.description}
                                onSelectCategory={(id) => {
                                    setSelectedCategoryId(id)
                                    setListingData(prev => ({ ...prev, category: id }))
                                }}
                                onSelectSubcategory={(id) => {
                                    setSelectedSubcategoryId(id)
                                    // Store in listing data if needed
                                }}
                                onConfirm={() => {
                                    if (selectedCategoryId || categoryDecision.auto_selected) {
                                        setStep('details')
                                    }
                                }}
                            />

                            <button
                                onClick={() => setStep('upload')}
                                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                ย้อนกลับแก้ไขรูป
                            </button>
                        </motion.div>
                    )}

                    {/* STEP 2: Details */}
                    {step === 'details' && (
                        <DetailsStep
                            data={listingData}
                            onChange={setListingData}
                            onRegenerateField={regenerateField}
                            onBack={() => setStep('upload')}
                            onNext={() => setStep('preview')}
                        />
                    )}

                    {/* STEP 3: Preview */}
                    {step === 'preview' && (
                        <PreviewStep
                            data={listingData}
                            onBack={() => setStep('details')}
                            onPublish={async () => {
                                // TODO: Implement publish
                                alert('🎉 ลงขายสำเร็จ!')
                            }}
                        />
                    )}
                </AnimatePresence>
            </div>

            {/* AI Processing Indicator (Fixed bottom-right) */}
            {isAnalyzing && (
                <motion.div
                    className="fixed bottom-4 right-4 bg-gradient-to-r from-purple-900/90 to-pink-900/90 
                     backdrop-blur-sm rounded-lg p-4 shadow-xl max-w-xs"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="flex items-center gap-3">
                        <Sparkles className="w-5 h-5 text-purple-300 animate-pulse" />
                        <div className="flex-1">
                            <div className="text-sm font-medium text-white">
                                🤖 AI กำลังวิเคราะห์...
                            </div>
                            <div className="text-xs text-purple-200 mt-1">
                                {analysisProgress}%
                            </div>
                        </div>
                    </div>
                    <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${analysisProgress}%` }}
                            transition={{ duration: 0.3 }}
                        />
                    </div>
                </motion.div>
            )}
        </div>
    )
}

// UploadStep component
function UploadStep({ photos, isAnalyzing, analysisProgress, onPhotoUpload, onRemovePhoto, onNext }: any) {
    const { language } = useLanguage()

    const t = {
        title: language === 'th' ? '📸 อัพโหลดรูปสินค้า' : '📸 Upload Product Photos',
        subtitle: language === 'th' ? 'สูงสุด 10 รูป • AI จะวิเคราะห์อัตโนมัติ' : 'Max 10 photos • AI will analyze automatically',
        next: language === 'th' ? 'ถัดไป' : 'Next'
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">{t.title}</h2>
                <p className="text-gray-400">{t.subtitle}</p>
            </div>

            {/* Real photo uploader */}
            <PhotoUploaderAdvanced
                maxPhotos={10}
                onPhotosChange={(files) => {
                    // Update parent state properly
                    const photoObjects = files.map(file => ({
                        file,
                        preview: URL.createObjectURL(file),
                        analyzed: false
                    }))
                    // This will properly trigger parent's state update
                    onPhotoUpload(files)
                }}
                onFirstPhotoReady={(file) => {
                    // Trigger AI analysis on first photo
                    console.log('🤖 First photo ready, starting AI analysis:', file.name)
                    // Parent handlePhotoUpload will call analyzeWithAI
                }}
            />

            {/* Next button - triggers AI analysis */}
            {photos.length > 0 && !isAnalyzing && (
                <button
                    onClick={onNext}
                    className="w-full mt-6 px-6 py-4 bg-purple-600 hover:bg-purple-700 
                     rounded-lg font-medium text-white transition-colors
                     flex items-center justify-center gap-2"
                >
                    {t.next} <ArrowRight className="w-5 h-5" />
                </button>
            )}

            {/* Show analyzing status when processing */}
            {isAnalyzing && (
                <div className="mt-6 p-6 bg-purple-900/20 border-2 border-purple-500 rounded-xl">
                    <div className="flex items-center gap-4">
                        <div className="animate-spin">
                            <Sparkles className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-bold text-white mb-1">
                                🤖 AI กำลังวิเคราะห์สินค้า...
                            </h3>
                            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                                    style={{ width: `${analysisProgress}%` }}
                                />
                            </div>
                            <p className="text-sm text-purple-300 mt-2">
                                {analysisProgress}% • กำลังระบุหมวดหมู่และรายละเอียด...
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    )
}

function DetailsStep({ data, onChange, onRegenerateField, onBack, onNext }: any) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">📝 รายละเอียดสินค้า</h2>
                <p className="text-gray-400">AI เติมให้แล้ว คุณสามารถแก้ไขได้</p>
            </div>

            {/* i18n Enhanced Form */}
            <SmartDetailsFormI18n
                data={data}
                aiAnalysis={data.aiAnalysis}
                onChange={onChange}
                onRegenerateField={onRegenerateField}
                isRegenerating={false}
            />

            <div className="flex gap-4 mt-6">
                <button
                    onClick={onBack}
                    className="px-6 py-4 bg-gray-700 hover:bg-gray-600 
                     rounded-lg font-medium text-white transition-colors
                     flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" /> กลับ
                </button>
                <button
                    onClick={onNext}
                    className="flex-1 px-6 py-4 bg-purple-600 hover:bg-purple-700 
                     rounded-lg font-medium text-white transition-colors
                     flex items-center justify-center gap-2"
                >
                    ดูตัวอย่าง <Eye className="w-5 h-5" />
                </button>
            </div>
        </motion.div>
    )
}

function PreviewStep({ data, onBack, onPublish }: any) {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">👁️ ตรวจสอบก่อนโพส</h2>
                <p className="text-gray-400">ตรวจสอบความถูกต้องอีกครั้ง</p>
            </div>

            {/* Real ListingPreview */}
            <ListingPreview
                data={data}
                onEdit={(section) => {
                    if (section === 'photos') onBack()
                    else onBack()
                }}
            />

            <div className="flex gap-4 mt-6">
                <button
                    onClick={onBack}
                    className="px-6 py-4 bg-gray-700 hover:bg-gray-600 
                     rounded-lg font-medium text-white transition-colors
                     flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" /> แก้ไข
                </button>
                <button
                    onClick={onPublish}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600
                     hover:from-green-700 hover:to-emerald-700
                     rounded-lg font-medium text-white transition-all
                     flex items-center justify-center gap-2 shadow-lg"
                >
                    🚀 เผยแพร่ประกาศ
                </button>
            </div>
        </motion.div>
    )
}

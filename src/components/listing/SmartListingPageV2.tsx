'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Upload, X, ChevronRight, ChevronLeft, Sparkles, Eye, MapPin,
    Package, ImageIcon, Search, Check, Zap, TrendingUp, Award
} from 'lucide-react'
import { CATEGORIES } from '@/constants/categories'
import AddressSelector from '@/components/ui/AddressSelector'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { createProduct } from '@/lib/products'
import { useRouter } from 'next/navigation'
import {
    analyzeImages,
    findBestMainImage,
    generateOverallTips,
    type ImageAnalysisResult
} from '@/lib/ai-image-analyzer'
import {
    predictPrice,
    getPriceTips,
    type PricePrediction
} from '@/lib/ai-price-predictor'
import { compressImages, getCompressionMessage, formatFileSize } from '@/lib/image-compressor'
import DraggableImageGrid from '@/components/ui/DraggableImageGrid'
import ImageCropper from '@/components/ui/ImageCropper'
import AICelebration from '@/components/ui/AICelebration'
import AIBubble from '@/components/ui/AIBubble'
import { ImpactStats } from '@/components/ui/ImpactBadge'
import { getOpenAIVisionService } from '@/lib/openai-vision-service'
import SmartDescriptionPanel from '@/components/listing/SmartDescriptionPanel'

type Step = 'upload' | 'category' | 'details' | 'review'

export default function SmartListingPageV2() {
    const { language } = useLanguage()
    const { user } = useAuth()
    const router = useRouter()

    // Steps
    const [currentStep, setCurrentStep] = useState<Step>('upload')

    // Step 1: Images
    const [images, setImages] = useState<File[]>([])
    const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysisResult[]>([])
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    // Step 2: Category
    const [categoryId, setCategoryId] = useState<number>(0)
    const [subcategoryId, setSubcategoryId] = useState<number | undefined>(undefined)
    const [searchCategory, setSearchCategory] = useState('')

    // Step 3: Details
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState(0)
    const [description, setDescription] = useState('')
    const [condition, setCondition] = useState('used')
    const [province, setProvince] = useState('')
    const [amphoe, setAmphoe] = useState('')
    const [district, setDistrict] = useState('')
    const [zipcode, setZipcode] = useState('')
    const [canShip, setCanShip] = useState(false)

    // AI State
    const [pricePrediction, setPricePrediction] = useState<PricePrediction | null>(null)
    const [aiSpecs, setAiSpecs] = useState<Record<string, string>>({})
    const [aiTips, setAiTips] = useState<string[]>([])
    // ✅ NEW: Store AI Vision detected price for PriceAnalysisPanel
    const [aiVisionPrice, setAiVisionPrice] = useState<{ min: number; max: number; suggested: number } | undefined>(undefined)

    // AI UX Enhancement State
    const [showAIBubble, setShowAIBubble] = useState(false)
    const [aiBubbleMessage, setAiBubbleMessage] = useState('')
    const [celebrationTrigger, setCelebrationTrigger] = useState(false)
    const [cropIndex, setCropIndex] = useState<number | null>(null)

    // Publishing
    const [isPublishing, setIsPublishing] = useState(false)

    // Translations
    const t = {
        th: {
            uploadTitle: 'อัพโหลดรูปภาพ',
            uploadSubtitle: 'อัพโหลดรูปสินค้าหรือถ่ายรูปจากกล้อง',
            uploadButton: 'เลือกรูป',
            categoryTitle: 'เลือกหมวดหมู่',
            searchCategory: 'ค้นหาหมวดหมู่...',
            selectSubcategory: 'เลือกหมวดหมู่ย่อย',
            selectedCategory: 'หมวดหมู่ที่เลือก',
            detailsTitle: 'รายละเอียดสินค้า',
            productTitle: 'ชื่อสินค้า',
            titlePlaceholder: 'เช่น iPhone 15 Pro Max 256GB',
            price: 'ราคา',
            description: 'รายละเอียด',
            descPlaceholder: 'อธิบายรายละเอียดสินค้า สภาพ ฯลฯ',
            condition: 'สภาพสินค้า',
            conditions: {
                new: 'ใหม่',
                like_new: 'เหมือนใหม่',
                good: 'ดี',
                fair: 'ปานกลาง',
                used: 'มือสอง'
            },
            location: 'ที่อยู่',
            shipping: 'จัดส่ง',
            shippingYes: 'ส่งได้',
            reviewTitle: 'ตรวจสอบและเผยแพร่',
            publish: 'เผยแพร่',
            back: 'ย้อนกลับ',
            next: 'ถัดไป',
            aiAutoFill: 'AI เติมข้อมูล',
            aiWriteDesc: 'AI เขียนให้',
            buyerView: 'ตัวอย่างที่ผู้ซื้อเห็น',
            aiTips: 'AI แนะนำ'
        },
        en: {
            uploadTitle: 'Upload Images',
            uploadSubtitle: 'Upload product photos or take from camera',
            uploadButton: 'Select Images',
            categoryTitle: 'Select Category',
            searchCategory: 'Search category...',
            selectSubcategory: 'Select Subcategory',
            selectedCategory: 'Selected Category',
            detailsTitle: 'Product Details',
            productTitle: 'Product Title',
            titlePlaceholder: 'e.g. iPhone 15 Pro Max 256GB',
            price: 'Price',
            description: 'Description',
            descPlaceholder: 'Describe product details, condition, etc.',
            condition: 'Condition',
            conditions: {
                new: 'New',
                like_new: 'Like New',
                good: 'Good',
                fair: 'Fair',
                used: 'Used'
            },
            location: 'Location',
            shipping: 'Shipping',
            shippingYes: 'Available',
            reviewTitle: 'Review & Publish',
            publish: 'Publish',
            back: 'Back',
            next: 'Next',
            aiAutoFill: 'AI Auto-fill',
            aiWriteDesc: 'AI Write',
            buyerView: "Buyer's View",
            aiTips: 'AI Tips'
        }
    }

    const content = t[language as 'th' | 'en']

    // Image Upload with AI Analysis + Auto Compression
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        // Validate files
        let rejectedCount = 0
        let rejectedReasons: string[] = []

        const validFiles = files.filter(f => {
            // Check file type
            if (!f.type.startsWith('image/')) {
                rejectedCount++
                rejectedReasons.push(`${f.name} - ไม่ใช่ไฟล์รูปภาพ`)
                return false
            }

            // Note: ไม่ต้องเช็คขนาดไฟล์แล้ว เพราะจะย่ออัตโนมัติ
            return true
        })

        // Check max images limit
        const currentCount = images.length
        const totalAfterUpload = currentCount + validFiles.length
        let finalFiles = validFiles

        if (totalAfterUpload > 10) {
            const overflow = totalAfterUpload - 10
            rejectedCount += overflow
            rejectedReasons.push(`รูปเกิน 10 รูป (ตัดไป ${overflow} รูป)`)
            finalFiles = validFiles.slice(0, 10 - currentCount)
        }

        // Show rejections
        if (rejectedCount > 0) {
            const message = `⚠️ ไม่สามารถอัพโหลดได้ ${rejectedCount} ไฟล์\n\n${rejectedReasons.slice(0, 3).join('\n')}${rejectedReasons.length > 3 ? '\n...' : ''}`
            console.warn(message)
        }

        // Auto-compress images (like Shopee/Lazada)
        if (finalFiles.length > 0) {
            setIsAnalyzing(true)

            try {
                // Compress images
                console.log('🔄 กำลังย่อรูป...')
                const compressionResults = await compressImages(finalFiles, {
                    maxWidth: 2000,
                    maxHeight: 2000,
                    maxSizeMB: 3, // Target max 3MB
                    quality: 0.85
                })

                // Extract compressed files
                const compressedFiles = compressionResults.map(r => r.file)
                const newImages = [...images, ...compressedFiles].slice(0, 10)
                setImages(newImages)

                // Show compression summary
                const totalCompressed = compressionResults.filter(r => r.wasCompressed).length
                if (totalCompressed > 0) {
                    const totalOriginal = compressionResults.reduce((sum, r) => sum + r.originalSize, 0)
                    const totalFinal = compressionResults.reduce((sum, r) => sum + r.compressedSize, 0)
                    const saved = totalOriginal - totalFinal
                    const savedPercent = Math.round((saved / totalOriginal) * 100)

                    console.log(`✅ ย่อรูปสำเร็จ ${totalCompressed} ไฟล์`)
                    console.log(`📊 ประหยัด: ${formatFileSize(saved)} (${savedPercent}%)`)

                    // Compression complete (silent)
                }

                // Trigger AI Analysis
                const results = await analyzeImages(newImages)
                setImageAnalysis(results)

                // 🤖 OpenAI Vision Analysis (Production-Ready!)
                try {
                    console.log('🤖 เริ่ม AI Vision Analysis...')
                    const aiVisionService = getOpenAIVisionService()

                    // Analyze first image
                    const visionResult = await aiVisionService.analyzeImage(newImages[0])

                    // Check if prohibited
                    if (visionResult.isProhibited) {
                        alert(`🚫 ไม่สามารถลงขายได้!\n\n${visionResult.prohibitedReason}\n\nกรุณาเลือกรูปภาพสินค้าที่เหมาะสม`)
                        setImages([])
                        setImageAnalysis([])
                        setIsAnalyzing(false)
                        return
                    }

                    // Auto-fill form fields
                    if (!title && visionResult.title) {
                        setTitle(visionResult.title)
                    }
                    if (!description && visionResult.description) {
                        setDescription(visionResult.description)
                    }

                    // Auto-select category
                    if (categoryId === 0 && visionResult.suggestedCategory) {
                        const catId = aiVisionService.mapCategoryToId(visionResult.suggestedCategory)
                        if (catId > 0) {
                            setCategoryId(catId)
                        }
                    }

                    // Auto-fill price & store for PriceAnalysisPanel
                    if (visionResult.estimatedPrice) {
                        // ✅ Always store AI Vision price for accurate pricing
                        setAiVisionPrice(visionResult.estimatedPrice)

                        // Auto-fill price if empty
                        if (price === 0) {
                            setPrice(visionResult.estimatedPrice.suggested)
                        }
                    }

                    // Auto-fill condition
                    if (visionResult.estimatedCondition) {
                        setCondition(visionResult.estimatedCondition)
                    }

                    // Capture AI specs for SmartDescriptionPanel
                    if (visionResult.structuredSpecs) {
                        setAiSpecs(visionResult.structuredSpecs)
                    }

                    // Add detected brands to specs
                    if (visionResult.detectedBrands?.length > 0) {
                        setAiSpecs(prev => ({
                            ...prev,
                            brand: visionResult.detectedBrands[0]
                        }))
                    }

                    console.log('✅ AI Vision Analysis สำเร็จ!')

                } catch (visionError: any) {
                    console.warn('⚠️ AI Vision Error:', visionError.message)
                    console.log('💡 กรุณาตรวจสอบ OpenAI API Key หรือ Credit')
                }

                // Auto-reorder: put best image first
                const bestIndex = findBestMainImage(results)
                if (bestIndex !== 0) {
                    const reordered = [...newImages]
                    const best = reordered.splice(bestIndex, 1)[0]
                    reordered.unshift(best)
                    setImages(reordered)

                    // Re-analyze with new order
                    const reorderedResults = [...results]
                    const bestResult = reorderedResults.splice(bestIndex, 1)[0]
                    reorderedResults.unshift(bestResult)
                    setImageAnalysis(reorderedResults)
                }

                // Generate overall tips
                const tips = generateOverallTips(results)
                setAiTips(tips)

                // 🎉 AI UX Enhancement
                setCelebrationTrigger(true)

                // Calculate average score
                const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length

                // Show AI Bubble with personality
                if (avgScore >= 90) {
                    setAiBubbleMessage(`🎉 เยี่ยมมาก! คะแนนเฉลี่ย ${Math.round(avgScore)}/100\nรูปคุณภาพสูงมาก พร้อมขายเลย!`)
                    setShowAIBubble(true)
                    setTimeout(() => setShowAIBubble(false), 5000)
                } else if (avgScore >= 80) {
                    setAiBubbleMessage(`✨ ดีมาก! คะแนนเฉลี่ย ${Math.round(avgScore)}/100\nเพิ่มอีกนิดจะได้ A แน่นอน`)
                    setShowAIBubble(true)
                    setTimeout(() => setShowAIBubble(false), 5000)
                } else if (avgScore >= 70) {
                    setAiBubbleMessage(`💡 รูปดีแล้ว คะแนน ${Math.round(avgScore)}/100\nต้องการให้ AI ช่วยปรับปรุงไหม?`)
                    setShowAIBubble(true)
                } else {
                    setAiBubbleMessage(`🎨 คะแนน ${Math.round(avgScore)}/100\nลองถ่ายในที่สว่างกว่านี้ หรือให้ AI ช่วยปรับแสง?`)
                    setShowAIBubble(true)
                }
            } catch (error) {
                console.error('Processing error:', error)
                console.error('⚠️ เกิดข้อผิดพลาดในการประมวลผลรูป')
            } finally {
                setIsAnalyzing(false)
            }
        }
    }

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        setImages(newImages)

        // Re-analyze remaining images
        if (newImages.length > 0) {
            analyzeImages(newImages).then(results => {
                setImageAnalysis(results)
                const tips = generateOverallTips(results)
                setAiTips(tips)
            })
        } else {
            setImageAnalysis([])
            setAiTips([])
        }
    }

    // Drag & Drop Handler
    const handleReorder = (newImages: File[]) => {
        setImages(newImages)
        if (newImages.length > 0) {
            analyzeImages(newImages).then(results => {
                setImageAnalysis(results)
                const tips = generateOverallTips(results)
                setAiTips(tips)
            })
        }
    }

    // Crop Handlers
    const handleCrop = (index: number) => {
        setCropIndex(index)
    }

    const handleCropSave = (croppedFile: File) => {
        if (cropIndex !== null) {
            const newImages = [...images]
            newImages[cropIndex] = croppedFile
            setImages(newImages)

            analyzeImages(newImages).then(results => {
                setImageAnalysis(results)
                const tips = generateOverallTips(results)
                setAiTips(tips)
            })

            setCropIndex(null)
        }
    }


    // Auto Price Prediction when category/condition changes
    // Priority: 1. AI Vision price → 2. Rule-based → 3. AI refinement
    useEffect(() => {
        if (categoryId > 0 && imageAnalysis.length > 0) {
            const avgScore = imageAnalysis.reduce((sum, r) => sum + r.score, 0) / imageAnalysis.length

            // ✅ Priority 1: Use AI Vision price if available (most accurate)
            if (aiVisionPrice && aiVisionPrice.suggested > 0) {
                const visionPrediction: PricePrediction = {
                    suggestedPrice: aiVisionPrice.suggested,
                    minPrice: aiVisionPrice.min,
                    maxPrice: aiVisionPrice.max,
                    confidence: 90,
                    source: 'ai-vision' as const,
                    reasoning: '🤖 ราคาจาก AI Vision วิเคราะห์จากรูปภาพจริง'
                }
                setPricePrediction(visionPrediction)

                // Don't override if user already set a price
                if (price === 0) {
                    setPrice(aiVisionPrice.suggested)
                }

                console.log('🤖 Using AI Vision Price:', aiVisionPrice.suggested)
                return  // Skip rule-based
            }

            // Priority 2: Rule-based prediction (instant)
            const instantPrediction = predictPrice(
                categoryId,
                condition,
                avgScore,
                images.length > 1,
                subcategoryId
            )

            setPricePrediction(instantPrediction)

            // Auto-fill price if empty
            if (price === 0) {
                setPrice(instantPrediction.suggestedPrice)
            }

            // Priority 3: Refinement with AI (background)
            if (title && title.length > 5) {
                import('@/lib/ai-price-predictor').then(async ({ getAIPricePrediction }) => {
                    try {
                        const aiPrediction = await getAIPricePrediction(
                            title,
                            categoryId,
                            condition,
                            subcategoryId,
                            aiSpecs
                        )

                        if (aiPrediction.source === 'ai-enhanced') {
                            setPricePrediction(aiPrediction)

                            // Update price if AI gives different suggestion and user hasn't changed it
                            if (price === instantPrediction.suggestedPrice) {
                                setPrice(aiPrediction.suggestedPrice)
                            }

                            console.log('🤖 AI Price Updated:', aiPrediction.suggestedPrice)
                        }
                    } catch (error) {
                        console.warn('AI price prediction failed, using rule-based:', error)
                    }
                })
            }
        }
    }, [categoryId, condition, imageAnalysis, subcategoryId, title, aiVisionPrice])

    // Update price tips when price changes
    useEffect(() => {
        if (pricePrediction && price > 0) {
            const tips = getPriceTips(pricePrediction, price)
            const imageTips = imageAnalysis.length > 0 ? generateOverallTips(imageAnalysis) : []
            setAiTips([...tips, ...imageTips])
        }
    }, [price, pricePrediction, imageAnalysis])

    // Category Search
    const filteredCategories = CATEGORIES.filter(cat => {
        const catNameMatch = cat.name_th.toLowerCase().includes(searchCategory.toLowerCase()) ||
            cat.name_en.toLowerCase().includes(searchCategory.toLowerCase())

        const subCatMatch = cat.subcategories?.some(sub =>
            sub.name_th.toLowerCase().includes(searchCategory.toLowerCase()) ||
            sub.name_en.toLowerCase().includes(searchCategory.toLowerCase())
        )

        return catNameMatch || subCatMatch
    })

    // Auto-select on search
    React.useEffect(() => {
        if (searchCategory) {
            for (const cat of CATEGORIES) {
                const matchedSubcat = cat.subcategories?.find(sub =>
                    sub.name_th.toLowerCase().includes(searchCategory.toLowerCase()) ||
                    sub.name_en.toLowerCase().includes(searchCategory.toLowerCase())
                )

                if (matchedSubcat) {
                    if (categoryId !== cat.id) {
                        setCategoryId(cat.id)
                        setSubcategoryId(matchedSubcat.id)
                        break
                    } else if (subcategoryId !== matchedSubcat.id) {
                        setSubcategoryId(matchedSubcat.id)
                        break
                    }
                }
            }
        }
    }, [searchCategory])

    const selectedCategory = CATEGORIES.find(c => c.id === categoryId)
    const subcategories = selectedCategory?.subcategories || []

    // AI Auto-fill
    const handleAIAutoFill = () => {
        if (!title && categoryId) {
            setTitle(`${selectedCategory?.name_th || 'สินค้า'} คุณภาพดี`)
        }
        if (!description) {
            setDescription(`สินค้าสภาพดี พร้อมใช้งาน

รายละเอียด:
- สภาพ: ${content.conditions[condition as keyof typeof content.conditions]}
- จัดส่ง: ${canShip ? 'ส่งได้' : 'รับเองเท่านั้น'}
- สถานที่: ${province}

สนใจติดต่อสอบถามได้เลยครับ/ค่ะ`)
        }
        if (!price) {
            setPrice(1000)
        }
    }

    // Publish
    const handlePublish = async () => {
        if (!user) {
            router.push('/login')
            return
        }

        setIsPublishing(true)
        try {
            await createProduct(
                {
                    title,
                    description,
                    price,
                    price_type: 'fixed',
                    stock: 1,
                    condition,
                    category_id: categoryId.toString(),
                    province,
                    amphoe,
                    district,
                    zipcode,
                    can_ship: canShip,
                    can_pickup: !canShip,
                    images: images
                },
                user.uid,
                user.displayName || 'Anonymous',
                user.photoURL || undefined
            )

            router.push('/profile')
        } catch (error) {
            console.error('Publishing error:', error)
            console.error('เกิดข้อผิดพลาดในการเผยแพร่', error)
        } finally {
            setIsPublishing(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                            ลงขายอัจฉริยะ
                        </h1>

                        {/* Progress Steps */}
                        <div className="flex items-center gap-2">
                            {(['upload', 'category', 'details', 'review'] as Step[]).map((step, idx) => (
                                <div key={step} className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${currentStep === step
                                        ? 'bg-purple-600 text-white'
                                        : ['upload', 'category', 'details', 'review'].indexOf(currentStep) > idx
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                        }`}>
                                        {idx + 1}
                                    </div>
                                    {idx < 3 && (
                                        <div className={`w-8 h-0.5 ${['upload', 'category', 'details', 'review'].indexOf(currentStep) > idx
                                            ? 'bg-green-500'
                                            : 'bg-gray-200 dark:bg-gray-700'
                                            }`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-6">
                <AnimatePresence mode="wait">
                    {/* Step 1: Upload */}
                    {currentStep === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                    {content.uploadTitle}
                                </h2>
                                <p className="text-   text-gray-600 dark:text-gray-400 mb-6">
                                    {content.uploadSubtitle}
                                </p>

                                {/* Upload Area */}
                                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-purple-500 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageUpload}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                                        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {content.uploadButton}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            สูงสุด 10 รูป (รูปละไม่เกิน 5MB)
                                        </p>
                                    </label>
                                </div>

                                {/* AI Celebration */}
                                <AICelebration
                                    trigger={celebrationTrigger && imageAnalysis.length > 0}
                                    grade={imageAnalysis[0]?.grade}
                                />

                                {/* Image Preview with Drag & Drop */}
                                {images.length > 0 && (
                                    <div className="mt-6 space-y-4">
                                        <DraggableImageGrid
                                            images={images}
                                            onReorder={handleReorder}
                                            onRemove={(index) => removeImage(index)}
                                            onCrop={handleCrop}
                                            imageAnalysis={imageAnalysis}
                                        />

                                        {/* AI Analyzing State */}
                                        {isAnalyzing && (
                                            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border-2 border-purple-200 dark:border-purple-800">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <Zap className="w-5 h-5 text-purple-600 animate-pulse" />
                                                    <span className="font-bold text-purple-900 dark:text-purple-300">
                                                        🤖 AI กำลังวิเคราะห์ภาพ...
                                                    </span>
                                                </div>
                                                <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                                                    <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full animate-pulse w-3/4 transition-all"></div>
                                                </div>
                                                <p className="text-xs text-purple-700 dark:text-purple-300 mt-2">
                                                    กำลังตรวจสอบคุณภาพ, ความสว่าง, ความคมชัด...
                                                </p>
                                            </div>
                                        )}

                                        {/* AI Analysis Results */}
                                        {!isAnalyzing && imageAnalysis.length > 0 && (
                                            <div className="p-4 bg-white dark:bg-gray-800 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-sm">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Award className="w-5 h-5 text-green-600" />
                                                    <span className="font-bold text-green-900 dark:text-green-300">
                                                        ✅ วิเคราะห์เสร็จสิ้น!
                                                    </span>
                                                </div>

                                                {/* Individual Image Scores */}
                                                <div className="space-y-2 mb-3">
                                                    {imageAnalysis.slice(0, 3).map((result, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                                            <span className={`px-2 py-0.5 rounded font-bold text-white text-xs ${result.grade === 'A' ? 'bg-green-500' :
                                                                result.grade === 'B' ? 'bg-blue-500' :
                                                                    result.grade === 'C' ? 'bg-yellow-500' :
                                                                        result.grade === 'D' ? 'bg-orange-500' :
                                                                            'bg-red-500'
                                                                }`}>
                                                                {result.grade}
                                                            </span>
                                                            <span className="text-gray-700 dark:text-gray-300">
                                                                รูปที่ {idx + 1}
                                                            </span>
                                                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                                                <div
                                                                    className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full transition-all"
                                                                    style={{ width: `${result.score}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs text-gray-600 dark:text-gray-400">
                                                                {result.score}/100
                                                            </span>
                                                            {result.isMainImageCandidate && (
                                                                <span className="text-yellow-500">⭐</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* AI Tips */}
                                                {aiTips.length > 0 && (
                                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <Sparkles className="w-4 h-4 text-purple-600" />
                                                            <span className="text-sm font-bold text-purple-900 dark:text-purple-300">
                                                                💡 AI แนะนำ:
                                                            </span>
                                                        </div>
                                                        <ul className="space-y-1">
                                                            {aiTips.slice(0, 3).map((tip, idx) => (
                                                                <li key={idx} className="text-xs text-gray-700 dark:text-gray-300">
                                                                    • {tip}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Impact Stats & AI Bubble */}
                                {!isAnalyzing && imageAnalysis.length > 0 && (
                                    <div className="mt-6 space-y-4">
                                        <div className="flex justify-center">
                                            <ImpactStats stats={[
                                                {
                                                    type: 'quality',
                                                    value: `${Math.round(imageAnalysis.reduce((s, r) => s + r.score, 0) / imageAnalysis.length)}%`,
                                                    label: 'คุณภาพเฉลี่ย'
                                                },
                                                { type: 'sales', value: '+20%' },
                                                { type: 'views', value: '+34%' }
                                            ]} />
                                        </div>

                                        <AIBubble
                                            show={showAIBubble}
                                            message={aiBubbleMessage}
                                            type={
                                                imageAnalysis[0]?.grade === 'A' ? 'success' :
                                                    imageAnalysis[0]?.grade === 'B' ? 'tip' :
                                                        'suggestion'
                                            }
                                            onDismiss={() => setShowAIBubble(false)}
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Crop Modal */}
                            {cropIndex !== null && (
                                <ImageCropper
                                    file={images[cropIndex]}
                                    onSave={handleCropSave}
                                    onCancel={() => setCropIndex(null)}
                                />
                            )}

                            {/* Navigation */}
                            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
                                <div className="max-w-6xl mx-auto px-4 py-3 flex justify-end">
                                    <button
                                        onClick={() => setCurrentStep('category')}
                                        disabled={images.length === 0}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {content.next}
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Category */}
                    {currentStep === 'category' && (
                        <motion.div
                            key="category"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg max-h-[calc(100vh-180px)] overflow-y-auto">
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                    {content.categoryTitle}
                                </h2>

                                {/* Search */}
                                <div className="relative mb-3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchCategory}
                                        onChange={(e) => setSearchCategory(e.target.value)}
                                        placeholder={content.searchCategory}
                                        className="w-full pl-10 pr-10 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                    />
                                    {searchCategory && (
                                        <button
                                            onClick={() => setSearchCategory('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Categories */}
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-3">
                                    {filteredCategories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setCategoryId(cat.id)
                                                setSubcategoryId(undefined)
                                                setSearchCategory('')
                                            }}
                                            className={`p-2 rounded-lg border-2 transition-all text-center ${categoryId === cat.id
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md scale-105'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                                }`}
                                        >
                                            <div className="text-2xl mb-1">{cat.icon}</div>
                                            <div className="font-medium text-gray-900 dark:text-white text-xs leading-tight">
                                                {language === 'th' ? cat.name_th : cat.name_en}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Subcategories */}
                                {categoryId > 0 && subcategories.length > 0 && (
                                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                                        <div className="flex items-center gap-2 mb-2 p-2 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                            <Check className="w-4 h-4 text-purple-600" />
                                            <p className="text-sm font-semibold text-purple-700 dark:text-purple-300">
                                                {content.selectedCategory}: {language === 'th' ? selectedCategory?.name_th : selectedCategory?.name_en}
                                            </p>
                                        </div>

                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                                            {content.selectSubcategory}
                                        </h3>
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                            {subcategories.map(sub => (
                                                <button
                                                    key={sub.id}
                                                    onClick={() => setSubcategoryId(sub.id)}
                                                    className={`p-2 rounded-lg border-2 transition-all text-xs font-medium ${subcategoryId === sub.id
                                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                                                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                                        }`}
                                                >
                                                    {language === 'th' ? sub.name_th : sub.name_en}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Navigation */}
                            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
                                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                                    <button
                                        onClick={() => setCurrentStep('upload')}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2 text-sm"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        {content.back}
                                    </button>

                                    <button
                                        onClick={() => setCurrentStep('details')}
                                        disabled={categoryId === 0}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {content.next}
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Details - AI Enhanced with 2-Column Layout */}
                    {currentStep === 'details' && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pb-24">
                                {/* LEFT: Form */}
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-purple-600" />
                                            {content.detailsTitle}
                                        </h2>
                                        <button
                                            onClick={handleAIAutoFill}
                                            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-lg hover:shadow-lg transition-all flex items-center gap-1"
                                        >
                                            <Sparkles className="w-3 h-3" />
                                            {content.aiAutoFill}
                                        </button>
                                    </div>

                                    <div className="space-y-3">
                                        {/* Title */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                                {content.productTitle} *
                                            </label>
                                            <input
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder={content.titlePlaceholder}
                                                maxLength={100}
                                                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                            />
                                            {title.length > 0 && (
                                                <span className="text-xs text-gray-400">
                                                    {title.length}/100
                                                </span>
                                            )}
                                        </div>

                                        {/* Price */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                                {content.price} *
                                            </label>
                                            <div className="relative">
                                                <span className="absolute left-3 top-2 text-lg font-bold text-gray-500">฿</span>
                                                <input
                                                    type="number"
                                                    value={price || ''}
                                                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                                                    className="w-full pl-8 pr-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-bold"
                                                />
                                            </div>
                                        </div>

                                        {/* Smart Description Panel */}
                                        <div className="bg-gray-900/30 rounded-xl p-4 border border-gray-700/50">
                                            <SmartDescriptionPanel
                                                title={title}
                                                categoryId={categoryId}
                                                subcategoryId={subcategoryId}
                                                condition={condition}
                                                aiSpecs={aiSpecs}
                                                onDescriptionChange={(desc) => setDescription(desc)}
                                                onSpecsChange={(specs) => {
                                                    // 🎯 Auto-update title based on specs (ALL categories)
                                                    import('@/lib/product-ai').then(({ enhanceTitleByCategory }) => {
                                                        const { title: newTitle, changed } = enhanceTitleByCategory(
                                                            categoryId,
                                                            title,
                                                            specs
                                                        )
                                                        if (changed && newTitle !== title) {
                                                            setTitle(newTitle)
                                                        }
                                                    })
                                                    // Sync specs to parent
                                                    setAiSpecs(prev => ({ ...prev, ...specs }))
                                                }}
                                                language={language === 'th' ? 'th' : 'en'}
                                            />
                                        </div>

                                        {/* Condition */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                                                {content.condition}
                                            </label>
                                            <div className="grid grid-cols-5 gap-2">
                                                {Object.entries(content.conditions).map(([value, label]) => (
                                                    <button
                                                        key={value}
                                                        onClick={() => setCondition(value)}
                                                        className={`p-2 rounded-lg border-2 font-medium transition-all text-xs ${condition === value
                                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                                                            : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                                                            }`}
                                                    >
                                                        {label}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {content.location}
                                            </label>
                                            <AddressSelector
                                                initialValues={{ province, amphoe, district, zipcode }}
                                                onAddressChange={(address) => {
                                                    setProvince(address.province)
                                                    setAmphoe(address.amphoe)
                                                    setDistrict(address.district)
                                                    setZipcode(address.zipcode)
                                                }}
                                            />
                                        </div>

                                        {/* Shipping */}
                                        <div>
                                            <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                                                <input
                                                    type="checkbox"
                                                    checked={canShip}
                                                    onChange={(e) => setCanShip(e.target.checked)}
                                                    className="w-4 h-4 text-purple-600 rounded"
                                                />
                                                <span className="text-sm text-gray-700 dark:text-gray-300">{content.shippingYes}</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT: Live Preview */}
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <Eye className="w-4 h-4 text-purple-600" />
                                            {content.buyerView}
                                        </h3>
                                        <span className="text-xs text-gray-500">Live Preview</span>
                                    </div>

                                    {/* Product Card Preview */}
                                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                                        {images.length > 0 ? (
                                            <div className="aspect-[4/3] bg-gray-100 dark:bg-gray-700 relative">
                                                <img
                                                    src={URL.createObjectURL(images[0])}
                                                    alt="Preview"
                                                    className="w-full h-full object-cover"
                                                />
                                                {images.length > 1 && (
                                                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                                        +{images.length - 1} รูป
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                                <ImageIcon className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}

                                        <div className="p-3 space-y-2">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-2">
                                                {title || 'ชื่อสินค้า...'}
                                            </h4>

                                            <div className="flex items-end gap-2">
                                                <span className="text-2xl font-extrabold text-purple-600">
                                                    ฿{price > 0 ? price.toLocaleString() : '0'}
                                                </span>
                                            </div>

                                            {condition === 'new' && (
                                                <span className="inline-block bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded font-bold">
                                                    NEW
                                                </span>
                                            )}

                                            {description && (
                                                <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3">
                                                    {description}
                                                </p>
                                            )}

                                            <div className="flex items-center gap-1 text-xs text-gray-500">
                                                <MapPin className="w-3 h-3" />
                                                {province || 'ไม่ระบุ'}
                                            </div>

                                            {canShip && (
                                                <div className="flex items-center gap-1 text-xs text-green-600">
                                                    <Package className="w-3 h-3" />
                                                    จัดส่งได้
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* AI Tips */}
                                    <div className="mt-3 bg-white dark:bg-gray-800 rounded-xl p-3 border-2 border-purple-200 dark:border-purple-800">
                                        <h4 className="text-xs font-bold text-purple-600 mb-2 flex items-center gap-1">
                                            <Sparkles className="w-3 h-3" />
                                            {content.aiTips}
                                        </h4>
                                        <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                                            {!title && <li>• เพิ่มชื่อสินค้าที่ชัดเจน</li>}
                                            {!price && <li>• ระบุราคาที่เหมาะสม</li>}
                                            {!province && <li>• เลือกจังหวัดที่ตั้ง</li>}
                                            {description.length < 50 && <li>• เขียนรายละเอียดให้ครบ (อย่างน้อย 50 ตัวอักษร)</li>}
                                            {images.length < 3 && <li>• เพิ่มรูปอีก {3 - images.length} รูป = +{18 * (3 - images.length)}% ยอดขาย</li>}
                                            {title && price && province && description.length >= 50 && images.length >= 3 && (
                                                <li className="text-green-600 font-semibold">✓ ข้อมูลครบถ้วน พร้อมเผยแพร่!</li>
                                            )}
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Navigation */}
                            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
                                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
                                    <button
                                        onClick={() => setCurrentStep('category')}
                                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 transition-colors flex items-center gap-2 text-sm"
                                    >
                                        <ChevronLeft className="w-4 h-4" />
                                        {content.back}
                                    </button>

                                    <button
                                        onClick={handlePublish}
                                        disabled={!title || !price || !province || isPublishing}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isPublishing ? 'กำลังเผยแพร่...' : content.publish}
                                        {!isPublishing && <ChevronRight className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Spacer for fixed footer */}
            <div className="h-16"></div>
        </div>
    )
}

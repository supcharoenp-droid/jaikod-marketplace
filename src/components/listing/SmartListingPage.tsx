'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
    Upload, X, Image as ImageIcon, ChevronRight, ChevronLeft,
    MapPin, Package, Sparkles, CheckCircle, Search, Zap,
    TrendingUp, DollarSign, FileText, Eye
} from 'lucide-react'
import { CATEGORIES } from '@/constants/categories'
import AddressSelector from '@/components/ui/AddressSelector'
import { createProduct, CreateProductInput } from '@/lib/products'

type Step = 'upload' | 'category' | 'details' | 'review'

export default function SmartListingPage() {
    const router = useRouter()
    const { user } = useAuth()
    const [currentStep, setCurrentStep] = useState<Step>('upload')
    const [language, setLanguage] = useState<'th' | 'en'>('th')

    // Form data
    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [categoryId, setCategoryId] = useState<number>(0)
    const [subcategoryId, setSubcategoryId] = useState<number | undefined>(undefined)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState<number>(0)
    const [condition, setCondition] = useState('good')
    const [province, setProvince] = useState('')
    const [amphoe, setAmphoe] = useState('')
    const [district, setDistrict] = useState('')
    const [zipcode, setZipcode] = useState('')
    const [canShip, setCanShip] = useState(true)
    const [canPickup, setCanPickup] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [searchCategory, setSearchCategory] = useState('')

    const content = {
        th: {
            steps: {
                upload: 'อัพโหลดรูปภาพ',
                category: 'เลือกหมวดหมู่',
                details: 'กรอกรายละเอียด',
                review: 'ตรวจสอบ'
            },
            uploadTitle: 'อัพโหลดรูปภาพสินค้า',
            uploadSubtitle: 'เพิ่มรูปภาพสินค้าของคุณ (สูงสุด 10 รูป)',
            uploadButton: 'เลือกรูปภาพ',
            orDrag: 'หรือลากไฟล์มาวางที่นี่',
            categoryTitle: 'เลือกหมวดหมู่สินค้า',
            categorySubtitle: 'เลือกหมวดหมู่ที่เหมาะสมกับสินค้าของคุณ',
            searchCategory: 'ค้นหาหมวดหมู่...',
            selectSubcategory: 'เลือกหมวดหมู่ย่อย',
            detailsTitle: 'รายละเอียดสินค้า',
            productTitle: 'ชื่อสินค้า',
            titlePlaceholder: 'เช่น TV Samsung 55 นิ้ว, เสื้อยืด Uniqlo, iPhone 15',
            price: 'ราคา (บาท)',
            description: 'รายละเอียด',
            descPlaceholder: 'อธิบายสินค้าของคุณ...',
            condition: 'สภาพสินค้า',
            location: 'ที่อยู่สินค้า',
            shipping: 'การจัดส่ง',
            shippingYes: 'รับจัดส่ง',
            pickupYes: 'รับหน้าร้าน',
            reviewTitle: 'ตรวจสอบข้อมูล',
            reviewSubtitle: 'ตรวจสอบข้อมูลก่อนเผยแพร่',
            next: 'ถัดไป',
            back: 'ย้อนกลับ',
            publish: 'เผยแพร่ประกาศ',
            publishing: 'กำลังเผยแพร่...',
            conditions: {
                new: 'ใหม่',
                like_new: 'เหมือนใหม่',
                good: 'ดี',
                fair: 'พอใช้',
                poor: 'มีตำหนิ'
            },
            success: '✅ ลงประกาศสินค้าสำเร็จ!',
            error: '❌ เกิดข้อผิดพลาด กรุณาลองใหม่',
            pleaseLogin: 'กรุณาเข้าสู่ระบบก่อน',
            fillRequired: 'กรุณากรอกข้อมูลให้ครบถ้วน'
        },
        en: {
            steps: {
                upload: 'Upload Photos',
                category: 'Select Category',
                details: 'Product Details',
                review: 'Review'
            },
            uploadTitle: 'Upload Product Photos',
            uploadSubtitle: 'Add photos of your product (max 10 photos)',
            uploadButton: 'Choose Photos',
            orDrag: 'or drag and drop files here',
            categoryTitle: 'Select Product Category',
            categorySubtitle: 'Choose the most suitable category for your product',
            searchCategory: 'Search categories...',
            selectSubcategory: 'Select Subcategory',
            detailsTitle: 'Product Details',
            productTitle: 'Product Title',
            titlePlaceholder: 'e.g. Samsung TV 55", Uniqlo Shirt, iPhone 15',
            price: 'Price (THB)',
            description: 'Description',
            descPlaceholder: 'Describe your product...',
            condition: 'Condition',
            location: 'Location',
            shipping: 'Shipping',
            shippingYes: 'Shipping Available',
            pickupYes: 'Pickup Available',
            reviewTitle: 'Review Information',
            reviewSubtitle: 'Review before publishing',
            next: 'Next',
            back: 'Back',
            publish: 'Publish Listing',
            publishing: 'Publishing...',
            conditions: {
                new: 'New',
                like_new: 'Like New',
                good: 'Good',
                fair: 'Fair',
                poor: 'Poor'
            },
            success: '✅ Product listed successfully!',
            error: '❌ Error publishing. Please try again',
            pleaseLogin: 'Please login first',
            fillRequired: 'Please fill required fields'
        }
    }

    const t = content[language]

    const steps: Step[] = ['upload', 'category', 'details', 'review']
    const currentStepIndex = steps.indexOf(currentStep)
    const progress = ((currentStepIndex + 1) / steps.length) * 100

    // Handle image upload
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (images.length + files.length > 10) {
            alert(language === 'th' ? 'สามารถอัพโหลดได้สูงสุด 10 รูปเท่านั้น' : 'Maximum 10 photos allowed')
            return
        }

        setImages(prev => [...prev, ...files])

        files.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        const files = Array.from(e.dataTransfer.files)
        if (images.length + files.length > 10) {
            alert(language === 'th' ? 'สามารถอัพโหลดได้สูงสุด 10 รูปเท่านั้น' : 'Maximum 10 photos allowed')
            return
        }

        setImages(prev => [...prev, ...files])

        files.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    const handleSubmit = async () => {
        if (!user) {
            alert(t.pleaseLogin)
            return
        }

        if (!title || !categoryId || price <= 0) {
            alert(t.fillRequired)
            return
        }

        setIsSubmitting(true)

        try {
            const productInput: CreateProductInput = {
                title,
                description,
                price,
                price_type: 'fixed',
                category_id: categoryId.toString(),
                images,
                condition,
                province,
                amphoe,
                district,
                zipcode,
                can_ship: canShip,
                can_pickup: canPickup,
                stock: 1
            }

            await createProduct(
                productInput,
                (user as any).uid || (user as any).id,
                (user as any).displayName || 'Seller',
                (user as any).photoURL || ''
            )

            alert(t.success)
            router.push('/seller/products')
        } catch (error) {
            console.error('Publishing error:', error)
            alert(t.error)
        } finally {
            setIsSubmitting(false)
        }
    }

    // Enhanced search: search in both category and subcategory names
    const filteredCategories = CATEGORIES.filter(cat => {
        const catNameMatch = cat.name_th.toLowerCase().includes(searchCategory.toLowerCase()) ||
            cat.name_en.toLowerCase().includes(searchCategory.toLowerCase())

        const subCatMatch = cat.subcategories?.some(sub =>
            sub.name_th.toLowerCase().includes(searchCategory.toLowerCase()) ||
            sub.name_en.toLowerCase().includes(searchCategory.toLowerCase())
        )

        return catNameMatch || subCatMatch
    })

    // Auto-select category and subcategory when searching in subcategories
    React.useEffect(() => {
        if (searchCategory) {
            // Check if search matches any subcategory
            for (const cat of CATEGORIES) {
                const matchedSubcat = cat.subcategories?.find(sub =>
                    sub.name_th.toLowerCase().includes(searchCategory.toLowerCase()) ||
                    sub.name_en.toLowerCase().includes(searchCategory.toLowerCase())
                )

                // Only update if found and different from current selection
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
    }, [searchCategory]) // Only depend on searchCategory to avoid infinite loop

    const selectedCategory = CATEGORIES.find(c => c.id === categoryId)
    const subcategories = selectedCategory?.subcategories || []

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
                                <Zap className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {language === 'th' ? 'ลงขายอัจฉริยะ' : 'Smart Listing'}
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {t.steps[currentStep]}
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={() => setLanguage(lang => lang === 'th' ? 'en' : 'th')}
                            className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            {language === 'th' ? '🇬🇧 EN' : '🇹🇭 TH'}
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                                transition={{ duration: 0.3 }}
                                className="h-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full"
                            />
                        </div>
                        <div className="flex justify-between mt-2">
                            {steps.map((step, index) => (
                                <div
                                    key={step}
                                    className={`text-xs font-medium ${index <= currentStepIndex
                                        ? 'text-purple-600 dark:text-purple-400'
                                        : 'text-gray-400 dark:text-gray-600'
                                        }`}
                                >
                                    {index + 1}. {t.steps[step]}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-4">
                <AnimatePresence mode="wait">
                    {/* Step 1: Upload Images */}
                    {currentStep === 'upload' && (
                        <motion.div
                            key="upload"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <div className="text-center mb-4">
                                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 mb-3">
                                        <ImageIcon className="w-7 h-7 text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                        {t.uploadTitle}
                                    </h2>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {t.uploadSubtitle}
                                    </p>
                                </div>

                                <div
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center hover:border-purple-500 dark:hover:border-purple-400 transition-all cursor-pointer bg-gray-50 dark:bg-gray-900/50"
                                >
                                    <input
                                        type="file"
                                        id="image-upload"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <label htmlFor="image-upload" className="cursor-pointer">
                                        <Upload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('image-upload')?.click()}
                                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                        >
                                            {t.uploadButton}
                                        </button>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            {t.orDrag}
                                        </p>
                                    </label>
                                </div>

                                {/* Image Previews - Moved up */}
                                {imagePreviews.length > 0 && (
                                    <div className="mt-4">
                                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {language === 'th' ? `รูปภาพที่เลือก (${images.length}/10)` : `Selected Images (${images.length}/10)`}
                                        </p>
                                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                                            {imagePreviews.map((preview, index) => (
                                                <div key={index} className="relative group">
                                                    <img
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg shadow-sm"
                                                    />
                                                    <button
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                    {index === 0 && (
                                                        <div className="absolute bottom-1 left-1 px-2 py-0.5 bg-purple-600 text-white text-xs rounded font-semibold shadow-lg">
                                                            {language === 'th' ? 'หลัก' : 'Main'}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Sticky Navigation Buttons */}
                            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
                                <div className="max-w-6xl mx-auto px-4 py-4 flex justify-end">
                                    <button
                                        onClick={() => setCurrentStep('category')}
                                        disabled={images.length === 0}
                                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {t.next}
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Spacer for fixed footer */}
                            <div className="h-20"></div>
                        </motion.div>
                    )}

                    {/* Step 2: Select Category */}
                    {currentStep === 'category' && (
                        <motion.div
                            key="category"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-3"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                                <div className="text-center mb-3">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                        {t.categoryTitle}
                                    </h2>
                                    <p className="text-xs text-gray-600 dark:text-gray-400">
                                        {t.categorySubtitle}
                                    </p>
                                </div>

                                {/* Search */}
                                <div className="relative mb-3">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchCategory}
                                        onChange={(e) => setSearchCategory(e.target.value)}
                                        placeholder={t.searchCategory}
                                        className="w-full pl-10 pr-10 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                                    />
                                    {searchCategory && (
                                        <button
                                            onClick={() => setSearchCategory('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                                            aria-label="Clear search"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Category Grid */}
                                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mb-3">
                                    {filteredCategories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                setCategoryId(cat.id)
                                                setSubcategoryId(undefined)
                                                setSearchCategory('') // Clear search when selecting category
                                            }}
                                            className={`p-2 rounded-lg border-2 transition-all text-center ${categoryId === cat.id
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-md scale-105'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600 hover:shadow-sm'
                                                }`}
                                        >
                                            <div className="text-2xl mb-1">{cat.icon}</div>
                                            <div className="font-medium text-gray-900 dark:text-white text-xs leading-tight">
                                                {language === 'th' ? cat.name_th : cat.name_en}
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {/* Subcategory Selection */}
                                {categoryId > 0 && subcategories.length > 0 && (
                                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                                        {/* Selected Category Display */}
                                        <div className="mb-2 p-2 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                                            <p className="text-xs text-gray-600 dark:text-gray-400">
                                                {language === 'th' ? 'หมวดหมู่ที่เลือก:' : 'Selected Category:'}
                                            </p>
                                            <p className="text-sm font-bold text-purple-700 dark:text-purple-300">
                                                {selectedCategory?.icon} {language === 'th' ? selectedCategory?.name_th : selectedCategory?.name_en}
                                            </p>
                                        </div>

                                        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">
                                            {t.selectSubcategory}
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

                            {/* Sticky Navigation Buttons */}
                            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
                                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                                    <button
                                        onClick={() => setCurrentStep('upload')}
                                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        {t.back}
                                    </button>

                                    <button
                                        onClick={() => setCurrentStep('details')}
                                        disabled={categoryId === 0}
                                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {t.next}
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Spacer for fixed footer */}
                            <div className="h-20"></div>
                        </motion.div>
                    )}

                    {/* Step 3: Product Details - AI Enhanced */}
                    {currentStep === 'details' && (
                        <motion.div
                            key="details"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <h2 className="text-xl font-bold mb-4">{t.detailsTitle}</h2>

                                {/* Title */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">{t.productTitle}</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder={t.titlePlaceholder}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Price */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">{t.price}</label>
                                    <input
                                        type="number"
                                        value={price || ''}
                                        onChange={(e) => setPrice(Number(e.target.value))}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Description */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">{t.description}</label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder={t.descPlaceholder}
                                        rows={4}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Condition */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">{t.condition}</label>
                                    <select
                                        value={condition}
                                        onChange={(e) => setCondition(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-lg"
                                    >
                                        {Object.keys(t.conditions).map(key => (
                                            <option key={key} value={key}>
                                                {t.conditions[key as keyof typeof t.conditions]}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Location */}
                                <div className="mb-4">
                                    <label className="block text-sm font-medium mb-2">{t.location}</label>
                                    <AddressSelector
                                        onLocationChange={(loc) => {
                                            setProvince(loc.province)
                                            setAmphoe(loc.amphoe)
                                            setDistrict(loc.district)
                                            setZipcode(loc.zipcode)
                                        }}
                                    />
                                </div>

                                {/* Shipping */}
                                <div className="space-y-2">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={canShip}
                                            onChange={(e) => setCanShip(e.target.checked)}
                                            className="w-5 h-5 text-purple-600 rounded"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">{t.shippingYes}</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={canPickup}
                                            onChange={(e) => setCanPickup(e.target.checked)}
                                            className="w-5 h-5 text-purple-600 rounded"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300">{t.pickupYes}</span>
                                    </label>
                                </div>
                            </div>

                            {/* Sticky Navigation Buttons */}
                            <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
                                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                                    <button
                                        onClick={() => setCurrentStep('category')}
                                        className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                                    >
                                        <ChevronLeft className="w-5 h-5" />
                                        {t.back}
                                    </button>

                                    <button
                                        onClick={() => setCurrentStep('review')}
                                        disabled={!title || price <= 0}
                                        className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {t.next}
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Spacer for fixed footer */}
                            <div className="h-20"></div>
                        </motion.div>
                    )}

                    {/* Step 4: Review */}
                    {
                        currentStep === 'review' && (
                            <motion.div
                                key="review"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                    <div className="text-center mb-6">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 mb-3">
                                            <Eye className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                                            {t.reviewTitle}
                                        </h2>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {t.reviewSubtitle}
                                        </p>
                                    </div>

                                    {/* Review Content */}
                                    <div className="space-y-4">
                                        {/* Images */}
                                        <div>
                                            <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                                {language === 'th' ? 'รูปภาพ' : 'Images'} ({images.length})
                                            </h3>
                                            <div className="grid grid-cols-5 gap-2">
                                                {imagePreviews.map((preview, index) => (
                                                    <img
                                                        key={index}
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        className="w-full h-24 object-cover rounded-lg"
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Details */}
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {t.productTitle}
                                                </h3>
                                                <p className="text-gray-900 dark:text-white text-lg">{title}</p>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {t.price}
                                                </h3>
                                                <p className="text-purple-600 dark:text-purple-400 text-2xl font-bold">
                                                    ฿{price.toLocaleString()}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {language === 'th' ? 'หมวดหมู่' : 'Category'}
                                                </h3>
                                                <p className="text-gray-900 dark:text-white">
                                                    {selectedCategory?.icon} {language === 'th' ? selectedCategory?.name_th : selectedCategory?.name_en}
                                                </p>
                                            </div>

                                            <div>
                                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {t.condition}
                                                </h3>
                                                <p className="text-gray-900 dark:text-white">
                                                    {t.conditions[condition as keyof typeof t.conditions]}
                                                </p>
                                            </div>
                                        </div>

                                        {description && (
                                            <div>
                                                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {t.description}
                                                </h3>
                                                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                                    {description}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Sticky Navigation Buttons */}
                                <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-40">
                                    <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                                        <button
                                            onClick={() => setCurrentStep('details')}
                                            className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                            {t.back}
                                        </button>

                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-semibold text-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    {t.publishing}
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-6 h-6" />
                                                    {t.publish}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Spacer for fixed footer */}
                                <div className="h-20"></div>
                            </motion.div>
                        )
                    }
                </AnimatePresence >
            </main >
        </div >
    )
}

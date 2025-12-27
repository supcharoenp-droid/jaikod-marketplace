'use client'

import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
    Upload, X, Image as ImageIcon, ChevronRight,
    MapPin, Package, Sparkles, CheckCircle
} from 'lucide-react'
import AddressSelector from '@/components/ui/AddressSelector'
import CategorySelector from '@/components/listing/CategorySelector'
import { createProduct, CreateProductInput } from '@/lib/products'

export default function SimpleSellForm() {
    const router = useRouter()
    const { user } = useAuth()
    const [currentStep, setCurrentStep] = useState(1)
    const [language, setLanguage] = useState<'th' | 'en'>('th')

    // Form data
    const [images, setImages] = useState<File[]>([])
    const [imagePreviews, setImagePreviews] = useState<string[]>([])
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [price, setPrice] = useState<number>(0)
    const [categoryId, setCategoryId] = useState<number>(0)
    const [subcategoryId, setSubcategoryId] = useState<number | undefined>(undefined)
    const [condition, setCondition] = useState('good')
    const [province, setProvince] = useState('')
    const [amphoe, setAmphoe] = useState('')
    const [district, setDistrict] = useState('')
    const [zipcode, setZipcode] = useState('')
    const [canShip, setCanShip] = useState(true)
    const [canPickup, setCanPickup] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    const content = {
        th: {
            step1: 'ขั้นตอนที่ 1: อัพโหลดรูปภาพ',
            step2: 'ขั้นตอนที่ 2: กรอกรายละเอียดสินค้า',
            uploadTitle: 'อัพโหลดรูปภาพสินค้า',
            uploadSubtitle: 'เพิ่มรูปภาพสินค้าของคุณ (ไม่เกิน 10 รูป)',
            uploadButton: 'เลือกรูปภาพ',
            orDragDrop: 'หรือลากไฟล์มาวางที่นี่',
            maxImages: 'สูงสุด 10 รูป',
            tips: 'เคล็ดลับในการถ่ายรูปที่ดี:',
            tip1: '📸 ถ่ายรูปในที่แสงสว่างเพียงพอ',
            tip2: '🎯 เน้นที่ตัวสินค้าให้ชัดเจน ไม่มีสิ่งรบกวน',
            tip3: '📐 ถ่ายหลายมุม เพื่อให้ผู้ซื้อเห็นรายละเอียด',
            tip4: '✨ หากมีตำหนิ ควรถ่ายให้เห็นชัดเจน',
            next: 'ถัดไป',
            back: 'ย้อนกลับ',
            productTitle: 'ชื่อสินค้า',
            titlePlaceholder: 'เช่น TV Samsung 55 นิ้ว, เสื้อยืด Uniqlo, iPhone 15',
            price: 'ราคา (บาท)',
            pricePlaceholder: '0',
            description: 'รายละเอียดสินค้า',
            descPlaceholder: 'อธิบายสินค้าของคุณ...\n\n💡 แนะนำ:\n- ระบุสภาพอย่างละเอียด\n- บอกสาเหตุที่ขาย\n- แจ้งอุปกรณ์ที่แถมมา',
            condition: 'สภาพสินค้า',
            conditionNew: 'ใหม่',
            conditionLikeNew: 'เหมือนใหม่',
            conditionGood: 'ดี',
            conditionFair: 'พอใช้',
            conditionPoor: 'มีตำหนิ',
            location: 'ที่อยู่สินค้า',
            shipping: 'การจัดส่ง',
            shippingYes: 'รับจัดส่ง',
            pickupYes: 'รับหน้าร้าน',
            publish: 'เผยแพร่ประกาศ',
            publishing: 'กำลังเผยแพร่...',
            pleaseLogin: 'กรุณาเข้าสู่ระบบก่อน',
            fillRequired: 'กรุณากรอกข้อมูลให้ครบถ้วน (ชื่อ, หมวดหมู่, ราคา)',
            success: '✅ ลงประกาศสินค้าสำเร็จ!',
            error: '❌ เกิดข้อผิดพลาด กรุณาลองใหม่'
        },
        en: {
            step1: 'Step 1: Upload Photos',
            step2: 'Step 2: Product Details',
            uploadTitle: 'Upload Product Photos',
            uploadSubtitle: 'Add photos of your product (max 10 photos)',
            uploadButton: 'Choose Photos',
            orDragDrop: 'or drag and drop files here',
            maxImages: 'Max 10 photos',
            tips: 'Photo Tips:',
            tip1: '📸 Take photos in good lighting',
            tip2: '🎯 Focus on the product, avoid distractions',
            tip3: '📐 Take multiple angles',
            tip4: '✨ Show any defects clearly',
            next: 'Next',
            back: 'Back',
            productTitle: 'Product Title',
            titlePlaceholder: 'e.g. Samsung TV 55", Uniqlo Shirt, iPhone 15',
            price: 'Price (THB)',
            pricePlaceholder: '0',
            description: 'Description',
            descPlaceholder: 'Describe your product...\n\n💡 Tips:\n- Specify condition in detail\n- Mention reason for selling\n- List included accessories',
            condition: 'Condition',
            conditionNew: 'New',
            conditionLikeNew: 'Like New',
            conditionGood: 'Good',
            conditionFair: 'Fair',
            conditionPoor: 'Poor',
            location: 'Location',
            shipping: 'Shipping',
            shippingYes: 'Shipping Available',
            pickupYes: 'Pickup Available',
            publish: 'Publish Listing',
            publishing: 'Publishing...',
            pleaseLogin: 'Please login first',
            fillRequired: 'Please fill required fields (title, category, price)',
            success: '✅ Product listed successfully!',
            error: '❌ Error publishing. Please try again'
        }
    }

    const t = content[language]

    // Handle image upload
    const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
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
    }, [images.length, language])

    // Remove image
    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
        setImagePreviews(prev => prev.filter((_, i) => i !== index))
    }

    // Handle drag and drop
    const handleDrop = useCallback((e: React.DragEvent) => {
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
    }, [images.length, language])

    // Handle submit
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            {/* Header */}
            <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {language === 'th' ? 'ลงขายสินค้า' : 'Sell Product'}
                                </h1>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {currentStep === 1 ? t.step1 : t.step2}
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

                    {/* Progress */}
                    <div className="mt-4 flex items-center gap-2">
                        <div className={`flex-1 h-2 rounded-full ${currentStep >= 1 ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                        <div className={`flex-1 h-2 rounded-full ${currentStep >= 2 ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-700'}`} />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 py-8">
                <AnimatePresence mode="wait">
                    {/* Step 1: Upload Images */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 dark:bg-purple-900/30 mb-4">
                                        <ImageIcon className="w-8 h-8 text-purple-600" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {t.uploadTitle}
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {t.uploadSubtitle}
                                    </p>
                                </div>

                                {/* Upload Area */}
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-12 text-center hover:border-purple-500 transition-colors cursor-pointer"
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
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <button
                                            type="button"
                                            onClick={() => document.getElementById('image-upload')?.click()}
                                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                                        >
                                            {t.uploadButton}
                                        </button>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                            {t.orDragDrop}
                                        </p>
                                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                            {t.maxImages}
                                        </p>
                                    </label>
                                </div>

                                {/* Image Previews */}
                                {imagePreviews.length > 0 && (
                                    <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg"
                                                />
                                                <button
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                                {index === 0 && (
                                                    <div className="absolute bottom-2 left-2 px-2 py-1 bg-purple-600 text-white text-xs rounded-md font-medium">
                                                        {language === 'th' ? 'รูปหลัก' : 'Main'}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Tips */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                                <h3 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    {t.tips}
                                </h3>
                                <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                                    <li>{t.tip1}</li>
                                    <li>{t.tip2}</li>
                                    <li>{t.tip3}</li>
                                    <li>{t.tip4}</li>
                                </ul>
                            </div>

                            {/* Next Button */}
                            <div className="flex justify-end">
                                <button
                                    onClick={() => setCurrentStep(2)}
                                    disabled={images.length === 0}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {t.next}
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Product Details */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm space-y-6">
                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {t.productTitle} *
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder={t.titlePlaceholder}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                {/* Category */}
                                <CategorySelector
                                    selectedCategoryId={categoryId}
                                    selectedSubcategoryId={subcategoryId}
                                    language={language}
                                    onCategoryChange={(catId, subId) => {
                                        setCategoryId(catId)
                                        setSubcategoryId(subId)
                                    }}
                                />

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {t.price} *
                                    </label>
                                    <input
                                        type="number"
                                        value={price || ''}
                                        onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                                        placeholder={t.pricePlaceholder}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xl font-bold"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {t.description}
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder={t.descPlaceholder}
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                                    />
                                </div>

                                {/* Condition */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {t.condition}
                                    </label>
                                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                                        {[
                                            { value: 'new', label: t.conditionNew },
                                            { value: 'like_new', label: t.conditionLikeNew },
                                            { value: 'good', label: t.conditionGood },
                                            { value: 'fair', label: t.conditionFair },
                                            { value: 'poor', label: t.conditionPoor }
                                        ].map(({ value, label }) => (
                                            <button
                                                key={value}
                                                onClick={() => setCondition(value)}
                                                className={`p-3 rounded-xl border-2 font-medium transition-all ${condition === value
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
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {t.location}
                                    </label>
                                    <AddressSelector
                                        selectedProvince={province}
                                        selectedAmphoe={amphoe}
                                        selectedDistrict={district}
                                        selectedZipcode={zipcode}
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
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {t.shipping}
                                    </label>
                                    <div className="flex gap-4">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={canShip}
                                                onChange={(e) => setCanShip(e.target.checked)}
                                                className="w-5 h-5 text-purple-600 rounded"
                                            />
                                            <span className="text-gray-700 dark:text-gray-300">{t.shippingYes}</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
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
                            </div>

                            {/* Buttons */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                >
                                    {t.back}
                                </button>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !title || !categoryId || price <= 0}
                                    className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            {t.publishing}
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5" />
                                            {t.publish}
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    )
}

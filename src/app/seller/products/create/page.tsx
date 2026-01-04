'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import {
    Upload, X, Camera, CheckCircle, AlertCircle, Loader2,
    Sparkles, Tag, Truck, Box, DollarSign, FileText, Brain
} from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import AddressSelector from '@/components/ui/AddressSelector'
import ImageUploadGrid from '@/components/product/ImageUploadGrid'
import ModerationStatus from '@/components/product/ModerationStatus'
import { CATEGORIES, PRODUCT_CONDITIONS } from '@/constants/categories'
import { createProduct, CreateProductInput, getProductById, updateProduct } from '@/lib/products'
import { getSellerProfile } from '@/lib/seller'
import { useAuth } from '@/contexts/AuthContext'
import { moderateContent } from '@/lib/content-moderation'
import type { ModerationResult } from '@/types/moderation'
import type { MarketPriceAnalysis } from '@/lib/ai-price-estimator'

// Loading fallback component
function LoadingFallback() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-bg-dark">
            <div className="text-center">
                <Loader2 className="w-10 h-10 animate-spin text-neon-purple mx-auto mb-4" />
                <p className="text-gray-500">กำลังโหลด...</p>
            </div>
        </div>
    )
}

function CreateProductPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { user, loading: authLoading } = useAuth()
    const editId = searchParams.get('edit')

    // State
    const [isLoading, setIsLoading] = useState(false)
    const [isLoadingProduct, setIsLoadingProduct] = useState(!!editId)
    const [isAiLoading, setIsAiLoading] = useState(false)
    const [isCategoryLoading, setIsCategoryLoading] = useState(false)
    const [priceAnalysis, setPriceAnalysis] = useState<MarketPriceAnalysis | null>(null)
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [images, setImages] = useState<string[]>([])
    const [tags, setTags] = useState<string[]>([])
    const [tagInput, setTagInput] = useState('')
    const [moderationResult, setModerationResult] = useState<ModerationResult | undefined>()
    const [showModeration, setShowModeration] = useState(false)
    const [currentStep, setCurrentStep] = useState<'form' | 'moderation' | 'success'>('form')

    const [formData, setFormData] = useState<Partial<CreateProductInput>>({
        title: '',
        description: '',
        category_id: '',
        price: 0,
        original_price: undefined,
        price_type: 'fixed',
        condition: 'good',
        usage_detail: '',
        stock: 1,
        province: '',
        amphoe: '',
        district: '',
        zipcode: '',
        can_ship: true,
        can_pickup: false,
        shipping_fee: 0,
        shipping_options: []
    })

    // Subcategory Logic
    const [selectedMainCategory, setSelectedMainCategory] = useState<string>('')
    const [availableSubcategories, setAvailableSubcategories] = useState<any[]>([])

    // Update available subcategories when main category changes
    useEffect(() => {
        if (selectedMainCategory) {
            const mainCat = CATEGORIES.find(c => c.id.toString() === selectedMainCategory)
            if (mainCat && mainCat.subcategories) {
                setAvailableSubcategories(mainCat.subcategories)
            } else {
                setAvailableSubcategories([])
            }
        } else {
            setAvailableSubcategories([])
        }
    }, [selectedMainCategory])

    // Check Auth
    useEffect(() => {
        if (!isLoading && !user) {
            router.push('/login?redirect=/seller/products/create')
        }
    }, [user, isLoading, router])

    // Check Seller Profile
    useEffect(() => {
        const checkSeller = async () => {
            if (user) {
                const profile = await getSellerProfile(user.uid)
                if (!profile) {
                    // Redirect to registration if not a seller
                    // router.push('/seller/register') 
                    // Optional: For now we allow even if not fully registered, 
                    // but practically the dashboard redirects them.
                } else {
                    // Pre-fill address from seller profile if available
                    // Profile may have address stored - handle as any since type may vary
                    const profileAny = profile as any
                    if (profileAny.address) {
                        // Address exists - could pre-fill form
                    }
                }
            }
        }
        checkSeller()
    }, [user])

    // Load product data when editing
    useEffect(() => {
        const loadProduct = async () => {
            if (authLoading) return // Wait for auth to load

            if (!editId) {
                setIsLoadingProduct(false)
                return
            }

            if (!user) {
                // If auth loaded but no user, let the auth check effect handle redirect, just stop here
                setIsLoadingProduct(false)
                return
            }

            try {
                console.log('[CreateProduct] Loading product for edit:', editId)
                setIsLoadingProduct(true)
                const product = await getProductById(editId)

                if (!product) {
                    console.error('[CreateProduct] Product not found:', editId)
                    setErrorMessage('ไม่พบสินค้าที่ต้องการแก้ไข')
                    setIsLoadingProduct(false)
                    return
                }

                // Check if user owns this product
                if (product.seller_id !== user.uid) {
                    console.error('[CreateProduct] User does not own this product')
                    setErrorMessage('คุณไม่มีสิทธิ์แก้ไขสินค้านี้')
                    setIsLoadingProduct(false)
                    return
                }

                console.log('[CreateProduct] Product loaded:', product)

                // Populate form with product data
                setFormData({
                    title: product.title,
                    description: product.description,
                    category_id: String(product.category_id),
                    price: product.price,
                    original_price: product.original_price,
                    price_type: product.price_type || 'fixed',
                    condition: product.condition,
                    usage_detail: product.usage_detail,
                    stock: product.stock || 1,
                    province: product.location_province || '',
                    amphoe: product.location_amphoe || '',
                    district: product.location_district || '',
                    zipcode: product.location_zipcode || '',
                    can_ship: product.can_ship,
                    can_pickup: product.can_pickup,
                    shipping_fee: (product as any).shipping_fee,
                    shipping_options: (product as any).shipping_options || []
                })

                // Set images
                if (product.images && product.images.length > 0) {
                    const imageUrls = product.images.map(img =>
                        typeof img === 'string' ? img : img.url
                    )
                    setImages(imageUrls)
                }

                // Set tags
                if (product.tags && product.tags.length > 0) {
                    setTags(product.tags)
                }

                setIsLoadingProduct(false)
            } catch (error) {
                console.error('[CreateProduct] Error loading product:', error)
                setErrorMessage('เกิดข้อผิดพลาดในการโหลดข้อมูลสินค้า')
                setIsLoadingProduct(false)
            }
        }

        loadProduct()
        loadProduct()
    }, [editId, user, authLoading])

    // Handlers (Image handling now in ImageUploadGrid component)

    const handleTagAdd = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && tagInput.trim()) {
            e.preventDefault()
            if (!tags.includes(tagInput.trim())) {
                setTags([...tags, tagInput.trim()])
            }
            setTagInput('')
        }
    }

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(tag => tag !== tagToRemove))
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            setFormData(prev => ({ ...prev, [name]: checked }))
        } else if (type === 'number') {
            setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleAddressChange = (addr: any) => {
        setFormData(prev => ({
            ...prev,
            province: addr.province,
            amphoe: addr.amphoe,
            district: addr.district,
            zipcode: addr.zipcode
        }))
    }

    // AI Features (Mock)
    // Helper to extract attributes from tags and form data
    const getAttributesFromData = () => {
        const title = formData.title || '';
        const lowerTitle = title.toLowerCase();

        const attributes: Record<string, any> = {
            brand: title.split(' ')[0], // Simple heuristic
            model: title.split(' ').slice(1).join(' '),
            condition: formData.condition === 'new' ? 'สินค้าใหม่' : 'สินค้ามือสอง',
        }

        // --- INTELLIGENT PARSING ---

        // Mobile/Computer Specs
        const ramMatch = lowerTitle.match(/(?:ram\s?|^|\s)(\d{1,3})\s?(gb|g)(?:\s|$)/) || lowerTitle.match(/ram\s?(\d{1,3})/);
        if (ramMatch) attributes.ram = ramMatch[1] + 'GB';

        const storageMatch = lowerTitle.match(/(\d{3})\s?(gb)|(\d)\s?(tb)/);
        if (storageMatch) attributes.storage = storageMatch[0].toUpperCase();
        else if (lowerTitle.includes('ssd')) attributes.storage = 'SSD';

        if (lowerTitle.includes('i3')) attributes.processor = 'Core i3';
        if (lowerTitle.includes('i5')) attributes.processor = 'Core i5';
        if (lowerTitle.includes('i7')) attributes.processor = 'Core i7';
        if (lowerTitle.includes('i9')) attributes.processor = 'Core i9';
        if (lowerTitle.includes('ryzen')) attributes.processor = 'AMD Ryzen';
        if (lowerTitle.match(/m[1-3]( pro| max| ultra)?/)) attributes.processor = lowerTitle.match(/m[1-3](?: pro| max| ultra)?/)![0].toUpperCase();

        // Size/Dimensions (Fashion/Home)
        const sizeMatch = lowerTitle.match(/(?:size|ไซส์|ขนาด)[:\s]?\s?([xs|s|m|l|xl|xxl|\d]+)/);
        if (sizeMatch) attributes.size = sizeMatch[1].toUpperCase();

        // Volume (Beauty)
        const volMatch = lowerTitle.match(/(\d+)\s?(ml|g|oz)/);
        if (volMatch) attributes.volume = volMatch[0];

        // Automotive 🚗
        const yearMatch = lowerTitle.match(/(?:year|ปี)\s?(\d{4})/) || lowerTitle.match(/20\d{2}/);
        if (yearMatch) attributes.year = yearMatch[0].replace(/\D/g, '');

        if (lowerTitle.includes('auto') || lowerTitle.includes('ออโต้')) attributes.gear = 'Auto';
        if (lowerTitle.includes('manual') || lowerTitle.includes('ธรรมดา')) attributes.gear = 'Manual';

        const mileageMatch = lowerTitle.match(/(\d{1,3}(?:,\d{3})*)\s?(?:km|กม|ไมล์)/);
        if (mileageMatch) attributes.mileage = mileageMatch[1].replace(/,/g, '');

        const engineMatch = lowerTitle.match(/(\d\.\d)\s?(?:l|ลิตร)/) || lowerTitle.match(/(\d{3,4})\s?cc/);
        if (engineMatch) attributes.engine = engineMatch[0];

        // Amulets 🙏
        if (lowerTitle.includes('วัด')) {
            const templeMatch = title.match(/วัด[\u0E00-\u0E7F]+/);
            if (templeMatch) attributes.temple = templeMatch[0];
        }
        if (lowerTitle.includes('หลวงพ่อ') || lowerTitle.includes('หลวงปู่')) {
            const monkMatch = title.match(/(?:หลวงพ่อ|หลวงปู่|พระอาจารย์)[\u0E00-\u0E7F]+/);
            if (monkMatch) attributes.monk = monkMatch[0];
        }

        // Watches ⌚
        const caseSizeMatch = lowerTitle.match(/(\d{2})\s?mm/);
        if (caseSizeMatch) attributes.case_size = caseSizeMatch[1];

        if (lowerTitle.includes('rolex') || lowerTitle.includes('patek') || lowerTitle.includes('omega')) {
            attributes.authentic_guarantee = 'รับประกันแท้';
        }

        return attributes;
    }

    const generateAiDescription = async () => {
        if (!formData.title || !formData.category_id) {
            setErrorMessage('กรุณาระบุหมวดหมู่และชื่อสินค้าก่อนใช้ AI')
            return
        }
        setIsAiLoading(true)
        try {
            const { generateProductDescription } = await import('@/lib/ai-description-generator')

            const attributes = getAttributesFromData()
            // Additional context from form
            attributes.price = formData.price;
            attributes.province = formData.province;

            // Use correct input type - generateProductDescription returns a string
            const result = await generateProductDescription({
                title: formData.title || '',
                category: formData.category_id,
                description: formData.description,
                condition: formData.condition,
                price: formData.price,
                keywords: tags
            })

            // result is a string, use it as description
            setFormData(prev => ({
                ...prev,
                description: result || prev.description,
            }))

        } catch (error) {
            console.error("AI Generation Error:", error)
            setErrorMessage('ไม่สามารถสร้างคำบรรยายได้: ' + (error instanceof Error ? error.message : 'Unknown error'))
        } finally {
            setIsAiLoading(false)
        }
    }

    const suggestAiPrice = async () => {
        if (!formData.title || !formData.category_id) {
            setErrorMessage('กรุณาระบุหมวดหมู่และชื่อสินค้าก่อนใช้ AI')
            return
        }
        setIsAiLoading(true)
        setPriceAnalysis(null)
        try {
            const { estimatePrice } = await import('@/lib/ai-price-estimator')

            const attributes = getAttributesFromData()

            const result = await estimatePrice({
                categoryId: formData.category_id,
                attributes: attributes,
                originalPrice: (formData.price || 0) > 0 ? formData.price : undefined
            })

            if (result && result.market_price) {
                setPriceAnalysis(result)
            }
        } catch (error) {
            console.error('AI Price Suggestion Error:', error)
            setErrorMessage('ไม่สามารถประเมินราคาได้')
        } finally {
            setIsAiLoading(false)
        }
    }

    const handleSuggestCategory = async () => {
        if (!formData.title) {
            setErrorMessage('กรุณากรอกชื่อสินค้าก่อนให้ AI ช่วยเลือกหมวดหมู่')
            return
        }
        setIsCategoryLoading(true)
        try {
            const res = await fetch('/api/ai/suggest-category', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: formData.title,
                    current_category_id: formData.category_id
                })
            })
            const data = await res.json()

            // New Pro Response Structure handling
            if (data.primary && data.primary.category_id) {
                const { category_id, category_name_th, confidence } = data.primary;
                const reason = data.short_reason;
                const catIdStr = String(category_id);

                if (confidence >= 0.6) {
                    setFormData(prev => ({ ...prev, category_id: catIdStr }))
                    setSelectedMainCategory(catIdStr)
                    const confPercent = Math.round(confidence * 100);
                    setSuccessMessage(`AI แนะนำ (${confPercent}%): ${category_name_th} - ${reason}`)
                } else {
                    setErrorMessage(`AI ไม่แน่ใจ: ${reason}`)
                }

                setTimeout(() => setSuccessMessage(''), 5000)
            } else {
                setErrorMessage('AI ไม่สามารถระบุหมวดหมู่ได้')
            }
        } catch (error) {
            console.error('Category Suggestion Error:', error)
        } finally {
            setIsCategoryLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrorMessage('')
        setSuccessMessage('')
        setIsLoading(true)

        try {
            if (!user) throw new Error('กรุณาเข้าสู่ระบบ')
            if (!formData.title?.trim()) throw new Error('กรุณาระบุชื่อสินค้า')
            // if (!formData.category_id) throw new Error('กรุณาระบุหมวดหมู่')
            // if (formData.price === undefined || formData.price < 0) throw new Error('กรุณาระบุราคาที่ถูกต้อง')
            // if (!formData.province) throw new Error('กรุณาระบุจังหวัด')

            const input: CreateProductInput = {
                title: formData.title!,
                description: formData.description || '',
                category_id: formData.category_id || '1',
                price: Number(formData.price) || 0,
                original_price: formData.original_price,
                price_type: formData.price_type || 'fixed',
                condition: formData.condition || 'good',
                usage_detail: formData.usage_detail,
                tags: tags,
                images: images, // bypassed
                stock: Number(formData.stock) || 1,
                province: formData.province || 'กรุงเทพมหานคร',
                amphoe: formData.amphoe || '',
                district: formData.district || '',
                zipcode: formData.zipcode || '',
                can_ship: formData.can_ship || false,
                can_pickup: formData.can_pickup || false,
                shipping_fee: formData.shipping_fee || 0
            }

            if (editId) {
                await updateProduct(editId, input)
                setSuccessMessage('บันทึกการแก้ไขเรียบร้อยแล้ว')
            } else {
                const newId = await createProduct(
                    input,
                    user.uid,
                    user.displayName || 'Unknown Seller',
                    user.photoURL || ''
                )
                setSuccessMessage('ลงขายสินค้าเรียบร้อยแล้ว')
                router.push(`/product/${newId}`)
            }

        } catch (error) {
            console.error('Submit error:', error)
            setErrorMessage(error instanceof Error ? error.message : 'เกิดข้อผิดพลาด')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg-dark flex flex-col">
            <Header />
            <main className="flex-1 py-10 container mx-auto px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Upload className="w-6 h-6 text-neon-purple" />
                            {editId ? 'แก้ไขสินค้า' : 'ลงขายสินค้าใหม่'}
                        </h1>
                    </div>

                    {successMessage && (
                        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 rounded-xl flex items-center gap-2 font-medium">
                            <CheckCircle className="w-5 h-5" /> {successMessage}
                        </div>
                    )}

                    {
                        errorMessage && (
                            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2 font-medium">
                                <AlertCircle className="w-5 h-5" /> {errorMessage}
                            </div>
                        )
                    }

                    {/* Show Moderation Status */}
                    {
                        currentStep === 'moderation' && moderationResult && (
                            <div className="mb-6">
                                <ModerationStatus
                                    productId="temp"
                                    moderationResult={moderationResult}
                                    onResubmit={() => {
                                        setCurrentStep('form')
                                        setShowModeration(false)
                                    }}
                                />
                            </div>
                        )
                    }

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* 1. Images */}
                        <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-gray-400" />
                                รูปภาพสินค้า <span className="text-red-500">*</span>
                            </h2>
                            <ImageUploadGrid
                                images={images}
                                onImagesChange={setImages}
                                maxImages={10}
                            />
                        </div>

                        {/* 2. Basic Info & AI */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-bold mb-4">ข้อมูลทั่วไป</h2>
                                    <div className="space-y-4">
                                        <Input
                                            label="ชื่อสินค้า *"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleChange}
                                            placeholder="เช่น iPhone 15 Pro Max 256GB"
                                            required
                                        />

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium mb-1 flex justify-between items-center">
                                                    <span>หมวดหมู่หลัก <span className="text-red-500">*</span></span>
                                                    <button
                                                        type="button"
                                                        onClick={handleSuggestCategory}
                                                        disabled={isCategoryLoading || !formData.title}
                                                        className="text-xs text-neon-purple hover:text-purple-600 flex items-center gap-1 disabled:opacity-50 transition-colors"
                                                    >
                                                        {isCategoryLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                                                        AI เลือกหมวด
                                                    </button>
                                                </label>
                                                <select
                                                    value={selectedMainCategory}
                                                    onChange={(e) => {
                                                        const val = e.target.value
                                                        setSelectedMainCategory(val)
                                                        // If no subcategories, set ID immediately. If has sub, wait for sub selection (or set to main first)
                                                        setFormData(prev => ({ ...prev, category_id: val }))
                                                    }}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple"
                                                    required
                                                >
                                                    <option value="">เลือกหมวดหมู่</option>
                                                    {CATEGORIES.map(c => (
                                                        <option key={c.id} value={c.id}>{c.name_th}</option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Subcategory Dropdown (Conditional) */}
                                            {availableSubcategories.length > 0 && (
                                                <div>
                                                    <label className="block text-sm font-medium mb-1">หมวดหมู่อย่อย *</label>
                                                    <select
                                                        name="category_id"
                                                        value={formData.category_id}
                                                        onChange={handleChange}
                                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple"
                                                        required
                                                    >
                                                        <option value={selectedMainCategory}>ทั้งหมดในหมวดนี้</option>
                                                        {availableSubcategories.map(sub => (
                                                            <option key={sub.id} value={sub.id}>{sub.name_th}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            )}

                                            <div>
                                                <label className="block text-sm font-medium mb-1">สภาพสินค้า *</label>
                                                <select
                                                    name="condition"
                                                    value={formData.condition}
                                                    onChange={handleChange}
                                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple"
                                                >
                                                    {PRODUCT_CONDITIONS.map(c => (
                                                        <option key={c.value} value={c.value}>{c.label}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium mb-1">รายละเอียดสินค้า *</label>
                                            <div className="absolute top-0 right-0">
                                                <button
                                                    type="button"
                                                    onClick={generateAiDescription}
                                                    disabled={isAiLoading}
                                                    className="text-xs flex items-center text-neon-purple hover:text-purple-600 transition-colors"
                                                >
                                                    <Sparkles className="w-3 h-3 mr-1" />
                                                    {isAiLoading ? 'กำลังสร้าง...' : 'ใช้ AI เขียนคำบรรยาย'}
                                                </button>
                                            </div>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={6}
                                                className="w-full p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple resize-none"
                                                placeholder="รายละเอียดสินค้า..."
                                                required
                                            />
                                        </div>

                                        <div className="relative">
                                            <label className="block text-sm font-medium mb-1">รายละเอียดการใช้งาน (ตำหนิ/ประวัติ)</label>
                                            <textarea
                                                name="usage_detail"
                                                value={formData.usage_detail}
                                                onChange={handleChange}
                                                rows={2}
                                                className="w-full p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:border-neon-purple resize-none"
                                                placeholder="เช่น เคยเปลี่ยนแบตเตอรี่มา, มีรอยขนแมวเล็กน้อย..."
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                                                <Tag className="w-4 h-4" /> แฮชแท็ก
                                                <span className="text-gray-400 font-normal text-xs ml-2">(กด Enter เพื่อเพิ่ม)</span>
                                            </label>
                                            <div className="flex flex-wrap gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 focus-within:border-neon-purple transition-colors">
                                                {tags.map((tag, idx) => (
                                                    <span key={idx} className="bg-white dark:bg-gray-700 px-2 py-1 rounded text-sm flex items-center gap-1 shadow-sm">
                                                        #{tag}
                                                        <button type="button" onClick={() => removeTag(tag)} className="text-gray-400 hover:text-red-500"><X className="w-3 h-3" /></button>
                                                    </span>
                                                ))}
                                                <input
                                                    type="text"
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyDown={handleTagAdd}
                                                    className="bg-transparent focus:outline-none flex-1 min-w-[100px] text-sm"
                                                    placeholder={tags.length === 0 ? "เพิ่มแฮชแท็ก..." : ""}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Price - SIMPLIFIED: AI price estimation disabled */}
                                <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-bold mb-4 flex items-center justify-between">
                                        <span>💰 ราคา</span>
                                    </h2>
                                    <div className="space-y-4">
                                        <div className="flex rounded-lg bg-gray-100 p-1 mb-4">
                                            {(['fixed', 'negotiable', 'auction'] as const).map(type => (
                                                <button
                                                    key={type}
                                                    type="button"
                                                    onClick={() => setFormData(prev => ({ ...prev, price_type: type }))}
                                                    className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${formData.price_type === type
                                                        ? 'bg-white text-neon-purple shadow-sm'
                                                        : 'text-gray-500 hover:text-gray-700'
                                                        }`}
                                                >
                                                    {type === 'fixed' ? 'ราคาคงที่' : type === 'negotiable' ? 'ต่อรองได้' : 'ประมูล'}
                                                </button>
                                            ))}
                                        </div>

                                        {/* DISABLED: Price Analysis Panel removed to save AI tokens */}

                                        <div className="relative">
                                            <span className="absolute left-3 top-2.5 text-gray-400 font-bold text-lg">฿</span>
                                            <input
                                                type="number"
                                                name="price"
                                                value={formData.price || ''}
                                                onChange={handleChange}
                                                min="0"
                                                step="1"
                                                className="w-full pl-10 pr-16 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-neon-purple font-bold text-lg"
                                                placeholder="0"
                                                required
                                            />
                                            <span className="absolute right-3 top-2.5 text-gray-500 text-sm">บาท</span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">ราคาเต็ม (ถ้ามี)</label>
                                                <input
                                                    type="number"
                                                    name="original_price"
                                                    value={formData.original_price || ''}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-neon-purple text-sm"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs text-gray-500 mb-1 block">คลังสินค้า</label>
                                                <input
                                                    type="number"
                                                    name="stock"
                                                    value={formData.stock}
                                                    onChange={handleChange}
                                                    className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-neon-purple text-sm"
                                                    min="1"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping */}
                                <div className="bg-white dark:bg-surface-dark rounded-xl p-6 shadow-sm">
                                    <h2 className="text-lg font-bold mb-4">การจัดส่ง</h2>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">ตำแหน่งสินค้า</label>
                                            <AddressSelector
                                                initialValues={{
                                                    province: formData.province || '',
                                                    amphoe: formData.amphoe || '',
                                                    district: formData.district || '',
                                                    zipcode: formData.zipcode || ''
                                                }}
                                                onAddressChange={handleAddressChange}
                                            />
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-neon-purple transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <Truck className="w-5 h-5 text-gray-500" />
                                                    <span className="text-sm">จัดส่งพัสดุ</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    name="can_ship"
                                                    checked={formData.can_ship}
                                                    onChange={handleChange}
                                                    className="w-5 h-5 rounded text-neon-purple focus:ring-neon-purple"
                                                />
                                            </label>

                                            {formData.can_ship && (
                                                <div className="pl-4">
                                                    <label className="text-xs text-gray-500 mb-1 block">ค่าจัดส่ง (บาท)</label>
                                                    <input
                                                        type="number"
                                                        name="shipping_fee"
                                                        value={formData.shipping_fee}
                                                        onChange={handleChange}
                                                        className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-neon-purple text-sm"
                                                        placeholder="0 = ส่งฟรี"
                                                    />
                                                </div>
                                            )}

                                            <label className="flex items-center justify-between p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-neon-purple transition-colors">
                                                <div className="flex items-center gap-2">
                                                    <Box className="w-5 h-5 text-gray-500" />
                                                    <span className="text-sm">นัดรับสินค้า</span>
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    name="can_pickup"
                                                    checked={formData.can_pickup}
                                                    onChange={handleChange}
                                                    className="w-5 h-5 rounded text-neon-purple focus:ring-neon-purple"
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-800">
                            <Button variant="outline" type="button" onClick={() => router.back()}>
                                ยกเลิก
                            </Button>
                            <Button
                                variant="primary"
                                type="submit"
                                isLoading={isLoading}
                                className="min-w-[150px]"
                            >
                                {editId ? 'บันทึกการแก้ไข' : 'ลงขายสินค้า'}
                            </Button>
                        </div>
                    </form>
                </div >
            </main >
            <Footer />
        </div >
    )
}

// Export with Suspense wrapper to fix useSearchParams() CSR bailout
export default function CreateProductPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <CreateProductPageContent />
        </Suspense>
    )
}

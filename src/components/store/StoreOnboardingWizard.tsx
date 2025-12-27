'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X, Store, Camera, Upload, CheckCircle, AlertCircle,
    Loader2, Sparkles, ChevronRight, ChevronLeft, Image as ImageIcon,
    Palette, Tag, MapPin, Phone, Globe, Zap
} from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRouter } from 'next/navigation'

// ==========================================
// TYPES
// ==========================================

interface StoreOnboardingWizardProps {
    isOpen: boolean
    onClose: () => void
    onComplete: (storeData: StoreData) => void
}

interface StoreData {
    name: string
    slug: string
    description: string
    category: string
    logo: string | null
    cover: string | null
    phone: string
    location: {
        province: string
        amphoe: string
    }
}

type Step = 'intro' | 'basic' | 'media' | 'details' | 'review' | 'success'

// ==========================================
// DEMO MODE
// ==========================================

const DEMO_MODE = true

// ==========================================
// DATA
// ==========================================

const STORE_CATEGORIES = [
    { id: 'electronics', name: 'อิเล็กทรอนิกส์', icon: '📱' },
    { id: 'fashion', name: 'แฟชั่น', icon: '👗' },
    { id: 'home', name: 'บ้านและสวน', icon: '🏠' },
    { id: 'beauty', name: 'ความงาม', icon: '💄' },
    { id: 'sports', name: 'กีฬา', icon: '⚽' },
    { id: 'automotive', name: 'ยานยนต์', icon: '🚗' },
    { id: 'food', name: 'อาหารและเครื่องดื่ม', icon: '🍜' },
    { id: 'others', name: 'อื่นๆ', icon: '📦' },
]

const PROVINCES = [
    'กรุงเทพมหานคร', 'นนทบุรี', 'ปทุมธานี', 'สมุทรปราการ', 'สมุทรสาคร',
    'เชียงใหม่', 'เชียงราย', 'ขอนแก่น', 'นครราชสีมา', 'ภูเก็ต',
    'ชลบุรี', 'ระยอง', 'พระนครศรีอยุธยา'
]

// ==========================================
// COMPONENT
// ==========================================

export default function StoreOnboardingWizard({
    isOpen,
    onClose,
    onComplete
}: StoreOnboardingWizardProps) {
    const { language } = useLanguage()
    const router = useRouter()

    // State
    const [step, setStep] = useState<Step>('intro')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Form data
    const [storeData, setStoreData] = useState<StoreData>({
        name: '',
        slug: '',
        description: '',
        category: '',
        logo: null,
        cover: null,
        phone: '',
        location: {
            province: '',
            amphoe: ''
        }
    })

    // Copy
    const t = {
        th: {
            title: 'เปิดร้านค้า',
            steps: {
                intro: {
                    title: 'เปิดร้านค้าของคุณ 🏪',
                    subtitle: 'สร้างร้านค้าออนไลน์ในไม่กี่นาที',
                    features: [
                        '🎨 หน้าร้านสวยงาม ปรับแต่งได้',
                        '📊 Dashboard วิเคราะห์ยอดขาย',
                        '🎁 สร้างคูปองและโปรโมชั่น',
                        '🤖 AI ช่วยจัดการร้าน'
                    ],
                    requirements: [
                        'ยืนยันเบอร์โทรแล้ว',
                        'ยืนยัน KYC แล้ว (สำหรับ General Store)',
                        'เพิ่มบัญชีธนาคาร'
                    ],
                    start: 'เริ่มต้นเลย'
                },
                basic: {
                    title: 'ข้อมูลพื้นฐาน',
                    storeName: 'ชื่อร้านค้า',
                    storeNamePlaceholder: 'เช่น ร้านสมชายอิเล็กทรอนิกส์',
                    storeSlug: 'URL ร้านค้า',
                    storeSlugPrefix: 'jaikod.com/store/',
                    category: 'หมวดหมู่ร้าน',
                    selectCategory: 'เลือกหมวดหมู่'
                },
                media: {
                    title: 'รูปภาพร้านค้า',
                    logo: 'โลโก้ร้าน',
                    logoHint: 'ขนาดแนะนำ 200x200 px',
                    cover: 'ปกร้านค้า',
                    coverHint: 'ขนาดแนะนำ 1200x400 px',
                    upload: 'อัปโหลด'
                },
                details: {
                    title: 'รายละเอียดเพิ่มเติม',
                    description: 'คำอธิบายร้าน',
                    descriptionPlaceholder: 'บอกเล่าเรื่องราวร้านของคุณ...',
                    phone: 'เบอร์โทรร้าน',
                    location: 'ที่ตั้งร้าน',
                    province: 'จังหวัด',
                    amphoe: 'เขต/อำเภอ'
                },
                review: {
                    title: 'ตรวจสอบข้อมูล',
                    confirm: 'ข้อมูลถูกต้อง เปิดร้านเลย!',
                    edit: 'แก้ไข'
                },
                success: {
                    title: 'เปิดร้านสำเร็จ! 🎉',
                    subtitle: 'ร้านค้าของคุณพร้อมใช้งานแล้ว',
                    goToStore: 'ไปยังร้านของฉัน',
                    addProducts: 'เพิ่มสินค้าแรก'
                }
            },
            buttons: {
                next: 'ถัดไป',
                back: 'ย้อนกลับ',
                skip: 'ข้าม',
                create: 'สร้างร้านค้า'
            },
            errors: {
                nameRequired: 'กรุณากรอกชื่อร้าน',
                categoryRequired: 'กรุณาเลือกหมวดหมู่'
            }
        },
        en: {
            title: 'Open Store',
            steps: {
                intro: {
                    title: 'Open Your Store 🏪',
                    subtitle: 'Create your online store in minutes',
                    features: [
                        '🎨 Beautiful storefront, customizable',
                        '📊 Sales analytics dashboard',
                        '🎁 Create coupons and promotions',
                        '🤖 AI-powered store management'
                    ],
                    requirements: [
                        'Phone verified',
                        'KYC verified (for General Store)',
                        'Bank account added'
                    ],
                    start: 'Get Started'
                },
                basic: {
                    title: 'Basic Information',
                    storeName: 'Store Name',
                    storeNamePlaceholder: 'e.g. Somchai Electronics',
                    storeSlug: 'Store URL',
                    storeSlugPrefix: 'jaikod.com/store/',
                    category: 'Store Category',
                    selectCategory: 'Select category'
                },
                media: {
                    title: 'Store Images',
                    logo: 'Store Logo',
                    logoHint: 'Recommended: 200x200 px',
                    cover: 'Cover Image',
                    coverHint: 'Recommended: 1200x400 px',
                    upload: 'Upload'
                },
                details: {
                    title: 'Additional Details',
                    description: 'Store Description',
                    descriptionPlaceholder: 'Tell your store story...',
                    phone: 'Store Phone',
                    location: 'Store Location',
                    province: 'Province',
                    amphoe: 'District'
                },
                review: {
                    title: 'Review Information',
                    confirm: 'Looks good, create store!',
                    edit: 'Edit'
                },
                success: {
                    title: 'Store Created! 🎉',
                    subtitle: 'Your store is now live',
                    goToStore: 'Go to My Store',
                    addProducts: 'Add First Product'
                }
            },
            buttons: {
                next: 'Next',
                back: 'Back',
                skip: 'Skip',
                create: 'Create Store'
            },
            errors: {
                nameRequired: 'Please enter store name',
                categoryRequired: 'Please select a category'
            }
        }
    }

    const copy = t[language as 'th' | 'en'] || t.th

    // Generate slug from name
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^a-z0-9-]/g, '')
            .slice(0, 30)
    }

    // Handle name change
    const handleNameChange = (name: string) => {
        setStoreData(prev => ({
            ...prev,
            name,
            slug: generateSlug(name)
        }))
    }

    // Handle image upload
    const handleImageUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: 'logo' | 'cover'
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            setStoreData(prev => ({
                ...prev,
                [type]: event.target?.result as string
            }))
        }
        reader.readAsDataURL(file)
    }

    // Validate step
    const validateStep = (): boolean => {
        setError('')

        switch (step) {
            case 'basic':
                if (!storeData.name.trim()) {
                    setError(copy.errors.nameRequired)
                    return false
                }
                if (!storeData.category) {
                    setError(copy.errors.categoryRequired)
                    return false
                }
                break
        }

        return true
    }

    // Navigate steps
    const goNext = () => {
        if (!validateStep()) return

        const steps: Step[] = ['intro', 'basic', 'media', 'details', 'review', 'success']
        const currentIndex = steps.indexOf(step)
        if (currentIndex < steps.length - 1) {
            setStep(steps[currentIndex + 1])
        }
    }

    const goBack = () => {
        const steps: Step[] = ['intro', 'basic', 'media', 'details', 'review', 'success']
        const currentIndex = steps.indexOf(step)
        if (currentIndex > 0) {
            setStep(steps[currentIndex - 1])
        }
    }

    // Create store
    const handleCreateStore = async () => {
        setLoading(true)

        try {
            if (DEMO_MODE) {
                // Demo: Simulate store creation
                await new Promise(resolve => setTimeout(resolve, 2000))
                console.log('🏪 [DEMO] Store created:', storeData)
            } else {
                // TODO: Call API to create store
                // await createStore(storeData)
            }

            setStep('success')
            onComplete(storeData)
        } catch (err) {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
        } finally {
            setLoading(false)
        }
    }

    // Reset and close
    const handleClose = () => {
        setStep('intro')
        setStoreData({
            name: '',
            slug: '',
            description: '',
            category: '',
            logo: null,
            cover: null,
            phone: '',
            location: { province: '', amphoe: '' }
        })
        setError('')
        onClose()
    }

    // Get step number
    const getStepNumber = (): number => {
        const steps: Step[] = ['intro', 'basic', 'media', 'details', 'review']
        return steps.indexOf(step)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                <Store className="w-7 h-7" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{copy.title}</h2>
                                <p className="text-white/80 text-sm">
                                    {step === 'intro' ? copy.steps.intro.subtitle :
                                        step === 'success' ? copy.steps.success.subtitle :
                                            `Step ${getStepNumber()} of 4`}
                                </p>
                            </div>
                        </div>

                        {/* Progress */}
                        {step !== 'intro' && step !== 'success' && (
                            <div className="mt-4 flex gap-2">
                                {[1, 2, 3, 4].map(i => (
                                    <div
                                        key={i}
                                        className={`flex-1 h-1.5 rounded-full transition-colors ${getStepNumber() >= i ? 'bg-white' : 'bg-white/30'
                                            }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {/* Intro Step */}
                            {step === 'intro' && (
                                <motion.div
                                    key="intro"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center mb-6">
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                            {copy.steps.intro.title}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {copy.steps.intro.subtitle}
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <div className="bg-gradient-to-br from-orange-50 to-pink-50 dark:from-orange-900/20 dark:to-pink-900/20 rounded-2xl p-6">
                                        <ul className="space-y-3">
                                            {copy.steps.intro.features.map((feature, i) => (
                                                <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                                                    <span className="text-xl">{feature.slice(0, 2)}</span>
                                                    <span>{feature.slice(3)}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    <button
                                        onClick={goNext}
                                        className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        {copy.steps.intro.start}
                                    </button>
                                </motion.div>
                            )}

                            {/* Basic Info Step */}
                            {step === 'basic' && (
                                <motion.div
                                    key="basic"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {copy.steps.basic.title}
                                    </h3>

                                    {/* Store Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {copy.steps.basic.storeName} *
                                        </label>
                                        <input
                                            type="text"
                                            value={storeData.name}
                                            onChange={e => handleNameChange(e.target.value)}
                                            placeholder={copy.steps.basic.storeNamePlaceholder}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                            maxLength={50}
                                        />
                                    </div>

                                    {/* Slug Preview */}
                                    {storeData.slug && (
                                        <div className="bg-gray-50 dark:bg-slate-700/50 rounded-xl px-4 py-3">
                                            <label className="block text-xs text-gray-500 mb-1">
                                                {copy.steps.basic.storeSlug}
                                            </label>
                                            <div className="flex items-center gap-1 text-sm">
                                                <span className="text-gray-400">{copy.steps.basic.storeSlugPrefix}</span>
                                                <span className="font-medium text-orange-600 dark:text-orange-400">
                                                    {storeData.slug}
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Category */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {copy.steps.basic.category} *
                                        </label>
                                        <div className="grid grid-cols-4 gap-2">
                                            {STORE_CATEGORIES.map(cat => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => setStoreData(prev => ({ ...prev, category: cat.id }))}
                                                    className={`p-3 rounded-xl border-2 transition-all text-center ${storeData.category === cat.id
                                                            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
                                                            : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                                                        }`}
                                                >
                                                    <span className="text-2xl block mb-1">{cat.icon}</span>
                                                    <span className="text-xs text-gray-700 dark:text-gray-300">
                                                        {cat.name}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Navigation */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={goBack}
                                            className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700"
                                        >
                                            {copy.buttons.back}
                                        </button>
                                        <button
                                            onClick={goNext}
                                            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold"
                                        >
                                            {copy.buttons.next}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Media Step */}
                            {step === 'media' && (
                                <motion.div
                                    key="media"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {copy.steps.media.title}
                                    </h3>

                                    {/* Logo */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {copy.steps.media.logo}
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <div className="w-24 h-24 rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600">
                                                {storeData.logo ? (
                                                    <Image
                                                        src={storeData.logo}
                                                        alt="Logo"
                                                        width={96}
                                                        height={96}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <Store className="w-10 h-10 text-gray-400" />
                                                )}
                                            </div>
                                            <div>
                                                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-slate-700 rounded-xl hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors">
                                                    <Upload className="w-4 h-4" />
                                                    {copy.steps.media.upload}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        className="hidden"
                                                        onChange={e => handleImageUpload(e, 'logo')}
                                                    />
                                                </label>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {copy.steps.media.logoHint}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Cover */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {copy.steps.media.cover}
                                        </label>
                                        <label className="cursor-pointer block">
                                            <div className="aspect-[3/1] rounded-2xl bg-gray-100 dark:bg-slate-700 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-orange-400 transition-colors">
                                                {storeData.cover ? (
                                                    <Image
                                                        src={storeData.cover}
                                                        alt="Cover"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="text-center text-gray-400">
                                                        <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                                                        <p className="text-sm">{copy.steps.media.upload}</p>
                                                        <p className="text-xs">{copy.steps.media.coverHint}</p>
                                                    </div>
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={e => handleImageUpload(e, 'cover')}
                                            />
                                        </label>
                                    </div>

                                    {/* Navigation */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={goBack}
                                            className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700"
                                        >
                                            {copy.buttons.back}
                                        </button>
                                        <button
                                            onClick={goNext}
                                            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold"
                                        >
                                            {storeData.logo || storeData.cover ? copy.buttons.next : copy.buttons.skip}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Details Step */}
                            {step === 'details' && (
                                <motion.div
                                    key="details"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {copy.steps.details.title}
                                    </h3>

                                    {/* Description */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {copy.steps.details.description}
                                        </label>
                                        <textarea
                                            value={storeData.description}
                                            onChange={e => setStoreData(prev => ({ ...prev, description: e.target.value }))}
                                            placeholder={copy.steps.details.descriptionPlaceholder}
                                            rows={3}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                        />
                                    </div>

                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {copy.steps.details.phone}
                                        </label>
                                        <input
                                            type="tel"
                                            value={storeData.phone}
                                            onChange={e => setStoreData(prev => ({ ...prev, phone: e.target.value }))}
                                            placeholder="0XX-XXX-XXXX"
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>

                                    {/* Location */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {copy.steps.details.location}
                                        </label>
                                        <select
                                            value={storeData.location.province}
                                            onChange={e => setStoreData(prev => ({
                                                ...prev,
                                                location: { ...prev.location, province: e.target.value }
                                            }))}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        >
                                            <option value="">{copy.steps.details.province}</option>
                                            {PROVINCES.map(p => (
                                                <option key={p} value={p}>{p}</option>
                                            ))}
                                        </select>
                                    </div>

                                    {/* Navigation */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={goBack}
                                            className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700"
                                        >
                                            {copy.buttons.back}
                                        </button>
                                        <button
                                            onClick={goNext}
                                            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold"
                                        >
                                            {copy.buttons.next}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Review Step */}
                            {step === 'review' && (
                                <motion.div
                                    key="review"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                        {copy.steps.review.title}
                                    </h3>

                                    {/* Store Preview */}
                                    <div className="bg-gray-50 dark:bg-slate-700/50 rounded-2xl overflow-hidden">
                                        {/* Cover */}
                                        <div className="aspect-[4/1] bg-gradient-to-r from-orange-400 to-pink-400 relative">
                                            {storeData.cover && (
                                                <Image
                                                    src={storeData.cover}
                                                    alt="Cover"
                                                    fill
                                                    className="object-cover"
                                                />
                                            )}
                                            {/* Logo */}
                                            <div className="absolute -bottom-8 left-6 w-16 h-16 rounded-xl bg-white dark:bg-slate-800 shadow-lg overflow-hidden flex items-center justify-center">
                                                {storeData.logo ? (
                                                    <Image
                                                        src={storeData.logo}
                                                        alt="Logo"
                                                        width={64}
                                                        height={64}
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <Store className="w-8 h-8 text-orange-500" />
                                                )}
                                            </div>
                                        </div>

                                        {/* Info */}
                                        <div className="p-6 pt-12">
                                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                                {storeData.name || 'ชื่อร้านค้า'}
                                            </h4>
                                            <p className="text-sm text-gray-500 mb-2">
                                                jaikod.com/store/{storeData.slug || 'your-store'}
                                            </p>
                                            {storeData.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {storeData.description}
                                                </p>
                                            )}
                                            <div className="flex gap-4 mt-4 text-sm text-gray-500">
                                                {storeData.location.province && (
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {storeData.location.province}
                                                    </span>
                                                )}
                                                {storeData.phone && (
                                                    <span className="flex items-center gap-1">
                                                        <Phone className="w-4 h-4" />
                                                        {storeData.phone}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Navigation */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={goBack}
                                            className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700"
                                        >
                                            {copy.steps.review.edit}
                                        </button>
                                        <button
                                            onClick={handleCreateStore}
                                            disabled={loading}
                                            className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <>
                                                    <Store className="w-5 h-5" />
                                                    {copy.buttons.create}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Success Step */}
                            {step === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center py-8"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', delay: 0.2 }}
                                        className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-pink-500 rounded-3xl flex items-center justify-center"
                                    >
                                        <Store className="w-12 h-12 text-white" />
                                    </motion.div>

                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {copy.steps.success.title}
                                    </h3>

                                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                                        {copy.steps.success.subtitle}
                                    </p>

                                    <div className="flex flex-col gap-3">
                                        <button
                                            onClick={() => router.push('/seller/products')}
                                            className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-bold flex items-center justify-center gap-2"
                                        >
                                            <Zap className="w-5 h-5" />
                                            {copy.steps.success.addProducts}
                                        </button>
                                        <button
                                            onClick={handleClose}
                                            className="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-medium"
                                        >
                                            {copy.steps.success.goToStore}
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

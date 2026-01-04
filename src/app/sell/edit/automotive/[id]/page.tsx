'use client'

/**
 * 🚗 Edit Car Listing Page
 * 
 * Reuses the same template as /sell/automotive/cars but pre-fills with existing data
 */

import React, { useState, useCallback, useMemo, useRef, useEffect, Suspense } from 'react'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { getListingById, updateListing, UniversalListing } from '@/lib/listings'
import { Loader2, ArrowLeft, Save, Eye, Trash2, ChevronDown, ChevronUp, Sparkles, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Dynamic import for ThaiLocationPicker
const ThaiLocationPicker = dynamic(() => import('@/components/ui/ThaiLocationPicker'), {
    ssr: false,
    loading: () => (
        <div className="h-32 bg-slate-800 rounded-xl animate-pulse flex items-center justify-center text-gray-500 text-sm">
            กำลังโหลดแผนที่...
        </div>
    )
})

// Dynamic import for HybridPhotoUploader
const HybridPhotoUploader = dynamic(() => import('@/components/ui/HybridPhotoUploader'), {
    ssr: false,
    loading: () => (
        <div className="h-48 bg-slate-800 rounded-xl animate-pulse flex items-center justify-center text-gray-500 text-sm">
            กำลังโหลด Photo Uploader...
        </div>
    )
})

// ============================================
// CAR TEMPLATE DATA (Same as create page)
// ============================================
const CAR_TEMPLATE = {
    sections: [
        {
            id: 'car_info',
            emoji: '🚙',
            title_th: 'ข้อมูลรถ',
            title_en: 'Vehicle Information',
            fields: [
                { key: 'brand', label_th: 'ยี่ห้อ', label_en: 'Brand', importance: 'required', type: 'text' },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text' },
                { key: 'sub_model', label_th: 'รุ่นย่อย/แพ็คเกจ', label_en: 'Sub-model', importance: 'recommended', type: 'text', placeholder_th: 'เช่น 1.8 EL, Turbo RS' },
                {
                    key: 'body_type', label_th: 'ประเภทตัวถัง', label_en: 'Body Type', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'sedan', label_th: '🚗 เก๋ง (Sedan)', label_en: '🚗 Sedan' },
                        { value: 'suv', label_th: '🚙 SUV / PPV', label_en: '🚙 SUV / PPV' },
                        { value: 'pickup', label_th: '🛻 กระบะ (Pickup)', label_en: '🛻 Pickup Truck' },
                        { value: 'hatchback', label_th: '🚘 5 ประตู (Hatchback)', label_en: '🚘 Hatchback' },
                        { value: 'van', label_th: '🚐 รถตู้ (Van)', label_en: '🚐 Van' },
                        { value: 'coupe', label_th: '🏎️ คูเป้ (Coupe)', label_en: '🏎️ Coupe' },
                    ]
                },
                {
                    key: 'year', label_th: 'ปีรถ', label_en: 'Year', importance: 'required', type: 'select',
                    options: Array.from({ length: 45 }, (_, i) => {
                        const year = 2568 - i
                        const ad = year - 543
                        return { value: year.toString(), label_th: `${year} (${ad})`, label_en: ad.toString() }
                    })
                },
                {
                    key: 'color', label_th: 'สี', label_en: 'Color', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'white', label_th: '⚪ ขาว', label_en: '⚪ White' },
                        { value: 'white_pearl', label_th: '🤍 ขาวมุก', label_en: '🤍 Pearl White' },
                        { value: 'black', label_th: '⬛ ดำ', label_en: '⬛ Black' },
                        { value: 'silver', label_th: '🩶 เงิน', label_en: '🩶 Silver' },
                        { value: 'gray', label_th: '⬜ เทา', label_en: '⬜ Gray' },
                        { value: 'red', label_th: '🔴 แดง', label_en: '🔴 Red' },
                        { value: 'blue', label_th: '🔵 น้ำเงิน', label_en: '🔵 Blue' },
                        { value: 'other', label_th: '🎨 อื่นๆ', label_en: '🎨 Other' },
                    ]
                },
            ]
        },
        {
            id: 'mileage_usage',
            emoji: '📊',
            title_th: 'ระยะทางและการใช้งาน',
            title_en: 'Mileage & Usage',
            fields: [
                { key: 'mileage', label_th: 'ระยะทาง (กม.)', label_en: 'Mileage (km)', importance: 'recommended', type: 'text', placeholder_th: 'เช่น 50000' },
                {
                    key: 'owners', label_th: 'เจ้าของกี่มือ', label_en: 'Owners', importance: 'recommended', type: 'select',
                    options: [
                        { value: '1', label_th: '👤 มือเดียว', label_en: '👤 First Owner' },
                        { value: '2', label_th: '👥 มือสอง', label_en: '👥 Second Owner' },
                        { value: '3+', label_th: '👥 มือสามขึ้นไป', label_en: '👥 Third+ Owner' },
                    ]
                },
            ]
        },
        {
            id: 'specs',
            emoji: '⚙️',
            title_th: 'สเปครถ',
            title_en: 'Specifications',
            fields: [
                {
                    key: 'fuel_type', label_th: 'เชื้อเพลิง', label_en: 'Fuel', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'petrol', label_th: '⛽ เบนซิน', label_en: '⛽ Petrol' },
                        { value: 'diesel', label_th: '🛢️ ดีเซล', label_en: '🛢️ Diesel' },
                        { value: 'hybrid', label_th: '🔋 ไฮบริด', label_en: '🔋 Hybrid' },
                        { value: 'ev', label_th: '⚡ ไฟฟ้า', label_en: '⚡ Electric' },
                    ]
                },
                {
                    key: 'transmission', label_th: 'เกียร์', label_en: 'Transmission', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'auto', label_th: '🅰️ ออโต้', label_en: '🅰️ Automatic' },
                        { value: 'manual', label_th: '🅼️ ธรรมดา', label_en: '🅼️ Manual' },
                        { value: 'cvt', label_th: '🔄 CVT', label_en: '🔄 CVT' },
                    ]
                },
                {
                    key: 'engine_cc', label_th: 'ขนาดเครื่อง', label_en: 'Engine Size', importance: 'recommended', type: 'select',
                    options: [
                        // Eco / Small Cars (660cc - 1.4L)
                        { value: '660', label_th: '660cc (Kei Car)', label_en: '660cc (Kei)' },
                        { value: '1000', label_th: '1.0 ลิตร', label_en: '1.0L' },
                        { value: '1200', label_th: '1.2 ลิตร', label_en: '1.2L' },
                        { value: '1300', label_th: '1.3 ลิตร', label_en: '1.3L' },
                        { value: '1400', label_th: '1.4 ลิตร', label_en: '1.4L' },
                        { value: '1500', label_th: '1.5 ลิตร', label_en: '1.5L' },
                        // Medium Cars (1.6L - 2.0L)
                        { value: '1600', label_th: '1.6 ลิตร', label_en: '1.6L' },
                        { value: '1800', label_th: '1.8 ลิตร', label_en: '1.8L' },
                        { value: '2000', label_th: '2.0 ลิตร', label_en: '2.0L' },
                        // Large / Diesel (2.2L - 3.0L)
                        { value: '2200', label_th: '2.2 ลิตร', label_en: '2.2L' },
                        { value: '2300', label_th: '2.3 ลิตร', label_en: '2.3L' },
                        { value: '2400', label_th: '2.4 ลิตร', label_en: '2.4L' },
                        { value: '2500', label_th: '2.5 ลิตร', label_en: '2.5L' },
                        { value: '2700', label_th: '2.7 ลิตร', label_en: '2.7L' },
                        { value: '2800', label_th: '2.8 ลิตร', label_en: '2.8L' },
                        { value: '3000', label_th: '3.0 ลิตร', label_en: '3.0L' },
                        // V6/V8 (3.5L+)
                        { value: '3300', label_th: '3.3 ลิตร', label_en: '3.3L' },
                        { value: '3500', label_th: '3.5 ลิตร (V6)', label_en: '3.5L (V6)' },
                        { value: '4000', label_th: '4.0 ลิตร', label_en: '4.0L' },
                        { value: '5000', label_th: '5.0 ลิตร (V8)', label_en: '5.0L (V8)' },
                        { value: 'other', label_th: 'อื่นๆ / ไม่ทราบ', label_en: 'Other' },
                    ]
                },
            ]
        },
        {
            id: 'condition_history',
            emoji: '🔧',
            title_th: 'สภาพและประวัติ',
            title_en: 'Condition & History',
            fields: [
                {
                    key: 'accident_history', label_th: 'ประวัติอุบัติเหตุ', label_en: 'Accident', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'none', label_th: '✅ ไม่เคยชน', label_en: '✅ No Accidents' },
                        { value: 'minor', label_th: '⚠️ ชนเล็กน้อย', label_en: '⚠️ Minor' },
                        { value: 'major', label_th: '🔴 ชนหนัก', label_en: '🔴 Major' },
                    ]
                },
                {
                    key: 'flood_history', label_th: 'ประวัติน้ำท่วม', label_en: 'Flood', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'none', label_th: '✅ ไม่เคยจมน้ำ', label_en: '✅ Never Flooded' },
                        { value: 'partial', label_th: '💧 น้ำท่วมบางส่วน', label_en: '💧 Partial' },
                        { value: 'full', label_th: '🌊 น้ำท่วมทั้งคัน', label_en: '🌊 Full' },
                    ]
                },
                {
                    key: 'tire_condition', label_th: 'สภาพยาง', label_en: 'Tires', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'new', label_th: '🆕 ยางใหม่', label_en: '🆕 New' },
                        { value: 'good', label_th: '✅ ดอกยางดี', label_en: '✅ Good' },
                        { value: 'fair', label_th: '⚠️ พอใช้', label_en: '⚠️ Fair' },
                        { value: 'need_change', label_th: '🔴 ต้องเปลี่ยน', label_en: '🔴 Needs Change' },
                    ]
                },
            ]
        },
        {
            id: 'payment_options',
            emoji: '💰',
            title_th: 'ราคาและการชำระ',
            title_en: 'Price & Payment',
            fields: [
                { key: 'price', label_th: 'ราคาขาย (บาท)', label_en: 'Price (THB)', importance: 'required', type: 'text', placeholder_th: 'เช่น 550000' },
                {
                    key: 'negotiable', label_th: 'ต่อรองได้?', label_en: 'Negotiable?', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'yes', label_th: '✅ ต่อรองได้', label_en: '✅ Yes' },
                        { value: 'little', label_th: '↔️ ต่อได้นิดหน่อย', label_en: '↔️ A little' },
                        { value: 'no', label_th: '❌ ราคาตายตัว', label_en: '❌ Fixed' },
                    ]
                },
                {
                    key: 'finance_available', label_th: 'ไฟแนนซ์', label_en: 'Financing', importance: 'recommended', type: 'select',
                    options: [
                        { value: 'cash_only', label_th: '💵 เงินสดเท่านั้น', label_en: '💵 Cash Only' },
                        { value: 'finance_ok', label_th: '🏦 จัดไฟแนนซ์ได้', label_en: '🏦 Financing OK' },
                        { value: 'takeover', label_th: '📑 รับช่วงผ่อน', label_en: '📑 Takeover OK' },
                    ]
                },
            ]
        },
        {
            id: 'extras',
            emoji: '📦',
            title_th: 'อุปกรณ์เสริมและรายละเอียด',
            title_en: 'Extras & Details',
            fields: [
                { key: 'additional_description', label_th: 'รายละเอียดเพิ่มเติม', label_en: 'Additional Details', importance: 'optional', type: 'textarea', placeholder_th: 'ใส่ข้อมูลเพิ่มเติมที่ต้องการบอกผู้ซื้อ...' },
            ]
        },
        {
            id: 'contact',
            emoji: '📞',
            title_th: 'ช่องทางติดต่อ',
            title_en: 'Contact Info',
            fields: [
                { key: 'contact_phone', label_th: '📞 เบอร์โทรศัพท์', label_en: '📞 Phone', importance: 'recommended', type: 'text', placeholder_th: 'เช่น 081-234-5678' },
                { key: 'contact_line', label_th: '💚 LINE ID', label_en: '💚 LINE ID', importance: 'optional', type: 'text', placeholder_th: 'เช่น @mylineid' },
            ]
        },
    ]
}

type Language = 'th' | 'en'

// ============================================
// MAIN EDIT COMPONENT
// ============================================

function EditCarListingContent() {
    const params = useParams()
    const router = useRouter()
    const { language } = useLanguage()
    const { user } = useAuth()
    const lang = language as Language

    const listingId = params.id as string

    // State
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [listing, setListing] = useState<UniversalListing | null>(null)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<Record<string, string | string[]>>({})
    const [uploadedImages, setUploadedImages] = useState<string[]>([])
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['car_info', 'payment_options']))

    // Load listing data
    useEffect(() => {
        if (listingId) {
            loadListing()
        }
    }, [listingId])

    const loadListing = async () => {
        setLoading(true)
        try {
            const data = await getListingById(listingId)
            if (!data) {
                setError(lang === 'th' ? 'ไม่พบประกาศ' : 'Listing not found')
                setLoading(false)
                return
            }

            setListing(data)

            // Pre-fill form with template_data
            if (data.template_data) {
                const prefillData: Record<string, string | string[]> = {}

                // Map template_data to form fields
                Object.entries(data.template_data).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) {
                        if (typeof value === 'number') {
                            prefillData[key] = value.toString()
                        } else if (typeof value === 'string' || Array.isArray(value)) {
                            prefillData[key] = value
                        }
                    }
                })

                // Add price
                prefillData.price = data.price?.toString() || ''

                setFormData(prefillData)
            }

            // Load images
            if (data.images && data.images.length > 0) {
                setUploadedImages(data.images.map(img => img.url))
            } else if (data.thumbnail_url) {
                setUploadedImages([data.thumbnail_url])
            }

        } catch (err) {
            console.error('Error loading listing:', err)
            setError(lang === 'th' ? 'เกิดข้อผิดพลาด' : 'Error loading')
        } finally {
            setLoading(false)
        }
    }

    // Check ownership after user loads
    const isOwner = useMemo(() => {
        if (!user || !listing) return false
        return listing.seller_id === user.uid
    }, [user, listing])

    // Toggle section
    const toggleSection = useCallback((sectionId: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev)
            if (next.has(sectionId)) {
                next.delete(sectionId)
            } else {
                next.add(sectionId)
            }
            return next
        })
    }, [])

    // Handle field change
    const handleFieldChange = useCallback((key: string, value: string | string[]) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }, [])

    // Handle save
    const handleSave = async () => {
        if (!user || !listing) return

        // Double check ownership
        if (listing.seller_id !== user.uid) {
            alert(lang === 'th' ? 'คุณไม่ใช่เจ้าของประกาศนี้' : 'Not authorized')
            return
        }

        setSaving(true)
        try {
            // Generate title from form data
            const title = [
                formData.brand,
                formData.model,
                formData.sub_model,
                formData.year
            ].filter(Boolean).join(' ') || listing.title

            const result = await updateListing(
                listing.id,
                {
                    title,
                    price: parseInt(formData.price as string) || listing.price,
                    template_data: formData,
                    images: uploadedImages
                },
                user.uid
            )

            if (result.success) {
                router.push(result.slug ? `/listing/${result.slug}` : '/profile/listings')
            }
        } catch (err: any) {
            console.error('Error saving:', err)
            const errorMessage = err?.message || (lang === 'th' ? 'บันทึกไม่สำเร็จ' : 'Failed to save')
            alert(errorMessage)
        } finally {
            setSaving(false)
        }
    }

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        )
    }

    // Error
    if (error || !listing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center px-4">
                    <h1 className="text-xl font-bold text-white mb-4">{error || 'ไม่พบประกาศ'}</h1>
                    <Link href="/profile/listings" className="text-purple-400 hover:underline">
                        ← กลับ
                    </Link>
                </div>
            </div>
        )
    }

    // Not logged in
    if (!user) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center px-4">
                    <h1 className="text-xl font-bold text-white mb-4">
                        {lang === 'th' ? 'กรุณาเข้าสู่ระบบ' : 'Please login'}
                    </h1>
                    <Link href="/login" className="px-6 py-3 bg-purple-600 text-white rounded-xl inline-block">
                        {lang === 'th' ? 'เข้าสู่ระบบ' : 'Login'}
                    </Link>
                </div>
            </div>
        )
    }

    // Not owner
    if (!isOwner) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center px-4">
                    <h1 className="text-xl font-bold text-red-400 mb-4">
                        ⚠️ {lang === 'th' ? 'คุณไม่ใช่เจ้าของประกาศนี้' : 'Not authorized'}
                    </h1>
                    <p className="text-gray-400 mb-6">
                        {lang === 'th' ? 'คุณสามารถแก้ไขได้เฉพาะประกาศของตัวเองเท่านั้น' : 'You can only edit your own listings'}
                    </p>
                    <Link href="/profile/listings" className="text-purple-400 hover:underline">
                        ← {lang === 'th' ? 'กลับไปหน้ารายการ' : 'Back to listings'}
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 backdrop-blur-xl bg-slate-900/80 border-b border-white/10">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className="p-2 hover:bg-white/10 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="font-bold text-white">
                                {lang === 'th' ? '✏️ แก้ไขประกาศรถยนต์' : '✏️ Edit Car Listing'}
                            </h1>
                            <p className="text-xs text-gray-400">{listing.listing_code}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link
                            href={`/listing/${listing.slug}`}
                            target="_blank"
                            className="p-2 hover:bg-white/10 rounded-lg"
                        >
                            <Eye className="w-5 h-5 text-gray-400" />
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                {/* Photos Section */}
                <section className="mb-6">
                    <h2 className="text-lg font-bold text-white mb-4">📸 รูปภาพรถ</h2>
                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3">
                        {uploadedImages.map((img, idx) => (
                            <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                <Image src={img} alt={`Photo ${idx + 1}`} fill className="object-cover" />
                                <button
                                    onClick={() => setUploadedImages(prev => prev.filter((_, i) => i !== idx))}
                                    className="absolute top-1 right-1 p-1 bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                                {idx === 0 && (
                                    <span className="absolute bottom-1 left-1 px-2 py-0.5 bg-purple-500 text-white text-[10px] rounded-full">
                                        ปก
                                    </span>
                                )}
                            </div>
                        ))}

                        {/* Add more button */}
                        <label className="aspect-square border-2 border-dashed border-slate-600 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-purple-500 hover:bg-purple-500/10 transition-all">
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={(e) => {
                                    const files = e.target.files
                                    if (!files) return
                                    Array.from(files).forEach(file => {
                                        const reader = new FileReader()
                                        reader.onloadend = () => {
                                            if (typeof reader.result === 'string') {
                                                setUploadedImages(prev => [...prev, reader.result as string].slice(0, 10))
                                            }
                                        }
                                        reader.readAsDataURL(file)
                                    })
                                }}
                            />
                            <span className="text-2xl">+</span>
                            <span className="text-xs text-gray-500">เพิ่ม</span>
                        </label>
                    </div>
                </section>

                {/* Template Sections (Accordion) */}
                {CAR_TEMPLATE.sections.map(section => (
                    <section key={section.id} className="mb-4">
                        <button
                            onClick={() => toggleSection(section.id)}
                            className="w-full flex items-center justify-between p-4 bg-slate-800/50 rounded-xl hover:bg-slate-800 transition-colors"
                        >
                            <span className="font-medium text-white">
                                {section.emoji} {lang === 'th' ? section.title_th : section.title_en}
                            </span>
                            {expandedSections.has(section.id) ? (
                                <ChevronUp className="w-5 h-5 text-gray-400" />
                            ) : (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                            )}
                        </button>

                        {expandedSections.has(section.id) && (
                            <div className="mt-2 p-4 bg-slate-800/30 rounded-xl space-y-4">
                                {section.fields.map(field => {
                                    const value = formData[field.key] || ''
                                    const label = lang === 'th' ? field.label_th : field.label_en

                                    return (
                                        <div key={field.key}>
                                            <label className="block text-sm text-gray-300 mb-2">
                                                {label}
                                                {field.importance === 'required' && (
                                                    <span className="text-red-400 ml-1">*</span>
                                                )}
                                            </label>

                                            {field.type === 'select' && field.options ? (
                                                <select
                                                    value={value as string}
                                                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500"
                                                >
                                                    <option value="">{lang === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                                                    {field.options.map(opt => (
                                                        <option key={opt.value} value={opt.value}>
                                                            {lang === 'th' ? opt.label_th : opt.label_en}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : field.type === 'textarea' ? (
                                                <textarea
                                                    value={value as string}
                                                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                                    placeholder={field.placeholder_th}
                                                    rows={4}
                                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500"
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={value as string}
                                                    onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                                    placeholder={field.placeholder_th}
                                                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500"
                                                />
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </section>
                ))}

                {/* Save Button */}
                <div className="sticky bottom-0 bg-slate-900/90 backdrop-blur-xl border-t border-white/10 p-4 -mx-4">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {lang === 'th' ? 'กำลังบันทึก...' : 'Saving...'}
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {lang === 'th' ? 'บันทึกการเปลี่ยนแปลง' : 'Save Changes'}
                            </>
                        )}
                    </button>
                </div>
            </main>
        </div>
    )
}

// Export with Suspense
export default function EditCarListingPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        }>
            <EditCarListingContent />
        </Suspense>
    )
}

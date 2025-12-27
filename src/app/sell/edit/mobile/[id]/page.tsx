'use client'

/**
 * 📱 Edit Mobile Listing Page
 * 
 * Edit page for mobile phone listings - reuses MOBILE_TEMPLATE
 */

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Save, Loader2, AlertTriangle, Check } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { getListingById, updateListing, UniversalListing } from '@/lib/listings'

// ============================================
// MOBILE TEMPLATE DATA
// ============================================

const MOBILE_TEMPLATE = {
    sections: [
        {
            id: 'device_info',
            emoji: '📱',
            title_th: 'ข้อมูลเครื่อง',
            title_en: 'Device Info',
            fields: [
                { key: 'brand', label_th: 'ยี่ห้อ', label_en: 'Brand', importance: 'required', type: 'text' },
                { key: 'model', label_th: 'รุ่น', label_en: 'Model', importance: 'required', type: 'text' },
                {
                    key: 'storage', label_th: 'ความจุ', label_en: 'Storage', importance: 'required', type: 'select',
                    options: [
                        { value: '32gb', label_th: '32 GB', label_en: '32 GB' },
                        { value: '64gb', label_th: '64 GB', label_en: '64 GB' },
                        { value: '128gb', label_th: '128 GB', label_en: '128 GB' },
                        { value: '256gb', label_th: '256 GB', label_en: '256 GB' },
                        { value: '512gb', label_th: '512 GB', label_en: '512 GB' },
                        { value: '1tb', label_th: '1 TB', label_en: '1 TB' },
                    ]
                },
                {
                    key: 'color', label_th: 'สี', label_en: 'Color', importance: 'required', type: 'text',
                },
            ]
        },
        {
            id: 'condition',
            emoji: '✨',
            title_th: 'สภาพเครื่อง',
            title_en: 'Condition',
            fields: [
                {
                    key: 'screen_condition', label_th: 'สภาพหน้าจอ', label_en: 'Screen', importance: 'required', type: 'select',
                    options: [
                        { value: 'like_new', label_th: '✨ ใหม่มาก ไร้ริ้วรอย', label_en: '✨ Like New' },
                        { value: 'excellent', label_th: '🌟 ดีเยี่ยม มีรอยเล็กน้อย', label_en: '🌟 Excellent' },
                        { value: 'good', label_th: '👍 ดี มีรอยใช้งาน', label_en: '👍 Good' },
                        { value: 'fair', label_th: '⚠️ พอใช้ มีรอยชัด', label_en: '⚠️ Fair' },
                        { value: 'cracked', label_th: '💔 จอแตก/ร้าว', label_en: '💔 Cracked' },
                    ]
                },
                {
                    key: 'body_condition', label_th: 'สภาพตัวเครื่อง', label_en: 'Body', importance: 'required', type: 'select',
                    options: [
                        { value: 'like_new', label_th: '✨ ใหม่มาก ไร้รอย', label_en: '✨ Like New' },
                        { value: 'excellent', label_th: '🌟 ดีเยี่ยม รอยน้อย', label_en: '🌟 Excellent' },
                        { value: 'good', label_th: '👍 ดี มีรอยใช้งาน', label_en: '👍 Good' },
                        { value: 'fair', label_th: '⚠️ พอใช้ มีรอยชัด', label_en: '⚠️ Fair' },
                    ]
                },
                {
                    key: 'battery_health', label_th: 'สุขภาพแบตเตอรี่', label_en: 'Battery', importance: 'recommended', type: 'select',
                    options: [
                        { value: '100', label_th: '🔋 100%', label_en: '🔋 100%' },
                        { value: '95-99', label_th: '🔋 95-99%', label_en: '🔋 95-99%' },
                        { value: '90-94', label_th: '🔋 90-94%', label_en: '🔋 90-94%' },
                        { value: '85-89', label_th: '🔋 85-89%', label_en: '🔋 85-89%' },
                        { value: '80-84', label_th: '🔋 80-84%', label_en: '🔋 80-84%' },
                        { value: 'below_80', label_th: '🪫 ต่ำกว่า 80%', label_en: '🪫 Below 80%' },
                        { value: 'replaced', label_th: '🔄 เปลี่ยนแบตใหม่', label_en: '🔄 Replaced' },
                    ]
                },
            ]
        },
        {
            id: 'status',
            emoji: '🔒',
            title_th: 'สถานะเครื่อง',
            title_en: 'Device Status',
            fields: [
                {
                    key: 'icloud_status', label_th: 'สถานะ iCloud/FRP', label_en: 'iCloud/FRP', importance: 'required', type: 'select',
                    options: [
                        { value: 'logged_out', label_th: '✅ ออกจากระบบแล้ว พร้อมใช้', label_en: '✅ Logged out' },
                        { value: 'logged_in', label_th: '⚠️ ยังไม่ออกจากระบบ', label_en: '⚠️ Still logged in' },
                        { value: 'not_applicable', label_th: '➖ ไม่มี (Android บางรุ่น)', label_en: '➖ N/A' },
                    ]
                },
                {
                    key: 'network_status', label_th: 'สถานะเครือข่าย', label_en: 'Network', importance: 'required', type: 'select',
                    options: [
                        { value: 'unlocked', label_th: '🔓 ปลดล็อคแล้ว ใช้ได้ทุกค่าย', label_en: '🔓 Unlocked' },
                        { value: 'true_locked', label_th: '📱 ติด True', label_en: '📱 True Locked' },
                        { value: 'dtac_locked', label_th: '📱 ติด DTAC', label_en: '📱 DTAC Locked' },
                        { value: 'ais_locked', label_th: '📱 ติด AIS', label_en: '📱 AIS Locked' },
                    ]
                },
                {
                    key: 'warranty', label_th: 'ประกัน', label_en: 'Warranty', importance: 'optional', type: 'select',
                    options: [
                        { value: 'brand_warranty', label_th: '🛡️ ประกันศูนย์', label_en: '🛡️ Brand Warranty' },
                        { value: 'shop_warranty', label_th: '🏪 ประกันร้าน', label_en: '🏪 Shop Warranty' },
                        { value: 'no_warranty', label_th: '❌ ไม่มีประกัน', label_en: '❌ No Warranty' },
                    ]
                },
            ]
        },
        {
            id: 'accessories',
            emoji: '📦',
            title_th: 'อุปกรณ์',
            title_en: 'Accessories',
            fields: [
                {
                    key: 'accessories', label_th: 'อุปกรณ์ที่ให้', label_en: 'Included', importance: 'optional', type: 'multiselect',
                    options: [
                        { value: 'box', label_th: '📦 กล่อง', label_en: '📦 Box' },
                        { value: 'charger', label_th: '🔌 สายชาร์จ', label_en: '🔌 Cable' },
                        { value: 'adapter', label_th: '🔋 หัวชาร์จ', label_en: '🔋 Adapter' },
                        { value: 'earphones', label_th: '🎧 หูฟัง', label_en: '🎧 Earphones' },
                        { value: 'case', label_th: '📱 เคส', label_en: '📱 Case' },
                        { value: 'screen_protector', label_th: '🛡️ ฟิล์มกันรอย', label_en: '🛡️ Screen Protector' },
                    ]
                },
            ]
        },
    ]
}

// ============================================
// VALUE TRANSLATIONS
// ============================================

const VALUE_TRANSLATIONS: Record<string, { th: string; en: string }> = {
    // Storage
    '32gb': { th: '32 GB', en: '32 GB' },
    '64gb': { th: '64 GB', en: '64 GB' },
    '128gb': { th: '128 GB', en: '128 GB' },
    '256gb': { th: '256 GB', en: '256 GB' },
    '512gb': { th: '512 GB', en: '512 GB' },
    '1tb': { th: '1 TB', en: '1 TB' },
    // Condition
    'like_new': { th: 'ใหม่มาก', en: 'Like New' },
    'excellent': { th: 'ดีเยี่ยม', en: 'Excellent' },
    'good': { th: 'ดี', en: 'Good' },
    'fair': { th: 'พอใช้', en: 'Fair' },
    'cracked': { th: 'จอแตก', en: 'Cracked' },
    // Battery
    '100': { th: '100%', en: '100%' },
    '95-99': { th: '95-99%', en: '95-99%' },
    '90-94': { th: '90-94%', en: '90-94%' },
    '85-89': { th: '85-89%', en: '85-89%' },
    '80-84': { th: '80-84%', en: '80-84%' },
    'below_80': { th: 'ต่ำกว่า 80%', en: 'Below 80%' },
    'replaced': { th: 'เปลี่ยนแบตใหม่', en: 'Replaced' },
    // iCloud
    'logged_out': { th: 'ออกแล้ว ✓', en: 'Logged Out ✓' },
    'logged_in': { th: 'ยังไม่ออก', en: 'Still Logged In' },
    'not_applicable': { th: 'ไม่มี', en: 'N/A' },
    // Network
    'unlocked': { th: 'ปลดล็อคแล้ว', en: 'Unlocked' },
    'true_locked': { th: 'ติด True', en: 'True Locked' },
    'dtac_locked': { th: 'ติด DTAC', en: 'DTAC Locked' },
    'ais_locked': { th: 'ติด AIS', en: 'AIS Locked' },
    // Warranty
    'brand_warranty': { th: 'ประกันศูนย์', en: 'Brand Warranty' },
    'shop_warranty': { th: 'ประกันร้าน', en: 'Shop Warranty' },
    'no_warranty': { th: 'ไม่มีประกัน', en: 'No Warranty' },
    // Accessories
    'box': { th: 'กล่อง', en: 'Box' },
    'charger': { th: 'สายชาร์จ', en: 'Cable' },
    'adapter': { th: 'หัวชาร์จ', en: 'Adapter' },
    'earphones': { th: 'หูฟัง', en: 'Earphones' },
    'case': { th: 'เคส', en: 'Case' },
    'screen_protector': { th: 'ฟิล์มกันรอย', en: 'Screen Protector' },
}

// ============================================
// EDIT PAGE CONTENT
// ============================================

function EditMobileContent() {
    const router = useRouter()
    const params = useParams()
    const listingId = params.id as string

    const { language } = useLanguage()
    const { user } = useAuth()

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const [listing, setListing] = useState<UniversalListing | null>(null)
    const [formData, setFormData] = useState<Record<string, any>>({})
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [priceNegotiable, setPriceNegotiable] = useState(false)

    // Load listing data
    useEffect(() => {
        loadListing()
    }, [listingId, user])

    const loadListing = async () => {
        if (!listingId) return

        setLoading(true)
        setError(null)

        try {
            const data = await getListingById(listingId)
            if (!data) {
                setError(language === 'th' ? 'ไม่พบประกาศ' : 'Listing not found')
                return
            }

            // Check ownership
            if (user && data.seller_id !== user.uid) {
                setError(language === 'th' ? 'คุณไม่ใช่เจ้าของประกาศนี้' : 'Not authorized')
                return
            }

            setListing(data)
            setTitle(data.title || '')
            setPrice(data.price?.toString() || '')
            setPriceNegotiable(data.price_negotiable || false)
            setFormData(data.template_data || {})
        } catch (err) {
            console.error('Error loading listing:', err)
            setError(language === 'th' ? 'เกิดข้อผิดพลาด' : 'Error loading data')
        } finally {
            setLoading(false)
        }
    }

    const handleFieldChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }))
    }

    const handleMultiSelectToggle = (key: string, value: string) => {
        setFormData(prev => {
            const current = prev[key] || []
            const arr = Array.isArray(current) ? current : current.split(',').filter(Boolean)
            if (arr.includes(value)) {
                return { ...prev, [key]: arr.filter((v: string) => v !== value) }
            } else {
                return { ...prev, [key]: [...arr, value] }
            }
        })
    }

    const handleSave = async () => {
        if (!listing || !user) return

        setSaving(true)
        setError(null)

        try {
            await updateListing(listing.id, {
                title,
                price: Number(price),
                price_negotiable: priceNegotiable,
                template_data: formData
            }, user.uid)

            setSuccess(true)
            setTimeout(() => {
                router.push('/profile/listings')
            }, 1500)
        } catch (err: any) {
            console.error('Error saving:', err)
            setError(err.message || 'Failed to save')
        } finally {
            setSaving(false)
        }
    }

    const translateValue = (value: string) => {
        const trans = VALUE_TRANSLATIONS[value?.toLowerCase()]
        return trans ? trans[language as 'th' | 'en'] : value
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-400">{language === 'th' ? 'กำลังโหลด...' : 'Loading...'}</p>
                </div>
            </div>
        )
    }

    // Error state
    if (error && !listing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-white mb-2">{language === 'th' ? 'เกิดข้อผิดพลาด' : 'Error'}</h1>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Link
                        href="/profile/listings"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {language === 'th' ? 'กลับ' : 'Back'}
                    </Link>
                </div>
            </div>
        )
    }

    // Success state
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Check className="w-10 h-10 text-green-500" />
                    </div>
                    <h1 className="text-xl font-bold text-white mb-2">
                        {language === 'th' ? '✅ บันทึกสำเร็จ!' : '✅ Saved Successfully!'}
                    </h1>
                    <p className="text-gray-400">
                        {language === 'th' ? 'กำลังกลับไปหน้ารายการ...' : 'Redirecting...'}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-800 rounded-lg">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white">
                            {language === 'th' ? '📱 แก้ไขประกาศมือถือ' : '📱 Edit Mobile Listing'}
                        </h1>
                        <p className="text-sm text-gray-400">{listing?.listing_code}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
                {/* Preview Image */}
                {listing?.thumbnail_url && (
                    <div className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden">
                        <Image src={listing.thumbnail_url} alt={listing.title} fill className="object-cover" />
                    </div>
                )}

                {/* Title & Price */}
                <div className="bg-slate-800/50 rounded-2xl p-5 space-y-4">
                    <h2 className="font-bold text-white flex items-center gap-2">
                        📝 {language === 'th' ? 'หัวข้อและราคา' : 'Title & Price'}
                    </h2>

                    <div>
                        <label className="block text-sm text-gray-400 mb-2">
                            {language === 'th' ? 'หัวข้อประกาศ' : 'Title'}
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                {language === 'th' ? 'ราคา (บาท)' : 'Price (THB)'}
                            </label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex items-end">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={priceNegotiable}
                                    onChange={(e) => setPriceNegotiable(e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-600 bg-slate-700 text-purple-500"
                                />
                                <span className="text-white">{language === 'th' ? 'ต่อรองได้' : 'Negotiable'}</span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Template Sections */}
                {MOBILE_TEMPLATE.sections.map(section => (
                    <div key={section.id} className="bg-slate-800/50 rounded-2xl p-5 space-y-4">
                        <h2 className="font-bold text-white flex items-center gap-2">
                            {section.emoji} {language === 'th' ? section.title_th : section.title_en}
                        </h2>

                        <div className="grid gap-4">
                            {section.fields.map(field => (
                                <div key={field.key}>
                                    <label className="block text-sm text-gray-400 mb-2">
                                        {language === 'th' ? field.label_th : field.label_en}
                                        {field.importance === 'required' && <span className="text-red-400 ml-1">*</span>}
                                    </label>

                                    {field.type === 'text' && (
                                        <input
                                            type="text"
                                            value={formData[field.key] || ''}
                                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                                        />
                                    )}

                                    {field.type === 'select' && field.options && (
                                        <select
                                            value={formData[field.key] || ''}
                                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                                            className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-purple-500"
                                        >
                                            <option value="">{language === 'th' ? '-- เลือก --' : '-- Select --'}</option>
                                            {field.options.map(opt => (
                                                <option key={opt.value} value={opt.value}>
                                                    {language === 'th' ? opt.label_th : opt.label_en}
                                                </option>
                                            ))}
                                        </select>
                                    )}

                                    {field.type === 'multiselect' && field.options && (
                                        <div className="flex flex-wrap gap-2">
                                            {field.options.map(opt => {
                                                const currentArr = Array.isArray(formData[field.key])
                                                    ? formData[field.key]
                                                    : (formData[field.key] || '').split(',').filter(Boolean)
                                                const isSelected = currentArr.includes(opt.value)
                                                return (
                                                    <button
                                                        key={opt.value}
                                                        type="button"
                                                        onClick={() => handleMultiSelectToggle(field.key, opt.value)}
                                                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isSelected
                                                            ? 'bg-purple-500 text-white'
                                                            : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                                            }`}
                                                    >
                                                        {language === 'th' ? opt.label_th : opt.label_en}
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        {error}
                    </div>
                )}
            </main>

            {/* Save Button */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
                    >
                        {saving ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {language === 'th' ? 'กำลังบันทึก...' : 'Saving...'}
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {language === 'th' ? 'บันทึกการเปลี่ยนแปลง' : 'Save Changes'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ============================================
// EXPORT WITH SUSPENSE
// ============================================

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        }>
            <EditMobileContent />
        </Suspense>
    )
}

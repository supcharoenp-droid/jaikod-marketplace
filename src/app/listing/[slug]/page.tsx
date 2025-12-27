'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
    getListingBySlug,
    getListingByCode,
    incrementListingViews,
    markListingAsSold,
    closeListing,
    renewListing,
    deleteListing,
    UniversalListing,
    CATEGORY_LABELS,
    QUICK_FACTS_CONFIG,
    AI_CHAT_SUGGESTIONS
} from '@/lib/listings'
import { getProductBySlug } from '@/lib/products'
import {
    AIDealScoreCard,
    AISummaryCard,
    FinanceCalculatorCard,
    TrustTimelineCard,
    AIBuyerChecklist
} from '@/components/ai/AIIntelligenceCards'
import { EnhancedSellerCard, SellerOtherListings, SimilarListings } from '@/components/listing/SellerCards'
import { ReportButton } from '@/components/report'
import { OwnerActionsBar, OwnerBadge } from '@/components/listing/OwnerActions'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useChat } from '@/contexts/ChatContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { sendMessage as sendChatMessage } from '@/lib/firebase-chat'

// ===== HELPER FUNCTIONS =====

function formatPrice(price: number): string {
    return new Intl.NumberFormat('th-TH').format(price)
}

function formatThaiDate(date: Date): string {
    const thaiMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
    const thaiYear = date.getFullYear() + 543
    return `${date.getDate()} ${thaiMonths[date.getMonth()]} ${thaiYear}`
}

function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes} นาทีที่แล้ว`
    if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`
    if (days < 7) return `${days} วันก่อน`
    return formatThaiDate(date)
}

// Map category_type to category slug for navigation
function getCategorySlugFromType(categoryType: string): string {
    const typeToSlug: Record<string, string> = {
        'car': 'automotive',
        'motorcycle': 'automotive',
        'real_estate': 'real-estate',
        'land': 'real-estate',
        'mobile': 'mobiles',
        'computer': 'computers',
        'appliance': 'home-appliances',
        'fashion': 'fashion',
        'gaming': 'gaming',
        'camera': 'cameras',
        'amulet': 'amulets-collectibles',
        'pet': 'pets',
        'service': 'services',
        'sports': 'sports',
        'home': 'home-garden',
        'beauty': 'beauty-cosmetics',
        'baby': 'baby-kids',
        'book': 'books-education',
        'food': 'food-beverages',
        'health': 'health-supplements',
        'music': 'musical-instruments',
        'job': 'jobs-freelance',
        'ticket': 'tickets-vouchers',
        'other': 'others',
        'general': 'others',
    }
    return typeToSlug[categoryType] || 'others'
}

// ===== COMPONENTS =====

// Image Gallery Component with Location Badge
interface ImageGalleryProps {
    images: { url: string; order: number }[]
    thumbnail: string
    location?: {
        province: string
        amphoe?: string
    }
    meeting?: {
        province?: string
        amphoe?: string
        available_times?: string[]
    }
    distance?: number | null
}

function ImageGallery({ images, thumbnail, location, meeting, distance }: ImageGalleryProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // Filter out empty URLs and use thumbnail as fallback only if it's not empty
    const validImages = images.filter(img => img.url && img.url.trim() !== '')
    const allImages = validImages.length > 0
        ? validImages.sort((a, b) => a.order - b.order)
        : (thumbnail && thumbnail.trim() !== '' ? [{ url: thumbnail, order: 0 }] : [])

    const hasValidImage = allImages.length > 0 && allImages[currentIndex]?.url

    // Get meeting time display
    const getMeetingTimeDisplay = () => {
        if (!meeting?.available_times || meeting.available_times.length === 0) return null
        if (meeting.available_times.includes('anytime')) return 'ตลอดเวลา'
        if (meeting.available_times.length === 1) return meeting.available_times[0]
        return `${meeting.available_times.length} ช่วงเวลา`
    }
    const meetingTime = getMeetingTimeDisplay()

    return (
        <div className="relative">
            {/* Main Image */}
            <div
                className="relative aspect-[4/3] bg-slate-800 rounded-xl overflow-hidden cursor-pointer"
                onClick={() => hasValidImage && setIsFullscreen(true)}
            >
                {hasValidImage ? (
                    <Image
                        src={allImages[currentIndex].url}
                        alt="Listing image"
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                        <span className="text-6xl">📷</span>
                    </div>
                )}

                {/* Location Badge - Bottom Left (Like Dating Apps) */}
                {location && (
                    <div className="absolute bottom-4 left-4 z-10">
                        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-900/85 to-slate-900/85 backdrop-blur-md rounded-xl border border-white/10 shadow-xl">
                            <div className="w-9 h-9 bg-gradient-to-br from-pink-500 to-purple-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                                📍
                            </div>
                            <div className="flex flex-col">
                                {/* Location Line */}
                                <div className="flex items-center gap-1.5">
                                    <span className="text-white font-medium text-sm leading-tight">
                                        {location.amphoe || location.province}
                                    </span>
                                    {distance !== null && distance !== undefined && (
                                        <>
                                            <span className="text-gray-500 text-xs">•</span>
                                            <span className="text-green-400 text-xs font-medium">{distance} กม.</span>
                                        </>
                                    )}
                                </div>
                                {/* Meeting Time Line */}
                                {meetingTime && (
                                    <div className="flex items-center gap-1.5 mt-0.5">
                                        <span className="text-cyan-400 text-xs">🤝 นัดดูได้:</span>
                                        <span className="text-cyan-300 text-xs font-medium">{meetingTime}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Counter - Bottom Right */}
                {allImages.length > 0 && (
                    <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 rounded-full text-white text-sm">
                        {currentIndex + 1} / {allImages.length}
                    </div>
                )}

                {/* Navigation Arrows */}
                {allImages.length > 1 && (
                    <>
                        <button
                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => (i - 1 + allImages.length) % allImages.length) }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                        >
                            ◀
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(i => (i + 1) % allImages.length) }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70"
                        >
                            ▶
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
                    {allImages.map((img, i) => (
                        <button
                            key={i}
                            onClick={() => setCurrentIndex(i)}
                            className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === currentIndex ? 'border-purple-500' : 'border-transparent opacity-60 hover:opacity-100'}`}
                        >
                            <Image src={img.url} alt={`Thumbnail ${i + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {/* Fullscreen Modal */}
            {isFullscreen && hasValidImage && (
                <div
                    className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
                    onClick={() => setIsFullscreen(false)}
                >
                    <button className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300">✕</button>
                    <Image
                        src={allImages[currentIndex].url}
                        alt="Fullscreen image"
                        fill
                        className="object-contain p-4"
                    />
                </div>
            )}
        </div>
    )
}

// Value translations for Quick Facts (English values -> Thai labels)
const VALUE_TRANSLATIONS: Record<string, { th: string; en: string }> = {
    // Transmission
    'auto': { th: 'ออโต้', en: 'Auto' },
    'manual': { th: 'เกียร์ธรรมดา', en: 'Manual' },
    'cvt': { th: 'CVT', en: 'CVT' },
    'dct': { th: 'DCT', en: 'DCT' },
    // Fuel type
    'petrol': { th: 'เบนซิน', en: 'Petrol' },
    'diesel': { th: 'ดีเซล', en: 'Diesel' },
    'hybrid': { th: 'ไฮบริด', en: 'Hybrid' },
    'electric': { th: 'ไฟฟ้า', en: 'Electric' },
    'lpg': { th: 'แก๊ส LPG', en: 'LPG' },
    'ngv': { th: 'แก๊ส NGV', en: 'NGV' },
    // Color
    'white': { th: 'ขาว', en: 'White' },
    'black': { th: 'ดำ', en: 'Black' },
    'silver': { th: 'เงิน', en: 'Silver' },
    'gray': { th: 'เทา', en: 'Gray' },
    'red': { th: 'แดง', en: 'Red' },
    'blue': { th: 'น้ำเงิน', en: 'Blue' },
    'brown': { th: 'น้ำตาล', en: 'Brown' },
    'green': { th: 'เขียว', en: 'Green' },
    'gold': { th: 'ทอง', en: 'Gold' },
    'orange': { th: 'ส้ม', en: 'Orange' },
    'yellow': { th: 'เหลือง', en: 'Yellow' },
    'purple': { th: 'ม่วง', en: 'Purple' },
    'champagne': { th: 'แชมเปญ', en: 'Champagne' },
    // Body type
    'sedan': { th: 'ซีดาน', en: 'Sedan' },
    'suv': { th: 'SUV', en: 'SUV' },
    'hatchback': { th: 'แฮทช์แบ็ค', en: 'Hatchback' },
    'pickup': { th: 'กระบะ', en: 'Pickup' },
    'mpv': { th: 'MPV', en: 'MPV' },
    'coupe': { th: 'คูเป้', en: 'Coupe' },
    'van': { th: 'ตู้/Van', en: 'Van' },
    'convertible': { th: 'เปิดประทุน', en: 'Convertible' },
    'wagon': { th: 'แวกอน', en: 'Wagon' },
    'sport': { th: 'สปอร์ต', en: 'Sport' },
    // Owner hand
    '1': { th: 'มือหนึ่ง', en: '1st Owner' },
    '2': { th: 'มือสอง', en: '2nd Owner' },
    '3': { th: 'มือสาม', en: '3rd Owner' },
    '4+': { th: '4 มือขึ้นไป', en: '4+ Owners' },
    // Insurance
    'class1': { th: 'ชั้น 1', en: 'Class 1' },
    'class2': { th: 'ชั้น 2', en: 'Class 2' },
    'class2plus': { th: 'ชั้น 2+', en: 'Class 2+' },
    'class3': { th: 'ชั้น 3', en: 'Class 3' },
    'class3plus': { th: 'ชั้น 3+', en: 'Class 3+' },
    'none': { th: 'ไม่มี', en: 'None' },
    'expired': { th: 'หมดอายุ', en: 'Expired' },
    // Service history
    'dealer': { th: 'เข้าศูนย์ตลอด', en: 'Dealer Service' },
    'garage': { th: 'อู่ทั่วไป', en: 'Garage Service' },
    'mixed': { th: 'ผสม', en: 'Mixed' },
    'unknown': { th: 'ไม่ทราบ', en: 'Unknown' },
    // Registration
    'krungthep': { th: 'กรุงเทพฯ', en: 'Bangkok' },
    'original': { th: 'มีครบ', en: 'Original' },
    'transfer': { th: 'พร้อมโอน', en: 'Ready to Transfer' },

    // ===== MOBILE PHONE VALUES =====
    // iCloud Status
    'logged_out': { th: 'ออกแล้ว ✓', en: 'Logged Out ✓' },
    'logged_in': { th: 'ยังไม่ออก', en: 'Still Logged In' },
    'not_applicable': { th: 'ไม่มี', en: 'N/A' },

    // Network Status
    'unlocked': { th: 'ปลดล็อคแล้ว', en: 'Unlocked' },
    'locked': { th: 'ติดเครือข่าย', en: 'Locked' },
    'true_locked': { th: 'ติด True', en: 'True Locked' },
    'dtac_locked': { th: 'ติด DTAC', en: 'DTAC Locked' },
    'ais_locked': { th: 'ติด AIS', en: 'AIS Locked' },

    // Screen/Body Condition
    'like_new': { th: 'ใหม่มาก', en: 'Like New' },
    'excellent': { th: 'ดีเยี่ยม', en: 'Excellent' },
    'good': { th: 'ดี', en: 'Good' },
    'fair': { th: 'พอใช้', en: 'Fair' },
    'poor': { th: 'มีตำหนิ', en: 'Poor' },
    'cracked': { th: 'จอแตก', en: 'Cracked' },
    'scratched': { th: 'มีรอยขีดข่วน', en: 'Scratched' },

    // Battery Health
    '100': { th: '100%', en: '100%' },
    '95-99': { th: '95-99%', en: '95-99%' },
    '90-94': { th: '90-94%', en: '90-94%' },
    '85-89': { th: '85-89%', en: '85-89%' },
    '80-84': { th: '80-84%', en: '80-84%' },
    'below_80': { th: 'ต่ำกว่า 80%', en: 'Below 80%' },
    'replaced': { th: 'เปลี่ยนแบตใหม่', en: 'Battery Replaced' },

    // Warranty
    'brand_6m': { th: 'ประกันศูนย์ 6 เดือน', en: 'Brand 6 months' },
    'brand_12m': { th: 'ประกันศูนย์ 1 ปี', en: 'Brand 1 year' },
    'brand_warranty': { th: 'ประกันศูนย์', en: 'Brand Warranty' },
    'shop_warranty': { th: 'ประกันร้าน', en: 'Shop Warranty' },
    'no_warranty': { th: 'ไม่มีประกัน', en: 'No Warranty' },
    'warranty_expired': { th: 'ประกันหมด', en: 'Warranty Expired' },

    // Storage
    '32gb': { th: '32 GB', en: '32 GB' },
    '64gb': { th: '64 GB', en: '64 GB' },
    '128gb': { th: '128 GB', en: '128 GB' },
    '256gb': { th: '256 GB', en: '256 GB' },
    '512gb': { th: '512 GB', en: '512 GB' },
    '1tb': { th: '1 TB', en: '1 TB' },

    // RAM
    '4gb': { th: '4 GB', en: '4 GB' },
    '6gb': { th: '6 GB', en: '6 GB' },
    '8gb': { th: '8 GB', en: '8 GB' },
    '12gb': { th: '12 GB', en: '12 GB' },
    '16gb': { th: '16 GB', en: '16 GB' },

    // Accessories
    'box,charger,adapter': { th: 'กล่อง, สายชาร์จ, หัวชาร์จ', en: 'Box, Cable, Adapter' },
    'charger,adapter': { th: 'สายชาร์จ, หัวชาร์จ', en: 'Cable, Adapter' },
    'charger_only': { th: 'สายชาร์จเท่านั้น', en: 'Cable Only' },
    'full_box': { th: 'อุปกรณ์ครบกล่อง', en: 'Full Box' },
    'no_accessories': { th: 'ไม่มีอุปกรณ์', en: 'No Accessories' },

    // General Mobile Colors (supplement existing)
    'space_gray': { th: 'Space Gray', en: 'Space Gray' },
    'midnight': { th: 'Midnight', en: 'Midnight' },
    'starlight': { th: 'Starlight', en: 'Starlight' },
    'pink': { th: 'ชมพู', en: 'Pink' },
    'natural_titanium': { th: 'Natural Titanium', en: 'Natural Titanium' },
    'blue_titanium': { th: 'Blue Titanium', en: 'Blue Titanium' },
    'white_titanium': { th: 'White Titanium', en: 'White Titanium' },
    'black_titanium': { th: 'Black Titanium', en: 'Black Titanium' },
    'sierra_blue': { th: 'Sierra Blue', en: 'Sierra Blue' },
    'alpine_green': { th: 'Alpine Green', en: 'Alpine Green' },
    'deep_purple': { th: 'Deep Purple', en: 'Deep Purple' },
}

// Quick Facts Grid Component
function QuickFacts({ listing, language = 'th' }: { listing: UniversalListing; language?: 'th' | 'en' }) {
    const config = QUICK_FACTS_CONFIG[listing.category_type] || QUICK_FACTS_CONFIG.general
    const data = listing.template_data

    // Get first 10 facts that have values
    const facts = config.filter(fact => data[fact.key]).slice(0, 10)

    if (facts.length === 0) return null

    // Translate value based on language
    const translateValue = (rawValue: string | number): string => {
        const strValue = String(rawValue).toLowerCase()
        const translation = VALUE_TRANSLATIONS[strValue]
        if (translation) {
            return language === 'th' ? translation.th : translation.en
        }
        // If no translation found, return original value
        return String(rawValue)
    }

    return (
        <div className="bg-slate-800/50 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <span>📊</span>
                {language === 'th' ? 'ข้อมูลสำคัญ' : 'Quick Facts'}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {facts.map(fact => {
                    let value = data[fact.key]

                    // Format value based on type
                    if (fact.format === 'number') {
                        value = formatPrice(Number(value))
                    } else if (fact.format === 'currency') {
                        value = `฿${formatPrice(Number(value))}`
                    } else {
                        // Translate text values
                        value = translateValue(value)
                    }

                    // Add suffix
                    const suffix = language === 'th' ? fact.suffix_th : fact.suffix_en
                    if (suffix) value = `${value}${suffix}`

                    return (
                        <div key={fact.key} className="bg-slate-900/50 rounded-lg p-3 text-center">
                            <div className="text-xl mb-1">{fact.icon}</div>
                            <div className="text-xs text-gray-400 mb-1">
                                {language === 'th' ? fact.label_th : fact.label_en}
                            </div>
                            <div className="text-white font-medium text-sm truncate">{value}</div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

// Trust Signals Component
function TrustSignals({ listing, language = 'th' }: { listing: UniversalListing; language?: 'th' | 'en' }) {
    const data = listing.template_data
    const signals: { icon: string; text_th: string; text_en: string; active: boolean }[] = []

    // Car-specific signals
    if (listing.category_type === 'car') {
        if (listing.seller_info?.verified) signals.push({ icon: '✅', text_th: 'ผู้ขายยืนยันตัวตน', text_en: 'Verified Seller', active: true })
        if (data.registration === 'book_complete') signals.push({ icon: '✅', text_th: 'มีเล่มครบ', text_en: 'Complete Book', active: true })
        if (data.registration === 'tax_paid') signals.push({ icon: '✅', text_th: 'ภาษีจ่ายแล้ว', text_en: 'Tax Paid', active: true })
        if (data.spare_keys === '2_keys') signals.push({ icon: '✅', text_th: 'กุญแจสำรอง 2 ดอก', text_en: '2 Spare Keys', active: true })
        if (data.service_history === 'dealer') signals.push({ icon: '✅', text_th: 'เข้าศูนย์ตลอด', text_en: 'Always Serviced at Dealer', active: true })
        if (data.insurance_type === 'class1') signals.push({ icon: '✅', text_th: 'ประกันชั้น 1', text_en: 'Class 1 Insurance', active: true })
    }

    if (signals.length === 0) return null

    return (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4">
            <div className="flex flex-wrap gap-3">
                {signals.filter(s => s.active).map((signal, i) => (
                    <span key={i} className="flex items-center gap-1 text-green-400 text-sm">
                        <span>{signal.icon}</span>
                        <span>{language === 'th' ? signal.text_th : signal.text_en}</span>
                    </span>
                ))}
            </div>
        </div>
    )
}

// Province coordinates (centroids) for distance calculation
const PROVINCE_COORDINATES: Record<string, { lat: number; lng: number }> = {
    'กรุงเทพมหานคร': { lat: 13.7563, lng: 100.5018 },
    'กรุงเทพ': { lat: 13.7563, lng: 100.5018 },
    'นนทบุรี': { lat: 13.8622, lng: 100.5144 },
    'ปทุมธานี': { lat: 14.0208, lng: 100.5250 },
    'สมุทรปราการ': { lat: 13.5991, lng: 100.5998 },
    'สมุทรสาคร': { lat: 13.5475, lng: 100.2745 },
    'นครปฐม': { lat: 13.8199, lng: 100.0645 },
    'ชลบุรี': { lat: 13.3611, lng: 100.9847 },
    'ระยอง': { lat: 12.6814, lng: 101.2816 },
    'เชียงใหม่': { lat: 18.7883, lng: 98.9853 },
    'เชียงราย': { lat: 19.9107, lng: 99.8406 },
    'ภูเก็ต': { lat: 7.8804, lng: 98.3923 },
    'กระบี่': { lat: 8.0863, lng: 98.9063 },
    'สุราษฎร์ธานี': { lat: 9.1382, lng: 99.3217 },
    'ขอนแก่น': { lat: 16.4322, lng: 102.8236 },
    'อุดรธานี': { lat: 17.4156, lng: 102.7874 },
    'นครราชสีมา': { lat: 14.9799, lng: 102.0978 },
    'อยุธยา': { lat: 14.3532, lng: 100.5685 },
    'พระนครศรีอยุธยา': { lat: 14.3532, lng: 100.5685 },
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c)
}

// Location Card Component - Prominent display of product location
function LocationCard({ listing, language = 'th' }: { listing: UniversalListing; language?: 'th' | 'en' }) {
    const location = listing.location
    const meeting = listing.meeting
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [distance, setDistance] = useState<number | null>(null)
    const [locationError, setLocationError] = useState(false)

    // Get user's location on mount
    useEffect(() => {
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                },
                () => {
                    setLocationError(true)
                    // Fallback: try to get approximate location from localStorage or use Bangkok
                    const savedLocation = localStorage.getItem('jaikod_user_province')
                    if (savedLocation && PROVINCE_COORDINATES[savedLocation]) {
                        setUserLocation(PROVINCE_COORDINATES[savedLocation])
                    }
                }
            )
        }
    }, [])

    // Calculate distance when we have both locations
    useEffect(() => {
        if (userLocation) {
            // Get listing coordinates from province
            const listingProvince = location.province || meeting?.province
            const listingCoords = location.coordinates || (listingProvince ? PROVINCE_COORDINATES[listingProvince] : null)

            if (listingCoords) {
                const dist = calculateDistance(
                    userLocation.lat, userLocation.lng,
                    listingCoords.lat, listingCoords.lng
                )
                setDistance(dist)
            }
        }
    }, [userLocation, location, meeting])

    return (
        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-4">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                <span className="text-xl">📍</span>
                {language === 'th' ? 'สถานที่' : 'Location'}
            </h3>

            {/* Location Info */}
            <div className="space-y-3">
                {/* Province & District */}
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center text-lg">
                        🏠
                    </div>
                    <div className="flex-1">
                        <div className="text-white font-medium">
                            {location.amphoe && `${location.amphoe}, `}{location.province}
                        </div>
                        {location.landmark && (
                            <div className="text-gray-400 text-sm">ใกล้ {location.landmark}</div>
                        )}
                    </div>
                </div>

                {/* Distance Badge */}
                <div className="flex items-center gap-3 p-3 bg-slate-900/50 rounded-lg">
                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center text-lg">
                        🚗
                    </div>
                    <div className="flex-1">
                        {distance !== null ? (
                            <>
                                <div className="text-white font-medium">
                                    {language === 'th' ? `ห่างจากคุณประมาณ ${distance} กม.` : `~${distance} km from you`}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    {locationError
                                        ? (language === 'th' ? '(คำนวณจากจังหวัด)' : '(estimated from province)')
                                        : (language === 'th' ? '(จาก GPS ของคุณ)' : '(from your GPS)')
                                    }
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="text-gray-300 font-medium">
                                    {language === 'th' ? 'กำลังคำนวณระยะทาง...' : 'Calculating distance...'}
                                </div>
                                <button
                                    onClick={() => {
                                        if (navigator.geolocation) {
                                            navigator.geolocation.getCurrentPosition(
                                                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                                                () => setLocationError(true)
                                            )
                                        }
                                    }}
                                    className="text-blue-400 text-sm hover:underline"
                                >
                                    {language === 'th' ? 'คลิกเพื่ออนุญาตตำแหน่ง' : 'Click to enable location'}
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Meeting Point */}
                {meeting?.province && (
                    <div className="flex items-center gap-3 p-3 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center text-lg">
                            🤝
                        </div>
                        <div className="flex-1">
                            <div className="text-white font-medium">
                                {language === 'th' ? 'นัดดูสินค้าได้ที่' : 'Viewing Location'}
                            </div>
                            <div className="text-purple-300 text-sm">
                                {meeting.amphoe && `${meeting.amphoe}, `}{meeting.province}
                                {meeting.landmark && ` (ใกล้${meeting.landmark})`}
                            </div>
                        </div>
                    </div>
                )}

                {/* Available Times */}
                {meeting?.available_times && meeting.available_times.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {meeting.available_times.map((time, i) => (
                            <span key={i} className="px-3 py-1 bg-slate-800 rounded-full text-gray-300 text-xs">
                                {time === 'weekday' ? (language === 'th' ? '📅 วันธรรมดา' : '📅 Weekdays') :
                                    time === 'weekend' ? (language === 'th' ? '🌴 วันหยุด' : '🌴 Weekends') :
                                        time === 'anytime' ? (language === 'th' ? '⏰ ตลอดเวลา' : '⏰ Anytime') : time}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

// Seller Card Component
function SellerCard({ listing, language = 'th' }: { listing: UniversalListing; language?: 'th' | 'en' }) {
    const seller = listing.seller_info

    return (
        <div className="bg-slate-800/50 rounded-xl p-4">
            <div className="flex items-start gap-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold">
                    {seller.avatar ? (
                        <Image src={seller.avatar} alt={seller.name} width={56} height={56} className="rounded-full" />
                    ) : (
                        seller.name.charAt(0).toUpperCase()
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <h4 className="text-white font-semibold">{seller.name}</h4>
                        {seller.verified && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                                ✓ {language === 'th' ? 'ยืนยันตัวตนแล้ว' : 'Verified'}
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                        <span>⭐ {seller.trust_score / 20} ({seller.successful_sales} {language === 'th' ? 'รีวิว' : 'reviews'})</span>
                    </div>

                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                        <span>📍 {listing.location.province}</span>
                        <span>⚡ {language === 'th' ? 'ตอบภายใน' : 'Responds in'} {seller.response_time_minutes < 60
                            ? `${seller.response_time_minutes} ${language === 'th' ? 'นาที' : 'm'}`
                            : `${Math.round(seller.response_time_minutes / 60)} ${language === 'th' ? 'ชม.' : 'h'}`}
                        </span>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-4">
                <Link
                    href={`/shop/${listing.seller_id}`}
                    className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-white text-center text-sm transition-colors"
                >
                    {language === 'th' ? 'ดูประกาศอื่น' : 'View Listings'} ({seller.total_listings})
                </Link>
                <button className="px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 rounded-lg text-purple-400 text-sm transition-colors">
                    {language === 'th' ? 'ติดตาม' : 'Follow'}
                </button>
            </div>
        </div>
    )
}

// AI Insights Component
function AIInsights({ listing, language = 'th' }: { listing: UniversalListing; language?: 'th' | 'en' }) {
    const [expanded, setExpanded] = useState(false)
    const ai = listing.ai_content
    const suggestions = AI_CHAT_SUGGESTIONS[listing.category_type] || AI_CHAT_SUGGESTIONS.general

    return (
        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-4">
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full flex items-center justify-between"
            >
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <span>🤖</span>
                    <span>AI {language === 'th' ? 'วิเคราะห์' : 'Insights'}</span>
                </h3>
                <span className="text-gray-400">{expanded ? '▲' : '▼'}</span>
            </button>

            {expanded && (
                <div className="mt-4 space-y-4">
                    {/* Price Analysis */}
                    {ai.price_analysis && (
                        <div className="bg-slate-900/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <span>💡</span>
                                <span className="text-white">
                                    {language === 'th' ? 'ราคาเทียบตลาด' : 'Market Comparison'}:
                                    <span className={ai.price_analysis.price_position === 'below_market' ? 'text-green-400 ml-2' : 'text-yellow-400 ml-2'}>
                                        {ai.price_analysis.price_position === 'below_market' ? 'ถูกกว่า' : 'แพงกว่า'} {Math.abs(ai.price_analysis.percentage_diff)}%
                                    </span>
                                </span>
                            </div>
                            <div className="text-sm text-gray-400">
                                {language === 'th' ? 'ราคาเฉลี่ย' : 'Avg Price'}: ฿{formatPrice(ai.price_analysis.market_avg)}
                            </div>
                        </div>
                    )}

                    {/* Buyer Checklist */}
                    {ai.buyer_checklist && ai.buyer_checklist.length > 0 && (
                        <div className="bg-slate-900/50 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <span>⚠️</span>
                                <span className="text-white">{language === 'th' ? 'สิ่งที่ควรถาม' : 'Things to Ask'}:</span>
                            </div>
                            <ul className="text-sm text-gray-400 space-y-1">
                                {ai.buyer_checklist.slice(0, 3).map((item, i) => (
                                    <li key={i}>• {item}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Quick Questions */}
                    <div>
                        <div className="text-sm text-gray-400 mb-2">{language === 'th' ? 'ถามผู้ขายทันที' : 'Ask Seller'}:</div>
                        <div className="flex flex-wrap gap-2">
                            {suggestions.slice(0, 4).map((q, i) => (
                                <button
                                    key={i}
                                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-full text-gray-300 text-xs transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Share Modal Component
function ShareModal({ listing, isOpen, onClose }: { listing: UniversalListing; isOpen: boolean; onClose: () => void }) {
    const [copied, setCopied] = useState(false)

    if (!isOpen) return null

    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/listing/${listing.slug}`

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const shareChannels = [
        { id: 'line', icon: '💚', label: 'LINE', url: `https://line.me/R/msg/text/?${encodeURIComponent(listing.title + ' ' + shareUrl)}` },
        { id: 'facebook', icon: '📘', label: 'Facebook', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
        { id: 'twitter', icon: '🐦', label: 'X/Twitter', url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(listing.title)}` },
    ]

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">📤 แชร์</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                {/* Copy Link */}
                <div className="flex gap-2 mb-4">
                    <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-gray-300 text-sm"
                    />
                    <button
                        onClick={handleCopy}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${copied ? 'bg-green-500 text-white' : 'bg-purple-500 hover:bg-purple-600 text-white'
                            }`}
                    >
                        {copied ? '✓' : '📋'}
                    </button>
                </div>

                {/* Share Channels */}
                <div className="flex justify-center gap-4">
                    {shareChannels.map(channel => (
                        <a
                            key={channel.id}
                            href={channel.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col items-center gap-1 p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors"
                        >
                            <span className="text-2xl">{channel.icon}</span>
                            <span className="text-xs text-gray-300">{channel.label}</span>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}

// Make Offer Modal Component
function MakeOfferModal({
    listing,
    isOpen,
    onClose,
    onSubmit
}: {
    listing: UniversalListing
    isOpen: boolean
    onClose: () => void
    onSubmit?: (price: number, message: string) => Promise<void>
}) {
    const [offerPrice, setOfferPrice] = useState('')
    const [message, setMessage] = useState('')
    const [readyToTransfer, setReadyToTransfer] = useState(false)
    const [wantToView, setWantToView] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    if (!isOpen) return null

    const suggestedOffer = Math.round(listing.price * 0.9) // 10% off suggestion

    const handleSubmit = async () => {
        setIsSubmitting(true)
        try {
            // Build message with options
            let fullMessage = message
            if (readyToTransfer) fullMessage += ' (พร้อมโอนทันที)'
            if (wantToView) fullMessage += ' (ขอนัดดูก่อน)'

            if (onSubmit) {
                await onSubmit(Number(offerPrice) || suggestedOffer, fullMessage)
            }
            onClose()
        } catch (err) {
            console.error('Error submitting offer:', err)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-white font-semibold">💵 เสนอราคา</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                {/* Original Price */}
                <div className="text-gray-400 text-sm mb-2">
                    ราคาประกาศ: <span className="text-white font-medium">฿{formatPrice(listing.price)}</span>
                </div>

                {/* Offer Input */}
                <div className="mb-4">
                    <label className="text-gray-400 text-sm mb-1 block">ราคาที่คุณเสนอ</label>
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">฿</span>
                        <input
                            type="number"
                            value={offerPrice}
                            onChange={e => setOfferPrice(e.target.value)}
                            placeholder={formatPrice(suggestedOffer)}
                            className="w-full pl-8 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-lg font-medium focus:border-purple-500 focus:outline-none"
                        />
                    </div>
                    <div className="text-xs text-purple-400 mt-1">
                        💡 AI แนะนำ: ราคาที่มีโอกาสตกลง ฿{formatPrice(suggestedOffer)} - ฿{formatPrice(Math.round(listing.price * 0.95))}
                    </div>
                </div>

                {/* Options */}
                <div className="space-y-2 mb-4">
                    <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={readyToTransfer}
                            onChange={e => setReadyToTransfer(e.target.checked)}
                            className="rounded bg-slate-700 border-slate-600"
                        />
                        พร้อมโอนทันทีถ้าตกลง
                    </label>
                    <label className="flex items-center gap-2 text-gray-300 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={wantToView}
                            onChange={e => setWantToView(e.target.checked)}
                            className="rounded bg-slate-700 border-slate-600"
                        />
                        ขอนัดดูก่อน
                    </label>
                </div>

                {/* Message */}
                <div className="mb-4">
                    <label className="text-gray-400 text-sm mb-1 block">ข้อความถึงผู้ขาย (ถ้ามี)</label>
                    <textarea
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                        placeholder="สนใจมากครับ ถ้าลดได้จะโอนเลย..."
                        className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-gray-300 text-sm resize-none h-20 focus:border-purple-500 focus:outline-none"
                    />
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={!offerPrice}
                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-white font-semibold transition-all"
                >
                    ส่งข้อเสนอ
                </button>
            </div>
        </div>
    )
}

// Sticky Bottom Bar (Mobile)
function StickyBottomBar({
    listing,
    onChat,
    onOffer,
    onShare,
    onFavorite,
    isFavorited
}: {
    listing: UniversalListing
    onChat: () => void
    onOffer: () => void
    onShare: () => void
    onFavorite: () => void
    isFavorited: boolean
}) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 safe-area-pb">
            <div className="flex items-center gap-3">
                {/* Quick Actions */}
                <button
                    onClick={onFavorite}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isFavorited ? 'bg-red-500/20 text-red-400' : 'bg-slate-800 text-gray-400'
                        }`}
                >
                    {isFavorited ? '❤️' : '🤍'}
                </button>
                <button
                    onClick={onShare}
                    className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-gray-400"
                >
                    📤
                </button>

                {/* Price */}
                <div className="flex-1 text-center">
                    <div className="text-white font-bold text-lg">฿{formatPrice(listing.price)}</div>
                    {listing.price_negotiable && (
                        <div className="text-purple-400 text-xs">ต่อรองได้</div>
                    )}
                </div>

                {/* Main Actions */}
                <button
                    onClick={onChat}
                    className="px-4 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-white font-medium transition-colors"
                >
                    💬
                </button>
                <button
                    onClick={onOffer}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-medium transition-all"
                >
                    💵 เสนอราคา
                </button>
            </div>
        </div>
    )
}

// ===== MAIN PAGE COMPONENT =====

export default function ListingDetailPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string
    const { user } = useAuth()
    const { startConversation, selectConversation } = useChat()
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()

    const [listing, setListing] = useState<UniversalListing | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const [shareModalOpen, setShareModalOpen] = useState(false)
    const [offerModalOpen, setOfferModalOpen] = useState(false)
    const [isChatting, setIsChatting] = useState(false)

    // Distance calculation state
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
    const [userDistance, setUserDistance] = useState<number | null>(null)

    const { language } = useLanguage()

    // Check if current user is the owner
    const isOwner = user && listing && user.uid === listing.seller_id

    // Check wishlist status
    const isFavorited = listing ? isInWishlist(listing.id) : false

    // Handle chat with seller
    const handleChat = async () => {
        if (!listing) return
        if (!user) {
            router.push(`/login?redirect=/listing/${listing.slug}`)
            return
        }
        if (user.uid === listing.seller_id) return

        setIsChatting(true)
        try {
            const conversationId = await startConversation(
                {
                    id: listing.seller_id,
                    name: listing.seller_info.name,
                    avatar: listing.seller_info.avatar
                },
                listing.id,
                listing.title,
                listing.thumbnail_url
            )
            selectConversation(conversationId)
        } catch (err) {
            console.error('Error starting chat:', err)
        } finally {
            setIsChatting(false)
        }
    }

    // Handle wishlist toggle
    const handleFavoriteToggle = async () => {
        if (!listing) return
        if (!user) {
            router.push(`/login?redirect=/listing/${listing.slug}`)
            return
        }

        if (isFavorited) {
            await removeFromWishlist(listing.id)
        } else {
            await addToWishlist(listing as any)
        }
    }

    // Handle offer submit
    const handleOfferSubmit = async () => {
        if (!listing || !user) return

        const conversationId = await startConversation(
            {
                id: listing.seller_id,
                name: listing.seller_info.name,
                avatar: listing.seller_info.avatar
            },
            listing.id,
            listing.title,
            listing.thumbnail_url
        )

        // Send offer via chat
        await sendChatMessage(
            conversationId,
            user.uid,
            `เสนอราคา`,
            'offer',
            { offerAmount: listing.price * 0.9 }
        )

        selectConversation(conversationId)
        setOfferModalOpen(false)
    }

    // Owner action handlers
    const handleOwnerAction = async (action: string) => {
        if (!user || !listing) return

        try {
            switch (action) {
                case 'mark_sold':
                    if (confirm('ต้องการเปลี่ยนสถานะเป็น "ขายแล้ว"?')) {
                        await markListingAsSold(listing.id)
                        window.location.reload()
                    }
                    break
                case 'close':
                    if (confirm('ต้องการปิดการขายประกาศนี้?')) {
                        await closeListing(listing.id, user.uid)
                        window.location.reload()
                    }
                    break
                case 'renew':
                    await renewListing(listing.id, user.uid)
                    alert('ต่ออายุประกาศเรียบร้อย (30 วัน)')
                    window.location.reload()
                    break
                case 'delete':
                    if (confirm('ต้องการลบประกาศนี้?\n\nการลบจะไม่สามารถกู้คืนได้')) {
                        await deleteListing(listing.id, user.uid)
                        router.push('/profile/listings')
                    }
                    break
            }
        } catch (err: any) {
            alert('เกิดข้อผิดพลาด: ' + (err.message || 'Unknown error'))
        }
    }

    // Get user location on mount
    useEffect(() => {
        if (typeof navigator !== 'undefined' && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    })
                },
                () => {
                    // Fallback to stored province
                    const savedProvince = localStorage.getItem('jaikod_user_province')
                    if (savedProvince && PROVINCE_COORDINATES[savedProvince]) {
                        setUserLocation(PROVINCE_COORDINATES[savedProvince])
                    }
                }
            )
        }
    }, [])

    // Calculate distance when we have user location and listing
    useEffect(() => {
        if (userLocation && listing) {
            const listingProvince = listing.location?.province || listing.meeting?.province
            const listingCoords = listing.location?.coordinates || (listingProvince ? PROVINCE_COORDINATES[listingProvince] : null)

            if (listingCoords) {
                const dist = calculateDistance(
                    userLocation.lat, userLocation.lng,
                    listingCoords.lat, listingCoords.lng
                )
                setUserDistance(dist)
            }
        }
    }, [userLocation, listing])

    // Fetch listing
    useEffect(() => {
        async function fetchListing() {
            try {
                setLoading(true)

                // Decode URL-encoded slug (for Thai characters)
                const decodedSlug = decodeURIComponent(slug)
                console.log('🔍 Fetching listing with slug:', decodedSlug)

                let data = await getListingBySlug(decodedSlug)

                // Fallback: Extract listing code from slug suffix and try by code
                if (!data) {
                    // Slug format: "...-a00001" where "a00001" is the code suffix
                    const codeMatch = decodedSlug.match(/-([a-z][a-z0-9]{4,5})$/i)
                    if (codeMatch) {
                        const listingCode = `JK-${codeMatch[1].toUpperCase()}`
                        console.log('🔍 Trying listing code:', listingCode)
                        data = await getListingByCode(listingCode)
                    }
                }

                if (!data) {
                    // Fallback: Check if this is a legacy product slug
                    console.log('🔄 Checking legacy products collection for:', decodedSlug)
                    const legacyProduct = await getProductBySlug(decodedSlug)

                    if (legacyProduct) {
                        // Found in legacy products - redirect to /product/[slug]
                        console.log('🔀 Found in legacy products, redirecting to /product/', decodedSlug)
                        router.replace(`/product/${decodedSlug}`)
                        return
                    }

                    console.error('❌ Listing not found for slug:', decodedSlug)
                    setError('ไม่พบประกาศ')
                    return
                }

                console.log('✅ Found listing:', data.title)
                setListing(data)

                // Increment views
                await incrementListingViews(data.id)
            } catch (err) {
                console.error('Error fetching listing:', err)
                setError('เกิดข้อผิดพลาด')
            } finally {
                setLoading(false)
            }
        }

        if (slug) {
            fetchListing()
        }
    }, [slug])

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-400">กำลังโหลด...</p>
                </div>
            </div>
        )
    }

    // Error State
    if (error || !listing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😢</div>
                    <h1 className="text-2xl font-bold text-white mb-2">ไม่พบประกาศ</h1>
                    <p className="text-gray-400 mb-4">{error}</p>
                    <Link href="/" className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-white font-medium">
                        กลับหน้าแรก
                    </Link>
                </div>
            </div>
        )
    }

    const categoryInfo = CATEGORY_LABELS[listing.category_type]

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 pb-24 lg:pb-8">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/" className="hover:text-white">🏠 JaiKod</Link>
                        <span>/</span>
                        <Link href={`/category/${getCategorySlugFromType(listing.category_type)}`} className="hover:text-white">
                            {categoryInfo.emoji} {language === 'th' ? categoryInfo.th : categoryInfo.en}
                        </Link>
                        <span>/</span>
                        <span className="text-gray-300 truncate">{listing.title}</span>
                    </div>
                </div>
            </header>

            {/* Owner Actions Bar - Only visible to owner */}
            {isOwner && (
                <div className="max-w-7xl mx-auto px-4 mt-4">
                    <OwnerActionsBar
                        listing={listing}
                        isOwner={true}
                        language={language}
                        onAction={handleOwnerAction}
                    />
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Left Column - Images */}
                    <div className="lg:col-span-3 space-y-4">
                        <ImageGallery
                            images={listing.images}
                            thumbnail={listing.thumbnail_url}
                            location={listing.location}
                            meeting={listing.meeting}
                            distance={userDistance}
                        />

                        {/* Description */}
                        <div className="bg-slate-800/50 rounded-xl p-4">
                            <h3 className="text-white font-semibold mb-3">📝 รายละเอียด</h3>
                            <div className="text-gray-300 text-sm whitespace-pre-wrap">
                                {listing.ai_content.marketing_copy.full_text || listing.template_data.additional_description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                            </div>
                        </div>

                        {/* Quick Facts */}
                        <QuickFacts listing={listing} language={language} />

                        {/* Known Issues (Mobile) */}
                        {listing.category_type === 'mobile' && listing.template_data.known_issues && Array.isArray(listing.template_data.known_issues) && listing.template_data.known_issues.length > 0 && !listing.template_data.known_issues.includes('none') && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                    <span>⚠️</span>
                                    {language === 'th' ? 'ปัญหาที่ผู้ขายแจ้ง' : 'Known Issues'}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {(listing.template_data.known_issues as string[]).map((issue, i) => {
                                        const issueLabels: Record<string, { th: string; en: string; icon: string }> = {
                                            'battery_drain': { th: 'แบตหมดไว', en: 'Battery drains fast', icon: '🔋' },
                                            'speaker': { th: 'ลำโพงมีปัญหา', en: 'Speaker issue', icon: '🔊' },
                                            'camera': { th: 'กล้องมีปัญหา', en: 'Camera issue', icon: '📷' },
                                            'faceid': { th: 'Face ID ไม่ทำงาน', en: 'Face ID not working', icon: '👤' },
                                            'wifi': { th: 'WiFi/BT มีปัญหา', en: 'WiFi/BT issue', icon: '📶' },
                                            'charging': { th: 'ชาร์จมีปัญหา', en: 'Charging issue', icon: '⚡' },
                                            'screen_burn': { th: 'จอ Burn-in', en: 'Screen burn-in', icon: '🔥' },
                                        }
                                        const label = issueLabels[issue]
                                        return label ? (
                                            <span key={i} className="px-3 py-1.5 bg-yellow-500/20 text-yellow-300 text-sm rounded-full flex items-center gap-1">
                                                <span>{label.icon}</span>
                                                {language === 'th' ? label.th : label.en}
                                            </span>
                                        ) : null
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Trust Signals */}
                        <TrustSignals listing={listing} language={language} />
                    </div>

                    {/* Right Column - Info & Actions */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Listing Info Card */}
                        <div className="bg-slate-800 rounded-xl p-4 shadow-xl">
                            {/* Meta - Show Listing Code prominently */}
                            <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                                <div className="flex items-center gap-2">
                                    <span>📅 {formatRelativeTime(listing.created_at)}</span>
                                    <OwnerBadge isOwner={!!isOwner} language={language} />
                                </div>
                                <button
                                    onClick={async () => {
                                        const code = listing.listing_code || listing.listing_number
                                        await navigator.clipboard.writeText(code)
                                        // Could add toast notification here
                                    }}
                                    className="flex items-center gap-1 px-2 py-1 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors group"
                                    title="คลิกเพื่อคัดลอกรหัสประกาศ"
                                >
                                    <span className="text-purple-400 font-mono text-xs">
                                        {listing.listing_code || listing.listing_number}
                                    </span>
                                    <span className="text-gray-500 group-hover:text-purple-400 transition-colors">📋</span>
                                </button>
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-white mb-2">{listing.title}</h1>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {listing.template_data.condition && (
                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full">
                                        ⭐ {listing.template_data.condition}
                                    </span>
                                )}
                                {listing.template_data.owner_hand && (
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">
                                        👤 มือ {listing.template_data.owner_hand}
                                    </span>
                                )}
                            </div>

                            {/* Price */}
                            <div className="mb-4">
                                <div className="text-3xl font-bold text-white">฿{formatPrice(listing.price)}</div>
                                {listing.price_negotiable && (
                                    <div className="text-purple-400 text-sm">💰 ต่อรองได้</div>
                                )}
                                {listing.template_data.finance_available === 'finance_ok' && (
                                    <div className="text-green-400 text-sm">📊 ผ่อนได้</div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                <span>👁️ {listing.stats.views} {language === 'th' ? 'ดู' : 'views'}</span>
                                <span>❤️ {listing.stats.favorites}</span>
                                <span>📤 {listing.stats.shares}</span>
                            </div>

                            {/* Desktop Actions */}
                            <div className="hidden lg:flex gap-3 mb-4">
                                <button
                                    onClick={handleFavoriteToggle}
                                    className={`flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${isFavorited ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                        }`}
                                >
                                    {isFavorited ? '❤️ บันทึกแล้ว' : '🤍 บันทึก'}
                                </button>
                                <button
                                    onClick={() => setShareModalOpen(true)}
                                    className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-gray-300 font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    📤 แชร์
                                </button>
                            </div>

                            <div className="hidden lg:block space-y-3">
                                <button
                                    onClick={handleChat}
                                    disabled={isChatting}
                                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    {isChatting ? (
                                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    ) : (
                                        '💬'
                                    )}
                                    แชทกับผู้ขาย
                                </button>
                                <button
                                    onClick={() => setOfferModalOpen(true)}
                                    className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    💵 เสนอราคา
                                </button>
                            </div>
                        </div>

                        {/* Non-sticky content wrapper - prevents overlap with sticky card */}
                        <div className="relative z-0 space-y-4">
                            {/* === PRIORITY 1: SELLER PROFILE (Most Important for Trust) === */}
                            <EnhancedSellerCard
                                seller={{ ...listing.seller_info, id: listing.seller_id }}
                                sellerId={listing.seller_id}
                                location={listing.location.province}
                                language={language}
                            />

                            {/* === PRIORITY 2: AI DEAL ANALYSIS === */}
                            <AIDealScoreCard listing={listing} language={language} />

                            {/* === PRIORITY 3: SELLER'S OTHER LISTINGS === */}
                            {listing.seller_info.total_listings > 1 && (
                                <SellerOtherListings
                                    sellerId={listing.seller_id}
                                    currentListingId={listing.id}
                                    sellerName={listing.seller_info.name}
                                    listings={[]} // TODO: Fetch from API
                                    language={language}
                                />
                            )}

                            {/* === PRIORITY 4: AI SUMMARY (Quick Overview) === */}
                            <AISummaryCard listing={listing} language={language} />

                            {/* === PRIORITY 5: FINANCE CALCULATOR (For Vehicles) === */}
                            {(listing.category_type === 'car' || listing.category_type === 'motorcycle') && (
                                <FinanceCalculatorCard price={listing.price} language={language} />
                            )}

                            {/* === PRIORITY 6: SIMILAR ITEMS === */}
                            <SimilarListings
                                categoryType={listing.category_type}
                                currentListingId={listing.id}
                                listings={[]} // TODO: Fetch from API
                                language={language}
                            />

                            {/* === PRIORITY 7: TRUST TIMELINE === */}
                            <TrustTimelineCard listing={listing} language={language} />

                            {/* === PRIORITY 8: AI BUYER CHECKLIST === */}
                            <AIBuyerChecklist listing={listing} language={language} />

                            {/* === REPORT SECTION === */}
                            <div className="flex items-center justify-center py-2">
                                <ReportButton
                                    targetType="listing"
                                    targetId={listing.id}
                                    targetTitle={listing.title}
                                    reporterId="anonymous" // TODO: Get from auth
                                    variant="text"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Bar */}
            <StickyBottomBar
                listing={listing}
                onChat={handleChat}
                onOffer={() => setOfferModalOpen(true)}
                onShare={() => setShareModalOpen(true)}
                onFavorite={handleFavoriteToggle}
                isFavorited={isFavorited}
            />

            {/* Modals */}
            <ShareModal listing={listing} isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
            <MakeOfferModal
                listing={listing}
                isOpen={offerModalOpen}
                onClose={() => setOfferModalOpen(false)}
                onSubmit={async (price, message) => {
                    if (!user) {
                        router.push(`/login?redirect=/listing/${listing.slug}`)
                        return
                    }

                    const conversationId = await startConversation(
                        {
                            id: listing.seller_id,
                            name: listing.seller_info.name,
                            avatar: listing.seller_info.avatar
                        },
                        listing.id,
                        listing.title,
                        listing.thumbnail_url
                    )

                    await sendChatMessage(
                        conversationId,
                        user.uid,
                        message || `เสนอราคา ฿${price.toLocaleString()}`,
                        'offer',
                        { offerAmount: price }
                    )

                    selectConversation(conversationId)
                }}
            />
        </div>
    )
}

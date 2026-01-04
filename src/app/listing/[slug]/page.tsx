'use client'
// Force recompile: 2025-12-30T07:13:00+07:00
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Eye, Heart, Share2, Edit, MessageCircle, DollarSign } from 'lucide-react'
import {
    getListingBySlug,
    getListingByCode,
    getListingById,
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
import { getSellerListings, getSimilarListings, SellerListing } from '@/lib/seller'

import {
    AIDealScoreCard,
    FinanceCalculatorCard,
    TrustTimelineCard,
    AIBuyerChecklist
} from '@/components/ai/AIIntelligenceCards'
import { EnhancedSellerCard, SellerOtherListings, SimilarListings } from '@/components/listing/SellerCards'
import { ReportButton } from '@/components/report'
import { OwnerActionsBar, OwnerBadge } from '@/components/listing/OwnerActions'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useWishlist } from '@/contexts/WishlistContext'
import { getSmartDateDisplay } from '@/lib/utils/timeUtils'
import { useNotifications } from '@/contexts/NotificationContext'
import { t } from '@/lib/translations'

// AI Commerce Engine Components
import AIInstantSummary from '@/components/listing/AIInstantSummary'
import AIFairPriceMeter from '@/components/listing/AIFairPriceMeter'
import SmartCTAButton from '@/components/listing/SmartCTAButton'
import AINegotiationAssistant from '@/components/listing/AINegotiationAssistant'
import AIComparisonLock from '@/components/listing/AIComparisonLock'
import ActivityBadge from '@/components/common/ActivityBadge'
import { useBuyerIntent } from '@/hooks/useBuyerIntent'
import ListingInfoCardV2 from '@/components/listing/ListingInfoCardV2'
import UnifiedListingStats from '@/components/listing/UnifiedListingStats'
import MakeOfferModal from '@/components/listing/MakeOfferModal'

// ===== HELPER FUNCTIONS =====

// Helper to get formatted price
function formatPrice(price: number): string {
    return new Intl.NumberFormat('th-TH').format(price)
}

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
                className="relative aspect-square sm:aspect-[4/3] bg-slate-800 rounded-xl overflow-hidden cursor-pointer w-full"
                onClick={() => hasValidImage && setIsFullscreen(true)}
            >
                {hasValidImage ? (
                    <Image
                        src={allImages[currentIndex].url}
                        alt="Listing image"
                        fill
                        className="object-contain sm:object-cover"
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

// === UTILS & CONSTANTS ===

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

function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371 // km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return Math.round(R * c)
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


// Sticky Bottom Bar (Mobile)
function StickyBottomBar({
    listing,
    onChat,
    onOffer,
    onShare,
    onFavorite,
    isFavorited,
    isOwner
}: {
    listing: UniversalListing
    onChat: () => void
    onOffer: () => void
    onShare: () => void
    onFavorite: () => void
    isFavorited: boolean
    isOwner: boolean
}) {
    // OWNER VIEW
    if (isOwner) {
        return (
            <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-purple-500/20 px-4 py-3 safe-area-pb">
                <div className="flex items-center justify-between gap-3">
                    {/* Stats Summary */}
                    <div className="flex-1">
                        <div className="text-white font-medium text-sm flex items-center gap-2">
                            <span>ประกาศของคุณ</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] border ${listing.status === 'active' ? 'bg-green-500/20 text-green-400 border-green-500/30' :
                                listing.status === 'sold' ? 'bg-slate-700 text-gray-400 border-slate-600' :
                                    'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                                }`}>
                                {listing.status === 'active' ? 'Active' : listing.status === 'sold' ? 'Sold' : listing.status}
                            </span>
                        </div>
                        <div className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {listing.stats.views}</span>
                            <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {listing.stats.favorites}</span>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onShare}
                            className="p-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-gray-300 border border-slate-700 transition-colors"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <Link
                            href={`/sell/edit/${listing.id}`}
                            className="flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-white font-medium shadow-lg shadow-blue-500/25 transition-all"
                        >
                            <Edit className="w-4 h-4" />
                            <span>แก้ไข</span>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }

    // BUYER VIEW
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 safe-area-pb">
            <div className="flex items-center gap-3">
                {/* Quick Actions */}
                <button
                    onClick={onFavorite}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${isFavorited ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-slate-800 text-gray-400 border border-slate-700'
                        }`}
                >
                    {isFavorited ? <Heart className="w-6 h-6 fill-current" /> : <Heart className="w-6 h-6" />}
                </button>
                <button
                    onClick={onShare}
                    className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-gray-400 border border-slate-700"
                >
                    <Share2 className="w-6 h-6" />
                </button>

                {/* Price (if space allows, otherwise hidden on very small screens) */}
                <div className="hidden sm:block flex-1 text-center">
                    <div className="text-white font-bold text-lg">฿{formatPrice(listing.price)}</div>
                    {listing.price_negotiable && (
                        <div className="text-purple-400 text-xs">ต่อรองได้</div>
                    )}
                </div>

                {/* Main Actions */}
                <div className="flex-1 flex gap-2">
                    <button
                        onClick={onChat}
                        className="flex-1 px-3 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-medium shadow-lg shadow-purple-500/25 transition-all flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span className="text-sm">แชท</span>
                    </button>
                    <button
                        onClick={onOffer}
                        className="flex-1 px-3 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium border border-slate-600 transition-all flex items-center justify-center gap-2"
                    >
                        <DollarSign className="w-5 h-5 text-green-400" />
                        <span className="text-sm">เสนอราคา</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

// ===== MAIN PAGE COMPONENT =====

export default function ListingDetailPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string
    const { language } = useLanguage()
    const { user } = useAuth()
    const { sendNotification } = useNotifications()
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

    // Related listings state (fetched from API)
    const [sellerOtherListings, setSellerOtherListings] = useState<SellerListing[]>([])
    const [similarItems, setSimilarItems] = useState<SellerListing[]>([])


    // Check if current user is the owner
    const isOwner = user && listing && user.uid === listing.seller_id

    // AI Buyer Intent Detection
    const { intent, trackEvent } = useBuyerIntent({
        productId: listing?.id || '',
        productPrice: listing?.price,
        enabled: !!listing && !isOwner
    })

    // Check wishlist status
    const isFavorited = listing ? isInWishlist(listing.id) : false

    // Handle chat with seller - Redirect to /chat page
    const handleChat = async () => {
        if (!listing) return
        if (!user) {
            router.push(`/login?redirect=/listing/${listing.slug}`)
            return
        }
        if (user.uid === listing.seller_id) return

        setIsChatting(true)
        try {
            // Redirect to /chat page with params
            const params = new URLSearchParams({
                seller: listing.seller_id,
                listing: listing.id,
                title: listing.title,
                price: listing.price.toString()
            })
            if (listing.thumbnail_url) {
                params.append('image', listing.thumbnail_url)
            }
            router.push(`/chat?${params.toString()}`)
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
            const success = await addToWishlist(listing as any)
            if (success) {
                // Optional: Send notification or show toast
                // sendNotification(
                //     user.uid,
                //     'FAVORITE',
                //     t('messages', 'saved_successfully', language as 'th' | 'en'),
                //     listing.title
                // )
            }
        }
    }

    // Handle offer submit - Redirect to /chat page with offer
    const handleOfferSubmit = async (offerAmount?: number) => {
        if (!listing || !user) {
            router.push(`/login?redirect=/listing/${listing?.slug}`)
            return
        }

        // Redirect to /chat page with params and offer
        const params = new URLSearchParams({
            seller: listing.seller_id,
            listing: listing.id,
            title: listing.title,
            price: listing.price.toString(),
            offer: (offerAmount || Math.floor(listing.price * 0.9)).toString()
        })
        if (listing.thumbnail_url) {
            params.append('image', listing.thumbnail_url)
        }
        router.push(`/chat?${params.toString()}`)
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
                    // Fallback: Check if slug looks like a Firestore Document ID (20 chars alphanumeric)
                    const isDocumentId = /^[a-zA-Z0-9]{20,}$/.test(decodedSlug)
                    if (isDocumentId) {
                        console.log('🔍 Slug looks like Document ID, trying getListingById:', decodedSlug)
                        data = await getListingById(decodedSlug)
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

                // First, fetch related listings to get accurate seller data
                // (Do this BEFORE setListing to avoid race conditions)
                let sellerListings: SellerListing[] = []
                let similar: SellerListing[] = []

                console.warn('🚀 START: Fetching related listings for seller:', data.seller_id)
                try {
                    const [fetchedSellerListings, fetchedSimilar] = await Promise.all([
                        getSellerListings(data.seller_id, data.id, 6),
                        getSimilarListings(data.category_type, data.id, 4)
                    ])
                    sellerListings = fetchedSellerListings
                    similar = fetchedSimilar
                    console.warn('✅ Got sellerListings:', sellerListings.length, 'similar:', similar.length)

                    // FIX: Update seller_info.total_listings with real count
                    // sellerListings excludes current listing, so add 1
                    const realListingsCount = sellerListings.length + 1
                    data.seller_info.total_listings = realListingsCount
                    console.warn(`📊 Updated seller total_listings to ${realListingsCount}`)
                } catch (relatedErr) {
                    console.error('Error fetching related listings:', relatedErr)
                    // Non-critical, continue loading
                }

                // NOW set listing with all data ready (including updated total_listings)
                setListing(data)
                setSellerOtherListings(sellerListings)
                setSimilarItems(similar)

                // Increment views (non-blocking)
                try {
                    await incrementListingViews(data.id)
                    console.log('👁️ Views incremented')
                } catch (viewErr) {
                    console.error('Error incrementing views:', viewErr)
                }

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
    }, [slug, router])

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
                                {listing.ai_content.marketing_copy.full_text || listing.template_data.description || listing.template_data.additional_description || 'ไม่มีรายละเอียดเพิ่มเติม'}
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


                        {/* AI Instant Summary - Amazon Style */}
                        <AIInstantSummary
                            product={{
                                id: listing.id,
                                title: listing.title,
                                description: listing.ai_content?.marketing_copy?.full_text,
                                price: listing.price,
                                category_id: listing.category_id || 0,
                                condition: listing.template_data?.condition,
                                images: listing.images?.map(img => img.url),
                                specs: listing.template_data,
                                seller_id: listing.seller_id
                            }}
                        />
                    </div>

                    {/* Right Column - Info & Actions */}
                    <div className="lg:col-span-2 space-y-4 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:sticky lg:top-20">
                        {/* Listing Info Card - Standardized V2 */}
                        <ListingInfoCardV2
                            title={listing.title}
                            price={listing.price}
                            priceNegotiable={listing.price_negotiable}
                            listingCode={listing.listing_code || listing.listing_number}
                            createdAt={listing.created_at instanceof Date ? listing.created_at : (listing.created_at as any).toDate ? (listing.created_at as any).toDate() : new Date(listing.created_at)}
                            updatedAt={listing.updated_at instanceof Date ? listing.updated_at : (listing.updated_at as any)?.toDate ? (listing.updated_at as any).toDate() : (listing.updated_at ? new Date(listing.updated_at) : undefined)}
                            views={listing.stats.views}
                            favorites={listing.stats.favorites}
                            location={{
                                province: listing.location.province,
                                amphoe: listing.location.amphoe
                            }}
                            categoryEmoji={CATEGORY_LABELS[listing.category_type]?.emoji || '📦'}
                            categoryLabel={language === 'th' ? CATEGORY_LABELS[listing.category_type]?.th : CATEGORY_LABELS[listing.category_type]?.en}
                            isFavorited={isFavorited}
                            isOwner={!!isOwner}
                            language={language as 'th' | 'en'}
                            onChat={handleChat}
                            onOffer={() => setOfferModalOpen(true)}
                            onShare={() => setShareModalOpen(true)}
                            onFavorite={handleFavoriteToggle}
                        />

                        {/* === UNIFIED STATS (Single Source of Truth) === */}
                        <UnifiedListingStats
                            views={listing.stats.views}
                            favorites={listing.stats.favorites}
                            shares={listing.stats.shares || 0}
                            trending={listing.stats.views > 500}
                            language={language as 'th' | 'en'}
                        />

                        {/* === OWNER QUICK ACTIONS (Visible only to owner) === */}
                        {isOwner && (
                            <div className="bg-slate-800/80 rounded-xl p-4 border border-purple-500/30 backdrop-blur-sm">
                                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                    <span className="text-xl">⚡</span>
                                    {language === 'th' ? 'จัดการประกาศ' : 'Manage Listing'}
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <button className="py-2 bg-slate-700/50 hover:bg-slate-700 text-gray-300 rounded-lg text-xs transition-colors">
                                        {language === 'th' ? 'ดูสถิติเชิงลึก' : 'View Insights'}
                                    </button>
                                    <Link href={`/sell/edit/${listing.id}`} className="py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 rounded-lg text-xs font-medium text-center transition-colors">
                                        {language === 'th' ? 'แก้ไขประกาศ' : 'Edit Listing'}
                                    </Link>
                                </div>
                            </div>
                        )}

                        {/* Known Issues (Mobile) - Keep prominent next to Price/Info */}
                        {listing.category_type === 'mobile' && listing.template_data.known_issues && Array.isArray(listing.template_data.known_issues) && listing.template_data.known_issues.length > 0 && !listing.template_data.known_issues.includes('none') && (
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                    <span>⚠️</span>
                                    {language === 'th' ? 'ประเด็นสำคัญที่ควรทราบ' : 'Key Things to Note'}
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

                        {/* Non-sticky content wrapper - prevents overlap with sticky card */}
                        <div className="relative z-0 space-y-4">
                            {/* === PRIORITY 1: SELLER PROFILE (Most Important for Trust) === */}
                            {/* Note: Trust Score is now integrated into EnhancedSellerCard */}
                            <EnhancedSellerCard
                                seller={{ ...listing.seller_info, id: listing.seller_id }}
                                sellerId={listing.seller_id}
                                location={listing.location.province}
                                language={language}
                                currentListingId={listing.id}
                            />

                            {/* === NEW: AI Negotiation Assistant (If negotiable and not owner) === */}
                            {!isOwner && listing.price_negotiable && (
                                <AINegotiationAssistant
                                    askingPrice={listing.price}
                                    productTitle={listing.title}
                                    onSendOffer={async (price, message) => {
                                        // Handle offer submission
                                        console.log('Offer:', price, message)
                                        setOfferModalOpen(true)
                                    }}
                                />
                            )}

                            {/* === PRIORITY 2: AI DEAL ANALYSIS (Not for owner) === */}
                            {!isOwner && <AIDealScoreCard listing={listing} language={language} />}

                            {/* === PRIORITY 3: SELLER'S OTHER LISTINGS === */}
                            {sellerOtherListings.length > 0 && (
                                <SellerOtherListings
                                    sellerId={listing.seller_id}
                                    currentListingId={listing.id}
                                    sellerName={listing.seller_info.name}
                                    listings={sellerOtherListings}
                                    language={language}
                                />
                            )}


                            {/* === PRIORITY 5: FINANCE CALCULATOR (For Vehicles) === */}
                            {(listing.category_type === 'car' || listing.category_type === 'motorcycle') && (
                                <FinanceCalculatorCard price={listing.price} language={language} />
                            )}

                            {/* === PRIORITY 6: SIMILAR ITEMS === */}
                            {similarItems.length > 0 && (
                                <SimilarListings
                                    categoryType={listing.category_type}
                                    currentListingId={listing.id}
                                    listings={similarItems}
                                    language={language}
                                />
                            )}

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
                                    reporterId={user?.uid || 'anonymous'}
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
                isOwner={!!isOwner}
            />

            {/* Modals */}
            <ShareModal listing={listing} isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} />
            <MakeOfferModal
                listingTitle={listing.title}
                currentPrice={listing.price}
                isOpen={offerModalOpen}
                onClose={() => setOfferModalOpen(false)}
                onSubmit={async (price, message) => {
                    if (!user) {
                        router.push(`/login?redirect=/listing/${listing.slug}`)
                        return
                    }

                    // Redirect to /chat page with offer
                    const params = new URLSearchParams({
                        seller: listing.seller_id,
                        listing: listing.id,
                        title: listing.title,
                        price: listing.price.toString(),
                        offer: price.toString()
                    })
                    if (listing.thumbnail_url) {
                        params.append('image', listing.thumbnail_url)
                    }
                    router.push(`/chat?${params.toString()}`)
                    setOfferModalOpen(false)
                }}
            />

            {/* AI Comparison Lock - Anti-Bounce Modal */}
            <AIComparisonLock
                productId={listing.id}
                productTitle={listing.title}
                productPrice={listing.price}
                productThumbnail={listing.thumbnail_url}
                intentScore={intent.score}
                similarProducts={[]}
                enabled={!isOwner && intent.score >= 30}
                onStay={() => {
                    trackEvent('wishlist_add')
                }}
            />
        </div>
    )
}

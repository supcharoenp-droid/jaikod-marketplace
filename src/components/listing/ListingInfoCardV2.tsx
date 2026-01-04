/**
 * LISTING INFO CARD V2
 * 
 * แสดงข้อมูลหลักของ Listing
 * - ราคา + สถานะต่อรอง
 * - วัน เดือน ปี เวลาที่โพส (สวยงาม)
 * - Listing Code
 * - Quick Actions (Chat, Offer, Buy)
 * 
 * @version 2.0.0
 */

'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
    MessageCircle, Heart, Share2, CalendarDays,
    Clock, MapPin, Eye, Hash, Copy, Check,
    ShoppingCart, DollarSign, Sparkles, ChevronRight, Edit
} from 'lucide-react'
import { formatPrice, formatThaiDateFull, formatThaiDateShort, getRelativeTimeDisplay } from '@/contexts/UnifiedListingContext'

// ==========================================
// TYPES
// ==========================================

interface ListingInfoCardV2Props {
    title: string
    price: number
    priceNegotiable: boolean
    listingCode: string
    createdAt: Date
    updatedAt?: Date
    expiresAt?: Date
    views: number
    favorites: number
    location?: {
        province: string
        amphoe?: string
    }
    categoryEmoji: string
    categoryLabel: string
    isFavorited: boolean
    isOwner: boolean
    language?: 'th' | 'en'
    onChat?: () => void
    onOffer?: () => void
    onFavorite?: () => void
    onShare?: () => void
}

// ==========================================
// COMPONENT
// ==========================================

export function ListingInfoCardV2({
    title,
    price,
    priceNegotiable,
    listingCode,
    createdAt,
    updatedAt,
    expiresAt,
    views,
    favorites,
    location,
    categoryEmoji,
    categoryLabel,
    isFavorited,
    isOwner,
    language = 'th',
    onChat,
    onOffer,
    onFavorite,
    onShare
}: ListingInfoCardV2Props) {
    const [copied, setCopied] = useState(false)
    const [showFullDate, setShowFullDate] = useState(false)

    // Copy listing code
    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(listingCode)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">

            {/* === HEADER: META INFO === */}
            <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 border-b border-slate-700/50">
                {/* Left: Date & Category */}
                <div className="flex items-center gap-3">
                    {/* Posted Date */}
                    <button
                        onClick={() => setShowFullDate(!showFullDate)}
                        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-300 transition-colors"
                    >
                        <CalendarDays className="w-4 h-4 text-purple-400" />
                        <span>{getRelativeTimeDisplay(createdAt, language)}</span>
                    </button>

                    <span className="text-slate-600">•</span>

                    {/* Category */}
                    <Link
                        href={`/category/${categoryLabel.toLowerCase()}`}
                        className="flex items-center gap-1 text-sm text-gray-400 hover:text-purple-400 transition-colors"
                    >
                        <span>{categoryEmoji}</span>
                        <span className="hidden sm:inline">{categoryLabel}</span>
                    </Link>
                </div>

                {/* Right: Listing Code */}
                <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors group"
                    title={language === 'th' ? 'คลิกเพื่อคัดลอก' : 'Click to copy'}
                >
                    <Hash className="w-3.5 h-3.5 text-purple-400" />
                    <span className="text-purple-400 font-mono text-xs">{listingCode}</span>
                    {copied ? (
                        <Check className="w-3.5 h-3.5 text-green-400" />
                    ) : (
                        <Copy className="w-3.5 h-3.5 text-gray-500 group-hover:text-purple-400 transition-colors" />
                    )}
                </button>
            </div>

            {/* === FULL DATE (Expandable) === */}
            {showFullDate && (
                <div className="px-4 py-2 bg-purple-500/10 border-b border-purple-500/20">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                            <span className="text-gray-500">{language === 'th' ? 'ลงประกาศ:' : 'Posted:'}</span>
                            <span className="text-white font-medium">{formatThaiDateFull(createdAt)}</span>
                        </div>
                        {updatedAt && updatedAt.getTime() !== createdAt.getTime() && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">{language === 'th' ? 'แก้ไขล่าสุด:' : 'Updated:'}</span>
                                <span className="text-gray-400">{formatThaiDateShort(updatedAt)}</span>
                            </div>
                        )}
                        {expiresAt && (
                            <div className="flex items-center gap-2">
                                <span className="text-gray-500">{language === 'th' ? 'หมดอายุ:' : 'Expires:'}</span>
                                <span className="text-orange-400">{formatThaiDateShort(expiresAt)}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* === TITLE === */}
            <div className="px-4 pt-4 pb-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                    {title}
                </h1>
            </div>

            {/* === PRICE SECTION === */}
            <div className="px-4 pb-4">
                <div className="flex items-end justify-between">
                    <div>
                        <div className="flex items-baseline gap-2">
                            <span className="text-3xl sm:text-4xl font-bold text-white">
                                ฿{formatPrice(price)}
                            </span>
                            {priceNegotiable && (
                                <span className="px-2.5 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 text-sm rounded-full border border-purple-500/30 flex items-center gap-1">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    {language === 'th' ? 'ต่อรองได้' : 'Negotiable'}
                                </span>
                            )}
                        </div>

                        {/* Location */}
                        {location?.province && (
                            <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-400">
                                <MapPin className="w-4 h-4 text-pink-400" />
                                <span>{location.amphoe && `${location.amphoe}, `}{location.province}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* === ACTION BUTTONS === */}
            {!isOwner && (
                <div className="px-4 pb-4 space-y-3">
                    {/* Primary CTA */}
                    <button
                        onClick={onChat}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all transform hover:scale-[1.02]"
                    >
                        <MessageCircle className="w-5 h-5" />
                        {language === 'th' ? 'แชทกับผู้ขาย' : 'Chat with Seller'}
                    </button>

                    {/* Secondary CTA - Make Offer */}
                    <button
                        onClick={onOffer}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-slate-700/50 hover:bg-slate-700 rounded-xl text-white font-medium transition-colors border border-slate-600"
                    >
                        <DollarSign className="w-4 h-4 text-green-400" />
                        {language === 'th' ? 'เสนอราคา' : 'Make Offer'}
                    </button>


                    {/* Tertiary Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={onFavorite}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl transition-all ${isFavorited
                                ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                                : 'bg-slate-800/50 text-gray-400 border border-slate-700 hover:border-pink-500/30 hover:text-pink-400'
                                }`}
                        >
                            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                            {isFavorited
                                ? (language === 'th' ? 'บันทึกแล้ว' : 'Saved')
                                : (language === 'th' ? 'บันทึก' : 'Save')
                            }
                        </button>

                        <button
                            onClick={onShare}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-800/50 text-gray-400 border border-slate-700 hover:border-blue-500/30 hover:text-blue-400 rounded-xl transition-all"
                        >
                            <Share2 className="w-4 h-4" />
                            {language === 'th' ? 'แชร์' : 'Share'}
                        </button>
                    </div>
                </div>
            )
            }

            {/* === POSTED DATE FOOTER === */}
            <div className="px-4 py-3 bg-slate-900/50 border-t border-slate-700/50">
                <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 text-gray-500">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{language === 'th' ? 'โพสต์เมื่อ' : 'Posted'}</span>
                    </div>
                    <div className="text-gray-400 font-medium">
                        {formatThaiDateFull(createdAt)}
                    </div>
                </div>
            </div>
        </div >
    )
}

export default ListingInfoCardV2

/**
 * LISTING RIGHT SIDEBAR V2
 * 
 * Right Sidebar แบบครบวงจร รวมทุก Component
 * - Listing Info Card (Price, Date, Actions)
 * - Unified Seller Card
 * - AI Insights Panel
 * - Trust Signals
 * - Similar Items
 * 
 * @version 2.0.0
 */

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
    Shield, CheckCircle, AlertCircle, ChevronRight,
    TrendingUp, MapPin, ExternalLink, Sparkles
} from 'lucide-react'

// Components
import { UnifiedSellerCardV2 } from './UnifiedSellerCardV2'
import { AIInsightsPanelV2 } from './AIInsightsPanelV2'
import { ListingInfoCardV2 } from './ListingInfoCardV2'

// Services
import {
    getUnifiedSellerData,
    getSellerOtherListings,
    getSimilarListingsUnified,
    generateAIAnalysis
} from '@/services/listing/unifiedListingService'

// Types
import type {
    ListingData,
    SellerData,
    ListingPreview,
    AIAnalysis
} from '@/contexts/UnifiedListingContext'
import { formatPrice, formatThaiDateShort } from '@/contexts/UnifiedListingContext'

// ==========================================
// TYPES
// ==========================================

interface ListingRightSidebarV2Props {
    listing: ListingData
    initialSeller?: SellerData | null
    isFavorited: boolean
    isOwner: boolean
    language?: 'th' | 'en'
    onChat: () => void
    onOffer: () => void
    onFavorite: () => void
    onShare: () => void
}

// ==========================================
// TRUST SIGNALS COMPONENT
// ==========================================

function TrustSignalsV2({
    seller,
    listing,
    language = 'th'
}: {
    seller: SellerData
    listing: ListingData
    language?: 'th' | 'en'
}) {
    const signals: { icon: React.ReactNode; text: string; positive: boolean }[] = []
    const warnings: { icon: React.ReactNode; text: string }[] = []

    // Positive signals
    if (seller.verified) {
        signals.push({
            icon: <CheckCircle className="w-4 h-4 text-emerald-400" />,
            text: language === 'th' ? 'ยืนยันตัวตนแล้ว' : 'ID Verified',
            positive: true
        })
    }
    if (seller.phone_verified) {
        signals.push({
            icon: <CheckCircle className="w-4 h-4 text-blue-400" />,
            text: language === 'th' ? 'เบอร์โทรยืนยัน' : 'Phone Verified',
            positive: true
        })
    }
    if (seller.response_time_minutes <= 60) {
        signals.push({
            icon: <CheckCircle className="w-4 h-4 text-cyan-400" />,
            text: language === 'th' ? 'ตอบไว < 1 ชม.' : 'Fast Response',
            positive: true
        })
    }
    if (seller.rating >= 4) {
        signals.push({
            icon: <CheckCircle className="w-4 h-4 text-yellow-400" />,
            text: language === 'th' ? `คะแนนดี ${seller.rating.toFixed(1)}/5` : `Good Rating ${seller.rating.toFixed(1)}/5`,
            positive: true
        })
    }
    if (seller.sold_count >= 5) {
        signals.push({
            icon: <CheckCircle className="w-4 h-4 text-purple-400" />,
            text: language === 'th' ? `ขายแล้ว ${seller.sold_count} ชิ้น` : `${seller.sold_count} Sold`,
            positive: true
        })
    }

    // Warnings
    const memberDays = Math.floor((new Date().getTime() - seller.member_since.getTime()) / (1000 * 60 * 60 * 24))
    if (memberDays < 30) {
        warnings.push({
            icon: <AlertCircle className="w-4 h-4 text-orange-400" />,
            text: language === 'th' ? 'บัญชีใหม่ (< 30 วัน)' : 'New Account (< 30 days)'
        })
    }
    if (seller.review_count === 0) {
        warnings.push({
            icon: <AlertCircle className="w-4 h-4 text-yellow-500" />,
            text: language === 'th' ? 'ยังไม่มีรีวิว' : 'No Reviews Yet'
        })
    }
    if (!seller.verified && !seller.phone_verified) {
        warnings.push({
            icon: <AlertCircle className="w-4 h-4 text-red-400" />,
            text: language === 'th' ? 'ยังไม่ยืนยันตัวตน' : 'Not Verified'
        })
    }

    if (signals.length === 0 && warnings.length === 0) return null

    return (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-400" />
                {language === 'th' ? 'ความปลอดภัย' : 'Trust & Safety'}
            </h4>

            <div className="space-y-2">
                {/* Positive Signals */}
                {signals.map((signal, i) => (
                    <div key={`signal-${i}`} className="flex items-center gap-2 text-sm">
                        {signal.icon}
                        <span className="text-gray-300">{signal.text}</span>
                    </div>
                ))}

                {/* Warnings */}
                {warnings.length > 0 && (
                    <div className="border-t border-slate-700/50 pt-2 mt-2">
                        {warnings.map((warning, i) => (
                            <div key={`warning-${i}`} className="flex items-center gap-2 text-sm">
                                {warning.icon}
                                <span className="text-orange-300">{warning.text}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="mt-3 pt-3 border-t border-slate-700/50 text-xs text-gray-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                {language === 'th' ? 'คำนวณจากข้อมูลจริงในระบบ' : 'Calculated from real data'}
            </div>
        </div>
    )
}

// ==========================================
// SIMILAR ITEMS COMPONENT
// ==========================================

function SimilarItemsV2({
    items,
    categoryType,
    language = 'th'
}: {
    items: ListingPreview[]
    categoryType: string
    language?: 'th' | 'en'
}) {
    if (items.length === 0) return null

    return (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
            <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-orange-400" />
                    {language === 'th' ? 'สินค้าคล้ายกัน' : 'Similar Items'}
                </h4>
                <Link
                    href={`/category/${categoryType}`}
                    className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                    {language === 'th' ? 'ดูเพิ่ม' : 'More'}
                    <ChevronRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-2">
                {items.slice(0, 4).map(item => (
                    <Link
                        key={item.id}
                        href={`/listing/${item.slug}`}
                        className="group"
                    >
                        <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-700 mb-1.5">
                            {item.thumbnail_url ? (
                                <Image
                                    src={item.thumbnail_url}
                                    alt={item.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-2xl">
                                    📦
                                </div>
                            )}

                            {/* Price Badge */}
                            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                                <p className="text-white text-sm font-bold">฿{formatPrice(item.price)}</p>
                            </div>
                        </div>

                        <p className="text-xs text-gray-400 group-hover:text-white line-clamp-2 transition-colors">
                            {item.title}
                        </p>

                        {item.location?.province && (
                            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                <MapPin className="w-3 h-3" />
                                {item.location.province}
                            </p>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    )
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export function ListingRightSidebarV2({
    listing,
    initialSeller,
    isFavorited,
    isOwner,
    language = 'th',
    onChat,
    onOffer,
    onFavorite,
    onShare
}: ListingRightSidebarV2Props) {
    const [seller, setSeller] = useState<SellerData | null>(initialSeller || null)
    const [sellerListings, setSellerListings] = useState<ListingPreview[]>([])
    const [similarItems, setSimilarItems] = useState<ListingPreview[]>([])
    const [aiAnalysis, setAIAnalysis] = useState<AIAnalysis | null>(null)
    const [loading, setLoading] = useState(!initialSeller)

    // Fetch all data
    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch seller data if not provided
                if (!initialSeller) {
                    const sellerData = await getUnifiedSellerData(listing.seller_id)
                    if (sellerData) {
                        setSeller(sellerData)
                    }
                }

                // Fetch seller's other listings
                const otherListings = await getSellerOtherListings(
                    listing.seller_id,
                    listing.id,
                    8
                )
                setSellerListings(otherListings)

                // Fetch similar items
                const similar = await getSimilarListingsUnified(
                    listing.category_type,
                    listing.id,
                    4
                )
                setSimilarItems(similar)

                // Generate AI analysis
                const analysis = generateAIAnalysis(listing)
                setAIAnalysis(analysis)

            } catch (error) {
                console.error('Error fetching sidebar data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [listing.id, listing.seller_id, listing.category_type, initialSeller])

    // Get category info
    const getCategoryInfo = () => {
        const categoryMap: Record<string, { emoji: string; label: string }> = {
            mobile: { emoji: '📱', label: 'มือถือ' },
            car: { emoji: '🚗', label: 'รถยนต์' },
            motorcycle: { emoji: '🏍️', label: 'มอเตอร์ไซค์' },
            real_estate: { emoji: '🏠', label: 'อสังหาฯ' },
            computer: { emoji: '💻', label: 'คอมพิวเตอร์' },
            appliance: { emoji: '📺', label: 'เครื่องใช้ไฟฟ้า' },
            fashion: { emoji: '👕', label: 'แฟชั่น' },
            gaming: { emoji: '🎮', label: 'เกม' }
        }
        return categoryMap[listing.category_type] || { emoji: '📦', label: 'ทั่วไป' }
    }

    const categoryInfo = getCategoryInfo()

    // Loading skeleton
    if (loading) {
        return (
            <div className="space-y-4">
                <div className="bg-slate-800/50 rounded-2xl h-64 animate-pulse" />
                <div className="bg-slate-800/50 rounded-2xl h-96 animate-pulse" />
                <div className="bg-slate-800/50 rounded-2xl h-48 animate-pulse" />
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* 1. Listing Info Card */}
            <ListingInfoCardV2
                title={listing.title}
                price={listing.price}
                priceNegotiable={listing.price_negotiable}
                listingCode={listing.listing_code}
                createdAt={listing.created_at}
                updatedAt={listing.updated_at}
                expiresAt={listing.expires_at}
                views={listing.views}
                favorites={listing.favorites}
                location={listing.location}
                categoryEmoji={categoryInfo.emoji}
                categoryLabel={categoryInfo.label}
                isFavorited={isFavorited}
                isOwner={isOwner}
                language={language}
                onChat={onChat}
                onOffer={onOffer}
                onFavorite={onFavorite}
                onShare={onShare}
            />

            {/* 2. Unified Seller Card */}
            {seller && (
                <UnifiedSellerCardV2
                    seller={seller}
                    sellerListings={sellerListings}
                    postedDate={listing.created_at}
                    listingId={listing.id}
                    language={language}
                    showMiniGallery={true}
                />
            )}

            {/* 3. AI Insights Panel */}
            <AIInsightsPanelV2
                analysis={aiAnalysis}
                listingPrice={listing.price}
                language={language}
                defaultExpanded={true}
            />

            {/* 4. Trust Signals */}
            {seller && (
                <TrustSignalsV2
                    seller={seller}
                    listing={listing}
                    language={language}
                />
            )}

            {/* 5. Similar Items */}
            <SimilarItemsV2
                items={similarItems}
                categoryType={listing.category_type}
                language={language}
            />
        </div>
    )
}

export default ListingRightSidebarV2

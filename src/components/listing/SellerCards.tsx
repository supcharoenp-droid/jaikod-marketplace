'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    Star, ShieldCheck, MessageCircle, Clock, Package2,
    ThumbsUp, ChevronRight, BadgeCheck, MapPin, Store,
    Heart, Share2, Flag, Users, TrendingUp, Award, Loader2
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { isFollowing as checkFollowing, toggleFollow } from '@/lib/follows'
import { getSellerProfile, getSellerListings, SellerListing } from '@/lib/seller'

// Local SellerProfile type for internal use
interface SellerProfile {
    name: string
    avatar?: string
    verified?: boolean
    trust_score: number
    response_time_minutes: number
    response_rate?: number
    total_listings: number
    active_listings?: number
    successful_sales: number
    member_since?: Date
    badges?: string[]
    followers_count?: number
}

// ==========================================
// TYPES
// ==========================================

interface SellerInfo {
    id: string
    name: string
    avatar?: string
    verified: boolean
    trust_score: number
    response_time_minutes: number
    response_rate?: number
    total_listings: number
    successful_sales: number
    member_since?: Date
    last_active?: Date
    location?: string
    badges?: string[]
    followers_count?: number
}

interface ListingPreview {
    id: string
    slug: string
    title: string
    price: number
    thumbnail_url: string
    created_at: Date
    views: number
    status?: string  // Optional for SellerListing compatibility
}

// ==========================================
// ENHANCED SELLER CARD (ปรับปรุงใหม่)
// ==========================================

interface EnhancedSellerCardProps {
    seller: SellerInfo
    sellerId: string
    location?: string
    language?: 'th' | 'en'
    compact?: boolean
    currentListingId?: string
}

export function EnhancedSellerCard({
    seller,
    sellerId,
    location,
    language = 'th',
    compact = false,
    currentListingId
}: EnhancedSellerCardProps) {
    const { user } = useAuth()
    const [isFollowing, setIsFollowing] = useState(false)
    const [followLoading, setFollowLoading] = useState(false)
    const [realTimeProfile, setRealTimeProfile] = useState<SellerProfile | null>(null)
    const [otherListings, setOtherListings] = useState<SellerListing[]>([])

    // Fetch real-time seller profile and follow status
    useEffect(() => {
        const fetchData = async () => {
            console.log('🔍 EnhancedSellerCard: Fetching for sellerId:', sellerId)
            try {
                // Fetch seller profile from Firestore
                const profile = await getSellerProfile(sellerId)
                console.log('📊 EnhancedSellerCard: Got profile:', {
                    name: profile?.name,
                    total_listings: profile?.total_listings,
                    active_listings: profile?.active_listings
                })
                if (profile) {
                    setRealTimeProfile(profile)
                }

                // Check follow status if user is logged in
                if (user?.uid && user.uid !== sellerId) {
                    const following = await checkFollowing(user.uid, sellerId)
                    setIsFollowing(following)
                }

                // Fetch other listings from this seller
                if (currentListingId) {
                    const listings = await getSellerListings(sellerId, currentListingId, 4)
                    setOtherListings(listings)
                }
            } catch (error) {
                console.error('Error fetching seller data:', error)
            }
        }

        fetchData()
    }, [sellerId, user?.uid, currentListingId])

    // Handle follow toggle
    const handleFollowToggle = useCallback(async () => {
        if (!user?.uid) {
            // Redirect to login or show modal
            alert(language === 'th' ? 'กรุณาเข้าสู่ระบบ' : 'Please login')
            return
        }

        if (user.uid === sellerId) {
            return // Can't follow yourself
        }

        setFollowLoading(true)
        try {
            const result = await toggleFollow(user.uid, sellerId)
            if (result.success) {
                setIsFollowing(result.isFollowing)
            }
        } catch (error) {
            console.error('Error toggling follow:', error)
        } finally {
            setFollowLoading(false)
        }
    }, [user?.uid, sellerId, language])

    // Use real-time data if available, otherwise fallback to props
    // FIX: Override total_listings with calculated count from fetched listings
    const calculatedListingsCount = otherListings.length + 1 // +1 for current listing
    const displaySeller = {
        ...(realTimeProfile || seller),
        // Use calculated count if realTimeProfile's total_listings is 0 or not available
        total_listings: realTimeProfile?.total_listings
            || (otherListings.length > 0 ? calculatedListingsCount : seller.total_listings)
            || calculatedListingsCount
    }
    const responseRate = realTimeProfile?.response_rate || seller.response_rate || 80

    // Calculate rating from trust score (0-100 -> 0-5)
    const rating = Math.min(5, Math.max(0, displaySeller.trust_score / 20))

    // Calculate member duration
    const getMemberDuration = () => {
        const memberSince = realTimeProfile?.member_since || seller.member_since
        if (!memberSince) return null
        const now = new Date()
        const diff = now.getTime() - new Date(memberSince).getTime()
        const years = Math.floor(diff / (365 * 24 * 60 * 60 * 1000))
        const months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000))
        if (years >= 1) return language === 'th' ? `${years} ปี` : `${years} year${years > 1 ? 's' : ''}`
        if (months >= 1) return language === 'th' ? `${months} เดือน` : `${months} month${months > 1 ? 's' : ''}`
        return language === 'th' ? 'ใหม่' : 'New'
    }

    // Response time display
    const getResponseTime = () => {
        const responseMinutes = displaySeller.response_time_minutes
        if (responseMinutes < 60) {
            return language === 'th' ? `${responseMinutes} นาที` : `${responseMinutes} min`
        }
        const hours = Math.round(responseMinutes / 60)
        return language === 'th' ? `${hours} ชั่วโมง` : `${hours} hr${hours > 1 ? 's' : ''}`
    }


    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-800/80 rounded-2xl overflow-hidden border border-slate-700/50">

            {/* Header with gradient */}
            <div className="relative h-20 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Avatar - overlapping header */}
            <div className="relative -mt-10 px-4">
                <div className="flex items-end gap-4">
                    <div className="relative">
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5 shadow-xl">
                            <div className="w-full h-full rounded-xl bg-slate-800 flex items-center justify-center overflow-hidden">
                                {seller.avatar ? (
                                    <Image
                                        src={seller.avatar}
                                        alt={seller.name}
                                        width={80}
                                        height={80}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-3xl font-bold text-white">
                                        {seller.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>
                        {/* Verified badge */}
                        {seller.verified && (
                            <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                                <BadgeCheck className="w-4 h-4 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Name & badges */}
                    <div className="flex-1 pb-2">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-bold text-white">{seller.name}</h3>
                            {seller.verified && (
                                <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full flex items-center gap-1">
                                    <ShieldCheck className="w-3 h-3" />
                                    {language === 'th' ? 'ยืนยันตัวตน' : 'Verified'}
                                </span>
                            )}
                        </div>
                        {getMemberDuration() && (
                            <p className="text-sm text-gray-400">
                                {language === 'th' ? 'สมาชิกมาแล้ว' : 'Member for'} {getMemberDuration()}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Trust Score */}
            <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-400">{language === 'th' ? 'คะแนนความน่าเชื่อถือ' : 'Trust Score'}</span>
                    <span className="text-lg font-bold text-white">{seller.trust_score}/100</span>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${seller.trust_score}%` }}
                    />
                </div>

                {/* Verification badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {displaySeller.verified && (
                        <span className="flex items-center gap-1 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {language === 'th' ? 'ยืนยันตัวตน' : 'ID Verified'}
                        </span>
                    )}
                    {displaySeller.response_time_minutes <= 60 && (
                        <span className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/30">
                            <Clock className="w-3.5 h-3.5" />
                            {language === 'th' ? 'ตอบเร็ว' : 'Fast Response'}
                        </span>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                        <div className="text-lg font-bold text-white">{displaySeller.total_listings}</div>
                        <div className="text-xs text-gray-400">{language === 'th' ? 'ประกาศ' : 'Listings'}</div>
                    </div>
                    <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                        <div className="text-lg font-bold text-white">{displaySeller.successful_sales}</div>
                        <div className="text-xs text-gray-400">{language === 'th' ? 'ขายแล้ว' : 'Sold'}</div>
                    </div>
                    <div className="text-center p-3 bg-slate-900/50 rounded-xl">
                        <div className="text-lg font-bold text-emerald-400">
                            {responseRate}%
                        </div>
                        <div className="text-xs text-gray-400">{language === 'th' ? 'ตอบกลับ' : 'Response'}</div>
                    </div>
                </div>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map(i => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${i <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-gray-400">
                        {rating.toFixed(1)} ({seller.successful_sales} {language === 'th' ? 'รีวิว' : 'reviews'})
                    </span>
                </div>

                {/* Location */}
                {location && (
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                        <MapPin className="w-4 h-4 text-purple-400" />
                        <span>{location}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="px-4 pb-4 space-y-2">
                <Link
                    href={`/shop/${sellerId}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors"
                >
                    <Store className="w-4 h-4" />
                    {language === 'th' ? 'ดูประกาศทั้งหมด' : 'View All Listings'}
                    <span className="text-gray-400">({displaySeller.total_listings})</span>
                </Link>

                <div className="flex gap-2">
                    <button
                        onClick={handleFollowToggle}
                        disabled={followLoading}
                        className={`flex-1 py-2.5 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 ${isFollowing
                            ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                            : 'bg-slate-700 hover:bg-slate-600 text-gray-300'
                            }`}
                    >
                        {followLoading ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <>
                                <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
                                {isFollowing
                                    ? (language === 'th' ? 'ติดตามแล้ว' : 'Following')
                                    : (language === 'th' ? 'ติดตาม' : 'Follow')
                                }
                            </>
                        )}
                    </button>
                    <button className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-gray-300 transition-colors">
                        <Flag className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}


// ==========================================
// SELLER OTHER LISTINGS CAROUSEL
// ==========================================

interface SellerOtherListingsProps {
    sellerId: string
    currentListingId: string
    sellerName: string
    listings: ListingPreview[]
    language?: 'th' | 'en'
}

export function SellerOtherListings({
    sellerId,
    currentListingId,
    sellerName,
    listings,
    language = 'th'
}: SellerOtherListingsProps) {
    // Filter out current listing
    const otherListings = listings.filter(l => l.id !== currentListingId)

    if (otherListings.length === 0) return null

    const formatPrice = (price: number) => new Intl.NumberFormat('th-TH').format(price)

    return (
        <div className="bg-slate-800/50 rounded-2xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <Package2 className="w-5 h-5 text-purple-400" />
                    {language === 'th' ? 'ประกาศอื่นจากผู้ขาย' : 'More from Seller'}
                </h3>
                <Link
                    href={`/shop/${sellerId}`}
                    className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                    {language === 'th' ? 'ดูทั้งหมด' : 'View All'}
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Horizontal Scroll */}
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                {otherListings.slice(0, 6).map(listing => (
                    <Link
                        key={listing.id}
                        href={`/listing/${listing.slug}`}
                        className="flex-shrink-0 w-36 group"
                    >
                        {/* Thumbnail */}
                        <div className="relative aspect-square rounded-xl overflow-hidden mb-2 bg-slate-700">
                            {listing.thumbnail_url ? (
                                <Image
                                    src={listing.thumbnail_url}
                                    alt={listing.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                    📷
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <h4 className="text-sm text-gray-300 group-hover:text-white line-clamp-2 mb-1 transition-colors">
                            {listing.title}
                        </h4>
                        <p className="text-sm font-bold text-white">
                            ฿{formatPrice(listing.price)}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

// ==========================================
// SIMILAR LISTINGS (RECOMMENDATIONS)
// ==========================================

interface SimilarListingsProps {
    categoryType: string
    currentListingId: string
    listings: ListingPreview[]
    language?: 'th' | 'en'
}

export function SimilarListings({
    categoryType,
    currentListingId,
    listings,
    language = 'th'
}: SimilarListingsProps) {
    const filteredListings = listings.filter(l => l.id !== currentListingId)

    if (filteredListings.length === 0) return null

    const formatPrice = (price: number) => new Intl.NumberFormat('th-TH').format(price)

    return (
        <div className="bg-slate-800/50 rounded-2xl p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-orange-400" />
                    {language === 'th' ? 'สินค้าที่คล้ายกัน' : 'Similar Items'}
                </h3>
                <Link
                    href={`/category/${categoryType}`}
                    className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                    {language === 'th' ? 'ดูเพิ่ม' : 'See More'}
                    <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 gap-3">
                {filteredListings.slice(0, 4).map(listing => (
                    <Link
                        key={listing.id}
                        href={`/listing/${listing.slug}`}
                        className="group"
                    >
                        {/* Thumbnail */}
                        <div className="relative aspect-square rounded-xl overflow-hidden mb-2 bg-slate-700">
                            {listing.thumbnail_url ? (
                                <Image
                                    src={listing.thumbnail_url}
                                    alt={listing.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                                    📷
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <h4 className="text-sm text-gray-300 group-hover:text-white line-clamp-2 mb-1 transition-colors">
                            {listing.title}
                        </h4>
                        <p className="text-sm font-bold text-white">
                            ฿{formatPrice(listing.price)}
                        </p>
                    </Link>
                ))}
            </div>
        </div>
    )
}

// ==========================================
// EXPORT ALL
// ==========================================

export default EnhancedSellerCard

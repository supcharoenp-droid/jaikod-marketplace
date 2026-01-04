/**
 * UNIFIED SELLER CARD V2
 * 
 * Card แสดงข้อมูลผู้ขายแบบครบถ้วน
 * - ข้อมูลถูกต้อง 100% (ดึงจาก Unified Service)
 * - วันที่โพสแบบละเอียด
 * - Trust Score แบบ visual
 * - สินค้าอื่นของผู้ขาย
 * 
 * @version 2.0.0
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    ShieldCheck, BadgeCheck, Clock, MapPin, Store,
    Heart, Star, MessageCircle, TrendingUp, Calendar,
    Package, CheckCircle, AlertCircle, ChevronRight,
    User, Loader2, ExternalLink
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { isFollowing as checkFollowing, toggleFollow } from '@/lib/follows'
import type { SellerData, ListingPreview } from '@/contexts/UnifiedListingContext'
import { formatThaiDateFull, formatThaiDateShort, getRelativeTimeDisplay, formatPrice, getTrustLevel } from '@/contexts/UnifiedListingContext'

// ==========================================
// TYPES
// ==========================================

interface UnifiedSellerCardV2Props {
    seller: SellerData
    sellerListings?: ListingPreview[]
    postedDate: Date
    listingId: string
    language?: 'th' | 'en'
    showMiniGallery?: boolean
}

// ==========================================
// COMPONENT
// ==========================================

export function UnifiedSellerCardV2({
    seller,
    sellerListings = [],
    postedDate,
    listingId,
    language = 'th',
    showMiniGallery = true
}: UnifiedSellerCardV2Props) {
    const { user } = useAuth()
    const [isFollowing, setIsFollowing] = useState(false)
    const [followLoading, setFollowLoading] = useState(false)
    const [showFullDate, setShowFullDate] = useState(false)

    // Check follow status
    useEffect(() => {
        async function checkFollow() {
            if (user?.uid && user.uid !== seller.id) {
                const following = await checkFollowing(user.uid, seller.id)
                setIsFollowing(following)
            }
        }
        checkFollow()
    }, [user?.uid, seller.id])

    // Handle follow toggle
    const handleFollowToggle = useCallback(async () => {
        if (!user?.uid) {
            alert(language === 'th' ? 'กรุณาเข้าสู่ระบบ' : 'Please login')
            return
        }

        if (user.uid === seller.id) return

        setFollowLoading(true)
        try {
            const result = await toggleFollow(user.uid, seller.id)
            if (result.success) {
                setIsFollowing(result.isFollowing)
            }
        } catch (error) {
            console.error('Error toggling follow:', error)
        } finally {
            setFollowLoading(false)
        }
    }, [user?.uid, seller.id, language])

    // Trust level
    const trustLevel = getTrustLevel(seller.trust_score)

    // Member duration
    const getMemberDuration = () => {
        const now = new Date()
        const diff = now.getTime() - seller.member_since.getTime()
        const years = Math.floor(diff / (365 * 24 * 60 * 60 * 1000))
        const months = Math.floor(diff / (30 * 24 * 60 * 60 * 1000))

        if (language === 'th') {
            if (years >= 1) return `${years} ปี`
            if (months >= 1) return `${months} เดือน`
            return 'ใหม่'
        } else {
            if (years >= 1) return `${years} year${years > 1 ? 's' : ''}`
            if (months >= 1) return `${months} month${months > 1 ? 's' : ''}`
            return 'New'
        }
    }

    // Response time display
    const getResponseTime = () => {
        const mins = seller.response_time_minutes
        if (mins < 60) return language === 'th' ? `< ${mins} นาที` : `< ${mins}m`
        const hours = Math.round(mins / 60)
        return language === 'th' ? `< ${hours} ชม.` : `< ${hours}h`
    }

    // Filter other listings
    const otherListings = sellerListings.filter(l => l.id !== listingId).slice(0, 4)

    return (
        <div className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden border border-slate-700/50 shadow-xl">

            {/* === HEADER GRADIENT === */}
            <div className="relative h-16 bg-gradient-to-r from-purple-600/80 via-pink-500/80 to-orange-400/80">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/50" />

                {/* Posted Date Badge */}
                <div className="absolute top-3 right-3">
                    <button
                        onClick={() => setShowFullDate(!showFullDate)}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/70 backdrop-blur-md rounded-full text-xs transition-all hover:bg-slate-900/90"
                    >
                        <Calendar className="w-3.5 h-3.5 text-purple-400" />
                        <span className="text-gray-300">
                            {showFullDate
                                ? formatThaiDateFull(postedDate)
                                : getRelativeTimeDisplay(postedDate, language)
                            }
                        </span>
                    </button>
                </div>
            </div>

            {/* === SELLER INFO === */}
            <div className="relative -mt-8 px-4">
                <div className="flex items-end gap-3">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-[2px] shadow-lg">
                            <div className="w-full h-full rounded-[10px] bg-slate-800 flex items-center justify-center overflow-hidden">
                                {seller.avatar ? (
                                    <Image
                                        src={seller.avatar}
                                        alt={seller.name}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span className="text-2xl font-bold text-white">
                                        {seller.name.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Verified Badge */}
                        {seller.verified && (
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-800 shadow-md">
                                <BadgeCheck className="w-3.5 h-3.5 text-white" />
                            </div>
                        )}
                    </div>

                    {/* Name & Badges */}
                    <div className="flex-1 pb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-lg font-bold text-white">{seller.name}</h3>
                            {seller.badges.includes('fast_response') && (
                                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-400 text-xs rounded-full flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {language === 'th' ? 'ตอบเร็ว' : 'Fast'}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-0.5">
                            {seller.location && (
                                <span className="flex items-center gap-1">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {seller.location}
                                </span>
                            )}
                            <span>•</span>
                            <span>{language === 'th' ? 'สมาชิก' : 'Member'} {getMemberDuration()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* === TRUST SCORE === */}
            <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-400 flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-purple-400" />
                        {language === 'th' ? 'ความน่าเชื่อถือ' : 'Trust Score'}
                    </span>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${trustLevel.color}`}>
                            {trustLevel.label}
                        </span>
                        <span className="text-lg font-bold text-white">{seller.trust_score}%</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 transition-all duration-700 ease-out"
                        style={{ width: `${seller.trust_score}%` }}
                    />
                </div>

                {/* Verification Badges */}
                <div className="flex flex-wrap gap-2 mt-3">
                    {seller.verified && (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-xs rounded-full border border-emerald-500/30">
                            <CheckCircle className="w-3.5 h-3.5" />
                            {language === 'th' ? 'ยืนยันตัวตน' : 'Verified'}
                        </span>
                    )}
                    {seller.phone_verified && (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-full border border-blue-500/30">
                            <CheckCircle className="w-3.5 h-3.5" />
                            {language === 'th' ? 'เบอร์ยืนยัน' : 'Phone'}
                        </span>
                    )}
                    {seller.response_time_minutes <= 60 && (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/30">
                            <Clock className="w-3.5 h-3.5" />
                            {language === 'th' ? 'ตอบ' : 'Reply'} {getResponseTime()}
                        </span>
                    )}
                </div>
            </div>

            {/* === STATS GRID === */}
            <div className="grid grid-cols-3 gap-2 px-4 pb-4">
                <div className="text-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-purple-500/30 transition-colors">
                    <div className="text-xl font-bold text-white">{seller.total_listings}</div>
                    <div className="text-xs text-gray-400">{language === 'th' ? 'ประกาศ' : 'Listings'}</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-green-500/30 transition-colors">
                    <div className="text-xl font-bold text-emerald-400">{seller.sold_count}</div>
                    <div className="text-xs text-gray-400">{language === 'th' ? 'ขายแล้ว' : 'Sold'}</div>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-blue-500/30 transition-colors">
                    <div className="text-xl font-bold text-blue-400">{seller.response_rate}%</div>
                    <div className="text-xs text-gray-400">{language === 'th' ? 'ตอบกลับ' : 'Response'}</div>
                </div>
            </div>

            {/* === RATING === */}
            <div className="px-4 pb-4">
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl">
                    <div className="flex items-center gap-2">
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star
                                    key={i}
                                    className={`w-4 h-4 ${i <= Math.round(seller.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                />
                            ))}
                        </div>
                        <span className="text-sm text-white font-medium">{seller.rating.toFixed(1)}</span>
                        {seller.review_count > 0 && (
                            <span className="text-sm text-gray-400">({seller.review_count} {language === 'th' ? 'รีวิว' : 'reviews'})</span>
                        )}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-400">
                        <User className="w-4 h-4" />
                        <span>{seller.followers_count} {language === 'th' ? 'ผู้ติดตาม' : 'followers'}</span>
                    </div>
                </div>
            </div>

            {/* === ACTIONS === */}
            <div className="px-4 pb-4 space-y-2">
                <Link
                    href={`/shop/${seller.id}`}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-xl text-white font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40"
                >
                    <Store className="w-5 h-5" />
                    {language === 'th' ? 'ดูร้านค้า' : 'View Shop'}
                    <span className="px-2 py-0.5 bg-white/20 rounded-md text-sm">{seller.total_listings}</span>
                    <ChevronRight className="w-4 h-4" />
                </Link>

                <button
                    onClick={handleFollowToggle}
                    disabled={followLoading}
                    className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-medium transition-all ${isFollowing
                            ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30 hover:bg-pink-500/30'
                            : 'bg-slate-700/50 text-gray-300 border border-slate-600 hover:bg-slate-700'
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
            </div>

            {/* === OTHER LISTINGS === */}
            {showMiniGallery && otherListings.length > 0 && (
                <div className="border-t border-slate-700/50">
                    <div className="px-4 py-3">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                                <Package className="w-4 h-4 text-purple-400" />
                                {language === 'th' ? 'สินค้าอื่นจากร้านนี้' : 'More from this seller'}
                            </h4>
                            <Link
                                href={`/shop/${seller.id}`}
                                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                            >
                                {language === 'th' ? 'ดูทั้งหมด' : 'View all'}
                                <ChevronRight className="w-3 h-3" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            {otherListings.map(item => (
                                <Link
                                    key={item.id}
                                    href={`/listing/${item.slug}`}
                                    className="group"
                                >
                                    <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-700">
                                        {item.thumbnail_url ? (
                                            <Image
                                                src={item.thumbnail_url}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-lg">
                                                📦
                                            </div>
                                        )}
                                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-1">
                                            <p className="text-white text-xs font-medium truncate">
                                                ฿{formatPrice(item.price)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* === POSTED DATE FULL (Desktop) === */}
            <div className="border-t border-slate-700/50 px-4 py-3">
                <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {language === 'th' ? 'ลงประกาศเมื่อ' : 'Posted on'}
                    </span>
                    <span className="text-gray-400">{formatThaiDateFull(postedDate)}</span>
                </div>
            </div>
        </div>
    )
}

export default UnifiedSellerCardV2

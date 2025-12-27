'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    ArrowLeft, Star, MessageCircle, Phone, Clock, MapPin,
    Shield, CheckCircle, Store, User, Calendar, Eye, Heart,
    Package, Loader2, AlertTriangle, ChevronRight, Share2
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { getListingsBySeller, UniversalListing } from '@/lib/listings'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// ==========================================
// TYPES
// ==========================================

interface SellerProfile {
    id: string
    display_name: string
    avatar_url?: string
    member_since: Date
    seller_type: 'individual' | 'general_store' | 'official_store'
    store_name?: string
    store_logo?: string
    description?: string
    location?: {
        province?: string
        amphoe?: string
    }
    stats?: {
        total_listings: number
        active_listings: number
        total_sold: number
        response_rate: number
        avg_response_time: string
    }
    verification?: {
        phone_verified: boolean
        id_verified: boolean
        store_verified: boolean
    }
    rating?: {
        average: number
        count: number
    }
}

// ==========================================
// SELLER HEADER
// ==========================================

interface SellerHeaderProps {
    seller: SellerProfile
    language: 'th' | 'en'
}

function SellerHeader({ seller, language }: SellerHeaderProps) {
    const isStore = seller.seller_type !== 'individual'

    // Format member since
    const formatMemberSince = (date: Date) => {
        const now = new Date()
        const months = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24 * 30))
        if (months < 1) return language === 'th' ? 'สมาชิกใหม่' : 'New member'
        if (months < 12) return language === 'th' ? `สมาชิก ${months} เดือน` : `${months} months`
        const years = Math.floor(months / 12)
        return language === 'th' ? `สมาชิก ${years} ปี` : `${years} years`
    }

    return (
        <div className="bg-gradient-to-br from-slate-800 to-purple-900/50 rounded-2xl p-6 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="relative flex flex-col md:flex-row items-start md:items-center gap-6">
                {/* Avatar */}
                <div className="relative">
                    {seller.store_logo || seller.avatar_url ? (
                        <Image
                            src={seller.store_logo || seller.avatar_url || ''}
                            alt={seller.store_name || seller.display_name}
                            width={100}
                            height={100}
                            className="rounded-2xl object-cover border-4 border-white/10"
                        />
                    ) : (
                        <div className="w-24 h-24 rounded-2xl bg-purple-500/30 flex items-center justify-center border-4 border-white/10">
                            {isStore ? (
                                <Store className="w-10 h-10 text-purple-300" />
                            ) : (
                                <User className="w-10 h-10 text-purple-300" />
                            )}
                        </div>
                    )}

                    {/* Verified Badge */}
                    {seller.verification?.id_verified && (
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-slate-800">
                            <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        {isStore ? (
                            <span className="px-2 py-0.5 bg-purple-500/30 text-purple-300 text-xs rounded-full">
                                {seller.seller_type === 'official_store'
                                    ? (language === 'th' ? '🏆 ร้านค้าอย่างเป็นทางการ' : '🏆 Official Store')
                                    : (language === 'th' ? '🏪 ร้านค้า' : '🏪 Store')
                                }
                            </span>
                        ) : (
                            <span className="px-2 py-0.5 bg-blue-500/30 text-blue-300 text-xs rounded-full">
                                {language === 'th' ? '👤 ผู้ขายทั่วไป' : '👤 Individual Seller'}
                            </span>
                        )}
                    </div>

                    <h1 className="text-2xl font-bold text-white">
                        {seller.store_name || seller.display_name}
                    </h1>

                    {seller.description && (
                        <p className="text-gray-400 mt-1 line-clamp-2">{seller.description}</p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {formatMemberSince(seller.member_since)}
                        </span>
                        {seller.location?.province && (
                            <span className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {seller.location.province}
                            </span>
                        )}
                        {seller.rating && seller.rating.count > 0 && (
                            <span className="flex items-center gap-1 text-yellow-400">
                                <Star className="w-4 h-4 fill-current" />
                                {seller.rating.average.toFixed(1)} ({seller.rating.count})
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors">
                        <Share2 className="w-5 h-5" />
                    </button>
                    <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium rounded-xl hover:opacity-90 transition-opacity flex items-center gap-2">
                        <MessageCircle className="w-5 h-5" />
                        {language === 'th' ? 'แชท' : 'Chat'}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ==========================================
// SELLER STATS
// ==========================================

interface SellerStatsProps {
    seller: SellerProfile
    listingsCount: number
    language: 'th' | 'en'
}

function SellerStats({ seller, listingsCount, language }: SellerStatsProps) {
    const stats = [
        {
            icon: <Package className="w-5 h-5" />,
            label: language === 'th' ? 'ประกาศทั้งหมด' : 'Total Listings',
            value: listingsCount
        },
        {
            icon: <CheckCircle className="w-5 h-5" />,
            label: language === 'th' ? 'ขายแล้ว' : 'Sold',
            value: seller.stats?.total_sold || 0
        },
        {
            icon: <Clock className="w-5 h-5" />,
            label: language === 'th' ? 'ตอบกลับเฉลี่ย' : 'Response',
            value: seller.stats?.avg_response_time || '--'
        },
        {
            icon: <Star className="w-5 h-5" />,
            label: language === 'th' ? 'คะแนน' : 'Rating',
            value: seller.rating?.average?.toFixed(1) || '--'
        }
    ]

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
                <div key={i} className="bg-slate-800/50 rounded-xl p-4 text-center">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2 text-purple-400">
                        {stat.icon}
                    </div>
                    <p className="text-xl font-bold text-white">{stat.value}</p>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
            ))}
        </div>
    )
}

// ==========================================
// VERIFICATION BADGES
// ==========================================

interface VerificationBadgesProps {
    verification?: SellerProfile['verification']
    language: 'th' | 'en'
}

function VerificationBadges({ verification, language }: VerificationBadgesProps) {
    if (!verification) return null

    const badges = [
        {
            key: 'phone_verified',
            icon: <Phone className="w-4 h-4" />,
            label: language === 'th' ? 'ยืนยันเบอร์โทร' : 'Phone Verified',
            color: 'text-green-400 bg-green-500/20'
        },
        {
            key: 'id_verified',
            icon: <Shield className="w-4 h-4" />,
            label: language === 'th' ? 'ยืนยันตัวตน' : 'ID Verified',
            color: 'text-blue-400 bg-blue-500/20'
        },
        {
            key: 'store_verified',
            icon: <Store className="w-4 h-4" />,
            label: language === 'th' ? 'ร้านค้ารับรอง' : 'Store Verified',
            color: 'text-purple-400 bg-purple-500/20'
        }
    ]

    const verifiedBadges = badges.filter(b => verification[b.key as keyof typeof verification])

    if (verifiedBadges.length === 0) return null

    return (
        <div className="flex flex-wrap gap-2">
            {verifiedBadges.map(badge => (
                <span
                    key={badge.key}
                    className={`px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5 ${badge.color}`}
                >
                    {badge.icon}
                    {badge.label}
                </span>
            ))}
        </div>
    )
}

// ==========================================
// LISTING CARD
// ==========================================

interface ListingCardProps {
    listing: UniversalListing
}

function ListingCard({ listing }: ListingCardProps) {
    return (
        <Link href={`/listing/${listing.slug}`} className="block group">
            <motion.div
                whileHover={{ y: -4 }}
                className="bg-slate-800/50 rounded-xl overflow-hidden border border-slate-700/50 hover:border-purple-500/50 transition-all"
            >
                {/* Image */}
                <div className="relative aspect-[4/3]">
                    {listing.thumbnail_url ? (
                        <Image
                            src={listing.thumbnail_url}
                            alt={listing.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full bg-slate-700 flex items-center justify-center text-4xl">
                            📷
                        </div>
                    )}

                    {/* Boost Badge */}
                    {listing.is_bumped && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                            ⚡ Boost
                        </span>
                    )}

                    {/* Status */}
                    {listing.status === 'sold' && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg transform -rotate-6">
                                ขายแล้ว
                            </span>
                        </div>
                    )}
                </div>

                {/* Info */}
                <div className="p-4">
                    <h3 className="font-semibold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                        {listing.title}
                    </h3>
                    <p className="text-lg font-bold text-purple-400 mt-1">
                        ฿{listing.price.toLocaleString()}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {listing.stats?.views || 0}
                        </span>
                        <span className="flex items-center gap-1">
                            <Heart className="w-4 h-4" />
                            {listing.stats?.favorites || 0}
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    )
}

// ==========================================
// MAIN PAGE CONTENT
// ==========================================

function PublicSellerProfileContent() {
    const params = useParams()
    const sellerId = params.id as string

    const { language } = useLanguage()

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [seller, setSeller] = useState<SellerProfile | null>(null)
    const [listings, setListings] = useState<UniversalListing[]>([])

    // Load seller data
    useEffect(() => {
        loadSellerData()
    }, [sellerId])

    const loadSellerData = async () => {
        if (!sellerId) return

        setLoading(true)
        setError(null)

        try {
            // Load user profile
            const userDoc = await getDoc(doc(db, 'users', sellerId))

            if (!userDoc.exists()) {
                setError(language === 'th' ? 'ไม่พบผู้ขาย' : 'Seller not found')
                return
            }

            const userData = userDoc.data()

            // Build seller profile
            const sellerProfile: SellerProfile = {
                id: sellerId,
                display_name: userData.displayName || userData.email || 'ผู้ขาย',
                avatar_url: userData.photoURL,
                member_since: userData.createdAt?.toDate?.() || new Date(),
                seller_type: userData.seller_type || 'individual',
                store_name: userData.store_name,
                store_logo: userData.store_logo,
                description: userData.bio || userData.store_description,
                location: {
                    province: userData.province,
                    amphoe: userData.amphoe
                },
                stats: {
                    total_listings: 0,
                    active_listings: 0,
                    total_sold: userData.total_sold || 0,
                    response_rate: userData.response_rate || 0,
                    avg_response_time: userData.avg_response_time || '< 1 ชม.'
                },
                verification: {
                    phone_verified: userData.phone_verified || false,
                    id_verified: userData.id_verified || false,
                    store_verified: userData.store_verified || false
                },
                rating: userData.rating
            }

            setSeller(sellerProfile)

            // Load seller listings
            const sellerListings = await getListingsBySeller(sellerId, 50)
            setListings(sellerListings)

        } catch (err) {
            console.error('Error loading seller:', err)
            setError(language === 'th' ? 'เกิดข้อผิดพลาด' : 'Error loading seller')
        } finally {
            setLoading(false)
        }
    }

    // Loading State
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

    // Error State
    if (error || !seller) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-white mb-2">
                        {language === 'th' ? 'ไม่พบผู้ขาย' : 'Seller Not Found'}
                    </h1>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {language === 'th' ? 'กลับหน้าแรก' : 'Back to Home'}
                    </Link>
                </div>
            </div>
        )
    }

    // Active listings only
    const activeListings = listings.filter(l => l.status === 'active')

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 pb-16">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
                <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-4">
                    <Link href="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-lg font-bold text-white">
                            {seller.store_name || seller.display_name}
                        </h1>
                        <p className="text-sm text-gray-400">
                            {activeListings.length} {language === 'th' ? 'ประกาศขาย' : 'listings'}
                        </p>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                {/* Seller Header */}
                <SellerHeader seller={seller} language={language as 'th' | 'en'} />

                {/* Stats */}
                <SellerStats
                    seller={seller}
                    listingsCount={listings.length}
                    language={language as 'th' | 'en'}
                />

                {/* Verification Badges */}
                <VerificationBadges
                    verification={seller.verification}
                    language={language as 'th' | 'en'}
                />

                {/* Listings Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Package className="w-5 h-5 text-purple-400" />
                            {language === 'th' ? 'ประกาศขาย' : 'Listings'}
                            <span className="text-sm font-normal text-gray-500">
                                ({activeListings.length})
                            </span>
                        </h2>
                    </div>

                    {activeListings.length === 0 ? (
                        <div className="text-center py-16 bg-slate-800/30 rounded-2xl">
                            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-500">
                                {language === 'th' ? 'ยังไม่มีประกาศ' : 'No listings yet'}
                            </p>
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {activeListings.map(listing => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    )
}

// ==========================================
// EXPORT WITH SUSPENSE
// ==========================================

export default function PublicSellerProfilePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        }>
            <PublicSellerProfileContent />
        </Suspense>
    )
}

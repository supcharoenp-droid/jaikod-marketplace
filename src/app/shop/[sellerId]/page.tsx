'use client'

/**
 * ============================================
 * SELLER SHOP PAGE - PREMIUM SHOWROOM V2
 * ============================================
 * 
 * Modern, professional seller profile page with:
 * - Customizable banner & logo
 * - Shop statistics dashboard
 * - Product grid gallery
 * - Featured/Recommended products
 * - Reviews section
 * - Trust score visualization
 */

import { useState, useEffect, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { doc, getDoc, collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { AnonymousSellerBadge } from '@/components/badges/AnonymousSellerBadge'
import { useChat } from '@/contexts/ChatContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import SmartProductCardV3 from '@/components/product/SmartProductCardV3'
import { toSmartProductData, SmartProductData } from '@/components/product/SmartProductCardV2'
import { listingToUnifiedProduct } from '@/services/unifiedMarketplace'
import { UniversalListing } from '@/lib/listings'
import {
    Star, ShieldCheck, MapPin, Clock, Package2,
    BadgeCheck, Heart, Flag, MessageCircle, Calendar,
    TrendingUp, Award, Users, ChevronLeft, Store,
    Share2, ExternalLink, Loader2, Grid3X3, List,
    Filter, SortDesc, Check, Camera, Sparkles,
    Car, Eye, ThumbsUp, Verified, Phone, Building2
} from 'lucide-react'

// ==========================================
// TYPES
// ==========================================

interface SellerProfile {
    id: string
    name: string
    displayName?: string
    avatar?: string
    bio?: string
    shopName?: string
    shopDescription?: string
    shopBanner?: string
    shopLogo?: string
    isVerified: boolean
    phoneVerified?: boolean
    idVerified?: boolean
    trustScore: number
    responseRate: number
    responseTimeMinutes: number
    totalListings: number
    successfulSales: number
    memberSince: Date
    lastActive?: Date
    location?: string
    province?: string
    badges: string[]
    rating: number
    reviewCount: number
    followers: number
    specialties?: string[]
    businessType?: 'personal' | 'dealer' | 'showroom'
}

// ==========================================
// CONSTANTS
// ==========================================

const DEFAULT_BANNER = 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1200'
const CATEGORY_ICONS: Record<string, string> = {
    'cars': '🚗',
    'motorcycles': '🏍️',
    'property': '🏠',
    'electronics': '📱',
    'fashion': '👗',
    'other': '📦'
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

// Shop Statistics Card
function StatCard({ icon: Icon, value, label, trend, color = 'purple' }: {
    icon: React.ElementType
    value: string | number
    label: string
    trend?: number
    color?: string
}) {
    const colorClasses = {
        purple: 'from-purple-500/20 to-indigo-500/20 text-purple-400',
        green: 'from-green-500/20 to-emerald-500/20 text-green-400',
        blue: 'from-blue-500/20 to-cyan-500/20 text-blue-400',
        amber: 'from-amber-500/20 to-yellow-500/20 text-amber-400',
    }

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} backdrop-blur-xl rounded-2xl p-4 border border-white/10`}
        >
            <div className="flex items-center justify-between mb-2">
                <Icon className="w-5 h-5 opacity-80" />
                {trend !== undefined && (
                    <span className={`text-xs ${trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
                    </span>
                )}
            </div>
            <div className="text-2xl font-bold text-white">{value}</div>
            <div className="text-xs text-gray-400 mt-1">{label}</div>
        </motion.div>
    )
}

// Trust Score Gauge
function TrustScoreGauge({ score, size = 'md' }: { score: number; size?: 'sm' | 'md' | 'lg' }) {
    const sizeClasses = {
        sm: 'w-16 h-16 text-sm',
        md: 'w-24 h-24 text-lg',
        lg: 'w-32 h-32 text-2xl'
    }

    const getColor = () => {
        if (score >= 80) return 'text-green-500'
        if (score >= 60) return 'text-amber-500'
        return 'text-red-500'
    }

    const circumference = 2 * Math.PI * 40
    const offset = circumference - (score / 100) * circumference

    return (
        <div className={`relative ${sizeClasses[size]} flex items-center justify-center`}>
            <svg className="absolute transform -rotate-90" viewBox="0 0 100 100">
                <circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-gray-700"
                />
                <motion.circle
                    cx="50" cy="50" r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                    className={getColor()}
                />
            </svg>
            <div className="relative text-center">
                <span className={`font-bold ${getColor()}`}>{score}</span>
                <span className="text-xs text-gray-400 block">/100</span>
            </div>
        </div>
    )
}

// Product Category Pills
function CategoryFilter({ categories, selected, onSelect }: {
    categories: { id: string; name: string; count: number }[]
    selected: string | null
    onSelect: (id: string | null) => void
}) {
    return (
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => onSelect(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selected === null
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
            >
                ทั้งหมด
            </button>
            {categories.map(cat => (
                <button
                    key={cat.id}
                    onClick={() => onSelect(cat.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-1 ${selected === cat.id
                        ? 'bg-purple-600 text-white'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                >
                    <span>{CATEGORY_ICONS[cat.id] || '📦'}</span>
                    {cat.name}
                    <span className="text-xs opacity-70">({cat.count})</span>
                </button>
            ))}
        </div>
    )
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ShopPage() {
    const params = useParams()
    const router = useRouter()
    const sellerId = params.sellerId as string
    const { language } = useLanguage()
    const { user } = useAuth()
    const { startConversation, selectConversation } = useChat()
    const lang = language as 'th' | 'en'

    // State
    const [seller, setSeller] = useState<SellerProfile | null>(null)
    const [listings, setListings] = useState<UniversalListing[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'about'>('listings')
    const [isFollowing, setIsFollowing] = useState(false)
    const [isChatting, setIsChatting] = useState(false)
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState<'newest' | 'price-low' | 'price-high'>('newest')

    // Load seller data
    useEffect(() => {
        if (sellerId) {
            loadSellerData()
        }
    }, [sellerId])

    const loadSellerData = async () => {
        setLoading(true)
        try {
            // Load listings from both collections FIRST (to get real count)
            const [listingsSnap, productsSnap] = await Promise.all([
                getDocs(query(
                    collection(db, 'listings'),
                    where('seller_id', '==', sellerId),
                    where('status', '==', 'active'),
                    orderBy('created_at', 'desc')
                )),
                getDocs(query(
                    collection(db, 'products'),
                    where('seller_id', '==', sellerId),
                    where('status', '==', 'active'),
                    orderBy('createdAt', 'desc')
                ))
            ])

            const allListings: UniversalListing[] = []

            // Process listings collection
            listingsSnap.forEach(doc => {
                const data = doc.data()
                allListings.push({
                    id: doc.id,
                    ...data,
                    created_at: data.created_at?.toDate?.() || new Date(),
                    updated_at: data.updated_at?.toDate?.() || new Date(),
                } as UniversalListing)
            })

            // Process products collection
            productsSnap.forEach(doc => {
                const data = doc.data()
                allListings.push({
                    id: doc.id,
                    listing_code: `P-${doc.id.slice(-6).toUpperCase()}`,
                    title: data.title,
                    slug: data.slug || doc.id,
                    description: data.description,
                    price: data.price,
                    category_id: data.categoryId,
                    subcategory_id: data.subcategoryId,
                    status: data.status,
                    seller_id: data.seller_id,
                    images: data.images || (data.thumbnailUrl ? [{ url: data.thumbnailUrl }] : []),
                    thumbnail_url: data.thumbnailUrl,
                    location: data.location,
                    template_data: data.details || {},
                    created_at: data.createdAt?.toDate?.() || new Date(),
                    updated_at: data.updatedAt?.toDate?.() || new Date(),
                    view_count: data.viewCount || 0,
                    like_count: data.likes || 0,
                    save_count: data.saves || 0,
                } as unknown as UniversalListing)
            })

            setListings(allListings)
            const realListingCount = allListings.length

            // Load seller profile
            const userDoc = await getDoc(doc(db, 'users', sellerId))
            if (userDoc.exists()) {
                const data = userDoc.data()
                // Smart name fallback: displayName > name > shopName > email prefix > UID prefix
                const emailPrefix = data.email ? data.email.split('@')[0] : null
                const uidPrefix = sellerId.slice(0, 8)
                const smartName = data.displayName || data.name || data.shopName || emailPrefix || `ร้าน${uidPrefix}`

                // Smart response time (cap at 60 minutes for display)
                const rawResponseTime = data.responseTimeMinutes || data.response_time_minutes || 30
                const displayResponseTime = rawResponseTime > 120 ? 60 : rawResponseTime

                setSeller({
                    id: sellerId,
                    name: smartName,
                    displayName: data.displayName || data.name || emailPrefix,
                    avatar: data.avatar || data.photoURL,
                    bio: data.bio,
                    shopName: data.shopName || smartName,
                    shopDescription: data.shopDescription || data.bio,
                    shopBanner: data.shopBanner,
                    shopLogo: data.shopLogo || data.avatar || data.photoURL,
                    isVerified: data.isVerified || data.verified || false,
                    phoneVerified: data.phoneVerified || data.phone_verified || false,
                    idVerified: data.idVerified || data.id_verified || false,
                    trustScore: data.trustScore || data.trust_score || 50,
                    responseRate: data.responseRate || data.response_rate || 80,
                    responseTimeMinutes: displayResponseTime,
                    totalListings: realListingCount, // Use REAL count from query
                    successfulSales: data.successfulSales || data.successful_sales || 0,
                    memberSince: data.createdAt?.toDate?.() || data.created_at?.toDate?.() || new Date(),
                    lastActive: data.lastActive?.toDate?.() || data.last_active?.toDate?.(),
                    location: data.location,
                    province: data.province,
                    badges: data.badges || [],
                    rating: data.rating || 0,
                    reviewCount: data.reviewCount || data.review_count || 0,
                    followers: data.followers || data.followers_count || 0,
                    specialties: data.specialties || [],
                    businessType: data.businessType || 'personal'
                })
            } else {
                // Create a placeholder seller from listings data
                const firstListing = allListings[0]
                const firstListingData = firstListing as any
                setSeller({
                    id: sellerId,
                    name: firstListingData?.seller_name || 'ผู้ขาย',
                    displayName: firstListingData?.seller_name,
                    isVerified: false,
                    phoneVerified: false,
                    idVerified: false,
                    trustScore: 50,
                    responseRate: 80,
                    responseTimeMinutes: 60,
                    totalListings: realListingCount,
                    successfulSales: 0,
                    memberSince: new Date(),
                    badges: [],
                    rating: 0,
                    reviewCount: 0,
                    followers: 0,
                    businessType: 'personal'
                })
            }

        } catch (error) {
            console.error('Error loading seller:', error)
        } finally {
            setLoading(false)
        }
    }

    // Calculate categories from listings
    const categories = useMemo(() => {
        const catMap = new Map<string, { name: string; count: number }>()

        // Enhanced category mapping (id -> Thai name)
        const CATEGORY_NAME_MAP: Record<string, string> = {
            '2': 'รถยนต์',
            'car': 'รถยนต์',
            '3': 'มอเตอร์ไซค์',
            'motorcycle': 'มอเตอร์ไซค์',
            '11': 'อสังหาริมทรัพย์',
            'property': 'อสังหาริมทรัพย์',
            '5': 'อิเล็กทรอนิกส์',
            'electronics': 'อิเล็กทรอนิกส์',
            'mobile': 'โทรศัพท์มือถือ',
            'fashion': 'แฟชั่น',
        }

        listings.forEach(listing => {
            // Use category_type or category_id
            const catType = listing.category_type || ''
            const catId = listing.category_id?.toString() || catType || 'other'
            const catName = CATEGORY_NAME_MAP[catType] || CATEGORY_NAME_MAP[catId] || 'อื่นๆ'

            if (catMap.has(catId)) {
                catMap.get(catId)!.count++
            } else {
                catMap.set(catId, { name: catName, count: 1 })
            }
        })
        return Array.from(catMap.entries()).map(([id, data]) => ({
            id,
            name: data.name,
            count: data.count
        }))
    }, [listings])

    // Filter and sort listings
    const filteredListings = useMemo(() => {
        let result = [...listings]

        // Filter by category
        if (selectedCategory) {
            result = result.filter(l => l.category_id?.toString() === selectedCategory)
        }

        // Sort
        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => (a.price || 0) - (b.price || 0))
                break
            case 'price-high':
                result.sort((a, b) => (b.price || 0) - (a.price || 0))
                break
            default:
                result.sort((a, b) =>
                    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
                )
        }

        return result
    }, [listings, selectedCategory, sortBy])

    // Featured listings (top 3 by views)
    const featuredListings = useMemo(() => {
        return [...listings]
            .sort((a, b) => ((b as any).view_count || (b.stats as any)?.views || 0) - ((a as any).view_count || (a.stats as any)?.views || 0))
            .slice(0, 3)
    }, [listings])

    // Handle chat
    const handleChat = async () => {
        if (!user) {
            router.push('/login')
            return
        }
        if (user.uid === sellerId) return

        setIsChatting(true)
        try {
            const convoId = await startConversation(sellerId as any, seller?.name || 'ผู้ขาย')
            if (convoId) {
                selectConversation(convoId)
                router.push(`/chat?conversation=${convoId}`)
            }
        } catch (error) {
            console.error('Chat error:', error)
        } finally {
            setIsChatting(false)
        }
    }

    // Handle follow
    const handleFollow = () => {
        setIsFollowing(!isFollowing)
        // TODO: Implement follow functionality
    }

    // Handle share
    const handleShare = async () => {
        if (navigator.share) {
            await navigator.share({
                title: seller?.shopName || 'ร้านค้า',
                url: window.location.href
            })
        } else {
            navigator.clipboard.writeText(window.location.href)
            // TODO: Show toast
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

    // Not found
    if (!seller) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
                <Header />
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
                    <Store className="w-16 h-16 text-gray-500 mb-4" />
                    <h1 className="text-2xl font-bold text-white mb-4">
                        {lang === 'th' ? 'ไม่พบร้านค้า' : 'Shop Not Found'}
                    </h1>
                    <Link href="/" className="text-purple-400 hover:underline">
                        ← {lang === 'th' ? 'กลับหน้าแรก' : 'Back to Home'}
                    </Link>
                </div>
                <Footer />
            </div>
        )
    }

    const isOwner = user?.uid === sellerId

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
            <Header />

            {/*  Shop Banner */}
            <section className="relative h-48 md:h-64 lg:h-80 overflow-hidden">
                {/* Banner Image */}
                <div className="absolute inset-0">
                    <Image
                        src={seller.shopBanner || DEFAULT_BANNER}
                        alt="Shop Banner"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                </div>

                {/* Owner Edit Button */}
                {isOwner && (
                    <Link
                        href="/profile/settings"
                        className="absolute top-4 right-4 px-4 py-2 bg-white/10 backdrop-blur-md rounded-xl text-white text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
                    >
                        <Camera className="w-4 h-4" />
                        {lang === 'th' ? 'แก้ไขแบนเนอร์' : 'Edit Banner'}
                    </Link>
                )}
            </section>

            {/* Shop Header */}
            <section className="relative -mt-20 px-4 md:px-8 max-w-7xl mx-auto">
                <div className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-6 md:gap-8">
                        {/* Shop Logo */}
                        <div className="flex-shrink-0">
                            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl overflow-hidden border-4 border-purple-500 shadow-lg shadow-purple-500/30">
                                {seller.shopLogo ? (
                                    <Image
                                        src={seller.shopLogo}
                                        alt={seller.shopName || 'Shop'}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-white">
                                            {(seller.shopName || seller.name || 'S').charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                {/* Verified Badge */}
                                {seller.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Shop Info */}
                        <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-white">
                                    {seller.shopName || seller.name}
                                </h1>

                                {/* Badges */}
                                {seller.isVerified && (
                                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full flex items-center gap-1">
                                        <Verified className="w-3 h-3" />
                                        ยืนยันตัวตน
                                    </span>
                                )}
                                {seller.businessType === 'dealer' && (
                                    <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full flex items-center gap-1">
                                        <Building2 className="w-3 h-3" />
                                        เต็นท์รถ
                                    </span>
                                )}
                            </div>

                            {/* Description */}
                            {seller.shopDescription && (
                                <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                    {seller.shopDescription}
                                </p>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                                {seller.province && (
                                    <span className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        {seller.province}
                                    </span>
                                )}
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    สมาชิกตั้งแต่ {seller.memberSince.toLocaleDateString('th-TH', { year: 'numeric', month: 'short' })}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {seller.responseTimeMinutes <= 30 ? (
                                        <span className="text-green-400">ตอบกลับเร็วมาก!</span>
                                    ) : seller.responseTimeMinutes <= 60 ? (
                                        <span>ตอบกลับภายใน 1 ชม.</span>
                                    ) : (
                                        <span>ตอบกลับภายในไม่กี่ชั่วโมง</span>
                                    )}
                                </span>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={handleChat}
                                    disabled={isChatting || isOwner}
                                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isChatting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <MessageCircle className="w-4 h-4" />
                                    )}
                                    แชท
                                </button>
                                <button
                                    onClick={handleFollow}
                                    className={`px-6 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all ${isFollowing
                                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/50'
                                        : 'bg-white/10 text-white hover:bg-white/20'
                                        }`}
                                >
                                    <Heart className={`w-4 h-4 ${isFollowing ? 'fill-pink-400' : ''}`} />
                                    {isFollowing ? 'ติดตามแล้ว' : 'ติดตาม'}
                                    {seller.followers > 0 && (
                                        <span className="text-xs opacity-70">({seller.followers})</span>
                                    )}
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="px-4 py-2.5 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                                >
                                    <Share2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Trust Score */}
                        <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-4 md:p-6">
                            <TrustScoreGauge score={seller.trustScore} size="md" />
                            <span className="text-xs text-gray-400 mt-2">Trust Score</span>
                            {seller.rating > 0 && (
                                <div className="flex items-center gap-1 mt-2">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="text-white font-medium">{seller.rating.toFixed(1)}</span>
                                    <span className="text-xs text-gray-400">({seller.reviewCount})</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Statistics Cards */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto mt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                        icon={Package2}
                        value={listings.length}
                        label="ประกาศทั้งหมด"
                        color="purple"
                    />
                    <StatCard
                        icon={TrendingUp}
                        value={seller.successfulSales}
                        label="ขายแล้ว"
                        trend={12}
                        color="green"
                    />
                    <StatCard
                        icon={Eye}
                        value={listings.reduce((sum, l) => sum + ((l as any).view_count || (l.stats as any)?.views || 0), 0).toLocaleString()}
                        label="ยอดวิวทั้งหมด"
                        trend={8}
                        color="blue"
                    />
                    <StatCard
                        icon={ThumbsUp}
                        value={`${seller.responseRate}%`}
                        label="อัตราตอบกลับ"
                        color="amber"
                    />
                </div>
            </section>

            {/* Featured Products */}
            {featuredListings.length > 0 && (
                <section className="px-4 md:px-8 max-w-7xl mx-auto mt-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-amber-400" />
                        <h2 className="text-xl font-bold text-white">
                            {lang === 'th' ? 'แนะนำจากร้านนี้' : 'Featured'}
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {featuredListings.map((listing, index) => (
                            <motion.div
                                key={listing.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <SmartProductCardV3
                                    product={toSmartProductData(listingToUnifiedProduct(listing))}
                                />
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* Tabs & Listings */}
            <section className="px-4 md:px-8 max-w-7xl mx-auto mt-8 pb-8">
                {/* Tabs */}
                <div className="flex items-center gap-4 border-b border-white/10 mb-6">
                    {['listings', 'reviews', 'about'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-3 font-medium transition-colors relative ${activeTab === tab
                                ? 'text-purple-400'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            {tab === 'listings' && `ประกาศ (${listings.length})`}
                            {tab === 'reviews' && `รีวิว (${seller.reviewCount})`}
                            {tab === 'about' && 'เกี่ยวกับร้าน'}

                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-500"
                                />
                            )}
                        </button>
                    ))}
                </div>

                {/* Listings Tab */}
                <AnimatePresence mode="wait">
                    {activeTab === 'listings' && (
                        <motion.div
                            key="listings"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {/* Filter Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                                <CategoryFilter
                                    categories={categories}
                                    selected={selectedCategory}
                                    onSelect={setSelectedCategory}
                                />

                                <div className="flex items-center gap-2">
                                    {/* Sort */}
                                    <select
                                        value={sortBy}
                                        onChange={e => setSortBy(e.target.value as any)}
                                        className="px-4 py-2 bg-white/10 rounded-xl text-white text-sm border-0 focus:ring-2 focus:ring-purple-500"
                                    >
                                        <option value="newest">ล่าสุด</option>
                                        <option value="price-low">ราคาต่ำ-สูง</option>
                                        <option value="price-high">ราคาสูง-ต่ำ</option>
                                    </select>

                                    {/* View Mode */}
                                    <div className="flex bg-white/10 rounded-xl p-1">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}
                                        >
                                            <Grid3X3 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-purple-500 text-white' : 'text-gray-400'}`}
                                        >
                                            <List className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {filteredListings.length === 0 ? (
                                <div className="text-center py-12">
                                    <Package2 className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                                    <p className="text-gray-400">ยังไม่มีสินค้าในหมวดนี้</p>
                                </div>
                            ) : (
                                <div className={viewMode === 'grid'
                                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                                    : 'space-y-4'
                                }>
                                    {filteredListings.map((listing, index) => (
                                        <motion.div
                                            key={listing.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <SmartProductCardV3
                                                product={toSmartProductData(listingToUnifiedProduct(listing))}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* Reviews Tab */}
                    {activeTab === 'reviews' && (
                        <motion.div
                            key="reviews"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center py-12"
                        >
                            <Star className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                            <p className="text-gray-400 mb-2">ยังไม่มีรีวิว</p>
                            <p className="text-gray-500 text-sm">เป็นคนแรกที่รีวิวร้านนี้!</p>
                        </motion.div>
                    )}

                    {/* About Tab */}
                    {activeTab === 'about' && (
                        <motion.div
                            key="about"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid md:grid-cols-2 gap-6"
                        >
                            {/* Shop Info */}
                            <div className="bg-white/5 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">ข้อมูลร้านค้า</h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm text-gray-400">ชื่อร้าน</label>
                                        <p className="text-white">{seller.shopName || seller.name}</p>
                                    </div>
                                    {seller.shopDescription && (
                                        <div>
                                            <label className="text-sm text-gray-400">รายละเอียด</label>
                                            <p className="text-white">{seller.shopDescription}</p>
                                        </div>
                                    )}
                                    {seller.province && (
                                        <div>
                                            <label className="text-sm text-gray-400">พื้นที่ให้บริการ</label>
                                            <p className="text-white">{seller.province}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Trust Info */}
                            <div className="bg-white/5 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-4">ความน่าเชื่อถือ</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">อัตราตอบกลับ</span>
                                        <span className="text-white font-medium">{seller.responseRate}%</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">เวลาตอบกลับ</span>
                                        <span className="text-white font-medium">~{seller.responseTimeMinutes} นาที</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">ยืนยันตัวตน</span>
                                        <span className={seller.isVerified ? 'text-green-400' : 'text-gray-500'}>
                                            {seller.isVerified ? '✓ ยืนยันแล้ว' : 'ยังไม่ยืนยัน'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-400">สมาชิกมา</span>
                                        <span className="text-white font-medium">
                                            {Math.floor((Date.now() - seller.memberSince.getTime()) / (1000 * 60 * 60 * 24 * 30))} เดือน
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <Footer />
        </div>
    )
}

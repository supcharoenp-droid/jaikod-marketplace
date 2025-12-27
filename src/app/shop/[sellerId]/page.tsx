'use client'

/**
 * SELLER SHOP / PROFILE PAGE
 * 
 * Shows seller's public profile with:
 * - Seller info (name, avatar, verification status)
 * - Trust score and statistics
 * - All listings from this seller
 * - Reviews from buyers
 */

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { doc, getDoc, collection, query, where, orderBy, limit, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { useChat } from '@/contexts/ChatContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import UnifiedProductCard from '@/components/product/UnifiedProductCard'
import { listingToUnifiedProduct } from '@/services/unifiedMarketplace'
import { UniversalListing } from '@/lib/listings'
import {
    Star, ShieldCheck, MapPin, Clock, Package2,
    BadgeCheck, Heart, Flag, MessageCircle, Calendar,
    TrendingUp, Award, Users, ChevronLeft, Store,
    Share2, ExternalLink, Loader2
} from 'lucide-react'

// ==========================================
// TYPES
// ==========================================

interface SellerProfile {
    id: string
    name: string
    avatar?: string
    bio?: string
    shopName?: string
    shopDescription?: string
    isVerified: boolean
    trustScore: number
    responseRate: number
    responseTimeMinutes: number
    totalListings: number
    successfulSales: number
    memberSince: Date
    lastActive?: Date
    location?: string
    badges: string[]
    rating: number
    reviewCount: number
    followers: number
}

interface SellerReview {
    id: string
    buyerId: string
    buyerName: string
    buyerAvatar?: string
    rating: number
    comment: string
    createdAt: Date
    productTitle?: string
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
    const [reviews, setReviews] = useState<SellerReview[]>([])
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'about'>('listings')
    const [isFollowing, setIsFollowing] = useState(false)
    const [isChatting, setIsChatting] = useState(false)

    // Translations
    const t = {
        shopNotFound: lang === 'th' ? 'ไม่พบร้านค้า' : 'Shop Not Found',
        backToHome: lang === 'th' ? 'กลับหน้าแรก' : 'Back to Home',
        memberSince: lang === 'th' ? 'สมาชิกตั้งแต่' : 'Member since',
        trustScore: lang === 'th' ? 'คะแนนความน่าเชื่อถือ' : 'Trust Score',
        listings: lang === 'th' ? 'ประกาศ' : 'Listings',
        sold: lang === 'th' ? 'ขายแล้ว' : 'Sold',
        responseRate: lang === 'th' ? 'ตอบกลับ' : 'Response',
        allListings: lang === 'th' ? 'ประกาศทั้งหมด' : 'All Listings',
        reviewsTab: lang === 'th' ? 'รีวิว' : 'Reviews',
        about: lang === 'th' ? 'เกี่ยวกับ' : 'About',
        follow: lang === 'th' ? 'ติดตาม' : 'Follow',
        following: lang === 'th' ? 'ติดตามแล้ว' : 'Following',
        chat: lang === 'th' ? 'แชท' : 'Chat',
        report: lang === 'th' ? 'รายงาน' : 'Report',
        noListings: lang === 'th' ? 'ยังไม่มีประกาศ' : 'No listings yet',
        noReviews: lang === 'th' ? 'ยังไม่มีรีวิว' : 'No reviews yet',
        verified: lang === 'th' ? 'ยืนยันตัวตน' : 'Verified',
        fastResponse: lang === 'th' ? 'ตอบเร็ว' : 'Fast Response',
        topSeller: lang === 'th' ? 'ผู้ขายยอดเยี่ยม' : 'Top Seller',
        followers: lang === 'th' ? 'ผู้ติดตาม' : 'Followers',
        share: lang === 'th' ? 'แชร์' : 'Share',
        loading: lang === 'th' ? 'กำลังโหลด...' : 'Loading...',
    }

    // Fetch seller data
    useEffect(() => {
        async function fetchSellerData() {
            if (!sellerId) return

            setLoading(true)
            try {
                // 1. Fetch seller profile from users collection
                const userDocRef = doc(db, 'users', sellerId)
                const userDocSnap = await getDoc(userDocRef)

                if (!userDocSnap.exists()) {
                    // Seller not found - not an error, just a normal case
                    console.log('[Shop] Seller not found:', sellerId)
                    setLoading(false)
                    return
                }

                const userData = userDocSnap.data()
                const memberSince = userData.createdAt instanceof Timestamp
                    ? userData.createdAt.toDate()
                    : new Date(userData.createdAt?.seconds ? userData.createdAt.seconds * 1000 : Date.now())

                const sellerProfile: SellerProfile = {
                    id: sellerId,
                    name: userData.displayName || userData.shopName || 'ผู้ขาย',
                    avatar: userData.photoURL || userData.shopLogo,
                    bio: userData.bio,
                    shopName: userData.shopName,
                    shopDescription: userData.shopDescription,
                    isVerified: userData.isVerified || false,
                    trustScore: userData.trustScore || 50,
                    responseRate: userData.responseRate || 80,
                    responseTimeMinutes: userData.responseTimeMinutes || 60,
                    totalListings: userData.productCount || 0,
                    successfulSales: userData.successfulSales || 0,
                    memberSince,
                    lastActive: userData.lastActive?.toDate?.(),
                    location: userData.province || userData.location,
                    badges: userData.badges || [],
                    rating: userData.rating || 0,
                    reviewCount: userData.reviewCount || 0,
                    followers: userData.followers || 0,
                }

                setSeller(sellerProfile)

                // 2. Fetch seller's listings
                const listingsQuery = query(
                    collection(db, 'listings'),
                    where('seller_id', '==', sellerId),
                    where('status', '==', 'active'),
                    orderBy('created_at', 'desc'),
                    limit(50)
                )
                const listingsSnap = await getDocs(listingsQuery)
                const fetchedListings: UniversalListing[] = []

                listingsSnap.docs.forEach(doc => {
                    const data = doc.data()
                    const createdAt = data.created_at instanceof Timestamp
                        ? data.created_at.toDate()
                        : new Date()

                    fetchedListings.push({
                        id: doc.id,
                        ...data,
                        created_at: createdAt,
                        updated_at: data.updated_at?.toDate?.() || createdAt,
                    } as UniversalListing)
                })

                setListings(fetchedListings)

                // Update total listings count
                if (fetchedListings.length !== sellerProfile.totalListings) {
                    sellerProfile.totalListings = fetchedListings.length
                    setSeller({ ...sellerProfile })
                }

                // 3. Fetch reviews (if collection exists)
                try {
                    const reviewsQuery = query(
                        collection(db, 'reviews'),
                        where('sellerId', '==', sellerId),
                        orderBy('createdAt', 'desc'),
                        limit(20)
                    )
                    const reviewsSnap = await getDocs(reviewsQuery)
                    const fetchedReviews: SellerReview[] = []

                    reviewsSnap.docs.forEach(doc => {
                        const data = doc.data()
                        fetchedReviews.push({
                            id: doc.id,
                            buyerId: data.buyerId,
                            buyerName: data.buyerName || 'ผู้ซื้อ',
                            buyerAvatar: data.buyerAvatar,
                            rating: data.rating || 5,
                            comment: data.comment || '',
                            createdAt: data.createdAt?.toDate?.() || new Date(),
                            productTitle: data.productTitle,
                        })
                    })

                    setReviews(fetchedReviews)
                } catch (e) {
                    // Reviews collection might not exist yet
                    console.log('Reviews not available yet')
                }

            } catch (error) {
                console.error('Error fetching seller data:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSellerData()
    }, [sellerId])

    // Format date
    const formatDate = (date: Date) => {
        const months_th = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
        const months_en = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const year = lang === 'th' ? date.getFullYear() + 543 : date.getFullYear()
        const month = lang === 'th' ? months_th[date.getMonth()] : months_en[date.getMonth()]
        return `${month} ${year}`
    }

    // Handle share
    const handleShare = async () => {
        const url = `${window.location.origin}/shop/${sellerId}`
        if (navigator.share) {
            await navigator.share({
                title: seller?.name || 'ร้านค้า',
                url,
            })
        } else {
            await navigator.clipboard.writeText(url)
            alert(lang === 'th' ? 'คัดลอกลิงก์แล้ว' : 'Link copied!')
        }
    }

    // Handle chat with seller
    const handleChat = async () => {
        if (!seller) return
        if (!user) {
            router.push(`/login?redirect=/shop/${sellerId}`)
            return
        }
        if (user.uid === sellerId) return // Can't chat with yourself

        setIsChatting(true)
        try {
            const conversationId = await startConversation(
                {
                    id: sellerId,
                    name: seller.name,
                    avatar: seller.avatar
                }
            )
            selectConversation(conversationId)
        } catch (err) {
            console.error('Error starting chat:', err)
        } finally {
            setIsChatting(false)
        }
    }

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">{t.loading}</p>
                </div>
            </div>
        )
    }

    // Not found state
    if (!seller) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
                    <div className="text-6xl mb-4">🏪</div>
                    <h1 className="text-2xl font-bold text-white mb-2">{t.shopNotFound}</h1>
                    <Link href="/" className="mt-4 px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-white font-medium">
                        {t.backToHome}
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }

    // Calculate rating stars
    const rating = Math.min(5, Math.max(0, seller.trustScore / 20))

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Link href="/" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                            <ChevronLeft className="w-5 h-5 text-gray-400" />
                        </Link>
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                            <Link href="/" className="hover:text-white">🏠 JaiKod</Link>
                            <span>/</span>
                            <span className="text-white">{seller.name}</span>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 py-6">
                {/* Shop Header Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-800/80 rounded-3xl overflow-hidden border border-slate-700/50 mb-6">
                    {/* Banner */}
                    <div className="relative h-32 md:h-48 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400">
                        <div className="absolute inset-0 bg-black/20" />
                    </div>

                    {/* Profile Info */}
                    <div className="relative px-4 md:px-8 pb-6">
                        {/* Avatar */}
                        <div className="relative -mt-16 md:-mt-20 mb-4">
                            <div className="w-28 h-28 md:w-36 md:h-36 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 p-1 shadow-2xl">
                                <div className="w-full h-full rounded-2xl bg-slate-800 flex items-center justify-center overflow-hidden">
                                    {seller.avatar ? (
                                        <Image
                                            src={seller.avatar}
                                            alt={seller.name}
                                            width={144}
                                            height={144}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-5xl font-bold text-white">
                                            {seller.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Verified Badge */}
                            {seller.isVerified && (
                                <div className="absolute bottom-0 right-0 w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center border-4 border-slate-800 shadow-lg">
                                    <BadgeCheck className="w-5 h-5 text-white" />
                                </div>
                            )}
                        </div>

                        {/* Name & Badges */}
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                            <div>
                                <div className="flex items-center gap-3 mb-2">
                                    <h1 className="text-2xl md:text-3xl font-bold text-white">{seller.name}</h1>
                                    {seller.isVerified && (
                                        <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full flex items-center gap-1">
                                            <ShieldCheck className="w-4 h-4" />
                                            {t.verified}
                                        </span>
                                    )}
                                </div>

                                {/* Location & Member Since */}
                                <div className="flex flex-wrap items-center gap-3 text-gray-400 text-sm">
                                    {seller.location && (
                                        <span className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            {seller.location}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {t.memberSince} {formatDate(seller.memberSince)}
                                    </span>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {seller.responseTimeMinutes <= 60 && (
                                        <span className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 text-xs rounded-full border border-cyan-500/30">
                                            <Clock className="w-3.5 h-3.5" />
                                            {t.fastResponse}
                                        </span>
                                    )}
                                    {seller.successfulSales >= 10 && (
                                        <span className="flex items-center gap-1 px-3 py-1.5 bg-amber-500/10 text-amber-400 text-xs rounded-full border border-amber-500/30">
                                            <Award className="w-3.5 h-3.5" />
                                            {t.topSeller}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-2">
                                {/* Chat Button - Only show if not owner */}
                                {user?.uid !== sellerId && (
                                    <button
                                        onClick={handleChat}
                                        disabled={isChatting}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-purple-500 hover:bg-purple-600 disabled:opacity-50 rounded-xl font-medium text-white transition-colors"
                                    >
                                        {isChatting ? (
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                        ) : (
                                            <MessageCircle className="w-4 h-4" />
                                        )}
                                        {t.chat}
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsFollowing(!isFollowing)}
                                    className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium transition-colors ${isFollowing
                                        ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30'
                                        : 'bg-slate-700 hover:bg-slate-600 text-white'
                                        }`}
                                >
                                    <Heart className={`w-4 h-4 ${isFollowing ? 'fill-current' : ''}`} />
                                    {isFollowing ? t.following : t.follow}
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-gray-300 transition-colors"
                                    title={t.share}
                                >
                                    <Share2 className="w-5 h-5" />
                                </button>
                                <button
                                    className="p-2.5 bg-slate-700 hover:bg-slate-600 rounded-xl text-gray-300 transition-colors"
                                    title={t.report}
                                >
                                    <Flag className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="px-4 md:px-8 pb-6">
                        {/* Trust Score */}
                        <div className="mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-400">{t.trustScore}</span>
                                <span className="text-lg font-bold text-white">{seller.trustScore}/100</span>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                                    style={{ width: `${seller.trustScore}%` }}
                                />
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                                <Package2 className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                                <div className="text-xl font-bold text-white">{seller.totalListings}</div>
                                <div className="text-xs text-gray-400">{t.listings}</div>
                            </div>
                            <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                                <TrendingUp className="w-6 h-6 text-green-400 mx-auto mb-2" />
                                <div className="text-xl font-bold text-white">{seller.successfulSales}</div>
                                <div className="text-xs text-gray-400">{t.sold}</div>
                            </div>
                            <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                                <MessageCircle className="w-6 h-6 text-cyan-400 mx-auto mb-2" />
                                <div className="text-xl font-bold text-emerald-400">{seller.responseRate}%</div>
                                <div className="text-xs text-gray-400">{t.responseRate}</div>
                            </div>
                            <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                                <Star className="w-6 h-6 text-yellow-400 mx-auto mb-2" />
                                <div className="text-xl font-bold text-white">{rating.toFixed(1)}</div>
                                <div className="text-xs text-gray-400">{seller.reviewCount} {t.reviewsTab}</div>
                            </div>
                            <div className="text-center p-4 bg-slate-900/50 rounded-xl">
                                <Users className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                                <div className="text-xl font-bold text-white">{seller.followers}</div>
                                <div className="text-xs text-gray-400">{t.followers}</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                    {(['listings', 'reviews', 'about'] as const).map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-3 rounded-xl font-medium whitespace-nowrap transition-all ${activeTab === tab
                                ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
                                }`}
                        >
                            {tab === 'listings' && `${t.allListings} (${seller.totalListings})`}
                            {tab === 'reviews' && `${t.reviewsTab} (${seller.reviewCount})`}
                            {tab === 'about' && t.about}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'listings' && (
                    <div>
                        {listings.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {listings.map(listing => (
                                    <UnifiedProductCard
                                        key={listing.id}
                                        product={listingToUnifiedProduct(listing)}
                                        showAIScore={true}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-800/50 rounded-2xl">
                                <Store className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">{t.noListings}</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'reviews' && (
                    <div>
                        {reviews.length > 0 ? (
                            <div className="space-y-4">
                                {reviews.map(review => (
                                    <div key={review.id} className="bg-slate-800/50 rounded-2xl p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center overflow-hidden">
                                                {review.buyerAvatar ? (
                                                    <Image
                                                        src={review.buyerAvatar}
                                                        alt={review.buyerName}
                                                        width={40}
                                                        height={40}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-sm font-bold text-gray-400">
                                                        {review.buyerName.charAt(0).toUpperCase()}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-medium text-white">{review.buyerName}</span>
                                                    <div className="flex">
                                                        {[1, 2, 3, 4, 5].map(i => (
                                                            <Star
                                                                key={i}
                                                                className={`w-3.5 h-3.5 ${i <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                                {review.productTitle && (
                                                    <p className="text-xs text-gray-500 mb-2">{review.productTitle}</p>
                                                )}
                                                <p className="text-gray-300 text-sm">{review.comment}</p>
                                                <p className="text-xs text-gray-500 mt-2">
                                                    {formatDate(review.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 bg-slate-800/50 rounded-2xl">
                                <Star className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400">{t.noReviews}</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'about' && (
                    <div className="bg-slate-800/50 rounded-2xl p-6">
                        {seller.shopDescription || seller.bio ? (
                            <p className="text-gray-300 whitespace-pre-wrap">
                                {seller.shopDescription || seller.bio}
                            </p>
                        ) : (
                            <p className="text-gray-500 text-center py-8">
                                {lang === 'th' ? 'ผู้ขายยังไม่ได้เพิ่มข้อมูล' : 'No description yet'}
                            </p>
                        )}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}

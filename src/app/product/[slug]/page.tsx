'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect, useMemo } from 'react'
import {
    Heart, Share2, MapPin, Clock, Eye, ShieldCheck, MessageCircle,
    ChevronLeft, ChevronRight, Package, Trash2, Edit, Sparkles,
    TrendingDown, BadgeCheck, AlertCircle, ArrowUpRight, Zap, Star, Store,
    Calendar, Check, X, Tag, Info, CreditCard, Calculator, ThumbsUp,
    Shield, Flame, FileText, Copy, ChevronDown, Facebook, Link2
} from 'lucide-react'
import { PRODUCT_CONDITIONS, CATEGORIES } from '@/constants/categories'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import RelatedProducts from '@/components/product/RelatedProducts'
import RecommendedProducts from '@/components/product/RecommendedProducts'
import RelatedKeywords from '@/components/product/RelatedKeywords'
import { trackProductView, trackFavorite, trackInteraction } from '@/services/behaviorTracking'
import { collection, query, where, getDocs, doc, getDoc, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { ProductWithId } from '@/types/product'
import { useAuth } from '@/contexts/AuthContext'
import { deleteProduct as deleteProductFromLib, deleteProductImage } from '@/lib/products'
import { isFavorite, toggleFavorite } from '@/lib/favorites'
import { calculateDistanceToProduct, formatDistance } from '@/lib/geolocation'
import { useLanguage } from '@/contexts/LanguageContext'
import ProductMap from '@/components/product/ProductMap'

// ===== HELPER FUNCTIONS =====

function formatPrice(price: number): string {
    return price.toLocaleString('th-TH')
}

function formatRelativeTime(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'วันนี้'
    if (diffDays === 1) return 'เมื่อวาน'
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} สัปดาห์ที่แล้ว`
    return `${Math.floor(diffDays / 30)} เดือนที่แล้ว`
}

// ===== IMAGE GALLERY =====
function ImageGallery({
    images,
    title,
    distance,
    location
}: {
    images: any[],
    title: string,
    distance: number | null,
    location?: { province?: string; amphoe?: string }
}) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [failedImages, setFailedImages] = useState<Record<number, boolean>>({})

    const displayImages = images.length > 0 ? images : [{ url: '/placeholder.svg' }]
    const currentItem = displayImages[activeIndex]
    const rawUrl = (typeof currentItem === 'string' ? currentItem : currentItem?.url) || ''
    const currentSrc = (failedImages[activeIndex] || !rawUrl) ? '/placeholder.svg' : rawUrl

    return (
        <div className="relative group rounded-2xl overflow-hidden bg-slate-800/50 border border-white/10">
            {/* Main Image */}
            <div className="aspect-[4/3] relative">
                <Image
                    src={currentSrc}
                    alt={title}
                    fill
                    className="object-contain"
                    priority
                    onError={() => setFailedImages(prev => ({ ...prev, [activeIndex]: true }))}
                />

                {/* Distance Badge */}
                {distance !== null && distance >= 0 && (
                    <div className="absolute bottom-4 left-4 z-20">
                        <div className="flex items-center gap-2 bg-purple-600/90 backdrop-blur-sm px-3 py-1.5 rounded-full">
                            <MapPin className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-medium">
                                {distance < 1 ? `${Math.round(distance * 1000)} m` : `${distance.toFixed(1)} กม.`}
                            </span>
                        </div>
                    </div>
                )}

                {/* Image Counter */}
                {displayImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm">
                        {activeIndex + 1} / {displayImages.length}
                    </div>
                )}

                {/* Navigation Arrows */}
                {displayImages.length > 1 && (
                    <>
                        <button
                            onClick={() => setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronLeft className="w-6 h-6 text-white" />
                        </button>
                        <button
                            onClick={() => setActiveIndex((prev) => (prev + 1) % displayImages.length)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-sm rounded-full transition-all opacity-0 group-hover:opacity-100"
                        >
                            <ChevronRight className="w-6 h-6 text-white" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {displayImages.length > 1 && (
                <div className="flex gap-2 p-3 bg-slate-900/50">
                    {displayImages.slice(0, 6).map((img, i) => {
                        const thumbUrl = (typeof img === 'string' ? img : img?.url) || '/placeholder.svg'
                        return (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`relative w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${i === activeIndex ? 'border-purple-500 ring-2 ring-purple-500/50' : 'border-transparent hover:border-white/30'
                                    }`}
                            >
                                <Image
                                    src={thumbUrl}
                                    alt={`${title} ${i + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </button>
                        )
                    })}
                    {displayImages.length > 6 && (
                        <div className="w-16 h-16 rounded-lg bg-slate-700 flex items-center justify-center text-gray-400 text-sm">
                            +{displayImages.length - 6}
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

// ===== QUICK FACTS GRID =====
function QuickFacts({ product, language = 'th' }: { product: ProductWithId, language?: 'th' | 'en' }) {
    const category = CATEGORIES.find(c => c.id === product.category_id)
    const conditionLabel = product.condition === 'new'
        ? (language === 'th' ? 'ใหม่' : 'New')
        : (language === 'th' ? 'มือสอง' : 'Used')

    const facts = [
        { icon: <Tag className="w-5 h-5" />, label: language === 'th' ? 'หมวดหมู่' : 'Category', value: language === 'th' ? category?.name_th : category?.name_en || 'General' },
        { icon: <Package className="w-5 h-5" />, label: language === 'th' ? 'สภาพ' : 'Condition', value: conditionLabel },
        { icon: <MapPin className="w-5 h-5" />, label: language === 'th' ? 'ที่ตั้ง' : 'Location', value: product.location_province || '-' },
    ]

    return (
        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <Info className="w-5 h-5 text-purple-400" />
                {language === 'th' ? 'ข้อมูลสำคัญ' : 'Quick Facts'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {facts.map((fact, idx) => (
                    <div key={idx} className="bg-slate-700/50 rounded-xl p-3 text-center">
                        <div className="text-purple-400 mb-2 flex justify-center">{fact.icon}</div>
                        <div className="text-white text-sm font-medium">{fact.value}</div>
                        <div className="text-gray-400 text-xs">{fact.label}</div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ===== AI DEAL SCORE =====
function AIDealScore({ product, language = 'th' }: { product: ProductWithId, language?: 'th' | 'en' }) {
    const isGoodPrice = product.original_price && (product.price < product.original_price * 0.9)
    const saving = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0
    const score = isGoodPrice ? Math.min(85, 50 + saving) : 50

    const getScoreColor = (score: number) => {
        if (score >= 70) return 'text-green-400'
        if (score >= 50) return 'text-yellow-400'
        return 'text-red-400'
    }

    return (
        <div className="bg-gradient-to-br from-purple-900/50 to-slate-800 rounded-xl p-4 border border-purple-500/30">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    {language === 'th' ? 'AI วิเคราะห์' : 'AI Analysis'}
                </h3>
                <button className="text-xs text-purple-400 hover:text-purple-300">
                    {language === 'th' ? 'ดูรายละเอียด' : 'Details'}
                </button>
            </div>

            {/* Score Circle */}
            <div className="flex items-center gap-4 mb-4">
                <div className="relative w-20 h-20">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle cx="40" cy="40" r="35" stroke="#374151" strokeWidth="6" fill="none" />
                        <circle
                            cx="40" cy="40" r="35"
                            stroke="url(#scoreGradient)"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${score * 2.2} 220`}
                            strokeLinecap="round"
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#ec4899" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-2xl font-bold ${getScoreColor(score)}`}>{score}</span>
                    </div>
                </div>

                <div className="flex-1 space-y-2">
                    {isGoodPrice && (
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                            <TrendingDown className="w-4 h-4" />
                            <span>{language === 'th' ? `ถูกกว่าตลาด ${saving}%` : `${saving}% below market`}</span>
                        </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <ShieldCheck className="w-4 h-4" />
                        <span>{language === 'th' ? 'ผ่านการตรวจสอบ' : 'Verified'}</span>
                    </div>
                </div>
            </div>

            {/* Breakdown */}
            <div className="space-y-2">
                {[
                    { label: language === 'th' ? 'ราคาเหมาะสม' : 'Price', value: isGoodPrice ? 90 : 50, color: 'bg-green-500' },
                    { label: language === 'th' ? 'รูปภาพ' : 'Images', value: (product.images?.length || 0) > 3 ? 80 : 50, color: 'bg-blue-500' },
                    { label: language === 'th' ? 'รายละเอียด' : 'Details', value: (product.description?.length || 0) > 100 ? 75 : 40, color: 'bg-purple-500' },
                ].map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                        <span className="text-gray-400 text-xs w-20">{item.label}</span>
                        <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                        </div>
                        <span className="text-gray-300 text-xs w-8">+{Math.round(item.value / 10)}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ===== SELLER CARD ENHANCED =====
function EnhancedSellerCard({
    seller,
    sellerId,
    sellerName,
    isVerified,
    language = 'th'
}: {
    seller: any,
    sellerId: string,
    sellerName: string,
    isVerified: boolean,
    language?: 'th' | 'en'
}) {
    const router = useRouter()
    const trustScore = seller?.trust_score || 50
    const totalListings = seller?.total_listings || 1
    const responseRate = seller?.response_rate || 95
    const memberSince = seller?.created_at ? new Date(seller.created_at.seconds * 1000).getFullYear() : new Date().getFullYear()
    const yearsMember = new Date().getFullYear() - memberSince

    return (
        <div className="bg-slate-800 rounded-xl p-4 border border-white/10">
            {/* Header */}
            <div className="flex items-center gap-3 mb-4 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => router.push(`/profile/${sellerId}`)}>
                <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold">
                        {sellerName.charAt(0).toUpperCase()}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-slate-800 rounded-full" />
                </div>
                <div className="flex-1">
                    <div className="flex items-center gap-2">
                        <span className="text-white font-semibold">{sellerName}</span>
                        {isVerified && <BadgeCheck className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="text-green-400 text-sm">
                        {language === 'th' ? 'ออนไลน์อยู่ขณะนี้' : 'Online now'}
                    </div>
                </div>
            </div>

            {/* Trust Score */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-400 text-sm">{language === 'th' ? 'คะแนนความน่าเชื่อถือ' : 'Trust Score'}</span>
                    <span className={`font-bold ${trustScore >= 70 ? 'text-green-400' : trustScore >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {trustScore}/100
                    </span>
                </div>
                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className={`h-full rounded-full ${trustScore >= 70 ? 'bg-green-500' : trustScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${trustScore}%` }}
                    />
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center p-2 bg-slate-700/50 rounded-lg">
                    <div className="text-white font-bold">{totalListings}</div>
                    <div className="text-gray-400 text-xs">{language === 'th' ? 'ประกาศ' : 'Listings'}</div>
                </div>
                <div className="text-center p-2 bg-slate-700/50 rounded-lg">
                    <div className="text-white font-bold">{responseRate}%</div>
                    <div className="text-gray-400 text-xs">{language === 'th' ? 'ตอบกลับ' : 'Response'}</div>
                </div>
                <div className="text-center p-2 bg-slate-700/50 rounded-lg">
                    <div className="text-white font-bold">{yearsMember > 0 ? `${yearsMember}+` : '<1'}</div>
                    <div className="text-gray-400 text-xs">{language === 'th' ? 'ปี' : 'Years'}</div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={() => router.push(`/shop/${sellerId}`)}
                    className="py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-300 text-sm font-medium transition-colors"
                >
                    {language === 'th' ? 'ดูร้านค้า' : 'Visit Shop'}
                </button>
                <button className="py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-300 text-sm font-medium transition-colors flex items-center justify-center gap-1">
                    <span>👤</span> {language === 'th' ? 'ติดตาม' : 'Follow'}
                </button>
            </div>
        </div>
    )
}

// ===== SHARE MODAL =====
function ShareModal({ isOpen, onClose, product }: { isOpen: boolean, onClose: () => void, product: ProductWithId }) {
    if (!isOpen) return null

    const shareUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/product/${product.slug || product.id}`

    const handleCopy = async () => {
        await navigator.clipboard.writeText(shareUrl)
        alert('คัดลอกลิงก์แล้ว!')
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
            <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm" onClick={e => e.stopPropagation()}>
                <h3 className="text-xl font-bold text-white mb-4">แชร์ประกาศนี้</h3>

                <div className="grid grid-cols-4 gap-4 mb-6">
                    <button className="flex flex-col items-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                            <Facebook className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs text-gray-400">Facebook</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
                        <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs text-gray-400">LINE</span>
                    </button>
                    <button className="flex flex-col items-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
                        <div className="w-10 h-10 bg-sky-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold">𝕏</span>
                        </div>
                        <span className="text-xs text-gray-400">X</span>
                    </button>
                    <button onClick={handleCopy} className="flex flex-col items-center gap-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-xl transition-colors">
                        <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                            <Link2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs text-gray-400">คัดลอก</span>
                    </button>
                </div>

                <button onClick={onClose} className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-gray-300 font-medium transition-colors">
                    ปิด
                </button>
            </div>
        </div>
    )
}

// ===== STICKY BOTTOM BAR (MOBILE) =====
function StickyBottomBar({
    product,
    onChat,
    onShare,
    onFavorite,
    isFavorited
}: {
    product: ProductWithId,
    onChat: () => void,
    onShare: () => void,
    onFavorite: () => void,
    isFavorited: boolean
}) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/10 px-4 py-3 safe-area-inset-bottom">
            <div className="flex items-center gap-3">
                {/* Price */}
                <div className="flex-1 min-w-0">
                    <div className="text-xl font-bold text-white">฿{formatPrice(product.price)}</div>
                    <div className="text-xs text-gray-400 truncate">{product.title}</div>
                </div>

                {/* Quick Actions */}
                <button
                    onClick={onFavorite}
                    className={`p-3 rounded-xl ${isFavorited ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-gray-300'}`}
                >
                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                </button>

                <button onClick={onShare} className="p-3 bg-slate-700 rounded-xl text-gray-300">
                    <Share2 className="w-5 h-5" />
                </button>

                {/* Chat Button */}
                <button
                    onClick={onChat}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl text-white font-semibold"
                >
                    แชท
                </button>
            </div>
        </div>
    )
}

// ===== HELPER: getPostedDate =====
function getPostedDate(dateField: any): Date {
    if (!dateField) return new Date()
    if (dateField instanceof Timestamp) return dateField.toDate()
    if (dateField?.seconds) return new Date(dateField.seconds * 1000)
    if (typeof dateField === 'string') return new Date(dateField)
    return new Date()
}

// ===== HELPER: getSellerProfile =====
async function getSellerProfile(sellerId: string) {
    if (!sellerId) return null
    try {
        const docRef = doc(db, 'users', sellerId)
        const snap = await getDoc(docRef)
        return snap.exists() ? snap.data() : null
    } catch (e) {
        console.error("Error fetching seller:", e)
        return null
    }
}

// ===== MAIN PAGE COMPONENT =====

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const { t, language } = useLanguage()
    const slug = decodeURIComponent(params.slug as string)

    const [product, setProduct] = useState<ProductWithId | null>(null)
    const [seller, setSeller] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isFavorited, setIsFavorited] = useState(false)
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)
    const [distance, setDistance] = useState<number | null>(null)
    const [shareModalOpen, setShareModalOpen] = useState(false)

    const isOwner = user && product && user.uid === product.seller_id

    // Data Fetching
    useEffect(() => {
        async function loadProduct() {
            setLoading(true)
            try {
                const q = query(collection(db, 'products'), where('slug', '==', slug))
                const snap = await getDocs(q)
                let data = null, id = null

                if (!snap.empty) {
                    data = snap.docs[0].data()
                    id = snap.docs[0].id
                } else {
                    const docRef = doc(db, 'products', slug)
                    const docSnap = await getDoc(docRef)
                    if (docSnap.exists()) {
                        data = docSnap.data()
                        id = docSnap.id
                    }
                }

                if (data && id) {
                    const p = { id, ...data } as ProductWithId
                    setProduct(p)

                    if (p.seller_id) {
                        getSellerProfile(p.seller_id).then(setSeller)
                    }

                    if (p.location_province) {
                        calculateDistanceToProduct(p.location_province).then(setDistance)
                    }
                    if (user) {
                        isFavorite(user.uid, id).then(setIsFavorited)
                    }
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (slug) loadProduct()
    }, [slug, user])

    // Tracking
    useEffect(() => {
        if (!product) return
        const catId = typeof product.category_id === 'string' ? Number(product.category_id) : product.category_id
        trackProductView(product.id, catId, product.price, product.location_province)
    }, [product])

    const handleFavorite = async () => {
        if (!user) return router.push('/login')
        if (!product) return
        setIsFavoriteLoading(true)
        try {
            const newState = await toggleFavorite(user.uid, product.id)
            setIsFavorited(newState)
            trackFavorite(product.id, newState)
        } finally {
            setIsFavoriteLoading(false)
        }
    }

    const handleChat = () => {
        if (!product || !user) {
            router.push('/login')
            return
        }
        const params = new URLSearchParams({
            seller: product.seller_id,
            listing: product.id,
            title: product.title,
            price: product.price.toString()
        })
        if (product.thumbnail_url) {
            params.append('image', product.thumbnail_url)
        }
        router.push(`/chat?${params.toString()}`)
    }

    const handleDelete = async () => {
        if (!product) return
        if (confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่?')) {
            try {
                await deleteProductFromLib(product.id)
                alert('ลบสินค้าเรียบร้อยแล้ว')
                router.push('/')
            } catch (error) {
                alert('เกิดข้อผิดพลาดในการลบสินค้า')
            }
        }
    }

    // Loading
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">กำลังโหลด...</p>
                </div>
            </div>
        )
    }

    // Not Found
    if (!product) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">😢</div>
                    <h1 className="text-2xl font-bold text-white mb-2">ไม่พบสินค้า</h1>
                    <Link href="/" className="px-6 py-3 bg-purple-500 hover:bg-purple-600 rounded-xl text-white font-medium">
                        กลับหน้าแรก
                    </Link>
                </div>
            </div>
        )
    }

    // Derived
    const category = CATEGORIES.find(c => c.id === product.category_id)
    const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0
    const isVerifiedSeller = seller?.isVerified || (product as any).is_verified_seller || false
    const sellerName = seller?.displayName || product.seller_name || 'ผู้ขาย'
    const postedDate = getPostedDate(product.created_at)

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 pb-24 lg:pb-8">
            {/* Header Breadcrumb */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Link href="/" className="hover:text-white">🏠 JaiKod</Link>
                        <span>/</span>
                        <Link href={`/category/${category?.slug}`} className="hover:text-white">
                            {language === 'th' ? category?.name_th : category?.name_en || 'หมวดหมู่'}
                        </Link>
                        <span>/</span>
                        <span className="text-gray-300 truncate">{product.title}</span>
                    </div>
                </div>
            </header>

            {/* Owner Actions */}
            {isOwner && (
                <div className="max-w-7xl mx-auto px-4 mt-4">
                    <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-xl p-4 border border-purple-500/30">
                        <div className="flex flex-wrap items-center gap-3">
                            <span className="text-purple-300 text-sm font-medium flex items-center gap-2">
                                <Star className="w-4 h-4" /> จัดการประกาศนี้
                            </span>
                            <div className="flex gap-2 ml-auto">
                                <button
                                    onClick={() => router.push(`/sell?edit=${product.id}`)}
                                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 rounded-lg text-white text-sm font-medium flex items-center gap-2"
                                >
                                    <Edit className="w-4 h-4" /> แก้ไข
                                </button>
                                <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-white text-sm font-medium">
                                    📢 โปรโมท
                                </button>
                                <button className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-white text-sm font-medium">
                                    ✅ ขายแล้ว
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-5 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* Image Gallery */}
                        <ImageGallery
                            images={product.images || []}
                            title={product.title}
                            distance={distance}
                            location={{ province: product.location_province, amphoe: product.location_amphoe }}
                        />

                        {/* Description */}
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                                <FileText className="w-5 h-5 text-purple-400" />
                                รายละเอียด
                            </h3>
                            <div className="text-gray-300 text-sm whitespace-pre-wrap">
                                {product.description || 'ไม่มีรายละเอียดเพิ่มเติม'}
                            </div>
                        </div>

                        {/* Quick Facts */}
                        <QuickFacts product={product} language={language} />

                        {/* Map */}
                        <div className="bg-slate-800/50 rounded-xl p-4 border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-purple-400" />
                                    ตำแหน่งร้านค้า
                                </h3>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${product.location_amphoe || ''} ${product.location_province}`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm font-medium text-purple-400 hover:text-purple-300 flex items-center gap-1"
                                >
                                    เปิดแผนที่ <ArrowUpRight className="w-3 h-3" />
                                </a>
                            </div>
                            <ProductMap
                                province={product.location_province || ''}
                                amphoe={product.location_amphoe || ''}
                                distance={distance}
                                district={product.location_district}
                            />
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* Main Info Card */}
                        <div className="bg-slate-800 rounded-xl p-4 shadow-xl border border-white/10">
                            {/* Meta */}
                            <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                                <span>📅 {formatRelativeTime(postedDate)}</span>
                                {isOwner && (
                                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-lg text-xs">
                                        ประกาศของคุณ
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl font-bold text-white mb-3">{product.title}</h1>

                            {/* Badges */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {product.condition === 'new' && (
                                    <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full">⭐ ใหม่</span>
                                )}
                                {discount > 0 && (
                                    <span className="px-2 py-1 bg-red-500/20 text-red-300 text-xs rounded-full">🔥 -{discount}%</span>
                                )}
                            </div>

                            {/* Price */}
                            <div className="mb-4">
                                <div className="text-3xl font-bold text-white">฿{formatPrice(product.price)}</div>
                                {product.original_price && product.original_price > product.price && (
                                    <div className="text-gray-500 line-through text-sm">฿{formatPrice(product.original_price)}</div>
                                )}
                            </div>

                            {/* Stats */}
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
                                <span className="flex items-center gap-1"><Eye className="w-4 h-4" /> {product.views_count || 0}</span>
                                <span className="flex items-center gap-1"><Heart className="w-4 h-4" /> {product.favorites_count || 0}</span>
                            </div>

                            {/* Actions (Desktop) */}
                            <div className="hidden lg:flex gap-3 mb-4">
                                <button
                                    onClick={handleFavorite}
                                    disabled={isFavoriteLoading}
                                    className={`flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${isFavorited ? 'bg-red-500/20 text-red-400' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                                        }`}
                                >
                                    <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
                                    {isFavorited ? 'บันทึกแล้ว' : 'บันทึก'}
                                </button>
                                <button
                                    onClick={() => setShareModalOpen(true)}
                                    className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-gray-300 font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Share2 className="w-5 h-5" /> แชร์
                                </button>
                            </div>

                            <div className="hidden lg:block space-y-3">
                                <button
                                    onClick={handleChat}
                                    className="w-full py-3 bg-slate-700 hover:bg-slate-600 rounded-xl text-white font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <MessageCircle className="w-5 h-5" /> แชทกับผู้ขาย
                                </button>

                                {isOwner ? (
                                    <button
                                        onClick={handleDelete}
                                        className="w-full py-3 bg-red-500/20 hover:bg-red-500/30 rounded-xl text-red-400 font-medium transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Trash2 className="w-5 h-5" /> ลบประกาศ
                                    </button>
                                ) : (
                                    <button className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2">
                                        💵 เสนอราคา
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Seller Card */}
                        <EnhancedSellerCard
                            seller={seller}
                            sellerId={product.seller_id}
                            sellerName={sellerName}
                            isVerified={isVerifiedSeller}
                            language={language}
                        />

                        {/* AI Deal Score */}
                        <AIDealScore product={product} language={language} />
                    </div>
                </div>

                {/* Related Products */}
                <div className="mt-12 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-purple-400" />
                            สินค้าที่คุณน่าจะชอบ (AI)
                        </h2>
                        <RecommendedProducts currentProductId={product.id} categoryId={product.category_id} limit={4} />
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-white mb-6">สินค้าจากร้านเดียวกัน</h2>
                        <RelatedProducts sellerId={product.seller_id} sellerName={sellerName} currentProductId={product.id} limit={4} />
                    </section>

                    <section>
                        <RelatedKeywords category={category?.name_th || ''} brand={product.title.split(' ')[0]} />
                    </section>
                </div>
            </main>

            {/* Mobile Bottom Bar */}
            <StickyBottomBar
                product={product}
                onChat={handleChat}
                onShare={() => setShareModalOpen(true)}
                onFavorite={handleFavorite}
                isFavorited={isFavorited}
            />

            {/* Modals */}
            <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} product={product} />
        </div>
    )
}

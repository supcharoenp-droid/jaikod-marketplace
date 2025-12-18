'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import {
    Heart, Share2, MapPin, Clock, Eye, ShieldCheck, MessageCircle,
    ChevronLeft, ChevronRight, Package, Trash2, Edit, Sparkles,
    TrendingDown, BadgeCheck, AlertCircle, ArrowUpRight, Zap, Star
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
import SellerScoreCard from '@/components/seller/SellerScoreCard'
import ProductMap from '@/components/product/ProductMap'
import { calculateDistanceToProduct, formatDistance } from '@/lib/geolocation'
import { useLanguage } from '@/contexts/LanguageContext'

// --- Components ---

function AiSummaryBox({ product, distance }: { product: ProductWithId, distance: number | null }) {
    const { t } = useLanguage()
    const isGoodPrice = product.original_price && (product.price < product.original_price * 0.9);
    const saving = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0;

    return (
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-purple-100 dark:border-purple-800 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-200/50 dark:bg-purple-800/20 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

            <div className="flex items-center gap-2 mb-3">
                <div className="p-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg shadow-purple-500/30">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white">{t('ai_widgets.summary_title')}</h3>
            </div>

            <ul className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300 relative z-10">
                <li className="flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-green-500 mt-0.5" />
                    <span>
                        <span className="font-semibold text-gray-900 dark:text-white">{t('ai_widgets.condition_check')}:</span>{' '}
                        {product.condition === 'new' ? t('product_detail.condition_new') : t('product_detail.condition_used')}
                        <span className="text-xs text-gray-500 block">{t('ai_widgets.condition_ok')}</span>
                    </span>
                </li>
                {isGoodPrice && (
                    <li className="flex items-start gap-2.5">
                        <TrendingDown className="w-4 h-4 text-green-500 mt-0.5" />
                        <span>
                            <span className="font-semibold text-gray-900 dark:text-white">{t('ai_widgets.good_price')}:</span>{' '}
                            {t('ai_widgets.cheaper_than_market').replace('{{percent}}', saving.toString())}
                            <span className="text-xs text-green-600 block font-medium">{t('ai_widgets.buy_now_advice')}</span>
                        </span>
                    </li>
                )}
                {distance !== null && distance < 10 && (
                    <li className="flex items-start gap-2.5">
                        <MapPin className="w-4 h-4 text-blue-500 mt-0.5" />
                        <span>
                            <span className="font-semibold text-gray-900 dark:text-white">{t('ai_widgets.near_you')}:</span>{' '}
                            {t('ai_widgets.distance_km').replace('{{distance}}', formatDistance(distance))}
                            <span className="text-xs text-gray-500 block">{t('ai_widgets.meetup_convenient').replace('{{location}}', product.location_amphoe || '')}</span>
                        </span>
                    </li>
                )}
                <li className="flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-orange-500 mt-0.5" />
                    <span>
                        <span className="font-semibold text-gray-900 dark:text-white">{t('ai_widgets.popularity')}:</span>{' '}
                        {t('ai_widgets.high_demand')}
                    </span>
                </li>
            </ul>
        </div>
    )
}

function ImageGallery({ images, title }: { images: any[], title: string }) {
    const [activeIndex, setActiveIndex] = useState(0)
    const [failedImages, setFailedImages] = useState<Record<number, boolean>>({})

    const displayImages = images.length > 0 ? images : [{ url: '/placeholder.svg' }]

    // Resolve current image URL
    const currentItem = displayImages[activeIndex]
    const rawUrl = (typeof currentItem === 'string' ? currentItem : currentItem.url) || ''
    const currentSrc = (failedImages[activeIndex] || !rawUrl) ? '/placeholder.svg' : rawUrl

    return (
        <div className="relative group bg-gray-100 dark:bg-gray-800 rounded-2xl overflow-hidden aspect-[4/3] border border-gray-100 dark:border-gray-800">
            <Image
                src={currentSrc}
                alt={title}
                fill
                className="object-contain"
                priority
                onError={() => setFailedImages(prev => ({ ...prev, [activeIndex]: true }))}
            />

            {/* Navigation */}
            {displayImages.length > 1 && (
                <>
                    <button
                        onClick={() => setActiveIndex((prev) => (prev - 1 + displayImages.length) % displayImages.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-black/50 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronLeft className="w-5 h-5 text-gray-800 dark:text-white" />
                    </button>
                    <button
                        onClick={() => setActiveIndex((prev) => (prev + 1) % displayImages.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/90 dark:bg-black/50 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <ChevronRight className="w-5 h-5 text-gray-800 dark:text-white" />
                    </button>
                </>
            )}

            {/* Dots */}
            {displayImages.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 p-1.5 bg-black/20 backdrop-blur-md rounded-full">
                    {displayImages.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => setActiveIndex(i)}
                            className={`w-2 h-2 rounded-full transition-all ${i === activeIndex ? 'bg-white w-4' : 'bg-white/50'}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}

// Helper to fetch seller data
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

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const { t, language } = useLanguage()
    const slug = decodeURIComponent(params.slug as string)

    const [product, setProduct] = useState<ProductWithId | null>(null)
    const [seller, setSeller] = useState<any>(null) // State for seller profile
    const [loading, setLoading] = useState(true)
    const [isFavorited, setIsFavorited] = useState(false)
    const [isFavoriteLoading, setIsFavoriteLoading] = useState(false)
    const [distance, setDistance] = useState<number | null>(null)

    // Data Fetching
    useEffect(() => {
        async function loadProduct() {
            setLoading(true)
            try {
                // Try slug first
                const q = query(collection(db, 'products'), where('slug', '==', slug))
                const snap = await getDocs(q)
                let data = null, id = null

                if (!snap.empty) {
                    data = snap.docs[0].data()
                    id = snap.docs[0].id
                } else {
                    // Try ID
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

                    // Fetch Seller Profile
                    if (p.seller_id) {
                        getSellerProfile(p.seller_id).then(setSeller)
                    }

                    // Calculate distance
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

    // Interaction Tracking
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

        // Redirect to chat with listing info
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
        if (confirm('คุณต้องการลบสินค้านี้ใช่หรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
            try {
                await deleteProductFromLib(product.id)
                alert('ลบสินค้าเรียบร้อยแล้ว')
                router.push('/')
            } catch (error) {
                console.error("Delete failed:", error)
                alert('เกิดข้อผิดพลาดในการลบสินค้า')
            }
        }
    }

    const getPostedDate = (dateField: any): Date => {
        if (!dateField) return new Date()
        if (dateField instanceof Timestamp) return dateField.toDate()
        if (dateField?.seconds) return new Date(dateField.seconds * 1000)
        if (typeof dateField === 'string') return new Date(dateField)
        return new Date()
    }

    if (loading) return (
        <div className="min-h-screen grid place-items-center bg-gray-50 dark:bg-black">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-purple-600 border-t-transparent" />
        </div>
    )

    if (!product) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-4">
            <h1 className="text-2xl font-bold">{t('search_page.no_results')}</h1>
            <Link href="/"><Button>{t('common.view_all')}</Button></Link>
        </div>
    )

    // Derived State
    const category = CATEGORIES.find(c => c.id === product.category_id)
    const discount = product.original_price ? Math.round((1 - product.price / product.original_price) * 100) : 0
    const isVerifiedSeller = seller?.isVerified || (product as any).is_verified_seller || false
    const sellerAvatar = seller?.photoURL || (product as any).seller_avatar
    const sellerName = seller?.displayName || product.seller_name || 'Seller'
    const postedDate = getPostedDate(product.created_at)
    const daysAgo = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60 * 24))
    const displayDaysAgo = isNaN(daysAgo) ? 0 : daysAgo
    const postedText = daysAgo === 0
        ? t('product_detail.posted_today')
        : t('product_detail.posted').replace('{{days}}', displayDaysAgo.toString())

    return (
        <div className="min-h-screen bg-[#F8F9FB] dark:bg-black text-gray-900 dark:text-gray-100 font-sans">
            <Header />

            <main className="container mx-auto px-4 py-6 max-w-6xl">

                {/* Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN: Gallery & Details (lg:col-span-8) */}
                    <div className="lg:col-span-8 space-y-8">

                        {/* 1. Main Image Carousel */}
                        <ImageGallery images={product.images || []} title={product.title} />

                        {/* 2. Header Mobile (Visible primarily on small screens, logical structure) */}
                        <div className="lg:hidden space-y-4">
                            <h1 className="text-2xl font-bold leading-tight">{product.title}</h1>
                            <div className="flex items-center gap-2 flex-wrap">
                                {discount > 0 && <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">-{discount}%</span>}
                                {product.condition === 'new' && <span className="bg-blue-500 text-white text-xs font-bold px-2 py-0.5 rounded">NEW</span>}
                            </div>
                            <div className="bg-white dark:bg-gray-900 p-4 rounded-xl border">
                                <div className="flex items-end gap-3">
                                    <span className="text-3xl font-extrabold text-purple-600">฿{product.price.toLocaleString()}</span>
                                    {product.original_price && <span className="text-gray-400 line-through mb-1">฿{product.original_price.toLocaleString()}</span>}
                                </div>
                            </div>
                        </div>

                        {/* 6. AI Summary Box */}
                        <AiSummaryBox product={product} distance={distance} />

                        {/* 7. Product Details */}
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 lg:p-8 border border-gray-100 dark:border-gray-800 shadow-sm">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Package className="w-5 h-5 text-gray-400" />
                                {t('search_page.filters')} {/* Using 'Filters' as 'Details' placeholder, should be fixed or added new key */}
                            </h2>

                            <div className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-8 mb-8 text-sm">
                                <div>
                                    <div className="text-gray-500 mb-1">{t('search_page.category')}</div>
                                    <Link href={`/category/${category?.slug}`} className="font-medium text-purple-600 hover:underline">
                                        {language === 'th' ? category?.name_th : category?.name_en || 'General'}
                                    </Link>
                                </div>
                                <div>
                                    <div className="text-gray-500 mb-1">{t('ai_widgets.condition_check')}</div>
                                    <div className="font-medium">{product.condition === 'new' ? t('product_detail.condition_new') : t('product_detail.condition_used')}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500 mb-1">Posted</div>
                                    <div className="font-medium">{postedText}</div>
                                </div>
                                <div>
                                    <div className="text-gray-500 mb-1">{t('product_detail.meetup_location')}</div>
                                    <div className="font-medium">{product.location_amphoe}, {product.location_province}</div>
                                </div>
                            </div>

                            <hr className="border-gray-100 dark:border-gray-800 mb-6" />

                            <div className="prose prose-slate dark:prose-invert max-w-none leading-relaxed text-gray-600 dark:text-gray-300">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">{t('product_detail.seller_description')}</h3>
                                <p className="whitespace-pre-line">{product.description}</p>
                            </div>
                        </div>

                        {/* Location Map (Large) */}
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-gray-400" />
                                    {t('product_detail.store_location')}
                                </h2>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${product.location_amphoe || ''} ${product.location_province}`)}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-1"
                                >
                                    {t('product_detail.open_map')} <ArrowUpRight className="w-3 h-3" />
                                </a>
                            </div>
                            <ProductMap province={product.location_province || ''} amphoe={product.location_amphoe || ''} distance={distance} district={product.location_district} />
                        </div>

                    </div>

                    {/* RIGHT COLUMN: Sticky Info & Actions (lg:col-span-4) */}
                    <div className="lg:col-span-4 flex flex-col gap-6">

                        {/* Main Interaction Card (Desktop Sticky) */}
                        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-gray-800 shadow-xl shadow-purple-900/5 lg:sticky lg:top-24">

                            {/* 2. Product Title & Badge (Desktop) */}
                            <div className="hidden lg:block mb-4">
                                <div className="flex items-center gap-2 mb-2">
                                    {product.condition === 'new' && <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold">NEW</span>}
                                    {isVerifiedSeller && <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1"><BadgeCheck className="w-3 h-3" /> VERIFIED</span>}
                                </div>
                                <h1 className="text-2xl font-bold leading-snug text-gray-900 dark:text-white mb-2">
                                    {product.title}
                                </h1>
                            </div>

                            {/* 4. Quick Stats */}
                            <div className="flex items-center gap-4 text-xs text-gray-400 mb-6">
                                <div className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 fill-gray-200" /> {product.favorites_count || 0}</div>
                                <div className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {product.views_count || 0}</div>
                                <div className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {displayDaysAgo}d</div>
                            </div>

                            {/* 3. Price Box */}
                            <div className="mb-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                                <div className="flex items-end justify-between mb-1">
                                    <span className="text-gray-500 text-xs font-medium">{t('product_detail.price_sale')}</span>
                                    {discount > 0 && <span className="text-red-500 text-xs font-bold">-{discount}% OFF</span>}
                                </div>
                                <div className="flex items-end gap-3">
                                    <span className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                                        ฿{product.price.toLocaleString()}
                                    </span>
                                </div>
                                {product.original_price && product.original_price > product.price && (
                                    <div className="text-sm text-gray-400 line-through mt-1">
                                        {t('product_detail.original_price')} ฿{product.original_price.toLocaleString()}
                                    </div>
                                )}
                            </div>

                            {/* Action Buttons */}
                            {user?.uid === product.seller_id ? (
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    <Button variant="outline" className="h-12" onClick={() => router.push(`/sell?edit=${product.id}`)}>
                                        <Edit className="w-4 h-4 mr-2" /> {t('product_detail.edit_product')}
                                    </Button>
                                    <Button variant="destructive" className="h-12" onClick={handleDelete}>
                                        <Trash2 className="w-4 h-4 mr-2" /> {t('product_detail.delete_product')}
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-3 mb-6">
                                    <Button onClick={handleChat} className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-purple-500/25 text-lg font-bold">
                                        <MessageCircle className="w-5 h-5 mr-2" />
                                        {t('product_detail.chat_seller')}
                                    </Button>
                                    <div className="grid grid-cols-2 gap-3 mb-3">
                                        <Button
                                            variant="outline"
                                            className={`h-12 border-2 ${isFavorited ? 'border-red-100 bg-red-50 text-red-500' : 'hover:bg-gray-50'}`}
                                            onClick={handleFavorite}
                                            disabled={isFavoriteLoading}
                                        >
                                            <Heart className={`w-5 h-5 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                                            {isFavorited ? t('product_detail.saved') : t('product_detail.save_item')}
                                        </Button>
                                        <Button variant="outline" className="h-12 border-2 hover:bg-gray-50">
                                            <Share2 className="w-5 h-5 mr-2" />
                                            {t('product_detail.share')}
                                        </Button>
                                    </div>
                                    <button
                                        className="w-full flex items-center justify-center gap-2 text-gray-400 text-xs hover:text-red-500 hover:bg-red-50 py-2 rounded-lg transition-colors"
                                        onClick={() => alert(`Report Item ID: ${product.id}`)} // TODO: Link to Report Modal
                                    >
                                        <AlertCircle className="w-3.5 h-3.5" />
                                        {t('product_detail.report_issue') || 'Report this item'}
                                    </button>
                                </div>
                            )}

                            {/* 8. Seller Section (Stronger) */}
                            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-3 mb-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 -mx-2 rounded-xl transition-colors" onClick={() => router.push(`/profile/${product.seller_id}`)}>
                                    <div className="relative w-12 h-12">
                                        {sellerAvatar ? (
                                            <Image src={sellerAvatar} alt="Seller" fill className="object-cover rounded-full border border-gray-200" />
                                        ) : (
                                            <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                                                <Store className="w-6 h-6 text-gray-500" />
                                            </div>
                                        )}
                                        {/* Online Status Indicator (Mock for now, or real if presence available) */}
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" title="Online" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate flex items-center gap-1.5">
                                            {sellerName}
                                            {isVerifiedSeller && <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-50" />}
                                        </h4>
                                        <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
                                            {t('product_detail.online_now')}
                                        </div>
                                    </div>
                                </div>
                                <SellerScoreCard seller={seller || {}} />
                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <Button variant="ghost" size="sm" className="font-medium bg-gray-50 hover:bg-gray-100 dark:bg-gray-800" onClick={() => router.push(`/shop/${product.seller_id}`)}>{t('product_detail.visit_store')}</Button>
                                    <Button variant="ghost" size="sm" className="font-medium text-gray-500 hover:text-gray-700">{t('product_detail.view_all_products')}</Button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Footer Sections */}
                <div className="mt-16 space-y-16 max-w-6xl mx-auto">
                    {/* 9. Similar Items */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-purple-600" />
                            {t('product_detail.ai_recommended')}
                        </h2>
                        <RecommendedProducts currentProductId={product.id} categoryId={product.category_id} limit={4} />
                    </section>

                    {/* 10. Related by Seller */}
                    <section>
                        <h2 className="text-2xl font-bold mb-6">{t('product_detail.more_from_seller')}</h2>
                        <RelatedProducts sellerId={product.seller_id} sellerName={product.seller_name || 'Seller'} currentProductId={product.id} limit={4} />
                    </section>

                    <section>
                        <RelatedKeywords category={category?.name_th || ''} brand={product.title.split(' ')[0]} />
                    </section>
                </div>

            </main>
            <Footer />
        </div>
    )
}

'use client'

import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Heart, Share2, MapPin, Clock, Eye, ShieldCheck, MessageCircle, ChevronLeft, ChevronRight, Package, Trash2, X } from 'lucide-react'
import { PRODUCT_CONDITIONS } from '@/constants/categories'
import { CATEGORIES } from '@/constants/categories'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import { trackProductView, trackFavorite } from '@/services/behaviorTracking'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { ProductWithId } from '@/types/product'
import { useAuth } from '@/contexts/AuthContext'
import { deleteProduct, deleteProductImage } from '@/lib/products'

export default function ProductDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { user } = useAuth()
    const slug = decodeURIComponent(params.slug as string)

    const [product, setProduct] = useState<ProductWithId | null>(null)
    const [loading, setLoading] = useState(true)
    const [currentImageIndex, setCurrentImageIndex] = useState(0)
    const [isFavorited, setIsFavorited] = useState(false)
    const [isDeleting, setIsDeleting] = useState(false)

    // Fetch product by slug
    useEffect(() => {
        async function fetchProduct() {
            try {
                setLoading(true)
                const q = query(
                    collection(db, 'products'),
                    where('slug', '==', slug)
                )
                const snapshot = await getDocs(q)

                if (!snapshot.empty) {
                    const doc = snapshot.docs[0]
                    const data = doc.data()
                    setProduct({
                        id: doc.id,
                        ...data,
                        created_at: data.created_at?.toDate?.() || new Date(),
                        updated_at: data.updated_at?.toDate?.() || new Date()
                    } as ProductWithId)
                } else {
                    setProduct(null)
                }
            } catch (error) {
                console.error('[ProductDetail] Error fetching product:', error)
                setProduct(null)
            } finally {
                setLoading(false)
            }
        }

        if (slug) {
            fetchProduct()
        }
    }, [slug])

    // Handle delete product
    const handleDelete = async () => {
        if (!product || !user) return

        if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้? การกระทำนี้ไม่สามารถยกเลิกได้')) {
            return
        }

        try {
            setIsDeleting(true)
            await deleteProduct(product.id)
            alert('ลบสินค้าเรียบร้อยแล้ว')
            router.push('/')
        } catch (error) {
            console.error('Error deleting product:', error)
            alert('เกิดข้อผิดพลาดในการลบสินค้า')
        } finally {
            setIsDeleting(false)
        }
    }

    // Handle delete image
    const handleDeleteImage = async (imageUrl: string, index: number, e: React.MouseEvent) => {
        e.stopPropagation()
        if (!product || !user) return

        if (product.images.length <= 1) {
            alert('ต้องมีรูปภาพอย่างน้อย 1 รูป')
            return
        }

        if (!confirm('ยืนยันการลบรูปภาพนี้?')) return

        try {
            await deleteProductImage(product.id, imageUrl)

            // Update local state
            const newImages = product.images.filter((_, i) => i !== index)
            let newIndex = currentImageIndex

            if (newImages.length === 0) {
                // Should be caught by length check, but safe guard
                newIndex = 0
            } else if (index === currentImageIndex) {
                // If deleting currently viewed, go to previous or 0
                newIndex = Math.max(0, index - 1)
            } else if (index < currentImageIndex) {
                // If deleting image before current, shift index down
                newIndex = currentImageIndex - 1
            }

            setProduct({
                ...product,
                images: newImages,
                thumbnail_url: newImages.length > 0 ? newImages[0].url : ''
            })
            setCurrentImageIndex(newIndex)

        } catch (error) {
            console.error('Failed to delete image:', error)
            alert('ไม่สามารถลบรูปภาพได้ กรุณาลองใหม่')
        }
    }

    // Handle chat with seller
    const handleChat = () => {
        if (!product) return
        // Navigate to chat page with seller and product info
        const sellerName = (product as any).seller_name || 'JaiKod Seller'
        const chatUrl = `/chat?to=${product.seller_id}&name=${encodeURIComponent(sellerName)}&product=${product.id}&productTitle=${encodeURIComponent(product.title)}&productImage=${encodeURIComponent(product.thumbnail_url)}`
        router.push(chatUrl)
    }

    // Track product view when page loads
    useEffect(() => {
        if (product) {
            trackProductView(product.id, product.category_id)
        }
    }, [product])

    // Handle favorite toggle with tracking
    const handleFavorite = () => {
        const newFavoriteState = !isFavorited
        setIsFavorited(newFavoriteState)
        if (product) {
            trackFavorite(product.id, newFavoriteState)
        }
    }

    // Get category info
    const category = product ? CATEGORIES.find(c => c.id === product.category_id) : null

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple"></div>
                    <p className="mt-4 text-text-secondary">กำลังโหลด...</p>
                </main>
                <Footer />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center p-4">
                    <h1 className="text-2xl font-bold mb-4">ไม่พบสินค้า</h1>
                    <Link href="/">
                        <Button variant="primary">กลับสู่หน้าหลัก</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }

    const conditionLabel = PRODUCT_CONDITIONS.find(c => c.value === product.condition)?.label || 'ไม่ระบุ'
    const discount = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : 0

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % product.images.length)
    }

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length)
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1 py-8">
                <div className="container mx-auto px-4">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-sm text-text-secondary dark:text-gray-400 mb-6">
                        <Link href="/" className="hover:text-neon-purple">หน้าหลัก</Link>
                        <span>/</span>
                        {category && (
                            <>
                                <Link href={`/category/${category.slug}`} className="hover:text-neon-purple">
                                    {category.name_th}
                                </Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-text-primary dark:text-text-light truncate max-w-[200px]">{product.title}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12">
                        {/* Left Column - Images */}
                        <div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                                {/* Main Image */}
                                <div className="relative aspect-square bg-gray-100 dark:bg-gray-800">
                                    <Image
                                        src={product.images[currentImageIndex]?.url || product.thumbnail_url}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                        priority
                                    />

                                    {/* Image Navigation */}
                                    {product.images.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevImage}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg"
                                            >
                                                <ChevronLeft className="w-6 h-6" />
                                            </button>
                                            <button
                                                onClick={nextImage}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-all shadow-lg"
                                            >
                                                <ChevronRight className="w-6 h-6" />
                                            </button>
                                        </>
                                    )}

                                    {/* Badges */}
                                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                                        {product.condition === 'new' && <Badge variant="new">ใหม่</Badge>}
                                        {discount > 0 && <Badge variant="hot">ลด {discount}%</Badge>}
                                    </div>

                                    {/* Image Counter */}
                                    {product.images.length > 1 && (
                                        <div className="absolute bottom-4 right-4 px-3 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-sm">
                                            {currentImageIndex + 1} / {product.images.length}
                                        </div>
                                    )}
                                </div>

                                {/* Thumbnail Strip */}
                                {product.images.length > 1 && (
                                    <div className="p-4 flex gap-2 overflow-x-auto scrollbar-hide">
                                        {product.images.map((img, idx) => (
                                            <div key={idx} className="relative group flex-shrink-0">
                                                <button
                                                    onClick={() => setCurrentImageIndex(idx)}
                                                    className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${idx === currentImageIndex
                                                        ? 'border-neon-purple'
                                                        : 'border-transparent hover:border-gray-300'
                                                        }`}
                                                >
                                                    <Image
                                                        src={img.url}
                                                        alt={`${product.title} - ${idx + 1}`}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </button>
                                                {user?.uid === product.seller_id && (
                                                    <button
                                                        onClick={(e) => handleDeleteImage(img.url, idx, e)}
                                                        className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
                                                        title="ลบรูปภาพ"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Product Info */}
                        <div className="flex flex-col gap-6">
                            {/* Title & Price Card */}
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="mb-6">
                                    <h1 className="text-2xl lg:text-3xl font-display font-bold leading-tight mb-4 text-gray-900 dark:text-white">
                                        {product.title}
                                    </h1>

                                    <div className="flex items-end gap-3 mb-4">
                                        <span className="text-4xl font-bold text-neon-purple">
                                            ฿{product.price.toLocaleString()}
                                        </span>
                                        {product.original_price && product.original_price > product.price && (
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-lg text-text-secondary dark:text-gray-400 line-through">
                                                    ฿{product.original_price.toLocaleString()}
                                                </span>
                                                <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded-full">
                                                    -{discount}%
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stats Row */}
                                    <div className="flex items-center gap-6 text-sm text-text-secondary dark:text-gray-400 pb-6 border-b border-gray-100 dark:border-gray-800">
                                        <div className="flex items-center gap-1.5" title="จำนวนคนเก็บไว้ในรายการโปรด">
                                            <Heart className="w-4 h-4" />
                                            <span>{product.favorites_count} ถูกใจ</span>
                                        </div>
                                        <div className="flex items-center gap-1.5" title="จำนวนการเข้าชม">
                                            <Eye className="w-4 h-4" />
                                            <span>{product.views_count} เข้าชม</span>
                                        </div>
                                        <div className="flex items-center gap-1.5" title="วันที่ลงประกาศ">
                                            <Clock className="w-4 h-4" />
                                            <span>{new Date(product.created_at).toLocaleDateString('th-TH')}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Product Specifications (Moved from Left) */}
                                <div className="grid grid-cols-2 gap-y-3 gap-x-8 text-sm mb-8">
                                    <div className="col-span-2 text-gray-900 dark:text-white font-semibold mb-1">คุณสมบัติสินค้า</div>

                                    <div className="flex justify-between items-center text-text-secondary dark:text-gray-400">
                                        <span>หมวดหมู่</span>
                                    </div>
                                    <div className="font-medium text-right">
                                        {category ? (
                                            <Link href={`/category/${category.slug}`} className="text-neon-purple hover:underline">
                                                {category.name_th}
                                            </Link>
                                        ) : 'ไม่ระบุ'}
                                    </div>

                                    <div className="flex justify-between items-center text-text-secondary dark:text-gray-400">
                                        <span>สภาพสินค้า</span>
                                    </div>
                                    <div className="font-medium text-right">
                                        <Badge variant={product.condition === 'new' ? 'new' : 'default'} className="px-2 py-0.5 text-xs">
                                            {conditionLabel}
                                        </Badge>
                                    </div>

                                    <div className="flex justify-between items-center text-text-secondary dark:text-gray-400">
                                        <span>จังหวัดที่นัดรับ</span>
                                    </div>
                                    <div className="font-medium text-right truncate">
                                        {product.location_province}
                                    </div>
                                </div>

                                {/* Action Buttons - Stacked for mobile, side-by-side for desktop */}
                                {user && user.uid === product.seller_id ? (
                                    // Owner Actions
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            disabled={isDeleting}
                                            variant="outline"
                                            className="w-full h-12 text-lg border-red-500 text-red-500 hover:bg-red-50"
                                            onClick={handleDelete}
                                        >
                                            {isDeleting ? (
                                                <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-500 border-t-transparent mr-2" />
                                            ) : (
                                                <Trash2 className="w-5 h-5 mr-2" />
                                            )}
                                            {isDeleting ? 'กำลังลบ...' : 'ลบสินค้า'}
                                        </Button>
                                    </div>
                                ) : (
                                    // Visitor/Buyer Actions
                                    <div className="flex flex-col gap-3">
                                        <Button variant="primary" className="w-full h-12 text-lg shadow-lg shadow-neon-purple/20" onClick={handleChat}>
                                            <MessageCircle className="w-5 h-5 mr-2" />
                                            แชทกับผู้ขาย
                                        </Button>
                                        <div className="grid grid-cols-2 gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={handleFavorite}
                                                className={`h-11 ${isFavorited ? 'border-coral-orange text-coral-orange bg-coral-orange/5' : 'hover:bg-gray-50'}`}
                                            >
                                                <Heart className={`w-5 h-5 mr-2 ${isFavorited ? 'fill-coral-orange' : ''}`} />
                                                {isFavorited ? 'ถูกใจแล้ว' : 'ถูกใจ'}
                                            </Button>
                                            <Button variant="outline" className="h-11 hover:bg-gray-50">
                                                <Share2 className="w-5 h-5 mr-2" />
                                                แชร์
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Seller & Shipping Info Card */}
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-neon-purple to-coral-orange flex items-center justify-center text-white text-xl font-bold flex-shrink-0 shadow-md">
                                        {product.seller_name?.[0] || 'J'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg text-gray-900 dark:text-white truncate">{product.seller_name || 'JaiKod Seller'}</h3>
                                        <div className="flex items-center gap-3 text-sm text-text-secondary dark:text-gray-400 mt-1">
                                            <div className="flex items-center gap-1">
                                                <MapPin className="w-3.5 h-3.5" />
                                                <span className="truncate">{product.location_province || 'ไม่ระบุ'}</span>
                                            </div>
                                            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                            <div className="flex items-center gap-1 text-emerald-600 font-medium">
                                                <ShieldCheck className="w-3.5 h-3.5" />
                                                <span>ยืนยันตัวตน</span>
                                            </div>
                                        </div>
                                    </div>
                                    <Button variant="outline" size="sm" className="rounded-full px-4" onClick={() => router.push(`/profile/${product.seller_id}`)}>
                                        ดูร้านค้า
                                    </Button>
                                </div>

                                <div className="space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className={`p-2 rounded-lg ${product.can_ship ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <Package className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`font-medium ${product.can_ship ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {product.can_ship ? 'จัดส่งพัสดุได้' : 'ไม่รับส่งพัสดุ'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <div className={`p-2 rounded-lg ${product.can_pickup ? 'bg-orange-50 text-orange-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div className="flex-1">
                                            <div className={`font-medium ${product.can_pickup ? 'text-gray-900' : 'text-gray-400'}`}>
                                                {product.can_pickup ? 'นัดรับสินค้าได้' : 'ไม่สะดวกนัดรับ'}
                                            </div>
                                            {product.can_pickup && (
                                                <div className="text-xs text-text-secondary">
                                                    โซน: {product.location_amphoe || 'ไม่ระบุ'}, {product.location_province || 'ไม่ระบุ'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description Section (Full Width) */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 lg:p-10 shadow-sm border border-gray-100 dark:border-gray-800 mb-12">
                        <div className="max-w-4xl">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <span className="w-1.5 h-6 bg-neon-purple rounded-full"></span>
                                รายละเอียดสินค้า
                            </h2>
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                                    {product.description}
                                </p>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    )
}

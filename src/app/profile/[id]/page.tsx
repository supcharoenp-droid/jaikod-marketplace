'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSellerProfile } from '@/lib/seller'
import { getProductsBySeller } from '@/services/productService'
import { SellerProfile } from '@/types'
import { ProductWithId } from '@/types/product'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import { Package, User, Star, Sparkles, CheckCircle, Award } from 'lucide-react'

export default function PublicProfilePage() {
    const params = useParams()
    const router = useRouter()
    const userId = params.id as string

    const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null)
    const [products, setProducts] = useState<ProductWithId[]>([])
    const [loading, setLoading] = useState(true)

    // 🌟 DEV: Check if this is JaiStar profile
    const isJaiStar = userId === 'jaistar' || userId === 'JaiStar'

    useEffect(() => {
        const loadData = async () => {
            if (!userId) return

            try {
                // 1. Try to get seller profile
                const profile = await getSellerProfile(userId)

                if (profile && !isJaiStar) {
                    // If is seller (but not jaistar), redirect to their shop page
                    const shopSlug = (profile as any).slug || (profile as any).shop_slug || profile.id
                    router.replace(`/shop/${shopSlug}`)
                    return
                }

                // 2. If not seller, or is jaistar, show profile
                setSellerProfile(profile)
                const userProducts = await getProductsBySeller(userId)
                setProducts(userProducts)

            } catch (error) {
                console.error('Error loading public profile:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [userId, router, isJaiStar])


    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple"></div>
            </div>
        )
    }

    // If redirected, this won't show long
    if (sellerProfile && !isJaiStar) return null

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    {/* 🌟 JaiStar Special Header */}
                    {isJaiStar ? (
                        <div className="bg-gradient-to-br from-yellow-50 via-orange-50 to-pink-50 dark:from-yellow-900/20 dark:via-orange-900/20 dark:to-pink-900/20 rounded-2xl p-8 shadow-lg mb-8 border-2 border-yellow-400/50 relative overflow-hidden">
                            {/* Background Decoration */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl"></div>
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"></div>

                            <div className="relative flex flex-col items-center text-center">
                                {/* Avatar with Stars */}
                                <div className="relative mb-4">
                                    <div className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl">
                                        <Star className="w-16 h-16 text-white fill-white" />
                                    </div>
                                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                                        <Sparkles className="w-5 h-5 text-white" />
                                    </div>
                                    <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Award className="w-4 h-4 text-white" />
                                    </div>
                                </div>

                                {/* Name & Badge */}
                                <div className="flex items-center gap-2 mb-2">
                                    <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-600 via-orange-600 to-pink-600 bg-clip-text text-transparent">
                                        JaiStar ⭐
                                    </h1>
                                    <div className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                                        <CheckCircle className="w-3 h-3" />
                                        ผู้ขายระดับดาว
                                    </div>
                                </div>

                                <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-2xl">
                                    🌟 <strong>Premium Seller</strong> | ผู้ขายคุณภาพ การันตีความพึงพอใจ 100%
                                    <br />
                                    รับประกันสินค้าทุกชิ้น | จัดส่งรวดเร็ว | บริการหลังการขายดีเยี่ยม
                                </p>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-4">
                                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 shadow">
                                        <div className="text-2xl font-bold text-yellow-600">⭐ 5.0</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">คะแนน</div>
                                    </div>
                                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 shadow">
                                        <div className="text-2xl font-bold text-green-600">1,234</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">ขายแล้ว</div>
                                    </div>
                                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-3 shadow">
                                        <div className="text-2xl font-bold text-blue-600">99%</div>
                                        <div className="text-xs text-gray-600 dark:text-gray-400">พึงพอใจ</div>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 justify-center mt-4">
                                    <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">🏆 Top Seller 2026</span>
                                    <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">✅ ยืนยันตัวตนแล้ว</span>
                                    <span className="px-3 py-1 bg-green-500 text-white text-xs font-semibold rounded-full">🚀 จัดส่งรวดเร็ว</span>
                                    <span className="px-3 py-1 bg-pink-500 text-white text-xs font-semibold rounded-full">💎 คุณภาพพรีเมียม</span>
                                </div>

                                {/* Dev Notice */}
                                <div className="mt-6 px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-lg text-sm text-yellow-800 dark:text-yellow-300">
                                    🔧 <strong>DEV MODE:</strong> JaiStar Promotion - จะลบออกใน Production
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Normal User Header */
                        <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-sm mb-8 flex flex-col items-center text-center">
                            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <User className="w-12 h-12" />
                            </div>
                            <h1 className="text-2xl font-bold mb-2">สมาชิก JaiKod</h1>
                            <p className="text-gray-500">ID: {userId}</p>
                        </div>
                    )}

                    {/* Products Grid */}
                    <div className="mb-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-neon-purple" />
                        <h2 className="text-xl font-bold">สินค้าที่ลงขาย ({products.length})</h2>
                    </div>

                    {products.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400 bg-white dark:bg-surface-dark rounded-2xl border border-dashed border-gray-200">
                            {isJaiStar ? (
                                <div>
                                    <p className="text-lg mb-2">🌟 JaiStar กำลังเตรียมสินค้าคุณภาพให้คุณ</p>
                                    <p className="text-sm">อีกไม่นานจะมีสินค้าพรีเมียมมากมาย!</p>
                                </div>
                            ) : (
                                'ยังไม่มีสินค้าที่ลงขาย'
                            )}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

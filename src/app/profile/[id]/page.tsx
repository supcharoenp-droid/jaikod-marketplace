'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getSellerProfile } from '@/lib/seller'
import { getProductsBySeller } from '@/lib/products'
import { SellerProfile, Product } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ProductCard from '@/components/product/ProductCard'
import { Package, User } from 'lucide-react'

export default function PublicProfilePage() {
    const params = useParams()
    const router = useRouter()
    const userId = params.id as string

    const [sellerProfile, setSellerProfile] = useState<SellerProfile | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadData = async () => {
            if (!userId) return

            try {
                // 1. Try to get seller profile
                const profile = await getSellerProfile(userId)

                if (profile) {
                    // If is seller, redirect to their shop page for better experience
                    router.replace(`/shop/${profile.shop_slug}`)
                    return
                }

                // 2. If not seller, just load their products (if any)
                setSellerProfile(null)
                const userProducts = await getProductsBySeller(userId)
                setProducts(userProducts)

            } catch (error) {
                console.error('Error loading public profile:', error)
            } finally {
                setLoading(false)
            }
        }

        loadData()
    }, [userId, router])


    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple"></div>
            </div>
        )
    }

    // If redirected, this won't show long
    if (sellerProfile) return null

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1 py-12">
                <div className="container mx-auto px-4">
                    {/* Simple User Header since we don't have full public user profile doc */}
                    <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-sm mb-8 flex flex-col items-center text-center">
                        <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-4">
                            <User className="w-12 h-12" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">สมาชิก JaiKod</h1>
                        <p className="text-gray-500">ID: {userId}</p>
                    </div>

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
                            ยังไม่มีสินค้าที่ลงขาย
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    )
}

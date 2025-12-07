'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, MessageCircle, UserPlus, Package, ShieldCheck, Clock } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { getSellerProfileBySlug } from '@/lib/seller'
import { getProductsBySeller } from '@/lib/products'
import { SellerProfile, Product } from '@/types'

export default function ShopPage({ params }: { params: { slug: string } }) {
    const slug = decodeURIComponent(params.slug)
    const [shop, setShop] = useState<SellerProfile | null>(null)
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState<'all' | 'new' | 'best'>('all')

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true)
            try {
                const shopData = await getSellerProfileBySlug(slug)
                if (shopData) {
                    setShop(shopData)
                    // Fetch products
                    const productsData = await getProductsBySeller(shopData.user_id)
                    setProducts(productsData)
                }
            } catch (error) {
                console.error('Error fetching shop data:', error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchData()
    }, [slug])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-bg-dark flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!shop) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-bg-dark flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col items-center justify-center text-center p-4">
                    <StoreOff className="w-20 h-20 text-gray-300 mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">ไม่พบร้านค้าที่คุณต้องการ</h1>
                    <p className="text-gray-500 mb-8">ร้านค้านี้อาจถูกปิด หรือคุณอาจพิมพ์ URL ผิด</p>
                    <Link href="/">
                        <Button variant="primary">กลับไปหน้าหลัก</Button>
                    </Link>
                </main>
                <Footer />
            </div>
        )
    }

    // Filter products based on active tab (Mock logic for now as we fetch all)
    const displayedProducts = products

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg-dark font-sans text-gray-900 dark:text-white">
            <Header />

            {/* Shop Header / Cover */}
            <div className="bg-white dark:bg-surface-dark shadow-sm">
                {/* Cover Image */}
                <div className="h-48 md:h-64 lg:h-80 w-full relative bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700">
                    {shop.cover_url && (
                        <Image
                            src={shop.cover_url}
                            alt={shop.shop_name}
                            fill
                            className="object-cover"
                        />
                    )}
                </div>

                {/* Shop Profile Info */}
                <div className="container mx-auto px-4 pb-6">
                    <div className="relative -mt-16 sm:-mt-20 mb-6 flex flex-col sm:flex-row items-end sm:items-end gap-6">
                        {/* Avatar */}
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-surface-dark bg-white shadow-md overflow-hidden flex-shrink-0">
                            {shop.avatar_url ? (
                                <Image
                                    src={shop.avatar_url}
                                    alt={shop.shop_name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-neon-purple to-coral-orange flex items-center justify-center text-white text-4xl font-bold">
                                    {shop.shop_name.charAt(0)}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 w-full sm:mb-2 text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold flex items-center justify-center sm:justify-start gap-2">
                                {shop.shop_name}
                                {shop.is_verified_seller && (
                                    <span title="ร้านค้าผ่านการยืนยันตัวตน">
                                        <ShieldCheck className="w-6 h-6 text-blue-500" />
                                    </span>
                                )}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="font-bold text-gray-900 dark:text-white">
                                        {(shop.rating_score || 0).toFixed(1)}
                                    </span>
                                    <span>({shop.rating_count || 0} รีวิว)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <UserPlus className="w-4 h-4" />
                                    <span>ผู้ติดตาม {shop.follower_count || 0} คน</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Package className="w-4 h-4" />
                                    <span>สินค้า {products.length} รายการ</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mb-2 w-full sm:w-auto justify-center">
                            <Button variant="outline" className="flex-1 sm:flex-none">
                                <UserPlus className="w-4 h-4 mr-2" />
                                ติดตาม
                            </Button>
                            <Button variant="primary" className="flex-1 sm:flex-none">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                พูดคุย
                            </Button>
                        </div>
                    </div>

                    {/* Description */}
                    {shop.shop_description && (
                        <div className="max-w-3xl mb-6">
                            <p className="text-gray-600 dark:text-gray-300 line-clamp-2 hover:line-clamp-none transition-all cursor-pointer">
                                {shop.shop_description}
                            </p>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-800">
                        <TabButton
                            active={activeTab === 'all'}
                            onClick={() => setActiveTab('all')}
                            label="สินค้าทั้งหมด"
                        />
                        <TabButton
                            active={activeTab === 'new'}
                            onClick={() => setActiveTab('new')}
                            label="สินค้ามาใหม่"
                        />
                        <TabButton
                            active={activeTab === 'best'}
                            onClick={() => setActiveTab('best')}
                            label="สินค้าขายดี"
                        />
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <main className="container mx-auto px-4 py-8">
                {products.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {displayedProducts.map((product) => (
                            <Link
                                href={`/product/${product.slug || product.id}`}
                                key={product.id}
                                className="group bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all hover:-translate-y-1 block"
                            >
                                <div className="aspect-[1/1] relative bg-gray-100 dark:bg-gray-800">
                                    {product.images?.[0]?.url && (
                                        <Image
                                            src={product.images[0].url}
                                            alt={product.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    )}
                                    {/* Overlay Status */}
                                    {product.status === 'sold' && (
                                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                                            ขายแล้ว
                                        </div>
                                    )}
                                </div>
                                <div className="p-3">
                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2 mb-1 h-10">
                                        {product.title}
                                    </h3>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className="text-lg font-bold text-neon-purple">
                                            ฿{product.price.toLocaleString()}
                                        </span>
                                        {product.original_price && (
                                            <span className="text-xs text-gray-400 line-through">
                                                ฿{product.original_price.toLocaleString()}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 text-xs text-gray-500">
                                        <span className="truncate max-w-[50%]">{shop.shop_name}</span>
                                        <span className="flex items-center">
                                            <Star className="w-3 h-3 mr-1 fill-amber-400 text-amber-400" />
                                            {shop.rating_score.toFixed(1)}
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">ยังไม่มีสินค้าในหมวดหมู่นี้</h3>
                        <p className="text-gray-500">ลองเลือกหมวดหมู่อื่นดูนะ</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
    return (
        <button
            onClick={onClick}
            className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${active
                ? 'border-neon-purple text-neon-purple'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
        >
            {label}
        </button>
    )
}

function StoreOff({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M2.97 12.92A2 2 0 0 0 2 15v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6a2 2 0 0 0-.97-2.08" /><path d="m2 9 3-6 6 3 6-3 3 6" /><path d="M12 12V4" /><path d="M10 2h4" /><line x1="2" x2="22" y1="2" y2="22" /></svg>
    )
}

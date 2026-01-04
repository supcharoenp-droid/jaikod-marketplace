'use client'

import React, { useEffect, useState } from 'react'
import Header from '@/components/layout/Header'
import Link from 'next/link'
import { Search, BadgeCheck, Tag, Zap, TrendingUp, Store } from 'lucide-react'
import {
    getFeaturedOfficialStores,
    getMallPromotions,
    getMallFlashSales,
    MALL_CATEGORIES
} from '@/services/mallService'
import OfficialStoreCard from '@/components/mall/OfficialStoreCard'
import ProductCard from '@/components/product/ProductCard'
import { SellerProfile, Product, Promotion } from '@/types'

export default function MallPage() {
    const [featuredStores, setFeaturedStores] = useState<Partial<SellerProfile>[]>([])
    const [promotions, setPromotions] = useState<Promotion[]>([])
    const [flashSales, setFlashSales] = useState<Product[]>([])

    useEffect(() => {
        const load = async () => {
            const [stores, promos, flash] = await Promise.all([
                getFeaturedOfficialStores(),
                getMallPromotions(),
                getMallFlashSales()
            ])
            setFeaturedStores(stores)
            setPromotions(promos)
            setFlashSales(flash)
        }
        load()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg-dark">
            <Header />

            {/* 1. Mall Hero Banner */}
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white pb-12 pt-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full text-xs font-semibold text-blue-300 mb-2 border border-blue-500/30">
                                <BadgeCheck className="w-4 h-4" />
                                OFFICIAL STORES ONLY
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-2">
                                <span className="text-red-500">JaiKod</span> Mall
                            </h1>
                            <p className="text-gray-400">แหล่งรวมร้านค้าทางการ แบรนด์แท้ 100% เชื่อถือได้</p>
                        </div>

                        {/* Search in Mall */}
                        <div className="w-full md:w-96 mt-6 md:mt-0 relative">
                            <input
                                type="text"
                                placeholder="ค้นหาร้านค้าทางการ..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:bg-white/20 transition"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                        </div>
                    </div>

                    {/* 2. Mall Categories */}
                    <div className="grid grid-cols-5 gap-4">
                        {MALL_CATEGORIES.map(cat => (
                            <Link key={cat.id} href={`/mall/category/${cat.id}`} className="group text-center">
                                <div className="w-16 h-16 mx-auto bg-white/10 rounded-2xl flex items-center justify-center mb-2 group-hover:bg-white group-hover:scale-110 transition-all duration-300">
                                    <img src={cat.image} alt={cat.name} className="w-10 h-10 object-contain drop-shadow-lg" />
                                </div>
                                <span className="text-xs font-medium text-gray-300 group-hover:text-white">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            <main className="container mx-auto px-4 -mt-8 space-y-12 pb-20 relative z-10">

                {/* 3. Mall Promotions */}
                <section className="bg-white dark:bg-card-dark rounded-2xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                    <div className="flex items-center gap-2 mb-6">
                        <Tag className="w-6 h-6 text-red-500" />
                        <h2 className="text-xl font-bold">คูปองร้านค้าทางการ</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {promotions.map(promo => (
                            <div key={promo.id} className="border border-dashed border-red-200 bg-red-50 dark:bg-red-900/10 p-4 rounded-xl flex items-center justify-between">
                                <div>
                                    <div className="font-bold text-red-600 dark:text-red-400">{promo.name}</div>
                                    <div className="text-xs text-gray-500">ขั้นต่ำ ฿{promo.min_spend?.toLocaleString()}</div>
                                </div>
                                <button className="bg-red-500 text-white px-4 py-1.5 rounded-lg text-sm font-semibold shadow hover:bg-red-600 transition">
                                    เก็บโค้ด
                                </button>
                            </div>
                        ))}
                    </div>
                </section>

                {/* 4. Featured Official Stores */}
                <section>
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <Store className="w-6 h-6 text-blue-500" />
                            <h2 className="text-2xl font-bold">ร้านค้าแนะนำ</h2>
                        </div>
                        <Link href="/mall/stores" className="text-sm text-blue-500 hover:underline">ดูทั้งหมด</Link>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                        {featuredStores.map(store => (
                            <OfficialStoreCard key={store.id} store={store} />
                        ))}
                    </div>
                </section>

                {/* 5. Mall Flash Sale */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <Zap className="w-6 h-6 text-yellow-500 fill-current" />
                        <h2 className="text-2xl font-bold">Mall Flash Deals</h2>
                        <div className="bg-black text-white text-xs px-2 py-0.5 rounded ml-2 animate-pulse">
                            Ending in 02:45:10
                        </div>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                        {flashSales.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </section>

                {/* 6. AI Store Ranking (Mock) */}
                <section>
                    <div className="flex items-center gap-2 mb-6">
                        <TrendingUp className="w-6 h-6 text-neon-purple" />
                        <h2 className="text-2xl font-bold">ร้านค้ามาแรงประจำสัปดาห์</h2>
                    </div>
                    <div className="bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm">
                        <div className="space-y-4">
                            {featuredStores.slice(0, 3).map((store, index) => (
                                <div key={store.id} className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 last:border-0 pb-4 last:pb-0">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : 'bg-orange-400'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <img src={store.shop_logo} alt={store.shop_name} className="w-12 h-12 rounded-lg bg-gray-100 object-cover" />
                                        <div>
                                            <div className="font-bold flex items-center gap-1">
                                                {store.shop_name}
                                                <BadgeCheck className="w-4 h-4 text-blue-500" />
                                            </div>
                                            <div className="text-xs text-gray-500">{store.shop_description}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-green-500">+{store.rating_count} Sales</div>
                                        <div className="text-xs text-gray-400">Last 7 days</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
        </div>
    )
}

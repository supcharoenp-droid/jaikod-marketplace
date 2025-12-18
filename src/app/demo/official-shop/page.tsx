
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Star, MessageCircle, UserPlus, Package, ShieldCheck, Clock, Store } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'

// MOCK DATA FOR DEMO
const DEMO_SHOP = {
    shop_name: 'Samsung Official Store',
    shop_type: 'official_store',
    is_verified_seller: true,
    cover_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80', // Tech banner
    avatar_url: 'https://images.unsplash.com/photo-1610915404118-24329a1bd420?auto=format&fit=crop&w=200&q=80', // Samsung-ish logo
    shop_description: 'Welcome to the official Samsung store on JaiKod. Shop the latest Galaxy phones, tablets, and accessories with 100% authentic guarantee.',
    rating_score: 4.9,
    rating_count: 1250,
    follower_count: 8500,
    theme_color: 'blue'
}

const DEMO_PRODUCTS = [
    { id: 1, title: 'Samsung Galaxy S24 Ultra 5G (12GB/256GB)', price: 46900, original_price: 48900, image: 'https://images.unsplash.com/photo-1610945431162-32753239d89d?auto=format&fit=crop&w=300&q=80' },
    { id: 2, title: 'Samsung Galaxy Z Flip 5', price: 35900, original_price: 39900, image: 'https://images.unsplash.com/photo-1627581515257-1959828d82bd?auto=format&fit=crop&w=300&q=80' },
    { id: 3, title: 'Samsung Galaxy Watch 6', price: 9900, original_price: 11900, image: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=300&q=80' },
    { id: 4, title: 'Samsung Galaxy Buds 2 Pro', price: 5990, original_price: 6990, image: 'https://images.unsplash.com/photo-1572569028738-411a0977d4aa?auto=format&fit=crop&w=300&q=80' },
]

export default function GenericShopDemo() {
    const [activeTab, setActiveTab] = useState<'all' | 'new' | 'best'>('all')

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg-dark font-sans text-gray-900 dark:text-white">
            <Header />

            {/* Shop Header / Cover */}
            <div className="bg-white dark:bg-surface-dark shadow-sm">

                {/* Cover Image */}
                <div className="h-48 md:h-64 lg:h-80 w-full relative bg-gray-200">
                    <Image src={DEMO_SHOP.cover_url} alt="Cover" fill className="object-cover" />
                </div>

                {/* Shop Profile Info */}
                <div className="container mx-auto px-4 pb-6">
                    <div className="relative -mt-16 sm:-mt-20 mb-6 flex flex-col sm:flex-row items-end sm:items-end gap-6">
                        {/* Avatar */}
                        <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-surface-dark bg-white shadow-md overflow-hidden flex-shrink-0">
                            <Image src={DEMO_SHOP.avatar_url} alt="Logo" fill className="object-cover" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 w-full sm:mb-2 text-center sm:text-left">
                            <h1 className="text-2xl sm:text-3xl font-bold flex items-center justify-center sm:justify-start gap-2">
                                {DEMO_SHOP.shop_name}
                                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ml-2 shadow-sm">
                                    <ShieldCheck className="w-3 h-3 text-white" /> Official Mall
                                </span>
                            </h1>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2 text-sm text-gray-600 dark:text-gray-300">
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                                    <span className="font-bold text-gray-900 dark:text-white">{DEMO_SHOP.rating_score}</span>
                                    <span>({DEMO_SHOP.rating_count} รีวิว)</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <UserPlus className="w-4 h-4" />
                                    <span>ผู้ติดตาม {DEMO_SHOP.follower_count.toLocaleString()} คน</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 mb-2 w-full sm:w-auto justify-center">
                            <Button variant="outline">ติดตาม</Button>
                            <Button variant="primary">พูดคุย</Button>
                        </div>
                    </div>

                    {/* Coupons Section */}
                    <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-dashed border-gray-300">
                        <h3 className="font-bold mb-3 flex items-center gap-2">
                            <Store className="w-5 h-5 text-neon-purple" /> คูปองส่วนลดจากร้านค้า
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            <CouponCard discount="฿500" minSpend="฿10,000" color="orange" />
                            <CouponCard discount="10%" minSpend="฿5,000" color="red" />
                            <CouponCard discount="ส่งฟรี 0.-" minSpend="฿2,000" color="blue" />
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
                        {['สินค้าทั้งหมด', 'สินค้ามาใหม่', 'สินค้าขายดี'].map((tab, i) => (
                            <button key={i} className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${i === 0 ? 'border-neon-purple text-neon-purple' : 'border-transparent text-gray-500'}`}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Product Grid */}
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {DEMO_PRODUCTS.map((product) => (
                        <div key={product.id} className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-all">
                            <div className="aspect-square relative bg-gray-100">
                                <Image src={product.image} alt={product.title} fill className="object-cover" />
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm font-medium line-clamp-2 h-10 mb-2">{product.title}</h3>
                                <div className="flex items-end justify-between">
                                    <span className="text-lg font-bold text-neon-purple">฿{product.price.toLocaleString()}</span>
                                    {product.original_price && <span className="text-xs text-gray-400 line-through">฿{product.original_price.toLocaleString()}</span>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </div>
    )
}

function CouponCard({ discount, minSpend, color }: any) {
    const colors: any = {
        orange: 'from-orange-500 to-red-500',
        red: 'from-red-500 to-pink-500',
        blue: 'from-blue-500 to-indigo-500'
    }
    return (
        <div className={`bg-gradient-to-r ${colors[color]} rounded-lg p-3 text-white flex items-center justify-between shadow-sm relative overflow-hidden`}>
            <div className="absolute -left-2 top-0 bottom-0 w-4 bg-white border-l border-dashed border-gray-200"></div>
            <div className="absolute -right-2 top-0 bottom-0 w-4 bg-white border-r border-dashed border-gray-200"></div>
            <div className="pl-4">
                <p className="font-bold text-lg">{discount}</p>
                <p className="text-xs opacity-90">ซื้อขั้นต่ำ {minSpend}</p>
            </div>
            <button className="bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold hover:bg-gray-100 transition-colors">
                เก็บ
            </button>
        </div>
    )
}

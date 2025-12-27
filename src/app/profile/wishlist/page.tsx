'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Heart,
    ShoppingCart,
    Trash2,
    Share2,
    Sparkles,
    TrendingDown,
    Bell,
    Grid,
    List,
    Search
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import useProfile from '@/hooks/useProfile'
import ProfileLayout from '@/components/profile/v2/ProfileLayout'
import Image from 'next/image'

interface WishlistItem {
    productId: string
    title: string
    price: number
    originalPrice?: number
    image: string
    addedAt: Date
    note?: string
    priceDropProbability?: number
}

export default function WishlistPage() {
    const { t, language } = useLanguage()
    const { user, stats } = useProfile()

    // TODO: Fetch real wishlist from Firestore
    // For now using mock data that matches ProfileOverviewV3 stats (2 items)
    const [wishlist, setWishlist] = useState<WishlistItem[]>([
        {
            productId: '1',
            title: 'iPhone 15 Pro Max 256GB',
            price: 45900,
            originalPrice: 48900,
            image: '/images/products/iphone.jpg',
            addedAt: new Date('2024-12-01'),
            priceDropProbability: 75
        },
        {
            productId: '2',
            title: 'MacBook Pro M3 14"',
            price: 65900,
            image: '/images/products/macbook.jpg',
            addedAt: new Date('2024-11-28'),
            note: 'For work',
            priceDropProbability: 30
        }
        // Note: Keep only 2 items to match stats shown in ProfileOverviewV3
    ])

    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
    const [searchQuery, setSearchQuery] = useState('')

    const handleRemove = (productId: string) => {
        if (confirm(language === 'th' ? 'ลบออกจากรายการโปรด?' : 'Remove from wishlist?')) {
            setWishlist(wishlist.filter(item => item.productId !== productId))
        }
    }

    const handleAddToCart = (productId: string) => {
        // TODO: Add to cart logic
        alert(language === 'th' ? 'เพิ่มลงตะกร้าแล้ว!' : 'Added to cart!')
    }

    const filteredWishlist = wishlist.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const aiGroups = {
        gifts: wishlist.filter(item => item.note?.toLowerCase().includes('gift')),
        personal: wishlist.filter(item => !item.note?.toLowerCase().includes('gift')),
        priceDrop: wishlist.filter(item => (item.priceDropProbability || 0) > 50)
    }

    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            {language === 'th' ? 'รายการโปรด' : 'Wishlist'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {wishlist.length} {language === 'th' ? 'รายการ' : 'items'}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid'
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <Grid className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-lg transition-colors ${viewMode === 'list'
                                ? 'bg-purple-500 text-white'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                                }`}
                        >
                            <List className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={language === 'th' ? 'ค้นหาสินค้า...' : 'Search products...'}
                        className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* AI Price Drop Alert */}
                {aiGroups.priceDrop.length > 0 && (
                    <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
                        <TrendingDown className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-1">
                                {language === 'th' ? 'AI คาดการณ์ราคาลด' : 'AI Price Drop Prediction'}
                            </p>
                            <p className="text-sm text-orange-600 dark:text-orange-400">
                                {language === 'th'
                                    ? `${aiGroups.priceDrop.length} รายการมีโอกาสลดราคาใน 7-14 วันข้างหน้า`
                                    : `${aiGroups.priceDrop.length} items likely to drop in price within 7-14 days`
                                }
                            </p>
                        </div>
                        <button className="flex items-center gap-1 px-3 py-1.5 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors">
                            <Bell className="w-4 h-4" />
                            {language === 'th' ? 'แจ้งเตือน' : 'Notify Me'}
                        </button>
                    </div>
                )}

                {/* AI Grouping Suggestion */}
                <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <Sparkles className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                            {language === 'th' ? 'AI จัดกลุ่มให้' : 'AI Auto-Grouping'}
                        </p>
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                            {language === 'th'
                                ? `พบ ${aiGroups.gifts.length} รายการสำหรับของขวัญ, ${aiGroups.personal.length} รายการส่วนตัว`
                                : `Found ${aiGroups.gifts.length} gift items, ${aiGroups.personal.length} personal items`
                            }
                        </p>
                    </div>
                </div>

                {/* Wishlist Items */}
                {filteredWishlist.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 text-center"
                    >
                        <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {language === 'th' ? 'ยังไม่มีรายการโปรด' : 'No wishlist items'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {language === 'th' ? 'เพิ่มสินค้าที่คุณชอบเข้ารายการโปรด' : 'Add products you like to your wishlist'}
                        </p>
                        <button
                            onClick={() => window.location.href = '/'}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                        >
                            {language === 'th' ? 'เริ่มช้อปปิ้ง' : 'Start Shopping'}
                        </button>
                    </motion.div>
                ) : (
                    <div className={`
                        grid gap-4
                        ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}
                    `}>
                        <AnimatePresence mode="popLayout">
                            {filteredWishlist.map((item) => (
                                <motion.div
                                    key={item.productId}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-all group"
                                >
                                    <div className="relative aspect-square bg-gray-100 dark:bg-gray-700">
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <ShoppingCart className="w-16 h-16 text-gray-300 dark:text-gray-600" />
                                        </div>
                                        {item.originalPrice && (
                                            <div className="absolute top-3 left-3 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-lg">
                                                -{Math.round((1 - item.price / item.originalPrice) * 100)}%
                                            </div>
                                        )}
                                        {item.priceDropProbability && item.priceDropProbability > 50 && (
                                            <div className="absolute top-3 right-3 px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded-lg flex items-center gap-1">
                                                <TrendingDown className="w-3 h-3" />
                                                {item.priceDropProbability}%
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                                            {item.title}
                                        </h3>

                                        <div className="flex items-baseline gap-2 mb-3">
                                            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                ฿{item.price.toLocaleString()}
                                            </span>
                                            {item.originalPrice && (
                                                <span className="text-sm text-gray-400 line-through">
                                                    ฿{item.originalPrice.toLocaleString()}
                                                </span>
                                            )}
                                        </div>

                                        {item.note && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 italic">
                                                "{item.note}"
                                            </p>
                                        )}

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAddToCart(item.productId)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                            >
                                                <ShoppingCart className="w-4 h-4" />
                                                <span className="text-sm font-medium">
                                                    {language === 'th' ? 'ใส่ตะกร้า' : 'Add to Cart'}
                                                </span>
                                            </button>
                                            <button
                                                onClick={() => handleRemove(item.productId)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </ProfileLayout>
    )
}

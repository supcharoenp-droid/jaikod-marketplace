'use client'

import React from 'react'
import ProfileLayout from '@/components/profile/v2/ProfileLayout'
import ProfileHeaderAI from '@/components/profile/modules/ProfileHeaderAI'
import OverviewWidgets from '@/components/profile/v2/OverviewWidgets'
import AIActivityFeed from '@/components/profile/v2/AIActivityFeed'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// Mock Wishlist Preview Data
const wishlistPreview = [
    { id: 1, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80', price: '฿4,500' },
    { id: 2, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=300&q=80', price: '฿1,200' },
    { id: 3, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=300&q=80', price: '฿290' },
]

export default function ProfileOverviewPage() {
    const { t } = useLanguage()

    return (
        <ProfileLayout title={t('profile.overview')}>
            <ProfileHeaderAI />

            <div className="space-y-8">
                {/* AI Activity Feed */}
                <AIActivityFeed />

                {/* Main Stats / Order Summary */}
                <OverviewWidgets />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Wishlist Preview */}
                    <div className="bg-white dark:bg-card-dark rounded-3xl p-6 shadow-sm border border-gray-100 dark:border-border-dark">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                                <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                {t('profile.tab_wishlist')}
                            </h3>
                            <Link href="/profile/wishlist" className="text-sm font-bold text-neon-purple hover:underline flex items-center gap-1">
                                {t('common.view_all')} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>

                        {wishlistPreview.length > 0 ? (
                            <div className="grid grid-cols-3 gap-4">
                                {wishlistPreview.map((item) => (
                                    <Link key={item.id} href="/profile/wishlist">
                                        <motion.div
                                            whileHover={{ scale: 1.05 }}
                                            className="relative aspect-square rounded-2xl overflow-hidden group bg-gray-100"
                                        >
                                            <img src={item.image} alt="Wishlist" className="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                                            <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                                <p className="text-xs font-bold text-white">{item.price}</p>
                                            </div>
                                        </motion.div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-400">
                                {t('profile.wishlist_empty_desc')}
                            </div>
                        )}
                    </div>

                    {/* Recent Help / Support or Promotion */}
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-3xl p-6 flex flex-col justify-center items-start text-left border border-indigo-100 dark:border-indigo-800/30">
                        <span className="px-3 py-1 bg-white dark:bg-white/10 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-300 mb-4 shadow-sm">
                            New Feature
                        </span>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">Build your trust score</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                            Verify your identity and link social accounts to unlock special seller badges and boost visibility.
                        </p>
                        <Link href="/profile/settings">
                            <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:scale-105 transition-transform">
                                Verify Now
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </ProfileLayout>
    )
}

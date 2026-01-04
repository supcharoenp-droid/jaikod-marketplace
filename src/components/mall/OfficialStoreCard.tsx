'use client'

import React from 'react'
import Link from 'next/link'
import { BadgeCheck, Star, ArrowRight } from 'lucide-react'
import { SellerProfile } from '@/types'

interface OfficialStoreCardProps {
    store: Partial<SellerProfile>
}

export default function OfficialStoreCard({ store }: OfficialStoreCardProps) {
    return (
        <Link href={`/shop/${store.id}`} className="block group">
            <div className="relative h-48 rounded-t-2xl overflow-hidden bg-gray-200">
                {(store as any).cover_url && (
                    <img
                        src={(store as any).cover_url}
                        alt={store.shop_name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                {/* Logo Overlap */}
                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg bg-white p-0.5 shadow-lg">
                        <img
                            src={store.shop_logo || 'https://via.placeholder.com/50'}
                            alt="logo"
                            className="w-full h-full object-cover rounded-md"
                        />
                    </div>
                    <div className="text-white">
                        <h3 className="font-bold flex items-center gap-1 text-lg">
                            {store.shop_name}
                            <BadgeCheck className="w-5 h-5 text-blue-400 fill-blue-900/20" />
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-gray-300">
                            <span className="flex items-center gap-0.5">
                                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                {store.rating_score}
                            </span>
                            <span>•</span>
                            <span>{store.follower_count?.toLocaleString()} ผู้ติดตาม</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white dark:bg-card-dark p-4 rounded-b-2xl border border-t-0 border-gray-100 dark:border-gray-800 shadow-sm group-hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-400 line-clamp-1">{store.shop_description}</span>
                    <span className="text-neon-purple font-medium flex-shrink-0 flex items-center">
                        ไปที่ร้าน <ArrowRight className="w-3 h-3 ml-1" />
                    </span>
                </div>
            </div>
        </Link>
    )
}

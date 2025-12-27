'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin, ShieldCheck, Star, Award, ChevronRight } from 'lucide-react'
import { rankSellersByProximityAndTrust, RecommendedSeller, USER_MOCK_LOCATION } from '@/services/aiSellerRecommendation'
import { useLanguage } from '@/contexts/LanguageContext'

const translations = {
    th: {
        title: 'ผู้ขายแนะนำใกล้คุณ',
        subtitle: 'คัดกรองจากความน่าเชื่อถือและระยะทาง',
        viewAll: 'ดูทั้งหมด',
        trustScore: 'คะแนนความน่าเชื่อถือ',
        km: 'กม.',
        frequentlySold: 'ขายบ่อย',
        visitShop: 'ไปที่ร้านค้า',
    },
    en: {
        title: 'Recommended Sellers Near You',
        subtitle: 'Filtered by trust score and distance',
        viewAll: 'View All',
        trustScore: 'Trust Score',
        km: 'km',
        frequentlySold: 'Frequently Sold',
        visitShop: 'Visit Shop',
    }
}

export default function NearbySellersResult() {
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th
    const [sellers, setSellers] = useState<RecommendedSeller[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            // Using mock location
            // In real app: navigator.geolocation.getCurrentPosition(...)
            const results = await rankSellersByProximityAndTrust(USER_MOCK_LOCATION.lat, USER_MOCK_LOCATION.lng)
            setSellers(results)
            setLoading(false)
        }
        load()
    }, [])

    if (loading) return null

    return (
        <section className="py-6">
            <div className="flex items-center justify-between mb-4 px-4 md:px-0">
                <div className="flex items-center gap-2">
                    <div className="bg-blue-100 p-2 rounded-full dark:bg-blue-900/30">
                        <MapPin className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
                        <p className="text-xs text-gray-500">{t.subtitle}</p>
                    </div>
                </div>
                <Link href="/sellers/nearby" className="text-sm text-blue-500 hover:text-blue-600 font-medium flex items-center">
                    {t.viewAll} <ChevronRight className="w-4 h-4" />
                </Link>
            </div>

            <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                <div className="flex gap-4 w-max">
                    {sellers.map((seller) => (
                        <div
                            key={seller.id}
                            className="w-72 bg-white dark:bg-card-dark border border-gray-100 dark:border-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                        >
                            {/* Trust Badge Background */}
                            <div className="absolute top-0 right-0 p-2">
                                <div className={`px-2 py-0.5 rounded text-[10px] font-bold ${seller.trust_score > 90 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                    {t.trustScore} {seller.trust_score}%
                                </div>
                            </div>

                            <div className="flex gap-3 mb-3">
                                <div className="w-14 h-14 rounded-full bg-gray-200 flex-shrink-0 overflow-hidden border border-gray-100">
                                    <img src={seller.shop_logo} alt={seller.shop_name} className="w-full h-full object-cover" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 flex items-center gap-1">
                                        {seller.shop_name}
                                        {seller.is_verified_seller && <ShieldCheck className="w-4 h-4 text-green-500" />}
                                    </h3>

                                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                        <div className="flex items-center gap-0.5 text-yellow-500">
                                            <Star className="w-3 h-3 fill-yellow-500" />
                                            <span className="font-bold">{seller.rating_score}</span>
                                        </div>
                                        <span>•</span>
                                        <div className="flex items-center gap-0.5 text-blue-600 dark:text-blue-400 font-medium">
                                            <MapPin className="w-3 h-3" />
                                            {seller.distanceKm} {t.km}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-3">
                                {seller.matchReason && (
                                    <span className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 text-[10px] rounded-md border border-blue-100 dark:border-blue-900/30">
                                        {seller.matchReason}
                                    </span>
                                )}
                                {seller.expertCategories.slice(0, 2).map((cat, i) => (
                                    <span key={i} className="px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-[10px] rounded-md">
                                        {cat}
                                    </span>
                                ))}
                            </div>

                            {/* Popular Items Preview (Mock) */}
                            {seller.popularItems && seller.popularItems.length > 0 && (
                                <div className="text-xs text-gray-500 border-t border-gray-50 dark:border-gray-800 pt-3 flex items-center gap-1">
                                    <Award className="w-3 h-3 text-orange-400" />
                                    <span>{t.frequentlySold}: {seller.popularItems.join(', ')}</span>
                                </div>
                            )}

                            <Link
                                href={`/shop/${seller.id}`}
                                className="mt-3 block w-full py-2 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-center rounded-lg text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                {t.visitShop}
                            </Link>

                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

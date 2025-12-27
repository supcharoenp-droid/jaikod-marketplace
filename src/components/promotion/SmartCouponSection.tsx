'use client'

import React, { useEffect, useState } from 'react'
import { TicketPercent, ChevronRight } from 'lucide-react'
import CouponCard from './CouponCard'
import { getPersonalizedCoupons, SmartPromotion } from '@/services/promotionService'
import { useLanguage } from '@/contexts/LanguageContext'

const translations = {
    th: {
        title: 'คูปองส่วนลดเพื่อคุณ',
        subtitle: 'คัดพิเศษเฉพาะคุณ',
        viewAll: 'ดูทั้งหมด',
    },
    en: {
        title: 'Coupons For You',
        subtitle: 'Specially selected for you',
        viewAll: 'View All',
    }
}

export default function SmartCouponSection() {
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th
    const [coupons, setCoupons] = useState<SmartPromotion[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCoupons = async () => {
            // Mock user ID
            const data = await getPersonalizedCoupons('u1')
            setCoupons(data)
            setLoading(false)
        }
        fetchCoupons()
    }, [])

    if (loading || coupons.length === 0) return null

    return (
        <section className="py-2 mb-6">
            <div className="flex items-center justify-between mb-4 px-4 md:px-0">
                <div className="flex items-center gap-2">
                    <div className="bg-orange-100 dark:bg-orange-900/20 p-2 rounded-full">
                        <TicketPercent className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
                        <p className="text-xs text-gray-500">{t.subtitle}</p>
                    </div>
                </div>
                <button className="text-sm font-medium text-orange-500 flex items-center hover:text-orange-600">
                    {t.viewAll} <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            <div className="overflow-x-auto pb-4 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
                <div className="flex gap-4 w-max">
                    {coupons.map(coupon => (
                        <div key={coupon.id} className="w-80 flex-shrink-0">
                            <CouponCard coupon={coupon} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

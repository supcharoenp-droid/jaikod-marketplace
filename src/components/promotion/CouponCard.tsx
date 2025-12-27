'use client'

import React, { useState } from 'react'
import { Ticket, Copy, Check, Sparkles } from 'lucide-react'
import { SmartPromotion } from '@/services/promotionService'
import { useLanguage } from '@/contexts/LanguageContext'

interface CouponCardProps {
    coupon: SmartPromotion
}

const translations = {
    th: {
        off: 'ลด',
        code: 'โค้ด',
        coupon: 'คูปอง',
        collectCoupon: 'เก็บคูปอง',
        copied: 'คัดลอกแล้ว',
        minSpend: 'ขั้นต่ำ',
        exp: 'หมดอายุ',
    },
    en: {
        off: 'OFF',
        code: 'Code',
        coupon: 'Coupon',
        collectCoupon: 'Collect',
        copied: 'Copied',
        minSpend: 'Min. spend',
        exp: 'Exp',
    }
}

export default function CouponCard({ coupon }: CouponCardProps) {
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th
    const [copied, setCopied] = useState(false)

    const handleCopy = () => {
        if (!coupon.code) return
        navigator.clipboard.writeText(coupon.code)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const formatDate = (date: string | Date | undefined) => {
        if (!date) return '-'
        return new Date(date).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
            day: 'numeric',
            month: 'short',
        })
    }

    return (
        <div className="relative group flex items-stretch h-24 bg-white dark:bg-card-dark rounded-lg shadow-sm border border-orange-100 dark:border-gray-800 overflow-hidden hover:shadow-md transition-shadow">
            {/* Left Side: Brand/Type */}
            <div className="w-24 bg-gradient-to-br from-orange-400 to-red-500 p-2 flex flex-col items-center justify-center text-white text-center relative">
                {/* Perforated Edge Effect */}
                <div className="absolute -right-1 top-0 bottom-0 flex flex-col justify-between py-1">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-gray-50 dark:bg-bg-dark -mr-1" />
                    ))}
                </div>

                <div className="font-bold text-lg leading-none">
                    {coupon.discount_type === 'percent' ? `${coupon.discount_value}%` : `฿${coupon.discount_value}`}
                </div>
                <div className="text-[10px] opacity-90 mt-1">{t.off}</div>
            </div>

            {/* Right Side: Info */}
            <div className="flex-1 p-3 flex flex-col justify-between relative pl-4">
                <div>
                    {/* Badge */}
                    <div className="flex items-center gap-2 mb-1">
                        <div className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-red-100 text-red-600 border border-red-200">
                            {coupon.type === 'discount_code' ? t.code : t.coupon}
                        </div>
                        {coupon.match_reason && (
                            <div className="flex items-center gap-0.5 text-[9px] text-neon-purple font-medium">
                                <Sparkles className="w-2.5 h-2.5" /> {coupon.match_reason}
                            </div>
                        )}
                    </div>

                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200 line-clamp-1">
                        {coupon.name}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">
                        {coupon.conditions || `${t.minSpend} ฿${coupon.min_spend}`}
                    </p>
                </div>

                <div className="flex justify-between items-end">
                    <div className="text-[10px] text-gray-400">
                        {t.exp}: {formatDate(coupon.end_date)}
                    </div>

                    <button
                        onClick={handleCopy}
                        disabled={copied}
                        className={`flex items-center gap-1 px-3 py-1 rounded text-xs font-semibold transition-all ${copied
                            ? 'bg-green-100 text-green-700'
                            : 'bg-orange-50 text-orange-600 hover:bg-orange-100'
                            }`}
                    >
                        {copied ? (
                            <>
                                <Check className="w-3 h-3" /> {t.copied}
                            </>
                        ) : (
                            <>
                                {t.collectCoupon}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

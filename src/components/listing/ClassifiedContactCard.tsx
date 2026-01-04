'use client'

/**
 * ============================================
 * Classified Mode Contact Card
 * ============================================
 * 
 * Shows contact instructions when in Classified mode
 * Replaced by Buy button when in Marketplace mode
 */

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
    MessageCircle,
    Phone,
    MapPin,
    ShieldCheck,
    AlertTriangle,
    Info,
    ExternalLink
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePlatform } from '@/contexts/PlatformContext'

// ============================================
// TYPES
// ============================================

interface ClassifiedContactCardProps {
    sellerId: string
    sellerName: string
    listingId: string
    listingTitle: string
    price: number
    isVerified?: boolean
    province?: string
    amphoe?: string
    onChatClick?: () => void
    className?: string
}

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
    th: {
        contactSeller: 'ติดต่อผู้ขาย',
        chatNow: 'แชทเลย',
        howToBuy: 'วิธีการซื้อ',
        step1: 'กดปุ่ม "แชทเลย" เพื่อติดต่อผู้ขาย',
        step2: 'พูดคุยราคาและรายละเอียดสินค้า',
        step3: 'นัดรับสินค้า หรือตกลงวิธีการจัดส่ง',
        step4: 'ชำระเงินโดยตรงกับผู้ขาย',
        safetyTips: 'เคล็ดลับความปลอดภัย',
        tip1: 'ตรวจสอบสินค้าก่อนจ่ายเงิน',
        tip2: 'นัดพบในที่สาธารณะ',
        tip3: 'อย่าโอนเงินล่วงหน้าหากไม่มั่นใจ',
        tip4: 'เก็บหลักฐานการซื้อขาย',
        verifiedSeller: 'ผู้ขายยืนยันตัวตนแล้ว',
        location: 'พื้นที่',
        moreInfo: 'ดูข้อมูลเพิ่มเติม',
        disclaimer: 'JaiKod เป็นแพลตฟอร์มประกาศซื้อขาย การชำระเงินและการส่งมอบสินค้าเป็นความรับผิดชอบระหว่างผู้ซื้อและผู้ขาย',
    },
    en: {
        contactSeller: 'Contact Seller',
        chatNow: 'Chat Now',
        howToBuy: 'How to Buy',
        step1: 'Click "Chat Now" to contact the seller',
        step2: 'Discuss price and product details',
        step3: 'Arrange pickup or agree on shipping method',
        step4: 'Pay the seller directly',
        safetyTips: 'Safety Tips',
        tip1: 'Inspect the item before paying',
        tip2: 'Meet in public places',
        tip3: 'Don\'t transfer money in advance if unsure',
        tip4: 'Keep proof of purchase',
        verifiedSeller: 'Verified Seller',
        location: 'Location',
        moreInfo: 'More Information',
        disclaimer: 'JaiKod is a classifieds platform. Payment and delivery are the responsibility of buyers and sellers.',
    }
}

// ============================================
// COMPONENT
// ============================================

export default function ClassifiedContactCard({
    sellerId,
    sellerName,
    listingId,
    listingTitle,
    price,
    isVerified,
    province,
    amphoe,
    onChatClick,
    className = ''
}: ClassifiedContactCardProps) {
    const { language } = useLanguage()
    const { isClassified } = usePlatform()
    const t = translations[language as 'th' | 'en'] || translations.th

    // Only show in Classified mode
    if (!isClassified) return null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-4">
                <h3 className="text-lg font-bold text-white">{t.contactSeller}</h3>
                <p className="text-sm text-white/70">{sellerName}</p>
            </div>

            <div className="p-5 space-y-5">
                {/* Verified Badge */}
                {isVerified && (
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-50 dark:bg-green-900/20 rounded-xl">
                        <ShieldCheck className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-medium text-green-700 dark:text-green-400">
                            {t.verifiedSeller}
                        </span>
                    </div>
                )}

                {/* Location */}
                {province && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span>{amphoe && `${amphoe}, `}{province}</span>
                    </div>
                )}

                {/* Chat Button */}
                <button
                    onClick={onChatClick}
                    className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:scale-[1.02] transition-all"
                >
                    <MessageCircle className="w-5 h-5" />
                    {t.chatNow}
                </button>

                {/* How to Buy */}
                <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        <Info className="w-4 h-4 text-blue-500" />
                        {t.howToBuy}
                    </h4>
                    <ol className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center justify-center shrink-0">1</span>
                            <span>{t.step1}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center justify-center shrink-0">2</span>
                            <span>{t.step2}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center justify-center shrink-0">3</span>
                            <span>{t.step3}</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-xs font-bold flex items-center justify-center shrink-0">4</span>
                            <span>{t.step4}</span>
                        </li>
                    </ol>
                </div>

                {/* Safety Tips */}
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl space-y-2">
                    <h4 className="font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4" />
                        {t.safetyTips}
                    </h4>
                    <ul className="space-y-1.5 text-sm text-amber-700 dark:text-amber-400">
                        <li>• {t.tip1}</li>
                        <li>• {t.tip2}</li>
                        <li>• {t.tip3}</li>
                        <li>• {t.tip4}</li>
                    </ul>
                </div>

                {/* Disclaimer */}
                <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
                    {t.disclaimer}
                </p>

                {/* Safety Page Link */}
                <Link
                    href="/safety"
                    className="text-sm text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
                >
                    {t.moreInfo}
                    <ExternalLink className="w-3 h-3" />
                </Link>
            </div>
        </motion.div>
    )
}

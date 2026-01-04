'use client'

/**
 * ============================================
 * Marketplace Buy Card
 * ============================================
 * 
 * Shows Buy Now button when in Marketplace mode
 * Hidden in Classified mode (shows ClassifiedContactCard instead)
 */

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
    ShoppingCart,
    ShieldCheck,
    Truck,
    CreditCard,
    MessageCircle,
    Heart,
    Share2,
    Clock,
    CheckCircle
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { usePlatform } from '@/contexts/PlatformContext'

// ============================================
// TYPES
// ============================================

interface MarketplaceBuyCardProps {
    listingId: string
    sellerId: string
    sellerName: string
    price: number
    originalPrice?: number
    stock?: number
    shippingFee?: number
    estimatedDelivery?: string
    onAddToCart?: () => void
    onBuyNow?: () => void
    onChatClick?: () => void
    className?: string
}

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
    th: {
        buyNow: 'ซื้อเลย',
        addToCart: 'เพิ่มลงตะกร้า',
        chat: 'แชทกับผู้ขาย',
        price: 'ราคา',
        shipping: 'ค่าส่ง',
        freeShipping: 'ส่งฟรี!',
        estimatedDelivery: 'จัดส่งภายใน',
        inStock: 'มีสินค้า',
        lowStock: 'เหลือน้อย',
        outOfStock: 'สินค้าหมด',
        buyerProtection: 'คุ้มครองผู้ซื้อ',
        protectionDesc: 'รับเงินคืนหากไม่ได้รับสินค้า',
        securePayment: 'ชำระเงินปลอดภัย',
        paymentMethods: 'รองรับ PromptPay, บัตรเครดิต',
        added: 'เพิ่มแล้ว!',
    },
    en: {
        buyNow: 'Buy Now',
        addToCart: 'Add to Cart',
        chat: 'Chat with Seller',
        price: 'Price',
        shipping: 'Shipping',
        freeShipping: 'Free Shipping!',
        estimatedDelivery: 'Delivery within',
        inStock: 'In Stock',
        lowStock: 'Low Stock',
        outOfStock: 'Out of Stock',
        buyerProtection: 'Buyer Protection',
        protectionDesc: 'Get refund if item not received',
        securePayment: 'Secure Payment',
        paymentMethods: 'PromptPay, Credit Card accepted',
        added: 'Added!',
    }
}

// ============================================
// COMPONENT
// ============================================

export default function MarketplaceBuyCard({
    listingId,
    sellerId,
    sellerName,
    price,
    originalPrice,
    stock = 1,
    shippingFee = 0,
    estimatedDelivery,
    onAddToCart,
    onBuyNow,
    onChatClick,
    className = ''
}: MarketplaceBuyCardProps) {
    const router = useRouter()
    const { language } = useLanguage()
    const { isMarketplace, hasPayment } = usePlatform()
    const t = translations[language as 'th' | 'en'] || translations.th

    const [addedToCart, setAddedToCart] = useState(false)

    // Only show in Marketplace mode
    if (!isMarketplace) return null

    const handleAddToCart = () => {
        if (onAddToCart) {
            onAddToCart()
        }
        setAddedToCart(true)
        setTimeout(() => setAddedToCart(false), 2000)
    }

    const handleBuyNow = () => {
        if (onBuyNow) {
            onBuyNow()
        } else if (hasPayment) {
            router.push(`/checkout?listing=${listingId}`)
        }
    }

    const getStockStatus = () => {
        if (stock === 0) return { text: t.outOfStock, color: 'text-red-500', canBuy: false }
        if (stock <= 3) return { text: `${t.lowStock} (${stock})`, color: 'text-orange-500', canBuy: true }
        return { text: t.inStock, color: 'text-green-500', canBuy: true }
    }

    const stockStatus = getStockStatus()
    const discount = originalPrice ? Math.round((1 - price / originalPrice) * 100) : 0
    const totalPrice = price + shippingFee

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-lg overflow-hidden ${className}`}
        >
            <div className="p-5 space-y-4">
                {/* Price */}
                <div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            ฿{price.toLocaleString()}
                        </span>
                        {originalPrice && originalPrice > price && (
                            <>
                                <span className="text-lg text-gray-400 line-through">
                                    ฿{originalPrice.toLocaleString()}
                                </span>
                                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-bold rounded">
                                    -{discount}%
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Shipping */}
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                        <Truck className="w-4 h-4 text-blue-500" />
                        <span>{t.shipping}</span>
                    </div>
                    {shippingFee === 0 ? (
                        <span className="text-green-600 font-medium">{t.freeShipping}</span>
                    ) : (
                        <span>฿{shippingFee.toLocaleString()}</span>
                    )}
                </div>

                {/* Estimated Delivery */}
                {estimatedDelivery && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <Clock className="w-4 h-4 text-orange-500" />
                        <span>{t.estimatedDelivery} {estimatedDelivery}</span>
                    </div>
                )}

                {/* Stock Status */}
                <div className={`flex items-center gap-2 text-sm ${stockStatus.color}`}>
                    <CheckCircle className="w-4 h-4" />
                    <span>{stockStatus.text}</span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-2">
                    {/* Buy Now */}
                    <button
                        onClick={handleBuyNow}
                        disabled={!stockStatus.canBuy}
                        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                        {t.buyNow}
                    </button>

                    {/* Add to Cart */}
                    <button
                        onClick={handleAddToCart}
                        disabled={!stockStatus.canBuy}
                        className="w-full py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-xl font-bold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {addedToCart ? (
                            <>
                                <CheckCircle className="w-5 h-5" />
                                {t.added}
                            </>
                        ) : (
                            <>
                                <ShoppingCart className="w-5 h-5" />
                                {t.addToCart}
                            </>
                        )}
                    </button>

                    {/* Chat */}
                    <button
                        onClick={onChatClick}
                        className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <MessageCircle className="w-5 h-5" />
                        {t.chat}
                    </button>
                </div>

                {/* Trust Badges */}
                <div className="pt-4 space-y-3 border-t border-gray-100 dark:border-gray-700">
                    {/* Buyer Protection */}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                            <ShieldCheck className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{t.buyerProtection}</p>
                            <p className="text-xs text-gray-500">{t.protectionDesc}</p>
                        </div>
                    </div>

                    {/* Secure Payment */}
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                            <CreditCard className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-900 dark:text-white text-sm">{t.securePayment}</p>
                            <p className="text-xs text-gray-500">{t.paymentMethods}</p>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

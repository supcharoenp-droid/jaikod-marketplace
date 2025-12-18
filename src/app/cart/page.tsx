'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Plus, Minus, Tag, Zap, ArrowRight, ArrowLeft } from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/contexts/LanguageContext'
import Button from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

export default function CartPage() {
    const { cart, loading, updateQuantity, removeItem, applyCoupon } = useCart()
    const { t, language } = useLanguage()
    const router = useRouter()
    const [couponInput, setCouponInput] = useState('')
    const [couponError, setCouponError] = useState('')

    // Mock AI Suggestion
    const showAiSuggestion = !cart?.couponCode && cart?.subtotal && cart.subtotal > 500

    const handleApplyCoupon = async () => {
        if (!couponInput.trim()) return
        const success = await applyCoupon(couponInput)
        if (!success) {
            setCouponError('Invalid coupon')
        } else {
            setCouponError('')
            setCouponInput('')
        }
    }

    if (loading && !cart) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
                <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col items-center justify-center p-4">
                <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                    <Zap className="w-12 h-12 text-gray-400" />
                </div>
                <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">{t('cart.empty')}</h1>
                <p className="text-gray-500 mb-8 max-w-md text-center">
                    Looks like you haven't added anything to your cart yet. Go ahead and explore our products!
                </p>
                <Link href="/search">
                    <Button variant="primary" className="px-8 py-3 rounded-xl font-bold">
                        {t('cart.continue_shopping')}
                    </Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans pb-24">

            {/* Header */}
            <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
                            <ArrowLeft className="w-5 h-5 dark:text-white" />
                        </button>
                        <h1 className="text-xl font-bold dark:text-white">{t('cart.title')} ({cart.items.length})</h1>
                    </div>
                </div>
            </header>

            <div className="container mx-auto px-4 py-6 md:py-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Cart Items List */}
                    <div className="flex-1 space-y-4">
                        <AnimatePresence initial={false}>
                            {cart.items.map((item) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-white dark:bg-gray-900 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 flex gap-4 relative overflow-hidden group"
                                >
                                    {/* Image */}
                                    <div className="w-24 h-24 bg-gray-100 rounded-xl relative flex-shrink-0 overflow-hidden">
                                        <Image
                                            src={item.product.thumbnail_url}
                                            alt={item.product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-start gap-2">
                                                <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 md:text-lg">
                                                    {item.product.title}
                                                </h3>
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                            {(item.product.seller as any)?.shop_name && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Sold by: {(item.product.seller as any).shop_name}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between mt-4">
                                            <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 rounded-lg p-1">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-700 rounded shadow-sm disabled:opacity-50"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus className="w-4 h-4" />
                                                </button>
                                                <span className="font-bold w-6 text-center dark:text-white">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    className="w-7 h-7 flex items-center justify-center bg-white dark:bg-gray-700 rounded shadow-sm"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-bold text-lg text-purple-600">
                                                    ฿{(item.product.price * item.quantity).toLocaleString()}
                                                </div>
                                                {item.quantity > 1 && (
                                                    <div className="text-xs text-gray-400">
                                                        ฿{item.product.price.toLocaleString()} / item
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="lg:w-[380px] space-y-6">
                        {/* Coupon Section */}
                        <div className="bg-white dark:bg-gray-900 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h3 className="font-bold mb-3 flex items-center gap-2 dark:text-white">
                                <Tag className="w-5 h-5 text-purple-500" />
                                {t('cart.coupon')}
                            </h3>

                            {/* AI Suggestion Bubble */}
                            {showAiSuggestion && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/10 dark:to-orange-900/10 border border-yellow-100 dark:border-yellow-900/30 p-3 rounded-xl mb-4 flex items-start gap-3"
                                >
                                    <div className="p-1.5 bg-yellow-100 dark:bg-yellow-900/30 rounded-full text-yellow-600">
                                        <Zap className="w-4 h-4" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-yellow-800 dark:text-yellow-500">
                                            {t('cart.ai_coupon_suggestion').replace('{{code}}', '')}
                                        </div>
                                        <button
                                            onClick={() => applyCoupon('JAIKOD10')}
                                            className="text-xs font-bold text-purple-600 underline mt-1"
                                        >
                                            Use "JAIKOD10" for 10% off
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Enter code"
                                    value={couponInput}
                                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                                    className="flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                                />
                                <Button
                                    onClick={handleApplyCoupon}
                                    className="px-6 rounded-xl font-bold"
                                    disabled={!couponInput}
                                >
                                    {t('cart.apply')}
                                </Button>
                            </div>
                            {couponError && <p className="text-red-500 text-xs mt-2">{couponError}</p>}
                            {cart.couponCode && (
                                <div className="mt-3 flex items-center justify-between bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg border border-green-100 dark:border-green-800">
                                    <span className="text-sm text-green-700 dark:text-green-400 font-medium">Applied: <b>{cart.couponCode}</b></span>
                                    <button onClick={() => applyCoupon('')} className="text-gray-400 hover:text-red-500">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Summary Details */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                            <h3 className="text-lg font-bold mb-4 dark:text-white">{t('checkout.order_summary')}</h3>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>{t('cart.subtotal')}</span>
                                    <span>฿{cart.subtotal.toLocaleString()}</span>
                                </div>
                                {cart.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-฿{cart.discount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                    <span>{t('cart.shipping')}</span>
                                    <span className="text-xs text-gray-400">Calc at checkout</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 mb-6">
                                <div className="flex justify-between items-end">
                                    <span className="font-bold text-gray-900 dark:text-white text-lg">{t('cart.total')}</span>
                                    <span className="font-black text-3xl text-purple-600">฿{cart.total.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button
                                onClick={() => router.push('/checkout')}
                                className="w-full h-14 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl shadow-lg shadow-purple-500/25 text-lg font-bold flex items-center justify-center gap-2 group"
                            >
                                {t('cart.checkout')}
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

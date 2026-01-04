'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Check, MapPin, Truck, CreditCard, ChevronRight,
    ShieldCheck, Zap, AlertCircle, ArrowLeft, PenLine
} from 'lucide-react'
import { useCart } from '@/hooks/useCart'
import { useLanguage } from '@/contexts/LanguageContext'
import Button from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
import { createOrdersFromCart } from '@/lib/orders'
import { Address } from '@/types'

// --- Mock Data ---
const MOCK_ADDRESSES = [
    { id: 'addr_1', name: 'Home', full: '123 Sukhumvit Soi 55, Watthana, Bangkok 10110', phone: '081-234-5678', isDefault: true },
    { id: 'addr_2', name: 'Office', full: '888 Rama 9 Road, Huai Khwang, Bangkok 10310', phone: '02-999-9999', isDefault: false }
]

const SHIPPING_OPTIONS = [
    { id: 'std', name: 'Standard Delivery', price: 45, eta: '3-5 Days', courier: 'Flash Express' },
    { id: 'exp', name: 'Express Delivery', price: 80, eta: '1-2 Days', courier: 'Kerry Express', isAiRecommended: true },
    { id: 'same', name: 'Same Day Delivery', price: 150, eta: 'Today', courier: 'GrabExpress' }
]

const PAYMENT_METHODS = [
    { id: 'qr', name: 'PromptPay QR', icon: <Zap className="w-5 h-5 text-blue-500" /> },
    { id: 'cc', name: 'Credit/Debit Card', icon: <CreditCard className="w-5 h-5 text-purple-500" /> },
    { id: 'cod', name: 'Cash on Delivery', icon: <Truck className="w-5 h-5 text-green-500" /> }
]

export default function CheckoutPage() {
    const { user } = useAuth()
    const { cart, clearCart } = useCart()
    const { t, language } = useLanguage()
    const router = useRouter()

    const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
    const [selectedAddress, setSelectedAddress] = useState(MOCK_ADDRESSES[0].id)
    const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[1].id) // Default to AI Rec
    const [selectedPayment, setSelectedPayment] = useState('qr')
    const [isProcessing, setIsProcessing] = useState(false)
    const [createdOrderIds, setCreatedOrderIds] = useState<string[]>([])

    // Redirect if cart empty
    if (!cart?.items.length && step !== 4) {
        // Just fail safe, usually handled by loading state or redirect
    }

    const currentShippingPrice = SHIPPING_OPTIONS.find(s => s.id === selectedShipping)?.price || 0
    const finalTotal = (cart?.total || 0) + currentShippingPrice

    const handleNext = () => setStep(prev => Math.min(prev + 1, 4) as any)
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1) as any)

    const handlePlaceOrder = async () => {
        if (!user || !cart || cart.items.length === 0) return

        setIsProcessing(true)
        try {
            // Find selected address obj (In real app, fetch from user profile)
            const addrObj = MOCK_ADDRESSES.find(a => a.id === selectedAddress)
            const shippingAddress: Address = {
                name: addrObj?.name || 'Home',
                address_line1: addrObj?.full || '',
                province: 'Bangkok', // Mock parsing
                district: 'Watthana',
                subdistrict: 'Khlong Tan',
                postal_code: '10110',
                phone: addrObj?.phone || ''
            }

            const orderIds = await createOrdersFromCart({
                buyer_id: user.uid,
                items: cart.items,
                shipping_address: shippingAddress,
                payment_method: selectedPayment,
                shipping_method: selectedShipping,
                shipping_fee: currentShippingPrice,
                discount: cart.discount || 0,
                total: finalTotal
            })

            setCreatedOrderIds(orderIds)
            clearCart()
            setStep(4) // Success step
        } catch (error) {
            console.error("Failed to place order", error)
            alert("Failed to place order. Please try again.")
        } finally {
            setIsProcessing(false)
        }
    }

    // --- Render Steps ---

    const renderAddressStep = () => (
        <div className="space-y-4">
            <h2 className="text-lg font-bold mb-4 dark:text-white">{t('checkout.select_address')}</h2>
            <div className="space-y-3">
                {MOCK_ADDRESSES.map(addr => (
                    <div
                        key={addr.id}
                        onClick={() => setSelectedAddress(addr.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedAddress === addr.id
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-200'
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <div className="flex gap-3">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${selectedAddress === addr.id ? 'border-purple-600' : 'border-gray-300'}`}>
                                    {selectedAddress === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-gray-900 dark:text-white">{addr.name}</span>
                                        {addr.isDefault && <span className="text-[10px] bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded text-gray-600 dark:text-gray-300">Default</span>}
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{addr.full}</p>
                                    <p className="text-sm text-gray-500">{addr.phone}</p>
                                </div>
                            </div>
                            <button className="text-gray-400 hover:text-purple-600">
                                <PenLine className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <Button variant="outline" className="w-full mt-2 border-dashed border-gray-300 text-gray-500 hover:text-purple-600 hover:border-purple-300">
                + {t('checkout.add_address')}
            </Button>
        </div>
    )

    const renderShippingStep = () => (
        <div className="space-y-4">
            <h2 className="text-lg font-bold mb-4 dark:text-white">{t('checkout.shipping_method')}</h2>

            {/* AI Recommendation Banner */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 p-3 rounded-lg flex items-center gap-3 border border-blue-100 dark:border-blue-900/30 mb-4">
                <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600">
                    <Zap className="w-4 h-4" />
                </div>
                <div className="text-sm text-blue-800 dark:text-blue-300">
                    <strong>AI Recommend:</strong> Kerry Express balances speed & price best for your location.
                </div>
            </div>

            <div className="space-y-3">
                {SHIPPING_OPTIONS.map(opt => (
                    <div
                        key={opt.id}
                        onClick={() => setSelectedShipping(opt.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden ${selectedShipping === opt.id
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-200'
                            }`}
                    >
                        {opt.isAiRecommended && (
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-[10px] px-2 py-1 rounded-bl-lg font-bold">
                                AI Recommended
                            </div>
                        )}
                        <div className="flex justify-between items-center">
                            <div className="flex gap-3 items-center">
                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedShipping === opt.id ? 'border-purple-600' : 'border-gray-300'}`}>
                                    {selectedShipping === opt.id && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                                </div>
                                <div>
                                    <div className="font-bold text-gray-900 dark:text-white">{opt.courier}</div>
                                    <div className="text-sm text-gray-500">{opt.name} • {opt.eta}</div>
                                </div>
                            </div>
                            <div className="font-bold text-purple-600">฿{opt.price}</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )

    const renderPaymentStep = () => (
        <div className="space-y-4">
            <h2 className="text-lg font-bold mb-4 dark:text-white">{t('checkout.payment_method')}</h2>
            <div className="space-y-3">
                {PAYMENT_METHODS.map(m => (
                    <div
                        key={m.id}
                        onClick={() => setSelectedPayment(m.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedPayment === m.id
                            ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-200'
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === m.id ? 'border-purple-600' : 'border-gray-300'}`}>
                                {selectedPayment === m.id && <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />}
                            </div>
                            <div className="flex items-center gap-2">
                                {m.icon}
                                <span className="font-bold text-gray-900 dark:text-white">{t(`checkout.${m.id}`) || m.name}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 bg-gray-50 dark:bg-gray-800 p-4 rounded-xl text-xs text-gray-500 flex gap-2">
                <ShieldCheck className="w-8 h-8 text-green-500 flex-shrink-0" />
                <p>
                    Your payment is secure. We use 256-bit SSL encryption.
                    Your card details are never stored on our servers.
                </p>
            </div>
        </div>
    )

    const renderSuccessStep = () => (
        <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
                <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold mb-2 dark:text-white">{t('checkout.thank_you')}</h1>
            <p className="text-gray-500 mb-6">{t('checkout.order_confirmed')}</p>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-6 rounded-2xl shadow-sm w-full max-w-sm mb-8 text-left">
                <div className="flex justify-between mb-4">
                    <span className="text-gray-500">{t('checkout.order_id')}</span>
                    <span className="text-gray-500">{t('checkout.order_id')}</span>
                    <div className="flex flex-col text-right">
                        {createdOrderIds.map(id => (
                            <span key={id} className="font-mono font-bold text-sm">#{id.substring(0, 8).toUpperCase()}</span>
                        ))}
                    </div>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Total Paid</span>
                        <span className="text-xl font-black text-purple-600">฿{finalTotal.toLocaleString()}</span>
                    </div>
                </div>
            </div>

            <Link href="/">
                <Button className="px-8 py-3 rounded-xl font-bold">
                    {t('checkout.back_home')}
                </Button>
            </Link>
        </div>
    )

    return (
        <div className="min-h-screen bg-[#F8F9FB] dark:bg-black font-sans pb-24">
            {/* Simple Header */}
            <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <ArrowLeft className="w-5 h-5 dark:text-white" />
                    </button>
                    <h1 className="text-xl font-bold dark:text-white">{t('checkout.title')}</h1>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">

                {step < 4 && (
                    <div className="flex flex-col lg:flex-row gap-8 max-w-5xl mx-auto">

                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Stepper */}
                            <div className="flex items-center mb-8 px-2">
                                {[1, 2, 3].map((s) => (
                                    <React.Fragment key={s}>
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500 dark:bg-gray-800'
                                            }`}>
                                            {s}
                                        </div>
                                        {s < 3 && (
                                            <div className={`flex-1 h-1 mx-2 rounded-full ${step > s ? 'bg-purple-600' : 'bg-gray-200 dark:bg-gray-800'
                                                }`} />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>

                            <div className="bg-white dark:bg-gray-900 p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {step === 1 && renderAddressStep()}
                                        {step === 2 && renderShippingStep()}
                                        {step === 3 && renderPaymentStep()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>

                            <div className="flex justify-between mt-6">
                                <Button
                                    variant="outline"
                                    onClick={handleBack}
                                    disabled={step === 1}
                                    className={`${step === 1 ? 'opacity-0 pointer-events-none' : ''}`}
                                >
                                    {t('common.back')}
                                </Button>
                                {step < 3 ? (
                                    <Button onClick={handleNext} className="px-8 rounded-xl font-bold">
                                        {t('common.next')}
                                    </Button>
                                ) : (
                                    <Button
                                        onClick={handlePlaceOrder}
                                        disabled={isProcessing}
                                        className="px-8 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
                                    >
                                        {isProcessing ? 'Processing...' : t('checkout.place_order')}
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Sidebar Summary */}
                        <div className="lg:w-[320px]">
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                                <h3 className="text-lg font-bold mb-4 dark:text-white">{t('checkout.order_summary')}</h3>

                                <div className="space-y-4">
                                    {cart?.items.map(item => (
                                        <div key={item.id} className="flex gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded-lg relative overflow-hidden flex-shrink-0">
                                                <Image src={item.product.thumbnail_url || '/placeholder-product.png'} alt="" fill className="object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate dark:text-white">{item.product.title}</div>
                                                <div className="text-xs text-gray-500">x{item.quantity}</div>
                                            </div>
                                            <div className="text-sm font-bold dark:text-white">฿{(item.product.price * item.quantity).toLocaleString()}</div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-800 my-4 pt-4 space-y-2">
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>{t('cart.subtotal')}</span>
                                        <span>฿{cart?.subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                        <span>{t('cart.shipping')}</span>
                                        <span>฿{currentShippingPrice}</span>
                                    </div>
                                    {(cart?.discount ?? 0) > 0 && (
                                        <div className="flex justify-between text-sm text-green-600">
                                            <span>Discount</span>
                                            <span>-฿{(cart?.discount ?? 0).toLocaleString()}</span>
                                        </div>
                                    )}
                                </div>

                                <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
                                    <div className="flex justify-between items-end">
                                        <span className="font-bold text-gray-900 dark:text-white">{t('cart.total')}</span>
                                        <span className="font-black text-2xl text-purple-600">฿{finalTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {step === 4 && renderSuccessStep()}

            </div>
        </div>
    )
}

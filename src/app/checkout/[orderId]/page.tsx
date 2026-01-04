'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
    Check, MapPin, Truck, CreditCard, ArrowLeft,
    ShieldCheck, Zap, PenLine, Loader2
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { orderService, Order } from '@/services/order/orderService'
import { updateProductStatus } from '@/lib/products'
import Button from '@/components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'

// Using same mock data style as generic checkout for consistency
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

export default function OrderCheckoutPage({ params }: { params: { orderId: string } }) {
    const { user } = useAuth()
    const router = useRouter()
    const [order, setOrder] = useState<Order | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isProcessing, setIsProcessing] = useState(false)
    const orderId = params.orderId

    // State for selections
    const [selectedAddress, setSelectedAddress] = useState(MOCK_ADDRESSES[0].id)
    const [selectedShipping, setSelectedShipping] = useState(SHIPPING_OPTIONS[1].id)
    const [selectedPayment, setSelectedPayment] = useState('qr')

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) return
            try {
                const data = await orderService.getOrder(orderId)
                setOrder(data)
            } catch (error) {
                console.error("Failed to fetch order", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchOrder()
    }, [orderId])

    if (isLoading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin text-purple-600" /></div>
    if (!order) return <div className="p-8 text-center text-red-500">Order not found</div>

    // Calculate totals based on selection
    const currentShippingPrice = SHIPPING_OPTIONS.find(s => s.id === selectedShipping)?.price || 0
    const finalTotal = order.subtotal + currentShippingPrice

    const handleConfirmPayment = async () => {
        setIsProcessing(true)
        try {
            // Update order with final details
            // In a real app, this would trigger payment gateway
            await orderService.simulateMockPayment(order.id)
            await orderService.updateStatus(order.id, 'paid')

            // Update all products to sold
            if (user?.uid) {
                await Promise.all(order.items.map(item =>
                    updateProductStatus(item.listingId, 'sold', user.uid)
                ))
            }

            alert('Payment Successful! (Mock)')
            router.push('/profile/purchases') // Should redirect to order history
        } catch (error) {
            console.error("Payment failed", error)
            alert("Payment failed")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F8F9FB] dark:bg-black font-sans pb-24">
            <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-40">
                <div className="container mx-auto px-4 h-16 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                        <ArrowLeft className="w-5 h-5 dark:text-white" />
                    </button>
                    <h1 className="text-xl font-bold dark:text-white">Checkout Order #{order.orderNumber}</h1>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Left Column: Details */}
                    <div className="flex-1 space-y-6">

                        {/* Address */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-bold mb-4 dark:text-white">Shipping Address</h2>
                            {MOCK_ADDRESSES.map(addr => (
                                <div key={addr.id} onClick={() => setSelectedAddress(addr.id)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer mb-2 transition-all ${selectedAddress === addr.id ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200'}`}>
                                    <div className="flex gap-3">
                                        <MapPin className={`w-5 h-5 ${selectedAddress === addr.id ? 'text-purple-600' : 'text-gray-400'}`} />
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white">{addr.name}</div>
                                            <div className="text-sm text-gray-500">{addr.full}</div>
                                            <div className="text-sm text-gray-500">{addr.phone}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Shipping */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-bold mb-4 dark:text-white">Delivery Method</h2>
                            {SHIPPING_OPTIONS.map(opt => (
                                <div key={opt.id} onClick={() => setSelectedShipping(opt.id)}
                                    className={`p-4 rounded-xl border-2 cursor-pointer mb-2 transition-all flex justify-between items-center ${selectedShipping === opt.id ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <Truck className={`w-5 h-5 ${selectedShipping === opt.id ? 'text-purple-600' : 'text-gray-400'}`} />
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white">{opt.courier}</div>
                                            <div className="text-sm text-gray-500">{opt.eta}</div>
                                        </div>
                                    </div>
                                    <div className="font-bold text-purple-600">฿{opt.price}</div>
                                </div>
                            ))}
                        </div>

                        {/* Payment */}
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                            <h2 className="text-lg font-bold mb-4 dark:text-white">Payment Method</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {PAYMENT_METHODS.map(m => (
                                    <div key={m.id} onClick={() => setSelectedPayment(m.id)}
                                        className={`p-4 rounded-xl border-2 cursor-pointer flex flex-col items-center justify-center gap-2 text-center h-24 ${selectedPayment === m.id ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200'}`}>
                                        {m.icon}
                                        <div className="text-sm font-bold text-gray-900 dark:text-white">{m.name}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:w-[360px]">
                        <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 sticky top-24">
                            <h3 className="text-lg font-bold mb-4 dark:text-white">Order Summary</h3>

                            <div className="space-y-4 mb-6">
                                {order.items.map((item, i) => (
                                    <div key={i} className="flex gap-3">
                                        <div className="w-16 h-16 bg-gray-100 rounded-lg relative overflow-hidden flex-shrink-0">
                                            {item.thumbnailUrl && <Image src={item.thumbnailUrl} alt="" fill className="object-cover" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-medium truncate dark:text-white">{item.title}</div>
                                            <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                                        </div>
                                        <div className="text-sm font-bold dark:text-white">฿{item.price.toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2">
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Subtotal</span>
                                    <span>฿{order.subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                                    <span>Shipping</span>
                                    <span>฿{currentShippingPrice}</span>
                                </div>
                                <div className="flex justify-between items-end pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <span className="font-bold text-gray-900 dark:text-white">Total</span>
                                    <span className="font-black text-2xl text-purple-600">฿{finalTotal.toLocaleString()}</span>
                                </div>
                            </div>

                            <Button onClick={handleConfirmPayment} disabled={isProcessing} className="w-full mt-6 py-4 rounded-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/25">
                                {isProcessing ? 'Processing Payment...' : `Pay ฿${finalTotal.toLocaleString()}`}
                            </Button>

                            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
                                <ShieldCheck className="w-4 h-4" /> Secure Payment
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

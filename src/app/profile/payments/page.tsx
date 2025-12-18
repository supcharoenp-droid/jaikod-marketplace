'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CreditCard,
    Plus,
    Trash2,
    Star,
    Shield,
    Sparkles,
    AlertCircle
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import useProfile from '@/hooks/useProfile'
import ProfileLayout from '@/components/profile/v2/ProfileLayout'

interface PaymentMethod {
    id: string
    type: 'credit_card' | 'debit_card' | 'promptpay'
    label: string
    last4: string
    provider: string
    expiryMonth?: number
    expiryYear?: number
    isDefault: boolean
}

export default function PaymentsPage() {
    const { t, language } = useLanguage()
    const { user } = useProfile()

    const [payments, setPayments] = useState<PaymentMethod[]>([
        {
            id: '1',
            type: 'credit_card',
            label: 'Visa',
            last4: '4242',
            provider: 'Visa',
            expiryMonth: 12,
            expiryYear: 2025,
            isDefault: true
        }
    ])

    const handleSetDefault = (id: string) => {
        setPayments(payments.map(payment => ({
            ...payment,
            isDefault: payment.id === id
        })))
    }

    const handleDelete = (id: string) => {
        const payment = payments.find(p => p.id === id)
        if (payment?.isDefault && payments.length > 1) {
            alert(language === 'th'
                ? 'กรุณาตั้งค่าวิธีชำระเงินอื่นเป็นค่าเริ่มต้นก่อนลบ'
                : 'Please set another payment method as default before deleting'
            )
            return
        }

        if (confirm(language === 'th' ? 'ต้องการลบวิธีชำระเงินนี้?' : 'Delete this payment method?')) {
            setPayments(payments.filter(p => p.id !== id))
        }
    }

    const getCardIcon = (provider: string) => {
        // Return appropriate card icon based on provider
        return <CreditCard className="w-8 h-8" />
    }

    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            {language === 'th' ? 'วิธีชำระเงิน' : 'Payment Methods'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {language === 'th' ? 'จัดการวิธีชำระเงินของคุณ' : 'Manage your payment methods'}
                        </p>
                    </div>
                    <button
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">{language === 'th' ? 'เพิ่มบัตร' : 'Add Card'}</span>
                    </button>
                </div>

                {/* Security Notice */}
                <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                    <Shield className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-1">
                            {language === 'th' ? 'ปลอดภัย 100%' : '100% Secure'}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                            {language === 'th'
                                ? 'ข้อมูลบัตรของคุณถูกเข้ารหัสและจัดเก็บอย่างปลอดภัย'
                                : 'Your card information is encrypted and stored securely'
                            }
                        </p>
                    </div>
                </div>

                {/* AI Suggestion */}
                <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                    <Sparkles className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-1">
                            {language === 'th' ? 'AI แนะนำ' : 'AI Suggestion'}
                        </p>
                        <p className="text-sm text-purple-600 dark:text-purple-400">
                            {language === 'th'
                                ? 'เพิ่มวิธีชำระเงินเพื่อชำระเงินได้เร็วขึ้น'
                                : 'Add a payment method to checkout faster'
                            }
                        </p>
                    </div>
                </div>

                {/* Payment Methods List */}
                {payments.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 text-center"
                    >
                        <CreditCard className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {language === 'th' ? 'ยังไม่มีวิธีชำระเงิน' : 'No payment methods'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {language === 'th' ? 'เพิ่มบัตรเพื่อชำระเงินได้ง่ายขึ้น' : 'Add a card to make payments easier'}
                        </p>
                        <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all">
                            {language === 'th' ? 'เพิ่มบัตรแรก' : 'Add First Card'}
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid gap-4">
                        <AnimatePresence mode="popLayout">
                            {payments.map((payment) => (
                                <motion.div
                                    key={payment.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`
                                        bg-gradient-to-br from-gray-900 to-gray-800 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border-2 transition-all relative overflow-hidden
                                        ${payment.isDefault
                                            ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                                            : 'border-gray-700 hover:border-purple-400'
                                        }
                                    `}
                                >
                                    {/* Card Background Pattern */}
                                    <div className="absolute inset-0 opacity-10">
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"></div>
                                    </div>

                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-6">
                                            <div className="text-white">
                                                {getCardIcon(payment.provider)}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {payment.isDefault && (
                                                    <span className="flex items-center gap-1 px-2 py-1 bg-purple-500/20 text-purple-300 text-xs font-medium rounded-full">
                                                        <Star className="w-3 h-3 fill-current" />
                                                        {language === 'th' ? 'ค่าเริ่มต้น' : 'Default'}
                                                    </span>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(payment.id)}
                                                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <div className="text-2xl font-mono text-white tracking-wider mb-2">
                                                •••• •••• •••• {payment.last4}
                                            </div>
                                            <div className="text-sm text-gray-400">
                                                {payment.label}
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {payment.expiryMonth && payment.expiryYear && (
                                                <div className="text-sm text-gray-400">
                                                    {language === 'th' ? 'หมดอายุ' : 'Expires'}: {payment.expiryMonth.toString().padStart(2, '0')}/{payment.expiryYear}
                                                </div>
                                            )}
                                            <div className="text-white font-bold">
                                                {payment.provider}
                                            </div>
                                        </div>

                                        {!payment.isDefault && (
                                            <button
                                                onClick={() => handleSetDefault(payment.id)}
                                                className="w-full mt-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium text-sm"
                                            >
                                                {language === 'th' ? 'ตั้งเป็นค่าเริ่มต้น' : 'Set as Default'}
                                            </button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </ProfileLayout>
    )
}

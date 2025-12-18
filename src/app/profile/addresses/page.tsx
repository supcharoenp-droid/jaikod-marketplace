'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MapPin,
    Plus,
    Edit,
    Trash2,
    Star,
    Phone,
    User,
    Home,
    Building,
    Sparkles,
    Check
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import useProfile from '@/hooks/useProfile'
import ProfileLayout from '@/components/profile/v2/ProfileLayout'

interface Address {
    id: string
    label: string
    fullName: string
    phone: string
    line1: string
    line2?: string
    city: string
    province: string
    postalCode: string
    country: string
    isDefault: boolean
}

export default function AddressesPage() {
    const { t, language } = useLanguage()
    const { user } = useProfile()

    const [addresses, setAddresses] = useState<Address[]>([
        {
            id: '1',
            label: 'Home',
            fullName: 'John Doe',
            phone: '0812345678',
            line1: '123 ถนนสุขุมวิท',
            line2: 'แขวงคลองเตย',
            city: 'กรุงเทพมหานคร',
            province: 'กรุงเทพมหานคร',
            postalCode: '10110',
            country: 'Thailand',
            isDefault: true
        }
    ])

    const [showAddModal, setShowAddModal] = useState(false)
    const [editingAddress, setEditingAddress] = useState<Address | null>(null)

    const handleSetDefault = (id: string) => {
        setAddresses(addresses.map(addr => ({
            ...addr,
            isDefault: addr.id === id
        })))
    }

    const handleDelete = (id: string) => {
        if (confirm(language === 'th' ? 'ต้องการลบที่อยู่นี้?' : 'Delete this address?')) {
            setAddresses(addresses.filter(addr => addr.id !== id))
        }
    }

    return (
        <ProfileLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                            {language === 'th' ? 'ที่อยู่จัดส่ง' : 'Delivery Addresses'}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {language === 'th' ? 'จัดการที่อยู่สำหรับจัดส่งสินค้า' : 'Manage your delivery addresses'}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="hidden sm:inline">{language === 'th' ? 'เพิ่มที่อยู่' : 'Add Address'}</span>
                    </button>
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
                                ? 'เพิ่มเบอร์ห้อง/อาคาร เพื่อให้คนส่งของหาง่ายขึ้น'
                                : 'Add apartment/unit number for faster delivery'
                            }
                        </p>
                    </div>
                </div>

                {/* Addresses List */}
                {addresses.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl p-12 border border-gray-200 dark:border-gray-700 text-center"
                    >
                        <MapPin className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {language === 'th' ? 'ยังไม่มีที่อยู่' : 'No addresses yet'}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {language === 'th' ? 'เพิ่มที่อยู่เพื่อรับสินค้า' : 'Add an address to receive your orders'}
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all"
                        >
                            {language === 'th' ? 'เพิ่มที่อยู่แรก' : 'Add First Address'}
                        </button>
                    </motion.div>
                ) : (
                    <div className="grid gap-4">
                        <AnimatePresence mode="popLayout">
                            {addresses.map((address) => (
                                <motion.div
                                    key={address.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className={`
                                        bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 transition-all
                                        ${address.isDefault
                                            ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                        }
                                    `}
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                                {address.label === 'Home' ? (
                                                    <Home className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                                ) : (
                                                    <Building className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                                        {address.label}
                                                    </h3>
                                                    {address.isDefault && (
                                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-medium rounded-full">
                                                            <Star className="w-3 h-3 fill-current" />
                                                            {language === 'th' ? 'ค่าเริ่มต้น' : 'Default'}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    {address.fullName}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => setEditingAddress(address)}
                                                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(address.id)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                                            <span>
                                                {address.line1}
                                                {address.line2 && `, ${address.line2}`}
                                                <br />
                                                {address.city}, {address.province} {address.postalCode}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                            <Phone className="w-4 h-4" />
                                            <span>{address.phone}</span>
                                        </div>
                                    </div>

                                    {!address.isDefault && (
                                        <button
                                            onClick={() => handleSetDefault(address.id)}
                                            className="w-full py-2 border border-purple-500 text-purple-600 dark:text-purple-400 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors font-medium text-sm"
                                        >
                                            {language === 'th' ? 'ตั้งเป็นค่าเริ่มต้น' : 'Set as Default'}
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </ProfileLayout>
    )
}

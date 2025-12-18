'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import {
    User, Store, Shield, ShoppingCart, Package,
    Zap, Crown, Sparkles, LogIn, AlertCircle
} from 'lucide-react'
import { motion } from 'framer-motion'

interface DevAccount {
    id: string
    name: string
    email: string
    password: string
    role: string
    level: string
    description: string
    icon: any
    color: string
    bgColor: string
}

const DEV_ACCOUNTS: DevAccount[] = [
    {
        id: 'admin',
        name: 'Super Admin',
        email: 'admin@jaikod.com',
        password: 'admin123',
        role: 'Admin',
        level: 'Super Admin',
        description: 'Full system access, manage everything',
        icon: Shield,
        color: 'text-red-600',
        bgColor: 'bg-red-50 hover:bg-red-100 border-red-200'
    },
    {
        id: 'seller_pro',
        name: 'Pro Seller (Level 5)',
        email: 'proseller@jaikod.com',
        password: 'seller123',
        role: 'Seller',
        level: 'Level 5',
        description: 'Top seller with all features unlocked',
        icon: Crown,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-200'
    },
    {
        id: 'seller_new',
        name: 'New Seller (Level 1)',
        email: 'newseller@jaikod.com',
        password: 'seller123',
        role: 'Seller',
        level: 'Level 1',
        description: 'New seller, limited features',
        icon: Store,
        color: 'text-blue-600',
        bgColor: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
        id: 'buyer_active',
        name: 'Active Buyer',
        email: 'buyer@jaikod.com',
        password: 'buyer123',
        role: 'Buyer',
        level: 'Active',
        description: 'Regular buyer with purchase history',
        icon: ShoppingCart,
        color: 'text-green-600',
        bgColor: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
        id: 'buyer_new',
        name: 'New User',
        email: 'newuser@jaikod.com',
        password: 'user123',
        role: 'Buyer',
        level: 'New',
        description: 'First time user, no history',
        icon: User,
        color: 'text-gray-600',
        bgColor: 'bg-gray-50 hover:bg-gray-100 border-gray-200'
    },
    {
        id: 'hybrid',
        name: 'Hybrid User',
        email: 'hybrid@jaikod.com',
        password: 'hybrid123',
        role: 'Buyer + Seller',
        level: 'Level 3',
        description: 'Both buyer and seller',
        icon: Package,
        color: 'text-purple-600',
        bgColor: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    }
]

export default function DevLoginPage() {
    const router = useRouter()
    const { signIn } = useAuth()
    const [loading, setLoading] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const handleQuickLogin = async (account: DevAccount) => {
        setLoading(account.id)
        setError(null)

        try {
            await signIn(account.email, account.password)

            // Redirect based on role
            if (account.role === 'Admin') {
                router.push('/admin')
            } else if (account.role.includes('Seller')) {
                router.push('/seller')
            } else {
                router.push('/')
            }
        } catch (err: any) {
            console.error('Login error:', err)
            setError(`Failed to login as ${account.name}. Account may not exist.`)
        } finally {
            setLoading(null)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium mb-4">
                        <Zap className="w-4 h-4" />
                        Developer Mode
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                        Quick Login
                    </h1>
                    <p className="text-gray-600">
                        เลือก account สำหรับทดสอบระบบ
                    </p>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-red-800">{error}</p>
                            <p className="text-xs text-red-600 mt-1">
                                คุณอาจจะต้องสร้าง account ใน Firebase Authentication ก่อน
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Account Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {DEV_ACCOUNTS.map((account, index) => {
                        const Icon = account.icon
                        const isLoading = loading === account.id

                        return (
                            <motion.button
                                key={account.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => handleQuickLogin(account)}
                                disabled={loading !== null}
                                className={`
                                    relative p-6 rounded-2xl border-2 transition-all text-left
                                    ${account.bgColor}
                                    ${loading !== null && loading !== account.id ? 'opacity-50' : ''}
                                    ${isLoading ? 'scale-95' : 'hover:scale-[1.02]'}
                                    disabled:cursor-not-allowed
                                `}
                            >
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center mb-4 ${account.color}`}>
                                    <Icon className="w-6 h-6" />
                                </div>

                                {/* Info */}
                                <div className="mb-3">
                                    <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                                        {account.name}
                                        <span className={`text-xs px-2 py-0.5 rounded-full bg-white ${account.color}`}>
                                            {account.level}
                                        </span>
                                    </h3>
                                    <p className="text-sm text-gray-600 mb-2">
                                        {account.description}
                                    </p>
                                </div>

                                {/* Credentials */}
                                <div className="space-y-1 text-xs font-mono bg-white/50 rounded-lg p-3 mb-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Email:</span>
                                        <span className="text-gray-700">{account.email}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Password:</span>
                                        <span className="text-gray-700">{account.password}</span>
                                    </div>
                                </div>

                                {/* Login Button */}
                                <div className={`
                                    flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium text-sm transition-colors
                                    ${isLoading
                                        ? 'bg-gray-200 text-gray-500'
                                        : `bg-white ${account.color} shadow-sm`
                                    }
                                `}>
                                    {isLoading ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                                            Logging in...
                                        </>
                                    ) : (
                                        <>
                                            <LogIn className="w-4 h-4" />
                                            Quick Login
                                        </>
                                    )}
                                </div>
                            </motion.button>
                        )
                    })}
                </div>

                {/* Instructions */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl p-6 border border-gray-200"
                >
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        วิธีใช้งาน
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600">
                        <p>1. <strong>คลิกปุ่ม Quick Login</strong> เพื่อ login ทันที</p>
                        <p>2. <strong>ระบบจะ redirect</strong> ไปหน้าที่เหมาะสมตาม role</p>
                        <p>3. <strong>Admin</strong> → <code className="px-2 py-0.5 bg-gray-100 rounded">/admin</code></p>
                        <p>4. <strong>Seller</strong> → <code className="px-2 py-0.5 bg-gray-100 rounded">/seller</code></p>
                        <p>5. <strong>Buyer</strong> → <code className="px-2 py-0.5 bg-gray-100 rounded">/</code></p>
                    </div>

                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-xs text-yellow-800">
                            ⚠️ <strong>หมายเหตุ:</strong> Account เหล่านี้ต้องถูกสร้างใน Firebase Authentication ก่อน
                            <br />
                            หากยังไม่มี กรุณาสร้างผ่าน Firebase Console หรือใช้ปุ่ม Register ปกติ
                        </p>
                    </div>
                </motion.div>

                {/* Back to Normal Login */}
                <div className="text-center mt-6">
                    <button
                        onClick={() => router.push('/login')}
                        className="text-sm text-gray-600 hover:text-purple-600 transition-colors"
                    >
                        ← กลับไปหน้า Login ปกติ
                    </button>
                </div>
            </div>
        </div>
    )
}

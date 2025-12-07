'use client'

import React from 'react'

import { useState, useEffect } from 'react'
import {
    CheckCircle2,
    XCircle,
    AlertCircle,
    Loader2,
    Database,
    Cloud,
    Shield,
    Package,
    Server,
    Settings,
    RefreshCw,
    ChevronDown,
    ChevronUp
} from 'lucide-react'
import { db, auth, storage } from '@/lib/firebase'
import { collection, getDocs, limit, query } from 'firebase/firestore'
import { getDownloadURL, ref, listAll } from 'firebase/storage'

type CheckStatus = 'checking' | 'success' | 'warning' | 'error' | 'idle'

interface SystemCheck {
    id: string
    name: string
    description: string
    status: CheckStatus
    message: string
    details?: string[]
    icon: any
    category: string
}

export default function SystemCheckPage() {
    const [checks, setChecks] = useState<SystemCheck[]>([])
    const [isChecking, setIsChecking] = useState(false)
    const [expandedChecks, setExpandedChecks] = useState<Set<string>>(new Set())
    const [lastCheckTime, setLastCheckTime] = useState<Date | null>(null)

    const toggleExpand = (checkId: string) => {
        const newExpanded = new Set(expandedChecks)
        if (newExpanded.has(checkId)) {
            newExpanded.delete(checkId)
        } else {
            newExpanded.add(checkId)
        }
        setExpandedChecks(newExpanded)
    }

    const initializeChecks = (): SystemCheck[] => [
        {
            id: 'env-vars',
            name: 'Environment Variables',
            description: 'ตรวจสอบการตั้งค่า Environment Variables',
            status: 'idle',
            message: '',
            icon: Settings,
            category: 'Configuration'
        },
        {
            id: 'firebase-config',
            name: 'Firebase Configuration',
            description: 'ตรวจสอบการตั้งค่า Firebase',
            status: 'idle',
            message: '',
            icon: Cloud,
            category: 'Firebase'
        },
        {
            id: 'firestore',
            name: 'Firestore Database',
            description: 'ตรวจสอบการเชื่อมต่อ Firestore',
            status: 'idle',
            message: '',
            icon: Database,
            category: 'Firebase'
        },
        {
            id: 'auth',
            name: 'Firebase Authentication',
            description: 'ตรวจสอบระบบ Authentication',
            status: 'idle',
            message: '',
            icon: Shield,
            category: 'Firebase'
        },
        {
            id: 'storage',
            name: 'Firebase Storage',
            description: 'ตรวจสอบ Firebase Storage',
            status: 'idle',
            message: '',
            icon: Server,
            category: 'Firebase'
        },
        {
            id: 'packages',
            name: 'NPM Packages',
            description: 'ตรวจสอบ Dependencies ที่จำเป็น',
            status: 'idle',
            message: '',
            icon: Package,
            category: 'Dependencies'
        }
    ]

    const checkEnvironmentVariables = async (): Promise<Partial<SystemCheck>> => {
        const envVars = {
            'NEXT_PUBLIC_FIREBASE_API_KEY': process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
            'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN': process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
            'NEXT_PUBLIC_FIREBASE_PROJECT_ID': process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
            'NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET': process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
            'NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID': process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
            'NEXT_PUBLIC_FIREBASE_APP_ID': process.env.NEXT_PUBLIC_FIREBASE_APP_ID
        }

        const missing: string[] = []
        const present: string[] = []
        const details: string[] = []

        Object.entries(envVars).forEach(([key, value]) => {
            if (!value || value.startsWith('YOUR_')) {
                missing.push(key)
                details.push(`❌ ${key}: ไม่พบหรือยังไม่ได้ตั้งค่า`)
            } else {
                present.push(key)
                details.push(`✅ ${key}: ตั้งค่าแล้ว`)
            }
        })

        if (missing.length === 0) {
            return {
                status: 'success',
                message: `ตั้งค่าครบถ้วน (${present.length}/${Object.keys(envVars).length})`,
                details
            }
        } else if (missing.length === Object.keys(envVars).length) {
            return {
                status: 'error',
                message: 'ยังไม่ได้ตั้งค่า Environment Variables',
                details
            }
        } else {
            return {
                status: 'warning',
                message: `ตั้งค่าไม่ครบ (${present.length}/${Object.keys(envVars).length})`,
                details
            }
        }
    }

    const checkFirebaseConfig = async (): Promise<Partial<SystemCheck>> => {
        try {
            const config = {
                apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
                authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
                storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
                messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
                appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
            }

            const details: string[] = []
            let hasInvalidConfig = false

            Object.entries(config).forEach(([key, value]) => {
                if (!value || value.startsWith('YOUR_')) {
                    details.push(`❌ ${key}: ไม่ถูกต้อง`)
                    hasInvalidConfig = true
                } else {
                    details.push(`✅ ${key}: ${value.substring(0, 20)}...`)
                }
            })

            if (hasInvalidConfig) {
                return {
                    status: 'error',
                    message: 'Firebase Config ไม่ถูกต้อง',
                    details
                }
            }

            return {
                status: 'success',
                message: 'Firebase Config ถูกต้อง',
                details
            }
        } catch (error: any) {
            return {
                status: 'error',
                message: 'เกิดข้อผิดพลาดในการตรวจสอบ Config',
                details: [error.message]
            }
        }
    }

    const checkFirestore = async (): Promise<Partial<SystemCheck>> => {
        try {
            // Try to read from products collection
            const productsRef = collection(db, 'products')
            const q = query(productsRef, limit(1))
            const snapshot = await getDocs(q)

            const details: string[] = [
                `✅ เชื่อมต่อ Firestore สำเร็จ`,
                `📊 จำนวนเอกสารในคอลเลกชัน products: ${snapshot.size}`
            ]

            // Try to list collections
            const collections = ['products', 'users', 'categories']
            details.push(`📁 คอลเลกชันที่ตรวจสอบ: ${collections.join(', ')}`)

            return {
                status: 'success',
                message: 'Firestore ทำงานปกติ',
                details
            }
        } catch (error: any) {
            return {
                status: 'error',
                message: 'ไม่สามารถเชื่อมต่อ Firestore',
                details: [
                    `❌ Error: ${error.message}`,
                    `💡 ตรวจสอบ Firestore Rules และ Firebase Config`
                ]
            }
        }
    }

    const checkAuth = async (): Promise<Partial<SystemCheck>> => {
        try {
            const details: string[] = []

            if (auth) {
                details.push('✅ Firebase Auth initialized')
                details.push(`🔐 Current User: ${auth.currentUser ? auth.currentUser.email : 'ไม่มีผู้ใช้ล็อกอิน'}`)
                details.push(`🌐 Auth Domain: ${auth.config.authDomain}`)

                return {
                    status: 'success',
                    message: 'Authentication ทำงานปกติ',
                    details
                }
            } else {
                return {
                    status: 'error',
                    message: 'ไม่สามารถเริ่มต้น Authentication',
                    details: ['❌ Auth object is null']
                }
            }
        } catch (error: any) {
            return {
                status: 'error',
                message: 'เกิดข้อผิดพลาดในระบบ Authentication',
                details: [error.message]
            }
        }
    }

    const checkStorage = async (): Promise<Partial<SystemCheck>> => {
        try {
            const details: string[] = []

            if (storage) {
                details.push('✅ Firebase Storage initialized')
                details.push(`📦 Storage Bucket: ${storage.app.options.storageBucket}`)

                // Try to list files in a test directory
                try {
                    const listRef = ref(storage, 'products')
                    const result = await listAll(listRef)
                    details.push(`📁 จำนวนไฟล์ใน /products: ${result.items.length}`)
                    details.push(`📂 จำนวนโฟลเดอร์ย่อย: ${result.prefixes.length}`)
                } catch (listError: any) {
                    details.push(`⚠️ ไม่สามารถดูรายการไฟล์: ${listError.message}`)
                }

                return {
                    status: 'success',
                    message: 'Storage ทำงานปกติ',
                    details
                }
            } else {
                return {
                    status: 'error',
                    message: 'ไม่สามารถเริ่มต้น Storage',
                    details: ['❌ Storage object is null']
                }
            }
        } catch (error: any) {
            return {
                status: 'error',
                message: 'เกิดข้อผิดพลาดในระบบ Storage',
                details: [error.message]
            }
        }
    }

    const checkPackages = async (): Promise<Partial<SystemCheck>> => {
        const requiredPackages = [
            { name: 'react', check: () => typeof React !== 'undefined' },
            { name: 'next', check: () => true }, // Always available in Next.js
            { name: 'firebase', check: () => typeof db !== 'undefined' },
            {
                name: 'framer-motion', check: async () => {
                    try {
                        await import('framer-motion')
                        return true
                    } catch {
                        return false
                    }
                }
            },
            { name: 'lucide-react', check: () => typeof CheckCircle2 !== 'undefined' },
        ]

        const details: string[] = []
        let allInstalled = true

        for (const pkg of requiredPackages) {
            try {
                const isInstalled = typeof pkg.check === 'function'
                    ? await pkg.check()
                    : pkg.check

                if (isInstalled) {
                    details.push(`✅ ${pkg.name}: ติดตั้งแล้ว`)
                } else {
                    details.push(`❌ ${pkg.name}: ไม่พบ`)
                    allInstalled = false
                }
            } catch (error) {
                details.push(`❌ ${pkg.name}: ไม่พบ`)
                allInstalled = false
            }
        }

        return {
            status: allInstalled ? 'success' : 'warning',
            message: allInstalled ? 'Packages ครบถ้วน' : 'Packages ไม่ครบ',
            details
        }
    }

    const runAllChecks = async () => {
        setIsChecking(true)
        const initialChecks = initializeChecks()

        // Set all to checking state
        setChecks(initialChecks.map(check => ({ ...check, status: 'checking' as CheckStatus })))

        const checkFunctions: Record<string, () => Promise<Partial<SystemCheck>>> = {
            'env-vars': checkEnvironmentVariables,
            'firebase-config': checkFirebaseConfig,
            'firestore': checkFirestore,
            'auth': checkAuth,
            'storage': checkStorage,
            'packages': checkPackages
        }

        // Run checks sequentially
        for (const check of initialChecks) {
            const checkFn = checkFunctions[check.id]
            if (checkFn) {
                try {
                    const result = await checkFn()
                    setChecks(prev => prev.map(c =>
                        c.id === check.id
                            ? { ...c, ...result }
                            : c
                    ))
                } catch (error: any) {
                    setChecks(prev => prev.map(c =>
                        c.id === check.id
                            ? {
                                ...c,
                                status: 'error' as CheckStatus,
                                message: 'เกิดข้อผิดพลาด',
                                details: [error.message]
                            }
                            : c
                    ))
                }
            }
        }

        setIsChecking(false)
        setLastCheckTime(new Date())
    }

    useEffect(() => {
        runAllChecks()
    }, [])

    const getStatusIcon = (status: CheckStatus) => {
        switch (status) {
            case 'checking':
                return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
            case 'success':
                return <CheckCircle2 className="w-5 h-5 text-green-500" />
            case 'warning':
                return <AlertCircle className="w-5 h-5 text-yellow-500" />
            case 'error':
                return <XCircle className="w-5 h-5 text-red-500" />
            default:
                return <AlertCircle className="w-5 h-5 text-gray-400" />
        }
    }

    const getStatusColor = (status: CheckStatus) => {
        switch (status) {
            case 'checking':
                return 'border-blue-200 bg-blue-50'
            case 'success':
                return 'border-green-200 bg-green-50'
            case 'warning':
                return 'border-yellow-200 bg-yellow-50'
            case 'error':
                return 'border-red-200 bg-red-50'
            default:
                return 'border-gray-200 bg-gray-50'
        }
    }

    const getCategoryChecks = (category: string) => {
        return checks.filter(check => check.category === category)
    }

    const categories = ['Configuration', 'Firebase', 'Dependencies']

    const getOverallStatus = () => {
        if (checks.some(c => c.status === 'checking')) return 'checking'
        if (checks.some(c => c.status === 'error')) return 'error'
        if (checks.some(c => c.status === 'warning')) return 'warning'
        if (checks.every(c => c.status === 'success')) return 'success'
        return 'idle'
    }

    const overallStatus = getOverallStatus()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                System Health Check
                            </h1>
                            <p className="text-gray-600">
                                ตรวจสอบสถานะระบบและการเชื่อมต่อทั้งหมด
                            </p>
                        </div>
                        <button
                            onClick={runAllChecks}
                            disabled={isChecking}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            <RefreshCw className={`w-5 h-5 ${isChecking ? 'animate-spin' : ''}`} />
                            {isChecking ? 'กำลังตรวจสอบ...' : 'ตรวจสอบใหม่'}
                        </button>
                    </div>

                    {/* Overall Status */}
                    <div className={`p-6 rounded-xl border-2 ${getStatusColor(overallStatus)}`}>
                        <div className="flex items-center gap-4">
                            <div className="text-3xl">
                                {getStatusIcon(overallStatus)}
                            </div>
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold text-gray-800">
                                    {overallStatus === 'success' && 'ระบบทำงานปกติทั้งหมด ✨'}
                                    {overallStatus === 'warning' && 'พบปัญหาบางส่วน ⚠️'}
                                    {overallStatus === 'error' && 'พบข้อผิดพลาด ❌'}
                                    {overallStatus === 'checking' && 'กำลังตรวจสอบระบบ...'}
                                    {overallStatus === 'idle' && 'รอการตรวจสอบ'}
                                </h2>
                                {lastCheckTime && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        ตรวจสอบล่าสุด: {lastCheckTime.toLocaleString('th-TH')}
                                    </p>
                                )}
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-gray-800">
                                    {checks.filter(c => c.status === 'success').length}/{checks.length}
                                </div>
                                <div className="text-sm text-gray-600">ผ่านการตรวจสอบ</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checks by Category */}
                {categories.map(category => {
                    const categoryChecks = getCategoryChecks(category)
                    if (categoryChecks.length === 0) return null

                    return (
                        <div key={category} className="mb-8">
                            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <div className="w-1 h-8 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                                {category}
                            </h2>

                            <div className="space-y-4">
                                {categoryChecks.map(check => {
                                    const Icon = check.icon
                                    const isExpanded = expandedChecks.has(check.id)

                                    return (
                                        <div
                                            key={check.id}
                                            className={`bg-white rounded-xl border-2 ${getStatusColor(check.status)} shadow-lg hover:shadow-xl transition-all overflow-hidden`}
                                        >
                                            <div
                                                className="p-6 cursor-pointer"
                                                onClick={() => check.details && toggleExpand(check.id)}
                                            >
                                                <div className="flex items-start gap-4">
                                                    <div className="p-3 bg-white rounded-lg shadow-sm">
                                                        <Icon className="w-6 h-6 text-gray-700" />
                                                    </div>

                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            <h3 className="text-lg font-semibold text-gray-800">
                                                                {check.name}
                                                            </h3>
                                                            {getStatusIcon(check.status)}
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-2">
                                                            {check.description}
                                                        </p>
                                                        <p className={`text-sm font-medium ${check.status === 'success' ? 'text-green-700' :
                                                            check.status === 'warning' ? 'text-yellow-700' :
                                                                check.status === 'error' ? 'text-red-700' :
                                                                    'text-gray-700'
                                                            }`}>
                                                            {check.message}
                                                        </p>
                                                    </div>

                                                    {check.details && check.details.length > 0 && (
                                                        <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
                                                            {isExpanded ? (
                                                                <ChevronUp className="w-5 h-5 text-gray-600" />
                                                            ) : (
                                                                <ChevronDown className="w-5 h-5 text-gray-600" />
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Details */}
                                            {isExpanded && check.details && check.details.length > 0 && (
                                                <div className="px-6 pb-6">
                                                    <div className="bg-white rounded-lg p-4 border border-gray-200">
                                                        <h4 className="text-sm font-semibold text-gray-700 mb-3">
                                                            รายละเอียด:
                                                        </h4>
                                                        <ul className="space-y-2">
                                                            {check.details.map((detail, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="text-sm text-gray-600 font-mono bg-gray-50 px-3 py-2 rounded"
                                                                >
                                                                    {detail}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )
                })}

                {/* Help Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-xl p-8 text-white">
                    <h2 className="text-2xl font-bold mb-4">💡 ต้องการความช่วยเหลือ?</h2>
                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2">หากพบข้อผิดพลาด:</h3>
                            <ul className="space-y-1 text-sm text-blue-100">
                                <li>• ตรวจสอบไฟล์ .env.local</li>
                                <li>• ตรวจสอบ Firebase Console</li>
                                <li>• ตรวจสอบ Firestore Rules</li>
                                <li>• ลองรัน clean-rebuild.bat</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">เอกสารที่เกี่ยวข้อง:</h3>
                            <ul className="space-y-1 text-sm text-blue-100">
                                <li>• README-START.md</li>
                                <li>• วิธีการรัน.md</li>
                                <li>• Firebase Documentation</li>
                                <li>• Next.js Documentation</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

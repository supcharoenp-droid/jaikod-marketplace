'use client'

/**
 * Seller Trust Score Component
 * 
 * แสดงความน่าเชื่อถือผู้ขายแบบโปร่งใส - ซื่อสัตย์ 100%
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Shield, Star, Clock, MessageCircle, Package, AlertTriangle,
    CheckCircle, Phone, Mail, CreditCard, Building2, User
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { SellerTrustScore as SellerTrustData, analyzeSellerTrust } from '@/lib/ai-commerce'

interface SellerTrustScoreProps {
    seller: {
        id: string
        createdAt: Date
        totalSales?: number
        reviewScore?: number
        reviewCount?: number
        responseRate?: number
        responseTime?: number
        onTimeDelivery?: number
        disputeCount?: number
        verifications?: {
            phone?: boolean
            email?: boolean
            idCard?: boolean
            business?: boolean
        }
    }
    compact?: boolean
}

export default function SellerTrustScore({ seller, compact = false }: SellerTrustScoreProps) {
    const { language } = useLanguage()
    const [trustData, setTrustData] = useState<SellerTrustData | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        analyzeTrust()
    }, [seller.id])

    const analyzeTrust = async () => {
        setLoading(true)
        try {
            const result = await analyzeSellerTrust(seller)
            setTrustData(result)
        } catch (error) {
            console.error('Trust analysis error:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 mb-2" />
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-48" />
            </div>
        )
    }

    if (!trustData) return null

    // Level configurations
    const levelConfig = {
        platinum: {
            color: 'from-gray-300 to-gray-400',
            bgColor: 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600',
            borderColor: 'border-gray-300 dark:border-gray-500',
            label_th: 'ร้านแพลตตินั่ม',
            label_en: 'Platinum Seller',
            icon: '💎'
        },
        gold: {
            color: 'from-yellow-400 to-amber-500',
            bgColor: 'bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20',
            borderColor: 'border-yellow-300 dark:border-yellow-700',
            label_th: 'ร้านทอง',
            label_en: 'Gold Seller',
            icon: '🥇'
        },
        silver: {
            color: 'from-gray-400 to-slate-500',
            bgColor: 'bg-gradient-to-r from-slate-50 to-gray-100 dark:from-slate-800 dark:to-gray-800',
            borderColor: 'border-slate-300 dark:border-slate-600',
            label_th: 'ร้านเงิน',
            label_en: 'Silver Seller',
            icon: '🥈'
        },
        bronze: {
            color: 'from-orange-400 to-amber-600',
            bgColor: 'bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
            borderColor: 'border-orange-300 dark:border-orange-700',
            label_th: 'ร้านทองแดง',
            label_en: 'Bronze Seller',
            icon: '🥉'
        },
        new: {
            color: 'from-blue-400 to-indigo-500',
            bgColor: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
            borderColor: 'border-blue-300 dark:border-blue-700',
            label_th: 'ผู้ขายใหม่',
            label_en: 'New Seller',
            icon: '🆕'
        },
        unverified: {
            color: 'from-gray-400 to-gray-500',
            bgColor: 'bg-gray-50 dark:bg-gray-800',
            borderColor: 'border-gray-300 dark:border-gray-600',
            label_th: 'ยังไม่ยืนยัน',
            label_en: 'Unverified',
            icon: '❓'
        }
    }

    const config = levelConfig[trustData.level]

    // Compact view
    if (compact) {
        return (
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor} border ${config.borderColor}`}>
                <span>{config.icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {language === 'th' ? config.label_th : config.label_en}
                </span>
                <div className="flex items-center gap-0.5">
                    <Shield className="w-3 h-3 text-green-500" />
                    <span className="text-xs font-bold text-green-600">{trustData.overallScore}</span>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border ${config.borderColor} ${config.bgColor} overflow-hidden`}
        >
            {/* Header */}
            <div className="px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.color} flex items-center justify-center text-2xl shadow-lg`}>
                        {config.icon}
                    </div>
                    <div>
                        <h4 className="font-bold text-gray-800 dark:text-gray-100">
                            {language === 'th' ? '🔐 ความน่าเชื่อถือ' : '🔐 Trust Score'}
                        </h4>
                        <p className="text-sm text-gray-500">
                            {language === 'th' ? config.label_th : config.label_en}
                        </p>
                    </div>
                </div>

                {/* Score Circle */}
                <div className="relative w-16 h-16">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle
                            cx="18" cy="18" r="15.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            className="text-gray-200 dark:text-gray-700"
                        />
                        <motion.circle
                            cx="18" cy="18" r="15.5"
                            fill="none"
                            stroke="url(#trustGradient)"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeDasharray={`${trustData.overallScore} 100`}
                            initial={{ strokeDasharray: "0 100" }}
                            animate={{ strokeDasharray: `${trustData.overallScore} 100` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                        />
                        <defs>
                            <linearGradient id="trustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10B981" />
                                <stop offset="100%" stopColor="#059669" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-800 dark:text-gray-100">
                            {trustData.overallScore}
                        </span>
                    </div>
                </div>
            </div>

            {/* Breakdown Stats */}
            <div className="px-4 py-3 bg-white/50 dark:bg-gray-800/50">
                <div className="grid grid-cols-2 gap-3">
                    {/* Delivery Rate */}
                    <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-green-500" />
                        <div>
                            <p className="text-[10px] text-gray-400">
                                {language === 'th' ? 'ส่งตรงเวลา' : 'On-time'}
                            </p>
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                {trustData.breakdown.deliveryOnTime || '—'}%
                            </p>
                        </div>
                    </div>

                    {/* Response Rate */}
                    <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <div>
                            <p className="text-[10px] text-gray-400">
                                {language === 'th' ? 'ตอบกลับ' : 'Response'}
                            </p>
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                {trustData.breakdown.responseRate || '—'}%
                            </p>
                        </div>
                    </div>

                    {/* Review Score */}
                    <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <div>
                            <p className="text-[10px] text-gray-400">
                                {language === 'th' ? 'คะแนนรีวิว' : 'Rating'}
                            </p>
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                {trustData.breakdown.reviewScore || '—'}/5
                            </p>
                        </div>
                    </div>

                    {/* Dispute Rate */}
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-orange-500" />
                        <div>
                            <p className="text-[10px] text-gray-400">
                                {language === 'th' ? 'ข้อร้องเรียน' : 'Disputes'}
                            </p>
                            <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                {trustData.breakdown.disputeRate.toFixed(1)}%
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verifications */}
            <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 mb-2">
                    {language === 'th' ? 'การยืนยันตัวตน' : 'Verifications'}
                </p>
                <div className="flex flex-wrap gap-2">
                    {trustData.verifications.map((v) => {
                        const iconMap = {
                            phone: Phone,
                            email: Mail,
                            id_card: User,
                            business: Building2,
                            address: Package,
                            bank: CreditCard
                        }
                        const Icon = iconMap[v.type] || CheckCircle
                        const labelMap = {
                            phone: { th: 'โทรศัพท์', en: 'Phone' },
                            email: { th: 'อีเมล', en: 'Email' },
                            id_card: { th: 'บัตรประชาชน', en: 'ID Card' },
                            business: { th: 'ธุรกิจ', en: 'Business' },
                            address: { th: 'ที่อยู่', en: 'Address' },
                            bank: { th: 'บัญชีธนาคาร', en: 'Bank' }
                        }

                        return (
                            <div
                                key={v.type}
                                className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs ${v.verified
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-gray-100 text-gray-400 dark:bg-gray-700 dark:text-gray-500'
                                    }`}
                            >
                                <Icon className="w-3 h-3" />
                                <span>{language === 'th' ? labelMap[v.type].th : labelMap[v.type].en}</span>
                                {v.verified && <CheckCircle className="w-3 h-3" />}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Risk Flags */}
            {trustData.riskFlags.length > 0 && (
                <div className="px-4 py-3 bg-amber-50 dark:bg-amber-900/20">
                    <p className="text-xs text-amber-600 dark:text-amber-400 mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />
                        {language === 'th' ? 'ควรทราบ' : 'Things to Note'}
                    </p>
                    <ul className="space-y-1">
                        {trustData.riskFlags.map((flag, i) => (
                            <li
                                key={i}
                                className={`text-xs ${flag.severity === 'danger'
                                    ? 'text-red-600 dark:text-red-400'
                                    : flag.severity === 'warning'
                                        ? 'text-amber-600 dark:text-amber-400'
                                        : 'text-gray-500'
                                    }`}
                            >
                                • {language === 'th' ? flag.message_th : flag.message_en}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Transparency Note */}
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800/80">
                <p className="text-[10px] text-gray-400 text-center">
                    {language === 'th'
                        ? '📊 คำนวณจากข้อมูลจริงภายในระบบ • ซื่อสัตย์ 100%'
                        : '📊 Calculated from actual system data • 100% Honest'
                    }
                </p>
            </div>
        </motion.div>
    )
}

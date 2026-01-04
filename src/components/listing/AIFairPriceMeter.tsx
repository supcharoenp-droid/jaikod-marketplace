'use client'

/**
 * AI Fair Price Meter Component (Carvana Style)
 * 
 * แสดงการประเมินราคาเทียบตลาด - ซื่อสัตย์ ไม่เดา
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Minus, HelpCircle, Info, DollarSign } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { AIFairPrice, analyzeFairPrice } from '@/lib/ai-commerce'

interface AIFairPriceMeterProps {
    price: number
    categoryId: number
    specs?: Record<string, any>
    similarProducts?: { price: number; sold: boolean }[]
}

export default function AIFairPriceMeter({
    price,
    categoryId,
    specs = {},
    similarProducts = []
}: AIFairPriceMeterProps) {
    const { language } = useLanguage()
    const [priceData, setPriceData] = useState<AIFairPrice | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        analyzePrice()
    }, [price, categoryId])

    const analyzePrice = async () => {
        setLoading(true)
        try {
            const result = await analyzeFairPrice(price, categoryId, specs, similarProducts)
            setPriceData(result)
        } catch (error) {
            console.error('Price analysis error:', error)
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

    if (!priceData) return null

    // Rating configurations
    const ratingConfig = {
        excellent_deal: {
            icon: TrendingDown,
            color: 'bg-green-500',
            textColor: 'text-green-600 dark:text-green-400',
            bgColor: 'bg-green-50 dark:bg-green-900/20',
            borderColor: 'border-green-200 dark:border-green-800',
            label_th: 'คุ้มมาก!',
            label_en: 'Excellent Deal!',
            desc_th: 'ราคาต่ำกว่าตลาดมาก',
            desc_en: 'Well below market price'
        },
        good_deal: {
            icon: TrendingDown,
            color: 'bg-emerald-500',
            textColor: 'text-emerald-600 dark:text-emerald-400',
            bgColor: 'bg-emerald-50 dark:bg-emerald-900/20',
            borderColor: 'border-emerald-200 dark:border-emerald-800',
            label_th: 'คุ้มค่า',
            label_en: 'Good Deal',
            desc_th: 'ราคาต่ำกว่าตลาด',
            desc_en: 'Below market price'
        },
        fair_price: {
            icon: Minus,
            color: 'bg-blue-500',
            textColor: 'text-blue-600 dark:text-blue-400',
            bgColor: 'bg-blue-50 dark:bg-blue-900/20',
            borderColor: 'border-blue-200 dark:border-blue-800',
            label_th: 'ราคาเหมาะสม',
            label_en: 'Fair Price',
            desc_th: 'ใกล้เคียงราคาตลาด',
            desc_en: 'Around market price'
        },
        above_average: {
            icon: TrendingUp,
            color: 'bg-amber-500',
            textColor: 'text-amber-600 dark:text-amber-400',
            bgColor: 'bg-amber-50 dark:bg-amber-900/20',
            borderColor: 'border-amber-200 dark:border-amber-800',
            label_th: 'สูงกว่าตลาดเล็กน้อย',
            label_en: 'Slightly Above Market',
            desc_th: 'อาจต่อรองได้',
            desc_en: 'Room for negotiation'
        },
        overpriced: {
            icon: TrendingUp,
            color: 'bg-red-500',
            textColor: 'text-red-600 dark:text-red-400',
            bgColor: 'bg-red-50 dark:bg-red-900/20',
            borderColor: 'border-red-200 dark:border-red-800',
            label_th: 'สูงกว่าตลาด',
            label_en: 'Above Market',
            desc_th: 'ราคาสูงกว่าเฉลี่ย',
            desc_en: 'Higher than average'
        },
        insufficient_data: {
            icon: HelpCircle,
            color: 'bg-gray-400',
            textColor: 'text-gray-600 dark:text-gray-400',
            bgColor: 'bg-gray-50 dark:bg-gray-800',
            borderColor: 'border-gray-200 dark:border-gray-700',
            label_th: 'ข้อมูลไม่เพียงพอ',
            label_en: 'Insufficient Data',
            desc_th: 'ต้องการข้อมูลเพิ่มเพื่อวิเคราะห์',
            desc_en: 'Need more data to analyze'
        }
    }

    const config = ratingConfig[priceData.rating]
    const Icon = config.icon

    // Meter position (0-100)
    const getMeterPosition = () => {
        switch (priceData.rating) {
            case 'excellent_deal': return 10
            case 'good_deal': return 25
            case 'fair_price': return 50
            case 'above_average': return 70
            case 'overpriced': return 90
            default: return 50
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border ${config.borderColor} ${config.bgColor} overflow-hidden`}
        >
            {/* Header */}
            <div className="px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-lg ${config.color} flex items-center justify-center`}>
                            <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h4 className={`text-sm font-bold ${config.textColor}`}>
                                {language === 'th' ? `💰 ${config.label_th}` : `💰 ${config.label_en}`}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                {language === 'th' ? config.desc_th : config.desc_en}
                            </p>
                        </div>
                    </div>

                    {priceData.rating !== 'insufficient_data' && (
                        <div className="text-right">
                            <span className="text-xs text-gray-400">
                                {language === 'th' ? 'ความมั่นใจ' : 'Confidence'}
                            </span>
                            <p className={`text-sm font-bold ${config.textColor}`}>
                                {priceData.confidence}%
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Price Meter */}
            {priceData.rating !== 'insufficient_data' && (
                <div className="px-4 pb-4">
                    {/* Meter Track */}
                    <div className="relative h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-400 rounded-full mb-2">
                        {/* Indicator */}
                        <motion.div
                            initial={{ left: '50%' }}
                            animate={{ left: `${getMeterPosition()}%` }}
                            transition={{ duration: 0.8, type: 'spring' }}
                            className="absolute top-0 -translate-x-1/2 w-5 h-5 -mt-1"
                        >
                            <div className="w-5 h-5 bg-white dark:bg-gray-800 rounded-full border-2 border-gray-800 dark:border-white shadow-lg flex items-center justify-center">
                                <div className={`w-2 h-2 rounded-full ${config.color}`} />
                            </div>
                        </motion.div>
                    </div>

                    {/* Labels */}
                    <div className="flex justify-between text-[10px] text-gray-400">
                        <span>{language === 'th' ? 'คุ้มมาก' : 'Great Deal'}</span>
                        <span>{language === 'th' ? 'ปกติ' : 'Fair'}</span>
                        <span>{language === 'th' ? 'สูง' : 'High'}</span>
                    </div>

                    {/* Comparison Data */}
                    {priceData.comparisonCount > 0 && (
                        <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Info className="w-3 h-3" />
                                {language === 'th'
                                    ? `เปรียบเทียบกับ ${priceData.comparisonCount} รายการในระบบ`
                                    : `Compared with ${priceData.comparisonCount} similar items`
                                }
                            </p>

                            {priceData.estimatedFairPrice.average > 0 && (
                                <div className="mt-2 grid grid-cols-3 gap-2 text-center">
                                    <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
                                        <p className="text-[10px] text-gray-400">
                                            {language === 'th' ? 'ต่ำสุด' : 'Low'}
                                        </p>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                                            ฿{priceData.estimatedFairPrice.low.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-700 rounded-lg p-2 ring-2 ring-purple-200 dark:ring-purple-700">
                                        <p className="text-[10px] text-purple-500">
                                            {language === 'th' ? 'เฉลี่ย' : 'Avg'}
                                        </p>
                                        <p className="text-xs font-bold text-purple-600 dark:text-purple-400">
                                            ฿{priceData.estimatedFairPrice.average.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-700 rounded-lg p-2">
                                        <p className="text-[10px] text-gray-400">
                                            {language === 'th' ? 'สูงสุด' : 'High'}
                                        </p>
                                        <p className="text-xs font-bold text-gray-700 dark:text-gray-200">
                                            ฿{priceData.estimatedFairPrice.high.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Transparency Note */}
            <div className="px-4 py-2 bg-gray-100 dark:bg-gray-800/50">
                <p className="text-[10px] text-gray-400 text-center">
                    {language === 'th'
                        ? '📊 อ้างอิงจากสินค้าประเภทเดียวกันในระบบ • ไม่ใช่การรับรองราคา'
                        : '📊 Based on similar items in our system • Not a price guarantee'
                    }
                </p>
            </div>
        </motion.div>
    )
}

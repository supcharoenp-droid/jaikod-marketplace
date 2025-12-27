'use client'

/**
 * PRICE ANALYSIS PANEL
 * 
 * แสดงคำแนะนำราคาแบบละเอียด โดยไม่ auto-fill ราคา
 * ให้ผู้ขายตัดสินใจเอง
 * 
 * ✅ Now supports AI Vision detected price for better accuracy
 */

import React, { useMemo } from 'react'
import { TrendingUp, TrendingDown, Minus, Info, Zap, Target, DollarSign, Bot } from 'lucide-react'
import { calculateSmartPriceEstimate, type PriceEstimation } from '@/lib/smart-price-estimator'

interface PriceAnalysisPanelProps {
    categoryId: number
    subcategoryId?: number
    condition: string
    specs?: Record<string, string>
    // ✅ NEW: Detailed form data for accurate pricing
    formData?: Record<string, string | string[]>
    imageQualityScore?: number
    hasMultipleImages?: boolean
    currentPrice?: number
    language?: 'th' | 'en'
    onPriceSelect?: (price: number) => void
    // ✅ NEW: AI Vision detected price
    aiDetectedPrice?: {
        min: number
        max: number
        suggested: number
    }
}

export default function PriceAnalysisPanel({
    categoryId,
    subcategoryId,
    condition,
    specs = {},
    formData = {},  // ✅ NEW: Detailed form data
    imageQualityScore = 70,
    hasMultipleImages = false,
    currentPrice = 0,
    language = 'th',
    onPriceSelect,
    aiDetectedPrice
}: PriceAnalysisPanelProps) {
    // Calculate price estimation
    const estimation = useMemo<PriceEstimation>(() => {
        // ✅ ALWAYS calculate rule-based estimation for factors
        const ruleBasedEstimation = calculateSmartPriceEstimate({
            categoryId,
            subcategoryId,
            condition,
            specs,
            formData,
            imageQualityScore,
            hasMultipleImages,
            language
        })

        // ✅ Count significant factors (excluding condition which is always present)
        const significantFactors = ruleBasedEstimation.factors.filter(f =>
            f.percentage !== 0 || f.name_th.includes('ยี่ห้อ') || f.name_th.includes('ปีรถ') || f.name_th.includes('ระยะทาง')
        ).length

        // ✅ SMART PRICE DECISION: Compare AI vs Rule-based
        const aiPrice = aiDetectedPrice?.suggested || 0
        const rulePrice = ruleBasedEstimation.avgPrice || 0

        // If AI price is 3x higher than rule-based, AI is likely correct (rule-based has wrong base price)
        const aiIsMuchHigher = aiPrice > rulePrice * 3 && aiPrice > 50000
        // If rule-based has many factors AND price is reasonable, use rule-based
        const useRuleBasedPrice = significantFactors >= 3 && !aiIsMuchHigher

        console.log('🔢 Price Decision:', {
            significantFactors,
            useRuleBasedPrice,
            aiPrice,
            ruleBasedPrice: rulePrice,
            aiIsMuchHigher
        })

        // ✅ Priority: AI price when it's significantly higher (indicates correct market value)
        if (aiIsMuchHigher && aiPrice > 0) {
            console.log('🤖 Using AI price (much higher than rule-based)')
            return {
                suggestedPrice: aiPrice,
                quickSellPrice: aiDetectedPrice?.min || aiPrice * 0.85,
                maxPrice: aiDetectedPrice?.max || aiPrice * 1.15,
                maxProfitPrice: aiDetectedPrice?.max || aiPrice * 1.1,
                minPrice: aiDetectedPrice?.min || aiPrice * 0.7,
                avgPrice: aiPrice,
                priceRange: { min: aiPrice * 0.8, max: aiPrice * 1.2 },
                confidence: 0.9,
                reasoning: '🤖 ราคาจาก AI Vision Analysis',
                factors: [
                    {
                        name_th: '🤖 ราคาจาก AI Vision Analysis',
                        name_en: '🤖 AI Vision Analysis Price',
                        impact: 'positive' as const,
                        percentage: 0,
                        icon: '🤖'
                    },
                    ...ruleBasedEstimation.factors.slice(0, 3)
                ],
                insights: [
                    language === 'th' ? '🎯 ราคาจาก AI วิเคราะห์สินค้าจริง' : '🎯 AI analyzed actual product price',
                    ...ruleBasedEstimation.insights.slice(0, 2)
                ]
            }
        }

        // ✅ If user has filled details → use rule-based (dynamic pricing)
        if (useRuleBasedPrice) {
            // Add AI analyzed note if available
            if (aiDetectedPrice && aiDetectedPrice.suggested > 0) {
                return {
                    ...ruleBasedEstimation,
                    factors: [
                        {
                            name_th: '🤖 ราคาเริ่มต้นจาก AI',
                            name_en: '🤖 Initial AI estimate',
                            impact: 'neutral' as const,
                            percentage: 0,
                            icon: '🤖'
                        },
                        ...ruleBasedEstimation.factors
                    ],
                    insights: [
                        language === 'th' ? '📊 ราคาปรับตามข้อมูลที่คุณกรอก' : '📊 Price adjusted based on your inputs',
                        ...ruleBasedEstimation.insights
                    ]
                }
            }
            return ruleBasedEstimation
        }

        // ✅ If AI detected a price AND user hasn't filled much details, use AI price
        if (aiDetectedPrice && aiDetectedPrice.suggested > 0) {
            return {
                suggestedPrice: aiDetectedPrice.suggested,
                quickSellPrice: aiDetectedPrice.min,
                maxPrice: aiDetectedPrice.max,
                minPrice: aiDetectedPrice.min,
                avgPrice: aiDetectedPrice.suggested,
                maxProfitPrice: aiDetectedPrice.max,
                priceRange: { min: aiDetectedPrice.min, max: aiDetectedPrice.max },
                confidence: 85,
                factors: [
                    {
                        name_th: '🤖 AI วิเคราะห์จากรูปภาพ',
                        name_en: '🤖 AI analyzed from image',
                        impact: 'positive' as const,
                        percentage: 0,
                        icon: '🤖'
                    },
                    ...ruleBasedEstimation.factors
                ],
                insights: [
                    language === 'th' ? '🤖 ราคาจาก AI Vision (กรอกเพิ่มเพื่อปรับราคา)' : '🤖 AI price (add details to refine)',
                    ...ruleBasedEstimation.insights
                ],
                reasoning: language === 'th'
                    ? 'ราคาจาก AI Vision - กรอกข้อมูลเพิ่มเพื่อปรับราคาให้แม่นยำขึ้น'
                    : 'AI Vision price - add more details to refine'
            }
        }

        // ✅ No AI price → use rule-based estimation
        return ruleBasedEstimation
    }, [categoryId, subcategoryId, condition, specs, formData, imageQualityScore, hasMultipleImages, language, aiDetectedPrice])

    // Debug log - ✅ ENHANCED to show all data
    console.log('🔍 PriceAnalysisPanel Debug:', {
        categoryId,
        subcategoryId,
        condition,
        specs,
        formData,
        aiDetectedPrice,
        isNaN: isNaN(categoryId),
        factors: estimation.factors,
        estimatedPrices: {
            quick: estimation.quickSellPrice,
            avg: estimation.avgPrice,
            max: estimation.maxProfitPrice
        }
    })

    // Check if we have enough data - handle NaN
    const validCategoryId = !isNaN(categoryId) && categoryId > 0
    const hasEnoughData = validCategoryId && condition

    // ✅ Only show price analysis for actual vehicles (not parts/accessories)
    // Sub ID: 101=รถยนต์, 102=มอเตอร์ไซค์, 105=รถบรรทุก, 107=รถกระบะ, 108=รถตู้
    const VEHICLE_SUBCATEGORIES = [101, 102, 105, 107, 108]
    const isVehicle = categoryId === 1 && subcategoryId && VEHICLE_SUBCATEGORIES.includes(subcategoryId)

    // ❌ ไม่แสดงอะไรเลยสำหรับหมวดอื่น
    if (!isVehicle) {
        return null
    }

    if (!hasEnoughData) {
        return (
            <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
                <p className="text-xs text-gray-500 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5" />
                    {language === 'th'
                        ? `เลือกหมวดหมู่และสภาพเพื่อดูราคาแนะนำ (Category: ${categoryId})`
                        : `Select category and condition to see price recommendation (Category: ${categoryId})`}
                </p>
            </div>
        )
    }

    // Price comparison
    const isPriceLow = currentPrice > 0 && currentPrice < estimation.minPrice
    const isPriceHigh = currentPrice > 0 && currentPrice > estimation.maxPrice
    const isPriceGood = currentPrice > 0 && currentPrice >= estimation.minPrice && currentPrice <= estimation.maxPrice

    // Get category name for display - ⚠️ MUST MATCH constants/categories.ts
    const getCategoryName = (id: number) => {
        const names: Record<number, string> = {
            1: '🚗 ยานยนต์',
            2: '🏠 อสังหาริมทรัพย์',
            3: '📱 มือถือและแท็บเล็ต',
            4: '💻 คอมพิวเตอร์',
            5: '🔌 เครื่องใช้ไฟฟ้า',
            6: '👕 แฟชั่น',
            7: '🎮 เกมและแก็ดเจ็ต',
            8: '📷 กล้องถ่ายรูป',
            9: '🙏 พระเครื่อง',
            10: '🐶 สัตว์เลี้ยง',
            11: '🛠️ บริการ',
            12: '⚽ กีฬา',
            13: '🌳 บ้านและสวน',
            14: '💄 เครื่องสำอาง',
            15: '👶 เด็กและทารก',
            16: '📚 หนังสือ',
            99: '📦 เบ็ดเตล็ด',
        }
        return names[id] || `หมวด ${id}`
    }

    return (
        <div className="space-y-3">
            {/* Main Price Recommendation */}
            <div className="p-4 rounded-lg bg-gradient-to-br from-purple-900/30 to-blue-900/30 border border-purple-500/30">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-purple-300 flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        {language === 'th' ? '📊 วิเคราะห์ราคา' : '📊 Price Analysis'}
                        <span className="text-xs font-normal text-gray-400">
                            ({getCategoryName(categoryId)})
                        </span>
                    </h4>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                        {language === 'th' ? `ความมั่นใจ ${estimation.confidence}%` : `${estimation.confidence}% confidence`}
                    </span>
                </div>

                {/* Price Range */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 text-center p-2 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-blue-800/30 transition-colors"
                        onClick={() => onPriceSelect?.(estimation.quickSellPrice)}>
                        <p className="text-[10px] text-blue-400 mb-0.5 flex items-center justify-center gap-1">
                            <Zap className="w-2.5 h-2.5" />
                            {language === 'th' ? 'ขายเร็ว' : 'Quick Sell'}
                        </p>
                        <p className="text-sm font-bold text-blue-300">
                            ฿{estimation.quickSellPrice.toLocaleString()}
                        </p>
                    </div>
                    <div className="flex-1 text-center p-2 rounded-lg bg-purple-500/20 border border-purple-500/40 cursor-pointer hover:bg-purple-500/30 transition-colors"
                        onClick={() => onPriceSelect?.(estimation.avgPrice)}>
                        <p className="text-[10px] text-purple-300 mb-0.5 flex items-center justify-center gap-1">
                            <Target className="w-2.5 h-2.5" />
                            {language === 'th' ? 'ราคาตลาด' : 'Market Price'}
                        </p>
                        <p className="text-lg font-bold text-purple-200">
                            ฿{estimation.avgPrice.toLocaleString()}
                        </p>
                    </div>
                    <div className="flex-1 text-center p-2 rounded-lg bg-gray-800/50 cursor-pointer hover:bg-green-800/30 transition-colors"
                        onClick={() => onPriceSelect?.(estimation.maxProfitPrice)}>
                        <p className="text-[10px] text-green-400 mb-0.5 flex items-center justify-center gap-1">
                            <TrendingUp className="w-2.5 h-2.5" />
                            {language === 'th' ? 'กำไรสูง' : 'Max Profit'}
                        </p>
                        <p className="text-sm font-bold text-green-300">
                            ฿{estimation.maxProfitPrice.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Price Feedback */}
                {currentPrice > 0 && (
                    <div className={`p-2 rounded-lg text-xs ${isPriceGood
                        ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                        : isPriceLow
                            ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                            : 'bg-red-500/20 text-red-300 border border-red-500/30'
                        }`}>
                        {isPriceGood && (
                            <span className="flex items-center gap-1.5">
                                ✅ {language === 'th' ? 'ราคาเหมาะสม อยู่ในช่วงปกติ' : 'Good price - within market range'}
                            </span>
                        )}
                        {isPriceLow && (
                            <span className="flex items-center gap-1.5">
                                ⚠️ {language === 'th'
                                    ? `ราคาต่ำกว่าตลาด - อาจขายเร็วแต่ได้กำไรน้อย`
                                    : 'Below market - may sell fast but lower profit'}
                            </span>
                        )}
                        {isPriceHigh && (
                            <span className="flex items-center gap-1.5">
                                ⚠️ {language === 'th'
                                    ? `ราคาสูงกว่าตลาด - อาจขายช้ากว่าปกติ`
                                    : 'Above market - may sell slower'}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Price Factors */}
            {estimation.factors.length > 0 && (
                <div className="p-3 rounded-lg bg-gray-800/30 border border-gray-700/50">
                    <h5 className="text-xs font-medium text-gray-400 mb-2">
                        {language === 'th' ? '📋 ปัจจัยที่ส่งผลต่อราคา' : '📋 Price Factors'}
                    </h5>
                    <div className="space-y-1.5">
                        {estimation.factors.map((factor, index) => (
                            <div key={index} className="flex items-center justify-between text-xs">
                                <span className="flex items-center gap-1.5 text-gray-300">
                                    <span>{factor.icon}</span>
                                    {language === 'th' ? factor.name_th : factor.name_en}
                                </span>
                                <span className={`font-medium ${factor.impact === 'positive'
                                    ? 'text-green-400'
                                    : factor.impact === 'negative'
                                        ? 'text-red-400'
                                        : 'text-gray-400'
                                    }`}>
                                    {factor.impact === 'positive' && <TrendingUp className="w-3 h-3 inline mr-0.5" />}
                                    {factor.impact === 'negative' && <TrendingDown className="w-3 h-3 inline mr-0.5" />}
                                    {factor.impact === 'neutral' && <Minus className="w-3 h-3 inline mr-0.5" />}
                                    {factor.percentage > 0 ? '+' : ''}{factor.percentage}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Insights */}
            {estimation.insights.length > 0 && (
                <div className="text-xs text-gray-500 space-y-0.5">
                    {estimation.insights.map((insight, index) => (
                        <p key={index}>{insight}</p>
                    ))}
                </div>
            )}
        </div>
    )
}

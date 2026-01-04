'use client'

import { motion } from 'framer-motion'
import { Sparkles, TrendingUp, TrendingDown, DollarSign, AlertCircle, BarChart3 } from 'lucide-react'
import { PriceIntelligence } from '@/services/aiChatService'

interface PriceIntelligencePanelProps {
    currentPrice: number
    priceIntel: PriceIntelligence | null
    onApplyPrice?: (price: number) => void
    onCounter5Percent?: () => void
    onHoldPrice?: () => void
    className?: string
}

/**
 * PriceIntelligencePanel - AI วิเคราะห์ราคาและแนะนำการต่อรอง
 * Features จาก ChatSystemV2 ย้ายมาใช้ใน Production
 */
export default function PriceIntelligencePanel({
    currentPrice,
    priceIntel,
    onApplyPrice,
    onCounter5Percent,
    onHoldPrice,
    className = ''
}: PriceIntelligencePanelProps) {
    // Calculate quick prices
    const counter5Price = Math.round(currentPrice * 0.95)
    const counter10Price = Math.round(currentPrice * 0.90)
    const counter15Price = Math.round(currentPrice * 0.85)

    const getDemandConfig = (level: string) => {
        switch (level?.toLowerCase()) {
            case 'high':
                return {
                    bg: 'bg-green-50 dark:bg-green-900/20',
                    text: 'text-green-600 dark:text-green-400',
                    icon: TrendingUp,
                    label: '🔥 High Demand',
                    advice: 'สินค้ามีความต้องการสูง ควรยืนราคา'
                }
            case 'medium':
                return {
                    bg: 'bg-blue-50 dark:bg-blue-900/20',
                    text: 'text-blue-600 dark:text-blue-400',
                    icon: BarChart3,
                    label: '📊 Moderate',
                    advice: 'ปานกลาง สามารถต่อรองได้บ้าง'
                }
            case 'low':
            default:
                return {
                    bg: 'bg-orange-50 dark:bg-orange-900/20',
                    text: 'text-orange-600 dark:text-orange-400',
                    icon: TrendingDown,
                    label: '📉 Low Demand',
                    advice: 'ความต้องการต่ำ อาจต้องลดราคา'
                }
        }
    }

    const demandConfig = priceIntel ? getDemandConfig(priceIntel.demandLevel) : getDemandConfig('medium')
    const DemandIcon = demandConfig.icon

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-4 rounded-3xl border border-violet-200/50 dark:border-violet-500/20 shadow-sm ${className}`}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-violet-600 rounded-lg text-white">
                    <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="font-black text-gray-900 dark:text-white text-xs uppercase tracking-widest">
                    AI Price Intelligence
                </h3>
            </div>

            {/* Current vs Suggested */}
            <div className="grid grid-cols-2 gap-3 mb-4">
                {/* Current Price */}
                <div className="p-3 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-1">
                        ราคาตั้ง
                    </div>
                    <div className="text-lg font-black text-gray-900 dark:text-white">
                        ฿{currentPrice.toLocaleString()}
                    </div>
                </div>

                {/* Suggested Price */}
                <div className="p-3 bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-100 dark:border-violet-800">
                    <div className="text-[9px] uppercase tracking-widest text-violet-600 font-bold mb-1">
                        AI แนะนำ
                    </div>
                    <div className="text-lg font-black text-violet-600">
                        ฿{(priceIntel?.suggestedOffer || counter5Price).toLocaleString()}
                    </div>
                </div>
            </div>

            {/* Market Fair Price */}
            {priceIntel && (
                <div className="p-3 bg-white/80 dark:bg-gray-800/80 rounded-2xl border border-gray-100 dark:border-gray-700 mb-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="text-[9px] uppercase tracking-widest text-gray-500 font-bold mb-0.5">
                                Market Fair Price
                            </div>
                            <div className="text-xl font-black text-violet-600">
                                ฿{priceIntel.fairPriceRange?.max?.toLocaleString() || (currentPrice * 0.95).toLocaleString()}
                            </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-xl ${demandConfig.bg}`}>
                            <div className={`flex items-center gap-1 ${demandConfig.text} text-[10px] font-black`}>
                                <DemandIcon className="w-3 h-3" />
                                {demandConfig.label}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Reasoning */}
            {priceIntel?.reasoningTH && (
                <div className="mb-4 p-3 bg-white/50 dark:bg-gray-800/50 rounded-xl border-l-2 border-violet-400">
                    <p className="text-[10px] text-gray-600 dark:text-gray-400 font-bold leading-relaxed italic">
                        "{priceIntel.reasoningTH}"
                    </p>
                </div>
            )}

            {/* Quick Counter Buttons */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <button
                    onClick={onCounter5Percent || (() => onApplyPrice?.(counter5Price))}
                    className="py-2.5 bg-white dark:bg-gray-800 border border-violet-200 dark:border-violet-800 rounded-xl text-[10px] font-black text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all active:scale-95"
                >
                    <div className="text-[8px] text-gray-400 mb-0.5">-5%</div>
                    ฿{counter5Price.toLocaleString()}
                </button>
                <button
                    onClick={() => onApplyPrice?.(counter10Price)}
                    className="py-2.5 bg-white dark:bg-gray-800 border border-violet-200 dark:border-violet-800 rounded-xl text-[10px] font-black text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all active:scale-95"
                >
                    <div className="text-[8px] text-gray-400 mb-0.5">-10%</div>
                    ฿{counter10Price.toLocaleString()}
                </button>
                <button
                    onClick={() => onApplyPrice?.(counter15Price)}
                    className="py-2.5 bg-white dark:bg-gray-800 border border-violet-200 dark:border-violet-800 rounded-xl text-[10px] font-black text-violet-600 hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-all active:scale-95"
                >
                    <div className="text-[8px] text-gray-400 mb-0.5">-15%</div>
                    ฿{counter15Price.toLocaleString()}
                </button>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
                <button
                    onClick={onHoldPrice || (() => onApplyPrice?.(currentPrice))}
                    className="py-2.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-[10px] font-black text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all active:scale-95"
                >
                    ยืนราคา
                </button>
                <button
                    onClick={() => onApplyPrice?.(priceIntel?.suggestedOffer || counter5Price)}
                    className="py-2.5 bg-violet-600 text-white rounded-xl text-[10px] font-black hover:bg-violet-700 transition-all shadow-lg shadow-violet-500/20 active:scale-95"
                >
                    ใช้ราคาแนะนำ
                </button>
            </div>

            {/* Tip */}
            <div className="mt-4 flex items-start gap-2 p-2 bg-violet-50/50 dark:bg-violet-900/10 rounded-xl">
                <AlertCircle className="w-3.5 h-3.5 text-violet-500 flex-shrink-0 mt-0.5" />
                <p className="text-[9px] text-violet-600 dark:text-violet-400 font-medium leading-relaxed">
                    {demandConfig.advice}
                </p>
            </div>
        </motion.div>
    )
}

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Tag, TrendingDown, TrendingUp, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react'

interface PriceBenchmarkProps {
    productTitle: string
    currentPrice: number
    avgMarketPrice: number
    category: string
}

export default function PriceBenchmark({
    productTitle = "iPhone 15 Pro",
    currentPrice = 38500,
    avgMarketPrice = 39900,
    category = "Smartphones"
}: PriceBenchmarkProps) {

    const diff = ((currentPrice - avgMarketPrice) / avgMarketPrice) * 100
    const isCheaper = currentPrice < avgMarketPrice
    const status = Math.abs(diff) < 5 ? 'Competitive' : isCheaper ? 'Low Price' : 'High Price'

    return (
        <div className="bg-slate-800/20 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:bg-slate-800/40 transition-all group">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                        <Tag className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm tracking-tight">{productTitle}</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{category}</p>
                    </div>
                </div>
                <button className="p-2 hover:bg-white/5 rounded-full transition-colors">
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                </button>
            </div>

            {/* Price Meter */}
            <div className="relative h-2 w-full bg-slate-900 rounded-full mb-8 overflow-hidden flex">
                <div className="h-full bg-emerald-500/30" style={{ width: '33.3%' }} />
                <div className="h-full bg-blue-500/30" style={{ width: '33.3%' }} />
                <div className="h-full bg-rose-500/30" style={{ width: '33.4%' }} />

                {/* Pointer */}
                <motion.div
                    initial={{ left: '50%' }}
                    animate={{ left: `${Math.max(10, Math.min(90, 50 + diff))}%` }}
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)] border-2 border-slate-900 z-10"
                />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Your Price</p>
                    <p className="text-lg font-black text-white">฿{currentPrice.toLocaleString()}</p>
                </div>
                <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Market Avg</p>
                    <p className="text-lg font-black text-slate-400">฿{avgMarketPrice.toLocaleString()}</p>
                </div>
            </div>

            {/* AI Verdict */}
            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${status === 'Low Price' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                    status === 'Competitive' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                        'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                {status === 'Low Price' ? <TrendingDown className="w-5 h-5" /> :
                    status === 'Competitive' ? <CheckCircle2 className="w-5 h-5" /> :
                        <AlertTriangle className="w-5 h-5" />}

                <div className="text-xs font-bold leading-tight">
                    {status === 'Low Price' ? `ราคาของคุณถูกกว่าตลาด ${Math.abs(Math.round(diff))}%` :
                        status === 'Competitive' ? `ราคาของคุณเหมาะสมกับตลาดในขณะนี้` :
                            `ราคาของคุณสูงกว่าคู่แข่ง ${Math.round(diff)}%`}
                </div>
            </div>
        </div>
    )
}

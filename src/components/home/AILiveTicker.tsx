'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ShoppingBag, Eye, UserPlus, Sparkles, TrendingUp } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface ActivityItem {
    id: string
    type: 'sale' | 'view' | 'user' | 'trending'
    textTh: string
    textEn: string
    icon: React.ReactNode
    time: string
}

const REAL_ACTIVITIES: ActivityItem[] = [
    { id: '1', type: 'sale', textTh: 'มีคนเพิ่งซื้อ iPhone 15 Pro ในกรุงเทพฯ', textEn: 'Someone just bought iPhone 15 Pro in Bangkok', icon: <ShoppingBag className="w-3 h-3" />, time: '2m ago' },
    { id: '2', type: 'view', textTh: 'รถยนต์มือสอง 50+ คนกำลังดูอยู่ตอนนี้', textEn: '50+ people are viewing used cars right now', icon: <Eye className="w-3 h-3" />, time: 'Live' },
    { id: '3', type: 'user', textTh: 'ยินดีต้อนรับผู้ขายใหม่จากเชียงใหม่!', textEn: 'Welcome a new seller from Chiang Mai!', icon: <UserPlus className="w-3 h-3" />, time: '5m ago' },
    { id: '4', type: 'trending', textTh: 'คำค้นหายอดนิยม: คอนโดใกล้รถไฟฟ้า', textEn: 'Trending search: Condo near BTS', icon: <TrendingUp className="w-3 h-3" />, time: 'Now' },
    { id: '5', type: 'sale', textTh: 'ขายแล้ว! MacBook Air M2 สภาพนางฟ้า', textEn: 'Sold! MacBook Air M2 in mint condition', icon: <Zap className="w-3 h-3" />, time: '10m ago' }
]

export default function AILiveTicker() {
    const { language } = useLanguage()
    const [index, setIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setIndex((prev) => (prev + 1) % REAL_ACTIVITIES.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

    const active = REAL_ACTIVITIES[index]

    return (
        <div className="w-full bg-white/40 dark:bg-black/20 backdrop-blur-md border-y border-gray-100 dark:border-white/5 py-2 overflow-hidden shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="relative">
                            <Sparkles className="w-4 h-4 text-purple-600 animate-pulse" />
                            <div className="absolute inset-0 bg-purple-400 blur-sm rounded-full opacity-50 animate-ping" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400">AI Global Live Feed</span>
                    </div>

                    <div className="h-4 w-px bg-gray-200 dark:bg-gray-800 hidden md:block" />

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.id}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "circOut" }}
                            className="flex items-center gap-3 text-xs font-medium text-gray-700 dark:text-gray-300"
                        >
                            <span className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-500">
                                {active.icon}
                            </span>
                            <span className="truncate max-w-[200px] md:max-w-none">
                                {language === 'th' ? active.textTh : active.textEn}
                            </span>
                            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full text-gray-400 font-bold uppercase">
                                {active.time}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    )
}

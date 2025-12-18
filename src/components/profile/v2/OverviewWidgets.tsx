'use client'

import React from 'react'
import Link from 'next/link'
import { Package, Truck, RefreshCw, CheckCircle, Clock, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '@/contexts/LanguageContext'

// Mock Data
const orderStats = [
    { id: 'pending', label: 'to_pay', count: 1, icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
    { id: 'shipping', label: 'to_ship', count: 0, icon: Package, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { id: 'receiving', label: 'to_receive', count: 2, icon: Truck, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'completed', label: 'completed', count: 12, icon: CheckCircle, color: 'text-emerald-500', bg: 'bg-emerald-50' },
]

export default function OverviewWidgets() {
    const { t } = useLanguage()

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {orderStats.map((stat, idx) => (
                <Link href={`/profile/orders?status=${stat.id}`} key={stat.id} className="block group">
                    <motion.div
                        whileHover={{ y: -3 }}
                        className="bg-white dark:bg-card-dark rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-border-dark relative overflow-hidden h-full"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`p-3 rounded-xl ${stat.bg} dark:bg-opacity-10`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            {stat.count > 0 && (
                                <span className={`flex items-center justify-center min-w-[24px] h-6 px-1.5 rounded-full text-xs font-bold text-white ${stat.count > 0 ? 'bg-red-500' : 'bg-gray-200'}`}>
                                    {stat.count}
                                </span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-0.5">{stat.count}</h3>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 group-hover:text-indigo-500 transition-colors">
                                {t(`profile.order_status_${stat.label}`)}
                            </p>
                        </div>

                        {/* Hover Decoration */}
                        <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-5 transition-opacity blur-xl"></div>
                    </motion.div>
                </Link>
            ))}
        </div>
    )
}

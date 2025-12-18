/**
 * Impact Badge Component
 * 
 * แสดงผลกระทบที่เกิดขึ้นจาก AI enhancement
 */

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, Zap, Award, Eye } from 'lucide-react'

interface ImpactBadgeProps {
    type: 'sales' | 'quality' | 'speed' | 'views'
    value: string | number
    label?: string
    animated?: boolean
}

export default function ImpactBadge({ type, value, label, animated = true }: ImpactBadgeProps) {
    const icons = {
        sales: TrendingUp,
        quality: Award,
        speed: Zap,
        views: Eye
    }

    const colors = {
        sales: 'from-green-500 to-emerald-500',
        quality: 'from-purple-500 to-pink-500',
        speed: 'from-yellow-500 to-orange-500',
        views: 'from-blue-500 to-cyan-500'
    }

    const labels = {
        sales: 'โอกาสขาย',
        quality: 'คุณภาพ',
        speed: 'โหลดเร็วขึ้น',
        views: 'การมองเห็น'
    }

    const Icon = icons[type]

    const BadgeContent = (
        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r ${colors[type]} text-white rounded-full text-xs font-bold shadow-lg`}>
            <Icon className="w-3 h-3" />
            <span>{value}</span>
            <span className="opacity-90">{label || labels[type]}</span>
        </div>
    )

    if (!animated) {
        return BadgeContent
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
        >
            {BadgeContent}
        </motion.div>
    )
}

/**
 * Impact Stats Group
 */
interface ImpactStatsProps {
    stats: Array<{
        type: 'sales' | 'quality' | 'speed' | 'views'
        value: string | number
        label?: string
    }>
}

export function ImpactStats({ stats }: ImpactStatsProps) {
    return (
        <div className="flex flex-wrap gap-2">
            {stats.map((stat, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                >
                    <ImpactBadge {...stat} />
                </motion.div>
            ))}
        </div>
    )
}

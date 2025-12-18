'use client'

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ModernStatsCardProps {
    label: string
    value: string | number
    subtext?: string
    icon: LucideIcon
    color: 'blue' | 'purple' | 'green' | 'orange' | 'pink'
    delay?: number
}

export default function ModernStatsCard({ label, value, subtext, icon: Icon, color, delay = 0 }: ModernStatsCardProps) {
    const colorStyles = {
        blue: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white',
        purple: 'bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white',
        green: 'bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white',
        orange: 'bg-orange-50 text-orange-600 group-hover:bg-orange-600 group-hover:text-white',
        pink: 'bg-pink-50 text-pink-600 group-hover:bg-pink-600 group-hover:text-white',
    }

    return (
        <div
            className={`
                group bg-white/80 backdrop-blur-sm rounded-2xl p-5 border border-white/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                animate-in fade-in slide-in-from-bottom fill-mode-backwards
            `}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl transition-colors duration-300 ${colorStyles[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                {subtext && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-500">
                        {subtext}
                    </span>
                )}
            </div>

            <h3 className="text-2xl font-bold text-gray-800 tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-gray-900 group-hover:to-gray-600 transition-all">
                {value}
            </h3>
            <p className="text-sm text-gray-400 font-medium mt-1">{label}</p>
        </div>
    )
}

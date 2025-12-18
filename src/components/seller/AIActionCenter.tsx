'use client'

import React from 'react'
import { Sparkles, ArrowRight, Package, RefreshCw, DollarSign } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AIActionCenter() {
    const { t } = useLanguage()

    // Mock Tasks
    const tasks = [
        {
            id: 1,
            type: 'optimize',
            title: 'Optimize "Vintage Camera"',
            desc: 'Add 3 missing tags to search +20%',
            impact: 'high',
            icon: Sparkles,
            color: 'text-purple-500',
            bg: 'bg-purple-100 dark:bg-purple-900/30'
        },
        {
            id: 2,
            type: 'inventory',
            title: 'Restock "Sony Lens"',
            desc: 'Stock low (2 remaining). Reorder now.',
            impact: 'medium',
            icon: Package,
            color: 'text-blue-500',
            bg: 'bg-blue-100 dark:bg-blue-900/30'
        },
        {
            id: 3,
            type: 'pricing',
            title: 'Price Alert: Canon AE-1',
            desc: 'Market price rose 10%. Adjust to ฿4,500.',
            impact: 'high',
            icon: DollarSign,
            color: 'text-emerald-500',
            bg: 'bg-emerald-100 dark:bg-emerald-900/30'
        }
    ]

    return (
        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm h-full">
            <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-neon-purple" />
                {t('seller_dashboard.ai_action_center_title')}
            </h3>

            <div className="space-y-4">
                {tasks.map(task => (
                    <div
                        key={task.id}
                        className="group p-4 border border-gray-100 dark:border-gray-800 rounded-xl hover:border-indigo-200 dark:hover:border-indigo-800 hover:shadow-md transition-all cursor-pointer bg-white dark:bg-surface-dark"
                    >
                        <div className="flex gap-4">
                            <div className={`p-3 rounded-xl ${task.bg} ${task.color} h-fit`}>
                                <task.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-gray-800 dark:text-gray-200 text-sm">{task.title}</h4>
                                    {task.impact === 'high' && (
                                        <span className="text-[10px] uppercase font-black tracking-wider text-white bg-gradient-to-r from-pink-500 to-rose-500 px-2 py-0.5 rounded-full shadow-sm shadow-rose-200 dark:shadow-none">
                                            High Impact
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                                    {task.desc}
                                </p>
                            </div>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity -mr-2">
                                <ArrowRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-6 py-2 text-sm font-bold text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                View All Suggestions
            </button>
        </div>
    )
}

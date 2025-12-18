'use client'

import React from 'react'
import { AlertCircle, CheckCircle2, Wand2, Zap } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function ProductHealthWidget() {
    const { t } = useLanguage()

    // Mock Data
    const healthScore = 72
    const issues = [
        { id: 1, type: 'missing_tags', count: 3 },
        { id: 2, type: 'low_res_image', count: 1 },
        { id: 3, type: 'short_description', count: 5 }
    ]

    return (
        <div className="bg-white dark:bg-surface-dark border border-gray-100 dark:border-gray-800 rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-indigo-500" />
                        {t('seller_dashboard.product_health_title')}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {t('seller_dashboard.product_health_issues').replace('{{count}}', String(issues.length))}
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">{healthScore}/100</span>
                    <span className="text-xs font-bold text-gray-400">{t('seller_dashboard.product_health_score')}</span>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 mb-6">
                <div
                    className="bg-indigo-500 h-2 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${healthScore}%` }}
                ></div>
            </div>

            {/* Action List */}
            <div className="space-y-3 mb-6">
                {issues.map(issue => (
                    <div key={issue.id} className="flex items-center justify-between text-sm p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                        <span className="text-gray-700 dark:text-gray-300 capitalize flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
                            {issue.type.replace(/_/g, ' ')}
                        </span>
                        <span className="font-bold text-amber-600 dark:text-amber-500 text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900/30 rounded">
                            {issue.count} {t('seller_dashboard.product_health_action_required')}
                        </span>
                    </div>
                ))}
            </div>

            <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
                <Wand2 className="w-4 h-4" />
                {t('seller_dashboard.product_health_btn_optimize')}
            </button>
        </div>
    )
}

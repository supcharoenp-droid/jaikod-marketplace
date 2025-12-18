'use client'

import React from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { Zap, ShieldAlert, BadgeAlert, Eye } from 'lucide-react'
import { mockAIDetection } from '@/lib/ai-admin'
import { format } from 'date-fns'
import { useLanguage } from '@/contexts/LanguageContext'

export default function AICenterPage() {
    const { t } = useLanguage()

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <Zap className="w-8 h-8 text-yellow-500" />
                        {t('admin.ai_center_title')}
                    </h1>
                    <p className="text-gray-500 mt-1">
                        {t('admin.ai_center_desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-100 dark:border-red-800">
                        <div className="text-red-500 mb-2"><BadgeAlert className="w-8 h-8" /></div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.risk_critical')}</div>
                        <div className="text-sm text-gray-500">{t('admin.risk_critical_desc')}</div>
                    </div>
                    <div className="bg-orange-50 dark:bg-orange-900/10 p-6 rounded-xl border border-orange-100 dark:border-orange-800">
                        <div className="text-orange-500 mb-2"><ShieldAlert className="w-8 h-8" /></div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.risk_high')}</div>
                        <div className="text-sm text-gray-500">{t('admin.risk_high_desc')}</div>
                    </div>
                    <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-xl border border-blue-100 dark:border-blue-800">
                        <div className="text-blue-500 mb-2"><Eye className="w-8 h-8" /></div>
                        <div className="text-2xl font-bold text-gray-900 dark:text-white">{t('admin.risk_monitoring')}</div>
                        <div className="text-sm text-gray-500">{t('admin.risk_monitoring_desc')}</div>
                    </div>
                    <div className="bg-purple-600 p-6 rounded-xl text-white shadow-lg flex items-center justify-between">
                        <div>
                            <div className="text-3xl font-bold">1,248</div>
                            <div className="text-purple-100 text-sm">{t('admin.ai_processed_count')}</div>
                        </div>
                        <Zap className="w-10 h-10 text-yellow-300" />
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                        <h2 className="text-lg font-bold">{t('admin.ai_detected_incidents')}</h2>
                    </div>
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-bold uppercase text-xs">
                            <tr>
                                <th className="px-6 py-4">{t('admin.table_risk_score')}</th>
                                <th className="px-6 py-4">{t('admin.table_risk_level')}</th>
                                <th className="px-6 py-4">{t('admin.table_risk_type')}</th>
                                <th className="px-6 py-4">{t('admin.table_risk_details')}</th>
                                <th className="px-6 py-4">{t('admin.table_risk_time')}</th>
                                <th className="px-6 py-4 text-right">{t('admin.table_action')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {mockAIDetection.map((flag, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700 border-2 border-gray-200">
                                            {flag.score}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${flag.riskLevel === 'critical' ? 'bg-red-100 text-red-700' :
                                            flag.riskLevel === 'high' ? 'bg-orange-100 text-orange-700' :
                                                flag.riskLevel === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-blue-100 text-blue-700'
                                            }`}>
                                            {t(`admin.risk_${flag.riskLevel}`) || flag.riskLevel}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 capitalize text-gray-600">
                                        {t(`admin.ai_type_${flag.type}`) || flag.type.replace('_', ' ')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 dark:text-white">{t(`admin.${flag.reason}`) || flag.reason}</div>
                                        <div className="text-xs text-gray-500">User: {flag.userName}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {t('admin.time_just_now')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-purple-600 hover:text-purple-800 font-medium">
                                            {t('admin.action_inspect')}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}

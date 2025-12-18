'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAdmin } from '@/contexts/AdminContext'
import {
    ShieldAlert, CheckCircle, XCircle, AlertTriangle,
    Flag, RefreshCcw
} from 'lucide-react'
import {
    getModerationFlags,
    resolveFlag,
    seedMockFlags,
    ContentFlag
} from '@/lib/admin/moderation-service'

export default function ContentQueuePage() {
    const { t } = useLanguage()
    const { adminUser } = useAdmin()

    const [activeTab, setActiveTab] = useState<'pending' | 'resolved'>('pending')
    const [flags, setFlags] = useState<ContentFlag[]>([])
    const [loading, setLoading] = useState(true)

    const fetchFlags = async () => {
        setLoading(true)
        const data = await getModerationFlags(activeTab === 'pending' ? 'pending' : 'resolved')
        setFlags(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchFlags()
    }, [activeTab])

    const handleAction = async (id: string, action: 'dismiss' | 'ban_target') => {
        if (!adminUser) return
        if (!confirm(`Confirm action: ${action.toUpperCase()}?`)) return

        try {
            await resolveFlag(adminUser, id, action === 'dismiss' ? 'dismiss' : 'ban_target', 'Admin Manual Review')
            // Optimistic remove from list
            setFlags(prev => prev.filter(f => f.id !== id))
            alert('Flag resolved')
        } catch (error) {
            console.error(error)
            alert('Failed to update flag')
        }
    }

    const handleSeed = async () => {
        await seedMockFlags()
        fetchFlags()
        alert('Mock flags generated!')
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <ShieldAlert className="w-8 h-8 text-red-500" />
                            {t('admin.mod_queue_title')}
                        </h1>
                        <p className="text-gray-500">{t('admin.mod_queue_desc')}</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                    <button
                        onClick={() => setActiveTab('pending')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'pending'
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {t('admin.mod_tab_pending')}
                    </button>
                    <button
                        onClick={() => setActiveTab('resolved')}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === 'resolved'
                            ? 'border-green-500 text-green-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        {t('admin.mod_tab_resolved')}
                    </button>
                </div>

                {/* List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500">
                            <tr>
                                <th className="px-6 py-4">{t('admin.mod_th_target')}</th>
                                <th className="px-6 py-4">{t('admin.mod_th_reason')}</th>
                                <th className="px-6 py-4 w-32 text-center">{t('admin.mod_risk_score')}</th>
                                <th className="px-6 py-4">{t('admin.mod_th_date')}</th>
                                <th className="px-6 py-4 text-right">
                                    {activeTab === 'pending' ? t('admin.table_action') : t('common.status')}
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan={5} className="text-center py-8">{t('common.loading')}</td></tr>
                            ) : flags.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-12 text-gray-500">
                                        <div className="flex flex-col items-center gap-2">
                                            <CheckCircle className="w-10 h-10 text-green-400" />
                                            <p>All clean! No pending flags.</p>
                                            {activeTab === 'pending' && (
                                                <button onClick={handleSeed} className="text-xs text-blue-500 hover:underline mt-2">
                                                    Populate Test Data
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ) : flags.map(item => (
                                <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-start gap-3">
                                            {item.target_preview && (
                                                <img
                                                    src={item.target_preview}
                                                    alt="preview"
                                                    className="w-12 h-12 rounded object-cover border border-gray-200 dark:border-gray-700 bg-gray-100"
                                                />
                                            )}
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white capitalize flex items-center gap-2">
                                                    {item.target_type}
                                                    <span className="text-xs font-normal text-gray-400">#{item.target_id}</span>
                                                </div>
                                                <div className="text-sm text-gray-600 dark:text-gray-300">
                                                    {item.target_name || 'Unknown Item'}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 px-2 py-0.5 rounded">
                                            {item.reason}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {item.ai_score ? (
                                            <div className={`font-mono font-bold ${item.ai_score > 80 ? 'text-red-500' : 'text-yellow-500'}`}>
                                                {item.ai_score}%
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-xs">
                                        {item.created_at?.toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        {activeTab === 'pending' ? (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleAction(item.id, 'dismiss')}
                                                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-bold transition-colors"
                                                >
                                                    {t('admin.mod_btn_approve')}
                                                </button>
                                                <button
                                                    onClick={() => handleAction(item.id, 'ban_target')}
                                                    className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-bold transition-colors"
                                                >
                                                    {t('admin.mod_btn_remove')}
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-500">
                                                Resolved by Admin
                                            </span>
                                        )}
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

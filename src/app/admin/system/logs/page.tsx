'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore'
import { FileText, User, Shield, AlertTriangle, Clock } from 'lucide-react'
import { getRoleColor } from '@/lib/rbac'
import { format } from 'date-fns'
import { th, enUS } from 'date-fns/locale'
import { useLanguage } from '@/contexts/LanguageContext'

interface LogEntry {
    id: string
    adminName: string
    adminRole: string
    action: string
    target: string
    details: string
    ip?: string
    timestamp: Timestamp
    metadata?: any
}

export default function SystemLogsPage() {
    const { t, language } = useLanguage()
    const [logs, setLogs] = useState<LogEntry[]>([])
    const [loading, setLoading] = useState(true)
    const [filterAction, setFilterAction] = useState('ALL')
    const [searchTerm, setSearchTerm] = useState('')
    const [filterRisk, setFilterRisk] = useState('ALL') // ALL, HIGH

    useEffect(() => {
        fetchLogs()
    }, [filterAction, searchTerm, filterRisk])

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const logsRef = collection(db, 'system_logs')
            let q = query(logsRef, orderBy('timestamp', 'desc'), limit(50))

            if (filterAction !== 'ALL') {
                q = query(logsRef, where('action', '==', filterAction), orderBy('timestamp', 'desc'), limit(50))
            }

            const snap = await getDocs(q)
            let data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as LogEntry[]

            // Client-side filtering for Search and Risk (since Firestore complex queries require composite indexes)
            if (searchTerm) {
                const lower = searchTerm.toLowerCase()
                data = data.filter(l =>
                    l.adminName.toLowerCase().includes(lower) ||
                    l.target.toLowerCase().includes(lower) ||
                    l.details.toLowerCase().includes(lower) ||
                    (l.ip && l.ip.includes(lower))
                )
            }

            if (filterRisk === 'HIGH') {
                data = data.filter(l => isHighRisk(l.action))
            }

            setLogs(data)
        } catch (error) {
            console.error('Error fetching logs:', error)
        } finally {
            setLoading(false)
        }
    }

    const getActionColor = (action: string) => {
        if (action.startsWith('ai.')) return 'text-blue-600 bg-blue-100'
        switch (action) {
            case 'USER_BAN': return 'text-red-700 bg-red-100 border border-red-200'
            case 'USER_UNBAN': return 'text-yellow-700 bg-yellow-100 border border-yellow-200'
            case 'SELLER_VERIFY': return 'text-green-700 bg-green-100 border border-green-200'
            case 'SELLER_REJECT': return 'text-orange-700 bg-orange-100 border border-orange-200'
            case 'SYSTEM_UPDATE_ROLE': return 'text-purple-700 bg-purple-100 border border-purple-200 font-bold'
            case 'SETTINGS_UPDATE': return 'text-blue-700 bg-blue-100 border border-blue-200'
            case 'FINANCE_APPROVE': return 'text-emerald-700 bg-emerald-100 border border-emerald-200'
            case 'FINANCE_REJECT': return 'text-rose-700 bg-rose-100 border border-rose-200'
            default: return 'text-gray-600 bg-gray-100 border border-gray-200'
        }
    }

    const isHighRisk = (action: string) => {
        return ['USER_BAN', 'SYSTEM_UPDATE_ROLE', 'SETTINGS_UPDATE', 'FINANCE_REJECT'].includes(action)
    }

    const getActionIcon = (action: string) => {
        if (action.startsWith('ai.')) return <Shield className="w-4 h-4" />
        switch (action) {
            case 'USER_BAN': return <AlertTriangle className="w-3.5 h-3.5" />
            case 'SYSTEM_UPDATE_ROLE': return <Shield className="w-3.5 h-3.5" />
            case 'SETTINGS_UPDATE': return <Shield className="w-3.5 h-3.5" />
            case 'FINANCE_APPROVE': return <FileText className="w-3.5 h-3.5" />
            default: return <FileText className="w-3.5 h-3.5" />
        }
    }

    const getLogDetails = (details: string) => {
        if (details.includes('Approved withdrawal')) return t('admin.log_detail_approved_withdrawal')
        if (details === 'Documents verified') return t('admin.log_detail_docs_verified')
        if (details === 'Promoted to Manager') return t('admin.log_detail_promoted_manager')
        if (details === 'Spamming detected') return t('admin.log_detail_spam_detected')

        if (details.includes('Rejected:')) {
            const reason = details.split(':')[1].trim()
            const localizedReason = reason === 'Invalid Bank Info' ? t('admin.log_detail_invalid_bank') : reason
            return `${t('admin.log_detail_rejected')}: ${localizedReason}`
        }

        if (details.includes('Updated settings:')) {
            return `${t('admin.log_detail_updated_settings')}: ${details.split(':')[1]}`
        }

        return details
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <FileText className="w-8 h-8 text-purple-600" />
                            {t('admin.menu_system_logs')}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {t('admin.system_modules_desc')}
                        </p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('admin.search_placeholder') || 'Search...'}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-purple-500 w-full md:w-64"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute left-3 top-2.5 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        <select
                            className="px-4 py-2 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
                            value={filterRisk}
                            onChange={(e) => setFilterRisk(e.target.value)}
                        >
                            <option value="ALL">{t('admin.filter_risk_all')}</option>
                            <option value="HIGH">⚠️ {t('admin.filter_risk_high')}</option>
                        </select>

                        <select
                            className="px-4 py-2 border border-gray-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 outline-none focus:ring-2 focus:ring-purple-500"
                            value={filterAction}
                            onChange={(e) => setFilterAction(e.target.value)}
                        >
                            <option value="ALL">{t('admin.filter_action_all')}</option>
                            <option value="AI_ACTIONS">{t('admin.action_ai_actions')}</option>
                            <option value="USER_BAN">{t('admin.action_user_ban')}</option>
                            <option value="USER_UNBAN">{t('admin.action_user_unban')}</option>
                            <option value="SELLER_VERIFY">{t('admin.action_seller_verify')}</option>
                            <option value="SYSTEM_UPDATE_ROLE">{t('admin.action_role_update')}</option>
                        </select>

                        <button
                            onClick={async () => {
                                const { addDoc, collection, serverTimestamp } = await import('firebase/firestore')
                                const { db } = await import('@/lib/firebase')
                                const logs = [
                                    { action: 'USER_BAN', target: 'User: spammer@test.com', details: 'Spamming detected', adminName: 'Test Admin', adminRole: 'super_admin', ip: '58.97.10.1', timestamp: serverTimestamp() },
                                    { action: 'SYSTEM_UPDATE_ROLE', target: 'User: staff001', details: 'Promoted to Manager', adminName: 'Test Admin', adminRole: 'super_admin', ip: '192.168.1.50', timestamp: serverTimestamp() },
                                    { action: 'SELLER_VERIFY', target: 'Shop: Healthy Food', details: 'Documents verified', adminName: 'Test Admin', adminRole: 'admin_manager', ip: '127.0.0.1', timestamp: serverTimestamp() },
                                    { action: 'FINANCE_REJECT', target: 'Payout: #998877', details: 'Rejected: Invalid Bank Info', adminName: 'Finance Staff', adminRole: 'finance_admin', ip: '10.0.0.8', timestamp: serverTimestamp() }
                                ]
                                for (const l of logs) await addDoc(collection(db, 'system_logs'), l)
                                fetchLogs()
                                alert('Generated 4 test logs!')
                            }}
                            className="px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 text-xs font-mono"
                        >
                            + Test Data
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-gray-500 font-bold uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">{t('admin.table_payout_date')}</th>
                                <th className="px-6 py-4">{t('admin.table_log_admin')}</th>
                                <th className="px-6 py-4">{t('admin.table_log_action')}</th>
                                <th className="px-6 py-4">{t('admin.table_log_target')}</th>
                                <th className="px-6 py-4">{t('admin.table_log_ip')}</th>
                                <th className="px-6 py-4">{t('admin.table_log_details')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {logs.map(log => (
                                <tr key={log.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${isHighRisk(log.action) ? 'bg-red-50/30 dark:bg-red-900/10' : ''}`}>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            {log.timestamp ? format(log.timestamp.toDate(), 'dd/MM/yy HH:mm', { locale: language === 'th' ? th : enUS }) : '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                                <User className="w-3 h-3" />
                                                {log.adminName}
                                            </div>
                                            <div className="text-xs mt-1">
                                                <span className={`px-2 py-0.5 rounded-full bg-${getRoleColor(log.adminRole as any)}-100 text-${getRoleColor(log.adminRole as any)}-700`}>
                                                    {log.adminRole}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap ${getActionColor(log.action)}`}>
                                            {getActionIcon(log.action)}
                                            {t(`admin.log_action_${log.action.toLowerCase()}`) || log.action}
                                        </div>
                                        {isHighRisk(log.action) && (
                                            <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-white dark:bg-gray-800 text-red-600 border border-red-200 dark:border-red-800 uppercase tracking-wide">
                                                {t('admin.badge_risk')}
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-600 dark:text-gray-400">
                                        {log.target.includes('Payout:') ?
                                            `${t('admin.log_target_payout')} ID: #${log.target.split(':')[1].substring(0, 8)}...` :
                                            log.target === 'System Config' ? t('admin.log_target_system_config') :
                                                log.target}
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                        {log.ip || '127.0.0.1'}
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate text-gray-600 dark:text-gray-400" title={log.details}>
                                        {getLogDetails(log.details)}
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        {t('common.no_data')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {loading && (
                        <div className="p-12 text-center text-gray-400 animate-pulse">
                            {t('common.loading')}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    )
}

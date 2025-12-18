'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, getDocs, where, Timestamp } from 'firebase/firestore'
import { Shield, Smartphone, Monitor, Globe, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react'
import { format } from 'date-fns'
import { th, enUS } from 'date-fns/locale'
import { useLanguage } from '@/contexts/LanguageContext'
import { UserAccessLog } from '@/types/security'

export default function SecurityLogsPage() {
    const { t, language } = useLanguage()
    const [logs, setLogs] = useState<UserAccessLog[]>([])
    const [loading, setLoading] = useState(true)
    const [filterStatus, setFilterStatus] = useState('ALL')

    useEffect(() => {
        fetchLogs()
    }, [filterStatus])

    const fetchLogs = async () => {
        setLoading(true)
        try {
            const logsRef = collection(db, 'user_access_logs')
            let q = query(logsRef, orderBy('timestamp', 'desc'), limit(50))

            if (filterStatus !== 'ALL') {
                q = query(logsRef, where('status', '==', filterStatus), orderBy('timestamp', 'desc'), limit(50))
            }

            const snap = await getDocs(q)
            const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as UserAccessLog[]
            setLogs(data)
        } catch (error) {
            console.error('Error fetching security logs:', error)
        } finally {
            setLoading(false)
        }
    }

    const getDeviceIcon = (type: string) => {
        switch (type) {
            case 'mobile': return <Smartphone className="w-4 h-4 text-gray-500" />
            case 'desktop': return <Monitor className="w-4 h-4 text-gray-500" />
            default: return <Globe className="w-4 h-4 text-gray-500" />
        }
    }

    const getStatusIcon = (status: string) => {
        return status === 'SUCCESS'
            ? <CheckCircle className="w-4 h-4 text-green-500" />
            : <XCircle className="w-4 h-4 text-red-500" />
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Shield className="w-8 h-8 text-blue-600" />
                            {t('admin.security_page_title')}
                        </h1>
                        <p className="text-gray-500 mt-1">
                            {t('admin.security_page_desc')}
                        </p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 text-gray-500 font-bold uppercase tracking-wider text-xs">
                            <tr>
                                <th className="px-6 py-4">{t('admin.table_security_time')}</th>
                                <th className="px-6 py-4">{t('admin.table_security_event')}</th>
                                <th className="px-6 py-4">{t('admin.table_security_user')}</th>
                                <th className="px-6 py-4">{t('admin.table_security_device')}</th>
                                <th className="px-6 py-4">{t('admin.table_security_status')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {logs.map(log => (
                                <tr key={log.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${log.status === 'FAILURE' ? 'bg-red-50/50 dark:bg-red-900/10' : ''}`}>
                                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            {log.timestamp ? format(log.timestamp.toDate(), 'dd/MM/yy HH:mm:ss', { locale: language === 'th' ? th : enUS }) : '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {log.action}
                                        </div>
                                        {log.reason && (
                                            <div className="text-xs text-red-500 mt-0.5">
                                                {t(`admin.security_reason_${log.reason.toLowerCase().replace(/ /g, '_')}`) || log.reason}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900 dark:text-white font-mono text-xs">
                                            UID: {log.userId.substring(0, 8)}...
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono mt-1">
                                            IP: {log.ip_address}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                                            {getDeviceIcon(log.device_info.device_type)}
                                            <span className="truncate max-w-[150px]" title={log.user_agent}>
                                                {log.device_info.browser} on {log.device_info.os}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${log.status === 'SUCCESS'
                                                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                                : 'bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400'
                                            }`}>
                                            {getStatusIcon(log.status)}
                                            {log.status === 'SUCCESS' ? t('admin.security_login_success') : t('admin.log_detail_rejected')}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {logs.length === 0 && !loading && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
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

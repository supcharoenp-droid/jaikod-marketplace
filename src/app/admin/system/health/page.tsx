'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import {
    Activity, Server, Database, Globe,
    CheckCircle, AlertTriangle, XCircle, RefreshCw
} from 'lucide-react'
import { getSystemLogs, SystemLog } from '@/lib/monitor/system-monitor'

interface HealthStatus {
    api: 'ok' | 'degraded' | 'down'
    db: 'ok' | 'down'
    latency: number
    lastCheck: string
}

export default function SystemHealthPage() {
    const { t } = useLanguage()

    // Live Status
    const [status, setStatus] = useState<HealthStatus>({
        api: 'ok',
        db: 'ok',
        latency: 0,
        lastCheck: '-'
    })

    // Logs
    const [logs, setLogs] = useState<SystemLog[]>([])
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(false)

    // Manual Ping
    const runHealthCheck = async () => {
        setChecking(true)
        try {
            const start = Date.now()
            const res = await fetch('/api/health') // Call our own API
            const data = await res.json()
            const duration = Date.now() - start // Total roundtrip

            if (res.ok && data.status === 'ok') {
                setStatus({
                    api: duration > 1000 ? 'degraded' : 'ok',
                    db: 'ok',
                    latency: duration,
                    lastCheck: new Date().toLocaleTimeString()
                })
            } else {
                setStatus(prev => ({ ...prev, api: 'down', db: 'down', lastCheck: new Date().toLocaleTimeString() }))
            }
        } catch (e) {
            console.error(e)
            setStatus(prev => ({ ...prev, api: 'down', db: 'down', lastCheck: new Date().toLocaleTimeString() }))
        } finally {
            setChecking(false)
        }
    }

    // Load Errors
    const fetchLogs = async () => {
        setLoading(true)
        const data = await getSystemLogs()
        setLogs(data)
        setLoading(false)
    }

    useEffect(() => {
        runHealthCheck()
        fetchLogs()
    }, [])

    const getStatusColor = (s: string) => {
        if (s === 'ok') return 'text-green-500 bg-green-50 dark:bg-green-900/30 border-green-200'
        if (s === 'degraded') return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200'
        return 'text-red-500 bg-red-50 dark:bg-red-900/30 border-red-200'
    }

    const getStatusIcon = (s: string) => {
        if (s === 'ok') return <CheckCircle className="w-5 h-5" />
        if (s === 'degraded') return <AlertTriangle className="w-5 h-5" />
        return <XCircle className="w-5 h-5" />
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity className="w-8 h-8 text-cyan-500" />
                            {t('admin.health_title')}
                        </h1>
                        <p className="text-gray-500">{t('admin.health_desc')}</p>
                    </div>
                    <button
                        onClick={() => { runHealthCheck(); fetchLogs(); }}
                        disabled={checking}
                        className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} />
                        {t('admin.health_btn_ping')}
                    </button>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Overall API */}
                    <div className={`p-6 rounded-xl border ${getStatusColor(status.api)} flex flex-col items-center justify-center text-center`}>
                        <Server className="w-8 h-8 mb-2 opacity-80" />
                        <h3 className="font-bold text-lg">API Service</h3>
                        <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(status.api)}
                            <span className="capitalize">{status.api}</span>
                        </div>
                    </div>

                    {/* Database */}
                    <div className={`p-6 rounded-xl border ${getStatusColor(status.db)} flex flex-col items-center justify-center text-center`}>
                        <Database className="w-8 h-8 mb-2 opacity-80" />
                        <h3 className="font-bold text-lg">{t('admin.health_metric_db')}</h3>
                        <div className="flex items-center gap-2 mt-1">
                            {getStatusIcon(status.db)}
                            <span className="capitalize">{status.db}</span>
                        </div>
                    </div>

                    {/* Latency */}
                    <div className="p-6 rounded-xl border bg-white dark:bg-gray-800 dark:border-gray-700 flex flex-col items-center justify-center text-center">
                        <Activity className="w-8 h-8 mb-2 text-blue-500" />
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">{t('admin.health_metric_api')}</h3>
                        <div className="flex items-center gap-2 mt-1 text-2xl font-mono text-blue-600 dark:text-blue-400">
                            {status.latency} <span className="text-sm text-gray-500">ms</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2">
                            {t('admin.health_last_check')}: {status.lastCheck}
                        </div>
                    </div>
                </div>

                {/* Logs Table */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200">System Logs & Errors</h3>
                    </div>
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500">
                            <tr>
                                <th className="px-6 py-4 w-32">{t('admin.health_log_level')}</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">{t('admin.health_log_msg')}</th>
                                <th className="px-6 py-4 w-48 text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan={4} className="text-center py-8">{t('common.loading')}</td></tr>
                            ) : logs.length === 0 ? (
                                <tr><td colSpan={4} className="text-center py-12 text-gray-400">System is healthy. No critical logs found.</td></tr>
                            ) : logs.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold
                                            ${log.level === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                                                log.level === 'ERROR' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-yellow-100 text-yellow-700'}
                                        `}>
                                            {log.level}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs">{log.type}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-white">{log.message}</div>
                                        {log.details && <div className="text-xs text-gray-500 mt-1">{log.details}</div>}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-500 text-xs">
                                        {log.timestamp?.toDate().toLocaleString()}
                                    </td>
                                </div>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    )
}

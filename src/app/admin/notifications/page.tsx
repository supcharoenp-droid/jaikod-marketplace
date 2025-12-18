'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AdminLayout from '@/components/admin/AdminLayout'
import {
    Bell, Check, Settings, ShieldAlert,
    ShoppingBag, User, Info, Megaphone, Trash2, Filter
} from 'lucide-react'
import { useAdmin } from '@/contexts/AdminContext'
import {
    getAdminNotifications,
    markNotificationAsRead,
    markAllAsRead,
    enableNotifications,
    disableNotifications,
    isNotificationEnabled,
    seedMockNotifications
} from '@/lib/admin/notification-service'
import { AdminNotification, AlertType, ALERT_TYPE_LABELS } from '@/types/admin-notification'
import { formatDistanceToNow, format } from 'date-fns'
import { th } from 'date-fns/locale'

export default function NotificationsPage() {
    const { adminUser } = useAdmin()
    const [enabled, setEnabled] = useState(false)
    const [notifications, setNotifications] = useState<AdminNotification[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<'all' | 'unread'>('all')

    useEffect(() => {
        loadData()
    }, [filter])

    const loadData = async () => {
        setLoading(true)
        const isEnabled = await isNotificationEnabled()
        setEnabled(isEnabled)

        if (isEnabled) {
            const list = await getAdminNotifications(50, filter === 'unread')
            setNotifications(list)
        } else {
            setNotifications([])
        }
        setLoading(false)
    }

    const handleToggleSystem = async () => {
        if (!adminUser) return
        if (enabled) {
            if (confirm('ยืนยันปิดการใช้งานระบบแจ้งเตือน?')) {
                await disableNotifications(adminUser)
            }
        } else {
            await enableNotifications(adminUser)
        }
        loadData()
        // Force reload to update Layout header state
        window.location.reload()
    }

    const handleRead = async (id: string) => {
        if (!adminUser) return
        await markNotificationAsRead(adminUser, id)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    }

    const handleMarkAll = async () => {
        if (!adminUser) return
        if (confirm('ยืนยันอ่านทั้งหมด?')) {
            await markAllAsRead(adminUser)
            loadData()
        }
    }

    const handleSeed = async () => {
        await seedMockNotifications()
        loadData()
        alert('Seed Data Added! (If system is enabled)')
    }

    const getIcon = (type: AlertType) => {
        switch (type) {
            case 'user': return <User className="w-5 h-5 text-blue-500" />
            case 'content': return <ShieldAlert className="w-5 h-5 text-red-500" />
            case 'transaction': return <ShoppingBag className="w-5 h-5 text-green-500" />
            case 'system': return <Settings className="w-5 h-5 text-gray-500" />
            case 'announcement': return <Megaphone className="w-5 h-5 text-pink-500" />
            default: return <Info className="w-5 h-5" />
        }
    }

    const getSeverityColor = (sev: string) => {
        switch (sev) {
            case 'danger': return 'bg-red-50 border-red-200 text-red-700'
            case 'warning': return 'bg-yellow-50 border-yellow-200 text-yellow-700'
            case 'success': return 'bg-green-50 border-green-200 text-green-700'
            default: return 'bg-white border-gray-200 text-gray-600'
        }
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Bell className="w-8 h-8 text-pink-600" />
                            ศูนย์การแจ้งเตือน (Notification Center)
                        </h1>
                        <p className="text-gray-500 mt-1">
                            จัดการการแจ้งเตือนทั้งหมดของระบบ
                        </p>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Toggle Switch */}
                        <div className="flex items-center gap-2 mr-4 bg-gray-100 p-2 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">สถานะระบบ:</span>
                            <button
                                onClick={handleToggleSystem}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                            >
                                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
                            </button>
                            <span className={`text-sm font-bold ${enabled ? 'text-green-600' : 'text-gray-500'}`}>
                                {enabled ? 'ON' : 'OFF'}
                            </span>
                        </div>

                        {enabled && (
                            <>
                                <button onClick={handleSeed} className="text-xs text-gray-400 hover:text-gray-600 mr-2">Seed Data</button>
                                <button
                                    onClick={handleMarkAll}
                                    className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50"
                                >
                                    <Check className="w-4 h-4" /> อ่านทั้งหมด
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {!enabled ? (
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-12 text-center border-2 border-dashed border-gray-300 dark:border-gray-700">
                        <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-gray-600 dark:text-gray-300">ระบบแจ้งเตือนถูกปิดใช้งาน</h2>
                        <p className="text-gray-500 mt-2 mb-6">คุณสามารถเปิดใช้งานได้ที่ปุ่มด้านบนขวา</p>
                        <button
                            onClick={handleToggleSystem}
                            className="bg-pink-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-pink-700 shadow-lg"
                        >
                            เปิดใช้งานการแจ้งเตือน
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Filters */}
                        <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700 pb-1">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${filter === 'all' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                ทั้งหมด
                            </button>
                            <button
                                onClick={() => setFilter('unread')}
                                className={`px-4 py-2 text-sm font-bold border-b-2 transition-colors ${filter === 'unread' ? 'border-pink-600 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                ยังไม่ได้อ่าน
                            </button>
                        </div>

                        {/* List */}
                        <div className="space-y-4">
                            {notifications.length === 0 && !loading && (
                                <div className="text-center py-12 text-gray-500">
                                    ไม่มีรายการแจ้งเตือน
                                </div>
                            )}

                            {notifications.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => handleRead(item.id)}
                                    className={`relative flex items-start gap-4 p-6 rounded-xl border cursor-pointer transition-all hover:shadow-md ${item.is_read
                                        ? 'bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700 opacity-75'
                                        : 'bg-white border-l-4 border-l-pink-500 border-y-gray-200 border-r-gray-200 shadow-sm'
                                        }`}
                                >
                                    <div className={`p-3 rounded-full flex-shrink-0 ${item.is_read ? 'bg-gray-100' : 'bg-blue-50'}`}>
                                        {getIcon(item.type)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${getSeverityColor(item.severity)}`}>
                                                        {item.severity}
                                                    </span>
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        {ALERT_TYPE_LABELS[item.type]}
                                                    </span>
                                                </div>
                                                <h3 className={`text-lg mb-1 ${item.is_read ? 'font-medium text-gray-700' : 'font-bold text-gray-900'}`}>
                                                    {item.title}
                                                </h3>
                                            </div>
                                            <span className="text-xs text-gray-400 whitespace-nowrap ml-4">
                                                {format(item.created_at, 'dd MMM HH:mm')}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm mb-3">
                                            {item.message}
                                        </p>
                                        {item.link && (
                                            <Link
                                                href={item.link}
                                                className="text-sm font-bold text-pink-600 hover:underline"
                                                onClick={(e) => e.stopPropagation()}
                                            >
                                                ดูรายละเอียด →
                                            </Link>
                                        )}
                                    </div>
                                    {!item.is_read && (
                                        <div className="absolute top-6 right-6 w-3 h-3 bg-red-500 rounded-full"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </AdminLayout>
    )
}

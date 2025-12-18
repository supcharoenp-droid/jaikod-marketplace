'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Check, Settings, ShieldAlert, ShoppingBag, User, Info, Megaphone, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { useAdmin } from '@/contexts/AdminContext'
import {
    getAdminNotifications,
    getUnreadNotificationCount,
    markNotificationAsRead,
    markAllAsRead,
    isNotificationEnabled,
    seedMockNotifications,
    createAdminNotification
} from '@/lib/admin/notification-service'
import { AdminNotification, AlertType } from '@/types/admin-notification'
import { formatDistanceToNow } from 'date-fns'
import { th } from 'date-fns/locale'

export default function NotificationCenter() {
    const { adminUser } = useAdmin()
    const [enabled, setEnabled] = useState(false)
    const [count, setCount] = useState(0)
    const [notifications, setNotifications] = useState<AdminNotification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        checkStatus()
        // Poll every 60s
        const interval = setInterval(checkStatus, 60000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const checkStatus = async () => {
        const isEnabled = await isNotificationEnabled()
        setEnabled(isEnabled)
        if (isEnabled) {
            updateData()
        } else {
            setCount(0)
            setNotifications([])
        }
    }

    const updateData = async () => {
        const c = await getUnreadNotificationCount()
        setCount(c)
        // Only fetch list if open to save reads? Or pre-fetch? Let's fetch on open or mount
    }

    const handleOpen = async () => {
        setIsOpen(!isOpen)
        if (!isOpen && enabled) {
            setLoading(true)
            const list = await getAdminNotifications(10)
            setNotifications(list)
            updateData()
            setLoading(false)
        }
    }

    const handleRead = async (id: string) => {
        if (!adminUser) return
        await markNotificationAsRead(adminUser, id)
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
        setCount(prev => Math.max(0, prev - 1))
    }

    const handleMarkAllRead = async () => {
        if (!adminUser) return
        await markAllAsRead(adminUser)
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        setCount(0)
    }

    if (!enabled) {
        // Disabled State: Show Bell with strikethrough or grayed out?
        // User asked for "disabled state" but "prepare structure".
        // Let's show a "Disabled" bell.
        return (
            <div className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 opacity-50 cursor-not-allowed group">
                <Bell className="w-5 h-5 text-gray-400" />
                <div className="absolute hidden group-hover:block top-10 right-0 w-48 bg-black text-white text-xs p-2 rounded shadow-lg z-50 text-center">
                    ระบบแจ้งเตือนปิดใช้งานอยู่
                </div>
            </div>
        )
    }

    const getIcon = (type: AlertType) => {
        switch (type) {
            case 'user': return <User className="w-4 h-4 text-blue-500" />
            case 'content': return <ShieldAlert className="w-4 h-4 text-red-500" />
            case 'transaction': return <ShoppingBag className="w-4 h-4 text-green-500" />
            case 'system': return <Settings className="w-4 h-4 text-gray-500" />
            case 'announcement': return <Megaphone className="w-4 h-4 text-pink-500" />
            default: return <Info className="w-4 h-4" />
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={handleOpen}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
                <Bell className={`w-5 h-5 ${isOpen ? 'text-pink-600' : 'text-gray-600 dark:text-gray-300'}`} />
                {count > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse ring-2 ring-white dark:ring-gray-800"></span>
                )}
            </button>

            {isOpen && (
                <div className="absolute top-12 right-0 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                        <h3 className="font-bold text-gray-900 dark:text-white">การแจ้งเตือน</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={handleMarkAllRead}
                                className="text-xs text-pink-600 hover:text-pink-700 font-medium px-2 py-1 rounded hover:bg-pink-50 dark:hover:bg-pink-900/20"
                            >
                                อ่านทั้งหมด
                            </button>
                            <Link
                                href="/admin/notifications"
                                onClick={() => setIsOpen(false)}
                                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
                            >
                                ดูทั้งหมด
                            </Link>
                        </div>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400 text-sm">กำลังโหลด...</div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-400 text-sm flex flex-col items-center gap-2">
                                <Bell className="w-8 h-8 opacity-20" />
                                <span>ไม่มีการแจ้งเตือนใหม่</span>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                {notifications.map(item => (
                                    <div
                                        key={item.id}
                                        onClick={() => handleRead(item.id)}
                                        className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer flex gap-3 ${!item.is_read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}
                                    >
                                        <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700`}>
                                            {getIcon(item.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <p className={`text-sm ${!item.is_read ? 'font-bold text-gray-900 dark:text-gray-100' : 'font-medium text-gray-600 dark:text-gray-400'}`}>
                                                    {item.title}
                                                </p>
                                                {!item.is_read && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5"></div>}
                                            </div>
                                            <p className="text-xs text-gray-500 line-clamp-2 mb-1">
                                                {item.message}
                                            </p>
                                            <span className="text-[10px] text-gray-400">
                                                {formatDistanceToNow(item.created_at, { addSuffix: true, locale: th })}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

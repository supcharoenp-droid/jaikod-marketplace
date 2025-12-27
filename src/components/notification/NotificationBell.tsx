'use client'

/**
 * NOTIFICATION BELL COMPONENT
 * 
 * Shows notification badge in header with dropdown
 */

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Bell, Check, CheckCheck, Trash2, MessageCircle, Package, Tag, Info } from 'lucide-react'
import { useNotifications, Notification } from '@/contexts/NotificationContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function NotificationBell() {
    const { notifications, unreadCount, markAsRead, markAllAsRead, loading } = useNotifications()
    const { language } = useLanguage()
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef<HTMLDivElement>(null)
    const lang = language as 'th' | 'en'

    // Translations
    const t = {
        notifications: lang === 'th' ? 'การแจ้งเตือน' : 'Notifications',
        markAllRead: lang === 'th' ? 'อ่านทั้งหมด' : 'Mark all read',
        noNotifications: lang === 'th' ? 'ไม่มีการแจ้งเตือน' : 'No notifications',
        viewAll: lang === 'th' ? 'ดูทั้งหมด' : 'View All',
        justNow: lang === 'th' ? 'เมื่อสักครู่' : 'Just now',
        minutesAgo: lang === 'th' ? 'นาทีที่แล้ว' : 'minutes ago',
        hoursAgo: lang === 'th' ? 'ชั่วโมงที่แล้ว' : 'hours ago',
        daysAgo: lang === 'th' ? 'วันที่แล้ว' : 'days ago',
    }

    // Close on outside click
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Format time ago
    const formatTimeAgo = (date: Date) => {
        const now = new Date()
        const diff = now.getTime() - new Date(date).getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return t.justNow
        if (minutes < 60) return `${minutes} ${t.minutesAgo}`
        if (hours < 24) return `${hours} ${t.hoursAgo}`
        return `${days} ${t.daysAgo}`
    }

    // Get icon by type
    const getNotificationIcon = (type: Notification['type']) => {
        switch (type) {
            case 'message':
            case 'MESSAGE':
                return <MessageCircle className="w-4 h-4 text-blue-400" />
            case 'order':
            case 'ORDER_UPDATE':
                return <Package className="w-4 h-4 text-green-400" />
            case 'promotion':
            case 'PROMOTION':
                return <Tag className="w-4 h-4 text-orange-400" />
            default:
                return <Info className="w-4 h-4 text-gray-400" />
        }
    }

    // Handle notification click
    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.isRead) {
            await markAsRead(notification.id)
        }
        setIsOpen(false)
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-slate-700/50"
                aria-label={t.notifications}
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 md:w-96 bg-slate-800 rounded-xl border border-slate-700 shadow-2xl z-50 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/80">
                        <h3 className="text-white font-semibold flex items-center gap-2">
                            <Bell className="w-4 h-4" />
                            {t.notifications}
                            {unreadCount > 0 && (
                                <span className="px-2 py-0.5 bg-red-500/20 text-red-400 text-xs rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                {t.markAllRead}
                            </button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-[400px] overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center">
                                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                                <p className="text-gray-500">{t.noNotifications}</p>
                            </div>
                        ) : (
                            notifications.slice(0, 10).map((notification) => (
                                <Link
                                    key={notification.id}
                                    href={notification.link || notification.actionUrl || '/notifications'}
                                    onClick={() => handleNotificationClick(notification)}
                                    className={`block px-4 py-3 border-b border-slate-700/50 hover:bg-slate-700/50 transition-colors ${!notification.isRead ? 'bg-purple-500/5' : ''
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        {/* Icon */}
                                        <div className={`mt-1 p-2 rounded-full ${!notification.isRead ? 'bg-purple-500/20' : 'bg-slate-700'
                                            }`}>
                                            {getNotificationIcon(notification.type)}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0 overflow-hidden">
                                            <p className={`text-sm truncate ${!notification.isRead ? 'text-white font-medium' : 'text-gray-300'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-500 line-clamp-2 mt-0.5 break-words">
                                                {notification.body || notification.message}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">
                                                {formatTimeAgo(notification.createdAt as Date)}
                                            </p>
                                        </div>

                                        {/* Unread dot */}
                                        {!notification.isRead && (
                                            <div className="w-2 h-2 bg-purple-500 rounded-full mt-2" />
                                        )}
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <Link
                            href="/notifications"
                            className="block text-center py-3 text-sm text-purple-400 hover:text-purple-300 hover:bg-slate-700/30 border-t border-slate-700"
                            onClick={() => setIsOpen(false)}
                        >
                            {t.viewAll}
                        </Link>
                    )}
                </div>
            )}
        </div>
    )
}

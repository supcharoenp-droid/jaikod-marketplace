'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
    Bell, Package, MessageCircle, Tag, AlertCircle, CheckCircle2,
    Trash2, Filter, X, ShoppingBag, Store, Heart, TrendingUp,
    Clock, Eye, EyeOff, Loader2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { subscribeToNotifications, markAsRead, deleteNotification, Notification } from '@/lib/notifications'

type NotificationType = 'all' | 'order' | 'message' | 'promotion' | 'system'

const NOTIFICATION_TYPES = [
    { id: 'all', label: 'ทั้งหมด', icon: Bell, color: 'gray' },
    { id: 'order', label: 'คำสั่งซื้อ', icon: Package, color: 'blue' },
    { id: 'message', label: 'ข้อความ', icon: MessageCircle, color: 'green' },
    { id: 'promotion', label: 'โปรโมชั่น', icon: Tag, color: 'purple' },
    { id: 'system', label: 'ระบบ', icon: AlertCircle, color: 'orange' }
] as const

export default function NotificationsPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState<NotificationType>('all')
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

    // Real-time subscription
    useEffect(() => {
        if (!user) {
            router.push('/login')
            return
        }

        const unsubscribe = subscribeToNotifications(user.uid, (notifs) => {
            setNotifications(notifs)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user, router])

    // Filter notifications
    const filteredNotifications = filter === 'all'
        ? notifications
        : notifications.filter(n => n.type === filter)

    // Mark as read
    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await markAsRead(notificationId)
        } catch (error) {
            console.error('Error marking as read:', error)
        }
    }

    // Delete notification
    const handleDelete = async (notificationId: string) => {
        setDeletingIds(prev => new Set(prev).add(notificationId))
        try {
            await deleteNotification(notificationId)
        } catch (error) {
            console.error('Error deleting notification:', error)
            setDeletingIds(prev => {
                const newSet = new Set(prev)
                newSet.delete(notificationId)
                return newSet
            })
        }
    }

    // Mark all as read
    const handleMarkAllAsRead = async () => {
        const unreadNotifs = notifications.filter(n => !n.isRead)
        await Promise.all(unreadNotifs.map(n => markAsRead(n.id)))
    }

    // Get icon for notification type
    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'order': return Package
            case 'message': return MessageCircle
            case 'promotion': return Tag
            case 'system': return AlertCircle
            default: return Bell
        }
    }

    // Get color for notification type
    const getNotificationColor = (type: string) => {
        switch (type) {
            case 'order': return 'blue'
            case 'message': return 'green'
            case 'promotion': return 'purple'
            case 'system': return 'orange'
            default: return 'gray'
        }
    }

    // Format time
    const formatTime = (timestamp: any) => {
        if (!timestamp) return ''
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
        const now = new Date()
        const diff = now.getTime() - date.getTime()
        const minutes = Math.floor(diff / 60000)
        const hours = Math.floor(diff / 3600000)
        const days = Math.floor(diff / 86400000)

        if (minutes < 1) return 'เมื่อสักครู่'
        if (minutes < 60) return `${minutes} นาทีที่แล้ว`
        if (hours < 24) return `${hours} ชั่วโมงที่แล้ว`
        if (days < 7) return `${days} วันที่แล้ว`
        return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })
    }

    const unreadCount = notifications.filter(n => !n.isRead).length

    if (!user) return null

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                                <Bell className="w-7 h-7 text-purple-600" />
                                การแจ้งเตือน
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {unreadCount > 0 ? `${unreadCount} รายการที่ยังไม่ได้อ่าน` : 'ไม่มีการแจ้งเตือนใหม่'}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={handleMarkAllAsRead}
                                className="px-4 py-2 text-sm font-medium text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors flex items-center gap-2"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                อ่านทั้งหมด
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        {NOTIFICATION_TYPES.map(type => {
                            const Icon = type.icon
                            const count = type.id === 'all'
                                ? notifications.length
                                : notifications.filter(n => n.type === type.id).length
                            const isActive = filter === type.id

                            return (
                                <button
                                    key={type.id}
                                    onClick={() => setFilter(type.id as NotificationType)}
                                    className={`
                                        flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all
                                        ${isActive
                                            ? `bg-${type.color}-100 dark:bg-${type.color}-900/30 text-${type.color}-700 dark:text-${type.color}-400 ring-2 ring-${type.color}-500/50`
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                        }
                                    `}
                                >
                                    <Icon className="w-4 h-4" />
                                    {type.label}
                                    {count > 0 && (
                                        <span className={`
                                            px-2 py-0.5 rounded-full text-xs font-bold
                                            ${isActive
                                                ? `bg-${type.color}-200 dark:bg-${type.color}-800 text-${type.color}-800 dark:text-${type.color}-200`
                                                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                                            }
                                        `}>
                                            {count}
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="container mx-auto px-4 py-6">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
                        <p className="text-gray-600 dark:text-gray-400">กำลังโหลดการแจ้งเตือน...</p>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Bell className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                            ไม่มีการแจ้งเตือน
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
                            {filter === 'all'
                                ? 'คุณไม่มีการแจ้งเตือนในขณะนี้'
                                : `ไม่มีการแจ้งเตือนประเภท "${NOTIFICATION_TYPES.find(t => t.id === filter)?.label}"`
                            }
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <AnimatePresence mode="popLayout">
                            {filteredNotifications.map((notification) => {
                                const Icon = getNotificationIcon(notification.type)
                                const color = getNotificationColor(notification.type)
                                const isDeleting = deletingIds.has(notification.id)

                                return (
                                    <motion.div
                                        key={notification.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        layout
                                        className={`
                                            bg-white dark:bg-gray-800 rounded-xl border transition-all
                                            ${notification.isRead
                                                ? 'border-gray-200 dark:border-gray-700'
                                                : 'border-purple-200 dark:border-purple-800 ring-2 ring-purple-500/20'
                                            }
                                            ${isDeleting ? 'opacity-50' : ''}
                                        `}
                                    >
                                        <div className="p-4">
                                            <div className="flex gap-4">
                                                {/* Icon */}
                                                <div className={`
                                                    w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                                                    bg-${color}-100 dark:bg-${color}-900/30
                                                `}>
                                                    <Icon className={`w-6 h-6 text-${color}-600 dark:text-${color}-400`} />
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4 mb-1">
                                                        <h3 className={`
                                                            font-bold text-gray-900 dark:text-white
                                                            ${!notification.isRead ? 'font-extrabold' : ''}
                                                        `}>
                                                            {notification.title}
                                                        </h3>
                                                        {!notification.isRead && (
                                                            <span className="w-2 h-2 bg-purple-600 rounded-full flex-shrink-0 mt-2" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {formatTime(notification.createdAt)}
                                                        </span>
                                                        <span className={`
                                                            px-2 py-0.5 rounded-full font-medium
                                                            bg-${color}-100 dark:bg-${color}-900/30 text-${color}-700 dark:text-${color}-400
                                                        `}>
                                                            {NOTIFICATION_TYPES.find(t => t.id === notification.type)?.label}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Actions */}
                                                <div className="flex flex-col gap-2">
                                                    {!notification.isRead && (
                                                        <button
                                                            onClick={() => handleMarkAsRead(notification.id)}
                                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                            title="ทำเครื่องหมายว่าอ่านแล้ว"
                                                        >
                                                            <Eye className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDelete(notification.id)}
                                                        disabled={isDeleting}
                                                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                                                        title="ลบ"
                                                    >
                                                        {isDeleting ? (
                                                            <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                                                        ) : (
                                                            <Trash2 className="w-4 h-4 text-red-600" />
                                                        )}
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Action Link */}
                                            {notification.actionUrl && (
                                                <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                                                    <a
                                                        href={notification.actionUrl}
                                                        className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 dark:text-purple-400 dark:hover:text-purple-300"
                                                    >
                                                        {notification.actionText || 'ดูรายละเอียด'}
                                                        <TrendingUp className="w-4 h-4" />
                                                    </a>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}

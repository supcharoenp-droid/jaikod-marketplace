'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Bell, MapPin, TrendingUp, Zap, MessageCircle,
    ShoppingBag, Tag, Check, CheckCheck, Sparkles
} from 'lucide-react'
import { Notification, markAllNotificationsAsRead, markNotificationAsRead } from '@/lib/notifications'

// formatting helper since date-fns is not installed
function formatTimeAgo(date: Date) {
    if (!date) return ''
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)

    if (diffInSeconds < 60) return 'เมื่อสักครู่'
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} นาทีที่แล้ว`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} ชั่วโมงที่แล้ว`
    return `${Math.floor(diffInSeconds / 86400)} วันที่แล้ว`
}

interface NotificationCenterProps {
    notifications: Notification[]
    onClose: () => void
    userId: string
}

export default function NotificationCenter({ notifications, onClose, userId }: NotificationCenterProps) {
    const [activeTab, setActiveTab] = useState<'all' | 'offers' | 'activity'>('all')

    const filteredNotifications = notifications.filter(n => {
        if (activeTab === 'all') return true
        if (activeTab === 'offers') return ['PROMOTION', 'INTEREST', 'GEO'].includes(n.type)
        if (activeTab === 'activity') return ['MESSAGE', 'ORDER_UPDATE', 'SELLER', 'SYSTEM'].includes(n.type)
        return true
    })

    const handleMarkAllRead = async () => {
        await markAllNotificationsAsRead(userId)
    }

    const handleRead = async (n: Notification) => {
        if (!n.isRead) {
            markNotificationAsRead(n.id)
        }
        if (n.link) {
            window.location.href = n.link // Simple nav for now
        }
        onClose()
    }

    return (
        <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200 origin-top-right">

            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800">
                <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Bell className="w-4 h-4 text-neon-purple" />
                    การแจ้งเตือน
                </h3>
                <button
                    onClick={handleMarkAllRead}
                    className="text-xs text-gray-500 hover:text-neon-purple flex items-center gap-1 transition-colors"
                    title="อ่านทั้งหมด"
                >
                    <CheckCheck className="w-3 h-3" /> อ่านครบ
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-100 dark:border-gray-700">
                <TabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')} label="ทั้งหมด" />
                <TabButton active={activeTab === 'offers'} onClick={() => setActiveTab('offers')} label="โปรโมชั่น" />
                <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')} label="อัปเดต" />
            </div>

            {/* List */}
            <div className="max-h-[400px] overflow-y-auto scrollbar-thin">
                {filteredNotifications.length === 0 ? (
                    <div className="py-12 text-center text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
                            <Bell className="w-8 h-8 opacity-20" />
                        </div>
                        <p className="text-sm">ไม่มีการแจ้งเตือนในหน้านี้</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50 dark:divide-gray-700/50">
                        {filteredNotifications.map(notification => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onClick={() => handleRead(notification)}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-2 text-center border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                <Link href="/notifications" className="text-xs text-gray-500 hover:text-neon-purple font-medium">
                    ดูประวัติทั้งหมด
                </Link>
            </div>
        </div>
    )
}

function TabButton({ active, onClick, label }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex-1 py-3 text-sm font-medium transition-colors relative ${active ? 'text-neon-purple' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                }`}
        >
            {label}
            {active && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-neon-purple mx-8 rounded-t-full" />
            )}
        </button>
    )
}

function NotificationItem({ notification, onClick }: { notification: Notification, onClick: () => void }) {
    const isUnread = !notification.isRead

    // Icon Logic
    let Icon = Bell
    let colorClass = 'bg-gray-100 text-gray-500'

    switch (notification.type) {
        case 'INTEREST':
            Icon = Zap
            colorClass = 'bg-orange-100 text-orange-600'
            break
        case 'GEO':
            Icon = MapPin
            colorClass = 'bg-green-100 text-green-600'
            break
        case 'BEHAVIOR':
            Icon = Sparkles // AI icon?
            colorClass = 'bg-purple-100 text-purple-600'
            break
        case 'PROMOTION':
            Icon = Tag
            colorClass = 'bg-pink-100 text-pink-600'
            break
        case 'ORDER_UPDATE':
            Icon = ShoppingBag
            colorClass = 'bg-blue-100 text-blue-600'
            break
        case 'SELLER':
            Icon = TrendingUp
            colorClass = 'bg-indigo-100 text-indigo-600'
            break
    }

    return (
        <div
            onClick={onClick}
            className={`p-4 flex gap-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50 ${isUnread ? 'bg-blue-50/30 dark:bg-blue-900/10' : ''
                }`}
        >
            {/* Icon/Image */}
            <div className="flex-shrink-0 relative">
                {notification.image ? (
                    <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden border border-gray-100">
                        <img src={notification.image} alt="" className="w-full h-full object-cover" />
                    </div>
                ) : (
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${colorClass}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                {/* Priority Badge */}
                {notification.priority === 'high' && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full flex items-center justify-center">
                        <Zap className="w-2 h-2 text-white fill-white" />
                    </div>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-0.5">
                    <p className={`text-sm truncate pr-2 ${isUnread ? 'font-bold text-gray-900 dark:text-white' : 'font-medium text-gray-700 dark:text-gray-300'}`}>
                        {notification.title}
                    </p>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap flex-shrink-0">
                        {formatTimeAgo(notification.createdAt)}
                    </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                    {notification.body}
                </p>

                {/* AI Reason Badge (Optional) */}
                {['INTEREST', 'BEHAVIOR'].includes(notification.type) && (
                    <div className="mt-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-neon-purple" />
                        <span className="text-[10px] text-neon-purple font-medium">แนะนำโดย AI</span>
                    </div>
                )}
            </div>

            {/* Unread Dot */}
            {isUnread && (
                <div className="self-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                </div>
            )}
        </div>
    )
}

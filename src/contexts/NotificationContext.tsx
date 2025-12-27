'use client'

/**
 * NOTIFICATION CONTEXT
 * 
 * Provides real-time notification state across the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
    subscribeToNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    createNotification,
    Notification
} from '@/lib/notifications'

interface NotificationContextType {
    notifications: Notification[]
    unreadCount: number
    loading: boolean
    markAsRead: (notificationId: string) => Promise<void>
    markAllAsRead: () => Promise<void>
    sendNotification: (userId: string, type: Notification['type'], title: string, body: string, link?: string) => Promise<void>
    clearNotifications: () => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth()
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)

    // Unread count
    const unreadCount = notifications.filter(n => !n.isRead).length

    // Subscribe to notifications
    useEffect(() => {
        if (!user) {
            setNotifications([])
            setLoading(false)
            return
        }

        setLoading(true)
        const unsubscribe = subscribeToNotifications(user.uid, (newNotifications) => {
            setNotifications(newNotifications)
            setLoading(false)
        }, 50)

        return () => unsubscribe()
    }, [user])

    // Mark single notification as read
    const markAsRead = useCallback(async (notificationId: string) => {
        try {
            await markNotificationAsRead(notificationId)
            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
            )
        } catch (error) {
            console.error('Error marking notification as read:', error)
        }
    }, [])

    // Mark all as read
    const markAllAsRead = useCallback(async () => {
        if (!user) return
        try {
            await markAllNotificationsAsRead(user.uid)
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
        } catch (error) {
            console.error('Error marking all as read:', error)
        }
    }, [user])

    // Send notification
    const sendNotification = useCallback(async (
        userId: string,
        type: Notification['type'],
        title: string,
        body: string,
        link?: string
    ) => {
        try {
            await createNotification(userId, { type, title, body, link })
        } catch (error) {
            console.error('Error sending notification:', error)
        }
    }, [])

    // Clear all (local only)
    const clearNotifications = useCallback(() => {
        setNotifications([])
    }, [])

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            loading,
            markAsRead,
            markAllAsRead,
            sendNotification,
            clearNotifications
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export function useNotifications() {
    const context = useContext(NotificationContext)
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider')
    }
    return context
}

export type { Notification }

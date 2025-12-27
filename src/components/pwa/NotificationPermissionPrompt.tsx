'use client'

/**
 * NOTIFICATION PERMISSION PROMPT
 * 
 * Asks users to enable push notifications
 * - Shows after user has browsed for a while
 * - Beautiful UI with benefits explanation
 * - Respects user choice
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, BellOff, X, MessageCircle, Tag, Package, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { requestNotificationPermission, getFCMToken, getNotificationPermissionStatus, isPushSupported } from '@/lib/push-notifications'

export default function NotificationPermissionPrompt() {
    const [showPrompt, setShowPrompt] = useState(false)
    const [isRequesting, setIsRequesting] = useState(false)
    const [permissionStatus, setPermissionStatus] = useState<string>('default')
    const { language } = useLanguage()
    const { user } = useAuth()
    const lang = language as 'th' | 'en'

    // Translations
    const t = {
        title: lang === 'th' ? '🔔 ไม่พลาดทุกข้อความ' : '🔔 Never miss a message',
        subtitle: lang === 'th' ? 'เปิดแจ้งเตือนเพื่อรับข่าวสารทันที' : 'Enable notifications to stay updated',
        enable: lang === 'th' ? 'เปิดแจ้งเตือน' : 'Enable Notifications',
        later: lang === 'th' ? 'ไว้ทีหลัง' : 'Maybe Later',
        benefits: [
            {
                icon: MessageCircle,
                text: lang === 'th' ? 'รู้ทันทีเมื่อมีข้อความ' : 'Get notified of new messages',
                color: 'text-green-400'
            },
            {
                icon: Tag,
                text: lang === 'th' ? 'แจ้งเมื่อราคาลด' : 'Price drop alerts',
                color: 'text-pink-400'
            },
            {
                icon: Package,
                text: lang === 'th' ? 'อัปเดตสถานะคำสั่งซื้อ' : 'Order status updates',
                color: 'text-cyan-400'
            }
        ]
    }

    useEffect(() => {
        if (!isPushSupported()) return

        const status = getNotificationPermissionStatus()
        setPermissionStatus(status)

        // Don't show if already granted or denied
        if (status !== 'default') return

        // Don't show if user dismissed recently
        const dismissedAt = localStorage.getItem('notification-prompt-dismissed')
        if (dismissedAt) {
            const hoursSince = (Date.now() - parseInt(dismissedAt, 10)) / (1000 * 60 * 60)
            if (hoursSince < 72) return // Wait 3 days before showing again
        }

        // Show prompt after user has been on site for a while
        const timer = setTimeout(() => {
            if (user) { // Only show to logged in users
                setShowPrompt(true)
            }
        }, 30000) // Wait 30 seconds

        return () => clearTimeout(timer)
    }, [user])

    // Handle enable notifications
    const handleEnable = async () => {
        setIsRequesting(true)
        try {
            const hasPermission = await requestNotificationPermission()
            if (hasPermission && user) {
                await getFCMToken(user.uid)
                setPermissionStatus('granted')
            } else {
                setPermissionStatus('denied')
            }
        } catch (error) {
            console.error('Failed to enable notifications:', error)
        } finally {
            setIsRequesting(false)
            setShowPrompt(false)
        }
    }

    // Handle dismiss
    const handleDismiss = () => {
        setShowPrompt(false)
        localStorage.setItem('notification-prompt-dismissed', Date.now().toString())
    }

    if (!showPrompt || permissionStatus !== 'default') return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
                onClick={handleDismiss}
            >
                <motion.div
                    initial={{ y: 20 }}
                    animate={{ y: 0 }}
                    className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl border border-purple-500/30 shadow-2xl max-w-sm w-full overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Gradient glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 pointer-events-none" />

                    {/* Close button */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="relative p-6 text-center">
                        {/* Icon */}
                        <div className="w-20 h-20 mx-auto mb-5 relative">
                            <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-pulse" />
                            <div className="relative w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                                <Bell className="w-10 h-10 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-xs font-bold text-white">3</span>
                            </div>
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-bold text-white mb-2">
                            {t.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-6">
                            {t.subtitle}
                        </p>

                        {/* Benefits */}
                        <div className="space-y-3 mb-6">
                            {t.benefits.map(({ icon: Icon, text, color }, i) => (
                                <div key={i} className="flex items-center gap-3 text-left">
                                    <div className={`w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center`}>
                                        <Icon className={`w-4 h-4 ${color}`} />
                                    </div>
                                    <span className="text-sm text-gray-300">{text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={handleEnable}
                                disabled={isRequesting}
                                className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-70 rounded-xl text-white font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                {isRequesting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        {lang === 'th' ? 'กำลังเปิด...' : 'Enabling...'}
                                    </>
                                ) : (
                                    <>
                                        <Bell className="w-5 h-5" />
                                        {t.enable}
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleDismiss}
                                className="w-full py-2.5 text-gray-400 hover:text-white font-medium transition-colors"
                            >
                                {t.later}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

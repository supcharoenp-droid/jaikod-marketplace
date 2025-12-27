'use client'

/**
 * PWA PROVIDER
 * 
 * Wraps the app with PWA functionality:
 * - Service Worker registration
 * - Install prompt
 * - Notification permission prompt
 * - Update notification
 * - Online/Offline status bar
 */

import { ReactNode, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { WifiOff, Download, RefreshCw, X } from 'lucide-react'
import { useServiceWorker } from '@/hooks/useServiceWorker'
import PWAInstallPrompt from './PWAInstallPrompt'
import NotificationPermissionPrompt from './NotificationPermissionPrompt'
import { useLanguage } from '@/contexts/LanguageContext'

interface PWAProviderProps {
    children: ReactNode
}

export default function PWAProvider({ children }: PWAProviderProps) {
    const { isOnline, hasUpdate, updateApp } = useServiceWorker()
    const [showOfflineBar, setShowOfflineBar] = useState(false)
    const [showUpdateBar, setShowUpdateBar] = useState(false)
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'

    // Translations
    const t = {
        offline: lang === 'th' ? '🔴 คุณกำลังออฟไลน์' : '🔴 You are offline',
        offlineDesc: lang === 'th' ? 'บางฟีเจอร์อาจไม่พร้อมใช้งาน' : 'Some features may not be available',
        updateAvailable: lang === 'th' ? '✨ อัปเดตใหม่พร้อมแล้ว!' : '✨ New update available!',
        updateNow: lang === 'th' ? 'อัปเดตเลย' : 'Update Now',
    }

    // Show/hide offline bar
    useEffect(() => {
        if (!isOnline) {
            setShowOfflineBar(true)
        } else {
            // Delay hiding to show "back online" briefly
            const timer = setTimeout(() => setShowOfflineBar(false), 1000)
            return () => clearTimeout(timer)
        }
    }, [isOnline])

    // Show update bar when update is available
    useEffect(() => {
        if (hasUpdate) {
            setShowUpdateBar(true)
        }
    }, [hasUpdate])

    return (
        <>
            {children}

            {/* Offline Status Bar */}
            <AnimatePresence>
                {showOfflineBar && !isOnline && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-amber-600 to-orange-600 text-white px-4 py-2 shadow-lg"
                    >
                        <div className="max-w-6xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <WifiOff className="w-5 h-5" />
                                <div>
                                    <span className="font-medium">{t.offline}</span>
                                    <span className="hidden sm:inline text-white/80 ml-2">
                                        {t.offlineDesc}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowOfflineBar(false)}
                                className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Update Available Bar */}
            <AnimatePresence>
                {showUpdateBar && hasUpdate && (
                    <motion.div
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -100, opacity: 0 }}
                        className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 shadow-lg"
                    >
                        <div className="max-w-6xl mx-auto flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Download className="w-5 h-5" />
                                <span className="font-medium">{t.updateAvailable}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={updateApp}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm font-medium"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    {t.updateNow}
                                </button>
                                <button
                                    onClick={() => setShowUpdateBar(false)}
                                    className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* PWA Install Prompt */}
            <PWAInstallPrompt />

            {/* Notification Permission Prompt */}
            <NotificationPermissionPrompt />
        </>
    )
}

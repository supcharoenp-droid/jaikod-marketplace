'use client'

/**
 * PWA INSTALL PROMPT COMPONENT
 * 
 * Shows a beautiful install prompt when the app can be installed
 * - Tracks beforeinstallprompt event
 * - Shows banner on mobile/desktop
 * - Handles installation flow
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, X, Smartphone, Sparkles, Zap, Bell, CheckCircle2 } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
    const [showPrompt, setShowPrompt] = useState(false)
    const [isInstalling, setIsInstalling] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)
    const [dismissed, setDismissed] = useState(false)
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'

    // Translations
    const t = {
        title: lang === 'th' ? 'ติดตั้ง JaiKod' : 'Install JaiKod',
        subtitle: lang === 'th' ? 'เพิ่มลงหน้าจอหลักเพื่อใช้งานได้เร็วขึ้น' : 'Add to home screen for faster access',
        install: lang === 'th' ? 'ติดตั้ง' : 'Install',
        installing: lang === 'th' ? 'กำลังติดตั้ง...' : 'Installing...',
        installed: lang === 'th' ? 'ติดตั้งแล้ว!' : 'Installed!',
        later: lang === 'th' ? 'ไว้ทีหลัง' : 'Later',
        features: {
            offline: lang === 'th' ? 'ใช้งานได้แม้ไม่มีเน็ต' : 'Works offline',
            fast: lang === 'th' ? 'เปิดเร็วเหมือน App' : 'Opens like native app',
            notifications: lang === 'th' ? 'รับแจ้งเตือนทันที' : 'Get instant notifications',
        }
    }

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            setIsInstalled(true)
            return
        }

        // Check if dismissed recently
        const dismissedAt = localStorage.getItem('pwa-prompt-dismissed')
        if (dismissedAt) {
            const dismissedTime = parseInt(dismissedAt, 10)
            const hoursSinceDismissed = (Date.now() - dismissedTime) / (1000 * 60 * 60)
            if (hoursSinceDismissed < 24) {
                setDismissed(true)
                return
            }
        }

        // Listen for install prompt
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault()
            setDeferredPrompt(e as BeforeInstallPromptEvent)
            // Wait a bit before showing prompt
            setTimeout(() => setShowPrompt(true), 3000)
        }

        // Listen for app installed
        const handleAppInstalled = () => {
            setIsInstalled(true)
            setShowPrompt(false)
            setDeferredPrompt(null)
        }

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
        window.addEventListener('appinstalled', handleAppInstalled)

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
            window.removeEventListener('appinstalled', handleAppInstalled)
        }
    }, [])

    // Handle install click
    const handleInstall = async () => {
        if (!deferredPrompt) return

        setIsInstalling(true)

        try {
            await deferredPrompt.prompt()
            const choice = await deferredPrompt.userChoice

            if (choice.outcome === 'accepted') {
                setIsInstalled(true)
                // Show success for a moment then hide
                setTimeout(() => setShowPrompt(false), 2000)
            }
        } catch (error) {
            console.error('Install error:', error)
        } finally {
            setIsInstalling(false)
            setDeferredPrompt(null)
        }
    }

    // Handle dismiss
    const handleDismiss = () => {
        setShowPrompt(false)
        setDismissed(true)
        localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
    }

    // Don't render if not needed
    if (isInstalled || dismissed || !deferredPrompt) return null

    return (
        <AnimatePresence>
            {showPrompt && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                    className="fixed bottom-20 left-4 right-4 md:left-auto md:right-6 md:w-96 z-50"
                >
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-purple-500/30 shadow-2xl overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 pointer-events-none" />

                        {/* Close button */}
                        <button
                            onClick={handleDismiss}
                            className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-slate-700 transition-colors z-10"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="relative p-5">
                            {/* Header */}
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                                    {isInstalled ? (
                                        <CheckCircle2 className="w-7 h-7 text-white" />
                                    ) : (
                                        <Smartphone className="w-7 h-7 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        {t.title}
                                        <Sparkles className="w-4 h-4 text-yellow-400" />
                                    </h3>
                                    <p className="text-sm text-gray-400">{t.subtitle}</p>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-3 gap-2 mb-4">
                                {[
                                    { icon: Zap, text: t.features.fast, color: 'text-yellow-400' },
                                    { icon: Download, text: t.features.offline, color: 'text-cyan-400' },
                                    { icon: Bell, text: t.features.notifications, color: 'text-pink-400' },
                                ].map(({ icon: Icon, text, color }, i) => (
                                    <div key={i} className="text-center p-2 bg-slate-800/50 rounded-lg">
                                        <Icon className={`w-5 h-5 mx-auto mb-1 ${color}`} />
                                        <span className="text-xs text-gray-400 line-clamp-1">{text}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-3">
                                <button
                                    onClick={handleDismiss}
                                    className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 rounded-xl text-gray-300 font-medium transition-colors"
                                >
                                    {t.later}
                                </button>
                                <button
                                    onClick={handleInstall}
                                    disabled={isInstalling || isInstalled}
                                    className="flex-1 py-2.5 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:opacity-70 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2"
                                >
                                    {isInstalled ? (
                                        <>
                                            <CheckCircle2 className="w-4 h-4" />
                                            {t.installed}
                                        </>
                                    ) : isInstalling ? (
                                        <>
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {t.installing}
                                        </>
                                    ) : (
                                        <>
                                            <Download className="w-4 h-4" />
                                            {t.install}
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

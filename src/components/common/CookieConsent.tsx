'use client'

import { useState, useEffect } from 'react'
import { Cookie, X, Settings } from 'lucide-react'
import Link from 'next/link'
import { useLanguage } from '@/contexts/LanguageContext'
import { logConsent } from '@/lib/pdpaLogger'
import { useAuth } from '@/contexts/AuthContext'

interface CookiePreferences {
    necessary: boolean
    analytics: boolean
    marketing: boolean
}

export default function CookieConsent() {
    const { t } = useLanguage()
    const { user } = useAuth()
    const [showBanner, setShowBanner] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [preferences, setPreferences] = useState<CookiePreferences>({
        necessary: true, // Always true
        analytics: false,
        marketing: false
    })

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('cookie-consent')
        if (!consent) {
            // Show banner after a short delay for better UX
            setTimeout(() => setShowBanner(true), 1000)
        } else {
            // Load saved preferences
            try {
                const saved = JSON.parse(consent)
                setPreferences(saved)
            } catch (e) {
                console.error('Failed to parse cookie consent:', e)
            }
        }
    }, [])

    const handleConsent = (prefs: CookiePreferences, status: 'ACCEPTED' | 'REJECTED') => {
        // 1. Save locally for UI state
        localStorage.setItem('cookie-consent', JSON.stringify(prefs))
        localStorage.setItem('cookie-consent-date', new Date().toISOString())
        setPreferences(prefs)
        setShowBanner(false)
        setShowSettings(false)

        // 2. Apply preferences
        if (prefs.analytics) console.log('Analytics enabled')
        if (prefs.marketing) console.log('Marketing enabled')

        // 3. Log to Database for Legal Evidence
        const userId = user?.uid || 'guest'
        logConsent(userId, 'COOKIE', status, {
            necessary: prefs.necessary,
            analytics: prefs.analytics,
            marketing: prefs.marketing
        })
    }

    const acceptAll = () => {
        handleConsent({
            necessary: true,
            analytics: true,
            marketing: true
        }, 'ACCEPTED')
    }

    const rejectAll = () => {
        handleConsent({
            necessary: true,
            analytics: false,
            marketing: false
        }, 'REJECTED')
    }

    const saveCustom = () => {
        // If they customized, we consider it ACCEPTED but with specific preferences
        handleConsent(preferences, 'ACCEPTED')
    }

    if (!showBanner) return null

    return (
        <>
            {/* Cookie Banner */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-t-2 border-purple-500 shadow-2xl">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                        {/* Icon & Message */}
                        <div className="flex items-start gap-3 flex-1">
                            <Cookie className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                    {t('common.pdpa_cookie_banner_title')}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {t('common.pdpa_cookie_banner_desc')}{' '}
                                    <Link href="/cookie-policy" className="text-purple-600 hover:underline">
                                        {t('common.view_all')}
                                    </Link>
                                </p>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-2 md:flex-shrink-0">
                            <button
                                onClick={() => setShowSettings(true)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                                <Settings className="w-4 h-4" />
                                {t('common.pdpa_btn_settings')}
                            </button>
                            <button
                                onClick={rejectAll}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                {t('common.pdpa_btn_reject_all')}
                            </button>
                            <button
                                onClick={acceptAll}
                                className="px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                            >
                                {t('common.pdpa_btn_accept_all')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cookie Settings Modal */}
            {showSettings && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Cookie className="w-6 h-6 text-purple-600" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {t('common.pdpa_btn_settings')}
                                </h2>
                            </div>
                            <button
                                onClick={() => setShowSettings(false)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            <p className="text-gray-600 dark:text-gray-300">
                                {t('common.pdpa_cookie_banner_desc')}
                            </p>

                            {/* Necessary Cookies */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                Necessary Cookies
                                            </h3>
                                            <span className="px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 rounded">
                                                Always Active
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Required for core site functionality. Cannot be disabled.
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <div className="w-12 h-6 bg-purple-600 rounded-full flex items-center justify-end px-1">
                                            <div className="w-4 h-4 bg-white rounded-full"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Analytics Cookies */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            {t('consent_analytics_title')}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('consent_analytics_desc')}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={() => setPreferences(prev => ({ ...prev, analytics: !prev.analytics }))}
                                            className={`w-12 h-6 rounded-full transition-colors ${preferences.analytics
                                                ? 'bg-purple-600'
                                                : 'bg-gray-300 dark:bg-gray-600'
                                                } flex items-center ${preferences.analytics ? 'justify-end' : 'justify-start'} px-1`}
                                        >
                                            <div className="w-4 h-4 bg-white rounded-full"></div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Marketing Cookies */}
                            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            {t('consent_marketing_title')}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {t('consent_marketing_desc')}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <button
                                            onClick={() => setPreferences(prev => ({ ...prev, marketing: !prev.marketing }))}
                                            className={`w-12 h-6 rounded-full transition-colors ${preferences.marketing
                                                ? 'bg-purple-600'
                                                : 'bg-gray-300 dark:bg-gray-600'
                                                } flex items-center ${preferences.marketing ? 'justify-end' : 'justify-start'} px-1`}
                                        >
                                            <div className="w-4 h-4 bg-white rounded-full"></div>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3">
                            <button
                                onClick={rejectAll}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                {t('common.pdpa_btn_reject_all')}
                            </button>
                            <button
                                onClick={saveCustom}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                            >
                                {t('common.save')}
                            </button>
                            <button
                                onClick={acceptAll}
                                className="flex-1 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
                            >
                                {t('common.pdpa_btn_accept_all')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import DataPrivacySettings from '@/components/profile/DataPrivacySettings'
import { Shield, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PrivacySettingsPage() {
    const { user, loading } = useAuth()
    const { t } = useLanguage()
    const router = useRouter()

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-bg-dark">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">กำลังโหลด...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1 pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    {/* Header */}
                    <div className="mb-8">
                        <Link
                            href="/profile"
                            className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 mb-4 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            {t('common.back_to_profile')}
                        </Link>

                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl">
                                <Shield className="w-8 h-8 text-purple-600 dark:text-purple-300" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {t('common.pdpa_page_title')}
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    {t('common.pdpa_page_subtitle')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Info Banner */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                        <div className="flex items-start gap-3">
                            <Shield className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-blue-900 dark:text-blue-200">
                                <p className="font-medium mb-1">{t('common.pdpa_rights_title')}</p>
                                <p className="text-blue-700 dark:text-blue-300">
                                    {t('common.pdpa_rights_desc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Data Privacy Settings Component */}
                    <DataPrivacySettings />

                    {/* Additional Info */}
                    <div className="mt-8 bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                            {t('common.pdpa_more_info_title')}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <p>
                                • {t('common.pdpa_contact_support')}
                                <a href="mailto:privacy@jaikod.com" className="text-purple-600 hover:underline">
                                    privacy@jaikod.com
                                </a>
                            </p>
                            <p>
                                • {t('common.pdpa_read_policy_prefix')}
                                <Link href="/privacy" className="text-purple-600 hover:underline">
                                    {t('common.pdpa_privacy_policy')}
                                </Link>
                                {t('common.pdpa_read_policy_suffix')}
                            </p>
                            <p>
                                • {t('common.pdpa_view_cookie_prefix')}
                                <Link href="/cookie-policy" className="text-purple-600 hover:underline">
                                    {t('common.pdpa_cookie_policy')}
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

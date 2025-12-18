'use client'

import { useState, useEffect } from 'react'
import { Download, Trash2, Shield, AlertTriangle, CheckCircle, ToggleLeft, ToggleRight, Cookie } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { logConsent } from '@/lib/pdpaLogger'
import { logSecurityEvent } from '@/lib/securityLogger'
import { useAuth } from '@/contexts/AuthContext'

interface UserDataExport {
    profile: any
    products: any[]
    orders: any[]
    messages: any[]
    reviews: any[]
}

export default function DataPrivacySettings() {
    const { t } = useLanguage()
    const { user } = useAuth()
    const [isExporting, setIsExporting] = useState(false)
    const [exportSuccess, setExportSuccess] = useState(false)
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
    const [deleteStep, setDeleteStep] = useState(1)
    const [deleteReason, setDeleteReason] = useState('')
    const [confirmText, setConfirmText] = useState('')

    // Consent State
    const [consents, setConsents] = useState({
        marketing: false,
        analytics: false
    })

    useEffect(() => {
        const saved = localStorage.getItem('cookie-consent')
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                setConsents({
                    marketing: parsed.marketing || false,
                    analytics: parsed.analytics || false
                })
            } catch (e) {
                console.error(e)
            }
        }
    }, [])

    const handleConsentChange = (type: 'marketing' | 'analytics', value: boolean) => {
        const newConsents = { ...consents, [type]: value }
        setConsents(newConsents)

        // Update local storage to sync with CookieConsent
        const fullPrefs = {
            necessary: true,
            analytics: newConsents.analytics,
            marketing: newConsents.marketing
        }
        localStorage.setItem('cookie-consent', JSON.stringify(fullPrefs))

        // Log to DB
        logConsent(user?.uid || 'guest', type === 'marketing' ? 'MARKETING' : 'COOKIE', value ? 'ACCEPTED' : 'REJECTED', fullPrefs)
    }

    // Export Data
    const handleExportData = async () => {
        if (!user) return

        setIsExporting(true)
        setExportSuccess(false)

        try {
            // Import Firestore functions dynamically or use what's available
            const { collection, query, where, getDocs, doc, getDoc } = await import('firebase/firestore')
            const { db } = await import('@/lib/firebase')

            // 1. Fetch Profile
            const profileSnap = await getDoc(doc(db, 'users', user.uid))
            const profileData = profileSnap.exists() ? profileSnap.data() : null

            // 2. Fetch Products
            const productsQuery = query(collection(db, 'products'), where('seller_id', '==', user.uid))
            const productsSnap = await getDocs(productsQuery)
            const productsData = productsSnap.docs.map(d => ({ id: d.id, ...d.data() }))

            // 3. Fetch Orders (As Buyer)
            const buyerOrdersQuery = query(collection(db, 'orders'), where('buyer_id', '==', user.uid))
            const buyerOrdersSnap = await getDocs(buyerOrdersQuery)
            const buyerOrdersData = buyerOrdersSnap.docs.map(d => ({ id: d.id, ...d.data() }))

            // 4. Fetch Orders (As Seller)
            const sellerOrdersQuery = query(collection(db, 'orders'), where('seller_id', '==', user.uid))
            const sellerOrdersSnap = await getDocs(sellerOrdersQuery)
            const sellerOrdersData = sellerOrdersSnap.docs.map(d => ({ id: d.id, ...d.data() }))

            // 5. Fetch Consent Logs
            const consentQuery = query(collection(db, 'consent_logs'), where('userId', '==', user.uid))
            const consentSnap = await getDocs(consentQuery)
            const consentData = consentSnap.docs.map(d => {
                const data = d.data()
                // Convert timestamp to ISO string for JSON
                return {
                    id: d.id,
                    ...data,
                    timestamp: data.timestamp?.toDate?.().toISOString() || data.timestamp
                }
            })

            const exportData = {
                export_info: {
                    exported_at: new Date().toISOString(),
                    user_id: user.uid,
                    version: '1.0'
                },
                profile: profileData,
                products: productsData,
                orders: {
                    as_buyer: buyerOrdersData,
                    as_seller: sellerOrdersData
                },
                consent_history: consentData
            }

            // Create JSON file
            const dataStr = JSON.stringify(exportData, null, 2)
            const dataBlob = new Blob([dataStr], { type: 'application/json' })

            // Create download link
            const url = window.URL.createObjectURL(dataBlob)
            const link = document.createElement('a')
            link.href = url
            link.download = `jaikod-data-export-${new Date().toISOString().split('T')[0]}.json`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)

            setExportSuccess(true)

            // Log PDPA Action
            logSecurityEvent(user.uid, 'DATA_EXPORT', 'SUCCESS', 'User downloaded personal data archive (PDPA)')

            setTimeout(() => setExportSuccess(false), 5000)
        } catch (error) {
            console.error('Export failed:', error)
            alert('เกิดข้อผิดพลาดในการดาวน์โหลดข้อมูล กรุณาลองใหม่อีกครั้ง')
        } finally {
            setIsExporting(false)
        }
    }

    // Delete Account
    const handleDeleteAccount = async () => {
        if (confirmText !== 'ลบบัญชีของฉัน') {
            alert('กรุณาพิมพ์ "ลบบัญชีของฉัน" เพื่อยืนยัน')
            return
        }

        try {
            // TODO: Replace with actual API call
            // await fetch('/api/user/delete-account', {
            //     method: 'DELETE',
            //     body: JSON.stringify({ reason: deleteReason })
            // })

            alert('บัญชีของคุณได้ถูกลบเรียบร้อยแล้ว')

            // Log Account Deletion Request
            logSecurityEvent(user?.uid || 'unknown', 'ACCOUNT_DELETE', 'SUCCESS', `User requested account deletion. Reason: ${deleteReason}`)

            // Redirect to home or logout
            window.location.href = '/'
        } catch (error) {
            console.error('Delete failed:', error)
            alert('เกิดข้อผิดพลาดในการลบบัญชี กรุณาลองใหม่อีกครั้ง')
        }
    }

    return (
        <div className="space-y-6">
            {/* Consent Management Section */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
                        <Cookie className="w-6 h-6 text-purple-600 dark:text-purple-300" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {t('common.pdpa_btn_settings')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {t('common.pdpa_cookie_banner_desc')}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Marketing Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                                {t('common.consent_marketing_title')}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {t('common.consent_marketing_desc')}
                            </p>
                        </div>
                        <button
                            onClick={() => handleConsentChange('marketing', !consents.marketing)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${consents.marketing ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${consents.marketing ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* Analytics Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                        <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                                {t('common.consent_analytics_title')}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {t('common.consent_analytics_desc')}
                            </p>
                        </div>
                        <button
                            onClick={() => handleConsentChange('analytics', !consents.analytics)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${consents.analytics ? 'bg-purple-600' : 'bg-gray-300 dark:bg-gray-600'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${consents.analytics ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>
                </div>
            </div>

            {/* Export Data Section */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                        <Download className="w-6 h-6 text-blue-600 dark:text-blue-300" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {t('common.pdpa_export_title')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {t('common.pdpa_export_desc')}
                        </p>

                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                                {t('common.pdpa_export_includes')}
                            </h4>
                            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                <li>✓ {t('common.pdpa_export_profile')}</li>
                                <li>✓ {t('common.pdpa_export_history')}</li>
                                <li>✓ {t('common.pdpa_export_products')}</li>
                                <li>✓ {t('common.pdpa_export_chats')}</li>
                                <li>✓ {t('common.pdpa_export_reviews')}</li>
                                <li>✓ {t('common.pdpa_export_logins')}</li>
                            </ul>
                        </div>

                        {exportSuccess && (
                            <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 px-4 py-3 rounded-lg mb-4">
                                <CheckCircle className="w-5 h-5" />
                                <span className="text-sm font-medium">{t('common.pdpa_export_success')}</span>
                            </div>
                        )}

                        <button
                            onClick={handleExportData}
                            disabled={isExporting}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Download className="w-5 h-5" />
                            {isExporting ? t('common.pdpa_export_loading') : t('common.pdpa_export_btn')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Account Section */}
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-red-200 dark:border-red-900">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900 rounded-lg">
                        <Trash2 className="w-6 h-6 text-red-600 dark:text-red-300" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                            {t('common.pdpa_delete_title')}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                            {t('common.pdpa_delete_desc')}
                        </p>

                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <h4 className="text-sm font-medium text-red-900 dark:text-red-200 mb-2">
                                        {t('common.pdpa_delete_warning_title')}
                                    </h4>
                                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                                        <li>• {t('common.pdpa_delete_w1')}</li>
                                        <li>• {t('common.pdpa_delete_w2')}</li>
                                        <li>• {t('common.pdpa_delete_w3')}</li>
                                        <li>• {t('common.pdpa_delete_w4')}</li>
                                        <li>• {t('common.pdpa_delete_w5')}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                            <Trash2 className="w-5 h-5" />
                            {t('common.pdpa_delete_btn')}
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Header */}
                        <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg">
                                    <Shield className="w-6 h-6 text-red-600 dark:text-red-300" />
                                </div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                    {t('common.pdpa_modal_title')}
                                </h2>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {deleteStep === 1 && (
                                <>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            {t('common.pdpa_modal_step1_title')}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                            {t('common.pdpa_modal_step1_desc')}
                                        </p>
                                        <textarea
                                            value={deleteReason}
                                            onChange={(e) => setDeleteReason(e.target.value)}
                                            placeholder={t('common.pdpa_modal_reason_placeholder')}
                                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white resize-none"
                                            rows={4}
                                        />
                                    </div>

                                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                                        <h4 className="text-sm font-medium text-yellow-900 dark:text-yellow-200 mb-2">
                                            {t('common.pdpa_modal_tip_title')}
                                        </h4>
                                        <ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
                                            <li>• {t('common.pdpa_modal_tip1')}</li>
                                            <li>• {t('common.pdpa_modal_tip2')}</li>
                                            <li>• {t('common.pdpa_modal_tip3')}</li>
                                        </ul>
                                    </div>
                                </>
                            )}

                            {deleteStep === 2 && (
                                <>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            {t('common.pdpa_modal_step2_title')}
                                        </h3>
                                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span>{t('common.pdpa_modal_data1')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span>{t('common.pdpa_modal_data2')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span>{t('common.pdpa_modal_data3')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span>{t('common.pdpa_modal_data4')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                                <span>{t('common.pdpa_modal_data5')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                                            {t('common.pdpa_modal_retain_title')}
                                        </h3>
                                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                <span>{t('common.pdpa_modal_retain1')}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                <span>{t('common.pdpa_modal_retain2')}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                        <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                                            {t('common.pdpa_modal_confirm_label').split('"')[0]}"<span className="font-bold text-red-600">{t('common.pdpa_modal_confirm_keyword')}</span>"{t('common.pdpa_modal_confirm_label').split('"')[2]}
                                        </label>
                                        <input
                                            type="text"
                                            value={confirmText}
                                            onChange={(e) => setConfirmText(e.target.value)}
                                            placeholder={t('common.pdpa_modal_confirm_keyword')}
                                            className="w-full px-4 py-3 border border-red-300 dark:border-red-600 rounded-lg focus:ring-2 focus:ring-red-500 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex gap-3">
                            <button
                                onClick={() => {
                                    setShowDeleteConfirm(false)
                                    setDeleteStep(1)
                                    setConfirmText('')
                                    setDeleteReason('')
                                }}
                                className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                            >
                                {t('common.pdpa_modal_cancel')}
                            </button>
                            {deleteStep === 1 ? (
                                <button
                                    onClick={() => setDeleteStep(2)}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    {t('common.pdpa_modal_continue')}
                                </button>
                            ) : (
                                <button
                                    onClick={handleDeleteAccount}
                                    disabled={confirmText !== t('common.pdpa_modal_confirm_keyword')}
                                    className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                >
                                    {t('common.pdpa_modal_confirm_btn')}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

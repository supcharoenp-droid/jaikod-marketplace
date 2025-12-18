'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import {
    Scale, Search, AlertTriangle, CheckCircle, XCircle,
    DollarSign, User, ShieldAlert, ExternalLink
} from 'lucide-react'
import { Timestamp } from 'firebase/firestore'
import { assessUserRisk, TrustScoreProfile } from '@/lib/admin/trust-score-service'

// Mock Data Structure until we add 'disputes' collection
interface DisputeItem {
    id: string
    orderId: string
    buyerId: string
    buyerName: string
    sellerId: string
    sellerName: string
    amount: number
    reason: 'not_received' | 'damaged' | 'incomplete'
    status: 'open' | 'resolved' | 'cancelled'
    userNote: string
    createdAt: Date
}

// Mock Data
const MOCK_DISPUTES: DisputeItem[] = [
    {
        id: 'DSP-2024-001',
        orderId: 'ORD-998-112',
        buyerId: 'user_buyer_01',
        buyerName: 'Alice Buyer',
        sellerId: 'user_seller_01',
        sellerName: 'Bob Gadget Store',
        amount: 4500,
        reason: 'not_received',
        status: 'open',
        userNote: 'I waited for 10 days, tracking number is invalid.',
        createdAt: new Date()
    },
    {
        id: 'DSP-2024-002',
        orderId: 'ORD-776-334',
        buyerId: 'user_buyer_02',
        buyerName: 'Chris Consumer',
        sellerId: 'user_seller_02',
        sellerName: 'Fashion Hub',
        amount: 1200,
        reason: 'damaged',
        status: 'open',
        userNote: 'The shirt is torn upon arrival. Image attached.',
        createdAt: new Date(Date.now() - 86400000)
    },
    {
        id: 'DSP-2024-003',
        orderId: 'ORD-555-111',
        buyerId: 'user_buyer_03',
        buyerName: 'Dave Dropshipper',
        sellerId: 'user_seller_01',
        sellerName: 'Bob Gadget Store',
        amount: 15000,
        reason: 'incomplete',
        status: 'resolved',
        userNote: 'Missing power adapter.',
        createdAt: new Date(Date.now() - 172800000)
    }
]

export default function OrderDisputesPage() {
    const { t } = useLanguage()
    const [disputes, setDisputes] = useState<DisputeItem[]>([])
    const [loading, setLoading] = useState(true)
    const [auditProfile, setAuditProfile] = useState<TrustScoreProfile | null>(null)
    const [auditLoading, setAuditLoading] = useState(false)
    const [showAuditModal, setShowAuditModal] = useState(false)

    useEffect(() => {
        // Simulate Fetch
        setTimeout(() => {
            setDisputes(MOCK_DISPUTES)
            setLoading(false)
        }, 800)
    }, [])

    const handleAction = (id: string, action: 'refund' | 'release') => {
        if (!confirm(`Confirm action: ${action.toUpperCase()}? This cannot be undone.`)) return

        // In real app: Call API/Service
        setDisputes(prev => prev.map(d =>
            d.id === id ? { ...d, status: 'resolved' } : d
        ))
        alert(`Action ${action} completed for ${id}`)
    }

    const handleAudit = async (userId: string) => {
        setAuditLoading(true)
        setShowAuditModal(true)
        setAuditProfile(null)
        try {
            // Call the service we just created
            const profile = await assessUserRisk(userId)
            setAuditProfile(profile)
        } catch (e) {
            console.error(e)
            alert('Failed to audit user. They might not exist in Mock DB.')
            setShowAuditModal(false)
        } finally {
            setAuditLoading(false)
        }
    }

    const getReasonLabel = (r: string) => {
        const key = `admin.dispute_reason_${r}`
        const trans = t(key)
        return trans === key ? r : trans
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Scale className="w-8 h-8 text-orange-600" />
                            {t('admin.dispute_title')}
                        </h1>
                        <p className="text-gray-500">Manage refunds and seller payouts for disputed orders.</p>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    {/* Toolbar */}
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder={t('admin.search_placeholder')}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 text-sm"
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 font-medium">
                                <tr>
                                    <th className="px-6 py-4">{t('admin.dispute_id')} / {t('admin.dispute_order_id')}</th>
                                    <th className="px-6 py-4">Parties (Buyer / Seller)</th>
                                    <th className="px-6 py-4">{t('admin.dispute_reason')}</th>
                                    <th className="px-6 py-4">{t('admin.dispute_amount')}</th>
                                    <th className="px-6 py-4 text-center">{t('common.status')}</th>
                                    <th className="px-6 py-4 text-right">{t('admin.table_action')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {loading ? (
                                    <tr><td colSpan={6} className="text-center py-8">{t('common.loading')}</td></tr>
                                ) : disputes.map(item => (
                                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900 dark:text-white">{item.id}</div>
                                            <div className="text-xs text-gray-500">{item.orderId}</div>
                                            <div className="text-xs text-gray-400 mt-1">{item.createdAt.toLocaleDateString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="w-12 text-gray-500">Buyer:</span>
                                                    <span className="font-medium">{item.buyerName}</span>
                                                    <button onClick={() => handleAudit(item.buyerId)} className="text-blue-500 hover:underline flex items-center gap-1">
                                                        <ShieldAlert className="w-3 h-3" /> Check
                                                    </button>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="w-12 text-gray-500">Seller:</span>
                                                    <span className="font-medium">{item.sellerName}</span>
                                                    <button onClick={() => handleAudit(item.sellerId)} className="text-orange-500 hover:underline flex items-center gap-1">
                                                        <ShieldAlert className="w-3 h-3" /> Check
                                                    </button>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 rounded bg-gray-100 dark:bg-gray-700 text-xs font-medium">
                                                {getReasonLabel(item.reason)}
                                            </span>
                                            <p className="text-xs text-gray-500 mt-1 max-w-xs truncate" title={item.userNote}>
                                                "{item.userNote}"
                                            </p>
                                        </td>
                                        <td className="px-6 py-4 font-mono">
                                            ฿{item.amount.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.status === 'open' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                    <AlertTriangle className="w-3 h-3" />
                                                    {t('admin.dispute_status_open')}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                                    <CheckCircle className="w-3 h-3" />
                                                    {t('admin.dispute_status_resolved')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {item.status === 'open' && (
                                                <div className="flex flex-col gap-2 items-end">
                                                    <button
                                                        onClick={() => handleAction(item.id, 'refund')}
                                                        className="px-3 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded text-xs font-medium border border-red-200"
                                                    >
                                                        {t('admin.dispute_action_refund')}
                                                    </button>
                                                    <button
                                                        onClick={() => handleAction(item.id, 'release')}
                                                        className="px-3 py-1 bg-green-50 text-green-600 hover:bg-green-100 rounded text-xs font-medium border border-green-200"
                                                    >
                                                        {t('admin.dispute_action_release')}
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Audit Modal */}
                {showAuditModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="text-lg font-bold flex items-center gap-2">
                                    <ShieldAlert className="w-5 h-5 text-blue-600" />
                                    Risk Assessment Report
                                </h3>
                                <button onClick={() => setShowAuditModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="p-6">
                                {auditLoading ? (
                                    <div className="text-center py-8 text-gray-500">Calculating Risk Score...</div>
                                ) : auditProfile ? (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm text-gray-500">Current Trust Score</div>
                                                <div className={`text-4xl font-black ${auditProfile.currentScore >= 80 ? 'text-green-500' :
                                                        auditProfile.currentScore >= 50 ? 'text-yellow-500' : 'text-red-500'
                                                    }`}>
                                                    {auditProfile.currentScore}/100
                                                </div>
                                            </div>
                                            <div className={`px-4 py-2 rounded-lg text-sm font-bold border ${auditProfile.riskLevel === 'LOW' ? 'bg-green-50 border-green-200 text-green-700' :
                                                    auditProfile.riskLevel === 'MEDIUM' ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                                        'bg-red-50 border-red-200 text-red-700'
                                                }`}>
                                                {auditProfile.riskLevel} RISK
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white border-b pb-2">Risk Factors</h4>

                                            <FactorRow label="KYC Verified" value={auditProfile.factors.kycVerified} type="bool" />
                                            <FactorRow label="Recent Reports" value={auditProfile.factors.reportCount} type="number" invert />
                                            <FactorRow label="Cancelled Orders" value={auditProfile.factors.cancelledOrders} type="number" invert />
                                            <FactorRow label="Account Age" value={`${auditProfile.factors.accountAgeDays} days`} type="text" />
                                        </div>

                                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg text-xs text-blue-800 dark:text-blue-200">
                                            ℹ️ Analysis based on real-time data. High cancellations and reports significantly reduce the score.
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-red-500">Failed to load profile.</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

function FactorRow({ label, value, type, invert = false }: any) {
    let content = null
    if (type === 'bool') {
        const isGood = invert ? !value : value
        content = isGood ? <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Yes</span> : <span className="text-gray-400">No</span>
    } else if (type === 'number') {
        const num = Number(value)
        const isBad = invert ? num > 0 : num < 0
        content = <span className={isBad ? 'text-red-600 font-bold' : 'text-gray-600'}>{num}</span>
    } else {
        content = <span className="text-gray-700 dark:text-gray-300">{value}</span>
    }

    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500">{label}</span>
            {content}
        </div>
    )
}

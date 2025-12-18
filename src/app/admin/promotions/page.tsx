'use client'

import { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAdmin } from '@/contexts/AdminContext'
import {
    Megaphone, Plus, Calendar, Tag, Copy, Trash2,
    ToggleLeft, ToggleRight, X, Percent, DollarSign,
    MoreHorizontal
} from 'lucide-react'
import {
    getPromotions,
    createPromotion,
    togglePromotionStatus,
    deletePromotion,
    Promotion
} from '@/lib/admin/promotion-service'
import { Timestamp } from 'firebase/firestore'

export default function PromotionsPage() {
    const { t } = useLanguage()
    const { adminUser } = useAdmin()

    const [activeTab, setActiveTab] = useState<'active' | 'scheduled' | 'expired'>('active')
    const [promotions, setPromotions] = useState<Promotion[]>([])
    const [loading, setLoading] = useState(true)
    const [showCreateModal, setShowCreateModal] = useState(false)

    // Form State
    const [formData, setFormData] = useState({
        code: '',
        title: '',
        discountType: 'fixed',
        discountValue: 0,
        minSpend: 0,
        maxDiscount: 0,
        usageLimit: 100,
        startDate: '',
        endDate: ''
    })

    const fetchPromos = async () => {
        setLoading(true)
        // In real app, we pass activeTab to query differently, 
        // but for now let's fetch all and filter client side to utilize the service's filter
        const data = await getPromotions(activeTab)
        setPromotions(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchPromos()
    }, [activeTab])

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!adminUser) return

        // Validation
        if (new Date(formData.endDate) <= new Date(formData.startDate)) {
            alert('End date must be after Start date.')
            return
        }

        try {
            await createPromotion(adminUser, {
                code: formData.code.toUpperCase(),
                title: formData.title,
                discountType: formData.discountType as any,
                discountValue: Number(formData.discountValue),
                minSpend: Number(formData.minSpend),
                maxDiscount: Number(formData.maxDiscount),
                usageLimit: Number(formData.usageLimit),
                startDate: Timestamp.fromDate(new Date(formData.startDate)),
                endDate: Timestamp.fromDate(new Date(formData.endDate)),
                target: 'all',
                isActive: true
            })
            alert('Promotion created successfully!')
            setShowCreateModal(false)
            fetchPromos()
        } catch (error) {
            console.error(error)
            alert('Failed to create promotion')
        }
    }

    const handleToggle = async (id: string, currentStatus: boolean) => {
        if (!adminUser) return
        await togglePromotionStatus(adminUser, id, !currentStatus)
        // Optimistic update
        setPromotions(prev => prev.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p))
    }

    const handleDelete = async (id: string) => {
        if (!adminUser) return
        if (!confirm('Are you sure you want to delete this coupon?')) return
        await deletePromotion(adminUser, id)
        setPromotions(prev => prev.filter(p => p.id !== id))
    }

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        alert(t('admin.promo_alert_copied'))
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <Megaphone className="w-8 h-8 text-pink-500" />
                            {t('admin.promo_title')}
                        </h1>
                        <p className="text-gray-500">{t('admin.promo_desc')}</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        {t('admin.promo_btn_create')}
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
                    {['active', 'scheduled', 'expired'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab
                                ? 'border-pink-500 text-pink-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                        >
                            {t(`admin.promo_tab_${tab}`)}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500">
                            <tr>
                                <th className="px-6 py-4">{t('admin.promo_th_campaign')}</th>
                                <th className="px-6 py-4">{t('admin.promo_th_discount')}</th>
                                <th className="px-6 py-4">{t('admin.promo_th_usage')}</th>
                                <th className="px-6 py-4">{t('admin.promo_th_period')}</th>
                                <th className="px-6 py-4 text-center">{t('common.status')}</th>
                                <th className="px-6 py-4 text-right"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {loading ? (
                                <tr><td colSpan={6} className="text-center py-8">{t('common.loading')}</td></tr>
                            ) : promotions.length === 0 ? (
                                <tr><td colSpan={6} className="text-center py-8 text-gray-500">{t('common.no_data')}</td></tr>
                            ) : promotions.map(promo => (
                                <tr key={promo.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 group">
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-gray-900 dark:text-white">{promo.title}</div>
                                        <button
                                            onClick={() => copyCode(promo.code)}
                                            className="flex items-center gap-1 text-xs text-pink-600 bg-pink-50 dark:bg-pink-900/20 px-2 py-1 rounded w-fit mt-1 hover:bg-pink-100 dark:hover:bg-pink-900/40"
                                        >
                                            <Tag className="w-3 h-3" />
                                            {promo.code}
                                            <Copy className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {promo.discountType === 'percent' ? `${promo.discountValue}%` : `฿${promo.discountValue}`}
                                        </div>
                                        {promo.minSpend > 0 && (
                                            <div className="text-xs text-gray-500">Min spend: ฿{promo.minSpend}</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2bg-gray-200 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700">
                                                <div
                                                    className="h-full bg-pink-500"
                                                    style={{ width: `${Math.min(100, (promo.usageCount / promo.usageLimit) * 100)}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-xs text-gray-500">{promo.usageCount}/{promo.usageLimit}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-xs text-gray-500">
                                        <div>{promo.startDate?.toDate().toLocaleDateString()}</div>
                                        <div>- {promo.endDate?.toDate().toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => handleToggle(promo.id, promo.isActive)}>
                                            {promo.isActive ? (
                                                <ToggleRight className="w-8 h-8 text-green-500" />
                                            ) : (
                                                <ToggleLeft className="w-8 h-8 text-gray-400" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleDelete(promo.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                <h3 className="text-lg font-bold">{t('admin.promo_btn_create')}</h3>
                                <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">{t('admin.promo_label_title')}</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('admin.promo_label_code')}</label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.code}
                                            onChange={e => setFormData({ ...formData, code: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700 font-mono uppercase"
                                            placeholder={t('admin.promo_ph_code')}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('admin.promo_label_type')}</label>
                                        <select
                                            value={formData.discountType}
                                            onChange={e => setFormData({ ...formData, discountType: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                        >
                                            <option value="fixed">Fixed Amount (฿)</option>
                                            <option value="percent">Percentage (%)</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('admin.promo_label_value')}</label>
                                        <input
                                            required
                                            type="number"
                                            value={formData.discountValue}
                                            onChange={e => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">{t('admin.promo_label_min_spend')}</label>
                                        <input
                                            type="number"
                                            value={formData.minSpend}
                                            onChange={e => setFormData({ ...formData, minSpend: Number(e.target.value) })}
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Start Date</label>
                                        <input
                                            required type="date"
                                            value={formData.startDate}
                                            onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">End Date</label>
                                        <input
                                            required type="date"
                                            value={formData.endDate}
                                            onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                                            className="w-full px-3 py-2 border rounded-lg dark:bg-gray-900 dark:border-gray-700"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full py-3 bg-pink-600 text-white rounded-lg font-bold hover:bg-pink-700">
                                    {t('admin.promo_btn_create')}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    )
}

'use client'

import React, { useState } from 'react'
import { TrendingUp, Ticket, Megaphone, Zap, Plus, BarChart3 } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'
import CampaignModal from '@/components/seller/CampaignModal'

export default function SellerMarketingPage() {
    const { t } = useLanguage()
    const [isCreateOpen, setIsCreateOpen] = useState(false)
    const [campaigns, setCampaigns] = useState([
        { id: 1, name: 'Welcome New User', type: 'Voucher', discount: '฿50', status: 'Active', sales: 120 },
        { id: 2, name: 'Flash Sale 9.9', type: 'Flash Sale', discount: '15%', status: 'Ended', sales: 4500 }
    ])

    const handleCreate = (data: any) => {
        setCampaigns([...campaigns, {
            id: Date.now(),
            name: data.name,
            type: data.type === 'voucher' ? 'Voucher' : 'Flash Sale',
            discount: data.type === 'voucher' ? `฿${data.discountAmount}` : 'Custom',
            status: 'Active',
            sales: 0
        }])
        setIsCreateOpen(false)
    }

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('seller_marketing.title')}</h1>
                    <p className="text-gray-500">{t('seller_marketing.subtitle')}</p>
                </div>
                <Button onClick={() => setIsCreateOpen(true)} className="bg-gradient-to-r from-neon-purple to-pink-500 border-0 text-white">
                    <Plus className="w-5 h-5 mr-2" />
                    {t('seller_marketing.create_campaign')}
                </Button>
            </div>

            {/* AI Suggestion Box */}
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 rounded-2xl p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded uppercase">AI Insight</span>
                        </div>
                        <h3 className="text-xl font-bold mb-1">Target "Unknown Visitors" today!</h3>
                        <p className="text-indigo-200 text-sm max-w-lg">
                            We detected 150+ visitors who viewed items but didn't buy. sending a 5% off voucher could convert ~8% of them.
                        </p>
                    </div>
                    <Button
                        onClick={() => setIsCreateOpen(true)}
                        className="bg-white text-indigo-900 hover:bg-gray-100 font-bold border-0 whitespace-nowrap"
                    >
                        Use Suggestion &rarr;
                    </Button>
                </div>
            </div>

            {/* Marketing Tools */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-neon-purple transition-all group cursor-pointer" onClick={() => setIsCreateOpen(true)}>
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Ticket className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{t('seller_marketing.my_vouchers')}</h3>
                    <p className="text-sm text-gray-500 mb-4">Create coupons for your customers to increase conversion.</p>
                </div>

                <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-neon-purple transition-all group cursor-pointer">
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Zap className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{t('seller_marketing.flash_sale')}</h3>
                    <p className="text-sm text-gray-500 mb-4">Join platform flash sales to get massive exposure.</p>
                </div>

                <div className="bg-white dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 hover:border-neon-purple transition-all group cursor-pointer">
                    <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Megaphone className="w-6 h-6" />
                    </div>
                    <h3 className="font-bold text-lg mb-2">{t('seller_marketing.ad_manager')}</h3>
                    <p className="text-sm text-gray-500 mb-4">Promote your products in search results.</p>
                </div>
            </div>

            {/* Campaign List */}
            <div className="bg-white dark:bg-surface-dark rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h3 className="font-bold text-lg">{t('seller_marketing.active_campaigns')}</h3>
                    <Button variant="ghost" size="sm">{t('seller_marketing.view_history')}</Button>
                </div>
                <table className="w-full text-left">
                    <thead className="bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-500 uppercase">
                        <tr>
                            <th className="p-4 pl-6">{t('seller_marketing.campaign_name')}</th>
                            <th className="p-4">{t('seller_marketing.type')}</th>
                            <th className="p-4">{t('seller_marketing.discount')}</th>
                            <th className="p-4">{t('seller_marketing.status')}</th>
                            <th className="p-4 text-right pr-6">{t('seller_marketing.sales_generated')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                        {campaigns.map((c) => (
                            <tr key={c.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/20">
                                <td className="p-4 pl-6 font-medium">{c.name}</td>
                                <td className="p-4">
                                    <span className="flex items-center gap-2">
                                        {c.type === 'Voucher' ? <Ticket className="w-4 h-4 text-blue-500" /> : <Zap className="w-4 h-4 text-orange-500" />}
                                        {c.type}
                                    </span>
                                </td>
                                <td className="p-4">{c.discount}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${c.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {c.status}
                                    </span>
                                </td>
                                <td className="p-4 text-right pr-6 font-mono font-bold">
                                    {c.sales > 0 ? `฿${c.sales.toLocaleString()}` : '-'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <CampaignModal
                isOpen={isCreateOpen}
                onClose={() => setIsCreateOpen(false)}
                onSave={handleCreate}
            />
        </div>
    )
}

'use client'

import React from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import { Megaphone, Plus, TrendingUp, Users, MousePointer, DollarSign, ArrowLeft } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function ShopAdsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
                {/* Back Link */}
                <div className="mb-6">
                    <Link href="/seller/tools" className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Tools
                    </Link>
                </div>

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                            <Megaphone className="w-6 h-6 text-orange-500" />
                            Shop Ads
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Boost your product visibility and sales with targeted ads.</p>
                    </div>
                    <Button variant="primary">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Campaign
                    </Button>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <StatCard label="Impressions" value="12.5K" trend="+15%" icon={<Users className="w-5 h-5 text-blue-500" />} />
                    <StatCard label="Clicks" value="843" trend="+5%" icon={<MousePointer className="w-5 h-5 text-purple-500" />} />
                    <StatCard label="CTR" value="6.7%" trend="+0.2%" icon={<TrendingUp className="w-5 h-5 text-green-500" />} />
                    <StatCard label="Spend" value="฿2,450" trend="+10%" icon={<DollarSign className="w-5 h-5 text-orange-500" />} />
                </div>

                {/* Active Campaigns */}
                <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                        <h2 className="font-bold text-lg text-gray-900 dark:text-white">Active Campaigns</h2>
                        <div className="flex gap-2">
                            <select className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1 text-sm text-gray-700 dark:text-gray-300">
                                <option>Last 7 Days</option>
                                <option>Last 30 Days</option>
                            </select>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                                <tr>
                                    <th className="px-6 py-4">Campaign Name</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Budget</th>
                                    <th className="px-6 py-4">Impressions</th>
                                    <th className="px-6 py-4">Clicks</th>
                                    <th className="px-6 py-4">ROI</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-700 dark:text-gray-200">
                                <CampaignRow
                                    name="iPhone 15 Pro Promo"
                                    status="Active"
                                    budget="฿500/day"
                                    impressions="5,230"
                                    clicks="342"
                                    roi="4.5x"
                                />
                                <CampaignRow
                                    name="Sneakers Clearance"
                                    status="Paused"
                                    budget="฿300/day"
                                    impressions="2,100"
                                    clicks="120"
                                    roi="2.1x"
                                />
                                <CampaignRow
                                    name="Vintage Watch Collection"
                                    status="Completed"
                                    budget="Total ฿5,000"
                                    impressions="45K"
                                    clicks="3,500"
                                    roi="6.8x"
                                />
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    )
}

function StatCard({ label, value, trend, icon }: any) {
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-gray-50 dark:bg-gray-900 rounded-lg">{icon}</div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend.startsWith('+') ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                    {trend}
                </span>
            </div>
            <div className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">{value}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm">{label}</div>
        </div>
    )
}

function CampaignRow({ name, status, budget, impressions, clicks, roi }: any) {
    const statusColors: Record<string, string> = {
        Active: 'bg-green-100 text-green-600',
        Paused: 'bg-yellow-100 text-yellow-600',
        Completed: 'bg-gray-100 text-gray-600',
    }

    return (
        <tr className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <td className="px-6 py-4 font-medium">{name}</td>
            <td className="px-6 py-4">
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusColors[status]}`}>
                    {status}
                </span>
            </td>
            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{budget}</td>
            <td className="px-6 py-4">{impressions}</td>
            <td className="px-6 py-4">{clicks}</td>
            <td className="px-6 py-4 font-bold text-green-600">{roi}</td>
            <td className="px-6 py-4 text-right">
                <button className="text-neon-purple hover:underline text-xs font-bold">Manage</button>
            </td>
        </tr>
    )
}

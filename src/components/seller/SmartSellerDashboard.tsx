'use client'

import React, { useEffect, useState } from 'react'
import {
    Sparkles,
    ShieldCheck,
    TrendingUp,
    Zap,
    Clock,
    Camera,
    Award,
    BarChart3,
    Target
} from 'lucide-react'
import { getSmartSellerStats, SmartSellerStats } from '@/services/mockAI'

export default function SmartSellerDashboard() {
    const [stats, setStats] = useState<SmartSellerStats | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchStats = async () => {
            const data = await getSmartSellerStats('current_user')
            setStats(data)
            setLoading(false)
        }
        fetchStats()
    }, [])

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium animate-pulse">Running AI Store Analysis...</p>
            </div>
        </div>
    )

    if (!stats) return null

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 space-y-8">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in slide-in-from-top duration-500">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="w-5 h-5 text-purple-600" />
                        <span className="text-xs font-bold tracking-wider text-purple-600 uppercase">AI Smart Profile 2.0</span>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900">Seller Intelligence Center</h1>
                    <p className="text-gray-500">วิเคราะห์และยกระดับร้านค้าของคุณด้วย AI</p>
                </div>

                {/* Trust Score Card */}
                <div className="bg-white p-4 rounded-2xl shadow-sm border border-purple-100 flex items-center gap-4 min-w-[280px]">
                    <div className="relative w-16 h-16 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-gray-100" />
                            <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="4" fill="transparent"
                                className="text-purple-600"
                                strokeDasharray={175.9}
                                strokeDashoffset={175.9 - (175.9 * stats.trust_score) / 100}
                            />
                        </svg>
                        <span className="absolute text-lg font-bold text-purple-700">{stats.trust_score}</span>
                    </div>
                    <div>
                        <div className="text-sm font-medium text-gray-500">AI Trust Score</div>
                        <div className="text-lg font-bold text-gray-900">Elite Seller</div>
                        <div className="flex gap-1 mt-1">
                            {stats.badges.map(badge => (
                                <span key={badge} className="text-[10px] px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </header>

            {/* AI Coaching Center */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom duration-700 delay-100">
                <div className="col-span-1 lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Zap className="w-6 h-6 text-yellow-500" />
                            AI Coaching (แนะนำรายวัน)
                        </h2>
                    </div>

                    <div className="grid gap-4">
                        {stats.coaching.map((tip, idx) => (
                            <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex gap-4 group">
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                                    ${tip.type === 'photo' ? 'bg-blue-50 text-blue-600' :
                                        tip.type === 'pricing' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                                    {tip.type === 'photo' ? <Camera className="w-6 h-6" /> :
                                        tip.type === 'pricing' ? <TrendingUp className="w-6 h-6" /> : <Target className="w-6 h-6" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide
                                            ${tip.impact === 'high' ? 'bg-red-50 text-red-600' : 'bg-gray-100 text-gray-600'}`}>
                                            {tip.impact} Impact
                                        </span>
                                        <span className="text-xs text-gray-400 capitalize">{tip.type} Strategy</span>
                                    </div>
                                    <p className="text-gray-800 font-medium group-hover:text-purple-700 transition-colors">
                                        {tip.tip}
                                    </p>
                                </div>
                                <button className="self-center px-4 py-2 bg-gray-50 text-gray-600 text-sm font-medium rounded-lg hover:bg-purple-50 hover:text-purple-600 transition-colors">
                                    ทำเลย
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shop Insights Details */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-6 h-fit">
                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        Shop Insights 7 วัน
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-purple-50 p-4 rounded-2xl">
                            <p className="text-xs text-purple-600 mb-1">ยอดคนดู (Views)</p>
                            <div className="text-2xl font-bold text-gray-900">{stats.insights.views_7d.toLocaleString()}</div>
                            <div className="text-xs text-green-600 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +12%
                            </div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-2xl">
                            <p className="text-xs text-green-600 mb-1">ยอดขาย (Sales)</p>
                            <div className="text-2xl font-bold text-gray-900">฿{stats.insights.sales_7d.toLocaleString()}</div>
                            <div className="text-xs text-green-600 flex items-center gap-1">
                                <TrendingUp className="w-3 h-3" /> +5%
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <h4 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-orange-500" />
                            เวลาโพสต์ที่ดีที่สุด (AI Predicted)
                        </h4>
                        <div className="bg-gradient-to-r from-orange-400 to-pink-500 text-white p-4 rounded-xl shadow-lg shadow-orange-200">
                            <div className="text-center">
                                <div className="text-3xl font-bold mb-1">{stats.insights.best_posting_time}</div>
                                <p className="text-xs text-white/90">มีโอกาสปิดการขายเพิ่มขึ้น 2.5 เท่า</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO & Keywords */}
            <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 animate-in slide-in-from-bottom duration-700 delay-200">
                <h3 className="font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Target className="w-5 h-5 text-blue-600" />
                    AI Keyword Opportunities
                    <span className="text-xs font-normal text-gray-400 ml-2">คีย์เวิร์ดทำเงินที่คุณควรใช้</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {stats.seo_suggestions.map((kw, idx) => (
                        <div key={idx} className="border border-gray-100 rounded-xl p-4 hover:border-blue-200 transition-colors cursor-pointer group">
                            <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-gray-800 group-hover:text-blue-600">"{kw.keyword}"</h4>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full
                                    ${kw.competition === 'high' ? 'bg-red-50 text-red-600' :
                                        kw.competition === 'medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
                                    Comp: {kw.competition}
                                </span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                                <span>Volume: <span className="text-gray-900 font-medium">{kw.volume}</span></span>
                                <span className="text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                    ใช้เลย &rarr;
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

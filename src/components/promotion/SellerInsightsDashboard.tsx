'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    TrendingUp, Eye, MessageCircle, Star, Zap,
    ChevronRight, Target, Brain, ArrowUpRight,
    ArrowDownRight, Info, Sparkles, LayoutDashboard,
    BarChart3, Users, MousePointer2, Percent
} from 'lucide-react'

import AIAnalystSummary from './AIAnalystSummary'
import { getSellerInsights, SellerInsights } from '@/lib/promotion/insightsService'
import { useAuth } from '@/contexts/AuthContext'
import PredictiveROICalculator from './PredictiveROICalculator'
import PriceBenchmark from './PriceBenchmark'

// ==========================================
// TYPES
// ==========================================

interface InsightMetric {
    label: string
    value: string | number
    change: number
    trend: 'up' | 'down'
    icon: React.ReactNode
    color: string
}

// ==========================================
// COMPONENTS
// ==========================================

export default function SellerInsightsDashboard() {
    const { user } = useAuth()
    const [activeTab, setActiveTab] = useState<'overview' | 'predictions' | 'competitors'>('overview')
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState<SellerInsights | null>(null)

    React.useEffect(() => {
        if (user) {
            fetchData()
        }
    }, [user])

    const fetchData = async () => {
        try {
            setLoading(true)
            const insights = await getSellerInsights(user!.uid)
            setData(insights)
        } catch (error) {
            console.error('Failed to load insights:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                    <p className="text-slate-400 font-bold animate-pulse uppercase tracking-[0.2em] text-xs">Synchronizing AI Data...</p>
                </div>
            </div>
        )
    }

    const { metrics: m, funnel: f } = data || {
        metrics: { total_impressions: 0, total_clicks: 0, ctr: 0, total_leads: 0, roas: 0 },
        funnel: { impressions: 0, clicks: 0, leads: 0 }
    }

    const metrics: InsightMetric[] = [
        {
            label: 'Total Impressions',
            value: m.total_impressions.toLocaleString(),
            change: 12.5,
            trend: 'up',
            icon: <Eye className="w-5 h-5" />,
            color: 'blue'
        },
        {
            label: 'Ad Clicks (CTR)',
            value: `${m.ctr}%`,
            change: -2.1,
            trend: 'down',
            icon: <MousePointer2 className="w-5 h-5" />,
            color: 'purple'
        },
        {
            label: 'Chat Leads',
            value: m.total_leads.toString(),
            change: 8.4,
            trend: 'up',
            icon: <MessageCircle className="w-5 h-5" />,
            color: 'green'
        },
        {
            label: 'ROAS (Ad Stars)',
            value: `${m.roas}x`,
            change: 15.2,
            trend: 'up',
            icon: <Percent className="w-5 h-5" />,
            color: 'yellow'
        }
    ]

    return (
        <div className="min-h-screen bg-[#0F172A] text-slate-200 p-6 font-primary">
            {/* Header Content */}
            <div className="max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-bold rounded uppercase tracking-wider flex items-center gap-1">
                                <Brain className="w-3 h-3" />
                                AI Copilot Active
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-white via-slate-200 to-slate-500 bg-clip-text text-transparent">
                            Seller Insights Hub
                        </h1>
                        <p className="text-slate-400 mt-1">
                            วิเคราะห์และคาดการณ์ผลโฆษณาด้วย JaiKod AI Intelligence
                        </p>
                    </div>

                    <div className="flex gap-2 p-1 bg-slate-800/50 backdrop-blur-xl rounded-xl border border-slate-700">
                        <TabButton
                            active={activeTab === 'overview'}
                            onClick={() => setActiveTab('overview')}
                            icon={<LayoutDashboard className="w-4 h-4" />}
                            label="Overview"
                        />
                        <TabButton
                            active={activeTab === 'predictions'}
                            onClick={() => setActiveTab('predictions')}
                            icon={<Sparkles className="w-4 h-4" />}
                            label="AI Predictions"
                        />
                        <TabButton
                            active={activeTab === 'competitors'}
                            onClick={() => setActiveTab('competitors')}
                            icon={<Users className="w-4 h-4" />}
                            label="Market Pulse"
                        />
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
                    {metrics.map((m, idx) => (
                        <MetricCard key={idx} metric={m} />
                    ))}
                </div>

                {/* AI Summary Section - NEW */}
                <div className="space-y-8 mb-8">
                    {data && <AIAnalystSummary data={data} />}
                    <PredictiveROICalculator />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Chart Area */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700" />

                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        Performance Funnel
                                        <Info className="w-4 h-4 text-slate-500 cursor-help" />
                                    </h3>
                                    <p className="text-sm text-slate-400">การวิเคราะห์พฤติกรรมผู้ซื้อจากสื่อโฆษณา</p>
                                </div>
                                <select className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 ring-purple-500/50">
                                    <option>Last 7 Days</option>
                                    <option>Last 30 Days</option>
                                </select>
                            </div>

                            {/* Funnel Visualization */}
                            <div className="space-y-4">
                                <FunnelStep
                                    label="Discovery (Impressions)"
                                    value={f.impressions.toLocaleString()}
                                    percent={100}
                                    count="Baseline"
                                    color="#3B82F6"
                                />
                                <FunnelStep
                                    label="Interest (Clicks)"
                                    value={f.clicks.toLocaleString()}
                                    percent={m.ctr}
                                    count={`${m.ctr}% CTR`}
                                    color="#8B5CF6"
                                />
                                <FunnelStep
                                    label="Action (Chat Leads)"
                                    value={f.leads.toLocaleString()}
                                    percent={(f.leads / (f.clicks || 1)) * 100}
                                    count={`${((f.leads / (f.clicks || 1)) * 100).toFixed(1)}% Conv`}
                                    color="#10B981"
                                />
                            </div>
                        </section>

                        <section className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
                            <h3 className="text-xl font-bold text-white mb-6">Top Boosted Products</h3>
                            <div className="space-y-4">
                                {data?.top_products && data.top_products.length > 0 ? (
                                    data.top_products.map((product) => (
                                        <ProductRankItem
                                            key={product.id}
                                            title={product.title}
                                            price={`฿${product.price.toLocaleString()}`}
                                            views={product.views}
                                            clickRate={product.ctr}
                                            status={product.status}
                                        />
                                    ))
                                ) : (
                                    <div className="text-center py-10">
                                        <p className="text-slate-500 text-sm">ยังไม่มีข้อมูลสินค้าที่ถูก Boost ในขณะนี้</p>
                                    </div>
                                )}
                            </div>
                        </section>
                    </div>

                    {/* AI Copilot Sidebar */}
                    <div className="space-y-6">
                        <section className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-3xl p-8 text-white relative shadow-2xl shadow-purple-900/20 overflow-hidden">
                            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 blur-3xl rounded-full" />
                            <Sparkles className="w-10 h-10 mb-4 opacity-80" />
                            <h3 className="text-2xl font-black mb-2 leading-tight">AI Recommendation</h3>
                            <p className="text-purple-100 text-sm mb-6 leading-relaxed">
                                "ขณะนี้ดีมานด์สินค้า <span className="font-bold underline">iPhone</span> ในพื้นที่ <span className="font-bold underline">อารีย์, กรุงเทพ</span> กำลังพุ่งสูงขึ้น 45%"
                            </p>
                            <button className="w-full py-4 bg-white text-purple-700 font-black rounded-2xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2 shadow-xl shadow-black/10">
                                <Zap className="w-5 h-5 fill-current" />
                                BOOST NOW
                            </button>
                        </section>

                        <section className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Target className="w-5 h-5 text-red-400" />
                                Market Pulse
                            </h3>
                            <div className="space-y-6">
                                <PriceBenchmark
                                    productTitle="iPhone 15 Pro Max"
                                    currentPrice={38500}
                                    avgMarketPrice={39900}
                                    category="Mobile & Gadget"
                                />
                                <div className="p-4 bg-slate-900/50 rounded-2xl border border-white/5 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">Response Time</span>
                                        <span className="text-xs font-bold text-emerald-400">Excellent</span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <div className="h-full bg-emerald-500" style={{ width: '92%' }} />
                                    </div>
                                    <p className="text-[10px] text-slate-500">คุณตอบแชทเร็วกว่าร้านอื่น 92% ในหมวดหมู่นี้</p>
                                </div>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ==========================================
// SUB-COMPONENTS
// ==========================================

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg text-sm font-bold transition-all ${active
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
        >
            {icon}
            {label}
        </button>
    )
}

function MetricCard({ metric }: { metric: InsightMetric }) {
    return (
        <div className="bg-slate-800/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 hover:translate-y-[-4px] transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-2xl bg-${metric.color}-500/10 text-${metric.color}-500`}>
                    {metric.icon}
                </div>
                <span className="text-slate-400 text-sm font-medium">{metric.label}</span>
            </div>
            <div className="flex items-end justify-between">
                <span className="text-3xl font-black text-white">{metric.value}</span>
                <div className={`flex items-center gap-0.5 text-xs font-bold ${metric.trend === 'up' ? 'text-emerald-400' : 'text-rose-400'
                    }`}>
                    {metric.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                    {metric.change}%
                </div>
            </div>
        </div>
    )
}

function FunnelStep({ label, value, percent, count, color }: any) {
    return (
        <div className="relative group">
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{label}</span>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-medium text-slate-500">{count}</span>
                    <span className="text-sm font-black text-white">{value}</span>
                </div>
            </div>
            <div className="h-4 w-full bg-slate-900/50 rounded-full overflow-hidden p-0.5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    className="h-full rounded-full relative"
                    style={{ backgroundColor: color }}
                >
                    <div className="absolute inset-0 bg-white/20 blur-sm mix-blend-overlay" />
                </motion.div>
            </div>
        </div>
    )
}

function ProductRankItem({ title, price, views, clickRate, status }: any) {
    const isAlert = status === 'Price Sensitive'

    return (
        <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-700/30 transition-all border border-transparent hover:border-slate-600/50 group">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-xl">📷</div>
                <div>
                    <h4 className="font-bold text-white group-hover:text-purple-400 transition-colors uppercase tracking-tight">{title}</h4>
                    <span className="text-slate-400 text-sm font-black">{price}</span>
                </div>
            </div>
            <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${isAlert ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'
                        }`}>
                        {status}
                    </span>
                    <span className="text-sm font-bold text-white">{views.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">views</span></span>
                </div>
                <div className="text-xs text-slate-500 font-medium">{clickRate}% CTR</div>
            </div>
        </div>
    )
}


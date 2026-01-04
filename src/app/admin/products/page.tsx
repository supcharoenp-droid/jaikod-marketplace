'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAdmin } from '@/contexts/AdminContext'
import {
    getAdminProducts,
    getProductStats,
    approveProduct,
    rejectProduct,
    freezeProduct,
    flagProduct,
    analyzeProductWithAI,
    AdminProduct
} from '@/lib/admin/product-service'
import {
    Package,
    Search,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Eye,
    Lock,
    Flag,
    TrendingUp,
    Shield,
    Zap,
    BrainCircuit,
    ChevronRight,
    Filter,
    Activity,
    Box,
    Sparkles,
    MousePointer2,
    Clock,
    UserCheck,
    Image as ImageIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { th, enUS } from 'date-fns/locale'
import Image from 'next/image'

export default function ProductManagementWorldClass() {
    const { language, t } = useLanguage()
    const { adminUser } = useAdmin()
    const [products, setProducts] = useState<AdminProduct[]>([])
    const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, suspended: 0 })
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [selectedProduct, setSelectedProduct] = useState<AdminProduct | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [aiResult, setAiResult] = useState<any>(null)

    useEffect(() => {
        loadData()
    }, [filterStatus])

    useEffect(() => {
        if (selectedProduct) {
            setAiResult((selectedProduct as any).ai_analysis || null)
        } else {
            setAiResult(null)
        }
    }, [selectedProduct])

    const loadData = async () => {
        setLoading(true)
        try {
            const [prodData, statsData] = await Promise.all([
                getAdminProducts({ status: filterStatus, search: searchTerm }),
                getProductStats()
            ])
            setProducts(prodData)
            setStats(statsData)
        } catch (error) {
            console.error('Error loading products:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleAction = async (action: 'approve' | 'reject' | 'freeze' | 'flag', product: AdminProduct) => {
        if (!adminUser) return
        setIsProcessing(true)
        try {
            if (action === 'approve') {
                if (!confirm(t('admin.confirm_approve') || 'Approve this product?')) return
                await approveProduct(adminUser, product.id)
            } else if (action === 'reject') {
                const r = prompt(t('admin.reason_reject') || 'Reason for rejection:')
                if (!r) return
                await rejectProduct(adminUser, product.id, r)
            } else if (action === 'freeze') {
                const r = prompt(t('admin.reason_freeze') || 'Reason for freezing:')
                if (!r) return
                await freezeProduct(adminUser, product.id, r)
            } else if (action === 'flag') {
                const r = prompt(t('admin.reason_flag') || 'Reason for flagging:')
                if (!r) return
                await flagProduct(adminUser, product.id, r)
            }
            setSelectedProduct(null)
            loadData()
        } catch (e) {
            alert('Operation failed')
        } finally {
            setIsProcessing(false)
        }
    }

    const runAIAnalysis = async (product: AdminProduct) => {
        if (isAnalyzing) return
        setIsAnalyzing(true)
        try {
            const result = await analyzeProductWithAI(product.id)
            setAiResult(result)
            setProducts(products.map(p => p.id === product.id ? { ...p, ai_analysis: result } as any : p))
        } catch (error) {
            alert('AI analysis failed')
        } finally {
            setIsAnalyzing(false)
        }
    }

    return (
        <AdminLayout>
            <div className="p-6 max-w-[1600px] mx-auto space-y-8 min-h-screen">
                {/* Header Section */}
                <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-4">
                            <div className="p-4 bg-purple-600 rounded-[20px] shadow-xl shadow-purple-500/20">
                                <Box className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                                    {t('admin.menu_products') || 'Smart Inventory'}
                                    <span className="bg-gradient-to-r from-purple-600 to-indigo-600 text-[10px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest animate-pulse">
                                        Mod-Genius Active
                                    </span>
                                </h1>
                                <p className="text-gray-500 font-medium">
                                    {t('admin.products_management_desc') || 'World-class AI-assisted content moderation for your marketplace listings.'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {[
                            { label: t('admin.products_total'), val: stats.total, color: 'purple', icon: Package },
                            { label: t('admin.products_active'), val: stats.active, color: 'emerald', icon: Activity },
                            { label: t('admin.products_pending'), val: stats.pending, color: 'amber', icon: Clock },
                            { label: t('admin.products_suspended'), val: stats.suspended, color: 'rose', icon: Lock }
                        ].map((stat, i) => {
                            const Icon = stat.icon
                            const colorClasses: any = {
                                purple: 'bg-purple-500/10 text-purple-600',
                                emerald: 'bg-emerald-500/10 text-emerald-600',
                                amber: 'bg-amber-500/10 text-amber-600',
                                rose: 'bg-rose-500/10 text-rose-600'
                            }
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 min-w-[140px]"
                                >
                                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${colorClasses[stat.color].split(' ')[0]}`}>
                                        <Icon className={`w-5 h-5 ${colorClasses[stat.color].split(' ')[1]}`} />
                                    </div>
                                    <div>
                                        <p className="text-[9px] uppercase font-black text-gray-400 tracking-wider font-mono">{stat.label}</p>
                                        <p className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{stat.val.toLocaleString()}</p>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: Product List */}
                    <div className="flex-1 space-y-6">
                        {/* Toolbar Container */}
                        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-4 rounded-[32px] border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col md:flex-row items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={t('admin.search_products')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-purple-500 dark:text-white text-sm"
                                />
                            </div>
                            <div className="flex gap-2 p-1 bg-gray-100/50 dark:bg-gray-900 rounded-2xl">
                                {['all', 'active', 'pending', 'suspended'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFilterStatus(s)}
                                        className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${filterStatus === s ? 'bg-white dark:bg-gray-800 shadow-sm text-purple-600' : 'text-gray-500'}`}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl" />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                                <AnimatePresence mode='popLayout'>
                                    {products.map((p, idx) => (
                                        <motion.div
                                            key={p.id}
                                            layout
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.9 }}
                                            transition={{ delay: idx * 0.02 }}
                                            onClick={() => setSelectedProduct(p)}
                                            className={`group relative bg-white dark:bg-gray-800 p-4 rounded-[28px] border-2 cursor-pointer transition-all ${selectedProduct?.id === p.id ? 'border-purple-500 ring-4 ring-purple-500/10' : 'border-transparent hover:border-gray-200 shadow-sm hover:shadow-xl'}`}
                                        >
                                            <div className="flex gap-4">
                                                <div className="w-20 h-20 relative rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                    {p.images?.[0] ? <Image src={p.images[0].url} alt={p.title} fill className="object-cover" /> : <Package className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-300" />}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-bold text-gray-900 dark:text-white truncate leading-tight">{p.title}</h3>
                                                    <p className="text-xs text-purple-600 font-extrabold font-mono mt-1">฿{p.price.toLocaleString()}</p>
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <span className={`px-2 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${p.status === 'active' ? 'bg-emerald-100 text-emerald-700' : p.status === 'suspended' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>
                                                            {p.status}
                                                        </span>
                                                        {(p as any).ai_analysis && (
                                                            <div className="flex items-center gap-1.5 px-2 py-0.5 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 rounded-lg text-[8px] font-black">
                                                                <Zap className="w-2.5 h-2.5" />
                                                                {(p as any).ai_analysis.qualityScore}%
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-purple-500 self-center" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Right Column: AI Detail Review Panel */}
                    <div className="w-full lg:w-[450px] 2xl:w-[550px] space-y-6">
                        <AnimatePresence mode='wait'>
                            {selectedProduct ? (
                                <motion.div
                                    key={selectedProduct.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="sticky top-6 bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-2xl flex flex-col max-h-[calc(100vh-60px)]"
                                >
                                    {/* Quick Image Preview */}
                                    <div className="p-4">
                                        <div className="w-full aspect-video relative rounded-[28px] overflow-hidden bg-gray-100">
                                            {selectedProduct.images?.[0] ? <Image src={selectedProduct.images[0].url} alt="" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>}
                                            <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 backdrop-blur-md rounded-full text-white transition-colors">
                                                <XCircle className="w-6 h-6" />
                                            </button>
                                            <div className="absolute bottom-4 left-4 flex gap-2">
                                                <span className="px-3 py-1 bg-white/90 backdrop-blur-md text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg">ID: {selectedProduct.id.slice(0, 8)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content Area */}
                                    <div className="px-8 pb-8 space-y-8 overflow-y-auto scrollbar-hide">
                                        <div>
                                            <h2 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{selectedProduct.title}</h2>
                                            <div className="mt-4 flex items-center gap-6">
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('admin.table_price')}</p>
                                                    <p className="text-xl font-black text-purple-600">฿{selectedProduct.price.toLocaleString()}</p>
                                                </div>
                                                <div className="h-8 w-px bg-gray-100 dark:bg-gray-700" />
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Seller</p>
                                                    <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{selectedProduct.seller_name}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI Analysis Panel */}
                                        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20 p-6 rounded-[32px] border border-purple-100 dark:border-purple-800/40 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                                    <h3 className="font-black text-purple-800 dark:text-purple-300 uppercase tracking-tight text-sm">AI Content Guard</h3>
                                                </div>
                                                {!aiResult ? (
                                                    <button onClick={() => runAIAnalysis(selectedProduct)} disabled={isAnalyzing} className="px-4 py-2 bg-white dark:bg-gray-800 text-purple-600 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:scale-105 transition-transform disabled:opacity-50 border border-purple-100 dark:border-purple-800">
                                                        {isAnalyzing ? 'Scanning...' : 'Run Smart Scan'}
                                                    </button>
                                                ) : (
                                                    <div className="px-3 py-1 bg-green-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest animate-in zoom-in-50">Verified Analysis</div>
                                                )}
                                            </div>

                                            {aiResult ? (
                                                <div className="space-y-4">
                                                    <div className="flex items-end gap-2">
                                                        <span className="text-5xl font-black text-purple-600 leading-none">{aiResult.qualityScore}</span>
                                                        <span className="text-xs font-bold text-purple-400 pb-1 uppercase tracking-widest">Quality Score</span>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="bg-white/50 dark:bg-black/20 p-3 rounded-2xl border border-white/50">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Risk Level</p>
                                                            <span className="text-xs font-black text-emerald-600 uppercase">{aiResult.riskLevel}</span>
                                                        </div>
                                                        <div className="bg-white/50 dark:bg-black/20 p-3 rounded-2xl border border-white/50">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                                                            <span className="text-xs font-black text-purple-600 uppercase">Passed</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">AI Recommendations</p>
                                                        {aiResult.suggestions.map((s: string, i: number) => (
                                                            <div key={i} className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 font-medium">
                                                                <div className="w-1 h-1 bg-purple-400 rounded-full" />
                                                                {s}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                                                    <BrainCircuit className="w-12 h-12 text-purple-200 dark:text-purple-800 animate-pulse" />
                                                    <p className="text-[10px] font-bold text-purple-400 dark:text-purple-600 uppercase tracking-widest leading-relaxed">
                                                        AI Engine waiting to analyze<br />images & description metadata
                                                    </p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Moderation Actions */}
                                        <div className="space-y-4">
                                            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight text-sm flex items-center gap-2">
                                                <Shield className="w-5 h-5 text-gray-400" />
                                                Management Actions
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                {selectedProduct.status !== 'active' && (
                                                    <button onClick={() => handleAction('approve', selectedProduct)} disabled={isProcessing} className="w-full py-4 bg-emerald-600 text-white rounded-3xl font-black text-sm shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                                                        <CheckCircle className="w-5 h-5" />
                                                        Approve
                                                    </button>
                                                )}
                                                {selectedProduct.status === 'active' && (
                                                    <button onClick={() => handleAction('freeze', selectedProduct)} disabled={isProcessing} className="w-full py-4 bg-rose-50 dark:bg-rose-900/10 text-rose-600 rounded-3xl font-black text-sm hover:bg-rose-100 transition-all flex items-center justify-center gap-2">
                                                        <Lock className="w-5 h-5" />
                                                        Freeze
                                                    </button>
                                                )}
                                                <button onClick={() => handleAction('flag', selectedProduct)} disabled={isProcessing} className="w-full py-4 bg-gray-50 dark:bg-gray-700 rounded-3xl font-black text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 transition-all flex items-center justify-center gap-2">
                                                    <Flag className="w-5 h-5" />
                                                    Flag Listing
                                                </button>
                                                <button onClick={() => handleAction('reject', selectedProduct)} disabled={isProcessing} className="w-full py-4 text-rose-600 font-bold hover:bg-rose-50 rounded-3xl transition-all">
                                                    Delete Listing
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
                                    <div className="w-32 h-32 bg-gray-50 dark:bg-gray-800 rounded-[40px] flex items-center justify-center">
                                        <MousePointer2 className="w-12 h-12 text-gray-200 animate-bounce" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white">Smart Selection Required</h3>
                                        <p className="text-gray-500 text-sm max-w-[280px] mx-auto font-medium">
                                            Choose a product to activate AI forensic review and content quality assessment.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </AdminLayout>
    )
}

function PackIcon({ className }: { className?: string }) {
    return <Package className={className} />
}

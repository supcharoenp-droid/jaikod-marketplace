'use client'

import React, { useState, useEffect } from 'react'
import AdminLayout from '@/components/admin/AdminLayout'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAdmin } from '@/contexts/AdminContext'
import { getSellers, approveSellerKYC, rejectSellerKYC, analyzeSellerKYC, Seller } from '@/lib/admin/seller-service'
import {
    UserCog,
    Search,
    CheckCircle,
    XCircle,
    FileText,
    Shield,
    Zap,
    TrendingUp,
    AlertTriangle,
    ChevronRight,
    MousePointer2,
    Eye,
    MoreHorizontal,
    Clock,
    UserCheck,
    Award,
    Sparkles,
    SearchCheck,
    Lock,
    BrainCircuit,
    Fingerprint,
    Network,
    Activity
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { format } from 'date-fns'
import { th, enUS } from 'date-fns/locale'
import Image from 'next/image'

export default function PendingSellersApproval() {
    const { language, t } = useLanguage()
    const { adminUser } = useAdmin()
    const [sellers, setSellers] = useState<Seller[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedSeller, setSelectedSeller] = useState<Seller | null>(null)
    const [rejectReason, setRejectReason] = useState('')
    const [isProcessing, setIsProcessing] = useState(false)
    const [aiAnalysis, setAiAnalysis] = useState<any>(null)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    useEffect(() => {
        if (selectedSeller) {
            setAiAnalysis(selectedSeller.aiKYCAssessment || null)
        } else {
            setAiAnalysis(null)
        }
    }, [selectedSeller])

    useEffect(() => {
        fetchPendingSellers()
    }, [])

    const fetchPendingSellers = async () => {
        setLoading(true)
        try {
            const result = await getSellers({ kycStatus: 'pending' })
            setSellers(result)
        } catch (error) {
            console.error('Error fetching pending sellers:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleApprove = async (seller: Seller) => {
        if (!adminUser) return
        if (confirm(t('sellers_pending.confirm_approve', { name: seller.displayName }) || `Approve ${seller.displayName}?`)) {
            setIsProcessing(true)
            try {
                await approveSellerKYC(adminUser, seller.id)
                alert(t('sellers_pending.verification_success') || 'Approved')
                setSellers(sellers.filter(s => s.id !== seller.id))
                setSelectedSeller(null)
            } catch (error) {
                alert('Approve failed')
            } finally {
                setIsProcessing(false)
            }
        }
    }

    const handleReject = async (seller: Seller) => {
        if (!adminUser) return
        if (!rejectReason) {
            const reason = prompt(t('sellers_pending.reject_reason_placeholder') || 'Enter rejection reason:')
            if (!reason) return
            setRejectReason(reason)
        }

        if (confirm(t('sellers_pending.confirm_reject', { name: seller.displayName }) || `Reject ${seller.displayName}?`)) {
            setIsProcessing(true)
            try {
                await rejectSellerKYC(adminUser, seller.id, rejectReason)
                alert(t('sellers_pending.rejection_success') || 'Rejected')
                setSellers(sellers.filter(s => s.id !== seller.id))
                setSelectedSeller(null)
            } catch (error) {
                alert('Reject failed')
            } finally {
                setIsProcessing(false)
                setRejectReason('')
            }
        }
    }

    const runAIAnalysis = async (seller: Seller) => {
        if (isAnalyzing) return
        setIsAnalyzing(true)
        try {
            // Document URLs from seller data
            const docs = seller.kycDocuments || []
            const result = await analyzeSellerKYC(seller.id, {
                idCard: docs[0], // In real app, these would be indexed correctly
                portrait: docs[1],
                businessReg: docs[2]
            })
            setAiAnalysis(result)

            // Update local state to show it was analyzed 
            setSellers(sellers.map(s => s.id === seller.id ? { ...s, aiKYCAssessment: result } : s))
        } catch (error) {
            console.error('AI Analysis failed:', error)
            alert('AI Analysis failed. Check if API keys are configured.')
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
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                                <SearchCheck className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                                    {t('sellers_pending.title') || 'KYC Approval Center'}
                                    <span className="bg-gradient-to-r from-blue-600 to-indigo-600 text-[10px] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-widest animate-pulse">
                                        AI Active
                                    </span>
                                </h1>
                                <p className="text-gray-500 font-medium">
                                    {t('sellers_pending.desc') || 'Verify new sellers with AI assistance'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {[
                            { label: t('sellers_pending.stats_pending'), val: sellers.length, color: 'blue', icon: Clock },
                            { label: t('sellers_pending.stats_verified_today'), val: 12, color: 'green', icon: UserCheck },
                            { label: t('sellers_pending.stats_rejected_today'), val: 2, color: 'red', icon: XCircle }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white dark:bg-gray-800 p-4 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4 min-w-[200px]"
                            >
                                <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-900/20 flex items-center justify-center`}>
                                    <stat.icon className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                                </div>
                                <div>
                                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider font-mono">{stat.label}</p>
                                    <p className="text-2xl font-black text-gray-900 dark:text-white">{stat.val}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Column: List/Grid of Pending Items */}
                    <div className="flex-1 space-y-6">
                        {/* Search & Bulk Actions Area */}
                        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-xl p-4 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={t('admin.search_placeholder') || 'Search applications...'}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 dark:text-white text-sm"
                                />
                            </div>
                            <button className="hidden md:flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-white dark:text-gray-900 text-white rounded-2xl text-sm font-bold active:scale-95 transition-all">
                                <Zap className="w-4 h-4 text-yellow-400" />
                                Batch AI Approval
                            </button>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[1, 2, 4, 6].map(i => (
                                    <div key={i} className="h-40 bg-gray-100 dark:bg-gray-800 animate-pulse rounded-3xl" />
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-6">
                                <AnimatePresence mode='popLayout'>
                                    {sellers.map((seller, idx) => {
                                        const ai = seller.aiKYCAssessment
                                        return (
                                            <motion.div
                                                layout
                                                key={seller.id}
                                                initial={{ opacity: 0, scale: 0.95 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, x: -50 }}
                                                transition={{ delay: idx * 0.05 }}
                                                whileHover={{ y: -5 }}
                                                className={`group relative bg-white dark:bg-gray-800 rounded-[32px] p-6 border-2 transition-all cursor-pointer ${selectedSeller?.id === seller.id
                                                    ? 'border-blue-500 ring-4 ring-blue-500/10'
                                                    : 'border-transparent hover:border-gray-200 dark:hover:border-gray-700 shadow-sm hover:shadow-xl'
                                                    }`}
                                                onClick={() => setSelectedSeller(seller)}
                                            >
                                                <div className="flex items-start justify-between mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 p-[2px]">
                                                            <div className="w-full h-full rounded-[14px] bg-white dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                                                                {seller.shopName?.[0] || seller.displayName[0]}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <h3 className="font-black text-gray-900 dark:text-white leading-tight">{seller.shopName || seller.displayName}</h3>
                                                            <p className="text-xs text-gray-500 font-medium">{seller.email}</p>
                                                        </div>
                                                    </div>
                                                    {ai ? (
                                                        <div className={`px-3 py-1.5 rounded-xl font-black text-[10px] tracking-widest uppercase flex items-center gap-1.5 ${ai.isValid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            <Shield className="w-3 h-3" />
                                                            Score: {ai.confidence}
                                                        </div>
                                                    ) : (
                                                        <div className="px-3 py-1.5 rounded-xl font-black text-[10px] tracking-widest uppercase flex items-center gap-1.5 bg-gray-100 text-gray-400">
                                                            Pending AI
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-6 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex -space-x-2">
                                                            {idx % 2 === 0 ? (
                                                                <>
                                                                    <div className="w-6 h-6 rounded-full bg-blue-100 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center text-[8px] font-bold text-blue-600">ID</div>
                                                                    <div className="w-6 h-6 rounded-full bg-purple-100 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center text-[8px] font-bold text-purple-600">ME</div>
                                                                </>
                                                            ) : (
                                                                <div className="w-6 h-6 rounded-full bg-orange-100 ring-2 ring-white dark:ring-gray-800 flex items-center justify-center text-[8px] font-bold text-orange-600">BR</div>
                                                            )}
                                                        </div>
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                                                            {idx % 2 === 0 ? 'Individual' : 'Business'}
                                                        </span>
                                                    </div>

                                                    <ChevronRight className={`w-5 h-5 text-gray-300 group-hover:text-blue-500 transition-transform ${selectedSeller?.id === seller.id ? 'rotate-90 text-blue-500' : ''}`} />
                                                </div>

                                                {/* Hover Glow Effect */}
                                                <div className="absolute inset-0 rounded-[32px] bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity -z-0 pointer-events-none" />
                                            </motion.div>
                                        )
                                    })}
                                </AnimatePresence>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Detailed Review Side Panel (World Class Side-by-Side Review) */}
                    <div className="w-full lg:w-[450px] 2xl:w-[550px] space-y-6">
                        <AnimatePresence mode='wait'>
                            {selectedSeller ? (
                                <motion.div
                                    key={selectedSeller.id}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="sticky top-6 bg-white dark:bg-gray-800 rounded-[40px] border border-gray-100 dark:border-gray-700 shadow-2xl overflow-hidden flex flex-col"
                                >
                                    {/* Panel Header */}
                                    <div className="p-8 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-b border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center justify-between mb-6">
                                            <span className="text-[10px] font-black tracking-[0.2em] uppercase text-blue-600 dark:text-blue-400">Application Details</span>
                                            <button onClick={() => setSelectedSeller(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-400">
                                                <XCircle className="w-6 h-6" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-20 h-20 rounded-3xl bg-gray-200 relative overflow-hidden flex-shrink-0 animate-in zoom-in-50 duration-500">
                                                <div className="w-full h-full flex items-center justify-center text-2xl font-black text-gray-500 bg-gray-100">
                                                    {selectedSeller.shopName?.[0] || selectedSeller.displayName?.[0]}
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h2 className="text-2xl font-black text-gray-900 dark:text-white truncate">{selectedSeller.shopName || selectedSeller.displayName}</h2>
                                                <p className="text-gray-500 flex items-center gap-2 text-sm mt-1">
                                                    <Award className="w-4 h-4 text-orange-500" />
                                                    Joined {format(selectedSeller.joinedAt.toDate(), 'MMMM yyyy', { locale: language === 'th' ? th : enUS })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Document Viewer (Premium Side-by-Side) */}
                                    <div className="p-8 space-y-8 flex-1 overflow-y-auto max-h-[calc(100vh-400px)]">
                                        <div className="space-y-4">
                                            <h3 className="font-black text-gray-900 dark:text-white flex items-center gap-2">
                                                <FileText className="w-5 h-5 text-indigo-500" />
                                                {t('sellers_pending.view_docs')}
                                            </h3>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <div className="aspect-[3/2] bg-gray-100 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-800 group hover:border-blue-500 transition-colors cursor-zoom-in">
                                                        <Eye className="w-10 h-10 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">{t('sellers_pending.doc_id_card')}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="aspect-[3/2] bg-gray-100 dark:bg-gray-900 rounded-2xl flex flex-col items-center justify-center text-center p-4 border-2 border-dashed border-gray-200 dark:border-gray-800 group hover:border-blue-500 transition-colors cursor-zoom-in">
                                                        <UserCheck className="w-10 h-10 text-gray-300 group-hover:text-blue-500 transition-colors" />
                                                        <p className="text-[10px] font-bold text-gray-400 mt-2 uppercase">{t('sellers_pending.doc_portrait')}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* AI forensic analysis */}
                                        <div className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/20 dark:to-blue-950/20 p-6 rounded-[32px] border border-blue-100 dark:border-blue-800/40 space-y-6">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-black text-blue-800 dark:text-blue-300 flex items-center gap-2">
                                                    <Sparkles className="w-5 h-5" />
                                                    {t('sellers_pending.ai_analysis_title')}
                                                </h3>
                                                {!aiAnalysis ? (
                                                    <button
                                                        onClick={() => runAIAnalysis(selectedSeller)}
                                                        disabled={isAnalyzing}
                                                        className="px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 shadow-sm border border-blue-100 dark:border-blue-900"
                                                    >
                                                        {isAnalyzing ? 'Analyzing...' : 'Run AI Analysis'}
                                                    </button>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-gray-800 rounded-full border border-blue-200 dark:border-blue-700 shadow-sm">
                                                        <div className={`w-2 h-2 rounded-full ${aiAnalysis.isValid ? 'bg-green-500' : 'bg-red-500'} animate-pulse`} />
                                                        <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter">
                                                            {aiAnalysis.isValid ? 'Trusted' : 'High Risk'}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>

                                            {aiAnalysis ? (
                                                <div className="space-y-4">
                                                    {[
                                                        { icon: UserCheck, label: t('sellers_pending.analysis_document_match'), pass: aiAnalysis.idMatch },
                                                        { icon: FileText, label: t('sellers_pending.analysis_ocr_valid'), pass: !!aiAnalysis.idNumber },
                                                        { icon: Shield, label: t('sellers_pending.analysis_fake_id_check'), pass: !aiAnalysis.isFake },
                                                        {
                                                            icon: TrendingUp,
                                                            label: t('sellers_pending.business_potential'),
                                                            pass: true,
                                                            badge: aiAnalysis.potential === 'high' ? t('sellers_pending.potential_high') : 'Medium'
                                                        }
                                                    ].map((item, i) => (
                                                        <div key={i} className="flex items-center justify-between text-sm">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-8 h-8 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center">
                                                                    <item.icon className={`w-4 h-4 ${item.pass ? 'text-blue-500' : 'text-red-500'}`} />
                                                                </div>
                                                                <span className="font-bold text-gray-700 dark:text-gray-300">{item.label}</span>
                                                            </div>
                                                            {item.badge ? (
                                                                <span className={`px-2 py-0.5 ${aiAnalysis.potential === 'high' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} text-[10px] font-black rounded uppercase`}>
                                                                    {item.badge}
                                                                </span>
                                                            ) : (
                                                                item.pass ? <CheckCircle className="w-5 h-5 text-green-500" /> : <XCircle className="w-5 h-5 text-red-500" />
                                                            )}
                                                        </div>
                                                    ))}

                                                    {aiAnalysis.summary && (
                                                        <div className="mt-4 p-4 bg-white/50 dark:bg-gray-900/50 rounded-2xl border border-blue-100/50 dark:border-blue-900/50">
                                                            <p className="text-[10px] font-medium text-gray-600 dark:text-gray-400 leading-relaxed italic">
                                                                "{aiAnalysis.summary}"
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                                                    <BrainCircuit className="w-10 h-10 text-blue-200 dark:text-blue-800 animate-pulse" />
                                                    <p className="text-[10px] font-bold text-blue-400 dark:text-blue-600 uppercase tracking-widest">
                                                        AI Analysis Ready for review
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Buttons Footer */}
                                    <div className="p-8 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-md grid grid-cols-2 gap-4">
                                        <button
                                            disabled={isProcessing}
                                            onClick={() => handleReject(selectedSeller)}
                                            className="px-6 py-4 rounded-3xl font-black text-gray-600 dark:text-gray-400 hover:bg-red-50 hover:text-red-600 transition-all active:scale-95 disabled:opacity-50"
                                        >
                                            {t('sellers_pending.reject_btn')}
                                        </button>
                                        <button
                                            disabled={isProcessing}
                                            onClick={() => handleApprove(selectedSeller)}
                                            className="px-6 py-4 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl font-black shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
                                        >
                                            {isProcessing ? t('common.loading') : (
                                                <>
                                                    <Lock className="w-4 h-4" />
                                                    {t('sellers_pending.approve_btn')}
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </motion.div>
                            ) : (
                                <div className="h-full flex flex-col items-center justify-center p-12 text-center space-y-6">
                                    <div className="w-32 h-32 bg-gray-100 dark:bg-gray-800 rounded-[40px] flex items-center justify-center">
                                        <MousePointer2 className="w-12 h-12 text-gray-300 animate-bounce" />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-black text-gray-900 dark:text-white">
                                            Select an application to review
                                        </h3>
                                        <p className="text-gray-500 text-sm max-w-[280px] mx-auto">
                                            Click on a seller card from the left to start the world-class AI verification process.
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

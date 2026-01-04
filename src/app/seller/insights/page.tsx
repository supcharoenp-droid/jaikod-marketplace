'use client'

import React from 'react'
import SellerInsightsDashboard from '@/components/promotion/SellerInsightsDashboard'
import { motion } from 'framer-motion'
import { Sparkles, Brain, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function InsightsPage() {
    return (
        <div className="bg-[#0F172A] min-h-screen">
            {/* Top Navigation Bar */}
            <nav className="bg-slate-900/50 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/seller" className="p-2 hover:bg-slate-800 rounded-xl transition-all">
                            <ArrowLeft className="w-5 h-5 text-slate-400" />
                        </Link>
                        <div className="flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400 fill-current" />
                            <span className="font-black text-white tracking-tighter text-xl">JAIKOD <span className="text-purple-500">INTEL</span></span>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center gap-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/10 rounded-full border border-purple-500/20">
                            <Brain className="w-4 h-4 text-purple-400" />
                            <span className="text-xs font-bold text-purple-300">AI AGENT: OPTIMIZING</span>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="pb-20">
                {/* Intro Hero Section */}
                <div className="max-w-7xl mx-auto px-6 pt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 rounded-3xl p-8 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 mb-12 shadow-2xl shadow-purple-900/20"
                    >
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-yellow-400/10 rounded-lg text-yellow-400 text-[10px] font-black uppercase tracking-widest">
                                <Sparkles className="w-3 h-3" />
                                Exclusive Seller Beta
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tight leading-none">
                                พลัง AI ในมือคุณ <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-emerald-400">เพิ่มยอดขายได้แม่นยำ 5.2 เท่า</span>
                            </h2>
                            <p className="text-slate-400 max-w-xl">
                                ระบบวิเคราะห์โฆษณาระดับไฮเอนด์ที่ช่วยให้คุณเข้าใจพฤติกรรมผู้ซื้อแบบ Real-time พร้อมคำแนะนำจาก AI Copilot ที่ช่วยประหยัดค่าโฆษณาแต่ได้ผลลัพธ์ที่ชัดเจนที่สุด
                            </p>
                        </div>

                        <div className="flex gap-4">
                            <div className="text-center p-6 bg-slate-900/80 backdrop-blur-3xl rounded-3xl border border-white/5 min-w-[150px]">
                                <p className="text-3xl font-black text-white">98%</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Accuracy</p>
                            </div>
                            <div className="text-center p-6 bg-slate-900/80 backdrop-blur-3xl rounded-3xl border border-white/5 min-w-[150px]">
                                <p className="text-3xl font-black text-emerald-400">+45%</p>
                                <p className="text-[10px] font-bold text-slate-500 uppercase">Conversion</p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                <SellerInsightsDashboard />
            </main>
        </div>
    )
}

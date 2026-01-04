'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, TrendingUp, Users, Target, Info, Sparkles, Wand2 } from 'lucide-react'

interface PredictionResult {
    est_views: [number, number]
    est_leads: [number, number]
    confidence: number
}

export default function PredictiveROICalculator() {
    const [budget, setBudget] = useState(500)
    const [prediction, setPrediction] = useState<PredictionResult | null>(null)
    const [isCalculating, setIsCalculating] = useState(false)

    useEffect(() => {
        calculatePrediction()
    }, [budget])

    const calculatePrediction = () => {
        setIsCalculating(true)
        // จำลองการคำนวณของ AI (ในอนาคตจะยิงไปที่ Gemini/Vertex AI)
        setTimeout(() => {
            const baseViews = (budget / 50) * 150
            const baseLeads = (budget / 50) * 5

            setPrediction({
                est_views: [Math.floor(baseViews * 0.8), Math.floor(baseViews * 1.2)],
                est_leads: [Math.floor(baseLeads * 0.7), Math.floor(baseLeads * 1.3)],
                confidence: 94
            })
            setIsCalculating(false)
        }, 600)
    }

    return (
        <section className="bg-slate-900/60 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-8 relative overflow-hidden group">
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-xl font-black text-white flex items-center gap-2">
                        Predictive ROI Simulator
                        <div className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-[10px] rounded border border-emerald-500/30 font-black">AI LABS</div>
                    </h3>
                    <p className="text-sm text-slate-400">คาดการณ์ผลลัพธ์ล่วงหน้าก่อนเริ่มแคมเปญจริง</p>
                </div>
                <Wand2 className="w-6 h-6 text-purple-500 opacity-50" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Input Section */}
                <div className="space-y-8">
                    <div>
                        <div className="flex justify-between mb-4">
                            <label className="text-sm font-bold text-slate-300">งบประมาณที่วางไว้ (Stars)</label>
                            <span className="text-2xl font-black text-white">⭐ {budget.toLocaleString()}</span>
                        </div>
                        <input
                            type="range"
                            min="50"
                            max="5000"
                            step="50"
                            value={budget}
                            onChange={(e) => setBudget(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span>50 Stars</span>
                            <span>5,000 Stars</span>
                        </div>
                    </div>

                    <div className="bg-slate-800/40 rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center gap-3 text-sm text-slate-400 leading-relaxed">
                            <Info className="w-5 h-5 text-purple-400 flex-shrink-0" />
                            <p>AI คำนวณจากสถิติของสินค้าประเภท <span className="text-white font-bold">Gadgets</span> ในพื้นที่กรุงเทพฯ และปริมณฑล</p>
                        </div>
                    </div>
                </div>

                {/* Output Section */}
                <div className="relative">
                    <div className={`transition-all duration-500 ${isCalculating ? 'opacity-30 blur-sm' : 'opacity-100'}`}>
                        <div className="grid grid-cols-2 gap-4">
                            <OutputCard
                                label="Est. Extra Views"
                                value={`${prediction?.est_views[0]} - ${prediction?.est_views[1]}`}
                                icon={<Users className="w-5 h-5 text-blue-400" />}
                                color="blue"
                            />
                            <OutputCard
                                label="Est. New Leads"
                                value={`${prediction?.est_leads[0]} - ${prediction?.est_leads[1]}`}
                                icon={<Target className="w-5 h-5 text-emerald-400" />}
                                color="emerald"
                            />
                        </div>

                        <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Sparkles className="w-4 h-4 text-yellow-400" />
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">AI Confidence Level</span>
                            </div>
                            <div className="text-2xl font-black text-white">{prediction?.confidence}%</div>
                        </div>
                    </div>

                    {isCalculating && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">AI Simulating...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}

function OutputCard({ label, value, icon, color }: any) {
    return (
        <div className="p-6 bg-slate-800/40 rounded-3xl border border-white/5">
            <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-xl bg-${color}-500/10`}>
                    {icon}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
            </div>
            <div className="text-xl font-black text-white">{value}</div>
        </div>
    )
}

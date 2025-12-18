'use client'

import React from 'react'
import { ShieldCheck, CheckCircle2, AlertCircle, ChevronRight } from 'lucide-react'

interface TrustGamificationCardProps {
    score: number
    verifiedSteps: {
        id: string
        label: string
        isVerified: boolean
    }[]
}

export default function TrustGamificationCard({ score, verifiedSteps }: TrustGamificationCardProps) {
    // Determine Badge
    let badge = { label: 'Bronze', color: 'bg-orange-100 text-orange-700 border-orange-200' }
    if (score > 50) badge = { label: 'Silver', color: 'bg-slate-100 text-slate-700 border-slate-200' }
    if (score > 80) badge = { label: 'Gold', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' }
    if (score > 90) badge = { label: 'Platinum', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }

    return (
        <div className="bg-gradient-to-br from-white to-indigo-50/50 backdrop-blur-md rounded-2xl p-6 border border-white/60 shadow-lg shadow-indigo-100/40 relative overflow-hidden group h-full">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors duration-500"></div>

            <div className="flex justify-between items-start relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-5 h-5 text-indigo-500" />
                        <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">Trust Score</span>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-gray-800 tracking-tighter">{score}</span>
                        <span className="text-sm text-gray-400 font-medium">/ 100</span>
                    </div>
                </div>

                <div className={`px-3 py-1 rounded-full border text-xs font-bold uppercase tracking-wide ${badge.color} shadow-sm`}>
                    {badge.label} Member
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-100 h-2 rounded-full mt-4 mb-6 overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${score}%` }}
                >
                    <div className="absolute inset-0 bg-white/30 w-full h-full animate-[shimmer_2s_infinite]"></div>
                </div>
            </div>

            {/* Verification Steps */}
            <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-500 mb-2">Verification Progress</p>
                {verifiedSteps.map((step) => (
                    <div key={step.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/60 transition-colors">
                        <div className="flex items-center gap-3">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${step.isVerified ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                {step.isVerified ? <CheckCircle2 className="w-3 h-3" /> : <div className="w-2 h-2 rounded-full bg-gray-300"></div>}
                            </div>
                            <span className={`text-sm ${step.isVerified ? 'text-gray-700 font-medium' : 'text-gray-400'}`}>{step.label}</span>
                        </div>
                        {!step.isVerified && (
                            <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2 py-1 rounded-md transition-colors flex items-center gap-1">
                                Verify <ChevronRight className="w-2 h-2" />
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

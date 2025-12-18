'use client'

import React from 'react'
import { TierEvaluationResult, TIER_LEVELS } from '@/services/ai/tierSystem'
import { ShieldCheck, ChevronRight, Lock, Unlock, Zap, Trophy, TrendingUp } from 'lucide-react'

interface TierProgressCardProps {
    tierData: TierEvaluationResult
}

export default function TierProgressCard({ tierData }: TierProgressCardProps) {
    const { currentTier, nextTier, progress, missingRequirements } = tierData

    return (
        <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm relative overflow-hidden group">
            {/* Background Gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 bg-${currentTier.color}-500`}></div>

            <div className="relative z-10">
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl bg-${currentTier.color}-100 text-${currentTier.color}-600`}>
                            {/* Icon Placeholder - Lucide icons don't dynamically map easily without lookup object, simple fallback */}
                            <Trophy className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Current Level</p>
                            <h3 className={`text-lg font-bold text-${currentTier.color}-700`}>{currentTier.label}</h3>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-gray-800">{progress}%</div>
                        <p className="text-[10px] text-gray-400">To Next Level</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                    <div
                        className={`h-full bg-${currentTier.color}-500 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>

                {/* Next Level Info */}
                {nextTier ? (
                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                            <span>Next: <strong className="text-gray-700">{nextTier.label}</strong></span>
                            <span className="flex items-center gap-1 text-purple-600">
                                View Benefits <ChevronRight className="w-3 h-3" />
                            </span>
                        </div>

                        {/* Requirements List */}
                        <div className="space-y-2">
                            {missingRequirements.slice(0, 3).map((req, i) => (
                                <div key={i} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded-lg border border-gray-100">
                                    <span className="text-gray-600">{req.label}</span>
                                    <span className="font-bold text-gray-400">
                                        {typeof req.current === 'number' ? `${req.current}/${req.target}` : 'Pending'}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Perks Unlock Preview */}
                        <div className="mt-3 pt-3 border-t border-gray-100">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Unlocks at Level Up</p>
                            <div className="flex flex-wrap gap-2">
                                {nextTier.perks.slice(0, 2).map((perk, i) => (
                                    <span key={i} className="text-[10px] flex items-center gap-1 bg-gradient-to-r from-gray-50 to-white border border-gray-200 px-2 py-1 rounded-md text-gray-600">
                                        <Lock className="w-2.5 h-2.5 text-gray-400" /> {perk}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-4">
                        <div className="inline-block p-3 bg-yellow-100 rounded-full mb-2">
                            <Trophy className="w-6 h-6 text-yellow-600" />
                        </div>
                        <p className="text-sm font-bold text-gray-800">You are at the Top Level!</p>
                        <p className="text-xs text-gray-500">Enjoy your exclusive verified status benefits.</p>
                    </div>
                )}
            </div>
        </div>
    )
}

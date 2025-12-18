'use client'

import React, { useEffect, useState } from 'react'
import { ShieldCheck, UserCheck, AlertCircle, TrendingUp } from 'lucide-react'
import { calculateUserTrustScore, TrustScoreDetails } from '@/services/imtrustScoreEngine'

// Mock Data for user
const MOCK_USER_STATS = {
    totalSales: 15,
    accountAgeDays: 200,
    responseRatePercent: 95,
    reportCount: 0,
    positiveReviewCount: 18,
    totalReviewCount: 20,
    verifiedPhone: true,
    verifiedEmail: true,
    verifiedIdentity: false, // Not verified
}

export default function TrustScoreCard() {
    const [scoreData, setScoreData] = useState<TrustScoreDetails | null>(null)

    useEffect(() => {
        // Calculate on load
        const result = calculateUserTrustScore({}, MOCK_USER_STATS)
        setScoreData(result)
    }, [])

    if (!scoreData) return null

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600'
        if (score >= 50) return 'text-blue-600'
        return 'text-orange-500'
    }

    const getRadialDash = (score: number) => {
        const circumference = 2 * Math.PI * 40 // r=40
        return (score / 100) * circumference
    }

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-lg font-bold flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                        คะแนนความน่าเชื่อถือ
                    </h3>
                    <p className="text-xs text-gray-500">ImTrust™ Score Engine</p>
                </div>
                {scoreData.badges.length > 0 && (
                    <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
                        {scoreData.badges[0]}
                    </span>
                )}
            </div>

            <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Score Circle */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        {/* Background Circle */}
                        <circle cx="64" cy="64" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                        {/* Progress Circle */}
                        <circle
                            cx="64" cy="64" r="40"
                            stroke="currentColor" strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={2 * Math.PI * 40 - getRadialDash(scoreData.totalScore)}
                            strokeLinecap="round"
                            className={`${scoreData.totalScore >= 80 ? 'text-green-500' : scoreData.totalScore >= 50 ? 'text-blue-500' : 'text-orange-400'} transition-all duration-1000 ease-out`}
                        />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                        <span className={`text-3xl font-bold ${getScoreColor(scoreData.totalScore)}`}>
                            {scoreData.totalScore}
                        </span>
                        <span className="text-[10px] text-gray-400">/ 100</span>
                    </div>
                </div>

                {/* Details Breakdown */}
                <div className="flex-1 w-full space-y-3">
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
                            <span>การยืนยันตัวตน (Identity)</span>
                            <span>{scoreData.breakdown.identity}/20</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(scoreData.breakdown.identity / 20) * 100}%` }} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
                            <span>พฤติกรรม (Behavior)</span>
                            <span>{scoreData.breakdown.behavior}/25</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${(scoreData.breakdown.behavior / 25) * 100}%` }} />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300">
                            <span>รีวิวจากผู้ใช้ (Reviews)</span>
                            <span>{scoreData.breakdown.review}/25</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${(scoreData.breakdown.review / 25) * 100}%` }} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Improvement Tips */}
            {scoreData.improvement_tips.length > 0 && (
                <div className="mt-6 bg-orange-50 dark:bg-orange-900/10 rounded-lg p-3 border border-orange-100 dark:border-orange-900/30">
                    <h4 className="text-xs font-bold text-orange-700 flex items-center gap-1 mb-2">
                        <TrendingUp className="w-3 h-3" />
                        วิธีเพิ่มคะแนนของคุณ
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400 list-disc pl-4">
                        {scoreData.improvement_tips.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

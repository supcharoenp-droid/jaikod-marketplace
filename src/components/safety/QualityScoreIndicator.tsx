'use client'

import React, { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Lightbulb, AlertTriangle, FileText } from 'lucide-react'
import { evaluateListingQuality, QualityAssessment } from '@/services/aiQualityControl'

interface QualityScoreIndicatorProps {
    title: string
    description: string
    price: number
    categorySlug: string
}

export default function QualityScoreIndicator({ title, description, price, categorySlug }: QualityScoreIndicatorProps) {
    const [assessment, setAssessment] = useState<QualityAssessment | null>(null)

    useEffect(() => {
        // Debounce analysis
        const timer = setTimeout(() => {
            if (title || description) {
                const result = evaluateListingQuality(title, description, price, categorySlug)
                setAssessment(result)
            }
        }, 1000)
        return () => clearTimeout(timer)
    }, [title, description, price, categorySlug])

    if (!assessment) return null

    const getColor = (status: string) => {
        switch (status) {
            case 'excellent': return 'text-green-600 bg-green-50 border-green-200'
            case 'good': return 'text-blue-600 bg-blue-50 border-blue-200'
            case 'fair': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
            case 'poor': return 'text-red-600 bg-red-50 border-red-200'
            default: return 'text-gray-600 bg-gray-50 border-gray-200'
        }
    }

    const getBarColor = (score: number) => {
        if (score >= 90) return 'bg-green-500'
        if (score >= 70) return 'bg-blue-500'
        if (score >= 50) return 'bg-yellow-500'
        return 'bg-red-500'
    }

    return (
        <div className={`mt-4 rounded-xl border p-4 ${getColor(assessment.status)}`}>
            {/* Header Score */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="transparent" className="opacity-20" />
                            <circle
                                cx="24" cy="24" r="20"
                                stroke="currentColor" strokeWidth="4"
                                fill="transparent"
                                strokeDasharray={2 * Math.PI * 20}
                                strokeDashoffset={2 * Math.PI * 20 - (assessment.score / 100) * (2 * Math.PI * 20)}
                                className="transition-all duration-700"
                            />
                        </svg>
                        <span className="absolute font-bold text-sm">{assessment.score}</span>
                    </div>
                    <div>
                        <h3 className="font-bold">คุณภาพคำบรรยาย</h3>
                        <p className="text-xs opacity-80">
                            {assessment.status === 'excellent' ? 'ยอดเยี่ยม! รายละเอียดครบถ้วน' :
                                assessment.status === 'good' ? 'ดี (สามารถเพิ่มรายละเอียดได้อีก)' :
                                    assessment.status === 'fair' ? 'พอใช้ (ควรเพิ่มข้อมูลสำคัญ)' : 'ควรปรับปรุงด่วน'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Analysis List */}
            <div className="space-y-3">
                {/* 1. Issues */}
                {assessment.issues.map((issue, idx) => (
                    <div key={`issue-${idx}`} className="flex items-start gap-2 text-sm bg-white/60 p-2 rounded-lg">
                        {issue.type === 'critical' ? <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" /> :
                            issue.type === 'warning' ? <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" /> :
                                <FileText className="w-4 h-4 text-blue-500 mt-0.5" />}
                        <span className={issue.type === 'critical' ? 'text-red-700 font-medium' : 'text-gray-700'}>
                            {issue.message}
                        </span>
                    </div>
                ))}

                {/* 2. Missing Fields Suggestions */}
                {assessment.missingFields.length > 0 && (
                    <div className="bg-white/80 rounded-lg p-3 border border-dashed border-current/30">
                        <div className="font-semibold text-xs mb-2 flex items-center gap-1">
                            <Lightbulb className="w-3 h-3" /> ข้อมูลที่ควรมีในหมวดนี้:
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {assessment.missingFields.map(field => (
                                <span key={field} className="px-2 py-0.5 bg-white border rounded text-xs font-medium shadow-sm">
                                    + {field}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                {/* 3. General Suggestions */}
                {assessment.suggestions.length > 0 && (
                    <ul className="list-disc pl-5 text-xs opacity-90 space-y-1">
                        {assessment.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                    </ul>
                )}
            </div>
        </div>
    )
}

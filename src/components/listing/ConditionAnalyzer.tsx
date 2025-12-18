'use client'

import React, { useState } from 'react'
import { ScanEye, Loader2, Info, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { analyzeProductCondition, VisualConditionResult } from '@/services/aiVisualConditionService'

interface ConditionAnalyzerProps {
    imageUrl: string
    onConditionVerified?: (result: VisualConditionResult) => void
}

export default function ConditionAnalyzer({ imageUrl, onConditionVerified }: ConditionAnalyzerProps) {
    const [analyzing, setAnalyzing] = useState(false)
    const [result, setResult] = useState<VisualConditionResult | null>(null)

    const handleScan = async () => {
        if (!imageUrl) return
        setAnalyzing(true)
        setResult(null)
        try {
            const data = await analyzeProductCondition(imageUrl)
            setResult(data)
            if (onConditionVerified) onConditionVerified(data)
        } catch (error) {
            console.error(error)
        } finally {
            setAnalyzing(false)
        }
    }

    if (!imageUrl) return null

    return (
        <div className="bg-white dark:bg-card-dark rounded-xl border border-gray-200 dark:border-gray-800 p-4">
            <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold flex items-center gap-2">
                    <ScanEye className="w-5 h-5 text-purple-500" />
                    AI ตรวจสอบสภาพสินค้า
                </h4>
                {!result && !analyzing && (
                    <button
                        onClick={handleScan}
                        className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-full hover:bg-purple-700 transition"
                    >
                        สแกนภาพนี้
                    </button>
                )}
            </div>

            <div className="relative rounded-lg overflow-hidden bg-black/5 min-h-[200px] flex items-center justify-center">
                <img src={imageUrl} alt="preview" className={`max-h-64 object-contain ${analyzing ? 'opacity-50 blur-sm' : ''}`} />

                {/* Scanning Overlay */}
                {analyzing && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-purple-600">
                        <Loader2 className="w-8 h-8 animate-spin mb-2" />
                        <span className="text-sm font-medium animate-pulse">กำลังวิเคราะห์รอยตำหนิ...</span>
                        {/* Scanning Line Animation */}
                        <div className="absolute top-0 w-full h-1 bg-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.5)] animate-[scan_2s_ease-in-out_infinite]" />
                    </div>
                )}

                {/* Result Overlay (Heatmap simulation) */}
                {result && result.defects.map((defect, i) => (
                    <div
                        key={i}
                        className="absolute w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-red-500 bg-red-500/30 flex items-center justify-center animate-ping-slow"
                        style={{ left: `${defect.location.x}%`, top: `${defect.location.y}%` }}
                    >
                        <div className="absolute top-full mt-1 bg-black/80 text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap">
                            {defect.label}
                        </div>
                    </div>
                ))}
            </div>

            {/* Result Report */}
            {result && (
                <div className="mt-4 space-y-3 animate-in fade-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className={`text-2xl font-bold ${result.score >= 80 ? 'text-green-600' :
                                    result.score >= 50 ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                {result.score}%
                            </div>
                            <div className="text-sm text-gray-500">
                                สภาพ: <span className="font-semibold text-gray-900 dark:text-gray-100">{result.conditionLabel}</span>
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold border ${result.imageQualityScore > 70 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            Quality: {result.imageQualityScore}%
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm flex gap-3">
                        {result.defects.length === 0 ? (
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                        ) : (
                            <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0" />
                        )}
                        <div>
                            <div className="font-medium mb-1">ผลการวิเคราะห์:</div>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {result.aiAnalysisText}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes scan {
                    0% { top: 0%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `}</style>
        </div>
    )
}

'use client'

import React, { useState, useEffect } from 'react'
import { ShieldAlert, ShieldCheck, AlertTriangle, Search, FileX, Info, Loader2 } from 'lucide-react'
import { analyzeListingSafety, checkImageDuplication, SafetyRiskAssessment } from '@/services/aiSafetyService'
import { motion, AnimatePresence } from 'framer-motion'

interface SafetyScannerProps {
    title: string
    description: string
    price: number
    category: string
    imagePreview?: string | null
    onValidationChange: (isValid: boolean) => void
}

export default function ListingSafetyScanner({
    title,
    description,
    price,
    category,
    imagePreview,
    onValidationChange
}: SafetyScannerProps) {
    const [isScanning, setIsScanning] = useState(false)
    const [result, setResult] = useState<SafetyRiskAssessment | null>(null)
    const [imageStatus, setImageStatus] = useState<'checking' | 'safe' | 'duplicate'>('safe')

    // Debounce scan
    useEffect(() => {
        const timer = setTimeout(() => {
            if (title.length > 3 && price > 0) {
                runScan()
            }
        }, 1500) // Wait for user to stop typing
        return () => clearTimeout(timer)
    }, [title, description, price, category])

    // Mock Image scan when image changes
    useEffect(() => {
        if (imagePreview) {
            checkImage()
        }
    }, [imagePreview])

    const checkImage = async () => {
        if (!imagePreview) return
        setImageStatus('checking')
        const res = await checkImageDuplication(imagePreview)
        setImageStatus(res.isDuplicate ? 'duplicate' : 'safe')
    }

    const runScan = async () => {
        setIsScanning(true)
        try {
            const data = await analyzeListingSafety(title, description, price, category)
            setResult(data)

            // Validate: Allow if Safe or Warning. Block if Rejected or High Risk (needs admin)
            const isValid = data.verdict === 'safe' || data.verdict === 'warning'
            onValidationChange(isValid)

        } catch (error) {
            console.error("Scan failed", error)
        } finally {
            setIsScanning(false)
        }
    }

    if (!result && !isScanning) return null

    return (
        <div className="mt-6">
            <AnimatePresence mode='wait'>
                {isScanning ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900 rounded-xl p-4 flex items-center gap-3"
                    >
                        <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />
                        <span className="text-sm font-medium text-blue-600">AI กำลังตรวจสอบความปลอดภัยสินค้า...</span>
                    </motion.div>
                ) : result?.riskScore && result.riskScore > 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl p-4 border ${result.verdict === 'rejected' ? 'bg-red-50 border-red-200' :
                                result.verdict === 'high_risk' ? 'bg-orange-50 border-orange-200' :
                                    'bg-yellow-50 border-yellow-200'
                            }`}
                    >
                        <div className="flex items-start gap-3">
                            {result.verdict === 'rejected' ? <ShieldAlert className="w-6 h-6 text-red-500" /> :
                                result.verdict === 'high_risk' ? <AlertTriangle className="w-6 h-6 text-orange-500" /> :
                                    <Info className="w-6 h-6 text-yellow-500" />}

                            <div className="flex-1">
                                <h4 className={`font-bold ${result.verdict === 'rejected' ? 'text-red-700' :
                                        result.verdict === 'high_risk' ? 'text-orange-700' : 'text-yellow-700'
                                    }`}>
                                    {result.verdict === 'rejected' ? 'ไม่อนุญาตให้ลงขายสินค้า' :
                                        result.verdict === 'high_risk' ? 'ตรวจพบความเสี่ยงสูง' : 'คำแนะนำเพิ่มเติม'}
                                </h4>

                                <div className="mt-2 space-y-2">
                                    {result.detectedIssues.map((issue, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <span className="w-1.5 h-1.5 bg-current rounded-full opacity-60" />
                                            {issue.details}
                                        </div>
                                    ))}

                                    {imageStatus === 'duplicate' && (
                                        <div className="flex items-center gap-2 text-sm text-red-600 font-medium">
                                            <FileX className="w-4 h-4" />
                                            รูปภาพนี้เคยถูกใช้ในเว็บไซต์อื่น (เสี่ยงเป็นสินค้าปลอม)
                                        </div>
                                    )}
                                </div>

                                {result.actionRecommendations.length > 0 && (
                                    <div className="mt-3 bg-white/50 p-3 rounded-lg text-sm">
                                        <div className="font-semibold mb-1 opacity-80">สิ่งที่ต้องแก้ไข:</div>
                                        <ul className="list-disc pl-4 space-y-1 opacity-80">
                                            {result.actionRecommendations.map((rec, i) => (
                                                <li key={i}>{rec}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900 rounded-xl p-4 flex items-center gap-3"
                    >
                        <ShieldCheck className="w-5 h-5 text-green-500" />
                        <span className="text-sm font-medium text-green-600">สินค้าปลอดภัยพร้อมลงขาย (Verification Score: 100%)</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

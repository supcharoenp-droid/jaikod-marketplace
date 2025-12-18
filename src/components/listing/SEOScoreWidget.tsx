'use client'

import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle, AlertCircle, XCircle } from 'lucide-react'

interface SEOCheck {
    id: string
    label: string
    passed: boolean
    suggestion?: string
    weight: number // 1-10
}

interface SEOScoreWidgetProps {
    checks: SEOCheck[]
}

export default function SEOScoreWidget({ checks }: SEOScoreWidgetProps) {
    // Calculate score
    const totalWeight = checks.reduce((sum, check) => sum + check.weight, 0)
    const earnedWeight = checks
        .filter(check => check.passed)
        .reduce((sum, check) => sum + check.weight, 0)
    const score = totalWeight > 0 ? (earnedWeight / totalWeight) * 10 : 0

    // Get color based on score
    const getScoreColor = () => {
        if (score >= 8) return 'from-green-400 to-emerald-400'
        if (score >= 6) return 'from-yellow-400 to-orange-400'
        return 'from-red-400 to-pink-400'
    }

    const getScoreRing = () => {
        if (score >= 8) return 'text-green-500'
        if (score >= 6) return 'text-yellow-500'
        return 'text-red-500'
    }

    return (
        <motion.div
            className="bg-gradient-to-br from-green-900/20 to-blue-900/20 
                 rounded-xl p-6 border border-green-500/20
                 shadow-lg shadow-green-500/10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
        >
            {/* Header with Score */}
            <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-lg flex items-center gap-2 text-gray-200">
                    <TrendingUp className="w-5 h-5 text-green-400" />
                    SEO Score
                </h4>

                {/* Circular Score */}
                <div className="relative w-20 h-20">
                    {/* Background Circle */}
                    <svg className="transform -rotate-90 w-20 h-20">
                        <circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            className="text-gray-700/50"
                        />
                        {/* Progress Circle */}
                        <motion.circle
                            cx="40"
                            cy="40"
                            r="34"
                            stroke="currentColor"
                            strokeWidth="6"
                            fill="none"
                            strokeDasharray={`${2 * Math.PI * 34}`}
                            strokeLinecap="round"
                            className={getScoreRing()}
                            initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
                            animate={{
                                strokeDashoffset: 2 * Math.PI * 34 * (1 - score / 10)
                            }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                        />
                    </svg>

                    {/* Score Text */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                            className={`text-2xl font-bold bg-gradient-to-r ${getScoreColor()} 
                         bg-clip-text text-transparent`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5, type: 'spring' }}
                        >
                            {score.toFixed(1)}
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Checks List */}
            <div className="space-y-3">
                {checks.map((check, index) => (
                    <motion.div
                        key={check.id}
                        className="flex items-start gap-3 p-3 rounded-lg
                       bg-gray-800/30 border border-gray-700/50
                       hover:bg-gray-800/50 transition-colors"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                    >
                        {/* Icon */}
                        <div className="flex-shrink-0 mt-0.5">
                            {check.passed ? (
                                <CheckCircle className="w-5 h-5 text-green-400" />
                            ) : check.suggestion ? (
                                <AlertCircle className="w-5 h-5 text-yellow-400" />
                            ) : (
                                <XCircle className="w-5 h-5 text-red-400" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className={`text-sm font-medium ${check.passed ? 'text-gray-200' : 'text-gray-400'
                                }`}>
                                {check.label}
                            </div>

                            {check.suggestion && !check.passed && (
                                <div className="text-xs text-gray-500 mt-1">
                                    💡 {check.suggestion}
                                </div>
                            )}
                        </div>

                        {/* Weight Indicator */}
                        <div className="flex-shrink-0">
                            <div className="flex gap-0.5">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-1 h-4 rounded-full ${i < Math.ceil(check.weight / 3.33)
                                                ? check.passed
                                                    ? 'bg-green-500'
                                                    : 'bg-gray-600'
                                                : 'bg-gray-700'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Score Interpretation */}
            <motion.div
                className="mt-4 pt-4 border-t border-gray-700"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <div className="text-sm text-center">
                    {score >= 8 && (
                        <span className="text-green-400">
                            ✨ ยอดเยี่ยม! ประกาศของคุณมี SEO ที่ดีมาก
                        </span>
                    )}
                    {score >= 6 && score < 8 && (
                        <span className="text-yellow-400">
                            👍 ดี แต่ยังปรับปรุงได้อีก
                        </span>
                    )}
                    {score < 6 && (
                        <span className="text-red-400">
                            ⚠️ ควรปรับปรุงเพื่อเพิ่มโอกาสขาย
                        </span>
                    )}
                </div>
            </motion.div>
        </motion.div>
    )
}

// Helper function to generate SEO checks
export function generateSEOChecks(data: {
    title: string
    description: string
    images: number
    keywords: string[]
    price: number
    category: string
}): SEOCheck[] {
    return [
        {
            id: 'title-length',
            label: 'ความยาวชื่อเหมาะสม',
            passed: data.title.length >= 30 && data.title.length <= 60,
            suggestion: data.title.length < 30
                ? 'เพิ่มรายละเอียดในชื่อ (30-60 ตัวอักษร)'
                : 'ลดความยาวชื่อ (30-60 ตัวอักษร)',
            weight: 8
        },
        {
            id: 'description-length',
            label: 'คำอธิบายละเอียด',
            passed: data.description.length >= 150,
            suggestion: 'เพิ่มรายละเอียด (แนะนำ 150-500 คำ)',
            weight: 10
        },
        {
            id: 'images-count',
            label: 'รูปภาพเพียงพอ',
            passed: data.images >= 3,
            suggestion: `เพิ่มอีก ${3 - data.images} รูปเพื่อเพิ่มความน่าเชื่อถือ`,
            weight: 7
        },
        {
            id: 'keywords',
            label: 'คีย์เวิร์ดเหมาะสม',
            passed: data.keywords.length >= 3,
            suggestion: 'เพิ่มคีย์เวิร์ดที่เกี่ยวข้อง',
            weight: 6
        },
        {
            id: 'price',
            label: 'ราคามีหลักเหตุผล',
            passed: data.price > 0 && data.price < 1000000,
            suggestion: 'ตรวจสอบราคาให้สมเหตุสมผล',
            weight: 5
        },
        {
            id: 'category',
            label: 'หมวดหมู่ถูกต้อง',
            passed: !!data.category && data.category !== 'อื่นๆ',
            suggestion: 'เลือกหมวดหมู่ที่เหมาะสม',
            weight: 8
        }
    ]
}

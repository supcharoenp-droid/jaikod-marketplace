'use client'

import { useState, useEffect } from 'react'
import type { ModerationResult, ModerationCheck } from '@/types/moderation'
import { ContentModerationService } from '@/lib/content-moderation'
import {
    CheckCircle2, XCircle, AlertTriangle, Clock,
    Sparkles, Shield, Image as ImageIcon, DollarSign,
    FileText, Tag, Phone, Zap, Brain, Eye, Target
} from 'lucide-react'

interface ModerationStatusProps {
    productId: string
    moderationResult?: ModerationResult
    onResubmit?: () => void
}

export default function ModerationStatus({
    productId,
    moderationResult,
    onResubmit
}: ModerationStatusProps) {
    const [result, setResult] = useState<ModerationResult | undefined>(moderationResult)
    const [isAnalyzing, setIsAnalyzing] = useState(!moderationResult)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        if (moderationResult) {
            setResult(moderationResult)
            setIsAnalyzing(false)
        }
    }, [moderationResult])

    // Simulate AI analyzing animation
    useEffect(() => {
        if (isAnalyzing) {
            const interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval)
                        return 100
                    }
                    return prev + 2
                })
            }, 50)
            return () => clearInterval(interval)
        }
    }, [isAnalyzing])

    if (isAnalyzing || !result) {
        return (
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 rounded-3xl p-8 border border-purple-200/50 dark:border-purple-500/20">
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 via-blue-500/5 to-purple-500/5 animate-pulse" />

                <div className="relative z-10 text-center">
                    {/* AI Brain Icon with glow */}
                    <div className="relative inline-block mb-6">
                        <div className="absolute inset-0 bg-purple-500/20 blur-2xl rounded-full animate-pulse" />
                        <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 p-4 rounded-2xl">
                            <Brain className="w-12 h-12 text-white animate-pulse" />
                        </div>
                        <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-bounce" />
                    </div>

                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                        AI กำลังวิเคราะห์ประกาศของคุณ
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        ระบบ AI กำลังตรวจสอบเนื้อหา รูปภาพ และความปลอดภัย
                    </p>

                    {/* Progress bar */}
                    <div className="max-w-md mx-auto mb-4">
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                            {progress}% เสร็จสมบูรณ์
                        </p>
                    </div>

                    {/* Analyzing steps */}
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                            <span>ตรวจสอบเนื้อหา</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                            <span>วิเคราะห์รูปภาพ</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                            <span>ตรวจสอบความปลอดภัย</span>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const statusConfig = {
        pending: {
            icon: Clock,
            gradient: 'from-gray-500 to-gray-600',
            glow: 'shadow-gray-500/20',
            title: 'รอตรวจสอบ',
            subtitle: 'ประกาศของคุณอยู่ในคิวรอตรวจสอบ',
            emoji: '⏳'
        },
        under_review: {
            icon: Eye,
            gradient: 'from-yellow-500 to-orange-500',
            glow: 'shadow-yellow-500/30',
            title: 'กำลังตรวจสอบโดยทีมงาน',
            subtitle: 'AI ตรวจพบบางจุดที่ต้องการการตรวจสอบเพิ่มเติม',
            emoji: '👀'
        },
        approved: {
            icon: CheckCircle2,
            gradient: 'from-green-500 to-emerald-500',
            glow: 'shadow-green-500/30',
            title: 'ผ่านการตรวจสอบ',
            subtitle: 'ประกาศของคุณผ่านการตรวจสอบและเผยแพร่แล้ว',
            emoji: '✨'
        },
        rejected: {
            icon: XCircle,
            gradient: 'from-red-500 to-rose-500',
            glow: 'shadow-red-500/30',
            title: 'ต้องปรับปรุง',
            subtitle: 'AI พบจุดที่ต้องแก้ไข กรุณาปรับปรุงตามคำแนะนำ',
            emoji: '⚠️'
        },
        flagged: {
            icon: AlertTriangle,
            gradient: 'from-orange-500 to-red-500',
            glow: 'shadow-orange-500/30',
            title: 'ถูกรายงาน',
            subtitle: 'ประกาศของคุณถูกรายงานโดยผู้ใช้',
            emoji: '🚨'
        }
    }

    const config = statusConfig[result.status]
    const StatusIcon = config.icon

    const checkIcons: Record<string, any> = {
        'prohibited_content': Shield,
        'image_quality': ImageIcon,
        'price_validity': DollarSign,
        'description_quality': FileText,
        'title_quality': Tag,
        'category_match': Target,
        'contact_info': Phone,
    }

    return (
        <div className="space-y-6">
            {/* AI Analysis Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900/20 rounded-3xl p-6 border border-purple-200/50 dark:border-purple-500/20">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-full blur-3xl" />

                <div className="relative z-10">
                    <div className="flex items-start gap-4 mb-6">
                        <div className={`relative bg-gradient-to-br ${config.gradient} p-3 rounded-2xl ${config.glow} shadow-lg`}>
                            <StatusIcon className="w-8 h-8 text-white" />
                            <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-300 animate-pulse" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className={`text-2xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                                    {config.emoji} {config.title}
                                </h3>
                                {result.auto_approved && (
                                    <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-300/30 dark:border-purple-500/30 rounded-full">
                                        <Zap className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                                        <span className="text-xs font-medium text-purple-600 dark:text-purple-400">
                                            Auto-Approved
                                        </span>
                                    </div>
                                )}
                            </div>
                            <p className="text-gray-600 dark:text-gray-400">
                                {config.subtitle}
                            </p>
                        </div>
                    </div>

                    {/* AI Score with circular progress */}
                    <div className="flex items-center gap-6">
                        {/* Circular Score */}
                        <div className="relative">
                            <svg className="w-24 h-24 transform -rotate-90">
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    className="text-gray-200 dark:text-gray-700"
                                />
                                <circle
                                    cx="48"
                                    cy="48"
                                    r="40"
                                    stroke="url(#gradient)"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 40}`}
                                    strokeDashoffset={`${2 * Math.PI * 40 * (1 - result.overall_score / 100)}`}
                                    className="transition-all duration-1000"
                                    strokeLinecap="round"
                                />
                                <defs>
                                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" className={`${result.overall_score >= 85 ? 'text-green-500' :
                                                result.overall_score >= 70 ? 'text-yellow-500' :
                                                    'text-red-500'
                                            }`} stopColor="currentColor" />
                                        <stop offset="100%" className={`${result.overall_score >= 85 ? 'text-emerald-500' :
                                                result.overall_score >= 70 ? 'text-orange-500' :
                                                    'text-rose-500'
                                            }`} stopColor="currentColor" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="text-center">
                                    <div className={`text-2xl font-bold bg-gradient-to-r ${result.overall_score >= 85 ? 'from-green-600 to-emerald-600' :
                                            result.overall_score >= 70 ? 'from-yellow-600 to-orange-600' :
                                                'from-red-600 to-rose-600'
                                        } bg-clip-text text-transparent`}>
                                        {result.overall_score}
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">คะแนน</div>
                                </div>
                            </div>
                        </div>

                        {/* Score breakdown */}
                        <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">คุณภาพเนื้อหา</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-purple-500 to-blue-500" style={{ width: '85%' }} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">85%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">ความปลอดภัย</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-green-500 to-emerald-500" style={{ width: '95%' }} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">95%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-600 dark:text-gray-400">ความสมบูรณ์</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-32 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: '90%' }} />
                                    </div>
                                    <span className="text-xs font-medium text-gray-500">90%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Rejection reasons */}
                    {result.reasons && result.reasons.length > 0 && (
                        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-semibold text-red-900 dark:text-red-200 mb-2">
                                        จุดที่ต้องปรับปรุง:
                                    </p>
                                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                                        {result.reasons.map((reason, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                <div className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                                {getReasonText(reason)}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* AI Checks - Modern Card Grid */}
            <div className="grid grid-cols-1 gap-3">
                {result.checks.map((check, idx) => {
                    const CheckIcon = checkIcons[check.category] || Shield
                    const isPass = check.status === 'pass'
                    const isWarning = check.status === 'warning'
                    const isFail = check.status === 'fail'

                    return (
                        <div
                            key={idx}
                            className={`group relative overflow-hidden rounded-2xl p-4 border transition-all duration-300 hover:scale-[1.02] ${isPass ? 'bg-green-50/50 dark:bg-green-900/10 border-green-200 dark:border-green-800 hover:shadow-lg hover:shadow-green-500/10' :
                                    isWarning ? 'bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800 hover:shadow-lg hover:shadow-yellow-500/10' :
                                        'bg-red-50/50 dark:bg-red-900/10 border-red-200 dark:border-red-800 hover:shadow-lg hover:shadow-red-500/10'
                                }`}
                        >
                            {/* Gradient overlay */}
                            <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${isPass ? 'bg-gradient-to-r from-green-500/5 to-emerald-500/5' :
                                    isWarning ? 'bg-gradient-to-r from-yellow-500/5 to-orange-500/5' :
                                        'bg-gradient-to-r from-red-500/5 to-rose-500/5'
                                }`} />

                            <div className="relative flex items-start gap-3">
                                {/* Icon */}
                                <div className={`p-2 rounded-xl ${isPass ? 'bg-green-100 dark:bg-green-900/30' :
                                        isWarning ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                            'bg-red-100 dark:bg-red-900/30'
                                    }`}>
                                    <CheckIcon className={`w-5 h-5 ${isPass ? 'text-green-600 dark:text-green-400' :
                                            isWarning ? 'text-yellow-600 dark:text-yellow-400' :
                                                'text-red-600 dark:text-red-400'
                                        }`} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        {isPass && <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />}
                                        {isWarning && <AlertTriangle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />}
                                        {isFail && <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />}
                                        <span className={`text-sm font-semibold ${isPass ? 'text-green-900 dark:text-green-200' :
                                                isWarning ? 'text-yellow-900 dark:text-yellow-200' :
                                                    'text-red-900 dark:text-red-200'
                                            }`}>
                                            {getCategoryText(check.category)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {check.message}
                                    </p>
                                    {/* AI Confidence */}
                                    <div className="flex items-center gap-2">
                                        <Brain className="w-3 h-3 text-purple-500" />
                                        <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                                                style={{ width: `${check.confidence * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {Math.round(check.confidence * 100)}% แม่นยำ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Action Button */}
            {result.status === 'rejected' && onResubmit && (
                <button
                    onClick={onResubmit}
                    className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-2xl font-semibold transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                    <Sparkles className="w-5 h-5" />
                    แก้ไขและให้ AI ตรวจสอบอีกครั้ง
                </button>
            )}

            {/* Timestamp */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                <Clock className="w-3 h-3" />
                <span>ตรวจสอบโดย AI เมื่อ {new Date(result.created_at).toLocaleString('th-TH')}</span>
            </div>
        </div>
    )
}

function getCategoryText(category: string): string {
    const categoryMap: Record<string, string> = {
        'prohibited_content': 'เนื้อหาต้องห้าม',
        'image_quality': 'คุณภาพรูปภาพ',
        'price_validity': 'ความถูกต้องของราคา',
        'description_quality': 'คุณภาพคำอธิบาย',
        'title_quality': 'คุณภาพหัวข้อ',
        'category_match': 'ความเหมาะสมของหมวดหมู่',
        'contact_info': 'ข้อมูลติดต่อ',
    }
    return categoryMap[category] || category
}

function getReasonText(reason: string): string {
    const reasonMap: Record<string, string> = {
        'prohibited_item': 'สินค้าต้องห้าม',
        'illegal_content': 'เนื้อหาผิดกฎหมาย',
        'inappropriate': 'เนื้อหาไม่เหมาะสม',
        'fake_product': 'สินค้าปลอม',
        'misleading': 'ข้อมูลทำให้เข้าใจผิด',
        'poor_quality': 'คุณภาพรูปภาพต่ำ',
        'missing_info': 'ข้อมูลไม่ครบถ้วน',
        'spam': 'สแปม',
    }
    return reasonMap[reason] || reason
}

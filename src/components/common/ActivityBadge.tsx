'use client'

/**
 * Activity Badge Component
 * 
 * แสดงความสด + ความเคลื่อนไหวของโพสต์
 * ใช้ได้ทั้งใน Card และ Detail Page
 * 
 * ✅ Auto-updates เวลาเพื่อไม่ให้ค้างที่ "เมื่อสักครู่"
 */

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Clock, Eye, MessageCircle, Heart, RefreshCw, Users, Flame } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useRelativeTime } from '@/hooks/useRelativeTime'
import {
    ActivityData,
    selectBestActivities,
    calculateFreshnessInsight,
    detectCategoryContext,
    CategoryContext
} from '@/lib/activity-intelligence'

interface ActivityBadgeProps {
    // Core data
    createdAt: Date | any
    updatedAt?: Date | any

    // Activity metrics
    viewsToday?: number
    viewsTotal?: number
    lastChatAt?: Date | any
    lastPriceUpdateAt?: Date | any
    wishlistCount?: number
    inquiryCount?: number

    // Context
    categoryId?: number

    // Display options
    variant?: 'inline' | 'badge' | 'detailed'
    showIcon?: boolean
    className?: string
}

// Type for freshness level
type FreshnessLevel = 'very_fresh' | 'fresh' | 'moderate' | 'aging' | 'old'

// Safely convert to Date handling all possible formats
function toSafeDate(value: any): Date {
    if (!value) return new Date()
    if (value instanceof Date && !isNaN(value.getTime())) return value
    if (value?.toDate && typeof value.toDate === 'function') return value.toDate()
    if (value?.seconds) return new Date(value.seconds * 1000)
    if (typeof value === 'string' || typeof value === 'number') {
        const d = new Date(value)
        if (!isNaN(d.getTime())) return d
    }
    return new Date()
}

export default function ActivityBadge({
    createdAt,
    updatedAt,
    viewsToday,
    viewsTotal,
    lastChatAt,
    lastPriceUpdateAt,
    wishlistCount,
    inquiryCount,
    categoryId = 0,
    variant = 'inline',
    showIcon = true,
    className = ''
}: ActivityBadgeProps) {
    const { language } = useLanguage()

    // ✅ Auto-updating relative time (won't stuck on "เมื่อสักครู่")
    const { text: timeText, freshness } = useRelativeTime(createdAt, {
        language: language as 'th' | 'en'
    })

    // Build activity data for insights
    const activityData: ActivityData = useMemo(() => ({
        createdAt: toSafeDate(createdAt),
        updatedAt: updatedAt ? toSafeDate(updatedAt) : undefined,
        viewsToday,
        viewsTotal,
        lastChatAt: lastChatAt ? toSafeDate(lastChatAt) : undefined,
        lastPriceUpdateAt: lastPriceUpdateAt ? toSafeDate(lastPriceUpdateAt) : undefined,
        wishlistCount,
        inquiryCount
    }), [createdAt, updatedAt, viewsToday, viewsTotal, lastChatAt, lastPriceUpdateAt, wishlistCount, inquiryCount])

    const context: CategoryContext = detectCategoryContext(categoryId)

    // Get best activities to display
    const activities = selectBestActivities(activityData, context, language as 'th' | 'en')
    const bestActivity = activities[0]
    const activityText = bestActivity ? (language === 'th' ? bestActivity.text_th : bestActivity.text_en) : undefined
    const activityIcon = bestActivity?.icon
    const isActive = activities.length > 0

    const insight = calculateFreshnessInsight(activityData, context)

    // Freshness color map
    const freshnessColor: Record<FreshnessLevel, string> = {
        very_fresh: 'text-green-600 dark:text-green-400',
        fresh: 'text-emerald-600 dark:text-emerald-400',
        moderate: 'text-blue-600 dark:text-blue-400',
        aging: 'text-gray-500 dark:text-gray-400',
        old: 'text-gray-400 dark:text-gray-500'
    }

    const freshnessBackground: Record<FreshnessLevel, string> = {
        very_fresh: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
        fresh: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800',
        moderate: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800',
        aging: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
        old: 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
    }

    // Icon mapping
    const getActivityIcon = (icon: string) => {
        const iconMap: Record<string, React.ReactNode> = {
            '👀': <Eye className="w-3.5 h-3.5" />,
            '💬': <MessageCircle className="w-3.5 h-3.5" />,
            '❤️': <Heart className="w-3.5 h-3.5" />,
            '🔄': <RefreshCw className="w-3.5 h-3.5" />,
            '🔁': <Users className="w-3.5 h-3.5" />
        }
        return iconMap[icon] || null
    }

    // INLINE VARIANT - Minimal, for cards
    if (variant === 'inline') {
        return (
            <div className={`flex items-center gap-1.5 text-[11px] ${freshnessColor[freshness]} ${className}`}>
                {showIcon && <Clock className="w-3 h-3" />}
                <span>{timeText}</span>

                {/* Activity separator + text */}
                {activityText && (
                    <>
                        <span className="opacity-50">·</span>
                        <span className="flex items-center gap-1">
                            {activityIcon && getActivityIcon(activityIcon)}
                            <span className="truncate max-w-[120px]">{activityText}</span>
                        </span>
                    </>
                )}

                {/* Hot indicator for very fresh + active */}
                {insight.level === 'hot' && (
                    <Flame className="w-3 h-3 text-orange-500 animate-pulse ml-1" />
                )}
            </div>
        )
    }

    // BADGE VARIANT - For compact display with background
    if (variant === 'badge') {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${freshnessBackground[freshness]} ${className}`}
            >
                <div className={`flex items-center gap-1 ${freshnessColor[freshness]}`}>
                    <Clock className="w-3 h-3" />
                    <span className="text-xs font-medium">{timeText}</span>
                </div>

                {activityText && (
                    <>
                        <div className="w-px h-3 bg-current opacity-20" />
                        <div className={`flex items-center gap-1 ${freshnessColor[freshness]}`}>
                            {activityIcon && <span>{activityIcon}</span>}
                            <span className="text-xs">{activityText}</span>
                        </div>
                    </>
                )}

                {insight.level === 'hot' && (
                    <span className="text-xs">🔥</span>
                )}
            </motion.div>
        )
    }

    // DETAILED VARIANT - For detail pages
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border ${freshnessBackground[freshness]} p-4 ${className}`}
        >
            {/* Time Row */}
            <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center gap-2 ${freshnessColor[freshness]}`}>
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">
                        {language === 'th' ? 'โพสต์เมื่อ' : 'Posted'} {timeText}
                    </span>
                </div>

                {insight.level === 'hot' && (
                    <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-xs font-bold text-orange-600 dark:text-orange-400">
                            {language === 'th' ? 'กำลังฮิต' : 'Hot'}
                        </span>
                    </div>
                )}
            </div>

            {/* Activity Metrics */}
            {isActive && (
                <div className="grid grid-cols-2 gap-3">
                    {viewsToday !== undefined && viewsToday > 0 && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Eye className="w-4 h-4" />
                            <div>
                                <p className="text-[10px] text-gray-400">
                                    {language === 'th' ? 'ดูวันนี้' : 'Views Today'}
                                </p>
                                <p className="text-sm font-bold">{viewsToday}</p>
                            </div>
                        </div>
                    )}

                    {wishlistCount !== undefined && wishlistCount > 0 && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Heart className="w-4 h-4 text-red-400" />
                            <div>
                                <p className="text-[10px] text-gray-400">
                                    {language === 'th' ? 'บันทึกไว้' : 'Saved'}
                                </p>
                                <p className="text-sm font-bold">{wishlistCount}</p>
                            </div>
                        </div>
                    )}

                    {inquiryCount !== undefined && inquiryCount > 0 && (
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <Users className="w-4 h-4 text-purple-400" />
                            <div>
                                <p className="text-[10px] text-gray-400">
                                    {language === 'th' ? 'สอบถาม' : 'Inquiries'}
                                </p>
                                <p className="text-sm font-bold">{inquiryCount}</p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* No activity message */}
            {!isActive && freshness !== 'very_fresh' && freshness !== 'fresh' && (
                <p className="text-xs text-gray-400">
                    {language === 'th'
                        ? 'ยังไม่มีกิจกรรมล่าสุด'
                        : 'No recent activity'
                    }
                </p>
            )}
        </motion.div>
    )
}

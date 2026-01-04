'use client'

/**
 * useActivityIntelligence Hook
 * 
 * Real-time activity tracking for listings
 * Auto-updates every minute
 */

import { useState, useEffect, useCallback, useMemo } from 'react'
import {
    ActivityData,
    ActivityDisplay,
    FreshnessInsight,
    generateActivityDisplay,
    calculateFreshnessInsight,
    detectCategoryContext,
    CategoryContext
} from '@/lib/activity-intelligence'
import { useLanguage } from '@/contexts/LanguageContext'

interface UseActivityIntelligenceProps {
    productId: string
    createdAt: Date
    updatedAt?: Date
    categoryId?: number

    // These can be fetched or provided
    viewsToday?: number
    lastChatAt?: Date
    wishlistCount?: number

    // Auto-refresh
    autoRefresh?: boolean
    refreshInterval?: number // ms
}

interface UseActivityIntelligenceReturn {
    display: ActivityDisplay
    insight: FreshnessInsight
    context: CategoryContext
    isLoading: boolean
    refresh: () => void
}

export function useActivityIntelligence({
    productId,
    createdAt,
    updatedAt,
    categoryId = 0,
    viewsToday,
    lastChatAt,
    wishlistCount,
    autoRefresh = true,
    refreshInterval = 60000 // 1 minute default
}: UseActivityIntelligenceProps): UseActivityIntelligenceReturn {
    const { language } = useLanguage()
    const [isLoading, setIsLoading] = useState(false)
    const [currentData, setCurrentData] = useState<ActivityData>({
        createdAt: new Date(createdAt),
        updatedAt: updatedAt ? new Date(updatedAt) : undefined,
        viewsToday,
        lastChatAt: lastChatAt ? new Date(lastChatAt) : undefined,
        wishlistCount
    })

    const context = useMemo(() => detectCategoryContext(categoryId), [categoryId])

    // Update data when props change
    useEffect(() => {
        setCurrentData({
            createdAt: new Date(createdAt),
            updatedAt: updatedAt ? new Date(updatedAt) : undefined,
            viewsToday,
            lastChatAt: lastChatAt ? new Date(lastChatAt) : undefined,
            wishlistCount
        })
    }, [createdAt, updatedAt, viewsToday, lastChatAt, wishlistCount])

    // Auto-refresh for live time updates
    const [tickCount, setTickCount] = useState(0)

    useEffect(() => {
        if (!autoRefresh) return

        const interval = setInterval(() => {
            setTickCount(c => c + 1)
        }, refreshInterval)

        return () => clearInterval(interval)
    }, [autoRefresh, refreshInterval])

    // Generate display (re-runs on tick or data change)
    const display = useMemo(() => {
        // tickCount forces recalculation for live time updates
        return generateActivityDisplay(currentData, context, language as 'th' | 'en')
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentData, context, language, tickCount])

    const insight = useMemo(() => {
        return calculateFreshnessInsight(currentData, context)
    }, [currentData, context])

    const refresh = useCallback(() => {
        setTickCount(c => c + 1)
    }, [])

    return {
        display,
        insight,
        context,
        isLoading,
        refresh
    }
}

/**
 * Simple hook for just relative time (for cards)
 */
export function useRelativeTime(
    date: Date,
    autoRefresh = true,
    refreshInterval = 60000
): string {
    const { language } = useLanguage()
    const [tickCount, setTickCount] = useState(0)

    useEffect(() => {
        if (!autoRefresh) return

        const interval = setInterval(() => {
            setTickCount(c => c + 1)
        }, refreshInterval)

        return () => clearInterval(interval)
    }, [autoRefresh, refreshInterval])

    return useMemo(() => {
        const now = new Date()
        const diffMs = now.getTime() - new Date(date).getTime()
        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        if (diffMinutes < 1) {
            return language === 'th' ? 'เมื่อสักครู่' : 'Just now'
        }

        if (diffMinutes < 60) {
            return language === 'th'
                ? `${diffMinutes} นาทีที่แล้ว`
                : `${diffMinutes}m ago`
        }

        if (diffHours < 24) {
            return language === 'th'
                ? `${diffHours} ชม.ที่แล้ว`
                : `${diffHours}h ago`
        }

        if (diffDays === 1) {
            return language === 'th' ? 'เมื่อวาน' : 'Yesterday'
        }

        if (diffDays < 7) {
            return language === 'th'
                ? `${diffDays} วันที่แล้ว`
                : `${diffDays}d ago`
        }

        const weeks = Math.floor(diffDays / 7)
        if (diffDays < 30) {
            return language === 'th'
                ? `${weeks} สัปดาห์ที่แล้ว`
                : `${weeks}w ago`
        }

        const months = Math.floor(diffDays / 30)
        return language === 'th'
            ? `${months} เดือนที่แล้ว`
            : `${months}mo ago`
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [date, language, tickCount])
}

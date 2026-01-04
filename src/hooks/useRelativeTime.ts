'use client'

/**
 * useRelativeTime Hook
 * 
 * Hook ที่ auto-update เวลาเพื่อไม่ให้ค้างที่ "เมื่อสักครู่"
 * จะ re-render ทุก interval ที่เหมาะสม:
 * - < 1 นาที: ทุก 30 วินาที
 * - < 1 ชั่วโมง: ทุก 1 นาที
 * - > 1 ชั่วโมง: ทุก 5 นาที
 */

import { useState, useEffect, useMemo, useCallback } from 'react'

interface UseRelativeTimeOptions {
    language?: 'th' | 'en'
    updateInterval?: number // Override auto interval
}

interface UseRelativeTimeReturn {
    text: string
    diffMinutes: number
    diffHours: number
    diffDays: number
    freshness: 'very_fresh' | 'fresh' | 'moderate' | 'aging' | 'old'
}

/**
 * Safely convert various date formats to Date object
 */
function toSafeDate(value: any): Date | null {
    if (!value) return null
    if (value instanceof Date && !isNaN(value.getTime())) return value
    if (value?.toDate && typeof value.toDate === 'function') return value.toDate()
    if (value?.seconds) return new Date(value.seconds * 1000)
    if (typeof value === 'string' || typeof value === 'number') {
        const d = new Date(value)
        if (!isNaN(d.getTime())) return d
    }
    return null
}

/**
 * Calculate relative time text
 */
function getRelativeText(diffMs: number, language: 'th' | 'en'): string {
    const diffSeconds = Math.floor(diffMs / 1000)
    const diffMinutes = Math.floor(diffSeconds / 60)
    const diffHours = Math.floor(diffMinutes / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (language === 'th') {
        if (diffSeconds < 60) return 'เมื่อสักครู่'
        if (diffMinutes < 60) return `${diffMinutes} นาทีที่แล้ว`
        if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`
        if (diffDays < 7) {
            if (diffDays === 1) return 'เมื่อวาน'
            return `${diffDays} วันที่แล้ว`
        }
        if (diffDays < 30) {
            const weeks = Math.floor(diffDays / 7)
            return `${weeks} สัปดาห์ที่แล้ว`
        }
        const months = Math.floor(diffDays / 30)
        if (months < 12) return `${months} เดือนที่แล้ว`
        return `${Math.floor(diffDays / 365)} ปีที่แล้ว`
    }

    // English
    if (diffSeconds < 60) return 'Just now'
    if (diffMinutes === 1) return '1 minute ago'
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`
    if (diffHours === 1) return '1 hour ago'
    if (diffHours < 24) return `${diffHours} hours ago`
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7)
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`
    }
    const months = Math.floor(diffDays / 30)
    if (months < 12) return `${months} month${months > 1 ? 's' : ''} ago`
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) > 1 ? 's' : ''} ago`
}

/**
 * Determine optimal update interval based on age
 */
function getUpdateInterval(diffMs: number): number {
    const diffMinutes = diffMs / (1000 * 60)

    if (diffMinutes < 1) return 30 * 1000      // Every 30 seconds
    if (diffMinutes < 60) return 60 * 1000     // Every 1 minute
    if (diffMinutes < 1440) return 5 * 60 * 1000 // Every 5 minutes
    return 30 * 60 * 1000                       // Every 30 minutes
}

/**
 * Calculate freshness level
 */
function getFreshness(diffMs: number): UseRelativeTimeReturn['freshness'] {
    const diffDays = diffMs / (1000 * 60 * 60 * 24)

    if (diffDays < 1) return 'very_fresh'
    if (diffDays < 3) return 'fresh'
    if (diffDays < 7) return 'moderate'
    if (diffDays < 30) return 'aging'
    return 'old'
}

/**
 * Hook: useRelativeTime
 * 
 * Auto-updates relative time display
 */
export function useRelativeTime(
    date: Date | any,
    options: UseRelativeTimeOptions = {}
): UseRelativeTimeReturn {
    const { language = 'th', updateInterval } = options

    // Convert to safe date
    const targetDate = useMemo(() => toSafeDate(date), [date])

    // State for triggering updates
    const [now, setNow] = useState(() => Date.now())

    // Calculate diff
    const diffMs = useMemo(() => {
        if (!targetDate) return 0
        return now - targetDate.getTime()
    }, [targetDate, now])

    // Auto-update timer
    useEffect(() => {
        if (!targetDate) return

        const interval = updateInterval || getUpdateInterval(diffMs)

        const timer = setInterval(() => {
            setNow(Date.now())
        }, interval)

        return () => clearInterval(timer)
    }, [targetDate, diffMs, updateInterval])

    // Return computed values
    return useMemo(() => {
        if (!targetDate) {
            return {
                text: language === 'th' ? 'ไม่ทราบ' : 'Unknown',
                diffMinutes: 0,
                diffHours: 0,
                diffDays: 0,
                freshness: 'old' as const
            }
        }

        const diffMinutes = Math.floor(diffMs / (1000 * 60))
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

        return {
            text: getRelativeText(diffMs, language),
            diffMinutes,
            diffHours,
            diffDays,
            freshness: getFreshness(diffMs)
        }
    }, [targetDate, diffMs, language])
}

/**
 * Shorthand helper for formatting without hook (one-time use)
 */
export function formatRelativeTimeOnce(
    date: Date | any,
    language: 'th' | 'en' = 'th'
): string {
    const targetDate = toSafeDate(date)
    if (!targetDate) return language === 'th' ? 'ไม่ทราบ' : 'Unknown'

    const diffMs = Date.now() - targetDate.getTime()
    return getRelativeText(diffMs, language)
}

'use client'

/**
 * AI Buyer Intent Detection Hook
 * 
 * ตรวจจับระดับความสนใจของผู้ซื้อจากพฤติกรรม:
 * - เวลาที่ดูหน้า
 * - Scroll depth
 * - จำนวน clicks
 * - การกลับมาดูซ้ำ
 * - การย้อนขึ้นไปดูราคา
 */

import { useState, useEffect, useCallback, useRef } from 'react'

export type BuyerIntentLevel = 'low' | 'medium' | 'high' | 'very_high'

export interface BuyerIntentData {
    level: BuyerIntentLevel
    score: number // 0-100
    signals: BuyerIntentSignal[]
    confidenceLevel: 'low' | 'medium' | 'high'
    suggestedAction: 'wait' | 'soft_nudge' | 'show_cta' | 'urgency'
}

export interface BuyerIntentSignal {
    type: 'time_on_page' | 'scroll_depth' | 'price_check' | 'image_view' | 'revisit' | 'seller_view' | 'similar_browse'
    weight: number
    description_th: string
    description_en: string
}

interface UseBuyerIntentProps {
    productId: string
    productPrice?: number
    enabled?: boolean
}

interface UseBuyerIntentReturn {
    intent: BuyerIntentData
    trackEvent: (eventType: string, data?: Record<string, any>) => void
    reset: () => void
}

// Decay factor - older actions count less
const DECAY_FACTOR = 0.95

// Score thresholds
const THRESHOLDS = {
    low: 20,
    medium: 40,
    high: 60,
    very_high: 80
}

export function useBuyerIntent({
    productId,
    productPrice,
    enabled = true
}: UseBuyerIntentProps): UseBuyerIntentReturn {
    const [score, setScore] = useState(0)
    const [signals, setSignals] = useState<BuyerIntentSignal[]>([])

    // Refs for tracking
    const startTimeRef = useRef<number>(Date.now())
    const lastScrollRef = useRef<number>(0)
    const maxScrollRef = useRef<number>(0)
    const priceCheckCountRef = useRef<number>(0)
    const imageViewCountRef = useRef<number>(0)
    const clickCountRef = useRef<number>(0)
    const isRevisitRef = useRef<boolean>(false)

    // Check if revisit
    useEffect(() => {
        if (!enabled) return

        const visitKey = `visited_${productId}`
        const hasVisited = localStorage.getItem(visitKey)

        if (hasVisited) {
            isRevisitRef.current = true
            addSignal({
                type: 'revisit',
                weight: 15,
                description_th: 'กลับมาดูซ้ำ',
                description_en: 'Returned to view'
            })
        }

        localStorage.setItem(visitKey, Date.now().toString())

        return () => {
            // Cleanup
        }
    }, [productId, enabled])

    // Track time on page
    useEffect(() => {
        if (!enabled) return

        const checkTimeInterval = setInterval(() => {
            const timeSpent = (Date.now() - startTimeRef.current) / 1000

            // Time thresholds
            if (timeSpent >= 10 && timeSpent < 15) {
                addSignal({
                    type: 'time_on_page',
                    weight: 5,
                    description_th: 'ใช้เวลาดู 10+ วินาที',
                    description_en: 'Spent 10+ seconds'
                })
            } else if (timeSpent >= 30 && timeSpent < 35) {
                addSignal({
                    type: 'time_on_page',
                    weight: 10,
                    description_th: 'ใช้เวลาดู 30+ วินาที',
                    description_en: 'Spent 30+ seconds'
                })
            } else if (timeSpent >= 60 && timeSpent < 65) {
                addSignal({
                    type: 'time_on_page',
                    weight: 15,
                    description_th: 'ใช้เวลาดู 1+ นาที',
                    description_en: 'Spent 1+ minute'
                })
            } else if (timeSpent >= 180 && timeSpent < 185) {
                addSignal({
                    type: 'time_on_page',
                    weight: 25,
                    description_th: 'ใช้เวลาดู 3+ นาที',
                    description_en: 'Spent 3+ minutes'
                })
            }
        }, 5000)

        return () => clearInterval(checkTimeInterval)
    }, [enabled])

    // Track scroll
    useEffect(() => {
        if (!enabled) return

        const handleScroll = () => {
            const scrollTop = window.scrollY
            const docHeight = document.documentElement.scrollHeight - window.innerHeight
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0

            // Track max scroll
            if (scrollPercent > maxScrollRef.current) {
                maxScrollRef.current = scrollPercent

                // Scroll milestones
                if (scrollPercent >= 25 && scrollPercent < 30) {
                    addSignal({
                        type: 'scroll_depth',
                        weight: 3,
                        description_th: 'เลื่อนดู 25%',
                        description_en: 'Scrolled 25%'
                    })
                } else if (scrollPercent >= 50 && scrollPercent < 55) {
                    addSignal({
                        type: 'scroll_depth',
                        weight: 5,
                        description_th: 'เลื่อนดู 50%',
                        description_en: 'Scrolled 50%'
                    })
                } else if (scrollPercent >= 75 && scrollPercent < 80) {
                    addSignal({
                        type: 'scroll_depth',
                        weight: 8,
                        description_th: 'เลื่อนดูเกือบหมด',
                        description_en: 'Scrolled 75%'
                    })
                } else if (scrollPercent >= 95) {
                    addSignal({
                        type: 'scroll_depth',
                        weight: 12,
                        description_th: 'ดูครบหน้า',
                        description_en: 'Viewed entire page'
                    })
                }
            }

            // Detect scrolling back up to price (high intent signal)
            if (scrollPercent < lastScrollRef.current - 30 && lastScrollRef.current > 50) {
                priceCheckCountRef.current++
                if (priceCheckCountRef.current <= 3) {
                    addSignal({
                        type: 'price_check',
                        weight: 10,
                        description_th: 'ย้อนกลับไปดูราคา',
                        description_en: 'Scrolled back to price'
                    })
                }
            }

            lastScrollRef.current = scrollPercent
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [enabled])

    // Add signal and update score
    const addSignal = useCallback((signal: BuyerIntentSignal) => {
        setSignals(prev => {
            // Prevent duplicate signals of same type within short time
            const recentSame = prev.filter(s => s.type === signal.type).length
            if (recentSame >= 3) return prev

            return [...prev, signal]
        })

        setScore(prev => Math.min(100, prev + signal.weight))
    }, [])

    // Public track event
    const trackEvent = useCallback((eventType: string, data?: Record<string, any>) => {
        switch (eventType) {
            case 'image_click':
            case 'image_zoom':
                imageViewCountRef.current++
                if (imageViewCountRef.current <= 5) {
                    addSignal({
                        type: 'image_view',
                        weight: 5,
                        description_th: 'ดูรูปภาพละเอียด',
                        description_en: 'Viewed images closely'
                    })
                }
                break

            case 'seller_profile_view':
                addSignal({
                    type: 'seller_view',
                    weight: 10,
                    description_th: 'ดูโปรไฟล์ผู้ขาย',
                    description_en: 'Viewed seller profile'
                })
                break

            case 'similar_product_view':
                addSignal({
                    type: 'similar_browse',
                    weight: 8,
                    description_th: 'ดูสินค้าคล้ายกัน',
                    description_en: 'Browsed similar items'
                })
                break

            case 'chat_start':
                addSignal({
                    type: 'price_check',
                    weight: 25,
                    description_th: 'เริ่มแชท',
                    description_en: 'Started chat'
                })
                break

            case 'wishlist_add':
                addSignal({
                    type: 'price_check',
                    weight: 20,
                    description_th: 'เพิ่มในรายการโปรด',
                    description_en: 'Added to wishlist'
                })
                break
        }
    }, [addSignal])

    // Reset
    const reset = useCallback(() => {
        setScore(0)
        setSignals([])
        startTimeRef.current = Date.now()
        maxScrollRef.current = 0
        priceCheckCountRef.current = 0
        imageViewCountRef.current = 0
    }, [])

    // Calculate intent data
    const intent: BuyerIntentData = {
        level: score >= THRESHOLDS.very_high ? 'very_high'
            : score >= THRESHOLDS.high ? 'high'
                : score >= THRESHOLDS.medium ? 'medium'
                    : 'low',
        score,
        signals,
        confidenceLevel: signals.length >= 5 ? 'high' : signals.length >= 2 ? 'medium' : 'low',
        suggestedAction: score >= THRESHOLDS.very_high ? 'urgency'
            : score >= THRESHOLDS.high ? 'show_cta'
                : score >= THRESHOLDS.medium ? 'soft_nudge'
                    : 'wait'
    }

    return {
        intent,
        trackEvent,
        reset
    }
}

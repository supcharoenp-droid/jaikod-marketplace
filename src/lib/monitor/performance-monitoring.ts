/**
 * PERFORMANCE MONITORING SERVICE
 * 
 * ระบบติดตาม performance ของแอปพลิเคชัน
 * - Page load times
 * - API response times
 * - Component render times
 * - Web Vitals (LCP, FID, CLS)
 * 
 * @version 1.0.0
 * @date 2024-12-29
 */

// ==========================================
// TYPES
// ==========================================

export interface PerformanceMetric {
    name: string
    value: number
    unit: 'ms' | 's' | 'score'
    timestamp: Date
    context?: Record<string, any>
}

export interface PageLoadMetrics {
    url: string
    ttfb: number        // Time to First Byte
    fcp: number         // First Contentful Paint
    lcp: number         // Largest Contentful Paint
    cls: number         // Cumulative Layout Shift
    fid: number         // First Input Delay
    totalTime: number
    timestamp: Date
}

export interface APIMetric {
    endpoint: string
    method: string
    duration: number
    status: number
    success: boolean
    timestamp: Date
}

export interface ComponentMetric {
    componentName: string
    renderTime: number
    rerenderCount: number
    timestamp: Date
}

export interface PerformanceReport {
    pageLoads: PageLoadMetrics[]
    apiCalls: APIMetric[]
    components: ComponentMetric[]
    averages: {
        pageLoad: number
        apiResponse: number
        componentRender: number
    }
    webVitals: {
        lcp: number
        fid: number
        cls: number
        score: 'good' | 'needs-improvement' | 'poor'
    }
}

// ==========================================
// PERFORMANCE SERVICE
// ==========================================

class PerformanceMonitoringService {
    private static instance: PerformanceMonitoringService

    private pageLoads: PageLoadMetrics[] = []
    private apiMetrics: APIMetric[] = []
    private componentMetrics: Map<string, ComponentMetric> = new Map()
    private maxMetrics = 50

    private webVitals = {
        lcp: 0,
        fid: 0,
        cls: 0
    }

    private constructor() {
        if (typeof window !== 'undefined') {
            this.observeWebVitals()
        }
    }

    public static getInstance(): PerformanceMonitoringService {
        if (!PerformanceMonitoringService.instance) {
            PerformanceMonitoringService.instance = new PerformanceMonitoringService()
        }
        return PerformanceMonitoringService.instance
    }

    // ==========================================
    // PAGE LOAD METRICS
    // ==========================================

    /**
     * Record page load performance
     */
    recordPageLoad() {
        if (typeof window === 'undefined' || !window.performance) return

        // Wait for page to fully load
        if (document.readyState === 'complete') {
            this.capturePageMetrics()
        } else {
            window.addEventListener('load', () => this.capturePageMetrics())
        }
    }

    private capturePageMetrics() {
        const perf = window.performance
        const timing = perf.timing
        const navigation = perf.getEntriesByType('navigation')[0] as PerformanceNavigationTiming

        const metrics: PageLoadMetrics = {
            url: window.location.pathname,
            ttfb: navigation?.responseStart - navigation?.requestStart || 0,
            fcp: this.getFCP(),
            lcp: this.webVitals.lcp,
            cls: this.webVitals.cls,
            fid: this.webVitals.fid,
            totalTime: navigation?.loadEventEnd - navigation?.fetchStart || 0,
            timestamp: new Date()
        }

        this.pageLoads.push(metrics)
        this.cleanupMetrics()

        // Log if slow
        if (metrics.totalTime > 3000) {
            console.warn(`⚠️ Slow page load: ${metrics.url} took ${metrics.totalTime}ms`)
        }
    }

    private getFCP(): number {
        const entries = performance.getEntriesByType('paint')
        const fcp = entries.find(e => e.name === 'first-contentful-paint')
        return fcp?.startTime || 0
    }

    // ==========================================
    // API METRICS
    // ==========================================

    /**
     * Record API call performance
     */
    recordAPICall(
        endpoint: string,
        method: string,
        duration: number,
        status: number
    ) {
        const metric: APIMetric = {
            endpoint,
            method,
            duration,
            status,
            success: status >= 200 && status < 300,
            timestamp: new Date()
        }

        this.apiMetrics.push(metric)
        this.cleanupMetrics()

        // Log slow API calls
        if (duration > 2000) {
            console.warn(`⚠️ Slow API: ${method} ${endpoint} took ${duration}ms`)
        }
    }

    /**
     * Create a timer for API calls
     */
    startAPITimer(endpoint: string, method: string) {
        const start = performance.now()

        return {
            end: (status: number) => {
                const duration = Math.round(performance.now() - start)
                this.recordAPICall(endpoint, method, duration, status)
                return duration
            }
        }
    }

    // ==========================================
    // COMPONENT METRICS
    // ==========================================

    /**
     * Record component render time
     */
    recordComponentRender(componentName: string, renderTime: number) {
        const existing = this.componentMetrics.get(componentName)

        if (existing) {
            existing.renderTime = (existing.renderTime + renderTime) / 2 // Running average
            existing.rerenderCount++
            existing.timestamp = new Date()
        } else {
            this.componentMetrics.set(componentName, {
                componentName,
                renderTime,
                rerenderCount: 1,
                timestamp: new Date()
            })
        }

        // Warn on slow renders
        if (renderTime > 100) {
            console.warn(`⚠️ Slow render: ${componentName} took ${renderTime}ms`)
        }
    }

    /**
     * Create a timer for component renders
     */
    startRenderTimer(componentName: string) {
        const start = performance.now()

        return {
            end: () => {
                const duration = Math.round(performance.now() - start)
                this.recordComponentRender(componentName, duration)
                return duration
            }
        }
    }

    // ==========================================
    // WEB VITALS
    // ==========================================

    private observeWebVitals() {
        // Observe LCP (Largest Contentful Paint)
        try {
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries()
                const lastEntry = entries[entries.length - 1] as any
                this.webVitals.lcp = lastEntry?.startTime || 0
            })
            lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })
        } catch (e) {
            // Not supported
        }

        // Observe FID (First Input Delay)
        try {
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries() as any[]
                const firstInput = entries[0]
                if (firstInput) {
                    this.webVitals.fid = firstInput.processingStart - firstInput.startTime
                }
            })
            fidObserver.observe({ entryTypes: ['first-input'] })
        } catch (e) {
            // Not supported
        }

        // Observe CLS (Cumulative Layout Shift)
        try {
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries() as any[]
                entries.forEach((entry) => {
                    if (!entry.hadRecentInput) {
                        this.webVitals.cls += entry.value
                    }
                })
            })
            clsObserver.observe({ entryTypes: ['layout-shift'] })
        } catch (e) {
            // Not supported
        }
    }

    // ==========================================
    // REPORTS
    // ==========================================

    /**
     * Get performance report
     */
    getReport(): PerformanceReport {
        const pageLoadAvg = this.pageLoads.length > 0
            ? this.pageLoads.reduce((sum, m) => sum + m.totalTime, 0) / this.pageLoads.length
            : 0

        const apiAvg = this.apiMetrics.length > 0
            ? this.apiMetrics.reduce((sum, m) => sum + m.duration, 0) / this.apiMetrics.length
            : 0

        const components = Array.from(this.componentMetrics.values())
        const componentAvg = components.length > 0
            ? components.reduce((sum, m) => sum + m.renderTime, 0) / components.length
            : 0

        // Calculate Web Vitals score
        let score: 'good' | 'needs-improvement' | 'poor' = 'good'
        if (this.webVitals.lcp > 4000 || this.webVitals.fid > 300 || this.webVitals.cls > 0.25) {
            score = 'poor'
        } else if (this.webVitals.lcp > 2500 || this.webVitals.fid > 100 || this.webVitals.cls > 0.1) {
            score = 'needs-improvement'
        }

        return {
            pageLoads: this.pageLoads,
            apiCalls: this.apiMetrics,
            components,
            averages: {
                pageLoad: Math.round(pageLoadAvg),
                apiResponse: Math.round(apiAvg),
                componentRender: Math.round(componentAvg)
            },
            webVitals: {
                ...this.webVitals,
                score
            }
        }
    }

    /**
     * Get slow endpoints
     */
    getSlowEndpoints(threshold: number = 1000): APIMetric[] {
        return this.apiMetrics
            .filter(m => m.duration > threshold)
            .sort((a, b) => b.duration - a.duration)
    }

    /**
     * Get slow components
     */
    getSlowComponents(threshold: number = 50): ComponentMetric[] {
        return Array.from(this.componentMetrics.values())
            .filter(m => m.renderTime > threshold)
            .sort((a, b) => b.renderTime - a.renderTime)
    }

    /**
     * Clear all metrics
     */
    clear() {
        this.pageLoads = []
        this.apiMetrics = []
        this.componentMetrics.clear()
    }

    // ==========================================
    // PRIVATE
    // ==========================================

    private cleanupMetrics() {
        if (this.pageLoads.length > this.maxMetrics) {
            this.pageLoads = this.pageLoads.slice(-this.maxMetrics)
        }
        if (this.apiMetrics.length > this.maxMetrics * 2) {
            this.apiMetrics = this.apiMetrics.slice(-this.maxMetrics * 2)
        }
    }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const perfMonitor = PerformanceMonitoringService.getInstance()

// Convenience exports
export const recordPageLoad = () => perfMonitor.recordPageLoad()
export const startAPITimer = (endpoint: string, method: string) =>
    perfMonitor.startAPITimer(endpoint, method)
export const startRenderTimer = (component: string) =>
    perfMonitor.startRenderTimer(component)
export const getPerformanceReport = () => perfMonitor.getReport()
export const getSlowEndpoints = (threshold?: number) =>
    perfMonitor.getSlowEndpoints(threshold)
export const getSlowComponents = (threshold?: number) =>
    perfMonitor.getSlowComponents(threshold)

// ==========================================
// REACT HOOK
// ==========================================

import { useEffect, useRef } from 'react'

/**
 * Hook to measure component render performance
 * Usage: useRenderPerformance('MyComponent')
 */
export function useRenderPerformance(componentName: string) {
    const renderCount = useRef(0)
    const renderStart = useRef(performance.now())

    useEffect(() => {
        const renderTime = performance.now() - renderStart.current
        renderCount.current++

        perfMonitor.recordComponentRender(componentName, renderTime)

        // Reset for next render
        renderStart.current = performance.now()
    })

    return {
        getRenderCount: () => renderCount.current
    }
}

/**
 * Hook for API call timing
 * Usage: const { fetch: timedFetch } = useAPIPerformance()
 */
export function useAPIPerformance() {
    const timedFetch = async (url: string, options?: RequestInit) => {
        const method = options?.method || 'GET'
        const timer = perfMonitor.startAPITimer(url, method)

        try {
            const response = await fetch(url, options)
            timer.end(response.status)
            return response
        } catch (error) {
            timer.end(0)
            throw error
        }
    }

    return { fetch: timedFetch }
}

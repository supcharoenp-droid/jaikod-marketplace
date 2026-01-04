/**
 * ERROR MONITORING SERVICE
 * 
 * ระบบติดตามและรายงาน errors แบบ real-time
 * - Log errors to console (dev) or remote service (prod)
 * - Track error frequency
 * - Capture context (user, page, etc.)
 * - Support severity levels
 * 
 * สำหรับ production: เชื่อมต่อกับ Sentry, LogRocket หรือ service อื่น
 * 
 * @version 1.0.0
 * @date 2024-12-29
 */

// ==========================================
// TYPES
// ==========================================

export type ErrorSeverity = 'debug' | 'info' | 'warning' | 'error' | 'critical'

export interface ErrorContext {
    userId?: string
    page?: string
    action?: string
    component?: string
    extra?: Record<string, any>
}

export interface TrackedError {
    id: string
    message: string
    severity: ErrorSeverity
    stack?: string
    context: ErrorContext
    timestamp: Date
    count: number
    browser?: string
    url?: string
}

export interface ErrorStats {
    total: number
    bySeverity: Record<ErrorSeverity, number>
    topErrors: { message: string; count: number }[]
    lastHour: number
    lastDay: number
}

// ==========================================
// ERROR MONITORING SERVICE
// ==========================================

class ErrorMonitoringService {
    private static instance: ErrorMonitoringService
    private errors: Map<string, TrackedError> = new Map()
    private maxErrors = 100 // Keep last 100 errors in memory

    // Configuration
    private config = {
        enableConsole: true,
        enableRemote: false, // Set to true in production with Sentry
        minSeverity: 'info' as ErrorSeverity,
        sampleRate: 1.0, // 1.0 = 100% of errors
    }

    private severityLevels: Record<ErrorSeverity, number> = {
        debug: 0,
        info: 1,
        warning: 2,
        error: 3,
        critical: 4
    }

    private constructor() {
        // Set up global error handler
        if (typeof window !== 'undefined') {
            this.setupGlobalHandlers()
        }
    }

    public static getInstance(): ErrorMonitoringService {
        if (!ErrorMonitoringService.instance) {
            ErrorMonitoringService.instance = new ErrorMonitoringService()
        }
        return ErrorMonitoringService.instance
    }

    // ==========================================
    // CONFIGURATION
    // ==========================================

    /**
     * Configure the error monitoring service
     */
    configure(options: Partial<typeof this.config>) {
        this.config = { ...this.config, ...options }
    }

    // ==========================================
    // ERROR TRACKING
    // ==========================================

    /**
     * Track an error
     */
    track(
        error: Error | string,
        severity: ErrorSeverity = 'error',
        context: ErrorContext = {}
    ): string {
        // Check severity level
        if (this.severityLevels[severity] < this.severityLevels[this.config.minSeverity]) {
            return ''
        }

        // Check sample rate
        if (Math.random() > this.config.sampleRate) {
            return ''
        }

        const message = error instanceof Error ? error.message : error
        const stack = error instanceof Error ? error.stack : undefined
        const errorId = this.generateErrorId(message)

        // Check if we've seen this error before
        const existing = this.errors.get(errorId)
        if (existing) {
            existing.count++
            existing.timestamp = new Date()

            // Log only if config allows
            if (this.config.enableConsole) {
                this.logToConsole(existing)
            }

            return errorId
        }

        // Create new tracked error
        const trackedError: TrackedError = {
            id: errorId,
            message,
            severity,
            stack,
            context: {
                ...context,
                page: typeof window !== 'undefined' ? window.location.pathname : undefined
            },
            timestamp: new Date(),
            count: 1,
            browser: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
            url: typeof window !== 'undefined' ? window.location.href : undefined
        }

        // Add to map
        this.errors.set(errorId, trackedError)

        // Clean up old errors
        this.cleanupOldErrors()

        // Log
        if (this.config.enableConsole) {
            this.logToConsole(trackedError)
        }

        // Send to remote service
        if (this.config.enableRemote) {
            this.sendToRemote(trackedError)
        }

        return errorId
    }

    /**
     * Track convenience methods
     */
    debug(message: string, context?: ErrorContext) {
        return this.track(message, 'debug', context)
    }

    info(message: string, context?: ErrorContext) {
        return this.track(message, 'info', context)
    }

    warn(message: string, context?: ErrorContext) {
        return this.track(message, 'warning', context)
    }

    error(error: Error | string, context?: ErrorContext) {
        return this.track(error, 'error', context)
    }

    critical(error: Error | string, context?: ErrorContext) {
        return this.track(error, 'critical', context)
    }

    // ==========================================
    // STATISTICS
    // ==========================================

    /**
     * Get error statistics
     */
    getStats(): ErrorStats {
        const now = Date.now()
        const oneHourAgo = now - 60 * 60 * 1000
        const oneDayAgo = now - 24 * 60 * 60 * 1000

        const errors = Array.from(this.errors.values())

        const bySeverity: Record<ErrorSeverity, number> = {
            debug: 0,
            info: 0,
            warning: 0,
            error: 0,
            critical: 0
        }

        let lastHour = 0
        let lastDay = 0

        errors.forEach(err => {
            bySeverity[err.severity] += err.count

            const ts = err.timestamp.getTime()
            if (ts > oneHourAgo) lastHour += err.count
            if (ts > oneDayAgo) lastDay += err.count
        })

        // Top errors
        const topErrors = errors
            .sort((a, b) => b.count - a.count)
            .slice(0, 10)
            .map(e => ({ message: e.message, count: e.count }))

        return {
            total: errors.reduce((sum, e) => sum + e.count, 0),
            bySeverity,
            topErrors,
            lastHour,
            lastDay
        }
    }

    /**
     * Get recent errors
     */
    getRecentErrors(limit: number = 20): TrackedError[] {
        return Array.from(this.errors.values())
            .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
            .slice(0, limit)
    }

    /**
     * Clear all tracked errors
     */
    clear() {
        this.errors.clear()
    }

    // ==========================================
    // PRIVATE METHODS
    // ==========================================

    private generateErrorId(message: string): string {
        // Simple hash of message
        let hash = 0
        for (let i = 0; i < message.length; i++) {
            const char = message.charCodeAt(i)
            hash = ((hash << 5) - hash) + char
            hash = hash & hash
        }
        return `err_${Math.abs(hash).toString(16)}`
    }

    private cleanupOldErrors() {
        if (this.errors.size > this.maxErrors) {
            const sorted = Array.from(this.errors.entries())
                .sort((a, b) => a[1].timestamp.getTime() - b[1].timestamp.getTime())

            // Remove oldest errors
            const toRemove = sorted.slice(0, this.errors.size - this.maxErrors)
            toRemove.forEach(([key]) => this.errors.delete(key))
        }
    }

    private logToConsole(error: TrackedError) {
        const styles = {
            debug: 'color: gray',
            info: 'color: blue',
            warning: 'color: orange',
            error: 'color: red',
            critical: 'color: white; background: red; font-weight: bold'
        }

        const prefix = {
            debug: '🔍',
            info: 'ℹ️',
            warning: '⚠️',
            error: '❌',
            critical: '🔴'
        }

        console.log(
            `%c${prefix[error.severity]} [${error.severity.toUpperCase()}] ${error.message}`,
            styles[error.severity],
            error.count > 1 ? `(×${error.count})` : '',
            error.context
        )

        if (error.stack && (error.severity === 'error' || error.severity === 'critical')) {
            console.log(error.stack)
        }
    }

    private async sendToRemote(error: TrackedError) {
        // TODO: Implement Sentry or other remote logging
        // Example:
        // await fetch('https://your-logging-service.com/errors', {
        //     method: 'POST',
        //     body: JSON.stringify(error)
        // })

        // For now, just log that we would send
        console.log('[ErrorMonitor] Would send to remote:', error.id)
    }

    private setupGlobalHandlers() {
        // Catch unhandled errors
        window.addEventListener('error', (event) => {
            this.track(event.error || event.message, 'error', {
                component: 'window',
                extra: {
                    filename: event.filename,
                    lineno: event.lineno,
                    colno: event.colno
                }
            })
        })

        // Catch unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            this.track(
                event.reason instanceof Error ? event.reason : String(event.reason),
                'error',
                {
                    component: 'promise',
                    extra: { type: 'unhandledrejection' }
                }
            )
        })
    }
}

// ==========================================
// SINGLETON EXPORT
// ==========================================

export const errorMonitor = ErrorMonitoringService.getInstance()

// Convenience exports
export const trackError = (error: Error | string, context?: ErrorContext) =>
    errorMonitor.error(error, context)

export const trackCritical = (error: Error | string, context?: ErrorContext) =>
    errorMonitor.critical(error, context)

export const trackWarning = (message: string, context?: ErrorContext) =>
    errorMonitor.warn(message, context)

export const trackInfo = (message: string, context?: ErrorContext) =>
    errorMonitor.info(message, context)

export const getErrorStats = () => errorMonitor.getStats()

export const getRecentErrors = (limit?: number) => errorMonitor.getRecentErrors(limit)

// ==========================================
// REACT HOOK
// ==========================================

/**
 * React hook for error monitoring
 * Usage: const { trackError } = useErrorMonitor()
 */
export function useErrorMonitor() {
    const track = (error: Error | string, context?: ErrorContext) => {
        return errorMonitor.error(error, context)
    }

    const trackWithContext = (context: ErrorContext) => {
        return (error: Error | string) => errorMonitor.error(error, context)
    }

    return {
        trackError: track,
        trackWarning: (msg: string) => errorMonitor.warn(msg),
        trackInfo: (msg: string) => errorMonitor.info(msg),
        withContext: trackWithContext,
        getStats: () => errorMonitor.getStats()
    }
}

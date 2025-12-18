
import { db } from '@/lib/firebase'
import {
    collection,
    addDoc,
    serverTimestamp,
    query,
    orderBy,
    limit,
    getDocs,
    Timestamp
} from 'firebase/firestore'

/**
 * System Monitor Service
 * Handles technical logging: Errors, Performance Metrics, and Health Checks.
 * Separated from AuditLogger (which logs User Actions).
 */

export type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'CRITICAL'
export type MonitorType = 'API_LATENCY' | 'DB_ERROR' | 'APP_CRASH' | 'EXTERNAL_SERVICE'

export interface SystemLog {
    id: string
    level: LogLevel
    type: MonitorType
    message: string
    details?: string
    metadata?: any
    timestamp: Timestamp
}

// 1. Log System Event
export async function logSystemEvent(
    level: LogLevel,
    type: MonitorType,
    message: string,
    details?: string,
    metadata?: any
) {
    try {
        // Console log for Dev mode
        if (process.env.NODE_ENV === 'development') {
            const color = level === 'ERROR' || level === 'CRITICAL' ? '\x1b[31m' : '\x1b[33m'
            console.log(`${color}[SYSTEM-${type}] ${message}\x1b[0m`, details || '')
        }

        // Persist critical/error logs to DB (Skip INFO to save write costs in MVP)
        if (level !== 'INFO') {
            await addDoc(collection(db, 'system_errors'), {
                level,
                type,
                message,
                details: details || '',
                metadata: metadata || {},
                timestamp: serverTimestamp()
            })
        }
    } catch (e) {
        console.error('Failed to log system event:', e)
    }
}

// 2. Performance Tracker Helper
export async function trackApiLatency(endpoint: string, startTime: number) {
    const duration = Date.now() - startTime

    // Threshold: Alert if > 2000ms (2s)
    if (duration > 2000) {
        await logSystemEvent(
            'WARN',
            'API_LATENCY',
            `Slow API Response: ${endpoint}`,
            `Duration: ${duration}ms`,
            { endpoint, duration }
        )
    }
    return duration
}

// 3. Fetch Recent System Logs
export async function getSystemLogs(limitCount = 50) {
    try {
        const ref = collection(db, 'system_errors')
        const q = query(ref, orderBy('timestamp', 'desc'), limit(limitCount))
        const snap = await getDocs(q)
        return snap.docs.map(d => ({ id: d.id, ...d.data() } as SystemLog))
    } catch (error) {
        return []
    }
}

// 4. Ping Database (Health Check)
export async function checkDatabaseHealth(): Promise<boolean> {
    try {
        // Lightweight query just to check connection
        // Assuming 'system_config' exists, or just list collections
        // We'll read 1 generic doc or use a ping collection
        await getDocs(query(collection(db, 'users'), limit(1)))
        return true
    } catch (error) {
        await logSystemEvent('CRITICAL', 'DB_ERROR', 'Database Health Check Failed', String(error))
        return false
    }
}

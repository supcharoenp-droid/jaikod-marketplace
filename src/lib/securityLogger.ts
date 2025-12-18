import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { UserAccessLog } from '@/types/security'

// Simple regex-based UA parser (lightweight, no external deps)
const parseUserAgent = (ua: string) => {
    const browser = ua.includes('Chrome') ? 'Chrome' :
        ua.includes('Firefox') ? 'Firefox' :
            ua.includes('Safari') ? 'Safari' :
                ua.includes('Edge') ? 'Edge' : 'Unknown'

    const os = ua.includes('Windows') ? 'Windows' :
        ua.includes('Mac') ? 'MacOS' :
            ua.includes('Linux') ? 'Linux' :
                ua.includes('Android') ? 'Android' :
                    ua.includes('iOS') ? 'iOS' : 'Unknown'

    const deviceType = /Mobile|Android|iPhone|iPad/i.test(ua) ? 'mobile' : 'desktop'

    return { browser, os, deviceType }
}

// Function to get IP (Best effort for client-side)
const getClientIP = async (): Promise<string> => {
    try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 2000)

        const response = await fetch('https://api.ipify.org?format=json', {
            signal: controller.signal
        })

        clearTimeout(timeoutId)
        const data = await response.json()
        return data.ip
    } catch (e) {
        return 'unknown'
    }
}

export const logSecurityEvent = async (
    userId: string,
    action: UserAccessLog['action'],
    status: UserAccessLog['status'],
    reason?: string,
    metadata?: any
) => {
    try {
        const ua = typeof window !== 'undefined' ? window.navigator.userAgent : 'Server'
        const { browser, os, deviceType } = parseUserAgent(ua)

        // Fire-and-forget IP fetch to avoid blocking UI if possible, 
        // but for accurate logging we wait slightly or settle for 'unknown'
        const ip = await getClientIP().catch(() => 'unknown')

        const logEntry: Partial<UserAccessLog> = {
            userId,
            action,
            status,
            reason,
            ip_address: ip,
            user_agent: ua,
            device_info: {
                browser,
                os,
                device_type: deviceType as any,
                is_new_device: false // TODO: Implement device fingerprinting check in Phase 1
            },
            timestamp: serverTimestamp() as any, // Firebase timestamp
            ...metadata
        }

        // Silent write - never throw error to UI
        await addDoc(collection(db, 'user_access_logs'), logEntry)
            .catch(err => console.error('[SecurityLog] Write failed:', err))

    } catch (error) {
        // Fail safe: Security logging should never break the application
        console.error('[SecurityLog] Error:', error)
    }
}

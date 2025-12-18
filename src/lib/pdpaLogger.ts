import { db } from '@/lib/firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ConsentLog, ConsentType, ConsentStatus } from '@/types/pdpa'

// Re-use the IP fetcher from security logger or implement a shared util later
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

export const logConsent = async (
    userId: string | 'guest',
    consentType: ConsentType,
    status: ConsentStatus,
    preferences?: ConsentLog['preferences']
) => {
    try {
        const ua = typeof window !== 'undefined' ? window.navigator.userAgent : 'Server'
        const ip = await getClientIP().catch(() => 'unknown')
        const currentVersion = '1.0' // Should be pulled from config in production

        const logEntry: Partial<ConsentLog> = {
            userId,
            consentType,
            version: currentVersion,
            status,
            preferences,
            metadata: {
                ip_address: ip,
                user_agent: ua,
                platform: 'web'
            },
            timestamp: serverTimestamp() as any
        }

        // Silent write - fire and forget
        await addDoc(collection(db, 'consent_logs'), logEntry)
            .catch(err => console.error('[PDPALog] Write failed:', err))

    } catch (error) {
        console.error('[PDPALog] Error:', error)
    }
}

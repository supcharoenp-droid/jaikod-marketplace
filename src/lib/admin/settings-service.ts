import { db } from '@/lib/firebase'
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    Timestamp
} from 'firebase/firestore'
import { logAdminAction } from '@/lib/adminLogger'
import { AdminUser } from '@/types/admin'

export interface SystemSettings {
    platform_fee_percent: number // e.g. 3.0
    listing_fee: number // e.g. 0 or 10 THB
    commission_rate_percent: number // e.g. 5.0
    maintenance_mode: boolean
    allow_new_registrations: boolean
    min_withdrawal_amount: number
    updated_at?: Date
    updated_by?: string
    admin_notifications_enabled: boolean
}

const SETTINGS_COL = 'system_settings'
const CONFIG_DOC = 'config'

const DEFAULT_SETTINGS: SystemSettings = {
    platform_fee_percent: 3.0,
    listing_fee: 0,
    commission_rate_percent: 5.0,
    maintenance_mode: false,
    allow_new_registrations: true,
    min_withdrawal_amount: 100,
    admin_notifications_enabled: false
}

// 1. GET /admin/settings
export async function getSystemSettings(): Promise<SystemSettings> {
    try {
        const ref = doc(db, SETTINGS_COL, CONFIG_DOC)
        const snap = await getDoc(ref)

        if (snap.exists()) {
            const data = snap.data()
            return {
                ...DEFAULT_SETTINGS, // Merge defaults in case of new keys
                ...data,
                updated_at: data.updated_at?.toDate()
            } as SystemSettings
        } else {
            // Initialize with defaults if not found
            await setDoc(ref, {
                ...DEFAULT_SETTINGS,
                created_at: Timestamp.now()
            })
            return DEFAULT_SETTINGS
        }
    } catch (e) {
        console.error('Error fetching settings:', e)
        return DEFAULT_SETTINGS
    }
}

// 2. POST /admin/settings/update
export async function updateSystemSettings(admin: AdminUser, newSettings: Partial<SystemSettings>) {
    try {
        const ref = doc(db, SETTINGS_COL, CONFIG_DOC)

        const updates = {
            ...newSettings,
            updated_at: Timestamp.now(),
            updated_by: admin.id
        }

        await setDoc(ref, updates, { merge: true })

        await logAdminAction(
            admin,
            'SETTINGS_UPDATE',
            'System Config',
            `Updated settings: ${Object.keys(newSettings).join(', ')}`
        )
        return true
    } catch (e) {
        throw e
    }
}

'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface SiteSettings {
    promotionsEnabled: boolean
    maintenanceMode: boolean
    flashSaleEnabled: boolean
    countdownEnabled: boolean
    floatingCTAEnabled: boolean
    showSellCTA: boolean
    showRegisterCTA: boolean
}

interface SiteSettingsContextType {
    settings: SiteSettings
    updateSetting: (key: keyof SiteSettings, value: boolean) => void
    isLoading: boolean
}

/**
 * 🚧 MAINTENANCE MODE CONTROL
 * 
 * - Development (localhost): เห็นเว็บเต็ม (พัฒนาได้ปกติ)
 * - Production (jaikod.com): ใช้ env var NEXT_PUBLIC_MAINTENANCE_MODE
 * 
 * Set in Vercel:
 * - NEXT_PUBLIC_MAINTENANCE_MODE=true → Coming Soon
 * - NEXT_PUBLIC_MAINTENANCE_MODE=false → เปิดเว็บปกติ
 */
const isProduction = process.env.NODE_ENV === 'production'
const envMaintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true'

// In development: always OFF (see full site)
// In production: controlled by env var (default: ON for safety)
const defaultMaintenanceMode = isProduction ? (envMaintenanceMode ?? true) : false

const defaultSettings: SiteSettings = {
    promotionsEnabled: false, // Default: ปิดโปรโมชั่น
    maintenanceMode: defaultMaintenanceMode,
    flashSaleEnabled: false,
    countdownEnabled: false,
    floatingCTAEnabled: true,
    showSellCTA: false, // Default: Hidden as requested
    showRegisterCTA: false, // Default: Hidden as requested
}

const SiteSettingsContext = createContext<SiteSettingsContextType>({
    settings: defaultSettings,
    updateSetting: () => { },
    isLoading: true,
})

export const useSiteSettings = () => useContext(SiteSettingsContext)

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
    const [isLoading, setIsLoading] = useState(true)

    // Load settings from localStorage on mount
    // ⚠️ maintenanceMode is ALWAYS controlled by defaultSettings (not localStorage)
    // This prevents hydration mismatch and allows production control via code
    useEffect(() => {
        const saved = localStorage.getItem('jaikod_site_settings_v2') // v2 to clear old cache
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                // Merge with defaults, but ALWAYS use default maintenanceMode
                setSettings({
                    ...defaultSettings,
                    ...parsed,
                    maintenanceMode: defaultSettings.maintenanceMode // 🔒 Always use default
                })
            } catch {
                // Use defaults
            }
        }
        setIsLoading(false)
    }, [])

    // Save to localStorage when settings change
    const updateSetting = (key: keyof SiteSettings, value: boolean) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: value }
            localStorage.setItem('jaikod_site_settings_v2', JSON.stringify(newSettings))
            return newSettings
        })
    }

    return (
        <SiteSettingsContext.Provider value={{ settings, updateSetting, isLoading }}>
            {children}
        </SiteSettingsContext.Provider>
    )
}

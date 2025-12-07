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

const defaultSettings: SiteSettings = {
    promotionsEnabled: false, // Default: ปิดโปรโมชั่น
    maintenanceMode: false,
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
    useEffect(() => {
        const saved = localStorage.getItem('jaikod_site_settings')
        if (saved) {
            try {
                setSettings(JSON.parse(saved))
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
            localStorage.setItem('jaikod_site_settings', JSON.stringify(newSettings))
            return newSettings
        })
    }

    return (
        <SiteSettingsContext.Provider value={{ settings, updateSetting, isLoading }}>
            {children}
        </SiteSettingsContext.Provider>
    )
}

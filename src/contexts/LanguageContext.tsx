'use client'

/**
 * LanguageContext - Global Language State Management
 * 
 * Provides language state across the entire application
 * 
 * Supports two translation patterns:
 * 1. t('translation.key') - Looks up from translations object
 * 2. t('ไทย', 'English') - Inline translation (legacy support)
 */

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { translations } from '@/i18n/locales'

type Language = 'th' | 'en'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (keyOrTh: string, en?: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

// Helper to get nested value from object using dot notation
function getNestedValue(obj: any, path: string): string | undefined {
    const keys = path.split('.')
    let current = obj

    for (const key of keys) {
        if (current && typeof current === 'object' && key in current) {
            current = current[key]
        } else {
            return undefined
        }
    }

    return typeof current === 'string' ? current : undefined
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguage] = useState<Language>('th')

    // Load from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('jaikod_language')
        if (saved === 'th' || saved === 'en') {
            setLanguage(saved)
        }
    }, [])

    // Save to localStorage when changed
    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang)
        localStorage.setItem('jaikod_language', lang)
    }

    /**
     * Translate helper function
     * 
     * Usage patterns:
     * 1. t('seller_dashboard.title') - Looks up from translations
     * 2. t('สวัสดี', 'Hello') - Inline translation (legacy)
     */
    const t = (keyOrTh: string, en?: string): string => {
        // Pattern 2: Inline translation (legacy) - when 2 args provided
        if (en !== undefined) {
            return language === 'th' ? keyOrTh : en
        }

        // Pattern 1: Key-based lookup
        const langData = translations[language]
        if (!langData) return keyOrTh

        const value = getNestedValue(langData, keyOrTh)
        return value !== undefined ? value : keyOrTh
    }

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    )
}

export function useLanguage() {
    const context = useContext(LanguageContext)
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider')
    }
    return context
}

'use client'

/**
 * LanguageContext - Global Language State Management
 * 
 * Provides language state across the entire application
 */

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'

type Language = 'th' | 'en'

interface LanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (th: string, en: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

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

    // Translate helper function
    const t = (th: string, en: string) => {
        return language === 'th' ? th : en
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

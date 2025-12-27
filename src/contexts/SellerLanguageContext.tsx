'use client'

import { createContext, useContext, ReactNode } from 'react'
import { useLanguage } from './LanguageContext'
import sellerTranslations from '@/i18n/seller-centre.json'

type Language = 'th' | 'en'
type TranslationKey = keyof typeof sellerTranslations

interface SellerLanguageContextType {
    language: Language
    setLanguage: (lang: Language) => void
    t: (section: TranslationKey, key: string) => string
    tNested: (section: TranslationKey, ...keys: string[]) => string
}

const SellerLanguageContext = createContext<SellerLanguageContextType | undefined>(undefined)

export function SellerLanguageProvider({ children }: { children: ReactNode }) {
    // ใช้ global LanguageContext แทนการจัดการ state แยก
    // เพื่อให้ภาษา sync กันทั้ง site
    const { language: globalLanguage, setLanguage: setGlobalLanguage } = useLanguage()

    // แปลง global language เป็น seller language type
    const language: Language = globalLanguage === 'th' ? 'th' : 'en'

    // Set language ผ่าน global context
    const setLanguage = (lang: Language) => {
        setGlobalLanguage(lang)
    }

    // Get translation for a specific key
    const t = (section: TranslationKey, key: string): string => {
        try {
            const sectionData = sellerTranslations[section]
            if (!sectionData) return key

            const langData = sectionData[language]
            if (!langData) return key

            // @ts-ignore
            return langData[key] || key
        } catch (error) {
            console.error('Translation error:', error)
            return key
        }
    }

    // Get nested translation (e.g., tNested('dashboard', 'stats', 'revenue'))
    const tNested = (section: TranslationKey, ...keys: string[]): string => {
        try {
            const sectionData = sellerTranslations[section]
            if (!sectionData) return keys.join('.')

            let current: any = sectionData[language]

            for (const key of keys) {
                if (current && typeof current === 'object' && key in current) {
                    current = current[key]
                } else {
                    return keys.join('.')
                }
            }

            return typeof current === 'string' ? current : keys.join('.')
        } catch (error) {
            console.error('Translation error:', error)
            return keys.join('.')
        }
    }

    return (
        <SellerLanguageContext.Provider value={{ language, setLanguage, t, tNested }}>
            {children}
        </SellerLanguageContext.Provider>
    )
}

export function useSellerLanguage() {
    const context = useContext(SellerLanguageContext)
    if (!context) {
        throw new Error('useSellerLanguage must be used within SellerLanguageProvider')
    }
    return context
}

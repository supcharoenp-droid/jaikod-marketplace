'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useAuth } from './AuthContext'
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
    const { user } = useAuth()
    const [language, setLanguageState] = useState<Language>('en')

    // Load language from user profile on mount
    useEffect(() => {
        if (user?.language) {
            const userLang = user.language.toLowerCase()
            if (userLang === 'th' || userLang === 'en') {
                setLanguageState(userLang)
            }
        } else {
            // Fallback to browser language or EN
            const browserLang = navigator.language.toLowerCase()
            if (browserLang.startsWith('th')) {
                setLanguageState('th')
            } else {
                setLanguageState('en')
            }
        }
    }, [user])

    // Set language and save to user profile
    const setLanguage = async (lang: Language) => {
        setLanguageState(lang)

        // Save to localStorage
        localStorage.setItem('seller-language', lang)

        // TODO: Save to user profile in Firestore
        if (user) {
            try {
                const { doc, updateDoc } = await import('firebase/firestore')
                const { db } = await import('@/lib/firebase')
                await updateDoc(doc(db, 'users', user.uid), {
                    language: lang.toUpperCase()
                })
            } catch (error) {
                console.error('Error saving language preference:', error)
            }
        }
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

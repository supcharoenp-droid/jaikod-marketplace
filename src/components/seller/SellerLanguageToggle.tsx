'use client'

import React from 'react'
import { useSellerLanguage } from '@/contexts/SellerLanguageContext'
import { Globe, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function SellerLanguageToggle() {
    const { language, setLanguage } = useSellerLanguage()
    const [isOpen, setIsOpen] = React.useState(false)

    const languages = [
        { code: 'th' as const, name: 'ไทย', flag: '🇹🇭' },
        { code: 'en' as const, name: 'English', flag: '🇬🇧' }
    ]

    const currentLanguage = languages.find(lang => lang.code === language)

    return (
        <div className="relative">
            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
                <Globe className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {currentLanguage?.flag} {currentLanguage?.name}
                </span>
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Menu */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                        >
                            {languages.map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => {
                                        setLanguage(lang.code)
                                        setIsOpen(false)
                                    }}
                                    className={`
                                        w-full flex items-center justify-between px-4 py-3 text-sm transition-colors
                                        ${language === lang.code
                                            ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                        }
                                    `}
                                >
                                    <span className="flex items-center gap-2">
                                        <span className="text-lg">{lang.flag}</span>
                                        <span className="font-medium">{lang.name}</span>
                                    </span>
                                    {language === lang.code && (
                                        <Check className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

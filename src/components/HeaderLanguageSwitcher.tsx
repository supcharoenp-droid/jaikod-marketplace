'use client'

/**
 * HeaderLanguageSwitcher - Global Language Toggle for Header/Navbar
 * 
 * Compact language switcher for top navigation
 */

import { Globe } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { motion } from 'framer-motion'

export default function HeaderLanguageSwitcher() {
    const { language, setLanguage } = useLanguage()

    return (
        <div className="flex items-center gap-2">
            {/* Globe Icon */}
            <Globe className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">ภาษา:</span>

            {/* Language Buttons */}
            <div className="relative flex bg-gray-800 rounded-lg p-0.5 border border-gray-700">
                {/* Animated Background */}
                <motion.div
                    className="absolute top-0.5 bottom-0.5 bg-purple-500 rounded-md"
                    animate={{
                        left: language === 'th' ? '2px' : 'calc(50% + 1px)',
                        width: 'calc(50% - 3px)'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />

                {/* Thai Button */}
                <button
                    onClick={() => setLanguage('th')}
                    className={`relative z-10 px-3 py-1.5 text-xs font-semibold rounded-md
                             transition-colors flex items-center gap-1.5 ${language === 'th'
                            ? 'text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <span className="text-base">🇹🇭</span>
                    <span>ไทย</span>
                    {language === 'th' && (
                        <span className="text-[10px] opacity-75">(TH)</span>
                    )}
                </button>

                {/* English Button */}
                <button
                    onClick={() => setLanguage('en')}
                    className={`relative z-10 px-3 py-1.5 text-xs font-semibold rounded-md
                             transition-colors flex items-center gap-1.5 ${language === 'en'
                            ? 'text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <span className="text-base">🇬🇧</span>
                    <span>English</span>
                    {language === 'en' && (
                        <span className="text-[10px] opacity-75">(EN)</span>
                    )}
                </button>
            </div>
        </div>
    )
}

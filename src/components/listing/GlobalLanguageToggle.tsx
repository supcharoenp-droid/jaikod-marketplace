'use client'

/**
 * GlobalLanguageToggle - Main Language Switcher
 * 
 * Prominent language toggle for the entire listing page
 */

import { Globe } from 'lucide-react'
import { motion } from 'framer-motion'

interface GlobalLanguageToggleProps {
    activeLanguage: 'TH' | 'EN'
    onChange: (lang: 'TH' | 'EN') => void
    className?: string
}

export default function GlobalLanguageToggle({
    activeLanguage,
    onChange,
    className = ''
}: GlobalLanguageToggleProps) {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Icon */}
            <div className="flex items-center gap-2 text-gray-400">
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">ภาษา:</span>
            </div>

            {/* Toggle Buttons */}
            <div className="relative flex bg-gray-800 rounded-lg p-1 border border-gray-700">
                {/* Animated Background */}
                <motion.div
                    className="absolute top-1 bottom-1 bg-purple-500 rounded-md"
                    animate={{
                        left: activeLanguage === 'TH' ? '4px' : 'calc(50% + 2px)',
                        width: 'calc(50% - 6px)'
                    }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />

                {/* Thai Button */}
                <button
                    onClick={() => onChange('TH')}
                    className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-md
                             transition-colors flex items-center gap-2 ${activeLanguage === 'TH'
                            ? 'text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <span className="text-lg">🇹🇭</span>
                    <span>ไทย</span>
                    {activeLanguage === 'TH' && (
                        <span className="text-xs opacity-75">(TH)</span>
                    )}
                </button>

                {/* English Button */}
                <button
                    onClick={() => onChange('EN')}
                    className={`relative z-10 px-6 py-2 text-sm font-semibold rounded-md
                             transition-colors flex items-center gap-2 ${activeLanguage === 'EN'
                            ? 'text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                >
                    <span className="text-lg">🇬🇧</span>
                    <span>English</span>
                    {activeLanguage === 'EN' && (
                        <span className="text-xs opacity-75">(EN)</span>
                    )}
                </button>
            </div>

            {/* Info Badge */}
            <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full border border-gray-700">
                แก้ไขได้ทั้ง 2 ภาษา
            </div>
        </div>
    )
}

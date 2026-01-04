'use client'

/**
 * Location Selector Component (Global Standard)
 * 
 * ให้ผู้ใช้เลือกตำแหน่งของตัวเอง
 * - ขอ GPS ใหม่
 * - เลือกจังหวัด
 * - แสดงตำแหน่งปัจจุบัน
 * 
 * Uses: Global Location & Distance Standard Engine
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, ChevronDown, Check, X, RefreshCw, Locate } from 'lucide-react'
import { useViewerLocation, getAllProvinces } from '@/hooks/useViewerLocation'
import { useLanguage } from '@/contexts/LanguageContext'

interface LocationSelectorProps {
    variant?: 'inline' | 'modal' | 'dropdown'
    showLabel?: boolean
    className?: string
    onLocationChange?: (province: string) => void
}

export default function LocationSelector({
    variant = 'inline',
    showLabel = true,
    className = '',
    onLocationChange
}: LocationSelectorProps) {
    const { language } = useLanguage()
    const {
        location,
        isLoading,
        hasLocation,
        setLocationByProvince,
        refreshGPS,
        isManual,
        isGPS
    } = useViewerLocation()

    const [isOpen, setIsOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [gpsError, setGpsError] = useState<string | null>(null)

    const provinces = getAllProvinces()
    const filteredProvinces = provinces.filter(p =>
        p.name_th.includes(searchQuery) ||
        p.name_en.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const handleSelectProvince = (provinceName: string) => {
        const success = setLocationByProvince(provinceName)
        if (success) {
            setIsOpen(false)
            setSearchQuery('')
            onLocationChange?.(provinceName)
        }
    }

    const handleRefreshGPS = async () => {
        setGpsError(null)
        await refreshGPS()
        // Check if GPS was successful after refresh
        if (!hasLocation) {
            setGpsError(language === 'th'
                ? 'ไม่สามารถหาตำแหน่งได้ กรุณาเลือกจังหวัดด้านล่าง'
                : 'Could not get location. Please select a province below.')
        }
    }

    // Current location display text
    const getLocationText = () => {
        if (isLoading) {
            return language === 'th' ? 'กำลังหา...' : 'Finding...'
        }
        if (!hasLocation) {
            return language === 'th' ? 'เลือกตำแหน่ง' : 'Set Location'
        }
        return location?.provinceName || (language === 'th' ? 'ไม่ทราบตำแหน่ง' : 'Unknown')
    }

    // Source indicator
    const sourceText = isGPS
        ? '(GPS)'
        : isManual
            ? (language === 'th' ? '(เลือกเอง)' : '(Manual)')
            : ''

    // INLINE VARIANT
    if (variant === 'inline') {
        return (
            <div className={`relative ${className}`}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`
                        flex items-center gap-2 px-3 py-2 rounded-xl 
                        bg-white dark:bg-slate-800 
                        border transition-colors shadow-sm
                        ${hasLocation
                            ? 'border-gray-200 dark:border-gray-700 hover:border-purple-400'
                            : 'border-purple-400 bg-purple-50 dark:bg-purple-900/20'}
                    `}
                >
                    <MapPin className={`w-4 h-4 ${hasLocation ? 'text-purple-500' : 'text-purple-600'}`} />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                        {isLoading ? (
                            <span className="flex items-center gap-1">
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                {getLocationText()}
                            </span>
                        ) : getLocationText()}
                    </span>
                    {sourceText && (
                        <span className="text-[10px] text-gray-400">{sourceText}</span>
                    )}
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-50 overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-sm font-bold text-gray-800 dark:text-white">
                                        {language === 'th' ? 'เลือกตำแหน่งของคุณ' : 'Set Your Location'}
                                    </h3>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                                    >
                                        <X className="w-4 h-4 text-gray-400" />
                                    </button>
                                </div>

                                {/* GPS Button */}
                                <button
                                    onClick={handleRefreshGPS}
                                    disabled={isLoading}
                                    className="w-full flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <RefreshCw className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Locate className="w-4 h-4" />
                                    )}
                                    {language === 'th' ? 'ใช้ตำแหน่ง GPS ของฉัน' : 'Use My GPS Location'}
                                </button>

                                {gpsError && (
                                    <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">{gpsError}</p>
                                )}
                            </div>

                            {/* Divider with "หรือเลือกจังหวัด" */}
                            <div className="px-3 py-2 bg-gray-50 dark:bg-slate-900 text-xs text-gray-500 dark:text-gray-400">
                                {language === 'th' ? '— หรือเลือกจังหวัด —' : '— Or select province —'}
                            </div>

                            {/* Search */}
                            <div className="p-3 border-b border-gray-100 dark:border-gray-700">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder={language === 'th' ? 'ค้นหาจังหวัด...' : 'Search province...'}
                                    className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                            </div>

                            {/* Province List */}
                            <div className="max-h-60 overflow-y-auto">
                                {filteredProvinces.map((province) => (
                                    <button
                                        key={province.id}
                                        onClick={() => handleSelectProvince(province.name_th)}
                                        className={`
                                            w-full flex items-center justify-between px-4 py-2.5 text-left text-sm
                                            hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors
                                            ${location?.provinceName === province.name_th
                                                ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600'
                                                : 'text-gray-700 dark:text-gray-200'}
                                        `}
                                    >
                                        <span>{province.name_th}</span>
                                        {location?.provinceName === province.name_th && (
                                            <Check className="w-4 h-4 text-purple-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        )
    }

    // Other variants can be added here
    return null
}

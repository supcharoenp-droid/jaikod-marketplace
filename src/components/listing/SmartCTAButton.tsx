'use client'

/**
 * Smart CTA Button Component (TikTok Shop Style)
 * 
 * ปุ่มที่เปลี่ยนตามบริบท - กระตุ้นแต่ไม่กดดัน
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    MessageCircle, Phone, Heart, ShoppingCart, Zap, Flame, Clock,
    Users, ArrowRight
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { SmartCTA, BuyerIntentLevel, generateSmartCTA } from '@/lib/ai-commerce'

interface SmartCTAButtonProps {
    intent?: BuyerIntentLevel
    priceRating?: 'excellent_deal' | 'good_deal' | 'fair_price' | 'above_average' | 'overpriced' | 'insufficient_data'
    sellerOnline?: boolean
    viewCount?: number
    hasRecentInquiries?: boolean
    onChat?: () => void
    onCall?: () => void
    onSave?: () => void
    isSaved?: boolean
}

export default function SmartCTAButton({
    intent = 'medium',
    priceRating,
    sellerOnline = false,
    viewCount = 0,
    hasRecentInquiries = false,
    onChat,
    onCall,
    onSave,
    isSaved = false
}: SmartCTAButtonProps) {
    const { language } = useLanguage()
    const [cta, setCTA] = useState<SmartCTA | null>(null)
    const [showUrgency, setShowUrgency] = useState(false)

    useEffect(() => {
        const result = generateSmartCTA(intent, {
            priceRating,
            sellerOnline,
            viewCount,
            hasRecentInquiries
        })
        setCTA(result)

        // Show urgency message with delay
        if (result.urgencyMessage?.show) {
            const timer = setTimeout(() => setShowUrgency(true), 2000)
            return () => clearTimeout(timer)
        }
    }, [intent, priceRating, sellerOnline, viewCount, hasRecentInquiries])

    if (!cta) return null

    const getIcon = (iconName: string) => {
        const icons: Record<string, React.ReactNode> = {
            'message-circle': <MessageCircle className="w-5 h-5" />,
            'phone': <Phone className="w-5 h-5" />,
            'heart': <Heart className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />,
            'shopping-cart': <ShoppingCart className="w-5 h-5" />,
            'zap': <Zap className="w-5 h-5" />,
            'flame': <Flame className="w-5 h-5" />
        }
        return icons[iconName] || <MessageCircle className="w-5 h-5" />
    }

    const getButtonStyle = (style: string) => {
        switch (style) {
            case 'urgent':
                return 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg shadow-orange-500/30'
            case 'highlight':
                return 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg shadow-purple-500/30'
            case 'gentle':
                return 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg shadow-emerald-500/30'
            default:
                return 'bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg shadow-blue-500/30'
        }
    }

    const handlePrimaryClick = () => {
        switch (cta.primary.action) {
            case 'chat':
                onChat?.()
                break
            case 'call':
                onCall?.()
                break
            case 'save':
                onSave?.()
                break
            default:
                onChat?.()
        }
    }

    return (
        <div className="space-y-3">
            {/* Urgency Message */}
            <AnimatePresence>
                {showUrgency && cta.urgencyMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center justify-center gap-2 py-2 px-4 bg-amber-100 dark:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800"
                    >
                        <Users className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
                        <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                            {language === 'th' ? cta.urgencyMessage.text_th : cta.urgencyMessage.text_en}
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main CTA Buttons */}
            <div className="flex gap-3">
                {/* Primary Button */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handlePrimaryClick}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl font-bold transition-all ${getButtonStyle(cta.primary.style)}`}
                >
                    {getIcon(cta.primary.icon)}
                    <span>{language === 'th' ? cta.primary.text_th : cta.primary.text_en}</span>
                    {(cta.primary.style === 'urgent' || cta.primary.style === 'highlight') && (
                        <ArrowRight className="w-4 h-4 ml-1" />
                    )}
                </motion.button>

                {/* Secondary Button (Save) */}
                {cta.secondary && (
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onSave}
                        className={`p-4 rounded-xl border-2 transition-all ${isSaved
                            ? 'bg-red-50 border-red-300 text-red-500 dark:bg-red-900/20 dark:border-red-700'
                            : 'bg-white border-gray-200 text-gray-600 hover:border-red-300 hover:text-red-500 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300'
                            }`}
                    >
                        <Heart className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
                    </motion.button>
                )}
            </div>

            {/* Online Status Indicator */}
            {sellerOnline && (
                <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 dark:text-emerald-400">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                    </span>
                    <span>
                        {language === 'th' ? 'ผู้ขายออนไลน์ • ตอบเร็ว' : 'Seller Online • Fast Response'}
                    </span>
                </div>
            )}
        </div>
    )
}

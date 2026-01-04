/**
 * PROMOTION BADGE COMPONENT
 * Professional implementation for JaiKod
 */

'use client'

import { useState } from 'react'
import { Info, Sparkles, Award, TrendingUp, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// ==========================================
// TYPES
// ==========================================

export type PromotionType = 'premium' | 'sponsored' | 'promoted' | 'popular' | 'organic_boost'

export interface PromotionBadgeProps {
    type: PromotionType
    size?: 'sm' | 'md' | 'lg'
    showInfo?: boolean
    className?: string
    onClick?: () => void
}

export interface PromotionConfig {
    label: string
    icon: React.ReactNode
    gradient: string
    textColor: string
    borderColor: string
    infoText: string
}

// ==========================================
// CONFIGURATION
// ==========================================

const PROMOTION_CONFIGS: Record<PromotionType, PromotionConfig> = {
    premium: {
        label: '💎 Premium Featured',
        icon: <Award className="w-3 h-3" />,
        gradient: 'from-yellow-400 via-orange-400 to-pink-500',
        textColor: 'text-yellow-900',
        borderColor: 'border-yellow-400/50',
        infoText: 'สินค้าพรีเมียมคุณภาพสูง ได้รับการคัดสรรโดยทีมงาน รับประกันความพึงพอใจ'
    },
    sponsored: {
        label: '🏷️ โฆษณา',
        icon: null,
        gradient: 'from-orange-400 to-red-400',
        textColor: 'text-orange-900',
        borderColor: 'border-orange-300',
        infoText: 'โปรโมทโดยผู้ขาย - เนื้อหาที่ได้รับการสนับสนุนเชิงพาณิชย์'
    },
    promoted: {
        label: '⭐ แนะนำจากผู้ขาย',
        icon: <Sparkles className="w-3 h-3" />,
        gradient: 'from-indigo-400 to-purple-500',
        textColor: 'text-indigo-900',
        borderColor: 'border-indigo-300',
        infoText: 'แนะนำโดยผู้ขาย - สินค้าที่ผู้ขายต้องการนำเสนอพิเศษ'
    },
    popular: {
        label: '🔥 ยอดนิยม',
        icon: <TrendingUp className="w-3 h-3" />,
        gradient: 'from-green-400 to-emerald-500',
        textColor: 'text-green-900',
        borderColor: 'border-green-300',
        infoText: 'สินค้ายอดนิยม - เป็นที่สนใจของผู้ใช้จำนวนมากในช่วงนี้'
    },
    organic_boost: {
        label: '⚡ แนะนำสำหรับคุณ',
        icon: <Zap className="w-3 h-3" />,
        gradient: 'from-blue-400 to-cyan-400',
        textColor: 'text-blue-900',
        borderColor: 'border-blue-300',
        infoText: 'แนะนำตามความสนใจของคุณ - อิงจากประวัติการเลือกดู'
    }
}

const SIZE_CLASSES = {
    sm: {
        padding: 'px-2 py-0.5',
        text: 'text-[10px]',
        iconSize: 'w-2.5 h-2.5'
    },
    md: {
        padding: 'px-3 py-1',
        text: 'text-xs',
        iconSize: 'w-3 h-3'
    },
    lg: {
        padding: 'px-4 py-1.5',
        text: 'text-sm',
        iconSize: 'w-4 h-4'
    }
}

// ==========================================
// COMPONENT
// ==========================================

export default function PromotionBadge({
    type = 'sponsored',
    size = 'md',
    showInfo = true,
    className = '',
    onClick
}: PromotionBadgeProps) {
    const [showInfoModal, setShowInfoModal] = useState(false)
    const config = PROMOTION_CONFIGS[type]
    const sizeClasses = SIZE_CLASSES[size]

    const handleInfoClick = (e: React.MouseEvent) => {
        e.stopPropagation()
        setShowInfoModal(true)
    }

    return (
        <>
            {/* Badge */}
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`
          inline-flex items-center gap-1.5
          bg-gradient-to-r ${config.gradient}
          ${config.textColor}
          ${sizeClasses.padding}
          ${sizeClasses.text}
          font-semibold
          rounded-lg
          border ${config.borderColor}
          backdrop-blur-sm
          shadow-sm
          ${onClick ? 'cursor-pointer hover:scale-105' : ''}
          transition-transform
          ${className}
        `}
                onClick={onClick}
            >
                {/* Icon */}
                {config.icon && (
                    <span className={sizeClasses.iconSize}>
                        {config.icon}
                    </span>
                )}

                {/* Label */}
                <span className="whitespace-nowrap">
                    {config.label}
                </span>

                {/* Info Button */}
                {showInfo && (
                    <button
                        onClick={handleInfoClick}
                        className="ml-0.5 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                        aria-label="ข้อมูลเพิ่มเติม"
                    >
                        <Info className={`${sizeClasses.iconSize} opacity-70`} />
                    </button>
                )}
            </motion.div>

            {/* Info Modal */}
            <AnimatePresence>
                {showInfoModal && (
                    <PromotionInfoModal
                        type={type}
                        config={config}
                        onClose={() => setShowInfoModal(false)}
                    />
                )}
            </AnimatePresence>
        </>
    )
}

// ==========================================
// INFO MODAL
// ==========================================

interface PromotionInfoModalProps {
    type: PromotionType
    config: PromotionConfig
    onClose: () => void
}

function PromotionInfoModal({ type, config, onClose }: PromotionInfoModalProps) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center`}>
                        {config.icon || <Info className="w-5 h-5 text-white" />}
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            {config.label.replace(/[🏷️💎⭐🔥⚡]/g, '').trim()}
                        </h3>
                        <p className="text-xs text-gray-500">ทำไมเห็นสินค้านี้?</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-4">
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                        {config.infoText}
                    </p>

                    {/* Additional Info Based on Type */}
                    {type === 'sponsored' && (
                        <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
                            <p className="text-xs text-orange-800 dark:text-orange-300">
                                <strong>💡 หมายเหตุ:</strong> เนื้อหานี้ได้รับค่าโฆษณาจากผู้ขาย
                                แต่เรายังคงแสดงเฉพาะสินค้าที่มีคุณภาพและเกี่ยวข้องกับความสนใจของคุณ
                            </p>
                        </div>
                    )}

                    {type === 'premium' && (
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                                ✅ สิทธิพิเศษ Premium:
                            </p>
                            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 ml-4">
                                <li>• รับประกันความพึงพอใจ 100%</li>
                                <li>• จัดส่งฟรีทั่วประเทศ</li>
                                <li>• บริการหลังการขายพิเศษ</li>
                                <li>• สินค้าผ่านการตรวจสอบคุณภาพ</li>
                            </ul>
                        </div>
                    )}

                    {/* User Controls */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            ⚙️ การควบคุม:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                🚫 ซ่อนโฆษณาแบบนี้
                            </button>
                            <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                                📊 ตั้งค่าโฆษณา
                            </button>
                        </div>
                    </div>

                    {/* Policy Link */}
                    <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                        <a
                            href="/promotion-policy"
                            className="text-xs text-purple-600 dark:text-purple-400 hover:underline"
                            onClick={(e) => e.stopPropagation()}
                        >
                            📖 อ่านนโยบายโฆษณาและโปรโมชัน →
                        </a>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    )
}

// ==========================================
// USAGE EXAMPLES
// ==========================================

/**
 * Example 1: Product Card
 * 
 * <ProductCard>
 *   <PromotionBadge 
 *     type="sponsored" 
 *     size="sm"
 *     className="absolute top-2 left-2"
 *   />
 *   <Image ... />
 *   <ProductInfo ... />
 * </ProductCard>
 */

/**
 * Example 2: List Item
 * 
 * <ListItem>
 *   <PromotionBadge 
 *     type="premium"
 *     size="md"
 *     showInfo={true}
 *   />
 *   <ItemDetails ... />
 * </ListItem>
 */

/**
 * Example 3: Banner
 * 
 * <Banner>
 *   <PromotionBadge 
 *     type="promoted"
 *     size="lg"
 *     onClick={() => trackClick()}
 *   />
 *   <BannerContent ... />
 * </Banner>
 */

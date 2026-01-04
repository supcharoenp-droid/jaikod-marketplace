'use client'

/**
 * AI Comparison Lock Component (Anti-Bounce)
 * 
 * แสดง Modal เมื่อผู้ใช้กำลังจะออกจากหน้า
 * เพื่อช่วยเปรียบเทียบกับสินค้าอื่น
 * 
 * กฎ: ไม่กดดัน ไม่ spam - แค่ช่วยตัดสินใจ
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Scale, Heart, Clock, Sparkles, ChevronRight } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'
import Link from 'next/link'

interface SimilarProduct {
    id: string
    title: string
    price: number
    thumbnail: string
    aiScore?: number
    url: string
}

interface AIComparisonLockProps {
    // Current product
    productId: string
    productTitle: string
    productPrice: number
    productThumbnail: string

    // Similar products for comparison
    similarProducts?: SimilarProduct[]

    // Buyer intent score (from useBuyerIntent hook)
    intentScore?: number

    // Callbacks
    onClose?: () => void
    onStay?: () => void
    onCompare?: () => void

    // Control
    enabled?: boolean
    triggerOnExit?: boolean // Trigger on mouse leaving viewport
}

export default function AIComparisonLock({
    productId,
    productTitle,
    productPrice,
    productThumbnail,
    similarProducts = [],
    intentScore = 0,
    onClose,
    onStay,
    onCompare,
    enabled = true,
    triggerOnExit = true
}: AIComparisonLockProps) {
    const { language } = useLanguage()
    const [isVisible, setIsVisible] = useState(false)
    const [hasShown, setHasShown] = useState(false)

    // Detect exit intent (mouse leaving viewport)
    useEffect(() => {
        if (!enabled || !triggerOnExit || hasShown) return

        const handleMouseLeave = (e: MouseEvent) => {
            // Only trigger when mouse leaves from top
            if (e.clientY <= 0 && intentScore >= 30) {
                setIsVisible(true)
                setHasShown(true)
            }
        }

        document.addEventListener('mouseleave', handleMouseLeave)
        return () => document.removeEventListener('mouseleave', handleMouseLeave)
    }, [enabled, triggerOnExit, hasShown, intentScore])

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isVisible) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [isVisible])

    const handleClose = useCallback(() => {
        setIsVisible(false)
        onClose?.()
    }, [onClose])

    const handleStay = useCallback(() => {
        setIsVisible(false)
        onStay?.()
    }, [onStay])

    const handleCompare = useCallback(() => {
        onCompare?.()
    }, [onCompare])

    // Don't show if no similar products
    if (similarProducts.length === 0) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4"
                >
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="relative w-full max-w-2xl bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl overflow-hidden"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 border-b border-white/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Scale className="w-5 h-5 text-purple-400" />
                                    <h3 className="font-bold text-white">
                                        {language === 'th'
                                            ? '🤔 ลองเปรียบเทียบก่อนไหม?'
                                            : '🤔 Want to compare first?'
                                        }
                                    </h3>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>
                            <p className="text-sm text-gray-400 mt-1">
                                {language === 'th'
                                    ? 'เราพบสินค้าที่คล้ายกันที่อาจเหมาะกับคุณ'
                                    : 'We found similar items that might interest you'
                                }
                            </p>
                        </div>

                        {/* Current Product */}
                        <div className="p-4 bg-purple-500/10 border-b border-white/10">
                            <p className="text-xs text-purple-400 mb-2">
                                {language === 'th' ? '📍 สินค้าที่คุณกำลังดู' : '📍 Currently viewing'}
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700">
                                    <Image
                                        src={productThumbnail}
                                        alt={productTitle}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-white truncate">{productTitle}</h4>
                                    <p className="text-lg font-bold text-purple-400">
                                        ฿{productPrice.toLocaleString()}
                                    </p>
                                </div>
                                <button
                                    onClick={handleStay}
                                    className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white text-sm font-medium rounded-lg transition-colors"
                                >
                                    {language === 'th' ? 'ดูต่อ' : 'Stay'}
                                </button>
                            </div>
                        </div>

                        {/* Similar Products */}
                        <div className="p-4">
                            <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {language === 'th' ? 'สินค้าที่คล้ายกัน' : 'Similar items'}
                            </p>
                            <div className="space-y-2">
                                {similarProducts.slice(0, 3).map((product) => (
                                    <Link
                                        key={product.id}
                                        href={product.url}
                                        onClick={handleClose}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                                    >
                                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-700">
                                            <Image
                                                src={product.thumbnail}
                                                alt={product.title}
                                                width={48}
                                                height={48}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h5 className="text-sm text-white truncate group-hover:text-purple-400 transition-colors">
                                                {product.title}
                                            </h5>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-emerald-400">
                                                    ฿{product.price.toLocaleString()}
                                                </span>
                                                {product.price < productPrice && (
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded">
                                                        {language === 'th' ? 'ถูกกว่า' : 'Cheaper'}
                                                    </span>
                                                )}
                                                {product.aiScore && product.aiScore >= 80 && (
                                                    <span className="text-[10px] px-1.5 py-0.5 bg-purple-500/20 text-purple-400 rounded">
                                                        AI {product.aiScore}%
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-500 group-hover:text-purple-400 transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="px-4 pb-4 flex gap-3">
                            <button
                                onClick={handleStay}
                                className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <Heart className="w-4 h-4" />
                                {language === 'th' ? 'บันทึกและดูต่อ' : 'Save & Stay'}
                            </button>
                            <button
                                onClick={handleCompare}
                                className="flex-1 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                            >
                                <Scale className="w-4 h-4" />
                                {language === 'th' ? 'เปรียบเทียบทั้งหมด' : 'Compare All'}
                            </button>
                        </div>

                        {/* Transparency Note */}
                        <div className="px-4 py-2 bg-slate-900/50 border-t border-white/5">
                            <p className="text-[10px] text-gray-500 text-center flex items-center justify-center gap-1">
                                <Clock className="w-3 h-3" />
                                {language === 'th'
                                    ? 'แนะนำจาก AI ตามความสนใจของคุณ • ไม่มีค่าใช้จ่าย'
                                    : 'AI suggestions based on your interest • Free service'
                                }
                            </p>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// Export a simpler version that can be triggered programmatically
export function useComparisonLock() {
    const [isVisible, setIsVisible] = useState(false)

    const show = useCallback(() => setIsVisible(true), [])
    const hide = useCallback(() => setIsVisible(false), [])

    return {
        isVisible,
        show,
        hide
    }
}

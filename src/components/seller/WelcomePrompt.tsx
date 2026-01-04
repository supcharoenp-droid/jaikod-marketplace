'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Store, X, Sparkles, CheckCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface WelcomePromptProps {
    isOpen: boolean
    onClose: () => void
    onComplete: (shopName: string) => Promise<void>
}

export default function WelcomePrompt({ isOpen, onClose, onComplete }: WelcomePromptProps) {
    const { user } = useAuth()
    const { t, language } = useLanguage()
    const [shopName, setShopName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async () => {
        // Validation
        if (!shopName || shopName.trim().length < 2) {
            setError(language === 'th' ? 'กรุณากรอกชื่อร้านอย่างน้อย 2 ตัวอักษร' : 'Please enter at least 2 characters')
            return
        }

        if (shopName.trim().length > 50) {
            setError(language === 'th' ? 'ชื่อร้านต้องไม่เกิน 50 ตัวอักษร' : 'Shop name must not exceed 50 characters')
            return
        }

        try {
            setIsSubmitting(true)
            setError('')
            await onComplete(shopName.trim())
            onClose()
        } catch (err: any) {
            setError(err.message || (language === 'th' ? 'เกิดข้อผิดพลาด กรุณาลองใหม่' : 'An error occurred. Please try again'))
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleSkip = () => {
        onClose()
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={handleSkip}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="relative bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-500 p-8 text-center">
                                <button
                                    onClick={handleSkip}
                                    className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-white" />
                                </button>

                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: 'spring' }}
                                    className="w-20 h-20 bg-white/20 backdrop-blur rounded-full flex items-center justify-center mx-auto mb-4"
                                >
                                    <Store className="w-10 h-10 text-white" />
                                </motion.div>

                                <h2 className="text-2xl font-bold text-white mb-2">
                                    {language === 'th' ? 'ยินดีต้อนรับสู่ศูนย์ผู้ขาย!' : 'Welcome to Seller Centre!'}
                                </h2>
                                <p className="text-white/90 text-sm">
                                    {language === 'th'
                                        ? 'เริ่มต้นสร้างรายได้ออนไลน์กับ JaiKod'
                                        : 'Start earning online with JaiKod'}
                                </p>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                <div className="mb-6">
                                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                        {language === 'th'
                                            ? 'ตั้งชื่อร้านของคุณเพื่อให้ลูกค้าจดจำได้ง่าย 🎯'
                                            : 'Set up your shop name to make it memorable for customers 🎯'}
                                    </p>

                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {language === 'th' ? 'ชื่อร้านของคุณ' : 'Your Shop Name'}
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>

                                    <input
                                        type="text"
                                        value={shopName}
                                        onChange={(e) => {
                                            setShopName(e.target.value)
                                            setError('')
                                        }}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                                        placeholder={language === 'th' ? 'เช่น: ร้านมือถือมือสอง' : 'e.g., Phone Shop'}
                                        className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-purple-500 focus:outline-none dark:bg-gray-800 dark:text-white transition-colors"
                                        disabled={isSubmitting}
                                        autoFocus
                                    />

                                    {error && (
                                        <motion.p
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-sm text-red-500 mt-2 flex items-center gap-1"
                                        >
                                            <span>⚠️</span> {error}
                                        </motion.p>
                                    )}

                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                        {language === 'th'
                                            ? `${shopName.length}/50 ตัวอักษร • สามารถเปลี่ยนได้ทีหลัง`
                                            : `${shopName.length}/50 characters • Can be changed later`}
                                    </p>
                                </div>

                                {/* Benefits */}
                                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 mb-6">
                                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-300 mb-2 flex items-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        {language === 'th' ? 'ประโยชน์ของการตั้งชื่อร้าน:' : 'Benefits of setting up your shop:'}
                                    </p>
                                    <ul className="space-y-1 text-xs text-purple-800 dark:text-purple-200">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
                                            <span>{language === 'th' ? 'ลูกค้าจดจำร้านคุณได้ง่ายขึ้น' : 'Easier for customers to remember'}</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
                                            <span>{language === 'th' ? 'สร้างความน่าเชื่อถือและความเป็นมืออาชีพ' : 'Build trust and professionalism'}</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-500" />
                                            <span>{language === 'th' ? 'ปรับแต่งได้ในภายหลัง' : 'Can be customized later'}</span>
                                        </li>
                                    </ul>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleSkip}
                                        className="flex-1 px-4 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                        disabled={isSubmitting}
                                    >
                                        {language === 'th' ? 'ข้ามไปก่อน' : 'Skip for now'}
                                    </button>
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isSubmitting || !shopName.trim()}
                                        className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-medium hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-purple-500/25"
                                    >
                                        {isSubmitting ? (
                                            <span className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                {language === 'th' ? 'กำลังบันทึก...' : 'Saving...'}
                                            </span>
                                        ) : (
                                            language === 'th' ? 'เริ่มต้นเลย! 🚀' : 'Get Started! 🚀'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}

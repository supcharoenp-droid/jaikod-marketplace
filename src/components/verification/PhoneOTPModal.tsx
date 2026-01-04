'use client'

/**
 * ============================================
 * Phone OTP Modal (Placeholder)
 * ============================================
 * 
 * This component is disabled by feature flag.
 * Enable by setting FEATURE_FLAGS.PHONE_VERIFICATION_ENABLED = true
 */

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, Lock, AlertCircle } from 'lucide-react'
import { FEATURE_FLAGS } from '@/config/platform'
import { useLanguage } from '@/contexts/LanguageContext'

interface PhoneOTPModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: (phone: string) => void
}

const translations = {
    th: {
        title: 'ยืนยันเบอร์โทรศัพท์',
        comingSoon: 'เร็วๆ นี้',
        description: 'ระบบยืนยันเบอร์โทรศัพท์กำลังพัฒนา จะเปิดให้บริการเร็วๆ นี้',
        close: 'ปิด',
        features: [
            'ยืนยันตัวตนด้วย SMS OTP',
            'เพิ่มความน่าเชื่อถือ +15%',
            'รับแจ้งเตือนทาง SMS',
        ]
    },
    en: {
        title: 'Phone Verification',
        comingSoon: 'Coming Soon',
        description: 'Phone verification system is under development and will be available soon.',
        close: 'Close',
        features: [
            'Verify identity with SMS OTP',
            '+15% trust score boost',
            'Receive SMS notifications',
        ]
    }
}

export default function PhoneOTPModal({ isOpen, onClose, onSuccess }: PhoneOTPModalProps) {
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th

    // If feature is disabled, show coming soon message
    if (!FEATURE_FLAGS.PHONE_VERIFICATION_ENABLED) {
        if (!isOpen) return null

        return (
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.95, opacity: 0 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-md w-full overflow-hidden"
                    >
                        {/* Header */}
                        <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 text-center">
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <Phone className="w-8 h-8 text-white" />
                            </div>

                            <h2 className="text-xl font-bold text-white">{t.title}</h2>
                            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-full">
                                <Lock className="w-3 h-3" />
                                {t.comingSoon}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-4">
                            <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl">
                                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                <p className="text-sm text-amber-700 dark:text-amber-300">
                                    {t.description}
                                </p>
                            </div>

                            <div className="space-y-2">
                                {t.features.map((feature, i) => (
                                    <div key={i} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                                        <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {t.close}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>
        )
    }

    // Feature enabled - use full implementation
    // Import and use PhoneVerificationModal from the actual implementation
    const PhoneVerificationModalFull = require('./PhoneVerificationModal').default
    return <PhoneVerificationModalFull isOpen={isOpen} onClose={onClose} onSuccess={onSuccess} />
}

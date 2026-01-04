'use client'

/**
 * ============================================
 * Phone Verification Modal
 * ============================================
 * 
 * Beautiful modal for phone OTP verification
 * - Enter phone number
 * - Receive OTP
 * - Verify code
 * - Success animation
 */

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Phone,
    X,
    ArrowRight,
    Check,
    AlertCircle,
    RefreshCw,
    Shield,
    Sparkles,
    MessageCircle
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { phoneVerificationService } from '@/services/phoneVerificationService'

// ============================================
// TYPES
// ============================================

interface PhoneVerificationModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

type Step = 'phone' | 'otp' | 'success'

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
    th: {
        title: 'ยืนยันเบอร์โทรศัพท์',
        subtitle: 'เพิ่มความน่าเชื่อถือให้บัญชีของคุณ',
        phoneLabel: 'เบอร์โทรศัพท์มือถือ',
        phonePlaceholder: '08X-XXX-XXXX',
        sendOtp: 'ส่งรหัส OTP',
        otpLabel: 'รหัส OTP 6 หลัก',
        otpSent: 'ส่งรหัสไปยัง',
        verify: 'ยืนยัน',
        resend: 'ส่งรหัสใหม่',
        resendIn: 'ส่งรหัสใหม่ได้ใน',
        seconds: 'วินาที',
        success: 'ยืนยันสำเร็จ!',
        successDesc: 'เบอร์โทรศัพท์ของคุณได้รับการยืนยันแล้ว',
        benefits: [
            'เพิ่มความน่าเชื่อถือ 20%',
            'ผู้ซื้อติดต่อได้ง่ายขึ้น',
            'รับแจ้งเตือนทาง SMS',
        ],
        close: 'ปิด',
        done: 'เสร็จสิ้น',
        changeNumber: 'เปลี่ยนเบอร์',
        error: 'เกิดข้อผิดพลาด',
    },
    en: {
        title: 'Verify Phone Number',
        subtitle: 'Increase trust for your account',
        phoneLabel: 'Mobile Phone Number',
        phonePlaceholder: '08X-XXX-XXXX',
        sendOtp: 'Send OTP',
        otpLabel: '6-digit OTP Code',
        otpSent: 'Code sent to',
        verify: 'Verify',
        resend: 'Resend Code',
        resendIn: 'Resend in',
        seconds: 'seconds',
        success: 'Verified!',
        successDesc: 'Your phone number has been verified',
        benefits: [
            '+20% trust score',
            'Easier for buyers to contact',
            'Receive SMS notifications',
        ],
        close: 'Close',
        done: 'Done',
        changeNumber: 'Change Number',
        error: 'Error occurred',
    }
}

// ============================================
// OTP INPUT COMPONENT
// ============================================

function OtpInput({
    value,
    onChange,
    disabled
}: {
    value: string
    onChange: (val: string) => void
    disabled?: boolean
}) {
    const inputRefs = useRef<(HTMLInputElement | null)[]>([])

    const handleChange = (index: number, digit: string) => {
        if (!/^\d*$/.test(digit)) return

        const newValue = value.split('')
        newValue[index] = digit
        onChange(newValue.join(''))

        // Auto focus next input
        if (digit && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus()
        }
    }

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        onChange(pastedData)
    }

    return (
        <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {[0, 1, 2, 3, 4, 5].map((index) => (
                <input
                    key={index}
                    ref={(el) => { inputRefs.current[index] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value[index] || ''}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    disabled={disabled}
                    className="w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none transition-all disabled:opacity-50"
                />
            ))}
        </div>
    )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function PhoneVerificationModal({
    isOpen,
    onClose,
    onSuccess
}: PhoneVerificationModalProps) {
    const { user } = useAuth()
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th

    const [step, setStep] = useState<Step>('phone')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [otpCode, setOtpCode] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [countdown, setCountdown] = useState(0)

    const recaptchaRef = useRef<HTMLDivElement>(null)

    // Initialize reCAPTCHA
    useEffect(() => {
        if (isOpen && recaptchaRef.current) {
            phoneVerificationService.initRecaptcha('recaptcha-container')
        }

        return () => {
            phoneVerificationService.cleanup()
        }
    }, [isOpen])

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    // Format phone number as user types
    const handlePhoneChange = (value: string) => {
        // Remove non-digits
        const digits = value.replace(/\D/g, '')

        // Format: 0XX-XXX-XXXX
        let formatted = digits
        if (digits.length > 3) {
            formatted = digits.slice(0, 3) + '-' + digits.slice(3)
        }
        if (digits.length > 6) {
            formatted = digits.slice(0, 3) + '-' + digits.slice(3, 6) + '-' + digits.slice(6, 10)
        }

        setPhoneNumber(formatted)
        setError('')
    }

    // Send OTP
    const handleSendOtp = async () => {
        if (!phoneNumber || phoneNumber.replace(/\D/g, '').length !== 10) {
            setError('กรุณาใส่เบอร์โทรศัพท์ 10 หลัก')
            return
        }

        setLoading(true)
        setError('')

        const result = await phoneVerificationService.sendOTP(phoneNumber)

        setLoading(false)

        if (result.success) {
            setStep('otp')
            setCountdown(60)
        } else {
            setError(result.message)
        }
    }

    // Verify OTP
    const handleVerifyOtp = async () => {
        if (otpCode.length !== 6) {
            setError('กรุณาใส่รหัส OTP 6 หลัก')
            return
        }

        setLoading(true)
        setError('')

        // Use linkPhoneToAccount for existing users
        const result = user
            ? await phoneVerificationService.linkPhoneToAccount(otpCode, phoneNumber)
            : await phoneVerificationService.verifyOTP(otpCode, phoneNumber)

        setLoading(false)

        if (result.success) {
            setStep('success')
            onSuccess?.()
        } else {
            setError(result.message)
        }
    }

    // Resend OTP
    const handleResend = async () => {
        if (countdown > 0) return

        setLoading(true)
        const result = await phoneVerificationService.sendOTP(phoneNumber)
        setLoading(false)

        if (result.success) {
            setCountdown(60)
            setOtpCode('')
            setError('')
        } else {
            setError(result.message)
        }
    }

    // Close and reset
    const handleClose = () => {
        setStep('phone')
        setPhoneNumber('')
        setOtpCode('')
        setError('')
        setCountdown(0)
        onClose()
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
                onClick={handleClose}
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
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            {step === 'success' ? (
                                <Check className="w-8 h-8 text-white" />
                            ) : (
                                <Phone className="w-8 h-8 text-white" />
                            )}
                        </div>

                        <h2 className="text-xl font-bold text-white">
                            {step === 'success' ? t.success : t.title}
                        </h2>
                        <p className="text-white/70 text-sm mt-1">
                            {step === 'success' ? t.successDesc : t.subtitle}
                        </p>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Phone Number */}
                            {step === 'phone' && (
                                <motion.div
                                    key="phone"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Benefits */}
                                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Sparkles className="w-4 h-4 text-purple-600" />
                                            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">
                                                สิทธิประโยชน์
                                            </span>
                                        </div>
                                        <ul className="space-y-1">
                                            {t.benefits.map((benefit, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400">
                                                    <Check className="w-3 h-3" />
                                                    {benefit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Phone Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {t.phoneLabel}
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="tel"
                                                value={phoneNumber}
                                                onChange={(e) => handlePhoneChange(e.target.value)}
                                                placeholder={t.phonePlaceholder}
                                                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none text-lg font-medium"
                                                maxLength={12}
                                            />
                                        </div>
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <button
                                        onClick={handleSendOtp}
                                        disabled={loading || phoneNumber.replace(/\D/g, '').length !== 10}
                                        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {loading ? (
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                {t.sendOtp}
                                                <ArrowRight className="w-5 h-5" />
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 2: OTP Input */}
                            {step === 'otp' && (
                                <motion.div
                                    key="otp"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* OTP Sent Info */}
                                    <div className="text-center">
                                        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300">
                                            <MessageCircle className="w-4 h-4" />
                                            <span className="text-sm">{t.otpSent}</span>
                                        </div>
                                        <p className="text-lg font-bold text-gray-900 dark:text-white mt-1">
                                            {phoneNumber}
                                        </p>
                                        <button
                                            onClick={() => setStep('phone')}
                                            className="text-sm text-purple-600 hover:underline mt-1"
                                        >
                                            {t.changeNumber}
                                        </button>
                                    </div>

                                    {/* OTP Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                                            {t.otpLabel}
                                        </label>
                                        <OtpInput
                                            value={otpCode}
                                            onChange={setOtpCode}
                                            disabled={loading}
                                        />
                                    </div>

                                    {/* Resend */}
                                    <div className="text-center">
                                        {countdown > 0 ? (
                                            <p className="text-sm text-gray-500">
                                                {t.resendIn} {countdown} {t.seconds}
                                            </p>
                                        ) : (
                                            <button
                                                onClick={handleResend}
                                                disabled={loading}
                                                className="text-sm text-purple-600 hover:underline flex items-center gap-1 mx-auto"
                                            >
                                                <RefreshCw className="w-3 h-3" />
                                                {t.resend}
                                            </button>
                                        )}
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center gap-2 px-4 py-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 text-sm">
                                            <AlertCircle className="w-4 h-4 shrink-0" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Verify Button */}
                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={loading || otpCode.length !== 6}
                                        className="w-full py-3.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        {loading ? (
                                            <RefreshCw className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Shield className="w-5 h-5" />
                                                {t.verify}
                                            </>
                                        )}
                                    </button>
                                </motion.div>
                            )}

                            {/* Step 3: Success */}
                            {step === 'success' && (
                                <motion.div
                                    key="success"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center space-y-6"
                                >
                                    {/* Success Animation */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', delay: 0.2 }}
                                        className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: 'spring', delay: 0.4 }}
                                        >
                                            <Check className="w-12 h-12 text-green-600" />
                                        </motion.div>
                                    </motion.div>

                                    <div>
                                        <p className="text-gray-600 dark:text-gray-300">
                                            {phoneNumber}
                                        </p>
                                    </div>

                                    <button
                                        onClick={handleClose}
                                        className="w-full py-3.5 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:shadow-lg transition-all"
                                    >
                                        {t.done}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* reCAPTCHA Container (invisible) */}
                    <div id="recaptcha-container" ref={recaptchaRef} />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Phone, CheckCircle, AlertCircle, Loader2, Shield, Sparkles } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

// ==========================================
// TYPES
// ==========================================

interface PhoneOTPModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: (phoneNumber: string) => void
    initialPhone?: string
}

type Step = 'phone' | 'otp' | 'success'

// ==========================================
// DEMO MODE CONFIG
// ==========================================

const DEMO_MODE = true // Set to false when connecting to real SMS service
const DEMO_OTP = '123456'

// ==========================================
// COMPONENT
// ==========================================

export default function PhoneOTPModal({
    isOpen,
    onClose,
    onSuccess,
    initialPhone = ''
}: PhoneOTPModalProps) {
    const { language } = useLanguage()

    // State
    const [step, setStep] = useState<Step>('phone')
    const [phone, setPhone] = useState(initialPhone)
    const [otp, setOtp] = useState(['', '', '', '', '', ''])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [countdown, setCountdown] = useState(0)
    const [trustScoreGain, setTrustScoreGain] = useState(15)

    // Refs for OTP input
    const otpRefs = useRef<(HTMLInputElement | null)[]>([])

    // Copy
    const t = {
        th: {
            title: 'ยืนยันเบอร์โทรศัพท์',
            subtitle: 'เพื่อความปลอดภัยและความน่าเชื่อถือ',
            phoneLabel: 'เบอร์โทรศัพท์',
            phonePlaceholder: '0XX-XXX-XXXX',
            sendOtp: 'ส่งรหัส OTP',
            otpSent: 'ส่งรหัส OTP ไปที่',
            enterOtp: 'กรอกรหัส OTP 6 หลัก',
            verify: 'ยืนยัน',
            resend: 'ส่งอีกครั้ง',
            resendIn: 'ส่งอีกครั้งใน',
            seconds: 'วินาที',
            success: 'ยืนยันเบอร์โทรสำเร็จ!',
            trustGain: 'Trust Score เพิ่มขึ้น',
            continue: 'ดำเนินการต่อ',
            invalidPhone: 'กรุณากรอกเบอร์โทร 10 หลัก',
            invalidOtp: 'รหัส OTP ไม่ถูกต้อง',
            demoNote: '🧪 Demo Mode: กรอก 123456',
            benefits: [
                '✓ แชทกับผู้ซื้อ/ผู้ขายได้',
                '✓ ได้รับการแจ้งเตือน SMS',
                '✓ เพิ่มความน่าเชื่อถือ'
            ]
        },
        en: {
            title: 'Verify Phone Number',
            subtitle: 'For security and trust',
            phoneLabel: 'Phone Number',
            phonePlaceholder: '0XX-XXX-XXXX',
            sendOtp: 'Send OTP',
            otpSent: 'OTP sent to',
            enterOtp: 'Enter 6-digit OTP',
            verify: 'Verify',
            resend: 'Resend',
            resendIn: 'Resend in',
            seconds: 'seconds',
            success: 'Phone Verified Successfully!',
            trustGain: 'Trust Score increased by',
            continue: 'Continue',
            invalidPhone: 'Please enter a valid 10-digit phone number',
            invalidOtp: 'Invalid OTP code',
            demoNote: '🧪 Demo Mode: Enter 123456',
            benefits: [
                '✓ Chat with buyers/sellers',
                '✓ Receive SMS notifications',
                '✓ Increase your trust score'
            ]
        }
    }

    const copy = t[language as 'th' | 'en'] || t.th

    // Countdown timer
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [countdown])

    // Format phone display
    const formatPhone = (value: string) => {
        const digits = value.replace(/\D/g, '')
        if (digits.length <= 3) return digits
        if (digits.length <= 6) return `${digits.slice(0, 3)}-${digits.slice(3)}`
        return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6, 10)}`
    }

    // Handle phone input
    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10)
        setPhone(value)
        setError('')
    }

    // Send OTP
    const handleSendOTP = async () => {
        if (phone.length !== 10) {
            setError(copy.invalidPhone)
            return
        }

        setLoading(true)
        setError('')

        try {
            if (DEMO_MODE) {
                // Demo: Simulate sending OTP
                await new Promise(resolve => setTimeout(resolve, 1000))
                console.log('📱 [DEMO] OTP sent to:', phone)
            } else {
                // TODO: Connect to Firebase SMS / Twilio / other SMS provider
                // await sendOTP(phone)
            }

            setStep('otp')
            setCountdown(120) // 2 minutes
        } catch (err) {
            setError('เกิดข้อผิดพลาด กรุณาลองใหม่')
        } finally {
            setLoading(false)
        }
    }

    // Handle OTP input
    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value.slice(-1)
        setOtp(newOtp)
        setError('')

        // Auto-focus next input
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus()
        }
    }

    // Handle OTP keydown (for backspace)
    const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus()
        }
    }

    // Handle OTP paste
    const handleOtpPaste = (e: React.ClipboardEvent) => {
        e.preventDefault()
        const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
        if (text.length === 6) {
            setOtp(text.split(''))
        }
    }

    // Verify OTP
    const handleVerifyOTP = async () => {
        const enteredOtp = otp.join('')

        if (enteredOtp.length !== 6) {
            setError(copy.invalidOtp)
            return
        }

        setLoading(true)
        setError('')

        try {
            if (DEMO_MODE) {
                // Demo: Check against demo OTP
                await new Promise(resolve => setTimeout(resolve, 1000))

                if (enteredOtp !== DEMO_OTP) {
                    setError(copy.invalidOtp)
                    setLoading(false)
                    return
                }
            } else {
                // TODO: Verify OTP with Firebase / backend
                // await verifyOTP(phone, enteredOtp)
            }

            setStep('success')

            // Call success callback after animation
            setTimeout(() => {
                onSuccess(phone)
            }, 2000)

        } catch (err) {
            setError(copy.invalidOtp)
        } finally {
            setLoading(false)
        }
    }

    // Resend OTP
    const handleResend = () => {
        if (countdown > 0) return
        setOtp(['', '', '', '', '', ''])
        handleSendOTP()
    }

    // Reset state on close
    const handleClose = () => {
        setStep('phone')
        setPhone(initialPhone)
        setOtp(['', '', '', '', '', ''])
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
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <Phone className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{copy.title}</h2>
                                <p className="text-white/80 text-sm">{copy.subtitle}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {/* Step 1: Phone Input */}
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
                                            <Shield className="w-5 h-5 text-purple-500" />
                                            <span className="font-medium text-purple-700 dark:text-purple-300">
                                                {language === 'th' ? 'สิทธิประโยชน์' : 'Benefits'}
                                            </span>
                                        </div>
                                        <ul className="space-y-1 text-sm text-purple-600 dark:text-purple-400">
                                            {copy.benefits.map((b, i) => (
                                                <li key={i}>{b}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Phone Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            {copy.phoneLabel}
                                        </label>
                                        <div className="flex gap-3">
                                            <div className="flex items-center px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl text-sm font-medium">
                                                🇹🇭 +66
                                            </div>
                                            <input
                                                type="tel"
                                                value={formatPhone(phone)}
                                                onChange={handlePhoneChange}
                                                placeholder={copy.phonePlaceholder}
                                                className="flex-1 px-4 py-3 bg-gray-100 dark:bg-slate-700 rounded-xl text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                autoFocus
                                            />
                                        </div>
                                    </div>

                                    {/* Demo Note */}
                                    {DEMO_MODE && (
                                        <div className="text-center text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                                            {copy.demoNote}
                                        </div>
                                    )}

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Send Button */}
                                    <button
                                        onClick={handleSendOTP}
                                        disabled={loading || phone.length !== 10}
                                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <Phone className="w-5 h-5" />
                                                {copy.sendOtp}
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
                                    {/* Sent to */}
                                    <div className="text-center">
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {copy.otpSent}
                                        </p>
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                                            +66 {formatPhone(phone)}
                                        </p>
                                    </div>

                                    {/* OTP Input */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 text-center">
                                            {copy.enterOtp}
                                        </label>
                                        <div className="flex justify-center gap-2">
                                            {otp.map((digit, index) => (
                                                <input
                                                    key={index}
                                                    ref={el => { otpRefs.current[index] = el }}
                                                    type="text"
                                                    inputMode="numeric"
                                                    maxLength={1}
                                                    value={digit}
                                                    onChange={e => handleOtpChange(index, e.target.value)}
                                                    onKeyDown={e => handleOtpKeyDown(index, e)}
                                                    onPaste={handleOtpPaste}
                                                    className="w-12 h-14 text-center text-2xl font-bold bg-gray-100 dark:bg-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Countdown */}
                                    <div className="text-center text-sm text-gray-500">
                                        {countdown > 0 ? (
                                            <span>
                                                {copy.resendIn} {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')} {copy.seconds}
                                            </span>
                                        ) : (
                                            <button
                                                onClick={handleResend}
                                                className="text-purple-500 hover:text-purple-600 font-medium"
                                            >
                                                {copy.resend}
                                            </button>
                                        )}
                                    </div>

                                    {/* Demo Note */}
                                    {DEMO_MODE && (
                                        <div className="text-center text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                                            {copy.demoNote}
                                        </div>
                                    )}

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center justify-center gap-2 text-red-500 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Verify Button */}
                                    <button
                                        onClick={handleVerifyOTP}
                                        disabled={loading || otp.join('').length !== 6}
                                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <>
                                                <CheckCircle className="w-5 h-5" />
                                                {copy.verify}
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
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    className="text-center py-8"
                                >
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{ type: 'spring', delay: 0.2 }}
                                        className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center"
                                    >
                                        <CheckCircle className="w-10 h-10 text-white" />
                                    </motion.div>

                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {copy.success}
                                    </h3>

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 mb-6"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        <span className="font-medium">
                                            {copy.trustGain} +{trustScoreGain}
                                        </span>
                                    </motion.div>

                                    <button
                                        onClick={handleClose}
                                        className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity"
                                    >
                                        {copy.continue}
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

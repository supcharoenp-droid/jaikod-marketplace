'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X, CreditCard, Camera, Upload, CheckCircle, AlertCircle,
    Loader2, Shield, Sparkles, Eye, EyeOff, User, FileText,
    ScanLine, Zap
} from 'lucide-react'
import Image from 'next/image'
import { useLanguage } from '@/contexts/LanguageContext'

// ==========================================
// TYPES
// ==========================================

interface IDVerificationModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
}

type Step = 'info' | 'front' | 'back' | 'selfie' | 'processing' | 'success'

interface UploadedImage {
    file: File | null
    preview: string
}

// ==========================================
// DEMO MODE CONFIG
// ==========================================

const DEMO_MODE = true
const AI_PROCESSING_TIME = 3000 // 3 seconds

// ==========================================
// COMPONENT
// ==========================================

export default function IDVerificationModal({
    isOpen,
    onClose,
    onSuccess
}: IDVerificationModalProps) {
    const { language } = useLanguage()

    // State
    const [step, setStep] = useState<Step>('info')
    const [idFront, setIdFront] = useState<UploadedImage>({ file: null, preview: '' })
    const [idBack, setIdBack] = useState<UploadedImage>({ file: null, preview: '' })
    const [selfie, setSelfie] = useState<UploadedImage>({ file: null, preview: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [aiProgress, setAiProgress] = useState(0)
    const [aiResults, setAiResults] = useState<{
        name?: string
        idNumber?: string
        matchScore?: number
    }>({})

    // Refs
    const frontInputRef = useRef<HTMLInputElement>(null)
    const backInputRef = useRef<HTMLInputElement>(null)
    const selfieInputRef = useRef<HTMLInputElement>(null)

    // Copy
    const t = {
        th: {
            title: 'ยืนยันตัวตน (KYC)',
            subtitle: 'เพื่อความปลอดภัยและเพิ่มความน่าเชื่อถือ',
            infoTitle: 'เตรียมเอกสาร',
            infoDesc: 'กรุณาเตรียมบัตรประชาชนและกล้องถ่ายรูป',
            requirements: [
                'บัตรประชาชนตัวจริง (ไม่ใช่สำเนา)',
                'รูปถ่ายต้องชัดเจน ไม่มัว',
                'แสงสว่างเพียงพอ',
                'ไม่สวมแว่นกันแดดหรือหมวก'
            ],
            frontTitle: 'ถ่ายรูปบัตรด้านหน้า',
            frontDesc: 'ให้เห็นรูปใบหน้าและข้อมูลชัดเจน',
            backTitle: 'ถ่ายรูปบัตรด้านหลัง',
            backDesc: 'ให้เห็นที่อยู่และวันหมดอายุชัดเจน',
            selfieTitle: 'ถ่าย Selfie ยืนยันตัวตน',
            selfieDesc: 'ถือบัตรประชาชนข้างใบหน้า',
            upload: 'อัปโหลดรูป',
            takePhoto: 'ถ่ายรูป',
            next: 'ถัดไป',
            back: 'ย้อนกลับ',
            startVerify: 'เริ่มยืนยันตัวตน',
            processing: 'AI กำลังตรวจสอบ...',
            aiSteps: [
                'ตรวจสอบความชัดเจนของภาพ',
                'อ่านข้อมูลจากบัตร',
                'เปรียบเทียบใบหน้า',
                'ตรวจสอบความถูกต้อง'
            ],
            success: 'ยืนยันตัวตนสำเร็จ!',
            verified: 'ข้อมูลตรงกับบัตรประชาชน',
            trustGain: 'Trust Score เพิ่มขึ้น',
            continue: 'ดำเนินการต่อ',
            demoNote: '🧪 Demo Mode: รูปใดก็ได้ผ่าน',
            privacy: 'ข้อมูลจะถูกเข้ารหัสและเก็บอย่างปลอดภัย',
            matchScore: 'คะแนนความตรงกัน',
            benefits: [
                '✓ ป้าย "ผู้ใช้ยืนยันตัวตน"',
                '✓ เพิ่มความน่าเชื่อถือ 25%',
                '✓ เปิดร้านค้าได้'
            ]
        },
        en: {
            title: 'Identity Verification (KYC)',
            subtitle: 'For security and trust',
            infoTitle: 'Prepare Documents',
            infoDesc: 'Please prepare your ID card and camera',
            requirements: [
                'Original ID card (not a copy)',
                'Clear, non-blurry photos',
                'Sufficient lighting',
                'No sunglasses or hats'
            ],
            frontTitle: 'Photo of ID Front',
            frontDesc: 'Show face and details clearly',
            backTitle: 'Photo of ID Back',
            backDesc: 'Show address and expiry clearly',
            selfieTitle: 'Selfie Verification',
            selfieDesc: 'Hold ID card next to your face',
            upload: 'Upload Photo',
            takePhoto: 'Take Photo',
            next: 'Next',
            back: 'Back',
            startVerify: 'Start Verification',
            processing: 'AI is verifying...',
            aiSteps: [
                'Checking image clarity',
                'Reading ID information',
                'Comparing faces',
                'Validating data'
            ],
            success: 'Verification Successful!',
            verified: 'Data matches ID card',
            trustGain: 'Trust Score increased by',
            continue: 'Continue',
            demoNote: '🧪 Demo Mode: Any image will pass',
            privacy: 'Data is encrypted and stored securely',
            matchScore: 'Match Score',
            benefits: [
                '✓ "Verified User" badge',
                '✓ Increase trust by 25%',
                '✓ Can open a store'
            ]
        }
    }

    const copy = t[language as 'th' | 'en'] || t.th

    // Handle file upload
    const handleFileUpload = (
        e: React.ChangeEvent<HTMLInputElement>,
        setter: React.Dispatch<React.SetStateAction<UploadedImage>>
    ) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file
        if (!file.type.startsWith('image/')) {
            setError('กรุณาเลือกไฟล์รูปภาพ')
            return
        }

        if (file.size > 10 * 1024 * 1024) { // 10MB
            setError('ไฟล์ใหญ่เกินไป (สูงสุด 10MB)')
            return
        }

        const preview = URL.createObjectURL(file)
        setter({ file, preview })
        setError('')
    }

    // AI Processing simulation
    const processWithAI = async () => {
        setLoading(true)
        setAiProgress(0)

        const progressInterval = setInterval(() => {
            setAiProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval)
                    return 100
                }
                return prev + 2
            })
        }, AI_PROCESSING_TIME / 50)

        await new Promise(resolve => setTimeout(resolve, AI_PROCESSING_TIME))

        clearInterval(progressInterval)
        setAiProgress(100)

        if (DEMO_MODE) {
            // Demo results
            setAiResults({
                name: 'สมชาย ใจดี',
                idNumber: 'X-XXXX-XXXXX-XX-X',
                matchScore: 98.5
            })
        }

        setLoading(false)
        setStep('success')

        // Call success after animation
        setTimeout(() => {
            onSuccess()
        }, 2000)
    }

    // Handle step navigation
    const goToNextStep = () => {
        switch (step) {
            case 'info':
                setStep('front')
                break
            case 'front':
                if (!idFront.preview) {
                    setError('กรุณาอัปโหลดรูปบัตรด้านหน้า')
                    return
                }
                setStep('back')
                break
            case 'back':
                if (!idBack.preview) {
                    setError('กรุณาอัปโหลดรูปบัตรด้านหลัง')
                    return
                }
                setStep('selfie')
                break
            case 'selfie':
                if (!selfie.preview) {
                    setError('กรุณาถ่าย Selfie')
                    return
                }
                setStep('processing')
                processWithAI()
                break
        }
    }

    const goToPrevStep = () => {
        switch (step) {
            case 'front':
                setStep('info')
                break
            case 'back':
                setStep('front')
                break
            case 'selfie':
                setStep('back')
                break
        }
    }

    // Reset and close
    const handleClose = () => {
        setStep('info')
        setIdFront({ file: null, preview: '' })
        setIdBack({ file: null, preview: '' })
        setSelfie({ file: null, preview: '' })
        setError('')
        setAiProgress(0)
        setAiResults({})
        onClose()
    }

    // Get current step index
    const getStepIndex = (): number => {
        const steps: Step[] = ['info', 'front', 'back', 'selfie', 'processing', 'success']
        return steps.indexOf(step)
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
                    className="w-full max-w-lg bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{copy.title}</h2>
                                <p className="text-white/80 text-sm">{copy.subtitle}</p>
                            </div>
                        </div>

                        {/* Progress Steps */}
                        {step !== 'success' && (
                            <div className="mt-4 flex items-center gap-2">
                                {['info', 'front', 'back', 'selfie'].map((s, i) => (
                                    <div key={s} className="flex-1 flex items-center gap-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${getStepIndex() > i ? 'bg-white text-blue-500' :
                                                getStepIndex() === i ? 'bg-white/30 text-white ring-2 ring-white' :
                                                    'bg-white/20 text-white/60'
                                            }`}>
                                            {getStepIndex() > i ? <CheckCircle className="w-4 h-4" /> : i + 1}
                                        </div>
                                        {i < 3 && (
                                            <div className={`flex-1 h-1 rounded ${getStepIndex() > i ? 'bg-white' : 'bg-white/20'
                                                }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        <AnimatePresence mode="wait">
                            {/* Step: Info */}
                            {step === 'info' && (
                                <motion.div
                                    key="info"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Benefits */}
                                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Shield className="w-5 h-5 text-blue-500" />
                                            <span className="font-medium text-blue-700 dark:text-blue-300">
                                                {language === 'th' ? 'สิทธิประโยชน์' : 'Benefits'}
                                            </span>
                                        </div>
                                        <ul className="space-y-1 text-sm text-blue-600 dark:text-blue-400">
                                            {copy.benefits.map((b, i) => (
                                                <li key={i}>{b}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Requirements */}
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white mb-3">
                                            {copy.infoTitle}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
                                            {copy.infoDesc}
                                        </p>
                                        <ul className="space-y-2">
                                            {copy.requirements.map((req, i) => (
                                                <li key={i} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                                                    {req}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/* Privacy Note */}
                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-slate-700/50 rounded-lg px-4 py-3">
                                        <Shield className="w-4 h-4 flex-shrink-0" />
                                        {copy.privacy}
                                    </div>

                                    {/* Demo Note */}
                                    {DEMO_MODE && (
                                        <div className="text-center text-sm text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-3 py-2 rounded-lg">
                                            {copy.demoNote}
                                        </div>
                                    )}

                                    {/* Start Button */}
                                    <button
                                        onClick={goToNextStep}
                                        className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                                    >
                                        <ScanLine className="w-5 h-5" />
                                        {copy.startVerify}
                                    </button>
                                </motion.div>
                            )}

                            {/* Step: Front */}
                            {step === 'front' && (
                                <motion.div
                                    key="front"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                            {copy.frontTitle}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            {copy.frontDesc}
                                        </p>
                                    </div>

                                    {/* Upload Area */}
                                    <div
                                        onClick={() => frontInputRef.current?.click()}
                                        className={`relative aspect-[1.6/1] rounded-2xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden ${idFront.preview ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                                            }`}
                                    >
                                        {idFront.preview ? (
                                            <Image
                                                src={idFront.preview}
                                                alt="ID Front"
                                                fill
                                                className="object-contain p-2"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                <CreditCard className="w-12 h-12 mb-2" />
                                                <span className="text-sm font-medium">{copy.upload}</span>
                                            </div>
                                        )}
                                        <input
                                            ref={frontInputRef}
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            className="hidden"
                                            onChange={e => handleFileUpload(e, setIdFront)}
                                        />
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Navigation */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={goToPrevStep}
                                            className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            {copy.back}
                                        </button>
                                        <button
                                            onClick={goToNextStep}
                                            disabled={!idFront.preview}
                                            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {copy.next}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step: Back */}
                            {step === 'back' && (
                                <motion.div
                                    key="back"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                            {copy.backTitle}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            {copy.backDesc}
                                        </p>
                                    </div>

                                    {/* Upload Area */}
                                    <div
                                        onClick={() => backInputRef.current?.click()}
                                        className={`relative aspect-[1.6/1] rounded-2xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden ${idBack.preview ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                                            }`}
                                    >
                                        {idBack.preview ? (
                                            <Image
                                                src={idBack.preview}
                                                alt="ID Back"
                                                fill
                                                className="object-contain p-2"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                <FileText className="w-12 h-12 mb-2" />
                                                <span className="text-sm font-medium">{copy.upload}</span>
                                            </div>
                                        )}
                                        <input
                                            ref={backInputRef}
                                            type="file"
                                            accept="image/*"
                                            capture="environment"
                                            className="hidden"
                                            onChange={e => handleFileUpload(e, setIdBack)}
                                        />
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Navigation */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={goToPrevStep}
                                            className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            {copy.back}
                                        </button>
                                        <button
                                            onClick={goToNextStep}
                                            disabled={!idBack.preview}
                                            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {copy.next}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step: Selfie */}
                            {step === 'selfie' && (
                                <motion.div
                                    key="selfie"
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="space-y-6"
                                >
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                                            {copy.selfieTitle}
                                        </h3>
                                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                                            {copy.selfieDesc}
                                        </p>
                                    </div>

                                    {/* Upload Area */}
                                    <div
                                        onClick={() => selfieInputRef.current?.click()}
                                        className={`relative aspect-square rounded-2xl border-2 border-dashed transition-colors cursor-pointer overflow-hidden ${selfie.preview ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-500'
                                            }`}
                                    >
                                        {selfie.preview ? (
                                            <Image
                                                src={selfie.preview}
                                                alt="Selfie"
                                                fill
                                                className="object-contain p-2"
                                            />
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                                                <User className="w-16 h-16 mb-2" />
                                                <Camera className="w-8 h-8 absolute bottom-1/3" />
                                                <span className="text-sm font-medium mt-4">{copy.takePhoto}</span>
                                            </div>
                                        )}
                                        <input
                                            ref={selfieInputRef}
                                            type="file"
                                            accept="image/*"
                                            capture="user"
                                            className="hidden"
                                            onChange={e => handleFileUpload(e, setSelfie)}
                                        />
                                    </div>

                                    {/* Error */}
                                    {error && (
                                        <div className="flex items-center gap-2 text-red-500 text-sm">
                                            <AlertCircle className="w-4 h-4" />
                                            {error}
                                        </div>
                                    )}

                                    {/* Navigation */}
                                    <div className="flex gap-3">
                                        <button
                                            onClick={goToPrevStep}
                                            className="flex-1 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                                        >
                                            {copy.back}
                                        </button>
                                        <button
                                            onClick={goToNextStep}
                                            disabled={!selfie.preview}
                                            className="flex-1 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {copy.next}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* Step: Processing */}
                            {step === 'processing' && (
                                <motion.div
                                    key="processing"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="py-8 text-center"
                                >
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                        className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center"
                                    >
                                        <Zap className="w-10 h-10 text-white" />
                                    </motion.div>

                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                        {copy.processing}
                                    </h3>

                                    {/* Progress Bar */}
                                    <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${aiProgress}%` }}
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                        />
                                    </div>

                                    {/* AI Steps */}
                                    <ul className="space-y-2 text-left max-w-xs mx-auto">
                                        {copy.aiSteps.map((s, i) => (
                                            <li key={i} className={`flex items-center gap-2 text-sm ${aiProgress > (i + 1) * 25 ? 'text-green-500' : 'text-gray-400'
                                                }`}>
                                                {aiProgress > (i + 1) * 25 ? (
                                                    <CheckCircle className="w-4 h-4" />
                                                ) : (
                                                    <Loader2 className={`w-4 h-4 ${aiProgress > i * 25 ? 'animate-spin' : ''}`} />
                                                )}
                                                {s}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            )}

                            {/* Step: Success */}
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

                                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                                        {copy.verified}
                                    </p>

                                    {/* Match Score */}
                                    {aiResults.matchScore && (
                                        <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 mb-4 inline-block">
                                            <span className="text-sm text-emerald-600 dark:text-emerald-400">
                                                {copy.matchScore}: <strong>{aiResults.matchScore}%</strong>
                                            </span>
                                        </div>
                                    )}

                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.4 }}
                                        className="flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 mb-6"
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        <span className="font-medium">
                                            {copy.trustGain} +25
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

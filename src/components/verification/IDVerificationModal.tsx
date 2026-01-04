'use client'

/**
 * ============================================
 * ID Verification Modal
 * ============================================
 * 
 * Modal for submitting ID verification documents
 * - Select ID type
 * - Upload front/back images
 * - Optional selfie
 * - Submit for review
 * 
 * @version 2.0.0
 * @updated 2025-12-30
 */

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    CreditCard,
    Camera,
    CheckCircle,
    AlertCircle,
    ChevronRight,
    FileText,
    Loader2,
    BadgeCheck
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { idVerificationService, IDType } from '@/services/idVerificationService'

// ============================================
// TYPES
// ============================================

interface IDVerificationModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
}

type Step = 'select_type' | 'upload_front' | 'upload_back' | 'upload_selfie' | 'review' | 'submitting' | 'success'

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
    th: {
        title: 'ยืนยันตัวตน',
        subtitle: 'เพิ่มความน่าเชื่อถือให้บัญชีผู้ขาย',
        selectType: 'เลือกประเภทเอกสาร',
        thaiIdCard: 'บัตรประชาชน',
        passport: 'หนังสือเดินทาง',
        driverLicense: 'ใบขับขี่',
        uploadFront: 'ถ่ายรูปหน้าบัตร',
        uploadBack: 'ถ่ายรูปหลังบัตร',
        uploadSelfie: 'ถ่าย Selfie คู่บัตร',
        selfieOptional: '(ไม่บังคับ แต่เพิ่มโอกาสผ่านง่ายขึ้น)',
        uploadInstruction: 'แตะเพื่อถ่ายรูปหรือเลือกจากแกลเลอรี',
        tips: [
            'ถ่ายให้เห็นทุกมุมของบัตรชัดเจน',
            'ไม่มีแสงสะท้อนหรือเงา',
            'ข้อมูลบนบัตรต้องอ่านได้',
        ],
        submit: 'ส่งยืนยัน',
        submitting: 'กำลังส่ง...',
        successTitle: 'ส่งคำขอสำเร็จ!',
        successMessage: 'เราจะตรวจสอบและแจ้งผลภายใน 24 ชั่วโมง',
        close: 'ปิด',
        next: 'ถัดไป',
        back: 'กลับ',
        skip: 'ข้าม',
        benefits: [
            'ได้รับป้าย "ยืนยันตัวตน"',
            'เพิ่มความน่าเชื่อถือ 50%',
            'ขายสินค้าราคาสูงได้',
        ],
        error: 'เกิดข้อผิดพลาด',
        imageRequired: 'กรุณาอัปโหลดรูปภาพ',
        docType: 'ประเภทเอกสาร',
        frontImage: 'รูปหน้าบัตร',
        backImage: 'รูปหลังบัตร',
        selfie: 'Selfie',
        uploaded: 'อัปโหลดแล้ว',
        skipped: 'ข้าม',
        reviewTitle: 'ตรวจสอบข้อมูล',
    },
    en: {
        title: 'Verify Identity',
        subtitle: 'Increase seller account trust',
        selectType: 'Select Document Type',
        thaiIdCard: 'Thai ID Card',
        passport: 'Passport',
        driverLicense: 'Driver License',
        uploadFront: 'Take Front Photo',
        uploadBack: 'Take Back Photo',
        uploadSelfie: 'Take Selfie with ID',
        selfieOptional: '(Optional, but increases approval chances)',
        uploadInstruction: 'Tap to take photo or select from gallery',
        tips: [
            'Capture all corners clearly',
            'No reflections or shadows',
            'All text must be readable',
        ],
        submit: 'Submit',
        submitting: 'Submitting...',
        successTitle: 'Submitted Successfully!',
        successMessage: 'We will review and notify you within 24 hours',
        close: 'Close',
        next: 'Next',
        back: 'Back',
        skip: 'Skip',
        benefits: [
            'Get "Verified" badge',
            '50% trust increase',
            'Sell high-value items',
        ],
        error: 'Error occurred',
        imageRequired: 'Please upload an image',
        docType: 'Document Type',
        frontImage: 'Front Image',
        backImage: 'Back Image',
        selfie: 'Selfie',
        uploaded: 'Uploaded',
        skipped: 'Skipped',
        reviewTitle: 'Review Details',
    }
}

// ============================================
// ID TYPE OPTIONS
// ============================================

const idTypeOptions: { value: IDType; icon: React.ReactNode }[] = [
    { value: 'thai_id_card', icon: <CreditCard className="w-6 h-6" /> },
    { value: 'passport', icon: <FileText className="w-6 h-6" /> },
    { value: 'driver_license', icon: <CreditCard className="w-6 h-6" /> }
]

// ============================================
// IMAGE UPLOAD COMPONENT
// ============================================

function ImageUpload({
    label,
    instruction,
    tips,
    onImageSelect,
}: {
    label: string
    instruction: string
    tips: string[]
    onImageSelect: (blob: Blob) => void
}) {
    const inputRef = useRef<HTMLInputElement>(null)
    const [preview, setPreview] = useState<string | null>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            onImageSelect(file)
            setPreview(URL.createObjectURL(file))
        }
    }

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {label}
            </h3>

            <div
                onClick={() => inputRef.current?.click()}
                className={`
                    relative aspect-[3.5/2] rounded-2xl border-2 border-dashed 
                    transition-all cursor-pointer overflow-hidden
                    ${preview
                        ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20'
                    }
                `}
            >
                {preview ? (
                    <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                        <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mb-3">
                            <Camera className="w-8 h-8" />
                        </div>
                        <p className="text-sm">{instruction}</p>
                    </div>
                )}

                {preview && (
                    <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                )}
            </div>

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
            />

            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                <p className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-2">💡 เคล็ดลับ</p>
                <ul className="space-y-1">
                    {tips.map((tip, i) => (
                        <li key={i} className="text-sm text-blue-700 dark:text-blue-400 flex items-start gap-2">
                            <span>•</span><span>{tip}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function IDVerificationModal({
    isOpen,
    onClose,
    onSuccess
}: IDVerificationModalProps) {
    const { user } = useAuth()
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th

    const [step, setStep] = useState<Step>('select_type')
    const [idType, setIdType] = useState<IDType>('thai_id_card')
    const [frontImage, setFrontImage] = useState<Blob | null>(null)
    const [backImage, setBackImage] = useState<Blob | null>(null)
    const [selfieImage, setSelfieImage] = useState<Blob | null>(null)
    const [error, setError] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleClose = () => {
        setStep('select_type')
        setIdType('thai_id_card')
        setFrontImage(null)
        setBackImage(null)
        setSelfieImage(null)
        setError('')
        onClose()
    }

    const handleNext = () => {
        setError('')
        switch (step) {
            case 'select_type': setStep('upload_front'); break
            case 'upload_front':
                if (!frontImage) { setError(t.imageRequired); return }
                setStep('upload_back')
                break
            case 'upload_back': setStep('upload_selfie'); break
            case 'upload_selfie': setStep('review'); break
        }
    }

    const handleBack = () => {
        setError('')
        switch (step) {
            case 'upload_front': setStep('select_type'); break
            case 'upload_back': setStep('upload_front'); break
            case 'upload_selfie': setStep('upload_back'); break
            case 'review': setStep('upload_selfie'); break
        }
    }

    const handleSubmit = async () => {
        if (!user?.uid || !frontImage) return
        setIsSubmitting(true)
        setStep('submitting')

        try {
            const result = await idVerificationService.submitVerification(
                user.uid, idType, frontImage, backImage || undefined, selfieImage || undefined
            )
            if (result.success) {
                setStep('success')
                onSuccess?.()
            } else {
                setError(result.message)
                setStep('review')
            }
        } catch {
            setError(t.error)
            setStep('review')
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={(e) => e.target === e.currentTarget && handleClose()}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                >
                    {/* Header */}
                    <div className="relative bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white">
                        <button onClick={handleClose} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition">
                            <X className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                                <BadgeCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{t.title}</h2>
                                <p className="text-purple-200 text-sm">{t.subtitle}</p>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-xl flex items-center gap-2 text-red-600 dark:text-red-400">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" /><p className="text-sm">{error}</p>
                            </div>
                        )}

                        {step === 'select_type' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t.selectType}</h3>
                                <div className="space-y-3">
                                    {idTypeOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => setIdType(option.value)}
                                            className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition
                                                ${idType === option.value ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-gray-200 dark:border-gray-600 hover:border-purple-300'}`}
                                        >
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${idType === option.value ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'}`}>
                                                {option.icon}
                                            </div>
                                            <span className="font-medium text-gray-900 dark:text-white">
                                                {option.value === 'thai_id_card' ? t.thaiIdCard : option.value === 'passport' ? t.passport : t.driverLicense}
                                            </span>
                                            <ChevronRight className="w-5 h-5 text-gray-400 ml-auto" />
                                        </button>
                                    ))}
                                </div>
                                <div className="mt-6 bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
                                    <p className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">✨ สิทธิประโยชน์</p>
                                    <ul className="space-y-1">
                                        {t.benefits.map((b, i) => (
                                            <li key={i} className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4" />{b}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}

                        {step === 'upload_front' && <ImageUpload label={t.uploadFront} instruction={t.uploadInstruction} tips={t.tips} onImageSelect={setFrontImage} />}
                        {step === 'upload_back' && <ImageUpload label={t.uploadBack} instruction={t.uploadInstruction} tips={t.tips} onImageSelect={setBackImage} />}
                        {step === 'upload_selfie' && (
                            <div className="space-y-2">
                                <ImageUpload label={t.uploadSelfie} instruction={t.uploadInstruction} tips={t.tips} onImageSelect={setSelfieImage} />
                                <p className="text-sm text-gray-500 text-center">{t.selfieOptional}</p>
                            </div>
                        )}

                        {step === 'review' && (
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center">📋 {t.reviewTitle}</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <span className="text-gray-600 dark:text-gray-300">{t.docType}</span>
                                        <span className="font-medium text-gray-900 dark:text-white">{idVerificationService.getIDTypeName(idType, language as 'th' | 'en')}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <span className="text-gray-600 dark:text-gray-300">{t.frontImage}</span>
                                        <span className="text-green-600 flex items-center gap-1"><CheckCircle className="w-4 h-4" />{t.uploaded}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <span className="text-gray-600 dark:text-gray-300">{t.backImage}</span>
                                        <span className={backImage ? 'text-green-600' : 'text-gray-400'}>{backImage ? <><CheckCircle className="w-4 h-4 inline mr-1" />{t.uploaded}</> : t.skipped}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                        <span className="text-gray-600 dark:text-gray-300">{t.selfie}</span>
                                        <span className={selfieImage ? 'text-green-600' : 'text-gray-400'}>{selfieImage ? <><CheckCircle className="w-4 h-4 inline mr-1" />{t.uploaded}</> : t.skipped}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 'submitting' && (
                            <div className="py-8 text-center">
                                <Loader2 className="w-12 h-12 text-purple-600 animate-spin mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-300">{t.submitting}</p>
                            </div>
                        )}

                        {step === 'success' && (
                            <div className="py-8 text-center">
                                <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{t.successTitle}</h3>
                                <p className="text-gray-600 dark:text-gray-300">{t.successMessage}</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 pt-0 flex gap-3">
                        {step !== 'select_type' && step !== 'submitting' && step !== 'success' && (
                            <button onClick={handleBack} className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                                {t.back}
                            </button>
                        )}
                        {step === 'select_type' && (
                            <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:opacity-90 transition">{t.next}</button>
                        )}
                        {(step === 'upload_front' || step === 'upload_back') && (
                            <button onClick={handleNext} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:opacity-90 transition">{t.next}</button>
                        )}
                        {step === 'upload_selfie' && (
                            <>
                                <button onClick={() => setStep('review')} className="flex-1 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium">{t.skip}</button>
                                <button onClick={handleNext} disabled={!selfieImage} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50">{t.next}</button>
                            </>
                        )}
                        {step === 'review' && (
                            <button onClick={handleSubmit} disabled={isSubmitting} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:opacity-90 transition disabled:opacity-50">{t.submit}</button>
                        )}
                        {step === 'success' && (
                            <button onClick={handleClose} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium hover:opacity-90 transition">{t.close}</button>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

'use client'

import React, { useState, useRef } from 'react'
import {
    Camera, Upload, ShieldCheck, ShieldAlert,
    CheckCircle2, AlertCircle, X, Loader2, ArrowRight
} from 'lucide-react'
import { verifyIdentity } from '@/lib/ai-identity'
import Button from '@/components/ui/Button'

interface VerificationStepProps {
    onComplete: (verifiedData: any) => void
}

export default function VerificationStep({ onComplete }: VerificationStepProps) {
    const [step, setStep] = useState<'idcard' | 'selfie' | 'processing' | 'result'>('idcard')
    const [idCardFile, setIdCardFile] = useState<File | null>(null)
    const [selfieFile, setSelfieFile] = useState<File | null>(null)
    const [result, setResult] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)

    // Preview URLs
    const [idCardPreview, setIdCardPreview] = useState<string | null>(null)
    const [selfiePreview, setSelfiePreview] = useState<string | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Dev Bypass
    const handleDevSkip = async () => {
        setStep('processing')
        const res = await verifyIdentity(null, null, true)
        setResult(res)
        setStep('result')
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const url = URL.createObjectURL(file)

            if (step === 'idcard') {
                setIdCardFile(file)
                setIdCardPreview(url)
            } else {
                setSelfieFile(file)
                setSelfiePreview(url)
            }
        }
    }

    const handleNext = async () => {
        if (step === 'idcard' && idCardFile) {
            setStep('selfie')
        } else if (step === 'selfie' && selfieFile) {
            // Process
            setStep('processing')
            try {
                const res = await verifyIdentity(idCardFile, selfieFile)
                setResult(res)
                setStep('result')
            } catch (err) {
                setError('Verification failed. Please try again.')
                setStep('idcard') // Reset?
            }
        }
    }

    const reset = () => {
        setStep('idcard')
        setIdCardFile(null)
        setSelfieFile(null)
        setIdCardPreview(null)
        setSelfiePreview(null)
        setResult(null)
    }

    // Step 1: Upload ID Card
    if (step === 'idcard') {
        return (
            <div className="space-y-6 animate-fade-in-up">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            ยืนยันตัวตน (KYC)
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">Step 4</span>
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            อัปโหลดรูปบัตรประชาชนเพื่อยืนยันตัวตนกับระบบ AI
                        </p>
                    </div>
                    <button
                        onClick={handleDevSkip}
                        className="text-xs bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-300 transition-colors"
                    >
                        Skip (Dev Mode)
                    </button>
                </div>

                <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-neon-purple transition-all bg-gray-50 dark:bg-gray-800/50"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />

                    {idCardPreview ? (
                        <div className="relative w-full max-w-sm aspect-video rounded-xl overflow-hidden shadow-lg">
                            <img src={idCardPreview} alt="ID Card" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <p className="text-white font-medium flex items-center gap-2"><Upload className="w-4 h-4" /> เปลี่ยนรูปภาพ</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 text-blue-500 rounded-full flex items-center justify-center mb-4">
                                <ShieldCheck className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">อัปโหลดบัตรประชาชน</h3>
                            <p className="text-sm text-gray-500 max-w-xs">
                                ถ่ายรูปหน้าบัตรให้ชัดเจน ไม่เบลอ ไม่สะท้อนแสง และเห็นข้อมูลครบถ้วน
                            </p>
                        </>
                    )}
                </div>

                <Button
                    className="w-full h-12 text-lg"
                    disabled={!idCardFile}
                    onClick={handleNext}
                >
                    ถัดไป
                </Button>
            </div>
        )
    }

    // Step 2: Selfie
    if (step === 'selfie') {
        return (
            <div className="space-y-6 animate-fade-in-up">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            สแกนใบหน้า
                            <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full">Step 4</span>
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            ถ่ายรูปเซลฟี่คู่กับบัตรประชาชน หรือเซลฟี่หน้าตรง
                        </p>
                    </div>
                </div>

                <div
                    className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-neon-purple transition-all bg-gray-50 dark:bg-gray-800/50"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                    />

                    {selfiePreview ? (
                        <div className="relative w-48 h-48 rounded-full overflow-hidden shadow-lg border-4 border-white dark:border-gray-700">
                            <img src={selfiePreview} alt="Selfie" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                                <p className="text-white font-medium text-xs">เปลี่ยนรูป</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 text-purple-500 rounded-full flex items-center justify-center mb-4">
                                <Camera className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold mb-2">ถ่ายรูปเซลฟี่</h3>
                            <p className="text-sm text-gray-500 max-w-xs">
                                หน้าตรง ไม่สวมหมวก หรือแว่นตาดำ แสงสว่างเพียงพอ
                            </p>
                        </>
                    )}
                </div>

                <div className="flex gap-3">
                    <Button variant="ghost" onClick={() => setStep('idcard')} className="flex-1">ย้อนกลับ</Button>
                    <Button
                        className="flex-1 h-12 shadow-lg shadow-neon-purple/20"
                        disabled={!selfieFile}
                        onClick={handleNext}
                    >
                        ยืนยันตัวตน
                    </Button>
                </div>
            </div>
        )
    }

    // Step 3: Processing
    if (step === 'processing') {
        return (
            <div className="flex flex-col items-center justify-center py-12 animate-fade-in text-center">
                <div className="relative">
                    <div className="w-20 h-20 border-4 border-gray-200 border-t-neon-purple rounded-full animate-spin mb-6"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <ShieldCheck className="w-8 h-8 text-neon-purple/50" />
                    </div>
                </div>
                <h3 className="text-xl font-bold mb-2">AI กำลังตรวจสอบข้อมูล...</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                    ระบบกำลังทำการตรวจสอบเอกสารและเปรียบเทียบใบหน้า (Face Match)
                </p>
                <div className="mt-6 space-y-2 text-sm text-gray-400">
                    <div className="flex items-center gap-2 justify-center">
                        <Loader2 className="w-3 h-3 animate-spin" /> Performing OCR...
                    </div>
                    <div className="flex items-center gap-2 justify-center">
                        <Loader2 className="w-3 h-3 animate-spin delay-75" /> Matching Faces...
                    </div>
                </div>
            </div>
        )
    }

    // Step 4: Result
    if (step === 'result' && result) {
        if (result.success) {
            return (
                <div className="text-center py-8 animate-fade-in-up">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        ยืนยันตัวตนสำเร็จ!
                    </h2>
                    <p className="text-gray-500 mb-6">
                        ข้อมูลของคุณได้รับการตรวจสอบเรียบร้อยแล้ว (Score: {result.score}%)
                    </p>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-8 text-left max-w-sm mx-auto">
                        <h4 className="font-bold mb-2 text-xs uppercase text-gray-400">ข้อมูลที่อ่านได้ (OCR)</h4>
                        <div className="space-y-1 text-sm">
                            <p><span className="text-gray-500">ชื่อ:</span> {result.ocrData.fullNameTh}</p>
                            <p><span className="text-gray-500">Name:</span> {result.ocrData.fullNameEn}</p>
                        </div>
                    </div>

                    <Button
                        onClick={() => onComplete(result)}
                        className="w-full h-12 text-lg shadow-lg shadow-green-500/20"
                    >
                        ดำเนินการต่อ <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                </div>
            )
        } else {
            return (
                <div className="text-center py-8 animate-fade-in-up">
                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <ShieldAlert className="w-10 h-10 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        ยืนยันตัวตนไม่ผ่าน
                    </h2>
                    <p className="text-gray-500 mb-6">
                        ไม่สามารถตรวจสอบข้อมูลได้ กรุณาลองใหม่อีกครั้ง
                    </p>
                    <Button
                        variant="ghost"
                        onClick={reset}
                        className="w-full"
                    >
                        ลองอีกครั้ง
                    </Button>
                </div>
            )
        }
    }

    return null
}

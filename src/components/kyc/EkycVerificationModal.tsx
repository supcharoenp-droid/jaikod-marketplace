'use client'

import React, { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, CheckCircle, ShieldCheck, XCircle, Loader2, User } from 'lucide-react'
import { performEkycVerification, KycCheckResult } from '@/services/ekycService'

// Helper for image preview
const ImagePreview = ({ file, label }: { file: File | null, label: string }) => (
    <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-800 overflow-hidden relative group">
        {file ? (
            <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-full h-full object-cover"
            />
        ) : (
            <div className="text-gray-400 text-center">
                <div className="mb-2 mx-auto w-8 h-8 opacity-50"><Upload /></div>
                <span className="text-xs">{label}</span>
            </div>
        )}
    </div>
)

export default function EkycVerificationModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const [step, setStep] = useState(1) // 1: Upload ID, 2: Selfie, 3: Processing, 4: Result
    const [idCardFile, setIdCardFile] = useState<File | null>(null)
    const [selfieFile, setSelfieFile] = useState<File | null>(null)
    const [result, setResult] = useState<KycCheckResult | null>(null)

    // Hidden inputs
    const idInputRef = useRef<HTMLInputElement>(null)
    const selfieInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (f: File) => void) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0])
            if (step === 1) setTimeout(() => setStep(2), 500)
            if (step === 2) setTimeout(() => setStep(3), 500)
        }
    }

    const startVerification = async () => {
        if (!idCardFile || !selfieFile) return
        setStep(3)
        try {
            const res = await performEkycVerification(idCardFile, selfieFile)
            setResult(res)
            setStep(4)
        } catch (e) {
            console.error(e)
            setStep(4) // Show generic error state
        }
    }

    // Effect to auto-start when both files ready (mock user flow)
    React.useEffect(() => {
        if (step === 3 && result === null) {
            startVerification()
        }
    }, [step])

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-card-dark w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="p-6 bg-blue-600 text-white flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ShieldCheck className="w-6 h-6" />
                            ยืนยันตัวตน (eKYC)
                        </h2>
                        <p className="text-blue-100 text-sm mt-1">เพิ่มความน่าเชื่อถือ ปลดล็อคฟีเจอร์ผู้ขาย</p>
                    </div>
                </div>

                <div className="p-6">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-4"
                            >
                                <h3 className="font-bold text-gray-900 border-l-4 border-blue-500 pl-3">ขั้นตอนที่ 1: อัปโหลดบัตรประชาชน</h3>
                                <p className="text-sm text-gray-600">ถ่ายรูปหน้าบัตรประชาชนให้ชัดเจน ไม่เบลอ ไม่มีแสงสะท้อน</p>

                                <div onClick={() => idInputRef.current?.click()} className="cursor-pointer">
                                    <ImagePreview file={idCardFile} label="คลิกเพื่อถ่ายรูป/อัปโหลด" />
                                </div>
                                <input type="file" ref={idInputRef} onChange={(e) => handleFileChange(e, setIdCardFile)} className="hidden" accept="image/*" />

                                <button
                                    disabled={!idCardFile}
                                    onClick={() => setStep(2)}
                                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50 hover:bg-blue-700 transition"
                                >
                                    ถัดไป
                                </button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="space-y-4"
                            >
                                <h3 className="font-bold text-gray-900 border-l-4 border-blue-500 pl-3">ขั้นตอนที่ 2: สแกนใบหน้า</h3>
                                <p className="text-sm text-gray-600">ถ่ายรูปใบหน้าตรงของคุณเพื่อเปรียบเทียบกับบัตร</p>

                                <div onClick={() => selfieInputRef.current?.click()} className="cursor-pointer">
                                    <div className="w-40 h-40 mx-auto rounded-full border-4 border-blue-100 overflow-hidden relative group">
                                        {selfieFile ? (
                                            <img src={URL.createObjectURL(selfieFile)} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                <User className="w-16 h-16" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                            <Camera className="text-white" />
                                        </div>
                                    </div>
                                </div>
                                <input type="file" ref={selfieInputRef} onChange={(e) => handleFileChange(e, setSelfieFile)} className="hidden" accept="image/*" capture="user" />

                                <div className="flex gap-2">
                                    <button onClick={() => setStep(1)} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl font-bold">ย้อนกลับ</button>
                                    <button
                                        disabled={!selfieFile}
                                        onClick={() => setStep(3)}
                                        className="flex-[2] bg-blue-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
                                    >
                                        เริ่มตรวจสอบ
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                className="flex flex-col items-center justify-center py-8 text-center"
                            >
                                <div className="relative w-24 h-24 mb-6">
                                    <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <ScanFaceAnimation />
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2">กำลังตรวจสอบข้อมูล...</h3>
                                <p className="text-gray-500 text-sm">ระบบ AI กำลังวิเคราะห์ใบหน้าและความถูกต้องของเอกสาร</p>
                                <div className="mt-4 space-y-2 text-xs text-gray-400">
                                    <div className="flex items-center justify-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> ตรวจสอบความชัดเจน</div>
                                    <div className="flex items-center justify-center gap-2 opacity-70"><Loader2 className="w-3 h-3 animate-spin" /> Face Matching Analysis</div>
                                </div>
                            </motion.div>
                        )}

                        {step === 4 && result && (
                            <motion.div
                                key="step4"
                                className="text-center py-4"
                            >
                                {result.is_valid ? (
                                    <>
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-10 h-10 text-green-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-green-600 mb-2">ยืนยันตัวตนสำเร็จ!</h3>
                                        <p className="text-gray-600 mb-6">คุณได้รับสถานะ <span className="font-bold text-black">Verified Seller</span> เรียบร้อยแล้ว</p>

                                        <div className="bg-gray-50 p-4 rounded-xl text-left text-sm mb-6">
                                            <div className="grid grid-cols-2 gap-2">
                                                <span className="text-gray-500">ชื่อ-นามสกุล:</span>
                                                <span className="font-medium">{result.id_card_data?.name_th}</span>
                                                <span className="text-gray-500">Face Match:</span>
                                                <span className="font-bold text-green-600">{result.face_match_score}%</span>
                                                <span className="text-gray-500">Liveness:</span>
                                                <span className="font-bold text-green-600">{result.liveness_score}%</span>
                                            </div>
                                        </div>

                                        <button onClick={onClose} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold hover:bg-green-700">
                                            เสร็จสิ้น
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <XCircle className="w-10 h-10 text-red-600" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-red-600 mb-2">ยืนยันตัวตนไม่ผ่าน</h3>
                                        <p className="text-gray-600 mb-6">{result.error_reason}</p>

                                        <button onClick={() => setStep(1)} className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800">
                                            ลองใหม่อีกครั้ง
                                        </button>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    )
}

const ScanFaceAnimation = () => (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-blue-500">
        <path d="M3 7V5a2 2 0 0 1 2-2h2" />
        <path d="M17 3h2a2 2 0 0 1 2 2v2" />
        <path d="M21 17v2a2 2 0 0 1-2 2h-2" />
        <path d="M7 21H5a2 2 0 0 1-2-2v-2" />
        <path d="M8 12a4 4 0 1 0 8 0 4 4 0 0 0-8 0" />
        <path d="M2 12h2" />
        <path d="M20 12h2" />
    </svg>
)

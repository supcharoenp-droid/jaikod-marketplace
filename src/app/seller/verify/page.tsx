'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
    ShieldCheck, Upload, CheckCircle,
    Building2, FileText, BadgeCheck
} from 'lucide-react'
import Header from '@/components/layout/Header'
// import { useAuth } from '@/contexts/AuthContext'

export default function OfficialVerificationPage() {
    // const { user } = useAuth()
    const router = useRouter()

    // State
    const [step, setStep] = useState<1 | 2 | 3>(1)
    const [files, setFiles] = useState<{
        regCert?: File,
        vatCert?: File,
        idCard?: File
    }>({})
    const [isLoading, setIsLoading] = useState(false)
    const [form, setForm] = useState({
        companyName: '',
        regNumber: '',
        taxId: '',
        contactName: ''
    })

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: keyof typeof files) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [type]: e.target.files![0] }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        // Mock Submission
        await new Promise(resolve => setTimeout(resolve, 2000))

        setIsLoading(false)
        setStep(3) // Success
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">

                {/* Header Section */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-full mb-4">
                        <BadgeCheck className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                        สมัครเป็นร้านค้าทางการ (Official Store)
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 max-w-lg mx-auto">
                        เข้าถึงสิทธิพิเศษ เครื่องมือการตลาดครบวงจร และสร้างความเชื่อมั่นให้ลูกค้า
                        ด้วยเครื่องหมาย Official Store ✔
                    </p>
                </div>

                {/* Steps Indicator */}
                <div className="flex items-center justify-center mb-10">
                    <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>1</div>
                        <span>ข้อมูลนิติบุคคล</span>
                    </div>
                    <div className="w-16 h-0.5 bg-gray-200 mx-4" />
                    <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600 font-bold' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-gray-300'}`}>2</div>
                        <span>เอกสารยืนยัน</span>
                    </div>
                    <div className="w-16 h-0.5 bg-gray-200 mx-4" />
                    <div className={`flex items-center gap-2 ${step >= 3 ? 'text-green-600 font-bold' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-green-600 bg-green-50' : 'border-gray-300'}`}>3</div>
                        <span>ตรวจสอบ</span>
                    </div>
                </div>

                {/* Content */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">

                    {step === 1 && (
                        <form onSubmit={(e) => { e.preventDefault(); setStep(2) }} className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-bold flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <Building2 className="w-5 h-5 text-blue-500" />
                                ข้อมูลธุรกิจ (Business Info)
                            </h2>

                            <div>
                                <label className="block text-sm font-medium mb-1">ชื่อบริษัท / ห้างหุ้นส่วน *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="บริษัท ตัวอย่าง จำกัด"
                                    value={form.companyName}
                                    onChange={e => setForm({ ...form, companyName: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-1">เลขทะเบียนนิติบุคคล (13 หลัก) *</label>
                                    <input
                                        type="text"
                                        required
                                        maxLength={13}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="010555xxxxxxx"
                                        value={form.regNumber}
                                        onChange={e => setForm({ ...form, regNumber: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">เลขประจำตัวผู้เสียภาษี *</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="ระบุเลขประจำตัวผู้เสียภาษี"
                                        value={form.taxId}
                                        onChange={e => setForm({ ...form, taxId: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">ชื่อผู้มีอำนาจลงนาม / ผู้ติดต่อหลัก *</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="นาย ใจดี มีโค้ด"
                                    value={form.contactName}
                                    onChange={e => setForm({ ...form, contactName: e.target.value })}
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
                                    ถัดไป: อัปโหลดเอกสาร
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
                            <h2 className="text-xl font-bold flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <FileText className="w-5 h-5 text-blue-500" />
                                อัปโหลดเอกสาร (Documents)
                            </h2>

                            <div className="space-y-4">
                                <FileUpload
                                    label="1. หนังสือรับรองบริษัท (Certificate of Registration)"
                                    subtext="อายุไม่เกิน 6 เดือน (PDF/JPG)"
                                    file={files.regCert}
                                    onChange={(e) => handleFileChange(e, 'regCert')}
                                    required
                                />
                                <FileUpload
                                    label="2. ใบทะเบียนภาษีมูลค่าเพิ่ม (ภ.พ.20)"
                                    subtext="ถ้ามี (PDF/JPG)"
                                    file={files.vatCert}
                                    onChange={(e) => handleFileChange(e, 'vatCert')}
                                />
                                <FileUpload
                                    label="3. สำเนาบัตรประชาชนกรรมการ"
                                    subtext="พร้อมเซ็นรับรองสำเนาถูกต้อง (JPG/PNG)"
                                    file={files.idCard}
                                    onChange={(e) => handleFileChange(e, 'idCard')}
                                    required
                                />
                            </div>

                            <div className="pt-6 flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="text-gray-500 hover:text-gray-900 font-medium"
                                >
                                    ย้อนกลับ
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading || !files.regCert || !files.idCard}
                                    className="bg-blue-600 text-white px-8 py-2 rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                                    ส่งข้อมูลยืนยัน
                                </button>
                            </div>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center py-10 animate-fade-in">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <ShieldCheck className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">ส่งเอกสารเรียบร้อยแล้ว!</h2>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-8">
                                ทีมงาน JaiKod จะตรวจสอบเอกสารของท่านภายใน 1-2 วันทำการ หากผ่านการอนุมัติ ท่านจะได้รับเครื่องหมาย Official Store และสามารถเริ่มใช้งานเครื่องมือร้านค้าได้ทันที
                            </p>
                            <button
                                onClick={() => router.push('/seller/dashboard')}
                                className="bg-gray-900 dark:bg-white dark:text-gray-900 text-white px-6 py-2 rounded-lg font-bold hover:opacity-90 transition"
                            >
                                กลับสู่แดชบอร์ด
                            </button>
                        </div>
                    )}

                </div>
            </main>
        </div>
    )
}

function FileUpload({ label, subtext, file, onChange, required = false }: any) {
    return (
        <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800/50 transition cursor-pointer relative group">
            <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={onChange}
                accept=".jpg,.jpeg,.png,.pdf"
            />
            {file ? (
                <div className="text-center">
                    <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="font-medium text-gray-900 dark:text-white truncate max-w-[200px]">{file.name}</p>
                    <p className="text-xs text-green-600">อัปโหลดสำเร็จ</p>
                </div>
            ) : (
                <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-blue-500 transition-colors" />
                    <p className="font-medium text-gray-700 dark:text-gray-300">
                        {label} {required && <span className="text-red-500">*</span>}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">{subtext}</p>
                </div>
            )}
        </div>
    )
}

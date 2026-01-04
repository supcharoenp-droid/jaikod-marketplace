'use client'

import React, { useState, useEffect } from 'react'
import {
    Car, Calendar, Activity, PenTool, FileText,
    ShieldCheck, MapPin, DollarSign, Upload,
    AlertCircle, CheckCircle2, ChevronRight,
    Camera, Sparkles, Zap, Navigation, Globe
} from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface AutomotiveFormProps {
    initialData: any
    existingImages: File[]
    onBack: () => void
    onNext: (data: any) => void
    onSaveDraft: (data: any) => void
}

export default function AutomotiveForm({
    initialData, existingImages, onBack, onNext, onSaveDraft
}: AutomotiveFormProps) {

    // --- State ---
    const [images, setImages] = useState<File[]>(existingImages)
    const [imagePreviews, setImagePreviews] = useState<string[]>(
        existingImages.map(f => URL.createObjectURL(f))
    )
    const [ocrProcessing, setOcrProcessing] = useState(false)
    const [aiAnalysis, setAiAnalysis] = useState<{
        scratches: number;
        tireCondition: string;
        priceBenchmark: { min: number, max: number, avg: number };
    } | null>(null)

    const [form, setForm] = useState({
        // Main Info
        brand: initialData?.brand || '',
        model: initialData?.model || '',
        submodel: initialData?.submodel || '',
        year: initialData?.year || new Date().getFullYear(),
        mileage: initialData?.mileage || '',
        color: initialData?.color || 'white',

        // Specs
        type: initialData?.type || 'sedan',
        engine_size: initialData?.engine_size || '',
        fuel: initialData?.fuel || 'petrol',
        gear: initialData?.gear || 'auto',
        drive: initialData?.drive || 'fwd',

        // Condition
        condition: initialData?.condition || 'used_good',
        accident_history: 'none',
        flood_history: 'none',
        engine_issues: 'none',

        // Registration
        has_book: true,
        tax_expiry: '',
        insurance_type: 'none',

        // Pricing
        price: initialData?.price || '',

        // Location
        province: initialData?.province || 'Bangkok',
        district: initialData?.district || '',

        // Options
        can_finance: false,
        can_deliver: false,
        allow_test_drive: true
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    // --- Mock AI Operations ---
    useEffect(() => {
        // Simulate initial AI analysis based on passed type
        if (!aiAnalysis) {
            setTimeout(() => {
                setAiAnalysis({
                    scratches: Math.floor(Math.random() * 3),
                    tireCondition: 'Good (80%)',
                    priceBenchmark: {
                        min: 350000,
                        max: 420000,
                        avg: 385000
                    }
                })
            }, 1000)
        }
    }, [])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            setImages(prev => [...prev, ...files])
            const newPreviews = files.map(f => URL.createObjectURL(f))
            setImagePreviews(prev => [...prev, ...newPreviews])

            // Trigger specific AI checks for new car images
            // (Mock visual feedback would happen here)
        }
    }

    const handleBookUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.length) {
            setOcrProcessing(true)
            setTimeout(() => {
                setOcrProcessing(false)
                // Mock OCR Result
                setForm(prev => ({
                    ...prev,
                    year: 2019,
                    engine_size: '1998',
                    brand: 'Honda',
                    model: 'Civic'
                }))
                alert('OCR Completed: Information extracted from registration book.')
            }, 1500)
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!form.brand) newErrors.brand = 'Required'
        if (!form.model) newErrors.model = 'Required'
        if (Number(form.year) < 1990 || Number(form.year) > 2025) newErrors.year = '1990-2025'
        if (!form.mileage || Number(form.mileage) <= 0) newErrors.mileage = 'Invalid mileage'
        if (!form.price || Number(form.price) < 10000) newErrors.price = 'Min 10,000 THB'
        if (images.length < 6) newErrors.images = 'Min 6 images required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (validateForm()) {
            onNext({ ...form, images })
        } else {
            // Scroll to top or show toast
            const errorMsg = Object.values(errors)[0] || 'Please fix errors'
            alert(errorMsg)
        }
    }

    // --- Render Helpers ---
    const Section = ({ title, icon: Icon, children }: any) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-gray-700">
                <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                    <Icon className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{title}</h3>
            </div>
            {children}
        </div>
    )

    const InputGroup = ({ label, error, children, required = false }: any) => (
        <div className="space-y-1.5">
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {label} {required && <span className="text-red-500">*</span>}
            </label>
            {children}
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    )

    return (
        <div className="max-w-4xl mx-auto space-y-6 pb-32 md:pb-24 font-sans">

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-2xl font-bold">ลงขายรถยนต์</h1>
                    <p className="text-gray-500 text-sm">Professional Car Listing</p>
                </div>
                {aiAnalysis && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold border border-green-200">
                        <Sparkles className="w-3 h-3" /> AI Assisted
                    </div>
                )}
            </div>

            {/* 1. Images (Enhanced) */}
            <Section title="รูปภาพรถยนต์" icon={Camera}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <button className="aspect-[4/3] rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 group relative overflow-hidden">
                        <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                        <Camera className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium">เพิ่มรูป (Min 6)</span>
                    </button>
                    {imagePreviews.map((src, idx) => (
                        <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden shadow-sm group border border-gray-200">
                            <Image src={src} fill alt="" className="object-cover" />
                            {idx === 0 && <span className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">Cover</span>}
                        </div>
                    ))}
                </div>

                {/* AI Image Insights */}
                {aiAnalysis && imagePreviews.length > 0 && (
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex items-center gap-3">
                            <Activity className="w-4 h-4 text-orange-500" />
                            <div className="text-xs">
                                <span className="font-bold block text-gray-700 dark:text-gray-300">รอยขีดข่วน (AI)</span>
                                <span className="text-gray-500">ตรวจพบ {aiAnalysis.scratches} จุด (ต้องตรวจสอบ)</span>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg flex items-center gap-3">
                            <Zap className="w-4 h-4 text-blue-500" />
                            <div className="text-xs">
                                <span className="font-bold block text-gray-700 dark:text-gray-300">สภาพยาง (AI)</span>
                                <span className="text-gray-500">{aiAnalysis.tireCondition}</span>
                            </div>
                        </div>
                    </div>
                )}
                {errors.images && <p className="text-sm text-red-500 font-medium">{errors.images}</p>}

                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                        <div className="flex items-center gap-3">
                            <FileText className="w-8 h-8 text-blue-600" />
                            <div>
                                <h4 className="font-bold text-sm text-blue-900 dark:text-blue-100">ดึงข้อมูลจากเล่มทะเบียน (OCR)</h4>
                                <p className="text-xs text-blue-700 dark:text-blue-300">อัปโหลดรูปเล่มเพื่อกรอกข้อมูลอัตโนมัติ</p>
                            </div>
                        </div>
                        <button className="relative px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 text-sm font-bold rounded-lg shadow hover:bg-gray-50">
                            {ocrProcessing ? 'Scanning...' : 'Upload Book'}
                            <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleBookUpload} disabled={ocrProcessing} />
                        </button>
                    </div>
                </div>
            </Section>

            {/* 2. Main Info */}
            <Section title="ข้อมูลหลัก" icon={Car}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="ยี่ห้อ (Brand)" required error={errors.brand}>
                        <input type="text" value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="Honda, Toyota..." />
                    </InputGroup>
                    <InputGroup label="รุ่น (Model)" required error={errors.model}>
                        <input type="text" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="Civic, Altis..." />
                    </InputGroup>
                    <InputGroup label="รุ่นย่อย (Submodel)">
                        <input type="text" value={form.submodel} onChange={e => setForm({ ...form, submodel: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="1.8 EL, Turbo RS..." />
                    </InputGroup>
                    <div className="grid grid-cols-2 gap-4">
                        <InputGroup label="ปี (Year)" required error={errors.year}>
                            <input type="number" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="2020" />
                        </InputGroup>
                        <InputGroup label="เลขไมล์ (km)" required error={errors.mileage}>
                            <input type="number" value={form.mileage} onChange={e => setForm({ ...form, mileage: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="50000" />
                        </InputGroup>
                    </div>
                </div>
            </Section>

            {/* 3. Specs */}
            <Section title="สเปคยานยนต์" icon={Zap}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <InputGroup label="ประเภทรถ">
                        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <option value="sedan">เก๋ง (Sedan)</option>
                            <option value="suv">SUV / PPV</option>
                            <option value="pickup">กระบะ (Pickup)</option>
                            <option value="hatchback">5 ประตู (Hatchback)</option>
                            <option value="van">รถตู้ (Van)</option>
                            <option value="coupe">คูเป้ (Coupe)</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="เชื้อเพลิง">
                        <select value={form.fuel} onChange={e => setForm({ ...form, fuel: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <option value="petrol">เบนซิน</option>
                            <option value="diesel">ดีเซล</option>
                            <option value="hybrid">ไฮบริด</option>
                            <option value="ev">ไฟฟ้า (EV)</option>
                            <option value="lpg">LPG / NGV</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="เกียร์">
                        <select value={form.gear} onChange={e => setForm({ ...form, gear: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <option value="auto">Auto</option>
                            <option value="manual">Manual</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="ขนาดเครื่องยนต์ (cc)">
                        <input type="text" value={form.engine_size} onChange={e => setForm({ ...form, engine_size: e.target.value })} placeholder="1500, 2.0" className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
                    </InputGroup>
                    <InputGroup label="ระบบขับเคลื่อน">
                        <select value={form.drive} onChange={e => setForm({ ...form, drive: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <option value="fwd">ขับหน้า</option>
                            <option value="rwd">ขับหลัง</option>
                            <option value="4wd">ขับ 4</option>
                        </select>
                    </InputGroup>
                </div>
            </Section>

            {/* 4. Condition */}
            <Section title="สภาพรถ" icon={Activity}>
                <div className="space-y-4">
                    <InputGroup label="สภาพโดยรวม">
                        <div className="flex flex-wrap gap-2">
                            {['new', 'used_excellent', 'used_good', 'fair'].map(c => (
                                <button key={c} onClick={() => setForm({ ...form, condition: c })} className={`px-4 py-2 rounded-lg text-sm font-medium border ${form.condition === c ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-gray-200 text-gray-700'}`}>
                                    {c === 'new' ? 'รถใหม่' : c === 'used_excellent' ? 'สวยนางฟ้า' : c === 'used_good' ? 'สภาพดี' : 'พอใช้'}
                                </button>
                            ))}
                        </div>
                    </InputGroup>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputGroup label="ประวัติอุบัติเหตุ">
                            <select value={form.accident_history} onChange={e => setForm({ ...form, accident_history: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                <option value="none">ไม่เคยชน</option>
                                <option value="minor">เฉี่ยวชนเล็กน้อย</option>
                                <option value="major">เคยชนหนัก (ระบุ)</option>
                            </select>
                        </InputGroup>
                        <InputGroup label="น้ำท่วม">
                            <select value={form.flood_history} onChange={e => setForm({ ...form, flood_history: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                <option value="none">✅ ไม่เคยจมน้ำ</option>
                                <option value="partial">💧 เคยจมน้ำนิดหน่อย (ไม่ถึงพื้นห้องโดยสาร)</option>
                                <option value="full">🌊 เคยจมน้ำทั้งคัน</option>
                            </select>
                        </InputGroup>
                    </div>
                </div>
            </Section>

            {/* 7. Pricing (Moved up for importance) with AI Benchmark */}
            <Section title="ราคาขาย" icon={DollarSign}>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <InputGroup label="ราคาที่ต้องการ (บาท)" required error={errors.price}>
                            <div className="relative">
                                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full pl-8 pr-4 py-3 text-2xl font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="0.00" />
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">฿</span>
                            </div>
                        </InputGroup>
                    </div>

                    {/* AI Price Benchmark */}
                    <div className="flex-1 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 p-4 rounded-xl border border-green-100 dark:border-green-800">
                        <div className="flex items-center gap-2 mb-2 text-green-800 dark:text-green-300">
                            <Activity className="w-4 h-4" />
                            <span className="font-bold text-sm">AI Price Benchmark</span>
                        </div>
                        {aiAnalysis ? (
                            <div>
                                <div className="flex items-end justify-between mb-1">
                                    <span className="text-xs text-gray-600 dark:text-gray-400">ราคากลางตลาด</span>
                                    <span className="text-lg font-bold text-green-700">฿{aiAnalysis.priceBenchmark.avg.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden relative">
                                    {/* Range Bar */}
                                    <div className="absolute top-0 bottom-0 bg-green-200 dark:bg-green-800" style={{
                                        left: '20%',
                                        right: '20%'
                                    }} />
                                    {/* Current Price Marker (Mock Logic) */}
                                    <div className="absolute top-0 bottom-0 w-1 bg-black dark:bg-white" style={{ left: '50%' }} />
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                                    <span>฿{aiAnalysis.priceBenchmark.min.toLocaleString()}</span>
                                    <span>฿{aiAnalysis.priceBenchmark.max.toLocaleString()}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-pulse space-y-2">
                                <div className="h-4 bg-green-200 rounded w-1/2"></div>
                                <div className="h-2 bg-green-200 rounded w-full"></div>
                            </div>
                        )}
                    </div>
                </div>
            </Section>

            {/* 6. Location */}
            <Section title="สถานที่นัดดูรถ" icon={MapPin}>
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="จังหวัด">
                        <select value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <option>Bangkok</option>
                            <option>Chiang Mai</option>
                            <option>Phuket</option>
                            <option>Khon Kaen</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="เขต/อำเภอ">
                        <input type="text" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="District..." />
                    </InputGroup>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs text-blue-600">
                    <ShieldCheck className="w-4 h-4" />
                    <span>AI Safe Meeting Suggestions Enabled</span>
                </div>
            </Section>

            {/* Action Bar - Sticky on Mobile */}
            <div className="fixed bottom-0 inset-x-0 px-4 py-4 pb-safe bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between gap-3 max-w-4xl mx-auto shadow-2xl md:relative md:bg-transparent md:backdrop-blur-none md:border-none md:shadow-none md:p-0 md:mt-8">
                <button onClick={onBack} className="px-6 py-4 md:py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 font-bold text-base md:text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex-shrink-0">
                    ← ย้อนกลับ
                </button>
                <div className="flex gap-2 flex-1 justify-end">
                    <button onClick={() => onSaveDraft(form)} className="px-4 py-4 md:py-3 rounded-xl border-2 border-blue-300 text-blue-600 dark:text-blue-400 font-bold text-sm hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors hidden sm:block">
                        💾 Draft
                    </button>
                    <button onClick={handleSubmit} className="px-8 py-4 md:py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold shadow-xl shadow-blue-300/50 dark:shadow-purple-500/30 hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 text-base md:text-sm">
                        <span>🚀 โพสต์ประกาศ</span>
                    </button>
                </div>
            </div>

        </div>
    )
}

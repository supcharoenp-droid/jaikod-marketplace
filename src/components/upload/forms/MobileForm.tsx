'use client'

import React, { useState, useEffect } from 'react'
import {
    Smartphone, Battery, ShieldCheck, Camera,
    Wifi, CheckCircle2, AlertTriangle, ChevronRight,
    Zap, Box, MapPin, DollarSign, Sparkles,
    Cpu, Lock, Search, AlertCircle, ScanFace
} from 'lucide-react'
import Image from 'next/image'

interface MobileFormProps {
    initialData: any
    existingImages: File[]
    onBack: () => void
    onNext: (data: any) => void
    onSaveDraft: (data: any) => void
}

export default function MobileForm({
    initialData, existingImages, onBack, onNext, onSaveDraft
}: MobileFormProps) {

    // --- State ---
    const [images, setImages] = useState<File[]>(existingImages)
    const [imagePreviews, setImagePreviews] = useState<string[]>(
        existingImages.map(f => URL.createObjectURL(f))
    )
    const [aiAnalysis, setAiAnalysis] = useState<{
        modelDetected: string;
        screenCondition: string;
        bodyCondition: string;
        burnInRisk: 'Low' | 'Medium' | 'High';
        priceBenchmark: { min: number, max: number, avg: number };
    } | null>(null)

    const [form, setForm] = useState({
        // Basic Info
        brand: initialData?.brand || '',
        model: initialData?.model || '',
        storage: initialData?.storage || '128GB',
        color: initialData?.color || '',
        year: initialData?.year || '',
        battery_health: initialData?.battery_health || '',

        // Condition
        body_condition: 'good', // mint, good, fair, poor
        screen_condition: 'normal', // normal, scratched, cracked, burn_in
        buttons_condition: 'normal',
        camera_condition: 'normal',
        biometrics_condition: 'working',
        system_condition: 'normal',

        // Status / Locks
        icloud_locked: false,
        google_locked: false,
        carrier_locked: false,
        has_repairs: false,
        repair_details: '',

        // Bundle
        has_box: false,
        has_adapter: false,
        has_cable: false,
        warranty_status: 'expired', // expired, remaining
        warranty_date: '',

        // Price
        price: initialData?.price || '',

        // Location
        province: initialData?.province || 'Bangkok',
        district: initialData?.district || '',

        // Notes
        description: initialData?.description || ''
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    // --- Mock AI Analysis ---
    useEffect(() => {
        // Simulate AI analyzing the first image
        if (images.length > 0 && !aiAnalysis) {
            setTimeout(() => {
                setAiAnalysis({
                    modelDetected: 'iPhone 13 Pro',
                    screenCondition: 'Normal (No Cracks Detected)',
                    bodyCondition: 'Good (Minor scratches on bezel)',
                    burnInRisk: 'Low',
                    priceBenchmark: {
                        min: 18000,
                        max: 22000,
                        avg: 19500
                    }
                })
            }, 2000)
        }
    }, [images])

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files)
            setImages(prev => [...prev, ...files])
            const newPreviews = files.map(f => URL.createObjectURL(f))
            setImagePreviews(prev => [...prev, ...newPreviews])
        }
    }

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (images.length < 6) newErrors.images = 'Min 6 images required'
        if (!form.brand) newErrors.brand = 'Required'
        if (!form.model) newErrors.model = 'Required'
        if (!form.storage) newErrors.storage = 'Required'
        if (!form.price || Number(form.price) < 200) newErrors.price = 'Min 200 THB'
        if (form.battery_health && (Number(form.battery_health) < 50 || Number(form.battery_health) > 100)) {
            newErrors.battery_health = 'Must be 50-100%'
        }
        if (form.icloud_locked && Number(form.price) > 5000) {
            newErrors.icloud = 'Locked devices must be sold as parts (Low price)'
        }
        if (!form.province) newErrors.province = 'Required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = () => {
        if (validateForm()) {
            onNext({ ...form, images })
        } else {
            const msg = Object.values(errors)[0]
            alert(msg || 'Please fix validation errors')
        }
    }

    // --- Helper Components ---
    const Section = ({ title, icon: Icon, children, badge }: any) => (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600">
                        <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{title}</h3>
                </div>
                {badge && <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full border border-gray-200 font-bold">{badge}</span>}
            </div>
            {children}
        </div>
    )

    const InputGroup = ({ label, error, children, required, subLabel }: any) => (
        <div className="space-y-1.5">
            <div className="flex justify-between items-baseline">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
                {subLabel && <span className="text-xs text-gray-400">{subLabel}</span>}
            </div>
            {children}
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    )

    const StatusBadge = ({ active, label, icon: Icon, colorClass }: any) => (
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold ${active ? colorClass : 'bg-gray-50 border-gray-200 text-gray-400'}`}>
            <Icon className="w-4 h-4" /> {label}
        </div>
    )

    return (
        <div className="max-w-xl mx-auto space-y-6 pb-24 font-sans text-gray-900 dark:text-gray-100">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">ลงขายมือถือ</h1>
                    <p className="text-gray-500 text-sm">Mobile Phone Marketplace</p>
                </div>
                {aiAnalysis && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-200 animate-pulse">
                        <Sparkles className="w-3 h-3" /> AI Active
                    </div>
                )}
            </div>

            {/* 1. Images */}
            <Section title={`รูปสินค้า (${images.length}/15)`} icon={Camera} badge={images.length < 6 ? "Need 6+" : "OK"}>
                <div className="grid grid-cols-3 gap-3">
                    <button className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 group relative overflow-hidden">
                        <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                        <Camera className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] font-medium text-center px-1">เพิ่มรูป</span>
                    </button>
                    {imagePreviews.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200">
                            <Image src={src} fill alt="" className="object-cover" />
                            {idx === 0 && <span className="absolute top-1 left-1 bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold shadow">Front</span>}
                        </div>
                    ))}
                </div>

                {/* AI Analysis Panel */}
                {aiAnalysis && (
                    <div className="mt-4 bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700 text-xs text-gray-600 dark:text-gray-300 space-y-2">
                        <div className="flex justify-between border-b pb-2 border-gray-200 dark:border-gray-600">
                            <span>AI Model:</span>
                            <span className="font-bold text-blue-600">{aiAnalysis.modelDetected}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                            <div className="flex items-center gap-1.5"><ScanFace className="w-3 h-3 text-green-500" /> Screen: {aiAnalysis.screenCondition}</div>
                            <div className="flex items-center gap-1.5"><ShieldCheck className="w-3 h-3 text-blue-500" /> Body: {aiAnalysis.bodyCondition}</div>
                        </div>
                    </div>
                )}
                {errors.images && <p className="text-sm text-red-500 font-bold">{errors.images}</p>}
            </Section>

            {/* 2. Basic Info */}
            <Section title="ข้อมูลเครื่อง" icon={Smartphone}>
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="Brand" required error={errors.brand}>
                        <select value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <option value="">Select Brand</option>
                            <option value="Apple">Apple</option>
                            <option value="Samsung">Samsung</option>
                            <option value="Xiaomi">Xiaomi</option>
                            <option value="Oppo">Oppo</option>
                            <option value="Vivo">Vivo</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="Model" required error={errors.model}>
                        <input type="text" value={form.model} onChange={e => setForm({ ...form, model: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="e.g. iPhone 13" />
                    </InputGroup>
                    <InputGroup label="Storage" required>
                        <select value={form.storage} onChange={e => setForm({ ...form, storage: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            {['32GB', '64GB', '128GB', '256GB', '512GB', '1TB'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </InputGroup>
                    <InputGroup label="Battery (%)" error={errors.battery_health}>
                        <div className="relative">
                            <Battery className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input type="number" value={form.battery_health} onChange={e => setForm({ ...form, battery_health: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="85" />
                        </div>
                    </InputGroup>
                </div>
                <InputGroup label="Color">
                    <div className="flex gap-2 mt-2">
                        {['black', 'white', 'silver', 'gold', 'blue', 'green', 'red'].map(c => (
                            <button
                                key={c}
                                onClick={() => setForm({ ...form, color: c })}
                                className={`w-8 h-8 rounded-full border-2 transition-all ${form.color === c ? 'border-blue-500 scale-110 shadow-md' : 'border-transparent'}`}
                                style={{ backgroundColor: c }}
                            />
                        ))}
                    </div>
                </InputGroup>
            </Section>

            {/* 3. Condition Checklist */}
            <Section title="สภาพการใช้งาน" icon={ShieldCheck}>
                <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">ตัวเครื่อง (Body)</span>
                        <select value={form.body_condition} onChange={e => setForm({ ...form, body_condition: e.target.value })} className="p-1 px-2 rounded border bg-gray-50 text-right">
                            <option value="mint">สภาพนางฟ้า (ไร้รอย)</option>
                            <option value="good">สภาพดี (รอยขนแมว)</option>
                            <option value="fair">มีรอยตก/บุบ</option>
                        </select>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">หน้าจอ (Screen)</span>
                        <select value={form.screen_condition} onChange={e => setForm({ ...form, screen_condition: e.target.value })} className="p-1 px-2 rounded border bg-gray-50 text-right">
                            <option value="normal">ปกติ (Normal)</option>
                            <option value="scratched">มีรอยขีดข่วน</option>
                            <option value="cracked">กระจกแตก</option>
                            <option value="burn_in">จอเบิร์น/จุดเดด</option>
                        </select>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 dark:text-gray-400">สแกนนิ้ว/หน้า (Biometrics)</span>
                        <select value={form.biometrics_condition} onChange={e => setForm({ ...form, biometrics_condition: e.target.value })} className="p-1 px-2 rounded border bg-gray-50 text-right">
                            <option value="working">ใช้งานได้ปกติ</option>
                            <option value="not_working">เสีย/ใช้ไม่ได้</option>
                        </select>
                    </div>
                </div>
            </Section>

            {/* 4. Locks & Status */}
            <Section title="สถานะล็อค & ประวัติ" icon={Lock}>
                <div className="grid grid-cols-2 gap-3">
                    <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer border-dashed transition-colors ${form.icloud_locked ? 'bg-red-50 border-red-300 text-red-600 font-bold' : 'bg-white border-gray-200 text-gray-500'}`}>
                        <input type="checkbox" className="hidden" checked={form.icloud_locked} onChange={e => setForm({ ...form, icloud_locked: e.target.checked })} />
                        <Lock className="w-4 h-4" /> iCloud Locked
                    </label>
                    <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${form.carrier_locked ? 'bg-orange-50 border-orange-300 text-orange-600 font-bold' : 'bg-white border-gray-200 text-gray-500'}`}>
                        <input type="checkbox" className="hidden" checked={form.carrier_locked} onChange={e => setForm({ ...form, carrier_locked: e.target.checked })} />
                        <Wifi className="w-4 h-4" /> ติดซิม / รายเดือน
                    </label>
                    <label className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${!form.has_repairs ? 'bg-green-50 border-green-300 text-green-600 font-bold' : 'bg-white border-gray-200 text-gray-500'}`}>
                        <input type="checkbox" className="hidden" checked={!form.has_repairs} onChange={e => setForm({ ...form, has_repairs: !e.target.checked })} />
                        <CheckCircle2 className="w-4 h-4" /> เครื่องเดิม ไม่เคยแกะ
                    </label>
                </div>
                {form.icloud_locked && <p className="text-xs text-red-500 font-medium">* เครื่องติดไอคลาวด์ ต้องขายเป็นอะไหล่เท่านั้น</p>}
            </Section>

            {/* 5. Pricing */}
            <Section title="ราคาขาย" icon={DollarSign}>
                <InputGroup label="ตั้งราคาขาย (บาท)" required error={errors.price}>
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-900 font-bold text-lg">฿</span>
                            <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full pl-8 py-3 text-2xl font-bold rounded-lg border border-gray-200 bg-gray-50" placeholder="0" />
                        </div>
                        {aiAnalysis ? (
                            <div className="flex flex-col justify-center gap-1 text-xs">
                                <span className="text-gray-500">ราคาตลาด (AI)</span>
                                <span className="text-green-600 font-bold">฿{aiAnalysis.priceBenchmark.avg.toLocaleString()}</span>
                                <span className="text-gray-400 text-[10px]">{aiAnalysis.priceBenchmark.min.toLocaleString()} - {aiAnalysis.priceBenchmark.max.toLocaleString()}</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-xs text-gray-400 animate-pulse">กำลังประเมิน...</div>
                        )}
                    </div>
                </InputGroup>
            </Section>

            {/* Action Bar */}
            <div className="fixed bottom-0 inset-x-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50 flex items-center justify-between gap-4 max-w-xl mx-auto md:relative md:bg-transparent md:border-none md:p-0 md:mt-8">
                <button onClick={onBack} className="px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors">
                    Back
                </button>
                <div className="flex gap-2 flex-1 justify-end">
                    <button onClick={() => onSaveDraft(form)} className="px-4 py-3 rounded-xl border border-blue-200 text-blue-600 font-bold text-sm hover:bg-blue-50 transition-colors hidden sm:block">
                        Draft
                    </button>
                    <button onClick={handleSubmit} className="px-6 py-3 rounded-xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-colors flex items-center gap-2 text-sm">
                        <span>Publish</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

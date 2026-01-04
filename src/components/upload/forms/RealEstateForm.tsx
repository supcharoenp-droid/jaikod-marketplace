'use client'

import React, { useState, useEffect } from 'react'
import {
    Home, Building, MapPin, DollarSign, Camera,
    CheckCircle2, AlertTriangle, ChevronRight,
    Ruler, Bed, Bath, Layers, Car, Trees,
    Droplets, Zap, FileText, ShieldCheck, ArrowUpRight,
    Search, Map, Sparkles, Navigation
} from 'lucide-react'
import Image from 'next/image'

interface RealEstateFormProps {
    initialData: any
    existingImages: File[]
    onBack: () => void
    onNext: (data: any) => void
    onSaveDraft: (data: any) => void
}

export default function RealEstateForm({
    initialData, existingImages, onBack, onNext, onSaveDraft
}: RealEstateFormProps) {

    // --- State ---
    const [images, setImages] = useState<File[]>(existingImages)
    const [imagePreviews, setImagePreviews] = useState<string[]>(
        existingImages.map(f => URL.createObjectURL(f))
    )
    const [aiAnalysis, setAiAnalysis] = useState<{
        structureScore: number;
        detectedIssues: string[];
        floodRisk: string;
        priceBenchmark: { min: number, max: number, avg: number, perSqm: number };
        suggestedPhotos: string[];
    } | null>(null)

    const [form, setForm] = useState({
        // Type
        property_type: initialData?.property_type || 'condo', // house, townhome, condo, land, commercial
        listing_type: initialData?.listing_type || 'sale', // sale, rent

        // Location
        province: initialData?.province || 'Bangkok',
        district: initialData?.district || '',
        subdistrict: initialData?.subdistrict || '',
        map_lat: null,
        map_lng: null,

        // Details
        project_name: initialData?.project_name || '',
        land_size: initialData?.land_size || '', // sq.wah
        floor_area: initialData?.floor_area || '', // sq.m
        bedrooms: initialData?.bedrooms || '',
        bathrooms: initialData?.bathrooms || '',
        floors: initialData?.floors || '',
        parking_spots: initialData?.parking_spots || '',

        // Condo Specific
        floor_number: initialData?.floor_number || '',

        // Land Specific
        width: initialData?.width || '',
        depth: initialData?.depth || '',
        city_plan_color: initialData?.city_plan_color || 'yellow', // yellow, orange, red, etc.
        water_access: true,
        electric_access: true,

        // Pricing
        price: initialData?.price || '', // or rent price
        common_fee: initialData?.common_fee || '',

        // Amenities
        near_mrt: false,
        near_bts: false,
        near_mall: false,
        near_hospital: false,

        // Condition
        condition: 'ready', // ready, needs_renovation, new
        repairs_needed: '',

        // Deed
        deed_type: 'chanote', // chanote, nor_sor_3
        deed_number: '',
        transfer_ready: true
    })

    const [errors, setErrors] = useState<Record<string, string>>({})

    // --- Mock AI Operations ---
    useEffect(() => {
        setTimeout(() => {
            setAiAnalysis({
                structureScore: 88,
                detectedIssues: ['Minor wall crack in Bedroom 2', 'Paint peeling on exterior'],
                floodRisk: 'Low (Safe Zone)',
                priceBenchmark: {
                    min: 2500000,
                    max: 2900000,
                    avg: 2750000,
                    perSqm: 85000
                },
                suggestedPhotos: ['Bathroom', 'Kitchen', 'View from balcony']
            })
        }, 1500)
    }, [])

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

        if (images.length < 8) newErrors.images = 'Min 8 images required'
        if (!form.price || Number(form.price) < 10000) newErrors.price = 'Min 10,000 THB'
        if (!form.province) newErrors.province = 'Required'
        if (!form.district) newErrors.district = 'Required'

        if (['house', 'townhome', 'condo', 'commercial'].includes(form.property_type)) {
            if (!form.floor_area || Number(form.floor_area) < 10) newErrors.floor_area = 'Min 10 sq.m'
        }

        if (form.property_type === 'land') {
            if (!form.width || !form.depth) newErrors.land_dim = 'Width & Depth required'
        }

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
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg text-indigo-600">
                        <Icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100">{title}</h3>
                </div>
                {badge && <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full border border-green-200 font-bold">{badge}</span>}
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

    return (
        <div className="max-w-5xl mx-auto space-y-6 pb-24 font-sans text-gray-900 dark:text-gray-100">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">ลงประกาศอสังหาริมทรัพย์</h1>
                    <p className="text-gray-500 text-sm">Professional Real Estate Listing</p>
                </div>
                {aiAnalysis && (
                    <div className="flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-200 animate-pulse">
                        <Sparkles className="w-3 h-3" /> AI Analysis Ready
                    </div>
                )}
            </div>

            {/* 1. Images */}
            <Section title={`รูปภาพ (${images.length}/30)`} icon={Camera} badge={images.length < 8 ? "Need 8+" : "Good"}>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    <button className="aspect-square rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-400 group relative overflow-hidden">
                        <input type="file" multiple accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleImageUpload} />
                        <Camera className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-medium text-center px-2">เพิ่มรูป (Min 8)</span>
                    </button>
                    {imagePreviews.map((src, idx) => (
                        <div key={idx} className="relative aspect-square rounded-xl overflow-hidden shadow-sm border border-gray-200">
                            <Image src={src} fill alt="" className="object-cover" />
                            {idx === 0 && <span className="absolute top-1 left-1 bg-indigo-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Main</span>}
                        </div>
                    ))}
                </div>

                {/* AI Image Analysis Panel */}
                {aiAnalysis && (
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-100 dark:border-gray-700">
                            <h4 className="text-xs font-bold text-gray-500 uppercase mb-2">AI Condition Check</h4>
                            <div className="space-y-2">
                                {aiAnalysis.detectedIssues.map((issue, i) => (
                                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                                        <AlertTriangle className="w-3 h-3 text-orange-500 mt-0.5" />
                                        <span>{issue}</span>
                                    </div>
                                ))}
                                {aiAnalysis.detectedIssues.length === 0 && <div className="text-green-600 text-xs flex items-center gap-2"><CheckCircle2 className="w-3 h-3" /> No issues detected</div>}
                            </div>
                        </div>
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/50">
                            <h4 className="text-xs font-bold text-blue-600 uppercase mb-2">Photo Suggestions</h4>
                            <div className="flex flex-wrap gap-2">
                                {aiAnalysis.suggestedPhotos.map((s, i) => (
                                    <span key={i} className="text-xs bg-white dark:bg-blue-900 text-blue-600 px-2 py-1 rounded border border-blue-200 dark:border-blue-800">
                                        + {s}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
                {errors.images && <p className="text-sm text-red-500 font-bold">{errors.images}</p>}
            </Section>

            {/* 2. Property Type */}
            <Section title="ข้อมูลประเภททรัพย์" icon={Building}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputGroup label="ประเภทประกาศ (Listing Type)" required>
                        <div className="flex p-1 bg-gray-100 dark:bg-gray-900 rounded-lg">
                            <button onClick={() => setForm({ ...form, listing_type: 'sale' })} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${form.listing_type === 'sale' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}>ขาย (Sale)</button>
                            <button onClick={() => setForm({ ...form, listing_type: 'rent' })} className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${form.listing_type === 'rent' ? 'bg-white shadow text-indigo-600' : 'text-gray-500'}`}>เช่า (Rent)</button>
                        </div>
                    </InputGroup>

                    <InputGroup label="ประเภททรัพย์ (Property Type)" required>
                        <select value={form.property_type} onChange={e => setForm({ ...form, property_type: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <option value="condo">คอนโดมิเนียม (Condo)</option>
                            <option value="house">บ้านเดี่ยว (House)</option>
                            <option value="townhome">ทาวน์โฮม (Townhome)</option>
                            <option value="land">ที่ดิน (Land)</option>
                            <option value="commercial">อาคารพาณิชย์ (Commercial)</option>
                        </select>
                    </InputGroup>

                    <div className="md:col-span-2">
                        <InputGroup label="ชื่อโครงการ / หมู่บ้าน" subLabel="ถ้ามี">
                            <input type="text" value={form.project_name} onChange={e => setForm({ ...form, project_name: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="e.g. Supalai Premier..." />
                        </InputGroup>
                    </div>
                </div>
            </Section>

            {/* 3. Location */}
            <Section title="ทำเลที่ตั้ง" icon={MapPin}>
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label="จังหวัด" required error={errors.province}>
                        <select value={form.province} onChange={e => setForm({ ...form, province: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <option>Bangkok</option>
                            <option>Nonthaburi</option>
                            <option>Pathum Thani</option>
                            <option>Phuket</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="เขต/อำเภอ" required error={errors.district}>
                        <input type="text" value={form.district} onChange={e => setForm({ ...form, district: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="District" />
                    </InputGroup>
                </div>

                {/* AI Location Analysis */}
                {aiAnalysis && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-full text-green-600"><Navigation className="w-5 h-5" /></div>
                            <div>
                                <h4 className="text-sm font-bold text-green-900 dark:text-green-100">Location Score: 9.2/10</h4>
                                <p className="text-xs text-green-700 dark:text-green-300">High demand area, Near MRT (500m), Safe from flood</p>
                            </div>
                        </div>
                        <div className="text-right text-xs">
                            <div className="font-bold text-gray-500">Flood Risk</div>
                            <div className="text-green-600 font-bold">{aiAnalysis.floodRisk}</div>
                        </div>
                    </div>
                )}
            </Section>

            {/* 4. Details (Dynamic) */}
            <Section title="รายละเอียดทรัพย์" icon={Layers}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {/* Common Size */}
                    {['house', 'townhome', 'land'].includes(form.property_type) && (
                        <InputGroup label="ขนาดที่ดิน" subLabel="ตร.ว. (Sq.wah)">
                            <input type="number" value={form.land_size} onChange={e => setForm({ ...form, land_size: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
                        </InputGroup>
                    )}
                    {['house', 'townhome', 'condo', 'commercial'].includes(form.property_type) && (
                        <InputGroup label="พื้นที่ใช้สอย" subLabel="ตร.ม. (Sq.m)" required error={errors.floor_area}>
                            <input type="number" value={form.floor_area} onChange={e => setForm({ ...form, floor_area: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
                        </InputGroup>
                    )}

                    {/* Rooms */}
                    {['house', 'townhome', 'condo'].includes(form.property_type) && (
                        <>
                            <InputGroup label="ห้องนอน">
                                <div className="relative">
                                    <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="number" value={form.bedrooms} onChange={e => setForm({ ...form, bedrooms: e.target.value })} className="w-full pl-9 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
                                </div>
                            </InputGroup>
                            <InputGroup label="ห้องน้ำ">
                                <div className="relative">
                                    <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input type="number" value={form.bathrooms} onChange={e => setForm({ ...form, bathrooms: e.target.value })} className="w-full pl-9 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
                                </div>
                            </InputGroup>
                        </>
                    )}

                    {/* Additional */}
                    {['house', 'townhome'].includes(form.property_type) && (
                        <InputGroup label="ที่จอดรถ (คัน)">
                            <input type="number" value={form.parking_spots} onChange={e => setForm({ ...form, parking_spots: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
                        </InputGroup>
                    )}

                    {form.property_type === 'condo' && (
                        <InputGroup label="ชั้นที่">
                            <input type="number" value={form.floor_number} onChange={e => setForm({ ...form, floor_number: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
                        </InputGroup>
                    )}
                </div>

                {/* Land Specific */}
                {form.property_type === 'land' && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <InputGroup label="หน้ากว้าง (ม.)" required error={errors.land_dim}>
                            <input type="number" value={form.width} onChange={e => setForm({ ...form, width: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
                        </InputGroup>
                        <InputGroup label="ความลึก (ม.)">
                            <input type="number" value={form.depth} onChange={e => setForm({ ...form, depth: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
                        </InputGroup>
                        <InputGroup label="ผังเมือง (City Plan)">
                            <select value={form.city_plan_color} onChange={e => setForm({ ...form, city_plan_color: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                                <option value="yellow">เหลือง (Yellow)</option>
                                <option value="orange">ส้ม (Orange)</option>
                                <option value="red">แดง (Red)</option>
                                <option value="purple">ม่วง (Industrial)</option>
                            </select>
                        </InputGroup>
                        <div className="flex flex-col justify-end pb-2 gap-2">
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input type="checkbox" checked={form.water_access} onChange={e => setForm({ ...form, water_access: e.target.checked })} className="rounded text-indigo-600" />
                                <Droplets className="w-4 h-4 text-blue-500" /> น้ำประปาเข้าถึง
                            </label>
                            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                                <input type="checkbox" checked={form.electric_access} onChange={e => setForm({ ...form, electric_access: e.target.checked })} className="rounded text-indigo-600" />
                                <Zap className="w-4 h-4 text-yellow-500" /> ไฟฟ้าเข้าถึง
                            </label>
                        </div>
                    </div>
                )}
            </Section>

            {/* 5. Pricing & Benchmark */}
            <Section title="ราคา" icon={DollarSign}>
                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-4">
                        <InputGroup label={form.listing_type === 'sale' ? "ราคาขาย (บาท)" : "ราคาเช่า (บาท/เดือน)"} required error={errors.price}>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">฿</span>
                                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} className="w-full pl-8 py-3 text-2xl font-bold rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="0.00" />
                            </div>
                        </InputGroup>
                        {form.property_type === 'condo' && (
                            <InputGroup label="ค่าส่วนกลาง (บาท/ปี)">
                                <input type="number" value={form.common_fee} onChange={e => setForm({ ...form, common_fee: e.target.value })} className="w-full p-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" />
                            </InputGroup>
                        )}
                    </div>

                    {/* AI Price Benchmark */}
                    <div className="flex-1 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 p-5 rounded-2xl border border-indigo-100 dark:border-indigo-800">
                        {aiAnalysis ? (
                            <>
                                <div className="flex items-center gap-2 mb-3 text-indigo-800 dark:text-indigo-300">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="font-bold text-sm uppercase tracking-wide">AI Price Analysis</span>
                                </div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-gray-500 text-sm">ราคาประเมินตลาด</span>
                                    <span className="text-xl font-bold text-indigo-700 dark:text-indigo-300">฿{aiAnalysis.priceBenchmark.avg.toLocaleString()}</span>
                                </div>
                                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden relative mb-2">
                                    <div className="absolute top-0 bottom-0 bg-green-400 opacity-50" style={{ left: '25%', width: '50%' }} />
                                    <div className="absolute top-0 bottom-0 w-1 bg-black h-full shadow" style={{ left: '50%' }} />
                                </div>
                                <div className="flex justify-between text-xs text-gray-400">
                                    <span>Low: ฿{Math.floor(aiAnalysis.priceBenchmark.min / 1000)}k</span>
                                    <span>High: ฿{Math.floor(aiAnalysis.priceBenchmark.max / 1000)}k</span>
                                </div>
                                <div className="mt-4 pt-4 border-t border-indigo-100/50 flex justify-between text-xs font-medium text-indigo-600">
                                    <span>Avg Price/Sqm:</span>
                                    <span>฿{aiAnalysis.priceBenchmark.perSqm.toLocaleString()}/m²</span>
                                </div>
                            </>
                        ) : (
                            <div className="h-full flex items-center justify-center text-indigo-400 text-sm animate-pulse">Analyzing Market Data...</div>
                        )}
                    </div>
                </div>
            </Section>

            {/* 8. Deed & Legal */}
            <Section title="เอกสารสิทธิ์" icon={FileText}>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-end">
                    <InputGroup label="ประเภทโฉนด">
                        <select value={form.deed_type} onChange={e => setForm({ ...form, deed_type: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <option value="chanote">โฉนด (น.ส.4)</option>
                            <option value="nor_sor_3">น.ส.3 ก.</option>
                        </select>
                    </InputGroup>
                    <InputGroup label="เลขที่โฉนด (Deed No.)">
                        <input type="text" value={form.deed_number} onChange={e => setForm({ ...form, deed_number: e.target.value })} className="w-full p-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900" placeholder="XXXXXX" />
                    </InputGroup>
                    <div className="flex items-center h-10">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${form.transfer_ready ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                                {form.transfer_ready && <CheckCircle2 className="w-3 h-3 text-white" />}
                            </div>
                            <input type="checkbox" className="hidden" checked={form.transfer_ready} onChange={e => setForm({ ...form, transfer_ready: e.target.checked })} />
                            <span className="text-sm font-medium">พร้อมโอนกรรมสิทธิ์</span>
                        </label>
                    </div>
                </div>
            </Section>

            {/* Action Bar */}
            <div className="fixed bottom-0 inset-x-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50 flex items-center justify-between gap-4 max-w-5xl mx-auto md:relative md:bg-transparent md:border-none md:p-0 md:mt-8">
                <button onClick={onBack} className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    Back
                </button>
                <div className="flex gap-2 flex-1 justify-end">
                    <button onClick={() => onSaveDraft(form)} className="px-6 py-3 rounded-xl border border-indigo-200 text-indigo-600 font-bold hover:bg-indigo-50 transition-colors hidden sm:block">
                        Save Draft
                    </button>
                    <button onClick={handleSubmit} className="px-8 py-3 rounded-xl bg-indigo-600 text-white font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors flex items-center gap-2">
                        <span>Publish Listing</span>
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

        </div>
    )
}

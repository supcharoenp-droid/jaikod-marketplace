'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Store, MapPin, CheckCircle, Loader2 } from 'lucide-react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import AddressSelector from '@/components/ui/AddressSelector'
import { useAuth } from '@/contexts/AuthContext'
import { createSellerProfile, checkShopNameAvailability } from '@/lib/seller'

export default function SellerRegisterPage() {
    const { user } = useAuth()
    const router = useRouter()

    // State
    const [step, setStep] = useState(1) // 1: Info, 2: Address, 3: Success
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        shop_name: '',
        shop_description: '',
        address: {
            province: '',
            amphoe: '',
            district: '',
            zipcode: '',
            detail: ''
        }
    })
    const [errors, setErrors] = useState<any>({})

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
        // Clear error when typing
        if (errors[e.target.name]) {
            setErrors((prev: any) => ({ ...prev, [e.target.name]: null }))
        }
    }

    const handleNext = async () => {
        if (step === 1) {
            // Validate Store Info
            if (!formData.shop_name.trim()) {
                setErrors({ shop_name: 'กรุณาระบุชื่อร้านค้า' })
                return
            }
            if (!formData.shop_description.trim()) {
                setErrors({ shop_description: 'กรุณาระบุรายละเอียดร้านค้า' })
                return
            }

            // Check availability
            setIsLoading(true)
            const isAvailable = await checkShopNameAvailability(formData.shop_name)
            setIsLoading(false)

            if (!isAvailable) {
                setErrors({ shop_name: 'ชื่อร้านนี้มีผู้ใช้งานแล้ว' })
                return
            }

            setStep(2)
        } else if (step === 2) {
            // Validate Address
            if (!formData.address.province || !formData.address.amphoe) {
                setErrors({ address: 'กรุณาระบุที่อยู่ให้ครบถ้วน' })
                return
            }

            // Submit
            await handleSubmit()
        }
    }

    const handleSubmit = async () => {
        if (!user) return

        setIsLoading(true)
        try {
            await createSellerProfile(user.uid, {
                shop_name: formData.shop_name,
                shop_description: formData.shop_description,
                address: formData.address
            })
            setStep(3)
        } catch (error) {
            console.error('Registration failed:', error)
            setErrors({ submit: 'เกิดข้อผิดพลาด กรุณาลองใหม่' })
        } finally {
            setIsLoading(false)
        }
    }

    // Step 3: Success View
    if (step === 3) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-bg-dark flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white dark:bg-surface-dark rounded-2xl shadow-xl p-8 text-center animate-fade-in-up">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                            ยินดีต้อนรับสู่ JaiKod Seller Center!
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">
                            ร้านค้าของคุณถูกสร้างเรียบร้อยแล้ว เริ่มต้นลงขายสินค้าชิ้นแรกของคุณได้เลย
                        </p>
                        <div className="space-y-3">
                            <Button
                                variant="primary"
                                className="w-full justify-center h-12 text-lg shadow-lg shadow-neon-purple/20"
                                onClick={() => router.push('/seller')}
                            >
                                ไปที่แดชบอร์ดผู้ขาย
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-center"
                                onClick={() => router.push('/')}
                            >
                                กลับไปหน้าหลัก
                            </Button>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg-dark flex flex-col">
            <Header />
            <main className="flex-1 py-12 container mx-auto px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Progress Bar */}
                    <div className="flex items-center justify-center mb-10">
                        <div className="flex items-center w-full max-w-sm relative">
                            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 absolute top-1/2 -translate-y-1/2 z-0"></div>
                            <div
                                className={`w-1/2 h-1 bg-neon-purple absolute top-1/2 -translate-y-1/2 z-0 transition-all duration-300 ${step === 2 ? 'w-full' : 'w-0'}`}
                            ></div>

                            <div className="relative z-10 flex justify-between w-full">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-neon-purple text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-neon-purple text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                        <div className="text-center mb-8">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                {step === 1 ? 'ข้อมูลร้านค้า' : 'ที่อยู่ร้านค้า'}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                {step === 1 ? 'ตั้งชื่อร้านให้โดนใจ เพื่อดึงดูดลูกค้า' : 'ระบุที่อยู่สำหรับรับ/ส่งสินค้า'}
                            </p>
                        </div>

                        {/* Step 1: Shop Info */}
                        {step === 1 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">ชื่อร้านค้า <span className="text-red-500">*</span></label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Store className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="shop_name"
                                            value={formData.shop_name}
                                            onChange={handleChange}
                                            className={`w-full pl-10 pr-4 py-3 rounded-xl border ${errors.shop_name ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-neon-purple'}  bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:ring-0 transition-all`}
                                            placeholder="ตัวอย่าง: JaiKod Official Store"
                                        />
                                    </div>
                                    {errors.shop_name && <p className="text-red-500 text-sm mt-1">{errors.shop_name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">เกี่ยวกับร้านค้า <span className="text-red-500">*</span></label>
                                    <textarea
                                        name="shop_description"
                                        value={formData.shop_description}
                                        onChange={handleChange}
                                        rows={4}
                                        className={`w-full p-4 rounded-xl border ${errors.shop_description ? 'border-red-500' : 'border-gray-200'} bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:border-neon-purple transition-all resize-none`}
                                        placeholder="อธิบายสินค้าที่คุณขาย จุดเด่น หรือนโยบายสั้นๆ..."
                                    />
                                    {errors.shop_description && <p className="text-red-500 text-sm mt-1">{errors.shop_description}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Address */}
                        {step === 2 && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium mb-1">ที่ตั้งร้านค้า <span className="text-red-500">*</span></label>
                                    <AddressSelector
                                        initialValues={{
                                            province: formData.address.province,
                                            amphoe: formData.address.amphoe,
                                            district: formData.address.district,
                                            zipcode: formData.address.zipcode
                                        }}
                                        onAddressChange={(addr) => setFormData(prev => ({
                                            ...prev,
                                            address: {
                                                ...prev.address,
                                                ...addr
                                            }
                                        }))}
                                    />
                                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">รายละเอียดเพิ่มเติม (บ้านเลขที่, ซอย, ถนน)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="detail"
                                            value={formData.address.detail}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, detail: e.target.value } }))}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50 dark:bg-gray-800/50 focus:outline-none focus:border-neon-purple transition-all"
                                            placeholder="เช่น 123/4 หมู่ 5 ถ.วิภาวดีรังสิต"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="mt-8 flex gap-3">
                            {step === 2 && (
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setStep(1)}
                                    disabled={isLoading}
                                >
                                    ย้อนกลับ
                                </Button>
                            )}
                            <Button
                                variant="primary"
                                className="flex-1 shadow-lg shadow-neon-purple/20"
                                onClick={handleNext}
                                isLoading={isLoading}
                                disabled={isLoading}
                            >
                                {step === 1 ? 'ถัดไป' : 'ยืนยันการเปิดร้าน'}
                            </Button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

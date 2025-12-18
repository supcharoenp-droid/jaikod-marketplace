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
import { createProduct } from '@/lib/products'
import StoreNameStep from '@/components/seller/onboarding/StoreNameStep'
import LogoCreatorStep from '@/components/seller/onboarding/LogoCreatorStep'
import DescriptionStep from '@/components/seller/onboarding/DescriptionStep'
import VerificationStep from '@/components/seller/onboarding/VerificationStep'
import FirstProductStep from '@/components/seller/onboarding/FirstProductStep'
import PricingStep from '@/components/seller/onboarding/PricingStep'
import LaunchShopStep from '@/components/seller/onboarding/LaunchShopStep'

export default function SellerRegisterPage() {
    const { user, storeStatus, refreshProfile } = useAuth()
    const router = useRouter()

    // State
    const [step, setStep] = useState(1) // 1: Info, 2: Logo, 3: Desc, 4: Verify, 5: Product, 6: Pricing, 7: Address, 8: Launch, 9: Success
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        shop_name: '',
        shop_description: '',
        shop_description_th: '',
        shop_description_en: '',
        shop_logo: '',
        is_verified: false,
        first_product: null as any,
        address: {
            province: '',
            amphoe: '',
            district: '',
            zipcode: '',
            detail: ''
        }
    })
    const [errors, setErrors] = useState<any>({})

    // Redirect if already has store
    React.useEffect(() => {
        if (storeStatus.hasStore) {
            router.push('/seller')
        }
    }, [storeStatus.hasStore, router])

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
        if (step === 7) {
            // Validate Address
            if (!formData.address.province || !formData.address.amphoe) {
                setErrors({ address: 'กรุณาระบุที่อยู่ให้ครบถ้วน' })
                return
            }

            // Move to Launch Review Step
            setStep(8)
        }
    }

    const handleSubmit = async () => {
        if (!user) return

        setIsLoading(true)
        try {
            // 1. Create Seller Profile
            await createSellerProfile(user.uid, {
                shop_name: formData.shop_name,
                shop_description: formData.shop_description_th || formData.shop_description_en || formData.shop_description,
                shop_description_th: formData.shop_description_th,
                shop_description_en: formData.shop_description_en,
                shop_logo: formData.shop_logo, // Send logo
                is_verified: formData.is_verified,
                address: formData.address
            })

            // 2. Create First Product (if any)
            if (formData.first_product) {
                try {
                    const p = formData.first_product;
                    await createProduct({
                        title: p.name,
                        price: p.price,
                        category_id: p.category,
                        description: p.descriptionTh || p.descriptionEn, // Main desc
                        description_th: p.descriptionTh,
                        description_en: p.descriptionEn,
                        images: p.images,
                        price_type: 'fixed',
                        condition: 'used', // Default for first listing
                        stock: 1,
                        can_ship: true,
                        can_pickup: false,
                        // Address from shop
                        province: formData.address.province,
                        amphoe: formData.address.amphoe,
                        district: formData.address.district,
                        zipcode: formData.address.zipcode
                    }, user.uid, formData.shop_name, formData.shop_logo)
                } catch (err) {
                    console.error('Failed to create first product:', err)
                    // Don't block success
                }
            }

            await refreshProfile() // Update Global State
            setStep(9)
        } catch (error) {
            console.error('Registration failed:', error)
            setErrors({ submit: 'เกิดข้อผิดพลาด กรุณาลองใหม่' })
        } finally {
            setIsLoading(false)
        }
    }

    // Step 9: Success View
    if (step === 9) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-bg-dark flex flex-col">
                <Header />
                <main className="flex-1 flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white dark:bg-surface-dark rounded-2xl shadow-xl p-8 text-center animate-fade-in-up">
                        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6 relative">
                            {formData.shop_logo ? (
                                <img src={formData.shop_logo} alt="Shop Logo" className="w-full h-full object-cover rounded-full" />
                            ) : (
                                <CheckCircle className="w-10 h-10 text-green-500" />
                            )}
                            <div className="absolute -bottom-2 -right-2 bg-green-500 text-white p-2 rounded-full border-4 border-white dark:border-surface-dark">
                                <CheckCircle className="w-4 h-4" />
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
                            ยินดีต้อนรับสู่ {formData.shop_name}!
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mb-8">
                            ร้านค้าของคุณถูกสร้างเรียบร้อยแล้ว {formData.is_verified && <span className="text-green-500 font-bold">(ยืนยันตัวตนแล้ว)</span>}
                            {formData.first_product && <div>พร้อมลงขายสินค้าชิ้นแรกของคุณ: <span className="text-neon-purple font-semibold">{formData.first_product.name}</span></div>}
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
                    {/* Progress Bar (Manual for 7 steps + success) */}
                    <div className="flex items-center justify-center mb-10">
                        <div className="flex items-center w-full max-w-sm relative">
                            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 absolute top-1/2 -translate-y-1/2 z-0"></div>

                            {/* Dynamic Width for 8 steps */}
                            <div
                                className={`h-1 bg-neon-purple absolute top-1/2 -translate-y-1/2 z-0 transition-all duration-300 ${step === 1 ? 'w-0' : step === 2 ? 'w-1/7' : step === 3 ? 'w-2/7' : step === 4 ? 'w-3/7' : step === 5 ? 'w-4/7' : step === 6 ? 'w-5/7' : step === 7 ? 'w-6/7' : 'w-full'
                                    }`}
                            ></div>

                            <div className="relative z-10 flex justify-between w-full">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 1 ? 'bg-neon-purple text-white' : 'bg-gray-200 text-gray-500'}`}>1</div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 2 ? 'bg-neon-purple text-white' : 'bg-gray-200 text-gray-500'}`}>2</div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 3 ? 'bg-neon-purple text-white' : 'bg-gray-200 text-gray-500'}`}>3</div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 4 ? 'bg-neon-purple text-white' : 'bg-gray-200 text-gray-500'}`}>4</div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 5 ? 'bg-neon-purple text-white' : 'bg-gray-200 text-gray-500'}`}>5</div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 6 ? 'bg-neon-purple text-white' : 'bg-gray-200 text-gray-500'}`}>6</div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 7 ? 'bg-neon-purple text-white' : 'bg-gray-200 text-gray-500'}`}>7</div>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${step >= 8 ? 'bg-neon-purple text-white' : 'bg-gray-200 text-gray-500'}`}>8</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 p-8">
                        {/* Title Section (Dynamic) */}
                        {step !== 2 && ( // Logo step has own header
                            <div className="text-center mb-8">
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                    {step === 1 ? 'ข้อมูลร้านค้า' :
                                        step === 3 ? 'คำอธิบายร้านค้า' :
                                            step === 4 ? 'ยืนยันตัวตน' :
                                                step === 5 ? 'สินค้าชิ้นแรก' :
                                                    step === 6 ? 'วิเคราะห์ราคา' :
                                                        step === 8 ? 'ตรวจสอบข้อมูลก่อนเปิดร้าน' :
                                                            'ที่อยู่ร้านค้า'}
                                </h1>
                                <p className="text-gray-500 text-sm">
                                    {step === 1 ? 'ตั้งชื่อร้านให้โดนใจ เพื่อดึงดูดลูกค้า' :
                                        step === 3 ? 'บอกเล่าเรื่องราวเกี่ยวกับร้านของคุณ' :
                                            step === 4 ? 'เพิ่มความน่าเชื่อถือให้กับร้านของคุณ' :
                                                step === 5 ? 'เริ่มต้นขายได้ทันทีด้วย AI' :
                                                    step === 6 ? 'ตั้งราคาให้เหมาะสม ด้วยข้อมูลตลาดจริง' :
                                                        step === 8 ? 'ตรวจสอบข้อมูลก่อนเปิดร้าน' :
                                                            'ระบุที่อยู่สำหรับรับ/ส่งสินค้า'}
                                </p>
                            </div>
                        )}

                        {/* Step 1: Shop Info */}
                        {step === 1 && (
                            <StoreNameStep
                                initialName={formData.shop_name}
                                initialDescription={formData.shop_description}
                                onComplete={(name, desc) => {
                                    setFormData(prev => ({ ...prev, shop_name: name, shop_description: desc }))
                                    setStep(2)
                                }}
                            />
                        )}

                        {/* Step 2: Logo Creator */}
                        {step === 2 && (
                            <LogoCreatorStep
                                shopName={formData.shop_name}
                                initialLogo={formData.shop_logo}
                                onComplete={(url: string) => {
                                    setFormData(prev => ({ ...prev, shop_logo: url }))
                                    setStep(3)
                                }}
                                onBack={() => setStep(1)}
                            />
                        )}

                        {/* Step 3: Description Creator */}
                        {step === 3 && (
                            <DescriptionStep
                                shopName={formData.shop_name}
                                initialDescriptionTh={formData.shop_description_th}
                                initialDescriptionEn={formData.shop_description_en}
                                onComplete={(th, en) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        shop_description_th: th,
                                        shop_description_en: en
                                    }))
                                    setStep(4)
                                }}
                                onBack={() => setStep(2)}
                            />
                        )}

                        {/* Step 4: Identity Verification */}
                        {step === 4 && (
                            <VerificationStep
                                onComplete={(result) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        is_verified: true
                                    }))
                                    setStep(5)
                                }}
                            />
                        )}

                        {/* Step 5: First Product */}
                        {step === 5 && (
                            <FirstProductStep
                                onComplete={(productData) => {
                                    setFormData(prev => ({ ...prev, first_product: productData }))
                                    setStep(6)
                                }}
                                onBack={() => setStep(4)}
                                onSkip={() => setStep(7)} // Skip to address
                            />
                        )}

                        {/* Step 6: Pricing (New) */}
                        {step === 6 && (
                            <PricingStep
                                productName={formData.first_product?.name || ''}
                                category={formData.first_product?.category || ''}
                                initialPrice={formData.first_product?.price}
                                onComplete={(price) => {
                                    setFormData(prev => ({
                                        ...prev,
                                        first_product: {
                                            ...prev.first_product,
                                            price: price
                                        }
                                    }))
                                    setStep(7)
                                }}
                                onBack={() => setStep(5)}
                            />
                        )}

                        {/* Step 7: Address */}
                        {step === 7 && (
                            <div className="space-y-6 animate-fade-in-up">
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

                                {/* Actions for Step 7 */}
                                <div className="mt-8 flex gap-3">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => {
                                            if (formData.first_product) {
                                                setStep(6)
                                            } else {
                                                setStep(5)
                                            }
                                        }}
                                        disabled={isLoading}
                                    >
                                        ย้อนกลับ
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="flex-1 shadow-lg shadow-neon-purple/20"
                                        onClick={handleNext}
                                        isLoading={isLoading}
                                        disabled={isLoading}
                                    >
                                        ตรวจสอบข้อมูล
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Step 8: Launch Shop (New) */}
                        {step === 8 && (
                            <LaunchShopStep
                                formData={formData}
                                onConfirm={handleSubmit}
                                onBack={() => setStep(7)}
                                isLoading={isLoading}
                            />
                        )}

                        {/* Hide default buttons for internal steps */}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

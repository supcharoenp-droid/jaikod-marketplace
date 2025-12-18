'use client'

import React from 'react'
import { CheckCircle, Store, Box, Tag, MapPin, ShieldCheck, Rocket } from 'lucide-react'
import Button from '@/components/ui/Button'

interface LaunchShopStepProps {
    formData: any
    onConfirm: () => void
    onBack: () => void
    isLoading: boolean
}

export default function LaunchShopStep({ formData, onConfirm, onBack, isLoading }: LaunchShopStepProps) {
    const checklist = [
        { label: 'ชื่อร้านค้า', value: formData.shop_name, icon: Store, done: !!formData.shop_name },
        { label: 'โลโก้ร้านค้า', value: 'จัดการเรียบร้อย', icon: Box, done: !!formData.shop_logo }, // Using Box as generic placeholder if Image icon not preferred, looks like Store asset
        { label: 'คำอธิบายร้านค้า', value: 'เพิ่มแล้ว', icon: CheckCircle, done: !!formData.shop_description_th || !!formData.shop_description_en },
        { label: 'การยืนยันตัวตน', value: formData.is_verified ? 'ยืนยันแล้ว' : 'ข้าม (ไม่ได้ยืนยัน)', icon: ShieldCheck, done: true, isVerified: formData.is_verified },
        { label: 'สินค้าชิ้นแรก', value: formData.first_product ? formData.first_product.name : 'ยังไม่ระบุ', icon: Tag, done: !!formData.first_product },
        { label: 'ที่อยู่ร้านค้า', value: formData.address.province ? `${formData.address.amphoe}, ${formData.address.province}` : 'ยังไม่ระบุ', icon: MapPin, done: !!formData.address.province },
    ]

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="text-center">
                <div className="w-20 h-20 bg-neon-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Rocket className="w-10 h-10 text-neon-purple" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">พร้อมเปิดร้านแล้วหรือยัง?</h2>
                <p className="text-gray-500 mt-2">ตรวจสอบข้อมูลของคุณก่อนยืนยันการเปิดร้าน</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Checklist ความพร้อม</h3>
                <div className="space-y-4">
                    {checklist.map((item, index) => (
                        <div key={index} className="flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${item.done ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                    <item.icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                                    <p className="text-xs text-gray-500">{item.value}</p>
                                </div>
                            </div>
                            {item.done && (
                                <CheckCircle className={`w-5 h-5 ${item.label === 'การยืนยันตัวตน' && !item.isVerified ? 'text-gray-400' : 'text-green-500'}`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={onBack} disabled={isLoading}>
                    ย้อนกลับ
                </Button>
                <Button
                    variant="primary"
                    className="flex-1 shadow-lg shadow-neon-purple/20 h-12 text-lg"
                    onClick={onConfirm}
                    isLoading={isLoading}
                    disabled={isLoading}
                >
                    <Rocket className="w-5 h-5 mr-2" />
                    เปิดร้านทันที
                </Button>
            </div>
        </div>
    )
}

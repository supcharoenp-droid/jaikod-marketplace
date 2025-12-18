'use client'

import React from 'react'
import { MapPin, Package } from 'lucide-react'
import AddressSelector from '@/components/ui/AddressSelector'

interface Step6LocationProps {
    province: string
    amphoe: string
    district: string
    zipcode: string
    shippingMethods: string[]
    onLocationChange: (location: Partial<{ province: string, amphoe: string, district: string, zipcode: string, shippingMethods: string[] }>) => void
    language: 'th' | 'en'
}

export default function Step6Location({
    province,
    amphoe,
    district,
    zipcode,
    shippingMethods,
    onLocationChange,
    language
}: Step6LocationProps) {
    const content = {
        th: {
            title: 'ที่อยู่ & การจัดส่ง',
            subtitle: 'ระบุที่อยู่สินค้าและเลือกวิธีการจัดส่ง',
            shipping: 'วิธีการจัดส่ง'
        },
        en: {
            title: 'Location & Shipping',
            subtitle: 'Specify product location and shipping methods',
            shipping: 'Shipping Methods'
        }
    }

    const t = content[language]

    return (
        <div className="space-y-6">
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <MapPin className="w-8 h-8 text-teal-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <AddressSelector
                    initialValues={{
                        province,
                        amphoe,
                        district,
                        zipcode
                    }}
                    onAddressChange={(address) => {
                        onLocationChange({
                            province: address.province,
                            amphoe: address.amphoe,
                            district: address.district,
                            zipcode: address.zipcode
                        })
                    }}
                />
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    {t.shipping}
                </h3>
                <div className="space-y-2">
                    {['Kerry Express', 'Flash Express', 'Thailand Post', 'นัดรับเอง'].map(method => (
                        <label key={method} className="flex items-center gap-2 p-3 border rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={shippingMethods.includes(method)}
                                onChange={(e) => {
                                    const newMethods = e.target.checked
                                        ? [...shippingMethods, method]
                                        : shippingMethods.filter(m => m !== method)
                                    onLocationChange({ shippingMethods: newMethods })
                                }}
                                className="w-4 h-4"
                            />
                            <span>{method}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}

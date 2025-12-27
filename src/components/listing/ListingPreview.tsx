'use client'

/**
 * ListingPreview - Preview Listing Before Publishing
 * 
 * Features:
 * - Product card preview
 * - All details review
 * - Edit navigation
 * - Validation checks
 * - Publishing confirmation
 */

import { motion } from 'framer-motion'
import { Edit, CheckCircle, AlertCircle, Eye, MapPin, Package, DollarSign } from 'lucide-react'

interface ListingData {
    photos: { file: File; preview: string }[]
    category: string
    title: string
    description: string
    price: number
    condition: string
    location: {
        province: string
        amphoe: string
        tambon: string
    }
}

interface ListingPreviewProps {
    data: ListingData
    onEdit: (section: 'photos' | 'details') => void
}

import { getConditionLabel, DEFAULT_CONDITIONS } from '@/lib/category-condition-options'

// Get condition label with fallback
function getConditionDisplay(condition: string, categoryId?: number): string {
    // If categoryId provided, use category-specific conditions
    if (categoryId) {
        const label = getConditionLabel(categoryId, condition, 'th')
        if (label && label !== condition) {
            return label
        }
    }

    // Fallback to DEFAULT_CONDITIONS
    const defaultCond = DEFAULT_CONDITIONS.conditions.find(c => c.value === condition)
    if (defaultCond) {
        return defaultCond.label_th
    }

    // Fallback to simple map for legacy keys
    const legacyMap: Record<string, string> = {
        'new': '📦 ใหม่',
        'like_new': '✨ เหมือนใหม่',
        'good': '👍 สภาพดี ใช้งานปกติ',
        'fair': '⚠️ พอใช้',
        'used': '🔄 มือสอง',
    }

    return legacyMap[condition] || condition
}

export default function ListingPreview({ data, onEdit }: ListingPreviewProps) {
    // Validation checks
    const validations = {
        hasPhotos: data.photos.length > 0,
        hasTitle: data.title.length >= 10,
        hasDescription: data.description.length >= 50,
        hasPrice: data.price > 0,
        hasCategory: !!data.category,
        hasCondition: !!data.condition,
        hasLocation: !!data.location.province,
    }

    const allValid = Object.values(validations).every(v => v)

    return (
        <motion.div
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Validation Summary */}
            <div className={`p-4 rounded-lg border-2 ${allValid
                ? 'bg-green-500/10 border-green-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
                }`}>
                <div className="flex items-center gap-3">
                    {allValid ? (
                        <>
                            <CheckCircle className="w-6 h-6 text-green-400" />
                            <div>
                                <div className="font-medium text-green-300">✓ พร้อมเผยแพร่</div>
                                <div className="text-sm text-green-200/80">
                                    ข้อมูลครบถ้วนแล้ว!
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-6 h-6 text-yellow-400" />
                            <div>
                                <div className="font-medium text-yellow-300">⚠️ ข้อมูลยังไม่ครบ</div>
                                <div className="text-sm text-yellow-200/80">
                                    กรุณาตรวจสอบข้อมูลด้านล่าง
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>

            {/* Product Preview Card */}
            <div className="bg-gray-800 rounded-lg border-2 border-gray-700 overflow-hidden">
                {/* Header */}
                <div className="p-4 bg-gray-900/50 border-b border-gray-700 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                        <Eye className="w-4 h-4" />
                        ตัวอย่างประกาศ
                    </div>
                    <button
                        onClick={() => onEdit('details')}
                        className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                    >
                        <Edit className="w-3 h-3" />
                        แก้ไข
                    </button>
                </div>

                {/* Photos Section */}
                <div className="p-4">
                    {data.photos.length > 0 ? (
                        <div className="space-y-3">
                            {/* Main Photo */}
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-900">
                                <img
                                    src={data.photos[0].preview}
                                    alt="Main product"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Thumbnail Grid */}
                            {data.photos.length > 1 && (
                                <div className="grid grid-cols-6 gap-2">
                                    {data.photos.slice(1, 7).map((photo, idx) => (
                                        <div key={idx} className="aspect-square rounded-lg overflow-hidden bg-gray-900">
                                            <img
                                                src={photo.preview}
                                                alt={`Photo ${idx + 2}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                    {data.photos.length > 7 && (
                                        <div className="aspect-square rounded-lg bg-gray-900 flex items-center justify-center text-xs text-gray-500">
                                            +{data.photos.length - 7}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="aspect-square rounded-lg bg-gray-900 flex items-center justify-center">
                            <div className="text-center text-gray-600">
                                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                <div className="text-sm">ไม่มีรูปภาพ</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="p-4 space-y-4">
                    {/* Price */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-purple-400">
                            ฿{data.price.toLocaleString()}
                        </span>
                        {data.condition && (
                            <span className="px-2 py-1 bg-gray-700 rounded text-xs text-gray-300">
                                {getConditionDisplay(data.condition, data.category ? parseInt(data.category) : undefined)}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <div>
                        <h3 className="text-xl font-semibold text-white leading-tight">
                            {data.title || '(ไม่มีชื่อสินค้า)'}
                        </h3>
                        {!validations.hasTitle && (
                            <div className="text-xs text-red-400 mt-1">
                                ⚠️ ชื่อต้องมีอย่างน้อย 10 ตัวอักษร
                            </div>
                        )}
                    </div>

                    {/* Category */}
                    {data.category && (
                        <div className="text-sm text-gray-400">
                            📂 {data.category}
                        </div>
                    )}

                    {/* Description */}
                    <div className="pt-4 border-t border-gray-700">
                        <h4 className="text-sm font-medium text-gray-300 mb-2">รายละเอียด</h4>
                        <p className="text-sm text-gray-400 whitespace-pre-wrap">
                            {data.description || '(ไม่มีรายละเอียด)'}
                        </p>
                        {!validations.hasDescription && (
                            <div className="text-xs text-red-400 mt-2">
                                ⚠️ รายละเอียดต้องมีอย่างน้อย 50 ตัวอักษร
                            </div>
                        )}
                    </div>

                    {/* Location */}
                    {data.location.province && (
                        <div className="pt-4 border-t border-gray-700">
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <MapPin className="w-4 h-4" />
                                {data.location.province}
                                {data.location.amphoe && `, ${data.location.amphoe}`}
                                {data.location.tambon && `, ${data.location.tambon}`}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Checklist */}
            <div className="p-4 rounded-lg bg-gray-800 border border-gray-700">
                <h4 className="text-sm font-medium text-white mb-3">เช็คลิสต์</h4>
                <div className="space-y-2">
                    {[
                        { label: 'มีรูปภาพอย่างน้อย 1 รูป', valid: validations.hasPhotos },
                        { label: 'ชื่อสินค้าครบถ้วน (>=10 ตัวอักษร)', valid: validations.hasTitle },
                        { label: 'รายละเอียดเพียงพอ (>=50 ตัวอักษร)', valid: validations.hasDescription },
                        { label: 'ระบุราคาแล้ว', valid: validations.hasPrice },
                        { label: 'เลือกหมวดหมู่แล้ว', valid: validations.hasCategory },
                        { label: 'ระบุสภาพสินค้า', valid: validations.hasCondition },
                        { label: 'ระบุที่อยู่', valid: validations.hasLocation },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                            {item.valid ? (
                                <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : (
                                <AlertCircle className="w-4 h-4 text-red-400" />
                            )}
                            <span className={item.valid ? 'text-gray-300' : 'text-red-300'}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <div className="text-sm text-blue-300">
                    💡 <strong>เคล็ดลับ:</strong> ประกาศที่มีรูป 5-10 รูป มักขายได้เร็วกว่า 18%
                </div>
            </div>
        </motion.div>
    )
}

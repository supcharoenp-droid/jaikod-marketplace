/**
 * Dynamic Form Test Page
 * 
 * Test page for DynamicDetailForm component
 * Demonstrates all 3 implemented categories with mock AI suggestions
 */

'use client'

import React, { useState } from 'react'
import DynamicDetailForm from '@/components/listing/DynamicDetailForm'
import { DetailFormData, AISuggestions } from '@/types/dynamic-form'

// Mock AI Suggestions for Mobile
const MOBILE_AI_SUGGESTIONS: AISuggestions = {
    suggestedFields: {
        brand: {
            value: 'iPhone',
            confidence: 0.95,
            source: 'title'
        },
        model: {
            value: 'iPhone 15 Pro Max',
            confidence: 0.92,
            source: 'title'
        },
        storage: {
            value: '256GB',
            confidence: 0.88,
            source: 'description'
        },
        condition: {
            value: 'มือสอง สภาพดีมาก (95%+)',
            confidence: 0.85,
            source: 'description'
        },
        color: {
            value: 'Titanium Blue',
            confidence: 0.80,
            source: 'description'
        },
        warranty: {
            value: 'ยังอยู่ในประกัน (Apple/Samsung/แบรนด์)',
            confidence: 0.75,
            source: 'inferred'
        }
    },
    missingCritical: [],
    recommendations: [
        'เพิ่ม IMEI เพื่อเพิ่มความน่าเชื่อถือ',
        'ระบุ Battery Health % สำหรับเครื่องมือสอง',
        'ถ่ายรูปแสดงหน้าจอ Settings เพิ่มเติม'
    ],
    overallConfidence: 0.86
}

// Mock AI Suggestions for Vehicle
const VEHICLE_AI_SUGGESTIONS: AISuggestions = {
    suggestedFields: {
        vehicleType: {
            value: 'รถยนต์',
            confidence: 0.98,
            source: 'title'
        },
        brand: {
            value: 'Toyota',
            confidence: 0.95,
            source: 'title'
        },
        model: {
            value: 'Camry',
            confidence: 0.93,
            source: 'title'
        },
        year: {
            value: 2565,
            confidence: 0.90,
            source: 'description'
        },
        mileage: {
            value: 45000,
            confidence: 0.87,
            source: 'description'
        },
        transmission: {
            value: 'ออโต้',
            confidence: 0.85,
            source: 'description'
        },
        color: {
            value: 'ขาวมุก',
            confidence: 0.82,
            source: 'image'
        }
    },
    missingCritical: [],
    recommendations: [
        'ระบุประวัติการเซอร์วิสเพิ่มความน่าเชื่อถือ',
        'อัปโหลดรูปเล่มทะเบียนรถ',
        'ถ่ายรูปตัวเลขไมล์ปัจจุบัน'
    ],
    overallConfidence: 0.90
}

// Mock AI Suggestions for Real Estate
const REAL_ESTATE_AI_SUGGESTIONS: AISuggestions = {
    suggestedFields: {
        propertyType: {
            value: 'คอนโด',
            confidence: 0.96,
            source: 'title'
        },
        size: {
            value: 35,
            confidence: 0.92,
            source: 'description'
        },
        bedrooms: {
            value: 1,
            confidence: 0.90,
            source: 'description'
        },
        bathrooms: {
            value: 1,
            confidence: 0.88,
            source: 'description'
        },
        province: {
            value: 'กรุงเทพมหานคร',
            confidence: 0.95,
            source: 'description'
        },
        ownership: {
            value: 'มีเอกสารสิทธิ์ (โฉนด)',
            confidence: 0.75,
            source: 'inferred'
        },
        floor: {
            value: 15,
            confidence: 0.85,
            source: 'description'
        }
    },
    missingCritical: [],
    recommendations: [
        'ระบุค่าส่วนกลางต่อเดือน',
        'แนบรูปถ่ายโฉนดหรือเอกสารสิทธิ์',
        'ระบุสถานที่ใกล้เคียง เช่น BTS, MRT'
    ],
    overallConfidence: 0.88
}

export default function DynamicFormTestPage() {
    const [selectedCategory, setSelectedCategory] = useState('3') // Default: Mobile
    const [formData, setFormData] = useState<DetailFormData>({})

    const getAISuggestions = () => {
        switch (selectedCategory) {
            case '1': return VEHICLE_AI_SUGGESTIONS
            case '2': return REAL_ESTATE_AI_SUGGESTIONS
            case '3': return MOBILE_AI_SUGGESTIONS
            default: return undefined
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        🧪 Dynamic Form Test
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        ทดสอบฟอร์มรายละเอียดแบบ Dynamic พร้อม AI Suggestions
                    </p>
                </div>

                {/* Category Selector */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        เลือกหมวดหมู่เพื่อทดสอบ:
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                            onClick={() => {
                                setSelectedCategory('3')
                                setFormData({})
                            }}
                            className={`p-4 rounded-lg border-2 transition-all ${selectedCategory === '3'
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                }`}
                        >
                            <div className="text-3xl mb-2">📱</div>
                            <div className="font-semibold text-gray-900 dark:text-white">มือถือและแท็บเล็ต</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">11 ฟิลด์</div>
                        </button>

                        <button
                            onClick={() => {
                                setSelectedCategory('1')
                                setFormData({})
                            }}
                            className={`p-4 rounded-lg border-2 transition-all ${selectedCategory === '1'
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                }`}
                        >
                            <div className="text-3xl mb-2">🚗</div>
                            <div className="font-semibold text-gray-900 dark:text-white">ยานยนต์</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">14 ฟิลด์</div>
                        </button>

                        <button
                            onClick={() => {
                                setSelectedCategory('2')
                                setFormData({})
                            }}
                            className={`p-4 rounded-lg border-2 transition-all ${selectedCategory === '2'
                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                }`}
                        >
                            <div className="text-3xl mb-2">🏢</div>
                            <div className="font-semibold text-gray-900 dark:text-white">อสังหาริมทรัพย์</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">16 ฟิลด์</div>
                        </button>
                    </div>
                </div>

                {/* Dynamic Form */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <DynamicDetailForm
                        categoryId={selectedCategory}
                        initialData={formData}
                        aiSuggestions={getAISuggestions()}
                        onChange={setFormData}
                        showAIAssistant={true}
                    />
                </div>

                {/* Debug Panel */}
                <details className="mt-6 bg-gray-100 dark:bg-gray-800 rounded-xl p-6">
                    <summary className="cursor-pointer font-semibold text-gray-900 dark:text-white mb-4">
                        🔍 Debug - Form Data (JSON)
                    </summary>
                    <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-xs">
                        {JSON.stringify(formData, null, 2)}
                    </pre>
                </details>
            </div>
        </div>
    )
}

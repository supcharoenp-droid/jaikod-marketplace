/**
 * Simplified Smart Listing Page - WITH Dynamic Form Integration
 * 
 * Shows how DynamicDetailForm integrates into the real listing flow
 */

'use client'

import React, { useState, useCallback } from 'react'
import DynamicDetailFormSimple from '@/components/listing/DynamicDetailFormSimple'
import { DetailFormData, AISuggestions } from '@/types/dynamic-form'
import { hasDynamicForm } from '@/config/category-schemas'
import { ChevronRight, Sparkles, Camera, FileText, Eye } from 'lucide-react'

// Mock AI suggestions (in real app, this comes from Gemini Vision API)
const MOCK_AI_SUGGESTIONS: AISuggestions = {
    suggestedFields: {
        brand: { value: 'iPhone', confidence: 0.95, source: 'title' },
        model: { value: 'iPhone 15 Pro Max', confidence: 0.92, source: 'title' },
        storage: { value: '256GB', confidence: 0.88, source: 'description' },
        condition: { value: 'มือสอง สภาพดีมาก (95%+)', confidence: 0.85, source: 'description' },
        color: { value: 'Titanium Blue', confidence: 0.80, source: 'description' },
        warranty: { value: 'ยังอยู่ในประกัน (Apple/Samsung/แบรนด์)', confidence: 0.75, source: 'inferred' }
    },
    missingCritical: [],
    recommendations: [
        'เพิ่ม IMEI เพื่อเพิ่มความน่าเชื่อถือ',
        'ระบุ Battery Health % สำหรับเครื่องมือสอง'
    ],
    overallConfidence: 0.86
}

export default function RealListingFlowDemo() {
    const [currentStep, setCurrentStep] = useState(1)
    const [listingData, setListingData] = useState({
        photos: ['photo1.jpg', 'photo2.jpg'], // Mock uploaded photos
        category: '3', // Mobile category
        title: 'iPhone 15 Pro Max 256GB Titanium Blue',
        description: 'สภาพดีมาก ยังอยู่ในประกัน ใช้งานปกติ',
        price: 42000,
        detailFormData: {} as DetailFormData
    })

    const steps = [
        { num: 1, label: 'อัปโหลดรูป', icon: Camera },
        { num: 2, label: 'AI วิเคราะห์', icon: Sparkles },
        { num: 3, label: 'รายละเอียด', icon: FileText },
        { num: 4, label: 'ตรวจสอบ', icon: Eye }
    ]

    // Memoize onChange to prevent infinite loop
    const handleDetailFormChange = useCallback((data: DetailFormData) => {
        setListingData(prev => ({ ...prev, detailFormData: data }))
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Progress Steps */}
            <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <React.Fragment key={step.num}>
                                <div className="flex items-center">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center ${currentStep >= step.num
                                            ? 'bg-purple-600 text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
                                            }`}
                                    >
                                        <step.icon className="w-5 h-5" />
                                    </div>
                                    <span
                                        className={`ml-2 text-sm font-medium ${currentStep >= step.num
                                            ? 'text-gray-900 dark:text-white'
                                            : 'text-gray-400'
                                            }`}
                                    >
                                        {step.label}
                                    </span>
                                </div>
                                {index < steps.length - 1 && (
                                    <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600" />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Step 1: Upload (Completed) */}
                {currentStep >= 1 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-white text-lg">✓</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                ✅ อัปโหลดรูปเสร็จแล้ว
                            </h2>
                        </div>
                        <div className="flex gap-2">
                            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <Camera className="w-8 h-8 text-gray-400" />
                            </div>
                            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                <Camera className="w-8 h-8 text-gray-400" />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 2: AI Analysis (Completed) */}
                {currentStep >= 2 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                <span className="text-white text-lg">✓</span>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                ✅ AI วิเคราะห์เสร็จแล้ว
                            </h2>
                        </div>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">หมวดหมู่:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    📱 มือถือและแท็บเล็ต
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">ชื่อ:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {listingData.title}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">ราคา:</span>
                                <span className="font-medium text-gray-900 dark:text-white">
                                    ฿{listingData.price.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 3: DYNAMIC FORM (Current) */}
                {currentStep >= 3 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center animate-pulse">
                                <FileText className="w-5 h-5 text-white" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                                📝 กรอกรายละเอียดเพิ่มเติม
                            </h2>
                        </div>

                        {/* ===== SIMPLIFIED FORM ===== */}
                        {hasDynamicForm(listingData.category) ? (
                            <DynamicDetailFormSimple
                                categoryId={listingData.category}
                                initialData={listingData.detailFormData}
                                aiSuggestions={MOCK_AI_SUGGESTIONS}
                                onChange={handleDetailFormChange}
                            />
                        ) : (
                            <div className="p-8 text-center bg-gray-50 dark:bg-gray-900 rounded-lg">
                                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">
                                    ไม่มีฟอร์มรายละเอียดเพิ่มเติมสำหรับหมวดหมู่นี้
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                                    คุณสามารถกดถัดไปเพื่อไปยังขั้นตอนตรวจสอบได้เลย
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setCurrentStep(2)}
                                className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600"
                            >
                                ← ย้อนกลับ
                            </button>
                            <button
                                onClick={() => setCurrentStep(4)}
                                className="flex-1 py-3 px-6 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium"
                            >
                                ถัดไป: ตรวจสอบ →
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Preview (Optional) */}
                {currentStep >= 4 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            👁️ ตรวจสอบก่อนเผยแพร่
                        </h2>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
                            <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-auto">
                                {JSON.stringify(
                                    {
                                        ...listingData,
                                        detailFormData: listingData.detailFormData
                                    },
                                    null,
                                    2
                                )}
                            </pre>
                        </div>
                        <div className="flex gap-4 mt-6">
                            <button
                                onClick={() => setCurrentStep(3)}
                                className="flex-1 py-3 px-6 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium"
                            >
                                ← แก้ไขรายละเอียด
                            </button>
                            <button className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
                                ✓ เผยแพร่ประกาศ
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Helper */}
            <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">จำลองขั้นตอน:</div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4].map(num => (
                        <button
                            key={num}
                            onClick={() => setCurrentStep(num)}
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === num
                                ? 'bg-purple-600 text-white'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-600'
                                }`}
                        >
                            {num}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

'use client'

import React, { useState, useEffect } from 'react'
import {
    Package, FileText, DollarSign, MapPin, Truck, ShieldCheck,
    Eye, Sparkles, TrendingUp, Loader2, Check, AlertTriangle, Rocket
} from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

// Services & Types
import { CATEGORIES } from '@/constants/categories'
import { CATEGORY_FORMS } from '@/config/category-forms'
import AddressSelector from '@/components/ui/AddressSelector'
import {
    checkListingCompliance,
    calculateBuyabilityScore,
    AICategoryPrediction,
    AITitleSuggestion,
    AIPriceSuggestion,
    AIComplianceCheck,
    AIBuyabilityScore
} from '@/services/aiSmartListing'
import { SimpleListingData } from './SimpleTwoStepListing'
import { ListingAssistantResult } from '@/services/intelligentListingAssistant'
import { ImageEnhancementResult } from '@/services/professionalImageEnhancer'

// New AI Components
import SmartTitleSuggestion from './SmartTitleSuggestion'
import CategoryRecommendation from './CategoryRecommendation'
import ListingCompletionIndicator from './ListingCompletionIndicator'
import ImageEnhancementDisplay from './ImageEnhancementDisplay'

interface SimpleOnePageFormProps {
    listingData: SimpleListingData
    enhancementResult?: ImageEnhancementResult | null
    aiAssistance?: ListingAssistantResult | null
    onDataChange: (updates: Partial<SimpleListingData>) => void
    onPublish: () => void
    isPublishing: boolean
    language: 'th' | 'en'
}

export default function SimpleOnePageForm({
    listingData,
    enhancementResult,
    aiAssistance,
    onDataChange,
    onPublish,
    isPublishing,
    language
}: SimpleOnePageFormProps) {
    // AI States
    const [complianceCheck, setComplianceCheck] = useState<AIComplianceCheck>()
    const [buyabilityScore, setBuyabilityScore] = useState<AIBuyabilityScore>()

    const [activeSection, setActiveSection] = useState<string>('category')

    const content = {
        th: {
            sections: {
                category: '📦 หมวดหมู่',
                title: '✍️ ชื่อสินค้า',
                price: '💰 ราคา',
                details: '📝 รายละเอียด',
                location: '📍 ที่อยู่',
                shipping: '🚚 การจัดส่ง',
                preview: '👁️ ตัวอย่าง'
            },
            aiSuggestion: 'คำแนะนำจาก AI',
            useThis: 'ใช้',
            selectCategory: 'เลือกหมวดหมู่',
            aiPrediction: 'AI ทาย',
            productTitle: 'ชื่อสินค้า',
            titlePlaceholder: 'เช่น iPhone 13 Pro สีน้ำเงิน 256GB',
            productPrice: 'ราคา (บาท)',
            pricePlaceholder: 'ระบุราคา',
            quickSell: 'ขายไว',
            market: 'ตลาด',
            maxProfit: 'กำไรสูง',
            condition: 'สภาพสินค้า',
            description: 'รายละเอียด',
            descPlaceholder: 'อธิบายสินค้าของคุณ...',
            location: 'ที่อยู่สินค้า',
            shippingMethods: 'วิธีการจัดส่ง',
            safetyCheck: 'ตรวจสอบความปลอดภัย',
            buyabilityScore: 'คะแนนความน่าซื้อ',
            publish: 'เผยแพร่ประกาศ',
            publishing: 'กำลังเผยแพร่...'
        },
        en: {
            sections: {
                category: '📦 Category',
                title: '✍️ Title',
                price: '💰 Price',
                details: '📝 Details',
                location: '📍 Location',
                shipping: '🚚 Shipping',
                preview: '👁️ Preview'
            },
            aiSuggestion: 'AI Suggestion',
            useThis: 'Use',
            selectCategory: 'Select Category',
            aiPrediction: 'AI Prediction',
            productTitle: 'Product Title',
            titlePlaceholder: 'e.g. iPhone 13 Pro Blue 256GB',
            productPrice: 'Price (THB)',
            pricePlaceholder: 'Enter price',
            quickSell: 'Quick',
            market: 'Market',
            maxProfit: 'Max',
            condition: 'Condition',
            description: 'Description',
            descPlaceholder: 'Describe your product...',
            location: 'Product Location',
            shippingMethods: 'Shipping Methods',
            safetyCheck: 'Safety Check',
            buyabilityScore: 'Buyability Score',
            publish: 'Publish Listing',
            publishing: 'Publishing...'
        }
    }

    const t = content[language]

    // Auto-check compliance
    useEffect(() => {
        if (listingData.title && listingData.price > 0 && listingData.categoryId) {
            runComplianceCheck()
        }
    }, [listingData.title, listingData.price, listingData.description])

    // Calculate buyability score
    useEffect(() => {
        if (listingData.title && listingData.price > 0 && listingData.province) {
            runBuyabilityScore()
        }
    }, [listingData.title, listingData.price, listingData.province, listingData.description])

    const runComplianceCheck = async () => {
        try {
            const check = await checkListingCompliance(
                listingData.title,
                listingData.description,
                listingData.price,
                listingData.categoryId || 99
            )
            setComplianceCheck(check)
        } catch (error) {
            console.error('Compliance check error:', error)
        }
    }

    const runBuyabilityScore = async () => {
        try {
            const score = await calculateBuyabilityScore({
                title: listingData.title,
                description: listingData.description,
                price: listingData.price,
                category: listingData.categoryId || 99,
                images: listingData.images,
                imageQualityScore: enhancementResult?.image_score || 75
            })
            setBuyabilityScore(score)
        } catch (error) {
            console.error('Buyability score error:', error)
        }
    }

    const categoryFields = CATEGORY_FORMS[listingData.categoryId?.toString() || ''] || []

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form - Left Side */}
            <div className="lg:col-span-2 space-y-6">

                {/* AI Image Enhancement Report */}
                {enhancementResult && (
                    <ImageEnhancementDisplay
                        result={enhancementResult}
                        language={language}
                        onAcceptEnhancements={() => console.log('Enhancements accepted')}
                        onRevertToOriginals={() => console.log('Reverted to originals')}
                    />
                )}

                {/* 1. Category Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-orange-200 dark:border-orange-800 p-6"
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                        <Package className="w-6 h-6 text-orange-600" />
                        {t.sections.category}
                    </h3>

                    {/* AI Category Recommendation */}
                    {aiAssistance?.category_recommendation && (
                        <div className="mb-4">
                            <CategoryRecommendation
                                recommendation={aiAssistance.category_recommendation}
                                selectedCategory={listingData.categoryId}
                                language={language}
                                onSelectCategory={(id) => onDataChange({ categoryId: id })}
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                        {CATEGORIES.slice(0, 12).map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => onDataChange({ categoryId: cat.id })}
                                className={`p-3 rounded-xl border-2 transition-all text-left ${listingData.categoryId === cat.id
                                    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20 shadow-md'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-orange-300'
                                    }`}
                            >
                                <div className="text-2xl mb-1">{cat.icon}</div>
                                <p className="text-xs font-medium text-gray-900 dark:text-white">
                                    {cat.name_th}
                                </p>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* 2. Title & Price Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-green-200 dark:border-green-800 p-6 space-y-4"
                >
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <FileText className="w-4 h-4 inline mr-2" />
                            {t.productTitle}
                        </label>
                        <input
                            type="text"
                            value={listingData.title}
                            onChange={(e) => onDataChange({ title: e.target.value })}
                            placeholder={t.titlePlaceholder}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />

                        {/* AI Title Suggestions */}
                        {aiAssistance?.title_suggestions && aiAssistance.title_suggestions.length > 0 && (
                            <div className="mt-4">
                                <SmartTitleSuggestion
                                    suggestions={aiAssistance.title_suggestions}
                                    userTitle={listingData.title}
                                    language={language}
                                    onApplySuggestion={(title) => onDataChange({ title })}
                                />
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <DollarSign className="w-4 h-4 inline mr-2" />
                            {t.productPrice}
                        </label>
                        <input
                            type="number"
                            value={listingData.price || ''}
                            onChange={(e) => onDataChange({ price: parseFloat(e.target.value) || 0 })}
                            placeholder={t.pricePlaceholder}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold"
                        />

                        {/* AI Price Suggestions */}
                        {aiAssistance?.price_guidance && (
                            <div className="mt-2 grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => onDataChange({ price: Math.round(aiAssistance.price_guidance!.market_range.min) })}
                                    className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-center hover:bg-orange-200 transition-all"
                                >
                                    <p className="text-xs text-orange-600">{t.quickSell}</p>
                                    <p className="text-sm font-bold text-orange-700">
                                        ฿{Math.round(aiAssistance.price_guidance.market_range.min).toLocaleString()}
                                    </p>
                                </button>
                                <button
                                    onClick={() => onDataChange({ price: Math.round(aiAssistance.price_guidance!.market_range.average) })}
                                    className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-center hover:bg-green-200 transition-all"
                                >
                                    <p className="text-xs text-green-600">⭐ {t.market}</p>
                                    <p className="text-sm font-bold text-green-700">
                                        ฿{Math.round(aiAssistance.price_guidance.market_range.average).toLocaleString()}
                                    </p>
                                </button>
                                <button
                                    onClick={() => onDataChange({ price: Math.round(aiAssistance.price_guidance!.market_range.max) })}
                                    className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-center hover:bg-purple-200 transition-all"
                                >
                                    <p className="text-xs text-purple-600">{t.maxProfit}</p>
                                    <p className="text-sm font-bold text-purple-700">
                                        ฿{Math.round(aiAssistance.price_guidance.market_range.max).toLocaleString()}
                                    </p>
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>

                {/* 3. Details Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-indigo-200 dark:border-indigo-800 p-6 space-y-4"
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <FileText className="w-6 h-6 text-indigo-600" />
                        {t.sections.details}
                    </h3>

                    {/* Category-specific fields */}
                    {categoryFields.map(field => (
                        <div key={field.id}>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                {field.label}
                            </label>
                            {field.type === 'select' ? (
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700"
                                    value={listingData.attributes[field.id] || ''}
                                    onChange={(e) => onDataChange({
                                        attributes: { ...listingData.attributes, [field.id]: e.target.value }
                                    })}
                                >
                                    <option value="">เลือก...</option>
                                    {field.options?.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : field.type === 'textarea' ? (
                                <textarea
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700"
                                    rows={4}
                                    value={listingData.description}
                                    onChange={(e) => onDataChange({ description: e.target.value })}
                                    placeholder={t.descPlaceholder}
                                />
                            ) : (
                                <input
                                    type={field.type}
                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700"
                                    value={listingData.attributes[field.id] || ''}
                                    onChange={(e) => onDataChange({
                                        attributes: { ...listingData.attributes, [field.id]: e.target.value }
                                    })}
                                    placeholder={field.placeholder}
                                />
                            )}
                        </div>
                    ))}
                </motion.div>

                {/* 4. Location & Shipping */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-teal-200 dark:border-teal-800 p-6 space-y-4"
                >
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-teal-600" />
                        {t.sections.location}
                    </h3>

                    <AddressSelector
                        initialValues={{
                            province: listingData.province,
                            amphoe: listingData.amphoe,
                            district: listingData.district,
                            zipcode: listingData.zipcode
                        }}
                        onAddressChange={(address) => onDataChange({
                            province: address.province,
                            amphoe: address.amphoe,
                            district: address.district,
                            zipcode: address.zipcode
                        })}
                    />

                    <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                            <Truck className="w-5 h-5" />
                            {t.shippingMethods}
                        </h4>
                        {['Kerry Express', 'Flash Express', 'Thailand Post', 'นัดรับเอง'].map(method => (
                            <label key={method} className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={listingData.shippingMethods.includes(method)}
                                    onChange={(e) => {
                                        const newMethods = e.target.checked
                                            ? [...listingData.shippingMethods, method]
                                            : listingData.shippingMethods.filter(m => m !== method)
                                        onDataChange({ shippingMethods: newMethods })
                                    }}
                                    className="w-4 h-4"
                                />
                                <span className="text-sm">{method}</span>
                            </label>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Preview Sidebar - Right Side */}
            <div className="lg:col-span-1 space-y-6">
                {/* Safety Check */}
                {complianceCheck && (
                    <div className={`rounded-2xl p-4 ${complianceCheck.passed
                        ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200'
                        : 'bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200'
                        }`}>
                        <div className="flex items-center gap-2 mb-2">
                            {complianceCheck.passed ? (
                                <Check className="w-5 h-5 text-green-600" />
                            ) : (
                                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            )}
                            <span className="font-bold">
                                {t.safetyCheck}
                            </span>
                        </div>
                        {!complianceCheck.passed && complianceCheck.issues.length > 0 && (
                            <div className="text-sm space-y-1 mt-2">
                                {complianceCheck.issues.slice(0, 2).map((issue, idx) => (
                                    <p key={idx} className="text-yellow-800 dark:text-yellow-200">
                                        • {issue.message[language]}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Buyability Score */}
                {buyabilityScore && (
                    <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-2 mb-4">
                            <TrendingUp className="w-6 h-6" />
                            <h3 className="font-bold">{t.buyabilityScore}</h3>
                        </div>
                        <div className="text-5xl font-bold mb-4">
                            {buyabilityScore.overallScore}
                            <span className="text-2xl opacity-75">/100</span>
                        </div>
                        <div className="space-y-2 text-sm opacity-90">
                            <div className="flex justify-between">
                                <span>👁️ Views/Day:</span>
                                <span className="font-bold">{buyabilityScore.estimatedSalesPotential.viewsPerDay}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>📈 Sale Chance:</span>
                                <span className="font-bold">{buyabilityScore.estimatedSalesPotential.likelihoodToSell}%</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Publish Button */}
                <button
                    onClick={onPublish}
                    disabled={isPublishing || !complianceCheck?.passed}
                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-xl"
                >
                    {isPublishing ? (
                        <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            {t.publishing}
                        </>
                    ) : (
                        <>
                            <Rocket className="w-6 h-6" />
                            {t.publish}
                        </>
                    )}
                </button>
            </div>
        </div>
    )
}

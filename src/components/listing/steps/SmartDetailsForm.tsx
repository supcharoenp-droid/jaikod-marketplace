'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    MapPin, TrendingUp, Eye, DollarSign, FileText,
    Package, Truck, CheckCircle2, Star, Zap, AlertCircle
} from 'lucide-react'

import { SmartListingData } from '../SmartListingWizard'
import CategoryRecommendation from '../CategoryRecommendation'
import SmartTitleSuggestion from '../SmartTitleSuggestion'
import ImageEnhancementDisplay from '../ImageEnhancementDisplay'
import AddressSelector from '@/components/ui/AddressSelector'
import { createProduct, CreateProductInput } from '@/lib/products'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface SmartDetailsFormProps {
    listingData: SmartListingData
    language: 'th' | 'en'
    onPublish: () => void
    onDataChange: (updates: Partial<SmartListingData>) => void
}

export default function SmartDetailsForm({
    listingData,
    language,
    onPublish,
    onDataChange
}: SmartDetailsFormProps) {
    const { user } = useAuth()
    const router = useRouter()
    const [isPublishing, setIsPublishing] = useState(false)
    const [sellScore, setSellScore] = useState(0)
    const [showPreview, setShowPreview] = useState(false)

    const content = {
        th: {
            title: 'ใส่รายละเอียดสินค้า',
            subtitle: 'พิมพ์น้อย แต่ข้อมูลครบ',
            category: '📦 หมวดหมู่',
            productTitle: '✍️ ชื่อสินค้า',
            price: '💰 ราคา',
            description: '📝 รายละเอียด',
            condition: '📌 สภาพสินค้า',
            location: '📍 ที่อยู่สินค้า',
            shipping: '🚚 การจัดส่ง',
            preview: '👁️ ดูตัวอย่าง',
            publish: 'เผยแพร่ประกาศ',
            publishing: 'กำลังเผยแพร่...',
            sellScore: 'คะแนนความพร้อมขาย',
            trustBoost: 'Trust Boost',
            betterThanAvg: 'ข้อมูลครบกว่าค่าเฉลี่ย',
            pricingHint: 'ราคาใกล้เคียงตลาด',
            conditions: {
                new: 'ใหม่',
                like_new: 'เหมือนใหม่',
                good: 'ดี',
                fair: 'พอใช้',
                poor: 'มีตำหนิ'
            },
            shippingOptions: {
                standard: 'ส่งปกติ',
                express: 'ส่งด่วน',
                pickup: 'รับหน้าร้าน'
            },
            descPlaceholder: 'อธิบายสินค้าของคุณ...\n\n💡 แนะนำ:\n- ระบุสภาพอย่างละเอียด\n- บอกสาเหตุที่ขาย\n- แจ้งอุปกรณ์ที่แถมมา',
            gpsRequest: 'ขอเปิด GPS เพื่อระบุตำแหน่ง',
            gpsAllow: 'อนุญาต',
            gpsSkip: 'ข้าม',
            grade: {
                A: 'ดีเยี่ยม',
                B: 'ดี',
                C: 'พอใช้',
                D: 'ควรปรับปรุง',
                F: 'ไม่พร้อม'
            }
        },
        en: {
            title: 'Product Details',
            subtitle: 'Type less, provide more',
            category: '📦 Category',
            productTitle: '✍️ Product Title',
            price: '💰 Price',
            description: '📝 Description',
            condition: '📌 Condition',
            location: '📍 Location',
            shipping: '🚚 Shipping',
            preview: '👁️ Preview',
            publish: 'Publish Listing',
            publishing: 'Publishing...',
            sellScore: 'Sell Score',
            trustBoost: 'Trust Boost',
            betterThanAvg: 'More complete than average',
            pricingHint: 'Pricing close to market',
            conditions: {
                new: 'New',
                like_new: 'Like New',
                good: 'Good',
                fair: 'Fair',
                poor: 'Poor'
            },
            shippingOptions: {
                standard: 'Standard',
                express: 'Express',
                pickup: 'Pickup'
            },
            descPlaceholder: 'Describe your product...\n\n💡 Tips:\n- Specify condition in detail\n- Mention reason for selling\n- List included accessories',
            gpsRequest: 'Allow GPS to auto-fill location',
            gpsAllow: 'Allow',
            gpsSkip: 'Skip',
            grade: {
                A: 'Excellent',
                B: 'Good',
                C: 'Fair',
                D: 'Needs Improvement',
                F: 'Not Ready'
            }
        }
    }

    const t = content[language]

    // Calculate Sell Score
    useEffect(() => {
        let score = 0
        let grade: 'A' | 'B' | 'C' | 'D' | 'F' = 'F'

        // Images (30 points)
        score += Math.min(listingData.images.length * 5, 30)

        // Title (20 points)
        if (listingData.title.length > 10) score += 20
        else if (listingData.title.length > 0) score += 10

        // Description (20 points)
        if (listingData.description.length > 100) score += 20
        else if (listingData.description.length > 50) score += 15
        else if (listingData.description.length > 0) score += 10

        // Price (15 points)
        if (listingData.price > 0) score += 15

        // Category (10 points)
        if (listingData.categoryId) score += 10

        // Location (5 points)
        if (listingData.province) score += 5

        // Grade calculation
        if (score >= 90) grade = 'A'
        else if (score >= 75) grade = 'B'
        else if (score >= 60) grade = 'C'
        else if (score >= 40) grade = 'D'

        setSellScore(score)
        onDataChange({ sellScore: score, sellGrade: grade })
    }, [
        // Only depend on the actual data values, not the function
        listingData.images.length,
        listingData.title.length,
        listingData.description.length,
        listingData.price,
        listingData.categoryId,
        listingData.province
    ] as const)

    const handlePublish = async () => {
        if (!user) {
            alert(language === 'th' ? 'กรุณาเข้าสู่ระบบก่อน' : 'Please login first')
            return
        }

        if (!listingData.categoryId || !listingData.title || listingData.price <= 0) {
            alert(language === 'th'
                ? 'กรุณากรอกข้อมูลให้ครบถ้วน (หมวดหมู่, ชื่อ, ราคา)'
                : 'Please fill required fields (category, title, price)')
            return
        }

        setIsPublishing(true)

        try {
            const productInput: CreateProductInput = {
                title: listingData.title,
                description: listingData.description,
                price: listingData.price,
                price_type: 'fixed',
                category_id: listingData.categoryId.toString(),
                images: listingData.images,
                condition: listingData.condition,
                province: listingData.province,
                amphoe: listingData.amphoe,
                district: listingData.district,
                zipcode: listingData.zipcode,
                can_ship: listingData.shippingMethods.includes('standard') || listingData.shippingMethods.includes('express'),
                can_pickup: listingData.shippingMethods.includes('pickup'),
                stock: 1
            }

            await createProduct(
                productInput,
                (user as any).uid || (user as any).id,
                (user as any).displayName || 'Seller',
                (user as any).photoURL || ''
            )

            alert(language === 'th'
                ? '✅ ลงประกาศสินค้าสำเร็จ!'
                : '✅ Product listed successfully!')

            router.push('/seller/products')
        } catch (error) {
            console.error('Publishing error:', error)
            alert(language === 'th'
                ? '❌ เกิดข้อผิดพลาด กรุณาลองใหม่'
                : '❌ Error publishing. Please try again')
        } finally {
            setIsPublishing(false)
        }
    }

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'from-green-500 to-emerald-500'
        if (score >= 75) return 'from-blue-500 to-cyan-500'
        if (score >= 60) return 'from-yellow-500 to-orange-500'
        if (score >= 40) return 'from-orange-500 to-red-500'
        return 'from-red-500 to-pink-500'
    }

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-8"
            >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {t.title}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    {t.subtitle} ✨
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Form - Left */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Image Enhancement Summary */}
                    {listingData.imageAnalysis && (
                        <ImageEnhancementDisplay
                            result={listingData.imageAnalysis}
                            language={language}
                            onAcceptEnhancements={() => console.log('Accepted')}
                            onRevertToOriginals={() => console.log('Reverted')}
                        />
                    )}

                    {/* Category */}
                    {listingData.aiSuggestions?.category_recommendation && (
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                {t.category}
                            </h3>
                            <CategoryRecommendation
                                recommendation={listingData.aiSuggestions.category_recommendation}
                                selectedCategory={listingData.categoryId}
                                language={language}
                                onSelectCategory={(id) => onDataChange({ categoryId: id })}
                            />
                        </div>
                    )}

                    {/* Title */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            {t.productTitle}
                        </h3>
                        <input
                            type="text"
                            value={listingData.title}
                            onChange={(e) => onDataChange({ title: e.target.value })}
                            placeholder={language === 'th' ? 'เช่น iPhone 13 Pro สีน้ำเงิน 256GB' : 'e.g. iPhone 13 Pro Blue 256GB'}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />

                        {listingData.aiSuggestions?.title_suggestions && (
                            <div className="mt-4">
                                <SmartTitleSuggestion
                                    suggestions={listingData.aiSuggestions.title_suggestions}
                                    userTitle={listingData.title}
                                    language={language}
                                    onApplySuggestion={(title) => onDataChange({ title })}
                                />
                            </div>
                        )}
                    </div>

                    {/* Price */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-green-600" />
                            {t.price}
                        </h3>
                        <input
                            type="number"
                            value={listingData.price || ''}
                            onChange={(e) => onDataChange({ price: parseFloat(e.target.value) || 0 })}
                            placeholder="0"
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-xl font-bold"
                        />

                        {listingData.aiSuggestions?.price_guidance && (
                            <div className="mt-4 grid grid-cols-3 gap-2">
                                <button
                                    onClick={() => onDataChange({ price: Math.round(listingData.aiSuggestions!.price_guidance!.market_range.min) })}
                                    className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg text-center hover:bg-orange-200 transition-colors"
                                >
                                    <p className="text-xs text-orange-600">Quick</p>
                                    <p className="text-sm font-bold text-orange-700">
                                        ฿{Math.round(listingData.aiSuggestions.price_guidance.market_range.min).toLocaleString()}
                                    </p>
                                </button>
                                <button
                                    onClick={() => onDataChange({ price: Math.round(listingData.aiSuggestions!.price_guidance!.market_range.average) })}
                                    className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-center hover:bg-green-200 transition-colors"
                                >
                                    <p className="text-xs text-green-600">⭐ Market</p>
                                    <p className="text-sm font-bold text-green-700">
                                        ฿{Math.round(listingData.aiSuggestions.price_guidance.market_range.average).toLocaleString()}
                                    </p>
                                </button>
                                <button
                                    onClick={() => onDataChange({ price: Math.round(listingData.aiSuggestions!.price_guidance!.market_range.max) })}
                                    className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-center hover:bg-purple-200 transition-colors"
                                >
                                    <p className="text-xs text-purple-600">Max</p>
                                    <p className="text-sm font-bold text-purple-700">
                                        ฿{Math.round(listingData.aiSuggestions.price_guidance.market_range.max).toLocaleString()}
                                    </p>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            {t.description}
                        </h3>
                        <textarea
                            value={listingData.description}
                            onChange={(e) => onDataChange({ description: e.target.value })}
                            placeholder={t.descPlaceholder}
                            rows={8}
                            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                        />
                    </div>

                    {/* Condition */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                            {t.condition}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                            {Object.entries(t.conditions).map(([value, label]) => (
                                <button
                                    key={value}
                                    onClick={() => onDataChange({ condition: value })}
                                    className={`p-3 rounded-xl border-2 font-medium transition-all ${listingData.condition === value
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                                        : 'border-gray-300 dark:border-gray-600 hover:border-purple-300'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Location */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-red-600" />
                            {t.location}
                        </h3>
                        <AddressSelector
                            selectedProvince={listingData.province}
                            selectedAmphoe={listingData.amphoe}
                            selectedDistrict={listingData.district}
                            selectedZipcode={listingData.zipcode}
                            onAddressChange={(address) => {
                                onDataChange({
                                    province: address.province,
                                    amphoe: address.amphoe,
                                    district: address.district,
                                    zipcode: address.zipcode
                                })
                            }}
                        />
                    </div>

                    {/* Shipping */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                            <Truck className="w-5 h-5 text-blue-600" />
                            {t.shipping}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {Object.entries(t.shippingOptions).map(([value, label]) => (
                                <label
                                    key={value}
                                    className="flex items-center gap-3 p-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 hover:border-blue-300 cursor-pointer transition-all"
                                >
                                    <input
                                        type="checkbox"
                                        checked={listingData.shippingMethods.includes(value)}
                                        onChange={(e) => {
                                            const methods = e.target.checked
                                                ? [...listingData.shippingMethods, value]
                                                : listingData.shippingMethods.filter(m => m !== value)
                                            onDataChange({ shippingMethods: methods })
                                        }}
                                        className="w-5 h-5 text-blue-600 rounded"
                                    />
                                    <span className="font-medium text-gray-900 dark:text-white">
                                        {label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar - Right */}
                <div className="space-y-6">
                    {/* Sell Score */}
                    <div className={`bg-gradient-to-br ${getScoreColor(sellScore)} rounded-2xl p-6 text-white shadow-lg`}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold">{t.sellScore}</h3>
                            <Star className="w-6 h-6" />
                        </div>

                        <div className="text-center mb-6">
                            <div className="text-5xl font-bold mb-2">{sellScore}%</div>
                            <div className="text-xl font-semibold">
                                {t.grade[listingData.sellGrade || 'F']}
                            </div>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span>Images</span>
                                <span className="font-bold">{Math.min(listingData.images.length, 6)}/6</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Title</span>
                                <span className="font-bold">{listingData.title.length > 10 ? '✓' : '✗'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Description</span>
                                <span className="font-bold">{listingData.description.length > 50 ? '✓' : '✗'}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Price</span>
                                <span className="font-bold">{listingData.price > 0 ? '✓' : '✗'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Trust Boost */}
                    {sellScore >= 75 && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-2xl p-6"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                                <h4 className="font-bold text-green-900 dark:text-green-100">
                                    {t.trustBoost}
                                </h4>
                            </div>
                            <p className="text-sm text-green-800 dark:text-green-200">
                                {t.betterThanAvg} <strong>75%</strong>
                            </p>
                        </motion.div>
                    )}

                    {/* Publish Button */}
                    <button
                        onClick={handlePublish}
                        disabled={isPublishing || sellScore < 40}
                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                    >
                        {isPublishing ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                {t.publishing}
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                {t.publish}
                            </>
                        )}
                    </button>

                    {sellScore < 40 && (
                        <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded-xl">
                            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-yellow-800 dark:text-yellow-200">
                                {language === 'th'
                                    ? 'กรุณากรอกข้อมูลให้ครบจึงจะสามารถเผยแพร่ได้'
                                    : 'Please complete required fields to publish'}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

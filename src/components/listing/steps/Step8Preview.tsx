'use client'

import React from 'react'
import { Eye, Award, TrendingUp, Users, Clock, Sparkles, Rocket, Loader2 } from 'lucide-react'
import Image from 'next/image'
import { AIBuyabilityScore } from '@/services/aiSmartListing'
import { ListingData } from '../AISmartListingFlow'

interface Step8PreviewProps {
    listingData: ListingData
    buyabilityScore?: AIBuyabilityScore
    language: 'th' | 'en'
    onPublish: () => void
    isPublishing: boolean
}

export default function Step8Preview({
    listingData,
    buyabilityScore,
    language,
    onPublish,
    isPublishing
}: Step8PreviewProps) {
    const content = {
        th: {
            title: 'ตัวอย่างและคะแนนความน่าซื้อ',
            subtitle: 'ตรวจสอบก่อนเผยแพร่',
            buyabilityScore: 'คะแนนความน่าซื้อ',
            excellent: 'ยอดเยี่ยม',
            good: 'ดี',
            average: 'ปานกลาง',
            needsWork: 'ต้องปรับปรุง',
            strengths: 'จุดแข็ง',
            improvements: 'ควรปรับปรุง',
            salesPotential: 'โอกาสในการขาย',
            viewsPerDay: 'ผู้ชมต่อวัน',
            likelihood: 'โอกาสขายได้',
            expectedDays: 'คาดว่าขายได้ภายใน',
            days: 'วัน',
            publish: 'เผยแพร่ประกาศ',
            publishing: 'กำลังเผยแพร่...'
        },
        en: {
            title: 'Preview & Buyability Score',
            subtitle: 'Review before publishing',
            buyabilityScore: 'Buyability Score',
            excellent: 'Excellent',
            good: 'Good',
            average: 'Average',
            needsWork: 'Needs Work',
            strengths: 'Strengths',
            improvements: 'Improvements',
            salesPotential: 'Sales Potential',
            viewsPerDay: 'Views/Day',
            likelihood: 'Sale Likelihood',
            expectedDays: 'Expected to sell in',
            days: 'days',
            publish: 'Publish Listing',
            publishing: 'Publishing...'
        }
    }

    const t = content[language]

    const getScoreGrade = (score: number) => {
        if (score >= 85) return t.excellent
        if (score >= 70) return t.good
        if (score >= 50) return t.average
        return t.needsWork
    }

    const getScoreColor = (score: number) => {
        if (score >= 85) return 'from-green-500 to-emerald-600'
        if (score >= 70) return 'from-blue-500 to-cyan-600'
        if (score >= 50) return 'from-yellow-500 to-orange-600'
        return 'from-red-500 to-pink-600'
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Eye className="w-8 h-8 text-pink-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.title}</h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">{t.subtitle}</p>
            </div>

            {/* Buyability Score Card */}
            {buyabilityScore && (
                <div className={`bg-gradient-to-br ${getScoreColor(buyabilityScore.overallScore)} rounded-3xl p-8 text-white shadow-2xl`}>
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-medium opacity-90 mb-2">{t.buyabilityScore}</h3>
                            <div className="flex items-baseline gap-2">
                                <span className="text-6xl font-bold">{buyabilityScore.overallScore}</span>
                                <span className="text-2xl opacity-75">/100</span>
                            </div>
                            <p className="mt-2 text-lg font-medium">{getScoreGrade(buyabilityScore.overallScore)}</p>
                        </div>
                        <Award className="w-24 h-24 opacity-20" />
                    </div>

                    {/* Breakdown */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3 bg-white/10 backdrop-blur-sm rounded-2xl p-4">
                        <div className="text-center">
                            <p className="text-xs opacity-75 mb-1">📸 Image</p>
                            <p className="text-lg font-bold">{buyabilityScore.breakdown.imageQuality}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs opacity-75 mb-1">✍️ Title</p>
                            <p className="text-lg font-bold">{Math.round(buyabilityScore.breakdown.titleQuality)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs opacity-75 mb-1">📝 Details</p>
                            <p className="text-lg font-bold">{Math.round(buyabilityScore.breakdown.descriptionQuality)}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs opacity-75 mb-1">💰 Price</p>
                            <p className="text-lg font-bold">{buyabilityScore.breakdown.pricingCompetitiveness}</p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs opacity-75 mb-1">🛡️ Trust</p>
                            <p className="text-lg font-bold">{buyabilityScore.breakdown.trustworthiness}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Strengths & Improvements */}
            {buyabilityScore && (
                <div className="grid md:grid-cols-2 gap-4">
                    {buyabilityScore.strengths[language].length > 0 && (
                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4">
                            <h4 className="font-bold text-green-900 dark:text-green-100 mb-3 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                {t.strengths}
                            </h4>
                            <ul className="space-y-2">
                                {buyabilityScore.strengths[language].map((str, idx) => (
                                    <li key={idx} className="text-sm text-green-800 dark:text-green-200">{str}</li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {buyabilityScore.improvements[language].length > 0 && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-4">
                            <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                {t.improvements}
                            </h4>
                            <ul className="space-y-2">
                                {buyabilityScore.improvements[language].map((imp, idx) => (
                                    <li key={idx} className="text-sm text-blue-800 dark:text-blue-200">{imp}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Sales Potential */}
            {buyabilityScore && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-2xl p-6">
                    <h4 className="font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        {t.salesPotential}
                    </h4>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
                            <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {buyabilityScore.estimatedSalesPotential.viewsPerDay}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t.viewsPerDay}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
                            <TrendingUp className="w-8 h-8 text-green-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {buyabilityScore.estimatedSalesPotential.likelihoodToSell}%
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{t.likelihood}</p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 text-center">
                            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {buyabilityScore.estimatedSalesPotential.expectedSoldDays}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                {t.expectedDays} {t.days}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Product Preview */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="font-bold text-gray-900 dark:text-white">
                        {language === 'th' ? 'ตัวอย่างประกาศ' : 'Listing Preview'}
                    </h4>
                </div>

                <div className="p-6 space-y-4">
                    {/* Images */}
                    {listingData.images.length > 0 && (
                        <div className="grid grid-cols-4 gap-2">
                            {listingData.images.slice(0, 4).map((img, idx) => (
                                <div key={idx} className="aspect-square relative rounded-lg overflow-hidden">
                                    <Image
                                        src={URL.createObjectURL(img)}
                                        alt={`Product ${idx + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Title & Price */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {listingData.title}
                        </h3>
                        <p className="text-3xl font-bold text-purple-600">
                            ฿{listingData.price.toLocaleString()}
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                            {listingData.description}
                        </p>
                    </div>

                    {/* Location */}
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                        📍 {listingData.province} {listingData.amphoe}
                    </div>
                </div>
            </div>

            {/* Publish Button */}
            <button
                onClick={onPublish}
                disabled={isPublishing}
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
    )
}

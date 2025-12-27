'use client'

import React, { useState } from 'react'
import { FileText, Sparkles, DollarSign, TrendingUp, Zap, Copy } from 'lucide-react'
import { motion } from 'framer-motion'
import { AITitleSuggestion, AIPriceSuggestion } from '@/services/aiSmartListing'

interface Step3TitlePriceProps {
    title: string
    price: number
    titleSuggestions?: AITitleSuggestion
    priceSuggestion?: AIPriceSuggestion
    onTitleChange: (title: string) => void
    onPriceChange: (price: number) => void
    language: 'th' | 'en'
}

export default function Step3TitlePrice({
    title,
    price,
    titleSuggestions,
    priceSuggestion,
    onTitleChange,
    onPriceChange,
    language
}: Step3TitlePriceProps) {
    const [showAllTitles, setShowAllTitles] = useState(false)

    const content = {
        th: {
            title: 'ชื่อสินค้า & ราคา',
            subtitle: 'AI จะช่วยสร้างชื่อที่ดึงดูดและแนะนำราคาที่เหมาะสม',
            productTitle: 'ชื่อสินค้า',
            titlePlaceholder: 'เช่น TV Samsung 55 นิ้ว, เสื้อยืด Uniqlo, iPhone 15',
            aiSuggestions: 'คำแนะนำจาก AI',
            useThis: 'ใช้ชื่อนี้',
            productPrice: 'ราคา (บาท)',
            pricePlaceholder: 'ระบุราคา',
            aiPriceAnalysis: 'วิเคราะห์ราคาจาก AI',
            quickSell: 'ขายไว',
            suggested: 'แนะนำ',
            maxProfit: 'กำไรสูงสุด',
            confidence: 'ความเชื่อมั่น',
            priceTips: 'เคล็ดลับการตั้งราคา',
            showMore: 'ดูเพิ่ม',
            showLess: 'ซ่อน',
            copied: 'คัดลอกแล้ว!'
        },
        en: {
            title: 'Title & Price',
            subtitle: 'AI will help create attractive titles and suggest optimal pricing',
            productTitle: 'Product Title',
            titlePlaceholder: 'e.g. Samsung TV 55", Uniqlo Shirt, iPhone 15',
            aiSuggestions: 'AI Suggestions',
            useThis: 'Use This',
            productPrice: 'Price (THB)',
            pricePlaceholder: 'Enter price',
            aiPriceAnalysis: 'AI Price Analysis',
            quickSell: 'Quick Sell',
            suggested: 'Suggested',
            maxProfit: 'Max Profit',
            confidence: 'Confidence',
            priceTips: 'Pricing Tips',
            showMore: 'Show More',
            showLess: 'Show Less',
            copied: 'Copied!'
        }
    }

    const t = content[language]

    const handleCopyTitle = (titleText: string) => {
        navigator.clipboard.writeText(titleText)
        onTitleChange(titleText)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <FileText className="w-8 h-8 text-green-600" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {t.title}
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    {t.subtitle}
                </p>
            </div>

            {/* Title Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t.productTitle}
                    </span>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => onTitleChange(e.target.value)}
                        placeholder={t.titlePlaceholder}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    />
                    <div className="mt-2 text-xs text-gray-500">
                        {title.length}/100 {language === 'th' ? 'ตัวอักษร' : 'characters'}
                    </div>
                </label>

                {/* AI Title Suggestions */}
                {titleSuggestions && titleSuggestions.titles.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="font-bold text-green-900 dark:text-green-100 flex items-center gap-2">
                                <Sparkles className="w-5 h-5" />
                                {t.aiSuggestions}
                            </h4>
                            <button
                                onClick={() => setShowAllTitles(!showAllTitles)}
                                className="text-xs text-green-600 hover:text-green-700 font-medium"
                            >
                                {showAllTitles ? t.showLess : t.showMore}
                            </button>
                        </div>

                        <div className="space-y-2">
                            {titleSuggestions.titles.slice(0, showAllTitles ? undefined : 2).map((suggestion, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="bg-white dark:bg-gray-800 rounded-lg p-3 flex items-center justify-between gap-3 group hover:shadow-md transition-all"
                                >
                                    <div className="flex-1">
                                        <p className="text-sm text-gray-800 dark:text-gray-200">
                                            {suggestion.text}
                                        </p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-gray-500">
                                                {suggestion.style} • {suggestion.score}/100
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleCopyTitle(suggestion.text)}
                                        className="px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg text-xs font-medium hover:bg-green-200 dark:hover:bg-green-900/50 transition-all flex items-center gap-1"
                                    >
                                        <Copy className="w-3 h-3" />
                                        {t.useThis}
                                    </button>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Price Section */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 space-y-4">
                <label className="block">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                        {t.productPrice}
                    </span>
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="number"
                            value={price || ''}
                            onChange={(e) => onPriceChange(parseFloat(e.target.value) || 0)}
                            placeholder={t.pricePlaceholder}
                            min="0"
                            step="100"
                            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-lg font-semibold"
                        />
                    </div>
                </label>

                {/* AI Price Analysis */}
                {priceSuggestion && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                        <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            {t.aiPriceAnalysis}
                        </h4>

                        {/* Price Options */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                            <button
                                onClick={() => onPriceChange(priceSuggestion.quickSellPrice)}
                                className="bg-orange-100 dark:bg-orange-900/30 border-2 border-orange-300 dark:border-orange-700 rounded-xl p-3 text-center hover:border-orange-500 transition-all"
                            >
                                <p className="text-xs text-orange-600 dark:text-orange-400 mb-1">
                                    {t.quickSell}
                                </p>
                                <p className="text-lg font-bold text-orange-700 dark:text-orange-300">
                                    ฿{priceSuggestion.quickSellPrice.toLocaleString()}
                                </p>
                            </button>

                            <button
                                onClick={() => onPriceChange(priceSuggestion.marketPrice)}
                                className="bg-green-100 dark:bg-green-900/30 border-2 border-green-300 dark:border-green-700 rounded-xl p-3 text-center hover:border-green-500 transition-all"
                            >
                                <p className="text-xs text-green-600 dark:text-green-400 mb-1">
                                    ⭐ {t.suggested}
                                </p>
                                <p className="text-lg font-bold text-green-700 dark:text-green-300">
                                    ฿{priceSuggestion.marketPrice.toLocaleString()}
                                </p>
                            </button>

                            <button
                                onClick={() => onPriceChange(priceSuggestion.maxProfitPrice)}
                                className="bg-purple-100 dark:bg-purple-900/30 border-2 border-purple-300 dark:border-purple-700 rounded-xl p-3 text-center hover:border-purple-500 transition-all"
                            >
                                <p className="text-xs text-purple-600 dark:text-purple-400 mb-1">
                                    {t.maxProfit}
                                </p>
                                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                    ฿{priceSuggestion.maxProfitPrice.toLocaleString()}
                                </p>
                            </button>
                        </div>

                        {/* Reasoning */}
                        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 mb-3">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                {priceSuggestion.reasoning[language]}
                            </p>
                            <div className="mt-2 flex items-center gap-2">
                                <span className="text-xs text-gray-500">{t.confidence}:</span>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full"
                                        style={{ width: `${priceSuggestion.confidence * 100}%` }}
                                    />
                                </div>
                                <span className="text-xs font-medium text-blue-600">
                                    {Math.round(priceSuggestion.confidence * 100)}%
                                </span>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="space-y-1.5">
                            <p className="text-xs font-medium text-blue-900 dark:text-blue-100">
                                {t.priceTips}:
                            </p>
                            {priceSuggestion.tips[language].map((tip, index) => (
                                <p key={index} className="text-xs text-blue-800 dark:text-blue-200">
                                    {tip}
                                </p>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* AI Tip */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-xl p-4 flex items-start gap-3">
                <Zap className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-purple-900 dark:text-purple-100">
                    {language === 'th'
                        ? '💡 ชื่อที่ดีช่วยเพิ่มโอกาสในการค้นพบถึง 3 เท่า และราคาที่เหมาะสมช่วยขายเร็วขึ้น!'
                        : '💡 Good titles increase discoverability by 3x and optimal pricing helps sell faster!'
                    }
                </p>
            </div>
        </div>
    )
}

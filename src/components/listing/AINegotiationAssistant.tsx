'use client'

/**
 * AI Negotiation Assistant Component
 * 
 * ช่วยผู้ซื้อต่อราคาอย่างชาญฉลาด - ไม่ส่งเอง รอการอนุมัติ
 */

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Handshake, Lightbulb, Copy, Check, Sparkles, Target,
    ArrowRight, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { NegotiationSuggestion, generateNegotiationSuggestion, AIFairPrice } from '@/lib/ai-commerce'

interface AINegotiationAssistantProps {
    askingPrice: number
    fairPriceData?: AIFairPrice
    onSendOffer?: (price: number, message: string) => void
    productTitle?: string
}

export default function AINegotiationAssistant({
    askingPrice,
    fairPriceData,
    onSendOffer,
    productTitle
}: AINegotiationAssistantProps) {
    const { language } = useLanguage()
    const [suggestion, setSuggestion] = useState<NegotiationSuggestion | null>(null)
    const [expanded, setExpanded] = useState(false)
    const [customPrice, setCustomPrice] = useState<number>(0)
    const [copied, setCopied] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)

    useEffect(() => {
        const result = generateNegotiationSuggestion(askingPrice, fairPriceData)
        setSuggestion(result)
        setCustomPrice(result.suggestedPrice)
    }, [askingPrice, fairPriceData])

    if (!suggestion) return null

    const handleCopyMessage = () => {
        const message = language === 'th' ? suggestion.messageTemplate.th : suggestion.messageTemplate.en
        navigator.clipboard.writeText(message)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const handleSendOffer = () => {
        if (onSendOffer) {
            const message = language === 'th' ? suggestion.messageTemplate.th : suggestion.messageTemplate.en
            onSendOffer(customPrice, message)
            setShowConfirm(false)
        }
    }

    const getProbabilityColor = (prob: number) => {
        if (prob >= 70) return 'text-green-500'
        if (prob >= 50) return 'text-amber-500'
        return 'text-red-500'
    }

    const getProbabilityLabel = (prob: number) => {
        if (prob >= 70) return { th: 'มีโอกาสสูง', en: 'High Chance' }
        if (prob >= 50) return { th: 'มีโอกาสปานกลาง', en: 'Medium Chance' }
        return { th: 'มีโอกาสต่ำ', en: 'Low Chance' }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 rounded-xl border border-violet-200 dark:border-violet-800 overflow-hidden"
        >
            {/* Header */}
            <button
                onClick={() => setExpanded(!expanded)}
                className="w-full px-4 py-3 flex items-center justify-between hover:bg-violet-100/50 dark:hover:bg-violet-800/30 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-lg">
                        <Handshake className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                        <h4 className="font-bold text-violet-900 dark:text-violet-100">
                            {language === 'th' ? '🤝 AI ช่วยต่อราคา' : '🤝 AI Negotiation'}
                        </h4>
                        <p className="text-xs text-violet-600 dark:text-violet-400">
                            {language === 'th'
                                ? `แนะนำ: ฿${suggestion.suggestedPrice.toLocaleString()}`
                                : `Suggested: ฿${suggestion.suggestedPrice.toLocaleString()}`
                            }
                        </p>
                    </div>
                </div>
                {expanded ? (
                    <ChevronUp className="w-5 h-5 text-violet-500" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-violet-500" />
                )}
            </button>

            {/* Content */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-4 pb-4"
                    >
                        {/* Suggested Price */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <p className="text-xs text-gray-500">
                                        {language === 'th' ? 'ราคาแนะนำ' : 'Suggested Price'}
                                    </p>
                                    <p className="text-2xl font-black text-violet-600 dark:text-violet-400">
                                        ฿{suggestion.suggestedPrice.toLocaleString()}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-gray-500">
                                        {language === 'th' ? 'โอกาสรับ' : 'Acceptance'}
                                    </p>
                                    <p className={`text-xl font-bold ${getProbabilityColor(suggestion.acceptanceProbability)}`}>
                                        ~{suggestion.acceptanceProbability}%
                                    </p>
                                    <p className={`text-[10px] ${getProbabilityColor(suggestion.acceptanceProbability)}`}>
                                        {language === 'th'
                                            ? getProbabilityLabel(suggestion.acceptanceProbability).th
                                            : getProbabilityLabel(suggestion.acceptanceProbability).en
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Price Slider */}
                            <div className="mb-4">
                                <div className="flex justify-between text-[10px] text-gray-400 mb-1">
                                    <span>฿{suggestion.priceRange.tooLow.toLocaleString()}</span>
                                    <span>฿{askingPrice.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min={suggestion.priceRange.tooLow}
                                    max={askingPrice}
                                    value={customPrice}
                                    onChange={(e) => setCustomPrice(Number(e.target.value))}
                                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-violet-500"
                                />
                            </div>

                            {/* Quick Options */}
                            <div className="flex gap-2 mb-4">
                                {suggestion.priceRange.acceptable.map((price, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCustomPrice(price)}
                                        className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${customPrice === price
                                            ? 'bg-violet-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-violet-100'
                                            }`}
                                    >
                                        ฿{price.toLocaleString()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Strategy Tips */}
                        <div className="mb-4">
                            <h5 className="text-xs font-semibold text-gray-500 mb-2 flex items-center gap-1">
                                <Lightbulb className="w-3 h-3 text-amber-500" />
                                {language === 'th' ? 'เคล็ดลับ' : 'Tips'}
                            </h5>
                            <ul className="space-y-2">
                                {suggestion.strategyTips.map((tip, i) => (
                                    <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400"
                                    >
                                        <span>{tip.icon}</span>
                                        <span>{language === 'th' ? tip.text_th : tip.text_en}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Message Template */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 mb-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs font-semibold text-gray-500">
                                    {language === 'th' ? 'ข้อความแนะนำ' : 'Suggested Message'}
                                </p>
                                <button
                                    onClick={handleCopyMessage}
                                    className="flex items-center gap-1 text-xs text-violet-500 hover:text-violet-600"
                                >
                                    {copied ? (
                                        <>
                                            <Check className="w-3 h-3" />
                                            {language === 'th' ? 'คัดลอกแล้ว!' : 'Copied!'}
                                        </>
                                    ) : (
                                        <>
                                            <Copy className="w-3 h-3" />
                                            {language === 'th' ? 'คัดลอก' : 'Copy'}
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                                {language === 'th' ? suggestion.messageTemplate.th : suggestion.messageTemplate.en}
                            </p>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {!showConfirm ? (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowConfirm(true)}
                                    className="w-full py-3 bg-gradient-to-r from-violet-500 to-purple-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-500/30"
                                >
                                    <Target className="w-5 h-5" />
                                    {language === 'th'
                                        ? `ส่งข้อเสนอ ฿${customPrice.toLocaleString()}`
                                        : `Send Offer ฿${customPrice.toLocaleString()}`
                                    }
                                </motion.button>
                            ) : (
                                <div className="bg-amber-50 dark:bg-amber-900/30 rounded-xl p-4">
                                    <div className="flex items-start gap-2 mb-3">
                                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                                                {language === 'th' ? 'ยืนยันการส่ง?' : 'Confirm Send?'}
                                            </p>
                                            <p className="text-xs text-amber-600 dark:text-amber-400">
                                                {language === 'th'
                                                    ? 'ข้อเสนอจะถูกส่งไปยังผู้ขาย'
                                                    : 'Offer will be sent to seller'
                                                }
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setShowConfirm(false)}
                                            className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-lg"
                                        >
                                            {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                                        </button>
                                        <button
                                            onClick={handleSendOffer}
                                            className="flex-1 py-2 bg-violet-500 text-white font-medium rounded-lg flex items-center justify-center gap-1"
                                        >
                                            {language === 'th' ? 'ยืนยัน' : 'Confirm'}
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Disclaimer */}
                        <div className="mt-4 pt-3 border-t border-violet-200 dark:border-violet-700">
                            <p className="text-[10px] text-gray-400 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {language === 'th'
                                    ? 'AI ไม่รับรองผลลัพธ์ • ผู้ขายตัดสินใจเอง'
                                    : 'AI does not guarantee results • Seller decides'
                                }
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

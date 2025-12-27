'use client'

/**
 * MAKE OFFER MODAL
 * 
 * Modal for buyers to make price offers on listings
 */

import { useState } from 'react'
import { X, DollarSign, Send, Loader2, TrendingDown, Zap, AlertCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface MakeOfferModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (amount: number, message?: string) => Promise<void>
    listingTitle: string
    currentPrice: number
    suggestedOffer?: number
}

export default function MakeOfferModal({
    isOpen,
    onClose,
    onSubmit,
    listingTitle,
    currentPrice,
    suggestedOffer
}: MakeOfferModalProps) {
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'

    const [offerAmount, setOfferAmount] = useState<number>(suggestedOffer || Math.floor(currentPrice * 0.9))
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState('')

    // Translations
    const t = {
        title: lang === 'th' ? 'เสนอราคา' : 'Make an Offer',
        currentPrice: lang === 'th' ? 'ราคาปัจจุบัน' : 'Current Price',
        yourOffer: lang === 'th' ? 'ราคาที่ต้องการเสนอ' : 'Your Offer',
        message: lang === 'th' ? 'ข้อความถึงผู้ขาย (ไม่บังคับ)' : 'Message to Seller (optional)',
        messagePlaceholder: lang === 'th'
            ? 'เช่น: สนใจมาก ต่อรองได้ไหมครับ?'
            : 'e.g., Very interested, can we negotiate?',
        quickOffers: lang === 'th' ? 'เสนอด่วน' : 'Quick Offers',
        submit: lang === 'th' ? 'ส่งข้อเสนอ' : 'Send Offer',
        cancel: lang === 'th' ? 'ยกเลิก' : 'Cancel',
        discount: lang === 'th' ? 'ลด' : 'off',
        tooLow: lang === 'th' ? 'ราคาต่ำเกินไป (ต่ำกว่า 50%)' : 'Offer too low (below 50%)',
        tooHigh: lang === 'th' ? 'ราคาสูงกว่าราคาขาย' : 'Offer higher than asking price',
        aiSuggestion: lang === 'th' ? 'AI แนะนำ' : 'AI Suggested',
    }

    // Quick offer percentages
    const quickOffers = [
        { percent: 5, label: '-5%' },
        { percent: 10, label: '-10%' },
        { percent: 15, label: '-15%' },
        { percent: 20, label: '-20%' },
    ]

    // Calculate discount percentage
    const discountPercent = Math.round(((currentPrice - offerAmount) / currentPrice) * 100)

    // Validate offer
    const validateOffer = () => {
        if (offerAmount < currentPrice * 0.5) {
            setError(t.tooLow)
            return false
        }
        if (offerAmount > currentPrice) {
            setError(t.tooHigh)
            return false
        }
        setError('')
        return true
    }

    // Handle submit
    const handleSubmit = async () => {
        if (!validateOffer()) return

        setIsSubmitting(true)
        try {
            await onSubmit(offerAmount, message || undefined)
            onClose()
        } catch (err) {
            console.error('Error submitting offer:', err)
            setError(lang === 'th' ? 'เกิดข้อผิดพลาด กรุณาลองใหม่' : 'Error submitting offer')
        } finally {
            setIsSubmitting(false)
        }
    }

    // Handle quick offer
    const handleQuickOffer = (percent: number) => {
        const newAmount = Math.floor(currentPrice * (1 - percent / 100))
        setOfferAmount(newAmount)
        setError('')
    }

    // Format number with commas
    const formatNumber = (num: number) => num.toLocaleString('th-TH')

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-md bg-slate-900 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                            <DollarSign className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-white">{t.title}</h2>
                            <p className="text-sm text-gray-400 line-clamp-1">{listingTitle}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-slate-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-5">
                    {/* Current Price */}
                    <div className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl">
                        <span className="text-gray-400">{t.currentPrice}</span>
                        <span className="text-xl font-bold text-white">฿{formatNumber(currentPrice)}</span>
                    </div>

                    {/* Your Offer Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            {t.yourOffer}
                        </label>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400">฿</span>
                            <input
                                type="number"
                                value={offerAmount}
                                onChange={(e) => {
                                    setOfferAmount(Number(e.target.value))
                                    setError('')
                                }}
                                className="w-full pl-10 pr-20 py-4 bg-slate-800 border border-slate-600 rounded-xl text-xl font-bold text-white focus:outline-none focus:border-purple-500"
                            />
                            {discountPercent > 0 && (
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 px-2 py-1 bg-emerald-500/20 text-emerald-400 text-sm rounded-lg">
                                    -{discountPercent}% {t.discount}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Quick Offers */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            <Zap className="w-4 h-4 inline mr-1" />
                            {t.quickOffers}
                        </label>
                        <div className="grid grid-cols-4 gap-2">
                            {quickOffers.map(({ percent, label }) => (
                                <button
                                    key={percent}
                                    onClick={() => handleQuickOffer(percent)}
                                    className={`py-2.5 rounded-xl text-sm font-medium transition-all ${discountPercent === percent
                                            ? 'bg-purple-500 text-white'
                                            : 'bg-slate-800 text-gray-400 hover:bg-slate-700 hover:text-white'
                                        }`}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* AI Suggestion */}
                    {suggestedOffer && (
                        <button
                            onClick={() => setOfferAmount(suggestedOffer)}
                            className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl border border-purple-500/30 text-purple-400 hover:border-purple-500/50"
                        >
                            <span className="flex items-center gap-2">
                                <TrendingDown className="w-4 h-4" />
                                {t.aiSuggestion}
                            </span>
                            <span className="font-bold">฿{formatNumber(suggestedOffer)}</span>
                        </button>
                    )}

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">
                            {t.message}
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder={t.messagePlaceholder}
                            rows={2}
                            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
                        />
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 text-red-400 text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 pt-0">
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 bg-slate-700 hover:bg-slate-600 text-gray-300 rounded-xl font-medium transition-colors"
                    >
                        {t.cancel}
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !!error}
                        className="flex-1 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-600 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                {t.submit}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

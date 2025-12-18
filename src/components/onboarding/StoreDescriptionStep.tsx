'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FileText,
    Sparkles,
    Wand2,
    Check,
    TrendingUp,
    Shield,
    Eye,
    Loader2,
    ChevronRight,
    AlertCircle,
    Zap,
    RefreshCw
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

interface DescriptionSuggestion {
    text: string
    seoScore: number
    trustScore: number
    readability: 'low' | 'medium' | 'high'
}

interface ScoreResult {
    seoScore: number
    trustScore: number
    readability: 'low' | 'medium' | 'high'
    suggestions: string[]
}

const TONES = [
    { id: 'friendly', label: { th: 'เป็นกันเอง', en: 'Friendly' }, icon: '😊' },
    { id: 'professional', label: { th: 'มืออาชีพ', en: 'Professional' }, icon: '💼' },
    { id: 'luxury', label: { th: 'หรูหรา', en: 'Luxury' }, icon: '💎' },
    { id: 'cute', label: { th: 'น่ารัก', en: 'Cute' }, icon: '🌸' },
    { id: 'minimal', label: { th: 'กระชับ', en: 'Minimal' }, icon: '◯' },
    { id: 'energetic', label: { th: 'กระตือรือร้น', en: 'Energetic' }, icon: '⚡' },
    { id: 'storytelling', label: { th: 'เล่าเรื่อง', en: 'Storytelling' }, icon: '📖' }
] as const

type Tone = typeof TONES[number]['id']

const CHAR_LIMIT = { min: 150, max: 350, ideal: 250 }

export default function StoreDescriptionStep() {
    const router = useRouter()
    const { language, t } = useLanguage()

    // States
    const [descriptionInput, setDescriptionInput] = useState('')
    const [selectedTone, setSelectedTone] = useState<Tone>('friendly')
    const [suggestions, setSuggestions] = useState<DescriptionSuggestion[]>([])
    const [selectedSuggestion, setSelectedSuggestion] = useState<string>('')
    const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isBeautifying, setIsBeautifying] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)

    // Generate AI descriptions
    const generateDescriptions = async () => {
        setIsGenerating(true)
        setShowSuggestions(true)
        try {
            // TODO: Replace with actual AI API call
            // const response = await fetch('/api/ai/generate-descriptions', {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         storeName: 'My Shop',
            //         tone: selectedTone,
            //         language
            //     })
            // })
            // const data = await response.json()

            await new Promise(resolve => setTimeout(resolve, 2000))

            // Mock suggestions
            const mockSuggestions: DescriptionSuggestion[] = language === 'th' ? [
                {
                    text: 'ร้านของเรามุ่งมั่นคัดสรรสินค้าแนวมินิมอลคุณภาพดี ที่คุณสามารถใช้ได้ทุกวัน เพื่อสร้างพื้นที่อยู่อาศัยที่อบอุ่นและเรียบง่าย พร้อมบริการจัดส่งรวดเร็วและดูแลหลังการขายอย่างใส่ใจ',
                    seoScore: 78,
                    trustScore: 88,
                    readability: 'high'
                },
                {
                    text: 'เราคือร้านที่รวบรวมสินค้าไลฟ์สไตล์สมัยใหม่ ออกแบบมาเพื่อคนรุ่นใหม่ที่รักความเรียบง่าย ทุกชิ้นผ่านการคัดสรรอย่างพิถีพิถัน เพื่อให้คุณได้สินค้าที่ดีที่สุดในราคาที่คุ้มค่า',
                    seoScore: 82,
                    trustScore: 85,
                    readability: 'high'
                },
                {
                    text: 'ยินดีต้อนรับสู่ร้านของเรา! เราเชื่อว่าบ้านที่ดีเริ่มต้นจากของใช้ที่ดี เราจึงนำเสนอสินค้าคุณภาพที่ช่วยให้ชีวิตของคุณง่ายขึ้นและสวยงามขึ้น พร้อมบริการที่เป็นมิตรและจัดส่งรวดเร็ว',
                    seoScore: 75,
                    trustScore: 90,
                    readability: 'high'
                }
            ] : [
                {
                    text: 'Welcome to our curated collection of minimal lifestyle products. We carefully select each item to bring simplicity and warmth to your daily life. Fast shipping and dedicated customer care included.',
                    seoScore: 80,
                    trustScore: 92,
                    readability: 'high'
                },
                {
                    text: 'We believe great homes start with great products. Our shop offers modern, quality items designed for people who love simple living. Every piece is handpicked to ensure you get the best value.',
                    seoScore: 85,
                    trustScore: 88,
                    readability: 'medium'
                },
                {
                    text: 'Discover thoughtfully curated home essentials that make life easier and more beautiful. We focus on quality, sustainability, and timeless design. Join our community of mindful shoppers today.',
                    seoScore: 77,
                    trustScore: 86,
                    readability: 'high'
                }
            ]

            setSuggestions(mockSuggestions)
        } catch (error) {
            console.error('Error generating descriptions:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    // Beautify description
    const beautifyDescription = async () => {
        if (!descriptionInput.trim()) return

        setIsBeautifying(true)
        try {
            // TODO: Replace with actual AI API call
            await new Promise(resolve => setTimeout(resolve, 1500))

            // Mock beautification
            const beautified = descriptionInput.trim()
                .replace(/\s+/g, ' ')
                .replace(/\.\s*/g, '. ')
                .replace(/,\s*/g, ', ')

            setDescriptionInput(beautified)
            analyzeDescription(beautified)
        } catch (error) {
            console.error('Error beautifying description:', error)
        } finally {
            setIsBeautifying(false)
        }
    }

    // Analyze description
    const analyzeDescription = async (text: string) => {
        if (!text.trim() || text.length < 50) return

        setIsAnalyzing(true)
        try {
            // TODO: Replace with actual AI API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock analysis
            const charCount = text.length
            const seoScore = Math.min(100, Math.max(40,
                70 + (charCount >= CHAR_LIMIT.min ? 10 : -10) +
                (charCount <= CHAR_LIMIT.max ? 10 : -10)
            ))
            const trustScore = Math.floor(Math.random() * 20) + 80

            const mockResult: ScoreResult = {
                seoScore,
                trustScore,
                readability: charCount < 200 ? 'high' : charCount < 300 ? 'medium' : 'low',
                suggestions: seoScore < 70
                    ? [language === 'th'
                        ? 'ลองเพิ่มคำที่บอกประโยชน์ของสินค้า'
                        : 'Try adding words that describe product benefits'
                    ]
                    : []
            }

            setScoreResult(mockResult)
        } catch (error) {
            console.error('Error analyzing description:', error)
        } finally {
            setIsAnalyzing(false)
        }
    }

    // Handle suggestion selection
    const handleSelectSuggestion = (suggestion: DescriptionSuggestion) => {
        setSelectedSuggestion(suggestion.text)
        setDescriptionInput(suggestion.text)
        setScoreResult({
            seoScore: suggestion.seoScore,
            trustScore: suggestion.trustScore,
            readability: suggestion.readability,
            suggestions: []
        })
        setShowSuggestions(false)
    }

    // Auto-analyze on input change
    useEffect(() => {
        const timer = setTimeout(() => {
            if (descriptionInput.trim().length >= 50) {
                analyzeDescription(descriptionInput)
            }
        }, 1000)

        return () => clearTimeout(timer)
    }, [descriptionInput])

    // Save and continue
    const handleSaveAndContinue = () => {
        if (!descriptionInput.trim()) {
            alert(language === 'th' ? 'กรุณาเขียนคำอธิบายร้าน' : 'Please write a store description')
            return
        }

        if (descriptionInput.length < CHAR_LIMIT.min) {
            alert(language === 'th'
                ? `คำอธิบายสั้นเกินไป (ควรมีอย่างน้อย ${CHAR_LIMIT.min} ตัวอักษร)`
                : `Description too short (minimum ${CHAR_LIMIT.min} characters)`
            )
            return
        }

        // TODO: Save to backend
        // await updateOnboardingProgress(user.uid, {
        //     description: descriptionInput,
        //     onboardingProgress: 3
        // })

        router.push('/onboarding/4')
    }

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400'
        if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
        return 'text-red-600 dark:text-red-400'
    }

    const getReadabilityLabel = (readability: string) => {
        const labels = {
            high: language === 'th' ? 'อ่านง่าย' : 'Easy',
            medium: language === 'th' ? 'ปานกลาง' : 'Medium',
            low: language === 'th' ? 'ยาก' : 'Hard'
        }
        return labels[readability as keyof typeof labels]
    }

    const charCount = descriptionInput.length
    const isIdealLength = charCount >= CHAR_LIMIT.min && charCount <= CHAR_LIMIT.max

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-6 shadow-2xl shadow-purple-500/30">
                        <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        {language === 'th' ? 'เขียนคำอธิบายร้าน' : 'Write Store Description'}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {language === 'th'
                            ? 'บอกเล่าเกี่ยวกับร้านของคุณ หรือให้ AI ช่วยเขียนให้'
                            : 'Tell customers about your shop or let AI write it for you'
                        }
                    </p>
                </motion.div>

                {/* Tone Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6"
                >
                    <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                        {language === 'th' ? 'เลือกน้ำเสียง' : 'Choose Tone'}
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {TONES.map((tone) => (
                            <button
                                key={tone.id}
                                onClick={() => setSelectedTone(tone.id)}
                                className={`
                                    p-4 rounded-xl border-2 transition-all
                                    ${selectedTone === tone.id
                                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                    }
                                `}
                            >
                                <div className="text-2xl mb-2">{tone.icon}</div>
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                    {tone.label[language]}
                                </div>
                            </button>
                        ))}
                    </div>
                </motion.div>

                {/* AI Generate Button */}
                <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={generateDescriptions}
                    disabled={isGenerating}
                    className="w-full mb-6 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isGenerating ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {language === 'th' ? 'กำลังสร้างคำอธิบาย...' : 'Generating descriptions...'}
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-5 h-5" />
                            {language === 'th' ? 'ให้ AI เขียนให้' : 'Generate with AI'}
                        </>
                    )}
                </motion.button>

                {/* AI Suggestions */}
                <AnimatePresence>
                    {showSuggestions && suggestions.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="mb-6 space-y-3"
                        >
                            {suggestions.map((suggestion, index) => (
                                <motion.button
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    onClick={() => handleSelectSuggestion(suggestion)}
                                    className={`
                                        w-full p-4 rounded-xl border-2 transition-all text-left
                                        ${selectedSuggestion === suggestion.text
                                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                            : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300'
                                        }
                                    `}
                                >
                                    <p className="text-gray-900 dark:text-white mb-3">
                                        {suggestion.text}
                                    </p>
                                    <div className="flex items-center gap-4 text-xs">
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="w-3.5 h-3.5" />
                                            <span className={getScoreColor(suggestion.seoScore)}>
                                                SEO: {suggestion.seoScore}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Shield className="w-3.5 h-3.5" />
                                            <span className={getScoreColor(suggestion.trustScore)}>
                                                Trust: {suggestion.trustScore}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Eye className="w-3.5 h-3.5" />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {getReadabilityLabel(suggestion.readability)}
                                            </span>
                                        </div>
                                    </div>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Text Input */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 mb-6"
                >
                    <div className="flex items-center justify-between mb-4">
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {language === 'th' ? 'คำอธิบายร้าน' : 'Store Description'}
                        </label>
                        <div className="flex items-center gap-2">
                            <span className={`text-sm font-medium ${isIdealLength
                                    ? 'text-green-600 dark:text-green-400'
                                    : charCount < CHAR_LIMIT.min
                                        ? 'text-red-600 dark:text-red-400'
                                        : 'text-yellow-600 dark:text-yellow-400'
                                }`}>
                                {charCount} / {CHAR_LIMIT.ideal}
                            </span>
                        </div>
                    </div>

                    <textarea
                        value={descriptionInput}
                        onChange={(e) => setDescriptionInput(e.target.value)}
                        placeholder={language === 'th'
                            ? 'เขียนคำอธิบายร้านของคุณที่นี่...'
                            : 'Write your store description here...'
                        }
                        rows={6}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />

                    <div className="mt-3 flex items-center justify-between">
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            {language === 'th'
                                ? `แนะนำ ${CHAR_LIMIT.min}-${CHAR_LIMIT.max} ตัวอักษร`
                                : `Recommended ${CHAR_LIMIT.min}-${CHAR_LIMIT.max} characters`
                            }
                        </p>
                        <button
                            onClick={beautifyDescription}
                            disabled={!descriptionInput.trim() || isBeautifying}
                            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors disabled:opacity-50 text-sm font-medium"
                        >
                            {isBeautifying ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {language === 'th' ? 'กำลังปรับแต่ง...' : 'Beautifying...'}
                                </>
                            ) : (
                                <>
                                    <Wand2 className="w-4 h-4" />
                                    {language === 'th' ? 'ปรับให้สวยขึ้น' : 'Beautify'}
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>

                {/* Score Results */}
                <AnimatePresence>
                    {scoreResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid md:grid-cols-3 gap-4 mb-6"
                        >
                            {/* SEO Score */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <TrendingUp className="w-5 h-5 text-purple-500" />
                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                        {language === 'th' ? 'คะแนน SEO' : 'SEO Score'}
                                    </h3>
                                </div>
                                <div className={`text-3xl font-bold ${getScoreColor(scoreResult.seoScore)}`}>
                                    {scoreResult.seoScore}
                                </div>
                                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${scoreResult.seoScore}%` }}
                                        className={`h-full ${scoreResult.seoScore >= 80 ? 'bg-green-500' :
                                                scoreResult.seoScore >= 60 ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                            }`}
                                    />
                                </div>
                            </div>

                            {/* Trust Score */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-5 h-5 text-purple-500" />
                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                        {language === 'th' ? 'ความน่าเชื่อถือ' : 'Trust Score'}
                                    </h3>
                                </div>
                                <div className={`text-3xl font-bold ${getScoreColor(scoreResult.trustScore)}`}>
                                    {scoreResult.trustScore}
                                </div>
                                <div className="mt-2 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${scoreResult.trustScore}%` }}
                                        className="h-full bg-green-500"
                                    />
                                </div>
                            </div>

                            {/* Readability */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center gap-2 mb-2">
                                    <Eye className="w-5 h-5 text-purple-500" />
                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                        {language === 'th' ? 'ความอ่านง่าย' : 'Readability'}
                                    </h3>
                                </div>
                                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                    {getReadabilityLabel(scoreResult.readability)}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Suggestions */}
                {scoreResult && scoreResult.suggestions.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800 mb-6"
                    >
                        <div className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">
                                    {language === 'th' ? 'คำแนะนำ:' : 'Suggestions:'}
                                </p>
                                <ul className="space-y-1">
                                    {scoreResult.suggestions.map((suggestion, index) => (
                                        <li key={index} className="text-sm text-orange-600 dark:text-orange-400">
                                            • {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Continue Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={handleSaveAndContinue}
                    disabled={!descriptionInput.trim() || descriptionInput.length < CHAR_LIMIT.min}
                    className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {language === 'th' ? 'บันทึกและดำเนินการต่อ' : 'Save & Continue'}
                    <ChevronRight className="w-5 h-5" />
                </motion.button>
            </div>
        </div>
    )
}

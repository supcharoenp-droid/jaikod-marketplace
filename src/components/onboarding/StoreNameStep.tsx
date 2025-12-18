'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Store,
    Sparkles,
    Check,
    X,
    AlertCircle,
    Wand2,
    RefreshCw,
    TrendingUp,
    Eye,
    Heart,
    Zap,
    ChevronRight,
    Loader2
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

interface AISuggestion {
    name: string
    meaning: string
    seoScore: number
    readability: 'high' | 'medium' | 'low'
}

interface ValidationResult {
    exists: boolean
    seoScore: number
    issues: string[]
    suggestions: string[]
}

const TONES = ['friendly', 'minimal', 'luxury', 'modern', 'playful'] as const
type Tone = typeof TONES[number]

export default function StoreNameStep() {
    const router = useRouter()
    const { language, t } = useLanguage()
    const { user } = useAuth()

    // States
    const [mode, setMode] = useState<'ai' | 'manual'>('ai')
    const [storeNameInput, setStoreNameInput] = useState('')
    const [selectedTone, setSelectedTone] = useState<Tone>('friendly')
    const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([])
    const [selectedSuggestion, setSelectedSuggestion] = useState<string>('')
    const [validationResult, setValidationResult] = useState<ValidationResult | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isValidating, setIsValidating] = useState(false)
    const [isBeautifying, setIsBeautifying] = useState(false)
    const [showValidation, setShowValidation] = useState(false)

    // Generate AI suggestions
    const generateSuggestions = async () => {
        setIsGenerating(true)
        try {
            // TODO: Replace with actual AI API call
            // const response = await fetch('/api/ai/generate-store-names', {
            //     method: 'POST',
            //     body: JSON.stringify({ language, tone: selectedTone })
            // })
            // const data = await response.json()

            // Mock AI suggestions
            await new Promise(resolve => setTimeout(resolve, 1500))

            const mockSuggestions: AISuggestion[] = language === 'th' ? [
                {
                    name: 'บ้านเรียบง่ายโมริ',
                    meaning: 'ร้านแนวมินิมอลสไตล์ญี่ปุ่น',
                    seoScore: 85,
                    readability: 'high'
                },
                {
                    name: 'ชีวิตดีดี',
                    meaning: 'ร้านของใช้ในบ้านคุณภาพดี',
                    seoScore: 78,
                    readability: 'high'
                },
                {
                    name: 'Modern Living Store',
                    meaning: 'ร้านไลฟ์สไตล์สมัยใหม่',
                    seoScore: 82,
                    readability: 'high'
                },
                {
                    name: 'คิดดีช้อปดี',
                    meaning: 'ร้านของใช้คัดสรรดี',
                    seoScore: 75,
                    readability: 'medium'
                },
                {
                    name: 'The Cozy Corner',
                    meaning: 'มุมอบอุ่นในบ้าน',
                    seoScore: 88,
                    readability: 'high'
                },
                {
                    name: 'สไตล์ดีดี',
                    meaning: 'ร้านของแต่งบ้านสไตล์ดี',
                    seoScore: 72,
                    readability: 'high'
                }
            ] : [
                {
                    name: 'Minimal Living Studio',
                    meaning: 'Simple modern lifestyle store',
                    seoScore: 82,
                    readability: 'high'
                },
                {
                    name: 'The Cozy Retro',
                    meaning: 'Vintage comfort items',
                    seoScore: 85,
                    readability: 'high'
                },
                {
                    name: 'Urban Nest',
                    meaning: 'Modern home essentials',
                    seoScore: 88,
                    readability: 'high'
                },
                {
                    name: 'Zen & Co',
                    meaning: 'Peaceful lifestyle products',
                    seoScore: 79,
                    readability: 'high'
                },
                {
                    name: 'The Daily Goods',
                    meaning: 'Everyday quality items',
                    seoScore: 76,
                    readability: 'high'
                },
                {
                    name: 'Hygge Home',
                    meaning: 'Cozy Scandinavian living',
                    seoScore: 83,
                    readability: 'medium'
                }
            ]

            setAiSuggestions(mockSuggestions)
        } catch (error) {
            console.error('Error generating suggestions:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    // Beautify name
    const beautifyName = async () => {
        if (!storeNameInput.trim()) return

        setIsBeautifying(true)
        try {
            // TODO: Replace with actual AI API call
            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock beautification
            const beautified = storeNameInput
                .split(' ')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
                .join(' ')

            setStoreNameInput(beautified)
        } catch (error) {
            console.error('Error beautifying name:', error)
        } finally {
            setIsBeautifying(false)
        }
    }

    // Validate store name
    const validateName = async (name: string) => {
        if (!name.trim()) return

        setIsValidating(true)
        setShowValidation(true)

        try {
            // TODO: Replace with actual API calls
            // 1. Check duplicate
            // const dupCheck = await fetch(`/api/check-store-name?name=${encodeURIComponent(name)}`)
            // const { exists } = await dupCheck.json()

            // 2. AI SEO analysis
            // const seoCheck = await fetch('/api/ai/analyze-store-name', {
            //     method: 'POST',
            //     body: JSON.stringify({ name, language })
            // })
            // const seoData = await seoCheck.json()

            await new Promise(resolve => setTimeout(resolve, 1000))

            // Mock validation
            const mockResult: ValidationResult = {
                exists: name.toLowerCase().includes('test'),
                seoScore: Math.floor(Math.random() * 30) + 70,
                issues: name.length < 5
                    ? [language === 'th' ? 'ชื่อสั้นเกินไป' : 'Name too short']
                    : [],
                suggestions: name.length < 5
                    ? [language === 'th'
                        ? 'ลองเพิ่มคำที่สื่อถึงหมวดสินค้า'
                        : 'Try adding words that describe your products'
                    ]
                    : []
            }

            setValidationResult(mockResult)
        } catch (error) {
            console.error('Error validating name:', error)
        } finally {
            setIsValidating(false)
        }
    }

    // Handle save and continue
    const handleSaveAndContinue = async () => {
        const finalName = mode === 'ai' ? selectedSuggestion : storeNameInput

        if (!finalName.trim()) {
            alert(language === 'th' ? 'กรุณาเลือกหรือพิมพ์ชื่อร้าน' : 'Please select or enter a store name')
            return
        }

        if (validationResult?.exists) {
            alert(language === 'th' ? 'ชื่อร้านนี้มีผู้ใช้งานแล้ว' : 'This store name is already taken')
            return
        }

        try {
            // TODO: Save to backend
            // await updateOnboardingProgress(user.uid, {
            //     storeName: finalName,
            //     onboardingProgress: 1
            // })

            // Navigate to next step
            router.push('/onboarding/2')
        } catch (error) {
            console.error('Error saving store name:', error)
        }
    }

    // Auto-validate when name changes
    useEffect(() => {
        const timer = setTimeout(() => {
            if (mode === 'manual' && storeNameInput.trim().length >= 3) {
                validateName(storeNameInput)
            }
        }, 500)

        return () => clearTimeout(timer)
    }, [storeNameInput, mode])

    const getToneLabel = (tone: Tone) => {
        const labels = {
            friendly: language === 'th' ? 'เป็นกันเอง' : 'Friendly',
            minimal: language === 'th' ? 'มินิมอล' : 'Minimal',
            luxury: language === 'th' ? 'หรูหรา' : 'Luxury',
            modern: language === 'th' ? 'ทันสมัย' : 'Modern',
            playful: language === 'th' ? 'สนุกสนาน' : 'Playful'
        }
        return labels[tone]
    }

    const getSEOColor = (score: number) => {
        if (score >= 80) return 'text-green-600 dark:text-green-400'
        if (score >= 60) return 'text-yellow-600 dark:text-yellow-400'
        return 'text-red-600 dark:text-red-400'
    }

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
                        <Store className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        {language === 'th' ? 'ตั้งชื่อร้านของคุณ' : 'Name Your Shop'}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {language === 'th'
                            ? 'ชื่อร้านที่ดีทำให้ลูกค้าจดจำได้ง่ายและค้นหาเจอเร็วขึ้น'
                            : 'A good shop name helps customers remember you and find you faster'
                        }
                    </p>
                </motion.div>

                {/* Mode Selection */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid md:grid-cols-2 gap-4 mb-8"
                >
                    <button
                        onClick={() => setMode('ai')}
                        className={`
                            p-6 rounded-2xl border-2 transition-all text-left
                            ${mode === 'ai'
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg shadow-purple-500/20'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300'
                            }
                        `}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`
                                p-3 rounded-xl
                                ${mode === 'ai' ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                            `}>
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                    {language === 'th' ? 'ให้ AI ช่วยคิดชื่อร้าน' : 'Generate with AI'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {language === 'th'
                                        ? 'AI จะสร้างชื่อร้านที่เหมาะสมให้คุณเลือก'
                                        : 'AI will create suitable shop names for you'
                                    }
                                </p>
                            </div>
                            {mode === 'ai' && (
                                <Check className="w-6 h-6 text-purple-500" />
                            )}
                        </div>
                    </button>

                    <button
                        onClick={() => setMode('manual')}
                        className={`
                            p-6 rounded-2xl border-2 transition-all text-left
                            ${mode === 'manual'
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg shadow-purple-500/20'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300'
                            }
                        `}
                    >
                        <div className="flex items-start gap-4">
                            <div className={`
                                p-3 rounded-xl
                                ${mode === 'manual' ? 'bg-purple-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'}
                            `}>
                                <Wand2 className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-1">
                                    {language === 'th' ? 'พิมพ์ชื่อร้านเอง' : 'Enter Manually'}
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {language === 'th'
                                        ? 'พิมพ์ชื่อที่คุณต้องการ AI จะช่วยปรับให้สวยขึ้น'
                                        : 'Type your own name, AI will help beautify it'
                                    }
                                </p>
                            </div>
                            {mode === 'manual' && (
                                <Check className="w-6 h-6 text-purple-500" />
                            )}
                        </div>
                    </button>
                </motion.div>

                {/* AI Mode */}
                <AnimatePresence mode="wait">
                    {mode === 'ai' && (
                        <motion.div
                            key="ai-mode"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            {/* Tone Selection */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                                    {language === 'th' ? 'เลือกสไตล์ร้าน' : 'Choose Style'}
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {TONES.map((tone) => (
                                        <button
                                            key={tone}
                                            onClick={() => setSelectedTone(tone)}
                                            className={`
                                                px-4 py-2 rounded-xl font-medium transition-all
                                                ${selectedTone === tone
                                                    ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }
                                            `}
                                        >
                                            {getToneLabel(tone)}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={generateSuggestions}
                                disabled={isGenerating}
                                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isGenerating ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {language === 'th' ? 'กำลังสร้างชื่อร้าน...' : 'Generating names...'}
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        {language === 'th' ? 'สร้างชื่อร้านด้วย AI' : 'Generate with AI'}
                                    </>
                                )}
                            </button>

                            {/* AI Suggestions */}
                            {aiSuggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="grid md:grid-cols-2 gap-4"
                                >
                                    {aiSuggestions.map((suggestion, index) => (
                                        <motion.button
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.1 }}
                                            onClick={() => {
                                                setSelectedSuggestion(suggestion.name)
                                                validateName(suggestion.name)
                                            }}
                                            className={`
                                                p-4 rounded-xl border-2 transition-all text-left
                                                ${selectedSuggestion === suggestion.name
                                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                                                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-purple-300'
                                                }
                                            `}
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <h4 className="font-bold text-gray-900 dark:text-white">
                                                    {suggestion.name}
                                                </h4>
                                                {selectedSuggestion === suggestion.name && (
                                                    <Check className="w-5 h-5 text-purple-500 shrink-0" />
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                                {suggestion.meaning}
                                            </p>
                                            <div className="flex items-center gap-4 text-xs">
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="w-3.5 h-3.5" />
                                                    <span className={getSEOColor(suggestion.seoScore)}>
                                                        SEO: {suggestion.seoScore}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Eye className="w-3.5 h-3.5" />
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {suggestion.readability === 'high'
                                                            ? (language === 'th' ? 'อ่านง่าย' : 'Easy')
                                                            : suggestion.readability === 'medium'
                                                                ? (language === 'th' ? 'ปานกลาง' : 'Medium')
                                                                : (language === 'th' ? 'ยาก' : 'Hard')
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* Manual Mode */}
                    {mode === 'manual' && (
                        <motion.div
                            key="manual-mode"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-4"
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    {language === 'th' ? 'ชื่อร้านของคุณ' : 'Your Shop Name'}
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={storeNameInput}
                                        onChange={(e) => setStoreNameInput(e.target.value)}
                                        placeholder={language === 'th' ? 'พิมพ์ชื่อร้าน...' : 'Enter shop name...'}
                                        className="w-full px-4 py-4 pr-12 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                    {isValidating && (
                                        <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-500 animate-spin" />
                                    )}
                                </div>
                            </div>

                            {/* Beautify Button */}
                            <button
                                onClick={beautifyName}
                                disabled={!storeNameInput.trim() || isBeautifying}
                                className="w-full py-3 bg-white dark:bg-gray-800 border-2 border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl font-medium hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {isBeautifying ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        {language === 'th' ? 'กำลังปรับแต่ง...' : 'Beautifying...'}
                                    </>
                                ) : (
                                    <>
                                        <Wand2 className="w-5 h-5" />
                                        {language === 'th' ? 'ให้ AI ปรับให้สวยขึ้น' : 'Beautify with AI'}
                                    </>
                                )}
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Validation Results */}
                <AnimatePresence>
                    {showValidation && validationResult && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mt-6 space-y-4"
                        >
                            {/* Duplicate Check */}
                            <div className={`
                                p-4 rounded-xl border-2 flex items-start gap-3
                                ${validationResult.exists
                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                    : 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                }
                            `}>
                                {validationResult.exists ? (
                                    <X className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
                                ) : (
                                    <Check className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                                )}
                                <div>
                                    <p className={`font-medium ${validationResult.exists ? 'text-red-700 dark:text-red-300' : 'text-green-700 dark:text-green-300'}`}>
                                        {validationResult.exists
                                            ? (language === 'th' ? 'ชื่อร้านนี้มีผู้ใช้งานแล้ว' : 'This name is already taken')
                                            : (language === 'th' ? 'ชื่อร้านนี้ว่าง ใช้ได้!' : 'This name is available!')
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* SEO Score */}
                            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white">
                                        {language === 'th' ? 'คะแนน SEO' : 'SEO Score'}
                                    </h3>
                                    <div className={`text-3xl font-bold ${getSEOColor(validationResult.seoScore)}`}>
                                        {validationResult.seoScore}
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${validationResult.seoScore}%` }}
                                        transition={{ duration: 0.5 }}
                                        className={`h-full ${validationResult.seoScore >= 80 ? 'bg-green-500' :
                                                validationResult.seoScore >= 60 ? 'bg-yellow-500' :
                                                    'bg-red-500'
                                            }`}
                                    />
                                </div>

                                {/* Issues */}
                                {validationResult.issues.length > 0 && (
                                    <div className="space-y-2 mb-4">
                                        {validationResult.issues.map((issue, index) => (
                                            <div key={index} className="flex items-start gap-2 text-sm text-orange-600 dark:text-orange-400">
                                                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                                                <span>{issue}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {/* Suggestions */}
                                {validationResult.suggestions.length > 0 && (
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {language === 'th' ? 'คำแนะนำ:' : 'Suggestions:'}
                                        </p>
                                        {validationResult.suggestions.map((suggestion, index) => (
                                            <div key={index} className="flex items-start gap-2 text-sm text-purple-600 dark:text-purple-400">
                                                <Zap className="w-4 h-4 shrink-0 mt-0.5" />
                                                <span>{suggestion}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Continue Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={handleSaveAndContinue}
                    disabled={
                        (mode === 'ai' && !selectedSuggestion) ||
                        (mode === 'manual' && !storeNameInput.trim()) ||
                        validationResult?.exists
                    }
                    className="w-full mt-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {language === 'th' ? 'บันทึกและดำเนินการต่อ' : 'Save & Continue'}
                    <ChevronRight className="w-5 h-5" />
                </motion.button>
            </div>
        </div>
    )
}

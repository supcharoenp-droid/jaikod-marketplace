'use client'

import React, { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Palette,
    Sparkles,
    Upload,
    Check,
    Wand2,
    Download,
    Copy,
    Image as ImageIcon,
    Loader2,
    ChevronRight,
    Trash2,
    RefreshCw,
    Zap,
    Eye,
    Heart
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import Image from 'next/image'

interface Logo {
    id: string
    imageUrl: string
    palette: string[]
    fontSuggestion: string
    brandKeywords: string[]
}

interface BrandKit {
    palette: {
        primary: string
        secondary: string
        accent: string
        neutral: string
    }
    fonts: {
        heading: string
        body: string
    }
}

const LOGO_STYLES = [
    { id: 'minimal', label: { th: 'มินิมอล', en: 'Minimal' }, icon: '◯' },
    { id: 'luxury', label: { th: 'หรูหรา', en: 'Luxury' }, icon: '◆' },
    { id: 'cute', label: { th: 'น่ารัก', en: 'Cute' }, icon: '♡' },
    { id: 'modern', label: { th: 'ทันสมัย', en: 'Modern' }, icon: '▲' },
    { id: 'vintage', label: { th: 'วินเทจ', en: 'Vintage' }, icon: '✿' },
    { id: 'pastel', label: { th: 'พาสเทล', en: 'Pastel' }, icon: '◐' },
    { id: 'zen', label: { th: 'เซน', en: 'Zen' }, icon: '☯' },
    { id: 'bold', label: { th: 'โดดเด่น', en: 'Bold' }, icon: '■' }
] as const

type LogoStyle = typeof LOGO_STYLES[number]['id']

export default function LogoBrandingStep() {
    const router = useRouter()
    const { language, t } = useLanguage()
    const fileInputRef = useRef<HTMLInputElement>(null)

    // States
    const [selectedStyle, setSelectedStyle] = useState<LogoStyle>('minimal')
    const [mode, setMode] = useState<'ai' | 'upload'>('ai')
    const [logos, setLogos] = useState<Logo[]>([])
    const [selectedLogo, setSelectedLogo] = useState<Logo | null>(null)
    const [uploadedLogo, setUploadedLogo] = useState<string | null>(null)
    const [brandKit, setBrandKit] = useState<BrandKit | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)
    const [isEnhancing, setIsEnhancing] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    // Generate AI logos
    const generateLogos = async () => {
        setIsGenerating(true)
        try {
            // TODO: Replace with actual AI API call
            // const response = await fetch('/api/ai/generate-logos', {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         storeName: 'My Shop',
            //         language,
            //         style: selectedStyle
            //     })
            // })
            // const data = await response.json()

            await new Promise(resolve => setTimeout(resolve, 2000))

            // Mock logos
            const mockLogos: Logo[] = [
                {
                    id: 'logo_01',
                    imageUrl: '/mock-logo-1.png',
                    palette: ['#A855F7', '#EC4899', '#F97316'],
                    fontSuggestion: 'Inter Bold',
                    brandKeywords: ['minimal', 'clean', 'modern']
                },
                {
                    id: 'logo_02',
                    imageUrl: '/mock-logo-2.png',
                    palette: ['#3B82F6', '#8B5CF6', '#EC4899'],
                    fontSuggestion: 'Satoshi Bold',
                    brandKeywords: ['vibrant', 'friendly', 'playful']
                },
                {
                    id: 'logo_03',
                    imageUrl: '/mock-logo-3.png',
                    palette: ['#10B981', '#059669', '#047857'],
                    fontSuggestion: 'Prompt Bold',
                    brandKeywords: ['natural', 'eco', 'fresh']
                },
                {
                    id: 'logo_04',
                    imageUrl: '/mock-logo-4.png',
                    palette: ['#F59E0B', '#EF4444', '#DC2626'],
                    fontSuggestion: 'Poppins Bold',
                    brandKeywords: ['energetic', 'bold', 'dynamic']
                }
            ]

            setLogos(mockLogos)
        } catch (error) {
            console.error('Error generating logos:', error)
        } finally {
            setIsGenerating(false)
        }
    }

    // Handle file upload
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Validate file
        if (file.size > 5 * 1024 * 1024) {
            alert(language === 'th' ? 'ไฟล์ใหญ่เกิน 5MB' : 'File size exceeds 5MB')
            return
        }

        if (!['image/png', 'image/jpeg', 'image/svg+xml'].includes(file.type)) {
            alert(language === 'th' ? 'รองรับเฉพาะ PNG, JPG, SVG' : 'Only PNG, JPG, SVG supported')
            return
        }

        setIsUploading(true)
        try {
            // Convert to base64
            const reader = new FileReader()
            reader.onloadend = () => {
                setUploadedLogo(reader.result as string)
                setMode('upload')
            }
            reader.readAsDataURL(file)
        } catch (error) {
            console.error('Error uploading file:', error)
        } finally {
            setIsUploading(false)
        }
    }

    // Enhance uploaded logo
    const enhanceLogo = async () => {
        if (!uploadedLogo) return

        setIsEnhancing(true)
        try {
            // TODO: Replace with actual AI API call
            // const response = await fetch('/api/ai/enhance-logo', {
            //     method: 'POST',
            //     body: JSON.stringify({
            //         logo: uploadedLogo,
            //         removeBackground: true,
            //         upscale: true
            //     })
            // })
            // const data = await response.json()

            await new Promise(resolve => setTimeout(resolve, 1500))

            // Mock enhancement
            alert(language === 'th' ? 'ปรับแต่งโลโก้สำเร็จ!' : 'Logo enhanced successfully!')
        } catch (error) {
            console.error('Error enhancing logo:', error)
        } finally {
            setIsEnhancing(false)
        }
    }

    // Generate brand kit
    const generateBrandKit = (logo: Logo) => {
        const kit: BrandKit = {
            palette: {
                primary: logo.palette[0],
                secondary: logo.palette[1] || logo.palette[0],
                accent: logo.palette[2] || logo.palette[0],
                neutral: '#6B7280'
            },
            fonts: {
                heading: logo.fontSuggestion,
                body: 'Inter Regular'
            }
        }
        setBrandKit(kit)
    }

    // Handle logo selection
    const handleSelectLogo = (logo: Logo) => {
        setSelectedLogo(logo)
        generateBrandKit(logo)
    }

    // Copy color to clipboard
    const copyColor = (color: string) => {
        navigator.clipboard.writeText(color)
        alert(language === 'th' ? `คัดลอก ${color} แล้ว` : `Copied ${color}`)
    }

    // Save and continue
    const handleSaveAndContinue = () => {
        if (!selectedLogo && !uploadedLogo) {
            alert(language === 'th' ? 'กรุณาเลือกหรืออัปโหลดโลโก้' : 'Please select or upload a logo')
            return
        }

        // TODO: Save to backend
        // await updateOnboardingProgress(user.uid, {
        //     logoUrl: selectedLogo?.imageUrl || uploadedLogo,
        //     palette: brandKit?.palette,
        //     fonts: brandKit?.fonts,
        //     onboardingProgress: 2
        // })

        router.push('/onboarding/3')
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-6 shadow-2xl shadow-purple-500/30">
                        <Palette className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        {language === 'th' ? 'สร้างโลโก้ร้านของคุณ' : 'Create Your Shop Logo'}
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {language === 'th'
                            ? 'ให้ AI ออกแบบโลโก้ให้ หรืออัปโหลดโลโก้ของคุณเอง'
                            : 'Let AI design your logo or upload your own'
                        }
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Panel - Logo Generation */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Style Selection */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                        >
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                                {language === 'th' ? 'เลือกสไตล์โลโก้' : 'Choose Logo Style'}
                            </h2>
                            <div className="grid grid-cols-4 gap-3">
                                {LOGO_STYLES.map((style) => (
                                    <button
                                        key={style.id}
                                        onClick={() => setSelectedStyle(style.id)}
                                        className={`
                                            p-4 rounded-xl border-2 transition-all
                                            ${selectedStyle === style.id
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                            }
                                        `}
                                    >
                                        <div className="text-3xl mb-2">{style.icon}</div>
                                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                                            {style.label[language]}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>

                        {/* Mode Tabs */}
                        <div className="flex gap-2 bg-white dark:bg-gray-800 rounded-2xl p-2 border border-gray-200 dark:border-gray-700">
                            <button
                                onClick={() => setMode('ai')}
                                className={`
                                    flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all
                                    ${mode === 'ai'
                                        ? 'bg-purple-500 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                <Sparkles className="w-5 h-5" />
                                {language === 'th' ? 'AI สร้างให้' : 'AI Generate'}
                            </button>
                            <button
                                onClick={() => setMode('upload')}
                                className={`
                                    flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-medium transition-all
                                    ${mode === 'upload'
                                        ? 'bg-purple-500 text-white shadow-lg'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }
                                `}
                            >
                                <Upload className="w-5 h-5" />
                                {language === 'th' ? 'อัปโหลดเอง' : 'Upload Own'}
                            </button>
                        </div>

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
                                    {/* Generate Button */}
                                    <button
                                        onClick={generateLogos}
                                        disabled={isGenerating}
                                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                                    >
                                        {isGenerating ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                {language === 'th' ? 'กำลังสร้างโลโก้...' : 'Generating logos...'}
                                            </>
                                        ) : (
                                            <>
                                                <Sparkles className="w-5 h-5" />
                                                {language === 'th' ? 'สร้างโลโก้ด้วย AI' : 'Generate with AI'}
                                            </>
                                        )}
                                    </button>

                                    {/* Logo Grid */}
                                    {logos.length > 0 && (
                                        <div className="grid grid-cols-2 gap-4">
                                            {logos.map((logo) => (
                                                <motion.button
                                                    key={logo.id}
                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    onClick={() => handleSelectLogo(logo)}
                                                    className={`
                                                        relative aspect-square rounded-2xl border-2 transition-all overflow-hidden group
                                                        ${selectedLogo?.id === logo.id
                                                            ? 'border-purple-500 shadow-lg shadow-purple-500/30'
                                                            : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                                        }
                                                    `}
                                                >
                                                    {/* Mock Logo Display */}
                                                    <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center">
                                                        <div className="text-6xl">
                                                            {LOGO_STYLES.find(s => s.id === selectedStyle)?.icon}
                                                        </div>
                                                    </div>

                                                    {/* Overlay */}
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />

                                                    {/* Selected Badge */}
                                                    {selectedLogo?.id === logo.id && (
                                                        <div className="absolute top-3 right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                                            <Check className="w-5 h-5 text-white" />
                                                        </div>
                                                    )}

                                                    {/* Color Palette Preview */}
                                                    <div className="absolute bottom-3 left-3 right-3 flex gap-1">
                                                        {logo.palette.slice(0, 3).map((color, idx) => (
                                                            <div
                                                                key={idx}
                                                                className="flex-1 h-6 rounded-lg border-2 border-white shadow-sm"
                                                                style={{ backgroundColor: color }}
                                                            />
                                                        ))}
                                                    </div>
                                                </motion.button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Upload Mode */}
                            {mode === 'upload' && (
                                <motion.div
                                    key="upload-mode"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-4"
                                >
                                    {/* Upload Area */}
                                    {!uploadedLogo ? (
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-2xl p-12 text-center cursor-pointer hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-all"
                                        >
                                            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                                {language === 'th' ? 'คลิกเพื่ออัปโหลดโลโก้' : 'Click to upload logo'}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                PNG, JPG, SVG (Max 5MB)
                                            </p>
                                            <input
                                                ref={fileInputRef}
                                                type="file"
                                                accept="image/png,image/jpeg,image/svg+xml"
                                                onChange={handleFileUpload}
                                                className="hidden"
                                            />
                                        </div>
                                    ) : (
                                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
                                            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 flex items-center justify-center">
                                                <ImageIcon className="w-16 h-16 text-gray-400" />
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={enhanceLogo}
                                                    disabled={isEnhancing}
                                                    className="flex-1 py-3 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                                                >
                                                    {isEnhancing ? (
                                                        <>
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                            {language === 'th' ? 'กำลังปรับแต่ง...' : 'Enhancing...'}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Wand2 className="w-4 h-4" />
                                                            {language === 'th' ? 'ปรับแต่งด้วย AI' : 'Enhance with AI'}
                                                        </>
                                                    )}
                                                </button>
                                                <button
                                                    onClick={() => setUploadedLogo(null)}
                                                    className="px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Right Panel - Brand Kit */}
                    <div className="space-y-6">
                        {/* Brand Kit */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 sticky top-6"
                        >
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <Palette className="w-5 h-5" />
                                {language === 'th' ? 'ชุดแบรนด์' : 'Brand Kit'}
                            </h2>

                            {brandKit ? (
                                <div className="space-y-6">
                                    {/* Color Palette */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            {language === 'th' ? 'โทนสี' : 'Color Palette'}
                                        </h3>
                                        <div className="space-y-2">
                                            {Object.entries(brandKit.palette).map(([name, color]) => (
                                                <div key={name} className="flex items-center gap-3">
                                                    <div
                                                        className="w-12 h-12 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-sm"
                                                        style={{ backgroundColor: color }}
                                                    />
                                                    <div className="flex-1">
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                                            {name}
                                                        </p>
                                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                                            {color}
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={() => copyColor(color)}
                                                        className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Font Pairing */}
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            {language === 'th' ? 'ฟอนต์' : 'Fonts'}
                                        </h3>
                                        <div className="space-y-2">
                                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                    {language === 'th' ? 'หัวข้อ' : 'Heading'}
                                                </p>
                                                <p className="font-bold text-gray-900 dark:text-white">
                                                    {brandKit.fonts.heading}
                                                </p>
                                            </div>
                                            <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                                                    {language === 'th' ? 'เนื้อหา' : 'Body'}
                                                </p>
                                                <p className="text-gray-900 dark:text-white">
                                                    {brandKit.fonts.body}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Download Button */}
                                    <button className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center gap-2">
                                        <Download className="w-4 h-4" />
                                        {language === 'th' ? 'ดาวน์โหลดชุดแบรนด์' : 'Download Brand Kit'}
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <Palette className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {language === 'th'
                                            ? 'เลือกโลโก้เพื่อดูชุดแบรนด์'
                                            : 'Select a logo to see brand kit'
                                        }
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Continue Button */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    onClick={handleSaveAndContinue}
                    disabled={!selectedLogo && !uploadedLogo}
                    className="w-full max-w-2xl mx-auto mt-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {language === 'th' ? 'บันทึกและดำเนินการต่อ' : 'Save & Continue'}
                    <ChevronRight className="w-5 h-5" />
                </motion.button>
            </div>
        </div>
    )
}

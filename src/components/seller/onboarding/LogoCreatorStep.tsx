'use client'

import React, { useState, useRef } from 'react'
import {
    Palette, Upload, Sparkles, Image as ImageIcon,
    RefreshCw, Check, ArrowRight, ArrowLeft, Wand2,
    Monitor, PenTool, Type, Globe
} from 'lucide-react'
import { generateLogos, enhanceLogo, LogoStyle, GeneratedLogo } from '@/lib/ai-logo-generator'
import Image from 'next/image'

interface LogoCreatorStepProps {
    shopName: string
    initialLogo?: string
    onComplete: (logoUrl: string) => void
    onBack: () => void
}

const STYLES: { id: LogoStyle, label: string, color: string }[] = [
    { id: 'Minimal', label: 'Minimal', color: 'bg-gray-100' },
    { id: 'Luxury', label: 'Luxury', color: 'bg-yellow-900 text-yellow-500' },
    { id: 'Modern', label: 'Modern', color: 'bg-blue-600 text-white' },
    { id: 'Cute', label: 'Cute', color: 'bg-pink-100 text-pink-500' },
    { id: 'Japanese', label: 'Japanese', color: 'bg-red-50 text-red-600' },
    { id: 'Vintage', label: 'Vintage', color: 'bg-orange-100 text-orange-800' },
    { id: 'Bold', label: 'Bold', color: 'bg-black text-white' },
    { id: 'Pastel', label: 'Pastel', color: 'bg-purple-100 text-purple-600' }
]

export default function LogoCreatorStep({ shopName, initialLogo, onComplete, onBack }: LogoCreatorStepProps) {
    const [lang, setLang] = useState<'th' | 'en'>('th')
    const [activeTab, setActiveTab] = useState<'ai' | 'upload'>('ai')

    // AI Generation State
    const [selectedStyle, setSelectedStyle] = useState<LogoStyle>('Minimal')
    const [generatedLogos, setGeneratedLogos] = useState<GeneratedLogo[]>([])
    const [selectedGeneratedLogo, setSelectedGeneratedLogo] = useState<GeneratedLogo | null>(null)
    const [isGenerating, setIsGenerating] = useState(false)

    // Upload State
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [uploadedPreview, setUploadedPreview] = useState<string | null>(initialLogo || null)
    const [isEnhancing, setIsEnhancing] = useState(false)

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Handlers
    const handleGenerate = async () => {
        setIsGenerating(true)
        setSelectedGeneratedLogo(null)
        try {
            const results = await generateLogos({
                shopName,
                style: selectedStyle
            })
            setGeneratedLogos(results)
        } catch (error) {
            console.error(error)
        } finally {
            setIsGenerating(false)
        }
    }

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setUploadedFile(file)
            setUploadedPreview(URL.createObjectURL(file))
            setActiveTab('upload')
        }
    }

    const handleEnhance = async () => {
        if (!uploadedFile) return
        setIsEnhancing(true)
        try {
            const enhancedUrl = await enhanceLogo(uploadedFile)
            setUploadedPreview(enhancedUrl) // In real app, this would be a new refined URL
        } catch (error) {
            console.error(error)
        } finally {
            setIsEnhancing(false)
        }
    }

    const handleConfirm = () => {
        if (activeTab === 'ai' && selectedGeneratedLogo) {
            onComplete(selectedGeneratedLogo.url)
        } else if (activeTab === 'upload' && uploadedPreview) {
            onComplete(uploadedPreview)
        }
    }

    const isValid = (activeTab === 'ai' && selectedGeneratedLogo) || (activeTab === 'upload' && uploadedPreview)

    return (
        <div className="space-y-6 animate-fade-in-up">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        {lang === 'th' ? 'สร้างโลโก้ร้าน' : 'Create your shop logo'}
                        <span className="text-xs px-2 py-0.5 bg-neon-purple/10 text-neon-purple rounded-full">Step 2</span>
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">
                        {lang === 'th' ? 'สร้างเอกลักษณ์ให้ร้านค้าของคุณจดจำได้ง่าย' : 'Create a unique identity specifically for your store'}
                    </p>
                </div>
                <button
                    onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-bold flex items-center gap-2"
                >
                    <Globe className="w-4 h-4" /> {lang.toUpperCase()}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
                <button
                    onClick={() => setActiveTab('ai')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'ai'
                        ? 'bg-white dark:bg-surface-dark shadow text-neon-purple'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <Wand2 className="w-4 h-4" />
                    {lang === 'th' ? 'AI ออกแบบให้' : 'Generate with AI'}
                </button>
                <button
                    onClick={() => setActiveTab('upload')}
                    className={`flex-1 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'upload'
                        ? 'bg-white dark:bg-surface-dark shadow text-gray-900 dark:text-white'
                        : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                        }`}
                >
                    <Upload className="w-4 h-4" />
                    {lang === 'th' ? 'อัปโหลดเอง' : 'Upload Custom'}
                </button>
            </div>

            {/* AI Generator Panel */}
            {activeTab === 'ai' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="space-y-3">
                        <label className="text-sm font-medium flex items-center gap-2">
                            <Palette className="w-4 h-4" />
                            {lang === 'th' ? 'เลือกสไตล์ที่ชอบ' : 'Choose Style'}
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {STYLES.map((style) => (
                                <button
                                    key={style.id}
                                    onClick={() => setSelectedStyle(style.id)}
                                    className={`relative p-3 rounded-xl border-2 transition-all text-center h-20 flex flex-col items-center justify-center gap-1 ${selectedStyle === style.id
                                            ? 'border-neon-purple ring-2 ring-purple-100 dark:ring-purple-900'
                                            : 'border-transparent bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-sm text-xs font-bold ${style.color}`}>
                                        Aa
                                    </div>
                                    <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{style.label}</span>
                                    {selectedStyle === style.id && (
                                        <div className="absolute top-1 right-1 text-neon-purple">
                                            <Check className="w-3 h-3" />
                                        </div>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                    >
                        {isGenerating ? (
                            <RefreshCw className="w-5 h-5 animate-spin" />
                        ) : (
                            <Sparkles className="w-5 h-5" />
                        )}
                        {lang === 'th' ? 'สร้างโลโก้ด้วย AI' : 'Generate Logo'}
                    </button>

                    {/* Results */}
                    {generatedLogos.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                            <h3 className="text-sm font-medium">{lang === 'th' ? 'เลือกโลโก้ที่คุณชอบ' : 'Select your favorite'}</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {generatedLogos.map((logo) => (
                                    <div
                                        key={logo.id}
                                        onClick={() => setSelectedGeneratedLogo(logo)}
                                        className={`group relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedGeneratedLogo?.id === logo.id
                                                ? 'border-neon-purple ring-2 ring-purple-500/30'
                                                : 'border-transparent hover:border-gray-200'
                                            }`}
                                    >
                                        <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-400">
                                            {/* Mock Image using Next Image if external domain is allowed, otherwise img */}
                                            {/* Using img for simplicity with external mock url */}
                                            <img
                                                src={logo.url}
                                                alt="Generated Logo"
                                                className="w-full h-full object-cover p-4"
                                            />
                                        </div>

                                        {/* Hover Overlay */}
                                        <div className={`absolute inset-0 bg-black/50 flex flex-col items-center justify-center gap-2 text-white transition-opacity ${selectedGeneratedLogo?.id === logo.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}>
                                            <Check className="w-8 h-8 p-1 bg-neon-purple rounded-full" />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Logo Details */}
                            {selectedGeneratedLogo && (
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-4">
                                        <div>
                                            <div className="font-bold mb-1">{lang === 'th' ? 'แนะนำสี' : 'Color Palette'}</div>
                                            <div className="flex gap-1">
                                                {selectedGeneratedLogo.colorPalette.map(c => (
                                                    <div key={c} className="w-4 h-4 rounded-full border border-gray-200" style={{ backgroundColor: c }} title={c} />
                                                ))}
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700"></div>
                                        <div>
                                            <div className="font-bold mb-1">{lang === 'th' ? 'แนะนำฟอนต์' : 'Font Pairing'}</div>
                                            <div className="text-gray-600 dark:text-gray-400">{selectedGeneratedLogo.fontPairing}</div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {/* Upload Panel */}
            {activeTab === 'upload' && (
                <div className="space-y-6 animate-fade-in">
                    <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-neon-purple hover:bg-purple-50 dark:hover:bg-purple-900/10 transition-colors h-64"
                    >
                        {uploadedPreview ? (
                            <div className="relative w-40 h-40">
                                <img
                                    src={uploadedPreview}
                                    alt="Uploaded Preview"
                                    className="w-full h-full object-contain rounded-lg"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 flex items-center justify-center rounded-lg transition-opacity">
                                    <span className="text-white text-sm font-bold">Change Image</span>
                                </div>
                            </div>
                        ) : (
                            <>
                                <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
                                <p className="text-gray-600 dark:text-gray-300 font-medium">
                                    {lang === 'th' ? 'คลิกเพื่ออัปโหลด หรือลากไฟล์มาวาง' : 'Click to upload or drag & drop'}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">JPG, PNG, SVG (Max 5MB)</p>
                            </>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileUpload}
                        />
                    </div>

                    {uploadedPreview && (
                        <div className="flex justify-center">
                            <button
                                onClick={handleEnhance}
                                disabled={isEnhancing}
                                className="px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm"
                            >
                                {isEnhancing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-yellow-500" />}
                                {lang === 'th' ? 'ปรับภาพให้คมชัด (AI)' : 'Enhance with AI'}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Footer Actions */}
            <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 py-3 border border-gray-200 dark:border-gray-700 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    {lang === 'th' ? 'ย้อนกลับ' : 'Back'}
                </button>
                <button
                    onClick={handleConfirm}
                    disabled={!isValid}
                    className="flex-1 py-3 bg-neon-purple hover:bg-purple-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                    {lang === 'th' ? 'ใช้โลโก้นี้' : 'Confirm Logo'}
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

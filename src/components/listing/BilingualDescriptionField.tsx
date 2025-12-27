'use client'

/**
 * BilingualDescriptionField - World-Class AI-Powered Description Generator
 * 
 * Features:
 * - Single textarea for description (not sectioned)
 * - AI generates professional content based on subcategory
 * - Beautiful Thai/English language
 * - One-click AI generation
 * - Easy editing
 */

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Copy, Check, Wand2, Eye, Edit3, RefreshCw } from 'lucide-react'
import { generateSmartDescription, type DescriptionContext } from '@/lib/smart-description-templates'

interface BilingualDescriptionFieldProps {
    values: {
        th: string
        en: string
    }
    onChange: (lang: 'TH' | 'EN', value: string) => void
    onGenerateMissing?: (lang: 'TH' | 'EN') => void
    isGenerating?: boolean
    activeLanguage?: 'TH' | 'EN'
    // NEW: Context for AI generation
    categoryId?: number
    subcategoryId?: number
    productTitle?: string
    userInputData?: Record<string, any>
}

// Helper: Extract intro paragraph from description
function extractIntroFromDescription(text: string): string {
    const lines = text.split('\n')
    const introLines: string[] = []

    for (const line of lines) {
        // Stop when we hit a section header (emoji + text or bullet point section)
        if (line.match(/^[📌✅👤📝🚗💻📱🏠❄️🙏🐕🎮]/)) {
            break
        }
        if (line.trim().startsWith('•') && introLines.length > 2) {
            break
        }
        introLines.push(line)
    }

    return introLines.join('\n').trim()
}

// Helper: Extract key info from existing description
function extractExistingInfo(text: string): Record<string, string> {
    const info: Record<string, string> = {}

    // Extract brand
    const brandMatch = text.match(/ยี่ห้อ[:\s]*([^\n•]+)/i) || text.match(/Brand[:\s]*([^\n•]+)/i)
    if (brandMatch) info.brand = brandMatch[1].trim()

    // Extract model
    const modelMatch = text.match(/รุ่น[:\s]*([^\n•]+)/i) || text.match(/Model[:\s]*([^\n•]+)/i)
    if (modelMatch) info.model = modelMatch[1].trim()

    // Extract color
    const colorMatch = text.match(/สี[:\s]*([^\n•]+)/i) || text.match(/Color[:\s]*([^\n•]+)/i)
    if (colorMatch) info.color = colorMatch[1].trim()

    // Extract CPU
    const cpuMatch = text.match(/CPU[:\s]*([^\n•]+)/i) || text.match(/โปรเซสเซอร์[:\s]*([^\n•]+)/i)
    if (cpuMatch) info.cpu = cpuMatch[1].trim()

    // Extract RAM
    const ramMatch = text.match(/RAM[:\s]*([^\n•,]+)/i)
    if (ramMatch) info.ram = ramMatch[1].trim()

    // Extract Storage
    const storageMatch = text.match(/SSD[:\s]*([^\n•,]+)/i) || text.match(/HDD[:\s]*([^\n•,]+)/i) || text.match(/ความจุ[:\s]*([^\n•]+)/i)
    if (storageMatch) info.storage_type = storageMatch[1].trim()

    // Extract screen size
    const screenMatch = text.match(/หน้าจอ[:\s]*([^\n•]+)/i) || text.match(/(\d+\.?\d*)\s*นิ้ว/i)
    if (screenMatch) info.screen_size = screenMatch[1].trim()

    return info
}


export default function BilingualDescriptionField({
    values,
    onChange,
    onGenerateMissing,
    isGenerating = false,
    activeLanguage: controlledLanguage,
    categoryId,
    subcategoryId,
    productTitle = '',
    userInputData = {}
}: BilingualDescriptionFieldProps) {
    const [localLanguage, setLocalLanguage] = useState<'TH' | 'EN'>('TH')
    const activeLanguage = controlledLanguage || localLanguage

    const currentValue = activeLanguage === 'TH' ? values.th : values.en
    const otherValue = activeLanguage === 'TH' ? values.en : values.th
    const hasOtherLanguage = !!otherValue

    // State
    const [copied, setCopied] = useState(false)
    const [isPreviewMode, setIsPreviewMode] = useState(false)
    const [isAIGenerating, setIsAIGenerating] = useState(false)
    const [showAIBadge, setShowAIBadge] = useState(false)
    const [showConfirmDialog, setShowConfirmDialog] = useState(false)

    // Generate AI Description - Merge with existing content
    const handleAIGenerate = useCallback((forceReplace: boolean = false) => {
        if (!categoryId) return

        // If there's existing content and not forcing replace, show confirm dialog
        if (currentValue && currentValue.length > 50 && !forceReplace) {
            setShowConfirmDialog(true)
            return
        }

        setIsAIGenerating(true)
        setShowConfirmDialog(false)

        // Simulate AI processing delay for UX
        setTimeout(() => {
            // Extract existing content info to merge
            const existingInfo = currentValue ? extractExistingInfo(currentValue) : {}

            const context: DescriptionContext = {
                categoryId,
                subcategoryId,
                productTitle,
                userInputData: {
                    ...userInputData,
                    ...existingInfo  // Merge existing info from description
                },
                language: activeLanguage.toLowerCase() as 'th' | 'en'
            }

            const result = generateSmartDescription(context)

            // If we have existing content start, prepend it
            let finalText = result.text

            // If existing content has good intro, keep it
            if (currentValue && currentValue.length > 20 && !forceReplace) {
                const existingIntro = extractIntroFromDescription(currentValue)
                if (existingIntro && existingIntro.length > 30) {
                    // Replace the intro in template with existing intro
                    finalText = existingIntro + '\n\n' + result.text.split('\n\n').slice(1).join('\n\n')
                }
            }

            onChange(activeLanguage, finalText)
            setShowAIBadge(true)
            setIsAIGenerating(false)
        }, 800)
    }, [categoryId, subcategoryId, productTitle, userInputData, activeLanguage, onChange, currentValue])

    // Handle confirm dialog actions
    const handleConfirmMerge = useCallback(() => {
        handleAIGenerate(false) // Merge mode, keep intro
    }, [handleAIGenerate])

    const handleConfirmReplace = useCallback(() => {
        handleAIGenerate(true) // Replace mode
    }, [handleAIGenerate])

    // Copy to clipboard
    const handleCopy = useCallback(() => {
        navigator.clipboard.writeText(currentValue)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }, [currentValue])

    // Don't auto-generate if content already exists
    // Auto-generate only when completely empty

    return (
        <div className="space-y-4">
            {/* Confirm Dialog */}
            <AnimatePresence>
                {showConfirmDialog && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 
                                   border border-amber-500/30 space-y-3"
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-2xl">⚠️</span>
                            <div>
                                <h4 className="text-amber-200 font-medium text-sm">
                                    มีรายละเอียดอยู่แล้ว
                                </h4>
                                <p className="text-amber-300/70 text-xs mt-1">
                                    คุณต้องการจะทำอย่างไรกับข้อความเดิม?
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2 ml-9">
                            <button
                                onClick={() => {
                                    setShowConfirmDialog(false)
                                    // Pass the check by calling with true to skip the dialog
                                    setIsAIGenerating(true)
                                    setTimeout(() => {
                                        // Keep existing intro, add structured sections
                                        const existingInfo = extractExistingInfo(currentValue)
                                        const existingIntro = extractIntroFromDescription(currentValue)

                                        const context: DescriptionContext = {
                                            categoryId: categoryId!,
                                            subcategoryId,
                                            productTitle,
                                            userInputData: { ...userInputData, ...existingInfo },
                                            language: activeLanguage.toLowerCase() as 'th' | 'en'
                                        }
                                        const result = generateSmartDescription(context)

                                        // Keep existing intro if good
                                        let finalText = result.text
                                        if (existingIntro && existingIntro.length > 30) {
                                            finalText = existingIntro + '\n\n' + result.text.split('\n\n').slice(1).join('\n\n')
                                        }

                                        onChange(activeLanguage, finalText)
                                        setShowAIBadge(true)
                                        setIsAIGenerating(false)
                                    }, 600)
                                }}
                                className="px-3 py-1.5 rounded-lg text-xs bg-emerald-600 hover:bg-emerald-500 
                                           text-white font-medium transition-colors flex items-center gap-1.5"
                            >
                                <Sparkles className="w-3 h-3" />
                                รวมข้อมูลเดิม + จัดรูปแบบใหม่
                            </button>
                            <button
                                onClick={() => handleAIGenerate(true)}
                                className="px-3 py-1.5 rounded-lg text-xs bg-rose-600/50 hover:bg-rose-600 
                                           text-rose-200 font-medium transition-colors"
                            >
                                สร้างใหม่ทั้งหมด
                            </button>
                            <button
                                onClick={() => setShowConfirmDialog(false)}
                                className="px-3 py-1.5 rounded-lg text-xs bg-slate-700 hover:bg-slate-600 
                                           text-slate-300 font-medium transition-colors"
                            >
                                ยกเลิก
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-white flex items-center gap-2">
                        <span className="text-purple-400">📝</span>
                        รายละเอียด
                    </label>

                    {/* AI Badge */}
                    <AnimatePresence>
                        {showAIBadge && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                className="px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 
                                           border border-purple-500/30 text-[10px] text-purple-300 flex items-center gap-1"
                            >
                                <Sparkles className="w-3 h-3" />
                                AI Generated
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                    {/* AI Generate Button */}
                    <motion.button
                        onClick={handleAIGenerate}
                        disabled={isAIGenerating || !categoryId}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 
                                   bg-gradient-to-r from-purple-600 to-pink-600 
                                   hover:from-purple-500 hover:to-pink-500
                                   text-white font-medium shadow-lg shadow-purple-500/25
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   transition-all"
                    >
                        {isAIGenerating ? (
                            <>
                                <RefreshCw className="w-3 h-3 animate-spin" />
                                กำลังสร้าง...
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-3 h-3" />
                                สร้างด้วย AI
                            </>
                        )}
                    </motion.button>

                    {/* Preview Toggle */}
                    <button
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className={`px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors ${isPreviewMode
                            ? 'bg-emerald-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                            }`}
                    >
                        {isPreviewMode ? (
                            <><Edit3 className="w-3 h-3" /> แก้ไข</>
                        ) : (
                            <><Eye className="w-3 h-3" /> ดูตัวอย่าง</>
                        )}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <AnimatePresence mode="wait">
                {isPreviewMode ? (
                    /* Preview Mode */
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-5 rounded-xl bg-gradient-to-br from-slate-800/80 to-slate-900/90 
                                   border border-slate-700/50 backdrop-blur-sm min-h-[200px]"
                    >
                        <div className="prose prose-invert prose-sm max-w-none">
                            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed text-sm">
                                {currentValue || (
                                    <span className="text-slate-500 italic">
                                        ยังไม่มีรายละเอียด - กดปุ่ม "สร้างด้วย AI" เพื่อสร้างอัตโนมัติ
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Copy Button */}
                        {currentValue && (
                            <div className="mt-4 pt-4 border-t border-slate-700/50 flex justify-end">
                                <button
                                    onClick={handleCopy}
                                    className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg 
                                               text-white text-xs flex items-center gap-2 transition-colors"
                                >
                                    {copied ? (
                                        <><Check className="w-4 h-4 text-green-400" /> คัดลอกแล้ว!</>
                                    ) : (
                                        <><Copy className="w-4 h-4" /> คัดลอกข้อความ</>
                                    )}
                                </button>
                            </div>
                        )}
                    </motion.div>
                ) : (
                    /* Edit Mode - Single Textarea */
                    <motion.div
                        key="editor"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-3"
                    >
                        {/* AI Loading Overlay */}
                        <div className="relative">
                            <textarea
                                value={currentValue}
                                onChange={(e) => {
                                    onChange(activeLanguage, e.target.value)
                                    setShowAIBadge(false)
                                }}
                                placeholder={
                                    activeLanguage === 'TH'
                                        ? 'กดปุ่ม "สร้างด้วย AI" หรือพิมพ์รายละเอียดเอง...\n\n💡 ระบบจะสร้างข้อความมืออาชีพ พร้อม:\n• ข้อมูลสินค้าครบถ้วน\n• สภาพและการบำรุงรักษา\n• เหมาะสำหรับใคร\n• หมายเหตุสำคัญ'
                                        : 'Click "Generate with AI" or type your description...'
                                }
                                rows={12}
                                className="w-full px-4 py-4 rounded-xl 
                                           bg-slate-800/70 border-2 border-slate-700
                                           focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20
                                           text-white placeholder-slate-500 text-sm leading-relaxed
                                           transition-all outline-none resize-none"
                                disabled={isAIGenerating}
                            />

                            {/* AI Generating Overlay */}
                            <AnimatePresence>
                                {isAIGenerating && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 rounded-xl bg-slate-900/80 backdrop-blur-sm
                                                   flex flex-col items-center justify-center"
                                    >
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 
                                                           flex items-center justify-center animate-pulse">
                                                <Sparkles className="w-8 h-8 text-white" />
                                            </div>
                                            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 
                                                           blur-xl opacity-50 animate-pulse" />
                                        </div>
                                        <p className="mt-4 text-purple-300 text-sm font-medium">
                                            AI กำลังสร้างรายละเอียด...
                                        </p>
                                        <p className="mt-1 text-slate-500 text-xs">
                                            ระบบจะวิเคราะห์หมวดหมู่และสร้างข้อความมืออาชีพ
                                        </p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Footer Stats */}
            <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{currentValue.length}/2000 ตัวอักษร</span>

                {/* Missing Language Prompt */}
                {!hasOtherLanguage && currentValue && onGenerateMissing && (
                    <button
                        onClick={() => onGenerateMissing(activeLanguage === 'TH' ? 'EN' : 'TH')}
                        disabled={isGenerating}
                        className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-colors"
                    >
                        <Sparkles className="w-3 h-3" />
                        {activeLanguage === 'TH' ? 'สร้างภาษาอังกฤษ' : 'Generate Thai'}
                    </button>
                )}

                {hasOtherLanguage && (
                    <span className="text-green-400 flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        {activeLanguage === 'TH' ? 'English ready' : 'ไทยพร้อม'}
                    </span>
                )}
            </div>
        </div>
    )
}

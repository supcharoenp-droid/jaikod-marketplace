'use client'

/**
 * SMART DESCRIPTION EDITOR
 * 
 * Component สำหรับแสดงและแก้ไขรายละเอียดสินค้าแบบ Section-based
 * 
 * Features:
 * - แสดงผลตาม Section (แยกส่วนชัดเจน)
 * - แก้ไขแต่ละ section ได้
 * - ปุ่ม AI Generate สำหรับแต่ละ section
 * - Preview แบบ Real-time
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react'
import {
    generateProductDescription,
    DescriptionSection,
    ProductDescriptionInput,
    GeneratedDescription
} from '@/lib/product-description-generator'

// ========================================
// TYPES
// ========================================
interface SmartDescriptionEditorProps {
    categoryId: number
    subcategoryId?: number
    categoryName_th?: string
    subcategoryName_th?: string
    productTitle: string
    userInputData?: Record<string, any>
    aiAnalysisData?: any
    language?: 'th' | 'en'
    onDescriptionChange?: (description: string, sections: DescriptionSection[]) => void
    initialDescription?: string
}

interface SectionEditorProps {
    section: DescriptionSection
    language: 'th' | 'en'
    isExpanded: boolean
    onToggle: () => void
    onContentChange: (content: string) => void
    onAiRegenerate?: () => void
    isRegenerating?: boolean
}

// ========================================
// SECTION EDITOR COMPONENT
// ========================================
const SectionEditor: React.FC<SectionEditorProps> = ({
    section,
    language,
    isExpanded,
    onToggle,
    onContentChange,
    onAiRegenerate,
    isRegenerating
}) => {
    const title = language === 'th' ? section.title_th : section.title_en
    const [localContent, setLocalContent] = useState(section.content)

    useEffect(() => {
        setLocalContent(section.content)
    }, [section.content])

    const handleBlur = () => {
        if (localContent !== section.content) {
            onContentChange(localContent)
        }
    }

    return (
        <div className="border border-slate-700 rounded-lg overflow-hidden transition-all duration-300">
            {/* Section Header */}
            <button
                onClick={onToggle}
                className="w-full flex items-center justify-between p-4 bg-slate-800/50 
                           hover:bg-slate-800 transition-colors text-left"
            >
                <div className="flex items-center gap-2">
                    {section.showTitle && (
                        <span className="text-base font-medium text-white">{title}</span>
                    )}
                    {!section.showTitle && (
                        <span className="text-slate-400 text-sm">
                            {language === 'th' ? '📝 บทนำ' : '📝 Introduction'}
                        </span>
                    )}
                </div>
                <svg
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''
                        }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Section Content */}
            {isExpanded && (
                <div className="p-4 bg-slate-900/50 space-y-3">
                    <textarea
                        value={localContent}
                        onChange={(e) => setLocalContent(e.target.value)}
                        onBlur={handleBlur}
                        rows={4}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg 
                                   text-white placeholder-slate-500 text-sm leading-relaxed
                                   focus:border-purple-500 focus:ring-1 focus:ring-purple-500 
                                   transition-all duration-200 resize-none"
                        placeholder={language === 'th' ? 'กรอกรายละเอียด...' : 'Enter details...'}
                    />

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-slate-500">
                            {localContent.length} {language === 'th' ? 'ตัวอักษร' : 'characters'}
                        </div>

                        {onAiRegenerate && (
                            <button
                                onClick={onAiRegenerate}
                                disabled={isRegenerating}
                                className="px-3 py-1.5 bg-purple-600/20 border border-purple-500/50 
                                           rounded-lg text-purple-300 text-xs hover:bg-purple-600/30
                                           transition-colors disabled:opacity-50 flex items-center gap-2"
                            >
                                {isRegenerating ? (
                                    <>
                                        <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        {language === 'th' ? 'กำลังสร้าง...' : 'Generating...'}
                                    </>
                                ) : (
                                    <>
                                        <span>✨</span>
                                        {language === 'th' ? 'สร้างด้วย AI' : 'Generate with AI'}
                                    </>
                                )}
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Preview (collapsed state) */}
            {!isExpanded && (
                <div className="px-4 py-2 text-sm text-slate-400 bg-slate-900/30 
                                line-clamp-2 leading-relaxed">
                    {localContent || (language === 'th' ? '(ยังไม่มีเนื้อหา)' : '(No content yet)')}
                </div>
            )}
        </div>
    )
}

// ========================================
// MAIN COMPONENT
// ========================================
export const SmartDescriptionEditor: React.FC<SmartDescriptionEditorProps> = ({
    categoryId,
    subcategoryId,
    categoryName_th,
    subcategoryName_th,
    productTitle,
    userInputData,
    aiAnalysisData,
    language = 'th',
    onDescriptionChange,
    initialDescription
}) => {
    const [sections, setSections] = useState<DescriptionSection[]>([])
    const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['intro']))
    const [isPreviewMode, setIsPreviewMode] = useState(false)
    const [regeneratingSection, setRegeneratingSection] = useState<string | null>(null)
    const [isInitialized, setIsInitialized] = useState(false)

    // 🔧 FIX: Generate initial description ONLY on first mount or when category changes
    useEffect(() => {
        // Skip if already initialized and category hasn't changed
        if (isInitialized && sections.length > 0) return

        const input: ProductDescriptionInput = {
            title: productTitle || '',
            categoryId,
            subcategoryId,
            categoryName_th,
            subcategoryName_th,
            userInputData: userInputData || {},
            aiAnalysisData,
            language
        }

        const result = generateProductDescription(input)
        setSections(result.sections)
        setIsInitialized(true)
        // Only depend on category changes, not userInputData (which causes loops)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [categoryId, subcategoryId])

    // Build full description
    const fullDescription = useMemo(() => {
        return sections
            .map(section => {
                if (section.showTitle) {
                    return `${section.title_th}\n${section.content}`
                }
                return section.content
            })
            .join('\n\n')
    }, [sections])

    // Toggle section expansion
    const toggleSection = useCallback((sectionId: string) => {
        setExpandedSections(prev => {
            const next = new Set(prev)
            if (next.has(sectionId)) {
                next.delete(sectionId)
            } else {
                next.add(sectionId)
            }
            return next
        })
    }, [])

    // Update section content AND notify parent
    const updateSectionContent = useCallback((sectionId: string, content: string) => {
        setSections(prev => {
            const newSections = prev.map(s =>
                s.id === sectionId ? { ...s, content } : s
            )

            // Build new full description
            const newFullDescription = newSections
                .map(section => {
                    if (section.showTitle) {
                        return `${section.title_th}\n${section.content}`
                    }
                    return section.content
                })
                .join('\n\n')

            // Notify parent (outside of setState to avoid loops)
            setTimeout(() => {
                onDescriptionChange?.(newFullDescription, newSections)
            }, 0)

            return newSections
        })
    }, [onDescriptionChange])

    // Expand/Collapse all
    const expandAll = useCallback(() => {
        setExpandedSections(new Set(sections.map(s => s.id)))
    }, [sections])

    const collapseAll = useCallback(() => {
        setExpandedSections(new Set())
    }, [])

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                        <span className="text-purple-400">📝</span>
                        {language === 'th' ? 'รายละเอียดสินค้า' : 'Product Description'}
                    </h3>
                    <p className="text-sm text-slate-400 mt-1">
                        {language === 'th'
                            ? 'แก้ไขแต่ละส่วนได้ตามต้องการ'
                            : 'Edit each section as needed'}
                    </p>
                </div>

                {/* Toggle Buttons */}
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setIsPreviewMode(!isPreviewMode)}
                        className={`px-3 py-1.5 rounded-lg text-xs transition-colors ${isPreviewMode
                            ? 'bg-purple-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                            }`}
                    >
                        {isPreviewMode
                            ? (language === 'th' ? '✏️ แก้ไข' : '✏️ Edit')
                            : (language === 'th' ? '👁️ ดูตัวอย่าง' : '👁️ Preview')}
                    </button>
                </div>
            </div>

            {/* Preview Mode */}
            {isPreviewMode ? (
                <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-xl">
                    {/* Preview Title */}
                    <div className="mb-4 pb-4 border-b border-slate-700">
                        <h4 className="text-base font-bold text-white">{productTitle}</h4>
                    </div>

                    {/* Preview Content */}
                    <div className="space-y-4 text-sm">
                        {sections.map((section) => (
                            <div key={section.id} className="space-y-2">
                                {section.showTitle && (
                                    <h5 className="font-semibold text-slate-200">
                                        {language === 'th' ? section.title_th : section.title_en}
                                    </h5>
                                )}
                                <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                                    {section.content}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Copy Button */}
                    <div className="mt-6 pt-4 border-t border-slate-700">
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(fullDescription)
                                alert(language === 'th' ? 'คัดลอกแล้ว!' : 'Copied!')
                            }}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 
                                       rounded-lg text-white text-sm transition-colors"
                        >
                            {language === 'th' ? '📋 คัดลอกข้อความ' : '📋 Copy Text'}
                        </button>
                    </div>
                </div>
            ) : (
                <>
                    {/* Quick Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={expandAll}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 
                                       rounded-lg text-slate-300 text-xs transition-colors"
                        >
                            {language === 'th' ? 'ขยายทั้งหมด' : 'Expand All'}
                        </button>
                        <button
                            onClick={collapseAll}
                            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 
                                       rounded-lg text-slate-300 text-xs transition-colors"
                        >
                            {language === 'th' ? 'ยุบทั้งหมด' : 'Collapse All'}
                        </button>
                    </div>

                    {/* Sections */}
                    <div className="space-y-3">
                        {sections.map((section) => (
                            <SectionEditor
                                key={section.id}
                                section={section}
                                language={language}
                                isExpanded={expandedSections.has(section.id)}
                                onToggle={() => toggleSection(section.id)}
                                onContentChange={(content) => updateSectionContent(section.id, content)}
                                isRegenerating={regeneratingSection === section.id}
                            />
                        ))}
                    </div>
                </>
            )}

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                    {language === 'th' ? 'ความยาวทั้งหมด:' : 'Total length:'} {fullDescription.length} {language === 'th' ? 'ตัวอักษร' : 'characters'}
                </span>
                <span>
                    {language === 'th' ? 'จำนวน Section:' : 'Sections:'} {sections.length}
                </span>
            </div>
        </div>
    )
}

export default SmartDescriptionEditor

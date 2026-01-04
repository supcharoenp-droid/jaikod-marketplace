'use client'

import { useState, useMemo } from 'react'
import {
    X, AlertTriangle, Camera, Link, FileText,
    ChevronRight, Check, Loader2, ShieldAlert,
    MessageSquare, Package, Store, Star, User
} from 'lucide-react'
import {
    ReportTargetType, ReportCategory, ReportCategoryConfig,
    getCategoriesForTarget, getCategoryConfig
} from '@/lib/report/types'
import { ReportService } from '@/lib/report/reportService'

// ==========================================
// TYPES
// ==========================================

interface ReportModalProps {
    isOpen: boolean
    onClose: () => void
    targetType: ReportTargetType
    targetId: string
    targetTitle?: string
    reporterId: string
}

type Step = 'category' | 'details' | 'evidence' | 'confirm' | 'success'

// ==========================================
// TARGET ICONS
// ==========================================

const TargetIcons: Record<ReportTargetType, React.ReactNode> = {
    listing: <Package className="w-5 h-5" />,
    product: <Package className="w-5 h-5" />,
    seller: <Store className="w-5 h-5" />,
    user: <User className="w-5 h-5" />,
    review: <Star className="w-5 h-5" />,
    message: <MessageSquare className="w-5 h-5" />
}

const TargetLabels: Record<ReportTargetType, string> = {
    listing: 'ประกาศขาย',
    product: 'สินค้า',
    seller: 'ผู้ขาย',
    user: 'ผู้ใช้',
    review: 'รีวิว',
    message: 'ข้อความ'
}

// ==========================================
// MAIN COMPONENT
// ==========================================

export default function ReportModal({
    isOpen,
    onClose,
    targetType,
    targetId,
    targetTitle,
    reporterId
}: ReportModalProps) {
    const [step, setStep] = useState<Step>('category')
    const [selectedCategory, setSelectedCategory] = useState<ReportCategory | null>(null)
    const [description, setDescription] = useState('')
    const [evidenceLinks, setEvidenceLinks] = useState<string[]>([])
    const [newLink, setNewLink] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [reportId, setReportId] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const categories = useMemo(() => getCategoriesForTarget(targetType), [targetType])
    const categoryConfig = selectedCategory ? getCategoryConfig(selectedCategory) : null

    const handleSelectCategory = (category: ReportCategory) => {
        setSelectedCategory(category)
        setError(null)
    }

    const handleAddLink = () => {
        if (newLink.trim() && !evidenceLinks.includes(newLink.trim())) {
            setEvidenceLinks([...evidenceLinks, newLink.trim()])
            setNewLink('')
        }
    }

    const handleRemoveLink = (index: number) => {
        setEvidenceLinks(evidenceLinks.filter((_, i) => i !== index))
    }

    const handleSubmit = async () => {
        if (!selectedCategory) return

        setIsSubmitting(true)
        setError(null)

        try {
            const result = await ReportService.create(reporterId, {
                target_type: targetType,
                target_id: targetId,
                category: selectedCategory,
                description: description || `รายงาน: ${categoryConfig?.name_th}`,
                evidence: evidenceLinks.map(url => ({ type: 'link', url }))
            })

            if (result.success) {
                setReportId(result.report_id || null)
                setStep('success')
            } else {
                setError(result.error?.message || 'เกิดข้อผิดพลาด')
            }
        } catch (err) {
            setError('ไม่สามารถส่งรายงานได้ กรุณาลองใหม่')
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleClose = () => {
        setStep('category')
        setSelectedCategory(null)
        setDescription('')
        setEvidenceLinks([])
        setNewLink('')
        setError(null)
        setReportId(null)
        onClose()
    }

    const goNext = () => {
        if (step === 'category' && selectedCategory) {
            setStep('details')
        } else if (step === 'details') {
            if (categoryConfig?.requires_evidence) {
                setStep('evidence')
            } else {
                setStep('confirm')
            }
        } else if (step === 'evidence') {
            setStep('confirm')
        }
    }

    const goBack = () => {
        if (step === 'details') setStep('category')
        else if (step === 'evidence') setStep('details')
        else if (step === 'confirm') {
            if (categoryConfig?.requires_evidence) {
                setStep('evidence')
            } else {
                setStep('details')
            }
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={handleClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white dark:bg-surface-dark rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                            <ShieldAlert className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <h2 className="font-bold">รายงาน{TargetLabels[targetType]}</h2>
                            {targetTitle && (
                                <p className="text-sm text-text-secondary truncate max-w-[200px]">
                                    {targetTitle}
                                </p>
                            )}
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Progress */}
                {step !== 'success' && (
                    <div className="px-4 pt-4">
                        <div className="flex items-center gap-2">
                            {['category', 'details', categoryConfig?.requires_evidence ? 'evidence' : null, 'confirm']
                                .filter(Boolean)
                                .map((s, i, arr) => (
                                    <div key={s} className="flex items-center">
                                        <div className={`
                                            w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                                            ${step === s ? 'bg-red-500 text-white' :
                                                arr.indexOf(step) > i ? 'bg-emerald-500 text-white' :
                                                    'bg-gray-200 dark:bg-gray-700 text-gray-500'}
                                        `}>
                                            {arr.indexOf(step) > i ? <Check className="w-3 h-3" /> : i + 1}
                                        </div>
                                        {i < arr.length - 1 && (
                                            <div className={`w-8 h-0.5 mx-1 ${arr.indexOf(step) > i ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-700'
                                                }`} />
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                )}

                {/* Content */}
                <div className="p-4 max-h-[60vh] overflow-y-auto">

                    {/* Step 1: Select Category */}
                    {step === 'category' && (
                        <div>
                            <p className="text-sm text-text-secondary mb-4">
                                เลือกประเภทปัญหาที่พบ
                            </p>
                            <div className="space-y-2">
                                {categories.map(cat => (
                                    <button
                                        key={cat.id}
                                        onClick={() => handleSelectCategory(cat.id)}
                                        className={`
                                            w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left
                                            ${selectedCategory === cat.id
                                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                                            }
                                        `}
                                    >
                                        <span className="text-2xl">{cat.icon}</span>
                                        <div className="flex-1">
                                            <div className="font-medium">{cat.name_th}</div>
                                            <div className="text-xs text-text-secondary">{cat.description_th}</div>
                                        </div>
                                        {selectedCategory === cat.id && (
                                            <Check className="w-5 h-5 text-red-500" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Details */}
                    {step === 'details' && (
                        <div>
                            <div className="flex items-center gap-2 mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                <span className="text-2xl">{categoryConfig?.icon}</span>
                                <div>
                                    <div className="font-medium">{categoryConfig?.name_th}</div>
                                    <div className="text-xs text-text-secondary">{categoryConfig?.description_th}</div>
                                </div>
                            </div>

                            <label className="block text-sm font-medium mb-2">
                                รายละเอียดเพิ่มเติม
                                <span className="text-text-secondary font-normal ml-1">(ไม่บังคับ)</span>
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="อธิบายปัญหาที่พบเพิ่มเติม..."
                                className="w-full h-32 p-3 border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent resize-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            />
                            <p className="text-xs text-text-secondary mt-2">
                                การให้รายละเอียดจะช่วยให้เราตรวจสอบได้เร็วขึ้น
                            </p>
                        </div>
                    )}

                    {/* Step 3: Evidence */}
                    {step === 'evidence' && (
                        <div>
                            <div className="flex items-center gap-2 mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
                                <AlertTriangle className="w-5 h-5 text-amber-600" />
                                <div className="text-sm text-amber-800 dark:text-amber-200">
                                    {categoryConfig?.name_th} ต้องแนบหลักฐานประกอบ
                                </div>
                            </div>

                            <label className="block text-sm font-medium mb-2">
                                แนบลิงก์หลักฐาน
                            </label>

                            <div className="flex gap-2 mb-3">
                                <input
                                    type="url"
                                    value={newLink}
                                    onChange={(e) => setNewLink(e.target.value)}
                                    placeholder="https://..."
                                    className="flex-1 px-3 py-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-transparent focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                />
                                <button
                                    onClick={handleAddLink}
                                    disabled={!newLink.trim()}
                                    className="px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50"
                                >
                                    + เพิ่ม
                                </button>
                            </div>

                            {evidenceLinks.length > 0 && (
                                <div className="space-y-2">
                                    {evidenceLinks.map((link, i) => (
                                        <div key={i} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <Link className="w-4 h-4 text-blue-500" />
                                            <span className="flex-1 text-sm truncate">{link}</span>
                                            <button
                                                onClick={() => handleRemoveLink(i)}
                                                className="text-red-500 hover:text-red-600"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <p className="text-xs text-text-secondary mt-3">
                                สามารถแนบลิงก์รูปภาพ หรือหลักฐานอื่นๆ ได้
                            </p>
                        </div>
                    )}

                    {/* Step 4: Confirm */}
                    {step === 'confirm' && (
                        <div>
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                                    <ShieldAlert className="w-8 h-8 text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold mb-2">ยืนยันการรายงาน?</h3>
                                <p className="text-sm text-text-secondary">
                                    เราจะตรวจสอบรายงานของคุณโดยเร็วที่สุด
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">ประเภท:</span>
                                    <span className="font-medium">{TargetLabels[targetType]}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">หมวดหมู่:</span>
                                    <span className="font-medium">{categoryConfig?.icon} {categoryConfig?.name_th}</span>
                                </div>
                                {description && (
                                    <div className="text-sm">
                                        <span className="text-text-secondary">รายละเอียด:</span>
                                        <p className="mt-1 text-gray-600 dark:text-gray-400">{description}</p>
                                    </div>
                                )}
                                {evidenceLinks.length > 0 && (
                                    <div className="text-sm">
                                        <span className="text-text-secondary">หลักฐาน:</span>
                                        <span className="ml-2">{evidenceLinks.length} รายการ</span>
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-600">
                                    {error}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Success */}
                    {step === 'success' && (
                        <div className="text-center py-6">
                            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                                <Check className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">ส่งรายงานสำเร็จ!</h3>
                            <p className="text-text-secondary mb-4">
                                ขอบคุณที่ช่วยรักษาความปลอดภัยของชุมชน
                            </p>
                            {reportId && (
                                <p className="text-sm text-text-secondary">
                                    หมายเลขรายงาน: <span className="font-mono">{reportId}</span>
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                    {step === 'success' ? (
                        <button
                            onClick={handleClose}
                            className="w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-600"
                        >
                            ปิด
                        </button>
                    ) : (
                        <>
                            {step !== 'category' ? (
                                <button
                                    onClick={goBack}
                                    className="px-6 py-3 text-text-secondary hover:text-text-primary"
                                >
                                    ย้อนกลับ
                                </button>
                            ) : (
                                <div />
                            )}

                            {step === 'confirm' ? (
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting}
                                    className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50 flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            <span>กำลังส่ง...</span>
                                        </>
                                    ) : (
                                        <>
                                            <ShieldAlert className="w-4 h-4" />
                                            <span>ส่งรายงาน</span>
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    onClick={goNext}
                                    disabled={
                                        (step === 'category' && !selectedCategory) ||
                                        (step === 'evidence' && categoryConfig?.requires_evidence && evidenceLinks.length === 0)
                                    }
                                    className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    <span>ถัดไป</span>
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

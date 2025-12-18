/**
 * DynamicDetailForm - SIMPLIFIED VERSION
 * 
 * Clean, simple, user-friendly form WITHOUT overwhelming AI panels
 * AI auto-fills values, users can just edit normally
 */

import React, { useState, useEffect, useMemo } from 'react'
import { getCategorySchema, validateCategoryData } from '@/config/category-schemas'
import { DetailFormData, AISuggestions, ValidationState } from '@/types/dynamic-form'
import FieldRenderer from './FieldRenderer'
import { CheckCircle2, Sparkles, AlertCircle } from 'lucide-react'

interface DynamicDetailFormSimpleProps {
    categoryId: string
    initialData?: DetailFormData
    aiSuggestions?: AISuggestions
    onChange: (data: DetailFormData) => void
    onValidationChange?: (state: ValidationState) => void
    readonly?: boolean
}

export default function DynamicDetailFormSimple({
    categoryId,
    initialData = {},
    aiSuggestions,
    onChange,
    onValidationChange,
    readonly = false
}: DynamicDetailFormSimpleProps) {
    const [data, setData] = useState<DetailFormData>(initialData)
    const [hasAutoFilled, setHasAutoFilled] = useState(false)

    // Get category schema
    const schema = useMemo(() => getCategorySchema(categoryId), [categoryId])

    // Validate data
    const validation = useMemo(() => {
        if (!schema) return { isValid: true, errors: {}, warnings: {} }
        return validateCategoryData(categoryId, data)
    }, [schema, categoryId, data])

    // Auto-fill with AI suggestions (once)
    useEffect(() => {
        if (aiSuggestions && !hasAutoFilled && Object.keys(data).length === 0) {
            const autoFilledData: DetailFormData = {}
            Object.entries(aiSuggestions.suggestedFields).forEach(([fieldId, suggestion]) => {
                if (suggestion.confidence >= 0.7) {  // Auto-fill if confidence > 70%
                    autoFilledData[fieldId] = suggestion.value
                }
            })
            if (Object.keys(autoFilledData).length > 0) {
                setData(autoFilledData)
                setHasAutoFilled(true)
            }
        }
    }, [aiSuggestions, hasAutoFilled, data])

    // Notify parent of data changes
    useEffect(() => {
        onChange(data)
    }, [data, onChange])

    // Notify parent of validation changes
    useEffect(() => {
        if (onValidationChange) {
            onValidationChange(validation)
        }
    }, [validation, onValidationChange])

    // Handle field value change
    const handleFieldChange = (fieldId: string, value: any) => {
        setData(prev => ({ ...prev, [fieldId]: value }))
    }

    // Check if field should show condition
    const shouldShowField = (field: any): boolean => {
        if (!field.condition) return true

        for (const [condFieldId, condValue] of Object.entries(field.condition)) {
            const currentValue = data[condFieldId]
            if (Array.isArray(condValue)) {
                if (!condValue.includes(currentValue)) return false
            } else {
                if (currentValue !== condValue) return false
            }
        }

        return true
    }

    // Group fields by importance
    const fieldsByImportance = useMemo(() => {
        if (!schema) return { critical: [], recommended: [], optional: [] }

        return {
            critical: schema.fields.filter(f => f.importance === 'critical' && shouldShowField(f)),
            recommended: schema.fields.filter(f => f.importance === 'recommended' && shouldShowField(f)),
            optional: schema.fields.filter(f => f.importance === 'optional' && shouldShowField(f))
        }
    }, [schema, data])

    // Calculate completion stats
    const stats = useMemo(() => {
        if (!schema) return { total: 0, filled: 0, critical: 0, criticalFilled: 0 }

        const visibleFields = schema.fields.filter(shouldShowField)
        const filledFields = visibleFields.filter(f => {
            const value = data[f.id]
            return value !== undefined && value !== null && value !== ''
        })

        const criticalFields = fieldsByImportance.critical
        const criticalFilled = criticalFields.filter(f => {
            const value = data[f.id]
            return value !== undefined && value !== null && value !== ''
        })

        return {
            total: visibleFields.length,
            filled: filledFields.length,
            critical: criticalFields.length,
            criticalFilled: criticalFilled.length
        }
    }, [schema, data, fieldsByImportance])

    if (!schema) {
        return (
            <div className="p-8 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400">
                    ยังไม่มีฟอร์มรายละเอียดสำหรับหมวดหมู่นี้
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Simple Header - No AI Panel */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                        {schema.icon} {schema.categoryName}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {schema.description}
                    </p>
                </div>

                {/* Simple Stats */}
                {hasAutoFilled && (
                    <div className="text-right">
                        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm">
                            <Sparkles className="w-4 h-4" />
                            <span>AI ช่วยกรอกแล้ว</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {stats.filled}/{stats.total} ฟิลด์
                        </p>
                    </div>
                )}
            </div>

            {/* Single Column Form - Simple & Clean */}
            <div className="space-y-6">
                {/* Critical Fields - 2 Column Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {fieldsByImportance.critical.map(field => {
                        // Determine if field should span full width
                        const shouldSpanFull =
                            field.type === 'textarea' ||
                            field.type === 'multiselect' ||
                            field.type === 'tags' ||
                            (field.type === 'text' && (field as any).maxLength > 100)

                        return (
                            <div key={field.id} className={shouldSpanFull ? 'md:col-span-2' : ''}>
                                <FieldRenderer
                                    field={field}
                                    value={data[field.id]}
                                    onChange={(value) => handleFieldChange(field.id, value)}
                                    error={validation.errors[field.id]}
                                    readonly={readonly}
                                />
                            </div>
                        )
                    })}
                </div>

                {/* Recommended Fields - 2 Column Grid */}
                {fieldsByImportance.recommended.length > 0 && (
                    <>
                        <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                                ข้อมูลเสริม (เพิ่มความน่าเชื่อถือ)
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fieldsByImportance.recommended.map(field => {
                                const shouldSpanFull =
                                    field.type === 'textarea' ||
                                    field.type === 'multiselect' ||
                                    field.type === 'tags' ||
                                    (field.type === 'text' && (field as any).maxLength > 100)

                                return (
                                    <div key={field.id} className={shouldSpanFull ? 'md:col-span-2' : ''}>
                                        <FieldRenderer
                                            field={field}
                                            value={data[field.id]}
                                            onChange={(value) => handleFieldChange(field.id, value)}
                                            error={validation.errors[field.id]}
                                            readonly={readonly}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </>
                )}

                {/* Optional Fields - Collapsed by default - 2 Column Grid */}
                {fieldsByImportance.optional.length > 0 && (
                    <details className="pt-4 border-t border-gray-100 dark:border-gray-800">
                        <summary className="cursor-pointer text-sm text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                            <span>ข้อมูลเพิ่มเติม ({fieldsByImportance.optional.length})</span>
                            <span className="text-xs text-gray-400">คลิกเพื่อแสดง</span>
                        </summary>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                            {fieldsByImportance.optional.map(field => {
                                const shouldSpanFull =
                                    field.type === 'textarea' ||
                                    field.type === 'multiselect' ||
                                    field.type === 'tags' ||
                                    (field.type === 'text' && (field as any).maxLength > 100)

                                return (
                                    <div key={field.id} className={shouldSpanFull ? 'md:col-span-2' : ''}>
                                        <FieldRenderer
                                            field={field}
                                            value={data[field.id]}
                                            onChange={(value) => handleFieldChange(field.id, value)}
                                            error={validation.errors[field.id]}
                                            readonly={readonly}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </details>
                )}
            </div>

            {/* Simple Status Footer */}
            {stats.criticalFilled === stats.critical && stats.critical > 0 && (
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                        <CheckCircle2 className="w-4 h-4" />
                        <span>ข้อมูลพร้อมเผยแพร่</span>
                    </div>
                </div>
            )}

            {/* Error Summary - Only if has errors */}
            {!validation.isValid && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm font-medium text-red-900 dark:text-red-100 mb-2">
                        กรุณาตรวจสอบ:
                    </p>
                    <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                        {Object.entries(validation.errors).map(([fieldId, error]) => (
                            <li key={fieldId}>• {error}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
}

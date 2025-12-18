/**
 * DynamicDetailForm Component
 * 
 * Main component for category-specific product detail forms
 * with AI-assisted field suggestions
 */

import React, { useState, useEffect, useMemo } from 'react'
import { getCategorySchema, validateCategoryData } from '@/config/category-schemas'
import { DetailFormData, AISuggestions, ValidationState } from '@/types/dynamic-form'
import FieldRenderer from './FieldRenderer'
import AIAssistantPanel from './AIAssistantPanel'
import { AlertCircle, CheckCircle2, Info } from 'lucide-react'

interface DynamicDetailFormProps {
    categoryId: string
    initialData?: DetailFormData
    aiSuggestions?: AISuggestions
    onChange: (data: DetailFormData) => void
    onValidationChange?: (state: ValidationState) => void
    showAIAssistant?: boolean
    readonly?: boolean
}

export default function DynamicDetailForm({
    categoryId,
    initialData = {},
    aiSuggestions,
    onChange,
    onValidationChange,
    showAIAssistant = true,
    readonly = false
}: DynamicDetailFormProps) {
    const [data, setData] = useState<DetailFormData>(initialData)
    const [appliedAIFields, setAppliedAIFields] = useState<Set<string>>(new Set())
    const [rejectedAIFields, setRejectedAIFields] = useState<Set<string>>(new Set())

    // Get category schema
    const schema = useMemo(() => getCategorySchema(categoryId), [categoryId])

    // Validate data
    const validation = useMemo(() => {
        if (!schema) return { isValid: true, errors: {}, warnings: {} }
        return validateCategoryData(categoryId, data)
    }, [schema, categoryId, data])

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

    // Handle accepting AI suggestion
    const handleAcceptAI = (fieldId: string) => {
        if (!aiSuggestions?.suggestedFields[fieldId]) return

        const suggestion = aiSuggestions.suggestedFields[fieldId]
        handleFieldChange(fieldId, suggestion.value)
        setAppliedAIFields(prev => new Set(prev).add(fieldId))
        setRejectedAIFields(prev => {
            const next = new Set(prev)
            next.delete(fieldId)
            return next
        })
    }

    // Handle rejecting AI suggestion
    const handleRejectAI = (fieldId: string) => {
        setRejectedAIFields(prev => new Set(prev).add(fieldId))
    }

    // Handle accepting all AI suggestions
    const handleAcceptAllAI = () => {
        if (!aiSuggestions) return

        const newData = { ...data }
        const newApplied = new Set(appliedAIFields)

        Object.entries(aiSuggestions.suggestedFields).forEach(([fieldId, suggestion]) => {
            if (!data[fieldId] && !rejectedAIFields.has(fieldId)) {
                newData[fieldId] = suggestion.value
                newApplied.add(fieldId)
            }
        })

        setData(newData)
        setAppliedAIFields(newApplied)
    }

    // Check if field should show condition
    const shouldShowField = (field: any): boolean => {
        if (!field.condition) return true

        // Check if condition is met
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
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-xl">
                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="text-2xl">{schema.icon}</span>
                            <h2 className="text-xl font-bold">{schema.categoryName}</h2>
                        </div>
                        <p className="text-purple-100 text-sm">
                            {schema.description}
                        </p>
                    </div>

                    {/* Stats */}
                    <div className="text-right">
                        <div className="text-3xl font-bold">
                            {stats.filled}/{stats.total}
                        </div>
                        <div className="text-sm text-purple-100">
                            ฟิลด์ที่กรอกแล้ว
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                        <span>ความคืบหน้า</span>
                        <span>{Math.round((stats.filled / stats.total) * 100)}%</span>
                    </div>
                    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white transition-all duration-300"
                            style={{ width: `${(stats.filled / stats.total) * 100}%` }}
                        />
                    </div>
                </div>

                {/* Critical Fields Status */}
                <div className="mt-3 flex items-center gap-2 text-sm">
                    {stats.criticalFilled === stats.critical ? (
                        <>
                            <CheckCircle2 className="w-4 h-4" />
                            <span>กรอกข้อมูลจำเป็นครบถ้วน</span>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-4 h-4" />
                            <span>ข้อมูลจำเป็น: {stats.criticalFilled}/{stats.critical}</span>
                        </>
                    )}
                </div>
            </div>

            {/* AI Assistant Panel */}
            {showAIAssistant && aiSuggestions && (
                <AIAssistantPanel
                    suggestions={aiSuggestions}
                    appliedFields={appliedAIFields}
                    onAccept={handleAcceptAI}
                    onReject={handleRejectAI}
                    onAcceptAll={handleAcceptAllAI}
                />
            )}

            {/* Critical Fields */}
            {fieldsByImportance.critical.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-red-500 rounded-full" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            ข้อมูลจำเป็น 🔴
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fieldsByImportance.critical.map(field => (
                            <FieldRenderer
                                key={field.id}
                                field={field}
                                value={data[field.id]}
                                onChange={(value) => handleFieldChange(field.id, value)}
                                error={validation.errors[field.id]}
                                aiSuggestion={
                                    !rejectedAIFields.has(field.id)
                                        ? aiSuggestions?.suggestedFields[field.id]
                                        : undefined
                                }
                                onAcceptAI={() => handleAcceptAI(field.id)}
                                readonly={readonly}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Recommended Fields */}
            {fieldsByImportance.recommended.length > 0 && (
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-yellow-500 rounded-full" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            ข้อมูลแนะนำ 🟡
                        </h3>
                        <span className="text-xs text-gray-400" title="ช่วยเพิ่มความน่าเชื่อถือ">
                            <Info className="w-4 h-4" />
                        </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {fieldsByImportance.recommended.map(field => (
                            <FieldRenderer
                                key={field.id}
                                field={field}
                                value={data[field.id]}
                                onChange={(value) => handleFieldChange(field.id, value)}
                                error={validation.errors[field.id]}
                                aiSuggestion={
                                    !rejectedAIFields.has(field.id)
                                        ? aiSuggestions?.suggestedFields[field.id]
                                        : undefined
                                }
                                onAcceptAI={() => handleAcceptAI(field.id)}
                                readonly={readonly}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Optional Fields */}
            {fieldsByImportance.optional.length > 0 && (
                <details className="space-y-4 group">
                    <summary className="cursor-pointer flex items-center gap-2 text-lg font-semibold text-gray-700 dark:text-gray-300 list-none">
                        <div className="w-1 h-6 bg-gray-400 rounded-full" />
                        <span>ข้อมูลเพิ่มเติม ⚪ ({fieldsByImportance.optional.length})</span>
                        <span className="text-sm text-gray-500 ml-auto">คลิกเพื่อแสดง/ซ่อน</span>
                    </summary>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                        {fieldsByImportance.optional.map(field => (
                            <FieldRenderer
                                key={field.id}
                                field={field}
                                value={data[field.id]}
                                onChange={(value) => handleFieldChange(field.id, value)}
                                error={validation.errors[field.id]}
                                aiSuggestion={
                                    !rejectedAIFields.has(field.id)
                                        ? aiSuggestions?.suggestedFields[field.id]
                                        : undefined
                                }
                                onAcceptAI={() => handleAcceptAI(field.id)}
                                readonly={readonly}
                            />
                        ))}
                    </div>
                </details>
            )}

            {/* Validation Summary */}
            {!validation.isValid && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5" />
                        <div>
                            <h4 className="font-medium text-red-900 dark:text-red-100 mb-2">
                                กรุณาตรวจสอบข้อมูล
                            </h4>
                            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                                {Object.entries(validation.errors).map(([fieldId, error]) => (
                                    <li key={fieldId}>• {fieldId}: {error}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

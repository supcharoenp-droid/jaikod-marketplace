/**
 * FieldRenderer Component
 * 
 * Renders individual form fields based on field schema
 * Supports 9 field types with AI suggestions
 */

import React from 'react'
import { FieldSchema, FieldSuggestion, FIELD_IMPORTANCE_CONFIG } from '@/types/dynamic-form'
import { Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react'

interface FieldRendererProps {
    field: FieldSchema
    value: any
    onChange: (value: any) => void
    error?: string
    warning?: string
    aiSuggestion?: FieldSuggestion
    readonly?: boolean
    onAcceptAI?: () => void
}

export default function FieldRenderer({
    field,
    value,
    onChange,
    error,
    warning,
    aiSuggestion,
    readonly = false,
    onAcceptAI
}: FieldRendererProps) {
    const importanceConfig = FIELD_IMPORTANCE_CONFIG[field.importance]
    const hasValue = value !== undefined && value !== null && value !== ''

    // Hooks must be at the top level
    const [inputValue, setInputValue] = React.useState('')

    // Render field based on type
    const renderField = () => {
        switch (field.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        maxLength={(field as any).maxLength}
                        disabled={readonly}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                )

            case 'textarea':
                return (
                    <textarea
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={field.placeholder}
                        rows={(field as any).rows || 4}
                        maxLength={(field as any).maxLength}
                        disabled={readonly}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none disabled:opacity-50"
                    />
                )

            case 'number':
                const numberField = field as any
                return (
                    <div className="flex items-center gap-2">
                        {numberField.prefix && (
                            <span className="text-gray-500 dark:text-gray-400">{numberField.prefix}</span>
                        )}
                        <input
                            type="number"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value ? Number(e.target.value) : null)}
                            placeholder={field.placeholder}
                            min={numberField.min}
                            max={numberField.max}
                            step={numberField.step}
                            disabled={readonly}
                            className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                        />
                        {numberField.suffix && (
                            <span className="text-gray-500 dark:text-gray-400">{numberField.suffix}</span>
                        )}
                    </div>
                )

            case 'select':
                const selectField = field as any
                return (
                    <select
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        disabled={readonly}
                        className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                        <option value="">-- เลือก{field.label} --</option>
                        {selectField.options.map((opt: any) => (
                            <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
                                {typeof opt === 'string' ? opt : opt.label}
                            </option>
                        ))}
                    </select>
                )

            case 'multiselect':
                const multiselectField = field as any
                const selectedValuesList = value || []
                return (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {multiselectField.options.map((opt: any) => {
                            const optValue = typeof opt === 'string' ? opt : opt.value
                            const optLabel = typeof opt === 'string' ? opt : opt.label
                            const isSelected = selectedValuesList.includes(optValue)

                            return (
                                <label key={optValue} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                onChange([...selectedValuesList, optValue])
                                            } else {
                                                onChange(selectedValuesList.filter((v: any) => v !== optValue))
                                            }
                                        }}
                                        disabled={readonly}
                                        className="w-4 h-4 text-purple-600 rounded focus:ring-2 focus:ring-purple-500"
                                    />
                                    <span className="text-sm text-gray-700 dark:text-gray-300">{optLabel}</span>
                                </label>
                            )
                        })}
                    </div>
                )

            case 'boolean':
                const boolField = field as any
                return (
                    <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={value === true}
                                onChange={() => onChange(true)}
                                disabled={readonly}
                                className="w-4 h-4 text-purple-600 focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {boolField.label_true || 'ใช่'}
                            </span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                checked={value === false}
                                onChange={() => onChange(false)}
                                disabled={readonly}
                                className="w-4 h-4 text-purple-600 focus:ring-2 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                {boolField.label_false || 'ไม่'}
                            </span>
                        </label>
                    </div>
                )

            case 'tags':
                const tagsList = value || []

                return (
                    <div className="space-y-2">
                        <div className="flex flex-wrap gap-2">
                            {tagsList.map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full text-sm"
                                >
                                    {tag}
                                    {!readonly && (
                                        <button
                                            onClick={() => onChange(tagsList.filter((_: any, i: number) => i !== index))}
                                            className="hover:text-purple-900 dark:hover:text-purple-100"
                                        >
                                            ×
                                        </button>
                                    )}
                                </span>
                            ))}
                        </div>
                        {!readonly && (
                            <input
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && inputValue.trim()) {
                                        e.preventDefault()
                                        if (!tagsList.includes(inputValue.trim())) {
                                            onChange([...tagsList, inputValue.trim()])
                                            setInputValue('')
                                        }
                                    }
                                }}
                                placeholder={field.placeholder || 'พิมพ์แล้วกด Enter'}
                                className="w-full px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            />
                        )}
                    </div>
                )

            default:
                return <div className="text-gray-500">Unsupported field type: {field.type}</div>
        }
    }

    return (
        <div className="space-y-2">
            {/* Label with Importance Badge */}
            <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    <span>{field.label}</span>
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full ${field.importance === 'critical'
                            ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                            : field.importance === 'recommended'
                                ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                            }`}
                    >
                        {importanceConfig.icon} {importanceConfig.badge}
                    </span>
                </label>

                {/* AI Suggestion Badge */}
                {aiSuggestion && !hasValue && (
                    <button
                        onClick={onAcceptAI}
                        className="flex items-center gap-1 text-xs text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                    >
                        <Sparkles className="w-3 h-3" />
                        <span>AI แนะนำ ({Math.round(aiSuggestion.confidence * 100)}%)</span>
                    </button>
                )}
            </div>

            {/* Field Input */}
            <div className="relative">
                {renderField()}

                {/* AI Suggestion Overlay */}
                {aiSuggestion && !hasValue && (
                    <div className="absolute inset-0 bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-300 dark:border-purple-700 rounded-lg flex items-center justify-between px-4 pointer-events-none">
                        <div className="flex items-center gap-2 text-sm text-purple-700 dark:text-purple-300">
                            <Sparkles className="w-4 h-4" />
                            <span className="font-medium">{aiSuggestion.value}</span>
                            <span className="text-xs opacity-75">({aiSuggestion.source})</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Helper Text */}
            {field.helper && !error && !warning && (
                <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                    <span>{field.helper}</span>
                </p>
            )}

            {/* Error Message */}
            {error && (
                <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{error}</span>
                </p>
            )}

            {/* Warning Message */}
            {warning && !error && (
                <p className="text-xs text-yellow-600 dark:text-yellow-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>{warning}</span>
                </p>
            )}

            {/* Success Indicator */}
            {hasValue && !error && field.importance === 'critical' && (
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>กรอกแล้ว</span>
                </p>
            )}
        </div>
    )
}

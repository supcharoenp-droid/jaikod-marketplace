/**
 * AIAssistantPanel Component
 * 
 * Displays AI suggestions for form fields
 * Allows accept/reject of individual or all suggestions
 */

import React from 'react'
import { AISuggestions } from '@/types/dynamic-form'
import { Sparkles, Check, X, CheckCheck, AlertTriangle } from 'lucide-react'

interface AIAssistantPanelProps {
    suggestions: AISuggestions
    appliedFields: Set<string>
    onAccept: (fieldId: string) => void
    onReject: (fieldId: string) => void
    onAcceptAll: () => void
}

export default function AIAssistantPanel({
    suggestions,
    appliedFields,
    onAccept,
    onReject,
    onAcceptAll
}: AIAssistantPanelProps) {
    const totalSuggestions = Object.keys(suggestions.suggestedFields).length
    const acceptedCount = appliedFields.size
    const remainingCount = totalSuggestions - acceptedCount

    if (totalSuggestions === 0) {
        return null
    }

    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-2 border-purple-200 dark:border-purple-800 rounded-xl p-6 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-500 rounded-lg">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                            AI ช่วยกรอกข้อมูล
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {remainingCount > 0 ? (
                                <>พบ {remainingCount} ฟิลด์ที่แนะนำ</>
                            ) : (
                                <>ใช้คำแนะนำทั้งหมดแล้ว</>
                            )}
                        </p>
                    </div>
                </div>

                {/* Overall Confidence */}
                <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {Math.round(suggestions.overallConfidence * 100)}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                        ความมั่นใจโดยรวม
                    </div>
                </div>
            </div>

            {/* Accept All Button */}
            {remainingCount > 0 && (
                <button
                    onClick={onAcceptAll}
                    className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                    <CheckCheck className="w-5 h-5" />
                    <span>ใช้คำแนะนำทั้งหมด ({remainingCount} ฟิลด์)</span>
                </button>
            )}

            {/* Suggestions List */}
            <div className="space-y-3">
                {Object.entries(suggestions.suggestedFields).map(([fieldId, suggestion]) => {
                    const isApplied = appliedFields.has(fieldId)
                    const isHighConfidence = suggestion.confidence >= 0.85

                    return (
                        <div
                            key={fieldId}
                            className={`p-4 rounded-lg border-2 transition-all ${isApplied
                                    ? 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                                }`}
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {fieldId}
                                        </span>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full ${isHighConfidence
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
                                                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                                                }`}
                                        >
                                            {Math.round(suggestion.confidence * 100)}% มั่นใจ
                                        </span>
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            ({suggestion.source})
                                        </span>
                                    </div>

                                    <div className="text-base font-semibold text-gray-900 dark:text-white truncate">
                                        {typeof suggestion.value === 'object'
                                            ? JSON.stringify(suggestion.value)
                                            : suggestion.value}
                                    </div>

                                    {suggestion.reasoning && (
                                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                                            {suggestion.reasoning}
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                {!isApplied ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => onAccept(fieldId)}
                                            className="p-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                                            title="ใช้คำแนะนำนี้"
                                        >
                                            <Check className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onReject(fieldId)}
                                            className="p-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                                            title="ไม่ใช้"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm">
                                        <Check className="w-4 h-4" />
                                        <span>ใช้แล้ว</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Missing Critical Fields Warning */}
            {suggestions.missingCritical.length > 0 && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                            <h4 className="font-medium text-red-900 dark:text-red-100 mb-1">
                                ข้อมูลสำคัญที่ยังขาด
                            </h4>
                            <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                                {suggestions.missingCritical.map(field => (
                                    <li key={field}>• {field}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Recommendations */}
            {suggestions.recommendations.length > 0 && (
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2 text-sm">
                        💡 คำแนะนำเพิ่มเติม
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
                        {suggestions.recommendations.map((rec, index) => (
                            <li key={index}>• {rec}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Stats Footer */}
            <div className="pt-4 border-t border-purple-200 dark:border-purple-800 flex items-center justify-between text-sm">
                <div className="text-gray-600 dark:text-gray-400">
                    {acceptedCount} / {totalSuggestions} คำแนะนำถูกใช้
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
                            style={{ width: `${(acceptedCount / totalSuggestions) * 100}%` }}
                        />
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                        {Math.round((acceptedCount / totalSuggestions) * 100)}%
                    </span>
                </div>
            </div>
        </div>
    )
}

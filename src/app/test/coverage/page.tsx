'use client'

/**
 * Subcategory Coverage Dashboard
 * Shows which subcategories have keywords and which need them
 */

import { useState, useEffect } from 'react'
import { analyzeSubcategoryCoverage, type CoverageReport } from '@/lib/subcategory-coverage-analyzer'

export default function SubcategoryCoveragePage() {
    const [report, setReport] = useState<CoverageReport | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Generate report
        const result = analyzeSubcategoryCoverage()
        setReport(result)
        setLoading(false)

        // Also print to console
        console.log('📊 Coverage Report:', result)
    }, [])

    if (loading || !report) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
                    <p>Analyzing coverage...</p>
                </div>
            </div>
        )
    }

    const progressColor =
        report.coveragePercentage >= 90 ? 'bg-green-500' :
            report.coveragePercentage >= 70 ? 'bg-yellow-500' :
                report.coveragePercentage >= 50 ? 'bg-orange-500' : 'bg-red-500'

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">📊 Subcategory Keyword Coverage</h1>
                    <p className="text-gray-400">
                        รายงานว่าหมวดย่อยไหนมี keywords แล้ว และหมวดไหนยังขาด
                    </p>
                </div>

                {/* Summary Card */}
                <div className="bg-gray-800 rounded-xl p-6 mb-6 border-2 border-gray-700">
                    <h2 className="text-2xl font-bold mb-4">สรุปภาพรวม</h2>

                    <div className="grid grid-cols-4 gap-4 mb-6">
                        <div className="bg-gray-900 rounded-lg p-4">
                            <div className="text-sm text-gray-400 mb-1">Total Subcategories</div>
                            <div className="text-3xl font-bold">{report.totalSubcategories}</div>
                        </div>

                        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                            <div className="text-sm text-green-400 mb-1">✅ Has Keywords</div>
                            <div className="text-3xl font-bold text-green-400">
                                {report.coveredSubcategories}
                            </div>
                        </div>

                        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                            <div className="text-sm text-red-400 mb-1">❌ Missing Keywords</div>
                            <div className="text-3xl font-bold text-red-400">
                                {report.uncoveredSubcategories}
                            </div>
                        </div>

                        <div className="bg-purple-900/30 border border-purple-700 rounded-lg p-4">
                            <div className="text-sm text-purple-400 mb-1">Coverage</div>
                            <div className="text-3xl font-bold text-purple-400">
                                {report.coveragePercentage.toFixed(1)}%
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-2">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Implementation Progress</span>
                            <span className="text-sm text-gray-400">
                                {report.coveredSubcategories} / {report.totalSubcategories}
                            </span>
                        </div>
                        <div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden">
                            <div
                                className={`h-full ${progressColor} transition-all duration-500`}
                                style={{ width: `${report.coveragePercentage}%` }}
                            />
                        </div>
                    </div>
                </div>

                {/* Category Details */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold mb-4">รายละเอียดตาม Category</h2>

                    {report.details.map((category) => {
                        const categoryIcon =
                            category.coverage === 100 ? '✅' :
                                category.coverage > 0 ? '⚠️' : '❌'

                        const bgColor =
                            category.coverage === 100 ? 'bg-green-900/20 border-green-700' :
                                category.coverage > 0 ? 'bg-yellow-900/20 border-yellow-700' :
                                    'bg-red-900/20 border-red-700'

                        return (
                            <div key={category.categoryId} className={`rounded-xl p-6 border-2 ${bgColor}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold flex items-center gap-2">
                                            {categoryIcon} {category.categoryName}
                                            <span className="text-sm text-gray-400 font-normal">
                                                (ID: {category.categoryId})
                                            </span>
                                        </h3>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-bold">
                                            {category.coverage.toFixed(0)}%
                                        </div>
                                        <div className="text-sm text-gray-400">
                                            {category.coveredSubs}/{category.totalSubs} subcategories
                                        </div>
                                    </div>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-4">
                                    <div
                                        className={category.coverage === 100 ? 'bg-green-500' :
                                            category.coverage > 0 ? 'bg-yellow-500' : 'bg-red-500'}
                                        style={{ width: `${category.coverage}%` }}
                                    />
                                </div>

                                {/* Missing subcategories */}
                                {category.uncoveredSubs.length > 0 && (
                                    <div className="mt-4">
                                        <div className="text-sm font-semibold text-red-400 mb-2">
                                            ❌ Missing Keywords ({category.uncoveredSubs.length}):
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            {category.uncoveredSubs.map((sub) => (
                                                <div
                                                    key={sub.id}
                                                    className="bg-gray-800 rounded p-3 text-sm"
                                                >
                                                    <div className="font-medium">
                                                        [{sub.id}] {sub.name_th}
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {sub.name_en}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {category.coverage === 100 && (
                                    <div className="mt-4 p-3 bg-green-900/30 border border-green-700 rounded text-sm text-green-300">
                                        ✅ All subcategories have keywords!
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Recommendations */}
                <div className="mt-8 bg-blue-900/20 border-2 border-blue-700 rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4 text-blue-400">💡 Recommendations</h3>
                    <ul className="space-y-2 text-sm">
                        {report.coveragePercentage < 100 && (
                            <>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>
                                        Create keyword files for missing categories following the pattern of
                                        <code className="mx-1 px-2 py-0.5 bg-gray-800 rounded">comprehensive-computer-keywords.ts</code>
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>
                                        Import new keyword mappings into
                                        <code className="mx-1 px-2 py-0.5 bg-gray-800 rounded">subcategory-intelligence.ts</code>
                                    </span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-400">•</span>
                                    <span>
                                        Update coverage analyzer to recognize new keyword files
                                    </span>
                                </li>
                            </>
                        )}
                        {report.coveragePercentage === 100 && (
                            <li className="flex items-start gap-2">
                                <span className="text-green-400">✓</span>
                                <span className="text-green-300">
                                    Perfect! All subcategories have keywords. System is ready for production.
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    )
}

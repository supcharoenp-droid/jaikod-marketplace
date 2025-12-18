'use client'

/**
 * Keyword Quality Test Page
 * Navigate to: /test/keywords
 * 
 * This page runs automated tests to validate keyword system accuracy
 */

import { useState } from 'react'
import { runKeywordTests } from '@/lib/keyword-quality-test'

export default function KeywordTestPage() {
    const [testResults, setTestResults] = useState<any>(null)
    const [isRunning, setIsRunning] = useState(false)

    const handleRunTests = () => {
        setIsRunning(true)

        // Run tests
        setTimeout(() => {
            const results = runKeywordTests()
            setTestResults(results)
            setIsRunning(false)
        }, 100)
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">🧪 Keyword Quality Test Suite</h1>
                    <p className="text-gray-400">
                        Automated testing for keyword categorization accuracy
                    </p>
                </div>

                {/* Run Button */}
                <button
                    onClick={handleRunTests}
                    disabled={isRunning}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${isRunning
                            ? 'bg-gray-700 cursor-not-allowed'
                            : 'bg-purple-600 hover:bg-purple-700'
                        }`}
                >
                    {isRunning ? '🔄 Running Tests...' : '▶️ Run Tests'}
                </button>

                {/* Results */}
                {testResults && (
                    <div className="mt-8 space-y-6">
                        {/* Summary Card */}
                        <div className="bg-gray-800 rounded-xl p-6 border-2 border-gray-700">
                            <h2 className="text-2xl font-bold mb-4">📊 Test Results</h2>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="bg-gray-900 rounded-lg p-4">
                                    <div className="text-sm text-gray-400 mb-1">Total Tests</div>
                                    <div className="text-3xl font-bold">{testResults.total}</div>
                                </div>

                                <div className="bg-green-900/30 border border-green-700 rounded-lg p-4">
                                    <div className="text-sm text-green-400 mb-1">✅ Passed</div>
                                    <div className="text-3xl font-bold text-green-400">
                                        {testResults.passed}
                                    </div>
                                </div>

                                <div className="bg-red-900/30 border border-red-700 rounded-lg p-4">
                                    <div className="text-sm text-red-400 mb-1">❌ Failed</div>
                                    <div className="text-3xl font-bold text-red-400">
                                        {testResults.failed}
                                    </div>
                                </div>
                            </div>

                            {/* Success Rate */}
                            <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium">Success Rate</span>
                                    <span className="text-lg font-bold">
                                        {testResults.successRate.toFixed(1)}%
                                    </span>
                                </div>
                                <div className="w-full h-4 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full transition-all ${testResults.successRate >= 95
                                                ? 'bg-green-500'
                                                : testResults.successRate >= 90
                                                    ? 'bg-yellow-500'
                                                    : 'bg-red-500'
                                            }`}
                                        style={{ width: `${testResults.successRate}%` }}
                                    />
                                </div>
                            </div>

                            {/* Assessment */}
                            <div className={`p-4 rounded-lg ${testResults.successRate >= 95
                                    ? 'bg-green-900/30 border border-green-700'
                                    : testResults.successRate >= 90
                                        ? 'bg-yellow-900/30 border border-yellow-700'
                                        : 'bg-red-900/30 border border-red-700'
                                }`}>
                                <div className="font-semibold mb-1">
                                    {testResults.successRate >= 95
                                        ? '🌟 EXCELLENT'
                                        : testResults.successRate >= 90
                                            ? '✅ GOOD'
                                            : testResults.successRate >= 80
                                                ? '⚠️ NEEDS IMPROVEMENT'
                                                : '🚨 CRITICAL'}
                                </div>
                                <div className="text-sm text-gray-300">
                                    {testResults.successRate >= 95
                                        ? 'System performing very well!'
                                        : testResults.successRate >= 90
                                            ? 'Acceptable performance with room for improvement'
                                            : testResults.successRate >= 80
                                                ? 'Several issues detected'
                                                : 'Significant keyword issues require immediate attention'}
                                </div>
                            </div>
                        </div>

                        {/* Failures */}
                        {testResults.failures.length > 0 && (
                            <div className="bg-red-900/20 border-2 border-red-700 rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-4 text-red-400">
                                    🔍 Failed Tests ({testResults.failures.length})
                                </h3>

                                <div className="space-y-4">
                                    {testResults.failures.map((failure: any, i: number) => (
                                        <div
                                            key={i}
                                            className="bg-gray-900 rounded-lg p-4 border border-red-700/50"
                                        >
                                            <div className="flex items-start justify-between mb-2">
                                                <div>
                                                    <span className="font-mono text-sm text-gray-400">
                                                        {failure.testId}
                                                    </span>
                                                    <h4 className="font-medium mt-1">
                                                        "{failure.title}"
                                                    </h4>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-xs text-gray-400">Confidence</div>
                                                    <div className="text-sm font-bold text-yellow-400">
                                                        {(failure.confidence * 100).toFixed(1)}%
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mt-3">
                                                <div>
                                                    <div className="text-xs text-gray-400 mb-1">Expected</div>
                                                    <div className="text-sm text-green-400">
                                                        ✓ {failure.expected}
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-xs text-gray-400 mb-1">Got</div>
                                                    <div className="text-sm text-red-400">
                                                        ✗ {failure.actual}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recommendations */}
                        {testResults.failures.length > 0 && (
                            <div className="bg-blue-900/20 border-2 border-blue-700 rounded-xl p-6">
                                <h3 className="text-xl font-bold mb-4 text-blue-400">
                                    💡 Recommendations
                                </h3>
                                <ul className="space-y-2 text-sm">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400">•</span>
                                        <span>
                                            Review failed test cases and add missing keywords to
                                            comprehensive-computer-keywords.ts
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400">•</span>
                                        <span>
                                            Check for keyword conflicts between subcategories
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400">•</span>
                                        <span>
                                            Increase confidence thresholds if needed
                                        </span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-400">•</span>
                                        <span>
                                            Run tests again after making changes
                                        </span>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                {/* Instructions */}
                {!testResults && !isRunning && (
                    <div className="mt-8 bg-gray-800 rounded-xl p-6 border border-gray-700">
                        <h3 className="font-bold mb-3">📋 Instructions</h3>
                        <ol className="space-y-2 text-sm text-gray-300">
                            <li>1. Click "Run Tests" to start automated testing</li>
                            <li>2. Tests will validate keyword matching accuracy</li>
                            <li>3. Review results and fix any failures</li>
                            <li>4. Re-run tests until success rate ≥ 95%</li>
                        </ol>
                    </div>
                )}
            </div>
        </div>
    )
}

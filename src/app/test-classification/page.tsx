'use client'

/**
 * CLASSIFICATION TEST PAGE
 * 
 * Interactive UI for testing and monitoring classification system
 * - Run tests
 * - View results
 * - Compare systems
 * - Real-time analytics
 */

import { useState } from 'react'
import { ClassificationTestRunner, ClassificationAnalyzer } from '@/lib/classification-test-runner'
import { CLASSIFICATION_TEST_CASES, getTestStatistics } from '@/lib/classification-test-cases'

export default function ClassificationTestPage() {
    const [isRunning, setIsRunning] = useState(false)
    const [results, setResults] = useState<any>(null)
    const [selectedTab, setSelectedTab] = useState<'overview' | 'critical' | 'all' | 'comparison'>('overview')

    const runTests = async () => {
        setIsRunning(true)
        setResults(null)

        try {
            const runner = new ClassificationTestRunner()
            const analyzer = new ClassificationAnalyzer()

            // Run critical tests
            const criticalResults = await runner.runCriticalTests()

            // Run all tests
            const allResults = await runner.runAllTests()

            // Compare with old system
            const comparison = await runner.compareWithOldSystem()

            // Analytics
            const breakdown = analyzer.analyzeByCategory(allResults.results)
            const patterns = analyzer.findErrorPatterns(allResults.results)
            const suggestions = analyzer.generateSuggestions(allResults.results)

            setResults({
                critical: criticalResults,
                all: allResults,
                comparison,
                breakdown,
                patterns,
                suggestions
            })
        } catch (error) {
            console.error('Test execution error:', error)
            alert('Error running tests. Check console for details.')
        } finally {
            setIsRunning(false)
        }
    }

    const stats = getTestStatistics()

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8 border border-white/20">
                    <h1 className="text-4xl font-bold text-white mb-4">
                        🧪 Classification Test Suite
                    </h1>
                    <p className="text-white/80 text-lg">
                        Automated testing system for product categorization AI
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                            <div className="text-white/60 text-sm">Total Tests</div>
                            <div className="text-3xl font-bold text-white">{stats.total}</div>
                        </div>
                        <div className="bg-orange-500/20 rounded-xl p-4 border border-orange-500/30">
                            <div className="text-white/60 text-sm">Critical Cases</div>
                            <div className="text-3xl font-bold text-orange-400">{stats.criticalCases}</div>
                        </div>
                        <div className="bg-yellow-500/20 rounded-xl p-4 border border-yellow-500/30">
                            <div className="text-white/60 text-sm">Edge Cases</div>
                            <div className="text-3xl font-bold text-yellow-400">{stats.edgeCases}</div>
                        </div>
                        <div className="bg-blue-500/20 rounded-xl p-4 border border-blue-500/30">
                            <div className="text-white/60 text-sm">Categories Covered</div>
                            <div className="text-3xl font-bold text-blue-400">
                                {Object.keys(stats.byCategory).length}
                            </div>
                        </div>
                    </div>

                    {/* Run Button */}
                    <button
                        onClick={runTests}
                        disabled={isRunning}
                        className="mt-6 w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 
                                 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 
                                 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed
                                 shadow-lg shadow-green-500/50 hover:shadow-green-500/70"
                    >
                        {isRunning ? (
                            <span className="flex items-center justify-center gap-3">
                                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Running Tests...
                            </span>
                        ) : (
                            '▶️ Run All Tests'
                        )}
                    </button>
                </div>

                {/* Results */}
                {results && (
                    <>
                        {/* Tabs */}
                        <div className="flex gap-2 mb-6">
                            {[
                                { id: 'overview', label: '📊 Overview', color: 'blue' },
                                { id: 'critical', label: '🚨 Critical', color: 'red' },
                                { id: 'all', label: '📋 All Tests', color: 'purple' },
                                { id: 'comparison', label: '⚖️ Comparison', color: 'green' }
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setSelectedTab(tab.id as any)}
                                    className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${selectedTab === tab.id
                                            ? `bg-${tab.color}-500 text-white shadow-lg shadow-${tab.color}-500/50`
                                            : 'bg-white/10 text-white/60 hover:bg-white/20'
                                        }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>

                        {/* Overview Tab */}
                        {selectedTab === 'overview' && (
                            <div className="space-y-6">
                                {/* Summary Cards */}
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                        <h3 className="text-white/60 text-sm font-semibold mb-2">Overall Accuracy</h3>
                                        <div className="text-5xl font-bold text-white mb-4">
                                            {results.all.accuracy.toFixed(1)}%
                                        </div>
                                        <div className="text-white/80">
                                            {results.all.passed}/{results.all.totalTests} tests passed
                                        </div>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                        <h3 className="text-white/60 text-sm font-semibold mb-2">Avg Confidence</h3>
                                        <div className="text-5xl font-bold text-white mb-4">
                                            {(results.all.averageConfidence * 100).toFixed(1)}%
                                        </div>
                                        <div className="text-white/80">
                                            High confidence predictions
                                        </div>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                        <h3 className="text-white/60 text-sm font-semibold mb-2">Critical Pass Rate</h3>
                                        <div className="text-5xl font-bold text-white mb-4">
                                            {results.critical.accuracy.toFixed(1)}%
                                        </div>
                                        <div className="text-white/80">
                                            {results.critical.passed}/{results.critical.totalTests} critical tests
                                        </div>
                                    </div>
                                </div>

                                {/* Error Patterns */}
                                {results.patterns.length > 0 && (
                                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                        <h3 className="text-xl font-bold text-white mb-4">🔍 Common Error Patterns</h3>
                                        <div className="space-y-3">
                                            {results.patterns.slice(0, 5).map((pattern: any, idx: number) => (
                                                <div key={idx} className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                                                    <div>
                                                        <div className="text-white font-semibold">
                                                            Category {pattern.pattern}
                                                        </div>
                                                        <div className="text-white/60 text-sm">
                                                            {pattern.examples.join(', ')}
                                                        </div>
                                                    </div>
                                                    <div className="text-orange-400 font-bold">
                                                        {pattern.count} cases
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Suggestions */}
                                {results.suggestions.length > 0 && (
                                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                        <h3 className="text-xl font-bold text-white mb-4">💡 Improvement Suggestions</h3>
                                        <div className="space-y-2">
                                            {results.suggestions.map((suggestion: string, idx: number) => (
                                                <div key={idx} className="flex items-start gap-3 text-white/80">
                                                    <span className="text-yellow-400">→</span>
                                                    <span>{suggestion}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Critical Tab */}
                        {selectedTab === 'critical' && (
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h3 className="text-2xl font-bold text-white mb-6">
                                    🚨 Critical Test Results ({results.critical.totalTests})
                                </h3>

                                {results.critical.criticalFailures.length > 0 ? (
                                    <div className="space-y-4">
                                        {results.critical.criticalFailures.map((failure: any) => (
                                            <div key={failure.testId} className="bg-red-500/20 border border-red-500/40 rounded-xl p-4">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div>
                                                        <div className="text-white font-bold text-lg">{failure.testId}</div>
                                                        <div className="text-white/60 text-sm">{failure.notes}</div>
                                                    </div>
                                                    <span className="px-3 py-1 bg-red-500 text-white text-sm font-bold rounded-full">
                                                        FAILED
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-sm">
                                                    <div>
                                                        <div className="text-white/60">Expected:</div>
                                                        <div className="text-white font-semibold">
                                                            {failure.expected.categoryName} ({failure.expected.categoryId})
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <div className="text-white/60">Actual:</div>
                                                        <div className="text-white font-semibold">
                                                            {failure.actual.categoryName} ({failure.actual.categoryId})
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="mt-3 text-white/60 text-sm">
                                                    Confidence: {(failure.actual.confidence * 100).toFixed(2)}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="text-6xl mb-4">✅</div>
                                        <div className="text-2xl font-bold text-green-400">All Critical Tests Passed!</div>
                                        <div className="text-white/60 mt-2">
                                            {results.critical.totalTests} critical tests completed successfully
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* All Tests Tab */}
                        {selectedTab === 'all' && (
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h3 className="text-2xl font-bold text-white mb-6">
                                    📋 All Test Results ({results.all.totalTests})
                                </h3>
                                <div className="space-y-2 max-h-96 overflow-y-auto">
                                    {results.all.results.map((result: any) => (
                                        <div
                                            key={result.testId}
                                            className={`flex items-center justify-between p-3 rounded-lg ${result.passed
                                                    ? 'bg-green-500/20 border border-green-500/30'
                                                    : 'bg-red-500/20 border border-red-500/30'
                                                }`}
                                        >
                                            <div className="flex-1">
                                                <div className="text-white font-semibold">{result.testId}</div>
                                                <div className="text-white/60 text-sm">
                                                    {result.actual.categoryName} • {(result.actual.confidence * 100).toFixed(1)}%
                                                </div>
                                            </div>
                                            <div className="text-2xl">
                                                {result.passed ? '✅' : '❌'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Comparison Tab */}
                        {selectedTab === 'comparison' && (
                            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
                                <h3 className="text-2xl font-bold text-white mb-6">⚖️ Old vs New System</h3>

                                <div className="grid grid-cols-3 gap-6 mb-8">
                                    <div className="bg-white/5 rounded-xl p-6">
                                        <div className="text-white/60 mb-2">Old System</div>
                                        <div className="text-4xl font-bold text-white">
                                            {results.comparison.oldSystemAccuracy.toFixed(1)}%
                                        </div>
                                    </div>

                                    <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 rounded-xl p-6 border border-green-500/30">
                                        <div className="text-white/60 mb-2">New System</div>
                                        <div className="text-4xl font-bold text-green-400">
                                            {results.comparison.newSystemAccuracy.toFixed(1)}%
                                        </div>
                                    </div>

                                    <div className={`rounded-xl p-6 ${results.comparison.improvement >= 0
                                            ? 'bg-green-500/20 border border-green-500/30'
                                            : 'bg-red-500/20 border border-red-500/30'
                                        }`}>
                                        <div className="text-white/60 mb-2">Improvement</div>
                                        <div className={`text-4xl font-bold ${results.comparison.improvement >= 0 ? 'text-green-400' : 'text-red-400'
                                            }`}>
                                            {results.comparison.improvement >= 0 ? '+' : ''}
                                            {results.comparison.improvement.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>

                                {/* Improvement Details */}
                                <div>
                                    <h4 className="text-lg font-semibold text-white mb-4">Test-by-Test Comparison</h4>
                                    <div className="space-y-2 max-h-64 overflow-y-auto">
                                        {results.comparison.details.map((detail: any) => (
                                            <div
                                                key={detail.testId}
                                                className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                                            >
                                                <div className="text-white text-sm">{detail.testId}</div>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-white/60 text-sm">
                                                        Old: {detail.oldCorrect ? '✅' : '❌'}
                                                    </span>
                                                    <span className="text-white/60 text-sm">
                                                        New: {detail.newCorrect ? '✅' : '❌'}
                                                    </span>
                                                    {detail.improved && (
                                                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded">
                                                            IMPROVED
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

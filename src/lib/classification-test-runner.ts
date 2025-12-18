/**
 * CLASSIFICATION TEST RUNNER
 * 
 * Automated testing system for product classification
 * - Run test suites
 * - Generate accuracy reports
 * - Compare old vs new system
 * - Track improvements
 */

import { AdvancedClassificationEngine } from './advanced-classification-engine'
import { decideCategoryWithAI } from './category-decision-ai'
import {
    CLASSIFICATION_TEST_CASES,
    TestCase,
    getCriticalTestCases,
    getTestStatistics
} from './classification-test-cases'
import { CATEGORIES } from '@/constants/categories'

// ========================================
// TEST RESULT INTERFACES
// ========================================
export interface TestResult {
    testId: string
    passed: boolean
    actual: {
        categoryId: number
        categoryName: string
        subcategoryId?: number
        confidence: number
    }
    expected: {
        categoryId: number
        categoryName: string
        subcategoryId?: number
        minConfidence: number
    }
    diff: {
        categoryMatch: boolean
        subcategoryMatch: boolean
        confidenceMet: boolean
    }
    executionTime: number
    notes?: string
}

export interface TestSuiteResult {
    totalTests: number
    passed: number
    failed: number
    accuracy: number
    averageConfidence: number
    executionTime: number
    results: TestResult[]
    failedTests: TestResult[]
    criticalFailures: TestResult[]
}

// ========================================
// CLASS: TEST RUNNER
// ========================================
export class ClassificationTestRunner {
    private engine: AdvancedClassificationEngine

    constructor() {
        this.engine = new AdvancedClassificationEngine()
    }

    /**
     * Run a single test case
     */
    async runTest(testCase: TestCase): Promise<TestResult> {
        const startTime = performance.now()

        // Run classification
        const result = this.engine.classify(testCase.product)

        const endTime = performance.now()
        const executionTime = endTime - startTime

        // Get category name
        const category = CATEGORIES.find(c => c.id === result.categoryId)
        const actualCategoryName = category?.name_en || 'Unknown'

        // Check if passed
        const categoryMatch = result.categoryId === testCase.expected.categoryId
        const confidenceMet = result.confidence >= testCase.expected.minConfidence

        // Subcategory match (optional)
        let subcategoryMatch = true
        if (testCase.expected.subcategoryId) {
            subcategoryMatch = result.subcategoryId === testCase.expected.subcategoryId
        }

        const passed = categoryMatch && confidenceMet && subcategoryMatch

        return {
            testId: testCase.id,
            passed,
            actual: {
                categoryId: result.categoryId,
                categoryName: actualCategoryName,
                subcategoryId: result.subcategoryId,
                confidence: result.confidence
            },
            expected: testCase.expected,
            diff: {
                categoryMatch,
                subcategoryMatch,
                confidenceMet
            },
            executionTime,
            notes: testCase.notes
        }
    }

    /**
     * Run all test cases
     */
    async runAllTests(): Promise<TestSuiteResult> {
        const startTime = performance.now()
        const results: TestResult[] = []

        for (const testCase of CLASSIFICATION_TEST_CASES) {
            const result = await this.runTest(testCase)
            results.push(result)
        }

        const endTime = performance.now()

        // Calculate statistics
        const passed = results.filter(r => r.passed).length
        const failed = results.filter(r => r.passed === false).length
        const accuracy = (passed / results.length) * 100

        const avgConfidence = results.reduce((sum, r) => sum + r.actual.confidence, 0) / results.length

        const failedTests = results.filter(r => !r.passed)

        // Find critical failures (tests tagged as 'critical' that failed)
        const criticalFailures = results.filter(r => {
            if (!r.passed) {
                const testCase = CLASSIFICATION_TEST_CASES.find(t => t.id === r.testId)
                return testCase?.tags.includes('critical')
            }
            return false
        })

        return {
            totalTests: results.length,
            passed,
            failed,
            accuracy,
            averageConfidence: avgConfidence,
            executionTime: endTime - startTime,
            results,
            failedTests,
            criticalFailures
        }
    }

    /**
     * Run only critical tests
     */
    async runCriticalTests(): Promise<TestSuiteResult> {
        const criticalCases = getCriticalTestCases()
        const startTime = performance.now()
        const results: TestResult[] = []

        for (const testCase of criticalCases) {
            const result = await this.runTest(testCase)
            results.push(result)
        }

        const endTime = performance.now()

        const passed = results.filter(r => r.passed).length
        const failed = results.filter(r => r.passed === false).length
        const accuracy = (passed / results.length) * 100
        const avgConfidence = results.reduce((sum, r) => sum + r.actual.confidence, 0) / results.length

        return {
            totalTests: results.length,
            passed,
            failed,
            accuracy,
            averageConfidence: avgConfidence,
            executionTime: endTime - startTime,
            results,
            failedTests: results.filter(r => !r.passed),
            criticalFailures: results.filter(r => !r.passed)
        }
    }

    /**
     * Compare with old system (category-decision-ai)
     */
    async compareWithOldSystem(): Promise<{
        oldSystemAccuracy: number
        newSystemAccuracy: number
        improvement: number
        details: {
            testId: string
            oldCorrect: boolean
            newCorrect: boolean
            improved: boolean
        }[]
    }> {
        const results: any[] = []

        for (const testCase of CLASSIFICATION_TEST_CASES) {
            // New system
            const newResult = await this.runTest(testCase)

            // Old system
            const oldResult = decideCategoryWithAI({
                title: testCase.product.title,
                description: testCase.product.description,
                detectedObjects: [],
                imageAnalysis: ''
            })

            const oldCategoryId = oldResult.auto_selected
                ? Number(oldResult.auto_selected.categoryId)
                : Number(oldResult.recommended_categories[0]?.categoryId || 0)

            const oldCorrect = oldCategoryId === testCase.expected.categoryId
            const newCorrect = newResult.passed

            results.push({
                testId: testCase.id,
                oldCorrect,
                newCorrect,
                improved: !oldCorrect && newCorrect
            })
        }

        const oldCorrectCount = results.filter(r => r.oldCorrect).length
        const newCorrectCount = results.filter(r => r.newCorrect).length

        const oldAccuracy = (oldCorrectCount / results.length) * 100
        const newAccuracy = (newCorrectCount / results.length) * 100
        const improvement = newAccuracy - oldAccuracy

        return {
            oldSystemAccuracy: oldAccuracy,
            newSystemAccuracy: newAccuracy,
            improvement,
            details: results
        }
    }

    /**
     * Generate detailed report
     */
    generateReport(suiteResult: TestSuiteResult): string {
        let report = '═══════════════════════════════════════════\n'
        report += '   CLASSIFICATION TEST REPORT\n'
        report += '═══════════════════════════════════════════\n\n'

        report += `📊 OVERALL STATISTICS:\n`
        report += `   Total Tests: ${suiteResult.totalTests}\n`
        report += `   ✅ Passed: ${suiteResult.passed} (${suiteResult.accuracy.toFixed(2)}%)\n`
        report += `   ❌ Failed: ${suiteResult.failed}\n`
        report += `   📈 Avg Confidence: ${(suiteResult.averageConfidence * 100).toFixed(2)}%\n`
        report += `   ⏱️  Execution Time: ${suiteResult.executionTime.toFixed(2)}ms\n\n`

        if (suiteResult.criticalFailures.length > 0) {
            report += `🚨 CRITICAL FAILURES (${suiteResult.criticalFailures.length}):\n`
            suiteResult.criticalFailures.forEach(failure => {
                report += `   ❌ ${failure.testId}\n`
                report += `      Expected: ${failure.expected.categoryName} (${failure.expected.categoryId})\n`
                report += `      Actual: ${failure.actual.categoryName} (${failure.actual.categoryId})\n`
                report += `      Confidence: ${(failure.actual.confidence * 100).toFixed(2)}%\n`
                if (failure.notes) {
                    report += `      Notes: ${failure.notes}\n`
                }
                report += `\n`
            })
        }

        if (suiteResult.failedTests.length > 0 && suiteResult.criticalFailures.length < suiteResult.failedTests.length) {
            report += `⚠️  OTHER FAILURES (${suiteResult.failedTests.length - suiteResult.criticalFailures.length}):\n`
            const nonCriticalFailures = suiteResult.failedTests.filter(f =>
                !suiteResult.criticalFailures.find(cf => cf.testId === f.testId)
            )
            nonCriticalFailures.forEach(failure => {
                report += `   ❌ ${failure.testId}\n`
                report += `      Expected: ${failure.expected.categoryName}\n`
                report += `      Actual: ${failure.actual.categoryName}\n`
                report += `\n`
            })
        }

        return report
    }
}

// ========================================
// ANALYTICS & MONITORING
// ========================================
export interface ClassificationMetrics {
    date: Date
    accuracy: number
    avgConfidence: number
    categoryBreakdown: Record<number, {
        total: number
        correct: number
        accuracy: number
    }>
    commonErrors: {
        pattern: string
        count: number
        examples: string[]
    }[]
}

export class ClassificationAnalyzer {
    /**
     * Analyze test results by category
     */
    analyzeByCategory(results: TestResult[]): Record<number, {
        total: number
        correct: number
        accuracy: number
        avgConfidence: number
    }> {
        const breakdown: Record<number, any> = {}

        results.forEach(result => {
            const catId = result.expected.categoryId

            if (!breakdown[catId]) {
                breakdown[catId] = {
                    total: 0,
                    correct: 0,
                    confidenceSum: 0
                }
            }

            breakdown[catId].total++
            if (result.passed) {
                breakdown[catId].correct++
            }
            breakdown[catId].confidenceSum += result.actual.confidence
        })

        // Calculate averages
        for (const catId in breakdown) {
            const data = breakdown[catId]
            breakdown[catId] = {
                total: data.total,
                correct: data.correct,
                accuracy: (data.correct / data.total) * 100,
                avgConfidence: data.confidenceSum / data.total
            }
        }

        return breakdown
    }

    /**
     * Find common error patterns
     */
    findErrorPatterns(results: TestResult[]): {
        pattern: string
        count: number
        examples: string[]
    }[] {
        const patterns = new Map<string, string[]>()

        results.filter(r => !r.passed).forEach(result => {
            const pattern = `${result.expected.categoryId}→${result.actual.categoryId}`

            if (!patterns.has(pattern)) {
                patterns.set(pattern, [])
            }
            patterns.get(pattern)!.push(result.testId)
        })

        return Array.from(patterns.entries())
            .map(([pattern, examples]) => ({
                pattern,
                count: examples.length,
                examples: examples.slice(0, 3) // Top 3 examples
            }))
            .sort((a, b) => b.count - a.count)
    }

    /**
     * Generate improvement suggestions
     */
    generateSuggestions(results: TestResult[]): string[] {
        const suggestions: string[] = []
        const failures = results.filter(r => !r.passed)

        // Check confidence issues
        const lowConfidence = failures.filter(f => !f.diff.confidenceMet)
        if (lowConfidence.length > 0) {
            suggestions.push(`⚠️  ${lowConfidence.length} tests have low confidence. Consider adding more keywords.`)
        }

        // Check category mismatches
        const categoryMismatch = failures.filter(f => !f.diff.categoryMatch)
        if (categoryMismatch.length > 0) {
            suggestions.push(`❌ ${categoryMismatch.length} tests have wrong category. Review exclusion rules and brand context.`)
        }

        // Check subcategory issues
        const subcategoryMismatch = failures.filter(f => !f.diff.subcategoryMatch)
        if (subcategoryMismatch.length > 0) {
            suggestions.push(`🎯 ${subcategoryMismatch.length} tests have wrong subcategory. Add more specific subcategory keywords.`)
        }

        return suggestions
    }
}

// ========================================
// EXPORT CONVENIENCE FUNCTION
// ========================================
export async function runQuickTest() {
    console.log('🧪 Running Classification Tests...\n')

    const runner = new ClassificationTestRunner()

    // Run critical tests first
    console.log('Running Critical Tests...')
    const criticalResults = await runner.runCriticalTests()
    console.log(runner.generateReport(criticalResults))

    // Run all tests
    console.log('Running All Tests...')
    const allResults = await runner.runAllTests()
    console.log(runner.generateReport(allResults))

    // Compare with old system
    console.log('Comparing with Old System...')
    const comparison = await runner.compareWithOldSystem()
    console.log(`\n📊 SYSTEM COMPARISON:`)
    console.log(`   Old System Accuracy: ${comparison.oldSystemAccuracy.toFixed(2)}%`)
    console.log(`   New System Accuracy: ${comparison.newSystemAccuracy.toFixed(2)}%`)
    console.log(`   Improvement: ${comparison.improvement >= 0 ? '+' : ''}${comparison.improvement.toFixed(2)}%\n`)

    // Get analytics
    const analyzer = new ClassificationAnalyzer()
    const breakdown = analyzer.analyzeByCategory(allResults.results)
    console.log('📈 ACCURACY BY CATEGORY:')
    for (const [catId, stats] of Object.entries(breakdown)) {
        const category = CATEGORIES.find(c => c.id === Number(catId))
        console.log(`   ${category?.name_en}: ${stats.accuracy.toFixed(1)}% (${stats.correct}/${stats.total})`)
    }

    // Error patterns
    const patterns = analyzer.findErrorPatterns(allResults.results)
    if (patterns.length > 0) {
        console.log('\n🔍 COMMON ERROR PATTERNS:')
        patterns.slice(0, 5).forEach(p => {
            console.log(`   ${p.pattern}: ${p.count} cases`)
        })
    }

    // Suggestions
    const suggestions = analyzer.generateSuggestions(allResults.results)
    if (suggestions.length > 0) {
        console.log('\n💡 SUGGESTIONS:')
        suggestions.forEach(s => console.log(`   ${s}`))
    }

    return {
        critical: criticalResults,
        all: allResults,
        comparison,
        breakdown,
        patterns,
        suggestions
    }
}

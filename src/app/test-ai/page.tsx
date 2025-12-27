'use client'

/**
 * 🧪 AI Hybrid Model Strategy - Test Page
 * 
 * หน้านี้ใช้ทดสอบว่า AI Models ทำงานถูกต้องตาม Strategy หรือไม่:
 * - gpt-5-nano สำหรับ Image Intelligence
 * - gpt-4.1-nano สำหรับ Rule/Safety tasks
 */

import React, { useState } from 'react'

// Import AI Services
import {
    AI_MODELS,
    getModelForTask,
    decideFallback,
    CONFIDENCE_THRESHOLDS,
    estimateCost,
    estimateMonthlyCost,
    type AITask
} from '@/lib/ai-model-strategy'
import { getAIUtilityService } from '@/lib/ai-utility-service'

export default function AITestPage() {
    const [testResults, setTestResults] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [moderationText, setModerationText] = useState('')
    const [moderationResult, setModerationResult] = useState<any>(null)

    // Add log entry
    const log = (message: string) => {
        setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()} - ${message}`])
    }

    // Test 1: Model Selection Logic
    const testModelSelection = () => {
        log('🧪 === TEST 1: Model Selection Logic ===')

        const intelligenceTasks: AITask[] = [
            'image_analysis',
            'category_decision',
            'price_intelligence',
            'product_understanding',
        ]

        const utilityTasks: AITask[] = [
            'content_moderation',
            'data_normalization',
            'form_validation',
            'policy_enforcement',
        ]

        // Test intelligence tasks → should use gpt-5-nano
        for (const task of intelligenceTasks) {
            const model = getModelForTask(task)
            const isCorrect = model === AI_MODELS.PRIMARY
            log(`${isCorrect ? '✅' : '❌'} ${task} → ${model} ${isCorrect ? '(ถูกต้อง!)' : '(ผิด! ควรเป็น gpt-5-nano)'}`)
        }

        // Test utility tasks → should use gpt-4.1-nano
        for (const task of utilityTasks) {
            const model = getModelForTask(task)
            const isCorrect = model === AI_MODELS.UTILITY
            log(`${isCorrect ? '✅' : '❌'} ${task} → ${model} ${isCorrect ? '(ถูกต้อง!)' : '(ผิด! ควรเป็น gpt-4.1-nano)'}`)
        }

        log('✅ Model Selection Test Complete!')
    }

    // Test 2: Fallback Strategy
    const testFallbackStrategy = () => {
        log('🧪 === TEST 2: Fallback Strategy ===')

        const testCases = [
            { confidence: 0.95, expected: 'proceed' },
            { confidence: 0.85, expected: 'proceed' },
            { confidence: 0.75, expected: 'ask_user' },
            { confidence: 0.65, expected: 'ask_user' },      // >= 0.65 = ask_user
            { confidence: 0.60, expected: 'use_rule_based' }, // < 0.65 = use_rule_based (Fixed!)
            { confidence: 0.45, expected: 'use_rule_based' },
            { confidence: 0.30, expected: 'reject' },
        ]

        for (const test of testCases) {
            const result = decideFallback(test.confidence)
            const isCorrect = result.action === test.expected
            log(`${isCorrect ? '✅' : '❌'} Confidence ${test.confidence} → ${result.action} ${isCorrect ? '(ถูกต้อง!)' : `(ผิด! ควรเป็น ${test.expected})`}`)
        }

        // Test error fallback
        const errorResult = decideFallback(0.90, true) // hasError = true
        const errorCorrect = errorResult.action === 'use_rule_based'
        log(`${errorCorrect ? '✅' : '❌'} Error case → ${errorResult.action} ${errorCorrect ? '(ถูกต้อง!)' : '(ผิด!)'}`)

        log('✅ Fallback Strategy Test Complete!')
    }

    // Test 3: Cost Estimation
    const testCostEstimation = () => {
        log('🧪 === TEST 3: Cost Estimation ===')

        // Single request cost
        const primaryCost = estimateCost(AI_MODELS.PRIMARY, 500, 300, true)
        const utilityCost = estimateCost(AI_MODELS.UTILITY, 200, 100, false)

        log(`💰 Primary (gpt-5-nano) single request: $${primaryCost.toFixed(6)}`)
        log(`💰 Utility (gpt-4.1-nano) single request: $${utilityCost.toFixed(6)}`)

        // Monthly cost estimate
        const monthly = estimateMonthlyCost(1000) // 1000 listings/day
        log(`📊 Monthly estimate (1000 listings/day):`)
        log(`   - Primary: $${monthly.primary.toFixed(2)}`)
        log(`   - Utility: $${monthly.utility.toFixed(2)}`)
        log(`   - Total: $${monthly.total.toFixed(2)}/month`)

        log('✅ Cost Estimation Test Complete!')
    }

    // Test 4: Confidence Thresholds
    const testConfidenceThresholds = () => {
        log('🧪 === TEST 4: Confidence Thresholds ===')

        log(`📊 HIGH: ${CONFIDENCE_THRESHOLDS.HIGH}`)
        log(`📊 MEDIUM: ${CONFIDENCE_THRESHOLDS.MEDIUM}`)
        log(`📊 LOW: ${CONFIDENCE_THRESHOLDS.LOW}`)
        log(`📊 REQUIRE_CONFIRMATION: ${CONFIDENCE_THRESHOLDS.REQUIRE_CONFIRMATION}`)
        log(`📊 REQUIRE_FALLBACK: ${CONFIDENCE_THRESHOLDS.REQUIRE_FALLBACK}`)

        log('✅ Confidence Thresholds Test Complete!')
    }

    // Test 5: Content Moderation (gpt-4.1-nano)
    const testContentModeration = async () => {
        if (!moderationText.trim()) {
            log('⚠️ กรุณาใส่ข้อความเพื่อทดสอบ')
            return
        }

        setIsLoading(true)
        log('🧪 === TEST 5: Content Moderation (gpt-4.1-nano) ===')
        log(`📝 ทดสอบข้อความ: "${moderationText}"`)

        try {
            const service = getAIUtilityService()
            const result = await service.moderateContent(moderationText)

            setModerationResult(result)
            log(`✅ isApproved: ${result.isApproved}`)
            log(`📊 Confidence: ${(result.confidence * 100).toFixed(0)}%`)
            log(`⚠️ Violations: ${result.violations.length}`)

            if (result.violations.length > 0) {
                for (const v of result.violations) {
                    log(`   - ${v.type}: ${v.description} (${v.severity})`)
                }
            }

            log('✅ Content Moderation Test Complete!')
        } catch (error) {
            log(`❌ Error: ${error}`)
        } finally {
            setIsLoading(false)
        }
    }

    // Run all tests
    const runAllTests = () => {
        setTestResults([])
        log('🚀 === STARTING ALL TESTS ===')
        log(`🧠 PRIMARY MODEL: ${AI_MODELS.PRIMARY}`)
        log(`🔧 UTILITY MODEL: ${AI_MODELS.UTILITY}`)
        log(`🔄 FALLBACK MODEL: ${AI_MODELS.FALLBACK}`)
        log('')

        testModelSelection()
        log('')
        testFallbackStrategy()
        log('')
        testCostEstimation()
        log('')
        testConfidenceThresholds()
        log('')
        log('🎉 === ALL TESTS COMPLETE ===')
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">
                    🧪 AI Hybrid Model Strategy - Test Page
                </h1>
                <p className="text-gray-400 mb-8">
                    ทดสอบว่า AI Models ทำงานตาม Hybrid Strategy หรือไม่
                </p>

                {/* Model Info */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h2 className="text-xl font-semibold mb-4">📊 Model Configuration</h2>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-blue-900/50 rounded p-3">
                            <div className="text-sm text-gray-400">Primary Model</div>
                            <div className="text-lg font-mono">{AI_MODELS.PRIMARY}</div>
                            <div className="text-xs text-gray-500">Image + Category + Price</div>
                        </div>
                        <div className="bg-green-900/50 rounded p-3">
                            <div className="text-sm text-gray-400">Utility Model</div>
                            <div className="text-lg font-mono">{AI_MODELS.UTILITY}</div>
                            <div className="text-xs text-gray-500">Validation + Safety</div>
                        </div>
                        <div className="bg-yellow-900/50 rounded p-3">
                            <div className="text-sm text-gray-400">Fallback Model</div>
                            <div className="text-lg font-mono">{AI_MODELS.FALLBACK}</div>
                            <div className="text-xs text-gray-500">Low confidence cases</div>
                        </div>
                    </div>
                </div>

                {/* Test Buttons */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <button
                        onClick={runAllTests}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium"
                    >
                        🚀 Run All Tests
                    </button>
                    <button
                        onClick={() => { setTestResults([]); testModelSelection() }}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    >
                        Test Model Selection
                    </button>
                    <button
                        onClick={() => { setTestResults([]); testFallbackStrategy() }}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    >
                        Test Fallback Strategy
                    </button>
                    <button
                        onClick={() => { setTestResults([]); testCostEstimation() }}
                        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    >
                        Test Cost Estimation
                    </button>
                </div>

                {/* Content Moderation Test */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <h2 className="text-xl font-semibold mb-4">🛡️ Test Content Moderation (gpt-4.1-nano)</h2>
                    <div className="flex gap-3">
                        <input
                            type="text"
                            value={moderationText}
                            onChange={(e) => setModerationText(e.target.value)}
                            placeholder="ใส่ข้อความเพื่อทดสอบ... (เช่น 'ขายบุหรี่ไฟฟ้า' หรือ 'โอนเงินมาก่อน')"
                            className="flex-1 px-3 py-2 bg-gray-700 rounded-lg text-white"
                        />
                        <button
                            onClick={testContentModeration}
                            disabled={isLoading}
                            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg disabled:opacity-50"
                        >
                            {isLoading ? '⏳ Testing...' : '🧪 Test Moderation'}
                        </button>
                    </div>
                    <div className="mt-2 text-sm text-gray-400">
                        💡 ลองใส่คำต้องห้าม เช่น: "บุหรี่", "ปืน", "โอนก่อน", "ของปลอม"
                    </div>

                    {moderationResult && (
                        <div className={`mt-4 p-3 rounded ${moderationResult.isApproved ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
                            <div className="font-semibold">
                                {moderationResult.isApproved ? '✅ อนุมัติ' : '❌ ไม่อนุมัติ'}
                            </div>
                            <div className="text-sm">Confidence: {(moderationResult.confidence * 100).toFixed(0)}%</div>
                            {moderationResult.violations.length > 0 && (
                                <div className="mt-2">
                                    <div className="text-sm font-medium">Violations:</div>
                                    {moderationResult.violations.map((v: any, i: number) => (
                                        <div key={i} className="text-sm text-red-300">
                                            • {v.type}: {v.description}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Test Results */}
                <div className="bg-gray-800 rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-4">📋 Test Results</h2>
                    <div className="bg-black rounded p-4 font-mono text-sm h-96 overflow-y-auto">
                        {testResults.length === 0 ? (
                            <div className="text-gray-500">กด "Run All Tests" เพื่อเริ่มทดสอบ...</div>
                        ) : (
                            testResults.map((line, i) => (
                                <div key={i} className={
                                    line.includes('✅') ? 'text-green-400' :
                                        line.includes('❌') ? 'text-red-400' :
                                            line.includes('===') ? 'text-yellow-400 font-bold' :
                                                line.includes('💰') || line.includes('📊') ? 'text-blue-400' :
                                                    'text-gray-300'
                                }>
                                    {line}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-gray-800/50 rounded-lg p-4">
                    <h3 className="font-semibold mb-2">📖 วิธีทดสอบเพิ่มเติม:</h3>
                    <ol className="list-decimal list-inside text-sm text-gray-400 space-y-1">
                        <li>ไปที่หน้า <code className="bg-gray-700 px-1 rounded">/sell</code> และอัพโหลดรูปสินค้า</li>
                        <li>เปิด Browser Console (F12) และดู log ที่ขึ้นว่า <code className="bg-gray-700 px-1 rounded">🧠 Using model: gpt-5-nano</code></li>
                        <li>ถ้าเห็น log นี้ แสดงว่าระบบใช้ gpt-5-nano สำหรับ Image Intelligence ✅</li>
                        <li>ถ้ามี validation เกิดขึ้น จะเห็น <code className="bg-gray-700 px-1 rounded">🔧 Using model: gpt-4.1-nano</code></li>
                    </ol>
                </div>
            </div>
        </div>
    )
}

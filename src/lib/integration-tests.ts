/**
 * INTEGRATION TESTS FOR CLASSIFICATION FIXES
 * 
 * Test that Air Pump and Canon Printer are correctly classified
 * These are the two critical issues we fixed
 */

import { decideCategoryWithAI } from './category-decision-ai'
import { classifyProduct } from './integrated-classification'

interface IntegrationTestCase {
    id: string
    title: string
    description: string
    expectedCategoryId: number
    expectedCategoryName: string
    minConfidence: number
    forbiddenCategories: number[]
}

const CRITICAL_TEST_CASES: IntegrationTestCase[] = [
    // 🔥 AIR PUMP TESTS
    {
        id: 'air-pump-1',
        title: 'ปั๊มลมกางกา Air Pump รุ่นใหม่',
        description: 'ปั๊มลมเติมยางรถยนต์ ไฟฟ้า 12V พกพา จอดิจิตอล',
        expectedCategoryId: 1, // Automotive
        expectedCategoryName: 'Automotive',
        minConfidence: 0.8,
        forbiddenCategories: [4, 7, 8] // NOT Computer, Gaming, Camera
    },
    {
        id: 'air-pump-2',
        title: 'ปั๊มลมไฟฟ้า แบบพกพา',
        description: 'ปั๊มลมเติมยาง สำหรับรถยนต์ มอเตอร์ไซค์',
        expectedCategoryId: 1,
        expectedCategoryName: 'Automotive',
        minConfidence: 0.8,
        forbiddenCategories: [4, 7, 8]
    },
    {
        id: 'air-pump-3',
        title: 'Xiaomi Air Pump 1S',
        description: 'Electric tire inflator for car and motorcycle',
        expectedCategoryId: 1,
        expectedCategoryName: 'Automotive',
        minConfidence: 0.75,
        forbiddenCategories: [4, 7, 8]
    },
    {
        id: 'air-pump-4',
        title: 'Air Compressor 50L',
        description: 'ปั๊มลมขนาดใหญ่ สำหรับงานช่าง DIY',
        expectedCategoryId: 1, // Automotive or 13 (Home) acceptable
        expectedCategoryName: 'Automotive',
        minConfidence: 0.7,
        forbiddenCategories: [4, 7, 8]
    },

    // 🔥 CANON PRINTER TESTS
    {
        id: 'canon-printer-1',
        title: 'เครื่องพิมพ์บัตรพีวีซีขาว Canon รุ่น MF4450',
        description: 'เครื่องพิมพ์บัตรพนักงาน บัตรนักเรียน PVC Card Printer',
        expectedCategoryId: 4, // Computer
        expectedCategoryName: 'Computer',
        minConfidence: 0.85,
        forbiddenCategories: [8] // NOT Camera
    },
    {
        id: 'canon-printer-2',
        title: 'Canon Pixma G2020 ปริ้นเตอร์',
        description: 'เครื่องพิมพ์ Ecotank หมึกแท้งค์ ประหยัด',
        expectedCategoryId: 4,
        expectedCategoryName: 'Computer',
        minConfidence: 0.9,
        forbiddenCategories: [8]
    },
    {
        id: 'canon-printer-3',
        title: 'Canon Card Printer CR-80',
        description: 'ID card printer for employee badges',
        expectedCategoryId: 4,
        expectedCategoryName: 'Computer',
        minConfidence: 0.85,
        forbiddenCategories: [8]
    },

    // 🔥 EPSON PRINTER TESTS  
    {
        id: 'epson-printer-1',
        title: 'Epson L3250 EcoTank',
        description: 'ปริ้นเตอร์อิงค์แท้งค์ 3 in 1',
        expectedCategoryId: 4,
        expectedCategoryName: 'Computer',
        minConfidence: 0.85,
        forbiddenCategories: [8]
    },

    // ✅ CONTROL TESTS (Should still work correctly)
    {
        id: 'control-canon-camera',
        title: 'Canon EOS R6 Mark II',
        description: 'กล้อง Mirrorless Full Frame',
        expectedCategoryId: 8, // Camera
        expectedCategoryName: 'Camera',
        minConfidence: 0.9,
        forbiddenCategories: [4] // NOT Computer
    },
    {
        id: 'control-laptop',
        title: 'MacBook Pro M3',
        description: 'โน้ตบุ๊ค Apple Silicon',
        expectedCategoryId: 4, // Computer
        expectedCategoryName: 'Computer',
        minConfidence: 0.9,
        forbiddenCategories: [8]
    }
]

export function runIntegrationTests() {
    console.log('\n' + '='.repeat(80))
    console.log('🧪 INTEGRATION TESTS - CRITICAL FIXES')
    console.log('='.repeat(80) + '\n')

    console.log('Testing fixes for:')
    console.log('  1. ❌→✅ Air Pump (was Computer, should be Automotive)')
    console.log('  2. ❌→✅ Canon Printer (was Camera, should be Computer)')
    console.log()

    let passed = 0
    let failed = 0
    let warnings = 0

    const results: any[] = []

    CRITICAL_TEST_CASES.forEach((testCase, index) => {
        console.log(`\n${index + 1}. Testing: ${testCase.id}`)
        console.log(`   Title: "${testCase.title}"`)
        console.log('-'.repeat(80))

        // Run classification
        const result = decideCategoryWithAI({
            title: testCase.title,
            description: testCase.description,
            detectedObjects: [],
            imageAnalysis: ''
        })

        const topResult = result.auto_selected || result.recommended_categories[0]

        if (!topResult) {
            console.log('   ❌ FAILED: No classification result')
            failed++
            results.push({ ...testCase, status: 'failed', reason: 'No result' })
            return
        }

        const categoryId = Number(topResult.categoryId)
        const confidence = topResult.confidence

        console.log(`   Result: Category ${categoryId} - ${topResult.categoryName}`)
        console.log(`   Confidence: ${(confidence * 100).toFixed(2)}%`)

        // Check expectations
        let testPassed = true
        let issues: string[] = []

        // 1. Check expected category
        if (categoryId !== testCase.expectedCategoryId) {
            testPassed = false
            issues.push(`Expected category ${testCase.expectedCategoryId}, got ${categoryId}`)
        }

        // 2. Check forbidden categories
        if (testCase.forbiddenCategories.includes(categoryId)) {
            testPassed = false
            issues.push(`Category ${categoryId} is FORBIDDEN for this product!`)
        }

        // 3. Check minimum confidence
        if (confidence < testCase.minConfidence) {
            // Not a failure, but a warning
            warnings++
            issues.push(`⚠️  Confidence ${(confidence * 100).toFixed(1)}% below target ${(testCase.minConfidence * 100).toFixed(0)}%`)
        }

        if (testPassed) {
            console.log('   ✅ PASSED')
            passed++
            results.push({ ...testCase, status: 'passed', actual: categoryId, confidence })
        } else {
            console.log('   ❌ FAILED')
            issues.forEach(issue => console.log(`      - ${issue}`))
            failed++
            results.push({ ...testCase, status: 'failed', issues, actual: categoryId, confidence })
        }
    })

    // Summary
    console.log('\n' + '='.repeat(80))
    console.log('📊 TEST SUMMARY')
    console.log('='.repeat(80))
    console.log(`Total Tests: ${CRITICAL_TEST_CASES.length}`)
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`⚠️  Warnings: ${warnings}`)
    console.log(`Success Rate: ${((passed / CRITICAL_TEST_CASES.length) * 100).toFixed(1)}%\n`)

    if (failed === 0) {
        console.log('🎉 ALL TESTS PASSED! The fixes are working correctly!')
    } else {
        console.log('⚠️  SOME TESTS FAILED. Please review the issues above.')
        console.log('\nCommon fixes:')
        console.log('  1. Restart dev server: Ctrl+C → npm run dev')
        console.log('  2. Check if keywords are properly exported')
        console.log('  3. Clear cache and rebuild')
    }

    console.log('\n' + '='.repeat(80) + '\n')

    return {
        total: CRITICAL_TEST_CASES.length,
        passed,
        failed,
        warnings,
        successRate: (passed / CRITICAL_TEST_CASES.length) * 100,
        results
    }
}

// Export for use in UI
export { CRITICAL_TEST_CASES }

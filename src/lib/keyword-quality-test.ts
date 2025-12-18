/**
 * Keyword Quality Test Suite
 * Run this to validate keyword system accuracy
 */

import { detectSubcategory } from './subcategory-intelligence'

interface TestCase {
    id: string
    title: string
    description?: string
    expectedCategory: number
    expectedSubcategory: number
    expectedSubcategoryName: string
}

// ========================================
// TEST CASES - Category 4 (Computers & IT)
// ========================================
const COMPUTER_TEST_CASES: TestCase[] = [
    // Laptops (401)
    {
        id: 'C4-L01',
        title: 'โน๊ตบุ๊ค Acer Aspire 5 A515-56-36UT',
        description: 'โน้ตบุ๊คมือสอง สภาพดี',
        expectedCategory: 4,
        expectedSubcategory: 401,
        expectedSubcategoryName: 'โน้ตบุ๊ค'
    },
    {
        id: 'C4-L02',
        title: 'MacBook Pro M3 16GB 512GB',
        description: 'Laptop for professional use',
        expectedCategory: 4,
        expectedSubcategory: 401,
        expectedSubcategoryName: 'โน้ตบุ๊ค'
    },
    {
        id: 'C4-L03',
        title: 'Gaming Laptop ASUS ROG Strix G15',
        description: 'RTX 4060 Gaming Notebook',
        expectedCategory: 4,
        expectedSubcategory: 401,
        expectedSubcategoryName: 'โน้ตบุ๊ค'
    },
    {
        id: 'C4-L04',
        title: 'Dell XPS 13 Ultrabook',
        expectedCategory: 4,
        expectedSubcategory: 401,
        expectedSubcategoryName: 'โน้ตบุ๊ค'
    },

    // Keyboards (408)
    {
        id: 'C4-K01',
        title: 'คีย์บอร์ด Razer BlackWidow V3',
        description: 'Mechanical gaming keyboard',
        expectedCategory: 4,
        expectedSubcategory: 408,
        expectedSubcategoryName: 'คีย์บอร์ด'
    },
    {
        id: 'C4-K02',
        title: 'Mechanical Keyboard Keychron K2',
        description: 'Wireless mechanical keyboard',
        expectedCategory: 4,
        expectedSubcategory: 408,
        expectedSubcategoryName: 'คีย์บอร์ด'
    },
    {
        id: 'C4-K03',
        title: 'Gaming Keyboard RGB Corsair K70',
        expectedCategory: 4,
        expectedSubcategory: 408,
        expectedSubcategoryName: 'คีย์บอร์ด'
    },
    {
        id: 'C4-K04',
        title: 'Logitech G Pro Keyboard TKL',
        expectedCategory: 4,
        expectedSubcategory: 408,
        expectedSubcategoryName: 'คีย์บอร์ด'
    },

    // Mouse (409)
    {
        id: 'C4-M01',
        title: 'เมาส์ Logitech G502 HERO',
        description: 'Gaming mouse with RGB',
        expectedCategory: 4,
        expectedSubcategory: 409,
        expectedSubcategoryName: 'เมาส์'
    },
    {
        id: 'C4-M02',
        title: 'Wireless Mouse Razer Viper Ultimate',
        expectedCategory: 4,
        expectedSubcategory: 409,
        expectedSubcategoryName: 'เมาส์'
    },
    {
        id: 'C4-M03',
        title: 'Gaming Mouse Glorious Model O',
        expectedCategory: 4,
        expectedSubcategory: 409,
        expectedSubcategoryName: 'เมาส์'
    },
    {
        id: 'C4-M04',
        title: 'Logitech MX Master 3S Mouse',
        expectedCategory: 4,
        expectedSubcategory: 409,
        expectedSubcategoryName: 'เมาส์'
    },

    // Monitors (403)
    {
        id: 'C4-MON01',
        title: 'จอคอม LG 27 นิ้ว 144Hz',
        description: 'Gaming monitor IPS',
        expectedCategory: 4,
        expectedSubcategory: 403,
        expectedSubcategoryName: 'จอคอมพิวเตอร์'
    },
    {
        id: 'C4-MON02',
        title: 'Gaming Monitor ASUS VG279Q 27"',
        expectedCategory: 4,
        expectedSubcategory: 403,
        expectedSubcategoryName: 'จอคอมพิวเตอร์'
    },
    {
        id: 'C4-MON03',
        title: '4K Monitor Samsung 32 นิ้ว',
        expectedCategory: 4,
        expectedSubcategory: 403,
        expectedSubcategoryName: 'จอคอมพิวเตอร์'
    },
    {
        id: 'C4-MON04',
        title: 'Dell Ultrawide Monitor 34"',
        expectedCategory: 4,
        expectedSubcategory: 403,
        expectedSubcategoryName: 'จอคอมพิวเตอร์'
    },

    // Printers (405)
    {
        id: 'C4-P01',
        title: 'ปริ้นเตอร์ HP LaserJet Pro M203dw',
        expectedCategory: 4,
        expectedSubcategory: 405,
        expectedSubcategoryName: 'ปริ้นเตอร์และเครื่องตอกบัตร'
    },
    {
        id: 'C4-P02',
        title: 'Epson EcoTank L3150 Printer',
        expectedCategory: 4,
        expectedSubcategory: 405,
        expectedSubcategoryName: 'ปริ้นเตอร์และเครื่องตอกบัตร'
    },
    {
        id: 'C4-P03',
        title: 'Canon PIXMA G2010 เครื่องพิมพ์',
        expectedCategory: 4,
        expectedSubcategory: 405,
        expectedSubcategoryName: 'ปริ้นเตอร์และเครื่องตอกบัตร'
    },

    // Gaming PC (407)
    {
        id: 'C4-G01',
        title: 'Gaming PC RTX 4090 i9-14900K',
        expectedCategory: 4,
        expectedSubcategory: 407,
        expectedSubcategoryName: 'Gaming PC'
    },
    {
        id: 'C4-G02',
        title: 'PC Gaming ราคาประหยัด RTX 3060',
        expectedCategory: 4,
        expectedSubcategory: 407,
        expectedSubcategoryName: 'Gaming PC'
    },

    // Desktop (402)
    {
        id: 'C4-D01',
        title: 'Desktop PC i5 Office',
        expectedCategory: 4,
        expectedSubcategory: 402,
        expectedSubcategoryName: 'คอมพิวเตอร์ตั้งโต๊ะ'
    },
    {
        id: 'C4-D02',
        title: 'iMac 24" M3 Desktop',
        expectedCategory: 4,
        expectedSubcategory: 402,
        expectedSubcategoryName: 'คอมพิวเตอร์ตั้งโต๊ะ'
    },

    // Components (406)
    {
        id: 'C4-C01',
        title: 'SSD Samsung 980 Pro 1TB',
        expectedCategory: 4,
        expectedSubcategory: 406,
        expectedSubcategoryName: 'Components & Parts'
    },
    {
        id: 'C4-C02',
        title: 'Corsair PSU 750W Gold',
        expectedCategory: 4,
        expectedSubcategory: 406,
        expectedSubcategoryName: 'Components & Parts'
    },

    // PC Parts (410) - CPU/GPU specific
    {
        id: 'C4-PP01',
        title: 'Intel Core i7-13700K CPU',
        expectedCategory: 4,
        expectedSubcategory: 410,
        expectedSubcategoryName: 'ชิ้นส่วน PC (RAM/GPU/PSU/MB)'
    },
    {
        id: 'C4-PP02',
        title: 'RTX 4070 Ti Graphics Card',
        expectedCategory: 4,
        expectedSubcategory: 410,
        expectedSubcategoryName: 'ชิ้นส่วน PC (RAM/GPU/PSU/MB)'
    },
    {
        id: 'C4-PP03',
        title: 'RAM DDR5 32GB Corsair',
        expectedCategory: 4,
        expectedSubcategory: 410,
        expectedSubcategoryName: 'ชิ้นส่วน PC (RAM/GPU/PSU/MB)'
    },
]

// ========================================
// TEST RUNNER
// ========================================
export function runKeywordTests() {
    console.log('🧪 ========================================')
    console.log('   KEYWORD QUALITY TEST SUITE')
    console.log('========================================\n')

    let totalTests = 0
    let passed = 0
    let failed = 0
    const failures: Array<{
        testId: string
        title: string
        expected: string
        actual: string
        confidence: number
    }> = []

    COMPUTER_TEST_CASES.forEach(test => {
        totalTests++

        const result = detectSubcategory({
            categoryId: test.expectedCategory,
            title: test.title,
            description: test.description || '',
        })

        const actualSubId = result ? parseInt(result.subcategoryId) : null
        const isCorrect = actualSubId === test.expectedSubcategory

        if (isCorrect) {
            passed++
            console.log(`✅ ${test.id}: PASS`)
            console.log(`   "${test.title}"`)
            console.log(`   → ${result?.subcategoryName} (${result?.subcategoryId})`)
            console.log(`   Confidence: ${(result!.confidence * 100).toFixed(1)}%`)
            console.log(`   Matched: ${result?.matchedKeywords.slice(0, 3).join(', ')}...\n`)
        } else {
            failed++
            failures.push({
                testId: test.id,
                title: test.title,
                expected: `${test.expectedSubcategoryName} (${test.expectedSubcategory})`,
                actual: result
                    ? `${result.subcategoryName} (${result.subcategoryId})`
                    : 'No detection',
                confidence: result?.confidence || 0
            })

            console.log(`❌ ${test.id}: FAIL`)
            console.log(`   "${test.title}"`)
            console.log(`   Expected: ${test.expectedSubcategoryName} (${test.expectedSubcategory})`)
            console.log(`   Got: ${result ? `${result.subcategoryName} (${result.subcategoryId})` : 'No detection'}`)
            if (result) {
                console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`)
                console.log(`   Matched: ${result.matchedKeywords.join(', ')}`)
            }
            console.log()
        }
    })

    // Summary
    const successRate = (passed / totalTests) * 100
    console.log('\n========================================')
    console.log('📊 TEST RESULTS')
    console.log('========================================')
    console.log(`Total Tests:  ${totalTests}`)
    console.log(`✅ Passed:     ${passed} (${successRate.toFixed(1)}%)`)
    console.log(`❌ Failed:     ${failed} (${(100 - successRate).toFixed(1)}%)`)
    console.log('========================================\n')

    // Failure Details
    if (failures.length > 0) {
        console.log('🔍 FAILURE DETAILS:\n')
        failures.forEach((f, i) => {
            console.log(`${i + 1}. ${f.testId}: "${f.title}"`)
            console.log(`   Expected: ${f.expected}`)
            console.log(`   Got: ${f.actual}`)
            console.log(`   Confidence: ${(f.confidence * 100).toFixed(1)}%\n`)
        })
    }

    // Assessment
    console.log('📋 ASSESSMENT:\n')
    if (successRate >= 95) {
        console.log('🌟 EXCELLENT - System performing very well!')
    } else if (successRate >= 90) {
        console.log('✅ GOOD - Acceptable performance with room for improvement')
    } else if (successRate >= 80) {
        console.log('⚠️ NEEDS IMPROVEMENT - Several issues detected')
    } else {
        console.log('🚨 CRITICAL - Significant keyword issues require immediate attention')
    }

    return {
        total: totalTests,
        passed,
        failed,
        successRate,
        failures
    }
}

// Run tests if called directly
if (require.main === module) {
    runKeywordTests()
}

/**
 * AIR PUMP TEST SCRIPT
 * 
 * Quick test script to verify air pump classification
 */

import { decideCategoryWithAI } from './category-decision-ai'

// Test cases
const airPumpTests = [
    {
        title: 'ปั๊มลมกางกา Air Pump รุ่นใหม่',
        description: 'ปั๊มลมเติมยางรถยนต์ ไฟฟ้า 12V พกพา จอดิจิตอล'
    },
    {
        title: 'ปั๊มลมไฟฟ้า แบบพกพา',
        description: 'ปั๊มลมเติมยาง สำหรับรถยนต์ มอเตอร์ไซค์'
    },
    {
        title: 'Air Pump 12V Electric',
        description: 'Tire inflator for car and motorcycle'
    },
    {
        title: 'ปั้มลม กางกา ไฟฟ้า',
        description: 'เติมลมยางรถ มอเตอร์ไซค์ ลูกบอล'
    },
    {
        title: 'Air Compressor 50L',
        description: 'ปั๊มลมขนาดใหญ่ สำหรับงานช่าง DIY'
    }
]

console.log('🧪 Testing Air Pump Classification...\n')
console.log('Expected: Category 1 (Automotive) or 13 (Home & Garden)')
console.log('NOT: Category 4 (Computer)\n')
console.log('═'.repeat(60))

airPumpTests.forEach((test, idx) => {
    console.log(`\nTest ${idx + 1}: ${test.title}`)
    console.log('-'.repeat(60))

    const result = decideCategoryWithAI({
        title: test.title,
        description: test.description,
        detectedObjects: [],
        imageAnalysis: ''
    })

    const selected = result.auto_selected || result.recommended_categories[0]

    if (selected) {
        const categoryId = Number(selected.categoryId)
        const isCorrect = categoryId === 1 || categoryId === 13
        const isWrong = categoryId === 4

        console.log(`Result: Category ${categoryId} - ${selected.categoryName}`)
        console.log(`Confidence: ${(selected.confidence * 100).toFixed(2)}%`)

        if (isCorrect) {
            console.log('✅ CORRECT! Air pump correctly classified')
        } else if (isWrong) {
            console.log('❌ WRONG! Still going to Computer category')
        } else {
            console.log('⚠️  UNEXPECTED category')
        }
    } else {
        console.log('❌ No recommendation')
    }

    // Show all recommendations
    console.log('\nAll Recommendations:')
    result.recommended_categories.slice(0, 3).forEach((rec, i) => {
        console.log(`  ${i + 1}. ${rec.categoryName} (${rec.categoryId}) - ${(rec.confidence * 100).toFixed(2)}%`)
    })
})

console.log('\n' + '═'.repeat(60))
console.log('\n✅ If all tests show Category 1 or 13, the fix is working!')
console.log('❌ If any test shows Category 4, there\'s still an issue.\n')

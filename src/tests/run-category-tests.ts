/**
 * Category Test Runner
 * รันทดสอบ AI auto-fill ทั้ง 28 test cases
 */

import { CATEGORIES } from '../components/listing/DropdownCategorySelector'

// Helper: Map AI category name to ID (จาก component)
function findCategoryByName(categoryName: string): string | null {
    const normalized = categoryName.toLowerCase().trim()

    // Direct matches
    const directMatch = CATEGORIES.find(c =>
        c.name.toLowerCase() === normalized ||
        c.name.toLowerCase().includes(normalized) ||
        normalized.includes(c.name.toLowerCase())
    )
    if (directMatch) return directMatch.id

    // Keyword matching
    const keywordMap: Record<string, string> = {
        'รถ': '1', 'ยาน': '1',
        'บ้าน': '2', 'คอนโด': '2', 'ที่ดิน': '2',
        'มือถือ': '3', 'โทรศัพท์': '3', 'แท็บเล็ต': '3',
        'คอม': '4', 'computer': '4', 'laptop': '4',
        'ไฟฟ้า': '5', 'ทีวี': '5',
        'แฟชั่น': '6', 'fashion': '6', 'เสื้อ': '6', 'รองเท้า': '6', 'นาฬิกา': '6',
        'เกม': '7', 'game': '7',
        'กล้อง': '8', 'camera': '8',
        'พระ': '9',
        'สัตว์': '10', 'pet': '10',
        'บริการ': '11', 'service': '11',
        'กีฬา': '12', 'sport': '12',
        'สวน': '13',
        'เบ็ด': '14'
    }

    for (const [keyword, id] of Object.entries(keywordMap)) {
        if (normalized.includes(keyword)) return id
    }

    return null
}

// Test Cases
const TEST_CASES = [
    // 1. ยานยนต์
    { name: 'รถยนต์', main: 'ยานยนต์', sub: 'รถยนต์', expectedId: '1' },
    { name: 'มอเตอร์ไซค์', main: 'ยานยนต์', sub: 'มอเตอร์ไซค์', expectedId: '1' },

    // 2. อสังหาริมทรัพย์
    { name: 'คอนโด', main: 'อสังหาริมทรัพย์', sub: 'คอนโด', expectedId: '2' },
    { name: 'บ้านเดี่ยว', main: 'อสังหาริมทรัพย์', sub: 'บ้านเดี่ยว', expectedId: '2' },

    // 3. มือถือและแท็บเล็ต
    { name: 'สมาร์ทโฟน', main: 'มือถือและแท็บเล็ต', sub: 'สมาร์ทโฟน', expectedId: '3' },
    { name: 'แท็บเล็ต', main: 'มือถือและแท็บเล็ต', sub: 'แท็บเล็ต', expectedId: '3' },

    // 4. คอมพิวเตอร์และไอที
    { name: 'Laptop', main: 'คอมพิวเตอร์และไอที', sub: 'Laptop', expectedId: '4' },
    { name: 'Keyboard', main: 'คอมพิวเตอร์และไอที', sub: 'Keyboard', expectedId: '4' },
    { name: 'Mouse', main: 'คอมพิวเตอร์และไอที', sub: 'Mouse', expectedId: '4' },

    // 5. เครื่องใช้ไฟฟ้า
    { name: 'ทีวี', main: 'เครื่องใช้ไฟฟ้า', sub: 'ทีวี', expectedId: '5' },
    { name: 'ตู้เย็น', main: 'เครื่องใช้ไฟฟ้า', sub: 'ตู้เย็น', expectedId: '5' },

    // 6. แฟชั่น
    { name: 'นาฬิกา', main: 'แฟชั่น', sub: 'นาฬิกา', expectedId: '6' },
    { name: 'รองเท้า', main: 'แฟชั่น', sub: 'รองเท้า', expectedId: '6' },
    { name: 'กระเป๋า', main: 'แฟชั่น', sub: 'กระเป๋า', expectedId: '6' },

    // 7. เกมและแก็ดเจ็ต
    { name: 'เครื่องเกม', main: 'เกมและแก็ดเจ็ต', sub: 'เครื่องเกม (PS, Xbox, Switch)', expectedId: '7' },
    { name: 'VR Headset', main: 'เกมและแก็ดเจ็ต', sub: 'VR Headset', expectedId: '7' },

    // 8. กล้องถ่ายรูป
    { name: 'กล้อง DSLR', main: 'กล้องถ่ายรูป', sub: 'กล้อง DSLR', expectedId: '8' },
    { name: 'เลนส์', main: 'กล้องถ่ายรูป', sub: 'เลนส์', expectedId: '8' },

    // 9. พระเครื่องและของสะสม
    { name: 'พระเครื่อง', main: 'พระเครื่องและของสะสม', sub: 'พระเครื่อง', expectedId: '9' },
    { name: 'โมเดลฟิกเกอร์', main: 'พระเครื่องและของสะสม', sub: 'โมเดลฟิกเกอร์', expectedId: '9' },

    // 10. สัตว์เลี้ยง
    { name: 'สุนัข', main: 'สัตว์เลี้ยง', sub: 'สุนัข', expectedId: '10' },
    { name: 'อาหารสัตว์', main: 'สัตว์เลี้ยง', sub: 'อาหารสัตว์', expectedId: '10' },

    // 11. บริการ
    { name: 'ช่างซ่อม', main: 'บริการ', sub: 'ช่างซ่อม', expectedId: '11' },
    { name: 'ติวเตอร์', main: 'บริการ', sub: 'ติวเตอร์', expectedId: '11' },

    // 12. กีฬาและท่องเที่ยว
    { name: 'จักรยาน', main: 'กีฬาและท่องเที่ยว', sub: 'จักรยาน', expectedId: '12' },
    { name: 'อุปกรณ์ฟิตเนส', main: 'กีฬาและท่องเที่ยว', sub: 'อุปกรณ์ฟิตเนส', expectedId: '12' },

    // 13. บ้านและสวน
    { name: 'เฟอร์นิเจอร์', main: 'บ้านและสวน', sub: 'เฟอร์นิเจอร์', expectedId: '13' },
    { name: 'ต้นไม้', main: 'บ้านและสวน', sub: 'ต้นไม้', expectedId: '13' },

    // 14. เบ็ดเตล็ด
    { name: 'สินค้าแฮนด์เมด', main: 'เบ็ดเตล็ด', sub: 'สินค้าแฮนด์เมด', expectedId: '14' },
    { name: 'DIY', main: 'เบ็ดเตล็ด', sub: 'DIY', expectedId: '14' }
]

// Run Tests
export function runCategoryTests() {
    console.log('🧪 Starting Category Tests...\n')

    let passed = 0
    let failed = 0
    const failures: any[] = []

    TEST_CASES.forEach((test, index) => {
        const result = findCategoryByName(test.main)
        const category = CATEGORIES.find(c => c.id === result)
        const hasSubcategory = category?.subs.includes(test.sub)

        const isPass = result === test.expectedId && hasSubcategory

        if (isPass) {
            passed++
            console.log(`✅ ${index + 1}. ${test.name}: PASS`)
        } else {
            failed++
            console.log(`❌ ${index + 1}. ${test.name}: FAIL`)
            failures.push({
                test: test.name,
                expected: { id: test.expectedId, sub: test.sub },
                got: { id: result, hasSub: hasSubcategory }
            })
        }
    })

    console.log('\n' + '='.repeat(50))
    console.log(`📊 Test Results: ${passed}/${TEST_CASES.length} passed`)
    console.log(`✅ Passed: ${passed}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`📈 Success Rate: ${((passed / TEST_CASES.length) * 100).toFixed(1)}%`)

    if (failures.length > 0) {
        console.log('\n🔴 Failed Tests:')
        failures.forEach(f => {
            console.log(`  - ${f.test}`)
            console.log(`    Expected: ID ${f.expected.id}, Sub "${f.expected.sub}"`)
            console.log(`    Got: ID ${f.got.id}, Has Sub: ${f.got.hasSub}`)
        })
    }

    return { passed, failed, total: TEST_CASES.length, failures }
}

// Auto-run if this file is executed directly
if (typeof window === 'undefined') {
    runCategoryTests()
}

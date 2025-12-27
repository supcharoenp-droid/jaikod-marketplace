/**
 * CLASSIFICATION TEST CASES
 * 
 * รายการสินค้าที่ใช้ทดสอบระบบจัดหมวดหมู่
 * รันด้วยคำสั่ง: npx ts-node src/lib/classification-test-cases.ts
 */

export interface TestCase {
    title: string
    expectedCategory: number
    expectedSubcategory?: number
    description?: string
}

export const CLASSIFICATION_TEST_CASES: TestCase[] = [
    // ===== COMPUTERS (4) =====
    { title: 'คีย์บอร์ด Logitech K380', expectedCategory: 4, expectedSubcategory: 408 },
    { title: 'คีย์บอร์ด Yoda รุ่นมาตรฐาน', expectedCategory: 4, expectedSubcategory: 408 },
    { title: 'เมาส์ไร้สาย Logitech MX Master 3', expectedCategory: 4, expectedSubcategory: 409 },
    { title: 'Gaming Keyboard Razer Huntsman', expectedCategory: 4, expectedSubcategory: 408 },
    { title: 'โน้ตบุ๊ค ASUS VivoBook 15 Ryzen 5', expectedCategory: 4, expectedSubcategory: 401 },
    { title: 'เครื่องพิมพ์มัลติฟังก์ชัน Canon MF4450', expectedCategory: 4, expectedSubcategory: 405 },
    { title: 'Canon Card Printer เครื่องพิมพ์บัตร', expectedCategory: 4, expectedSubcategory: 405 },
    { title: 'จอมอนิเตอร์ Dell 24 นิ้ว FHD', expectedCategory: 4, expectedSubcategory: 403 },

    // ===== MOBILES (3) =====
    { title: 'iPhone 15 Pro Max 256GB', expectedCategory: 3, expectedSubcategory: 301 },
    { title: 'Samsung Galaxy S24 Ultra', expectedCategory: 3, expectedSubcategory: 301 },
    { title: 'หูฟัง Sony WH-1000XM5', expectedCategory: 3, expectedSubcategory: 303 },
    { title: 'AirPods Pro 2 ของแท้', expectedCategory: 3, expectedSubcategory: 303 },
    { title: 'สายชาร์จ iPhone Type-C', expectedCategory: 3, expectedSubcategory: 304 },

    // ===== APPLIANCES (5) =====
    { title: 'Samsung Smart TV 55 นิ้ว 4K', expectedCategory: 5, description: 'Samsung TV should go to Appliances, not Mobile' },
    { title: 'LG ตู้เย็น 2 ประตู Inverter', expectedCategory: 5 },
    { title: 'พัดลม Hatari 16 นิ้ว', expectedCategory: 5 },
    { title: 'เครื่องฟอกอากาศ Xiaomi Air Purifier', expectedCategory: 5 },
    { title: 'แอร์ Daikin Inverter 12000 BTU', expectedCategory: 5 },

    // ===== AUTOMOTIVE (1) =====
    { title: 'ปั๊มลมพกพา Air Pump รุ่นใหม่', expectedCategory: 1, description: 'Air Pump should go to Automotive, not Computer' },
    { title: 'Xiaomi Air Pump ปั๊มลมเติมยาง', expectedCategory: 1 },
    { title: 'กล้องติดรถยนต์ VIOFO A129', expectedCategory: 1 },
    { title: 'ยาง Michelin 205/55R16', expectedCategory: 1 },

    // ===== CAMERAS (8) =====
    { title: 'กล้อง Canon EOS R5 Mirrorless', expectedCategory: 8 },
    { title: 'Sony Alpha A7 IV Body', expectedCategory: 8, description: 'Sony Camera should go to Camera, not Mobile' },
    { title: 'เลนส์ Nikon Z 24-70mm f/4', expectedCategory: 8 },
    { title: 'GoPro Hero 12 Black', expectedCategory: 8 },

    // ===== GAMING (7) =====
    { title: 'PlayStation 5 Console', expectedCategory: 7 },
    { title: 'Nintendo Switch OLED', expectedCategory: 7 },
    { title: 'Xbox Series X', expectedCategory: 7 },

    // ===== FASHION (6) =====
    { title: 'รองเท้า Nike Air Max 90', expectedCategory: 6 },
    { title: 'กระเป๋า Louis Vuitton Neverfull', expectedCategory: 6 },
    { title: 'นาฬิกา Rolex Submariner', expectedCategory: 6 },

    // ===== HOME & GARDEN (13) =====
    { title: 'โซฟา L-Shape หนังแท้', expectedCategory: 13 },
    { title: 'พรมเช็ดเท้า ขนาดใหญ่', expectedCategory: 13 },
    { title: 'สว่านไร้สาย Bosch 12V', expectedCategory: 13 },

    // ===== BABY & KIDS (15) =====
    { title: 'ตุ๊กตาไดโนเสาร์ น่ารัก', expectedCategory: 15, description: 'Dinosaur doll should go to Kids, not Computer' },
    { title: 'LEGO Star Wars Millennium Falcon', expectedCategory: 15 },
    { title: 'รถเข็นเด็ก Chicco', expectedCategory: 15 },

    // ===== BEAUTY (14) =====
    { title: 'ลิปสติก MAC Ruby Woo', expectedCategory: 14 },
    { title: 'เซรั่ม Estee Lauder Advanced Night Repair', expectedCategory: 14 },
]

/**
 * Run test cases and report results
 */
export function runTestCases(
    classifyFn: (title: string) => Promise<{ categoryId: number; subcategoryId?: number }>
): Promise<{
    passed: number
    failed: number
    failures: Array<{ title: string; expected: number; actual: number }>
}> {
    return new Promise(async (resolve) => {
        const failures: Array<{ title: string; expected: number; actual: number }> = []
        let passed = 0
        let failed = 0

        for (const testCase of CLASSIFICATION_TEST_CASES) {
            try {
                const result = await classifyFn(testCase.title)
                if (result.categoryId === testCase.expectedCategory) {
                    passed++
                    console.log(`✅ PASS: "${testCase.title}" → Category ${result.categoryId}`)
                } else {
                    failed++
                    failures.push({
                        title: testCase.title,
                        expected: testCase.expectedCategory,
                        actual: result.categoryId
                    })
                    console.log(`❌ FAIL: "${testCase.title}" → Expected ${testCase.expectedCategory}, Got ${result.categoryId}`)
                }
            } catch (error) {
                failed++
                console.log(`❌ ERROR: "${testCase.title}" → ${error}`)
            }
        }

        console.log(`\n📊 Results: ${passed}/${passed + failed} passed (${((passed / (passed + failed)) * 100).toFixed(1)}%)`)

        if (failures.length > 0) {
            console.log('\n❌ Failures:')
            failures.forEach(f => {
                console.log(`  - "${f.title}": Expected ${f.expected}, Got ${f.actual}`)
            })
        }

        resolve({ passed, failed, failures })
    })
}

/**
 * Get statistics about test cases
 */
export function getTestStatistics() {
    const byCategory: Record<number, number> = {}
    let criticalCases = 0
    let edgeCases = 0

    CLASSIFICATION_TEST_CASES.forEach(tc => {
        // Count by category
        byCategory[tc.expectedCategory] = (byCategory[tc.expectedCategory] || 0) + 1

        // Count critical cases (those with specific descriptions)
        if (tc.description) {
            criticalCases++
        }

        // Count edge cases (subcategory specified = more precise test)
        if (tc.expectedSubcategory) {
            edgeCases++
        }
    })

    return {
        total: CLASSIFICATION_TEST_CASES.length,
        criticalCases,
        edgeCases,
        byCategory
    }
}

/**
 * Get critical test cases (tests that are most important to pass)
 */
export function getCriticalTestCases(): TestCase[] {
    return CLASSIFICATION_TEST_CASES.filter(tc => tc.description !== undefined)
}

/**
 * Legacy type alias for backwards compatibility
 */
export type GenerateDescriptionInput = {
    title: string
    description?: string
    category?: string
    condition?: string
}

/**
 * Legacy function for backwards compatibility
 * Maps to description-generator functions
 */
export async function generateProductDescription(input: GenerateDescriptionInput): Promise<string> {
    // Simple template-based generation
    const parts = []
    if (input.title) parts.push(`📦 ${input.title}`)
    if (input.condition) parts.push(`สภาพ: ${input.condition}`)
    if (input.category) parts.push(`หมวดหมู่: ${input.category}`)
    if (input.description) parts.push(input.description)

    return parts.join('\n\n') || input.title || ''
}


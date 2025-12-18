/**
 * CLASSIFICATION TEST CASES
 * 
 * Comprehensive test suite for product classification
 * Tests edge cases, ambiguous products, and known issues
 */

export interface TestCase {
    id: string
    product: {
        title: string
        description: string
        price?: number
    }
    expected: {
        categoryId: number
        categoryName: string
        subcategoryId?: number
        subcategoryName?: string
        minConfidence: number
    }
    tags: string[] // เช่น 'edge-case', 'brand-ambiguity', 'critical'
    notes?: string
}

// ========================================
// TEST CASES
// ========================================
export const CLASSIFICATION_TEST_CASES: TestCase[] = [
    // ========================================
    // CRITICAL CASES - Canon Brand Ambiguity
    // ========================================
    {
        id: 'canon-card-printer-001',
        product: {
            title: 'เครื่องพิมพ์การ์ดพีวีซีขาว Canon รุ่น MF4450',
            description: 'เครื่องพิมพ์บัตรพนักงาน บัตรนักเรียน สภาพดี พร้อมริบบิ้น',
            price: 15000
        },
        expected: {
            categoryId: 4,
            categoryName: 'Computers & IT',
            subcategoryId: 405,
            subcategoryName: 'Printers & Office',
            minConfidence: 0.85
        },
        tags: ['critical', 'brand-ambiguity', 'canon'],
        notes: 'Canon brand should detect printer context, not camera'
    },

    {
        id: 'canon-camera-001',
        product: {
            title: 'Canon EOS R5 Body กล้องมิเรอร์เลส',
            description: 'กล้อง Full Frame 45MP 8K Video ประกันศูนย์ไทย',
            price: 135000
        },
        expected: {
            categoryId: 8,
            categoryName: 'Camera',
            subcategoryId: 801,
            subcategoryName: 'Digital Cameras',
            minConfidence: 0.90
        },
        tags: ['critical', 'brand-ambiguity', 'canon'],
        notes: 'Canon with camera keywords should go to Camera category'
    },

    {
        id: 'canon-laser-printer-001',
        product: {
            title: 'Canon imageCLASS MF445dw Laser Printer',
            description: 'ปริ้นเตอร์เลเซอร์ พิมพ์ สแกน ถ่ายเอกสาร Fax',
            price: 12900
        },
        expected: {
            categoryId: 4,
            categoryName: 'Computers & IT',
            subcategoryId: 405,
            subcategoryName: 'Printers & Office',
            minConfidence: 0.88
        },
        tags: ['critical', 'brand-ambiguity', 'canon', 'multi-function'],
        notes: 'Canon multifunction printer should not be confused with camera'
    },

    // ========================================
    // CRITICAL CASES - Air Pump Misclassification
    // ========================================
    {
        id: 'air-pump-automotive-001',
        product: {
            title: 'ปั๊มลมกางกา Air Pump รุ่นใหม่',
            description: 'ปั๊มลมเติมยางรถยนต์ ไฟฟ้า 12V พกพา จอดิจิตอล',
            price: 1500
        },
        expected: {
            categoryId: 1,
            categoryName: 'Automotive',
            subcategoryId: 109,
            subcategoryName: 'Car Maintenance',
            minConfidence: 0.85
        },
        tags: ['critical', 'air-pump', 'automotive'],
        notes: 'Air pump with car context should go to Automotive, not Computer'
    },

    {
        id: 'air-pump-home-001',
        product: {
            title: 'ปั๊มลมไฟฟ้า Air Compressor 50L',
            description: 'ปั๊มลมสำหรับงานช่าง งาน DIY ทำสีรถ ล้างแอร์',
            price: 8900
        },
        expected: {
            categoryId: 13,
            categoryName: 'Home & Garden',
            subcategoryId: 1304,
            subcategoryName: 'Tools',
            minConfidence: 0.80
        },
        tags: ['critical', 'air-pump', 'home-tools'],
        notes: 'Large air compressor for DIY should go to Home Tools'
    },

    // ========================================
    // EPSON BRAND CASES
    // ========================================
    {
        id: 'epson-ecotank-001',
        product: {
            title: 'Epson L3250 EcoTank ปริ้นเตอร์',
            description: 'เครื่องพิมพ์ Wifi Print Scan Copy หมึกแท้งค์',
            price: 4990
        },
        expected: {
            categoryId: 4,
            categoryName: 'Computers & IT',
            subcategoryId: 405,
            subcategoryName: 'Printers & Office',
            minConfidence: 0.90
        },
        tags: ['brand-ambiguity', 'epson', 'ecotank'],
        notes: 'Epson EcoTank is clearly a printer'
    },

    {
        id: 'epson-projector-001',
        product: {
            title: 'Epson EB-X06 โปรเจคเตอร์',
            description: 'โปรเจคเตอร์ 3600 Lumens SVGA ห้องประชุม',
            price: 13900
        },
        expected: {
            categoryId: 4,
            categoryName: 'Computers & IT',
            subcategoryId: 404,
            subcategoryName: 'Peripherals',
            minConfidence: 0.85
        },
        tags: ['brand-ambiguity', 'epson', 'projector'],
        notes: 'Epson projector should go to Computer Peripherals'
    },

    // ========================================
    // XIAOMI BRAND CASES
    // ========================================
    {
        id: 'xiaomi-phone-001',
        product: {
            title: 'Xiaomi Redmi Note 13 Pro 5G',
            description: 'มือถือ 8GB+256GB กล้อง 200MP ประกันศูนย์',
            price: 10990
        },
        expected: {
            categoryId: 3,
            categoryName: 'Mobiles & Tablets',
            subcategoryId: 301,
            subcategoryName: 'Mobile Phones',
            minConfidence: 0.95
        },
        tags: ['brand-ambiguity', 'xiaomi', 'phone'],
        notes: 'Xiaomi phone should clearly go to Mobile category'
    },

    {
        id: 'xiaomi-vacuum-001',
        product: {
            title: 'Xiaomi Mi Robot Vacuum S10+ เครื่องดูดฝุ่นหุ่นยนต์',
            description: 'Robot Vacuum เช็ดถูพื้น ดูดฝุ่น ฐานเติมน้ำอัตโนมัติ',
            price: 24900
        },
        expected: {
            categoryId: 5,
            categoryName: 'Home Appliances',
            subcategoryId: 507,
            subcategoryName: 'Vacuum Cleaners',
            minConfidence: 0.88
        },
        tags: ['brand-ambiguity', 'xiaomi', 'appliance'],
        notes: 'Xiaomi vacuum should go to Appliances, not Mobile'
    },

    {
        id: 'xiaomi-powerbank-001',
        product: {
            title: 'Xiaomi Power Bank 20000mAh',
            description: 'แบตสำรอง Fast Charge 33W Type-C ของแท้',
            price: 990
        },
        expected: {
            categoryId: 3,
            categoryName: 'Mobiles & Tablets',
            subcategoryId: 307,
            subcategoryName: 'Power Banks',
            minConfidence: 0.90
        },
        tags: ['brand-ambiguity', 'xiaomi', 'accessory'],
        notes: 'Power bank is mobile accessory'
    },

    // ========================================
    // EDGE CASES - Ambiguous Products
    // ========================================
    {
        id: 'gaming-headset-pc-001',
        product: {
            title: 'Razer BlackShark V2 Gaming Headset',
            description: 'หูฟังเกมมิ่ง PC 7.1 Surround THX ไมค์ถูกแยกได้',
            price: 3590
        },
        expected: {
            categoryId: 7,
            categoryName: 'Gaming & Gadgets',
            subcategoryId: 704,
            subcategoryName: 'Gaming Headsets',
            minConfidence: 0.85
        },
        tags: ['edge-case', 'gaming', 'ambiguous'],
        notes: 'Gaming headset with PC context should go to Gaming, not Computer'
    },

    {
        id: 'office-headset-001',
        product: {
            title: 'Logitech H390 USB Headset',
            description: 'หูฟังคอมพิวเตอร์ ไมค์ USB สำหรับ Zoom Meeting ทำงาน',
            price: 890
        },
        expected: {
            categoryId: 4,
            categoryName: 'Computers & IT',
            subcategoryId: 404,
            subcategoryName: 'Peripherals',
            minConfidence: 0.80
        },
        tags: ['edge-case', 'office', 'ambiguous'],
        notes: 'Office headset should go to Computer Peripherals'
    },

    // ========================================
    // PRICE-BASED HINTS
    // ========================================
    {
        id: 'high-price-camera-001',
        product: {
            title: 'Sony Alpha 1 Full Frame Mirrorless',
            description: 'กล้อง 50MP 8K 30fps Eye AF Real-time Tracking',
            price: 189900
        },
        expected: {
            categoryId: 8,
            categoryName: 'Camera',
            subcategoryId: 801,
            subcategoryName: 'Digital Cameras',
            minConfidence: 0.95
        },
        tags: ['price-hint', 'high-end', 'camera'],
        notes: 'High price + camera specs = definitely Camera category'
    },

    {
        id: 'budget-printer-001',
        product: {
            title: 'HP DeskJet 2332 All-in-One Printer',
            description: 'ปริ้นเตอร์ราคาประหยัด พิมพ์ สแกน ถ่ายเอกสาร',
            price: 1990
        },
        expected: {
            categoryId: 4,
            categoryName: 'Computers & IT',
            subcategoryId: 405,
            subcategoryName: 'Printers & Office',
            minConfidence: 0.90
        },
        tags: ['price-hint', 'budget', 'printer'],
        notes: 'Low price printer should still be correct'
    },

    // ========================================
    // THAI KEYWORDS ONLY
    // ========================================
    {
        id: 'thai-only-camera-001',
        product: {
            title: 'กล้องถ่ายรูปดิจิตอล ฟูจิฟิล์ม X-T5',
            description: 'กล้องมิเรอร์เลส 40 ล้านพิกเซล ถ่ายวิดีโอ 6K',
            price: 69900
        },
        expected: {
            categoryId: 8,
            categoryName: 'Camera',
            subcategoryId: 801,
            subcategoryName: 'Digital Cameras',
            minConfidence: 0.88
        },
        tags: ['thai-only', 'camera'],
        notes: 'Thai-only description should work correctly'
    },

    {
        id: 'thai-only-printer-001',
        product: {
            title: 'เครื่องพิมพ์เลเซอร์ บราเดอร์ HL-L2375DW',
            description: 'ปริ้นเตอร์เลเซอร์ขาวดำ ไวไฟ พิมพ์สองหน้าอัตโนมัติ',
            price: 6490
        },
        expected: {
            categoryId: 4,
            categoryName: 'Computers & IT',
            subcategoryId: 405,
            subcategoryName: 'Printers & Office',
            minConfidence: 0.90
        },
        tags: ['thai-only', 'printer'],
        notes: 'Thai keywords should match correctly'
    },

    // ========================================
    // TYPOS & COMMON MISTAKES
    // ========================================
    {
        id: 'typo-printer-001',
        product: {
            title: 'ปริ้นเตอ Canon Pixma G2020',
            description: 'เครื่องปริ้น หมึกแท้งค์ พิม สแกน โคปี้',
            price: 4990
        },
        expected: {
            categoryId: 4,
            categoryName: 'Computers & IT',
            subcategoryId: 405,
            subcategoryName: 'Printers & Office',
            minConfidence: 0.75
        },
        tags: ['typo', 'printer'],
        notes: 'Should handle typos: ปริ้นเตอ, พิม instead of พิมพ์'
    },

    {
        id: 'typo-camera-001',
        product: {
            title: 'กล้อง Canon EOS 90D บอดี้',
            description: 'กล้องดิจีตอล 32MP ไวไฟ ประกันศูน',
            price: 45900
        },
        expected: {
            categoryId: 8,
            categoryName: 'Camera',
            minConfidence: 0.80
        },
        tags: ['typo', 'camera'],
        notes: 'Should handle: ดิจีตอล (ดิจิตอล), ประกันศูน (ศูนย์)'
    },

    // ========================================
    // MULTI-CATEGORY PRODUCTS
    // ========================================
    {
        id: 'laptop-bag-001',
        product: {
            title: 'กระเป๋าโน้ตบุ๊ค 15.6 นิ้ว Samsonite',
            description: 'กระเป๋าใส่ Laptop กันน้ำ กันกระแทก ช่องใส่เยอะ',
            price: 1990
        },
        expected: {
            categoryId: 6,
            categoryName: 'Fashion',
            subcategoryId: 603,
            subcategoryName: 'Brandname Bags',
            minConfidence: 0.70
        },
        tags: ['multi-category', 'fashion-vs-computer'],
        notes: 'Laptop bag is Fashion (bag), not Computer accessory'
    },

    {
        id: 'car-camera-dashcam-001',
        product: {
            title: 'กล้องติดรถยนต์ 70mai Dash Cam 4K',
            description: 'กล้องหน้ารถ Wifi GPS จอทัชสกรีน',
            price: 3990
        },
        expected: {
            categoryId: 1,
            categoryName: 'Automotive',
            subcategoryId: 109,
            subcategoryName: 'Car Maintenance',
            minConfidence: 0.85
        },
        tags: ['multi-category', 'camera-vs-automotive'],
        notes: 'Dash cam is Automotive accessory, not Camera equipment'
    }
]

// ========================================
// TEST STATISTICS
// ========================================
export function getTestStatistics() {
    const total = CLASSIFICATION_TEST_CASES.length
    const byTag = new Map<string, number>()
    const byCategory = new Map<number, number>()

    CLASSIFICATION_TEST_CASES.forEach(testCase => {
        // Count by tags
        testCase.tags.forEach(tag => {
            byTag.set(tag, (byTag.get(tag) || 0) + 1)
        })

        // Count by category
        const catId = testCase.expected.categoryId
        byCategory.set(catId, (byCategory.get(catId) || 0) + 1)
    })

    return {
        total,
        byTag: Object.fromEntries(byTag),
        byCategory: Object.fromEntries(byCategory),
        criticalCases: CLASSIFICATION_TEST_CASES.filter(t => t.tags.includes('critical')).length,
        edgeCases: CLASSIFICATION_TEST_CASES.filter(t => t.tags.includes('edge-case')).length
    }
}

// ========================================
// HELPER FUNCTIONS
// ========================================
export function getTestCasesByTag(tag: string): TestCase[] {
    return CLASSIFICATION_TEST_CASES.filter(t => t.tags.includes(tag))
}

export function getTestCaseById(id: string): TestCase | undefined {
    return CLASSIFICATION_TEST_CASES.find(t => t.id === id)
}

export function getCriticalTestCases(): TestCase[] {
    return getTestCasesByTag('critical')
}

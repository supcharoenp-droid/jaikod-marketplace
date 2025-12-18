/**
 * Category Auto-fill Test Cases
 * ทดสอบ AI auto-fill สำหรับทุกหมวดหมู่
 */

export const CATEGORY_TEST_CASES = [
    // 1. ยานยนต์
    {
        name: 'รถยนต์',
        aiInput: { main: 'ยานยนต์', sub: 'รถยนต์' },
        expected: { mainId: '1', subName: 'รถยนต์' },
        keywords: ['รถยนต์', 'car', 'sedan', 'Toyota', 'Honda']
    },
    {
        name: 'มอเตอร์ไซค์',
        aiInput: { main: 'ยานยนต์', sub: 'มอเตอร์ไซค์' },
        expected: { mainId: '1', subName: 'มอเตอร์ไซค์' },
        keywords: ['มอเตอร์ไซค์', 'motorcycle', 'Yamaha', 'Honda']
    },

    // 2. อสังหาริมทรัพย์
    {
        name: 'คอนโด',
        aiInput: { main: 'อสังหาริมทรัพย์', sub: 'คอนโด' },
        expected: { mainId: '2', subName: 'คอนโด' },
        keywords: ['คอนโด', 'condo', 'ห้องชุด']
    },
    {
        name: 'บ้านเดี่ยว',
        aiInput: { main: 'อสังหาริมทรัพย์', sub: 'บ้านเดี่ยว' },
        expected: { mainId: '2', subName: 'บ้านเดี่ยว' },
        keywords: ['บ้านเดี่ยว', 'house', 'บ้าน']
    },

    // 3. มือถือและแท็บเล็ต
    {
        name: 'สมาร์ทโฟน',
        aiInput: { main: 'มือถือและแท็บเล็ต', sub: 'สมาร์ทโฟน' },
        expected: { mainId: '3', subName: 'สมาร์ทโฟน' },
        keywords: ['มือถือ', 'smartphone', 'iPhone', 'Samsung']
    },
    {
        name: 'แท็บเล็ต',
        aiInput: { main: 'มือถือและแท็บเล็ต', sub: 'แท็บเล็ต' },
        expected: { mainId: '3', subName: 'แท็บเล็ต' },
        keywords: ['แท็บเล็ต', 'tablet', 'iPad']
    },

    // 4. คอมพิวเตอร์และไอที
    {
        name: 'Laptop',
        aiInput: { main: 'คอมพิวเตอร์และไอที', sub: 'Laptop' },
        expected: { mainId: '4', subName: 'Laptop' },
        keywords: ['laptop', 'แล็ปท็อป', 'notebook']
    },
    {
        name: 'Keyboard',
        aiInput: { main: 'คอมพิวเตอร์และไอที', sub: 'Keyboard' },
        expected: { mainId: '4', subName: 'Keyboard' },
        keywords: ['keyboard', 'คีย์บอร์ด', 'mechanical']
    },

    // 5. เครื่องใช้ไฟฟ้า
    {
        name: 'ทีวี',
        aiInput: { main: 'เครื่องใช้ไฟฟ้า', sub: 'ทีวี' },
        expected: { mainId: '5', subName: 'ทีวี' },
        keywords: ['ทีวี', 'TV', 'television', 'Smart TV']
    },
    {
        name: 'ตู้เย็น',
        aiInput: { main: 'เครื่องใช้ไฟฟ้า', sub: 'ตู้เย็น' },
        expected: { mainId: '5', subName: 'ตู้เย็น' },
        keywords: ['ตู้เย็น', 'refrigerator', 'fridge']
    },

    // 6. แฟชั่น
    {
        name: 'นาฬิกา',
        aiInput: { main: 'แฟชั่น', sub: 'นาฬิกา' },
        expected: { mainId: '6', subName: 'นาฬิกา' },
        keywords: ['นาฬิกา', 'watch', 'Seiko', 'Rolex']
    },
    {
        name: 'รองเท้า',
        aiInput: { main: 'แฟชั่น', sub: 'รองเท้า' },
        expected: { mainId: '6', subName: 'รองเท้า' },
        keywords: ['รองเท้า', 'shoes', 'sneakers', 'Nike']
    },

    // 7. เกมและแก็ดเจ็ต
    {
        name: 'เครื่องเกม',
        aiInput: { main: 'เกมและแก็ดเจ็ต', sub: 'เครื่องเกม (PS, Xbox, Switch)' },
        expected: { mainId: '7', subName: 'เครื่องเกม (PS, Xbox, Switch)' },
        keywords: ['PlayStation', 'PS5', 'Xbox', 'Switch', 'console']
    },
    {
        name: 'VR Headset',
        aiInput: { main: 'เกมและแก็ดเจ็ต', sub: 'VR Headset' },
        expected: { mainId: '7', subName: 'VR Headset' },
        keywords: ['VR', 'virtual reality', 'Oculus', 'Meta Quest']
    },

    // 8. กล้องถ่ายรูป
    {
        name: 'กล้อง DSLR',
        aiInput: { main: 'กล้องถ่ายรูป', sub: 'กล้อง DSLR' },
        expected: { mainId: '8', subName: 'กล้อง DSLR' },
        keywords: ['กล้อง', 'camera', 'DSLR', 'Canon', 'Nikon']
    },
    {
        name: 'เลนส์',
        aiInput: { main: 'กล้องถ่ายรูป', sub: 'เลนส์' },
        expected: { mainId: '8', subName: 'เลนส์' },
        keywords: ['เลนส์', 'lens', '50mm', 'f/1.8']
    },

    // 9. พระเครื่องและของสะสม
    {
        name: 'พระเครื่อง',
        aiInput: { main: 'พระเครื่องและของสะสม', sub: 'พระเครื่อง' },
        expected: { mainId: '9', subName: 'พระเครื่อง' },
        keywords: ['พระเครื่อง', 'amulet', 'พระ']
    },
    {
        name: 'โมเดลฟิกเกอร์',
        aiInput: { main: 'พระเครื่องและของสะสม', sub: 'โมเดลฟิกเกอร์' },
        expected: { mainId: '9', subName: 'โมเดลฟิกเกอร์' },
        keywords: ['โมเดล', 'figure', 'Gundam', 'action figure']
    },

    // 10. สัตว์เลี้ยง
    {
        name: 'สุนัข',
        aiInput: { main: 'สัตว์เลี้ยง', sub: 'สุนัข' },
        expected: { mainId: '10', subName: 'สุนัข' },
        keywords: ['สุนัข', 'dog', 'ลูกสุนัข']
    },
    {
        name: 'อาหารสัตว์',
        aiInput: { main: 'สัตว์เลี้ยง', sub: 'อาหารสัตว์' },
        expected: { mainId: '10', subName: 'อาหารสัตว์' },
        keywords: ['อาหารสุนัข', 'pet food', 'dog food']
    },

    // 11. บริการ
    {
        name: 'ช่างซ่อม',
        aiInput: { main: 'บริการ', sub: 'ช่างซ่อม' },
        expected: { mainId: '11', subName: 'ช่างซ่อม' },
        keywords: ['ช่างซ่อม', 'technician', 'repair']
    },
    {
        name: 'ติวเตอร์',
        aiInput: { main: 'บริการ', sub: 'ติวเตอร์' },
        expected: { mainId: '11', subName: 'ติวเตอร์' },
        keywords: ['ติวเตอร์', 'tutor', 'สอนพิเศษ']
    },

    // 12. กีฬาและท่องเที่ยว
    {
        name: 'จักรยาน',
        aiInput: { main: 'กีฬาและท่องเที่ยว', sub: 'จักรยาน' },
        expected: { mainId: '12', subName: 'จักรยาน' },
        keywords: ['จักรยาน', 'bicycle', 'bike']
    },
    {
        name: 'อุปกรณ์ฟิตเนส',
        aiInput: { main: 'กีฬาและท่องเที่ยว', sub: 'อุปกรณ์ฟิตเนส' },
        expected: { mainId: '12', subName: 'อุปกรณ์ฟิตเนส' },
        keywords: ['ดัมเบล', 'dumbbell', 'fitness', 'treadmill']
    },

    // 13. บ้านและสวน
    {
        name: 'เฟอร์นิเจอร์',
        aiInput: { main: 'บ้านและสวน', sub: 'เฟอร์นิเจอร์' },
        expected: { mainId: '13', subName: 'เฟอร์นิเจอร์' },
        keywords: ['โซฟา', 'sofa', 'เก้าอี้', 'โต๊ะ']
    },
    {
        name: 'ต้นไม้',
        aiInput: { main: 'บ้านและสวน', sub: 'ต้นไม้' },
        expected: { mainId: '13', subName: 'ต้นไม้' },
        keywords: ['ต้นไม้', 'plant', 'กระถาง']
    },

    // 14. เบ็ดเตล็ด
    {
        name: 'สินค้าแฮนด์เมด',
        aiInput: { main: 'เบ็ดเตล็ด', sub: 'สินค้าแฮนด์เมด' },
        expected: { mainId: '14', subName: 'สินค้าแฮนด์เมด' },
        keywords: ['handmade', 'แฮนด์เมด', 'ทำมือ']
    },
    {
        name: 'DIY',
        aiInput: { main: 'เบ็ดเตล็ด', sub: 'DIY' },
        expected: { mainId: '14', subName: 'DIY' },
        keywords: ['DIY', 'do it yourself']
    }
]

// Edge Cases - ทดสอบกรณีพิเศษ
export const EDGE_CASE_TESTS = [
    {
        name: 'Smartwatch - Tech Focus',
        aiInput: { main: 'เกมและแก็ดเจ็ต', sub: 'Smartwatch' },
        expected: { mainId: '7', subName: 'Smartwatch' },
        note: 'ถ้า AI เน้นฟีเจอร์เทคโนโลยี'
    },
    {
        name: 'Smartwatch - Fashion Focus',
        aiInput: { main: 'แฟชั่น', sub: 'นาฬิกา' },
        expected: { mainId: '6', subName: 'นาฬิกา' },
        note: 'ถ้า AI เน้นดีไซน์/แฟชั่น'
    },
    {
        name: 'Gaming Laptop',
        aiInput: { main: 'คอมพิวเตอร์และไอที', sub: 'Laptop' },
        expected: { mainId: '4', subName: 'Laptop' },
        note: 'Should use Laptop not Gaming PC'
    }
]

// Validation Function
export function validateCategoryMapping(testCase: typeof CATEGORY_TEST_CASES[0], result: any): boolean {
    return result.mainId === testCase.expected.mainId &&
        result.subName === testCase.expected.subName
}

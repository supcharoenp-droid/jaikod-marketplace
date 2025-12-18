/**
 * COMPREHENSIVE CATEGORY KEYWORDS v3.0
 * 
 * Complete keyword mapping for all 17 main categories + 106 subcategories
 * Supports: Thai (TH) and English (EN)
 * 
 * Usage: Import this for AI category detection
 */

import type { Category } from '@/constants/categories'

// ================================================================
// CATEGORY KEYWORDS DATABASE
// ================================================================

/**
 * Main Category Keywords (ID → Keywords)
 */
export const CATEGORY_KEYWORDS: Record<number, {
    th: string[]  // Thai keywords
    en: string[]  // English keywords
}> = {
    // 1. ยานยนต์ (Automotive)
    1: {
        th: [
            'รถ', 'รถยนต์', 'รถบรรทุก', 'รถกระบะ', 'รถตู้', 'รถเก๋ง',
            'มอเตอร์ไซค์', 'มอไซค์', 'บิ๊กไบค์', 'สกู๊ตเตอร์',
            'ล้อ', 'ยาง', 'ล้อแม็ก', 'ยางรถยนต์',
            'อะไหล่', 'อะไหล่รถยนต์', 'อะไหล่มอไซค์',
            'กระจก', 'เบาะ', 'เครื่องยนต์', 'ช่วงล่าง',
            'แต่งรถ', 'ตกแต่งรถ', 'ของแต่งรถ',
            'น้ำมันเครื่อง', 'หม้อแบตเตอรี่', 'ผ้าเบรค'
        ],
        en: [
            'car', 'vehicle', 'automobile', 'truck', 'pickup', 'van', 'sedan',
            'motorcycle', 'motorbike', 'bike', 'bigbike', 'scooter',
            'wheel', 'tire', 'tyre', 'alloy wheel', 'mag wheel',
            'auto parts', 'car parts', 'motorcycle parts',
            'windshield', 'seat', 'engine', 'suspension',
            'car accessories', 'modification',
            'engine oil', 'battery', 'brake pad'
        ]
    },

    // 2. อสังหาริมทรัพย์ (Real Estate)
    2: {
        th: [
            'บ้าน', 'บ้านเดี่ยว', 'บ้านแฝด', 'ทาวน์เฮ้าส์', 'ทาวน์โฮม',
            'คอนโด', 'คอนโดมิเนียม', 'อพาร์ทเมนต์', 'แฟลต',
            'ที่ดิน', 'ที่ดินแปลงสวย', 'ที่นา', 'ที่สวน',
            'อาคารพาณิชย์', 'ตึกแถว', 'ร้านค้า',
            'โกดัง', 'โรงงาน', 'คลังสินค้า',
            'สำนักงาน', 'ออฟฟิศ', 'พื้นที่สำนักงาน',
            'ห้องเช่า', 'หอพัก', 'แมนชั่น',
            'ขาย', 'ให้เช่า', 'เช่า-ขาย'
        ],
        en: [
            'house', 'home', 'detached house', 'semi-detached', 'townhouse', 'townhome',
            'condo', 'condominium', 'apartment', 'flat',
            'land', 'plot', 'farmland', 'plantation',
            'commercial building', 'shophouse', 'shop',
            'warehouse', 'factory', 'storage',
            'office', 'office space', 'workspace',
            'room for rent', 'dormitory', 'hostel',
            'for sale', 'for rent', 'rent-sale'
        ]
    },

    // 3. มือถือและแท็บเล็ต (Mobiles & Tablets)
    3: {
        th: [
            'มือถือ', 'โทรศัพท์', 'โทรศัพท์มือถือ', 'สมาร์ทโฟน',
            'iphone', 'ไอโฟน', 'samsung', 'oppo', 'vivo', 'xiaomi', 'huawei',
            'แท็บเล็ต', 'ipad', 'ไอแพด',
            '5g', '4g', 'dual sim', 'sim 2 ใบ',
            'android', 'ios',
            'เคส', 'ฟิล์ม', 'กระจก', 'ฟิล์มกันรอย',
            'หูฟัง', 'earphone', 'earbuds', 'airpods',
            'แบตสำรอง', 'power bank', 'ที่ชาร์จ', 'สายชาร์จ',
            'อุปกรณ์เสริม', 'ขาตั้ง', 'ที่จับโทรศัพท์'
        ],
        en: [
            'mobile', 'phone', 'mobile phone', 'smartphone', 'cellphone',
            'iphone', 'samsung', 'oppo', 'vivo', 'xiaomi', 'huawei', 'realme',
            'tablet', 'ipad',
            '5g', '4g', '4g lte', 'dual sim', 'esim',
            'android', 'ios',
            'case', 'film', 'screen protector', 'tempered glass',
            'earphone', 'earbuds', 'headphones', 'airpods',
            'power bank', 'charger', 'charging cable', 'usb cable',
            'accessories', 'phone stand', 'phone holder'
        ]
    },

    // 4. คอมพิวเตอร์และไอที (Computers & IT)
    4: {
        th: [
            'คอมพิวเตอร์', 'คอมพ์', 'คอม',
            'โน้ตบุ๊ค', 'โน้ตบุ้ค', 'laptop', 'notebook',
            'desktop', 'pc', 'คอมตั้งโต๊ะ', 'all in one',
            'gaming', 'เกมมิ่ง', 'gaming pc', 'gaming notebook',
            'จอคอม', 'จอคอมพิวเตอร์', 'monitor', 'จอมอนิเตอร์',
            'คีย์บอร์ด', 'แป้นพิมพ์', 'keyboard',
            'เมาส์', 'mouse',
            'ชิ้นส่วน', 'อะไหล่', 'ram', 'ssd', 'hdd', 'cpu', 'gpu', 'vga',
            'เมนบอร์ด', 'mainboard', 'motherboard',
            'การ์ดจอ', 'การ์ดจอเกมมิ่ง', 'graphics card',
            'power supply', 'เพาเวอร์ซัพพลาย',
            'เคส', 'case pc', 'พัดลม', 'fan',
            'ปริ้นเตอร์', 'printer', 'เครื่องพิมพ์', 'สแกนเนอร์',
            'router', 'เราเตอร์', 'switch', 'access point',
            'ryzen', 'intel', 'i3', 'i5', 'i7', 'i9',
            'rtx', 'gtx', 'nvidia', 'amd', 'asus', 'acer', 'dell', 'hp', 'lenovo', 'msi'
        ],
        en: [
            'computer', 'pc',
            'laptop', 'notebook',
            'desktop', 'desktop pc', 'all in one', 'aio',
            'gaming', 'gaming pc', 'gaming laptop', 'gaming notebook',
            'monitor', 'display', 'screen',
            'keyboard', 'mechanical keyboard',
            'mouse', 'gaming mouse',
            'parts', 'components', 'ram', 'ssd', 'hdd', 'cpu', 'gpu', 'vga',
            'mainboard', 'motherboard', 'mobo',
            'graphics card', 'video card', 'vga card',
            'power supply', 'psu',
            'case', 'pc case', 'fan', 'cooling',
            'printer', 'scanner', 'multifunction',
            'router', 'wifi router', 'switch', 'access point',
            'ryzen', 'intel', 'core i3', 'core i5', 'core i7', 'core i9',
            'rtx', 'gtx', 'nvidia', 'amd', 'asus', 'acer', 'dell', 'hp', 'lenovo', 'msi'
        ]
    },

    // 5. เครื่องใช้ไฟฟ้า (Home Appliances)
    5: {
        th: [
            'เครื่องใช้ไฟฟ้า', 'เครื่องใช้ไฟฟ้าในบ้าน',
            'แอร์', 'เครื่องปรับอากาศ', 'แอร์บ้าน', 'แอร์ติดผนัง',
            'ตู้เย็น', 'ตู้แช่', 'ตู้เย็น 2 ประตู',
            'เครื่องซักผ้า', 'เครื่องอบผ้า', 'เครื่องซักอบผ้า',
            'ทีวี', 'โทรทัศน์', 'smart tv', 'android tv',
            'เครื่องเสียง', 'ลำโพง', 'ซาวด์บาร์', 'soundbar',
            'ไมโครเวฟ', 'เตาอบ', 'เตาอบไมโครเวฟ',
            'หม้อหุงข้าว', 'หม้อหุงข้าวไฟฟ้า',
            'เครื่องปั่น', 'ปั่นน้ำผลไม้', 'blender',
            'พัดลม', 'พัดลมตั้งพื้น', 'พัดลมติดผนัง',
            'เครื่องดูดฝุ่น', 'vacuum', 'หุ่นยนต์ดูดฝุ่น',
            'เตารีด', 'เครื่องทำน้ำอุ่น', 'เครื่องทำน้ำร้อน',
            'กระติกน้ำร้อน', 'หม้อต้มน้ำ', 'กาต้มน้ำ',
            'inverter', 'no frost', 'btu', 'energy saving'
        ],
        en: [
            'appliance', 'home appliance', 'electrical appliance',
            'air conditioner', 'aircon', 'ac', 'air conditioning',
            'refrigerator', 'fridge', 'freezer', 'double door fridge',
            'washing machine', 'dryer', 'washer dryer',
            'tv', 'television', 'smart tv', 'android tv', '4k tv',
            'audio', 'speaker', 'soundbar', 'home theater',
            'microwave', 'oven', 'microwave oven',
            'rice cooker', 'electric rice cooker',
            'blender', 'juicer', 'mixer',
            'fan', 'stand fan', 'wall fan', 'ceiling fan',
            'vacuum cleaner', 'vacuum', 'robot vacuum',
            'iron', 'water heater', 'heater',
            'thermos', 'kettle', 'electric kettle',
            'inverter', 'no frost', 'frost free', 'btu', 'energy saving'
        ]
    },

    // 6. แฟชั่น (Fashion)
    6: {
        th: [
            'เสื้อ', 'เสื้อผ้า', 'เสื้อยืด', 'เสื้อเชิ้ต', 'เสื้อโปโล',
            'กางเกง', 'กางเกงยีนส์', 'กางเกงขาสั้น', 'กางเกงขายาว',
            'กระโปรง', 'เดรส', 'ชุดเดรส',
            'รองเท้า', 'รองเท้าผ้าใบ', 'รองเท้าแตะ', 'รองเท้าบูท',
            'sneakers', 'สนีกเกอร์', 'รองเท้าวิ่ง',
            'กระเป๋า', 'กระเป๋าสะพาย', 'กระเป๋าเป้', 'กระเป๋าถือ', 'กระเป๋าสตางค์',
            'นาฬิกา', 'นาฬิกาข้อมือ', 'watch',
            'เครื่องประดับ', 'ต่างหู', 'สร้อย', 'แหวน', 'กำไล',
            'แว่นตา', 'แว่นกันแดด', 'แว่นสายตา',
            'เข็มขัด', 'หมวก', 'ผ้าพันคอ', 'ถุงเท้า',
            'ผู้ชาย', 'ผู้หญิง', 'unisex',
            'size s', 'size m', 'size l', 'size xl',
            'nike', 'adidas', 'gucci', 'lv', 'chanel', 'prada',
            'authentic', 'original', 'ของแท้'
        ],
        en: [
            'shirt', 'clothing', 't-shirt', 'tee', 'polo shirt', 'dress shirt',
            'pants', 'trousers', 'jeans', 'shorts', 'long pants',
            'skirt', 'dress',
            'shoes', 'sneakers', 'sandals', 'boots', 'slippers',
            'running shoes', 'sports shoes',
            'bag', 'handbag', 'backpack', 'shoulder bag', 'wallet', 'purse',
            'watch', 'wristwatch',
            'jewelry', 'jewellery', 'earrings', 'necklace', 'ring', 'bracelet',
            'glasses', 'sunglasses', 'eyeglasses', 'spectacles',
            'belt', 'hat', 'cap', 'scarf', 'socks',
            'men', 'women', 'unisex', 'male', 'female',
            'size s', 'size m', 'size l', 'size xl', 'size xxl',
            'nike', 'adidas', 'gucci', 'lv', 'louis vuitton', 'chanel', 'prada', 'hermes',
            'authentic', 'original', 'genuine', 'brandname'
        ]
    },

    // 7. เกมและแก็ดเจ็ต (Gaming & Gadgets)
    7: {
        th: [
            'เกม', 'เกมคอนโซล', 'คอนโซล',
            'playstation', 'ps4', 'ps5', 'พีเอส',
            'xbox', 'เอ็กซ์บ็อกซ์',
            'nintendo', 'switch', 'นินเทนโด',
            'แผ่นเกม', 'ตลับเกม', 'game', 'cd game',
            'จอย', 'controller', 'คอนโทรลเลอร์',
            'หูฟังเกมมิ่ง', 'gaming headset',
            'คีย์บอร์ดเกมมิ่ง', 'gaming keyboard',
            'เมาส์เกมมิ่ง', 'gaming mouse',
            'smartwatch', 'สมาร์ทวอทช์', 'นาฬิกาอัจฉริยะ',
            'โดรน', 'drone', 'โดรนถ่ายภาพ',
            'vr', 'virtual reality', 'vr headset',
            'action camera', 'กล้อง action'
        ],
        en: [
            'game', 'gaming', 'console', 'game console',
            'playstation', 'ps4', 'ps5',
            'xbox', 'xbox one', 'xbox series',
            'nintendo', 'switch', 'nintendo switch',
            'game disc', 'game cartridge', 'video game',
            'controller', 'gamepad', 'joystick',
            'gaming headset', 'gaming headphones',
            'gaming keyboard',
            'gaming mouse',
            'smartwatch', 'smart watch',
            'drone', 'quadcopter', 'camera drone',
            'vr', 'virtual reality', 'vr headset', 'oculus',
            'action camera', 'gopro'
        ]
    },

    // 8. กล้องถ่ายรูป (Cameras)
    8: {
        th: [
            'กล้อง', 'กล้องถ่ายรูป',
            'กล้องดิจิตอล', 'กล้องดิจิตอล', 'digital camera',
            'กล้องฟิล์ม', 'film camera', 'กล้องฟิล์ม 35mm',
            'dslr', 'ดีเอสแอลอาร์',
            'mirrorless', 'มิเรอร์เลส',
            'เลนส์', 'lens', 'เลนส์กล้อง',
            'canon', 'nikon', 'sony', 'fujifilm', 'leica',
            'ขาตั้ง', 'tripod', 'ขาตั้งกล้อง',
            'แฟลช', 'flash', 'สปีดไลท์',
            'กระเป๋ากล้อง', 'camera bag',
            'memory card', 'sd card', 'เมมโมรี่การ์ด',
            'full frame', 'aps-c', 'cmos', 'sensor',
            'megapixel', 'mp', 'autofocus', 'af'
        ],
        en: [
            'camera', 'digital camera',
            'dslr', 'digital slr',
            'mirrorless', 'mirrorless camera',
            'film camera', '35mm camera',
            'lens', 'camera lens',
            'canon', 'nikon', 'sony', 'fujifilm', 'fuji', 'leica', 'olympus', 'panasonic',
            'tripod', 'camera stand',
            'flash', 'speedlight', 'strobe',
            'camera bag',
            'memory card', 'sd card', 'cf card',
            'full frame', 'aps-c', 'micro four thirds', 'cmos', 'sensor',
            'megapixel', 'mp', 'autofocus', 'af', 'image stabilization'
        ]
    },

    // 9. พระเครื่องและของสะสม (Amulets & Collectibles)
    9: {
        th: [
            'พระ', 'พระเครื่อง', 'พระบูชา', 'พระกริ่ง',
            'เหรียญ', 'เหรียญพระ', 'เหรียญกษาปณ์',
            'ธนบัตร', 'ธนบัตรเก่า', 'ธนบัตรสะสม',
            'ของเก่า', 'ของโบราณ', 'ของสะสม',
            'โมเดล', 'ฟิกเกอร์', 'figure',
            'art toy', 'อาร์ตทอย', 'กล่องสุ่ม',
            'การ์ดสะสม', 'trading card', 'โปเกมอน', 'pokemon',
            'ตุ๊กตา', 'ของเล่นวินเทจ', 'vintage toy'
        ],
        en: [
            'amulet', 'thai amulet', 'buddha amulet',
            'coin', 'collectible coin', 'antique coin',
            'banknote', 'antique banknote', 'old banknote',
            'antique', 'vintage', 'collectible',
            'model', 'figure', 'figurine',
            'art toy', 'blind box', 'mystery box',
            'trading card', 'collectible card', 'pokemon', 'yu-gi-oh',
            'doll', 'vintage toy', 'retro toy'
        ]
    },

    // 10. สัตว์เลี้ยง (Pets)
    10: {
        th: [
            'สัตว์เลี้ยง', 'สัตว์',
            'สุนัข', 'หมา', 'ลูกหมา', 'puppy', 'dog',
            'แมว', 'ลูกแมว', 'kitten', 'cat',
            'กระต่าย', 'rabbit', 'hamster', 'แฮมสเตอร์',
            'นก', 'bird', 'ปลา', 'fish',
            'อาหารสุนัข', 'อาหารแมว', 'dog food', 'cat food',
            'ขนมสุนัข', 'ขนมแมว', 'dog treat', 'cat treat',
            'ของเล่นสุนัข', 'ของเล่นแมว', 'pet toy',
            'อุปกรณ์สัตว์เลี้ยง', 'pet supplies',
            'กรง', 'Cage', 'คอก', 'กรงสุนัข', 'กรงแมว',
            'ที่นอนสุนัข', 'ที่นอนแมว', 'pet bed',
            'ปลอกคอ', 'สายจูง', 'collar', 'leash',
            'ชามอาหาร', 'ชามน้ำ', 'food bowl', 'water bowl'
        ],
        en: [
            'pet', 'animal',
            'dog', 'puppy', 'doggy',
            'cat', 'kitten', 'kitty',
            'rabbit', 'bunny', 'hamster', 'guinea pig',
            'bird', 'parrot', 'fish', 'aquarium fish',
            'dog food', 'cat food', 'pet food',
            'dog treat', 'cat treat', 'pet treat', 'snack',
            'dog toy', 'cat toy', 'pet toy',
            'pet supplies', 'pet accessories',
            'cage', 'crate', 'kennel', 'cat house',
            'pet bed', 'dog bed', 'cat bed',
            'collar', 'leash', 'harness',
            'food bowl', 'water bowl', 'feeder'
        ]
    },

    // 11. บริการ (Services)
    11: {
        th: [
            'บริการ', 'รับจ้าง', 'service',
            'ช่าง', 'ช่างซ่อม', 'ซ่อม', 'ซ่อมบำรุง',
            'ช่างไฟฟ้า', 'ช่างประปา', 'ช่างแอร์', 'ช่างทำผม',
            'ขนย้าย', 'รถขนย้าย', 'moving', 'ย้ายบ้าน',
            'แม่บ้าน', 'ทำความสะอาด', 'cleaning', 'ทำงานบ้าน',
            'ติวเตอร์', 'สอนพิเศษ', 'tutor', 'ครู',
            'สอนภาษา', 'สอนดนตรี', 'สอนวาดรูป',
            'รับออกแบบ', 'design', 'กราฟิก',
            'ถ่ายรูป', 'ถ่ายวิดีโอ', 'photographer', 'videographer'
        ],
        en: [
            'service', 'services', 'hire',
            'technician', 'repair', 'fix', 'maintenance',
            'electrician', 'plumber', 'ac technician', 'hairdresser',
            'moving', 'moving service', 'relocation',
            'maid', 'housekeeper', 'cleaning', 'housework',
            'tutor', 'tutoring', 'teacher', 'instructor',
            'language teacher', 'music teacher', 'art teacher',
            'design', 'graphic design', 'designer',
            'photographer', 'photography', 'videographer', 'video'
        ]
    },

    // 12. กีฬาและท่องเที่ยว (Sports & Travel)
    12: {
        th: [
            'กีฬา', 'sport', 'อุปกรณ์กีฬา',
            'จักรยาน', 'bicycle', 'bike', 'จักรยานเสือหมอบ', 'จักรยานเสือภูเขา',
            'ฟิตเนส', 'fitness', 'เครื่องออกกำลังกาย',
            'ดัมเบล', 'dumbbell', 'บาร์เบล', 'barbell',
            'ลู่วิ่ง', 'treadmill', 'จักรยานออกกำลังกาย',
            'แคมป์ปิ้ง', 'camping', 'เต็นท์', 'tent',
            'ถุงนอน', 'sleeping bag', 'เตียงเป่าลม',
            'เป้เดินป่า', 'backpack', 'กระเป๋าเดินทาง',
            'ฟุตบอล', 'football', 'บาสเก็ตบอล', 'basketball',
            'วอลเล่ย์บอล', 'volleyball', 'แบดมินตัน', 'badminton',
            'สเก็ต', 'โรลเลอร์', 'roller', 'skateboard',
            'บัตรท่องเที่ยว', 'voucher', 'บัตรเข้า', 'ticket'
        ],
        en: [
            'sport', 'sports', 'sports equipment',
            'bicycle', 'bike', 'cycling', 'road bike', 'mountain bike', 'mtb',
            'fitness', 'gym', 'workout', 'exercise equipment',
            'dumbbell', 'barbell', 'weights',
            'treadmill', 'exercise bike', 'stationary bike',
            'camping', 'camp', 'tent',
            'sleeping bag', 'air mattress', 'camping mat',
            'backpack', 'hiking backpack', 'travel bag',
            'football', 'soccer', 'basketball',
            'volleyball', 'badminton',
            'skate', 'roller skates', 'inline skates', 'skateboard',
            'travel voucher', 'ticket', 'admission ticket'
        ]
    },

    // 13. บ้านและสวน (Home & Garden)
    13: {
        th: [
            'เฟอร์นิเจอร์', 'furniture', 'เฟอร์นิเจอร์บ้าน',
            'โซฟา', 'sofa', 'โซฟาเบด',
            'เตียง', 'ที่นอน', 'bed', 'mattress',
            'โต๊ะ', 'table', 'โต๊ะทำงาน', 'โต๊ะกินข้าว',
            'เก้าอี้', 'chair', 'เก้าอี้ทำงาน',
            'ตู้', 'cabinet', 'ตู้เสื้อผ้า', 'ตู้เก็บของ',
            'ชั้นวางของ', 'shelf', 'ชั้นหนังสือ',
            'ของตกแต่ง', 'ของตกแต่งบ้าน', 'home decor',
            'ผ้าม่าน', 'curtain', 'พรม', 'carpet',
            'โคมไฟ', 'lamp', 'โคมไฟตั้งโต๊ะ',
            'ต้นไม้', 'พืช', 'plant', 'ไม้ประดับ',
            'ทำสวน', 'gardening', 'อุปกรณ์สวน',
            'เครื่องมือช่าง', 'tools', 'เครื่องมือซ่อมแซม',
            'สว่าน', 'drill', 'ค้อน', 'hammer', 'ประแจ', 'wrench'
        ],
        en: [
            'furniture', 'home furniture',
            'sofa', 'couch', 'sofa bed',
            'bed', 'mattress', 'bed frame',
            'table', 'desk', 'dining table', 'work table',
            'chair', 'office chair', 'armchair',
            'cabinet', 'wardrobe', 'closet', 'storage cabinet',
            'shelf', 'bookshelf', 'rack',
            'decor', 'home decor', 'decoration',
            'curtain', 'drapes', 'carpet', 'rug',
            'lamp', 'table lamp', 'floor lamp', 'lighting',
            'plant', 'tree', 'indoor plant', 'ornamental plant',
            'gardening', 'garden equipment', 'garden tools',
            'tools', 'hand tools', 'repair tools',
            'drill', 'hammer', 'wrench', 'screwdriver'
        ]
    },

    // 14. เครื่องสำอางและความงาม (Beauty & Cosmetics) ✨ NEW!
    14: {
        th: [
            'เครื่องสำอาง', 'cosmetics', 'makeup', 'แต่งหน้า',
            'ลิปสติก', 'lipstick', 'ลิป', 'ลิปกลอส',
            'รองพื้น', 'foundation', 'คูชั่น', 'cushion',
            'แป้ง', 'powder', 'แป้งฝุ่น', 'แป้งพัฟ',
            'อายแชโดว์', 'eyeshadow', 'ดินสอเขียนคิ้ว',
            'มาสคาร่า', 'mascara', 'อายไลเนอร์', 'eyeliner',
            'บลัชออน', 'blush', 'ไฮไลท์', 'highlight',
            'ผลิตภัณฑ์บำรุงผิว', 'skincare', 'บำรุงผิว',
            'ครีมบำรุงหน้า', 'facial cream', 'moisturizer',
            'เซรั่ม', 'serum', 'เอสเซนส์', 'essence',
            'ครีมกันแดด', 'sunscreen', 'กันแดด', 'spf',
            'โฟม', 'cleanser', 'โฟมล้างหน้า',
            'มาส์ก', 'mask', 'มาส์กหน้า', 'sheet mask',
            'วิตามินซี', 'vitamin c', 'เรตินอล', 'retinol',
            'ผลิตภัณฑ์บำรุงผม', 'haircare', 'แชมพู', 'shampoo',
            'ครีมนวด', 'conditioner', 'ทรีทเมนท์', 'treatment',
            'เซรั่มผม', 'hair serum', 'น้ำมันบำรุงผม',
            'น้ำหอม', 'perfume', 'น้ำหอมแบรนด์เนม',
            'โลชั่น', 'lotion', 'บอดี้โลชั่น', 'body lotion',
            'ครีมทาผิว', 'body cream', 'สครับ', 'scrub',
            'แปรงแต่งหน้า', 'makeup brush', 'beauty blender',
            'ที่ดัดขนตา', 'eyelash curler', 'ที่เป่าผม', 'hair dryer',
            'maybelline', 'loreal', 'mac', 'dior', 'chanel', 'estee lauder'
        ],
        en: [
            'cosmetics', 'makeup', 'beauty',
            'lipstick', 'lip gloss', 'lip liner', 'lip tint',
            'foundation', 'cushion', 'bb cream', 'cc cream',
            'powder', 'face powder', 'compact powder',
            'eyeshadow', 'eye shadow', 'eyebrow pencil',
            'mascara', 'eyeliner', 'eye liner',
            'blush', 'blusher', 'highlighter', 'contour',
            'skincare', 'skin care',
            'facial cream', 'face cream', 'moisturizer',
            'serum', 'essence', 'ampoule',
            'sunscreen', 'sun cream', 'spf', 'uv protection',
            'cleanser', 'face wash', 'facial wash',
            'mask', 'face mask', 'sheet mask', 'clay mask',
            'vitamin c', 'retinol', 'hyaluronic acid', 'niacinamide',
            'haircare', 'hair care', 'shampoo',
            'conditioner', 'hair treatment', 'hair mask',
            'hair serum', 'hair oil',
            'perfume', 'fragrance', 'eau de parfum', 'edp', 'cologne',
            'lotion', 'body lotion', 'body milk',
            'body cream', 'scrub', 'body scrub',
            'makeup brush', 'brush set', 'beauty blender', 'sponge',
            'eyelash curler', 'hair dryer', 'straightener', 'curling iron',
            'maybelline', 'loreal', 'mac', 'dior', 'chanel', 'estee lauder', 'clinique'
        ]
    },

    // 15. เด็กและทารก (Baby & Kids) 👶 NEW!
    15: {
        th: [
            'เด็ก', 'ทารก', 'เด็กทารก', 'baby', 'kids',
            'เสื้อผ้าเด็ก', 'เสื้อเด็ก', 'กางเกงเด็ก',
            'ชุดทารก', 'ชุดเด็กอ่อน', 'บอดี้สูท', 'romper',
            'รองเท้าเด็ก', 'รองเท้าเด็กเล็ก',
            'ของเล่น', 'ของเล่นเด็ก', 'toy', 'toys',
            'ตุ๊กตา', 'doll', 'หุ่นยนต์', 'robot',
            'บล็อก', 'block', 'lego', 'เลโก้',
            'รถเข็นเด็ก', 'stroller', 'รถเข็น', 'baby stroller',
            'คาร์ซีท', 'car seat', 'เบาะรถยนต์',
            'เปลเด็ก', 'crib', 'cradle', 'เปล',
            'เก้าอี้ทานข้าว', 'high chair', 'เก้าอี้เด็ก',
            'ผ้าอ้อม', 'diaper', 'ผ้าอ้อมสำเร็จรูป',
            'ขวดนม', 'bottle', 'ขวดนมเด็ก', 'baby bottle',
            'จุกนม', 'pacifier', 'จุกหลอก',
            'นมผง', 'milk powder', 'formula milk',
            'ครีมทาผิวเด็ก', 'baby cream', 'โลชั่นเด็ก',
            'แชมพูเด็ก', 'baby shampoo', 'สบู่เด็ก',
            'เตียงเด็ก', 'baby bed', 'เฟอร์นิเจอร์เด็ก',
            'โต๊ะเด็ก', 'เก้าอี้เด็ก', 'ตู้เสื้อผ้าเด็ก',
            'pampers', 'huggies', 'mamy poko'
        ],
        en: [
            'baby', 'babies', 'kid', 'kids', 'infant', 'toddler',
            'kids clothing', 'baby clothing', 'children clothes',
            'baby outfit', 'bodysuit', 'romper', 'onesie',
            'kids shoes', 'baby shoes', 'children shoes',
            'toy', 'toys', 'baby toy', 'kids toy',
            'doll', 'dolls', 'action figure', 'robot',
            'block', 'building blocks', 'lego',
            'stroller', 'baby stroller', 'pram', 'pushchair',
            'car seat', 'baby car seat', 'infant car seat',
            'crib', 'baby crib', 'cradle', 'bassinet',
            'high chair', 'baby chair', 'feeding chair',
            'diaper', 'diapers', 'nappy',
            'bottle', 'baby bottle', 'feeding bottle', 'milk bottle',
            'pacifier', 'soother', 'dummy',
            'formula', 'baby formula', 'milk powder', 'infant formula',
            'baby cream', 'baby lotion', 'baby oil',
            'baby shampoo', 'baby soap', 'baby wash',
            'baby bed', 'kids furniture', 'children furniture',
            'kids table', 'kids chair', 'kids wardrobe',
            'pampers', 'huggies', 'mamy poko', 'merries'
        ]
    },

    // 16. หนังสือและการศึกษา (Books & Education) 📚 NEW!
    16: {
        th: [
            'หนังสือ', 'book', 'books',
            'นิยาย', 'novel', 'เรื่องสั้น',
            'หนังสือแนะนำ', 'หนังสือขายดี', 'bestseller',
            'หนังสือการ์ตูน', 'comic', 'comics', 'การ์ตูน',
            'มังงะ', 'manga', 'มังฮวา', 'manhwa',
            'นิตยสาร', 'magazine', 'วารสาร',
            'หนังสือเรียน', 'textbook', 'หนังสืออ้างอิง',
            'หนังสือเด็ก', 'children book', 'นิทาน',
            'หนังสือความรู้', 'หนังสือธรรมะ', 'หนังสือพัฒนาตัวเอง',
            'พจนานุกรม', 'dictionary', 'สารานุกรม',
            'คอร์สออนไลน์', 'online course', 'e-learning',
            'เครื่องเขียน', 'stationery', 'อุปกรณ์การเรียน',
            'ปากกา', 'pen', 'ดินสอ', 'pencil',
            'สมุด', 'notebook', 'สมุดโน้ต',
            'กระดาษ', 'paper', 'กระดาษเขียน',
            'ไส้ตลับปากกา', 'pen refill', 'ยางลบ', 'eraser',
            'ไม้บรรทัด', 'ruler', 'คัตเตอร์', 'cutter',
            'กาว', 'glue', 'เทปใส', 'tape',
            'กระเป๋านักเรียน', 'school bag', 'กระเป๋าใส่ดินสอ'
        ],
        en: [
            'book', 'books',
            'novel', 'fiction', 'non-fiction', 'short story',
            'bestseller', 'best seller', 'recommended book',
            'comic', 'comics', 'comic book', 'cartoon book',
            'manga', 'manhwa', 'manhua',
            'magazine', 'journal', 'periodical',
            'textbook', 'text book', 'reference book',
            'children book', 'kids book', 'picture book', 'storybook',
            'knowledge book', 'self-help', 'self-improvement',
            'dictionary', 'encyclopedia',
            'online course', 'e-learning', 'udemy', 'coursera',
            'stationery', 'school supplies', 'office supplies',
            'pen', 'pencil', 'ballpoint pen',
            'notebook', 'note book', 'journal',
            'paper', 'writing paper', 'a4 paper',
            'pen refill', 'refill', 'eraser', 'rubber',
            'ruler', 'cutter', 'scissors',
            'glue', 'tape', 'adhesive tape',
            'school bag', 'backpack', 'pencil case'
        ]
    },

    // 99. เบ็ดเตล็ด (Others)
    99: {
        th: [
            'เบ็ดเตล็ด', 'อื่นๆ', 'ทั่วไป',
            'ของใช้', 'ของใช้ทั่วไป', 'ของใช้ในบ้าน',
            'แฮนด์เมด', 'handmade', 'ทำมือ', 'งานฝีมือ',
            'diy', 'ดีไอวาย', 'ทำเอง',
            'รีไซเคิล', 'recycle', 'ของรีไซเคิล',
            'เครื่องเขียน', 'สำนักงาน', 'office supplies',
            'กระดาษ', 'แฟ้ม', 'คลิป', 'เครื่องเย็บกระดาษ',
            'ไม้ประดั้', 'scrap', 'มือสอ'
        ],
        en: [
            'others', 'miscellaneous', 'general',
            'general items', 'household items',
            'handmade', 'handicraft', 'craft',
            'diy', 'do it yourself',
            'recycled', 'recycle', 'upcycle',
            'stationery', 'office', 'office supplies',
            'paper', 'folder', 'clip', 'stapler',
            'scrap', 'secondhand', 'used'
        ]
    }
}

/**
 * Get all keywords for a category
 */
export function getCategoryKeywords(categoryId: number): string[] {
    const keywords = CATEGORY_KEYWORDS[categoryId]
    if (!keywords) return []
    return [...keywords.th, ...keywords.en]
}

/**
 * Search which categories match the given text
 */
export function findMatchingCategories(text: string): Array<{
    categoryId: number
    matchedKeywords: string[]
    score: number
}> {
    const textLower = text.toLowerCase()
    const results: Array<{
        categoryId: number
        matchedKeywords: string[]
        score: number
    }> = []

    Object.entries(CATEGORY_KEYWORDS).forEach(([categoryId, keywords]) => {
        const matchedKeywords: string[] = []
        let score = 0

        // Check Thai keywords
        keywords.th.forEach(keyword => {
            if (textLower.includes(keyword.toLowerCase())) {
                matchedKeywords.push(keyword)
                score += 1
            }
        })

        // Check English keywords
        keywords.en.forEach(keyword => {
            if (textLower.includes(keyword.toLowerCase())) {
                matchedKeywords.push(keyword)
                score += 1
            }
        })

        if (matchedKeywords.length > 0) {
            results.push({
                categoryId: parseInt(categoryId),
                matchedKeywords,
                score
            })
        }
    })

    // Sort by score (highest first)
    return results.sort((a, b) => b.score - a.score)
}

/**
* ADVANCED CLASSIFICATION ENGINE
* 
* Comprehensive product classification system using:
* - Brand Context Detection
* - Multi-Signal Fusion
* - Exclusion Keywords
* - Domain Validators
* - Confidence Thresholds
* - Use Case Clustering
*/

import { CATEGORIES } from '@/constants/categories'

// ========================================
// 1. BRAND CONTEXT RULES (ENHANCED!)
// ========================================
const BRAND_CONTEXT_RULES: Record<string, Record<string, string[]>> = {
    'canon': {
        camera: ['กล้อง', 'camera', 'lens', 'เลนส์', 'eos', 'powershot', 'dslr', 'mirrorless', 'ถ่ายรูป', 'ถ่ายภาพ'],
        // 🔥 ENHANCED: Added more printer-specific keywords
        printer: [
            'ปริ้นเตอร์', 'printer', 'pixma', 'maxify', 'หมึก', 'toner', 'g-series', 'ecotank',
            'เครื่องพิมพ์', 'พิมพ์', 'print', 'printing', 'มัลติฟังก์ชัน', 'multifunction',
            'สแกน', 'scan', 'ถ่ายเอกสาร', 'copy', 'สำนักงาน', 'office', 'inkjet', 'laser',
            'ปริ้น', 'เครื่องปริ้น', 'imageclass', 'lbp', 'mf-series', 'ถ่าย', 'เอกสาร'
        ],
        scanner: ['สแกนเนอร์', 'scanner', 'lide', 'canoscan'],
    },
    'epson': {
        printer: [
            'ปริ้นเตอร์', 'printer', 'ecotank', 'l-series', 'l1', 'l3', 'l5', 'l6', 'หมึก', 'ink',
            'เครื่องพิมพ์', 'พิมพ์', 'มัลติฟังก์ชัน', 'multifunction', 'workforce',
            'expression', 'surecolor', 'ปริ้น', 'สำนักงาน'
        ],
        projector: ['โปรเจคเตอร์', 'projector', 'eb-series', 'chiếu'],
    },
    'hp': {
        printer: [
            'ปริ้นเตอร์', 'printer', 'deskjet', 'laserjet', 'officejet', 'หมึก', 'toner',
            'เครื่องพิมพ์', 'พิมพ์', 'มัลติฟังก์ชัน', 'multifunction', 'envy', 'smart tank',
            'neverstop', 'ปริ้น', 'สำนักงาน'
        ],
        laptop: ['โน้ตบุ๊ค', 'laptop', 'notebook', 'pavilion', 'envy', 'spectre', 'omen'],
    },
    'brother': {
        printer: [
            'ปริ้นเตอร์', 'printer', 'เครื่องพิมพ์', 'พิมพ์', 'มัลติฟังก์ชัน', 'multifunction',
            'hl-', 'dcp-', 'mfc-', 'หมึก', 'toner', 'inkjet', 'laser', 'ปริ้น', 'สำนักงาน'
        ],
        sewing: ['จักรเย็บผ้า', 'sewing machine', 'จักร', 'เย็บผ้า', 'ปักจักร', 'embroidery'],
    },
    'xiaomi': {
        phone: ['มือถือ', 'phone', 'smartphone', 'redmi', 'poco', 'mi'],
        appliance: ['หุงข้าว', 'rice cooker', 'vacuum', 'ดูดฝุ่น', 'air purifier', 'ฟอกอากาศ', 'พัดลม', 'fan'],
        gadget: ['powerbank', 'หูฟัง', 'earbuds', 'สายชาร์จ', 'band', 'watch', 'mi band', 'buds'],
        // 🔥 ADDED: Air pump context for Xiaomi
        automotive: ['ปั๊มลม', 'air pump', 'เติมลม', 'ยาง', 'tire', 'portable pump'],
    },
    'samsung': {
        phone: ['มือถือ', 'phone', 'smartphone', 'galaxy', 'note', 'fold', 'flip', 's24', 'a54'],
        appliance: ['ตู้เย็น', 'refrigerator', 'แอร์', 'air conditioner', 'เครื่องซักผ้า', 'washing', 'ไมโครเวฟ'],
        tv: ['ทีวี', 'tv', 'television', 'qled', 'crystal uhd', 'neo qled', 'frame tv'],
        printer: ['ปริ้นเตอร์', 'printer', 'xpress', 'proxpress', 'เครื่องพิมพ์'],
    },

    // 🔥 NEW: Sony - กล้อง vs PlayStation vs ทีวี vs หูฟัง
    'sony': {
        camera: ['กล้อง', 'camera', 'alpha', 'a7', 'a6', 'zv-1', 'dslr', 'mirrorless', 'lens', 'เลนส์'],
        gaming: ['playstation', 'ps5', 'ps4', 'dualsense', 'controller', 'เครื่องเกม', 'console'],
        tv: ['ทีวี', 'tv', 'bravia', 'oled', '4k', '8k', 'television'],
        audio: ['หูฟัง', 'headphone', 'earbuds', 'wh-1000', 'wf-1000', 'xm4', 'xm5', 'speaker', 'soundbar'],
    },

    // 🔥 NEW: LG - ทีวี vs เครื่องใช้ไฟฟ้า vs มือถือ
    'lg': {
        tv: ['ทีวี', 'tv', 'oled', 'nanocell', 'qned', '4k', 'webos', 'television'],
        appliance: ['ตู้เย็น', 'refrigerator', 'เครื่องซักผ้า', 'washing', 'แอร์', 'air conditioner', 'inverter'],
        vacuum: ['หุ่นยนต์ดูดฝุ่น', 'robot vacuum', 'cordzero', 'ดูดฝุ่น'],
        phone: ['มือถือ', 'phone', 'velvet', 'wing', 'smartphone'],
    },

    // 🔥 NEW: Panasonic - กล้อง vs เครื่องใช้ไฟฟ้า vs แบตเตอรี่
    'panasonic': {
        camera: ['กล้อง', 'camera', 'lumix', 'gh5', 'gh6', 's5', 'mirrorless', 'lens'],
        appliance: ['ไมโครเวฟ', 'microwave', 'เครื่องซักผ้า', 'washing', 'ตู้เย็น', 'แอร์'],
        battery: ['แบตเตอรี่', 'battery', 'ถ่าน', 'eneloop', 'rechargeable'],
        audio: ['หูฟัง', 'headphone', 'earbuds'],
    },

    // 🔥 NEW: Philips - ทีวี vs หลอดไฟ vs เครื่องโกนหนวด vs เครื่องใช้ไฟฟ้า
    'philips': {
        tv: ['ทีวี', 'tv', 'android tv', 'ambilight', '4k', 'television'],
        lighting: ['หลอดไฟ', 'bulb', 'led', 'hue', 'smart light', 'โคมไฟ', 'lamp'],
        grooming: ['เครื่องโกนหนวด', 'shaver', 'oneblade', 'razor', 'trimmer', 'ที่โกนขน'],
        appliance: ['ไดร์เป่าผม', 'hair dryer', 'blender', 'เครื่องปั่น', 'air fryer', 'หม้อทอดไร้น้ำมัน'],
    },


    // 🔥 NEW: Lenovo - โน้ตบุ๊ค vs มือถือ vs เกมมิ่ง
    'lenovo': {
        laptop: ['โน้ตบุ๊ค', 'laptop', 'notebook', 'thinkpad', 'ideapad', 'yoga', 'legion'],
        phone: ['มือถือ', 'phone', 'smartphone'],
        tablet: ['แท็บเล็ต', 'tablet', 'tab'],
        gaming: ['legion', 'gaming', 'เกมมิ่ง', 'gaming laptop'],
    },

    // 🔥 NEW: Logitech - คีย์บอร์ด/เมาส์ vs เกมมิ่ง vs Webcam
    'logitech': {
        peripheral: ['คีย์บอร์ด', 'keyboard', 'เมาส์', 'mouse', 'mx master', 'mx keys', 'k380', 'm720'],
        gaming: ['gaming', 'g pro', 'g502', 'g913', 'เกมมิ่ง', 'rgb'],
        webcam: ['webcam', 'กล้องเว็บแคม', 'c920', 'brio', 'streamcam'],
        audio: ['หูฟัง', 'headset', 'g pro x', 'pro headset'],
    },

    // 🔥 NEW: Razer - เกมมิ่ง vs มือถือ
    'razer': {
        gaming: ['gaming', 'เกมมิ่ง', 'keyboard', 'mouse', 'blackwidow', 'deathadder', 'kraken', 'huntsman'],
        phone: ['มือถือ', 'phone', 'razer phone'],
        audio: ['หูฟัง', 'headset', 'kraken', 'barracuda'],
        laptop: ['laptop', 'blade', 'โน้ตบุ๊ค'],
    },

    // 🔥 NEW: Asus - มือถือ vs โน้ตบุ๊ค vs เกมมิ่ง
    'asus': {
        phone: ['มือถือ', 'phone', 'zenfone', 'rog phone', 'smartphone'],
        laptop: ['โน้ตบุ๊ค', 'laptop', 'notebook', 'zenbook', 'vivobook', 'tuf'],
        gaming: ['rog', 'republic of gamers', 'tuf gaming', 'strix', 'เกมมิ่ง'],
        motherboard: ['เมนบอร์ด', 'motherboard', 'mainboard', 'rog strix'],
    },

    // 🔥 NEW: JBL - หูฟัง vs ลำโพง vs เครื่องเสียงรถ
    'jbl': {
        earbuds: ['หูฟัง', 'earbuds', 'tune', 'live', 'endurance', 'wireless'],
        speaker: ['ลำโพง', 'speaker', 'flip', 'charge', 'boombox', 'partybox', 'go', 'bluetooth'],
        car: ['เครื่องเสียงรถ', 'car audio', 'subwoofer', 'ซับวูฟเฟอร์', 'car speaker'],
    },

    // 🔥 NEW: Apple - มือถือ vs โน้ตบุ๊ค vs แท็บเล็ต vs นาฬิกา
    'apple': {
        phone: ['iphone', 'มือถือ', 'phone', 'smartphone', 'pro max', 'mini'],
        laptop: ['macbook', 'โน้ตบุ๊ค', 'mac', 'imac', 'mac mini', 'mac studio'],
        tablet: ['ipad', 'แท็บเล็ต', 'tablet', 'ipad pro', 'ipad air'],
        watch: ['apple watch', 'watch', 'ultra', 'นาฬิกา', 'series 9'],
        earbuds: ['airpods', 'หูฟัง', 'pro', 'max'],
    }
}

// ========================================
// 2. EXCLUSION KEYWORDS (ห้ามไปหมวดนี้)
// ========================================
const EXCLUSION_KEYWORDS: Record<number, string[]> = {
    // Category 8 (Camera) - ห้ามถ้าพบคำเหล่านี้ (🔥 ENHANCED!)
    8: [
        // Printers
        'ปริ้นเตอร์', 'printer', 'หมึกพิมพ์', 'toner', 'inkjet', 'laser printer',
        'เครื่องพิมพ์', 'พิมพ์', 'print', 'printing', // 🔥 ADDED
        'มัลติฟังก์ชัน', 'multifunction', 'all-in-one', // 🔥 ADDED
        'สแกนเนอร์', 'scanner', 'โปรเจคเตอร์', 'projector',
        'เครื่องพิมพ์บัตร', 'card printer', 'pvc printer', 'badge printer',
        'เครื่องพิมพ์การ์ด', 'id card printer',
        'เครื่องปริ้น', 'ปริ้น', 'copy', 'ถ่ายเอกสาร', 'เอกสาร', // 🔥 ADDED
        'สำนักงาน', 'office', 'pixma', 'maxify', 'imageclass', // 🔥 ADDED Canon printer models
        // Air pumps
        'ปั๊มลม', 'air pump', 'air compressor'
    ],

    // Category 4 (Computer) - ห้ามถ้าพบคำเหล่านี้
    4: [
        'กล้องดิจิตอล', 'digital camera', 'dslr', 'mirrorless',
        'เลนส์กล้อง', 'camera lens', 'canon eos', 'nikon z', 'fujifilm x',
        // 🔥 AIR PUMP - CRITICAL FIX (ENHANCED!)
        'ปั๊มลม', 'air pump', 'ปั๊มลมพกพา', 'เติมลม', 'tire inflator',
        'ปั๊มลมไฟฟ้า', 'portable air pump', 'ปั๊มพกพา', 'ปั๊มเติมลม',
        'เครื่องเติมลม', 'ที่เติมลม', 'ที่สูบลม', 'air compressor',
        'xiaomi air pump', 'baseus air pump', 'portable pump',
        // Toys/Kids
        'ตุ๊กตา', 'doll', 'ของเล่น', 'toy', 'plush',
        // Automotive/Real Estate
        'รถยนต์', 'รถมือสอง', 'car for sale', 'มอเตอร์ไซค์',
        'คอนโด', 'บ้าน', 'ที่ดิน', 'house', 'condo'
    ],

    // Category 1 (Automotive) - ห้ามถ้าพบคำเหล่านี้
    1: [
        'ตุ๊กตารถ', 'toy car', 'รถของเล่น', 'รถเด็กเล่น', 'โมเดลรถ', 'model car',
        'สติกเกอร์รถ', 'car sticker', 'รูปรถ', 'car photo', 'โปสเตอร์'
    ],

    // Category 3 (Mobile) - ห้ามถ้าพบคำเหล่านี้
    3: [
        'กล้อง', 'camera', 'dslr', 'mirrorless',
        'โน้ตบุ๊ค', 'laptop', 'notebook',
        'ตุ๊กตา', 'toy', 'doll'
    ]
}

// ========================================
// 3. BILINGUAL PATTERN MATCHING
// ========================================
interface BilingualPattern {
    thai: string[]
    english: string[]
    weight: number
    categories: number[] // หมวดที่เกี่ยวข้อง
}

const BILINGUAL_PATTERNS: Record<string, BilingualPattern> = {
    'printer_card': {
        thai: ['เครื่องพิมพ์บัตร', 'ปริ้นบัตร', 'เครื่องพิมพ์การ์ด', 'พิมพ์บัตร pvc', 'เครื่องตอกบัตร'],
        english: ['card printer', 'id card printer', 'pvc printer', 'badge printer', 'plastic card printer'],
        weight: 100,
        categories: [4] // Computer
    },

    'air_pump_automotive': {
        thai: [
            'ปั๊มลม', 'ปั๊มลมพกพา', 'ปั๊มพกพา', 'เติมลม', 'ที่เติมลม',
            'ปั๊มลมเติมยาง', 'ปั๊มลมรถยนต์', 'ปั๊มลมไฟฟ้า',
            'เครื่องเติมลม', 'ที่สูบลม', 'ปั๊มเติมลม'
        ],
        english: [
            'air pump', 'tire pump', 'air compressor', 'electric pump',
            'tire inflator', 'car air pump', 'portable air pump',
            'portable pump', 'portable compressor', 'xiaomi air pump',
            'baseus air pump', 'mini air pump'
        ],
        weight: 150, // 🔥 INCREASED from 95 to 150 for stronger matching
        categories: [1, 13] // Automotive, Home & Garden
    },

    'camera_body': {
        thai: ['กล้อง', 'กล้องดิจิตอล', 'กล้องมิเรอร์เลส', 'บอดี้กล้อง', 'กล้อง dslr'],
        english: ['camera', 'dslr', 'mirrorless', 'camera body', 'digital camera'],
        weight: 90,
        categories: [8] // Camera
    },

    'laser_printer': {
        thai: ['ปริ้นเตอร์เลเซอร์', 'เครื่องพิมพ์เลเซอร์', 'เลเซอร์เจ็ท', 'โทนเนอร์'],
        english: ['laser printer', 'laserjet', 'laser printing', 'toner cartridge'],
        weight: 95,
        categories: [4] // Computer
    },

    // 🔥 NEW PATTERN: Multifunction Printer
    'multifunction_printer': {
        thai: [
            'เครื่องพิมพ์มัลติฟังก์ชัน', 'มัลติฟังก์ชัน', 'เครื่องพิมพ์',
            'ปริ้นเตอร์', 'สแกน', 'ถ่ายเอกสาร', 'เครื่องปริ้น',
            'พิมพ์', 'สำนักงาน', 'ออฟฟิศ'
        ],
        english: [
            'multifunction printer', 'multifunction', 'all-in-one printer',
            'printer', 'print', 'scan', 'copy', 'office', 'mfp',
            'pixma', 'maxify', 'imageclass', 'ecotank', 'smart tank'
        ],
        weight: 120, // Higher than camera_body (90) to win when both Canon keywords exist
        categories: [4] // Computer
    },

    // 🔥 NEW: Ambiguous Product Patterns

    // เคสมือถือ vs PC Case
    'phone_case': {
        thai: ['เคสมือถือ', 'เคสโทรศัพท์', 'เคส iphone', 'เคส samsung', 'เคสไอโฟน', 'เคสซัมซุง'],
        english: ['phone case', 'iphone case', 'samsung case', 'mobile case', 'smartphone case', 'silicone case', 'clear case'],
        weight: 100,
        categories: [3] // Mobile
    },
    'pc_case': {
        thai: ['เคสคอมพิวเตอร์', 'เคส pc', 'เคสคอม', 'ตัวเคส', 'เคสเครื่อง'],
        english: ['pc case', 'computer case', 'tower case', 'atx case', 'mid tower', 'full tower', 'mini itx'],
        weight: 100,
        categories: [4] // Computer
    },

    // แบตเตอรี่
    'phone_battery': {
        thai: ['แบตมือถือ', 'แบตโทรศัพท์', 'แบต iphone', 'แบต samsung'],
        english: ['phone battery', 'iphone battery', 'samsung battery', 'mobile battery'],
        weight: 90,
        categories: [3] // Mobile
    },
    'car_battery': {
        thai: ['แบตรถยนต์', 'แบตเตอรี่รถ', 'แบตรถ', 'แบต 12v'],
        english: ['car battery', 'auto battery', 'vehicle battery', '12v battery', 'lead acid'],
        weight: 95,
        categories: [1] // Automotive
    },

    // พัดลม
    'home_fan': {
        thai: ['พัดลมบ้าน', 'พัดลมตั้งโต๊ะ', 'พัดลมตั้งพื้น', 'พัดลมติดผนัง', 'พัดลมเพดาน'],
        english: ['home fan', 'desk fan', 'stand fan', 'wall fan', 'ceiling fan', 'tower fan'],
        weight: 90,
        categories: [5] // Appliances
    },
    'pc_fan': {
        thai: ['พัดลม cpu', 'พัดลมคอม', 'พัดลมเคส', 'พัดลมระบายความร้อน'],
        english: ['cpu fan', 'pc fan', 'case fan', 'cooling fan', 'rgb fan', 'aio cooler'],
        weight: 95,
        categories: [4] // Computer
    },

    // ฟิล์ม
    'screen_protector': {
        thai: ['ฟิล์มหน้าจอ', 'ฟิล์มกันรอย', 'ฟิล์มกระจก', 'ฟิล์ม iphone', 'ฟิล์มมือถือ'],
        english: ['screen protector', 'tempered glass', 'screen film', 'phone film', 'glass protector'],
        weight: 95,
        categories: [3] // Mobile
    },
    'car_film': {
        thai: ['ฟิล์มกรองแสง', 'ฟิล์มติดรถ', 'ฟิล์มรถยนต์', 'ฟิล์มกันร้อน'],
        english: ['car window film', 'tint film', 'window tint', 'solar film', 'car tint'],
        weight: 95,
        categories: [1] // Automotive
    },
    'camera_film': {
        thai: ['ฟิล์มถ่ายรูป', 'ฟิล์มกล้อง', 'ฟิล์ม 35mm', 'ฟิล์มสี', 'ฟิล์มขาวดำ'],
        english: ['camera film', '35mm film', 'film roll', 'color film', 'kodak film', 'fuji film'],
        weight: 95,
        categories: [8] // Camera
    },

    // น้ำหอม
    'perfume': {
        thai: ['น้ำหอมผู้ชาย', 'น้ำหอมผู้หญิง', 'น้ำหอมแบรนด์', 'โคโลญจน์', 'กลิ่นหอม'],
        english: ['perfume', 'cologne', 'eau de parfum', 'edp', 'edt', 'fragrance'],
        weight: 90,
        categories: [14] // Beauty
    },
    'car_perfume': {
        thai: ['น้ำหอมรถ', 'น้ำหอมรถยนต์', 'น้ำหอมติดรถ', 'ปรับอากาศรถ'],
        english: ['car perfume', 'car freshener', 'car scent', 'car air freshener', 'little tree'],
        weight: 95,
        categories: [1] // Automotive
    },
    'room_perfume': {
        thai: ['น้ำหอมห้อง', 'น้ำหอมปรับอากาศ', 'ก้านหอม', 'เทียนหอม', 'สเปรย์ปรับอากาศ'],
        english: ['room freshener', 'air freshener', 'diffuser', 'reed diffuser', 'scented candle'],
        weight: 90,
        categories: [13] // Home & Garden
    },

    // กล้องติดรถ
    'dash_cam': {
        thai: ['กล้องติดรถ', 'กล้องหน้ารถ', 'กล้องถอยหลัง', 'dash cam', 'กล้องติดรถยนต์'],
        english: ['dash cam', 'dashcam', 'car camera', 'car dvr', 'driving recorder', '70mai'],
        weight: 100,
        categories: [1] // Automotive (NOT Camera!)
    },

    // กล้องวงจรปิด
    'cctv': {
        thai: ['กล้องวงจรปิด', 'cctv', 'กล้องรักษาความปลอดภัย', 'กล้อง ip', 'nvr', 'dvr'],
        english: ['cctv', 'security camera', 'ip camera', 'surveillance', 'cctv camera', 'nvr', 'dvr system'],
        weight: 100,
        categories: [13, 4] // Home & Garden or Computer (NOT Camera!)
    },

    // หูฟังเกมมิ่ง
    'gaming_headset': {
        thai: ['หูฟังเกมมิ่ง', 'หูฟังเกม', 'หูฟัง gaming', 'headset gaming'],
        english: ['gaming headset', 'gaming headphone', 'gaming earphone', 'esport headset'],
        weight: 95,
        categories: [7] // Gaming (NOT Mobile!)
    },

    // คีย์บอร์ดเกมมิ่ง
    'gaming_keyboard': {
        thai: ['คีย์บอร์ดเกมมิ่ง', 'คีย์บอร์ดเกม', 'คีย์บอร์ด mechanical', 'คีย์บอร์ด rgb'],
        english: ['gaming keyboard', 'mechanical keyboard', 'rgb keyboard', 'esport keyboard'],
        weight: 95,
        categories: [7] // Gaming (or Computer)
    },

    // รองเท้าวิ่ง/กีฬา
    'sports_shoes': {
        thai: ['รองเท้าวิ่ง', 'รองเท้ากีฬา', 'รองเท้าฟุตบอล', 'รองเท้าบาส', 'รองเท้าออกกำลังกาย'],
        english: ['running shoes', 'sports shoes', 'football shoes', 'basketball shoes', 'training shoes'],
        weight: 90,
        categories: [12] // Sports (NOT Fashion!)
    },

    // เสื้อกีฬา
    'sports_apparel': {
        thai: ['เสื้อกีฬา', 'เสื้อบอล', 'เสื้อทีม', 'ชุดกีฬา', 'ชุดออกกำลังกาย', 'กางเกงวิ่ง'],
        english: ['sports jersey', 'team jersey', 'sports wear', 'running shirt', 'gym wear', 'athletic wear'],
        weight: 90,
        categories: [12] // Sports (NOT Fashion!)
    },

    // ของเล่นเด็ก RC Car
    'toy_car': {
        thai: ['รถบังคับ', 'รถของเล่น', 'รถเด็กเล่น', 'rc car', 'รถบังคับวิทยุ'],
        english: ['toy car', 'rc car', 'remote control car', 'kids car', 'toy vehicle'],
        weight: 100,
        categories: [15] // Kids (NOT Automotive!)
    },

    // แชมพูสัตว์
    'pet_shampoo': {
        thai: ['แชมพูหมา', 'แชมพูแมว', 'แชมพูสุนัข', 'แชมพูสัตว์เลี้ยง', 'อาบน้ำหมา'],
        english: ['dog shampoo', 'cat shampoo', 'pet shampoo', 'pet grooming', 'animal shampoo'],
        weight: 100,
        categories: [10] // Pets (NOT Beauty!)
    }
}

// ========================================
// 4. USE CASE CLUSTERS
// ========================================
interface UseCase {
    categories: number[]
    subcategories?: number[]
    keywords: string[]
    weight: number
}

const USE_CASE_CLUSTERS: Record<string, UseCase> = {
    'professional_photography': {
        categories: [8],
        keywords: ['ถ่ายภาพ', 'photography', 'photoshoot', 'studio', 'wedding', 'portrait', 'landscape'],
        weight: 80
    },

    'office_printing': {
        categories: [4],
        subcategories: [405],
        keywords: ['พิมพ์เอกสาร', 'printing', 'office', 'สำนักงาน', 'ออฟฟิศ', 'เอกสาร', 'document'],
        weight: 85
    },

    'car_maintenance': {
        categories: [1],
        subcategories: [109],
        keywords: ['ดูแลรถ', 'car care', 'ซ่อมรถ', 'car repair', 'บำรุงรักษา', 'maintenance', 'detailing'],
        weight: 90
    },

    'home_diy': {
        categories: [13],
        subcategories: [1304],
        keywords: ['ซ่อมบ้าน', 'diy', 'home improvement', 'ช่างบ้าน', 'home repair', 'renovation'],
        weight: 85
    }
}

// ========================================
// 5. DOMAIN VALIDATORS
// ========================================
type DomainValidator = (product: { title: string; description: string; price?: number }) => boolean

const DOMAIN_VALIDATORS: Record<number, DomainValidator> = {
    // Camera Validator - Category 8
    8: (product) => {
        const text = `${product.title} ${product.description}`.toLowerCase()

        const hasCameraSpecs = /\d+\s*(mp|megapixel)|iso\s*\d+|f\/\d+\.\d+|aperture/i.test(text)
        const hasCameraType = /(dslr|mirrorless|compact camera|point and shoot)/i.test(text)
        const hasCameraBrand = /(canon eos|nikon z|sony alpha|fujifilm x)/i.test(text)
        const hasLensMount = /(ef mount|rf mount|z mount|e mount|x mount)/i.test(text)

        // ต้องมีอย่างน้อย 2 ใน 4 เงื่อนไข
        return [hasCameraSpecs, hasCameraType, hasCameraBrand, hasLensMount].filter(Boolean).length >= 2
    },

    // Printer Validator - Subcategory 405
    405: (product) => {
        const text = `${product.title} ${product.description}`.toLowerCase()

        const hasPrinterType = /(inkjet|laser|ecotank|dot matrix|thermal)/i.test(text)
        const hasPrintFunction = /(print|scan|copy|fax|multifunction)/i.test(text)
        const hasPrinterSupply = /(ink|toner|cartridge|ribbon)/i.test(text)
        const hasPrinterBrand = /(epson l|canon pixma|hp deskjet|brother)/i.test(text)

        return [hasPrinterType, hasPrintFunction, hasPrinterSupply, hasPrinterBrand].filter(Boolean).length >= 1
    },

    // Air Pump Validator - Subcategory 109 (Automotive)
    109: (product) => {
        const text = `${product.title} ${product.description}`.toLowerCase()

        const isPump = /(ปั๊มลม|air pump|compressor|tire inflator)/i.test(text)
        const isAutomotiveContext = /(รถ|car|ยาง|tire|เติมลม|inflate)/i.test(text)
        const notComputerContext = !/(computer|pc|คอมพิวเตอร์|laptop)/i.test(text)

        return isPump && isAutomotiveContext && notComputerContext
    }
}

// ========================================
// 6. MAIN CLASSIFICATION ENGINE
// ========================================
export interface ClassificationResult {
    categoryId: number
    subcategoryId?: number
    confidence: number
    signals: {
        brandContext?: string
        useCaseMatch?: string
        patternMatches: string[]
        excludedCategories: number[]
        validatorPassed: boolean
    }
    reasoning: string
}

export class AdvancedClassificationEngine {

    /**
     * Analyze brand context from title and description
     */
    private analyzeBrandContext(text: string): { brand: string; context: string } | null {
        const textLower = text.toLowerCase()

        for (const [brand, contexts] of Object.entries(BRAND_CONTEXT_RULES)) {
            if (textLower.includes(brand)) {
                for (const [context, triggers] of Object.entries(contexts)) {
                    const matchCount = triggers.filter(t =>
                        textLower.includes(t.toLowerCase())
                    ).length

                    if (matchCount >= 1) {
                        return { brand, context }
                    }
                }
            }
        }
        return null
    }

    /**
     * Check if category should be excluded
     */
    private checkExclusions(categoryId: number, text: string): boolean {
        const exclusions = EXCLUSION_KEYWORDS[categoryId] || []
        return exclusions.some(kw => text.toLowerCase().includes(kw.toLowerCase()))
    }

    /**
     * Match bilingual patterns
     */
    private matchPatterns(text: string): Map<string, number> {
        const scores = new Map<string, number>()
        const textLower = text.toLowerCase()

        for (const [patternName, config] of Object.entries(BILINGUAL_PATTERNS)) {
            const thaiMatches = config.thai.filter(kw => textLower.includes(kw)).length
            const engMatches = config.english.filter(kw => textLower.includes(kw.toLowerCase())).length

            const totalMatches = thaiMatches + engMatches
            if (totalMatches > 0) {
                scores.set(patternName, totalMatches * config.weight)
            }
        }

        return scores
    }

    /**
     * Detect use case
     */
    private detectUseCase(text: string): string | null {
        const textLower = text.toLowerCase()
        let bestMatch: { useCase: string; score: number } | null = null

        for (const [useCase, config] of Object.entries(USE_CASE_CLUSTERS)) {
            const matchCount = config.keywords.filter(kw =>
                textLower.includes(kw.toLowerCase())
            ).length

            if (matchCount >= 2) {
                const score = matchCount * config.weight
                if (!bestMatch || score > bestMatch.score) {
                    bestMatch = { useCase, score }
                }
            }
        }

        return bestMatch?.useCase || null
    }

    /**
     * Run domain validator
     */
    private validateDomain(categoryId: number, product: any): boolean {
        const validator = DOMAIN_VALIDATORS[categoryId]
        if (!validator) return true // ไม่มี validator = ผ่านโดยอัตโนมัติ

        return validator(product)
    }

    /**
     * Main classification method
     */
    classify(product: {
        title: string
        description: string
        price?: number
    }): ClassificationResult {
        const text = `${product.title} ${product.description}`
        const textLower = text.toLowerCase()

        // 1. Analyze brand context
        const brandContext = this.analyzeBrandContext(text)

        // 2. Match patterns
        const patternScores = this.matchPatterns(text)

        // 3. Detect use case
        const useCase = this.detectUseCase(text)

        // 4. Check exclusions
        const excludedCategories: number[] = []
        for (const catId of CATEGORIES.map(c => c.id)) {
            if (this.checkExclusions(catId, text)) {
                excludedCategories.push(catId)
            }
        }

        // 5. Calculate scores for each category
        const categoryScores = new Map<number, number>()

        // Base scoring from patterns
        for (const [patternName, score] of patternScores.entries()) {
            const pattern = BILINGUAL_PATTERNS[patternName]
            for (const catId of pattern.categories) {
                categoryScores.set(catId, (categoryScores.get(catId) || 0) + score)
            }
        }

        // Boost from use case
        if (useCase) {
            const useCaseConfig = USE_CASE_CLUSTERS[useCase]
            for (const catId of useCaseConfig.categories) {
                categoryScores.set(catId, (categoryScores.get(catId) || 0) + useCaseConfig.weight)
            }
        }

        // Boost from brand context
        if (brandContext) {
            // Map context to category
            const contextCategoryMap: Record<string, number> = {
                'camera': 8,
                'printer': 4,
                'scanner': 4,
                'projector': 4,
                'laptop': 4,
                'phone': 3,
                'appliance': 5,
                'gadget': 3,
                'tv': 5
            }

            const catId = contextCategoryMap[brandContext.context]
            if (catId) {
                categoryScores.set(catId, (categoryScores.get(catId) || 0) + 100)
            }
        }

        // Apply exclusions (heavy penalty)
        for (const catId of excludedCategories) {
            categoryScores.set(catId, (categoryScores.get(catId) || 0) - 200)
        }

        // 6. Find best category
        let bestCategory = 0
        let bestScore = -Infinity

        for (const [catId, score] of categoryScores.entries()) {
            if (score > bestScore) {
                bestScore = score
                bestCategory = catId
            }
        }

        // 7. Validate with domain validator
        const validatorPassed = this.validateDomain(bestCategory, product)

        if (!validatorPassed && bestScore < 150) {
            // ถ้า validator ไม่ผ่านและคะแนนไม่สูงมาก ให้เลือกหมวดอื่น
            categoryScores.delete(bestCategory)
            bestCategory = 0
            bestScore = -Infinity

            for (const [catId, score] of categoryScores.entries()) {
                if (score > bestScore && this.validateDomain(catId, product)) {
                    bestScore = score
                    bestCategory = catId
                }
            }
        }

        // 8. Calculate confidence
        const maxPossibleScore = 300 // ประมาณการคะแนนสูงสุด
        const confidence = Math.min(Math.max(bestScore / maxPossibleScore, 0), 1)

        // 9. Generate reasoning
        const patternNames = Array.from(patternScores.keys())
        let reasoning = `Matched ${patternNames.length} patterns`
        if (brandContext) reasoning += `, detected ${brandContext.brand} ${brandContext.context}`
        if (useCase) reasoning += `, use case: ${useCase}`
        if (excludedCategories.length > 0) reasoning += `, excluded ${excludedCategories.length} categories`

        return {
            categoryId: bestCategory,
            confidence,
            signals: {
                brandContext: brandContext ? `${brandContext.brand}:${brandContext.context}` : undefined,
                useCaseMatch: useCase || undefined,
                patternMatches: patternNames,
                excludedCategories,
                validatorPassed
            },
            reasoning
        }
    }
}

// ========================================
// USAGE EXAMPLE
// ========================================
/*
const engine = new AdvancedClassificationEngine()

const result = engine.classify({
    title: 'เครื่องพิมพ์บัตร PVC Canon รุ่น MF4450',
    description: 'เครื่องพิมพ์บัตรพนักงาน บัตรนักเรียน สภาพดี',
    price: 15000
})

console.log('Category:', result.categoryId)
console.log('Confidence:', result.confidence)
console.log('Reasoning:', result.reasoning)
console.log('Signals:', result.signals)
*/

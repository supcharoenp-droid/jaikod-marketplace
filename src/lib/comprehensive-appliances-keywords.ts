/**
 * COMPREHENSIVE APPLIANCES KEYWORDS - Category 5 (เครื่องใช้ไฟฟ้า)
 * 
 * Structure: Organized by SUBCATEGORY ID
 */

export const APPLIANCE_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 501: AIR CONDITIONERS / แอร์
    // ========================================
    501: [
        // Thai Terms
        'แอร์', 'เครื่องปรับอากาศ', 'แอร์บ้าน', 'แอร์ติดผนัง', 'แอร์ตั้งพื้น', 'แอร์แขวน',
        'แอร์เคลื่อนที่', 'พัดลมไอเย็น', 'แอร์อินเวอร์เตอร์', 'แอร์ inverter',
        'แอร์ 9000', 'แอร์ 12000', 'แอร์ 18000', 'แอร์ 24000', 'แอร์ 30000', 'btu',
        'คอมเพรสเซอร์แอร์', 'คอยล์ร้อน', 'คอยล์เย็น', 'น้ำยาแอร์',
        'ล้างแอร์', 'รีโมทแอร์', 'ติดตั้งแอร์', 'ย้ายแอร์',
        'แอร์ฝังฝ้า', 'แอร์ 4 ทิศทาง', 'cassette type',

        // English Terms
        'air conditioner', 'air con', 'ac', 'inverter air conditioner',
        'wall mount air conditioner', 'portable air conditioner',
        'split type', 'window type', 'ducted air conditioner',
        '9000 btu', '12000 btu', '18000 btu', '24000 btu', '30000 btu',

        // Brands
        'mitsubishi electric', 'mr.slim', 'mitsubishi msy-jp',
        'daikin', 'daikin inverter', 'daikin stkc', 'daikin smile',
        'carrier', 'carrier x inverter', 'carrier x inverter plus',
        'panasonic air', 'panasonic nanoe', 'samsung air', 'samsung wind-free',
        'lg air', 'lg dual inverter', 'lg artcool',
        'haier', 'saijo denki', 'central air',
        'gree', 'sharp', 'sharp plasma', 'hitachi', 'tcl air',
        'hisense', 'toshiba', 'york', 'trane', 'electrolux air', 'amena',

        // Features
        'inverter', 'ประหยัดไฟเบอร์ 5', 'เบอร์ 5', 'pm 2.5 filter', 'ฟอกอากาศในตัว',
        'wifi control', 'สั่งงานผ่านมือถือ', 'เสียงเงียบ', 'quiet mode',
        'r32', 'น้ำยา r32', 'r410a', 'eco mode', 'turbo mode',
        'auto clean', 'self clean', 'ทำความสะอาดตัวเอง',
        'smart inverter', 'iot', 'แอปควบคุม',

        // Room Sizes (NEW!)
        'แอร์ห้อง 12 ตร.ม.', 'แอร์ห้อง 20 ตร.ม.', 'แอร์ห้อง 30 ตร.ม.', 'แอร์ห้อง 40 ตร.ม.',
        'แอร์ห้องนอน', 'แอร์ห้องนั่งเล่น', 'แอร์ออฟฟิศ', 'แอร์ห้องประชุม',

        // Price Ranges (NEW!)
        'แอร์ 10000', 'แอร์ 15000', 'แอร์ 20000', 'แอร์ 25000', 'แอร์ 30000',
        'แอร์ไม่เกิน 15000', 'แอร์ไม่เกิน 20000', 'แอร์ไม่เกิน 30000',
        'แอร์ราคาถูก', 'แอร์ประหยัด', 'ac under 15000', 'ac under 20000',

        // Conditions (NEW!)
        'แอร์มือสอง', 'แอร์มือ2', 'แอร์ใหม่', 'แอร์ตัวโชว์',
        'แอร์ประกันศูนย์', 'ติดตั้งฟรี', 'ประกัน 1 ปี',
    ],

    // ========================================
    // 502: REFRIGERATORS / ตู้เย็น
    // ========================================
    502: [
        // Thai Terms
        'ตู้เย็น', 'ตู้แช่', 'ตู้แช่แข็ง', 'ตู้แช่ไวน์',
        'ตู้เย็น 1 ประตู', 'ตู้เย็น 2 ประตู', 'ตู้เย็น 3 ประตู', 'ตู้เย็น 4 ประตู', 'side by side',
        'ตู้เย็นเล็ก', 'ตู้เย็นมินิ', 'minibar', 'ตู้เย็นหอพัก', 'ตู้เย็นคอนโด',
        'ตู้แช่อาหาร', 'ตู้แช่นมแม่', 'ตู้แช่เครื่องดื่ม', 'ตู้แช่ร้านค้า',
        'คิว', '5 คิว', '6 คิว', '7 คิว', '8 คิว', '10 คิว', '12 คิว', '14 คิว', '16 คิว',

        // English Terms
        'refrigerator', 'fridge', 'freezer', 'chest freezer', 'deep freezer',
        'single door', 'double door', 'multi door', 'french door', 'door in door',
        'mini fridge', 'wine cooler', 'beverage cooler',
        'inverter fridge', 'linear inverter',

        // Brands & Models
        'mitsubishi fridge', 'hitachi fridge', 'hitachi bigtwo',
        'toshiba fridge', 'toshiba inverter',
        'samsung fridge', 'samsung bespoke', 'samsung family hub',
        'lg fridge', 'lg instaview', 'lg door-in-door',
        'sharp fridge', 'sharp plasmacluster', 'sharp j-tech',
        'panasonic fridge', 'panasonic econavi',
        'haier fridge', 'hisense fridge',
        'electrolux fridge', 'electrolux nutrifresh',
        'beko', 'bosch', 'smeg',
        'sanden', 'freshero', 'panalux', 'snowphil',

        // Features
        'inverter', 'linear compressor', 'no frost', 'frost free', 'ละลายน้ำแข็งอัตโนมัติ',
        'กดน้ำหน้าตู้', 'water dispenser', 'ทำน้ำแข็งอัตโนมัติ', 'automatic ice maker',
        'ประหยัดไฟ', 'เบอร์ 5', 'ช่องแช่ผัก', 'crisper', 'ช่องฟรีซ',
        'multi air flow', 'fresh zone', 'vitamin c', 'deodorizer',
        'แผ่นกระจกกันรอย', 'tempered glass shelf',

        // Use Cases (NEW!)
        'ตู้เย็นครอบครัว', 'ตู้เย็น 1-2 คน', 'ตู้เย็นสำนักงาน',

        // Price Ranges (NEW!)
        'ตู้เย็น 5000', 'ตู้เย็น 7000', 'ตู้เย็น 10000', 'ตู้เย็น 15000', 'ตู้เย็น 20000',
        'ตู้เย็นไม่เกิน 10000', 'ตู้เย็นไม่เกิน 15000', 'ตู้เย็นไม่เกิน 20000',
        'ตู้เย็นราคาถูก', 'fridge under 10000', 'fridge under 15000',

        // Conditions (NEW!)
        'ตู้เย็นมือสอง', 'ตู้เย็นใหม่', 'ตู้เย็นตัวโชว์', 'ตู้เย็นประกันศูนย์',
    ],

    // ========================================
    // 503: WASHING MACHINES / เครื่องซักผ้า
    // ========================================
    503: [
        // Thai Terms
        'เครื่องซักผ้า', 'เครื่องซัก', 'เครื่องอบผ้า', 'เครื่องซักอบ',
        'ฝาบน', 'ฝาหน้า', '2 ถัง', 'สองถัง', 'ถังเดี่ยว',
        'เครื่องซักผ้ามินิ', 'เครื่องซักผ้าพกพา',
        'เครื่องอบแห้ง', 'ตู้อบผ้า', 'เครื่องอบผ้าไอน้ำ',
        'ซักผ้านวม', 'ซักผ้าห่ม', 'ซักผ้าม่าน',

        // Capacity
        '5kg', '6kg', '7kg', '8kg', '9kg', '10kg', '11kg', '12kg', '15kg', '17kg', '20kg',
        '5 กิโล', '7 กิโล', '8 กิโล', '9 กิโล', '10 กิโล', '12 กิโล', '15 กิโล',

        // English Terms
        'washing machine', 'washer', 'dryer', 'washer dryer', 'combo washer dryer',
        'top load', 'front load', 'twin tub', 'vertical axis',
        'mini washer', 'portable washer', 'tumble dryer', 'heat pump dryer',

        // Brands & Models
        'lg washing machine', 'lg turbowash', 'lg turbowash 360', 'lg ai dd',
        'samsung washer', 'samsung ecobubble', 'samsung addwash', 'samsung quickdrive',
        'electrolux washer', 'electrolux ultimatecare', 'electrolux dryer',
        'hitachi washer', 'hitachi big drum', 'panasonic washer', 'panasonic econavi',
        'toshiba washer', 'toshiba greatwaves',
        'haier washer', 'haier direct motion', 'sharp washer', 'sharp ultra fine bubble',
        'beko washer', 'whirlpool', 'bosch washer', 'siemens',

        // Features
        'inverter', 'inverter motor', 'direct drive', 'dd motor',
        'ซักน้ำร้อน', 'hot water wash', 'อบลมร้อน', 'heat dry',
        'ซักด่วน', 'quick wash', 'express wash',
        'ai wash', 'steam wash', 'steam clean', 'ซักไอน้ำ',
        'ซักเงียบ', 'quiet wash', 'ซักอ่อนโยน', 'gentle wash',
        'ประหยัดไฟ', 'เบอร์ 5', 'eco mode',

        // Use Cases (NEW!)
        'เครื่องซักผ้าครอบครัว', 'เครื่องซักผ้า 1-2 คน', 'เครื่องซักผ้าคอนโด',
        'ร้านซักรีด', 'laundromat',

        // Price Ranges (NEW!)
        'เครื่องซักผ้า 5000', 'เครื่องซักผ้า 7000', 'เครื่องซักผ้า 10000', 'เครื่องซักผ้า 15000',
        'เครื่องซักผ้าไม่เกิน 10000', 'เครื่องซักผ้าไม่เกิน 15000',
        'washer under 10000', 'washer under 15000',

        // Conditions (NEW!)
        'เครื่องซักผ้ามือสอง', 'เครื่องซักผ้าใหม่', 'เครื่องซักผ้าประกันศูนย์',
    ],

    // ========================================
    // 504: TV & AUDIO / ทีวีและเครื่องเสียง
    // ========================================
    504: [
        // TV Types
        'ทีวี', 'โทรทัศน์', 'tv', 'television',
        'smart tv', 'android tv', 'google tv', 'apple tv', 'tizen',
        'led tv', 'qled tv', 'oled tv', 'miniled', 'neo qled', 'nanocell',
        '4k tv', '8k tv', 'full hd tv', 'uhd tv', '1080p tv',
        'digital tv', 'ดิจิตอลทีวี',

        // TV Sizes
        '32 นิ้ว', '40 นิ้ว', '43 นิ้ว', '50 นิ้ว', '55 นิ้ว',
        '65 นิ้ว', '75 นิ้ว', '85 นิ้ว', '98 นิ้ว',
        '32 inch', '43 inch', '50 inch', '55 inch', '65 inch', '75 inch',

        // TV Features (NEW!)
        '120hz tv', 'hdr10', 'dolby vision', 'dolby atmos',
        'gaming tv', 'vrr', 'allm', 'game mode',

        // Audio
        'เครื่องเสียง', 'โฮมเธียเตอร์', 'home theater',
        'soundbar', 'ซาวด์บาร์', 'ลำโพง tv',
        '2.1ch', '3.1ch', '5.1ch', 'dolby atmos soundbar',
        'av receiver', 'amplifiler', 'แอมป์ขยาย',
        'ชุดเครื่องเสียง', 'คาราโอเกะ', 'ไมค์ลอย',

        // Brands - TV
        'samsung tv', 'samsung the frame', 'lg tv', 'lg oled', 'sony bravia',
        'tcl tv', 'tcl qled', 'hisense tv', 'xiaomi tv', 'mi tv',
        'panasonic tv', 'sharp tv', 'sharp aquos', 'toshiba tv',
        'aconatic', 'philips tv', 'philips ambilight',

        // Brands - Audio
        'samsung soundbar', 'lg soundbar', 'sony soundbar',
        'jbl', 'jbl bar', 'bose', 'harman kardon',
        'onkyo', 'denon', 'yamaha', 'pioneer',
        'klipsch', 'polk', 'marantz',

        // Streaming Devices
        'ขาแขวนทีวี', 'tv mount',
        'chromecast', 'mi box', 'apple tv 4k', 'fire tv stick',
        'trueid tv', 'ais playbox', 'netflix', 'youtube',
        'รีโมททีวี', 'สาย hdmi', 'hdmi 2.1',

        // Use Cases (NEW!)
        'ทีวีห้องนอน', 'ทีวีห้องนั่งเล่น', 'ทีวีเกม', 'ทีวีดูหนัง',

        // Price Ranges (NEW!)
        'ทีวี 5000', 'ทีวี 10000', 'ทีวี 15000', 'ทีวี 20000', 'ทีวี 30000',
        'ทีวีไม่เกิน 10000', 'ทีวีไม่เกิน 15000', 'tv under 10000',
        'soundbar 3000', 'soundbar 5000', 'soundbar 10000',
    ],

    // ========================================
    // 505: KITCHEN APPLIANCES / เครื่องใช้ไฟฟ้าในครัว
    // ========================================
    505: [
        // Cooking - Heat
        'หม้อหุงข้าว', 'rice cooker', 'หม้อดิจิตอล', 'หม้อหุงข้าวดิจิตอล',
        '1.0l', '1.5l', '1.8l', '3 ถ้วย', '5 ถ้วย', 'หม้อหุง ih',
        'ไมโครเวฟ', 'microwave', '20l', '25l', '30l',
        'เตาอบ', 'oven', 'เตาติ๊ง', 'เตาอบ 30l', 'เตาอบ 45l',
        'หม้อทอดไร้น้ำมัน', 'air fryer', 'หม้อทอด', '3l', '5l', '7l', '12l', 'dual zone',
        'เตาไฟฟ้า', 'induction', 'เตาแม่เหล็กไฟฟ้า', 'เตาปิ้งย่าง', 'หม้อสุกี้', 'เตาหมูกระทะไฟฟ้า',
        'กาน้ำร้อน', 'kettle', '1.7l', 'กระติกน้ำร้อน',

        // Prep & Blend
        'เครื่องปั่น', 'blender', 'เครื่องปั่นน้ำผลไม้', 'เครื่องปั่นสมูทตี้',
        'เครื่องบดสับ', 'chopper', 'food processor',
        'เครื่องตีแป้ง', 'mixer', 'stand mixer', 'เครื่องผสมอาหาร',
        'เครื่องคั้นน้ำผลไม้', 'juicer', 'slow juicer', 'เครื่องสกัดเย็น',

        // Coffee
        'เครื่องชงกาแฟ', 'coffee machine', 'coffee maker', 'espresso', 'automatic',
        'เครื่องชงกาแฟสด', 'เครื่องชงแคปซูล', 'capsule', 'nespresso', 'dolce gusto',
        'เครื่องบดกาแฟ', 'coffee grinder', 'เครื่องบดเมล็ดกาแฟ',

        // Other
        'เครื่องปิ้งขนมปัง', 'toaster', 'เตาปิ้ง',
        'เครื่องทำแซนวิช', 'sandwich maker', 'waffle maker',
        'เครื่องล้างจาน', 'dishwasher', '8 ชุด', '12 ชุด',
        'เครื่องดูดควัน', 'hood', 'cooker hood', '60cm', '90cm',

        // Brands
        'philips', 'philips hd4515', 'tefal', 'tefal actifry',
        'electrolux', 'electrolux ems3087x', 'sharp', 'toshiba',
        'xiaomi', 'xiaomi mi ih', 'miji', 'simplus', 'gaabor',
        'hanabishi', 'imarflex', 'otto', 'kitchenaid', 'kenwood', 'cuizimate',

        // Price Ranges (NEW!)
        'หม้อหุงข้าว 1000', 'หม้อหุงข้าว 2000', 'หม้อหุงข้าว 3000',
        'air fryer 2000', 'air fryer 3000', 'air fryer 5000',
        'ไมโครเวฟ 3000', 'ไมโครเวฟ 5000',
        'เครื่องชงกาแฟ 5000', 'เครื่องชงกาแฟ 10000',
    ],

    // ========================================
    // 506: WATER HEATERS / เครื่องทำน้ำอุ่น
    // ========================================
    506: [
        // Types (NEW expanded!)
        'เครื่องทำน้ำอุ่น', 'water heater', 'เครื่องทำน้ำร้อน',
        'เครื่องทำน้ำอุ่นไฟฟ้า', 'electric water heater',
        'เครื่องทำน้ำอุ่นแก๊ส', 'gas water heater',
        'เครื่องทำน้ำอุ่นแบบแรงดัน', 'pump heater', 'heat pump',
        'เครื่องทำน้ำอุ่นโซล่าเซลล์', 'solar water heater',
        'หม้อต้มน้ำร้อน', 'boiler', 'storage heater',
        'ฝักบัว', 'shower heater', 'rain shower',

        // Capacity (NEW!)
        '10l', '15l', '20l', '30l', '50l',

        // Power
        '2500w', '3500w', '4500w', '6000w',

        // Brands
        'stiebel eltron', 'panasonic', 'sharp', 'toshiba',
        'mex', 'rinnai', 'mazuma', 'electrolux', 'alpha',

        // Features (NEW!)
        'ตัดไฟอัตโนมัติ', 'elcb', 'จอดิจิตอล', 'digital display',
        'ตั้งเวลา', 'timer', 'ควบคุมอุณหภูมิ',

        // Price Ranges (NEW!)
        'เครื่องทำน้ำอุ่น 3000', 'เครื่องทำน้ำอุ่น 5000', 'เครื่องทำน้ำอุ่น 7000',
    ],

    // ========================================
    // 507: VACUUM CLEANERS / เครื่องดูดฝุ่น
    // ========================================
    507: [
        // Types
        'เครื่องดูดฝุ่น', 'vacuum cleaner', 'vacuum',
        'หุ่นยนต์ดูดฝุ่น', 'robot vacuum', 'robovac',
        'เครื่องดูดฝุ่นไร้สาย', 'cordless vacuum', 'stick vacuum',
        'handheld vacuum', 'เครื่องดูดฝุ่นในรถ', 'car vacuum',
        'เครื่องดูดไรฝุ่น', 'dust mite vacuum', 'uv vacuum',
        'เครื่องซักพรม', 'carpet cleaner', 'wet dry vacuum',
        'ไม้กวาดไฟฟ้า', 'canister vacuum',

        // Brands & Models
        'dyson', 'dyson v8', 'dyson v11', 'dyson v12', 'dyson v15', 'dyson detect',
        'xiaomi vacuum', 'mi robot', 'roborock', 'roborock s7', 'roborock s8',
        'dreame', 'dreame v11', 'ecovacs', 'deebot', 'deebot x1',
        'electrolux vacuum', 'philips vacuum', 'hitachi vacuum',
        'hoover', 'deerma', 'shimono', 'autobot', 'mister robot',

        // Features (NEW!)
        'hepa filter', 'cyclone', 'self empty', 'mop vacuum',

        // Price Ranges (NEW!)
        'เครื่องดูดฝุ่น 3000', 'เครื่องดูดฝุ่น 5000', 'เครื่องดูดฝุ่น 10000',
        'หุ่นยนต์ 5000', 'หุ่นยนต์ 10000', 'vacuum under 5000',
    ],

    // ========================================
    // 508: FANS / พัดลม
    // ========================================
    508: [
        // Types
        'พัดลม', 'fan', 'พัดลมตั้งโต๊ะ', 'พัดลมตั้งพื้น', 'floor fan',
        'พัดลมเพดาน', 'ceiling fan', 'พัดลมผนัง', 'wall fan',
        'พัดลมไอเย็น', 'evaporative fan', 'air cooler',
        'พัดลมไอน้ำ', 'mist fan', 'พัดลมพ่นหมอก',
        'พัดลมไร้ใบ', 'bladeless fan',
        'พัดลมมือถือ', 'portable fan', 'พัดลมพกพา', 'usb fan',
        'พัดลมดูดอากาศ', 'exhaust fan', 'พัดลมระบายอากาศ',
        'พัดลมอุตสาหกรรม', 'industrial fan',

        // Brands
        'hatari', 'ฮาตาริ', 'mitsubishi fan', 'sharp fan',
        'masterkool', 'xiaomi fan', 'xiaomi standing fan',
        'dyson fan', 'dyson pure cool',
        'imaflex', 'ogawa', 'accord', 'panasonic fan',

        // Sizes
        '12 นิ้ว', '16 นิ้ว', '18 นิ้ว', '20 นิ้ว', '24 นิ้ว',
        'ใบพัด', '3 ใบ', '5 ใบ',

        // Features (NEW!)
        'dc motor', 'มอเตอร์ dc', 'รีโมท', 'remote control',
        'ตั้งเวลา', 'timer', 'ประหยัดไฟ',

        // Price Ranges (NEW!)
        'พัดลม 500', 'พัดลม 1000', 'พัดลม 2000', 'พัดลม 3000',
        'พัดลมไม่เกิน 1000', 'fan under 1000',
    ],

    // ========================================
    // 509: AIR PURIFIERS / เครื่องฟอกอากาศ
    // ========================================
    509: [
        // Terms
        'เครื่องฟอกอากาศ', 'air purifier', 'เครื่องกรองอากาศ',
        'ไส้กรองอากาศ', 'filter air', 'hepa filter', 'carbon filter',
        'เครื่องฟอกพกพา', 'เครื่องฟอกในรถ', 'car air purifier',
        'pm 2.5', 'pm2.5', 'กรองฝุ่น', 'กำจัดเชื้อโรค', 'ฆ่าเชื้อ',
        'uv light', 'ionizer', 'anion',

        // Brands
        'xiaomi air purifier', 'mi air purifier', 'mi 3h', 'mi 4',
        'sharp plasmacluster', 'sharp air purifier', 'sharp fp-j30',
        'philips air purifier', 'philips ac1215', 'philips ac2887',
        'blueair', 'blueair 211+',
        'dyson purifier', 'dyson pure cool', 'dyson hp07',
        'coway', 'coway airmega', 'atmopshere', 'amway',
        'electrolux air purifier', 'honeywell',

        // Coverage (NEW!)
        '20 ตร.ม.', '30 ตร.ม.', '40 ตร.ม.', '60 ตร.ม.',

        // CADR (NEW!)
        'cadr', 'cadr 300', 'cadr 400',

        // Price Ranges (NEW!)
        'เครื่องฟอกอากาศ 3000', 'เครื่องฟอกอากาศ 5000', 'เครื่องฟอกอากาศ 10000',
    ],

    // ========================================
    // 510: IRONS & STEAMERS / เครื่องรีดผ้า
    // ========================================
    510: [
        // Types
        'เตารีด', 'iron', 'เตารีดแห้ง', 'dry iron',
        'เตารีดไอน้ำ', 'steam iron',
        'เครื่องรีดถนอมผ้า', 'garment steamer', 'เครื่องรีดไอน้ำ', 'vertical steamer',
        'เตารีดหม้อต้ม', 'steam generator iron', 'steam station',
        'โต๊ะรีดผ้า', 'ironing board', 'ironing table',

        // Brands
        'philips iron', 'philips gc160', 'tefal iron', 'tefal fv1040',
        'electrolux iron', 'electrolux est7146',
        'elvira', 'smart home', 'xiaomi iron', 'xiaomi lofans',
        'panasonic iron', 'sharp iron',
        'แผ่นรองรีด', 'น้ำยารีดผ้า',

        // Features (NEW!)
        'anti-calc', 'auto shut off', 'พื้นเทฟลอน', 'ceramic plate',

        // Price Ranges (NEW!)
        'เตารีด 500', 'เตารีด 1000', 'เตารีด 2000',
        'เครื่องรีด 1000', 'เครื่องรีด 2000', 'เครื่องรีด 3000',
    ],

    // ========================================
    // 511: WATER DISPENSERS / เครื่องทำน้ำดื่ม
    // ========================================
    511: [
        // Types
        'เครื่องทำน้ำดื่ม', 'water dispenser', 'ตู้กดน้ำ', 'water cooler',
        'เครื่องกรองน้ำ', 'water filter', 'water purifier',
        'เครื่องทำน้ำร้อนน้ำเย็น', 'hot cold dispenser', 'hot cold water',
        'ไส้กรองน้ำ', 'filter cartridge', 'replacement filter',
        'ro system', 'reverse osmosis', 'uv filter', 'uf filter',
        'เหยือกกรองน้ำ', 'filter pitcher', 'brita',

        // Stages (NEW!)
        '3 ขั้นตอน', '4 ขั้นตอน', '5 ขั้นตอน', '6 ขั้นตอน',
        '3 stages', '5 stages', '6 stages',

        // Brands
        'coway', 'โคเวย์', 'เครื่องกรองน้ำ coway', 'coway p-07',
        'pure', 'เครื่องกรองน้ำ pure', 'unilever pure',
        'mazuma', 'stiebel', 'panasonic water filter',
        '3m', '3m water filter', 'pentair', 'aquatek', 'colandas',
        'sprinkle', 'haier water', 'aquasana',

        // Features (NEW!)
        'กดน้ำร้อน', 'กดน้ำเย็น', 'hot cold', 'hot warm cold',
        'ตั้งพื้น', 'stand alone', 'ตั้งโต๊ะ', 'table top',

        // Price Ranges (NEW!)
        'เครื่องกรองน้ำ 3000', 'เครื่องกรองน้ำ 5000', 'เครื่องกรองน้ำ 10000',
        'ro system 10000', 'ไส้กรอง 500', 'ไส้กรอง 1000',
    ],
}

// Combine all keywords for main category detection
export const COMPREHENSIVE_APPLIANCES_KEYWORDS = Object.values(APPLIANCE_SUBCATEGORY_KEYWORDS).flat()

/**
 * COMPREHENSIVE HOME & GARDEN KEYWORDS - Category 13 (บ้านและสวน)
 * 
 * Structure: Organized by SUBCATEGORY ID
 */

export const HOME_GARDEN_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 1301: FURNITURE / เฟอร์นิเจอร์
    // ========================================
    1301: [
        // Types
        'โซฟา', 'sofa', 'โซฟาเบด', 'sofa bed', 'โซฟาปรับนอน', 'โซฟาหนัง', 'โซฟาผ้า', 'อาร์มแชร์',
        'เตียง', 'bed', 'เตียงนอน', 'เตียงเหล็ก', 'เตียงไม้', 'เตียง 6 ฟุต', 'เตียง 5 ฟุต', 'เตียง 3.5 ฟุต', 'เตียง 2 ชั้น',
        'ที่นอน', 'mattress', 'ฟูก', 'ที่นอนยางพารา', 'ที่นอนสปริง', 'topper', 'ท็อปเปอร์',
        'ตู้เสื้อผ้า', 'wardrobe', 'ตู้เสื้อผ้าไม้', 'ตู้เสื้อผ้าเหล็ก', 'walk-in closet',
        'โต๊ะ', 'table', 'โต๊ะทำงาน', 'โต๊ะคอม', 'โต๊ะกินข้าว', 'โต๊ะกลาง', 'โต๊ะเครื่องแป้ง',
        'เก้าอี้', 'chair', 'เก้าอี้ทำงาน', 'เก้าอี้เกมมิ่ง', 'เก้าอี้ทานข้าว', 'เก้าอี้พับ', 'สตูล',
        'ชั้นวางของ', 'shelf', 'ชั้นวางหนังสือ', 'ชั้นวางทีวี', 'ตู้โชว์', 'ตู้เก็บของ',
        'เคาน์เตอร์', 'เคาน์เตอร์ครัว', 'ซิงค์ล้างจาน',

        // Furniture Styles
        'เฟอร์นิเจอร์โมเดิร์น', 'modern furniture',
        'เฟอร์นิเจอร์วินเทจ', 'vintage furniture',
        'scandinavian', 'สแกนดิเนเวียน',
        'minimalist', 'มินิมอล',
        'industrial', 'อินดัสเทรียล',

        // Materials
        'เฟอร์นิเจอร์ไม้', 'wooden furniture',
        'เฟอร์นิเจอร์เหล็ก', 'metal furniture',
        'เฟอร์นิเจอร์หวาย', 'rattan furniture',
        'เฟอร์นิเจอร์ผ้า', 'fabric furniture',

        // Room Specific
        'เฟอร์นิเจอร์ห้องนั่งเล่น', 'living room furniture',
        'เฟอร์นิเจอร์ห้องนอน', 'bedroom furniture',
        'เฟอร์นิเจอร์ห้องทานข้าว', 'dining room furniture',
        'เฟอร์นิเจอร์ออฟฟิศ', 'office furniture',

        // Conditions
        'เฟอร์นิเจอร์มือสอง', 'second hand furniture',
        'เฟอร์นิเจอร์มือ 1', 'เฟอร์นิเจอร์ใหม่',

        // Brands
        'ikea', 'อิเกีย', 'sb furniture', 'index living mall', 'koncept', 'winner',
        'modernform', 'chic republic', 'muji', 'nitori',
        'la-z-boy', 'apina', 'slumberland', 'dunlopillo', 'lotus',
        'ergo trend', 'sihoo', // Ergonomic chairs
    ],

    // ========================================
    // 1302: HOME DECOR / ของตกแต่งบ้าน
    // ========================================
    1302: [
        'ผ้าม่าน', 'curtain', 'ม่านจีบ', 'ม่านตาไก่', 'ม่านพับ', 'มู่ลี่',

        // Carpets & Rugs (EXPANDED!)
        'พรม', 'carpet', 'rug', 'พรมปูพื้น',
        'พรมเช็ดเท้า', 'พรมเช็ดฝุ่น', 'door mat', 'floor mat',
        'พรมห้องนอน', 'bedroom carpet', 'พรมห้องนั่งเล่น', 'living room rug',
        'พรมห้องนอน', 'พรมห้องครัว', 'พรมห้องน้ำ', 'bath mat',
        'พรมกันลื่น', 'anti-slip mat', 'พรมกันฝุ่น',
        'พรมวินเทจ', 'vintage rug', 'persian rug', 'พรมเปอร์เซีย',
        'area rug', 'runner rug', 'พรมยาว',

        // Lighting
        'โคมไฟ', 'lamp', 'โคมไฟเพดาน', 'โคมไฟตั้งโต๊ะ', 'chandelier',
        'หลอดไฟ', 'light bulb', 'หลอด led', 'led bulb',
        'smart bulb', 'หลอดไฟอัจฉริยะ',
        'ไฟวอร์ม', 'warm light', 'ไฟคูล', 'cool light',
        'dimmer', 'ปรับแสง',
        'ไฟเส้น', 'strip light', 'led strip',

        // Wall Decor
        'กรอบรูป', 'photo frame', 'ภาพติดผนัง', 'ภาพวาด',
        'นาฬิกาแขวน', 'wall clock',
        'wallpaper', 'วอลเปเปอร์', 'สติกเกอร์ติดผนัง',
        'กระจก', 'mirror', 'กระจกเต็มตัว',

        // Aromatics & Plants
        'แจกัน', 'vase', 'ดอกไม้ปลอม', 'ต้นไม้ปลอม',
        'เทียนหอม', 'candle', 'ก้านไม้หอม', 'diffuser',

        // Textiles
        'หมอนอิง', 'cushion', 'ผ้าปูที่นอน', 'bed sheet', 'ปลอกหมอน',

        // Storage & Organization
        'กล่องเก็บของ', 'storage box',
        'ตะกร้า', 'basket', 'ตะกร้าหวาย',
        'ที่จัดระเบียบ', 'organizer',

        // Thai Decor Terms
        'ของตกแต่งบ้านสไตล์โมเดิร์น', 'modern decor',
        'ของตกแต่งบ้านมินิมอล', 'minimalist decor',
    ],


    // ========================================
    // 1303: GARDENING / ต้นไม้และทำสวน
    // ========================================
    1303: [
        // Plants
        'ต้นไม้', 'plant', 'ไม้ประดับ', 'ไม้ฟอกอากาศ', 'ไม้มงคล',
        'กระบองเพชร', 'cactus', 'แคคตัส', 'succulent', 'กุหลาบหิน',
        'บอนไซ', 'bonsai', 'กล้วยด่าง', 'monstera', 'มอนสเตอร่า',
        'ยางอินเดีย', 'ไทรใบสัก', 'ลิ้นมังกร', 'พลูด่าง',
        'หญ้า', 'hassa', 'หญ้าเทียม', 'หญ้าสนาม', 'หญ้าแฝก',

        // Plant Care
        'รดน้ำต้นไม้', 'watering schedule',
        'อาหารพืช', 'plant food', 'น้ำหมัก',
        'เพาะชำ', 'propagation', 'ตอนกิ่ง',
        'ขุดหลุม', 'ถอนหญ้า', 'ถางหญ้า',

        // Organic Farming
        'ปลูกผักออร์แกนิค', 'organic gardening',
        'ปลูกผักสวนครัว', 'vegetable garden',
        'ปุ๋ยหมัก', 'compost', 'ทำปุ๋ยหมัก',
        'ไส้เดือน', 'earthworm',

        // Supplies
        'กระถาง', 'pot', 'กระถางต้นไม้', 'กระถางเซรามิก', 'กระถางพลาสติก', 'ขาตั้งกระถาง',
        'ดิน', 'soil', 'ดินปลูก', 'พีทมอส', 'peat moss', 'ขุยมะพร้าว', 'หินภูเขาไฟ',
        'ปุ๋ย', 'fertilizer', 'ปุ๋ยคอก', 'ปุ๋ยเคมี', 'ออสโมโค้ท',
        'เมล็ดพันธุ์', 'seeds',
        'บัวรดน้ำ', 'สายยาง', 'sprinkler', 'สปริงเกอร์',

        // Thai Garden Terms
        'ทำสวน', 'gardening', 'จัดสวน',
    ],

    // ========================================
    // 1304: TOOLS / เครื่องมือช่าง
    // ========================================
    1304: [
        // Power Tools
        'สว่าน', 'drill', 'สว่านไร้สาย', 'cordless drill', 'สว่านโรตารี่', 'สว่านกระแทก',
        'หินเจียร', 'grinder', 'ลูกหมู',
        'เลื่อย', 'saw', 'เลื่อยวงเดือน', 'เลื่อยชัก', 'เลื่อยจิ๊กซอว์',
        'เครื่องขัดกระดาษทราย', 'sander',

        // Pumps & Compressors
        'ปั๊มน้ำ', 'water pump',
        'ปั๊มลม', 'air compressor', 'air pump', 'ปั๊มลมโรงงาน', 'ปั๊มลมอุตสาหกรรม',
        'คอมเพรสเซอร์', 'compressor', 'ปั๊มลมระบบลม', 'ปั๊มลมพกพา',

        'เครื่องเชื่อม', 'tue chuem', 'ตู้เชื่อม', 'inverter welding',
        'เครื่องฉีดน้ำแรงดันสูง', 'high pressure washer',

        // Hand Tools
        'ค้อน', 'hammer', 'ไขควง', 'screwdriver', 'ประแจ', 'wrench', 'คีม', 'pliers',
        'ตลับเมตร', 'tape measure', 'ระดับน้ำ',
        'บันได', 'ladder', 'บันไดอลูมิเนียม', 'นั่งร้าน',

        // Measuring Tools
        'ตลับเมตร', 'measuring tape',
        'ระดับน้ำ', 'level', 'spirit level',
        'ขาวัด', 'caliper',
        'ไม้บรรทัด', 'ruler',

        // Power Tool Accessories
        'ดอกสว่าน', 'drill bit',
        'ใบเลื่อย', 'saw blade',
        'กระดาษทราย', 'sandpaper',
        'หัวไขควง', 'screwdriver bit',

        // Safety Gear
        'ถุงมือช่าง', 'work gloves',
        'แว่นนิรภัย', 'safety glasses', 'goggles',
        'หน้ากากป้องกัน', 'face mask', 'dust mask',
        'หูฟังลดเสียง', 'ear protection',
        'รองเท้านิรภัย', 'safety boots',

        // Brands
        'makita', 'มากิต้า', 'bosch', 'บอช', 'dewalt', 'ดีวอลท์',
        'stanley', 'milwaukee', 'black & decker',
        'pumpkin', 'total', 'ingco',
        'solo', 'solex',

        // Thai Tool Terms
        'เครื่องมือช่างมือสอง', 'second hand tools',
    ],

    // ========================================
    // 1305: GARDEN EQUIPMENT / อุปกรณ์สวน (Large)
    // ========================================
    1305: [
        'เครื่องตัดหญ้า', 'lawn mower', 'รถตัดหญ้า', 'เครื่องตัดหญ้าสายสะพาย',
        'กรรไกรตัดกิ่ง', 'pruning shears', 'เลื่อยตัดกิ่ง',
        'จอบ', 'เสียม', 'พลั่ว', 'shovel',
        'เครื่องพ่นยา', 'sprayer', 'ถังพ่นยา',
        'เครื่องเป่าใบไม้', 'leaf blower',
        'โรงเรือน', 'greenhouse', 'สแลน', 'ตาข่ายกรองแสง',

        // Watering Systems
        'ระบบน้ำหยด', 'drip irrigation',
        'สปริงเกอร์', 'sprinkler system',
        'ท่อน้ำ', 'hose', 'สายฉีดน้ำ',
        'ถังน้ำ', 'water tank', 'ถังเก็บน้ำ',

        // Composting
        'ถังหมักปุ๋ย', 'compost bin',
        'ถังบดใบไม้', 'leaf shredder',

        // Greenhouse Accessories
        'พัดลมเรือนเพาะ', 'greenhouse fan',
        'เทอร์โมมิเตอร์', 'thermometer',
        'ตาข่ายกันแมลง', 'insect net',

        // Thai Garden Equipment Terms
        'อุปกรณ์สวนครบชุด', 'complete garden set',
    ],
}

// Combine all keywords for main category detection
export const COMPREHENSIVE_HOME_GARDEN_KEYWORDS = Object.values(HOME_GARDEN_SUBCATEGORY_KEYWORDS).flat()

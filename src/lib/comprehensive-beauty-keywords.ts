/**
 * COMPREHENSIVE BEAUTY KEYWORDS - Category 14 (เครื่องสำอางและความงาม)
 * 
 * Structure: Organized by SUBCATEGORY ID
 */

export const BEAUTY_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 1401: MAKEUP / เครื่องสำอาง
    // ========================================
    1401: [
        // Face
        'รองพื้น', 'foundation', 'คุชชั่น', 'cushion',
        'แป้งพัฟ', 'powder', 'แป้งฝุ่น', 'loose powder',
        'คอนซีลเลอร์', 'concealer', 'ไพรเมอร์', 'primer',
        'บลัชออน', 'blush on', 'ปัดแก้ม',
        'ไฮไลท์', 'highlight', 'คอนทัวร์', 'contour', 'bronzer',
        'setting spray', 'สเปรย์ตรึงเครื่องสำอาง',

        // Eyes & Brows
        'อายแชโดว์', 'eyeshadow', 'พาเลทตา', 'eye palette',
        'อายไลเนอร์', 'eyeliner', 'มาสคาร่า', 'mascara',
        'ดินสอเขียนคิ้ว', 'eyebrow pencil', 'ที่เขียนคิ้ว',
        'เจลคิ้ว', 'brow gel',
        'ขนตาปลอม', 'false eyelashes', 'กาวติดขนตา',

        // Lips
        'ลิปสติก', 'lipstick', 'ลิปมัน', 'lip balm',
        'ลิปกลอส', 'lip gloss', 'ลิปทินท์', 'lip tint', 'ลิปแมท', 'matte lip',
        'ดินสอเขียนขอบปาก', 'lip liner',

        // Nails
        'ยาทาเล็บ', 'nail polish', 'เจลเล็บ', 'gel polish',
        'ลบเล็บ', 'nail polish remover',

        // Makeup Removal
        'น้ำยาเช็ดเมคอัพ', 'makeup remover', 'cleansing water',
        'คลีนซิ่งออยล์', 'cleansing oil', 'cleansing balm',

        // Brands
        'mac cosmetics', 'bobbi brown', 'nars', 'charlotte tilbury',
        'dior makeup', 'chanel makeup', 'ysl beauty', 'tom ford beauty',
        'maybelline', 'loreal', 'revlon', 'nyx',
        '3ce', 'rom&nd', 'etude house', 'laneige',
        'srichand', '4u2', 'mistine',
    ],

    // ========================================
    // 1402: SKINCARE / ผลิตภัณฑ์ดูแลผิว
    // ========================================
    1402: [
        // Types
        'ครีมบำรุง', 'face cream', 'moisturizer', 'มอยส์เจอไรเซอร์',
        'เซรั่ม', 'serum', 'เอสเซนส์', 'essence', 'น้ำตบ',
        'โทนเนอร์', 'toner', 'โลชั่น', 'lotion',
        'ครีมกันแดด', 'sunscreen', 'sunblock', 'spf',
        'โฟมล้างหน้า', 'cleanser', 'face wash', 'คลีนซิ่ง', 'cleansing',
        'มาร์คหน้า', 'mask', 'sleeping mask', 'sheet mask',
        'eye cream', 'อายครีม',
        'ลิปบาล์ม', 'lip treatment',

        // Active Ingredients
        'retinol', 'เรตินอล',
        'vitamin c', 'วิตามินซี',
        'hyaluronic acid', 'ไฮยาลูโรนิก',
        'niacinamide', 'ไนอะซินาไมด์',
        'aha', 'bha', 'กรดผลไม้',
        'peptide', 'เปปไทด์',
        'collagen', 'คอลลาเจน',

        // Concerns
        'รักษาสิว', 'acne', 'ลดรอยสิว', 'ฝ้ากระ', 'dark spot',
        'หน้าขาวใส', 'whitening', 'ลดริ้วรอย', 'anti-aging',
        'กระชับรูขุมขน', 'pore minimizer',
        'ผิวแพ้ง่าย', 'sensitive skin',

        // Brands
        'la mer', 'estee lauder', 'advanced night repair', 'anr',
        'lancome', 'genifique', 'sk-ii', 'skii', 'biotherm', 'plankton',
        'kiehl\'s', 'clinique', 'origins',
        'eucerin', 'laroche posay', 'vichy', 'cerave', 'bioderma',
        'sulwhasoo', 'history of whoo', 'innisfree',
        'mizumi', 'plantnery',
        'cosrx', 'some by mi', 'dear klairs',
    ],

    // ========================================
    // 1403: HAIRCARE / ผลิตภัณฑ์ดูแลผม
    // ========================================
    1403: [
        'แชมพู', 'shampoo', 'ยาสระผม', 'ครีมนวดผม', 'conditioner',
        'ทรีทเม้นท์', 'hair treatment', 'hair mask', 'หมักผม',
        'เซรั่มบำรุงผม', 'hair oil', 'ออยล์ใส่ผม',
        'ยาย้อมผม', 'hair color', 'โฟมเปลี่ยนสีผม',
        'แว็กซ์', 'hair wax', 'เจลแต่งผม', 'สเปรย์ฉีดผม',
        'dry shampoo', 'แชมพูแห้ง',
        'hair tonic', 'ยาปลูกผม',
        'วิตามินบำรุงผม', 'hair vitamins',
        'รักษาหนังหัว', 'scalp treatment',
        'kerastase', 'olaplex', 'loreal pro', 'schwarzkopf', 'daeng gi meo ri',
        'moroccanoil', 'argan oil',
    ],

    // ========================================
    // 1404: PERFUMES / น้ำหอม
    // ========================================
    1404: [
        'น้ำหอม', 'perfume', 'fragrance', 'cologne', 'โคโลญ',
        'edp', 'edt', 'eau de parfum', 'eau de toilette',
        'น้ำหอมผู้ชาย', 'น้ำหอมผู้หญิง', 'น้ำหอม unisex',
        'น้ำหอมแบ่งขาย', 'decant', 'vial',
        'น้ำหอมอาหรับ', 'oud', 'อูด',
        'body mist', 'บอดี้มิสท์',
        'niche perfume', 'designer perfume',

        // Brands
        'dior sauvage', 'miss dior', 'jadore',
        'chanel no 5', 'coco mademoiselle', 'bleu de chanel',
        'ysl libre', 'black opium', 'y eau de parfum',
        'creed', 'aventus', 'maison francis kurkdjian', 'mfk', 'baccarat rouge',
        'jo malone', 'english pear',
        'versace', 'eros', 'bright crystal',
        'chloe', 'burberry', 'her her',
        'ck one', 'ck be', 'davidoff cool water',
        'tom ford', 'tobacco vanille', 'oud wood',
    ],

    // ========================================
    // 1405: BODY CARE / ผลิตภัณฑ์บำรุงร่างกาย
    // ========================================
    1405: [
        'ครีมทาผิว', 'body lotion', 'โลชั่นทาตัว', 'body butter',
        'สบู่', 'soap', 'ครีมอาบน้ำ', 'shower gel', 'สบู่เหลว',
        'สครับผิว', 'body scrub', 'เกลือขัดผิว',
        'โรลออน', 'roll on', 'deodorant', 'ระงับกลิ่นกาย',
        'bath bomb', 'bath salt',
        'ครีมทามือ', 'hand cream',
        'ครีมทาเท้า', 'foot cream',
        'ครีมทาตัวขาว', 'whitening body lotion',
        'น้ำมันมะพร้าว', 'coconut oil', 'ว่านหางจระเข้', 'aloe vera gel',
        'vaseline', 'nivea', 'jergens', 'bhaesaj', 'เภสัช',
        'bath & body works', 'loccitane', 'the body shop',
    ],

    // ========================================
    // 1406: BEAUTY TOOLS / อุปกรณ์ความงาม
    // ========================================
    1406: [
        'ไดร์เป่าผม', 'hair dryer', 'dyson supersonic',
        'ที่หนีบผม', 'hair straightener', 'เครื่องรีดผม',
        'ที่ม้วนผม', 'curling iron', 'แกนมันผม',
        'แปรงแต่งหน้า', 'makeup brush', 'ฟองน้ำแต่งหน้า', 'beauty blender',
        'กระจกแต่งหน้า', 'makeup mirror', 'กระจกมีไฟ',
        'เครื่องล้างหน้า', 'foreo', 'cleansing brush',
        'เครื่องเลเซอร์', 'ipl', 'เครื่องกำจัดขน',
        'กัวซา', 'guasa', 'jade roller', 'โรลเลอร์หยก',
        'ที่ดัดขนตา', 'eyelash curler',
        'facial steamer', 'เครื่องนึ่งหน้า',
        'led mask', 'มาส์กไฟ led',
        'ที่หนีบแต่งเล็บ', 'nail clipper', 'กรรไกรตัดเล็บ',
    ],
}

// Combine all keywords for main category detection
export const COMPREHENSIVE_BEAUTY_KEYWORDS = Object.values(BEAUTY_SUBCATEGORY_KEYWORDS).flat()

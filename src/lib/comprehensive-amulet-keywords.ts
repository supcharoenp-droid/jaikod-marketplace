/**
 * COMPREHENSIVE AMULETS & COLLECTIBLES KEYWORDS - Category 9 (พระเครื่องและของสะสม)
 * 
 * Structure: Organized by SUBCATEGORY ID
 */

export const AMULET_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 901: THAI AMULETS / พระเครื่อง
    // ========================================
    901: [
        // Types - Main
        'พระเครื่อง', 'amulet', 'thai amulet', 'พระบูชา',
        'เหรียญคณาจารย์', 'เหรียญพระ', 'รูปหล่อ', 'กริ่ง',
        'พระผง', 'พระดินเผา',

        // Types - Specific Buddhas
        'พระสมเด็จ', 'phra somdej', 'สมเด็จวัดระฆัง', 'บางขุนพรหม',
        'พระปิดตา', 'phra pidta', 'ปิดตา 5 นิ้ว', 'ปิดตา 7 นิ้ว',
        'พระขุนแผน', 'khun paen', 'ขุนแผนชุบหนัง',
        'พระนาคปรก', 'naga prok', 'พระนาคปรก 7 เศียร', 'นาคปรก 5 เศียร',
        'พระพุทธชินราช', 'chinarat', 'พระชินราช',
        'พระเหนือพรหม', 'พระพุทธเจ้าเหนือพรหม',

        // Charms & Talismans
        'ตะกรุด', 'takrut', 'ตะกรุดทองแดง', 'ตะกรุดเงิน',
        'เบี้ยแก้', 'เครื่องราง', 'talisman',
        'ผ้ายันต์', 'yant', 'ยันต์', 'มีดหมอ',
        'ลูกอม', 'กริ่งพระ',

        // Popular Temples
        'วัดพระธาตุ', 'วัดใหญ่ชัยมงคล', 'วัดพระศรีรัตนศาสดาราม',
        'วัดไตรมิตร', 'วัดสุทัศน์', 'วัดโพธิ์', 'วัดอรุณ',
        'วัดมหาธาตุ', 'วัดพระแก้ว',
        'วัดระฆัง', 'วัดปากน้ำ', 'วัดบวรนิเวศ',

        // Famous Monks (Luang Phor) - Original
        'หลวงพ่อ', 'luang phor', 'lp',
        'หลวงปู่', 'luang pu',
        'หลวงพ่อรวย', 'lp ruay', 'วัดตะโก',
        'หลวงพ่อคูณ', 'lp koon', 'วัดบ้านไร่',
        'หลวงปู่ทวด', 'lp thuad', 'วัดช้างให้',
        'หลวงปู่โต๊ะ', 'lp toh', 'วัดประดู่ฉิมพลี',
        'หลวงพ่อโสธร', 'lp sothorn',
        'หลวงปู่ศุข', 'วัดปากคลองมะขามเฒ่า',
        'หลวงพ่อเดิม', 'วัดหนองโพ',
        'หลวงพ่อกวย', 'วัดโฆสิตาราม',

        // Famous Monks (More)
        'สมเด็จโต', 'somdej toh', 'พระสมเด็จโต',
        'สมเด็จพระญาณสังวร', 'somdet phra yan sangwon',
        'หลวงพ่อปาน', 'วัดบางนมโค',
        'หลวงปู่มั่น', 'luang pu mun', 'หลวงปู่ดู่',
        'หลวงพ่อชา', 'หลวงพ่อจรัญ',
        'หลวงพ่อเปิ่น', 'วัดบางพระ',
        'หลวงพ่อพระมหาสุรศักดิ์', 'วัดประดู่',

        // Deities
        'ท้าวเวสสุวรรณ', 'thao wessuwan', 'วัดจุฬามณี',
        'ไอ้ไข่', 'ai khai', 'วัดเจดีย์',
        'ท้าวมหาพรหม', 'พระพิฆเนศ', 'ganesh',

        // Materials (เนื้อ)
        'เนื้อเงิน', 'เนื้อทองแดง', 'เนื้อนวโลหะ',
        'เนื้อสำริด', 'เนื้อชินเงิน', 'เนื้อว่าน',
        'เนื้อดิน', 'เนื้อผง', 'เนื้อชมพู', 'เนื้อโลหะ',

        // Age & Period
        'พระเก่า', 'พระโบราณ', 'old amulet',
        'พุทธศตวรรษ', 'พ.ศ.', 'century',
        'สมัยอยุธยา', 'ayutthaya period',
        'สมัยรัตนโกสินทร์', 'rattanakosin period',
        'พระใหม่', 'พระร่วมสมัย', 'modern amulet',

        // Certifications & Authentication
        'ตรากรมศิลปากร', 'ศิลปากร', 'fine arts department',
        'สมาคมพระเครื่อง', 'amulet association',
        'มีบัตรประกัน', 'certificate', 'certified',
        'รับประกันแท้', 'พระแท้', 'authentic',
        'พร้อมบัตรรับรอง', 'มีใบเซอร์',

        // Purposes & Beliefs (คุณสมบัติ)
        'มหาลาภ', 'wealth', 'fortune',
        'เมตตา', 'metta', 'loving kindness',
        'มหานิยม', 'popularity', 'charisma',
        'มหาเสน่ห์', 'attraction', 'charm',
        'คงกระพัน', 'invulnerability', 'protection',
        'กันภัย', 'safety', 'โชคลาภ', 'good luck',

        // Frames & Cases
        'เลี่ยมทอง', 'gold frame', 'เลี่ยมเงิน', 'silver frame',
        'กรอบพระ', 'amulet frame', 'ตลับพระ', 'amulet case',

        // Thai Amulet Terms
        'พระแท้พุทธคุณ', 'พระยอดนิยม', 'popular amulet',
        'พระหายาก', 'rare amulet', 'พระดัง', 'famous amulet',
    ],

    // ========================================
    // 902: COINS / เหรียญกษาปณ์
    // ========================================
    902: [
        // Types
        'เหรียญ', 'coin', 'เหรียญกษาปณ์', 'เหรียญที่ระลึก',
        'เหรียญเก่า', 'old coin', 'เหรียญสะสม', 'collectible coin',

        // Thai Coins - Denominations
        'เหรียญ 10 บาท', 'เหรียญ 10 บาท ปี 2533',
        'เหรียญบาท', 'เหรียญ 5 บาท', 'เหรียญ 2 บาท',
        'สตางค์', 'เหรียญ 25 สตางค์', 'เหรียญ 50 สตางค์',

        // Thai Coins - Special
        'ครุฑ', 'เหรียญครุฑ', 'พญาครุฑ', 'garuda',
        'เหรียญเงิน', 'silver coin', 'เหรียญทองคำ', 'gold coin',

        // Royal Coins
        'เหรียญในหลวง', 'เหรียญร.9', 'เหรียญร.10', 'เหรียญร.5',
        'เสด็จเตี่ย', 'royal visit coin',
        'เหรียญพระชนมพรรษา', 'birthday coin',
        'เหรียญกาญจนาภิเษก', '50 ปี ครองราชย์',
        'เหรียญสุขลาภ', 'royalamulet',

        // Specific Years
        'ปี 2500', 'ปี 2515', 'ปี 2520', 'ปี 2533', 'ปี 2560',
        'พ.ศ. 2500', 'พ.ศ. 2533',

        // Coin Grading
        'ms', 'ms65', 'ms70', 'ms63',
        'proof', 'proof coin', 'mirror finish',
        'uncirculated', 'unc', 'ยังไม่ใช้', 'ยังไม่ผ่านการใช้',
        'extremely fine', 'ef', 'very fine', 'vf',
        'grading', 'เกรดเหรียญ', 'coin grading',

        // Foreign Coins
        'foreign coin', 'เหรียญต่างประเทศ',
        'dollar coin', 'us dollar', 'american coin',
        'pound coin', 'british coin',
        'euro coin', 'european coin',
        'yen coin', 'japanese coin',
        'yuan', 'chinese coin',
        'ancient coins', 'เหรียญโรมัน', 'roman coin',

        // Coin Conditions
        'เหรียญสวย', 'เหรียญสภาพดี', 'beautiful coin',
        'เหรียญเดิม', 'mint condition', 'original',
        'toning', 'patina', 'oxidation',

        // Thai Coin Terms
        'เหรียญหายาก', 'rare coin', 'เหรียญเก่าแก่',
        'เหรียญสต๊อก', 'เหรียญของแท้', 'authentic coin',
    ],

    // ========================================
    // 903: BANKNOTES / ธนบัตรเก่า
    // ========================================
    903: [
        // Types
        'ธนบัตร', 'banknote', 'แบงค์', 'paper money',
        'ธนบัตรเก่า', 'old banknote', 'ธนบัตรสะสม', 'collectible banknote',
        'ธนบัตรที่ระลึก', 'commemorative banknote',

        // Banknote Types
        'ธนบัตรพิมพ์ครั้งแรก', 'first print', 'first series',
        'ธนบัตรแทน', 'replacement note', 'star note',
        'ธนบัตรชุด', 'series', 'set', 'banknote set',
        'พันธบัตร', 'bond',

        // Denominations
        'แบงค์ 10', 'แบงค์ 20', 'แบงค์ 50', 'แบงค์ 100', 'แบงค์ 500', 'แบงค์ 1000',
        'ธนบัตร 10 บาท', 'ธนบัตร 20 บาท',

        // Lucky Numbers
        'เลขสวย', 'เลขมงคล', 'lucky number',
        'เลขตอง', 'solid number', 'เลขเรียง', 'sequential number',
        '9 หน้า 9 หลัง', 'all 9s',

        // Serial Number Types
        'เลขราดาร์', 'radar note', 'palindrome',
        'เลขซ้ำ', 'repeater note',
        'เลขสลับ', 'rotator note',

        // Prefix & Suffix
        'prefix', 'คำนำหน้า', 'prefix number',
        'เล่มที่ 1', 'ชุดที่ 1', 'first series',
        'เลขหัว', 'เลขท้าย',

        // Royal Series
        'แบงค์ร.9', 'แบงค์ร.10', 'แบงค์ร.8', 'แบงค์ร.5',

        // Historical Series
        'แบงค์ Type 1', 'Type 2', 'Type 3',
        'สมัยร.5', 'สมัยร.6', 'สมัยร.7', 'สมัยร.8',

        // Signatures
        'ลายเซ็น', 'signature', 'ลายมือ',
        'ชุดนายกรัฐมนตรี', 'pm signature',
        'ผวธ', 'ผู้ว่าการธนาคาร',

        // Grading & Conditions
        'unc', 'uncirculated', 'ยังไม่ผ่านการใช้', 'สภาพใหม่',
        'aunc', 'about uncirculated',
        'pmg', 'pcgs banknote', 'grading',
        'เกรดธนบัตร', 'banknote grading',
        'pmg 65', 'pmg 66', 'pmg 67', 'gem unc',

        // Foreign Banknotes
        'foreign currency', 'เงินต่างประเทศ',
        'dollar bill', 'us dollar bill',
        'pound note', 'british pound',

        // Thai Banknote Terms
        'ธนบัตรหายาก', 'rare banknote',
        'ธนบัตรสภาพสะสม', 'collector condition',
        'ธนบัตรแท้', 'authenticated', 'genuine banknote',
    ],

    // ========================================
    // 904: ANTIQUES / ของเก่า/โบราณ
    // ========================================
    904: [
        // General
        'ของเก่า', 'antique', 'ของโบราณ', 'vintage item',
        'collectible', 'ของสะสม', 'retro', 'mid-century',

        // Ceramics & Porcelain
        'เครื่องลายคราม', 'ceramics', 'porcelain', 'china',
        'เบญจรงค์', 'benjarong', 'five-color ware',
        'แจกันเก่า', 'antique vase', 'ถ้วยชาม', 'สังคโลก', 'sangkhalok',

        // Furniture - Chinese
        'furniture', 'เฟอร์นิเจอร์เก่า', 'antique furniture',
        'โต๊ะจีน', 'chinese table', 'ตู้จีน', 'chinese cabinet',
        'เก้าอี้โบราณ', 'antique chair', 'โซฟาเก่า', 'vintage sofa',

        // Furniture - Thai
        'ไม้สักเก่า', 'teak wood', 'teak furniture',
        'ตะแกรงไม้สัก', 'teak cabinet', 'wooden cabinet',

        // Chinese Antiques
        'ของโบราณจีน', 'chinese antique',
        'jade', 'หยก', 'jade carving', 'nephrite',
        'cloisonne', 'เครื่องถม', 'enamel',

        // Clocks & Watches
        'นาฬิกาโบราณ', 'antique clock', 'vintage clock',
        'grandfather clock', 'นาฬิกาตั้งพื้น',
        'นาฬิกาไขลาน', 'wind-up clock', 'pendulum clock',

        // Collectible Items
        'ขวดโบราณ', 'antique bottle', 'vintage bottle',
        'โปสเตอร์เก่า', 'vintage poster', 'old poster',
        'ปฏิทินเก่า', 'old calendar', 'vintage calendar',
        'ตำราเก่า', 'old book', 'antique book',

        // Tools& Equipment
        'เครื่องมือช่างโบราณ', 'antique tools',
        'จักรเย็บผ้าโบราณ', 'antique sewing machine', 'singer',
        'เครื่องพิมพ์ดีดโบราณ', 'typewriter', 'vintage typewriter',
        'ตะเกียงโบราณ', 'antique lantern', 'oil lamp',
        'เตารีดโบราณ', 'antique iron', 'charcoal iron',
        'พัดลมโบราณ', 'antique fan', 'vintage fan',

        // Decorative Items
        'กระจกโบราณ', 'antique mirror', 'vintage mirror',
        'โคมไฟโบราณ', 'antique lamp', 'vintage lamp',
        'ภาพวาดเก่า', 'old painting', 'antique painting',

        // Vintage Electronics
        'วิทยุโบราณ', 'antique radio', 'vintage radio',
        'โทรศัพท์โบราณ', 'antique telephone', 'rotary phone',
        'กล้องเก่า', 'vintage camera', 'film camera',

        // Records & Music
        'แผ่นเสียง', 'vinyl record', 'lp record',
        'เครื่องเล่นแผ่นเสียง', 'record player', 'turntable', 'gramophone',

        // Thai Antiques
        'พานบายศรี', 'ขันโลหะ', 'metal bowl',
        'หีบไม้สัก', 'teak chest', 'หีบสมุด', 'document chest',
        'เครื่องราชูปโภค', 'royal utensils',

        // Conditions & Terms
        'ของแท้', 'original', 'authentic', 'genuine',
        'สภาพดี', 'good condition', 'มีรอยเก่า', 'signs of age',
        'ราคาสะสม', 'collector value', 'collector price',
        'vintage', 'retro', 'antique value',
    ],

    // ========================================
    // 905: ART TOYS / กล่องสุ่ม
    // ========================================
    905: [
        // Brands/Series - Main
        'art toy', 'อาร์ตทอย', 'blind box', 'กล่องสุ่ม', 'กล่องจุ่ม',

        // Pop Mart
        'pop mart', 'ป็อปมาร์ท',
        'labubu', 'ลาบูบู้', 'the monsters', 'macaron',
        'crybaby', 'ครายเบบี้', 'cry baby',
        'molly', 'มอลลี่', 'mega space molly',
        'hirono', 'ฮิโรโนะ',
        'dimoo', 'skullpanda', 'pucky', 'sweet bean',
        'zsiga', 'zimomo', 'hacipupu',
        'azura', 'little sank',
        'the monsters halloween', 'christmas series',

        // Sonny Angel
        'sonny angel', 'ซันนี่แองเจิล',
        'sonny angel mini figure', 'sonny angel series',

        // Bearbrick & Designer Toys
        'bearbrick', 'be@rbrick', 'แบร์บริค',
        '100%', '200%', '400%', '1000%',
        'kaws', 'kaws companion', 'mighty jaxx',

        // Premium Designer Toys
        'hot toys', 'ฮอตทอยส์', 'hot toys 1/6',
        'medicom toy', 'medcom', 'medicom bearbrick',
        'cosbaby', 'โคสเบบี้',

        // Scale Figures
        '1/6 scale', '1/12 scale', '1/4 scale',
        'premium figure', 'scale figure',
        'posable figure', 'articulated figure',

        // Funko & Gachapon
        'funko pop', 'ฟันโกะ', 'funko',
        'gachapon', 'กาชาปอง', 'gashapon',

        // Figure Types
        'figure', 'ฟิกเกอร์', 'โมเดล', 'model',
        'nendoroid', 'nendo', 'ด๋อย', 'chibi figure',
        'figma', 'ฟิกม่า',

        // Collectible Sizes
        'chibi', 'mini figure', 'mega figure',
        'giant size', 'xxl figure',

        // Collection Series
        'complete set', 'ครบเซ็ต', 'full set',
        'series 1', 'series 2', 'series 3',
        'limited edition', 'จำกัดจำนวน',
        'chase', 'chase figure', 'secret', 'hidden figure',

        // Figure Conditions
        'mint in box', 'mib', 'nib', 'new in box',
        'sealed', 'ยังไม่แกะ', 'unopened',
        'figure มือสอง', 'ฟิกเกอร์มือ1', 'ฟิกเกอร์มือสอง',

        // Anime Figures - Popular
        'anime figure', 'ฟิกเกอร์อนิเมะ',
        'วันพีซ', 'one piece', 'luffy', 'zoro',
        'dragon ball', 'dragonball', 'goku',
        'naruto', 'demon slayer', 'kimetsu no yaiba',
        'jujutsu kaisen', 'jjk', 'yuji', 'gojo',
        'spy x family', 'anya', 'loid',
        'pokemon', 'pikachu', 'pokémon figure',
        'studio ghibli', 'totoro', 'spirited away',

        // Gundam & Model Kits
        'gundam', 'กันดั้ม', 'gunpla', 'กันพลา',
        'high grade', 'hg', 'master grade', 'mg',
        'perfect grade', 'pg', 'real grade', 'rg',
        'model kit', 'โมเดลประกอบ', 'plastic model',

        // Thai Art Toy Terms
        'ฟิกเกอร์สะสม', 'โมเดลสะสม',
        'ของสะสม', 'collectible toy', 'toy collection',
    ],
}

// Combine all keywords for main category detection
export const COMPREHENSIVE_AMULET_KEYWORDS = Object.values(AMULET_SUBCATEGORY_KEYWORDS).flat()

/**
 * Comprehensive Mobile & Tablet Keywords (Supercharged Edition)
 * Category 3: มือถือและแท็บเล็ต
 * 
 * Includes detailed models, niche brands, technical specs, repair terms,
 * and specific accessory types for maximum AI precision.
 */

export const MOBILE_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 301: โทรศัพท์มือถือ / Mobile Phones
    // ========================================
    301: [
        // Generic & Market Terms (Thai/English)
        'มือถือ', 'โทรศัพท์', 'โทรศัพท์มือถือ', 'สมาร์ทโฟน', 'smartphone', 'mobile phone',
        'cellphone', 'feature phone', 'ปุ่มกด', '2g', '3g', '4g', '5g',
        'android', 'แอนดรอยด์', 'ios', 'harmony os',
        'มือถือมือสอง', 'มือถือมือ2', 'used phone', 'second hand',
        'เครื่องศูนย์', 'เครื่องไทย', 'เครื่อง th', 'ประกันศูนย์',
        'เครื่องนอก', 'เครื่องหิ้ว', 'cn rom', 'global rom', 'เครื่อง ll',
        'หลุดจำนำ', 'เครื่องเปล่า', 'ไม่ติดสัญญา', 'unlocked',
        'เครื่องรีเฟอร์', 'refurbished', 'เครื่องเคลม', 'replacement unit',
        'มือถือเกมมิ่ง', 'gaming phone', 'esports',
        'เครื่องโชว์', 'demo unit', 'ตัวโชว์', 'สภาพนางฟ้า', 'สภาพ 99%',

        // Apple iPhone (Detailed)
        'iphone', 'ไอโฟน', 'apple', 'แอปเปิ้ล',
        // 15 Series
        'iphone 15', 'iphone 15 pro', 'iphone 15 pro max', 'iphone 15 plus', '15pm',
        // 14 Series
        'iphone 14', 'iphone 14 pro', 'iphone 14 pro max', 'iphone 14 plus', '14pm',
        // 13 Series
        'iphone 13', 'iphone 13 pro', 'iphone 13 pro max', 'iphone 13 mini',
        // 12 Series
        'iphone 12', 'iphone 12 pro', 'iphone 12 pro max', 'iphone 12 mini',
        // 11 Series
        'iphone 11', 'iphone 11 pro', 'iphone 11 pro max',
        // Older Gens
        'iphone x', 'iphone xs', 'iphone xs max', 'iphone xr',
        'iphone 8', 'iphone 8 plus', 'iphone 7', 'iphone 7 plus',
        'iphone 6s', 'iphone 6', 'iphone se', 'iphone se2', 'iphone se3', 'se 2020', 'se 2022',

        // Samsung Galaxy (Detailed)
        'samsung', 'ซัมซุง', 'galaxy', 'กาแลคซี่',
        // S Series
        's24', 's24 ultra', 's24+', 's24 plus',
        's23', 's23 ultra', 's23+', 's23 fe',
        's22', 's22 ultra', 's22+',
        's21', 's21 ultra', 's21 fe', 's20', 's20 fe', 's10', 's10+',
        // Note Series
        'note 20', 'note 20 ultra', 'note 10', 'note 10+', 'note 9', 'note 8',
        // Z Series (Foldables)
        'z fold', 'z flip', 'fold 6', 'flip 6', 'fold 5', 'flip 5', 'fold 4', 'flip 4', 'fold 3', 'flip 3',
        // A & M Series (Mid-range)
        'galaxy a55', 'a54', 'a53', 'a73', 'a35', 'a34', 'a25', 'a15', 'a05', 'a05s',
        'galaxy m54', 'm34', 'm14', 'galaxy f',

        // Xiaomi / Redmi / POCO
        'xiaomi', 'เสียวหมี่', 'mi', 'mi 14', 'mi 14 ultra', 'mi 13', 'mi 13t', 'mi 13t pro',
        'mi 12', 'mi 11', 'mi 10',
        'redmi', 'redmi note 13', 'note 13 pro', 'note 13 pro+', 'redmi 13c', 'redmi 12',
        'redmi k70', 'redmi k60', 'redmi k50',
        'poco', 'pocophone', 'poco f6', 'poco f5', 'poco f5 pro', 'poco x6', 'poco x6 pro',
        'poco m6', 'poco c65',

        // OPPO / OnePlus
        'oppo', 'ออปโป้',
        'find x7', 'find x7 ultra', 'find x6', 'find n3', 'find n3 flip',
        'reno 11', 'reno 11 pro', 'reno 11f', 'reno 10', 'reno 8',
        'oppo a79', 'a78', 'a58', 'a38', 'a18',
        'oneplus', 'วันพลัส', 'oneplus 12', 'oneplus 11', 'oneplus 10 pro',
        'oneplus nord', 'nord 3', 'nord ce',

        // Vivo / iQOO
        'vivo', 'วีโว่',
        'xi00', 'x100 pro', 'x90', 'x80',
        'v30', 'v30 pro', 'v29', 'v27', 'v25',
        'y100', 'y36', 'y27', 'y17s', 'y02',
        'iqoo', 'iqoo 12', 'iqoo 11', 'iqoo z9', 'iqoo z7', 'iqoo neo',

        // Realme
        'realme', 'เรียลมี',
        'realme 12', 'realme 12 pro+', 'realme 11', 'realme 10',
        'realme gt5', 'realme gt neo 3', 'realme c67', 'realme c55', 'realme c53', 'narzo',

        // Honor / Huawei
        'huawei', 'หัวเว่ย', 'mate 60', 'mate 50', 'p60', 'p50', 'nova 11', 'nova 12',
        'honor', 'ออเนอร์', 'honor magic 6', 'magic 5', 'honor 90', 'honor 70', 'honor x9b', 'honor x8b',

        // Gaming Brands
        'rog phone', 'rog 8', 'rog 7', 'rog 6', 'asus rog',
        'redmagic', 'red magic 9 pro', 'red magic 8s', 'nubia',
        'black shark', 'black shark 5', 'lenovo legion',

        // Niche / Budget / Retro / Other Brands
        'google pixel', 'pixel 8', 'pixel 8 pro', 'pixel 7', 'pixel 6', 'pixel fold',
        'sony', 'xperia', 'xperia 1', 'xperia 5', 'xperia 10',
        'infinix', 'อินฟินิกซ์', 'hot 40', 'note 40', 'zero 30', 'gt 10 pro',
        'tecno', 'tecno pova', 'tecno camon', 'tecno spark',
        'itel', 'itel p55', 'itel s23',
        'benco', 'zte', 'blade', 'nubia neo',
        'motorola', 'moto g', 'razr 40', 'edge 40',
        'nokia', 'โนเกีย', 'nokia 3310', 'vertu', 'blackberry',

        // Specs Keywords
        'rom 128', 'rom 256', 'rom 512', '1tb', 'ram 8', 'ram 12', 'ram 16', 'ram 24',
        'snapdragon 8 gen 3', 'snapdragon 8 gen 2', 'dimensity 9300', 'dimensity 8300',
        'kirin 9000s', 'exynos 2400', 'bionic a17', 'a16 bionic',
        'จอ 120hz', 'จอ 144hz', 'ltpo', 'oled', 'amoled',
        'ชาร์จไว', 'fast charge', 'type-c', 'ไทป์ซี',

        // Storage (MORE SPECIFIC - NEW!)
        '64gb', '128gb', '256gb', '512gb', '1tb storage',
        'ความจุ 64', 'ความจุ 128', 'ความจุ 256', 'ความจุ 512', 'ความจุ 1tb',

        // Colors (NEW!)
        'สีดำ', 'สีขาว', 'สีทอง', 'สีเงิน', 'สีม่วง', 'สีชมพู', 'สีแดง', 'สีเขียว',
        'black', 'white', 'gold', 'silver', 'purple', 'pink', 'red', 'green', 'blue',
        'midnight', 'starlight', 'sierra blue', 'alpine green', 'graphite',
        'titanium', 'natural titanium', 'blue titanium', 'black titanium',
        'phantom black', 'cream', 'lavender', 'mint',

        // Price Ranges (NEW!)
        'มือถือ 3,000', 'มือถือ 5,000', 'มือถือ 7,000', 'มือถือ 10,000',
        'มือถือ 15,000', 'มือถือ 20,000', 'มือถือ 30,000', 'มือถือ 40,000',
        'มือถือ 50,000', 'มือถือ 60,000', 'มือถือราคาถูก', 'มือถือราคาประหยัด',
        'budget phone', 'affordable phone', 'mid-range phone', 'flagship phone',
        'phone under 10000', 'phone under 20000', 'phone under 30000',

        // Conditions (MORE SPECIFIC - NEW!)
        'สภา พดี', 'สภาพดีมาก', 'สภาพเหมือนใหม่', 'mint condition', 'like new',
        'excellent condition', 'ครบกล่อง', 'full box', 'มีกล่อง',
        'ไม่บุบไม่บี๋', 'ไม่เคยตกน้ำ', 'ไม่มีรอย', 'no scratch',
        'แกะกล่อง', 'unboxed', 'ยกกล่อง',

        // Carriers / Contracts (NEW!)
        'ais contract', 'true contract', 'dtac contract',
        'ผ่อน 0%', 'ผ่อนดอกเบี้ย 0', 'installment', 'ผ่อนชำระ',
        'แลกเปลี่ยน', 'trade-in', 'รับซื้อมือถือ', 'ขายมือถือ',

        // Shop Names (NEW!)
        'mbk', 'เอ็มบีเค', 'มาบุญครอง',
        'pantip', 'พันทิพย์', 'ซีคอน',
        'fortune', 'ฟอร์จูน', 'เซ็นทรัล',
        'studio7', 'สตูดิโอ7', 'banana',
        'jaymart', 'เจมาร์ท', 'itcity', 'ไอทีซิตี้',
        'advice', 'แอดไวซ์', 'powerbuy', 'เพาเวอร์บาย',
        'คอม7', 'com7', 'ตลาดมือถือ',

        // Bangkok Locations (NEW!)
        'มือถือ mbk', 'มือถือพันทิพย์', 'มือถือฟอร์จูน',
        'มือถือกรุงเทพ', 'มือถือบางกอก', 'phone bangkok',
        'มือถือสุขุมวิท', 'มือถือสยาม', 'มือถือสาทร',
    ],

    // ========================================
    // 302: แท็บเล็ต / Tablets
    // ========================================
    302: [
        // Generic
        'แท็บเล็ต', 'tablet', 'ไอแพด', 'ipad', 'tab', 'pad', 'android tablet',
        'แท็บเล็ตมือสอง', 'used tablet', 'แท็บเล็ตมือ2',

        // Apple iPad (Detailed)
        'ipad pro 12.9', 'ipad pro 11', 'ipad pro m2', 'ipad pro m1', 'ipad pro m4',
        'ipad air 5', 'ipad air 4', 'ipad air 6', 'ipad air m2',
        'ipad mini 6', 'ipad mini 5', 'ipad mini 7',
        'ipad gen 10', 'ipad gen 9', 'ipad gen 8', 'ipad 10.2', 'ipad 10.9',

        // iPad Storage & Connectivity (NEW!)
        'ipad 64gb', 'ipad 128gb', 'ipad 256gb', 'ipad 512gb', 'ipad 1tb', 'ipad 2tb',
        'ipad wifi', 'ipad cellular', 'ipad wifi+cellular', 'ipad 5g',
        'ipad เครื่องศูนย์', 'ipad เครื่องนอก', 'ipad th', 'ipad ll',

        // iPad Colors (NEW!)
        'ipad space gray', 'ipad silver', 'ipad gold', 'ipad rose gold',
        'ipad starlight', 'ipad midnight', 'ipad pink', 'ipad blue', 'ipad purple',
        'ไอแพดสีเทา', 'ไอแพดสีเงิน', 'ไอแพดสีทอง', 'ไอแพดสีชมพู',

        // Samsung Galaxy Tab
        'galaxy tab s9', 'tab s9 ultra', 'tab s9+', 'tab s9 fe', 'tab s9 fe+',
        'galaxy tab s8', 'tab s8 ultra', 'tab s8+',
        'galaxy tab s7', 'tab s7+', 'tab s7 fe', 'tab s6 lite',
        'galaxy tab a9', 'tab a9+', 'tab a8', 'tab a7 lite',
        'tab active', 'tab active 5',

        // Galaxy Tab Storage (NEW!)
        'tab 128gb', 'tab 256gb', 'tab 512gb',
        'tab wifi', 'tab 5g', 'tab lte',

        // Xiaomi / Redmi Pad
        'xiaomi pad 6', 'xiaomi pad 6 pro', 'xiaomi pad 5', 'xiaomi pad 5 pro',
        'redmi pad', 'redmi pad se', 'redmi pad pro',

        // Huawei MatePad
        'matepad pro', 'matepad 11.5', 'matepad air', 'matepad se', 'matepad paper',
        'matepad 11', 'matepad 10.4',

        // Other Tablets
        'lenovo tab', 'lenovo p12', 'lenovo p11', 'lenovo p11 pro', 'legion y700',
        'oppo pad', 'oppo pad air', 'oppo pad neo', 'pad air 2',
        'realme pad', 'realme pad mini', 'realme pad x',
        'honor pad', 'honor pad 8', 'honor pad 9',
        'microsoft surface', 'surface pro 9', 'surface pro 8', 'surface pro 7', 'surface go',
        'dtac tab', 'ais tab',

        // Screen Sizes (NEW!)
        'แท็บเล็ต 8 นิ้ว', 'แท็บเล็ต 10 นิ้ว', 'แท็บเล็ต 11 นิ้ว', 'แท็บเล็ต 12 นิ้ว',
        'tablet 8 inch', 'tablet 10 inch', 'tablet 11 inch', 'tablet 12.9 inch',
        'จอใหญ่', 'large screen', 'จอเล็ก', 'compact',

        // Use Cases (NEW!)
        'แท็บเล็ตวาดรูป', 'drawing tablet', 'drawing pad',
        'แท็บเล็ตทำงาน', 'productivity tablet', 'work tablet',
        'แท็บเล็ตเล่นเกม', 'gaming tablet',
        'แท็บเล็ตเด็ก', 'kids tablet', 'แท็บเล็ตเด็กเล็ก',
        'แท็บเล็ตดูหนัง', 'entertainment tablet', 'media tablet',
        'แท็บเล็ตอ่านหนังสือ', 'reading tablet', 'e-reader',
        'แท็บเล็ตเรียนออนไลน์', 'online learning', 'study tablet',

        // Price Ranges (NEW!)
        'แท็บเล็ต 3,000', 'แท็บเล็ต 5,000', 'แท็บเล็ต 10,000', 'แท็บเล็ต 15,000',
        'แท็บเล็ต 20,000', 'แท็บเล็ต 30,000', 'แท็บเล็ต 40,000', 'แท็บเล็ต 50,000',
        'แท็บเล็ตราคาถูก', 'budget tablet', 'affordable tablet',
        'แท็บเล็ตระดับกลาง', 'mid-range tablet',
        'แท็บเล็ตระดับเรือธง', 'flagship tablet', 'premium tablet',
        'tablet under 10000', 'tablet under 20000',

        // Accessories (specific to tablets)
        'apple pencil 1', 'apple pencil 2', 'apple pencil usb-c',
        's pen', 's pen fold', 's pen pro',
        'magic keyboard', 'smart keyboard', 'keyboard folio',
        'smart folio', 'smart cover', 'book cover',
        'ฟิล์มแท็บเล็ต', 'tablet screen protector', 'tempered glass tablet',
        'ปากกาแท็บเล็ต', 'tablet stylus', 'stylus pen',

        // Conditions (NEW!)
        'แท็บเล็ตมือ1', 'brand new tablet', 'ของใหม่',
        'สภาพดี', 'excellent condition', 'like new',
        'เครื่องศูนย์ไทย', 'ประกันศูนย์', 'warranty',
    ],

    // ========================================
    // 303: อุปกรณ์สวมใส่ / Wearables
    // ========================================
    303: [
        // Smartwatch Generic
        'smartwatch', 'สมาร์ทวอทช์', 'นาฬิกาอัจฉริยะ', 'นาฬิกาออกกำลังกาย',
        'fitness tracker', 'band', 'สายรัดข้อมือ', 'นาฬิกาจับชีพจร',

        // Apple Watch
        'apple watch', 'apple watch ultra', 'ultra 2',
        'series 9', 'series 8', 'series 7', 'series 6', 'series 5', 'series 4',
        'apple watch se', 'watch os',

        // Galaxy Watch
        'galaxy watch 6', 'galaxy watch 6 classic',
        'galaxy watch 5', 'galaxy watch 5 pro',
        'galaxy watch 4', 'galaxy fit 3',

        // Garmin (Detailed)
        'garmin', 'การ์มิน',
        'forerunner 965', 'forerunner 265', 'forerunner 55', 'forerunner 165',
        'fenix 7', 'fenix 7 pro', 'epix pro', 'venu 3', 'venu sq 2',
        'instinct 2', 'instinct crossover', 'lily', 'vivomove',

        // Other Brands
        'suunto', 'suunto race', 'suunto vertical',
        'coros', 'coros pace 3', 'coros vertix',
        'fitbit', 'charge 6', 'inspire 3', 'amazfit', 'balance', 'gtr', 'gts', 't-rex',
        'mi band 8', 'mi band 8 pro', 'mi band 9',
        'huawei watch gt 4', 'huawei watch fit 3', 'honor band',
        'kieslect', 'imilab', 'haylou', 'cmf watch',

        // Price Ranges (NEW!)
        'smartwatch 2,000', 'smartwatch 3,000', 'smartwatch 5,000', 'smartwatch 10,000',
        'smartwatch 15,000', 'smartwatch 20,000', 'smartwatch 30,000',
        'นาฬิการาคาถูก', 'budget smartwatch', 'affordable smartwatch',
        'นาฬิการาคากลาง', 'mid-range smartwatch',
        'นาฬิการะดับเรือธง', 'premium smartwatch', 'flagship smartwatch',

        // Band Materials & Sizes (NEW!)
        'สายซิลิโคน', 'silicone band', 'สายหนัง', 'leather band', 'leather strap',
        'สายโลหะ', 'metal band', 'stainless steel band', 'สายสแตนเลส',
        'สายไนล่อน', 'nylon band', 'nylon strap', 'สายผ้า',
        'สายยาง', 'rubber band', 'sport band', 'สายกีฬา',
        '40mm', '41mm', '44mm', '45mm', '46mm', '49mm',
        'ขนาด 40', 'ขนาด 44', 'ขนาด 45', 'ขนาด 49',

        // Features (NEW!)
        'gps', 'cellular', 'lte', '4g', '5g', 'esim',
        'ecg', 'วัดหัวใจ', 'heart rate', 'จับชีพจร',
        'blood oxygen', 'วัดออกซิเจน', 'spo2', 'วัดความอิ่มตัวออกซิเจน',
        'sleep tracking', 'ติดตามการนอนหลับ', 'วิเคราะห์การนอน',
        'waterproof', 'กันน้ำ', 'ว่ายน้ำได้', 'ดำน้ำได้', 'atm', '5atm', '10atm',
        'always on display', 'aod', 'จอเปิดตลอด',
        'voice assistant', 'siri', 'google assistant', 'alexa',

        // Use Cases (NEW!)
        'นาฬิกาวิ่ง', 'running watch', 'นาฬิกาออกกำลังกาย', 'fitness watch',
        'นาฬิกาว่ายน้ำ', 'swimming watch', 'triathlon watch',
        'นาฬิกาปีนเขา', 'hiking watch', 'outdoor watch', 'นาฬิกาเดินป่า',
        'นาฬิกากอล์ฟ', 'golf watch', 'นาฬิกาวัดระยะกอล์ฟ',
        'นาฬิกาปั่นจักรยาน', 'cycling watch', 'bike computer',
        'นาฬิกาไดฟ์', 'dive watch', 'diving computer',
    ],

    // ========================================
    // 304: อุปกรณ์เสริมมือถือ / Mobile Accessories
    // ========================================
    304: [
        // Earphones / Headphones (NEW! - CRITICAL ADDITION)
        'หูฟัง', 'earphones', 'headphones', 'earbuds', 'หูฟังบลูทูธ', 'bluetooth earphones',
        'หูฟังไร้สาย', 'wireless earphones', 'true wireless', 'tws',
        'หูฟังมีสาย', 'wired earphones',

        // Apple AirPods
        'airpods', 'airpods pro', 'airpods pro 2', 'airpods max',
        'airpods gen 3', 'airpods gen 2', 'airpods 3', 'airpods 2',
        'แอร์พอด', 'แอร์พอดโปร',

        // Samsung Galaxy Buds
        'galaxy buds', 'buds pro', 'buds 2 pro', 'buds 2', 'buds pro 2',
        'buds fe', 'buds live', 'buds plus', 'buds+',

        // Sony
        'sony wf-1000xm5', 'wf-1000xm4', 'linkbuds s', 'linkbuds',
        'sony wh-1000xm5', 'wh-1000xm4', 'whch720n',

        // Xiaomi / Redmi
        'xiaomi buds 5', 'xiaomi buds 4', 'xiaomi buds 4 pro', 'redmi buds 5',
        'redmi buds  4 pro', 'redmi buds 3', 'redmi buds 4 lite',
        'airdots', 'mi true wireless',

        // Other Major Brands
        'oppo enco', 'enco air 3', 'enco x2', 'enco free 3',
        'realme buds air', 'realme buds t300', 'realme buds q2', 'realme buds wireless',
        'huawei freebuds', 'freebuds pro 3', 'freebuds 5', 'freebuds se',
        'jbl', 'jbl tune', 'jbl wave', 'jbl live', 'jbl club',
        'harman kardon', 'beats', 'beats fit pro', 'beats studio buds',
        'bose', 'bose qc', 'quietcomfort', 'soundsport',
        'sennheiser', 'momentum', 'cx true wireless',

        // Headphone Types
        'หูฟัง over ear', 'over-ear headphones', 'หูครอบ',
        'หูฟัง on ear', 'on-ear', 'หูฟังครอมหู',
        'หูฟัง in ear', 'in-ear', 'หูฟังแบบสอด',
        'หูฟังเกมมิ่ง', 'gaming headset', 'headset',

        // Features
        'noise cancelling', 'anc', 'ตัดเสียงรบกวน', 'โหมดตัดเสียง',
        'transparency mode', 'ambient sound', 'โหมดโปร่งใส',
        'กันน้ำ', 'waterproof', 'ipx4', 'ipx5', 'ipx7', 'กันเหงื่อ',
        'ไมค์คุณภาพดี', 'good microphone', 'call quality',

        // Price Ranges (Earphones)
        'หูฟัง 200', 'หูฟัง 500', 'หูฟัง 1,000', 'หูฟัง 2,000',
        'หูฟัง 3,000', 'หูฟัง 5,000', 'หูฟัง 10,000',
        'หูฟังราคาถูก', 'budget earphones', 'affordable earphones',

        // Networking & Connectivity
        'pocket wifi', '4g router', '5g router', 'aircard',
        'sim card', 'ซิม', 'ซิมเทพ', 'ซิมเน็ต', 'ซิมรายปี', 'sim true', 'sim ais', 'sim dtac',
        'ซิมท่องเที่ยว', 'travel sim', 'esim',
        'airtag', 'smart tag', 'gps tracker',

        // Phone specific gadgets
        'gimbal', 'กิมบอล', 'ไม้กันสั่น', 'dji osmo', 'insta360 flow',
        'ขาตั้งมือถือ', 'tripod', 'ไม้เซลฟี่', 'selfie stick',
        'ไฟไลฟ์สด', 'ring light', 'ไฟวงแหวน',
        'จอยเกมมือถือ', 'gamepad', 'gamesir', 'flydigi',
        'ปุ่มช่วยยิง', 'trigger', 'พัดลมระบายความร้อน', 'phone cooler', 'black shark cooler',
        'ถุงนิ้ว', 'finger sleeve',

        // Phone Grips & Stands (NEW!)
        'popsocket', 'phone grip', 'phone ring', 'ที่จับมือถือ',
        'phone stand', 'ที่วางมือถือบนโต๊ะ', 'desktop stand',
        'magsafe wallet', 'card holder', 'ที่ใส่การ์ด',

        // Stylus (moved from dedicated section - keeping for tablets)
        'ปากกา', 'stylus', 'ปากกาทัชสกรีน',
        'goojodoq', 'stylus pen',

        // Car Accessories
        'ที่จับมือถือในรถ', 'car holder', 'magsafe car mount', 'ที่วางมือถือ',

        // Cleaning
        'ผ้าเช็ดจอ', 'น้ำยาเช็ดจอ', 'screen cleaner', 'dust remover',

        // Accessory Prices (General)
        'อุปกรณ์เสริม 100', 'อุปกรณ์เสริม 500', 'อุปกรณ์เสริม 1,000',
    ],

    // ========================================
    // 305: อะไหล่มือถือ / Mobile Parts & Tools
    // ========================================
    305: [
        // Screen & Display
        'จอ', 'หน้าจอ', 'lcd', 'oled', 'amoled', 'screen', 'display assembly',
        'จอแท้', 'จอแกะ', 'จอเทียบ', 'จองานแท้', 'จอ oled', 'จอ incell',
        'จอแตก', 'กระจกจอ', 'ลอกกระจก', 'oca', 'ทัชสกรีน', 'touch screen',

        // Battery & Power
        'แบตเตอรี่', 'แบต', 'battery', 'ก้อนแบต',
        'แบตแท้', 'แบตศูนย์', 'แบตเทียบ', 'แบตเพิ่มความจุ', 'แบต commy', 'แบต dissing', 'แบต leeplus',
        'แพรชาร์จ', 'charging port', 'ตูดชาร์จ', 'รูชาร์จ', 'connector',

        // Internal Components (Technical)
        'บอร์ด', 'เมนบอร์ด', 'mainboard', 'logic board', 'motherboard',
        'บอร์ดอะไหล่', 'บอร์ดล็อค', 'บอร์ดติดไอคลาวด์',
        'สายแพร', 'flex cable', 'แพรจอ', 'แพรกล้อง', 'แพรปุ่มโฮม', 'แพรสแกนนิ้ว',
        'กล้องหน้า', 'front camera', 'กล้องหลัง', 'rear camera', 'เลนส์กล้อง', 'กระจกเลนส์',
        'ลำโพง', 'speaker', 'ลำโพงสนทนา', 'earpiece', 'buzzer',
        'ไมค์', 'microphone', 'ไมค์สาย',
        'IC', 'ไอซี', 'ic power', 'ic audio', 'ic touch', 'ic wifi', 'cpu', 'nand', 'emmc',
        'ถาดซิม', 'sim tray',

        // Housing & Body
        'บอดี้', 'housing', 'ฝาหลัง', 'back cover', 'กระจกหลัง',
        'เฟรม', 'frame', 'ขอบกลาง', 'middle frame',
        'ปุ่มกด', 'ปุ่ม power', 'ปุ่ม volume', 'ปุ่มโฮม',

        // ID/Security
        'สแกนนิ้ว', 'fingerprint', 'face id', 'สแกนหน้า',

        // Repair Tools
        'ไขควง', 'screwdriver', 'ชุดแกะมือถือ', 'opening tool',
        'กาว', 'glue', 'b7000', 't7000', 'e8000', 'กาวติดจอ',
        'แผ่นรองซ่อม', 'microscope', 'กล้องส่องพระ', // Sometimes used interchangeably

        // Price Ranges (NEW!)
        'จอ 500', 'จอ 1,000', 'จอ 2,000', 'จอ 5,000', 'จอ 10,000',
        'แบต 300', 'แบต 500', 'แบต 1,000', 'แบต 2,000',
        'อะไหล่ราคาถูก', 'อะไหล่แท้', 'genuine parts',
    ],

    // ========================================
    // 306: ฟิล์ม/เคส / Films & Cases
    // ========================================
    306: [
        // Cases
        'เคส', 'case', 'เคสโทรศัพท์', 'เคสไอแพด', 'cover', 'casing', 'bumper',
        'เคสกันกระแทก', 'shockproof', 'military grade', 'drop test',
        'เคสใส', 'clear case', 'เคสซิลิโคน', 'silicone case', 'tpu',
        'เคสหนัง', 'leather case', 'เคสฝาพับ', 'flip case', 'smart folio',
        'เคสแม่เหล็ก', 'magsafe case', 'เคสชาร์จไร้สาย',
        'เคสกันน้ำ', 'waterproof case', 'ซองกันน้ำ',
        'เคสพร้อมคีย์บอร์ด', 'keyboard case',

        // Brands
        'casetify', 'uag', 'urban armor gear', 'rhinoshield', 'mous',
        'spigen', 'ringke', 'skinarm', 'muse', 'zugu', 'pitaka',
        'hoco', 'focus', 'nilkin', 'rock', 'uniq', 'moft',

        // Films
        'ฟิล์ม', 'film', 'ฟิล์มกระจก', 'tempered glass', 'กระจกกันรอย',
        'ฟิล์มด้าน', 'matte film', 'ฟิล์มใส', 'clear film', 'ฟิล์มกันมอง', 'privacy film',
        'ฟิล์มกระดาษ', 'paper like', 'paperlike',
        'ฟิล์มไฮโดรเจล', 'hydrogel', 'ฟิล์ม uv', 'กาว uv',
        'ฟิล์มหลัง', 'back film', 'ฟิล์มรอบตัว',
        'กันรอยเลนส์กล้อง', 'camera lens protector', 'ครอบเลนส์',
        'focus', 'hi-shield', 'gorilla glass', 'ablemen', 'commy',

        // Price Ranges (NEW!)
        'เคส 100', 'เคส 200', 'เคส 500', 'เคส 1,000', 'เคส 2,000',
        'ฟิล์ม 50', 'ฟิล์ม 100', 'ฟิล์ม 200', 'ฟิล์ม 500', 'ฟิล์ม 1,000',
        'เคสราคาถูก', 'budget case', 'ฟิล์มราคาถูก', 'budget film',

        // Design Patterns (NEW!)
        'เคสลายการ์ตูน', 'cartoon case', 'เคสการ์ตูน',
        'เคสลายดอกไม้', 'floral case', 'flower pattern',
        'เคสมินิมอล', 'minimal case', 'minimalist',
        'เคสสีพาสเทล', 'pastel case', 'pastel color',
        'เคสลายหินอ่อน', 'marble case', 'marble pattern',
        'เคสกลิตเตอร์', 'glitter case', 'sparkle case',
        'เคสใส่ชื่อ', 'custom name case', 'personalized',
        'เคสพิมพ์ลาย', 'printed case', 'custom design',

        // Functional Cases (NEW!)
        'เคสกระเป๋าใส่บัตร', 'wallet case', 'card holder case',
        'เคสมีขาตั้ง', 'kickstand case', 'stand case',
        'เคสมีห่วงแขวน', 'lanyard case', 'strap case',
        'เคสกระจกเงา', 'mirror case', 'เคสส่องกระจก',
        'เคสแบตเตอรี่', 'battery case', 'power case',
    ],

    // ========================================
    // 307: แบตสำรองและสายชาร์จ / Power & Cables
    // ========================================
    307: [
        // Power Banks
        'แบตสำรอง', 'พาวเวอร์แบงค์', 'powerbank', 'power bank',
        'backup battery', 'portable charger',
        'magsafe battery pack', 'magsafe powerbank',
        'eloop', 'ew55', 'e29', 'ew54', 'e53',
        'yoobao', 'remax', 'hoco', 'commy', 'pisen', 'zmi',
        'aukey', 'anker', 'baseus', 'acmic', 'vegerto',
        'ความจุ 10000', 'ความจุ 20000', 'ความจุ 30000', 'mah',

        // Adapters
        'หัวชาร์จ', 'adapter', 'wall charger', 'หัวชาร์จเร็ว', 'fast charger',
        'pd', 'gan', 'gan charger', 'ganfast',
        '20w', '25w', '30w', '45w', '65w', '67w', '100w', '120w', '140w',
        'supervooc', 'hypercharge', 'flashcharge', 'supercharge',

        // Charging Stands/Wireless
        'แท่นชาร์จ', 'wireless charger', 'แท่นชาร์จไร้สาย', '3 in 1 charger',
        'magsafe charger', 'qi charger',

        // Cables
        'สายชาร์จ', 'charging cable', 'data cable', 'usb cable',
        'usb-c', 'type-c', 'lightning', 'สาย iphone', 'สาย type c',
        'c to c', 'c to lightning', 'usb to c',
        'สายถัก', 'braided cable', 'สายซิลิโคน', 'สายชาร์จเร็ว',
        'mfi', 'made for iphone', 'thunderbolt 3', 'thunderbolt 4',
        'ugreen', 'baseus', 'hoco', 'eloop',

        // Price Ranges (NEW!)
        'แบตสำรอง 500', 'แบตสำรอง 1,000', 'แบตสำรอง 2,000', 'แบตสำรอง 3,000',
        'หัวชาร์จ 200', 'หัวชาร์จ 500', 'หัวชาร์จ 1,000', 'หัวชาร์จ 2,000',
        'สายชาร์จ 100', 'สายชาร์จ 200', 'สายชาร์จ 500',
        'powerbank under 1000', 'charger under 500',
    ]
}

// Legacy flat array
export const COMPREHENSIVE_MOBILE_KEYWORDS =
    Object.values(MOBILE_SUBCATEGORY_KEYWORDS).flat()

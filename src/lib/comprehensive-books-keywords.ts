/**
 * COMPREHENSIVE BOOKS & EDUCATION KEYWORDS - Category 16 (หนังสือและการศึกษา)
 * 
 * Structure: Organized by SUBCATEGORY ID
 * 
 * Subcategories:
 * - 1601: หนังสือทั่วไป (General Books)
 * - 1602: หนังสือการ์ตูน/มังงะ (Comics & Manga)
 * - 1603: นิตยสาร (Magazines)
 * - 1604: หนังสือเรียน/อ้างอิง (Textbooks)
 * - 1605: คอร์สออนไลน์ (Online Courses)
 * - 1606: เครื่องเขียน/อุปกรณ์การเรียน (Stationery)
 */

export const BOOKS_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 1601: GENERAL BOOKS / หนังสือทั่วไป
    // ========================================
    1601: [
        // ========== GENERAL TERMS ==========
        'หนังสือ', 'book', 'books', 'pocket book', 'พ็อคเก็ตบุ๊ค',
        'e-book', 'ebook', 'อีบุ๊ค', 'e-reader', 'kindle',
        'audiobook', 'หนังสือเสียง', 'audio book',
        'หนังสือมือสอง', 'used book', 'used books', 'second hand book',
        'หนังสือหายาก', 'หนังสือเก่า', 'หนังสือสะสม', 'collector book',

        // ========== FICTION / นิยาย ==========
        'นิยาย', 'novel', 'fiction', 'นิยายแปล', 'translated novel',
        'นิยายจีน', 'chinese novel', 'นิยายเกาหลี', 'korean novel',
        'นิยายวาย', 'yaoi', 'bl', 'boys love', 'boys\' love',
        'นิยายยูริ', 'yuri', 'gl', 'girls love',
        'นิยายรัก', 'romance', 'นิยายโรแมนติก', 'romantic fiction',
        'นิยายสืบสวน', 'mystery', 'thriller', 'detective', 'นักสืบ',
        'นิยายสยองขวัญ', 'horror', 'ผีสยองขวัญ', 'นิยายผี',
        'นิยายแฟนตาซี', 'fantasy', 'นิยายเวทมนตร์',
        'นิยายวิทยาศาสตร์', 'sci-fi', 'science fiction',
        'นิยายย้อนยุค', 'historical fiction', 'นิยายอิงประวัติศาสตร์',
        'นิยายออนไลน์', 'web novel', 'เว็บนิยาย', 'dek-d novel',

        // ========== LITERATURE / วรรณกรรม ==========
        'วรรณกรรม', 'literature', 'วรรณกรรมเยาวชน', 'young adult',
        'วรรณกรรมไทย', 'thai literature', 'วรรณกรรมคลาสสิก', 'classic',
        'รวมเรื่องสั้น', 'short stories', 'เรื่องสั้น',
        'บทกวี', 'poetry', 'กวีนิพนธ์', 'poem',

        // ========== FAMOUS SERIES ==========
        'harry potter', 'แฮร์รี่ พอตเตอร์', 'lord of the rings',
        'twilight', 'hunger games', 'divergent',
        'game of thrones', 'a song of ice and fire',
        'the witcher', 'percy jackson',
        'เจ้าสาวจำเป็น', 'ดอกไม้เหล็ก', 'รับได้ไหม',

        // ========== SELF-IMPROVEMENT / พัฒนาตนเอง ==========
        'หนังสือพัฒนาตนเอง', 'self improvement', 'self help', 'self-help',
        'จิตวิทยา', 'psychology', 'mindset', 'ไมด์เซ็ท',
        'หนังสือสร้างแรงบันดาลใจ', 'motivation', 'inspirational',
        'ความสำเร็จ', 'success', 'เศรษฐี', 'how to be rich',
        'นิสัย', 'habit', 'atomic habits', '7 habits',
        'หนังสือผู้นำ', 'leadership', 'ภาวะผู้นำ',
        'การสื่อสาร', 'communication', 'เทคนิคการพูด',
        'think and grow rich', 'rich dad poor dad', 'พ่อรวยสอนลูก',
        'the subtle art', 'ikigai', 'อิคิไก',
        'เรื่องเล่าเขย่าใจ', 'chicken soup', 'inspirational stories',

        // ========== BUSINESS & FINANCE / ธุรกิจและการเงิน ==========
        'หนังสือธุรกิจ', 'business book', 'การจัดการ', 'management',
        'หนังสือหุ้น', 'stock book', 'ตลาดหุ้น', 'stock market',
        'การเงิน', 'finance', 'personal finance', 'การเงินส่วนบุคคล',
        'การลงทุน', 'investment', 'เงินทอง', 'crypto', 'cryptocurrency',
        'หนังสือการตลาด', 'marketing', 'digital marketing',
        'หนังสือ startup', 'startup', 'entrepreneur', 'ผู้ประกอบการ',
        'หนังสือวอร์เรน บัฟเฟตต์', 'warren buffet', 'value investing',
        'เศรษฐศาสตร์', 'economics', 'เศรษฐกิจ',
        'ภาษี', 'tax', 'บัญชี', 'accounting',

        // ========== HISTORY & BIOGRAPHY / ประวัติศาสตร์ ==========
        'หนังสือประวัติศาสตร์', 'history', 'history book',
        'ประวัติศาสตร์ไทย', 'thai history', 'ประวัติศาสตร์โลก', 'world history',
        'พงศาวดาร', 'ตำนาน', 'legend', 'mythology', 'ปกรณัม',
        'ชีวประวัติ', 'biography', 'autobiography', 'อัตชีวประวัติ',
        'บุคคลสำคัญ', 'เจ้าหญิงไดอาน่า', 'steve jobs', 'elon musk',
        'สงครามโลก', 'world war', 'สงคราม', 'war',
        'อารยธรรม', 'civilization', 'อียิปต์', 'โรมัน', 'กรีก',

        // ========== RELIGION & PHILOSOPHY / ศาสนาและปรัชญา ==========
        'หนังสือธรรมะ', 'religion', 'ศาสนา', 'buddhism', 'พุทธศาสนา',
        'หนังสือพระ', 'สมเด็จพระสังฆราช', 'หลวงพ่อ', 'พระธรรม',
        'หนังสือปรัชญา', 'philosophy', 'ปรัชญาชีวิต',
        'นิกายเซน', 'zen', 'เต๋า', 'tao', 'ศาสนาคริสต์', 'christianity',
        'meditation', 'การทำสมาธิ', 'สติ', 'mindfulness',
        'หนังสือมุสลิม', 'islam', 'อัลกุรอาน', 'quran',

        // ========== TRAVEL / ท่องเที่ยว ==========
        'หนังสือท่องเที่ยว', 'travel book', 'ท่องเที่ยว',
        'หนังสือนำเที่ยว', 'guide book', 'guidebook', 'lonely planet',
        'แผนที่ท่องเที่ยว', 'รีวิวเที่ยว', 'travel review',
        'เที่ยวญี่ปุ่น', 'japan guide', 'เที่ยวเกาหลี', 'korea guide',
        'เที่ยวยุโรป', 'europe guide', 'backpacker',

        // ========== COOKING & LIFESTYLE / ทำอาหาร ==========
        'หนังสือทำอาหาร', 'cookbook', 'cooking book', 'recipe book',
        'สูตรอาหาร', 'recipe', 'ตำราอาหาร', 'สูตรขนม',
        'อาหารไทย', 'thai food', 'อาหารญี่ปุ่น', 'japanese cuisine',
        'อาหารเพื่อสุขภาพ', 'healthy food', 'อาหารคลีน', 'clean eating',
        'เบเกอรี่', 'bakery', 'ขนมอบ', 'baking',
        'หนังสือกาแฟ', 'coffee book', 'บาริสต้า', 'barista',

        // ========== HEALTH & WELLNESS / สุขภาพ ==========
        'หนังสือสุขภาพ', 'health book', 'สุขภาพ',
        'หนังสือออกกำลังกาย', 'fitness book', 'yoga book', 'โยคะ',
        'หนังสือลดน้ำหนัก', 'diet book', 'if', 'intermittent fasting',
        'หนังสือหมอ', 'medical book', 'แพทย์', 'โรค', 'disease',
        'สมุนไพร', 'herbal', 'ยาสมุนไพร', 'แพทย์แผนไทย',

        // ========== ART & DESIGN / ศิลปะและการออกแบบ ==========
        'หนังสือศิลปะ', 'art book', 'ศิลปะ',
        'หนังสือวาดรูป', 'drawing book', 'painting', 'การวาดภาพ',
        'หนังสือออกแบบ', 'design book', 'graphic design', 'interior design',
        'สถาปัตยกรรม', 'architecture', 'ภาพถ่าย', 'photography book',

        // ========== PARENTING / เลี้ยงลูก ==========
        'หนังสือเลี้ยงลูก', 'parenting', 'parenting book',
        'หนังสือแม่และเด็ก', 'พัฒนาการเด็ก', 'child development',
        'หนังสือท้อง', 'pregnancy book', 'ตั้งครรภ์',

        // ========== SCIENCE / วิทยาศาสตร์ ==========
        'หนังสือวิทยาศาสตร์', 'science book', 'วิทยาศาสตร์',
        'ฟิสิกส์', 'physics', 'เคมี', 'chemistry', 'ชีววิทยา', 'biology',
        'ดาราศาสตร์', 'astronomy', 'อวกาศ', 'space',
        'สารคดี', 'documentary', 'non-fiction',

        // ========== PUBLISHERS / สำนักพิมพ์ ==========
        'สำนักพิมพ์', 'publisher',
        'นานมีบุ๊คส์', 'อมรินทร์', 'แพรวเพื่อนเด็ก', 'แจ่มใส',
        'เอิร์นเนสท์', 'openbooks', 'สยามอินเตอร์บุ๊คส์',
        'ซีเอ็ด', 'se-ed', 'บีทูเอส', 'b2s',
        'kinokuniya', 'คิโนะคุนิยะ', 'เอเชียบุ๊คส์', 'asia books',

        // ========== CONDITIONS ==========
        'หนังสือใหม่', 'new book', 'หนังสือลิขสิทธิ์แท้',
        'หนังสือแปล', 'translated', 'หนังสือแถม', 'gift with purchase',
        'หนังสือลดราคา', 'sale', 'หนังสือชุด', 'book set', 'box set',
    ],

    // ========================================
    // 1602: COMICS & MANGA / หนังสือการ์ตูน
    // ========================================
    1602: [
        // ========== GENERAL TERMS ==========
        'การ์ตูน', 'comic', 'comics', 'manga', 'มังงะ', 'หนังสือการ์ตูน',
        'มังงะแปลไทย', 'มังงะญี่ปุ่น', 'japanese manga',
        'manhwa', 'มังฮวา', 'การ์ตูนเกาหลี', 'korean comic',
        'manhua', 'มานฮวา', 'การ์ตูนจีน', 'chinese comic',
        'webtoon', 'เว็บตูน', 'web comic',
        'โดจิน', 'doujin', 'doujinshi', 'โดจินชิ',
        'light novel', 'ไลท์โนเวล', 'ln',

        // ========== ANIME / อนิเมะ ==========
        'อนิเมะ', 'anime', 'อาร์ตบุ๊ค', 'artbook', 'art book',
        'โปสเตอร์อนิเมะ', 'anime poster', 'ภาพวาดอนิเมะ',

        // ========== POPULAR SERIES - ACTION ==========
        'one piece', 'วันพีซ', 'naruto', 'นารูโตะ', 'boruto',
        'dragon ball', 'ดราก้อนบอล', 'ดราก้อนบอลซุปเปอร์',
        'attack on titan', 'ผ่าพิภพไททัน', 'shingeki no kyojin',
        'demon slayer', 'ดาบพิฆาตอสูร', 'kimetsu no yaiba',
        'jujutsu kaisen', 'มหาเวทย์ผนึกมาร', 'my hero academia', 'ฮีโร่อะคาเดเมีย',
        'chainsaw man', 'เชนซอว์แมน', 'spy x family', 'สปายเฟมิลี่',
        'hunter x hunter', 'ฮันเตอร์ x ฮันเตอร์', 'bleach', 'บลีช',
        'black clover', 'แบล็ค โคลเวอร์', 'one punch man', 'วันพันช์แมน',
        'tokyo revengers', 'โตเกียว รีเวนเจอร์ส', 'blue lock', 'บลูล็อค',
        'kaiju no.8', 'ไคจูหมายเลข 8',

        // ========== POPULAR SERIES - ROMANCE ==========
        'fruits basket', 'ฟรุตบาสเก็ต', 'horimiya', 'โฮริมิยะ',
        'kaguya-sama', 'คากุยะ', 'love is war',
        'skip beat', 'นางเอกข้ามสาย', 'ao haru ride',
        'wotakoi', 'รักวุ่นๆ ของโอตาคุ',

        // ========== POPULAR SERIES - CLASSIC ==========
        'detective conan', 'โคนัน', 'ยอดนักสืบจิ๋วโคนัน',
        'doraemon', 'โดราเอมอน', 'shin-chan', 'ชินจัง', 'crayon shin-chan',
        'slam dunk', 'สแลมดังก์', 'captain tsubasa', 'กัปตันซึบาสะ',
        'death note', 'เดธโน้ต', 'fullmetal alchemist', 'แขนกลคนแปรธาตุ',
        'gintama', 'กินทามะ', 'fairy tail', 'แฟรี่เทล',

        // ========== THAI COMICS ==========
        'ขายหัวเราะ', 'มหาสนุก', 'การ์ตูนไทย', 'thai comic',
        'ผีกลัวแมว', 'ผีสมิง', 'การ์ตูนผี',

        // ========== GENRES ==========
        'การ์ตูนโรแมนซ์', 'romance manga', 'shoujo', 'โชโจ',
        'การ์ตูนแอ็คชั่น', 'action manga', 'shounen', 'โชเน็น',
        'การ์ตูนสยองขวัญ', 'horror manga', 'ホラー',
        'การ์ตูนกีฬา', 'sports manga', 'haikyuu', 'ไฮคิว',
        'การ์ตูนอาหาร', 'food manga', 'cooking manga',
        'การ์ตูน isekai', 'อิเซไก', 'ต่างโลก',
        'seinen', 'เซเน็น', 'josei', 'โจเซ',

        // ========== CONDITIONS ==========
        'ยกชุด', 'ครบชุด', 'box set', 'กล่องเซ็ต',
        'การ์ตูนมือสอง', 'มังงะมือสอง', 'secondhand manga',
        'ปกแข็ง', 'hardcover', 'limited edition', 'ลิมิเต็ด',
        'พิมพ์ครั้งแรก', 'first edition', 'first print',
    ],

    // ========================================
    // 1603: MAGAZINES / นิตยสาร
    // ========================================
    1603: [
        // ========== GENERAL TERMS ==========
        'นิตยสาร', 'magazine', 'วารสาร', 'journal', 'periodical',
        'นิตยสารเก่า', 'back issue', 'เล่มเก่า',
        'photobook', 'โฟโต้บุ๊ค', 'photo book',
        'lookbook', 'ลุคบุ๊ค', 'catalog', 'แคตตาล็อก',

        // ========== FASHION MAGAZINES ==========
        'vogue', 'elle', 'bazaar', 'harper\'s bazaar',
        'gq', 'esquire', 'men\'s health', 'women\'s health',
        'cosmopolitan', 'cleo', 'seventeen', 'allure',
        'instyle', 'marie claire', 'vanity fair',

        // ========== LIFESTYLE MAGAZINES ==========
        'บ้านและสวน', 'room', 'home magazine',
        'cheeze', 'a day', 'lips', 'สุดสัปดาห์',
        'gourmet & cuisine', 'health & cuisine',
        'we magazine', 'happening', 'volume',

        // ========== ENTERTAINMENT ==========
        'นิตยสาร k-pop', 'kpop magazine', 'bts', 'blackpink',
        'นิตยสารดารา', 'celebrity magazine', 'star magazine',
        'entertainment weekly', 'hollywood',

        // ========== SPECIAL INTEREST ==========
        'national geographic', 'nat geo', 'สารคดี',
        'discovery', 'bbc', 'time', 'newsweek',
        'นิตยสารศิลปะ', 'art magazine', 'art4d',
        'นิตยสารรถ', 'car magazine', 'auto magazine',
        'นิตยสารกอล์ฟ', 'golf magazine', 'sport magazine',
        'นิตยสารเกม', 'game magazine', 'playstation magazine',

        // ========== THAI MAGAZINES ==========
        'ดิฉัน', 'ขวัญเรือน', 'สกุลไทย', 'แพรว',
        'คู่สร้างคู่สม', 'เปรียว', 'ทีวีพูล',
        'marketeer', 'brand age', 'positioning',

        // ========== LITERARY ==========
        'นิตยสารนิยาย', 'สกุลไทย', 'ช่อการะเกด',
        'writer magazine', 'literary magazine',

        // ========== CONDITIONS ==========
        'นิตยสารสะสม', 'collector magazine', 'rare magazine',
        'นิตยสารครบชุด', 'complete collection',
    ],

    // ========================================
    // 1604: TEXTBOOKS / หนังสือเรียน
    // ========================================
    1604: [
        // ========== GENERAL TERMS ==========
        'หนังสือเรียน', 'textbook', 'text book', 'แบบเรียน',
        'คู่มือเตรียมสอบ', 'exam guide', 'หนังสือติว',
        'หนังสือเตรียมสอบ', 'exam prep', 'คู่มือติว',
        'หนังสืออ้างอิง', 'reference book', 'สารานุกรม', 'encyclopedia',

        // ========== ENTRANCE EXAMS ==========
        'gat pat', 'gat', 'pat', 'แกท แพท',
        '9 วิชาสามัญ', 'วิชาสามัญ', 'nine subjects',
        'tcas', 'ทีแคส', 'a-level', 'เอเลเวล',
        'onet', 'โอเน็ต', 'o-net',
        'ข้อสอบเก่า', 'past exam', 'เฉลยข้อสอบ', 'answer key',
        'สอบเข้ามหาลัย', 'university entrance', 'admission',
        'สอบตรง', 'quota', 'ใบสมัครสอบ',

        // ========== SCHOOL LEVELS ==========
        'หนังสือม.ปลาย', 'high school', 'มัธยมปลาย',
        'หนังสือม.ต้น', 'middle school', 'มัธยมต้น',
        'หนังสือป.', 'primary school', 'ประถม',
        'หนังสืออนุบาล', 'kindergarten', 'preschool',
        'หนังสือเด็ก', 'children book', 'picture book',

        // ========== SUBJECTS ==========
        'คณิตศาสตร์', 'math', 'mathematics', 'เลข',
        'ภาษาไทย', 'thai language', 'วิชาภาษาไทย',
        'ภาษาอังกฤษ', 'english', 'grammar', 'ไวยากรณ์',
        'วิทยาศาสตร์', 'science', 'ฟิสิกส์', 'physics',
        'เคมี', 'chemistry', 'ชีววิทยา', 'biology',
        'สังคมศึกษา', 'social studies', 'ประวัติศาสตร์', 'history',
        'ภูมิศาสตร์', 'geography', 'พลศึกษา', 'pe',

        // ========== DICTIONARY & REFERENCES ==========
        'พจนานุกรม', 'dictionary', 'dic', 'ดิก',
        'พจนานุกรมอังกฤษ', 'english dictionary', 'oxford', 'cambridge',
        'พจนานุกรมไทย', 'thai dictionary', 'ราชบัณฑิต',
        'พจนานุกรมจีน', 'chinese dictionary', 'พจนานุกรมญี่ปุ่น', 'japanese dictionary',

        // ========== LANGUAGE LEARNING ==========
        'หนังสือสอนภาษา', 'language book', 'language learning',
        'เรียนภาษาอังกฤษ', 'learn english', 'english for thai',
        'เรียนภาษาจีน', 'learn chinese', 'hsk', 'เรียนจีน',
        'เรียนภาษาญี่ปุ่น', 'learn japanese', 'jlpt', 'เรียนญี่ปุ่น',
        'เรียนภาษาเกาหลี', 'learn korean', 'topik', 'เรียนเกาหลี',
        'เรียนภาษาฝรั่งเศส', 'learn french', 'เรียนภาษาเยอรมัน', 'learn german',
        'ielts', 'toeic', 'toefl', 'sat', 'gre', 'gmat',
        'conversation', 'การสนทนา', 'speaking', 'listening',

        // ========== PROFESSIONAL ==========
        'หนังสือหมอ', 'medical book', 'แพทย์ศาสตร์', 'medicine',
        'หนังสือพยาบาล', 'nursing book', 'กายวิภาค', 'anatomy',
        'หนังสือกฎหมาย', 'law book', 'นิติศาสตร์', 'ประมวลกฎหมาย',
        'หนังสือวิศวะ', 'engineering book', 'วิศวกรรม',
        'หนังสือบัญชี', 'accounting book', 'cpa', 'การบัญชี',
        'หนังสือเศรษฐศาสตร์', 'economics book', 'มหภาค', 'จุลภาค',
        'หนังสือจิตวิทยา', 'psychology textbook',

        // ========== PUBLISHERS ==========
        'สสวท', 'ipst', 'อจท', 'อักษรเจริญทัศน์',
        'พว', 'ประสานมิตร', 'กระทรวงศึกษา',
        'นานมี', 'แม็ค', 'mac education',
    ],

    // ========================================
    // 1605: ONLINE COURSES / คอร์สออนไลน์
    // ========================================
    1605: [
        // ========== GENERAL TERMS ==========
        'คอร์สเรียน', 'course', 'คอร์สออนไลน์', 'online course',
        'คอร์สเรียนออนไลน์', 'e-learning', 'อีเลิร์นนิ่ง',
        'เรียนพิเศษ', 'tutor', 'ติว', 'กวดวิชา',
        'คลาสเรียน', 'class', 'workshop', 'เวิร์คช็อป',
        'webinar', 'เว็บบินาร์', 'masterclass', 'มาสเตอร์คลาส',

        // ========== LANGUAGE COURSES ==========
        'คอร์สภาษา', 'language course', 'คอร์สภาษาอังกฤษ', 'english course',
        'คอร์สภาษาจีน', 'chinese course', 'คอร์สภาษาญี่ปุ่น', 'japanese course',
        'คอร์สภาษาเกาหลี', 'korean course',
        'คอร์ส ielts', 'คอร์ส toeic', 'คอร์ส toefl',
        'สอนสนทนา', 'conversation class',

        // ========== IT & PROGRAMMING ==========
        'คอร์สเขียนโปรแกรม', 'coding', 'programming course',
        'คอร์ส python', 'คอร์ส javascript', 'คอร์ส java',
        'คอร์ส web development', 'คอร์สทำเว็บ', 'fullstack',
        'คอร์ส data science', 'data analyst', 'machine learning',
        'คอร์ส ai', 'คอร์ส deep learning',
        'คอร์ส mobile app', 'คอร์ส flutter', 'คอร์ส react native',
        'คอร์ส ui/ux', 'ui ux', 'figma', 'คอร์ส design',

        // ========== BUSINESS & MARKETING ==========
        'คอร์สการตลาด', 'marketing course', 'คอร์สขาย', 'sales course',
        'คอร์สดิจิทัลมาร์เก็ตติ้ง', 'digital marketing',
        'คอร์ส facebook ads', 'คอร์ส google ads', 'คอร์ส tiktok ads',
        'คอร์ส seo', 'คอร์ส content marketing',
        'คอร์สธุรกิจ', 'business course', 'คอร์ส startup',
        'คอร์ส e-commerce', 'คอร์สขายของออนไลน์',

        // ========== CREATIVE ==========
        'คอร์สภาพถ่าย', 'photography course', 'คอร์สถ่ายรูป',
        'คอร์สตัดต่อวิดีโอ', 'video editing', 'คอร์ส premiere',
        'คอร์ส photoshop', 'คอร์ส illustrator', 'คอร์ส after effects',
        'คอร์สวาดรูป', 'drawing course', 'คอร์ส procreate',
        'คอร์สดนตรี', 'music course', 'คอร์สกีตาร์', 'คอร์สเปียโน',
        'คอร์สร้องเพลง', 'คอร์สผลิตเพลง', 'music production',

        // ========== ACADEMIC ==========
        'คอร์สติวสอบ', 'exam prep course', 'คอร์สคณิต', 'คอร์สฟิสิกส์',
        'คอร์ส gat pat', 'คอร์ส onet', 'คอร์ส tcas',
        'คอร์สเตรียมสอบหมอ', 'คอร์ส ent',

        // ========== PLATFORMS ==========
        'udemy', 'coursera', 'skilllane', 'สกิลเลน',
        'linkedin learning', 'skillshare', 'domestika',
        'edx', 'khan academy', 'codecademy',
        'skooldio', 'สคูลดิโอ', 'chula mooc', 'thai mooc',
        'born to dev', 'borntodev', 'sideproject',

        // ========== CONDITIONS ==========
        'คูปองเรียน', 'voucher course', 'คูปองคอร์ส',
        'lifetime access', 'เรียนตลอดชีพ', 'certificate', 'ใบรับรอง',
        'คอร์สฟรี', 'free course', 'คอร์สราคาถูก',
    ],

    // ========================================
    // 1606: STATIONERY / เครื่องเขียน
    // ========================================
    1606: [
        // ========== GENERAL TERMS ==========
        'เครื่องเขียน', 'stationery', 'อุปกรณ์การเรียน', 'school supplies',
        'อุปกรณ์สำนักงาน', 'office supplies', 'ของใช้สำนักงาน',
        'เครื่องเขียนน่ารัก', 'cute stationery', 'เครื่องเขียนญี่ปุ่น', 'japanese stationery',
        'เครื่องเขียนเกาหลี', 'korean stationery',

        // ========== WRITING INSTRUMENTS ==========
        'ปากกา', 'pen', 'pens', 'ปากกาลูกลื่น', 'ballpoint pen',
        'ปากกาเจล', 'gel pen', 'ปากกาหมึกเจล',
        'ปากกาหมึกซึม', 'fountain pen', 'ปากกาคอแร้ง',
        'ปากกามาร์คเกอร์', 'marker', 'ปากกาเขียนไวท์บอร์ด', 'whiteboard marker',
        'ปากกาเคมี', 'permanent marker',
        'ดินสอ', 'pencil', 'ดินสอกด', 'mechanical pencil',
        'ดินสอ 2b', 'ดินสอ hb', 'ดินสอสี', 'colored pencil',
        'ไส้ดินสอ', 'pencil lead', 'ไส้ปากกา', 'refill',

        // ========== BRANDS - PENS ==========
        'pilot', 'ไพล็อต', 'zebra', 'ซีบร้า', 'pentel', 'เพนเทล',
        'uni', 'uniball', 'mitsubishi', 'ตราม้า', 'horse',
        'bic', 'stabilo', 'สตาบิโล', 'papermate',
        'lamy', 'parker', 'montblanc', 'waterman', 'cross',
        'muji', 'มูจิ', 'sakura', 'ตราซากุระ',

        // ========== ERASER & CORRECTION ==========
        'ยางลบ', 'eraser', 'ยางลบดินสอ', 'ยางลบหมึก',
        'น้ำยาลบคำผิด', 'correction fluid', 'ลิควิด', 'liquid paper',
        'เทปลบคำผิด', 'correction tape', 'ปากกาลบคำผิด',
        'pentel', 'plus', 'tombow', 'mono',

        // ========== RULERS & MEASURING ==========
        'ไม้บรรทัด', 'ruler', 'ไม้บรรทัด 30 ซม', 'ไม้บรรทัดเหล็ก',
        'วงเวียน', 'compass', 'ไม้ฉาก', 'set square', 'triangle ruler',
        'ไม้โปรแทรกเตอร์', 'protractor', 'template', 'แม่แบบ',

        // ========== NOTEBOOKS & PAPER ==========
        'สมุด', 'notebook', 'สมุดโน้ต', 'notepad',
        'สมุดจด', 'สมุดบันทึก', 'diary', 'ไดอารี่',
        'สมุดวาด', 'sketchbook', 'สมุดสเก็ตช์',
        'สมุดเส้น', 'lined notebook', 'สมุดจุด', 'dotted notebook',
        'สมุดตาราง', 'grid notebook', 'graph paper',
        'planner', 'แพลนเนอร์', 'bullet journal', 'บูเล็ตเจอร์นัล',
        'กระดาษ', 'paper', 'กระดาษ a4', 'กระดาษ a3', 'กระดาษถ่ายเอกสาร',
        'กระดาษโน้ต', 'sticky note', 'post it', 'โพสอิท',
        'moleskine', 'leuchtturm', 'rhodia', 'midori',

        // ========== ADHESIVE & TAPE ==========
        'กาว', 'glue', 'กาวลาเท็กซ์', 'กาวแท่ง', 'glue stick',
        'กาวน้ำ', 'liquid glue', 'กาวร้อน', 'hot glue', 'กาวยาง', 'rubber cement',
        'เทป', 'tape', 'เทปใส', 'เทปกาว', 'scotch tape',
        'เทปสองหน้า', 'double sided tape', 'เทปกระดาษ', 'masking tape',
        'เทปตกแต่ง', 'washi tape', 'วาชิเทป', 'deco tape',

        // ========== CUTTING & BINDING ==========
        'กรรไกร', 'scissors', 'กรรไกรสำนักงาน', 'คัตเตอร์', 'cutter',
        'ใบมีดคัตเตอร์', 'cutter blade', 'ที่ตัดกระดาษ', 'paper cutter',
        'ที่เจาะกระดาษ', 'punch', 'hole punch', 'เครื่องเจาะรู',
        'ที่เย็บกระดาษ', 'stapler', 'แม็ก', 'max stapler',
        'ลวดเย็บกระดาษ', 'staples', 'ลวดเย็บ',
        'ที่เก็บลวดเย็บ', 'staple remover', 'ที่ถอนลวดเย็บ',
        'คลิปหนีบกระดาษ', 'binder clip', 'paper clip', 'ลวดหนีบ',

        // ========== HIGHLIGHTERS & MARKERS ==========
        'ไฮไลท์', 'highlighter', 'ปากกาเน้นข้อความ', 'ปากกาไฮไลท์',
        'สีเมจิก', 'marker', 'สีเคมี', 'ปากกาเมจิก',
        'stabilo', 'mildliner', 'ไมล์ดไลเนอร์', 'zebra mildliner',
        'faber castell', 'ฟาเบอร์', 'staedtler', 'สเต็ดเลอร์',

        // ========== ART SUPPLIES ==========
        'สี', 'color', 'สีไม้', 'colored pencil', 'prismacolor',
        'สีน้ำ', 'watercolor', 'สีโปสเตอร์', 'poster color',
        'สีอะคริลิค', 'acrylic', 'สีน้ำมัน', 'oil paint',
        'สีเทียน', 'crayon', 'crayola', 'สีชอล์ก', 'chalk', 'pastel',
        'พู่กัน', 'brush', 'paintbrush', 'จานสี', 'palette',
        'ผ้าใบ', 'canvas', 'กระดาษวาดเขียน', 'drawing paper',
        'ชุดวาดรูป', 'art set', 'เซ็ตวาดรูป',
        'prismacolor', 'copic', 'koi', 'winsor newton',

        // ========== ORGANIZERS ==========
        'กระเป๋าดินสอ', 'pencil case', 'กล่องดินสอ', 'pencil box',
        'กระเป๋าเครื่องเขียน', 'stationery pouch',
        'ที่เสียบปากกา', 'pen holder', 'ที่ใส่ปากกา', 'pen stand',
        'ชั้นวางเอกสาร', 'document tray', 'file tray',
        'แฟ้ม', 'folder', 'file', 'แฟ้มใส่เอกสาร',
        'ซองแฟ้มพลาสติก', 'sheet protector', 'clear folder',

        // ========== DIGITAL & TECH ==========
        'ปากกาไอแพด', 'stylus', 'apple pencil', 'ปากกาเขียน tablet',
        'ปากกาสำหรับ ipad', 'ipad stylus', 'samsung s pen',

        // ========== DESKTOP ITEMS ==========
        'แผ่นรองเขียน', 'clipboard', 'คลิปบอร์ด',
        'กระดานไวท์บอร์ด', 'whiteboard', 'ไวท์บอร์ด',
        'ยางรัด', 'rubber band', 'หนังยาง',
        'ที่หนีบกระดาษ', 'bulldog clip', 'foldback clip',

        // ========== CONDITIONS ==========
        'เครื่องเขียนราคาถูก', 'cheap stationery',
        'เครื่องเขียนน่ารัก', 'cute stationery',
        'เครื่องเขียนมินิมอล', 'minimalist stationery',
        'เครื่องเขียน aesthetic', 'ชุดเครื่องเขียน', 'stationery set',
    ],
}

// Combine all keywords for main category detection
export const COMPREHENSIVE_BOOKS_KEYWORDS = Object.values(BOOKS_SUBCATEGORY_KEYWORDS).flat()

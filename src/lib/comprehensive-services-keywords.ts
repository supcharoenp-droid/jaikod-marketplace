/**
 * COMPREHENSIVE SERVICES KEYWORDS - Category 11 (บริการ)
 * 
 * Structure: Organized by SUBCATEGORY ID
 */

export const SERVICES_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 1101: TECHNICIANS / ช่างและซ่อมบำรุง
    // ========================================
    1101: [
        // Basic Repair
        'บริการซ่อม', 'repair service', 'ช่างซ่อม', 'technician',

        // Home Appliances - Air Con & Refrigeration
        'ซ่อมแอร์', 'ล้างแอร์', 'air cleaning', 'air repair', 'ac repair',
        'ติดตั้งแอร์', 'ac installation',
        'ซ่อมตู้เย็น', 'fridge repair', 'refrigerator repair',

        // Home Appliances - Laundry & Kitchen
        'ซ่อมเครื่องซักผ้า', 'washing machine repair',
        'ซ่อมเตาอบ', 'oven repair',
        'ซ่อมไมโครเวฟ', 'microwave repair',
        'ซ่อมหม้อหุงข้าว', 'rice cooker repair',

        // Home Appliances - Others
        'ซ่อมทีวี', 'tv repair',
        'ซ่อมพัดลม', 'fan repair',
        'ซ่อมเครื่องดูดฝุ่น', 'vacuum repair',

        // Electronics
        'ซ่อมคอม', 'computer repair', 'pc repair',
        'ซ่อมโน้ตบุ๊ค', 'laptop repair', 'notebook repair',
        'ซ่อมมือถือ', 'phone repair', 'mobile repair',
        'ซ่อมแท็บเล็ต', 'tablet repair',
        'เปลี่ยนจอ', 'screen replacement', 'เปลี่ยนกระจก',
        'เปลี่ยนแบต', 'battery replacement',
        'ซ่อมเมาส์', 'mouse repair', 'ซ่อมคีย์บอร์ด', 'keyboard repair',

        // Home Repair & Construction
        'ซ่อมบ้าน', 'home repair', 'house repair',
        'ต่อเติมบ้าน', 'renovation', 'home extension',
        'ต่อเติมห้อง', 'room extension',
        'ทำฝ้าเพดาน', 'ceiling work',
        'ปูกระเบื้อง', 'tile work', 'tiling',

        // Carpenters & Welders
        'ช่างไม้', 'carpenter', 'งานไม้', 'woodwork',
        'ช่างเหล็ก', 'welder', 'เชื่อม', 'welding',

        // Electricians
        'ช่างไฟ', 'electrician', 'เดินไฟ', 'electrical work',
        'ติดตั้งไฟ', 'light installation',

        // Plumbers
        'ช่างประปา', 'plumber', 'plumbing',
        'ท่อตัน', 'clogged pipe', 'งูเหล็ก', 'drain snake',
        'ท่อรั่ว', 'pipe leak',

        // Painters
        'ช่างสี', 'painter', 'ทาสีบ้าน', 'house painting',
        'ทาสีห้อง', 'room painting',

        // Locksmiths
        'ช่างกุญแจ', 'locksmith', 'เปิดกุญแจ',

        // Car Services
        'ซ่อมรถ', 'car repair', 'auto repair',
        'ช่างยนต์', 'mechanic', 'auto mechanic',
        'เปลี่ยนยาง', 'tire change', 'tire replacement',
        'เปลี่ยนน้ำมันเครื่อง', 'oil change',

        // Installation Services
        'ติดตั้ง', 'installation', 'install',
        'ติดตั้งกล้อง', 'camera installation', 'cctv installation',

        // Specialty Services
        'ช่างแก้ว', 'glass repair', 'glass work',
        'ซ่อมมุ้งลวด', 'screen repair',
        'งานสูง', 'high rise work',
        'งานกันซึม', 'waterproofing',

        // Thai Technician Terms
        'ช่างมืออาชีพ', 'professional technician',
        'งานด่วน', 'urgent repair', 'emergency repair',
        'รับประกันงาน', 'warranty service',
    ],

    // ========================================
    // 1102: MOVING / ขนย้าย
    // ========================================
    1102: [
        // Moving Types
        'รับจ้างขนของ', 'moving service', 'moving company',
        'ย้ายบ้าน', 'house moving', 'ย้ายหอ', 'ย้ายคอนโด', 'condo moving',
        'ย้ายสำนักงาน', 'office moving', 'office relocation',

        // Packing Services
        'รับแพ็คของ', 'packing service',
        'กล่องใส่ของ', 'moving box', 'cardboard box',
        'ห่อของ', 'wrapping service',
        'bubble wrap', 'พลาสติกกันกระแทก',
        'บริการห่อหุ้ม', 'packaging service',

        // Moving Details
        'ขนของหนัก', 'heavy lifting', 'heavy item moving',
        'ยกเฟอร์นิเจอร์', 'furniture moving',
        'ขนตู้เซฟ', 'safe moving',
        'ขนเปียโน', 'piano moving',

        // Storage Services
        'เก็บของฝาก', 'storage service',
        'คลังเก็บของ', 'warehouse', 'storage facility',
        'mini storage', 'มินิสโตเรจ',
        'ฝากของ', 'item storage',

        // Disposal Services
        'กำจัดของเก่า', 'junk removal', 'disposal service',
        'ทิ้งเฟอร์นิเจอร์', 'furniture disposal',
        'ขนขยะ', 'trash removal',

        // Vehicle Types
        'รถกระบะรับจ้าง', 'pickup for hire', 'รถหกล้อรับจ้าง', 'รถรับจ้าง',
        'รถ 4 ล้อ', 'รถ 10 ล้อ',
        'รถกะบะ', 'pickup truck',
        'รถตู้บรรทุก', 'van', 'cargo van',

        // Delivery & Transport
        'ขนส่งสินค้า', 'delivery', 'delivery service',
        'ส่งพัสดุ', 'parcel delivery', 'courier',
        'ขนส่งต่างจังหวัด', 'interstate moving', 'long distance moving',
        'ขนส่งทางไกล', 'long distance delivery',

        // Platforms
        'lalamove', 'grab express', 'deliveree',

        // Thai Moving Terms
        'รับจ้างขนของราคาถูก', 'affordable moving',
        'บริการย้ายบ้านครบวงจร', 'full service moving',
    ],

    // ========================================
    // 1103: CLEANING / ทำความสะอาด
    // ========================================
    1103: [
        // Maid Services - Basic
        'แม่บ้าน', 'maid', 'housekeeper',
        'บริการทำความสะอาด', 'cleaning service', 'house cleaning',

        // Maid Types
        'แม่บ้านประจำ', 'full-time maid', 'live-in maid',
        'แม่บ้านชั่วคราว', 'part-time maid',
        'แม่บ้านรายวัน', 'daily maid',
        'แม่บ้านรายชั่วโมง', 'hourly maid',

        // Cleaning Types
        'บริการทำความสะอาดบ้าน', 'home cleaning',
        'ทำความสะอาดคอนโด', 'condo cleaning',
        'big cleaning', 'ทำความสะอาดลึก', 'deep cleaning',
        'ทำความสะอาดย้ายเข้า', 'move-in cleaning',
        'ทำความสะอาดย้ายออก', 'move-out cleaning',
        'ทำความสะอาดหลังรีโนเวท', 'post-renovation cleaning',

        // Office & Commercial
        'ทำความสะอาดออฟฟิศ', 'office cleaning',
        'ทำความสะอาดโรงงาน', 'factory cleaning',

        // Specialty Cleaning
        'ล้างโซฟา', 'sofa cleaning', 'upholstery cleaning',
        'ล้างพรม', 'carpet cleaning',
        'ล้างม่าน', 'curtain cleaning',
        'ล้างเครื่องซักผ้า', 'washing machine cleaning',
        'ล้างแอร์', 'ac cleaning', 'air con cleaning',

        // Laundry Services
        'ซักอบรีด', 'laundry service', 'wash and iron',
        'คนรีดผ้า', 'ironing service',
        'ซักผ้าม่าน', 'curtain laundry',
        'ซักพรม', 'carpet laundry',
        'ซักผ้านวม', 'blanket laundry',

        // Pest Control - Main
        'กำจัดปลวก', 'pest control', 'ฉีดปลวก', 'termite control',

        // Pest Control - Details
        'กำจัดแมลงสาบ', 'cockroach control', 'roach control',
        'กำจัดหนู', 'rat control', 'pest removal',
        'กำจัดมด', 'ant control',
        'ไล่นกพิราบ', 'bird control', 'pigeon control',

        // Car Wash
        'ล้างรถ', 'car wash', 'auto car wash',
        'ขัดเคลือบสี', 'car detailing', 'car polish',

        // Thai Cleaning Terms
        'บริการทำความสะอาดมืออาชีพ', 'professional cleaning',
        'รับทำความสะอาดราคาถูก', 'affordable cleaning',
    ],

    // ========================================
    // 1104: GENERAL SERVICES / รับจ้างทั่วไป
    // ========================================
    1104: [
        // Freelance - Basic
        'รับจ้าง', 'freelance', 'ฟรีแลนซ์', 'freelancer',

        // Digital Services
        'เขียนโปรแกรม', 'programming', 'coding',
        'พัฒนาเว็บไซต์', 'web development', 'website development',
        'ทำแอพ', 'app development', 'mobile app',
        'seo', 'digital marketing', 'online marketing',

        // Graphic Design
        'กราฟิก', 'graphic design', 'graphic designer',
        'ออกแบบโลโก้', 'logo design',
        'ออกแบบ ui/ux', 'ui design', 'ux design',
        'ทำอินโฟกราฟิก', 'infographic', 'infographic design',
        'ออกแบบนามบัตร', 'business card design',
        'ออกแบบโบรชัวร์', 'brochure design',

        // Writing & Translation
        'เขียนบทความ', 'writer', 'content writer', 'article writing',
        'แปลภาษา', 'translation', 'translator',
        'copywriter', 'คอปี้ไรท์เตอร์',

        // Photography & Video
        'ถ่ายรูป', 'photographer', 'ช่างภาพ', 'photography',
        'รับปริญญา', 'graduation photo',
        'ถ่ายงานแต่ง', 'wedding photography',
        'ถ่ายสินค้า', 'product photography',
        'ถ่ายอาหาร', 'food photography',
        'ถ่ายแฟชั่น', 'fashion photography',
        'pre-wedding', 'พรีเว็ดดิ้ง',

        // Video Production
        'ตัดต่อวิดีโอ', 'video editor', 'video editing',
        'ทำคอนเทนต์', 'content creator',
        'youtuber', 'ถ่าย youtube', 'youtube content',
        'live สด', 'streaming', 'live streaming',

        // Event Services
        'จัดงานอีเว้นท์', 'event organizer', 'event planning',
        'มหาหน้างาน', 'mc', 'พิธีกร', 'host',
        'ดีเจ', 'dj', 'disc jockey',
        'วงดนตรี', 'band', 'live band',

        // Professional Services
        'ทำบัญชี', 'accountant', 'accounting',
        'จดทะเบียนบริษัท', 'company registration',
        'เลขานุการ', 'secretary', 'personal assistant',
        'ทำเอกสาร', 'documentation', 'document preparation',
        'พิมพ์งาน', 'typing service', 'data entry',

        // Pet Services
        'รับดูแลสัตว์เลี้ยง', 'pet sitting', 'pet sitter',
        'พาสุนัขเดิน', 'dog walking', 'dog walker',
        'อาบน้ำตัดขน', 'pet grooming', 'grooming service',

        // Others
        'ดูดวง', 'fortune teller', 'fortune telling',
        'ฮวงจุ้ย', 'feng shui',

        // Thai Freelance Terms
        'รับงาน freelance', 'รับจ้างออนไลน์', 'online freelance',
        'ทำงานพาร์ทไทม์', 'part-time work',
    ],

    // ========================================
    // 1105: TUTORING / สอนพิเศษ
    // ========================================
    1105: [
        // Basic
        'สอนพิเศษ', 'tutor', 'ติวเตอร์', 'ครูสอนพิเศษ', 'private tutor',

        // Academic Subjects
        'สอนคณิต', 'math tutor', 'mathematics',
        'สอนฟิสิกส์', 'physics tutor',
        'สอนเคมี', 'chemistry tutor',
        'สอนภาษาอังกฤษ', 'english tutor', 'english teacher',
        'สอนภาษาจีน', 'chinese tutor', 'mandarin tutor',
        'สอนภาษา', 'language tutor',

        // Grade Levels
        'สอนเด็กประถม', 'elementary tutor', 'primary school',
        'สอนม.ต้น', 'junior high', 'lower secondary',
        'สอนม.ปลาย', 'senior high', 'upper secondary',
        'ติว o-net', 'o-net prep', 'ติว a-net', 'a-net prep',

        // Test Preparation
        'ติวสอบ', 'test preparation', 'exam prep',
        'ติวเข้ามหาลัย', 'university prep', 'entrance exam',
        'ติว GAT/PAT', 'gat tutor', 'pat tutor',
        'ติว ielts', 'ielts tutor',
        'ติว toeic', 'toeic tutor',
        'ติว toefl', 'toefl tutor',

        // Music - General
        'สอนเปียโน', 'piano lesson', 'piano teacher',
        'สอนดนตรี', 'music lesson', 'music teacher',

        // Music - Instruments
        'สอนกีต้าร์', 'guitar lesson', 'guitar teacher',
        'สอนกลอง', 'drum lesson', 'drum teacher',
        'สอนร้องเพลง', 'vocal lesson', 'singing lesson',
        'สอนไวโอลิน', 'violin lesson',

        // Physical & Sports
        'สอนว่ายน้ำ', 'swimming lesson', 'swim coach',
        'สอนขับรถ', 'driving lesson', 'driving instructor',
        'เทรนเนอร์', 'trainer', 'fitness trainer', 'personal trainer',

        // Sports Lessons
        'สอนเทนนิส', 'tennis lesson', 'tennis coach',
        'สอนฟุตบอล', 'football coaching', 'soccer coach',
        'สอนบาสเกตบอล', 'basketball coach',
        'สอนโยคะ', 'yoga instructor', 'yoga teacher',

        // Skills & Hobbies
        'สอนวาดรูป', 'art lesson', 'drawing lesson',
        'สอนภาษามือ', 'sign language',
        'สอนโปรแกรม', 'coding tutor', 'programming tutor',

        // Tutoring Methods
        'สอนออนไลน์', 'online tutoring', 'online class',
        'สอนที่บ้าน', 'home tutoring', 'in-home tutor',
        'ติวกลุ่ม', 'group tutoring',
        'ติวตัวต่อตัว', 'one-on-one', 'private lesson',

        // Thai Tutoring Terms
        'ครูพิเศษ', 'private teacher',
        'ติวเตอร์มืออาชีพ', 'professional tutor',
        'ติวราคาถูก', 'affordable tutoring',
    ],
}

// Combine all keywords for main category detection
export const COMPREHENSIVE_SERVICES_KEYWORDS = Object.values(SERVICES_SUBCATEGORY_KEYWORDS).flat()

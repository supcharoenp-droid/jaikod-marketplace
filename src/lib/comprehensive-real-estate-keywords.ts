/**
 * Comprehensive Real Estate Keywords
 * Category 2: อสังหาริมทรัพย์
 * 
 * Organized by subcategory ID for precise matching
 * Includes Thai, English, location types, and property features
 */

export const REAL_ESTATE_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 201: บ้านเดี่ยว / House
    // ========================================
    201: [
        // Thai General
        'บ้านเดี่ยว', 'บ้าน', 'บ้านมือสอง', 'บ้านใหม่', 'บ้านสวย',
        'บ้านพร้อมอยู่', 'บ้านสไตล์โมเดิร์น', 'บ้านชั้นเดียว', 'บ้าน2ชั้น',
        'บ้านสวนหลังใหญ่', 'บ้านกลางเมือง', 'บ้านชานเมือง',
        'คฤหาสน์', 'house for sale', 'luxury house',
        'บ้านหรู', 'บ้านลอฟท์', 'บ้านน็อคดาวน์',

        // English General
        'house', 'single house', 'detached house', 'home', 'villa',
        'modern house', '2 storey house', 'single storey', 'luxury house',

        // Developers & Brands
        'sansiri house', 'แสนสิริ', 'land and houses', 'แลนด์แอนด์เฮ้าส์',
        'sc asset', 'ap thailand', 'เอพี', 'supalai home', 'ศุภาลัย',
        'q house', 'คิวเฮ้าส์', 'pruksa home', 'พฤกษา',
        'property perfect', 'origin property', 'ananda',
        'setthasiri', 'เศรษฐสิริ', 'narasiri', 'นาราสิริ',
        'burasiri', 'บุราสิริ', 'saransiri', 'สราญสิริ',
        'centro', 'เซนโทร', 'the city', 'bangkok boulevard', 'laddarom', 'ลัดดารมย์',
        'mantana', 'มัณฑนา', 'chaiyapruek', 'ชัยพฤกษ์', 'siwalee', 'สีวลี',
        'perfect place', 'perfect master', 'venue', 'grandio',

        // Specific House Projects (NEW!)
        'nirvana', 'habito', 'icon collection', 'privana',
        'lh kanchana', 'lh vista', 'lh boulevard',
        'baan klang krung', 'บ้านกลางกรุง', 'baan pha piyarom',
        'casa ville', 'the bangkok', 'nusa chivani',

        // Features
        'มีสระว่ายน้ำ', 'pool villa', 'สวน', 'garden', 'จอดรถ', 'garage',
        '3ห้องนอน', '4ห้องนอน', '5ห้องนอน', 'bedroom', 'bathroom',
        'ห้องแม่บ้าน', 'maid room', 'ครัวไทย', 'thai kitchen',

        // Size Keywords (NEW!)
        'พื้นที่ใช้สอย 100 ตรม', 'พื้นที่ 150 ตรม', 'พื้นที่ 200 ตรม', 'พื้นที่ 300 ตรม',
        'ที่ดิน 50 ตรว', 'ที่ดิน 100 ตรว', 'ที่ดิน 150 ตรว', 'ที่ดิน 200 ตรว',
        'usable area', 'land size', 'plot size',

        // Architectural Styles (NEW!)
        'บ้านสไตล์ญี่ปุ่น', 'japanese style', 'tropical style',
        'contemporary', 'modern minimal', 'โมเดิร์นมินิมอล',
        'resort style', 'loft style', 'industrial style',
        'scandinavian', 'บาหลี', 'bali style',

        // Location Types
        'หมู่บ้าน', 'village', 'housing estate', 'gated community',
        'มีรปภ', 'security', '24hr', 'ติดถนนใหญ่',

        // Bangkok Areas (NEW!)
        'บ้านสุขุมวิท', 'บ้านทองหล่อ', 'บ้านเอกมัย', 'บ้านพร้อมพงษ์',
        'บ้านสาทร', 'บ้านสีลม', 'บ้านอโศก', 'บ้านอารี',
        'บ้านบางนา', 'บ้านรามคำแหง', 'บ้านลาดพร้าว', 'บ้านรัชดา',
        'บ้านศรีนครินทร์', 'บ้านพระราม 9', 'บ้านเพชรบุรี', 'บ้านวงเวียนใหญ่',
        'บ้านสาทร-นราธิวาส', 'บ้านพัฒนาการ', 'บ้านอ่อนนุช', 'บ้านสำโรง',
        'บ้านภาษีเจริญ', 'บ้านปิ่นเกล้า', 'บ้านแจ้งวัฒนะ', 'บ้านเชียงใหม่',

        // Near BTS/MRT (NEW!)
        'ใกล้ BTS', 'ใกล้ MRT', 'ติดรถไฟฟ้า',
        'ใกล้ BTS สุขุมวิท', 'ใกล้ BTS อโศก', 'ใกล้ BTS ทองหล่อ',
        'ใกล้ BTS เอกมัย', 'ใกล้ BTS พร้อมพงษ์', 'ใกล้ BTS อารี',
        'ใกล้ MRT สุขุมวิท', 'ใกล้ MRT ลาดพร้าว', 'ใกล้ MRT พระราม 9',

        // Provinces (NEW!)
        'บ้านชลบุรี', 'บ้านพัทยา', 'บ้านระยอง', 'บ้านหัวหิน',
        'บ้านเชียงใหม่', 'บ้านภูเก็ต', 'บ้านกระบี่', 'บ้านสมุย',
        'บ้านนครปฐม', 'บ้านปทุมธานี', 'บ้านนนทบุรี', 'บ้านสมุทรปราการ',
        'บ้านนครราชสีมา', 'บ้านอยุธยา', 'บ้านกาญจนบุรี',

        // Price Ranges (NEW!)
        'บ้าน 2 ล้าน', 'บ้าน 3 ล้าน', 'บ้าน 5 ล้าน', 'บ้าน 10 ล้าน',
        'บ้าน 15 ล้าน', 'บ้าน 20 ล้าน', 'บ้าน 30 ล้าน', 'บ้าน 50 ล้าน',
        'บ้านราคาถูก', 'บ้านราคาประหยัด', 'บ้านราคาดี',
        'บ้านหรู', 'บ้านพรีเมี่ยม', 'luxury home',
        'house under 5 million', 'house under 10 million',

        // Conditions
        'ขายบ้าน', 'ขายด่วน', 'ลดราคา', 'ต่อรองได้', 'for sale',
        'พร้อมโอน', 'เจ้าของขายเอง', 'ไม่ผ่านนายหน้า', 'ฟรีโอน',

        // Financing (NEW!)
        'ผ่อนได้', 'ดาวน์ต่ำ', 'ดาวน์ 0%', 'ผ่อน 0%'
    ],

    // ========================================
    // 202: คอนโดมิเนียม / Condo
    // ========================================
    202: [
        // Thai General
        'คอนโด', 'คอนโดมิเนียม', 'ห้องชุด', 'คอนโด มือสอง', 'คอนโดใหม่',
        'คอนโดหรู', 'คอนโดสวย', 'คอนโดพร้อมอยู่', 'คอนโดปล่อยเช่า',

        // English General
        'condo', 'condominium', 'condo apartment', 'flat', 'unit',
        'studio', 'luxury condo', 'high rise', 'low rise',

        // Developers & Brands
        'ashton', 'แอชตัน', 'ideo', 'ไอดีโอ', 'ideo mobi', 'elio',
        'life', 'ไลฟ์', 'rhythm', 'ริทึ่ม', 'aspire',
        'lumpini', 'lpn', 'ลุมพินี', 'lumpini park', 'lumpini ville',
        'supalai condo', 'supalai vista', 'supalai park',
        'knightsbridge', 'ไนท์บริดจ์', 'notting hill',
        'noble', 'โนเบิล', 'noble ploenchit', 'noble revolve',
        'plun chit', 'sansiri condo', 'xyz', 'origin', 'brixton',

        // Famous Condo Projects (NEW!)
        // Ashton
        'ashton asoke', 'ashton chula-silom', 'ashton ari', 'ashton morph 38',
        'ashton silom', 'ashton residence 41',

        // Noble
        'noble be33', 'noble revolve ratchada', 'noble recole asoke',
        'noble remix', 'noble ploenchit', 'noble reveal', 'noble around',

        // Ideo
        'ideo q chula-samyan', 'ideo mobi sukhumvit', 'ideo mobi asoke',
        'ideo blucove', 'ideo sathorn-wongwian yai', 'ideo rama 9',

        // Sansiri
        '98 wireless', 'xt huaikwang', 'the base', 'the line',
        'via 31', 'via botani', 'the esse', 'the monument',

        // Supalai
        'supalai veranda', 'supalai wellington', 'supalai elite',
        'supalai loft', 'supalai mare',

        // Others
        'life asoke', 'rhythm sukhumvit', 'rhythm sathorn',
        'rhythm ratchada', 'knightsbridge prime', 'notting hill thepharak',
        'lumpini place', 'lumpini ville', 'elio del nest',
        'q asoke', 'the origin',

        // Room Types
        'สตูดิโอ', '1ห้องนอน', '2ห้องนอน', '3ห้องนอน',
        '1 bedroom', '2 bedrooms', '3 bedrooms',
        'ห้องมุม', 'corner unit', 'duplex', 'penthouse', 'loft',

        // Features
        'วิวสวย', 'sea view', 'city view', 'pool view', 'แม่น้ำ', 'river view',
        'ชั้นสูง', 'high floor', 'ชั้นต่ำ', 'low floor',
        'fully furnished', 'เฟอร์นิเจอร์ครบ', 'built-in',
        'pet friendly', 'เลี้ยงสัตว์ได้', 'คอนโดเลี้ยงสัตว์ได้',

        // Amenities
        'สระว่ายน้ำ', 'swimming pool', 'ฟิตเนส', 'fitness', 'gym',
        'ที่จอดรถ', 'parking', 'รปภ24ชม', 'security', 'key card',
        'co-working space', 'rooftop', 'sky lounge',

        // Bangkok Locations (NEW!)
        'คอนโดสุขุมวิท', 'คอนโดสาทร', 'คอนโดสีลม', 'คอนโดอโศก',
        'คอนโดพร้อมพงษ์', 'คอนโดทองหล่อ', 'คอนโดเอกมัย', 'คอนโดอารี',
        'คอนโดลาดพร้าว', 'คอนโดรัช ดา', 'คอนโดรามคำแหง', 'คอนโดบางนา',
        'คอนโดพระราม 9', 'คอนโด่อนนุช', 'คอนโดศรีนครินทร์',
        'คอนโดพัฒนาการ', 'คอนโดสำโรง', 'คอนโดภาษีเจริญ',
        'คอนโดแจ้งวัฒนะ', 'คอนโดเพชรบุรี', 'คอนโดวิทยุ',

        // BTS/MRT Stations (NEW!)
        'ใกล้ BTS อโศก', 'ใกล้ BTS พร้อมพงษ์', 'ใกล้ BTS ทองหล่อ',
        'ใกล้ BTS เอกมัย', 'ใกล้ BTS อารี', 'ใกล้ BTS สยาม',
        'ใกล้ BTS ชิดลม', 'ใกล้ BTS เพลินจิต', 'ใกล้ BTS นานา',
        'ใกล้ BTS ปุ่นนวัต', 'ใกล้ BTS สะพานควาย', 'ใกล้ BTS อนุสาวรีย์',
        'ใกล้ MRT สุขุมวิท', 'ใกล้ MRT สีลม', 'ใกล้ MRT ลุมพินี',
        'ใกล้ MRT จตุจักร', 'ใกล้ MRT พระราม 9', 'ใกล้ MRT เพชรบุรี',
        'ใกล้ MRT ลาดพร้าว', 'ใกล้ MRT สุทธิสาร', 'ใกล้ MRT รัชดา',

        // Sizes (NEW!)
        'คอนโด 25 ตรม', 'คอนโด 30 ตรม', 'คอนโด 35 ตรม', 'คอนโด 40 ตรม',
        'คอนโด 50 ตรม', 'คอนโด 60 ตรม', 'คอนโด 80 ตรม', 'คอนโด 100 ตรม',
        'คอนโดห้องใหญ่', 'คอนโดห้องเล็ก', 'studio 25 sqm', '1 bedroom 35 sqm',

        // Price Ranges (NEW!)
        'คอนโด 1 ล้าน', 'คอนโด 2 ล้าน', 'คอน โด 3 ล้าน', 'คอนโด 5 ล้าน',
        'คอนโด 7 ล้าน', 'คอนโด 10 ล้าน', 'คอนโด 15 ล้าน', 'คอนโด 20 ล้าน',
        'คอนโดราคาถูก', 'คอนโดราคาดี', 'คอนโดราคาประหยัด',
        'condo under 2 million', 'condo under 3 million', 'condo under 5 million',

        // Provinces (NEW!)
        'คอนโดพัทยา', 'คอนโดหัวหิน', 'คอนโดภูเก็ต', 'คอนโดเชียงใหม่',
        'คอนโดชลบุรี', 'คอนโดสมุย', 'คอนโดกระบี่',
    ],

    // ========================================
    // 203: ที่ดิน / Land
    // ========================================
    203: [
        // Thai General
        'ที่ดิน', 'ขายที่ดิน', 'ที่ดินเปล่า', 'ที่ดินถมแล้ว', 'ที่ดินยังไม่ถม',
        'ที่ดินพร้อมสร้าง', 'ที่ดินติดถนน', 'ที่ดินมีโฉนด', 'ขายยกแปลง', 'แบ่งขาย',

        // English General
        'land', 'plot', 'land for sale', 'vacant land',
        'land plot', 'building plot',

        // Land Types
        'ที่ดินเปล่า', 'empty land', 'ที่ดินเกษตร', 'agricultural land',
        'ที่ดินสวน', 'garden land', 'ที่ดินทำสวน', 'ไร่นาสวนผสม',
        'ที่ดินจัดสรร', 'ที่ดินอุตสาหกรรม', 'ที่ดินสร้างโรงงาน',
        'ที่ดินติดแม่น้ำ', 'riverfront', 'ที่ดินวิวเขา', 'mountain view',
        'ที่ดินติดทะเล', 'beachfront land', 'ที่ดินวิวทะเล', 'sea view land',

        // Size Units
        'ไร่', 'rai', 'งาน', 'ngan', 'ตารางวา', 'sqw',
        'ตารางเมตร', 'sqm', 'square meter',

        // Popular Land Sizes (NEW!)
        'ที่ดิน 50 ตรว', 'ที่ดิน 100 ตรว', 'ที่ดิน 200 ตรว', 'ที่ดิน 300 ตรว',
        'ที่ดิน 500 ตรว', 'ที่ดิน 1 ไร่', 'ที่ดิน 2 ไร่', 'ที่ดิน 5 ไร่',
        'ที่ดิน 10 ไร่', 'ที่ดิน 20 ไร่', 'ที่ดิน 50 ไร่', 'ที่ดิน 100 ไร่',
        'ที่ดิน 100 ตรม', 'ที่ดิน 500 ตรม', 'ที่ดิน 1,000 ตรม',
        'land 50 sqw', 'land 100 sqw', 'land 1 rai', 'land 5 rai', 'land 10 rai',

        // Location Features
        'ติดถนนใหญ่', 'main road', 'ทำเลดี', 'good location',
        'หน้ากว้าง', 'wide frontage', 'มีไฟฟ้า', 'electricity',
        'มีน้ำประปา', 'water supply', 'ใกล้ชุมชน',

        // Provinces & Locations (NEW!)
        'ที่ดินชลบุรี', 'ที่ดินระยอง', 'ที่ดินพัทยา', 'ที่ดินศรีราชา',
        'ที่ดินหัวหิน', 'ที่ดินประจวบคีรีขันธ์', 'ที่ดินชะอำ',
        'ที่ดินเชียงใหม่', 'ที่ดินเชียงราย', 'ที่ดินแม่ริม', 'ที่ดินสันกำแพง',
        'ที่ดินภูเก็ต', 'ที่ดินกระบี่', 'ที่ดินสมุย', 'ที่ดินพังงา',
        'ที่ดินกาญจนบุรี', 'ที่ดินไทรโยค', 'ที่ดินเขาใหญ่',
        'ที่ดินนครปฐม', 'ที่ดินสมุทรสาคร', 'ที่ดินสมุทรปราการ',
        'ที่ดินปทุมธานี', 'ที่ดินนนทบุรี', 'ที่ดินนครนายก',
        'ที่ดินนครราชสีมา', 'ที่ดินโคราช', 'ที่ดินขอนแก่น', 'ที่ดินอุดรธานี',
        'ที่ดินอยุธยา', 'ที่ดินสระบุรี', 'ที่ดินลพบุรี',
        'ที่ดินสุพรรณบุรี', 'ที่ดินราชบุรี', 'ที่ดินเพชรบุรี',

        // Use Cases (NEW!)
        'ที่ดินสร้างบ้าน', 'land for housing', 'ที่ดินทำโครงการ', 'project land',
        'ที่ดินเก็งกำไร', 'speculation land', 'ที่ดินลงทุน', 'investment land',
        'ที่ดินทำรีสอร์ท', 'resort land', 'ที่ดินทำธุรกิจ', 'business land',
        'ที่ดินทำการเกษตร', 'farming land', 'ที่ดินทำไร่', 'plantation land',
        'ที่ดินทำสวน', 'orchard land', 'ที่ดินปลูกบ้าน', 'residential land',
        'ที่ดินทำคลังสินค้า', 'warehouse land', 'ที่ดินทำโรงงาน', 'factory land',
        'ที่ดินทำหมู่บ้านจัดสรร', 'housing estate land',

        // Price Ranges (NEW!)
        'ที่ดินราคาถูก', 'cheap land', 'ที่ดินราคาดี', 'good price land',
        'ที่ดิน 100,000', 'ที่ดิน 500,000', 'ที่ดิน 1 ล้าน', 'ที่ดิน 5 ล้าน',
        'ที่ดิน 10 ล้าน', 'ที่ดิน 20 ล้าน', 'ที่ดิน 50 ล้าน',
        'ไร่ละแสน', 'ไร่ละล้าน', 'ตารางวาละพัน', 'ตารางวาละหมื่น',
        'land under 1 million', 'land under 5 million', 'land under 10 million',

        // Zone Colors (NEW!)
        'พื้นที่สีม่วง', 'purple zone', 'พื้นที่สีเขียว', 'green zone',
        'พื้นที่สีเหลือง', 'yellow zone', 'พื้นที่สีส้ม', 'orange zone',
        'พื้นที่สีขาว', 'white zone',

        // Documents
        'โฉนด', 'chanote', 'title deed', 'นส3', 'ns3', 'นส3ก',
        'สปก', 'sor kor', 'เอกสารสิทธ์', 'land title', 'ครุฑแดง', 'ครุฑเขียว'
    ],

    // ========================================
    // 204: ทาวน์เฮ้าส์ / Townhouse
    // ========================================
    204: [
        // Thai General
        'ทาวน์เฮ้าส์', 'ทาวน์เฮ้าส์มือสอง', 'ทาวน์เฮ้าส์ใหม่',
        'ทาวน์โฮม', 'ทาวน์โฮมส์', 'บ้านแฝด', 'โฮมออฟฟิศ',

        // English General
        'townhouse', 'townhome', 'town house', 'row house',
        'semi detached', 'twin house', 'home office',

        // Developers & Brands
        'pleno', 'พลีโน่', 'baan klang muang', 'บ้านกลางเมือง',
        'indy', 'อินดี้', 'villaggio', 'วิลลาจจิโอ',
        'golden town', 'โกลเด้นทาวน์', 'gusto', 'กัสโต้',
        'pruksa ville', 'พฤกษาทาวน์', 'baapruk', 'บ้านพฤกษา',
        'puri', 'ภูริ', 'q district',
        'supalai townhome', 'ศุภาลัยทาวน์',

        // Specific Townhouse Projects (NEW!)
        'pleno sukhumvit', 'pleno pinklao', 'pleno rama 9', 'pleno onnuch',
        'baan klang muang sathorn', 'baan klang muang chaengwattana',
        'baan klang muang ramintra', 'baan klang muang the urbano',
        'indy phahol', 'indy rama 2', 'indy ladprao', 'indy ratchaphruek',
        'golden town new petchkasem', 'golden town bangna-trad',
        'gusto ratchapruek', 'gusto rama 2',
        'pruksa ville ramintra', 'pruksa ville bangna',
        'puri bangna', 'puri ratchapruek',

        // Features
        '2ชั้น', '3ชั้น', '4ชั้น', '2 storey', '3 storey', '4 storey',
        '3ห้องนอน', '4ห้องนอน', '5ห้องนอน', 'bedroom', '3 bedrooms', '4 bedrooms',
        'จอดรถ2คัน', '2 car park', '3 car park',

        // Width Keywords (NEW!)
        'หน้ากว้าง 4 เมตร', 'หน้ากว้าง 5 เมตร', 'หน้ากว้าง 5.5 เมตร',
        'หน้ากว้าง 5.7 เมตร', 'หน้ากว้าง 6 เมตร', 'หน้ากว้าง 7 เมตร',
        'width 4m', 'width 5m', 'width 5.5m', 'width 6m',

        // Location
        'หมู่บ้าน', 'housing project', 'gated', 'gated community',
        'ใกล้รถไฟฟ้า', 'near bts', 'near mrt', 'หลังมุม', 'corner unit',

        // Bangkok Locations (NEW!)
        'ทาวน์เฮ้าส์บางนา', 'ทาวน์เฮ้าส์ลาดพร้าว', 'ทาวน์เฮ้าส์รามคำแหง',
        'ทาวน์เฮ้าส์สุขุมวิท', 'ทาวน์เฮ้าส์เอกมัย', 'ทาวน์เฮ้าส์พระราม 9',
        'ทาวน์เฮ้าส์รัชดา', 'ทาวน์เฮ้าส์ศรีนครินทร์', 'ทาวน์เฮ้าส์พัฒนาการ',
        'ทาวน์เฮ้าส์อ่อนนุ ช', 'ทาวน์เฮ้าส์สำโรง', 'ทาวน์เฮ้าส์แจ้งวัฒนะ',
        'ทาวน์เฮ้าส์พหลโยธิน', 'ทาวน์เฮ้าส์รามอินทรา', 'ทาวน์เฮ้าส์ราชพฤกษ์',
        'ทาวน์เฮ้าส์ปิ่นเกล้า', 'ทาวน์เฮ้าส์บางกะปิ', 'ทาวน์เฮ้าส์บางแค',
        'ทาวน์เฮ้าส์พระราม 2', 'ทาวน์เฮ้าส์พระราม 3', 'ทาวน์เฮ้าส์เพชรเกษม',

        // Provinces (NEW!)
        'ทาวน์เฮ้าส์นนทบุรี', 'ทาวน์เฮ้าส์ปทุมธานี', 'ทาวน์เฮ้าส์สมุทรปราการ',
        'ทาวน์เฮ้าส์นครปฐม', 'ทาวน์เฮ้าส์ชลบุรี', 'ทาวน์เฮ้าส์พัทยา',

        // Price Ranges (NEW!)
        'ทาวน์เฮ้าส์ 2 ล้าน', 'ทาวน์เฮ้าส์ 3 ล้าน', 'ทาวน์เฮ้าส์ 4 ล้าน', 'ทาวน์เฮ้าส์ 5 ล้าน',
        'ทาวน์เฮ้าส์ 6 ล้าน', 'ทาวน์เฮ้าส์ 7 ล้าน', 'ทาวน์เฮ้าส์ 10 ล้าน',
        'ทาวน์เฮ้าส์ราคาถูก', 'ทาวน์เฮ้าส์ราคาดี', 'townhouse under 3 million', 'townhouse under 5 million',

        // Condition
        'ขายทาวน์เฮ้าส์', 'ต่อเติมแล้ว', 'renovated', 'ต่อเติมครัว', 'ต่อเติมโรงรถ',
        'ตกแต่งใหม่', 'newly renovated', 'พร้อมอยู่', 'ready to move',

        // Financing (NEW!)
        'ผ่อนได้', 'ดาวน์ต่ำ', 'ดาวน์ 0%',
    ],

    // ========================================
    // 205: อาคารพาณิชย์ / Commercial
    // ========================================
    205: [
        // Thai General
        'อาคารพาณิชย์', 'ตึกแถว', 'อาคารพาณิชย์มือสอง',
        'อาคารพาณิชย์เปล่า', 'อาคารพาณิชย์เช่า', 'เซ้งกิจการ',
        'ตึกแถว 1 คูหา', 'ตึกแถว 2 คูหา', 'ตึกแถว 3 คูหา',

        // English General
        'commercial building', 'shophouse', 'shop house',
        'commercial property', 'retail space', 'business for sale',

        // Floor Counts (NEW!)
        'อาคาร 2 ชั้น', 'อาคาร 3 ชั้น', 'อาคาร 4 ชั้น', 'อาคาร 5 ชั้น', 'อาคาร 6 ชั้น',
        '3ชั้น', '4ชั้น', '5ชั้น', '6ชั้น',
        '2 storey', '3 storey', '4 storey', '5 storey', '6 storey',

        // Width Keywords (NEW!)
        'หน้ากว้าง 4 เมตร', 'หน้ากว้าง 5 เมตร', 'หน้ากว้าง 6 เมตร',
        'หน้ากว้าง 8 เมตร', 'หน้ากว้าง 10 เมตร', 'หน้ากว้าง 12 เมตร',
        'frontage 4m', 'frontage 5m', 'frontage 6m', 'frontage 8m', 'frontage 10m',
        'หน้ากว้าง', 'wide frontage',

        // Features
        'ติดถนนใหญ่', 'main road', 'มุมสี่แยก', 'corner lot', 'intersection',
        'มีลิฟต์', 'elevator', 'มีที่จอดรถ', 'parking',
        'ตกแต่งพร้อม', 'fully renovated', 'ต่อเติมแล้ว', 'extended',

        // Business Types
        'เหมาะทำร้านค้า', 'suitable for shop', 'ทำออฟฟิศ', 'office use',
        'ทำโชว์รูม', 'showroom', 'ทำโกดัง', 'warehouse use',
        'ทำร้านอาหาร', 'restaurant', 'ทำคลินิก', 'clinic', 'ทำโฮสเทล', 'hostel',

        // More Business Types (NEW!)
        'ทำสปา', 'spa use', 'ทำโรงแรม', 'hotel use', 'ทำหอพัก', 'dormitory use',
        'ทำสถาบันกวดวิชา', 'tutorial center', 'ทำร้านซักรีด', 'laundry shop',
        'ทำร้านกาแฟ', 'coffee shop', 'ทำร้านเสริมสวย', 'beauty salon',
        'ทำร้านสะดวกซื้อ', 'convenience store', 'ทำร้านยา', 'pharmacy',
        'ทำร้านเบเกอรี่', 'bakery', 'ทำร้านนวด', 'massage shop',
        'ทำคลินิกสัตว์', 'vet clinic', 'ทำฟิตเนส', 'fitness center',

        // Bangkok Locations (NEW!)
        'ตึกแถวรามคำแหง', 'ตึกแถวลาดพร้าว', 'ตึกแถวสุขุมวิท',
        'ตึกแถวบางนา', 'ตึกแถวรัชดา', 'ตึกแถวเพชรบุรี',
        'อาคารพาณิชย์สุขุมวิท', 'อาคารพาณิชย์บางนา', 'อาคารพาณิชย์รามคำแหง',
        'อาคารพาณิชย์ลาดพร้าว', 'อาคารพาณิชย์รัชดา', 'อาคารพาณิชย์ศรีนครินทร์',
        'อาคารพาณิชย์พัทนาการ', 'อาคารพาณิชย์อ่อนนุช', 'อาคารพาณิชย์สำโรง',
        'อาคารพาณิชย์พระราม 9', 'อาคารพาณิชย์พระราม 2', 'อาคารพาณิชย์พระราม 3',
        'อาคารพาณิชย์สาทร', 'อาคารพาณิชย์สีลม', 'อาคารพาณิชย์วงเวียนใหญ่',
        'อาคารพาณิชย์ภาษีเจริญ', 'อาคารพาณิชย์ปิ่นเกล้า', 'อาคารพาณิชย์แจ้งวัฒนะ',

        // Provinces/Areas (NEW!)
        'ตึกแถวชลบุรี', 'ตึกแถวพัทยา', 'ตึกแถวหัวหิน',
        'อาคารพาณิชย์เชียงใหม่', 'อาคารพาณิชย์ภูเก็ต',
        'อาคารพาณิชย์นครปฐม', 'อาคารพาณิชย์สมุทรปราการ',

        // Price Ranges (NEW!)
        'ตึกแถว 2 ล้าน', 'ตึกแถว 3 ล้าน', 'ตึกแถว 5 ล้าน', 'ตึกแถว 10 ล้าน',
        'อาคารพาณิชย์ 5 ล้าน', 'อาคารพาณิชย์ 10 ล้าน', 'อาคารพาณิชย์ 20 ล้าน', 'อาคารพาณิชย์ 30 ล้าน',
        'ตึกแถวราคาถูก', 'อาคารพาณิชย์ราคาดี',
        'commercial under 5 million', 'commercial under 10 million',

        // Rental Prices (NEW!)
        'เช่า 20,000', 'เช่า 30,000', 'เช่า 50,000', 'เช่า 100,000',
        'rent 20k', 'rent 50k', 'เซ้งถูก', 'เซ้งด่วน',

        // Location Quality
        'ใจกลางเมือง', 'city center', 'ทำเลดี', 'prime location',
        'ใกล้ตลาด', 'near market', 'ย่านธุรกิจ', 'business district',
        'ชุมชนหนาแน่น', 'high traffic area', 'ใกล้ BTS', 'ใกล้ MRT',

        // Financing (NEW!)
        'ผ่อนได้', 'ดาวน์ต่ำ', 'เซ้งต่อ', 'เซ้งพร้อมกิจการ',
    ],

    // ========================================
    // 206: หอพัก/ห้องเช่า / Apartment for Rent
    // ========================================
    206: [
        // Thai General
        'หอพัก', 'ห้องเช่า', 'apartment for rent', 'แมนชั่น',
        'ห้องพักรายเดือน', 'ห้องพักรายวัน', 'หอพักหญิง', 'หอพักชาย',
        'หอพักหญิงอย่างเดียว', 'หอพักชายอย่างเดียว', 'หอพักแยกชั้น',

        // English General
        'dormitory', 'room for rent',
        'monthly rent', 'daily rent', 'student housing', 'mansion',

        // Room Types
        'ห้องแอร์', 'air con room', 'ห้องพัดลม', 'fan room',
        'ห้องเดี่ยว', 'single room', 'ห้องคู่', 'double room',
        'ห้องสตูดิโอ', 'studio room', '1 ห้องนอน', '1 bedroom apartment',

        // Features
        'มีเฟอร์นิเจอร์', 'furnished', 'ไม่มีเฟอร์', 'unfurnished',
        'มีครัว', 'kitchen', 'ห้องน้ำใน', 'private bathroom',
        'ห้องน้ำรวม', 'shared bathroom', 'ระเบียง', 'balcony',

        // More Room Features (NEW!)
        'มีตู้เย็น', 'refrigerator', 'มีทีวี', 'tv', 'มีเตียง', 'bed',
        'มีตู้เสื้อผ้า', 'wardrobe', 'มีเครื่องทำน้ำอุ่น', 'water heater',
        'ห้องใหม่', 'new room', 'ห้องรีโนเวท', 'renovated room',
        'ห้องสะอาด', 'clean room', 'ห้องกว้าง', 'spacious room',

        // Amenities
        'ฟรีไฟฟ้า', 'free electricity', 'ฟรีน้ำ', 'free water',
        'ฟรีอินเทอร์เน็ต', 'free wifi', 'free internet', 'รปภ24ชม', 'security',
        'เครื่องซักผ้าหยอดเหรียญ', 'coin laundry', 'ตู้น้ำหยอดเหรียญ',
        'ลิฟต์', 'elevator', 'ที่จอดรถ', 'parking',

        // Universities (NEW!)
        'ใกล้มหาวิทยาลัย', 'near university',
        'หอพักม.รามคำแหง', 'ห้องเช่ารามคำแหง', 'near ramkhamhaeng',
        'หอพักจุฬา', 'ห้องเช่าจุฬา', 'near chula', 'near chulalongkorn',
        'หอพักธรรมศาสตร์', 'ห้องเช่าธรรมศาสตร์', 'near thammasat',
        'หอพักม.เกษตร', 'ห้องเช่าเกษตรศาสตร์', 'near kasetsart',
        'หอพักลาดกระบัง', 'near ladkrabang', 'near kmitl',
        'หอพักมหิดล', 'near mahidol', 'หอพักศาลายา',
        'หอพักกรุงเทพ', 'near bangkok university', 'near rangsit',
        'หอพักอัสสัมชัญ', 'near abac', 'near assumption',
        'หอพักสยาม', 'near siam university',

        // Price Ranges (NEW!)
        'ห้องเช่า 2,000', 'ห้องเช่า 3,000', 'ห้องเช่า 4,000', 'ห้องเช่า 5,000',
        'ห้องเช่า 6,000', 'ห้องเช่า 7,000', 'ห้องเช่า 8,000', 'ห้องเช่า 10,000',
        'หอพักราคาถูก', 'หอพักราคาดี', 'ห้องเช่าราคาประหยัด',
        'room 3000', 'room 4000', 'room 5000', 'cheap dorm', 'affordable rent',

        // Bangkok Areas (NEW!)
        'หอพักบางนา', 'หอพักลาดพร้าว', 'หอพักรามคำแหง', 'หอพักสุขุมวิท',
        'หอพักรัชดา', 'หอพักพระราม 9', 'หอพักบางกะปิ', 'หอพักสำโรง',
        'หอพักอ่อนนุช', 'ห้องเช่าสุขุมวิท', 'ห้องเช่าลาดพร้าว',
        'หอพักแจ้งวัฒนะ', 'หอพักปิ่นเกล้า', 'หอพักราชพฤกษ์',

        // Location
        'ใกล้ bts', 'near bts', 'ใกล้ mrt', 'near mrt', 'ใกล้ตลาด', 'near market',
        'ใกล้ BTS ปุ่นนวัต', 'ใกล้ BTS อ่อนนุช', 'ใกล้ BTS บางนา',
        'ใกล้ MRT ลาดพร้าว', 'ใกล้ MRT รามคำแหง',
    ],

    // ========================================
    // 207: โกดัง/โรงงาน / Warehouse/Factory
    // ========================================
    207: [
        // Thai General
        'โกดัง', 'โรงงาน', 'โกดังให้เช่า', 'โรงงานขาย',
        'โกดังเปล่า', 'โรงงานสำเร็จรูป', 'มินิแฟคตอรี่', 'mini factory',

        // English General
        'warehouse', 'factory', 'industrial', 'storage',
        'warehouse for rent', 'factory for sale', 'distribution center',

        // Size
        'เนื้อที่', 'area', 'ไร่', 'rai', 'ตารางเมตร', 'sqm',

        // Specific Sizes (NEW!)
        'โกดัง 100 ตรม', 'โกดัง 200 ตรม', 'โกดัง 500 ตรม', 'โกดัง 1,000 ตรม',
        'โรงงาน 1 ไร่', 'โรงงาน 3 ไร่', 'โรงงาน 5 ไร่', 'โรงงาน 10 ไร่', 'โรงงาน 20 ไร่',

        // Features
        'เพดานสูง', 'high ceiling', 'ทางรถพ่วง', 'trailer access',
        'ลานจอด', 'parking lot', 'ลานกว้าง', 'wide yard',
        'โครงสร้างเหล็ก', 'steel structure', 'รับน้ำหนักได้', 'floor loading',

        // Utilities
        'ไฟฟ้า3เฟส', '3 phase power', 'ไฟฟ้าโรงงาน', 'industrial power',
        'ระบบน้ำ', 'water system', 'ถนนคอนกรีต', 'concrete road',
        'ใบรง4', 'factory license',

        // Warehouse Types (NEW!)
        'โกดังสินค้า', 'goods warehouse', 'โกดังแช่แข็ง', 'cold storage',
        'โกดังอุณหภูมิควบคุม', 'temperature controlled', 'โกดังสูง', 'high bay',
        'โกดังกระจายสินค้า', 'distribution center', 'โกดังอาหาร', 'food warehouse',

        // Factory Types (NEW!)
        'โรงงานอาหาร', 'food factory', 'โรงงานพลาสติก', 'plastic factory',
        'โรงงานสิ่งทอ', 'textile factory', 'โรงงานผลิต', 'manufacturing',
        'โรงงานประกอบ', 'assembly factory', 'โรงงานแปรรูป', 'processing plant',

        // Industrial Estates (NEW!)
        'นิคมอุตสาหกรรม', 'industrial estate', 'นิคม', 'estate',
        'นิคมบางปู', 'bangpoo industrial', 'นิคมอมตะนคร', 'amata nakorn',
        'นิคมเวลโกรว์', 'wellgrow industrial', 'นิคมบางชัน', 'bangchan',
        'นิคมลาดกระบัง', 'ladkrabang industrial', 'นิคมนวนคร', 'navanakorn',
        'นิคมปิ่นทอง', 'pinthong industrial', 'นิคมสยาม', 'siam eastern',
        'นิคมเกตเวย์', 'gateway city', 'นิคมโรจนะ', 'rojana industrial',
        'นิคม 304', '304 industrial park', 'นิคมไฮเทค', 'hi-tech',
        'นิคมเหมราชตะวันออก', 'hemaraj eastern', 'นิคม มาบตาพุด', 'map ta phut',

        // Provinces (NEW!)
        'โกดังสมุทรปราการ', 'โกดังชลบุรี', 'โกดังระยอง', 'โกดังปทุมธานี',
        'โกดังนนทบุรี', 'โกดังนครปฐม', 'โกดังบางนา', 'โกดังบางพลี',
        'โรงงานสมุทรปราการ', 'โรงงานชลบุรี', 'โรงงานระยอง',
        'โรงงานปทุมธานี', 'โรงงานนนทบุรี', 'โรงงานสระบุรี',

        // Price Ranges (NEW!)
        'โกดังเช่า 20,000', 'โกดังเช่า 50,000', 'โกดังเช่า 100,000', 'โกดังเช่า 200,000',
        'โรงงานขาย 10 ล้าน', 'โรงงานขาย 20 ล้าน', 'โรงงานขาย 50 ล้าน', 'โรงงานขาย 100 ล้าน',
        'warehouse rent 50k', 'warehouse rent 100k', 'factory 10 million', 'factory 20 million',

        // Location
        'ติดถนนใหญ่', 'main road access', 'พื้นที่สีม่วง', 'purple zone',
        'ใกล้ทางด่วน', 'near expressway', 'ใกล้ท่าเรือ', 'near port',
    ],

    // ========================================
    // 208: พื้นที่สำนักงาน / Office Space
    // ========================================
    208: [
        // Thai General
        'สำนักงาน', 'ออฟฟิศ', 'พื้นที่สำนักงาน', 'ออฟฟิศให้เช่า',
        'สำนักงานขาย', 'ออฟฟิศสวย', 'ออฟฟิศพร้อมเฟอร์', 'สำนักงานใหญ่',

        // English General
        'office', 'office space', 'office for rent',
        'office for sale', 'commercial office', 'hq', 'headquarter',

        // Types
        'ออฟฟิศชั้นเดียว', 'single floor', 'ออฟฟิศทั้งตึก', 'whole building',
        'ออฟฟิศห้อง', 'office unit', 'shared office', 'co-working',
        'serviced office', 'virtual office', 'startup office',

        // Features
        'ตกแต่งพร้อม', 'fully decorated', 'พาร์ทิชั่น', 'partition',
        'ห้องประชุม', 'meeting room', 'ห้องรับแขก', 'reception',
        'pantry', 'แพนทรี่', 'ที่จอดรถ', 'parking', 'ทางเข้าส่วนตัว',

        // Amenities
        'แอร์กลาง', 'central air', 'ลิฟต์', 'elevator',
        'อินเทอร์เน็ต', 'internet', 'high speed internet', 'fiber optic',
        'รปภ', 'security', 'cctv', 'key card access',

        // Specific Office Buildings (NEW!)
        'อาคารจัสมิน', 'jasmine city', 'อาคารสาทรซิตี้ทาวเวอร์', 'sathorn city tower',
        'อาคารสาทรสแควร์', 'sathorn square', 'อาคารสีลมคอมเพล็กซ์', 'silom complex',
        'อาคารเอ็มไพร์ทาวเวอร์', 'empire tower', 'อาคารควอนตัม', 'q house asoke',
        'อาคารเอไอเอ', 'aia tower', 'อาคารแอทสาทร', 'all seasons place',
        'อาคารสุขุมวิท', 'interchange tower', 'อาคารจี ทาวเวอร์', 'g tower',
        'อาคารเพลินจิต', 'park ventures', 'อาคารทรู', 'true digital park',
        'อาคารจัตุรัส จามจุรี', 'chamchuri square', 'อาคารมหานครเหนือ',

        // Bangkok Areas (NEW!)
        'ออฟฟิศสีลม', 'ออฟฟิศสาทร', 'ออฟฟิศอโศก', 'ออฟฟิศพร้อมพงษ์',
        'ออฟฟิศรัชดา', 'ออฟฟิศพระราม 9', 'ออฟฟิศลาดพร้าว', 'ออฟฟิศสุขุมวิท',
        'ออฟฟิศบางนา', 'ออฟฟิศศรีนครินทร์', 'ออฟฟิศเพชรบุรี', 'ออฟฟิศวงเวียนใหญ่',
        'ออฟฟิศแจ้งวัฒนะ', 'ออฟฟิศบางกะปิ', 'ออฟฟิศห้วยขวาง',
        'สำนักงานสีลม', 'สำนักงานสาทร', 'สำนักงานอโศก', 'สำนักงานพระราม 9',

        // BTS/MRT Stations (NEW!)
        'ใกล้ BTS สาทร', 'ใกล้ BTS ศาลาแดง', 'ใกล้ BTS ช่องนนทรี',
        'ใกล้ BTS สุรศักดิ์', 'ใกล้ BTS สะพานตากสิน',
        'ใกล้ BTS อโศก', 'ใกล้ BTS พร้อมพงษ์', 'ใกล้ BTS นานา',
        'ใกล้ BTS สยาม', 'ใกล้ BTS ชิดลม', 'ใกล้ BTS เพลินจิต',
        'ใกล้ MRT สี่ลม', 'ใกล้ MRT ลุมพินี', 'ใกล้ MRT สุขุมวิท',
        'ใกล้ MRT พระราม 9', 'ใกล้ MRT เพชรบุรี', 'ใกล้ MRT รัชดา',

        // Sizes (NEW!)
        'ออฟฟิศ 50 ตรม', 'ออฟฟิศ 100 ตรม', 'ออฟฟิศ 150 ตรม', 'ออฟฟิศ 200 ตรม',
        'ออฟฟิศ 300 ตรม', 'ออฟฟิศ 500 ตรม', 'ออฟฟิศ 1,000 ตรม',
        'office 100 sqm', 'office 200 sqm', 'office 500 sqm',
        'ออฟฟิศห้องเล็ก', 'ออฟฟิศห้องกลาง', 'ออฟฟิศห้องใหญ่',

        // Price Ranges (NEW!)
        'เช่า 20,000', 'เช่า 30,000', 'เช่า 50,000', 'เช่า 100,000',
        'เช่า 150,000', 'เช่า 200,000', 'เช่า 300,000', 'เช่า 500,000',
        'ขาย 5 ล้าน', 'ขาย 10 ล้าน', 'ขาย 20 ล้าน', 'ขาย 30 ล้าน',
        'office rent 50k', 'office rent 100k', 'office under 100k',
        'ออฟฟิศราคาดี', 'ออฟฟิศราคาถูก',

        // Location Quality
        'ใจกลางเมือง', 'cbd', 'central business district', 'ย่านธุรกิจ', 'business district',
        'ใกล้ bts', 'near bts', 'ใกล้ mrt', 'near mrt', 'ติดรถไฟฟ้า',
        'ทำเลดี', 'prime location', 'great location', 'ใจกลางสาทร', 'silom cbd',
    ]
}

// Legacy flat array (for backward compatibility)
export const COMPREHENSIVE_REAL_ESTATE_KEYWORDS =
    Object.values(REAL_ESTATE_SUBCATEGORY_KEYWORDS).flat()

/**
 * COMPREHENSIVE SPORTS & TRAVEL KEYWORDS - Category 12 (กีฬาและท่องเที่ยว)
 * 
 * Structure: Organized by SUBCATEGORY ID
 */

export const SPORTS_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 1201: BICYCLES / จักรยาน
    // ========================================
    1201: [
        // Types
        'จักรยาน', 'bicycle', 'bike',
        'จักรยานเสือหมอบ', 'road bike',
        'จักรยานเสือภูเขา', 'mountain bike', 'mtb',
        'จักรยานพับ', 'folding bike',
        'จักรยานไฮบริด', 'hybrid bike',
        'จักรยานฟิกเกียร์', 'fixed gear', 'fixie',
        'จักรยาน bmx', 'bmx',
        'จักรยานไฟฟ้า', 'electric bike', 'e-bike',
        'จักรยานแม่บ้าน', 'city bike',
        'จักรยานเด็ก', 'balance bike', 'ขาไถ',

        // Bike Components - Brakes
        'เบรคจักรยาน', 'brake', 'bike brake',
        'disc brake', 'เบรคดิสก์', 'hydraulic brake',
        'rim brake', 'v-brake',

        // Bike Components - Suspension & Fork
        'โช้คจักรยาน', 'suspension', 'shock',
        'fork', 'โช้คหน้า', 'front fork',

        // Bike Components - Gears
        'เกียร์จักรยาน', 'derailleur', 'gear',
        'cassette', 'เฟืองหลัง',
        'โซ่จักรยาน', 'chain', 'bike chain',

        // Bike Components - Handlebars
        'แฮนด์จักรยาน', 'handlebar',
        'drop bar', 'flat bar',

        // Parts - Original
        'เฟรมจักรยาน', 'frame set', 'ล้อจักรยาน', 'wheel set', 'carbon wheel',
        'ชุดขับ', 'groupset', 'shimano', 'sram', 'campagnolo',
        'หมวกจักรยาน', 'helmet', 'ชุดปั่นจักรยาน', 'cycling jersey',

        // Accessories - Lights & Safety
        'ไฟจักรยาน', 'bike light', 'ไฟหน้า', 'front light',
        'ไฟท้าย', 'tail light', 'rear light',
        'กระจกมองหลัง', 'bike mirror', 'mirror',
        'แตรจักรยาน', 'bell', 'bike bell',

        // Accessories - Storage & Bottles
        'ที่ขวดน้ำ', 'bottle cage', 'water bottle holder',
        'กระเป๋าจักรยาน', 'bike bag', 'saddle bag',
        'panniers', 'กระเป๋าข้างจักรยาน',
        'บังโคลนจักรยาน', 'mudguard', 'fender',

        // Maintenance & Tools - Tires
        'ยางจักรยาน', 'tire', 'bike tire',
        'ยางใน', 'tube', 'inner tube',
        'tubeless', 'ยางนอก',

        // Maintenance & Tools - Pump & Tools
        'ปั๊มจักรยาน', 'bike pump', 'floor pump',
        'ชุดซ่อมจักรยาน', 'repair kit', 'patch kit',
        'น้ำมันโซ่', 'chain lube', 'bike oil',
        'ชุดเครื่องมือ', 'tool kit', 'bike tools',

        // Safety Gear
        'แว่นจักรยาน', 'cycling glasses', 'bike glasses',
        'ถุงมือปั่นจักรยาน', 'cycling gloves',
        'สนับเข่า', 'knee pad',

        // Indoor Cycling
        'ที่ตั้งจักรยาน', 'bike trainer', 'smart trainer',
        'zwift', 'virtual cycling', 'indoor cycling',

        // Brands - Original
        'trek', 'specialized', 'giant', 'bianchi', 'cannondale', 'cervelo', 'pinarello',
        'brompton', 'mid-drive', 'dahon', 'turn', 'java', 'trin-x',

        // Thai Bike Terms
        'จักรยานมือสอง', 'second hand bike',
        'ขายจักรยาน', 'จักรยานราคาถูก',
    ],

    // ========================================
    // 1202: FITNESS / เครื่องออกกำลังกาย
    // ========================================
    1202: [
        // Machines
        'ลู่วิ่ง', 'lue wing', 'treadmill', 'ลู่วิ่งไฟฟ้า',
        'จักรยานออกกำลังกาย', 'exercise bike', 'spin bike',
        'เครื่องเดินวงรี', 'elliptical',
        'โฮมยิม', 'home gym', 'smith machine', 'power rack', 'บาร์โหน',
        'ม้านั่งยกน้ำหนัก', 'weight bench',

        // More Equipment
        'เครื่องพายเรือ', 'rowing machine', 'rower',
        'เครื่องนั่งบิดเอว', 'ab machine', 'abs trainer',
        'ถุงทราย', 'punching bag', 'boxing bag', 'heavy bag',
        'นวมชก', 'boxing gloves',

        // Free Weights / Accessories
        'ดัมเบล', 'dumbbell', 'บาร์เบล', 'barbell', 'แผ่นน้ำหนัก', 'weight plate',
        'kettlebell', 'ลูกตุ้ม',
        'เสื่อโยคะ', 'yoga mat', 'ลูกบอลโยคะ', 'yoga ball',
        'ยางยืดออกกำลังกาย', 'resistance band',
        'เชือกกระโดด', 'jump rope',
        'ฮูลาฮูป', 'hula hoop',

        // Wearables & Tech
        'smart watch', 'สมาร์ทวอทช์', 'smartwatch',
        'apple watch', 'samsung galaxy watch',
        'fitness tracker', 'นาฬิกาออกกำลังกาย',
        'heart rate monitor', 'เครื่องวัดชีพจร',
        'fitbit', 'garmin',

        // Supplements
        'โปรตีน', 'protein', 'whey protein',
        'bcaa', 'creatine',
        'pre-workout', 'post-workout',
        'อาหารเสริม', 'supplement', 'fitness supplement',

        // Clothing
        'ชุดออกกำลังกาย', 'workout clothes', 'gym clothes',
        'รองเท้าวิ่ง', 'running shoes',
        'กางเกงรัดกล้ามเนื้อ', 'compression pants', 'leggings',
        'เสื้อกีฬา', 'sports shirt', 'sports bra',

        // Recovery Tools
        'โฟมลูกกลิ้ง', 'foam roller',
        'massage ball', 'ลูกนวด',
        'เครื่องนวด', 'massage gun',

        // Brands - Original
        'decathlon', 'domyos', 'core fitness', 'xiaomi walkingpad', 'kingsmith',
        'jason', 'supersports',

        // Thai Fitness Terms
        'อุปกรณ์ฟิตเนส', 'อุปกรณ์โฮมยิม',
        'เครื่องออกกำลังกายมือสอง', 'second hand fitness',
    ],

    // ========================================
    // 1203: CAMPING / อุปกรณ์แคมป์ปิ้ง
    // ========================================
    1203: [
        // Shelter & Sleep
        'เต็นท์', 'tent', 'เต็นท์สนาม', 'เต็นท์โดม', 'ทาร์ป', 'tarp', 'ฟลายชีท', 'fly sheet',
        'ถุงนอน', 'sleeping bag', 'แผ่นรองนอน', 'berd camp',
        'เปล', 'hammock',

        // Furniture
        'เก้าอี้สนาม', 'cheer sanam', 'camping chair', 'เก้าอี้แคมป์ปิ้ง',
        'โต๊ะพับ', 'folding table', 'โต๊ะแคมป์ปิ้ง', 'โต๊ะสนาม',
        'รถเข็นแคมป์ปิ้ง', 'wagon',

        // Cooking & Light
        'เตาแก๊สปิคนิค', 'camping stove', 'เตาถ่าน',
        'ตะเกียง', 'lantern', 'ไฟฉาย', 'flashlight', 'headlamp',
        'กระติกน้ำแข็ง', 'cooler box', 'coolers', 'กล่องเก็บของ',

        // Navigation & Safety
        'เข็มทิศ', 'compass',
        'gps', 'เครื่อง gps', 'gps device',
        'แผนที่', 'map', 'trail map',
        'นกหวีด', 'whistle', 'emergency whistle',
        'มีดพก', 'pocket knife', 'มีด survival', 'survival knife',

        // Water & Food Storage
        'กระติกน้ำ', 'water bottle', 'ขวดน้ำ',
        'เครื่องกรองน้ำ', 'water filter', 'water purifier',
        'ชุดทำอาหาร', 'cookware', 'camping cookware',
        'กาต้มน้ำ', 'kettle', 'camping kettle',

        // Clothing
        'เสื้อกันลม', 'windbreaker',
        'เสื้อกันฝน', 'rain jacket', 'raincoat',
        'รองเท้าเดินป่า', 'hiking shoes', 'trekking shoes',

        // Backpacks & Bags
        'กระเป๋าเป้เดินป่า', 'backpack', 'hiking backpack',
        'เป้สะพายหลัง', 'rucksack', 'travel backpack',
        'กระเป๋ากันน้ำ', 'dry bag', 'waterproof bag',

        // Fire & Heat
        'ไม้ขีดไฟ', 'lighter', 'matches',
        'ฟืน', 'firewood',
        'เตาฟืน', 'wood stove',

        // Insect Protection
        'สเปรย์กันยุง', 'mosquito repellent', 'insect repellent',
        'มุ้ง', 'mosquito net',

        // Brands
        'coleman', 'coleman japan', 'naturehike', 'dod', 'snow peak',
        'nordisk', 'k2', 'decathlon', 'quechua', 'field & camp',

        // Thai Camping Terms
        'อุปกรณ์แคมป์ปิ้งครบชุด', 'complete camping set',
        'อุปกรณ์เดินป่า', 'hiking gear', 'trekking gear',
    ],

    // ========================================
    // 1204: SPORTS GEAR / อุปกรณ์กีฬา
    // ========================================
    1204: [
        // Racket Sports
        'แบดมินตัน', 'badminton', 'ไม้แบด', 'racket', 'ลูกแบด', 'yonex', 'lining', 'victor',
        'เทนนิส', 'tennis', 'ไม้เทนนิส', 'wilson', 'babolat', 'head',
        'ปิงปอง', 'table tennis', 'ไม้ปิงปอง', 'butterfly',

        // Team Sports
        'ฟุตบอล', 'football', 'soccer', 'ลูกฟุตบอล', 'รองเท้าสตั๊ด', 'studs',
        'บาสเกตบอล', 'basketball', 'ลูกบาส', 'molten', 'spalding',
        'วอลเลย์บอล', 'volleyball', 'mikasa',

        // Golf
        'กอล์ฟ', 'golf', 'ไม้กอล์ฟ', 'golf club', 'ถุงกอล์ฟ', 'golf bag',
        'driver', 'iron set', 'putter', 'wedge',
        'taylormade', 'titleist', 'callaway', 'ping', 'mizuno', 'honma',

        // Water Sports
        'ว่ายน้ำ', 'swimming', 'ชุดว่ายน้ำ', 'แว่นตาว่ายน้ำ',
        'ดำน้ำ', 'diving', 'mask', 'fin', 'ตีนกบ', 'scuba',
        'บอร์ด', 'surfboard', 'sup board', 'padle board',

        // Boxing & Martial Arts
        'มวย', 'boxing', 'muay thai', 'มวยไทย',
        'เทควันโด', 'taekwondo',
        'ยูโด', 'judo', 'karate', 'คาราเต้',
        'นวมมวย', 'boxing gloves', 'gloves',
        'ผ้าพันมือ', 'hand wraps',
        'ถุงทราย', 'punching bag', 'heavy bag',
        'เป้าถีบ', 'kick pad', 'thai pad',
        'ชุดมวยไทย', 'muay thai shorts',

        // Running
        'วิ่ง', 'running', 'marathon', 'มาราธอน',
        'รองเท้าวิ่ง', 'running shoes',
        'nike running', 'adidas running',
        'เบอร์วิ่ง', 'race bib',

        // Shooting & Archery
        'ยิงปืน', 'shooting',
        'ยิงธนู', 'archery', 'bow', 'arrow',

        // Climbing
        'ปีนผา', 'rock climbing', 'climbing',
        'climbing shoes', 'harness',

        // Fishing
        'ตกปลา', 'fishing',
        'เบ็ดตกปลา', 'fishing rod',
        'รอกตกปลา', 'fishing reel',
        'เหยื่อปลา', 'bait', 'lure',

        // Protective Gear
        'สนับแข้ง', 'shin guard',
        'ถุงมือโกล', 'goalkeeper gloves',
        'หน้ากากกีฬา', 'face mask', 'sports mask',

        // Pumps & Accessories
        'ปั๊มลูกฟุตบอล', 'ปั๊มลูกบาส', 'ปั๊มลม', 'ปั๊มลูกกีฬา',
        'air pump', 'ball pump', 'pump', 'ที่สูบลม', 'เครื่องสูบลม',
        'เข็มสูบลม', 'ball needle', 'ที่เป่าลม',

        // Thai Sports Terms
        'อุปกรณ์กีฬามือสอง', 'second hand sports',
        'อุปกรณ์กีฬาครบชุด', 'complete sports set',
    ],

    // ========================================
    // 1205: TRAVEL VOUCHERS / บัตรท่องเที่ยว
    // ========================================
    1205: [
        // Basic Vouchers
        'voucher', 'วอเชอร์', 'บัตรกำนัล', 'คูปอง',

        // Accommodations - Basic
        'บัตรที่พัก', 'hotel voucher', 'รีสอร์ท', 'โรงแรม',

        // Accommodations - Platforms
        'airbnb', 'agoda', 'booking.com',
        'บังกะโล', 'bungalow',
        'วิลล่า', 'villa', 'pool villa',
        'เกสท์เฮ้าส์', 'guesthouse',
        'โฮสเทล', 'hostel',

        // Tours & Packages
        'แพ็คเกจทัวร์', 'tour package', 'ทริปเที่ยว',
        'ตั๋วเครื่องบิน', 'airline ticket', 'flight ticket',

        // Destinations
        'เที่ยวทะเล', 'beach', 'sea trip',
        'เที่ยวภูเขา', 'mountain', 'mountain trip',
        'เที่ยวเมือง', 'city tour',
        'เที่ยวต่างประเทศ', 'international travel',

        // Activities
        'ดำน้ำ', 'diving trip', 'scuba diving',
        'ล่องแพ', 'rafting', 'white water rafting',
        'กระโดดร่ม', 'skydiving', 'parachute',
        'บันจี้จัมป์', 'bungee jump',
        'ซิปไลน์', 'zipline',

        // Transport
        'รถเช่า', 'car rental', 'rent a car',
        'มอเตอร์ไซค์เช่า', 'bike rental', 'motorcycle rental',

        // Attractions - Parks
        'บัตรสวนน้ำ', 'water park',
        'สวนสนุก', 'carnival magic', 'dream world',
        'สวนสัตว์', 'zoo',
        'พิพิธภัณฑ์', 'museum',
        'อควาเรียม', 'aquarium',

        // Spa & Dining
        'spa voucher', 'สปา',
        'บุฟเฟต์', 'buffet voucher',

        // Events
        'คอนเสิร์ต', 'concert ticket',
        'กีฬา', 'sports event', 'sport ticket',
        'เทศกาล', 'festival',

        // Thai Travel Terms
        'แพ็คเกจท่องเที่ยว', 'travel package',
        'ทัวร์ราคาถูก', 'budget tour',
        'โปรโมชั่นท่องเที่ยว', 'travel promotion',
    ],

    // ========================================
    // 1206: SKATE & ROLLER / สเก็ตและโรลเลอร์
    // ========================================
    1206: [
        // Skateboard Types
        'สเก็ตบอร์ด', 'skateboard', 'แผ่นสเก็ต',
        'เซิร์ฟสเก็ต', 'surfskate', 'geele', 'carver', 'yow',
        'ลองบอร์ด', 'longboard',

        // Inline Skates
        'โรลเลอร์เบรด', 'rollerblade', 'inline skate', 'รองเท้าสเก็ต',
        'roller skates', 'รองเท้าสเก็ต 4 ล้อ', 'quad skates',

        // Skateboard Parts
        'deck', 'สเก็ตบอร์ดเปล่า',
        'ล้อสเก็ต', 'wheels', 'skateboard wheels',
        'truck', 'แกนสเก็ต',
        'bearing', 'ลูกปืน',
        'grip tape', 'กระดาษทราย',

        // Balance
        'balance board',

        // Protective Gear
        'สนับเข่า', 'สนับศอก', 'protective gear',
        'สนับข้อมือ', 'wrist guard',
        'หมวกกันน็อค', 'skate helmet',

        // Brands
        'element', 'santa cruz',
        'vans', 'dc shoes',

        // Thai Skate Terms
        'สเก็ตบอร์ดมือสอง', 'second hand skateboard',
        'อุปกรณ์สเก็ต', 'skate gear',
    ],
}

// Combine all keywords for main category detection
export const COMPREHENSIVE_SPORTS_KEYWORDS = Object.values(SPORTS_SUBCATEGORY_KEYWORDS).flat()

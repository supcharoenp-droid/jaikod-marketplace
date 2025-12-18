/**
 * COMPREHENSIVE PETS KEYWORDS - Category 10 (สัตว์เลี้ยง)
 * 
 * Structure: Organized by SUBCATEGORY ID
 */

export const PETS_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 1001: DOGS / สุนัข
    // ========================================
    1001: [
        // Basic
        'สุนัข', 'หมา', 'dog', 'puppy', 'ลูกสุนัข', 'ลูกหมา',

        // Popular Breeds - Original
        'ปอม', 'pomeranian', 'ปอมเมอเรเนียน',
        'ชิ', 'chihuahua', 'ชิวาวา',
        'ไซบีเรียน', 'siberian husky', 'husky',
        'โกลเด้น', 'golden retriever',
        'เฟรนช์บูลด็อก', 'french bulldog', 'frenchie',
        'คอร์กี้', 'corgi', 'เวลช์คอร์กี้',
        'พุดเดิ้ล', 'poodle', 'toy poodle',
        'ชิราย', 'shiba inu', 'ชิบะ',
        'บีเกิ้ล', 'beagle',

        // More Popular Breeds
        'มัลทีส', 'maltese',
        'ยอร์ก', 'yorkshire terrier', 'yorkie',
        'ชิสุ', 'shih tzu',
        'ลาบราดอร์', 'labrador retriever', 'lab',
        'เจอร์แมนเชพเพิร์ด', 'german shepherd', 'gsd',
        'ดัชชุนด์', 'dachshund', 'ไส้กรอก',
        'ปั๊ก', 'pug', 'พั๊ก',
        'อลาสกัน มาลามิวต์', 'alaskan malamute',
        'ซามอยด์', 'samoyed',

        // Thai Breeds
        'บางแก้ว', 'bangkaew', 'ไทยหลังอาน', 'ไทยริดจ์แบ็ค', 'thai ridgeback',

        // Size Categories
        'สุนัขพันธุ์เล็ก', 'toy breed', 'small breed',
        'สุนัขพันธุ์กลาง', 'medium breed',
        'สุนัขพันธุ์ใหญ่', 'large breed', 'giant breed',

        // Age Groups
        'ลูกสุนัข', 'puppy', 'สุนัขเด็กน้อย',
        'สุนัขวัยรุ่น', 'junior dog',
        'สุนัขโต', 'adult dog',
        'สุนัขสูงอายุ', 'senior dog',

        // Gender & Neutering
        'สุนัขเพศผู้', 'male dog', 'สุนัขตัวผู้',
        'สุนัขเพศเมีย', 'female dog', 'สุนัขตัวเมีย',
        'ทำหมัน', 'neutered', 'spayed', 'castrated',

        // Coat Types
        'ขนยาว', 'long hair', 'long coat',
        'ขนสั้น', 'short hair', 'short coat',
        'ขนดัด', 'curly hair',

        // Registration & Pedigree
        'มีเอกสาร', 'pedigree', 'พันธุ์แท้', 'purebred',
        'ไม่มีเอกสาร', 'no papers',
        'สุนัขผสม', 'mixed breed', 'ลูกผสม', 'crossbreed',

        // Thai Dog Terms
        'สุนัขไทย', 'thai dog',
        'สุนัขพันธุ์แท้', 'purebred dog',
    ],

    // ========================================
    // 1002: CATS / แมว
    // ========================================
    1002: [
        // Basic
        'แมว', 'cat', 'kitten', 'ลูกแมว', 'เหมียว',

        // Popular Breeds - Original
        'สก็อตติช', 'scottish fold', 'หูพับ',
        'บริติช', 'british shorthair',
        'เปอร์เซีย', 'persian', 'เปอร์เซียน',
        'เมนคูน', 'maine coon',
        'bengal', 'เบงกอล',
        'sphynx', 'สฟิงซ์', 'แมวไร้ขน',
        'american shorthair',
        'munchkin', 'มั้นช์กิ้น', 'ขาสั้น',

        // Thai Cats
        'วิเชียรมาศ', 'siamese', 'สีสวาด', 'korat cat', 'ขาวมณี',

        // More Popular Breeds
        'ragdoll', 'แร็กดอลล์',
        'abyssinian', 'อะบิสซิเนียน',
        'exotic shorthair', 'เอ็กโซติก',
        'norwegian forest', 'นอร์วีเจียน',
        'russian blue', 'รัสเซียนบลู',

        // Coat Patterns & Colors
        'tabby', 'ลายเสือ', 'tabby cat',
        'tuxedo', 'ทักซีโด้', 'สีดำขาว',
        'calico', 'calico cat', 'สามสี', 'แมวสามสี',
        'orange', 'orange cat', 'สีส้ม', 'แมวสีส้ม',
        'grey', 'gray cat', 'สีเทา', 'แมวสีเทา',
        'black cat', 'แมวดำ', 'สีดำ',
        'white cat', 'แมวขาว', 'สีขาว',
        'tortoiseshell', 'ทอยตัส', 'tortie',

        // Age Groups
        'ลูกแมว', 'kitten', 'แมวเด็ก',
        'แมวโต', 'adult cat',
        'แมวสูงอายุ', 'senior cat',

        // Gender & Neutering
        'แมวเพศผู้', 'male cat', 'แมวผู้',
        'แมวเพศเมีย', 'female cat', 'แมวเมีย',
        'ทำหมัน', 'neutered', 'spayed', 'อาจ',

        // Eye Colors
        'ตาสีฟ้า', 'blue eyes',
        'ตาสีเหลือง', 'yellow eyes',
        'ตาสีเขียว', 'green eyes',
        'ตาสองสี', 'odd eyes', 'heterochromia',

        // Registration & Pedigree
        'มีเอกสาร', 'pedigree cat', 'พันธุ์แท้',
        'ไม่มีเอกสาร', 'no papers',
        'แมวผสม', 'mixed breed cat',

        // Thai Cat Terms
        'แมวไทย', 'thai cat',
        'แมวพันธุ์แท้', 'purebred cat',
    ],

    // ========================================
    // 1003: OTHER PETS / สัตว์เลี้ยงอื่นๆ
    // ========================================
    1003: [
        // Rabbits
        'กระต่าย', 'rabbit', 'bunny',
        'holland lop', 'ฮอลแลนด์ลอป',
        'กระต่ายดัตช์', 'dutch rabbit',
        'กระต่ายเลอป', 'lop rabbit',
        'กระต่ายแองโกร่า', 'angora rabbit',

        // Hamsters & Small Pets
        'หนูแฮมสเตอร์', 'hamster', 'syrian', 'winter white', 'roborovski',
        'ชูการ์', 'sugar glider', 'ชูการ์ไกลเดอร์',
        'เม่นแคระ', 'hedgehog',

        // Exotic Pets
        'chinchilla', 'ชินชิลล่า',
        'ferret', 'เฟอร์เร็ต',
        'แร็ต', 'rat', 'fancy rat',
        'guinea pig', 'กินนี่พิก',

        // Birds - Parrots
        'นก', 'bird', 'นกแก้ว', 'parrot',
        'ฟอพัส', 'forpus',
        'ซันคอนัวร์', 'sun conure',
        'นกกรงหัวขวาน', 'cockatiel',
        'นกเขา', 'lovebird',
        'นกยูงอินเดีย', 'indian ringneck',

        // Birds - Others
        'นกกะปูน', 'zebra finch',
        'นกขมิ้น', 'canary',

        // Fish - Aquarium
        'ปลา', 'fish', 'aquarium fish',
        'ปลาทอง', 'goldfish',
        'ปลากัด', 'betta', 'siamese fighting fish',
        'ปลาคาร์ฟ', 'koi',
        'ปลาหมอสี', 'guppy', 'กัปปี้',
        'มอลลี่', 'molly',
        'ปลาซิลเวอร์ชาร์ก', 'silver shark',
        'ปลาดาว', 'starfish',

        // Aquarium Types
        'ตู้ปลา', 'aquarium', 'fish tank',
        'ตู้ปลาน้ำจืด', 'freshwater',
        'ตู้ปลาน้ำเค็ม', 'saltwater', 'marine',
        'ปะการัง', 'coral',

        // Invertebrates
        'กุ้งเครฟิช', 'crayfish', 'crawfish',

        // Turtles & Tortoises
        'เต่า', 'turtle', 'tortoise',
        'ซูคาต้า', 'sulcata', 'sulcata tortoise',
        'เต่าหูแดง', 'red-eared slider',

        // Snakes
        'งู', 'snake', 'serpent',
        'ball python', 'ไพธอน',
        'corn snake', 'คอร์นสเนค',

        // Lizards & Reptiles
        'กิ้งก่า', 'lizard', 'gecko',
        'bearded dragon', 'บีร์ดดราก้อน',
        'iguana', 'อีกัวน่า',
        'chameleon', 'กิ้งก่าคามิเลียน',
        'monitor lizard', 'เหี้ย',
    ],

    // ========================================
    // 1004: PET SUPPLIES / อุปกรณ์สัตว์เลี้ยง
    // ========================================
    1004: [
        // Cages & Carriers
        'กรง', 'cage', 'กรงหมา', 'กรงแมว', 'กรงนก', 'กรงสัตว์',
        'กระเป๋าใส่สัตว์เลี้ยง', 'pet carrier', 'ตะกร้าใส่แมว', 'เป้ใส่แมว',
        'รถเข็นสัตว์เลี้ยง', 'pet stroller',

        // Bedding & Furniture
        'ที่นอนสัตว์เลี้ยง', 'pet bed', 'เบาะนอนหมา', 'เบาะนอนแมว',
        'คอนโดแมว', 'cat condo', 'cat tree',
        'ที่ลับเล็บแมว', 'scratcher', 'scratching post',

        // Litter & Bathroom
        'กระบะทราย', 'litter box', 'ห้องน้ำแมว',
        'ห้องน้ำอัตโนมัติ', 'automatic litter box', 'petree', 'pura x',
        'ทรายแมว', 'cat litter', 'ทรายเต้าหู้', 'ทรายภูเขาไฟ', 'kasty',

        // Feeding
        'ชามอาหาร', 'food bowl', 'water bowl',
        'เครื่องให้อาหารอัตโนมัติ', 'automatic feeder', 'smart feeder',
        'น้ำพุแมว', 'pet fountain', 'water fountain',

        // Leashes & Collars
        'ปลอกคอ', 'collar', 'dog collar', 'cat collar',
        'สายจูง', 'leash', 'dog leash', 'retractable leash',
        'สายรัดอก', 'harness', 'chest harness',

        // Clothing & Accessories
        'เสื้อหมา', 'dog clothes', 'เสื้อแมว', 'cat clothes',
        'รองเท้าหมา', 'dog boots',

        // Toys
        'ของเล่นหมา', 'dog toy', 'ของเล่นแมว', 'cat toy',
        'ไม้ตกแมว', 'cat wand', 'feather toy',
        'ลูกบอล', 'ball toy', 'rope toy',

        // Grooming Tools
        'แปรงขน', 'brush', 'pet brush',
        'slicker brush', 'แปรงขนหนา',
        'หวีเอาเห็บ', 'flea comb',
        'ที่ตัดเล็บ', 'nail clipper', 'nail trimmer',
        'ปัตตาเลี่ยน', 'pet clipper', 'grooming clipper',
        'เครื่องเป่าขน', 'pet dryer', 'hair dryer',
        'แชมพูหมา', 'dog shampoo', 'แชมพูแมว', 'cat shampoo',

        // Health & Hygiene
        'ยาหยอดเห็บหมัด', 'flea treatment', 'tick treatment',
        'ยาถ่ายพยาธิ', 'dewormer', 'worming tablet',
        'วิตามิน', 'supplement', 'pet vitamin',
        'ผ้าอ้อม', 'pet diaper', 'dog diaper',
        'belly band', 'สายรัดท้อง',
        'แผ่นปูพื้น', 'pee pad', 'training pad', 'puppy pad',

        // Tech Products
        'กล้องดูสัตว์เลี้ยง', 'pet camera', 'pet monitor',
        'gps tracker', 'ปลอกคอ gps', 'smart collar',
        'ปลอกคอกันเห็บ', 'flea collar', 'tick collar',

        // Training & Safety
        'คลิกเกอร์', 'clicker', 'training clicker',
        'กรงฝึก', 'crate', 'crate training', 'dog crate',
        'คอกสุนัข', 'playpen', 'pet fence', 'dog fence',

        // Dental Care
        'แปรงสีฟัน', 'toothbrush', 'pet toothbrush',
        'ยาสีฟัน', 'toothpaste', 'pet toothpaste',
        'ขนมขัดฟัน', 'dental chew', 'dental stick',

        // Travel Accessories
        'ที่รองปัสสาวะ', 'car seat cover', 'pet car seat',
        'ที่นั่งในรถ', 'car seat', 'booster seat',
        'เปล', 'pet hammock',

        // Thai Pet Supply Terms
        'อุปกรณ์สุนัข', 'dog supplies',
        'อุปกรณ์แมว', 'cat supplies',
        'ของใช้สัตว์เลี้ยง', 'pet products',
    ],

    // ========================================
    // 1005: PET FOOD / อาหารสัตว์
    // ========================================
    1005: [
        // Dog Food
        'อาหารหมา', 'dog food', 'อาหารลูกหมา', 'puppy food',

        // Cat Food
        'อาหารแมว', 'cat food', 'อาหารลูกแมว', 'kitten food',

        // Food Types
        'อาหารแห้ง', 'dry food', 'kibble',
        'อาหารเปียก', 'wet food',
        'อาหารสด', 'fresh food', 'raw food',
        'อาหารกระป๋อง', 'canned food',
        'อาหารซอง', 'pouch', 'pouch food',
        'บาร์ฟ', 'barf', 'biologically appropriate raw food',

        // Food Categories
        'อาหารเม็ด', 'เม็ดเล็ก', 'small kibble', 'เม็ดใหญ่', 'large kibble',
        'grain free', 'ไม่มีธัญพืช', 'grain-free',
        'organic', 'ออร์แกนิค',
        'hypoallergenic', 'สูตรแพ้ง่าย',

        // Health-Specific Food
        'อาหารลดน้ำหนัก', 'weight control', 'diet food',
        'อาหารโรคไต', 'renal diet', 'kidney care',
        'อาหารแมวผมร่วง', 'hairball control', 'hairball formula',
        'อาหารสุนัขผิวแพ้', 'sensitive skin', 'skin care',
        'อาหารเสริมข้อ', 'joint care', 'mobility support',

        // Premium Brands
        'royal canin', 'hill\'s', 'hills science diet',
        'purina one', 'pro plan',
        'orijen', 'acana',
        'taste of the wild', 'totw',
        'wellness', 'blue buffalo',
        'nutri source', 'farmina',

        // Thai & Regional Brands
        'maxima', 'tiffany', 'kaniva', 'buzz', 'neez',
        'friskies', 'whiskas', 'pedigree', 'smartheart',
        'jerhigh', 'เจอร์ไฮ',
        'คิตตี้', 'kitty', 'ปุ๋ย',

        // Cat Treats
        'ขนมแมว', 'cat treat', 'ขนมแมวเลีย', 'lickable treat',
        'ciao', 'เชา', 'churu',
        'me-o', 'มีโอ',

        // Dog Treats & Snacks
        'ขนมสุนัข', 'dog treat', 'dog snack',
        'เนื้อสันในแห้ง', 'jerky', 'chicken jerky',
        'กระดูกเทียม', 'dental stick', 'chew stick',
        'ขนมบ้วงปาก', 'breath freshener',

        // Milk & Supplements
        'นมแมว', 'cat milk',
        'นมลูกหมา', 'puppy milk', 'milk replacer',
        'โปรไบโอติก', 'probiotic',
        'โอเมก้า 3', 'omega 3', 'fish oil',

        // Other Pets Food
        'อาหารนก', 'bird food', 'อาหารปลา', 'fish food',
        'อาหารกระต่าย', 'rabbit food', 'timothy hay', 'alfalfa',

        // Thai Food Terms
        'อาหารสุนัขพันธุ์เล็ก', 'small breed food',
        'อาหารแมวโต', 'adult cat food',
        'อาหารคุณภาพพรีเมี่ยม', 'premium food',
    ],
}

// Combine all keywords for main category detection
export const COMPREHENSIVE_PETS_KEYWORDS = Object.values(PETS_SUBCATEGORY_KEYWORDS).flat()

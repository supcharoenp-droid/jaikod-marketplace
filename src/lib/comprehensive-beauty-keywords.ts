/**
 * COMPREHENSIVE BEAUTY KEYWORDS - Category 14 (เครื่องสำอางและความงาม)
 * 
 * Subcategories:
 * - 1401: เครื่องสำอาง (Makeup)
 * - 1402: ผลิตภัณฑ์ดูแลผิว (Skincare)
 * - 1403: ผลิตภัณฑ์ดูแลผม (Haircare)
 * - 1404: น้ำหอม (Perfumes)
 * - 1405: ผลิตภัณฑ์บำรุงร่างกาย (Body Care)
 * - 1406: อุปกรณ์ความงาม (Beauty Tools)
 */

export const BEAUTY_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 1401: MAKEUP / เครื่องสำอาง
    // ========================================
    1401: [
        // General
        'เครื่องสำอาง', 'makeup', 'make up', 'cosmetics', 'เมคอัพ',
        'แต่งหน้า', 'ของแต่งหน้า',

        // Face - Base
        'รองพื้น', 'foundation', 'liquid foundation', 'รองพื้นคุมมัน',
        'bb cream', 'บีบีครีม', 'cc cream', 'ซีซีครีม',
        'คุชชั่น', 'cushion', 'แป้งคุชชั่น', 'cushion compact',
        'แป้ง', 'powder', 'แป้งพัฟ', 'pressed powder', 'compact powder',
        'แป้งฝุ่น', 'loose powder', 'setting powder', 'translucent powder',
        'คอนซีลเลอร์', 'concealer', 'color corrector',
        'ไพรเมอร์', 'primer', 'face primer', 'pore primer',
        'setting spray', 'สเปรย์ตรึงเครื่องสำอาง', 'fixing spray',

        // Face - Color
        'บลัชออน', 'blush', 'blush on', 'ปัดแก้ม', 'cheek tint',
        'ไฮไลท์', 'highlighter', 'highlight', 'glow',
        'คอนทัวร์', 'contour', 'bronzer', 'บรอนเซอร์', 'shading',

        // Eyes
        'อายแชโดว์', 'eyeshadow', 'eye shadow', 'ตา',
        'พาเลทตา', 'eye palette', 'อายพาเลท', 'eyeshadow palette',
        'อายไลเนอร์', 'eyeliner', 'eye liner', 'ที่เขียนตา',
        'อายไลเนอร์น้ำ', 'liquid eyeliner', 'อายไลเนอร์ดินสอ', 'pencil eyeliner',
        'อายไลเนอร์เจล', 'gel eyeliner', 'waterproof eyeliner',
        'มาสคาร่า', 'mascara', 'ที่ปัดขนตา', 'ปัดขนตา',
        'มาสคาร่าใส', 'clear mascara', 'วอลุ่มมาสคาร่า', 'volume mascara',
        'ไฟเบอร์มาสคาร่า', 'fiber mascara', 'มาสคาร่ากันน้ำ', 'waterproof mascara',
        'กลิตเตอร์', 'glitter', 'ชิมเมอร์', 'shimmer',

        // Eyebrows
        'ดินสอเขียนคิ้ว', 'eyebrow pencil', 'brow pencil', 'ที่เขียนคิ้ว',
        'เจลคิ้ว', 'brow gel', 'eyebrow gel', 'มาสคาร่าคิ้ว',
        'ดินสอเขียนคิ้ว 4u2', 'ดินสอคิ้ว', 'ปากกาเขียนคิ้ว',
        'แว็กซ์คิ้ว', 'brow wax', 'สบู่คิ้ว', 'soap brow',

        // Eyelashes
        'ขนตาปลอม', 'false eyelashes', 'fake lashes', 'strip lashes',
        'ขนตาปลอมเอกซ์เทน', 'eyelash extensions', 'ต่อขนตา',
        'ขนตาช่อ', 'cluster lashes', 'ขนตาแม็กเน็ต', 'magnetic lashes',
        'กาวติดขนตา', 'lash glue', 'eyelash glue',

        // Lips
        'ลิปสติก', 'lipstick', 'ลิป', 'lip',
        'ลิปแมท', 'matte lipstick', 'matte lip', 'ลิปเนื้อแมท',
        'ลิปกลอส', 'lip gloss', 'ลิปกลอสใส',
        'ลิปทินท์', 'lip tint', 'ลิปทินต์', 'water tint',
        'ลิปแก้ว', 'glass lip', 'ลิปดิว', 'lip velvet',
        'ลิปมูส', 'lip mousse', 'ลิปลิควิด', 'liquid lipstick',
        'ลิปสติกเนื้อซาติน', 'satin lipstick', 'ลิปชีมเมอร์', 'shimmer lip',
        'ลิปออยล์', 'lip oil', 'ลิปบาล์ม', 'lip balm', 'ลิปมัน',
        'ดินสอเขียนขอบปาก', 'lip liner', 'lipliner',

        // Nails
        'ยาทาเล็บ', 'nail polish', 'nail lacquer', 'ทาเล็บ',
        'เจลทาเล็บ', 'gel polish', 'gel nail', 'เล็บเจล',
        'สีทาเล็บ', 'nail color', 'nail art', 'เล็บปลอม', 'fake nails',
        'เพ้นท์เล็บ', 'เล็บอะคริลิค', 'acrylic nail',
        'น้ำยาลบเล็บ', 'nail polish remover', 'nail remover',
        'ทาบำรุงเล็บ', 'nail care', 'cuticle oil',

        // Makeup Removal
        'เช็ดเครื่องสำอาง', 'makeup remover', 'cleansing water',
        'คลีนซิ่งวอเตอร์', 'micellar water', 'ไมเซล่าวอเตอร์',
        'คลีนซิ่งออยล์', 'cleansing oil', 'ออยล์ล้างเครื่องสำอาง',
        'คลีนซิ่งบาล์ม', 'cleansing balm', 'บาล์มล้างหน้า',
        'สำลี', 'cotton pad', 'ผ้าเช็ดเครื่องสำอาง',

        // Luxury Brands
        'mac', 'mac cosmetics', 'แม็ค', 'bobbi brown', 'บ๊อบบี้บราวน์',
        'nars', 'นาร์ส', 'charlotte tilbury', 'ชาร์ลอต ทิลเบอร์รี่',
        'dior beauty', 'dior makeup', 'ดิออร์', 'chanel beauty', 'chanel makeup',
        'ysl beauty', 'ysl lipstick', 'yves saint laurent',
        'tom ford beauty', 'ทอม ฟอร์ด', 'armani beauty', 'อาร์มานี่',
        'givenchy beauty', 'lancome makeup', 'ลังโคม',
        'hourglass', 'อาวกลาส', 'pat mcgrath', 'natasha denona',

        // Mid-Range Brands
        'urban decay', 'เออร์เบิน ดีเคย์', 'too faced', 'ทูเฟซ',
        'tarte', 'ทาร์ท', 'benefit', 'เบเนฟิท', 'fenty beauty', 'เฟนตี้',
        'rare beauty', 'แร ร์บิวตี้', 'elf', 'อีแอลเอฟ', 'nyx', 'นิกซ์',

        // Drugstore/Affordable
        'maybelline', 'เมย์เบลลีน', 'loreal', 'ลอรีอัล', 'revlon', 'เรฟลอน',
        'covergirl', 'wet n wild', 'essence', 'catrice',

        // Korean Brands
        '3ce', 'สามซีอี', 'rom&nd', 'romand', 'โรแมนด์',
        'etude house', 'อีทูดี้เฮาส์', 'laneige', 'ลาเนจ',
        'peripera', 'เพอริเพอร่า', 'bbia', 'เบีย', 'clio', 'คลิโอ',
        'moonshot', 'มูนช็อต', 'holika holika', 'the saem', 'เดอะ แซม',
        'toocoolforschool', 'ไอโอเปะ', 'iope',

        // Japanese Brands
        'shiseido makeup', 'shu uemura', 'ชู อุเอมูระ',
        'kate', 'เคท', 'majolica majorca', 'canmake', 'แคนเมค',
        'excel', 'dolly wink', 'dejavu', 'ดีจาวู',

        // Thai Brands
        'srichand', 'ศรีจันทร์', '4u2', 'โฟร์ยูทู', 'mistine', 'มิสทีน',
        'cute press', 'คิวท์เพรส', 'oriental princess', 'โอเรียนทอล พริ้นเซส',
        'sis2sis', 'soul skin', 'gino mccray', 'จิโน่',

        // Conditions
        'เครื่องสำอางมือสอง', 'เครื่องสำอางแท้', 'ของแท้ 100%',
        'เครื่องสำอางแบ่งขาย', 'แบ่งขายลิปสติก',
    ],

    // ========================================
    // 1402: SKINCARE / ผลิตภัณฑ์ดูแลผิว
    // ========================================
    1402: [
        // General
        'สกินแคร์', 'skincare', 'skin care', 'ผลิตภัณฑ์บำรุงผิว',
        'ดูแลผิว', 'บำรุงผิว', 'บำรุงผิวหน้า',

        // Cleansers
        'โฟมล้างหน้า', 'foam cleanser', 'face wash', 'ล้างหน้า',
        'เจลล้างหน้า', 'gel cleanser', 'cleanser', 'คลีนเซอร์',
        'ครีมล้างหน้า', 'cream cleanser', 'milk cleanser',
        'ล้างหน้าลดสิว', 'acne cleanser', 'ล้างหน้าคุมมัน', 'oil control',
        'double cleanse', 'ดับเบิ้ลคลีนส์',

        // Toners & Essences
        'โทนเนอร์', 'toner', 'โทเนอร์', 'น้ำตบ', 'lotion',
        'เอสเซนส์', 'essence', 'first treatment essence', 'fte',
        'สกินทรีทเมนท์', 'skin treatment',

        // Serums & Ampoules
        'เซรั่ม', 'serum', 'เซรั่มหน้าใส', 'face serum',
        'แอมพูล', 'ampoule', 'เข้มข้น', 'concentrated',
        'เซรั่มวิตามินซี', 'vitamin c serum', 'เซรั่มหน้าใส', 'brightening serum',
        'เซรั่มลดสิว', 'acne serum', 'เซรั่มลดริ้วรอย', 'anti-aging serum',
        'เซรั่มเติมน้ำ', 'hydrating serum', 'เซรั่มรูขุมขน', 'pore serum',

        // Moisturizers
        'ครีมบำรุง', 'face cream', 'moisturizer', 'มอยส์เจอไรเซอร์',
        'ครีมเพิ่มความชุ่มชื้น', 'hydrating cream', 'moisturizing cream',
        'เจลบำรุง', 'gel cream', 'water gel', 'gel moisturizer',
        'ครีมกลางคืน', 'night cream', 'ครีมกลางวัน', 'day cream',
        'ครีมบำรุงผิวมัน', 'oil-free moisturizer',
        'เอมัลชั่น', 'emulsion', 'lotion moisturizer',

        // Sunscreen
        'ครีมกันแดด', 'sunscreen', 'sunblock', 'sun cream',
        'กันแดดหน้า', 'face sunscreen', 'กันแดดสำหรับผิวหน้า',
        'spf', 'spf50', 'spf30', 'pa+++', 'broad spectrum',
        'กันแดดผิวมัน', 'กันแดดเนื้อบางเบา', 'lightweight sunscreen',
        'กันแดดทาตัว', 'body sunscreen', 'กันแดดสเปรย์', 'sunscreen spray',
        'กันแดดเนื้อน้ำนม', 'กันแดดเนื้อเจล', 'กันแดดโทนอัพ', 'tone up',

        // Masks
        'มาส์กหน้า', 'face mask', 'มาร์คหน้า', 'mask',
        'ชีทมาส์ก', 'sheet mask', 'sheetmask', 'มาส์กแผ่น',
        'มาส์กดินเหนียว', 'clay mask', 'มาส์กโคลน', 'mud mask',
        'สลิปปิ้งมาส์ก', 'sleeping mask', 'overnight mask',
        'มาส์กลอกหน้า', 'peel-off mask', 'มาส์กวอชออฟ', 'wash-off mask',
        'มาส์กไฮยา', 'มาส์กคอลลาเจน', 'มาส์กวิตามินซี',

        // Eye Care
        'อายครีม', 'eye cream', 'ครีมรอบดวงตา', 'eye care',
        'อายเซรั่ม', 'eye serum', 'ครีมลดถุงใต้ตา', 'eye bag cream',
        'ครีมลดริ้วรอยรอบดวงตา', 'anti-wrinkle eye cream',
        'อายแพทช์', 'eye patch', 'มาส์กตา', 'eye mask',

        // Lip Care
        'ลิปบาล์ม', 'lip balm', 'ลิปมัน', 'lip care',
        'ลิปทรีทเมนท์', 'lip treatment', 'ลิปสลีปปิ้งมาส์ก', 'lip sleeping mask',
        'ลิปสครับ', 'lip scrub', 'ลิปเอสเซนส์', 'lip essence',

        // Active Ingredients
        'retinol', 'เรตินอล', 'retinoid', 'เรติโนอิด',
        'vitamin c', 'วิตามินซี', 'ascorbic acid', 'ethyl ascorbic acid',
        'hyaluronic acid', 'ไฮยาลูโรนิก', 'ไฮยา', 'ha',
        'niacinamide', 'ไนอะซินาไมด์', 'vitamin b3',
        'aha', 'alpha hydroxy acid', 'glycolic acid', 'กรดไกโคลิก',
        'bha', 'salicylic acid', 'salicylic', 'กรดซาลิไซลิก',
        'pha', 'gluconolactone',
        'glypcolic acid', 'lactic acid', 'mandelic acid', 'กรดผลไม้',
        'peptide', 'เปปไทด์', 'copper peptide',
        'collagen', 'คอลลาเจน', 'marine collagen',
        'ceramide', 'เซราไมด์', 'squalane', 'สควาเลน',
        'centella', 'cica', 'ซิก้า', 'ใบบัวบก',
        'snail', 'สเนล', 'เมือกหอยทาก',
        'tea tree', 'ทีทรี', 'green tea', 'ชาเขียว',
        'arbutin', 'อาร์บูติน', 'tranexamic acid', 'ทราเน็กซามิก',

        // Skin Concerns
        'ลดสิว', 'anti-acne', 'acne treatment', 'รักษาสิว', 'ผิวสิว',
        'สิวอุดตัน', 'สิวอักเสบ', 'รอยสิว', 'acne scar',
        'ฝ้า', 'กระ', 'dark spot', 'จุดด่างดำ', 'pigmentation',
        'หน้าใส', 'brightening', 'ผิวกระจ่างใส', 'whitening', 'ไวท์เทนนิ่ง',
        'ลดริ้วรอย', 'anti-aging', 'anti-wrinkle', 'ต่อต้านริ้วรอย',
        'กระชับรูขุมขน', 'pore minimizer', 'รูขุมขนกว้าง',
        'ผิวแพ้ง่าย', 'sensitive skin', 'ผิวบอบบาง',
        'ผิวมัน', 'oily skin', 'คุมมัน', 'oil control',
        'ผิวแห้ง', 'dry skin', 'เติมน้ำ', 'hydration',
        'ผิวผสม', 'combination skin',

        // Luxury Skincare Brands
        'la mer', 'ลาแมร์', 'estee lauder', 'เอสเต้ลอเดอร์',
        'advanced night repair', 'anr', 'lancome', 'ลังโคม', 'genifique',
        'sk-ii', 'skii', 'sk2', 'เอสเค-ทู', 'facial treatment essence',
        'biotherm', 'ไบโอเธิร์ม', 'shiseido', 'ชิเซโด้',
        'la prairie', 'ลา แพรรี', 'sisley', 'ซิสเล่ย์',

        // Premium Skincare
        'kiehl\'s', 'คีลส์', 'clinique', 'คลีนิคข์', 'origins', 'ออริจินส์',
        'drunk elephant', 'ดรังค์ เอเลแฟนท์', 'tatcha', 'ทัตชะ',
        'sunday riley', 'ซันเดย์ ไรลีย์', 'paula\'s choice', 'พอลล่า ชอยส์',
        'the ordinary', 'ดิ ออร์ดินารี่', 'ordinary',

        // Dermatologist Brands
        'eucerin', 'ยูเซอริน', 'cetaphil', 'เซตาฟิล',
        'la roche posay', 'ลา โรช โพเซย์', 'vichy', 'วิชี่',
        'cerave', 'เซราวี', 'bioderma', 'ไบโอเดอร์มา',
        'avene', 'อาเวน', 'svr', 'uriage',

        // Korean Skincare
        'sulwhasoo', 'ซอลวาซู', 'history of whoo', 'ฮิสทอรี่ ออฟ วู',
        'amorepacific', 'อมอร์แปซิฟิก', 'hera', 'เฮร่า',
        'innisfree', 'อินนิสฟรี', 'laneige', 'ลาเนจ',
        'missha', 'มิชชา', 'iope', 'ไอโอเปะ',
        'belif', 'บิลีฟ', 'dr. jart', 'ดร.จาร์ท', 'banila co', 'บานิลา',
        'cosrx', 'คอสอาร์เอ็กซ์', 'some by mi', 'ซัมบายมี',
        'dear klairs', 'เคลียร์ส', 'isntree', 'round lab', 'anua',
        'beauty of joseon', 'บิวตี้ออฟโชซอน', 'numbuzin',
        'torriden', 'ทอร์ริเดน', 'medicube', 'เมดิคิวบ์',

        // Japanese Skincare
        'hada labo', 'ฮาดะ ลาโบะ', 'melano cc', 'เมลาโน',
        'naturie', 'เนเจอรี', 'curel', 'คิวเรล',
        'fancl', 'แฟนซีแอล', 'decorte', 'เดคอร์เต้',
        'albion', 'อัลเบี้ยน', 'ipsa', 'อิปซ่า',

        // Thai Skincare
        'mizumi', 'มิซูมิ', 'plantnery', 'แพลนเนอรี่',
        'dr. somchai', 'ดร.สมชาย', 'srichand', 'ศรีจันทร์',
        'smooth e', 'สมูท อี', 'hya', 'ไฮยา',

        // Conditions
        'สกินแคร์แท้', 'ของแท้', 'สกินแคร์มือสอง', 'สกินแคร์แบ่งขาย',
    ],

    // ========================================
    // 1403: HAIRCARE / ผลิตภัณฑ์ดูแลผม
    // ========================================
    1403: [
        // Shampoo
        'แชมพู', 'shampoo', 'ยาสระผม', 'สระผม',
        'แชมพูเร่งผมยาว', 'hair growth shampoo', 'แชมพูลดผมร่วง', 'anti-hair loss',
        'แชมพูขจัดรังแค', 'anti-dandruff shampoo', 'แชมพูลดผมมัน',
        'แชมพูเพิ่มวอลุ่ม', 'volume shampoo', 'แชมพูผมแห้งเสีย',
        'แชมพูสีม่วง', 'purple shampoo', 'แชมพูซิลเวอร์',
        'แชมพูปลอดซัลเฟต', 'sulfate free shampoo',
        'dry shampoo', 'แชมพูแห้ง',

        // Conditioner & Treatment
        'ครีมนวดผม', 'conditioner', 'นวดผม', 'hair conditioner',
        'ทรีทเม้นท์', 'hair treatment', 'treatment', 'ทรีทเมนท์',
        'แฮร์มาส์ก', 'hair mask', 'หมักผม',
        'ลีฟอินคอนดิชั่นเนอร์', 'leave-in conditioner',
        'ครีมบำรุงผม', 'hair cream',

        // Hair Oils & Serums
        'เซรั่มบำรุงผม', 'hair serum', 'เซรั่มผม',
        'ออยล์บำรุงผม', 'hair oil', 'ออยล์ใส่ผม',
        'อาร์แกนออยล์', 'argan oil', 'โมร็อคคานออยล์', 'moroccan oil',
        'น้ำมันมะพร้าว', 'coconut oil', 'น้ำมันอาร์แกน',

        // Hair Color
        'ยาย้อมผม', 'hair dye', 'hair color', 'ทำสีผม',
        'โฟมเปลี่ยนสีผม', 'hair color foam', 'bubble foam',
        'สีผมชั่วคราว', 'temporary hair color', 'สเปรย์เปลี่ยนสีผม',
        'ปิดผมขาว', 'gray hair coverage', 'ปิดผมหงอก',
        'ไฮไลท์ผม', 'highlights', 'บลีชผม', 'bleach',
        'ดีเวลลอปเปอร์', 'developer', 'ผงฟอก',

        // Styling
        'แว็กซ์', 'hair wax', 'wax', 'แว๊กซ์ผม',
        'เจลแต่งผม', 'hair gel', 'gel', 'โพเมด', 'pomade',
        'สเปรย์จัดทรง', 'hair spray', 'สเปรย์ฉีดผม',
        'มูสจัดทรง', 'hair mousse', 'mousse',
        'ครีมจัดทรง', 'styling cream', 'clay', 'เคลย์',
        'โฟมจัดทรง', 'styling foam', 'ช่วยจับลอน', 'curl cream',

        // Scalp Care
        'hair tonic', 'แฮร์โทนิค', 'โทนิคบำรุงผม',
        'ยาปลูกผม', 'hair regrowth', 'minoxidil', 'ไมน็อกซิดิล',
        'สครับหนังศีรษะ', 'scalp scrub', 'สครับผม',
        'เซรั่มบำรุงหนังศีรษะ', 'scalp serum', 'รักษาหนังศีรษะ', 'scalp treatment',
        'วิตามินบำรุงผม', 'hair vitamins', 'biotin', 'ไบโอติน',

        // Hair Loss
        'ป้องกันผมร่วง', 'anti-hair loss', 'ลดผมร่วง',
        'ผมบาง', 'thinning hair', 'ศีรษะล้าน', 'บำรุงรากผม',

        // Brands
        'kerastase', 'เคเรสตาส', 'olaplex', 'โอลาเพล็กซ์',
        'loreal professionnel', 'ลอรีอัลโปรเฟสชั่นแนล',
        'schwarzkopf', 'ชวาร์สคอฟ', 'wella', 'เวลล่า',
        'tresemme', 'เทรซาเม่', 'pantene', 'แพนทีน',
        'head & shoulders', 'เฮด แอนด์ โชว์เดอร์ส',
        'dove', 'โดฟ', 'herbal essences', 'เฮอร์บัลเอสเซ้นส์',
        'daeng gi meo ri', 'แดงกีโมรี', 'ryo', 'เรียว', 'tsubaki', 'ซึบากิ',
        'moroccanoil', 'โมร็อคคานออยล์', 'oribe', 'aveda', 'อเวด้า',
        'bumble and bumble', 'living proof', 'redken', 'matrix',
        'joico', 'ปลูกผมเร่งผมยาว', 'แพนการ์ด', 'แม่สูตร',

        // Conditions
        'ผลิตภัณฑ์ดูแลผมแท้', 'ของแท้', 'นำเข้า',
    ],

    // ========================================
    // 1404: PERFUMES / น้ำหอม
    // ========================================
    1404: [
        // General
        'น้ำหอม', 'perfume', 'fragrance', 'กลิ่นหอม',
        'โคโลญ', 'cologne', 'parfum',
        'edp', 'eau de parfum', 'โอ เดอ ปาร์ฟูม',
        'edt', 'eau de toilette', 'โอ เดอ ทอยเลต',
        'extrait', 'parfum extrait', 'elixir',

        // Types
        'น้ำหอมผู้ชาย', 'men perfume', 'men fragrance', 'สำหรับผู้ชาย',
        'น้ำหอมผู้หญิง', 'women perfume', 'women fragrance', 'สำหรับผู้หญิง',
        'น้ำหอม unisex', 'นิช', 'niche perfume', 'niche fragrance',
        'designer perfume', 'น้ำหอมแบรนด์', 'luxury perfume',

        // Format
        'น้ำหอมแบ่งขาย', 'decant', 'ดีแคนท์', 'vial', 'ขวดแบ่ง',
        'travel size', 'ขนาดพกพา', 'mini perfume',
        'น้ำหอมขนาดทดลอง', 'sample', 'แซมเปิล', 'tester',
        'set น้ำหอม', 'perfume set', 'gift set',

        // Body Mist
        'body mist', 'บอดี้มิสท์', 'body spray', 'สเปรย์ตัว',
        'หอมตัว', 'กลิ่นตัว',

        // Scent Families
        'กลิ่นหอมหวาน', 'sweet', 'กลิ่นดอกไม้', 'floral',
        'กลิ่นผลไม้', 'fruity', 'กลิ่นสดชื่น', 'fresh',
        'กลิ่นวู้ดดี้', 'woody', 'กลิ่นไม้', 'กลิ่นหนักแน่น',
        'กลิ่นมัสกี้', 'musky', 'กลิ่นเซ็กซี่', 'sensual',
        'กลิ่นสะอาด', 'clean', 'กลิ่นผู้ดี', 'expensive', 'luxurious',
        'oud', 'อูด', 'กลิ่นอาหรับ', 'Arabian perfume',
        'amber', 'อำพัน', 'vanilla', 'วานิลลา',
        'aquatic', 'กลิ่นทะเล', 'marine', 'oceanic',
        'gourmand', 'กูร์มอง', 'กลิ่นหวาน',
        'oriental', 'โอเรียลนัล', 'spicy', 'กลิ่นเครื่องเทศ',

        // Luxury Brands
        'dior', 'ดิออร์', 'sauvage', 'ซาวาจ', 'miss dior', 'jadore', 'ฌาดอร์',
        'chanel', 'ชาแนล', 'chanel no 5', 'coco mademoiselle', 'bleu de chanel',
        'hermes', 'แอร์เมส', 'terre d hermes', 'twilly',
        'gucci', 'กุชชี่', 'gucci bloom', 'gucci guilty',
        'prada', 'ปราด้า', 'candy', 'luna rossa',
        'ysl', 'yves saint laurent', 'อิฟแซงต์โลรองต์', 'libre', 'black opium',
        'versace', 'แวร์ซาเช่', 'eros', 'bright crystal',
        'dolce gabbana', 'd&g', 'the one', 'light blue',
        'burberry', 'เบอร์เบอร์รี่', 'burberry brit', 'her',
        'armani', 'อาร์มานี่', 'acqua di gio', 'si',
        'tom ford', 'ทอม ฟอร์ด', 'tobacco vanille', 'oud wood', 'lost cherry',

        // Niche Brands
        'creed', 'ครีด', 'aventus', 'อเวนตัส', 'viking', 'green irish tweed',
        'maison francis kurkdjian', 'mfk', 'baccarat rouge', 'br540',
        'jo malone', 'โจ มาโลน', 'english pear', 'wood sage',
        'byredo', 'ไบรีโด', 'diptyque', 'ดิปทีค',
        'le labo', 'เลอ ลาโบ', 'santal 33',
        'parfums de marly', 'pdm', 'layton', 'delina',
        'initio', 'อินิซิโอ', 'xerjoff', 'เซอร์จอฟฟ์',
        'amouage', 'อามัวจ', 'memo', 'เมโม่',

        // Designer Brands
        'ck', 'calvin klein', 'แคลวินไคลน์', 'ck one', 'ck be', 'eternity',
        'davidoff', 'cool water', 'คูลวอเตอร์',
        'carolina herrera', 'good girl', 'ch', '212',
        'hugo boss', 'boss bottled', 'บอส',
        'montblanc', 'มงต์บลังค์', 'explorer', 'legend',
        'ralph lauren', 'polo', 'โปโล',
        'jimmy choo', 'lanvin', 'ลองแวง', 'eclat',
        'chloe', 'โคลเอ้', 'narciso rodriguez', 'นาร์ซีโซ',

        // Thai/Local
        'น้ำหอมแบ่งขายไทย', 'พร้อมส่ง', 'ส่งจากไทย',

        // Conditions
        'น้ำหอมแท้', 'ของแท้ 100%', 'ผลิตใหม่', 'batch ใหม่',
    ],

    // ========================================
    // 1405: BODY CARE / ผลิตภัณฑ์บำรุงร่างกาย
    // ========================================
    1405: [
        // Body Lotion
        'ครีมทาผิว', 'body lotion', 'โลชั่น', 'lotion',
        'โลชั่นทาตัว', 'body cream', 'บอดี้ครีม',
        'body butter', 'บอดี้บัตเตอร์', 'ครีมบำรุงผิว',
        'ครีมทาตัวขาว', 'whitening body lotion', 'ทาตัวขาว',
        'ครีมกระจ่างใส', 'brightening body', 'ครีมหน้าใสตัวใส',
        'ครีมบำรุงผิวกาย', 'body moisturizer',

        // Body Wash
        'สบู่', 'soap', 'bar soap', 'สบู่ก้อน',
        'ครีมอาบน้ำ', 'body wash', 'shower cream', 'ชาวเวอร์',
        'สบู่เหลว', 'shower gel', 'liquid soap',
        'สบู่ก้อน', 'bar soap', 'สบู่ทำมือ', 'handmade soap',
        'สบู่เหลวตัว', 'body cleanser', 'อาบน้ำ',

        // Body Scrub
        'สครับผิว', 'body scrub', 'scrub', 'ขัดผิว',
        'สครับเกลือ', 'salt scrub', 'สครับน้ำตาล', 'sugar scrub',
        'สครับกาแฟ', 'coffee scrub', 'ขมิ้นสครับ',

        // Deodorant
        'โรลออน', 'roll on', 'deodorant', 'ดีโอโดแรนท์',
        'ระงับกลิ่นกาย', 'antiperspirant', 'สเปรย์ระงับกลิ่น',
        'สติ๊กระงับกลิ่น', 'deodorant stick',
        'ครีมระงับกลิ่น', 'deodorant cream',
        'ระงับกลิ่นรักแร้', 'underarm', 'รักแร้ขาว',

        // Bath Products
        'bath bomb', 'บาธบอมบ์', 'บอมบ์อาบน้ำ',
        'bath salt', 'เกลืออาบน้ำ', 'บาธซอลท์',
        'bubble bath', 'ฟองอาบน้ำ', 'bath foam',
        'bath oil', 'น้ำมันอาบน้ำ',
        'shower oil', 'น้ำมันอาบ',

        // Hand & Foot Care
        'ครีมทามือ', 'hand cream', 'แฮนด์ครีม',
        'เจลล้างมือ', 'hand sanitizer', 'แอลกอฮอล์ล้างมือ',
        'ครีมทาเท้า', 'foot cream', 'ฟุตครีม',
        'สครับเท้า', 'foot scrub', 'ที่ขัดเท้า', 'foot file',

        // Special Treatments
        'น้ำมันมะพร้าว', 'coconut oil', 'virgin coconut oil', 'vco',
        'ว่านหางจระเข้', 'aloe vera', 'aloe vera gel', 'เจลว่านหางจระเข้',
        'ครีมทาแตกลาย', 'stretch mark cream', 'ลดรอยแตกลาย',
        'bio oil', 'ไบโอ ออยล์', 'น้ำมันทาผิว',
        'body oil', 'บอดี้ออยล์', 'น้ำมันบำรุงผิว',
        'ครีมกันแดดทาตัว', 'body sunscreen',

        // Intimate Care
        'ผลิตภัณฑ์ทำความสะอาดจุดซ่อนเร้น', 'feminine wash',
        'ผลิตภัณฑ์สำหรับผู้หญิง', 'intimate care',

        // Brands
        'vaseline', 'วาสลีน', 'nivea', 'นีเวีย',
        'jergens', 'เจอร์เกนส์', 'aveeno', 'อาวีโน่',
        'eucerin body', 'ยูเซอริน', 'cetaphil body',
        'lubriderm', 'gold bond',
        'bath & body works', 'บาธแอนด์บอดี้เวิร์คส์', 'bbw',
        'l\'occitane', 'ล็อกซิทาน', 'the body shop', 'เดอะบอดี้ช็อป',
        'lush', 'ลัช', 'sabon', 'ซาบอน',
        'dove body', 'โดฟ', 'johnson', 'จอห์นสัน',
        'bhaesaj', 'เภสัช', 'white', 'สบู่ไวท์',
        'snail white', 'สเนลไวท์', 'ภูมิพฤกษา', 'เทพไทย',

        // Conditions
        'ครีมทาตัวมือสอง', 'ครีมทาตัวแท้',
    ],

    // ========================================
    // 1406: BEAUTY TOOLS / อุปกรณ์ความงาม
    // ========================================
    1406: [
        // Hair Tools
        'ไดร์เป่าผม', 'hair dryer', 'blow dryer', 'ไดร์', 'เครื่องเป่าผม',
        'dyson supersonic', 'ไดสัน', 'ghd', 'babyliss',
        'ที่หนีบผม', 'hair straightener', 'flat iron', 'เครื่องหนีบผม',
        'เครื่องรีดผม', 'hair iron', 'straightening iron',
        'ที่ม้วนผม', 'curling iron', 'curling wand', 'แกนม้วนผม',
        'ม้วนผมอัตโนมัติ', 'automatic curler', 'dyson airwrap', 'แอร์แรป',
        'วิกผม', 'wig', 'วิกผมสังเคราะห์', 'วิกผมแท้',
        'ต่อผม', 'hair extension', 'คลิปต่อผม', 'clip-in extensions',
        'แปรงผม', 'hairbrush', 'หวี', 'comb', 'หวีแปรง',
        'หวีม้วนผม', 'round brush', 'แปรงไดร์ผม',

        // Makeup Brushes
        'แปรงแต่งหน้า', 'makeup brush', 'make up brush', 'แปรง',
        'ชุดแปรงแต่งหน้า', 'brush set', 'makeup brush set',
        'แปรงรองพื้น', 'foundation brush', 'แปรงคอนซีลเลอร์',
        'แปรงปัดแก้ม', 'blush brush', 'แปรงไฮไลท์',
        'แปรงตา', 'eyeshadow brush', 'แปรงอายแชโดว์',
        'แปรงลงแป้ง', 'powder brush', 'แปรงแป้งฝุ่น',
        'แปรงคอนทัวร์', 'contour brush', 'แปรงบรอนเซอร์',
        'ฟองน้ำแต่งหน้า', 'makeup sponge', 'beauty blender', 'ไข่ตี',
        'พัฟแป้ง', 'powder puff', 'puff', 'พัฟซิลิโคน',
        'ที่ทำความสะอาดแปรง', 'brush cleaner', 'ล้างแปรง',

        // Face Tools
        'กระจกแต่งหน้า', 'makeup mirror', 'vanity mirror',
        'กระจกมีไฟ', 'lighted mirror', 'led mirror',
        'กระจกขยาย', 'magnifying mirror',
        'เครื่องล้างหน้า', 'facial cleansing device', 'เครื่องทำความสะอาดหน้า',
        'foreo', 'ฟอริโอ', 'luna', 'clarisonic', 'facial brush',
        'เครื่องนวดหน้า', 'facial massager', 'เครื่องยกกระชับ',
        'กัวซา', 'gua sha', 'เครื่องมือขูดหน้า',
        'jade roller', 'โรลเลอร์หยก', 'face roller', 'โรลเลอร์หน้า',
        'ไอซ์โรลเลอร์', 'ice roller', 'ลูกกลิ้งเย็น',

        // Advanced Tools
        'เครื่องนวด ems', 'ems device', 'microcurrent',
        'led mask', 'มาส์กไฟ led', 'light therapy',
        'facial steamer', 'เครื่องนึ่งหน้า', 'face steamer',
        'เครื่องดูดสิว', 'blackhead remover', 'pore vacuum',
        'เครื่องแคะสิว', 'comedone extractor',

        // Hair Removal
        'เครื่องกำจัดขน', 'hair removal', 'epilator', 'เครื่องถอนขน',
        'เครื่องโกนขน', 'shaver', 'electric shaver',
        'ipl', 'เครื่องเลเซอร์', 'laser hair removal', 'แว็กซ์ขน',
        'wax strip', 'แผ่นแว็กซ์', 'sugar wax',
        'แว็กซ์ขนจมูก', 'nose wax', 'แว็กซ์ขนหู',

        // Nail Tools
        'กรรไกรตัดเล็บ', 'nail clipper', 'ที่ตัดเล็บ',
        'ที่ตะไบเล็บ', 'nail file', 'ตะไบเล็บ',
        'ที่ดันหนังเล็บ', 'cuticle pusher',
        'ชุดทำเล็บ', 'manicure set', 'pedicure set',
        'เครื่องทำเล็บ', 'nail drill', 'เครื่องขัดเล็บ',
        'เครื่องอบเจล', 'uv lamp', 'led lamp', 'เครื่องอบเล็บเจล',

        // Eyelash Tools
        'ที่ดัดขนตา', 'eyelash curler', 'ดัดขนตา',
        'ที่หนีบขนตา', 'lash curler', 'heated lash curler',
        'ที่ติดขนตาปลอม', 'lash applicator',

        // Brands
        'dyson', 'ไดสัน', 'ghd', 'babyliss', 'เบบี้ลิส',
        'philips', 'ฟิลิปส์', 'panasonic', 'พานาโซนิค',
        'braun', 'บราวน์', 'remington', 'เรมิงตัน',
        'conair', 'revlon tools', 't3', 'amika',
        'foreo', 'nuface', 'ziip', 'theraface',
        'sigma', 'ซิกม่า', 'zoeva', 'โซอีว่า', 'real techniques',
        'morphe', 'มอร์ฟี', 'bh cosmetics', 'wet n wild brushes',

        // Conditions
        'อุปกรณ์แต่งหน้ามือสอง', 'อุปกรณ์แต่งหน้าใหม่',
    ],
}

// Combine all keywords for main category detection
export const COMPREHENSIVE_BEAUTY_KEYWORDS = Object.values(BEAUTY_SUBCATEGORY_KEYWORDS).flat()

/**
 * COMPREHENSIVE HOME & GARDEN KEYWORDS - Category 13 (บ้านและสวน)
 * 
 * Subcategories:
 * - 1301: เฟอร์นิเจอร์ (Furniture)
 * - 1302: ของตกแต่งบ้าน (Home Decor)
 * - 1303: ต้นไม้/ทำสวน (Gardening)
 * - 1304: เครื่องมือช่าง (Tools)
 * - 1305: อุปกรณ์สวน (Garden Equipment)
 */

export const HOME_GARDEN_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 1301: FURNITURE / เฟอร์นิเจอร์
    // ========================================
    1301: [
        // General
        'เฟอร์นิเจอร์', 'furniture', 'เครื่องเรือน', 'ของแต่งบ้าน',

        // Sofas
        'โซฟา', 'sofa', 'โซฟาเบด', 'sofa bed', 'โซฟาปรับนอน', 'โซฟาพับได้',
        'โซฟาหนัง', 'leather sofa', 'โซฟาผ้า', 'fabric sofa',
        'โซฟา 2 ที่นั่ง', 'โซฟา 3 ที่นั่ง', 'loveseat', 'sectional sofa',
        'โซฟาตัวแอล', 'l-shaped sofa', 'อาร์มแชร์', 'armchair', 'เก้าอี้โซฟา',
        'โซฟาบีนแบ็ก', 'bean bag', 'บีนแบ็ก', 'lazy sofa',

        // Beds
        'เตียง', 'bed', 'เตียงนอน', 'bedroom bed',
        'เตียง 6 ฟุต', 'king bed', 'เตียง 5 ฟุต', 'queen bed',
        'เตียง 3.5 ฟุต', 'single bed', 'เตียงเดี่ยว',
        'เตียง 2 ชั้น', 'bunk bed', 'loft bed', 'เตียงลอย',
        'เตียงพับ', 'folding bed', 'เตียงเสริม', 'murphy bed',
        'เตียงเหล็ก', 'metal bed', 'เตียงไม้', 'wooden bed',
        'หัวเตียง', 'headboard', 'ปลายเตียง', 'footboard',

        // Mattresses
        'ที่นอน', 'mattress', 'ฟูก', 'futon',
        'ที่นอนยางพารา', 'latex mattress', 'ที่นอนสปริง', 'spring mattress',
        'ที่นอนเมมโมรี่โฟม', 'memory foam', 'ที่นอนโฟม', 'foam mattress',
        'ที่นอน pocket spring', 'ที่นอนพ็อคเก็ตสปริง',
        'topper', 'ท็อปเปอร์', 'mattress topper', 'ที่นอนเสริม',
        'ที่นอนปิกนิก', 'ที่นอนพับได้', 'ที่นอนญี่ปุ่น',

        // Wardrobes & Storage
        'ตู้เสื้อผ้า', 'wardrobe', 'closet', 'ตู้เก็บเสื้อผ้า',
        'ตู้เสื้อผ้าไม้', 'ตู้เสื้อผ้าเหล็ก', 'ตู้เสื้อผ้าผ้า',
        'walk-in closet', 'วอล์คอินคลอเซ็ท', 'ห้องแต่งตัว',
        'ตู้ลิ้นชัก', 'dresser', 'chest of drawers', 'ตู้ 5 ลิ้นชัก',
        'ตู้เก็บของ', 'storage cabinet', 'ตู้อเนกประสงค์',
        'ตู้รองเท้า', 'shoe cabinet', 'ชั้นวางรองเท้า', 'shoe rack',

        // Tables
        'โต๊ะ', 'table', 'โต๊ะทำงาน', 'desk', 'work desk', 'office desk',
        'โต๊ะคอม', 'computer desk', 'โต๊ะคอมพิวเตอร์', 'gaming desk',
        'โต๊ะกินข้าว', 'dining table', 'โต๊ะอาหาร', 'kitchen table',
        'โต๊ะกลาง', 'coffee table', 'โต๊ะกลางห้องนั่งเล่น',
        'โต๊ะข้างเตียง', 'nightstand', 'bedside table', 'โต๊ะหัวเตียง',
        'โต๊ะเครื่องแป้ง', 'vanity table', 'dressing table', 'โต๊ะแต่งหน้า',
        'โต๊ะพับ', 'folding table', 'โต๊ะพับได้',
        'โต๊ะปรับระดับ', 'adjustable desk', 'standing desk', 'sit-stand desk',
        'โต๊ะวางทีวี', 'tv stand', 'tv cabinet', 'ชั้นวางทีวี',

        // Chairs
        'เก้าอี้', 'chair', 'เก้าอี้ทำงาน', 'office chair', 'work chair',
        'เก้าอี้เกมมิ่ง', 'gaming chair', 'เก้าอี้เล่นเกม',
        'เก้าอี้ผู้บริหาร', 'executive chair', 'เก้าอี้สำนักงาน',
        'เก้าอี้ ergonomic', 'เก้าอี้ออโธปิดิกส์', 'ergonomic chair',
        'เก้าอี้ทานข้าว', 'dining chair', 'เก้าอี้กินข้าว',
        'เก้าอี้พับ', 'folding chair', 'เก้าอี้พลาสติก',
        'สตูล', 'stool', 'เก้าอี้บาร์', 'bar stool', 'เก้าอี้สูง',
        'เก้าอี้โยก', 'rocking chair', 'เก้าอี้นวด', 'massage chair',
        'เบาะรองนั่ง', 'seat cushion', 'หมอนรองหลัง', 'lumbar support',

        // Shelves
        'ชั้นวางของ', 'shelf', 'shelving', 'ชั้นเก็บของ',
        'ชั้นวางหนังสือ', 'bookshelf', 'bookcase', 'ตู้หนังสือ',
        'ชั้นวางติดผนัง', 'wall shelf', 'floating shelf', 'ชั้นลอย',
        'ตู้โชว์', 'display cabinet', 'vitrine', 'ตู้กระจก',
        'ชั้นวางเหล็ก', 'metal shelf', 'ชั้นวางไม้', 'wooden shelf',

        // Kitchen
        'เคาน์เตอร์', 'counter', 'kitchen counter', 'เคาน์เตอร์ครัว',
        'ตู้ครัว', 'kitchen cabinet', 'เครื่องครัวเบ็ดเตล็ด',
        'ซิงค์ล้างจาน', 'sink', 'kitchen sink', 'อ่างล้างจาน',
        'ชั้นวางจานชาม', 'dish rack', 'ที่คว่ำจาน',

        // Styles
        'เฟอร์นิเจอร์โมเดิร์น', 'modern furniture', 'สไตล์โมเดิร์น',
        'เฟอร์นิเจอร์วินเทจ', 'vintage furniture', 'สไตล์วินเทจ', 'retro',
        'scandinavian', 'สแกนดิเนเวียน', 'nordic', 'นอร์ดิก',
        'minimalist', 'มินิมอล', 'minimal', 'เรียบง่าย',
        'industrial', 'อินดัสเทรียล', 'ลอฟท์', 'loft',
        'japanese style', 'สไตล์ญี่ปุ่น', 'zen', 'เซน',
        'boho', 'bohemian', 'โบฮีเมียน', 'farmhouse', 'สไตล์ฟาร์มเฮาส์',

        // Materials
        'เฟอร์นิเจอร์ไม้', 'wooden furniture', 'ไม้สัก', 'teak', 'ไม้ยาง',
        'เฟอร์นิเจอร์เหล็ก', 'metal furniture', 'สแตนเลส', 'stainless',
        'เฟอร์นิเจอร์หวาย', 'rattan furniture', 'wicker', 'หวายเทียม',
        'เฟอร์นิเจอร์ผ้า', 'upholstered', 'กำมะหยี่', 'velvet',
        'ไม้อัด', 'plywood', 'mdf', 'particle board',

        // Brands
        'ikea', 'อิเกีย', 'sb furniture', 'sb', 'index living mall', 'index',
        'koncept', 'winner', 'modernform', 'โมเดอร์นฟอร์ม',
        'chic republic', 'ชิค รีพับบลิค', 'muji', 'มูจิ', 'nitori', 'นิโตริ',
        'la-z-boy', 'เลซี่บอย', 'apina', 'homepro', 'โฮมโปร',
        'slumberland', 'สลัมเบอร์แลนด์', 'dunlopillo', 'ดันล็อปปิลโล',
        'lotus', 'โลตัส', 'synda', 'ซินด้า', 'sealy', 'simmons',
        'ergo trend', 'sihoo', 'secret lab', 'anda seat',

        // Conditions
        'เฟอร์นิเจอร์มือสอง', 'used furniture', 'second hand furniture',
        'เฟอร์นิเจอร์มือ 1', 'เฟอร์นิเจอร์ใหม่', 'brand new furniture',
        'ประกอบเอง', 'diy assembly', 'พร้อมประกอบ', 'ready to assemble',
    ],

    // ========================================
    // 1302: HOME DECOR / ของตกแต่งบ้าน
    // ========================================
    1302: [
        // General
        'ของแต่งบ้าน', 'home decor', 'ของตกแต่งบ้าน', 'decoration',
        'ตกแต่งภายใน', 'interior decoration', 'interior design',

        // Curtains & Blinds
        'ผ้าม่าน', 'curtain', 'curtains', 'ม่านหน้าต่าง', 'window curtain',
        'ม่านจีบ', 'pleated curtain', 'ม่านตาไก่', 'grommet curtain',
        'ม่านพับ', 'roman blind', 'ม่านม้วน', 'roller blind',
        'มู่ลี่', 'venetian blind', 'blinds', 'ม่านไม้',
        'ม่านกันแดด', 'blackout curtain', 'ม่านโปร่ง', 'sheer curtain',
        'รางม่าน', 'curtain rod', 'curtain rail', 'ราวม่าน',

        // Carpets & Rugs
        'พรม', 'carpet', 'rug', 'พรมปูพื้น', 'floor carpet',
        'พรมเช็ดเท้า', 'door mat', 'welcome mat', 'พรมหน้าประตู',
        'พรมห้องนอน', 'bedroom rug', 'พรมห้องนั่งเล่น', 'living room rug',
        'พรมห้องครัว', 'kitchen rug', 'พรมห้องน้ำ', 'bath mat', 'bathroom rug',
        'พรมกันลื่น', 'anti-slip mat', 'non-slip rug',
        'พรมเปอร์เซีย', 'persian rug', 'พรมตุรกี', 'turkish rug',
        'พรมขนปุย', 'shaggy rug', 'fluffy rug', 'พรมขนยาว',
        'พรมทอมือ', 'handwoven rug', 'พรมผ้าทอ',
        'area rug', 'runner rug', 'พรมยาว', 'พรมทางเดิน',

        // Lighting
        'โคมไฟ', 'lamp', 'light', 'ไฟ', 'แสงสว่าง',
        'โคมไฟเพดาน', 'ceiling light', 'pendant light', 'โคมไฟแขวน',
        'โคมไฟตั้งโต๊ะ', 'table lamp', 'desk lamp', 'โคมไฟอ่านหนังสือ',
        'โคมไฟตั้งพื้น', 'floor lamp', 'standing lamp',
        'โคมระย้า', 'chandelier', 'crystal chandelier', 'โคมระย้าคริสตัล',
        'โคมไฟติดผนัง', 'wall lamp', 'wall sconce', 'ไฟติดผนัง',
        'ไฟดาวน์ไลท์', 'downlight', 'spotlight', 'สปอตไลท์',
        'หลอดไฟ', 'light bulb', 'bulb', 'หลอด led', 'led bulb',
        'smart bulb', 'หลอดไฟอัจฉริยะ', 'smart light', 'philips hue',
        'ไฟวอร์ม', 'warm light', 'ไฟเหลือง', 'ไฟคูล', 'cool light', 'ไฟขาว',
        'dimmer', 'สวิตช์หรี่ไฟ', 'ปรับแสง',
        'ไฟเส้น', 'led strip', 'strip light', 'ไฟ rgb', 'ไฟเปลี่ยนสี',
        'ไฟประดับ', 'fairy light', 'ไฟราว', 'string light',

        // Wall Decor
        'กรอบรูป', 'photo frame', 'picture frame', 'กรอบรูปไม้',
        'ภาพติดผนัง', 'wall art', 'ภาพวาด', 'painting', 'canvas print',
        'ภาพจิ๊กซอว์', 'ภาพสะสม', 'โปสเตอร์', 'poster',
        'นาฬิกาแขวน', 'wall clock', 'นาฬิกาติดผนัง', 'clock',
        'วอลเปเปอร์', 'wallpaper', 'กาวติดผนัง', 'wall sticker',
        'สติกเกอร์ติดผนัง', 'wall decal', 'ภาพสามมิติ', '3d wall art',
        'ชั้นวางติดผนัง', 'wall shelf', 'floating shelf',

        // Mirrors
        'กระจก', 'mirror', 'กระจกเต็มตัว', 'full length mirror',
        'กระจกแต่งตัว', 'dressing mirror', 'กระจกติดผนัง', 'wall mirror',
        'กระจกแต่งหน้า', 'vanity mirror', 'กระจกขยาย', 'magnifying mirror',

        // Vases & Flowers
        'แจกัน', 'vase', 'แจกันดอกไม้', 'flower vase',
        'แจกันเซรามิค', 'ceramic vase', 'แจกันแก้ว', 'glass vase',
        'ดอกไม้ปลอม', 'artificial flower', 'fake flower', 'faux flower',
        'ต้นไม้ปลอม', 'artificial plant', 'fake plant', 'faux plant',
        'ดอกไม้แห้ง', 'dried flower', 'กิ่งไม้ตกแต่ง',

        // Candles & Aromatics
        'เทียนหอม', 'scented candle', 'candle', 'เทียน',
        'ก้านไม้หอม', 'reed diffuser', 'diffuser', 'น้ำหอมปรับอากาศ',
        'ที่วางเทียน', 'candle holder', 'เชิงเทียน',
        'essential oil', 'น้ำมันหอมระเหย', 'อโรม่า', 'aroma',

        // Textiles & Bedding
        'ผ้าปูที่นอน', 'bed sheet', 'bedsheet', 'ผ้าปูเตียง',
        'ชุดเครื่องนอน', 'bedding set', 'ชุดผ้าปูที่นอน',
        'ปลอกหมอน', 'pillowcase', 'pillow cover', 'ปลอกหมอนหนุน',
        'หมอนอิง', 'cushion', 'throw pillow', 'หมอนตกแต่ง',
        'ปลอกหมอนอิง', 'cushion cover', 'หมอนอิงสำเร็จรูป',
        'ผ้าห่ม', 'blanket', 'ผ้านวม', 'duvet', 'comforter', 'ผ้าคลุมเตียง',
        'ผ้าคลุมโซฟา', 'sofa cover', 'ผ้าคลุมเก้าอี้', 'chair cover',
        'ผ้าปูโต๊ะ', 'tablecloth', 'table runner',

        // Storage & Organization
        'กล่องเก็บของ', 'storage box', 'กล่องพลาสติก', 'plastic box',
        'ตะกร้า', 'basket', 'ตะกร้าหวาย', 'rattan basket', 'ตะกร้าผ้า',
        'ที่จัดระเบียบ', 'organizer', 'กล่องจัดระเบียบ', 'storage organizer',
        'ที่แขวนของ', 'hook', 'ราวแขวน', 'hanging rack',
        'ถังขยะ', 'trash bin', 'ถังขยะแยกประเภท', 'recycle bin',

        // Decorative Items
        'รูปปั้น', 'statue', 'figurine', 'ฟิกเกอริน',
        'ของสะสม', 'collectible', 'ของตกแต่งมินิมอล',
        'กล่องดนตรี', 'music box', 'นาฬิกาตั้งโต๊ะ', 'table clock',
        'โมบาย', 'mobile', 'wind chime', 'กระดิ่งลม',

        // Brands
        'homepro', 'โฮมโปร', 'ikea', 'muji', 'nitori', 'franc franc',
        'bed bath beyond', 'zara home', 'h&m home',

        // Conditions
        'ของแต่งบ้านมือสอง', 'used home decor', 'ของแต่งบ้านใหม่',
    ],

    // ========================================
    // 1303: GARDENING / ต้นไม้และทำสวน
    // ========================================
    1303: [
        // General
        'ต้นไม้', 'plant', 'plants', 'ไม้ประดับ', 'ornamental plant',
        'ทำสวน', 'gardening', 'จัดสวน', 'garden',

        // Indoor Plants
        'ไม้ฟอกอากาศ', 'air-purifying plant', 'ต้นไม้ในร่ม', 'indoor plant',
        'ไม้มงคล', 'lucky plant', 'ต้นไม้มงคล', 'feng shui plant',
        'ต้นไม้ปลูกในบ้าน', 'houseplant', 'ต้นไม้ในห้อง',

        // Popular Plants
        'กระบองเพชร', 'cactus', 'แคคตัส', 'cacti',
        'สุคคิวเลนท์', 'succulent', 'กุหลาบหิน', 'echeveria',
        'บอนไซ', 'bonsai', 'ต้นไม้บอนไซ', 'bonsai tree',
        'มอนสเตอร่า', 'monstera', 'ใบสนุก', 'monstera deliciosa',
        'กล้วยด่าง', 'variegated banana', 'กล้วยแดง',
        'ยางอินเดีย', 'rubber plant', 'ฟิโลเดนดรอน', 'philodendron',
        'ไทรใบสัก', 'fiddle leaf fig', 'ลิ้นมังกร', 'snake plant', 'sansevieria',
        'พลูด่าง', 'pothos', 'พลู', 'เงินไหลมา',
        'โป๊ยเซียน', 'adenium', 'ชวนชม', 'desert rose',
        'กุหลาบ', 'rose', 'มะลิ', 'jasmine', 'กล้วยไม้', 'orchid',
        'วิลโลว์', 'willow', 'ใบเงิน', 'ใบนาค', 'ใบทอง',
        'ซานาดู', 'zanadu', 'selloum', 'แก้วกัลยา',
        'ต้นเศรษฐีเรือนใน', 'zz plant', 'เศรษฐีเรือนนอก',
        'ต้นวาสนา', 'dracaena', 'ดราเซน่า', 'มังกรวาสนา',

        // Outdoor Plants
        'หญ้า', 'grass', 'lawn', 'หญ้าสนาม', 'lawn grass',
        'หญ้าเทียม', 'artificial grass', 'synthetic turf',
        'หญ้าญี่ปุ่น', 'หญ้านวลน้อย', 'หญ้ามาเลเซีย',
        'ต้นปาล์ม', 'palm tree', 'ปาล์ม', 'ต้นมะพร้าว',
        'ต้นไผ่', 'bamboo', 'ไผ่', 'ต้นหมาก',

        // Vegetables & Herbs
        'ผักสวนครัว', 'vegetable', 'ปลูกผัก', 'vegetable garden',
        'สมุนไพร', 'herb', 'herbs', 'ต้นสมุนไพร',
        'โหระพา', 'basil', 'กะเพรา', 'thai basil', 'สะระแหน่', 'mint',
        'ผักชี', 'coriander', 'พริก', 'chili', 'มะเขือเทศ', 'tomato',
        'ต้นหอม', 'spring onion', 'กระเทียม', 'garlic',

        // Planting Supplies
        'กระถาง', 'pot', 'planter', 'กระถางต้นไม้', 'flower pot',
        'กระถางเซรามิก', 'ceramic pot', 'กระถางดินเผา', 'terracotta pot',
        'กระถางพลาสติก', 'plastic pot', 'กระถางแขวน', 'hanging pot',
        'ขาตั้งกระถาง', 'plant stand', 'ชั้นวางต้นไม้', 'plant shelf',
        'ดิน', 'soil', 'ดินปลูก', 'potting soil', 'potting mix',
        'พีทมอส', 'peat moss', 'ขุยมะพร้าว', 'coco peat', 'cocopeat',
        'หินภูเขาไฟ', 'pumice', 'เพอร์ไลท์', 'perlite', 'vermiculite',
        'ทรายหยาบ', 'ถ่านป่น', 'charcoal',
        'เมล็ดพันธุ์', 'seeds', 'เมล็ด', 'seed', 'ต้นกล้า', 'seedling',

        // Fertilizers
        'ปุ๋ย', 'fertilizer', 'อาหารต้นไม้', 'plant food',
        'ปุ๋ยคอก', 'manure', 'ปุ๋ยหมัก', 'compost', 'organic fertilizer',
        'ปุ๋ยเคมี', 'chemical fertilizer', 'ปุ๋ยน้ำ', 'liquid fertilizer',
        'ออสโมโค้ท', 'osmocote', 'ปุ๋ยละลายช้า', 'slow release',
        'ปุ๋ยนาโน', 'ปุ๋ยเร่งดอก', 'bloom booster', 'ปุ๋ยเร่งราก',

        // Watering
        'บัวรดน้ำ', 'watering can', 'กาน้ำรดต้นไม้',
        'สายยาง', 'garden hose', 'hose',
        'สปริงเกอร์', 'sprinkler', 'หัวฉีดน้ำ', 'spray nozzle',
        'ระบบรดน้ำอัตโนมัติ', 'automatic watering', 'ระบบน้ำหยด', 'drip irrigation',

        // Tools
        'กรรไกรตัดกิ่ง', 'pruning shears', 'กรรไกรแต่งกิ่ง', 'secateurs',
        'เสียม', 'trowel', 'พลั่ว', 'shovel', 'จอบ', 'hoe',
        'คราด', 'rake', 'ส้อมพรวนดิน', 'garden fork',
        'ถุงมือจัดสวน', 'gardening gloves', 'ถุงมือปลูกต้นไม้',

        // Brands
        'plan toys', 'thai garden', 'ไทย การ์เด้น',

        // Conditions
        'ต้นไม้ราคาถูก', 'ต้นไม้มือสอง', 'กระถางมือสอง',
    ],

    // ========================================
    // 1304: TOOLS / เครื่องมือช่าง
    // ========================================
    1304: [
        // General
        'เครื่องมือช่าง', 'tools', 'อุปกรณ์ช่าง', 'hardware',

        // Power Tools
        'สว่าน', 'drill', 'สว่านไฟฟ้า', 'electric drill',
        'สว่านไร้สาย', 'cordless drill', 'สว่านแบต', 'battery drill',
        'สว่านโรตารี่', 'rotary hammer', 'สว่านกระแทก', 'hammer drill',
        'หินเจียร', 'grinder', 'angle grinder', 'ลูกหมู', 'เครื่องเจียร',
        'เลื่อย', 'saw', 'เลื่อยไฟฟ้า', 'power saw',
        'เลื่อยวงเดือน', 'circular saw', 'เลื่อยชัก', 'reciprocating saw',
        'เลื่อยจิ๊กซอว์', 'jigsaw', 'เลื่อยฉลุ', 'scroll saw',
        'เลื่อยโซ่', 'chainsaw', 'เลื่อยยนต์',
        'เครื่องขัดกระดาษทราย', 'sander', 'orbital sander', 'belt sander',
        'เครื่องเชื่อม', 'welding machine', 'ตู้เชื่อม', 'inverter welding',
        'เครื่องเชื่อมไฟฟ้า', 'arc welder', 'mig welder', 'tig welder',
        'เครื่องฉีดน้ำแรงดันสูง', 'pressure washer', 'high pressure washer',
        'เครื่องเป่าลม', 'air blower', 'blower', 'เครื่องเป่าใบไม้',

        // Pumps & Compressors
        'ปั๊มน้ำ', 'water pump', 'ปั๊มแช่', 'submersible pump',
        'ปั๊มบาดาล', 'deep well pump', 'ปั๊มหอยโข่ง', 'centrifugal pump',
        'ปั๊มลม', 'air compressor', 'compressor', 'คอมเพรสเซอร์',
        'ปั๊มลมไร้สาย', 'cordless inflator', 'ปั๊มลมรถยนต์',

        // Hand Tools
        'ค้อน', 'hammer', 'ค้อนหัวกลม', 'ball peen hammer', 'ค้อนยาง', 'rubber mallet',
        'ไขควง', 'screwdriver', 'ไขควงปากแบน', 'ไขควงปากแฉก', 'phillips',
        'ไขควงไฟฟ้า', 'electric screwdriver', 'ไขควงไร้สาย',
        'ประแจ', 'wrench', 'ประแจเลื่อน', 'adjustable wrench', 'ประแจแหวน', 'box wrench',
        'ประแจปากตาย', 'open end wrench', 'ประแจบล็อก', 'socket wrench',
        'คีม', 'pliers', 'คีมตัด', 'cutting pliers', 'คีมล็อค', 'locking pliers',
        'คีมปากแหลม', 'needle nose pliers', 'คีมปากนกแก้ว', 'linesman pliers',
        'คีมคีบ', 'คีมย้ำหางปลา', 'crimping tool',
        'บันได', 'ladder', 'บันไดอลูมิเนียม', 'aluminum ladder',
        'บันไดพับ', 'step ladder', 'บันเดเจ', 'บันไดสไลด์', 'extension ladder',
        'นั่งร้าน', 'scaffolding', 'โต๊ะช่าง', 'workbench',

        // Measuring Tools
        'ตลับเมตร', 'tape measure', 'measuring tape', 'สายวัด',
        'ระดับน้ำ', 'level', 'spirit level', 'ระดับน้ำดิจิตอล',
        'ฉาก', 'square', 'ฉากวัด', 'carpenter square',
        'ขาวัด', 'caliper', 'เวอร์เนีย', 'vernier caliper',
        'ไมโครมิเตอร์', 'micrometer', 'เครื่องวัดระยะเลเซอร์', 'laser distance meter',

        // Accessories
        'ดอกสว่าน', 'drill bit', 'ดอกเจาะ', 'hole saw',
        'ใบเลื่อย', 'saw blade', 'ใบเลื่อยวงเดือน', 'circular saw blade',
        'กระดาษทราย', 'sandpaper', 'กระดาษทราย 60', 'กระดาษทราย 120',
        'หัวไขควง', 'screwdriver bit', 'บล็อกไขควง',
        'ดอกกัดไม้', 'router bit', 'ลูกหมู', 'grinding disc',
        'ใบตัด', 'cutting disc', 'ใบเจียร', 'grinding wheel',

        // Safety Gear
        'ถุงมือช่าง', 'work gloves', 'ถุงมือหนัง', 'leather gloves',
        'แว่นนิรภัย', 'safety glasses', 'safety goggles', 'แว่นตาช่าง',
        'หน้ากากป้องกัน', 'face mask', 'face shield', 'หน้ากากเชื่อม',
        'หมวกนิรภัย', 'hard hat', 'safety helmet', 'หมวกกันกระแทก',
        'ที่อุดหู', 'ear plugs', 'ear muffs', 'ที่ครอบหู',
        'รองเท้านิรภัย', 'safety boots', 'safety shoes', 'รองเท้าเซฟตี้',
        'เสื้อสะท้อนแสง', 'safety vest', 'reflective vest',

        // Brands
        'makita', 'มากิต้า', 'bosch', 'บอช', 'dewalt', 'ดีวอลท์',
        'stanley', 'สแตนเล่ย์', 'milwaukee', 'มิลวอคี', 'black & decker',
        'hitachi', 'ฮิตาชิ', 'hikoki', 'metabo', 'festool',
        'total', 'ingco', 'pumpkin', 'polo', 'solo', 'solex',
        'maktec', 'แม็คเท็ค', 'ryobi', 'worx',

        // Conditions
        'เครื่องมือช่างมือสอง', 'used tools', 'second hand tools',
        'ชุดเครื่องมือช่าง', 'tool set', 'กล่องเครื่องมือ', 'tool box',
    ],

    // ========================================
    // 1305: GARDEN EQUIPMENT / อุปกรณ์สวน
    // ========================================
    1305: [
        // Lawn Care
        'เครื่องตัดหญ้า', 'lawn mower', 'รถตัดหญ้า', 'riding mower',
        'เครื่องตัดหญ้าสายสะพาย', 'string trimmer', 'brush cutter',
        'เครื่องตัดหญ้าไฟฟ้า', 'electric lawn mower', 'เครื่องตัดหญ้าแบต',
        'เครื่องตัดหญ้าเครื่องยนต์', 'gas lawn mower', 'petrol mower',
        'เครื่องม้วนหญ้า', 'lawn roller', 'เครื่องเติมอากาศหญ้า', 'aerator',

        // Pruning & Cutting
        'กรรไกรตัดกิ่ง', 'pruning shears', 'กรรไกรแต่งกิ่ง', 'secateurs',
        'กรรไกรตัดรั้ว', 'hedge trimmer', 'เครื่องตัดรั้ว',
        'เลื่อยตัดกิ่ง', 'pruning saw', 'กรรไกรด้ามยาว', 'loppers',
        'มีดพร้าขัด', 'machete', 'มีดขุด', 'มีดปลิดหญ้า',

        // Digging Tools
        'จอบ', 'hoe', 'เสียม', 'shovel', 'พลั่ว', 'spade',
        'คราด', 'rake', 'คราดใบไม้', 'leaf rake', 'คราดหญ้า',
        'ส้อมพรวนดิน', 'garden fork', 'digging fork',
        'เครื่องขุดดิน', 'tiller', 'rototiller', 'เครื่องไถดิน',

        // Spraying
        'เครื่องพ่นยา', 'sprayer', 'ถังพ่นยา', 'pressure sprayer',
        'เครื่องพ่นยาสะพายหลัง', 'backpack sprayer', 'เครื่องพ่นไฟฟ้า',
        'หัวฉีดพ่น', 'spray nozzle', 'ถังฉีดน้ำ',

        // Blowers & Vacuums
        'เครื่องเป่าใบไม้', 'leaf blower', 'blower', 'เครื่องเป่า',
        'เครื่องดูดใบไม้', 'leaf vacuum', 'เครื่องเป่าดูด',

        // Watering Systems
        'ระบบรดน้ำ', 'irrigation system', 'ระบบน้ำหยด', 'drip irrigation',
        'สปริงเกอร์', 'sprinkler', 'sprinkler system', 'หัวสปริงเกอร์',
        'สายยางรดน้ำ', 'garden hose', 'สายยาง', 'hose reel', 'ที่ม้วนสายยาง',
        'ท่อน้ำ', 'water pipe', 'ท่อ pvc', 'ท่อ pe',
        'ถังน้ำ', 'water tank', 'ถังเก็บน้ำ', 'water storage tank',
        'ปั๊มน้ำสวน', 'garden pump', 'ปั๊มน้ำพุ', 'fountain pump',

        // Greenhouse & Protection
        'โรงเรือน', 'greenhouse', 'เรือนกระจก', 'โรงเพาะ',
        'สแลน', 'shade net', 'ตาข่ายกรองแสง', 'shade cloth',
        'ตาข่ายกันนก', 'bird net', 'ตาข่ายกันแมลง', 'insect net',
        'ผ้าคลุมพลาสติก', 'plastic sheet', 'พลาสติกคลุมโรงเรือน',

        // Composting
        'ถังหมักปุ๋ย', 'compost bin', 'composter', 'ถังปุ๋ยหมัก',
        'เครื่องบดใบไม้', 'leaf shredder', 'shredder', 'เครื่องย่อยกิ่งไม้',
        'chipper', 'เครื่องสับกิ่งไม้',

        // Outdoor Structures
        'ศาลาสวน', 'gazebo', 'pergola', 'ซุ้มสวน',
        'โต๊ะสวน', 'garden table', 'เก้าอี้สวน', 'garden chair',
        'เฟอร์นิเจอร์สวน', 'outdoor furniture', 'patio furniture',
        'ร่มสนาม', 'patio umbrella', 'ร่มกลางแจ้ง', 'garden umbrella',
        'เปลสนาม', 'hammock', 'เปลไกว', 'swing chair',

        // Brands
        'honda', 'ฮอนด้า', 'stihl', 'สติลล์', 'husqvarna',
        'makita', 'bosch', 'black & decker', 'greenworks',

        // Conditions
        'อุปกรณ์สวนมือสอง', 'used garden equipment',
        'อุปกรณ์สวนครบชุด', 'garden set', 'complete garden set',
    ],
}

// Combine all keywords for main category detection
export const COMPREHENSIVE_HOME_GARDEN_KEYWORDS = Object.values(HOME_GARDEN_SUBCATEGORY_KEYWORDS).flat()

/**
 * COMPREHENSIVE OTHERS/MISCELLANEOUS KEYWORDS - Category 99 (เบ็ดเตล็ด)
 * 
 * Subcategories:
 * - 9901: ของใช้ทั่วไป (General Items)
 * - 9902: สินค้าแฮนด์เมด (Handmade)
 * - 9903: DIY (Do It Yourself)
 * - 9904: ของรีไซเคิล (Recycled Items)
 * - 9905: เครื่องมือสำนักงาน (Office Supplies)
 */

export const OTHERS_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 9901: GENERAL ITEMS / ของใช้ทั่วไป
    // ========================================
    9901: [
        // General Terms
        'ของใช้', 'ของใช้ทั่วไป', 'general items', 'ของเบ็ดเตล็ด',
        'เบ็ดเตล็ด', 'miscellaneous', 'misc', 'อื่นๆ', 'others',
        'ของหลากหลาย', 'various', 'mixed', 'assorted', 'variety',

        // Household Items
        'ของใช้ในบ้าน', 'household items', 'household goods',
        'ของใช้ในครัว', 'kitchen items', 'kitchenware', 'เครื่องครัว',
        'อุปกรณ์ทำความสะอาด', 'cleaning supplies', 'cleaning products',
        'กล่องเก็บของ', 'storage box', 'containers', 'organizer',
        'ถังขยะ', 'trash bin', 'ที่เก็บของ', 'storage',
        'ราวตากผ้า', 'drying rack', 'clothes hanger', 'ไม้แขวนเสื้อ',
        'ถุงซักผ้า', 'laundry bag', 'ตะกร้าซักผ้า', 'laundry basket',

        // Personal Items
        'ของใช้ส่วนตัว', 'personal items', 'ของใช้ประจำวัน', 'daily use',
        'กระเป๋า', 'bag', 'bags', 'กระเป๋าผ้า', 'tote bag',
        'ร่ม', 'umbrella', 'เสื้อกันฝน', 'raincoat', 'poncho',
        'พวงกุญแจ', 'keychain', 'key ring', 'สายคล้องคอ', 'lanyard',
        'กระเป๋าสตางค์', 'wallet', 'purse', 'กระเป๋าใส่บัตร', 'card holder',
        'กระเป๋าเหรียญ', 'coin purse', 'pouch',

        // Gift Items
        'ของขวัญ', 'gift', 'present', 'ของที่ระลึก', 'memento',
        'ของฝาก', 'souvenir', 'keepsake', 'ของชำร่วย',
        'ชุดของขวัญ', 'gift set', 'gift box', 'กล่องของขวัญ',
        'ห่อของขวัญ', 'gift wrapping', 'ริบบิ้น', 'ribbon',
        'การ์ดอวยพร', 'greeting card', 'บัตรอวยพร',

        // Seasonal & Holiday
        'ของตกแต่งเทศกาล', 'seasonal items', 'holiday items',
        'คริสต์มาส', 'christmas', 'xmas', 'ต้นคริสต์มาส', 'christmas tree',
        'ปีใหม่', 'new year', 'สงกรานต์', 'songkran',
        'ฮาโลวีน', 'halloween', 'วาเลนไทน์', 'valentine',
        'อีสเตอร์', 'easter', 'ลอยกระทง', 'loy krathong',
        'ตรุษจีน', 'chinese new year', 'ตกแต่งเทศกาล', 'festive decoration',

        // Party Supplies
        'ของจัดงาน', 'party supplies', 'party items', 'งานเลี้ยง',
        'บอลลูน', 'balloon', 'ลูกโป่ง', 'ลูกโป่งปาร์ตี้',
        'แบนเนอร์', 'banner', 'ป้าย', 'ป้ายวันเกิด', 'birthday banner',
        'หมวกปาร์ตี้', 'party hat', 'กระดาษสี', 'confetti',
        'เทียนวันเกิด', 'birthday candle', 'เทียนตัวเลข',
        'จานกระดาษ', 'paper plate', 'แก้วกระดาษ', 'paper cup',
        'ผ้าปูโต๊ะปาร์ตี้', 'tablecloth', 'ผ้าเช็ดปาก', 'napkin',
        'ป๊อปเปอร์', 'popper', 'confetti popper',

        // Packaging Materials
        'บรรจุภัณฑ์', 'packaging', 'packing materials',
        'กล่อง', 'box', 'กล่องกระดาษ', 'cardboard box', 'paper box',
        'ถุง', 'bag', 'ถุงพลาสติก', 'plastic bag', 'ถุงกระดาษ', 'paper bag',
        'ซองจดหมาย', 'envelope', 'ซองพลาสติก', 'poly mailer',
        'บับเบิ้ลกันกระแทก', 'bubble wrap', 'โฟมกันกระแทก', 'foam',
        'เทปกาว', 'tape', 'packing tape', 'scotch tape',
        'เชือก', 'rope', 'string', 'สายรัด', 'strap',
        'ฟิล์มยืด', 'stretch film', 'shrink wrap',

        // Travel Items
        'ของใช้เดินทาง', 'travel items', 'travel accessories',
        'กระเป๋าเดินทาง', 'luggage', 'suitcase', 'หมอนรองคอ', 'neck pillow',
        'ผ้าปิดตา', 'sleep mask', 'eye mask', 'ที่อุดหู', 'ear plugs',
        'กระเป๋าใส่เครื่องสำอาง', 'toiletry bag', 'cosmetic bag',
        'ถุงสูญญากาศ', 'vacuum bag', 'travel bag',

        // Miscellaneous
        'อะไหล่', 'spare parts', 'parts', 'ชิ้นส่วน', 'components',
        'ฝาปิด', 'lid', 'cover', 'ที่รองแก้ว', 'coaster',
        'แม่เหล็ก', 'magnet', 'ที่ดูดแม่เหล็ก',
        'ที่เปิดขวด', 'bottle opener', 'ที่เปิดกระป๋อง', 'can opener',
        'ไฟฉาย', 'flashlight', 'torch', 'ถ่านไฟฉาย', 'battery',
    ],

    // ========================================
    // 9902: HANDMADE / สินค้าแฮนด์เมด
    // ========================================
    9902: [
        // General Terms
        'แฮนด์เมด', 'handmade', 'hand made', 'ทำมือ', 'ทำด้วยมือ',
        'งานฝีมือ', 'งานแฮนด์เมด', 'สินค้าแฮนด์เมด', 'handmade product',
        'handcrafted', 'handcraft', 'artisan', 'craft', 'งานคราฟท์',
        'homemade', 'home made', 'custom made', 'สั่งทำ', 'ทำตามสั่ง',
        'งานออร์เดอร์', 'made to order', 'สินค้าสั่งทำ',

        // Textile Crafts
        'งานเย็บผ้า', 'sewing', 'เย็บผ้า', 'ตัดเย็บ',
        'งานถัก', 'knitting', 'ถักไหมพรม', 'ถักโครเชต์', 'crochet',
        'งานปักผ้า', 'embroidery', 'ปักครอสสติช', 'cross stitch',
        'งานควิลท์', 'quilting', 'patchwork', 'แพทช์เวิร์ค',
        'มัดย้อม', 'tie dye', 'batik', 'บาติก', 'ผ้ามัดย้อม',
        'ทอผ้า', 'weaving', 'มาคราเม่', 'macrame',
        'พรมทอมือ', 'handwoven rug', 'ผ้าทอมือ', 'handwoven fabric',

        // Jewelry Making
        'เครื่องประดับแฮนด์เมด', 'handmade jewelry', 'artisan jewelry',
        'สร้อยคอแฮนด์เมด', 'handmade necklace', 'จี้', 'pendant',
        'ต่างหูแฮนด์เมด', 'handmade earrings', 'ต่างหูทำมือ',
        'กำไลแฮนด์เมด', 'handmade bracelet', 'กำไลลูกปัด', 'beaded bracelet',
        'แหวนแฮนด์เมด', 'handmade ring', 'กำไลข้อเท้า', 'anklet',
        'เครื่องประดับลูกปัด', 'beaded jewelry', 'wire jewelry',
        'เครื่องประดับเรซิน', 'resin jewelry', 'เครื่องประดับดินปั้น', 'clay jewelry',

        // Bag & Accessories
        'กระเป๋าแฮนด์เมด', 'handmade bag', 'กระเป๋าผ้า', 'fabric bag',
        'กระเป๋าถักไหม', 'crochet bag', 'กระเป๋าโครเชต์',
        'กระเป๋าหนังแฮนด์เมด', 'handmade leather bag',
        'กระเป๋าเงินแฮนด์เมด', 'handmade wallet', 'กระเป๋าสตางค์ทำมือ',
        'tote bag', 'โทท', 'กระเป๋าผ้าดิบ', 'canvas bag',
        'ผ้าพันคอแฮนด์เมด', 'handmade scarf', 'shawl', 'ผ้าคลุมไหล่',
        'ที่คาดผม', 'headband', 'โบว์ผม', 'hair bow', 'กิ๊บแฮนด์เมด',

        // Home Decor Crafts
        'ของตกแต่งบ้านแฮนด์เมด', 'handmade home decor',
        'หมอนแฮนด์เมด', 'handmade pillow', 'cushion cover', 'ปลอกหมอนทำมือ',
        'ดรีมแคทเชอร์', 'dreamcatcher', 'โมบายแขวน', 'hanging mobile',
        'พวงหรีด', 'wreath', 'ตกแต่งผนัง', 'wall hanging',
        'แจกันแฮนด์เมด', 'handmade vase', 'ของตกแต่งโต๊ะ',
        'ที่รองแก้วแฮนด์เมด', 'handmade coaster',

        // Candles & Soaps
        'เทียนหอมแฮนด์เมด', 'handmade candle', 'เทียนทำมือ',
        'เทียนอโรมา', 'aromatherapy candle', 'soy candle', 'เทียนถั่วเหลือง',
        'สบู่แฮนด์เมด', 'handmade soap', 'สบู่ทำมือ', 'สบู่ธรรมชาติ',
        'bath bomb แฮนด์เมด', 'handmade bath bomb',
        'ลิปบาล์มแฮนด์เมด', 'handmade lip balm',

        // Wood & Ceramic
        'งานไม้', 'woodwork', 'woodcraft', 'wood carving', 'แกะสลักไม้',
        'งานไม้แฮนด์เมด', 'handmade wood', 'ของใช้ไม้ทำมือ',
        'งานเซรามิก', 'ceramic', 'ceramics', 'เซรามิคแฮนด์เมด',
        'ดินเผา', 'pottery', 'งานปั้นดิน', 'clay craft',
        'แก้วเซรามิก', 'ceramic mug', 'จานเซรามิก', 'ceramic plate',

        // Paper Crafts
        'งานกระดาษ', 'paper craft', 'การ์ดแฮนด์เมด', 'handmade card',
        'การ์ดอวยพรทำมือ', 'handmade greeting card', 'บัตรเชิญทำมือ',
        'สมุดแฮนด์เมด', 'handmade notebook', 'สมุดโน้ตทำมือ',
        'สแครปบุ๊ค', 'scrapbook', 'scrapbooking',
        'โอริกามิ', 'origami', 'ที่คั่นหนังสือ', 'bookmark',
        'ป๊อปอัพการ์ด', 'pop-up card', 'การ์ด 3 มิติ',

        // Art & Painting
        'ภาพวาดมือ', 'hand painted', 'painting', 'ภาพวาด',
        'ภาพวาดสีน้ำ', 'watercolor painting', 'ภาพวาดสีน้ำมัน', 'oil painting',
        'ภาพวาดอะคริลิค', 'acrylic painting', 'ภาพเขียน',
        'งานศิลปะแฮนด์เมด', 'handmade art', 'artwork',
        'ภาพพิมพ์', 'print', 'art print', 'อาร์ตพริ้นท์',
        'ภาพวาดลงผ้า', 'fabric painting',

        // Doll & Toy
        'ตุ๊กตาแฮนด์เมด', 'handmade doll', 'ตุ๊กตาทำมือ',
        'ตุ๊กตาถักไหม', 'amigurumi', 'อามิกุรุมิ', 'crochet doll',
        'ตุ๊กตาผ้า', 'fabric doll', 'cloth doll', 'rag doll',
        'ของเล่นทำมือ', 'handmade toy', 'ของเล่นไม้ทำมือ',
    ],

    // ========================================
    // 9903: DIY / ทำเอง
    // ========================================
    9903: [
        // General Terms
        'diy', 'ดีไอวาย', 'ทำเอง', 'งานประดิษฐ์', 'do it yourself',
        'd.i.y.', 'ประดิษฐ์เอง', 'ทำด้วยตัวเอง', 'self-made',
        'craft', 'crafting', 'project', 'โปรเจค',
        'make', 'build', 'create', 'ประกอบเอง',

        // DIY Materials
        'วัสดุ diy', 'diy materials', 'อุปกรณ์ทำงาน',
        'วัสดุงานประดิษฐ์', 'craft supplies', 'craft materials',
        'วัตถุดิบ', 'raw materials', 'อุปกรณ์', 'supplies',
        'ชิ้นส่วน', 'parts', 'components', 'อะไหล่',

        // Craft Kits
        'ชุด diy', 'diy kit', 'craft kit', 'ชุดประดิษฐ์',
        'ชุดทำเอง', 'starter kit', 'beginner kit', 'ชุดเริ่มต้น',
        'model kit', 'ชุดโมเดล', 'assembly kit', 'ชุดประกอบ',
        'painting kit', 'ชุดระบายสี', 'candle kit', 'ชุดทำเทียน',
        'soap kit', 'ชุดทำสบู่', 'jewelry kit', 'ชุดทำเครื่องประดับ',

        // Home DIY
        'โครงการ diy', 'diy project', 'home improvement',
        'ซ่อมบ้านเอง', 'home repair', 'ปรับปรุงบ้าน', 'renovation',
        'ทำเฟอร์นิเจอร์เอง', 'furniture making', 'diy furniture',
        'ทำโต๊ะ', 'ทำเก้าอี้', 'ทำชั้นวาง', 'ทำตู้',
        'ทาสี', 'painting', 'ทาสีบ้าน', 'wall painting',

        // Woodworking
        'งานไม้ diy', 'woodworking', 'woodworking project',
        'ไม้อัด', 'plywood', 'ไม้แปรรูป', 'lumber',
        'ไม้พาเลท', 'pallet wood', 'pallet project', 'ทำจากพาเลท',
        'แกะสลักไม้', 'wood carving', 'เครื่องกลึงไม้', 'wood lathe',

        // Electronics DIY
        'อิเล็กทรอนิกส์ diy', 'electronics diy', 'เครื่องใช้ไฟฟ้า diy',
        'อาดูโน่', 'arduino', 'arduino project',
        'ราสเบอร์รี่ไพ', 'raspberry pi', 'raspberry pi project',
        'ไมโครคอนโทรลเลอร์', 'microcontroller', 'esp32', 'esp8266',
        'เซ็นเซอร์', 'sensor', 'sensors', 'โมดูล', 'module',
        'led', 'led strip', 'หลอด led', 'neopixel',
        'circuit board', 'pcb', 'แผงวงจร', 'เบรดบอร์ด', 'breadboard',
        'สายไฟ', 'wire', 'jumper wire', 'ตัวต้านทาน', 'resistor',
        'ตัวเก็บประจุ', 'capacitor', 'ทรานซิสเตอร์', 'transistor',
        'หัวแร้ง', 'soldering iron', 'ตะกั่วบัดกรี', 'solder',

        // 3D Printing
        'เครื่องพิมพ์ 3 มิติ', '3d printer', '3d printing',
        'ฟิลาเมนต์', 'filament', 'pla', 'abs', 'petg',
        '3d model', 'โมเดล 3 มิติ', 'stl file',
        'เรซิน', 'resin', 'uv resin', 'เรซิน 3d',

        // Resin Art
        'งานเรซิน', 'resin art', 'epoxy resin', 'อีพ็อกซี่เรซิน',
        'เรซินหล่อ', 'casting resin', 'แม่พิมพ์ซิลิโคน', 'silicone mold',
        'สีย้อมเรซิน', 'resin dye', 'ผงมุก', 'mica powder',

        // Leather Craft
        'งานหนัง', 'leather craft', 'leatherwork',
        'หนังฟอก', 'leather', 'หนังวัว', 'หนังแท้',
        'ตอกหนัง', 'leather stamping', 'เย็บหนัง', 'leather sewing',
        'ตะปูตอก', 'rivets', 'หัวเข็มขัด', 'buckle',

        // Tools
        'เครื่องมือ diy', 'diy tools', 'hand tools', 'power tools',
        'ฮาร์ดแวร์', 'hardware', 'อุปกรณ์ช่าง',
        'สกรู', 'screws', 'น็อต', 'nuts', 'โบลท์', 'bolts',
        'ตะปู', 'nails', 'หมุด', 'rivets',
        'กาว', 'glue', 'กาวร้อน', 'hot glue', 'กาวตราช้าง', 'super glue',
    ],

    // ========================================
    // 9904: RECYCLED ITEMS / ของรีไซเคิล
    // ========================================
    9904: [
        // General Terms
        'รีไซเคิล', 'recycle', 'recycled', 'recycling',
        'ของรีไซเคิล', 'recycled items', 'recycled products',
        'นำกลับมาใช้ใหม่', 'reuse', 'reused', 'ใช้ซ้ำ',
        'อัพไซเคิล', 'upcycle', 'upcycled', 'upcycling',
        'รีเพอร์โพส', 'repurpose', 'repurposed',

        // Eco-Friendly Terms
        'เป็นมิตรกับสิ่งแวดล้อม', 'eco-friendly', 'environmentally friendly',
        'รักษ์โลก', 'green', 'sustainable', 'ยั่งยืน',
        'zero waste', 'ซีโร่เวสต์', 'ศูนย์ขยะ', 'ลดขยะ',
        'ออร์แกนิค', 'organic', 'ธรรมชาติ', 'natural',
        'ย่อยสลายได้', 'biodegradable', 'compostable',

        // Recycled Materials
        'วัสดุรีไซเคิล', 'recycled materials',
        'กระดาษรีไซเคิล', 'recycled paper', 'กระดาษใช้แล้ว',
        'พลาสติกรีไซเคิล', 'recycled plastic', 'พลาสติกนำกลับมาใช้',
        'แก้วรีไซเคิล', 'recycled glass', 'ขวดแก้วรีไซเคิล',
        'โลหะรีไซเคิล', 'recycled metal', 'อลูมิเนียมรีไซเคิล',
        'ผ้ารีไซเคิล', 'recycled fabric', 'ผ้าใช้แล้ว',
        'ไม้รีไซเคิล', 'recycled wood', 'ไม้เก่า', 'reclaimed wood',
        'ยางรีไซเคิล', 'recycled rubber', 'ยางรถเก่า',

        // Upcycled Products
        'สินค้า upcycle', 'upcycled products',
        'เฟอร์นิเจอร์ upcycle', 'upcycled furniture', 'เฟอร์นิเจอร์จากของเก่า',
        'กระเป๋า upcycle', 'upcycled bag', 'กระเป๋าจากผ้าเก่า',
        'ของตกแต่ง upcycle', 'upcycled decor', 'ของแต่งบ้านรีไซเคิล',
        'งานศิลปะ upcycle', 'upcycled art', 'ศิลปะจากวัสดุเหลือใช้',
        'เสื้อผ้า upcycle', 'upcycled clothing', 'แฟชั่นรีไซเคิล',

        // Secondhand & Vintage
        'ของมือสอง', 'second hand', 'secondhand', 'used',
        'มือ 2', 'มือสอง', 'pre-owned', 'preloved',
        'วินเทจ', 'vintage', 'ของเก่า', 'antique', 'โบราณ',
        'ของสะสม', 'collectible', 'หายาก', 'rare',
        'refurbished', 'รีเฟอร์บิช', 'ซ่อมบำรุงใหม่',
        'restored', 'บูรณะใหม่', 'renovated',

        // Scrap & Leftover
        'ของเหลือใช้', 'scrap', 'scraps', 'leftover',
        'เศษวัสดุ', 'เศษผ้า', 'fabric scraps', 'เศษกระดาษ',
        'เศษไม้', 'wood scraps', 'เศษโลหะ', 'metal scraps',

        // Thrift & Donation
        'ของบริจาค', 'donated items', 'ของมือสองบริจาค',
        'ร้านขายของมือสอง', 'thrift store', 'thrift shop',
        'ประมูลของเก่า', 'auction', 'ตลาดนัดของเก่า', 'flea market',
        'garage sale', 'ขายของเก่า', 'yard sale',
    ],

    // ========================================
    // 9905: OFFICE SUPPLIES / เครื่องมือสำนักงาน
    // ========================================
    9905: [
        // General Terms
        'เครื่องใช้สำนักงาน', 'office supplies', 'office equipment',
        'อุปกรณ์สำนักงาน', 'office items', 'office accessories',
        'ของใช้ออฟฟิศ', 'ของใช้สำนักงาน', 'stationery',
        'business supplies', 'work supplies',

        // Writing Instruments
        'ปากกา', 'pen', 'pens', 'ปากกาลูกลื่น', 'ballpoint pen',
        'ปากกาหมึกซึม', 'fountain pen', 'ปากกาเคมี', 'permanent marker',
        'ดินสอ', 'pencil', 'ดินสอกด', 'mechanical pencil',
        'หมึก', 'ink', 'หมึกปากกา', 'ink refill',
        'ไฮไลท์', 'highlighter', 'ปากกาเน้นข้อความ', 'marker',
        'ไวท์บอร์ดมาร์เกอร์', 'whiteboard marker',

        // Paper Products
        'กระดาษ', 'paper', 'กระดาษ a4', 'a4 paper', 'copy paper',
        'กระดาษถ่ายเอกสาร', 'photocopy paper', 'กระดาษปริ้น', 'printer paper',
        'กระดาษสี', 'colored paper', 'กระดาษการ์ด', 'cardstock',
        'สมุดบันทึก', 'notebook', 'notepad', 'สมุดโน้ต',
        'สมุดจด', 'writing pad', 'legal pad',
        'กระดาษโน้ต', 'sticky notes', 'post-it', 'โพสต์อิท', 'memo pad',
        'กระดาษ sticky note', 'กระดาษโน้ตมีกาว',
        'กระดาษกราฟ', 'graph paper', 'กระดาษร่าง', 'draft paper',

        // Filing & Organization
        'แฟ้ม', 'folder', 'file folder', 'แฟ้มเอกสาร',
        'แฟ้มใส', 'clear folder', 'L folder', 'แฟ้มแอล',
        'แฟ้มห่วง', 'ring binder', 'binder', 'แฟ้ม 2 ห่วง', 'แฟ้ม 3 ห่วง',
        'ซองเอกสาร', 'document envelope', 'ซองพลาสติก', 'poly envelope',
        'ที่เก็บเอกสาร', 'document holder', 'file organizer',
        'ตู้เอกสาร', 'filing cabinet', 'กล่องเอกสาร', 'document box',
        'ชั้นวางเอกสาร', 'file rack', 'magazine holder',
        'คลิปบอร์ด', 'clipboard', 'แผ่นรองเขียน',

        // Desk Accessories
        'อุปกรณ์โต๊ะทำงาน', 'desk accessories', 'desk organizer',
        'ที่ใส่ปากกา', 'pen holder', 'pencil holder', 'ที่วางปากกา',
        'ช่องเก็บเอกสาร', 'document tray', 'letter tray', 'ถาดเอกสาร',
        'แผ่นรองเมาส์', 'mouse pad', 'desk mat', 'แผ่นรองโต๊ะ',
        'ที่นามบัตร', 'business card holder', 'กล่องนามบัตร',
        'ปฏิทิน', 'calendar', 'ปฏิทินตั้งโต๊ะ', 'desk calendar',

        // Binding & Cutting
        'เครื่องเย็บกระดาษ', 'stapler', 'แม็ก', 'แม็กเย็บกระดาษ',
        'ลวดเย็บกระดาษ', 'staples', 'ลวดเย็บ',
        'ที่ดึงลวดเย็บ', 'staple remover', 'ที่แกะลวด',
        'ที่เจาะกระดาษ', 'hole punch', 'puncher', 'เครื่องเจาะรู',
        'กรรไกร', 'scissors', 'กรรไกรสำนักงาน',
        'ที่ตัดกระดาษ', 'paper cutter', 'guillotine', 'เครื่องตัดกระดาษ',
        'เครื่องเคลือบบัตร', 'laminator', 'laminating machine', 'เครื่องเคลือบ',
        'พลาสติกเคลือบ', 'laminating pouch', 'laminating film',
        'เครื่องทำลายเอกสาร', 'shredder', 'paper shredder', 'เครื่องย่อยกระดาษ',

        // Adhesive & Labels
        'เทป', 'tape', 'เทปใส', 'clear tape', 'scotch tape',
        'กาว', 'glue', 'กาวแท่ง', 'glue stick', 'กาวน้ำ', 'liquid glue',
        'เทปกาวสองหน้า', 'double sided tape', 'เทปโฟม',
        'เทปพิมพ์ดีด', 'correction tape', 'ลิควิด', 'correction fluid',
        'สติกเกอร์', 'sticker', 'label', 'ป้ายชื่อ', 'name label',
        'ป้ายติดแฟ้ม', 'file label', 'ดัชนี', 'index tab',
        'ที่แยกกระดาษ', 'divider', 'tab divider',

        // Clips & Fasteners
        'คลิปหนีบกระดาษ', 'paper clip', 'คลิป',
        'คลิปหนีบเอกสาร', 'binder clip', 'bulldog clip', 'foldback clip',
        'ยางรัด', 'rubber band', 'หนังยาง',
        'ที่หนีบ', 'clip', 'clamp',

        // Board & Display
        'กระดานไวท์บอร์ด', 'whiteboard', 'ไวท์บอร์ด',
        'กระดานหมุด', 'bulletin board', 'cork board', 'กระดานไม้ก็อก',
        'กระดานแม่เหล็ก', 'magnetic board',
        'ขาตั้งกระดาน', 'easel', 'flip chart', 'กระดาษฟลิปชาร์ท',
        'หมุด', 'push pin', 'thumbtack', 'หมุดปักกระดาน',
        'แม่เหล็กติดกระดาน', 'magnet', 'whiteboard magnet',
        'แปรงลบกระดาน', 'whiteboard eraser',

        // Stamps & Seals
        'ตรายาง', 'rubber stamp', 'stamp', 'ตราประทับ',
        'หมึกตรายาง', 'stamp ink', 'stamp pad', 'แท่นหมึก',
        'ตรายางวันที่', 'date stamp', 'ตรายางหมายเลข', 'number stamp',

        // Brands
        'ตราม้า', 'elephant brand', 'horse brand',
        'ดับเบิ้ลเอ', 'double a', 'idea', 'lotus',
        'max', 'คังการู', 'carl', 'kw-trio',
    ],
}

// Combine all keywords for main category detection
export const COMPREHENSIVE_OTHERS_KEYWORDS = Object.values(OTHERS_SUBCATEGORY_KEYWORDS).flat()

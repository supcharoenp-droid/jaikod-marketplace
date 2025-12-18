/**
 * COMPREHENSIVE COMPUTER KEYWORDS - Category 4 (คอมพิวเตอร์และไอที)
 * 
 * Structure: Organized by SUBCATEGORY ID for precise categorization
 * 
 * Subcategories:
 * - 401: โน้ตบุ๊ค (Laptops)
 * - 402: คอมพิวเตอร์ตั้งโต๊ะ (Desktop PCs)
 * - 403: จอคอมพิวเตอร์ (Monitors)
 * - 404: อุปกรณ์เสริมคอมพิวเตอร์ (Peripherals)
 * - 405: ปริ้นเตอร์และเครื่องตอกบัตร (Printers & Office)
 * - 406: Components & Parts
 * - 407: Gaming PC
 * - 408: คีย์บอร์ด (Keyboards)
 * - 409: เมาส์ (Mouse)
 * - 410: ชิ้นส่วน PC (RAM/GPU/PSU/MB)
 */

// ========================================
// EXPORT: Main combined keywords for category-level matching
// ========================================
export const COMPREHENSIVE_COMPUTER_KEYWORDS = [
    // General Computer Terms
    'คอมพิวเตอร์', 'computer', 'pc', 'คอม', 'พีซี', 'ไอที', 'it',
    'โน้ตบุ๊ค', 'laptop', 'notebook', 'จอ', 'monitor', 'คีย์บอร์ด', 'keyboard',
    'เมาส์', 'mouse', 'แรม', 'ram', 'ssd', 'cpu', 'gpu',
    'gaming', 'เกมมิ่ง', 'technology', 'เทคโนโลยี',

    // Printers (CRITICAL - Prevent misclassification as Camera!)
    'ปริ้นเตอร์', 'printer', 'เครื่องพิมพ์', 'เครื่องปริ้น', 'ปริ้นท์',
    'เครื่องพิมพ์บัตร', 'card printer', 'id card printer', 'pvc card printer',
    'เครื่องพิมพ์การ์ด', 'canon printer', 'epson printer', 'hp printer',
    'inkjet', 'laser printer', 'toner', 'หมึกพิมพ์', 'ecotank',
]

// ========================================
// SUBCATEGORY KEYWORDS - For precise subcategory matching
// ========================================
export const COMPUTER_SUBCATEGORY_KEYWORDS: Record<number, string[]> = {
    // ========================================
    // 401: LAPTOPS / โน้ตบุ๊ค
    // ========================================
    401: [
        // Thai Terms (including misspellings)
        'โน้ตบุ๊ค', 'โน้ตบุ๊ก', 'โนตบุค', 'โน๊ตบุ๊ค', 'โน๊ตบุค', 'โน้ตบุ้ค', 'โนตบุ๊ค', 'โนตบุ๊ก',
        'คอมพิวเตอร์แบบพกพา', 'คอมพกพา', 'แล็ปท็อป', 'แล็บท็อป', 'แลปท็อป',
        'โน้ตบุ๊คเกม', 'โน้ตบุ๊คทำงาน', 'โน้ตบุ๊คนักเรียน', 'โน้ตบุ๊คมือสอง',
        'โน้ตบุ๊คใหม่', 'โน้ตบุ๊คมือ1', 'โน้ตบุ๊คมือ2',

        // Thai Use Cases (เพิ่มใหม่)
        'โน้ตบุ๊คเบา', 'โน้ตบุ๊คบาง', 'โน้ตบุ๊คจอใหญ่', 'โน้ตบุ๊คจอเล็ก',
        'โน้ตบุ๊คตัดต่อวิดีโอ', 'โน้ตบุ๊คเขียนโปรแกรม', 'โน้ตบุ๊คทำกราฟิก',
        'โน้ตบุ๊คเรียนออนไลน์', 'โน้ตบุ๊คประชุม zoom', 'โน้ตบุ๊คทำงานออฟฟิศ',
        'โน้ตบุ๊คดูหนัง', 'โน้ตบุ๊คเล่นเน็ต', 'โน้ตบุ๊คพกพาสะดวก',

        // English Terms
        'laptop', 'notebook', 'note book', 'laptops', 'portable computer',
        'macbook', 'mac book', 'macbook pro', 'macbook air', 'macbook m1', 'macbook m2', 'macbook m3',
        'ultrabook', 'ultra book', 'chromebook', 'chrome book',
        'gaming laptop', 'business laptop', 'workstation laptop', 'student laptop',
        '2-in-1 laptop', 'convertible laptop', 'touchscreen laptop',
        'thin and light', 'lightweight', 'slim laptop', 'portable',

        // Laptop Brands
        'asus laptop', 'acer laptop', 'hp laptop', 'dell laptop', 'lenovo laptop',
        'msi laptop', 'lg gram', 'apple laptop', 'gigabyte laptop', 'razer laptop',
        'alienware laptop', 'surface laptop', 'surface book', 'surface pro',
        'huawei laptop', 'samsung laptop', 'microsoft laptop',
        // เพิ่มใหม่
        'fujitsu laptop', 'toshiba laptop', 'dynabook', 'nec laptop',
        'avita laptop', 'honor laptop', 'realme laptop', 'xiaomi laptop',
        'samsung galaxy book', 'galaxy book',

        // Popular Series
        'rog laptop', 'rog strix', 'rog zephyrus', 'rog flow',
        'predator laptop', 'predator helios', 'predator triton',
        'thinkpad', 'thinkbook', 'ideapad', 'yoga', 'legion laptop',
        'pavilion', 'envy', 'omen', 'elitebook', 'probook', 'spectre',
        'inspiron', 'latitude', 'xps', 'alienware m15', 'alienware m17',
        'vivobook', 'zenbook', 'expertbook', 'tuf laptop', 'tuf gaming',
        'nitro', 'aspire', 'swift', 'spin', 'triton',
        'matebook', 'magicbook',
        // เพิ่มใหม่
        'gram 14', 'gram 16', 'gram 17', 'lg gram 17',
        'zenbook 14 oled', 'zenbook 15', 'zenbook duo', 'zenbook flip',
        'vivobook pro', 'vivobook s', 'vivobook go',
        'probook 440', 'probook 450', 'elitebook 840', 'elitebook 850',
        'latitude 5540', 'latitude 7440', 'precision 5570',
        'thinkpad x1 carbon', 'thinkpad t14', 'thinkpad e14',
        'galaxy book3', 'galaxy book pro',

        // Processors - Intel
        'i3 laptop', 'i5 laptop', 'i7 laptop', 'i9 laptop',
        'intel core i3', 'intel core i5', 'intel core i7', 'intel core i9',
        '10th gen', '11th gen', '12th gen', '13th gen', '14th gen',
        'intel evo', 'intel vpro', 'intel n100', 'intel n200',
        'core ultra 5', 'core ultra 7', 'core ultra 9',
        'pentium laptop', 'celeron laptop', 'n4020', 'n4120', 'n5030',

        // Processors - AMD
        'ryzen 3', 'ryzen 5', 'ryzen 7', 'ryzen 9',
        'ryzen 3000', 'ryzen 4000', 'ryzen 5000', 'ryzen 6000', 'ryzen 7000', 'ryzen 8000',
        'amd laptop', 'amd ryzen laptop',
        'ryzen 5 5500u', 'ryzen 5 5600h', 'ryzen 7 5800h', 'ryzen 7 7730u',
        'athlon laptop', 'athlon silver',

        // Apple Silicon
        'm1 laptop', 'm1 pro', 'm1 max', 'm1 ultra',
        'm2 laptop', 'm2 pro', 'm2 max', 'm2 ultra',
        'm3 laptop', 'm3 pro', 'm3 max', 'm4 laptop',
        'apple silicon', 'apple chip',

        // Graphics
        'gtx laptop', 'rtx laptop',
        'rtx 2050', 'rtx 3050', 'rtx 3050 ti', 'rtx 3060', 'rtx 3070', 'rtx 3080',
        'rtx 4050', 'rtx 4060', 'rtx 4070', 'rtx 4080', 'rtx 4090',
        'gtx 1650', 'gtx 1660', 'gtx 1660 ti',
        'mx350', 'mx450', 'mx550', 'mx570',
        'radeon graphics', 'amd radeon', 'rx 6600m', 'rx 6700m', 'rx 6800m', 'rx 7600m',
        'integrated graphics', 'discrete graphics', 'intel iris', 'intel uhd',

        // Screen Specs
        '13 inch', '14 inch', '15 inch', '15.6 inch', '16 inch', '17 inch', '17.3 inch',
        '13 นิ้ว', '14 นิ้ว', '15 นิ้ว', '15.6 นิ้ว', '16 นิ้ว', '17 นิ้ว',
        'จอ 13 นิ้ว', 'จอ 14 นิ้ว', 'จอ 15 นิ้ว', 'จอ 17 นิ้ว',
        'full hd', 'fullhd', '1080p', '2k', '1440p', '4k', '2160p', '2.8k', '3k',
        'oled laptop', 'ips laptop', 'retina display', 'amoled', 'mini led',
        '60hz', '90hz', '120hz laptop', '144hz laptop', '165hz laptop', '240hz laptop',
        'touchscreen', 'touch screen', 'จอสัมผัส', 'จอทัชสกรีน',
        'matte screen', 'glossy screen', 'anti glare',

        // RAM & Storage
        '4gb ram', '8gb ram', '16gb ram', '32gb ram', '64gb ram',
        'ddr4 laptop', 'ddr5 laptop', 'lpddr4', 'lpddr5',
        '128gb ssd', '256gb ssd', '512gb ssd', '1tb ssd', '2tb ssd',
        'nvme laptop', 'ssd laptop', 'hdd laptop',
        'แรม 8gb', 'แรม 16gb', 'แรม 32gb',

        // Use Cases
        'coding laptop', 'programming laptop', 'developer laptop',
        'video editing laptop', 'photo editing laptop',
        'design laptop', 'graphic design laptop', 'cad laptop',
        'content creator laptop', 'streaming laptop',
        'office laptop', 'home laptop', 'school laptop',
        'lightweight laptop', 'thin laptop', 'portable laptop',
        '3d rendering laptop', '3d modeling laptop',
        'music production', 'daw laptop', 'autocad laptop',

        // Features
        'backlit keyboard', 'rgb keyboard', 'keyboard light',
        'fingerprint laptop', 'face unlock', 'windows hello', 'ir camera',
        'wifi 6', 'wifi 6e', 'wifi 7', 'bluetooth 5', 'bluetooth 5.3',
        'thunderbolt 4', 'usb-c laptop', 'type-c charging', 'usb4',
        'long battery', 'battery life', 'all day battery',
        'fast charging', 'quick charge', '90w charging', '140w charging',
        'military grade', 'mil-std-810h', 'water resistant',
        'sd card slot', 'hdmi 2.1', 'numeric keypad',

        // Thai Local & Market Terms
        'notebook มือสอง', 'notebook ราคาถูก',
        'โน้ตบุ๊คราคาถูก', 'โน้ตบุ๊คแบรนด์เนม',
        'โน้ตบุ๊คของแท้', 'โน้ตบุ๊คเทิร์น', 'โน้ตบุ๊คโชว์รูม',
        'โน้ตบุ๊คมือ1ป้ายแดง', 'โน้ตบุ๊คประกันศูนย์',
        'โน้ตบุ๊คผ่อน', 'โน้ตบุ๊คผ่อน 0%', 'โน้ตบุ๊คแลกเครื่องเก่า',

        // Price Ranges (เพิ่มใหม่)
        'โน้ตบุ๊ค 10000', 'โน้ตบุ๊ค 15000', 'โน้ตบุ๊ค 20000',
        'โน้ตบุ๊ค 25000', 'โน้ตบุ๊ค 30000', 'โน้ตบุ๊คไม่เกิน 15000',
        'under 15000', 'under 20000', 'under 30000', 'under 50000',
        'laptop under 15k', 'laptop under 20k', 'laptop under 30k',
        'budget 15000', 'งบ 15000', 'งบ 20000', 'งบ 30000',

        // Conditions & Price
        'refurbished laptop', 'renewed laptop', 'open box',
        'budget laptop', 'cheap laptop', 'affordable laptop',
        'premium laptop', 'high end laptop', 'flagship laptop',
        'mid range laptop', 'entry level laptop',
        'like new laptop', 'mint condition', 'grade a',

        // Colors
        'silver laptop', 'black laptop', 'white laptop', 'gray laptop',
        'gold laptop', 'rose gold', 'space gray', 'midnight blue',
        'pink laptop', 'green laptop',
        'โน้ตบุ๊คสีเงิน', 'โน้ตบุ๊คสีดำ', 'โน้ตบุ๊คสีขาว', 'โน้ตบุ๊คสีชมพู',

        // Operating Systems
        'windows 11', 'windows 10', 'windows laptop',
        'macos laptop', 'linux laptop', 'ubuntu laptop',
        'chrome os', 'freedos', 'dos laptop',
    ],

    // ========================================
    // 402: DESKTOP PCs / คอมพิวเตอร์ตั้งโต๊ะ
    // ========================================
    402: [
        // Thai Terms (เพิ่มเติม)
        'คอมตั้งโต๊ะ', 'คอมเดสก์ท็อป', 'คอมพิวเตอร์ตั้งโต๊ะ',
        'คอมสำเร็จรูป', 'คอมประกอบ', 'คอมออลอินวัน', 'คอมมินิ', 'คอมจิ๋ว',
        'ชุดคอมพิวเตอร์', 'เครื่องคอมพิวเตอร์', 'คอมออฟฟิศ', 'คอมทำงาน',
        'คอมมือสอง', 'คอมใหม่', 'คอมแบรนด์เนม',
        // เพิ่มใหม่
        'คอมเล่นเกม', 'คอมสตรีม', 'คอมตัดต่อวิดีโอ', 'คอมทำกราฟิก',
        'คอมเรนเดอร์', 'คอมทำงานหนัก', 'คอมใช้งานทั่วไป',
        'คอมเล่นเน็ต', 'คอมดูหนัง', 'คอมเขียนโปรแกรม',
        'คอมพร้อมจอ', 'คอมครบเซ็ต', 'ชุดคอมครบเซ็ต',

        // English Terms
        'desktop', 'desktop pc', 'desktop computer',
        'tower pc', 'tower computer', 'computer tower',
        'all-in-one', 'aio pc', 'all in one pc', 'all-in-one computer',
        'workstation pc', 'professional pc',
        'office pc', 'business pc', 'home pc', 'family pc',
        'mini pc', 'small form factor', 'sff pc', 'compact pc',
        'barebone pc', 'custom pc', 'built pc', 'diy pc',
        'prebuilt pc', 'ready pc', 'pre-assembled',
        // เพิ่มใหม่
        'complete pc', 'full system', 'turnkey pc',

        // Desktop Brands & Models
        'imac', 'mac mini', 'mac studio', 'mac pro',
        'dell optiplex', 'dell precision', 'dell vostro', 'dell xps desktop',
        'hp pavilion desktop', 'hp elite', 'hp prodesk', 'hp z workstation',
        'lenovo thinkcentre', 'lenovo ideacentre', 'lenovo legion tower',
        'asus desktop', 'asus rog desktop', 'acer aspire desktop', 'acer predator orion',
        'intel nuc', 'asus nuc', 'gigabyte brix',
        // เพิ่มใหม่ Mini PC Brands
        'geekom mini pc', 'beelink mini pc', 'minisforum', 'gmktec',
        'acepc', 'mele mini pc', 'chuwi mini pc',

        // Thai Local Shops (เพิ่มใหม่)
        'จาก jib', 'จาก advice', 'จาก banana', 'จาก it city',
        'คอมสเปค jib', 'คอมสเปค banana',

        // Processors - Intel
        'i3 pc', 'i5 pc', 'i7 pc', 'i9 pc',
        'intel core i3 desktop', 'intel core i5 desktop', 'intel core i7 desktop', 'intel core i9 desktop',
        '10th gen desktop', '11th gen desktop', '12th gen desktop', '13th gen desktop', '14th gen desktop',
        'core ultra desktop', 'core ultra 5', 'core ultra 7', 'core ultra 9',
        'pentium desktop', 'celeron desktop',
        // เพิ่มใหม่
        'i5-12400', 'i5-13400', 'i5-14400', 'i5-14600k',
        'i7-12700', 'i7-13700', 'i7-14700k',
        'i9-13900k', 'i9-14900k',

        // Processors - AMD
        'ryzen 3 pc', 'ryzen 5 pc', 'ryzen 7 pc', 'ryzen 9 pc',
        'ryzen 3000 desktop', 'ryzen 5000 desktop', 'ryzen 7000 desktop', 'ryzen 9000 desktop',
        'amd desktop', 'amd ryzen desktop',
        'threadripper', 'threadripper pc', 'threadripper pro',
        // เพิ่มใหม่
        'ryzen 5 5600', 'ryzen 5 5600x', 'ryzen 5 7600', 'ryzen 5 7600x',
        'ryzen 7 5800x', 'ryzen 7 7700', 'ryzen 7 7800x3d',
        'ryzen 9 5900x', 'ryzen 9 7950x', 'ryzen 9 9950x',

        // Graphics Cards
        'gtx desktop', 'rtx desktop',
        'rtx 3060 pc', 'rtx 3070 pc', 'rtx 3080 pc', 'rtx 3090 pc',
        'rtx 4060 pc', 'rtx 4070 pc', 'rtx 4070 super', 'rtx 4080 pc', 'rtx 4090 pc',
        'gtx 1650 pc', 'gtx 1660 pc', 'gtx 1660 super',
        'radeon desktop', 'rx 6600 pc', 'rx 6700 pc', 'rx 6800 pc', 'rx 6900 pc',
        'rx 7600 pc', 'rx 7700 pc', 'rx 7800 pc', 'rx 7900 pc', 'rx 7900 xtx',
        // เพิ่มใหม่
        'arc a750', 'arc a770', 'intel arc',

        // Form Factors
        'full tower', 'mid tower', 'mini tower',
        'micro atx', 'matx pc', 'mini itx', 'mini-itx',
        'atx pc', 'eatx pc', 'e-atx',
        'compact desktop', 'tiny pc', 'ultra compact',
        // เพิ่มใหม่
        'cube case pc', 'sff build', 'itx build',

        // Use Cases
        'gaming desktop', 'gaming pc', 'esports pc',
        'streaming pc', 'content creation pc', 'youtube pc',
        'video editing desktop', 'photo editing pc', 'adobe pc',
        'rendering pc', '3d rendering desktop', 'blender pc',
        'workstation', 'professional workstation',
        'cad pc', 'autocad desktop', 'solidworks pc',
        'coding pc', 'programming desktop', 'developer pc',
        'server pc', 'home server', 'nas server',
        'htpc', 'media pc', 'home theater pc', 'plex server',
        // เพิ่มใหม่
        'ai pc', 'machine learning pc', 'deep learning desktop',
        'crypto mining', 'mining rig',

        // RAM & Storage
        '8gb desktop', '16gb desktop', '32gb desktop', '64gb desktop', '128gb desktop',
        'ddr4 desktop', 'ddr5 desktop',
        '256gb ssd desktop', '512gb ssd desktop', '1tb ssd desktop', '2tb ssd desktop',
        'nvme desktop', 'm.2 desktop',
        // เพิ่มใหม่
        'แรม 8gb', 'แรม 16gb', 'แรม 32gb', 'แรม 64gb',

        // Cooling
        'liquid cooled', 'water cooled', 'aio cooled',
        'air cooled', 'custom loop', 'custom water cooling',
        'rgb cooling', 'argb pc',
        // เพิ่มใหม่
        'ระบบน้ำ', 'คอมระบบน้ำ', 'watercool',

        // Power Supply
        '500w psu', '600w psu', '750w psu', '850w psu', '1000w psu', '1200w psu',
        '80 plus bronze', '80 plus gold', '80 plus platinum', '80 plus titanium',
        'modular psu', 'fully modular',

        // Case & RGB
        'rgb pc', 'argb pc', 'rainbow pc',
        'tempered glass', 'glass panel',
        'white case', 'black case', 'rgb case',
        'silent pc', 'quiet pc', 'noiseless',
        // เพิ่มใหม่
        'mesh case', 'airflow case',
        'คอมสีขาว', 'คอมสีดำ', 'คอม rgb',

        // Thai Market Terms
        'คอมประกอบเอง', 'คอมประกอบใหม่', 'คอมประกอบสด',
        'คอมเกม', 'คอมเกมมิ่ง', 'คอมเกมส์',
        'คอมทำงาน', 'คอมออฟฟิศ', 'คอมบริษัท', 'คอมร้านเกม',
        'คอมมือสอง', 'คอมมือ2', 'คอมราคาถูก',
        'คอมแบรนด์เนม', 'คอมของแท้', 'คอมประกันศูนย์',
        'คอมครบชุด', 'คอมพร้อมใช้', 'คอมพร้อมใช้งาน',
        'คอม spec สูง', 'คอมสเปคดี', 'คอมแรงๆ',

        // Price Ranges (เพิ่มใหม่)
        'คอม 10000', 'คอม 15000', 'คอม 20000', 'คอม 25000',
        'คอม 30000', 'คอม 40000', 'คอม 50000',
        'คอมไม่เกิน 15000', 'คอมไม่เกิน 20000', 'คอมไม่เกิน 30000',
        'งบ 10000', 'งบ 15000', 'งบ 20000', 'งบ 30000', 'งบ 50000',
        'pc under 15k', 'pc under 20k', 'pc under 30k', 'pc under 50k',

        // Conditions & Price
        'budget pc', 'cheap desktop', 'affordable pc',
        'mid range pc', 'high end pc', 'flagship pc',
        'ultimate pc', 'extreme pc', 'overkill pc',
        'refurbished desktop', 'renewed desktop',
        'used desktop', 'second hand desktop',
        'like new desktop', 'mint condition pc',
        // เพิ่มใหม่
        'คอมผ่อน', 'คอมผ่อน 0%', 'คอมแลกเครื่องเก่า',
        'คอมเทิร์น', 'คอมโชว์รูม',

        // Bundles & Packages
        'pc bundle', 'complete setup', 'full setup',
        'pc with monitor', 'desktop set', 'pc package',
        'keyboard mouse included', 'peripherals included',
        // เพิ่มใหม่
        'คอมพร้อมจอ', 'คอมพร้อมคีย์บอร์ด', 'คอมพร้อมเมาส์',
        'ชุดคอมพร้อมใช้', 'ชุดคอมครบ',

        // OS
        'windows 10 pc', 'windows 11 pc',
        'windows pro', 'windows home',
        'linux pc', 'ubuntu desktop',
        'hackintosh', 'no os', 'freedos',
    ],

    // ========================================
    // 403: MONITORS / จอคอมพิวเตอร์
    // ========================================
    403: [
        // Thai Terms
        'จอ', 'จอคอม', 'จอคอมพิวเตอร์', 'จอมอนิเตอร์', 'มอนิเตอร์',
        'จอมอนิเตอ', 'จอ pc', 'จอพีซี',
        'จอเกม', 'จอเกมมิ่ง', 'จอเล่นเกม',
        'จอโค้ง', 'จอโค้งเกม', 'จอยาว', 'จออัลตร้าไวด์',
        'จอ 4k', 'จอ fullhd', 'จอ 2k', 'จอ 1080p', 'จอ 1440p',
        'จอ ips', 'จอ va', 'จอ tn', 'จอ oled',
        'จอ 24 นิ้ว', 'จอ 27 นิ้ว', 'จอ 32 นิ้ว', 'จอ 34 นิ้ว', 'จอ 49 นิ้ว',
        'จอ 144hz', 'จอ 165hz', 'จอ 240hz', 'จอ 360hz',
        'จอคู่', 'จอทำงาน', 'จอออฟฟิศ', 'จอดีไซน์',

        // English Terms
        'monitor', 'monitors', 'display', 'screen',
        'computer monitor', 'pc monitor',
        'gaming monitor', 'gaming display', 'esports monitor',
        'curved monitor', 'curve monitor', 'curved display',
        'ultrawide', 'ultra wide', 'ultrawide monitor', 'super ultrawide',
        'flat monitor', 'flat screen',

        // Panel Types
        'ips monitor', 'ips panel',
        'va monitor', 'va panel',
        'tn monitor', 'tn panel',
        'oled monitor', 'qled monitor',

        // Resolutions
        '4k monitor', 'uhd monitor', '2160p',
        'full hd monitor', 'fhd', 'fullhd', '1080p monitor',
        'qhd monitor', 'wqhd', '2k monitor', '1440p monitor',
        'hd monitor', '720p',

        // Refresh Rates
        '60hz', '75hz', '100hz', '120hz', '144hz', '165hz',
        '180hz', '240hz', '280hz', '360hz',
        'high refresh', 'high refresh rate',

        // Sizes
        '19 inch', '20 inch', '21 inch', '22 inch', '23 inch', '24 inch',
        '25 inch', '27 inch', '28 inch', '29 inch', '30 inch', '32 inch',
        '34 inch', '35 inch', '38 inch', '43 inch', '49 inch',

        // Features
        'freesync', 'g-sync', 'gsync', 'adaptive sync',
        'hdr monitor', 'hdr10',
        'low blue light', 'flicker free', 'eye care',
        'vesa mount', 'adjustable stand',

        // Brands
        'aoc monitor', 'benq monitor',
        'samsung monitor', 'lg monitor', 'dell monitor',
        'asus monitor', 'acer monitor', 'msi monitor',
        'viewsonic monitor', 'philips monitor',
        'gigabyte monitor', 'hp monitor', 'lenovo monitor',

        // ✅ NEW: Popular Models & Series
        'lg ultragear', 'lg ultrawide', 'lg ergo',
        'samsung odyssey', 'samsung g7', 'samsung g9',
        'asus rog swift', 'asus tuf gaming',
        'acer predator', 'acer nitro',
        'benq zowie', 'benq mobiuz',
        'dell ultrasharp', 'dell s-series',
        'msi optix', 'msi mag',

        // ✅ NEW: Extended Resolutions
        '8k monitor', '7680x4320',
        '5k monitor', '5120x2880',
        'uwqhd', '3440x1440', '3840x1600',
        '3840x2160', '2560x1440', '1920x1080',

        // ✅ NEW: Aspect Ratios
        '16:9 monitor', '21:9 monitor', '32:9 monitor',
        '16:10 monitor', '4:3 monitor',
        'ultrawide 21:9', 'super ultrawide 32:9',

        // ✅ NEW: Response Time
        '1ms', '2ms', '4ms', '5ms',
        'mprt 1ms', 'gtg 1ms',
        'fast response', 'low response time',

        // ✅ NEW: Brightness & HDR
        'hdr400', 'hdr600', 'hdr1000',
        'displayhdr', 'vesa hdr',
        '300 nits', '350 nits', '400 nits', '500 nits',
        'high brightness',

        // ✅ NEW: Color Accuracy
        '99% srgb', '100% srgb', '99% adobe rgb',
        'dci-p3', 'wide color gamut',
        'factory calibrated', 'color calibrated',
        'professional color',

        // ✅ NEW: Panel Technology
        'nano ips', 'fast ips', 'quantum dot',
        'mini led', 'in-plane switching',
        'vertical alignment', 'twisted nematic',

        // ✅ NEW: Features
        'g-sync compatible', 'freesync premium',
        'usb-c monitor', 'type-c monitor', 'thunderbolt monitor',
        'kvm switch', 'pip', 'pbp',
        'touchscreen monitor', 'built-in speakers',
        'pivot', 'swivel', 'tilt', 'height adjustable',
        'borderless', 'frameless', 'thin bezel',
        'zero frame', 'matte', 'anti-glare',

        // ✅ NEW: Use Cases
        'competitive gaming', 'fps monitor',
        'productivity monitor', 'work monitor',
        'design monitor', 'photo editing monitor',
        'video editing monitor', 'content creation',
        'programming monitor', 'coding monitor',
        'dual monitor', 'multi monitor setup',
        'vertical monitor', 'portrait monitor',
        'streaming monitor', 'second monitor',

        // ✅ NEW: Size Thai
        '19 นิ้ว', '20 นิ้ว', '21 นิ้ว', '22 นิ้ว', '23 นิ้ว',
        '25 นิ้ว', '28 นิ้ว', '29 นิ้ว', '30 นิ้ว',
        '35 นิ้ว', '38 นิ้ว', '43 นิ้ว', '55 นิ้ว',

        // ✅ NEW: Refresh Rate Thai
        'จอ 60hz', 'จอ 75hz', 'จอ 120hz',
        'จอ 180hz', 'จอ 280hz', 'จอ 360hz', 'จอ 500hz',

        // ✅ NEW: Thai Market
        'จอมือสอง', 'จอใหม่', 'จอแบรนด์เนม',
        'จอราคาถูก', 'จอของแท้', 'จอประกันศูนย์',
        'จอโชว์รูม', 'จอเทิร์น',
        'จอคู่ setup', 'จอ 2 จอ', 'จอ 3 จอ',
        'จอดีไซน์กราฟิก', 'จอตัดต่อ', 'จอทำงานสี',
        'จอเล่นเกมส์', 'จอแข่ง', 'จอ esport',

        // ✅ NEW: Connectivity
        'hdmi monitor', 'displayport monitor', 'dp monitor',
        'hdmi 2.1', 'dp 1.4', 'dp 2.0', 'dp 2.1',
        'multiple inputs', 'dual hdmi',
        'usb-c monitor', 'type-c monitor', 'thunderbolt monitor',
        'usb hub monitor', '65w power delivery', '90w pd',

        // ✅ NEW: Conditions
        'budget monitor', 'cheap monitor',
        'premium monitor', 'professional monitor',
        'refurbished monitor', 'used monitor',
        'like new monitor',

        // Model Numbers (Common Monitor IDs)
        'w1973', 'w2072a', 'e243', 'vg279', 'g2460',

        // ========== เพิ่มใหม่ ==========

        // Price Ranges - Thai
        'จอ 3000', 'จอ 5000', 'จอ 7000', 'จอ 10000',
        'จอ 15000', 'จอ 20000', 'จอ 30000',
        'จอไม่เกิน 5000', 'จอไม่เกิน 10000', 'จอไม่เกิน 15000',
        'จอไม่เกิน 20000', 'จองบ 5000', 'จองบ 10000',

        // Price Ranges - English
        'monitor under 5000', 'monitor under 10000',
        'budget gaming monitor', 'cheap 144hz monitor',
        'affordable 4k monitor',

        // New Brands
        'xiaomi monitor', 'redmi monitor',
        'prism monitor', 'titan army',
        'eve spectrum', 'innocn monitor',
        'cooler master monitor', 'corsair monitor',

        // OLED Gaming (Hot Trend)
        'oled gaming monitor', 'qd-oled monitor', 'woled',
        'lg oled gaming', 'samsung oled gaming',
        'oled 240hz', 'oled 144hz', 'oled 4k gaming',
        '27 inch oled', '32 inch oled', '34 inch oled',
        'asus pg27aqdm', 'lg 27gr95qe',

        // More Thai Use Cases
        'จอทำกราฟิก', 'จอตัดต่อวิดีโอ', 'จอเขียนโค้ด',
        'จอโปรแกรมเมอร์', 'จอทำงานกราฟิก', 'จอสำหรับถ่ายภาพ',
        'จอสำหรับ streaming', 'จอสำหรับ content creator',
        'จอใช้งานทั่วไป', 'จอดูหนัง', 'จอเกม fps',
        'จอเกม moba', 'จอ rpg', 'จอ racing game',

        // Popular Models 2024
        '27gp850', '27gn950', '27gp950', '27gr95qe', '27gs93qe',
        'pg279qm', 'pg27aqdm', 'pg32ucdm',
        'g7 g70', 'g8 g80', 'g9 g95',
        'vg27aq1a', 'xg27aqdm', 'aw2725df',

        // Specific Specs Search
        '27 นิ้ว 165hz', '27 นิ้ว 144hz ips',
        '32 นิ้ว 4k', '34 นิ้ว ultrawide',
        '4k 144hz', '4k 120hz', '1440p 165hz', '1440p 240hz',
        'fhd 240hz', 'fhd 360hz',

        // Monitor Accessories
        'monitor arm', 'ขาตั้งจอ', 'arm mount',
        'dual monitor arm', 'triple monitor arm',
        'vesa mount', 'monitor stand',

        // Warranty & Conditions Thai
        'จอผ่อน', 'จอผ่อน 0%', 'จอแลกเครื่องเก่า',
        'ประกัน 3 ปี', 'ประกันศูนย์ไทย',
    ],

    // ========================================
    // 404: PERIPHERALS / อุปกรณ์เสริมคอมพิวเตอร์
    // ========================================
    404: [
        // General Thai
        'อุปกรณ์เสริม', 'อุปกรณ์เสริมคอม', 'อุปกรณ์คอมพิวเตอร์',
        'อุปกรณ์ไอที', 'อุปกรณ์ pc',

        // ========== NETWORKING (New Supercharged Section) ==========
        // Routers
        'router', 'เราเตอร์', 'wifi router', 'wireless router',
        'wifi 6 router', 'wifi 6e', 'wifi 7 router', 'ax router', 'be router',
        'dual band', 'tri band', 'quad band',
        'asus router', 'tp-link router', 'xiaomi router', 'huawei router',
        'mikrotik', 'ubiquiti', 'unifi', 'cisco', 'linksys', 'netgear',

        // Mesh Wi-Fi
        'mesh wifi', 'mesh system', 'เมชไวไฟ', 'ตัวกระจายสัญญาณ',
        'deco', 'velop', 'orbi', 'zenwifi', 'eero',
        'access point', 'ap', 'แอคเซสพอยต์', 'repeater', 'extender', 'ตัวขยายสัญญาณ',

        // Switches & Hubs
        'network switch', 'gigabit switch', 'poe switch', 'switching hub',
        '5 port switch', '8 port switch', '16 port switch', '24 port switch',
        'managed switch', 'unmanaged switch',

        // Network Cards
        'wifi card', 'pcie wifi', 'usb wifi', 'wireless adapter',
        'intel ax200', 'intel ax210', 'intel be200',
        'bluetooth adapter', 'usb bluetooth', 'dongle',

        // NAS & Storage Server
        'nas', 'network attached storage', 'cloud storage',
        'synology', 'qnap', 'asustor', 'terra master',
        'diskstation', 'ds220', 'ds923',
        'harddisk nas', 'wd red', 'seagate ironwolf',

        // ========== WEBCAM ==========
        // Thai
        'เว็บแคม', 'เว็บแคมคอม', 'กล้องเว็บแคม', 'กล้องคอม',
        'กล้องประชุม', 'กล้อง zoom', 'กล้อง meeting',
        'เว็บแคมสตรีม', 'เว็บแคม streaming',

        // English
        'webcam', 'web camera', 'web cam', 'pc camera',
        'conference camera', 'meeting camera',
        'streaming webcam', 'stream camera',
        '1080p webcam', '4k webcam', '720p webcam', '60fps webcam',

        // Brands
        'logitech webcam', 'logitech c920', 'logitech c922', 'logitech c930', 'logitech brio 4k', 'logitech brio 500',
        'razer kiyo', 'razer kiyo pro', 'razer kiyo x',
        'elgato facecam', 'elgato facecam pro', 'insta360 link',
        'obsbot tiny', 'obsbot meet',
        'anker powerconf', 'emeet',

        // ========== DESK SETUP / GADGETS (Trend!) ==========
        // Lighting
        'screenbar', 'light bar', 'ไฟติดจอ', 'benq screenbar', 'xiaomi light bar',
        'monitor light', 'ไฟส่องโต๊ะ',
        'rgb strip', 'ไฟเส้น', 'nanoleaf', 'govee', 'phillips hue',
        'smart bulb', 'หลอดไฟอัจฉริยะ',

        // Organization
        'pegboard', 'เพ็กบอร์ด', 'กระดานรู', 'แผงจัดระเบียบ',
        'desk shelf', 'monitor shelf', 'ชั้นวางจอ', 'grovemade',
        'cable tray', 'ถาดเก็บสายไฟ', 'รางปลั๊กไฟ', 'power strip', 'toshino', 'anitech',
        'ups', 'เครื่องสำรองไฟ', 'syndome', 'apc', 'cyberpower',

        // Ergonomics
        'foot rest', 'ที่วางเท้า',
        'monitor arm', 'ขาตั้งจอ', 'ergo arm', 'gas spring',
        'nb f80', 'nb f160', 'bionik', 'bewell', 'ergopixel',

        // ========== HEADSET / HEADPHONES ==========
        // Thai
        'หูฟัง', 'หูฟังคอม', 'หูฟังเกม', 'หูฟังเกมมิ่ง',
        'หูฟังไร้สาย', 'หูฟังบลูทูธ',
        'หูฟังมีไมค์', 'หูฟังไมโครโฟน',
        'หูฟังครอบหู', 'หูฟังสอดหู', 'อินเอียร์',

        // English
        'headset', 'headphone', 'gaming headset',
        'wireless headset', 'bluetooth headset',
        'wired headset', 'usb headset',
        'over ear', 'on ear', 'in ear monitor', 'iem',
        '7.1 surround', 'spatial audio', 'dolby atmos',
        'noise cancelling', 'anc', 'transparency mode',

        // Gaming Brands
        'hyperx cloud ii', 'cloud iii', 'cloud alpha', 'cloud flight',
        'steelseries arctis', 'arctis nova', 'arctis 7', 'arctis pro',
        'logitech g pro x', 'g733', 'g435', 'g535',
        'razer blackshark v2', 'kraken v3', 'barracuda',
        'corsair virtuoso', 'hs80',
        'epos', 'sennheiser gsp',
        'sony inzone', 'jbl quantum',

        // Audiophile / Budget
        'kz', 'kz zs10', 'moondrop',
        'superlux', 'samson',
        'fantech', 'nubwo', 'signo', 'oker',

        // ========== MICROPHONE ==========
        // Thai
        'ไมค์', 'ไมโครโฟน', 'ไมค์คอม',
        'ไมค์สตรีม', 'ไมค์อัดเสียง', 'ไมค์ไลฟ์สด',
        'ไมค์ usb', 'ไมค์ xlr', 'ไมค์คอนเดนเซอร์', 'ไมค์ไดนามิก',

        // Brands
        'blue yeti', 'yeti x', 'yeti nano',
        'hyperx quadcast', 'duocast', 'solocast',
        'elgato wave:1', 'elgato wave:3',
        'shure mv7', 'shure sm7b',
        'rode nt-usb', 'rode podmic',
        'fifine', 'fifine k669', 'fifine a6t', 'ampligame',
        'maono', 'samson q2u', 'audio technica at2020',

        // Accessories
        'boom arm', 'ขาตั้งไมค์', 'mic stand', 'pop filter', 'shock mount',
        'audio interface', 'focusrite scarlett', 'go xlr',

        // ========== SPEAKER ==========
        'ลำโพงคอม', 'ลำโพง pc', 'ลำโพงบลูทูธ', 'soundbar',
        'logitech z906', 'z407', 'z120',
        'creative pebble', 'stage air',
        'edifier r1280db', 'r1700bt', 'r1855db', 'g2000',
        'jbl quantum duo', 'razer leviathan', 'nommo',
        'audioengine a2+', 'a5+',
        'microlab', 'x3',

        // ========== COOLING PAD & STANDS ==========
        'cooling pad', 'พัดลมโน๊ตบุ๊ค', 'ฐานรองโน๊ตบุ๊ค',
        'laptop stand', 'ที่วางโน๊ตบุ๊ค', 'แท่นวางโน๊ตบุ๊ค',
        'cooler master notepal', 'nubwo cooling',
        'stand aluminium', 'stand หมุนได้',

        // ========== MOUSEPAD ==========
        'mousepad', 'แผ่นรองเมาส์', 'desk mat', 'แผ่นรองโต๊ะ',
        'speed', 'control', 'hybrid', 'glass pad',
        'razer gigantus', 'steelseries qck', 'logitech g640',
        'artisan mousepad', 'hayate otsu', 'hien', 'zero',
        'lethalgaming', 'aqua control',
        'cordura pad',

        // ========== USB HUB & DOCKING ==========
        // Thai
        'usb hub', 'ฮับ usb', 'ตัวแยก usb',
        'docking station', 'ด็อกกิ้ง',
        'type-c hub', 'usb-c hub', 'ฮับ type c',

        // English
        'usb hub', 'usb 3.0 hub', 'usb 3.1 hub', 'usb-c hub',
        '4 port hub', '7 port hub', '10 port hub',
        'powered hub', 'active hub',
        'docking station', 'laptop dock',
        'multiport adapter', 'hdmi hub',

        // Brands
        'anker hub', 'ugreen hub', 'belkin hub',
        'dell dock', 'hp dock', 'lenovo dock',

        // ========== COOLING PAD ==========
        // Thai
        'แผ่นรองโน๊ตบุ๊ค', 'แผ่นรองโน้ตบุ๊ค',
        'พัดลมรองโน๊ตบุ๊ค', 'พัดลมโน๊ตบุ๊ค',
        'ฐานระบายความร้อน', 'cooling pad',

        // English
        'laptop cooling pad', 'notebook cooling pad',
        'laptop cooler', 'notebook cooler',
        'cooling stand', 'laptop fan',
        '2 fan cooler', '4 fan cooler', '6 fan cooler',
        'rgb cooling pad',

        // Brands
        'cooler master notepal', 'deepcool cooling pad',
        'thermaltake cooling pad',

        // ========== MOUSEPAD ==========
        // Thai
        'แผ่นรองเมาส์', 'แผ่นรองเม้าส์', 'mousepad',
        'แผ่นเมาส์', 'แผ่นรองเมาส์เกม',
        'แผ่นรองเมาส์ใหญ่', 'แผ่นรองเมาส์ยาว',

        // English
        'mouse pad', 'mousepad', 'mouse mat',
        'gaming mousepad', 'extended mousepad',
        'rgb mousepad', 'led mousepad',
        'desk mat', 'deskmat',
        'xl mousepad', 'xxl mousepad',
        'speed pad', 'control pad',

        // Brands
        'razer mousepad', 'razer goliathus', 'razer gigantus',
        'steelseries qck', 'steelseries mousepad',
        'hyperx mousepad', 'hyperx fury',
        'logitech mousepad', 'logitech g640',
        'corsair mousepad', 'corsair mm300',

        // ========== CABLES & ACCESSORIES ==========
        // Thai
        'สาย', 'สายคอม', 'สายต่อ',
        'สาย usb', 'สาย hdmi', 'สาย displayport',
        'สาย vga', 'สาย dvi', 'สาย lan',
        'สายชาร์จ', 'สายต่อพ่วง',

        // English
        'cable', 'computer cable', 'extension cable',
        'usb cable', 'usb-c cable', 'type-c cable',
        'hdmi cable', 'hdmi 2.1 cable', '4k hdmi',
        'displayport cable', 'dp cable',
        'vga cable', 'dvi cable',
        'ethernet cable', 'lan cable', 'cat6', 'cat7',
        'power cable', 'charging cable',
        'cable management', 'cable organizer',

        // ========== OTHER PERIPHERALS ==========
        // Drawing Tablet
        'graphic tablet', 'drawing tablet', 'pen tablet',
        'wacom tablet', 'huion tablet', 'xp-pen',
        'แท็บเล็ตวาดรูป', 'ปากกาวาดรูป',

        // KVM Switch
        'kvm switch', 'ตัวสลับคอม', '2 port kvm', '4 port kvm',

        // External Drive
        'external hard drive', 'external ssd',
        'ฮาร์ดดิสก์ภายนอก', 'hdd external',
        'portable ssd', '1tb external', '2tb external',

        // Card Reader
        'card reader', 'sd card reader', 'usb card reader',
        'ตัวอ่านการ์ด', 'รีดเดอร์การ์ด',

        // USB Fan
        'usb fan', 'พัดลม usb', 'mini fan',

        // Laptop Stand
        'laptop stand', 'ที่วางโน๊ตบุ๊ค',
        'notebook stand', 'adjustable stand',

        // Monitor Arm
        'monitor arm', 'arm mount', 'vesa arm',
        'ขาตั้งจอ', 'ที่ยึดจอ',

        // ========== เพิ่มใหม่ ==========

        // Streaming Gear (Hot!)
        'capture card', 'elgato hd60', 'elgato 4k60',
        'avermedia capture', 'การ์ดจับภาพ',
        'stream deck', 'elgato stream deck', 'control deck',
        'green screen', 'ฉากเขียว', 'chroma key',
        'ring light', 'key light', 'ไฟสตรีม',
        'camera arm', 'mic arm', 'boom arm',

        // TWS / True Wireless (Hot!)
        'หูฟัง tws', 'หูฟัง true wireless', 'หูฟังไร้สายแท้',
        'earbuds', 'หูฟังเอียร์บัด', 'หูฟังเต็มใบ',
        'หูฟัง anc', 'หูฟังตัดเสียง', 'active noise cancelling',

        // Thai Gaming Brands (เพิ่มเติม)
        'neolution headset', 'neolution e-sport',
        'zet gaming', 'rexus headset', 'redragon headset',
        'havit headset', 'mpow headset',
        'fantech หูฟัง', 'oker หูฟัง', 'nubwo หูฟัง',
        'fantech ลำโพง', 'fantech เว็บแคม',

        // Price Ranges - Thai
        'หูฟัง 300', 'หูฟัง 500', 'หูฟัง 1000', 'หูฟัง 2000',
        'หูฟังไม่เกิน 500', 'หูฟังไม่เกิน 1000',
        'เว็บแคม 500', 'เว็บแคม 1000', 'เว็บแคม 2000',
        'ไมค์ 500', 'ไมค์ 1000', 'ไมค์ 3000',
        'ลำโพง 500', 'ลำโพง 1000', 'ลำโพง 2000',

        // Wireless Tech
        '2.4ghz wireless', 'bluetooth 5.0', 'bluetooth 5.3',
        'dongle wireless', 'usb receiver',
        'low latency', 'ความหน่วง', 'lag-free',

        // Audio Features
        'spatial audio', 'dolby atmos', 'dts:x',
        '3d audio', 'surround sound', 'เสียงรอบทิศ',
        'bass boost', 'eq customization',

        // AI Features 2024
        'ai microphone', 'ai noise cancelling',
        'ai webcam', 'auto framing',
        'background blur', 'background removal',

        // Game Controller
        'controller', 'จอยเกม', 'game controller',
        'xbox controller', 'ps5 controller', 'ps4 controller',
        '8bitdo controller', 'จอย pc',
        'steering wheel', 'พวงมาลัยเกม', 'racing wheel',
        'hotas', 'flight stick', 'joystick',
        'arcade stick', 'fight stick', 'fightstick',

        // VR Accessories
        'vr headset', 'แว่น vr', 'vr glasses',
        'meta quest', 'oculus', 'vr controller',

        // Ergonomic
        'ergonomic', 'wrist rest', 'ที่รองข้อมือ',
        'palm rest', 'keyboard wrist rest',
        'foot rest', 'ที่วางเท้า',

        // Desk Accessories
        'desk organizer', 'จัดโต๊ะ', 'desk setup',
        'monitor riser', 'ที่วางจอ', 'laptop riser',
        'cable clip', 'cable holder',
        'headphone stand', 'ที่แขวนหูฟัง',
        'usb charger', 'charging station',

        // ========== CONDITIONS & GENERAL ==========
        'ของแท้', 'แท้ 100%', 'genuine',
        'มือสอง', 'มือ2', 'second hand',
        'ใหม่ป้ายแดง', 'ใหม่', 'new',
        'ราคาถูก', 'budget', 'affordable',
        'premium', 'high quality', 'คุณภาพดี',

        // เพิ่ม
        'ประกันศูนย์', 'ประกัน 1 ปี', 'ประกัน 2 ปี',
        'ผ่อน 0%', 'ผ่อนได้',

        // ========== PRICE RANGES (NEW!) ==========
        // Networking
        'router 1000', 'router 2000', 'router 3000', 'router 5000',
        'mesh wifi 3000', 'mesh wifi 5000',

        // Desk Accessories
        'monitor arm 500', 'monitor arm 1000', 'monitor arm 2000',
        'screen bar 1000', 'screen bar 2000',
        'ups 1000', 'ups 2000', 'ups 3000',

        // Audio
        'ลำโพงไม่เกิน 1000', 'ลำโพงไม่เกิน 2000',
        'speaker under 1000', 'speaker under 2000',
    ],

    // ========================================
    // 408: KEYBOARDS / คีย์บอร์ด
    // ========================================
    408: [
        // Thai General (including common misspellings)
        'คีย์บอร์ด', 'คีบอร์ด', 'คีบ์บอร์ด', 'กีบอร์ด', 'คีย์บอด', 'แป้นพิมพ์',
        'คีย์บอร์ดคอม', 'คีย์บอร์ดเกม', 'คีย์บอร์ดเกมมิ่ง',
        'คีย์บอร์ดมือสอง', 'คีย์บอร์ดใหม่',
        'คีย์บอร์ดมีสาย', 'คีย์บอร์ดไร้สาย', 'คีย์บอร์ดบลูทูธ',
        'แป้นพิมพ์คอม', 'แป้นพิมพ์เกม',

        // English General
        'keyboard', 'keyboards', 'gaming keyboard',
        'wireless keyboard', 'wired keyboard', 'bluetooth keyboard',
        'mechanical keyboard', 'membrane keyboard',
        'compact keyboard', 'full size keyboard', 'ergonomic keyboard',

        // Types - Thai
        'คีย์บอร์ดเมคานิคัล', 'เมคานิคัล', 'mechanical',
        'คีย์บอร์ดเมมเบรน', 'เมมเบรน', 'membrane',
        'คีย์บอร์ด 60%', 'คีย์บอร์ด 65%', 'คีย์บอร์ด 75%', 'คีย์บอร์ด 80%',
        'คีย์บอร์ดเต็มตัว', 'full keyboard',

        // Types - English
        'mech keyboard', 'mechanical',
        '60% keyboard', '65% keyboard', '75% keyboard',
        'tkl keyboard', 'tenkeyless', '80% keyboard', '100% keyboard',
        'rgb keyboard', 'backlit keyboard', 'led keyboard',
        'hot swap keyboard', 'hot swappable', 'custom keyboard',

        // Switches
        'switch', 'สวิตช์', 'key switch',
        'cherry mx', 'cherry mx red', 'cherry mx blue', 'cherry mx brown',
        'cherry mx black', 'cherry mx silent', 'cherry mx speed',
        'gateron', 'gateron red', 'gateron blue', 'gateron brown',
        'kailh switch', 'outemu', 'optical switch',
        'tactile switch', 'linear switch', 'clicky switch',
        'blue switch', 'brown switch', 'red switch', 'black switch',

        // Features
        'rgb', 'backlit', 'led', 'lighting',
        'programmable keyboard', 'macro keyboard',
        'anti-ghosting', 'n-key rollover', 'nkro',
        'pbt keycaps', 'abs keycaps', 'doubleshot', 'pudding keycaps',

        // International Brands
        'logitech keyboard', 'logitech g', 'g pro keyboard', 'g915', 'g513', 'g413',
        'razer keyboard', 'razer blackwidow', 'razer huntsman', 'razer ornata',
        'corsair keyboard', 'k70', 'k95', 'k100',
        'steelseries keyboard', 'apex keyboard', 'apex pro',
        'hyperx keyboard', 'hyperx alloy', 'alloy fps', 'alloy origins',
        'keychron', 'keychron k2', 'keychron k6', 'keychron k8',
        'ducky keyboard', 'ducky one', 'ducky shine',
        'filco', 'varmilo', 'leopold',
        'anne pro', 'anne pro 2',
        'royal kludge', 'rk keyboard', 'rk61', 'rk84',
        'akko keyboard', 'akko 3084', 'akko 5075',
        'nuphy', 'ajazz',

        // Thai Brands (✅ GTECH Added!)
        'gtech', 'gtech keyboard', 'คีย์บอร์ด gtech',
        'ttech', 'ttech keyboard', 'คีย์บอร์ด ttech',
        'oker', 'oker keyboard', 'คีย์บอร์ด oker',
        'nubwo', 'nubwo keyboard', 'คีย์บอร์ด nubwo',
        'signo', 'signo keyboard', 'คีย์บอร์ด signo',
        'tsunami', 'tsunami keyboard', 'คีย์บอร์ด tsunami',
        'fantech', 'fantech keyboard', 'คีย์บอร์ด fantech',
        'neolution', 'neolution e-sport',
        'zet gaming', 'zet keyboard',

        // Keyboard Layouts
        'แป้นอังกฤษ', 'english layout', 'ansi layout',
        'แป้นไทย', 'thai layout', 'ภาษาไทย',
        'แป้นอาหรับ', 'arabic layout', 'arabic keyboard',
        'แป้นจีน', 'chinese layout',
        'แป้นญี่ปุ่น', 'japanese layout', 'jis layout',
        'แป้นเกาหลี', 'korean layout',
        'iso layout', 'us layout', 'uk layout',

        // Connectivity
        'usb keyboard', 'type-c keyboard', 'usb-c',
        '2.4ghz keyboard', 'bluetooth 5.0', 'wireless 2.4g',
        'triple mode', 'multi device', '3 devices',

        // Special Features
        'หน้าปัดปรับเสียง', 'volume knob', 'media keys',
        'wrist rest', 'ที่รองข้อมือ', 'palm rest',
        'hot swap', 'hotswap', 'modular',
        'detachable cable', 'สายถอดได้',

        // Price/Condition Keywords
        'คีย์บอร์ดราคาถูก', 'budget keyboard',
        'คีย์บอร์ดแบรนด์เนม', 'premium keyboard',
        'คีย์บอร์ดมือ2', 'second hand keyboard',
        'คีย์บอร์ดของแท้', 'authentic keyboard',
        'คีย์บอร์ดแท้', 'genuine keyboard',

        // Price Ranges (NEW!)
        'คีย์บอร์ด 300', 'คีย์บอร์ด 500', 'คีย์บอร์ด 1000', 'คีย์บอร์ด 2000',
        'คีย์บอร์ด 3000', 'คีย์บอร์ด 5000',
        'คีย์บอร์ดไม่เกิน 500', 'คีย์บอร์ดไม่เกิน 1000', 'คีย์บอร์ดไม่เกิน 2000',
        'keyboard under 500', 'keyboard under 1000', 'keyboard under 2000',
    ],

    // ========================================
    // 409: MOUSE / เมาส์
    // ========================================
    // ========================================
    // 409: MOUSE / เมาส์
    // ========================================
    409: [
        // Thai General
        'เมาส์', 'เม้าส์', 'เมาท์', 'mouse', 'เมาส์คอม',
        'เมาส์เกม', 'เมาส์เกมมิ่ง', 'เม้าส์เกม',
        'เมาส์ทำงาน', 'เมาส์ออฟฟิศ', 'เมาส์สำนักงาน',
        'เมาส์มือสอง', 'เมาส์ใหม่', 'เมาส์หลุดจำนำ',
        'เมาส์มีสาย', 'เมาส์ไร้สาย', 'เมาส์บลูทูธ',

        // English General
        'mouse', 'gaming mouse', 'wireless mouse', 'wired mouse',
        'optical mouse', 'laser mouse',
        'ergonomic mouse', 'vertical mouse',
        'bluetooth mouse', 'office mouse',
        'usb mouse', 'usb-c mouse',

        // Types & Shapes
        'ergonomic', 'เมาส์เพื่อสุขภาพ', 'เมาส์แนวตั้ง',
        'vertical mouse', 'trackball', 'trackball mouse',
        'honeycomb mouse', 'เมาส์รู', 'เมาส์เบา',
        'lightweight mouse', 'superlight', 'ultralight',
        'ambidextrous', 'symmetrical', 'right handed',

        // Grip Styles
        'claw grip', 'palm grip', 'fingertip grip',
        'เมาส์จับเต็มมือ', 'เมาส์ทรงสูง', 'เมาส์ทรงแบน',

        // Sensor & Tech
        'optical sensor', 'laser sensor',
        'pixart', 'paw3395', 'paw3370', 'paw3335',
        'focus pro', 'hero sensor', 'hero 25k',
        'dpi', '26000 dpi', '30000 dpi', '4000 dpi', '800 dpi',
        'polling rate', '1000hz', '2000hz', '4000hz', '8khz',
        'polling rate 4k', 'dongle 4k',

        // Switches & Clicks
        'optical switch', 'mechanical switch',
        'kailh gm 8.0', 'huano blue shell', 'omron switch',
        'silent switch', 'silent click', 'เมาส์เสียงเงียบ', 'เมาส์ไร้เสียง',
        'hot swap switch', 'เปลี่ยนสวิตซ์ได้',

        // Features
        'rgb mouse', 'led mouse', 'aura sync', 'mystic light',
        'programmable buttons', 'macro mouse', 'เมาส์มาโคร',
        'wireless charging', 'qi charging',
        'tri-mode', '3 mode connection', 'bluetooth 5.0',

        // Modding & Accessories
        'mouse feet', 'mouse skates', 'glass skates', 'superglide',
        'ptfe feet', 'teflon feet', 'tiger ice', 'corepad',
        'anti-slip tape', 'grip tape', 'แผ่นกันลื่นเมาส์',
        'mouse bungee', 'ที่ยึดสายเมาส์', 'paracord cable',

        // Brands - Mainstream
        'logitech g', 'logitech mouse', 'g pro x superlight', 'g pro x superlight 2',
        'g502 x', 'g502 hero', 'g304', 'mx master 3s', 'mx vertical', 'lift vertical',
        'razer mouse', 'razer deathadder v3', 'razer viper v2 pro', 'razer viper v3',
        'razer basilisk v3', 'razer naga', 'razer cobra',
        'steelseries', 'steelseries aerox', 'steelseries prime',
        'zowie', 'zowie ec-cw', 'zowie u2', 'benq zowie',

        // Brands - Enthusiast & New Gen (Hot!)
        'lamzu', 'lamzu atlantis', 'lamzu maya', 'lamzu thorn',
        'pulsar', 'pulsar x2', 'pulsar x2v2', 'pulsar xlite',
        'ninjutso', 'ninjutso sora',
        'vgn dragonfly', 'f1 moba', 'dragonfly f1',
        'wlmouse', 'beast x',
        'g-wolves', 'gwolves hts',
        'endgame gear', 'xm2we', 'op1we',
        'zaopin', 'zaopin z1',

        // Brands - Thai & Budget
        'loga', 'loga mouse', 'loga garuda', 'loga kirin', 'loga mantra',
        'neolution', 'neolution e-sport',
        'nubwo', 'nubwo x', 'nubwo nk',
        'signo', 'signo e-sport',
        'fantech', 'fantech helios', 'fantech aria',
        'oker', 'oker mouse',
        'gtech', 'ttech', 'melon',

        // Popular Models (Specific)
        'g pro x', 'superlight', 'gpx',
        'dav3', 'deathadder v3 pro',
        'viper min', 'viper v2',
        'g102', 'g203',

        // Conditions & Price
        'เมาส์ราคาถูก', 'budget mouse',
        'เมาส์ 100', 'เมาส์ 200', 'เมาส์ 300', 'เมาส์ 500',
        'เมาส์ไม่เกิน 500', 'เมาส์ไม่เกิน 1000',
        'เมาส์เกมมิ่งราคาถูก', 'cheap gaming mouse',
        'เมาส์แท้', 'เมาส์ประกันศูนย์',
    ],

    // ========================================
    // 405: PRINTERS / ปริ้นเตอร์
    // ========================================
    405: [
        // Thai Terms (High Priority)
        'ปริ้นเตอร์', 'เครื่องพิมพ์', 'ปริ้นท์', 'เครื่องปริ้น', 'printer',
        'เครื่องพิมพ์เลเซอร์', 'เครื่องพิมพ์หมึกพ่น', 'เครื่องพิมพ์สี',
        'ปริ้นเตอร์หมึกพ่น', 'ปริ้นเตอร์เลเซอร์', 'ปริ้นเตอร์แท็งค์',
        'ปริ้นเตอร์ออฟฟิศ', 'ปริ้นเตอร์บ้าน', 'ปริ้นเตอร์มือสอง',
        'เครื่องพิมพ์ขาวดำ', 'เครื่องพิมพ์เอกสาร',
        'เครื่องพิมพ์ราคาถูก', 'เครื่องพิมพ์สำนักงาน',

        // Scanner & Copier
        'สแกนเนอร์', 'เครื่องสแกน', 'เครื่องสแกนเอกสาร', 'scanner',
        'เครื่องถ่ายเอกสาร', 'เครื่องถ่าย', 'copier',

        // Ink & Supplies
        'หมึกพิมพ์', 'หมึกปริ้นเตอร์', 'ตลับหมึก', 'คาทริจ',
        'toner', 'โทนเนอร์', 'หมึกโทนเนอร์',

        // English Terms
        'printer', 'printers', 'printing', 'print',
        'inkjet printer', 'ink jet', 'inkjet',
        'laser printer', 'laserjet', 'laser',
        'mono printer', 'monochrome', 'black white printer',
        'color printer', 'colour printer',
        'ecotank', 'eco tank', 'tank printer', 'ink tank',
        'deskjet', 'officejet', 'laserjet pro',

        // Types
        'all in one printer', 'aio printer',
        'multifunction printer', 'mfp', '3 in 1', '4 in 1',
        'photo printer', 'label printer', 'thermal printer',
        'dot matrix', 'receipt printer', 'pos printer',
        'portable printer', 'wireless printer', 'wifi printer',

        // ========== BRANDS ==========
        // Pantum (เพิ่มใหม่!)
        'pantum', 'pantum printer', 'ปริ้นเตอร์ pantum',
        'pantum p2500', 'pantum p2500w', 'p2500', 'p2500w',
        'pantum m6500', 'pantum m6550', 'pantum m6600',
        'pantum p3300', 'pantum p3010', 'pantum bp5100',

        // Epson
        'epson', 'epson printer', 'epson ecotank',
        'l120', 'l210', 'l220', 'l310', 'l360', 'l380', 'l385',
        'l3110', 'l3150', 'l3156', 'l3210', 'l3250', 'l3260',
        'l5190', 'l5290', 'l6160', 'l6170', 'l6190', 'l6270',

        // Canon
        'canon', 'canon printer', 'canon pixma',
        'g1010', 'g1020', 'g2010', 'g2020', 'g3010', 'g3020', 'g3060', 'g3070',
        'g4010', 'g4020', 'g5070', 'g6070', 'g7070',
        'mg2570', 'mg2577', 'ts207', 'ts307', 'ts3470', 'ts5370',
        'pixma', 'maxify', 'imageclass',

        // HP
        'hp printer', 'hp deskjet', 'hp laserjet', 'hp officejet',
        'p1102', 'p1106', 'p1108', 'm102w', 'm130', 'm203',
        'deskjet 2320', 'deskjet 2720', 'deskjet 4120',
        'laserjet m111', 'laserjet m209', 'laserjet pro',

        // Brother
        'brother', 'brother printer', 'brother laser',
        'hl-l2350', 'dcp-l2540', 'mfc-l2700',

        // Other Brands
        'xerox', 'xerox printer', 'ricoh', 'ricoh printer',
        'samsung printer', 'kyocera', 'oki printer',

        // Supplies
        'ink cartridge', 'toner cartridge', 'drum unit',
        'maintenance box', 'paper', 'photo paper',
        'refill ink', 'หมึกเติม', 'compatible toner',

        // Conditions
        'ปริ้นเตอร์ราคาถูก', 'ปริ้นเตอร์ของแท้', 'ปริ้นเตอร์ประกันศูนย์',

        // ========== เพิ่มใหม่ ==========

        // ========== CARD PRINTERS (เครื่องพิมพ์บัตร) - HIGH PRIORITY ==========
        // Thai Terms
        'เครื่องพิมพ์บัตร', 'เครื่องปริ้นบัตร', 'ปริ้นเตอร์บัตร', 'ปริ้นท์บัตร',
        'เครื่องพิมพ์บัตรพนักงาน', 'เครื่องพิมพ์บัตรนักเรียน', 'เครื่องพิมพ์บัตรสมาชิก',
        'เครื่องพิมพ์บัตรประชาชน', 'เครื่องพิมพ์บัตร id', 'เครื่องพิมพ์บัตรพลาสติก',
        'เครื่องพิมพ์บัตร pvc', 'เครื่องพิมพ์นามบัตร',

        // English Terms
        'card printer', 'id card printer', 'badge printer',
        'plastic card printer', 'pvc card printer',
        'employee badge printer', 'student id printer',
        'membership card printer', 'business card printer',
        'photo id printer', 'credential card printer',

        // Card Printer Brands
        'fargo card printer', 'fargo dtc', 'fargo hdp',
        'evolis card printer', 'evolis primacy', 'evolis zenius',
        'datacard printer', 'datacard sd', 'datacard cd',
        'zebra card printer', 'zebra zxp', 'zebra zc',
        'magicard printer', 'magicard enduro', 'magicard rio',
        'nisca card printer', 'pointman',
        'canon card printer', 'canon id card',

        // Card Types
        'บัตร pvc', 'pvc card', 'plastic card',
        'proximity card', 'rfid card', 'smart card',
        'magnetic stripe card', 'barcode card',
        'ริบบิ้น', 'printer ribbon', 'ribbon cartridge',
        'ymcko ribbon', 'monochrome ribbon',

        // Office Machines
        'เครื่องเคลือบบัตร', 'laminator', 'เครื่องเคลือบเอกสาร',
        'เครื่องทำลายเอกสาร', 'shredder', 'paper shredder',
        'เครื่องตอกบัตร', 'time recorder', 'fingerprint scanner',
        'เครื่องนับธนบัตร', 'money counter',
        'เครื่องตัดกระดาษ', 'paper cutter',

        // 3D Printing (Hot!)
        '3d printer', 'เครื่องปริ้น 3d', 'เครื่องพิมพ์ 3 มิติ',
        'resin printer', 'sla printer', 'fdm printer',
        'creality', 'ender 3', 'anycubic', 'elegoo',
        '3d filament', 'เส้นพลาสติก 3d', 'resin', 'เรซิ่น',

        // Portable & Photo
        'portable printer', 'เครื่องปริ้นพกพา', 'mobile printer',
        'pocket printer', 'instax printer', 'instax link',
        'canon selphy', 'xiaomi photoprinter',
        'peripage', 'memobird', 'paperang',
        'thermal paper', 'กระดาษความร้อน', 'สติ๊กเกอร์ความร้อน',

        // POS & Receipt
        'pos printer', 'เครื่องพิมพ์ใบเสร็จ', 'receipt printer',
        'เครื่องปริ้นสลิป', 'thermal receipt',
        'xprinter', 'epson tm',

        // Plotters & Large Format
        'plotter', 'เครื่องพลอตเตอร์',
        'large format printer', 'เครื่องพิมพ์ไวนิล', 'เครื่องพิมพ์แบบแปลน',
        'hp designjet', 'canon imageprograf',

        // Conditions
        'ปริ้นเตอร์ผ่อน', 'ผ่อน 0%', 'ออกใบกำกับภาษี',

        // Price Ranges (NEW!)
        'ปริ้นเตอร์ 3000', 'ปริ้นเตอร์ 5000', 'ปริ้นเตอร์ 7000', 'ปริ้นเตอร์ 10000',
        'ปริ้นเตอร์ไม่เกิน 5000', 'ปริ้นเตอร์ไม่เกิน 10000',
        'printer under 5000', 'printer under 10000',
        'เครื่องพิมพ์บัตร 20000', 'เครื่องพิมพ์บัตร 30000', 'เครื่องพิมพ์บัตร 50000',
    ],

    // ========================================
    // 406: COMPONENTS & PARTS / อะไหล่และชิ้นส่วน (Non-Core)
    // Focus: Case, Cooling, Cables, Accessories
    // ========================================
    406: [
        // General
        'อะไหล่', 'อะไหล่คอม', 'ชิ้นส่วน', 'ชิ้นส่วนคอม',
        'components', 'pc components', 'computer components', 'parts', 'pc parts',
        'อุปกรณ์ประกอบ', 'อุปกรณ์สร้างคอม', 'accessories', 'modding',

        // ========== PC CASE ==========
        // General
        'case', 'เคส', 'เคสคอม', 'เคสพีซี', 'กล่องคอม',
        'computer case', 'pc case', 'tower case', 'chassis',
        'เคสกระจก', 'เคสใส', 'เคสระบายความร้อน',

        // Types
        'atx case', 'mid tower', 'full tower', 'mini tower',
        'matx case', 'micro atx case', 'mini itx case',
        'htpc case', 'cube case', 'sff case', 'small form factor',
        'test bench', 'open air case',

        // Features
        'gaming case', 'rgb case', 'argb case',
        'tempered glass', 'tg case', 'glass panel',
        'mesh case', 'mesh front', 'airflow case',
        'silent case', 'sound dampening',
        'modular case', 'tool-less', 'tool-free',
        'vertical gpu mount', 'gpu bracket', 'riser cable',

        // Colors
        'white case', 'black case', 'gray case', 'pink case',
        'เคสสีขาว', 'เคสสีดำ', 'เคสสีชมพู',

        // Brands
        'nzxt case', 'corsair case', 'lian li case',
        'fractal design', 'phanteks case', 'cooler master case',
        'thermaltake case', 'deepcool case', 'antec case',
        'be quiet case', 'silverstone case', 'montech', 'tsunami case',

        // ========== COOLING COMPONENTS ==========
        // CPU Coolers
        'cpu cooler', 'cooler', 'พัดลมซีพียู', 'คูลเลอร์', 'ซิงค์ลม',
        'air cooler', 'tower cooler', 'low profile cooler', 'stock cooler',
        'aio', 'aio cooler', 'liquid cooler', 'water cooler', 'ชุดน้ำ', 'ชุดน้ำปิด', 'ชุดน้ำเปิด',
        '120mm aio', '240mm aio', '280mm aio', '360mm aio', '420mm aio',

        // Case Fans
        'case fan', 'พัดลมเคส', 'chassis fan', 'system fan',
        '120mm fan', '140mm fan', '200mm fan',
        'fan 120', 'fan 140',
        'rgb fan', 'argb fan', 'led fan',
        'pwm fan', '4 pin fan', '3 pin fan',
        'static pressure fan', 'airflow fan',
        'silent fan', 'quiet fan', 'low noise',

        // Fan Controllers & Hubs
        'fan hub', 'fan controller', 'fan splitter',
        'pwm hub', 'rgb controller', 'argb controller',
        'remote fan', 'กล่องคุมไฟ',

        // Thermal Solutions
        'thermal paste', 'thermal compound', 'ยาทาซีพียู', 'ซิลิโคนซีพียู',
        'thermal pad', 'thermal grizzly', 'thermal putty',
        'arctic mx-4', 'noctua nt-h1', 'thermal interface', 'liquid metal',

        // Custom Water Cooling
        'water block', 'cpu block', 'gpu block', 'บล็อกน้ำ',
        'reservoir', 'pump', 'res combo', 'ถังพักน้ำ', 'ปั๊มน้ำคอม',
        'fitting', 'tubing', 'soft tube', 'hard tube', 'ท่ออะคริลิค',
        'coolant', 'น้ำหล่อเย็น', 'radiator', 'หม้อน้ำคอม',

        // ========== CABLES & CONNECTORS ==========
        // Internal Cables
        'sata cable', 'สาย sata',
        'power cable', 'psu cable', 'modular cable', 'สาย psu',
        '24 pin cable', '8 pin cable', '6 pin cable', '12vhpwr',
        'pcie cable', 'cpu power cable', 'eps cable',
        'molex cable', '4 pin molex',
        'rgb cable', 'argb cable', '5v argb', '12v rgb',
        'fan cable', 'pwm cable',
        'front panel cable', 'usb header',

        // External Cables (Some overlap with Peripherals, but okay for Parts context)
        'hdmi cable', 'สาย hdmi',
        'displayport cable', 'dp cable', 'สาย dp',
        'usb cable', 'usb-c cable', 'type-c cable',
        'ethernet cable', 'lan cable', 'สาย lan',

        // Cable Management
        'cable comb', 'หวีสายไฟ', 'cable tie', 'cable clip',
        'cable sleeve', 'sleeved cable', 'braided cable', 'สายถัก',
        'cable extension', 'extension cable',
        'velcro strap', 'zip tie', 'หนวดกุ้ง',

        // ========== TOOLS & ACCESSORIES ==========
        // Tools
        'screwdriver', 'ไขควง', 'precision screwdriver',
        'anti-static wrist strap', 'esd wrist strap',
        'thermal paste applicator', 'isopropyl alcohol',
        'cable tester', 'psu tester',

        // Lighting & Modding
        'led strip', 'rgb strip', 'argb strip', 'ไฟเส้นคอม',
        'led controller', 'remote control',
        'lcd screen', 'sensor panel', 'จอแสดงสถานะ',

        // Brackets & Mounts
        'gpu support', 'gpu support bracket', 'gpu brace', 'anti-sag bracket', 'ไม้ค้ำการ์ดจอ',
        'ssd bracket', 'hdd bracket', 'ถาดแปลง',
        'vertical mount', 'vertical stand',

        // Screws & Standoffs
        'motherboard screw', 'standoff', 'น็อตคอม',
        'm3 screw', 'thumbscrew', 'rubber screw',

        // Adapters
        'adapter', 'converter', 'ตัวแปลง',
        'molex to sata', 'sata to molex',
        'usb header adapter', 'internal usb hub',

        // ========== PRICE RANGES (NEW!) ==========
        // Cases
        'case 1000', 'case 2000', 'case 3000', 'case 5000',
        'เคส 1000', 'เคส 2000', 'เคส 3000',

        // Cooling
        'aio 2000', 'aio 3000', 'aio 5000',
        'cpu cooler 500', 'cpu cooler 1000', 'cpu cooler 2000',
        'fan 100', 'fan 200', 'fan 500',

        // General
        'อะไหล่ 500', 'อะไหล่ 1000', 'อะไหล่ 2000',
    ],

    // ========================================
    // 407: GAMING PC / คอมเกมมิ่ง
    // ========================================
    407: [
        // General
        'gaming pc', 'pc gaming', 'gaming rig', 'gaming computer',
        'เกมมิ่ง pc', 'พีซีเกม', 'คอมเกม', 'คอมเกมมิ่ง', 'pc เกม',
        'esports pc', 'streaming pc', 'content creator pc',
        'custom gaming pc', 'pre-built gaming pc', 'ชุดคอมเกม',
        'rgb gaming pc', 'gaming build', 'complete gaming pc',

        // Price Ranges - Thai (NEW!)
        'คอมเกม 15000', 'คอมเกม 20000', 'คอมเกม 25000', 'คอมเกม 30000',
        'คอมเกม 35000', 'คอมเกม 40000', 'คอมเกม 50000', 'คอมเกม 60000',
        'คอมเกมไม่เกิน 15000', 'คอมเกมไม่เกิน 20000', 'คอมเกมไม่เกิน 30000',
        'งบ 15000', 'งบ 20000', 'งบ 25000', 'งบ 30000', 'งบ 50000',

        // Price Ranges - English (NEW!)
        'gaming pc under 15k', 'gaming pc under 20k', 'gaming pc under 30k',
        'gaming pc under 50k', 'pc gaming budget 15000', 'pc gaming budget 20000',

        // Budget Tiers (NEW!)
        'budget gaming pc', 'cheap gaming pc', 'affordable gaming pc',
        'mid range gaming pc', 'mid tier gaming pc',
        'high end gaming pc', 'premium gaming pc', 'flagship gaming pc',
        'ultimate gaming pc', 'extreme gaming pc',

        // Performance Tiers (NEW!)
        '1080p gaming pc', '1080p 60fps pc', '1080p 144fps pc',
        '1440p gaming pc', '1440p 144hz pc', '2k gaming pc',
        '4k gaming pc', '4k 60fps pc', '4k gaming build',
        'ultra settings pc', 'max settings gaming pc',

        // Game-Specific Builds (NEW!)
        'คอมเกม valorant', 'คอมเล่น valorant', 'valorant pc',
        'คอมเกม gta', 'คอมเล่น gta v', 'gta 5 pc',
        'คอมเกม pubg', 'pubg pc', 'คอมเล่น pubg',
        'คอมเกม fifa', 'fifa pc', 'คอมเล่น fc 24',
        'คอมเกม minecraft', 'minecraft pc',
        'คอมเล่น rov', 'rov pc', 'คอมเกม moba',
        'คอมเกม fps', 'fps gaming pc',
        'คอมเกม aaa', 'aaa gaming pc',

        // Streaming & Content (NEW!)
        'streaming pc', 'คอมสตรีม', 'คอมไลฟ์สด',
        'streaming build', 'youtube pc', 'twitch pc',
        'content creation pc', 'คอมตัดต่อเกม',

        // GPU-Specific
        'rtx gaming pc', 'gtx gaming pc', 'nvidia gaming pc',
        '3060 pc', '3070 pc', '3080 pc', '4060 pc', '4070 pc', '4080 pc', '4090 pc',
        'rtx 4060 gaming pc', 'rtx 4070 gaming pc',

        // CPU-Specific
        'i5 gaming pc', 'i7 gaming pc', 'i9 gaming pc',
        'ryzen 5 gaming pc', 'ryzen 7 gaming pc', 'ryzen 9 gaming pc',
        'i5 13400f pc', 'i5 14400f pc', 'ryzen 5 5600 pc', 'ryzen 7 5700x pc',

        // Aesthetics
        'white gaming pc', 'black gaming pc', 'rgb pc', 'argb gaming pc',
        'gaming tower', 'gaming setup',

        // Thai Local Terms (NEW!)
        'คอมเกมสเปคดี', 'คอมเกมสเปคสูง', 'คอมเกมแรงๆ',
        'คอมเกมประกอบ', 'คอมเกมสำเร็จรูป', 'คอมเกมครบเซ็ต',
        'คอมเกมมือสอง', 'คอมเกมมือ2', 'คอมเกมราคาถูก',
        'คอมร้านเกม', 'คอมเน็ต', 'gaming cafe pc',

        // Hybrid
        'gaming workstation', 'workstation gaming pc',
    ],

    // ========================================
    // 410: PC PARTS / ชิ้นส่วน PC (Core Components)
    // Focus: CPU, GPU, RAM, Motherboard, PSU, Storage
    // ========================================
    410: [
        // ========== CPU / PROCESSOR ==========
        'cpu', 'processor', 'โปรเซสเซอร์', 'ซีพียู', 'ตัวประมวลผล',
        'intel cpu', 'intel core', 'intel processor',
        'amd cpu', 'amd ryzen', 'amd processor',
        'core i3', 'core i5', 'core i7', 'core i9', 'intel core ultra',
        'i3 cpu', 'i5 cpu', 'i7 cpu', 'i9 cpu',
        'ryzen 3', 'ryzen 5', 'ryzen 7', 'ryzen 9', 'threadripper',
        'ryzen 3000', 'ryzen 5000', 'ryzen 7000', 'ryzen 8000', 'ryzen 9000',
        'gen 12', 'gen 13', 'gen 14', 'arrow lake', 'meteor lake',
        '12400f', '13400f', '13600k', '14700k', '14900k',
        '5600x', '5800x3d', '7600', '7800x3d', '7950x',
        'pentium', 'celeron', 'athlon', 'xeon', 'epyc',

        // ========== MOTHERBOARD (Moved from 406) ==========
        // General
        'mainboard', 'motherboard', 'เมนบอร์ด', 'เมนบอด', 'เมน', 'mobo', 'บอร์ดคอม',

        // Intel Chipsets
        'z790', 'z690', 'h770', 'h670', 'b760', 'b660', 'h610',
        'lga 1700', 'lga 1200', 'lga 1151', 'lga 1851',

        // AMD Chipsets  
        'x670', 'x670e', 'b650', 'b650e', 'a620',
        'x570', 'b550', 'b450', 'a520', 'a320',
        'am5', 'am4', 'tr4',

        // Form Factors
        'atx motherboard', 'matx motherboard', 'itx motherboard', 'eatx motherboard',

        // Brands
        'asus rog', 'asus strix', 'asus tuf', 'asus prime', 'asus proart',
        'msi meg', 'msi mpg', 'msi mag', 'msi pro', 'msi godlike',
        'gigabyte aorus', 'gigabyte aero', 'gigabyte eagle', 'gigabyte gaming x',
        'asrock taichi', 'asrock steel legend', 'asrock phantom gaming', 'asrock pro',
        'nzxt motherboard', 'biostar',

        // ========== GPU / GRAPHICS CARD ==========
        // General
        'gpu', 'vga', 'การ์ดจอ', 'การ์ดแสดงผล', 'กราฟฟิก',
        'graphics card', 'video card', 'vga card', 'display card',
        'discrete gpu', 'dedicated gpu',

        // NVIDIA
        'nvidia gpu', 'geforce', 'geforce rtx', 'geforce gtx',
        'rtx 2060', 'rtx 2070', 'rtx 2080', 'rtx 2080 ti',
        'rtx 3050', 'rtx 3060', 'rtx 3060 ti', 'rtx 3070', 'rtx 3070 ti',
        'rtx 3080', 'rtx 3080 ti', 'rtx 3090', 'rtx 3090 ti',
        'rtx 4060', 'rtx 4060 ti', 'rtx 4070', 'rtx 4070 super', 'rtx 4070 ti', 'rtx 4070 ti super',
        'rtx 4080', 'rtx 4080 super', 'rtx 4090',
        'gtx 1650', 'gtx 1660', 'gtx 1660 super', 'gtx 1660 ti',
        'gtx 1050', 'gtx 1050 ti', 'gtx 1060', 'gtx 1070', 'gtx 1080', 'gtx 1080 ti',
        'gt 1030', 'gt 730', 'quadro', 'rtx a4000', 'rtx a6000',

        // AMD
        'amd gpu', 'radeon', 'radeon rx',
        'rx 7600', 'rx 7700 xt', 'rx 7800 xt', 'rx 7900 xt', 'rx 7900 xtx',
        'rx 6400', 'rx 6500 xt', 'rx 6600', 'rx 6600 xt', 'rx 6650 xt',
        'rx 6700 xt', 'rx 6750 xt', 'rx 6800', 'rx 6800 xt', 'rx 6900 xt', 'rx 6950 xt',
        'rx 550', 'rx 560', 'rx 570', 'rx 580', 'rx 590',
        'rx 5500 xt', 'rx 5600 xt', 'rx 5700 xt',

        // Intel
        'intel arc', 'arc a380', 'arc a580', 'arc a750', 'arc a770',

        // GPU Brands
        'asus graphics card', 'msi graphics card', 'gigabyte graphics card',
        'zotac', 'galax', 'inno3d', 'colorful', 'palit', 'pny', 'leadtek',
        'sapphire', 'powercolor', 'xfx', 'asrock graphics card',

        // ========== RAM / MEMORY ==========
        // General
        'แรม', 'ram', 'หน่วยความจำ', 'memory',
        'แรมคอม', 'แรมพีซี', 'ram pc', 'ram desktop',
        'dimm', 'udimm', 'sodimm',

        // Specs
        'ddr3', 'ddr4', 'ddr5',
        '4gb', '8gb', '16gb', '32gb', '64gb', '128gb', '192gb',
        'single channel', 'dual channel', 'quad channel',
        'bus 2666', 'bus 3200', 'bus 3600', 'bus 4800', 'bus 5200', 'bus 5600', 'bus 6000',
        'cl16', 'cl18', 'cl30', 'cl32', 'cl36', 'xmp', 'expo',
        'ecc ram', 'server ram',

        // Brands
        'corsair vengeance', 'corsair dominator',
        'kingston fury', 'kingston beast', 'kingston renegade',
        'g.skill trident', 'g.skill ripjaws', 'g.skill flare',
        'teamgroup t-force', 'vulcan', 'delta rgb',
        'adata xpg', 'lancer', 'spectrix',
        'crucial pro', 'crucial basics',
        'blackberry ram', 'hikvision ram',

        // ========== STORAGE (SSD/HDD) ==========
        // General
        'storage', 'ฮาร์ดดิสก์', 'hard disk', 'harddisk', 'hard drive',
        'ssd', 'solid state drive', 'เอสเอสดี',

        // Types
        'm.2', 'm.2 nvme', 'm.2 sata', 'pcie 3.0', 'pcie 4.0', 'pcie 5.0',
        '2.5 ssd', 'sata ssd',
        '3.5 hdd', '2.5 hdd', 'internal hdd',
        'gen3', 'gen4', 'gen5',

        // Capacity
        '120gb', '128gb', '240gb', '250gb', '256gb',
        '480gb', '500gb', '512gb',
        '1tb', '2tb', '4tb', '8tb', '10tb', '12tb',
        '1000gb', '2000gb',

        // Brands
        'samsung 970 evo', 'samsung 980 pro', 'samsung 990 pro',
        'wd black', 'wd blue', 'wd green', 'sn850x', 'sn770', 'sn580',
        'seagate barracuda', 'seagate firecuda', 'ironwolf', 'skyhawk',
        'kingston kc3000', 'kingston nv2',
        'crucial p3', 'crucial p5', 't500',
        'hynix platinum', 'solidigm', 'transcend', 'apacer',

        // ========== POWER SUPPLY (PSU) ==========
        // General
        'psu', 'power supply', 'เพาเวอร์ซัพพลาย', 'หม้อแปลงคอม',
        'ปั๊มไฟ', 'ตัวจ่ายไฟ',

        // Specs
        '450w', '500w', '550w', '600w', '650w', '700w', '750w', '850w', '1000w', '1200w', '1600w',
        '80 plus', '80+ white', '80+ bronze', '80+ silver', '80+ gold', '80+ platinum', '80+ titanium',
        'modular', 'full modular', 'semi modular', 'non modular',
        'atx 3.0', 'atx 3.1', 'pcie 5.0 ready',
        'sfx psu', 'sfx-l',

        // Brands
        'corsair rm', 'corsair rme', 'corsair rmx', 'corsair hx', 'corsair ax',
        'seasonic focus', 'seasonic vertex', 'seasonic prime',
        'thermaltake toughpower', 'smart s', 'bm2', 'gf1', 'gf3',
        'cooler master mwe', 'v gold',
        'be quiet pure power', 'dark power',
        'silverstone da', 'silverstone sx',
        'antec atom', 'antec neco', 'antec hcg',
        'msi mag', 'msi mpg',
        'asus rog thor', 'asus rog loki', 'asus tuf gaming',

        // ========== CONDITIONS & GENERAL ==========
        'มือ1', 'มือ2', 'มือสอง', 'new', 'used',
        'ประกันศูนย์', 'warranty', 'synnex', 'ingram', 'ascenti', 'svoa',
        'advice warranty', 'jib warranty',
        'full box', 'ครบกล่อง', 'ไม่มีกล่อง', 'only board',

        // ========== PRICE RANGES (NEW!) ==========
        // CPU
        'cpu 3000', 'cpu 5000', 'cpu 7000', 'cpu 10000',
        'i5 5000', 'i7 10000', 'ryzen 5 5000', 'ryzen 7 7000',

        // GPU
        'gpu 5000', 'gpu 10000', 'gpu 15000', 'gpu 20000', 'gpu 30000',
        'การ์ดจอ 5000', 'การ์ดจอ 10000', 'การ์ดจอ 15000', 'การ์ดจอ 20000',
        'rtx 4060 15000', 'rtx 4070 25000',

        // RAM
        'แรม 500', 'แรม 1000', 'แรม 2000', 'แรม 3000',
        'ram 8gb 1000', 'ram 16gb 2000', 'ram 32gb 5000',

        // Storage
        'ssd 500', 'ssd 1000', 'ssd 2000', 'ssd 5000',
        'hdd 1000', 'hdd 2000',

        // PSU
        'psu 1000', 'psu 2000', 'psu 3000', 'psu 5000',
        'หม้อแปลง 1000', 'หม้อแปลง 2000',

        // Motherboard
        'เมนบอร์ด 3000', 'เมนบอร์ด 5000', 'เมนบอร์ด 10000',
        'mainboard 3000', 'mainboard 5000',
    ],
}

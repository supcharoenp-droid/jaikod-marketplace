/**
 * Category Schema Templates
 * โครงสร้างข้อมูลมาตรฐานสำหรับแต่ละหมวดหมู่สินค้า
 * ใช้สำหรับ:
 * 1. AI เขียนรายละเอียดสินค้า
 * 2. AI ประเมินราคา
 * 3. Validation ข้อมูลสินค้า
 */

export interface AttributeField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'select' | 'multiselect' | 'boolean' | 'range';
    required: boolean;
    options?: string[];
    unit?: string;
    min?: number;
    max?: number;
    placeholder?: string;
    helpText?: string;
    aiImportance: 'critical' | 'high' | 'medium' | 'low'; // ความสำคัญสำหรับ AI
}

export interface PriceFactors {
    key: string;
    label: string;
    weight: number; // น้ำหนักในการคำนวณราคา (0-1)
    type: 'depreciation' | 'condition' | 'brand' | 'specs' | 'market' | 'rarity';
    description: string;
}

export interface AIDescriptionTemplate {
    structure: string[]; // โครงสร้างย่อหน้า
    toneOfVoice: string;
    keyPoints: string[]; // จุดเด่นที่ต้องเน้น
    requiredSections: string[]; // ส่วนที่จำเป็นต้องมี
    examplePrompt: string; // ตัวอย่าง Prompt สำหรับ AI
}

export interface CategorySchema {
    categoryId: string;
    categoryName: string;
    attributes: AttributeField[];
    priceFactors: PriceFactors[];
    aiDescriptionTemplate: AIDescriptionTemplate;
    priceRange: {
        min: number;
        max: number;
        currency: string;
    };
    depreciationRate: number; // อัตราการลดราคาต่อปี (%)
    marketDataSources?: string[]; // แหล่งข้อมูลราคาตลาด
}

// ========================================
// 📱 MOBILE PHONES SCHEMA
// ========================================
export const mobilePhoneSchema: CategorySchema = {
    categoryId: 'mobiles',
    categoryName: 'โทรศัพท์มือถือ',
    attributes: [
        {
            key: 'brand',
            label: 'ยี่ห้อ',
            type: 'select',
            required: true,
            options: ['Apple', 'Samsung', 'Xiaomi', 'OPPO', 'Vivo', 'Huawei', 'Realme', 'OnePlus', 'Google', 'Sony', 'อื่นๆ'],
            aiImportance: 'critical',
            helpText: 'ยี่ห้อมีผลต่อราคามาก'
        },
        {
            key: 'model',
            label: 'รุ่น',
            type: 'text',
            required: true,
            placeholder: 'เช่น iPhone 15 Pro Max',
            aiImportance: 'critical',
            helpText: 'ระบุรุ่นให้ชัดเจน'
        },
        {
            key: 'storage',
            label: 'ความจุ',
            type: 'select',
            required: true,
            options: ['64GB', '128GB', '256GB', '512GB', '1TB'],
            aiImportance: 'high',
            helpText: 'ความจุมีผลต่อราคา'
        },
        {
            key: 'ram',
            label: 'RAM',
            type: 'select',
            required: false,
            options: ['4GB', '6GB', '8GB', '12GB', '16GB'],
            aiImportance: 'medium'
        },
        {
            key: 'color',
            label: 'สี',
            type: 'text',
            required: false,
            placeholder: 'เช่น Midnight Black',
            aiImportance: 'low'
        },
        {
            key: 'condition',
            label: 'สภาพ',
            type: 'select',
            required: true,
            options: ['ใหม่ ไม่แกะกล่อง', 'ใหม่ แกะกล่องแล้ว', 'มือสอง สภาพดีมาก', 'มือสอง สภาพดี', 'มือสอง สภาพใช้งานได้'],
            aiImportance: 'critical',
            helpText: 'สภาพมีผลต่อราคามากที่สุด'
        },
        {
            key: 'warranty',
            label: 'การรับประกัน',
            type: 'select',
            required: false,
            options: ['ยังไม่หมดประกัน', 'หมดประกันแล้ว', 'ไม่มีประกัน'],
            aiImportance: 'high'
        },
        {
            key: 'batteryHealth',
            label: 'สุขภาพแบตเตอรี่',
            type: 'number',
            required: false,
            unit: '%',
            min: 0,
            max: 100,
            placeholder: '85',
            aiImportance: 'high',
            helpText: 'สำหรับ iPhone สามารถเช็คได้ในการตั้งค่า'
        },
        {
            key: 'accessories',
            label: 'อุปกรณ์ที่มาด้วย',
            type: 'multiselect',
            required: false,
            options: ['กล่อง', 'สายชาร์จ', 'หัวชาร์จ', 'หูฟัง', 'เคส', 'ฟิล์มกันรอย'],
            aiImportance: 'medium'
        },
        {
            key: 'imei',
            label: 'IMEI',
            type: 'text',
            required: false,
            placeholder: '15 หลัก',
            aiImportance: 'low',
            helpText: 'ช่วยตรวจสอบความถูกต้อง'
        }
    ],
    priceFactors: [
        {
            key: 'brand_premium',
            label: 'ค่าแบรนด์',
            weight: 0.25,
            type: 'brand',
            description: 'Apple, Samsung flagship มีค่าแบรนด์สูง'
        },
        {
            key: 'age_depreciation',
            label: 'อายุการใช้งาน',
            weight: 0.30,
            type: 'depreciation',
            description: 'ลดราคา 20-30% ต่อปี'
        },
        {
            key: 'physical_condition',
            label: 'สภาพเครื่อง',
            weight: 0.20,
            type: 'condition',
            description: 'รอยขีดข่วน, จอแตก, ตัวเครื่อง'
        },
        {
            key: 'battery_health',
            label: 'สุขภาพแบตเตอรี่',
            weight: 0.15,
            type: 'condition',
            description: 'แบตต่ำกว่า 80% ลดราคา 10-15%'
        },
        {
            key: 'market_demand',
            label: 'ความต้องการตลาด',
            weight: 0.10,
            type: 'market',
            description: 'รุ่นยอดนิยมราคาดีกว่า'
        }
    ],
    aiDescriptionTemplate: {
        structure: [
            'intro', // แนะนำสินค้าโดยรวม
            'specs', // สเปคโดยละเอียด
            'condition', // สภาพสินค้า
            'accessories', // อุปกรณ์ที่มาด้วย
            'highlights', // จุดเด่น
            'usage' // การใช้งาน
        ],
        toneOfVoice: 'เป็นกันเอง น่าเชื่อถือ ให้ข้อมูลครบถ้วน',
        keyPoints: [
            'ระบุรุ่นและสเปคให้ชัดเจน',
            'เน้นสภาพสินค้าและความใหม่',
            'บอกอุปกรณ์ที่มาด้วยครบถ้วน',
            'ระบุการรับประกัน (ถ้ามี)',
            'แนะนำการใช้งานที่เหมาะสม'
        ],
        requiredSections: ['specs', 'condition', 'accessories'],
        examplePrompt: `เขียนรายละเอียดสินค้าโทรศัพท์มือถือ โดยมีข้อมูลดังนี้:
- ยี่ห้อ: {brand}
- รุ่น: {model}
- ความจุ: {storage}
- สภาพ: {condition}
- สุขภาพแบตเตอรี่: {batteryHealth}%
- อุปกรณ์: {accessories}

เขียนให้น่าสนใจ เป็นกันเอง และให้ข้อมูลครบถ้วน ความยาว 150-200 คำ`
    },
    priceRange: {
        min: 1000,
        max: 80000,
        currency: 'THB'
    },
    depreciationRate: 25, // ลดราคา 25% ต่อปี
    marketDataSources: ['mercari.com', 'kaidee.com', 'facebook marketplace']
};

// ========================================
// 💻 COMPUTERS & LAPTOPS SCHEMA
// ========================================
export const computerSchema: CategorySchema = {
    categoryId: 'computers',
    categoryName: 'คอมพิวเตอร์และแล็ปท็อป',
    attributes: [
        {
            key: 'type',
            label: 'ประเภท',
            type: 'select',
            required: true,
            options: ['Notebook', 'Desktop', 'All-in-One', 'Gaming Laptop', 'Workstation'],
            aiImportance: 'critical'
        },
        {
            key: 'brand',
            label: 'ยี่ห้อ',
            type: 'select',
            required: true,
            options: ['Apple', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'MSI', 'Razer', 'Microsoft', 'อื่นๆ'],
            aiImportance: 'critical'
        },
        {
            key: 'model',
            label: 'รุ่น',
            type: 'text',
            required: true,
            placeholder: 'เช่น MacBook Pro M3',
            aiImportance: 'critical'
        },
        {
            key: 'processor',
            label: 'CPU',
            type: 'text',
            required: true,
            placeholder: 'เช่น Intel Core i7-13700H',
            aiImportance: 'high'
        },
        {
            key: 'ram',
            label: 'RAM',
            type: 'select',
            required: true,
            options: ['4GB', '8GB', '16GB', '32GB', '64GB', '128GB'],
            aiImportance: 'high'
        },
        {
            key: 'storage',
            label: 'ความจุ',
            type: 'text',
            required: true,
            placeholder: 'เช่น 512GB SSD',
            aiImportance: 'high'
        },
        {
            key: 'gpu',
            label: 'การ์ดจอ',
            type: 'text',
            required: false,
            placeholder: 'เช่น NVIDIA RTX 4060',
            aiImportance: 'high'
        },
        {
            key: 'screenSize',
            label: 'ขนาดหน้าจอ',
            type: 'select',
            required: false,
            options: ['13"', '14"', '15.6"', '16"', '17"', '24"', '27"'],
            unit: 'นิ้ว',
            aiImportance: 'medium'
        },
        {
            key: 'condition',
            label: 'สภาพ',
            type: 'select',
            required: true,
            options: ['ใหม่ ไม่แกะกล่อง', 'ใหม่ แกะกล่องแล้ว', 'มือสอง สภาพดีมาก', 'มือสอง สภาพดี', 'มือสอง สภาพใช้งานได้'],
            aiImportance: 'critical'
        },
        {
            key: 'warranty',
            label: 'การรับประกัน',
            type: 'select',
            required: false,
            options: ['ยังไม่หมดประกัน', 'หมดประกันแล้ว', 'ไม่มีประกัน'],
            aiImportance: 'high'
        },
        {
            key: 'os',
            label: 'ระบบปฏิบัติการ',
            type: 'select',
            required: false,
            options: ['Windows 11', 'Windows 10', 'macOS', 'Linux', 'ไม่มี OS'],
            aiImportance: 'medium'
        }
    ],
    priceFactors: [
        {
            key: 'specs_performance',
            label: 'ประสิทธิภาพสเปค',
            weight: 0.35,
            type: 'specs',
            description: 'CPU, RAM, GPU, Storage'
        },
        {
            key: 'brand_premium',
            label: 'ค่าแบรนด์',
            weight: 0.15,
            type: 'brand',
            description: 'Apple, Razer มีค่าแบรนด์สูง'
        },
        {
            key: 'age_depreciation',
            label: 'อายุการใช้งาน',
            weight: 0.25,
            type: 'depreciation',
            description: 'ลดราคา 15-20% ต่อปี'
        },
        {
            key: 'physical_condition',
            label: 'สภาพเครื่อง',
            weight: 0.15,
            type: 'condition',
            description: 'รอยขีดข่วน, คีย์บอร์ด, จอ'
        },
        {
            key: 'market_demand',
            label: 'ความต้องการตลาด',
            weight: 0.10,
            type: 'market',
            description: 'Gaming laptop ความต้องการสูง'
        }
    ],
    aiDescriptionTemplate: {
        structure: ['intro', 'specs', 'performance', 'condition', 'usage', 'highlights'],
        toneOfVoice: 'มืออาชีพ ให้ข้อมูลเทคนิคครบถ้วน',
        keyPoints: [
            'ระบุสเปคทั้งหมดให้ชัดเจน',
            'เน้นประสิทธิภาพและการใช้งาน',
            'บอกสภาพเครื่องและอุปกรณ์',
            'แนะนำกลุ่มผู้ใช้ที่เหมาะสม',
            'ระบุการอัพเกรดที่เป็นไปได้'
        ],
        requiredSections: ['specs', 'performance', 'condition'],
        examplePrompt: `เขียนรายละเอียดคอมพิวเตอร์/แล็ปท็อป โดยมีข้อมูลดังนี้:
- ประเภท: {type}
- ยี่ห้อ: {brand}
- รุ่น: {model}
- CPU: {processor}
- RAM: {ram}
- Storage: {storage}
- GPU: {gpu}
- สภาพ: {condition}

เขียนให้เป็นมืออาชีพ ครบถ้วน และแนะนำการใช้งาน ความยาว 200-250 คำ`
    },
    priceRange: {
        min: 5000,
        max: 150000,
        currency: 'THB'
    },
    depreciationRate: 20,
    marketDataSources: ['mercari.com', 'notebookspec.com', 'facebook marketplace']
};

// ========================================
// 🐾 PETS SCHEMA
// ========================================
export const petsSchema: CategorySchema = {
    categoryId: 'pets',
    categoryName: 'สัตว์เลี้ยง',
    attributes: [
        {
            key: 'petType',
            label: 'ประเภทสัตว์',
            type: 'select',
            required: true,
            options: ['สุนัข', 'แมว', 'กระต่าย', 'นก', 'ปลา', 'สัตว์เลื้อยคลาน', 'อื่นๆ'],
            aiImportance: 'critical'
        },
        {
            key: 'breed',
            label: 'สายพันธุ์',
            type: 'text',
            required: true,
            placeholder: 'เช่น ชิสุ, เปอร์เซีย',
            aiImportance: 'critical'
        },
        {
            key: 'age',
            label: 'อายุ',
            type: 'text',
            required: true,
            placeholder: 'เช่น 3 เดือน, 2 ปี',
            aiImportance: 'high'
        },
        {
            key: 'gender',
            label: 'เพศ',
            type: 'select',
            required: true,
            options: ['ตัวผู้', 'ตัวเมีย', 'ไม่ระบุ'],
            aiImportance: 'medium'
        },
        {
            key: 'color',
            label: 'สี/ลวดลาย',
            type: 'text',
            required: false,
            placeholder: 'เช่น น้ำตาลอ่อน, ลายจุด',
            aiImportance: 'low'
        },
        {
            key: 'vaccinated',
            label: 'ฉีดวัคซีน',
            type: 'select',
            required: true,
            options: ['ครบถ้วน', 'บางส่วน', 'ยังไม่ได้ฉีด'],
            aiImportance: 'critical'
        },
        {
            key: 'sterilized',
            label: 'ทำหมัน',
            type: 'select',
            required: false,
            options: ['ทำแล้ว', 'ยังไม่ได้ทำ'],
            aiImportance: 'high'
        },
        {
            key: 'health',
            label: 'สุขภาพ',
            type: 'select',
            required: true,
            options: ['แข็งแรงดี', 'มีประวัติป่วย', 'กำลังรักษา'],
            aiImportance: 'critical'
        },
        {
            key: 'personality',
            label: 'นิสัย',
            type: 'multiselect',
            required: false,
            options: ['เชื่อง', 'ขี้เล่น', 'ขี้อ้อน', 'เข้ากับคนง่าย', 'เข้ากับสัตว์อื่นได้', 'ดุ', 'ขี้กลัว'],
            aiImportance: 'high'
        },
        {
            key: 'pedigree',
            label: 'ใบเพ็ดดิกรี',
            type: 'select',
            required: false,
            options: ['มี', 'ไม่มี'],
            aiImportance: 'medium'
        }
    ],
    priceFactors: [
        {
            key: 'breed_rarity',
            label: 'ความหายากของสายพันธุ์',
            weight: 0.30,
            type: 'rarity',
            description: 'สายพันธุ์หายากราคาสูง'
        },
        {
            key: 'age_factor',
            label: 'อายุ',
            weight: 0.20,
            type: 'depreciation',
            description: 'ลูกสัตว์ราคาสูงกว่า'
        },
        {
            key: 'health_status',
            label: 'สุขภาพและวัคซีน',
            weight: 0.25,
            type: 'condition',
            description: 'ฉีดวัคซีนครบ ทำหมัน ราคาดีกว่า'
        },
        {
            key: 'pedigree_premium',
            label: 'ใบเพ็ดดิกรี',
            weight: 0.15,
            type: 'brand',
            description: 'มีใบเพ็ดดิกรีราคาสูงขึ้น 20-30%'
        },
        {
            key: 'market_demand',
            label: 'ความนิยม',
            weight: 0.10,
            type: 'market',
            description: 'สายพันธุ์ยอดนิยมราคาดี'
        }
    ],
    aiDescriptionTemplate: {
        structure: ['intro', 'breed_info', 'personality', 'health', 'care_tips', 'adoption_info'],
        toneOfVoice: 'อบอุ่น เป็นกันเอง มีความรับผิดชอบ',
        keyPoints: [
            'แนะนำสัตว์เลี้ยงด้วยความรัก',
            'ระบุสายพันธุ์และลักษณะเด่น',
            'เน้นนิสัยและความเหมาะสมกับครอบครัว',
            'บอกสุขภาพและวัคซีนอย่างชัดเจน',
            'ให้คำแนะนำการดูแล',
            'เน้นความรับผิดชอบในการเลี้ยง'
        ],
        requiredSections: ['breed_info', 'personality', 'health'],
        examplePrompt: `เขียนรายละเอียดสัตว์เลี้ยง โดยมีข้อมูลดังนี้:
- ประเภท: {petType}
- สายพันธุ์: {breed}
- อายุ: {age}
- เพศ: {gender}
- วัคซีน: {vaccinated}
- ทำหมัน: {sterilized}
- สุขภาพ: {health}
- นิสัย: {personality}

เขียนให้อบอุ่น น่ารัก และเน้นความรับผิดชอบ ความยาว 150-200 คำ`
    },
    priceRange: {
        min: 500,
        max: 50000,
        currency: 'THB'
    },
    depreciationRate: 0, // สัตว์เลี้ยงไม่มีการลดราคาตามอายุแบบเดียวกับสินค้า
    marketDataSources: ['facebook groups', 'petshop.co.th']
};

// ========================================
// 📸 CAMERAS SCHEMA
// ========================================
export const cameraSchema: CategorySchema = {
    categoryId: 'cameras',
    categoryName: 'กล้องถ่ายรูป',
    attributes: [
        {
            key: 'type',
            label: 'ประเภท',
            type: 'select',
            required: true,
            options: ['DSLR', 'Mirrorless', 'Compact', 'Action Camera', 'Film Camera', 'Instant Camera'],
            aiImportance: 'critical'
        },
        {
            key: 'brand',
            label: 'ยี่ห้อ',
            type: 'select',
            required: true,
            options: ['Canon', 'Nikon', 'Sony', 'Fujifilm', 'Panasonic', 'Olympus', 'GoPro', 'DJI', 'อื่นๆ'],
            aiImportance: 'critical'
        },
        {
            key: 'model',
            label: 'รุ่น',
            type: 'text',
            required: true,
            placeholder: 'เช่น Canon EOS R6 Mark II',
            aiImportance: 'critical'
        },
        {
            key: 'megapixels',
            label: 'ความละเอียด',
            type: 'number',
            required: false,
            unit: 'MP',
            placeholder: '24',
            aiImportance: 'high'
        },
        {
            key: 'sensor',
            label: 'ขนาดเซ็นเซอร์',
            type: 'select',
            required: false,
            options: ['Full Frame', 'APS-C', 'Micro Four Thirds', '1"', 'อื่นๆ'],
            aiImportance: 'high'
        },
        {
            key: 'condition',
            label: 'สภาพ',
            type: 'select',
            required: true,
            options: ['ใหม่ ไม่แกะกล่อง', 'ใหม่ แกะกล่องแล้ว', 'มือสอง สภาพดีมาก', 'มือสอง สภาพดี', 'มือสอง สภาพใช้งานได้'],
            aiImportance: 'critical'
        },
        {
            key: 'shutterCount',
            label: 'Shutter Count',
            type: 'number',
            required: false,
            placeholder: '5000',
            aiImportance: 'high',
            helpText: 'จำนวนครั้งที่กดชัตเตอร์'
        },
        {
            key: 'lens',
            label: 'เลนส์ที่มาด้วย',
            type: 'text',
            required: false,
            placeholder: 'เช่น 24-70mm f/2.8',
            aiImportance: 'high'
        },
        {
            key: 'accessories',
            label: 'อุปกรณ์เสริม',
            type: 'multiselect',
            required: false,
            options: ['กล่อง', 'สายชาร์จ', 'แบตเตอรี่สำรอง', 'เมมโมรี่การ์ด', 'กระเป๋า', 'สายสะพาย', 'ฟิลเตอร์'],
            aiImportance: 'medium'
        }
    ],
    priceFactors: [
        {
            key: 'brand_model',
            label: 'ยี่ห้อและรุ่น',
            weight: 0.30,
            type: 'brand',
            description: 'Full Frame และรุ่นท็อปราคาสูง'
        },
        {
            key: 'shutter_count',
            label: 'Shutter Count',
            weight: 0.25,
            type: 'condition',
            description: 'ยิงน้อยราคาดีกว่า'
        },
        {
            key: 'age_depreciation',
            label: 'อายุการใช้งาน',
            weight: 0.20,
            type: 'depreciation',
            description: 'ลดราคา 15% ต่อปี'
        },
        {
            key: 'physical_condition',
            label: 'สภาพเครื่อง',
            weight: 0.15,
            type: 'condition',
            description: 'เซ็นเซอร์สะอาด ไม่มีฝุ่น'
        },
        {
            key: 'market_demand',
            label: 'ความต้องการตลาด',
            weight: 0.10,
            type: 'market',
            description: 'กล้อง Mirrorless ความต้องการสูง'
        }
    ],
    aiDescriptionTemplate: {
        structure: ['intro', 'specs', 'image_quality', 'condition', 'accessories', 'usage'],
        toneOfVoice: 'มืออาชีพ เน้นเทคนิค เหมาะกับช่างภาพ',
        keyPoints: [
            'ระบุสเปคและความสามารถ',
            'เน้นคุณภาพภาพและเซ็นเซอร์',
            'บอก Shutter Count อย่างชัดเจน',
            'ระบุสภาพเครื่องและเลนส์',
            'แนะนำการใช้งานที่เหมาะสม'
        ],
        requiredSections: ['specs', 'image_quality', 'condition'],
        examplePrompt: `เขียนรายละเอียดกล้องถ่ายรูป โดยมีข้อมูลดังนี้:
- ประเภท: {type}
- ยี่ห้อ: {brand}
- รุ่น: {model}
- เซ็นเซอร์: {sensor}
- ความละเอียด: {megapixels} MP
- Shutter Count: {shutterCount}
- สภาพ: {condition}
- เลนส์: {lens}

เขียนให้เป็นมืออาชีพ เน้นเทคนิค ความยาว 200-250 คำ`
    },
    priceRange: {
        min: 2000,
        max: 200000,
        currency: 'THB'
    },
    depreciationRate: 15,
    marketDataSources: ['camerathai.com', 'facebook camera groups']
};

// ========================================
// CATEGORY SCHEMA REGISTRY
// ========================================
export const categorySchemas: Record<string, CategorySchema> = {
    mobiles: mobilePhoneSchema,
    computers: computerSchema,
    pets: petsSchema,
    cameras: cameraSchema,
    // เพิ่มหมวดหมู่อื่นๆ ตามต้องการ
};

/**
 * ดึง Schema ของหมวดหมู่
 */
export function getCategorySchema(categoryId: string): CategorySchema | null {
    return categorySchemas[categoryId] || null;
}

/**
 * ดึง Attributes ที่จำเป็นสำหรับหมวดหมู่
 */
export function getRequiredAttributes(categoryId: string): AttributeField[] {
    const schema = getCategorySchema(categoryId);
    return schema?.attributes.filter(attr => attr.required) || [];
}

/**
 * ดึง AI Description Template
 */
export function getAIDescriptionTemplate(categoryId: string): AIDescriptionTemplate | null {
    const schema = getCategorySchema(categoryId);
    return schema?.aiDescriptionTemplate || null;
}

/**
 * ดึง Price Factors สำหรับการประเมินราคา
 */
export function getPriceFactors(categoryId: string): PriceFactors[] {
    const schema = getCategorySchema(categoryId);
    return schema?.priceFactors || [];
}

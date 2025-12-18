import { ProductAnalysisResult } from '@/types/ai-analysis'

// Mock scenarios
// Rich Mock Scenarios
const SCENARIOS: Record<string, Partial<ProductAnalysisResult>> = {
    'watch': {
        aggregate: {
            main_category: 'แฟชั่น',
            main_category_confidence: 0.98,
            sub_category: 'นาฬิกาข้อมือ',
            sub_category_confidence: 0.95,
            is_mixed_assets: false,
            detected_item_label: 'Luxury Wristwatch',
            detected_brand: 'Rolex',
            detected_model: 'Submariner Date',
            color: ['Silver', 'Black'],
            material: ['Stainless Steel 904L', 'Ceramic Bezel'],
            condition_estimate: { label: 'Like New (95%)', score: 95 },
            visible_defects: [],
            confidence_overall: 0.98,
            price_suggestion: { min: 350000, max: 420000, recommended: 385000, currency: 'THB' },
            illegal_check: { is_illegal: false, reason: null }
        },
        seo: {
            alt_texts: ['Rolex Submariner Date ceramic bezel', 'นาฬิกา Rolex มือสองสภาพสวย'],
            tags: ['Rolex', 'Submariner', 'LuxuryWatch', 'นาฬิกาแบรนด์เนม', 'InvestmentPiece'],
            seo_title: 'Rolex Submariner Date Ceramic - สภาพนางฟ้า อุปกรณ์ครบ',
            short_description: 'ขาย Rolex Submariner Date ขอบเซรามิก สภาพ 95% ไม่มีรอยหนัก กระจกใส พรายน้ำสว่าง พร้อมกล่องใบครบ'
        },
        questions_for_seller: [
            { q: 'มีกล่องและใบรับประกันครบไหม?', type: 'yes_no', priority: 1 },
            { q: 'เคยผ่านการขัดแต่ง (Polishing) มาหรือไม่?', type: 'yes_no', priority: 2 }
        ],
        moderation: { flag: false, reasons: [] }
    },
    'amulet': {
        aggregate: {
            main_category: 'พระเครื่องและของสะสม',
            main_category_confidence: 0.92,
            sub_category: 'พระเครื่อง',
            sub_category_confidence: 0.89,
            is_mixed_assets: false,
            detected_item_label: 'Thai Amulet',
            detected_model: 'พระสมเด็จ', // Maps to amulet_name
            detected_brand: null,
            color: ['White', 'Ivory'],
            material: ['เนื้อผง', 'มวลสารศักดิ์สิทธิ์'],
            condition_estimate: { label: 'Vintage (Old)', score: 85 },
            visible_defects: [{ type: 'wear', location: 'edge', confidence: 0.7 }],
            confidence_overall: 0.92,
            price_suggestion: { min: 5000, max: 25000, recommended: 12000, currency: 'THB' },
            illegal_check: { is_illegal: false, reason: null },
            // Extra attributes for amulets
            specific_attributes: {
                temple: 'วัดระฆังโฆสิตาราม',
                monk: 'สมเด็จพุฒาจารย์ (โต พรหมรังสี)',
                year: '2415',
                material_type: 'เนื้อผงพุทธคุณ'
            }
        },
        seo: {
            alt_texts: ['พระสมเด็จวัดระฆัง พิมพ์ใหญ่', 'Thai Amulet Phra Somdej Wat Rakhang'],
            tags: ['พระเครื่อง', 'สมเด็จ', 'วัดระฆัง', 'Amulet', 'ของสะสม'],
            seo_title: 'เปิดบูชา พระสมเด็จวัดระฆัง พิมพ์ใหญ่ เนื้อจัด สวยสมบูรณ์',
            short_description: 'พระสมเด็จวัดระฆัง พิมพ์ใหญ่ เนื้อผง พิมพ์ทรงชัดเจน มวลสารครบถ้วน พุทธคุณก้าวหน้า เมตตามหานิยม'
        },
        questions_for_seller: [
            { q: 'มีใบรับรองจากสมาคมฯ หรือไม่?', type: 'yes_no', priority: 1 },
            { q: 'รับประกันความแท้ตลอดชีพไหม?', type: 'yes_no', priority: 2 }
        ],
        moderation: { flag: false, reasons: [] }
    },
    'phone': {
        aggregate: {
            main_category: 'มือถือและแท็บเล็ต',
            main_category_confidence: 0.99,
            sub_category: 'โทรศัพท์มือถือ',
            sub_category_confidence: 0.98,
            is_mixed_assets: false,
            detected_item_label: 'Smartphone',
            detected_brand: 'Apple',
            detected_model: 'iPhone 15 Pro Max',
            color: ['Natural Titanium'],
            material: ['Titanium', 'Glass'],
            condition_estimate: { label: 'Good', score: 90 },
            visible_defects: [{ type: 'scratch', location: 'screen_corner', confidence: 0.5 }],
            confidence_overall: 0.99,
            price_suggestion: { min: 32000, max: 36000, recommended: 34500, currency: 'THB' },
            illegal_check: { is_illegal: false, reason: null }
        },
        seo: {
            alt_texts: ['iPhone 15 Pro Max Natural Titanium', 'มือถือมือสองสภาพดี'],
            tags: ['iPhone15ProMax', 'Apple', 'มือถือมือสอง', 'ส่งต่อไอโฟน'],
            seo_title: 'iPhone 15 Pro Max 256GB สี Natural Titanium สภาพดี',
            short_description: 'ส่งต่อ iPhone 15 Pro Max 256GB สีไทเทเนียม สุขภาพแบต 92% อุปกรณ์ครบกล่อง ไม่ติด iCloud'
        },
        questions_for_seller: [],
        moderation: { flag: false, reasons: [] }
    },
    'weapon': {
        aggregate: {
            main_category: 'เบ็ดเตล็ด',
            main_category_confidence: 0.90,
            sub_category: null,
            sub_category_confidence: 0,
            detected_item_label: 'Weapon',
            detected_brand: null,
            detected_model: null,
            color: ['Black'],
            material: ['Steel'],
            confidence_overall: 0.95,
            price_suggestion: null,
            illegal_check: { is_illegal: true, reason: 'ตรวจพบอาวุธปืนหรือสิ่งเทียมอาวุธ (Firearm detected)' }
        },
        seo: { alt_texts: [], tags: [], seo_title: '', short_description: '' },
        questions_for_seller: [],
        moderation: { flag: true, reasons: ['Weapon detected', 'Prohibited item'] }
    },
    'ambiguous': {
        aggregate: {
            main_category: 'เบ็ดเตล็ด',
            main_category_confidence: 0.45,
            sub_category: null,
            sub_category_confidence: 0.0,
            is_mixed_assets: true,
            detected_item_label: 'Unidentified Object',
            color: ['Brown'],
            material: [],
            condition_estimate: { label: 'Used', score: 0.5 },
            visible_defects: [],
            confidence_overall: 0.45,
            price_suggestion: null,
            illegal_check: { is_illegal: false, reason: null }
        },
        seo: {
            alt_texts: ['สินค้ามือสอง', 'Secondhand item'],
            tags: ['ของมือสอง', 'สินค้าทั่วไป'],
            seo_title: 'สินค้ามือสอง สภาพดี',
            short_description: 'สินค้ามือสองสภาพพร้อมใช้งาน สนใจสอบถามรายละเอียดเพิ่มเติมได้'
        },
        questions_for_seller: [
            { q: 'สินค้านี้คืออะไร?', type: 'text', priority: 1 },
            { q: 'อยู่ในหมวดหมู่ "ของสะสม" หรือ "ของตกแต่งบ้าน" หรือไม่?', type: 'yes_no', priority: 2 }
        ],
        moderation: { flag: false, reasons: [] }
    }
}

export const analyzeProductImage = async (files: File[]): Promise<ProductAnalysisResult> => {
    // Simulate API Delay
    await new Promise(resolve => setTimeout(resolve, 2500))

    // Heuristics for Demo
    let scenarioKey = 'watch' // Default

    const fileNames = files.map(f => f.name.toLowerCase()).join(' ')
    if (fileNames.includes('amulet') || fileNames.includes('pra') || fileNames.includes('buddha')) scenarioKey = 'amulet'
    if (fileNames.includes('phone') || fileNames.includes('iphone') || fileNames.includes('mobile')) scenarioKey = 'phone'
    if (fileNames.includes('gun') || fileNames.includes('weapon')) scenarioKey = 'weapon'

    const scenario = SCENARIOS[scenarioKey] || SCENARIOS['watch']

    // Construct Result
    return {
        analysis_id: crypto.randomUUID(),
        images: files.map(f => ({
            id: Math.random().toString(36).substr(2, 9),
            url: URL.createObjectURL(f),
            objects_detected: [{ label: scenario.aggregate?.detected_item_label || 'item', confidence: 0.9 }],
            ocr_text: [],
            // Randomize image quality for realism
            image_quality_score: Math.floor(Math.random() * (95 - 70 + 1) + 70),
            suggested_edit: []
        })),
        aggregate: {
            ...scenario.aggregate,
            // Merge specific mock attributes if phone (for demo flexibility)
            ...(scenarioKey === 'phone' ? { detected_storage: '256GB', detected_battery_health: 92 } : {})
        } as any,
        seo: scenario.seo as any,
        questions_for_seller: scenario.questions_for_seller || [],
        moderation: scenario.moderation || { flag: false, reasons: [] },
        timestamp: new Date().toISOString()
    }
}

export interface SmartSellerStats {
    trust_score: number
    badges: string[]
    insights: {
        views_7d: number
        sales_7d: number
        conversion_rate: number
        best_posting_time: string
    }
    coaching: {
        tip: string
        type: 'marketing' | 'pricing' | 'photo'
        impact: 'high' | 'medium' | 'low'
    }[]
    seo_suggestions: {
        keyword: string
        volume: string
        competition: 'low' | 'medium' | 'high'
    }[]
}

export const getSmartSellerStats = async (sellerId: string): Promise<SmartSellerStats> => {
    // Mock Data for AI Smart Profile 2.0
    await new Promise(resolve => setTimeout(resolve, 1000))
    return {
        trust_score: 92,
        badges: ['Elite Seller', 'Fast Responder', 'Verified Pro'],
        insights: {
            views_7d: 1250,
            sales_7d: 45000,
            conversion_rate: 3.2,
            best_posting_time: '18:00 - 20:00'
        },
        coaching: [
            { tip: 'เพิ่มรูปภาพมุมด้านข้างสำหรับ "Rolex Submariner" เพื่อเพิ่มความมั่นใจ', type: 'photo', impact: 'high' },
            { tip: 'ช่วงเวลา 19:00 มีคนดูหมวดนาฬิกาเยอะที่สุด ควรโพสต์เวลานั้น', type: 'marketing', impact: 'medium' },
            { tip: 'สินค้า "iPhone 15" ของคุณราคาสูงกว่าตลาด 5% ลองปรับลดเหลือ 31,500', type: 'pricing', impact: 'high' }
        ],
        seo_suggestions: [
            { keyword: 'นาฬิกมือสอง ของแท้', volume: 'High', competition: 'high' },
            { keyword: 'Rolex Submariner ราคา', volume: 'Medium', competition: 'medium' },
            { keyword: 'iPhone 15 มือสอง สภาพดี', volume: 'High', competition: 'high' }
        ]
    }
}


import { ProductAnalysisResult } from '@/types/ai-analysis'

export interface DescriptionRequest {
    title: string
    mainCategory: string
    subCategory?: string
    aiData?: ProductAnalysisResult['aggregate']
    condition?: string
    sellerNotes?: string
}

export interface GeneratedDescription {
    generated_description: string
    bullet_points: string[]
    selling_points: string[]
    condition_summary: string
    included_items: string[]
    seo_keywords: string[]
    auto_tags: string[]
}

// Template Generators
const generateFashionDesc = (req: DescriptionRequest): GeneratedDescription => {
    const brand = req.aiData?.detected_brand || 'Unbranded'
    const model = req.aiData?.detected_model || ''
    const material = req.aiData?.material?.join(', ') || 'วัสดุคุณภาพดี'
    const color = req.aiData?.color?.join(', ') || 'สีสวย'

    return {
        generated_description: `ส่งต่อ ${req.title} แบรนด์ ${brand} ${model} ดีไซน์สวยทันสมัย ตัวเรือน/วัสดุทำจาก ${material} โดดเด่นด้วยโทนสี ${color} เหมาะสำหรับใส่ในทุกโอกาส ไม่ว่าจะใส่ทำงานหรือใส่เที่ยวก็ดูดีมีสไตล์`,
        bullet_points: [
            `แบรนด์: ${brand}`,
            `รุ่น: ${model}`,
            `วัสดุ: ${material}`,
            `สี: ${color}`,
            `สไตล์: แฟชั่น/ทางการ`
        ],
        selling_points: [
            'ดีไซน์หรูหรา ทันสมัย',
            'แมทช์ชุดง่าย ได้หลายลุค',
            'สภาพสวย คุ้มค่าราคา'
        ],
        condition_summary: `สภาพโดยรวม: ${req.condition || 'ดีเยี่ยม'} (AI Score: ${(req.aiData?.condition_estimate?.score || 0.8) * 100}%)`,
        included_items: ['ตัวสินค้า', 'กล่อง/บรรจุภัณฑ์ (ถ้ามี)'],
        seo_keywords: [brand, model, 'เสื้อผ้ามือสอง', 'แฟชั่น', 'ราคาถูก'],
        auto_tags: [brand, 'Fashion', 'SecondHand']
    }
}

const generateMobileDesc = (req: DescriptionRequest): GeneratedDescription => {
    const brand = req.aiData?.detected_brand || 'สมาร์ทโฟน'
    const model = req.aiData?.detected_model || ''

    return {
        generated_description: `ขาย ${req.title} ${brand} ${model} เครื่องศูนย์ไทย สภาพสวย ใช้งานได้ปกติ 100% ลื่นไหลไม่มีสะดุด แบตเตอรี่อึด หน้าจอสวยไร้รอยแตก (รบกวนเช็คภาพประกอบ) ใครหาอยู่จัดด่วนครับ ราคานี้คุ้มมาก`,
        bullet_points: [
            `แบรนด์: ${brand}`,
            `รุ่น: ${model}`,
            `หน้าจอ: คมชัด ทัชลื่น`,
            `การใช้งาน: ปกติทุกฟังก์ชัน`
        ],
        selling_points: [
            'เครืองศูนย์ไทย',
            'ใช้งานน้อย ดูแลอย่างดี',
            'อุปกรณ์ครบ (โปรดสอบถาม)'
        ],
        condition_summary: `สภาพเครื่อง: ${req.condition || 'นางฟ้า'} ไร้รอยตกหล่น`,
        included_items: ['ตัวเครื่อง', 'ชุดชาร์จ'],
        seo_keywords: [brand, model, 'มือถือมือสอง', 'สมาร์ทโฟน', 'ราคาถูก'],
        auto_tags: [brand, 'Mobile', 'Phone']
    }
}

const generateAmuletDesc = (req: DescriptionRequest): GeneratedDescription => {
    const name = req.aiData?.detected_model || 'พระเครื่อง'
    const material = req.aiData?.material?.join(' ') || 'เนื้อผง/โลหะ'

    return {
        generated_description: `เปิดบูชา ${req.title} (${name}) เนื้อ${material} เก่าเก็บสภาพสวย พุทธคุณเด่นด้านเมตตามหานิยม แคล้วคลาดปลอดภัย เหมาะสำหรับผู้ที่ศรัทธาและนักสะสม`,
        bullet_points: [
            `พิมพ์: ${name}`,
            `เนื้อ: ${material}`,
            `สภาพ: สวยสมบูรณ์`
        ],
        selling_points: [
            'พระแท้ ดูง่าย',
            'พุทธคุณดีเยี่ยม',
            'น่าสะสมบูชา'
        ],
        condition_summary: `สภาพผิว: ${req.condition || 'เดิมๆ'} ไม่ผ่านการล้าง`,
        included_items: ['องค์พระ', 'กล่องเดิม (ถ้ามี)'],
        seo_keywords: ['พระเครื่อง', name, 'วัตถุมงคล', 'พระสมเด็จ', 'ของสะสม'],
        auto_tags: ['Amulet', 'ThaiAmulet', 'พระเครื่อง']
    }
}

const generateGenericDesc = (req: DescriptionRequest): GeneratedDescription => {
    return {
        generated_description: `ขาย ${req.title} สภาพดี พร้อมใช้งาน สินค้าคุณภาพคุ้มราคา รายละเอียดตามภาพประกอบ สนใจสอบถามเพิ่มเติมได้เลยครับ`,
        bullet_points: [
            `ประเภท: ${req.mainCategory}`,
            `ชื่อสินค้า: ${req.title}`,
            `สภาพ: ${req.condition || 'พร้อมใช้งาน'}`
        ],
        selling_points: [
            'ราคาคุ้มค่า',
            'สภาพดี พร้อมใช้',
            'ส่งไว แพ็คดี'
        ],
        condition_summary: `สภาพสินค้า: ${req.condition || 'ดี'}`,
        included_items: ['ตัวสินค้า'],
        seo_keywords: [req.title, 'มือสอง', 'ราคาถูก', 'สภาพดี'],
        auto_tags: ['SecondHand', 'Used']
    }
}

export const generateProductDescription = async (req: DescriptionRequest): Promise<GeneratedDescription> => {
    // Simulate thinking time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

    // Route by category
    const cat = req.mainCategory.toLowerCase()
    const sub = req.subCategory?.toLowerCase() || ''

    if (cat.includes('แฟชั่น') || cat.includes('นาฬิกา') || sub.includes('watch')) {
        return generateFashionDesc(req)
    }
    if (cat.includes('มือถือ') || cat.includes('mobile') || sub.includes('phone')) {
        return generateMobileDesc(req)
    }
    if (cat.includes('พระ') || cat.includes('amulet')) {
        return generateAmuletDesc(req)
    }

    return generateGenericDesc(req)
}

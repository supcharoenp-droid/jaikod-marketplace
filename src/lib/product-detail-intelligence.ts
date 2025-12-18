/**
 * Product Detail Intelligence AI
 * 
 * Hybrid approach: Form + AI Assisted (Human-in-the-loop)
 * 
 * Core Principles:
 * 1. Form data is source of truth
 * 2. AI assists, never overrides
 * 3. Never blocks posting
 * 4. Soft guidance only
 */

import { CATEGORIES } from '@/constants/categories'

// ========================================
// TYPE DEFINITIONS
// ========================================

export interface ProductDetailInput {
    images?: File[]
    title: string
    mainCategory: string
    subcategory?: string
    formFields: Record<string, any>
    sellerType: 'individual' | 'shop'
    description?: string
}

export interface DetectedConflict {
    field: string
    expected_value: string
    actual_value: string
    reason: string
    severity: 'low' | 'medium' | 'high'
}

export interface SuggestedField {
    field_name: string
    field_label_th: string
    field_label_en: string
    why_it_matters: string
    sample_value?: string
    buyer_cares_because: string
}

export interface BuyerQuestion {
    question_th: string
    question_en: string
    related_field: string
}

export interface ProductDetailAnalysis {
    detected_product_type: string
    confidence_level: number
    consistency_score: number
    detected_conflicts: DetectedConflict[]
    soft_category_suggestion: string
    missing_required_fields: string[]
    missing_trust_fields: string[]
    suggested_additional_fields: SuggestedField[]
    buyer_question_simulation: BuyerQuestion[]
    suggested_title: string
    suggested_description: string
    sell_readiness_level: 'Excellent' | 'Good' | 'Needs Improvement' | 'Risky'
    sell_readiness_score: number
    final_soft_tips: {
        th: string[]
        en: string[]
    }
}

// ========================================
// PRODUCT TYPE DETECTION
// ========================================

function detectProductType(input: ProductDetailInput): {
    type: string
    confidence: number
} {
    const { title, mainCategory, subcategory, formFields } = input

    // Use category as base
    const category = CATEGORIES.find(c => c.id === parseInt(mainCategory))
    let productType = category?.name_th || 'ไม่ระบุ'
    let confidence = 70

    // Increase confidence if subcategory specified
    if (subcategory) {
        const sub = category?.subcategories?.find(s => s.id === parseInt(subcategory))
        if (sub) {
            productType = sub.name_th
            confidence = 85
        }
    }

    // Analyze title keywords for extra confidence
    const titleLower = title.toLowerCase()
    const keywordMatches = [
        { keywords: ['iphone', 'samsung', 'มือถือ'], type: 'โทรศัพท์มือถือ', boost: 10 },
        { keywords: ['จอ', 'monitor', 'มอนิเตอร์'], type: 'จอคอมพิวเตอร์', boost: 10 },
        { keywords: ['printer', 'เครื่องพิมพ์'], type: 'เครื่องพิมพ์', boost: 10 },
        { keywords: ['laptop', 'โน้ตบุ๊ค'], type: 'โน้ตบุ๊ค', boost: 10 },
        { keywords: ['บ้าน', 'house'], type: 'บ้านเดี่ยว', boost: 10 },
        { keywords: ['รถ', 'car'], type: 'รถยนต์', boost: 10 }
    ]

    for (const match of keywordMatches) {
        if (match.keywords.some(kw => titleLower.includes(kw))) {
            confidence = Math.min(confidence + match.boost, 95)
            break
        }
    }

    return { type: productType, confidence }
}

// ========================================
// CONSISTENCY CHECK
// ========================================

function checkConsistency(input: ProductDetailInput): {
    score: number
    conflicts: DetectedConflict[]
    suggestion: string
} {
    const conflicts: DetectedConflict[] = []
    let score = 100
    let suggestion = ''

    const { title, mainCategory, subcategory, formFields } = input
    const titleLower = title.toLowerCase()

    // Check category conflicts
    const categoryId = parseInt(mainCategory)

    // Example: If title says "monitor" but category is "printer"
    if (categoryId === 4) { // Computers
        if (titleLower.includes('monitor') || titleLower.includes('จอ')) {
            if (subcategory !== '403') { // Not monitor subcategory
                conflicts.push({
                    field: 'subcategory',
                    expected_value: 'จอคอมพิวเตอร์',
                    actual_value: subcategory || 'ไม่ระบุ',
                    reason: 'ชื่อสินค้าบ่งบอกว่าเป็นจอคอมพิวเตอร์',
                    severity: 'medium'
                })
                score -= 15
                suggestion = 'สินค้านี้ดูเหมือนจะเป็น "จอคอมพิวเตอร์" มากกว่า ตามขนาดและความละเอียดที่ระบุ'
            }
        } else if (titleLower.includes('printer') || titleLower.includes('เครื่องพิมพ์')) {
            if (subcategory !== '405') { // Not printer subcategory
                conflicts.push({
                    field: 'subcategory',
                    expected_value: 'เครื่องพิมพ์',
                    actual_value: subcategory || 'ไม่ระบุ',
                    reason: 'ชื่อสินค้าบ่งบอกว่าเป็นเครื่องพิมพ์',
                    severity: 'medium'
                })
                score -= 15
                suggestion = 'สินค้านี้ดูเหมือนจะเป็น "เครื่องพิมพ์" มากกว่า'
            }
        }
    }

    // Check form field consistency
    // Example: If price is 0 or missing
    if (!formFields.price || formFields.price <= 0) {
        conflicts.push({
            field: 'price',
            expected_value: '> 0',
            actual_value: String(formFields.price || 0),
            reason: 'ผู้ซื้อต้องการทราบราคา',
            severity: 'high'
        })
        score -= 20
    }

    return { score, conflicts, suggestion }
}

// ========================================
// REQUIRED FIELDS VALIDATION
// ========================================

function validateRequiredFields(input: ProductDetailInput): {
    missingRequired: string[]
    missingTrust: string[]
} {
    const { mainCategory, formFields } = input
    const categoryId = parseInt(mainCategory)

    const missingRequired: string[] = []
    const missingTrust: string[] = []

    // Common required fields
    if (!formFields.price || formFields.price <= 0) {
        missingRequired.push('ราคา')
    }

    if (!formFields.condition) {
        missingRequired.push('สภาพสินค้า')
    }

    // Category-specific
    if (categoryId === 3 || categoryId === 4) { // Mobiles, Computers
        if (!formFields.brand) {
            missingTrust.push('ยี่ห้อ')
        }
        if (!formFields.model) {
            missingTrust.push('รุ่น')
        }
    }

    if (categoryId === 1) { // Automotive
        if (!formFields.year) {
            missingRequired.push('ปีจดทะเบียน')
        }
        if (!formFields.mileage) {
            missingTrust.push('เลขไมล์')
        }
    }

    if (categoryId === 2) { // Real Estate
        if (!formFields.area) {
            missingRequired.push('ขนาดพื้นที่')
        }
        if (!formFields.location) {
            missingRequired.push('ที่ตั้ง')
        }
    }

    return { missingRequired, missingTrust }
}

// ========================================
// SMART SUGGESTIONS
// ========================================

function generateSmartSuggestions(input: ProductDetailInput): {
    fields: SuggestedField[]
    questions: BuyerQuestion[]
} {
    const { mainCategory } = input
    const categoryId = parseInt(mainCategory)

    const fields: SuggestedField[] = []
    const questions: BuyerQuestion[] = []

    // Category-specific suggestions
    if (categoryId === 3) { // Mobiles
        fields.push({
            field_name: 'battery_health',
            field_label_th: 'สุขภาพแบตเตอรี่',
            field_label_en: 'Battery Health',
            why_it_matters: 'ผู้ซื้อต้องการทราบอายุการใช้งานที่เหลือ',
            sample_value: '85%',
            buyer_cares_because: 'แบตเตอรี่เป็นค่าใช้จ่ายสูงหากต้องเปลี่ยน'
        })

        fields.push({
            field_name: 'accessories',
            field_label_th: 'อุปกรณ์ประกอบ',
            field_label_en: 'Accessories Included',
            why_it_matters: 'เพิ่มมูลค่าและความน่าสนใจของสินค้า',
            sample_value: 'กล่อง, สายชาร์จ, หูฟัง',
            buyer_cares_because: 'อุปกรณ์ครบชุดมีมูลค่าเพิ่ม'
        })

        questions.push({
            question_th: 'แบตเตอรี่เหลือกี่เปอร์เซ็นต์?',
            question_en: 'What is the battery health percentage?',
            related_field: 'battery_health'
        })

        questions.push({
            question_th: 'มีกล่องและอุปกรณ์ครบไหม?',
            question_en: 'Does it come with box and accessories?',
            related_field: 'accessories'
        })
    }

    if (categoryId === 4) { // Computers
        fields.push({
            field_name: 'specifications',
            field_label_th: 'สเปควิเคราะห์',
            field_label_en: 'Specifications',
            why_it_matters: 'ผู้ซื้อต้องการข้อมูลทางเทคนิค',
            sample_value: 'RAM 16GB, SSD 512GB, i7-1165G7',
            buyer_cares_because: 'สเปคตรงกับการใช้งานหรือไม่'
        })

        fields.push({
            field_name: 'warranty',
            field_label_th: 'การรับประกัน',
            field_label_en: 'Warranty',
            why_it_matters: 'สร้างความมั่นใจให้ผู้ซื้อ',
            sample_value: 'ยังเหลือประกัน 6 เดือน',
            buyer_cares_because: 'การรับประกันลดความเสี่ยง'
        })

        questions.push({
            question_th: 'สเปคอะไรบ้าง?',
            question_en: 'What are the specifications?',
            related_field: 'specifications'
        })
    }

    if (categoryId === 1) { // Automotive
        fields.push({
            field_name: 'accident_history',
            field_label_th: 'ประวัติอุบัติเหตุ',
            field_label_en: 'Accident History',
            why_it_matters: 'ผู้ซื้อต้องการทราบประวัติ',
            sample_value: 'ไม่เคยชน',
            buyer_cares_because: 'มูลค่าและความปลอดภัย'
        })

        fields.push({
            field_name: 'service_history',
            field_label_th: 'ประวัติการเข้าศูนย์',
            field_label_en: 'Service History',
            why_it_matters: 'บอกการดูแลรักษา',
            sample_value: 'เข้าศูนย์ตรงเวลา',
            buyer_cares_because: 'รถที่ดูแลดีใช้งานได้นาน'
        })

        questions.push({
            question_th: 'มีประวัติอุบัติเหตุไหม?',
            question_en: 'Any accident history?',
            related_field: 'accident_history'
        })
    }

    // Common suggestions for all categories
    if (!input.formFields.shipping_options) {
        fields.push({
            field_name: 'shipping_options',
            field_label_th: 'ตัวเลือกการจัดส่ง',
            field_label_en: 'Shipping Options',
            why_it_matters: 'ผู้ซื้อต้องการทราบค่าจัดส่ง',
            sample_value: 'Kerry 50 บาท, ส่งฟรีจ้งหวัดเดียวกัน',
            buyer_cares_because: 'ค่าส่งเป็นส่วนหนึ่งของราคาจริง'
        })
    }

    return { fields, questions }
}

// ========================================
// LANGUAGE IMPROVEMENT
// ========================================

function improveTitleAndDescription(input: ProductDetailInput): {
    suggestedTitle: string
    suggestedDescription: string
    reasoning: string
} {
    const { title, description, formFields, mainCategory } = input

    let suggestedTitle = title
    let suggestedDescription = description || ''
    let reasoning = ''

    // Improve title - add key attributes
    const missing: string[] = []

    if (formFields.brand && !title.includes(formFields.brand)) {
        missing.push(formFields.brand)
    }

    if (formFields.model && !title.includes(formFields.model)) {
        missing.push(formFields.model)
    }

    if (formFields.condition && !title.includes('มือสอง') && formFields.condition === 'used') {
        missing.push('มือสอง')
    }

    if (missing.length > 0) {
        suggestedTitle = `${missing.join(' ')} ${title}`
        reasoning = `เพิ่ม ${missing.join(', ')} เพื่อให้ผู้ซื้อค้นหาเจอง่ายขึ้น`
    }

    // Improve description
    if (!description || description.length < 50) {
        suggestedDescription = `${title}\n\n` +
            `สภาพ: ${formFields.condition || 'ระบุสภาพ'}\n` +
            `ราคา: ${formFields.price || 'ระบุราคา'} บาท\n\n` +
            `รายละเอียดเพิ่มเติม:\n` +
            `- (กรุณาระบุรายละเอียดเพิ่มเติม)\n` +
            `- (สิ่งที่ทำให้สินค้านี้พิเศษ)\n` +
            `- (อุปกรณ์ที่มาพร้อม)\n\n` +
            `ติดต่อสอบถาม: (เบอร์โทร/Line)\n`

        if (!reasoning) {
            reasoning = 'เพิ่มรายละเอียดเพื่อสร้างความน่าเชื่อถือ'
        }
    }

    return { suggestedTitle, suggestedDescription, reasoning }
}

// ========================================
// SELL READINESS EVALUATION
// ========================================

function evaluateSellReadiness(analysis: Partial<ProductDetailAnalysis>): {
    level: 'Excellent' | 'Good' | 'Needs Improvement' | 'Risky'
    score: number
    tips: { th: string[], en: string[] }
} {
    const tips: { th: string[], en: string[] } = { th: [], en: [] }
    let score = 100

    // Deduct for conflicts
    if (analysis.detected_conflicts && analysis.detected_conflicts.length > 0) {
        score -= analysis.detected_conflicts.length * 10
        tips.th.push('ตรวจสอบความสอดคล้องของหมวดหมู่และรายละเอียด')
        tips.en.push('Check category and detail consistency')
    }

    // Deduct for missing required fields
    if (analysis.missing_required_fields && analysis.missing_required_fields.length > 0) {
        score -= analysis.missing_required_fields.length * 15
        tips.th.push(`กรอก: ${analysis.missing_required_fields.join(', ')}`)
        tips.en.push(`Fill: ${analysis.missing_required_fields.join(', ')}`)
    }

    // Deduct for missing trust fields
    if (analysis.missing_trust_fields && analysis.missing_trust_fields.length > 0) {
        score -= analysis.missing_trust_fields.length * 5
        tips.th.push(`พิจารณาเพิ่ม: ${analysis.missing_trust_fields.join(', ')}`)
        tips.en.push(`Consider adding: ${analysis.missing_trust_fields.join(', ')}`)
    }

    // Bonus for good consistency
    if (analysis.consistency_score && analysis.consistency_score >= 90) {
        tips.th.push('✨ รายละเอียดสอดคล้องกันดีมาก!')
        tips.en.push('✨ Excellent consistency!')
    }

    // Determine level
    let level: 'Excellent' | 'Good' | 'Needs Improvement' | 'Risky'

    if (score >= 90) {
        level = 'Excellent'
        tips.th.push('🎉 พร้อมลงขายเลย!')
        tips.en.push('🎉 Ready to sell!')
    } else if (score >= 75) {
        level = 'Good'
        tips.th.push('👍 ดีแล้ว แต่อาจเพิ่มรายละเอียดอีกนิด')
        tips.en.push('👍 Good, but could add more details')
    } else if (score >= 60) {
        level = 'Needs Improvement'
        tips.th.push('⚠️ ควรเพิ่มรายละเอียดเพื่อเพิ่มโอกาสขาย')
        tips.en.push('⚠️ Should add more details to increase sale chance')
    } else {
        level = 'Risky'
        tips.th.push('🚨 ขาดรายละเอียดสำคัญ อาจไม่น่าเชื่อถือ')
        tips.en.push('🚨 Missing critical details, may appear untrustworthy')
    }

    return { level, score, tips }
}

// ========================================
// MAIN ANALYSIS FUNCTION
// ========================================

export async function analyzeProductDetails(
    input: ProductDetailInput
): Promise<ProductDetailAnalysis> {

    // STEP 1: Context Understanding
    const { type: detectedType, confidence } = detectProductType(input)

    // STEP 2: Consistency Check
    const { score: consistencyScore, conflicts, suggestion } = checkConsistency(input)

    // STEP 3: Required Fields Validation
    const { missingRequired, missingTrust } = validateRequiredFields(input)

    // STEP 4: Smart Suggestions
    const { fields: suggestedFields, questions } = generateSmartSuggestions(input)

    // STEP 5: Language Improvement
    const { suggestedTitle, suggestedDescription, reasoning } = improveTitleAndDescription(input)

    // STEP 6: Final Readiness
    const partialAnalysis: Partial<ProductDetailAnalysis> = {
        detected_conflicts: conflicts,
        missing_required_fields: missingRequired,
        missing_trust_fields: missingTrust,
        consistency_score: consistencyScore
    }

    const { level, score, tips } = evaluateSellReadiness(partialAnalysis)

    // Compile final analysis
    const analysis: ProductDetailAnalysis = {
        detected_product_type: detectedType,
        confidence_level: confidence,
        consistency_score: consistencyScore,
        detected_conflicts: conflicts,
        soft_category_suggestion: suggestion,
        missing_required_fields: missingRequired,
        missing_trust_fields: missingTrust,
        suggested_additional_fields: suggestedFields,
        buyer_question_simulation: questions,
        suggested_title: suggestedTitle,
        suggested_description: suggestedDescription,
        sell_readiness_level: level,
        sell_readiness_score: score,
        final_soft_tips: tips
    }

    return analysis
}

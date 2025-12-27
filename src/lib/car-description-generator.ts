'use client'

/**
 * CAR DESCRIPTION MARKETING GENERATOR
 * 
 * สร้างคำบรรยายขายรถแบบ Marketing Copy
 * ไม่ซ้ำกับ form fields - เน้น selling points และ trust signals
 * 
 * Features:
 * - Marketing-style headlines
 * - Compelling selling copy
 * - Trust signals & social proof
 * - Call-to-action
 * - SEO-optimized keywords
 */

// ============================================
// TYPES
// ============================================
export interface CarFormData {
    brand?: string
    model?: string
    sub_model?: string
    year?: string
    color?: string
    body_type?: string
    transmission?: string
    fuel_type?: string
    engine_cc?: string
    mileage?: string
    price?: string
    condition?: string
    accident_history?: string
    flood_history?: string
    tire_condition?: string
    book_status?: string
    tax_status?: string
    service_history?: string
    modification_status?: string
    included_items?: string[]
    features?: string[]
    selling_reason?: string
    finance_available?: string
    trade_in?: string
    reg_province?: string
    meeting_province?: string
    meeting_amphoe?: string
    [key: string]: string | string[] | undefined
}

export interface MarketingDescription {
    headline: string           // ข้อความหลักดึงดูดความสนใจ
    subheadline: string        // ข้อความรอง
    sellingPoints: string[]    // จุดเด่น 3-5 ข้อ
    trustSignals: string[]     // ความน่าเชื่อถือ
    bodyCopy: string          // คำบรรยายหลัก (paragraph)
    callToAction: string       // CTA
    fullText: string          // รวมทั้งหมด
    seoKeywords: string[]     // คำค้นหา
}

// ============================================
// HELPER: DETECT SELLING POINTS
// ============================================
function detectSellingPoints(data: CarFormData): string[] {
    const points: string[] = []

    // 1. Low mileage
    if (data.mileage) {
        const m = parseInt(data.mileage.replace(/,/g, ''))
        if (m < 30000) points.push('🏆 ไมล์น้อยมาก (ใช้งานน้อย)')
        else if (m < 60000) points.push('✅ ไมล์น้อย')
        else if (m < 100000) points.push('📏 ไมล์ปกติ')
    }

    // 2. No accident
    if (data.accident_history === 'none') {
        points.push('🛡️ ไม่เคยชน ประวัติดี')
    }

    // 3. No flood
    if (data.flood_history === 'none') {
        points.push('💧 ไม่เคยจมน้ำ')
    }

    // 4. Good condition
    if (data.condition === 'like_new' || data.condition === 'excellent') {
        points.push('✨ สภาพสวยมาก เหมือนใหม่')
    } else if (data.condition === 'good') {
        points.push('👍 สภาพดี พร้อมใช้')
    }

    // 5. New tires
    if (data.tire_condition === 'new') {
        points.push('🛞 ยางใหม่')
    }

    // 6. Full service history
    if (data.service_history === 'dealer') {
        points.push('🔧 ประวัติศูนย์ครบ')
    } else if (data.service_history === 'documented') {
        points.push('📗 มีประวัติซ่อมครบ')
    }

    // 7. Complete documents
    if (data.book_status === 'complete' && data.tax_status === 'paid') {
        points.push('📄 เอกสารครบ พร้อมโอน')
    }

    // 8. Finance available
    if (data.finance_available === 'finance' || data.finance_available === 'both') {
        points.push('💳 รับจัดไฟแนนซ์')
    }

    // 9. Trade-in
    if (data.trade_in === 'yes') {
        points.push('🔄 รับแลกเปลี่ยน')
    }

    // 10. Special features
    if (data.features && data.features.length > 0) {
        const topFeatures = data.features.slice(0, 2)
        if (topFeatures.includes('sunroof')) points.push('☀️ มีซันรูฟ')
        if (topFeatures.includes('leather')) points.push('🛋️ เบาะหนังแท้')
        if (topFeatures.includes('camera360')) points.push('📷 กล้อง 360°')
    }

    return points.slice(0, 5) // Max 5 points
}

// ============================================
// HELPER: GENERATE TRUST SIGNALS
// ============================================
function generateTrustSignals(data: CarFormData): string[] {
    const signals: string[] = []

    // Selling reason builds trust
    if (data.selling_reason === 'upgrade') {
        signals.push('🚗 ขายเพราะซื้อคันใหม่')
    } else if (data.selling_reason === 'rarely_used') {
        signals.push('🕐 ใช้น้อย ไม่ค่อยได้ใช้')
    } else if (data.selling_reason === 'moving') {
        signals.push('✈️ ย้ายต่างประเทศ')
    }

    // Province implies owner type
    if (data.reg_province) {
        signals.push(`📍 รถ${data.reg_province}`)
    }

    // Year implies modernity
    if (data.year) {
        const year = parseInt(data.year)
        const currentYear = new Date().getFullYear() + 543 // Thai year
        if (currentYear - year <= 3) {
            signals.push('🆕 รถรุ่นใหม่')
        } else if (currentYear - year <= 5) {
            signals.push('📅 รถไม่เก่า')
        }
    }

    return signals.slice(0, 3)
}

// ============================================
// HELPER: GENERATE HEADLINE
// ============================================
function generateHeadline(data: CarFormData, points: string[]): string {
    const carName = [data.brand, data.model, data.sub_model].filter(Boolean).join(' ')
    const year = data.year ? `ปี${data.year}` : ''

    // Build headline based on strongest selling points
    const hasLowMiles = points.some(p => p.includes('ไมล์น้อย'))
    const hasNoAccident = points.some(p => p.includes('ไม่เคยชน'))
    const hasGoodCondition = points.some(p => p.includes('สภาพ'))

    if (hasLowMiles && hasNoAccident) {
        return `${carName} ${year} ไมล์น้อย ไม่ชน ไม่จม พร้อมโอน!`
    } else if (hasGoodCondition && hasNoAccident) {
        return `${carName} ${year} สภาพสวย ไม่เคยชน เจ้าของขายเอง!`
    } else if (hasLowMiles) {
        return `${carName} ${year} ไมล์น้อยมาก ใช้งานน้อย!`
    } else if (hasNoAccident) {
        return `${carName} ${year} ไม่ชน ไม่จม ประวัติดี!`
    }

    return `${carName} ${year} พร้อมใช้งาน ราคาคุ้มค่า!`
}

// ============================================
// HELPER: GENERATE BODY COPY
// ============================================
function generateBodyCopy(data: CarFormData): string {
    const carName = [data.brand, data.model].filter(Boolean).join(' ')
    const year = data.year ? `ปี ${data.year}` : ''

    let copy = ''

    // Opening
    if (data.selling_reason === 'upgrade') {
        copy += `ขาย ${carName} ${year} เนื่องจากซื้อรถใหม่ `
    } else if (data.selling_reason === 'rarely_used') {
        copy += `ขาย ${carName} ${year} ใช้น้อยมาก จอดมากกว่าใช้ `
    } else {
        copy += `ขาย ${carName} ${year} `
    }

    // Condition highlight
    if (data.condition === 'like_new' || data.condition === 'excellent') {
        copy += 'สภาพสวยมาก ไม่ผิดหวัง '
    } else if (data.condition === 'good') {
        copy += 'สภาพดี พร้อมใช้งานทันที '
    }

    // Accident/Flood status
    if (data.accident_history === 'none' && data.flood_history === 'none') {
        copy += 'การันตีไม่เคยชน ไม่เคยจม ประวัติสะอาด '
    } else if (data.accident_history === 'none') {
        copy += 'ไม่เคยมีอุบัติเหตุ '
    }

    // Service history
    if (data.service_history === 'dealer') {
        copy += 'เข้าศูนย์ตลอด มีประวัติครบ '
    }

    // Documents
    if (data.book_status === 'complete' && data.tax_status === 'paid') {
        copy += 'เอกสารครบ พร้อมโอน '
    }

    // Price note
    if (data.finance_available === 'both') {
        copy += 'รับเงินสดหรือจัดไฟแนนซ์ได้ '
    } else if (data.finance_available === 'finance') {
        copy += 'รับจัดไฟแนนซ์ ดอกเบี้ยถูก '
    }

    return copy.trim()
}

// ============================================
// MAIN GENERATOR
// ============================================
export function generateCarDescription(data: CarFormData): MarketingDescription {
    // Detect selling points
    const sellingPoints = detectSellingPoints(data)
    const trustSignals = generateTrustSignals(data)

    // Generate components
    const headline = generateHeadline(data, sellingPoints)

    const carName = [data.brand, data.model].filter(Boolean).join(' ')
    const year = data.year ? `ปี${data.year}` : ''
    const subheadline = sellingPoints.length > 0
        ? sellingPoints.slice(0, 3).map(p => p.replace(/^[^\s]+\s/, '')).join(' | ')
        : `${carName} ${year} คุณภาพดี ราคาเหมาะสม`

    const bodyCopy = generateBodyCopy(data)

    // Generate CTA
    const cta = data.meeting_province
        ? `📍 นัดดูรถได้ที่ ${data.meeting_province}${data.meeting_amphoe ? ` (${data.meeting_amphoe})` : ''} - แชท/โทรนัดได้เลยค่ะ 📞`
        : '📞 สนใจสอบถามรายละเอียดเพิ่มเติม แชท/โทรได้เลยค่ะ'

    // Generate SEO keywords
    const seoKeywords = [
        data.brand,
        data.model,
        data.sub_model,
        year,
        data.body_type,
        'มือสอง',
        'ราคาถูก',
        data.reg_province,
    ].filter(Boolean) as string[]

    // Combine full text
    const fullText = [
        `🚗 ${headline}`,
        '',
        `✨ จุดเด่น:`,
        ...sellingPoints.map(p => `• ${p}`),
        '',
        `📝 รายละเอียด:`,
        bodyCopy,
        '',
        ...trustSignals.map(s => `👤 ${s}`),
        '',
        cta,
        '',
        `#${seoKeywords.slice(0, 5).join(' #')}`
    ].join('\n')

    return {
        headline,
        subheadline,
        sellingPoints,
        trustSignals,
        bodyCopy,
        callToAction: cta,
        fullText,
        seoKeywords
    }
}

// ============================================
// GENERATE OPTIMIZED TITLE
// ============================================
export function generateCarTitle(data: CarFormData): string {
    const parts: string[] = []

    if (data.brand) parts.push(data.brand)
    if (data.model) parts.push(data.model)
    if (data.sub_model) parts.push(data.sub_model)
    if (data.year) parts.push(`ปี${data.year}`)

    const title = parts.join(' ')

    // Add key selling point
    const extras: string[] = []
    if (data.mileage) {
        const m = parseInt(data.mileage.replace(/,/g, ''))
        if (m < 50000) extras.push('ไมล์น้อย')
    }
    if (data.accident_history === 'none' && data.flood_history === 'none') {
        extras.push('ไม่ชน ไม่จม')
    }
    if (data.condition === 'like_new' || data.condition === 'excellent') {
        extras.push('สภาพดีมาก')
    }

    if (extras.length > 0) {
        return `${title} | ${extras.slice(0, 2).join(' ')}`
    }

    return title || 'รถยนต์มือสอง'
}

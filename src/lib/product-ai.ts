// AI-powered product validation and suggestions

export interface ProductValidation {
    isValid: boolean
    warnings: ProductWarning[]
    suggestions: ProductSuggestion[]
    riskLevel: 'safe' | 'caution' | 'high'
}

export interface ProductWarning {
    field: string
    type: 'forbidden_word' | 'misleading' | 'incomplete' | 'pricing'
    severity: 'error' | 'warning' | 'info'
    message: {
        th: string
        en: string
    }
}

export interface ProductSuggestion {
    field: string
    type: 'title' | 'description' | 'price' | 'category'
    value: string | number
    reason: {
        th: string
        en: string
    }
}

// Forbidden words that should trigger warnings
const FORBIDDEN_WORDS = {
    th: [
        'ปลอม', 'เทียม', 'แท้100%', 'รับประกันแท้',
        'ของแท้แน่นอน', 'ถูกที่สุด', 'ฟรี', 'แจกฟรี',
        'รวยแน่', 'ร่ำรวย', 'ลดน้ำหนัก', 'หายขาด'
    ],
    en: [
        'fake', 'replica', '100% authentic', 'guaranteed authentic',
        'cheapest', 'free', 'get rich', 'weight loss', 'cure'
    ]
}

// Misleading patterns
const MISLEADING_PATTERNS = {
    th: [
        /แท้\s*100%/i,
        /ของแท้\s*แน่นอน/i,
        /ถูกที่สุด/i,
        /ฟรี\s*ทุก/i,
        /รับประกัน\s*แท้/i
    ],
    en: [
        /100%\s*authentic/i,
        /guaranteed\s*real/i,
        /cheapest\s*price/i,
        /free\s*everything/i
    ]
}

// AI Title Suggestions
export function generateTitleSuggestions(input: {
    category?: string
    brand?: string
    condition?: string
    keywords?: string[]
}): string[] {
    const suggestions: string[] = []

    // Pattern 1: Brand + Product Type + Condition
    if (input.brand && input.category) {
        suggestions.push(`${input.brand} ${input.category} ${input.condition || 'มือสอง'}`)
    }

    // Pattern 2: Descriptive + Category
    if (input.keywords && input.keywords.length > 0) {
        suggestions.push(`${input.keywords.join(' ')} ${input.category || 'สภาพดี'}`)
    }

    // Pattern 3: Simple
    if (input.category) {
        suggestions.push(`${input.category} ${input.condition || 'สภาพสวย'}`)
    }

    return suggestions.slice(0, 3)
}

// ============================================
// 🚗 VEHICLE TITLE ENHANCEMENT (ตามไมล์)
// ============================================

/**
 * Mileage thresholds for Thai market
 */
const MILEAGE_THRESHOLDS = {
    veryLow: 30000,    // < 30,000 km = "ไมล์น้อยมาก"
    low: 50000,        // < 50,000 km = "ไมล์น้อย"
    normal: 100000,    // < 100,000 km = ปกติ (ไม่ระบุ)
    high: 150000,      // > 150,000 km = "ไมล์สูง" (ไม่ควรระบุในชื่อ)
}

/**
 * Get mileage label in Thai based on distance
 */
export function getMileageLabel(mileage: number): string | null {
    if (mileage < MILEAGE_THRESHOLDS.veryLow) {
        return 'ไมล์น้อยมาก'
    } else if (mileage < MILEAGE_THRESHOLDS.low) {
        return 'ไมล์น้อย'
    } else if (mileage < MILEAGE_THRESHOLDS.normal) {
        return null // ปกติ ไม่ต้องระบุ
    } else {
        return null // ไมล์สูง ไม่ควรระบุในชื่อ (เป็นจุดอ่อน)
    }
}

/**
 * 🚗 อัปเดตชื่อรถตามไมล์ที่ user กรอก
 * 
 * ตัวอย่าง:
 * - ไมล์ 20,000: "Nissan Almera 1.0 Turbo ปี 2022 ไมล์น้อยมาก สีดำ สภาพดี"
 * - ไมล์ 40,000: "Nissan Almera 1.0 Turbo ปี 2022 ไมล์น้อย สีดำ สภาพดี"
 * - ไมล์ 80,000: "Nissan Almera 1.0 Turbo ปี 2022 สีดำ สภาพดี" (ไม่เพิ่มไมล์)
 * - ไมล์ 200,000: "Nissan Almera 1.0 Turbo ปี 2022 สีดำ สภาพดี" (ไม่เพิ่มไมล์)
 */
export function updateVehicleTitleWithMileage(
    currentTitle: string,
    mileage: number | undefined,
    year?: number
): { title: string; mileageAdded: boolean; mileageLabel: string | null } {

    // ถ้าไม่มีไมล์ ไม่ต้องเปลี่ยนอะไร
    if (mileage === undefined || mileage === null || isNaN(mileage)) {
        return { title: currentTitle, mileageAdded: false, mileageLabel: null }
    }

    // ลบคำที่เกี่ยวกับไมล์ออกก่อน
    const mileagePatterns = [
        /ไมล์น้อยมาก/g,
        /ไมล์น้อย/g,
        /ไมล์สูง/g,
        /ไมล์ปกติ/g,
        /ไมล์\s*\d+[\s,\.]*\d*\s*(กม\.?|km)?/gi,
    ]
    let cleanTitle = currentTitle
    mileagePatterns.forEach(pattern => {
        cleanTitle = cleanTitle.replace(pattern, '')
    })
    cleanTitle = cleanTitle.replace(/\s+/g, ' ').trim()

    // หาตำแหน่งที่จะแทรก (หลังปี ถ้ามี)
    const mileageLabel = getMileageLabel(mileage)

    if (!mileageLabel) {
        // ไมล์ปกติ/สูง - ไม่ต้องเพิ่มในชื่อ
        return { title: cleanTitle, mileageAdded: false, mileageLabel: null }
    }

    // หาตำแหน่งหลังปี เช่น "ปี 2022" 
    const yearPattern = /ปี\s*\d{4}/
    const yearMatch = cleanTitle.match(yearPattern)

    if (yearMatch) {
        // แทรกหลังปี
        const insertIndex = cleanTitle.indexOf(yearMatch[0]) + yearMatch[0].length
        const newTitle =
            cleanTitle.slice(0, insertIndex) +
            ' ' + mileageLabel +
            cleanTitle.slice(insertIndex)
        return {
            title: newTitle.replace(/\s+/g, ' ').trim(),
            mileageAdded: true,
            mileageLabel
        }
    } else {
        // ไม่มีปี - เพิ่มต่อท้าย (ก่อนสภาพ)
        const conditionPatterns = [/สภาพ\S*/g, /สภาพดีมาก/g, /สภาพดี/g, /สภาพสวย/g]
        let insertedTitle = cleanTitle
        let inserted = false

        for (const pattern of conditionPatterns) {
            const match = cleanTitle.match(pattern)
            if (match) {
                const insertIndex = cleanTitle.indexOf(match[0])
                insertedTitle =
                    cleanTitle.slice(0, insertIndex) +
                    mileageLabel + ' ' +
                    cleanTitle.slice(insertIndex)
                inserted = true
                break
            }
        }

        if (!inserted) {
            insertedTitle = cleanTitle + ' ' + mileageLabel
        }

        return {
            title: insertedTitle.replace(/\s+/g, ' ').trim(),
            mileageAdded: true,
            mileageLabel
        }
    }
}

/**
 * 🚗 เพิ่มจุดเด่นอื่นๆ ในชื่อรถ
 */
export function addVehicleHighlights(
    currentTitle: string,
    options: {
        oneOwner?: boolean      // เจ้าของเดียว
        neverAccident?: boolean // ไม่เคยชน
        neverFlooded?: boolean  // ไม่เคยจมน้ำ
        warranty?: boolean      // มีประกัน
    }
): string {
    let title = currentTitle.replace(/\s+/g, ' ').trim()

    // เพิ่มตามลำดับความสำคัญ
    const highlights: string[] = []

    if (options.oneOwner) highlights.push('เจ้าของเดียว')
    if (options.neverAccident) highlights.push('ไม่เคยชน')
    if (options.warranty) highlights.push('มีประกัน')

    // แทรกก่อน "สภาพ"
    if (highlights.length > 0) {
        const conditionPattern = /สภาพ\S*/
        const match = title.match(conditionPattern)
        if (match) {
            const insertIndex = title.indexOf(match[0])
            title =
                title.slice(0, insertIndex) +
                highlights.join(' ') + ' ' +
                title.slice(insertIndex)
        } else {
            title = title + ' ' + highlights.join(' ')
        }
    }

    return title.replace(/\s+/g, ' ').trim()
}

// ============================================
// 📱 MOBILE TITLE ENHANCEMENT
// ============================================

/**
 * 📱 อัปเดตชื่อมือถือตาม specs
 * รูปแบบ: [ยี่ห้อ] [รุ่น] [ความจุ] [สี] [ประกัน] [สภาพ]
 * 
 * ตัวอย่าง: "iPhone 15 Pro Max 256GB สีไทเทเนียม ศูนย์ไทย ประกันเหลือ สภาพดี"
 */
export function updateMobileTitleWithSpecs(
    currentTitle: string,
    specs: {
        storage?: string       // 128GB, 256GB, 512GB
        warranty?: boolean     // มีประกัน
        warrantyMonths?: number // เดือนที่เหลือ
        accessories?: boolean  // อุปกรณ์ครบ
        batteryHealth?: number // สุขภาพแบต %
    }
): { title: string; changed: boolean } {
    let title = currentTitle.replace(/\s+/g, ' ').trim()
    let changed = false
    const additions: string[] = []

    // ถ้ามีประกันเหลือ > 3 เดือน = จุดขาย
    if (specs.warranty && specs.warrantyMonths && specs.warrantyMonths >= 3) {
        if (!title.includes('ประกัน')) {
            additions.push(`ประกันเหลือ ${specs.warrantyMonths} เดือน`)
            changed = true
        }
    }

    // แบตสุขภาพดี > 90% = จุดขาย
    if (specs.batteryHealth && specs.batteryHealth >= 90) {
        if (!title.includes('แบต')) {
            additions.push(`แบต ${specs.batteryHealth}%`)
            changed = true
        }
    }

    // อุปกรณ์ครบ = จุดขาย
    if (specs.accessories && !title.includes('อุปกรณ์') && !title.includes('ครบ')) {
        additions.push('อุปกรณ์ครบ')
        changed = true
    }

    // แทรกก่อน "สภาพ"
    if (additions.length > 0) {
        const conditionPattern = /สภาพ\S*/
        const match = title.match(conditionPattern)
        if (match) {
            const insertIndex = title.indexOf(match[0])
            title = title.slice(0, insertIndex) + additions.join(' ') + ' ' + title.slice(insertIndex)
        } else {
            title = title + ' ' + additions.join(' ')
        }
    }

    return { title: title.replace(/\s+/g, ' ').trim(), changed }
}

// ============================================
// 💻 COMPUTER/LAPTOP TITLE ENHANCEMENT
// ============================================

/**
 * 💻 อัปเดตชื่อคอมพิวเตอร์/โน๊ตบุ๊ค
 * รูปแบบ: [ยี่ห้อ] [รุ่น] [CPU] [RAM] [Storage] [จอ] [สภาพ]
 * 
 * ตัวอย่าง: "MacBook Pro 14 M3 Pro 18GB 512GB จอสวย สภาพดี"
 */
export function updateComputerTitleWithSpecs(
    currentTitle: string,
    specs: {
        ram?: string           // 8GB, 16GB, 32GB
        storage?: string       // 256GB SSD, 1TB
        gpu?: string           // RTX 4060, M3
        screenSize?: string    // 14", 15.6"
        warranty?: boolean
    }
): { title: string; changed: boolean } {
    let title = currentTitle.replace(/\s+/g, ' ').trim()
    let changed = false
    const additions: string[] = []

    // RAM สูง = จุดขาย (16GB+)
    if (specs.ram) {
        const ramNum = parseInt(specs.ram.replace(/[^0-9]/g, ''))
        if (ramNum >= 16 && !title.toLowerCase().includes('gb')) {
            additions.push(`${ramNum}GB RAM`)
            changed = true
        }
    }

    // SSD = จุดขาย
    if (specs.storage && specs.storage.toLowerCase().includes('ssd')) {
        if (!title.toLowerCase().includes('ssd')) {
            additions.push('SSD')
            changed = true
        }
    }

    // GPU แยก = จุดขาย
    if (specs.gpu && !title.toLowerCase().includes(specs.gpu.toLowerCase())) {
        additions.push(specs.gpu)
        changed = true
    }

    if (additions.length > 0) {
        const conditionPattern = /สภาพ\S*/
        const match = title.match(conditionPattern)
        if (match) {
            const insertIndex = title.indexOf(match[0])
            title = title.slice(0, insertIndex) + additions.join(' ') + ' ' + title.slice(insertIndex)
        } else {
            title = title + ' ' + additions.join(' ')
        }
    }

    return { title: title.replace(/\s+/g, ' ').trim(), changed }
}

// ============================================
// 🏠 REAL ESTATE TITLE ENHANCEMENT
// ============================================

/**
 * 🏠 อัปเดตชื่ออสังหาริมทรัพย์
 * รูปแบบ: [ประเภท] [ขนาด] [ห้องนอน/น้ำ] [ทำเล] [จุดเด่น]
 * 
 * ตัวอย่าง: "คอนโด 35 ตร.ม. 1 ห้องนอน ใกล้ BTS อ่อนนุช ชั้นสูง วิวดี"
 */
export function updateRealEstateTitleWithSpecs(
    currentTitle: string,
    specs: {
        floor?: number         // ชั้น
        totalFloors?: number   // ชั้นทั้งหมด
        view?: string          // วิว (city, river, garden)
        nearBTS?: string       // ใกล้ BTS
        nearMRT?: string       // ใกล้ MRT
        furnished?: boolean    // เฟอร์ครบ
    }
): { title: string; changed: boolean } {
    let title = currentTitle.replace(/\s+/g, ' ').trim()
    let changed = false
    const additions: string[] = []

    // ชั้นสูง (>15) = จุดขาย
    if (specs.floor && specs.floor >= 15) {
        if (!title.includes('ชั้น')) {
            additions.push(`ชั้น ${specs.floor}`)
            changed = true
        }
    }

    // วิวดี = จุดขาย
    if (specs.view) {
        const viewMap: Record<string, string> = {
            'city': 'วิวเมือง',
            'river': 'วิวแม่น้ำ',
            'garden': 'วิวสวน',
            'pool': 'วิวสระ',
            'sea': 'วิวทะเล'
        }
        const viewLabel = viewMap[specs.view] || specs.view
        if (!title.includes('วิว')) {
            additions.push(viewLabel)
            changed = true
        }
    }

    // ใกล้ BTS/MRT = จุดขาย
    if (specs.nearBTS && !title.includes('BTS')) {
        additions.push(`ใกล้ BTS ${specs.nearBTS}`)
        changed = true
    }
    if (specs.nearMRT && !title.includes('MRT')) {
        additions.push(`ใกล้ MRT ${specs.nearMRT}`)
        changed = true
    }

    // เฟอร์ครบ = จุดขาย
    if (specs.furnished && !title.includes('เฟอร์')) {
        additions.push('เฟอร์ครบ')
        changed = true
    }

    if (additions.length > 0) {
        title = title + ' ' + additions.join(' ')
    }

    return { title: title.replace(/\s+/g, ' ').trim(), changed }
}

// ============================================
// 🔌 APPLIANCES TITLE ENHANCEMENT
// ============================================

/**
 * 🔌 อัปเดตชื่อเครื่องใช้ไฟฟ้า
 * รูปแบบ: [ยี่ห้อ] [รุ่น] [ขนาด/BTU] [ฟังก์ชัน] [สภาพ]
 * 
 * ตัวอย่าง: "Samsung แอร์ 12000 BTU Inverter ประหยัดไฟเบอร์ 5 สภาพดี"
 */
export function updateApplianceTitleWithSpecs(
    currentTitle: string,
    specs: {
        energyRating?: number  // เบอร์ 5
        inverter?: boolean     // Inverter
        warranty?: boolean
        warrantyMonths?: number
    }
): { title: string; changed: boolean } {
    let title = currentTitle.replace(/\s+/g, ' ').trim()
    let changed = false
    const additions: string[] = []

    // Inverter = จุดขาย
    if (specs.inverter && !title.toLowerCase().includes('inverter')) {
        additions.push('Inverter')
        changed = true
    }

    // เบอร์ 5 = จุดขาย
    if (specs.energyRating && specs.energyRating >= 5) {
        if (!title.includes('เบอร์')) {
            additions.push('เบอร์ 5 ประหยัดไฟ')
            changed = true
        }
    }

    // มีประกัน = จุดขาย
    if (specs.warranty && specs.warrantyMonths && specs.warrantyMonths >= 6) {
        if (!title.includes('ประกัน')) {
            additions.push(`ประกัน ${specs.warrantyMonths} เดือน`)
            changed = true
        }
    }

    if (additions.length > 0) {
        const conditionPattern = /สภาพ\S*/
        const match = title.match(conditionPattern)
        if (match) {
            const insertIndex = title.indexOf(match[0])
            title = title.slice(0, insertIndex) + additions.join(' ') + ' ' + title.slice(insertIndex)
        } else {
            title = title + ' ' + additions.join(' ')
        }
    }

    return { title: title.replace(/\s+/g, ' ').trim(), changed }
}

// ============================================
// 📷 CAMERA TITLE ENHANCEMENT
// ============================================

/**
 * 📷 อัปเดตชื่อกล้อง
 * รูปแบบ: [ยี่ห้อ] [รุ่น] [ชัตเตอร์] [อุปกรณ์] [สภาพ]
 * 
 * ตัวอย่าง: "Sony A7IV ชัตเตอร์ 5000 ครั้ง ศูนย์ไทย ประกันเหลือ สภาพดี"
 */
export function updateCameraTitleWithSpecs(
    currentTitle: string,
    specs: {
        shutterCount?: number  // ชัตเตอร์
        warranty?: boolean
        box?: boolean          // กล่อง
        accessories?: boolean  // อุปกรณ์ครบ
    }
): { title: string; changed: boolean } {
    let title = currentTitle.replace(/\s+/g, ' ').trim()
    let changed = false
    const additions: string[] = []

    // ชัตเตอร์น้อย < 20000 = จุดขาย
    if (specs.shutterCount && specs.shutterCount < 20000) {
        if (!title.includes('ชัตเตอร์')) {
            const shutterLabel = specs.shutterCount < 5000 ? 'ชัตเตอร์น้อยมาก' :
                specs.shutterCount < 10000 ? 'ชัตเตอร์น้อย' : ''
            if (shutterLabel) {
                additions.push(shutterLabel)
                changed = true
            }
        }
    }

    // อุปกรณ์ครบ/กล่องครบ = จุดขาย
    if (specs.accessories && specs.box && !title.includes('ครบ')) {
        additions.push('กล่องอุปกรณ์ครบ')
        changed = true
    } else if (specs.box && !title.includes('กล่อง')) {
        additions.push('มีกล่อง')
        changed = true
    }

    if (additions.length > 0) {
        const conditionPattern = /สภาพ\S*/
        const match = title.match(conditionPattern)
        if (match) {
            const insertIndex = title.indexOf(match[0])
            title = title.slice(0, insertIndex) + additions.join(' ') + ' ' + title.slice(insertIndex)
        } else {
            title = title + ' ' + additions.join(' ')
        }
    }

    return { title: title.replace(/\s+/g, ' ').trim(), changed }
}

// ============================================
// 👗 FASHION TITLE ENHANCEMENT
// ============================================

/**
 * 👗 อัปเดตชื่อแฟชั่น
 * รูปแบบ: [ยี่ห้อ] [ประเภท] [ขนาด/ไซส์] [สี] [สภาพ]
 * 
 * ตัวอย่าง: "Louis Vuitton Neverfull MM สีน้ำตาล ของแท้ สภาพดี"
 */
export function updateFashionTitleWithSpecs(
    currentTitle: string,
    specs: {
        authentic?: boolean    // ของแท้
        receipt?: boolean      // มีใบเสร็จ
        dustBag?: boolean      // มีถุงผ้า
        box?: boolean          // มีกล่อง
    }
): { title: string; changed: boolean } {
    let title = currentTitle.replace(/\s+/g, ' ').trim()
    let changed = false
    const additions: string[] = []

    // ของแท้ = จุดขายหลัก (สำหรับ luxury)
    if (specs.authentic && !title.includes('แท้')) {
        additions.push('ของแท้ 100%')
        changed = true
    }

    // มีใบเสร็จ = พิสูจน์ได้
    if (specs.receipt && !title.includes('ใบเสร็จ')) {
        additions.push('มีใบเสร็จ')
        changed = true
    }

    // อุปกรณ์ครบ
    if (specs.dustBag && specs.box && !title.includes('ครบ')) {
        additions.push('อุปกรณ์ครบ')
        changed = true
    }

    if (additions.length > 0) {
        const conditionPattern = /สภาพ\S*/
        const match = title.match(conditionPattern)
        if (match) {
            const insertIndex = title.indexOf(match[0])
            title = title.slice(0, insertIndex) + additions.join(' ') + ' ' + title.slice(insertIndex)
        } else {
            title = title + ' ' + additions.join(' ')
        }
    }

    return { title: title.replace(/\s+/g, ' ').trim(), changed }
}

// ============================================
// 🐕 PETS TITLE ENHANCEMENT
// ============================================

/**
 * 🐕 อัปเดตชื่อสัตว์เลี้ยง
 * รูปแบบ: [ชนิด] [สายพันธุ์] [เพศ] [อายุ] [จุดเด่น]
 * 
 * ตัวอย่าง: "ลูกสุนัข French Bulldog เพศผู้ 2 เดือน วัคซีนครบ พร้อมสมุด"
 */
export function updatePetTitleWithSpecs(
    currentTitle: string,
    specs: {
        vaccinated?: boolean   // วัคซีนครบ
        dewormed?: boolean     // ถ่ายพยาธิ
        microchip?: boolean    // ฝั่งชิป
        pedigree?: boolean     // มีใบเพ็ดดีกรี
        healthBook?: boolean   // สมุดสุขภาพ
    }
): { title: string; changed: boolean } {
    let title = currentTitle.replace(/\s+/g, ' ').trim()
    let changed = false
    const additions: string[] = []

    // วัคซีนครบ = จุดขายหลัก
    if (specs.vaccinated && !title.includes('วัคซีน')) {
        additions.push('วัคซีนครบ')
        changed = true
    }

    // มีใบเพ็ดดีกรี = สายพันธุ์แท้
    if (specs.pedigree && !title.includes('เพ็ดดีกรี') && !title.includes('ใบ')) {
        additions.push('มีใบเพ็ดดีกรี')
        changed = true
    }

    // มีสมุดสุขภาพ
    if (specs.healthBook && !title.includes('สมุด')) {
        additions.push('พร้อมสมุด')
        changed = true
    }

    // ฝังชิป = ติดตามได้
    if (specs.microchip && !title.includes('ชิป')) {
        additions.push('ฝังชิป')
        changed = true
    }

    if (additions.length > 0) {
        title = title + ' ' + additions.join(' ')
    }

    return { title: title.replace(/\s+/g, ' ').trim(), changed }
}

// ============================================
// 🎮 UNIVERSAL TITLE ENHANCER
// ============================================

/**
 * 🎯 อัปเดตชื่อสินค้าอัตโนมัติตามหมวดหมู่
 */
export function enhanceTitleByCategory(
    categoryId: number,
    currentTitle: string,
    specs: Record<string, any>
): { title: string; changed: boolean } {
    switch (categoryId) {
        case 1: // Automotive
            if (specs.mileage) {
                const result = updateVehicleTitleWithMileage(currentTitle, parseInt(specs.mileage))
                return { title: result.title, changed: result.mileageAdded }
            }
            break
        case 2: // Real Estate
            return updateRealEstateTitleWithSpecs(currentTitle, specs)
        case 3: // Mobile
            return updateMobileTitleWithSpecs(currentTitle, specs)
        case 4: // Computer
            return updateComputerTitleWithSpecs(currentTitle, specs)
        case 5: // Appliances
            return updateApplianceTitleWithSpecs(currentTitle, specs)
        case 6: // Fashion
            return updateFashionTitleWithSpecs(currentTitle, specs)
        case 8: // Camera
            return updateCameraTitleWithSpecs(currentTitle, specs)
        case 10: // Pets
            return updatePetTitleWithSpecs(currentTitle, specs)
    }

    return { title: currentTitle, changed: false }
}

// AI Description Generator
export function generateDescriptionSuggestions(input: {
    title: string
    category?: string
    condition?: string
    brand?: string
    features?: string[]
}): { short: string; standard: string; detailed: string } {
    const condition = input.condition || 'มือสอง'
    const brand = input.brand || ''

    // Short (1-2 sentences)
    const short = `${input.title} ${condition} ${brand ? `ยี่ห้อ ${brand}` : ''} สภาพดี พร้อมใช้งาน`

    // Standard (3-4 sentences)
    const standard = `✨ ${input.title}\n\n` +
        `📌 รายละเอียด:\n` +
        `- สภาพ: ${condition}\n` +
        `${brand ? `- ยี่ห้อ: ${brand}\n` : ''}` +
        `- ใช้งานได้ปกติ ไม่มีปัญหา\n\n` +
        `🎯 พร้อมส่ง ตรวจสอบก่อนส่งทุกครั้ง`

    // Detailed (full description)
    const detailed = `✨ ${input.title} ✨\n\n` +
        `📌 รายละเอียดสินค้า:\n` +
        `- สภาพ: ${condition}\n` +
        `${brand ? `- ยี่ห้อ: ${brand}\n` : ''}` +
        `${input.features ? input.features.map(f => `- ${f}\n`).join('') : ''}` +
        `- ใช้งานได้ปกติ 100%\n` +
        `- ตรวจสอบทุกฟังก์ชันก่อนส่ง\n\n` +
        `🎯 สภาพการใช้งาน:\n` +
        `- ไม่มีตำหนิร้ายแรง\n` +
        `- ทำความสะอาดเรียบร้อย\n` +
        `- พร้อมส่งทันที\n\n` +
        `📦 การจัดส่ง:\n` +
        `- แพ็คดีทุกชิ้น\n` +
        `- ส่งไวภายใน 1-2 วัน\n` +
        `- ติดต่อสอบถามได้ตลอด`

    return { short, standard, detailed }
}

// AI Price Suggestions
export function generatePriceSuggestions(input: {
    category?: string
    condition?: string
    brand?: string
    originalPrice?: number
}): { quickSell: number; market: number; maxProfit: number; reasoning: { th: string; en: string } } {
    // Mock pricing logic (in production, this would use ML model)
    const basePrice = input.originalPrice || 1000
    const conditionMultiplier = {
        'ใหม่': 0.85,
        'มือสอง': 0.60,
        'สภาพดี': 0.70,
        'มีตำหนิ': 0.40
    }[input.condition || 'มือสอง'] || 0.60

    const marketPrice = Math.round(basePrice * conditionMultiplier)

    return {
        quickSell: Math.round(marketPrice * 0.85),
        market: marketPrice,
        maxProfit: Math.round(marketPrice * 1.15),
        reasoning: {
            th: `ราคาตลาดสำหรับ ${input.condition || 'มือสอง'} อยู่ที่ประมาณ ${marketPrice.toLocaleString()} บาท`,
            en: `Market price for ${input.condition || 'used'} is around ฿${marketPrice.toLocaleString()}`
        }
    }
}

// Validate product data
export function validateProduct(data: {
    title: string
    description: string
    price: number
    category?: string
}, language: 'th' | 'en' = 'th'): ProductValidation {
    const warnings: ProductWarning[] = []
    const suggestions: ProductSuggestion[] = []

    // Check forbidden words in title
    const titleLower = data.title.toLowerCase()
    const forbiddenFound = FORBIDDEN_WORDS[language].filter(word =>
        titleLower.includes(word.toLowerCase())
    )

    if (forbiddenFound.length > 0) {
        warnings.push({
            field: 'title',
            type: 'forbidden_word',
            severity: 'warning',
            message: {
                th: `พบคำต้องห้าม: "${forbiddenFound.join(', ')}" อาจถูกระงับโฆษณา`,
                en: `Forbidden words found: "${forbiddenFound.join(', ')}" - may be suspended`
            }
        })
    }

    // Check misleading patterns
    const misleadingFound = MISLEADING_PATTERNS[language].some(pattern =>
        pattern.test(data.title) || pattern.test(data.description)
    )

    if (misleadingFound) {
        warnings.push({
            field: 'description',
            type: 'misleading',
            severity: 'error',
            message: {
                th: 'พบข้อความที่อาจทำให้เข้าใจผิด กรุณาแก้ไข',
                en: 'Misleading content detected. Please revise.'
            }
        })
    }

    // Check title length
    if (data.title.length < 10) {
        warnings.push({
            field: 'title',
            type: 'incomplete',
            severity: 'warning',
            message: {
                th: 'ชื่อสินค้าสั้นเกินไป ควรยาวอย่างน้อย 10 ตัวอักษร',
                en: 'Title too short. Should be at least 10 characters.'
            }
        })
    }

    // Check description length
    if (data.description.length < 50) {
        warnings.push({
            field: 'description',
            type: 'incomplete',
            severity: 'info',
            message: {
                th: 'คำอธิบายสั้น ลองเพิ่มรายละเอียดเพื่อดึงดูดผู้ซื้อ',
                en: 'Short description. Add more details to attract buyers.'
            }
        })
    }

    // Check price reasonableness
    if (data.price < 10) {
        warnings.push({
            field: 'price',
            type: 'pricing',
            severity: 'warning',
            message: {
                th: 'ราคาต่ำมาก อาจดูไม่น่าเชื่อถือ',
                en: 'Price too low. May look suspicious.'
            }
        })
    }

    if (data.price > 1000000) {
        warnings.push({
            field: 'price',
            type: 'pricing',
            severity: 'warning',
            message: {
                th: 'ราคาสูงมาก ตรวจสอบให้แน่ใจว่าถูกต้อง',
                en: 'Price very high. Please double-check.'
            }
        })
    }

    // Generate suggestions
    if (data.title && !data.category) {
        suggestions.push({
            field: 'category',
            type: 'category',
            value: 'อิเล็กทรอนิกส์', // Mock
            reason: {
                th: 'AI แนะนำหมวดหมู่ตามชื่อสินค้า',
                en: 'AI suggests category based on title'
            }
        })
    }

    // Determine risk level
    const hasErrors = warnings.some(w => w.severity === 'error')
    const hasWarnings = warnings.some(w => w.severity === 'warning')
    const riskLevel: 'safe' | 'caution' | 'high' =
        hasErrors ? 'high' : hasWarnings ? 'caution' : 'safe'

    return {
        isValid: !hasErrors,
        warnings,
        suggestions,
        riskLevel
    }
}

// Get risk level color
export function getRiskColor(level: 'safe' | 'caution' | 'high'): {
    bg: string
    text: string
    border: string
} {
    const colors = {
        safe: {
            bg: 'bg-green-50 dark:bg-green-900/20',
            text: 'text-green-700 dark:text-green-300',
            border: 'border-green-200 dark:border-green-800'
        },
        caution: {
            bg: 'bg-amber-50 dark:bg-amber-900/20',
            text: 'text-amber-700 dark:text-amber-300',
            border: 'border-amber-200 dark:border-amber-800'
        },
        high: {
            bg: 'bg-red-50 dark:bg-red-900/20',
            text: 'text-red-700 dark:text-red-300',
            border: 'border-red-200 dark:border-red-800'
        }
    }

    return colors[level]
}

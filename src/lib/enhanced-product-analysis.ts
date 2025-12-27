/**
 * ENHANCED PRODUCT ANALYSIS SYSTEM
 * 
 * 🎯 หลักการ: วิเคราะห์สินค้าแบบละเอียด เพื่อทั้งผู้ขายและผู้ซื้อ
 * 
 * Output ประกอบด้วย:
 * - ประเภทสินค้า (productType)
 * - ยี่ห้อ (brand)
 * - รุ่น (model)
 * - สเปค/คุณลักษณะ (specs)
 * - จุดขาย/ข้อดี (sellingPoints)
 * - สภาพ (condition)
 * - ความมั่นใจของระบบ (confidence)
 * - หมายเหตุ/คำเตือน (notes)
 * 
 * With Category-Specific Analysis:
 * - รถยนต์: ปี, ไมล์, เกียร์, เชื้อเพลิง
 * - อสังหา: ขนาดพื้นที่, จำนวนห้อง
 * - อิเล็กทรอนิกส์: CPU, RAM, Storage
 */

// ============================================
// INTERFACES
// ============================================

export interface EnhancedProductAnalysis {
    // Core Info
    productType: string           // ประเภทสินค้า (โน๊ตบุ๊ค, ทีวี, รถยนต์)
    brand: string                 // ยี่ห้อ
    model: string                 // รุ่น

    // Detailed Specs (Category-specific)
    specs: Record<string, string> // สเปคทั้งหมด

    // Selling Points
    sellingPoints: string[]       // จุดขายหลัก (1-3 ข้อ)

    // Condition
    condition: {
        label: string             // สภาพดี, มือสอง, ใหม่
        score: number             // 0-100%
        details: string           // รายละเอียดสภาพ
    }

    // Confidence & Notes
    confidence: {
        overall: number           // ความมั่นใจรวม 0-100%
        brand: number             // ความมั่นใจยี่ห้อ
        model: number             // ความมั่นใจรุ่น
        specs: number             // ความมั่นใจสเปค
    }

    notes: string[]               // หมายเหตุ/คำเตือน

    // Category Detection
    category: {
        id: number
        name: string
        subcategoryId: number
        subcategoryName: string
    }

    // Generated Content
    generatedTitle: string        // ชื่อสินค้าที่สร้าง
    generatedDescription: string  // คำอธิบายที่สร้าง

    // Pricing
    estimatedPrice: {
        min: number
        max: number
        suggested: number
    }
}

// ============================================
// CATEGORY-SPECIFIC SPEC TEMPLATES
// ============================================

export const CATEGORY_SPEC_TEMPLATES: Record<number, {
    requiredSpecs: string[]
    optionalSpecs: string[]
    sellingPointSuggestions: string[]
}> = {
    // Category 1: ยานยนต์
    1: {
        requiredSpecs: ['ยี่ห้อ', 'รุ่น', 'ปี', 'สี', 'ไมล์'],
        optionalSpecs: ['เกียร์', 'เชื้อเพลิง', 'cc', 'ผู้ขับ', 'ประกัน', 'ทะเบียน'],
        sellingPointSuggestions: [
            'ไมล์น้อย', 'ขายเอง', 'ไม่เคยชน', 'ประกันชั้น 1',
            'เจ้าของเดียว', 'ออปชั่นครบ', 'เบาะหนัง', 'ซันรูฟ'
        ]
    },

    // Category 2: อสังหาริมทรัพย์
    2: {
        requiredSpecs: ['ประเภท', 'พื้นที่ใช้สอย', 'ห้องนอน', 'ห้องน้ำ'],
        optionalSpecs: ['ชั้น', 'ที่จอดรถ', 'ทิศ', 'วิว', 'ค่าส่วนกลาง', 'ปีสร้าง'],
        sellingPointSuggestions: [
            'ตกแต่งครบ', 'พร้อมอยู่', 'ใกล้ BTS', 'วิวสวย',
            'ชั้นสูง', 'มีสระว่ายน้ำ', 'ฟิตเนส', 'รถไฟฟ้าใกล้'
        ]
    },

    // Category 3: มือถือและแท็บเล็ต
    3: {
        requiredSpecs: ['ยี่ห้อ', 'รุ่น', 'ความจุ'],
        optionalSpecs: ['สี', 'แบตเตอรี่', 'อุปกรณ์แถม', 'ประกัน'],
        sellingPointSuggestions: [
            'แบตดี', 'จอสวย', 'ประกันเหลือ', 'อุปกรณ์ครบกล่อง',
            'ไม่เคยซ่อม', 'ไม่มีรอย', 'เครื่องศูนย์ไทย'
        ]
    },

    // Category 4: คอมพิวเตอร์และไอที
    4: {
        requiredSpecs: ['ยี่ห้อ', 'รุ่น', 'CPU', 'RAM', 'Storage'],
        optionalSpecs: ['GPU', 'จอ', 'แบตเตอรี่', 'OS', 'สี', 'น้ำหนัก'],
        sellingPointSuggestions: [
            'สเปคแรง', 'เล่นเกมได้', 'จอ IPS', 'คีย์บอร์ดมีไฟ',
            'เบา พกพาง่าย', 'แบตอึด', 'ประกันศูนย์'
        ]
    },

    // Category 5: เครื่องใช้ไฟฟ้า
    5: {
        requiredSpecs: ['ยี่ห้อ', 'รุ่น', 'ขนาด'],
        optionalSpecs: ['ความจุ', 'พลังงาน', 'เทคโนโลยี', 'สี'],
        sellingPointSuggestions: [
            'ประหยัดไฟ', 'Inverter', 'Smart', 'เสียงเงียบ',
            'ประกันศูนย์', 'ใช้งานน้อย', 'สภาพ 90%'
        ]
    },

    // Category 6: แฟชั่น
    6: {
        requiredSpecs: ['แบรนด์', 'ประเภท', 'ไซส์', 'สี'],
        optionalSpecs: ['วัสดุ', 'แหล่งซื้อ', 'ปีซื้อ'],
        sellingPointSuggestions: [
            'ของแท้ 100%', 'มีใบเสร็จ', 'Limited Edition',
            'สภาพใหม่', 'ไม่เคยใช้', 'แท้ Shop ไทย'
        ]
    },

    // Category 7: เกมและแก็ดเจ็ต
    7: {
        requiredSpecs: ['ยี่ห้อ', 'รุ่น', 'ความจุ'],
        optionalSpecs: ['สี', 'อุปกรณ์แถม', 'เกมติดเครื่อง'],
        sellingPointSuggestions: [
            'ประกันศูนย์', 'อุปกรณ์ครบกล่อง', 'มีเกมแถม',
            'Joy-Con ใหม่', 'ไม่มีปัญหา Drift'
        ]
    },

    // Category 8: กล้องถ่ายรูป
    8: {
        requiredSpecs: ['ยี่ห้อ', 'รุ่น', 'เมาท์', 'ความละเอียด'],
        optionalSpecs: ['Shutter Count', 'อุปกรณ์แถม', 'ประกัน'],
        sellingPointSuggestions: [
            'Shutter น้อย', 'อุปกรณ์ครบกล่อง', 'มีเลนส์แถม',
            'ประกันศูนย์', 'ไม่มีรอย', 'ไม่มีฝุ่นใน Sensor'
        ]
    }
}

// ============================================
// CONFIDENCE CALCULATION
// ============================================

export function calculateConfidence(analysis: Partial<EnhancedProductAnalysis>): {
    overall: number
    brand: number
    model: number
    specs: number
} {
    let brandConfidence = 0
    let modelConfidence = 0
    let specsConfidence = 0

    // Brand Confidence
    if (analysis.brand) {
        const knownBrands = [
            // Electronics
            'acer', 'asus', 'dell', 'hp', 'lenovo', 'apple', 'samsung', 'lg', 'sony',
            // Vehicles
            'toyota', 'honda', 'nissan', 'mazda', 'isuzu', 'mitsubishi', 'ford',
            // Fashion
            'nike', 'adidas', 'gucci', 'louis vuitton', 'prada', 'chanel'
        ]

        const brandLower = analysis.brand.toLowerCase()
        if (knownBrands.some(b => brandLower.includes(b))) {
            brandConfidence = 95
        } else if (analysis.brand.length > 2) {
            brandConfidence = 70
        } else {
            brandConfidence = 30
        }
    }

    // Model Confidence
    if (analysis.model) {
        // Has numbers = likely real model
        if (/\d/.test(analysis.model)) {
            modelConfidence = 85
        } else if (analysis.model.length > 3) {
            modelConfidence = 60
        } else {
            modelConfidence = 40
        }
    }

    // Specs Confidence
    if (analysis.specs && Object.keys(analysis.specs).length > 0) {
        const specCount = Object.keys(analysis.specs).filter(k =>
            analysis.specs![k] && analysis.specs![k].length > 0
        ).length

        specsConfidence = Math.min(30 + (specCount * 10), 90)
    }

    // Overall = weighted average
    const overall = Math.round(
        (brandConfidence * 0.3) +
        (modelConfidence * 0.3) +
        (specsConfidence * 0.4)
    )

    return {
        overall,
        brand: brandConfidence,
        model: modelConfidence,
        specs: specsConfidence
    }
}

// ============================================
// NOTE GENERATION
// ============================================

export function generateNotes(
    analysis: Partial<EnhancedProductAnalysis>,
    categoryId: number
): string[] {
    const notes: string[] = []
    const template = CATEGORY_SPEC_TEMPLATES[categoryId]

    if (!template) return notes

    // Check missing required specs
    const missingSpecs = template.requiredSpecs.filter(spec =>
        !analysis.specs || !analysis.specs[spec] || analysis.specs[spec].trim() === ''
    )

    if (missingSpecs.length > 0) {
        notes.push(`⚠️ ควรระบุเพิ่มเติม: ${missingSpecs.join(', ')}`)
    }

    // Low confidence warnings
    if (analysis.confidence) {
        if (analysis.confidence.brand < 70) {
            notes.push('⚠️ ไม่แน่ใจยี่ห้อ - กรุณาตรวจสอบ')
        }
        if (analysis.confidence.model < 60) {
            notes.push('⚠️ ไม่แน่ใจรุ่น - กรุณาระบุให้ชัดเจน')
        }
    }

    // Category-specific notes
    if (categoryId === 1) { // ยานยนต์
        if (!analysis.specs?.['ไมล์']) {
            notes.push('💡 แนะนำ: ระบุเลขไมล์จะช่วยให้ขายได้เร็วขึ้น')
        }
        if (!analysis.specs?.['ปี']) {
            notes.push('💡 แนะนำ: ระบุปีจดทะเบียนเพื่อความโปร่งใส')
        }
    }

    if (categoryId === 4) { // คอมพิวเตอร์
        if (!analysis.specs?.['RAM']) {
            notes.push('💡 แนะนำ: ระบุ RAM เพื่อให้ผู้ซื้อประเมินสเปค')
        }
        if (!analysis.specs?.['Storage']) {
            notes.push('💡 แนะนำ: ระบุความจุ SSD/HDD')
        }
    }

    if (categoryId === 3) { // มือถือ
        notes.push('💡 แนะนำ: ระบุ % แบตเตอรี่จะดึงดูดผู้ซื้อมากขึ้น')
    }

    return notes
}

// ============================================
// SELLING POINT GENERATOR
// ============================================

export function generateSellingPoints(
    analysis: Partial<EnhancedProductAnalysis>,
    categoryId: number
): string[] {
    const template = CATEGORY_SPEC_TEMPLATES[categoryId]
    const points: string[] = []

    // From condition
    if (analysis.condition) {
        if (analysis.condition.score >= 90) {
            points.push('สภาพดีมาก')
        } else if (analysis.condition.score >= 70) {
            points.push('สภาพดี')
        }
    }

    // From specs (category specific)
    if (analysis.specs) {
        if (categoryId === 4) { // Computer
            if (analysis.specs['RAM'] && parseInt(analysis.specs['RAM']) >= 16) {
                points.push('RAM สูง')
            }
            if (analysis.specs['Storage'] && analysis.specs['Storage'].toLowerCase().includes('ssd')) {
                points.push('SSD เร็ว')
            }
        }

        if (categoryId === 1) { // Vehicle
            if (analysis.specs['ไมล์'] && parseInt(analysis.specs['ไมล์']) < 50000) {
                points.push('ไมล์น้อย')
            }
            if (analysis.specs['ผู้ขับ'] === 'เจ้าของเดียว') {
                points.push('เจ้าของเดียว')
            }
        }
    }

    // Suggest from template if not enough
    if (points.length < 2 && template) {
        const remaining = template.sellingPointSuggestions.filter(p => !points.includes(p))
        points.push(...remaining.slice(0, 2 - points.length))
    }

    return points.slice(0, 3) // Max 3 points
}

// ============================================
// ENHANCED ANALYSIS PROMPT
// ============================================

export const ENHANCED_ANALYSIS_PROMPT = `คุณคือผู้เชี่ยวชาญวิเคราะห์สินค้าสำหรับ JaiKod.com

🎯 **ภารกิจ:** วิเคราะห์รูปสินค้าอย่างละเอียด ทั้งมุมมองผู้ขายและผู้ซื้อ

📋 **กรุณาตอบเป็น JSON ดังนี้:**

{
  "productType": "ประเภทสินค้า (โน๊ตบุ๊ค, ทีวี, รถยนต์, มือถือ, etc.)",
  "brand": "ยี่ห้อ (อ่านจากโลโก้)",
  "model": "รุ่น (ถ้าเห็น)",
  "specs": {
    // สเปคที่เห็นในภาพ ตามประเภทสินค้า
    // คอมพิวเตอร์: CPU, RAM, Storage, GPU, จอ
    // รถยนต์: ปี, ไมล์, เกียร์, เชื้อเพลิง, สี
    // มือถือ: ความจุ, สี, แบตเตอรี่
    // อสังหา: ห้องนอน, ห้องน้ำ, พื้นที่
  },
  "sellingPoints": ["จุดขายหลัก 1-3 ข้อ"],
  "condition": {
    "label": "ใหม่/สภาพดีมาก/สภาพดี/พอใช้",
    "score": 0-100,
    "details": "รายละเอียดสภาพ"
  },
  "confidence": {
    "brand": 0-100,
    "model": 0-100,
    "specs": 0-100
  },
  "notes": ["หมายเหตุ/คำเตือน ถ้ามี"],
  "suggestedCategory": "หมวดหมู่หลัก",
  "suggestedSubcategory": "หมวดหมู่ย่อย (ถ้ารู้)",
  "title": "ชื่อสินค้าภาษาไทย 40-80 ตัวอักษร",
  "description": "คำอธิบายสั้นๆ 2-3 ประโยค",
  "estimatedPrice": {
    "min": 0,
    "max": 0,
    "suggested": 0
  }
}

⚡ **กฎสำคัญ:**
1. 🔍 อ่านโลโก้/ยี่ห้อก่อนเลย!
2. 📝 ถ้าไม่แน่ใจ ให้ confidence ต่ำ + ใส่ notes
3. ❌ ห้ามเดา! ถ้าไม่เห็นชัด ให้เว้นว่างหรือระบุว่า "ไม่ระบุ"
4. 🇹🇭 ตอบเป็นภาษาไทย (ยกเว้นชื่อแบรนด์/รุ่น)

🖥️ **แยก Monitor vs TV:**
- บนโต๊ะ + คีย์บอร์ด = จอมอนิเตอร์ (คอมพิวเตอร์และไอที)
- บนตู้ทีวี + รีโมท = ทีวี (เครื่องใช้ไฟฟ้า)

🚗 **รถยนต์ - สำคัญ:**
- หาปีจดทะเบียนจากป้ายหรือหน้าจอ
- ดูสภาพจากรอยแตก รอยขีด สีเดิมหรือทำสี
- ดูไมล์จากหน้าปัด (ถ้าเห็น)
`

// ============================================
// DISPLAY FORMATTER
// ============================================

export function formatAnalysisForDisplay(analysis: EnhancedProductAnalysis): string {
    const lines: string[] = []

    lines.push(`📦 **ประเภทสินค้า:** ${analysis.productType}`)
    lines.push(`🏷️ **ยี่ห้อ:** ${analysis.brand || 'ไม่ระบุ'} (${analysis.confidence.brand}% มั่นใจ)`)
    lines.push(`📱 **รุ่น:** ${analysis.model || 'ไม่ระบุ'} (${analysis.confidence.model}% มั่นใจ)`)

    // Specs
    if (analysis.specs && Object.keys(analysis.specs).length > 0) {
        lines.push(`⚙️ **สเปค:**`)
        for (const [key, value] of Object.entries(analysis.specs)) {
            if (value) {
                lines.push(`   • ${key}: ${value}`)
            }
        }
    }

    // Selling Points
    if (analysis.sellingPoints && analysis.sellingPoints.length > 0) {
        lines.push(`✨ **จุดขาย:** ${analysis.sellingPoints.join(', ')}`)
    }

    // Condition
    if (analysis.condition) {
        lines.push(`📊 **สภาพ:** ${analysis.condition.label} (${analysis.condition.score}%)`)
        if (analysis.condition.details) {
            lines.push(`   ${analysis.condition.details}`)
        }
    }

    // Overall Confidence
    lines.push(`🎯 **ความมั่นใจรวม:** ${analysis.confidence.overall}%`)

    // Notes
    if (analysis.notes && analysis.notes.length > 0) {
        lines.push(`📝 **หมายเหตุ:**`)
        analysis.notes.forEach(note => {
            lines.push(`   ${note}`)
        })
    }

    return lines.join('\n')
}

// ============================================
// EXPORT
// ============================================

export default {
    CATEGORY_SPEC_TEMPLATES,
    calculateConfidence,
    generateNotes,
    generateSellingPoints,
    ENHANCED_ANALYSIS_PROMPT,
    formatAnalysisForDisplay
}

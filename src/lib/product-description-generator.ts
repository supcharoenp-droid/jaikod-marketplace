/**
 * HYBRID PRODUCT DESCRIPTION GENERATOR
 * 
 * ระบบสร้างรายละเอียดสินค้าแบบ Hybrid:
 * 1. โครงสร้างจากระบบ (Section-based)
 * 2. เนื้อหาจาก AI (OpenAI)
 * 
 * หลักการ:
 * - ดูเป็นมืออาชีพ
 * - มีช่องว่างของข้อความ
 * - ตรงตัวสินค้า
 * - ไม่รก ไม่ยัดเยียด
 */

// ========================================
// TYPES
// ========================================
export interface DescriptionSection {
    id: string
    title_th: string
    title_en: string
    icon: string
    content: string
    isEditable: boolean
    showTitle: boolean
    order: number
}

export interface ProductDescriptionInput {
    title: string
    categoryId: number
    subcategoryId?: number
    categoryName_th?: string
    subcategoryName_th?: string
    userInputData?: Record<string, any>
    aiAnalysisData?: {
        detectedObjects?: string[]
        suggestedCategory?: string
        condition?: string
    }
    language?: 'th' | 'en'
}

export interface GeneratedDescription {
    sections: DescriptionSection[]
    fullText: string
    formattedHtml: string
}

// ========================================
// SECTION TEMPLATES BY CATEGORY
// ========================================

// Common sections for all categories
const COMMON_SECTIONS = {
    intro: {
        id: 'intro',
        title_th: '',
        title_en: '',
        icon: '',
        showTitle: false,
        order: 1
    },
    features: {
        id: 'features',
        title_th: '📌 คุณสมบัติหลัก',
        title_en: '📌 Key Features',
        icon: '📌',
        showTitle: true,
        order: 2
    },
    condition: {
        id: 'condition',
        title_th: '✅ สภาพสินค้า',
        title_en: '✅ Condition',
        icon: '✅',
        showTitle: true,
        order: 3
    },
    target: {
        id: 'target',
        title_th: '👤 เหมาะสำหรับ',
        title_en: '👤 Ideal For',
        icon: '👤',
        showTitle: true,
        order: 4
    },
    notes: {
        id: 'notes',
        title_th: '📝 หมายเหตุ',
        title_en: '📝 Notes',
        icon: '📝',
        showTitle: true,
        order: 5
    }
}

// Category-specific section overrides
const CATEGORY_SECTIONS: Record<number, Partial<typeof COMMON_SECTIONS>> = {
    // Automotive
    1: {
        features: {
            ...COMMON_SECTIONS.features,
            title_th: '🚗 ข้อมูลรถ',
            title_en: '🚗 Vehicle Info'
        },
        condition: {
            ...COMMON_SECTIONS.condition,
            title_th: '🔧 สภาพและการบำรุงรักษา',
            title_en: '🔧 Condition & Maintenance'
        }
    },
    // Real Estate
    2: {
        features: {
            ...COMMON_SECTIONS.features,
            title_th: '🏠 รายละเอียดที่พัก',
            title_en: '🏠 Property Details'
        },
        target: {
            ...COMMON_SECTIONS.target,
            title_th: '🎯 เหมาะกับ',
            title_en: '🎯 Suitable For'
        }
    },
    // Mobile
    3: {
        features: {
            ...COMMON_SECTIONS.features,
            title_th: '📱 สเปกเครื่อง',
            title_en: '📱 Specifications'
        }
    },
    // Computer
    4: {
        features: {
            ...COMMON_SECTIONS.features,
            title_th: '💻 สเปกหลัก',
            title_en: '💻 Main Specs'
        },
        target: {
            ...COMMON_SECTIONS.target,
            title_th: '🎮 เหมาะกับการใช้งาน',
            title_en: '🎮 Best For'
        }
    },
    // Amulets
    9: {
        features: {
            ...COMMON_SECTIONS.features,
            title_th: '🙏 ข้อมูลพระ',
            title_en: '🙏 Amulet Details'
        },
        condition: {
            ...COMMON_SECTIONS.condition,
            title_th: '✨ สภาพองค์พระ',
            title_en: '✨ Amulet Condition'
        }
    },
    // Pets
    10: {
        features: {
            ...COMMON_SECTIONS.features,
            title_th: '🐾 ข้อมูลสัตว์เลี้ยง',
            title_en: '🐾 Pet Info'
        },
        condition: {
            ...COMMON_SECTIONS.condition,
            title_th: '💉 สุขภาพและวัคซีน',
            title_en: '💉 Health & Vaccination'
        }
    }
}

// ========================================
// DESCRIPTION TEMPLATES BY CATEGORY
// ========================================

interface DescriptionTemplate {
    intro: (data: ProductDescriptionInput) => string
    features: (data: ProductDescriptionInput) => string
    condition: (data: ProductDescriptionInput) => string
    target: (data: ProductDescriptionInput) => string
    notes: (data: ProductDescriptionInput) => string
}

const DEFAULT_TEMPLATE: DescriptionTemplate = {
    intro: (data) => `${data.title}`,
    features: (data) => {
        const items = []
        if (data.userInputData?.brand) items.push(`• ยี่ห้อ: ${data.userInputData.brand}`)
        if (data.userInputData?.model) items.push(`• รุ่น: ${data.userInputData.model}`)
        if (data.userInputData?.color) items.push(`• สี: ${data.userInputData.color}`)
        return items.length > 0 ? items.join('\n') : '• กรุณาเพิ่มข้อมูลสินค้า'
    },
    condition: (data) => {
        const condition = data.userInputData?.condition || data.aiAnalysisData?.condition
        if (condition === 'new') return '• สภาพใหม่ ยังไม่แกะกล่อง'
        if (condition === 'like_new') return '• สภาพดีเยี่ยม เหมือนใหม่'
        if (condition === 'good') return '• สภาพดี มีรอยใช้งานเล็กน้อย'
        if (condition === 'fair') return '• สภาพพอใช้ มีรอยใช้งาน'
        return '• กรุณาระบุสภาพสินค้า'
    },
    target: (data) => '• ผู้ที่สนใจสินค้าประเภทนี้',
    notes: (data) => '• สอบถามรายละเอียดเพิ่มเติมได้\n• ดูรูปเพิ่มเติมก่อนตัดสินใจ'
}

// AUTOMOTIVE TEMPLATE
const AUTOMOTIVE_TEMPLATE: DescriptionTemplate = {
    intro: (data) => {
        const year = data.userInputData?.vehicle_year || ''
        const brand = data.userInputData?.vehicle_brand || ''
        const model = data.userInputData?.vehicle_model || ''
        return `${year ? `ปี ${year} ` : ''}${brand} ${model}`.trim() || data.title
    },
    features: (data) => {
        const items = []
        if (data.userInputData?.vehicle_brand) items.push(`• ยี่ห้อ: ${data.userInputData.vehicle_brand}`)
        if (data.userInputData?.vehicle_model) items.push(`• รุ่น: ${data.userInputData.vehicle_model}`)
        if (data.userInputData?.vehicle_year) items.push(`• ปีจดทะเบียน: ${data.userInputData.vehicle_year}`)
        if (data.userInputData?.mileage) items.push(`• เลขไมล์: ${data.userInputData.mileage} กม.`)
        if (data.userInputData?.gear_type) {
            const gear = data.userInputData.gear_type === 'auto' ? 'ออโต้' : 'ธรรมดา'
            items.push(`• เกียร์: ${gear}`)
        }
        if (data.userInputData?.fuel_type) {
            const fuelMap: Record<string, string> = {
                'gasoline': 'เบนซิน',
                'diesel': 'ดีเซล',
                'hybrid': 'ไฮบริด',
                'electric': 'ไฟฟ้า'
            }
            items.push(`• เชื้อเพลิง: ${fuelMap[data.userInputData.fuel_type] || data.userInputData.fuel_type}`)
        }
        if (data.userInputData?.vehicle_color) items.push(`• สี: ${data.userInputData.vehicle_color}`)
        return items.length > 0 ? items.join('\n') : '• กรุณาเพิ่มข้อมูลรถ'
    },
    condition: (data) => {
        const items = []
        const condition = data.userInputData?.vehicle_condition
        if (condition === 'excellent') {
            items.push('• สภาพดีเยี่ยม ไม่เคยชน')
            items.push('• ไม่เคยน้ำท่วม')
        } else if (condition === 'good') {
            items.push('• สภาพดี มีรอยนิดหน่อย')
        } else if (condition === 'fair') {
            items.push('• สภาพพอใช้ มีรอยใช้งาน')
        } else if (condition === 'needs_repair') {
            items.push('• ต้องซ่อมบางส่วน')
        }
        items.push('• เช็คระยะตามระยะสม่ำเสมอ')
        return items.join('\n')
    },
    target: (data) => {
        const items = ['• ผู้ที่กำลังหารถมือสอง']
        if (data.userInputData?.mileage && parseInt(data.userInputData.mileage) < 50000) {
            items.push('• ต้องการรถไมล์น้อย')
        }
        if (data.userInputData?.gear_type === 'auto') {
            items.push('• ชอบเกียร์ออโต้ ขับสบาย')
        }
        return items.join('\n')
    },
    notes: (data) => {
        const items = [
            '• นัดดูรถได้ก่อนตัดสินใจ',
            '• มีประวัติเข้าศูนย์ครบ',
            '• รับทุบเทรินได้'
        ]
        return items.join('\n')
    }
}

// MOBILE TEMPLATE
const MOBILE_TEMPLATE: DescriptionTemplate = {
    intro: (data) => {
        const brand = data.userInputData?.phone_brand || ''
        const model = data.userInputData?.phone_model || ''
        const storage = data.userInputData?.storage || ''
        return `${brand} ${model} ${storage}`.trim() || data.title
    },
    features: (data) => {
        const items = []
        if (data.userInputData?.phone_brand) items.push(`• แบรนด์: ${data.userInputData.phone_brand}`)
        if (data.userInputData?.phone_model) items.push(`• รุ่น: ${data.userInputData.phone_model}`)
        if (data.userInputData?.storage) items.push(`• ความจุ: ${data.userInputData.storage}`)
        if (data.userInputData?.phone_color) items.push(`• สี: ${data.userInputData.phone_color}`)
        if (data.userInputData?.battery_health) items.push(`• สุขภาพแบต: ${data.userInputData.battery_health}`)
        return items.length > 0 ? items.join('\n') : '• กรุณาเพิ่มข้อมูลมือถือ'
    },
    condition: (data) => {
        const items = []
        const condition = data.userInputData?.phone_condition
        if (condition === 'new') {
            items.push('• เครื่องใหม่ ยังไม่แกะซีล')
        } else if (condition === 'like_new') {
            items.push('• สภาพใหม่มาก ไม่มีรอย')
        } else if (condition === 'excellent') {
            items.push('• สภาพดีเยี่ยม รอยเล็กน้อย')
        } else if (condition === 'good') {
            items.push('• สภาพดี มีรอยใช้งานปกติ')
        }

        const warranty = data.userInputData?.warranty
        if (warranty && warranty !== 'none') {
            const warrantyMap: Record<string, string> = {
                'store': 'ประกันร้าน',
                'brand_3m': 'ประกันศูนย์ 3 เดือน',
                'brand_6m': 'ประกันศูนย์ 6 เดือน',
                'brand_1y': 'ประกันศูนย์ 1 ปี',
                'brand_2y': 'ประกันศูนย์ 2 ปี'
            }
            items.push(`• ${warrantyMap[warranty] || warranty}`)
        }
        return items.length > 0 ? items.join('\n') : '• กรุณาระบุสภาพเครื่อง'
    },
    target: (data) => {
        const items = ['• ผู้ที่กำลังหามือถือมือสอง']
        const condition = data.userInputData?.phone_condition
        if (condition === 'new' || condition === 'like_new') {
            items.push('• ต้องการเครื่องสภาพดี')
        }
        if (data.userInputData?.battery_health && parseInt(data.userInputData.battery_health) > 85) {
            items.push('• ต้องการแบตสุขภาพดี')
        }
        return items.join('\n')
    },
    notes: (data) => {
        const items = [
            '• ส่งได้ทั่วประเทศ',
            '• รับเคลมได้ถ้ามีปัญหา'
        ]
        const accessories = data.userInputData?.phone_accessories
        if (accessories && accessories.length > 0) {
            const accMap: Record<string, string> = {
                'box': 'กล่อง',
                'charger': 'สายชาร์จ',
                'adapter': 'หัวชาร์จ',
                'earphones': 'หูฟัง',
                'case': 'เคส'
            }
            const accList = accessories.map((a: string) => accMap[a] || a).join(', ')
            items.unshift(`• อุปกรณ์ที่มี: ${accList}`)
        }
        return items.join('\n')
    }
}

// COMPUTER TEMPLATE
const COMPUTER_TEMPLATE: DescriptionTemplate = {
    intro: (data) => {
        const brand = data.userInputData?.brand || ''
        const model = data.userInputData?.model || ''
        return `${brand} ${model}`.trim() || data.title
    },
    features: (data) => {
        const items = []
        if (data.userInputData?.brand) items.push(`• ยี่ห้อ: ${data.userInputData.brand}`)
        if (data.userInputData?.model) items.push(`• รุ่น: ${data.userInputData.model}`)
        if (data.userInputData?.cpu) items.push(`• CPU: ${data.userInputData.cpu}`)
        if (data.userInputData?.ram) items.push(`• RAM: ${data.userInputData.ram}`)
        if (data.userInputData?.storage_type) items.push(`• Storage: ${data.userInputData.storage_type}`)
        if (data.userInputData?.gpu) items.push(`• การ์ดจอ: ${data.userInputData.gpu}`)
        if (data.userInputData?.screen_size) items.push(`• ขนาดจอ: ${data.userInputData.screen_size}`)
        return items.length > 0 ? items.join('\n') : '• กรุณาเพิ่มข้อมูลสเปก'
    },
    condition: (data) => {
        const items = []
        const condition = data.userInputData?.condition
        if (condition === 'new') {
            items.push('• เครื่องใหม่ ยังไม่แกะกล่อง')
        } else if (condition === 'like_new') {
            items.push('• สภาพใหม่มาก ใช้งานน้อย')
        } else if (condition === 'excellent' || condition === 'good') {
            items.push('• สภาพดี ใช้งานได้ปกติ')
            items.push('• ไม่เคยซ่อม')
        }
        items.push('• แบตยังอึด (ถ้าเป็น Laptop)')
        return items.join('\n')
    },
    target: (data) => {
        const items = []
        const cpu = data.userInputData?.cpu?.toLowerCase() || ''
        const gpu = data.userInputData?.gpu?.toLowerCase() || ''

        if (gpu.includes('rtx') || gpu.includes('gtx')) {
            items.push('• เกมเมอร์ที่ต้องการเล่นเกม AAA')
            items.push('• ทำ Video Editing / 3D Rendering')
        } else if (cpu.includes('i7') || cpu.includes('i9') || cpu.includes('ryzen 7')) {
            items.push('• ทำงาน Multitask หนัก')
            items.push('• Developer / Designer')
        } else {
            items.push('• ใช้งานทั่วไป เรียน ทำงาน')
            items.push('• ดูหนัง เล่นเน็ต')
        }
        return items.join('\n')
    },
    notes: (data) => {
        const items = [
            '• รับประกันเครื่องทำงานปกติ 100%',
            '• ทดสอบก่อนรับได้'
        ]
        if (data.userInputData?.warranty && data.userInputData.warranty !== 'none') {
            items.unshift(`• มีประกัน`)
        }
        return items.join('\n')
    }
}

// AMULET TEMPLATE
const AMULET_TEMPLATE: DescriptionTemplate = {
    intro: (data) => {
        const name = data.userInputData?.amulet_name || data.title
        const temple = data.userInputData?.temple || ''
        const year = data.userInputData?.amulet_year || ''
        return `${name}${temple ? ` ${temple}` : ''}${year ? ` ปี ${year}` : ''}`
    },
    features: (data) => {
        const items = []
        if (data.userInputData?.amulet_name) items.push(`• ชื่อพระ: ${data.userInputData.amulet_name}`)
        if (data.userInputData?.temple) items.push(`• วัด: ${data.userInputData.temple}`)
        if (data.userInputData?.monk) items.push(`• พระเกจิ: ${data.userInputData.monk}`)
        if (data.userInputData?.amulet_year) items.push(`• ปี: พ.ศ. ${data.userInputData.amulet_year}`)
        if (data.userInputData?.material) {
            const materialMap: Record<string, string> = {
                'bronze': 'เนื้อทองแดง',
                'gold': 'เนื้อทองคำ',
                'silver': 'เนื้อเงิน',
                'sacred_powder': 'เนื้อผง',
                'lead': 'เนื้อตะกั่ว',
                'earth': 'เนื้อดิน'
            }
            items.push(`• เนื้อ: ${materialMap[data.userInputData.material] || data.userInputData.material}`)
        }
        return items.length > 0 ? items.join('\n') : '• กรุณาเพิ่มข้อมูลพระ'
    },
    condition: (data) => {
        const items = ['• สภาพสวย สมบูรณ์']
        const cert = data.userInputData?.certificate
        if (cert === 'association') {
            items.push('• มีใบรับรองสมาคม')
        } else if (cert === 'store') {
            items.push('• มีการันตีร้าน')
        }
        return items.join('\n')
    },
    target: (data) => {
        const items = [
            '• ผู้ที่ศรัทธาในพระเครื่อง',
            '• นักสะสมพระ'
        ]
        return items.join('\n')
    },
    notes: (data) => {
        const items = [
            '• ตรวจสอบก่อนรับได้',
            '• จัดส่งให้ด้วยความระมัดระวัง',
            '• รับเปลี่ยนถ้าไม่ตรงปก'
        ]
        return items.join('\n')
    }
}

// REAL ESTATE TEMPLATE
const REAL_ESTATE_TEMPLATE: DescriptionTemplate = {
    intro: (data) => {
        const type = data.userInputData?.property_type || ''
        const purpose = data.userInputData?.listing_type === 'rent' ? 'ให้เช่า' : 'ขาย'
        return `${type} ${purpose}`.trim() || data.title
    },
    features: (data) => {
        const items = []
        if (data.userInputData?.property_type) items.push(`• ประเภท: ${data.userInputData.property_type}`)
        if (data.userInputData?.area_sqm) items.push(`• พื้นที่: ${data.userInputData.area_sqm} ตร.ม.`)
        if (data.userInputData?.bedrooms) items.push(`• ห้องนอน: ${data.userInputData.bedrooms} ห้อง`)
        if (data.userInputData?.bathrooms) items.push(`• ห้องน้ำ: ${data.userInputData.bathrooms} ห้อง`)
        if (data.userInputData?.floor) items.push(`• ชั้น: ${data.userInputData.floor}`)
        if (data.userInputData?.parking) items.push(`• ที่จอดรถ: ${data.userInputData.parking} คัน`)
        return items.length > 0 ? items.join('\n') : '• กรุณาเพิ่มข้อมูลที่พัก'
    },
    condition: (data) => {
        const items = []
        const condition = data.userInputData?.property_condition
        if (condition === 'new') {
            items.push('• บ้านใหม่ ยังไม่เคยเข้าอยู่')
        } else if (condition === 'renovated') {
            items.push('• รีโนเวทใหม่ พร้อมอยู่')
        } else if (condition === 'good') {
            items.push('• สภาพดี พร้อมเข้าอยู่')
        }
        items.push('• ใกล้รถไฟฟ้า/ถนนใหญ่')
        return items.join('\n')
    },
    target: (data) => {
        const items = []
        const bedrooms = data.userInputData?.bedrooms
        if (bedrooms && parseInt(bedrooms) >= 3) {
            items.push('• ครอบครัวขนาดกลาง-ใหญ่')
        } else if (bedrooms && parseInt(bedrooms) === 1) {
            items.push('• คนโสด/คู่รัก')
        } else {
            items.push('• ครอบครัวเล็ก')
        }
        if (data.userInputData?.listing_type === 'rent') {
            items.push('• ผู้ที่ต้องการเช่าระยะยาว')
        }
        return items.join('\n')
    },
    notes: (data) => {
        const items = [
            '• นัดดูสถานที่ได้',
            '• ราคาต่อรองได้'
        ]
        if (data.userInputData?.listing_type === 'rent') {
            items.push('• มัดจำ 2 เดือน')
        }
        return items.join('\n')
    }
}

// APPLIANCES TEMPLATE
const APPLIANCES_TEMPLATE: DescriptionTemplate = {
    intro: (data) => {
        const brand = data.userInputData?.brand || ''
        const model = data.userInputData?.model || ''
        const type = data.userInputData?.appliance_type || ''
        return `${brand} ${model} ${type}`.trim() || data.title
    },
    features: (data) => {
        const items = []
        if (data.userInputData?.brand) items.push(`• ยี่ห้อ: ${data.userInputData.brand}`)
        if (data.userInputData?.model) items.push(`• รุ่น: ${data.userInputData.model}`)
        if (data.userInputData?.appliance_type) items.push(`• ประเภท: ${data.userInputData.appliance_type}`)
        if (data.userInputData?.screen_size_tv) items.push(`• ขนาดจอ: ${data.userInputData.screen_size_tv}`)
        if (data.userInputData?.btu) items.push(`• BTU: ${data.userInputData.btu}`)
        return items.length > 0 ? items.join('\n') : '• กรุณาเพิ่มข้อมูลสินค้า'
    },
    condition: (data) => {
        const items = []
        const condition = data.userInputData?.condition
        if (condition === 'new') {
            items.push('• เครื่องใหม่ ยังไม่แกะกล่อง')
        } else if (condition === 'like_new') {
            items.push('• สภาพใหม่มาก ใช้งานน้อย')
        } else {
            items.push('• ใช้งานได้ปกติ')
        }
        items.push('• ไม่มีเสียงดัง')
        return items.join('\n')
    },
    target: (data) => '• ผู้ที่ต้องการเครื่องใช้ไฟฟ้าคุณภาพดี\n• ประหยัดงบ ได้ของดี',
    notes: (data) => {
        const items = [
            '• รับประกันเครื่องใช้งานได้',
            '• ส่งได้ทั่วกรุงเทพ'
        ]
        if (data.userInputData?.warranty && data.userInputData.warranty !== 'none') {
            items.unshift('• มีประกัน')
        }
        return items.join('\n')
    }
}

// FASHION TEMPLATE
const FASHION_TEMPLATE: DescriptionTemplate = {
    intro: (data) => {
        const brand = data.userInputData?.brand || ''
        const type = data.userInputData?.fashion_type || ''
        return `${brand} ${type}`.trim() || data.title
    },
    features: (data) => {
        const items = []
        if (data.userInputData?.brand) items.push(`• แบรนด์: ${data.userInputData.brand}`)
        if (data.userInputData?.fashion_type) items.push(`• ประเภท: ${data.userInputData.fashion_type}`)
        if (data.userInputData?.size) items.push(`• ไซส์: ${data.userInputData.size}`)
        if (data.userInputData?.color) items.push(`• สี: ${data.userInputData.color}`)
        if (data.userInputData?.material) items.push(`• วัสดุ: ${data.userInputData.material}`)
        if (data.userInputData?.authenticity) {
            const authMap: Record<string, string> = {
                'authentic': 'ของแท้ 100%',
                'inspired': 'สินค้าแรงบันดาลใจ',
                'handmade': 'Handmade'
            }
            items.push(`• ${authMap[data.userInputData.authenticity] || data.userInputData.authenticity}`)
        }
        return items.length > 0 ? items.join('\n') : '• กรุณาเพิ่มข้อมูลสินค้า'
    },
    condition: (data) => {
        const condition = data.userInputData?.condition
        if (condition === 'new') return '• ของใหม่ ยังไม่เคยใช้\n• อยู่ในถุง/กล่องเดิม'
        if (condition === 'like_new') return '• สภาพใหม่มาก\n• ใช้งานน้อยมาก 1-2 ครั้ง'
        if (condition === 'good') return '• สภาพดี\n• มีรอยใช้งานเล็กน้อย'
        return '• กรุณาระบุสภาพสินค้า'
    },
    target: (data) => '• ผู้ที่ชื่นชอบแฟชั่น\n• ต้องการของดีราคาถูก',
    notes: (data) => {
        const items = [
            '• ส่งได้ทั่วประเทศ',
            '• รับประกันตรงปก'
        ]
        return items.join('\n')
    }
}

// GAMING TEMPLATE
const GAMING_TEMPLATE: DescriptionTemplate = {
    intro: (data) => {
        const platform = data.userInputData?.platform || ''
        const type = data.userInputData?.game_type || ''
        return `${platform} ${type}`.trim() || data.title
    },
    features: (data) => {
        const items = []
        if (data.userInputData?.platform) {
            const platformMap: Record<string, string> = {
                'ps5': 'PlayStation 5',
                'ps4': 'PlayStation 4',
                'xbox_series': 'Xbox Series X/S',
                'switch': 'Nintendo Switch',
                'pc': 'PC'
            }
            items.push(`• แพลตฟอร์ม: ${platformMap[data.userInputData.platform] || data.userInputData.platform}`)
        }
        if (data.userInputData?.game_type) items.push(`• ประเภท: ${data.userInputData.game_type}`)
        if (data.userInputData?.game_title) items.push(`• ชื่อเกม: ${data.userInputData.game_title}`)
        return items.length > 0 ? items.join('\n') : '• กรุณาเพิ่มข้อมูลสินค้า'
    },
    condition: (data) => {
        const condition = data.userInputData?.condition
        if (condition === 'new') return '• ของใหม่ ซีลยังไม่แกะ'
        if (condition === 'like_new') return '• สภาพใหม่มาก\n• แผ่นไม่มีรอย'
        if (condition === 'good') return '• สภาพดี ใช้งานได้ปกติ'
        return '• ใช้งานได้ปกติ 100%'
    },
    target: (data) => '• เกมเมอร์ทุกระดับ\n• นักสะสมเกม',
    notes: (data) => {
        const items = ['• ส่งได้ทั่วประเทศ']
        if (data.userInputData?.game_type === 'console') {
            items.push('• ทดสอบก่อนรับได้')
        }
        return items.join('\n')
    }
}

// CAMERA TEMPLATE
const CAMERA_TEMPLATE: DescriptionTemplate = {
    intro: (data) => {
        const brand = data.userInputData?.camera_brand || ''
        const model = data.userInputData?.model || ''
        return `${brand} ${model}`.trim() || data.title
    },
    features: (data) => {
        const items = []
        if (data.userInputData?.camera_brand) items.push(`• ยี่ห้อ: ${data.userInputData.camera_brand}`)
        if (data.userInputData?.model) items.push(`• รุ่น: ${data.userInputData.model}`)
        if (data.userInputData?.camera_type) items.push(`• ประเภท: ${data.userInputData.camera_type}`)
        if (data.userInputData?.sensor_type) items.push(`• Sensor: ${data.userInputData.sensor_type}`)
        if (data.userInputData?.shutter_count) items.push(`• Shutter Count: ${data.userInputData.shutter_count}`)
        return items.length > 0 ? items.join('\n') : '• กรุณาเพิ่มข้อมูลกล้อง'
    },
    condition: (data) => {
        const items = []
        const condition = data.userInputData?.condition
        if (condition === 'new') {
            items.push('• กล้องใหม่ ประกันศูนย์')
        } else if (condition === 'like_new') {
            items.push('• สภาพใหม่มาก')
            items.push('• ช่องมองใส')
        } else {
            items.push('• ใช้งานได้ปกติ 100%')
        }
        const shutterCount = data.userInputData?.shutter_count
        if (shutterCount && parseInt(shutterCount) < 50000) {
            items.push('• ชัตเตอร์ต่ำ ใช้น้อย')
        }
        return items.join('\n')
    },
    target: (data) => '• ช่างภาพมือโปร\n• ผู้เริ่มต้นถ่ายภาพ',
    notes: (data) => {
        const items = [
            '• ทดสอบก่อนรับได้',
            '• รับประกันเครื่องใช้งานได้'
        ]
        return items.join('\n')
    }
}

// PETS TEMPLATE
const PETS_TEMPLATE: DescriptionTemplate = {
    intro: (data) => {
        const breed = data.userInputData?.breed || ''
        const age = data.userInputData?.pet_age || ''
        return `${breed}${age ? ` อายุ ${age}` : ''}`.trim() || data.title
    },
    features: (data) => {
        const items = []
        if (data.userInputData?.breed) items.push(`• สายพันธุ์: ${data.userInputData.breed}`)
        if (data.userInputData?.pet_age) items.push(`• อายุ: ${data.userInputData.pet_age}`)
        if (data.userInputData?.pet_gender) {
            const gender = data.userInputData.pet_gender === 'male' ? 'ตัวผู้' : 'ตัวเมีย'
            items.push(`• เพศ: ${gender}`)
        }
        return items.length > 0 ? items.join('\n') : '• กรุณาเพิ่มข้อมูลสัตว์เลี้ยง'
    },
    condition: (data) => {
        const items = ['• สุขภาพแข็งแรง']
        const vaccinated = data.userInputData?.vaccinated
        if (vaccinated === 'full') {
            items.push('• วัคซีนครบ')
        } else if (vaccinated === 'partial') {
            items.push('• ฉีดวัคซีนบางส่วนแล้ว')
        }
        if (data.userInputData?.microchip === 'yes') {
            items.push('• มีไมโครชิพ')
        }
        return items.join('\n')
    },
    target: (data) => '• ผู้รักสัตว์\n• มีเวลาดูแลสัตว์เลี้ยง',
    notes: (data) => {
        const items = [
            '• มีสมุดวัคซีนให้',
            '• แนะนำอาหารที่เหมาะสมให้',
            '• สอบถามเพิ่มเติมได้'
        ]
        return items.join('\n')
    }
}

// ========================================
// GET TEMPLATE BY CATEGORY
// ========================================
function getTemplateForCategory(categoryId: number): DescriptionTemplate {
    switch (categoryId) {
        case 1:
            return AUTOMOTIVE_TEMPLATE
        case 2:
            return REAL_ESTATE_TEMPLATE
        case 3:
            return MOBILE_TEMPLATE
        case 4:
            return COMPUTER_TEMPLATE
        case 5:
            return APPLIANCES_TEMPLATE
        case 6:
            return FASHION_TEMPLATE
        case 7:
            return GAMING_TEMPLATE
        case 8:
            return CAMERA_TEMPLATE
        case 9:
            return AMULET_TEMPLATE
        case 10:
            return PETS_TEMPLATE
        default:
            return DEFAULT_TEMPLATE
    }
}

// ========================================
// MAIN GENERATOR FUNCTION
// ========================================
export function generateProductDescription(input: ProductDescriptionInput): GeneratedDescription {
    const template = getTemplateForCategory(input.categoryId)
    const categorySections = CATEGORY_SECTIONS[input.categoryId] || {}

    // Build sections
    const sections: DescriptionSection[] = [
        // Intro
        {
            ...(categorySections.intro || COMMON_SECTIONS.intro),
            content: template.intro(input),
            isEditable: true
        },
        // Features
        {
            ...(categorySections.features || COMMON_SECTIONS.features),
            content: template.features(input),
            isEditable: true
        },
        // Condition
        {
            ...(categorySections.condition || COMMON_SECTIONS.condition),
            content: template.condition(input),
            isEditable: true
        },
        // Target
        {
            ...(categorySections.target || COMMON_SECTIONS.target),
            content: template.target(input),
            isEditable: true
        },
        // Notes
        {
            ...(categorySections.notes || COMMON_SECTIONS.notes),
            content: template.notes(input),
            isEditable: true
        }
    ].sort((a, b) => a.order - b.order)

    // Generate full text
    const fullText = sections
        .map(section => {
            if (section.showTitle) {
                return `${section.title_th}\n${section.content}`
            }
            return section.content
        })
        .join('\n\n')

    // Generate formatted HTML
    const formattedHtml = sections
        .map(section => {
            const contentHtml = section.content
                .split('\n')
                .map(line => `<p class="mb-1">${line}</p>`)
                .join('')

            if (section.showTitle) {
                return `
                    <div class="mb-4">
                        <h3 class="text-base font-semibold text-gray-800 mb-2">${section.title_th}</h3>
                        <div class="text-gray-600 text-sm leading-relaxed">${contentHtml}</div>
                    </div>
                `
            }
            return `<div class="mb-4 text-gray-700">${contentHtml}</div>`
        })
        .join('')

    return {
        sections,
        fullText,
        formattedHtml
    }
}

// ========================================
// AI-ENHANCED GENERATOR (PROMPT BUILDER)
// ========================================
export function buildAIDescriptionPrompt(input: ProductDescriptionInput): string {
    const lang = input.language || 'th'
    const isThai = lang === 'th'

    return `
${isThai ? 'คุณเป็นผู้เชี่ยวชาญในการเขียนรายละเอียดสินค้าสำหรับตลาดซื้อขายออนไลน์' : 'You are an expert in writing product descriptions for online marketplaces'}

${isThai ? 'สินค้า' : 'Product'}: ${input.title}
${isThai ? 'หมวดหมู่' : 'Category'}: ${input.categoryName_th || ''}
${isThai ? 'หมวดย่อย' : 'Subcategory'}: ${input.subcategoryName_th || ''}

${isThai ? 'ข้อมูลที่มี' : 'Available Data'}:
${JSON.stringify(input.userInputData || {}, null, 2)}

${isThai ? `
กรุณาเขียนรายละเอียดสินค้าตามโครงสร้างนี้:

1. **บทนำ** (1-2 บรรทัด)
   - สรุปสั้นๆ ว่าสินค้านี้คืออะไร

2. **📌 คุณสมบัติหลัก**
   - ใช้รูปแบบ bullet point
   - ระบุสเปก/คุณสมบัติสำคัญ

3. **✅ สภาพสินค้า**
   - อธิบายสภาพปัจจุบัน
   - ข้อบกพร่อง (ถ้ามี)

4. **👤 เหมาะสำหรับ**
   - ใครควรซื้อสินค้านี้

5. **📝 หมายเหตุ**
   - เงื่อนไขการขาย
   - การจัดส่ง

กฎสำคัญ:
- ใช้ภาษาสุภาพ ตรงไปตรงมา
- ห้ามใช้คำโฆษณาเกินจริง เช่น "ดีที่สุด", "คุ้มที่สุด"
- เว้นบรรทัดให้ชัดเจน
- ใช้ bullet point (•) 
- ห้ามเขียนเป็นย่อหน้ายาว
- เขียนเฉพาะข้อมูลที่มีให้เท่านั้น
` : `
Please write a product description following this structure:

1. **Introduction** (1-2 lines)
2. **📌 Key Features** (bullet points)
3. **✅ Condition**
4. **👤 Ideal For**
5. **📝 Notes**

Rules:
- Use polite, straightforward language
- No exaggerated claims
- Clear spacing between sections
- Use bullet points (•)
- Only include provided information
`}
`.trim()
}

// ========================================
// UTILITY: Parse sections from text
// ========================================
export function parseDescriptionSections(text: string): DescriptionSection[] {
    const sections: DescriptionSection[] = []
    const sectionPatterns = [
        { id: 'features', pattern: /📌|คุณสมบัติ|features/i, title_th: '📌 คุณสมบัติหลัก', title_en: '📌 Key Features' },
        { id: 'condition', pattern: /✅|สภาพ|condition/i, title_th: '✅ สภาพสินค้า', title_en: '✅ Condition' },
        { id: 'target', pattern: /👤|เหมาะ|ideal|suitable/i, title_th: '👤 เหมาะสำหรับ', title_en: '👤 Ideal For' },
        { id: 'notes', pattern: /📝|หมายเหตุ|notes/i, title_th: '📝 หมายเหตุ', title_en: '📝 Notes' }
    ]

    // Split by double newline
    const paragraphs = text.split(/\n\n+/)
    let currentOrder = 1

    for (const paragraph of paragraphs) {
        const trimmed = paragraph.trim()
        if (!trimmed) continue

        let sectionType = 'intro'
        let showTitle = false

        for (const sp of sectionPatterns) {
            if (sp.pattern.test(trimmed)) {
                sectionType = sp.id
                showTitle = true
                break
            }
        }

        sections.push({
            id: sectionType,
            title_th: sectionPatterns.find(p => p.id === sectionType)?.title_th || '',
            title_en: sectionPatterns.find(p => p.id === sectionType)?.title_en || '',
            icon: '',
            content: trimmed,
            isEditable: true,
            showTitle,
            order: currentOrder++
        })
    }

    return sections
}

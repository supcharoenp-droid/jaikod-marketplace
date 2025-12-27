/**
 * AI Spec Validator - Phase 2 of Anti-Hallucination System
 * 
 * ตรวจสอบความถูกต้องของ spec ที่ AI สร้างขึ้น
 * เพื่อป้องกันการ "เดา" หรือ "Hallucinate" ข้อมูลที่ไม่ถูกต้อง
 */

export interface ValidationResult {
    isValid: boolean
    field: string
    originalValue: string
    correctedValue?: string
    confidence: 'high' | 'medium' | 'low'
    reason: string
}

export interface SpecValidationReport {
    title: string
    validations: ValidationResult[]
    overallConfidence: number // 0-100
    warnings: string[]
    suggestedFixes: string[]
}

// ===============================================
// CPU VALIDATION
// ===============================================

interface CPUInfo {
    brand: 'intel' | 'amd' | 'apple' | 'unknown'
    series: string
    generation: number | null
    model: string
}

const INTEL_GENERATION_PATTERNS: Record<string, number> = {
    // 10th Gen (10xxx or 10xxG)
    '10': 10,
    // 11th Gen (11xxx or 11xxG)
    '11': 11,
    // 12th Gen (12xxx)
    '12': 12,
    // 13th Gen (13xxx)
    '13': 13,
    // 14th Gen (14xxx)
    '14': 14,
}

const AMD_RYZEN_GENERATION_PATTERNS: Record<string, number> = {
    '1': 1, // Ryzen 1xxx = 1st Gen
    '2': 2, // Ryzen 2xxx = 2nd Gen
    '3': 3, // Ryzen 3xxx = 3rd Gen
    '5': 4, // Ryzen 5xxx = 4th Gen (Zen 3)
    '7': 5, // Ryzen 7xxx = 5th Gen (Zen 4)
}

export function parseCPUInfo(cpuString: string): CPUInfo {
    const lower = cpuString.toLowerCase()

    // Intel Core detection
    if (lower.includes('intel') || lower.includes('core i')) {
        const intelMatch = cpuString.match(/(?:core\s*)?i([3579])[- ]?(\d{4,5})/i)
        if (intelMatch) {
            const series = `i${intelMatch[1]}`
            const modelNum = intelMatch[2]
            const genPrefix = modelNum.substring(0, 2)
            const generation = INTEL_GENERATION_PATTERNS[genPrefix] ||
                (modelNum.length === 4 ? parseInt(modelNum[0]) : null)

            return {
                brand: 'intel',
                series,
                generation,
                model: `Core ${series}-${modelNum}`
            }
        }

        // Legacy pattern (e.g., "10th Gen Core i5")
        const legacyMatch = cpuString.match(/(\d+)(?:th|nd|rd|st)\s*gen(?:eration)?\s*(?:core\s*)?i([3579])/i)
        if (legacyMatch) {
            return {
                brand: 'intel',
                series: `i${legacyMatch[2]}`,
                generation: parseInt(legacyMatch[1]),
                model: `${legacyMatch[1]}th Gen Core i${legacyMatch[2]}`
            }
        }
    }

    // AMD Ryzen detection
    if (lower.includes('amd') || lower.includes('ryzen')) {
        const ryzenMatch = cpuString.match(/ryzen\s*([3579])\s*(\d{4})/i)
        if (ryzenMatch) {
            const series = `Ryzen ${ryzenMatch[1]}`
            const modelNum = ryzenMatch[2]
            const genIndicator = modelNum[0]

            return {
                brand: 'amd',
                series,
                generation: AMD_RYZEN_GENERATION_PATTERNS[genIndicator] || null,
                model: `${series} ${modelNum}`
            }
        }
    }

    // Apple Silicon detection
    if (lower.includes('apple') || lower.includes('m1') || lower.includes('m2') || lower.includes('m3') || lower.includes('m4')) {
        const appleMatch = cpuString.match(/m([1234])(?:\s*(pro|max|ultra))?/i)
        if (appleMatch) {
            const chipNum = appleMatch[1]
            const variant = appleMatch[2]?.toUpperCase() || ''
            return {
                brand: 'apple',
                series: `M${chipNum}`,
                generation: parseInt(chipNum),
                model: `Apple M${chipNum}${variant ? ' ' + variant : ''}`
            }
        }
    }

    return {
        brand: 'unknown',
        series: '',
        generation: null,
        model: cpuString
    }
}

export function validateCPU(cpuString: string, claimedGeneration?: number): ValidationResult {
    const cpuInfo = parseCPUInfo(cpuString)

    // ตรวจสอบ generation ที่อ้างว่าเป็น
    if (claimedGeneration && cpuInfo.generation && claimedGeneration !== cpuInfo.generation) {
        return {
            isValid: false,
            field: 'cpu_generation',
            originalValue: `${cpuString} (Gen ${claimedGeneration})`,
            correctedValue: `${cpuInfo.model} (Gen ${cpuInfo.generation})`,
            confidence: 'high',
            reason: `CPU generation mismatch: AI claimed Gen ${claimedGeneration}, but model number indicates Gen ${cpuInfo.generation}`
        }
    }

    return {
        isValid: true,
        field: 'cpu',
        originalValue: cpuString,
        confidence: cpuInfo.brand !== 'unknown' ? 'high' : 'low',
        reason: cpuInfo.brand !== 'unknown'
            ? `Valid ${cpuInfo.brand.toUpperCase()} CPU detected`
            : 'Could not identify CPU brand/model'
    }
}

// ===============================================
// RAM VALIDATION
// ===============================================

const VALID_RAM_SIZES = [2, 4, 6, 8, 12, 16, 24, 32, 48, 64, 128, 256] // GB

export function validateRAM(ramString: string): ValidationResult {
    // Extract RAM size from string
    const match = ramString.match(/(\d+)\s*(?:gb|g)/i)

    if (!match) {
        return {
            isValid: false,
            field: 'ram',
            originalValue: ramString,
            confidence: 'low',
            reason: 'Could not parse RAM size from string'
        }
    }

    const ramSize = parseInt(match[1])

    if (!VALID_RAM_SIZES.includes(ramSize)) {
        // Find nearest valid size
        const nearest = VALID_RAM_SIZES.reduce((prev, curr) =>
            Math.abs(curr - ramSize) < Math.abs(prev - ramSize) ? curr : prev
        )

        return {
            isValid: false,
            field: 'ram',
            originalValue: `${ramSize}GB`,
            correctedValue: `${nearest}GB`,
            confidence: 'medium',
            reason: `Unusual RAM size ${ramSize}GB - standard sizes are ${VALID_RAM_SIZES.join(', ')}GB`
        }
    }

    return {
        isValid: true,
        field: 'ram',
        originalValue: `${ramSize}GB`,
        confidence: 'high',
        reason: `Valid RAM size: ${ramSize}GB`
    }
}

// ===============================================
// STORAGE VALIDATION
// ===============================================

const VALID_SSD_SIZES = [64, 128, 256, 512, 1024, 2048, 4096] // GB (1024 = 1TB)
const VALID_HDD_SIZES = [320, 500, 750, 1000, 2000, 4000, 6000, 8000] // GB

export function validateStorage(storageString: string): ValidationResult {
    const lower = storageString.toLowerCase()

    // Extract size and type
    let sizeGB: number
    const tbMatch = storageString.match(/(\d+(?:\.\d+)?)\s*tb/i)
    const gbMatch = storageString.match(/(\d+)\s*gb/i)

    if (tbMatch) {
        sizeGB = parseFloat(tbMatch[1]) * 1024
    } else if (gbMatch) {
        sizeGB = parseInt(gbMatch[1])
    } else {
        return {
            isValid: false,
            field: 'storage',
            originalValue: storageString,
            confidence: 'low',
            reason: 'Could not parse storage size'
        }
    }

    // Determine if SSD or HDD
    const isSSD = lower.includes('ssd') || lower.includes('nvme') || lower.includes('m.2')
    const isHDD = lower.includes('hdd') || lower.includes('hard')

    const validSizes = isSSD ? VALID_SSD_SIZES : (isHDD ? VALID_HDD_SIZES : [...VALID_SSD_SIZES, ...VALID_HDD_SIZES])

    // Check if size is near a valid size (within 10%)
    const isNearValid = validSizes.some(valid =>
        Math.abs(sizeGB - valid) / valid < 0.1
    )

    if (!isNearValid) {
        const nearest = validSizes.reduce((prev, curr) =>
            Math.abs(curr - sizeGB) < Math.abs(prev - sizeGB) ? curr : prev
        )

        const nearestStr = nearest >= 1024 ? `${nearest / 1024}TB` : `${nearest}GB`

        return {
            isValid: false,
            field: 'storage',
            originalValue: storageString,
            correctedValue: `${nearestStr} ${isSSD ? 'SSD' : isHDD ? 'HDD' : 'Storage'}`,
            confidence: 'medium',
            reason: `Unusual storage size - nearest standard is ${nearestStr}`
        }
    }

    return {
        isValid: true,
        field: 'storage',
        originalValue: storageString,
        confidence: 'high',
        reason: 'Valid storage size'
    }
}

// ===============================================
// SCREEN SIZE VALIDATION
// ===============================================

interface ScreenValidationConfig {
    minInches: number
    maxInches: number
    commonSizes: number[]
}

const SCREEN_CONFIGS: Record<string, ScreenValidationConfig> = {
    'laptop': {
        minInches: 10,
        maxInches: 18,
        commonSizes: [11.6, 13.3, 14, 15.6, 16, 17, 17.3]
    },
    'phone': {
        minInches: 4,
        maxInches: 7.5,
        commonSizes: [5.5, 5.8, 6.1, 6.4, 6.5, 6.7, 6.8]
    },
    'tablet': {
        minInches: 7,
        maxInches: 13,
        commonSizes: [7.9, 8.3, 10.2, 10.9, 11, 12.9]
    },
    'monitor': {
        minInches: 19,
        maxInches: 55,
        commonSizes: [21.5, 24, 27, 32, 34, 43, 49]
    },
    'tv': {
        minInches: 32,
        maxInches: 100,
        commonSizes: [32, 40, 43, 50, 55, 65, 75, 85, 98]
    }
}

export function validateScreenSize(sizeString: string, deviceType: keyof typeof SCREEN_CONFIGS): ValidationResult {
    const match = sizeString.match(/(\d+(?:\.\d+)?)\s*(?:นิ้ว|inch|")?/i)

    if (!match) {
        return {
            isValid: false,
            field: 'screen_size',
            originalValue: sizeString,
            confidence: 'low',
            reason: 'Could not parse screen size'
        }
    }

    const sizeInches = parseFloat(match[1])
    const config = SCREEN_CONFIGS[deviceType]

    // Check if within valid range
    if (sizeInches < config.minInches || sizeInches > config.maxInches) {
        return {
            isValid: false,
            field: 'screen_size',
            originalValue: `${sizeInches}"`,
            confidence: 'high',
            reason: `Screen size ${sizeInches}" is outside normal range for ${deviceType} (${config.minInches}"-${config.maxInches}")`
        }
    }

    // Check if it's a common size
    const isCommon = config.commonSizes.some(common =>
        Math.abs(sizeInches - common) < 0.3
    )

    return {
        isValid: true,
        field: 'screen_size',
        originalValue: `${sizeInches}"`,
        confidence: isCommon ? 'high' : 'medium',
        reason: isCommon
            ? `Valid ${deviceType} screen size`
            : `Unusual ${deviceType} screen size (but within valid range)`
    }
}

// ===============================================
// PRICE VALIDATION
// ===============================================

interface PriceRange {
    min: number
    max: number
}

const PRICE_RANGES: Record<number, PriceRange> = {
    // Computers & IT
    401: { min: 8000, max: 200000 },   // Laptops
    402: { min: 5000, max: 300000 },   // Desktops
    403: { min: 2000, max: 80000 },    // Monitors
    407: { min: 20000, max: 500000 },  // Gaming PCs

    // Mobile
    301: { min: 1000, max: 80000 },    // Mobile Phones
    302: { min: 3000, max: 60000 },    // Tablets
    303: { min: 1000, max: 30000 },    // Wearables

    // Appliances
    501: { min: 8000, max: 60000 },    // Air Conditioners
    502: { min: 3000, max: 80000 },    // Refrigerators
    504: { min: 3000, max: 150000 },   // TVs

    // Gaming
    701: { min: 5000, max: 30000 },    // Game Consoles
    702: { min: 200, max: 3500 },      // Video Games

    // Camera
    801: { min: 5000, max: 300000 },   // Digital Cameras
    803: { min: 2000, max: 200000 },   // Lenses
}

export function validatePrice(price: number, subcategoryId: number): ValidationResult {
    const range = PRICE_RANGES[subcategoryId]

    if (!range) {
        return {
            isValid: true,
            field: 'price',
            originalValue: `฿${price.toLocaleString()}`,
            confidence: 'low',
            reason: 'No price range defined for this category'
        }
    }

    if (price < range.min) {
        return {
            isValid: false,
            field: 'price',
            originalValue: `฿${price.toLocaleString()}`,
            confidence: 'medium',
            reason: `Price seems too low for this category (minimum expected: ฿${range.min.toLocaleString()})`
        }
    }

    if (price > range.max) {
        return {
            isValid: false,
            field: 'price',
            originalValue: `฿${price.toLocaleString()}`,
            confidence: 'medium',
            reason: `Price seems too high for this category (maximum expected: ฿${range.max.toLocaleString()})`
        }
    }

    return {
        isValid: true,
        field: 'price',
        originalValue: `฿${price.toLocaleString()}`,
        confidence: 'high',
        reason: 'Price is within expected range'
    }
}

// ===============================================
// TITLE VALIDATION (Check for Hallucination Patterns)
// ===============================================

const HALLUCINATION_PATTERNS = [
    // Placeholder patterns (AI filling in blanks)
    /\(ไม่ระบุ\)/gi,
    /\[ไม่ระบุ\]/gi,
    /ไม่ระบุรุ่น/gi,
    /รุ่นไม่ระบุ/gi,
    /\(unspecified\)/gi,
    /\(unknown\)/gi,

    // Incomplete specs
    /ram\s*\?+\s*gb/gi,
    /ssd\s*\?+\s*gb/gi,
    /\d+\?+gb/gi,

    // Contradictory specs (e.g., "128GB/256GB")
    /(\d+)\s*gb\s*\/\s*(\d+)\s*gb/gi,

    // Uncertain language
    /อาจจะเป็น/gi,
    /น่าจะเป็น/gi,
    /probably\s+/gi,
    /maybe\s+/gi,
    /approximately\s+/gi,
]

export function validateTitle(title: string): ValidationResult {
    const issues: string[] = []

    for (const pattern of HALLUCINATION_PATTERNS) {
        if (pattern.test(title)) {
            issues.push(`Found hallucination pattern: ${pattern.source}`)
            pattern.lastIndex = 0 // Reset regex
        }
    }

    if (issues.length > 0) {
        return {
            isValid: false,
            field: 'title',
            originalValue: title,
            confidence: 'high',
            reason: `Title contains ${issues.length} potential hallucination pattern(s): ${issues.join(', ')}`
        }
    }

    // Check for reasonable title length
    if (title.length < 10) {
        return {
            isValid: false,
            field: 'title',
            originalValue: title,
            confidence: 'medium',
            reason: 'Title is too short'
        }
    }

    if (title.length > 200) {
        return {
            isValid: false,
            field: 'title',
            originalValue: title.substring(0, 100) + '...',
            confidence: 'medium',
            reason: 'Title is too long'
        }
    }

    return {
        isValid: true,
        field: 'title',
        originalValue: title,
        confidence: 'high',
        reason: 'Title appears valid'
    }
}

// ===============================================
// MAIN VALIDATION FUNCTION
// ===============================================

export interface AIGeneratedSpec {
    title: string
    description?: string
    suggestedPrice?: number
    subcategoryId?: number
    specs?: {
        cpu?: string
        cpuGeneration?: number
        ram?: string
        storage?: string
        screenSize?: string
        deviceType?: 'laptop' | 'phone' | 'tablet' | 'monitor' | 'tv'
    }
}

export function validateAIGeneratedSpec(spec: AIGeneratedSpec): SpecValidationReport {
    const validations: ValidationResult[] = []
    const warnings: string[] = []
    const suggestedFixes: string[] = []

    // Validate title
    validations.push(validateTitle(spec.title))

    // Validate CPU if present
    if (spec.specs?.cpu) {
        const cpuValidation = validateCPU(spec.specs.cpu, spec.specs.cpuGeneration)
        validations.push(cpuValidation)

        if (!cpuValidation.isValid && cpuValidation.correctedValue) {
            suggestedFixes.push(`Change CPU to: ${cpuValidation.correctedValue}`)
        }
    }

    // Validate RAM if present
    if (spec.specs?.ram) {
        const ramValidation = validateRAM(spec.specs.ram)
        validations.push(ramValidation)

        if (!ramValidation.isValid && ramValidation.correctedValue) {
            suggestedFixes.push(`Change RAM to: ${ramValidation.correctedValue}`)
        }
    }

    // Validate Storage if present
    if (spec.specs?.storage) {
        const storageValidation = validateStorage(spec.specs.storage)
        validations.push(storageValidation)

        if (!storageValidation.isValid && storageValidation.correctedValue) {
            suggestedFixes.push(`Change Storage to: ${storageValidation.correctedValue}`)
        }
    }

    // Validate Screen Size if present
    if (spec.specs?.screenSize && spec.specs?.deviceType) {
        const screenValidation = validateScreenSize(spec.specs.screenSize, spec.specs.deviceType)
        validations.push(screenValidation)
    }

    // Validate Price if present
    if (spec.suggestedPrice && spec.subcategoryId) {
        const priceValidation = validatePrice(spec.suggestedPrice, spec.subcategoryId)
        validations.push(priceValidation)

        if (!priceValidation.isValid) {
            warnings.push(priceValidation.reason)
        }
    }

    // Calculate overall confidence
    const validCount = validations.filter(v => v.isValid).length
    const highConfidenceCount = validations.filter(v => v.confidence === 'high').length
    const overallConfidence = Math.round(
        (validCount / validations.length * 50) +
        (highConfidenceCount / validations.length * 50)
    )

    return {
        title: spec.title,
        validations,
        overallConfidence,
        warnings,
        suggestedFixes
    }
}

// ===============================================
// EXTRACT SPECS FROM TITLE
// ===============================================

export function extractSpecsFromTitle(title: string): Partial<AIGeneratedSpec['specs']> {
    const specs: Partial<AIGeneratedSpec['specs']> = {}

    // Extract CPU
    const cpuMatch = title.match(/(?:intel\s*)?(?:core\s*)?i([3579])[- ]?(\d{4,5})|ryzen\s*([3579])\s*(\d{4})|m([1234])(?:\s*(pro|max|ultra))?/i)
    if (cpuMatch) {
        specs.cpu = cpuMatch[0]
        const cpuInfo = parseCPUInfo(cpuMatch[0])
        if (cpuInfo.generation) {
            specs.cpuGeneration = cpuInfo.generation
        }
    }

    // Extract RAM
    const ramMatch = title.match(/(\d+)\s*gb\s*(?:ram|ddr)/i) || title.match(/ram\s*(\d+)\s*(?:gb|g)/i)
    if (ramMatch) {
        specs.ram = `${ramMatch[1]}GB`
    }

    // Extract Storage
    const storageMatch = title.match(/(\d+)\s*(?:gb|tb)\s*(?:ssd|nvme|hdd)/i) ||
        title.match(/(?:ssd|nvme|hdd)\s*(\d+)\s*(?:gb|tb)/i)
    if (storageMatch) {
        specs.storage = storageMatch[0]
    }

    // Extract Screen Size
    const screenMatch = title.match(/(\d+(?:\.\d+)?)\s*(?:นิ้ว|inch|")/i)
    if (screenMatch) {
        specs.screenSize = screenMatch[0]
    }

    // Determine device type from keywords
    const lower = title.toLowerCase()
    if (lower.includes('laptop') || lower.includes('โน้ตบุ๊ค') || lower.includes('notebook')) {
        specs.deviceType = 'laptop'
    } else if (lower.includes('phone') || lower.includes('มือถือ') || lower.includes('iphone') || lower.includes('galaxy')) {
        specs.deviceType = 'phone'
    } else if (lower.includes('tablet') || lower.includes('แท็บเล็ต') || lower.includes('ipad')) {
        specs.deviceType = 'tablet'
    } else if (lower.includes('monitor') || lower.includes('จอคอม') || lower.includes('มอนิเตอร์')) {
        specs.deviceType = 'monitor'
    } else if (lower.includes('tv') || lower.includes('ทีวี') || lower.includes('โทรทัศน์')) {
        specs.deviceType = 'tv'
    }

    return specs
}

// ===============================================
// QUICK VALIDATION HELPER
// ===============================================

export function quickValidateTitle(title: string, subcategoryId?: number, price?: number): {
    isValid: boolean
    confidence: number
    issues: string[]
} {
    const specs = extractSpecsFromTitle(title)

    const report = validateAIGeneratedSpec({
        title,
        subcategoryId,
        suggestedPrice: price,
        specs
    })

    const issues = report.validations
        .filter(v => !v.isValid)
        .map(v => v.reason)

    return {
        isValid: report.overallConfidence >= 70,
        confidence: report.overallConfidence,
        issues
    }
}

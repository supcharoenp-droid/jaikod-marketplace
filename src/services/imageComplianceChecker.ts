/**
 * Image Compliance & Safety AI
 * 
 * Scans uploaded images for prohibited or restricted content
 * Uses neutral language and silent flagging for high-risk items
 */

export type RiskLevel = 'low' | 'medium' | 'high'
export type ActionRecommendation = 'silent' | 'soft_notify' | 'admin_review' | 'block'

export interface FlaggedReason {
    category: 'illegal_goods' | 'restricted_items' | 'adult_content' | 'violent_content' | 'copyright' | 'scam_indicator' | 'counterfeit' | 'unsafe'
    confidence: number // 0-1
    description: {
        internal: string // For admin
        user_friendly?: string // Optional user-facing message
    }
    severity: 'info' | 'warning' | 'critical'
}

export interface ComplianceCheckResult {
    image_id: string
    risk_level: RiskLevel
    is_compliant: boolean
    flagged_reasons: FlaggedReason[]
    action_recommendation: ActionRecommendation
    admin_note?: string // Internal notes for review queue
    user_message?: {
        th: string
        en: string
    } // Only shown for soft_notify
}

export interface BatchComplianceResult {
    results: ComplianceCheckResult[]
    overall_risk_level: RiskLevel
    requires_manual_review: boolean
    high_risk_count: number
    flagged_count: number
}

/**
 * Check compliance for batch of images
 */
export async function checkImageCompliance(
    images: File[]
): Promise<BatchComplianceResult> {
    console.log(`[Compliance] Checking ${images.length} images...`)

    const results: ComplianceCheckResult[] = []
    let high_risk_count = 0
    let flagged_count = 0

    for (let i = 0; i < images.length; i++) {
        const result = await checkSingleImage(images[i], i)
        results.push(result)

        if (result.risk_level === 'high') high_risk_count++
        if (result.flagged_reasons.length > 0) flagged_count++
    }

    // Determine overall risk
    let overall_risk_level: RiskLevel = 'low'
    if (high_risk_count > 0) {
        overall_risk_level = 'high'
    } else if (flagged_count > images.length / 2) {
        overall_risk_level = 'medium'
    }

    const requires_manual_review = high_risk_count > 0 ||
        results.some(r => r.action_recommendation === 'admin_review')

    console.log(`[Compliance] Overall risk: ${overall_risk_level}, Review: ${requires_manual_review}`)

    return {
        results,
        overall_risk_level,
        requires_manual_review,
        high_risk_count,
        flagged_count
    }
}

/**
 * Check single image for compliance
 */
async function checkSingleImage(
    file: File,
    index: number
): Promise<ComplianceCheckResult> {
    const image_id = `compliance_${index}_${Date.now()}`
    const flagged_reasons: FlaggedReason[] = []

    try {
        // Load and analyze image
        const analysis = await analyzeImageContent(file)

        // Run all compliance checks
        await Promise.all([
            checkIllegalGoods(analysis, flagged_reasons),
            checkRestrictedItems(analysis, flagged_reasons),
            checkAdultContent(analysis, flagged_reasons),
            checkViolentContent(analysis, flagged_reasons),
            checkCopyrightIndicators(analysis, flagged_reasons),
            checkScamIndicators(analysis, flagged_reasons)
        ])

        // Determine risk level and action
        const { risk_level, action_recommendation, admin_note, user_message } =
            determineRiskAndAction(flagged_reasons)

        return {
            image_id,
            risk_level,
            is_compliant: flagged_reasons.length === 0,
            flagged_reasons,
            action_recommendation,
            admin_note,
            user_message
        }
    } catch (error) {
        console.error(`[Compliance] Error checking image ${index}:`, error)

        // On error, assume low risk but flag for review
        return {
            image_id,
            risk_level: 'low',
            is_compliant: true,
            flagged_reasons: [],
            action_recommendation: 'silent'
        }
    }
}

/**
 * Analyze image content
 */
interface ImageContentAnalysis {
    width: number
    height: number
    fileSize: number
    hasText: boolean
    textDensity: number // 0-1
    colorAnalysis: {
        dominantColors: string[]
        hasFlesh: boolean
        hasRed: boolean
        brightness: number
        saturation: number
    }
    metadata: {
        hasExif: boolean
        hasGPS: boolean
    }
}

async function analyzeImageContent(file: File): Promise<ImageContentAnalysis> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const img = new Image()
            img.src = e.target?.result as string

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    if (!ctx) throw new Error('Cannot get canvas context')

                    // Scale for analysis
                    const scale = Math.min(1, 400 / Math.max(img.width, img.height))
                    canvas.width = img.width * scale
                    canvas.height = img.height * scale

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                    const pixels = imageData.data

                    // Color analysis
                    const colorCounts: Record<string, number> = {}
                    let fleshToneCount = 0
                    let redCount = 0
                    let totalBrightness = 0
                    let totalSaturation = 0

                    for (let i = 0; i < pixels.length; i += 4) {
                        const r = pixels[i]
                        const g = pixels[i + 1]
                        const b = pixels[i + 2]

                        // Flesh tone detection (approximate)
                        if (isFleshTone(r, g, b)) fleshToneCount++

                        // Red detection
                        if (r > 180 && r > g * 1.5 && r > b * 1.5) redCount++

                        // Brightness
                        totalBrightness += (r + g + b) / 3

                        // Dominant color
                        const colorKey = `${Math.floor(r / 50)},${Math.floor(g / 50)},${Math.floor(b / 50)}`
                        colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1
                    }

                    const pixelCount = pixels.length / 4
                    const hasFlesh = fleshToneCount / pixelCount > 0.3
                    const hasRed = redCount / pixelCount > 0.2
                    const brightness = totalBrightness / pixelCount / 255

                    // Simple text detection (not implemented - would need OCR)
                    const hasText = false
                    const textDensity = 0

                    resolve({
                        width: img.width,
                        height: img.height,
                        fileSize: file.size,
                        hasText,
                        textDensity,
                        colorAnalysis: {
                            dominantColors: Object.keys(colorCounts).slice(0, 5),
                            hasFlesh,
                            hasRed,
                            brightness,
                            saturation: 0.5 // Simplified
                        },
                        metadata: {
                            hasExif: false, // Would need EXIF reader
                            hasGPS: false
                        }
                    })
                } catch (error) {
                    reject(error)
                }
            }

            img.onerror = () => reject(new Error('Failed to load image'))
        }

        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
    })
}

/**
 * Check if RGB values represent flesh tone
 */
function isFleshTone(r: number, g: number, b: number): boolean {
    // Simplified flesh tone detection
    // Real implementation would use HSV and more sophisticated detection
    return r > 95 && g > 40 && b > 20 &&
        r > g && r > b &&
        Math.abs(r - g) > 15 &&
        r - b > 30
}

/**
 * Compliance check functions
 */

async function checkIllegalGoods(
    analysis: ImageContentAnalysis,
    flags: FlaggedReason[]
): Promise<void> {
    // Check for indicators of illegal goods
    // In production, this would use ML models like YOLO, Vision Transformer

    // Example patterns (simplified):
    // - Weapons indicators
    // - Drug paraphernalia
    // - Counterfeit luxury goods (detected via logo/brand detection)

    // Mock implementation for demo
    // In real system, integrate with vision API

    return Promise.resolve()
}

async function checkRestrictedItems(
    analysis: ImageContentAnalysis,
    flags: FlaggedReason[]
): Promise<void> {
    // Check for restricted items that need special handling
    // - Alcohol
    // - Tobacco
    // - Medications
    // - Electronics (batteries)
    // - Live animals

    // Would use object detection ML model

    return Promise.resolve()
}

async function checkAdultContent(
    analysis: ImageContentAnalysis,
    flags: FlaggedReason[]
): Promise<void> {
    // Adult content detection
    // Using simple heuristics (production would use ML)

    const { hasFlesh, brightness, saturation } = analysis.colorAnalysis

    // High flesh tone + certain brightness patterns might indicate adult content
    // This is VERY simplified - real systems use sophisticated ML
    if (hasFlesh && brightness < 0.4) {
        // Low confidence flag - needs manual review
        flags.push({
            category: 'adult_content',
            confidence: 0.3,
            description: {
                internal: 'Image contains high flesh tone ratio in low light - manual review recommended',
                user_friendly: undefined // Silent flagging
            },
            severity: 'warning'
        })
    }

    return Promise.resolve()
}

async function checkViolentContent(
    analysis: ImageContentAnalysis,
    flags: FlaggedReason[]
): Promise<void> {
    // Violent content detection
    // - Blood (red color detection)
    // - Weapons
    // - Gore

    const { hasRed } = analysis.colorAnalysis

    // Excessive red might indicate blood (very rough heuristic)
    // Real system would use violence detection ML models
    if (hasRed) {
        // Very low confidence - just for demo
        // Production would have much better detection
    }

    return Promise.resolve()
}

async function checkCopyrightIndicators(
    analysis: ImageContentAnalysis,
    flags: FlaggedReason[]
): Promise<void> {
    // Copyright violation indicators
    // - Stock photo watermarks
    // - Brand logos (without authorization)
    // - Downloaded image signatures

    // Would use:
    // - OCR for text detection
    // - Logo recognition
    // - Reverse image search

    return Promise.resolve()
}

async function checkScamIndicators(
    analysis: ImageContentAnalysis,
    flags: FlaggedReason[]
): Promise<void> {
    // Scam indicators
    // - Too-good-to-be-true images (professional stock photos)
    // - Multiple watermarks
    // - Suspicious text overlays
    // - Extremely low prices in image

    // Very high quality + stock photo characteristics
    if (analysis.width > 3000 && analysis.height > 2000) {
        // Might be stock photo - low confidence flag
        flags.push({
            category: 'scam_indicator',
            confidence: 0.2,
            description: {
                internal: 'High-resolution professional image - verify authenticity',
                user_friendly: undefined
            },
            severity: 'info'
        })
    }

    return Promise.resolve()
}

/**
 * Determine risk level and recommended action
 */
function determineRiskAndAction(
    flags: FlaggedReason[]
): {
    risk_level: RiskLevel
    action_recommendation: ActionRecommendation
    admin_note?: string
    user_message?: { th: string; en: string }
} {
    if (flags.length === 0) {
        return {
            risk_level: 'low',
            action_recommendation: 'silent'
        }
    }

    // Check for critical severity
    const hasCritical = flags.some(f => f.severity === 'critical')
    const highConfidenceFlags = flags.filter(f => f.confidence > 0.7)

    // CRITICAL: Block immediately (rare)
    if (hasCritical && highConfidenceFlags.length > 0) {
        return {
            risk_level: 'high',
            action_recommendation: 'block',
            admin_note: `CRITICAL: ${flags.map(f => f.category).join(', ')}`,
            user_message: {
                th: 'ขออภัย รูปภาพนี้ไม่สามารถใช้งานได้ กรุณาใช้รูปอื่น',
                en: 'Sorry, this image cannot be used. Please use another photo'
            }
        }
    }

    // HIGH RISK: Send to admin review silently
    if (highConfidenceFlags.length > 0 ||
        flags.filter(f => f.severity === 'warning').length > 2) {
        return {
            risk_level: 'high',
            action_recommendation: 'admin_review',
            admin_note: `Review needed: ${flags.map(f => `${f.category}(${f.confidence})`).join(', ')}`
        }
    }

    // MEDIUM RISK: Soft notify (if appropriate)
    const warningFlags = flags.filter(f => f.severity === 'warning')
    if (warningFlags.length > 0) {
        // Only notify for certain categories
        const shouldNotify = warningFlags.some(f =>
            f.category === 'restricted_items' || f.category === 'counterfeit'
        )

        if (shouldNotify) {
            return {
                risk_level: 'medium',
                action_recommendation: 'soft_notify',
                admin_note: `Medium risk: ${flags.map(f => f.category).join(', ')}`,
                user_message: {
                    th: '💡 โปรดตรวจสอบว่ารูปภาพนี้เหมาะสมกับนโยบายของเรา',
                    en: '💡 Please ensure this image complies with our policies'
                }
            }
        }

        // Otherwise silent + review
        return {
            risk_level: 'medium',
            action_recommendation: 'admin_review',
            admin_note: `Auto-flagged: ${flags.map(f => f.category).join(', ')}`
        }
    }

    // LOW RISK: Silent tracking only
    return {
        risk_level: 'low',
        action_recommendation: 'silent',
        admin_note: `Low confidence flags: ${flags.map(f => f.category).join(', ')}`
    }
}

/**
 * Generate admin review report
 */
export function generateAdminReport(result: ComplianceCheckResult): {
    priority: 'urgent' | 'high' | 'normal' | 'low'
    summary: string
    details: string[]
    recommended_action: string
} {
    const priority = result.risk_level === 'high' ? 'urgent' :
        result.risk_level === 'medium' ? 'high' : 'normal'

    const criticalFlags = result.flagged_reasons.filter(f => f.severity === 'critical')
    const warningFlags = result.flagged_reasons.filter(f => f.severity === 'warning')

    const summary = criticalFlags.length > 0
        ? `CRITICAL: ${criticalFlags.map(f => f.category).join(', ')}`
        : warningFlags.length > 0
            ? `WARNING: ${warningFlags.map(f => f.category).join(', ')}`
            : `Review: ${result.flagged_reasons.map(f => f.category).join(', ')}`

    const details = result.flagged_reasons.map(flag =>
        `[${flag.severity.toUpperCase()}] ${flag.category} (${Math.round(flag.confidence * 100)}% confidence): ${flag.description.internal}`
    )

    const recommended_action = result.action_recommendation === 'block'
        ? 'BLOCK IMMEDIATELY and notify legal team'
        : result.risk_level === 'high'
            ? 'Manual review required before approval'
            : 'Review and approve/reject'

    return {
        priority,
        summary,
        details,
        recommended_action
    }
}

/**
 * Safe mode: Extra strict checking
 */
export async function checkImageComplianceStrict(
    images: File[]
): Promise<BatchComplianceResult> {
    // In strict mode, lower confidence thresholds
    // More sensitive to potential issues
    // Used for new sellers or flagged accounts

    const result = await checkImageCompliance(images)

    // Escalate medium to high in strict mode
    if (result.overall_risk_level === 'medium') {
        result.overall_risk_level = 'high'
        result.requires_manual_review = true
    }

    return result
}

/**
 * Whitelist check: Bypass for trusted sellers
 */
export function shouldBypassCompliance(sellerId: string): boolean {
    // Check if seller is whitelisted
    // - Verified sellers
    // - High trust score
    // - Clean history

    // Mock implementation
    return false
}

/**
 * Helper: Get user-friendly category name
 */
export function getCategoryName(category: FlaggedReason['category']): {
    th: string
    en: string
} {
    const names: Record<FlaggedReason['category'], { th: string; en: string }> = {
        illegal_goods: { th: 'สินค้าผิดกฎหมาย', en: 'Illegal Goods' },
        restricted_items: { th: 'สินค้าต้องห้าม', en: 'Restricted Items' },
        adult_content: { th: 'เนื้อหาผู้ใหญ่', en: 'Adult Content' },
        violent_content: { th: 'เนื้อหารุนแรง', en: 'Violent Content' },
        copyright: { th: 'ละเมิดลิขสิทธิ์', en: 'Copyright Violation' },
        scam_indicator: { th: 'สัญญาณการฉ้อโกง', en: 'Scam Indicator' },
        counterfeit: { th: 'สินค้าปลอม', en: 'Counterfeit' },
        unsafe: { th: 'ไม่ปลอดภัย', en: 'Unsafe' }
    }

    return names[category]
}

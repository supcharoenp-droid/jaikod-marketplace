/**
 * Professional Product Image AI Enhancement System
 * 
 * Transforms validated images into professional selling quality.
 * Features: Quality scoring, safety checks, product detection, auto-enhancement, smart ordering
 * 
 * Used by global marketplaces for professional product photography.
 */

export interface ImageEnhancementResult {
    image_score: number // 0-100, overall quality
    hero_image: string // ID of best image to use as main
    risk_status: 'safe' | 'low_risk' | 'medium_risk' | 'high_risk' | 'prohibited'
    detected_product?: string
    detected_category?: string
    enhancement_applied: boolean
    enhanced_images: EnhancedImage[]
    recommendations: EnhancementRecommendation[]
    sales_impact_estimate?: number // Percentage increase estimate
}

export interface EnhancedImage {
    id: string
    original_url: string
    enhanced_url?: string

    // Quality breakdown
    quality_score: number // 0-100
    sharpness_score: number // 0-100
    lighting_score: number // 0-100
    focus_score: number // 0-100
    background_score: number // 0-100

    // Product detection
    detected_objects: DetectedObject[]
    main_product: string

    // Enhancement details
    enhancements_applied: {
        background_removed: boolean
        lighting_corrected: boolean
        color_corrected: boolean
        auto_cropped: boolean
    }

    // Ordering
    ranking: number // 1 = hero, 2-10 = supporting
    is_hero: boolean

    // Safety
    risk_flags: RiskFlag[]

    // Metadata
    dimensions: { width: number; height: number }
    aspect_ratio: number
    file_size_mb: number
}

export interface DetectedObject {
    label: string
    confidence: number // 0-1
    bounding_box?: {
        x: number
        y: number
        width: number
        height: number
    }
    attributes: {
        color?: string[]
        material?: string
        shape?: string
        brand?: string
    }
}

export interface RiskFlag {
    type: 'prohibited_item' | 'adult_content' | 'violence' | 'counterfeit' | 'misleading' | 'copyright'
    severity: 'low' | 'medium' | 'high' | 'critical'
    description: {
        th: string
        en: string
    }
    auto_fixable: boolean
}

export interface EnhancementRecommendation {
    type: 'add_more_images' | 'retake_image' | 'improve_lighting' | 'remove_background' | 'crop_product'
    priority: 'high' | 'medium' | 'low'
    message: {
        th: string
        en: string
    }
    estimated_impact: number // 0-100, percentage improvement
    image_ids?: string[]
}

// Configuration
const ENHANCEMENT_CONFIG = {
    MIN_QUALITY_SCORE: 60,
    HERO_IMAGE_MIN_SCORE: 75,
    SHARPNESS_WEIGHT: 0.30,
    LIGHTING_WEIGHT: 0.30,
    FOCUS_WEIGHT: 0.25,
    BACKGROUND_WEIGHT: 0.15,
    CONFIDENCE_THRESHOLD: 0.6,
    AUTO_ENHANCE_THRESHOLD: 70, // Auto-apply enhancements if score < 70
}

/**
 * Main entry point: Enhance validated images to professional quality
 */
export async function enhanceProductImages(
    images: File[],
    options?: {
        auto_enhance?: boolean
        preserve_originals?: boolean
        target_aspect_ratio?: number
    }
): Promise<ImageEnhancementResult> {
    console.log(`[Image Enhancement] Processing ${images.length} images...`)

    const auto_enhance = options?.auto_enhance ?? true
    const enhanced_images: EnhancedImage[] = []
    const recommendations: EnhancementRecommendation[] = []
    let overall_risk_status: ImageEnhancementResult['risk_status'] = 'safe'

    // Process each image
    for (let i = 0; i < images.length; i++) {
        const enhanced = await enhanceIndividualImage(images[i], i, auto_enhance)
        enhanced_images.push(enhanced)

        // Update overall risk status
        if (enhanced.risk_flags.length > 0) {
            const maxRisk = getMaxRiskLevel(enhanced.risk_flags)
            overall_risk_status = combineRiskStatus(overall_risk_status, maxRisk)
        }
    }

    // Auto-order images by quality
    rankAndOrderImages(enhanced_images)

    // Select hero image
    const hero_image = selectHeroImage(enhanced_images)

    // Calculate overall score
    const image_score = calculateOverallScore(enhanced_images)

    // Detect product type from all images
    const detected_product = detectProductType(enhanced_images)
    const detected_category = inferCategory(detected_product)

    // Generate recommendations
    const recs = generateRecommendations(enhanced_images, image_score)
    recommendations.push(...recs)

    // Estimate sales impact
    const sales_impact_estimate = estimateSalesImpact(enhanced_images, recommendations)

    const result: ImageEnhancementResult = {
        image_score,
        hero_image,
        risk_status: overall_risk_status,
        detected_product,
        detected_category,
        enhancement_applied: enhanced_images.some(img =>
            Object.values(img.enhancements_applied).some(v => v === true)
        ),
        enhanced_images,
        recommendations,
        sales_impact_estimate
    }

    console.log(`[Image Enhancement] Complete: Score ${image_score}/100, Hero: ${hero_image}`)

    return result
}

/**
 * Enhance a single image
 */
async function enhanceIndividualImage(
    file: File,
    index: number,
    auto_enhance: boolean
): Promise<EnhancedImage> {
    const id = `enhanced-${Date.now()}-${index}`
    const original_url = URL.createObjectURL(file)

    // Get dimensions
    const dimensions = await getImageDimensions(file)
    const aspect_ratio = dimensions.width / dimensions.height
    const file_size_mb = file.size / (1024 * 1024)

    // 1. Analyze image quality
    const sharpness_score = await analyzeSharpness(file)
    const lighting_score = await analyzeLighting(file)
    const focus_score = await analyzeFocus(file)
    const background_score = await analyzeBackground(file)

    // Calculate overall quality
    const quality_score = calculateQualityScore({
        sharpness: sharpness_score,
        lighting: lighting_score,
        focus: focus_score,
        background: background_score
    })

    // 2. Detect objects and products
    const detected_objects = await detectObjects(file)
    const main_product = detected_objects.length > 0
        ? detected_objects[0].label
        : 'unknown'

    // 3. Safety & Risk Check
    const risk_flags = await performSafetyCheck(file, detected_objects)

    // 4. Apply enhancements (if auto_enhance enabled and score < threshold)
    let enhanced_url = original_url
    const enhancements_applied = {
        background_removed: false,
        lighting_corrected: false,
        color_corrected: false,
        auto_cropped: false
    }

    if (auto_enhance && quality_score < ENHANCEMENT_CONFIG.AUTO_ENHANCE_THRESHOLD) {
        // Remove background if needed
        if (background_score < 60) {
            enhanced_url = await removeBackground(original_url)
            enhancements_applied.background_removed = true
        }

        // Correct lighting if needed
        if (lighting_score < 70) {
            enhanced_url = await correctLighting(enhanced_url)
            enhancements_applied.lighting_corrected = true
        }

        // Color correction
        if (lighting_score < 80) {
            enhanced_url = await correctColors(enhanced_url)
            enhancements_applied.color_corrected = true
        }

        // Auto-crop to product
        if (focus_score < 75) {
            enhanced_url = await autoCropToProduct(enhanced_url, detected_objects)
            enhancements_applied.auto_cropped = true
        }
    }

    return {
        id,
        original_url,
        enhanced_url,
        quality_score,
        sharpness_score,
        lighting_score,
        focus_score,
        background_score,
        detected_objects,
        main_product,
        enhancements_applied,
        ranking: 0, // Will be set by rankAndOrderImages
        is_hero: false, // Will be set by selectHeroImage
        risk_flags,
        dimensions,
        aspect_ratio,
        file_size_mb
    }
}

/**
 * Get image dimensions
 */
function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = () => {
            URL.revokeObjectURL(url)
            resolve({ width: img.width, height: img.height })
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error('Failed to load image'))
        }

        img.src = url
    })
}

/**
 * Analyze sharpness (0-100)
 */
async function analyzeSharpness(file: File): Promise<number> {
    // Mock implementation - in production use Laplacian variance
    await new Promise(resolve => setTimeout(resolve, 50))

    // Simulate variance: most images sharp, some soft
    const variance = 60 + Math.random() * 40
    return Math.round(variance)
}

/**
 * Analyze lighting quality (0-100)
 */
async function analyzeLighting(file: File): Promise<number> {
    // Mock implementation - in production use histogram analysis
    await new Promise(resolve => setTimeout(resolve, 50))

    // Simulate lighting quality distribution
    const rand = Math.random()
    if (rand > 0.7) return 85 + Math.random() * 15 // Excellent
    if (rand > 0.3) return 65 + Math.random() * 20 // Good
    return 40 + Math.random() * 25 // Needs improvement
}

/**
 * Analyze focus on product (0-100)
 */
async function analyzeFocus(file: File): Promise<number> {
    // Mock implementation - in production use edge detection + object detection
    await new Promise(resolve => setTimeout(resolve, 50))

    // Most images have decent focus
    return Math.round(60 + Math.random() * 40)
}

/**
 * Analyze background cleanliness (0-100)
 */
async function analyzeBackground(file: File): Promise<number> {
    // Mock implementation - in production use segmentation + complexity analysis
    await new Promise(resolve => setTimeout(resolve, 50))

    // Simulate background quality
    const rand = Math.random()
    if (rand > 0.5) return 70 + Math.random() * 30 // Clean
    return 30 + Math.random() * 40 // Cluttered
}

/**
 * Calculate weighted quality score
 */
function calculateQualityScore(scores: {
    sharpness: number
    lighting: number
    focus: number
    background: number
}): number {
    const weighted =
        scores.sharpness * ENHANCEMENT_CONFIG.SHARPNESS_WEIGHT +
        scores.lighting * ENHANCEMENT_CONFIG.LIGHTING_WEIGHT +
        scores.focus * ENHANCEMENT_CONFIG.FOCUS_WEIGHT +
        scores.background * ENHANCEMENT_CONFIG.BACKGROUND_WEIGHT

    return Math.round(weighted)
}

/**
 * Detect objects in image
 */
async function detectObjects(file: File): Promise<DetectedObject[]> {
    // Mock implementation - in production use TensorFlow.js or Vision API
    await new Promise(resolve => setTimeout(resolve, 100))

    // Simulate product detection
    const mockProducts = [
        { label: 'smartphone', color: ['black', 'silver'], material: 'glass' },
        { label: 'wristwatch', color: ['gold', 'brown'], material: 'metal' },
        { label: 'handbag', color: ['brown', 'beige'], material: 'leather' },
        { label: 'sneakers', color: ['white', 'blue'], material: 'fabric' },
        { label: 'laptop', color: ['silver', 'black'], material: 'aluminum' },
        { label: 'camera', color: ['black'], material: 'plastic' },
        { label: 'headphones', color: ['black', 'white'], material: 'plastic' }
    ]

    const product = mockProducts[Math.floor(Math.random() * mockProducts.length)]

    return [{
        label: product.label,
        confidence: 0.75 + Math.random() * 0.24, // 0.75-0.99
        bounding_box: {
            x: 100,
            y: 100,
            width: 400,
            height: 400
        },
        attributes: {
            color: product.color,
            material: product.material,
            shape: 'rectangular'
        }
    }]
}

/**
 * Perform safety and legal checks
 */
async function performSafetyCheck(file: File, detected_objects: DetectedObject[]): Promise<RiskFlag[]> {
    // Mock implementation - in production use content moderation API
    await new Promise(resolve => setTimeout(resolve, 100))

    const risk_flags: RiskFlag[] = []

    // Random safety checks (most items are safe)
    const rand = Math.random()

    if (rand < 0.05) { // 5% chance of issues
        // Simulate potential risks
        const riskTypes: RiskFlag[] = [
            {
                type: 'counterfeit',
                severity: 'medium',
                description: {
                    th: 'อาจมีเครื่องหมายการค้าที่ไม่ได้รับอนุญาต',
                    en: 'May contain unauthorized trademark'
                },
                auto_fixable: false
            },
            {
                type: 'misleading',
                severity: 'low',
                description: {
                    th: 'ข้อมูลในภาพอาจทำให้เข้าใจผิด',
                    en: 'Image content may be misleading'
                },
                auto_fixable: false
            }
        ]

        risk_flags.push(riskTypes[Math.floor(Math.random() * riskTypes.length)])
    }

    return risk_flags
}

/**
 * Remove background (studio-style)
 */
async function removeBackground(imageUrl: string): Promise<string> {
    // Mock implementation - in production use remove.bg API or ML model
    await new Promise(resolve => setTimeout(resolve, 200))

    // For demo, return original (in production would return transparent background version)
    return imageUrl
}

/**
 * Correct lighting
 */
async function correctLighting(imageUrl: string): Promise<string> {
    // Mock implementation - in production use histogram equalization
    await new Promise(resolve => setTimeout(resolve, 150))

    return imageUrl
}

/**
 * Correct colors
 */
async function correctColors(imageUrl: string): Promise<string> {
    // Mock implementation - in production use color balance algorithms
    await new Promise(resolve => setTimeout(resolve, 150))

    return imageUrl
}

/**
 * Auto-crop to product
 */
async function autoCropToProduct(imageUrl: string, objects: DetectedObject[]): Promise<string> {
    // Mock implementation - in production use bounding box to crop
    await new Promise(resolve => setTimeout(resolve, 100))

    return imageUrl
}

/**
 * Rank and order images by quality
 */
function rankAndOrderImages(images: EnhancedImage[]) {
    // Sort by quality score
    const sorted = [...images].sort((a, b) => b.quality_score - a.quality_score)

    // Assign rankings
    sorted.forEach((img, index) => {
        const originalIndex = images.findIndex(i => i.id === img.id)
        images[originalIndex].ranking = index + 1
    })
}

/**
 * Select best image as hero
 */
function selectHeroImage(images: EnhancedImage[]): string {
    if (images.length === 0) return ''

    // Find highest quality image that meets minimum threshold
    const hero = images
        .filter(img => img.quality_score >= ENHANCEMENT_CONFIG.HERO_IMAGE_MIN_SCORE)
        .sort((a, b) => b.quality_score - a.quality_score)[0]

    // If no image meets threshold, use best available
    const selected = hero || images.sort((a, b) => b.quality_score - a.quality_score)[0]

    const heroIndex = images.findIndex(img => img.id === selected.id)
    images[heroIndex].is_hero = true

    return selected.id
}

/**
 * Calculate overall score across all images
 */
function calculateOverallScore(images: EnhancedImage[]): number {
    if (images.length === 0) return 0

    // Weighted average: hero image counts for 50%, rest for 50%
    const heroImage = images.find(img => img.is_hero)
    const supportingImages = images.filter(img => !img.is_hero)

    if (!heroImage) {
        return Math.round(
            images.reduce((sum, img) => sum + img.quality_score, 0) / images.length
        )
    }

    const heroScore = heroImage.quality_score * 0.5
    const supportingScore = supportingImages.length > 0
        ? (supportingImages.reduce((sum, img) => sum + img.quality_score, 0) / supportingImages.length) * 0.5
        : 0

    return Math.round(heroScore + supportingScore)
}

/**
 * Detect product type from all images
 */
function detectProductType(images: EnhancedImage[]): string {
    // Use most confident detection
    let bestDetection = ''
    let maxConfidence = 0

    images.forEach(img => {
        img.detected_objects.forEach(obj => {
            if (obj.confidence > maxConfidence) {
                maxConfidence = obj.confidence
                bestDetection = obj.label
            }
        })
    })

    return bestDetection || 'unknown'
}

/**
 * Infer category from product type
 */
function inferCategory(productType: string): string {
    const categoryMap: Record<string, string> = {
        'smartphone': 'Electronics',
        'laptop': 'Electronics',
        'camera': 'Electronics',
        'headphones': 'Electronics',
        'wristwatch': 'Fashion',
        'handbag': 'Fashion',
        'sneakers': 'Fashion',
        'clothing': 'Fashion',
        'furniture': 'Home & Living',
        'book': 'Books & Media'
    }

    return categoryMap[productType] || 'Other'
}

/**
 * Generate enhancement recommendations
 */
function generateRecommendations(
    images: EnhancedImage[],
    overall_score: number
): EnhancementRecommendation[] {
    const recommendations: EnhancementRecommendation[] = []

    // Recommend adding more images if count is low
    if (images.length < 3) {
        recommendations.push({
            type: 'add_more_images',
            priority: 'high',
            message: {
                th: `เพิ่มอีก ${3 - images.length} รูป อาจช่วยเพิ่มโอกาสขาย ~${(3 - images.length) * 9}%`,
                en: `Adding ${3 - images.length} more image(s) may increase sales by ~${(3 - images.length) * 9}%`
            },
            estimated_impact: (3 - images.length) * 9
        })
    }

    // Recommend retaking low quality images
    const lowQualityImages = images.filter(img => img.quality_score < 60)
    if (lowQualityImages.length > 0) {
        recommendations.push({
            type: 'retake_image',
            priority: 'medium',
            message: {
                th: `ถ่ายรูปที่คุณภาพต่ำ ${lowQualityImages.length} รูป ใหม่เพื่อเพิ่มโอกาสขาย ~12%`,
                en: `Retake ${lowQualityImages.length} low-quality image(s) to increase sales by ~12%`
            },
            estimated_impact: 12,
            image_ids: lowQualityImages.map(img => img.id)
        })
    }

    // Recommend background removal
    const clutterredImages = images.filter(img => img.background_score < 60 && !img.enhancements_applied.background_removed)
    if (clutterredImages.length > 0) {
        recommendations.push({
            type: 'remove_background',
            priority: 'medium',
            message: {
                th: 'ลบพื้นหลังให้ดูสะอาด เพิ่มความน่าเชื่อถือ ~15%',
                en: 'Remove background for cleaner look, increase trust by ~15%'
            },
            estimated_impact: 15,
            image_ids: clutterredImages.map(img => img.id)
        })
    }

    // Recommend lighting improvement
    const darkImages = images.filter(img => img.lighting_score < 65 && !img.enhancements_applied.lighting_corrected)
    if (darkImages.length > 0) {
        recommendations.push({
            type: 'improve_lighting',
            priority: 'high',
            message: {
                th: 'ปรับแสงให้สว่างขึ้น เพิ่มยอดดู ~20%',
                en: 'Improve lighting to increase views by ~20%'
            },
            estimated_impact: 20,
            image_ids: darkImages.map(img => img.id)
        })
    }

    return recommendations
}

/**
 * Estimate sales impact
 */
function estimateSalesImpact(
    images: EnhancedImage[],
    recommendations: EnhancementRecommendation[]
): number {
    // Base impact from current quality
    const avgQuality = images.reduce((sum, img) => sum + img.quality_score, 0) / images.length
    let impact = Math.round((avgQuality - 50) * 0.5) // Quality above baseline

    // Add potential impact from recommendations
    if (recommendations.length > 0) {
        const maxRec = recommendations.reduce((max, rec) =>
            Math.max(max, rec.estimated_impact), 0
        )
        impact = Math.max(impact, maxRec)
    }

    return Math.min(50, Math.max(0, impact)) // Cap at 50%
}

/**
 * Get maximum risk level from flags
 */
function getMaxRiskLevel(flags: RiskFlag[]): ImageEnhancementResult['risk_status'] {
    if (flags.length === 0) return 'safe'

    const severityMap = {
        'critical': 'prohibited',
        'high': 'high_risk',
        'medium': 'medium_risk',
        'low': 'low_risk'
    } as const

    const maxSeverity = flags.reduce((max, flag) => {
        const severityOrder = ['low', 'medium', 'high', 'critical']
        return severityOrder.indexOf(flag.severity) > severityOrder.indexOf(max)
            ? flag.severity
            : max
    }, 'low')

    return severityMap[maxSeverity]
}

/**
 * Combine risk statuses
 */
function combineRiskStatus(
    current: ImageEnhancementResult['risk_status'],
    newRisk: ImageEnhancementResult['risk_status']
): ImageEnhancementResult['risk_status'] {
    const riskOrder = ['safe', 'low_risk', 'medium_risk', 'high_risk', 'prohibited']
    const currentIndex = riskOrder.indexOf(current)
    const newIndex = riskOrder.indexOf(newRisk)

    return riskOrder[Math.max(currentIndex, newIndex)] as ImageEnhancementResult['risk_status']
}

/**
 * Get user-friendly enhancement message
 */
export function getEnhancementMessage(result: ImageEnhancementResult, lang: 'th' | 'en'): string {
    const messages = {
        th: {
            excellent: `ภาพของคุณพร้อมขายแล้ว (${result.image_score}/100) ✨`,
            good: `ภาพของคุณมีคุณภาพดี (${result.image_score}/100) 👍`,
            fair: `ภาพของคุณใช้ได้ (${result.image_score}/100) แต่ควรปรับปรุง`,
            poor: `ภาพควรถ่ายใหม่เพื่อเพิ่มโอกาสขาย (${result.image_score}/100)`
        },
        en: {
            excellent: `Your images are ready for selling (${result.image_score}/100) ✨`,
            good: `Your images have good quality (${result.image_score}/100) 👍`,
            fair: `Your images are acceptable (${result.image_score}/100) but could be improved`,
            poor: `Consider retaking images for better sales (${result.image_score}/100)`
        }
    }

    const quality = result.image_score >= 85 ? 'excellent'
        : result.image_score >= 70 ? 'good'
            : result.image_score >= 55 ? 'fair'
                : 'poor'

    return messages[lang][quality]
}

/**
 * Get risk status message
 */
export function getRiskStatusMessage(status: ImageEnhancementResult['risk_status'], lang: 'th' | 'en'): string {
    const messages = {
        safe: {
            th: '✅ ปลอดภัย พร้อมขาย',
            en: '✅ Safe for selling'
        },
        low_risk: {
            th: '⚠️ ความเสี่ยงต่ำ ควรตรวจสอบ',
            en: '⚠️ Low risk, please review'
        },
        medium_risk: {
            th: '⚠️ ความเสี่ยงปานกลาง ต้องแก้ไข',
            en: '⚠️ Medium risk, requires fixes'
        },
        high_risk: {
            th: '🔴 ความเสี่ยงสูง อาจไม่ผ่านการตรวจสอบ',
            en: '🔴 High risk, may not pass review'
        },
        prohibited: {
            th: '❌ สินค้าต้องห้าม ไม่สามารถขายได้',
            en: '❌ Prohibited item, cannot be sold'
        }
    }

    return messages[status][lang]
}

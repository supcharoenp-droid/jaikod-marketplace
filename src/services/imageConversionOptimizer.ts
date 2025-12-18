/**
 * Image Conversion Optimization AI
 * 
 * Selects best main image and optimally sorts remaining images
 * Optimizes for maximum conversion (clicks, engagement, sales)
 */

import { evaluateImageQuality, type QualityEvaluationResult } from './imageQualityEvaluator'

export interface ImageRanking {
    image_id: string
    file_index: number
    rank: number // 1 = main image, 2 = second, etc.
    conversion_score: number // 0-100
    reason: string // Internal use
}

export interface ImageOptimizationResult {
    main_image_id: string
    main_image_index: number
    sorted_image_ids: string[]
    sorted_image_indices: number[]
    rankings: ImageRanking[]
    optimization_note: {
        th: string
        en: string
    }
}

/**
 * Conversion factors and weights
 */
const CONVERSION_WEIGHTS = {
    // Image quality factors
    sharpness: 0.25,          // Clear images convert better
    lighting: 0.20,           // Good lighting = trust
    visibility: 0.18,         // Product must be clear
    professional: 0.15,       // Professional = reliable seller

    // Conversion-specific factors
    main_image_suitability: 0.12,  // Is it "thumbnail-worthy"?
    background_cleanliness: 0.10   // Clean background = focus on product
}

/**
 * Optimize image selection and order
 */
export async function optimizeImageOrder(
    images: File[]
): Promise<ImageOptimizationResult> {
    console.log(`[ImageOptimization] Optimizing ${images.length} images...`)

    try {
        // Step 1: Evaluate quality of all images
        const qualityResults = await evaluateImageQuality(images)

        // Step 2: Calculate conversion scores
        const rankings = await calculateConversionRankings(
            images,
            qualityResults.results
        )

        // Step 3: Sort by conversion score
        rankings.sort((a, b) => b.conversion_score - a.conversion_score)

        // Step 4: Assign ranks
        rankings.forEach((ranking, index) => {
            ranking.rank = index + 1
        })

        // Step 5: Extract main and sorted order
        const mainImage = rankings[0]
        const sortedImageIds = rankings.map(r => r.image_id)
        const sortedImageIndices = rankings.map(r => r.file_index)

        console.log(`[ImageOptimization] Main image: ${mainImage.image_id} (score: ${mainImage.conversion_score})`)

        return {
            main_image_id: mainImage.image_id,
            main_image_index: mainImage.file_index,
            sorted_image_ids: sortedImageIds,
            sorted_image_indices: sortedImageIndices,
            rankings,
            optimization_note: generateOptimizationNote(rankings, images.length)
        }
    } catch (error) {
        console.error('[ImageOptimization] Error:', error)

        // Fallback: Keep original order
        return createFallbackResult(images)
    }
}

/**
 * Calculate conversion rankings for images
 */
async function calculateConversionRankings(
    images: File[],
    qualityResults: QualityEvaluationResult[]
): Promise<ImageRanking[]> {
    const rankings: ImageRanking[] = []

    for (let i = 0; i < images.length; i++) {
        const qualityResult = qualityResults[i]

        // Load image for additional analysis
        const additionalAnalysis = await analyzeForConversion(images[i])

        // Calculate conversion score
        const conversionScore = calculateConversionScore(
            qualityResult,
            additionalAnalysis
        )

        // Generate reason
        const reason = generateRankingReason(
            i + 1,
            qualityResult,
            additionalAnalysis,
            conversionScore
        )

        rankings.push({
            image_id: qualityResult.image_id,
            file_index: i,
            rank: 0, // Will be assigned after sorting
            conversion_score: conversionScore,
            reason
        })
    }

    return rankings
}

/**
 * Analyze image for conversion-specific factors
 */
interface ConversionAnalysis {
    aspect_ratio: number
    is_square_ish: boolean // Square images work better for thumbnails
    background_cleanliness: number // 0-100
    center_focus: number // 0-100 (is product in center?)
    color_appeal: number // 0-100
}

async function analyzeForConversion(file: File): Promise<ConversionAnalysis> {
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

                    // Calculate conversion factors
                    const aspect_ratio = img.width / img.height
                    const is_square_ish = aspect_ratio > 0.8 && aspect_ratio < 1.2

                    const background_cleanliness = analyzeBackgroundCleanliness(imageData)
                    const center_focus = analyzeCenterFocus(imageData)
                    const color_appeal = analyzeColorAppeal(imageData)

                    resolve({
                        aspect_ratio,
                        is_square_ish,
                        background_cleanliness,
                        center_focus,
                        color_appeal
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
 * Analyze background cleanliness
 * Clean backgrounds help product stand out
 */
function analyzeBackgroundCleanliness(imageData: ImageData): number {
    const { data, width, height } = imageData

    // Sample edges (assumed to be background)
    const edgePixels: number[] = []
    const borderSize = Math.floor(Math.min(width, height) * 0.1)

    // Top and bottom edges
    for (let x = 0; x < width; x += 4) {
        for (let y = 0; y < borderSize; y += 4) {
            const i = (y * width + x) * 4
            edgePixels.push((data[i] + data[i + 1] + data[i + 2]) / 3)
        }
        for (let y = height - borderSize; y < height; y += 4) {
            const i = (y * width + x) * 4
            edgePixels.push((data[i] + data[i + 1] + data[i + 2]) / 3)
        }
    }

    // Calculate variance of edge pixels
    const mean = edgePixels.reduce((a, b) => a + b, 0) / edgePixels.length
    const variance = edgePixels.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / edgePixels.length

    // Low variance = uniform background = clean
    // High variance = busy background
    const cleanliness = Math.max(0, 100 - (variance / 10))

    return Math.min(cleanliness, 100)
}

/**
 * Analyze center focus
 * Product should be in center for main images
 */
function analyzeCenterFocus(imageData: ImageData): number {
    const { data, width, height } = imageData

    // Calculate brightness in center vs edges
    const centerSize = Math.floor(Math.min(width, height) * 0.3)
    const centerX = Math.floor(width / 2)
    const centerY = Math.floor(height / 2)

    let centerBrightness = 0
    let centerCount = 0

    for (let y = centerY - centerSize; y < centerY + centerSize; y += 3) {
        for (let x = centerX - centerSize; x < centerX + centerSize; x += 3) {
            if (y >= 0 && y < height && x >= 0 && x < width) {
                const i = (y * width + x) * 4
                centerBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3
                centerCount++
            }
        }
    }

    const avgCenterBrightness = centerBrightness / centerCount

    // If center is notably different from edges, product is likely centered
    // This is simplified - production would use edge detection
    return avgCenterBrightness > 0 ? Math.min((avgCenterBrightness / 255) * 100, 100) : 50
}

/**
 * Analyze color appeal
 * Vibrant colors attract attention
 */
function analyzeColorAppeal(imageData: ImageData): number {
    const { data } = imageData

    let totalSaturation = 0
    let count = 0

    for (let i = 0; i < data.length; i += 16) { // Sample every 4th pixel
        const r = data[i] / 255
        const g = data[i + 1] / 255
        const b = data[i + 2] / 255

        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const saturation = max > 0 ? (max - min) / max : 0

        totalSaturation += saturation
        count++
    }

    const avgSaturation = totalSaturation / count

    // Moderate saturation is appealing (not too dull, not oversaturated)
    const ideal = 0.5
    const appeal = 100 - Math.abs(avgSaturation - ideal) * 100

    return Math.max(0, appeal)
}

/**
 * Calculate final conversion score
 */
function calculateConversionScore(
    quality: QualityEvaluationResult,
    conversion: ConversionAnalysis
): number {
    let score = 0

    // Quality factors (combined weight: 78%)
    score += quality.criteria_scores.sharpness * CONVERSION_WEIGHTS.sharpness
    score += quality.criteria_scores.lighting * CONVERSION_WEIGHTS.lighting
    score += quality.criteria_scores.visibility * CONVERSION_WEIGHTS.visibility
    score += quality.criteria_scores.professional * CONVERSION_WEIGHTS.professional

    // Main image suitability (weight: 12%)
    // Square images work better as thumbnails
    const mainImageBonus = conversion.is_square_ish ? 100 : 70
    score += mainImageBonus * CONVERSION_WEIGHTS.main_image_suitability

    // Background cleanliness (weight: 10%)
    score += conversion.background_cleanliness * CONVERSION_WEIGHTS.background_cleanliness

    return Math.round(Math.max(0, Math.min(100, score)))
}

/**
 * Generate ranking reason
 */
function generateRankingReason(
    imageNumber: number,
    quality: QualityEvaluationResult,
    conversion: ConversionAnalysis,
    finalScore: number
): string {
    const reasons: string[] = []

    // Quality highlights
    if (quality.criteria_scores.sharpness >= 85) {
        reasons.push('excellent sharpness')
    }
    if (quality.criteria_scores.lighting >= 85) {
        reasons.push('great lighting')
    }
    if (quality.criteria_scores.professional >= 85) {
        reasons.push('professional quality')
    }

    // Conversion highlights
    if (conversion.is_square_ish) {
        reasons.push('ideal aspect ratio')
    }
    if (conversion.background_cleanliness >= 75) {
        reasons.push('clean background')
    }
    if (conversion.center_focus >= 70) {
        reasons.push('centered product')
    }

    // Weaknesses
    if (quality.criteria_scores.sharpness < 60) {
        reasons.push('low sharpness')
    }
    if (quality.criteria_scores.lighting < 60) {
        reasons.push('poor lighting')
    }
    if (conversion.background_cleanliness < 50) {
        reasons.push('busy background')
    }

    const reasonText = reasons.length > 0
        ? reasons.join(', ')
        : 'average quality'

    return `Image ${imageNumber}: ${finalScore}/100 - ${reasonText}`
}

/**
 * Generate optimization note for user
 */
function generateOptimizationNote(
    rankings: ImageRanking[],
    totalImages: number
): { th: string; en: string } {
    const mainScore = rankings[0]?.conversion_score || 0

    if (mainScore >= 85) {
        return {
            th: `รูปหลักที่เลือกมีคะแนน ${mainScore}/100 เหมาะสำหรับขาย`,
            en: `Main image scored ${mainScore}/100 - optimized for sales`
        }
    } else if (mainScore >= 70) {
        return {
            th: `รูปหลักคะแนน ${mainScore}/100 - ดีแล้ว`,
            en: `Main image scored ${mainScore}/100 - good quality`
        }
    } else if (mainScore >= 50) {
        return {
            th: `รูปหลักคะแนน ${mainScore}/100 - ควรปรับปรุง`,
            en: `Main image scored ${mainScore}/100 - could be improved`
        }
    } else {
        return {
            th: `แนะนำให้ถ่ายรูปใหม่ให้ดีกว่านี้`,
            en: `Consider retaking photos for better quality`
        }
    }
}

/**
 * Create fallback result (keep original order)
 */
function createFallbackResult(images: File[]): ImageOptimizationResult {
    const image_ids = images.map((_, i) => `img_${i}_${Date.now()}`)
    const indices = images.map((_, i) => i)

    const rankings: ImageRanking[] = images.map((_, i) => ({
        image_id: image_ids[i],
        file_index: i,
        rank: i + 1,
        conversion_score: 50,
        reason: `Image ${i + 1}: 50/100 - original order`
    }))

    return {
        main_image_id: image_ids[0],
        main_image_index: 0,
        sorted_image_ids: image_ids,
        sorted_image_indices: indices,
        rankings,
        optimization_note: {
            th: 'ใช้ลำดับรูปตามที่อัปโหลด',
            en: 'Using original upload order'
        }
    }
}

/**
 * Quick re-order without full analysis
 * Useful for UI drag-drop reordering
 */
export function quickReorder(
    currentOrder: string[],
    newMainImageId: string
): string[] {
    const reordered = [...currentOrder]
    const mainIndex = reordered.indexOf(newMainImageId)

    if (mainIndex > 0) {
        // Move to first position
        reordered.splice(mainIndex, 1)
        reordered.unshift(newMainImageId)
    }

    return reordered
}

/**
 * Get optimal image order based on conversion best practices
 */
export function getOptimalImageStrategy(): {
    positions: Array<{
        position: number
        purpose: { th: string; en: string }
        tip: { th: string; en: string }
    }>
} {
    return {
        positions: [
            {
                position: 1,
                purpose: {
                    th: 'รูปหลัก - แสดงในหน้าค้นหา',
                    en: 'Main - Shown in search results'
                },
                tip: {
                    th: 'ควรใช้รูปสวย ชัด สินค้าอยู่ตรงกลาง',
                    en: 'Use clear, centered product photo'
                }
            },
            {
                position: 2,
                purpose: {
                    th: 'มุมที่ 2 - ให้เห็นมุมอื่น',
                    en: '2nd angle - Show different view'
                },
                tip: {
                    th: 'แสดงด้านข้างหรือด้านหลัง',
                    en: 'Show side or back view'
                }
            },
            {
                position: 3,
                purpose: {
                    th: 'รายละเอียด - แสดงสภาพสินค้า',
                    en: 'Details - Show condition'
                },
                tip: {
                    th: 'ถ่ายใกล้เพื่อให้เห็นรายละเอียด',
                    en: 'Close-up for details'
                }
            },
            {
                position: 4,
                purpose: {
                    th: 'ตำหนิ (ถ้ามี) - ความโปร่งใส',
                    en: 'Defects (if any) - Transparency'
                },
                tip: {
                    th: 'แสดงตำหนิให้เห็นชัดเจน',
                    en: 'Show defects clearly'
                }
            },
            {
                position: 5,
                purpose: {
                    th: 'อุปกรณ์แถม - เพิ่มมูลค่า',
                    en: 'Included items - Add value'
                },
                tip: {
                    th: 'แสดงสิ่งที่ได้พร้อมสินค้า',
                    en: 'Show what\'s included'
                }
            }
        ]
    }
}

/**
 * Validate image order
 */
export function validateImageOrder(imageIds: string[]): {
    is_valid: boolean
    warnings: string[]
} {
    const warnings: string[] = []

    if (imageIds.length === 0) {
        return {
            is_valid: false,
            warnings: ['No images provided']
        }
    }

    if (imageIds.length === 1) {
        warnings.push('Only 1 image - consider adding 2-3 more for better conversion')
    }

    if (imageIds.length > 10) {
        warnings.push('More than 10 images - keep only the best ones')
    }

    return {
        is_valid: imageIds.length > 0 && imageIds.length <= 10,
        warnings
    }
}

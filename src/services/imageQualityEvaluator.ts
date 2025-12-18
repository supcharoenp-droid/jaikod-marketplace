/**
 * Image Quality Evaluation AI
 * 
 * Analyzes product images and provides quality scores
 * Scores used internally for ranking and UI hints
 */

export interface QualityEvaluationResult {
    image_id: string
    quality_score: number // 0-100
    criteria_scores: {
        sharpness: number // 0-100
        lighting: number // 0-100
        angle: number // 0-100
        visibility: number // 0-100
        professional: number // 0-100
    }
    reason_summary: {
        th: string
        en: string
    }
    improvement_hint: {
        th: string
        en: string
    }
    is_recommended_main: boolean // Suggest as main/first image
}

export interface BatchEvaluationResult {
    results: QualityEvaluationResult[]
    recommended_main_image_id: string | null
    overall_quality: number // Average of all images
    best_score: number
    worst_score: number
}

/**
 * Evaluate a batch of images
 */
export async function evaluateImageQuality(
    images: File[]
): Promise<BatchEvaluationResult> {
    console.log(`[ImageQuality] Evaluating ${images.length} images...`)

    const results: QualityEvaluationResult[] = []
    let bestScore = 0
    let bestImageId = null

    for (let i = 0; i < images.length; i++) {
        const result = await evaluateSingleImage(images[i], i)
        results.push(result)

        if (result.quality_score > bestScore) {
            bestScore = result.quality_score
            bestImageId = result.image_id
        }
    }

    const overall_quality = results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.quality_score, 0) / results.length)
        : 0

    const worst_score = results.length > 0
        ? Math.min(...results.map(r => r.quality_score))
        : 0

    console.log(`[ImageQuality] Overall: ${overall_quality}/100, Best: ${bestScore}, Worst: ${worst_score}`)

    return {
        results,
        recommended_main_image_id: bestImageId,
        overall_quality,
        best_score: bestScore,
        worst_score
    }
}

/**
 * Evaluate a single image
 */
async function evaluateSingleImage(
    file: File,
    index: number
): Promise<QualityEvaluationResult> {
    const image_id = `img_${index}_${Date.now()}`

    try {
        // Load and analyze image
        const analysis = await analyzeImageQuality(file)

        // Calculate individual criteria scores
        const sharpness = calculateSharpnessScore(analysis)
        const lighting = calculateLightingScore(analysis)
        const angle = calculateAngleScore(analysis)
        const visibility = calculateVisibilityScore(analysis)
        const professional = calculateProfessionalScore(analysis, {
            sharpness,
            lighting,
            angle,
            visibility
        })

        // Weighted overall score
        // Sharpness and lighting are most important for product photos
        const quality_score = Math.round(
            sharpness * 0.30 +
            lighting * 0.30 +
            visibility * 0.20 +
            professional * 0.15 +
            angle * 0.05
        )

        // Generate friendly summary and hints
        const { reason_summary, improvement_hint } = generateFeedback(
            quality_score,
            {
                sharpness,
                lighting,
                angle,
                visibility,
                professional
            },
            analysis
        )

        // Recommend as main image if score is high
        const is_recommended_main = quality_score >= 85

        return {
            image_id,
            quality_score: Math.max(0, Math.min(100, quality_score)),
            criteria_scores: {
                sharpness: Math.round(sharpness),
                lighting: Math.round(lighting),
                angle: Math.round(angle),
                visibility: Math.round(visibility),
                professional: Math.round(professional)
            },
            reason_summary,
            improvement_hint,
            is_recommended_main
        }
    } catch (error) {
        console.error(`Error evaluating image ${index}:`, error)

        // Return neutral score on error
        return {
            image_id,
            quality_score: 50,
            criteria_scores: {
                sharpness: 50,
                lighting: 50,
                angle: 50,
                visibility: 50,
                professional: 50
            },
            reason_summary: {
                th: 'ไม่สามารถวิเคราะห์ได้',
                en: 'Unable to analyze'
            },
            improvement_hint: {
                th: 'ลองอัปโหลดรูปใหม่',
                en: 'Try uploading again'
            },
            is_recommended_main: false
        }
    }
}

/**
 * Analyze image using canvas
 */
interface ImageAnalysis {
    width: number
    height: number
    aspectRatio: number
    fileSize: number
    brightness: number // 0-1
    contrast: number // 0-1
    saturation: number // 0-1
    edgeStrength: number // 0-1 (indicates sharpness)
    colorBalance: {
        red: number
        green: number
        blue: number
    }
    hasTransparency: boolean
}

async function analyzeImageQuality(file: File): Promise<ImageAnalysis> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const img = new Image()
            img.src = e.target?.result as string

            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d', { willReadFrequently: true })
                    if (!ctx) {
                        throw new Error('Cannot get canvas context')
                    }

                    // Scale for analysis
                    const scale = Math.min(1, 800 / Math.max(img.width, img.height))
                    canvas.width = img.width * scale
                    canvas.height = img.height * scale

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                    const pixels = imageData.data

                    // Calculate statistics
                    let totalR = 0, totalG = 0, totalB = 0
                    let totalBrightness = 0
                    let minBrightness = 255, maxBrightness = 0
                    let hasAlpha = false

                    for (let i = 0; i < pixels.length; i += 4) {
                        const r = pixels[i]
                        const g = pixels[i + 1]
                        const b = pixels[i + 2]
                        const a = pixels[i + 3]

                        if (a < 255) hasAlpha = true

                        const brightness = (r + g + b) / 3
                        totalBrightness += brightness
                        totalR += r
                        totalG += g
                        totalB += b

                        minBrightness = Math.min(minBrightness, brightness)
                        maxBrightness = Math.max(maxBrightness, brightness)
                    }

                    const pixelCount = pixels.length / 4
                    const avgBrightness = totalBrightness / pixelCount / 255
                    const contrast = (maxBrightness - minBrightness) / 255

                    const avgR = totalR / pixelCount / 255
                    const avgG = totalG / pixelCount / 255
                    const avgB = totalB / pixelCount / 255

                    // Calculate saturation
                    const max = Math.max(avgR, avgG, avgB)
                    const min = Math.min(avgR, avgG, avgB)
                    const saturation = max > 0 ? (max - min) / max : 0

                    // Edge detection for sharpness
                    const edgeStrength = calculateEdgeStrength(imageData)

                    resolve({
                        width: img.width,
                        height: img.height,
                        aspectRatio: img.width / img.height,
                        fileSize: file.size,
                        brightness: avgBrightness,
                        contrast,
                        saturation,
                        edgeStrength,
                        colorBalance: {
                            red: avgR,
                            green: avgG,
                            blue: avgB
                        },
                        hasTransparency: hasAlpha
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
 * Calculate edge strength (sharpness indicator)
 */
function calculateEdgeStrength(imageData: ImageData): number {
    const { data, width, height } = imageData
    let totalEdge = 0
    let count = 0

    // Sobel operator
    for (let y = 1; y < height - 1; y += 3) {
        for (let x = 1; x < width - 1; x += 3) {
            const i = (y * width + x) * 4

            // Convert to grayscale
            const getGray = (offset: number) => {
                const idx = i + offset
                return (data[idx] + data[idx + 1] + data[idx + 2]) / 3
            }

            const center = getGray(0)
            const left = getGray(-4)
            const right = getGray(4)
            const top = getGray(-width * 4)
            const bottom = getGray(width * 4)

            const gx = -left + right
            const gy = -top + bottom
            const magnitude = Math.sqrt(gx * gx + gy * gy)

            totalEdge += magnitude
            count++
        }
    }

    const avgEdge = totalEdge / count
    return Math.min(avgEdge / 50, 1) // Normalize to 0-1
}

/**
 * Score calculations
 */

function calculateSharpnessScore(analysis: ImageAnalysis): number {
    // Edge strength is primary indicator
    let score = analysis.edgeStrength * 100

    // Resolution penalty
    const minDimension = Math.min(analysis.width, analysis.height)
    if (minDimension < 600) score *= 0.6
    else if (minDimension < 1000) score *= 0.8

    return Math.min(score, 100)
}

function calculateLightingScore(analysis: ImageAnalysis): number {
    let score = 100

    // Ideal brightness is 0.4-0.7
    if (analysis.brightness < 0.25) {
        score = 40 // Too dark
    } else if (analysis.brightness < 0.35) {
        score = 65 // Slightly dark
    } else if (analysis.brightness > 0.85) {
        score = 50 // Overexposed
    } else if (analysis.brightness > 0.75) {
        score = 75 // Slightly bright
    } else {
        score = 100 // Good lighting
    }

    // Contrast bonus
    if (analysis.contrast > 0.5) {
        score += 5
    }

    return Math.min(score, 100)
}

function calculateAngleScore(analysis: ImageAnalysis): number {
    // Product photos work best with standard aspect ratios
    const ratio = analysis.aspectRatio

    let score = 70 // Base score

    // Ideal ratios: 1:1 (square), 4:3, 3:2
    if (Math.abs(ratio - 1.0) < 0.1) {
        score = 100 // Square - perfect for products
    } else if (Math.abs(ratio - 1.33) < 0.1 || Math.abs(ratio - 1.5) < 0.1) {
        score = 95 // Standard photo ratios
    } else if (ratio > 0.7 && ratio < 1.8) {
        score = 85 // Acceptable range
    }

    return score
}

function calculateVisibilityScore(analysis: ImageAnalysis): number {
    let score = 80 // Base score

    // Good contrast helps visibility
    if (analysis.contrast > 0.6) {
        score += 15
    } else if (analysis.contrast < 0.3) {
        score -= 20
    }

    // Very dark or bright images hurt visibility
    if (analysis.brightness < 0.25 || analysis.brightness > 0.85) {
        score -= 25
    }

    return Math.max(0, Math.min(score, 100))
}

function calculateProfessionalScore(
    analysis: ImageAnalysis,
    otherScores: {
        sharpness: number
        lighting: number
        angle: number
        visibility: number
    }
): number {
    let score = 70

    // High resolution
    if (analysis.width >= 1920 && analysis.height >= 1080) {
        score += 20
    } else if (analysis.width >= 1200 && analysis.height >= 800) {
        score += 10
    }

    // Good saturation (not washed out)
    if (analysis.saturation > 0.3) {
        score += 10
    }

    // All other scores high = professional
    const avgOthers = (
        otherScores.sharpness +
        otherScores.lighting +
        otherScores.visibility
    ) / 3

    if (avgOthers >= 85) {
        score += 10
    }

    return Math.min(score, 100)
}

/**
 * Generate friendly feedback
 */
function generateFeedback(
    overallScore: number,
    scores: {
        sharpness: number
        lighting: number
        angle: number
        visibility: number
        professional: number
    },
    analysis: ImageAnalysis
): {
    reason_summary: { th: string; en: string }
    improvement_hint: { th: string; en: string }
} {
    // Find weakest area
    const weakest = Object.entries(scores).reduce((min, [key, value]) =>
        value < min.value ? { key, value } : min,
        { key: 'sharpness', value: scores.sharpness }
    )

    // Excellent photos
    if (overallScore >= 90) {
        return {
            reason_summary: {
                th: 'รูปสวยมาก คมชัด แสงดี',
                en: 'Excellent photo - sharp and well lit'
            },
            improvement_hint: {
                th: '✨ เพอร์เฟ็ค! ใช้รูปนี้เป็นรูปหลักได้เลย',
                en: '✨ Perfect! Use this as your main photo'
            }
        }
    }

    // Good photos
    if (overallScore >= 75) {
        return {
            reason_summary: {
                th: 'รูปดี มีคุณภาพ',
                en: 'Good quality photo'
            },
            improvement_hint: {
                th: '👍 รูปนี้ใช้ได้ดีแล้ว',
                en: '👍 This photo works great'
            }
        }
    }

    // Focus on specific weakness
    if (weakest.key === 'sharpness' && scores.sharpness < 60) {
        return {
            reason_summary: {
                th: 'รูปเบลอเล็กน้อย',
                en: 'Slightly blurry'
            },
            improvement_hint: {
                th: '💡 ถือมือให้มั่น หรือใช้โหมด HDR',
                en: '💡 Hold steady or use HDR mode'
            }
        }
    }

    if (weakest.key === 'lighting' && scores.lighting < 60) {
        if (analysis.brightness < 0.35) {
            return {
                reason_summary: {
                    th: 'แสงน้อยไป',
                    en: 'Insufficient lighting'
                },
                improvement_hint: {
                    th: '💡 ถ่ายใกล้หน้าต่าง หรือเปิดไฟเพิ่ม',
                    en: '💡 Shoot near window or add more light'
                }
            }
        } else {
            return {
                reason_summary: {
                    th: 'แสงจ้าเกินไป',
                    en: 'Overexposed'
                },
                improvement_hint: {
                    th: '💡 หลีกเลี่ยงแสงแดดตรง',
                    en: '💡 Avoid direct sunlight'
                }
            }
        }
    }

    if (weakest.key === 'visibility' && scores.visibility < 60) {
        return {
            reason_summary: {
                th: 'สินค้ามองไม่ชัดเจน',
                en: 'Product not clearly visible'
            },
            improvement_hint: {
                th: '💡 ใช้พื้นหลังเรียบ ๆ และแสงสม่ำเสมอ',
                en: '💡 Use plain background and even lighting'
            }
        }
    }

    // General improvement needed
    if (overallScore >= 50) {
        return {
            reason_summary: {
                th: 'รูปพอใช้ได้',
                en: 'Acceptable photo'
            },
            improvement_hint: {
                th: '💪 ถ่ายใหม่ให้ชัดกว่านี้จะดีกว่า',
                en: '💪 Retaking with better clarity would help'
            }
        }
    }

    // Needs significant improvement
    return {
        reason_summary: {
            th: 'คุณภาพต่ำ',
            en: 'Low quality'
        },
        improvement_hint: {
            th: '📸 ควรถ่ายใหม่ในที่สว่างและชัดกว่านี้',
            en: '📸 Please retake in better lighting with more clarity'
        }
    }
}

/**
 * Get quality grade with color
 */
export function getQualityGradeInfo(score: number): {
    grade: 'S' | 'A' | 'B' | 'C' | 'D' | 'F'
    color: string
    label: { th: string; en: string }
    emoji: string
} {
    if (score >= 95) {
        return {
            grade: 'S',
            color: 'text-purple-600',
            label: { th: 'ยอดเยี่ยม', en: 'Superb' },
            emoji: '⭐'
        }
    }
    if (score >= 85) {
        return {
            grade: 'A',
            color: 'text-green-600',
            label: { th: 'ดีเลิศ', en: 'Excellent' },
            emoji: '✨'
        }
    }
    if (score >= 70) {
        return {
            grade: 'B',
            color: 'text-blue-600',
            label: { th: 'ดี', en: 'Good' },
            emoji: '👍'
        }
    }
    if (score >= 55) {
        return {
            grade: 'C',
            color: 'text-yellow-600',
            label: { th: 'พอใช้', en: 'Fair' },
            emoji: '😊'
        }
    }
    if (score >= 40) {
        return {
            grade: 'D',
            color: 'text-orange-600',
            label: { th: 'ควรปรับปรุง', en: 'Needs Work' },
            emoji: '💪'
        }
    }
    return {
        grade: 'F',
        color: 'text-red-600',
        label: { th: 'ควรถ่ายใหม่', en: 'Retake Needed' },
        emoji: '📸'
    }
}

/**
 * Professional Image Enhancement AI
 * 
 * Enhances product images to marketplace professional standard
 * Uses canvas-based processing for natural, authentic improvements
 */

export interface EnhancementOptions {
    auto_enhance?: boolean // Auto-detect and apply best enhancements
    brightness_adjustment?: number // -50 to 50
    contrast_adjustment?: number // -50 to 50
    saturation_adjustment?: number // -50 to 50
    sharpen?: boolean
    remove_background?: boolean // Requires additional ML model
    max_dimension?: number // Resize if larger (default: 2048)
}

export interface Enhancement {
    type: 'brightness' | 'contrast' | 'saturation' | 'sharpen' | 'resize' | 'background_removal'
    strength: number // 0-100
    description: {
        th: string
        en: string
    }
}

export interface EnhancedImageResult {
    original_data_url: string
    enhanced_data_url: string
    enhancements_applied: Enhancement[]
    before_quality_score: number
    after_quality_score: number
    file_size_before: number
    file_size_after: number
    improvement_summary: {
        th: string
        en: string
    }
}

export interface BatchEnhancementResult {
    results: EnhancedImageResult[]
    total_improvements: number
    processing_time_ms: number
}

/**
 * Enhance batch of product images
 */
export async function enhanceImages(
    images: File[],
    options: EnhancementOptions = {}
): Promise<BatchEnhancementResult> {
    console.log(`[ImageEnhancement] Enhancing ${images.length} images...`)
    const startTime = Date.now()

    const opts: Required<EnhancementOptions> = {
        auto_enhance: options.auto_enhance ?? true,
        brightness_adjustment: options.brightness_adjustment ?? 0,
        contrast_adjustment: options.contrast_adjustment ?? 0,
        saturation_adjustment: options.saturation_adjustment ?? 0,
        sharpen: options.sharpen ?? false,
        remove_background: options.remove_background ?? false,
        max_dimension: options.max_dimension ?? 2048
    }

    const results: EnhancedImageResult[] = []

    for (const image of images) {
        const result = await enhanceSingleImage(image, opts)
        results.push(result)
    }

    const processingTime = Date.now() - startTime
    const totalImprovements = results.reduce(
        (sum, r) => sum + (r.after_quality_score - r.before_quality_score),
        0
    )

    console.log(`[ImageEnhancement] Complete in ${processingTime}ms, +${totalImprovements} quality improvement`)

    return {
        results,
        total_improvements: Math.round(totalImprovements),
        processing_time_ms: processingTime
    }
}

/**
 * Enhance single image
 */
async function enhanceSingleImage(
    file: File,
    options: Required<EnhancementOptions>
): Promise<EnhancedImageResult> {
    const originalDataUrl = await fileToDataUrl(file)
    const enhancements: Enhancement[] = []

    // Load image
    const img = await loadImage(originalDataUrl)

    // Create canvas
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) throw new Error('Cannot get canvas context')

    // Resize if needed
    let { width, height } = img
    if (Math.max(width, height) > options.max_dimension) {
        const scale = options.max_dimension / Math.max(width, height)
        width = Math.round(width * scale)
        height = Math.round(height * scale)

        enhancements.push({
            type: 'resize',
            strength: Math.round((1 - scale) * 100),
            description: {
                th: `ปรับขนาดเพื่อความเหมาะสม`,
                en: `Resized for optimal size`
            }
        })
    }

    canvas.width = width
    canvas.height = height
    ctx.drawImage(img, 0, 0, width, height)

    // Get image data
    const imageData = ctx.getImageData(0, 0, width, height)
    const beforeQuality = estimateImageQuality(imageData)

    // Apply auto-enhancements if enabled
    if (options.auto_enhance) {
        const autoAdjustments = calculateAutoAdjustments(imageData)

        // Apply brightness
        if (Math.abs(autoAdjustments.brightness) > 5) {
            applyBrightness(imageData, autoAdjustments.brightness)
            enhancements.push({
                type: 'brightness',
                strength: Math.abs(autoAdjustments.brightness),
                description: {
                    th: autoAdjustments.brightness > 0 ? 'เพิ่มความสว่าง' : 'ลดความสว่าง',
                    en: autoAdjustments.brightness > 0 ? 'Brightened' : 'Darkened'
                }
            })
        }

        // Apply contrast
        if (Math.abs(autoAdjustments.contrast) > 5) {
            applyContrast(imageData, autoAdjustments.contrast)
            enhancements.push({
                type: 'contrast',
                strength: Math.abs(autoAdjustments.contrast),
                description: {
                    th: 'ปรับคอนทราสต์',
                    en: 'Adjusted contrast'
                }
            })
        }

        // Apply saturation
        if (Math.abs(autoAdjustments.saturation) > 5) {
            applySaturation(imageData, autoAdjustments.saturation)
            enhancements.push({
                type: 'saturation',
                strength: Math.abs(autoAdjustments.saturation),
                description: {
                    th: 'ปรับสีสัน',
                    en: 'Enhanced colors'
                }
            })
        }
    } else {
        // Apply manual adjustments
        if (options.brightness_adjustment !== 0) {
            applyBrightness(imageData, options.brightness_adjustment)
            enhancements.push({
                type: 'brightness',
                strength: Math.abs(options.brightness_adjustment),
                description: {
                    th: 'ปรับความสว่าง',
                    en: 'Brightness adjusted'
                }
            })
        }

        if (options.contrast_adjustment !== 0) {
            applyContrast(imageData, options.contrast_adjustment)
            enhancements.push({
                type: 'contrast',
                strength: Math.abs(options.contrast_adjustment),
                description: {
                    th: 'ปรับคอนทราสต์',
                    en: 'Contrast adjusted'
                }
            })
        }

        if (options.saturation_adjustment !== 0) {
            applySaturation(imageData, options.saturation_adjustment)
            enhancements.push({
                type: 'saturation',
                strength: Math.abs(options.saturation_adjustment),
                description: {
                    th: 'ปรับสีสัน',
                    en: 'Saturation adjusted'
                }
            })
        }
    }

    // Apply sharpening
    if (options.sharpen) {
        applySharpen(imageData)
        enhancements.push({
            type: 'sharpen',
            strength: 30,
            description: {
                th: 'เพิ่มความคมชัด',
                en: 'Sharpened edges'
            }
        })
    }

    // Put enhanced data back
    ctx.putImageData(imageData, 0, 0)

    // Background removal (placeholder - requires ML model)
    if (options.remove_background) {
        enhancements.push({
            type: 'background_removal',
            strength: 0,
            description: {
                th: 'ต้องการโมเดล ML เพิ่มเติม',
                en: 'Requires additional ML model'
            }
        })
    }

    // Calculate quality improvement
    const afterQuality = estimateImageQuality(imageData)

    // Convert to data URL
    const enhancedDataUrl = canvas.toDataURL('image/jpeg', 0.92)

    // Generate summary
    const improvement_summary = generateImprovementSummary(
        enhancements,
        beforeQuality,
        afterQuality
    )

    return {
        original_data_url: originalDataUrl,
        enhanced_data_url: enhancedDataUrl,
        enhancements_applied: enhancements,
        before_quality_score: Math.round(beforeQuality),
        after_quality_score: Math.round(afterQuality),
        file_size_before: file.size,
        file_size_after: estimateDataUrlSize(enhancedDataUrl),
        improvement_summary
    }
}

/**
 * Calculate auto adjustments based on image analysis
 */
interface AutoAdjustments {
    brightness: number // -50 to 50
    contrast: number // -50 to 50
    saturation: number // -50 to 50
}

function calculateAutoAdjustments(imageData: ImageData): AutoAdjustments {
    const { data } = imageData

    let totalBrightness = 0
    let totalSaturation = 0
    let minBrightness = 255
    let maxBrightness = 0

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        const brightness = (r + g + b) / 3
        totalBrightness += brightness
        minBrightness = Math.min(minBrightness, brightness)
        maxBrightness = Math.max(maxBrightness, brightness)

        const max = Math.max(r, g, b)
        const min = Math.min(r, g, b)
        const saturation = max > 0 ? ((max - min) / max) * 255 : 0
        totalSaturation += saturation
    }

    const pixelCount = data.length / 4
    const avgBrightness = totalBrightness / pixelCount
    const avgSaturation = totalSaturation / pixelCount
    const contrast = maxBrightness - minBrightness

    // Calculate adjustments
    const adjustments: AutoAdjustments = {
        brightness: 0,
        contrast: 0,
        saturation: 0
    }

    // Brightness adjustment (target: 110-140)
    if (avgBrightness < 90) {
        adjustments.brightness = Math.min(30, (110 - avgBrightness) / 3)
    } else if (avgBrightness > 160) {
        adjustments.brightness = Math.max(-30, (140 - avgBrightness) / 3)
    }

    // Contrast adjustment (target: 100-180)
    if (contrast < 80) {
        adjustments.contrast = Math.min(25, (100 - contrast) / 4)
    } else if (contrast > 200) {
        adjustments.contrast = Math.max(-20, (180 - contrast) / 4)
    }

    // Saturation adjustment (target: 60-100)
    if (avgSaturation < 50) {
        adjustments.saturation = Math.min(20, (70 - avgSaturation) / 3)
    } else if (avgSaturation > 120) {
        adjustments.saturation = Math.max(-15, (100 - avgSaturation) / 3)
    }

    return adjustments
}

/**
 * Apply brightness adjustment
 */
function applyBrightness(imageData: ImageData, amount: number): void {
    const { data } = imageData
    const factor = amount * 2.55 // Convert to 0-255 scale

    for (let i = 0; i < data.length; i += 4) {
        data[i] = clamp(data[i] + factor)     // R
        data[i + 1] = clamp(data[i + 1] + factor) // G
        data[i + 2] = clamp(data[i + 2] + factor) // B
    }
}

/**
 * Apply contrast adjustment
 */
function applyContrast(imageData: ImageData, amount: number): void {
    const { data } = imageData
    const factor = (amount + 100) / 100
    const intercept = 128 * (1 - factor)

    for (let i = 0; i < data.length; i += 4) {
        data[i] = clamp(data[i] * factor + intercept)       // R
        data[i + 1] = clamp(data[i + 1] * factor + intercept)   // G
        data[i + 2] = clamp(data[i + 2] * factor + intercept)   // B
    }
}

/**
 * Apply saturation adjustment
 */
function applySaturation(imageData: ImageData, amount: number): void {
    const { data } = imageData
    const factor = (amount + 100) / 100

    for (let i = 0; i < data.length; i += 4) {
        const r = data[i]
        const g = data[i + 1]
        const b = data[i + 2]

        const gray = 0.2989 * r + 0.5870 * g + 0.1140 * b

        data[i] = clamp(gray + factor * (r - gray))     // R
        data[i + 1] = clamp(gray + factor * (g - gray))     // G
        data[i + 2] = clamp(gray + factor * (b - gray))     // B
    }
}

/**
 * Apply sharpening filter
 */
function applySharpen(imageData: ImageData): void {
    const { data, width, height } = imageData
    const copy = new Uint8ClampedArray(data)

    // Sharpening kernel
    const kernel = [
        0, -1, 0,
        -1, 5, -1,
        0, -1, 0
    ]

    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            for (let c = 0; c < 3; c++) { // RGB channels only
                let sum = 0

                for (let ky = -1; ky <= 1; ky++) {
                    for (let kx = -1; kx <= 1; kx++) {
                        const idx = ((y + ky) * width + (x + kx)) * 4 + c
                        const kidx = (ky + 1) * 3 + (kx + 1)
                        sum += copy[idx] * kernel[kidx]
                    }
                }

                const idx = (y * width + x) * 4 + c
                data[idx] = clamp(sum)
            }
        }
    }
}

/**
 * Estimate image quality score
 */
function estimateImageQuality(imageData: ImageData): number {
    const { data } = imageData

    let totalBrightness = 0
    let totalContrast = 0
    let minBrightness = 255
    let maxBrightness = 0

    for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
        totalBrightness += brightness
        minBrightness = Math.min(minBrightness, brightness)
        maxBrightness = Math.max(maxBrightness, brightness)
    }

    const avgBrightness = totalBrightness / (data.length / 4)
    const contrast = maxBrightness - minBrightness

    // Score based on ideal ranges
    let score = 70 // Base score

    // Brightness score (ideal: 100-150)
    if (avgBrightness >= 100 && avgBrightness <= 150) {
        score += 15
    } else if (avgBrightness >= 80 && avgBrightness <= 170) {
        score += 10
    }

    // Contrast score (ideal: 100-200)
    if (contrast >= 100 && contrast <= 200) {
        score += 15
    } else if (contrast >= 80 && contrast <= 220) {
        score += 10
    }

    return Math.min(score, 100)
}

/**
 * Generate improvement summary
 */
function generateImprovementSummary(
    enhancements: Enhancement[],
    before: number,
    after: number
): { th: string; en: string } {
    const improvement = after - before

    if (improvement >= 15) {
        return {
            th: `ปรับปรุงคุณภาพได้อย่างมาก (+${Math.round(improvement)} คะแนน)`,
            en: `Significantly improved (+${Math.round(improvement)} points)`
        }
    } else if (improvement >= 8) {
        return {
            th: `ปรับปรุงคุณภาพได้ดี (+${Math.round(improvement)} คะแนน)`,
            en: `Good improvement (+${Math.round(improvement)} points)`
        }
    } else if (improvement >= 3) {
        return {
            th: `ปรับปรุงเล็กน้อย (+${Math.round(improvement)} คะแนน)`,
            en: `Minor improvement (+${Math.round(improvement)} points)`
        }
    } else if (improvement >= 0) {
        return {
            th: 'รูปมีคุณภาพดีอยู่แล้ว',
            en: 'Image already has good quality'
        }
    } else {
        return {
            th: 'ไม่แนะนำให้ใช้รูปที่ปรับแต่ง',
            en: 'Original recommended'
        }
    }
}

/**
 * Helper functions
 */

function clamp(value: number): number {
    return Math.max(0, Math.min(255, Math.round(value)))
}

function fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

function loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.onload = () => resolve(img)
        img.onerror = reject
        img.src = src
    })
}

function estimateDataUrlSize(dataUrl: string): number {
    // Approximate size from base64
    const base64Length = dataUrl.split(',')[1]?.length || 0
    return Math.round(base64Length * 0.75)
}

/**
 * Convert enhanced data URL back to File
 */
export async function dataUrlToFile(
    dataUrl: string,
    filename: string = 'enhanced.jpg'
): Promise<File> {
    const response = await fetch(dataUrl)
    const blob = await response.blob()
    return new File([blob], filename, { type: 'image/jpeg' })
}

/**
 * Batch convert enhanced results to files
 */
export async function convertEnhancedToFiles(
    results: EnhancedImageResult[],
    originalFiles: File[]
): Promise<File[]> {
    const enhancedFiles: File[] = []

    for (let i = 0; i < results.length; i++) {
        const result = results[i]
        const originalName = originalFiles[i]?.name || `image_${i}.jpg`
        const enhancedName = originalName.replace(/\.[^/.]+$/, '_enhanced.jpg')

        const file = await dataUrlToFile(result.enhanced_data_url, enhancedName)
        enhancedFiles.push(file)
    }

    return enhancedFiles
}

/**
 * Preview enhancement before and after
 */
export function createComparisonPreview(result: EnhancedImageResult): {
    beforeUrl: string
    afterUrl: string
    improvements: string[]
} {
    return {
        beforeUrl: result.original_data_url,
        afterUrl: result.enhanced_data_url,
        improvements: result.enhancements_applied.map(
            e => `${e.description.en} (${e.strength}%)`
        )
    }
}

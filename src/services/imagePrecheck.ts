/**
 * Product Listing Image Precheck AI
 * 
 * Validates uploaded images with soft, helpful warnings
 * Never blocks user flow - only provides gentle guidance
 */

export interface QualityFlag {
    type: 'blur' | 'dark' | 'bright' | 'small' | 'duplicate' | 'format' | 'large_file'
    severity: 'info' | 'warning' | 'suggestion'
    image_index?: number
    message: {
        th: string
        en: string
    }
    suggestion: {
        th: string
        en: string
    }
}

export interface ImagePrecheckResult {
    image_count: number
    duplicate_detected: boolean
    quality_flags: QualityFlag[]
    overall_score: number // 0-100
    soft_suggestion_text: {
        th: string
        en: string
    }
}

export interface ImageValidationOptions {
    max_file_size?: number // bytes, default 10MB
    min_resolution?: number // pixels, default 600
    ideal_resolution?: number // pixels, default 1200
    max_images?: number // default 10
}

const DEFAULT_OPTIONS: Required<ImageValidationOptions> = {
    max_file_size: 10 * 1024 * 1024, // 10MB
    min_resolution: 600,
    ideal_resolution: 1200,
    max_images: 10
}

/**
 * Main precheck function - analyzes all uploaded images
 */
export async function precheckImages(
    images: File[],
    options: ImageValidationOptions = {}
): Promise<ImagePrecheckResult> {
    const opts = { ...DEFAULT_OPTIONS, ...options }
    const quality_flags: QualityFlag[] = []
    let duplicate_detected = false
    let total_score = 0

    console.log(`[ImagePrecheck] Analyzing ${images.length} images...`)

    // Validate image count
    if (images.length > opts.max_images) {
        quality_flags.push({
            type: 'format',
            severity: 'warning',
            message: {
                th: `อัปโหลดได้สูงสุด ${opts.max_images} รูป`,
                en: `Maximum ${opts.max_images} images allowed`
            },
            suggestion: {
                th: 'เลือกภาพที่ดีที่สุดไว้เท่านั้น',
                en: 'Keep only your best photos'
            }
        })
    }

    // Analyze each image
    const imageAnalyses = await Promise.all(
        images.map((file, index) => analyzeImage(file, index, opts))
    )

    // Collect flags and calculate scores
    imageAnalyses.forEach((analysis) => {
        quality_flags.push(...analysis.flags)
        total_score += analysis.score
    })

    // Detect duplicates
    const duplicates = detectDuplicates(images)
    if (duplicates.length > 0) {
        duplicate_detected = true
        duplicates.forEach(({ index1, index2 }) => {
            quality_flags.push({
                type: 'duplicate',
                severity: 'info',
                image_index: index2,
                message: {
                    th: `รูปที่ ${index2 + 1} คล้ายกับรูปที่ ${index1 + 1}`,
                    en: `Image ${index2 + 1} is similar to image ${index1 + 1}`
                },
                suggestion: {
                    th: 'ลองถ่ายมุมอื่นเพื่อแสดงรายละเอียดเพิ่มเติม',
                    en: 'Try different angles to show more details'
                }
            })
        })
    }

    // Calculate overall score
    const overall_score = images.length > 0
        ? Math.round(total_score / images.length)
        : 0

    // Generate friendly suggestion text
    const soft_suggestion_text = generateSuggestionText(
        images.length,
        overall_score,
        quality_flags,
        duplicate_detected
    )

    console.log(`[ImagePrecheck] Overall score: ${overall_score}/100, Flags: ${quality_flags.length}`)

    return {
        image_count: images.length,
        duplicate_detected,
        quality_flags,
        overall_score,
        soft_suggestion_text
    }
}

/**
 * Analyze a single image for quality issues
 */
async function analyzeImage(
    file: File,
    index: number,
    options: Required<ImageValidationOptions>
): Promise<{ flags: QualityFlag[]; score: number }> {
    const flags: QualityFlag[] = []
    let score = 100

    // Check file format
    if (!file.type.startsWith('image/')) {
        flags.push({
            type: 'format',
            severity: 'warning',
            image_index: index,
            message: {
                th: 'ไฟล์ไม่ใช่รูปภาพ',
                en: 'File is not an image'
            },
            suggestion: {
                th: 'กรุณาเลือกไฟล์รูปภาพเท่านั้น',
                en: 'Please select image files only'
            }
        })
        score -= 50
        return { flags, score }
    }

    // Check file size
    if (file.size > options.max_file_size) {
        flags.push({
            type: 'large_file',
            severity: 'info',
            image_index: index,
            message: {
                th: 'ไฟล์ใหญ่เกินไป อาจอัปโหลดช้า',
                en: 'Large file size, may upload slowly'
            },
            suggestion: {
                th: 'ระบบจะบีบอัดให้อัตโนมัติ',
                en: 'System will compress automatically'
            }
        })
        score -= 5
    }

    // Load and analyze image
    try {
        const analysis = await analyzeImageQuality(file, options)

        // Check resolution
        if (analysis.width < options.min_resolution || analysis.height < options.min_resolution) {
            flags.push({
                type: 'small',
                severity: 'warning',
                image_index: index,
                message: {
                    th: 'ความละเอียดต่ำ อาจดูไม่คมชัด',
                    en: 'Low resolution, may appear blurry'
                },
                suggestion: {
                    th: 'ถ่ายด้วยกล้องหลัก ไม่ใช่กล้องหน้า',
                    en: 'Use main camera instead of front camera'
                }
            })
            score -= 25
        } else if (analysis.width < options.ideal_resolution || analysis.height < options.ideal_resolution) {
            // Below ideal but acceptable
            score -= 10
        }

        // Check for blur
        if (analysis.blur_score < 0.6) {
            flags.push({
                type: 'blur',
                severity: 'warning',
                image_index: index,
                message: {
                    th: 'รูปอาจเบลอนิดหน่อย',
                    en: 'Image might be slightly blurry'
                },
                suggestion: {
                    th: 'ถือมือให้มั่น หรือใช้โหมด HDR',
                    en: 'Hold steady or use HDR mode'
                }
            })
            score -= 20
        }

        // Check brightness
        if (analysis.brightness < 0.3) {
            flags.push({
                type: 'dark',
                severity: 'info',
                image_index: index,
                message: {
                    th: 'รูปมืดไปหน่อย',
                    en: 'Image is a bit dark'
                },
                suggestion: {
                    th: 'ถ่ายใกล้หน้าต่าง หรือเปิดไฟเพิ่ม',
                    en: 'Shoot near window or add more light'
                }
            })
            score -= 15
        } else if (analysis.brightness > 0.85) {
            flags.push({
                type: 'bright',
                severity: 'info',
                image_index: index,
                message: {
                    th: 'รูปสว่างเกินไป',
                    en: 'Image is overexposed'
                },
                suggestion: {
                    th: 'ลดแสง หรือหลีกเลี่ยงแสงแดดตรง',
                    en: 'Reduce light or avoid direct sunlight'
                }
            })
            score -= 10
        }

    } catch (error) {
        console.error(`Error analyzing image ${index}:`, error)
        score -= 10
    }

    return { flags, score: Math.max(0, score) }
}

/**
 * Analyze image quality using canvas
 */
async function analyzeImageQuality(
    file: File,
    options: Required<ImageValidationOptions>
): Promise<{
    width: number
    height: number
    blur_score: number // 0-1 (higher = sharper)
    brightness: number // 0-1
}> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            const img = new Image()
            img.src = e.target?.result as string

            img.onload = () => {
                try {
                    // Create canvas for analysis
                    const canvas = document.createElement('canvas')
                    const ctx = canvas.getContext('2d')
                    if (!ctx) {
                        throw new Error('Cannot get canvas context')
                    }

                    // Scale down for analysis (faster)
                    const scale = Math.min(1, 800 / Math.max(img.width, img.height))
                    canvas.width = img.width * scale
                    canvas.height = img.height * scale

                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
                    const pixels = imageData.data

                    // Calculate brightness
                    let totalBrightness = 0
                    for (let i = 0; i < pixels.length; i += 4) {
                        const r = pixels[i]
                        const g = pixels[i + 1]
                        const b = pixels[i + 2]
                        totalBrightness += (r + g + b) / 3
                    }
                    const brightness = totalBrightness / (pixels.length / 4) / 255

                    // Estimate blur using Laplacian variance
                    // (Simplified - in production use proper edge detection)
                    const blur_score = estimateSharpness(imageData)

                    resolve({
                        width: img.width,
                        height: img.height,
                        blur_score,
                        brightness
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
 * Estimate image sharpness using edge detection
 * Returns 0-1 (higher = sharper)
 */
function estimateSharpness(imageData: ImageData): number {
    const { data, width, height } = imageData

    // Simple Laplacian edge detection
    let variance = 0
    let count = 0

    // Sample every 4th pixel for performance
    for (let y = 1; y < height - 1; y += 4) {
        for (let x = 1; x < width - 1; x += 4) {
            const i = (y * width + x) * 4

            // Convert to grayscale
            const center = (data[i] + data[i + 1] + data[i + 2]) / 3

            // Get neighbors
            const top = (data[i - width * 4] + data[i - width * 4 + 1] + data[i - width * 4 + 2]) / 3
            const bottom = (data[i + width * 4] + data[i + width * 4 + 1] + data[i + width * 4 + 2]) / 3
            const left = (data[i - 4] + data[i - 3] + data[i - 2]) / 3
            const right = (data[i + 4] + data[i + 5] + data[i + 6]) / 3

            // Laplacian
            const lap = Math.abs(4 * center - top - bottom - left - right)
            variance += lap * lap
            count++
        }
    }

    const avgVariance = variance / count

    // Normalize to 0-1 (empirically determined thresholds)
    // Higher variance = sharper image
    const normalized = Math.min(avgVariance / 1000, 1)

    return normalized
}

/**
 * Detect duplicate or near-duplicate images
 */
function detectDuplicates(images: File[]): Array<{ index1: number; index2: number }> {
    const duplicates: Array<{ index1: number; index2: number }> = []

    // Simple duplicate detection based on file size similarity
    // In production, use perceptual hashing (pHash)
    for (let i = 0; i < images.length; i++) {
        for (let j = i + 1; j < images.length; j++) {
            const sizeDiff = Math.abs(images[i].size - images[j].size)
            const avgSize = (images[i].size + images[j].size) / 2
            const similarity = 1 - (sizeDiff / avgSize)

            // If files are very similar in size (>95% similar)
            if (similarity > 0.95 && sizeDiff < 5000) {
                duplicates.push({ index1: i, index2: j })
            }
        }
    }

    return duplicates
}

/**
 * Generate friendly, helpful suggestion text
 */
function generateSuggestionText(
    imageCount: number,
    overallScore: number,
    flags: QualityFlag[],
    hasDuplicates: boolean
): { th: string; en: string } {
    // Count severity levels
    const warnings = flags.filter(f => f.severity === 'warning').length
    const infos = flags.filter(f => f.severity === 'info').length

    // Great photos - encourage
    if (overallScore >= 85 && imageCount >= 3) {
        return {
            th: '✨ รูปสวยมาก! พร้อมขายแล้ว',
            en: '✨ Beautiful photos! Ready to sell'
        }
    }

    // Good photos - gentle improvement
    if (overallScore >= 70) {
        if (imageCount < 5) {
            return {
                th: '👍 รูปดีแล้ว เพิ่มอีก 1-2 รูปจะยิ่งดี',
                en: '👍 Good photos! Add 1-2 more for better results'
            }
        }
        return {
            th: '👍 รูปดีแล้ว! เพิ่งพอ',
            en: '👍 Great photos! Just enough'
        }
    }

    // Multiple warnings - be helpful
    if (warnings > 2) {
        return {
            th: '💡 ลองถ่ายใหม่ในที่สว่างกว่านี้ จะช่วยให้ขายง่ายขึ้น',
            en: '💡 Try retaking in better lighting for easier selling'
        }
    }

    // Has duplicates
    if (hasDuplicates) {
        return {
            th: '📸 มีรูปคล้ายกัน ลองถ่ายมุมอื่นเพื่อแสดงรายละเอียด',
            en: '📸 Similar photos detected. Try different angles'
        }
    }

    // Few images
    if (imageCount < 3) {
        return {
            th: '📷 เพิ่มรูป 2-3 รูป จะทำให้ขายง่ายขึ้น ~30%',
            en: '📷 Add 2-3 more photos to increase sales by ~30%'
        }
    }

    // General encouragement
    if (overallScore >= 50) {
        return {
            th: '😊 รูปพอใช้แล้ว ถ้าเพิ่มจะดียิ่งขึ้น',
            en: '😊 Photos are okay. More would be even better'
        }
    }

    // Needs improvement - but stay positive
    return {
        th: '💪 ถ่ายเพิ่มอีกนิด จะช่วยให้สินค้าขายดีขึ้นเยอะ',
        en: '💪 A few more photos will help your product sell better'
    }
}

/**
 * Quick validation for mobile upload
 * Returns true if images are acceptable (no blocking issues)
 */
export function quickValidate(images: File[]): boolean {
    // Never block - always return true
    // This follows the "no blocking" rule
    return true
}

/**
 * Get a single color-coded quality grade
 */
export function getQualityGrade(score: number): {
    grade: 'A' | 'B' | 'C' | 'D' | 'F'
    color: string
    label: { th: string; en: string }
} {
    if (score >= 90) {
        return {
            grade: 'A',
            color: 'green',
            label: { th: 'เยี่ยม', en: 'Excellent' }
        }
    }
    if (score >= 75) {
        return {
            grade: 'B',
            color: 'blue',
            label: { th: 'ดี', en: 'Good' }
        }
    }
    if (score >= 60) {
        return {
            grade: 'C',
            color: 'yellow',
            label: { th: 'พอใช้', en: 'Fair' }
        }
    }
    if (score >= 40) {
        return {
            grade: 'D',
            color: 'orange',
            label: { th: 'ควรปรับปรุง', en: 'Needs Work' }
        }
    }
    return {
        grade: 'F',
        color: 'red',
        label: { th: 'ไม่พร้อม', en: 'Not Ready' }
    }
}

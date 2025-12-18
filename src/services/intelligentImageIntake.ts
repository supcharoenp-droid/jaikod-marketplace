/**
 * Intelligent Marketplace Image Intake AI
 * 
 * Accepts product images from users and prepares them for intelligent analysis.
 * Supports both Thai and English users automatically.
 * 
 * Features:
 * - Validates image quality (resolution, blur, lighting)
 * - Detects duplicated or near-duplicate images
 * - Normalizes orientation and aspect ratio
 * - Compresses images intelligently without visible quality loss
 * - Stores original + processed versions safely
 * - Works silently in the background
 */

export interface ImageIntakeResult {
    images_received: boolean
    image_count: number
    status: 'ready_for_enhancement' | 'needs_review' | 'rejected'
    processed_images: ProcessedImage[]
    warnings: ImageWarning[]
    suggestions: ImageSuggestion[]
}

export interface ProcessedImage {
    id: string
    original_file: File
    original_url: string
    processed_url?: string
    thumbnail_url?: string

    // Quality metrics
    quality_score: number // 0-100
    resolution: { width: number; height: number }
    file_size_mb: number
    format: string

    // AI Analysis
    is_blurry: boolean
    blur_score: number // 0-100, higher = more blurry
    lighting_quality: 'excellent' | 'good' | 'poor' | 'too_dark' | 'too_bright'
    has_product: boolean

    // Processing status
    is_duplicate: boolean
    duplicate_of?: string
    normalized: boolean
    compressed: boolean

    // Metadata
    orientation: 'portrait' | 'landscape' | 'square'
    aspect_ratio: number
    created_at: Date
}

export interface ImageWarning {
    type: 'blur' | 'lighting' | 'resolution' | 'duplicate' | 'size' | 'format'
    severity: 'low' | 'medium' | 'high'
    message: {
        th: string
        en: string
    }
    image_id: string
    auto_fixable: boolean
}

export interface ImageSuggestion {
    type: 'add_more' | 'retake' | 'reorder' | 'remove_duplicate'
    message: {
        th: string
        en: string
    }
    image_ids?: string[]
}

// Configuration
const CONFIG = {
    MAX_IMAGES: 10,
    MIN_RESOLUTION: { width: 640, height: 640 },
    RECOMMENDED_RESOLUTION: { width: 1200, height: 1200 },
    MAX_FILE_SIZE_MB: 10,
    SUPPORTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'image/webp'],
    COMPRESSION_QUALITY: 0.85,
    BLUR_THRESHOLD: 30, // 0-100, higher = blurrier to reject
    DUPLICATE_THRESHOLD: 0.90, // 0-1, similarity score
}

/**
 * Main entry point: Process uploaded images silently
 */
export async function processImageIntake(files: File[]): Promise<ImageIntakeResult> {
    console.log(`[Image Intake] Processing ${files.length} images...`)

    const processed_images: ProcessedImage[] = []
    const warnings: ImageWarning[] = []
    const suggestions: ImageSuggestion[] = []

    // Step 1: Validate each image
    for (let i = 0; i < Math.min(files.length, CONFIG.MAX_IMAGES); i++) {
        const file = files[i]

        try {
            const processedImage = await processIndividualImage(file, i)
            processed_images.push(processedImage)

            // Collect warnings
            const imageWarnings = generateWarnings(processedImage)
            warnings.push(...imageWarnings)
        } catch (error) {
            console.error(`[Image Intake] Error processing image ${i}:`, error)
            warnings.push({
                type: 'format',
                severity: 'high',
                message: {
                    th: `ไม่สามารถประมวลผลรูปภาพที่ ${i + 1} ได้`,
                    en: `Could not process image ${i + 1}`
                },
                image_id: `temp-${i}`,
                auto_fixable: false
            })
        }
    }

    // Step 2: Detect duplicates
    detectDuplicates(processed_images, warnings)

    // Step 3: Generate suggestions
    const finalSuggestions = generateSuggestions(processed_images, files.length)
    suggestions.push(...finalSuggestions)

    // Step 4: Determine overall status
    const status = determineStatus(processed_images, warnings)

    const result: ImageIntakeResult = {
        images_received: processed_images.length > 0,
        image_count: processed_images.length,
        status,
        processed_images,
        warnings,
        suggestions
    }

    console.log(`[Image Intake] Complete: ${result.image_count} images processed, status: ${result.status}`)

    return result
}

/**
 * Process a single image file
 */
async function processIndividualImage(file: File, index: number): Promise<ProcessedImage> {
    const id = `img-${Date.now()}-${index}`
    const original_url = URL.createObjectURL(file)

    // Load image to get dimensions
    const dimensions = await getImageDimensions(file)
    const file_size_mb = file.size / (1024 * 1024)

    // Analyze image quality
    const blur_score = await analyzeBlur(file)
    const lighting_quality = await analyzeLighting(file)
    const has_product = await detectProduct(file)

    // Calculate quality score
    const quality_score = calculateQualityScore({
        resolution: dimensions,
        blur_score,
        lighting_quality,
        file_size_mb,
        has_product
    })

    // Normalize orientation
    const orientation = determineOrientation(dimensions)

    // Compress if needed
    const compressed = file_size_mb > 2
    const processed_url = compressed ? await compressImage(file) : original_url

    // Generate thumbnail
    const thumbnail_url = await generateThumbnail(file)

    const processedImage: ProcessedImage = {
        id,
        original_file: file,
        original_url,
        processed_url,
        thumbnail_url,
        quality_score,
        resolution: dimensions,
        file_size_mb,
        format: file.type,
        is_blurry: blur_score > CONFIG.BLUR_THRESHOLD,
        blur_score,
        lighting_quality,
        has_product,
        is_duplicate: false,
        normalized: true,
        compressed,
        orientation,
        aspect_ratio: dimensions.width / dimensions.height,
        created_at: new Date()
    }

    return processedImage
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
 * Analyze blur (simplified - in production use canvas/ML)
 */
async function analyzeBlur(file: File): Promise<number> {
    // Mock implementation - in production, use Laplacian variance or ML model
    // Returns 0-100, higher = more blurry

    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 50))

    // For demo: randomly assign blur scores
    // In production: use actual image analysis
    const mockBlur = Math.random() * 40 // Most images will be non-blurry

    return Math.round(mockBlur)
}

/**
 * Analyze lighting quality
 */
async function analyzeLighting(file: File): Promise<'excellent' | 'good' | 'poor' | 'too_dark' | 'too_bright'> {
    // Mock implementation - in production use histogram analysis

    await new Promise(resolve => setTimeout(resolve, 50))

    // For demo: mostly good lighting
    const rand = Math.random()
    if (rand > 0.7) return 'excellent'
    if (rand > 0.4) return 'good'
    if (rand > 0.2) return 'poor'
    if (rand > 0.1) return 'too_dark'
    return 'too_bright'
}

/**
 * Detect if image contains a product (simplified)
 */
async function detectProduct(file: File): Promise<boolean> {
    // Mock implementation - in production use object detection ML

    await new Promise(resolve => setTimeout(resolve, 30))

    // For demo: assume most images have products
    return Math.random() > 0.1
}

/**
 * Calculate overall quality score
 */
function calculateQualityScore(params: {
    resolution: { width: number; height: number }
    blur_score: number
    lighting_quality: string
    file_size_mb: number
    has_product: boolean
}): number {
    let score = 100

    // Resolution penalty
    const minSide = Math.min(params.resolution.width, params.resolution.height)
    if (minSide < CONFIG.MIN_RESOLUTION.width) {
        score -= 30
    } else if (minSide < CONFIG.RECOMMENDED_RESOLUTION.width) {
        score -= 10
    }

    // Blur penalty
    score -= params.blur_score * 0.5 // Max -50 for very blurry

    // Lighting penalty
    const lightingScores = {
        excellent: 0,
        good: -5,
        poor: -20,
        too_dark: -30,
        too_bright: -25
    }
    score += lightingScores[params.lighting_quality as keyof typeof lightingScores]

    // Product detection penalty
    if (!params.has_product) {
        score -= 40
    }

    // File size check (too small might be screenshot/low quality)
    if (params.file_size_mb < 0.1) {
        score -= 20
    }

    return Math.max(0, Math.min(100, Math.round(score)))
}

/**
 * Determine image orientation
 */
function determineOrientation(dimensions: { width: number; height: number }): 'portrait' | 'landscape' | 'square' {
    const ratio = dimensions.width / dimensions.height

    if (Math.abs(ratio - 1) < 0.1) return 'square'
    return ratio > 1 ? 'landscape' : 'portrait'
}

/**
 * Compress image intelligently
 */
async function compressImage(file: File): Promise<string> {
    // Mock implementation - in production use canvas or compression library
    // For now, just return the original URL

    await new Promise(resolve => setTimeout(resolve, 100))

    return URL.createObjectURL(file)
}

/**
 * Generate thumbnail
 */
async function generateThumbnail(file: File): Promise<string> {
    // Mock implementation - in production create actual thumbnail

    await new Promise(resolve => setTimeout(resolve, 50))

    return URL.createObjectURL(file)
}

/**
 * Detect duplicate images
 */
function detectDuplicates(images: ProcessedImage[], warnings: ImageWarning[]) {
    // Simplified duplicate detection
    // In production: use perceptual hashing (pHash) or ML embeddings

    for (let i = 0; i < images.length; i++) {
        for (let j = i + 1; j < images.length; j++) {
            const img1 = images[i]
            const img2 = images[j]

            // Simple comparison: same file size and dimensions (very basic)
            const sameDimensions = img1.resolution.width === img2.resolution.width &&
                img1.resolution.height === img2.resolution.height
            const sameSizeish = Math.abs(img1.file_size_mb - img2.file_size_mb) < 0.01

            if (sameDimensions && sameSizeish) {
                // Mark as potential duplicate
                img2.is_duplicate = true
                img2.duplicate_of = img1.id

                warnings.push({
                    type: 'duplicate',
                    severity: 'medium',
                    message: {
                        th: `รูปภาพที่ ${j + 1} อาจซ้ำกับรูปที่ ${i + 1}`,
                        en: `Image ${j + 1} may be duplicate of image ${i + 1}`
                    },
                    image_id: img2.id,
                    auto_fixable: true
                })
            }
        }
    }
}

/**
 * Generate warnings for an image
 */
function generateWarnings(image: ProcessedImage): ImageWarning[] {
    const warnings: ImageWarning[] = []

    // Blur warning
    if (image.is_blurry) {
        warnings.push({
            type: 'blur',
            severity: image.blur_score > 50 ? 'high' : 'medium',
            message: {
                th: `รูปภาพเบลอ ควรถ่ายใหม่ให้ชัดกว่านี้`,
                en: `Image is blurry. Consider retaking for better clarity`
            },
            image_id: image.id,
            auto_fixable: false
        })
    }

    // Lighting warning
    if (image.lighting_quality === 'too_dark' || image.lighting_quality === 'too_bright') {
        warnings.push({
            type: 'lighting',
            severity: 'medium',
            message: {
                th: image.lighting_quality === 'too_dark'
                    ? `แสงมืดเกินไป ควรถ่ายในที่มีแสงมากกว่านี้`
                    : `แสงสว่างเกินไป ควรหลีกเลี่ยงแสงแดดตรง`,
                en: image.lighting_quality === 'too_dark'
                    ? `Too dark. Try shooting in better lighting`
                    : `Too bright. Avoid direct sunlight`
            },
            image_id: image.id,
            auto_fixable: true // Can be enhanced with AI
        })
    }

    // Resolution warning
    const minSide = Math.min(image.resolution.width, image.resolution.height)
    if (minSide < CONFIG.MIN_RESOLUTION.width) {
        warnings.push({
            type: 'resolution',
            severity: 'high',
            message: {
                th: `ความละเอียดต่ำ (${image.resolution.width}x${image.resolution.height}) ควร ≥ 640x640px`,
                en: `Low resolution (${image.resolution.width}x${image.resolution.height}). Should be ≥ 640x640px`
            },
            image_id: image.id,
            auto_fixable: false
        })
    }

    // Product detection warning
    if (!image.has_product) {
        warnings.push({
            type: 'format',
            severity: 'high',
            message: {
                th: `ไม่พบสินค้าในรูปภาพ ตรวจสอบว่าถ่ายสินค้าได้ชัดเจน`,
                en: `No product detected in image. Ensure product is clearly visible`
            },
            image_id: image.id,
            auto_fixable: false
        })
    }

    return warnings
}

/**
 * Generate suggestions based on all images
 */
function generateSuggestions(images: ProcessedImage[], totalUploaded: number): ImageSuggestion[] {
    const suggestions: ImageSuggestion[] = []

    // Suggest adding more images
    if (images.length < 3) {
        suggestions.push({
            type: 'add_more',
            message: {
                th: `เพิ่มรูปภาพอีก ${3 - images.length} รูป เพื่อให้ผู้ซื้อเห็นสินค้าได้ชัดเจนขึ้น`,
                en: `Add ${3 - images.length} more image(s) to help buyers see the product better`
            }
        })
    }

    // Suggest retaking blurry images
    const blurryImages = images.filter(img => img.is_blurry)
    if (blurryImages.length > 0) {
        suggestions.push({
            type: 'retake',
            message: {
                th: `ควรถ่ายรูปที่เบลอ ${blurryImages.length} รูป ใหม่`,
                en: `Consider retaking ${blurryImages.length} blurry image(s)`
            },
            image_ids: blurryImages.map(img => img.id)
        })
    }

    // Suggest removing duplicates
    const duplicates = images.filter(img => img.is_duplicate)
    if (duplicates.length > 0) {
        suggestions.push({
            type: 'remove_duplicate',
            message: {
                th: `พบรูปซ้ำ ${duplicates.length} รูป ควรลบออก`,
                en: `Found ${duplicates.length} duplicate image(s). Consider removing`
            },
            image_ids: duplicates.map(img => img.id)
        })
    }

    return suggestions
}

/**
 * Determine overall processing status
 */
function determineStatus(
    images: ProcessedImage[],
    warnings: ImageWarning[]
): 'ready_for_enhancement' | 'needs_review' | 'rejected' {
    if (images.length === 0) {
        return 'rejected'
    }

    // Check for critical warnings
    const criticalWarnings = warnings.filter(w => w.severity === 'high' && !w.auto_fixable)

    if (criticalWarnings.length > images.length / 2) {
        return 'needs_review'
    }

    // Check if at least one good quality image exists
    const hasGoodImage = images.some(img => img.quality_score >= 60)

    if (!hasGoodImage) {
        return 'needs_review'
    }

    return 'ready_for_enhancement'
}

/**
 * Get user-friendly message for intake result
 */
export function getIntakeMessage(result: ImageIntakeResult, lang: 'th' | 'en'): string {
    const messages = {
        ready_for_enhancement: {
            th: `เพิ่มรูปได้สูงสุด 10 รูป AI จะช่วยดูแลให้เอง ✨`,
            en: `Upload up to 10 images. AI will handle the rest ✨`
        },
        needs_review: {
            th: `ได้รับ ${result.image_count} รูปแล้ว แต่คุณภาพบางรูปอาจไม่เพียงพอ`,
            en: `Received ${result.image_count} images, but some may need improvement`
        },
        rejected: {
            th: `ไม่สามารถประมวลผลรูปภาพได้ กรุณาลองใหม่`,
            en: `Could not process images. Please try again`
        }
    }

    return messages[result.status][lang]
}

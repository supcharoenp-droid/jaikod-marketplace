/**
 * AI Image Analysis Service
 * Step 1 & 2: Image Intake and Quality Analysis
 */

export interface ImageQualityAnalysis {
    qualityScore: number // 0-100
    sharpness: 'excellent' | 'good' | 'fair' | 'poor'
    lighting: 'excellent' | 'good' | 'fair' | 'poor'
    objectVisibility: 'excellent' | 'good' | 'fair' | 'poor'
    backgroundComplexity: 'simple' | 'moderate' | 'complex'
    isBlurry: boolean
    hasGoodLighting: boolean
    hasCleanBackground: boolean
    detectedObjects: string[]
    dominantColors: string[]
    recommendations: ImageRecommendation[]
}

export interface ImageRecommendation {
    type: 'background_removal' | 'light_enhancement' | 'crop' | 'reorder' | 'retake'
    priority: 'high' | 'medium' | 'low'
    title: {
        th: string
        en: string
    }
    description: {
        th: string
        en: string
    }
    canAutoApply: boolean
}

export interface ImageEnhancement {
    original: string
    enhanced?: string
    backgroundRemoved?: string
    thumbnails: {
        small: string
        medium: string
        large: string
    }
}

export interface ProductImageAnalysis {
    images: Array<{
        id: string
        file: File
        preview: string
        analysis: ImageQualityAnalysis
        enhancement?: ImageEnhancement
        isCover: boolean
        order: number
    }>
    overallScore: number
    readyToPublish: boolean
    criticalIssues: string[]
    suggestions: {
        th: string[]
        en: string[]
    }
}

/**
 * Analyze image quality for product listing
 */
export async function analyzeImageQuality(file: File): Promise<ImageQualityAnalysis> {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1200))

    // Mock analysis based on file characteristics
    const fileName = file.name.toLowerCase()
    const fileSize = file.size

    // Simulate quality detection
    const isLowQuality = fileSize < 100000 || fileName.includes('thumb')
    const hasGoodName = fileName.includes('product') || fileName.includes('item')

    // Base quality score
    let qualityScore = 75 + Math.floor(Math.random() * 20)
    if (isLowQuality) qualityScore -= 30
    if (hasGoodName) qualityScore += 5

    // Determine attributes
    const sharpness = qualityScore > 85 ? 'excellent' : qualityScore > 70 ? 'good' : qualityScore > 50 ? 'fair' : 'poor'
    const lighting = qualityScore > 80 ? 'excellent' : qualityScore > 65 ? 'good' : qualityScore > 45 ? 'fair' : 'poor'
    const objectVisibility = qualityScore > 82 ? 'excellent' : qualityScore > 68 ? 'good' : qualityScore > 48 ? 'fair' : 'poor'
    const backgroundComplexity = Math.random() > 0.6 ? 'complex' : Math.random() > 0.3 ? 'moderate' : 'simple'

    const isBlurry = qualityScore < 60
    const hasGoodLighting = qualityScore > 70
    const hasCleanBackground = backgroundComplexity === 'simple'

    // Generate recommendations
    const recommendations: ImageRecommendation[] = []

    if (backgroundComplexity !== 'simple') {
        recommendations.push({
            type: 'background_removal',
            priority: 'high',
            title: {
                th: 'ลบพื้นหลังอัตโนมัติ',
                en: 'Remove Background'
            },
            description: {
                th: 'ทำให้สินค้าโดดเด่นขึ้นด้วยพื้นหลังสีขาวสะอาด',
                en: 'Make your product stand out with clean white background'
            },
            canAutoApply: false
        })
    }

    if (!hasGoodLighting) {
        recommendations.push({
            type: 'light_enhancement',
            priority: 'medium',
            title: {
                th: 'ปรับแสงอัตโนมัติ',
                en: 'Enhance Lighting'
            },
            description: {
                th: 'ปรับความสว่างและคมชัดให้เหมาะสม',
                en: 'Adjust brightness and clarity automatically'
            },
            canAutoApply: false
        })
    }

    if (isBlurry) {
        recommendations.push({
            type: 'retake',
            priority: 'high',
            title: {
                th: 'แนะนำถ่ายใหม่',
                en: 'Retake Photo'
            },
            description: {
                th: 'ภาพมีความคมชัดไม่เพียงพอ แนะนำถ่ายรูปใหม่เพื่อผลลัพธ์ที่ดีกว่า',
                en: 'Image is not sharp enough. Please retake for better results'
            },
            canAutoApply: false
        })
    }

    // Mock detected objects
    const detectedObjects = ['product', 'item', 'object']
    const dominantColors = ['#FFFFFF', '#F5F5F5', '#E8E8E8']

    return {
        qualityScore,
        sharpness,
        lighting,
        objectVisibility,
        backgroundComplexity,
        isBlurry,
        hasGoodLighting,
        hasCleanBackground,
        detectedObjects,
        dominantColors,
        recommendations
    }
}

/**
 * Analyze multiple images for product listing
 */
export async function analyzeProductImages(files: File[]): Promise<ProductImageAnalysis> {
    const imageAnalyses = await Promise.all(
        files.map(async (file, index) => {
            const preview = URL.createObjectURL(file)
            const analysis = await analyzeImageQuality(file)

            return {
                id: `img-${Date.now()}-${index}`,
                file,
                preview,
                analysis,
                isCover: index === 0,
                order: index
            }
        })
    )

    // Calculate overall score
    const overallScore = Math.floor(
        imageAnalyses.reduce((sum, img) => sum + img.analysis.qualityScore, 0) / imageAnalyses.length
    )

    // Check for critical issues
    const criticalIssues: string[] = []
    const allBlurry = imageAnalyses.every(img => img.analysis.isBlurry)
    const noCoverImage = imageAnalyses.length === 0

    if (noCoverImage) criticalIssues.push('no_images')
    if (allBlurry) criticalIssues.push('all_images_blurry')
    if (imageAnalyses.length < 3) criticalIssues.push('insufficient_images')

    // Generate suggestions
    const suggestionsEn: string[] = []
    const suggestionsTh: string[] = []

    if (imageAnalyses.length < 3) {
        suggestionsTh.push('เพิ่มรูปภาพเพื่อเพิ่มโอกาสในการขาย (แนะนำ 3-5 รูป)')
        suggestionsEn.push('Add more photos to increase sales potential (3-5 recommended)')
    }

    if (overallScore < 70) {
        suggestionsTh.push('คุณภาพรูปภาพต่ำกว่ามาตรฐาน แนะนำปรับปรุงด้วย AI Enhancement')
        suggestionsEn.push('Image quality is below standard. Consider using AI Enhancement')
    }

    const hasComplexBg = imageAnalyses.some(img => img.analysis.backgroundComplexity === 'complex')
    if (hasComplexBg) {
        suggestionsTh.push('ใช้ฟีเจอร์ลบพื้นหลังเพื่อให้สินค้าดูโดดเด่นขึ้น')
        suggestionsEn.push('Use background removal to make your product stand out')
    }

    return {
        images: imageAnalyses,
        overallScore,
        readyToPublish: overallScore >= 60 && criticalIssues.length === 0,
        criticalIssues,
        suggestions: {
            th: suggestionsTh,
            en: suggestionsEn
        }
    }
}

/**
 * Simulate AI background removal
 */
export async function removeBackground(imageUrl: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1500))
    // In production, this would call a real background removal API
    // For now, return the original image
    return imageUrl
}

/**
 * Simulate AI image enhancement
 */
export async function enhanceImage(imageUrl: string): Promise<string> {
    await new Promise(resolve => setTimeout(resolve, 1200))
    // In production, this would call a real image enhancement API
    return imageUrl
}

/**
 * Get AI feedback message for image quality
 */
export function getImageQualityFeedback(
    analysis: ImageQualityAnalysis,
    lang: 'th' | 'en'
): string {
    const score = analysis.qualityScore

    if (lang === 'th') {
        if (score >= 85) {
            return 'ภาพชัดมาก เห็นรายละเอียดสินค้าได้ดีเยี่ยม 👍'
        } else if (score >= 70) {
            return 'ภาพชัด เห็นรายละเอียดสินค้าได้ดี 👍'
        } else if (score >= 50) {
            return 'ภาพใช้ได้ แต่อาจปรับปรุงได้ดีกว่านี้ 💡'
        } else {
            return 'ภาพไม่ชัดพอ แนะนำถ่ายใหม่หรือปรับปรุงด้วย AI ⚠️'
        }
    } else {
        if (score >= 85) {
            return 'Excellent image quality with clear product details 👍'
        } else if (score >= 70) {
            return 'Good image quality, product is clearly visible 👍'
        } else if (score >= 50) {
            return 'Acceptable quality but could be improved 💡'
        } else {
            return 'Image quality needs improvement. Consider retaking or using AI enhancement ⚠️'
        }
    }
}

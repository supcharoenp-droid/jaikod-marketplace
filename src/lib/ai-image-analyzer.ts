/**
 * AI Image Analyzer
 * 
 * ฟีเจอร์:
 * 1. Quality Analysis - วิเคราะห์คุณภาพรูป
 * 2. Object Detection - ตรวจจับวัตถุ (mock)
 * 3. Smart Recommendations - แนะนำปรับปรุง
 * 
 * เทคโนโลยี: Canvas API (ฟรี 100%)
 */

export interface ImageAnalysisResult {
    score: number // 0-100
    grade: 'A' | 'B' | 'C' | 'D' | 'F'
    width: number
    height: number
    brightness: number
    contrast: number
    sharpness: number
    fileSize: number
    issues: string[]
    suggestions: string[]
    detectedObjects?: string[]
    isMainImageCandidate: boolean
}

/**
 * Load image from File
 */
function loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const url = URL.createObjectURL(file)

        img.onload = () => {
            URL.revokeObjectURL(url)
            resolve(img)
        }

        img.onerror = () => {
            URL.revokeObjectURL(url)
            reject(new Error('Failed to load image'))
        }

        img.src = url
    })
}

/**
 * Calculate brightness (0-255)
 */
function calculateBrightness(imageData: ImageData): number {
    let total = 0
    const pixels = imageData.data.length / 4

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i]
        const g = imageData.data[i + 1]
        const b = imageData.data[i + 2]
        total += (r + g + b) / 3
    }

    return total / pixels
}

/**
 * Calculate contrast
 */
function calculateContrast(imageData: ImageData): number {
    const brightness = calculateBrightness(imageData)
    let variance = 0
    const pixels = imageData.data.length / 4

    for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i]
        const g = imageData.data[i + 1]
        const b = imageData.data[i + 2]
        const pixelBrightness = (r + g + b) / 3
        variance += Math.pow(pixelBrightness - brightness, 2)
    }

    return Math.sqrt(variance / pixels)
}

/**
 * Calculate sharpness (Laplacian variance)
 */
function calculateSharpness(imageData: ImageData): number {
    const width = imageData.width
    const height = imageData.height
    let total = 0
    let count = 0

    // Sample every 10 pixels for performance
    for (let y = 1; y < height - 1; y += 10) {
        for (let x = 1; x < width - 1; x += 10) {
            const idx = (y * width + x) * 4
            const center = imageData.data[idx]
            const top = imageData.data[((y - 1) * width + x) * 4]
            const bottom = imageData.data[((y + 1) * width + x) * 4]
            const left = imageData.data[(y * width + (x - 1)) * 4]
            const right = imageData.data[(y * width + (x + 1)) * 4]

            const laplacian = Math.abs(4 * center - top - bottom - left - right)
            total += laplacian
            count++
        }
    }

    return total / count
}

/**
 * Get grade from score
 */
function getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A'
    if (score >= 80) return 'B'
    if (score >= 70) return 'C'
    if (score >= 60) return 'D'
    return 'F'
}

/**
 * Detect objects (Mock - จะเปลี่ยนเป็น TensorFlow.js ทีหลัง)
 */
function mockObjectDetection(imageData: ImageData): string[] {
    const brightness = calculateBrightness(imageData)
    const contrast = calculateContrast(imageData)

    // Simple heuristics for demo
    const objects: string[] = []

    if (contrast > 40) {
        objects.push('วัตถุชัดเจน')
    }

    if (brightness > 150) {
        objects.push('พื้นหลังสว่าง')
    } else if (brightness < 100) {
        objects.push('พื้นหลังมืด')
    }

    return objects
}

/**
 * Analyze single image
 */
export async function analyzeImage(file: File): Promise<ImageAnalysisResult> {
    try {
        // Load image
        const img = await loadImage(file)

        // Create canvas
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        // Set canvas size (sample down for performance)
        const maxDim = 1000
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
        canvas.width = img.width * scale
        canvas.height = img.height * scale

        // Draw image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

        // Calculate metrics
        const brightness = calculateBrightness(imageData)
        const contrast = calculateContrast(imageData)
        const sharpness = calculateSharpness(imageData)

        // Calculate score
        let score = 50 // Base score

        // Resolution (+20 points)
        if (img.width >= 1000 && img.height >= 1000) {
            score += 20
        } else if (img.width >= 800 && img.height >= 800) {
            score += 15
        } else if (img.width >= 600 && img.height >= 600) {
            score += 10
        }

        // Brightness (+15 points)
        if (brightness >= 100 && brightness <= 180) {
            score += 15
        } else if (brightness >= 80 && brightness <= 200) {
            score += 10
        } else if (brightness >= 60 && brightness <= 220) {
            score += 5
        }

        // Contrast (+10 points)
        if (contrast >= 40) {
            score += 10
        } else if (contrast >= 30) {
            score += 5
        }

        // Sharpness (+5 points)
        if (sharpness >= 30) {
            score += 5
        }

        // File size penalty
        const sizeMB = file.size / (1024 * 1024)
        if (sizeMB > 3) {
            score -= 5
        }

        // Ensure score is 0-100
        score = Math.max(0, Math.min(100, score))

        // Detect issues
        const issues: string[] = []
        const suggestions: string[] = []

        if (img.width < 800 || img.height < 800) {
            issues.push('ความละเอียดต่ำ')
            suggestions.push('ควรใช้รูปขนาดอย่างน้อย 1000x1000 พิกเซล')
        }

        if (brightness < 80) {
            issues.push('มืดเกินไป')
            suggestions.push('เพิ่มแสงหรือถ่ายในที่สว่าง')
        } else if (brightness > 200) {
            issues.push('สว่างเกินไป')
            suggestions.push('ลดแสงหรือหลีกเลี่ยงแสงส่องตรง')
        }

        if (contrast < 30) {
            issues.push('ภาพจางเกินไป')
            suggestions.push('เพิ่มความตัดกันของสี')
        }

        if (sharpness < 20) {
            issues.push('ภาพเบลอ')
            suggestions.push('โฟกัสให้ชัด หรือตั้งกล้องให้นิ่ง')
        }

        if (sizeMB > 3) {
            issues.push('ขนาดไฟล์ใหญ่เกินไป')
            suggestions.push('บีบอัดรูปให้เล็กลง (< 3MB)')
        }

        // Detect objects (mock)
        const detectedObjects = mockObjectDetection(imageData)

        // Determine if this is a good main image candidate
        const isMainImageCandidate = score >= 80 &&
            brightness >= 100 && brightness <= 180 &&
            contrast >= 35 &&
            img.width >= 1000

        return {
            score,
            grade: getGrade(score),
            width: img.width,
            height: img.height,
            brightness,
            contrast,
            sharpness,
            fileSize: file.size,
            issues,
            suggestions,
            detectedObjects,
            isMainImageCandidate
        }
    } catch (error) {
        console.error('Image analysis error:', error)

        // Return default result on error
        return {
            score: 0,
            grade: 'F',
            width: 0,
            height: 0,
            brightness: 0,
            contrast: 0,
            sharpness: 0,
            fileSize: file.size,
            issues: ['ไม่สามารถวิเคราะห์รูปได้'],
            suggestions: ['ลองใช้รูปอื่น'],
            isMainImageCandidate: false
        }
    }
}

/**
 * Analyze multiple images
 */
export async function analyzeImages(files: File[]): Promise<ImageAnalysisResult[]> {
    const results: ImageAnalysisResult[] = []

    for (const file of files) {
        const result = await analyzeImage(file)
        results.push(result)
    }

    return results
}

/**
 * Find best main image
 */
export function findBestMainImage(results: ImageAnalysisResult[]): number {
    let bestIndex = 0
    let bestScore = results[0]?.score || 0

    for (let i = 1; i < results.length; i++) {
        if (results[i].score > bestScore) {
            bestScore = results[i].score
            bestIndex = i
        }
    }

    return bestIndex
}

/**
 * Generate overall tips
 */
export function generateOverallTips(results: ImageAnalysisResult[]): string[] {
    const tips: string[] = []
    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length

    if (results.length < 3) {
        tips.push(`เพิ่มอีก ${3 - results.length} รูป เพื่อเพิ่มโอกาสขาย +${18 * (3 - results.length)}%`)
    }

    if (avgScore < 70) {
        tips.push('คุณภาพรูปโดยรวมต่ำ ควรถ่ายใหม่ในสถานที่สว่างและโฟกัสให้ชัด')
    } else if (avgScore < 85) {
        tips.push('คุณภาพรูปดี แต่ยังปรับปรุงได้')
    } else {
        tips.push('คุณภาพรูปดีมาก! พร้อมเผยแพร่')
    }

    const hasLowRes = results.some(r => r.width < 1000 || r.height < 1000)
    if (hasLowRes) {
        tips.push('บางรูปมีความละเอียดต่ำ ควรใช้รูปขนาด 1000x1000 พิกเซลขึ้นไป')
    }

    const hasDarkImages = results.some(r => r.brightness < 100)
    if (hasDarkImages) {
        tips.push('บางรูปมืดเกินไป ควรถ่ายในที่สว่างหรือเปิดไฟเพิ่ม')
    }

    const bestMainIndex = findBestMainImage(results)
    if (bestMainIndex !== 0) {
        tips.push(`รูปที่ ${bestMainIndex + 1} เหมาะเป็นภาพหลักมากกว่า ควรย้ายไปลำดับแรก`)
    }

    return tips
}

/**
 * Predict price range based on image quality (Mock)
 */
export function predictPriceMultiplier(avgScore: number): number {
    if (avgScore >= 90) return 1.2 // +20% for excellent photos
    if (avgScore >= 80) return 1.1 // +10% for good photos
    if (avgScore >= 70) return 1.0 // Normal price
    if (avgScore >= 60) return 0.95 // -5% for fair photos
    return 0.9 // -10% for poor photos
}

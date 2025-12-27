/**
 * Screenshot & Desktop Detector
 * 
 * Detects if an uploaded image is a screenshot or desktop capture
 * instead of an actual product photo.
 * 
 * This prevents AI from misidentifying monitors/laptops as phones.
 */

export interface ScreenshotDetectionResult {
    isScreenshot: boolean
    confidence: number
    reasons: string[]
}

/**
 * Detect if image is a screenshot based on visual patterns
 */
export async function detectScreenshot(imageFile: File): Promise<ScreenshotDetectionResult> {
    const reasons: string[] = []
    let confidence = 0

    // Load image to analyze
    const imageUrl = URL.createObjectURL(imageFile)
    const img = new Image()

    await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
        img.src = imageUrl
    })

    // Create canvas for analysis
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    if (!ctx) return { isScreenshot: false, confidence: 0, reasons: [] }

    canvas.width = img.width
    canvas.height = img.height
    ctx.drawImage(img, 0, 0)

    // Analyze image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    // ============================================
    // DETECTION #1: UI Elements Pattern
    // ============================================
    // Screenshots often have:
    // - Title bars (solid color strips at top)
    // - Menu bars
    // - High contrast text on solid backgrounds

    const topRowColors = new Set<string>()
    const topRowHeight = Math.min(50, canvas.height)

    for (let y = 0; y < topRowHeight; y++) {
        for (let x = 0; x < canvas.width; x += 10) {
            const i = (y * canvas.width + x) * 4
            const r = pixels[i]
            const g = pixels[i + 1]
            const b = pixels[i + 2]
            topRowColors.add(`${r},${g},${b}`)
        }
    }

    // If top row has very few colors (2-5), likely a title bar
    if (topRowColors.size < 5) {
        confidence += 30
        reasons.push('Detected solid-color top bar (likely UI)')
    }

    // ============================================
    // DETECTION #2: Aspect Ratio Check
    // ============================================
    // Desktop screenshots: 16:9, 16:10, 21:9
    // Product photos: Usually 4:3, 1:1, 3:4 (portrait)

    const aspectRatio = canvas.width / canvas.height
    const isDesktopRatio = (
        (aspectRatio > 1.6 && aspectRatio < 1.8) ||  // 16:9
        (aspectRatio > 1.55 && aspectRatio < 1.65) || // 16:10
        (aspectRatio > 2.2 && aspectRatio < 2.4)      // 21:9
    )

    if (isDesktopRatio) {
        confidence += 20
        reasons.push(`Desktop aspect ratio detected (${aspectRatio.toFixed(2)}:1)`)
    }

    // ============================================
    // DETECTION #3: Text Density
    // ============================================
    // Screenshots have high text density (code, menus, etc.)
    // We detect this by looking for high-contrast edges

    let edgeCount = 0
    const sampleSize = 100 // Sample every 100th pixel for performance

    for (let i = 0; i < pixels.length; i += sampleSize * 4) {
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]
        const nextR = pixels[i + 4] || r
        const nextG = pixels[i + 5] || g
        const nextB = pixels[i + 6] || b

        const diff = Math.abs(r - nextR) + Math.abs(g - nextG) + Math.abs(b - nextB)
        if (diff > 100) edgeCount++
    }

    const edgeDensity = edgeCount / (pixels.length / sampleSize)

    if (edgeDensity > 0.15) { // High edge density = lots of text/UI
        confidence += 25
        reasons.push('High text/UI density detected')
    }

    // ============================================
    // DETECTION #4: File Metadata
    // ============================================
    // Screenshots often have specific naming patterns
    const filename = imageFile.name.toLowerCase()
    const screenshotKeywords = [
        'screenshot', 'screen shot', 'screen_shot',
        'capture', 'snap', 'desktop',
        'scr_', 'img_202' // Common screenshot prefixes
    ]

    if (screenshotKeywords.some(kw => filename.includes(kw))) {
        confidence += 15
        reasons.push(`Filename suggests screenshot: "${imageFile.name}"`)
    }

    // ============================================
    // DETECTION #5: Color Palette
    // ============================================
    // Real product photos: Varied, natural colors
    // Screenshots: Limited palette (UI themes)

    const uniqueColors = new Set<string>()
    for (let i = 0; i < pixels.length; i += 400) { // Sample
        const r = pixels[i]
        const g = pixels[i + 1]
        const b = pixels[i + 2]

        // Round to reduce noise
        const roundedR = Math.round(r / 10) * 10
        const roundedG = Math.round(g / 10) * 10
        const roundedB = Math.round(b / 10) * 10
        uniqueColors.add(`${roundedR},${roundedG},${roundedB}`)
    }

    if (uniqueColors.size < 50) {
        confidence += 10
        reasons.push(`Limited color palette (${uniqueColors.size} colors)`)
    }

    // Clean up
    URL.revokeObjectURL(imageUrl)

    // ============================================
    // FINAL DECISION
    // ============================================
    const isScreenshot = confidence >= 50

    console.log('📸 Screenshot Detection:', {
        isScreenshot,
        confidence: `${confidence}%`,
        reasons
    })

    return {
        isScreenshot,
        confidence,
        reasons
    }
}

/**
 * Lightweight check (filename only) for quick pre-filtering
 */
export function quickScreenshotCheck(filename: string): boolean {
    const lower = filename.toLowerCase()
    const keywords = ['screenshot', 'screen', 'capture', 'desktop', 'scr_']
    return keywords.some(kw => lower.includes(kw))
}

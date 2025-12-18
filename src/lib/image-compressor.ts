/**
 * Image Compression Utility
 * 
 * ย่อรูปอัตโนมัติ (Client-side) เหมือน Shopee/Lazada
 * 
 * Features:
 * - Auto resize ถ้ารูปใหญ่เกินไป
 * - Auto compress ถ้าไฟล์ใหญ่เกิน 5MB
 * - รักษาคุณภาพที่ยอมรับได้
 * - แปลงเป็น JPEG (เบากว่า PNG)
 * 
 * เทคโนโลยี: Canvas API (ฟรี 100%)
 */

export interface CompressionOptions {
    maxWidth?: number
    maxHeight?: number
    maxSizeMB?: number
    quality?: number // 0-1
    outputFormat?: 'image/jpeg' | 'image/webp' | 'image/png'
}

export interface CompressionResult {
    file: File
    originalSize: number
    compressedSize: number
    compressionRatio: number
    wasCompressed: boolean
    width: number
    height: number
}

/**
 * Load image from file
 */
function loadImageFromFile(file: File): Promise<HTMLImageElement> {
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
 * Calculate new dimensions
 */
function calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidth: number,
    maxHeight: number
): { width: number; height: number } {
    let width = originalWidth
    let height = originalHeight

    // Scale down if too large
    if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = Math.round(width * ratio)
        height = Math.round(height * ratio)
    }

    return { width, height }
}

/**
 * Compress image using Canvas
 */
async function compressImageWithCanvas(
    img: HTMLImageElement,
    quality: number,
    outputFormat: string,
    maxWidth: number,
    maxHeight: number
): Promise<Blob> {
    const { width, height } = calculateDimensions(
        img.width,
        img.height,
        maxWidth,
        maxHeight
    )

    // Create canvas
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    // Draw image
    const ctx = canvas.getContext('2d')!
    ctx.imageSmoothingEnabled = true
    ctx.imageSmoothingQuality = 'high'
    ctx.drawImage(img, 0, 0, width, height)

    // Convert to blob
    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    resolve(blob)
                } else {
                    reject(new Error('Failed to compress image'))
                }
            },
            outputFormat,
            quality
        )
    })
}

/**
 * Compress image file
 */
export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<CompressionResult> {
    const {
        maxWidth = 2000,
        maxHeight = 2000,
        maxSizeMB = 5,
        quality = 0.85,
        outputFormat = 'image/jpeg'
    } = options

    const originalSize = file.size
    const maxSizeBytes = maxSizeMB * 1024 * 1024

    try {
        // Load image
        const img = await loadImageFromFile(file)

        // Check if compression needed
        const needsResize = img.width > maxWidth || img.height > maxHeight
        const needsCompress = originalSize > maxSizeBytes

        if (!needsResize && !needsCompress) {
            // No compression needed
            return {
                file,
                originalSize,
                compressedSize: originalSize,
                compressionRatio: 1.0,
                wasCompressed: false,
                width: img.width,
                height: img.height
            }
        }

        // Compress image
        let currentQuality = quality
        let blob: Blob
        let attempts = 0
        const maxAttempts = 5

        // Try to compress until size is acceptable
        do {
            blob = await compressImageWithCanvas(
                img,
                currentQuality,
                outputFormat,
                maxWidth,
                maxHeight
            )

            // If still too large, reduce quality
            if (blob.size > maxSizeBytes && attempts < maxAttempts) {
                currentQuality *= 0.9 // Reduce quality by 10%
                attempts++
            } else {
                break
            }
        } while (blob.size > maxSizeBytes && attempts < maxAttempts)

        // Create new file
        const fileName = file.name.replace(/\.[^/.]+$/, '.jpg')
        const compressedFile = new File([blob], fileName, {
            type: outputFormat,
            lastModified: Date.now()
        })

        const { width, height } = calculateDimensions(
            img.width,
            img.height,
            maxWidth,
            maxHeight
        )

        return {
            file: compressedFile,
            originalSize,
            compressedSize: compressedFile.size,
            compressionRatio: compressedFile.size / originalSize,
            wasCompressed: true,
            width,
            height
        }
    } catch (error) {
        console.error('Compression error:', error)

        // Return original file if compression fails
        return {
            file,
            originalSize,
            compressedSize: originalSize,
            compressionRatio: 1.0,
            wasCompressed: false,
            width: 0,
            height: 0
        }
    }
}

/**
 * Compress multiple images
 */
export async function compressImages(
    files: File[],
    options: CompressionOptions = {}
): Promise<CompressionResult[]> {
    const results: CompressionResult[] = []

    for (const file of files) {
        const result = await compressImage(file, options)
        results.push(result)
    }

    return results
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/**
 * Get compression savings message
 */
export function getCompressionMessage(result: CompressionResult): string {
    if (!result.wasCompressed) {
        return 'ไม่ต้องย่อ (ขนาดเหมาะสมแล้ว)'
    }

    const savedBytes = result.originalSize - result.compressedSize
    const savedPercent = Math.round((1 - result.compressionRatio) * 100)

    return `ย่อแล้ว ${formatFileSize(savedBytes)} (ประหยัด ${savedPercent}%)`
}

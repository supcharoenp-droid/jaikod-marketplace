
import { StudioImage } from "@/types/smart-studio"

// Mock delay helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockAnalyzeImage = async (img: StudioImage): Promise<StudioImage['aiData']> => {
    await delay(1500 + Math.random() * 1000)

    // Simulate randomness based on ID or Name
    const score = Math.floor(Math.random() * 20) + 80 // 80-99

    return {
        qualityScore: score,
        detectedLabel: "Luxury Watch",
        confidence: 0.95,
        defects: Math.random() > 0.7 ? [
            { type: 'scratch', box: { x: 30, y: 40, w: 10, h: 5 }, confidence: 0.85 }
        ] : [],
        suggestions: score < 90 ? ['Increase brightness', 'Wipe lens'] : ['Great shot!']
    }
}

export const mockAutoArrange = (images: StudioImage[]): StudioImage[] => {
    // Sort by AI Score (mocked logic)
    // In real app: prioritize 'front' view, high quality, uniqueness
    return [...images].sort((a, b) => {
        const scoreA = a.aiData?.qualityScore || 0
        const scoreB = b.aiData?.qualityScore || 0
        return scoreB - scoreA
    }).map((img, index) => ({
        ...img,
        isCover: index === 0 // Set top scorer as cover
    }))
}

export const mockAutoEnhance = async (img: StudioImage): Promise<StudioImage> => {
    await delay(800)
    return {
        ...img,
        adjustments: {
            brightness: 105,
            contrast: 110,
            saturation: 105,
            sharpness: 50
        }
    }
}

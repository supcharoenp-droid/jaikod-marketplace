
export interface StudioImage {
    id: string
    file?: File
    originalUrl: string
    previewUrl: string // Can be a blob URL or modified canvas outcome
    isCover: boolean

    // Edit State
    rotation: number
    scale: number
    crop?: { x: number; y: number; width: number; height: number }
    adjustments: {
        brightness: number
        contrast: number
        saturation: number
        sharpness: number
    }

    // AI Analysis Data
    aiData?: {
        qualityScore: number // 0-100
        detectedLabel?: string
        confidence?: number
        defects: Array<{
            type: 'scratch' | 'dent' | 'blur' | 'crack'
            box: { x: number; y: number; w: number; h: number } // % relative to image
            confidence: number
        }>
        suggestions: string[]
    }

    // Status
    status: 'uploading' | 'analyzing' | 'ready' | 'processing' | 'error'
}

export interface ImageStudioState {
    images: StudioImage[]
    selectedId: string | null
    isAIAnalyzing: boolean
    activeTool: 'none' | 'crop' | 'adjust' | 'heal'
}

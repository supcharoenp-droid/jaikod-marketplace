export interface Defect {
    type: 'scratch' | 'dent' | 'stain' | 'crack' | 'blur'
    severity: 'minor' | 'moderate' | 'severe'
    confidence: number
    location: { x: number, y: number } // Percentage position 0-100
    label: string
}

export interface VisualConditionResult {
    score: number // 0-100
    conditionLabel: 'New' | 'Like New' | 'Good' | 'Fair' | 'Poor' | 'For Parts'
    defects: Defect[]
    imageQualityScore: number // 0-100 (blur, lighting)
    isInternetImage: boolean
    aiAnalysisText: string
}

// Mock analysis 
export async function analyzeProductCondition(imageUrl: string): Promise<VisualConditionResult> {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Randomize result based on some hash of string or random for demo
    const randomSeed = Math.random()

    let score = 0
    let defects: Defect[] = []
    let isInternetImage = false
    let imageQuality = 85

    // Simulate different scenarios
    if (randomSeed > 0.8) {
        // Mint condition
        score = 98
        defects = []
    } else if (randomSeed > 0.5) {
        // Good condition
        score = 85
        defects = [
            { type: 'scratch', severity: 'minor', confidence: 0.8, location: { x: 30, y: 40 }, label: 'รอยขนแมวเล็กน้อย' }
        ]
    } else if (randomSeed > 0.2) {
        // Fair condition
        score = 65
        defects = [
            { type: 'scratch', severity: 'moderate', confidence: 0.9, location: { x: 50, y: 50 }, label: 'รอยขีดข่วนชัดเจน' },
            { type: 'stain', severity: 'minor', confidence: 0.7, location: { x: 20, y: 80 }, label: 'คราบสกปรก' }
        ]
        imageQuality = 60
    } else {
        // Poor or Fake
        score = 40
        defects = [
            { type: 'crack', severity: 'severe', confidence: 0.95, location: { x: 45, y: 45 }, label: 'รอยแตกเสียหาย' }
        ]
        imageQuality = 40
    }

    // Determine Label
    let label: VisualConditionResult['conditionLabel'] = 'Good'
    if (score >= 95) label = 'New'
    else if (score >= 90) label = 'Like New'
    else if (score >= 75) label = 'Good'
    else if (score >= 50) label = 'Fair'
    else if (score >= 20) label = 'Poor'
    else label = 'For Parts'

    // AI Text Generation
    let text = ''
    if (defects.length === 0) text = 'AI ไม่พบตำหนิใดๆ สินค้าดูเหมือนใหม่'
    else {
        const defectNames = defects.map(d => d.label).join(', ')
        text = `AI ตรวจพบ: ${defectNames} จากการวิเคราะห์ภาพ`
    }

    return {
        score,
        conditionLabel: label,
        defects,
        imageQualityScore: imageQuality,
        isInternetImage,
        aiAnalysisText: text
    }
}

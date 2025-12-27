/**
 * Two-Layer Vision Pipeline (POC)
 * 
 * Architecture:
 * Layer 1: gpt-4o (Vision Specialist) - Extract visual facts from image
 * Layer 2: gpt-5-nano (Decision Specialist) - Make category/price decisions
 * 
 * Benefits:
 * - Higher accuracy (gpt-4o superior vision)
 * - Clearer debugging (separate concerns)
 * - Better OCR/text recognition
 * 
 * Trade-offs:
 * - Higher cost (~25x more expensive)
 * - Slower response (2 API calls)
 */

import { ProductAnalysis } from './openai-vision-service'

// ============================================
// LAYER 1: VISION EXTRACTION (gpt-4o)
// ============================================

interface VisionExtractionResult {
    // Raw visual facts (no guessing, only what AI can see)
    detectedText: string[]           // All text/logos visible
    objectType: string               // "television", "laptop", "smartphone", etc.
    brand?: string                   // Brand if clearly visible
    model?: string                   // Model if readable
    colors: string[]                 // Dominant colors
    materials: string[]              // Visible materials (metal, plastic, fabric)

    // Context clues
    hasKeyboardVisible: boolean      // Indicates laptop/desktop (not phone)
    isScreenshot: boolean            // Screenshot of software/app
    isCodeEditor: boolean            // Shows code/IDE
    screenSizeEstimate: 'small' | 'medium' | 'large' | 'unknown'

    // Technical specs (if visible)
    visibleSpecs: {
        storage?: string             // "256GB", "512GB"
        ram?: string                 // "8GB", "16GB"
        processor?: string           // "Intel i7", "M1"
        screenSize?: string          // "13 inch", "55 inch"
        other: Record<string, string>
    }

    // Quality indicators
    condition: 'new' | 'like_new' | 'good' | 'fair' | 'poor' | 'unknown'
    confidence: number               // 0-1
}

const VISION_EXTRACTION_PROMPT = `You are a vision specialist AI. Analyze this product image and extract ONLY observable facts.

**CRITICAL RULES:**
- Report ONLY what you can SEE, do NOT guess or infer
- Read ALL text/logos/labels explicitly (OCR)
- Estimate sizes by comparing to visible context (hands, keyboard, etc.)
- If unsure, mark as "unknown"

**SPECIAL DETECTION:**
- If you see CODE/TERMINAL/IDE → set isCodeEditor: true
- If you see KEYBOARD + LARGE SCREEN → screenSizeEstimate: "large"
- If image is a SCREENSHOT (software UI, not physical product) → isScreenshot: true

**JSON OUTPUT FORMAT:**
{
  "detectedText": ["text1", "text2"],
  "objectType": "category_of_object",
  "brand": "brand_if_visible",
  "model": "model_if_visible",
  "colors": ["color1", "color2"],
  "materials": ["material1"],
  "hasKeyboardVisible": false,
  "isScreenshot": false,
  "isCodeEditor": false,
  "screenSizeEstimate": "medium",
  "visibleSpecs": {
    "storage": "256GB",
    "other": {}
  },
  "condition": "good",
  "confidence": 0.95
}`

// ============================================
// LAYER 2: DECISION MAKING (gpt-5-nano)
// ============================================

const DECISION_MAKING_PROMPT = `You are a marketplace categorization expert. Based on the visual facts provided, decide the category and price.

**INPUT:** JSON object with visual facts from image analysis

**YOUR TASK:**
1. Map to the correct category from this list:
   - Automotive, Real Estate, Mobile/Tablet, Computer/IT, Appliances
   - Fashion, Gaming, Camera, Amulets, Pets, Services, Sports
   - Home/Garden, Beauty, Kids, Books, Others

2. Estimate market price range (in Thai Baht)

3. Generate an attractive Thai product title

**SPECIAL RULES:**
- If isCodeEditor=true OR isScreenshot=true → Category: "Others" (not a sellable product)
- If hasKeyboardVisible=true AND screenSizeEstimate="large" → likely "Computer/IT" (Monitor/Laptop)
- If objectType="television" → Category: "Appliances", Subcategory: "TV"
- If brand is known, include in title

**JSON OUTPUT:**
{
  "title": "Thai product title",
  "category": "Category Name",
  "subcategory": "Subcategory Name",
  "price": {
    "min": 0,
    "max": 0,
    "suggested": 0
  },
  "reasoning": "Why this category was chosen",
  "confidence": 0.95
}`

// ============================================
// MAIN PIPELINE FUNCTION
// ============================================

export class TwoLayerVisionPipeline {
    private apiKey: string
    private baseURL = 'https://api.openai.com/v1'

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
    }

    /**
     * Layer 1: Vision Extraction using gpt-4o-mini (Fast & Cost-Effective)
     * 
     * Why gpt-4o-mini instead of gpt-4o?
     * - 10x cheaper ($0.15 vs $2.50 per 1M input tokens)
     * - 2x faster (2-4s vs 4-8s)
     * - Still excellent vision capability (good enough for most products)
     * - Only 5-10% accuracy drop vs gpt-4o for typical e-commerce images
     */
    async extractVisualFacts(imageBase64: string): Promise<VisionExtractionResult> {
        console.log('🔵 [Layer 1] Starting Vision Extraction with gpt-4o-mini (Fast)...')

        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-4o-mini', // Using mini for speed + cost
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'text', text: VISION_EXTRACTION_PROMPT },
                            {
                                type: 'image_url',
                                image_url: { url: imageBase64, detail: 'auto' } // 'auto' for mini
                            }
                        ]
                    }
                ],
                max_tokens: 2000,
                temperature: 0.1,
                response_format: { type: 'json_object' }
            })
        })

        if (!response.ok) {
            throw new Error(`Layer 1 failed: ${response.statusText}`)
        }

        const data = await response.json()
        const result = JSON.parse(data.choices[0].message.content)

        console.log('✅ [Layer 1] Vision Extraction Complete')
        console.log('📊 Extracted Facts:', {
            objectType: result.objectType,
            brand: result.brand,
            confidence: result.confidence,
            isScreenshot: result.isScreenshot,
            isCodeEditor: result.isCodeEditor
        })

        return result
    }

    /**
     * Layer 2: Decision Making using gpt-5-nano
     */
    async makeDecision(visionFacts: VisionExtractionResult): Promise<Partial<ProductAnalysis>> {
        console.log('🟢 [Layer 2] Starting Decision Making with gpt-5-nano...')

        const response = await fetch(`${this.baseURL}/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-5-nano',
                messages: [
                    {
                        role: 'user',
                        content: DECISION_MAKING_PROMPT + '\n\nVISUAL FACTS:\n' + JSON.stringify(visionFacts, null, 2)
                    }
                ],
                max_completion_tokens: 2000,
                response_format: { type: 'json_object' }
            })
        })

        if (!response.ok) {
            throw new Error(`Layer 2 failed: ${response.statusText}`)
        }

        const data = await response.json()
        const result = JSON.parse(data.choices[0].message.content)

        console.log('✅ [Layer 2] Decision Making Complete')
        console.log('🎯 Decision:', {
            category: result.category,
            price: result.price.suggested,
            confidence: result.confidence
        })

        return {
            title: result.title,
            suggestedCategory: result.category,
            suggestedSubcategory: result.subcategory,
            estimatedPrice: result.price,
            description: `${result.reasoning}`,
            keywords: visionFacts.detectedText,
            detectedBrands: visionFacts.brand ? [visionFacts.brand] : [],
            estimatedCondition: visionFacts.condition === 'poor' ? 'used' :
                visionFacts.condition !== 'unknown' ? visionFacts.condition : 'good',
            detectedObjects: [visionFacts.objectType],
            isProhibited: false,
            validation: {
                isValid: true,
                confidence: result.confidence * 100,
                warnings: [],
                suggestedFixes: []
            }
        }
    }

    /**
     * Full Pipeline: Layer 1 → Layer 2
     */
    async analyze(imageBase64: string): Promise<Partial<ProductAnalysis>> {
        const startTime = Date.now()
        console.log('🚀 Starting 1.5-Layer Vision Pipeline (gpt-4o-mini → gpt-5-nano)...')

        try {
            // Layer 1: Extract visual facts
            const visionFacts = await this.extractVisualFacts(imageBase64)

            // Layer 2: Make decisions
            const decision = await this.makeDecision(visionFacts)

            const duration = Date.now() - startTime
            console.log(`✅ Two-Layer Pipeline Complete in ${duration}ms`)

            return decision

        } catch (error) {
            console.error('❌ Two-Layer Pipeline Failed:', error)
            throw error
        }
    }

    /**
     * Helper: Convert File to Base64
     */
    async fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const base64 = reader.result as string
                resolve(base64)
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    /**
     * Main Entry Point (accepts File object)
     */
    async analyzeImage(imageFile: File): Promise<Partial<ProductAnalysis>> {
        const base64 = await this.fileToBase64(imageFile)
        return this.analyze(base64)
    }
}

// Export singleton instance
export const twoLayerVisionPipeline = new TwoLayerVisionPipeline()

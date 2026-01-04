/**
 * AI Admin Analyst Service
 * JaiKod Marketplace - World Class AI Admin Support
 * 
 * Provides deep intelligence for administrative tasks:
 * - KYC Document Verification (ID, Portrait, Business Reg)
 * - User Behavioral Risk Analysis
 * - Strategic Platform Insights
 */

import { OpenAIVisionService } from '@/lib/openai-vision-service'
import { AI_MODELS } from '@/lib/ai-model-strategy'

export interface KYCAnalysisResult {
    isValid: boolean
    confidence: number
    nameMatch: boolean
    idMatch: boolean
    idNumber: string | null
    expiryDate: string | null
    isFake: boolean
    riskFactors: string[]
    summary: string
    potential: 'high' | 'medium' | 'low'
}

export interface UserDeepInsight {
    ltvPrediction: number
    retentionProbability: number
    fraudProbability: number
    suggestedAction: string
    segments: string[]
}

export class AIAnalystService {
    private visionService: OpenAIVisionService
    private apiKey: string

    constructor(apiKey?: string) {
        this.apiKey = apiKey || process.env.NEXT_PUBLIC_OPENAI_API_KEY || ''
        this.visionService = new OpenAIVisionService(this.apiKey)
    }

    /**
     * 1. Analyze KYC Documents using AI Vision
     * Checks for ID authenticity, face match, and data consistency.
     */
    async analyzeKYC(
        idCardBase64: string,
        portraitBase64: string,
        businessRegBase64?: string
    ): Promise<KYCAnalysisResult> {
        if (!this.apiKey) throw new Error('AI API Key not configured')

        const prompt = `
            You are a Professional Compliance & Forensic AI Analyst.
            Analyze the provided KYC documents (ID Card and Selfie Portrait).

            **TASK:**
            1. Extract the name and ID number from the ID card.
            2. Verify if the person in the portrait matches the person on the ID card.
            3. Detect any signs of "Fake ID" or digital manipulation (Photoshop, screen capture).
            4. Assess the business potential based on the registration (if provided).
            5. Provide a risk score (0-100 where 100 is perfectly safe).

            **CONSTRAINTS:**
            - Be extremely critical of fraud.
            - Answer in JSON format.
        `

        try {
            const payload: any = {
                model: 'gpt-4o-mini', // Vision capable, fast, and highly reliable for text in images
                messages: [
                    {
                        role: "user",
                        content: [
                            { type: "text", text: prompt },
                            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${idCardBase64}` } },
                            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${portraitBase64}` } }
                        ]
                    }
                ],
                max_tokens: 1000,
                response_format: { type: "json_object" }
            }

            if (businessRegBase64) {
                payload.messages[0].content.push({
                    type: "image_url",
                    image_url: { url: `data:image/jpeg;base64,${businessRegBase64}` }
                })
            }

            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify(payload)
            })

            const data = await res.json()
            const content = JSON.parse(data.choices[0].message.content)

            return {
                isValid: content.riskScore > 70,
                confidence: content.confidence || 90,
                nameMatch: content.nameMatch || false,
                idMatch: content.faceMatch || false,
                idNumber: content.idNumber || null,
                expiryDate: content.idExpiry || null,
                isFake: content.isFake || false,
                riskFactors: content.riskFactors || [],
                summary: content.summary || '',
                potential: content.potential || 'medium'
            }

        } catch (error) {
            console.error('KYC AI Error:', error)
            throw error
        }
    }

    /**
     * 2. Platform Strategist - System Wide Insight
     * Analyzes trends and provides strategic recommendations.
     */
    async getStrategicInsights(systemSnapshot: any): Promise<any> {
        const prompt = `
            You are the Strategic Director of JaiKod Marketplace.
            Analyze the following platform data snapshot and provide 3-5 high-impact strategic insights.
            Focus on: Growth opportunities, Emerging Risks, and User Experience improvements.
            Language: Thai and English.

            Data: ${JSON.stringify(systemSnapshot)}
        `

        try {
            const res = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o-mini',
                    messages: [{ role: 'user', content: prompt }],
                    response_format: { type: 'json_object' }
                })
            })

            const data = await res.json()
            return JSON.parse(data.choices[0].message.content)
        } catch (error) {
            return { insights: [] }
        }
    }
}

// Singleton Instance
let adminAiInstance: AIAnalystService | null = null

export function getAIAnalystService(): AIAnalystService {
    if (!adminAiInstance) {
        adminAiInstance = new AIAnalystService()
    }
    return adminAiInstance
}

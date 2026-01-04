/**
 * AI Commerce Engine - Types & Interfaces
 * 
 * Core type definitions for the AI Smart Commerce system
 */

// ==========================================
// MODULE 1: AI Instant Summary
// ==========================================

export interface AIProductSummary {
    overallCondition: 'excellent' | 'good' | 'fair' | 'poor' | 'unknown'
    conditionScore: number // 0-100
    priceAnalysis: {
        comparison: 'below_market' | 'at_market' | 'above_market' | 'unknown'
        percentageDiff: number // e.g., -7 means 7% below market
        confidence: number // 0-100
    }
    highlights: AIHighlight[]
    concerns: AIConcern[]
    suitableFor: string[] // e.g., ['family', 'daily_use', 'first_car']
    generatedAt: Date
}

export interface AIHighlight {
    icon: string
    text_th: string
    text_en: string
    importance: 'high' | 'medium' | 'low'
}

export interface AIConcern {
    icon: string
    text_th: string
    text_en: string
    severity: 'info' | 'warning' | 'critical'
}

// ==========================================
// MODULE 2: AI Fair Price Meter
// ==========================================

export interface AIFairPrice {
    currentPrice: number
    estimatedFairPrice: {
        low: number
        high: number
        average: number
    }
    rating: 'excellent_deal' | 'good_deal' | 'fair_price' | 'above_average' | 'overpriced' | 'insufficient_data'
    confidence: number // 0-100
    comparisonCount: number // How many similar items compared
    factors: PriceFactor[]
    lastUpdated: Date
}

export interface PriceFactor {
    name_th: string
    name_en: string
    impact: 'positive' | 'negative' | 'neutral'
    description_th: string
    description_en: string
}

// ==========================================
// MODULE 3: Seller Trust Intelligence
// ==========================================

export interface SellerTrustScore {
    overallScore: number // 0-100
    level: 'platinum' | 'gold' | 'silver' | 'bronze' | 'new' | 'unverified'
    breakdown: {
        deliveryOnTime: number // 0-100
        responseRate: number // 0-100
        reviewScore: number // 0-5
        accountAge: number // days
        totalSales: number
        disputeRate: number // 0-100 (lower is better)
    }
    verifications: SellerVerification[]
    badges: SellerBadge[]
    riskFlags: RiskFlag[]
}

export interface SellerVerification {
    type: 'phone' | 'email' | 'id_card' | 'business' | 'address' | 'bank'
    verified: boolean
    verifiedAt?: Date
}

export interface SellerBadge {
    id: string
    name_th: string
    name_en: string
    icon: string
    color: string
}

export interface RiskFlag {
    type: 'new_account' | 'no_reviews' | 'low_response' | 'dispute_history' | 'unverified'
    severity: 'info' | 'warning' | 'danger'
    message_th: string
    message_en: string
}

// ==========================================
// MODULE 4: Buyer Intent Detection
// ==========================================

export type BuyerIntentLevel = 'low' | 'medium' | 'high' | 'very_high'

export interface BuyerIntent {
    level: BuyerIntentLevel
    score: number // 0-100 (internal only, never shown to user)
    signals: IntentSignal[]
    recommendedAction: 'observe' | 'soft_nudge' | 'strong_cta' | 'urgency'
}

export interface IntentSignal {
    type: 'scroll_depth' | 'time_on_page' | 'image_zoom' | 'gallery_view' | 'revisit' | 'compare' | 'chat_open'
    weight: number
    timestamp: Date
}

// ==========================================
// MODULE 5: Smart CTA Engine
// ==========================================

export interface SmartCTA {
    primary: {
        text_th: string
        text_en: string
        icon: string
        action: 'chat' | 'call' | 'offer' | 'buy_now' | 'save'
        style: 'default' | 'urgent' | 'gentle' | 'highlight'
    }
    secondary?: {
        text_th: string
        text_en: string
        icon: string
        action: string
    }
    urgencyMessage?: {
        text_th: string
        text_en: string
        show: boolean
    }
}

// ==========================================
// MODULE 6: AI Negotiation Assistant
// ==========================================

export interface NegotiationSuggestion {
    suggestedPrice: number
    acceptanceProbability: number // 0-100
    strategyTips: NegotiationTip[]
    messageTemplate: {
        th: string
        en: string
    }
    priceRange: {
        tooLow: number // Below this, likely rejected
        sweet_spot: number // Best chance
        acceptable: number[] // Range of acceptable prices
    }
}

export interface NegotiationTip {
    icon: string
    text_th: string
    text_en: string
}

// ==========================================
// MODULE 7: AI Comparison Lock
// ==========================================

export interface ProductComparison {
    currentProduct: ComparisonItem
    alternatives: ComparisonItem[]
    verdict: {
        winner: 'current' | 'alternative' | 'tie'
        reason_th: string
        reason_en: string
    }
    comparisonPoints: ComparisonPoint[]
}

export interface ComparisonItem {
    id: string
    title: string
    price: number
    thumbnail: string
    highlights: string[]
}

export interface ComparisonPoint {
    name_th: string
    name_en: string
    currentValue: string | number
    alternativeValues: (string | number)[]
    winner: 'current' | 'alternative' | 'tie'
}

// ==========================================
// ENGINE CONFIG
// ==========================================

export interface AICommerceConfig {
    modules: {
        instantSummary: boolean
        fairPrice: boolean
        sellerTrust: boolean
        buyerIntent: boolean
        smartCTA: boolean
        negotiation: boolean
        comparisonLock: boolean
    }
    ethicalRules: {
        noHallucination: boolean
        transparentUncertainty: boolean
        honestyFirst: boolean
        noSpam: boolean
    }
    language: 'th' | 'en'
}

// Default config
export const DEFAULT_AI_COMMERCE_CONFIG: AICommerceConfig = {
    modules: {
        instantSummary: true,
        fairPrice: true,
        sellerTrust: true,
        buyerIntent: true,
        smartCTA: true,
        negotiation: true,
        comparisonLock: true
    },
    ethicalRules: {
        noHallucination: true,
        transparentUncertainty: true,
        honestyFirst: true,
        noSpam: true
    },
    language: 'th'
}

export type UserRole = 'buyer' | 'seller' | 'shop' | 'mall'
export type SellerLevel = 'new' | 'active' | 'verified' | 'premium'
export type AiMode = 'basic' | 'pro' | 'mall'

export interface FeaturesUnlocked {
    // Analytics & Insights
    analytics: boolean
    advanced_analytics: boolean
    competitor_insights: boolean

    // Marketing & Promotion
    marketing: boolean
    campaigns: boolean
    ads_manager: boolean

    // AI Features
    ai_pricing: boolean
    ai_description: boolean
    ai_image_enhancement: boolean
    ai_chatbot: boolean
    ai_inventory_forecast: boolean

    // Shop Customization
    custom_shop_design: boolean
    custom_domain: boolean
    shop_themes: boolean

    // Sales Tools
    bulk_upload: boolean
    api_access: boolean
    team_management: boolean
    multi_channel: boolean

    // Financial
    tax_invoice: boolean
    advanced_reports: boolean
    export_data: boolean

    // Support
    priority_support: boolean
    dedicated_account_manager: boolean
}

export interface UserProfile {
    // Core Identity
    uid: string
    email: string
    displayName: string
    photoURL?: string

    // Role & Level
    role: UserRole
    seller_level?: SellerLevel
    seller_type?: 'individual' | 'pro' | 'mall'

    // Onboarding
    onboarding_step: number // 0-5
    onboarding_completed: boolean

    // AI Configuration
    ai_mode: AiMode
    ai_preferences?: {
        auto_pricing: boolean
        auto_description: boolean
        auto_categorization: boolean
        smart_replies: boolean
    }

    // Features
    features_unlocked: Partial<FeaturesUnlocked>

    // Verification
    verification: {
        email: boolean
        phone: boolean
        identity: boolean // KYC
        business: boolean // For mall
    }

    // Preferences
    language: 'th' | 'en'
    currency: 'THB' | 'USD'
    timezone: string

    // Metadata
    created_at: string
    updated_at: string
    last_login: string
}

// Feature unlock rules based on role
export const FEATURE_MATRIX: Record<UserRole, Partial<FeaturesUnlocked>> = {
    buyer: {
        analytics: false,
        marketing: false,
        ai_pricing: false,
        ai_description: false,
        bulk_upload: false,
        api_access: false,
        tax_invoice: false,
        priority_support: false
    },
    seller: {
        analytics: true,
        advanced_analytics: false,
        marketing: true,
        campaigns: false,
        ai_pricing: true,
        ai_description: true,
        ai_image_enhancement: true,
        ai_chatbot: false,
        custom_shop_design: false,
        bulk_upload: false,
        api_access: false,
        tax_invoice: false,
        priority_support: false
    },
    shop: {
        analytics: true,
        advanced_analytics: true,
        competitor_insights: false,
        marketing: true,
        campaigns: true,
        ads_manager: true,
        ai_pricing: true,
        ai_description: true,
        ai_image_enhancement: true,
        ai_chatbot: true,
        ai_inventory_forecast: false,
        custom_shop_design: true,
        custom_domain: false,
        shop_themes: true,
        bulk_upload: true,
        api_access: false,
        team_management: false,
        tax_invoice: false,
        priority_support: true,
        advanced_reports: true,
        export_data: true
    },
    mall: {
        analytics: true,
        advanced_analytics: true,
        competitor_insights: true,
        marketing: true,
        campaigns: true,
        ads_manager: true,
        ai_pricing: true,
        ai_description: true,
        ai_image_enhancement: true,
        ai_chatbot: true,
        ai_inventory_forecast: true,
        custom_shop_design: true,
        custom_domain: true,
        shop_themes: true,
        bulk_upload: true,
        api_access: true,
        team_management: true,
        multi_channel: true,
        tax_invoice: true,
        priority_support: true,
        dedicated_account_manager: true,
        advanced_reports: true,
        export_data: true
    }
}

// Level-based feature boosts
export const LEVEL_BOOSTS: Record<SellerLevel, string[]> = {
    new: [],
    active: ['advanced_analytics', 'campaigns'],
    verified: ['advanced_analytics', 'campaigns', 'priority_support', 'ai_inventory_forecast'],
    premium: ['competitor_insights', 'custom_domain', 'dedicated_account_manager', 'api_access']
}

// AI Mode capabilities
export const AI_MODE_FEATURES: Record<AiMode, string[]> = {
    basic: ['ai_pricing', 'ai_description'],
    pro: ['ai_pricing', 'ai_description', 'ai_image_enhancement', 'ai_chatbot'],
    mall: ['ai_pricing', 'ai_description', 'ai_image_enhancement', 'ai_chatbot', 'ai_inventory_forecast']
}

// Helper function to calculate unlocked features
export function calculateUnlockedFeatures(
    role: UserRole,
    level?: SellerLevel,
    aiMode?: AiMode
): Partial<FeaturesUnlocked> {
    // Start with base features for role
    const baseFeatures = { ...FEATURE_MATRIX[role] }

    // Add level boosts
    if (level && level !== 'new') {
        const boosts = LEVEL_BOOSTS[level]
        boosts.forEach(feature => {
            (baseFeatures as any)[feature] = true
        })
    }

    // Add AI mode features
    if (aiMode) {
        const aiFeatures = AI_MODE_FEATURES[aiMode]
        aiFeatures.forEach(feature => {
            (baseFeatures as any)[feature] = true
        })
    }

    return baseFeatures
}

// Upgrade path suggestions
export interface UpgradeSuggestion {
    from: UserRole
    to: UserRole
    benefits: string[]
    requirements: string[]
}

export const UPGRADE_PATHS: UpgradeSuggestion[] = [
    {
        from: 'buyer',
        to: 'seller',
        benefits: [
            'Start selling items',
            'AI-powered pricing',
            'Basic analytics',
            'Marketing tools'
        ],
        requirements: [
            'Verify phone number',
            'Complete profile'
        ]
    },
    {
        from: 'seller',
        to: 'shop',
        benefits: [
            'Custom shop design',
            'Advanced analytics',
            'Campaign manager',
            'Bulk upload',
            'AI chatbot',
            'Priority support'
        ],
        requirements: [
            'Verify identity (KYC)',
            'Add bank account',
            'Minimum 10 successful sales'
        ]
    },
    {
        from: 'shop',
        to: 'mall',
        benefits: [
            'Custom domain',
            'API access',
            'Team management',
            'Multi-channel selling',
            'Tax invoice',
            'Dedicated account manager',
            'AI inventory forecast',
            'Competitor insights'
        ],
        requirements: [
            'Business registration',
            'Tax ID',
            'Minimum 100 products',
            'Minimum 50 sales/month'
        ]
    }
]

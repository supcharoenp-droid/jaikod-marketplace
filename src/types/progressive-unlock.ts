import { SellerType } from './onboarding'

// Progressive unlock stages
export type UnlockStage =
    | 'beginner'      // เริ่มต้น - ฟีเจอร์จำเป็นเท่านั้น
    | 'intermediate'  // กลาง - เพิ่มเครื่องมือช่วย
    | 'advanced'      // ขั้นสูง - ฟีเจอร์เต็มรูปแบบ
    | 'expert'        // ผู้เชี่ยวชาญ - ทุกอย่าง

// Feature visibility rules
export interface FeatureVisibility {
    id: string
    name: string
    description: string
    requiredStage: UnlockStage
    requiredActions?: string[] // Actions needed to unlock
    isOptional: boolean
    canSkip: boolean
}

// User progress tracking
export interface UserProgress {
    currentStage: UnlockStage
    completedActions: string[]
    skippedActions: string[]
    unlockedFeatures: string[]
    lastUpdated: string
}

// Define what's visible at each stage
export const STAGE_FEATURES: Record<UnlockStage, {
    visible: string[]
    description: { th: string; en: string }
}> = {
    beginner: {
        visible: [
            'upload_photo',
            'set_price',
            'basic_description',
            'post_listing'
        ],
        description: {
            th: 'เริ่มต้น: ฟีเจอร์จำเป็นเท่านั้น',
            en: 'Beginner: Essential features only'
        }
    },
    intermediate: {
        visible: [
            'upload_photo',
            'set_price',
            'basic_description',
            'post_listing',
            'ai_pricing',
            'ai_description',
            'category_selection',
            'shipping_options'
        ],
        description: {
            th: 'กลาง: เพิ่มเครื่องมือ AI ช่วย',
            en: 'Intermediate: AI tools added'
        }
    },
    advanced: {
        visible: [
            'upload_photo',
            'set_price',
            'basic_description',
            'post_listing',
            'ai_pricing',
            'ai_description',
            'category_selection',
            'shipping_options',
            'bulk_upload',
            'analytics',
            'promotions',
            'inventory_management'
        ],
        description: {
            th: 'ขั้นสูง: เครื่องมือจัดการครบ',
            en: 'Advanced: Full management tools'
        }
    },
    expert: {
        visible: [
            'upload_photo',
            'set_price',
            'basic_description',
            'post_listing',
            'ai_pricing',
            'ai_description',
            'category_selection',
            'shipping_options',
            'bulk_upload',
            'analytics',
            'promotions',
            'inventory_management',
            'api_access',
            'custom_integrations',
            'team_management',
            'advanced_analytics'
        ],
        description: {
            th: 'ผู้เชี่ยวชาญ: ฟีเจอร์ทั้งหมด',
            en: 'Expert: All features unlocked'
        }
    }
}

// Actions that trigger stage progression
export const PROGRESSION_TRIGGERS: Record<string, {
    action: string
    nextStage: UnlockStage
    requirement: { th: string; en: string }
}> = {
    first_listing: {
        action: 'post_first_product',
        nextStage: 'intermediate',
        requirement: {
            th: 'โพสสินค้าชิ้นแรกสำเร็จ',
            en: 'Posted first product successfully'
        }
    },
    five_listings: {
        action: 'post_five_products',
        nextStage: 'advanced',
        requirement: {
            th: 'โพสสินค้าครบ 5 ชิ้น',
            en: 'Posted 5 products'
        }
    },
    first_sale: {
        action: 'complete_first_sale',
        nextStage: 'advanced',
        requirement: {
            th: 'ขายสินค้าสำเร็จครั้งแรก',
            en: 'Completed first sale'
        }
    },
    verified_seller: {
        action: 'complete_verification',
        nextStage: 'expert',
        requirement: {
            th: 'ยืนยันตัวตนเรียบร้อย',
            en: 'Verification completed'
        }
    },
    power_user: {
        action: 'reach_50_sales',
        nextStage: 'expert',
        requirement: {
            th: 'ขายสินค้าครบ 50 รายการ',
            en: 'Reached 50 sales'
        }
    }
}

// Feature definitions with unlock requirements
export const PROGRESSIVE_FEATURES: FeatureVisibility[] = [
    // Beginner Features (Always visible)
    {
        id: 'upload_photo',
        name: 'Upload Photo',
        description: 'Take or upload product photos',
        requiredStage: 'beginner',
        isOptional: false,
        canSkip: false
    },
    {
        id: 'set_price',
        name: 'Set Price',
        description: 'Enter product price',
        requiredStage: 'beginner',
        isOptional: false,
        canSkip: false
    },
    {
        id: 'basic_description',
        name: 'Basic Description',
        description: 'Write simple product description',
        requiredStage: 'beginner',
        isOptional: false,
        canSkip: false
    },
    {
        id: 'post_listing',
        name: 'Post Listing',
        description: 'Publish your product',
        requiredStage: 'beginner',
        isOptional: false,
        canSkip: false
    },

    // Intermediate Features (Unlocked after first listing)
    {
        id: 'ai_pricing',
        name: 'AI Price Suggestion',
        description: 'Get smart price recommendations',
        requiredStage: 'intermediate',
        requiredActions: ['post_first_product'],
        isOptional: true,
        canSkip: true
    },
    {
        id: 'ai_description',
        name: 'AI Description Writer',
        description: 'Auto-generate product descriptions',
        requiredStage: 'intermediate',
        requiredActions: ['post_first_product'],
        isOptional: true,
        canSkip: true
    },
    {
        id: 'category_selection',
        name: 'Category Selection',
        description: 'Choose product category',
        requiredStage: 'intermediate',
        requiredActions: ['post_first_product'],
        isOptional: true,
        canSkip: true
    },
    {
        id: 'shipping_options',
        name: 'Shipping Options',
        description: 'Configure delivery methods',
        requiredStage: 'intermediate',
        requiredActions: ['post_first_product'],
        isOptional: true,
        canSkip: true
    },

    // Advanced Features (Unlocked after 5 listings or first sale)
    {
        id: 'bulk_upload',
        name: 'Bulk Upload',
        description: 'Upload multiple products at once',
        requiredStage: 'advanced',
        requiredActions: ['post_five_products'],
        isOptional: true,
        canSkip: true
    },
    {
        id: 'analytics',
        name: 'Analytics Dashboard',
        description: 'View sales and performance metrics',
        requiredStage: 'advanced',
        requiredActions: ['complete_first_sale'],
        isOptional: true,
        canSkip: true
    },
    {
        id: 'promotions',
        name: 'Promotions & Discounts',
        description: 'Create special offers',
        requiredStage: 'advanced',
        requiredActions: ['post_five_products'],
        isOptional: true,
        canSkip: true
    },
    {
        id: 'inventory_management',
        name: 'Inventory Management',
        description: 'Track stock levels',
        requiredStage: 'advanced',
        requiredActions: ['post_five_products'],
        isOptional: true,
        canSkip: true
    },

    // Expert Features (Unlocked after verification or 50 sales)
    {
        id: 'api_access',
        name: 'API Access',
        description: 'Integrate with external systems',
        requiredStage: 'expert',
        requiredActions: ['complete_verification', 'reach_50_sales'],
        isOptional: true,
        canSkip: true
    },
    {
        id: 'team_management',
        name: 'Team Management',
        description: 'Add team members',
        requiredStage: 'expert',
        requiredActions: ['complete_verification'],
        isOptional: true,
        canSkip: true
    },
    {
        id: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Deep insights and forecasting',
        requiredStage: 'expert',
        requiredActions: ['reach_50_sales'],
        isOptional: true,
        canSkip: true
    }
]

// Helper: Check if feature is unlocked
export function isFeatureUnlocked(
    featureId: string,
    userProgress: UserProgress
): boolean {
    const feature = PROGRESSIVE_FEATURES.find(f => f.id === featureId)
    if (!feature) return false

    // Check stage requirement
    const stageOrder: UnlockStage[] = ['beginner', 'intermediate', 'advanced', 'expert']
    const userStageIndex = stageOrder.indexOf(userProgress.currentStage)
    const requiredStageIndex = stageOrder.indexOf(feature.requiredStage)

    if (userStageIndex < requiredStageIndex) return false

    // Check action requirements
    if (feature.requiredActions && feature.requiredActions.length > 0) {
        const hasRequiredAction = feature.requiredActions.some(action =>
            userProgress.completedActions.includes(action)
        )
        if (!hasRequiredAction) return false
    }

    return true
}

// Helper: Get next unlock milestone
export function getNextMilestone(
    userProgress: UserProgress
): { action: string; reward: string; description: { th: string; en: string } } | null {
    const currentStageIndex = ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(userProgress.currentStage)

    for (const [key, trigger] of Object.entries(PROGRESSION_TRIGGERS)) {
        const nextStageIndex = ['beginner', 'intermediate', 'advanced', 'expert'].indexOf(trigger.nextStage)

        if (nextStageIndex > currentStageIndex && !userProgress.completedActions.includes(trigger.action)) {
            const newFeatures = STAGE_FEATURES[trigger.nextStage].visible.length -
                STAGE_FEATURES[userProgress.currentStage].visible.length

            return {
                action: trigger.action,
                reward: `Unlock ${newFeatures} new features`,
                description: trigger.requirement
            }
        }
    }

    return null
}

// Helper: Calculate progress percentage
export function calculateProgress(userProgress: UserProgress): number {
    const totalFeatures = PROGRESSIVE_FEATURES.length
    const unlockedCount = PROGRESSIVE_FEATURES.filter(f =>
        isFeatureUnlocked(f.id, userProgress)
    ).length

    return Math.round((unlockedCount / totalFeatures) * 100)
}

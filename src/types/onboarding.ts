export type SellerType = 'individual' | 'pro' | 'mall'
export type SellingGoal = 'clear_closet' | 'side_hustle' | 'business'

export interface OnboardingState {
    step: number // 0 = Not started, 1 = Goal, 2 = Role Set, 3 = Checklist, 4 = Done
    isCompleted: boolean
    selectedGoal?: SellingGoal
    assignedRole?: SellerType
    skipped?: boolean
}

export interface SellerOnboardingProfile {
    // Core Identity
    uid: string
    seller_type: SellerType
    selling_goal: SellingGoal

    // Progress
    onboarding: OnboardingState

    // Flags for Progressive Disclosure
    features: {
        can_customize_shop: boolean
        can_bulk_upload: boolean
        can_issue_tax: boolean
        use_simple_upload: boolean // For 'individual' role
    }

    // Checklist Status
    checklist: {
        phone_verified: boolean
        id_verified: boolean // KYC
        bank_added: boolean
        first_product_posted: boolean
    }
}

export const ROLE_FEATURES: Record<SellerType, Partial<SellerOnboardingProfile['features']>> = {
    individual: {
        can_customize_shop: false,
        can_bulk_upload: false,
        can_issue_tax: false,
        use_simple_upload: true
    },
    pro: {
        can_customize_shop: true,
        can_bulk_upload: true,
        can_issue_tax: false,
        use_simple_upload: false
    },
    mall: {
        can_customize_shop: true,
        can_bulk_upload: true,
        can_issue_tax: true,
        use_simple_upload: false
    }
}

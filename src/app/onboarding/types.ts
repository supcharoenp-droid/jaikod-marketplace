export type OnboardingStepId = 1 | 2 | 3 | 4 | 5 | 6 | 7

export interface OnboardingData {
    // Step 1: Name
    shopName: string
    shopNameOrigin: 'manual' | 'ai' | ''

    // Step 2: Logo
    logoUrl: string
    logoStyle: string

    // Step 3: Description
    description: string

    // Step 4: KYC
    kycStatus: 'pending' | 'verified' | 'skipped'

    // Step 5: Product
    firstProduct?: {
        title: string
        price: number
        image: string
    }

    // Step 6: Pricing Check
    pricingStrategy: 'market' | 'premium' | 'budget'

    // Meta
    completedSteps: number[] // IDs of completed steps
    currentStep: OnboardingStepId
    isFinished: boolean
}

export const STEPS = [
    { id: 1, title: 'onboarding.step_1_title', icon: 'Store' },
    { id: 2, title: 'onboarding.step_2_title', icon: 'Image' },
    { id: 3, title: 'onboarding.step_3_title', icon: 'FileText' },
    { id: 4, title: 'onboarding.step_4_title', icon: 'ShieldCheck' },
    { id: 5, title: 'onboarding.step_5_title', icon: 'Package' },
    { id: 6, title: 'onboarding.step_6_title', icon: 'Tag' },
    { id: 7, title: 'onboarding.ready_title', icon: 'Rocket' }
] as const

export enum SystemPhase {
    PHASE_1_BASIC = 1,
    PHASE_2_AI_ASSIST = 2,
    PHASE_3_MONETIZATION = 3,
    PHASE_4_ADVANCED = 4
}

export const CURRENT_PHASE = SystemPhase.PHASE_1_BASIC

export const FEATURE_FLAGS = {
    // Phase 1: Basic
    BASIC_POSTING: SystemPhase.PHASE_1_BASIC,
    BASIC_PROFILE: SystemPhase.PHASE_1_BASIC,

    // Phase 2: AI Assist
    AI_IMAGE_ANALYSIS: SystemPhase.PHASE_2_AI_ASSIST,
    AI_DESCRIPTION_GEN: SystemPhase.PHASE_2_AI_ASSIST,
    AI_PROFILE_COACH: SystemPhase.PHASE_2_AI_ASSIST,
    SMART_SEARCH: SystemPhase.PHASE_2_AI_ASSIST,

    // Phase 3: Monetization
    SELLER_TIERS: SystemPhase.PHASE_3_MONETIZATION,
    STORE_MANAGEMENT: SystemPhase.PHASE_3_MONETIZATION,
    BOOST_POST: SystemPhase.PHASE_3_MONETIZATION,
    SEO_TOOLS: SystemPhase.PHASE_3_MONETIZATION,

    // Phase 4: Advanced
    OFFICIAL_MALL: SystemPhase.PHASE_4_ADVANCED,
    FRAUD_DETECTION: SystemPhase.PHASE_4_ADVANCED,
    AUCTION_SYSTEM: SystemPhase.PHASE_4_ADVANCED
}

export const isFeatureEnabled = (featureMinPhase: SystemPhase, currentPhase: SystemPhase = CURRENT_PHASE): boolean => {
    return currentPhase >= featureMinPhase
}

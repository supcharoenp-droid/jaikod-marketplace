/**
 * Store Wizard - Main Export
 */

export * from './types'
export * from './ai-analyzer'

// Re-export key functions
import {
    WIZARD_STEPS,
    STORE_TYPE_OPTIONS,
    TUTORIAL_FLOWS,
    getStepsForStoreType,
    getEstimatedTotalTime,
    getProgressPercentage,
    initialWizardState
} from './types'

import { AIStoreAnalyzer } from './ai-analyzer'

export const StoreWizard = {
    // Steps
    steps: WIZARD_STEPS,
    getStepsForStoreType,
    getEstimatedTotalTime,
    getProgressPercentage,

    // Store types
    storeTypes: STORE_TYPE_OPTIONS,

    // Tutorials
    tutorials: TUTORIAL_FLOWS,

    // AI
    ai: AIStoreAnalyzer,

    // Initial state
    createInitialState: () => ({ ...initialWizardState, started_at: new Date(), last_updated: new Date() })
}

export default StoreWizard

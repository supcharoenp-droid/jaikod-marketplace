'use client'

/**
 * ============================================
 * Platform Context
 * ============================================
 * 
 * Provides platform mode and feature flags to components
 * Usage:
 *   const { isMarketplace, isFeatureEnabled } = usePlatform()
 */

import React, { createContext, useContext, ReactNode } from 'react'
import {
    PLATFORM_CONFIG,
    FEATURE_FLAGS,
    CURRENT_MODE,
    PlatformMode,
    isMarketplaceMode,
    isClassifiedMode,
    isFeatureEnabled,
    getPlatformModeName,
    getTransactionInstructions
} from '@/config/platform'

// ============================================
// TYPES
// ============================================

interface PlatformContextType {
    // Mode
    mode: PlatformMode
    isMarketplace: boolean
    isClassified: boolean
    modeName: (lang?: 'th' | 'en') => string

    // Feature Flags
    features: typeof FEATURE_FLAGS
    isFeatureEnabled: (feature: keyof typeof FEATURE_FLAGS) => boolean

    // Config
    config: typeof PLATFORM_CONFIG

    // Helpers
    getTransactionInstructions: (lang?: 'th' | 'en') => string

    // Phase 2 Services Available
    hasPayment: boolean
    hasOrders: boolean
    hasShipping: boolean
    hasEscrow: boolean
}

// ============================================
// CONTEXT
// ============================================

const PlatformContext = createContext<PlatformContextType | undefined>(undefined)

// ============================================
// PROVIDER
// ============================================

interface PlatformProviderProps {
    children: ReactNode
}

export function PlatformProvider({ children }: PlatformProviderProps) {
    const value: PlatformContextType = {
        // Mode
        mode: CURRENT_MODE,
        isMarketplace: isMarketplaceMode(),
        isClassified: isClassifiedMode(),
        modeName: getPlatformModeName,

        // Feature Flags
        features: FEATURE_FLAGS,
        isFeatureEnabled: (feature) => isFeatureEnabled(feature),

        // Config
        config: PLATFORM_CONFIG,

        // Helpers
        getTransactionInstructions,

        // Phase 2 Services
        hasPayment: FEATURE_FLAGS.PAYMENT_ENABLED,
        hasOrders: FEATURE_FLAGS.ORDER_SYSTEM_ENABLED,
        hasShipping: FEATURE_FLAGS.SHIPPING_ENABLED,
        hasEscrow: FEATURE_FLAGS.ESCROW_ENABLED,
    }

    return (
        <PlatformContext.Provider value={value}>
            {children}
        </PlatformContext.Provider>
    )
}

// ============================================
// HOOKS
// ============================================

export function usePlatform(): PlatformContextType {
    const context = useContext(PlatformContext)
    if (!context) {
        throw new Error('usePlatform must be used within PlatformProvider')
    }
    return context
}

/**
 * Quick hook to check if feature is enabled
 */
export function useFeature(feature: keyof typeof FEATURE_FLAGS): boolean {
    const context = useContext(PlatformContext)
    if (!context) {
        // Fallback to direct check if outside provider
        return FEATURE_FLAGS[feature]
    }
    return context.isFeatureEnabled(feature)
}

/**
 * Check if in marketplace mode
 */
export function useIsMarketplace(): boolean {
    const context = useContext(PlatformContext)
    return context?.isMarketplace ?? isMarketplaceMode()
}

// ============================================
// EXPORTS
// ============================================

export default PlatformContext

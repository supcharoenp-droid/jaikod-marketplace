
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

// Types must match Admin System Page options
export type SystemModule =
    | 'marketplace'
    | 'chat'
    | 'payment'
    | 'shipping'
    | 'review'
    | 'promotion'
    | 'analytics'
    | 'notification';

export interface SystemConfig {
    maintenance_mode: boolean;

    // Module Toggles
    modules: Record<SystemModule, boolean>;

    // Feature Flags (Legacy / Specific)
    enable_trust_score: boolean;
    enable_auction_system: boolean;
    enable_detailed_kyc: boolean;
    enable_cod: boolean; // Add COD
    require_kyc: boolean; // Add KYC
    auto_approve_products: boolean;

    // Global Rules
    platform_commission: number;
    min_withdrawal: number;
    max_withdrawal: number;
}

const DEFAULT_CONFIG: SystemConfig = {
    maintenance_mode: false,
    modules: {
        marketplace: true,
        chat: true,
        payment: true,
        shipping: true,
        review: true,
        promotion: true,
        analytics: true,
        notification: true
    },
    enable_trust_score: true,
    enable_auction_system: false,
    enable_detailed_kyc: false,
    enable_cod: true,
    require_kyc: true,
    auto_approve_products: false,
    platform_commission: 5,
    min_withdrawal: 100,
    max_withdrawal: 100000
};

// --- CLIENT SIDE HOOK (Realtime) ---
import { useState, useEffect } from 'react';

/**
 * Hook to use system config in React Components
 * Subscribes to changes in Firestore automatically
 */
export function useSystemConfig() {
    const [config, setConfig] = useState<SystemConfig>(DEFAULT_CONFIG);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const docRef = doc(db, 'system_settings', 'global_config');
        const unsubscribe = onSnapshot(docRef, (doc) => {
            if (doc.exists()) {
                // Determine deep merge manually or just overwrite known fields
                // Simple spread might loose nested objects if not careful, handled here:
                const data = doc.data();
                setConfig(prev => ({
                    ...DEFAULT_CONFIG,
                    ...data,
                    modules: { ...DEFAULT_CONFIG.modules, ...(data.modules || {}) }
                }));
            }
            setLoading(false);
        }, (error) => {
            console.error("Config Listener Error", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const isModuleEnabled = (module: SystemModule) => {
        if (config.maintenance_mode) return false; // Maintenance kills all modules
        return config.modules[module];
    };

    return { config, loading, isModuleEnabled };
}

// --- SERVER / STATIC SIDE ---
// (Keep existing function for server-side logic if needed)
export async function getSystemConfigOnce(): Promise<SystemConfig> {
    try {
        const docRef = doc(db, 'system_settings', 'global_config');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                ...DEFAULT_CONFIG,
                ...data,
                modules: { ...DEFAULT_CONFIG.modules, ...(data.modules || {}) }
            } as SystemConfig;
        }
        return DEFAULT_CONFIG;
    } catch (e) {
        return DEFAULT_CONFIG;
    }
}

export async function updateSystemConfig(newConfig: Partial<SystemConfig>): Promise<void> {
    const docRef = doc(db, 'system_settings', 'global_config');
    await setDoc(docRef, newConfig, { merge: true });
}

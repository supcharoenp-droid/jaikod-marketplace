/**
 * AI Feature Flags Configuration
 * ระบบควบคุมเปิด-ปิดฟีเจอร์ AI ทั้งหมด
 */

export interface AIFeature {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
    phase: 1 | 2 | 3 | 4;
    cost: {
        monthly: number;
        perRequest?: number;
    };
    limits?: {
        maxRequests?: number;
        maxUsers?: number;
        budgetLimit?: number;
    };
    dependencies?: string[];
}

export interface AIFeatureConfig {
    features: Record<string, AIFeature>;
    globalSettings: {
        testMode: boolean;
        budgetLimit: number;
        alertThreshold: number;
    };
}

// ========================================
// Default Configuration
// ========================================
export const DEFAULT_AI_CONFIG: AIFeatureConfig = {
    features: {
        // ========================================
        // Phase 1: FREE TIER (เปิดใช้งานทันที)
        // ========================================
        'ai-price-estimator': {
            id: 'ai-price-estimator',
            name: 'AI Price Estimator',
            description: 'ประเมินราคาสินค้าอัจฉริยะ',
            enabled: true,
            phase: 1,
            cost: {
                monthly: 0, // Client-side, ไม่มีค่าใช้จ่าย
            },
        },

        'ai-description-generator': {
            id: 'ai-description-generator',
            name: 'AI Description Generator',
            description: 'สร้างรายละเอียดสินค้าอัตโนมัติ',
            enabled: true,
            phase: 1,
            cost: {
                monthly: 0, // Template-based, ไม่มีค่าใช้จ่าย
            },
        },

        'basic-search': {
            id: 'basic-search',
            name: 'Basic Search',
            description: 'ค้นหาสินค้าแบบพื้นฐาน',
            enabled: true,
            phase: 1,
            cost: {
                monthly: 0, // Firestore Query, ไม่มีค่าใช้จ่าย
            },
        },

        'zone-filter': {
            id: 'zone-filter',
            name: 'Zone/Area Filter',
            description: 'กรองสินค้าตามพื้นที่',
            enabled: true,
            phase: 1,
            cost: {
                monthly: 0, // Database query, ไม่มีค่าใช้จ่าย
            },
        },

        'image-compression': {
            id: 'image-compression',
            name: 'Auto Image Compression',
            description: 'บีบอัดรูปภาพอัตโนมัติ',
            enabled: true,
            phase: 1,
            cost: {
                monthly: 0, // Client-side, ไม่มีค่าใช้จ่าย
            },
        },

        'distance-display': {
            id: 'distance-display',
            name: 'Distance Display',
            description: 'แสดงระยะทางระหว่างผู้ซื้อกับสินค้า',
            enabled: true,  // Admin สามารถปิดได้
            phase: 1,
            cost: {
                monthly: 0, // Client-side calculation, ไม่มีค่าใช้จ่าย
            },
        },

        'firebase-integration': {
            id: 'firebase-integration',
            name: 'Firebase/Firestore Integration',
            description: 'เชื่อมต่อ Firebase Database',
            enabled: true,
            phase: 1,
            cost: {
                monthly: 0, // Free tier: 50K reads, 20K writes/day
            },
        },

        'google-maps': {
            id: 'google-maps',
            name: 'Google Maps Integration',
            description: 'แผนที่และค้นหาสถานที่',
            enabled: false,  // ปิดไว้ก่อน รอ API Key
            phase: 1,
            cost: {
                monthly: 0, // $200 free credit/month
                perRequest: 0.005, // ~฿0.17/request
            },
            limits: {
                maxRequests: 40000, // $200 credit
            },
        },

        'payment-gateway': {
            id: 'payment-gateway',
            name: 'Payment Gateway',
            description: 'ระบบชำระเงิน (PromptPay, Bank Transfer)',
            enabled: false,  // ปิดไว้ก่อน รอตั้งค่า
            phase: 1,
            cost: {
                monthly: 0,
                perRequest: 0, // PromptPay/Bank Transfer ไม่มีค่าธรรมเนียม
            },
        },

        // ========================================
        // Phase 2: LOW COST (1,000-10,000 users)
        // ========================================
        'chat-quick-replies': {
            id: 'chat-quick-replies',
            name: 'Chat Quick Replies',
            description: 'คำตอบสำเร็จรูปในแชท',
            enabled: false, // ปิดไว้ก่อน
            phase: 2,
            cost: {
                monthly: 10,
                perRequest: 0,
            },
            limits: {
                maxUsers: 1000,
                budgetLimit: 100,
            },
        },

        'chat-ai-suggestions': {
            id: 'chat-ai-suggestions',
            name: 'AI Chat Suggestions',
            description: 'AI แนะนำคำตอบในแชท',
            enabled: false,
            phase: 2,
            cost: {
                monthly: 20,
                perRequest: 0.001,
            },
            limits: {
                maxRequests: 10000,
                budgetLimit: 100,
            },
            dependencies: ['chat-quick-replies'],
        },

        'location-search': {
            id: 'location-search',
            name: 'Location-Based Search',
            description: 'ค้นหาสินค้าตามพิกัด',
            enabled: false,
            phase: 2,
            cost: {
                monthly: 25,
                perRequest: 0.007, // Google Maps API
            },
            limits: {
                maxRequests: 10000,
                budgetLimit: 50,
            },
        },

        'basic-personalization': {
            id: 'basic-personalization',
            name: 'Basic Personalization',
            description: 'แนะนำสินค้าตามพฤติกรรม',
            enabled: false,
            phase: 2,
            cost: {
                monthly: 15,
            },
            limits: {
                maxUsers: 5000,
            },
        },

        // ========================================
        // Phase 3: MEDIUM COST (10,000-50,000 users)
        // ========================================
        'smart-search-nlp': {
            id: 'smart-search-nlp',
            name: 'Smart Search (NLP)',
            description: 'ค้นหาด้วย Natural Language',
            enabled: false,
            phase: 3,
            cost: {
                monthly: 50,
                perRequest: 0.005,
            },
            limits: {
                maxRequests: 50000,
                budgetLimit: 100,
            },
        },

        'voice-search': {
            id: 'voice-search',
            name: 'Voice Search',
            description: 'ค้นหาด้วยเสียง',
            enabled: false,
            phase: 3,
            cost: {
                monthly: 30,
                perRequest: 0.006, // Google Speech-to-Text
            },
            limits: {
                maxRequests: 10000,
                budgetLimit: 60,
            },
        },

        'advanced-personalization': {
            id: 'advanced-personalization',
            name: 'Advanced Personalization',
            description: 'แนะนำสินค้าแบบ AI',
            enabled: false,
            phase: 3,
            cost: {
                monthly: 75,
            },
            limits: {
                maxUsers: 30000,
                budgetLimit: 100,
            },
            dependencies: ['basic-personalization'],
        },

        'image-auto-enhance': {
            id: 'image-auto-enhance',
            name: 'Auto Image Enhancement',
            description: 'ปรับแต่งรูปภาพอัตโนมัติ',
            enabled: false,
            phase: 3,
            cost: {
                monthly: 20,
                perRequest: 0.01,
            },
            limits: {
                maxRequests: 5000,
            },
        },

        // ========================================
        // Phase 4: PREMIUM (50,000+ users)
        // ========================================
        'visual-search': {
            id: 'visual-search',
            name: 'Visual Search',
            description: 'ค้นหาด้วยรูปภาพ',
            enabled: false,
            phase: 4,
            cost: {
                monthly: 100,
                perRequest: 0.0015, // Google Vision API
            },
            limits: {
                maxRequests: 10000,
                budgetLimit: 150,
            },
        },

        'background-removal': {
            id: 'background-removal',
            name: 'AI Background Removal',
            description: 'ลบพื้นหลังด้วย AI',
            enabled: false,
            phase: 4,
            cost: {
                monthly: 50,
                perRequest: 0.02, // remove.bg API
            },
            limits: {
                maxRequests: 5000,
                budgetLimit: 100,
            },
        },

        'ai-chatbot': {
            id: 'ai-chatbot',
            name: 'AI Chatbot',
            description: 'ตอบแชทอัตโนมัติ 24/7',
            enabled: false,
            phase: 4,
            cost: {
                monthly: 200,
                perRequest: 0.002,
            },
            limits: {
                maxRequests: 50000,
                budgetLimit: 500,
            },
            dependencies: ['chat-ai-suggestions'],
        },

        'ar-try-on': {
            id: 'ar-try-on',
            name: 'AR Try-On',
            description: 'ทดลองสินค้าด้วย AR',
            enabled: false,
            phase: 4,
            cost: {
                monthly: 300,
            },
            limits: {
                maxUsers: 100000,
                budgetLimit: 800,
            },
        },

        'image-recognition': {
            id: 'image-recognition',
            name: 'AI Image Recognition',
            description: 'รู้จำสินค้าจากรูปภาพ',
            enabled: false,
            phase: 4,
            cost: {
                monthly: 150,
                perRequest: 0.0015,
            },
            limits: {
                maxRequests: 20000,
                budgetLimit: 200,
            },
            dependencies: ['visual-search'],
        },
    },

    globalSettings: {
        testMode: process.env.NODE_ENV === 'development',
        budgetLimit: 500, // $500/month
        alertThreshold: 0.8, // แจ้งเตือนเมื่อใช้ 80% ของ budget
    },
};

// ========================================
// Helper Functions
// ========================================

/**
 * ตรวจสอบว่าฟีเจอร์เปิดใช้งานหรือไม่
 */
export function isFeatureEnabled(featureId: string, config: AIFeatureConfig = DEFAULT_AI_CONFIG): boolean {
    const feature = config.features[featureId];
    if (!feature) return false;

    // ถ้าอยู่ใน Test Mode ให้เปิดทุกอย่าง
    if (config.globalSettings.testMode) return true;

    // ตรวจสอบ dependencies
    if (feature.dependencies) {
        const allDepsEnabled = feature.dependencies.every(depId =>
            isFeatureEnabled(depId, config)
        );
        if (!allDepsEnabled) return false;
    }

    return feature.enabled;
}

/**
 * คำนวณค่าใช้จ่ายรวมต่อเดือน
 */
export function calculateMonthlyCost(config: AIFeatureConfig = DEFAULT_AI_CONFIG): number {
    return Object.values(config.features)
        .filter(f => f.enabled)
        .reduce((sum, f) => sum + f.cost.monthly, 0);
}

/**
 * ดึงฟีเจอร์ที่เปิดใช้งาน
 */
export function getEnabledFeatures(config: AIFeatureConfig = DEFAULT_AI_CONFIG): AIFeature[] {
    return Object.values(config.features).filter(f => f.enabled);
}

/**
 * ดึงฟีเจอร์ตาม Phase
 */
export function getFeaturesByPhase(phase: number, config: AIFeatureConfig = DEFAULT_AI_CONFIG): AIFeature[] {
    return Object.values(config.features).filter(f => f.phase === phase);
}

/**
 * ตรวจสอบว่าเกิน Budget หรือไม่
 */
export function isOverBudget(currentCost: number, config: AIFeatureConfig = DEFAULT_AI_CONFIG): boolean {
    return currentCost > config.globalSettings.budgetLimit;
}

/**
 * ตรวจสอบว่าควรแจ้งเตือนหรือไม่
 */
export function shouldAlert(currentCost: number, config: AIFeatureConfig = DEFAULT_AI_CONFIG): boolean {
    const threshold = config.globalSettings.budgetLimit * config.globalSettings.alertThreshold;
    return currentCost >= threshold;
}

/**
 * เปิดฟีเจอร์
 */
export function enableFeature(featureId: string, config: AIFeatureConfig): AIFeatureConfig {
    return {
        ...config,
        features: {
            ...config.features,
            [featureId]: {
                ...config.features[featureId],
                enabled: true,
            },
        },
    };
}

/**
 * ปิดฟีเจอร์
 */
export function disableFeature(featureId: string, config: AIFeatureConfig): AIFeatureConfig {
    return {
        ...config,
        features: {
            ...config.features,
            [featureId]: {
                ...config.features[featureId],
                enabled: false,
            },
        },
    };
}

/**
 * อัพเดท Budget Limit
 */
export function updateBudgetLimit(newLimit: number, config: AIFeatureConfig): AIFeatureConfig {
    return {
        ...config,
        globalSettings: {
            ...config.globalSettings,
            budgetLimit: newLimit,
        },
    };
}

/**
 * Store Setup Wizard - Types & Configuration
 * 
 * ระบบสร้างร้านค้าระดับมืออาชีพพร้อม AI Analysis
 */

// ==========================================
// WIZARD STEP DEFINITIONS
// ==========================================

export type WizardStepId =
    | 'welcome'
    | 'store_type'
    | 'basic_info'
    | 'business_verification'
    | 'store_branding'
    | 'payment_setup'
    | 'shipping_config'
    | 'first_product'
    | 'ai_analysis'
    | 'completion'

export interface WizardStep {
    id: WizardStepId
    order: number
    title: string
    title_th: string
    description: string
    description_th: string
    icon: string
    required: boolean
    estimated_time: number // minutes
    requires_store_type?: ('individual' | 'general_store' | 'official_store')[]
}

export const WIZARD_STEPS: WizardStep[] = [
    {
        id: 'welcome',
        order: 0,
        title: 'Welcome',
        title_th: 'ยินดีต้อนรับ',
        description: 'Quick overview of what to expect',
        description_th: 'ภาพรวมสิ่งที่จะเกิดขึ้น',
        icon: '👋',
        required: true,
        estimated_time: 1
    },
    {
        id: 'store_type',
        order: 1,
        title: 'Choose Store Type',
        title_th: 'เลือกประเภทร้านค้า',
        description: 'Individual, General Store, or Official Store',
        description_th: 'ผู้ขายทั่วไป, ร้านค้าทั่วไป, หรือร้านค้าทางการ',
        icon: '🏪',
        required: true,
        estimated_time: 2
    },
    {
        id: 'basic_info',
        order: 2,
        title: 'Basic Information',
        title_th: 'ข้อมูลพื้นฐาน',
        description: 'Store name, description, and contact',
        description_th: 'ชื่อร้าน, คำอธิบาย, และข้อมูลติดต่อ',
        icon: '📝',
        required: true,
        estimated_time: 3
    },
    {
        id: 'business_verification',
        order: 3,
        title: 'Business Verification',
        title_th: 'ยืนยันธุรกิจ',
        description: 'Upload business documents for verification',
        description_th: 'อัปโหลดเอกสารธุรกิจเพื่อยืนยันตัวตน',
        icon: '✅',
        required: true,
        estimated_time: 5,
        requires_store_type: ['official_store']
    },
    {
        id: 'store_branding',
        order: 4,
        title: 'Store Branding',
        title_th: 'แบรนด์ร้านค้า',
        description: 'Logo, banner, and visual identity',
        description_th: 'โลโก้, แบนเนอร์, และรูปแบบภาพลักษณ์',
        icon: '🎨',
        required: false,
        estimated_time: 5,
        requires_store_type: ['general_store', 'official_store']
    },
    {
        id: 'payment_setup',
        order: 5,
        title: 'Payment Setup',
        title_th: 'ตั้งค่าการชำระเงิน',
        description: 'Bank account for receiving payments',
        description_th: 'บัญชีธนาคารสำหรับรับเงิน',
        icon: '💳',
        required: true,
        estimated_time: 3
    },
    {
        id: 'shipping_config',
        order: 6,
        title: 'Shipping Configuration',
        title_th: 'ตั้งค่าการจัดส่ง',
        description: 'Shipping zones and methods',
        description_th: 'พื้นที่จัดส่งและวิธีการจัดส่ง',
        icon: '📦',
        required: true,
        estimated_time: 3
    },
    {
        id: 'first_product',
        order: 7,
        title: 'First Product',
        title_th: 'สินค้าชิ้นแรก',
        description: 'Create your first listing',
        description_th: 'สร้างประกาศขายชิ้นแรกของคุณ',
        icon: '📸',
        required: false,
        estimated_time: 5
    },
    {
        id: 'ai_analysis',
        order: 8,
        title: 'AI Store Analysis',
        title_th: 'AI วิเคราะห์ร้านค้า',
        description: 'Get AI-powered recommendations',
        description_th: 'รับคำแนะนำจาก AI',
        icon: '🤖',
        required: false,
        estimated_time: 2
    },
    {
        id: 'completion',
        order: 9,
        title: 'All Done!',
        title_th: 'เสร็จสมบูรณ์!',
        description: 'Your store is ready',
        description_th: 'ร้านค้าของคุณพร้อมแล้ว',
        icon: '🎉',
        required: true,
        estimated_time: 1
    }
]

// ==========================================
// STORE TYPE SELECTION
// ==========================================

export interface StoreTypeOption {
    id: 'individual' | 'general_store' | 'official_store'
    name: string
    name_th: string
    tagline: string
    tagline_th: string
    icon: string
    color: string
    gradient: string
    features: string[]
    features_th: string[]
    requirements: string[]
    requirements_th: string[]
    recommended_for: string[]
    recommended_for_th: string[]
    listing_limit: number | null
    monthly_fee: number
    commission_rate: number
}

export const STORE_TYPE_OPTIONS: StoreTypeOption[] = [
    {
        id: 'individual',
        name: 'Individual Seller',
        name_th: 'ผู้ขายทั่วไป',
        tagline: 'Start selling in minutes',
        tagline_th: 'เริ่มขายได้ทันที',
        icon: '👤',
        color: '#6B7280',
        gradient: 'from-gray-500 to-gray-600',
        features: [
            'Quick setup - no documents',
            'Up to 20 active listings',
            '5 photos per listing',
            'Chat with buyers'
        ],
        features_th: [
            'สมัครง่าย ไม่ต้องใช้เอกสาร',
            'ลงขายได้สูงสุด 20 รายการ',
            '5 รูปต่อประกาศ',
            'แชทกับผู้ซื้อได้'
        ],
        requirements: [
            'Email verification',
            'Phone verification (optional)'
        ],
        requirements_th: [
            'ยืนยันอีเมล',
            'ยืนยันเบอร์โทร (ไม่บังคับ)'
        ],
        recommended_for: [
            'Second-hand sellers',
            'Occasional sellers',
            'Testing the platform'
        ],
        recommended_for_th: [
            'ขายของมือสอง',
            'ขายเป็นครั้งคราว',
            'ทดลองใช้งาน'
        ],
        listing_limit: 20,
        monthly_fee: 0,
        commission_rate: 5
    },
    {
        id: 'general_store',
        name: 'General Store',
        name_th: 'ร้านค้าทั่วไป',
        tagline: 'Professional selling experience',
        tagline_th: 'ประสบการณ์ขายระดับมืออาชีพ',
        icon: '🏪',
        color: '#3B82F6',
        gradient: 'from-blue-500 to-indigo-600',
        features: [
            'Unlimited listings',
            '10 photos per listing',
            'Custom store page',
            'Create coupons',
            'Inventory management',
            'Sales analytics'
        ],
        features_th: [
            'ลงขายไม่จำกัด',
            '10 รูปต่อประกาศ',
            'หน้าร้านค้าของตัวเอง',
            'สร้างคูปองส่วนลด',
            'จัดการสต็อกสินค้า',
            'วิเคราะห์ยอดขาย'
        ],
        requirements: [
            'ID verification (KYC)',
            'Phone verification',
            'Bank account'
        ],
        requirements_th: [
            'ยืนยันตัวตน (KYC)',
            'ยืนยันเบอร์โทร',
            'บัญชีธนาคาร'
        ],
        recommended_for: [
            'Small businesses',
            'Regular sellers',
            'Growing operations'
        ],
        recommended_for_th: [
            'ธุรกิจขนาดเล็ก',
            'ขายเป็นประจำ',
            'ขยายกิจการ'
        ],
        listing_limit: null,
        monthly_fee: 0,
        commission_rate: 4
    },
    {
        id: 'official_store',
        name: 'Official Store',
        name_th: 'ร้านค้าทางการ',
        tagline: 'Verified business with premium features',
        tagline_th: 'ธุรกิจที่ได้รับการยืนยันพร้อมฟีเจอร์พรีเมียม',
        icon: '🏢',
        color: '#10B981',
        gradient: 'from-emerald-500 to-teal-600',
        features: [
            'Everything in General Store',
            '20 photos per listing',
            'Verified badge ✅',
            'Flash Sale access',
            'API integration',
            'Priority support',
            'Advanced analytics',
            'Custom store themes'
        ],
        features_th: [
            'ทุกอย่างใน ร้านค้าทั่วไป',
            '20 รูปต่อประกาศ',
            'เครื่องหมายยืนยัน ✅',
            'เข้าร่วม Flash Sale',
            'เชื่อมต่อ API',
            'ซัพพอร์ตด่วน',
            'วิเคราะห์ขั้นสูง',
            'ธีมร้านค้าพิเศษ'
        ],
        requirements: [
            'Business registration',
            'Tax ID / VAT registration',
            'Business bank account',
            'ID verification (Owner/Director)'
        ],
        requirements_th: [
            'ทะเบียนพาณิชย์/หนังสือจดทะเบียน',
            'เลขประจำตัวผู้เสียภาษี',
            'บัญชีธนาคารนิติบุคคล',
            'ยืนยันตัวตนเจ้าของ/กรรมการ'
        ],
        recommended_for: [
            'Registered businesses',
            'Brand owners',
            'High-volume sellers'
        ],
        recommended_for_th: [
            'ธุรกิจจดทะเบียน',
            'เจ้าของแบรนด์',
            'ยอดขายสูง'
        ],
        listing_limit: null,
        monthly_fee: 0,
        commission_rate: 3
    }
]

// ==========================================
// STORE HEALTH SCORE
// ==========================================

export interface StoreHealthMetric {
    id: string
    name: string
    name_th: string
    description_th: string
    weight: number
    max_score: number
}

export const STORE_HEALTH_METRICS: StoreHealthMetric[] = [
    {
        id: 'profile_completeness',
        name: 'Profile Completeness',
        name_th: 'ความสมบูรณ์โปรไฟล์',
        description_th: 'กรอกข้อมูลร้านค้าครบถ้วน',
        weight: 0.15,
        max_score: 100
    },
    {
        id: 'response_rate',
        name: 'Response Rate',
        name_th: 'อัตราการตอบกลับ',
        description_th: 'ตอบแชทลูกค้าภายใน 1 ชั่วโมง',
        weight: 0.20,
        max_score: 100
    },
    {
        id: 'shipping_speed',
        name: 'Shipping Speed',
        name_th: 'ความเร็วในการจัดส่ง',
        description_th: 'ส่งสินค้าภายใน 24-48 ชั่วโมง',
        weight: 0.20,
        max_score: 100
    },
    {
        id: 'product_quality',
        name: 'Product Quality',
        name_th: 'คุณภาพสินค้า',
        description_th: 'คะแนนรีวิวสินค้าจากลูกค้า',
        weight: 0.20,
        max_score: 100
    },
    {
        id: 'listing_quality',
        name: 'Listing Quality',
        name_th: 'คุณภาพการลงขาย',
        description_th: 'รูปภาพชัด คำอธิบายละเอียด',
        weight: 0.15,
        max_score: 100
    },
    {
        id: 'policy_compliance',
        name: 'Policy Compliance',
        name_th: 'การปฏิบัติตามกฎ',
        description_th: 'ไม่ฝ่าฝืนนโยบายแพลตฟอร์ม',
        weight: 0.10,
        max_score: 100
    }
]

export interface StoreHealthScore {
    overall_score: number // 0-100
    grade: 'A+' | 'A' | 'B' | 'C' | 'D' | 'F'
    grade_color: string
    metrics: {
        metric_id: string
        score: number
        trend: 'up' | 'down' | 'stable'
        issues?: string[]
        suggestions?: string[]
    }[]
    badges: string[]
    last_updated: Date
}

export function calculateStoreGrade(score: number): { grade: string; color: string } {
    if (score >= 95) return { grade: 'A+', color: '#10B981' }
    if (score >= 85) return { grade: 'A', color: '#22C55E' }
    if (score >= 70) return { grade: 'B', color: '#84CC16' }
    if (score >= 55) return { grade: 'C', color: '#EAB308' }
    if (score >= 40) return { grade: 'D', color: '#F97316' }
    return { grade: 'F', color: '#EF4444' }
}

// ==========================================
// AI STORE ANALYZER
// ==========================================

export interface AIAnalysisCategory {
    id: string
    name: string
    name_th: string
    icon: string
}

export const AI_ANALYSIS_CATEGORIES: AIAnalysisCategory[] = [
    { id: 'store_setup', name: 'Store Setup', name_th: 'การตั้งค่าร้าน', icon: '🏪' },
    { id: 'product_photos', name: 'Product Photos', name_th: 'รูปภาพสินค้า', icon: '📸' },
    { id: 'pricing_strategy', name: 'Pricing Strategy', name_th: 'กลยุทธ์ราคา', icon: '💰' },
    { id: 'product_descriptions', name: 'Descriptions', name_th: 'คำอธิบายสินค้า', icon: '📝' },
    { id: 'seo_keywords', name: 'SEO & Keywords', name_th: 'SEO และคีย์เวิร์ด', icon: '🔍' },
    { id: 'competitor_analysis', name: 'Competitors', name_th: 'วิเคราะห์คู่แข่ง', icon: '📊' }
]

export interface AIRecommendation {
    id: string
    category: string
    priority: 'high' | 'medium' | 'low'
    title: string
    title_th: string
    description: string
    description_th: string
    action: string
    action_th: string
    estimated_impact: string
    estimated_impact_th: string
    difficulty: 'easy' | 'medium' | 'hard'
    completed: boolean
}

export interface AIStoreAnalysis {
    store_id: string
    analyzed_at: Date
    overall_score: number

    strengths: {
        title: string
        title_th: string
        description_th: string
    }[]

    weaknesses: {
        title: string
        title_th: string
        description_th: string
    }[]

    opportunities: {
        title: string
        title_th: string
        description_th: string
    }[]

    recommendations: AIRecommendation[]

    market_insights: {
        trending_categories: string[]
        peak_selling_hours: string[]
        suggested_products: string[]
    }

    competitor_summary: {
        total_competitors: number
        your_ranking: number
        price_position: 'lower' | 'average' | 'higher'
    }
}

// ==========================================
// ONBOARDING TUTORIALS
// ==========================================

export interface TutorialStep {
    id: string
    target_element?: string
    title: string
    title_th: string
    content: string
    content_th: string
    position: 'top' | 'bottom' | 'left' | 'right' | 'center'
    highlight?: boolean
    action?: {
        type: 'click' | 'input' | 'scroll' | 'wait'
        target?: string
    }
}

export interface TutorialFlow {
    id: string
    name: string
    name_th: string
    trigger: 'first_visit' | 'manual' | 'feature_unlock'
    steps: TutorialStep[]
}

export const TUTORIAL_FLOWS: TutorialFlow[] = [
    {
        id: 'store_dashboard',
        name: 'Store Dashboard Tour',
        name_th: 'ทัวร์แดชบอร์ดร้านค้า',
        trigger: 'first_visit',
        steps: [
            {
                id: 'welcome',
                title: 'Welcome to Your Store!',
                title_th: 'ยินดีต้อนรับสู่ร้านค้าของคุณ!',
                content: 'This is your control center for managing your store.',
                content_th: 'นี่คือศูนย์ควบคุมสำหรับจัดการร้านค้าของคุณ',
                position: 'center'
            },
            {
                id: 'store_health',
                target_element: '#store-health-card',
                title: 'Store Health Score',
                title_th: 'คะแนนสุขภาพร้าน',
                content: 'Monitor your store\'s performance here. Higher scores mean better visibility!',
                content_th: 'ติดตามประสิทธิภาพร้านค้าที่นี่ คะแนนสูง = การมองเห็นดีขึ้น!',
                position: 'right',
                highlight: true
            },
            {
                id: 'quick_actions',
                target_element: '#quick-actions',
                title: 'Quick Actions',
                title_th: 'การดำเนินการด่วน',
                content: 'Common tasks like adding products, viewing orders, and more.',
                content_th: 'งานทั่วไป เช่น เพิ่มสินค้า ดูคำสั่งซื้อ และอื่นๆ',
                position: 'bottom',
                highlight: true
            },
            {
                id: 'jaistar_balance',
                target_element: '#jaistar-balance',
                title: 'JaiStar Balance',
                title_th: 'ยอด JaiStar',
                content: 'Use JaiStar to boost your products and get more visibility.',
                content_th: 'ใช้ JaiStar โปรโมทสินค้าเพื่อเพิ่มการมองเห็น',
                position: 'left',
                highlight: true
            },
            {
                id: 'ai_insights',
                target_element: '#ai-insights',
                title: 'AI Insights',
                title_th: 'ข้อมูลเชิงลึกจาก AI',
                content: 'Get personalized recommendations to improve your store.',
                content_th: 'รับคำแนะนำส่วนบุคคลเพื่อปรับปรุงร้านค้า',
                position: 'bottom',
                highlight: true
            }
        ]
    },
    {
        id: 'first_listing',
        name: 'Create Your First Listing',
        name_th: 'สร้างประกาศขายชิ้นแรก',
        trigger: 'manual',
        steps: [
            {
                id: 'photo_tips',
                title: 'Photo Tips',
                title_th: 'เคล็ดลับถ่ายรูป',
                content: 'Good photos = More sales! Use natural lighting and show all angles.',
                content_th: 'รูปดี = ขายได้! ใช้แสงธรรมชาติและถ่ายทุกมุม',
                position: 'center'
            },
            {
                id: 'ai_assist',
                target_element: '#ai-assist-button',
                title: 'AI Photo Analysis',
                title_th: 'AI วิเคราะห์รูป',
                content: 'Our AI will automatically suggest title, description, and price!',
                content_th: 'AI ของเราจะแนะนำชื่อ คำอธิบาย และราคาอัตโนมัติ!',
                position: 'bottom',
                highlight: true
            }
        ]
    }
]

// ==========================================
// WIZARD STATE
// ==========================================

export interface WizardState {
    current_step: WizardStepId
    selected_store_type: 'individual' | 'general_store' | 'official_store' | null
    completed_steps: WizardStepId[]

    // Form data
    basic_info: {
        store_name: string
        store_description: string
        contact_phone: string
        contact_email: string
    }

    business_verification: {
        business_type: 'individual' | 'company' | 'partnership'
        business_name?: string
        tax_id?: string
        registration_doc_url?: string
        id_card_url?: string
    }

    branding: {
        logo_url?: string
        banner_url?: string
        theme_color?: string
        slogan?: string
    }

    payment: {
        bank_name: string
        account_number: string
        account_name: string
    }

    shipping: {
        processing_time: number // days
        shipping_zones: string[]
        shipping_methods: string[]
    }

    // Progress
    started_at: Date
    last_updated: Date
}

export const initialWizardState: WizardState = {
    current_step: 'welcome',
    selected_store_type: null,
    completed_steps: [],
    basic_info: {
        store_name: '',
        store_description: '',
        contact_phone: '',
        contact_email: ''
    },
    business_verification: {
        business_type: 'individual'
    },
    branding: {},
    payment: {
        bank_name: '',
        account_number: '',
        account_name: ''
    },
    shipping: {
        processing_time: 1,
        shipping_zones: ['กรุงเทพฯ และปริมณฑล'],
        shipping_methods: ['ส่งพัสดุ']
    },
    started_at: new Date(),
    last_updated: new Date()
}

// ==========================================
// UTILITY FUNCTIONS
// ==========================================

export function getStepsForStoreType(storeType: 'individual' | 'general_store' | 'official_store'): WizardStep[] {
    return WIZARD_STEPS.filter(step => {
        if (!step.requires_store_type) return true
        return step.requires_store_type.includes(storeType)
    })
}

export function getEstimatedTotalTime(storeType: 'individual' | 'general_store' | 'official_store'): number {
    const steps = getStepsForStoreType(storeType)
    return steps.reduce((total, step) => total + step.estimated_time, 0)
}

export function getProgressPercentage(state: WizardState): number {
    if (!state.selected_store_type) return 0
    const totalSteps = getStepsForStoreType(state.selected_store_type).length
    const completedSteps = state.completed_steps.length
    return Math.round((completedSteps / totalSteps) * 100)
}

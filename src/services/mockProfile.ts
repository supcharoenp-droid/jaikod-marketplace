import { analyzeUserProfile, UserProfileData } from './ai/profileAnalyzer'
import { evaluateUserTier, TierEvaluationResult } from './ai/tierSystem'

export type UserRole = 'buyer' | 'seller' | 'store'

export interface Product {
    id: string
    title: string
    price: number
    images: string[]
    category: string
    description: string
    created_at: string
    seller_id: string
    slug: string
    views_count: number
    status: 'active' | 'sold' | 'inactive'
    price_negotiable: boolean
}

export interface SmartUserProfile {
    id: string
    username: string
    displayName: string
    avatar: string
    role: UserRole
    joinDate: string
    theme: {
        gradient: string
        primaryColor: string
    }
    stats: {
        followers: number
        following: number
        likes: number
        reviews: number
        rating: number
        total_sales?: number
        response_rate?: number
    }
    persona: {
        title: string
        description: string
        tags: string[]
    }

    // Role Specific Data
    buyerData?: {
        wishlist: Product[]
        recentlyViewed: Product[]
        interests: string[]
        aiRecommendations: Product[]
    }

    sellerData?: {
        trustScore: number
        badges: string[]
        activeListings: number
        performance: {
            views: number
            clicks: number
            ctr: number
        }
        dailyTips: { title: string; desc: string; type: 'timing' | 'pricing' | 'marketing' }[]
    }

    storeData?: {
        bannerUrl: string
        slogan: string
        categories: string[]
        inventoryHealth: number // 0-100
        highlights: string[] // e.g. "Fast Shipping", "Official Dealer"
        topProducts: Product[]
    }

    tierData?: TierEvaluationResult // New Tier Data

    // New AI Coach Data
    coaching: {
        trustScoreBreakdown: {
            score: number
            factors: { label: string; status: 'good' | 'warning' | 'critical'; impact: number }[]
        }
        dailyTasks: {
            id: string
            title: string
            desc: string
            reward: string // e.g. "+5 Trust Point"
            actionType: 'verify_id' | 'upload_photo' | 'gen_bio' | 'add_product' | 'boost_post'
            isCompleted: boolean
        }[]
        suggestions: {
            type: 'pricing' | 'content' | 'timing' | 'identity'
            message: string
            autoActionLabel?: string
        }[]
    }
}

// Mock Products
const MOCK_PRODUCTS: Product[] = [
    { id: '1', title: 'Vintage Rolex Submariner', price: 385000, images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49'], category: 'Watches', description: '', created_at: '', seller_id: '', slug: '', views_count: 0, status: 'active', price_negotiable: false },
    { id: '2', title: 'Leica M6 Film Camera', price: 125000, images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32'], category: 'Cameras', description: '', created_at: '', seller_id: '', slug: '', views_count: 0, status: 'active', price_negotiable: false },
    { id: '3', title: 'Herman Miller Aeron', price: 25000, images: ['https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1'], category: 'Furniture', description: '', created_at: '', seller_id: '', slug: '', views_count: 0, status: 'active', price_negotiable: false },
    { id: '4', title: 'MacBook Pro M3 Max', price: 119000, images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca4'], category: 'Electronics', description: '', created_at: '', seller_id: '', slug: '', views_count: 0, status: 'active', price_negotiable: false }
]

export const getSmartUserProfile = async (role: UserRole = 'buyer'): Promise<SmartUserProfile> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800))

    // 1. Define Raw Data based on Role
    // In a real app, this comes from DB
    const rawData: UserProfileData = {
        userId: 'user_123',
        role: role,
        hasAvatar: true,
        hasBio: role !== 'buyer', // Buyer has no bio in this mock
        bioLength: role === 'store' ? 150 : (role === 'seller' ? 80 : 0),
        isIdVerified: role !== 'buyer' && role !== 'seller', // Only Store is verified initially
        isPhoneVerified: true,
        isEmailVerified: true,
        avgResponseTimeMinutes: role === 'store' ? 5 : (role === 'seller' ? 45 : 0),
        lastLoginDaysAgo: 0,
        productsPosted: role === 'store' ? 50 : (role === 'seller' ? 12 : 0),
        successfulSales: role === 'store' ? 120 : (role === 'seller' ? 15 : 0),
        totalReviews: role === 'store' ? 85 : (role === 'seller' ? 8 : 0),
        avgRating: role === 'store' ? 4.9 : (role === 'seller' ? 4.2 : 0),
        followers: role === 'store' ? 2500 : (role === 'seller' ? 150 : 0),
        following: 45
    }

    // 2. Run AI Analysis
    const analysis = analyzeUserProfile(rawData)
    const { scores, analysis: insights } = analysis

    // 3. Run Tier Evaluation
    const tierEvaluation = evaluateUserTier(rawData, scores.trust_score)

    const baseProfile = {
        id: 'user_123',
        username: '@vintage_hunter',
        displayName: 'Alex The Collector',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=200&h=200',
        role,
        joinDate: 'Member since 2023',
        stats: {
            followers: rawData.followers,
            following: rawData.following,
            likes: 8500,
            reviews: rawData.totalReviews,
            rating: rawData.avgRating
        }
    }

    const commonCoaching: SmartUserProfile['coaching'] = {
        trustScoreBreakdown: {
            score: scores.trust_score,
            factors: [
                { label: 'Identity Verification', status: rawData.isIdVerified ? 'good' : 'warning', impact: rawData.isIdVerified ? 0 : 15 },
                { label: 'Profile Completeness', status: scores.profile_score > 80 ? 'good' : 'warning', impact: 0 },
                { label: 'Response Rate', status: rawData.avgResponseTimeMinutes < 60 ? 'good' : 'critical', impact: 25 }
            ]
        },
        dailyTasks: [
            // Dynamic Tasks based on Weaknesses
            ...(insights.weaknesses.includes('Identity not verified (High Impact)') ? [{
                id: '1', title: 'ยืนยันตัวตนด้วยบัตรประชาชน', desc: 'เพิ่มความน่าเชื่อถือทันที +40 Trust Score', reward: '+40 Score', actionType: 'verify_id' as const, isCompleted: false
            }] : []),
            ...(insights.weaknesses.includes('Bio is too short') || insights.weaknesses.includes('No bio provided') ? [{
                id: '2', title: 'เขียน Bio ให้น่าสนใจ', desc: 'ลูกค้าอยากรู้จักคุณมากขึ้น AI ช่วยเขียนให้ได้นะ', reward: '+5 Score', actionType: 'gen_bio' as const, isCompleted: false
            }] : []),
            { id: '3', title: 'เช็คอินประจำวัน', desc: 'รับบูสต์การมองเห็นฟรี', reward: '+10 XP', actionType: 'boost_post' as const, isCompleted: false }
        ],
        suggestions: insights.weaknesses.map((w: string) => ({
            type: 'identity' as const,
            message: `AI ตรวจพบจุดอ่อน: ${w}. เราแนะนำให้แก้ไขเพื่อเพิ่มความน่าเชื่อถือ`,
            autoActionLabel: 'แก้ไขเลย'
        }))
    }

    // Add logic to inject "Level Up" missions if near level up
    const tierMissions: any[] = []
    if (tierEvaluation.nextTier && tierEvaluation.isNearLevelUp) {
        tierEvaluation.missingRequirements.forEach((req: any, idx: number) => {
            tierMissions.push({
                id: `tier-req-${idx}`,
                title: `Level Up: ${req.label}`,
                desc: `Reach ${tierEvaluation.nextTier?.label} status to unlock exclusive perks!`,
                reward: 'Unlock Perk',
                actionType: req.label.includes('Verify') ? 'verify_id' as const : 'add_product' as const,
                isCompleted: false
            })
        })
    }

    if (role === 'buyer') {
        return {
            ...baseProfile,
            tierData: tierEvaluation,
            theme: {
                gradient: 'from-blue-500 via-indigo-500 to-purple-500',
                primaryColor: 'blue'
            },
            persona: {
                title: 'Curious Explorer',
                description: 'ชอบค้นหาสินค้าหายากและมีสไตล์เฉพาะตัว มักสนใจกล้องฟิล์มและนาฬิกาวินเทจ',
                tags: insights.tags.length > 0 ? insights.tags : ['New Member']
            },
            buyerData: {
                wishlist: MOCK_PRODUCTS.slice(0, 2),
                recentlyViewed: MOCK_PRODUCTS.slice(2, 4),
                interests: ['Film Photography', 'Luxury Watches', 'Ergonomic Chairs'],
                aiRecommendations: [MOCK_PRODUCTS[1], MOCK_PRODUCTS[3]]
            },
            coaching: {
                ...commonCoaching,
                dailyTasks: [
                    ...tierMissions,
                    ...commonCoaching.dailyTasks,
                    { id: '4', title: 'ตั้งค่าที่อยู่จัดส่ง', desc: 'เพื่อให้การสั่งซื้อรวดเร็วขึ้น', reward: '+5 XP', actionType: 'verify_id', isCompleted: false }
                ]
            }
        }
    }

    if (role === 'seller') {
        const trustBadges = []
        if (scores.trust_score > 80) trustBadges.push('Trusted Seller')
        if (scores.activity_score > 70) trustBadges.push('Active Seller')

        return {
            ...baseProfile,
            tierData: tierEvaluation,
            displayName: 'Alex Vintage Shop',
            role: 'seller',
            theme: {
                gradient: 'from-orange-400 via-pink-500 to-purple-500',
                primaryColor: 'orange'
            },
            persona: {
                title: 'Rising Star Seller',
                description: 'ผู้ขายที่มีอัตราการตอบกลับรวดเร็วและสินค้ามีคุณภาพสูง กำลังเป็นที่นิยมในหมวดแฟชั่นชาย',
                tags: [...trustBadges, ...insights.tags]
            },
            sellerData: {
                trustScore: scores.trust_score,
                badges: trustBadges,
                activeListings: rawData.productsPosted,
                performance: { views: 4500, clicks: 890, ctr: 4.5 },
                dailyTips: [
                    { title: 'Golden Hour', desc: 'โพสต์สินค้าตอน 19:00 - 21:00 น. วันนี้ เพื่อยอดวิวสูงสุด', type: 'timing' },
                    { title: 'Pricing Alert', desc: 'Leica M6 ของคุณราคาสูงกว่าคู่แข่ง 5% ลองลดเหลือ 120,000', type: 'pricing' }
                ]
            },
            coaching: {
                ...commonCoaching,
                dailyTasks: [
                    ...tierMissions,
                    ...commonCoaching.dailyTasks
                ]
            }
        }
    }

    // Store Role
    return {
        ...baseProfile,
        tierData: tierEvaluation,
        displayName: 'The Classic Gentleman',
        role: 'store',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?fit=crop&w=200&h=200',
        theme: {
            gradient: 'from-slate-900 via-gray-800 to-black',
            primaryColor: 'black'
        },
        persona: {
            title: 'Elite Boutique',
            description: 'ร้านค้าระดับพรีเมียมที่รวบรวมสินค้าสำหรับสุภาพบุรุษ คัดเลือกเฉพาะของแท้สภาพเยี่ยม',
            tags: ['Official Store', 'Premium Warranty', 'Expert Curated', ...insights.tags]
        },
        storeData: {
            bannerUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80',
            slogan: 'Timeless Elegance for Modern Men',
            categories: ['Luxury Watches', 'Classic Cameras', 'Leather Goods'],
            inventoryHealth: 95,
            highlights: ['สมาชิกสมาคมค้าของเก่า', 'ส่งด่วนใน 24 ชม.', 'รับประกันคืนเงิน'],
            topProducts: MOCK_PRODUCTS
        },
        coaching: {
            trustScoreBreakdown: {
                score: scores.trust_score,
                factors: [
                    { label: 'Professional License', status: 'good', impact: 0 },
                    { label: 'Customer Rating', status: 'good', impact: 0 }
                ]
            },
            dailyTasks: [
                { id: '1', title: 'Boost Post: Rolex', desc: 'เพิ่มยอดวิว 2 เท่าในช่วงเย็นนี้', reward: 'Sales Boost', actionType: 'boost_post', isCompleted: false },
                ...tierMissions,
                ...commonCoaching.dailyTasks
            ],
            suggestions: [
                { type: 'timing', message: 'สุดสัปดาห์นี้คนหาซื้อ "นาฬิกา" เยอะ เตรียมสต็อกให้พร้อม', autoActionLabel: 'Check Inventory' }
            ]
        }
    }
}


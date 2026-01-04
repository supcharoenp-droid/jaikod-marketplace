import { SellerProfile } from '@/types'
import { calculateSellerTrustScore } from './sellerScoring'
import { getUserBehavior, UserBehavior } from './behaviorTracking'

export interface RecommendedSeller extends SellerProfile {
    matchScore: number
    distanceKm: number
    expertCategories: string[]
    popularItems: string[]
    matchReason: string
}

// Mock sellers with location data
const MOCK_SELLERS_DB: any[] = [
    {
        id: 's_local_1',
        shop_name: 'Lung Too Gadgets',
        shop_slug: 'lung-too',
        shop_description: 'ขายมือถือมือสอง สภาพนางฟ้า นัดรับได้ทั่วลาดพร้าว',
        shop_logo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        location_province: 'กรุงเทพมหานคร',
        main_categories: ['mobile-tablet'],
        rating_score: 4.8,
        rating_count: 120,
        successful_sales_count: 300,
        response_rate: 98,
        is_verified_seller: true,
        badges: ['verified_seller', 'fast_reply'],
    },
    {
        id: 's_local_2',
        shop_name: 'Vintage Camera Club',
        shop_slug: 'vintage-cam',
        shop_description: 'กล้องฟิล์ม กล้องเก่าสะสม ของดีมีประกัน',
        shop_logo: 'https://images.unsplash.com/photo-1542206395-9feb3edaa68d?w=150&h=150&fit=crop',
        location_province: 'กรุงเทพมหานคร',
        main_categories: ['cameras', 'collectibles'],
        rating_score: 4.9,
        rating_count: 500,
        is_verified_seller: true,
        badges: ['top_seller'],
    },
    {
        id: 's_local_3',
        shop_name: 'AJ Sneakers',
        shop_slug: 'aj-sneakers',
        shop_description: 'รองเท้ามือสองของแท้ หายาก ราคาแบ่งปัน',
        shop_logo: 'https://images.unsplash.com/photo-1552346154-21d32810aba3?w=150&h=150&fit=crop',
        location_province: 'กรุงเทพมหานคร',
        main_categories: ['fashion'],
        rating_score: 4.5,
        rating_count: 80,
        is_verified_seller: false,
        badges: [],
    }
]

// Helper to calculate distance (Haversine formula simplified for demo)
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    // Mock distance for demo since Sellers DB doesn't have lat/lon in Type yet
    // return Math.random() * 10 

    // In real app, we would use real coords. 
    // Here we simulate distance based on fixed mock values logic or random
    return Math.floor(Math.random() * 50) / 10 // 0.0 - 5.0 km
}

export async function rankSellersByProximityAndTrust(
    userLat: number,
    userLng: number
): Promise<RecommendedSeller[]> {
    const behavior = getUserBehavior()
    const scoredSellers = MOCK_SELLERS_DB.map(seller => {
        // 1. Calculate Trust Score
        const trustAnalysis = calculateSellerTrustScore(seller)
        const trustScore = trustAnalysis.score

        // 2. Calculate Distance
        // Simulating lat/lng for sellers around user
        // In real app: sellers would have geomarkers
        const dist = getDistanceFromLatLonInKm(userLat, userLng, userLat + 0.01, userLng + 0.01)

        // 3. Category Match
        // Check if seller categories match user history
        const userInterests = Object.keys(behavior.profile.categoryScores).filter(k => behavior.profile.categoryScores[Number(k)] > 2)
        const hasInterestMatch = seller.main_categories?.some((c: string) => userInterests.includes(c))

        let matchScore = (trustScore * 0.5) // Base on trust

        // Boost for distance
        if (dist < 2) matchScore += 30
        else if (dist < 5) matchScore += 15

        // Boost for category match
        if (hasInterestMatch) matchScore += 20

        // Determine specific "Expert" categories for display
        const expertCats = seller.main_categories || []

        // Popular items (Mock)
        const popItems = ['iPhone 13', 'Instax Mini', 'Nike Dunk'].filter(() => Math.random() > 0.5)

        return {
            ...seller,
            matchScore: Math.min(100, Math.round(matchScore)),
            distanceKm: dist,
            expertCategories: expertCats,
            popularItems: popItems.length > 0 ? popItems : ['สินค้าแนะนำ'],
            matchReason: dist < 2 ? 'อยู่ใกล้คุณมาก' : (hasInterestMatch ? 'ขายหมวดที่คุณสนใจ' : 'ร้านแนะนำ'),
            trust_score: trustScore // Ensure this populates
        } as RecommendedSeller
    })

    // Sort by Total Match Score
    return scoredSellers.sort((a, b) => b.matchScore - a.matchScore)
}

export const USER_MOCK_LOCATION = {
    lat: 13.7563, // Bangkok
    lng: 100.5018
}

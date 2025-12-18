import { rankProducts } from './aiRankingEngine'
import { getAllProducts } from '@/lib/products'
import { getUserBehavior, trackInteraction } from './behaviorTracking'
import { Product } from '@/types'

// Mock context for detailed location until real geo is implemented
const MOCK_USER_CONTEXT = {
    userLocation: { lat: 13.7563, lng: 100.5018, province: 'กรุงเทพมหานคร' },
    trendingCategories: [
        { id: '1', growth: 0.8 },
        { id: '3', growth: 0.5 }
    ]
}

export interface MatchCard extends Product {
    matchScore: number
    matchReason?: string,
    distance?: string
}

/**
 * Generates a "Deck" of products for the user to swipe
 */
export async function getDiscoveryDeck(userId: string, limit: number = 20): Promise<MatchCard[]> {
    const behavior = getUserBehavior()

    // 1. Fetch diverse pool (Recent calls + Randoms to ensure discovery)
    const allProducts = await getAllProducts(100)

    // 2. Filter out already interacted products (Don't show same thing again)
    // In real app, check 'viewed_history' or 'swiped_history' from DB
    const seenIds = new Set(behavior.viewedProducts)
    const candidates = allProducts.filter(p => !seenIds.has(p.id))

    // 3. Rank with AI Engine
    const ranked = await rankProducts(candidates, {
        behavior,
        userLocation: MOCK_USER_CONTEXT.userLocation,
        trendingCategories: MOCK_USER_CONTEXT.trendingCategories
    })

    // 4. Format for Deck
    return ranked.slice(0, limit).map(item => {
        // Generate a "Match Reason" for UI
        let reason = "แนะนำสำหรับคุณ"
        if (item.factors.behavior > 80) reason = "ตรงกับความชอบของคุณ 95%"
        else if (item.factors.geo > 90) reason = "อยู่ใกล้คุณมาก (1 กม.)"
        else if (item.factors.trending > 80) reason = "กำลังเป็นกระแส 🔥"

        return {
            ...item.product,
            matchScore: item.totalScore,
            matchReason: reason,
            distance: '2.5 กม.' // Mock
        }
    })
}

/**
 * Handle Swipe Actions matches
 */
export async function processSwipeAction(product: Product, action: 'like' | 'pass' | 'superlike') {
    // 1. Update local behavior model immediately
    if (action === 'like') {
        trackInteraction('like', String(product.id), Number(product.category_id), product.price)
    } else if (action === 'superlike') {
        // Superlike counts as heavy interest
        trackInteraction('like', String(product.id), Number(product.category_id), product.price)
        trackInteraction('view', String(product.id), Number(product.category_id), product.price)
        // trigger save logic
    } else {
        // Pass - maybe negative scoring in future models
    }

    // 2. In real app: Send to API to record "Swipe History" so it doesn't appear again
    // await api.post('/swipes', { productId: product.id, action })
    console.log(`User swiped ${action} on ${product.title}`)
}

/**
 * SEARCH SUGGESTIONS API
 * 
 * GET /api/search/suggest?q=xxx
 * 
 * Returns:
 * - Autocomplete suggestions
 * - Trending searches
 * - Category matches
 * - Recent product previews
 */

import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, query, where, limit, getDocs, orderBy } from 'firebase/firestore'
import { CATEGORIES } from '@/constants/categories'

// Cache for trending searches (in production, use Redis)
let trendingCache: { keywords: string[], lastUpdate: number } = {
    keywords: [],
    lastUpdate: 0
}

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url)
    const queryText = searchParams.get('q') || ''
    const limitParam = parseInt(searchParams.get('limit') || '10')

    try {
        const suggestions = await generateSuggestions(queryText, limitParam)

        return NextResponse.json({
            success: true,
            data: suggestions
        })
    } catch (error) {
        console.error('[Suggest API] Error:', error)
        return NextResponse.json({
            success: false,
            error: 'Failed to generate suggestions'
        }, { status: 500 })
    }
}

async function generateSuggestions(queryText: string, maxResults: number) {
    const lowerQuery = queryText.toLowerCase().trim()

    // 1. Category Matches
    const categories = lowerQuery ? CATEGORIES
        .filter(c =>
            c.name_th.toLowerCase().includes(lowerQuery) ||
            c.name_en.toLowerCase().includes(lowerQuery) ||
            c.slug.includes(lowerQuery)
        )
        .slice(0, 3)
        .map(c => ({
            type: 'category',
            text: c.name_th,
            text_en: c.name_en,
            icon: c.icon,
            url: `/category/${c.slug}`,
            id: c.id
        }))
        : []

    // 2. Product Title Matches (quick preview)
    const productPreviews = lowerQuery.length >= 2
        ? await getProductPreviews(lowerQuery, 5)
        : []

    // 3. Trending Searches
    const trending = await getTrendingSearches()

    // 4. Generate keyword suggestions based on query
    const keywords = generateKeywordSuggestions(lowerQuery)

    // 5. Popular brands (if applicable)
    const brands = matchPopularBrands(lowerQuery)

    return {
        keywords: keywords.slice(0, maxResults),
        categories,
        products: productPreviews,
        trending: trending.slice(0, 6),
        brands: brands.slice(0, 3)
    }
}

async function getProductPreviews(searchQuery: string, maxItems: number) {
    try {
        // Search in listings first (newer system)
        const listingsRef = collection(db, 'listings')
        const listingsQ = query(listingsRef,
            where('status', '==', 'active'),
            limit(maxItems)
        )

        const snapshot = await getDocs(listingsQ)

        const results = snapshot.docs
            .map(doc => {
                const data = doc.data()
                return {
                    id: doc.id,
                    title: data.title,
                    title_th: data.title_th,
                    price: data.price,
                    thumbnail_url: data.thumbnail_url,
                    images: data.images,
                    slug: data.slug
                }
            })
            .filter((item) =>
                item.title?.toLowerCase().includes(searchQuery) ||
                item.title_th?.toLowerCase().includes(searchQuery)
            )
            .slice(0, maxItems)
            .map((item) => ({
                id: item.id,
                title: item.title_th || item.title,
                price: item.price,
                thumbnail: item.thumbnail_url || item.images?.[0]?.url || '/placeholder.jpg',
                url: `/listing/${item.slug || item.id}`
            }))

        return results
    } catch (error) {
        console.error('[Suggest] Product preview error:', error)
        return []
    }
}

async function getTrendingSearches(): Promise<string[]> {
    // Check cache
    if (Date.now() - trendingCache.lastUpdate < CACHE_TTL && trendingCache.keywords.length > 0) {
        return trendingCache.keywords
    }

    // In production, this would query analytics data
    // For now, return popular searches
    const trending = [
        'iPhone 15 Pro Max',
        'PS5 มือสอง',
        'MacBook Air M2',
        'รถยนต์ Honda',
        'คอนโดใกล้ BTS',
        'รองเท้า Nike',
        'กล้อง Fujifilm',
        'iPad Pro',
        'มอเตอร์ไซค์ Honda Wave',
        'Apple Watch'
    ]

    // Update cache
    trendingCache = {
        keywords: trending,
        lastUpdate: Date.now()
    }

    return trending
}

function generateKeywordSuggestions(query: string): string[] {
    if (!query || query.length < 2) return []

    // Common search patterns
    const suggestions = [
        query,
        `${query} มือสอง`,
        `${query} ราคาถูก`,
        `${query} ใหม่`,
        `${query} แท้`,
        `${query} มือ1`,
        `${query} สภาพดี`,
        `${query} ราคา`
    ]

    return suggestions
}

function matchPopularBrands(query: string): { name: string, category: string }[] {
    const brands = [
        // Electronics
        { name: 'Apple', keywords: ['apple', 'iphone', 'ipad', 'mac', 'airpod'] },
        { name: 'Samsung', keywords: ['samsung', 'galaxy', 'note'] },
        { name: 'Sony', keywords: ['sony', 'playstation', 'ps5', 'ps4'] },
        { name: 'Nintendo', keywords: ['nintendo', 'switch'] },
        { name: 'Canon', keywords: ['canon', 'eos'] },
        { name: 'Nikon', keywords: ['nikon'] },
        { name: 'Fujifilm', keywords: ['fuji', 'fujifilm', 'x-t', 'xt'] },

        // Fashion
        { name: 'Nike', keywords: ['nike', 'air jordan', 'dunk'] },
        { name: 'Adidas', keywords: ['adidas', 'yeezy'] },
        { name: 'Uniqlo', keywords: ['uniqlo'] },
        { name: 'H&M', keywords: ['h&m', 'hm'] },

        // Automotive
        { name: 'Toyota', keywords: ['toyota', 'camry', 'corolla', 'yaris', 'vios'] },
        { name: 'Honda', keywords: ['honda', 'civic', 'accord', 'city', 'jazz', 'wave', 'click'] },
        { name: 'Mazda', keywords: ['mazda', 'cx'] },
        { name: 'BMW', keywords: ['bmw'] },
        { name: 'Mercedes', keywords: ['mercedes', 'benz'] }
    ]

    if (!query) return []

    return brands
        .filter(brand =>
            brand.keywords.some(kw => query.includes(kw))
        )
        .map(brand => ({
            name: brand.name,
            category: getCategoryForBrand(brand.name)
        }))
}

function getCategoryForBrand(brand: string): string {
    const brandCategories: Record<string, string> = {
        'Apple': 'มือถือ & คอมพิวเตอร์',
        'Samsung': 'มือถือ & เครื่องใช้ไฟฟ้า',
        'Sony': 'เกม & อิเล็กทรอนิกส์',
        'Nintendo': 'เกม',
        'Canon': 'กล้อง',
        'Nikon': 'กล้อง',
        'Fujifilm': 'กล้อง',
        'Nike': 'แฟชั่น',
        'Adidas': 'แฟชั่น',
        'Toyota': 'ยานยนต์',
        'Honda': 'ยานยนต์',
        'BMW': 'ยานยนต์',
        'Mercedes': 'ยานยนต์'
    }

    return brandCategories[brand] || 'ทั่วไป'
}

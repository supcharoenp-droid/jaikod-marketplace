/**
 * DYNAMIC SITEMAP GENERATOR
 * 
 * Next.js 14+ App Router sitemap generation
 * Automatically generates sitemap.xml from:
 * - Static pages
 * - Dynamic product pages
 * - Category pages
 * 
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import { MetadataRoute } from 'next'
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { CATEGORIES } from '@/constants/categories'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaikod.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date()

    // ========================================
    // 1. STATIC PAGES
    // ========================================
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: BASE_URL,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 1.0,
        },
        {
            url: `${BASE_URL}/about`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/how-it-works`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.6,
        },
        {
            url: `${BASE_URL}/contact`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/faq`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/terms`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/privacy`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${BASE_URL}/safety`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${BASE_URL}/fees`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/search`,
            lastModified: now,
            changeFrequency: 'daily',
            priority: 0.8,
        },
    ]

    // ========================================
    // 2. CATEGORY PAGES
    // ========================================
    const categoryPages: MetadataRoute.Sitemap = CATEGORIES.map(cat => ({
        url: `${BASE_URL}/category/${cat.slug}`,
        lastModified: now,
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }))

    // ========================================
    // 3. PRODUCT PAGES (Dynamic from Firestore)
    // ========================================
    let productPages: MetadataRoute.Sitemap = []

    try {
        // Get active products (limit for performance)
        const productsQuery = query(
            collection(db, 'products'),
            where('status', '==', 'active'),
            orderBy('created_at', 'desc'),
            limit(5000)  // Limit to prevent timeout
        )

        const snapshot = await getDocs(productsQuery)

        productPages = snapshot.docs.map(doc => {
            const data = doc.data()
            const slug = data.slug || doc.id
            const lastMod = data.updated_at?.toDate?.() || data.created_at?.toDate?.() || now

            return {
                url: `${BASE_URL}/product/${slug}`,
                lastModified: lastMod,
                changeFrequency: 'weekly' as const,
                priority: 0.7,
            }
        })

        console.log(`[Sitemap] Generated ${productPages.length} product URLs`)
    } catch (error) {
        console.error('[Sitemap] Error fetching products:', error)
        // Continue with static pages if Firestore fails
    }

    // ========================================
    // 4. SHOP PAGES (Optional - Top Sellers)
    // ========================================
    // Could add shop pages here if needed

    // ========================================
    // COMBINE ALL
    // ========================================
    return [
        ...staticPages,
        ...categoryPages,
        ...productPages,
    ]
}

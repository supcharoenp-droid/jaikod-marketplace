/**
 * PRODUCT PAGE LAYOUT WITH DYNAMIC METADATA
 * 
 * This layout wraps product pages and handles:
 * - Dynamic SEO metadata generation (SSR)
 * - JSON-LD structured data injection
 * - Canonical URLs
 */

import { Metadata } from 'next'
import Script from 'next/script'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { CATEGORIES } from '@/constants/categories'
import {
    generateProductTitle,
    generateProductDescription,
    generateProductKeywords,
    generateProductOpenGraph,
    generateProductTwitterCard,
    generateProductJsonLd,
    generateBreadcrumbJsonLd,
    generateCanonicalUrl,
    type ProductSEOData,
} from '@/lib/seo-utils'

// ============================================
// PRODUCT DATA FETCHER
// ============================================

async function getProductData(slug: string): Promise<ProductSEOData | null> {
    try {
        // Try slug first
        const q = query(collection(db, 'products'), where('slug', '==', slug))
        const snap = await getDocs(q)

        let data = null
        let id = null

        if (!snap.empty) {
            data = snap.docs[0].data()
            id = snap.docs[0].id
        } else {
            // Try ID
            const docRef = doc(db, 'products', slug)
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                data = docSnap.data()
                id = docSnap.id
            }
        }

        if (!data || !id) return null

        return {
            id,
            title: data.title || 'สินค้า',
            description: data.description || '',
            price: data.price || 0,
            originalPrice: data.original_price,
            condition: data.condition || 'used',
            images: data.images || [],
            categoryId: typeof data.category_id === 'string'
                ? parseInt(data.category_id)
                : data.category_id || 0,
            subcategoryId: data.subcategory_id,
            location: data.location_province,
            sellerName: data.seller_name,
            sellerId: data.seller_id,
            brand: data.specs?.brand,
            model: data.specs?.model,
            slug: data.slug || id,
            createdAt: data.created_at?.toDate?.(),
            updatedAt: data.updated_at?.toDate?.(),
            inStock: data.status === 'active',
        }
    } catch (error) {
        console.error('[Product SEO] Error fetching product:', error)
        return null
    }
}

// ============================================
// GENERATE METADATA (SSR)
// ============================================

interface LayoutProps {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const product = await getProductData(decodedSlug)

    // Default metadata if product not found
    if (!product) {
        return {
            title: 'สินค้าไม่พบ | JaiKod',
            description: 'ไม่พบสินค้าที่คุณค้นหา กลับไปหน้าหลักเพื่อค้นหาสินค้าอื่น',
            robots: {
                index: false,
                follow: true,
            },
        }
    }

    const canonicalUrl = generateCanonicalUrl(`/product/${product.slug}`)

    return {
        title: generateProductTitle(product),
        description: generateProductDescription(product),
        keywords: generateProductKeywords(product),

        // Canonical URL
        alternates: {
            canonical: canonicalUrl,
        },

        // Open Graph
        openGraph: {
            ...generateProductOpenGraph(product),
            type: 'website',
        },

        // Twitter
        twitter: generateProductTwitterCard(product),

        // Robots
        robots: {
            index: product.inStock !== false,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },

        // Additional meta
        other: {
            'product:price:amount': product.price.toString(),
            'product:price:currency': 'THB',
            'product:condition': product.condition,
            'product:availability': product.inStock !== false ? 'in stock' : 'out of stock',
        },
    }
}

// ============================================
// LAYOUT COMPONENT WITH JSON-LD
// ============================================

export default async function ProductLayout({ children, params }: LayoutProps) {
    const { slug } = await params
    const decodedSlug = decodeURIComponent(slug)
    const product = await getProductData(decodedSlug)

    // Generate JSON-LD only if product exists
    let jsonLdScripts: React.ReactNode = null

    if (product) {
        const category = CATEGORIES.find(c => c.id === product.categoryId)

        // Product Schema
        const productSchema = generateProductJsonLd(product)

        // Breadcrumb Schema
        const breadcrumbSchema = generateBreadcrumbJsonLd([
            { name: 'หน้าแรก', url: '/' },
            { name: category?.name_th || 'สินค้า', url: `/category/${category?.slug || 'all'}` },
            { name: product.title.slice(0, 50), url: `/product/${product.slug}` },
        ])

        jsonLdScripts = (
            <>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(productSchema),
                    }}
                />
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(breadcrumbSchema),
                    }}
                />
            </>
        )
    }

    return (
        <>
            {/* JSON-LD Structured Data (SSR) */}
            {jsonLdScripts}

            {/* Page Content */}
            {children}
        </>
    )
}

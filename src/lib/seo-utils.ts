/**
 * SEO UTILITIES
 * 
 * Helper functions for generating SEO metadata and structured data
 */

import { CATEGORIES } from '@/constants/categories'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaikod.com'

// ============================================
// TYPES
// ============================================

export interface ProductSEOData {
    id: string
    title: string
    description: string
    price: number
    originalPrice?: number
    currency?: string
    condition: string
    images: Array<{ url: string } | string>
    categoryId: number
    subcategoryId?: number
    location?: string
    sellerName?: string
    sellerId?: string
    brand?: string
    model?: string
    slug?: string
    createdAt?: Date
    updatedAt?: Date
    inStock?: boolean
}

export interface BreadcrumbItem {
    name: string
    url: string
}

// ============================================
// META TAG GENERATORS
// ============================================

/**
 * Generate meta title for product page
 */
export function generateProductTitle(product: ProductSEOData): string {
    const category = CATEGORIES.find(c => c.id === product.categoryId)
    const categoryName = category?.name_th || ''

    // Format: "Product Title | Category | JaiKod"
    // Max 60 characters for Google
    let title = product.title

    if (title.length < 40 && categoryName) {
        title = `${title} | ${categoryName}`
    }

    if (title.length < 50) {
        title = `${title} | JaiKod`
    }

    return title.slice(0, 60)
}

/**
 * Generate meta description for product page
 */
export function generateProductDescription(product: ProductSEOData): string {
    const price = product.price.toLocaleString()
    const condition = product.condition === 'new' ? 'สินค้าใหม่' : 'สินค้ามือสอง'
    const location = product.location || ''

    // Format: "ราคา ฿X - Condition - Location - Description..."
    // Max 155 characters for Google
    let desc = `฿${price} - ${condition}`

    if (location) {
        desc += ` - ${location}`
    }

    // Add product description
    const remainingChars = 155 - desc.length - 5
    if (remainingChars > 20 && product.description) {
        const shortDesc = product.description.slice(0, remainingChars).trim()
        desc += ` - ${shortDesc}...`
    }

    return desc.slice(0, 155)
}

/**
 * Generate keywords for product page
 */
export function generateProductKeywords(product: ProductSEOData): string {
    const category = CATEGORIES.find(c => c.id === product.categoryId)
    const keywords: string[] = []

    // Add title words
    const titleWords = product.title.split(/[\s,.-]+/).filter(w => w.length > 2)
    keywords.push(...titleWords.slice(0, 5))

    // Add category
    if (category) {
        keywords.push(category.name_th, category.name_en)
    }

    // Add brand/model
    if (product.brand) keywords.push(product.brand)
    if (product.model) keywords.push(product.model)

    // Add condition
    keywords.push(product.condition === 'new' ? 'สินค้าใหม่' : 'มือสอง')

    // Add JaiKod
    keywords.push('JaiKod', 'ใจโค้ด', 'ซื้อขาย')

    return [...new Set(keywords)].slice(0, 10).join(', ')
}

// ============================================
// OPEN GRAPH GENERATORS
// ============================================

/**
 * Generate Open Graph data for product page
 */
export function generateProductOpenGraph(product: ProductSEOData) {
    const imageUrl = getFirstImageUrl(product.images)

    return {
        type: 'product',
        title: generateProductTitle(product),
        description: generateProductDescription(product),
        url: `${BASE_URL}/product/${product.slug || product.id}`,
        siteName: 'JaiKod',
        locale: 'th_TH',
        images: imageUrl ? [{
            url: imageUrl,
            width: 1200,
            height: 630,
            alt: product.title,
        }] : [],
    }
}

/**
 * Generate Twitter Card data
 */
export function generateProductTwitterCard(product: ProductSEOData) {
    const imageUrl = getFirstImageUrl(product.images)

    return {
        card: 'summary_large_image' as const,
        title: generateProductTitle(product),
        description: generateProductDescription(product),
        images: imageUrl ? [imageUrl] : [],
    }
}

// ============================================
// JSON-LD STRUCTURED DATA
// ============================================

/**
 * Generate JSON-LD Product schema
 * @see https://schema.org/Product
 */
export function generateProductJsonLd(product: ProductSEOData): object {
    const category = CATEGORIES.find(c => c.id === product.categoryId)
    const imageUrl = getFirstImageUrl(product.images)

    const jsonLd: any = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        'name': product.title,
        'description': product.description,
        'image': imageUrl || undefined,
        'brand': product.brand ? {
            '@type': 'Brand',
            'name': product.brand
        } : undefined,
        'model': product.model,
        'category': category?.name_en || category?.name_th,
        'url': `${BASE_URL}/product/${product.slug || product.id}`,
        'offers': {
            '@type': 'Offer',
            'url': `${BASE_URL}/product/${product.slug || product.id}`,
            'priceCurrency': product.currency || 'THB',
            'price': product.price,
            'priceValidUntil': new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            'availability': product.inStock !== false
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            'itemCondition': product.condition === 'new'
                ? 'https://schema.org/NewCondition'
                : 'https://schema.org/UsedCondition',
            'seller': product.sellerName ? {
                '@type': 'Person',
                'name': product.sellerName,
                'url': `${BASE_URL}/shop/${product.sellerId}`
            } : undefined,
        },
    }

    // Add original price as strikethrough if available
    if (product.originalPrice && product.originalPrice > product.price) {
        jsonLd.offers.priceSpecification = {
            '@type': 'PriceSpecification',
            'price': product.originalPrice,
            'priceCurrency': product.currency || 'THB',
        }
    }

    return jsonLd
}

/**
 * Generate JSON-LD BreadcrumbList schema
 */
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': items.map((item, index) => ({
            '@type': 'ListItem',
            'position': index + 1,
            'name': item.name,
            'item': item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
        })),
    }
}

/**
 * Generate JSON-LD Organization schema (for homepage)
 */
export function generateOrganizationJsonLd(): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        'name': 'JaiKod',
        'alternateName': 'ใจโค้ด',
        'url': BASE_URL,
        'logo': `${BASE_URL}/logo.png`,
        'description': 'แพลตฟอร์มซื้อขายสินค้ามือสองและสินค้าใหม่ที่ขับเคลื่อนด้วย AI',
        'sameAs': [
            // Add social media URLs when available
            // 'https://facebook.com/jaikod',
            // 'https://twitter.com/jaikod',
        ],
        'contactPoint': {
            '@type': 'ContactPoint',
            'contactType': 'Customer Service',
            'email': 'support@jaikod.com',
            'availableLanguage': ['Thai', 'English'],
        },
    }
}

/**
 * Generate JSON-LD WebSite schema with SearchAction
 */
export function generateWebsiteJsonLd(): object {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        'name': 'JaiKod',
        'alternateName': 'ใจโค้ด',
        'url': BASE_URL,
        'potentialAction': {
            '@type': 'SearchAction',
            'target': {
                '@type': 'EntryPoint',
                'urlTemplate': `${BASE_URL}/search?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get first image URL from images array
 */
function getFirstImageUrl(images: Array<{ url: string } | string>): string | null {
    if (!images || images.length === 0) return null

    const first = images[0]
    if (typeof first === 'string') return first
    if (first && typeof first === 'object' && 'url' in first) return first.url

    return null
}

/**
 * Generate canonical URL
 */
export function generateCanonicalUrl(path: string): string {
    // Remove trailing slashes and query params for canonical
    const cleanPath = path.split('?')[0].replace(/\/+$/, '')
    return `${BASE_URL}${cleanPath}`
}

/**
 * Escape text for JSON-LD
 */
export function escapeJsonLdText(text: string): string {
    if (!text) return ''
    return text
        .replace(/\\/g, '\\\\')
        .replace(/"/g, '\\"')
        .replace(/\n/g, ' ')
        .replace(/\r/g, '')
        .replace(/\t/g, ' ')
        .trim()
}

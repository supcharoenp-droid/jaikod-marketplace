/**
 * CATEGORY PAGE LAYOUT WITH DYNAMIC METADATA
 * 
 * Generates SEO metadata for category pages:
 * - Dynamic title/description based on category
 * - JSON-LD BreadcrumbList
 * - Open Graph with category info
 */

import { Metadata } from 'next'
import { CATEGORIES } from '@/constants/categories'
import { generateCanonicalUrl, generateBreadcrumbJsonLd } from '@/lib/seo-utils'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaikod.com'

interface LayoutProps {
    children: React.ReactNode
    params: Promise<{ slug: string }>
}

/**
 * Generate dynamic metadata for category pages
 */
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { slug } = await params
    const category = CATEGORIES.find(c => c.slug === slug)

    if (!category) {
        return {
            title: 'หมวดหมู่ไม่พบ',
            description: 'ไม่พบหมวดหมู่ที่คุณค้นหา',
            robots: { index: false, follow: true },
        }
    }

    const title = `${category.name_th} | ซื้อขาย${category.name_th}มือสอง`
    const description = `ซื้อขาย${category.name_th}มือสองและใหม่ ราคาดี คุณภาพเยี่ยม บน JaiKod แพลตฟอร์ม AI ค้นหาง่าย ปลอดภัย มั่นใจ`
    const canonicalUrl = generateCanonicalUrl(`/category/${slug}`)

    return {
        title,
        description,
        keywords: [
            category.name_th,
            category.name_en,
            `${category.name_th}มือสอง`,
            `ซื้อ${category.name_th}`,
            `ขาย${category.name_th}`,
            'JaiKod',
            'ใจโค้ด',
        ],

        alternates: {
            canonical: canonicalUrl,
        },

        openGraph: {
            title: `${category.name_th} - ซื้อขายออนไลน์ | JaiKod`,
            description,
            type: 'website',
            locale: 'th_TH',
            siteName: 'JaiKod',
            url: canonicalUrl,
            images: [
                {
                    url: category.image || '/og-image.png',
                    width: 1200,
                    height: 630,
                    alt: category.name_th,
                },
            ],
        },

        twitter: {
            card: 'summary_large_image',
            title: `${category.name_th} | JaiKod`,
            description,
            images: [category.image || '/og-image.png'],
        },

        robots: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    }
}

/**
 * Category Layout with JSON-LD Breadcrumb
 */
export default async function CategoryLayout({ children, params }: LayoutProps) {
    const { slug } = await params
    const category = CATEGORIES.find(c => c.slug === slug)

    // Generate Breadcrumb JSON-LD
    const breadcrumbSchema = generateBreadcrumbJsonLd([
        { name: 'หน้าแรก', url: '/' },
        { name: category?.name_th || 'หมวดหมู่', url: `/category/${slug}` },
    ])

    // ItemList Schema for category
    const itemListSchema = category ? {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        'name': category.name_th,
        'description': `รวม${category.name_th}สำหรับซื้อขายบน JaiKod`,
        'url': `${BASE_URL}/category/${slug}`,
        'isPartOf': {
            '@type': 'WebSite',
            'name': 'JaiKod',
            'url': BASE_URL,
        },
    } : null

    return (
        <>
            {/* Breadcrumb JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />

            {/* CollectionPage JSON-LD */}
            {itemListSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(itemListSchema),
                    }}
                />
            )}

            {children}
        </>
    )
}

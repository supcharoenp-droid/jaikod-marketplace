/**
 * ABOUT PAGE METADATA
 * 
 * Static SEO configuration for the About page
 */

import { Metadata } from 'next'
import { generateCanonicalUrl, generateBreadcrumbJsonLd } from '@/lib/seo-utils'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaikod.com'

export const metadata: Metadata = {
    title: 'เกี่ยวกับเรา | JaiKod - ขายง่าย ซื้อใจ ด้วยพลัง AI',
    description: 'JaiKod คือแพลตฟอร์มซื้อขายสินค้ามือสองและสินค้าใหม่ที่ขับเคลื่อนด้วย AI ก่อตั้งขึ้นเพื่อให้การซื้อขายออนไลน์ง่าย เร็ว และปลอดภัย',
    keywords: [
        'JaiKod',
        'ใจโค้ด',
        'เกี่ยวกับเรา',
        'about us',
        'AI marketplace',
        'ตลาดออนไลน์',
    ],

    alternates: {
        canonical: generateCanonicalUrl('/about'),
    },

    openGraph: {
        title: 'เกี่ยวกับ JaiKod | AI-Powered Marketplace',
        description: 'เรียนรู้เกี่ยวกับ JaiKod แพลตฟอร์ม AI สำหรับการซื้อขายสินค้าออนไลน์',
        type: 'website',
        locale: 'th_TH',
        siteName: 'JaiKod',
        url: `${BASE_URL}/about`,
    },

    twitter: {
        card: 'summary',
        title: 'เกี่ยวกับ JaiKod',
        description: 'แพลตฟอร์ม AI สำหรับการซื้อขายสินค้าออนไลน์',
    },

    robots: {
        index: true,
        follow: true,
    },
}

export default function AboutLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Breadcrumb Schema
    const breadcrumbSchema = generateBreadcrumbJsonLd([
        { name: 'หน้าแรก', url: '/' },
        { name: 'เกี่ยวกับเรา', url: '/about' },
    ])

    // AboutPage Schema
    const aboutSchema = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        'name': 'เกี่ยวกับ JaiKod',
        'description': 'แพลตฟอร์มซื้อขายสินค้าที่ขับเคลื่อนด้วย AI',
        'url': `${BASE_URL}/about`,
        'mainEntity': {
            '@type': 'Organization',
            'name': 'JaiKod',
            'alternateName': 'ใจโค้ด',
            'url': BASE_URL,
        },
    }

    return (
        <>
            {/* Breadcrumb JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(breadcrumbSchema),
                }}
            />

            {/* AboutPage JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(aboutSchema),
                }}
            />

            {children}
        </>
    )
}

/**
 * SEARCH PAGE LAYOUT
 * 
 * Simple layout wrapper for search pages
 * Note: Dynamic metadata based on search query is handled in page.tsx
 * because layouts don't have access to searchParams
 */

import { Metadata } from 'next'
import { generateCanonicalUrl } from '@/lib/seo-utils'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaikod.com'

// Static metadata for the search page (base)
export const metadata: Metadata = {
    title: 'ค้นหาสินค้า | JaiKod',
    description: 'ค้นหาสินค้ามือสองและสินค้าใหม่บน JaiKod แพลตฟอร์ม AI ค้นหาง่าย ซื้อขายปลอดภัย',
    keywords: [
        'ค้นหาสินค้า',
        'search',
        'JaiKod',
        'ซื้อขายมือสอง',
        'ตลาดออนไลน์',
    ],

    alternates: {
        canonical: generateCanonicalUrl('/search'),
    },

    openGraph: {
        title: 'ค้นหาสินค้า | JaiKod',
        description: 'ค้นหาสินค้ามือสองและสินค้าใหม่บน JaiKod',
        type: 'website',
        locale: 'th_TH',
        siteName: 'JaiKod',
        url: `${BASE_URL}/search`,
    },

    twitter: {
        card: 'summary',
        title: 'ค้นหาสินค้า | JaiKod',
        description: 'ค้นหาสินค้ามือสองและสินค้าใหม่บน JaiKod',
    },

    // Don't index search pages to avoid duplicate content
    robots: {
        index: false,
        follow: true,
    },
}

/**
 * Search Layout - Simple wrapper
 */
export default function SearchLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}

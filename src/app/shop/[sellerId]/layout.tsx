/**
 * SHOP/SELLER PAGE LAYOUT WITH DYNAMIC METADATA
 * 
 * Generates SEO metadata for seller shop pages
 */

import { Metadata } from 'next'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { generateCanonicalUrl, generateBreadcrumbJsonLd } from '@/lib/seo-utils'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaikod.com'

interface LayoutProps {
    children: React.ReactNode
    params: Promise<{ sellerId: string }>
}

/**
 * Fetch seller data for metadata
 */
async function getSellerData(sellerId: string) {
    try {
        const docRef = doc(db, 'users', sellerId)
        const docSnap = await getDoc(docRef)

        if (!docSnap.exists()) return null

        const data = docSnap.data()
        return {
            id: sellerId,
            name: data.displayName || data.shopName || 'ร้านค้า',
            description: data.shopDescription || data.bio || '',
            avatar: data.photoURL || data.shopLogo,
            isVerified: data.isVerified || false,
            rating: data.rating || 0,
            productCount: data.productCount || 0,
            joinedDate: data.createdAt?.toDate?.(),
        }
    } catch (error) {
        console.error('[Shop SEO] Error fetching seller:', error)
        return null
    }
}

/**
 * Generate dynamic metadata for shop pages
 */
export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { sellerId } = await params
    const seller = await getSellerData(sellerId)

    if (!seller) {
        return {
            title: 'ร้านค้าไม่พบ',
            description: 'ไม่พบร้านค้าที่คุณค้นหา',
            robots: { index: false, follow: true },
        }
    }

    const title = `${seller.name}${seller.isVerified ? ' ✓' : ''} | ร้านค้าบน JaiKod`
    const description = seller.description
        ? seller.description.slice(0, 150)
        : `ร้าน${seller.name} - สินค้า ${seller.productCount} รายการ บน JaiKod`
    const canonicalUrl = generateCanonicalUrl(`/shop/${sellerId}`)

    return {
        title,
        description,
        keywords: [
            seller.name,
            'ร้านค้าออนไลน์',
            'JaiKod',
            'ซื้อขายออนไลน์',
        ],

        alternates: {
            canonical: canonicalUrl,
        },

        openGraph: {
            title: `${seller.name} | JaiKod`,
            description,
            type: 'profile',
            locale: 'th_TH',
            siteName: 'JaiKod',
            url: canonicalUrl,
            images: seller.avatar ? [
                {
                    url: seller.avatar,
                    width: 400,
                    height: 400,
                    alt: seller.name,
                },
            ] : undefined,
        },

        twitter: {
            card: 'summary',
            title: `${seller.name} | JaiKod`,
            description,
            images: seller.avatar ? [seller.avatar] : undefined,
        },

        robots: {
            index: true,
            follow: true,
        },
    }
}

/**
 * Shop Layout with JSON-LD
 */
export default async function ShopLayout({ children, params }: LayoutProps) {
    const { sellerId } = await params
    const seller = await getSellerData(sellerId)

    // Breadcrumb Schema
    const breadcrumbSchema = generateBreadcrumbJsonLd([
        { name: 'หน้าแรก', url: '/' },
        { name: 'ร้านค้า', url: '/shops' },
        { name: seller?.name || 'ร้านค้า', url: `/shop/${sellerId}` },
    ])

    // LocalBusiness/Store Schema for seller
    const storeSchema = seller ? {
        '@context': 'https://schema.org',
        '@type': 'Store',
        'name': seller.name,
        'description': seller.description,
        'url': `${BASE_URL}/shop/${sellerId}`,
        'image': seller.avatar,
        ...(seller.rating > 0 && {
            'aggregateRating': {
                '@type': 'AggregateRating',
                'ratingValue': seller.rating,
                'bestRating': 5,
            },
        }),
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

            {/* Store JSON-LD */}
            {storeSchema && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(storeSchema),
                    }}
                />
            )}

            {children}
        </>
    )
}

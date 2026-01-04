import { redirect } from 'next/navigation'

/**
 * LEGACY PRODUCT PAGE - REDIRECT TO NEW LISTING SYSTEM
 * 
 * This page is deprecated. All product URLs now redirect to the new
 * Universal Listing System at /listing/[slug]
 * 
 * Migration Date: 2026-01-01
 */

interface ProductPageProps {
    params: {
        slug: string
    }
}

export default function LegacyProductPage({ params }: ProductPageProps) {
    // Redirect to new listing system
    redirect(`/listing/${params.slug}`)
}

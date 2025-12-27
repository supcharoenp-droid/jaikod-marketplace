'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getListingByCode } from '@/lib/listings'

/**
 * Quick redirect page: /p/JK-AXXXXX → /listing/{slug}
 * 
 * This page allows users to access listings via short codes
 * Perfect for sharing via LINE, SMS, or verbal communication
 * 
 * Example:
 * - User shares: "ดูประกาศ JK-A00001"
 * - Opens: jaikod.com/p/JK-A00001
 * - Redirects to: jaikod.com/listing/honda-jazz-2022-a00001
 */
export default function QuickListingPage() {
    const params = useParams()
    const router = useRouter()
    const code = params.code as string

    useEffect(() => {
        async function redirectToListing() {
            try {
                const listing = await getListingByCode(code)

                if (listing) {
                    // Redirect to full listing page
                    router.replace(`/listing/${listing.slug}`)
                } else {
                    // Listing not found - show 404 or redirect to search
                    router.replace(`/search?code=${code}&notfound=1`)
                }
            } catch (error) {
                console.error('Error fetching listing:', error)
                router.replace('/')
            }
        }

        if (code) {
            redirectToListing()
        }
    }, [code, router])

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
            <div className="text-center">
                {/* Loading Animation */}
                <div className="mb-6">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse">
                        <span className="text-3xl">🔍</span>
                    </div>
                </div>

                {/* Loading Text */}
                <h1 className="text-xl font-semibold text-white mb-2">
                    กำลังค้นหาประกาศ...
                </h1>
                <p className="text-gray-400">
                    รหัส: <span className="text-purple-400 font-mono">{code?.toUpperCase()}</span>
                </p>

                {/* Shimmer Effect */}
                <div className="mt-8 flex justify-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
            </div>
        </div>
    )
}

'use client'

/**
 * 🔄 Demo Car Listing Redirect
 * 
 * This page redirects to the new universal listing system
 * Old: /demo/car-listing
 * New: /sell/automotive/cars
 */

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { Suspense } from 'react'

function RedirectContent() {
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        // Preserve query params (like ?from=ai)
        const queryString = searchParams.toString()
        const redirectUrl = queryString
            ? `/sell/automotive/cars?${queryString}`
            : '/sell/automotive/cars'

        router.replace(redirectUrl)
    }, [router, searchParams])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
                กำลังนำทางไปหน้าลงประกาศรถยนต์...
            </p>
            <p className="text-sm text-gray-400 mt-2">
                Redirecting to /sell/automotive/cars
            </p>
        </div>
    )
}

export default function DemoCarListingRedirect() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
            </div>
        }>
            <RedirectContent />
        </Suspense>
    )
}

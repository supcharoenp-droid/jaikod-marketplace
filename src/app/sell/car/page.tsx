'use client'

/**
 * /sell/car - Car Listing Form
 * 
 * Redirects to the new universal listing system
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SellCarPage() {
    const router = useRouter()

    useEffect(() => {
        // Redirect to new universal listing form
        router.replace('/sell/automotive/cars')
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">กำลังโหลดฟอร์มลงขายรถยนต์...</p>
            </div>
        </div>
    )
}

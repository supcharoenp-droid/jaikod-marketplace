'use client'

/**
 * /sell/cars - Redirect to new route
 */

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function SellCarsRedirect() {
    const router = useRouter()

    useEffect(() => {
        router.replace('/sell/automotive/cars')
    }, [router])

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
            <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400">กำลังโหลด...</p>
        </div>
    )
}

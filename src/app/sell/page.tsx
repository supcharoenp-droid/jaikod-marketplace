'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

export default function SellPage() {
    const router = useRouter()

    useEffect(() => {
        router.replace('/seller/products/create')
    }, [router])

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-bg-dark">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="w-8 h-8 text-neon-purple animate-spin" />
                <p className="text-gray-500">กำลังนำคุณไปเลือกระบบลงขาย...</p>
            </div>
        </div>
    )
}

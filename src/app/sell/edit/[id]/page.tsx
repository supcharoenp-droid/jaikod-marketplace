'use client'

/**
 * 🎯 Edit Listing Router
 * 
 * Routes to the appropriate edit page based on category type:
 * - Cars → /sell/edit/automotive/[id]
 * - General → Generic form
 */

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, Suspense } from 'react'
import { getListingById } from '@/lib/listings'
import { Loader2 } from 'lucide-react'

// Category type to route mapping
const CATEGORY_ROUTES: Record<string, string> = {
    'car': 'automotive',
    'motorcycle': 'automotive',
    'real_estate': 'property',
    'land': 'property',
    'mobile': 'mobile',
}

function EditListingRouter() {
    const params = useParams()
    const router = useRouter()
    const listingId = params.id as string

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (listingId) {
            routeToEdit()
        }
    }, [listingId])

    const routeToEdit = async () => {
        try {
            const listing = await getListingById(listingId)

            if (!listing) {
                setError('ไม่พบประกาศ')
                setLoading(false)
                return
            }

            // Determine route based on category type
            const categoryType = listing.category_type
            const specificRoute = CATEGORY_ROUTES[categoryType]

            if (specificRoute === 'automotive') {
                // Redirect to car/motorcycle edit page
                router.replace(`/sell/edit/automotive/${listingId}`)
            } else if (specificRoute === 'property') {
                // Future: redirect to property edit page
                router.replace(`/sell/edit/property/${listingId}`)
            } else if (specificRoute === 'mobile') {
                // Redirect to mobile phone edit page
                router.replace(`/sell/edit/mobile/${listingId}`)
            } else {
                // For now, show generic form inline (no redirect)
                setLoading(false)
            }
        } catch (err) {
            console.error('Error routing:', err)
            setError('เกิดข้อผิดพลาด')
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-400">กำลังโหลด...</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center px-4">
                    <h1 className="text-xl font-bold text-white mb-4">{error}</h1>
                    <button
                        onClick={() => router.push('/profile/listings')}
                        className="text-purple-400 hover:underline"
                    >
                        ← กลับไปหน้ารายการ
                    </button>
                </div>
            </div>
        )
    }

    // Fallback: Generic edit form for unsupported categories
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
            <div className="text-center px-4">
                <h1 className="text-xl font-bold text-white mb-4">
                    ⚠️ ยังไม่รองรับการแก้ไขประเภทนี้
                </h1>
                <p className="text-gray-400 mb-6">
                    กรุณาลบและสร้างประกาศใหม่
                </p>
                <button
                    onClick={() => router.push('/profile/listings')}
                    className="px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700"
                >
                    กลับไปหน้ารายการ
                </button>
            </div>
        </div>
    )
}

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        }>
            <EditListingRouter />
        </Suspense>
    )
}

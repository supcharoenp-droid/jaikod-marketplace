'use client'

/**
 * JaiKod Brand Guidelines & Logo Demo Page
 * 
 * ใช้ dynamic import กับ ssr: false เพื่อป้องกัน Hydration Error
 * 
 * หลักการ: แยก animated content ไป client-only
 * Reference: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading
 */

import dynamic from 'next/dynamic'

// Dynamic import with ssr: false - 100% client-side rendering
const BrandPageContent = dynamic(
    () => import('@/components/brand/BrandPageContent'),
    {
        ssr: false,
        loading: () => (
            <div className="min-h-screen bg-gray-50 dark:bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading Brand Guidelines...</p>
                </div>
            </div>
        )
    }
)

export default function BrandPage() {
    return <BrandPageContent />
}

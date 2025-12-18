'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface BreadcrumbState {
    currentPage: string
    previousPage: string
    trail: string[]
}

export function useBreadcrumb() {
    const pathname = usePathname()
    const router = useRouter()
    const [breadcrumbState, setBreadcrumbState] = useState<BreadcrumbState>({
        currentPage: '',
        previousPage: '',
        trail: []
    })

    useEffect(() => {
        if (!pathname) return

        setBreadcrumbState(prev => ({
            currentPage: pathname,
            previousPage: prev.currentPage,
            trail: [...prev.trail, pathname].slice(-5) // Keep last 5 pages
        }))
    }, [pathname])

    const goBack = () => {
        const { previousPage, trail } = breadcrumbState

        // If we have a previous page in our trail
        if (previousPage && trail.length > 1) {
            router.back()
        }
        // If user came from seller center
        else if (document.referrer.includes('/seller')) {
            router.push('/seller/dashboard')
        }
        // Default: go to home
        else {
            router.push('/')
        }
    }

    return {
        breadcrumbState,
        goBack
    }
}

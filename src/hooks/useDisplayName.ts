'use client'

import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

interface SellerProfile {
    shop_name?: string
    business_name?: string
    avatar_url?: string
    seller_id?: string
}

interface UseDisplayNameReturn {
    displayName: string
    shortName: string
    initials: string
    hasCustomName: boolean
    isLoading: boolean
    profile: SellerProfile | null
}

/**
 * Hook สำหรับจัดการชื่อแสดงผล ของ Seller ในระบบ
 * รองรับ Fallback หลายชั้น ตาม Best Practices ของเว็บใหญ่
 */
export function useDisplayName(): UseDisplayNameReturn {
    const { user } = useAuth()
    const { t, language } = useLanguage()
    const [profile, setProfile] = useState<SellerProfile | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Load seller profile
    useEffect(() => {
        async function loadProfile() {
            if (!user) {
                setIsLoading(false)
                return
            }

            try {
                setIsLoading(true)
                const { getSellerProfile } = await import('@/lib/seller')
                const sellerProfile = await getSellerProfile(user.uid)
                setProfile(sellerProfile as SellerProfile)
            } catch (error) {
                console.error('Error loading seller profile:', error)
                setProfile(null)
            } finally {
                setIsLoading(false)
            }
        }

        loadProfile()
    }, [user])

    // Calculate display name with waterfall fallback
    const displayName = useMemo(() => {
        // 1. ชื่อร้านจาก Profile (ดีสุด)
        if (profile?.shop_name) return profile.shop_name

        // 2. ชื่อธุรกิจจาก Profile
        if (profile?.business_name) return profile.business_name

        // 3. ชื่อจาก Firebase Auth
        if (user?.displayName) return user.displayName

        // 4. ชื่อจาก Email (ตัดส่วนหลัง @)
        if (user?.email) {
            const emailName = user.email.split('@')[0]
            // แปลงเป็นชื่อที่อ่านง่าย เช่น john.doe → John Doe
            return emailName
                .split(/[._-]/)
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        }

        // 5. Fallback สุดท้าย (รองรับภาษาไทย/อังกฤษ)
        return language === 'th' ? 'ผู้ใช้ JaiKod' : 'JaiKod User'
    }, [profile, user, language])

    // สร้างชื่อแบบสั้น (สำหรับพื้นที่จำกัด)
    const shortName = useMemo(() => {
        if (displayName.length <= 20) return displayName
        return displayName.substring(0, 20) + '...'
    }, [displayName])

    // สร้างตัวอักษรย่อ (สำหรับ Avatar)
    const initials = useMemo(() => {
        if (!displayName || displayName.includes('JaiKod')) {
            return '?'
        }

        // แยกคำและเอาตัวแรกของแต่ละคำ
        const words = displayName.split(' ')
        if (words.length >= 2) {
            // เช่น "John Doe" → "JD"
            return (words[0][0] + words[1][0]).toUpperCase()
        }

        // เช่น "John" → "JO"
        return displayName.substring(0, 2).toUpperCase()
    }, [displayName])

    // ตรวจสอบว่ามีชื่อที่กำหนดเองหรือไม่
    const hasCustomName = useMemo(() => {
        return !!(profile?.shop_name || profile?.business_name || user?.displayName)
    }, [profile, user])

    return {
        displayName,
        shortName,
        initials,
        hasCustomName,
        isLoading,
        profile
    }
}

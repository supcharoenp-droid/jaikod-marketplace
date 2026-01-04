'use client'

import React from 'react'
import ProfileLayoutV3 from '@/components/profile/v3/ProfileLayoutV3'
import ProfileOverviewV3 from '@/components/profile/v3/ProfileOverviewV3'
import { useAuth } from '@/contexts/AuthContext'

export default function ProfileOverviewPage() {
    const { user, storeStatus } = useAuth()
    const sellerType = storeStatus.sellerType

    // Determine member type based on auth context
    const getMemberType = (): 'general' | 'store_general' | 'store_official' => {
        if (sellerType === 'official_store') return 'store_official'
        if (sellerType === 'general_store') return 'store_general'
        return 'general'
    }

    const memberType = getMemberType()

    return (
        <ProfileLayoutV3
            title="ภาพรวม"
            memberType={memberType}
        >
            <ProfileOverviewV3 memberType={memberType} />
        </ProfileLayoutV3>
    )
}

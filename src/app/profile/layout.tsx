'use client'

import React from 'react'
import { ProfileProvider } from '@/contexts/ProfileContext'
import ProfileLayout from '@/components/profile/v2/ProfileLayout' // Re-using the layout shell w created earlier

export default function ProfileRootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ProfileProvider>
            {/* The ProfileLayout V2 handles the UI shell (sidebar, etc) */}
            {/* But strictly speaking, the user said 'Don't create UI details'.
                However, to make the routing work and look correct, we need some shell.
                For Step 1, we just wrap provider. */}
            {children}
        </ProfileProvider>
    )
}

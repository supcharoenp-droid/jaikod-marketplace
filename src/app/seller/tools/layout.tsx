'use client'

import React from 'react'

/**
 * Tools Layout - Full-width layout without sidebar
 * Used for tool pages that have their own Header and full-page design
 */
export default function ToolsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Tools pages render their own layout (Header, etc.)
    // So we just pass through children without any wrapper
    return <>{children}</>
}

import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AdminProvider } from '@/contexts/AdminContext'
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import CookieConsent from '@/components/common/CookieConsent'

export const metadata: Metadata = {
    title: 'JaiKod - ขายง่าย ซื้อใจ ด้วยพลัง AI',
    description: 'แพลตฟอร์มซื้อขายสินค้ามือสองและสินค้าใหม่ที่ขับเคลื่อนด้วย AI ลงขายง่าย ค้นหาเร็ว ปลอดภัย มั่นใจ',
    keywords: 'ซื้อขายของมือสอง, marketplace, AI, JaiKod, ใจโค้ด, ขายของออนไลน์, ซื้อของมือสอง',
    authors: [{ name: 'JaiKod Team' }],
    openGraph: {
        title: 'JaiKod - ขายง่าย ซื้อใจ ด้วยพลัง AI',
        description: 'แพลตฟอร์มซื้อขายสินค้ามือสองและสินค้าใหม่ที่ขับเคลื่อนด้วย AI',
        type: 'website',
        locale: 'th_TH',
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 1, // Lock zoom
        userScalable: false, // Disable pinch zoom
    },
    themeColor: '#8B5CF6',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="th" suppressHydrationWarning>
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className="font-primary antialiased" suppressHydrationWarning>
                <LanguageProvider>
                    <AuthProvider>
                        <AdminProvider>
                            <SiteSettingsProvider>
                                <WishlistProvider>
                                    {children}
                                    <CookieConsent />
                                </WishlistProvider>
                            </SiteSettingsProvider>
                        </AdminProvider>
                    </AuthProvider>
                </LanguageProvider>
            </body>
        </html>
    )
}


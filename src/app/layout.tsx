import type { Metadata, Viewport } from 'next'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AdminProvider } from '@/contexts/AdminContext'
import { SiteSettingsProvider } from '@/contexts/SiteSettingsContext'
import { WishlistProvider } from '@/contexts/WishlistContext'
import { NotificationProvider } from '@/contexts/NotificationContext'
import { ChatProvider } from '@/contexts/ChatContext'
import CookieConsent from '@/components/common/CookieConsent'
import FloatingChatWidget from '@/components/chat/FloatingChatWidget'
import { PWAProvider } from '@/components/pwa'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaikod.com'

// Separate viewport export (Next.js 14+)
export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    themeColor: '#8B5CF6',
}

// Enhanced SEO Metadata
export const metadata: Metadata = {
    metadataBase: new URL(BASE_URL),
    title: {
        default: 'JaiKod - ขายง่าย ซื้อใจ ด้วยพลัง AI | ตลาดซื้อขายออนไลน์',
        template: '%s | JaiKod',
    },
    description: 'แพลตฟอร์มซื้อขายสินค้ามือสองและสินค้าใหม่ที่ขับเคลื่อนด้วย AI ลงขายง่ายใน 30 วินาที ค้นหาเร็ว ปลอดภัย มั่นใจ พร้อม AI ช่วยตั้งราคา',
    keywords: [
        'ซื้อขายของมือสอง',
        'marketplace',
        'AI marketplace',
        'JaiKod',
        'ใจโค้ด',
        'ขายของออนไลน์',
        'ซื้อของมือสอง',
        'ขายของมือสอง',
        'ตลาดนัดออนไลน์',
        'สินค้ามือสอง',
        'secondhand thailand',
    ],
    authors: [{ name: 'JaiKod Team', url: BASE_URL }],
    creator: 'JaiKod',
    publisher: 'JaiKod',

    // Open Graph
    openGraph: {
        title: 'JaiKod - ขายง่าย ซื้อใจ ด้วยพลัง AI',
        description: 'แพลตฟอร์มซื้อขายสินค้ามือสองและสินค้าใหม่ที่ขับเคลื่อนด้วย AI ลงขายง่ายใน 30 วินาที',
        type: 'website',
        locale: 'th_TH',
        alternateLocale: 'en_US',
        siteName: 'JaiKod',
        url: BASE_URL,
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'JaiKod - AI-Powered Marketplace',
            },
        ],
    },

    // Twitter Card
    twitter: {
        card: 'summary_large_image',
        title: 'JaiKod - ขายง่าย ซื้อใจ ด้วยพลัง AI',
        description: 'แพลตฟอร์มซื้อขายสินค้าที่ขับเคลื่อนด้วย AI ลงขายง่ายใน 30 วินาที',
        images: ['/og-image.png'],
        creator: '@jaikod',
    },

    // Robots
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },

    // Icons
    icons: {
        icon: '/favicon.ico',
        shortcut: '/favicon-16x16.png',
        apple: '/apple-touch-icon.png',
    },

    // Manifest
    manifest: '/manifest.json',

    // Verification (add your IDs when ready)
    // verification: {
    //     google: 'your-google-verification-code',
    //     yandex: 'your-yandex-verification-code',
    // },

    // Category
    category: 'marketplace',
}

// JSON-LD Structured Data
const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'JaiKod',
    alternateName: 'ใจโค้ด',
    url: BASE_URL,
    logo: `${BASE_URL}/logo.png`,
    description: 'แพลตฟอร์มซื้อขายสินค้ามือสองและสินค้าใหม่ที่ขับเคลื่อนด้วย AI',
    sameAs: [
        // Add social URLs when available
    ],
    contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        availableLanguage: ['Thai', 'English'],
    },
}

const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'JaiKod',
    alternateName: 'ใจโค้ด',
    url: BASE_URL,
    potentialAction: {
        '@type': 'SearchAction',
        target: {
            '@type': 'EntryPoint',
            urlTemplate: `${BASE_URL}/search?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
    },
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
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

                {/* JSON-LD Organization Schema */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(organizationJsonLd),
                    }}
                />

                {/* JSON-LD Website Schema with SearchAction */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify(websiteJsonLd),
                    }}
                />
            </head>
            <body className="font-primary antialiased" suppressHydrationWarning>
                <LanguageProvider>
                    <AuthProvider>
                        <AdminProvider>
                            <SiteSettingsProvider>
                                <WishlistProvider>
                                    <NotificationProvider>
                                        <ChatProvider>
                                            <PWAProvider>
                                                {children}
                                                <FloatingChatWidget />
                                                <CookieConsent />
                                            </PWAProvider>
                                        </ChatProvider>
                                    </NotificationProvider>
                                </WishlistProvider>
                            </SiteSettingsProvider>
                        </AdminProvider>
                    </AuthProvider>
                </LanguageProvider>
            </body>
        </html>
    )
}

'use client'

/**
 * Brand Page Content - Client-only component
 * 
 * แยกออกมาเพื่อใช้ dynamic import กับ ssr: false
 * ป้องกัน Hydration Error จาก Framer Motion
 */

import JaiKodLogo, { JaiKodIcon, JaiKodWordmark, JaiKodAppIcon } from '@/components/branding/JaiKodLogo'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Download, Copy, Check, Palette, Type, Sparkles, Heart, Code } from 'lucide-react'
import { useState } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'

// Translations
const translations = {
    th: {
        title: 'Brand Guidelines',
        subtitle: 'คู่มือการใช้งานโลโก้ JaiKod และ Brand Identity',
        logoVariations: 'รูปแบบโลโก้',
        fullLogo: 'โลโก้เต็ม',
        fullLogoDesc: 'Icon + Wordmark (แนะนำ สำหรับ Header)',
        iconOnly: 'Icon อย่างเดียว',
        iconOnlyDesc: 'สำหรับ App Icon, Favicon, Avatar',
        wordmarkOnly: 'Wordmark อย่างเดียว',
        wordmarkOnlyDesc: 'Text Logo สำหรับพื้นที่จำกัด',
        bgVariations: 'พื้นหลังต่างๆ',
        lightBg: 'พื้นสีอ่อน',
        lightBgDesc: 'สำหรับพื้นสีอ่อน',
        darkBg: 'พื้นสีเข้ม',
        darkBgDesc: 'สำหรับพื้นสีเข้ม',
        galaxyBg: 'พื้น Galaxy',
        galaxyBgDesc: 'สำหรับพื้นหลัง Gradient',
        brandGradient: 'Brand Gradient',
        brandGradientDesc: 'สำหรับการนำเสนอ',
        appIcons: 'App Icons',
        iosAndroid: 'iOS/Android App',
        webFavicon: 'Web Favicon',
        smallIcon: 'Small Icon',
        minimal: 'Minimal',
        colorPalette: 'สี',
        neonPurple: 'Neon Purple',
        primaryColor: 'สีหลักของแบรนด์',
        coralOrange: 'Coral Orange',
        warmth: 'ความอบอุ่น (ใจ)',
        goldenAmber: 'Golden Amber',
        aiSparkle: 'AI Sparkle Accent',
        deepIndigo: 'Deep Indigo',
        tech: 'เทคโนโลยี (โค้ด)',
        brandMeaning: 'ความหมายของแบรนด์',
        jai: 'ใจ',
        jaiMeaning: 'หัวใจ & จิตวิญญาณ',
        jaiDesc: 'สื่อถึงความใส่ใจ ความอบอุ่น และความจริงใจในการซื้อขาย ใช้โทนสีส้มคอรัลที่ให้ความรู้สึกเป็นมิตร',
        kod: 'โค้ด',
        kodMeaning: 'เทคโนโลยี & AI',
        kodDesc: 'สื่อถึงเทคโนโลยีและ AI ที่ขับเคลื่อนแพลตฟอร์ม ใช้โทนสีม่วง-น้ำเงินที่ให้ความรู้สึกทันสมัย',
        usageGuidelines: 'แนวทางการใช้งาน',
        doTitle: '✅ ควรทำ',
        do1: 'ใช้โลโก้บนพื้นหลังที่มีความคมชัด (contrast สูง)',
        do2: 'รักษาสัดส่วนโลโก้ตามต้นฉบับ',
        do3: 'ใช้ Gradient ตามที่กำหนดเท่านั้น',
        do4: 'เว้นระยะรอบโลโก้อย่างน้อย 20% ของความสูงโลโก้',
        dontTitle: '❌ ไม่ควรทำ',
        dont1: 'เปลี่ยนสีหรือ Gradient ของโลโก้',
        dont2: 'บิดหรือยืดโลโก้',
        dont3: 'ใส่ Effect หรือ Shadow ที่ไม่จำเป็น',
        dont4: 'วางโลโก้บนพื้นหลังที่ซับซ้อนจนมองไม่ชัด',
        downloadAssets: 'ดาวน์โหลด Assets',
        downloadDesc: 'ดาวน์โหลดไฟล์โลโก้และ Brand Assets',
        svgPackage: 'SVG Package',
        pngPackage: 'PNG Package',
        pdfGuidelines: 'Brand Guidelines PDF',
    },
    en: {
        title: 'Brand Guidelines',
        subtitle: 'JaiKod Logo Usage Guide and Brand Identity',
        logoVariations: 'Logo Variations',
        fullLogo: 'Full Logo',
        fullLogoDesc: 'Icon + Wordmark (Recommended for Header)',
        iconOnly: 'Icon Only',
        iconOnlyDesc: 'For App Icon, Favicon, Avatar',
        wordmarkOnly: 'Wordmark Only',
        wordmarkOnlyDesc: 'Text Logo for limited space',
        bgVariations: 'Background Variations',
        lightBg: 'Light Background',
        lightBgDesc: 'For light backgrounds',
        darkBg: 'Dark Background',
        darkBgDesc: 'For dark backgrounds',
        galaxyBg: 'Galaxy Background',
        galaxyBgDesc: 'For gradient backgrounds',
        brandGradient: 'Brand Gradient',
        brandGradientDesc: 'For presentations',
        appIcons: 'App Icons',
        iosAndroid: 'iOS/Android App',
        webFavicon: 'Web Favicon',
        smallIcon: 'Small Icon',
        minimal: 'Minimal',
        colorPalette: 'Color Palette',
        neonPurple: 'Neon Purple',
        primaryColor: 'Primary Brand Color',
        coralOrange: 'Coral Orange',
        warmth: 'Heart/Warmth (Jai)',
        goldenAmber: 'Golden Amber',
        aiSparkle: 'AI Sparkle Accent',
        deepIndigo: 'Deep Indigo',
        tech: 'Tech/Code (Kod)',
        brandMeaning: 'Brand Meaning',
        jai: 'Jai (ใจ)',
        jaiMeaning: 'Heart & Soul',
        jaiDesc: 'Represents care, warmth, and sincerity in buying and selling. Uses coral orange tones for a friendly feel.',
        kod: 'Kod (โค้ด)',
        kodMeaning: 'Technology & AI',
        kodDesc: 'Represents technology and AI powering the platform. Uses purple-blue tones for a modern feel.',
        usageGuidelines: 'Usage Guidelines',
        doTitle: '✅ Do',
        do1: 'Use logo on high-contrast backgrounds',
        do2: 'Maintain original logo proportions',
        do3: 'Use only approved gradients',
        do4: 'Keep at least 20% padding around the logo',
        dontTitle: "❌ Don't",
        dont1: 'Change logo colors or gradients',
        dont2: 'Distort or stretch the logo',
        dont3: 'Add unnecessary effects or shadows',
        dont4: 'Place logo on busy backgrounds',
        downloadAssets: 'Download Assets',
        downloadDesc: 'Download logo files and Brand Assets',
        svgPackage: 'SVG Package',
        pngPackage: 'PNG Package',
        pdfGuidelines: 'Brand Guidelines PDF',
    }
}

export default function BrandPageContent() {
    const [copied, setCopied] = useState<string | null>(null)
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th

    const copyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopied(id)
        setTimeout(() => setCopied(null), 2000)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-slate-950">
            <Header />

            <main className="container mx-auto px-4 py-12">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <div className="flex justify-center mb-8">
                        <JaiKodLogo variant="full" size="2xl" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        {t.title}
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        {t.subtitle}
                    </p>
                </div>

                {/* Logo Variations */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <Type className="w-6 h-6 text-purple-500" />
                        {t.logoVariations}
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">
                        <LogoCard
                            title={t.fullLogo}
                            description={t.fullLogoDesc}
                            bgClass="bg-white dark:bg-slate-900"
                        >
                            <JaiKodLogo variant="full" size="xl" animated={false} />
                        </LogoCard>

                        <LogoCard
                            title={t.iconOnly}
                            description={t.iconOnlyDesc}
                            bgClass="bg-gradient-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30"
                        >
                            <JaiKodIcon size={80} />
                        </LogoCard>

                        <LogoCard
                            title={t.wordmarkOnly}
                            description={t.wordmarkOnlyDesc}
                            bgClass="bg-white dark:bg-slate-900"
                        >
                            <JaiKodWordmark height={50} />
                        </LogoCard>
                    </div>
                </section>

                {/* Logo on Different Backgrounds */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <Palette className="w-6 h-6 text-purple-500" />
                        {t.bgVariations}
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <LogoCard
                            title={t.lightBg}
                            description={t.lightBgDesc}
                            bgClass="bg-white"
                        >
                            <JaiKodLogo variant="full" size="lg" theme="light" animated={false} />
                        </LogoCard>

                        <LogoCard
                            title={t.darkBg}
                            description={t.darkBgDesc}
                            bgClass="bg-slate-900"
                            textClass="text-white"
                        >
                            <JaiKodLogo variant="full" size="lg" theme="dark" animated={false} />
                        </LogoCard>

                        <LogoCard
                            title={t.galaxyBg}
                            description={t.galaxyBgDesc}
                            bgClass="bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900"
                            textClass="text-white"
                        >
                            <JaiKodLogo variant="full" size="lg" theme="dark" animated={false} />
                        </LogoCard>

                        <LogoCard
                            title={t.brandGradient}
                            description={t.brandGradientDesc}
                            bgClass="bg-gradient-to-r from-neon-purple to-indigo-600"
                            textClass="text-white"
                        >
                            <JaiKodLogo variant="full" size="lg" theme="dark" animated={false} />
                        </LogoCard>
                    </div>
                </section>

                {/* App Icon Showcase */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <Sparkles className="w-6 h-6 text-purple-500" />
                        {t.appIcons}
                    </h2>

                    <div className="grid md:grid-cols-4 gap-6">
                        <div className="text-center">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg mb-4 flex items-center justify-center">
                                <JaiKodAppIcon size={120} />
                            </div>
                            <p className="font-semibold">{t.iosAndroid}</p>
                            <p className="text-sm text-gray-500">1024x1024</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg mb-4 flex items-center justify-center">
                                <JaiKodAppIcon size={64} />
                            </div>
                            <p className="font-semibold">{t.webFavicon}</p>
                            <p className="text-sm text-gray-500">192x192</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg mb-4 flex items-center justify-center">
                                <JaiKodAppIcon size={48} />
                            </div>
                            <p className="font-semibold">{t.smallIcon}</p>
                            <p className="text-sm text-gray-500">48x48</p>
                        </div>

                        <div className="text-center">
                            <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg mb-4 flex items-center justify-center">
                                <JaiKodIcon size={32} />
                            </div>
                            <p className="font-semibold">{t.minimal}</p>
                            <p className="text-sm text-gray-500">32x32</p>
                        </div>
                    </div>
                </section>

                {/* Color Palette */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <Palette className="w-6 h-6 text-purple-500" />
                        {t.colorPalette}
                    </h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <ColorCard
                            name={t.neonPurple}
                            hex="#8B5CF6"
                            usage={t.primaryColor}
                            onCopy={() => copyToClipboard('#8B5CF6', 'purple')}
                            copied={copied === 'purple'}
                        />
                        <ColorCard
                            name={t.coralOrange}
                            hex="#FF6B6B"
                            usage={t.warmth}
                            onCopy={() => copyToClipboard('#FF6B6B', 'coral')}
                            copied={copied === 'coral'}
                        />
                        <ColorCard
                            name={t.goldenAmber}
                            hex="#F59E0B"
                            usage={t.aiSparkle}
                            onCopy={() => copyToClipboard('#F59E0B', 'amber')}
                            copied={copied === 'amber'}
                        />
                        <ColorCard
                            name={t.deepIndigo}
                            hex="#4F46E5"
                            usage={t.tech}
                            onCopy={() => copyToClipboard('#4F46E5', 'indigo')}
                            copied={copied === 'indigo'}
                        />
                    </div>
                </section>

                {/* Brand Meaning */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
                        <Heart className="w-6 h-6 text-coral-500" />
                        {t.brandMeaning}
                    </h2>

                    <div className="grid md:grid-cols-2 gap-6">
                        <MeaningCard
                            icon={<Heart className="w-8 h-8 text-coral-500" />}
                            title={t.jai}
                            meaning={t.jaiMeaning}
                            description={t.jaiDesc}
                        />
                        <MeaningCard
                            icon={<Code className="w-8 h-8 text-purple-500" />}
                            title={t.kod}
                            meaning={t.kodMeaning}
                            description={t.kodDesc}
                        />
                    </div>
                </section>

                {/* Usage Guidelines */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold mb-8">{t.usageGuidelines}</h2>

                    <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 shadow-lg">
                        <h3 className="font-bold text-lg mb-4 text-green-600">{t.doTitle}</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 mb-6">
                            <li>{t.do1}</li>
                            <li>{t.do2}</li>
                            <li>{t.do3}</li>
                            <li>{t.do4}</li>
                        </ul>

                        <h3 className="font-bold text-lg mb-4 text-red-600">{t.dontTitle}</h3>
                        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                            <li>{t.dont1}</li>
                            <li>{t.dont2}</li>
                            <li>{t.dont3}</li>
                            <li>{t.dont4}</li>
                        </ul>
                    </div>
                </section>

                {/* Download Section */}
                <section className="text-center">
                    <h2 className="text-2xl font-bold mb-4">{t.downloadAssets}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {t.downloadDesc}
                    </p>
                    <div className="flex justify-center gap-4 flex-wrap">
                        <button className="flex items-center gap-2 bg-neon-purple text-white px-6 py-3 rounded-xl hover:bg-purple-600 transition">
                            <Download className="w-5 h-5" />
                            {t.svgPackage}
                        </button>
                        <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                            <Download className="w-5 h-5" />
                            {t.pngPackage}
                        </button>
                        <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition">
                            <Download className="w-5 h-5" />
                            {t.pdfGuidelines}
                        </button>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}

// Helper Components - Static, no motion
function LogoCard({
    title,
    description,
    bgClass,
    textClass = 'text-gray-900 dark:text-white',
    children
}: {
    title: string
    description: string
    bgClass: string
    textClass?: string
    children: React.ReactNode
}) {
    return (
        <div className={`rounded-2xl overflow-hidden shadow-lg ${bgClass} relative`}>
            <div className="p-8 flex items-center justify-center min-h-[180px] relative">
                {children}
            </div>
            <div className={`px-6 pb-6 ${textClass}`}>
                <h3 className="font-bold text-lg">{title}</h3>
                <p className={`text-sm ${textClass === 'text-white' ? 'text-white/70' : 'text-gray-500 dark:text-gray-400'}`}>
                    {description}
                </p>
            </div>
        </div>
    )
}

function ColorCard({
    name,
    hex,
    usage,
    onCopy,
    copied
}: {
    name: string
    hex: string
    usage: string
    onCopy: () => void
    copied: boolean
}) {
    return (
        <div
            className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg cursor-pointer hover:scale-[1.02] transition-transform"
            onClick={onCopy}
        >
            <div className="h-24" style={{ backgroundColor: hex }} />
            <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="font-bold">{name}</h3>
                    {copied ? (
                        <Check className="w-4 h-4 text-green-500" />
                    ) : (
                        <Copy className="w-4 h-4 text-gray-400" />
                    )}
                </div>
                <p className="font-mono text-sm text-gray-600 dark:text-gray-400">{hex}</p>
                <p className="text-xs text-gray-500 mt-1">{usage}</p>
            </div>
        </div>
    )
}

function MeaningCard({
    icon,
    title,
    meaning,
    description
}: {
    icon: React.ReactNode
    title: string
    meaning: string
    description: string
}) {
    return (
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-4">
                {icon}
                <div>
                    <h3 className="font-bold text-xl">{title}</h3>
                    <p className="text-gray-500">{meaning}</p>
                </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">{description}</p>
        </div>
    )
}

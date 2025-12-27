'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Check, X, ArrowRight, Sparkles, Crown, Zap, Star, HelpCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

const translations = {
    th: {
        title: 'เลือกแพ็กเกจที่',
        titleHighlight: 'เหมาะกับคุณ',
        subtitle: 'ลงขายฟรี จ่ายเมื่อขายได้ หรืออัปเกรดเพื่อลดค่าธรรมเนียมและได้สิทธิพิเศษ',
        monthly: 'รายเดือน',
        yearly: 'รายปี',
        save17: 'ประหยัด 17%',
        year: 'ปี',
        month: 'เดือน',
        freeForever: 'ฟรีตลอดชีพ',
        popular: 'ยอดนิยม',
        compareTitle: 'เปรียบเทียบแพ็กเกจ',
        feature: 'ฟีเจอร์',
        sellingFee: 'ค่าธรรมเนียมขาย',
        listing: 'ลงขาย',
        unlimited: 'ไม่จำกัด',
        promotion: 'โปรโมทสินค้า',
        perTime: '/ครั้ง',
        timesPerMonth: 'ครั้ง/เดือน',
        badge: 'Badge',
        analytics: 'Analytics',
        basic: 'พื้นฐาน',
        advanced: 'ขั้นสูง',
        advancedReport: 'ขั้นสูง + รายงาน',
        storePage: 'หน้าร้านค้า',
        fullFeatured: 'เต็มรูปแบบ',
        faqTitle: 'คำถามที่พบบ่อย',
        faq1Q: 'ยกเลิกสมาชิกได้ไหม?',
        faq1A: 'ได้ครับ สามารถยกเลิกได้ทุกเมื่อ ไม่มีค่าธรรมเนียมยกเลิก',
        faq2Q: 'เปลี่ยนแพ็กเกจได้ไหม?',
        faq2A: 'ได้ครับ สามารถอัปเกรดหรือดาวน์เกรดได้ตลอดเวลา',
        faq3Q: 'ชำระเงินได้วิธีไหนบ้าง?',
        faq3A: 'รองรับ บัตรเครดิต/เดบิต, PromptPay, และ JaiStar',
        faq4Q: 'มีคืนเงินไหม?',
        faq4A: 'มี! รับประกันคืนเงินภายใน 7 วัน หากไม่พอใจ',
        notSure: 'ยังไม่แน่ใจ?',
        startFreeNoCard: 'เริ่มต้นฟรี ไม่ต้องใส่บัตรเครดิต อัปเกรดได้ทุกเมื่อ',
        startFree: 'เริ่มต้นฟรีเลย',
        // Plans
        planBasic: 'ฟรี',
        planPlus: 'พลัส',
        planVerified: 'ยืนยันตัวตน',
        planPremium: 'พรีเมียม',
        basicDesc: 'เริ่มต้นใช้งานฟรี',
        plusDesc: 'สำหรับผู้ขายตัวจริง',
        verifiedDesc: 'สร้างความน่าเชื่อถือ',
        premiumDesc: 'สำหรับร้านค้ามืออาชีพ',
        startFreeCta: 'เริ่มต้นฟรี',
        choosePlus: 'เลือก พลัส',
        chooseVerified: 'เลือก ยืนยันตัวตน',
        choosePremium: 'เลือก พรีเมียม',
        fee5: 'ค่าธรรมเนียม 5%',
        fee4: 'ค่าธรรมเนียม 4%',
        fee3: 'ค่าธรรมเนียม 3%',
        fee2: 'ค่าธรรมเนียม 2% ต่ำสุด!',
        chatBuyer: 'แชทกับผู้ซื้อ',
        aiPrice: 'แนะนำราคา AI',
        promote: 'โปรโมทสินค้า',
        promote5: 'โปรโมท 5 ครั้ง/เดือน',
        promote20: 'โปรโมท 20 ครั้ง/เดือน',
        promoteUnlimited: 'โปรโมทไม่จำกัด',
        verifyBadge: 'แบดจ์ยืนยัน',
        verifyBadgeFull: 'แบดจ์ ✓ ยืนยันตัวตน',
        premiumBadge: 'แบดจ์ 👑 พรีเมียม',
        analyticsBasic: 'วิเคราะห์พื้นฐาน',
        analyticsAdvanced: 'วิเคราะห์ขั้นสูง',
        analyticsReport: 'วิเคราะห์ + รายงาน',
        premiumCategory: 'ลงขายหมวดพรีเมียม',
        fullStorePage: 'หน้าร้านค้าเต็มรูปแบบ',
    },
    en: {
        title: 'Choose the Plan',
        titleHighlight: 'Right for You',
        subtitle: 'List for free, pay when you sell. Or upgrade to reduce fees and get special benefits.',
        monthly: 'Monthly',
        yearly: 'Yearly',
        save17: 'Save 17%',
        year: 'year',
        month: 'month',
        freeForever: 'Free Forever',
        popular: 'Popular',
        compareTitle: 'Compare Plans',
        feature: 'Feature',
        sellingFee: 'Selling Fee',
        listing: 'Listings',
        unlimited: 'Unlimited',
        promotion: 'Promotions',
        perTime: '/time',
        timesPerMonth: 'times/month',
        badge: 'Badge',
        analytics: 'Analytics',
        basic: 'Basic',
        advanced: 'Advanced',
        advancedReport: 'Advanced + Reports',
        storePage: 'Store Page',
        fullFeatured: 'Full Featured',
        faqTitle: 'Frequently Asked Questions',
        faq1Q: 'Can I cancel my subscription?',
        faq1A: 'Yes, you can cancel anytime. No cancellation fees.',
        faq2Q: 'Can I change my plan?',
        faq2A: 'Yes, you can upgrade or downgrade anytime.',
        faq3Q: 'What payment methods are accepted?',
        faq3A: 'We accept Credit/Debit cards, PromptPay, and JaiStar.',
        faq4Q: 'Is there a refund policy?',
        faq4A: 'Yes! 7-day money-back guarantee if not satisfied.',
        notSure: 'Not Sure Yet?',
        startFreeNoCard: 'Start free, no credit card required. Upgrade anytime.',
        startFree: 'Start Free Now',
        // Plans
        basicDesc: 'Start for free',
        plusDesc: 'For serious sellers',
        verifiedDesc: 'Build trust',
        premiumDesc: 'For professional stores',
        startFreeCta: 'Start Free',
        choosePlus: 'Choose Plus',
        chooseVerified: 'Choose Verified',
        choosePremium: 'Choose Premium',
        fee5: '5% selling fee',
        fee4: '4% selling fee',
        fee3: '3% selling fee',
        fee2: '2% lowest fee!',
        chatBuyer: 'Chat with buyers',
        aiPrice: 'AI Price Suggestion',
        promote: 'Product promotions',
        promote5: '5 promotions/month',
        promote20: '20 promotions/month',
        promoteUnlimited: 'Unlimited promotions',
        verifyBadge: 'Verification Badge',
        verifyBadgeFull: '✓ Verified Badge',
        premiumBadge: '👑 Premium Badge',
        analyticsBasic: 'Basic Analytics',
        analyticsAdvanced: 'Advanced Analytics',
        analyticsReport: 'Analytics + Reports',
        premiumCategory: 'Premium Categories',
        fullStorePage: 'Full Store Page',
        // Plan names in English
        planBasic: 'Basic',
        planPlus: 'Plus',
        planVerified: 'Verified',
        planPremium: 'Premium',
    }
}

export default function PricingPage() {
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th
    const [isYearly, setIsYearly] = useState(false)

    const plans = [
        {
            name: t.planBasic,
            icon: '🆓',
            price: { monthly: 0, yearly: 0 },
            description: t.basicDesc,
            color: 'from-gray-400 to-gray-500',
            features: [
                { text: t.unlimited, included: true },
                { text: t.fee5, included: true },
                { text: t.chatBuyer, included: true },
                { text: t.aiPrice, included: true },
                { text: t.promote, included: false },
                { text: t.verifyBadge, included: false },
                { text: t.analytics, included: false },
                { text: t.premiumCategory, included: false },
            ],
            cta: t.startFreeCta,
            popular: false,
        },
        {
            name: t.planPlus,
            icon: '⚡',
            price: { monthly: 99, yearly: 990 },
            description: t.plusDesc,
            color: 'from-blue-500 to-cyan-500',
            features: [
                { text: t.unlimited, included: true },
                { text: t.fee4, included: true },
                { text: t.chatBuyer, included: true },
                { text: t.aiPrice, included: true },
                { text: t.promote5, included: true },
                { text: t.verifyBadge, included: false },
                { text: t.analyticsBasic, included: true },
                { text: t.premiumCategory, included: false },
            ],
            cta: t.choosePlus,
            popular: false,
        },
        {
            name: t.planVerified,
            icon: '✅',
            price: { monthly: 299, yearly: 2990 },
            description: t.verifiedDesc,
            color: 'from-neon-purple to-purple-600',
            features: [
                { text: t.unlimited, included: true },
                { text: t.fee3, included: true },
                { text: t.chatBuyer, included: true },
                { text: t.aiPrice, included: true },
                { text: t.promote20, included: true },
                { text: t.verifyBadgeFull, included: true },
                { text: t.analyticsAdvanced, included: true },
                { text: t.premiumCategory, included: true },
            ],
            cta: t.chooseVerified,
            popular: true,
        },
        {
            name: t.planPremium,
            icon: '👑',
            price: { monthly: 799, yearly: 7990 },
            description: t.premiumDesc,
            color: 'from-amber-500 to-orange-500',
            features: [
                { text: t.unlimited, included: true },
                { text: t.fee2, included: true },
                { text: t.chatBuyer, included: true },
                { text: t.aiPrice, included: true },
                { text: t.promoteUnlimited, included: true },
                { text: t.premiumBadge, included: true },
                { text: t.analyticsReport, included: true },
                { text: t.fullStorePage, included: true },
            ],
            cta: t.choosePremium,
            popular: false,
        },
    ]

    const faqs = [
        { q: t.faq1Q, a: t.faq1A },
        { q: t.faq2Q, a: t.faq2A },
        { q: t.faq3Q, a: t.faq3A },
        { q: t.faq4Q, a: t.faq4A },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-16 text-center">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            {t.title} <span className="text-gradient">{t.titleHighlight}</span>
                        </h1>
                        <p className="text-xl text-text-secondary dark:text-gray-400 max-w-2xl mx-auto mb-8">
                            {t.subtitle}
                        </p>

                        {/* Toggle */}
                        <div className="flex items-center justify-center gap-4 mb-12">
                            <span className={`font-medium ${!isYearly ? 'text-neon-purple' : 'text-gray-500'}`}>{t.monthly}</span>
                            <button
                                onClick={() => setIsYearly(!isYearly)}
                                className={`w-14 h-8 rounded-full p-1 transition-colors ${isYearly ? 'bg-neon-purple' : 'bg-gray-300'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${isYearly ? 'translate-x-6' : ''}`}></div>
                            </button>
                            <span className={`font-medium ${isYearly ? 'text-neon-purple' : 'text-gray-500'}`}>
                                {t.yearly} <span className="text-emerald-500 text-sm">({t.save17})</span>
                            </span>
                        </div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="pb-16">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {plans.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`relative bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-xl border-2 ${plan.popular ? 'border-neon-purple scale-105' : 'border-gray-100 dark:border-gray-800'}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon-purple text-white px-4 py-1 rounded-full text-sm font-bold">
                                            {t.popular}
                                        </div>
                                    )}
                                    <div className="text-center mb-6">
                                        <div className="text-5xl mb-3">{plan.icon}</div>
                                        <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                                        <p className="text-sm text-text-secondary dark:text-gray-400">{plan.description}</p>
                                    </div>
                                    <div className="text-center mb-6">
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-4xl font-bold">
                                                ฿{isYearly ? plan.price.yearly.toLocaleString() : plan.price.monthly.toLocaleString()}
                                            </span>
                                            <span className="text-text-secondary">/{isYearly ? t.year : t.month}</span>
                                        </div>
                                        {plan.price.monthly === 0 && <span className="text-emerald-500 font-medium">{t.freeForever}</span>}
                                    </div>
                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                {feature.included ? (
                                                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                ) : (
                                                    <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                                )}
                                                <span className={feature.included ? '' : 'text-gray-400'}>{feature.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href={plan.price.monthly === 0 ? '/register' : '/upgrade'}>
                                        <Button
                                            variant={plan.popular ? 'primary' : 'outline'}
                                            className="w-full"
                                        >
                                            {plan.cta}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">{t.faqTitle}</h2>
                        <div className="max-w-3xl mx-auto space-y-4">
                            {faqs.map((faq, idx) => (
                                <details key={idx} className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm">
                                    <summary className="font-bold cursor-pointer flex items-center gap-2">
                                        <HelpCircle className="w-5 h-5 text-neon-purple" />
                                        {faq.q}
                                    </summary>
                                    <p className="mt-3 text-text-secondary pl-7">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-gradient-to-r from-neon-purple to-coral-orange">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">{t.notSure}</h2>
                        <p className="text-white/80 mb-8">{t.startFreeNoCard}</p>
                        <Link href="/register">
                            <Button className="bg-white text-neon-purple hover:bg-gray-100 px-8 py-3">
                                {t.startFree}
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

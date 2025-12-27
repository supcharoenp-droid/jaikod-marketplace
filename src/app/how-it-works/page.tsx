'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Camera, Tag, MessageCircle, CreditCard, Package, Star, ArrowRight, CheckCircle, Play, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

const translations = {
    th: {
        heroTitle: 'JaiKod ทำงานอย่างไร?',
        heroSubtitle: 'ซื้อขายของมือสองง่ายๆ ด้วย AI ที่ช่วยคุณทุกขั้นตอน',
        watchVideo: 'ดูวิดีโอสอนใช้งาน',
        step1Title: 'ถ่ายรูป',
        step1Desc: 'ถ่ายรูปสินค้าที่ต้องการขาย AI จะช่วยกรอกข้อมูลและแนะนำราคาให้อัตโนมัติ',
        step2Title: 'แชท',
        step2Desc: 'แชทกับผู้ซื้อ/ผู้ขาย ต่อราคา นัดรับสินค้า ทุกอย่างจบในแอปเดียว',
        step3Title: 'เสร็จสิ้น',
        step3Desc: 'ชำระเงินผ่าน JaiStar ปลอดภัย มีระบบ Escrow คุ้มครองทั้งสองฝ่าย',
        forSellers: 'สำหรับผู้ขาย',
        sellIn30Seconds: 'ลงขายได้ใน',
        seconds: '30 วินาที',
        seller1: 'ถ่ายรูปสินค้า - AI จะจดจำและกรอกข้อมูลให้',
        seller2: 'AI แนะนำราคาจากข้อมูลตลาดจริง',
        seller3: 'ระบบโปรโมทให้สินค้าเข้าถึงผู้ซื้อ',
        seller4: 'รับเงินเข้า JaiWallet ถอนได้ทันที',
        startSelling: 'เริ่มลงขายเลย',
        forBuyers: 'สำหรับผู้ซื้อ',
        findGreatDeals: 'ค้นหาของดีราคาถูก',
        easily: 'ได้ง่ายๆ',
        buyer1: 'ค้นหาด้วยภาษาธรรมชาติ เช่น "iPhone งบ 20,000"',
        buyer2: 'ค้นหาด้วยรูปภาพ - ถ่ายรูปของที่อยากได้',
        buyer3: 'AI แนะนำสินค้าตามความสนใจของคุณ',
        buyer4: 'ระบบ Buyer Protection คุ้มครองทุกการซื้อ',
        startShopping: 'เริ่มช้อปปิ้ง',
        aiHelpsYou: 'AI ที่ช่วยคุณทุกขั้นตอน',
        aiSubtitle: 'เทคโนโลยี AI ล้ำสมัยที่ทำให้การซื้อขายง่ายขึ้น',
        ai1Title: 'ระบบจดจำภาพ AI',
        ai1Desc: 'จดจำสินค้าจากรูปภาพ กรอกข้อมูลให้อัตโนมัติ',
        ai2Title: 'แนะนำราคา AI',
        ai2Desc: 'แนะนำราคาที่เหมาะสมจากข้อมูลตลาดจริง',
        ai3Title: 'ค้นหาอัจฉริยะ',
        ai3Desc: 'ค้นหาด้วยภาษาธรรมชาติ เข้าใจสิ่งที่คุณต้องการ',
        ai4Title: 'ตรวจจับมิจฉาชีพ',
        ai4Desc: 'ตรวจจับมิจฉาชีพและสินค้าปลอมอัตโนมัติ',
        ai5Title: 'แนะนำเฉพาะบุคคล',
        ai5Desc: 'แนะนำสินค้าตามความสนใจและพฤติกรรม',
        ai6Title: 'ตอบกลับอัตโนมัติ',
        ai6Desc: 'แนะนำข้อความตอบกลับอัตโนมัติ',
        safe100: 'ปลอดภัย 100%',
        safeTransaction: 'ธุรกรรมปลอดภัย',
        escrow: 'ระบบพักเงิน',
        support: 'ทีมดูแล',
        refund: 'รับประกันคืนเงิน',
        readyToStart: 'พร้อมเริ่มต้นแล้วหรือยัง?',
        freeToJoin: 'สมัครฟรี ลงขายฟรี จ่ายเมื่อขายได้เท่านั้น!',
        register: 'สมัครสมาชิก',
        listProduct: 'ลงขายสินค้า',
    },
    en: {
        heroTitle: 'How JaiKod Works?',
        heroSubtitle: 'Buy and sell secondhand items easily with AI assistance at every step',
        watchVideo: 'Watch Tutorial',
        step1Title: 'Take Photo',
        step1Desc: 'Take a photo of your item. AI will auto-fill details and suggest pricing.',
        step2Title: 'Chat',
        step2Desc: 'Chat with buyers/sellers, negotiate prices, arrange meetups - all in one app.',
        step3Title: 'Complete',
        step3Desc: 'Pay safely via JaiStar with Escrow protection for both parties.',
        forSellers: 'For Sellers',
        sellIn30Seconds: 'List in',
        seconds: '30 Seconds',
        seller1: 'Take a photo - AI recognizes and fills in details',
        seller2: 'AI suggests pricing based on real market data',
        seller3: 'Promotion system reaches more buyers',
        seller4: 'Receive money in JaiWallet, withdraw instantly',
        startSelling: 'Start Selling',
        forBuyers: 'For Buyers',
        findGreatDeals: 'Find Great Deals',
        easily: 'Easily',
        buyer1: 'Search naturally like "iPhone budget 20,000"',
        buyer2: 'Search by photo - snap what you want to find',
        buyer3: 'AI recommends items based on your interests',
        buyer4: 'Buyer Protection covers every purchase',
        startShopping: 'Start Shopping',
        aiHelpsYou: 'AI Helps You Every Step',
        aiSubtitle: 'Advanced AI technology makes buying and selling easier',
        ai1Title: 'AI Image Recognition',
        ai1Desc: 'Recognizes products from photos, auto-fills details',
        ai2Title: 'AI Price Suggestion',
        ai2Desc: 'Suggests optimal pricing from real market data',
        ai3Title: 'Smart Search',
        ai3Desc: 'Natural language search understands what you want',
        ai4Title: 'Fraud Detection',
        ai4Desc: 'Automatically detects scammers and fake products',
        ai5Title: 'Personalization',
        ai5Desc: 'Recommends items based on your interests and behavior',
        ai6Title: 'Smart Reply',
        ai6Desc: 'Suggests auto-reply messages',
        safe100: '100% Safe',
        safeTransaction: 'Safe Transactions',
        escrow: 'Escrow System',
        support: 'Support Team',
        refund: 'Money-back Guarantee',
        readyToStart: 'Ready to Get Started?',
        freeToJoin: 'Free to join, free to list. Pay only when you sell!',
        register: 'Register',
        listProduct: 'List Product',
    }
}

export default function HowItWorksPage() {
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th

    const steps = [
        { step: 1, icon: '📸', title: t.step1Title, desc: t.step1Desc, color: 'from-blue-500 to-cyan-500' },
        { step: 2, icon: '💬', title: t.step2Title, desc: t.step2Desc, color: 'from-purple-500 to-pink-500' },
        { step: 3, icon: '✅', title: t.step3Title, desc: t.step3Desc, color: 'from-emerald-500 to-green-500' },
    ]

    const sellerFeatures = [
        { icon: Camera, text: t.seller1 },
        { icon: Tag, text: t.seller2 },
        { icon: Sparkles, text: t.seller3 },
        { icon: CreditCard, text: t.seller4 },
    ]

    const buyerFeatures = [
        { icon: '🔍', text: t.buyer1 },
        { icon: '📷', text: t.buyer2 },
        { icon: '🎯', text: t.buyer3 },
        { icon: '🛡️', text: t.buyer4 },
    ]

    const aiFeatures = [
        { icon: '📸', title: t.ai1Title, desc: t.ai1Desc },
        { icon: '💰', title: t.ai2Title, desc: t.ai2Desc },
        { icon: '🔍', title: t.ai3Title, desc: t.ai3Desc },
        { icon: '🛡️', title: t.ai4Title, desc: t.ai4Desc },
        { icon: '🎯', title: t.ai5Title, desc: t.ai5Desc },
        { icon: '💬', title: t.ai6Title, desc: t.ai6Desc },
    ]

    const stats = [
        { value: '99.5%', label: t.safeTransaction },
        { value: 'Escrow', label: t.escrow },
        { value: '24/7', label: t.support },
        { value: language === 'th' ? '7 วัน' : '7 Days', label: t.refund },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-20 bg-gradient-to-br from-neon-purple via-purple-600 to-coral-orange text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                            {t.heroTitle}
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                            {t.heroSubtitle}
                        </p>
                        <Button className="bg-white text-neon-purple hover:bg-gray-100">
                            <Play className="w-5 h-5 mr-2" />
                            {t.watchVideo}
                        </Button>
                    </div>
                </section>

                {/* 3 Simple Steps */}
                <section className="py-20 -mt-10">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            {steps.map((item) => (
                                <div key={item.step} className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-xl text-center relative">
                                    <div className={`absolute -top-6 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                                        {item.step}
                                    </div>
                                    <div className="text-6xl mb-6 mt-4">{item.icon}</div>
                                    <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                                    <p className="text-text-secondary dark:text-gray-400">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* For Sellers */}
                <section className="py-16 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row items-center gap-12">
                            <div className="flex-1">
                                <span className="text-emerald-500 font-bold text-sm uppercase tracking-wider">{t.forSellers}</span>
                                <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-6">
                                    {t.sellIn30Seconds} <span className="text-gradient">{t.seconds}</span>
                                </h2>
                                <div className="space-y-4">
                                    {sellerFeatures.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                            <item.icon className="w-6 h-6 text-emerald-500" />
                                            <span className="font-medium">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/sell" className="inline-block mt-6">
                                    <Button variant="primary" size="lg">
                                        {t.startSelling}
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex-1">
                                <div className="aspect-square rounded-3xl bg-gradient-to-br from-emerald-100 to-green-50 dark:from-emerald-900/30 dark:to-green-900/20 p-8 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-9xl mb-4">📱</div>
                                        <p className="text-xl font-bold">Snap & Sell</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* For Buyers */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
                            <div className="flex-1">
                                <span className="text-blue-500 font-bold text-sm uppercase tracking-wider">{t.forBuyers}</span>
                                <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-6">
                                    {t.findGreatDeals} <span className="text-gradient">{t.easily}</span>
                                </h2>
                                <div className="space-y-4">
                                    {buyerFeatures.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                            <span className="text-2xl">{item.icon}</span>
                                            <span className="font-medium">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/" className="inline-block mt-6">
                                    <Button variant="primary" size="lg">
                                        {t.startShopping}
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                            <div className="flex-1">
                                <div className="aspect-square rounded-3xl bg-gradient-to-br from-blue-100 to-cyan-50 dark:from-blue-900/30 dark:to-cyan-900/20 p-8 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-9xl mb-4">🛒</div>
                                        <p className="text-xl font-bold">Smart Shopping</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* AI Features */}
                <section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 text-white">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <Sparkles className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">{t.aiHelpsYou}</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">{t.aiSubtitle}</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {aiFeatures.map((feature, idx) => (
                                <div key={idx} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700 hover:border-neon-purple transition-colors">
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-gray-400">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trust & Safety */}
                <section className="py-16 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold mb-8">{t.safe100}</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, idx) => (
                                <div key={idx}>
                                    <div className="text-3xl md:text-4xl font-bold text-neon-purple mb-2">{stat.value}</div>
                                    <div className="text-text-secondary">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-gradient-to-r from-neon-purple to-coral-orange">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{t.readyToStart}</h2>
                        <p className="text-white/80 text-lg mb-8">{t.freeToJoin}</p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <Link href="/register">
                                <Button className="bg-white text-neon-purple hover:bg-gray-100 px-8 py-3">
                                    {t.register}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/sell">
                                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                                    {t.listProduct}
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

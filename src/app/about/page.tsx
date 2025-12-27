'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import {
    Users, Target, Heart, Sparkles, Shield, Zap,
    Award, Globe, Rocket, CheckCircle, ArrowRight
} from 'lucide-react'
import Button from '@/components/ui/Button'

export default function AboutPage() {
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'

    // Translations
    const t = {
        aboutJaikod: lang === 'th' ? 'เกี่ยวกับ JaiKod' : 'About JaiKod',
        heroSubtitle: lang === 'th'
            ? 'ตลาดซื้อขายของมือสองที่ขับเคลื่อนด้วย AI ปลอดภัย ง่าย และทันสมัยที่สุดในประเทศไทย'
            : 'The AI-powered secondhand marketplace. Safe, easy, and the most modern in Thailand',
        ourMission: lang === 'th' ? 'พันธกิจของเรา' : 'Our Mission',
        missionTitle1: lang === 'th' ? 'ทำให้การซื้อขายของมือสอง' : 'Making secondhand trading',
        missionTitle2: lang === 'th' ? 'เป็นเรื่องง่ายสำหรับทุกคน' : 'easy for everyone',
        missionDesc: lang === 'th'
            ? 'JaiKod เกิดจากความเชื่อที่ว่า ของดีไม่จำเป็นต้องซื้อใหม่เสมอไป เราอยากสร้างแพลตฟอร์มที่ทำให้คนไทยสามารถซื้อขายสินค้ามือสองได้อย่างมั่นใจ ปลอดภัย และสะดวกสบาย ด้วยเทคโนโลยี AI ที่ทันสมัย'
            : 'JaiKod was born from the belief that good things don\'t always need to be new. We want to create a platform that allows Thai people to buy and sell secondhand goods with confidence, safety, and convenience using modern AI technology.',
        check1: lang === 'th' ? 'ลดขยะ รักษ์โลก ด้วยการใช้ของซ้ำ' : 'Reduce waste, save the planet by reusing',
        check2: lang === 'th' ? 'ประหยัดเงิน ได้ของดีราคาถูก' : 'Save money, get quality items at low prices',
        check3: lang === 'th' ? 'สร้างรายได้ จากของที่ไม่ใช้แล้ว' : 'Earn income from unused items',
        sustainableCommerce: lang === 'th' ? 'ซื้อขายอย่างยั่งยืน' : 'Buy & Sell Sustainably',
        ourValues: lang === 'th' ? 'ค่านิยมของเรา' : 'Our Values',
        valuesSubtitle: lang === 'th'
            ? 'ทุกสิ่งที่เราทำ ขับเคลื่อนด้วยค่านิยม 4 ประการ'
            : 'Everything we do is driven by 4 core values',
        valueSafe: lang === 'th' ? 'ปลอดภัย' : 'Safe',
        valueSafeDesc: lang === 'th' ? 'ระบบตรวจสอบด้วย AI ป้องกันมิจฉาชีพ' : 'AI verification system prevents fraud',
        valueFast: lang === 'th' ? 'รวดเร็ว' : 'Fast',
        valueFastDesc: lang === 'th' ? 'ลงขายได้ใน 30 วินาที ด้วย Snap & Sell' : 'List in 30 seconds with Snap & Sell',
        valueCare: lang === 'th' ? 'ใส่ใจ' : 'Caring',
        valueCareDesc: lang === 'th' ? 'ทีม Support พร้อมช่วยเหลือทุกปัญหา' : 'Support team ready to help with any issue',
        valueInnovation: lang === 'th' ? 'นวัตกรรม' : 'Innovation',
        valueInnovationDesc: lang === 'th' ? 'พัฒนาฟีเจอร์ใหม่ตลอดเวลา' : 'Constantly developing new features',
        technology: lang === 'th' ? 'เทคโนโลยี' : 'Technology',
        aiHelps: lang === 'th' ? 'AI ที่ช่วยคุณทุกขั้นตอน' : 'AI that helps you every step',
        snapSell: 'Snap & Sell',
        snapSellDesc: lang === 'th' ? 'ถ่ายรูปแล้วลงขายทันที AI จะช่วยกรอกข้อมูลให้อัตโนมัติ' : 'Take a photo and list instantly. AI fills in the details automatically.',
        priceAI: 'AI Price Suggestion',
        priceAIDesc: lang === 'th' ? 'แนะนำราคาที่เหมาะสมจากข้อมูลตลาดจริง' : 'Suggests appropriate prices from real market data',
        smartSearch: 'Smart Search',
        smartSearchDesc: lang === 'th' ? 'ค้นหาด้วยภาษาธรรมชาติ เช่น "iPhone สภาพดี งบ 20,000"' : 'Search with natural language like "iPhone good condition budget 20,000"',
        fraudDetection: 'Fraud Detection',
        fraudDetectionDesc: lang === 'th' ? 'AI ตรวจจับสินค้าปลอมและบัญชีมิจฉาชีพ' : 'AI detects fake products and fraudulent accounts',
        personalizedFeed: 'Personalized Feed',
        personalizedFeedDesc: lang === 'th' ? 'แนะนำสินค้าตามความสนใจของคุณ' : 'Recommends products based on your interests',
        autoTranslation: 'Auto Translation',
        autoTranslationDesc: lang === 'th' ? 'แปลภาษาอัตโนมัติสำหรับผู้ซื้อต่างชาติ' : 'Automatic translation for international buyers',
        ourJourney: lang === 'th' ? 'เส้นทางของเรา' : 'Our Journey',
        ourTeam: lang === 'th' ? 'ทีมของเรา' : 'Our Team',
        teamSubtitle: lang === 'th' ? 'ทีมที่หลงใหลในเทคโนโลยีและ E-commerce' : 'A team passionate about technology and E-commerce',
        readyToStart: lang === 'th' ? 'พร้อมเริ่มต้นกับ JaiKod?' : 'Ready to start with JaiKod?',
        ctaSubtitle: lang === 'th'
            ? 'สมัครฟรี เริ่มซื้อขายได้ทันที ไม่มีค่าใช้จ่ายแอบแฝง'
            : 'Sign up free, start trading immediately. No hidden fees.',
        signUp: lang === 'th' ? 'สมัครสมาชิก' : 'Sign Up',
        howToUse: lang === 'th' ? 'ดูวิธีใช้งาน' : 'How to Use',
    }

    const teamMembers = [
        {
            name: lang === 'th' ? 'ทีมผู้ก่อตั้ง' : 'Founders Team',
            role: 'Founders',
            avatar: '👨‍💼',
            description: lang === 'th' ? 'ผู้เชี่ยวชาญด้าน E-commerce และ AI' : 'E-commerce and AI experts'
        },
        {
            name: lang === 'th' ? 'ทีม Tech' : 'Tech Team',
            role: 'Engineering',
            avatar: '👨‍💻',
            description: lang === 'th' ? 'วิศวกรซอฟต์แวร์ระดับ Senior' : 'Senior software engineers'
        },
        {
            name: lang === 'th' ? 'ทีม Product' : 'Product Team',
            role: 'Product & Design',
            avatar: '🎨',
            description: lang === 'th' ? 'ออกแบบประสบการณ์ผู้ใช้' : 'Design user experience'
        },
        {
            name: lang === 'th' ? 'ทีม Trust & Safety' : 'Trust & Safety Team',
            role: 'Trust & Safety',
            avatar: '🛡️',
            description: lang === 'th' ? 'ดูแลความปลอดภัย' : 'Ensure platform safety'
        },
    ]

    const milestones = [
        {
            year: '2024',
            event: lang === 'th' ? 'ก่อตั้ง JaiKod' : 'JaiKod Founded',
            description: lang === 'th' ? 'เริ่มต้นพัฒนาแพลตฟอร์มด้วย AI' : 'Started developing AI-powered platform'
        },
        {
            year: '2024',
            event: lang === 'th' ? 'เปิดตัว Beta' : 'Beta Launch',
            description: lang === 'th' ? 'เปิดให้ผู้ใช้ทดลองใช้งาน' : 'Opened for user testing'
        },
        {
            year: '2025',
            event: 'Official Launch',
            description: lang === 'th' ? 'เปิดให้บริการอย่างเป็นทางการ' : 'Official public launch'
        },
        {
            year: '2025',
            event: lang === 'th' ? '100,000 Users' : '100,000 Users',
            description: lang === 'th' ? 'เป้าหมายผู้ใช้งานแสนคนแรก' : 'First 100K users milestone'
        },
    ]

    const values = [
        { icon: Shield, title: t.valueSafe, description: t.valueSafeDesc, color: 'from-blue-500 to-cyan-500' },
        { icon: Zap, title: t.valueFast, description: t.valueFastDesc, color: 'from-amber-500 to-orange-500' },
        { icon: Heart, title: t.valueCare, description: t.valueCareDesc, color: 'from-pink-500 to-rose-500' },
        { icon: Sparkles, title: t.valueInnovation, description: t.valueInnovationDesc, color: 'from-purple-500 to-indigo-500' },
    ]

    const aiFeatures = [
        { title: t.snapSell, icon: '📸', description: t.snapSellDesc },
        { title: t.priceAI, icon: '💰', description: t.priceAIDesc },
        { title: t.smartSearch, icon: '🔍', description: t.smartSearchDesc },
        { title: t.fraudDetection, icon: '🛡️', description: t.fraudDetectionDesc },
        { title: t.personalizedFeed, icon: '🎯', description: t.personalizedFeedDesc },
        { title: t.autoTranslation, icon: '🌐', description: t.autoTranslationDesc },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative py-20 bg-gradient-to-br from-neon-purple via-purple-600 to-coral-orange overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-6">
                            {t.aboutJaikod}
                        </h1>
                        <p className="text-xl text-white/80 max-w-3xl mx-auto">
                            {t.heroSubtitle}
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="text-neon-purple font-bold text-sm uppercase tracking-wider">{t.ourMission}</span>
                                <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-6">
                                    {t.missionTitle1}<br />
                                    <span className="text-gradient">{t.missionTitle2}</span>
                                </h2>
                                <p className="text-text-secondary dark:text-gray-400 text-lg leading-relaxed mb-6">
                                    {t.missionDesc}
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                                        <span className="font-medium">{t.check1}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                                        <span className="font-medium">{t.check2}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                                        <span className="font-medium">{t.check3}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-square rounded-3xl bg-gradient-to-br from-neon-purple/20 to-coral-orange/20 p-8 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-8xl mb-4">🌏</div>
                                        <h3 className="text-2xl font-bold mb-2">Sustainable Commerce</h3>
                                        <p className="text-text-secondary">{t.sustainableCommerce}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-16 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-display font-bold mb-4">{t.ourValues}</h2>
                            <p className="text-text-secondary dark:text-gray-400 max-w-2xl mx-auto">
                                {t.valuesSubtitle}
                            </p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-6">
                            {values.map((value, idx) => (
                                <div key={idx} className="text-center p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:shadow-lg transition-shadow">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${value.color} flex items-center justify-center text-white mx-auto mb-4`}>
                                        <value.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                    <p className="text-text-secondary dark:text-gray-400">{value.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* AI Features */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <span className="text-neon-purple font-bold text-sm uppercase tracking-wider">{t.technology}</span>
                            <h2 className="text-3xl font-display font-bold mt-2 mb-4">{t.aiHelps}</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {aiFeatures.map((feature, idx) => (
                                <div key={idx} className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                    <p className="text-text-secondary dark:text-gray-400">{feature.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Timeline */}
                <section className="py-16 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-display font-bold mb-4">{t.ourJourney}</h2>
                        </div>
                        <div className="max-w-3xl mx-auto">
                            {milestones.map((milestone, idx) => (
                                <div key={idx} className="flex gap-6 mb-8 last:mb-0">
                                    <div className="flex flex-col items-center">
                                        <div className="w-12 h-12 rounded-full bg-neon-purple flex items-center justify-center text-white font-bold">
                                            {idx + 1}
                                        </div>
                                        {idx < milestones.length - 1 && (
                                            <div className="w-0.5 h-full bg-gray-200 dark:bg-gray-700 mt-2"></div>
                                        )}
                                    </div>
                                    <div className="flex-1 pb-8">
                                        <span className="text-sm text-neon-purple font-bold">{milestone.year}</span>
                                        <h3 className="text-xl font-bold mb-1">{milestone.event}</h3>
                                        <p className="text-text-secondary dark:text-gray-400">{milestone.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-display font-bold mb-4">{t.ourTeam}</h2>
                            <p className="text-text-secondary dark:text-gray-400">{t.teamSubtitle}</p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-6">
                            {teamMembers.map((member, idx) => (
                                <div key={idx} className="text-center bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <div className="text-6xl mb-4">{member.avatar}</div>
                                    <h3 className="font-bold text-lg">{member.name}</h3>
                                    <p className="text-neon-purple text-sm font-medium mb-2">{member.role}</p>
                                    <p className="text-text-secondary dark:text-gray-400 text-sm">{member.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-16 bg-gradient-to-r from-neon-purple to-coral-orange">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-6">
                            {t.readyToStart}
                        </h2>
                        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                            {t.ctaSubtitle}
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/register">
                                <Button className="bg-white text-neon-purple hover:bg-gray-100 px-8 py-3">
                                    {t.signUp}
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/how-to-use">
                                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                                    {t.howToUse}
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


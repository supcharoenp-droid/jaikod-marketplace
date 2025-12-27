'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Search, ChevronDown, ChevronRight, HelpCircle } from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'

export default function FAQPage() {
    const { language } = useLanguage()
    const [openCategory, setOpenCategory] = useState<string | null>('general')
    const [searchQuery, setSearchQuery] = useState('')

    const t = {
        title: language === 'th' ? 'คำถามที่พบบ่อย' : 'Frequently Asked Questions',
        searchPlaceholder: language === 'th' ? 'ค้นหาคำถาม...' : 'Search questions...',
        stillHaveQuestions: language === 'th' ? 'ยังมีคำถาม?' : 'Still have questions?',
        contactTeam: language === 'th' ? 'ติดต่อทีม Support ของเราได้เลย' : 'Contact our Support team',
        contactUs: language === 'th' ? 'ติดต่อเรา' : 'Contact Us',
    }

    const faqCategories = language === 'th' ? [
        {
            id: 'general',
            title: '🏠 ทั่วไป',
            questions: [
                { q: 'JaiKod คืออะไร?', a: 'JaiKod คือตลาดซื้อขายสินค้ามือสองออนไลน์ที่ขับเคลื่อนด้วย AI ช่วยให้คุณซื้อขายได้ง่าย ปลอดภัย และรวดเร็ว' },
                { q: 'สมัครใช้งานฟรีไหม?', a: 'ฟรี! สมัครสมาชิกและลงขายสินค้าไม่เสียค่าใช้จ่าย มีค่าธรรมเนียมเฉพาะเมื่อขายได้เท่านั้น' },
                { q: 'JaiKod ต่างจาก Kaidee, Facebook Marketplace อย่างไร?', a: 'JaiKod ใช้ AI ช่วยในทุกขั้นตอน ตั้งแต่ลงขาย, แนะนำราคา, ตรวจจับมิจฉาชีพ และมีระบบ Escrow ป้องกันการโกง' },
            ]
        },
        {
            id: 'sell',
            title: '📦 การลงขาย',
            questions: [
                { q: 'ลงขายสินค้าอย่างไร?', a: '1. กดปุ่ม "ลงขาย" 2. ถ่ายรูปสินค้า 3. AI จะช่วยกรอกข้อมูลและแนะนำราคา 4. ตรวจสอบและกดลงประกาศ ใช้เวลาไม่ถึง 1 นาที!' },
                { q: 'ลงขายได้กี่รายการ?', a: 'ไม่จำกัด! สมาชิกทุกระดับสามารถลงขายได้ไม่จำกัดจำนวน' },
                { q: 'ลงขายสินค้าอะไรได้บ้าง?', a: 'สินค้ามือสองทั่วไป ยกเว้น: สินค้าผิดกฎหมาย, อาวุธ, ยา, สินค้าปลอม, บริการผิดศีลธรรม' },
                { q: 'AI แนะนำราคาทำงานอย่างไร?', a: 'AI วิเคราะห์จากราคาสินค้าที่คล้ายกันในตลาด, สภาพสินค้า, และความต้องการปัจจุบัน เพื่อแนะนำราคาที่เหมาะสม' },
            ]
        },
        {
            id: 'buy',
            title: '🛒 การซื้อ',
            questions: [
                { q: 'จะรู้ได้อย่างไรว่าผู้ขายน่าเชื่อถือ?', a: 'ดูจาก: 1. Badge ยืนยันตัวตน ✓ 2. คะแนนรีวิวจากผู้ซื้อคนอื่น 3. ประวัติการขาย 4. ระยะเวลาที่เป็นสมาชิก' },
                { q: 'ต่อราคาได้ไหม?', a: 'ได้! แชทกับผู้ขายเพื่อต่อราคาได้โดยตรง ระบบจะบันทึกราคาที่ตกลงกัน' },
                { q: 'นัดรับสินค้าได้ไหม?', a: 'ได้ หากผู้ขายเปิดให้รับเอง สามารถแชทนัดจุดรับได้ แนะนำให้นัดในที่สาธารณะที่ปลอดภัย' },
            ]
        },
        {
            id: 'payment',
            title: '💳 การชำระเงิน',
            questions: [
                { q: 'ชำระเงินได้วิธีไหนบ้าง?', a: 'รองรับ JaiStar (แนะนำ), บัตรเครดิต/เดบิต, PromptPay, และการโอนเงินผ่านธนาคาร' },
                { q: 'JaiStar คืออะไร?', a: 'JaiStar คือแต้ม (Point) สำหรับใช้โปรโมทสินค้า, ไฮไลท์การ์ด, และปลดล็อกฟีเจอร์พิเศษ JaiStar ไม่สามารถแลกคืนเป็นเงินได้' },
                { q: 'ถอนเงินอย่างไร?', a: 'ไปที่ JaiWallet > ถอนเงิน > ใส่จำนวนและบัญชีธนาคาร เงินจะเข้าภายใน 1-3 วันทำการ' },
                { q: 'ค่าธรรมเนียมเท่าไหร่?', a: 'ลงขายฟรี! ค่าธรรมเนียมหักเมื่อขายได้: Basic 5%, Plus 4%, Verified 3%, Premium 2%' },
            ]
        },
        {
            id: 'refund',
            title: '🔄 การคืนเงิน/ยกเลิก',
            questions: [
                { q: 'ถ้าสินค้าไม่ตรงปกทำอย่างไร?', a: 'แจ้งปัญหาภายใน 7 วันหลังได้รับสินค้า ทีมงานจะตรวจสอบและคืนเงินให้หากยืนยันว่าไม่ตรงปก' },
                { q: 'ไม่ได้รับสินค้าทำอย่างไร?', a: 'หาก 14 วันหลังชำระเงินยังไม่ได้รับสินค้า แจ้งเราเพื่อรับเงินคืนเต็มจำนวน' },
                { q: 'ยกเลิกคำสั่งซื้อได้ไหม?', a: 'ยกเลิกได้ก่อนผู้ขายจัดส่ง หลังจากนั้นต้องรอรับสินค้าแล้วยื่นคืน' },
            ]
        },
        {
            id: 'safety',
            title: '🛡️ ความปลอดภัย',
            questions: [
                { q: 'เจอมิจฉาชีพทำอย่างไร?', a: 'กดปุ่ม "รายงาน" ที่โปรไฟล์หรือสินค้า หรือแชทกับ @JaiKodSupport ทีมงานจะตรวจสอบทันที' },
                { q: 'Escrow คืออะไร?', a: 'ระบบพักเงิน - เมื่อคุณจ่าย เงินจะถูกพักไว้ที่ JaiKod และจะโอนให้ผู้ขายเมื่อคุณยืนยันรับสินค้าแล้ว' },
                { q: 'ถูกแฮ็กบัญชีทำอย่างไร?', a: 'ติดต่อ support@jaikod.com ทันที พร้อมแนบหลักฐานยืนยันตัวตน เราจะช่วยกู้คืนบัญชี' },
            ]
        },
    ] : [
        {
            id: 'general',
            title: '🏠 General',
            questions: [
                { q: 'What is JaiKod?', a: 'JaiKod is an AI-powered secondhand marketplace that makes buying and selling easy, safe, and fast.' },
                { q: 'Is it free to sign up?', a: 'Yes! Registration and listing are free. Fees are only charged when you make a sale.' },
                { q: 'How is JaiKod different from others?', a: 'JaiKod uses AI throughout - from listing, price suggestions, fraud detection, and has an Escrow system for protection.' },
            ]
        },
        {
            id: 'sell',
            title: '📦 Selling',
            questions: [
                { q: 'How do I list an item?', a: '1. Click "Sell" 2. Take a photo 3. AI fills details and suggests price 4. Review and publish - takes less than 1 minute!' },
                { q: 'How many items can I list?', a: 'Unlimited! All membership levels can list unlimited items.' },
                { q: 'What can I sell?', a: 'General secondhand items. Prohibited: illegal items, weapons, drugs, counterfeit goods, immoral services.' },
                { q: 'How does AI pricing work?', a: 'AI analyzes similar items in the market, condition, and current demand to suggest optimal pricing.' },
            ]
        },
        {
            id: 'buy',
            title: '🛒 Buying',
            questions: [
                { q: 'How do I know if a seller is trustworthy?', a: 'Check: 1. Verification Badge ✓ 2. Reviews from other buyers 3. Selling history 4. Membership duration' },
                { q: 'Can I negotiate prices?', a: 'Yes! Chat directly with sellers to negotiate. The system records agreed prices.' },
                { q: 'Can I pick up items in person?', a: 'Yes, if the seller allows. Chat to arrange a meetup. Recommend meeting in safe public places.' },
            ]
        },
        {
            id: 'payment',
            title: '💳 Payment',
            questions: [
                { q: 'What payment methods are accepted?', a: 'JaiStar (recommended), Credit/Debit cards, PromptPay, and bank transfer.' },
                { q: 'What is JaiStar?', a: 'JaiStar are points for promotions, highlights, and unlocking special features. JaiStar cannot be redeemed for cash.' },
                { q: 'How do I withdraw money?', a: 'Go to JaiWallet > Withdraw > Enter amount and bank account. Funds arrive within 1-3 business days.' },
                { q: 'What are the fees?', a: 'Listing is free! Fees when sold: Basic 5%, Plus 4%, Verified 3%, Premium 2%' },
            ]
        },
        {
            id: 'refund',
            title: '🔄 Refunds/Cancellations',
            questions: [
                { q: 'What if the item doesn\'t match?', a: 'Report within 7 days of receiving. Our team will review and refund if item doesn\'t match description.' },
                { q: 'What if I don\'t receive my item?', a: 'If not received 14 days after payment, contact us for a full refund.' },
                { q: 'Can I cancel an order?', a: 'You can cancel before the seller ships. After shipping, wait to receive and then request return.' },
            ]
        },
        {
            id: 'safety',
            title: '🛡️ Safety',
            questions: [
                { q: 'What if I encounter a scammer?', a: 'Click "Report" on the profile or listing, or chat with @JaiKodSupport. Our team will investigate immediately.' },
                { q: 'What is Escrow?', a: 'Payment holding system - when you pay, money is held by JaiKod until you confirm receipt.' },
                { q: 'What if my account is hacked?', a: 'Contact support@jaikod.com immediately with identity verification. We\'ll help recover your account.' },
            ]
        },
    ]

    const filteredCategories = faqCategories.map(cat => ({
        ...cat,
        questions: cat.questions.filter(q =>
            q.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            q.a.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(cat => cat.questions.length > 0 || searchQuery === '')

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-12 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <HelpCircle className="w-16 h-16 mx-auto mb-4" />
                        <h1 className="text-4xl font-display font-bold mb-4">{t.title}</h1>
                        <div className="max-w-xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={t.searchPlaceholder}
                                className="w-full pl-12 pr-4 py-3 rounded-xl text-gray-900 focus:ring-4 focus:ring-white/30 outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* FAQ List */}
                <section className="py-12">
                    <div className="container mx-auto px-4 max-w-4xl">
                        {filteredCategories.map((category) => (
                            <div key={category.id} className="mb-6" id={category.id}>
                                <button
                                    onClick={() => setOpenCategory(openCategory === category.id ? null : category.id)}
                                    className="w-full flex items-center justify-between p-4 bg-white dark:bg-surface-dark rounded-xl shadow-sm hover:shadow-md transition-all"
                                >
                                    <span className="text-xl font-bold">{category.title}</span>
                                    <ChevronDown className={`w-6 h-6 transition-transform ${openCategory === category.id ? 'rotate-180' : ''}`} />
                                </button>
                                {openCategory === category.id && (
                                    <div className="mt-2 space-y-2">
                                        {category.questions.map((item, idx) => (
                                            <details key={idx} className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm group">
                                                <summary className="font-medium cursor-pointer list-none flex items-center gap-2">
                                                    <ChevronRight className="w-5 h-5 text-neon-purple group-open:rotate-90 transition-transform" />
                                                    {item.q}
                                                </summary>
                                                <p className="mt-3 pl-7 text-text-secondary dark:text-gray-400">{item.a}</p>
                                            </details>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </section>

                {/* Contact */}
                <section className="py-12 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-2xl font-bold mb-4">{t.stillHaveQuestions}</h2>
                        <p className="text-text-secondary mb-6">{t.contactTeam}</p>
                        <Link href="/contact"><button className="bg-neon-purple text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-600">{t.contactUs}</button></Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

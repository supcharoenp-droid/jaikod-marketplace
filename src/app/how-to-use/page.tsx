'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    Camera, Tag, MessageCircle, CreditCard, Package, Star,
    ArrowRight, CheckCircle, Play, ChevronRight
} from 'lucide-react'
import Button from '@/components/ui/Button'

export default function HowToUsePage() {
    const buyerSteps = [
        { step: 1, title: 'ค้นหาสินค้า', description: 'ค้นหาสินค้าที่ต้องการ หรือถ่ายรูปเพื่อค้นหาด้วย AI', icon: '🔍' },
        { step: 2, title: 'เลือกสินค้า', description: 'ดูรายละเอียด รูปภาพ และรีวิวจากผู้ซื้อคนอื่น', icon: '👀' },
        { step: 3, title: 'แชทกับผู้ขาย', description: 'สอบถามรายละเอียดเพิ่มเติม ต่อราคา หรือนัดรับสินค้า', icon: '💬' },
        { step: 4, title: 'ชำระเงิน', description: 'เลือกวิธีชำระเงินที่สะดวก (JaiCoin, บัตร, โอน)', icon: '💳' },
        { step: 5, title: 'รับสินค้า', description: 'รอรับสินค้าที่บ้าน หรือนัดรับกับผู้ขาย', icon: '📦' },
        { step: 6, title: 'รีวิวผู้ขาย', description: 'ให้คะแนนและรีวิวเพื่อช่วยผู้ซื้อคนอื่น', icon: '⭐' },
    ]

    const sellerSteps = [
        { step: 1, title: 'ถ่ายรูปสินค้า', description: 'ถ่ายรูปสินค้าหลายมุม ให้เห็นสภาพชัดเจน', icon: '📸' },
        { step: 2, title: 'กรอกรายละเอียด', description: 'AI จะช่วยกรอกข้อมูลให้อัตโนมัติ คุณแค่ตรวจสอบ', icon: '📝' },
        { step: 3, title: 'ตั้งราคา', description: 'ใช้ AI Price Suggestion เพื่อตั้งราคาที่เหมาะสม', icon: '💰' },
        { step: 4, title: 'รอผู้ซื้อ', description: 'สินค้าจะแสดงในหน้าแรก และผลการค้นหา', icon: '⏳' },
        { step: 5, title: 'แชทตอบ', description: 'ตอบคำถามผู้ซื้อ นัดส่ง หรือรับออเดอร์', icon: '📱' },
        { step: 6, title: 'ส่งสินค้า', description: 'ส่งสินค้าให้ผู้ซื้อ หรือนัดรับที่จุดนัดพบ', icon: '🚚' },
    ]

    const tips = [
        { title: 'ถ่ายรูปให้ดี', description: 'รูปสว่าง ชัด หลายมุม เพิ่มโอกาสขายได้ 3 เท่า', icon: '📷' },
        { title: 'ตั้งราคาเหมาะสม', description: 'ใช้ AI แนะนำ อย่าตั้งสูงเกินไป', icon: '🏷️' },
        { title: 'ตอบเร็ว', description: 'ผู้ขายที่ตอบภายใน 1 ชม. ขายได้เร็วกว่า 5 เท่า', icon: '⚡' },
        { title: 'ซื่อสัตย์', description: 'บอกสภาพสินค้าตามจริง สร้างความน่าเชื่อถือ', icon: '🤝' },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-16 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                            วิธีการใช้งาน JaiKod
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                            เริ่มต้นซื้อขายได้ง่ายๆ ใน 6 ขั้นตอน
                        </p>
                        <div className="flex justify-center gap-4">
                            <Button className="bg-white text-blue-600 hover:bg-gray-100">
                                <Play className="w-5 h-5 mr-2" />
                                ดูวิดีโอสอนใช้งาน
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Buyer Steps */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <span className="text-blue-500 font-bold text-sm uppercase tracking-wider">สำหรับผู้ซื้อ</span>
                            <h2 className="text-3xl font-display font-bold mt-2 mb-4">วิธีซื้อสินค้า</h2>
                            <p className="text-text-secondary dark:text-gray-400">ซื้อของมือสองคุณภาพดี ราคาถูก ง่ายใน 6 ขั้นตอน</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {buyerSteps.map((step, idx) => (
                                <div key={idx} className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 relative overflow-hidden group hover:shadow-lg transition-all">
                                    <div className="absolute -top-4 -right-4 text-8xl text-gray-100 dark:text-gray-800 font-bold group-hover:scale-110 transition-transform">
                                        {step.step}
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-4xl mb-4">{step.icon}</div>
                                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-text-secondary dark:text-gray-400">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Seller Steps */}
                <section className="py-16 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <span className="text-emerald-500 font-bold text-sm uppercase tracking-wider">สำหรับผู้ขาย</span>
                            <h2 className="text-3xl font-display font-bold mt-2 mb-4">วิธีลงขายสินค้า</h2>
                            <p className="text-text-secondary dark:text-gray-400">ลงขายได้ใน 30 วินาที ด้วย Snap & Sell</p>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sellerSteps.map((step, idx) => (
                                <div key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 relative overflow-hidden group hover:shadow-lg transition-all">
                                    <div className="absolute -top-4 -right-4 text-8xl text-gray-200 dark:text-gray-700 font-bold group-hover:scale-110 transition-transform">
                                        {step.step}
                                    </div>
                                    <div className="relative z-10">
                                        <div className="text-4xl mb-4">{step.icon}</div>
                                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                        <p className="text-text-secondary dark:text-gray-400">{step.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tips Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-display font-bold mb-4">💡 เคล็ดลับขายดี</h2>
                            <p className="text-text-secondary dark:text-gray-400">ทำตามนี้ ขายได้เร็วขึ้น!</p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-6">
                            {tips.map((tip, idx) => (
                                <div key={idx} className="text-center p-6">
                                    <div className="text-5xl mb-4">{tip.icon}</div>
                                    <h3 className="font-bold text-lg mb-2">{tip.title}</h3>
                                    <p className="text-text-secondary dark:text-gray-400 text-sm">{tip.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-16 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-display font-bold mb-4">คำถามที่พบบ่อย</h2>
                        </div>
                        <div className="max-w-3xl mx-auto space-y-4">
                            {[
                                { q: 'ลงขายสินค้าเสียค่าใช้จ่ายไหม?', a: 'ลงขายฟรี! ไม่เสียค่าใช้จ่ายในการลงประกาศ มีค่าธรรมเนียมเฉพาะเมื่อขายได้เท่านั้น' },
                                { q: 'จะรู้ได้อย่างไรว่าผู้ขายน่าเชื่อถือ?', a: 'ดูจาก Badge ที่ผ่านการยืนยันตัวตน, คะแนนรีวิว, และประวัติการขาย' },
                                { q: 'ถ้าสินค้าไม่ตรงปกทำอย่างไร?', a: 'แจ้งเราภายใน 7 วัน ทีม Trust & Safety จะช่วยไกล่เกลี่ยและคืนเงินให้หากจำเป็น' },
                                { q: 'รับเงินจากการขายอย่างไร?', a: 'เงินจะเข้า JaiWallet ของคุณ สามารถถอนเข้าบัญชีธนาคารได้ตลอด 24 ชม.' },
                            ].map((faq, idx) => (
                                <details key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 group">
                                    <summary className="font-bold cursor-pointer list-none flex items-center justify-between">
                                        {faq.q}
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                                    </summary>
                                    <p className="mt-3 text-text-secondary dark:text-gray-400">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-gradient-to-r from-blue-500 to-cyan-500">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
                        <p className="text-white/80 mb-8">สมัครฟรี เริ่มซื้อขายได้ทันที!</p>
                        <div className="flex justify-center gap-4">
                            <Link href="/sell">
                                <Button className="bg-white text-blue-600 hover:bg-gray-100">
                                    ลงขายสินค้า
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/">
                                <Button variant="outline" className="border-white text-white hover:bg-white/10">
                                    เริ่มช้อปปิ้ง
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

'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Search, MessageCircle, Package, CreditCard, Shield, User, HelpCircle, ChevronRight, ExternalLink, Phone, Mail } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function HelpPage() {
    const [searchQuery, setSearchQuery] = useState('')

    const categories = [
        { icon: User, title: 'บัญชีผู้ใช้', desc: 'สมัคร, เข้าสู่ระบบ, แก้ไขโปรไฟล์', link: '/help/account', color: 'bg-blue-500' },
        { icon: Package, title: 'การซื้อ-ขาย', desc: 'ลงขาย, ซื้อสินค้า, จัดส่ง', link: '/help/trading', color: 'bg-emerald-500' },
        { icon: CreditCard, title: 'การชำระเงิน', desc: 'JaiCoin, ถอนเงิน, ค่าธรรมเนียม', link: '/help/payment', color: 'bg-amber-500' },
        { icon: Shield, title: 'ความปลอดภัย', desc: 'รายงาน, มิจฉาชีพ, คืนเงิน', link: '/help/safety', color: 'bg-red-500' },
        { icon: MessageCircle, title: 'การแชท', desc: 'ส่งข้อความ, บล็อก, รายงาน', link: '/help/chat', color: 'bg-purple-500' },
        { icon: HelpCircle, title: 'อื่นๆ', desc: 'ปัญหาทั่วไป, ข้อเสนอแนะ', link: '/help/other', color: 'bg-gray-500' },
    ]

    const popularQuestions = [
        { q: 'ลงขายสินค้าอย่างไร?', link: '/faq#sell' },
        { q: 'ค่าธรรมเนียมเท่าไหร่?', link: '/fees' },
        { q: 'ถ้าไม่ได้รับสินค้าทำอย่างไร?', link: '/faq#refund' },
        { q: 'วิธียืนยันตัวตน', link: '/faq#verify' },
        { q: 'ถอนเงินอย่างไร?', link: '/faq#withdraw' },
        { q: 'แจ้งมิจฉาชีพอย่างไร?', link: '/safety' },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-16 bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
                    <div className="container mx-auto px-4 text-center">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">ศูนย์ช่วยเหลือ</h1>
                        <p className="text-xl text-white/80 mb-8">มีคำถามอะไรไหม? เราพร้อมช่วยเหลือคุณ</p>
                        {/* Search */}
                        <div className="max-w-2xl mx-auto relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="ค้นหาคำถาม เช่น 'วิธีลงขาย' หรือ 'ถอนเงิน'"
                                className="w-full pl-14 pr-6 py-4 rounded-2xl text-gray-900 text-lg focus:ring-4 focus:ring-white/30 outline-none"
                            />
                        </div>
                    </div>
                </section>

                {/* Categories */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-6">หมวดหมู่</h2>
                        <div className="grid md:grid-cols-3 gap-4">
                            {categories.map((cat, idx) => (
                                <Link key={idx} href={cat.link} className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all flex items-start gap-4 group">
                                    <div className={`w-12 h-12 rounded-xl ${cat.color} flex items-center justify-center text-white`}>
                                        <cat.icon className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg group-hover:text-neon-purple transition-colors">{cat.title}</h3>
                                        <p className="text-sm text-text-secondary">{cat.desc}</p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-neon-purple transition-colors" />
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Popular Questions */}
                <section className="py-12 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-6">คำถามยอดนิยม</h2>
                        <div className="grid md:grid-cols-2 gap-4">
                            {popularQuestions.map((q, idx) => (
                                <Link key={idx} href={q.link} className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                                    <HelpCircle className="w-5 h-5 text-neon-purple" />
                                    <span className="flex-1">{q.q}</span>
                                    <ChevronRight className="w-5 h-5 text-gray-400" />
                                </Link>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link href="/faq">
                                <Button variant="outline">ดูคำถามทั้งหมด <ChevronRight className="w-4 h-4 ml-1" /></Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Contact Options */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold mb-6">ยังหาคำตอบไม่เจอ? ติดต่อเราได้เลย</h2>
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 text-center shadow-sm">
                                <div className="w-16 h-16 rounded-full bg-neon-purple/10 flex items-center justify-center text-neon-purple mx-auto mb-4">
                                    <MessageCircle className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">แชทกับเรา</h3>
                                <p className="text-sm text-text-secondary mb-4">ตอบกลับเร็วที่สุด ในวันและเวลาทำการ</p>
                                <Button variant="primary" className="w-full">เริ่มแชท</Button>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 text-center shadow-sm">
                                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mx-auto mb-4">
                                    <Mail className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">ส่งอีเมล</h3>
                                <p className="text-sm text-text-secondary mb-4">ตอบกลับภายใน 24 ชั่วโมง</p>
                                <Button variant="outline" className="w-full">support@jaikod.com</Button>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 text-center shadow-sm">
                                <div className="w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto mb-4">
                                    <Phone className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">โทรหาเรา</h3>
                                <p className="text-sm text-text-secondary mb-4">จ-ศ 9:00-18:00 น.</p>
                                <Button variant="outline" className="w-full">02-XXX-XXXX</Button>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

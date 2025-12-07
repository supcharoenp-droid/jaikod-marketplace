'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Camera, Tag, MessageCircle, CreditCard, Package, Star, ArrowRight, CheckCircle, Play, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function HowItWorksPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-20 bg-gradient-to-br from-neon-purple via-purple-600 to-coral-orange text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <h1 className="text-4xl md:text-6xl font-display font-bold mb-6">
                            JaiKod ทำงานอย่างไร?
                        </h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
                            ซื้อขายของมือสองง่ายๆ ด้วย AI ที่ช่วยคุณทุกขั้นตอน
                        </p>
                        <Button className="bg-white text-neon-purple hover:bg-gray-100">
                            <Play className="w-5 h-5 mr-2" />
                            ดูวิดีโอสอนใช้งาน
                        </Button>
                    </div>
                </section>

                {/* 3 Simple Steps */}
                <section className="py-20 -mt-10">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                { step: 1, icon: '📸', title: 'ถ่ายรูป', desc: 'ถ่ายรูปสินค้าที่ต้องการขาย AI จะช่วยกรอกข้อมูลและแนะนำราคาให้อัตโนมัติ', color: 'from-blue-500 to-cyan-500' },
                                { step: 2, icon: '💬', title: 'แชท', desc: 'แชทกับผู้ซื้อ/ผู้ขาย ต่อราคา นัดรับสินค้า ทุกอย่างจบในแอปเดียว', color: 'from-purple-500 to-pink-500' },
                                { step: 3, icon: '✅', title: 'เสร็จสิ้น', desc: 'ชำระเงินผ่าน JaiCoin ปลอดภัย มีระบบ Escrow คุ้มครองทั้งสองฝ่าย', color: 'from-emerald-500 to-green-500' },
                            ].map((item) => (
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
                                <span className="text-emerald-500 font-bold text-sm uppercase tracking-wider">สำหรับผู้ขาย</span>
                                <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-6">
                                    ลงขายได้ใน <span className="text-gradient">30 วินาที</span>
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        { icon: Camera, text: 'ถ่ายรูปสินค้า - AI จะจดจำและกรอกข้อมูลให้' },
                                        { icon: Tag, text: 'AI แนะนำราคาจากข้อมูลตลาดจริง' },
                                        { icon: Sparkles, text: 'ระบบโปรโมทให้สินค้าเข้าถึงผู้ซื้อ' },
                                        { icon: CreditCard, text: 'รับเงินเข้า JaiWallet ถอนได้ทันที' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl">
                                            <item.icon className="w-6 h-6 text-emerald-500" />
                                            <span className="font-medium">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/sell" className="inline-block mt-6">
                                    <Button variant="primary" size="lg">
                                        เริ่มลงขายเลย
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
                                <span className="text-blue-500 font-bold text-sm uppercase tracking-wider">สำหรับผู้ซื้อ</span>
                                <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-6">
                                    ค้นหาของดีราคาถูก <span className="text-gradient">ได้ง่ายๆ</span>
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        { icon: '🔍', text: 'ค้นหาด้วยภาษาธรรมชาติ เช่น "iPhone งบ 20,000"' },
                                        { icon: '📷', text: 'ค้นหาด้วยรูปภาพ - ถ่ายรูปของที่อยากได้' },
                                        { icon: '🎯', text: 'AI แนะนำสินค้าตามความสนใจของคุณ' },
                                        { icon: '🛡️', text: 'ระบบ Buyer Protection คุ้มครองทุกการซื้อ' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
                                            <span className="text-2xl">{item.icon}</span>
                                            <span className="font-medium">{item.text}</span>
                                        </div>
                                    ))}
                                </div>
                                <Link href="/" className="inline-block mt-6">
                                    <Button variant="primary" size="lg">
                                        เริ่มช้อปปิ้ง
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
                            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">AI ที่ช่วยคุณทุกขั้นตอน</h2>
                            <p className="text-gray-400 max-w-2xl mx-auto">เทคโนโลยี AI ล้ำสมัยที่ทำให้การซื้อขายง่ายขึ้น</p>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { icon: '📸', title: 'AI Image Recognition', desc: 'จดจำสินค้าจากรูปภาพ กรอกข้อมูลให้อัตโนมัติ' },
                                { icon: '💰', title: 'AI Price Suggestion', desc: 'แนะนำราคาที่เหมาะสมจากข้อมูลตลาดจริง' },
                                { icon: '🔍', title: 'Smart Search', desc: 'ค้นหาด้วยภาษาธรรมชาติ เข้าใจสิ่งที่คุณต้องการ' },
                                { icon: '🛡️', title: 'Fraud Detection', desc: 'ตรวจจับมิจฉาชีพและสินค้าปลอมอัตโนมัติ' },
                                { icon: '🎯', title: 'Personalization', desc: 'แนะนำสินค้าตามความสนใจและพฤติกรรม' },
                                { icon: '💬', title: 'Smart Reply', desc: 'แนะนำข้อความตอบกลับอัตโนมัติ' },
                            ].map((feature, idx) => (
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
                        <h2 className="text-3xl font-bold mb-8">ปลอดภัย 100%</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {[
                                { value: '99.5%', label: 'ธุรกรรมปลอดภัย' },
                                { value: 'Escrow', label: 'ระบบพักเงิน' },
                                { value: '24/7', label: 'ทีมดูแล' },
                                { value: '7 วัน', label: 'รับประกันคืนเงิน' },
                            ].map((stat, idx) => (
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
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">พร้อมเริ่มต้นแล้วหรือยัง?</h2>
                        <p className="text-white/80 text-lg mb-8">สมัครฟรี ลงขายฟรี จ่ายเมื่อขายได้เท่านั้น!</p>
                        <div className="flex justify-center gap-4 flex-wrap">
                            <Link href="/register">
                                <Button className="bg-white text-neon-purple hover:bg-gray-100 px-8 py-3">
                                    สมัครสมาชิก
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/sell">
                                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                                    ลงขายสินค้า
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

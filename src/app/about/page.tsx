'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import {
    Users, Target, Heart, Sparkles, Shield, Zap,
    Award, Globe, Rocket, CheckCircle, ArrowRight
} from 'lucide-react'
import Button from '@/components/ui/Button'

export default function AboutPage() {
    const teamMembers = [
        { name: 'ทีมผู้ก่อตั้ง', role: 'Founders', avatar: '👨‍💼', description: 'ผู้เชี่ยวชาญด้าน E-commerce และ AI' },
        { name: 'ทีม Tech', role: 'Engineering', avatar: '👨‍💻', description: 'วิศวกรซอฟต์แวร์ระดับ Senior' },
        { name: 'ทีม Product', role: 'Product & Design', avatar: '🎨', description: 'ออกแบบประสบการณ์ผู้ใช้' },
        { name: 'ทีม Trust & Safety', role: 'Trust & Safety', avatar: '🛡️', description: 'ดูแลความปลอดภัย' },
    ]

    const milestones = [
        { year: '2024', event: 'ก่อตั้ง JaiKod', description: 'เริ่มต้นพัฒนาแพลตฟอร์มด้วย AI' },
        { year: '2024', event: 'เปิดตัว Beta', description: 'เปิดให้ผู้ใช้ทดลองใช้งาน' },
        { year: '2025', event: 'Official Launch', description: 'เปิดให้บริการอย่างเป็นทางการ' },
        { year: '2025', event: '100,000 Users', description: 'เป้าหมายผู้ใช้งานแสนคนแรก' },
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
                            เกี่ยวกับ JaiKod
                        </h1>
                        <p className="text-xl text-white/80 max-w-3xl mx-auto">
                            ตลาดซื้อขายของมือสองที่ขับเคลื่อนด้วย AI ปลอดภัย ง่าย และทันสมัยที่สุดในประเทศไทย
                        </p>
                    </div>
                </section>

                {/* Mission Section */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <span className="text-neon-purple font-bold text-sm uppercase tracking-wider">พันธกิจของเรา</span>
                                <h2 className="text-3xl md:text-4xl font-display font-bold mt-2 mb-6">
                                    ทำให้การซื้อขายของมือสอง<br />
                                    <span className="text-gradient">เป็นเรื่องง่ายสำหรับทุกคน</span>
                                </h2>
                                <p className="text-text-secondary dark:text-gray-400 text-lg leading-relaxed mb-6">
                                    JaiKod เกิดจากความเชื่อที่ว่า ของดีไม่จำเป็นต้องซื้อใหม่เสมอไป เราอยากสร้างแพลตฟอร์มที่ทำให้คนไทย
                                    สามารถซื้อขายสินค้ามือสองได้อย่างมั่นใจ ปลอดภัย และสะดวกสบาย ด้วยเทคโนโลยี AI ที่ทันสมัย
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                                        <span className="font-medium">ลดขยะ รักษ์โลก ด้วยการใช้ของซ้ำ</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                                        <span className="font-medium">ประหยัดเงิน ได้ของดีราคาถูก</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-emerald-500" />
                                        <span className="font-medium">สร้างรายได้ จากของที่ไม่ใช้แล้ว</span>
                                    </div>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="aspect-square rounded-3xl bg-gradient-to-br from-neon-purple/20 to-coral-orange/20 p-8 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-8xl mb-4">🌏</div>
                                        <h3 className="text-2xl font-bold mb-2">Sustainable Commerce</h3>
                                        <p className="text-text-secondary">ซื้อขายอย่างยั่งยืน</p>
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
                            <h2 className="text-3xl font-display font-bold mb-4">ค่านิยมของเรา</h2>
                            <p className="text-text-secondary dark:text-gray-400 max-w-2xl mx-auto">
                                ทุกสิ่งที่เราทำ ขับเคลื่อนด้วยค่านิยม 4 ประการ
                            </p>
                        </div>
                        <div className="grid md:grid-cols-4 gap-6">
                            {[
                                { icon: Shield, title: 'ปลอดภัย', description: 'ระบบตรวจสอบด้วย AI ป้องกันมิจฉาชีพ', color: 'from-blue-500 to-cyan-500' },
                                { icon: Zap, title: 'รวดเร็ว', description: 'ลงขายได้ใน 30 วินาที ด้วย Snap & Sell', color: 'from-amber-500 to-orange-500' },
                                { icon: Heart, title: 'ใส่ใจ', description: 'ทีม Support พร้อมช่วยเหลือทุกปัญหา', color: 'from-pink-500 to-rose-500' },
                                { icon: Sparkles, title: 'นวัตกรรม', description: 'พัฒนาฟีเจอร์ใหม่ตลอดเวลา', color: 'from-purple-500 to-indigo-500' },
                            ].map((value, idx) => (
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
                            <span className="text-neon-purple font-bold text-sm uppercase tracking-wider">เทคโนโลยี</span>
                            <h2 className="text-3xl font-display font-bold mt-2 mb-4">AI ที่ช่วยคุณทุกขั้นตอน</h2>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                { title: 'Snap & Sell', icon: '📸', description: 'ถ่ายรูปแล้วลงขายทันที AI จะช่วยกรอกข้อมูลให้อัตโนมัติ' },
                                { title: 'AI Price Suggestion', icon: '💰', description: 'แนะนำราคาที่เหมาะสมจากข้อมูลตลาดจริง' },
                                { title: 'Smart Search', icon: '🔍', description: 'ค้นหาด้วยภาษาธรรมชาติ เช่น "iPhone สภาพดี งบ 20,000"' },
                                { title: 'Fraud Detection', icon: '🛡️', description: 'AI ตรวจจับสินค้าปลอมและบัญชีมิจฉาชีพ' },
                                { title: 'Personalized Feed', icon: '🎯', description: 'แนะนำสินค้าตามความสนใจของคุณ' },
                                { title: 'Auto Translation', icon: '🌐', description: 'แปลภาษาอัตโนมัติสำหรับผู้ซื้อต่างชาติ' },
                            ].map((feature, idx) => (
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
                            <h2 className="text-3xl font-display font-bold mb-4">เส้นทางของเรา</h2>
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
                            <h2 className="text-3xl font-display font-bold mb-4">ทีมของเรา</h2>
                            <p className="text-text-secondary dark:text-gray-400">ทีมที่หลงใหลในเทคโนโลยีและ E-commerce</p>
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
                            พร้อมเริ่มต้นกับ JaiKod?
                        </h2>
                        <p className="text-white/80 text-lg mb-8 max-w-2xl mx-auto">
                            สมัครฟรี เริ่มซื้อขายได้ทันที ไม่มีค่าใช้จ่ายแอบแฝง
                        </p>
                        <div className="flex items-center justify-center gap-4">
                            <Link href="/register">
                                <Button className="bg-white text-neon-purple hover:bg-gray-100 px-8 py-3">
                                    สมัครสมาชิก
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link href="/how-to-use">
                                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3">
                                    ดูวิธีใช้งาน
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

'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Shield, ShieldCheck, Lock, Eye, UserCheck, AlertTriangle, CheckCircle, Flag, MessageSquare, Phone } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function SafetyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-16 bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-center">
                    <div className="container mx-auto px-4">
                        <Shield className="w-20 h-20 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">ความปลอดภัยบน JaiKod</h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">เราใส่ใจความปลอดภัยของคุณ ด้วยระบบป้องกันหลายชั้น</p>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">ระบบความปลอดภัย 4 ชั้น</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm flex gap-4">
                                <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center text-white"><Shield className="w-7 h-7" /></div>
                                <div><h3 className="text-xl font-bold mb-2">Buyer Protection</h3><p className="text-text-secondary">ระบบคุ้มครองผู้ซื้อ รับประกันเงินคืนหากสินค้าไม่ตรงปก หรือไม่ได้รับสินค้าภายใน 7 วัน</p></div>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm flex gap-4">
                                <div className="w-14 h-14 rounded-xl bg-emerald-500 flex items-center justify-center text-white"><UserCheck className="w-7 h-7" /></div>
                                <div><h3 className="text-xl font-bold mb-2">Verified Sellers</h3><p className="text-text-secondary">ผู้ขายที่ผ่านการยืนยันตัวตนด้วยบัตรประชาชน จะได้รับ Badge ✓ แสดงความน่าเชื่อถือ</p></div>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm flex gap-4">
                                <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center text-white"><Eye className="w-7 h-7" /></div>
                                <div><h3 className="text-xl font-bold mb-2">AI Fraud Detection</h3><p className="text-text-secondary">ระบบ AI ตรวจจับสินค้าปลอม บัญชีมิจฉาชีพ และพฤติกรรมน่าสงสัยตลอด 24 ชม.</p></div>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm flex gap-4">
                                <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center text-white"><Lock className="w-7 h-7" /></div>
                                <div><h3 className="text-xl font-bold mb-2">Secure Payment</h3><p className="text-text-secondary">การชำระเงินผ่าน JaiCoin มีระบบ Escrow เงินจะถูกพักไว้จนกว่าผู้ซื้อจะยืนยันรับสินค้า</p></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Warnings */}
                <section className="py-16 bg-red-50 dark:bg-red-900/10">
                    <div className="container mx-auto px-4 text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-red-600 mb-8">⚠️ สัญญาณเตือนมิจฉาชีพ</h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-red-200">
                                <div className="text-4xl mb-3">💸</div>
                                <h3 className="font-bold text-red-600 mb-2">ราคาถูกเกินจริง</h3>
                                <p className="text-sm text-text-secondary">iPhone 15 ราคา 5,000? น่าสงสัย!</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-red-200">
                                <div className="text-4xl mb-3">🚫</div>
                                <h3 className="font-bold text-red-600 mb-2">ขอคุยนอกแอป</h3>
                                <p className="text-sm text-text-secondary">บอกให้โอนเงินตรง ระวัง!</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-red-200">
                                <div className="text-4xl mb-3">⚠️</div>
                                <h3 className="font-bold text-red-600 mb-2">รีบโอน ไม่ให้ถาม</h3>
                                <p className="text-sm text-text-secondary">บอกว่ามีคนจองแล้ว รีบๆ</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-red-200">
                                <div className="text-4xl mb-3">🎭</div>
                                <h3 className="font-bold text-red-600 mb-2">ไม่แสดงสินค้าจริง</h3>
                                <p className="text-sm text-text-secondary">ไม่ยอมวิดีโอคอลดูของ</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tips */}
                <section className="py-16 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">✅ เคล็ดลับซื้อขายปลอดภัย</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold mb-4">1. ตรวจสอบผู้ขาย</h3>
                                <ul className="space-y-2">{['ดู Badge ยืนยันตัวตน', 'ดูคะแนนและรีวิว', 'ดูประวัติการขาย'].map((t, i) => <li key={i} className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /><span className="text-text-secondary">{t}</span></li>)}</ul>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold mb-4">2. ก่อนโอนเงิน</h3>
                                <ul className="space-y-2">{['แชทสอบถามให้ชัด', 'ขอรูป/วิดีโอสินค้าจริง', 'ใช้ JaiCoin เท่านั้น'].map((t, i) => <li key={i} className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /><span className="text-text-secondary">{t}</span></li>)}</ul>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold mb-4">3. เมื่อรับสินค้า</h3>
                                <ul className="space-y-2">{['ถ่ายวิดีโอตอนแกะกล่อง', 'ตรวจสอบให้ละเอียด', 'แจ้งปัญหาภายใน 7 วัน'].map((t, i) => <li key={i} className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-emerald-500" /><span className="text-text-secondary">{t}</span></li>)}</ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Report */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">พบปัญหาหรือมิจฉาชีพ?</h2>
                            <p className="text-white/80 mb-6">แจ้งเราได้ทันที ทีม Trust & Safety พร้อมช่วยเหลือ 24 ชม.</p>
                            <div className="flex justify-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2"><Flag className="w-5 h-5" /><span>กดปุ่ม &quot;รายงาน&quot;</span></div>
                                <div className="flex items-center gap-2"><MessageSquare className="w-5 h-5" /><span>แชท @JaiKodSupport</span></div>
                                <div className="flex items-center gap-2"><Phone className="w-5 h-5" /><span>โทร 02-XXX-XXXX</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-16 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div><div className="text-4xl font-bold text-neon-purple mb-2">99.5%</div><div className="text-text-secondary">ธุรกรรมปลอดภัย</div></div>
                            <div><div className="text-4xl font-bold text-neon-purple mb-2">&lt; 1%</div><div className="text-text-secondary">อัตราร้องเรียน</div></div>
                            <div><div className="text-4xl font-bold text-neon-purple mb-2">24/7</div><div className="text-text-secondary">ทีมดูแลความปลอดภัย</div></div>
                            <div><div className="text-4xl font-bold text-neon-purple mb-2">&lt; 2 ชม.</div><div className="text-text-secondary">เวลาตอบกลับเฉลี่ย</div></div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

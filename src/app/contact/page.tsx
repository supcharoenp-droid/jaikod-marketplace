'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' })
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitted(true)
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-16 bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-center">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">ติดต่อเรา</h1>
                        <p className="text-xl text-white/80">พร้อมให้บริการและช่วยเหลือคุณทุกวัน</p>
                    </div>
                </section>

                {/* Contact Info */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-4 gap-6 mb-12">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 text-center shadow-sm">
                                <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 mx-auto mb-4">
                                    <MessageCircle className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold mb-2">Live Chat</h3>
                                <p className="text-sm text-text-secondary mb-2">ตอบเร็วที่สุด</p>
                                <p className="text-neon-purple font-medium">เปิด 24/7</p>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 text-center shadow-sm">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 mx-auto mb-4">
                                    <Mail className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold mb-2">อีเมล</h3>
                                <p className="text-sm text-text-secondary mb-2">ตอบภายใน 24 ชม.</p>
                                <p className="text-neon-purple font-medium">support@jaikod.com</p>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 text-center shadow-sm">
                                <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 mx-auto mb-4">
                                    <Phone className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold mb-2">โทรศัพท์</h3>
                                <p className="text-sm text-text-secondary mb-2">จ-ศ 9:00-18:00</p>
                                <p className="text-neon-purple font-medium">02-XXX-XXXX</p>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 text-center shadow-sm">
                                <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 mx-auto mb-4">
                                    <MapPin className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold mb-2">สำนักงาน</h3>
                                <p className="text-sm text-text-secondary mb-2">กรุงเทพมหานคร</p>
                                <p className="text-neon-purple font-medium">ถนนสุขุมวิท</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-lg">
                                <h2 className="text-2xl font-bold mb-6 text-center">ส่งข้อความถึงเรา</h2>
                                {isSubmitted ? (
                                    <div className="text-center py-12">
                                        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold mb-2">ส่งข้อความสำเร็จ!</h3>
                                        <p className="text-text-secondary">เราจะติดต่อกลับภายใน 24 ชั่วโมง</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">ชื่อ-นามสกุล *</label>
                                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-neon-purple outline-none" placeholder="ชื่อของคุณ" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">อีเมล *</label>
                                                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-neon-purple outline-none" placeholder="email@example.com" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">หัวข้อ *</label>
                                            <select required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-neon-purple outline-none">
                                                <option value="">เลือกหัวข้อ</option>
                                                <option value="general">สอบถามทั่วไป</option>
                                                <option value="bug">แจ้งปัญหาการใช้งาน</option>
                                                <option value="payment">เรื่องการชำระเงิน</option>
                                                <option value="refund">ขอคืนเงิน</option>
                                                <option value="report">แจ้งมิจฉาชีพ</option>
                                                <option value="partnership">ความร่วมมือทางธุรกิจ</option>
                                                <option value="other">อื่นๆ</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">ข้อความ *</label>
                                            <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-neon-purple outline-none resize-none" placeholder="รายละเอียดที่ต้องการแจ้ง..."></textarea>
                                        </div>
                                        <Button type="submit" variant="primary" className="w-full" size="lg">
                                            <Send className="w-5 h-5 mr-2" />
                                            ส่งข้อความ
                                        </Button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Office Hours */}
                <section className="py-12 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4 text-center">
                        <Clock className="w-12 h-12 text-neon-purple mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-6">เวลาทำการ</h2>
                        <div className="max-w-md mx-auto space-y-3">
                            <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span>Live Chat</span>
                                <span className="font-bold text-emerald-500">24/7</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span>อีเมล Support</span>
                                <span className="font-bold">ตอบภายใน 24 ชม.</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span>โทรศัพท์</span>
                                <span className="font-bold">จ-ศ 9:00-18:00</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

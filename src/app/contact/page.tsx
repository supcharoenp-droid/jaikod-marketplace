'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Mail, Phone, MapPin, MessageCircle, Clock, Send, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

const translations = {
    th: {
        title: 'ติดต่อเรา',
        subtitle: 'พร้อมให้บริการและช่วยเหลือคุณทุกวัน',
        liveChat: 'แชทสด',
        fastestResponse: 'ตอบเร็วที่สุด',
        open247: 'เปิด 24/7',
        email: 'อีเมล',
        responseIn24h: 'ตอบภายใน 24 ชม.',
        phone: 'โทรศัพท์',
        weekdays: 'จ-ศ 9:00-18:00',
        office: 'สำนักงาน',
        bangkok: 'กรุงเทพมหานคร',
        sukhumvit: 'ถนนสุขุมวิท',
        sendMessage: 'ส่งข้อความถึงเรา',
        messageSent: 'ส่งข้อความสำเร็จ!',
        willContactIn24h: 'เราจะติดต่อกลับภายใน 24 ชั่วโมง',
        fullName: 'ชื่อ-นามสกุล *',
        namePlaceholder: 'ชื่อของคุณ',
        emailLabel: 'อีเมล *',
        subject: 'หัวข้อ *',
        selectSubject: 'เลือกหัวข้อ',
        general: 'สอบถามทั่วไป',
        bug: 'แจ้งปัญหาการใช้งาน',
        payment: 'เรื่องการชำระเงิน',
        refund: 'ขอคืนเงิน',
        report: 'แจ้งมิจฉาชีพ',
        partnership: 'ความร่วมมือทางธุรกิจ',
        other: 'อื่นๆ',
        message: 'ข้อความ *',
        messagePlaceholder: 'รายละเอียดที่ต้องการแจ้ง...',
        sendBtn: 'ส่งข้อความ',
        officeHours: 'เวลาทำการ',
        emailSupport: 'อีเมล Support',
    },
    en: {
        title: 'Contact Us',
        subtitle: 'Ready to help you every day',
        liveChat: 'Live Chat',
        fastestResponse: 'Fastest response',
        open247: 'Open 24/7',
        email: 'Email',
        responseIn24h: 'Reply within 24 hrs',
        phone: 'Phone',
        weekdays: 'Mon-Fri 9:00-18:00',
        office: 'Office',
        bangkok: 'Bangkok',
        sukhumvit: 'Sukhumvit Road',
        sendMessage: 'Send Us a Message',
        messageSent: 'Message Sent!',
        willContactIn24h: 'We will contact you within 24 hours',
        fullName: 'Full Name *',
        namePlaceholder: 'Your name',
        emailLabel: 'Email *',
        subject: 'Subject *',
        selectSubject: 'Select subject',
        general: 'General inquiry',
        bug: 'Report a bug',
        payment: 'Payment issues',
        refund: 'Refund request',
        report: 'Report scammer',
        partnership: 'Business partnership',
        other: 'Other',
        message: 'Message *',
        messagePlaceholder: 'Details you want to share...',
        sendBtn: 'Send Message',
        officeHours: 'Office Hours',
        emailSupport: 'Email Support',
    }
}

export default function ContactPage() {
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th
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
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{t.title}</h1>
                        <p className="text-xl text-white/80">{t.subtitle}</p>
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
                                <h3 className="font-bold mb-2">{t.liveChat}</h3>
                                <p className="text-sm text-text-secondary mb-2">{t.fastestResponse}</p>
                                <p className="text-neon-purple font-medium">{t.open247}</p>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 text-center shadow-sm">
                                <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 mx-auto mb-4">
                                    <Mail className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold mb-2">{t.email}</h3>
                                <p className="text-sm text-text-secondary mb-2">{t.responseIn24h}</p>
                                <p className="text-neon-purple font-medium">support@jaikod.com</p>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 text-center shadow-sm">
                                <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 mx-auto mb-4">
                                    <Phone className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold mb-2">{t.phone}</h3>
                                <p className="text-sm text-text-secondary mb-2">{t.weekdays}</p>
                                <p className="text-neon-purple font-medium">02-XXX-XXXX</p>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 text-center shadow-sm">
                                <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-500 mx-auto mb-4">
                                    <MapPin className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold mb-2">{t.office}</h3>
                                <p className="text-sm text-text-secondary mb-2">{t.bangkok}</p>
                                <p className="text-neon-purple font-medium">{t.sukhumvit}</p>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-white dark:bg-surface-dark rounded-3xl p-8 shadow-lg">
                                <h2 className="text-2xl font-bold mb-6 text-center">{t.sendMessage}</h2>
                                {isSubmitted ? (
                                    <div className="text-center py-12">
                                        <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                                        <h3 className="text-xl font-bold mb-2">{t.messageSent}</h3>
                                        <p className="text-text-secondary">{t.willContactIn24h}</p>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium mb-2">{t.fullName}</label>
                                                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-neon-purple outline-none" placeholder={t.namePlaceholder} />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium mb-2">{t.emailLabel}</label>
                                                <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-neon-purple outline-none" placeholder="email@example.com" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t.subject}</label>
                                            <select required value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-neon-purple outline-none">
                                                <option value="">{t.selectSubject}</option>
                                                <option value="general">{t.general}</option>
                                                <option value="bug">{t.bug}</option>
                                                <option value="payment">{t.payment}</option>
                                                <option value="refund">{t.refund}</option>
                                                <option value="report">{t.report}</option>
                                                <option value="partnership">{t.partnership}</option>
                                                <option value="other">{t.other}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-2">{t.message}</label>
                                            <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-neon-purple outline-none resize-none" placeholder={t.messagePlaceholder}></textarea>
                                        </div>
                                        <Button type="submit" variant="primary" className="w-full" size="lg">
                                            <Send className="w-5 h-5 mr-2" />
                                            {t.sendBtn}
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
                        <h2 className="text-2xl font-bold mb-6">{t.officeHours}</h2>
                        <div className="max-w-md mx-auto space-y-3">
                            <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span>{t.liveChat}</span>
                                <span className="font-bold text-emerald-500">24/7</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span>{t.emailSupport}</span>
                                <span className="font-bold">{t.responseIn24h}</span>
                            </div>
                            <div className="flex justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <span>{t.phone}</span>
                                <span className="font-bold">{t.weekdays}</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

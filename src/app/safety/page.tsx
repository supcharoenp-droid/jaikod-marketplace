'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Shield, ShieldCheck, Lock, Eye, UserCheck, AlertTriangle, CheckCircle, Flag, MessageSquare, Phone } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useLanguage } from '@/contexts/LanguageContext'

const translations = {
    th: {
        heroTitle: 'ความปลอดภัยบน JaiKod',
        heroSubtitle: 'เราใส่ใจความปลอดภัยของคุณ ด้วยระบบป้องกันหลายชั้น',
        safetyLayers: 'ระบบความปลอดภัย 4 ชั้น',
        buyerProtection: 'คุ้มครองผู้ซื้อ',
        buyerProtectionDesc: 'ระบบคุ้มครองผู้ซื้อ รับประกันเงินคืนหากสินค้าไม่ตรงปก หรือไม่ได้รับสินค้าภายใน 7 วัน',
        verifiedSellers: 'ผู้ขายยืนยันตัวตน',
        verifiedSellersDesc: 'ผู้ขายที่ผ่านการยืนยันตัวตนด้วยบัตรประชาชน จะได้รับ Badge ✓ แสดงความน่าเชื่อถือ',
        aiFraudDetection: 'ตรวจจับมิจฉาชีพ AI',
        aiFraudDetectionDesc: 'ระบบ AI ตรวจจับสินค้าปลอม บัญชีมิจฉาชีพ และพฤติกรรมน่าสงสัยตลอด 24 ชม.',
        securePayment: 'ชำระเงินปลอดภัย',
        securePaymentDesc: 'การชำระเงินผ่าน JaiStar มีระบบ Escrow เงินจะถูกพักไว้จนกว่าผู้ซื้อจะยืนยันรับสินค้า',
        warningTitle: '⚠️ สัญญาณเตือนมิจฉาชีพ',
        warn1Title: 'ราคาถูกเกินจริง',
        warn1Desc: 'iPhone 15 ราคา 5,000? น่าสงสัย!',
        warn2Title: 'ขอคุยนอกแอป',
        warn2Desc: 'บอกให้โอนเงินตรง ระวัง!',
        warn3Title: 'รีบโอน ไม่ให้ถาม',
        warn3Desc: 'บอกว่ามีคนจองแล้ว รีบๆ',
        warn4Title: 'ไม่แสดงสินค้าจริง',
        warn4Desc: 'ไม่ยอมวิดีโอคอลดูของ',
        tipsTitle: '✅ เคล็ดลับซื้อขายปลอดภัย',
        tip1Title: '1. ตรวจสอบผู้ขาย',
        tip1Items: ['ดู Badge ยืนยันตัวตน', 'ดูคะแนนและรีวิว', 'ดูประวัติการขาย'],
        tip2Title: '2. ก่อนโอนเงิน',
        tip2Items: ['แชทสอบถามให้ชัด', 'ขอรูป/วิดีโอสินค้าจริง', 'ใช้ JaiStar เท่านั้น'],
        tip3Title: '3. เมื่อรับสินค้า',
        tip3Items: ['ถ่ายวิดีโอตอนแกะกล่อง', 'ตรวจสอบให้ละเอียด', 'แจ้งปัญหาภายใน 7 วัน'],
        reportTitle: 'พบปัญหาหรือมิจฉาชีพ?',
        reportSubtitle: 'แจ้งเราได้ทันที ทีม Trust & Safety พร้อมช่วยเหลือ 24 ชม.',
        reportButton: 'กดปุ่ม "รายงาน"',
        chatSupport: 'แชท @JaiKodSupport',
        callSupport: 'โทร 02-XXX-XXXX',
        stat1: 'ธุรกรรมปลอดภัย',
        stat2: 'อัตราร้องเรียน',
        stat3: 'ทีมดูแลความปลอดภัย',
        stat4: 'เวลาตอบกลับเฉลี่ย',
        stat4Value: '< 2 ชม.',
    },
    en: {
        heroTitle: 'Safety on JaiKod',
        heroSubtitle: 'We care about your safety with multi-layer protection systems',
        safetyLayers: '4-Layer Safety System',
        buyerProtection: 'Buyer Protection',
        buyerProtectionDesc: 'Money-back guarantee if item doesn\'t match description or not received within 7 days',
        verifiedSellers: 'Verified Sellers',
        verifiedSellersDesc: 'Sellers verified with ID get a ✓ Badge showing trustworthiness',
        aiFraudDetection: 'AI Fraud Detection',
        aiFraudDetectionDesc: 'AI system detects fake products, scam accounts, and suspicious behavior 24/7',
        securePayment: 'Secure Payment',
        securePaymentDesc: 'JaiStar payment with Escrow holds funds until buyer confirms receipt',
        warningTitle: '⚠️ Scam Warning Signs',
        warn1Title: 'Too Good To Be True',
        warn1Desc: 'iPhone 15 for ฿5,000? Suspicious!',
        warn2Title: 'Chat Outside App',
        warn2Desc: 'Asks for direct transfer. Be careful!',
        warn3Title: 'Rushing Payment',
        warn3Desc: 'Says someone else is buying. Hurry!',
        warn4Title: 'Won\'t Show Real Item',
        warn4Desc: 'Refuses video call to show product',
        tipsTitle: '✅ Safe Trading Tips',
        tip1Title: '1. Check the Seller',
        tip1Items: ['Check verification Badge', 'Check ratings and reviews', 'Check selling history'],
        tip2Title: '2. Before Payment',
        tip2Items: ['Chat and ask questions', 'Request actual photos/videos', 'Use JaiStar only'],
        tip3Title: '3. Upon Receiving',
        tip3Items: ['Record unboxing video', 'Inspect thoroughly', 'Report issues within 7 days'],
        reportTitle: 'Found a Problem or Scammer?',
        reportSubtitle: 'Report to us immediately. Trust & Safety team available 24/7.',
        reportButton: 'Click "Report" button',
        chatSupport: 'Chat @JaiKodSupport',
        callSupport: 'Call 02-XXX-XXXX',
        stat1: 'Safe Transactions',
        stat2: 'Complaint Rate',
        stat3: 'Safety Team',
        stat4: 'Avg Response Time',
        stat4Value: '< 2 hrs',
    }
}

export default function SafetyPage() {
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-16 bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-center">
                    <div className="container mx-auto px-4">
                        <Shield className="w-20 h-20 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">{t.heroTitle}</h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">{t.heroSubtitle}</p>
                    </div>
                </section>

                {/* Features */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">{t.safetyLayers}</h2>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm flex gap-4">
                                <div className="w-14 h-14 rounded-xl bg-blue-500 flex items-center justify-center text-white"><Shield className="w-7 h-7" /></div>
                                <div><h3 className="text-xl font-bold mb-2">{t.buyerProtection}</h3><p className="text-text-secondary">{t.buyerProtectionDesc}</p></div>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm flex gap-4">
                                <div className="w-14 h-14 rounded-xl bg-emerald-500 flex items-center justify-center text-white"><UserCheck className="w-7 h-7" /></div>
                                <div><h3 className="text-xl font-bold mb-2">{t.verifiedSellers}</h3><p className="text-text-secondary">{t.verifiedSellersDesc}</p></div>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm flex gap-4">
                                <div className="w-14 h-14 rounded-xl bg-purple-500 flex items-center justify-center text-white"><Eye className="w-7 h-7" /></div>
                                <div><h3 className="text-xl font-bold mb-2">{t.aiFraudDetection}</h3><p className="text-text-secondary">{t.aiFraudDetectionDesc}</p></div>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm flex gap-4">
                                <div className="w-14 h-14 rounded-xl bg-amber-500 flex items-center justify-center text-white"><Lock className="w-7 h-7" /></div>
                                <div><h3 className="text-xl font-bold mb-2">{t.securePayment}</h3><p className="text-text-secondary">{t.securePaymentDesc}</p></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Warnings */}
                <section className="py-16 bg-red-50 dark:bg-red-900/10">
                    <div className="container mx-auto px-4 text-center">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                        <h2 className="text-3xl font-bold text-red-600 mb-8">{t.warningTitle}</h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-red-200">
                                <div className="text-4xl mb-3">💸</div>
                                <h3 className="font-bold text-red-600 mb-2">{t.warn1Title}</h3>
                                <p className="text-sm text-text-secondary">{t.warn1Desc}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-red-200">
                                <div className="text-4xl mb-3">🚫</div>
                                <h3 className="font-bold text-red-600 mb-2">{t.warn2Title}</h3>
                                <p className="text-sm text-text-secondary">{t.warn2Desc}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-red-200">
                                <div className="text-4xl mb-3">⚠️</div>
                                <h3 className="font-bold text-red-600 mb-2">{t.warn3Title}</h3>
                                <p className="text-sm text-text-secondary">{t.warn3Desc}</p>
                            </div>
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 border-red-200">
                                <div className="text-4xl mb-3">🎭</div>
                                <h3 className="font-bold text-red-600 mb-2">{t.warn4Title}</h3>
                                <p className="text-sm text-text-secondary">{t.warn4Desc}</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tips */}
                <section className="py-16 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">{t.tipsTitle}</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold mb-4">{t.tip1Title}</h3>
                                <ul className="space-y-2">
                                    {t.tip1Items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                            <span className="text-text-secondary">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold mb-4">{t.tip2Title}</h3>
                                <ul className="space-y-2">
                                    {t.tip2Items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                            <span className="text-text-secondary">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6">
                                <h3 className="text-xl font-bold mb-4">{t.tip3Title}</h3>
                                <ul className="space-y-2">
                                    {t.tip3Items.map((item, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                                            <span className="text-text-secondary">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Report */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-3xl p-8 md:p-12 text-white text-center">
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">{t.reportTitle}</h2>
                            <p className="text-white/80 mb-6">{t.reportSubtitle}</p>
                            <div className="flex justify-center gap-4 flex-wrap">
                                <div className="flex items-center gap-2"><Flag className="w-5 h-5" /><span>{t.reportButton}</span></div>
                                <div className="flex items-center gap-2"><MessageSquare className="w-5 h-5" /><span>{t.chatSupport}</span></div>
                                <div className="flex items-center gap-2"><Phone className="w-5 h-5" /><span>{t.callSupport}</span></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats */}
                <section className="py-16 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div><div className="text-4xl font-bold text-neon-purple mb-2">99.5%</div><div className="text-text-secondary">{t.stat1}</div></div>
                            <div><div className="text-4xl font-bold text-neon-purple mb-2">&lt; 1%</div><div className="text-text-secondary">{t.stat2}</div></div>
                            <div><div className="text-4xl font-bold text-neon-purple mb-2">24/7</div><div className="text-text-secondary">{t.stat3}</div></div>
                            <div><div className="text-4xl font-bold text-neon-purple mb-2">{t.stat4Value}</div><div className="text-text-secondary">{t.stat4}</div></div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

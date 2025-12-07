'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { Check, X, ArrowRight, Sparkles, Crown, Zap, Star, HelpCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(false)

    const plans = [
        {
            name: 'Basic',
            icon: '🆓',
            price: { monthly: 0, yearly: 0 },
            description: 'เริ่มต้นใช้งานฟรี',
            color: 'from-gray-400 to-gray-500',
            features: [
                { text: 'ลงขายไม่จำกัด', included: true },
                { text: 'ค่าธรรมเนียม 5%', included: true },
                { text: 'แชทกับผู้ซื้อ', included: true },
                { text: 'AI Price Suggestion', included: true },
                { text: 'โปรโมทสินค้า', included: false },
                { text: 'Badge ยืนยัน', included: false },
                { text: 'Analytics', included: false },
                { text: 'ลงขายหมวด Premium', included: false },
            ],
            cta: 'เริ่มต้นฟรี',
            popular: false,
        },
        {
            name: 'Plus',
            icon: '⚡',
            price: { monthly: 99, yearly: 990 },
            description: 'สำหรับผู้ขายตัวจริง',
            color: 'from-blue-500 to-cyan-500',
            features: [
                { text: 'ลงขายไม่จำกัด', included: true },
                { text: 'ค่าธรรมเนียม 4%', included: true },
                { text: 'แชทกับผู้ซื้อ', included: true },
                { text: 'AI Price Suggestion', included: true },
                { text: 'โปรโมท 5 ครั้ง/เดือน', included: true },
                { text: 'Badge ยืนยัน', included: false },
                { text: 'Analytics พื้นฐาน', included: true },
                { text: 'ลงขายหมวด Premium', included: false },
            ],
            cta: 'เลือก Plus',
            popular: false,
        },
        {
            name: 'Verified',
            icon: '✅',
            price: { monthly: 299, yearly: 2990 },
            description: 'สร้างความน่าเชื่อถือ',
            color: 'from-neon-purple to-purple-600',
            features: [
                { text: 'ลงขายไม่จำกัด', included: true },
                { text: 'ค่าธรรมเนียม 3%', included: true },
                { text: 'แชทกับผู้ซื้อ', included: true },
                { text: 'AI Price Suggestion', included: true },
                { text: 'โปรโมท 20 ครั้ง/เดือน', included: true },
                { text: 'Badge ✓ ยืนยันตัวตน', included: true },
                { text: 'Analytics ขั้นสูง', included: true },
                { text: 'ลงขายหมวด Premium', included: true },
            ],
            cta: 'เลือก Verified',
            popular: true,
        },
        {
            name: 'Premium',
            icon: '👑',
            price: { monthly: 799, yearly: 7990 },
            description: 'สำหรับร้านค้ามืออาชีพ',
            color: 'from-amber-500 to-orange-500',
            features: [
                { text: 'ลงขายไม่จำกัด', included: true },
                { text: 'ค่าธรรมเนียม 2% ต่ำสุด!', included: true },
                { text: 'แชทกับผู้ซื้อ', included: true },
                { text: 'AI Price Suggestion', included: true },
                { text: 'โปรโมทไม่จำกัด', included: true },
                { text: 'Badge 👑 Premium', included: true },
                { text: 'Analytics + รายงาน', included: true },
                { text: 'หน้าร้านค้าเต็มรูปแบบ', included: true },
            ],
            cta: 'เลือก Premium',
            popular: false,
        },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-16 text-center">
                    <div className="container mx-auto px-4">
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            เลือกแพ็กเกจที่<span className="text-gradient">เหมาะกับคุณ</span>
                        </h1>
                        <p className="text-xl text-text-secondary dark:text-gray-400 max-w-2xl mx-auto mb-8">
                            ลงขายฟรี จ่ายเมื่อขายได้ หรืออัปเกรดเพื่อลดค่าธรรมเนียมและได้สิทธิพิเศษ
                        </p>

                        {/* Toggle */}
                        <div className="flex items-center justify-center gap-4 mb-12">
                            <span className={`font-medium ${!isYearly ? 'text-neon-purple' : 'text-gray-500'}`}>รายเดือน</span>
                            <button
                                onClick={() => setIsYearly(!isYearly)}
                                className={`w-14 h-8 rounded-full p-1 transition-colors ${isYearly ? 'bg-neon-purple' : 'bg-gray-300'}`}
                            >
                                <div className={`w-6 h-6 rounded-full bg-white shadow-md transition-transform ${isYearly ? 'translate-x-6' : ''}`}></div>
                            </button>
                            <span className={`font-medium ${isYearly ? 'text-neon-purple' : 'text-gray-500'}`}>
                                รายปี <span className="text-emerald-500 text-sm">(ประหยัด 17%)</span>
                            </span>
                        </div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="pb-16">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {plans.map((plan) => (
                                <div
                                    key={plan.name}
                                    className={`relative bg-white dark:bg-surface-dark rounded-3xl p-6 shadow-xl border-2 ${plan.popular ? 'border-neon-purple scale-105' : 'border-gray-100 dark:border-gray-800'
                                        }`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-neon-purple text-white px-4 py-1 rounded-full text-sm font-bold">
                                            ยอดนิยม
                                        </div>
                                    )}
                                    <div className="text-center mb-6">
                                        <div className="text-5xl mb-3">{plan.icon}</div>
                                        <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                                        <p className="text-sm text-text-secondary dark:text-gray-400">{plan.description}</p>
                                    </div>
                                    <div className="text-center mb-6">
                                        <div className="flex items-baseline justify-center gap-1">
                                            <span className="text-4xl font-bold">
                                                ฿{isYearly ? plan.price.yearly.toLocaleString() : plan.price.monthly.toLocaleString()}
                                            </span>
                                            <span className="text-text-secondary">/{isYearly ? 'ปี' : 'เดือน'}</span>
                                        </div>
                                        {plan.price.monthly === 0 && <span className="text-emerald-500 font-medium">ฟรีตลอดชีพ</span>}
                                    </div>
                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2">
                                                {feature.included ? (
                                                    <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                ) : (
                                                    <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                                )}
                                                <span className={feature.included ? '' : 'text-gray-400'}>{feature.text}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <Link href={plan.price.monthly === 0 ? '/register' : '/upgrade'}>
                                        <Button
                                            variant={plan.popular ? 'primary' : 'outline'}
                                            className="w-full"
                                        >
                                            {plan.cta}
                                            <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Compare */}
                <section className="py-16 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">เปรียบเทียบแพ็กเกจ</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full max-w-5xl mx-auto text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="py-4 px-4 text-left">ฟีเจอร์</th>
                                        <th className="py-4 px-4 text-center">🆓 Basic</th>
                                        <th className="py-4 px-4 text-center">⚡ Plus</th>
                                        <th className="py-4 px-4 text-center bg-neon-purple/5">✅ Verified</th>
                                        <th className="py-4 px-4 text-center">👑 Premium</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['ค่าธรรมเนียมขาย', '5%', '4%', '3%', '2%'],
                                        ['ลงขาย', 'ไม่จำกัด', 'ไม่จำกัด', 'ไม่จำกัด', 'ไม่จำกัด'],
                                        ['โปรโมทสินค้า', '฿29/ครั้ง', '5 ครั้ง/เดือน', '20 ครั้ง/เดือน', 'ไม่จำกัด'],
                                        ['Badge', '-', '-', '✓ Verified', '👑 Premium'],
                                        ['Analytics', '-', 'พื้นฐาน', 'ขั้นสูง', 'ขั้นสูง + รายงาน'],
                                        ['หน้าร้านค้า', '-', '-', 'พื้นฐาน', 'เต็มรูปแบบ'],
                                        ['Priority Support', '-', '-', 'Email', '24/7 Chat'],
                                    ].map((row, idx) => (
                                        <tr key={idx} className="border-b">
                                            <td className="py-3 px-4 font-medium">{row[0]}</td>
                                            <td className="py-3 px-4 text-center">{row[1]}</td>
                                            <td className="py-3 px-4 text-center">{row[2]}</td>
                                            <td className="py-3 px-4 text-center bg-neon-purple/5 font-bold text-neon-purple">{row[3]}</td>
                                            <td className="py-3 px-4 text-center">{row[4]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">คำถามที่พบบ่อย</h2>
                        <div className="max-w-3xl mx-auto space-y-4">
                            {[
                                { q: 'ยกเลิกสมาชิกได้ไหม?', a: 'ได้ครับ สามารถยกเลิกได้ทุกเมื่อ ไม่มีค่าธรรมเนียมยกเลิก' },
                                { q: 'เปลี่ยนแพ็กเกจได้ไหม?', a: 'ได้ครับ สามารถอัปเกรดหรือดาวน์เกรดได้ตลอดเวลา' },
                                { q: 'ชำระเงินได้วิธีไหนบ้าง?', a: 'รองรับ บัตรเครดิต/เดบิต, PromptPay, และ JaiCoin' },
                                { q: 'มีคืนเงินไหม?', a: 'มี! รับประกันคืนเงินภายใน 7 วัน หากไม่พอใจ' },
                            ].map((faq, idx) => (
                                <details key={idx} className="bg-white dark:bg-surface-dark rounded-xl p-5 shadow-sm">
                                    <summary className="font-bold cursor-pointer flex items-center gap-2">
                                        <HelpCircle className="w-5 h-5 text-neon-purple" />
                                        {faq.q}
                                    </summary>
                                    <p className="mt-3 text-text-secondary pl-7">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="py-16 bg-gradient-to-r from-neon-purple to-coral-orange">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">ยังไม่แน่ใจ?</h2>
                        <p className="text-white/80 mb-8">เริ่มต้นฟรี ไม่ต้องใส่บัตรเครดิต อัปเกรดได้ทุกเมื่อ</p>
                        <Link href="/register">
                            <Button className="bg-white text-neon-purple hover:bg-gray-100 px-8 py-3">
                                เริ่มต้นฟรีเลย
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}

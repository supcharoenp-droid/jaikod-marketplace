'use client'

import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { CheckCircle, XCircle, ArrowRight, Calculator, HelpCircle } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function FeesPage() {
    const feeStructure = [
        { type: 'ค่าลงประกาศ', basic: 'ฟรี', plus: 'ฟรี', verified: 'ฟรี', premium: 'ฟรี' },
        { type: 'ค่าธรรมเนียมขาย', basic: '5%', plus: '4%', verified: '3%', premium: '2%' },
        { type: 'ขั้นต่ำต่อรายการ', basic: '฿10', plus: '฿10', verified: '฿10', premium: '฿10' },
        { type: 'ค่าถอนเงิน', basic: 'ฟรี', plus: 'ฟรี', verified: 'ฟรี', premium: 'ฟรี' },
        { type: 'โปรโมทสินค้า', basic: '฿29/วัน', plus: '฿19/วัน', verified: '฿9/วัน', premium: 'ฟรี 10 ครั้ง/เดือน' },
    ]

    const examples = [
        { price: 100, fee: 10, net: 90, note: 'ค่าธรรมเนียมขั้นต่ำ ฿10' },
        { price: 500, fee: 25, net: 475, note: '5% ของ ฿500' },
        { price: 1000, fee: 50, net: 950, note: '5% ของ ฿1,000' },
        { price: 5000, fee: 250, net: 4750, note: '5% ของ ฿5,000' },
        { price: 10000, fee: 500, net: 9500, note: '5% ของ ฿10,000' },
        { price: 50000, fee: 2500, net: 47500, note: '5% ของ ฿50,000' },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="py-16 bg-gradient-to-br from-amber-500 to-orange-500 text-white text-center">
                    <div className="container mx-auto px-4">
                        <Calculator className="w-16 h-16 mx-auto mb-6" />
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">ค่าธรรมเนียม JaiKod</h1>
                        <p className="text-xl text-white/80 max-w-2xl mx-auto">โปร่งใส ชัดเจน ไม่มีค่าใช้จ่ายแอบแฝง</p>
                    </div>
                </section>

                {/* Key Points */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 text-center shadow-sm">
                                <div className="text-4xl mb-4">🆓</div>
                                <h3 className="text-xl font-bold mb-2">ลงขายฟรี!</h3>
                                <p className="text-text-secondary">ไม่เสียค่าใช้จ่ายในการลงประกาศ ไม่จำกัดจำนวน</p>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 text-center shadow-sm">
                                <div className="text-4xl mb-4">💰</div>
                                <h3 className="text-xl font-bold mb-2">จ่ายเมื่อขายได้</h3>
                                <p className="text-text-secondary">มีค่าธรรมเนียมเฉพาะเมื่อขายสินค้าสำเร็จ</p>
                            </div>
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 text-center shadow-sm">
                                <div className="text-4xl mb-4">📊</div>
                                <h3 className="text-xl font-bold mb-2">โปร่งใส</h3>
                                <p className="text-text-secondary">แสดงค่าธรรมเนียมชัดเจนก่อนยืนยันขาย</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Fee Table */}
                <section className="py-12 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">ตารางค่าธรรมเนียม</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full max-w-4xl mx-auto">
                                <thead>
                                    <tr className="border-b border-gray-200 dark:border-gray-700">
                                        <th className="py-4 px-4 text-left font-bold">ประเภท</th>
                                        <th className="py-4 px-4 text-center font-bold">Basic<br /><span className="font-normal text-sm text-gray-500">ฟรี</span></th>
                                        <th className="py-4 px-4 text-center font-bold">Plus<br /><span className="font-normal text-sm text-gray-500">฿99/เดือน</span></th>
                                        <th className="py-4 px-4 text-center font-bold bg-neon-purple/5">Verified<br /><span className="font-normal text-sm text-neon-purple">฿299/เดือน</span></th>
                                        <th className="py-4 px-4 text-center font-bold">Premium<br /><span className="font-normal text-sm text-gray-500">฿799/เดือน</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {feeStructure.map((row, idx) => (
                                        <tr key={idx} className="border-b border-gray-100 dark:border-gray-800">
                                            <td className="py-4 px-4 font-medium">{row.type}</td>
                                            <td className="py-4 px-4 text-center">{row.basic}</td>
                                            <td className="py-4 px-4 text-center">{row.plus}</td>
                                            <td className="py-4 px-4 text-center bg-neon-purple/5 font-bold text-neon-purple">{row.verified}</td>
                                            <td className="py-4 px-4 text-center">{row.premium}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="text-center mt-8">
                            <Link href="/upgrade">
                                <Button variant="primary">อัปเกรดเพื่อลดค่าธรรมเนียม <ArrowRight className="w-4 h-4 ml-2" /></Button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Examples */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">ตัวอย่างการคำนวณ</h2>
                        <p className="text-center text-text-secondary mb-8">(สำหรับบัญชี Basic - 5%)</p>
                        <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                            {examples.map((ex, idx) => (
                                <div key={idx} className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-text-secondary">ราคาขาย</span>
                                        <span className="font-bold">฿{ex.price.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between mb-2 text-red-500">
                                        <span>ค่าธรรมเนียม</span>
                                        <span>-฿{ex.fee.toLocaleString()}</span>
                                    </div>
                                    <div className="border-t pt-2 flex justify-between">
                                        <span className="font-bold">รับสุทธิ</span>
                                        <span className="font-bold text-emerald-500">฿{ex.net.toLocaleString()}</span>
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">{ex.note}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* No Hidden Fees */}
                <section className="py-12 bg-emerald-50 dark:bg-emerald-900/10">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-8 text-emerald-700">✅ ไม่มีค่าใช้จ่ายแอบแฝง</h2>
                        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
                            {[
                                'ค่าสมัครสมาชิก',
                                'ค่าแสดงสินค้า',
                                'ค่าต่ออายุประกาศ',
                                'ค่าธรรมเนียมรายเดือน (Basic)',
                                'ค่าดูข้อมูลผู้ซื้อ',
                                'ค่าถอนเงินเข้าบัญชี',
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3 bg-white dark:bg-gray-800 rounded-lg p-3">
                                    <XCircle className="w-5 h-5 text-emerald-500" />
                                    <span>ไม่มี{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* FAQ */}
                <section className="py-12 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-8">คำถามที่พบบ่อย</h2>
                        <div className="max-w-3xl mx-auto space-y-4">
                            {[
                                { q: 'ค่าธรรมเนียมหักจากไหน?', a: 'หักจากยอดขายอัตโนมัติ ก่อนโอนเข้า JaiWallet ของคุณ' },
                                { q: 'ถ้าผู้ซื้อยกเลิกต้องจ่ายไหม?', a: 'ไม่ต้องจ่าย! ค่าธรรมเนียมหักเฉพาะธุรกรรมที่สำเร็จเท่านั้น' },
                                { q: 'ภาษีมูลค่าเพิ่ม (VAT) รวมแล้วหรือยัง?', a: 'ค่าธรรมเนียมที่แสดงรวม VAT 7% เรียบร้อยแล้ว' },
                                { q: 'มีค่าธรรมเนียมขั้นต่ำไหม?', a: 'มีขั้นต่ำ ฿10 ต่อรายการ สำหรับสินค้าราคาต่ำกว่า ฿200' },
                            ].map((faq, idx) => (
                                <details key={idx} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5">
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
            </main>
            <Footer />
        </div>
    )
}

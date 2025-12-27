'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { useLanguage } from '@/contexts/LanguageContext'
import {
    Shield, ShieldCheck, ShieldAlert, AlertTriangle, CheckCircle, XCircle,
    User, Store, FileText, Clock, Star, Award, TrendingUp, Eye, MessageCircle
} from 'lucide-react'
import Button from '@/components/ui/Button'

const translations = {
    th: {
        title: 'ระบบคะแนนความน่าเชื่อถือ',
        subtitle: 'AI วิเคราะห์ความน่าเชื่อถือของผู้ขายและผู้ซื้อ ปกป้องคุณจากมิจฉาชีพ',
        checkTrust: 'ตรวจสอบความน่าเชื่อถือ',
        enterUserId: 'กรอก User ID หรือ Shop ID',
        howItWorks: 'ระบบ Trust Score ทำงานอย่างไร',
        factor1Title: 'ยืนยันตัวตน',
        factor1Desc: 'ตรวจสอบบัตรประชาชน, เบอร์โทร, อีเมล',
        factor2Title: 'ประวัติการซื้อขาย',
        factor2Desc: 'จำนวนธุรกรรม, อัตราสำเร็จ, การยกเลิก',
        factor3Title: 'รีวิวและเรตติ้ง',
        factor3Desc: 'คะแนนจากผู้ซื้อ/ผู้ขายจริง',
        factor4Title: 'พฤติกรรม',
        factor4Desc: 'ความเร็วตอบแชท, ความซื่อสัตย์',
        factor5Title: 'อายุบัญชี',
        factor5Desc: 'ระยะเวลาที่ใช้งานแพลตฟอร์ม',
        factor6Title: 'AI Detection',
        factor6Desc: 'ตรวจจับพฤติกรรมผิดปกติ',
        trustLevels: 'ระดับความน่าเชื่อถือ',
        levelExcellent: 'ยอดเยี่ยม',
        levelGood: 'ดี',
        levelFair: 'พอใช้',
        levelLow: 'ต่ำ',
        levelDanger: 'อันตราย',
        protectYourself: 'วิธีป้องกันตัวเอง',
        tip1: 'ตรวจสอบ Trust Score ก่อนซื้อขาย',
        tip2: 'อ่านรีวิวจากผู้ซื้อจริง',
        tip3: 'ใช้ระบบ Escrow ชำระเงิน',
        tip4: 'นัดพบในที่สาธารณะ',
        reportScammer: 'แจ้งมิจฉาชีพ',
    },
    en: {
        title: 'Trust Score System',
        subtitle: 'AI analyzes seller and buyer trustworthiness to protect you from scammers',
        checkTrust: 'Check Trust Score',
        enterUserId: 'Enter User ID or Shop ID',
        howItWorks: 'How Trust Score Works',
        factor1Title: 'Identity Verification',
        factor1Desc: 'ID card, phone, email verification',
        factor2Title: 'Transaction History',
        factor2Desc: 'Number of deals, success rate, cancellations',
        factor3Title: 'Reviews & Ratings',
        factor3Desc: 'Scores from real buyers/sellers',
        factor4Title: 'Behavior',
        factor4Desc: 'Response time, honesty',
        factor5Title: 'Account Age',
        factor5Desc: 'Time on platform',
        factor6Title: 'AI Detection',
        factor6Desc: 'Detect suspicious behavior',
        trustLevels: 'Trust Levels',
        levelExcellent: 'Excellent',
        levelGood: 'Good',
        levelFair: 'Fair',
        levelLow: 'Low',
        levelDanger: 'Danger',
        protectYourself: 'How to Protect Yourself',
        tip1: 'Check Trust Score before trading',
        tip2: 'Read reviews from real buyers',
        tip3: 'Use Escrow payment system',
        tip4: 'Meet in public places',
        reportScammer: 'Report Scammer',
    }
}

const trustLevels = [
    { min: 90, max: 100, color: 'bg-emerald-500', label: 'excellent', icon: ShieldCheck },
    { min: 70, max: 89, color: 'bg-green-500', label: 'good', icon: Shield },
    { min: 50, max: 69, color: 'bg-yellow-500', label: 'fair', icon: Shield },
    { min: 30, max: 49, color: 'bg-orange-500', label: 'low', icon: ShieldAlert },
    { min: 0, max: 29, color: 'bg-red-500', label: 'danger', icon: AlertTriangle },
]

export default function TrustScorePage() {
    const { language } = useLanguage()
    const t = translations[language as 'th' | 'en'] || translations.th

    const [userId, setUserId] = useState('')
    const [isChecking, setIsChecking] = useState(false)
    const [result, setResult] = useState<any>(null)

    const handleCheck = () => {
        if (!userId.trim()) return
        setIsChecking(true)
        // Simulate API call
        setTimeout(() => {
            setResult({
                score: Math.floor(Math.random() * 40) + 60,
                verified: true,
                transactions: Math.floor(Math.random() * 100) + 10,
                successRate: Math.floor(Math.random() * 20) + 80,
                rating: (Math.random() * 1 + 4).toFixed(1),
                memberSince: '2023',
                responseTime: '15 min',
            })
            setIsChecking(false)
        }, 1500)
    }

    const factors = [
        { icon: User, title: t.factor1Title, desc: t.factor1Desc, color: 'from-blue-500 to-cyan-500' },
        { icon: FileText, title: t.factor2Title, desc: t.factor2Desc, color: 'from-purple-500 to-pink-500' },
        { icon: Star, title: t.factor3Title, desc: t.factor3Desc, color: 'from-yellow-500 to-orange-500' },
        { icon: MessageCircle, title: t.factor4Title, desc: t.factor4Desc, color: 'from-green-500 to-emerald-500' },
        { icon: Clock, title: t.factor5Title, desc: t.factor5Desc, color: 'from-indigo-500 to-purple-500' },
        { icon: Eye, title: t.factor6Title, desc: t.factor6Desc, color: 'from-red-500 to-pink-500' },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1">
                {/* Hero */}
                <section className="relative py-16 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white mb-4">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-sm font-medium">AI-Powered Safety</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">
                                🛡️ {t.title}
                            </h1>
                            <p className="text-lg text-white/80 max-w-2xl mx-auto">
                                {t.subtitle}
                            </p>
                        </div>

                        {/* Check Box */}
                        <div className="max-w-xl mx-auto">
                            <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-2xl p-6">
                                <h3 className="font-bold text-lg mb-4 text-center">{t.checkTrust}</h3>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={userId}
                                        onChange={(e) => setUserId(e.target.value)}
                                        placeholder={t.enterUserId}
                                        className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500"
                                    />
                                    <Button
                                        onClick={handleCheck}
                                        disabled={isChecking}
                                        className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-xl"
                                    >
                                        {isChecking ? (
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <Shield className="w-5 h-5" />
                                        )}
                                    </Button>
                                </div>

                                {result && (
                                    <div className="mt-6 p-4 rounded-xl bg-gray-50 dark:bg-gray-800">
                                        <div className="flex items-center justify-between mb-4">
                                            <span className="font-medium">Trust Score</span>
                                            <span className={`text-3xl font-bold ${result.score >= 70 ? 'text-emerald-600' : result.score >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                                                {result.score}%
                                            </span>
                                        </div>
                                        <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full transition-all duration-500 ${result.score >= 70 ? 'bg-emerald-500' : result.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                                style={{ width: `${result.score}%` }}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                                                <span>Verified: {result.verified ? 'Yes' : 'No'}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Star className="w-4 h-4 text-yellow-500" />
                                                <span>Rating: {result.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <TrendingUp className="w-4 h-4 text-blue-500" />
                                                <span>Success: {result.successRate}%</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-purple-500" />
                                                <span>Response: {result.responseTime}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-12">{t.howItWorks}</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                            {factors.map((factor, idx) => (
                                <div key={idx} className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm">
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${factor.color} flex items-center justify-center text-white mb-4`}>
                                        <factor.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2">{factor.title}</h3>
                                    <p className="text-gray-500">{factor.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trust Levels */}
                <section className="py-16 bg-white dark:bg-surface-dark">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-12">{t.trustLevels}</h2>
                        <div className="flex flex-wrap justify-center gap-4">
                            {trustLevels.map((level, idx) => (
                                <div key={idx} className="flex items-center gap-3 px-6 py-3 rounded-full bg-gray-50 dark:bg-gray-800">
                                    <div className={`w-4 h-4 rounded-full ${level.color}`} />
                                    <span className="font-medium">{level.min}-{level.max}%</span>
                                    <span className="text-gray-500">
                                        {t[`level${level.label.charAt(0).toUpperCase() + level.label.slice(1)}` as keyof typeof t]}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Tips */}
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-center mb-8">{t.protectYourself}</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
                            {[t.tip1, t.tip2, t.tip3, t.tip4].map((tip, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-4 rounded-xl bg-white dark:bg-surface-dark shadow-sm">
                                    <CheckCircle className="w-5 h-5 text-emerald-500 mt-0.5" />
                                    <span className="text-sm">{tip}</span>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-8">
                            <Link href="/report">
                                <Button variant="outline" className="border-red-500 text-red-500 hover:bg-red-50">
                                    <AlertTriangle className="w-4 h-4 mr-2" />
                                    {t.reportScammer}
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

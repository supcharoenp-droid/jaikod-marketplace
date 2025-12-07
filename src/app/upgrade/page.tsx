'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { ROLES, UPGRADE_PATHS, UserRole } from '@/lib/roles'
import {
    Check, X, Crown, Sparkles, Shield, Zap,
    TrendingUp, MessageSquare, BarChart3, Clock,
    ChevronRight, Star, Award, ArrowRight
} from 'lucide-react'

// Feature comparison data
const FEATURES = [
    { name: 'ลงขายสินค้า', seller_basic: '10 ชิ้น/เดือน', seller_plus: 'ไม่จำกัด', shop_verified: 'ไม่จำกัด', shop_premium: 'ไม่จำกัด' },
    { name: 'Analytics Dashboard', seller_basic: false, seller_plus: 'พื้นฐาน', shop_verified: 'ขั้นสูง', shop_premium: 'Premium' },
    { name: 'Boost สินค้าฟรี/เดือน', seller_basic: 0, seller_plus: 1, shop_verified: 3, shop_premium: 10 },
    { name: 'Flash Sale Slot', seller_basic: false, seller_plus: false, shop_verified: false, shop_premium: '2 ครั้ง/เดือน' },
    { name: 'Badge พิเศษ', seller_basic: false, seller_plus: 'Plus', shop_verified: '✓ Verified', shop_premium: '👑 Premium' },
    { name: 'ค่าธรรมเนียม', seller_basic: '5%', seller_plus: '4%', shop_verified: '3%', shop_premium: '2%' },
    { name: 'ถอนเงิน', seller_basic: 'T+7', seller_plus: 'T+5', shop_verified: 'T+1', shop_premium: 'ทันที' },
    { name: 'Priority Support', seller_basic: false, seller_plus: false, shop_verified: true, shop_premium: 'VIP (2 ชม.)' },
    { name: 'หน้าร้าน (Shop Page)', seller_basic: false, seller_plus: false, shop_verified: 'พื้นฐาน', shop_premium: 'เต็มรูปแบบ' },
    { name: 'Customer Insights', seller_basic: false, seller_plus: false, shop_verified: false, shop_premium: true },
]

const PRICING_PLANS = [
    {
        id: 'seller_basic',
        name: 'Basic',
        name_th: 'ผู้ขายทั่วไป',
        price: 0,
        period: 'ฟรีตลอดชีพ',
        description: 'เริ่มต้นขายของง่ายๆ ไม่มีค่าใช้จ่าย',
        icon: Zap,
        color: 'from-gray-500 to-gray-600',
        popular: false,
        features: ['ลงขาย 10 ชิ้น/เดือน', 'รับแชทจากลูกค้า', 'สถิติพื้นฐาน']
    },
    {
        id: 'seller_plus',
        name: 'Plus',
        name_th: 'ผู้ขาย Plus',
        price: 99,
        period: '/เดือน',
        description: 'สำหรับผู้ขายที่ต้องการโตเร็วขึ้น',
        icon: Sparkles,
        color: 'from-violet-500 to-purple-600',
        popular: true,
        features: ['ลงขายไม่จำกัด', 'Analytics Dashboard', 'Boost ฟรี 1 ครั้ง/เดือน', 'Badge Plus 💎']
    },
    {
        id: 'shop_verified',
        name: 'Verified',
        name_th: 'ร้านค้ายืนยัน',
        price: 299,
        period: '/เดือน',
        description: 'สร้างความน่าเชื่อถือด้วยการยืนยันตัวตน',
        icon: Shield,
        color: 'from-cyan-500 to-blue-600',
        popular: false,
        features: ['Badge ✓ Verified', 'Boost ฟรี 3 ครั้ง/เดือน', 'ถอนเงิน T+1', 'Priority Support']
    },
    {
        id: 'shop_premium',
        name: 'Premium',
        name_th: 'ร้านค้าพรีเมียม',
        price: 599,
        period: '/เดือน',
        description: 'สำหรับธุรกิจที่ต้องการเครื่องมือครบครัน',
        icon: Crown,
        color: 'from-amber-500 to-orange-600',
        popular: false,
        features: ['หน้าร้านเต็มรูปแบบ', 'Analytics Premium', 'Flash Sale Slot', 'VIP Support', 'ค่าธรรมเนียม 2%']
    },
]

export default function UpgradePage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
    const [showComparison, setShowComparison] = useState(false)

    // Mock current role (in real app, get from user data)
    const currentRole: UserRole = 'seller_basic'

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4">

                    {/* Hero Section */}
                    <div className="text-center max-w-3xl mx-auto mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-neon-purple/10 to-coral-orange/10 border border-purple-200 dark:border-purple-800 mb-6">
                            <TrendingUp className="w-4 h-4 text-neon-purple" />
                            <span className="text-sm font-medium text-neon-purple">เพิ่มยอดขายได้ถึง 300%</span>
                        </div>
                        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
                            อัพเกรดร้านค้าของคุณ<br />
                            <span className="text-gradient">ปลดล็อคศักยภาพเต็มที่</span>
                        </h1>
                        <p className="text-lg text-text-secondary dark:text-gray-400">
                            เลือกแพ็กเกจที่เหมาะกับธุรกิจของคุณ เริ่มต้นฟรี อัพเกรดได้ทุกเมื่อ
                        </p>
                    </div>

                    {/* Billing Toggle */}
                    <div className="flex items-center justify-center gap-4 mb-10">
                        <span className={`font-medium ${billingCycle === 'monthly' ? 'text-text-primary dark:text-white' : 'text-text-secondary'}`}>
                            รายเดือน
                        </span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            className="relative w-14 h-7 bg-gray-200 dark:bg-gray-700 rounded-full transition-colors"
                        >
                            <div className={`absolute top-1 w-5 h-5 bg-neon-purple rounded-full transition-all ${billingCycle === 'yearly' ? 'left-8' : 'left-1'}`}></div>
                        </button>
                        <span className={`font-medium ${billingCycle === 'yearly' ? 'text-text-primary dark:text-white' : 'text-text-secondary'}`}>
                            รายปี <span className="text-emerald-500 text-sm font-bold">-20%</span>
                        </span>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        {PRICING_PLANS.map((plan) => {
                            const isCurrentPlan = plan.id === currentRole
                            const price = billingCycle === 'yearly' ? Math.round(plan.price * 12 * 0.8) : plan.price
                            const IconComponent = plan.icon

                            return (
                                <div
                                    key={plan.id}
                                    className={`relative bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border-2 transition-all hover:shadow-xl ${plan.popular
                                            ? 'border-neon-purple shadow-neon-purple/20'
                                            : 'border-gray-100 dark:border-gray-800 hover:border-gray-200'
                                        } ${selectedPlan === plan.id ? 'ring-2 ring-neon-purple ring-offset-2' : ''}`}
                                >
                                    {plan.popular && (
                                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-neon-purple to-purple-600 text-white text-xs font-bold rounded-full shadow-lg">
                                            ยอดนิยม
                                        </div>
                                    )}

                                    {isCurrentPlan && (
                                        <div className="absolute -top-3 right-4 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                                            แพ็กเกจปัจจุบัน
                                        </div>
                                    )}

                                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${plan.color} flex items-center justify-center text-white mb-4`}>
                                        <IconComponent className="w-7 h-7" />
                                    </div>

                                    <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                                    <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">{plan.description}</p>

                                    <div className="flex items-baseline gap-1 mb-6">
                                        {plan.price === 0 ? (
                                            <span className="text-3xl font-bold">ฟรี</span>
                                        ) : (
                                            <>
                                                <span className="text-3xl font-bold">฿{price.toLocaleString()}</span>
                                                <span className="text-text-secondary">/{billingCycle === 'yearly' ? 'ปี' : 'เดือน'}</span>
                                            </>
                                        )}
                                    </div>

                                    <ul className="space-y-3 mb-6">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-2 text-sm">
                                                <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                <span>{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        variant={plan.popular ? 'primary' : 'outline'}
                                        className="w-full"
                                        disabled={isCurrentPlan}
                                        onClick={() => setSelectedPlan(plan.id)}
                                    >
                                        {isCurrentPlan ? 'แพ็กเกจปัจจุบัน' : plan.price === 0 ? 'เริ่มต้นฟรี' : 'เลือกแพ็กเกจนี้'}
                                    </Button>
                                </div>
                            )
                        })}
                    </div>

                    {/* Comparison Toggle */}
                    <div className="text-center mb-8">
                        <button
                            onClick={() => setShowComparison(!showComparison)}
                            className="inline-flex items-center gap-2 text-neon-purple font-medium hover:underline"
                        >
                            {showComparison ? 'ซ่อนตารางเปรียบเทียบ' : 'ดูตารางเปรียบเทียบทั้งหมด'}
                            <ChevronRight className={`w-4 h-4 transition-transform ${showComparison ? 'rotate-90' : ''}`} />
                        </button>
                    </div>

                    {/* Feature Comparison Table */}
                    {showComparison && (
                        <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden mb-12 animate-fade-in">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-gray-50 dark:bg-gray-800">
                                            <th className="text-left p-4 font-semibold">ฟีเจอร์</th>
                                            <th className="text-center p-4 font-semibold">Basic</th>
                                            <th className="text-center p-4 font-semibold bg-neon-purple/5">Plus 💎</th>
                                            <th className="text-center p-4 font-semibold">Verified ✓</th>
                                            <th className="text-center p-4 font-semibold">Premium 👑</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {FEATURES.map((feature, idx) => (
                                            <tr key={idx} className="border-t border-gray-100 dark:border-gray-800">
                                                <td className="p-4 font-medium">{feature.name}</td>
                                                <td className="p-4 text-center">
                                                    {typeof feature.seller_basic === 'boolean' ? (
                                                        feature.seller_basic ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                                                    ) : feature.seller_basic}
                                                </td>
                                                <td className="p-4 text-center bg-neon-purple/5">
                                                    {typeof feature.seller_plus === 'boolean' ? (
                                                        feature.seller_plus ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                                                    ) : feature.seller_plus}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {typeof feature.shop_verified === 'boolean' ? (
                                                        feature.shop_verified ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                                                    ) : feature.shop_verified}
                                                </td>
                                                <td className="p-4 text-center">
                                                    {typeof feature.shop_premium === 'boolean' ? (
                                                        feature.shop_premium ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-gray-300 mx-auto" />
                                                    ) : feature.shop_premium}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Enterprise Section */}
                    <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 text-white">
                        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Award className="w-6 h-6 text-amber-400" />
                                    <span className="text-amber-400 font-semibold">Enterprise</span>
                                </div>
                                <h3 className="text-2xl md:text-3xl font-bold mb-2">สำหรับองค์กรขนาดใหญ่</h3>
                                <p className="text-gray-400 max-w-lg">
                                    รองรับทีมขนาดใหญ่ เครื่องมือ API, Integration กับระบบ ERP/CRM,
                                    Dedicated Account Manager และ SLA ระดับ Enterprise
                                </p>
                            </div>
                            <Button className="bg-white text-gray-900 hover:bg-gray-100 shrink-0">
                                ติดต่อฝ่ายขาย
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>

                    {/* FAQ Section */}
                    <div className="mt-16 max-w-3xl mx-auto">
                        <h2 className="text-2xl font-bold text-center mb-8">คำถามที่พบบ่อย</h2>
                        <div className="space-y-4">
                            {[
                                { q: 'สามารถยกเลิกได้ตลอดเวลาไหม?', a: 'ได้ครับ คุณสามารถยกเลิกแพ็กเกจได้ทุกเมื่อ โดยจะยังคงใช้งานได้จนกว่าจะหมดรอบบิล' },
                                { q: 'มีการคืนเงินไหม?', a: 'เรามี Money-back Guarantee ภายใน 7 วันแรก หากไม่พอใจสามารถขอคืนเงินได้เต็มจำนวน' },
                                { q: 'การยืนยันตัวตนใช้อะไรบ้าง?', a: 'สำหรับบุคคลธรรมดา: บัตรประชาชน | สำหรับนิติบุคคล: ทะเบียนการค้า/หนังสือรับรองบริษัท' },
                                { q: 'สามารถอัพเกรด/ดาวน์เกรดได้ไหม?', a: 'ได้ครับ คุณสามารถเปลี่ยนแพ็กเกจได้ทุกเมื่อ โดยระบบจะคำนวณส่วนต่างให้อัตโนมัติ' },
                            ].map((faq, idx) => (
                                <details key={idx} className="bg-white dark:bg-surface-dark rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-800 group">
                                    <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                                        {faq.q}
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-open:rotate-90 transition-transform" />
                                    </summary>
                                    <p className="mt-3 text-text-secondary dark:text-gray-400">{faq.a}</p>
                                </details>
                            ))}
                        </div>
                    </div>

                </div>
            </main>
            <Footer />
        </div>
    )
}

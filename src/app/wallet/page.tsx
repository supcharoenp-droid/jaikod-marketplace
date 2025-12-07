'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import {
    Coins, Plus, History, Rocket, Star, Zap,
    CreditCard, QrCode, Smartphone, ArrowRight,
    TrendingUp, Gift, ShieldCheck, Crown
} from 'lucide-react'

// Mock Coin Packages
const COIN_PACKAGES = [
    { id: 1, coins: 50, price: 50, bonus: 0, popular: false },
    { id: 2, coins: 100, price: 99, bonus: 5, popular: false },
    { id: 3, coins: 300, price: 279, bonus: 20, popular: true },
    { id: 4, coins: 500, price: 449, bonus: 50, popular: false },
    { id: 5, coins: 1000, price: 849, bonus: 150, popular: false },
]

// Mock Promotion Services
const PROMO_SERVICES = [
    {
        id: 'boost',
        name: 'Boost สินค้า',
        description: 'ดันสินค้าขึ้นหน้าแรกในหมวดหมู่ 24 ชม.',
        price: 15,
        icon: Rocket,
        color: 'from-orange-500 to-red-500',
        benefits: ['เพิ่มยอดวิว 3-5 เท่า', 'แสดงในหน้าแรกหมวดหมู่', '24 ชั่วโมง']
    },
    {
        id: 'featured',
        name: 'Featured Badge',
        description: 'ติดป้าย "แนะนำ" บนสินค้า 7 วัน',
        price: 100,
        icon: Star,
        color: 'from-amber-400 to-yellow-500',
        benefits: ['ป้าย ⭐ แนะนำ', 'เพิ่มความน่าเชื่อถือ', '7 วัน']
    },
    {
        id: 'flash',
        name: 'Flash Sale Slot',
        description: 'ลงสินค้าในโซน Flash Sale เด่นชัด',
        price: 200,
        icon: Zap,
        color: 'from-violet-500 to-purple-600',
        benefits: ['โซน Flash Sale', 'เพิ่มยอดคลิก 10 เท่า', '48 ชั่วโมง']
    },
    {
        id: 'premium',
        name: 'Premium Seller',
        description: 'สมาชิกพรีเมียม ลงขายไม่จำกัด + Badge',
        price: 299,
        icon: Crown,
        color: 'from-gray-800 to-gray-900',
        benefits: ['ลงขายไม่จำกัด', 'Badge ร้านค้าพรีเมียม', 'Support ด่วน', '30 วัน']
    },
]

// Mock Payment Methods
const PAYMENT_METHODS = [
    { id: 'promptpay', name: 'PromptPay', icon: QrCode, color: 'bg-blue-500' },
    { id: 'card', name: 'บัตรเครดิต/เดบิต', icon: CreditCard, color: 'bg-gray-700' },
    { id: 'truemoney', name: 'TrueMoney Wallet', icon: Smartphone, color: 'bg-orange-500' },
    { id: 'linepay', name: 'Rabbit LINE Pay', icon: Smartphone, color: 'bg-green-500' },
]

export default function WalletPage() {
    const { user, loading } = useAuth()
    const router = useRouter()
    const [activeTab, setActiveTab] = useState<'topup' | 'services' | 'history'>('topup')
    const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null)

    // Mock user balance
    const userBalance = 125

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
            </div>
        )
    }

    if (!user) {
        router.push('/login')
        return null
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1 pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-5xl">

                    {/* Balance Card */}
                    <div className="relative overflow-hidden bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 rounded-3xl p-6 md:p-8 mb-8 text-white shadow-2xl shadow-purple-500/30">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-16 -mb-16 blur-2xl"></div>

                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div>
                                <div className="flex items-center gap-2 text-white/80 text-sm font-medium mb-2">
                                    <Coins className="w-5 h-5" />
                                    กระเป๋า JaiCoin ของฉัน
                                </div>
                                <div className="text-5xl md:text-6xl font-bold flex items-baseline gap-2">
                                    {userBalance.toLocaleString()}
                                    <span className="text-2xl font-normal text-white/70">Coins</span>
                                </div>
                                <p className="text-white/60 text-sm mt-2">≈ ฿{userBalance} (1 Coin = 1 บาท)</p>
                            </div>
                            <div className="flex gap-3">
                                <Button
                                    variant="outline"
                                    className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                                    onClick={() => setActiveTab('history')}
                                >
                                    <History className="w-4 h-4 mr-2" />
                                    ประวัติ
                                </Button>
                                <Button
                                    className="bg-white text-purple-600 hover:bg-gray-100 shadow-lg"
                                    onClick={() => setActiveTab('topup')}
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    เติมเงิน
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
                        <button
                            onClick={() => setActiveTab('topup')}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'topup' ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/30' : 'bg-white dark:bg-surface-dark text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}
                        >
                            <Plus className="w-4 h-4 inline mr-1.5" />
                            เติม JaiCoin
                        </button>
                        <button
                            onClick={() => setActiveTab('services')}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'services' ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/30' : 'bg-white dark:bg-surface-dark text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}
                        >
                            <Rocket className="w-4 h-4 inline mr-1.5" />
                            โปรโมทสินค้า
                        </button>
                        <button
                            onClick={() => setActiveTab('history')}
                            className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all whitespace-nowrap ${activeTab === 'history' ? 'bg-neon-purple text-white shadow-lg shadow-neon-purple/30' : 'bg-white dark:bg-surface-dark text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 border border-gray-200 dark:border-gray-700'}`}
                        >
                            <History className="w-4 h-4 inline mr-1.5" />
                            ประวัติการใช้
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className="min-h-[400px]">

                        {/* Top-up Tab */}
                        {activeTab === 'topup' && (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Packages */}
                                <div className="lg:col-span-2 bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <Gift className="w-5 h-5 text-neon-purple" />
                                        เลือกแพ็กเกจ JaiCoin
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {COIN_PACKAGES.map(pkg => (
                                            <button
                                                key={pkg.id}
                                                onClick={() => setSelectedPackage(pkg.id)}
                                                className={`relative p-4 rounded-xl border-2 transition-all text-left ${selectedPackage === pkg.id ? 'border-neon-purple bg-neon-purple/5 shadow-lg' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                                            >
                                                {pkg.popular && (
                                                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                                        ยอดนิยม
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Coins className="w-5 h-5 text-amber-500" />
                                                    <span className="text-xl font-bold">{pkg.coins}</span>
                                                </div>
                                                {pkg.bonus > 0 && (
                                                    <div className="text-xs text-green-600 font-semibold mb-1">
                                                        +{pkg.bonus} โบนัส!
                                                    </div>
                                                )}
                                                <div className="text-lg font-bold text-neon-purple">฿{pkg.price}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Payment Methods */}
                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-neon-purple" />
                                        ชำระเงิน
                                    </h3>
                                    <div className="space-y-2 mb-6">
                                        {PAYMENT_METHODS.map(method => (
                                            <button
                                                key={method.id}
                                                onClick={() => setSelectedPayment(method.id)}
                                                className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${selectedPayment === method.id ? 'border-neon-purple bg-neon-purple/5' : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'}`}
                                            >
                                                <div className={`w-10 h-10 ${method.color} rounded-lg flex items-center justify-center text-white`}>
                                                    <method.icon className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-sm">{method.name}</span>
                                            </button>
                                        ))}
                                    </div>

                                    <Button
                                        variant="primary"
                                        className="w-full"
                                        disabled={!selectedPackage || !selectedPayment}
                                    >
                                        ชำระเงิน
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                    <p className="text-xs text-center text-text-secondary mt-3">
                                        <ShieldCheck className="w-3 h-3 inline mr-1" />
                                        การชำระเงินปลอดภัย 100%
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Services Tab */}
                        {activeTab === 'services' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {PROMO_SERVICES.map(service => (
                                    <div key={service.id} className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-shadow">
                                        <div className="flex items-start gap-4">
                                            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-lg`}>
                                                <service.icon className="w-7 h-7" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-bold text-lg mb-1">{service.name}</h4>
                                                <p className="text-sm text-text-secondary mb-3">{service.description}</p>
                                                <ul className="space-y-1 mb-4">
                                                    {service.benefits.map((b, i) => (
                                                        <li key={i} className="text-xs text-gray-500 flex items-center gap-1">
                                                            <span className="text-green-500">✓</span> {b}
                                                        </li>
                                                    ))}
                                                </ul>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                                                        <Coins className="w-4 h-4" />
                                                        {service.price} Coins
                                                    </div>
                                                    <Button size="sm" variant="primary">
                                                        ใช้งาน
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* History Tab */}
                        {activeTab === 'history' && (
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                                <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-xl font-bold mb-2">ยังไม่มีประวัติการใช้งาน</h3>
                                <p className="text-text-secondary mb-6">เริ่มต้นเติม JaiCoin และโปรโมทสินค้าของคุณวันนี้!</p>
                                <Button variant="primary" onClick={() => setActiveTab('topup')}>
                                    เติม JaiCoin เลย
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import Button from '@/components/ui/Button'
import { MOCK_PRODUCTS } from '@/constants/mockProducts'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'
import {
    Zap, Gift, Truck, CreditCard, Tag, Star, Clock,
    ArrowRight, Copy, CheckCircle, Percent, Package,
    TrendingUp, Bell, Sparkles
} from 'lucide-react'

// Countdown Hook
function useCountdown(targetDate: Date) {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime()
            const distance = targetDate.getTime() - now

            if (distance > 0) {
                setTimeLeft({
                    days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                    hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                    minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                    seconds: Math.floor((distance % (1000 * 60)) / 1000)
                })
            }
        }, 1000)
        return () => clearInterval(timer)
    }, [targetDate])

    return timeLeft
}

// Coming Soon Component
function ComingSoonPage() {
    const [email, setEmail] = useState('')
    const [subscribed, setSubscribed] = useState(false)

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault()
        if (email) {
            setSubscribed(true)
            setEmail('')
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
            <Header />

            <main className="flex items-center justify-center min-h-[80vh] px-4">
                <div className="text-center text-white max-w-2xl">
                    {/* Animated Gift Icon */}
                    <div className="relative inline-block mb-8">
                        <div className="w-32 h-32 mx-auto bg-white/20 backdrop-blur-md rounded-3xl flex items-center justify-center animate-bounce">
                            <Gift className="w-16 h-16 text-white" />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-ping">
                            <Sparkles className="w-4 h-4 text-yellow-800" />
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-4">
                        🎉 โปรโมชั่นพิเศษ
                    </h1>
                    <p className="text-xl md:text-2xl text-white/80 mb-2">
                        กำลังจะมาเร็วๆ นี้!
                    </p>
                    <p className="text-white/60 mb-8">
                        เรากำลังเตรียมข้อเสนอสุดพิเศษสำหรับคุณ ติดตามข่าวสารไม่พลาด!
                    </p>

                    {/* Subscribe Form */}
                    {!subscribed ? (
                        <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="กรอกอีเมลของคุณ"
                                className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/30"
                                required
                            />
                            <Button type="submit" className="bg-white text-purple-600 hover:bg-gray-100 px-8">
                                <Bell className="w-5 h-5 mr-2" />
                                แจ้งเตือนฉัน
                            </Button>
                        </form>
                    ) : (
                        <div className="bg-white/20 backdrop-blur-md rounded-2xl px-8 py-6 max-w-md mx-auto">
                            <CheckCircle className="w-12 h-12 text-green-300 mx-auto mb-3" />
                            <p className="text-lg font-semibold">ลงทะเบียนสำเร็จ!</p>
                            <p className="text-white/80 text-sm">เราจะแจ้งเตือนคุณเมื่อมีโปรโมชั่นพิเศษ</p>
                        </div>
                    )}

                    {/* Quick Links */}
                    <div className="flex flex-wrap justify-center gap-4 mt-12">
                        <Link href="/">
                            <Button variant="outline" className="border-white text-white hover:bg-white/10">
                                กลับหน้าหลัก
                            </Button>
                        </Link>
                        <Link href="/search">
                            <Button variant="outline" className="border-white text-white hover:bg-white/10">
                                ดูสินค้าทั้งหมด
                            </Button>
                        </Link>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    )
}

// Promo Codes Data
const PROMO_CODES = [
    { code: 'JAIKOD50', discount: '50%', description: 'ลดสูงสุด 50% ทุกหมวดหมู่', minPurchase: 500, maxDiscount: 500, expiry: '31 ธ.ค. 2024', type: 'percent' },
    { code: 'FREESHIP', discount: 'ฟรี', description: 'ส่งฟรีทั่วไทย', minPurchase: 300, maxDiscount: 100, expiry: '31 ธ.ค. 2024', type: 'shipping' },
    { code: 'WELCOME15', discount: '15%', description: 'สมาชิกใหม่ลด 15%', minPurchase: 0, maxDiscount: 200, expiry: '31 ธ.ค. 2024', type: 'percent' },
    { code: 'CASH100', discount: '฿100', description: 'เงินคืน 100 บาท', minPurchase: 1000, maxDiscount: 100, expiry: '15 ธ.ค. 2024', type: 'cashback' },
    { code: 'GADGET20', discount: '20%', description: 'ลด 20% สำหรับหมวดอิเล็กทรอนิกส์', minPurchase: 500, maxDiscount: 300, expiry: '31 ธ.ค. 2024', type: 'percent' },
]

const FLASH_SALE_PRODUCTS = MOCK_PRODUCTS.slice(0, 8).map((p, idx) => ({
    ...p,
    originalPrice: Math.round(p.price * 1.5),
    discount: [25, 30, 40, 35, 20, 45, 30, 25][idx] || 30,
    soldPercent: [75, 60, 85, 45, 90, 55, 70, 80][idx] || 50
}))

const CAMPAIGNS = [
    { id: 1, title: '12.12 Super Sale', image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800', discount: 'ลดสูงสุด 70%', color: 'from-red-500 to-orange-500' },
    { id: 2, title: 'ส่งฟรีทั่วไทย', image: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800', discount: 'ไม่มีขั้นต่ำ', color: 'from-emerald-500 to-teal-500' },
    { id: 3, title: 'แบรนด์เนมลดแรง', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800', discount: 'ลด 30-50%', color: 'from-purple-500 to-pink-500' },
]

export default function PromotionsPage() {
    const { settings, isLoading } = useSiteSettings()
    const [copiedCode, setCopiedCode] = useState<string | null>(null)
    const flashSaleEnd = new Date('2024-12-31T23:59:59')
    const timeLeft = useCountdown(flashSaleEnd)

    const copyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-neon-purple border-t-transparent rounded-full"></div>
            </div>
        )
    }

    // Show Coming Soon if promotions are disabled
    if (!settings.promotionsEnabled) {
        return <ComingSoonPage />
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Header />


            <main className="pb-12">
                {/* Hero Banner */}
                <section className="relative bg-gradient-to-br from-red-600 via-pink-600 to-purple-600 py-16 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/confetti.svg')] opacity-10"></div>
                    <div className="absolute top-10 right-10 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-10 left-10 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>

                    <div className="container mx-auto px-4 relative z-10">
                        <div className="text-center text-white">
                            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-bold mb-6 animate-bounce">
                                <Zap className="w-5 h-5 text-yellow-300 fill-current" />
                                Flash Sale กำลังดำเนินอยู่!
                            </div>

                            <h1 className="text-4xl md:text-6xl font-black mb-4">
                                🎉 โปรโมชั่นพิเศษ
                            </h1>
                            <p className="text-xl text-white/80 mb-8">ลดสูงสุด 70% | ส่งฟรีทั่วไทย | เงินคืนทุกการสั่งซื้อ</p>

                            {/* Countdown */}
                            <div className="inline-flex items-center gap-4 bg-black/30 backdrop-blur-sm px-8 py-4 rounded-2xl">
                                <Clock className="w-6 h-6 text-yellow-300" />
                                <span className="text-white/80">สิ้นสุดใน:</span>
                                <div className="flex gap-3">
                                    {[
                                        { value: timeLeft.days, label: 'วัน' },
                                        { value: timeLeft.hours, label: 'ชม.' },
                                        { value: timeLeft.minutes, label: 'นาที' },
                                        { value: timeLeft.seconds, label: 'วินาที' },
                                    ].map((t, i) => (
                                        <div key={i} className="text-center">
                                            <div className="bg-white text-red-600 px-3 py-2 rounded-lg font-mono font-bold text-xl min-w-[50px]">
                                                {String(t.value).padStart(2, '0')}
                                            </div>
                                            <div className="text-xs text-white/60 mt-1">{t.label}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Promo Codes Section */}
                <section className="container mx-auto px-4 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Tag className="w-6 h-6 text-neon-purple" />
                                รหัสส่วนลดพิเศษ
                            </h2>
                            <p className="text-gray-500 mt-1">คัดลอกโค้ดไปใช้เลย!</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {PROMO_CODES.map((promo, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow group">
                                <div className={`p-1 ${promo.type === 'percent' ? 'bg-gradient-to-r from-neon-purple to-purple-600' :
                                    promo.type === 'shipping' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' :
                                        'bg-gradient-to-r from-amber-500 to-orange-500'
                                    }`}>
                                    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <div className="text-3xl font-black text-gray-900 dark:text-white">{promo.discount}</div>
                                                <p className="text-gray-600 dark:text-gray-400 mt-1">{promo.description}</p>
                                            </div>
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${promo.type === 'percent' ? 'bg-neon-purple/10 text-neon-purple' :
                                                promo.type === 'shipping' ? 'bg-emerald-100 text-emerald-600' :
                                                    'bg-amber-100 text-amber-600'
                                                }`}>
                                                {promo.type === 'percent' && <Percent className="w-6 h-6" />}
                                                {promo.type === 'shipping' && <Truck className="w-6 h-6" />}
                                                {promo.type === 'cashback' && <CreditCard className="w-6 h-6" />}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 mb-4">
                                            <code className="flex-1 bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-xl font-mono font-bold text-lg text-center tracking-wider">
                                                {promo.code}
                                            </code>
                                            <button
                                                onClick={() => copyCode(promo.code)}
                                                className={`p-3 rounded-xl transition-all ${copiedCode === promo.code
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-neon-purple text-white hover:bg-purple-600'
                                                    }`}
                                            >
                                                {copiedCode === promo.code ? <CheckCircle className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between text-sm text-gray-500">
                                            <span>ขั้นต่ำ ฿{promo.minPurchase.toLocaleString()}</span>
                                            <span>หมดอายุ {promo.expiry}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Campaign Banners */}
                <section className="container mx-auto px-4 py-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Gift className="w-6 h-6 text-pink-500" />
                        แคมเปญพิเศษ
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {CAMPAIGNS.map(campaign => (
                            <Link href="/search" key={campaign.id}>
                                <div className={`relative h-48 rounded-2xl overflow-hidden bg-gradient-to-br ${campaign.color} group cursor-pointer`}>
                                    <Image
                                        src={campaign.image}
                                        alt={campaign.title}
                                        fill
                                        className="absolute inset-0 object-cover mix-blend-overlay opacity-50 group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 text-white z-10">
                                        <h3 className="text-2xl font-bold mb-1">{campaign.title}</h3>
                                        <p className="text-white/80">{campaign.discount}</p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Flash Sale Products */}
                <section className="container mx-auto px-4 py-12">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold flex items-center gap-2">
                                <Zap className="w-6 h-6 text-red-500 fill-current" />
                                Flash Sale สินค้าลดราคา
                            </h2>
                            <p className="text-gray-500 mt-1">ราคาพิเศษ จำกัดเวลา!</p>
                        </div>
                        <Link href="/search?sort=flash_sale">
                            <Button variant="outline">ดูทั้งหมด <ArrowRight className="w-4 h-4 ml-2" /></Button>
                        </Link>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {FLASH_SALE_PRODUCTS.map(product => (
                            <Link href={`/product/${product.slug}`} key={product.id}>
                                <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                                    <div className="relative aspect-square">
                                        <Image
                                            src={product.thumbnail_url || '/placeholder.jpg'}
                                            alt={product.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform"
                                        />
                                        <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
                                            -{product.discount}%
                                        </div>
                                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                                            <div className="flex items-center gap-2">
                                                <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${product.soldPercent}%` }}></div>
                                                </div>
                                                <span className="text-white text-xs">ขายแล้ว</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-medium line-clamp-2 mb-2 group-hover:text-neon-purple transition-colors">{product.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xl font-bold text-red-500">฿{product.price.toLocaleString()}</span>
                                            <span className="text-sm text-gray-400 line-through">฿{product.originalPrice.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Benefits */}
                <section className="bg-gradient-to-r from-neon-purple to-purple-600 py-12">
                    <div className="container mx-auto px-4">
                        <h2 className="text-2xl font-bold text-white text-center mb-8">ทำไมต้องช้อปกับเรา?</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {[
                                { icon: Truck, title: 'ส่งฟรีทั่วไทย', desc: 'เมื่อซื้อครบ ฿300' },
                                { icon: CreditCard, title: 'Cashback ทุกออเดอร์', desc: 'รับเงินคืนสูงสุด 10%' },
                                { icon: Star, title: 'สินค้าคุณภาพ', desc: 'ตรวจสอบก่อนส่ง' },
                                { icon: Gift, title: 'โปรโมชั่นรายวัน', desc: 'ลดราคาทุกวัน' },
                            ].map((benefit, idx) => (
                                <div key={idx} className="text-center text-white">
                                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                        <benefit.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="font-bold mb-1">{benefit.title}</h3>
                                    <p className="text-white/70 text-sm">{benefit.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="container mx-auto px-4 py-12">
                    <div className="bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 text-[200px] opacity-10">🎁</div>
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 relative z-10">
                            อย่าพลาด! โปรโมชั่นจะหมดเร็วๆ นี้
                        </h2>
                        <p className="text-white/80 text-lg mb-8 relative z-10">
                            สมัครสมาชิกเพื่อรับโค้ดส่วนลดพิเศษก่อนใคร
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                            <Link href="/register">
                                <Button size="lg" className="bg-white text-orange-500 hover:bg-gray-100 px-8">
                                    สมัครสมาชิก
                                </Button>
                            </Link>
                            <Link href="/search">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 px-8">
                                    ช้อปเลย
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

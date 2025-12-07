'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X, ArrowRight, Sparkles, Gift, Zap, Bell, MessageCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import { useSiteSettings } from '@/contexts/SiteSettingsContext'

// ============================================
// 1. FLOATING CTA BUTTON
// ============================================
export function FloatingCTA() {
    const [isOpen, setIsOpen] = useState(false)
    const { settings } = useSiteSettings()

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Quick Actions Menu */}
            {isOpen && (
                <div className="absolute bottom-16 right-0 mb-2 space-y-2 animate-in slide-in-from-bottom-5">
                    <Link href="/sell" className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center text-white">
                            <Zap className="w-5 h-5" />
                        </div>
                        <div className="pr-4">
                            <div className="font-bold text-sm group-hover:text-emerald-500 transition-colors">ลงขายเลย!</div>
                            <div className="text-xs text-gray-500">ฟรี ไม่มีค่าใช้จ่าย</div>
                        </div>
                    </Link>
                    <Link href="/chat" className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all group">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-white">
                            <MessageCircle className="w-5 h-5" />
                        </div>
                        <div className="pr-4">
                            <div className="font-bold text-sm group-hover:text-blue-500 transition-colors">แชทกับเรา</div>
                            <div className="text-xs text-gray-500">ตอบภายใน 5 นาที</div>
                        </div>
                    </Link>
                    {/* Only show Promotions link if enabled */}
                    {settings.promotionsEnabled && (
                        <Link href="/promotions" className="flex items-center gap-3 bg-white dark:bg-gray-800 px-4 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all group">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-white">
                                <Gift className="w-5 h-5" />
                            </div>
                            <div className="pr-4">
                                <div className="font-bold text-sm group-hover:text-pink-500 transition-colors">โปรโมชั่น</div>
                                <div className="text-xs text-gray-500">ลดสูงสุด 50%!</div>
                            </div>
                        </Link>
                    )}
                </div>
            )}

            {/* Main Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${isOpen
                    ? 'bg-gray-800 rotate-45'
                    : 'bg-gradient-to-br from-neon-purple to-coral-orange hover:scale-110 animate-pulse'
                    }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <Sparkles className="w-6 h-6 text-white" />
                )}
            </button>
        </div>
    )
}

// ============================================
// 2. TOP ANNOUNCEMENT BAR
// ============================================
export function AnnouncementBar() {
    const [isVisible, setIsVisible] = useState(true)

    if (!isVisible) return null

    return (
        <div className="bg-gradient-to-r from-neon-purple via-purple-600 to-coral-orange text-white py-2 px-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/sparkles.svg')] opacity-20 animate-pulse"></div>
            <div className="container mx-auto flex items-center justify-center gap-4 relative z-10">
                <span className="text-2xl animate-bounce">🎉</span>
                <p className="text-sm md:text-base font-medium text-center">
                    <span className="font-bold">Flash Sale!</span> ลดสูงสุด 50% | ใช้โค้ด <code className="bg-white/20 px-2 py-0.5 rounded font-mono">JAIKOD50</code>
                </p>
                <Link href="/promotions" className="hidden md:flex items-center gap-1 bg-white text-neon-purple px-4 py-1.5 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors">
                    ช้อปเลย!
                    <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                    onClick={() => setIsVisible(false)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-white/20 rounded-full"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    )
}

// ============================================
// 3. HERO CTA SECTION
// ============================================
export function HeroCTA() {
    return (
        <section className="relative py-20 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple via-purple-600 to-coral-orange"></div>
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>

            {/* Floating Elements */}
            <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float-delayed"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6 animate-bounce-slow">
                        <Sparkles className="w-4 h-4" />
                        ตลาดมือสอง #1 ในไทย
                    </div>

                    <h1 className="text-4xl md:text-6xl font-display font-black mb-6 leading-tight">
                        ซื้อง่าย ขายคล่อง<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-300">
                            ด้วยพลัง AI
                        </span>
                    </h1>

                    <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                        ลงขายได้ใน 30 วินาที ด้วย Snap & Sell | AI แนะนำราคา | ระบบ Escrow ปลอดภัย 100%
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/sell">
                            <button className="group relative px-8 py-4 bg-white text-neon-purple rounded-xl font-bold text-lg shadow-2xl hover:shadow-white/25 transition-all hover:scale-105">
                                <span className="flex items-center gap-2">
                                    <Zap className="w-5 h-5" />
                                    ลงขายฟรี!
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <span className="absolute -top-2 -right-2 bg-coral-orange text-white text-xs px-2 py-0.5 rounded-full animate-pulse">
                                    HOT
                                </span>
                            </button>
                        </Link>
                        <Link href="/register">
                            <button className="px-8 py-4 border-2 border-white/50 text-white rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                                สมัครสมาชิก
                            </button>
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="flex items-center justify-center gap-8 mt-10 text-white/60 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="text-xl">✓</span>
                            <span>ผู้ใช้ 100,000+</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">✓</span>
                            <span>ไม่มีค่าธรรมเนียมซ่อน</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl">✓</span>
                            <span>ปลอดภัย 100%</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

// ============================================
// 4. INLINE CTA CARD
// ============================================
interface CTACardProps {
    variant?: 'primary' | 'secondary' | 'gradient'
    title: string
    description: string
    buttonText: string
    buttonLink: string
    icon?: React.ReactNode
}

export function CTACard({ variant = 'primary', title, description, buttonText, buttonLink, icon }: CTACardProps) {
    const variantStyles = {
        primary: 'bg-neon-purple text-white',
        secondary: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        gradient: 'bg-gradient-to-r from-neon-purple to-coral-orange text-white',
    }

    return (
        <div className={`rounded-2xl p-8 ${variantStyles[variant]}`}>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    {icon && (
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${variant === 'secondary' ? 'bg-neon-purple/10 text-neon-purple' : 'bg-white/20'
                            }`}>
                            {icon}
                        </div>
                    )}
                    <div>
                        <h3 className={`text-2xl font-bold mb-2 ${variant === 'secondary' ? 'text-gray-900 dark:text-white' : ''}`}>
                            {title}
                        </h3>
                        <p className={variant === 'secondary' ? 'text-gray-600 dark:text-gray-400' : 'text-white/80'}>
                            {description}
                        </p>
                    </div>
                </div>
                <Link href={buttonLink}>
                    <button className={`px-8 py-4 rounded-xl font-bold text-lg transition-all hover:scale-105 whitespace-nowrap ${variant === 'secondary'
                        ? 'bg-neon-purple text-white hover:bg-purple-600'
                        : 'bg-white text-neon-purple hover:bg-gray-100'
                        }`}>
                        {buttonText}
                        <ArrowRight className="inline-block w-5 h-5 ml-2" />
                    </button>
                </Link>
            </div>
        </div>
    )
}

// ============================================
// 5. STICKY CTA BAR (Bottom)
// ============================================
export function StickyBottomCTA({ show = true }: { show?: boolean }) {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 500)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    if (!show || !isVisible) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl transform transition-transform duration-300">
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-3xl">🔥</div>
                        <div>
                            <div className="font-bold">พร้อมเริ่มต้นขายแล้วหรือยัง?</div>
                            <div className="text-sm text-gray-500">ลงขายฟรี ไม่มีค่าใช้จ่ายล่วงหน้า</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 w-full md:w-auto">
                        <Link href="/sell" className="flex-1 md:flex-none">
                            <Button variant="primary" size="lg" className="w-full md:w-auto">
                                <Zap className="w-5 h-5 mr-2" />
                                ลงขายเลย!
                            </Button>
                        </Link>
                        <Link href="/" className="hidden md:block">
                            <Button variant="outline" size="lg">
                                ดูสินค้า
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

// ============================================
// 6. POP-UP CTA (Newsletter/First Visit)
// ============================================
export function PopupCTA() {
    const [isVisible, setIsVisible] = useState(false)
    const [email, setEmail] = useState('')

    useEffect(() => {
        // Show popup after 5 seconds if not shown before
        const hasShown = localStorage.getItem('popup_shown')
        if (!hasShown) {
            const timer = setTimeout(() => {
                setIsVisible(true)
            }, 5000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleClose = () => {
        setIsVisible(false)
        localStorage.setItem('popup_shown', 'true')
    }

    if (!isVisible) return null

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95">
                {/* Image/Header */}
                <div className="bg-gradient-to-br from-neon-purple to-coral-orange p-8 text-white text-center relative">
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/20 rounded-full"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="text-6xl mb-4">🎁</div>
                    <h2 className="text-2xl font-bold mb-2">รับส่วนลด 15%!</h2>
                    <p className="text-white/80">สำหรับการซื้อครั้งแรก</p>
                </div>

                {/* Content */}
                <div className="p-8">
                    <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                        กรอกอีเมลเพื่อรับโค้ดส่วนลดพิเศษสำหรับสมาชิกใหม่
                    </p>
                    <div className="flex gap-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="กรอกอีเมลของคุณ"
                            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-2 focus:ring-neon-purple outline-none"
                        />
                        <Button variant="primary" onClick={handleClose}>
                            รับโค้ด
                        </Button>
                    </div>
                    <p className="text-center text-xs text-gray-400 mt-4">
                        ไม่สแปม รับเฉพาะโปรโมชั่นพิเศษ
                    </p>
                </div>
            </div>
        </div>
    )
}

// ============================================
// 7. COUNTDOWN CTA (Urgency) - Hydration safe
// ============================================
export function CountdownCTA() {
    const [mounted, setMounted] = useState(false)
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 })

    useEffect(() => {
        setMounted(true)
        // Set initial time after mount
        setTimeLeft({ hours: 23, minutes: 59, seconds: 59 })

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 }
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
                return { hours: 23, minutes: 59, seconds: 59 } // Reset
            })
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    // Show placeholder during SSR
    if (!mounted) {
        return (
            <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="text-5xl">⚡</div>
                        <div>
                            <h3 className="text-xl font-bold">Flash Sale สิ้นสุดใน:</h3>
                            <div className="flex gap-2 mt-2">
                                <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                                    <div className="text-2xl font-bold font-mono">--</div>
                                    <div className="text-xs">ชั่วโมง</div>
                                </div>
                                <div className="text-2xl font-bold">:</div>
                                <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                                    <div className="text-2xl font-bold font-mono">--</div>
                                    <div className="text-xs">นาที</div>
                                </div>
                                <div className="text-2xl font-bold">:</div>
                                <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                                    <div className="text-2xl font-bold font-mono">--</div>
                                    <div className="text-xs">วินาที</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Link href="/promotions">
                        <button className="bg-white text-red-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105">
                            ช้อปเลย!
                            <ArrowRight className="inline-block w-5 h-5 ml-2" />
                        </button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-2xl p-6 text-white">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="text-5xl animate-pulse">⚡</div>
                    <div>
                        <h3 className="text-xl font-bold">Flash Sale สิ้นสุดใน:</h3>
                        <div className="flex gap-2 mt-2">
                            <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                                <div className="text-2xl font-bold font-mono">{String(timeLeft.hours).padStart(2, '0')}</div>
                                <div className="text-xs">ชั่วโมง</div>
                            </div>
                            <div className="text-2xl font-bold">:</div>
                            <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                                <div className="text-2xl font-bold font-mono">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                <div className="text-xs">นาที</div>
                            </div>
                            <div className="text-2xl font-bold">:</div>
                            <div className="bg-white/20 rounded-lg px-3 py-2 text-center">
                                <div className="text-2xl font-bold font-mono">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                <div className="text-xs">วินาที</div>
                            </div>
                        </div>
                    </div>
                </div>
                <Link href="/promotions">
                    <button className="bg-white text-red-500 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all hover:scale-105">
                        ช้อปเลย!
                        <ArrowRight className="inline-block w-5 h-5 ml-2" />
                    </button>
                </Link>
            </div>
        </div>
    )
}

// ============================================
// 8. MINI CTA BADGE
// ============================================
export function CTABadge({ text, href, variant = 'primary' }: { text: string; href: string; variant?: 'primary' | 'success' | 'warning' }) {
    const variants = {
        primary: 'bg-neon-purple hover:bg-purple-600',
        success: 'bg-emerald-500 hover:bg-emerald-600',
        warning: 'bg-amber-500 hover:bg-amber-600',
    }

    return (
        <Link href={href} className={`inline-flex items-center gap-2 ${variants[variant]} text-white px-4 py-2 rounded-full text-sm font-bold transition-all hover:scale-105`}>
            <span>{text}</span>
            <ArrowRight className="w-4 h-4" />
        </Link>
    )
}

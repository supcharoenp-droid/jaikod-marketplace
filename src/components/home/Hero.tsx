'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
    Search, Camera, Sparkles, Zap, ShieldCheck, ArrowRight,
    TrendingUp, Users, MapPin, Package, Star, Play,
    ChevronRight, Upload
} from 'lucide-react'
import AdvancedSearch from '@/components/search/AdvancedSearch'
import SmartSearch from '@/components/search/SmartSearch'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'

// Animated Counter Component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        let startTime: number
        let animationFrame: number

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            setCount(Math.floor(progress * end))
            if (progress < 1) {
                animationFrame = requestAnimationFrame(animate)
            }
        }

        animationFrame = requestAnimationFrame(animate)
        return () => cancelAnimationFrame(animationFrame)
    }, [end, duration])

    return <span>{count.toLocaleString()}{suffix}</span>
}

// Typing Animation Component
function TypingText({ texts, speed = 100 }: { texts: string[]; speed?: number }) {
    const [currentTextIndex, setCurrentTextIndex] = useState(0)
    const [currentText, setCurrentText] = useState('')
    const [isDeleting, setIsDeleting] = useState(false)

    useEffect(() => {
        const text = texts[currentTextIndex]
        const timeout = setTimeout(() => {
            if (!isDeleting) {
                if (currentText.length < text.length) {
                    setCurrentText(text.slice(0, currentText.length + 1))
                } else {
                    setTimeout(() => setIsDeleting(true), 2000)
                }
            } else {
                if (currentText.length > 0) {
                    setCurrentText(text.slice(0, currentText.length - 1))
                } else {
                    setIsDeleting(false)
                    setCurrentTextIndex((prev) => (prev + 1) % texts.length)
                }
            }
        }, isDeleting ? speed / 2 : speed)

        return () => clearTimeout(timeout)
    }, [currentText, isDeleting, currentTextIndex, texts, speed])

    return (
        <span className="inline-block min-w-[200px]">
            {currentText}
            <span className="animate-pulse">|</span>
        </span>
    )
}

export default function Hero() {
    const router = useRouter()
    const { t, language } = useLanguage()
    const { user } = useAuth()
    const [showAdvancedSearch, setShowAdvancedSearch] = useState(false)
    const [isHovering, setIsHovering] = useState(false)

    // Personalized greeting based on time of day
    const getGreeting = () => {
        const hour = new Date().getHours()
        const name = user?.displayName?.split(' ')[0] || ''

        if (language === 'th') {
            if (hour < 12) return name ? `สวัสดีตอนเช้า ${name}! ☀️` : 'สวัสดีตอนเช้า! ☀️'
            if (hour < 17) return name ? `สวัสดีตอนบ่าย ${name}! 🌤️` : 'สวัสดีตอนบ่าย! 🌤️'
            return name ? `สวัสดีตอนเย็น ${name}! 🌙` : 'สวัสดีตอนเย็น! 🌙'
        } else {
            if (hour < 12) return name ? `Good morning, ${name}! ☀️` : 'Good morning! ☀️'
            if (hour < 17) return name ? `Good afternoon, ${name}! 🌤️` : 'Good afternoon! 🌤️'
            return name ? `Good evening, ${name}! 🌙` : 'Good evening! 🌙'
        }
    }

    // Dynamic typing suggestions
    const searchSuggestions = language === 'th'
        ? ['iPhone มือสอง', 'รถยนต์ใกล้บ้าน', 'คอนโดให้เช่า', 'กระเป๋าแบรนด์เนม']
        : ['Used iPhone', 'Cars nearby', 'Condo for rent', 'Brand bags']

    return (
        <section className="relative pt-16 pb-8 lg:pt-24 lg:pb-12 overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-[30%] -right-[10%] w-[70%] h-[70%] bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-[120px] animate-pulse-slow" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[50%] bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-full blur-[150px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">

                    {/* Left Column: Content */}
                    <div className="flex-1 text-center lg:text-left space-y-6">
                        {/* Personalized Greeting */}
                        <div className="animate-fade-in-up">
                            <span className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
                                {getGreeting()}
                            </span>
                        </div>

                        {/* Main Headline */}
                        <h1
                            className="font-display font-extrabold tracking-tight animate-fade-in-up animation-delay-100"
                            style={{
                                fontSize: 'clamp(2.2rem, 4vw, 4rem)',
                                lineHeight: '1.15',
                            }}
                        >
                            <div className="mb-2">
                                {language === 'th' ? 'มาหาอะไรดีๆ กันไหม?' : 'Looking for something great?'}
                            </div>
                            <div className="text-lg md:text-2xl text-gray-600 dark:text-gray-400 font-normal mt-2">
                                {language === 'th'
                                    ? 'หรืออยากขายของ? AI ช่วยได้เลย!'
                                    : 'Or want to sell? AI can help!'}
                            </div>
                        </h1>

                        {/* Smart Search Bar */}
                        <div className="w-full max-w-xl mx-auto lg:mx-0 animate-fade-in-up animation-delay-200">
                            <SmartSearch />
                        </div>

                        {/* Quick Action Buttons */}
                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 animate-fade-in-up animation-delay-300">
                            <Link href="/sell">
                                <button className="group flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:scale-105 transition-all duration-300">
                                    <Camera className="w-5 h-5" />
                                    <span>{language === 'th' ? 'ถ่ายรูปขายเลย' : 'Snap & Sell'}</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </Link>
                            <Link href="/categories">
                                <button className="flex items-center gap-2 px-5 py-3 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700">
                                    <Search className="w-5 h-5" />
                                    <span>{language === 'th' ? 'ดูหมวดหมู่' : 'Browse Categories'}</span>
                                </button>
                            </Link>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex items-center justify-center lg:justify-start gap-6 pt-2 text-sm font-medium text-gray-500 dark:text-gray-400 animate-fade-in-up animation-delay-400">
                            <div className="flex items-center gap-2 hover:text-purple-600 transition-colors cursor-default">
                                <Zap className="w-4 h-4 text-yellow-500" />
                                <span>{language === 'th' ? 'ขายใน 30 วิ' : 'Sell in 30s'}</span>
                            </div>
                            <div className="flex items-center gap-2 hover:text-green-600 transition-colors cursor-default">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span>{language === 'th' ? 'ผู้ขายยืนยัน' : 'Verified'}</span>
                            </div>
                            <div className="flex items-center gap-2 hover:text-purple-600 transition-colors cursor-default">
                                <Sparkles className="w-4 h-4 text-purple-500" />
                                <span>{language === 'th' ? 'AI ฉลาด' : 'Smart AI'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Interactive Demo */}
                    <div className="flex-1 w-full relative h-[350px] lg:h-[450px] hidden md:block">
                        <div className="relative w-full h-full">
                            {/* Main Phone Frame Mockup */}
                            <div
                                className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-[420px] bg-gray-900 rounded-[2.5rem] border-[6px] border-gray-800 shadow-2xl z-20 overflow-hidden transition-all duration-500 ${isHovering ? 'scale-105 rotate-0' : 'rotate-[-5deg]'}`}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                            >
                                {/* Screen Content */}
                                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
                                    {/* Header */}
                                    <div className="h-14 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center px-4 justify-between">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 text-white" />
                                            <span className="text-white text-sm font-semibold">JaiKod</span>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                            <Users className="w-4 h-4 text-white" />
                                        </div>
                                    </div>

                                    {/* Demo Content - Live Stats */}
                                    <div className="p-3 space-y-3">
                                        <div className="bg-white/10 rounded-xl p-3">
                                            <div className="text-xs text-gray-400 mb-1">{language === 'th' ? 'สินค้าที่ลงขายวันนี้' : 'Listed Today'}</div>
                                            <div className="text-2xl font-bold text-white">
                                                <AnimatedCounter end={1234} suffix="+" />
                                            </div>
                                        </div>

                                        {/* Mini Product Cards */}
                                        <div className="space-y-2">
                                            {[
                                                { emoji: '📱', name: 'iPhone 15', price: '฿24,900', time: '2 นาที' },
                                                { emoji: '👟', name: 'Nike Air', price: '฿3,500', time: '5 นาที' },
                                                { emoji: '🎮', name: 'PS5', price: '฿12,900', time: '8 นาที' },
                                            ].map((item, i) => (
                                                <div
                                                    key={i}
                                                    className="flex items-center gap-3 bg-white/5 rounded-lg p-2 hover:bg-white/10 transition-colors cursor-pointer animate-fade-in-up"
                                                    style={{ animationDelay: `${i * 100}ms` }}
                                                >
                                                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-lg">
                                                        {item.emoji}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-white text-sm font-medium">{item.name}</div>
                                                        <div className="text-xs text-gray-400">{item.time}</div>
                                                    </div>
                                                    <div className="text-green-400 text-sm font-semibold">{item.price}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Floating Camera Button */}
                                    <Link href="/sell">
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 cursor-pointer hover:scale-110 transition-transform">
                                            <Camera className="w-6 h-6 text-white" />
                                        </div>
                                    </Link>
                                </div>
                            </div>

                            {/* Floating Cards */}
                            <div className="absolute top-16 right-8 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl z-30 animate-float border border-white/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                        <TrendingUp className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">{language === 'th' ? 'ขายได้วันนี้' : 'Sold Today'}</div>
                                        <div className="font-bold text-green-600">
                                            <AnimatedCounter end={567} /> {language === 'th' ? 'ชิ้น' : 'items'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute bottom-28 left-4 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-xl shadow-xl z-30 animate-float animation-delay-700 border border-white/50">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500">{language === 'th' ? 'กำลังออนไลน์' : 'Online Now'}</div>
                                        <div className="font-bold text-purple-600">
                                            <AnimatedCounter end={892} /> {language === 'th' ? 'คน' : 'users'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Bar */}
                <div className="mt-10 lg:mt-12">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 dark:border-gray-700/50 p-4 lg:p-6 animate-fade-in-up animation-delay-500">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-8">
                            {/* Stat 1 */}
                            <div className="text-center group cursor-default">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Package className="w-5 h-5 text-purple-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                                        <AnimatedCounter end={50000} suffix="+" />
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {language === 'th' ? 'สินค้าในระบบ' : 'Listed Items'}
                                </div>
                            </div>

                            {/* Stat 2 */}
                            <div className="text-center group cursor-default">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Users className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
                                        <AnimatedCounter end={5000} suffix="+" />
                                    </span>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {language === 'th' ? 'ผู้ขายที่ยืนยันแล้ว' : 'Verified Sellers'}
                                </div>
                            </div>

                            {/* Stat 3 */}
                            <div className="text-center group cursor-default">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <MapPin className="w-5 h-5 text-green-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">77</span>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {language === 'th' ? 'จังหวัดทั่วประเทศ' : 'Provinces Covered'}
                                </div>
                            </div>

                            {/* Stat 4 */}
                            <div className="text-center group cursor-default">
                                <div className="flex items-center justify-center gap-2 mb-1">
                                    <Star className="w-5 h-5 text-yellow-500 group-hover:scale-110 transition-transform" />
                                    <span className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">4.8</span>
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {language === 'th' ? 'คะแนนความพึงพอใจ' : 'User Rating'}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Advanced Search Modal */}
            {showAdvancedSearch && (
                <AdvancedSearch onClose={() => setShowAdvancedSearch(false)} />
            )}

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }
                .animation-delay-100 { animation-delay: 100ms; }
                .animation-delay-200 { animation-delay: 200ms; }
                .animation-delay-300 { animation-delay: 300ms; }
                .animation-delay-400 { animation-delay: 400ms; }
                .animation-delay-500 { animation-delay: 500ms; }
                .animation-delay-700 { animation-delay: 700ms; }
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; }
                    50% { opacity: 0.3; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
            `}</style>
        </section>
    )
}

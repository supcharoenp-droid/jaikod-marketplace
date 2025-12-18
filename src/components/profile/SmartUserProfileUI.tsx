'use client'

import React, { useState, useEffect } from 'react'
import { FeatureGuard, FeatureProvider } from '@/contexts/FeatureContext'
import { FEATURE_FLAGS } from '@/config/feature-flags'
import PhaseSwitcher from '@/components/debug/PhaseSwitcher'

// Modern UI Components
import ModernProfileHeader from './modern/ModernProfileHeader'
import ModernStatsCard from './modern/ModernStatsCard'
import TrustGamificationCard from './modern/TrustGamificationCard'
import AIAdvisorWidget from './modern/AIAdvisorWidget'

// Legacy / Internal
import { getSmartUserProfile, SmartUserProfile, UserRole } from '@/services/mockProfile'

import {
    Sparkles, User, ShoppingBag, Store,
    Zap, Award, TrendingUp, ShieldCheck,
    Star, MessageCircle, Wallet, Layers,
    Heart, Clock, MapPin, Camera, Settings,
    Grid, List, Share2, Filter, ChevronRight
} from 'lucide-react'

import TierProgressCard from './TierProgressCard'
import AIProfileCoach from './AIProfileCoach'

// --- Local Components (Dashboards) ---
// (Ensure these are defined below the main component)

// Main Component Definition (Moved to bottom)

const AIInsightsPanel = ({ profile }: { profile: SmartUserProfile }) => {
    return (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 p-5 rounded-2xl flex flex-col md:flex-row items-center gap-4 relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-200/50 rounded-full blur-3xl group-hover:bg-purple-300/50 transition-colors"></div>

            <div className="p-3 bg-white rounded-xl shadow-sm text-purple-600 z-10">
                <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex-1 text-center md:text-left z-10">
                <h3 className="font-bold text-gray-800 flex items-center justify-center md:justify-start gap-2">
                    AI Persona Analysis <span className="text-xs font-normal text-purple-600 bg-purple-100 px-2 py-0.5 rounded-full">Beta</span>
                </h3>
                <p className="text-sm text-gray-600 mt-1">{profile.persona.description}</p>
            </div>
            {profile.role !== 'buyer' && (
                <button className="bg-white text-purple-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition z-10">
                    ดูคำแนะนำทั้งหมด
                </button>
            )}
        </div>
    )
}

const BuyerDashboard = ({ data }: { data: SmartUserProfile['buyerData'] }) => {
    if (!data) return null;
    return (
        <div className="space-y-8">
            {/* Interests & Activity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                        <Heart className="w-5 h-5 text-pink-500" />
                        สินค้าที่คุณน่าจะชอบ (AI Picks)
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                        {data.aiRecommendations.map(p => (
                            <div key={p.id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all cursor-pointer">
                                <div className="aspect-[4/3] overflow-hidden">
                                    <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                </div>
                                <div className="p-4">
                                    <h3 className="font-medium text-gray-900 truncate">{p.title}</h3>
                                    <p className="text-purple-600 font-bold mt-1">฿{p.price.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Column: History */}
                <div className="space-y-4">
                    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-gray-400" /> ชมล่าสุด
                        </h3>
                        <div className="space-y-4">
                            {data.recentlyViewed.map(p => (
                                <div key={p.id} className="flex gap-3 items-center group cursor-pointer">
                                    <img src={p.images[0]} className="w-12 h-12 rounded-lg object-cover" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-800 truncate group-hover:text-purple-600 transition">{p.title}</p>
                                        <p className="text-xs text-gray-500">฿{p.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-2">ความสนใจของคุณ</h3>
                        <div className="flex flex-wrap gap-2">
                            {data.interests.map(tag => (
                                <span key={tag} className="text-xs bg-white text-blue-600 px-2 py-1 rounded-md border border-blue-100 shadow-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

const SellerMode = ({ data }: { data: SmartUserProfile['sellerData'] }) => {
    if (!data) return null;
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Trust Score Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="relative w-24 h-24 mb-4">
                        <svg className="w-full h-full transform -rotate-90">
                            <circle cx="48" cy="48" r="40" stroke="#f3f4f6" strokeWidth="8" fill="transparent" />
                            <circle cx="48" cy="48" r="40" stroke="#ec4899" strokeWidth="8" fill="transparent"
                                strokeDasharray={251.2}
                                strokeDashoffset={251.2 - (251.2 * data.trustScore) / 100}
                                className="transition-all duration-1000 ease-out"
                            />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800">
                            {data.trustScore}
                        </div>
                    </div>
                    <h3 className="font-bold text-gray-900">AI Trust Score</h3>
                    <p className="text-xs text-gray-500 mt-1">ระดับความน่าเชื่อถือสูงมาก</p>
                </div>

                {/* Metrics */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 col-span-2">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-500" /> ประสิทธิภาพร้านค้า (7 วันล่าสุด)
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-2xl font-bold text-gray-900">{data.performance.views.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">ยอดเข้าชม</div>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-xl">
                            <div className="text-2xl font-bold text-gray-900">{data.performance.clicks.toLocaleString()}</div>
                            <div className="text-xs text-gray-500">จำนวนคลิก</div>
                        </div>
                        <div className="p-4 bg-green-50 rounded-xl text-green-700">
                            <div className="text-2xl font-bold">{data.performance.ctr}%</div>
                            <div className="text-xs opacity-80">CTR</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Daily Tips */}
            <div className="space-y-3">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" /> คำแนะนำรายวัน
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {data.dailyTips.map((tip, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:border-yellow-200 transition">
                            <div className="p-2 bg-yellow-50 text-yellow-600 rounded-lg shrink-0">
                                {tip.type === 'timing' ? <Clock size={20} /> : <Settings size={20} />}
                            </div>
                            <div>
                                <h4 className="font-bold text-gray-800 text-sm">{tip.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">{tip.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const StoreMode = ({ data }: { data: SmartUserProfile['storeData'] }) => {
    if (!data) return null;
    return (
        <div className="space-y-8">
            {/* Store Highlights */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {data.highlights.map((hl, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-gray-100 text-center shadow-sm">
                        <ShieldCheck className="w-6 h-6 text-green-500 mx-auto mb-2" />
                        <span className="text-xs font-bold text-gray-700">{hl}</span>
                    </div>
                ))}
            </div>

            {/* Store Dashboard */}
            <div className="bg-gray-900 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>

                <div className="relative z-10">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h2 className="text-2xl font-bold">Store Performance</h2>
                            <p className="text-gray-400 text-sm">ภาพรวมประสิทธิภาพร้านค้าของคุณ</p>
                        </div>
                        <div className="bg-white/10 px-3 py-1 rounded-full text-xs backdrop-blur-md border border-white/20">
                            Inventory Health: {data.inventoryHealth}%
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div>
                            <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                                4.9
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Customer Rating</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">
                                2.5k
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Total Sales</div>
                        </div>
                        <div>
                            <div className="text-3xl font-bold text-white">
                                98%
                            </div>
                            <div className="text-xs text-gray-400 mt-1">Response Rate</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Feature Products */}
            <div>
                <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-4">
                    <Star className="w-5 h-5 text-orange-500" /> สินค้าแนะนำประจำสัปดาห์
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {data.topProducts.map(p => (
                        <div key={p.id} className="group bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-all">
                            <div className="aspect-square overflow-hidden bg-gray-100">
                                <img src={p.images[0]} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-3">
                                <h4 className="text-sm font-medium truncate">{p.title}</h4>
                                <p className="text-sm font-bold text-purple-600">฿{p.price.toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

// --- Main Layout ---

export default function SmartUserProfileUI() {
    const [role, setRole] = useState<UserRole>('buyer')
    const [profile, setProfile] = useState<SmartUserProfile | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchProfile = async (r: UserRole) => {
        setLoading(true)
        const data = await getSmartUserProfile(r)
        setProfile(data)
        setLoading(false)
    }

    useEffect(() => {
        fetchProfile(role)
    }, [role])

    return (
        <FeatureProvider>
            <div className={`min-h-screen transition-all duration-1000 ${profile ? `bg-gradient-to-br ${profile.theme.gradient} bg-opacity-10` : 'bg-gray-50'}`}>
                {/* Navbar (Mock - simplified for this view) */}
                <nav className="fixed w-full z-50 transition-all duration-300 bg-white/10 backdrop-blur-md border-b border-white/20">
                    {/* ... (Navbar content can be kept or simplified, keeping main parts) */}
                    <div className="container mx-auto px-6 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className={`w-6 h-6 ${profile ? `text-${profile.theme.primaryColor}-500` : 'text-blue-500'}`} />
                            <span className="font-bold text-xl tracking-tight text-gray-800">JaiKod <span className="text-gray-500">Profile AI</span></span>
                        </div>
                        <div className="flex gap-2">
                            {(['buyer', 'seller', 'store'] as const).map((r) => (
                                <button key={r} onClick={() => setRole(r)} className={`px-3 py-1 rounded-full text-xs font-bold capitalize transition-all ${role === r ? 'bg-black text-white' : 'bg-white/50 hover:bg-white text-gray-600'}`}>{r}</button>
                            ))}
                        </div>
                    </div>
                </nav>

                {loading ? (
                    <div className="h-screen flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin"></div>
                    </div>
                ) : !profile ? null : (
                    <div className="animate-in fade-in duration-700 pb-20">
                        {/* 1. Modern Header */}
                        <ModernProfileHeader
                            profile={profile}
                            onEdit={() => console.log('Edit')}
                            onViewAsBuyer={() => console.log('View As Buyer')}
                        />

                        <main className="container mx-auto px-6 max-w-7xl relative z-20 space-y-8 mt-[280px] md:mt-[180px]">

                            {/* 4. AI Advisor Box (Phase 2+) */}
                            {profile.coaching && (
                                <FeatureGuard phase={FEATURE_FLAGS.AI_PROFILE_COACH}>
                                    <div className="animate-in slide-in-from-bottom duration-500 delay-100">
                                        <AIAdvisorWidget suggestions={profile.coaching.suggestions} />
                                    </div>
                                </FeatureGuard>
                            )}

                            {/* Dashboard Grid Layout */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                                {/* Left Column: Stats Grid (Phase 1/3) */}
                                <div className="lg:col-span-2 space-y-8">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        <ModernStatsCard label="Followers" value={profile.stats.followers.toLocaleString()} icon={User} color="blue" delay={100} />
                                        <ModernStatsCard label="Rating" value={profile.stats.rating} subtext={`${profile.stats.reviews} reviews`} icon={Star} color="orange" delay={200} />
                                        <ModernStatsCard label="Items" value={profile.sellerData?.activeListings || 0} icon={ShoppingBag} color="pink" delay={300} />

                                        {/* Seller Specific Stats */}
                                        {role !== 'buyer' && (
                                            <>
                                                <ModernStatsCard label="Revenue" value="฿45.2k" subtext="This Month" icon={Wallet} color="green" delay={400} />
                                                <ModernStatsCard label="Response" value="< 5m" icon={MessageCircle} color="purple" delay={500} />
                                                <ModernStatsCard label="Orders" value={profile.sellerData?.performance?.ctr + '%' || '2.4%'} subtext="Conversion" icon={TrendingUp} color="blue" delay={600} />
                                            </>
                                        )}
                                    </div>

                                    {/* Additional Content (Existing Dashboards) */}
                                    <div className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white/50 shadow-sm min-h-[300px]">
                                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                                            <Layers className="w-5 h-5 text-gray-400" />
                                            Active Listings
                                        </h3>
                                        {/* Fallback to role-based content */}
                                        {role === 'buyer' && <BuyerDashboard data={profile.buyerData!} />}
                                        {role === 'seller' && <SellerMode data={profile.sellerData!} />}
                                        {role === 'store' && <StoreMode data={profile.storeData!} />}
                                    </div>
                                </div>

                                {/* Right Column: Trust & Gamification (Phase 3+) */}
                                <div className="space-y-6">
                                    {profile.tierData && (
                                        <FeatureGuard phase={FEATURE_FLAGS.SELLER_TIERS} fallback={null}>
                                            <div className="h-[400px] animate-in slide-in-from-right duration-700">
                                                <TrustGamificationCard
                                                    score={profile.tierData.progress} // Using progress as score proxy for now
                                                    verifiedSteps={[
                                                        { id: '1', label: 'Email Verified', isVerified: true },
                                                        { id: '2', label: 'Phone Verified', isVerified: true },
                                                        { id: '3', label: 'ID Card Verified', isVerified: role !== 'buyer' },
                                                        { id: '4', label: 'Bank Account', isVerified: role === 'store' },
                                                    ]}
                                                />
                                            </div>
                                        </FeatureGuard>
                                    )}

                                    {/* Legacy Tier Card if needed, or remove */}
                                </div>
                            </div>

                        </main>

                        <PhaseSwitcher />
                    </div>
                )}
            </div>
        </FeatureProvider>
    )
}

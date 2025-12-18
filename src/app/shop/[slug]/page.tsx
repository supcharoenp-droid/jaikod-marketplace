'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import {
    Star, MapPin, MessageCircle, Heart, Share2,
    Search, ShoppingBag, BadgeCheck, Zap,
    Ticket, ChevronRight, Clock, ShieldCheck, MoreVertical,
    CheckCircle2, Globe, Facebook, ArrowLeft, Edit, Sparkles, Languages
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { storeService, StoreProfile, Promotion } from '@/services/storeService'
import ProductCard from '@/components/product/ProductCard'
import { Product } from '@/types'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

// --- AI Shop Snapshot Component ---
function AiShopSnapshot({ description, language }: { description: string, language: string }) {
    // Determine if we need to show "Auto-translated" badge. 
    // In a real app, description would come with a language code or be translated on backend.
    // Here we simulate it.
    const isTranslated = language !== 'th';

    return (
        <div className="bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/30 relative overflow-hidden mb-6">
            <div className="absolute top-0 right-0 w-20 h-20 bg-purple-200/50 dark:bg-purple-800/10 rounded-full blur-xl -translate-y-1/2 translate-x-1/2" />

            <div className="flex items-start gap-3 relative z-10">
                <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 dark:text-white text-sm">
                            {language === 'th' ? 'AI สรุปจุดเด่นร้านค้า' : 'AI Shop Snapshot'}
                        </h3>
                        {isTranslated && (
                            <span className="flex items-center gap-1 text-[10px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-1.5 py-0.5 rounded text-gray-500">
                                <Languages className="w-3 h-3" />
                                {language === 'th' ? 'แปลอัตโนมัติ' : 'Auto-translated'}
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function StoreFrontPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params?.slug as string
    const { user } = useAuth()
    const { t, language } = useLanguage()

    // Data State
    const [profile, setProfile] = useState<StoreProfile | null>(null)
    const [promotions, setPromotions] = useState<Promotion[]>([])
    const [products, setProducts] = useState<Product[]>([])
    const [featuredProducts, setFeaturedProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)

    // UI State
    const [activeTab, setActiveTab] = useState<'home' | 'products' | 'reviews' | 'about'>('home')
    const [isFollowing, setIsFollowing] = useState(false)
    const [showHeaderTitle, setShowHeaderTitle] = useState(false)

    // Scroll Detection for Header Transition
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 200) {
                setShowHeaderTitle(true)
            } else {
                setShowHeaderTitle(false)
            }
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Load Data
    useEffect(() => {
        const loadData = async () => {
            setLoading(true)
            try {
                const [prof, promos, prods, feat] = await Promise.all([
                    storeService.getStoreProfile(slug),
                    storeService.getStorePromotions(slug),
                    storeService.getStoreProducts(slug, 'all'),
                    storeService.getStoreProducts(slug, 'featured')
                ])
                setProfile(prof)
                setPromotions(promos)
                setProducts(prods)
                setFeaturedProducts(feat)
            } catch (error) {
                console.error('Failed to load store data', error)
            } finally {
                setLoading(false)
            }
        }
        if (slug) loadData()
    }, [slug])

    const handleFollow = async () => {
        // Optimistic Update
        setIsFollowing(!isFollowing)
        await storeService.followStore(String(profile?.id))
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!profile) return <div className="p-8 text-center">{t('search_page.no_results')}</div>

    const isOwner = user?.uid === profile.ownerId || (user?.uid === 'user_123' && profile.slug === 'jaikod-official'); // Temporary mock check for demo

    return (
        <div className="min-h-screen bg-[#F8F9FB] dark:bg-black pb-24 font-sans text-gray-900 dark:text-gray-100">

            {/* 1. Sticky Narrative Header */}
            <header className={`sticky top-0 z-50 transition-all duration-300 ${showHeaderTitle ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => router.back()} className={`p-2 rounded-full transition-colors ${showHeaderTitle ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-900 dark:text-white' : 'bg-black/20 text-white backdrop-blur-sm hover:bg-black/30'}`}>
                            <ArrowLeft className="w-5 h-5" />
                        </button>

                        {/* Title Transition */}
                        <div className={`flex items-center gap-2 transition-opacity duration-300 ${showHeaderTitle ? 'opacity-100' : 'opacity-0'}`}>
                            <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                                <Image src={profile.logoUrl} alt="Logo" width={32} height={32} />
                            </div>
                            <span className="font-bold text-sm truncate max-w-[150px]">{profile.name}</span>
                            {profile.isOfficial && <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-50" />}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Follow Button in Header when scrolled */}
                        <div className={`transition-all duration-300 transform ${showHeaderTitle ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}`}>
                            <button
                                onClick={handleFollow}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${isFollowing ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300' : 'bg-purple-600 text-white'}`}
                            >
                                {isFollowing ? t('shop_page.following') : t('shop_page.follow')}
                            </button>
                        </div>
                        <button className={`p-2 rounded-full transition-colors ${showHeaderTitle ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200' : 'bg-black/20 text-white backdrop-blur-sm'}`}>
                            <Search className="w-5 h-5" />
                        </button>
                        <button className={`p-2 rounded-full transition-colors ${showHeaderTitle ? 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200' : 'bg-black/20 text-white backdrop-blur-sm'}`}>
                            <MoreVertical className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header>

            {/* 2. Hero Banner (Narrative Style) */}
            <div className="-mt-14 relative w-full h-[280px] md:h-[320px]">
                <div className="absolute inset-0 bg-gray-900">
                    <Image
                        src={profile.bannerUrl}
                        alt="Cover"
                        fill
                        className="object-cover opacity-80"
                        priority
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />

                {/* Hero Content */}
                <div className="absolute bottom-0 inset-x-0 p-4 md:p-8 container mx-auto text-white">
                    <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
                        {/* Logo Box */}
                        <div className="relative">
                            <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl border-2 border-white/20 bg-white overflow-hidden shadow-2xl">
                                <Image src={profile.logoUrl} alt="Store Logo" fill className="object-cover" />
                            </div>
                            {profile.isOfficial && (
                                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-1 rounded-full border-2 border-gray-900 shadow-sm z-10">
                                    <BadgeCheck className="w-4 h-4" />
                                </div>
                            )}
                        </div>

                        {/* Text Info */}
                        <div className="flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">{profile.name}</h1>
                                {profile.isVerified && !profile.isOfficial && (
                                    <span className="px-2 py-0.5 bg-green-500/80 backdrop-blur-md rounded text-[10px] font-bold uppercase tracking-wider">{t('shop_page.verified')}</span>
                                )}
                            </div>
                            <p className="text-white/80 text-sm md:text-base line-clamp-1">{profile.tagline}</p>

                            {/* Stats Row */}
                            <div className="flex items-center gap-4 text-xs md:text-sm font-medium pt-1 text-white/90">
                                <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                                    <span className="text-white font-bold">{profile.rating}</span>
                                    <span className="text-white/60">(4.2k {t('shop_page.reviews')})</span>
                                </div>
                                <div className="w-px h-3 bg-white/30" />
                                <div>{t('shop_page.followers')} {profile.followersCount.toLocaleString()}</div>
                                <div className="w-px h-3 bg-white/30" />
                                <div>{t('shop_page.sold')} {profile.totalSales > 1000 ? `${(profile.totalSales / 1000).toFixed(1)}k` : profile.totalSales}</div>
                            </div>
                        </div>

                        {/* Quick Actions Overlay (Desktop: Side, Mobile: Hidden/Use Footer) */}
                        <div className="hidden md:flex gap-3">
                            {isOwner ? (
                                <Button
                                    variant="outline"
                                    onClick={() => router.push('/seller/settings')}
                                    className="bg-white/10 border-white/20 text-white hover:bg-white/20 px-6"
                                >
                                    <Edit className="w-4 h-4 mr-2" />
                                    {t('shop_page.edit_shop')}
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant={isFollowing ? 'outline' : 'primary'}
                                        onClick={handleFollow}
                                        className={isFollowing ? 'bg-white/10 border-white/20 text-white hover:bg-white/20' : 'bg-purple-600 border-transparent hover:bg-purple-700'}
                                    >
                                        {isFollowing ? t('shop_page.following') : `+ ${t('shop_page.follow')}`}
                                    </Button>
                                    <Button variant="outline" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                                        <MessageCircle className="w-4 h-4 mr-2" />
                                        {t('shop_page.chat')}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Sticky Nav Tabs */}
            <div className="sticky top-14 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-sm">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
                        {['home', 'products', 'reviews', 'about'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`py-4 text-sm font-bold relative whitespace-nowrap transition-colors ${activeTab === tab
                                    ? 'text-purple-600 dark:text-purple-400'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}
                            >
                                {t(`shop_page.${tab}`)}
                                {activeTab === tab && (
                                    <motion.div
                                        layoutId="activeTabStore"
                                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-purple-600"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 4. Tab Content */}
            <div className="container mx-auto px-4 py-6">

                <AnimatePresence mode="wait">
                    {activeTab === 'home' && (
                        <motion.div
                            key="home"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-8"
                        >
                            {/* AI Shop Snapshot */}
                            <AiShopSnapshot description={profile.description} language={language} />

                            {/* Promotions Strip (Carousel) */}
                            {promotions.length > 0 && (
                                <section className="overflow-hidden">
                                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
                                        {promotions.map(promo => (
                                            <div key={promo.id} className="min-w-[280px] bg-gradient-to-br from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 border border-orange-100 dark:border-orange-800/30 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden shadow-sm">
                                                <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0 text-orange-500">
                                                    <Ticket className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1 z-10">
                                                    <div className="font-bold text-orange-600 dark:text-orange-400 text-sm mb-0.5">{promo.title}</div>
                                                    <div className="text-xs text-gray-500">{promo.code} • Exp {new Date(promo.expiryDate).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US')}</div>
                                                </div>
                                                <button className="bg-orange-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md hover:scale-105 transition-transform z-10">
                                                    Get
                                                </button>
                                                {/* Decor */}
                                                <div className="absolute -right-4 -top-4 w-16 h-16 bg-orange-200/20 rounded-full" />
                                            </div>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Trust Panel */}
                            <section className="bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-800">
                                <h3 className="text-sm font-bold uppercase text-gray-400 tracking-wider mb-4">{t('shop_page.trust_score')}</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="flex flex-col gap-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <div className="text-xs text-gray-500">{t('shop_page.trust_score')}</div>
                                        <div className="text-xl font-black text-green-500">{profile.trustScore}/100</div>
                                        <div className="h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
                                            <div className="h-full bg-green-500" style={{ width: `${profile.trustScore}%` }} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <div className="text-xs text-gray-500">{t('shop_page.response_rate')}</div>
                                        <div className="text-xl font-bold text-blue-500">{profile.responseRate}%</div>
                                        <div className="text-[10px] text-gray-400">{t('shop_page.fast_response')}</div>
                                    </div>
                                    <div className="flex flex-col gap-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <div className="text-xs text-gray-500">{t('shop_page.dispatch_time')}</div>
                                        <div className="text-xl font-bold text-gray-700 dark:text-gray-300">{profile.avgDispatchTime}</div>
                                        <div className="text-[10px] text-gray-400">{t('shop_page.fast_shipping')}</div>
                                    </div>
                                    <div className="flex flex-col gap-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                                        <div className="text-xs text-gray-500">{t('shop_page.joined_since')}</div>
                                        <div className="text-lg font-bold text-gray-700 dark:text-gray-300">{new Date(profile.joinedDate).getFullYear()}</div>
                                        <div className="text-[10px] text-gray-400">{t('shop_page.verified')}</div>
                                    </div>
                                </div>
                            </section>

                            {/* All Products Grid (Preview) */}
                            <section>
                                <h2 className="text-lg font-bold mb-4">{t('shop_page.new_arrivals')}</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                    {products.map(product => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>
                                <div className="mt-6 text-center">
                                    <Button variant="outline" onClick={() => setActiveTab('products')} className="w-full md:w-auto">
                                        {t('shop_page.view_all')} ({products.length * 3})
                                    </Button>
                                </div>
                            </section>

                        </motion.div>
                    )}

                    {activeTab === 'products' && (
                        <motion.div
                            key="products"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-4"
                        >
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-full text-sm font-bold">{t('shop_page.all_products')}</button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                                {products.map(product => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'about' && (
                        <motion.div
                            key="about"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="max-w-2xl mx-auto space-y-6"
                        >
                            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                <h2 className="text-xl font-bold mb-4">{t('shop_page.about')}</h2>
                                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6 whitespace-pre-line">
                                    {profile.description}
                                </p>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{t('shop_page.identity_verified')}</div>
                                            <div className="text-xs text-gray-500">{t('shop_page.identity_desc')}</div>
                                        </div>
                                        {profile.isVerified && <CheckCircle2 className="w-5 h-5 text-green-500 ml-auto" />}
                                    </div>
                                    <div className="w-full h-px bg-gray-100 dark:bg-gray-800" />
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
                                            <MapPin className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{t('shop_page.store_address')}</div>
                                            <div className="text-xs text-gray-500">{profile.location.district}, {profile.location.province}</div>
                                        </div>
                                    </div>
                                    <div className="w-full h-px bg-gray-100 dark:bg-gray-800" />
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                                            <Clock className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-sm">{t('shop_page.operating_hours')}</div>
                                            <div className="text-xs text-gray-500">{profile.operatingHours}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Socials */}
                            {profile.socialLinks && (
                                <div className="flex gap-4 justify-center">
                                    {profile.socialLinks.website && (
                                        <a href={profile.socialLinks.website} target="_blank" rel="noopener noreferrer" className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:scale-110 transition-transform text-gray-700">
                                            <Globe className="w-6 h-6" />
                                        </a>
                                    )}
                                    {profile.socialLinks.facebook && (
                                        <a href={`https://facebook.com/${profile.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-blue-600 rounded-full shadow-sm hover:scale-110 transition-transform text-white">
                                            <Facebook className="w-6 h-6" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* 5. Persistent Footer CTA */}
            <div className="fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 p-4 safe-area-pb">
                <div className="container mx-auto max-w-lg flex items-center gap-3">
                    {isOwner ? (
                        <button
                            onClick={() => router.push('/seller/settings')}
                            className="w-full py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2"
                        >
                            <Edit className="w-5 h-5" />
                            {t('shop_page.edit_shop')}
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={() => router.push('/chat')}
                                className="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-purple-600 min-w-[60px]"
                            >
                                <MessageCircle className="w-6 h-6" />
                                <span className="text-[10px] font-medium">{t('shop_page.chat')}</span>
                            </button>
                            <button className="flex flex-col items-center justify-center gap-1 text-gray-500 hover:text-purple-600 min-w-[60px]">
                                <Share2 className="w-6 h-6" />
                                <span className="text-[10px] font-medium">{t('shop_page.share')}</span>
                            </button>
                            <div className="flex-1 flex gap-2">
                                <button
                                    onClick={handleFollow}
                                    className={`flex-1 py-3 rounded-xl font-bold transition-all ${isFollowing ? 'bg-gray-100 text-gray-700' : 'bg-gray-100 text-gray-900'}`}
                                >
                                    {isFollowing ? t('shop_page.following') : t('shop_page.follow')}
                                </button>
                                <button
                                    onClick={() => setActiveTab('products')}
                                    className="flex-1 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-200 dark:shadow-purple-900/30"
                                >
                                    {t('shop_page.visit_store')}
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

        </div>
    )
}

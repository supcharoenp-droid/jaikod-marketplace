'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
    ArrowLeft, Zap, Star, Crown, CheckCircle, Clock, Eye, MessageCircle,
    TrendingUp, Sparkles, Shield, Gift, AlertTriangle, Loader2, X,
    ChevronRight, Info, Flame
} from 'lucide-react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import { getListingById, UniversalListing } from '@/lib/listings'
import {
    BOOST_PACKAGES,
    getPackagesForSeller,
    calculateBoostPrice,
    formatBoostDuration
} from '@/lib/boost/packages'
import { createBoost, getActiveBoostForListing } from '@/lib/boost/boostService'
import { getAccount } from '@/lib/jaistar/account'
import { BoostPackage } from '@/lib/boost/types'

// ==========================================
// TYPES
// ==========================================

type SellerAccountType = 'individual' | 'general_store' | 'official_store'

// ==========================================
// BOOST PACKAGE CARD
// ==========================================

interface PackageCardProps {
    pkg: BoostPackage
    selected: boolean
    onSelect: () => void
    sellerType: SellerAccountType
    language: 'th' | 'en'
}

function PackageCard({ pkg, selected, onSelect, sellerType, language }: PackageCardProps) {
    const pricing = calculateBoostPrice(pkg.id, sellerType)
    const duration = formatBoostDuration(pkg.duration_hours)

    const isPopular = pkg.id === 'premium_24h'
    const isBestValue = pkg.original_price !== undefined

    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelect}
            className={`relative cursor-pointer rounded-2xl border-2 p-5 transition-all ${selected
                ? 'border-purple-500 bg-purple-500/10 ring-2 ring-purple-500/30'
                : 'border-slate-700 bg-slate-800/50 hover:border-slate-600'
                }`}
        >
            {/* Popular Badge */}
            {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {language === 'th' ? 'ยอดนิยม' : 'Popular'}
                </div>
            )}

            {/* Best Value Badge */}
            {isBestValue && !isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                    <Gift className="w-3 h-3" />
                    {language === 'th' ? 'คุ้มค่า' : 'Best Value'}
                </div>
            )}

            <div className="flex items-start justify-between gap-4">
                {/* Icon & Name */}
                <div className="flex items-center gap-3">
                    <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${pkg.badge_color}20` }}
                    >
                        {pkg.badge_icon}
                    </div>
                    <div>
                        <h3 className="font-bold text-white">
                            {language === 'th' ? pkg.name_th : pkg.name}
                        </h3>
                        <p className="text-sm text-gray-400">
                            {language === 'th' ? duration.th : duration.en}
                        </p>
                    </div>
                </div>

                {/* Price */}
                <div className="text-right">
                    {pricing?.discount ? (
                        <>
                            <div className="text-xs text-gray-500 line-through">
                                ⭐ {pricing.original}
                            </div>
                            <div className="text-xl font-bold text-purple-400">
                                ⭐ {pricing.final}
                            </div>
                            {pricing.savings_percent > 0 && (
                                <div className="text-xs text-green-400">
                                    -{pricing.savings_percent}%
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="text-xl font-bold text-purple-400">
                            ⭐ {pkg.price_jaistar}
                        </div>
                    )}
                </div>
            </div>

            {/* Description */}
            <p className="mt-3 text-sm text-gray-400">
                {language === 'th' ? pkg.description_th : pkg.description}
            </p>

            {/* Features */}
            <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {pkg.visibility_multiplier}x {language === 'th' ? 'มองเห็น' : 'visibility'}
                </span>
                {pkg.highlight_badge && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        {language === 'th' ? 'ป้ายเด่น' : 'Badge'}
                    </span>
                )}
                {pkg.homepage_feature && (
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-300 text-xs rounded-full flex items-center gap-1">
                        <Crown className="w-3 h-3" />
                        {language === 'th' ? 'หน้าแรก' : 'Homepage'}
                    </span>
                )}
            </div>

            {/* Expected Results */}
            <div className="mt-4 pt-4 border-t border-slate-700 flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    +{pkg.avg_view_increase}% views
                </span>
                <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    +{pkg.avg_inquiry_increase}% inquiries
                </span>
            </div>

            {/* Selection Indicator */}
            {selected && (
                <div className="absolute top-3 right-3">
                    <CheckCircle className="w-6 h-6 text-purple-500" />
                </div>
            )}
        </motion.div>
    )
}

// ==========================================
// JAISTAR BALANCE CARD
// ==========================================

interface BalanceCardProps {
    balance: number
    required: number
    language: 'th' | 'en'
}

function BalanceCard({ balance, required, language }: BalanceCardProps) {
    const hasEnough = balance >= required

    return (
        <div className={`p-4 rounded-xl ${hasEnough ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-red-900/30 border border-red-700'}`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-500/20 rounded-full flex items-center justify-center text-xl">
                        ⭐
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">
                            {language === 'th' ? 'JaiStar ของคุณ' : 'Your JaiStar'}
                        </p>
                        <p className="text-xl font-bold text-white">
                            {balance.toLocaleString()} <span className="text-sm text-gray-400">แต้ม</span>
                        </p>
                    </div>
                </div>

                {!hasEnough && (
                    <Link
                        href="/wallet"
                        className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-medium rounded-lg hover:opacity-90 transition-opacity"
                    >
                        + {language === 'th' ? 'เติมแต้ม' : 'Top Up'}
                    </Link>
                )}
            </div>

            {!hasEnough && (
                <div className="mt-3 p-2 bg-red-500/20 rounded-lg flex items-center gap-2 text-red-300 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    {language === 'th'
                        ? `ต้องการ ${required - balance} แต้มเพิ่มเติม`
                        : `Need ${required - balance} more stars`
                    }
                </div>
            )}
        </div>
    )
}

// ==========================================
// LISTING PREVIEW CARD
// ==========================================

interface ListingPreviewProps {
    listing: UniversalListing
    selectedPackage: BoostPackage | null
}

function ListingPreview({ listing, selectedPackage }: ListingPreviewProps) {
    return (
        <div className="bg-slate-800/50 rounded-xl overflow-hidden">
            <div className="relative aspect-video">
                {listing.thumbnail_url ? (
                    <Image
                        src={listing.thumbnail_url}
                        alt={listing.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full bg-slate-700 flex items-center justify-center text-4xl">
                        📷
                    </div>
                )}

                {/* Boost Badge Preview */}
                {selectedPackage && (
                    <div
                        className="absolute top-2 left-2 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 text-white"
                        style={{ backgroundColor: selectedPackage.badge_color }}
                    >
                        {selectedPackage.badge_icon}
                        {selectedPackage.type === 'urgent' && 'ขายด่วน!'}
                        {selectedPackage.type === 'premium' && 'พรีเมียม'}
                        {selectedPackage.type === 'homepage' && 'แนะนำ'}
                    </div>
                )}
            </div>

            <div className="p-4">
                <h3 className="font-semibold text-white line-clamp-2">{listing.title}</h3>
                <p className="text-lg font-bold text-purple-400 mt-1">
                    ฿{listing.price.toLocaleString()}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                        <Eye className="w-4 h-4" />
                        {listing.stats?.views || 0}
                    </span>
                    <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {listing.stats?.inquiries || 0}
                    </span>
                </div>
            </div>
        </div>
    )
}

// ==========================================
// MAIN BOOST PAGE CONTENT
// ==========================================

function BoostPageContent() {
    const router = useRouter()
    const params = useParams()
    const listingId = params.id as string

    const { language } = useLanguage()
    const { user, storeStatus } = useAuth()

    const [loading, setLoading] = useState(true)
    const [purchasing, setPurchasing] = useState(false)
    const [listing, setListing] = useState<UniversalListing | null>(null)
    const [existingBoost, setExistingBoost] = useState<any>(null)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    const [selectedPackageId, setSelectedPackageId] = useState<string>('premium_24h')

    // DEV MODE: Set to true for testing boost flow with unlimited JaiStar
    const DEV_MODE = process.env.NODE_ENV === 'development'

    // Mock JaiStar balance (should come from user profile/wallet)
    const [jaistarBalance, setJaistarBalance] = useState(0)

    // Get seller account type from storeStatus
    const sellerType = storeStatus.sellerType
    const accountType: SellerAccountType =
        sellerType === 'official_store' ? 'official_store' :
            sellerType === 'general_store' ? 'general_store' : 'individual'

    // Get available packages for this seller
    const availablePackages = getPackagesForSeller(accountType)

    // Selected package
    const selectedPackage = BOOST_PACKAGES.find(p => p.id === selectedPackageId) || null
    const pricing = selectedPackage ? calculateBoostPrice(selectedPackage.id, accountType) : null
    const finalPrice = pricing?.final || selectedPackage?.price_jaistar || 0

    // Load listing and check for existing boost
    useEffect(() => {
        loadData()
    }, [listingId, user])

    const loadData = async () => {
        if (!listingId) return

        setLoading(true)
        setError(null)

        try {
            // Load listing
            const listingData = await getListingById(listingId)
            if (!listingData) {
                setError(language === 'th' ? 'ไม่พบประกาศ' : 'Listing not found')
                return
            }

            // Check ownership
            if (user && listingData.seller_id !== user.uid) {
                setError(language === 'th' ? 'คุณไม่ใช่เจ้าของประกาศนี้' : 'Not authorized')
                return
            }

            setListing(listingData)

            // Load JaiStar balance
            if (user) {
                const account = await getAccount(user.uid)
                if (account) {
                    setJaistarBalance(account.balance)
                }
            }

            // Check for existing boost
            const activeBoost = await getActiveBoostForListing(listingId)
            if (activeBoost) {
                setExistingBoost(activeBoost)
            }

        } catch (err: any) {
            console.error('Error loading data:', err)
            // Handle error object from Firebase
            const errorMessage = typeof err === 'object' && err !== null
                ? (err.message || err.code || JSON.stringify(err))
                : String(err)
            setError(language === 'th' ? 'เกิดข้อผิดพลาด: ' + errorMessage : 'Error: ' + errorMessage)
        } finally {
            setLoading(false)
        }
    }

    const handlePurchase = async () => {
        if (!user || !listing || !selectedPackage) return

        if (jaistarBalance < finalPrice) {
            router.push('/wallet')
            return
        }

        setPurchasing(true)
        setError(null)

        try {
            const result = await createBoost({
                user_id: user.uid,
                listing_id: listing.id,
                seller_id: user.uid,
                package_id: selectedPackage.id,
                seller_type: accountType
            })

            if (result.success) {
                setSuccess(true)
                // Update local balance
                if (result.new_balance !== undefined) {
                    setJaistarBalance(result.new_balance)
                }
                // Redirect after 2 seconds
                setTimeout(() => {
                    router.push(`/listing/${listing.slug}`)
                }, 2000)
            } else {
                // Fix: Handle object error from boostService
                const errorObj = result.error as any
                const errorMsg = typeof errorObj === 'object' && errorObj !== null
                    ? (errorObj.message || errorObj.code || 'Failed to create boost')
                    : (typeof errorObj === 'string' ? errorObj : 'Failed to create boost')
                setError(errorMsg)
            }
        } catch (err: any) {
            console.error('Error creating boost:', err)
            setError(err.message || 'Failed to create boost')
        } finally {
            setPurchasing(false)
        }
    }

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-purple-500 mx-auto mb-4" />
                    <p className="text-gray-400">{language === 'th' ? 'กำลังโหลด...' : 'Loading...'}</p>
                </div>
            </div>
        )
    }

    // Error State
    if (error && !listing) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <div className="text-center max-w-md px-4">
                    <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-xl font-bold text-white mb-2">
                        {language === 'th' ? 'เกิดข้อผิดพลาด' : 'Error'}
                    </h1>
                    <p className="text-gray-400 mb-6">{error}</p>
                    <Link
                        href="/profile/listings"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {language === 'th' ? 'กลับ' : 'Back'}
                    </Link>
                </div>
            </div>
        )
    }

    // Success State
    if (success) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center"
                >
                    <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Zap className="w-12 h-12 text-yellow-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        {language === 'th' ? '🎉 Boost สำเร็จ!' : '🎉 Boost Activated!'}
                    </h1>
                    <p className="text-gray-400">
                        {language === 'th' ? 'ประกาศของคุณจะเริ่มโปรโมททันที' : 'Your listing is now boosted'}
                    </p>
                </motion.div>
            </div>
        )
    }

    // Already Boosted State
    if (existingBoost) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 pb-24">
                <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
                    <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-800 rounded-lg">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <h1 className="text-lg font-bold text-white">
                            {language === 'th' ? 'โปรโมทประกาศ' : 'Boost Listing'}
                        </h1>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto px-4 py-8">
                    <div className="bg-yellow-900/30 border border-yellow-700 rounded-2xl p-6 text-center">
                        <Zap className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-white mb-2">
                            {language === 'th' ? 'ประกาศนี้กำลังถูก Boost อยู่' : 'This listing is already boosted'}
                        </h2>
                        <p className="text-gray-400 mb-4">
                            {language === 'th'
                                ? 'คุณสามารถ Boost เพิ่มได้หลังจากหมดอายุ'
                                : 'You can boost again after the current boost expires'
                            }
                        </p>
                        <Link
                            href={`/listing/${listing?.slug}`}
                            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-500 text-white font-medium rounded-xl hover:bg-purple-600"
                        >
                            {language === 'th' ? 'ดูประกาศ' : 'View Listing'}
                            <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 pb-32">
            {/* Header */}
            <header className="sticky top-0 z-40 backdrop-blur-xl bg-slate-900/70 border-b border-white/10">
                <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-white flex items-center gap-2">
                            <Zap className="w-5 h-5 text-yellow-400" />
                            {language === 'th' ? 'โปรโมทประกาศ' : 'Boost Listing'}
                        </h1>
                        <p className="text-sm text-gray-400">{listing?.listing_code}</p>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 py-6">
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Left: Package Selection */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            {language === 'th' ? 'เลือกแพ็กเกจ' : 'Choose Package'}
                        </h2>

                        <div className="space-y-4">
                            {availablePackages.map(pkg => (
                                <PackageCard
                                    key={pkg.id}
                                    pkg={pkg}
                                    selected={selectedPackageId === pkg.id}
                                    onSelect={() => setSelectedPackageId(pkg.id)}
                                    sellerType={accountType}
                                    language={language as 'th' | 'en'}
                                />
                            ))}
                        </div>

                        {/* Benefits */}
                        <div className="bg-slate-800/50 rounded-xl p-5 mt-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-green-400" />
                                {language === 'th' ? 'ทำไมต้อง Boost?' : 'Why Boost?'}
                            </h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <TrendingUp className="w-5 h-5 text-blue-400 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-white">
                                            {language === 'th' ? 'เพิ่มยอดดู 2-15 เท่า' : '2-15x More Views'}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {language === 'th' ? 'ประกาศของคุณจะแสดงบ่อยขึ้น' : 'Your listing shows more often'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Star className="w-5 h-5 text-yellow-400 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-white">
                                            {language === 'th' ? 'ป้ายเด่นสะดุดตา' : 'Eye-catching Badge'}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {language === 'th' ? 'ดึงดูดความสนใจผู้ซื้อ' : 'Attract buyer attention'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MessageCircle className="w-5 h-5 text-purple-400 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-white">
                                            {language === 'th' ? 'ขายได้เร็วขึ้น' : 'Sell Faster'}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {language === 'th' ? 'มีคนทักมากขึ้น 80-400%' : '80-400% more inquiries'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Clock className="w-5 h-5 text-orange-400 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-white">
                                            {language === 'th' ? 'เริ่มทันที' : 'Instant Activation'}
                                        </p>
                                        <p className="text-sm text-gray-400">
                                            {language === 'th' ? 'ไม่ต้องรอ เริ่มโปรโมททันที' : 'No waiting, starts immediately'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Listing Preview & Checkout */}
                    <div className="space-y-4">
                        {/* Listing Preview */}
                        {listing && (
                            <ListingPreview listing={listing} selectedPackage={selectedPackage} />
                        )}

                        {/* JaiStar Balance */}
                        <BalanceCard
                            balance={jaistarBalance}
                            required={finalPrice}
                            language={language as 'th' | 'en'}
                        />

                        {/* Order Summary */}
                        {selectedPackage && (
                            <div className="bg-slate-800 rounded-xl p-5">
                                <h3 className="font-bold text-white mb-4">
                                    {language === 'th' ? 'สรุปรายการ' : 'Order Summary'}
                                </h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            {language === 'th' ? 'แพ็กเกจ' : 'Package'}
                                        </span>
                                        <span className="text-white font-medium">
                                            {language === 'th' ? selectedPackage.name_th : selectedPackage.name}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">
                                            {language === 'th' ? 'ระยะเวลา' : 'Duration'}
                                        </span>
                                        <span className="text-white">
                                            {formatBoostDuration(selectedPackage.duration_hours)[language as 'th' | 'en']}
                                        </span>
                                    </div>
                                    {pricing?.discount && pricing.discount > 0 && (
                                        <div className="flex justify-between text-green-400">
                                            <span>{language === 'th' ? 'ส่วนลด' : 'Discount'}</span>
                                            <span>-{pricing.discount} ⭐</span>
                                        </div>
                                    )}
                                    <div className="border-t border-slate-700 pt-3 flex justify-between">
                                        <span className="text-white font-bold">
                                            {language === 'th' ? 'รวมทั้งหมด' : 'Total'}
                                        </span>
                                        <span className="text-xl font-bold text-purple-400">
                                            ⭐ {finalPrice}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Error */}
                        {error && (
                            <div className="p-4 bg-red-900/30 border border-red-700 rounded-xl text-red-300 text-sm flex items-center gap-2">
                                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Bottom Purchase Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-white/10 p-4 z-50">
                <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
                    <div>
                        <p className="text-gray-400 text-sm">
                            {language === 'th' ? 'รวมทั้งหมด' : 'Total'}
                        </p>
                        <p className="text-xl font-bold text-white">
                            ⭐ {finalPrice} <span className="text-sm text-gray-400">แต้ม</span>
                        </p>
                    </div>
                    <button
                        onClick={handlePurchase}
                        disabled={purchasing || jaistarBalance < finalPrice}
                        className="flex-1 md:flex-none md:min-w-[200px] flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white font-bold rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {purchasing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                {language === 'th' ? 'กำลังดำเนินการ...' : 'Processing...'}
                            </>
                        ) : jaistarBalance < finalPrice ? (
                            <>
                                <Gift className="w-5 h-5" />
                                {language === 'th' ? 'เติมแต้ม' : 'Top Up Stars'}
                            </>
                        ) : (
                            <>
                                <Zap className="w-5 h-5" />
                                {language === 'th' ? 'เริ่ม Boost เลย!' : 'Boost Now!'}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

// ==========================================
// EXPORT WITH SUSPENSE
// ==========================================

export default function BoostPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
            </div>
        }>
            <BoostPageContent />
        </Suspense>
    )
}

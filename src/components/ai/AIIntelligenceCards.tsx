'use client'

import { useState, useMemo } from 'react'
import { UniversalListing } from '@/lib/listings'

// ==========================================
// AI DEAL SCORE CARD
// คำนวณและแสดงคะแนนความคุ้มค่าของประกาศ
// ==========================================

interface DealScoreProps {
    listing: UniversalListing
    language?: 'th' | 'en'
}

export function AIDealScoreCard({ listing, language = 'th' }: DealScoreProps) {
    const score = useMemo(() => calculateDealScore(listing), [listing])

    const getScoreColor = (s: number) => {
        if (s >= 85) return 'from-green-500 to-emerald-500'
        if (s >= 70) return 'from-blue-500 to-cyan-500'
        if (s >= 50) return 'from-yellow-500 to-orange-500'
        return 'from-red-500 to-pink-500'
    }

    const getScoreLabel = (s: number) => {
        if (s >= 85) return { th: 'ดีลดีมาก!', en: 'Great Deal!' }
        if (s >= 70) return { th: 'ราคาเหมาะสม', en: 'Fair Price' }
        if (s >= 50) return { th: 'พิจารณาได้', en: 'Consider' }
        return { th: 'ควรต่อราคา', en: 'Negotiate' }
    }

    const getScoreEmoji = (s: number) => {
        if (s >= 85) return '🔥'
        if (s >= 70) return '✨'
        if (s >= 50) return '👀'
        return '💬'
    }

    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-5 border border-white/10">
            {/* Glow Effect */}
            <div className={`absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br ${getScoreColor(score.total)} rounded-full blur-3xl opacity-30`} />

            {/* Header */}
            <div className="relative flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🤖</span>
                </div>
                <div>
                    <h3 className="text-white font-bold text-lg">
                        {language === 'th' ? 'AI วิเคราะห์' : 'AI Analysis'}
                    </h3>
                    <p className="text-gray-400 text-xs">
                        {language === 'th' ? 'ประเมินจากข้อมูล 6 ด้าน' : 'Based on 6 factors'}
                    </p>
                </div>
            </div>

            {/* Score Circle */}
            <div className="relative flex items-center justify-center mb-5">
                <div className="relative">
                    {/* Background Ring */}
                    <svg className="w-32 h-32 transform -rotate-90">
                        <circle cx="64" cy="64" r="56" stroke="#374151" strokeWidth="8" fill="none" />
                        <circle
                            cx="64" cy="64" r="56"
                            stroke="url(#scoreGradient)"
                            strokeWidth="8"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray={`${score.total * 3.52} 352`}
                            className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8B5CF6" />
                                <stop offset="100%" stopColor="#EC4899" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Score Number */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-4xl font-bold text-white">{score.total}</span>
                        <span className="text-gray-400 text-sm">/100</span>
                    </div>
                </div>

                {/* Score Badge */}
                <div className={`absolute -right-2 top-0 px-3 py-1.5 bg-gradient-to-r ${getScoreColor(score.total)} rounded-full text-white text-sm font-medium shadow-lg`}>
                    {getScoreEmoji(score.total)} {getScoreLabel(score.total)[language]}
                </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-2">
                {score.breakdown.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <span className="text-lg w-6">{item.icon}</span>
                        <div className="flex-1">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-gray-400">{item.label[language]}</span>
                                <span className="text-gray-300">+{item.score}</span>
                            </div>
                            <div className="h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r ${item.score >= 15 ? 'from-green-500 to-emerald-500' : item.score >= 10 ? 'from-blue-500 to-cyan-500' : 'from-yellow-500 to-orange-500'} rounded-full transition-all duration-500`}
                                    style={{ width: `${(item.score / item.max) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Insight */}
            <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                <p className="text-purple-300 text-sm">
                    💡 {score.insight[language]}
                </p>
            </div>
        </div>
    )
}

// Calculate Deal Score - Category-Aware
function calculateDealScore(listing: UniversalListing) {
    const data = listing.template_data
    const categoryType = listing.category_type
    let total = 0
    const breakdown: { icon: string; label: { th: string; en: string }; score: number; max: number }[] = []

    // 1. Price vs Market (20 points max) - ALL CATEGORIES
    const priceScore = listing.ai_content?.price_analysis?.price_position === 'below_market' ? 20 :
        listing.ai_content?.price_analysis?.price_position === 'at_market' ? 15 : 10
    breakdown.push({
        icon: '💰',
        label: { th: 'ราคาเทียบตลาด', en: 'Price vs Market' },
        score: priceScore,
        max: 20
    })
    total += priceScore

    // Category-specific scoring factors
    if (categoryType === 'car' || categoryType === 'motorcycle') {
        // ===== CAR & MOTORCYCLE SCORING =====
        // 2. Mileage Score (15 points max)
        const mileage = Number(data.mileage) || 0
        const year = Number(data.year) || 2020
        const carAge = new Date().getFullYear() + 543 - year
        const avgMileagePerYear = carAge > 0 ? mileage / carAge : mileage
        const mileageScore = avgMileagePerYear < 10000 ? 15 : avgMileagePerYear < 15000 ? 12 : avgMileagePerYear < 20000 ? 10 : 5
        breakdown.push({
            icon: '🛣️',
            label: { th: 'ไมล์/ปี', en: 'Mileage/Year' },
            score: mileageScore,
            max: 15
        })
        total += mileageScore

        // 3. Condition History (20 points max)
        const hasNoAccident = data.condition_history === 'no_accident'
        const conditionScore = hasNoAccident ? 20 : 10
        breakdown.push({
            icon: '🔧',
            label: { th: 'ประวัติสภาพ', en: 'Condition History' },
            score: conditionScore,
            max: 20
        })
        total += conditionScore

        // 4. Service History (15 points max)
        const serviceScore = data.service_history === 'dealer' ? 15 : data.service_history === 'mixed' ? 10 : 5
        breakdown.push({
            icon: '🏥',
            label: { th: 'ประวัติเซอร์วิส', en: 'Service History' },
            score: serviceScore,
            max: 15
        })
        total += serviceScore

        // 5. Documentation (15 points max)
        const hasBook = data.registration === 'book_complete' || data.book_status === 'original'
        const docScore = hasBook ? 15 : 8
        breakdown.push({
            icon: '📄',
            label: { th: 'เอกสารครบ', en: 'Documentation' },
            score: docScore,
            max: 15
        })
        total += docScore

    } else if (categoryType === 'mobile') {
        // ===== MOBILE PHONE SCORING =====
        // 2. Battery Health (15 points max)
        const batteryHealth = String(data.battery_health || '').toLowerCase()
        let batteryScore = 5
        if (batteryHealth.includes('100') || batteryHealth.includes('95-99')) batteryScore = 15
        else if (batteryHealth.includes('90-94')) batteryScore = 12
        else if (batteryHealth.includes('85-89')) batteryScore = 10
        else if (batteryHealth.includes('80-84')) batteryScore = 8
        breakdown.push({
            icon: '🔋',
            label: { th: 'สุขภาพแบตเตอรี่', en: 'Battery Health' },
            score: batteryScore,
            max: 15
        })
        total += batteryScore

        // 3. Screen Condition (15 points max)
        const screenCondition = String(data.screen_condition || '').toLowerCase()
        let screenScore = 5
        if (screenCondition.includes('like_new') || screenCondition.includes('excellent')) screenScore = 15
        else if (screenCondition.includes('good')) screenScore = 12
        else if (screenCondition.includes('fair')) screenScore = 8
        breakdown.push({
            icon: '📱',
            label: { th: 'สภาพหน้าจอ', en: 'Screen Condition' },
            score: screenScore,
            max: 15
        })
        total += screenScore

        // 4. iCloud Status (20 points max)
        const icloudStatus = String(data.icloud_status || '').toLowerCase()
        const icloudScore = icloudStatus.includes('logged_out') || icloudStatus.includes('not_applicable') ? 20 : 5
        breakdown.push({
            icon: '☁️',
            label: { th: 'สถานะ iCloud', en: 'iCloud Status' },
            score: icloudScore,
            max: 20
        })
        total += icloudScore

        // 5. Accessories (15 points max)
        const accessories = String(data.accessories || '').toLowerCase()
        let accessoryScore = 5
        if (accessories.includes('full_box') || accessories.includes('box,charger,adapter')) accessoryScore = 15
        else if (accessories.includes('charger,adapter') || accessories.includes('charger_only')) accessoryScore = 10
        breakdown.push({
            icon: '📦',
            label: { th: 'อุปกรณ์ครบ', en: 'Accessories' },
            score: accessoryScore,
            max: 15
        })
        total += accessoryScore

    } else if (categoryType === 'real_estate') {
        // ===== REAL ESTATE SCORING =====
        // 2. Location Score (15 points max)
        const locationScore = listing.location?.province ? 12 : 8
        breakdown.push({
            icon: '📍',
            label: { th: 'ทำเลที่ตั้ง', en: 'Location' },
            score: locationScore,
            max: 15
        })
        total += locationScore

        // 3. Facilities (15 points max)
        const facilityScore = data.parking ? 15 : 10
        breakdown.push({
            icon: '🏊',
            label: { th: 'สิ่งอำนวยความสะดวก', en: 'Facilities' },
            score: facilityScore,
            max: 15
        })
        total += facilityScore

        // 4. BTS/MRT Access (15 points max)
        const btsDistance = Number(data.bts_distance) || 9999
        const btsScore = btsDistance < 500 ? 15 : btsDistance < 1000 ? 12 : 8
        breakdown.push({
            icon: '🚇',
            label: { th: 'ใกล้รถไฟฟ้า', en: 'Near BTS/MRT' },
            score: btsScore,
            max: 15
        })
        total += btsScore

        // 5. Complete Info (15 points max)
        const hasPhotos = listing.images?.length > 3
        const infoScore = hasPhotos ? 15 : 8
        breakdown.push({
            icon: '📷',
            label: { th: 'รูปและข้อมูลครบ', en: 'Complete Info' },
            score: infoScore,
            max: 15
        })
        total += infoScore

    } else {
        // ===== GENERAL / LAND / OTHER SCORING =====
        // 2. Condition (15 points max)
        const conditionVal = String(data.condition || '').toLowerCase()
        let condScore = 10
        if (conditionVal.includes('new') || conditionVal.includes('like_new')) condScore = 15
        else if (conditionVal.includes('good') || conditionVal.includes('excellent')) condScore = 12
        breakdown.push({
            icon: '✨',
            label: { th: 'สภาพสินค้า', en: 'Condition' },
            score: condScore,
            max: 15
        })
        total += condScore

        // 3. Photos (15 points max)
        const photoCount = listing.images?.length || 0
        const photoScore = photoCount >= 5 ? 15 : photoCount >= 3 ? 12 : 8
        breakdown.push({
            icon: '📷',
            label: { th: 'รูปภาพ', en: 'Photos' },
            score: photoScore,
            max: 15
        })
        total += photoScore

        // 4. Description (15 points max)
        const descLength = listing.ai_content?.marketing_copy?.body_copy?.length || 0
        const descScore = descLength > 100 ? 15 : descLength > 50 ? 12 : 8
        breakdown.push({
            icon: '📝',
            label: { th: 'รายละเอียด', en: 'Description' },
            score: descScore,
            max: 15
        })
        total += descScore

        // 5. Brand Info (15 points max)
        const hasBrand = !!data.brand
        const brandScore = hasBrand ? 15 : 8
        breakdown.push({
            icon: '🏷️',
            label: { th: 'ข้อมูลแบรนด์', en: 'Brand Info' },
            score: brandScore,
            max: 15
        })
        total += brandScore
    }

    // 6. Seller Trust (15 points max) - ALL CATEGORIES
    const sellerScore = listing.seller_info?.verified ? 15 : 8
    breakdown.push({
        icon: '✅',
        label: { th: 'ความน่าเชื่อถือ', en: 'Seller Trust' },
        score: sellerScore,
        max: 15
    })
    total += sellerScore

    // Generate AI Insight
    const insight = generateInsight(total, listing)

    return { total, breakdown, insight }
}

function generateInsight(score: number, listing: UniversalListing): { th: string; en: string } {
    const data = listing.template_data
    const categoryType = listing.category_type

    // Get category-specific item name
    const itemName = {
        car: { th: 'รถคันนี้', en: 'This car' },
        motorcycle: { th: 'รถมอเตอร์ไซค์คันนี้', en: 'This motorcycle' },
        mobile: { th: 'มือถือเครื่องนี้', en: 'This phone' },
        real_estate: { th: 'ที่พักนี้', en: 'This property' },
        land: { th: 'ที่ดินแปลงนี้', en: 'This land' },
        general: { th: 'สินค้าชิ้นนี้', en: 'This item' }
    }[categoryType] || { th: 'สินค้าชิ้นนี้', en: 'This item' }

    const viewItem = {
        car: { th: 'นัดดูรถ', en: 'view the car' },
        motorcycle: { th: 'นัดดูรถ', en: 'view the bike' },
        mobile: { th: 'นัดดูเครื่อง', en: 'view the device' },
        real_estate: { th: 'นัดดูที่พัก', en: 'view the property' },
        land: { th: 'นัดดูที่ดิน', en: 'view the land' },
        general: { th: 'นัดดูสินค้า', en: 'view the item' }
    }[categoryType] || { th: 'นัดดูสินค้า', en: 'view the item' }

    if (score >= 85) {
        return {
            th: `${data.brand ? data.brand + ' ' : ''}${itemName.th}มีคะแนนสูงมาก ราคาดี สภาพเยี่ยม เหมาะซื้อเลย`,
            en: `${data.brand ? data.brand + ' ' : ''}${itemName.en} scores excellently with great price and condition`
        }
    } else if (score >= 70) {
        return {
            th: `ราคาเหมาะสมกับสภาพ แนะนำให้${viewItem.th}ก่อนตัดสินใจ`,
            en: `Fair price for condition. Recommended to ${viewItem.en} before deciding`
        }
    } else if (score >= 50) {
        return {
            th: `มีบางจุดที่ควรตรวจสอบเพิ่มเติม ควรต่อราคาได้อีก 5-10%`,
            en: `Some points need verification. Room for 5-10% negotiation`
        }
    }
    return {
        th: `ควรพิจารณาให้ดีก่อนตัดสินใจ แนะนำให้ต่อราคาและตรวจสอบละเอียด`,
        en: `Consider carefully. Recommended to negotiate and inspect thoroughly`
    }
}

// ==========================================
// AI SUMMARY CARD
// สรุปจุดเด่น 3 วินาที
// ==========================================

interface AISummaryProps {
    listing: UniversalListing
    language?: 'th' | 'en'
}

export function AISummaryCard({ listing, language = 'th' }: AISummaryProps) {
    const highlights = useMemo(() => generateHighlights(listing, language), [listing, language])

    return (
        <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">⚡</span>
                </div>
                <div>
                    <h3 className="text-white font-bold">
                        {language === 'th' ? 'สรุปใน 3 วินาที' : '3-Second Summary'}
                    </h3>
                    <p className="text-blue-300 text-xs">
                        {language === 'th' ? 'AI วิเคราะห์จุดเด่น' : 'AI-analyzed highlights'}
                    </p>
                </div>
            </div>

            {/* Highlights */}
            <div className="space-y-3 mb-4">
                {highlights.map((item, i) => (
                    <div key={i} className={`flex items-start gap-3 p-3 rounded-xl ${item.type === 'pro' ? 'bg-green-500/10' : item.type === 'con' ? 'bg-yellow-500/10' : 'bg-slate-800/50'}`}>
                        <span className="text-xl">{item.icon}</span>
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${item.type === 'pro' ? 'text-green-300' : item.type === 'con' ? 'text-yellow-300' : 'text-gray-300'}`}>
                                {item.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Who is this for */}
            <div className="p-3 bg-slate-800/50 rounded-xl">
                <p className="text-gray-400 text-xs mb-1">
                    {language === 'th' ? '👤 เหมาะสำหรับ' : '👤 Ideal for'}
                </p>
                <p className="text-white text-sm font-medium">
                    {generateIdealBuyer(listing, language)}
                </p>
            </div>
        </div>
    )
}

function generateHighlights(listing: UniversalListing, lang: 'th' | 'en') {
    const data = listing.template_data
    const categoryType = listing.category_type
    const highlights: { icon: string; text: string; type: 'pro' | 'con' | 'info' }[] = []

    // Price analysis - ALL CATEGORIES
    if (listing.ai_content?.price_analysis?.price_position === 'below_market') {
        const diff = Math.abs(listing.ai_content.price_analysis.percentage_diff)
        highlights.push({
            icon: '💰',
            text: lang === 'th' ? `ราคาถูกกว่าตลาด ${diff}%` : `${diff}% below market price`,
            type: 'pro'
        })
    }

    // ===== CAR / MOTORCYCLE HIGHLIGHTS =====
    if (categoryType === 'car' || categoryType === 'motorcycle') {
        const mileage = Number(data.mileage) || 0
        if (mileage < 50000) {
            highlights.push({
                icon: '🛣️',
                text: lang === 'th' ? `ไมล์น้อยมาก ${mileage.toLocaleString()} กม.` : `Very low mileage ${mileage.toLocaleString()} km`,
                type: 'pro'
            })
        }

        if (data.condition_history === 'no_accident') {
            highlights.push({
                icon: '✨',
                text: lang === 'th' ? 'ไม่เคยมีอุบัติเหตุ' : 'No accident history',
                type: 'pro'
            })
        }

        if (data.service_history === 'dealer') {
            highlights.push({
                icon: '🔧',
                text: lang === 'th' ? 'เข้าศูนย์ตลอด มีประวัติ' : 'Full dealer service history',
                type: 'pro'
            })
        }

        // ===== MOBILE PHONE HIGHLIGHTS =====
    } else if (categoryType === 'mobile') {
        // Battery Health
        const batteryHealth = String(data.battery_health || '').toLowerCase()
        if (batteryHealth.includes('100') || batteryHealth.includes('95-99') || batteryHealth.includes('90-94')) {
            highlights.push({
                icon: '🔋',
                text: lang === 'th' ? `แบตเตอรี่ยังดี ${data.battery_health}` : `Good battery ${data.battery_health}`,
                type: 'pro'
            })
        }

        // iCloud
        const icloudStatus = String(data.icloud_status || '').toLowerCase()
        if (icloudStatus.includes('logged_out')) {
            highlights.push({
                icon: '☁️',
                text: lang === 'th' ? 'iCloud ออกแล้ว พร้อมใช้' : 'iCloud logged out, ready to use',
                type: 'pro'
            })
        }

        // Screen Condition
        const screenCondition = String(data.screen_condition || '').toLowerCase()
        if (screenCondition.includes('like_new') || screenCondition.includes('excellent')) {
            highlights.push({
                icon: '📱',
                text: lang === 'th' ? 'จอสวย ไม่มีรอย' : 'Screen like new',
                type: 'pro'
            })
        }

        // Accessories
        const accessories = String(data.accessories || '').toLowerCase()
        if (accessories.includes('full_box') || accessories.includes('box,charger,adapter')) {
            highlights.push({
                icon: '📦',
                text: lang === 'th' ? 'อุปกรณ์ครบกล่อง' : 'Full box accessories',
                type: 'pro'
            })
        }

        // ===== REAL ESTATE HIGHLIGHTS =====
    } else if (categoryType === 'real_estate') {
        const btsDistance = Number(data.bts_distance) || 0
        if (btsDistance && btsDistance < 500) {
            highlights.push({
                icon: '🚇',
                text: lang === 'th' ? `ใกล้ BTS/MRT ${btsDistance} ม.` : `${btsDistance}m to BTS/MRT`,
                type: 'pro'
            })
        }

        if (data.parking) {
            highlights.push({
                icon: '🚗',
                text: lang === 'th' ? 'มีที่จอดรถ' : 'Parking included',
                type: 'pro'
            })
        }

        // ===== GENERAL HIGHLIGHTS =====
    } else {
        if (data.condition === 'like_new' || data.condition === 'excellent') {
            highlights.push({
                icon: '✨',
                text: lang === 'th' ? 'สภาพใหม่มาก' : 'Like new condition',
                type: 'pro'
            })
        }

        if (data.brand) {
            highlights.push({
                icon: '🏷️',
                text: lang === 'th' ? `แบรนด์ ${data.brand}` : `Brand: ${data.brand}`,
                type: 'info'
            })
        }
    }

    // Common highlights - ALL CATEGORIES
    if (highlights.length < 3) {
        if (listing.price_negotiable) {
            highlights.push({
                icon: '💬',
                text: lang === 'th' ? 'ต่อราคาได้' : 'Price negotiable',
                type: 'info'
            })
        }
        if (listing.seller_info?.verified) {
            highlights.push({
                icon: '✅',
                text: lang === 'th' ? 'ผู้ขายยืนยันตัวตนแล้ว' : 'Verified seller',
                type: 'pro'
            })
        }
    }

    return highlights.slice(0, 4)
}

function generateIdealBuyer(listing: UniversalListing, lang: 'th' | 'en'): string {
    const data = listing.template_data
    const categoryType = listing.category_type

    // ===== CAR / MOTORCYCLE =====
    if (categoryType === 'car' || categoryType === 'motorcycle') {
        if (data.body_type === 'sedan') {
            return lang === 'th' ? 'ครอบครัว หรือใช้งานทั่วไปในเมือง' : 'Families or daily city driving'
        } else if (data.body_type === 'suv') {
            return lang === 'th' ? 'ครอบครัวใหญ่ หรือชอบเดินทางไกล' : 'Large families or road trip lovers'
        } else if (data.body_type === 'pickup') {
            return lang === 'th' ? 'ผู้ต้องการบรรทุกของ หรือใช้งานหนัก' : 'Those needing cargo space or heavy use'
        } else if (data.body_type === 'hatchback') {
            return lang === 'th' ? 'คนเมืองที่ต้องการประหยัดน้ำมัน' : 'Urban drivers seeking fuel efficiency'
        }
        return lang === 'th' ? 'ผู้มองหารถสภาพดี ราคาเหมาะสม' : 'Those seeking quality at fair price'
    }

    // ===== MOBILE PHONE =====
    if (categoryType === 'mobile') {
        const brand = String(data.brand || '').toLowerCase()
        if (brand.includes('apple') || brand.includes('iphone')) {
            return lang === 'th' ? 'คนชอบ iPhone ที่ไม่อยากซื้อเครื่องใหม่ในราคาเต็ม' : 'iPhone lovers looking for a better deal'
        } else if (brand.includes('samsung')) {
            return lang === 'th' ? 'ผู้ใช้ Android ที่ต้องการมือถือสเปกดี' : 'Android users wanting great specs'
        }
        return lang === 'th' ? 'ผู้มองหามือถือสภาพดี ราคาประหยัด' : 'Those looking for quality phone at good price'
    }

    // ===== REAL ESTATE =====
    if (categoryType === 'real_estate') {
        if (data.bedrooms >= 3) {
            return lang === 'th' ? 'ครอบครัวที่ต้องการพื้นที่กว้าง' : 'Families needing spacious living'
        } else if (data.bedrooms === 1) {
            return lang === 'th' ? 'คนโสดหรือคู่รัก' : 'Singles or couples'
        }
        return lang === 'th' ? 'ผู้มองหาที่พักราคาดี ทำเลดี' : 'Those seeking well-located property'
    }

    // ===== LAND =====
    if (categoryType === 'land') {
        return lang === 'th' ? 'ผู้สนใจลงทุนหรือสร้างบ้าน' : 'Investors or home builders'
    }

    // ===== GENERAL =====
    return lang === 'th' ? 'ผู้มองหาสินค้าคุณภาพดี ราคาเหมาะสม' : 'Those seeking quality at fair price'
}

// ==========================================
// FINANCE CALCULATOR CARD
// คำนวณผ่อนอัตโนมัติ
// ==========================================

interface FinanceCalculatorProps {
    price: number
    language?: 'th' | 'en'
}

export function FinanceCalculatorCard({ price, language = 'th' }: FinanceCalculatorProps) {
    const [downPercent, setDownPercent] = useState(10)
    const [term, setTerm] = useState(60)

    const interestRate = 3.5 // Annual interest rate

    const calculation = useMemo(() => {
        const downPayment = price * (downPercent / 100)
        const loanAmount = price - downPayment
        const monthlyRate = interestRate / 100 / 12
        const monthlyPayment = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, term)) / (Math.pow(1 + monthlyRate, term) - 1)
        const totalPayment = downPayment + (monthlyPayment * term)

        return {
            downPayment: Math.round(downPayment),
            loanAmount: Math.round(loanAmount),
            monthlyPayment: Math.round(monthlyPayment),
            totalPayment: Math.round(totalPayment)
        }
    }, [price, downPercent, term])

    const formatPrice = (n: number) => n.toLocaleString('th-TH')

    return (
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🏦</span>
                </div>
                <div>
                    <h3 className="text-white font-bold">
                        {language === 'th' ? 'คำนวณผ่อน' : 'Finance Calculator'}
                    </h3>
                    <p className="text-green-300 text-xs">
                        {language === 'th' ? `ดอกเบี้ย ${interestRate}% ต่อปี (ประมาณการ)` : `${interestRate}% annual rate (estimate)`}
                    </p>
                </div>
            </div>

            {/* Down Payment Slider */}
            <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">{language === 'th' ? 'เงินดาวน์' : 'Down Payment'}</span>
                    <span className="text-white font-medium">{downPercent}% (฿{formatPrice(calculation.downPayment)})</span>
                </div>
                <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={downPercent}
                    onChange={(e) => setDownPercent(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0%</span>
                    <span>25%</span>
                    <span>50%</span>
                </div>
            </div>

            {/* Term Selection */}
            <div className="mb-4">
                <span className="text-gray-400 text-sm mb-2 block">{language === 'th' ? 'ระยะเวลาผ่อน' : 'Loan Term'}</span>
                <div className="grid grid-cols-4 gap-2">
                    {[36, 48, 60, 72].map(t => (
                        <button
                            key={t}
                            onClick={() => setTerm(t)}
                            className={`py-2 rounded-lg text-sm font-medium transition-all ${term === t
                                ? 'bg-green-500 text-white'
                                : 'bg-slate-800 text-gray-400 hover:bg-slate-700'
                                }`}
                        >
                            {t} {language === 'th' ? 'งวด' : 'mo'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Result */}
            <div className="p-4 bg-slate-900/50 rounded-xl text-center">
                <p className="text-gray-400 text-xs mb-1">{language === 'th' ? 'ผ่อนต่อเดือน (ประมาณ)' : 'Monthly Payment (est.)'}</p>
                <p className="text-3xl font-bold text-green-400">฿{formatPrice(calculation.monthlyPayment)}</p>
                <p className="text-gray-500 text-xs mt-2">
                    {language === 'th' ? `รวมทั้งหมด ฿${formatPrice(calculation.totalPayment)}` : `Total: ฿${formatPrice(calculation.totalPayment)}`}
                </p>
            </div>

            {/* Disclaimer */}
            <p className="text-gray-500 text-xs mt-3 text-center">
                {language === 'th'
                    ? '* ยอดผ่อนจริงอาจแตกต่างขึ้นกับเครดิตและสถาบันการเงิน'
                    : '* Actual payments may vary based on credit and lender'}
            </p>
        </div>
    )
}

// ==========================================
// TRUST TIMELINE CARD  
// แสดงประวัติและความน่าเชื่อถือของผู้ขาย
// ==========================================

interface TrustTimelineProps {
    listing: UniversalListing
    language?: 'th' | 'en'
}

export function TrustTimelineCard({ listing, language = 'th' }: TrustTimelineProps) {
    const seller = listing.seller_info

    // Calculate member since (mock - would use actual data)
    const memberSince = 2023
    const yearsActive = new Date().getFullYear() - memberSince

    return (
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
                    <span className="text-xl">🏆</span>
                </div>
                <div>
                    <h3 className="text-white font-bold">
                        {language === 'th' ? 'ความน่าเชื่อถือผู้ขาย' : 'Seller Trust'}
                    </h3>
                    <p className="text-amber-300 text-xs">
                        {language === 'th' ? `สมาชิกมาแล้ว ${yearsActive} ปี` : `Member for ${yearsActive} years`}
                    </p>
                </div>
            </div>

            {/* Trust Score Bar */}
            <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400 text-sm">{language === 'th' ? 'คะแนนความน่าเชื่อถือ' : 'Trust Score'}</span>
                    <span className="text-amber-400 font-bold">{seller.trust_score}/100</span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                        style={{ width: `${seller.trust_score}%` }}
                    />
                </div>
            </div>

            {/* Verification Badges */}
            <div className="grid grid-cols-2 gap-2 mb-4">
                <div className={`flex items-center gap-2 p-2 rounded-lg ${seller.verified ? 'bg-green-500/10' : 'bg-slate-800/50'}`}>
                    <span className={seller.verified ? 'text-green-400' : 'text-gray-500'}>
                        {seller.verified ? '✓' : '○'}
                    </span>
                    <span className={`text-xs ${seller.verified ? 'text-green-300' : 'text-gray-500'}`}>
                        {language === 'th' ? 'ยืนยันตัวตน' : 'ID Verified'}
                    </span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-lg bg-green-500/10">
                    <span className="text-green-400">✓</span>
                    <span className="text-xs text-green-300">
                        {language === 'th' ? 'ยืนยันเบอร์' : 'Phone Verified'}
                    </span>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                    <p className="text-xl font-bold text-white">{seller.total_listings}</p>
                    <p className="text-xs text-gray-400">{language === 'th' ? 'ประกาศ' : 'Listings'}</p>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                    <p className="text-xl font-bold text-white">{seller.successful_sales}</p>
                    <p className="text-xs text-gray-400">{language === 'th' ? 'ขายแล้ว' : 'Sold'}</p>
                </div>
                <div className="text-center p-3 bg-slate-800/50 rounded-xl">
                    <p className="text-xl font-bold text-white">{seller.response_rate}%</p>
                    <p className="text-xs text-gray-400">{language === 'th' ? 'ตอบกลับ' : 'Response'}</p>
                </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-slate-900/50 rounded-xl">
                <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => (
                        <span key={star} className={`text-lg ${star <= Math.round(seller.trust_score / 20) ? 'text-amber-400' : 'text-gray-600'}`}>
                            ★
                        </span>
                    ))}
                </div>
                <span className="text-white font-medium">{(seller.trust_score / 20).toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({seller.successful_sales} {language === 'th' ? 'รีวิว' : 'reviews'})</span>
            </div>
        </div>
    )
}

// ==========================================
// AI BUYER CHECKLIST
// คำถามที่ควรถามก่อนซื้อ
// ==========================================

interface BuyerChecklistProps {
    listing: UniversalListing
    language?: 'th' | 'en'
}

export function AIBuyerChecklist({ listing, language = 'th' }: BuyerChecklistProps) {
    const [checkedItems, setCheckedItems] = useState<number[]>([])

    const questions = useMemo(() => generateQuestions(listing, language), [listing, language])

    const toggleCheck = (index: number) => {
        setCheckedItems(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        )
    }

    const progress = Math.round((checkedItems.length / questions.length) * 100)

    return (
        <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                        <span className="text-xl">📋</span>
                    </div>
                    <div>
                        <h3 className="text-white font-bold">
                            {language === 'th' ? 'สิ่งที่ควรถาม' : "Buyer's Checklist"}
                        </h3>
                        <p className="text-cyan-300 text-xs">
                            {language === 'th' ? 'AI แนะนำตามข้อมูลประกาศ' : 'AI-recommended based on listing'}
                        </p>
                    </div>
                </div>
                <span className="text-cyan-400 text-sm font-medium">{progress}%</span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden mb-4">
                <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </div>

            {/* Checklist Items */}
            <div className="space-y-2 mb-4">
                {questions.map((q, i) => (
                    <button
                        key={i}
                        onClick={() => toggleCheck(i)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${checkedItems.includes(i)
                            ? 'bg-green-500/10 border border-green-500/30'
                            : 'bg-slate-800/50 hover:bg-slate-700/50'
                            }`}
                    >
                        <span className={`text-lg ${checkedItems.includes(i) ? 'text-green-400' : 'text-gray-500'}`}>
                            {checkedItems.includes(i) ? '☑' : '☐'}
                        </span>
                        <span className={`text-sm ${checkedItems.includes(i) ? 'text-green-300 line-through' : 'text-gray-300'}`}>
                            {q}
                        </span>
                    </button>
                ))}
            </div>

            {/* Send All Button */}
            <button className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2">
                <span>📤</span>
                {language === 'th' ? 'ส่งคำถามทั้งหมดให้ผู้ขาย' : 'Send all questions to seller'}
            </button>
        </div>
    )
}

function generateQuestions(listing: UniversalListing, lang: 'th' | 'en'): string[] {
    const data = listing.template_data
    const categoryType = listing.category_type
    const questions: string[] = []

    // ===== CAR / MOTORCYCLE QUESTIONS =====
    if (categoryType === 'car' || categoryType === 'motorcycle') {
        // Based on service history
        if (data.service_history === 'dealer') {
            questions.push(lang === 'th'
                ? 'ขอดูใบประวัติจากศูนย์ได้ไหมครับ?'
                : 'Can I see the dealer service records?')
        }

        // Mileage verification
        questions.push(lang === 'th'
            ? 'ไมล์นี้เป็นไมล์แท้ใช่ไหมครับ? มีหลักฐานยืนยันไหม?'
            : 'Is this the true mileage? Any proof?')

        // Accident history
        if (data.condition_history === 'no_accident') {
            questions.push(lang === 'th'
                ? 'ยืนยันว่าไม่เคยชนไม่เคยน้ำท่วมใช่ไหมครับ?'
                : 'Can you confirm no accidents or flood?')
        } else {
            questions.push(lang === 'th'
                ? 'เคยมีอุบัติเหตุอะไรบ้างครับ? ซ่อมส่วนไหน?'
                : 'What accidents occurred? What was repaired?')
        }

        // Viewing
        questions.push(lang === 'th'
            ? 'นัดดูรถได้วันไหนบ้างครับ?'
            : 'When can I view the vehicle?')

        // ===== MOBILE PHONE QUESTIONS =====
    } else if (categoryType === 'mobile') {
        // Battery health
        questions.push(lang === 'th'
            ? 'แบตเตอรี่เหลือกี่เปอร์เซ็นต์ครับ?'
            : 'What percentage is the battery health?')

        // iCloud status
        questions.push(lang === 'th'
            ? 'iCloud ออกจากระบบแล้วใช่ไหมครับ?'
            : 'Is iCloud already logged out?')

        // Screen condition
        questions.push(lang === 'th'
            ? 'หน้าจอมีรอยแตกหรือรอยขีดข่วนไหมครับ?'
            : 'Does the screen have any cracks or scratches?')

        // Accessories
        questions.push(lang === 'th'
            ? 'อุปกรณ์ครบกล่องไหมครับ? มีกล่อง สายชาร์จ หัวชาร์จไหม?'
            : 'Does it come with full accessories? Box, cable, charger?')

        // Warranty
        if (data.warranty) {
            questions.push(lang === 'th'
                ? 'ประกันเหลือถึงเมื่อไหร่ครับ?'
                : 'When does the warranty expire?')
        }

        // Viewing
        questions.push(lang === 'th'
            ? 'นัดดูเครื่องได้วันไหนบ้างครับ?'
            : 'When can I view the device?')

        // ===== REAL ESTATE QUESTIONS =====
    } else if (categoryType === 'real_estate') {
        questions.push(lang === 'th'
            ? 'ค่าส่วนกลางเดือนละเท่าไหร่ครับ?'
            : 'What is the monthly common fee?')

        questions.push(lang === 'th'
            ? 'มีที่จอดรถไหมครับ? กี่คัน?'
            : 'Is parking included? How many spots?')

        questions.push(lang === 'th'
            ? 'พร้อมโอนได้เลยไหมครับ?'
            : 'Is it ready to transfer?')

        questions.push(lang === 'th'
            ? 'นัดดูที่พักได้วันไหนบ้างครับ?'
            : 'When can I view the property?')

        // ===== LAND QUESTIONS =====
    } else if (categoryType === 'land') {
        questions.push(lang === 'th'
            ? 'ที่ดินติดถนนกว้างเท่าไหร่ครับ?'
            : 'What is the road frontage width?')

        questions.push(lang === 'th'
            ? 'ผังเมืองสีอะไรครับ?'
            : 'What is the zoning color?')

        questions.push(lang === 'th'
            ? 'น้ำไฟเข้าถึงหรือยังครับ?'
            : 'Are utilities connected?')

        questions.push(lang === 'th'
            ? 'นัดดูที่ดินได้วันไหนบ้างครับ?'
            : 'When can I view the land?')

        // ===== GENERAL QUESTIONS =====
    } else {
        questions.push(lang === 'th'
            ? 'สินค้ามีตำหนิตรงไหนบ้างครับ?'
            : 'Are there any defects?')

        questions.push(lang === 'th'
            ? 'ใช้งานมานานแค่ไหนแล้วครับ?'
            : 'How long has it been used?')

        questions.push(lang === 'th'
            ? 'มีใบรับประกันหรือใบเสร็จไหมครับ?'
            : 'Do you have warranty or receipt?')

        questions.push(lang === 'th'
            ? 'นัดรับสินค้าได้วันไหนบ้างครับ?'
            : 'When can I pick up the item?')
    }

    // Common questions for all categories
    if (listing.price_negotiable) {
        questions.push(lang === 'th'
            ? 'ลดได้อีกเท่าไหร่ครับ ถ้าจ่ายเงินสด?'
            : 'What discount for cash payment?')
    }

    return questions.slice(0, 5)
}

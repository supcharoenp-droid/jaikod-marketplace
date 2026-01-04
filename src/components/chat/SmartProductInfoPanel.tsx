/**
 * Smart Product Info Panel - Right Sidebar with AI Intelligence
 * Integrated version of ProductInfoPanel with AI features
 * 
 * V2 Enhancement: รวม PriceIntelligencePanel และ SecurityShield
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
    Shield, Star, Package, AlertTriangle, CheckCircle2,
    Sparkles, Info, MapPin, Check, Send, Plus, Search,
    ChevronDown, ChevronUp, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LeadAnalysis, ConversationSummary, SafeZone, PriceIntelligence } from '@/services/aiChatService';
import AILeadBadge from './AILeadBadge';
import PriceIntelligencePanel from './PriceIntelligencePanel';
import SecurityShield from './SecurityShield';
import SafeZoneMeetingCalculator from './SafeZoneMeetingCalculator';
import TransactionFlowPanel from './TransactionFlowPanel';
import { FEATURE_FLAGS } from '@/config/platform';

interface SmartProductInfoPanelProps {
    productId: string;
    productName: string;
    productPrice: number;
    productImage?: string;
    productCondition?: string;
    productWarranty?: string;
    sellerId?: string;
    sellerName: string;
    sellerTrustScore: number;
    sellerSalesCount: number;
    sellerResponseTime?: string;
    sellerVerified?: boolean;
    sellerLocation?: { lat: number; lng: number; province?: string; amphoe?: string };
    // AI Data
    leadAnalysis?: LeadAnalysis | null;
    smartSummary?: ConversationSummary | null;
    safeZones?: SafeZone[];
    priceIntel?: PriceIntelligence | null;
    onSelectMeetup?: (spot: SafeZone) => void;
    onApplyCounterPrice?: (price: number) => void;
    onSendMeetingRequest?: (spot: any, timeSlot: string) => void;
    // SafeZone Location Sharing
    onRequestSellerLocation?: () => Promise<void>;
    onShareMyLocation?: (location: { lat: number; lng: number }) => Promise<void>;
    // Transaction Flow (Phase 3)
    chatRoomId?: string;
    buyerId?: string;
    currentUserId?: string;
    acceptedOfferPrice?: number;
    userRole?: 'buyer' | 'seller';
    onOrderCreated?: (orderId: string) => void;
    onPaymentComplete?: () => void;
    onTransactionComplete?: () => void;
}

export default function SmartProductInfoPanel({
    productId,
    productName,
    productPrice,
    productImage,
    productCondition = 'มือสอง สภาพดี',
    productWarranty = 'ไม่มีประกัน',
    sellerId,
    sellerName,
    sellerTrustScore = 98,
    sellerSalesCount = 150,
    sellerResponseTime = '<1 ชั่วโมง',
    sellerVerified = true,
    sellerLocation,
    leadAnalysis,
    smartSummary,
    safeZones = [],
    priceIntel,
    onSelectMeetup,
    onApplyCounterPrice,
    onSendMeetingRequest,
    // SafeZone Location
    onRequestSellerLocation,
    onShareMyLocation,
    // Transaction Flow
    chatRoomId,
    buyerId,
    currentUserId,
    acceptedOfferPrice,
    userRole = 'buyer',
    onOrderCreated,
    onPaymentComplete,
    onTransactionComplete
}: SmartProductInfoPanelProps) {
    const [activeTab, setActiveTab] = useState<'info' | 'tools' | 'safety' | 'order'>('info');
    const showTransactionTab = FEATURE_FLAGS.ORDER_SYSTEM_ENABLED && chatRoomId && buyerId && sellerId;



    // Calculate Dynamic Color & Grade for Trust Score
    const getTrustStatus = (score: number) => {
        if (score >= 90) return { color: 'text-purple-600', grade: 'S', bg: 'bg-purple-50' };
        if (score >= 80) return { color: 'text-green-500', grade: 'A', bg: 'bg-green-50' };
        if (score >= 60) return { color: 'text-blue-500', grade: 'B', bg: 'bg-blue-50' };
        if (score >= 40) return { color: 'text-orange-500', grade: 'C', bg: 'bg-orange-50' };
        return { color: 'text-red-500', grade: 'F', bg: 'bg-red-50' };
    };

    const trust = getTrustStatus(sellerTrustScore);

    return (
        <div className="w-80 bg-white dark:bg-[#0a0a0a] border-l border-gray-200 dark:border-gray-800 flex flex-col h-full shadow-2xl">
            {/* AI Lead Scoring Top Bar */}
            {leadAnalysis && (
                <div className={`px-4 py-3 border-b flex items-center gap-3 bg-gradient-to-r ${leadAnalysis.label === 'Hot' ? 'from-orange-500/10 to-transparent border-orange-100 dark:border-orange-900/30' :
                    'from-blue-500/10 to-transparent border-blue-100 dark:border-blue-900/30'
                    }`}>
                    <div className="relative">
                        <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-[10px] font-black ${leadAnalysis.label === 'Hot' ? 'border-orange-500 text-orange-600' : 'border-blue-500 text-blue-600'
                            }`}>
                            {leadAnalysis.probability}
                        </div>
                        {leadAnalysis.label === 'Hot' && <Sparkles className="absolute -top-1 -right-1 w-3 h-3 text-orange-500 fill-current" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-black uppercase tracking-widest text-gray-500">AI Lead Score</div>
                        <div className={`text-xs font-bold truncate ${leadAnalysis.label === 'Hot' ? 'text-orange-600' : 'text-blue-600'}`}>
                            {leadAnalysis.label}: {leadAnalysis.reasonTH}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Tabs */}
            <div className="flex px-1 mt-2 mx-2 bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
                {(['info', 'tools', 'safety', ...(showTransactionTab ? ['order'] : [])] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab as any)}
                        className={`flex-1 py-1.5 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${activeTab === tab
                            ? 'bg-white dark:bg-gray-800 text-primary-600 shadow-sm'
                            : 'text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        {tab === 'info' ? 'Details' : tab === 'tools' ? 'AI Tools' : tab === 'safety' ? 'SafeZone' : 'Order'}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <AnimatePresence mode="wait">
                    {activeTab === 'info' && (
                        <motion.div
                            key="info"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-4"
                        >
                            {/* Product Info - Clickable to Product Page */}
                            <Link href={`/listing/${productId}`} className="block hover:opacity-90 transition-opacity">
                                <div className="relative aspect-video w-full mb-4 rounded-2xl overflow-hidden bg-gray-100 dark:bg-gray-800 border border-gray-100 dark:border-gray-800">
                                    {productImage ? (
                                        <Image src={productImage} alt={productName} fill className="object-cover" />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-gray-400"><Package className="w-12 h-12" /></div>
                                    )}
                                </div>
                                <h3 className="text-base font-black text-gray-900 dark:text-white leading-tight mb-1 hover:text-purple-600 transition-colors">{productName}</h3>
                                <div className="text-xl font-black text-primary-600 mb-4">฿{productPrice.toLocaleString()}</div>
                            </Link>

                            {/* Trust Section */}
                            <div className={`p-4 rounded-3xl border border-gray-100 dark:border-gray-800 mb-4 ${trust.bg}/30`}>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Seller Trust</h4>
                                    {sellerVerified && <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-black">VERIFIED</span>}
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className={`text-3xl font-black ${trust.color}`}>{sellerTrustScore}%</div>
                                    <div className="flex-1">
                                        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                            <div className={`h-full ${trust.color.replace('text', 'bg')}`} style={{ width: `${sellerTrustScore}%` }} />
                                        </div>
                                        <div className="flex justify-between mt-1 text-[9px] font-bold text-gray-400">
                                            <span>Grade {trust.grade}</span>
                                            <span>{sellerSalesCount} Sales</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-3 bg-gray-50 dark:bg-gray-900/50 rounded-2xl">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-2">Conditions</p>
                                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">• {productCondition}</p>
                                    <p className="text-xs font-bold text-gray-700 dark:text-gray-300">• {productWarranty}</p>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'tools' && (
                        <motion.div
                            key="tools"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-4 space-y-6"
                        >
                            {/* AI Price Intelligence - V2 Enhanced Component */}
                            <PriceIntelligencePanel
                                currentPrice={productPrice}
                                priceIntel={priceIntel || null}
                                onApplyPrice={(price) => onApplyCounterPrice?.(price)}
                            />

                            {/* Smart Summary */}
                            {smartSummary && (
                                <div className="bg-white dark:bg-gray-900 p-4 rounded-[24px] border border-gray-100 dark:border-gray-800 shadow-sm">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="p-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-400"><Info className="w-4 h-4" /></div>
                                        <h3 className="font-black text-gray-900 dark:text-white text-[11px] uppercase tracking-widest">Chat Summary</h3>
                                    </div>
                                    <div className="space-y-2 mb-4">
                                        {smartSummary.keyPoints.map((point, i) => (
                                            <div key={i} className="flex items-start gap-2">
                                                <div className="w-1 h-1 bg-primary-400 rounded-full mt-1.5 shrink-0" />
                                                <p className="text-[10px] font-bold text-gray-600 dark:text-gray-400">{point}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-3 border-t border-gray-50 dark:border-gray-800">
                                        <div className="text-[8px] font-black text-primary-600 uppercase tracking-widest mb-2">Pending Actions</div>
                                        <div className="space-y-1.5">
                                            {smartSummary.pendingActions.map((action, i) => (
                                                <div key={i} className="flex items-center gap-2 text-[9px] font-bold text-gray-500">
                                                    <Plus className="w-3 h-3" /> {action}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'safety' && (
                        <motion.div
                            key="safety"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-4"
                        >
                            {/* AI SafeZone Meeting Calculator */}
                            <SafeZoneMeetingCalculator
                                sellerId={sellerId || ''}
                                sellerLocation={sellerLocation}
                                listingLocation={sellerLocation}
                                productId={productId}
                                onSelectSpot={(spot) => {
                                    // Convert to SafeZone format for callback
                                    onSelectMeetup?.({
                                        name: spot.name,
                                        distance: `${spot.distance} กม.`,
                                        openingHours: spot.operating_hours,
                                        density: spot.safety_score >= 90 ? 'High' : 'Medium',
                                        isVerified: spot.verification_status === 'verified',
                                        recommendationReasonTH: spot.features.join(', '),
                                        recommendationReasonEN: spot.features.join(', '),
                                        type: spot.type === 'police_station' ? 'police_station' : 'mall' as const,
                                        lat: spot.location.lat,
                                        lng: spot.location.lng,
                                    });
                                }}
                                onSendMeetingRequest={(spot, timeSlot) => {
                                    onSendMeetingRequest?.(spot, timeSlot);
                                }}
                                onRequestSellerLocation={onRequestSellerLocation}
                                onShareMyLocation={onShareMyLocation}
                            />
                        </motion.div>
                    )}

                    {/* Order Tab - Transaction Flow */}
                    {activeTab === 'order' && showTransactionTab && (
                        <motion.div
                            key="order"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="p-4"
                        >
                            <TransactionFlowPanel
                                chatRoomId={chatRoomId!}
                                buyerId={buyerId!}
                                sellerId={sellerId!}
                                listingId={productId}
                                listingTitle={productName}
                                listingPrice={productPrice}
                                acceptedOfferPrice={acceptedOfferPrice}
                                role={userRole}
                                onOrderCreated={onOrderCreated}
                                onPaymentComplete={onPaymentComplete}
                                onTransactionComplete={onTransactionComplete}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

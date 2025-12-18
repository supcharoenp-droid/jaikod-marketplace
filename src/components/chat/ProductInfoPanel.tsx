/**
 * Product Info Panel - Right Sidebar
 * แสดงข้อมูลสินค้าและผู้ขายในแชท
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Shield, Star, Package, AlertTriangle, CheckCircle2 } from 'lucide-react';
import SafetyTipsModal from './SafetyTipsModal';
import SellerProducts from './SellerProducts';

interface ProductInfoPanelProps {
    productId: string;
    productName: string;
    productPrice: number;
    productImage?: string;
    productCondition?: string;
    productWarranty?: string;
    sellerId?: string; // Add sellerId
    sellerName: string;
    sellerTrustScore: number;
    sellerSalesCount: number;
    sellerResponseTime?: string;
    sellerVerified?: boolean;
    showTrustScore?: boolean; // New Flag
}

export default function ProductInfoPanel({
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
    showTrustScore = true // Default ON
}: ProductInfoPanelProps) {
    const [showSafetyTips, setShowSafetyTips] = useState(false);

    const handleVisitShop = () => {
        if (sellerId) {
            window.open(`/shop/${sellerId}`, '_blank');
        }
    };

    // Calculate Dynamic Color & Grade
    let scoreColor = 'text-gray-400';
    let grade = 'F';

    if (sellerTrustScore >= 90) { scoreColor = 'text-purple-600 dark:text-purple-400'; grade = 'S'; }
    else if (sellerTrustScore >= 80) { scoreColor = 'text-green-500 dark:text-green-400'; grade = 'A'; }
    else if (sellerTrustScore >= 60) { scoreColor = 'text-blue-500 dark:text-blue-400'; grade = 'B'; }
    else if (sellerTrustScore >= 40) { scoreColor = 'text-orange-500 dark:text-orange-400'; grade = 'C'; }
    else { scoreColor = 'text-red-500 dark:text-red-400'; grade = 'F'; }

    return (
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-y-auto h-full">
            {/* Product Details Section */}
            <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative aspect-video w-full mb-4 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {productImage ? (
                        <Image
                            src={productImage}
                            alt={productName}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400">
                            <Package className="w-12 h-12" />
                        </div>
                    )}
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white leading-tight mb-2">
                    {productName}
                </h3>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-4">
                    ฿{productPrice.toLocaleString()}
                </div>

                <div className="space-y-3">
                    <div>
                        <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">รายละเอียดสินค้า</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{productCondition}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{productWarranty}</p>
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-900/50 p-3 rounded-lg">
                        <p className="text-xs font-semibold text-gray-900 dark:text-white mb-2">สิ่งที่ได้รับ</p>
                        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1 list-disc pl-4">
                             <li>ตัวเครื่อง {productName}</li>
                             <li>อุปกรณ์ครบกล่อง</li>
                             <li>ใบรับประกัน</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Seller Trust Score (Controlled by Feature Flag) */}
            {showTrustScore && (
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-600" />
                        ความน่าเชื่อถือผู้ขาย
                    </h4>

                    {/* Trust Score Circle - Clickable to visit shop */}
                    <div
                        onClick={handleVisitShop}
                        className="flex items-center justify-center mb-4 cursor-pointer hover:opacity-90 transition group"
                    >
                        <div className="relative w-32 h-32 transform group-hover:scale-105 transition duration-300">
                            {/* Background Circle */}
                            <svg className="w-32 h-32 transform -rotate-90">
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    className="text-gray-200 dark:text-gray-700"
                                />
                                {/* Progress Circle */}
                                <circle
                                    cx="64"
                                    cy="64"
                                    r="56"
                                    stroke="currentColor"
                                    strokeWidth="8"
                                    fill="none"
                                    strokeDasharray={`${2 * Math.PI * 56}`}
                                    strokeDashoffset={`${2 * Math.PI * 56 * (1 - sellerTrustScore / 100)}`}
                                    className={`${scoreColor} transition-all duration-1000`}
                                    strokeLinecap="round"
                                />
                            </svg>
                            {/* Score Text */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-3xl font-bold ${scoreColor}`}>
                                    {sellerTrustScore}%
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                    Grade {grade}
                                </span>
                                <span className={`text-[10px] opacity-0 group-hover:opacity-100 transition absolute bottom-6 ${scoreColor}`}>
                                    ดูหน้าร้าน
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badge - Clickable */}
                    <div
                        onClick={handleVisitShop}
                        className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 mb-3 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/30 transition"
                    >
                        <div className="flex items-center gap-2 mb-1">
                            {sellerVerified && (
                                <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                                    <Shield className="w-4 h-4" />
                                    <span className="text-sm font-medium">ผู้ขายที่ยืนยันตัวตน</span>
                                </div>
                            )}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                            ระดับความน่าเชื่อถือสูง • คลิกเพื่อดูร้านค้า
                        </p>
                    </div>

                    {/* Seller Stats */}
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                                <Star className="w-3 h-3" />
                                <span className="text-xs">ยอดขาย</span>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {sellerSalesCount}+ รายการ
                            </p>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-2">
                            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 mb-1">
                                <Package className="w-3 h-3" />
                                <span className="text-xs">ตอบกลับ</span>
                            </div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {sellerResponseTime}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Safety Tips */}
            <div className="p-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-orange-500" />
                    เคล็ดลับความปลอดภัย
                </h4>
                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <p>ตรวจสอบสินค้าก่อนชำระเงิน</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <p>นัดรับที่สถานที่สาธารณะ</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <p>ระวังการโอนเงินล่วงหน้า</p>
                    </div>
                    <div className="flex items-start gap-2">
                        <span className="text-orange-500 mt-0.5">•</span>
                        <p>ใช้ระบบชำระเงินของ JaiKod</p>
                    </div>
                </div>

                <button
                    onClick={() => setShowSafetyTips(true)}
                    className="w-full mt-4 px-4 py-2 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition font-medium text-sm"
                >
                    อ่านเพิ่มเติม
                </button>
            </div>

            {/* Seller Products */}
            <SellerProducts sellerId={sellerId} />

            {/* Safety Tips Modal */}
            <SafetyTipsModal
                isOpen={showSafetyTips}
                onClose={() => setShowSafetyTips(false)}
            />
        </div>
    );
}

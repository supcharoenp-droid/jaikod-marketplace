/**
 * Delivery Tracking Panel - Phase 3
 * Track shipment or meetup arrangement
 */

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Truck, MapPin, Package, CheckCircle, Clock,
    Navigation, Phone, MessageCircle, Copy, ExternalLink
} from 'lucide-react';

interface DeliveryTrackingPanelProps {
    orderId: string;
    deliveryMethod: 'meetup' | 'shipping';
    // Shipping info
    carrier?: string;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    // Meetup info
    meetupLocation?: {
        name: string;
        address?: string;
        lat?: number;
        lng?: number;
        datetime?: Date;
    };
    // Status
    status: 'pending' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered';
    // Callbacks
    onCopyTracking?: () => void;
    onOpenMap?: () => void;
    onCallSeller?: () => void;
    onChatSeller?: () => void;
}

const CARRIER_LOGOS: { [key: string]: string } = {
    'kerry': '🟠 Kerry Express',
    'flash': '🟡 Flash Express',
    'jt': '🔴 J&T Express',
    'thaipost': '🔵 ไปรษณีย์ไทย',
    'grab': '🟢 Grab Express',
    'lalamove': '🟣 Lalamove'
};

export default function DeliveryTrackingPanel({
    orderId,
    deliveryMethod,
    carrier = 'kerry',
    trackingNumber,
    estimatedDelivery,
    meetupLocation,
    status = 'pending',
    onCopyTracking,
    onOpenMap,
    onCallSeller,
    onChatSeller
}: DeliveryTrackingPanelProps) {
    const [copied, setCopied] = useState(false);

    const handleCopyTracking = () => {
        if (trackingNumber) {
            navigator.clipboard.writeText(trackingNumber);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            onCopyTracking?.();
        }
    };

    const handleOpenMap = () => {
        if (meetupLocation?.lat && meetupLocation?.lng) {
            window.open(
                `https://www.google.com/maps/search/?api=1&query=${meetupLocation.lat},${meetupLocation.lng}`,
                '_blank'
            );
        }
        onOpenMap?.();
    };

    const formatDate = (date?: Date) => {
        if (!date) return '-';
        return date.toLocaleDateString('th-TH', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const statusConfig = {
        pending: { label: 'รอจัดส่ง', color: 'text-amber-600', bg: 'bg-amber-100', progress: 10 },
        shipped: { label: 'จัดส่งแล้ว', color: 'text-blue-600', bg: 'bg-blue-100', progress: 30 },
        in_transit: { label: 'กำลังขนส่ง', color: 'text-blue-600', bg: 'bg-blue-100', progress: 60 },
        out_for_delivery: { label: 'กำลังนำส่ง', color: 'text-purple-600', bg: 'bg-purple-100', progress: 85 },
        delivered: { label: 'ส่งถึงแล้ว', color: 'text-green-600', bg: 'bg-green-100', progress: 100 }
    };

    const currentStatus = statusConfig[status];

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
        >
            {/* Header */}
            <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {deliveryMethod === 'shipping' ? (
                            <Truck className="w-5 h-5 text-blue-600" />
                        ) : (
                            <MapPin className="w-5 h-5 text-green-600" />
                        )}
                        <h3 className="font-bold text-gray-900 dark:text-white">
                            {deliveryMethod === 'shipping' ? 'ติดตามพัสดุ' : 'นัดรับสินค้า'}
                        </h3>
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${currentStatus.bg} ${currentStatus.color}`}>
                        {currentStatus.label}
                    </span>
                </div>

                {/* Progress Bar */}
                <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${currentStatus.progress}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className={`h-full rounded-full ${status === 'delivered'
                                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                                : 'bg-gradient-to-r from-blue-400 to-purple-500'
                            }`}
                    />
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {deliveryMethod === 'shipping' ? (
                    // Shipping Details
                    <div className="space-y-4">
                        {/* Carrier & Tracking */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-lg font-bold">
                                    {CARRIER_LOGOS[carrier] || carrier}
                                </span>
                                {estimatedDelivery && (
                                    <span className="text-xs text-gray-500">
                                        คาดว่าถึง {formatDate(estimatedDelivery)}
                                    </span>
                                )}
                            </div>

                            {trackingNumber ? (
                                <div className="flex items-center gap-2">
                                    <div className="flex-1 bg-white dark:bg-gray-700 rounded-lg px-3 py-2 font-mono text-sm">
                                        {trackingNumber}
                                    </div>
                                    <button
                                        onClick={handleCopyTracking}
                                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                    >
                                        {copied ? <CheckCircle className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
                                    </button>
                                    <button
                                        onClick={() => window.open(`https://track.aftership.com/${carrier}/${trackingNumber}`, '_blank')}
                                        className="p-2 text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors"
                                    >
                                        <ExternalLink className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2">
                                    <Clock className="w-4 h-4" />
                                    <span className="text-sm">รอผู้ขายแจ้งเลขพัสดุ</span>
                                </div>
                            )}
                        </div>

                        {/* Tracking Timeline (Placeholder) */}
                        <div className="space-y-3">
                            {[
                                { time: 'วันนี้ 10:30', event: 'พัสดุออกจากศูนย์กระจายสินค้า', done: true },
                                { time: 'วันนี้ 08:00', event: 'พัสดุมาถึงศูนย์กระจายสินค้า กรุงเทพฯ', done: true },
                                { time: 'เมื่อวาน 16:00', event: 'ผู้ขายส่งสินค้าแล้ว', done: true }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-3">
                                    <div className="flex flex-col items-center">
                                        <div className={`w-2.5 h-2.5 rounded-full ${item.done ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        {i < 2 && <div className={`w-0.5 h-8 ${item.done ? 'bg-green-300' : 'bg-gray-200'}`} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-xs text-gray-500">{item.time}</p>
                                        <p className="text-sm text-gray-700 dark:text-gray-300">{item.event}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Meetup Details
                    <div className="space-y-4">
                        {meetupLocation ? (
                            <>
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 border border-green-100 dark:border-green-900">
                                    <div className="flex items-start gap-3">
                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-green-600" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-gray-900 dark:text-white mb-1">
                                                {meetupLocation.name}
                                            </p>
                                            {meetupLocation.address && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                                    {meetupLocation.address}
                                                </p>
                                            )}
                                            {meetupLocation.datetime && (
                                                <div className="flex items-center gap-1 text-sm text-green-600">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{formatDate(meetupLocation.datetime)}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Map Button */}
                                <button
                                    onClick={handleOpenMap}
                                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                                >
                                    <Navigation className="w-5 h-5" />
                                    เปิดแผนที่นำทาง
                                </button>

                                {/* Contact Buttons */}
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={onCallSeller}
                                        className="py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <Phone className="w-4 h-4" />
                                        โทร
                                    </button>
                                    <button
                                        onClick={onChatSeller}
                                        className="py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-medium rounded-xl flex items-center justify-center gap-2 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        แชท
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-6">
                                <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-600 dark:text-gray-400 mb-1">ยังไม่ได้กำหนดสถานที่นัดรับ</p>
                                <p className="text-sm text-gray-500">ใช้ SafeZone เพื่อเลือกจุดนัดที่ปลอดภัย</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Safety Tips */}
            {deliveryMethod === 'meetup' && (
                <div className="p-4 bg-amber-50/50 dark:bg-amber-900/10 border-t border-amber-100 dark:border-amber-900/20">
                    <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
                        <Package className="w-4 h-4 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold mb-0.5">เคล็ดลับความปลอดภัย:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                                <li>นัดพบในที่สาธารณะ มีคนพลุกพล่าน</li>
                                <li>ตรวจสอบสินค้าก่อนจ่ายเงิน</li>
                                <li>แจ้งคนใกล้ชิดว่าไปพบใคร ที่ไหน</li>
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

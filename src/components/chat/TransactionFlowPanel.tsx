/**
 * Transaction Flow Panel - Phase 3
 * V2 Chat Integration with Order/Payment/Escrow
 * 
 * Shows the current transaction status and next actions
 */

'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, CreditCard, Shield, Truck,
    CheckCircle, Clock, AlertTriangle, ArrowRight,
    QrCode, MapPin, Star, Phone, MessageCircle
} from 'lucide-react';
import { orderService, type Order, type OrderStatus } from '@/services/order/orderService';
import { paymentService } from '@/services/payment/paymentService';
import { escrowService, type EscrowTransaction } from '@/services/payment/escrowService';
import { FEATURE_FLAGS, PLATFORM_CONFIG } from '@/config/platform';

interface TransactionFlowPanelProps {
    chatRoomId: string;
    buyerId: string;
    sellerId: string;
    listingId: string;
    listingTitle: string;
    listingPrice: number;
    acceptedOfferPrice?: number;
    role: 'buyer' | 'seller';
    onOrderCreated?: (orderId: string) => void;
    onPaymentComplete?: () => void;
    onTransactionComplete?: () => void;
}

type TransactionStep = 'offer' | 'payment' | 'shipping' | 'delivery' | 'review' | 'complete';

export default function TransactionFlowPanel({
    chatRoomId,
    buyerId,
    sellerId,
    listingId,
    listingTitle,
    listingPrice,
    acceptedOfferPrice,
    role,
    onOrderCreated,
    onPaymentComplete,
    onTransactionComplete
}: TransactionFlowPanelProps) {
    const [currentStep, setCurrentStep] = useState<TransactionStep>('offer');
    const [order, setOrder] = useState<Order | null>(null);
    const [escrow, setEscrow] = useState<EscrowTransaction | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [deliveryMethod, setDeliveryMethod] = useState<'meetup' | 'shipping'>('meetup');

    const finalPrice = acceptedOfferPrice || listingPrice;
    const platformFee = paymentService.calculatePlatformFee(finalPrice);
    const sellerPayout = paymentService.calculateSellerPayout(finalPrice);

    // Step configuration
    const steps: { key: TransactionStep; label: string; icon: any }[] = [
        { key: 'offer', label: 'ตกลงราคา', icon: MessageCircle },
        { key: 'payment', label: 'ชำระเงิน', icon: CreditCard },
        { key: 'shipping', label: 'จัดส่ง', icon: Truck },
        { key: 'delivery', label: 'รับสินค้า', icon: Package },
        { key: 'review', label: 'รีวิว', icon: Star },
    ];

    // Determine current step from order status
    useEffect(() => {
        if (!order) {
            setCurrentStep(acceptedOfferPrice ? 'payment' : 'offer');
            return;
        }

        const statusToStep: { [key in OrderStatus]?: TransactionStep } = {
            'pending': 'payment',      // รอชำระเงิน
            'paid': 'shipping',        // ชำระเงินแล้ว -> รอจัดส่ง
            'confirmed': 'shipping',   // ยืนยันแล้ว
            'shipping': 'delivery',    // กำลังจัดส่ง
            'delivered': 'review',     // ส่งถึงแล้ว
            'completed': 'complete',   // เสร็จสิ้น
            'cancelled': 'offer',      // ยกเลิก
            'refunded': 'offer',       // คืนเงิน
            'disputed': 'delivery'     // มีข้อพิพาท
        };

        setCurrentStep(statusToStep[order.status] || 'offer');
    }, [order, acceptedOfferPrice]);

    const handleCreateOrder = async () => {
        if (!acceptedOfferPrice) return;

        setIsLoading(true);
        try {
            // For now, create order with meetup delivery
            const orderId = await orderService.createOrderFromOffer(
                { price: acceptedOfferPrice, offer_status: 'accepted' },
                {
                    id: chatRoomId,
                    buyer_id: buyerId,
                    seller_id: sellerId,
                    listing_id: listingId,
                    listing_title: listingTitle
                }
            );

            if (orderId) {
                const newOrder = await orderService.getOrder(orderId);
                setOrder(newOrder);
                onOrderCreated?.(orderId);
            }
        } catch (error) {
            console.error('Error creating order:', error);
        }
        setIsLoading(false);
    };

    const handleMockPayment = async () => {
        if (!order) return;

        setIsLoading(true);
        try {
            const result = await orderService.simulateMockPayment(order.id);
            if (result.success) {
                // Refresh order
                const updatedOrder = await orderService.getOrder(order.id);
                setOrder(updatedOrder);
                onPaymentComplete?.();
            }
        } catch (error) {
            console.error('Error processing payment:', error);
        }
        setIsLoading(false);
    };

    const handleConfirmDelivery = async () => {
        if (!order) return;

        setIsLoading(true);
        try {
            await orderService.updateStatus(order.id, 'delivered');
            const updatedOrder = await orderService.getOrder(order.id);
            setOrder(updatedOrder);
        } catch (error) {
            console.error('Error confirming delivery:', error);
        }
        setIsLoading(false);
    };

    const handleMarkShipped = async () => {
        if (!order) return;

        setIsLoading(true);
        try {
            // In a real app, we would prompt for tracking number here
            await orderService.addTrackingNumber(order.id, 'Other', 'MANUAL-HANDOVER');
            const updatedOrder = await orderService.getOrder(order.id);
            setOrder(updatedOrder);
        } catch (error) {
            console.error('Error marking shipped:', error);
        }
        setIsLoading(false);
    };

    const handleCompleteTransaction = async () => {
        if (!order) return;

        setIsLoading(true);
        try {
            await orderService.updateStatus(order.id, 'completed');
            const updatedOrder = await orderService.getOrder(order.id);
            setOrder(updatedOrder);
            onTransactionComplete?.();
        } catch (error) {
            console.error('Error completing transaction:', error);
        }
        setIsLoading(false);
    };

    // Check if features are available
    const isPaymentEnabled = FEATURE_FLAGS.PAYMENT_ENABLED || FEATURE_FLAGS.MOCK_PAYMENT_ENABLED;
    const isOrderEnabled = FEATURE_FLAGS.ORDER_SYSTEM_ENABLED;

    if (!isOrderEnabled) {
        return (
            <div className="p-4 text-center text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">ระบบ Order ยังไม่เปิดใช้งาน</p>
                <p className="text-xs">กรุณาติดต่อผู้ขายโดยตรง</p>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">สถานะการซื้อขาย</h3>
                    {order && (
                        <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                            #{order.orderNumber}
                        </span>
                    )}
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between mt-4">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        const isActive = step.key === currentStep;
                        const isComplete = steps.findIndex(s => s.key === currentStep) > i;

                        return (
                            <div key={step.key} className="flex items-center">
                                <div className="flex flex-col items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isActive ? 'bg-white text-purple-600 shadow-lg' :
                                        isComplete ? 'bg-green-400 text-white' :
                                            'bg-white/30 text-white/60'
                                        }`}>
                                        {isComplete ? (
                                            <CheckCircle className="w-5 h-5" />
                                        ) : (
                                            <Icon className="w-4 h-4" />
                                        )}
                                    </div>
                                    <span className={`text-[10px] mt-1 ${isActive ? 'font-bold' : 'opacity-70'}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {i < steps.length - 1 && (
                                    <div className={`w-8 h-0.5 mx-1 ${isComplete ? 'bg-green-400' : 'bg-white/30'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Content based on current step */}
            <div className="p-4">
                <AnimatePresence mode="wait">
                    {currentStep === 'offer' && !acceptedOfferPrice && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center py-4"
                        >
                            <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-600 dark:text-gray-400 mb-2">
                                รอการยอมรับข้อเสนอ
                            </p>
                            <p className="text-sm text-gray-500">
                                เสนอราคาแล้วรอให้{role === 'buyer' ? 'ผู้ขาย' : 'ผู้ซื้อ'}ยอมรับ
                            </p>
                        </motion.div>
                    )}

                    {currentStep === 'payment' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {!order && (
                                <div className="space-y-4">
                                    {/* Price Summary */}
                                    <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                                        <div className="flex justify-between mb-2">
                                            <span className="text-gray-600">ราคาตกลง</span>
                                            <span className="font-bold text-lg">฿{finalPrice.toLocaleString()}</span>
                                        </div>
                                        {FEATURE_FLAGS.PAYMENT_ENABLED && (
                                            <>
                                                <div className="flex justify-between text-sm text-gray-500">
                                                    <span>ค่าธรรมเนียม ({PLATFORM_CONFIG.payment.platformFeePercent}%)</span>
                                                    <span>฿{platformFee.toLocaleString()}</span>
                                                </div>
                                                <div className="border-t border-gray-200 dark:border-gray-700 my-2" />
                                                <div className="flex justify-between text-sm">
                                                    <span className="text-gray-600">ผู้ขายจะได้รับ</span>
                                                    <span className="font-bold text-green-600">฿{sellerPayout.toLocaleString()}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {/* Delivery Method */}
                                    <div>
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">วิธีรับสินค้า</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            <button
                                                onClick={() => setDeliveryMethod('meetup')}
                                                className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${deliveryMethod === 'meetup'
                                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                    : 'border-gray-200 dark:border-gray-700'
                                                    }`}
                                            >
                                                <MapPin className="w-5 h-5 text-purple-600" />
                                                <span className="text-sm font-medium">นัดรับ</span>
                                            </button>
                                            <button
                                                onClick={() => setDeliveryMethod('shipping')}
                                                disabled={!FEATURE_FLAGS.SHIPPING_ENABLED}
                                                className={`p-3 rounded-xl border-2 transition-all flex items-center gap-2 ${deliveryMethod === 'shipping'
                                                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                    : 'border-gray-200 dark:border-gray-700'
                                                    } ${!FEATURE_FLAGS.SHIPPING_ENABLED ? 'opacity-50' : ''}`}
                                            >
                                                <Truck className="w-5 h-5 text-blue-600" />
                                                <span className="text-sm font-medium">จัดส่ง</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Button */}
                                    {role === 'buyer' && (
                                        <button
                                            onClick={handleCreateOrder}
                                            disabled={isLoading}
                                            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                        >
                                            {isLoading ? 'กำลังสร้างออเดอร์...' : 'ยืนยันการซื้อ'}
                                        </button>
                                    )}

                                    {role === 'seller' && (
                                        <div className="text-center py-2">
                                            <Clock className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                                            <p className="text-sm text-gray-600">รอผู้ซื้อยืนยันการซื้อ</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {order && order.status === 'pending' && role === 'buyer' && (
                                <div className="space-y-4">
                                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900 rounded-xl p-4 text-center">
                                        <QrCode className="w-16 h-16 text-amber-600 mx-auto mb-3" />
                                        <p className="font-bold text-lg mb-1">ชำระเงิน ฿{finalPrice.toLocaleString()}</p>
                                        {FEATURE_FLAGS.MOCK_PAYMENT_ENABLED && (
                                            <p className="text-sm text-amber-600">Mock Payment Mode</p>
                                        )}
                                    </div>

                                    {FEATURE_FLAGS.MOCK_PAYMENT_ENABLED && (
                                        <button
                                            onClick={handleMockPayment}
                                            disabled={isLoading}
                                            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all disabled:opacity-50"
                                        >
                                            {isLoading ? 'กำลังชำระเงิน...' : '💳 จำลองการชำระเงิน (Mock)'}
                                        </button>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {currentStep === 'shipping' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center py-4"
                        >
                            <Shield className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <p className="font-bold text-lg text-green-600 mb-1">ชำระเงินสำเร็จ!</p>
                            <p className="text-sm text-gray-600 mb-4">
                                {role === 'seller'
                                    ? 'กรุณาจัดส่งสินค้าหรือนัดรับกับผู้ซื้อ'
                                    : 'รอผู้ขายจัดส่งสินค้า'
                                }
                            </p>

                            {role === 'seller' && (
                                <button
                                    onClick={handleMarkShipped}
                                    disabled={isLoading}
                                    className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                                >
                                    {isLoading ? 'กำลังบันทึก...' : '🚚 ยืนยันการจัดส่ง/นัดรับ'}
                                </button>
                            )}

                            {FEATURE_FLAGS.ESCROW_ENABLED && (
                                <div className="mt-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-sm">
                                    <Shield className="w-4 h-4 inline mr-1 text-blue-600" />
                                    เงินอยู่ในระบบ Escrow
                                </div>
                            )}
                        </motion.div>
                    )}

                    {currentStep === 'delivery' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center py-4"
                        >
                            <Truck className="w-12 h-12 text-blue-500 mx-auto mb-3" />
                            <p className="font-bold text-lg mb-2">สินค้ากำลังจัดส่ง</p>

                            {role === 'buyer' && (
                                <button
                                    onClick={handleConfirmDelivery}
                                    disabled={isLoading}
                                    className="w-full py-3 bg-green-600 text-white font-bold rounded-xl mt-4"
                                >
                                    {isLoading ? 'กำลังยืนยัน...' : '✅ ยืนยันได้รับสินค้า'}
                                </button>
                            )}

                            {role === 'seller' && (
                                <p className="text-sm text-gray-500">รอผู้ซื้อยืนยันได้รับสินค้า</p>
                            )}
                        </motion.div>
                    )}

                    {currentStep === 'review' && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="text-center py-4"
                        >
                            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                            <p className="font-bold text-lg text-green-600 mb-2">รับสินค้าเรียบร้อย!</p>

                            {role === 'buyer' && (
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600">ให้คะแนนประสบการณ์การซื้อ</p>
                                    <div className="flex justify-center gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} className="p-1">
                                                <Star className="w-8 h-8 text-amber-400 hover:fill-current" />
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={handleCompleteTransaction}
                                        disabled={isLoading}
                                        className="w-full py-3 bg-purple-600 text-white font-bold rounded-xl mt-4"
                                    >
                                        ยืนยันและเสร็จสิ้น
                                    </button>
                                </div>
                            )}

                            {role === 'seller' && (
                                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 mt-4">
                                    <p className="text-green-700 dark:text-green-400 font-bold">
                                        รอรับเงิน ฿{sellerPayout.toLocaleString()}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        หลังผู้ซื้อยืนยันและให้รีวิว
                                    </p>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {currentStep === 'complete' && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-6"
                        >
                            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                                <CheckCircle className="w-10 h-10 text-white" />
                            </div>
                            <p className="font-bold text-2xl text-green-600 mb-2">ซื้อขายสำเร็จ! 🎉</p>
                            <p className="text-gray-600">
                                ขอบคุณที่ใช้บริการ JaiKod
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Safety Notice */}
            {!FEATURE_FLAGS.ESCROW_ENABLED && currentStep !== 'complete' && (
                <div className="px-4 pb-4">
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3">
                        <div className="flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-xs text-amber-700 dark:text-amber-400">
                                <p className="font-bold mb-1">Classified Mode</p>
                                <p>กรุณาตรวจสอบสินค้าก่อนจ่ายเงิน และนัดพบที่สาธารณะเท่านั้น</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

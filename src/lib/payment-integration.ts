/**
 * Payment Gateway Integration
 * รองรับ PromptPay, Credit Card, และ Bank Transfer
 */

// ========================================
// Feature Flag Configuration
// ========================================

export interface PaymentConfig {
    enabled: boolean;
    methods: {
        promptpay: boolean;
        creditCard: boolean;
        bankTransfer: boolean;
        cod: boolean;  // Cash on Delivery
    };
    provider: 'omise' | 'stripe' | 'paypal' | 'gbprimepay';
    testMode: boolean;
}

export const DEFAULT_PAYMENT_CONFIG: PaymentConfig = {
    enabled: false,  // ปิดไว้ก่อน รอตั้งค่า
    methods: {
        promptpay: true,
        creditCard: false,
        bankTransfer: true,
        cod: true
    },
    provider: 'omise',  // แนะนำสำหรับไทย
    testMode: true
};

// ========================================
// Types
// ========================================

export interface PaymentMethod {
    id: string;
    type: 'promptpay' | 'credit_card' | 'bank_transfer' | 'cod';
    name: string;
    icon: string;
    fee: number;  // ค่าธรรมเนียม (%)
    enabled: boolean;
}

export interface PaymentIntent {
    id: string;
    amount: number;
    currency: string;
    status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled';
    method: string;
    createdAt: Date;
    metadata?: Record<string, any>;
}

export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
    redirectUrl?: string;  // สำหรับ 3D Secure
}

// ========================================
// Payment Methods
// ========================================

export const PAYMENT_METHODS: PaymentMethod[] = [
    {
        id: 'promptpay',
        type: 'promptpay',
        name: 'พร้อมเพย์ (PromptPay)',
        icon: '💳',
        fee: 0,  // ไม่มีค่าธรรมเนียม
        enabled: true
    },
    {
        id: 'credit_card',
        type: 'credit_card',
        name: 'บัตรเครดิต/เดบิต',
        icon: '💳',
        fee: 2.9,  // 2.9% + ฿10
        enabled: false  // ปิดไว้ก่อน
    },
    {
        id: 'bank_transfer',
        type: 'bank_transfer',
        name: 'โอนเงินผ่านธนาคาร',
        icon: '🏦',
        fee: 0,
        enabled: true
    },
    {
        id: 'cod',
        type: 'cod',
        name: 'เก็บเงินปลายทาง (COD)',
        icon: '💵',
        fee: 0,
        enabled: true
    }
];

// ========================================
// Payment Service
// ========================================

/**
 * สร้าง Payment Intent
 */
export async function createPaymentIntent(
    amount: number,
    method: string,
    metadata?: Record<string, any>,
    config: PaymentConfig = DEFAULT_PAYMENT_CONFIG
): Promise<PaymentIntent | null> {
    if (!config.enabled) {
        console.warn('Payment gateway is disabled');
        return null;
    }

    try {
        // TODO: Integrate with actual payment provider
        // For now, return mock data

        const intent: PaymentIntent = {
            id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount,
            currency: 'THB',
            status: 'pending',
            method,
            createdAt: new Date(),
            metadata
        };

        // Simulate API call
        if (config.testMode) {
            console.log('Test Mode: Payment Intent Created', intent);
        }

        return intent;
    } catch (error) {
        console.error('Error creating payment intent:', error);
        return null;
    }
}

/**
 * ชำระเงินด้วย PromptPay
 */
export async function payWithPromptPay(
    amount: number,
    phoneNumber: string,
    config: PaymentConfig = DEFAULT_PAYMENT_CONFIG
): Promise<PaymentResult> {
    if (!config.enabled || !config.methods.promptpay) {
        return {
            success: false,
            error: 'PromptPay is disabled'
        };
    }

    try {
        // TODO: Generate PromptPay QR Code
        // Using Thai QR Payment Standard

        if (config.testMode) {
            console.log('Test Mode: PromptPay Payment', { amount, phoneNumber });

            // Simulate success
            return {
                success: true,
                transactionId: `pp_${Date.now()}`,
                redirectUrl: `/payment/promptpay-qr?amount=${amount}&phone=${phoneNumber}`
            };
        }

        // Real implementation would call payment provider API
        return {
            success: false,
            error: 'Not implemented'
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Payment failed'
        };
    }
}

/**
 * ชำระเงินด้วยบัตรเครดิต
 */
export async function payWithCreditCard(
    amount: number,
    cardToken: string,
    config: PaymentConfig = DEFAULT_PAYMENT_CONFIG
): Promise<PaymentResult> {
    if (!config.enabled || !config.methods.creditCard) {
        return {
            success: false,
            error: 'Credit card payment is disabled'
        };
    }

    try {
        if (config.testMode) {
            console.log('Test Mode: Credit Card Payment', { amount, cardToken });

            // Simulate success
            return {
                success: true,
                transactionId: `cc_${Date.now()}`
            };
        }

        // Real implementation would call Omise/Stripe API
        return {
            success: false,
            error: 'Not implemented'
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Payment failed'
        };
    }
}

/**
 * สร้างคำสั่งโอนเงินผ่านธนาคาร
 */
export async function createBankTransferOrder(
    amount: number,
    buyerInfo: { name: string; email: string },
    config: PaymentConfig = DEFAULT_PAYMENT_CONFIG
): Promise<{
    success: boolean;
    orderId?: string;
    bankAccount?: {
        bank: string;
        accountNumber: string;
        accountName: string;
    };
    error?: string;
}> {
    if (!config.enabled || !config.methods.bankTransfer) {
        return {
            success: false,
            error: 'Bank transfer is disabled'
        };
    }

    try {
        const orderId = `bt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // TODO: Get actual bank account from config
        const bankAccount = {
            bank: 'ธนาคารกสิกรไทย',
            accountNumber: 'XXX-X-XXXXX-X',
            accountName: 'บริษัท ใจก๊อด จำกัด'
        };

        if (config.testMode) {
            console.log('Test Mode: Bank Transfer Order', { orderId, amount, buyerInfo });
        }

        return {
            success: true,
            orderId,
            bankAccount
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create order'
        };
    }
}

/**
 * สร้างคำสั่ง COD (Cash on Delivery)
 */
export async function createCODOrder(
    amount: number,
    deliveryAddress: string,
    config: PaymentConfig = DEFAULT_PAYMENT_CONFIG
): Promise<{
    success: boolean;
    orderId?: string;
    error?: string;
}> {
    if (!config.enabled || !config.methods.cod) {
        return {
            success: false,
            error: 'COD is disabled'
        };
    }

    try {
        const orderId = `cod_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        if (config.testMode) {
            console.log('Test Mode: COD Order', { orderId, amount, deliveryAddress });
        }

        return {
            success: true,
            orderId
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Failed to create order'
        };
    }
}

/**
 * ตรวจสอบสถานะการชำระเงิน
 */
export async function checkPaymentStatus(
    transactionId: string,
    config: PaymentConfig = DEFAULT_PAYMENT_CONFIG
): Promise<PaymentIntent | null> {
    if (!config.enabled) {
        console.warn('Payment gateway is disabled');
        return null;
    }

    try {
        // TODO: Call payment provider API to check status

        if (config.testMode) {
            console.log('Test Mode: Checking payment status', transactionId);

            // Simulate response
            return {
                id: transactionId,
                amount: 0,
                currency: 'THB',
                status: 'succeeded',
                method: 'promptpay',
                createdAt: new Date()
            };
        }

        return null;
    } catch (error) {
        console.error('Error checking payment status:', error);
        return null;
    }
}

/**
 * คำนวณค่าธรรมเนียม
 */
export function calculateFee(amount: number, method: string): number {
    const paymentMethod = PAYMENT_METHODS.find(m => m.id === method);
    if (!paymentMethod) return 0;

    if (method === 'credit_card') {
        // 2.9% + ฿10
        return Math.ceil(amount * 0.029 + 10);
    }

    return Math.ceil(amount * (paymentMethod.fee / 100));
}

/**
 * คำนวณยอดรวม (รวมค่าธรรมเนียม)
 */
export function calculateTotal(amount: number, method: string): number {
    const fee = calculateFee(amount, method);
    return amount + fee;
}

// ========================================
// Admin Configuration
// ========================================

/**
 * บันทึกการตั้งค่า Payment
 */
export async function savePaymentConfig(config: PaymentConfig): Promise<void> {
    // TODO: Save to Firestore
    localStorage.setItem('payment_config', JSON.stringify(config));
}

/**
 * ดึงการตั้งค่า Payment
 */
export async function getPaymentConfig(): Promise<PaymentConfig> {
    try {
        const saved = localStorage.getItem('payment_config');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Error loading Payment config:', error);
    }

    return DEFAULT_PAYMENT_CONFIG;
}

/**
 * ดึงวิธีการชำระเงินที่เปิดใช้งาน
 */
export async function getEnabledPaymentMethods(
    config: PaymentConfig = DEFAULT_PAYMENT_CONFIG
): Promise<PaymentMethod[]> {
    if (!config.enabled) {
        return [];
    }

    return PAYMENT_METHODS.filter(method => {
        const methodKey = method.type as keyof typeof config.methods;
        return config.methods[methodKey] && method.enabled;
    });
}

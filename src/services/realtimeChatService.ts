import { Product } from '@/types'

export interface ChatUser {
    id: string
    name: string
    avatar: string
    isOnline: boolean
    lastSeen: number
    trustScore?: number // 0-100
    isVerified?: boolean
}

export interface ChatMessage {
    id: string
    senderId: string
    text: string
    type: 'text' | 'image' | 'video' | 'location' | 'product_card' | 'system' | 'order_offer' | 'coupon'
    mediaUrl?: string
    metadata?: {
        // Location
        lat?: number
        lng?: number
        locationName?: string
        // Order/Offer
        orderId?: string
        offerPrice?: number
        items?: Array<{ name: string, qty: number, price: number }>
        // System
        severity?: 'info' | 'warning' | 'danger'
    }
    isRead: boolean
    status: 'sent' | 'delivered' | 'read'
    createdAt: number
    isSafetyWarning?: boolean
}

export interface Conversation {
    id: string
    participants: ChatUser[]
    lastMessage: ChatMessage
    unreadCount: number
    productId?: string
    product?: Partial<Product>
    folder?: 'general' | 'orders' | 'support'
    aiSummary?: string
    isTyping?: boolean // UI state
}

// Mock WebSocket Listener
type MessageHandler = (msg: ChatMessage) => void
type TypingHandler = (isTyping: boolean) => void

export class MockChatSocket {
    private onMessage: MessageHandler | null = null
    private onTyping: TypingHandler | null = null
    private interval: NodeJS.Timeout | null = null

    connect(userId: string, conversationId: string) {
        // Simulate "Other person" typing and replying
        this.interval = setInterval(() => {
            if (Math.random() > 0.8 && this.onTyping) {
                this.onTyping(true)
                setTimeout(() => {
                    if (this.onTyping) this.onTyping(false)
                    // 50% chance to send message after typing
                    if (Math.random() > 0.5 && this.onMessage) {
                        this.onMessage({
                            id: `msg_${Date.now()}`,
                            senderId: 'other',
                            text: this.getRandomReply(),
                            type: 'text',
                            isRead: false,
                            status: 'sent',
                            createdAt: Date.now()
                        })
                    }
                }, 3000)
            }
        }, 10000)
    }

    disconnect() {
        if (this.interval) clearInterval(this.interval)
    }

    on(event: 'message' | 'typing', handler: any) {
        if (event === 'message') this.onMessage = handler
        if (event === 'typing') this.onTyping = handler
    }

    private getRandomReply() {
        const replies = [
            'โอเคครับ',
            'น่าสนใจครับ',
            'ลดได้อีกไหมครับ?',
            'ของยังมีอยู่ไหม?',
            'สะดวกนัดรับไหมครับ?',
            'ขอดูรูปเพิ่มหน่อยได้ไหม'
        ]
        return replies[Math.floor(Math.random() * replies.length)]
    }
}

// Service Methods
export const realtimeChatService = {
    getHistory: async (conversationId: string): Promise<ChatMessage[]> => {
        // Mock History
        return [
            {
                id: 'm1',
                senderId: 'other',
                text: 'สวัสดีครับ สินค้าชิ้นนี้ยังอยู่ไหม?',
                type: 'text',
                isRead: true,
                status: 'read',
                createdAt: Date.now() - 86400000
            },
            {
                id: 'm2',
                senderId: 'me',
                text: 'ยังอยู่ครับ สอบถามได้เลย',
                type: 'text',
                isRead: true,
                status: 'read',
                createdAt: Date.now() - 86000000
            },
            {
                id: 'm3',
                senderId: 'other',
                text: 'ลดได้เต็มที่เท่าไหร่ครับ?',
                type: 'text',
                isRead: true,
                status: 'read',
                createdAt: Date.now() - 85000000
            }
        ]
    },

    sendMessage: async (text: string, type: ChatMessage['type'] = 'text', metadata?: any): Promise<ChatMessage> => {
        return {
            id: `new_${Date.now()}`,
            senderId: 'me',
            text,
            type,
            metadata,
            isRead: false,
            status: 'sent',
            createdAt: Date.now()
        }
    },

    deleteMessage: async (messageId: string): Promise<boolean> => {
        // Mock API call
        await new Promise(resolve => setTimeout(resolve, 300))
        return true
    },

    getSmartReplies: (context: string[]): string[] => {
        const lastText = context[context.length - 1] || ''
        if (lastText.includes('ลด')) return ['ลดได้นิดหน่อยครับ', 'เต็มที่แล้วครับ', 'เสนอมาได้เลย']
        if (lastText.includes('นัด')) return ['สะดวก BTS สยามครับ', 'สะดวกเซ็นทรัลลาดพร้าว', 'ส่ง Grab ได้ครับ']
        return ['สวัสดีครับ', 'สินค้าพร้อมส่งครับ', 'สอบถามได้ครับ']
    },

    analyzeSafety: (text: string): { safe: boolean; warning?: string } => {
        const risks = ['โอนก่อน', 'มัดจำ', 'line id', 'แอดไลน์', 'รีบ']
        if (risks.some(r => text.toLowerCase().includes(r))) {
            return {
                safe: false,
                warning: 'ระบบตรวจพบคำที่อาจมีความเสี่ยง (เช่น การโอนก่อน หรือชวนไปแอปอื่น) โปรดระมัดระวังมิจฉาชีพ'
            }
        }
        return { safe: true }
    }
}

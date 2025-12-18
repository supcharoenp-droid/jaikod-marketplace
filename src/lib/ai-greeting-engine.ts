import { ProfileUser, ProfileStats, OrdersSummary } from '@/contexts/ProfileContext'

export interface AIGreeting {
    messageTh: string
    messageEn: string
    tone: 'friendly' | 'motivational' | 'congratulatory'
}

interface GreetingContext {
    user: ProfileUser
    stats: ProfileStats
    ordersSummary: OrdersSummary
    currentHour: number
}

/**
 * AI Greeting Engine - Generates personalized, context-aware greetings
 */
export function generateAIGreeting(context: GreetingContext): AIGreeting {
    const { user, stats, ordersSummary, currentHour } = context
    const isBuyer = user.roles.includes('buyer')
    const isSeller = user.roles.includes('seller')
    const isHybrid = isBuyer && isSeller
    const firstName = user.name.split(' ')[0]

    // Time-based greeting prefix
    const getTimeGreeting = () => {
        if (currentHour >= 5 && currentHour < 12) {
            return { th: 'สวัสดีตอนเช้า', en: 'Good morning' }
        } else if (currentHour >= 12 && currentHour < 18) {
            return { th: 'สวัสดีตอนบ่าย', en: 'Good afternoon' }
        } else {
            return { th: 'สวัสดีตอนเย็น', en: 'Good evening' }
        }
    }

    const timeGreeting = getTimeGreeting()

    // Generate context-aware messages
    const messages: AIGreeting[] = []

    // Pending orders message
    if (ordersSummary.pending > 0) {
        messages.push({
            messageTh: `${timeGreeting.th}, ${firstName}! คุณมี ${ordersSummary.pending} คำสั่งซื้อรอดำเนินการ`,
            messageEn: `${timeGreeting.en}, ${firstName}! You have ${ordersSummary.pending} pending order${ordersSummary.pending > 1 ? 's' : ''}`,
            tone: 'friendly'
        })
    }

    // Level up opportunity
    const buyerProgress = stats.progress.buyer
    const sellerProgress = stats.progress.seller

    if (isBuyer && buyerProgress >= 85) {
        const remaining = 100 - buyerProgress
        messages.push({
            messageTh: `${firstName}, คุณใกล้อัปเลเวลแล้ว! เหลืออีกเพียง ${remaining}% เท่านั้น`,
            messageEn: `${firstName}, you're close to leveling up! Just ${remaining}% to go`,
            tone: 'motivational'
        })
    }

    if (isSeller && sellerProgress >= 85) {
        const remaining = 100 - sellerProgress
        messages.push({
            messageTh: `${firstName}, ร้านของคุณใกล้เลเวลใหม่แล้ว! เหลืออีก ${remaining}%`,
            messageEn: `${firstName}, your shop is almost at the next level! ${remaining}% remaining`,
            tone: 'motivational'
        })
    }

    // High performance message
    if (stats.coins >= 1000) {
        messages.push({
            messageTh: `${firstName}, คุณมีเหรียญถึง ${stats.coins.toLocaleString()} แล้ว! เก่งมาก 🎉`,
            messageEn: `${firstName}, you've earned ${stats.coins.toLocaleString()} coins! Amazing work 🎉`,
            tone: 'congratulatory'
        })
    }

    // Hybrid user special message
    if (isHybrid) {
        messages.push({
            messageTh: `${timeGreeting.th}, ${firstName}! คุณเป็นทั้งผู้ซื้อและผู้ขาย ยอดเยี่ยม!`,
            messageEn: `${timeGreeting.en}, ${firstName}! You're both a buyer and seller. Excellent!`,
            tone: 'friendly'
        })
    }

    // Seller-specific message
    if (isSeller && !isHybrid) {
        const completedOrders = ordersSummary.completed
        if (completedOrders > 10) {
            messages.push({
                messageTh: `${firstName}, คุณขายสำเร็จไปแล้ว ${completedOrders} รายการ! ยอดเยี่ยม`,
                messageEn: `${firstName}, you've completed ${completedOrders} sales! Outstanding`,
                tone: 'congratulatory'
            })
        }
    }

    // Default welcome message
    if (messages.length === 0) {
        messages.push({
            messageTh: `${timeGreeting.th}, ${firstName}! ยินดีต้อนรับกลับมา`,
            messageEn: `${timeGreeting.en}, ${firstName}! Welcome back`,
            tone: 'friendly'
        })
    }

    // Return the most relevant message (first one)
    return messages[0]
}

/**
 * Dev Mode Greeting Generator
 */
export function generateDevModeGreeting(currentHour: number): AIGreeting {
    const timeGreeting = currentHour >= 5 && currentHour < 12
        ? { th: 'สวัสดีตอนเช้า', en: 'Good morning' }
        : currentHour >= 12 && currentHour < 18
            ? { th: 'สวัสดีตอนบ่าย', en: 'Good afternoon' }
            : { th: 'สวัสดีตอนเย็น', en: 'Good evening' }

    return {
        messageTh: `${timeGreeting.th}, ผู้ทดสอบ! ระบบทำงานปกติ ไม่มีคำสั่งซื้อค้างอยู่`,
        messageEn: `${timeGreeting.en}, Tester! System is running smoothly. No pending orders`,
        tone: 'friendly'
    }
}

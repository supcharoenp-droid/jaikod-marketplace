import { Notification, createNotification } from '@/lib/notifications'
import { getUserBehavior } from './behaviorTracking'

// Mock AI Logic to generate notifications based on behavior
export async function checkAndGenerateSmartNotifications(userId: string) {
    const behavior = getUserBehavior()
    const notifications: Partial<Notification>[] = []

    // 1. Interest Based: Price Drop on Viewed Items
    // In real app, check database for price changes on viewedProducts
    if (behavior.viewedProducts.length > 0 && Math.random() > 0.7) {
        notifications.push({
            type: 'INTEREST',
            priority: 'high',
            title: '🔥 สินค้าที่คุณดู ลดราคา!',
            body: 'iPhone 15 Pro ที่คุณสนใจ ลดเหลือ 35,900.- (จาก 38,900.-)',
            link: `/product/${behavior.viewedProducts[0]}`, // Mock link
            image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=100&h=100&fit=crop'
        })
    }

    // 2. Geo Based: New in Area
    if (Math.random() > 0.8) {
        notifications.push({
            type: 'GEO',
            priority: 'medium',
            title: '📍 ของมาใหม่ใกล้คุณ (ลาดพร้าว)',
            body: 'มีสินค้า "เฟอร์นิเจอร์" ลงขายใหม่ 5 รายการในระยะ 3 กม.',
            link: '/search?lat=13.8&lng=100.6&sort=newest',
            image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=100&fit=crop'
        })
    }

    // 3. Behavior Based: AI Suggestion
    if (Math.random() > 0.6) {
        // Mock suggestion based on top category
        notifications.push({
            type: 'BEHAVIOR',
            priority: 'medium',
            title: '✨ แนะนำสำหรับคุณโดยเฉพาะ',
            body: 'เราคัด "กล้องฟิล์ม" สภาพสวยมาให้คุณเลือก 10+ รายการ',
            link: '/for-you',
            image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop'
        })
    }

    // 4. Seller Notification (if user is seller)
    // In a real app check user role
    const isSeller = true // Mock
    if (isSeller && Math.random() > 0.9) {
        notifications.push({
            type: 'SELLER',
            priority: 'high',
            title: '📈 ยอดเข้าชมร้านพุ่งสูงขึ้น!',
            body: 'สินค้า "MacBook Air" ของคุณกำลังเป็นที่นิยม ลอง Boost เพื่อปิดการขายไวขึ้น',
            link: '/seller/tools/ads'
        })
    }

    // Determine which to actually send (Noise reduction)
    // In demo, we just return them all. In prod, we'd throttle.
    return notifications
}

// Function to inject mock notifications into Firestore (for demo purposes)
export async function injectMockNotifications(userId: string) {
    const notifs = await checkAndGenerateSmartNotifications(userId)

    for (const n of notifs) {
        await createNotification(userId, {
            type: n.type as any,
            title: n.title!,
            body: n.body!,
            link: n.link
        })
    }
}

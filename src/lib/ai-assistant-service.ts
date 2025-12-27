/**
 * AI Assistant Service
 * Handles OpenAI API integration for Seller Centre AI Assistant
 */

import OpenAI from 'openai'

// ==================== Types ====================
export interface SellerContext {
    sellerId: string
    shopName: string
    totalProducts: number
    totalOrders: number
    totalRevenue: number
    averageRating: number
    pendingOrders: number
    lowStockItems: number
    unreadMessages: number
    lastLoginDate: Date
    shopCategory: string
    monthlyViews: number
    conversionRate: number
}

export interface ChatMessage {
    role: 'user' | 'assistant' | 'system'
    content: string
}

export interface AIResponse {
    message: string
    suggestions?: string[]
    actionItems?: ActionItem[]
    proactiveAlerts?: ProactiveAlert[]
}

export interface ActionItem {
    id: string
    title: string
    titleTh: string
    action: string
    priority: 'high' | 'medium' | 'low'
    link?: string
}

export interface ProactiveAlert {
    id: string
    type: 'warning' | 'info' | 'success' | 'urgent'
    message: string
    messageTh: string
    actionLink?: string
    createdAt: Date
}

// ==================== System Prompt ====================
const generateSystemPrompt = (context: SellerContext, language: string): string => {
    const isThai = language === 'th'

    return `You are JaiKod AI (ใจกอด AI), a friendly and knowledgeable e-commerce assistant for Thai sellers on the JaiKod marketplace platform.

## Your Personality:
- Friendly, warm, and approachable (like a helpful friend)
- Professional but not overly formal
- Encouraging and supportive
- Proactive in offering helpful suggestions
- Use appropriate emojis to be engaging

## Language:
- Respond in ${isThai ? 'Thai (ภาษาไทย)' : 'English'}
- Use casual but polite language
- ${isThai ? 'Use ครับ/ค่ะ appropriately' : 'Be warm and friendly'}

## Current Seller Context:
- Shop Name: ${context.shopName}
- Total Products: ${context.totalProducts}
- Total Orders: ${context.totalOrders}
- Total Revenue: ฿${context.totalRevenue.toLocaleString()}
- Average Rating: ${context.averageRating}/5
- Pending Orders: ${context.pendingOrders}
- Low Stock Items: ${context.lowStockItems}
- Unread Messages: ${context.unreadMessages}
- Monthly Views: ${context.monthlyViews}
- Conversion Rate: ${context.conversionRate}%
- Shop Category: ${context.shopCategory}

## Your Capabilities:
1. Answer questions about selling on JaiKod
2. Provide tips for improving sales, product listings, and marketing
3. Analyze shop performance and suggest improvements
4. Help with pricing strategies
5. Guide sellers through platform features
6. Alert about important actions needed (pending orders, low stock, etc.)

## Response Guidelines:
- Keep responses concise but helpful (max 300 words)
- Use bullet points for lists
- Bold important terms using **text**
- Include actionable advice
- Reference the seller's actual data when relevant
- Suggest specific next steps

## Platform Features to Know:
- Shop Ads (paid advertising)
- Flash Sale (time-limited discounts)
- Vouchers (discount coupons)
- AI-powered product listing
- Analytics dashboard
- Chat with customers`
}

// ==================== OpenAI Client ====================
let openaiClient: OpenAI | null = null

const getOpenAIClient = (): OpenAI => {
    if (!openaiClient) {
        openaiClient = new OpenAI({
            apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
            dangerouslyAllowBrowser: true // For client-side usage in development
        })
    }
    return openaiClient
}

// ==================== Main AI Function ====================
export async function generateAIAssistantResponse(
    userMessage: string,
    context: SellerContext,
    conversationHistory: ChatMessage[],
    language: string = 'th'
): Promise<AIResponse> {
    const systemPrompt = generateSystemPrompt(context, language)

    // Build messages array
    const messages: ChatMessage[] = [
        { role: 'system', content: systemPrompt },
        ...conversationHistory.slice(-10), // Keep last 10 messages for context
        { role: 'user', content: userMessage }
    ]

    try {
        const openai = getOpenAIClient()

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: messages.map(m => ({ role: m.role, content: m.content })),
            max_tokens: 500,
            temperature: 0.7,
        })

        const responseContent = completion.choices[0]?.message?.content ||
            (language === 'th' ? 'ขออภัย ไม่สามารถตอบได้ในขณะนี้' : 'Sorry, unable to respond at this time.')

        // Generate proactive alerts based on context
        const alerts = generateProactiveAlerts(context, language)

        // Generate action items if relevant
        const actionItems = generateActionItems(userMessage, context, language)

        return {
            message: responseContent,
            proactiveAlerts: alerts,
            actionItems: actionItems
        }

    } catch (error) {
        console.error('OpenAI API Error:', error)

        // Fallback to rule-based response
        return {
            message: await generateFallbackResponse(userMessage, context, language),
            proactiveAlerts: generateProactiveAlerts(context, language)
        }
    }
}

// ==================== Proactive Alerts ====================
function generateProactiveAlerts(context: SellerContext, language: string): ProactiveAlert[] {
    const alerts: ProactiveAlert[] = []
    const isThai = language === 'th'

    // Urgent: Pending orders
    if (context.pendingOrders > 0) {
        alerts.push({
            id: 'pending-orders',
            type: 'urgent',
            message: `You have ${context.pendingOrders} pending order(s) to process!`,
            messageTh: `คุณมี ${context.pendingOrders} คำสั่งซื้อที่รอดำเนินการ!`,
            actionLink: '/seller/orders',
            createdAt: new Date()
        })
    }

    // Warning: Low stock
    if (context.lowStockItems > 0) {
        alerts.push({
            id: 'low-stock',
            type: 'warning',
            message: `${context.lowStockItems} product(s) are running low on stock`,
            messageTh: `สินค้า ${context.lowStockItems} รายการใกล้หมดสต็อก`,
            actionLink: '/seller/products',
            createdAt: new Date()
        })
    }

    // Info: Unread messages
    if (context.unreadMessages > 0) {
        alerts.push({
            id: 'unread-messages',
            type: 'info',
            message: `${context.unreadMessages} unread message(s) from customers`,
            messageTh: `มีข้อความ ${context.unreadMessages} ข้อความที่ยังไม่ได้อ่าน`,
            actionLink: '/seller/messages',
            createdAt: new Date()
        })
    }

    // Success: Good conversion rate
    if (context.conversionRate > 5) {
        alerts.push({
            id: 'good-conversion',
            type: 'success',
            message: `Great job! Your conversion rate (${context.conversionRate}%) is above average!`,
            messageTh: `ยอดเยี่ยม! อัตราการแปลงของคุณ (${context.conversionRate}%) สูงกว่าค่าเฉลี่ย!`,
            createdAt: new Date()
        })
    }

    // Warning: Low conversion rate
    if (context.conversionRate < 2 && context.monthlyViews > 100) {
        alerts.push({
            id: 'low-conversion',
            type: 'warning',
            message: 'Your conversion rate is low. Consider improving product photos or pricing.',
            messageTh: 'อัตราการแปลงต่ำ ลองปรับปรุงรูปสินค้าหรือราคาดูนะ',
            createdAt: new Date()
        })
    }

    return alerts
}

// ==================== Action Items ====================
function generateActionItems(
    userMessage: string,
    context: SellerContext,
    language: string
): ActionItem[] {
    const items: ActionItem[] = []
    const lowerMessage = userMessage.toLowerCase()

    // Sales-related query
    if (lowerMessage.includes('ยอดขาย') || lowerMessage.includes('sales') || lowerMessage.includes('เพิ่ม')) {
        items.push({
            id: 'create-promotion',
            title: 'Create a Promotion',
            titleTh: 'สร้างโปรโมชั่น',
            action: 'createPromotion',
            priority: 'high',
            link: '/seller/marketing/vouchers'
        })
        items.push({
            id: 'run-ads',
            title: 'Run Shop Ads',
            titleTh: 'ลงโฆษณา Shop Ads',
            action: 'runAds',
            priority: 'medium',
            link: '/seller/tools/ads'
        })
    }

    // Product-related query
    if (lowerMessage.includes('สินค้า') || lowerMessage.includes('product') || lowerMessage.includes('ลง')) {
        items.push({
            id: 'add-product',
            title: 'Add New Product',
            titleTh: 'เพิ่มสินค้าใหม่',
            action: 'addProduct',
            priority: 'high',
            link: '/sell'
        })
    }

    // Analytics query
    if (lowerMessage.includes('วิเคราะห์') || lowerMessage.includes('analytics') || lowerMessage.includes('ข้อมูล')) {
        items.push({
            id: 'view-analytics',
            title: 'View Analytics',
            titleTh: 'ดูข้อมูลวิเคราะห์',
            action: 'viewAnalytics',
            priority: 'medium',
            link: '/seller/reports'
        })
    }

    return items
}

// ==================== Fallback Response ====================
async function generateFallbackResponse(
    userMessage: string,
    context: SellerContext,
    language: string
): Promise<string> {
    const isThai = language === 'th'
    const lowerMessage = userMessage.toLowerCase()

    // Sales-related
    if (lowerMessage.includes('ยอดขาย') || lowerMessage.includes('sales') || lowerMessage.includes('เพิ่ม')) {
        if (isThai) {
            return `🚀 **เคล็ดลับเพิ่มยอดขายสำหรับ ${context.shopName}:**

จากข้อมูลร้านของคุณ:
• มียอดเข้าชม ${context.monthlyViews} ครั้ง/เดือน
• Conversion Rate ${context.conversionRate}%

**แนะนำ:**
1. **ถ่ายรูปให้สวย** - รูปคุณภาพดีเพิ่มยอดขาย 30%
2. **สร้างโปรโมชั่น** - ลดราคา 10-15% ช่วยดึงลูกค้าใหม่
3. **ตอบแชทให้ไว** - ลูกค้าชอบร้านที่ตอบเร็ว
4. **ใช้ Shop Ads** - โฆษณาสินค้าขายดี

💡 ลองสร้าง Flash Sale สัปดาห์นี้ดูนะครับ!`
        } else {
            return `🚀 **Sales Tips for ${context.shopName}:**

Based on your shop data:
• ${context.monthlyViews} monthly views
• ${context.conversionRate}% conversion rate

**Recommendations:**
1. **Better photos** - Quality images boost sales by 30%
2. **Run promotions** - 10-15% off attracts new customers
3. **Fast response** - Customers love quick replies
4. **Use Shop Ads** - Promote your best sellers

💡 Try creating a Flash Sale this week!`
        }
    }

    // Pending orders
    if (context.pendingOrders > 0 && (lowerMessage.includes('สถานะ') || lowerMessage.includes('status') || lowerMessage.includes('order'))) {
        if (isThai) {
            return `📦 **สถานะร้าน ${context.shopName}:**

⚠️ คุณมี **${context.pendingOrders} คำสั่งซื้อ** ที่รอจัดส่ง
📊 ยอดขายรวม: ฿${context.totalRevenue.toLocaleString()}
⭐ คะแนนร้าน: ${context.averageRating}/5

👉 ไปที่ "คำสั่งซื้อ" เพื่อดำเนินการจัดส่งครับ!`
        } else {
            return `📦 **${context.shopName} Status:**

⚠️ You have **${context.pendingOrders} pending orders**
📊 Total Revenue: ฿${context.totalRevenue.toLocaleString()}
⭐ Shop Rating: ${context.averageRating}/5

👉 Go to "Orders" to process shipments!`
        }
    }

    // Default welcome
    if (isThai) {
        return `👋 สวัสดีครับ! ผม **JaiKod AI** พร้อมช่วยเรื่องร้าน **${context.shopName}**

ผมช่วยได้เรื่อง:
• 💰 เพิ่มยอดขาย
• 📦 จัดการสินค้า
• 📣 การตลาด
• 📊 วิเคราะห์ข้อมูล

ถามมาได้เลยครับ! 😊`
    } else {
        return `👋 Hello! I'm **JaiKod AI**, ready to help with **${context.shopName}**.

I can assist with:
• 💰 Boosting sales
• 📦 Product management
• 📣 Marketing
• 📊 Analytics

Feel free to ask! 😊`
    }
}

// ==================== Context Fetching ====================
export async function fetchSellerContext(sellerId: string): Promise<SellerContext | null> {
    try {
        // Import dynamically to avoid circular dependencies
        const { doc, getDoc, collection, query, where, getDocs } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')

        // Fetch seller profile
        const sellerRef = doc(db, 'sellers', sellerId)
        const sellerDoc = await getDoc(sellerRef)

        if (!sellerDoc.exists()) {
            return null
        }

        const sellerData = sellerDoc.data()

        // Fetch products count
        const productsQuery = query(
            collection(db, 'products'),
            where('sellerId', '==', sellerId)
        )
        const productsSnapshot = await getDocs(productsQuery)
        const totalProducts = productsSnapshot.size

        // Count low stock items
        let lowStockItems = 0
        productsSnapshot.forEach(doc => {
            const data = doc.data()
            if (data.stock !== undefined && data.stock < 5) {
                lowStockItems++
            }
        })

        // Fetch orders
        const ordersQuery = query(
            collection(db, 'orders'),
            where('sellerId', '==', sellerId)
        )
        const ordersSnapshot = await getDocs(ordersQuery)

        let totalOrders = 0
        let totalRevenue = 0
        let pendingOrders = 0

        ordersSnapshot.forEach(doc => {
            const data = doc.data()
            totalOrders++
            totalRevenue += data.totalAmount || 0
            if (data.status === 'pending' || data.status === 'processing') {
                pendingOrders++
            }
        })

        return {
            sellerId,
            shopName: sellerData.name || sellerData.shop_name || 'My Shop',
            totalProducts,
            totalOrders,
            totalRevenue,
            averageRating: sellerData.rating || 4.5,
            pendingOrders,
            lowStockItems,
            unreadMessages: sellerData.unread_messages || 0,
            lastLoginDate: sellerData.last_login?.toDate() || new Date(),
            shopCategory: sellerData.category || 'General',
            monthlyViews: sellerData.monthly_views || Math.floor(Math.random() * 500) + 50,
            conversionRate: sellerData.conversion_rate || Math.round((totalOrders / Math.max(1, sellerData.monthly_views || 100)) * 100 * 10) / 10
        }

    } catch (error) {
        console.error('Error fetching seller context:', error)
        return null
    }
}

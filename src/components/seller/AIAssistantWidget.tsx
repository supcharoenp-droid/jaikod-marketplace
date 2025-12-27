'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
    Bot,
    X,
    Send,
    Sparkles,
    Lightbulb,
    TrendingUp,
    Package,
    MessageCircle,
    ChevronDown,
    Zap,
    HelpCircle,
    BarChart3,
    Tag,
    AlertTriangle,
    CheckCircle,
    Info,
    Bell,
    History,
    Trash2,
    Plus,
    ExternalLink,
    Loader2,
    RefreshCw
} from 'lucide-react'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import {
    generateAIAssistantResponse,
    fetchSellerContext,
    SellerContext,
    ProactiveAlert,
    ActionItem
} from '@/lib/ai-assistant-service'
import {
    createChatSession,
    saveChatMessage,
    getSessionMessages,
    getRecentSessions,
    generateSessionTitle,
    ChatSession,
    ChatMessageRecord
} from '@/lib/chat-history-service'

// ==================== Types ====================
interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    suggestions?: string[]
    actionItems?: ActionItem[]
}

interface QuickAction {
    id: string
    labelTh: string
    labelEn: string
    icon: React.ElementType
    prompt: string
}

// ==================== Quick Actions ====================
const QUICK_ACTIONS: QuickAction[] = [
    {
        id: 'improve-sales',
        labelTh: '💰 เพิ่มยอดขาย',
        labelEn: '💰 Boost Sales',
        icon: TrendingUp,
        prompt: 'แนะนำวิธีเพิ่มยอดขายให้ร้านของฉัน'
    },
    {
        id: 'product-tips',
        labelTh: '📦 เคล็ดลับสินค้า',
        labelEn: '📦 Product Tips',
        icon: Package,
        prompt: 'แนะนำวิธีตั้งราคาและเขียนคำอธิบายสินค้าให้น่าซื้อ'
    },
    {
        id: 'marketing',
        labelTh: '📣 การตลาด',
        labelEn: '📣 Marketing',
        icon: Tag,
        prompt: 'แนะนำกลยุทธ์การตลาดสำหรับร้านค้าออนไลน์'
    },
    {
        id: 'analytics',
        labelTh: '📊 วิเคราะห์ข้อมูล',
        labelEn: '📊 Analytics',
        icon: BarChart3,
        prompt: 'ช่วยอธิบายวิธีดูและใช้ข้อมูลวิเคราะห์ร้านค้า'
    }
]

// ==================== Alert Icon Helper ====================
function getAlertIcon(type: string) {
    switch (type) {
        case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-500" />
        case 'warning': return <AlertTriangle className="w-4 h-4 text-amber-500" />
        case 'success': return <CheckCircle className="w-4 h-4 text-emerald-500" />
        case 'info': default: return <Info className="w-4 h-4 text-blue-500" />
    }
}

function getAlertBgColor(type: string) {
    switch (type) {
        case 'urgent': return 'bg-red-50 dark:bg-red-900/20 border-red-200'
        case 'warning': return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200'
        case 'success': return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200'
        case 'info': default: return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200'
    }
}

// ==================== Main Component ====================
export default function AIAssistantWidget() {
    const { user } = useAuth()
    const { language } = useLanguage()

    // UI State
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(false)
    const [activeTab, setActiveTab] = useState<'chat' | 'alerts' | 'history'>('chat')

    // Chat State
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [showQuickActions, setShowQuickActions] = useState(true)

    // Session State
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null)
    const [recentSessions, setRecentSessions] = useState<ChatSession[]>([])

    // Context State
    const [sellerContext, setSellerContext] = useState<SellerContext | null>(null)
    const [proactiveAlerts, setProactiveAlerts] = useState<ProactiveAlert[]>([])
    const [isLoadingContext, setIsLoadingContext] = useState(false)

    const messagesEndRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Scroll to bottom on new message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Focus input when opened
    useEffect(() => {
        if (isOpen && !isMinimized && activeTab === 'chat') {
            inputRef.current?.focus()
        }
    }, [isOpen, isMinimized, activeTab])

    // Fetch seller context and initialize session
    const initializeAssistant = useCallback(async () => {
        if (!user?.uid || isLoadingContext) return

        setIsLoadingContext(true)

        try {
            // Fetch seller context
            const context = await fetchSellerContext(user.uid)
            if (context) {
                setSellerContext(context)
            }

            // Fetch recent sessions
            const sessions = await getRecentSessions(user.uid)
            setRecentSessions(sessions)

            // Create new session or use most recent
            if (sessions.length > 0 && !currentSessionId) {
                // Check if the most recent session is from today
                const mostRecent = sessions[0]
                const today = new Date()
                const sessionDate = new Date(mostRecent.updatedAt)

                if (sessionDate.toDateString() === today.toDateString()) {
                    setCurrentSessionId(mostRecent.id)
                    // Load messages from this session
                    const sessionMessages = await getSessionMessages(mostRecent.id)
                    setMessages(sessionMessages.map(m => ({
                        id: m.id,
                        role: m.role,
                        content: m.content,
                        timestamp: m.timestamp
                    })))
                    setShowQuickActions(sessionMessages.length === 0)
                } else {
                    // Create new session for today
                    const newSessionId = await createChatSession(user.uid)
                    setCurrentSessionId(newSessionId)
                }
            } else if (!currentSessionId) {
                const newSessionId = await createChatSession(user.uid)
                setCurrentSessionId(newSessionId)
            }

        } catch (error) {
            console.error('Error initializing assistant:', error)
        } finally {
            setIsLoadingContext(false)
        }
    }, [user?.uid, currentSessionId, isLoadingContext])

    // Initialize when opened
    useEffect(() => {
        if (isOpen && user?.uid && !sellerContext) {
            initializeAssistant()
        }
    }, [isOpen, user?.uid, sellerContext, initializeAssistant])

    // Welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0 && sellerContext && !isLoadingContext) {
            const welcomeMessage: Message = {
                id: 'welcome',
                role: 'assistant',
                content: language === 'th'
                    ? `👋 สวัสดีครับ${user?.displayName ? ` คุณ${user.displayName}` : ''}! ผม **JaiKod AI** ผู้ช่วยอัจฉริยะ

📊 สถานะร้าน **${sellerContext.shopName}**:
• สินค้า: ${sellerContext.totalProducts} รายการ
• คำสั่งซื้อรอดำเนินการ: ${sellerContext.pendingOrders}
${sellerContext.pendingOrders > 0 ? '\n⚡ อย่าลืมจัดส่งสินค้านะครับ!' : ''}

ถามอะไรได้เลยครับ! 🚀`
                    : `👋 Hello${user?.displayName ? ` ${user.displayName}` : ''}! I'm **JaiKod AI**, your smart assistant.

📊 **${sellerContext.shopName}** Status:
• Products: ${sellerContext.totalProducts}
• Pending Orders: ${sellerContext.pendingOrders}
${sellerContext.pendingOrders > 0 ? '\n⚡ Don\'t forget to ship your orders!' : ''}

Ask me anything! 🚀`,
                timestamp: new Date()
            }
            setMessages([welcomeMessage])
        }
    }, [isOpen, messages.length, sellerContext, language, user?.displayName, isLoadingContext])

    // Send message
    const handleSend = async () => {
        if (!inputValue.trim() || isTyping || !user?.uid) return

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: inputValue.trim(),
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setShowQuickActions(false)
        setIsTyping(true)

        // Save user message to history
        if (currentSessionId) {
            try {
                await saveChatMessage(currentSessionId, user.uid, 'user', userMessage.content)

                // Update session title on first message
                if (messages.length <= 1) {
                    const title = generateSessionTitle(userMessage.content)
                    // We could update the title here
                }
            } catch (error) {
                console.error('Error saving message:', error)
            }
        }

        // Generate AI response
        try {
            const conversationHistory = messages.map(m => ({
                role: m.role as 'user' | 'assistant',
                content: m.content
            }))

            // Use default context if real context not available
            const contextToUse = sellerContext || {
                sellerId: user.uid,
                shopName: user.displayName || 'My Shop',
                totalProducts: 0,
                totalOrders: 0,
                totalRevenue: 0,
                averageRating: 0,
                pendingOrders: 0,
                lowStockItems: 0,
                unreadMessages: 0,
                lastLoginDate: new Date(),
                shopCategory: 'General',
                monthlyViews: 0,
                conversionRate: 0
            }

            const response = await generateAIAssistantResponse(
                userMessage.content,
                contextToUse,
                conversationHistory,
                language
            )

            const aiMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response.message,
                timestamp: new Date(),
                actionItems: response.actionItems
            }

            setMessages(prev => [...prev, aiMessage])

            // Update proactive alerts
            if (response.proactiveAlerts) {
                setProactiveAlerts(response.proactiveAlerts)
            }

            // Save AI response to history
            if (currentSessionId) {
                try {
                    await saveChatMessage(currentSessionId, user.uid, 'assistant', response.message)
                } catch (error) {
                    console.error('Error saving AI message:', error)
                }
            }

        } catch (error) {
            console.error('Error generating response:', error)

            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: language === 'th'
                    ? '😅 ขออภัยครับ เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง'
                    : '😅 Sorry, something went wrong. Please try again.',
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMessage])
        }

        setIsTyping(false)
    }

    // Handle quick action
    const handleQuickAction = (action: QuickAction) => {
        setInputValue(action.prompt)
        setTimeout(() => {
            handleSend()
        }, 100)
    }

    // Handle key press
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    // Start new conversation
    const handleNewConversation = async () => {
        if (!user?.uid) return

        const newSessionId = await createChatSession(user.uid)
        setCurrentSessionId(newSessionId)
        setMessages([])
        setShowQuickActions(true)
        setActiveTab('chat')
    }

    // Load a previous session
    const handleLoadSession = async (session: ChatSession) => {
        setCurrentSessionId(session.id)
        const sessionMessages = await getSessionMessages(session.id)
        setMessages(sessionMessages.map(m => ({
            id: m.id,
            role: m.role,
            content: m.content,
            timestamp: m.timestamp
        })))
        setShowQuickActions(sessionMessages.length === 0)
        setActiveTab('chat')
    }

    // Refresh context
    const handleRefreshContext = async () => {
        if (!user?.uid) return
        setIsLoadingContext(true)
        try {
            const context = await fetchSellerContext(user.uid)
            if (context) setSellerContext(context)
        } catch (error) {
            console.error('Error refreshing context:', error)
        } finally {
            setIsLoadingContext(false)
        }
    }

    // Calculate unread alerts count
    const unreadAlertsCount = proactiveAlerts.filter(a => a.type === 'urgent' || a.type === 'warning').length

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center hover:scale-110 transition-all ${isOpen ? 'hidden' : ''}`}
            >
                <Bot className="w-7 h-7" />
                {unreadAlertsCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {unreadAlertsCount}
                    </span>
                )}
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full animate-pulse" />
            </button>

            {/* Chat Widget */}
            {isOpen && (
                <div className={`fixed bottom-6 right-6 z-50 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl shadow-indigo-500/20 border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ${isMinimized ? 'w-72 h-14' : 'w-[400px] h-[550px]'}`}>
                    {/* Header */}
                    <div
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-3 flex items-center justify-between cursor-pointer"
                        onClick={() => setIsMinimized(!isMinimized)}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                <Bot className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">JaiKod AI</h3>
                                <p className="text-xs text-white/80">
                                    {isLoadingContext ? (
                                        <span className="flex items-center gap-1">
                                            <Loader2 className="w-3 h-3 animate-spin" />
                                            {language === 'th' ? 'กำลังโหลด...' : 'Loading...'}
                                        </span>
                                    ) : (
                                        language === 'th' ? 'ผู้ช่วยอัจฉริยะ' : 'Smart Assistant'
                                    )}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <button
                                onClick={(e) => { e.stopPropagation(); handleRefreshContext() }}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                                title={language === 'th' ? 'รีเฟรชข้อมูล' : 'Refresh data'}
                            >
                                <RefreshCw className={`w-4 h-4 ${isLoadingContext ? 'animate-spin' : ''}`} />
                            </button>
                            <button
                                onClick={(e) => { e.stopPropagation(); setIsOpen(false) }}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {!isMinimized && (
                        <>
                            {/* Tab Navigation */}
                            <div className="flex border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
                                <button
                                    onClick={() => setActiveTab('chat')}
                                    className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1 ${activeTab === 'chat'
                                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                                            : 'text-gray-500'
                                        }`}
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    {language === 'th' ? 'แชท' : 'Chat'}
                                </button>
                                <button
                                    onClick={() => setActiveTab('alerts')}
                                    className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1 relative ${activeTab === 'alerts'
                                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                                            : 'text-gray-500'
                                        }`}
                                >
                                    <Bell className="w-4 h-4" />
                                    {language === 'th' ? 'แจ้งเตือน' : 'Alerts'}
                                    {unreadAlertsCount > 0 && (
                                        <span className="absolute top-1 right-4 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                            {unreadAlertsCount}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setActiveTab('history')}
                                    className={`flex-1 py-2 text-sm font-medium flex items-center justify-center gap-1 ${activeTab === 'history'
                                            ? 'text-indigo-600 border-b-2 border-indigo-600'
                                            : 'text-gray-500'
                                        }`}
                                >
                                    <History className="w-4 h-4" />
                                    {language === 'th' ? 'ประวัติ' : 'History'}
                                </button>
                            </div>

                            {/* Tab Content */}
                            {activeTab === 'chat' && (
                                <>
                                    {/* Messages */}
                                    <div className="h-[340px] overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
                                        {messages.map((msg) => (
                                            <div
                                                key={msg.id}
                                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[85%] rounded-2xl px-4 py-2 ${msg.role === 'user'
                                                            ? 'bg-indigo-600 text-white rounded-br-md'
                                                            : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md shadow-sm'
                                                        }`}
                                                >
                                                    <div className="text-sm whitespace-pre-wrap">
                                                        {msg.content.split('**').map((part, i) =>
                                                            i % 2 === 1 ? <strong key={i}>{part}</strong> : part
                                                        )}
                                                    </div>

                                                    {/* Action Items */}
                                                    {msg.actionItems && msg.actionItems.length > 0 && (
                                                        <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600 space-y-1">
                                                            {msg.actionItems.map(item => (
                                                                <Link
                                                                    key={item.id}
                                                                    href={item.link || '#'}
                                                                    className="flex items-center gap-2 text-xs text-indigo-600 dark:text-indigo-400 hover:underline"
                                                                >
                                                                    <ExternalLink className="w-3 h-3" />
                                                                    {language === 'th' ? item.titleTh : item.title}
                                                                </Link>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Typing indicator */}
                                        {isTyping && (
                                            <div className="flex justify-start">
                                                <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                                                    <div className="flex gap-1">
                                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Quick Actions */}
                                    {showQuickActions && messages.length <= 1 && (
                                        <div className="px-4 py-2 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
                                            <p className="text-xs text-gray-500 mb-2">
                                                {language === 'th' ? '✨ ลองถามเรื่องนี้:' : '✨ Try asking about:'}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {QUICK_ACTIONS.slice(0, 3).map(action => (
                                                    <button
                                                        key={action.id}
                                                        onClick={() => handleQuickAction(action)}
                                                        className="px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 text-gray-700 dark:text-gray-300 hover:text-indigo-600 rounded-full transition-colors"
                                                    >
                                                        {language === 'th' ? action.labelTh : action.labelEn}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Input */}
                                    <div className="p-3 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex gap-2">
                                            <input
                                                ref={inputRef}
                                                type="text"
                                                value={inputValue}
                                                onChange={(e) => setInputValue(e.target.value)}
                                                onKeyPress={handleKeyPress}
                                                placeholder={language === 'th' ? 'พิมพ์ข้อความ...' : 'Type a message...'}
                                                className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                                disabled={isTyping}
                                            />
                                            <button
                                                onClick={handleSend}
                                                disabled={!inputValue.trim() || isTyping}
                                                className="w-10 h-10 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
                                            >
                                                <Send className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            {activeTab === 'alerts' && (
                                <div className="h-[420px] overflow-y-auto p-4 space-y-3 bg-gray-50 dark:bg-gray-800/50">
                                    {proactiveAlerts.length === 0 ? (
                                        <div className="text-center text-gray-500 py-8">
                                            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-emerald-400" />
                                            <p className="font-medium">
                                                {language === 'th' ? 'ไม่มีการแจ้งเตือน' : 'No alerts'}
                                            </p>
                                            <p className="text-sm">
                                                {language === 'th' ? 'ทุกอย่างเรียบร้อยดี!' : 'Everything looks good!'}
                                            </p>
                                        </div>
                                    ) : (
                                        proactiveAlerts.map(alert => (
                                            <div
                                                key={alert.id}
                                                className={`p-3 rounded-xl border ${getAlertBgColor(alert.type)} flex items-start gap-3`}
                                            >
                                                {getAlertIcon(alert.type)}
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {language === 'th' ? alert.messageTh : alert.message}
                                                    </p>
                                                    {alert.actionLink && (
                                                        <Link
                                                            href={alert.actionLink}
                                                            className="text-xs text-indigo-600 hover:underline flex items-center gap-1 mt-1"
                                                        >
                                                            <ExternalLink className="w-3 h-3" />
                                                            {language === 'th' ? 'ดำเนินการ' : 'Take action'}
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}

                            {activeTab === 'history' && (
                                <div className="h-[420px] overflow-y-auto bg-gray-50 dark:bg-gray-800/50">
                                    {/* New Conversation Button */}
                                    <div className="p-3 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
                                        <button
                                            onClick={handleNewConversation}
                                            className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                                        >
                                            <Plus className="w-4 h-4" />
                                            {language === 'th' ? 'เริ่มบทสนทนาใหม่' : 'New Conversation'}
                                        </button>
                                    </div>

                                    {/* Sessions List */}
                                    <div className="p-3 space-y-2">
                                        {recentSessions.length === 0 ? (
                                            <div className="text-center text-gray-500 py-8">
                                                <History className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                                                <p className="text-sm">
                                                    {language === 'th' ? 'ยังไม่มีประวัติ' : 'No history yet'}
                                                </p>
                                            </div>
                                        ) : (
                                            recentSessions.map(session => (
                                                <button
                                                    key={session.id}
                                                    onClick={() => handleLoadSession(session)}
                                                    className={`w-full text-left p-3 rounded-xl transition-colors ${currentSessionId === session.id
                                                            ? 'bg-indigo-100 dark:bg-indigo-900/30 border border-indigo-200'
                                                            : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                        }`}
                                                >
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                        {session.title || 'Conversation'}
                                                    </p>
                                                    <p className="text-xs text-gray-500 truncate mt-1">
                                                        {session.lastMessage || (language === 'th' ? 'ไม่มีข้อความ' : 'No messages')}
                                                    </p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {new Date(session.updatedAt).toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US')}
                                                    </p>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            )}
        </>
    )
}

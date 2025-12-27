'use client'

import { useState, useEffect, useRef } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { useAuth } from '@/contexts/AuthContext'
import {
    MessageCircle, X, Send, Sparkles, Camera, Search,
    HelpCircle, ChevronRight, Bot, User, Loader2
} from 'lucide-react'
import Link from 'next/link'

interface Message {
    id: string
    type: 'bot' | 'user'
    text: string
    timestamp: Date
}

interface QuickAction {
    icon: React.ReactNode
    label: string
    labelEn: string
    action: () => void
}

export default function AIAssistantWidget() {
    const { t, language } = useLanguage()
    const { user } = useAuth()
    const [isOpen, setIsOpen] = useState(false)
    const [isMinimized, setIsMinimized] = useState(true)
    const [messages, setMessages] = useState<Message[]>([])
    const [inputValue, setInputValue] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [showBubble, setShowBubble] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Show greeting bubble after a delay
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) {
                setShowBubble(true)
            }
        }, 5000)
        return () => clearTimeout(timer)
    }, [])

    // Hide bubble when chat opens
    useEffect(() => {
        if (isOpen) {
            setShowBubble(false)
        }
    }, [isOpen])

    // Scroll to bottom when new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Add initial greeting when opened for first time
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const greeting = language === 'th'
                ? user?.displayName
                    ? `สวัสดีครับ ${user.displayName.split(' ')[0]}! 👋 ยินดีต้อนรับสู่ JaiKod ผมคือ AI ผู้ช่วย มีอะไรให้ช่วยไหมครับ?`
                    : 'สวัสดีครับ! 👋 ผมคือ AI ผู้ช่วยของ JaiKod มีอะไรให้ช่วยไหมครับ?'
                : user?.displayName
                    ? `Hi ${user.displayName.split(' ')[0]}! 👋 Welcome to JaiKod. I'm your AI assistant. How can I help?`
                    : "Hi there! 👋 I'm your JaiKod AI assistant. How can I help you today?"

            setMessages([{
                id: '1',
                type: 'bot',
                text: greeting,
                timestamp: new Date()
            }])
        }
    }, [isOpen, language, user])

    const quickActions: QuickAction[] = [
        {
            icon: <Camera className="w-4 h-4" />,
            label: 'ลงขายสินค้า',
            labelEn: 'Sell an item',
            action: () => window.location.href = '/sell'
        },
        {
            icon: <Search className="w-4 h-4" />,
            label: 'ค้นหาสินค้า',
            labelEn: 'Search products',
            action: () => window.location.href = '/search'
        },
        {
            icon: <HelpCircle className="w-4 h-4" />,
            label: 'วิธีใช้งาน',
            labelEn: 'How it works',
            action: () => handleQuickQuestion(language === 'th' ? 'วิธีใช้งาน JaiKod' : 'How does JaiKod work?')
        },
    ]

    const handleQuickQuestion = (question: string) => {
        setInputValue(question)
        handleSend(question)
    }

    const handleSend = (text?: string) => {
        const messageText = text || inputValue.trim()
        if (!messageText) return

        // Add user message
        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            text: messageText,
            timestamp: new Date()
        }
        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsTyping(true)

        // Simulate AI response
        setTimeout(() => {
            const botResponse = generateResponse(messageText)
            setMessages(prev => [...prev, {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                text: botResponse,
                timestamp: new Date()
            }])
            setIsTyping(false)
        }, 1000 + Math.random() * 1000)
    }

    const generateResponse = (question: string): string => {
        const lowerQ = question.toLowerCase()

        // Thai responses
        if (language === 'th') {
            if (lowerQ.includes('วิธี') || lowerQ.includes('ใช้งาน') || lowerQ.includes('how')) {
                return '📸 ง่ายมากครับ! แค่ 3 ขั้นตอน:\n\n1️⃣ ถ่ายรูปสินค้า - AI จะช่วยวิเคราะห์และเติมข้อมูลให้\n2️⃣ ตรวจสอบราคา - AI แนะนำราคาที่เหมาะสม\n3️⃣ ลงขายเลย - เสร็จภายใน 30 วินาที!\n\nลองดูไหมครับ? 👇'
            }
            if (lowerQ.includes('ขาย') || lowerQ.includes('sell')) {
                return '🛍️ อยากขายของใช่ไหมครับ? ง่ายมาก!\n\n1. กด "ลงขายสินค้า" หรือไปที่ /sell\n2. ถ่ายรูปสินค้า\n3. AI จะช่วยเติมข้อมูลทั้งหมดให้\n\nลองเลยครับ! 📸'
            }
            if (lowerQ.includes('ราคา') || lowerQ.includes('price') || lowerQ.includes('ค่าธรรมเนียม')) {
                return '💰 เราเก็บค่าธรรมเนียมแบบยุติธรรมครับ:\n\n• ลงขาย: ฟรี! 🎉\n• ขายได้: 3-5% ของราคาขาย\n• Boost สินค้า: เริ่มต้น ฿29\n\nมีอะไรสงสัยเพิ่มเติมไหมครับ?'
            }
            if (lowerQ.includes('ติดต่อ') || lowerQ.includes('contact') || lowerQ.includes('help')) {
                return '📧 ติดต่อเราได้ที่:\n\n• อีเมล: hello@jaikod.com\n• โทร: 02-000-1234\n• Line: @jaikod\n\nหรือจะคุยกับผมต่อก็ได้นะครับ! 😊'
            }
            return 'ขอบคุณสำหรับคำถามครับ! 🤔 ผมยังเรียนรู้อยู่ แต่สามารถช่วยเรื่องพื้นฐานได้\n\nลองถามเกี่ยวกับ:\n• วิธีลงขายสินค้า\n• ค่าธรรมเนียม\n• การติดต่อทีมงาน'
        } else {
            // English responses
            if (lowerQ.includes('how') || lowerQ.includes('work') || lowerQ.includes('use')) {
                return "📸 It's super easy! Just 3 steps:\n\n1️⃣ Snap a photo - AI analyzes and fills details\n2️⃣ Check price - AI suggests the right price\n3️⃣ Publish - Done in 30 seconds!\n\nWant to try? 👇"
            }
            if (lowerQ.includes('sell') || lowerQ.includes('list')) {
                return '🛍️ Want to sell something? Easy!\n\n1. Click "Sell an item" or go to /sell\n2. Take a photo\n3. AI fills in all the details\n\nGive it a try! 📸'
            }
            if (lowerQ.includes('price') || lowerQ.includes('fee') || lowerQ.includes('cost')) {
                return '💰 Our fees are fair:\n\n• Listing: Free! 🎉\n• When sold: 3-5% of sale price\n• Boost items: Starting at ฿29\n\nAny other questions?'
            }
            if (lowerQ.includes('contact') || lowerQ.includes('help') || lowerQ.includes('support')) {
                return '📧 Contact us at:\n\n• Email: hello@jaikod.com\n• Phone: 02-000-1234\n• Line: @jaikod\n\nOr keep chatting with me! 😊'
            }
            return "Thanks for your question! 🤔 I'm still learning, but I can help with basics.\n\nTry asking about:\n• How to sell items\n• Fees and pricing\n• How to contact the team"
        }
    }

    const bubbleText = language === 'th'
        ? 'สวัสดีครับ! มีอะไรให้ช่วยไหม?'
        : 'Hi! Need any help?'

    return (
        <>
            {/* Greeting Bubble */}
            {showBubble && !isOpen && (
                <div
                    className="fixed bottom-24 right-6 z-50 animate-bounce-in cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    <div className="relative bg-white dark:bg-gray-800 rounded-2xl rounded-br-sm shadow-xl p-4 max-w-[200px] border border-gray-100 dark:border-gray-700">
                        <button
                            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                            onClick={(e) => {
                                e.stopPropagation()
                                setShowBubble(false)
                            }}
                        >
                            <X className="w-3 h-3" />
                        </button>
                        <div className="flex items-start gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <p className="text-sm text-gray-700 dark:text-gray-300">{bubbleText}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Chat Widget */}
            {isOpen && (
                <div className="fixed bottom-24 right-6 z-50 w-[350px] max-w-[calc(100vw-48px)] animate-scale-in">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[500px] max-h-[calc(100vh-150px)]">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="font-semibold text-white">JaiKod AI</div>
                                    <div className="text-xs text-white/70 flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                        {language === 'th' ? 'ออนไลน์' : 'Online'}
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800/50">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex gap-2 ${msg.type === 'user' ? 'flex-row-reverse' : ''}`}
                                >
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.type === 'bot'
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600'
                                            : 'bg-gray-300 dark:bg-gray-600'
                                        }`}>
                                        {msg.type === 'bot'
                                            ? <Bot className="w-4 h-4 text-white" />
                                            : <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                                        }
                                    </div>
                                    <div className={`max-w-[80%] rounded-2xl p-3 ${msg.type === 'bot'
                                            ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-tl-sm'
                                            : 'bg-purple-600 text-white rounded-tr-sm'
                                        }`}>
                                        <p className="text-sm whitespace-pre-line">{msg.text}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Typing indicator */}
                            {isTyping && (
                                <div className="flex gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                                        <Bot className="w-4 h-4 text-white" />
                                    </div>
                                    <div className="bg-white dark:bg-gray-700 rounded-2xl rounded-tl-sm p-3">
                                        <div className="flex gap-1">
                                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                            <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Quick Actions */}
                        <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
                            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                                {quickActions.map((action, i) => (
                                    <button
                                        key={i}
                                        onClick={action.action}
                                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm text-gray-700 dark:text-gray-300 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 transition-colors whitespace-nowrap"
                                    >
                                        {action.icon}
                                        {language === 'th' ? action.label : action.labelEn}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder={language === 'th' ? 'พิมพ์ข้อความ...' : 'Type a message...'}
                                    className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 dark:text-white"
                                />
                                <button
                                    onClick={() => handleSend()}
                                    disabled={!inputValue.trim()}
                                    className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${isOpen
                        ? 'bg-gray-800 hover:bg-gray-700 rotate-0'
                        : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-xl hover:scale-110'
                    }`}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" />
                ) : (
                    <MessageCircle className="w-6 h-6 text-white" />
                )}

                {/* Notification dot */}
                {!isOpen && showBubble && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
                )}
            </button>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes bounce-in {
                    0% { transform: scale(0); opacity: 0; }
                    50% { transform: scale(1.1); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-bounce-in {
                    animation: bounce-in 0.5s ease-out;
                }
                @keyframes scale-in {
                    0% { transform: scale(0.95); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out;
                }
            `}</style>
        </>
    )
}

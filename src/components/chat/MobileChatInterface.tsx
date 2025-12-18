'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    ChevronLeft, MoreVertical, Phone, Image as ImageIcon,
    MapPin, Mic, Send, Sparkles, Plus, X, AlertTriangle,
    Check, CheckCheck, ShoppingBag, CreditCard, Trash2
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SmartMeetupModal from './SmartMeetupModal'

/**
 * MobileChatInterface
 * Mobile-first, responsive chat UI specialized for touch interactions.
 */
export default function MobileChatInterface() {
    const [inputText, setInputText] = useState('')
    const [messages, setMessages] = useState<any[]>([])
    const [showAIPanel, setShowAIPanel] = useState(false)
    const [showAttachMenu, setShowAttachMenu] = useState(false)
    const [showMeetupModal, setShowMeetupModal] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)

    // Mock Data
    const SELLER = {
        name: 'Seller Pro Shop',
        avatar: 'https://ui-avatars.com/api/?name=Seller+Pro&background=8B5CF6&color=fff',
        isOnline: true,
        trustScore: 98
    }

    const PRODUCT = {
        id: '101',
        title: 'Sony A7III Body Only',
        price: 42500,
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=100&h=100&fit=crop'
    }

    // Initialize Mock Messages
    useEffect(() => {
        setMessages([
            { id: 'm1', text: 'สวัสดีครับ สินค้าชิ้นนี้ยังอยู่ไหม?', sender: 'me', time: '10:30', status: 'read', type: 'text' },
            { id: 'm2', text: 'ยังอยู่ครับ สอบถามได้เลย', sender: 'other', time: '10:32', type: 'text' },
            { id: 'm3', text: 'ลดได้เต็มที่เท่าไหร่ครับ?', sender: 'me', time: '10:33', status: 'read', type: 'text' },
            { id: 'm4', text: 'ลดได้นิดหน่อยครับ 42,000 ไหวไหมครับ', sender: 'other', time: '10:35', type: 'text' },
            {
                id: 'm5',
                type: 'payment_request',
                sender: 'other',
                time: '10:36',
                data: {
                    title: 'ใบสั่งซื้อ #INV-2024-001',
                    items: [{ name: 'Sony A7III Body Only', price: 42000 }],
                    discount: 500,
                    total: 42000,
                    status: 'pending'
                }
            }
        ])
    }, [])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, showAIPanel])

    const handleSend = () => {
        if (!inputText.trim()) return
        const newMsg = {
            id: `new_${Date.now()}`,
            text: inputText,
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
            type: 'text'
        }
        setMessages(prev => [...prev, newMsg])
        setInputText('')

        // Simpulate delivered/read
        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m))
        }, 1000)
        setTimeout(() => {
            setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m))
        }, 2500)
    }

    const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const newMsg = {
                id: `img_${Date.now()}`,
                text: '',
                sender: 'me',
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'sent',
                type: 'image',
                mediaUrl: URL.createObjectURL(file)
            }
            setMessages(prev => [...prev, newMsg])

            // Simulate read receipt
            setTimeout(() => {
                setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m))
            }, 2000)
        }
    }

    const handleCreateOrder = () => {
        const newMsg = {
            id: `ord_${Date.now()}`,
            type: 'payment_request',
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
            data: {
                title: 'ใบเสนอราคา #OFFER-2024-001',
                items: [{ name: PRODUCT.title, price: 42000 }],
                discount: 0,
                total: 42000,
                status: 'pending'
            }
        }
        setMessages(prev => [...prev, newMsg])
    }

    const handleDeleteMessage = (msgId: string) => {
        if (confirm('ลบข้อความ?')) {
            setMessages(prev => prev.filter(m => m.id !== msgId))
        }
    }

    const quickReplies = ['สนใจครับ', 'ขอดูรูปเพิ่ม', 'นัดรับได้ไหม', 'ลดได้อีกไหม']

    return (
        <div className="fixed inset-0 bg-gray-50 dark:bg-black overflow-hidden flex flex-col font-sans">
            {/* 1. Header (Fixed Top) */}
            <header className="h-14 bg-white dark:bg-[#111] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-3 z-50 shrink-0">
                <div className="flex items-center gap-3">
                    <button className="p-1 -ml-1 text-gray-600 dark:text-gray-300">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="relative">
                        <Image src={SELLER.avatar} alt="" width={36} height={36} className="rounded-full border border-gray-100 dark:border-gray-700" />
                        {SELLER.isOnline && (
                            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-[#111] rounded-full"></div>
                        )}
                    </div>
                    <div className="leading-tight">
                        <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-1">
                            {SELLER.name}
                            <span className="text-[10px] bg-blue-100 text-blue-600 px-1 rounded dark:bg-blue-900/30 dark:text-blue-400">Pro</span>
                        </div>
                        <div className="text-[10px] text-green-600 dark:text-green-500 font-medium">Online</div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-gray-500 dark:text-gray-400">
                        <Phone className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-gray-500 dark:text-gray-400">
                        <MoreVertical className="w-5 h-5" />
                    </button>
                </div>
            </header>

            {/* 2. Messages (Scrollable) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f2f4f7] dark:bg-[#050505]">
                <div className="flex justify-center my-4">
                    <span className="text-[10px] bg-gray-200 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded-full">Today</span>
                </div>

                {messages.map((msg) => {
                    const isMe = msg.sender === 'me'
                    return (
                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} group items-end mb-4`}>
                            {isMe && (
                                <button
                                    className="mr-2 p-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => handleDeleteMessage(msg.id)}
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            )}
                            {!isMe && (
                                <Image src={SELLER.avatar} alt="" width={28} height={28} className="rounded-full self-end mb-1 mr-2" />
                            )}
                            <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm relative group ${isMe
                                ? 'bg-violet-600 text-white rounded-br-none'
                                : 'bg-white dark:bg-[#1a1a1a] text-gray-800 dark:text-gray-200 rounded-bl-none'
                                }`}>
                                {msg.type === 'text' && msg.text}
                                {msg.type === 'payment_request' && (
                                    <div className="min-w-[240px]">
                                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-100 dark:border-gray-700">
                                            <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-600 flex items-center justify-center">
                                                <CreditCard className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 dark:text-white text-xs">คำขอชำระเงิน</div>
                                                <div className="text-[10px] text-gray-500">{msg.data.title}</div>
                                            </div>
                                        </div>
                                        {msg.data.items.map((item: any, i: number) => (
                                            <div key={i} className="flex justify-between text-xs mb-1 text-gray-600 dark:text-gray-300">
                                                <span className="truncate max-w-[150px]">{item.name}</span>
                                                <span>฿{item.price.toLocaleString()}</span>
                                            </div>
                                        ))}
                                        <div className="flex justify-between font-bold text-gray-900 dark:text-white mt-3 pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
                                            <span>ยอดรวมสุทธิ</span>
                                            <span className="text-violet-600">฿{msg.data.total.toLocaleString()}</span>
                                        </div>
                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            <button className="w-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 py-2 rounded-xl font-bold text-xs">
                                                รายละเอียด
                                            </button>
                                            <button className="w-full bg-violet-600 text-white py-2 rounded-xl font-bold text-xs shadow-md active:scale-95 transition-transform">
                                                ชำระเงิน
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <div className={`text-[10px] mt-1 text-right flex items-center justify-end gap-1 ${isMe ? 'text-violet-200' : 'text-gray-400'}`}>
                                    {msg.time}
                                    {isMe && (
                                        msg.status === 'read' ? <CheckCheck className="w-3 h-3 text-sky-300" /> :
                                            msg.status === 'delivered' ? <CheckCheck className="w-3 h-3 text-white/50" /> :
                                                <Check className="w-3 h-3 text-white/50" />
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
                <div ref={messagesEndRef} />
            </div>

            {/* 3. Footer Composer (Sticky) */}
            <div className="bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 w-full shrink-0 safe-pb-4">

                {/* Product Context Strip (Mini) */}
                <div className="bg-violet-50 dark:bg-violet-900/10 px-3 py-2 flex items-center justify-between border-b border-violet-100 dark:border-violet-900/20">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 relative rounded-md overflow-hidden bg-gray-200">
                            <Image src={PRODUCT.image} alt="" fill className="object-cover" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[150px]">{PRODUCT.title}</div>
                            <div className="text-xs text-violet-600 font-bold">฿{PRODUCT.price.toLocaleString()}</div>
                        </div>
                    </div>
                    <Link href={`/product/${PRODUCT.id}`} className="text-xs bg-white dark:bg-gray-800 text-gray-900 dark:text-white border px-3 py-1 rounded-full font-medium shadow-sm">
                        ดูสินค้า
                    </Link>
                    {/* Floating Action Button for Create Order could be here or overlay */}
                </div>

                {/* AI & Quick Replies Row */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar px-3 py-2 bg-gray-50 dark:bg-[#151515]">
                    <button
                        onClick={() => setShowAIPanel(!showAIPanel)}
                        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${showAIPanel
                            ? 'bg-violet-600 text-white border-violet-600 shadow-md transform scale-105'
                            : 'bg-white dark:bg-gray-800 text-violet-600 border-violet-100 dark:border-gray-700'
                            }`}
                    >
                        <Sparkles className="w-3 h-3" /> AI Assist
                    </button>
                    <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                    {quickReplies.map((reply, i) => (
                        <button
                            key={i}
                            onClick={() => setInputText(reply)}
                            className="shrink-0 px-3 py-1.5 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs rounded-full border border-gray-200 dark:border-gray-700 active:bg-gray-100"
                        >
                            {reply}
                        </button>
                    ))}
                </div>

                {/* Main Input Row */}
                <div className="px-3 pb-3 pt-2 flex items-end gap-2">
                    <button
                        onClick={() => setShowAttachMenu(!showAttachMenu)}
                        className="p-2.5 text-gray-400 hover:text-violet-600 bg-gray-100 dark:bg-gray-800 rounded-full mb-0.5"
                    >
                        <Plus className={`w-5 h-5 transition-transform ${showAttachMenu ? 'rotate-45' : ''}`} />
                    </button>

                    <div className="flex-1 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center px-4 py-2 border border-transparent focus-within:border-violet-300 focus-within:bg-white dark:focus-within:bg-black transition-all">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder="พิมพ์ข้อความ..."
                            className="flex-1 bg-transparent border-none outline-none text-sm max-h-24 resize-none py-1.5 text-gray-900 dark:text-white"
                            rows={1}
                        />
                        <button className="p-1 text-gray-400 hover:text-gray-600 ml-1">
                            <Mic className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={!inputText.trim()}
                        className={`p-3 rounded-full mb-0.5 transition-all shadow-md ${inputText.trim()
                            ? 'bg-violet-600 text-white hover:bg-violet-700 hover:scale-105 active:scale-95'
                            : 'bg-gray-300 dark:bg-gray-800 text-gray-500'
                            }`}
                    >
                        <Send className="w-5 h-5 ml-0.5" />
                    </button>
                </div>

                {/* Attach Menu (Animate Height) */}
                <AnimatePresence>
                    {showAttachMenu && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden border-t border-gray-100 dark:border-gray-800"
                        >
                            <div className="grid grid-cols-4 gap-4 p-4 pb-8">
                                {[
                                    { icon: ImageIcon, label: 'รูปภาพ', color: 'bg-green-100 text-green-600', action: () => imageInputRef.current?.click() },
                                    { icon: MapPin, label: 'ตำแหน่ง', color: 'bg-orange-100 text-orange-600', action: () => setShowMeetupModal(true) },
                                    { icon: CreditCard, label: 'สร้างออเดอร์', color: 'bg-violet-100 text-violet-600', action: handleCreateOrder },
                                    { icon: AlertTriangle, label: 'แจ้งปัญหา', color: 'bg-red-100 text-red-600', action: () => { } },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        onClick={() => {
                                            item.action()
                                            setShowAttachMenu(false)
                                        }}
                                        className="flex flex-col items-center gap-2 cursor-pointer active:opacity-70 group"
                                    >
                                        <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">{item.label}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* AI Panel Overlay (Mock) */}
                <AnimatePresence>
                    {showAIPanel && (
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            className="absolute bottom-0 left-0 right-0 bg-white dark:bg-[#1a1a1a] rounded-t-2xl shadow-2xl border-t border-gray-200 dark:border-gray-800 z-10"
                        >
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        <Sparkles className="w-4 h-4 text-violet-500" />
                                        AI Assistant
                                    </h3>
                                    <button onClick={() => setShowAIPanel(false)} className="p-1 bg-gray-100 dark:bg-gray-800 rounded-full">
                                        <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {[
                                        { text: 'ช่วยสรุปบทสนทนา', icon: '📝' },
                                        { text: 'เสนอโปรโมชั่นพิเศษ', icon: '🏷️' },
                                        { text: 'ตรวจสอบความปลอดภัย', icon: '🛡️' }
                                    ].map((action, i) => (
                                        <button key={i} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-violet-50 dark:hover:bg-violet-900/20 text-left border border-gray-100 dark:border-gray-800">
                                            <span className="text-lg">{action.icon}</span>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{action.text}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

            </div>

            {/* Smart Meetup Modal */}
            <SmartMeetupModal
                isOpen={showMeetupModal}
                onClose={() => setShowMeetupModal(false)}
            />

            {/* Hidden File Input */}
            <input
                type="file"
                ref={imageInputRef}
                className="hidden"
                onChange={onFileSelect}
                accept="image/*"
            />
        </div>
    )
}

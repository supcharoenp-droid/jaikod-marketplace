'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Plus, Trash2, Edit2, Check, MessageSquare, Sparkles, CreditCard, MapPin, Tag } from 'lucide-react'

interface CannedReply {
    id: string
    title: string
    text: string
    category: 'greeting' | 'payment' | 'shipping' | 'location' | 'price' | 'custom'
    emoji?: string
}

interface CannedRepliesModalProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (text: string) => void
    role: 'buyer' | 'seller'
}

// ข้อความสำเร็จรูป Default
const DEFAULT_CANNED_REPLIES: CannedReply[] = [
    // Payment
    {
        id: 'payment-1',
        title: 'เลขบัญชีธนาคาร',
        text: 'ธนาคารกสิกรไทย 123-4-56789-0\nชื่อบัญชี: [ชื่อ-นามสกุล]\n\nพร้อมเพย์: 0XX-XXX-XXXX\n\nโปรดแจ้งหลังโอนด้วยนะครับ 🙏',
        category: 'payment',
        emoji: '💳'
    },
    {
        id: 'payment-2',
        title: 'ขอสลิปโอนเงิน',
        text: 'รบกวนส่งสลิปโอนเงินมาด้วยนะครับ เพื่อตรวจสอบยอดเงินครับ 🙏',
        category: 'payment',
        emoji: '🧾'
    },
    {
        id: 'payment-3',
        title: 'ยืนยันรับเงินแล้ว',
        text: 'ได้รับเงินเรียบร้อยแล้วครับ ขอบคุณมากครับ 🙏\n\nจะจัดส่งสินค้าให้ภายในวันนี้ครับ',
        category: 'payment',
        emoji: '✅'
    },

    // Shipping
    {
        id: 'shipping-1',
        title: 'ขอที่อยู่จัดส่ง',
        text: 'รบกวนขอข้อมูลจัดส่งด้วยครับ:\n\n📦 ชื่อ-นามสกุล:\n📍 ที่อยู่:\n📞 เบอร์โทร:\n\nจะรีบจัดส่งให้เร็วที่สุดครับ 🚚',
        category: 'shipping',
        emoji: '📦'
    },
    {
        id: 'shipping-2',
        title: 'แจ้งเลข Tracking',
        text: 'จัดส่งเรียบร้อยแล้วครับ 🚚\n\nเลข Tracking: [เลข Tracking]\nขนส่ง: [ชื่อขนส่ง]\n\nประมาณ 1-3 วันถึงครับ',
        category: 'shipping',
        emoji: '📬'
    },

    // Location/Meetup
    {
        id: 'location-1',
        title: 'นัดรับสินค้า',
        text: 'สะดวกนัดรับได้ครับ สถานที่แนะนำ:\n\n📍 ห้างสรรพสินค้า: [ชื่อห้าง]\n🕐 วัน/เวลา: [วัน เวลา]\n\nหรือบอกพิกัดที่สะดวกได้เลยครับ 🗺️',
        category: 'location',
        emoji: '📍'
    },
    {
        id: 'location-2',
        title: 'แจ้งพิกัด GPS',
        text: '📍 พิกัดนัดรับ:\n[ส่งลิงก์ Google Maps]\n\nเจอกันตรงจุดนัดพบนะครับ โปรดใส่หน้ากากและเตรียมเงินสดให้พอดีครับ 🙏',
        category: 'location',
        emoji: '🗺️'
    },

    // Price
    {
        id: 'price-1',
        title: 'ราคาสุดท้าย',
        text: 'ราคานี้เป็นราคาสุดท้ายแล้วครับ ลดไม่ได้อีกแล้วครับ 🙏\n\nแต่รับประกันสภาพ 100% เลยครับ',
        category: 'price',
        emoji: '💰'
    },
    {
        id: 'price-2',
        title: 'ลดราคาได้',
        text: 'ถ้าซื้อเลยวันนี้ ลดให้ได้อีก ฿XXX ครับ\nเหลือราคาสุดท้าย ฿XXX ครับ\n\nสนใจตอบกลับมาได้เลยครับ 😊',
        category: 'price',
        emoji: '🏷️'
    },

    // Greeting
    {
        id: 'greeting-1',
        title: 'ทักทาย',
        text: 'สวัสดีครับ ยินดีให้บริการครับ 😊\n\nสอบถามข้อมูลเพิ่มเติมได้เลยครับ',
        category: 'greeting',
        emoji: '👋'
    },
    {
        id: 'greeting-2',
        title: 'ขอบคุณ',
        text: 'ขอบคุณมากครับที่อุดหนุน 🙏\n\nหากได้รับสินค้าแล้ว รบกวนรีวิวให้ด้วยนะครับ ⭐⭐⭐⭐⭐',
        category: 'greeting',
        emoji: '🙏'
    },
    {
        id: 'greeting-3',
        title: 'ไม่ว่าง/ติดธุระ',
        text: 'ขออภัยครับ ตอนนี้ไม่สะดวกคุยครับ\n\nจะตอบกลับให้เร็วที่สุดครับ 🙏',
        category: 'greeting',
        emoji: '⏰'
    }
]

const CATEGORY_ICONS = {
    greeting: MessageSquare,
    payment: CreditCard,
    shipping: Tag,
    location: MapPin,
    price: Tag,
    custom: Sparkles
}

const CATEGORY_LABELS = {
    greeting: 'ทักทาย',
    payment: 'การชำระเงิน',
    shipping: 'การจัดส่ง',
    location: 'นัดรับสินค้า',
    price: 'ราคา/ต่อรอง',
    custom: 'กำหนดเอง'
}

export default function CannedRepliesModal({
    isOpen,
    onClose,
    onSelect,
    role
}: CannedRepliesModalProps) {
    const [replies, setReplies] = useState<CannedReply[]>(DEFAULT_CANNED_REPLIES)
    const [selectedCategory, setSelectedCategory] = useState<CannedReply['category'] | 'all'>('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [editingId, setEditingId] = useState<string | null>(null)
    const [editText, setEditText] = useState('')

    // Load from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('jaikod_canned_replies')
        if (saved) {
            try {
                setReplies([...DEFAULT_CANNED_REPLIES, ...JSON.parse(saved)])
            } catch (e) {
                console.error('Failed to load canned replies')
            }
        }
    }, [])

    // Filter replies
    const filteredReplies = replies.filter(r => {
        if (selectedCategory !== 'all' && r.category !== selectedCategory) return false
        if (searchTerm && !r.title.toLowerCase().includes(searchTerm.toLowerCase()) && !r.text.toLowerCase().includes(searchTerm.toLowerCase())) return false
        return true
    })

    const handleSelect = (reply: CannedReply) => {
        onSelect(reply.text)
        onClose()
    }

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
    }

    const categories = ['all', 'greeting', 'payment', 'shipping', 'location', 'price', 'custom'] as const

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[85vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col mx-4"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-800">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600">
                                <MessageSquare className="w-5 h-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 dark:text-white">ข้อความสำเร็จรูป</h2>
                                <p className="text-xs text-gray-500">เลือกข้อความที่ต้องการส่ง</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
                        >
                            <X className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                        <input
                            type="text"
                            placeholder="ค้นหาข้อความ..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2.5 bg-gray-100 dark:bg-gray-800 rounded-xl text-sm outline-none focus:ring-2 ring-purple-500/20 transition text-gray-900 dark:text-white"
                        />
                    </div>

                    {/* Category Tabs */}
                    <div className="flex gap-2 p-4 overflow-x-auto no-scrollbar border-b border-gray-100 dark:border-gray-800">
                        {categories.map(cat => {
                            const Icon = cat === 'all' ? MessageSquare : CATEGORY_ICONS[cat]
                            return (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                                            ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                                            : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                    {cat === 'all' ? 'ทั้งหมด' : CATEGORY_LABELS[cat]}
                                </button>
                            )
                        })}
                    </div>

                    {/* Replies List */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {filteredReplies.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>ไม่พบข้อความที่ค้นหา</p>
                            </div>
                        ) : (
                            filteredReplies.map(reply => {
                                const Icon = CATEGORY_ICONS[reply.category]
                                return (
                                    <motion.div
                                        key={reply.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-600/50 transition-all group"
                                    >
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg">{reply.emoji || '💬'}</span>
                                                <h3 className="font-bold text-gray-900 dark:text-white text-sm">{reply.title}</h3>
                                                <span className="text-[10px] px-1.5 py-0.5 bg-gray-200 dark:bg-gray-700 rounded-full text-gray-500 dark:text-gray-400">
                                                    {CATEGORY_LABELS[reply.category]}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => handleCopy(reply.text)}
                                                className="p-1.5 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition text-gray-500"
                                                title="คัดลอก"
                                            >
                                                <Copy className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-line leading-relaxed mb-3 max-h-24 overflow-hidden">
                                            {reply.text}
                                        </p>
                                        <button
                                            onClick={() => handleSelect(reply)}
                                            className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 active:scale-95"
                                        >
                                            <Check className="w-3.5 h-3.5" />
                                            ใช้ข้อความนี้
                                        </button>
                                    </motion.div>
                                )
                            })
                        )}
                    </div>

                    {/* Footer Tips */}
                    <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Sparkles className="w-4 h-4 text-purple-500" />
                            <span>AI แนะนำ: ใช้ข้อความสำเร็จรูปช่วยตอบเร็วขึ้น และเพิ่มโอกาสปิดการขาย 30%</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    )
}

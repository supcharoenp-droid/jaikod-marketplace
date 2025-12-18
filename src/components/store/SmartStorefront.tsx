'use client'

import React, { useState } from 'react'
import {
    MapPin,
    Star,
    MessageCircle,
    Share2,
    ShieldCheck,
    Sparkles,
    Clock,
    ShoppingBag
} from 'lucide-react'

// Mock Data for Public Smart Storefront
const STORE_DATA = {
    name: 'Vintage Watch Hunter',
    slug: 'vintage-hunter',
    trust_score: 95,
    badges: ['Elite Seller', 'Authentic Guaranty'],
    is_open_location: true,
    location: 'Siam Square, Bangkok',
    products: [
        { id: 1, title: 'Rolex Submariner Date', price: 385000, image: 'https://images.unsplash.com/photo-1623998021446-45cd96e318b2?auto=format&fit=crop&q=80&w=500' },
        { id: 2, title: 'Omega Speedmaster Moonwatch', price: 185000, image: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?auto=format&fit=crop&q=80&w=500' },
        { id: 3, title: 'Patek Philippe Nautilus', price: 1250000, image: 'https://images.unsplash.com/photo-1639016187313-25a8db8c558c?auto=format&fit=crop&q=80&w=500' },
        { id: 4, title: 'Seiko 5 Sports', price: 8500, image: 'https://images.unsplash.com/photo-1612817288484-96916a0816a9?auto=format&fit=crop&q=80&w=500' }
    ],
    ai_story: 'Vintage Watch Hunter คือผู้เชี่ยวชาญด้านนาฬิกาหรูมือสองที่ได้รับการคัดสรรมาอย่างดีเยี่ยม ด้วยประสบการณ์กว่า 5 ปี และความใส่ใจในทุกรายละเอียด ทำให้ร้านนี้ได้รับคะแนน Trust Score สูงถึง 95/100 สินค้าทุกชิ้นรับประกันแท้ 100% พร้อมบริการหลังการขายระดับพรีเมียม',
    stats: {
        sold: 142,
        rating: 4.9,
        response_time: '5 mins'
    }
}

export default function SmartStorefront() {
    const [activeTab, setActiveTab] = useState('shop')

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Dynamic Hero Banner */}
            <div className="relative h-64 md:h-80 bg-gray-900 overflow-hidden group">
                {/* Collage Background Effect */}
                <div className="absolute inset-0 grid grid-cols-4 opacity-50 blur-sm transform scale-105 group-hover:scale-110 transition-transform duration-1000">
                    {STORE_DATA.products.map(p => (
                        <img key={p.id} src={p.image} className="w-full h-full object-cover" />
                    ))}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

                <div className="absolute bottom-0 left-0 w-full p-6 text-white">
                    <div className="container mx-auto max-w-5xl flex items-end justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-20 h-20 rounded-full border-4 border-white bg-gray-800 overflow-hidden shadow-xl">
                                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <h1 className="text-2xl font-bold text-white shadow-sm">{STORE_DATA.name}</h1>
                                    <ShieldCheck className="w-5 h-5 text-blue-400" />
                                </div>
                                <div className="flex items-center gap-3 text-sm text-gray-200">
                                    <div className="flex items-center gap-1 bg-white/20 px-2 py-0.5 rounded-lg backdrop-blur-md">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold">{STORE_DATA.stats.rating}</span>
                                        <span className="text-gray-300">({STORE_DATA.stats.sold} ขายแล้ว)</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-3 h-3" /> {STORE_DATA.location}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <button className="bg-white text-gray-900 px-6 py-2 rounded-full font-bold hover:bg-gray-100 transition shadow-lg">
                                ติดตามร้านค้า
                            </button>
                            <button className="bg-white/20 backdrop-blur-md text-white px-3 py-2 rounded-full hover:bg-white/30 transition">
                                <MessageCircle className="w-5 h-5" />
                            </button>
                            <button className="bg-white/20 backdrop-blur-md text-white px-3 py-2 rounded-full hover:bg-white/30 transition">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Generated Story Section */}
            <div className="bg-white border-b border-gray-100">
                <div className="container mx-auto max-w-5xl p-6">
                    <div className="flex items-start gap-3 bg-purple-50 p-4 rounded-2xl border border-purple-100">
                        <Sparkles className="w-6 h-6 text-purple-600 shrink-0 mt-1" />
                        <div>
                            <p className="text-sm font-bold text-purple-800 mb-1">AI Smart Story</p>
                            <p className="text-gray-700 leading-relaxed text-sm">
                                {STORE_DATA.ai_story}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Highlights / Portfolio */}
            <div className="container mx-auto max-w-5xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">สินค้าแนะนำ</h2>
                    <div className="flex gap-2">
                        {STORE_DATA.badges.map(b => (
                            <span key={b} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-md border border-gray-200">
                                {b}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {STORE_DATA.products.map(product => (
                        <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all group cursor-pointer">
                            <div className="relative aspect-square bg-gray-100 overflow-hidden">
                                <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-1 rounded-full">
                                    สินค้าขายดี
                                </div>
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm font-medium text-gray-900 truncate mb-1">{product.title}</h3>
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-bold text-purple-600">฿{product.price.toLocaleString()}</span>
                                    <button className="text-gray-400 hover:text-gray-900">
                                        <ShoppingBag className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Sticky Action Footer for Mobile */}
            <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 p-4 md:hidden z-50">
                <div className="flex gap-4">
                    <button className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-lg font-bold">แชทเลย</button>
                    <button className="flex-1 bg-purple-600 text-white py-3 rounded-lg font-bold shadow-lg shadow-purple-200">ซื้อสินค้า</button>
                </div>
            </div>
        </div>
    )
}

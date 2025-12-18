'use client'

import React from 'react'
import ProductCard from '@/components/product/ProductCard'
import { Hammer, Users, Zap } from 'lucide-react'

// --- MOCK DATA FOR LAB ---
// จำลองสินค้าประมูล 4 สถานะ
const MOCK_AUCTIONS: any[] = [
    {
        id: 'mock-1',
        title: '🔴 [LIVE] iPhone 15 Pro Max (Titanium) - Bidding War!',
        price: 32500, // Current Bid
        original_price: 45900,
        price_type: 'auction',
        images: ['https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=800'],
        stock: 1,
        location_province: 'Bangkok',
        seller: { shop_name: 'iStudio Resell', verification_status: 'verified' },
        favorites_count: 128,
        views_count: 3450,
        tags: ['Mobile'],
        // Auction Specifics
        auction_state: {
            total_bids: 45,
            status: 'active'
        },
        ai_image_score: 95
    },
    {
        id: 'mock-2',
        title: '🏁 [ENDED] Rolex Submariner Date - SOLD',
        price: 450000,
        price_type: 'auction',
        images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800'],
        stock: 0,
        status: 'sold',
        location_province: 'Phuket',
        seller: { shop_name: 'Luxury Watch', verification_status: 'official' },
        favorites_count: 890,
        auction_state: {
            status: 'ended',
            winner_id: 'user_123'
        },
        ai_image_score: 99
    },
    {
        id: 'mock-3',
        title: '🔥 [HOT] PS5 Spider-Man Edition - 5 mins left',
        price: 15200,
        price_type: 'auction',
        images: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=800'],
        stock: 1,
        location_province: 'Chiang Mai',
        seller: { shop_name: 'Gamer Zone' },
        favorites_count: 56,
        is_trending: true,
        ai_image_score: 88,
        auction_state: {
            status: 'active',
            total_bids: 12
        }
    },
    {
        id: 'mock-4',
        title: '⏳ [Upcoming] Rare Pokemon Card Charizard',
        price: 5000, // Start Price
        price_type: 'auction',
        images: ['https://images.unsplash.com/photo-1613771404784-3a5686aa2be3?auto=format&fit=crop&q=80&w=800'],
        stock: 1,
        location_province: 'Bangkok',
        seller: { shop_name: 'Collector Hub' },
        favorites_count: 230,
        auction_state: {
            status: 'scheduled'
        },
        ai_image_score: 92
    }
]

export default function AuctionLabPage() {
    return (
        <div className="min-h-screen bg-black text-white p-8">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-12 border-b border-gray-800 pb-8">
                <div className="flex items-center gap-4 mb-4">
                    <div className="p-4 bg-purple-600 rounded-2xl shadow-[0_0_30px_rgba(147,51,234,0.5)]">
                        <Hammer className="w-10 h-10 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
                            AUCTION LAB 🧪
                        </h1>
                        <p className="text-gray-400 mt-1">
                            Sandbox Zone for Testing Auction UI & Real-time Systems
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-6 text-center">
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                        <div className="text-2xl font-bold text-green-400">12ms</div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Latency</div>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                        <div className="text-2xl font-bold text-blue-400 flex items-center justify-center gap-2">
                            <Users className="w-5 h-5" /> 842
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Active Bidders</div>
                    </div>
                    <div className="bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                        <div className="text-2xl font-bold text-yellow-400 flex items-center justify-center gap-2">
                            <Zap className="w-5 h-5" /> AI Guard
                        </div>
                        <div className="text-xs text-gray-500 uppercase tracking-widest">Fraud Protection</div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="max-w-7xl mx-auto">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <span className="w-2 h-8 bg-purple-500 rounded-full inline-block"></span>
                    Live Preview (Mock Data)
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {MOCK_AUCTIONS.map((product) => (
                        <div key={product.id} className="h-[420px]">
                            {/* Reuse ProductCard but in Dark Mode Context */}
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>

                <div className="mt-12 p-6 bg-gray-900 rounded-2xl border border-gray-800">
                    <h3 className="font-bold text-gray-300 mb-4">Debug Console</h3>
                    <div className="font-mono text-xs text-green-500 space-y-1">
                        <p>{'>'} System initialized...</p>
                        <p>{'>'} Auction Engine v1.0 loaded.</p>
                        <p>{'>'} Connecting to WebSocket... [Simulated]</p>
                        <p className="text-yellow-500">{'>'} [WARN] Anti-snipe trigger logic ready (30s window).</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

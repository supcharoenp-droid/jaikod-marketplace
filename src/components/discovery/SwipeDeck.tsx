'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import SwipeCard from './SwipeCard'
import { getDiscoveryDeck, processSwipeAction, MatchCard } from '@/services/aiMatchingService'
import { Loader2, RefreshCw, X, Heart, Bookmark } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function SwipeDeck() {
    const { user } = useAuth()
    const [cards, setCards] = useState<MatchCard[]>([])
    const [loading, setLoading] = useState(true)

    // Load initial deck
    useEffect(() => {
        const load = async () => {
            if (!user) return
            try {
                const deck = await getDiscoveryDeck(user.uid)
                setCards(deck)
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [user])

    const handleSwipe = async (direction: 'left' | 'right' | 'up') => {
        if (cards.length === 0) return

        const currentCard = cards[0]

        // Remove card from UI immediately
        setCards(prev => prev.slice(1))

        // Process Logic in Background
        const action = direction === 'right' ? 'like' : direction === 'up' ? 'superlike' : 'pass'
        await processSwipeAction(currentCard, action)

        // If running low, fetch more
        if (cards.length < 5 && user) {
            const more = await getDiscoveryDeck(user.uid, 5)
            // Dedupe logic usually needed here
            setCards(prev => [...prev, ...more])
        }
    }

    // Manual Button Controls
    const manualSwipe = (dir: 'left' | 'right' | 'up') => {
        // Trigger swipe programmatically on the top card
        // For simplicity in this demo, strict programmatic swipe matches the drag logic visually 
        // by just calling the logic handler, though visual transition might be instant without ref logic
        handleSwipe(dir)
    }

    if (loading) return (
        <div className="flex h-[600px] items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-neon-purple" />
        </div>
    )

    if (cards.length === 0) return (
        <div className="flex flex-col items-center justify-center h-[600px] text-center space-y-4">
            <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                <RefreshCw className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold">ไม่มีสินค้าใหม่ในขณะนี้</h3>
            <p className="text-gray-500">เรากำลังค้นหาสินค้าที่เหมาะกับคุณเพิ่มเติม...</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-neon-purple text-white rounded-full">
                ลองรีเฟรช
            </button>
        </div>
    )

    return (
        <div className="relative w-full max-w-sm mx-auto h-[650px]">
            {/* The Stack */}
            <div className="relative w-full h-[600px]">
                <AnimatePresence>
                    {cards.map((card, index) => {
                        // Only render top 2 cards for performance
                        if (index > 1) return null;

                        return (
                            <div
                                key={card.id}
                                className="absolute top-0 left-0 w-full h-full"
                                style={{
                                    zIndex: cards.length - index,
                                    scale: index === 0 ? 1 : 0.95,
                                    y: index === 0 ? 0 : 20,
                                    opacity: index === 0 ? 1 : 0.5
                                }}
                            >
                                <SwipeCard
                                    product={card}
                                    onSwipe={handleSwipe}
                                    isFront={index === 0}
                                />
                            </div>
                        )
                    })}
                </AnimatePresence>
            </div>

            {/* Control Buttons (Bottom) */}
            <div className="absolute -bottom-4 left-0 right-0 flex justify-center gap-6 items-center z-50">
                <button
                    onClick={() => manualSwipe('left')}
                    className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-xl text-red-500 flex items-center justify-center hover:scale-110 transition-transform border border-red-100"
                >
                    <X className="w-6 h-6" />
                </button>

                <button
                    onClick={() => manualSwipe('up')}
                    className="w-12 h-12 bg-white dark:bg-gray-800 rounded-full shadow-xl text-blue-500 flex items-center justify-center hover:scale-110 transition-transform border border-blue-100"
                >
                    <Bookmark className="w-5 h-5" />
                </button>

                <button
                    onClick={() => manualSwipe('right')}
                    className="w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-xl text-green-500 flex items-center justify-center hover:scale-110 transition-transform border border-green-100"
                >
                    <Heart className="w-6 h-6 fill-current" />
                </button>
            </div>

            {/* Keyboard Hint */}
            <div className="mt-8 text-center text-xs text-gray-400 hidden lg:block">
                ใช้ลูกศร ซ้าย/ขวา บนคีย์บอร์ดได้
            </div>
        </div>
    )
}

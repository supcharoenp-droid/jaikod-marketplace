'use client'

import React, { useState, useEffect } from 'react'
import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from 'framer-motion'
import { MapPin, Star, Sparkles, Check, X, Bookmark } from 'lucide-react'
import { MatchCard } from '@/services/aiMatchingService'

interface SwipeCardProps {
    product: MatchCard
    onSwipe: (direction: 'left' | 'right' | 'up') => void
    isFront: boolean
}

export default function SwipeCard({ product, onSwipe, isFront }: SwipeCardProps) {
    const controls = useAnimation()
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    // Rotation based on X movement
    const rotate = useTransform(x, [-200, 200], [-15, 15])

    // Opacity overlays
    const likeOpacity = useTransform(x, [50, 150], [0, 1])
    const nopeOpacity = useTransform(x, [-150, -50], [1, 0])
    const superLikeOpacity = useTransform(y, [-150, -50], [1, 0])

    const handleDragEnd = async (_: any, info: PanInfo) => {
        const offset = info.offset
        const velocity = info.velocity

        if (offset.x > 100 || velocity.x > 500) {
            await controls.start({ x: 500, opacity: 0 })
            onSwipe('right')
        } else if (offset.x < -100 || velocity.x < -500) {
            await controls.start({ x: -500, opacity: 0 })
            onSwipe('left')
        } else if (offset.y < -100 || velocity.y < -500) {
            await controls.start({ y: -500, opacity: 0 })
            onSwipe('up')
        } else {
            controls.start({ x: 0, y: 0 })
        }
    }

    if (!isFront) return null

    return (
        <motion.div
            className="absolute top-0 left-0 w-full h-[600px] w-full max-w-sm bg-white dark:bg-card-dark rounded-3xl shadow-2xl overflow-hidden cursor-grab active:cursor-grabbing border border-gray-200 dark:border-gray-800"
            style={{ x, y, rotate }}
            drag={true}
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            onDragEnd={handleDragEnd}
            animate={controls}
            initial={{ scale: 0.95, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
        >
            {/* Image */}
            <div className="relative h-3/4 w-full bg-gray-200">
                <img
                    src={product.images?.[0] || 'https://via.placeholder.com/400x600'}
                    alt={product.title}
                    className="w-full h-full object-cover pointer-events-none"
                />

                {/* Overlays */}
                <motion.div style={{ opacity: likeOpacity }} className="absolute top-8 left-8 border-4 border-green-500 rounded-lg px-4 py-2 rotate-[-15deg]">
                    <span className="text-4xl font-bold text-green-500 uppercase">LIKE</span>
                </motion.div>
                <motion.div style={{ opacity: nopeOpacity }} className="absolute top-8 right-8 border-4 border-red-500 rounded-lg px-4 py-2 rotate-[15deg]">
                    <span className="text-4xl font-bold text-red-500 uppercase">NOPE</span>
                </motion.div>
                <motion.div style={{ opacity: superLikeOpacity }} className="absolute bottom-32 left-1/2 -translate-x-1/2 border-4 border-blue-500 rounded-lg px-4 py-2">
                    <span className="text-4xl font-bold text-blue-500 uppercase">SAVE</span>
                </motion.div>

                {/* Match Score Badge */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full flex items-center gap-1">
                    <Sparkles className="w-4 h-4 text-neon-purple fill-neon-purple" />
                    <span className="text-white font-bold text-sm">{product.matchScore}% Match</span>
                </div>
            </div>

            {/* Info */}
            <div className="h-1/4 p-5 flex flex-col justify-between bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                <div>
                    <div className="flex justify-between items-start">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white line-clamp-1">{product.title}</h2>
                        <span className="text-xl font-bold text-neon-purple whitespace-nowrap">฿{product.price.toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mt-1">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{product.location_province || 'กรุงเทพมหานคร'} • {product.distance}</span>
                    </div>

                    {/* AI Reason */}
                    <div className="mt-3 inline-flex items-center gap-1.5 bg-purple-50 dark:bg-purple-900/30 px-3 py-1 rounded-lg">
                        <Sparkles className="w-3 h-3 text-neon-purple" />
                        <span className="text-xs font-medium text-neon-purple">{product.matchReason}</span>
                    </div>
                </div>
            </div>
        </motion.div>
    )
}

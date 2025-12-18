'use client'

import React from 'react'
import Header from '@/components/layout/Header'
import SwipeDeck from '@/components/discovery/SwipeDeck'
import { Sparkles, History, Filter } from 'lucide-react'

export default function DiscoveryPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-bg-dark flex flex-col overflow-hidden">
            <Header />

            <main className="flex-1 flex flex-col relative max-w-md mx-auto w-full pt-6 px-4 pb-12">

                {/* Header Section */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900 dark:text-white">
                            Discovery
                            <span className="bg-neon-purple/10 text-neon-purple text-xs px-2 py-0.5 rounded-full border border-neon-purple/20">AI Beta</span>
                        </h1>
                        <p className="text-sm text-gray-500">ปัดขวาถ้าใช่ ปัดซ้ายถ้าผ่าน</p>
                    </div>

                    <div className="flex gap-2">
                        <button className="p-2 rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50">
                            <History className="w-5 h-5 text-gray-500" />
                        </button>
                        <button className="p-2 rounded-full bg-white dark:bg-card-dark border border-gray-200 dark:border-gray-700 hover:bg-gray-50">
                            <Filter className="w-5 h-5 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* The Deck */}
                <div className="flex-1 flex items-center justify-center">
                    <SwipeDeck />
                </div>

            </main>
        </div>
    )
}

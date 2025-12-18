'use client'

import React from 'react'
import { MapPin, Navigation } from 'lucide-react'

interface ProductMapProps {
    province: string
    amphoe: string
    district?: string
    distance?: number | null
}

export default function ProductMap({ province, amphoe, district, distance }: ProductMapProps) {
    // Mock static map with a nice pattern
    return (
        <div className="rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm bg-white dark:bg-card-dark">
            <div className="relative h-48 bg-gray-100 w-full overflow-hidden group">
                {/* Mock Map Pattern */}
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-20 dark:invert" />
                <div className="absolute inset-0 bg-blue-500/5 mix-blend-overlay" />

                {/* Center Pin (Product) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center animate-bounce duration-1000">
                    <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center animate-ping absolute" />
                    <div className="relative z-10 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg border-2 border-white">
                        <MapPin className="w-4 h-4" />
                    </div>
                    <div className="mt-1 bg-white dark:bg-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-md border dark:border-gray-700">
                        {district || amphoe}
                    </div>
                </div>

                {/* Open in Map Button Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button className="bg-white text-gray-900 px-4 py-2 rounded-full font-bold shadow-lg flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all">
                        <Navigation className="w-4 h-4" /> เขต {province}
                    </button>
                </div>
            </div>

            <div className="p-4 flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        {amphoe}, {province}
                    </h4>
                    <p className="text-xs text-gray-500 mt-1">{district ? `แขวง/ตำบล ${district}` : 'พื้นที่นัดรับสินค้า'}</p>
                </div>
                {distance !== null && distance !== undefined && (
                    <div className="text-right">
                        <span className="block text-2xl font-bold font-display text-blue-600 dark:text-blue-400">
                            {distance < 1 ? '< 1' : distance.toFixed(1)} <span className="text-sm font-normal text-gray-500">km</span>
                        </span>
                        <span className="text-xs text-green-600 font-medium bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full">
                            ห่างจากคุณ
                        </span>
                    </div>
                )}
            </div>
        </div>
    )
}

'use client'

import React, { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { storeService, StoreProfile } from '@/services/storeService'
import { MapPin, Navigation, Search, Star, MessageCircle, ChevronRight, BadgeCheck } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function NearbySellersPage() {
    const [stores, setStores] = useState<StoreProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [userLocation, setUserLocation] = useState<{ lat: number, lng: number } | null>(null)
    const [locationError, setLocationError] = useState<string | null>(null)

    useEffect(() => {
        // Mock getting user location for now
        // In real app, use navigator.geolocation
        // navigator.geolocation.getCurrentPosition(...)

        const loadStores = async () => {
            setLoading(true)
            try {
                // Mock coords (Bangkok)
                const lat = 13.7563
                const lng = 100.5018
                setUserLocation({ lat, lng })

                const data = await storeService.getNearbyStores(lat, lng)
                setStores(data)
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }

        loadStores()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black font-sans flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <MapPin className="w-6 h-6 text-neon-purple" />
                            ร้านค้าใกล้ฉัน
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                            ค้นหาร้านค้าที่อยู่ใกล้เคียงในระยะ 10 กม.
                        </p>
                    </div>

                    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-2 rounded-xl shadow-sm border border-gray-100 dark:border-gray-800 w-full md:w-auto">
                        <MapPin className="w-4 h-4 text-gray-400 ml-2" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                            {locationError ? 'ไม่สามารถระบุตำแหน่ง' : 'กรุงเทพมหานคร, ไทย'}
                        </span>
                        <Button size="sm" variant="ghost" className="text-neon-purple hover:bg-purple-50 dark:hover:bg-purple-900/20">
                            เปลี่ยน
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl p-4 h-64 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {stores.map((store, index) => (
                            <div key={store.id} className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-lg transition-all hover:-translate-y-1">
                                {/* Banner */}
                                <div className="relative h-32 bg-gray-200">
                                    <Image src={store.bannerUrl} alt="" fill className="object-cover" />
                                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-lg flex items-center gap-1">
                                        <Navigation className="w-3 h-3" />
                                        {((index + 1) * 1.2).toFixed(1)} km
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4 relative">
                                    {/* Logo */}
                                    <div className="absolute -top-10 left-4 w-16 h-16 rounded-xl border-4 border-white dark:border-gray-900 overflow-hidden shadow-md bg-white">
                                        <Image src={store.logoUrl} alt="" fill className="object-cover" />
                                    </div>

                                    <div className="ml-20 mb-3">
                                        <div className="flex items-center gap-1">
                                            <h3 className="font-bold text-gray-900 dark:text-white text-lg truncate">{store.name}</h3>
                                            {store.isVerified && <BadgeCheck className="w-4 h-4 text-blue-500 fill-blue-50" />}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                                            <span className="font-bold text-gray-700 dark:text-gray-300">{store.rating}</span>
                                            <span>({store.totalSales} ขายแล้ว)</span>
                                        </div>
                                    </div>

                                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4 h-10">
                                        {store.tagline || store.description}
                                    </p>

                                    <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                                        <div className={`px-2 py-0.5 rounded border ${store.isClosed ? 'bg-gray-100 text-gray-500 border-gray-200' : 'bg-green-50 text-green-600 border-green-200'} font-medium`}>
                                            {store.isClosed ? 'ปิดอยู่' : 'เปิดอยู่'}
                                        </div>
                                        <div>•</div>
                                        <div>{store.location.district}</div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Link href={`/shop/${store.slug}`} className="flex-1">
                                            <Button variant="outline" className="w-full">
                                                ดูร้านค้า
                                            </Button>
                                        </Link>
                                        <Button className="w-10 px-0 bg-neon-purple/10 text-neon-purple hover:bg-neon-purple/20 border-transparent">
                                            <MessageCircle className="w-5 h-5" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && stores.length === 0 && (
                    <div className="text-center py-20">
                        <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <MapPin className="w-10 h-10" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">ไม่พบร้านค้าในบริเวณนี้</h2>
                        <p className="text-gray-500">ลองขยายระยะทางค้นหาหรือเปลี่ยนตำแหน่งที่ตั้ง</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    )
}

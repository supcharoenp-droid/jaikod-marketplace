'use client'

/**
 * OFFLINE PAGE
 * 
 * Shown when user is offline and the requested page is not cached
 */

import Link from 'next/link'
import { WifiOff, RefreshCw, Home, ArrowLeft } from 'lucide-react'

export default function OfflinePage() {
    const handleRefresh = () => {
        window.location.reload()
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-950 to-slate-900 flex items-center justify-center p-4">
            <div className="text-center max-w-md">
                {/* Icon */}
                <div className="w-24 h-24 mx-auto mb-6 relative">
                    <div className="absolute inset-0 bg-slate-800/50 rounded-full" />
                    <div className="relative w-full h-full flex items-center justify-center">
                        <WifiOff className="w-12 h-12 text-gray-500" />
                    </div>
                    {/* Animated rings */}
                    <div className="absolute inset-0 rounded-full border-2 border-gray-700 animate-ping opacity-20" />
                </div>

                {/* Title */}
                <h1 className="text-2xl font-bold text-white mb-3">
                    ไม่มีการเชื่อมต่ออินเทอร์เน็ต
                </h1>
                <p className="text-gray-400 mb-2">
                    No Internet Connection
                </p>

                {/* Description */}
                <p className="text-gray-500 text-sm mb-8">
                    ดูเหมือนว่าคุณออฟไลน์อยู่ กรุณาตรวจสอบการเชื่อมต่อของคุณแล้วลองใหม่อีกครั้ง
                </p>

                {/* Actions */}
                <div className="space-y-3">
                    <button
                        onClick={handleRefresh}
                        className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-medium transition-all flex items-center justify-center gap-2"
                    >
                        <RefreshCw className="w-5 h-5" />
                        ลองใหม่อีกครั้ง
                    </button>

                    <Link
                        href="/"
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-gray-300 font-medium transition-colors flex items-center justify-center gap-2 block"
                    >
                        <Home className="w-5 h-5" />
                        กลับหน้าแรก
                    </Link>
                </div>

                {/* Tips */}
                <div className="mt-10 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <h3 className="text-sm font-medium text-gray-300 mb-2">💡 Tips</h3>
                    <ul className="text-xs text-gray-500 text-left space-y-1">
                        <li>• ตรวจสอบ WiFi หรือ Mobile Data</li>
                        <li>• ลองเปิด-ปิด Airplane Mode</li>
                        <li>• หน้าที่เคยเปิดจะยังใช้งานได้แบบ Offline</li>
                    </ul>
                </div>

                {/* Cached content suggestion */}
                <p className="text-xs text-gray-600 mt-6">
                    บางหน้าที่คุณเคยเปิดอาจยังใช้งานได้ ลองกดปุ่มย้อนกลับ ←
                </p>
            </div>
        </main>
    )
}

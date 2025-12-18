'use client'

import React from 'react'
import Link from 'next/link'
import {
    Ticket, Zap, ShoppingBag, Gift, TrendingUp,
    Settings, Star, Layout, Megaphone
} from 'lucide-react'
import Header from '@/components/layout/Header'

export default function SellerToolsPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-5xl">

                <div className="mb-8">
                    <h1 className="text-2xl font-bold mb-2">Marketing Tools & Privileges</h1>
                    <p className="text-gray-500">เครื่องมือสำหรับร้านค้าทางการ เพื่อเพิ่มยอดขายและบริหารจัดการร้าน</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {/* Promotion Tools */}
                    <ToolCard
                        icon={<Ticket className="w-6 h-6 text-pink-500" />}
                        title="Vouchers"
                        description="สร้างโค้ดส่วนลดให้ลูกค้า เพื่อกระตุ้นยอดขาย"
                        href="/seller/tools/vouchers"
                        badge="Popular"
                    />
                    <ToolCard
                        icon={<Zap className="w-6 h-6 text-yellow-500" />}
                        title="Flash Sale"
                        description="สร้างแคมเปญลดราคาจำกัดเวลา ดึงดูดลูกค้าทันที"
                        href="/seller/tools/flash-sale"
                    />
                    <ToolCard
                        icon={<Gift className="w-6 h-6 text-purple-500" />}
                        title="Bundle Deal"
                        description="ขายเป็นคู่ถูกกว่า เพิ่มยอดซื้อต่อออเดอร์"
                        href="/seller/tools/bundle"
                        isNew
                    />

                    {/* Store Decoration */}
                    <ToolCard
                        icon={<Layout className="w-6 h-6 text-blue-500" />}
                        title="Store Decoration"
                        description="ตกแต่งหน้าร้าน เปลี่ยนธีม และจัดแบนเนอร์"
                        href="/seller/share/decoration"
                    />

                    {/* Exposure */}
                    <ToolCard
                        icon={<Megaphone className="w-6 h-6 text-orange-500" />}
                        title="Shop Ads"
                        description="โปรโมทร้านค้าให้ขึ้นเป็นอันดับแรกในหมวดหมู่"
                        href="/seller/tools/ads"
                    />

                    {/* Exclusive Features */}
                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl p-6 text-white col-span-1 md:col-span-2 lg:col-span-3 flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-0.5 rounded">OFFICIAL ONLY</span>
                                <h3 className="text-xl font-bold">Seller Privileges</h3>
                            </div>
                            <p className="text-indigo-200 text-sm max-w-xl">
                                สิทธิพิเศษสำหรับร้านค้าทางการ: ระบบ Review Protection ป้องกันรีวิวกลั่นแกล้ง,
                                AI ช่วยดันสินค้าในหมวดเดียวกัน, และโควต้าลงสินค้าไม่จำกัด
                            </p>
                        </div>
                        <Link href="/seller/privileges" className="px-6 py-2 bg-white text-indigo-900 rounded-lg font-bold hover:bg-indigo-50 transition">
                            ดูสิทธิประโยชน์
                        </Link>
                    </div>

                </div>

            </main>
        </div>
    )
}

function ToolCard({ icon, title, description, href, badge, isNew }: any) {
    return (
        <Link href={href} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md hover:border-blue-200 transition-all group relative overflow-hidden">
            {badge && (
                <div className="absolute top-3 right-3 bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {badge}
                </div>
            )}
            {isNew && (
                <div className="absolute top-3 right-3 bg-green-100 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                    NEW
                </div>
            )}
            <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-900 w-fit rounded-xl group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">{title}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                {description}
            </p>
        </Link>
    )
}

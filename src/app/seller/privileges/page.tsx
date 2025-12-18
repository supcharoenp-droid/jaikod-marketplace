'use client'

import React from 'react'
import Link from 'next/link'
import Header from '@/components/layout/Header'
import {
    ShieldCheck,
    Rocket,
    Infinity,
    Crown,
    ArrowLeft,
    CheckCircle2,
    Star,
    Zap
} from 'lucide-react'
import Button from '@/components/ui/Button'

export default function SellerPrivilegesPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
                {/* Back Link */}
                <div className="mb-6">
                    <Link href="/seller/tools" className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Tools
                    </Link>
                </div>

                {/* Hero Section */}
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900 text-white mb-10 shadow-xl">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                    <div className="relative z-10 p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="max-w-2xl">
                            <div className="inline-flex items-center gap-2 bg-yellow-400/20 border border-yellow-400/30 rounded-full px-3 py-1 mb-4 backdrop-blur-sm">
                                <Crown className="w-4 h-4 text-yellow-400" />
                                <span className="text-yellow-100 text-xs font-bold uppercase tracking-wider">Official Seller Program</span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
                                Unlock Exclusive <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500">Seller Privileges</span>
                            </h1>
                            <p className="text-indigo-200 text-lg mb-8 max-w-lg">
                                ยกระดับร้านค้าของคุณด้วยสิทธิพิเศษระดับพรีเมียม เพิ่มความน่าเชื่อถือ ขยายฐานลูกค้า และป้องกันความเสี่ยงด้วยเทคโนโลยี AI
                            </p>
                            <Button className="bg-white text-indigo-900 hover:bg-indigo-50 font-bold px-8 py-3 rounded-xl shadow-lg shadow-indigo-900/20 transition-all transform hover:scale-105">
                                Apply for Official Badge
                            </Button>
                        </div>
                        <div className="hidden md:block relative">
                            <div className="w-48 h-48 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full flex items-center justify-center p-1 shadow-2xl animate-pulse-slow">
                                <div className="bg-indigo-950 w-full h-full rounded-full flex items-center justify-center border-4 border-indigo-800">
                                    <ShieldCheck className="w-24 h-24 text-yellow-400" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Privileges Grid */}
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Your Exclusive Benefits</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">

                    <PrivilegeCard
                        icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
                        title="Review Protection"
                        description="ระบบ AI ตรวจสอบและกรองรีวิวที่ไม่เป็นธรรม หรือการกลั่นแกล้งจากคู่แข่ง เพื่อรักษาเครดิตร้านของคุณ"
                        color="bg-green-50 dark:bg-green-900/20"
                        borderColor="border-green-100 dark:border-green-900/50"
                    />

                    <PrivilegeCard
                        icon={<Rocket className="w-8 h-8 text-blue-500" />}
                        title="AI Smart Boost"
                        description="AI จะช่วยดันสินค้าของคุณไปแสดงในหน้า 'สินค้าแนะนำ' ของกลุ่มลูกค้าที่มีแนวโน้มซื้อสูงโดยอัตโนมัติ"
                        color="bg-blue-50 dark:bg-blue-900/20"
                        borderColor="border-blue-100 dark:border-blue-900/50"
                    />

                    <PrivilegeCard
                        icon={<Infinity className="w-8 h-8 text-purple-500" />}
                        title="Unlimited Listings"
                        description="ไม่มีข้อจำกัดในการลงขายสินค้า ลงขายได้จุใจ รองรับการเติบโตของธุรกิจในทุกสเกล"
                        color="bg-purple-50 dark:bg-purple-900/20"
                        borderColor="border-purple-100 dark:border-purple-900/50"
                    />

                    <PrivilegeCard
                        icon={<Crown className="w-8 h-8 text-yellow-500" />}
                        title="Official Badge"
                        description="ตราสัญลักษณ์ร้านค้าทางการ สร้างความมั่นใจให้กับลูกค้า เพิ่มโอกาสในการปิดการขายได้ถึง 3 เท่า"
                        color="bg-yellow-50 dark:bg-yellow-900/20"
                        borderColor="border-yellow-100 dark:border-yellow-900/50"
                    />

                    <PrivilegeCard
                        icon={<Zap className="w-8 h-8 text-orange-500" />}
                        title="Early Access"
                        description="เข้าถึงฟีเจอร์ใหม่ๆ ก่อนใคร ทดลองใช้เครื่องมือการตลาดล่าสุดของ JaiKod ได้ก่อนร้านค้าทั่วไป"
                        color="bg-orange-50 dark:bg-orange-900/20"
                        borderColor="border-orange-100 dark:border-orange-900/50"
                    />

                    <PrivilegeCard
                        icon={<Star className="w-8 h-8 text-pink-500" />}
                        title="Dedicated Support"
                        description="ทีมงานดูแลพิเศษ ตอบกลับรวดเร็ว แก้ไขปัญหาทันท่วงที พร้อมให้คำปรึกษาทางธุรกิจ"
                        color="bg-pink-50 dark:bg-pink-900/20"
                        borderColor="border-pink-100 dark:border-pink-900/50"
                    />

                </div>

                {/* Comparison Table */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">Benefit Comparison</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-100 dark:border-gray-700">
                                    <th className="text-left py-4 px-6 text-gray-500 font-medium">Features</th>
                                    <th className="text-center py-4 px-6 text-gray-500 font-medium w-1/4">General Seller</th>
                                    <th className="text-center py-4 px-6 text-indigo-600 dark:text-indigo-400 font-bold text-lg w-1/4">Official Seller</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                <ComparisonRow feature="Listing Quota" general="50 Items" official="Unlimited" highlight />
                                <ComparisonRow feature="Transaction Fee" general="3%" official="2%" highlight />
                                <ComparisonRow feature="Verified Badge" general="-" official={<CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />} />
                                <ComparisonRow feature="Shop Ads Credit" general="-" official="฿500 / Month" />
                                <ComparisonRow feature="Review Protection" general="-" official={<CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" />} />
                                <ComparisonRow feature="Support" general="Standard" official="Priority 24/7" />
                            </tbody>
                        </table>
                    </div>
                </div>

            </main>
        </div>
    )
}

function PrivilegeCard({ icon, title, description, color, borderColor }: any) {
    return (
        <div className={`p-6 rounded-2xl border ${borderColor} ${color} hover:shadow-md transition-all`}>
            <div className="mb-4 bg-white dark:bg-gray-800 w-14 h-14 rounded-xl flex items-center justify-center shadow-sm">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                {description}
            </p>
        </div>
    )
}

function ComparisonRow({ feature, general, official, highlight }: any) {
    return (
        <tr className="group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
            <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">{feature}</td>
            <td className="py-4 px-6 text-center text-gray-500">{general}</td>
            <td className={`py-4 px-6 text-center font-bold ${highlight ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-900 dark:text-white'}`}>
                {official}
            </td>
        </tr>
    )
}

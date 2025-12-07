'use client'

import { Camera, DollarSign, Shield, Search, Zap } from 'lucide-react'

const features = [
    {
        icon: Camera,
        title: '📸 Snap & Sell',
        description: 'ถ่ายรูปสินค้า AI เติมรายละเอียดให้อัตโนมัติ ลงขายเสร็จภายใน 30 วินาที',
        color: 'from-purple-500 to-pink-500',
    },
    {
        icon: DollarSign,
        title: '💰 AI แนะนำราคา',
        description: 'วิเคราะห์ตลาดแบบ Real-time แนะนำราคาที่เหมาะสม ขายได้เร็วขึ้น',
        color: 'from-orange-500 to-red-500',
    },
    {
        icon: Shield,
        title: '🛡️ ระบบความปลอดภัย',
        description: 'AI ตรวจจับมิจฉาชีพ ยืนยันตัวตน ปกป้องคุณจากการถูกหลอกลวง',
        color: 'from-blue-500 to-cyan-500',
    },
    {
        icon: Search,
        title: '🔍 ค้นหาอัจฉริยะ',
        description: 'ค้นหาด้วยภาษาธรรมดา หรือถ่ายรูป AI จะหาสินค้าที่คุณต้องการให้',
        color: 'from-green-500 to-emerald-500',
    },
    {
        icon: Zap,
        title: '⚡ ซื้อขายรวดเร็ว',
        description: 'ระบบเสนอราคา คำนวณค่าส่งอัตโนมัติ ชำระเงินในแอป ปลอดภัย',
        color: 'from-yellow-500 to-orange-500',
    },
]

export default function Features() {
    return (
        <section className="py-20 bg-white dark:bg-bg-dark">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-neon-purple font-medium mb-4">
                        <span className="text-xl">🤖</span>
                        AI-Powered Features
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                        ทำไมต้อง <span className="text-gradient">JaiKod</span>?
                    </h2>
                    <p className="text-lg text-text-secondary dark:text-gray-400">
                        เราใช้ AI ช่วยแก้ปัญหาที่คุณเจอในการซื้อขายของมือสอง
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon
                        return (
                            <div
                                key={index}
                                className="group relative p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white dark:from-surface-dark dark:to-gray-900 border border-gray-200 dark:border-gray-800 hover:border-neon-purple dark:hover:border-neon-purple transition-all duration-300 card-hover"
                            >
                                {/* Gradient Background on Hover */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>

                                {/* Icon */}
                                <div className={`relative w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <Icon className="w-7 h-7 text-white" />
                                </div>

                                {/* Content */}
                                <div className="relative">
                                    <h3 className="text-xl font-semibold mb-3 text-text-primary dark:text-text-light">
                                        {feature.title}
                                    </h3>
                                    <p className="text-text-secondary dark:text-gray-400 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>

                                {/* Learn More Link */}
                                <div className="relative mt-6">
                                    <a
                                        href="#"
                                        className="inline-flex items-center text-neon-purple hover:text-purple-600 font-medium transition-colors group"
                                    >
                                        เรียนรู้เพิ่มเติม
                                        <svg
                                            className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </a>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* CTA Section */}
                <div className="mt-16 text-center">
                    <div className="inline-flex flex-col sm:flex-row gap-4">
                        <a
                            href="/sell"
                            className="btn-primary inline-flex items-center justify-center"
                        >
                            <Camera className="w-5 h-5 mr-2" />
                            ลองใช้ Snap & Sell ฟรี
                        </a>
                        <a
                            href="/how-it-works"
                            className="btn-outline inline-flex items-center justify-center"
                        >
                            ดูวิธีการใช้งาน
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}

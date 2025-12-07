'use client'

import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-white dark:bg-surface-dark border-t border-gray-200 dark:border-gray-800 mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="text-lg font-display font-semibold mb-4 text-gradient">
                            JaiKod
                        </h3>
                        <p className="text-sm text-text-secondary dark:text-gray-400 mb-4">
                            แพลตฟอร์มซื้อขายสินค้ามือสองและสินค้าใหม่ที่ขับเคลื่อนด้วย AI
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-neon-purple transition-colors">
                                <span className="text-2xl">📘</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-neon-purple transition-colors">
                                <span className="text-2xl">📷</span>
                            </a>
                            <a href="#" className="text-gray-400 hover:text-neon-purple transition-colors">
                                <span className="text-2xl">🐦</span>
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">เกี่ยวกับเรา</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    เกี่ยวกับ JaiKod
                                </Link>
                            </li>
                            <li>
                                <Link href="/how-it-works" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    วิธีการใช้งาน
                                </Link>
                            </li>
                            <li>
                                <Link href="/safety" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    ความปลอดภัย
                                </Link>
                            </li>
                            <li>
                                <Link href="/pricing" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    ค่าธรรมเนียม
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold mb-4">ช่วยเหลือ</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/faq" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    คำถามที่พบบ่อย
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    ติดต่อเรา
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    ข้อกำหนดการใช้งาน
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    นโยบายความเป็นส่วนตัว
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* AI Features */}
                    <div>
                        <h4 className="font-semibold mb-4">ฟีเจอร์ AI</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link href="/ai/snap-and-sell" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    📸 Snap & Sell
                                </Link>
                            </li>
                            <li>
                                <Link href="/ai/price-suggestion" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    💰 AI แนะนำราคา
                                </Link>
                            </li>
                            <li>
                                <Link href="/ai/trust-score" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    🛡️ ระบบความปลอดภัย
                                </Link>
                            </li>
                            <li>
                                <Link href="/ai/search" className="text-text-secondary dark:text-gray-400 hover:text-neon-purple transition-colors">
                                    🔍 ค้นหาอัจฉริยะ
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <p className="text-sm text-text-secondary dark:text-gray-400">
                            © 2024 JaiKod. All rights reserved.
                        </p>
                        <div className="flex items-center space-x-4 text-sm text-text-secondary dark:text-gray-400">
                            <span>Made with ❤️ in Thailand</span>
                            <span>•</span>
                            <span>Powered by AI 🤖</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

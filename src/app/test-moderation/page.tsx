'use client'

import { useState } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import ModerationStatus from '@/components/product/ModerationStatus'
import { ContentModerationService } from '@/lib/content-moderation'
import type { ModerationResult } from '@/types/moderation'
import { Send, Sparkles } from 'lucide-react'

export default function ModerationTestPage() {
    const [productData, setProductData] = useState({
        id: 'test-product-1',
        title: 'iPhone 13 Pro Max 256GB สีน้ำเงิน',
        description: 'iPhone 13 Pro Max สภาพดีมาก ใช้งานมา 6 เดือน ไม่มีรอยขีดข่วน มีกล่องครบ อุปกรณ์ครบ ประกันเหลือ 6 เดือน',
        price: '28900',
        category: 'electronics',
        images: ['image1.jpg', 'image2.jpg', 'image3.jpg']
    })

    const [moderationResult, setModerationResult] = useState<ModerationResult | undefined>()
    const [isChecking, setIsChecking] = useState(false)

    const handleCheck = async () => {
        setIsChecking(true)
        try {
            const result = await ContentModerationService.moderateProduct(productData)
            setModerationResult(result)
        } catch (error) {
            console.error('Moderation failed:', error)
        } finally {
            setIsChecking(false)
        }
    }

    const testCases = [
        {
            name: '✅ สินค้าปกติ (ผ่าน)',
            data: {
                title: 'iPhone 13 Pro Max 256GB สีน้ำเงิน',
                description: 'iPhone 13 Pro Max สภาพดีมาก ใช้งานมา 6 เดือน ไม่มีรอยขีดข่วน มีกล่องครบ อุปกรณ์ครบ ประกันเหลือ 6 เดือน',
                price: '28900',
                category: 'electronics',
                images: ['image1.jpg', 'image2.jpg', 'image3.jpg']
            }
        },
        {
            name: '⚠️ รูปภาพน้อย (Warning)',
            data: {
                title: 'MacBook Air M1 2020',
                description: 'MacBook Air M1 สภาพดี ใช้งานน้อย',
                price: '25000',
                category: 'electronics',
                images: ['image1.jpg']
            }
        },
        {
            name: '⚠️ คำอธิบายสั้น (Warning)',
            data: {
                title: 'iPad Pro 11 นิ้ว',
                description: 'iPad Pro สภาพดี',
                price: '18000',
                category: 'electronics',
                images: ['image1.jpg', 'image2.jpg', 'image3.jpg']
            }
        },
        {
            name: '❌ สินค้าต้องห้าม (ไม่ผ่าน)',
            data: {
                title: 'ปืนลูกโม่ของเล่น',
                description: 'ปืนของเล่นสำหรับเด็ก',
                price: '500',
                category: 'toys',
                images: ['image1.jpg']
            }
        },
        {
            name: '❌ ไม่มีรูปภาพ (ไม่ผ่าน)',
            data: {
                title: 'Samsung Galaxy S23 Ultra',
                description: 'Samsung Galaxy S23 Ultra สภาพดีมาก ใช้งานมา 3 เดือน',
                price: '35000',
                category: 'electronics',
                images: []
            }
        },
        {
            name: '❌ หัวข้อสั้นเกินไป (ไม่ผ่าน)',
            data: {
                title: 'iPhone',
                description: 'iPhone สภาพดี ราคาถูก',
                price: '15000',
                category: 'electronics',
                images: ['image1.jpg']
            }
        }
    ]

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-bg-dark">
            <Header />
            <main className="flex-1 pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-6xl">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-2">
                            <Sparkles className="w-8 h-8 text-purple-600" />
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                ทดสอบระบบตรวจสอบสินค้าด้วย AI
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">
                            ระบบ AI จะตรวจสอบสินค้าอัตโนมัติก่อนเผยแพร่ เพื่อความปลอดภัยและคุณภาพ
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Left: Input Form */}
                        <div className="space-y-6">
                            {/* Test Cases */}
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    ตัวอย่างทดสอบ
                                </h3>
                                <div className="space-y-2">
                                    {testCases.map((testCase, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                setProductData({ ...productData, ...testCase.data })
                                                setModerationResult(undefined)
                                            }}
                                            className="w-full text-left px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-colors text-sm"
                                        >
                                            {testCase.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Product Form */}
                            <div className="bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                                    ข้อมูลสินค้า
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            หัวข้อสินค้า
                                        </label>
                                        <input
                                            type="text"
                                            value={productData.title}
                                            onChange={(e) => setProductData({ ...productData, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                                            placeholder="เช่น iPhone 13 Pro Max 256GB"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            คำอธิบาย
                                        </label>
                                        <textarea
                                            value={productData.description}
                                            onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white resize-none"
                                            placeholder="อธิบายรายละเอียดสินค้า..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            ราคา (บาท)
                                        </label>
                                        <input
                                            type="text"
                                            value={productData.price}
                                            onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                                            placeholder="0"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            หมวดหมู่
                                        </label>
                                        <select
                                            value={productData.category}
                                            onChange={(e) => setProductData({ ...productData, category: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                                        >
                                            <option value="electronics">อิเล็กทรอนิกส์</option>
                                            <option value="fashion">แฟชั่น</option>
                                            <option value="home">บ้านและสวน</option>
                                            <option value="toys">ของเล่น</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            จำนวนรูปภาพ
                                        </label>
                                        <input
                                            type="number"
                                            value={productData.images.length}
                                            onChange={(e) => {
                                                const count = parseInt(e.target.value) || 0
                                                setProductData({
                                                    ...productData,
                                                    images: Array(count).fill('image.jpg')
                                                })
                                            }}
                                            min="0"
                                            max="10"
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 dark:bg-gray-800 dark:text-white"
                                        />
                                    </div>

                                    <button
                                        onClick={handleCheck}
                                        disabled={isChecking}
                                        className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                    >
                                        {isChecking ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                กำลังตรวจสอบ...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                ตรวจสอบด้วย AI
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right: Moderation Result */}
                        <div>
                            {moderationResult ? (
                                <ModerationStatus
                                    productId={productData.id}
                                    moderationResult={moderationResult}
                                    onResubmit={() => setModerationResult(undefined)}
                                />
                            ) : (
                                <div className="bg-white dark:bg-surface-dark rounded-2xl p-12 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
                                    <Sparkles className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-500 dark:text-gray-400">
                                        กรอกข้อมูลสินค้าและคลิก "ตรวจสอบด้วย AI"<br />
                                        เพื่อดูผลการตรวจสอบ
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6">
                        <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-3">
                            💡 ระบบตรวจสอบอัตโนมัติ
                        </h3>
                        <div className="text-sm text-blue-700 dark:text-blue-300 space-y-2">
                            <p>• <strong>ผ่านอัตโนมัติ (85+ คะแนน):</strong> สินค้าจะถูกเผยแพร่ทันที</p>
                            <p>• <strong>รอตรวจสอบ (70-84 คะแนน):</strong> ทีมงานจะตรวจสอบเพิ่มเติม</p>
                            <p>• <strong>ไม่ผ่าน (&lt;70 คะแนน):</strong> ต้องแก้ไขตามข้อเสนอแนะ</p>
                            <p>• <strong>ตรวจสอบ 7 ด้าน:</strong> เนื้อหาต้องห้าม, รูปภาพ, ราคา, คำอธิบาย, หัวข้อ, หมวดหมู่, ข้อมูลติดต่อ</p>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    )
}

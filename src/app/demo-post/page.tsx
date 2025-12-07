'use client';

import { useState, useEffect } from 'react';
import { estimatePrice, type ProductData } from '@/lib/ai-price-estimator';
import { generateProductDescription, type GenerateDescriptionInput } from '@/lib/ai-description-generator';

export default function DemoPostPage() {
    const [priceResult, setPriceResult] = useState<any>(null);
    const [descResult, setDescResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        generateDemoPost();
    }, []);

    const generateDemoPost = async () => {
        setLoading(true);

        // ข้อมูลสินค้าตัวอย่าง: iPhone 13 Pro Max
        const productData: ProductData = {
            categoryId: 'mobiles',
            attributes: {
                brand: 'Apple',
                model: 'iPhone 13 Pro Max',
                storage: '256GB',
                condition: 'มือสอง สภาพดีมาก',
                batteryHealth: 88,
                warranty: 'หมดประกันแล้ว',
                accessories: ['กล่อง', 'สายชาร์จ', 'คู่มือ'],
                color: 'Sierra Blue',
                ram: '6GB'
            },
            originalPrice: 42900,
            purchaseDate: new Date('2022-03-15')
        };

        const descInput: GenerateDescriptionInput = {
            categoryId: 'mobiles',
            attributes: productData.attributes,
            tone: 'friendly'
        };

        try {
            // สร้างราคาและรายละเอียดพร้อมกัน
            const [price, desc] = await Promise.all([
                estimatePrice(productData),
                generateProductDescription(descInput)
            ]);

            setPriceResult(price);
            setDescResult(desc);
        } catch (error) {
            console.error('Error generating demo post:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">🤖 AI กำลังสร้างโพสขายให้คุณ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        📱 ตัวอย่างโพสขาย
                    </h1>
                    <p className="text-gray-600 text-lg">
                        สร้างโดย AI ของ JaiKod ใน 2 วินาที!
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Product Listing Preview */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {/* Product Image Placeholder */}
                            <div className="bg-gradient-to-br from-blue-400 to-purple-500 h-96 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <div className="text-8xl mb-4">📱</div>
                                    <p className="text-2xl font-bold">iPhone 13 Pro Max</p>
                                    <p className="text-lg opacity-90">256GB Sierra Blue</p>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                                {/* Title */}
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    {descResult?.title || 'Loading...'}
                                </h2>

                                {/* Price */}
                                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-4xl font-bold text-green-600">
                                            ฿{priceResult?.estimatedPrice?.toLocaleString()}
                                        </span>
                                        <span className="text-gray-500 line-through">
                                            ฿42,900
                                        </span>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600">
                                        ช่วงราคาแนะนำ: ฿{priceResult?.priceRange?.min?.toLocaleString()} - ฿{priceResult?.priceRange?.max?.toLocaleString()}
                                    </div>
                                    <div className="mt-2 flex items-center gap-2">
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                                style={{ width: `${(priceResult?.confidence || 0) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-semibold text-green-600">
                                            {((priceResult?.confidence || 0) * 100).toFixed(0)}% แม่นยำ
                                        </span>
                                    </div>
                                </div>

                                {/* Highlights */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                                        <span>💎</span> จุดเด่น
                                    </h3>
                                    <div className="space-y-2">
                                        {descResult?.highlights?.map((highlight: string, idx: number) => (
                                            <div key={idx} className="flex items-start gap-2 text-gray-700">
                                                <span className="text-green-500 mt-1">✓</span>
                                                <span>{highlight}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tags */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-lg mb-3">🏷️ Tags</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {descResult?.tags?.map((tag: string, idx: number) => (
                                            <span
                                                key={idx}
                                                className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                                        💬 แชทกับผู้ขาย
                                    </button>
                                    <button className="bg-white border-2 border-purple-600 text-purple-600 py-3 rounded-lg font-semibold hover:bg-purple-50 transition-all">
                                        ❤️ บันทึก
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - AI Details */}
                    <div className="space-y-6">
                        {/* Full Description */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <span>📝</span> รายละเอียดสินค้า
                            </h3>
                            <div className="prose max-w-none">
                                <pre className="whitespace-pre-wrap text-gray-700 font-sans text-sm leading-relaxed">
                                    {descResult?.description}
                                </pre>
                            </div>
                        </div>

                        {/* AI Price Analysis */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <span>🤖</span> การวิเคราะห์ราคาด้วย AI
                            </h3>
                            <div className="space-y-3">
                                {priceResult?.factors?.map((factor: any, idx: number) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800">{factor.factor}</p>
                                            <p className="text-sm text-gray-600">{factor.description}</p>
                                        </div>
                                        <div className={`text-lg font-bold ${factor.impact >= 0 ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {factor.impact >= 0 ? '+' : ''}{factor.impact.toFixed(1)}%
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SEO Keywords */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <span>🔍</span> SEO Keywords
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {descResult?.seoKeywords?.map((keyword: string, idx: number) => (
                                    <span
                                        key={idx}
                                        className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
                                    >
                                        {keyword}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* AI Badge */}
                        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white text-center">
                            <div className="text-4xl mb-3">🤖✨</div>
                            <h3 className="text-2xl font-bold mb-2">สร้างโดย AI</h3>
                            <p className="text-purple-100">
                                โพสนี้ถูกสร้างโดย AI ของ JaiKod ใน 2 วินาที<br />
                                ประหยัดเวลาของคุณได้มากกว่า 10 นาที!
                            </p>
                        </div>

                        {/* Regenerate Button */}
                        <button
                            onClick={generateDemoPost}
                            className="w-full bg-white border-2 border-purple-600 text-purple-600 py-4 rounded-xl font-bold hover:bg-purple-50 transition-all"
                        >
                            🔄 สร้างโพสใหม่อีกครั้ง
                        </button>
                    </div>
                </div>

                {/* Back Button */}
                <div className="text-center mt-12">
                    <a
                        href="/test-ai"
                        className="inline-block bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                    >
                        ← กลับไปหน้าทดสอบ AI
                    </a>
                </div>
            </div>
        </div>
    );
}

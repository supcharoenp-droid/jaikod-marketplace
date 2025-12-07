'use client';

import { useState, useEffect } from 'react';
import { estimateCarPrice } from '@/lib/market-data-service';

export default function DemoCarPostPage() {
    const [carData, setCarData] = useState({
        brand: 'Nissan',
        model: 'Almera',
        year: 2013,
        mileage: 300000,
        condition: 'สภาพใช้งานได้'
    });

    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const estimatePrice = async () => {
        setLoading(true);
        try {
            const estimation = await estimateCarPrice(
                carData.brand,
                carData.model,
                carData.year,
                carData.mileage,
                carData.condition
            );
            setResult(estimation);
        } catch (error) {
            console.error('Error estimating car price:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        estimatePrice();
    }, []);

    const currentYear = new Date().getFullYear();
    const carAge = currentYear - carData.year;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        🚗 ตัวอย่างโพสขายรถยนต์มือสอง
                    </h1>
                    <p className="text-gray-600 text-lg">
                        ระบบประเมินราคาอัจฉริยะ พร้อมอัพเดทราคาตลาดแบบ Real-time
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Column - Car Listing */}
                    <div className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                            {/* Car Image Placeholder */}
                            <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-96 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <div className="text-8xl mb-4">🚗</div>
                                    <p className="text-3xl font-bold">{carData.brand} {carData.model}</p>
                                    <p className="text-xl opacity-90">ปี {carData.year} ({carAge} ปี)</p>
                                    <p className="text-lg opacity-80">{(carData.mileage / 1000).toFixed(0)}k km</p>
                                </div>
                            </div>

                            {/* Car Info */}
                            <div className="p-6">
                                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                                    {carData.brand} {carData.model} ปี {carData.year}
                                </h2>

                                {/* Price */}
                                {loading ? (
                                    <div className="bg-gray-100 rounded-xl p-6 mb-6 animate-pulse">
                                        <div className="h-12 bg-gray-300 rounded mb-2"></div>
                                        <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                                    </div>
                                ) : result ? (
                                    <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-6 mb-6">
                                        <div className="flex items-baseline gap-3 mb-2">
                                            <span className="text-4xl font-bold text-green-600">
                                                ฿{result.estimatedPrice.toLocaleString()}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 mb-3">
                                            ช่วงราคาแนะนำ: ฿{result.priceRange.min.toLocaleString()} - ฿{result.priceRange.max.toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            💡 ราคาอัพเดทตามสภาวะตลาดปัจจุบัน
                                        </div>
                                    </div>
                                ) : null}

                                {/* Specs */}
                                <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                    <h3 className="font-bold text-lg mb-3">📋 ข้อมูลรถ</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-gray-600">ยี่ห้อ</p>
                                            <p className="font-semibold">{carData.brand}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">รุ่น</p>
                                            <p className="font-semibold">{carData.model}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">ปี</p>
                                            <p className="font-semibold">{carData.year} ({carAge} ปี)</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">เลขไมล์</p>
                                            <p className="font-semibold">{carData.mileage.toLocaleString()} km</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-gray-600">สภาพ</p>
                                            <p className="font-semibold">{carData.condition}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Market Insights */}
                                {result && result.marketInsights && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
                                        <h3 className="font-bold text-lg mb-3">📊 ข้อมูลตลาด</h3>
                                        <ul className="space-y-2">
                                            {result.marketInsights.map((insight: string, idx: number) => (
                                                <li key={idx} className="text-sm text-gray-700">
                                                    {insight}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Action Buttons */}
                                <div className="grid grid-cols-2 gap-3">
                                    <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all">
                                        💬 สนใจติดต่อ
                                    </button>
                                    <button className="bg-white border-2 border-blue-600 text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-all">
                                        ❤️ บันทึก
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Pricing Details */}
                    <div className="space-y-6">
                        {/* How It Works */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-2xl font-bold mb-4">🤖 ระบบประเมินราคาอัจฉริยะ</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                        1
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">ดึงข้อมูลตลาด Real-time</h4>
                                        <p className="text-sm text-gray-600">
                                            รวบรวมข้อมูลราคาจากหลายแหล่ง: ระบบภายใน, เว็บไซต์ขายรถ, API ภายนอก
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                                        2
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">คำนวณการเสื่อมราคา</h4>
                                        <p className="text-sm text-gray-600">
                                            รถยนต์เสื่อมราคาแบบ Accelerated:<br />
                                            • ปีแรก: -15%<br />
                                            • ปีที่ 2: -12%<br />
                                            • ปีต่อไป: -20% ต่อปี
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">
                                        3
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">ปรับตามเลขไมล์</h4>
                                        <p className="text-sm text-gray-600">
                                            คาดว่ารถขับ 15,000 km/ปี<br />
                                            ถ้าเกินจะลดราคาตามสัดส่วน
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">
                                        4
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">ปรับตามสภาพ</h4>
                                        <p className="text-sm text-gray-600">
                                            • ใหม่: 100%<br />
                                            • สภาพดีมาก: 95%<br />
                                            • สภาพดี: 85%<br />
                                            • สภาพใช้งานได้: 70%
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-red-600 font-bold">
                                        5
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1">ปรับตามสภาวะตลาด</h4>
                                        <p className="text-sm text-gray-600">
                                            • ราคาตลาดขึ้น/ลง ใน 30 วัน<br />
                                            • ความต้องการ (Demand Score)<br />
                                            • จำนวนรถที่ขายไปใน 30 วัน
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Update Frequency */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                            <h3 className="text-2xl font-bold mb-4">⏰ การอัพเดทข้อมูล</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">📊</span>
                                    <div>
                                        <p className="font-semibold">ข้อมูลตลาด</p>
                                        <p className="text-sm text-blue-100">อัพเดททุก 24 ชั่วโมง</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">📈</span>
                                    <div>
                                        <p className="font-semibold">แนวโน้มราคา</p>
                                        <p className="text-sm text-blue-100">วิเคราะห์ทุก 7 วัน</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-2xl">🔄</span>
                                    <div>
                                        <p className="font-semibold">Demand Score</p>
                                        <p className="text-sm text-blue-100">คำนวณแบบ Real-time</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Example Calculation */}
                        <div className="bg-white rounded-2xl shadow-xl p-6">
                            <h3 className="text-2xl font-bold mb-4">🧮 ตัวอย่างการคำนวณ</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                    <span className="text-gray-700">ราคารถใหม่ (2020)</span>
                                    <span className="font-bold">฿800,000</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-red-50 rounded">
                                    <span className="text-gray-700">เสื่อมราคา ({carAge} ปี)</span>
                                    <span className="font-bold text-red-600">-47%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-orange-50 rounded">
                                    <span className="text-gray-700">ปรับตามเลขไมล์</span>
                                    <span className="font-bold text-orange-600">-5%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                                    <span className="text-gray-700">ปรับตามสภาพ (ดีมาก)</span>
                                    <span className="font-bold text-green-600">95%</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                                    <span className="text-gray-700">ปรับตามตลาด</span>
                                    <span className="font-bold text-blue-600">+2%</span>
                                </div>
                                <div className="border-t-2 border-gray-300 pt-3 mt-3">
                                    <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-100 to-blue-100 rounded-lg">
                                        <span className="font-bold text-lg">ราคาประเมิน</span>
                                        <span className="font-bold text-2xl text-green-600">
                                            ฿{result?.estimatedPrice.toLocaleString() || '...'}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Refresh Button */}
                        <button
                            onClick={estimatePrice}
                            disabled={loading}
                            className="w-full bg-white border-2 border-blue-600 text-blue-600 py-4 rounded-xl font-bold hover:bg-blue-50 transition-all disabled:opacity-50"
                        >
                            {loading ? '🔄 กำลังคำนวณ...' : '🔄 คำนวณราคาใหม่'}
                        </button>
                    </div>
                </div>

                {/* Back Button */}
                <div className="text-center mt-12">
                    <a
                        href="/demo-post"
                        className="inline-block bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all mr-4"
                    >
                        ← ดูตัวอย่างโทรศัพท์
                    </a>
                    <a
                        href="/test-ai"
                        className="inline-block bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                    >
                        กลับไปหน้าทดสอบ AI
                    </a>
                </div>
            </div>
        </div>
    );
}

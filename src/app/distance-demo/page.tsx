'use client';

import { useState, useEffect } from 'react';
import { getCurrentLocation } from '@/lib/ai-search-discovery';
import { DistanceBadge } from '@/components/DistanceBadge';
import { DEFAULT_DISTANCE_CONFIG, DistanceDisplayConfig } from '@/lib/distance-display';

export default function DistanceDisplayDemo() {
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [config, setConfig] = useState<DistanceDisplayConfig>(DEFAULT_DISTANCE_CONFIG);

    // Sample products with locations
    const sampleProducts = [
        {
            id: '1',
            name: 'iPhone 13 Pro Max 256GB',
            price: 32000,
            location: { lat: 13.7563, lng: 100.5018 }, // กรุงเทพฯ (ใกล้สนามหลวง)
            seller: 'ร้าน Mobile Shop'
        },
        {
            id: '2',
            name: 'Honda Civic 2020',
            price: 399000,
            location: { lat: 13.8500, lng: 100.5833 }, // ดอนเมือง
            seller: 'คุณสมชาย'
        },
        {
            id: '3',
            name: 'คอนโด The Loft Asoke',
            price: 4500000,
            location: { lat: 13.7367, lng: 100.5615 }, // อโศก
            seller: 'บริษัท ABC Property'
        },
        {
            id: '4',
            name: 'MacBook Pro M2',
            price: 55000,
            location: { lat: 18.7883, lng: 98.9853 }, // เชียงใหม่
            seller: 'ร้าน Tech North'
        },
        {
            id: '5',
            name: 'Golden Retriever',
            price: 15000,
            location: { lat: 13.6000, lng: 100.5200 }, // สมุทรปราการ
            seller: 'ฟาร์มสุนัข Happy Paws'
        }
    ];

    useEffect(() => {
        getCurrentLocation().then(loc => {
            if (loc) {
                setUserLocation({ lat: loc.latitude, lng: loc.longitude });
            }
        });
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        📍 ระบบแสดงระยะทาง
                    </h1>
                    <p className="text-gray-600 text-lg">
                        แสดงระยะทางระหว่างคุณกับสินค้า พร้อมเวลาเดินทางโดยประมาณ
                    </p>
                </div>

                {/* User Location Status */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4">📡 ตำแหน่งของคุณ</h3>
                    {userLocation ? (
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                            <p className="text-green-700 font-semibold">
                                ✓ ตรวจพบตำแหน่ง: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                            </p>
                            <p className="text-sm text-green-600 mt-1">
                                ระบบจะคำนวณระยะทางจากตำแหน่งนี้
                            </p>
                        </div>
                    ) : (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                            <p className="text-yellow-700 font-semibold">
                                ⚠️ กำลังขอสิทธิ์เข้าถึงตำแหน่งของคุณ...
                            </p>
                            <p className="text-sm text-yellow-600 mt-1">
                                กรุณาอนุญาตให้เข้าถึงตำแหน่งเพื่อดูระยะทาง
                            </p>
                        </div>
                    )}
                </div>

                {/* Privacy Mode Settings */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4">⚙️ การตั้งค่า (สำหรับ Admin)</h3>

                    <div className="space-y-4">
                        {/* Enable/Disable */}
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div>
                                <h4 className="font-semibold">เปิดใช้งานฟีเจอร์</h4>
                                <p className="text-sm text-gray-600">แสดงระยะทางให้ผู้ใช้เห็น</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={config.enabled}
                                    onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                                    className="sr-only peer"
                                />
                                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>

                        {/* Privacy Mode */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">โหมดความเป็นส่วนตัว</label>
                            <select
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                value={config.privacyMode}
                                onChange={(e) => setConfig({ ...config, privacyMode: e.target.value as any })}
                            >
                                <option value="exact">แสดงระยะทางแบบละเอียด (เช่น 2.5 km)</option>
                                <option value="approximate">แสดงระยะทางแบบประมาณ (เช่น &lt; 5 km)</option>
                                <option value="range">แสดงระยะทางแบบช่วง (เช่น 1-5 km) - แนะนำ</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Product List with Distance */}
                {userLocation && config.enabled && (
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <h3 className="text-xl font-bold mb-6">🛍️ สินค้าพร้อมระยะทาง</h3>

                        <div className="space-y-4">
                            {sampleProducts.map((product) => (
                                <div key={product.id} className="border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h4 className="font-bold text-lg">{product.name}</h4>
                                            <p className="text-gray-600 text-sm">ผู้ขาย: {product.seller}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-2xl font-bold text-green-600">
                                                ฿{product.price.toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Distance Badge */}
                                    <div className="flex items-center gap-3">
                                        <DistanceBadge
                                            userLat={userLocation.lat}
                                            userLng={userLocation.lng}
                                            productLat={product.location.lat}
                                            productLng={product.location.lng}
                                            config={config}
                                            showTravelTime={true}
                                            size="md"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Feature Disabled Message */}
                {!config.enabled && (
                    <div className="bg-white rounded-2xl shadow-xl p-6">
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">🔒</div>
                            <h3 className="text-2xl font-bold mb-2">ฟีเจอร์ถูกปิดใช้งาน</h3>
                            <p className="text-gray-600">
                                Admin ได้ปิดการแสดงระยะทาง เปิดใช้งานในการตั้งค่าด้านบนเพื่อดูตัวอย่าง
                            </p>
                        </div>
                    </div>
                )}

                {/* Info Box */}
                <div className="mt-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl shadow-xl p-6 text-white">
                    <h3 className="text-2xl font-bold mb-4">💡 ข้อดีของระบบนี้</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <h4 className="font-bold mb-2">🎯 สะดวกสบาย</h4>
                            <p className="text-sm text-blue-100">ผู้ซื้อรู้ทันทีว่าสินค้าอยู่ห่างแค่ไหน</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-2">🔒 ความเป็นส่วนตัว</h4>
                            <p className="text-sm text-blue-100">แสดงระยะทางแบบคร่าวๆ ไม่เปิดเผยตำแหน่งแน่นอน</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-2">⚙️ ควบคุมได้</h4>
                            <p className="text-sm text-blue-100">Admin สามารถเปิด-ปิดได้ตามต้องการ</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

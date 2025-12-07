'use client';

import { useState } from 'react';
import { estimateCarPrice } from '@/lib/market-data-service';
import { estimatePrice } from '@/lib/ai-price-estimator';
import { generateProductDescription } from '@/lib/ai-description-generator';

// ========================================
// Product Display Components
// ========================================

/**
 * 🚗 Car Product Display
 */
function CarProductDisplay({ product }: { product: any }) {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Image */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 h-64 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="text-6xl mb-2">🚗</div>
                    <p className="text-2xl font-bold">{product.brand} {product.model}</p>
                    <p className="text-lg">ปี {product.year}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{product.title}</h2>

                {/* Price */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                    <div className="text-3xl font-bold text-green-600">฿{product.price.toLocaleString()}</div>
                </div>

                {/* Car-Specific Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">เลขไมล์</p>
                        <p className="font-bold">{product.mileage.toLocaleString()} km</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">เกียร์</p>
                        <p className="font-bold">{product.transmission}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">เชื้อเพลิง</p>
                        <p className="font-bold">{product.fuelType}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">ทะเบียน</p>
                        <p className="font-bold">{product.registrationProvince}</p>
                    </div>
                </div>

                {/* Car-Specific Features */}
                <div className="flex gap-2 mb-4">
                    {product.taxPaid && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">✓ ภาษีจ่ายแล้ว</span>
                    )}
                    {product.hasServiceHistory && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">✓ มีประวัติเข้าศูนย์</span>
                    )}
                </div>

                {/* Car-Specific Actions */}
                <div className="grid grid-cols-3 gap-2">
                    <button className="bg-blue-600 text-white py-2 rounded-lg text-sm">📅 นัดชมรถ</button>
                    <button className="bg-purple-600 text-white py-2 rounded-lg text-sm">🧮 คำนวณผ่อน</button>
                    <button className="bg-gray-600 text-white py-2 rounded-lg text-sm">💬 แชท</button>
                </div>
            </div>
        </div>
    );
}

/**
 * 📱 Mobile Product Display
 */
function MobileProductDisplay({ product }: { product: any }) {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Image */}
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 h-64 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="text-6xl mb-2">📱</div>
                    <p className="text-2xl font-bold">{product.brand} {product.model}</p>
                    <p className="text-lg">{product.storage}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{product.title}</h2>

                {/* Price */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                    <div className="text-3xl font-bold text-green-600">฿{product.price.toLocaleString()}</div>
                </div>

                {/* Mobile-Specific Info */}
                <div className="mb-4">
                    {/* Battery Health Bar */}
                    <div className="mb-3">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-sm font-semibold">Battery Health</span>
                            <span className="text-sm font-bold text-green-600">{product.batteryHealth}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                                className={`h-3 rounded-full ${product.batteryHealth >= 80 ? 'bg-green-500' :
                                        product.batteryHealth >= 60 ? 'bg-yellow-500' :
                                            'bg-red-500'
                                    }`}
                                style={{ width: `${product.batteryHealth}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Specs Grid */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600">ความจุ</p>
                            <p className="font-bold">{product.storage}</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-xs text-gray-600">สภาพหน้าจอ</p>
                            <p className="font-bold text-sm">{product.screenCondition}</p>
                        </div>
                    </div>
                </div>

                {/* Mobile-Specific Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {product.hasBox && (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">📦 มีกล่อง</span>
                    )}
                    {product.hasCharger && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">🔌 มีหัวชาร์จ</span>
                    )}
                    {product.warranty !== 'expired' && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">🛡️ ยังมีประกัน</span>
                    )}
                </div>

                {/* Mobile-Specific Actions */}
                <div className="grid grid-cols-3 gap-2">
                    <button className="bg-purple-600 text-white py-2 rounded-lg text-sm">🔄 Trade-in</button>
                    <button className="bg-blue-600 text-white py-2 rounded-lg text-sm">📊 กราฟราคา</button>
                    <button className="bg-gray-600 text-white py-2 rounded-lg text-sm">💬 แชท</button>
                </div>
            </div>
        </div>
    );
}

/**
 * 🏠 Real Estate Product Display
 */
function RealEstateProductDisplay({ product }: { product: any }) {
    const pricePerSqm = Math.round(product.price / product.area);

    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Image */}
            <div className="bg-gradient-to-br from-orange-500 to-red-600 h-64 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="text-6xl mb-2">🏠</div>
                    <p className="text-2xl font-bold">{product.buildingName || product.type}</p>
                    <p className="text-lg">{product.area} ตร.ม.</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{product.title}</h2>

                {/* Price */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                    <div className="text-3xl font-bold text-green-600">฿{product.price.toLocaleString()}</div>
                    <div className="text-sm text-gray-600 mt-1">฿{pricePerSqm.toLocaleString()}/ตร.ม.</div>
                </div>

                {/* Real Estate-Specific Info */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold">{product.area}</p>
                        <p className="text-xs text-gray-600">ตร.ม.</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold">{product.bedrooms}</p>
                        <p className="text-xs text-gray-600">ห้องนอน</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg text-center">
                        <p className="text-2xl font-bold">{product.bathrooms}</p>
                        <p className="text-xs text-gray-600">ห้องน้ำ</p>
                    </div>
                </div>

                {/* Location Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm font-semibold mb-2">📍 ทำเล</p>
                    <p className="text-sm text-gray-700">{product.district}, {product.province}</p>
                    {product.nearBTS && (
                        <p className="text-xs text-blue-600 mt-1">🚇 ใกล้ BTS {product.distanceToStation}ม.</p>
                    )}
                </div>

                {/* Real Estate-Specific Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {product.floor && (
                        <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm">ชั้น {product.floor}</span>
                    )}
                    {product.commonFee && (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">ค่าส่วนกลาง ฿{product.commonFee}/ด.</span>
                    )}
                </div>

                {/* Real Estate-Specific Actions */}
                <div className="grid grid-cols-3 gap-2">
                    <button className="bg-orange-600 text-white py-2 rounded-lg text-sm">🎥 Virtual Tour</button>
                    <button className="bg-blue-600 text-white py-2 rounded-lg text-sm">🧮 คำนวณผ่อน</button>
                    <button className="bg-gray-600 text-white py-2 rounded-lg text-sm">💬 แชท</button>
                </div>
            </div>
        </div>
    );
}

/**
 * 👕 Fashion Product Display
 */
function FashionProductDisplay({ product }: { product: any }) {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Image */}
            <div className="bg-gradient-to-br from-pink-500 to-purple-600 h-64 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="text-6xl mb-2">👕</div>
                    <p className="text-2xl font-bold">{product.brand}</p>
                    <p className="text-lg">{product.category}</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{product.title}</h2>

                {/* Price */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                    <div className="text-3xl font-bold text-green-600">฿{product.price.toLocaleString()}</div>
                </div>

                {/* Fashion-Specific Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">ไซส์</p>
                        <p className="font-bold text-xl">{product.size}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">สี</p>
                        <p className="font-bold">{product.color}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                        <p className="text-xs text-gray-600">วัสดุ</p>
                        <p className="font-bold">{product.material}</p>
                    </div>
                </div>

                {/* Fashion-Specific Features */}
                <div className="flex flex-wrap gap-2 mb-4">
                    {product.isAuthentic && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">✓ ของแท้</span>
                    )}
                    {product.hasCertificate && (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">📜 มีใบรับรอง</span>
                    )}
                    {product.timesWorn <= 3 && (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">✨ ใส่น้อย ({product.timesWorn}ครั้ง)</span>
                    )}
                </div>

                {/* Fashion-Specific Actions */}
                <div className="grid grid-cols-3 gap-2">
                    <button className="bg-pink-600 text-white py-2 rounded-lg text-sm">👤 AR ลองใส่</button>
                    <button className="bg-purple-600 text-white py-2 rounded-lg text-sm">📏 Size Guide</button>
                    <button className="bg-gray-600 text-white py-2 rounded-lg text-sm">💬 แชท</button>
                </div>
            </div>
        </div>
    );
}

/**
 * 🐕 Pet Product Display
 */
function PetProductDisplay({ product }: { product: any }) {
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Image */}
            <div className="bg-gradient-to-br from-yellow-500 to-orange-600 h-64 flex items-center justify-center">
                <div className="text-center text-white">
                    <div className="text-6xl mb-2">🐕</div>
                    <p className="text-2xl font-bold">{product.breed}</p>
                    <p className="text-lg">{product.age} เดือน</p>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{product.title}</h2>

                {/* Price */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 rounded-xl p-4 mb-4">
                    <div className="text-3xl font-bold text-green-600">฿{product.price.toLocaleString()}</div>
                </div>

                {/* Pet-Specific Info */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">อายุ</p>
                        <p className="font-bold">{product.age} เดือน</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">เพศ</p>
                        <p className="font-bold">{product.gender === 'male' ? 'ตัวผู้' : 'ตัวเมีย'}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">น้ำหนัก</p>
                        <p className="font-bold">{product.weight} kg</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">สี</p>
                        <p className="font-bold">{product.color}</p>
                    </div>
                </div>

                {/* Pet-Specific Health Features */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                    <p className="text-sm font-semibold mb-2">💉 สุขภาพ</p>
                    <div className="flex flex-wrap gap-2">
                        {product.vaccinated && (
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">✓ ฉีดวัคซีน</span>
                        )}
                        {product.neutered && (
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">✓ ทำหมัน</span>
                        )}
                        {product.microchipped && (
                            <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs">✓ ฝังไมโครชิป</span>
                        )}
                    </div>
                </div>

                {/* Pet Temperament */}
                <div className="mb-4">
                    <p className="text-sm font-semibold mb-2">🎭 นิสัย</p>
                    <div className="flex flex-wrap gap-2">
                        {product.temperament?.map((trait: string, idx: number) => (
                            <span key={idx} className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                                {trait}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Pet-Specific Actions */}
                <div className="grid grid-cols-3 gap-2">
                    <button className="bg-yellow-600 text-white py-2 rounded-lg text-sm">📹 ดูวิดีโอ</button>
                    <button className="bg-orange-600 text-white py-2 rounded-lg text-sm">📅 นัดพบ</button>
                    <button className="bg-gray-600 text-white py-2 rounded-lg text-sm">💬 แชท</button>
                </div>
            </div>
        </div>
    );
}

// ========================================
// Main Demo Component
// ========================================

export default function CategoryDisplayDemo() {
    const [selectedCategory, setSelectedCategory] = useState('cars');

    // Sample Products
    const sampleProducts = {
        cars: {
            title: 'Nissan Almera ปี 2013 เกียร์ CVT',
            brand: 'Nissan',
            model: 'Almera',
            year: 2013,
            price: 39580,
            mileage: 300000,
            transmission: 'CVT',
            fuelType: 'เบนซิน',
            registrationProvince: 'กรุงเทพฯ',
            taxPaid: true,
            hasServiceHistory: false,
            condition: 'สภาพใช้งานได้'
        },
        mobiles: {
            title: 'iPhone 13 Pro Max 256GB สภาพดีมาก',
            brand: 'Apple',
            model: 'iPhone 13 Pro Max',
            storage: '256GB',
            price: 32038,
            batteryHealth: 88,
            screenCondition: 'ไม่มีรอย',
            hasBox: true,
            hasCharger: true,
            warranty: 'expired'
        },
        'real-estate': {
            title: 'คอนโด The Loft Asoke 1 ห้องนอน',
            type: 'คอนโด',
            buildingName: 'The Loft Asoke',
            price: 4500000,
            area: 50,
            bedrooms: 1,
            bathrooms: 1,
            district: 'วัฒนา',
            province: 'กรุงเทพฯ',
            nearBTS: true,
            distanceToStation: 200,
            floor: 15,
            commonFee: 2500
        },
        fashion: {
            title: 'Supreme Box Logo Hoodie Black Size L',
            brand: 'Supreme',
            category: 'Hoodie',
            price: 8500,
            size: 'L',
            color: 'Black',
            material: 'Cotton 100%',
            isAuthentic: true,
            hasCertificate: true,
            timesWorn: 3
        },
        pets: {
            title: 'Golden Retriever ตัวผู้ อายุ 6 เดือน',
            breed: 'Golden Retriever',
            age: 6,
            price: 15000,
            gender: 'male',
            weight: 15,
            color: 'ทอง',
            vaccinated: true,
            neutered: true,
            microchipped: true,
            temperament: ['ขี้เล่น', 'เชื่อง', 'รักเด็ก']
        }
    };

    const categories = [
        { id: 'cars', label: '🚗 รถยนต์', color: 'blue' },
        { id: 'mobiles', label: '📱 โทรศัพท์', color: 'purple' },
        { id: 'real-estate', label: '🏠 บ้าน', color: 'orange' },
        { id: 'fashion', label: '👕 เสื้อผ้า', color: 'pink' },
        { id: 'pets', label: '🐕 สัตว์เลี้ยง', color: 'yellow' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        🎨 การแสดงผลตามประเภทสินค้า
                    </h1>
                    <p className="text-gray-600 text-lg">
                        แต่ละประเภทมีการแสดงผลที่แตกต่างกัน เหมาะสมกับลักษณะสินค้า
                    </p>
                </div>

                {/* Category Selector */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all ${selectedCategory === cat.id
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg scale-105'
                                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Product Display */}
                <div className="mb-8">
                    {selectedCategory === 'cars' && <CarProductDisplay product={sampleProducts.cars} />}
                    {selectedCategory === 'mobiles' && <MobileProductDisplay product={sampleProducts.mobiles} />}
                    {selectedCategory === 'real-estate' && <RealEstateProductDisplay product={sampleProducts['real-estate']} />}
                    {selectedCategory === 'fashion' && <FashionProductDisplay product={sampleProducts.fashion} />}
                    {selectedCategory === 'pets' && <PetProductDisplay product={sampleProducts.pets} />}
                </div>

                {/* Explanation */}
                <div className="bg-white rounded-2xl shadow-xl p-6">
                    <h3 className="text-2xl font-bold mb-4">💡 สังเกตความแตกต่าง</h3>
                    <div className="space-y-3 text-gray-700">
                        <p>✅ <strong>ข้อมูลที่แสดง</strong> - แต่ละประเภทแสดงข้อมูลที่สำคัญต่างกัน</p>
                        <p>✅ <strong>สีและไอคอน</strong> - ใช้สีและไอคอนที่เข้ากับประเภทสินค้า</p>
                        <p>✅ <strong>ฟีเจอร์พิเศษ</strong> - แต่ละประเภทมีปุ่มฟีเจอร์ที่แตกต่างกัน</p>
                        <p>✅ <strong>การเน้นข้อมูล</strong> - เน้นข้อมูลที่ผู้ซื้อสนใจมากที่สุด</p>
                    </div>
                </div>

                {/* Back Button */}
                <div className="text-center mt-8">
                    <a
                        href="/demo-car"
                        className="inline-block bg-gray-200 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-all"
                    >
                        ← กลับไปหน้าตัวอย่างรถ
                    </a>
                </div>
            </div>
        </div>
    );
}

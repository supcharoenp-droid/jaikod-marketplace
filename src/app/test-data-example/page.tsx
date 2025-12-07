/**
 * ตัวอย่างการใช้งาน Test Data
 * หน้านี้แสดงวิธีใช้ข้อมูลทดสอบในหลายรูปแบบ
 */

'use client';

import { useProducts, useProduct, useSearchProducts, getProductStats } from '@/hooks/useTestData';
import { useState } from 'react';

export default function TestDataExample() {
    const [searchQuery, setSearchQuery] = useState('');

    // ========================================
    // ตัวอย่าง 1: ดึงสินค้าทั้งหมด
    // ========================================
    const { products: allProducts, loading: loadingAll } = useProducts({
        testMode: true // เปิด Test Mode
    });

    // ========================================
    // ตัวอย่าง 2: ดึงสินค้าตามหมวดหมู่
    // ========================================
    const { products: mobileProducts, loading: loadingMobiles } = useProducts({
        categoryId: 'mobiles',
        limit: 5,
        testMode: true
    });

    // ========================================
    // ตัวอย่าง 3: ดึงสินค้า 1 รายการ
    // ========================================
    const { product: singleProduct, loading: loadingProduct } = useProduct('test-001', true);

    // ========================================
    // ตัวอย่าง 4: ค้นหาสินค้า
    // ========================================
    const { products: searchResults, loading: loadingSearch } = useSearchProducts(searchQuery, true);

    // ========================================
    // ตัวอย่าง 5: ดึงสถิติ
    // ========================================
    const stats = getProductStats(true);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold mb-8">🧪 ตัวอย่างการใช้งาน Test Data</h1>

            {/* ========================================
          สถิติ
      ======================================== */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">📊 สถิติสินค้า</h2>
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-blue-100 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">สินค้าทั้งหมด</div>
                        <div className="text-3xl font-bold">{stats.total}</div>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">โทรศัพท์</div>
                        <div className="text-3xl font-bold">{stats.byCategory.mobiles}</div>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">คอมพิวเตอร์</div>
                        <div className="text-3xl font-bold">{stats.byCategory.computers}</div>
                    </div>
                    <div className="bg-pink-100 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">ราคาเฉลี่ย</div>
                        <div className="text-2xl font-bold">
                            ฿{stats.averagePrice.toLocaleString('th-TH', { maximumFractionDigits: 0 })}
                        </div>
                    </div>
                </div>
            </section>

            {/* ========================================
          ค้นหาสินค้า
      ======================================== */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">🔍 ค้นหาสินค้า</h2>
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ค้นหา iPhone, MacBook, แมว..."
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                />

                {loadingSearch && <p>กำลังค้นหา...</p>}

                {searchQuery && !loadingSearch && (
                    <div>
                        <p className="text-sm text-gray-600 mb-2">
                            พบ {searchResults.length} รายการ
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                            {searchResults.map(product => (
                                <div key={product.id} className="border rounded-lg p-4">
                                    <img
                                        src={product.images[0]}
                                        alt={product.name}
                                        className="w-full h-48 object-cover rounded mb-2"
                                    />
                                    <h3 className="font-semibold mb-1">{product.name}</h3>
                                    <p className="text-lg font-bold text-blue-600">
                                        ฿{product.price.toLocaleString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* ========================================
          สินค้าตามหมวดหมู่
      ======================================== */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">📱 โทรศัพท์มือถือ (5 รายการแรก)</h2>

                {loadingMobiles ? (
                    <p>กำลังโหลด...</p>
                ) : (
                    <div className="grid grid-cols-3 gap-4">
                        {mobileProducts.map(product => (
                            <div key={product.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-48 object-cover rounded mb-2"
                                />
                                <h3 className="font-semibold mb-1">{product.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{product.condition}</p>
                                <div className="flex items-center justify-between">
                                    <p className="text-lg font-bold text-blue-600">
                                        ฿{product.price.toLocaleString()}
                                    </p>
                                    {product.originalPrice && (
                                        <p className="text-sm text-gray-400 line-through">
                                            ฿{product.originalPrice.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    📍 {product.location.district}, {product.location.province}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ========================================
          สินค้า 1 รายการ
      ======================================== */}
            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">📦 รายละเอียดสินค้า (ID: test-001)</h2>

                {loadingProduct ? (
                    <p>กำลังโหลด...</p>
                ) : singleProduct ? (
                    <div className="border rounded-lg p-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <img
                                    src={singleProduct.images[0]}
                                    alt={singleProduct.name}
                                    className="w-full rounded-lg mb-4"
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    {singleProduct.images.slice(1).map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`${singleProduct.name} ${idx + 2}`}
                                            className="w-full h-24 object-cover rounded"
                                        />
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold mb-2">{singleProduct.name}</h3>
                                <p className="text-3xl font-bold text-blue-600 mb-4">
                                    ฿{singleProduct.price.toLocaleString()}
                                </p>

                                <div className="mb-4">
                                    <span className="inline-block bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                                        {singleProduct.condition}
                                    </span>
                                </div>

                                <p className="text-gray-700 mb-4">{singleProduct.description}</p>

                                <div className="border-t pt-4">
                                    <h4 className="font-semibold mb-2">คุณสมบัติ:</h4>
                                    <ul className="space-y-1">
                                        {Object.entries(singleProduct.attributes).map(([key, value]) => (
                                            <li key={key} className="text-sm">
                                                <span className="text-gray-600">{key}:</span>{' '}
                                                <span className="font-medium">{value}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-semibold mb-2">📍 ที่ตั้ง:</h4>
                                    <p className="text-sm">
                                        {singleProduct.location.subdistrict}, {singleProduct.location.district},{' '}
                                        {singleProduct.location.province} {singleProduct.location.postalCode}
                                    </p>
                                </div>

                                <div className="border-t pt-4 mt-4">
                                    <h4 className="font-semibold mb-2">🏷️ Tags:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {singleProduct.tags.map(tag => (
                                            <span
                                                key={tag}
                                                className="bg-gray-100 px-2 py-1 rounded text-sm"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>ไม่พบสินค้า</p>
                )}
            </section>

            {/* ========================================
          สินค้าทั้งหมด
      ======================================== */}
            <section>
                <h2 className="text-2xl font-bold mb-4">🛍️ สินค้าทั้งหมด ({allProducts.length} รายการ)</h2>

                {loadingAll ? (
                    <p>กำลังโหลด...</p>
                ) : (
                    <div className="grid grid-cols-4 gap-4">
                        {allProducts.map(product => (
                            <div key={product.id} className="border rounded-lg p-3 hover:shadow-lg transition-shadow">
                                <img
                                    src={product.images[0]}
                                    alt={product.name}
                                    className="w-full h-32 object-cover rounded mb-2"
                                />
                                <h3 className="font-semibold text-sm mb-1 line-clamp-2">{product.name}</h3>
                                <p className="text-lg font-bold text-blue-600">
                                    ฿{product.price.toLocaleString()}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    📍 {product.location.province}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ========================================
          โค้ดตัวอย่าง
      ======================================== */}
            <section className="mt-12 bg-gray-100 p-6 rounded-lg">
                <h2 className="text-xl font-bold mb-4">💻 โค้ดตัวอย่าง</h2>
                <pre className="bg-gray-800 text-white p-4 rounded overflow-x-auto text-sm">
                    {`// ดึงสินค้าทั้งหมด
const { products, loading } = useProducts({ testMode: true });

// ดึงสินค้าตามหมวดหมู่
const { products } = useProducts({ 
  categoryId: 'mobiles',
  limit: 5,
  testMode: true 
});

// ดึงสินค้า 1 รายการ
const { product } = useProduct('test-001', true);

// ค้นหาสินค้า
const { products } = useSearchProducts('iPhone', true);

// ดึงสถิติ
const stats = getProductStats(true);`}
                </pre>
            </section>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import {
    THAILAND_ZONES,
    getCurrentLocation,
    calculateDistance,
    SearchFilters
} from '@/lib/ai-search-discovery';

export default function AdvancedSearchPage() {
    const [searchMode, setSearchMode] = useState<'keyword' | 'location' | 'nearby'>('keyword');
    const [filters, setFilters] = useState<SearchFilters>({});
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [loading, setLoading] = useState(false);

    // ดึงพิกัดผู้ใช้
    useEffect(() => {
        if (searchMode === 'nearby') {
            getCurrentLocation().then(loc => {
                if (loc) {
                    setUserLocation({ lat: loc.latitude, lng: loc.longitude });
                    setFilters(prev => ({
                        ...prev,
                        latitude: loc.latitude,
                        longitude: loc.longitude,
                        radiusKm: 10
                    }));
                }
            });
        }
    }, [searchMode]);

    const handleSearch = () => {
        setLoading(true);
        // TODO: Call search API
        console.log('Searching with filters:', filters);
        setTimeout(() => setLoading(false), 1000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        🔍 ระบบค้นหาขั้นสูง
                    </h1>
                    <p className="text-gray-600 text-lg">
                        ค้นหาสินค้าด้วยคำค้นหา ตำแหน่งที่ตั้ง หรือพิกัดของคุณ
                    </p>
                </div>

                {/* Search Mode Selector */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4">เลือกวิธีการค้นหา</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <button
                            onClick={() => setSearchMode('keyword')}
                            className={`p-6 rounded-xl border-2 transition-all ${searchMode === 'keyword'
                                    ? 'border-blue-600 bg-blue-50'
                                    : 'border-gray-200 hover:border-blue-300'
                                }`}
                        >
                            <div className="text-4xl mb-2">🔤</div>
                            <h4 className="font-bold text-lg mb-1">ค้นหาด้วยคำค้นหา</h4>
                            <p className="text-sm text-gray-600">ค้นหาด้วยชื่อสินค้า หมวดหมู่ หรือคำอธิบาย</p>
                        </button>

                        <button
                            onClick={() => setSearchMode('location')}
                            className={`p-6 rounded-xl border-2 transition-all ${searchMode === 'location'
                                    ? 'border-purple-600 bg-purple-50'
                                    : 'border-gray-200 hover:border-purple-300'
                                }`}
                        >
                            <div className="text-4xl mb-2">📍</div>
                            <h4 className="font-bold text-lg mb-1">ค้นหาตามพื้นที่</h4>
                            <p className="text-sm text-gray-600">เลือกโซน จังหวัด หรือเขต/อำเภอ</p>
                        </button>

                        <button
                            onClick={() => setSearchMode('nearby')}
                            className={`p-6 rounded-xl border-2 transition-all ${searchMode === 'nearby'
                                    ? 'border-green-600 bg-green-50'
                                    : 'border-gray-200 hover:border-green-300'
                                }`}
                        >
                            <div className="text-4xl mb-2">📡</div>
                            <h4 className="font-bold text-lg mb-1">ใกล้ฉัน</h4>
                            <p className="text-sm text-gray-600">ค้นหาสินค้าใกล้ตำแหน่งของคุณ</p>
                        </button>
                    </div>
                </div>

                {/* Search Filters */}
                <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                    <h3 className="text-xl font-bold mb-6">ตัวกรอง</h3>

                    {/* Keyword Search */}
                    {searchMode === 'keyword' && (
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">คำค้นหา</label>
                                <input
                                    type="text"
                                    placeholder="ค้นหาสินค้า..."
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                    value={filters.keyword || ''}
                                    onChange={(e) => setFilters({ ...filters, keyword: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {/* Location Search */}
                    {searchMode === 'location' && (
                        <div className="space-y-4">
                            {/* Zone Selection */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">เลือกโซน</label>
                                <select
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                    value={filters.zone || ''}
                                    onChange={(e) => setFilters({ ...filters, zone: e.target.value as any, province: undefined })}
                                >
                                    <option value="">-- ทุกโซน --</option>
                                    {Object.entries(THAILAND_ZONES).map(([key, zone]) => (
                                        <option key={key} value={key}>{zone.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Province Selection */}
                            <div>
                                <label className="block text-sm font-semibold mb-2">เลือกจังหวัด</label>
                                <select
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                    value={filters.province || ''}
                                    onChange={(e) => setFilters({ ...filters, province: e.target.value })}
                                >
                                    <option value="">-- ทุกจังหวัด --</option>
                                    {filters.zone && THAILAND_ZONES[filters.zone]?.provinces.map(prov => (
                                        <option key={prov} value={prov}>{prov}</option>
                                    ))}
                                    {!filters.zone && Object.values(THAILAND_ZONES).flatMap(z => z.provinces).map(prov => (
                                        <option key={prov} value={prov}>{prov}</option>
                                    ))}
                                </select>
                            </div>

                            {/* District (Optional) */}
                            {filters.province && (
                                <div>
                                    <label className="block text-sm font-semibold mb-2">เลือกเขต/อำเภอ (ถ้ามี)</label>
                                    <input
                                        type="text"
                                        placeholder="เช่น บางกะปิ, เมือง"
                                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                                        value={filters.district || ''}
                                        onChange={(e) => setFilters({ ...filters, district: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Nearby Search */}
                    {searchMode === 'nearby' && (
                        <div className="space-y-4">
                            {userLocation ? (
                                <>
                                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                        <p className="text-sm text-green-700">
                                            ✓ ตำแหน่งของคุณ: {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                                        </p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold mb-2">
                                            รัศมีการค้นหา: {filters.radiusKm || 10} km
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="100"
                                            step="1"
                                            value={filters.radiusKm || 10}
                                            onChange={(e) => setFilters({ ...filters, radiusKm: parseInt(e.target.value) })}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-xs text-gray-600 mt-1">
                                            <span>1 km</span>
                                            <span>50 km</span>
                                            <span>100 km</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                    <p className="text-sm text-yellow-700">
                                        ⚠️ กำลังขอสิทธิ์เข้าถึงตำแหน่งของคุณ...
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Common Filters */}
                    <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                        <h4 className="font-bold">ตัวกรองเพิ่มเติม</h4>

                        {/* Price Range */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2">ราคาต่ำสุด (฿)</label>
                                <input
                                    type="number"
                                    placeholder="0"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                    value={filters.minPrice || ''}
                                    onChange={(e) => setFilters({ ...filters, minPrice: parseInt(e.target.value) || undefined })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2">ราคาสูงสุด (฿)</label>
                                <input
                                    type="number"
                                    placeholder="ไม่จำกัด"
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                    value={filters.maxPrice || ''}
                                    onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) || undefined })}
                                />
                            </div>
                        </div>

                        {/* Sort By */}
                        <div>
                            <label className="block text-sm font-semibold mb-2">เรียงตาม</label>
                            <select
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                value={filters.sortBy || 'newest'}
                                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                            >
                                <option value="newest">ล่าสุด</option>
                                <option value="price-low">ราคาต่ำ → สูง</option>
                                <option value="price-high">ราคาสูง → ต่ำ</option>
                                {searchMode === 'nearby' && <option value="distance">ระยะทางใกล้ → ไกล</option>}
                                <option value="relevance">ความเกี่ยวข้อง</option>
                            </select>
                        </div>
                    </div>

                    {/* Search Button */}
                    <button
                        onClick={handleSearch}
                        disabled={loading}
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50"
                    >
                        {loading ? '🔄 กำลังค้นหา...' : '🔍 ค้นหาสินค้า'}
                    </button>
                </div>

                {/* Applied Filters Display */}
                {(filters.keyword || filters.province || filters.zone || userLocation) && (
                    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
                        <h3 className="text-lg font-bold mb-4">ตัวกรองที่เลือก</h3>
                        <div className="flex flex-wrap gap-2">
                            {filters.keyword && (
                                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm">
                                    🔤 "{filters.keyword}"
                                </span>
                            )}
                            {filters.zone && (
                                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm">
                                    📍 {THAILAND_ZONES[filters.zone].name}
                                </span>
                            )}
                            {filters.province && (
                                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm">
                                    📍 {filters.province}
                                </span>
                            )}
                            {filters.district && (
                                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm">
                                    📍 {filters.district}
                                </span>
                            )}
                            {userLocation && (
                                <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm">
                                    📡 ใกล้ฉัน ({filters.radiusKm || 10} km)
                                </span>
                            )}
                            {(filters.minPrice || filters.maxPrice) && (
                                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm">
                                    💰 ฿{filters.minPrice?.toLocaleString() || '0'} - ฿{filters.maxPrice?.toLocaleString() || '∞'}
                                </span>
                            )}
                        </div>
                    </div>
                )}

                {/* Info Box */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl shadow-xl p-6 text-white">
                    <h3 className="text-2xl font-bold mb-4">💡 เคล็ดลับการค้นหา</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <h4 className="font-bold mb-2">🔤 คำค้นหา</h4>
                            <p className="text-sm text-blue-100">ใช้คำค้นหาที่ชัดเจน เช่น "iPhone 13 Pro Max 256GB"</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-2">📍 ตำแหน่ง</h4>
                            <p className="text-sm text-blue-100">เลือกโซนหรือจังหวัดเพื่อหาสินค้าใกล้คุณ</p>
                        </div>
                        <div>
                            <h4 className="font-bold mb-2">📡 ใกล้ฉัน</h4>
                            <p className="text-sm text-blue-100">ใช้ GPS เพื่อหาสินค้าในรัศมีที่กำหนด</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

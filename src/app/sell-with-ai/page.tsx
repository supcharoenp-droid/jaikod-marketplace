/**
 * AI-Powered Sell Page Component
 * หน้าโพสสินค้าที่มี AI ช่วยทุกขั้นตอน
 */

'use client';

import { useState, useEffect } from 'react';
import { CATEGORIES, type Category, type Subcategory } from '@/constants/categories';
import { estimatePrice } from '@/lib/ai-price-estimator';
import { generateDescription } from '@/lib/ai-description-generator';

export default function AISellPage() {
    // ========================================
    // State Management
    // ========================================
    const [step, setStep] = useState(1); // 1: Category, 2: Photos, 3: Details, 4: Review

    // Category Selection
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<Subcategory | null>(null);

    // Photos
    const [photos, setPhotos] = useState<File[]>([]);
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);

    // Product Details
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: 0,
        originalPrice: 0,
        condition: 'good',
        attributes: {} as Record<string, any>,
    });

    // AI Results
    const [aiPriceEstimate, setAiPriceEstimate] = useState<any>(null);
    const [aiDescription, setAiDescription] = useState<any>(null);
    const [isGeneratingPrice, setIsGeneratingPrice] = useState(false);
    const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);

    // ========================================
    // Photo Handling
    // ========================================
    const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length + photos.length > 10) {
            alert('สามารถอัพโหลดได้สูงสุด 10 รูป');
            return;
        }

        setPhotos([...photos, ...files]);

        // Create previews
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removePhoto = (index: number) => {
        setPhotos(photos.filter((_, i) => i !== index));
        setPhotoPreviews(photoPreviews.filter((_, i) => i !== index));
    };

    // ========================================
    // AI Price Estimation
    // ========================================
    const handleAIPriceEstimate = async () => {
        if (!selectedCategory) return;

        setIsGeneratingPrice(true);
        try {
            // จำลองการเรียก AI (ใช้ข้อมูลจริงในอนาคต)
            await new Promise(resolve => setTimeout(resolve, 1500));

            const estimate = estimatePrice(
                selectedCategory.slug,
                productData.attributes,
                productData.originalPrice || 0
            );

            setAiPriceEstimate(estimate);
            setProductData(prev => ({
                ...prev,
                price: estimate.estimatedPrice
            }));
        } catch (error) {
            console.error('Error estimating price:', error);
        } finally {
            setIsGeneratingPrice(false);
        }
    };

    // ========================================
    // AI Description Generation
    // ========================================
    const handleAIDescriptionGenerate = async () => {
        if (!selectedCategory) return;

        setIsGeneratingDescription(true);
        try {
            // จำลองการเรียก AI
            await new Promise(resolve => setTimeout(resolve, 2000));

            const description = generateDescription(
                selectedCategory.slug,
                productData.attributes,
                productData.condition
            );

            setAiDescription(description);
            setProductData(prev => ({
                ...prev,
                name: description.title,
                description: description.fullDescription
            }));
        } catch (error) {
            console.error('Error generating description:', error);
        } finally {
            setIsGeneratingDescription(false);
        }
    };

    // ========================================
    // Render Functions
    // ========================================

    // Step 1: Category Selection
    const renderCategoryStep = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-4">🏷️ เลือกหมวดหมู่สินค้า</h2>
                <p className="text-gray-600 mb-6">
                    เลือกหมวดหมู่ที่เหมาะสมกับสินค้าของคุณ AI จะช่วยแนะนำราคาและเขียนรายละเอียดให้
                </p>
            </div>

            {/* Main Categories */}
            <div className="grid grid-cols-4 gap-4">
                {CATEGORIES.map(category => (
                    <button
                        key={category.id}
                        onClick={() => {
                            setSelectedCategory(category);
                            setSelectedSubcategory(null);
                        }}
                        className={`p-4 border-2 rounded-lg text-center transition-all ${selectedCategory?.id === category.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-blue-300'
                            }`}
                    >
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <div className="font-semibold text-sm">{category.name_th}</div>
                    </button>
                ))}
            </div>

            {/* Subcategories */}
            {selectedCategory?.subcategories && (
                <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">
                        เลือกประเภทย่อย ({selectedCategory.name_th})
                    </h3>
                    <div className="grid grid-cols-3 gap-3">
                        {selectedCategory.subcategories.map(sub => (
                            <button
                                key={sub.id}
                                onClick={() => setSelectedSubcategory(sub)}
                                className={`p-3 border-2 rounded-lg text-center transition-all ${selectedSubcategory?.id === sub.id
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-blue-300'
                                    }`}
                            >
                                <div className="font-medium text-sm">{sub.name_th}</div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Next Button */}
            {selectedCategory && (
                <div className="flex justify-end mt-6">
                    <button
                        onClick={() => setStep(2)}
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
                    >
                        ถัดไป: อัพโหลดรูปภาพ →
                    </button>
                </div>
            )}
        </div>
    );

    // Step 2: Photo Upload
    const renderPhotoStep = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-4">📸 อัพโหลดรูปภาพสินค้า</h2>
                <p className="text-gray-600 mb-6">
                    อัพโหลดรูปภาพสินค้า 3-10 รูป AI จะช่วยวิเคราะห์และปรับแต่งรูปให้สวยงาม
                </p>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                    id="photo-upload"
                />
                <label
                    htmlFor="photo-upload"
                    className="cursor-pointer"
                >
                    <div className="text-6xl mb-4">📷</div>
                    <div className="text-lg font-semibold mb-2">
                        คลิกเพื่ออัพโหลดรูปภาพ
                    </div>
                    <div className="text-sm text-gray-500">
                        หรือลากไฟล์มาวางที่นี่ (สูงสุด 10 รูป)
                    </div>
                </label>
            </div>

            {/* Photo Previews */}
            {photoPreviews.length > 0 && (
                <div>
                    <h3 className="font-semibold mb-3">
                        รูปภาพที่อัพโหลด ({photoPreviews.length}/10)
                    </h3>
                    <div className="grid grid-cols-5 gap-4">
                        {photoPreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                                <img
                                    src={preview}
                                    alt={`Photo ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-lg"
                                />
                                <button
                                    onClick={() => removePhoto(index)}
                                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ×
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                        รูปหลัก
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* AI Features */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <div className="text-2xl">🤖</div>
                    <div>
                        <div className="font-semibold mb-1">AI จะช่วยคุณ:</div>
                        <ul className="text-sm space-y-1 text-gray-700">
                            <li>✅ ปรับแสงและสีให้สวยงาม</li>
                            <li>✅ ลบพื้นหลังรกรุงรัง</li>
                            <li>✅ ตรวจจับสินค้าและแนะนำมุมถ่าย</li>
                            <li>✅ บีบอัดรูปให้เล็กลง 80%</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={() => setStep(1)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                    ← ย้อนกลับ
                </button>
                <button
                    onClick={() => setStep(3)}
                    disabled={photoPreviews.length < 3}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    ถัดไป: กรอกรายละเอียด →
                </button>
            </div>
        </div>
    );

    // Step 3: Product Details with AI
    const renderDetailsStep = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-4">📝 รายละเอียดสินค้า</h2>
                <p className="text-gray-600 mb-6">
                    กรอกข้อมูลสินค้า หรือให้ AI ช่วยเขียนให้
                </p>
            </div>

            {/* AI Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
                <button
                    onClick={handleAIPriceEstimate}
                    disabled={isGeneratingPrice}
                    className="p-4 border-2 border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                >
                    <div className="text-3xl mb-2">💰</div>
                    <div className="font-semibold">AI ประเมินราคา</div>
                    <div className="text-sm text-gray-600">
                        {isGeneratingPrice ? 'กำลังประเมิน...' : 'คลิกเพื่อให้ AI แนะนำราคา'}
                    </div>
                </button>

                <button
                    onClick={handleAIDescriptionGenerate}
                    disabled={isGeneratingDescription}
                    className="p-4 border-2 border-green-200 rounded-lg hover:bg-green-50 transition-colors"
                >
                    <div className="text-3xl mb-2">✍️</div>
                    <div className="font-semibold">AI เขียนรายละเอียด</div>
                    <div className="text-sm text-gray-600">
                        {isGeneratingDescription ? 'กำลังเขียน...' : 'คลิกเพื่อให้ AI เขียนให้'}
                    </div>
                </button>
            </div>

            {/* AI Price Result */}
            {aiPriceEstimate && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="font-semibold mb-2">💡 AI แนะนำราคา:</div>
                    <div className="text-2xl font-bold text-blue-600 mb-2">
                        ฿{aiPriceEstimate.estimatedPrice.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                        ช่วงราคา: ฿{aiPriceEstimate.priceRange.min.toLocaleString()} -
                        ฿{aiPriceEstimate.priceRange.max.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">
                        ความมั่นใจ: {(aiPriceEstimate.confidence * 100).toFixed(0)}%
                    </div>
                </div>
            )}

            {/* Product Name */}
            <div>
                <label className="block font-semibold mb-2">ชื่อสินค้า *</label>
                <input
                    type="text"
                    value={productData.name}
                    onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                    placeholder="เช่น iPhone 14 Pro 256GB สีม่วง"
                    className="w-full px-4 py-2 border rounded-lg"
                />
            </div>

            {/* Description */}
            <div>
                <label className="block font-semibold mb-2">รายละเอียด *</label>
                <textarea
                    value={productData.description}
                    onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                    placeholder="อธิบายสภาพสินค้า คุณสมบัติ และสิ่งที่มาพร้อม..."
                    rows={6}
                    className="w-full px-4 py-2 border rounded-lg"
                />
                {aiDescription && (
                    <div className="mt-2 text-sm text-gray-600">
                        💡 AI แนะนำ: ใช้คำว่า "{aiDescription.highlights.join(', ')}" เพื่อดึงดูดผู้ซื้อ
                    </div>
                )}
            </div>

            {/* Price */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block font-semibold mb-2">ราคาขาย *</label>
                    <input
                        type="number"
                        value={productData.price}
                        onChange={(e) => setProductData({ ...productData, price: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-2">ราคาเดิม (ถ้ามี)</label>
                    <input
                        type="number"
                        value={productData.originalPrice}
                        onChange={(e) => setProductData({ ...productData, originalPrice: Number(e.target.value) })}
                        placeholder="0"
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                </div>
            </div>

            {/* Condition */}
            <div>
                <label className="block font-semibold mb-2">สภาพสินค้า *</label>
                <select
                    value={productData.condition}
                    onChange={(e) => setProductData({ ...productData, condition: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                >
                    <option value="new">ใหม่</option>
                    <option value="like_new">เหมือนใหม่</option>
                    <option value="good">ดี</option>
                    <option value="fair">พอใช้</option>
                    <option value="poor">ต้องซ่อม</option>
                </select>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={() => setStep(2)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                    ← ย้อนกลับ
                </button>
                <button
                    onClick={() => setStep(4)}
                    disabled={!productData.name || !productData.description || !productData.price}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    ถัดไป: ตรวจสอบและโพส →
                </button>
            </div>
        </div>
    );

    // Step 4: Review and Post
    const renderReviewStep = () => (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold mb-4">✅ ตรวจสอบข้อมูล</h2>
                <p className="text-gray-600 mb-6">
                    ตรวจสอบข้อมูลสินค้าก่อนโพส
                </p>
            </div>

            {/* Preview */}
            <div className="border rounded-lg p-6">
                <div className="grid grid-cols-2 gap-6">
                    {/* Photos */}
                    <div>
                        <h3 className="font-semibold mb-3">รูปภาพ ({photoPreviews.length} รูป)</h3>
                        <div className="grid grid-cols-3 gap-2">
                            {photoPreviews.map((preview, index) => (
                                <img
                                    key={index}
                                    src={preview}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-24 object-cover rounded"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Details */}
                    <div>
                        <h3 className="font-semibold mb-3">รายละเอียด</h3>
                        <div className="space-y-2 text-sm">
                            <div>
                                <span className="text-gray-600">หมวดหมู่:</span>{' '}
                                <span className="font-medium">{selectedCategory?.name_th}</span>
                                {selectedSubcategory && (
                                    <span className="text-gray-600"> → {selectedSubcategory.name_th}</span>
                                )}
                            </div>
                            <div>
                                <span className="text-gray-600">ชื่อ:</span>{' '}
                                <span className="font-medium">{productData.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">ราคา:</span>{' '}
                                <span className="font-bold text-blue-600">
                                    ฿{productData.price.toLocaleString()}
                                </span>
                            </div>
                            <div>
                                <span className="text-gray-600">สภาพ:</span>{' '}
                                <span className="font-medium">{productData.condition}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold mb-2">รายละเอียดเต็ม:</h3>
                    <p className="text-sm text-gray-700">{productData.description}</p>
                </div>
            </div>

            {/* AI Summary */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                    <div className="text-2xl">🤖</div>
                    <div>
                        <div className="font-semibold mb-2">AI ช่วยคุณ:</div>
                        <ul className="text-sm space-y-1 text-gray-700">
                            <li>✅ ประเมินราคาอัจฉริยะ</li>
                            <li>✅ เขียนรายละเอียดที่น่าสนใจ</li>
                            <li>✅ ปรับแต่งรูปภาพให้สวยงาม</li>
                            <li>✅ แนะนำหมวดหมู่ที่เหมาะสม</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-6">
                <button
                    onClick={() => setStep(3)}
                    className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
                >
                    ← ย้อนกลับแก้ไข
                </button>
                <button
                    onClick={() => alert('โพสสินค้าสำเร็จ! (Demo)')}
                    className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 text-lg"
                >
                    🚀 โพสสินค้าเลย!
                </button>
            </div>
        </div>
    );

    // ========================================
    // Main Render
    // ========================================
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <h1 className="text-3xl font-bold mb-2">🤖 ลงขายด้วย AI</h1>
                    <p className="text-gray-600">
                        AI ช่วยคุณทุกขั้นตอน จากการเลือกหมวดหมู่ ถึงการเขียนรายละเอียด
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        {[
                            { num: 1, label: 'เลือกหมวดหมู่', icon: '🏷️' },
                            { num: 2, label: 'อัพโหลดรูป', icon: '📸' },
                            { num: 3, label: 'กรอกรายละเอียด', icon: '📝' },
                            { num: 4, label: 'ตรวจสอบและโพส', icon: '✅' },
                        ].map((s, idx) => (
                            <div key={s.num} className="flex items-center">
                                <div
                                    className={`flex flex-col items-center ${step >= s.num ? 'text-blue-600' : 'text-gray-400'
                                        }`}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 ${step >= s.num ? 'bg-blue-100' : 'bg-gray-100'
                                            }`}
                                    >
                                        {s.icon}
                                    </div>
                                    <div className="text-sm font-medium">{s.label}</div>
                                </div>
                                {idx < 3 && (
                                    <div
                                        className={`w-16 h-1 mx-2 ${step > s.num ? 'bg-blue-600' : 'bg-gray-200'
                                            }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                    {step === 1 && renderCategoryStep()}
                    {step === 2 && renderPhotoStep()}
                    {step === 3 && renderDetailsStep()}
                    {step === 4 && renderReviewStep()}
                </div>
            </div>
        </div>
    );
}

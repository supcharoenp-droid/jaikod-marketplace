/**
 * Dynamic Product Form Component
 * ฟอร์มสร้างสินค้าที่ปรับเปลี่ยนตาม Category Schema
 */

'use client';

import { useState, useEffect } from 'react';
import { getCategorySchema, type AttributeField, type CategorySchema } from '@/config/category-schemas';
import { estimatePrice, type PriceEstimation } from '@/lib/ai-price-estimator';
import { generateProductDescription, type GeneratedDescription } from '@/lib/ai-description-generator';

interface DynamicProductFormProps {
    categoryId: string;
    onSubmit: (productData: any) => void;
}

export default function DynamicProductForm({ categoryId, onSubmit }: DynamicProductFormProps) {
    const [schema, setSchema] = useState<CategorySchema | null>(null);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [priceEstimation, setPriceEstimation] = useState<PriceEstimation | null>(null);
    const [generatedDescription, setGeneratedDescription] = useState<GeneratedDescription | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // โหลด Schema เมื่อเปลี่ยนหมวดหมู่
    useEffect(() => {
        const categorySchema = getCategorySchema(categoryId);
        setSchema(categorySchema);
        setFormData({});
        setPriceEstimation(null);
        setGeneratedDescription(null);
    }, [categoryId]);

    // อัพเดทค่าในฟอร์ม
    const handleFieldChange = (key: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    // ประเมินราคาอัตโนมัติ
    const handleEstimatePrice = async () => {
        if (!schema) return;

        setIsGenerating(true);
        try {
            const estimation = await estimatePrice({
                categoryId,
                attributes: formData,
                purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : undefined,
                originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined
            });
            setPriceEstimation(estimation);
        } catch (error) {
            console.error('Error estimating price:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // สร้างรายละเอียดอัตโนมัติ
    const handleGenerateDescription = async () => {
        if (!schema) return;

        setIsGenerating(true);
        try {
            const description = await generateProductDescription({
                categoryId,
                attributes: formData,
                tone: 'casual'
            });
            setGeneratedDescription(description);
        } catch (error) {
            console.error('Error generating description:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // ส่งฟอร์ม
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const productData = {
            ...formData,
            categoryId,
            estimatedPrice: priceEstimation?.estimatedPrice,
            title: generatedDescription?.title,
            description: generatedDescription?.description,
            highlights: generatedDescription?.highlights,
            tags: generatedDescription?.tags,
            seoKeywords: generatedDescription?.seoKeywords
        };

        onSubmit(productData);
    };

    if (!schema) {
        return <div>กำลังโหลด...</div>;
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-lg">
                <h2 className="text-2xl font-bold mb-2">{schema.categoryName}</h2>
                <p className="text-sm opacity-90">กรอกข้อมูลสินค้าให้ครบถ้วน AI จะช่วยเขียนรายละเอียดและประเมินราคาให้</p>
            </div>

            {/* Dynamic Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {schema.attributes.map((attr) => (
                    <FormField
                        key={attr.key}
                        attribute={attr}
                        value={formData[attr.key]}
                        onChange={(value) => handleFieldChange(attr.key, value)}
                    />
                ))}
            </div>

            {/* Additional Fields for Price Estimation */}
            <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">ข้อมูลเพิ่มเติม (สำหรับประเมินราคา)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            วันที่ซื้อ (ถ้าจำได้)
                        </label>
                        <input
                            type="date"
                            value={formData.purchaseDate || ''}
                            onChange={(e) => handleFieldChange('purchaseDate', e.target.value)}
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">
                            ราคาที่ซื้อมา (บาท)
                        </label>
                        <input
                            type="number"
                            value={formData.originalPrice || ''}
                            onChange={(e) => handleFieldChange('originalPrice', e.target.value)}
                            placeholder="0"
                            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                    </div>
                </div>
            </div>

            {/* AI Actions */}
            <div className="flex gap-4">
                <button
                    type="button"
                    onClick={handleEstimatePrice}
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {isGenerating ? '🤖 กำลังคำนวณ...' : '💰 AI ประเมินราคา'}
                </button>
                <button
                    type="button"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                >
                    {isGenerating ? '🤖 กำลังเขียน...' : '✨ AI เขียนรายละเอียด'}
                </button>
            </div>

            {/* Price Estimation Result */}
            {priceEstimation && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-green-800 mb-4">💰 ราคาที่แนะนำ</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600 mb-1">ราคาต่ำสุด</div>
                            <div className="text-2xl font-bold text-gray-800">
                                ฿{priceEstimation.priceRange.min.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-green-500 to-emerald-500 text-white rounded-lg p-4 text-center shadow-lg">
                            <div className="text-sm opacity-90 mb-1">ราคาแนะนำ</div>
                            <div className="text-3xl font-bold">
                                ฿{priceEstimation.estimatedPrice.toLocaleString()}
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                            <div className="text-sm text-gray-600 mb-1">ราคาสูงสุด</div>
                            <div className="text-2xl font-bold text-gray-800">
                                ฿{priceEstimation.priceRange.max.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">ความมั่นใจในการประเมิน</span>
                            <span className="text-sm font-bold">{(priceEstimation.confidence * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-green-500 h-2 rounded-full transition-all"
                                style={{ width: `${priceEstimation.confidence * 100}%` }}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <h4 className="font-semibold mb-2">📊 ปัจจัยที่มีผลต่อราคา:</h4>
                        <div className="space-y-2">
                            {priceEstimation.factors.map((factor, index) => (
                                <div key={index} className="flex items-center justify-between text-sm">
                                    <span>{factor.factor}</span>
                                    <span className={`font-semibold ${factor.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {factor.impact >= 0 ? '+' : ''}{factor.impact.toFixed(1)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {priceEstimation.recommendations.length > 0 && (
                        <div>
                            <h4 className="font-semibold mb-2">💡 คำแนะนำ:</h4>
                            <ul className="space-y-1">
                                {priceEstimation.recommendations.map((rec, index) => (
                                    <li key={index} className="text-sm">{rec}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}

            {/* Generated Description Result */}
            {generatedDescription && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-purple-800 mb-4">✨ รายละเอียดที่ AI สร้างให้</h3>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">หัวข้อสินค้า</label>
                        <input
                            type="text"
                            value={generatedDescription.title}
                            readOnly
                            className="w-full px-4 py-2 bg-white border rounded-lg"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2">รายละเอียด</label>
                        <textarea
                            value={generatedDescription.description}
                            readOnly
                            rows={12}
                            className="w-full px-4 py-2 bg-white border rounded-lg font-mono text-sm"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">จุดเด่น</label>
                            <div className="bg-white rounded-lg p-3 text-sm">
                                {generatedDescription.highlights.map((h, i) => (
                                    <div key={i}>• {h}</div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">แท็ก</label>
                            <div className="bg-white rounded-lg p-3">
                                <div className="flex flex-wrap gap-2">
                                    {generatedDescription.tags.map((tag, i) => (
                                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Button */}
            <button
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all"
            >
                🚀 ลงขายเลย!
            </button>
        </form>
    );
}

/**
 * Form Field Component
 * แสดงฟิลด์ตามประเภทของ Attribute
 */
interface FormFieldProps {
    attribute: AttributeField;
    value: any;
    onChange: (value: any) => void;
}

function FormField({ attribute, value, onChange }: FormFieldProps) {
    const renderField = () => {
        switch (attribute.type) {
            case 'text':
                return (
                    <input
                        type="text"
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={attribute.placeholder}
                        required={attribute.required}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                );

            case 'number':
                return (
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={attribute.placeholder}
                            min={attribute.min}
                            max={attribute.max}
                            required={attribute.required}
                            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                        />
                        {attribute.unit && (
                            <span className="flex items-center px-3 bg-gray-100 rounded-lg text-sm">
                                {attribute.unit}
                            </span>
                        )}
                    </div>
                );

            case 'select':
                return (
                    <select
                        value={value || ''}
                        onChange={(e) => onChange(e.target.value)}
                        required={attribute.required}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                        <option value="">-- เลือก --</option>
                        {attribute.options?.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                );

            case 'multiselect':
                return (
                    <div className="space-y-2">
                        {attribute.options?.map((option) => (
                            <label key={option} className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={(value || []).includes(option)}
                                    onChange={(e) => {
                                        const currentValue = value || [];
                                        if (e.target.checked) {
                                            onChange([...currentValue, option]);
                                        } else {
                                            onChange(currentValue.filter((v: string) => v !== option));
                                        }
                                    }}
                                    className="rounded"
                                />
                                <span className="text-sm">{option}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'boolean':
                return (
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            checked={value || false}
                            onChange={(e) => onChange(e.target.checked)}
                            className="rounded"
                        />
                        <span className="text-sm">{attribute.label}</span>
                    </label>
                );

            default:
                return null;
        }
    };

    return (
        <div>
            <label className="block text-sm font-medium mb-2">
                {attribute.label}
                {attribute.required && <span className="text-red-500 ml-1">*</span>}
                {attribute.aiImportance === 'critical' && (
                    <span className="ml-2 text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded">สำคัญมาก</span>
                )}
                {attribute.aiImportance === 'high' && (
                    <span className="ml-2 text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded">สำคัญ</span>
                )}
            </label>
            {renderField()}
            {attribute.helpText && (
                <p className="text-xs text-gray-500 mt-1">{attribute.helpText}</p>
            )}
        </div>
    );
}

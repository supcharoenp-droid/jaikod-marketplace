'use client';

import { useState } from 'react';
import { estimatePrice, type ProductData } from '@/lib/ai-price-estimator';
import { generateProductDescription, type GenerateDescriptionInput } from '@/lib/ai-description-generator';
import { suggestResponse, analyzeSentiment, sellerQuickReplies, buyerQuickReplies } from '@/lib/ai-chat-assistant';
import { DEFAULT_AI_CONFIG, isFeatureEnabled, calculateMonthlyCost, getEnabledFeatures } from '@/config/ai-features';

export default function TestAIPage() {
    const [activeTab, setActiveTab] = useState<'price' | 'description' | 'chat' | 'config'>('price');

    // Price Estimator Test
    const [priceResult, setPriceResult] = useState<any>(null);
    const [priceLoading, setPriceLoading] = useState(false);

    // Description Generator Test
    const [descResult, setDescResult] = useState<any>(null);
    const [descLoading, setDescLoading] = useState(false);

    // Chat Assistant Test
    const [chatMessage, setChatMessage] = useState('');
    const [chatSuggestions, setChatSuggestions] = useState<any[]>([]);
    const [sentiment, setSentiment] = useState<any>(null);

    // Test AI Price Estimator
    const testPriceEstimator = async () => {
        setPriceLoading(true);
        try {
            const testProduct: ProductData = {
                categoryId: 'mobiles',
                attributes: {
                    brand: 'Apple',
                    model: 'iPhone 14 Pro',
                    storage: '256GB',
                    condition: 'มือสอง สภาพดีมาก',
                    batteryHealth: 92,
                    warranty: 'หมดประกันแล้ว',
                    accessories: ['กล่อง', 'สายชาร์จ', 'หัวชาร์จ'],
                    color: 'Deep Purple'
                },
                originalPrice: 45900,
                purchaseDate: new Date('2023-01-15')
            };

            const result = await estimatePrice(testProduct);
            setPriceResult(result);
        } catch (error) {
            console.error('Price estimation error:', error);
            setPriceResult({ error: error.message });
        } finally {
            setPriceLoading(false);
        }
    };

    // Test AI Description Generator
    const testDescriptionGenerator = async () => {
        setDescLoading(true);
        try {
            const testInput: GenerateDescriptionInput = {
                categoryId: 'mobiles',
                attributes: {
                    brand: 'Apple',
                    model: 'iPhone 14 Pro',
                    storage: '256GB',
                    condition: 'มือสอง สภาพดีมาก',
                    batteryHealth: 92,
                    warranty: 'หมดประกันแล้ว',
                    accessories: ['กล่อง', 'สายชาร์จ', 'หัวชาร์จ'],
                    color: 'Deep Purple',
                    ram: '6GB'
                },
                tone: 'friendly'
            };

            const result = await generateProductDescription(testInput);
            setDescResult(result);
        } catch (error) {
            console.error('Description generation error:', error);
            setDescResult({ error: error.message });
        } finally {
            setDescLoading(false);
        }
    };

    // Test Chat Assistant
    const testChatAssistant = () => {
        if (!chatMessage.trim()) return;

        const suggestions = suggestResponse(chatMessage, 'seller', {
            productStatus: 'available',
            hasNegotiation: true
        });

        const sentimentResult = analyzeSentiment(chatMessage);

        setChatSuggestions(suggestions);
        setSentiment(sentimentResult);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        🤖 ทดสอบระบบ AI - JaiKod
                    </h1>
                    <p className="text-gray-600 text-lg">
                        ทดสอบฟีเจอร์ AI ทั้งหมดที่เปิดใช้งานในระบบ
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 overflow-x-auto">
                    {[
                        { id: 'price', label: '💰 Price Estimator', icon: '💰' },
                        { id: 'description', label: '📝 Description Generator', icon: '📝' },
                        { id: 'chat', label: '💬 Chat Assistant', icon: '💬' },
                        { id: 'config', label: '⚙️ AI Config', icon: '⚙️' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${activeTab === tab.id
                                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                                    : 'bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Price Estimator Tab */}
                    {activeTab === 'price' && (
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">💰 AI Price Estimator</h2>
                            <p className="text-gray-600 mb-6">
                                ทดสอบการประเมินราคาสินค้าด้วย AI โดยใช้ข้อมูลสินค้าตัวอย่าง (iPhone 14 Pro 256GB)
                            </p>

                            <button
                                onClick={testPriceEstimator}
                                disabled={priceLoading}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {priceLoading ? '🔄 กำลังประเมินราคา...' : '🚀 ทดสอบ Price Estimator'}
                            </button>

                            {priceResult && (
                                <div className="mt-8 space-y-4">
                                    {priceResult.error ? (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                            <p className="text-red-600">❌ Error: {priceResult.error}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                                                <h3 className="text-2xl font-bold text-green-700 mb-2">
                                                    ราคาประเมิน: ฿{priceResult.estimatedPrice?.toLocaleString()}
                                                </h3>
                                                <p className="text-gray-600">
                                                    ช่วงราคา: ฿{priceResult.priceRange?.min?.toLocaleString()} - ฿{priceResult.priceRange?.max?.toLocaleString()}
                                                </p>
                                                <p className="text-gray-600">
                                                    ความมั่นใจ: {(priceResult.confidence * 100).toFixed(0)}%
                                                </p>
                                            </div>

                                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                                <h4 className="font-bold text-lg mb-3">📊 ปัจจัยที่ส่งผลต่อราคา:</h4>
                                                <div className="space-y-2">
                                                    {priceResult.factors?.map((factor: any, idx: number) => (
                                                        <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                                            <span className="text-gray-700">{factor.factor}</span>
                                                            <span className={`font-semibold ${factor.impact >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                                {factor.impact >= 0 ? '+' : ''}{factor.impact.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                                <h4 className="font-bold text-lg mb-3">💡 คำแนะนำ:</h4>
                                                <ul className="space-y-2">
                                                    {priceResult.recommendations?.map((rec: string, idx: number) => (
                                                        <li key={idx} className="text-gray-700">• {rec}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Description Generator Tab */}
                    {activeTab === 'description' && (
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">📝 AI Description Generator</h2>
                            <p className="text-gray-600 mb-6">
                                ทดสอบการสร้างรายละเอียดสินค้าอัตโนมัติด้วย AI
                            </p>

                            <button
                                onClick={testDescriptionGenerator}
                                disabled={descLoading}
                                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {descLoading ? '🔄 กำลังสร้างรายละเอียด...' : '🚀 ทดสอบ Description Generator'}
                            </button>

                            {descResult && (
                                <div className="mt-8 space-y-4">
                                    {descResult.error ? (
                                        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                                            <p className="text-red-600">❌ Error: {descResult.error}</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                                <h4 className="font-bold text-lg mb-3">📌 หัวข้อสินค้า:</h4>
                                                <p className="text-xl text-gray-800">{descResult.title}</p>
                                            </div>

                                            <div className="bg-white border border-gray-200 rounded-lg p-6">
                                                <h4 className="font-bold text-lg mb-3">📄 รายละเอียดเต็ม:</h4>
                                                <div className="prose max-w-none">
                                                    <pre className="whitespace-pre-wrap text-gray-700 font-sans">{descResult.description}</pre>
                                                </div>
                                            </div>

                                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                                <h4 className="font-bold text-lg mb-3">💎 จุดเด่น:</h4>
                                                <ul className="space-y-2">
                                                    {descResult.highlights?.map((highlight: string, idx: number) => (
                                                        <li key={idx} className="text-gray-700">✓ {highlight}</li>
                                                    ))}
                                                </ul>
                                            </div>

                                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
                                                <h4 className="font-bold text-lg mb-3">🏷️ Tags:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {descResult.tags?.map((tag: string, idx: number) => (
                                                        <span key={idx} className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                                                <h4 className="font-bold text-lg mb-3">🔍 SEO Keywords:</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {descResult.seoKeywords?.map((keyword: string, idx: number) => (
                                                        <span key={idx} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm">
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Chat Assistant Tab */}
                    {activeTab === 'chat' && (
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">💬 AI Chat Assistant</h2>
                            <p className="text-gray-600 mb-6">
                                ทดสอบการแนะนำคำตอบและวิเคราะห์ความรู้สึกจากข้อความ
                            </p>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        พิมพ์ข้อความจากลูกค้า:
                                    </label>
                                    <textarea
                                        value={chatMessage}
                                        onChange={(e) => setChatMessage(e.target.value)}
                                        placeholder="เช่น: สินค้ายังมีไหมครับ ลดได้ไหม"
                                        className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                        rows={3}
                                    />
                                </div>

                                <button
                                    onClick={testChatAssistant}
                                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold hover:shadow-lg transition-all"
                                >
                                    🚀 วิเคราะห์และแนะนำคำตอบ
                                </button>

                                {sentiment && (
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h4 className="font-bold text-lg mb-3">😊 Sentiment Analysis:</h4>
                                        <div className="flex items-center gap-4">
                                            <span className={`text-2xl ${sentiment.sentiment === 'positive' ? 'text-green-600' :
                                                    sentiment.sentiment === 'negative' ? 'text-red-600' :
                                                        'text-gray-600'
                                                }`}>
                                                {sentiment.sentiment === 'positive' ? '😊 Positive' :
                                                    sentiment.sentiment === 'negative' ? '😞 Negative' :
                                                        '😐 Neutral'}
                                            </span>
                                            <span className="text-gray-600">
                                                Confidence: {(sentiment.confidence * 100).toFixed(0)}%
                                            </span>
                                        </div>
                                        {sentiment.keywords.length > 0 && (
                                            <div className="mt-3">
                                                <p className="text-sm text-gray-600">Keywords: {sentiment.keywords.join(', ')}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {chatSuggestions.length > 0 && (
                                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                        <h4 className="font-bold text-lg mb-3">💡 คำตอบที่แนะนำ:</h4>
                                        <div className="space-y-4">
                                            {chatSuggestions.map((suggestion, idx) => (
                                                <div key={idx} className="bg-white p-4 rounded-lg border border-gray-200">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <span className="text-sm font-semibold text-purple-600">
                                                            {suggestion.category}
                                                        </span>
                                                        <span className="text-sm text-gray-600">
                                                            {(suggestion.confidence * 100).toFixed(0)}% confident
                                                        </span>
                                                    </div>
                                                    <p className="text-gray-800 mb-3">{suggestion.text}</p>
                                                    {suggestion.tips && (
                                                        <p className="text-sm text-blue-600">{suggestion.tips}</p>
                                                    )}
                                                    {suggestion.variations && suggestion.variations.length > 0 && (
                                                        <details className="mt-2">
                                                            <summary className="text-sm text-gray-600 cursor-pointer">
                                                                ดูตัวเลือกอื่น ({suggestion.variations.length})
                                                            </summary>
                                                            <ul className="mt-2 space-y-1 pl-4">
                                                                {suggestion.variations.map((v: string, i: number) => (
                                                                    <li key={i} className="text-sm text-gray-600">• {v}</li>
                                                                ))}
                                                            </ul>
                                                        </details>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h4 className="font-bold text-lg mb-3">🛍️ Quick Replies (ผู้ขาย):</h4>
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {sellerQuickReplies.slice(0, 10).map((reply) => (
                                                <div key={reply.id} className="p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span>{reply.icon}</span>
                                                        <span className="text-sm font-semibold text-gray-700">{reply.category}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{reply.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                                        <h4 className="font-bold text-lg mb-3">🛒 Quick Replies (ผู้ซื้อ):</h4>
                                        <div className="space-y-2 max-h-96 overflow-y-auto">
                                            {buyerQuickReplies.map((reply) => (
                                                <div key={reply.id} className="p-3 bg-gray-50 rounded hover:bg-gray-100 cursor-pointer">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span>{reply.icon}</span>
                                                        <span className="text-sm font-semibold text-gray-700">{reply.category}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600">{reply.text}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Config Tab */}
                    {activeTab === 'config' && (
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-800">⚙️ AI Configuration</h2>
                            <p className="text-gray-600 mb-6">
                                สถานะและการตั้งค่าฟีเจอร์ AI ทั้งหมด
                            </p>

                            <div className="space-y-6">
                                <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-6">
                                    <h4 className="font-bold text-lg mb-3">💰 ค่าใช้จ่ายรายเดือน:</h4>
                                    <p className="text-3xl font-bold text-green-600">
                                        ${calculateMonthlyCost(DEFAULT_AI_CONFIG).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-2">
                                        Budget Limit: ${DEFAULT_AI_CONFIG.globalSettings.budgetLimit}
                                    </p>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h4 className="font-bold text-lg mb-3">✅ ฟีเจอร์ที่เปิดใช้งาน:</h4>
                                    <div className="space-y-2">
                                        {getEnabledFeatures(DEFAULT_AI_CONFIG).map((feature) => (
                                            <div key={feature.id} className="flex items-center justify-between p-3 bg-green-50 rounded">
                                                <div>
                                                    <p className="font-semibold text-gray-800">{feature.name}</p>
                                                    <p className="text-sm text-gray-600">{feature.description}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm font-semibold text-green-600">Phase {feature.phase}</p>
                                                    <p className="text-xs text-gray-600">${feature.cost.monthly}/mo</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-200 rounded-lg p-6">
                                    <h4 className="font-bold text-lg mb-3">🔒 ฟีเจอร์ที่ปิดอยู่:</h4>
                                    <div className="space-y-2">
                                        {Object.values(DEFAULT_AI_CONFIG.features)
                                            .filter(f => !f.enabled)
                                            .map((feature) => (
                                                <div key={feature.id} className="flex items-center justify-between p-3 bg-gray-50 rounded opacity-60">
                                                    <div>
                                                        <p className="font-semibold text-gray-800">{feature.name}</p>
                                                        <p className="text-sm text-gray-600">{feature.description}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-sm font-semibold text-gray-600">Phase {feature.phase}</p>
                                                        <p className="text-xs text-gray-600">${feature.cost.monthly}/mo</p>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                                    <h4 className="font-bold text-lg mb-3">ℹ️ Global Settings:</h4>
                                    <ul className="space-y-2">
                                        <li className="text-gray-700">
                                            <strong>Test Mode:</strong> {DEFAULT_AI_CONFIG.globalSettings.testMode ? '✅ Enabled' : '❌ Disabled'}
                                        </li>
                                        <li className="text-gray-700">
                                            <strong>Budget Limit:</strong> ${DEFAULT_AI_CONFIG.globalSettings.budgetLimit}/month
                                        </li>
                                        <li className="text-gray-700">
                                            <strong>Alert Threshold:</strong> {(DEFAULT_AI_CONFIG.globalSettings.alertThreshold * 100).toFixed(0)}%
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

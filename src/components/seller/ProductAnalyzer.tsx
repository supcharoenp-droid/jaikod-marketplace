import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wand2, Image as ImageIcon, X, DollarSign, Lightbulb, Type, Microscope } from 'lucide-react'

// --- Product Analyzer System Types ---

interface AnalysisScore {
    score: number
    label: 'A' | 'B' | 'C' | 'D'
    color: string
}

interface AnalysisInsight {
    type: 'warning' | 'suggestion' | 'good'
    message: string
}

interface ImageAnalysis {
    score: number
    sharpness: number
    lighting: number
    background: 'clean' | 'cluttered'
    suggestions: string[]
}

interface TitleAnalysis {
    score: number
    suggestions: string[]
}

interface PriceAnalysis {
    score: number
    marketDiffPercent: number // + or -
    recommendedPrice: number
    marketAvg: number
}

interface ProductAnalysis {
    overall: AnalysisScore
    image: ImageAnalysis
    title: TitleAnalysis
    price: PriceAnalysis
    insights: AnalysisInsight[]
    competitorRank: number // 1-100
    keywordScore: number
    descriptionScore: number
}

// Mock Generator for Product Analysis
const generateMockAnalysis = (product: any): ProductAnalysis => {
    // Randomize score for demo
    const score = Math.floor(Math.random() * 40) + 60 // 60-100
    let label: 'A' | 'B' | 'C' | 'D' = 'B'
    let color = 'text-amber-500'

    if (score >= 80) { label = 'A'; color = 'text-emerald-500' }
    else if (score >= 60) { label = 'B'; color = 'text-amber-500' }
    else if (score >= 40) { label = 'C'; color = 'text-orange-500' }
    else { label = 'D'; color = 'text-red-500' }

    return {
        overall: { score, label, color },
        image: {
            score: Math.floor(Math.random() * 30) + 70,
            sharpness: 85,
            lighting: 70,
            background: Math.random() > 0.5 ? 'clean' : 'cluttered',
            suggestions: ['รูปนี้แสงน้อย แนะนำเพิ่มความสว่าง +20%', 'ฉากหลังรบกวน การลบฉากหลังช่วยเพิ่ม CTR']
        },
        title: {
            score: Math.floor(Math.random() * 30) + 60,
            suggestions: [`${product.title || 'Product'} มือสอง สภาพนางฟ้า`, `${product.title || 'Product'} ของแท้ พร้อมส่ง`]
        },
        price: {
            score: 75,
            marketDiffPercent: 12,
            recommendedPrice: (product.price || 1000) * 0.95,
            marketAvg: (product.price || 1000) * 0.9
        },
        insights: [
            { type: 'warning', message: 'ราคาสูงกว่าคู่แข่ง 12%' },
            { type: 'suggestion', message: 'เพิ่มรูปภาพอีก 2 รูปจะช่วยเพิ่มความน่าเชื่อถือ' }
        ],
        competitorRank: Math.floor(Math.random() * 20) + 5,
        keywordScore: 65,
        descriptionScore: 80
    }
}

// --- Components: Product Analyzer ---

function AnalysisDetailPanel({ product, analysis, onClose }: { product: any, analysis: ProductAnalysis, onClose: () => void }) {
    if (!product || !analysis) return null

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        >
            <div className="bg-white dark:bg-slate-900 w-full max-w-4xl max-h-[90vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-white/50 backdrop-blur-md sticky top-0 z-10">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-2xl font-black ${analysis.overall.color}`}>{analysis.overall.label}</span>
                            <span className="text-sm font-bold text-slate-400">Score {analysis.overall.score}/100</span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Wand2 className="w-5 h-5 text-indigo-500" /> AI Check: {product.title}
                        </h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                        <X className="w-6 h-6 text-slate-400" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#F8F9FC] dark:bg-[#0F1115] no-scrollbar">

                    {/* 1. Image Analysis */}
                    <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <ImageIcon className="w-5 h-5 text-indigo-500" /> Image Analysis
                            </h3>
                            <span className="text-sm font-bold text-emerald-500">{analysis.image.score}/100</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 group h-48 bg-slate-100 dark:bg-slate-900">
                                {/* Mock Image Placeholder since real img might verify fail */}
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                    <ImageIcon className="w-12 h-12" />
                                </div>
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="bg-white text-slate-900 px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2">
                                        <Wand2 className="w-3 h-3" /> ปรับรูปด้วย AI
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-3">
                                {analysis.image.suggestions.map((suggestion, i) => (
                                    <div key={i} className="flex items-start gap-2 bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-lg border border-indigo-100 dark:border-indigo-800">
                                        <Lightbulb className="w-4 h-4 text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0" />
                                        <p className="text-xs text-indigo-800 dark:text-indigo-200">{suggestion}</p>
                                    </div>
                                ))}
                                <div className="flex gap-2 mt-4">
                                    <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">ลบฉากหลัง</button>
                                    <button className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50">แนะนำมุมถ่าย</button>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* 2. Title SEO */}
                    <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <Type className="w-5 h-5 text-indigo-500" /> Title SEO
                            </h3>
                            <span className="text-sm font-bold text-amber-500">{analysis.title.score}/100</span>
                        </div>
                        <div className="space-y-3">
                            <p className="text-sm text-slate-500 dark:text-slate-400">Current: <span className="text-slate-800 dark:text-white font-medium">{product.title}</span></p>
                            <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
                                <p className="text-xs font-bold text-slate-400 mb-2 uppercase">AI Suggestion</p>
                                {analysis.title.suggestions.map((title, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 dark:border-slate-800 last:border-0 gap-4">
                                        <span className="text-sm text-slate-700 dark:text-slate-300 font-medium truncate">{title}</span>
                                        <button className="text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-2 py-1 rounded whitespace-nowrap">ใช้ชื่อนี้</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* 3. Price Analysis */}
                    <section className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-indigo-500" /> Pricing
                            </h3>
                            <span className="text-sm font-bold text-slate-500">{analysis.price.score}/100</span>
                        </div>
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="text-center">
                                <p className="text-xs text-slate-400">ราคาของคุณ</p>
                                <p className="text-lg font-bold text-slate-800 dark:text-white">฿{product.price}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-slate-400">ราคาตลาด</p>
                                <p className="text-lg font-bold text-slate-600 dark:text-slate-400">฿{analysis.price.marketAvg.toLocaleString()}</p>
                            </div>
                            <div className="flex-1 w-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl p-3 text-white shadow-lg shadow-emerald-500/20">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs font-medium text-emerald-100">Smart Price</p>
                                        <p className="text-xl font-bold">฿{analysis.price.recommendedPrice.toLocaleString()}</p>
                                    </div>
                                    <button className="bg-white text-emerald-600 rounded-lg px-3 py-1.5 text-xs font-bold shadow-sm hover:scale-105 transition-transform">
                                        ใช้ราคานี้
                                    </button>
                                </div>
                                <p className="text-[10px] mt-1 text-emerald-100">+15% โอกาสปิดการขาย</p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-end gap-3 z-10 sticky bottom-0">
                    <button onClick={onClose} className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-sm">ปิด</button>
                    <button className="px-6 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:scale-105 transition-transform shadow-lg">
                        บันทึกการปรับปรุง
                    </button>
                </div>
            </div>
        </motion.div>
    )
}

export default function ProductAnalyzer({ products }: { products: any[] }) {
    const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
    const [analysisData, setAnalysisData] = useState<ProductAnalysis | null>(null)

    const handleAnalyze = (product: any) => {
        // In real app, fetch AI analysis here
        setAnalysisData(generateMockAnalysis(product))
        setSelectedProduct(product)
    }

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {selectedProduct && analysisData && (
                    <AnalysisDetailPanel product={selectedProduct} analysis={analysisData} onClose={() => setSelectedProduct(null)} />
                )}
            </AnimatePresence>

            {/* Analyzer Header */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[28px] p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden h-48 flex items-center">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
                <div className="relative z-10 w-full flex flex-col md:flex-row justify-between items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] font-bold tracking-wider">BETA</span>
                        </div>
                        <h2 className="text-3xl font-black flex items-center gap-2">
                            <Microscope className="w-8 h-8" /> Product Analyzer
                        </h2>
                        <p className="opacity-90 mt-1 max-w-lg text-sm leading-relaxed">AI ตรวจสอบคุณภาพสินค้าทั้งร้าน วิเคราะห์เจาะลึก 7 ด้าน พร้อมคำแนะนำที่ทำตามได้ทันที</p>
                    </div>
                </div>
                <div className="absolute right-8 bottom-8 md:bottom-auto">
                    <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:scale-105 transition-transform flex items-center gap-2">
                        <Wand2 className="w-4 h-4" /> Scan All Products
                    </button>
                </div>
            </div>

            {/* Product List */}
            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300">รายการสินค้า ({products.length})</h3>
                    <div className="text-xs text-slate-500">เรียงตาม: <span className="font-bold text-slate-700">ลำดับความสำคัญ</span></div>
                </div>

                {products.length === 0 ? (
                    <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800">
                        <ImageIcon className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                        <p className="text-slate-400">ยังไม่มีสินค้าให้ตรวจสอบ</p>
                    </div>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-center gap-4 hover:border-indigo-200 transition-colors group">
                            {/* Thumb */}
                            <div className="w-16 h-16 bg-slate-100 rounded-xl relative overflow-hidden flex-shrink-0">
                                {/* Dummy Image Icon */}
                                <div className="absolute inset-0 flex items-center justify-center text-slate-300">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                            </div>

                            {/* Info */}
                            <div className="flex-1 text-center md:text-left min-w-0 w-full">
                                <h3 className="font-bold text-slate-800 dark:text-white truncate">{product.title}</h3>
                                <p className="text-xs text-slate-500">Price: ฿{(product.price || 0).toLocaleString()} • Views: {product.views}</p>
                            </div>

                            {/* Score (Mocked Static for List) */}
                            <div className="flex items-center justify-between w-full md:w-auto gap-4 mt-2 md:mt-0">
                                <div className="text-center px-4 md:border-r border-slate-100">
                                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Overall</div>
                                    <div className="text-xl font-black text-amber-500">B</div>
                                </div>
                                <button
                                    onClick={() => handleAnalyze(product)}
                                    className="flex-1 md:flex-none bg-indigo-50 dark:bg-indigo-900/40 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-300 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2 group-hover:scale-105 transform duration-200"
                                >
                                    <Microscope className="w-4 h-4" /> วิเคราะห์
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

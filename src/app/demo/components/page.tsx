'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AIAnalysisPanel from '@/components/listing/AIAnalysisPanel'
import EnhancedUploadZone from '@/components/listing/EnhancedUploadZone'
import SmartEditField from '@/components/listing/SmartEditField'
import SEOScoreWidget, { generateSEOChecks } from '@/components/listing/SEOScoreWidget'

export default function ComponentsDemoPage() {
    // Demo state
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    // Mock data
    const mockAnalysisData = {
        confidence: 95,
        detectedObjects: [
            { name: 'พระเครื่อง', confidence: 98, category: 'พระเครื่อง' },
            { name: 'หน้าทากหมา', confidence: 95 },
            { name: 'สายสนาม', confidence: 92 },
            { name: 'กล่องใส', confidence: 88 }
        ],
        suggestions: [
            { id: '1', text: 'เพิ่มคำว่า "แท้" เพื่อเพิ่มความน่าเชื่อถือ', type: 'tip' as const },
            { id: '2', text: 'ควรถ่ายเพิ่ม 2 รูป: ด้านหลัง และ มุมใกล้ๆ', type: 'improvement' as const },
            { id: '3', text: 'แนะนำให้ระบุที่มาของพระเครื่อง', type: 'tip' as const }
        ]
    }

    const mockTitle = 'พระเครื่องหน้าทากหมา สายสนาม พร้อมกล่องใส'
    const mockDescription = `พระเครื่องหน้าทากหมา สายสนาม พร้อมกล่องใส เหมาะสำหรับผู้ที่ชื่นชอบศิลปะโบราณและเชื่อผลบุญ มีการออกแบบที่ประณีตละเอียด สร้างความรู้สึกลึกลับและมีพลังแห่งความเชื่อ รูปลักษณ์หรูหราด้วยเทคนิคการสร้างและวัสดุที่ใช้ เหมาะสำหรับผู้ที่มีความศรัทธาและชื่นชอบงานศิลป์โบราณ มาพร้อมกล่องใสครบกล่อง สภาพดีมาก ไม่มีรอยแตกหรือร้าว`

    // Simulate AI analysis
    const handleSimulateAnalysis = () => {
        setIsAnalyzing(true)
        setShowResults(false)
        setTitle('')
        setDescription('')

        // Simulate progress
        setTimeout(() => {
            setIsAnalyzing(false)
            setShowResults(true)
            setTitle(mockTitle)
            setDescription(mockDescription)
        }, 3000)
    }

    const handleRegenerate = async () => {
        // Simulate regeneration
        return new Promise<void>((resolve) => {
            setTimeout(() => {
                setTitle(mockTitle + ' (ใหม่)')
                resolve()
            }, 1000)
        })
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            {/* Header */}
            <div className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 
                       bg-clip-text text-transparent">
                        🎨 Premium Components Demo
                    </h1>
                    <p className="text-gray-400 mt-2">
                        ตัวอย่าง UI Components ใหม่สำหรับระบบ AI-Powered Marketplace
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Demo Controls */}
                <div className="mb-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                    <h2 className="text-xl font-bold text-gray-200 mb-4">🎮 Demo Controls</h2>
                    <div className="flex gap-4">
                        <button
                            onClick={handleSimulateAnalysis}
                            disabled={isAnalyzing}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                       hover:from-purple-700 hover:to-pink-700
                       rounded-lg font-medium text-white
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all shadow-lg shadow-purple-500/30"
                        >
                            {isAnalyzing ? '⏳ กำลังวิเคราะห์...' : '🚀 เริ่ม AI Analysis Demo'}
                        </button>

                        <button
                            onClick={() => {
                                setShowResults(false)
                                setTitle('')
                                setDescription('')
                            }}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 
                       rounded-lg font-medium text-white transition-colors"
                        >
                            🔄 Reset
                        </button>
                    </div>
                </div>

                {/* Main Demo Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                    {/* Left: Upload Zone (60%) */}
                    <div className="lg:col-span-3">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">
                                📤 Enhanced Upload Zone
                            </h3>
                            <p className="text-sm text-gray-500">
                                พื้นที่อัพโหลดแบบใหม่ พร้อม AI branding และ stats
                            </p>
                        </div>

                        <EnhancedUploadZone
                            onFileSelect={(files) => {
                                console.log('Files selected:', files)
                                handleSimulateAnalysis()
                            }}
                            isAnalyzing={isAnalyzing}
                            maxFiles={8}
                        />
                    </div>

                    {/* Right: AI Panel (40%) */}
                    <div className="lg:col-span-2">
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">
                                🤖 AI Analysis Panel
                            </h3>
                            <p className="text-sm text-gray-500">
                                แสดงผลการวิเคราะห์ของ AI แบบ real-time
                            </p>
                        </div>

                        <AIAnalysisPanel
                            isAnalyzing={isAnalyzing}
                            confidence={showResults ? mockAnalysisData.confidence : 0}
                            detectedObjects={showResults ? mockAnalysisData.detectedObjects : []}
                            suggestions={showResults ? mockAnalysisData.suggestions : []}
                            progress={isAnalyzing ? 65 : 0}
                        />
                    </div>
                </div>

                {/* Smart Edit Fields */}
                {showResults && (
                    <motion.div
                        className="space-y-6 mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">
                                ✨ Smart Edit Fields
                            </h3>
                            <p className="text-sm text-gray-500">
                                ฟิลด์ที่ AI สร้างให้ พร้อมปุ่มสำหรับแก้ไขและสร้างใหม่
                            </p>
                        </div>

                        {/* Title Field */}
                        <SmartEditField
                            label="ชื่อสินค้า"
                            value={title}
                            onChange={setTitle}
                            onRegenerate={handleRegenerate}
                            isAIGenerated={true}
                            maxLength={100}
                            rows={2}
                            placeholder="ชื่อสินค้า..."
                        />

                        {/* Description Field */}
                        <SmartEditField
                            label="คำอธิบาย"
                            value={description}
                            onChange={setDescription}
                            onRegenerate={async () => {
                                await new Promise(resolve => setTimeout(resolve, 1000))
                                setDescription(mockDescription + '\n\n(ปรับปรุงใหม่โดย AI)')
                            }}
                            isAIGenerated={true}
                            rows={8}
                            maxLength={2000}
                            placeholder="คำอธิบายสินค้า..."
                        />
                    </motion.div>
                )}

                {/* SEO Score Widget */}
                {showResults && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="mb-4">
                            <h3 className="text-lg font-semibold text-gray-300 mb-2">
                                📈 SEO Score Widget
                            </h3>
                            <p className="text-sm text-gray-500">
                                คะแนน SEO และคำแนะนำแบบ real-time
                            </p>
                        </div>

                        <SEOScoreWidget
                            checks={generateSEOChecks({
                                title,
                                description,
                                images: 3,
                                keywords: ['พระเครื่อง', 'หน้าทากหมา', 'สายสนาม'],
                                price: 750,
                                category: 'พระเครื่อง'
                            })}
                        />
                    </motion.div>
                )}

                {/* Info Card */}
                <motion.div
                    className="mt-8 p-6 bg-gradient-to-r from-blue-900/20 to-purple-900/20 
                     rounded-xl border border-blue-500/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <h3 className="text-lg font-bold text-blue-400 mb-3">
                        ℹ️ Component Features
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-300">
                        <div>
                            <h4 className="font-semibold text-white mb-2">🎨 Design:</h4>
                            <ul className="space-y-1 text-gray-400">
                                <li>• Premium dark mode theme</li>
                                <li>• Glass morphism effects</li>
                                <li>• Smooth gradient animations</li>
                                <li>• Purple-pink color scheme</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-2">⚡ Interactions:</h4>
                            <ul className="space-y-1 text-gray-400">
                                <li>• Framer Motion animations</li>
                                <li>• Hover & tap effects</li>
                                <li>• Real-time updates</li>
                                <li>• Smooth transitions</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-2">🤖 AI Features:</h4>
                            <ul className="space-y-1 text-gray-400">
                                <li>• Confidence score display</li>
                                <li>• Detected items list</li>
                                <li>• Smart suggestions</li>
                                <li>• Auto-fill capabilities</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-white mb-2">📊 Analytics:</h4>
                            <ul className="space-y-1 text-gray-400">
                                <li>• SEO score calculation</li>
                                <li>• Real-time validation</li>
                                <li>• Progress indicators</li>
                                <li>• Stats visualization</li>
                            </ul>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

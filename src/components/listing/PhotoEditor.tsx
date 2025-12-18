'use client'

/**
 * PhotoEditor Modal - Professional Photo Editing
 * 
 * Features:
 * - Crop
 * - Rotate
 * - Brightness/Contrast
 * - Filters
 * - Background Removal
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X, Crop, RotateCw, Sun, Wand2, Scissors,
    Check, Undo, Download, Sparkles
} from 'lucide-react'
import SimpleCropTool from './SimpleCropTool'

interface PhotoEditorProps {
    isOpen: boolean
    photo: { file: File; preview: string }
    onSave: (editedFile: File) => void
    onClose: () => void
}

export default function PhotoEditor({ isOpen, photo, onSave, onClose }: PhotoEditorProps) {
    const [activeTab, setActiveTab] = useState<'crop' | 'rotate' | 'adjust' | 'filter' | 'enhance'>('enhance')
    const [brightness, setBrightness] = useState(100)
    const [contrast, setContrast] = useState(100)
    const [saturation, setSaturation] = useState(100)
    const [sharpness, setSharpness] = useState(100)
    const [rotation, setRotation] = useState(0)
    const [selectedFilter, setSelectedFilter] = useState('none')
    const [isEnhancing, setIsEnhancing] = useState(false)

    // Crop state
    const [cropMode, setCropMode] = useState(false)
    const [cropAspect, setCropAspect] = useState<'free' | '1:1' | '4:3' | '16:9'>('free')

    const filters = [
        { id: 'none', name: 'Original', filter: '' },
        { id: 'vivid', name: 'Vivid', filter: 'saturate(1.5) contrast(1.1)' },
        { id: 'warm', name: 'Warm', filter: 'sepia(0.3) brightness(1.1)' },
        { id: 'cool', name: 'Cool', filter: 'hue-rotate(180deg) saturate(1.2)' },
        { id: 'bw', name: 'B&W', filter: 'grayscale(1) contrast(1.1)' },
        { id: 'vintage', name: 'Vintage', filter: 'sepia(0.5) contrast(0.9) brightness(1.1)' },
    ]

    // ✅ FREE Auto-Enhancement (Canvas-based)
    const handleAutoEnhance = async () => {
        setIsEnhancing(true)

        try {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')!
            const img = new Image()

            await new Promise((resolve) => {
                img.onload = resolve
                img.src = photo.preview
            })

            canvas.width = img.width
            canvas.height = img.height
            ctx.drawImage(img, 0, 0)

            // Analyze image brightness
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
            let totalBrightness = 0

            for (let i = 0; i < imageData.data.length; i += 4) {
                const r = imageData.data[i]
                const g = imageData.data[i + 1]
                const b = imageData.data[i + 2]
                totalBrightness += (r + g + b) / 3
            }

            const avgBrightness = totalBrightness / (imageData.data.length / 4)

            // Auto-adjust based on analysis
            if (avgBrightness < 100) {
                // Too dark - increase brightness
                setBrightness(110)
                setContrast(105)
            } else if (avgBrightness > 180) {
                // Too bright - decrease
                setBrightness(95)
                setContrast(110)
            } else {
                // Just right - enhance slightly
                setBrightness(105)
                setContrast(110)
            }

            setSaturation(110)
            setSharpness(105)

        } catch (error) {
            console.error('Auto-enhance error:', error)
        } finally {
            setIsEnhancing(false)
        }
    }

    const handleSave = async () => {
        // Apply all edits and create new File
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!
        const img = new Image()

        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height

            // Apply transformations with saturation
            ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${filters.find(f => f.id === selectedFilter)?.filter || ''}`

            if (rotation !== 0) {
                ctx.translate(canvas.width / 2, canvas.height / 2)
                ctx.rotate((rotation * Math.PI) / 180)
                ctx.translate(-canvas.width / 2, -canvas.height / 2)
            }

            ctx.drawImage(img, 0, 0)

            canvas.toBlob((blob) => {
                if (blob) {
                    const editedFile = new File([blob], photo.file.name, {
                        type: 'image/jpeg',
                        lastModified: Date.now()
                    })
                    onSave(editedFile)
                    onClose()
                }
            }, 'image/jpeg', 0.95)
        }

        img.src = photo.preview
    }

    if (!isOpen) return null

    return (
        <>
            <AnimatePresence>
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative w-full max-w-5xl h-[85vh] max-h-[800px] bg-gray-900 rounded-xl shadow-2xl overflow-hidden"
                        initial={{ scale: 0.9, y: 50 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 50 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-800">
                            <h2 className="text-lg font-bold text-white">แต่งรูปภาพ</h2>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex h-[calc(100%-140px)]">
                            {/* Tools Sidebar */}
                            <div className="w-64 border-r border-gray-800 p-4 space-y-4 overflow-y-auto">
                                {/* Tabs */}
                                <div className="space-y-2">
                                    {/* ✂️ Crop Button */}
                                    <button
                                        onClick={() => setCropMode(true)}
                                        className="w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors bg-gray-800 text-gray-400 hover:bg-gray-700"
                                    >
                                        <Crop className="w-5 h-5" />
                                        <span className="font-medium">ตัดรูป</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('adjust')}
                                        className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'adjust' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        <Sun className="w-5 h-5" />
                                        <span className="font-medium">ปรับแสง</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('rotate')}
                                        className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'rotate' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        <RotateCw className="w-5 h-5" />
                                        <span className="font-medium">หมุน</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('filter')}
                                        className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'filter' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        <Wand2 className="w-5 h-5" />
                                        <span className="font-medium">ฟิลเตอร์</span>
                                    </button>

                                    <button
                                        onClick={() => setActiveTab('enhance')}
                                        className={`w-full px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${activeTab === 'enhance' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                            }`}
                                    >
                                        <Sparkles className="w-5 h-5" />
                                        <span className="font-medium">ปรับอัตโนมัติ</span>
                                    </button>
                                </div>

                                {/* Controls */}
                                <div className="pt-4 border-t border-gray-800">
                                    {activeTab === 'enhance' && (
                                        <div className="space-y-4">
                                            <p className="text-sm text-gray-400">ปรับแต่งอัตโนมัติด้วย AI (ฟรี!)</p>
                                            <button
                                                onClick={handleAutoEnhance}
                                                disabled={isEnhancing}
                                                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2"
                                            >
                                                {isEnhancing ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        <span>กำลังวิเคราะห์...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <Wand2 className="w-4 h-4" />
                                                        <span>ปรับอัตโนมัติ</span>
                                                    </>
                                                )}
                                            </button>
                                            <p className="text-xs text-gray-500">
                                                AI จะวิเคราะห์และปรับแสง คอนทราสต์ และสีอัตโนมัติ
                                            </p>

                                            <div className="pt-4 border-t border-gray-700">
                                                <label className="text-sm text-gray-400 mb-2 block">ความอิ่มสี</label>
                                                <input
                                                    type="range"
                                                    min="50"
                                                    max="150"
                                                    value={saturation}
                                                    onChange={(e) => setSaturation(Number(e.target.value))}
                                                    className="w-full"
                                                />
                                                <div className="text-xs text-gray-500 mt-1">{saturation}%</div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'adjust' && (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm text-gray-400 mb-2 block">ความสว่าง</label>
                                                <input
                                                    type="range"
                                                    min="50"
                                                    max="150"
                                                    value={brightness}
                                                    onChange={(e) => setBrightness(Number(e.target.value))}
                                                    className="w-full"
                                                />
                                                <div className="text-xs text-gray-500 mt-1">{brightness}%</div>
                                            </div>

                                            <div>
                                                <label className="text-sm text-gray-400 mb-2 block">คอนทราสต์</label>
                                                <input
                                                    type="range"
                                                    min="50"
                                                    max="150"
                                                    value={contrast}
                                                    onChange={(e) => setContrast(Number(e.target.value))}
                                                    className="w-full"
                                                />
                                                <div className="text-xs text-gray-500 mt-1">{contrast}%</div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'rotate' && (
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-4 gap-2">
                                                <button
                                                    onClick={() => setRotation(0)}
                                                    className={`px-3 py-2 rounded text-sm font-medium transition-all ${rotation === 0
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
                                                        }`}
                                                >
                                                    0°
                                                </button>
                                                <button
                                                    onClick={() => setRotation(90)}
                                                    className={`px-3 py-2 rounded text-sm font-medium transition-all ${rotation === 90
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
                                                        }`}
                                                >
                                                    90°
                                                </button>
                                                <button
                                                    onClick={() => setRotation(180)}
                                                    className={`px-3 py-2 rounded text-sm font-medium transition-all ${rotation === 180
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
                                                        }`}
                                                >
                                                    180°
                                                </button>
                                                <button
                                                    onClick={() => setRotation(270)}
                                                    className={`px-3 py-2 rounded text-sm font-medium transition-all ${rotation === 270
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200 border border-gray-600'
                                                        }`}
                                                >
                                                    270°
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'filter' && (
                                        <div className="space-y-2">
                                            {filters.map((filter) => (
                                                <button
                                                    key={filter.id}
                                                    onClick={() => setSelectedFilter(filter.id)}
                                                    className={`w-full px-4 py-2 rounded-lg text-left transition-colors ${selectedFilter === filter.id
                                                        ? 'bg-purple-600 text-white'
                                                        : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                                        }`}
                                                >
                                                    {filter.name}
                                                </button>
                                            ))}
                                        </div>
                                    )}


                                </div>
                            </div>

                            {/* Preview */}
                            <div className="flex-1 flex items-center justify-center p-8 bg-gray-950 overflow-auto">
                                <div className="relative max-w-full">
                                    <img
                                        src={photo.preview}
                                        alt="Preview"
                                        className="max-w-full max-h-[50vh] object-contain rounded-lg"
                                        style={{
                                            filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) ${filters.find(f => f.id === selectedFilter)?.filter || ''
                                                }`,
                                            transform: `rotate(${rotation}deg)`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between p-4 border-t border-gray-800">
                            <button
                                onClick={() => {
                                    setBrightness(100)
                                    setContrast(100)
                                    setRotation(0)
                                    setSelectedFilter('none')
                                }}
                                className="px-4 py-2 text-gray-400 hover:text-white transition-colors flex items-center gap-2"
                            >
                                <Undo className="w-4 h-4" />
                                รีเซ็ต
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 border border-gray-600 text-gray-200 rounded-lg transition-colors font-medium"
                                >
                                    ยกเลิก
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg flex items-center gap-2 font-medium"
                                >
                                    <Check className="w-4 h-4" />
                                    บันทึก
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </AnimatePresence>

            {/* ✂️ Crop Tool Modal */}
            {cropMode && (
                <SimpleCropTool
                    imageSrc={photo.preview}
                    aspectRatio={cropAspect}
                    onCropComplete={(blob) => {
                        const file = new File([blob], photo.file.name, { type: 'image/jpeg' })
                        onSave(file)
                        setCropMode(false)
                    }}
                    onCancel={() => setCropMode(false)}
                />
            )}
        </>
    )
}

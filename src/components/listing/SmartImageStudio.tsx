
'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import {
    Camera, Upload, Sparkles, X, RotateCw, Crop, Wand2,
    Droplet, Activity, Sliders, Eraser, Move, Maximize,
    ChevronRight, CheckCircle2, AlertTriangle, Search
} from 'lucide-react'
import Image from 'next/image'
import { StudioImage } from '@/types/smart-studio'
import { mockAnalyzeImage, mockAutoArrange, mockAutoEnhance } from '@/services/mockImageStudio'

interface SmartImageStudioProps {
    initialImages?: File[]
    onImagesChange?: (urls: string[], metadata: any) => void
}

export default function SmartImageStudio({ initialImages = [], onImagesChange }: SmartImageStudioProps) {
    // --- State ---
    const [images, setImages] = useState<StudioImage[]>([])
    const [selectedId, setSelectedId] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [activeTool, setActiveTool] = useState<'none' | 'adjust' | 'crop'>('none')

    const fileInputRef = useRef<HTMLInputElement>(null)

    // Derived state
    const selectedImage = images.find(img => img.id === selectedId)

    // --- Actions ---

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return
        const files = Array.from(e.target.files)

        const newImages: StudioImage[] = files.map(f => ({
            id: Math.random().toString(36).substr(2, 9),
            file: f,
            originalUrl: URL.createObjectURL(f),
            previewUrl: URL.createObjectURL(f),
            isCover: images.length === 0, // First one is cover
            rotation: 0,
            scale: 1,
            adjustments: { brightness: 100, contrast: 100, saturation: 100, sharpness: 0 },
            status: 'analyzing'
        }))

        setImages(prev => [...prev, ...newImages])
        if (!selectedId && newImages.length > 0) setSelectedId(newImages[0].id)

        // Trigger Async Analysis
        newImages.forEach(async (img) => {
            try {
                const aiResult = await mockAnalyzeImage(img)
                setImages(prev => prev.map(p =>
                    p.id === img.id ? { ...p, aiData: aiResult, status: 'ready' } : p
                ))
            } catch (err) {
                console.error(err)
            }
        })
    }

    const handleAutoArrange = () => {
        setIsProcessing(true)
        setTimeout(() => {
            const arranged = mockAutoArrange(images)
            setImages(arranged)
            if (arranged.length > 0) setSelectedId(arranged[0].id)
            setIsProcessing(false)
        }, 1000)
    }

    const handleAutoEnhance = async () => {
        if (!selectedId) return
        setIsProcessing(true)
        const enhanced = await mockAutoEnhance(selectedImage!)
        setImages(prev => prev.map(img => img.id === selectedId ? enhanced : img))
        setIsProcessing(false)
    }

    const handleRemoveImage = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        const newImages = images.filter(i => i.id !== id)
        setImages(newImages)
        if (selectedId === id) setSelectedId(newImages[0]?.id || null)
    }

    const toggleCover = (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        setImages(prev => prev.map(img => ({ ...img, isCover: img.id === id })))
    }

    const updateAdjustment = (key: keyof StudioImage['adjustments'], value: number) => {
        if (!selectedId) return
        setImages(prev => prev.map(img =>
            img.id === selectedId ? { ...img, adjustments: { ...img.adjustments, [key]: value } } : img
        ))
    }

    const rotateImage = () => {
        if (!selectedId) return
        setImages(prev => prev.map(img =>
            img.id === selectedId ? { ...img, rotation: (img.rotation + 90) % 360 } : img
        ))
    }

    // --- Render Helpers ---

    // CSS Filter String Generation
    const getFilterString = (img: StudioImage) => {
        return `brightness(${img.adjustments.brightness}%) contrast(${img.adjustments.contrast}%) saturate(${img.adjustments.saturation}%)`
    }

    return (
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* --- Header --- */}
            <div className="px-4 py-3 border-b flex justify-between items-center bg-gray-50/50">
                <div>
                    <h2 className="font-bold text-gray-900 flex items-center gap-2">
                        <Camera className="w-5 h-5 text-purple-600" />
                        รูปภาพสินค้า
                    </h2>
                    <p className="text-xs text-gray-500 hidden md:block">ถ่าย หรือ อัปโหลด — AI จะช่วยจัดให้สวย</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-purple-700 transition"
                    >
                        <Upload className="w-3 h-3" /> เพิ่มรูป
                    </button>
                    <button
                        onClick={handleAutoArrange}
                        disabled={images.length < 2 || isProcessing}
                        className="text-xs bg-white border border-purple-200 text-purple-700 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-purple-50 transition disabled:opacity-50"
                    >
                        <Sparkles className="w-3 h-3" /> Auto-Arrange
                    </button>
                </div>
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    ref={fileInputRef}
                    className="hidden"
                    onChange={handleUpload}
                />
            </div>

            {/* --- Main Workspace --- */}
            <div className="flex flex-col md:flex-row h-[500px]">

                {/* Left: Canvas / Preview Area */}
                <div className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center p-4">
                    {selectedImage ? (
                        <div
                            className="relative shadow-2xl transition-all duration-300 ease-out"
                            style={{
                                transform: `rotate(${selectedImage.rotation}deg) scale(${selectedImage.scale})`,
                                filter: getFilterString(selectedImage)
                            }}
                        >
                            {/* Image Itself */}
                            <img
                                src={selectedImage.previewUrl}
                                alt="Preview"
                                className="max-w-full max-h-[400px] object-contain"
                            />

                            {/* Defect Overlays (Mock) */}
                            {selectedImage.aiData?.defects?.map((d, i) => (
                                <div
                                    key={i}
                                    className="absolute border-2 border-red-500 bg-red-500/10 cursor-pointer group"
                                    style={{
                                        left: `${d.box.x}%`, top: `${d.box.y}%`,
                                        width: `${d.box.w}%`, height: `${d.box.h}%`
                                    }}
                                >
                                    <div className="absolute -top-6 left-0 bg-red-600 text-white text-[10px] px-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                                        {d.type === 'scratch' ? 'รอยขีดข่วน' : 'ตำหนิ'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="text-center cursor-pointer hover:scale-105 transition-transform"
                        >
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <Camera className="w-8 h-8 text-purple-500" />
                            </div>
                            <p className="text-gray-500 font-medium">แตะเพื่อเพิ่มรูปภาพ</p>
                            <p className="text-xs text-gray-400 mt-1">AI Studio พร้อมใช้งาน</p>
                        </div>
                    )}

                    {/* Editor Toolbar (Floating) */}
                    {selectedImage && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur shadow-lg rounded-full px-4 py-2 flex items-center gap-4">
                            <button onClick={rotateImage} title="Rotate" className="p-2 hover:bg-gray-100 rounded-full">
                                <RotateCw className="w-4 h-4 text-gray-700" />
                            </button>
                            <button onClick={handleAutoEnhance} title="Auto Enhance" className="p-2 hover:bg-purple-50 rounded-full">
                                <Wand2 className="w-4 h-4 text-purple-600" />
                            </button>
                            <button onClick={() => setActiveTool(activeTool === 'adjust' ? 'none' : 'adjust')} title="Adjust" className={`p-2 rounded-full ${activeTool === 'adjust' ? 'bg-purple-100 text-purple-700' : 'hover:bg-gray-100'}`}>
                                <Sliders className="w-4 h-4" />
                            </button>
                            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-400 cursor-not-allowed" title="Remove BG (Pro)">
                                <Eraser className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Right/Bottom: Sidebar (Thumbnails + AI Info) */}
                <div className="w-full md:w-80 bg-white border-l flex flex-col h-[40%] md:h-full">

                    {/* Active Tool Panel (e.g. Adjust Sliders) */}
                    {activeTool === 'adjust' && selectedImage && (
                        <div className="p-4 border-b bg-gray-50 animate-in slide-in-from-right">
                            <div className="flex justify-between items-center mb-3">
                                <h3 className="text-xs font-bold uppercase text-gray-500">Manual Adjustments</h3>
                                <button onClick={() => setActiveTool('none')}><X className="w-3 h-3" /></button>
                            </div>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] text-gray-500 flex justify-between">Brightness <span>{selectedImage.adjustments.brightness}%</span></label>
                                    <input type="range" min="50" max="150" value={selectedImage.adjustments.brightness} onChange={(e) => updateAdjustment('brightness', Number(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-gray-500 flex justify-between">Contrast <span>{selectedImage.adjustments.contrast}%</span></label>
                                    <input type="range" min="50" max="150" value={selectedImage.adjustments.contrast} onChange={(e) => updateAdjustment('contrast', Number(e.target.value))} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* AI Analysis Panel */}
                    {selectedImage && !activeTool && (
                        <div className="p-4 border-b bg-purple-50/50">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-4 h-4 text-purple-600" />
                                <span className="text-sm font-bold text-purple-900">AI Analysis</span>
                                {selectedImage.status === 'analyzing' && <span className="text-xs text-purple-500 animate-pulse">...Analyzing</span>}
                            </div>

                            {selectedImage.aiData && (
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center bg-white p-2 rounded border border-purple-100">
                                        <span className="text-xs text-gray-500">Quality Score</span>
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${selectedImage.aiData.qualityScore >= 80 ? 'bg-green-500' : 'bg-yellow-500'}`} style={{ width: `${selectedImage.aiData.qualityScore}%` }} />
                                            </div>
                                            <span className="text-xs font-bold">{selectedImage.aiData.qualityScore}</span>
                                        </div>
                                    </div>

                                    {selectedImage.aiData.defects.length > 0 && (
                                        <div className="flex items-start gap-2 bg-red-50 p-2 rounded border border-red-100">
                                            <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5" />
                                            <div>
                                                <p className="text-xs font-bold text-red-700">ตรวจพบตำหนิ</p>
                                                <p className="text-[10px] text-red-600">AI พบรอยขีดข่วน กรุณาตรวจสอบและระบุในรายละเอียด</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-wrap gap-1">
                                        {selectedImage.aiData.suggestions.map((s, i) => (
                                            <span key={i} className="text-[10px] bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Thumbnail List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-2">
                        {images.map(img => (
                            <div
                                key={img.id}
                                onClick={() => setSelectedId(img.id)}
                                className={`flex gap-3 p-2 rounded-lg cursor-pointer border transition-all ${selectedId === img.id ? 'bg-purple-50 border-purple-300 ring-1 ring-purple-200' : 'bg-white border-gray-100 hover:border-gray-200'}`}
                            >
                                <div className="relative w-16 h-16 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                    <img src={img.previewUrl} alt="" className="w-full h-full object-cover"
                                        style={{ filter: getFilterString(img) }} /> {/* Show preview with edits */}
                                    {img.isCover && <div className="absolute bottom-0 left-0 right-0 bg-purple-600 text-white text-[8px] text-center py-0.5">Cover</div>}
                                </div>
                                <div className="flex-1 flex flex-col justify-between py-1">
                                    <div className="flex justify-between items-start">
                                        <span className="text-xs font-medium text-gray-700">Image {img.id.substr(0, 4)}</span>
                                        <button onClick={(e) => handleRemoveImage(img.id, e)} className="text-gray-300 hover:text-red-500"><X className="w-3 h-3" /></button>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {img.isCover ? (
                                            <span className="text-[10px] text-purple-600 font-medium flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Cover</span>
                                        ) : (
                                            <button onClick={(e) => toggleCover(img.id, e)} className="text-[10px] text-gray-400 hover:text-purple-600">Set Cover</button>
                                        )}
                                        {img.aiData?.qualityScore && <span className="text-[10px] bg-gray-100 px-1.5 rounded text-gray-500">QS {img.aiData.qualityScore}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Empty Space filler if few images */}
                        {images.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center text-gray-300 text-xs">
                                <p>No images yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

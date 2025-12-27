'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X,
    RotateCcw,
    RotateCw,
    FlipHorizontal,
    FlipVertical,
    Sun,
    Contrast,
    Crop,
    Check,
    Undo2,
    Download,
    ZoomIn,
    ZoomOut
} from 'lucide-react'

// ============================================
// TYPES
// ============================================
interface PhotoEditorProps {
    image: string // Base64 or URL
    onSave: (editedImage: string) => void
    onCancel: () => void
    language?: 'th' | 'en'
}

interface EditorState {
    rotation: number
    flipH: boolean
    flipV: boolean
    brightness: number
    contrast: number
    zoom: number
    cropMode: boolean
}

// ============================================
// TRANSLATIONS
// ============================================
const TRANSLATIONS = {
    th: {
        title: '📝 แก้ไขรูปภาพ',
        rotate: 'หมุน',
        rotateLeft: 'หมุนซ้าย',
        rotateRight: 'หมุนขวา',
        flip: 'พลิก',
        flipH: 'พลิกซ้าย-ขวา',
        flipV: 'พลิกบน-ล่าง',
        brightness: 'ความสว่าง',
        contrast: 'ความคมชัด',
        crop: 'ครอป',
        zoom: 'ซูม',
        reset: 'คืนค่าเดิม',
        save: 'บันทึก',
        cancel: 'ยกเลิก',
        applyCrop: 'ตกลง',
        cancelCrop: 'ยกเลิกครอป',
        cropTip: 'ลากเพื่อเลือกพื้นที่ที่ต้องการ',
        download: 'ดาวน์โหลด'
    },
    en: {
        title: '📝 Edit Photo',
        rotate: 'Rotate',
        rotateLeft: 'Rotate Left',
        rotateRight: 'Rotate Right',
        flip: 'Flip',
        flipH: 'Flip Horizontal',
        flipV: 'Flip Vertical',
        brightness: 'Brightness',
        contrast: 'Contrast',
        crop: 'Crop',
        zoom: 'Zoom',
        reset: 'Reset',
        save: 'Save',
        cancel: 'Cancel',
        applyCrop: 'Apply',
        cancelCrop: 'Cancel Crop',
        cropTip: 'Drag to select area',
        download: 'Download'
    }
}

// ============================================
// COMPONENT
// ============================================
export default function PhotoEditor({
    image,
    onSave,
    onCancel,
    language = 'th'
}: PhotoEditorProps) {
    const t = TRANSLATIONS[language]
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imageRef = useRef<HTMLImageElement | null>(null)

    // Editor state
    const [state, setState] = useState<EditorState>({
        rotation: 0,
        flipH: false,
        flipV: false,
        brightness: 100,
        contrast: 100,
        zoom: 100,
        cropMode: false
    })

    // History for undo
    const [history, setHistory] = useState<EditorState[]>([])
    const [isLoading, setIsLoading] = useState(true)

    // Load image on mount
    useEffect(() => {
        const img = new Image()
        img.crossOrigin = 'anonymous'
        img.onload = () => {
            imageRef.current = img
            setIsLoading(false)
            renderCanvas()
        }
        img.onerror = () => {
            setIsLoading(false)
            console.error('Failed to load image')
        }
        img.src = image
    }, [image])

    // Re-render canvas when state changes
    useEffect(() => {
        if (!isLoading && imageRef.current) {
            renderCanvas()
        }
    }, [state, isLoading])

    // Render image to canvas with all transformations
    const renderCanvas = useCallback(() => {
        const canvas = canvasRef.current
        const img = imageRef.current
        if (!canvas || !img) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Calculate dimensions
        const isRotated90 = state.rotation === 90 || state.rotation === 270
        const scale = state.zoom / 100

        let canvasWidth = isRotated90 ? img.height : img.width
        let canvasHeight = isRotated90 ? img.width : img.height

        // Apply scale
        canvasWidth *= scale
        canvasHeight *= scale

        canvas.width = canvasWidth
        canvas.height = canvasHeight

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        // Save context state
        ctx.save()

        // Move to center
        ctx.translate(canvas.width / 2, canvas.height / 2)

        // Apply rotation
        ctx.rotate((state.rotation * Math.PI) / 180)

        // Apply flip
        const scaleX = state.flipH ? -1 : 1
        const scaleY = state.flipV ? -1 : 1
        ctx.scale(scaleX * scale, scaleY * scale)

        // Apply brightness and contrast filters
        ctx.filter = `brightness(${state.brightness}%) contrast(${state.contrast}%)`

        // Draw image centered
        ctx.drawImage(img, -img.width / 2, -img.height / 2)

        // Restore context
        ctx.restore()
    }, [state])

    // Save current state to history
    const saveToHistory = useCallback(() => {
        setHistory(prev => [...prev.slice(-9), { ...state }])
    }, [state])

    // Handle rotation
    const handleRotate = (direction: 'left' | 'right') => {
        saveToHistory()
        setState(prev => ({
            ...prev,
            rotation: direction === 'right'
                ? (prev.rotation + 90) % 360
                : (prev.rotation - 90 + 360) % 360
        }))
    }

    // Handle flip
    const handleFlip = (axis: 'h' | 'v') => {
        saveToHistory()
        setState(prev => ({
            ...prev,
            flipH: axis === 'h' ? !prev.flipH : prev.flipH,
            flipV: axis === 'v' ? !prev.flipV : prev.flipV
        }))
    }

    // Handle brightness/contrast
    const handleSliderChange = (type: 'brightness' | 'contrast', value: number) => {
        setState(prev => ({
            ...prev,
            [type]: value
        }))
    }

    // Handle zoom
    const handleZoom = (direction: 'in' | 'out') => {
        setState(prev => ({
            ...prev,
            zoom: direction === 'in'
                ? Math.min(prev.zoom + 10, 200)
                : Math.max(prev.zoom - 10, 50)
        }))
    }

    // Reset all edits
    const handleReset = () => {
        setState({
            rotation: 0,
            flipH: false,
            flipV: false,
            brightness: 100,
            contrast: 100,
            zoom: 100,
            cropMode: false
        })
        setHistory([])
    }

    // Undo last action
    const handleUndo = () => {
        if (history.length === 0) return
        const lastState = history[history.length - 1]
        setHistory(prev => prev.slice(0, -1))
        setState(lastState)
    }

    // Save edited image
    const handleSave = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        // Export as high-quality JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
        onSave(dataUrl)
    }

    // Download edited image
    const handleDownload = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
        const link = document.createElement('a')
        link.href = dataUrl
        link.download = `edited-photo-${Date.now()}.jpg`
        link.click()
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                >
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-white/10 bg-slate-800/50 flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-white">{t.title}</h2>
                        <button
                            onClick={onCancel}
                            className="p-2 rounded-lg hover:bg-white/10 transition-colors text-gray-400 hover:text-white"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                        {/* Canvas Area */}
                        <div className="flex-1 flex items-center justify-center p-4 bg-slate-950/50 overflow-auto">
                            {isLoading ? (
                                <div className="flex flex-col items-center gap-3 text-gray-400">
                                    <div className="w-10 h-10 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                    <span>กำลังโหลดรูปภาพ...</span>
                                </div>
                            ) : (
                                <canvas
                                    ref={canvasRef}
                                    className="max-w-full max-h-[50vh] md:max-h-[60vh] rounded-lg shadow-2xl"
                                />
                            )}
                        </div>

                        {/* Tools Sidebar */}
                        <div className="w-full md:w-64 bg-slate-800/50 border-t md:border-t-0 md:border-l border-white/10 p-4 overflow-y-auto">
                            <div className="space-y-6">

                                {/* Rotate Section */}
                                <div>
                                    <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-3">{t.rotate}</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleRotate('left')}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm text-white transition-colors"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            <span className="hidden md:inline">90°</span>
                                        </button>
                                        <button
                                            onClick={() => handleRotate('right')}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm text-white transition-colors"
                                        >
                                            <RotateCw className="w-4 h-4" />
                                            <span className="hidden md:inline">90°</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Flip Section */}
                                <div>
                                    <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-3">{t.flip}</h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleFlip('h')}
                                            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${state.flipH
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-slate-700/50 hover:bg-slate-600/50 text-white'
                                                }`}
                                        >
                                            <FlipHorizontal className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleFlip('v')}
                                            className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${state.flipV
                                                ? 'bg-purple-500 text-white'
                                                : 'bg-slate-700/50 hover:bg-slate-600/50 text-white'
                                                }`}
                                        >
                                            <FlipVertical className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Brightness Section */}
                                <div>
                                    <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <Sun className="w-3 h-3" />
                                        {t.brightness}: {state.brightness}%
                                    </h3>
                                    <input
                                        type="range"
                                        min="50"
                                        max="150"
                                        value={state.brightness}
                                        onChange={(e) => handleSliderChange('brightness', parseInt(e.target.value))}
                                        onMouseUp={saveToHistory}
                                        onTouchEnd={saveToHistory}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                                    />
                                </div>

                                {/* Contrast Section */}
                                <div>
                                    <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                                        <Contrast className="w-3 h-3" />
                                        {t.contrast}: {state.contrast}%
                                    </h3>
                                    <input
                                        type="range"
                                        min="50"
                                        max="150"
                                        value={state.contrast}
                                        onChange={(e) => handleSliderChange('contrast', parseInt(e.target.value))}
                                        onMouseUp={saveToHistory}
                                        onTouchEnd={saveToHistory}
                                        className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                </div>

                                {/* Zoom Section */}
                                <div>
                                    <h3 className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                                        {t.zoom}: {state.zoom}%
                                    </h3>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            onClick={() => handleZoom('out')}
                                            disabled={state.zoom <= 50}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ZoomOut className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleZoom('in')}
                                            disabled={state.zoom >= 200}
                                            className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            <ZoomIn className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="pt-4 border-t border-white/10 space-y-2">
                                    <button
                                        onClick={handleUndo}
                                        disabled={history.length === 0}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Undo2 className="w-4 h-4" />
                                        {t.reset} ({history.length})
                                    </button>
                                    <button
                                        onClick={handleReset}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 rounded-lg text-sm text-orange-400 transition-colors"
                                    >
                                        <RotateCcw className="w-4 h-4" />
                                        {t.reset}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="px-5 py-4 border-t border-white/10 bg-slate-800/50 flex items-center justify-between gap-3">
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm text-white transition-colors"
                        >
                            <Download className="w-4 h-4" />
                            {t.download}
                        </button>
                        <div className="flex gap-3">
                            <button
                                onClick={onCancel}
                                className="px-6 py-2 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-sm text-white transition-colors"
                            >
                                {t.cancel}
                            </button>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-lg text-sm text-white font-medium transition-colors"
                            >
                                <Check className="w-4 h-4" />
                                {t.save}
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}

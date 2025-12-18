'use client'

import { useState, useRef, useEffect, MouseEvent as ReactMouseEvent, TouchEvent as ReactTouchEvent } from 'react'
import {
    X, RotateCw, Crop as CropIcon, ZoomIn,
    Sun, Check, Wand2, RefreshCcw, Scissors, Move
} from 'lucide-react'

interface ImageEditorProps {
    image: string
    onSave: (editedImage: string) => void
    onCancel: () => void
}

export default function ImageEditor({ image, onSave, onCancel }: ImageEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Image State
    const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
    const [workingImage, setWorkingImage] = useState<HTMLImageElement | null>(null)

    // Transform State
    const [rotation, setRotation] = useState(0)
    const [brightness, setBrightness] = useState(100)
    const [zoom, setZoom] = useState(1)
    const [pan, setPan] = useState({ x: 0, y: 0 })

    // Crop State
    const [mode, setMode] = useState<'view' | 'crop'>('view')
    const [cropRect, setCropRect] = useState<{ x: number, y: number, w: number, h: number } | null>(null)
    const [isDragging, setIsDragging] = useState(false)
    const dragStart = useRef<{ x: number, y: number } | null>(null)

    // Load Image
    useEffect(() => {
        const img = new window.Image()
        img.crossOrigin = "anonymous"
        img.src = image
        img.onload = () => {
            setOriginalImage(img)
            setWorkingImage(img)
        }
    }, [image])

    // Main Draw Function
    const draw = () => {
        const canvas = canvasRef.current
        const container = containerRef.current
        if (!canvas || !workingImage || !container) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // 1. Set Canvas Size to match Container (Responsive)
        // We want the canvas to fill the available space but maintain aspect ratio?
        // Actually, simplest is to make canvas full resolution of image, 
        // and use CSS to scale it down to fit container.
        // BUT for cropping interaction, 1:1 pixel mapping is easiest if we control display size.

        // Let's set canvas to image resolution
        canvas.width = workingImage.width
        canvas.height = workingImage.height

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        ctx.save()

        // --- Apply Filters & Transforms ---
        const cx = canvas.width / 2
        const cy = canvas.height / 2

        ctx.translate(cx, cy)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.scale(zoom, zoom)
        ctx.translate(pan.x, pan.y) // Pan is opposite to camera move
        ctx.translate(-cx, -cy)

        ctx.filter = `brightness(${brightness}%)`

        ctx.drawImage(workingImage, 0, 0)

        ctx.restore()

        // --- Draw Crop Overlay (If in Crop Mode) ---
        if (mode === 'crop' && cropRect) {
            // Draw semi-transparent dim layer
            ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Cut out the selection
            // We can't easily "erase" the dim layer without erasing image in Canvas 2D simply.
            // Technique: Draw Image again inside the rect clipped.

            ctx.save()
            ctx.beginPath()
            ctx.rect(cropRect.x, cropRect.y, cropRect.w, cropRect.h)
            ctx.clip()

            // Re-draw image inside clip
            ctx.translate(cx, cy)
            ctx.rotate((rotation * Math.PI) / 180)
            ctx.scale(zoom, zoom)
            ctx.translate(pan.x, pan.y)
            ctx.translate(-cx, -cy)
            ctx.filter = `brightness(${brightness}%)`
            ctx.drawImage(workingImage, 0, 0)

            ctx.restore()

            // Draw Border
            ctx.strokeStyle = '#fff'
            ctx.lineWidth = 2 / zoom // Keep line width consistent
            ctx.strokeRect(cropRect.x, cropRect.y, cropRect.w, cropRect.h)

            // Draw Corners
            const s = 10 / zoom
            ctx.fillStyle = '#fff'
            ctx.fillRect(cropRect.x - s / 2, cropRect.y - s / 2, s, s)
            ctx.fillRect(cropRect.x + cropRect.w - s / 2, cropRect.y + cropRect.h - s / 2, s, s)
        }
    }

    // Redraw whenever state changes
    useEffect(() => {
        requestAnimationFrame(draw)
    }, [workingImage, rotation, brightness, zoom, pan, mode, cropRect])

    // --- Interaction Handlers ---

    const getCanvasPoint = (e: ReactMouseEvent | ReactTouchEvent) => {
        const canvas = canvasRef.current
        if (!canvas) return { x: 0, y: 0 }

        const rect = canvas.getBoundingClientRect()
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as ReactMouseEvent).clientX
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as ReactMouseEvent).clientY

        // Map client coords to canvas pixel coords
        const scaleX = canvas.width / rect.width
        const scaleY = canvas.height / rect.height

        return {
            x: (clientX - rect.left) * scaleX,
            y: (clientY - rect.top) * scaleY
        }
    }

    const handlePointerDown = (e: ReactMouseEvent | ReactTouchEvent) => {
        setIsDragging(true)
        const pt = getCanvasPoint(e)
        dragStart.current = pt

        if (mode === 'crop') {
            // Start new crop rect
            setCropRect({ x: pt.x, y: pt.y, w: 0, h: 0 })
        }
    }

    const handlePointerMove = (e: ReactMouseEvent | ReactTouchEvent) => {
        if (!isDragging || !dragStart.current) return
        e.preventDefault() // prevent scroll
        const pt = getCanvasPoint(e)

        if (mode === 'crop') {
            // Update crop rect
            const w = pt.x - dragStart.current.x
            const h = pt.y - dragStart.current.y

            // Normalize rect (handle negative width/height)
            setCropRect({
                x: w < 0 ? pt.x : dragStart.current.x,
                y: h < 0 ? pt.y : dragStart.current.y,
                w: Math.abs(w),
                h: Math.abs(h)
            })
        } else {
            // Pan logic (if zoomed) - Simplified: Just pan for now
            // Panning in canvas coordinates needs to account for zoom?
            // Actually let's just allow panning if zoom > 1
            if (zoom > 1) {
                // Warning: Panning implementation on canvas with rotation is complex math.
                // For this MVP, let's skip Pan allowing only Zoom center.
                // Or implementing simple delta.

                // const deltaX = (pt.x - dragStart.current.x) / zoom
                // const deltaY = (pt.y - dragStart.current.y) / zoom
                // setPan(prev => ({ x: prev.x + deltaX, y: prev.y + deltaY }))
                // dragStart.current = pt // reset for next delta
            }
        }
    }

    const handlePointerUp = () => {
        setIsDragging(false)
        dragStart.current = null
    }

    // --- Actions ---

    const applyCrop = () => {
        if (!cropRect || !workingImage || cropRect.w < 10 || cropRect.h < 10) return

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        canvas.width = cropRect.w
        canvas.height = cropRect.h

        // We need to capture exact pixels from the RENDERED state?
        // Or just the raw image?
        // IF we rotate, the crop rect is relative to the rotated canvas??
        // NO, the way we drew it:
        // `draw` applies transforms THEN draws image.
        // But our `getCanvasPoint` gets coordinates in the Transformed Space? NO.
        // It gets coordinates in the Canvas Pixel Space.

        // Actually, because we draw the image transformed inside the canvas, 
        // the `cropRect` coordinates are relative to the CANVAS bounds, not the original image.
        // So we can simply "snapshot" the canvas.

        const mainCanvas = canvasRef.current
        if (!mainCanvas) return

        // Draw the main canvas onto temp canvas (cropped)
        // Note: Main canvas currently has the Dim Overlay and Border drawn on it if we snapshot it directly!
        // We must re-render the main canvas CLEANLY without overlay first.

        const mainCtx = mainCanvas.getContext('2d')!

        // 1. Clear and Draw Clean Image (Transform applied)
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)
        mainCtx.save()
        const cx = mainCanvas.width / 2
        const cy = mainCanvas.height / 2
        mainCtx.translate(cx, cy)
        mainCtx.rotate((rotation * Math.PI) / 180)
        mainCtx.scale(zoom, zoom)
        mainCtx.translate(pan.x, pan.y)
        mainCtx.translate(-cx, -cy)
        mainCtx.filter = `brightness(${brightness}%)`
        mainCtx.drawImage(workingImage, 0, 0)
        mainCtx.restore()

        // 2. Snapshot
        ctx.drawImage(
            mainCanvas,
            cropRect.x, cropRect.y, cropRect.w, cropRect.h,
            0, 0, cropRect.w, cropRect.h
        )

        // 3. Update Working Image
        const newImg = new window.Image()
        newImg.onload = () => {
            setWorkingImage(newImg)
            // Reset transforms as they are baked in
            setRotation(0)
            setZoom(1)
            setPan({ x: 0, y: 0 })
            setBrightness(100)
            setMode('view')
            setCropRect(null)
        }
        newImg.src = canvas.toDataURL()
    }

    const removeBg = () => {
        if (!workingImage) return
        const canvas = document.createElement('canvas')
        canvas.width = workingImage.width
        canvas.height = workingImage.height
        const ctx = canvas.getContext('2d')!
        ctx.drawImage(workingImage, 0, 0)

        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const d = imgData.data
        // Simple white removal
        for (let i = 0; i < d.length; i += 4) {
            const r = d[i], g = d[i + 1], b = d[i + 2]
            if (r > 200 && g > 200 && b > 200) d[i + 3] = 0
        }
        ctx.putImageData(imgData, 0, 0)

        const newImg = new window.Image()
        newImg.onload = () => setWorkingImage(newImg)
        newImg.src = canvas.toDataURL()
    }

    const saveFinal = () => {
        if (!canvasRef.current) return
        // Ensure clean draw
        draw()
        // Wait for draw? (React useEffect will handle it but here strictly sync might be safer)
        // Let's manually trigger one clean draw without overlays
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')!
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.save()
        const cx = canvas.width / 2
        const cy = canvas.height / 2
        ctx.translate(cx, cy)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.scale(zoom, zoom)
        ctx.translate(pan.x, pan.y)
        ctx.translate(-cx, -cy)
        ctx.filter = `brightness(${brightness}%)`
        ctx.drawImage(workingImage!, 0, 0)
        ctx.restore()

        onSave(canvas.toDataURL('image/png'))
    }

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col h-[100dvh]">
            {/* Header */}
            <div className="h-14 px-4 flex items-center justify-between text-white shrink-0">
                <h3 className="font-bold">Image Editor</h3>
                <button onClick={onSave} className="text-white p-2">
                    <X className="w-6 h-6" onClick={onCancel} />
                </button>
            </div>

            {/* Workspace */}
            <div className="flex-1 relative bg-gray-900 overflow-hidden flex items-center justify-center p-4">
                <div ref={containerRef} className="relative w-full h-full flex items-center justify-center">
                    <canvas
                        ref={canvasRef}
                        onMouseDown={handlePointerDown}
                        onMouseMove={handlePointerMove}
                        onMouseUp={handlePointerUp}
                        onMouseLeave={handlePointerUp}
                        onTouchStart={handlePointerDown}
                        onTouchMove={handlePointerMove}
                        onTouchEnd={handlePointerUp}
                        className="max-w-full max-h-full object-contain shadow-2xl"
                        style={{ touchAction: 'none' }} // Critical for preventing scroll
                    />

                    {/* Mode Indicator */}
                    {mode === 'crop' && (
                        <div className="absolute top-4 bg-purple-600 text-white px-4 py-1 rounded-full text-sm shadow-lg pointer-events-none">
                            ลากเพื่อเลือกพื้นที่ตัด (Crop Mode)
                        </div>
                    )}
                </div>
            </div>

            {/* Controls */}
            <div className="bg-gray-800 p-4 shrink-0 pb-8 rounded-t-2xl space-y-4">

                {/* Sliders Row */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Brightness */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                            <Sun className="w-3 h-3" /> <span>แสง: {brightness}%</span>
                        </div>
                        <input
                            type="range" min="50" max="150"
                            value={brightness} onChange={e => setBrightness(Number(e.target.value))}
                            className="w-full accent-purple-500 h-1 bg-gray-600 rounded-lg appearance-none"
                        />
                    </div>
                    {/* Zoom */}
                    <div className="space-y-1">
                        <div className="flex justify-between text-xs text-gray-400">
                            <ZoomIn className="w-3 h-3" /> <span>ซูม: {Math.round(zoom * 100)}%</span>
                        </div>
                        <input
                            type="range" min="0.5" max="3" step="0.1"
                            value={zoom} onChange={e => setZoom(Number(e.target.value))}
                            className="w-full accent-purple-500 h-1 bg-gray-600 rounded-lg appearance-none"
                        />
                    </div>
                </div>

                {/* Toolbar */}
                <div className="flex items-center justify-center gap-6 pt-2">
                    {mode === 'view' ? (
                        <>
                            <ControlBtn icon={CropIcon} label="Crop" onClick={() => setMode('crop')} />
                            <ControlBtn icon={RotateCw} label="หมุน" onClick={() => setRotation(r => r + 90)} />
                            <ControlBtn icon={Wand2} label="ลบพื้น" onClick={removeBg} />
                            <ControlBtn icon={RefreshCcw} label="รีเซ็ต" onClick={() => {
                                setWorkingImage(originalImage)
                                setRotation(0)
                                setBrightness(100)
                                setZoom(1)
                            }} color="text-red-400" />
                        </>
                    ) : (
                        // Crop Mode Controls
                        <>
                            <button
                                onClick={() => setMode('view')}
                                className="flex-1 py-3 text-gray-300 font-medium bg-gray-700 rounded-xl"
                            >
                                ยกเลิก
                            </button>
                            <button
                                onClick={applyCrop}
                                className="flex-1 py-3 text-white font-bold bg-purple-600 rounded-xl flex items-center justify-center gap-2"
                            >
                                <Scissors className="w-5 h-5" /> ตัดภาพ
                            </button>
                        </>
                    )}
                </div>

                {/* Main Confirm (Only in View Mode) */}
                {mode === 'view' && (
                    <button
                        onClick={saveFinal}
                        className="w-full py-3 bg-white text-black font-bold rounded-xl mt-2 flex items-center justify-center gap-2"
                    >
                        <Check className="w-5 h-5" /> บันทึกรูปภาพนี้
                    </button>
                )}
            </div>
        </div>
    )
}

function ControlBtn({ icon: Icon, label, onClick, color = 'text-gray-300' }: any) {
    return (
        <button onClick={onClick} className={`flex flex-col items-center gap-1 ${color}`}>
            <div className="p-3 bg-gray-700 rounded-full hover:bg-gray-600">
                <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px]">{label}</span>
        </button>
    )
}

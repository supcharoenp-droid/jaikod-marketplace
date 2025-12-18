'use client'

/**
 * SimpleCropTool - Pure CSS/Canvas Image Cropper with Resize Handles
 * No external dependencies needed!
 */

import { useState, useRef, useEffect } from 'react'
import { X } from 'lucide-react'

interface SimpleCropToolProps {
    imageSrc: string
    onCropComplete: (croppedBlob: Blob) => void
    onCancel: () => void
    aspectRatio?: 'free' | '1:1' | '4:3' | '16:9'
}

type ResizeHandle = 'nw' | 'ne' | 'sw' | 'se' | 'n' | 's' | 'e' | 'w' | null

export default function SimpleCropTool({
    imageSrc,
    onCropComplete,
    onCancel,
    aspectRatio = 'free'
}: SimpleCropToolProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const imageRef = useRef<HTMLImageElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    const [cropArea, setCropArea] = useState({
        x: 50,
        y: 50,
        width: 200,
        height: 200
    })

    const [isDragging, setIsDragging] = useState(false)
    const [isResizing, setIsResizing] = useState(false)
    const [resizeHandle, setResizeHandle] = useState<ResizeHandle>(null)
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, cropX: 0, cropY: 0, cropW: 0, cropH: 0 })
    const [selectedAspect, setSelectedAspect] = useState(aspectRatio)

    // Handle global mouse events for better UX
    useEffect(() => {
        const handleGlobalMouseMove = (e: MouseEvent) => {
            if (!isDragging && !isResizing) return

            const canvas = canvasRef.current
            if (!canvas) return

            const rect = canvas.getBoundingClientRect()
            const x = e.clientX - rect.left
            const y = e.clientY - rect.top
            const dx = x - dragStart.x
            const dy = y - dragStart.y

            if (isResizing && resizeHandle) {
                let newX = dragStart.cropX
                let newY = dragStart.cropY
                let newW = dragStart.cropW
                let newH = dragStart.cropH

                const ratio = getAspectRatio()

                // Handle resizing
                switch (resizeHandle) {
                    case 'se': newW = Math.max(50, dragStart.cropW + dx); newH = ratio ? newW / ratio : Math.max(50, dragStart.cropH + dy); break
                    case 'sw': newW = Math.max(50, dragStart.cropW - dx); newH = ratio ? newW / ratio : Math.max(50, dragStart.cropH + dy); newX = dragStart.cropX + (dragStart.cropW - newW); break
                    case 'ne': newW = Math.max(50, dragStart.cropW + dx); newH = ratio ? newW / ratio : Math.max(50, dragStart.cropH - dy); newY = dragStart.cropY + (dragStart.cropH - newH); break
                    case 'nw': newW = Math.max(50, dragStart.cropW - dx); newH = ratio ? newW / ratio : Math.max(50, dragStart.cropH - dy); newX = dragStart.cropX + (dragStart.cropW - newW); newY = dragStart.cropY + (dragStart.cropH - newH); break
                    case 'e': newW = Math.max(50, dragStart.cropW + dx); if (ratio) newH = newW / ratio; break
                    case 'w': newW = Math.max(50, dragStart.cropW - dx); newX = dragStart.cropX + (dragStart.cropW - newW); if (ratio) newH = newW / ratio; break
                    case 's': newH = Math.max(50, dragStart.cropH + dy); if (ratio) newW = newH * ratio; break
                    case 'n': newH = Math.max(50, dragStart.cropH - dy); newY = dragStart.cropY + (dragStart.cropH - newH); if (ratio) newW = newH * ratio; break
                }

                // Constrain to canvas
                newX = Math.max(0, Math.min(newX, rect.width - newW))
                newY = Math.max(0, Math.min(newY, rect.height - newH))
                newW = Math.min(newW, rect.width - newX)
                newH = Math.min(newH, rect.height - newY)

                setCropArea({ x: newX, y: newY, width: newW, height: newH })
            } else if (isDragging) {
                let newX = dragStart.cropX + dx
                let newY = dragStart.cropY + dy

                newX = Math.max(0, Math.min(newX, rect.width - cropArea.width))
                newY = Math.max(0, Math.min(newY, rect.height - cropArea.height))

                setCropArea(prev => ({ ...prev, x: newX, y: newY }))
            }
        }

        const handleGlobalMouseUp = () => {
            setIsDragging(false)
            setIsResizing(false)
            setResizeHandle(null)
        }

        if (isDragging || isResizing) {
            window.addEventListener('mousemove', handleGlobalMouseMove)
            window.addEventListener('mouseup', handleGlobalMouseUp)
        }

        return () => {
            window.removeEventListener('mousemove', handleGlobalMouseMove)
            window.removeEventListener('mouseup', handleGlobalMouseUp)
        }
    }, [isDragging, isResizing, dragStart, resizeHandle, cropArea, selectedAspect])

    // Calculate aspect ratio
    const getAspectRatio = () => {
        switch (selectedAspect) {
            case '1:1': return 1
            case '4:3': return 4 / 3
            case '16:9': return 16 / 9
            default: return null
        }
    }

    // Check if click is on resize handle
    const getResizeHandle = (e: React.MouseEvent, rect: DOMRect): ResizeHandle => {
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const handleSize = 10

        // Check corners first
        if (Math.abs(x - cropArea.x) < handleSize && Math.abs(y - cropArea.y) < handleSize) return 'nw'
        if (Math.abs(x - (cropArea.x + cropArea.width)) < handleSize && Math.abs(y - cropArea.y) < handleSize) return 'ne'
        if (Math.abs(x - cropArea.x) < handleSize && Math.abs(y - (cropArea.y + cropArea.height)) < handleSize) return 'sw'
        if (Math.abs(x - (cropArea.x + cropArea.width)) < handleSize && Math.abs(y - (cropArea.y + cropArea.height)) < handleSize) return 'se'

        // Check edges
        if (Math.abs(x - cropArea.x) < handleSize && y > cropArea.y && y < cropArea.y + cropArea.height) return 'w'
        if (Math.abs(x - (cropArea.x + cropArea.width)) < handleSize && y > cropArea.y && y < cropArea.y + cropArea.height) return 'e'
        if (Math.abs(y - cropArea.y) < handleSize && x > cropArea.x && x < cropArea.x + cropArea.width) return 'n'
        if (Math.abs(y - (cropArea.y + cropArea.height)) < handleSize && x > cropArea.x && x < cropArea.x + cropArea.width) return 's'

        // Check if inside crop area
        if (x > cropArea.x && x < cropArea.x + cropArea.width &&
            y > cropArea.y && y < cropArea.y + cropArea.height) {
            return null // Inside - for dragging
        }

        return null
    }

    // Handle mouse down
    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent canvas from receiving event

        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top

        const handle = getResizeHandle(e, rect)

        if (handle) {
            setIsResizing(true)
            setResizeHandle(handle)
        } else if (x > cropArea.x && x < cropArea.x + cropArea.width &&
            y > cropArea.y && y < cropArea.y + cropArea.height) {
            setIsDragging(true)
        }

        setDragStart({
            x,
            y,
            cropX: cropArea.x,
            cropY: cropArea.y,
            cropW: cropArea.width,
            cropH: cropArea.height
        })
    }

    // Handle mouse move
    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = canvasRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const dx = x - dragStart.x
        const dy = y - dragStart.y

        if (isResizing && resizeHandle) {
            let newX = dragStart.cropX
            let newY = dragStart.cropY
            let newW = dragStart.cropW
            let newH = dragStart.cropH

            const ratio = getAspectRatio()

            // Handle resizing
            switch (resizeHandle) {
                case 'se': // Southeast (bottom-right)
                    newW = Math.max(50, dragStart.cropW + dx)
                    newH = ratio ? newW / ratio : Math.max(50, dragStart.cropH + dy)
                    break
                case 'sw': // Southwest (bottom-left)
                    newW = Math.max(50, dragStart.cropW - dx)
                    newH = ratio ? newW / ratio : Math.max(50, dragStart.cropH + dy)
                    newX = dragStart.cropX + (dragStart.cropW - newW)
                    break
                case 'ne': // Northeast (top-right)
                    newW = Math.max(50, dragStart.cropW + dx)
                    newH = ratio ? newW / ratio : Math.max(50, dragStart.cropH - dy)
                    newY = dragStart.cropY + (dragStart.cropH - newH)
                    break
                case 'nw': // Northwest (top-left)
                    newW = Math.max(50, dragStart.cropW - dx)
                    newH = ratio ? newW / ratio : Math.max(50, dragStart.cropH - dy)
                    newX = dragStart.cropX + (dragStart.cropW - newW)
                    newY = dragStart.cropY + (dragStart.cropH - newH)
                    break
                case 'e': // East (right)
                    newW = Math.max(50, dragStart.cropW + dx)
                    if (ratio) newH = newW / ratio
                    break
                case 'w': // West (left)
                    newW = Math.max(50, dragStart.cropW - dx)
                    newX = dragStart.cropX + (dragStart.cropW - newW)
                    if (ratio) newH = newW / ratio
                    break
                case 's': // South (bottom)
                    newH = Math.max(50, dragStart.cropH + dy)
                    if (ratio) newW = newH * ratio
                    break
                case 'n': // North (top)
                    newH = Math.max(50, dragStart.cropH - dy)
                    newY = dragStart.cropY + (dragStart.cropH - newH)
                    if (ratio) newW = newH * ratio
                    break
            }

            // Constrain to canvas
            newX = Math.max(0, Math.min(newX, rect.width - newW))
            newY = Math.max(0, Math.min(newY, rect.height - newH))
            newW = Math.min(newW, rect.width - newX)
            newH = Math.min(newH, rect.height - newY)

            setCropArea({ x: newX, y: newY, width: newW, height: newH })
        } else if (isDragging) {
            // Dragging
            let newX = dragStart.cropX + dx
            let newY = dragStart.cropY + dy

            // Constrain to canvas bounds
            newX = Math.max(0, Math.min(newX, rect.width - cropArea.width))
            newY = Math.max(0, Math.min(newY, rect.height - cropArea.height))

            setCropArea(prev => ({ ...prev, x: newX, y: newY }))
        }
    }

    // Handle mouse up
    const handleMouseUp = () => {
        setIsDragging(false)
        setIsResizing(false)
        setResizeHandle(null)
    }

    // Handle crop
    const handleCrop = () => {
        const canvas = canvasRef.current
        const image = imageRef.current
        if (!canvas || !image) return

        // Create output canvas
        const outputCanvas = document.createElement('canvas')
        const ctx = outputCanvas.getContext('2d')!

        // Calculate scale
        const scaleX = image.naturalWidth / canvas.width
        const scaleY = image.naturalHeight / canvas.height

        // Set output size
        outputCanvas.width = cropArea.width * scaleX
        outputCanvas.height = cropArea.height * scaleY

        // Draw cropped image
        ctx.drawImage(
            image,
            cropArea.x * scaleX,
            cropArea.y * scaleY,
            cropArea.width * scaleX,
            cropArea.height * scaleY,
            0,
            0,
            outputCanvas.width,
            outputCanvas.height
        )

        // Convert to blob
        outputCanvas.toBlob((blob) => {
            if (blob) onCropComplete(blob)
        }, 'image/jpeg', 0.95)
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
            <div className="bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">✂️ ตัดรูป</h2>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                {/* Aspect Ratio Selector */}
                <div className="p-4 border-b border-gray-800">
                    <p className="text-sm text-gray-400 mb-2">อัตราส่วน:</p>
                    <div className="flex gap-2">
                        {(['free', '1:1', '4:3', '16:9'] as const).map((aspect) => (
                            <button
                                key={aspect}
                                onClick={() => {
                                    setSelectedAspect(aspect)
                                    // Adjust crop area for new aspect ratio
                                    if (aspect !== 'free') {
                                        const ratio = aspect === '1:1' ? 1 : aspect === '4:3' ? 4 / 3 : 16 / 9
                                        setCropArea(prev => ({
                                            ...prev,
                                            height: prev.width / ratio
                                        }))
                                    }
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedAspect === aspect
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                                    }`}
                            >
                                {aspect === 'free' ? 'อิสระ' : aspect}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="p-4">
                    <div className="relative inline-block">
                        <canvas
                            ref={canvasRef}
                            width={800}
                            height={600}
                            className="max-w-full h-auto bg-gray-800"
                        />

                        {/* Crop Overlay */}
                        <div
                            className="absolute border-2 border-white shadow-lg"
                            style={{
                                left: `${cropArea.x}px`,
                                top: `${cropArea.y}px`,
                                width: `${cropArea.width}px`,
                                height: `${cropArea.height}px`,
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                        >
                            {/* Grid Lines */}
                            <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="border border-white/30" />
                                ))}
                            </div>

                            {/* Resize Handles */}
                            {/* Corner Handles */}
                            <div
                                className="absolute w-3 h-3 bg-white border-2 border-purple-500 rounded-full -top-1.5 -left-1.5 cursor-nw-resize z-10"
                                onMouseDown={handleMouseDown}
                            />
                            <div
                                className="absolute w-3 h-3 bg-white border-2 border-purple-500 rounded-full -top-1.5 -right-1.5 cursor-ne-resize z-10"
                                onMouseDown={handleMouseDown}
                            />
                            <div
                                className="absolute w-3 h-3 bg-white border-2 border-purple-500 rounded-full -bottom-1.5 -left-1.5 cursor-sw-resize z-10"
                                onMouseDown={handleMouseDown}
                            />
                            <div
                                className="absolute w-3 h-3 bg-white border-2 border-purple-500 rounded-full -bottom-1.5 -right-1.5 cursor-se-resize z-10"
                                onMouseDown={handleMouseDown}
                            />

                            {/* Edge Handles */}
                            <div
                                className="absolute w-3 h-3 bg-white border-2 border-purple-500 rounded-full top-1/2 -left-1.5 -translate-y-1/2 cursor-w-resize z-10"
                                onMouseDown={handleMouseDown}
                            />
                            <div
                                className="absolute w-3 h-3 bg-white border-2 border-purple-500 rounded-full top-1/2 -right-1.5 -translate-y-1/2 cursor-e-resize z-10"
                                onMouseDown={handleMouseDown}
                            />
                            <div
                                className="absolute w-3 h-3 bg-white border-2 border-purple-500 rounded-full left-1/2 -top-1.5 -translate-x-1/2 cursor-n-resize z-10"
                                onMouseDown={handleMouseDown}
                            />
                            <div
                                className="absolute w-3 h-3 bg-white border-2 border-purple-500 rounded-full left-1/2 -bottom-1.5 -translate-x-1/2 cursor-s-resize z-10"
                                onMouseDown={handleMouseDown}
                            />
                        </div>

                        {/* Hidden Image for Loading */}
                        <img
                            ref={imageRef}
                            src={imageSrc}
                            alt="Crop preview"
                            className="hidden"
                            onLoad={(e) => {
                                const img = e.currentTarget
                                const canvas = canvasRef.current
                                if (!canvas) return

                                const ctx = canvas.getContext('2d')!
                                const scale = Math.min(
                                    canvas.width / img.naturalWidth,
                                    canvas.height / img.naturalHeight
                                )

                                const width = img.naturalWidth * scale
                                const height = img.naturalHeight * scale
                                const x = (canvas.width - width) / 2
                                const y = (canvas.height - height) / 2

                                ctx.clearRect(0, 0, canvas.width, canvas.height)
                                ctx.drawImage(img, x, y, width, height)

                                // Set initial crop area
                                setCropArea({
                                    x: width * 0.1,
                                    y: height * 0.1,
                                    width: width * 0.8,
                                    height: height * 0.8
                                })
                            }}
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="p-4 border-t border-gray-800 flex gap-3 justify-end">
                    <button
                        onClick={onCancel}
                        className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                        ยกเลิก
                    </button>
                    <button
                        onClick={handleCrop}
                        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    >
                        ✂️ ตัดรูป
                    </button>
                </div>
            </div>
        </div>
    )
}

'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, X, Edit, Image as ImageIcon, Sparkles, MonitorSmartphone } from 'lucide-react'
import Image from 'next/image'
import ImageEditor from './ImageEditor'

interface ImageUploadGridProps {
    images: string[]
    onImagesChange: (images: string[]) => void
    maxImages?: number
}

export default function ImageUploadGrid({
    images,
    onImagesChange,
    maxImages = 10
}: ImageUploadGridProps) {
    const [editingImage, setEditingImage] = useState<{ index: number; image: string } | null>(null)
    const [showWebcam, setShowWebcam] = useState(false) // Toggle for Webcam Modal
    const fileInputRef = useRef<HTMLInputElement>(null)
    const cameraInputRef = useRef<HTMLInputElement>(null)
    const videoRef = useRef<HTMLVideoElement>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files) return

        const remainingSlots = maxImages - images.length
        const filesToProcess = Array.from(files).slice(0, remainingSlots)

        filesToProcess.forEach(file => {
            if (file.size > 5 * 1024 * 1024) {
                alert('รูปภาพต้องมีขนาดไม่เกิน 5MB')
                return
            }
            if (!file.type.startsWith('image/')) {
                alert('กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น')
                return
            }

            const reader = new FileReader()
            reader.onloadend = () => {
                onImagesChange([...images, reader.result as string])
            }
            reader.readAsDataURL(file)
        })
    }

    // --- Webcam Logic (Restored for Desktop) ---
    const startWebcam = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            })
            setStream(mediaStream)
            setShowWebcam(true)
            // Wait for render
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream
                }
            }, 100)
        } catch (error) {
            console.error('Camera error:', error)
            // Fallback to file input if webcam fails
            alert('ไม่พบกล้อง (ใช้งานกล้องมือถือแทน)')
            cameraInputRef.current?.click()
        }
    }

    const stopWebcam = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop())
            setStream(null)
        }
        setShowWebcam(false)
    }

    const captureWebcam = () => {
        if (!videoRef.current) return

        const canvas = document.createElement('canvas')
        canvas.width = videoRef.current.videoWidth
        canvas.height = videoRef.current.videoHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) return

        ctx.drawImage(videoRef.current, 0, 0)
        const imageData = canvas.toDataURL('image/jpeg', 0.9)

        onImagesChange([...images, imageData])
        stopWebcam()
    }

    const removeImage = (index: number) => {
        onImagesChange(images.filter((_, i) => i !== index))
    }

    const handleEditSave = (editedImage: string) => {
        if (editingImage) {
            const newImages = [...images]
            newImages[editingImage.index] = editedImage
            onImagesChange(newImages)
            setEditingImage(null)
        }
    }

    const moveImage = (fromIndex: number, toIndex: number) => {
        const newImages = [...images]
        const [movedImage] = newImages.splice(fromIndex, 1)
        newImages.splice(toIndex, 0, movedImage)
        onImagesChange(newImages)
    }

    return (
        <>
            <div className="space-y-4">
                {/* Upload Buttons */}
                <div className="flex flex-wrap gap-3">
                    {/* 1. Mobile Camera (Native) */}
                    <button
                        type="button"
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all shadow-lg"
                    >
                        <Camera className="w-5 h-5" />
                        <span className="font-medium">ถ่ายรูป</span>
                    </button>

                    {/* 2. Webcam Details (Desktop) - Small secondary button */}
                    <button
                        type="button"
                        onClick={startWebcam}
                        className="flex-none px-3 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all"
                        title="เปิดเว็บแคม (สำหรับคอมพิวเตอร์)"
                    >
                        <MonitorSmartphone className="w-5 h-5" />
                    </button>

                    {/* 3. Gallery Upload */}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 border-2 border-purple-300 dark:border-purple-700 hover:border-purple-500 text-purple-600 dark:text-purple-400 rounded-xl transition-all"
                    >
                        <Upload className="w-5 h-5" />
                        <span className="font-medium">เลือกรูป</span>
                    </button>

                    {/* Hidden Native Inputs */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                    <input
                        ref={cameraInputRef}
                        type="file"
                        accept="image/*"
                        // This is key for mobile
                        capture="environment"
                        className="hidden"
                        onChange={handleFileUpload}
                    />
                </div>

                {/* Image Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className="relative aspect-square rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 group border-2 border-gray-200 dark:border-gray-700 hover:border-purple-400 transition-all"
                            draggable
                            onDragStart={(e) => e.dataTransfer.setData('text/plain', idx.toString())}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={(e) => {
                                e.preventDefault()
                                const fromIndex = parseInt(e.dataTransfer.getData('text/plain'))
                                moveImage(fromIndex, idx)
                            }}
                        >
                            <Image
                                src={img}
                                alt={`Product ${idx + 1}`}
                                fill
                                className="object-cover"
                            />

                            {/* Cover Badge */}
                            {idx === 0 && (
                                <div className="absolute top-2 left-2 px-2 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1">
                                    <Sparkles className="w-3 h-3" />
                                    ปก
                                </div>
                            )}

                            {/* Actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingImage({ index: idx, image: img })}
                                    className="p-2 bg-white hover:bg-gray-100 rounded-lg transition-colors"
                                    title="แต่งรูป"
                                >
                                    <Edit className="w-4 h-4 text-gray-700" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => removeImage(idx)}
                                    className="p-2 bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                                    title="ลบรูป"
                                >
                                    <X className="w-4 h-4 text-white" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {/* Add More Button */}
                    {images.length < maxImages && (
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-400 dark:hover:border-purple-500 cursor-pointer flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all group"
                        >
                            <ImageIcon className="w-8 h-8 text-gray-400 group-hover:text-purple-500 mb-2 transition-colors" />
                            <span className="text-xs text-gray-500 group-hover:text-purple-600 font-medium">
                                เพิ่มรูป
                            </span>
                        </button>
                    )}
                </div>

                {/* Info */}
                <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-purple-500" /> ถ่ายรูปสวยช่วยเพิ่มยอดขาย (รองรับลากวางเพื่อเรียงรูป)
                </div>
            </div>

            {/* Webcam Modal (Desktop) */}
            {showWebcam && (
                <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
                    <div className="relative w-full h-full max-w-2xl max-h-[80vh]">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover rounded-lg"
                        />
                        <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4">
                            <button
                                type="button"
                                onClick={stopWebcam}
                                className="px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-full transition-colors"
                            >
                                ยกเลิก
                            </button>
                            <button
                                type="button"
                                onClick={captureWebcam}
                                className="w-16 h-16 bg-white hover:bg-gray-100 rounded-full border-4 border-gray-300 transition-all shadow-lg flex items-center justify-center"
                            >
                                <div className="w-12 h-12 rounded-full bg-red-500" />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Image Editor */}
            {editingImage && (
                <ImageEditor
                    image={editingImage.image}
                    onSave={handleEditSave}
                    onCancel={() => setEditingImage(null)}
                />
            )}
        </>
    )
}

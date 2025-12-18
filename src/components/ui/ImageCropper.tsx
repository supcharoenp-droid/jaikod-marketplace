/**
 * Image Cropper Component
 * 
 * ตัดแต่งรูปภาพ
 */

'use client'

import React, { useState, useRef } from 'react'
import ReactCrop, { type Crop } from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import { X, RotateCw, Check } from 'lucide-react'

interface ImageCropperProps {
    file: File
    onSave: (croppedFile: File) => void
    onCancel: () => void
}

export default function ImageCropper({ file, onSave, onCancel }: ImageCropperProps) {
    const [crop, setCrop] = useState<Crop>({
        unit: '%',
        width: 90,
        height: 90,
        x: 5,
        y: 5
    })
    const [rotation, setRotation] = useState(0)
    const imgRef = useRef<HTMLImageElement>(null)
    const [imageUrl] = useState(URL.createObjectURL(file))

    const handleRotate = () => {
        setRotation((prev) => (prev + 90) % 360)
    }

    const handleSave = async () => {
        if (!imgRef.current || !crop.width || !crop.height) {
            return
        }

        const image = imgRef.current
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')!

        const scaleX = image.naturalWidth / image.width
        const scaleY = image.naturalHeight / image.height

        // Set canvas size to crop size
        canvas.width = crop.width * scaleX
        canvas.height = crop.height * scaleY

        // Apply rotation
        if (rotation !== 0) {
            const radians = (rotation * Math.PI) / 180
            const sin = Math.abs(Math.sin(radians))
            const cos = Math.abs(Math.cos(radians))

            const newWidth = canvas.width * cos + canvas.height * sin
            const newHeight = canvas.width * sin + canvas.height * cos

            canvas.width = newWidth
            canvas.height = newHeight

            ctx.translate(newWidth / 2, newHeight / 2)
            ctx.rotate(radians)
            ctx.translate(-crop.width * scaleX / 2, -crop.height * scaleY / 2)
        }

        // Draw image
        ctx.drawImage(
            image,
            crop.x * scaleX,
            crop.y * scaleY,
            crop.width * scaleX,
            crop.height * scaleY,
            0,
            0,
            crop.width * scaleX,
            crop.height * scaleY
        )

        // Convert to blob
        canvas.toBlob(
            (blob) => {
                if (blob) {
                    const croppedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    })
                    onSave(croppedFile)
                }
            },
            file.type,
            0.95
        )
    }

    return (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                        ✂️ ตัดแต่งรูป
                    </h3>
                    <button
                        onClick={onCancel}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Crop Area */}
                <div className="p-4">
                    <div className="max-h-[60vh] overflow-auto bg-gray-100 dark:bg-gray-900 rounded-lg">
                        <ReactCrop
                            crop={crop}
                            onChange={(c) => setCrop(c)}
                            aspect={undefined}
                        >
                            <img
                                ref={imgRef}
                                src={imageUrl}
                                alt="Crop"
                                style={{
                                    transform: `rotate(${rotation}deg)`,
                                    maxWidth: '100%'
                                }}
                                className="mx-auto"
                            />
                        </ReactCrop>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between p-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={handleRotate}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                    >
                        <RotateCw className="w-4 h-4" />
                        หมุน 90°
                    </button>

                    <div className="flex gap-2">
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
                        >
                            <Check className="w-4 h-4" />
                            บันทึก
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

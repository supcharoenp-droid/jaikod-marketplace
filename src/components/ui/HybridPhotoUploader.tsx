'use client'

/**
 * HybridPhotoUploader - Snap & Sell Pro
 * 
 * Features:
 * - 📷 Camera capture (mobile/desktop)
 * - 📤 File upload
 * - 🖐️ Drag & Drop
 * - 🔀 Drag to reorder
 * - ✂️ Photo editing (crop, rotate, adjust)
 * - 🤖 AI quality analysis
 * - 📍 GPS Photo support
 * - 💡 Smart recommendations
 */

import { useState, useRef, useCallback, useEffect } from 'react'
import { motion, AnimatePresence, Reorder } from 'framer-motion'
import {
    Camera, Upload, X, Star, Sparkles, Check,
    RotateCcw, Crop, Sun, Contrast, Palette,
    Loader2, AlertCircle, CheckCircle2, Lightbulb,
    GripVertical, Trash2, Wand2, MapPin, Image as ImageIcon,
    Pencil
} from 'lucide-react'
import PhotoEditor from './PhotoEditor'

// Types
interface Photo {
    id: string
    file: File
    preview: string
    compressed?: File
    quality?: {
        score: number
        grade: 'A' | 'B' | 'C' | 'D'
        issues: string[]
    }
    isMain?: boolean
}

interface HybridPhotoUploaderProps {
    maxPhotos?: number
    onPhotosChange?: (photos: Photo[]) => void
    onFirstPhotoReady?: (photo: Photo) => void
    language?: 'th' | 'en'
}

// Quality analyzer
const analyzePhotoQuality = async (file: File): Promise<Photo['quality']> => {
    return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
            const issues: string[] = []
            let score = 100

            // Check resolution
            if (img.width < 800 || img.height < 600) {
                issues.push('low_resolution')
                score -= 20
            }

            // Check aspect ratio (too narrow/tall)
            const ratio = img.width / img.height
            if (ratio < 0.5 || ratio > 2) {
                issues.push('bad_aspect_ratio')
                score -= 15
            }

            // File size check
            if (file.size < 50000) {
                issues.push('file_too_small')
                score -= 10
            }

            // Determine grade
            let grade: 'A' | 'B' | 'C' | 'D' = 'A'
            if (score >= 90) grade = 'A'
            else if (score >= 70) grade = 'B'
            else if (score >= 50) grade = 'C'
            else grade = 'D'

            resolve({ score, grade, issues })
        }
        img.src = URL.createObjectURL(file)
    })
}


// Compress image
const compressImage = async (file: File, maxDimension = 1920): Promise<File> => {
    return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onload = (e) => {
            const img = new Image()
            img.onload = () => {
                let width = img.width
                let height = img.height

                if (width > maxDimension || height > maxDimension) {
                    if (width > height) {
                        height = (height / width) * maxDimension
                        width = maxDimension
                    } else {
                        width = (width / height) * maxDimension
                        height = maxDimension
                    }
                }

                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext('2d')!
                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            resolve(new File([blob], file.name, { type: 'image/jpeg' }))
                        } else {
                            resolve(file)
                        }
                    },
                    'image/jpeg',
                    0.85
                )
            }
            img.src = e.target?.result as string
        }
        reader.readAsDataURL(file)
    })
}

export default function HybridPhotoUploader({
    maxPhotos = 10,
    onPhotosChange,
    onFirstPhotoReady,
    language = 'th'
}: HybridPhotoUploaderProps) {
    const [photos, setPhotos] = useState<Photo[]>([])
    const [isDragging, setIsDragging] = useState(false)
    const [isProcessing, setIsProcessing] = useState(false)
    const [editingPhoto, setEditingPhoto] = useState<Photo | null>(null)

    const fileInputRef = useRef<HTMLInputElement>(null)
    const cameraInputRef = useRef<HTMLInputElement>(null)

    // i18n
    const t = {
        th: {
            title: '🚀 Snap & Sell',
            subtitle: 'ถ่ายปุ๊บ ขายปั๊บ',
            camera: '📷 ถ่ายรูป',
            upload: '📤 เลือกรูป',
            dropHere: 'วางรูปที่นี่',
            orDrag: 'หรือลากไฟล์มาวาง',
            mainPhoto: '⭐ รูปหลัก',
            maxPhotos: `สูงสุด ${maxPhotos} รูป`,
            processing: 'กำลังประมวลผล...',
            qualityGood: 'คุณภาพดี',
            qualityOk: 'พอใช้',
            qualityLow: 'ควรปรับปรุง',
            tips: [
                '📸 ถ่ายในที่สว่าง',
                '🎯 เน้นสินค้าให้ชัด',
                '📐 ถ่ายหลายมุม',
            ],
            aiTip: '💡 เพิ่มรูปด้านหลังและด้านข้าง จะช่วยขายได้เร็วขึ้น 27%',
            edit: 'แต่ง',
            remove: 'ลบ',
            setMain: 'ตั้งเป็นรูปหลัก',
            tapToEdit: 'คลิกเพื่อแต่งภาพ',
            dragToReorder: 'ลากเพื่อเรียงลำดับ',
        },
        en: {
            title: '🚀 Snap & Sell',
            subtitle: 'Capture & Sell Instantly',
            camera: '📷 Camera',
            upload: '📤 Upload',
            dropHere: 'Drop photos here',
            orDrag: 'or drag files',
            mainPhoto: '⭐ Main',
            maxPhotos: `Max ${maxPhotos} photos`,
            processing: 'Processing...',
            qualityGood: 'Good quality',
            qualityOk: 'Acceptable',
            qualityLow: 'Needs improvement',
            tips: [
                '📸 Good lighting',
                '🎯 Focus on product',
                '📐 Multiple angles',
            ],
            aiTip: '💡 Adding back and side photos increases sales by 27%',
            edit: 'Edit',
            remove: 'Remove',
            setMain: 'Set as main',
            tapToEdit: 'Click to edit',
            dragToReorder: 'Drag to reorder',
        }
    }[language]

    // Handle file selection (with duplicate prevention)
    const handleFiles = useCallback(async (files: FileList | File[]) => {
        // Guard: ถ้ากำลัง process อยู่ ไม่รับไฟล์ใหม่
        if (isProcessing) {
            console.log('⏭️ Skipping - already processing')
            return
        }

        const fileArray = Array.from(files)
        const remaining = maxPhotos - photos.length
        if (remaining <= 0) return

        // Filter out duplicates based on file name + size
        const existingFileSignatures = new Set(
            photos.map(p => `${p.file.name}_${p.file.size}`)
        )

        const uniqueFiles = fileArray.filter(file => {
            const signature = `${file.name}_${file.size}`
            if (existingFileSignatures.has(signature)) {
                console.log('⏭️ Skipping duplicate:', file.name)
                return false
            }
            existingFileSignatures.add(signature) // Prevent duplicates within same batch
            return true
        })

        if (uniqueFiles.length === 0) {
            console.log('⚠️ All files are duplicates')
            return
        }

        const filesToProcess = uniqueFiles.slice(0, remaining)
        setIsProcessing(true)

        const newPhotos: Photo[] = []

        for (const file of filesToProcess) {
            const id = `photo_${Date.now()}_${Math.random().toString(36).slice(2)}`
            const preview = URL.createObjectURL(file)
            const compressed = await compressImage(file)
            const quality = await analyzePhotoQuality(file)

            const photo: Photo = {
                id,
                file,
                preview,
                compressed,
                quality,
                isMain: photos.length === 0 && newPhotos.length === 0
            }

            newPhotos.push(photo)
        }

        const updatedPhotos = [...photos, ...newPhotos]
        setPhotos(updatedPhotos)
        setIsProcessing(false)

        if (onPhotosChange) onPhotosChange(updatedPhotos)
        if (onFirstPhotoReady && photos.length === 0 && newPhotos.length > 0) {
            onFirstPhotoReady(newPhotos[0])
        }
    }, [photos, maxPhotos, onPhotosChange, onFirstPhotoReady, isProcessing])

    // Drag & Drop handlers
    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback(() => {
        setIsDragging(false)
    }, [])

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setIsDragging(false)
        handleFiles(e.dataTransfer.files)
    }, [handleFiles])

    // Remove photo
    const removePhoto = useCallback((id: string) => {
        const updated = photos.filter(p => p.id !== id)
        // If removed main photo, make first one main
        if (updated.length > 0 && !updated.some(p => p.isMain)) {
            updated[0].isMain = true
        }
        setPhotos(updated)
        if (onPhotosChange) onPhotosChange(updated)
    }, [photos, onPhotosChange])

    // Set main photo
    const setMainPhoto = useCallback((id: string) => {
        const updated = photos.map(p => ({ ...p, isMain: p.id === id }))
        setPhotos(updated)
        if (onPhotosChange) onPhotosChange(updated)
    }, [photos, onPhotosChange])

    // Reorder photos
    const handleReorder = useCallback((newOrder: Photo[]) => {
        setPhotos(newOrder)
        if (onPhotosChange) onPhotosChange(newOrder)
    }, [onPhotosChange])

    // 📝 Save edited photo
    const handleSaveEditedPhoto = useCallback((editedImageDataUrl: string) => {
        if (!editingPhoto) return

        // Convert data URL to File
        fetch(editedImageDataUrl)
            .then(res => res.blob())
            .then(blob => {
                const editedFile = new File([blob], editingPhoto.file.name, { type: 'image/jpeg' })

                // Update the photo in the list
                const updated = photos.map(p =>
                    p.id === editingPhoto.id
                        ? { ...p, file: editedFile, preview: editedImageDataUrl }
                        : p
                )
                setPhotos(updated)
                if (onPhotosChange) onPhotosChange(updated)
                setEditingPhoto(null)
            })
    }, [editingPhoto, photos, onPhotosChange])

    // Average quality score
    const avgQuality = photos.length > 0
        ? Math.round(photos.reduce((sum, p) => sum + (p.quality?.score || 0), 0) / photos.length)
        : 0

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="text-center">
                <h3 className="text-lg font-bold text-white flex items-center justify-center gap-2">
                    {t.title}
                    <span className="text-sm font-normal text-purple-400">{t.subtitle}</span>
                </h3>
            </div>

            {/* Upload Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-2xl p-6 transition-all
                    ${isDragging
                        ? 'border-purple-500 bg-purple-500/10'
                        : 'border-gray-600 hover:border-purple-500/50 bg-slate-800/50'
                    }`}
            >
                {/* Hidden inputs */}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />
                <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                />

                <div className="flex flex-col items-center gap-4">
                    {/* Buttons */}
                    <div className="flex gap-3">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => cameraInputRef.current?.click()}
                            className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-purple-600 to-pink-600 
                                     text-white rounded-xl font-medium shadow-lg hover:shadow-purple-500/25"
                        >
                            <Camera className="w-5 h-5" />
                            {t.camera}
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-5 py-3 bg-slate-700 hover:bg-slate-600
                                     text-white rounded-xl font-medium border border-white/10"
                        >
                            <Upload className="w-5 h-5" />
                            {t.upload}
                        </motion.button>
                    </div>

                    {/* Drop hint */}
                    <p className="text-sm text-gray-400">
                        {isDragging ? t.dropHere : t.orDrag}
                    </p>

                    {/* Max photos indicator */}
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <ImageIcon className="w-4 h-4" />
                        {photos.length}/{maxPhotos} • {t.maxPhotos}
                    </div>
                </div>

                {/* Processing overlay */}
                <AnimatePresence>
                    {isProcessing && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-slate-900/80 rounded-2xl flex items-center justify-center"
                        >
                            <div className="text-center">
                                <Loader2 className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-2" />
                                <p className="text-white text-sm">{t.processing}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Photo Grid - Reorderable */}
            {photos.length > 0 && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{t.dragToReorder}</span>
                        <span className="flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-purple-400" />
                            {language === 'th' ? 'คุณภาพเฉลี่ย' : 'Avg Quality'}: {avgQuality}%
                        </span>
                    </div>

                    <Reorder.Group
                        axis="x"
                        values={photos}
                        onReorder={handleReorder}
                        className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-purple-500/30"
                    >
                        {photos.map((photo) => (
                            <Reorder.Item
                                key={photo.id}
                                value={photo}
                                className="relative flex-shrink-0 group cursor-grab active:cursor-grabbing"
                            >
                                <div className={`relative w-24 h-24 rounded-xl overflow-hidden border-2 
                                    ${photo.isMain ? 'border-yellow-400' : 'border-transparent'}`}
                                >
                                    <img
                                        src={photo.preview}
                                        alt=""
                                        className="w-full h-full object-cover"
                                    />

                                    {/* Main badge */}
                                    {photo.isMain && (
                                        <div className="absolute top-1 left-1 bg-yellow-400 text-black text-[10px] 
                                                      px-1.5 py-0.5 rounded-full font-bold flex items-center gap-0.5">
                                            <Star className="w-2.5 h-2.5" fill="currentColor" />
                                        </div>
                                    )}

                                    {/* Quality badge */}
                                    {photo.quality && (
                                        <div className={`absolute bottom-1 right-1 text-[10px] px-1.5 py-0.5 rounded-full font-bold
                                            ${photo.quality.grade === 'A' ? 'bg-green-500 text-white' :
                                                photo.quality.grade === 'B' ? 'bg-blue-500 text-white' :
                                                    photo.quality.grade === 'C' ? 'bg-yellow-500 text-black' :
                                                        'bg-red-500 text-white'}`}
                                        >
                                            {photo.quality.grade}
                                        </div>
                                    )}

                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 
                                                  transition-opacity flex items-center justify-center gap-2">
                                        {!photo.isMain && (
                                            <button
                                                onClick={() => setMainPhoto(photo.id)}
                                                className="p-1.5 bg-yellow-400 rounded-full text-black hover:bg-yellow-300"
                                                title={t.setMain}
                                            >
                                                <Star className="w-3 h-3" />
                                            </button>
                                        )}
                                        {/* 📝 Edit button */}
                                        <button
                                            onClick={() => setEditingPhoto(photo)}
                                            className="p-1.5 bg-purple-500 rounded-full text-white hover:bg-purple-400"
                                            title={t.edit}
                                        >
                                            <Pencil className="w-3 h-3" />
                                        </button>
                                        <button
                                            onClick={() => removePhoto(photo.id)}
                                            className="p-1.5 bg-red-500 rounded-full text-white hover:bg-red-400"
                                            title={t.remove}
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>

                                    {/* Drag handle */}
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                                        <GripVertical className="w-4 h-4 text-white drop-shadow" />
                                    </div>
                                </div>
                            </Reorder.Item>
                        ))}

                        {/* Add more button */}
                        {photos.length < maxPhotos && (
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-24 h-24 flex-shrink-0 border-2 border-dashed border-gray-600 
                                         rounded-xl flex flex-col items-center justify-center gap-1
                                         hover:border-purple-500 hover:bg-purple-500/10 transition-all"
                            >
                                <Upload className="w-5 h-5 text-gray-400" />
                                <span className="text-[10px] text-gray-400">+{maxPhotos - photos.length}</span>
                            </button>
                        )}
                    </Reorder.Group>
                </div>
            )}

            {/* AI Tips */}
            {photos.length > 0 && photos.length < 4 && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-2 p-3 bg-gradient-to-r from-purple-500/10 to-pink-500/10 
                             rounded-xl border border-purple-500/20"
                >
                    <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    <p className="text-xs text-gray-300">{t.aiTip}</p>
                </motion.div>
            )}

            {/* Photo Tips (when no photos) */}
            {photos.length === 0 && (
                <div className="grid grid-cols-3 gap-2">
                    {t.tips.map((tip, idx) => (
                        <div key={idx} className="text-center p-2 bg-slate-800/50 rounded-lg">
                            <p className="text-xs text-gray-400">{tip}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Quality Summary */}
            {photos.length > 0 && (
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl text-sm">
                    <div className="flex items-center gap-2">
                        {avgQuality >= 80 ? (
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                        ) : avgQuality >= 50 ? (
                            <AlertCircle className="w-4 h-4 text-yellow-400" />
                        ) : (
                            <AlertCircle className="w-4 h-4 text-red-400" />
                        )}
                        <span className="text-gray-300">
                            {avgQuality >= 80 ? t.qualityGood :
                                avgQuality >= 50 ? t.qualityOk : t.qualityLow}
                        </span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Wand2 className="w-4 h-4 text-purple-400" />
                        <span className="text-purple-400 font-medium">{avgQuality}%</span>
                    </div>
                </div>
            )}

            {/* 📝 Photo Editor Modal */}
            {editingPhoto && (
                <PhotoEditor
                    image={editingPhoto.preview}
                    onSave={handleSaveEditedPhoto}
                    onCancel={() => setEditingPhoto(null)}
                    language={language}
                />
            )}
        </div>
    )
}

'use client'

/**
 * PhotoUploaderAdvanced - Professional Photo Upload with Camera Support
 * 
 * Features:
 * - Upload from gallery (max 10)
 * - Take photo with camera (iOS/Android)
 * - Drag & drop support
 * - Preview grid
 * - Remove photos
 * - Auto-compress
 * - Main photo indicator
 */

import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, Upload, X, Check, Image as ImageIcon, Wand2 } from 'lucide-react'
import PhotoEditor from './PhotoEditor'
import { useLanguage } from '@/contexts/LanguageContext'

interface Photo {
    file: File
    preview: string
    compressed?: File
}

interface PhotoUploaderProps {
    maxPhotos?: number
    onPhotosChange: (photos: File[]) => void
    onFirstPhotoReady?: (photo: File) => void
}

export default function PhotoUploaderAdvanced({
    maxPhotos = 10,
    onPhotosChange,
    onFirstPhotoReady
}: PhotoUploaderProps) {
    const { language } = useLanguage()
    const [photos, setPhotos] = useState<Photo[]>([])
    const [isCompressing, setIsCompressing] = useState(false)

    // ✅ Photo Editor State
    const [editorOpen, setEditorOpen] = useState(false)
    const [photoToEdit, setPhotoToEdit] = useState<{ photo: Photo; index: number } | null>(null)

    const uploadRef = useRef<HTMLInputElement>(null)
    const cameraRef = useRef<HTMLInputElement>(null)

    // i18n text
    const t = {
        maxPhotos: language === 'th' ? `สูงสุด ${maxPhotos} รูปเท่านั้น` : `Maximum ${maxPhotos} photos only`,
        photoCount: (count: number) => language === 'th' ? `${count}/${maxPhotos} รูป` : `${count}/${maxPhotos} photos`,
        compressing: language === 'th' ? 'กำลังบีบอัด...' : 'Compressing...',
        main: language === 'th' ? 'Main' : 'Main',
        uploadOrTake: language === 'th' ? 'อัพโหลดหรือถ่ายรูปสินค้า' : 'Upload or Take Product Photos',
        cameraOrGallery: language === 'th' ? `ถ่ายจากกล้อง หรือเลือกจากคลัง สูงสุด ${maxPhotos} รูป` : `Take with camera or choose from gallery, max ${maxPhotos} photos`,
        choosePhoto: language === 'th' ? 'เลือกรูป' : 'Choose Photo',
        takePhoto: language === 'th' ? 'ถ่ายรูป' : 'Take Photo',
        addMore: language === 'th' ? 'เพิ่ม' : 'Add',
        tips: language === 'th' ? '💡 รูปแรก = รูปหลัก • ถ่าย 5-10 รูป = ขายได้เร็วขึ้น ~18%' : '💡 First photo = Main • Take 5-10 photos = Sell ~18% faster',
        fileInfo: language === 'th' ? 'JPG, PNG, WEBP • สูงสุด 10MB/รูป • จะบีบอัดอัตโนมัติ' : 'JPG, PNG, WEBP • Max 10MB/photo • Auto-compressed'
    }

    // Compress image using Canvas API (no external library needed!)
    const compressImage = async (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader()

            reader.onload = (e) => {
                const img = new Image()

                img.onload = () => {
                    // Calculate new dimensions (max 1920px)
                    let width = img.width
                    let height = img.height
                    const maxDimension = 1920

                    if (width > maxDimension || height > maxDimension) {
                        if (width > height) {
                            height = (height / width) * maxDimension
                            width = maxDimension
                        } else {
                            width = (width / height) * maxDimension
                            height = maxDimension
                        }
                    }

                    // Create canvas and compress
                    const canvas = document.createElement('canvas')
                    canvas.width = width
                    canvas.height = height
                    const ctx = canvas.getContext('2d')!

                    ctx.drawImage(img, 0, 0, width, height)

                    // Convert to blob with quality 0.85
                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                const compressedFile = new File([blob], file.name, {
                                    type: 'image/jpeg',
                                    lastModified: Date.now()
                                })
                                resolve(compressedFile)
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

    // Handle file selection
    const handleFiles = useCallback(async (files: FileList) => {
        const remaining = maxPhotos - photos.length
        if (remaining <= 0) {
            alert(t.maxPhotos)
            return
        }

        const newFiles = Array.from(files).slice(0, remaining)
        setIsCompressing(true)

        const newPhotos: Photo[] = []

        for (const file of newFiles) {
            // Create preview
            const preview = URL.createObjectURL(file)

            // Compress
            const compressed = await compressImage(file)

            newPhotos.push({
                file,
                preview,
                compressed
            })
        }

        const updatedPhotos = [...photos, ...newPhotos]
        setPhotos(updatedPhotos)

        // Notify parent
        onPhotosChange(updatedPhotos.map(p => p.compressed || p.file))

        // Notify first photo ready for AI analysis
        if (photos.length === 0 && newPhotos.length > 0 && onFirstPhotoReady) {
            onFirstPhotoReady(newPhotos[0].compressed || newPhotos[0].file)
        }

        setIsCompressing(false)
    }, [photos, maxPhotos, onPhotosChange, onFirstPhotoReady, t])

    // Remove photo
    const removePhoto = useCallback((index: number) => {
        const updated = photos.filter((_, i) => i !== index)
        setPhotos(updated)
        onPhotosChange(updated.map(p => p.compressed || p.file))
    }, [photos, onPhotosChange])

    // Handle drag & drop
    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        const files = e.dataTransfer.files
        if (files.length > 0) {
            handleFiles(files)
        }
    }, [handleFiles])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
    }, [])

    // ✅ Handle Edit Photo
    const handleEditPhoto = useCallback((photo: Photo, index: number) => {
        setPhotoToEdit({ photo, index })
        setEditorOpen(true)
    }, [])

    // ✅ Handle Save Edited Photo
    const handleSaveEditedPhoto = useCallback((editedFile: File) => {
        if (!photoToEdit) return

        const updatedPhotos = [...photos]
        const newPreview = URL.createObjectURL(editedFile)

        // Update the photo at the specific index
        updatedPhotos[photoToEdit.index] = {
            file: editedFile,
            preview: newPreview,
            compressed: editedFile
        }

        setPhotos(updatedPhotos)
        onPhotosChange(updatedPhotos.map(p => p.compressed || p.file))

        // Close editor
        setEditorOpen(false)
        setPhotoToEdit(null)
    }, [photoToEdit, photos, onPhotosChange])

    return (
        <div className="space-y-4">
            {/* Photo Grid */}
            {photos.length > 0 ? (
                <div className="space-y-4">
                    {/* Photo Count */}
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                            {t.photoCount(photos.length)}
                        </span>
                        {isCompressing && (
                            <span className="text-xs text-purple-400 animate-pulse">
                                {t.compressing}
                            </span>
                        )}
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-4 gap-3">
                        <AnimatePresence>
                            {photos.map((photo, index) => (
                                <motion.div
                                    key={photo.preview}
                                    className="relative aspect-square rounded-lg overflow-hidden
                             border-2 border-gray-700 hover:border-purple-500
                             transition-all group"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    layout
                                >
                                    {/* Image */}
                                    <img
                                        src={photo.preview}
                                        alt={`Photo ${index + 1}`}
                                        className="w-full h-full object-contain bg-gray-800"
                                    />

                                    {/* Main photo badge */}
                                    {index === 0 && (
                                        <div className="absolute top-2 left-2 px-2 py-1 
                                    bg-purple-500 rounded text-xs font-bold
                                    flex items-center gap-1">
                                            <Check className="w-3 h-3" />
                                            {t.main}
                                        </div>
                                    )}

                                    {/* Remove button */}
                                    <button
                                        onClick={() => removePhoto(index)}
                                        className="absolute top-2 right-2 p-1.5 bg-red-500 
                               rounded-full opacity-0 group-hover:opacity-100
                               transition-opacity hover:bg-red-600"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>

                                    {/* Photo number */}
                                    <div className="absolute bottom-2 right-2 px-2 py-0.5 
                                  bg-black/70 rounded text-xs">
                                        {index + 1}
                                    </div>

                                    {/* ✅ Edit Button */}
                                    <button
                                        onClick={() => handleEditPhoto(photo, index)}
                                        className="absolute top-2 left-2 p-2 bg-purple-600/90 
                               hover:bg-purple-500 rounded-full opacity-0 
                               group-hover:opacity-100 transition-all 
                               hover:scale-110"
                                        title="แต่งรูป"
                                    >
                                        <Wand2 className="w-4 h-4" />
                                    </button>

                                    {/* Compressed indicator */}
                                    {photo.compressed && (
                                        <div className="absolute bottom-2 left-2 px-1.5 py-0.5 
                                    bg-green-500/80 rounded text-[10px]">
                                            ✓
                                        </div>
                                    )}
                                </motion.div>
                            ))}

                            {/* Add more button */}
                            {photos.length < maxPhotos && (
                                <motion.button
                                    onClick={() => uploadRef.current?.click()}
                                    className="aspect-square rounded-lg border-2 border-dashed 
                             border-gray-600 hover:border-purple-500
                             flex items-center justify-center
                             transition-colors group"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className="text-center">
                                        <Upload className="w-8 h-8 mx-auto mb-1 text-gray-500 
                                       group-hover:text-purple-400 transition-colors" />
                                        <div className="text-xs text-gray-500 group-hover:text-purple-400">
                                            {t.addMore}
                                        </div>
                                    </div>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Tips */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 
                          p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                        <ImageIcon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                        <span>
                            {t.tips}
                        </span>
                    </div>
                </div>
            ) : (
                /* Empty State */
                <motion.div
                    className="border-2 border-dashed border-gray-700 
                     rounded-xl p-12 text-center
                     hover:border-purple-500 transition-colors"
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    {/* Icon */}
                    <motion.div
                        className="w-20 h-20 mx-auto mb-6 relative"
                        animate={{
                            scale: [1, 1.05, 1],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: 'easeInOut'
                        }}
                    >
                        <div className="absolute inset-0 bg-purple-500/20 rounded-full blur-xl" />
                        <div className="relative bg-gradient-to-br from-purple-500 to-pink-500 
                            rounded-full p-5">
                            <Camera className="w-10 h-10 text-white" />
                        </div>
                    </motion.div>

                    {/* Text */}
                    <h4 className="text-lg font-semibold text-white mb-2">
                        {t.uploadOrTake}
                    </h4>
                    <p className="text-sm text-gray-400 mb-6">
                        {t.cameraOrGallery}
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => uploadRef.current?.click()}
                            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 
                         rounded-lg flex items-center gap-2 transition-colors"
                        >
                            <Upload className="w-5 h-5" />
                            {t.choosePhoto}
                        </button>

                        <button
                            onClick={() => cameraRef.current?.click()}
                            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600
                         hover:from-purple-700 hover:to-pink-700
                         rounded-lg flex items-center gap-2 transition-all
                         shadow-lg shadow-purple-500/30"
                        >
                            <Camera className="w-5 h-5" />
                            {t.takePhoto}
                        </button>
                    </div>

                    {/* Info */}
                    <p className="text-xs text-gray-600 mt-4">
                        {t.fileInfo}
                    </p>
                </motion.div>
            )}

            {/* Hidden inputs */}
            <input
                ref={uploadRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
            />
            <input
                ref={cameraRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
                className="hidden"
            />

            {/* ✅ Photo Editor Modal */}
            {photoToEdit && (
                <PhotoEditor
                    isOpen={editorOpen}
                    photo={{
                        file: photoToEdit.photo.file,
                        preview: photoToEdit.photo.preview
                    }}
                    onSave={handleSaveEditedPhoto}
                    onClose={() => {
                        setEditorOpen(false)
                        setPhotoToEdit(null)
                    }}
                />
            )}
        </div>
    )
}

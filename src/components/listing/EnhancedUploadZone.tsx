'use client'

import { motion } from 'framer-motion'
import { Sparkles, Upload, Zap, Target, TrendingUp } from 'lucide-react'
import { useCallback } from 'react'

interface EnhancedUploadZoneProps {
    onFileSelect: (files: FileList) => void
    isAnalyzing?: boolean
    maxFiles?: number
}

export default function EnhancedUploadZone({
    onFileSelect,
    isAnalyzing = false,
    maxFiles = 8
}: EnhancedUploadZoneProps) {
    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        const files = e.dataTransfer.files
        if (files.length > 0) {
            onFileSelect(files)
        }
    }, [onFileSelect])

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files && files.length > 0) {
            onFileSelect(files)
        }
    }, [onFileSelect])

    return (
        <div className="relative">
            {/* Animated Gradient Background */}
            <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 
                   to-purple-500 opacity-20 blur-xl group-hover:opacity-30"
                animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'linear'
                }}
                style={{ backgroundSize: '200% 200%' }}
            />

            {/* Upload Zone */}
            <motion.label
                className="relative block cursor-pointer group"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
            >
                <div
                    className="relative border-2 border-dashed border-purple-500/50 
                     rounded-2xl p-12 text-center
                     hover:border-purple-500 hover:bg-purple-500/5
                     transition-all duration-300"
                    onDrop={handleDrop}
                    onDragOver={(e) => e.preventDefault()}
                >
                    {/* AI Icon with Animation */}
                    <div className="w-24 h-24 mx-auto mb-6 relative">
                        {/* Pulse Ring */}
                        <motion.div
                            className="absolute inset-0 bg-purple-500/20 rounded-full"
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 0, 0.5]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: 'easeInOut'
                            }}
                        />

                        {/* Icon Container */}
                        <motion.div
                            className="relative bg-gradient-to-br from-purple-500 to-pink-500 
                         rounded-full p-6 shadow-lg shadow-purple-500/50"
                            animate={{
                                rotate: isAnalyzing ? 360 : 0
                            }}
                            transition={{
                                duration: 2,
                                repeat: isAnalyzing ? Infinity : 0,
                                ease: 'linear'
                            }}
                        >
                            <Sparkles className="w-12 h-12 text-white" />
                        </motion.div>
                    </div>

                    {/* Title */}
                    <motion.h3
                        className="text-2xl font-bold mb-2 bg-gradient-to-r from-purple-400 
                       to-pink-400 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        🤖 AI Vision Ready
                    </motion.h3>

                    {/* Subtitle */}
                    <p className="text-gray-400 mb-6">
                        Drag photos here or click to upload<br />
                        <span className="text-sm text-gray-500">
                            AI will analyze & auto-fill everything
                        </span>
                    </p>

                    {/* Stats */}
                    <div className="flex gap-8 justify-center text-sm">
                        <motion.div
                            className="text-center"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Target className="w-4 h-4 text-purple-400" />
                                <div className="text-xl font-bold bg-gradient-to-r from-purple-400 
                               to-pink-400 bg-clip-text text-transparent">
                                    98%
                                </div>
                            </div>
                            <div className="text-gray-500">Accuracy</div>
                        </motion.div>

                        <motion.div
                            className="text-center"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Zap className="w-4 h-4 text-purple-400" />
                                <div className="text-xl font-bold bg-gradient-to-r from-purple-400 
                               to-pink-400 bg-clip-text text-transparent">
                                    &lt;15s
                                </div>
                            </div>
                            <div className="text-gray-500">Analysis</div>
                        </motion.div>

                        <motion.div
                            className="text-center"
                            whileHover={{ scale: 1.05 }}
                        >
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <TrendingUp className="w-4 h-4 text-purple-400" />
                                <div className="text-xl font-bold bg-gradient-to-r from-purple-400 
                               to-pink-400 bg-clip-text text-transparent">
                                    90%
                                </div>
                            </div>
                            <div className="text-gray-500">Time Saved</div>
                        </motion.div>
                    </div>

                    {/* Max Files Info */}
                    <p className="mt-6 text-xs text-gray-600">
                        สูงสุด {maxFiles} รูป • JPG, PNG, WEBP • ขนาดไม่เกิน 10MB/รูป
                    </p>
                </div>

                {/* Hidden File Input */}
                <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileInput}
                    className="hidden"
                    disabled={isAnalyzing}
                />
            </motion.label>

            {/* Loading Overlay */}
            {isAnalyzing && (
                <motion.div
                    className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm 
                     rounded-2xl flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="text-center">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-16 h-16 mx-auto mb-4 border-4 border-purple-500 
                         border-t-transparent rounded-full"
                        />
                        <p className="text-gray-300 font-medium">
                            AI กำลังวิเคราะห์รูปภาพ...
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

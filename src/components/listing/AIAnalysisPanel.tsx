'use client'

import { motion } from 'framer-motion'
import { Sparkles, CheckCircle, Lightbulb, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

interface DetectedItem {
    name: string
    confidence: number
    category?: string
}

interface AISuggestion {
    id: string
    text: string
    type: 'improvement' | 'warning' | 'tip'
}

interface AIAnalysisPanelProps {
    isAnalyzing?: boolean
    confidence?: number
    detectedObjects?: DetectedItem[]
    suggestions?: AISuggestion[]
    progress?: number
}

export default function AIAnalysisPanel({
    isAnalyzing = false,
    confidence = 0,
    detectedObjects = [],
    suggestions = [],
    progress = 0
}: AIAnalysisPanelProps) {
    const [animatedConfidence, setAnimatedConfidence] = useState(0)

    // Animate confidence score
    useEffect(() => {
        if (confidence > 0) {
            const timer = setTimeout(() => {
                setAnimatedConfidence(confidence)
            }, 300)
            return () => clearTimeout(timer)
        }
    }, [confidence])

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 
                 border border-purple-500/20 shadow-xl shadow-purple-500/10"
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-400" />
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 
                         bg-clip-text text-transparent">
                        AI Analysis
                    </span>
                </h3>

                {isAnalyzing && (
                    <span className="px-3 py-1 bg-purple-500/20 text-purple-300 
                         rounded-full text-xs font-mono uppercase tracking-wider
                         animate-pulse">
                        LIVE
                    </span>
                )}
            </div>

            {/* Progress Bar */}
            {isAnalyzing && (
                <motion.div
                    className="mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-300">Analyzing image...</span>
                        <span className="text-purple-400 font-mono">{progress}%</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </motion.div>
            )}

            {/* Confidence Score */}
            {!isAnalyzing && confidence > 0 && (
                <motion.div
                    className="mb-6 p-4 bg-purple-500/10 rounded-xl border border-purple-500/20"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium text-gray-300">
                            Confidence
                        </span>
                        <motion.span
                            className="text-3xl font-bold bg-gradient-to-r from-purple-400 
                         to-pink-400 bg-clip-text text-transparent"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.4, type: 'spring' }}
                        >
                            {Math.round(animatedConfidence)}%
                        </motion.span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500
                         shadow-lg shadow-purple-500/50"
                            initial={{ width: 0 }}
                            animate={{ width: `${animatedConfidence}%` }}
                            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
                        />
                    </div>
                </motion.div>
            )}

            {/* Detected Objects */}
            {detectedObjects.length > 0 && (
                <motion.div
                    className="space-y-3 mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <h4 className="text-sm font-medium text-gray-400 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        Detected:
                    </h4>
                    {detectedObjects.map((obj, i) => (
                        <motion.div
                            key={i}
                            className="flex items-center justify-between p-3 
                       bg-gray-800/50 rounded-lg border border-gray-700/50
                       hover:border-purple-500/30 transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                        >
                            <span className="flex items-center gap-2 text-gray-200">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                {obj.name}
                            </span>
                            <span className="text-xs text-gray-500 font-mono">
                                {obj.confidence}%
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* AI Suggestions */}
            {suggestions.length > 0 && (
                <motion.div
                    className="pt-6 border-t border-gray-700"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                >
                    <h4 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-yellow-400" />
                        AI Suggestions:
                    </h4>
                    <div className="space-y-2">
                        {suggestions.map((suggestion, i) => (
                            <motion.div
                                key={suggestion.id}
                                className="flex gap-2 text-sm"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 1.1 + i * 0.1 }}
                            >
                                <span className={`mt-1 ${suggestion.type === 'warning' ? 'text-yellow-400' :
                                        suggestion.type === 'improvement' ? 'text-blue-400' :
                                            'text-green-400'
                                    }`}>
                                    •
                                </span>
                                <span className="text-gray-300 leading-relaxed">
                                    {suggestion.text}
                                </span>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Empty State */}
            {!isAnalyzing && detectedObjects.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">อัพโหลดรูปเพื่อเริ่ม AI Analysis</p>
                </div>
            )}
        </motion.div>
    )
}

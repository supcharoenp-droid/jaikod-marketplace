'use client'

import { useState } from 'react'
import { OpenAIVisionService } from '@/lib/openai-vision-service'
import { EXPERIMENTAL_FEATURES } from '@/lib/ai-model-strategy'

export default function VisionPipelineTestPage() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>('')
    const [result, setResult] = useState<any>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string>('')

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            setPreviewUrl(URL.createObjectURL(file))
            setResult(null)
            setError('')
        }
    }

    const handleAnalyze = async () => {
        if (!selectedFile) return

        setLoading(true)
        setError('')
        setResult(null)

        try {
            const visionService = new OpenAIVisionService()
            const startTime = Date.now()
            const analysis = await visionService.analyzeImage(selectedFile)
            const duration = Date.now() - startTime

            setResult({ ...analysis, _duration: duration })
        } catch (err: any) {
            setError(err.message || 'Analysis failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                        🧪 Vision Pipeline Test Lab
                    </h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">
                        Compare 1-Layer vs 2-Layer AI Vision Performance
                    </p>

                    {/* Feature Flag Status */}
                    <div className={`inline-block mt-4 px-4 py-2 rounded-full ${EXPERIMENTAL_FEATURES.USE_TWO_LAYER_VISION
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
                        }`}>
                        <span className="font-semibold">Mode:</span>{' '}
                        {EXPERIMENTAL_FEATURES.USE_TWO_LAYER_VISION
                            ? '🧪 1.5-Layer (gpt-4o-mini → gpt-5-nano)'
                            : '🔵 Single-Layer (gpt-4o-mini only)'}
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                    <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-2">
                        📝 How to Test:
                    </h3>
                    <ol className="list-decimal list-inside text-blue-800 dark:text-blue-300 space-y-1">
                        <li>Upload a product image (TV, laptop, phone, etc.)</li>
                        <li>Click "Analyze Image" and wait for results</li>
                        <li>Review the analysis (title, category, price)</li>
                        <li>Toggle the flag in <code className="bg-blue-100 dark:bg-blue-900 px-1">ai-model-strategy.ts</code> to compare</li>
                    </ol>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left: Upload & Preview */}
                    <div className="space-y-6">
                        {/* Upload Box */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                📤 Upload Product Image
                            </h2>

                            <label className="block border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center cursor-pointer hover:border-purple-500 transition-colors">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <div className="text-gray-600 dark:text-gray-400">
                                    <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <p className="font-medium">Click to select image</p>
                                    <p className="text-sm">JPG, PNG, WEBP (max 10MB)</p>
                                </div>
                            </label>

                            {selectedFile && (
                                <button
                                    onClick={handleAnalyze}
                                    disabled={loading}
                                    className="mt-4 w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transform hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Analyzing...
                                        </span>
                                    ) : '🔍 Analyze Image'}
                                </button>
                            )}
                        </div>

                        {/* Image Preview */}
                        {previewUrl && (
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                                <h3 className="font-bold text-gray-900 dark:text-white mb-4">🖼️ Preview</h3>
                                <img
                                    src={previewUrl}
                                    alt="Preview"
                                    className="w-full rounded-xl"
                                />
                            </div>
                        )}
                    </div>

                    {/* Right: Results */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                            📊 Analysis Results
                        </h2>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 text-red-800 dark:text-red-200">
                                ❌ Error: {error}
                            </div>
                        )}

                        {result ? (
                            <div className="space-y-4">
                                {/* Performance Metrics */}
                                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4">
                                    <div className="text-sm text-blue-600 dark:text-blue-400 font-semibold mb-2">
                                        ⚡ Performance
                                    </div>
                                    <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                                        {result._duration}ms
                                    </div>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Title</label>
                                    <p className="text-lg font-bold text-gray-900 dark:text-white">{result.title}</p>
                                </div>

                                {/* Category */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Category</label>
                                        <p className="text-gray-900 dark:text-white">{result.suggestedCategory}</p>
                                    </div>
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Subcategory</label>
                                        <p className="text-gray-900 dark:text-white">{result.suggestedSubcategory || 'N/A'}</p>
                                    </div>
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Suggested Price</label>
                                    <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                                        ฿{result.estimatedPrice.suggested.toLocaleString()}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Range: ฿{result.estimatedPrice.min.toLocaleString()} - ฿{result.estimatedPrice.max.toLocaleString()}
                                    </p>
                                </div>

                                {/* Confidence */}
                                {result.validation && (
                                    <div>
                                        <label className="text-sm font-semibold text-gray-600 dark:text-gray-400">Confidence</label>
                                        <div className="flex items-center gap-2">
                                            <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                                <div
                                                    className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                                                    style={{ width: `${result.validation.confidence}%` }}
                                                />
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 dark:text-white">
                                                {result.validation.confidence.toFixed(1)}%
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {/* Raw JSON */}
                                <details className="mt-4">
                                    <summary className="cursor-pointer text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                                        View Raw JSON
                                    </summary>
                                    <pre className="mt-2 p-4 bg-gray-900 text-green-400 rounded-xl text-xs overflow-auto max-h-96">
                                        {JSON.stringify(result, null, 2)}
                                    </pre>
                                </details>
                            </div>
                        ) : (
                            <div className="text-center text-gray-400 dark:text-gray-500 py-12">
                                <svg className="w-16 h-16 mx-auto mb-4 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p>Upload an image and click "Analyze" to see results</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

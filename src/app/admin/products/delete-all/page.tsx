'use client'

import { useState } from 'react'

export default function DeleteAllProductsPage() {
    const [isDeleting, setIsDeleting] = useState(false)
    const [result, setResult] = useState<{
        success: boolean
        message: string
        deletedCount?: number
    } | null>(null)
    const [confirmText, setConfirmText] = useState('')

    const handleDelete = async () => {
        if (confirmText !== 'DELETE ALL') {
            alert('กรุณาพิมพ์ "DELETE ALL" เพื่อยืนยัน')
            return
        }

        if (!confirm('⚠️ คุณแน่ใจหรือไม่? การกระทำนี้ไม่สามารถย้อนกลับได้!')) {
            return
        }

        setIsDeleting(true)
        setResult(null)

        try {
            const response = await fetch('/api/admin/products/delete-all', {
                method: 'DELETE',
            })

            const data = await response.json()
            setResult(data)

            if (data.success) {
                setConfirmText('')
            }
        } catch (error) {
            setResult({
                success: false,
                message: 'เกิดข้อผิดพลาดในการลบข้อมูล: ' + (error instanceof Error ? error.message : 'Unknown error')
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="text-6xl mb-4">🗑️</div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            ลบข้อมูลสินค้าทั้งหมด
                        </h1>
                        <p className="text-gray-600">
                            Delete All Products from Database
                        </p>
                    </div>

                    {/* Warning Box */}
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
                        <div className="flex items-start">
                            <div className="text-3xl mr-4">⚠️</div>
                            <div>
                                <h3 className="text-lg font-bold text-red-900 mb-2">
                                    คำเตือนสำคัญ!
                                </h3>
                                <ul className="text-red-700 space-y-1 text-sm">
                                    <li>• การกระทำนี้จะลบสินค้าทั้งหมดใน Firestore</li>
                                    <li>• ไม่สามารถย้อนกลับได้</li>
                                    <li>• ข้อมูลที่ลบไปแล้วจะหายไปตลอดกาล</li>
                                    <li>• ควรสำรองข้อมูลก่อนดำเนินการ</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Confirmation Input */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            พิมพ์ <code className="bg-gray-100 px-2 py-1 rounded text-red-600 font-mono">DELETE ALL</code> เพื่อยืนยัน:
                        </label>
                        <input
                            type="text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="DELETE ALL"
                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-red-500 focus:outline-none font-mono"
                            disabled={isDeleting}
                        />
                    </div>

                    {/* Delete Button */}
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting || confirmText !== 'DELETE ALL'}
                        className={`w-full py-4 px-6 rounded-lg font-bold text-white text-lg transition-all ${isDeleting || confirmText !== 'DELETE ALL'
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 active:scale-95'
                            }`}
                    >
                        {isDeleting ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                กำลังลบข้อมูล...
                            </span>
                        ) : (
                            '🗑️ ลบสินค้าทั้งหมด'
                        )}
                    </button>

                    {/* Result Message */}
                    {result && (
                        <div className={`mt-6 p-4 rounded-lg ${result.success
                                ? 'bg-green-50 border-2 border-green-200'
                                : 'bg-red-50 border-2 border-red-200'
                            }`}>
                            <div className="flex items-start">
                                <div className="text-2xl mr-3">
                                    {result.success ? '✅' : '❌'}
                                </div>
                                <div>
                                    <h4 className={`font-bold mb-1 ${result.success ? 'text-green-900' : 'text-red-900'
                                        }`}>
                                        {result.success ? 'สำเร็จ!' : 'เกิดข้อผิดพลาด'}
                                    </h4>
                                    <p className={result.success ? 'text-green-700' : 'text-red-700'}>
                                        {result.message}
                                    </p>
                                    {result.deletedCount !== undefined && (
                                        <p className="text-green-600 font-mono mt-2">
                                            ลบสินค้าทั้งหมด: {result.deletedCount} รายการ
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Info Box */}
                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <div className="text-2xl mr-3">💡</div>
                            <div className="text-sm text-blue-800">
                                <p className="font-semibold mb-1">หลังจากลบข้อมูลแล้ว:</p>
                                <ul className="space-y-1">
                                    <li>• คุณสามารถสร้างสินค้าใหม่ด้วยระบบหมวดหมู่ใหม่</li>
                                    <li>• ใช้ระบบ AI Snap & Sell เพื่อลงขายอย่างรวดเร็ว</li>
                                    <li>• ระบบจะรองรับ 24 หมวดหมู่หลักและ 370+ หมวดหมู่ย่อย</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="mt-6 text-center">
                        <a
                            href="/admin"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                            ← กลับไปหน้า Admin
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

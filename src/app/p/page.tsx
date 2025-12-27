'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

/**
 * Listing Code Search Page
 * Allows users to search for listings by JK-AXXXXX code
 */
export default function ListingCodeSearchPage() {
    const [code, setCode] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        const trimmedCode = code.trim().toUpperCase()

        // Validate format
        if (!trimmedCode) {
            setError('กรุณากรอกรหัสประกาศ')
            return
        }

        // Accept both JK-AXXXXX and just AXXXXX
        const normalizedCode = trimmedCode.startsWith('JK-')
            ? trimmedCode
            : `JK-${trimmedCode}`

        // Basic validation (JK- + 1 letter + 5 alphanumeric)
        if (!/^JK-[A-Z][A-Z0-9]{1,10}$/i.test(normalizedCode)) {
            setError('รูปแบบรหัสไม่ถูกต้อง (ตัวอย่าง: JK-A00001)')
            return
        }

        router.push(`/p/${normalizedCode}`)
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
            {/* Header */}
            <header className="bg-slate-900/80 backdrop-blur-lg border-b border-white/10">
                <div className="max-w-2xl mx-auto px-4 py-4">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl">🏠</span>
                        <span className="text-white font-semibold">JaiKod</span>
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-4xl">🔍</span>
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2">
                        ค้นหาประกาศด้วยรหัส
                    </h1>
                    <p className="text-gray-400">
                        กรอกรหัสประกาศ เช่น <span className="text-purple-400 font-mono">JK-A00001</span>
                    </p>
                </div>

                {/* Search Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <div className="relative">
                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-mono">
                                🏷️
                            </span>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value.toUpperCase())
                                    setError('')
                                }}
                                placeholder="JK-A00001"
                                className={`w-full pl-12 pr-4 py-4 bg-slate-800 border ${error ? 'border-red-500' : 'border-white/10'
                                    } rounded-xl text-white text-xl font-mono text-center placeholder:text-gray-600 focus:outline-none focus:border-purple-500 transition-colors`}
                                autoFocus
                                maxLength={15}
                            />
                        </div>
                        {error && (
                            <p className="mt-2 text-red-400 text-sm text-center">
                                ⚠️ {error}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-white font-semibold text-lg transition-all shadow-lg shadow-purple-500/25"
                    >
                        🔎 ค้นหาประกาศ
                    </button>
                </form>

                {/* Examples */}
                <div className="mt-12">
                    <h3 className="text-gray-400 text-sm mb-3 text-center">ตัวอย่างรหัสประกาศ</h3>
                    <div className="flex flex-wrap justify-center gap-2">
                        {['JK-A00001', 'JK-B00012', 'JK-R00003', 'JK-L00007'].map((example) => (
                            <button
                                key={example}
                                onClick={() => setCode(example)}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-gray-300 font-mono text-sm transition-colors"
                            >
                                {example}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Legend */}
                <div className="mt-8 p-4 bg-slate-800/50 rounded-xl">
                    <h4 className="text-white font-medium mb-3">📖 ความหมายของรหัส</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center text-blue-400 font-mono">A</span>
                            <span className="text-gray-400">รถยนต์</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center text-green-400 font-mono">B</span>
                            <span className="text-gray-400">มอเตอร์ไซค์</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 bg-yellow-500/20 rounded-lg flex items-center justify-center text-yellow-400 font-mono">R</span>
                            <span className="text-gray-400">บ้าน/คอนโด</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400 font-mono">L</span>
                            <span className="text-gray-400">ที่ดิน</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-8 h-8 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400 font-mono">X</span>
                            <span className="text-gray-400">สินค้าทั่วไป</span>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

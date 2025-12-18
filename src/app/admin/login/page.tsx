'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, db } from '@/lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import { ShieldCheck, Mail, Lock, AlertCircle, Sparkles } from 'lucide-react'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            // Sign in with Firebase Auth
            const userCredential = await signInWithEmailAndPassword(auth, email, password)
            const user = userCredential.user

            // Check if user is admin
            const adminDoc = await getDoc(doc(db, 'admins', user.uid))

            if (!adminDoc.exists()) {
                setError('คุณไม่มีสิทธิ์เข้าถึงระบบ Admin')
                await auth.signOut()
                setLoading(false)
                return
            }

            // Success - redirect to admin dashboard
            router.push('/admin')
        } catch (err: any) {
            console.error('Login error:', err)
            if (err.code === 'auth/invalid-credential') {
                setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
            } else if (err.code === 'auth/user-not-found') {
                setError('ไม่พบผู้ใช้นี้ในระบบ')
            } else if (err.code === 'auth/wrong-password') {
                setError('รหัสผ่านไม่ถูกต้อง')
            } else {
                setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
            }
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo & Title */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-6 shadow-2xl shadow-purple-500/50 relative">
                        <ShieldCheck className="w-14 h-14 text-white" />
                        <div className="absolute -top-1 -right-1">
                            <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                        </div>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight leading-tight">
                        <div className="mb-2">
                            ซื้อ–ขาย<span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ง่ายกว่าเดิม</span>
                        </div>
                        <div className="text-2xl md:text-3xl font-light text-purple-200">
                            ด้วยพลังของ AI อัจฉริยะ
                        </div>
                    </h1>
                    <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                        <span className="text-sm text-white font-medium">ระบบพร้อมใช้งาน</span>
                    </div>
                </div>

                {/* Login Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-start gap-3 animate-shake">
                                <AlertCircle className="w-5 h-5 text-red-300 shrink-0 mt-0.5" />
                                <div>
                                    <p className="text-sm font-medium text-red-100">{error}</p>
                                    <p className="text-xs text-red-200 mt-1">กรุณาตรวจสอบข้อมูลและลองใหม่อีกครั้ง</p>
                                </div>
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                อีเมล
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 group-focus-within:text-purple-200 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                    placeholder="admin@jaikod.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">
                                รหัสผ่าน
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-300 group-focus-within:text-purple-200 transition-colors" />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold text-lg hover:from-purple-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-purple-500/50 hover:shadow-xl hover:shadow-purple-500/60 transform hover:scale-[1.02] active:scale-[0.98]"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    กำลังเข้าสู่ระบบ...
                                </span>
                            ) : (
                                'เข้าสู่ระบบ'
                            )}
                        </button>
                    </form>

                    {/* Dev Mode Hint */}
                    <div className="mt-6 p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-xl backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-yellow-300 shrink-0 mt-0.5" />
                            <div>
                                <p className="text-sm font-bold text-yellow-100 mb-1">
                                    โหมดพัฒนา (Development Mode)
                                </p>
                                <p className="text-xs text-yellow-200">
                                    <strong>อีเมล:</strong> admin@jaikod.com<br />
                                    <strong>รหัสผ่าน:</strong> admin123
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center">
                    <p className="text-purple-200 text-sm">
                        © 2024 JaiKod - AI Marketplace Platform
                    </p>
                    <p className="text-purple-300 text-xs mt-2">
                        Powered by Firebase & Next.js
                    </p>
                </div>
            </div>

            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
                @keyframes shake {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                    20%, 40%, 60%, 80% { transform: translateX(5px); }
                }
                .animate-shake {
                    animation: shake 0.5s;
                }
            `}</style>
        </div>
    )
}

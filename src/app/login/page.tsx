'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'

export default function LoginPage() {
    const router = useRouter()
    const { signIn, user, loading } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        if (!loading && user) {
            router.push('/')
        }
    }, [user, loading, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await signIn(formData.email, formData.password)
            // Success! Redirect to home
            router.push('/')
        } catch (err: any) {
            console.error('Login error:', err)

            // Handle Firebase errors
            if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
                setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
            } else if (err.code === 'auth/invalid-email') {
                setError('รูปแบบอีเมลไม่ถูกต้อง')
            } else if (err.code === 'auth/user-disabled') {
                setError('บัญชีนี้ถูกระงับการใช้งาน')
            } else {
                setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง (' + err.code + ')')
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-bg-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-bg-dark">
            <div className="w-full max-w-md bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold mb-2">ยินดีต้อนรับกลับ</h1>
                    <p className="text-text-secondary dark:text-gray-400">เข้าสู่ระบบเพื่อจัดการร้านค้าของคุณ</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="อีเมล"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        required
                    />
                    <Input
                        label="รหัสผ่าน"
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input type="checkbox" className="rounded text-neon-purple focus:ring-neon-purple/20" />
                            <span className="text-text-secondary dark:text-gray-400">จดจำฉัน</span>
                        </label>
                        <Link href="/forgot-password" className="text-neon-purple hover:text-purple-600 font-medium">
                            ลืมรหัสผ่าน?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        เข้าสู่ระบบ
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-text-secondary dark:text-gray-400">
                    ยังไม่มีบัญชี?{' '}
                    <Link href="/register" className="text-neon-purple hover:text-purple-600 font-medium">
                        สมัครสมาชิก
                    </Link>
                </div>
            </div>
        </div>
    )
}

'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'

export default function RegisterPage() {
    const router = useRouter()
    const { signUp, user, loading } = useAuth()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!loading && user) {
            router.push('/')
        }
    }, [user, loading, router])
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError('รหัสผ่านไม่ตรงกัน')
            return
        }

        if (formData.password.length < 6) {
            setError('รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร')
            return
        }

        setIsLoading(true)

        try {
            const displayName = `${formData.firstName} ${formData.lastName}`
            await signUp(formData.email, formData.password, displayName)

            // Success! Redirect to home
            router.push('/')
        } catch (err: any) {
            console.error('Registration error:', err)

            // Handle Firebase errors
            if (err.code === 'auth/email-already-in-use') {
                setError('อีเมลนี้ถูกใช้งานแล้ว')
            } else if (err.code === 'auth/invalid-email') {
                setError('รูปแบบอีเมลไม่ถูกต้อง')
            } else if (err.code === 'auth/weak-password') {
                setError('รหัสผ่านไม่ปลอดภัยเพียงพอ')
            } else {
                setError('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง')
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

    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-bg-dark">
            <div className="w-full max-w-md bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-display font-bold mb-2">สมัครสมาชิก</h1>
                    <p className="text-text-secondary dark:text-gray-400">เริ่มต้นขายของกับ JaiKod วันนี้</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label="ชื่อ"
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder="สมชาย"
                            required
                        />
                        <Input
                            label="นามสกุล"
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder="ใจดี"
                            required
                        />
                    </div>
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
                    <Input
                        label="ยืนยันรหัสผ่าน"
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    <div className="text-xs text-text-secondary dark:text-gray-400 mb-4">
                        การคลิกปุ่มสมัครสมาชิก แสดงว่าคุณยอมรับ <Link href="/terms" className="text-neon-purple">ข้อกำหนดและเงื่อนไข</Link> และ <Link href="/privacy" className="text-neon-purple">นโยบายความเป็นส่วนตัว</Link> ของเรา
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        สมัครสมาชิก
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-text-secondary dark:text-gray-400">
                    มีบัญชีอยู่แล้ว?{' '}
                    <Link href="/login" className="text-neon-purple hover:text-purple-600 font-medium">
                        เข้าสู่ระบบ
                    </Link>
                </div>
            </div>
        </div>
    )
}

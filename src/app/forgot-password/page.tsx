'use client'

import Link from 'next/link'
import { useState } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPasswordPage() {
    const { resetPassword } = useAuth()
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [email, setEmail] = useState('')

    const t = {
        title: lang === 'th' ? 'ลืมรหัสผ่าน?' : 'Forgot Password?',
        subtitle: lang === 'th'
            ? 'กรอกอีเมลของคุณ เราจะส่งลิงก์รีเซ็ตรหัสผ่านให้'
            : 'Enter your email and we\'ll send you a reset link',
        email: lang === 'th' ? 'อีเมล' : 'Email',
        sendLink: lang === 'th' ? 'ส่งลิงก์รีเซ็ต' : 'Send Reset Link',
        backToLogin: lang === 'th' ? 'กลับไปหน้าเข้าสู่ระบบ' : 'Back to Login',
        successTitle: lang === 'th' ? 'ส่งอีเมลแล้ว!' : 'Email Sent!',
        successMessage: lang === 'th'
            ? 'กรุณาตรวจสอบกล่องจดหมายของคุณ และคลิกลิงก์เพื่อรีเซ็ตรหัสผ่าน'
            : 'Please check your inbox and click the link to reset your password',
        checkSpam: lang === 'th'
            ? 'หากไม่พบอีเมล กรุณาตรวจสอบโฟลเดอร์ Spam'
            : 'If you don\'t see it, check your Spam folder',
        tryAgain: lang === 'th' ? 'ส่งอีกครั้ง' : 'Send Again',
        errUserNotFound: lang === 'th' ? 'ไม่พบอีเมลนี้ในระบบ' : 'Email not found',
        errInvalidEmail: lang === 'th' ? 'รูปแบบอีเมลไม่ถูกต้อง' : 'Invalid email format',
        errTooMany: lang === 'th' ? 'คำขอมากเกินไป กรุณาลองใหม่ภายหลัง' : 'Too many requests. Please try again later',
        errGeneric: lang === 'th' ? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' : 'An error occurred. Please try again',
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            await resetPassword(email)
            setSuccess(true)
        } catch (err: any) {
            console.error('Reset password error:', err)

            if (err.code === 'auth/user-not-found') {
                setError(t.errUserNotFound)
            } else if (err.code === 'auth/invalid-email') {
                setError(t.errInvalidEmail)
            } else if (err.code === 'auth/too-many-requests') {
                setError(t.errTooMany)
            } else {
                setError(t.errGeneric)
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-bg-dark">
            <div className="w-full max-w-md bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                {success ? (
                    // Success State
                    <div className="text-center">
                        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-emerald-500" />
                        </div>
                        <h1 className="text-2xl font-display font-bold mb-2">{t.successTitle}</h1>
                        <p className="text-text-secondary dark:text-gray-400 mb-2">{t.successMessage}</p>
                        <p className="text-sm text-text-secondary dark:text-gray-500 mb-6">{t.checkSpam}</p>

                        <div className="space-y-3">
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setSuccess(false)
                                    setEmail('')
                                }}
                            >
                                {t.tryAgain}
                            </Button>
                            <Link href="/login">
                                <Button className="w-full">
                                    {t.backToLogin}
                                </Button>
                            </Link>
                        </div>
                    </div>
                ) : (
                    // Form State
                    <>
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-neon-purple/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Mail className="w-8 h-8 text-neon-purple" />
                            </div>
                            <h1 className="text-3xl font-display font-bold mb-2">{t.title}</h1>
                            <p className="text-text-secondary dark:text-gray-400">{t.subtitle}</p>
                        </div>

                        {error && (
                            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                label={t.email}
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="example@email.com"
                                required
                            />

                            <Button
                                type="submit"
                                className="w-full"
                                isLoading={isLoading}
                            >
                                {t.sendLink}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 text-sm text-neon-purple hover:text-purple-600 font-medium"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                {t.backToLogin}
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}

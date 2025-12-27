'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'

export default function RegisterPage() {
    const router = useRouter()
    const { signUp, signInWithGoogle, signInWithFacebook, signInWithLine, user, loading } = useAuth()
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const t = {
        title: lang === 'th' ? 'สมัครสมาชิก' : 'Sign Up',
        subtitle: lang === 'th' ? 'เริ่มต้นขายของกับ JaiKod วันนี้' : 'Start selling with JaiKod today',
        firstName: lang === 'th' ? 'ชื่อ' : 'First Name',
        lastName: lang === 'th' ? 'นามสกุล' : 'Last Name',
        email: lang === 'th' ? 'อีเมล' : 'Email',
        password: lang === 'th' ? 'รหัสผ่าน' : 'Password',
        confirmPassword: lang === 'th' ? 'ยืนยันรหัสผ่าน' : 'Confirm Password',
        terms: lang === 'th'
            ? 'การคลิกปุ่มสมัครสมาชิก แสดงว่าคุณยอมรับ'
            : 'By clicking Sign Up, you agree to our',
        termsLink: lang === 'th' ? 'ข้อกำหนดและเงื่อนไข' : 'Terms & Conditions',
        and: lang === 'th' ? 'และ' : 'and',
        privacyLink: lang === 'th' ? 'นโยบายความเป็นส่วนตัว' : 'Privacy Policy',
        signUp: lang === 'th' ? 'สมัครสมาชิก' : 'Sign Up',
        haveAccount: lang === 'th' ? 'มีบัญชีอยู่แล้ว?' : 'Already have an account?',
        login: lang === 'th' ? 'เข้าสู่ระบบ' : 'Sign In',
        errPasswordMismatch: lang === 'th' ? 'รหัสผ่านไม่ตรงกัน' : 'Passwords do not match',
        errPasswordLength: lang === 'th' ? 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' : 'Password must be at least 6 characters',
        errEmailInUse: lang === 'th' ? 'อีเมลนี้ถูกใช้งานแล้ว' : 'This email is already in use',
        errInvalidEmail: lang === 'th' ? 'รูปแบบอีเมลไม่ถูกต้อง' : 'Invalid email format',
        errWeakPassword: lang === 'th' ? 'รหัสผ่านไม่ปลอดภัยเพียงพอ' : 'Password is not strong enough',
        errGeneric: lang === 'th' ? 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' : 'An error occurred. Please try again',
        orContinueWith: lang === 'th' ? 'หรือสมัครด้วย' : 'Or sign up with',
        continueGoogle: lang === 'th' ? 'Google' : 'Google',
        continueFacebook: lang === 'th' ? 'Facebook' : 'Facebook',
        continueLine: lang === 'th' ? 'LINE' : 'LINE',
        socialError: lang === 'th' ? 'ไม่สามารถสมัครได้ กรุณาลองใหม่' : 'Unable to sign up. Please try again',
    }

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
            setError(t.errPasswordMismatch)
            return
        }

        if (formData.password.length < 6) {
            setError(t.errPasswordLength)
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
                setError(t.errEmailInUse)
            } else if (err.code === 'auth/invalid-email') {
                setError(t.errInvalidEmail)
            } else if (err.code === 'auth/weak-password') {
                setError(t.errWeakPassword)
            } else {
                setError(t.errGeneric)
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
                    <h1 className="text-3xl font-display font-bold mb-2">{t.title}</h1>
                    <p className="text-text-secondary dark:text-gray-400">{t.subtitle}</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input
                            label={t.firstName}
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                            placeholder={lang === 'th' ? 'สมชาย' : 'John'}
                            required
                        />
                        <Input
                            label={t.lastName}
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                            placeholder={lang === 'th' ? 'ใจดี' : 'Doe'}
                            required
                        />
                    </div>
                    <Input
                        label={t.email}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="example@email.com"
                        required
                    />
                    <Input
                        label={t.password}
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />
                    <Input
                        label={t.confirmPassword}
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        required
                    />

                    <div className="text-xs text-text-secondary dark:text-gray-400 mb-4">
                        {t.terms} <Link href="/terms" className="text-neon-purple">{t.termsLink}</Link> {t.and} <Link href="/privacy" className="text-neon-purple">{t.privacyLink}</Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        {t.signUp}
                    </Button>
                </form>

                {/* Social Login Divider */}
                <div className="my-6 flex items-center gap-4">
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                    <span className="text-sm text-text-secondary dark:text-gray-400">{t.orContinueWith}</span>
                    <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                </div>

                {/* Social Login Buttons */}
                <div className="space-y-3">
                    {/* Google */}
                    <button
                        type="button"
                        onClick={async () => {
                            setError('')
                            setIsLoading(true)
                            try {
                                await signInWithGoogle()
                                router.push('/')
                            } catch (err: any) {
                                if (err.code !== 'auth/popup-closed-by-user') {
                                    setError(t.socialError)
                                }
                            } finally {
                                setIsLoading(false)
                            }
                        }}
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium transition-all hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        <span>{t.continueGoogle}</span>
                    </button>

                    {/* Facebook */}
                    <button
                        type="button"
                        onClick={async () => {
                            setError('')
                            setIsLoading(true)
                            try {
                                await signInWithFacebook()
                                router.push('/')
                            } catch (err: any) {
                                if (err.code !== 'auth/popup-closed-by-user') {
                                    setError(t.socialError)
                                }
                            } finally {
                                setIsLoading(false)
                            }
                        }}
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 bg-[#1877F2] text-white rounded-xl text-sm font-medium transition-all hover:bg-[#166FE5] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                        <span>{t.continueFacebook}</span>
                    </button>

                    {/* LINE */}
                    <button
                        type="button"
                        onClick={async () => {
                            setError('')
                            setIsLoading(true)
                            try {
                                await signInWithLine()
                                router.push('/')
                            } catch (err: any) {
                                if (err.code !== 'auth/popup-closed-by-user') {
                                    setError(t.socialError)
                                }
                            } finally {
                                setIsLoading(false)
                            }
                        }}
                        disabled={isLoading}
                        className="w-full py-2.5 px-4 bg-[#00B900] text-white rounded-xl text-sm font-medium transition-all hover:bg-[#00A000] flex items-center justify-center gap-3 disabled:opacity-50"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .348-.281.632-.63.632H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .349-.281.631-.63.631h-2.386c-.345 0-.627-.282-.627-.63V8.108c0-.346.282-.63.63-.63h2.386c.349 0 .63.284.63.63 0 .348-.281.631-.63.631H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .346-.281.63-.629.63M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
                        </svg>
                        <span>{t.continueLine}</span>
                    </button>
                </div>

                <div className="mt-6 text-center text-sm text-text-secondary dark:text-gray-400">
                    {t.haveAccount}{' '}
                    <Link href="/login" className="text-neon-purple hover:text-purple-600 font-medium">
                        {t.login}
                    </Link>
                </div>
            </div>
        </div>
    )
}

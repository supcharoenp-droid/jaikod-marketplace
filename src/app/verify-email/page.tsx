'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'
import { useAuth } from '@/contexts/AuthContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { Mail, CheckCircle, RefreshCw, ArrowRight } from 'lucide-react'
import { sendEmailVerification } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function VerifyEmailPage() {
    const router = useRouter()
    const { user, loading } = useAuth()
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'
    const [isResending, setIsResending] = useState(false)
    const [resendSuccess, setResendSuccess] = useState(false)
    const [cooldown, setCooldown] = useState(0)

    const t = {
        title: lang === 'th' ? 'ยืนยันอีเมลของคุณ' : 'Verify Your Email',
        subtitle: lang === 'th'
            ? 'เราส่งลิงก์ยืนยันไปที่อีเมลของคุณแล้ว'
            : 'We\'ve sent a verification link to your email',
        checkInbox: lang === 'th'
            ? 'กรุณาตรวจสอบกล่องจดหมายและคลิกลิงก์เพื่อยืนยันบัญชี'
            : 'Please check your inbox and click the link to verify your account',
        checkSpam: lang === 'th'
            ? 'หากไม่พบอีเมล กรุณาตรวจสอบโฟลเดอร์ Spam'
            : 'If you don\'t see it, check your Spam folder',
        resendEmail: lang === 'th' ? 'ส่งอีเมลอีกครั้ง' : 'Resend Email',
        resendIn: lang === 'th' ? 'ส่งได้อีกครั้งใน' : 'Resend available in',
        seconds: lang === 'th' ? 'วินาที' : 'seconds',
        emailSent: lang === 'th' ? 'ส่งอีเมลแล้ว!' : 'Email Sent!',
        continueToHome: lang === 'th' ? 'ไปหน้าหลัก' : 'Continue to Home',
        alreadyVerified: lang === 'th' ? 'ยืนยันอีเมลแล้ว? ' : 'Already verified? ',
        refresh: lang === 'th' ? 'รีเฟรชสถานะ' : 'Refresh Status',
        verified: lang === 'th' ? 'ยืนยันอีเมลเรียบร้อยแล้ว!' : 'Email Verified!',
        verifiedDesc: lang === 'th'
            ? 'บัญชีของคุณพร้อมใช้งานแล้ว'
            : 'Your account is now ready to use',
        startShopping: lang === 'th' ? 'เริ่มช้อปปิ้ง' : 'Start Shopping',
    }

    // Countdown timer for resend cooldown
    useEffect(() => {
        if (cooldown > 0) {
            const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
            return () => clearTimeout(timer)
        }
    }, [cooldown])

    // Redirect if not logged in
    useEffect(() => {
        if (!loading && !user) {
            router.push('/login')
        }
    }, [user, loading, router])

    const handleResend = async () => {
        if (!user || cooldown > 0) return

        setIsResending(true)
        try {
            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser)
                setResendSuccess(true)
                setCooldown(60) // 60 seconds cooldown

                // Reset success message after 3 seconds
                setTimeout(() => setResendSuccess(false), 3000)
            }
        } catch (error) {
            console.error('Error resending verification email:', error)
        } finally {
            setIsResending(false)
        }
    }

    const handleRefresh = async () => {
        if (auth.currentUser) {
            await auth.currentUser.reload()
            if (auth.currentUser.emailVerified) {
                router.push('/')
            }
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-bg-dark">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-purple"></div>
            </div>
        )
    }

    // Check if email is already verified
    if (user?.emailVerified) {
        return (
            <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-bg-dark">
                <div className="w-full max-w-md bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 text-center">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-2xl font-display font-bold mb-2">{t.verified}</h1>
                    <p className="text-text-secondary dark:text-gray-400 mb-6">{t.verifiedDesc}</p>

                    <Link href="/">
                        <Button className="w-full">
                            {t.startShopping}
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-gray-50 dark:bg-bg-dark">
            <div className="w-full max-w-md bg-white dark:bg-surface-dark p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <div className="text-center">
                    <div className="w-20 h-20 bg-neon-purple/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-10 h-10 text-neon-purple" />
                    </div>
                    <h1 className="text-2xl font-display font-bold mb-2">{t.title}</h1>
                    <p className="text-text-secondary dark:text-gray-400 mb-1">{t.subtitle}</p>
                    {user?.email && (
                        <p className="text-neon-purple font-medium mb-4">{user.email}</p>
                    )}
                    <p className="text-sm text-text-secondary dark:text-gray-500 mb-2">{t.checkInbox}</p>
                    <p className="text-sm text-text-secondary dark:text-gray-500 mb-6">{t.checkSpam}</p>

                    {resendSuccess && (
                        <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg">
                            <p className="text-sm text-emerald-600 dark:text-emerald-400 flex items-center justify-center gap-2">
                                <CheckCircle className="w-4 h-4" />
                                {t.emailSent}
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={handleResend}
                            disabled={isResending || cooldown > 0}
                        >
                            <RefreshCw className={`w-4 h-4 mr-2 ${isResending ? 'animate-spin' : ''}`} />
                            {cooldown > 0
                                ? `${t.resendIn} ${cooldown} ${t.seconds}`
                                : t.resendEmail
                            }
                        </Button>

                        <Link href="/">
                            <Button className="w-full">
                                {t.continueToHome}
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800">
                        <p className="text-sm text-text-secondary dark:text-gray-400 mb-2">
                            {t.alreadyVerified}
                        </p>
                        <button
                            onClick={handleRefresh}
                            className="text-sm text-neon-purple hover:text-purple-600 font-medium inline-flex items-center gap-1"
                        >
                            <RefreshCw className="w-3 h-3" />
                            {t.refresh}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

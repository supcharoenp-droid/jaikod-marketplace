'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { AlertTriangle, RefreshCw, Home, MessageCircle } from 'lucide-react'

interface ErrorBoundaryProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function GlobalError({ error, reset }: ErrorBoundaryProps) {
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'

    const t = {
        title: lang === 'th' ? 'เกิดข้อผิดพลาด' : 'Something went wrong',
        description: lang === 'th'
            ? 'ขออภัย เกิดข้อผิดพลาดบางอย่าง กรุณาลองใหม่อีกครั้ง'
            : 'Sorry, something went wrong. Please try again.',
        tryAgain: lang === 'th' ? 'ลองใหม่' : 'Try Again',
        goHome: lang === 'th' ? 'กลับหน้าหลัก' : 'Go to Home',
        contactSupport: lang === 'th' ? 'ติดต่อฝ่ายสนับสนุน' : 'Contact Support',
        errorId: lang === 'th' ? 'รหัสข้อผิดพลาด' : 'Error ID',
    }

    useEffect(() => {
        // Log error to error tracking service (e.g., Sentry)
        console.error('[GlobalError]', error)

        // You can add Sentry or other error tracking here
        // if (typeof window !== 'undefined' && window.Sentry) {
        //     window.Sentry.captureException(error)
        // }
    }, [error])

    return (
        <html>
            <body>
                <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
                    <div className="max-w-md w-full text-center">
                        {/* Error Icon */}
                        <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-10 h-10 text-red-500" />
                        </div>

                        {/* Error Message */}
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {t.title}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                            {t.description}
                        </p>

                        {/* Error ID (for debugging) */}
                        {error.digest && (
                            <p className="text-xs text-gray-400 mb-6 font-mono">
                                {t.errorId}: {error.digest}
                            </p>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={reset}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-neon-purple text-white rounded-xl font-medium hover:bg-purple-600 transition-colors"
                            >
                                <RefreshCw className="w-4 h-4" />
                                {t.tryAgain}
                            </button>

                            <a
                                href="/"
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                {t.goHome}
                            </a>
                        </div>

                        {/* Support Link */}
                        <div className="mt-8">
                            <a
                                href="/contact"
                                className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-neon-purple transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                {t.contactSupport}
                            </a>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}

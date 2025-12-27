'use client'

import { useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { AlertTriangle, RefreshCw, Home, ChevronLeft } from 'lucide-react'
import Button from '@/components/ui/Button'

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    const { language } = useLanguage()
    const lang = language as 'th' | 'en'

    const t = {
        title: lang === 'th' ? 'เกิดข้อผิดพลาด' : 'Something went wrong',
        description: lang === 'th'
            ? 'ขออภัย เกิดข้อผิดพลาดในการโหลดหน้านี้ กรุณาลองใหม่อีกครั้ง'
            : 'Sorry, there was an error loading this page. Please try again.',
        tryAgain: lang === 'th' ? 'ลองใหม่' : 'Try Again',
        goBack: lang === 'th' ? 'ย้อนกลับ' : 'Go Back',
        goHome: lang === 'th' ? 'กลับหน้าหลัก' : 'Go to Home',
        errorDetails: lang === 'th' ? 'รายละเอียด' : 'Error Details',
    }

    useEffect(() => {
        console.error('[PageError]', error)
    }, [error])

    return (
        <div className="min-h-[60vh] flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full text-center">
                {/* Error Icon */}
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="w-8 h-8 text-red-500" />
                </div>

                {/* Error Message */}
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {t.title}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {t.description}
                </p>

                {/* Error Details (collapsed by default) */}
                {process.env.NODE_ENV === 'development' && (
                    <details className="mb-6 text-left bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
                        <summary className="text-sm font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
                            {t.errorDetails}
                        </summary>
                        <pre className="mt-2 text-xs text-red-600 dark:text-red-400 overflow-auto">
                            {error.message}
                            {error.stack && `\n\n${error.stack}`}
                        </pre>
                    </details>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={reset}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {t.tryAgain}
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => window.history.back()}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        {t.goBack}
                    </Button>
                </div>

                {/* Home Link */}
                <div className="mt-6">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-neon-purple hover:text-purple-600 transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        {t.goHome}
                    </a>
                </div>
            </div>
        </div>
    )
}

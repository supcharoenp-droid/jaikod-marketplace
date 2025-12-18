'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import Button from '@/components/ui/Button'
import { Globe, RefreshCw } from 'lucide-react'

export default function LanguageFixTool() {
    const { user } = useAuth()
    const [fixing, setFixing] = useState(false)
    const [result, setResult] = useState('')

    const fixLanguageToThai = async () => {
        if (!user) {
            setResult('❌ Please login first')
            return
        }

        setFixing(true)
        setResult('⏳ Fixing language...')

        try {
            // Update Firebase
            await updateDoc(doc(db, 'users', user.uid), {
                language: 'TH'
            })

            // Update localStorage
            localStorage.setItem('app-language', 'th')

            setResult('✅ Language fixed! Reloading in 2 seconds...')

            // Reload page
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } catch (error) {
            console.error('Error fixing language:', error)
            setResult('❌ Error: ' + (error as Error).message)
            setFixing(false)
        }
    }

    const fixLanguageToEnglish = async () => {
        if (!user) {
            setResult('❌ Please login first')
            return
        }

        setFixing(true)
        setResult('⏳ Fixing language...')

        try {
            // Update Firebase
            await updateDoc(doc(db, 'users', user.uid), {
                language: 'EN'
            })

            // Update localStorage
            localStorage.setItem('app-language', 'en')

            setResult('✅ Language fixed! Reloading in 2 seconds...')

            // Reload page
            setTimeout(() => {
                window.location.reload()
            }, 2000)
        } catch (error) {
            console.error('Error fixing language:', error)
            setResult('❌ Error: ' + (error as Error).message)
            setFixing(false)
        }
    }

    if (!user) {
        return (
            <div className="p-6 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-red-700">Please login to use this tool</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-indigo-600" />
                    <h2 className="text-xl font-bold text-gray-900">Language Fix Tool</h2>
                </div>

                <p className="text-gray-600 mb-6">
                    If the language is not changing, use this tool to force update your language preference in Firebase.
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <Button
                        onClick={fixLanguageToThai}
                        disabled={fixing}
                        variant="primary"
                        className="w-full"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${fixing ? 'animate-spin' : ''}`} />
                        Fix to Thai (ไทย)
                    </Button>

                    <Button
                        onClick={fixLanguageToEnglish}
                        disabled={fixing}
                        variant="outline"
                        className="w-full"
                    >
                        <RefreshCw className={`w-4 h-4 mr-2 ${fixing ? 'animate-spin' : ''}`} />
                        Fix to English (EN)
                    </Button>
                </div>

                {result && (
                    <div className={`p-4 rounded-xl ${result.includes('✅') ? 'bg-green-50 text-green-700' :
                            result.includes('❌') ? 'bg-red-50 text-red-700' :
                                'bg-blue-50 text-blue-700'
                        }`}>
                        <p className="font-medium">{result}</p>
                    </div>
                )}

                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <h3 className="font-bold text-gray-900 mb-2">Current User Info:</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>UID:</strong> {user.uid}</p>
                        <p><strong>localStorage:</strong> {localStorage.getItem('app-language') || 'not set'}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

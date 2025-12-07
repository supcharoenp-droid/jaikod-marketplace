'use client'

import { useState } from 'react'
import { auth } from '@/lib/firebase'
import { createUserWithEmailAndPassword } from 'firebase/auth'

export default function TestFirebasePage() {
    const [status, setStatus] = useState('Waiting...')
    const [error, setError] = useState('')

    const testConnection = async () => {
        setStatus('Testing connection...')
        setError('')
        try {
            // Try to create a dummy user (will likely fail if auth is disabled, but will verify connection)
            // Or just check if auth object is initialized
            if (auth) {
                setStatus('Firebase initialized successfully!')
                const email = `test_${Date.now()}@example.com`
                setStatus(`Attempting to register ${email}...`)

                await createUserWithEmailAndPassword(auth, email, 'Password123!')
                setStatus('SUCCESS! User created in Firebase.')
            } else {
                throw new Error('Auth object is null')
            }
        } catch (err: any) {
            console.error(err)
            setError(err.message + (err.code ? ` (${err.code})` : ''))
            setStatus('FAILED')
        }
    }

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-4">Firebase Connection Test</h1>
            <button
                onClick={testConnection}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                Start Test
            </button>
            <div className="mt-4 p-4 border rounded bg-gray-50">
                <p>Status: <span className="font-semibold">{status}</span></p>
                {error && <p className="text-red-500 mt-2">Error: {error}</p>}
            </div>
            <div className="mt-4 text-xs text-gray-500">
                <p>Config Check:</p>
                <pre>{JSON.stringify({
                    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Present' : 'Missing',
                    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
                    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
                }, null, 2)}</pre>
            </div>
        </div>
    )
}

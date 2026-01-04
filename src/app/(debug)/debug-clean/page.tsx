
'use client'
import { useState, useEffect } from 'react'
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, doc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore'

// Independent Firebase Init to avoid circular dep crashes
function getDb() {
    const firebaseConfig = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
    }

    const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp()
    return getFirestore(app)
}

export default function CleanTopupPage() {
    const [status, setStatus] = useState('Idle')
    const [error, setError] = useState<string | null>(null)

    const doTopup = async () => {
        setStatus('Processing...')
        setError(null)
        try {
            const db = getDb()
            const userId = 'QSNb9fGPr5dFaBUiKMBAhJT7kFs2'
            const amount = 9999

            // 1. Update Legacy Wallet
            const walletRef = doc(db, 'wallets', userId)
            await setDoc(walletRef, {
                userId,
                balance: amount,
                updatedAt: serverTimestamp(),
                isInitialized: true
            }, { merge: true })

            // 3. New Transaction
            const txRef = collection(db, 'wallet_transactions')
            await addDoc(txRef, {
                userId,
                type: 'topup',
                amount: amount,
                balanceAfter: amount,
                description: 'Admin Top-up (Clean Fix)',
                status: 'success',
                createdAt: serverTimestamp()
            })

            setStatus('Success!')
        } catch (e: any) {
            console.error(e)
            setError(e.message)
            setStatus('Failed')
        }
    }

    return (
        <div className="p-10 text-center">
            <h1 className="text-2xl font-bold mb-4">Clean Sync Tool</h1>
            <p className="mb-4">Target: QSNb9fGPr5dFaBUiKMBAhJT7kFs2</p>
            <button
                id="do-sync-btn"
                onClick={doTopup}
                className="bg-blue-600 text-white px-6 py-3 rounded hover:bg-blue-700"
            >
                Sync Wallets (9999)
            </button>
            <div className="mt-4 text-xl font-bold">{status}</div>
            {error && <div className="text-red-500 mt-2">{error}</div>}
        </div>
    )
}

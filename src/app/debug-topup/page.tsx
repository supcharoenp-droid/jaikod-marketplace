'use client'
import { useState } from 'react'
import { db } from '@/lib/firebase'
import { doc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore'

export default function TopupPage() {
    const [status, setStatus] = useState('Idle')
    const [error, setError] = useState<string | null>(null)

    const doTopup = async () => {
        setStatus('Processing...')
        setError(null)
        try {
            // Static imports are already loaded
            const userId = 'QSNb9fGPr5dFaBUiKMBAhJT7kFs2'
            const amount = 9999

            // 1. Update Legacy Wallet
            const walletRef = doc(db, 'wallets', userId)
            await setDoc(walletRef, {
                userId,
                balance: amount, // Direct set to 9999 as requested
                updatedAt: serverTimestamp(),
                isInitialized: true
            }, { merge: true })

            // 2. Update JaiStar Account (New System)
            const jaistarRef = doc(db, 'jaistar_accounts', userId)
            await setDoc(jaistarRef, {
                user_id: userId,
                balance: amount,
                tier: 'gold', // Give them gold for fun/testing
                tier_points: amount,
                lifetime_earned: amount,
                updated_at: serverTimestamp(),
                created_at: serverTimestamp() // Safe to merge
            }, { merge: true })

            const txRef = collection(db, 'wallet_transactions')
            await addDoc(txRef, {
                userId,
                type: 'topup',
                amount: amount,
                balanceAfter: amount,
                description: 'Admin Top-up (9999 JaiStar Request)',
                status: 'success',
                createdAt: serverTimestamp()
            })

            setStatus('Success!')
        } catch (e: any) {
            console.error(e)
            setError(e.message || 'Unknown error occurred')
            setStatus('Failed')
        }
    }

    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ color: '#6366f1' }}>Internal JaiStar Management</h1>
            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                <p><strong>Target Account:</strong> chart_bma@hotmail.com</p>
                <p><strong>UID:</strong> QSNb9fGPr5dFaBUiKMBAhJT7kFs2</p>
                <p><strong>Action:</strong> Set Balance to 9999 JaiStar</p>
            </div>

            <button
                id="topup-btn"
                onClick={doTopup}
                disabled={status === 'Processing...' || status === 'Initializing Firebase...'}
                style={{
                    padding: '12px 30px',
                    fontSize: '18px',
                    background: status === 'Success!' ? '#10b981' : '#6366f1',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: (status === 'Processing...' || status === 'Initializing Firebase...') ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
            >
                {status === 'Success!' ? 'Done!' : 'Execute Top-up 9999'}
            </button>

            <div style={{ marginTop: '30px' }}>
                <div style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    background: status === 'Success!' ? '#dcfce7' : status === 'Failed' ? '#fee2e2' : '#f1f5f9',
                    color: status === 'Success!' ? '#166534' : status === 'Failed' ? '#991b1b' : '#475569',
                    fontSize: '16px',
                    fontWeight: 'bold'
                }}>
                    Status: {status}
                </div>
            </div>

            {error && (
                <div style={{ color: '#ef4444', marginTop: '20px', padding: '10px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '8px' }}>
                    <strong>Error:</strong> {error}
                </div>
            )}

            {status === 'Success!' && (
                <div style={{ marginTop: '20px', color: '#64748b' }}>
                    The user now has a balance of 9999 JaiStar.
                </div>
            )}
        </div>
    )
}

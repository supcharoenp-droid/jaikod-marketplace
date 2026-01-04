'use client'

import { useEffect, useState } from 'react'
import { db } from '@/lib/firebase'
import { collection, getDocs, doc, updateDoc, Timestamp, query, limit } from 'firebase/firestore'

export default function FixDataPage() {
    const [logs, setLogs] = useState<string[]>([])
    const [isFixing, setIsFixing] = useState(false)
    const [fixed, setFixed] = useState(false)

    const addLog = (message: string) => {
        setLogs(prev => [...prev, message])
    }

    const fixListings = async () => {
        setIsFixing(true)
        addLog('🔧 Starting data fix...')

        try {
            const listingsRef = collection(db, 'listings')
            const snapshot = await getDocs(query(listingsRef, limit(50)))

            addLog(`📦 Found ${snapshot.size} listings`)

            let fixedCount = 0

            for (const docSnap of snapshot.docs) {
                const data = docSnap.data()
                const updates: Record<string, any> = {}

                // Check if created_at is invalid (empty object or missing)
                const createdAt = data.created_at
                const isCreatedAtInvalid =
                    !createdAt ||
                    (typeof createdAt === 'object' && !createdAt?.toDate && !createdAt?.seconds)

                if (isCreatedAtInvalid) {
                    // Use published_at, updated_at, or current time as fallback
                    const fallbackDate =
                        data.published_at?.toDate?.() ||
                        data.updated_at?.toDate?.() ||
                        new Date()

                    updates.created_at = Timestamp.fromDate(fallbackDate)
                    addLog(`⚙️ Fixing ${docSnap.id}: created_at was invalid, setting to ${fallbackDate.toISOString()}`)
                }

                // Check if updated_at is invalid
                const updatedAt = data.updated_at
                const isUpdatedAtInvalid =
                    !updatedAt ||
                    (typeof updatedAt === 'object' && !updatedAt?.toDate && !updatedAt?.seconds)

                if (isUpdatedAtInvalid) {
                    updates.updated_at = Timestamp.fromDate(new Date())
                }

                // Check if published_at is invalid
                const publishedAt = data.published_at
                const isPublishedAtInvalid =
                    !publishedAt ||
                    (typeof publishedAt === 'object' && !publishedAt?.toDate && !publishedAt?.seconds)

                if (isPublishedAtInvalid) {
                    updates.published_at = updates.created_at || Timestamp.fromDate(new Date())
                }

                // Apply fixes
                if (Object.keys(updates).length > 0) {
                    await updateDoc(doc(db, 'listings', docSnap.id), updates)
                    fixedCount++
                    addLog(`✅ Fixed ${docSnap.id}`)
                } else {
                    addLog(`✓ ${docSnap.id} - dates are valid`)
                }
            }

            addLog('')
            addLog(`🎉 Done! Fixed ${fixedCount} listings`)
            setFixed(true)
        } catch (err: any) {
            addLog(`❌ Error: ${err.message}`)
        } finally {
            setIsFixing(false)
        }
    }

    return (
        <div className="min-h-screen bg-slate-900 text-white p-8">
            <h1 className="text-2xl font-bold mb-4">🔧 Fix Listing Data</h1>

            <p className="text-gray-400 mb-4">
                This will fix invalid created_at timestamps in listings collection.
            </p>

            {!fixed && (
                <button
                    onClick={fixListings}
                    disabled={isFixing}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 rounded-xl font-medium mb-6"
                >
                    {isFixing ? 'Fixing...' : 'Fix Data Now'}
                </button>
            )}

            {fixed && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6">
                    <p className="text-green-400 font-medium">✅ Data fixed successfully!</p>
                    <a
                        href="/listing/apple-iphone-iphone-16-256-gb-%E0%B9%80%E0%B8%82%E0%B8%B5%E0%B8%A2%E0%B8%A7-green-m00003"
                        className="text-purple-400 hover:underline mt-2 inline-block"
                    >
                        → Go to listing page to verify
                    </a>
                </div>
            )}

            <div className="bg-slate-800 rounded-xl p-4 font-mono text-sm overflow-auto max-h-[60vh]">
                {logs.length === 0 && <p className="text-gray-500">Logs will appear here...</p>}
                {logs.map((log, i) => (
                    <div key={i} className={log.startsWith('❌') ? 'text-red-400' : log.startsWith('✅') || log.startsWith('🎉') ? 'text-green-400' : 'text-gray-300'}>
                        {log}
                    </div>
                ))}
            </div>
        </div>
    )
}
